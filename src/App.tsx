/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useStartupAnalysis } from './hooks/useStartupAnalysis';
import { Navbar } from './components/Navbar';
import { BackendConfigModal } from './components/BackendConfigModal';
import { Home } from './pages/Home';
import { Analyze } from './pages/Analyze';
import { AnalysisProgress } from './pages/AnalysisProgress';
import { Results } from './pages/Results';
import { Architecture } from './pages/Architecture';
import { History } from './pages/History';
import { AnalyzeStartupRequest } from './types/startup';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'analyze' | 'results' | 'history' | 'architecture'>('home');
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [pendingIdea, setPendingIdea] = useState<string>('');

  const {
    currentReport,
    isLoading,
    currentStageId,
    stages,
    elapsedSeconds,
    error,
    history,
    startAnalysis,
    loadBenchmarkDemo,
    loadFromHistory,
    deleteFromHistory,
    clearHistory,
    resetAnalysis
  } = useStartupAnalysis();

  const handleStartAnalysis = async (request: AnalyzeStartupRequest) => {
    setPendingIdea(request.idea);
    const success = await startAnalysis(request);
    if (success) {
      setCurrentTab('results');
    }
  };

  const handleLoadDemo = () => {
    loadBenchmarkDemo();
    setCurrentTab('results');
  };

  const handleSelectHistoryReport = (reportId: string) => {
    loadFromHistory(reportId);
    setCurrentTab('results');
  };

  const handleNewStartup = () => {
    resetAnalysis();
    setCurrentTab('analyze');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => setCurrentTab(tab)}
        hasReport={!!currentReport}
        onOpenBackendModal={() => setIsBackendModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading ? (
          <AnalysisProgress
            stages={stages}
            currentStageId={currentStageId}
            elapsedSeconds={elapsedSeconds}
            isLoading={isLoading}
            error={error}
            idea={pendingIdea || 'Analyzing startup concept...'}
            onRetry={() => {
              if (pendingIdea) {
                handleStartAnalysis({ idea: pendingIdea });
              }
            }}
            onCancel={() => {
              resetAnalysis();
              setCurrentTab('analyze');
            }}
          />
        ) : (
          <>
            {currentTab === 'home' && (
              <Home
                onStartAnalysis={() => setCurrentTab('analyze')}
                onExploreArchitecture={() => setCurrentTab('architecture')}
                onLoadExampleDemo={handleLoadDemo}
              />
            )}

            {currentTab === 'analyze' && (
              <Analyze
                onSubmit={handleStartAnalysis}
                isLoading={isLoading}
              />
            )}

            {currentTab === 'results' && (
              currentReport ? (
                <Results
                  report={currentReport}
                  onBackToAnalysis={() => setCurrentTab('analyze')}
                  onNewStartup={handleNewStartup}
                />
              ) : (
                <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
                  <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs">
                    <h3 className="text-base font-bold text-slate-800">No Active Analysis Report</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Please enter a startup concept to begin multi-agent evaluation or load benchmark capstone data.
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        onClick={() => setCurrentTab('analyze')}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
                      >
                        Enter Startup Idea
                      </button>
                      <button
                        onClick={handleLoadDemo}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
                      >
                        Load Benchmark Capstone Demo
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}

            {currentTab === 'history' && (
              <History
                items={history}
                onSelectReport={handleSelectHistoryReport}
                onDeleteReport={deleteFromHistory}
                onClearAll={clearHistory}
                onNewAnalysis={handleNewStartup}
              />
            )}

            {currentTab === 'architecture' && (
              <Architecture
                onStartAnalysis={() => setCurrentTab('analyze')}
                onOpenBackendModal={() => setIsBackendModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI STARTUP VALIDATOR • Multi-Agent Autonomous Capstone</span>
          <span className="text-slate-400">Sequential Reasoning Pipeline • FastAPI Schema Compliant</span>
        </div>
      </footer>

      {/* Backend Configuration & API Contract Modal */}
      <BackendConfigModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
      />
    </div>
  );
}

