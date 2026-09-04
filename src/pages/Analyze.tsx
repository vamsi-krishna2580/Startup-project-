import React, { useState } from 'react';
import { AnalyzeStartupRequest } from '../types/startup';
import { 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  FileText, 
  ArrowRight, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

interface AnalyzeProps {
  onSubmit: (request: AnalyzeStartupRequest) => void;
  isLoading: boolean;
}

export const Analyze: React.FC<AnalyzeProps> = ({ onSubmit, isLoading }) => {
  const [idea, setIdea] = useState('');
  const [showOptional, setShowOptional] = useState(false);
  const [industry, setIndustry] = useState('');
  const [targetCustomer, setTargetCustomer] = useState('');
  const [region, setRegion] = useState('');
  const [stage, setStage] = useState('');
  const [budget, setBudget] = useState('');
  const [formError, setFormError] = useState('');

  const sampleCropDrone = {
    idea: 'An AI-powered drone system that detects crop diseases and provides farmers with early warnings using multispectral cameras and automated flight plans.',
    industry: 'AgTech / Precision Agriculture',
    targetCustomer: 'Commercial grain & specialty crop farmers (1,000–5,000 acres)',
    region: 'North America & Western Europe',
    stage: 'Idea / Early Validation',
    budget: '$150,000 Bootstrapping'
  };

  const sampleHealthTech = {
    idea: 'An ambient AI clinical scribe that listens to doctor-patient consultations, extracts structured ICD-10 medical notes, and automatically files pre-authorization insurance claims.',
    industry: 'Healthcare AI / Clinical Informatics',
    targetCustomer: 'Independent outpatient clinics and multi-specialty physician practices',
    region: 'United States',
    stage: 'Prototype',
    budget: '$350,000 Pre-seed'
  };

  const handleLoadExample = (type: 'crop' | 'health') => {
    const data = type === 'crop' ? sampleCropDrone : sampleHealthTech;
    setIdea(data.idea);
    setIndustry(data.industry);
    setTargetCustomer(data.targetCustomer);
    setRegion(data.region);
    setStage(data.stage);
    setBudget(data.budget);
    setShowOptional(true);
    setFormError('');
  };

  const handleClear = () => {
    setIdea('');
    setIndustry('');
    setTargetCustomer('');
    setRegion('');
    setStage('');
    setBudget('');
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) {
      setFormError('Please enter a description of your startup idea before launching the multi-agent analysis.');
      return;
    }
    if (idea.trim().length < 15) {
      setFormError('Please provide a slightly more descriptive startup idea (at least 15 characters) so the 5 agents have sufficient context.');
      return;
    }

    setFormError('');
    onSubmit({
      idea: idea.trim(),
      industry: industry.trim() || undefined,
      target_customer: targetCustomer.trim() || undefined,
      region: region.trim() || undefined,
      stage: stage.trim() || undefined,
      budget: budget.trim() || undefined
    });
  };

  return (
    <div id="analyze-page-container" className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-blue-700 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MULTI-AGENT REASONING PIPELINE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Startup Idea Formulation
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Input your raw concept. The 5 specialized agents will sequentially validate feasibility, conduct market sizing, formulate business models, estimate financials, and assess venture readiness.
        </p>
      </div>

      {/* Primary Input Card */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        {/* Main Idea Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="input-startup-idea" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Describe your startup idea <span className="text-blue-600">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {idea.length} characters
            </span>
          </div>

          <textarea
            id="input-startup-idea"
            rows={5}
            value={idea}
            onChange={(e) => {
              setIdea(e.target.value);
              if (formError) setFormError('');
            }}
            placeholder="Example: An AI-powered drone system that detects crop diseases and provides farmers with early warnings using multispectral imagery and automated fungicide spray prescriptions."
            className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all leading-relaxed"
          ></textarea>

          {formError && (
            <div className="mt-2 text-xs text-rose-600 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}
        </div>

        {/* Quick Load Examples */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-500 mr-1">Load Capstone Example:</span>
          <button
            type="button"
            id="btn-load-crop-drone-example"
            onClick={() => handleLoadExample('crop')}
            className="px-3 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            🌾 Drone Crop Disease Detection
          </button>
          <button
            type="button"
            id="btn-load-healthtech-example"
            onClick={() => handleLoadExample('health')}
            className="px-3 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            🩺 AI Ambient Clinical Scribe
          </button>
        </div>

        {/* Optional Parameters Accordion */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            id="btn-toggle-optional-fields"
            onClick={() => setShowOptional(!showOptional)}
            className="flex items-center justify-between w-full py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Optional Parameters (Refines Agent Context)</span>
            </span>
            {showOptional ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showOptional && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 animate-in fade-in-50 duration-150">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Industry / Sector</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. AgTech / Precision Farming"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Target Customer</label>
                <input
                  type="text"
                  value={targetCustomer}
                  onChange={(e) => setTargetCustomer(e.target.value)}
                  placeholder="e.g. Commercial grain farmers (1k-5k acres)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Country / Region</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. North America, EU, Global"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Business Stage</label>
                <input
                  type="text"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  placeholder="e.g. Idea, Prototype, MVP"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-2">
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">Estimated Budget / Capital Available</label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. $100k Bootstrapped, or Looking for $500k Pre-seed"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Compact Summary of What the System Will Analyze */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            PIPELINE EXECUTION SCOPE
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Idea validation</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Market research</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Business strategy</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Financial feasibility</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 col-span-2 sm:col-span-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Investment readiness</span>
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            id="btn-clear-form"
            onClick={handleClear}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              id="btn-submit-analyze-startup"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
            >
              <span>Analyze Startup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
