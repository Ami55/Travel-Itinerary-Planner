import React, { useState } from 'react';
import { TripPreferences, ItineraryResult, ResearchStatus } from './types';
import { Header } from './components/Header';
import { TripForm } from './components/TripForm';
import { LoadingExperience } from './components/LoadingExperience';
import { ErrorAlert } from './components/ErrorAlert';
import { ItineraryView } from './components/ItineraryView';
import { HowItWorksModal } from './components/HowItWorksModal';
import { generateCuratedItinerary } from '../server/curatedItinerary';
import { HelpCircle } from 'lucide-react';

// Helper to compute a sensible default start date (tomorrow)
const getDefaultStartDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

const DEFAULT_PREFERENCES: TripPreferences = {
  destination: 'Kyoto, Japan',
  startDate: getDefaultStartDate(),
  numberOfDays: 3,
  travellers: 2,
  transportation: 'Walk + transit',
  pace: 'Balanced',
  budget: 'Comfort',
  interests: ['Food', 'Art and culture', 'History'],
};

export default function App() {
  const [preferences, setPreferences] = useState<TripPreferences>(DEFAULT_PREFERENCES);
  const [itinerary, setItinerary] = useState<ItineraryResult | null>(null);
  const [viewState, setViewState] = useState<'form' | 'loading' | 'results' | 'error'>('form');
  const [researchStatus, setResearchStatus] = useState<ResearchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorCode, setErrorCode] = useState<string | undefined>();
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);

  const handleGenerateItinerary = async (currentPrefs: TripPreferences, forceCurated = false) => {
    setPreferences(currentPrefs);
    setViewState('loading');
    setResearchStatus('researching');
    setErrorMessage('');
    setErrorCode(undefined);

    if (forceCurated) {
      try {
        // Quick local curated generation for instant reliability
        const curated = generateCuratedItinerary(currentPrefs);
        setItinerary(curated);
        setViewState('results');
        setResearchStatus('complete');
        return;
      } catch (e) {
        console.error('Local curated generation error:', e);
      }
    }

    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...currentPrefs, forceCurated }),
      });

      const responseText = await response.text();
      let data: any = null;

      try {
        data = JSON.parse(responseText);
      } catch {
        // If response is not JSON (e.g. HTML 504 Gateway Timeout or 500 server error from host)
        if (response.status === 504) {
          setErrorMessage(
            'The request timed out during live web research. In Vercel, functions timeout after a short duration. You can generate instantly in Curated Mode or retry.'
          );
          setErrorCode('REQUEST_TIMEOUT');
        } else if (response.status === 404) {
          setErrorMessage(
            'The /api/generate-itinerary endpoint was not found. If recently deployed to Vercel, please ensure the project was redeployed after configuring environment variables.'
          );
          setErrorCode('NOT_FOUND');
        } else {
          setErrorMessage(
            `Server returned status ${response.status}. Please check your Vercel deployment logs or generate in Curated Mode.`
          );
          setErrorCode('SERVER_ERROR');
        }
        setViewState('error');
        setResearchStatus('failed');
        return;
      }

      if (!response.ok || !data?.success) {
        const message =
          data?.error || 'Failed to generate itinerary. Please verify your connection and settings.';
        setErrorMessage(message);
        setErrorCode(data?.code || (response.status === 401 ? 'INVALID_API_KEY' : 'SERVER_ERROR'));
        setViewState('error');
        setResearchStatus('failed');
        return;
      }

      setItinerary(data.itinerary);
      setViewState('results');
      setResearchStatus('complete');
    } catch (err: any) {
      console.error('Network or fetch error:', err);
      setErrorMessage(
        'Unable to connect to the itinerary generation server. If using Vercel, please check your Environment Variables (GEMINI_API_KEY or GOOGLE_API_KEY) and trigger a Redeploy in Vercel.'
      );
      setErrorCode('NETWORK_ERROR');
      setViewState('error');
      setResearchStatus('failed');
    }
  };

  const handleRetry = () => {
    handleGenerateItinerary(preferences);
  };

  const handleCuratedFallback = () => {
    handleGenerateItinerary(preferences, true);
  };

  const handleEditPreferences = () => {
    setViewState('form');
    if (researchStatus === 'failed') {
      setResearchStatus('idle');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      {/* Top Header */}
      <Header
        researchStatus={researchStatus}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {viewState === 'form' && (
          <TripForm
            initialValues={preferences}
            onSubmit={(prefs) => handleGenerateItinerary(prefs)}
            isLoading={false}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          />
        )}

        {viewState === 'loading' && (
          <LoadingExperience destination={preferences.destination} />
        )}

        {viewState === 'error' && (
          <ErrorAlert
            error={errorMessage}
            code={errorCode}
            onRetry={handleRetry}
            onEditPreferences={handleEditPreferences}
            onCuratedFallback={handleCuratedFallback}
          />
        )}

        {viewState === 'results' && itinerary && (
          <ItineraryView
            itinerary={itinerary}
            onEditPreferences={handleEditPreferences}
            onRegenerate={handleRetry}
          />
        )}
      </main>

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3">
            <span className="font-medium text-slate-700">
              &copy; 2026 Travel Planner Inc. Developed by Ami - SEO Girl. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              type="button"
              onClick={() => setIsHowItWorksOpen(true)}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-teal-700 font-medium transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>How it works</span>
            </button>
            <span>&bull;</span>
            <span>Live Web Intelligence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
