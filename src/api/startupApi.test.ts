import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  analyzeStartup,
  ApiRequestCancelledError,
  ApiServerError,
  getApiSettings,
  healthCheck,
} from './startupApi';
import { MOCK_BENCHMARK_REPORT } from './mockStartupData';

const storage = new Map<string, string>();

beforeEach(() => {
  storage.clear();
  vi.restoreAllMocks();
  vi.stubGlobal('window', globalThis);
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  });
});

describe('startup API client', () => {
  it('uses a presentation-safe default timeout', () => {
    expect(getApiSettings().timeoutMs).toBe(180000);
  });

  it('accepts a valid backend report', async () => {
    storage.set('ai_startup_validator_api_mode', 'api');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ...MOCK_BENCHMARK_REPORT, source: 'api' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ));

    const report = await analyzeStartup({ idea: 'A sufficiently detailed startup concept' });

    expect(report.source).toBe('api');
    expect(report.startup_analysis).toBeTruthy();
    expect(report.investment_report).toBeTruthy();
  });

  it('preserves an honest backend fallback source label', async () => {
    storage.set('ai_startup_validator_api_mode', 'api');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ...MOCK_BENCHMARK_REPORT, source: 'api-fallback' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ));

    const report = await analyzeStartup({ idea: 'A sufficiently detailed startup concept' });

    expect(report.source).toBe('api-fallback');
  });

  it('preserves useful backend error messages in strict API mode', async () => {
    storage.set('ai_startup_validator_api_mode', 'api');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ detail: { message: 'Gemini timed out after 90 seconds.' } }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }),
    ));

    await expect(analyzeStartup({ idea: 'A sufficiently detailed startup concept' }))
      .rejects.toEqual(expect.objectContaining<ApiServerError>({
        name: 'ApiServerError',
        status: 502,
        message: 'Gemini timed out after 90 seconds.',
      }));
  });

  it('cancels an in-flight request without falling back to demo data', async () => {
    storage.set('ai_startup_validator_api_mode', 'auto');
    vi.stubGlobal('fetch', vi.fn((_url: string, init?: RequestInit) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    })));
    const controller = new AbortController();
    const pending = analyzeStartup(
      { idea: 'A sufficiently detailed startup concept' },
      undefined,
      controller.signal,
    );

    controller.abort();

    await expect(pending).rejects.toBeInstanceOf(ApiRequestCancelledError);
  });

  it('checks backend health successfully', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ));

    await expect(healthCheck('http://localhost:8000')).resolves.toEqual(
      expect.objectContaining({ status: 'ok', url: 'http://localhost:8000' }),
    );
  });
});
