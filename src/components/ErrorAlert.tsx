import React from 'react';
import { AlertTriangle, RefreshCw, KeyRound, ShieldAlert, WifiOff, Clock, Sparkles } from 'lucide-react';

interface ErrorAlertProps {
  error: string;
  code?: string;
  onRetry: () => void;
  onEditPreferences: () => void;
  onCuratedFallback?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  code,
  onRetry,
  onEditPreferences,
  onCuratedFallback,
}) => {
  const getIcon = () => {
    switch (code) {
      case 'MISSING_API_KEY':
      case 'INVALID_API_KEY':
        return KeyRound;
      case 'RATE_LIMIT_EXCEEDED':
      case 'BILLING_OR_QUOTA_ERROR':
        return ShieldAlert;
      case 'REQUEST_TIMEOUT':
        return Clock;
      case 'WEB_RESEARCH_FAILED':
        return WifiOff;
      default:
        return AlertTriangle;
    }
  };

  const Icon = getIcon();

  return (
    <div className="max-w-2xl mx-auto py-8 px-4" id="error-alert-container">
      <div className="bg-white border border-rose-200 rounded-2xl p-6 sm:p-8 text-slate-900 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-display text-lg font-bold text-rose-950">
                Itinerary Generation Notice
              </h3>
              {code && (
                <span className="text-[10px] uppercase font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                  {code}
                </span>
              )}
            </div>

            <p className="text-slate-700 text-sm leading-relaxed mb-4">
              {error || 'An error occurred while generating your itinerary.'}
            </p>

            {code === 'MISSING_API_KEY' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 mb-4">
                <span className="font-semibold text-slate-900">How to fix:</span> Set your{' '}
                <code className="bg-white px-1.5 py-0.5 rounded text-teal-800 border border-slate-200 font-mono font-bold">
                  GEMINI_API_KEY
                </code>{' '}
                in your Vercel Project Settings &rarr; Environment Variables, then trigger a <strong>Redeploy</strong> in Vercel.
              </div>
            )}

            {code === 'NETWORK_ERROR' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-950 mb-4 space-y-1.5">
                <span className="font-bold text-blue-900 block">Vercel Deployment Checklist:</span>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li><strong>Trigger a Redeploy:</strong> In Vercel, after saving <code className="font-mono bg-white px-1 py-0.2 rounded text-blue-900">GEMINI_API_KEY</code>, go to <em>Deployments &rarr; Click &quot;...&quot; on latest &rarr; Redeploy</em> so the new variable is injected.</li>
                  <li><strong>Target Environments:</strong> Make sure <em>Production</em> and <em>Preview</em> checkboxes are checked for the variable.</li>
                  <li><strong>Curated Mode:</strong> You can click <em>Generate with Curated Mode</em> below to create a full travel itinerary instantly without waiting!</li>
                </ul>
              </div>
            )}

            {code === 'REQUEST_TIMEOUT' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 mb-4">
                <span className="font-bold">Live Search Timeout:</span> Gemini took longer than Vercel&apos;s serverless execution limit to crawl web sources for this destination. Try clicking <strong>Generate with Curated Mode</strong> below for an immediate complete itinerary.
              </div>
            )}

            {code === 'RATE_LIMIT_EXCEEDED' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 mb-4">
                <span className="font-bold">Gemini Quota Notice:</span> Your Gemini API key has exceeded its current requests/minute or daily free token quota. You can generate instantly using our curated destination engine below or wait a minute to retry.
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              {onCuratedFallback && (
                <button
                  type="button"
                  onClick={onCuratedFallback}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate with Curated Mode</span>
                </button>
              )}

              <button
                type="button"
                onClick={onRetry}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Gemini AI</span>
              </button>

              <button
                type="button"
                onClick={onEditPreferences}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Adjust preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
