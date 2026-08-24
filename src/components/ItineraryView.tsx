import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Footprints,
  DollarSign,
  Printer,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Lightbulb,
  CloudRain,
  Utensils,
  Globe,
  MapPin,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { ItineraryResult, SourceCitation } from '../types';
import { ActivityCard } from './ActivityCard';

interface ItineraryViewProps {
  itinerary: ItineraryResult;
  onEditPreferences: () => void;
  onRegenerate: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  onEditPreferences,
  onRegenerate,
}) => {
  const { trip, importantBeforeYouGo, days, sources, disclaimer } = itinerary;

  // Map sources by ID for fast lookup
  const sourcesMap = useMemo(() => {
    const map = new Map<string, SourceCitation>();
    if (Array.isArray(sources)) {
      sources.forEach((s) => {
        if (s.id) map.set(s.id, s);
        if (s.title) map.set(s.title, s);
      });
    }
    return map;
  }, [sources]);

  // Track expanded days (default all expanded)
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    if (days) {
      days.forEach((d) => {
        initial[d.day] = true;
      });
    }
    return initial;
  });

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  const expandAll = () => {
    const allExp: Record<number, boolean> = {};
    days.forEach((d) => {
      allExp[d.day] = true;
    });
    setExpandedDays(allExp);
  };

  const collapseAll = () => {
    setExpandedDays({});
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16" id="semanticmapper-itinerary-result">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs no-print">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-900">
            Itinerary verified with live web research
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onEditPreferences}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
            <span>Edit trip preferences</span>
          </button>

          <button
            type="button"
            onClick={onRegenerate}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>Generate again</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-teal-300" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Destination & Overview Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden print-card border border-slate-800/80">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 bottom-0 -mb-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-teal-300 text-xs font-semibold shadow-xs">
              <Compass className="w-3.5 h-3.5 text-teal-400" />
              <span>{trip.country || 'Customized Trip'}</span>
            </div>

            <div className="text-xs text-slate-300 font-mono">
              {trip.startDate} {trip.endDate ? `to ${trip.endDate}` : ''} ({trip.numberOfDays} {trip.numberOfDays === 1 ? 'Day' : 'Days'})
            </div>
          </div>

          <div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
              {trip.destination}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {trip.summary}
            </p>
          </div>

          {/* Preference Pill Strip */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Pace</span>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-300" />
                <span>{trip.pace}</span>
              </div>
            </div>

            <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Budget</span>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-teal-300" />
                <span>{trip.budget}</span>
              </div>
            </div>

            <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Transit</span>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-teal-300" />
                <span>{trip.transportation}</span>
              </div>
            </div>

            <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Travellers</span>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-300" />
                <span>{trip.travellers} {trip.travellers === 1 ? 'person' : 'people'}</span>
              </div>
            </div>
          </div>

          {/* Interests tags */}
          {trip.interests && trip.interests.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              <span className="text-xs text-slate-400 font-medium mr-1">Interests:</span>
              {trip.interests.map((interest) => (
                <span
                  key={interest}
                  className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800/90 text-teal-200 border border-slate-700"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Seasonal & Date Advisory Notice */}
      {trip.seasonalNote && (
        <div className="bg-sky-50/90 border border-sky-200 rounded-2xl p-5 text-sky-950 flex items-start gap-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-sky-950 mb-1">
              Seasonal & Date Considerations ({trip.startDate})
            </h4>
            <p className="text-xs sm:text-sm text-sky-900 leading-relaxed">
              {trip.seasonalNote}
            </p>
          </div>
        </div>
      )}

      {/* Important Before You Go Panel */}
      {importantBeforeYouGo && importantBeforeYouGo.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-teal-300 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Important Before You Go
              </h3>
              <p className="text-xs text-slate-500">
                Essential logistics, ticketing requirements & local navigation tips verified for your trip
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {importantBeforeYouGo.map((tip, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="font-semibold text-xs text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{tip.title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {tip.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day-by-Day Itinerary Header Controls */}
      <div className="flex items-center justify-between pt-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Day-by-Day Itinerary
          </h2>
          <p className="text-xs text-slate-500">
            Geographically grouped routes with verified opening times & transit
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            type="button"
            onClick={expandAll}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-6">
        {days.map((dayPlan) => {
          const isExpanded = expandedDays[dayPlan.day] ?? true;

          return (
            <div
              key={dayPlan.day}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden print-break-inside-avoid print-card transition-all"
            >
              {/* Day Header Accordion Toggle */}
              <button
                type="button"
                onClick={() => toggleDay(dayPlan.day)}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 bg-slate-50/70 hover:bg-slate-100/80 transition-colors cursor-pointer border-b border-slate-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-teal-300 flex flex-col items-center justify-center shrink-0 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Day</span>
                    <span className="font-display text-base font-bold leading-none">{dayPlan.day}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap mb-1">
                      <span className="text-xs font-mono font-semibold text-slate-500">
                        {dayPlan.date}
                      </span>
                      {dayPlan.neighbourhoods && dayPlan.neighbourhoods.length > 0 && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-600 font-medium">
                            {dayPlan.neighbourhoods.join(' • ')}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
                      {dayPlan.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                      {dayPlan.overview}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {dayPlan.estimatedWalking && (
                    <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                      <Footprints className="w-3.5 h-3.5 text-slate-400" />
                      <span>{dayPlan.estimatedWalking}</span>
                    </div>
                  )}

                  <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600 no-print">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </button>

              {/* Day Details Body */}
              {isExpanded && (
                <div className="p-5 sm:p-7 space-y-6">
                  {/* Activities Timeline */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                      <span>Timeline & Activities</span>
                      <span className="flex-1 h-px bg-slate-100" />
                    </h4>

                    <div className="relative border-l-2 border-slate-200 ml-3 sm:ml-4 space-y-2">
                      {dayPlan.activities.map((activity, actIdx) => (
                        <ActivityCard
                          key={actIdx}
                          activity={activity}
                          index={actIdx}
                          sourcesMap={sourcesMap}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Meals, Rain Alternative & Local Tip Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                    {/* Meal Suggestions */}
                    {dayPlan.mealSuggestions && dayPlan.mealSuggestions.length > 0 && (
                      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2.5">
                            <Utensils className="w-4 h-4 text-teal-700" />
                            <span>Recommended Dining</span>
                          </div>

                          <div className="space-y-3">
                            {dayPlan.mealSuggestions.map((meal, mIdx) => (
                              <div key={mIdx} className="text-xs">
                                <div className="flex items-center justify-between font-semibold text-slate-900">
                                  <span>{meal.meal}: {meal.name}</span>
                                  <span className="text-[11px] font-mono text-slate-500">{meal.priceLevel}</span>
                                </div>
                                <div className="text-[11px] text-slate-500 mb-1">{meal.area}</div>
                                <p className="text-slate-600 text-[11px] leading-relaxed">
                                  {meal.whyRecommended}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rain / Weather Alternative */}
                    {dayPlan.rainAlternative && (
                      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2.5">
                            <CloudRain className="w-4 h-4 text-sky-600" />
                            <span>Weather Backup Plan</span>
                          </div>
                          <div className="text-xs font-semibold text-slate-900 mb-1">
                            {dayPlan.rainAlternative.name}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {dayPlan.rainAlternative.details}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Local Insider Tip */}
                    {dayPlan.localTip && (
                      <div className="bg-teal-50/60 rounded-xl p-4 border border-teal-200/80 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950 mb-2.5">
                            <Lightbulb className="w-4 h-4 text-teal-700" />
                            <span>Local Insider Tip</span>
                          </div>
                          <p className="text-xs text-teal-900 leading-relaxed">
                            {dayPlan.localTip}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sources & Citations Section */}
      {sources && sources.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs" id="sources-section">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-teal-600" />
              <h3 className="font-display font-bold text-lg text-slate-900">
                Verified Web Sources & Citations
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {sources.length} {sources.length === 1 ? 'source' : 'sources'} consulted
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-5 leading-relaxed">
            All itinerary schedules, ticket booking guidelines, and attraction details were verified against current official websites and tourism data:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sources.map((src, idx) => (
              <a
                key={src.id || idx}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-teal-400 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-900 mb-1 group-hover:text-teal-800">
                    <span className="line-clamp-1">{src.title || 'Official Website'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0 ml-1" />
                  </div>
                  {src.publisher && (
                    <div className="text-[11px] text-slate-500 font-medium mb-1">
                      {src.publisher}
                    </div>
                  )}
                  {src.accessedFor && (
                    <p className="text-[10px] text-slate-600 line-clamp-2 leading-tight">
                      {src.accessedFor}
                    </p>
                  )}
                </div>

                <div className="text-[10px] text-teal-700 font-mono font-medium mt-2 flex items-center gap-1">
                  <span>✓ Verified link</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-slate-100 rounded-xl p-4 text-xs text-slate-500 leading-relaxed border border-slate-200/80 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-700">Notice: </span>
          {disclaimer ||
            'Opening hours, prices, availability and local conditions can change. Always confirm important details before visiting.'}
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-center gap-3 pt-4 no-print">
        <button
          type="button"
          onClick={onEditPreferences}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
          <span>Edit trip preferences</span>
        </button>

        <button
          type="button"
          onClick={onRegenerate}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-600/20 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-white" />
          <span>Generate again</span>
        </button>
      </div>
    </div>
  );
};
