import React from 'react';
import { AgentStageInfo } from '../types/startup';
import { 
  Sparkles, 
  Search, 
  TrendingUp, 
  Coins, 
  Award, 
  CheckCircle2, 
  Loader2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface AgentCardProps {
  stage: AgentStageInfo;
  isActive?: boolean;
  compact?: boolean;
  className?: string;
  onClick?: () => void;
}

const AGENT_ICONS = {
  1: Sparkles,
  2: Search,
  3: TrendingUp,
  4: Coins,
  5: Award,
};

export const AgentCard: React.FC<AgentCardProps> = ({
  stage,
  isActive = false,
  compact = false,
  className = '',
  onClick
}) => {
  const IconComponent = AGENT_ICONS[stage.id] || Sparkles;

  const getStatusBadge = () => {
    switch (stage.status) {
      case 'completed':
        return (
          <span id={`agent-${stage.id}-status-badge`} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Completed
          </span>
        );
      case 'running':
        return (
          <span id={`agent-${stage.id}-status-badge`} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            Running
          </span>
        );
      case 'failed':
        return (
          <span id={`agent-${stage.id}-status-badge`} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Failed
          </span>
        );
      default:
        return (
          <span id={`agent-${stage.id}-status-badge`} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <Clock className="w-3 h-3 text-slate-400" />
            Waiting
          </span>
        );
    }
  };

  const getCardBorder = () => {
    if (stage.status === 'running' || isActive) {
      return 'border-blue-500 ring-2 ring-blue-100 bg-white shadow-md';
    }
    if (stage.status === 'completed') {
      return 'border-slate-200 bg-white hover:border-slate-300 shadow-xs';
    }
    if (stage.status === 'failed') {
      return 'border-rose-300 bg-rose-50/40 shadow-xs';
    }
    return 'border-slate-200 bg-slate-50/70 opacity-90';
  };

  if (compact) {
    return (
      <div
        id={`agent-card-compact-${stage.id}`}
        onClick={onClick}
        className={`p-3 rounded-xl border transition-all ${getCardBorder()} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${stage.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
              {stage.number}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-slate-900 truncate">{stage.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{stage.role}</div>
            </div>
          </div>
          <div className="shrink-0">{getStatusBadge()}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`agent-card-${stage.id}`}
      onClick={onClick}
      className={`relative p-5 rounded-xl border transition-all duration-200 ${getCardBorder()} ${className} ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-sm font-extrabold ${
            stage.status === 'completed'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : stage.status === 'running'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-400">STAGE {stage.number}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">{stage.name}</h3>
          </div>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed mb-3">
        {stage.purpose}
      </p>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-600">Output Artifact:</span>
        <span className="font-mono text-[11px] text-slate-500 truncate max-w-[200px]" title={stage.outputDescription}>
          {stage.outputDescription.split(',')[0]}
        </span>
      </div>

      {stage.logMessage && stage.status === 'running' && (
        <div className="mt-3 p-2 rounded-lg bg-blue-50/80 border border-blue-100 text-[11px] font-mono text-blue-700 truncate">
          &gt; {stage.logMessage}
        </div>
      )}

      {stage.errorMessage && stage.status === 'failed' && (
        <div className="mt-3 p-2 rounded-lg bg-rose-50 border border-rose-200 text-[11px] font-mono text-rose-700">
          Error: {stage.errorMessage}
        </div>
      )}
    </div>
  );
};
