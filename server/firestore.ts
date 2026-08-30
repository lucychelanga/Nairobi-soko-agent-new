import { Firestore } from '@google-cloud/firestore';
import type { PriceRecord, MarketAlert } from '../src/types';

// In-memory / persistent cache fallback for resilience
let firestoreInstance: Firestore | null = null;
const memoryCollectionStore: Map<string, Array<Record<string, any>>> = new Map();

// Initialize initial seed data for Nairobi markets
const initialPriceSeeds: Partial<PriceRecord>[] = [
  {
    id: 'seed-tomato-1',
    commodity: 'Tomato / Nyanya',
    swahiliName: 'Nyanya',
    englishName: 'Tomato',
    category: 'Vegetables',
    currentWholesalePrice: 4200,
    currentRetailPrice: 90,
    unitWholesale: '64kg Wooden Crate',
    unitRetail: '1 Kg',
    urgencyLevel: 'HIGH_GLUT_BUY_NOW',
    urgencyReason: 'High supply influx from Loitokitok and Subukia creating an oversupply at Marikiti early morning.',
    marketReasoning: 'Heavy harvest arrivals between 3:30 AM and 6:00 AM at Wakulima Market. Crate prices dropped from KES 5,200 to KES 4,200.',
    buyingAdvice: {
      bestTimeOfDay: '4:00 AM - 6:30 AM for wholesale crates',
      bestMarket: 'Wakulima / Marikiti (Wholesale) or Fig Tree Ngara (Retail)',
      targetWholesaleKES: 'KES 4,000 - 4,300 per 64kg crate',
      targetRetailKES: 'KES 80 - 95 per kg',
      qualityCheckTips: ['Check for firm skin without blight watermarks', 'Inspect center of crate for bruised bottom layers', 'Prefer medium-ripe (pinkish) for longer shelf life'],
      bargainingAdvice: 'Offer cash upfront for 2+ crates before 6 AM when brokers need to offload trucks.'
    },
    farmerAdvice: {
      recommendedAction: 'Grade before transport to avoid 20% broker deduction; stagger dispatch.',
      farmgateEstimatedKES: 2800,
      marginPotential: 'Farmgate KES 2,800 vs Marikiti KES 4,200 (Gross margin ~33% minus transport KES 450/crate)',
      transportRouteTips: 'Use Mombasa Road early morning to bypass City Stadium junction traffic by 4 AM.',
      supplyGlutWarning: 'Oversupply expected to peak for next 5 days.'
    },
    marketBreakdown: [
      { marketName: 'Wakulima / Marikiti', wholesalePrice: 4200, retailPrice: 85, notes: 'Cheapest wholesale direct from truck' },
      { marketName: 'Muthurwa', wholesalePrice: 4500, retailPrice: 90, notes: 'Convenient pickup near railway station' },
      { marketName: 'City Market', wholesalePrice: 5000, retailPrice: 120, notes: 'Premium graded quality for restaurants/hotels' },
      { marketName: 'Fig Tree Ngara', wholesalePrice: 4600, retailPrice: 95, notes: 'Best retail bundles for residential buyers' },
      { marketName: 'Kangemi Market', wholesalePrice: 4800, retailPrice: 90, notes: 'High turnover for Westlands supply' }
    ],
    swahiliSummary: 'Nyanya zimefurika Wakulima Marikiti asubuhi hii. Bei ya kreti ni KES 4,200. Wakulima washushe mzigo mapema kabla ya saa kumi na mbili asubuhi.',
    englishSummary: 'Tomato supply is abundant at Wakulima Market. 64kg crates trading at KES 4,200 with retail at KES 90/kg.',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    confidenceScore: 0.95,
    trendPercentage: -14.2
  },
  {
    id: 'seed-onion-1',
    commodity: 'Red Onion / Vitunguu Maji',
    swahiliName: 'Vitunguu Maji',
    englishName: 'Red Onion',
    category: 'Vegetables',
    currentWholesalePrice: 6800,
    currentRetailPrice: 140,
    unitWholesale: '50kg Red Net Bag',
    unitRetail: '1 Kg',
    urgencyLevel: 'CRITICAL_SPIKE',
    urgencyReason: 'Tightened cross-border supply from Tanzania and localized rain delays in Loitokitok.',
    marketReasoning: 'Red bulb onion prices have climbed steadily over the past week due to dry curing delays in Kajiado farms.',
    buyingAdvice: {
      bestTimeOfDay: '5:30 AM - 8:00 AM',
      bestMarket: 'Muthurwa or Wakulima Market',
      targetWholesaleKES: 'KES 6,500 - 7,000 per 50kg bag',
      targetRetailKES: 'KES 130 - 150 per kg',
      qualityCheckTips: ['Check neck tightness to avoid rotting bulbs', 'Select dry, papery outer skin with no sprouting', 'Press lightly on shoulder to ensure solid bulb density'],
      bargainingAdvice: 'Buy full 50kg net bags; retail margin is high so negotiate 5-8% discount on bulk purchases.'
    },
    farmerAdvice: {
      recommendedAction: 'Well-cured dry bulbs should be held for 7-10 days for maximum market price realization.',
      farmgateEstimatedKES: 5200,
      marginPotential: 'Farmgate KES 5,200 vs Nairobi KES 6,800 (Net margin ~25% after logistics)',
      transportRouteTips: 'Direct truck offloading at Muthurwa Market gate 2.',
      supplyGlutWarning: 'No glut in sight; price expected to stay elevated for 2 weeks.'
    },
    marketBreakdown: [
      { marketName: 'Wakulima / Marikiti', wholesalePrice: 6700, retailPrice: 135, notes: 'Direct importer lorries' },
      { marketName: 'Muthurwa', wholesalePrice: 6800, retailPrice: 140, notes: 'Wholesale nets readily available' },
      { marketName: 'City Market', wholesalePrice: 7400, retailPrice: 160, notes: 'Sorted large grade bulbs' },
      { marketName: 'Fig Tree Ngara', wholesalePrice: 7100, retailPrice: 145, notes: 'Fast moving retail packs' },
      { marketName: 'Kangemi Market', wholesalePrice: 7000, retailPrice: 140, notes: 'Steady stock' }
    ],
    swahiliSummary: 'Bei ya vitunguu maji imepanda hadi KES 6,800 kwa gunia la kilo 50. Nunua kwa jumla sasa kabla ya ongezeko zaidi wiki ijayo.',
    englishSummary: 'Red onion prices surging due to limited border inflows. 50kg nets at KES 6,800, retail KES 140/kg.',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    confidenceScore: 0.92,
    trendPercentage: 18.5
  },
  {
    id: 'seed-sukuma-1',
    commodity: 'Sukuma Wiki / Collard Greens',
    swahiliName: 'Sukuma Wiki',
    englishName: 'Collard Greens',
    category: 'Vegetables',
    currentWholesalePrice: 1800,
    currentRetailPrice: 30,
    unitWholesale: 'Large Extended Sack (~70kg)',
    unitRetail: '1 Fungu (Large Bunch ~500g)',
    urgencyLevel: 'HIGH_GLUT_BUY_NOW',
    urgencyReason: 'Massive harvest volume coming in from Limuru, Wangige, and Kikuyu farms.',
    marketReasoning: 'Wet weather in Kiambu has accelerated vegetable leaf growth, leading to heavy daily morning deliveries.',
    buyingAdvice: {
      bestTimeOfDay: '4:30 AM - 7:00 AM',
      bestMarket: 'Kangemi or Wakulima Market',
      targetWholesaleKES: 'KES 1,600 - 1,900 per sack',
      targetRetailKES: 'KES 20 - 30 per bunch',
      qualityCheckTips: ['Avoid yellowing edges and wilting center leaves', 'Check for clean stem cuts with minimal pest damage', 'Prefer crisp, deep green leaves'],
      bargainingAdvice: 'Vendors are eager to clear leafy greens before noon heat; afternoon bundles are discounted up to 40%.'
    },
    farmerAdvice: {
      recommendedAction: 'Harvest early morning or evening; mist bundles with clean water before transport.',
      farmgateEstimatedKES: 900,
      marginPotential: 'Farmgate KES 900 vs Nairobi Wholesale KES 1,800',
      transportRouteTips: 'Short delivery routes via Waiyaki Way to Kangemi or Marikiti.',
      supplyGlutWarning: 'High perishability — do not hold stock past 24 hours.'
    },
    marketBreakdown: [
      { marketName: 'Wakulima / Marikiti', wholesalePrice: 1750, retailPrice: 25, notes: 'Bulk sacks from Kiambu' },
      { marketName: 'Muthurwa', wholesalePrice: 1850, retailPrice: 30, notes: 'Heavy footfall retail' },
      { marketName: 'City Market', wholesalePrice: 2200, retailPrice: 40, notes: 'Washed and trimmed bunches' },
      { marketName: 'Fig Tree Ngara', wholesalePrice: 1900, retailPrice: 30, notes: 'Fresh morning stock' },
      { marketName: 'Kangemi Market', wholesalePrice: 1700, retailPrice: 25, notes: 'Primary gateway from Wangige' }
    ],
    swahiliSummary: 'Sukuma wiki imeshuka bei kutokana na mavuno mengi Kiambu. Gunia kubwa ni KES 1,800. Bora kununua mapema asubuhi.',
    englishSummary: 'Sukuma wiki in heavy supply from Limuru/Wangige. Large sacks trading at KES 1,800, bunches at KES 25-30.',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    confidenceScore: 0.96,
    trendPercentage: -8.0
  },
  {
    id: 'seed-potatoes-1',
    commodity: 'Irish Potatoes / Viazi Shangi',
    swahiliName: 'Viazi Shangi',
    englishName: 'Irish Potatoes',
    category: 'Tubers & Roots',
    currentWholesalePrice: 3800,
    currentRetailPrice: 70,
    unitWholesale: 'Extended Gunia (~110kg bag)',
    unitRetail: '1 Kg (or KES 100 per 1.5kg tin/gorogoro)',
    urgencyLevel: 'MODERATE_STABLE',
    urgencyReason: 'Steady supply from Nyandarua / Kinangop and Molo with stable transport costs.',
    marketReasoning: 'Shangi variety remains the staple for Nairobi chips and home consumption with consistent daily lorry arrivals.',
    buyingAdvice: {
      bestTimeOfDay: '5:00 AM - 8:30 AM',
      bestMarket: 'Wakulima Market or Muthurwa',
      targetWholesaleKES: 'KES 3,600 - 4,000 per bag',
      targetRetailKES: 'KES 65 - 75 per kg',
      qualityCheckTips: ['Check for green patches (solanine toxin) and sprout eyes', 'Inspect firmness and avoid damp rotting skin', 'Medium-to-large sizes are best for frying and boiling'],
      bargainingAdvice: 'Inspect the bottom half of the bag to ensure consistent tuber size and avoid soil filling.'
    },
    farmerAdvice: {
      recommendedAction: 'Sort by size (Grade 1 vs Grade 2) before bagging to earn 15% premium at Wakulima.',
      farmgateEstimatedKES: 2600,
      marginPotential: 'Farmgate KES 2,600 vs Nairobi KES 3,800',
      transportRouteTips: 'Flyover - Naivasha - Nairobi Highway via Rironi.',
      supplyGlutWarning: 'Stable supply window for the next 3 weeks.'
    },
    marketBreakdown: [
      { marketName: 'Wakulima / Marikiti', wholesalePrice: 3800, retailPrice: 65, notes: 'Lorries offloading from Kinangop' },
      { marketName: 'Muthurwa', wholesalePrice: 3900, retailPrice: 70, notes: 'Direct bag and tin sales' },
      { marketName: 'City Market', wholesalePrice: 4400, retailPrice: 90, notes: 'Graded washed potatoes' },
      { marketName: 'Fig Tree Ngara', wholesalePrice: 4100, retailPrice: 75, notes: 'Gorogoro / tin measurements' },
      { marketName: 'Kangemi Market', wholesalePrice: 3950, retailPrice: 70, notes: 'Steady neighborhood stock' }
    ],
    swahiliSummary: 'Viazi vya Shangi kutoka Kinangop viko thabiti kwa KES 3,800 kwa gunia. Bei ya rejareja ni KES 70 kwa kilo.',
    englishSummary: 'Irish potatoes (Shangi) stable at KES 3,800 per 110kg bag from Nyandarua. Retail trading around KES 70/kg.',
    timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
    confidenceScore: 0.94,
    trendPercentage: 2.1
  }
];

