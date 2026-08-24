import { generateCuratedItinerary, TripPreferencesInput } from './curatedItinerary';

async function generateWithGeminiRest(
  apiKey: string,
  model: string,
  prompt: string,
  withSearch: boolean
): Promise<any> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const generationConfig: Record<string, unknown> = {
    temperature: 0.4,
    responseMimeType: 'application/json',
  };

  const requestBody: any = {
    systemInstruction: {
      parts: [{ text: ITINERARY_SYSTEM_PROMPT }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig,
  };

  if (withSearch) {
    requestBody.tools = [{ googleSearch: {} }];
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(50_000),
  });

  const responseBody = await response.text();
  let data: any = {};
  try {
    data = responseBody ? JSON.parse(responseBody) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error: any = new Error(
      data?.error?.message || `Gemini API returned HTTP ${response.status}`
    );
    error.status = response.status;
    error.statusCode = response.status;
    throw error;
  }

  const text = (data?.candidates?.[0]?.content?.parts || [])
    .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
    .join('')
    .trim();

  return { ...data, text };
}

export const ITINERARY_SYSTEM_PROMPT = `You are an expert travel researcher and itinerary planner. Create a realistic, personalized and geographically efficient itinerary from the supplied trip preferences.

You must use live web research before creating the itinerary. Prioritize official and current sources. Check important details such as operating days, hours, seasonal closures, reservations, events and transportation.

Never invent current facts. If a detail cannot be confirmed, say that it must be verified. Group nearby places together, account for transportation time, avoid overloading the schedule and match the requested pace, budget and interests.

Return valid JSON only using the requested schema. Every factual recommendation obtained through web research must reference one or more source IDs. Use exact calendar dates for every itinerary day.

Required JSON Schema:
{
  "trip": {
    "destination": "string",
    "country": "string",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD",
    "numberOfDays": 3,
    "travellers": 2,
    "pace": "Relaxed | Balanced | Full",
    "budget": "Budget | Comfort | Premium",
    "transportation": "string",
    "interests": ["string"],
    "summary": "Short personalized trip overview",
    "seasonalNote": "Relevant note about conditions during these dates"
  },
  "importantBeforeYouGo": [
    {
      "title": "string",
      "details": "string"
    }
  ],
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Short theme for the day",
      "neighbourhoods": ["string"],
      "overview": "Short explanation",
      "estimatedWalking": "string",
      "activities": [
        {
          "startTime": "09:00",
          "endTime": "10:30",
          "name": "string",
          "category": "Attraction | Food | Transit | Break | Experience",
          "location": "string",
          "description": "What to do and why it fits",
          "travelFromPrevious": "string",
          "estimatedCost": "string",
          "reservation": "Not needed | Recommended | Required | Verify",
          "indoorOutdoor": "Indoor | Outdoor | Both",
          "verificationNote": "string or null",
          "sourceIds": ["source-1"]
        }
      ],
      "mealSuggestions": [
        {
          "meal": "Lunch",
          "name": "string",
          "area": "string",
          "priceLevel": "$ | $$ | $$$",
          "whyRecommended": "string",
          "sourceIds": ["source-2"]
        }
      ],
      "rainAlternative": {
        "name": "string",
        "details": "string",
        "sourceIds": ["source-3"]
      },
      "localTip": "Useful and specific local advice"
    }
  ],
  "sources": [
    {
      "id": "source-1",
      "title": "Source title",
      "url": "https://example.com",
      "publisher": "Publisher or organization",
      "accessedFor": "What information this source supported"
    }
  ],
  "disclaimer": "Opening hours, prices, availability and local conditions can change. Confirm important details before visiting."
}`;

export interface WebSourceCitation {
  id: string;
  title: string;
  url: string;
  publisher?: string;
  accessedFor?: string;
}

