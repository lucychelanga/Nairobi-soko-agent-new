import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { runNairobiSokoAgent, executeGetHistoryTool, executeAdviseFarmerTool } from './server/genkit-agent';
import { getPriceHistory, getMarketAlerts, getFirestoreClient } from './server/firestore';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  const firestoreConnected = !!getFirestoreClient();
  res.json({
    status: 'ok',
    agent: 'Nairobi Soko Agent',
    framework: 'Genkit + Gemini 3.5 Flash',
    firestore: firestoreConnected ? 'Connected (Google Cloud Firestore)' : 'Active (Resilient Persistent Store)',
    time: new Date().toISOString(),
  });
});

// Autonomous Agent Research Flow
app.post('/api/agent/research', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Please provide a commodity name or inquiry in Swahili or English (e.g. "tomato, onion", "sukuma wiki").' });
    }

    console.log(`[Nairobi Soko Agent] Processing query: "${query}"`);
    const result = await runNairobiSokoAgent(query.trim());
    res.json(result);
  } catch (error) {
    console.error('[Nairobi Soko Agent] Error running research:', error);
    res.status(500).json({
      error: 'Autonomous agent encountered an error during market research.',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Price History from Firestore
app.get('/api/agent/history', async (req, res) => {
  try {
    const commodity = (req.query.commodity as string) || 'all';
    const limit = parseInt(req.query.limit as string) || 20;
    const history = await getPriceHistory(commodity, limit);
    res.json({ commodity, count: history.length, history });
  } catch (error) {
    console.error('[Nairobi Soko Agent] Error fetching history:', error);
    res.status(500).json({ error: 'Failed to retrieve price history from Firestore.' });
  }
});

// Real-time market alerts
app.get('/api/agent/alerts', async (req, res) => {
  try {
    const alerts = await getMarketAlerts();
    res.json({ count: alerts.length, alerts });
  } catch (error) {
    console.error('[Nairobi Soko Agent] Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch market alerts.' });
  }
});

// Background Autonomous Sweep endpoint
app.post('/api/agent/autonomous-sweep', async (req, res) => {
  try {
    console.log('[Nairobi Soko Agent] Initiating autonomous background sweep across Nairobi markets...');
    const commoditiesToSweep = 'Tomato, Red Onion, Sukuma Wiki, Irish Potatoes, Hass Avocado';
    const sweepResult = await runNairobiSokoAgent(commoditiesToSweep);
    res.json({
      sweepTriggered: true,
      commoditiesAnalyzed: sweepResult.priceRecords.length,
      firestoreCommitted: sweepResult.firestoreSavedCount,
      timestamp: sweepResult.timestamp,
      result: sweepResult
    });
  } catch (error) {
    console.error('[Nairobi Soko Agent] Sweep error:', error);
    res.status(500).json({ error: 'Autonomous sweep failed.' });
  }
});

// Direct Farmer Advisory Tool endpoint
app.post('/api/agent/farmer-advice', (req, res) => {
  try {
    const { commodity, wholesaleKES, farmgateKES, supplyTrend } = req.body;
    if (!commodity || !wholesaleKES || !farmgateKES) {
      return res.status(400).json({ error: 'Missing commodity, wholesaleKES, or farmgateKES parameters.' });
    }
    const advice = executeAdviseFarmerTool(
      commodity,
      Number(wholesaleKES),
      Number(farmgateKES),
      supplyTrend || 'Normal'
    );
    res.json(advice);
  } catch (error) {
    res.status(500).json({ error: 'Farmer advisory computation failed.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nairobi Soko Agent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
