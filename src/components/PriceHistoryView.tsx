import React, { useState } from 'react';
import { Database, Search, RefreshCw, ArrowUpRight } from 'lucide-react';
import type { PriceRecord } from '../types';

interface PriceHistoryViewProps {
  history: PriceRecord[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelectCommodity: (commodity: string) => void;
}

export const PriceHistoryView: React.FC<PriceHistoryViewProps> = ({
  history,
  isLoading,
  onRefresh,
  onSelectCommodity,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const categories = ['ALL', 'Vegetables', 'Fruits', 'Tubers & Roots', 'Grains & Pulses', 'Spices & Herbs'];

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.swahiliName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.englishName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#FFFFFF] border border-[#E0DED7] p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 border-b border-[#E0DED7] pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#888] block mb-1">
            Persistent Ledger
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#1A1A1A]">
            Firestore Historical Archives
          </h3>
          <p className="text-xs text-[#666] font-serif italic mt-1">
            Collection <code className="text-[#1A1A1A] font-mono font-bold">soko_prices</code> • {history.length} price point records persisted
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#F9F7F2] hover:bg-[#EFECE4] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider border border-[#DCD9D0] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sync Firestore</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#888]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search records by Swahili or English name e.g. Nyanya, Onion..."
            className="w-full bg-[#FDFCF8] border border-[#D5D2C8] pl-9 pr-4 py-2 text-xs font-serif text-[#1A1A1A] placeholder:text-[#A09D95] focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-[#FDFCF8] border border-[#D5D2C8] px-3 py-2 text-xs font-serif text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'ALL' ? 'All Crop Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* History Ledger Table */}
      {filteredHistory.length === 0 ? (
        <div className="text-center py-12 bg-[#FDFCF8] border border-[#E0DED7]">
          <p className="text-sm font-serif italic text-[#666]">No ledger records matching your criteria.</p>
          <p className="text-xs text-[#888] mt-1 font-serif">Run market research to commit fresh price intelligence into Firestore.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F9F7F2] text-[#1A1A1A] uppercase text-[10px] tracking-widest font-bold border-y border-[#1A1A1A]">
              <tr>
                <th className="py-3 px-3">Commodity & Spec</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Wholesale Rate</th>
                <th className="py-3 px-3">Retail Rate</th>
                <th className="py-3 px-3">Urgency Status</th>
                <th className="py-3 px-3">Recorded At</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0DED7] font-serif text-sm">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-[#FDFCF8] transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-[#1A1A1A] text-sm">{item.swahiliName || item.commodity}</div>
                    <div className="text-xs text-[#777] italic">{item.englishName}</div>
                  </td>
                  <td className="py-3.5 px-3 text-xs text-[#555]">{item.category}</td>
                  <td className="py-3.5 px-3 font-bold text-[#1A1A1A]">
                    KES {item.currentWholesalePrice.toLocaleString()}
                    <span className="text-[10px] text-[#888] font-normal block not-italic">{item.unitWholesale}</span>
                  </td>
                  <td className="py-3.5 px-3 text-[#444]">
                    KES {item.currentRetailPrice.toLocaleString()}
                    <span className="text-[10px] text-[#888] font-normal block not-italic">{item.unitRetail}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider font-bold bg-[#F9F7F2] border border-[#D5D2C8] text-[#1A1A1A]">
                      {item.urgencyLevel.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[#777] font-mono text-[11px]">
                    {new Date(item.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => onSelectCommodity(item.commodity)}
                      className="inline-flex items-center gap-1 text-[#1A1A1A] hover:underline font-bold text-xs uppercase tracking-wider font-mono"
                    >
                      <span>Analyze</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
