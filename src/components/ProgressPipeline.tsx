import React from 'react';
import { AgentStageInfo, AgentStageId } from '../types/startup';
import { AgentCard } from './AgentCard';
import { 
  CheckCircle2, 
  Loader2, 
  Clock, 
  ArrowRight, 
  Terminal, 
  ShieldAlert, 
  Zap 
} from 'lucide-react';

interface ProgressPipelineProps {
  stages: AgentStageInfo[];
  currentStageId: AgentStageId | null;
  elapsedSeconds: number;
  isLoading: boolean;
  error?: { title: string; message: string; stageId?: AgentStageId } | null;
  onRetry?: () => void;
  onCancel?: () => void;
}

export const ProgressPipeline: React.FC<ProgressPipelineProps> = ({
  stages,
  currentStageId,
  elapsedSeconds,
  isLoading,
  error,
  onRetry,
  onCancel
}) => {
  // Compute overall progress percentage
  const completedCount = stages.filter(s => s.status === 'completed').length;
  const runningCount = stages.filter(s => s.status === 'running').length;
  const progressPct = Math.min(100, Math.round(((completedCount + (runningCount ? 0.5 : 0)) / stages.length) * 100));

  const currentAgent = stages.find(s => s.id === currentStageId) || stages[0];

  return (
    <div id="multi-agent-progress-container" className="max-w-4xl mx-auto space-y-6">
      {/* Telemetry Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-blue-700">
                MULTI-AGENT ORCHESTRATION ACTIVE
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Sequential Intelligence Pipeline
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-right">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Elapsed Time</div>
              <div className="font-mono text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {Math.floor(elapsedSeconds / 60).toString().padStart(2, '0')}:{(elapsedSeconds % 60).toString().padStart(2, '0')}s
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-right">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Overall Progress</div>
              <div className="font-mono text-sm font-extrabold text-blue-700 mt-0.5">
                {progressPct}%
              </div>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="mt-5">
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
            <span>START: Idea Ingestion</span>
            <span>STAGE {currentAgent.number}: {currentAgent.name}</span>
            <span>COMPLETE: Consolidated Report</span>
          </div>
        </div>

        {/* Live Orchestrator Telemetry Feed */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              Agent Handoff Event Log
            </span>
            <span className="text-[10px] text-slate-400">FastAPI Orchestrator Protocol v1.4</span>
          </div>
          <div className="space-y-1.5">
            {stages.map(s => {
              if (s.status === 'completed') {
                return (
                  <div key={s.id} className="flex items-center gap-2 text-emerald-400 text-[11px]">
                    <span className="text-slate-500">[{s.number}]</span>
                    <span>✓ {s.name}: Schema enriched & handed off to next agent.</span>
                  </div>
                );
              }
              if (s.status === 'running') {
                return (
                  <div key={s.id} className="flex items-center gap-2 text-blue-300 text-[11px] animate-pulse">
                    <span className="text-blue-400">[{s.number}]</span>
                    <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                    <span>{s.logMessage || `Active reasoning: synthesizing ${s.role}...`}</span>
                  </div>
                );
              }
              if (s.status === 'failed') {
                return (
                  <div key={s.id} className="flex items-center gap-2 text-rose-400 text-[11px]">
                    <span className="text-rose-500">[{s.number}]</span>
                    <span>✗ {s.name} halted: {s.errorMessage || 'Execution error'}</span>
                  </div>
                );
              }
              return (
                <div key={s.id} className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <span>[{s.number}]</span>
                  <span>○ {s.name}: Waiting for upstream input dependencies...</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error state card if analysis failed */}
      {error && (
        <div id="analysis-error-banner" className="p-6 rounded-2xl bg-rose-50 border border-rose-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-rose-900">{error.title}</h3>
              <p className="text-sm text-rose-700 mt-1 leading-relaxed">{error.message}</p>
              <div className="flex items-center gap-3 mt-4">
                {onRetry && (
                  <button
                    id="btn-retry-analysis"
                    onClick={onRetry}
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Retry Analysis
                  </button>
                )}
                {onCancel && (
                  <button
                    id="btn-cancel-return-home"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Return to Idea Input
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Five Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {stages.map((stage) => (
          <AgentCard
            key={stage.id}
            stage={stage}
            isActive={stage.id === currentStageId}
            className="h-full"
          />
        ))}
      </div>
    </div>
  );
};
