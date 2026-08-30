import React from 'react';
import { 
  Radio, AlertTriangle, Sparkles, RefreshCw, Zap, Bell, 
  BellRing, BellOff, Volume2, ShieldCheck, CheckCircle2, ExternalLink 
} from 'lucide-react';
import type { MarketAlert } from '../types';
import { useMarketNotifications } from '../hooks/useMarketNotifications';

interface AutonomousMonitorProps {
  alerts: MarketAlert[];
  isAutonomousActive: boolean;
  onToggleAutonomous: () => void;
  onTriggerSweep: () => void;
  isSweeping: boolean;
  lastSweepTime?: string;
}

export const AutonomousMonitor: React.FC<AutonomousMonitorProps> = ({
  alerts,
  isAutonomousActive,
  onToggleAutonomous,
  onTriggerSweep,
  isSweeping,
  lastSweepTime,
}) => {
  const {
    supported,
    permission,
    isEnabled,
    toggleEnabled,
    requestPermission,
    sendTest,
    lastNotificationStatus,
  } = useMarketNotifications(alerts);

  return (
    <div className="bg-[#FFFFFF] border border-[#E0DED7] p-6 sm:p-8 shadow-sm space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[#E0DED7] pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#888] block mb-1">
            Telemetry & Inflow Watcher
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#1A1A1A]">
            Autonomous Background Agent Monitor
          </h3>
          <p className="text-xs text-[#666] font-serif italic mt-1">
            Observing wholesale auctions, detecting supply gluts, and broadcasting notifications across active & background tabs
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            id="btn-toggle-agent-mode"
            onClick={onToggleAutonomous}
            className={`px-3 py-2 text-xs font-mono font-bold tracking-tight uppercase border transition-all ${
              isAutonomousActive
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-[#F9F7F2] text-[#888] border-[#D5D2C8]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 inline mr-1" />
            Mode: {isAutonomousActive ? 'ACTIVE_LOOP' : 'STANDBY'}
          </button>

          <button
            id="btn-manual-sweep-monitor"
            onClick={onTriggerSweep}
            disabled={isSweeping}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#F27D26] hover:bg-[#d96818] text-white transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSweeping ? 'animate-spin' : ''}`} />
            <span>{isSweeping ? 'Sweeping Hubs...' : 'Manual Hub Sweep'}</span>
          </button>
        </div>
      </div>

      {/* Browser Notification API Wrapper Hub */}
      <div className="bg-[#F9F7F2] border border-[#E0DED7] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-[#E0DED7]">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-none border text-white shrink-0 ${
              isEnabled && permission === 'granted'
                ? 'bg-[#1A1A1A] border-[#1A1A1A]'
                : 'bg-[#888] border-[#777]'
            }`}>
              {isEnabled && permission === 'granted' ? (
                <BellRing className="w-5 h-5 text-[#F27D26]" />
              ) : (
                <BellOff className="w-5 h-5 text-[#EAE7DF]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#888]">
                  Browser Notification API Integration
                </span>
                <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold tracking-wider ${
                  permission === 'granted'
                    ? 'bg-[#1A1A1A] text-white'
                    : permission === 'denied'
                    ? 'bg-red-800 text-white'
                    : 'bg-[#DCD9D0] text-[#444]'
                }`}>
                  Permission: {permission.toUpperCase()}
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-serif italic font-bold text-[#1A1A1A] mt-0.5">
                Surge & Glut Out-of-Focus Push Dispatcher
              </h4>
              <p className="text-xs text-[#555] font-serif mt-1 max-w-2xl leading-relaxed">
                Automatically pushes native OS system alerts whenever autonomous market sweeps detect sharp commodity price spikes (&gt;15%) or optimal supply gluts at Nairobi wholesale terminals (Wakulima, Muthurwa, Ngara, City Market), even when this browser tab is backgrounded or out of focus.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 self-start sm:self-center">
            {permission === 'default' && (
              <button
                id="btn-request-notification-permission"
                onClick={requestPermission}
                className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#333] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Grant Permission</span>
              </button>
            )}

            {permission === 'granted' && (
              <button
                id="btn-toggle-notification-enabled"
                onClick={toggleEnabled}
                className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors border shadow-2xs flex items-center gap-1.5 ${
                  isEnabled
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white hover:bg-[#EFECE4] text-[#444] border-[#D5D2C8]'
                }`}
              >
                {isEnabled ? <BellRing className="w-3.5 h-3.5 text-[#F27D26]" /> : <BellOff className="w-3.5 h-3.5" />}
                <span>{isEnabled ? 'Alerts: ACTIVE' : 'Alerts: MUTED'}</span>
              </button>
            )}

            <button
              id="btn-test-notification-alert"
              onClick={sendTest}
              className="px-3.5 py-2 bg-white hover:bg-[#EFECE4] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider border border-[#D5D2C8] transition-colors shadow-2xs flex items-center gap-1.5"
              title="Send a sample surge notification to verify background OS delivery"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>Test Alert</span>
            </button>
          </div>
        </div>

        {/* Real-time Status or Hints */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#666] font-mono gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
            <span>
              {lastNotificationStatus || (isEnabled ? 'Listening for price volatility triggers...' : 'Notification dispatcher on standby.')}
            </span>
          </div>
          <span className="text-[#888]">Web Audio Chime + System Tray Dispatch</span>
        </div>
      </div>

      {lastSweepTime && (
        <div className="text-[11px] font-mono text-[#666] flex items-center gap-2 bg-[#F9F7F2] p-3 border border-[#E0DED7]">
          <span className="font-bold text-[#1A1A1A]">● Last Sweep:</span>
          <span>{new Date(lastSweepTime).toLocaleString()}</span>
          <span className="text-[#999]">| Targets: Wakulima, Muthurwa, City Market, Ngara, Kangemi</span>
        </div>
      )}

      {/* Live Market Alert Cards */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-[#E0DED7] pb-2">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A] flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 text-[#F27D26]" />
            Live Market Dispatches ({alerts.length})
          </h4>
          <span className="text-[10px] font-mono text-[#888]">
            AUTO_PUSH_TRIGGER: CRITICAL_SPIKE | HIGH_GLUT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => {
            const isSpike = alert.urgencyLevel === 'CRITICAL_SPIKE';
            return (
              <div
                key={alert.id}
                id={`alert-card-${alert.id}`}
                className={`p-5 border text-xs transition-all ${
                  isSpike
                    ? 'bg-[#FDFCF8] border-[#E0DED7] border-l-4 border-l-[#F27D26]'
                    : 'bg-[#FDFCF8] border-[#E0DED7] border-l-4 border-l-[#1A1A1A]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-serif italic font-bold text-sm text-[#1A1A1A] flex items-center gap-1.5">
                    {isSpike ? <AlertTriangle className="w-3.5 h-3.5 text-[#F27D26]" /> : <Sparkles className="w-3.5 h-3.5 text-[#1A1A1A]" />}
                    {alert.alertTitle}
                  </span>
                  <span className="text-[10px] text-[#888] font-mono uppercase">{alert.marketName}</span>
                </div>
                <p className="text-[#444] font-serif text-sm leading-relaxed mb-3">
                  "{alert.alertMessage}"
                </p>
                <div className="flex items-center justify-between text-[10px] text-[#777] border-t border-[#EAE7DF] pt-2 font-mono">
                  <span>Commodity: <strong className="text-[#1A1A1A] font-sans">{alert.commodity}</strong></span>
                  <span>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
