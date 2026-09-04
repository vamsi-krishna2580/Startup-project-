import React from 'react';
import { FinancialPlan } from '../types/startup';
import { TrendingUp, AlertCircle, DollarSign, PieChart, ShieldAlert } from 'lucide-react';

interface FinancialChartProps {
  plan: FinancialPlan;
}

export const FinancialChart: React.FC<FinancialChartProps> = ({ plan }) => {
  // Use timeline_projections if provided by backend, else fallback to standard structured values
  const defaultProjections = [
    { year: 'Year 1', revenue: 120000, costs: 280000, label: 'Pilot Phase' },
    { year: 'Year 2', revenue: 550000, costs: 460000, label: 'Break-even' },
    { year: 'Year 3', revenue: 1850000, costs: 980000, label: 'Scaling' },
    { year: 'Year 4', revenue: 4200000, costs: 1900000, label: 'Expansion' },
  ];

  const projections = plan.timeline_projections && plan.timeline_projections.length > 0
    ? plan.timeline_projections.map(p => ({
        year: p.year,
        revenue: p.revenue,
        costs: p.costs,
        label: p.gross_profit > 0 ? 'Profitable' : 'Investment'
      }))
    : defaultProjections;

  const maxVal = Math.max(...projections.map(p => Math.max(p.revenue, p.costs)), 1000000);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  return (
    <div id="financial-planning-charts-container" className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
        <span className="font-semibold">
          AI-generated estimate — for planning purposes only.
        </span>
        <span className="text-amber-800">
          Projections reflect algorithmic sector benchmarks and require CPA/agronomy verification before capital allocation.
        </span>
      </div>

      {/* Chart Container: Revenue vs Costs Projections */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                PROJECTION TRAJECTORY
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                4-YEAR HORIZON
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Projected Annual Revenue vs. Operating Expenses
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-blue-600"></span>
              <span className="text-slate-700 font-semibold">Projected Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-slate-300"></span>
              <span className="text-slate-600">Operating Costs</span>
            </div>
          </div>
        </div>

        {/* SVG/CSS Bar Chart Grid */}
        <div className="space-y-6 pt-2">
          {projections.map((item, idx) => {
            const revPercent = Math.min(100, Math.round((item.revenue / maxVal) * 100));
            const costPercent = Math.min(100, Math.round((item.costs / maxVal) * 100));
            const isProfitable = item.revenue > item.costs;

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800">{item.year}</span>
                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${isProfitable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-blue-700 font-bold">Rev: {formatCurrency(item.revenue)}</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-600">Cost: {formatCurrency(item.costs)}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  {/* Revenue Bar */}
                  <div className="h-4 w-full bg-slate-100 rounded-md overflow-hidden flex items-center">
                    <div
                      className="h-full bg-blue-600 rounded-md transition-all duration-700 flex items-center justify-end pr-2 text-[10px] font-mono text-white font-semibold"
                      style={{ width: `${Math.max(revPercent, 4)}%` }}
                    >
                      {revPercent > 18 ? formatCurrency(item.revenue) : ''}
                    </div>
                  </div>
                  {/* Costs Bar */}
                  <div className="h-3 w-full bg-slate-100 rounded-md overflow-hidden flex items-center">
                    <div
                      className="h-full bg-slate-400 rounded-md transition-all duration-700"
                      style={{ width: `${Math.max(costPercent, 3)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Break-even Indicator Card */}
        <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Break-even Point</span>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">{plan.break_even_estimate}</div>
          </div>
          <div>
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Total Seed Capital Required</span>
            <div className="text-sm font-extrabold text-blue-700 mt-0.5">{plan.funding_required}</div>
          </div>
          <div>
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Target Profitability</span>
            <div className="text-sm font-extrabold text-emerald-700 mt-0.5">{plan.profitability_potential}</div>
          </div>
        </div>
      </div>

      {/* Funding Allocation Breakdown Card */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <PieChart className="w-4 h-4 text-indigo-600" />
          <h4 className="text-sm font-bold text-slate-900">Capital Deployment & Funding Utilization</h4>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {plan.funding_utilization}
        </p>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Identified Financial & Cashflow Risks:
          </div>
          <ul className="space-y-2">
            {plan.financial_risks.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
