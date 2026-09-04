import React from 'react';
import { CompetitorDetail } from '../types/startup';
import { Shield, Check, X, AlertCircle } from 'lucide-react';

interface CompetitorTableProps {
  competitors: string[] | CompetitorDetail[];
}

export const CompetitorTable: React.FC<CompetitorTableProps> = ({ competitors }) => {
  // Normalize string[] or CompetitorDetail[]
  const normalizedCompetitors: CompetitorDetail[] = competitors.map((c, i) => {
    if (typeof c === 'string') {
      return {
        name: c,
        focus: 'Direct or indirect alternative solution in sector',
        advantage: 'Established presence / baseline customer relationship',
        disadvantage: 'Higher latency, manual overhead or high cost barrier'
      };
    }
    return c;
  });

  return (
    <div id="competitor-comparison-table-wrapper" className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">BENCHMARK MATRIX</span>
          <h3 className="text-base font-bold text-slate-900">Competitor Landscape & Defensibility</h3>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>AI-synthesized competitive overview</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Entity / Competitor</th>
              <th className="py-3 px-4">Strategic Focus</th>
              <th className="py-3 px-4 text-emerald-700">Competitor Advantage</th>
              <th className="py-3 px-4 text-slate-700">Vulnerability / Your Moat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {normalizedCompetitors.map((comp, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                    {comp.name}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-600 leading-relaxed max-w-xs">
                  {comp.focus}
                </td>
                <td className="py-3.5 px-4 text-slate-700 leading-relaxed max-w-xs">
                  <div className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{comp.advantage}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-700 leading-relaxed max-w-xs">
                  <div className="flex items-start gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-slate-600">{comp.disadvantage}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
