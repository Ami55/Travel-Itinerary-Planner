import React from 'react';
import { Compass, Globe, Loader2, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { ResearchStatus } from '../types';

interface HeaderProps {
  researchStatus: ResearchStatus;
  onOpenHowItWorks?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ researchStatus, onOpenHowItWorks }) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 transition-all no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-teal-900 flex items-center justify-center text-teal-300 shadow-sm border border-slate-700/40">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl tracking-tight text-slate-900">
                Travel Itinerary Planner
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Personalized, geographically sensible itineraries powered by live web research
            </p>
          </div>
        </div>

        {/* Dynamic Live Web Research Status Badge & How it works button */}
        <div className="flex items-center gap-3">
          {onOpenHowItWorks && (
            <button
              type="button"
              id="btn-header-how-it-works"
              onClick={onOpenHowItWorks}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 hover:text-teal-900 bg-slate-100 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 transition-all cursor-pointer shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>How it works</span>
            </button>
          )}

          {researchStatus === 'idle' && (
            <div
              id="badge-web-research-idle"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200 shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
              <span className="hidden sm:inline">Live web research</span>
              <span className="sm:hidden">Live web</span>
            </div>
          )}

          {researchStatus === 'researching' && (
            <div
              id="badge-web-research-active"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-800 border border-sky-200 animate-pulse"
            >
              <Loader2 className="w-3.5 h-3.5 text-sky-600 animate-spin" />
              <span className="hidden sm:inline">Researching your destination</span>
              <span className="sm:hidden">Researching...</span>
            </div>
          )}

          {researchStatus === 'complete' && (
            <div
              id="badge-web-research-complete"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Web research complete</span>
              <span className="sm:hidden">Complete</span>
            </div>
          )}

          {researchStatus === 'failed' && (
            <div
              id="badge-web-research-failed"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Research unavailable</span>
              <span className="sm:hidden">Unavailable</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
