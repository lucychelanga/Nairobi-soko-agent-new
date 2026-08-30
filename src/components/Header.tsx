import React from 'react';
import { Database, Store, Radio, Clock, Sparkles, BellRing, BellOff } from 'lucide-react';
import { useMarketNotifications } from '../hooks/useMarketNotifications';

interface HeaderProps {
  isAutonomousActive: boolean;
  onToggleAutonomous: () => void;
  onTriggerSweep: () => void;
  isSweeping: boolean;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isAutonomousActive,
  onToggleAutonomous,
  onTriggerSweep,
  isSweeping,
  historyCount,
}) => {
  const [time, setTime] = React.useState<string>('');
  const { isEnabled, permission, toggleEnabled } = useMarketNotifications();

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Nairobi is UTC+3
      const nairobiTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Nairobi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(now);
      setTime(nairobiTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#FDFCF8] text-[#1A1A1A] border-b-2 border-[#1A1A1A] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        {/* Brand & Identity (Editorial Headline Style) */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center text-[#FDFCF8] font-serif text-2xl italic font-bold shrink-0 shadow-sm">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#666]">
                Market Intelligence v3.5 • Genkit Flow
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif italic font-bold tracking-tight text-[#1A1A1A] leading-none mt-1">
              Nairobi Soko Agent
            </h1>
            <p className="text-xs text-[#666] mt-1.5 font-serif italic">
              Autonomous pricing & supply dispatch ledger for Wakulima, Muthurwa, City Market & Ngara
            </p>
          </div>
        </div>

        {/* Live Market Indicators & Editorial Controls */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
          {/* Nairobi Time Indicator */}
          <div className="text-left sm:text-right">
            <p className="text-[9px] uppercase tracking-[0.18em] font-bold text-[#888]">Nairobi Time (EAT)</p>
            <p className="font-mono text-xs font-bold text-[#1A1A1A] flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-[#666]" />
              <span>{time || '06:30 AM'}</span>
            </p>
          </div>

          {/* Firestore Ledger Status */}
          <div className="text-left sm:text-right border-l border-[#E0DED7] pl-4">
            <p className="text-[9px] uppercase tracking-[0.18em] font-bold text-[#888]">Firestore Ledger</p>
            <p className="font-mono text-xs font-bold text-[#1A1A1A] flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              <span>{historyCount} Records</span>
            </p>
          </div>

          {/* Browser Notification Indicator */}
          <div className="text-left sm:text-right border-l border-[#E0DED7] pl-4">
            <p className="text-[9px] uppercase tracking-[0.18em] font-bold text-[#888]">Push Alerts</p>
            <button
              id="btn-header-notification-toggle"
              onClick={toggleEnabled}
              title={isEnabled && permission === 'granted' ? 'Push notifications active' : 'Click to enable background push notifications'}
              className={`font-mono text-[11px] font-bold tracking-tight px-2 py-0.5 rounded transition-all mt-0.5 border flex items-center gap-1 ${
                isEnabled && permission === 'granted'
                  ? 'bg-[#1A1A1A] text-[#FDFCF8] border-[#1A1A1A]'
                  : 'bg-[#F9F7F2] text-[#777] border-[#D5D2C8]'
              }`}
            >
              {isEnabled && permission === 'granted' ? (
                <>
                  <BellRing className="w-3 h-3 text-[#F27D26]" />
                  <span>ON</span>
                </>
              ) : (
                <>
                  <BellOff className="w-3 h-3 text-[#999]" />
                  <span>OFF</span>
                </>
              )}
            </button>
          </div>

          {/* Autonomous Status Toggle */}
          <div className="text-left sm:text-right border-l border-[#E0DED7] pl-4">
            <p className="text-[9px] uppercase tracking-[0.18em] font-bold text-[#888]">Agent Mode</p>
            <button
              onClick={onToggleAutonomous}
              className={`font-mono text-[11px] font-bold tracking-tight px-2 py-0.5 rounded transition-all mt-0.5 border ${
                isAutonomousActive
                  ? 'bg-[#1A1A1A] text-[#FDFCF8] border-[#1A1A1A]'
                  : 'bg-[#F9F7F2] text-[#777] border-[#D5D2C8]'
              }`}
            >
              ● {isAutonomousActive ? 'ACTIVE_FLOW' : 'STANDBY'}
            </button>
          </div>

          {/* Background Autonomous Sweep Button */}
          <button
            id="btn-autonomous-sweep"
            onClick={onTriggerSweep}
            disabled={isSweeping}
            className={`flex items-center gap-2 px-4 py-2 border font-medium text-xs tracking-wider uppercase transition-all shadow-sm ${
              isSweeping
                ? 'bg-[#F27D26] text-white border-[#F27D26] cursor-wait'
                : 'bg-[#1A1A1A] hover:bg-[#333333] text-white border-[#1A1A1A]'
            }`}
            title="Trigger autonomous market sweep across wholesale commodity hubs"
          >
            <Radio className={`w-3.5 h-3.5 ${isSweeping ? 'animate-pulse text-white' : 'text-[#FDFCF8]'}`} />
            <span>{isSweeping ? 'Sweeping Hubs...' : 'Sweep Soko'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
