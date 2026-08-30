export type UrgencyLevel = 'CRITICAL_SPIKE' | 'HIGH_GLUT_BUY_NOW' | 'MODERATE_STABLE' | 'LOW_HOLD';

export interface MarketPricePoint {
  marketName: string; // e.g. "Wakulima / Marikiti", "Muthurwa", "City Market", "Fig Tree Ngara", "Kangemi"
  wholesalePrice: number; // in KES
  retailPrice: number; // in KES
  notes: string;
}

export interface PriceRecord {
  id: string;
  commodity: string;
  swahiliName: string;
  englishName: string;
  category: 'Vegetables' | 'Fruits' | 'Tubers & Roots' | 'Grains & Pulses' | 'Spices & Herbs';
  currentWholesalePrice: number; // KES
  currentRetailPrice: number; // KES
  unitWholesale: string; // e.g. "64kg Wooden Crate", "90kg Gunia / Bag", "50kg Sack", "Dozen"
  unitRetail: string; // e.g. "1 Kg", "1 Fungu / Bunch", "1 Piece"
  urgencyLevel: UrgencyLevel;
  urgencyReason: string;
  marketReasoning: string;
  buyingAdvice: {
    bestTimeOfDay: string;
    bestMarket: string;
    targetWholesaleKES: string;
    targetRetailKES: string;
    qualityCheckTips: string[];
    bargainingAdvice: string;
  };
  farmerAdvice: {
    recommendedAction: string; // e.g. "Harvest immediately", "Store in cool sheds for 3 days", "Transport early to Wakulima"
    farmgateEstimatedKES: number;
    marginPotential: string;
    transportRouteTips: string;
    supplyGlutWarning: string;
  };
  marketBreakdown: MarketPricePoint[];
  swahiliSummary: string;
  englishSummary: string;
  timestamp: string;
  firestoreDocId?: string;
  confidenceScore: number;
  trendPercentage?: number;
}

export interface ToolExecutionStep {
  toolName: 'get_history' | 'save_price' | 'advise_farmer' | 'market_research';
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  timestamp: string;
  summary: string;
}

export interface AgentRunResult {
  query: string;
  primaryCommodity: string;
  detectedLanguage: 'swahili' | 'english' | 'mixed';
  toolSteps: ToolExecutionStep[];
  priceRecords: PriceRecord[];
  agentThoughtProcess: string;
  firestoreSavedCount: number;
  timestamp: string;
}

export interface MarketAlert {
  id: string;
  commodity: string;
  urgencyLevel: UrgencyLevel;
  alertTitle: string;
  alertMessage: string;
  marketName: string;
  timestamp: string;
}
