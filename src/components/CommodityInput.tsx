import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

interface CommodityInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const QUICK_COMMODITIES = [
  { id: 'tomato-onion', label: 'Nyanya & Vitunguu', sub: 'Tomatoes & Onions', query: 'tomato, onion' },
  { id: 'sukuma-viazi', label: 'Sukuma & Viazi', sub: 'Kales & Potatoes', query: 'sukuma wiki, potatoes' },
  { id: 'parachichi', label: 'Parachichi (Avocado)', sub: 'Hass & Fuerte', query: 'avocado Hass, fuerte' },
  { id: 'pilipili-hoho', label: 'Pilipili Hoho & Karoti', sub: 'Capsicum & Carrots', query: 'capsicum, carrots' },
  { id: 'ndizi-mahindi', label: 'Ndizi & Mahindi', sub: 'Bananas & Green Maize', query: 'bananas, maize' },
  { id: 'managu-traditional', label: 'Managu & Terere', sub: 'Indigenous Greens', query: 'managu, terere' },
];

export const CommodityInput: React.FC<CommodityInputProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleQuickSelect = (q: string) => {
    setQuery(q);
    onSearch(q);
  };

  return (
    <div className="bg-[#F9F7F2] border border-[#E0DED7] p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-6 border-b border-[#E0DED7] pb-3">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#888] block mb-1">
            Query Dispatch Engine
          </span>
          <h2 className="text-xl sm:text-2xl font-serif italic font-bold text-[#1A1A1A]">
            Research Commodity Auctions & Inflow
          </h2>
        </div>
        <span className="text-[11px] text-[#666] font-serif italic">
          Language auto-detected: <strong className="text-[#1A1A1A]">English</strong> / <strong className="text-[#1A1A1A]">Kiswahili</strong>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="relative flex-1">
            <label className="text-[11px] uppercase tracking-widest font-bold text-[#1A1A1A] block mb-2">
              Enter Crop, Vegetable or Grain
            </label>
            <div className="relative flex items-center">
              <input
                id="commodity-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='E.g. "Bei ya nyanya na vitunguu" or "potato, capsicum"...'
                disabled={isLoading}
                className="w-full bg-transparent border-b-2 border-[#1A1A1A] py-3 pr-8 text-lg sm:text-xl font-serif italic text-[#1A1A1A] placeholder:text-[#A09D95] focus:outline-none focus:border-[#F27D26] transition-colors disabled:opacity-60"
              />
              <Search className="w-5 h-5 text-[#888] absolute right-2 pointer-events-none" />
            </div>
          </div>

          <button
            id="btn-run-agent"
            type="submit"
            disabled={!query.trim() || isLoading}
            className="sm:self-end px-6 py-3.5 bg-[#1A1A1A] hover:bg-[#333333] disabled:bg-[#D5D2C8] disabled:text-[#888] text-[#FDFCF8] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shrink-0"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-[#F27D26]" />
                <span>Analyzing Inflows...</span>
              </>
            ) : (
              <>
                <span>Execute Agent</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Picks Shelf */}
      <div className="mt-6 pt-4 border-t border-[#EAE7DF] flex flex-wrap items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#777] mr-1">
          Curated Baselines:
        </span>
        {QUICK_COMMODITIES.map((item) => (
          <button
            key={item.id}
            id={`quick-pick-${item.id}`}
            type="button"
            onClick={() => handleQuickSelect(item.query)}
            disabled={isLoading}
            className="px-3 py-1.5 bg-white hover:bg-[#EFECE4] border border-[#DCD9D0] text-xs font-serif text-[#1A1A1A] transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
          >
            <span className="font-semibold">{item.label}</span>
            <span className="text-[10px] text-[#777] hidden sm:inline">({item.sub})</span>
          </button>
        ))}
      </div>
    </div>
  );
};
