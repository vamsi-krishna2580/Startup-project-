import { useState, useEffect, useRef, useCallback } from 'react';
import {
  StartupReport,
  AnalyzeStartupRequest,
  AgentStageInfo,
  AgentStageId,
  AnalysisHistoryItem
} from '../types/startup';
import { analyzeStartup } from '../api/startupApi';
import { MOCK_BENCHMARK_REPORT } from '../api/mockStartupData';
import { INITIAL_AGENT_STAGES } from '../utils/formatters';

const STORAGE_KEY_HISTORY = 'ai_startup_validator_history';

export function useStartupAnalysis() {
  const [report, setReport] = useState<StartupReport | null>(null);
  const [stages, setStages] = useState<AgentStageInfo[]>(INITIAL_AGENT_STAGES);
  const [currentStageId, setCurrentStageId] = useState<AgentStageId | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [error, setError] = useState<{ title: string; message: string; stageId?: AgentStageId } | null>(null);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load history from storage', e);
    }
  }, []);

  // Save report to history
  const saveToHistory = useCallback((newReport: StartupReport) => {
    try {
      const item: AnalysisHistoryItem = {
        id: newReport.id || `hist-${Date.now()}`,
        idea: newReport.idea,
        opportunity_score: newReport.startup_analysis.opportunity_score,
        investment_readiness_score: newReport.investment_report.investment_readiness_score,
        verdict: newReport.startup_analysis.verdict,
        funding_stage: newReport.investment_report.recommended_funding_stage,
        date: newReport.created_at || new Date().toISOString(),
        report: newReport
      };

      setHistory(prev => {
        const filtered = prev.filter(h => h.id !== item.id && h.idea !== item.idea);
        const updated = [item, ...filtered].slice(0, 20); // Keep last 20
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.warn('Failed to save analysis to history', e);
    }
  }, []);

  // Timer runner
  useEffect(() => {
    if (isLoading) {
      setElapsedSeconds(0);
      timerRef.current = setInterval(() => {
        setElapsedSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading]);

  // Execute Analysis
  const executeAnalysis = useCallback(async (request: AnalyzeStartupRequest) => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    setCurrentStageId(1);

    // Reset stages
    setStages(prev =>
      prev.map(s => ({
        ...s,
        status: s.id === 1 ? 'running' : 'waiting',
        startedAt: s.id === 1 ? Date.now() : undefined,
        completedAt: undefined,
        errorMessage: undefined,
        logMessage: undefined
      }))
    );

    try {
      const result = await analyzeStartup(request, (stageId: AgentStageId, message: string) => {
        setCurrentStageId(stageId);
        setStages(prev =>
          prev.map(s => {
            if (s.id < stageId) {
              return { ...s, status: 'completed', completedAt: s.completedAt || Date.now() };
            } else if (s.id === stageId) {
              return { ...s, status: 'running', logMessage: message, startedAt: s.startedAt || Date.now() };
            } else {
              return { ...s, status: 'waiting' };
            }
          })
        );
      });

      // Mark all completed
      setStages(prev =>
        prev.map(s => ({
          ...s,
          status: 'completed',
          completedAt: s.completedAt || Date.now()
        }))
      );

      setReport(result);
      saveToHistory(result);
      setIsLoading(false);
      setCurrentStageId(null);
      return result;
    } catch (err: unknown) {
      setIsLoading(false);
      const errObj = err instanceof Error ? err : new Error(String(err));
      
      let title = 'Analysis Failed';
      if (errObj.name === 'ApiConnectionError') {
        title = 'Backend Service Unavailable';
      } else if (errObj.name === 'ApiTimeoutError') {
        title = 'Analysis Request Timed Out';
      } else if (errObj.name === 'ApiMalformedResponseError') {
        title = 'Malformed Backend Response';
      }

      setError({
        title,
        message: errObj.message,
        stageId: currentStageId || 1
      });

      // Mark current stage failed
      setStages(prev =>
        prev.map(s => {
          if (s.id === (currentStageId || 1)) {
            return { ...s, status: 'failed', errorMessage: errObj.message };
          }
          return s;
        })
      );

      throw err;
    }
  }, [currentStageId, saveToHistory]);

  const loadReportDirectly = useCallback((existingReport: StartupReport) => {
    setReport(existingReport);
    setIsLoading(false);
    setError(null);
    setStages(prev => prev.map(s => ({ ...s, status: 'completed' })));
  }, []);

  const clearReport = useCallback(() => {
    setReport(null);
    setIsLoading(false);
    setError(null);
    setStages(INITIAL_AGENT_STAGES);
    setCurrentStageId(null);
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(h => h.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage error', e);
      }
      return updated;
    });
  }, []);

  const clearAllHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, []);

  const loadBenchmarkDemo = useCallback(() => {
    loadReportDirectly(MOCK_BENCHMARK_REPORT);
  }, [loadReportDirectly]);

  const loadFromHistory = useCallback((id: string) => {
    const item = history.find(h => h.id === id);
    if (item) {
      loadReportDirectly(item.report);
    }
  }, [history, loadReportDirectly]);

  return {
    report,
    currentReport: report,
    stages,
    currentStageId,
    isLoading,
    elapsedSeconds,
    error,
    history,
    executeAnalysis,
    startAnalysis: executeAnalysis,
    loadReportDirectly,
    loadBenchmarkDemo,
    loadFromHistory,
    clearReport,
    resetAnalysis: clearReport,
    deleteHistoryItem,
    deleteFromHistory: deleteHistoryItem,
    clearAllHistory,
    clearHistory: clearAllHistory
  };
}
