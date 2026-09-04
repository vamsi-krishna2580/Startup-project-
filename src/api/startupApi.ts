import {
  AnalyzeStartupRequest,
  StartupReport,
  AgentStageId
} from '../types/startup';
import { DEMO_CROP_DRONE_REPORT, generateSyntheticReport } from './mockStartupData';

/**
 * Configuration for the Backend API connection.
 */
export interface ApiSettings {
  baseUrl: string;
  mode: 'auto' | 'api' | 'demo';
  timeoutMs: number;
}

const STORAGE_KEY_API_URL = 'ai_startup_validator_api_url';
const STORAGE_KEY_API_MODE = 'ai_startup_validator_api_mode';

export function getApiSettings(): ApiSettings {
  const envUrl = (import.meta.env.VITE_API_BASE_URL as string) || '';
  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_API_URL) : null;
  const storedMode = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_API_MODE) as 'auto' | 'api' | 'demo' : null;

  const configuredTimeout = Number(import.meta.env.VITE_API_TIMEOUT_MS || 180000);
  return {
    baseUrl: storedUrl !== null ? storedUrl : (envUrl || 'http://localhost:8000'),
    mode: storedMode || (envUrl ? 'api' : 'auto'),
    timeoutMs: Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? configuredTimeout : 180000
  };
}

export function saveApiSettings(settings: Partial<ApiSettings>): void {
  if (typeof window === 'undefined') return;
  if (settings.baseUrl !== undefined) {
    localStorage.setItem(STORAGE_KEY_API_URL, settings.baseUrl);
  }
  if (settings.mode !== undefined) {
    localStorage.setItem(STORAGE_KEY_API_MODE, settings.mode);
  }
}

/**
 * Custom Error Classes for strict failure reporting
 */
export class ApiConnectionError extends Error {
  constructor(message = 'Unable to connect to the analysis service.') {
    super(message);
    this.name = 'ApiConnectionError';
  }
}

export class ApiTimeoutError extends Error {
  constructor(message = 'The analysis is taking longer than expected.') {
    super(message);
    this.name = 'ApiTimeoutError';
  }
}

export class ApiMalformedResponseError extends Error {
  constructor(message = 'The analysis service returned an invalid report.') {
    super(message);
    this.name = 'ApiMalformedResponseError';
  }
}

export class AgentExecutionError extends Error {
  stageId: AgentStageId;
  agentName: string;
  constructor(stageId: AgentStageId, agentName: string, message: string) {
    super(`${agentName} failed: ${message}`);
    this.name = 'AgentExecutionError';
    this.stageId = stageId;
    this.agentName = agentName;
  }
}

export class ApiServerError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiServerError';
    this.status = status;
  }
}

export class ApiRequestCancelledError extends Error {
  constructor(message = 'Analysis cancelled.') {
    super(message);
    this.name = 'ApiRequestCancelledError';
  }
}

/**
 * Health check to verify FastAPI backend availability.
 */
