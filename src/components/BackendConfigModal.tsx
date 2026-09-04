import React, { useState, useEffect } from 'react';
import { getApiSettings, saveApiSettings, healthCheck } from '../api/startupApi';
import { 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  Terminal, 
  Copy, 
  Check, 
  Globe, 
  Sliders 
} from 'lucide-react';
import { copyToClipboard } from '../utils/formatters';

interface BackendConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged?: () => void;
}

export const BackendConfigModal: React.FC<BackendConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged
}) => {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<'auto' | 'api' | 'demo'>('auto');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getApiSettings();
      setUrl(current.baseUrl);
      setMode(current.mode);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveApiSettings({ baseUrl: url.trim(), mode });
    onConfigChanged?.();
    onClose();
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await healthCheck(url.trim());
      setTestResult({
        success: true,
        message: `Connected successfully! Status: ${res.status}`,
        latency: res.latencyMs
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setTestResult({
        success: false,
        message: msg
      });
    } finally {
      setIsTesting(false);
    }
  };

  const samplePythonFastApi = `# main.py — FastAPI Multi-Agent Backend Contract
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(title="AI Startup Validator Multi-Agent API")

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    idea: str
    industry: Optional[str] = None
    target_customer: Optional[str] = None
    region: Optional[str] = None
    stage: Optional[str] = None
    budget: Optional[str] = None

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "multi-agent-orchestrator"}

@app.post("/api/startup/analyze")
async def analyze_startup(req: AnalyzeRequest):
    # Sequential Agent Execution:
    # 1. startup_analysis = await agent1_startup_analyst(req.idea)
    # 2. market_research  = await agent2_market_research(req.idea, startup_analysis)
    # 3. business_strategy = await agent3_business_strategy(req.idea, market_research)
    # 4. financial_plan    = await agent4_financial_planning(req.idea, business_strategy)
    # 5. investment_report = await agent5_investment_advisor(req.idea, financial_plan)
    return {
        "idea": req.idea,
        "startup_analysis": { ... },
        "market_research": { ... },
        "business_strategy": { ... },
        "financial_plan": { ... },
        "investment_report": { ... }
    }
`;

  const handleCopyCode = async () => {
    await copyToClipboard(samplePythonFastApi);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div id="backend-config-modal" className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Backend Connection & API Contract</h3>
              <p className="text-xs text-slate-500">Configure FastAPI endpoint or toggle isolated demo mode</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Execution Mode Selector */}
          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
              Execution Architecture Mode
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setMode('auto')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  mode === 'auto'
                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500 text-blue-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="font-bold">Auto Mode</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Tries FastAPI; falls back to demo if offline</div>
              </button>

              <button
                type="button"
                onClick={() => setMode('api')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  mode === 'api'
                    ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500 text-indigo-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="font-bold">Strict API Mode</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Strictly connects to live FastAPI server</div>
              </button>

              <button
                type="button"
                onClick={() => setMode('demo')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  mode === 'demo'
                    ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500 text-emerald-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="font-bold">Demo / Mock Mode</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Isolated benchmark capstone data</div>
              </button>
            </div>
          </div>

          {/* Backend URL Input */}
          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1.5">
              FastAPI Base URL (`VITE_API_BASE_URL`)
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !url}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <span>Test Connection</span>
                )}
              </button>
            </div>

            {testResult && (
              <div className={`mt-2.5 p-2.5 rounded-lg border flex items-center gap-2 text-xs ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
                {testResult.latency !== undefined && (
                  <span className="font-mono text-[10px] ml-auto">({testResult.latency}ms)</span>
                )}
              </div>
            )}
          </div>

          {/* FastAPI Starter Code Teardown */}
          <div className="rounded-xl border border-slate-200 bg-slate-900 text-slate-200 p-4">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                FastAPI Python Backend Starter Template
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48 leading-relaxed">
              {samplePythonFastApi}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
