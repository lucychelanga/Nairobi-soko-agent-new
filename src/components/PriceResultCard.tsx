import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Clock, MapPin, Check, 
  ShieldCheck, AlertTriangle, Truck, Sparkles, Copy, 
  CheckCircle2, ArrowUpRight
} from 'lucide-react';
import type { PriceRecord, UrgencyLevel } from '../types';

interface PriceResultCardProps {
  record: PriceRecord;
}

export const PriceResultCard: React.FC<PriceResultCardProps> = ({ record }) => {
  const [activeTab, setActiveTab] = useState<'buyer' | 'farmer' | 'markets'>('buyer');
  const [copied, setCopied] = useState(false);

  const getUrgencyBadge = (level: UrgencyLevel) => {
    switch (level) {
      case 'CRITICAL_SPIKE':
        return {
          bg: 'bg-[#F27D26] text-white',
          icon: <AlertTriangle className="w-3 h-3" />,
          label: 'Critical Spike / Supply Shortage',
          accentBorder: 'border-l-[#F27D26]',
        };
      case 'HIGH_GLUT_BUY_NOW':
        return {
          bg: 'bg-[#1A1A1A] text-white',
          icon: <Sparkles className="w-3 h-3 text-[#FDFCF8]" />,
          label: 'Supply Glut / Optimum Buy Window',
          accentBorder: 'border-l-[#1A1A1A]',
        };
      case 'MODERATE_STABLE':
        return {
          bg: 'bg-[#E5E2D9] text-[#1A1A1A] border border-[#CCC]',
          icon: <ShieldCheck className="w-3 h-3 text-[#1A1A1A]" />,
          label: 'Market Stable Inflows',
          accentBorder: 'border-l-[#888888]',
        };
      case 'LOW_HOLD':
      default:
        return {
          bg: 'bg-[#F9F7F2] text-[#555] border border-[#D5D2C8]',
          icon: <Clock className="w-3 h-3 text-[#777]" />,
          label: 'Low / Hold Inventory',
          accentBorder: 'border-l-[#888888]',
        };
    }
  };

  const badge = getUrgencyBadge(record.urgencyLevel);

  const handleCopySummary = () => {
    const text = `${record.commodity} - Nairobi Soko Update:\nWholesale: KES ${record.currentWholesalePrice.toLocaleString()} (${record.unitWholesale})\nRetail: KES ${record.currentRetailPrice.toLocaleString()} (${record.unitRetail})\nBest Market: ${record.buyingAdvice.bestMarket}\nSwahili: ${record.swahiliSummary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="bg-[#FFFFFF] border border-[#E0DED7] shadow-sm">
      {/* Editorial Header Section */}
      <div className={`p-6 sm:p-8 border-b border-[#E0DED7] border-l-4 ${badge.accentBorder}`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#888]">
                Commodity Ledger • {record.category}
              </span>
              <span className="text-[#CCC]">•</span>
              <span className="text-[10px] font-mono text-[#888]">
                DOC #{record.firestoreDocId || record.id.slice(0, 8)}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif italic font-bold text-[#1A1A1A] leading-tight">
              {record.swahiliName} <span className="font-normal not-italic text-[#666] text-2xl sm:text-3xl">/ {record.englishName}</span>
            </h2>
            <p className="mt-2 text-sm text-[#444] font-serif leading-relaxed max-w-3xl">
              {record.marketReasoning}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start">
            <span className={`px-3 py-1 text-[10px] uppercase font-mono tracking-wider font-bold flex items-center gap-1.5 shadow-2xs ${badge.bg}`}>
              {badge.icon}
              <span>{badge.label}</span>
            </span>

            <button
              onClick={handleCopySummary}
              className="p-1.5 border border-[#DCD9D0] bg-[#F9F7F2] hover:bg-[#EFECE4] text-[#444] hover:text-[#1A1A1A] transition-colors"
              title="Copy price brief"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Pricing Matrix (Editorial 3-Column Strip) */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E0DED7] bg-[#FDFCF8] border-b border-[#E0DED7]">
        {/* Wholesale Metric */}
        <div className="p-6">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#888] block mb-1">
            Wholesale Price
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-serif italic font-bold text-[#1A1A1A]">
              KES {record.currentWholesalePrice.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-[#666] font-serif italic mt-1">
            Per {record.unitWholesale} (Wakulima / Marikiti)
          </p>
        </div>

        {/* Retail Average Metric */}
        <div className="p-6">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#888] block mb-1">
            Retail Average
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-serif italic font-bold text-[#1A1A1A]">
              KES {record.currentRetailPrice.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-[#666] font-serif italic mt-1">
            Per {record.unitRetail} (City Market & Ngara)
          </p>
        </div>

        {/* Price Dynamics & Trend */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#888]">
              Supply Dynamic
            </span>
            {record.trendPercentage !== undefined && record.trendPercentage !== 0 && (
              <span className={`text-xs font-mono font-bold px-1.5 py-0.5 ${
                record.trendPercentage > 0 ? 'bg-[#F27D26] text-white' : 'bg-[#1A1A1A] text-white'
              }`}>
                {record.trendPercentage > 0 ? `+${record.trendPercentage}%` : `${record.trendPercentage}%`}
              </span>
            )}
          </div>
          <p className="text-xs text-[#444] font-serif leading-relaxed mt-1">
            {record.urgencyReason}
          </p>
        </div>
      </div>

      {/* Kiswahili & English Journal Bulletins */}
      <div className="p-6 sm:p-8 border-b border-[#E0DED7] bg-[#FFFFFF] space-y-4">
        <div className="p-4 bg-[#F9F7F2] border border-[#E0DED7] border-l-4 border-l-[#1A1A1A]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#666]">
              Taarifa ya Soko (Kiswahili)
            </span>
            <span className="text-[9px] font-mono text-[#888] uppercase">WAKULIMA_WIRE</span>
          </div>
          <p className="text-sm font-serif italic text-[#1A1A1A] leading-relaxed">
            "{record.swahiliSummary}"
          </p>
        </div>

        <div className="p-4 bg-[#FDFCF8] border border-[#E0DED7]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#888]">
              Market Advisory (English)
            </span>
            <span className="text-[9px] font-mono text-[#888] uppercase">MARKET_DISPATCH</span>
          </div>
          <p className="text-sm font-serif italic text-[#444] leading-relaxed">
            "{record.englishSummary}"
          </p>
        </div>
      </div>

      {/* Tabs Navigation (Editorial Underlined Tabs) */}
      <div className="border-b border-[#E0DED7] bg-[#F9F7F2] px-6 flex items-center gap-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('buyer')}
          className={`py-3.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'buyer'
              ? 'border-[#1A1A1A] text-[#1A1A1A]'
              : 'border-transparent text-[#777] hover:text-[#1A1A1A]'
          }`}
        >
          Buying Strategy & Quality
        </button>
        <button
          onClick={() => setActiveTab('farmer')}
          className={`py-3.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'farmer'
              ? 'border-[#1A1A1A] text-[#1A1A1A]'
              : 'border-transparent text-[#777] hover:text-[#1A1A1A]'
          }`}
        >
          Farmer Margins & Logistics
        </button>
        <button
          onClick={() => setActiveTab('markets')}
          className={`py-3.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'markets'
              ? 'border-[#1A1A1A] text-[#1A1A1A]'
              : 'border-transparent text-[#777] hover:text-[#1A1A1A]'
          }`}
        >
          Hub Breakdown (5 Markets)
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6 sm:p-8 bg-[#FFFFFF]">
        {activeTab === 'buyer' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#F9F7F2] p-4 border border-[#E0DED7]">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#888] block mb-1">
                  Primary Market Recommendation
                </span>
                <p className="text-base font-serif italic font-bold text-[#1A1A1A] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#F27D26]" />
                  {record.buyingAdvice.bestMarket}
                </p>
              </div>

              <div className="bg-[#F9F7F2] p-4 border border-[#E0DED7]">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#888] block mb-1">
                  Peak Buying Window
                </span>
                <p className="text-base font-serif italic font-bold text-[#1A1A1A] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1A1A1A]" />
                  {record.buyingAdvice.bestTimeOfDay}
                </p>
              </div>
            </div>

            {/* Quality Checklist */}
            <div className="bg-[#FDFCF8] p-5 border border-[#E0DED7]">
              <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1A1A1A]" />
                Produce Quality Inspection Protocol
              </h4>
              <ul className="space-y-2.5">
                {record.buyingAdvice.qualityCheckTips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-[#333] font-serif flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] shrink-0 mt-1.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bargaining Tactics */}
            <div className="p-4 bg-[#F9F7F2] border border-[#E0DED7]">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#F27D26] block mb-1">
                Wholesale Negotiation Strategy
              </span>
              <p className="text-xs font-serif text-[#444] leading-relaxed">
                {record.buyingAdvice.bargainingAdvice}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'farmer' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#F9F7F2] p-4 border border-[#E0DED7]">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#888] block mb-1">
                  Estimated Farmgate Price
                </span>
                <p className="text-2xl font-serif italic font-bold text-[#1A1A1A]">
                  KES {record.farmerAdvice.farmgateEstimatedKES.toLocaleString()}
                </p>
                <span className="text-[10px] text-[#777] font-serif italic">At farm collection point</span>
              </div>

              <div className="bg-[#F9F7F2] p-4 border border-[#E0DED7]">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#888] block mb-1">
                  Spread & Net Realization
                </span>
                <p className="text-xs font-serif text-[#222] mt-1 leading-relaxed">
                  {record.farmerAdvice.marginPotential}
                </p>
              </div>
            </div>

            <div className="bg-[#FDFCF8] p-4 border border-[#E0DED7]">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] block mb-1 flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#1A1A1A]" />
                Transport Routing & Gate Inflows
              </span>
              <p className="text-xs font-serif text-[#444] leading-relaxed">
                {record.farmerAdvice.transportRouteTips}
              </p>
            </div>

            <div className="bg-[#F9F7F2] p-4 border border-[#E0DED7]">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#F27D26] block mb-1 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F27D26]" />
                Supply Glut Warning & Advisory
              </span>
              <p className="text-xs font-serif text-[#444] leading-relaxed mb-3">
                {record.farmerAdvice.supplyGlutWarning}
              </p>
              <div className="p-3 bg-white border border-[#E0DED7] text-xs font-serif text-[#1A1A1A]">
                <strong>Recommended Farmer Action:</strong> {record.farmerAdvice.recommendedAction}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'markets' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F9F7F2] text-[#1A1A1A] uppercase text-[10px] tracking-widest font-bold border-y border-[#1A1A1A]">
                <tr>
                  <th className="py-3 px-4">Nairobi Wholesale Hub</th>
                  <th className="py-3 px-4">Wholesale Price</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Supply Dynamics & Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0DED7] font-serif text-sm">
                {record.marketBreakdown.map((m, idx) => (
                  <tr key={idx} className="hover:bg-[#FDFCF8] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#1A1A1A]">{m.marketName}</td>
                    <td className="py-3 px-4 font-bold text-[#1A1A1A]">KES {m.wholesalePrice.toLocaleString()}</td>
                    <td className="py-3 px-4 text-[#555]">KES {m.retailPrice.toLocaleString()}</td>
                    <td className="py-3 px-4 text-xs font-sans text-[#666]">{m.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </article>
  );
};