// Initialize memory store
memoryCollectionStore.set('soko_prices', [...initialPriceSeeds] as any[]);
memoryCollectionStore.set('agent_logs', []);
memoryCollectionStore.set('market_alerts', [
  {
    id: 'alert-1',
    commodity: 'Tomato / Nyanya',
    urgencyLevel: 'HIGH_GLUT_BUY_NOW',
    alertTitle: 'Marikiti Morning Glut Discount',
    alertMessage: 'Tomato crate prices dropped 14% this morning. Optimal window for bulk purchase before 8 AM.',
    marketName: 'Wakulima / Marikiti',
    timestamp: new Date().toISOString()
  },
  {
    id: 'alert-2',
    commodity: 'Red Onion / Vitunguu',
    urgencyLevel: 'CRITICAL_SPIKE',
    alertTitle: 'Onion Price Surge (+18%)',
    alertMessage: 'Tanzania border supply slow-down driving up 50kg bag prices. Lock in wholesale now.',
    marketName: 'Muthurwa',
    timestamp: new Date(Date.now() - 7200000).toISOString()
  }
]);

export function getFirestoreClient(): Firestore | null {
  if (firestoreInstance) return firestoreInstance;
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT || process.env.FIREBASE_PROJECT_ID;
    if (projectId || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      firestoreInstance = new Firestore({
        projectId: projectId || undefined,
        ignoreUndefinedProperties: true
      });
      console.log('Connected to Google Cloud Firestore successfully.');
      return firestoreInstance;
    }
  } catch (err) {
    console.warn('Google Cloud Firestore client initialization fallback to resilient memory/store:', err);
  }
  return null;
}

