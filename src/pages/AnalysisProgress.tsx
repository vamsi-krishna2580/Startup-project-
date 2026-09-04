import React from 'react';
import { AgentStageInfo, AgentStageId } from '../types/startup';
import { ProgressPipeline } from '../components/ProgressPipeline';
import { ArrowLeft } from 'lucide-react';

interface AnalysisProgressProps {
  stages: AgentStageInfo[];
  currentStageId: AgentStageId | null;
  elapsedSeconds: number;
  isLoading: boolean;
  error?: { title: string; message: string; stageId?: AgentStageId } | null;
  idea: string;
  onRetry: () => void;
  onCancel: () => void;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  stages,
  currentStageId,
  elapsedSeconds,
  isLoading,
  error,
  idea,
  onRetry,
  onCancel
}) => {
  return (
    <div id="analysis-progress-page-container" className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between">
        <button
          id="btn-progress-back"
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Idea Input</span>
        </button>

        <span className="text-[11px] font-mono text-slate-400">
          Capstone Orchestrator Pipeline v2.4
        </span>
      </div>

      {/* Target Idea Snippet */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
          Target Startup Concept Under Evaluation
        </span>
        <p className="text-sm font-bold text-slate-800 mt-1 leading-snug">
          "{idea}"
        </p>
      </div>

      {/* Main Orchestration Pipeline Display */}
      <ProgressPipeline
        stages={stages}
        currentStageId={currentStageId}
        elapsedSeconds={elapsedSeconds}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        onCancel={onCancel}
      />
    </div>
  );
};
