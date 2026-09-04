import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Search, 
  TrendingUp, 
  Coins, 
  Award, 
  Code, 
  ArrowLeft, 
  PlusCircle, 
  Download, 
  Copy,
  Check
} from 'lucide-react';
import { copyToClipboard } from '../utils/formatters';

export type ResultSectionId = 
  | 'overview'
  | 'startup-analysis'
  | 'market-research'
  | 'business-strategy'
  | 'financial-plan'
  | 'investment-report'
  | 'structured-json';

interface SidebarProps {
  activeSection: ResultSectionId;
  onSelectSection: (section: ResultSectionId) => void;
  onBackToAnalysis: () => void;
  onNewStartup: () => void;
  onExportReport: () => void;
  jsonString: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  onBackToAnalysis,
  onNewStartup,
  onExportReport,
  jsonString
}) => {
  const [copied, setCopied] = React.useState(false);

  const sections = [
    { id: 'overview' as ResultSectionId, label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'startup-analysis' as ResultSectionId, label: '01 Startup Analysis', icon: Sparkles },
    { id: 'market-research' as ResultSectionId, label: '02 Market Research', icon: Search },
    { id: 'business-strategy' as ResultSectionId, label: '03 Business Strategy', icon: TrendingUp },
    { id: 'financial-plan' as ResultSectionId, label: '04 Financial Plan', icon: Coins },
    { id: 'investment-report' as ResultSectionId, label: '05 Investment Report', icon: Award },
    { id: 'structured-json' as ResultSectionId, label: 'Structured Report (JSON)', icon: Code },
  ];

  const handleCopyJson = async () => {
    const ok = await copyToClipboard(jsonString);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <aside id="results-sidebar" className="w-full lg:w-64 shrink-0 space-y-4">
      {/* Navigation Sections List */}
      <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
          REPORT NAVIGATION
        </div>
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              id={`sidebar-section-${sec.id}`}
              onClick={() => onSelectSection(sec.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="truncate">{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Actions Card */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
        <div className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
          REPORT ACTIONS
        </div>

        <button
          id="btn-sidebar-export-report"
          onClick={onExportReport}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Report (PDF)</span>
          </span>
        </button>

        <button
          id="btn-sidebar-copy-json"
          onClick={handleCopyJson}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
          </span>
        </button>

        <div className="pt-2 border-t border-slate-100 space-y-2">
          <button
            id="btn-sidebar-back-to-analysis"
            onClick={onBackToAnalysis}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Analysis</span>
          </button>

          <button
            id="btn-sidebar-new-startup"
            onClick={onNewStartup}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Startup Idea</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
