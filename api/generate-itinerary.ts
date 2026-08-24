export const config = { maxDuration: 60 };

const SYSTEM_PROMPT = `You are an expert travel researcher and itinerary planner. Create a realistic, personalized, geographically efficient itinerary using your travel knowledge. Never invent uncertain current facts; clearly mark opening hours, prices, reservations and seasonal details for verification. Group nearby places, account for travel time, and match the requested pace, budget, transport and interests.

Return valid JSON only with this shape:
{
  "trip": { "destination": "string", "country": "string", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD", "numberOfDays": 1, "travellers": 1, "pace": "string", "budget": "string", "transportation": "string", "interests": ["string"], "summary": "string", "seasonalNote": "string" },
  "importantBeforeYouGo": [{ "title": "string", "details": "string" }],
  "days": [{
    "day": 1, "date": "YYYY-MM-DD", "title": "string", "neighbourhoods": ["string"], "overview": "string", "estimatedWalking": "string",
    "activities": [{ "startTime": "09:00", "endTime": "10:30", "name": "string", "category": "Attraction | Food | Transit | Break | Experience", "location": "string", "description": "string", "travelFromPrevious": "string", "estimatedCost": "string", "reservation": "Not needed | Recommended | Required | Verify", "indoorOutdoor": "Indoor | Outdoor | Both", "verificationNote": null, "sourceIds": ["source-1"] }],
    "mealSuggestions": [{ "meal": "Lunch", "name": "string", "area": "string", "priceLevel": "$ | $$ | $$$", "whyRecommended": "string", "sourceIds": ["source-1"] }],
    "rainAlternative": { "name": "string", "details": "string", "sourceIds": ["source-1"] }, "localTip": "string"
  }],
  "sources": [{ "id": "source-1", "title": "string", "url": "https://example.com", "publisher": "string", "accessedFor": "string" }],
  "disclaimer": "Opening hours, prices, availability and local conditions can change. Confirm important details before visiting."
}`;

function send(res: any, status: number, body: any) {
  res.status(status).json(body);
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return send(res, 405, { success: false, error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey.trim()) {
    return send(res, 500, {
      success: false,
      error: 'GEMINI_API_KEY is missing in Vercel.',
      code: 'MISSING_API_KEY',
    });
  }

  const input = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  if (!input.destination || !input.startDate || !input.numberOfDays || !input.travellers) {
    return send(res, 400, {
      success: false,
      error: 'Destination, start date, number of days and travellers are required.',
      code: 'INVALID_INPUT',
    });
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(apiKey.trim())}`;
    const geminiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: `Create the itinerary for these preferences:\n${JSON.stringify(input)}` }] }],
        generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
      }),
      signal: AbortSignal.timeout(50_000),
    });

    const raw = await geminiResponse.text();
    let geminiData: any = {};
    try { geminiData = raw ? JSON.parse(raw) : {}; } catch { /* handled below */ }

    if (!geminiResponse.ok) {
      const message = geminiData?.error?.message || `Gemini returned HTTP ${geminiResponse.status}`;
      const lower = message.toLowerCase();
      const code = geminiResponse.status === 429 ? 'QUOTA_EXCEEDED'
        : geminiResponse.status === 400 && lower.includes('api key') ? 'INVALID_API_KEY'
        : 'GEMINI_API_ERROR';
      console.error('Gemini API error:', geminiResponse.status, message);
      return send(res, geminiResponse.status === 429 ? 429 : 502, { success: false, error: message, code });
    }

    const modelText = (geminiData?.candidates?.[0]?.content?.parts || [])
      .map((part: any) => typeof part?.text === 'string' ? part.text : '')
      .join('')
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    let itinerary: any;
    try { itinerary = JSON.parse(modelText); }
    catch {
      console.error('Gemini returned invalid JSON:', modelText.slice(0, 500));
      return send(res, 502, { success: false, error: 'Gemini returned an invalid itinerary response.', code: 'INVALID_AI_RESPONSE' });
    }

    return send(res, 200, { success: true, itinerary });
  } catch (error: any) {
    console.error('Itinerary function error:', error);
    const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    return send(res, timedOut ? 504 : 500, {
      success: false,
      error: timedOut ? 'Gemini request timed out.' : (error?.message || 'Unexpected server error.'),
      code: timedOut ? 'REQUEST_TIMEOUT' : 'SERVER_ERROR',
    });
  }
}