// Extract Grounding metadata chunks from Gemini response
export function extractGroundingSources(response: any): WebSourceCitation[] {
  const citations: WebSourceCitation[] = [];
  const seenUrls = new Set<string>();

  try {
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      let idx = 1;
      for (const chunk of chunks) {
        if (chunk?.web?.uri) {
          const url = chunk.web.uri;
          if (url && typeof url === 'string' && !seenUrls.has(url.toLowerCase())) {
            seenUrls.add(url.toLowerCase());
            let hostname = 'Web Source';
            try {
              hostname = new URL(url).hostname.replace(/^www\./, '');
            } catch {
              // Ignore parse error
            }
            citations.push({
              id: `grounding-source-${idx++}`,
              title: chunk.web.title || hostname,
              url: url,
              publisher: hostname,
              accessedFor: 'Live destination details, hours, and logistics',
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Safe grounding citation extraction error:', err);
  }

  return citations;
}

export interface GenerateItineraryParams extends TripPreferencesInput {
  forceCurated?: boolean;
}

export interface ItineraryServiceResult {
  status: number;
  data: {
    success: boolean;
    itinerary?: any;
    isFallback?: boolean;
    fallbackReason?: string;
    error?: string;
    code?: string;
  };
}

export async function processItineraryGeneration(
  params: GenerateItineraryParams
): Promise<ItineraryServiceResult> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.VITE_GOOGLE_API_KEY ||
    process.env.API_KEY ||
    '';

  const {
    destination,
    startDate,
    numberOfDays,
    travellers,
    transportation,
    pace,
    budget,
    interests,
    forceCurated,
  } = params || {};

  // Form validation
  if (!destination || typeof destination !== 'string' || destination.trim().length === 0) {
    return {
      status: 400,
      data: {
        success: false,
        error: 'Please provide a valid destination.',
        code: 'INVALID_DESTINATION',
      },
    };
  }

  if (!startDate || typeof startDate !== 'string') {
    return {
      status: 400,
      data: {
        success: false,
        error: 'Please provide a valid start date for your trip.',
        code: 'INVALID_START_DATE',
      },
    };
  }

  const daysNum = Number(numberOfDays);
  if (!daysNum || isNaN(daysNum) || daysNum < 1 || daysNum > 30) {
    return {
      status: 400,
      data: {
        success: false,
        error: 'Please specify between 1 and 30 days for your itinerary.',
        code: 'INVALID_DAYS',
      },
    };
  }

  const travellersNum = Number(travellers);
  if (!travellersNum || isNaN(travellersNum) || travellersNum < 1) {
    return {
      status: 400,
      data: {
        success: false,
        error: 'Please specify at least 1 traveller.',
        code: 'INVALID_TRAVELLERS',
      },
    };
  }

  if (!interests || !Array.isArray(interests) || interests.length === 0) {
    return {
      status: 400,
      data: {
        success: false,
        error: 'Please select at least one travel interest.',
        code: 'INVALID_INTERESTS',
      },
    };
  }

  const tripPreferences: TripPreferencesInput = {
    destination: destination.trim(),
    startDate,
    numberOfDays: daysNum,
    travellers: travellersNum,
    transportation: transportation || 'Walk + transit',
    pace: pace || 'Balanced',
    budget: budget || 'Comfort',
    interests,
  };

  // If user requested direct curated fallback or missing API key
  if (forceCurated || !apiKey || apiKey.trim() === '') {
    const curated = generateCuratedItinerary(tripPreferences);
    return {
      status: 200,
      data: {
        success: true,
        itinerary: curated,
        isFallback: true,
        fallbackReason: !apiKey
          ? 'No GEMINI_API_KEY configured. Please set GEMINI_API_KEY in Vercel Environment Variables.'
          : 'Curated itinerary mode selected',
      },
    };
  }

  const modelsToTry = [
    { name: 'gemini-2.5-flash', withSearch: true },
    { name: 'gemini-2.5-flash', withSearch: false },
    { name: 'gemini-2.5-flash-lite', withSearch: false },
  ];

  let lastError: any = null;
  let parsedItinerary: any = null;
  let lastResponse: any = null;

  for (const modelConfig of modelsToTry) {
    try {
      const response = await generateWithGeminiRest(
        apiKey.trim(),
        modelConfig.name,
        `Create a realistic, personalized, and geographically sensible day-by-day travel itinerary with live web research for these trip preferences:\n${JSON.stringify(
          tripPreferences,
          null,
          2
        )}`,
        modelConfig.withSearch
      );

      const outputText = response.text;
      if (outputText && typeof outputText === 'string' && outputText.trim() !== '') {
        let cleanJson = outputText.trim();
        if (cleanJson.startsWith('```')) {
          cleanJson = cleanJson.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
        }

        try {
          parsedItinerary = JSON.parse(cleanJson);
        } catch {
          const jsonStart = cleanJson.indexOf('{');
          const jsonEnd = cleanJson.lastIndexOf('}');
          if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            parsedItinerary = JSON.parse(cleanJson.slice(jsonStart, jsonEnd + 1));
          }
        }

        if (
          parsedItinerary &&
          parsedItinerary.trip &&
          Array.isArray(parsedItinerary.days) &&
          parsedItinerary.days.length > 0
        ) {
          lastResponse = response;
          break; // Success!
        }
      }
    } catch (err: any) {
      lastError = err;
      continue;
    }
  }

  // If Gemini succeeded, return full result with sources
  if (parsedItinerary && parsedItinerary.trip) {
    const groundingSources = lastResponse ? extractGroundingSources(lastResponse) : [];
    const finalSources: WebSourceCitation[] = Array.isArray(parsedItinerary.sources)
      ? [...parsedItinerary.sources]
      : [];
    const existingUrls = new Set(
      finalSources
        .map((s) => s.url)
        .filter(Boolean)
        .map((u) => u.toLowerCase())
    );

    for (const gSource of groundingSources) {
      if (gSource.url && !existingUrls.has(gSource.url.toLowerCase())) {
        existingUrls.add(gSource.url.toLowerCase());
        finalSources.push(gSource);
      }
    }

    parsedItinerary.sources = finalSources;

    return {
      status: 200,
      data: {
        success: true,
        itinerary: parsedItinerary,
      },
    };
  }

  // If all models hit 429 quota or rate limits, generate high-quality curated itinerary fallback
  const isQuotaError =
    lastError?.status === 429 ||
    lastError?.statusCode === 429 ||
    lastError?.message?.includes('429') ||
    lastError?.message?.includes('quota') ||
    lastError?.message?.includes('RESOURCE_EXHAUSTED') ||
    lastError?.message?.includes('rate limit');

  if (isQuotaError) {
    const curated = generateCuratedItinerary(tripPreferences);
    return {
      status: 200,
      data: {
        success: true,
        itinerary: curated,
        isFallback: true,
        fallbackReason:
          'Your Gemini API quota limit was exceeded. Generated via Curated Travel Intelligence.',
      },
    };
  }

  // Non-quota errors (e.g. invalid API key)
  const errorMessage = lastError?.message || '';
  if (
    lastError?.status === 401 ||
    errorMessage.includes('API key not valid') ||
    errorMessage.includes('invalid api key')
  ) {
    return {
      status: 401,
      data: {
        success: false,
        error:
          'Your Gemini API key appears to be invalid. Please verify GEMINI_API_KEY in your Vercel Environment Variables.',
        code: 'INVALID_API_KEY',
      },
    };
  }

  return {
    status: 500,
    data: {
      success: false,
      error:
        'Unable to reach Gemini API. You can still generate using Curated Itinerary mode.',
      code: 'SERVER_ERROR',
    },
  };
}
