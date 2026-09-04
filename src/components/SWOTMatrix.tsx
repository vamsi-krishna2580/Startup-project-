import React from 'react';
import { SWOTAnalysis } from '../types/startup';
import { ShieldCheck, AlertTriangle, Lightbulb, Zap } from 'lucide-react';

interface SWOTMatrixProps {
  swot: SWOTAnalysis;
}

export const SWOTMatrix: React.FC<SWOTMatrixProps> = ({ swot }) => {
  return (
    <div id="swot-analysis-matrix" className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">STRATEGIC MATRIX</span>
          <h3 className="text-base font-bold text-slate-900">4-Quadrant SWOT Synthesis</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Agent 05 Investment Advisor</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {/* Quadrant 1: Strengths */}
        <div className="p-6 bg-white hover:bg-slate-50/40 transition-colors">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider">INTERNAL • HELPFUL</span>
              <h4 className="text-sm font-extrabold text-slate-900">Strengths (Core Assets)</h4>
            </div>
          </div>
          <ul className="space-y-2.5">
            {swot.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quadrant 2: Weaknesses */}
        <div className="p-6 bg-white hover:bg-slate-50/40 transition-colors">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-amber-700 uppercase tracking-wider">INTERNAL • HARMFUL</span>
              <h4 className="text-sm font-extrabold text-slate-900">Weaknesses (Vulnerabilities)</h4>
            </div>
          </div>
          <ul className="space-y-2.5">
            {swot.weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quadrant 3: Opportunities */}
        <div className="p-6 bg-white border-t border-slate-200 hover:bg-slate-50/40 transition-colors">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-blue-700 uppercase tracking-wider">EXTERNAL • HELPFUL</span>
              <h4 className="text-sm font-extrabold text-slate-900">Opportunities (Tailwinds)</h4>
            </div>
          </div>
          <ul className="space-y-2.5">
            {swot.opportunities.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quadrant 4: Threats */}
        <div className="p-6 bg-white border-t border-slate-200 hover:bg-slate-50/40 transition-colors">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-rose-700 uppercase tracking-wider">EXTERNAL • HARMFUL</span>
              <h4 className="text-sm font-extrabold text-slate-900">Threats (External Headwinds)</h4>
            </div>
          </div>
          <ul className="space-y-2.5">
            {swot.threats.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
