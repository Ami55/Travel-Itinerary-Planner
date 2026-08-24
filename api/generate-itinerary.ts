import type { IncomingMessage, ServerResponse } from 'http';
import { processItineraryGeneration } from '../server/itineraryService';

// Extend Vercel Serverless Function execution timeout to 60s for AI web search
export const config = {
  maxDuration: 60,
};

async function parseBody(req: any): Promise<any> {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return req.body;
      }
    }
    return req.body;
  }

  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk: any) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
}

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  // Handle CORS / preflight
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      error: 'Method not allowed. Only POST is supported.',
    });
    return;
  }

  try {
    const body = await parseBody(req);
    const result = await processItineraryGeneration(body || {});
    res.status(result.status).json(result.data);
  } catch (error: any) {
    console.error('Vercel serverless function error in /api/generate-itinerary:', error);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while generating your itinerary. You can also generate in Curated Mode.',
      code: 'SERVERLESS_ERROR',
    });
  }
}
