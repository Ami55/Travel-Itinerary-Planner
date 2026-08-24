export default function handler(req: any, res: any) {
  const hasGeminiKey = Boolean(
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.VITE_GOOGLE_API_KEY ||
    process.env.API_KEY
  );

  res.status(200).json({
    status: 'ok',
    service: 'Travel Itinerary Planner (Vercel Serverless)',
    hasGeminiKey,
    timestamp: new Date().toISOString(),
  });
}
