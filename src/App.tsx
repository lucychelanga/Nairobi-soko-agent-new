import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Bot, Sparkles, Database, Store, Radio, Truck, 
  Search, AlertCircle, RefreshCw, ShieldCheck, MapPin, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { Header } from './components/Header';
import { CommodityInput } from './components/CommodityInput';
import { AgentExecutionTrace } from './components/AgentExecutionTrace';
import { PriceResultCard } from './components/PriceResultCard';
import { PriceHistoryView } from './components/PriceHistoryView';
import { FarmerAdvisoryView } from './components/FarmerAdvisoryView';
import { AutonomousMonitor } from './components/AutonomousMonitor';
import { checkAndNotifyAlerts } from './utils/notifications';
import type { AgentRunResult, PriceRecord, MarketAlert, ToolExecutionStep } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'agent' | 'history' | 'farmer' | 'monitor'>('agent');
  const [currentResult, setCurrentResult] = useState<AgentRunResult | null>(null);
  const [historyRecords, setHistoryRecords] = useState<PriceRecord[]>([]);
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSweeping, setIsSweeping] = useState(false);
  const [isAutonomousActive, setIsAutonomousActive] = useState(true);
  const [lastSweepTime, setLastSweepTime] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initial load: Fetch Firestore history and market alerts
  useEffect(() => {
    fetchHistory();
    fetchAlerts();
    // Default initial query on first load to showcase autonomous agent immediately
    handleRunAgent('tomato, onion');
  }, []);

  // Autonomous background watcher loop
  useEffect(() => {
    if (!isAutonomousActive) return;
    const interval = setInterval(() => {
      console.log('[Autonomous Background Loop] Periodic soko sweep check...');
      fetchHistory();
      fetchAlerts();
    }, 45000);
    return () => clearInterval(interval);
  }, [isAutonomousActive]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/agent/history?limit=30');
      if (res.ok) {
        const data = await res.json();
        if (data.history) {
          setHistoryRecords(data.history);
        }
      }
    } catch (err) {
      console.warn('Failed to load history:', err);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await fetch('/api/agent/alerts');
      if (res.ok) {
        const data = await res.json();
        if (data.alerts) {
          setAlerts(data.alerts);
          // Evaluate for significant price surge or drop and trigger Notification API
          checkAndNotifyAlerts(data.alerts);
        }
      }
    } catch (err) {
      console.warn('Failed to load alerts:', err);
    }
  };

  const handleRunAgent = async (queryText: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    // Initial tool execution step placeholder for immediate visual feedback
    const placeholderSteps: ToolExecutionStep[] = [
      {
        toolName: 'get_history',
        title: `Query Firestore for "${queryText}"`,
        status: 'running',
        timestamp: new Date().toISOString(),
        summary: 'Accessing Firestore collection `soko_prices` for baseline historical pricing...',
      },
    ];

    setCurrentResult({
      query: queryText,
      primaryCommodity: queryText,
      detectedLanguage: 'english',
      toolSteps: placeholderSteps,
      priceRecords: [],
      agentThoughtProcess: 'Agent initialized. Evaluating query syntax in Swahili/English, invoking history tool, and activating Gemini market reasoning engine...',
      firestoreSavedCount: 0,
      timestamp: new Date().toISOString(),
    });

    try {
      const res = await fetch('/api/agent/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to complete autonomous research.');
      }

      const result: AgentRunResult = await res.json();
      setCurrentResult(result);
      setActiveView('agent');
      fetchHistory();
      fetchAlerts();

      // Subtle confetti effect
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.85 },
        colors: ['#1A1A1A', '#F27D26', '#E0DED7', '#2E6B4E'],
      });
    } catch (err) {
      console.error('Agent research failed:', err);
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred while executing the agent workflow.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerSweep = async () => {
    setIsSweeping(true);
    try {
      const res = await fetch('/api/agent/autonomous-sweep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setLastSweepTime(new Date().toISOString());
        if (data.result) {
          setCurrentResult(data.result);
          setActiveView('agent');
        }
        fetchHistory();
        fetchAlerts();
      }
    } catch (err) {
      console.error('Sweep failed:', err);
    } finally {
      setIsSweeping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-[#FDFCF8] flex flex-col">
      {/* Editorial Header */}
      <Header
        isAutonomousActive={isAutonomousActive}
        onToggleAutonomous={() => setIsAutonomousActive(!isAutonomousActive)}
        onTriggerSweep={handleTriggerSweep}
        isSweeping={isSweeping}
        historyCount={historyRecords.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs (Editorial Minimalist Bar) */}
        <div className="flex items-center justify-between border-b border-[#E0DED7] pb-0 overflow-x-auto gap-2">
          <div className="flex items-center gap-1 sm:gap-3">
            <button
              id="tab-agent-research"
              onClick={() => setActiveView('agent')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 border-b-2 ${
                activeView === 'agent'
                  ? 'border-[#1A1A1A] text-[#1A1A1A] bg-transparent'
                  : 'border-transparent text-[#777] hover:text-[#1A1A1A]'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Soko Agent Query</span>
            </button>

            <button
              id="tab-firestore-history"
              onClick={() => setActiveView('history')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 border-b-2 ${
                activeView === 'history'
                  ? 'border-[#1A1A1A] text-[#1A1A1A] bg-transparent'
                  : 'border-transparent text-[#777] hover:text-[#1A1A1A]'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Firestore Ledger</span>
              <span className="px-1.5 py-0.5 text-[10px] bg-[#1A1A1A] text-white font-mono">
                {historyRecords.length}
              </span>
            </button>

            <button
              id="tab-farmer-margins"
              onClick={() => setActiveView('farmer')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 border-b-2 ${
                activeView === 'farmer'
                  ? 'border-[#1A1A1A] text-[#1A1A1A] bg-transparent'
                  : 'border-transparent text-[#777] hover:text-[#1A1A1A]'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Farmer Logistics</span>
            </button>

            <button
              id="tab-autonomous-monitor"
              onClick={() => setActiveView('monitor')}
              className={`px-4 py-3 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 border-b-2 ${
                activeView === 'monitor'
                  ? 'border-[#1A1A1A] text-[#1A1A1A] bg-transparent'
                  : 'border-transparent text-[#777] hover:text-[#1A1A1A]'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Background Monitor</span>
            </button>
          </div>
        </div>

        {/* View 1: Main Agent Research & Results */}
        {activeView === 'agent' && (
          <div className="space-y-8">
            {/* Input Component */}
            <CommodityInput onSearch={handleRunAgent} isLoading={isLoading} />

            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-4 bg-[#FFF5F5] border border-[#E0B4B4] text-xs text-red-900 flex items-center gap-2 font-serif">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Live Agent Tool Execution Trace */}
            {currentResult && (
              <AgentExecutionTrace
                steps={currentResult.toolSteps}
                thoughtProcess={currentResult.agentThoughtProcess}
                isStreaming={isLoading}
              />
            )}

            {/* Price Result Cards */}
            {currentResult && currentResult.priceRecords.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-baseline justify-between border-b border-[#E0DED7] pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-[#777] flex items-center gap-2">
                    <Store className="w-3.5 h-3.5 text-[#1A1A1A]" />
                    Evaluated Nairobi Market Records ({currentResult.priceRecords.length})
                  </h3>
                  <span className="text-xs text-[#888] font-mono">
                    DETECTED_LANG: {currentResult.detectedLanguage.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {currentResult.priceRecords.map((record) => (
                    <PriceResultCard key={record.id} record={record} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* View 2: Firestore History Ledger */}
        {activeView === 'history' && (
          <PriceHistoryView
            history={historyRecords}
            isLoading={isLoading}
            onRefresh={fetchHistory}
            onSelectCommodity={(commodity) => {
              handleRunAgent(commodity);
            }}
          />
        )}

        {/* View 3: Farmer & Trader Intelligence */}
        {activeView === 'farmer' && <FarmerAdvisoryView />}

        {/* View 4: Autonomous Background Monitor */}
        {activeView === 'monitor' && (
          <AutonomousMonitor
            alerts={alerts}
            isAutonomousActive={isAutonomousActive}
            onToggleAutonomous={() => setIsAutonomousActive(!isAutonomousActive)}
            onTriggerSweep={handleTriggerSweep}
            isSweeping={isSweeping}
            lastSweepTime={lastSweepTime}
          />
        )}
      </main>

      {/* Editorial Ink Footer */}
      <footer className="mt-auto px-6 sm:px-10 py-5 bg-[#1A1A1A] text-[#888] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-4 text-[9px] uppercase tracking-widest">
          <span>© 2026 Soko Intelligence</span>
          <span>•</span>
          <span>Genkit Flow Engine</span>
          <span>•</span>
          <span>Firestore Realtime Sync</span>
          <span>•</span>
          <span>Wakulima • Muthurwa • City Market</span>
        </div>
        <div className="text-[10px] font-mono text-[#AAA]">
          CLOUD_RUN_SERVICE: NAIROBI_SOKO_AGENT_V3
        </div>
      </footer>
    </div>
  );
}
