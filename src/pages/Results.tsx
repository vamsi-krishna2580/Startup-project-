import React, { useState } from 'react';
import { StartupReport } from '../types/startup';
import { Sidebar, ResultSectionId } from '../components/Sidebar';
import { MetricBanner, ScoreGauge } from '../components/ScoreCard';
import { ReportSection } from '../components/ReportSection';
import { SWOTMatrix } from '../components/SWOTMatrix';
import { CompetitorTable } from '../components/CompetitorTable';
import { BusinessModelCanvas } from '../components/BusinessModelCanvas';
import { FinancialChart } from '../components/FinancialChart';
import { JsonViewer } from '../components/JsonViewer';
import { PdfExportPreviewModal } from '../components/PdfExportPreviewModal';
import { 
  Sparkles, 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  ShieldAlert, 
  DollarSign, 
  FileText, 
  Users, 
  Target, 
  Compass, 
  Layers, 
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface ResultsProps {
  report: StartupReport;
  onBackToAnalysis: () => void;
  onNewStartup: () => void;
}

export const Results: React.FC<ResultsProps> = ({
  report,
  onBackToAnalysis,
  onNewStartup
}) => {
  const [activeSection, setActiveSection] = useState<ResultSectionId>('overview');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const jsonString = JSON.stringify(report, null, 2);

  return (
    <div id="results-dashboard-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Metric Overview */}
      <MetricBanner
        opportunityScore={report.startup_analysis.opportunity_score}
        investmentScore={report.investment_report.investment_readiness_score}
        verdict={report.startup_analysis.verdict}
        fundingStage={report.investment_report.recommended_funding_stage}
        ideaSnippet={report.idea}
      />

      {/* Main Dashboard Layout: Left Sidebar + Content Area */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={(sec) => {
            setActiveSection(sec);
            // Smooth scroll to top of content on mobile
            window.scrollTo({ top: 250, behavior: 'smooth' });
          }}
          onBackToAnalysis={onBackToAnalysis}
          onNewStartup={onNewStartup}
          onExportReport={() => setIsExportModalOpen(true)}
          jsonString={jsonString}
        />

        {/* Dynamic Section Viewer */}
        <main className="flex-1 w-full space-y-10 min-w-0">
          {/* SECTION: Overview Tab */}
          {(activeSection === 'overview') && (
            <div className="space-y-8 animate-in fade-in duration-150">
              {/* Executive Summary Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">Executive Synthesis</h3>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {report.investment_report.executive_summary}
                </p>

                {/* Elevator Pitch Callout */}
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                  <span className="text-[11px] font-mono font-bold text-blue-700 uppercase tracking-wider block mb-1">
                    ELEVATOR PITCH
                  </span>
                  <p className="text-sm font-semibold text-blue-950 italic leading-snug">
                    "{report.investment_report.elevator_pitch}"
                  </p>
                </div>
              </div>

              {/* 5-Agent Summary Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 01 Startup Analyst Summary */}
                <div 
                  onClick={() => setActiveSection('startup-analysis')}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-600">01 STARTUP ANALYST</span>
                    <span className="text-xs font-bold font-mono text-slate-700">
                      Score: {report.startup_analysis.opportunity_score}/100
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Concept & Problem-Solution Fit</h4>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {report.startup_analysis.summary}
                  </p>
                </div>

                {/* 02 Market Research Summary */}
                <div 
                  onClick={() => setActiveSection('market-research')}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-600">02 MARKET RESEARCH</span>
                    <span className="text-xs font-bold font-mono text-slate-700">Market TAM/SAM/SOM</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Target Demographics & Competitors</h4>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {report.market_research.market_size}
                  </p>
                </div>

                {/* 03 Business Strategy Summary */}
                <div 
                  onClick={() => setActiveSection('business-strategy')}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-600">03 BUSINESS STRATEGY</span>
                    <span className="text-xs font-bold font-mono text-slate-700">9-Block Canvas</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Business Model & GTM Strategy</h4>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {report.business_strategy.unique_value_proposition}
                  </p>
                </div>

                {/* 04 Financial Planning Summary */}
                <div 
                  onClick={() => setActiveSection('financial-plan')}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-600">04 FINANCIAL PLANNING</span>
                    <span className="text-xs font-bold font-mono text-slate-700">{report.financial_plan.funding_required}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Unit Economics & Runway</h4>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    Break-even: {report.financial_plan.break_even_estimate}. {report.financial_plan.operating_costs}
                  </p>
                </div>
              </div>

              {/* SWOT Preview */}
              <SWOTMatrix swot={report.investment_report.swot} />
            </div>
          )}

          {/* SECTION 5: Startup Analyst Section */}
          {(activeSection === 'startup-analysis' || activeSection === 'overview') && (
            <ReportSection
              id="section-startup-analysis"
              agentNumber="01"
              agentName="Startup Analyst"
              title="Startup Concept & Problem-Solution Fit"
              subtitle="Algorithmic validation of the problem, proposed solution, innovation tier, and defensibility"
              badgeText={`Opportunity: ${report.startup_analysis.opportunity_score}/100`}
              badgeVariant="blue"
            >
              <div className="space-y-6">
                {/* Executive Summary & Core Innovation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      CONCEPT TEARDOWN
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Executive Overview</h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {report.startup_analysis.summary}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      CORE DIFFERENTIATION
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Technical Innovation</h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {report.startup_analysis.innovation}
                    </p>
                  </div>
                </div>

                {/* Problem & Solution Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" />
                      <span>The Problem & Market Friction</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      {report.startup_analysis.problem}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>The Proposed Solution</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      {report.startup_analysis.solution}
                    </p>
                  </div>
                </div>

                {/* Strengths vs Weaknesses Visual Comparison */}
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                  <div className="p-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900">
                      Strengths vs. Weaknesses Comparison
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                    <div className="p-5">
                      <h4 className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider mb-3">
                        Key Strengths ({report.startup_analysis.strengths.length})
                      </h4>
                      <ul className="space-y-2">
                        {report.startup_analysis.strengths.map((str, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5">
                      <h4 className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider mb-3">
                        Critical Vulnerabilities & Weaknesses ({report.startup_analysis.weaknesses.length})
                      </h4>
                      <ul className="space-y-2">
                        {report.startup_analysis.weaknesses.map((weak, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                            <span>{weak}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Risks & Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-xs uppercase tracking-wider">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Identified Strategic Risks</span>
                    </div>
                    <ul className="space-y-2">
                      {report.startup_analysis.risks.map((risk, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-xs uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      <span>Analyst Recommendations</span>
                    </div>
                    <ul className="space-y-2">
                      {report.startup_analysis.suggestions.map((sug, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </ReportSection>
          )}

          {/* SECTION 6: Market Research Section */}
          {(activeSection === 'market-research' || activeSection === 'overview') && (
            <ReportSection
              id="section-market-research"
              agentNumber="02"
              agentName="Market Research"
              title="Market Opportunity, Segments & Competition"
              subtitle="Addressable market sizing (TAM/SAM/SOM), target customer personas, and defensibility matrix"
              badgeText="Sector Verified"
              badgeVariant="emerald"
            >
              <div className="space-y-6">
                {/* Market Disclaimer Pill */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs">
                  <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>
                    <strong>AI-Estimated Market Sizing:</strong> Figures reflect synthetic macroeconomic model estimates. Cross-verify with Gartner/Statista reports for formal SEC filings.
                  </span>
                </div>

                {/* Market Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      ADDRESSABLE MARKET SIZING
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 mb-2">TAM / SAM / SOM Breakdown</h3>
                    <p className="text-xs text-slate-700 leading-relaxed font-mono">
                      {report.market_research.market_size}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      DEMAND DYNAMICS
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 mb-2">Market Demand Trajectory</h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {report.market_research.market_demand}
                    </p>
                  </div>
                </div>

                {/* Customer Segments Cards */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">Target Customer Personas & Segments</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {report.market_research.customer_segments.map((seg, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Segment 0{idx + 1}</span>
                        <p className="font-semibold text-slate-800 mt-1 leading-snug">{seg}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Pain Points & Industry Trends */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-3">
                      Customer Pain Points
                    </h4>
                    <ul className="space-y-2">
                      {report.market_research.customer_pain_points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-3">
                      Macro Industry Trends
                    </h4>
                    <ul className="space-y-2">
                      {report.market_research.industry_trends.map((trend, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                          <span>{trend}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Competitor Comparison Table */}
                <CompetitorTable competitors={report.market_research.competitors} />
              </div>
            </ReportSection>
          )}

          {/* SECTION 7: Business Strategy Section */}
          {(activeSection === 'business-strategy' || activeSection === 'overview') && (
            <ReportSection
              id="section-business-strategy"
              agentNumber="03"
              agentName="Business Strategy"
              title="Business Model & Go-To-Market Execution"
              subtitle="Monetization mechanics, pricing architecture, customer acquisition channels, and 9-block Canvas"
              badgeText="Strategy Formulated"
              badgeVariant="blue"
            >
              <div className="space-y-6">
                {/* Top Strategy Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      CORE ARCHITECTURE
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1 mb-1">Business Model</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{report.business_strategy.business_model}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      MONETIZATION
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1 mb-1">Revenue Model</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{report.business_strategy.revenue_model}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      TIERED PACKAGING
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1 mb-1">Pricing Strategy</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{report.business_strategy.pricing_strategy}</p>
                  </div>
                </div>

                {/* Full 9-Block Business Model Canvas */}
                <BusinessModelCanvas strategy={report.business_strategy} />

                {/* Go-to-Market & Sales Channels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Go-To-Market Strategy
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {report.business_strategy.go_to_market_strategy}
                    </p>
                    <div className="text-[11px] font-bold text-slate-700 mb-1.5">Acquisition Tactics:</div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {report.business_strategy.customer_acquisition.map((cac, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{cac}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Land-and-Expand Growth Plan
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {report.business_strategy.growth_strategy}
                    </p>
                    <div className="text-[11px] font-bold text-slate-700 mb-1.5">Strategic Distribution Channels:</div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {report.business_strategy.sales_channels.map((chan, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <span>{chan}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </ReportSection>
          )}

          {/* SECTION 8: Financial Planning Section */}
          {(activeSection === 'financial-plan' || activeSection === 'overview') && (
            <ReportSection
              id="section-financial-plan"
              agentNumber="04"
              agentName="Financial Planning"
              title="Financial Feasibility, Runway & Break-Even"
              subtitle="Startup capital requirements, monthly burn rate, break-even timelines, and multi-year projection model"
              badgeText="Projections Modeled"
              badgeVariant="emerald"
            >
              <div className="space-y-6">
                {/* Key Numbers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Startup Cost Estimate</span>
                    <div className="text-sm font-extrabold text-slate-900 mt-1">{report.financial_plan.startup_cost_estimate.split('(')[0]}</div>
                    <p className="text-[11px] text-slate-500 mt-1">Initial capital to build MVP</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Monthly Operating Expenses</span>
                    <div className="text-sm font-extrabold text-slate-900 mt-1">{report.financial_plan.operating_costs.split('(')[0]}</div>
                    <p className="text-[11px] text-slate-500 mt-1">Estimated operational burn</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Seed Round Required</span>
                    <div className="text-sm font-extrabold text-blue-700 mt-1">{report.financial_plan.funding_required.split('(')[0]}</div>
                    <p className="text-[11px] text-slate-500 mt-1">Target 18-month runway</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Break-even Horizon</span>
                    <div className="text-sm font-extrabold text-emerald-700 mt-1">{report.financial_plan.break_even_estimate.split('(')[0]}</div>
                    <p className="text-[11px] text-slate-500 mt-1">Cashflow neutral target</p>
                  </div>
                </div>

                {/* Interactive Chart Component */}
                <FinancialChart plan={report.financial_plan} />
              </div>
            </ReportSection>
          )}

          {/* SECTION 9: Investment Advisor Section */}
          {(activeSection === 'investment-report' || activeSection === 'overview') && (
            <ReportSection
              id="section-investment-report"
              agentNumber="05"
              agentName="Investment Advisor"
              title="Venture Readiness, SWOT & Pitch Blueprint"
              subtitle="Institutional evaluation, 4-quadrant SWOT analysis, recommended funding stage, and 12-slide pitch deck outline"
              badgeText={`Readiness: ${report.investment_report.investment_readiness_score}/100`}
              badgeVariant="emerald"
            >
              <div className="space-y-6">
                {/* Investment Disclaimer */}
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs">
                  <span>
                    <strong>Compliance Notice:</strong> AI-generated advisory analysis. Not financial or investment advice.
                  </span>
                </div>

                {/* Score & Recommendation Card */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <ScoreGauge
                    score={report.investment_report.investment_readiness_score}
                    label="Investment Readiness"
                    sublabel={report.investment_report.recommended_funding_stage}
                    size="lg"
                  />

                  <div className="md:col-span-2 space-y-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      INVESTOR COMMITTEE VERDICT
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {report.investment_report.final_verdict}
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {report.investment_report.investor_recommendation}
                    </p>
                  </div>
                </div>

                {/* 4-Quadrant SWOT Matrix */}
                <SWOTMatrix swot={report.investment_report.swot} />

                {/* Pitch Deck Outline */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        DECK BLUEPRINT
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        Institutional 12-Slide Pitch Deck Structure
                      </h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400">Pre-seed / Seed Ready</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {report.investment_report.pitch_deck_outline.map((slide, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-800"
                      >
                        <span className="font-mono font-bold text-blue-600 shrink-0">
                          {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}.
                        </span>
                        <span className="leading-snug">{slide.replace(/^\d+\.\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ReportSection>
          )}

          {/* SECTION 11: Raw JSON View */}
          {(activeSection === 'structured-json' || activeSection === 'overview') && (
            <ReportSection
              id="section-structured-json"
              agentNumber="00"
              agentName="Technical Pipeline"
              title="Consolidated Structured JSON Contract"
              subtitle="Complete cumulative schema enriched across all 5 agents — inspectable, validated, and exportable"
              badgeText="Valid JSON"
              badgeVariant="default"
            >
              <JsonViewer data={report} filename={`${report.idea.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}-validation.json`} />
            </ReportSection>
          )}
        </main>
      </div>

      {/* PDF Export / Print Modal */}
      <PdfExportPreviewModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        report={report}
      />
    </div>
  );
};
