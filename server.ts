import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { processItineraryGeneration } from './server/itineraryService';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '5mb' }));

// Health endpoint
app.get('/api/health', (req, res) => {
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.VITE_GOOGLE_API_KEY ||
    process.env.API_KEY
  );
  res.json({
    status: 'ok',
    service: 'Travel Itinerary Planner',
    hasGeminiKey,
  });
});

// Primary generation endpoint
app.post('/api/generate-itinerary', async (req, res) => {
  try {
    const result = await processItineraryGeneration(req.body || {});
    return res.status(result.status).json(result.data);
  } catch (err: any) {
    console.error('Express server error in /api/generate-itinerary:', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred while creating your itinerary. Please try again.',
      code: 'SERVER_ERROR',
    });
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
    console.log(`Travel Itinerary Planner server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