export async function healthCheck(customUrl?: string): Promise<{ status: string; url: string; latencyMs: number }> {
  const settings = getApiSettings();
  const targetUrl = (customUrl !== undefined ? customUrl : settings.baseUrl).replace(/\/$/, '');
  const start = performance.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${targetUrl}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    }).catch(async () => {
      // Fallback probe to root or /health
      return await fetch(`${targetUrl}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
    });

    clearTimeout(timeout);
    const latencyMs = Math.round(performance.now() - start);

    if (res.ok) {
      const data = await res.json().catch(() => ({ status: 'ok' }));
      return { status: data.status || 'ok', url: targetUrl, latencyMs };
    } else {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Connection refused';
    throw new ApiConnectionError(`Cannot reach backend at ${targetUrl}: ${message}`);
  }
}

/**
 * Validates that an incoming object has the required multi-agent report structure.
 */
function validateReportSchema(data: unknown): data is StartupReport {
  if (!data || typeof data !== 'object') return false;
  const rep = data as Partial<StartupReport>;
  return Boolean(
    typeof rep.idea === 'string' &&
    rep.startup_analysis &&
    rep.market_research &&
    rep.business_strategy &&
    rep.financial_plan &&
    rep.investment_report
  );
}

/**
 * Primary multi-agent analysis invocation.
 *
 * Communicates with the FastAPI backend endpoint:
 * POST /api/startup/analyze
 *
 * If backend is unreachable in 'auto' or 'demo' mode, provides clearly labeled demo simulation.
 * In strict 'api' mode, throws an error so the user is informed without silent fallback.
 */
export async function analyzeStartup(
  request: AnalyzeStartupRequest,
  onProgress?: (stage: AgentStageId, message: string) => void,
  externalSignal?: AbortSignal
): Promise<StartupReport> {
  const settings = getApiSettings();
  const baseUrl = settings.baseUrl.replace(/\/$/, '');

  // If user explicitly configured Demo mode
  if (settings.mode === 'demo') {
    return runSimulatedPipeline(request, onProgress, 'demo');
  }

  // Attempt real API call to FastAPI backend
  const controller = new AbortController();
  let timedOut = false;
  const abortFromCaller = () => controller.abort();
  if (externalSignal?.aborted) {
    throw new ApiRequestCancelledError();
  }
  externalSignal?.addEventListener('abort', abortFromCaller, { once: true });
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, settings.timeoutMs);

  try {

    // Initial notification for stage 1
    onProgress?.(1, 'Connecting to FastAPI Orchestrator...');

    const response = await fetch(`${baseUrl}/api/startup/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        idea: request.idea,
        industry: request.industry || null,
        target_customer: request.target_customer || null,
        region: request.region || null,
        stage: request.stage || null,
        budget: request.budget || null
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      if (response.status === 504 || response.status === 408) {
        throw new ApiTimeoutError();
      }
      const errorBody = await response.json().catch(() => null) as { detail?: string | { message?: string } } | null;
      const detail = errorBody?.detail;
      const message = typeof detail === 'string' ? detail : detail?.message;
      throw new ApiServerError(
        response.status,
        message || `Backend returned status ${response.status}: ${response.statusText}`
      );
    }

    const json = await response.json();

    if (!validateReportSchema(json)) {
      throw new ApiMalformedResponseError(
        'The backend response is missing required agent blocks (startup_analysis, market_research, business_strategy, financial_plan, or investment_report).'
      );
    }

    // Mark as verified API source
    const finalReport: StartupReport = {
      ...json,
      id: json.id || `api-${Date.now()}`,
      created_at: json.created_at || new Date().toISOString(),
      source: 'api'
    };

    return finalReport;

  } catch (err: unknown) {
    console.warn('API execution notice:', err);

    if (externalSignal?.aborted) {
      throw new ApiRequestCancelledError();
    }
    if (timedOut || (err as { name?: string }).name === 'AbortError') {
      throw new ApiTimeoutError(
        `The analysis service timed out after ${Math.round(settings.timeoutMs / 1000)} seconds.`
      );
    }

    // If configured in strict API mode, do NOT disguise the error!
    if (settings.mode === 'api') {
      if (err instanceof ApiTimeoutError || err instanceof ApiMalformedResponseError || err instanceof ApiServerError) {
        throw err;
      }
      throw new ApiConnectionError(
        `Unable to connect to the analysis service at ${baseUrl}. Ensure your FastAPI server is running with CORS enabled (e.g. uvicorn main:app --reload --port 8000).`
      );
    }

    // In 'auto' mode: warn clearly and fall back to the demo/benchmark mock engine
    console.info('Auto mode: Backend unreachable. Running isolated demonstration mock engine.');
    return runSimulatedPipeline(request, onProgress, 'demo-fallback');
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener('abort', abortFromCaller);
  }
}

/**
 * Isolated simulation runner for development & college presentation demo mode.
 * Walks through the 5 agents sequentially with realistic handoff delays.
 */
async function runSimulatedPipeline(
  request: AnalyzeStartupRequest,
  onProgress?: (stage: AgentStageId, message: string) => void,
  sourceMode: 'demo' | 'demo-fallback' = 'demo'
): Promise<StartupReport> {
  const stages: Array<{ id: AgentStageId; log: string; delayMs: number }> = [
    { id: 1, log: 'Startup Analyst: Evaluating concept validity, problem-solution fit & core innovation...', delayMs: 1100 },
    { id: 2, log: 'Market Research: Ingesting market sizing (TAM/SAM/SOM), customer pain points & competitor matrix...', delayMs: 1200 },
    { id: 3, log: 'Business Strategy: Synthesizing 9-block Business Model Canvas, pricing tiers & GTM strategy...', delayMs: 1100 },
    { id: 4, log: 'Financial Planning: Computing capital requirements, unit economics, runway & break-even horizons...', delayMs: 1100 },
    { id: 5, log: 'Investment Advisor: Generating 4-quadrant SWOT, pitch deck blueprint & investment readiness score...', delayMs: 1000 },
  ];

  for (const stage of stages) {
    onProgress?.(stage.id, stage.log);
    await new Promise((res) => setTimeout(res, stage.delayMs));
  }

  // If the idea matches or references the drone crop disease demo, use the capstone reference dataset
  const isCropDroneDemo = request.idea.toLowerCase().includes('crop') ||
                         request.idea.toLowerCase().includes('drone') ||
                         request.idea.toLowerCase().includes('disease');

  let report: StartupReport;
  if (isCropDroneDemo) {
    report = {
      ...DEMO_CROP_DRONE_REPORT,
      idea: request.idea,
      source: sourceMode,
      created_at: new Date().toISOString()
    };
  } else {
    report = generateSyntheticReport(request.idea, {
      industry: request.industry,
      target_customer: request.target_customer,
      region: request.region,
      stage: request.stage,
      budget: request.budget
    });
    report.source = sourceMode;
  }

  return report;
}

/**
 * Fetch a past analysis by ID (ready for future database/FastAPI endpoint).
 */
export async function getAnalysis(id: string): Promise<StartupReport | null> {
  const settings = getApiSettings();
  if (settings.mode === 'api') {
    const res = await fetch(`${settings.baseUrl.replace(/\/$/, '')}/api/startup/${id}`);
    if (!res.ok) return null;
    return await res.json();
  }
  return null;
}
