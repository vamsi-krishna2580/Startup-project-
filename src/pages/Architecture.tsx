import React from 'react';
import { AgentCard } from '../components/AgentCard';
import { INITIAL_AGENT_STAGES } from '../utils/formatters';
import { 
  Terminal, 
  ArrowDown, 
  Server, 
  Database, 
  Cpu, 
  FileCode2, 
  Layers, 
  GitMerge, 
  Code,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface ArchitectureProps {
  onStartAnalysis: () => void;
  onOpenBackendModal: () => void;
}

export const Architecture: React.FC<ArchitectureProps> = ({
  onStartAnalysis,
  onOpenBackendModal
}) => {
  const architecturalFlow = [
    {
      title: 'Founder / Web UI',
      desc: 'Formulates the startup concept and optional sector constraints.',
      icon: Terminal,
      badge: 'Client Layer',
      color: 'border-slate-300 bg-white text-slate-800'
    },
    {
      title: 'FastAPI REST Gateway',
      desc: 'POST /api/startup/analyze with Pydantic request validation and CORS handling.',
      icon: Server,
      badge: 'API Gateway',
      color: 'border-blue-300 bg-blue-50/50 text-blue-900'
    },
    {
      title: 'Multi-Agent Orchestrator',
      desc: 'Manages state machine, execution order, error boundaries, and cumulative schema handoffs.',
      icon: GitMerge,
      badge: 'Control Plane',
      color: 'border-indigo-300 bg-indigo-50/50 text-indigo-900'
    }
  ];

  const agentDetails = [
    {
      stage: '01',
      name: 'Startup Analyst',
      role: 'Problem-Solution & Defensibility',
      input: 'Raw idea description + optional industry/region metadata.',
      output: 'StartupAnalysis: opportunity_score, problem, solution, innovation, strengths, weaknesses, risks.',
      focus: 'Calculates the baseline viability threshold and filters ungrounded concepts before heavy market research.'
    },
    {
      stage: '02',
      name: 'Market Research',
      role: 'TAM/SAM/SOM & Competitor Matrix',
      input: 'Startup idea + StartupAnalysis output.',
      output: 'MarketResearch: market_size, customer_segments, competitors comparison, industry_trends, pain_points.',
      focus: 'Synthesizes market dynamics, calculates addressable spending, and benchmarks against established incumbents.'
    },
    {
      stage: '03',
      name: 'Business Strategy',
      role: 'Monetization & 9-Block Canvas',
      input: 'Startup idea + StartupAnalysis + MarketResearch.',
      output: 'BusinessStrategy: business_model, pricing_strategy, GTM strategy, sales_channels, 9-block Canvas.',
      focus: 'Translates addressable customer segments into specific recurring revenue mechanics and distribution flywheels.'
    },
    {
      stage: '04',
      name: 'Financial Planning',
      role: 'Unit Economics & Runway',
      input: 'Startup idea + MarketResearch + BusinessStrategy pricing tiers.',
      output: 'FinancialPlan: startup_cost_estimate, operating_costs, break_even_estimate, funding_required, runway.',
      focus: 'Calculates capital intensity, gross margins, cash burn rate, and financial risk factors based on real pricing.'
    },
    {
      stage: '05',
      name: 'Investment Advisor',
      role: 'Venture Capital & Deck Blueprint',
      input: 'Cumulative state of all 4 upstream agents.',
      output: 'InvestmentReport: 4-quadrant SWOT matrix, elevator pitch, 12-slide deck outline, investment_readiness_score.',
      focus: 'Acts as institutional venture partner, assessing whether the venture qualifies for Pre-seed, Seed, or Series A.'
    }
  ];

  return (
    <div id="architecture-page-container" className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700 mb-3">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>CAPSTONE ENGINEERING ARCHITECTURE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          System Design & Agent Orchestration
        </h1>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          How five specialized autonomous AI agents collaborate through sequential state machine transitions to validate startup feasibility.
        </p>
      </div>

      {/* Visual System Architecture Pipeline */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              END-TO-END DATAFLOW
            </span>
            <h3 className="text-lg font-bold text-slate-900">Sequential Execution Pipeline</h3>
          </div>
          <button
            onClick={onOpenBackendModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <Server className="w-3.5 h-3.5 text-blue-600" />
            <span>FastAPI Server Config</span>
          </button>
        </div>

        {/* Top 3 Pre-processing Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {architecturalFlow.map((node, idx) => {
            const Icon = node.icon;
            return (
              <div key={idx} className={`p-4 rounded-2xl border ${node.color} shadow-2xs`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-75">
                    {node.badge}
                  </span>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold mb-1">{node.title}</h4>
                <p className="text-xs opacity-90 leading-relaxed">{node.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Connection arrow */}
        <div className="flex items-center justify-center py-1 text-slate-400 font-mono text-xs gap-2">
          <ArrowDown className="w-4 h-4 animate-bounce text-blue-600" />
          <span>Sequential Agent Execution Loop (Continuous JSON Enrichment)</span>
        </div>

        {/* 5 Specialized Agents Execution Cards */}
        <div className="space-y-3">
          {agentDetails.map((ag, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    AGENT {ag.stage}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{ag.name}</h4>
                  <span className="text-slate-400 font-medium">({ag.role})</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Handoff Node 0{idx + 1}</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                {ag.focus}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 font-mono text-[11px]">
                <div className="text-slate-600 truncate">
                  <span className="text-slate-400 uppercase">Input Context:</span> {ag.input}
                </div>
                <div className="text-blue-700 truncate">
                  <span className="text-slate-400 uppercase">Output Schema:</span> {ag.output}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Terminal Output Node */}
        <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase text-emerald-700">Output Artifact</div>
            <h4 className="text-sm font-bold mt-0.5">Consolidated Startup Validation Report</h4>
            <p className="text-xs text-emerald-800 mt-0.5">
              Strict typed JSON schema ingested by the Interactive Dashboard, PDF generator, and export channels.
            </p>
          </div>
          <button
            onClick={onStartAnalysis}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 transition-colors shadow-2xs cursor-pointer"
          >
            Launch Live Test
          </button>
        </div>
      </div>

      {/* Model Agnostic Specification */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs">
        <h3 className="text-base font-bold text-slate-900">
          Model-Agnostic LLM Layer
        </h3>
        <p className="text-slate-600 leading-relaxed">
          The architecture cleanly decouples the visualization layer from the model inference layer. The backend agent orchestrator can swap between Gemini 2.5/3, Anthropic Claude, Qwen, or local Ollama instances without altering a single line of frontend code, because all communication adheres strictly to the standardized JSON schema contract.
        </p>
        <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">Google Gemini 2.5 / 3.0</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">Anthropic Claude 3.7</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">Qwen 2.5 / DeepSeek</span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">Local Ollama / vLLM</span>
        </div>
      </div>
    </div>
  );
};
