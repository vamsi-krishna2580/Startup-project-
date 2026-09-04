import React from 'react';
import { getScoreColor } from '../utils/formatters';
import { Award, TrendingUp, ShieldCheck, Target, Sparkles } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  label: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  showBenchmark?: boolean;
  benchmarkText?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  label,
  sublabel,
  size = 'md',
  showBenchmark = false,
  benchmarkText
}) => {
  const boundedScore = Math.max(0, Math.min(100, Math.round(score)));
  const colors = getScoreColor(boundedScore);

  // SVG Gauge calculations
  const radius = size === 'lg' ? 44 : size === 'md' ? 36 : 28;
  const stroke = size === 'lg' ? 8 : size === 'md' ? 6 : 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (boundedScore / 100) * circumference;
  const dimension = (radius + stroke) * 2 + 4;

  return (
    <div id={`score-gauge-${label.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="relative shrink-0 flex items-center justify-center">
        <svg width={dimension} height={dimension} className="transform -rotate-90">
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            className="stroke-slate-100"
            strokeWidth={stroke}
            fill="transparent"
          />
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            className={`${colors.ring} transition-all duration-1000 ease-out`}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-mono font-extrabold tracking-tight ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-base'} text-slate-900`}>
            {boundedScore}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">/ 100</span>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</h4>
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${colors.badge}`}>
            {boundedScore >= 80 ? 'Exceptional' : boundedScore >= 70 ? 'Strong' : boundedScore >= 55 ? 'Moderate' : 'High Risk'}
          </span>
        </div>
        {sublabel && (
          <p className="text-sm font-semibold text-slate-800 mt-0.5 leading-snug">{sublabel}</p>
        )}
        {showBenchmark && benchmarkText && (
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            {benchmarkText}
          </p>
        )}
      </div>
    </div>
  );
};

interface MetricBannerProps {
  opportunityScore: number;
  investmentScore: number;
  verdict: string;
  fundingStage: string;
  ideaSnippet: string;
}

export const MetricBanner: React.FC<MetricBannerProps> = ({
  opportunityScore,
  investmentScore,
  verdict,
  fundingStage,
  ideaSnippet
}) => {
  const oppColor = getScoreColor(opportunityScore);
  const invColor = getScoreColor(investmentScore);

  return (
    <div id="results-metric-banner" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
              VALIDATION REPORT
            </span>
            <span className="text-xs text-slate-400 font-mono">5/5 AGENTS SYNTHESIZED</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {ideaSnippet}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Recommended Stage</div>
            <div className="text-sm font-extrabold text-slate-800 font-mono flex items-center gap-1.5 mt-0.5">
              <Award className="w-4 h-4 text-indigo-600" />
              {fundingStage}
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Validation Verdict</div>
            <div className="text-sm font-extrabold text-slate-900 truncate max-w-xs mt-0.5" title={verdict}>
              {verdict.split('—')[0] || verdict}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Score Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
        <ScoreGauge
          score={opportunityScore}
          label="Opportunity Score"
          sublabel="Market & Problem-Solution Fit"
          showBenchmark
          benchmarkText="Top 20% of Capstone benchmark"
        />

        <ScoreGauge
          score={investmentScore}
          label="Investment Readiness"
          sublabel="Venture Capital Feasibility"
          showBenchmark
          benchmarkText="Suitable for Seed syndicate"
        />

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Defensibility</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-lg font-bold text-slate-900">Moderate to High</div>
            <p className="text-xs text-slate-500 mt-0.5">Proprietary dataset & channel integration lock-in</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Gross Margin Profile</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="text-lg font-bold text-slate-900">75% – 82%</div>
            <p className="text-xs text-slate-500 mt-0.5">SaaS leverage after sensor amortization</p>
          </div>
        </div>
      </div>
    </div>
  );
};
