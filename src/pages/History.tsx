import React from 'react';
import { HistoryItem } from '../types/startup';
import { formatDate, getScoreBadgeClass } from '../utils/formatters';
import { 
  History as HistoryIcon, 
  Trash2, 
  ArrowRight, 
  FileText, 
  Download, 
  PlusCircle, 
  Calendar,
  AlertCircle
} from 'lucide-react';

interface HistoryProps {
  items: HistoryItem[];
  onSelectReport: (reportId: string) => void;
  onDeleteReport: (reportId: string) => void;
  onClearAll: () => void;
  onNewAnalysis: () => void;
}

export const History: React.FC<HistoryProps> = ({
  items,
  onSelectReport,
  onDeleteReport,
  onClearAll,
  onNewAnalysis
}) => {
  return (
    <div id="history-page-container" className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HistoryIcon className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Analysis History & Archive
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Previously validated startup concepts stored locally in your browser session
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {items.length > 0 && (
            <button
              id="btn-clear-all-history"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all archived analyses?')) {
                  onClearAll();
                }
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
            >
              Clear Archive
            </button>
          )}

          <button
            id="btn-new-analysis-from-history"
            onClick={onNewAnalysis}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* History List or Empty State */}
      {items.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 bg-white space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">No Past Analyses Recorded</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Run your first multi-agent validation to generate a permanent executive dossier.
            </p>
          </div>
          <button
            onClick={onNewAnalysis}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            Start Startup Validation
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const oppScore = item.report.startup_analysis.opportunity_score;
            const invScore = item.report.investment_report.investment_readiness_score;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(item.createdAt)}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {item.status.toUpperCase()}
                    </span>
                    {item.report.industry && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 text-slate-600">
                        {item.report.industry}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {item.idea}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 text-[11px]">Opportunity:</span>
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${getScoreBadgeClass(oppScore)}`}>
                        {oppScore}/100
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 text-[11px]">Readiness:</span>
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${getScoreBadgeClass(invScore)}`}>
                        {invScore}/100
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 truncate max-w-xs">
                      {item.report.investment_report.final_verdict}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onSelectReport(item.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>View Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteReport(item.id)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-400 transition-colors cursor-pointer"
                    title="Delete this record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
