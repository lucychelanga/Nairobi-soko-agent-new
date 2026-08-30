import React, { useState } from 'react';
import { Truck, Calculator, ShieldCheck } from 'lucide-react';

export const FarmerAdvisoryView: React.FC = () => {
  const [commodity, setCommodity] = useState('Nyanya (Tomatoes)');
  const [wholesaleKES, setWholesaleKES] = useState(4200);
  const [farmgateKES, setFarmgateKES] = useState(2800);
  const [cratesCount, setCratesCount] = useState(50);
  const [route, setRoute] = useState('Naivasha / Subukia -> Wakulima (via Mai Mahiu)');

  const grossMarginPerUnit = wholesaleKES - farmgateKES;
  const estimatedTransportPerUnit = Math.round(wholesaleKES * 0.12);
  const brokerCommissionPerUnit = Math.round(wholesaleKES * 0.05);
  const netFarmerProfitPerUnit = grossMarginPerUnit - estimatedTransportPerUnit - brokerCommissionPerUnit;

  const totalRevenue = wholesaleKES * cratesCount;
  const totalNetProfit = netFarmerProfitPerUnit * cratesCount;

  return (
    <div className="bg-[#FFFFFF] border border-[#E0DED7] p-6 sm:p-8 shadow-sm">
      <div className="border-b border-[#E0DED7] pb-4 mb-6">
        <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#888] block mb-1">
          Logistics & Farmgate Realization
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#1A1A1A]">
          Farmer Dispatch & Margin Calculator
        </h3>
        <p className="text-xs text-[#666] font-serif italic mt-1">
          Simulating Genkit tool logic for <code className="text-[#1A1A1A] font-mono font-bold">advise_farmer</code>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Interactive Dispatch Inputs */}
        <div className="space-y-4 lg:col-span-1 bg-[#F9F7F2] p-5 border border-[#E0DED7]">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] flex items-center gap-2 border-b border-[#E0DED7] pb-2">
            <Calculator className="w-3.5 h-3.5" />
            Dispatch Parameters
          </h4>

          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-[#666] block mb-1">Crop / Commodity Spec</label>
            <input
              type="text"
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#D5D2C8] px-3 py-2 text-xs font-serif text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold text-[#666] block mb-1">Wholesale (KES)</label>
              <input
                type="number"
                value={wholesaleKES}
                onChange={(e) => setWholesaleKES(Number(e.target.value))}
                className="w-full bg-[#FFFFFF] border border-[#D5D2C8] px-3 py-2 text-xs font-serif text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider font-bold text-[#666] block mb-1">Farmgate (KES)</label>
              <input
                type="number"
                value={farmgateKES}
                onChange={(e) => setFarmgateKES(Number(e.target.value))}
                className="w-full bg-[#FFFFFF] border border-[#D5D2C8] px-3 py-2 text-xs font-serif text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-[#666] block mb-1">Dispatched Volume (Units/Crates)</label>
            <input
              type="number"
              value={cratesCount}
              onChange={(e) => setCratesCount(Number(e.target.value))}
              className="w-full bg-[#FFFFFF] border border-[#D5D2C8] px-3 py-2 text-xs font-serif text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-[#666] block mb-1">Supply Transport Route</label>
            <select
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#D5D2C8] px-3 py-2 text-xs font-serif text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            >
              <option value="Naivasha / Subukia -> Wakulima (via Mai Mahiu)">Naivasha/Subukia → Wakulima (Mai Mahiu)</option>
              <option value="Kinangop / Nyandarua -> Muthurwa (via Flyover)">Kinangop/Nyandarua → Muthurwa (Flyover)</option>
              <option value="Meru / Embu -> Fig Tree Ngara (via Thika Superhighway)">Meru/Embu → Fig Tree (Thika Highway)</option>
              <option value="Kajiado / Loitokitok -> Wakulima (via Mombasa Road)">Loitokitok/Kajiado → Wakulima (Mombasa Rd)</option>
              <option value="Kiambu / Wangige -> Kangemi (via Waiyaki Way)">Kiambu/Wangige → Kangemi (Waiyaki Way)</option>
            </select>
          </div>
        </div>

        {/* Center & Right Column: Analytics & Dispatch Bulletin */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#F9F7F2] p-4 border border-[#E0DED7]">
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#888] block mb-1">Gross Margin / Unit</span>
              <p className="text-xl sm:text-2xl font-serif italic font-bold text-[#1A1A1A]">KES {grossMarginPerUnit.toLocaleString()}</p>
            </div>
            <div className="bg-[#F9F7F2] p-4 border border-[#E0DED7]">
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#888] block mb-1">Est. Logistics / Unit</span>
              <p className="text-xl sm:text-2xl font-serif italic font-bold text-[#666]">KES {estimatedTransportPerUnit.toLocaleString()}</p>
            </div>
            <div className="bg-[#F9F7F2] p-4 border border-[#E0DED7]">
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#888] block mb-1">Net Margin / Unit</span>
              <p className="text-xl sm:text-2xl font-serif italic font-bold text-[#F27D26]">KES {netFarmerProfitPerUnit.toLocaleString()}</p>
            </div>
            <div className="bg-[#F9F7F2] p-4 border border-[#E0DED7]">
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#888] block mb-1">Batch Realization</span>
              <p className="text-xl sm:text-2xl font-serif italic font-bold text-[#1A1A1A]">KES {totalNetProfit.toLocaleString()}</p>
            </div>
          </div>

          {/* Supply Route Advisory */}
          <div className="bg-[#FDFCF8] p-5 border border-[#E0DED7] border-l-4 border-l-[#1A1A1A]">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A] flex items-center gap-2 mb-2">
              <Truck className="w-4 h-4 text-[#1A1A1A]" />
              Corridor Guidelines: {route}
            </h4>
            <p className="text-xs sm:text-sm font-serif text-[#444] leading-relaxed">
              Trucks entering Nairobi via this corridor should aim to cross county cess and barrier gates between <strong>3:30 AM and 5:00 AM</strong>. Arriving past 6:30 AM results in bottlenecked offloading on Haile Selassie Avenue and exposes fragile produce to sun and weight loss.
            </p>
          </div>

          {/* Direct-to-Market Rules */}
          <div className="bg-[#F9F7F2] p-5 border border-[#E0DED7]">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1A1A1A]" />
              Kenyan Agricultural Direct-to-Market Principles
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-serif text-[#444]">
              <div className="p-3.5 bg-white border border-[#E0DED7]">
                <strong className="text-[#1A1A1A] block mb-1 font-sans text-[11px] uppercase tracking-wider">1. Pre-Harvest Grading:</strong>
                Separate Grade 1 (firm, unblemished) from Grade 2 on the farm to prevent wholesale brokers from downgrading entire sacks at offload.
              </div>
              <div className="p-3.5 bg-white border border-[#E0DED7]">
                <strong className="text-[#1A1A1A] block mb-1 font-sans text-[11px] uppercase tracking-wider">2. Group Logistics Pooling:</strong>
                Consolidate loads with neighboring farms in a single Canter or Isuzu truck to compress logistics overheads from KES 450 to KES 280 per unit.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