export async function savePriceRecord(record: PriceRecord): Promise<{ success: boolean; id: string; source: 'firestore' | 'memory' }> {
  const firestore = getFirestoreClient();
  const docId = record.id || `soko_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const recordWithMeta = {
    ...record,
    id: docId,
    timestamp: record.timestamp || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Always update in-memory / local cache
  const list = memoryCollectionStore.get('soko_prices') || [];
  const existingIdx = list.findIndex(item => item.id === docId || item.commodity.toLowerCase() === record.commodity.toLowerCase());
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...recordWithMeta };
  } else {
    list.unshift(recordWithMeta);
  }
  memoryCollectionStore.set('soko_prices', list);

  // If cloud Firestore is available, save to Firestore collection 'soko_prices'
  if (firestore) {
    try {
      await firestore.collection('soko_prices').doc(docId).set(recordWithMeta, { merge: true });
      return { success: true, id: docId, source: 'firestore' };
    } catch (err) {
      console.warn('Firestore cloud write error, stored in local cache:', err);
    }
  }

  return { success: true, id: docId, source: 'memory' };
}

export async function getPriceHistory(commodityQuery: string, limitCount = 15): Promise<PriceRecord[]> {
  const queryNormalized = commodityQuery.trim().toLowerCase();
  const firestore = getFirestoreClient();

  if (firestore) {
    try {
      const snapshot = await firestore.collection('soko_prices')
        .orderBy('timestamp', 'desc')
        .limit(30)
        .get();

      if (!snapshot.empty) {
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PriceRecord));
        if (queryNormalized && queryNormalized !== 'all') {
          const filtered = results.filter(r => 
            r.commodity.toLowerCase().includes(queryNormalized) ||
            r.swahiliName?.toLowerCase().includes(queryNormalized) ||
            r.englishName?.toLowerCase().includes(queryNormalized)
          );
          if (filtered.length > 0) return filtered.slice(0, limitCount);
        }
        return results.slice(0, limitCount);
      }
    } catch (err) {
      console.warn('Firestore fetch failed, querying local memory store:', err);
    }
  }

  // Fallback to local memory collection
  const list = (memoryCollectionStore.get('soko_prices') || []) as PriceRecord[];
  if (!queryNormalized || queryNormalized === 'all') {
    return list.slice(0, limitCount);
  }

  const filtered = list.filter(r => 
    r.commodity.toLowerCase().includes(queryNormalized) ||
    r.swahiliName?.toLowerCase().includes(queryNormalized) ||
    r.englishName?.toLowerCase().includes(queryNormalized) ||
    queryNormalized.includes(r.swahiliName?.toLowerCase()) ||
    queryNormalized.includes(r.englishName?.toLowerCase())
  );

  return filtered.length > 0 ? filtered.slice(0, limitCount) : list.slice(0, limitCount);
}

export async function saveAgentExecutionLog(log: Record<string, any>): Promise<void> {
  const firestore = getFirestoreClient();
  const docId = `log_${Date.now()}`;
  const logData = { ...log, id: docId, createdAt: new Date().toISOString() };

  const logs = memoryCollectionStore.get('agent_logs') || [];
  logs.unshift(logData);
  memoryCollectionStore.set('agent_logs', logs.slice(0, 50));

  if (firestore) {
    try {
      await firestore.collection('agent_logs').doc(docId).set(logData);
    } catch (err) {
      console.warn('Could not write log to Cloud Firestore:', err);
    }
  }
}

export async function getMarketAlerts(): Promise<MarketAlert[]> {
  return (memoryCollectionStore.get('market_alerts') || []) as MarketAlert[];
}
