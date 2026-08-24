import React from 'react';
import {
  X,
  Compass,
  Search,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-it-works-title"
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Travel Itinerary Planner Overview</span>
          </div>

          <h2 id="how-it-works-title" className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mb-2">
            How It Works
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Learn how our intelligent travel researcher crafts realistic, personalized, and geographically sensible itineraries using real-time web discovery.
          </p>
        </div>

        {/* Steps Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Step 1 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center shrink-0 shadow-sm">
              1
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Specify Your Trip Preferences</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enter your target city or region, travel dates, group size, budget style ($/$$/$$$), transit preferences, and personal passions (Food, History, Nature, Art, Hidden Gems).
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-900 text-white font-bold flex items-center justify-center shrink-0 shadow-sm">
              2
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-600" />
                <span>Live Grounded Web Research</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our planner performs live web queries to verify operating days, ticket reservation requirements, seasonal closures, and neighborhood logistics from official sources before scheduling your days.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white font-bold flex items-center justify-center shrink-0 shadow-sm">
              3
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-700" />
                <span>Geographic Clustering & Transit Logic</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Activities are clustered by geographic proximity to minimize unnecessary transit time. Each day receives realistic time allocations, meal suggestions, estimated walking metrics, and local tips.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 shadow-sm">
              4
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Custom Alternatives & Verified Citations</span>
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every itinerary includes rainy-day backup activities, essential pre-trip checklist items, and clickable citations linking directly back to researched web sources.
              </p>
            </div>
          </div>

          {/* Pro Tips Box */}
          <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-4.5 text-xs text-teal-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-teal-900 text-sm">
              <Lightbulb className="w-4 h-4 text-teal-700" />
              <span>Pro Tips for the Best Itineraries</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-teal-900/90 leading-relaxed">
              <li>
                <strong>Start Dates:</strong> Choosing your real travel date enables seasonal events, daylight calculations, and specific day-of-week opening checks.
              </li>
              <li>
                <strong>Pace Mode:</strong> Select <em>Relaxed</em> for leisurely café stops and downtime, or <em>Full</em> for ambitious, sight-packed schedules.
              </li>
              <li>
                <strong>Export & Print:</strong> Use the Print / PDF button on the results screen for a clean, paper-friendly travel binder.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-6 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Powered by Travel Intelligence & Web Research Engine
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Got it, let's explore!
          </button>
        </div>
      </div>
    </div>
  );
};
