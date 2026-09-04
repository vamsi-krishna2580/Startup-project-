import React from 'react';
import { AgentCard } from '../components/AgentCard';
import { INITIAL_AGENT_STAGES } from '../utils/formatters';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface HomeProps {
  onStartAnalysis: () => void;
  onExploreArchitecture: () => void;
  onLoadExampleDemo: () => void;
}

export const Home: React.FC<HomeProps> = ({
  onStartAnalysis,
  onExploreArchitecture,
  onLoadExampleDemo
}) => {
  const pipelineSteps = [
    { label: 'IDEA', sub: 'Founder Input' },
    { label: 'VALIDATE', sub: 'Agent 01 Analyst' },
    { label: 'RESEARCH', sub: 'Agent 02 Market' },
    { label: 'STRATEGIZE', sub: 'Agent 03 Strategy' },
    { label: 'PLAN', sub: 'Agent 04 Financial' },
    { label: 'INVEST', sub: 'Agent 05 VC Report' }
  ];

  return (
    <div id="home-page-container" className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 text-center max-w-4xl mx-auto px-4">
        {/* Capstone Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700 mb-6 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>COLLEGE CAPSTONE PROJECT • MULTI-AGENT ARCHITECTURE</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
          Validate Your Startup Idea <br className="hidden sm:block" />
          <span className="text-blue-600">Before You Build It.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          AI-powered multi-agent analysis for market opportunity, business strategy, financial feasibility, and investment readiness.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            id="btn-hero-primary-cta"
            onClick={onStartAnalysis}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>Analyze My Startup</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="btn-hero-secondary-cta"
            onClick={onExploreArchitecture}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Explore How It Works</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            id="btn-hero-demo-crop-cta"
            onClick={onLoadExampleDemo}
            className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
            title="Load benchmark capstone dataset: Drone Crop Disease Detection"
          >
            Load Benchmark Capstone Demo
          </button>
        </div>

        {/* Value Highlights */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-3">
            <div className="font-mono text-xl font-extrabold text-slate-900">5 Agents</div>
            <div className="text-xs text-slate-500 mt-0.5">Sequential Domain Reasoning</div>
          </div>
          <div className="p-3">
            <div className="font-mono text-xl font-extrabold text-slate-900">9-Block BMC</div>
            <div className="text-xs text-slate-500 mt-0.5">Business Model Canvas</div>
          </div>
          <div className="p-3">
            <div className="font-mono text-xl font-extrabold text-slate-900">4-Quadrant</div>
            <div className="text-xs text-slate-500 mt-0.5">Defensible SWOT Matrix</div>
          </div>
          <div className="p-3">
            <div className="font-mono text-xl font-extrabold text-slate-900">FastAPI Ready</div>
            <div className="text-xs text-slate-500 mt-0.5">Structured JSON Payload</div>
          </div>
        </div>
      </section>

      {/* Visual Pipeline Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                SEQUENTIAL REASONING PIPELINE
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Continuous Structured Schema Enrichment
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Orchestrator Protocol v1.4</span>
            </div>
          </div>

          {/* Pipeline flow arrows */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {pipelineSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">0{idx + 1}</span>
                  <div className="text-sm font-black tracking-wide text-white mt-0.5">{step.label}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{step.sub}</div>
                </div>
                {idx < pipelineSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-slate-400 leading-relaxed max-w-3xl">
            Each specialized agent receives the raw startup concept combined with the cumulative structured outputs of previous agents, preventing hallucination and ensuring holistic business consistency.
          </p>
        </div>
      </section>

      {/* Five Specialized Agents Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700">
            THE SPECIALIZED ENSEMBLE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Five Autonomous AI Agents
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Unlike generic single-prompt chatbots, each agent is constrained to specific domain knowledge and generates structured, inspectable JSON contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {INITIAL_AGENT_STAGES.map((stage) => (
            <AgentCard
              key={stage.id}
              stage={stage}
              className="h-full"
            />
          ))}
        </div>
      </section>

      {/* Architectural Differentiation: Single Prompt vs Multi-Agent */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              ENGINEERING CONTRIBUTION
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Why Multi-Agent Beats A Single Prompt Chatbot
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Generic Chatbot */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 text-xs">
              <div className="flex items-center gap-2 font-bold text-rose-900 text-sm mb-3">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Standard Single-Prompt Chatbot
              </div>
              <ul className="space-y-2.5 text-rose-950/80">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✗</span>
                  <span><strong>Cognitive Overload:</strong> Expects one LLM prompt to master TAM sizing, unit economics, regulatory moats, and investor pitching simultaneously.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✗</span>
                  <span><strong>Unstructured Walls of Text:</strong> Emits unstructured prose that cannot be programmatically consumed or plotted.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✗</span>
                  <span><strong>Hallucinated Financials:</strong> Inconsistent assumptions between revenue projections and customer acquisition costs.</span>
                </li>
              </ul>
            </div>

            {/* AI Startup Validator Multi-Agent System */}
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 text-xs">
              <div className="flex items-center gap-2 font-bold text-blue-900 text-sm mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Our Specialized Multi-Agent System
              </div>
              <ul className="space-y-2.5 text-blue-950/80">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dedicated Personas:</strong> 5 distinct agents with specialized system prompts and rigorous schema constraints.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Sequential Schema Handoff:</strong> Financial planning explicitly inherits customer pricing from Business Strategy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Structured JSON Delivery:</strong> Powers interactive charts, 9-block Canvas, and downloadable API payloads.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
