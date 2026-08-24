import React from 'react';
import {
  Clock,
  MapPin,
  DollarSign,
  Ticket,
  Footprints,
  ExternalLink,
  AlertTriangle,
  Sun,
  Umbrella,
  Layers,
  Utensils,
  Landmark,
  Compass,
  Coffee,
  Sparkles,
} from 'lucide-react';
import { Activity, ReservationStatus, SourceCitation } from '../types';

interface ActivityCardProps {
  activity: Activity;
  index: number;
  sourcesMap: Map<string, SourceCitation>;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, index, sourcesMap }) => {
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'food':
        return Utensils;
      case 'transit':
        return Footprints;
      case 'break':
        return Coffee;
      case 'experience':
        return Sparkles;
      case 'attraction':
      default:
        return Landmark;
    }
  };

  const getReservationBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'Required':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
            <Ticket className="w-3 h-3" />
            <span>Ticket Required</span>
          </span>
        );
      case 'Recommended':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 border border-teal-200">
            <Ticket className="w-3 h-3 text-teal-700" />
            <span>Booking Recommended</span>
          </span>
        );
      case 'Verify':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            <span>Verify Booking</span>
          </span>
        );
      case 'Not needed':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            <span>Walk-in / Free</span>
          </span>
        );
    }
  };

  const getEnvironmentBadge = (env: string) => {
    if (env === 'Indoor') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 font-medium px-2 py-0.5 rounded bg-slate-100">
          <Umbrella className="w-3 h-3 text-slate-500" />
          <span>Indoor</span>
        </span>
      );
    }
    if (env === 'Outdoor') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 font-medium px-2 py-0.5 rounded bg-slate-100">
          <Sun className="w-3 h-3 text-amber-500" />
          <span>Outdoor</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 font-medium px-2 py-0.5 rounded bg-slate-100">
        <Layers className="w-3 h-3 text-slate-500" />
        <span>Indoor / Outdoor</span>
      </span>
    );
  };

  const Icon = getCategoryIcon(activity.category);
  const isVerifyWarning =
    activity.verificationNote ||
    activity.reservation === 'Verify' ||
    activity.description.toLowerCase().includes('verify before visiting');

  return (
    <div className="relative pl-6 sm:pl-8 group">
      {/* Timeline connector dot */}
      <div className="absolute left-0 top-1.5 -ml-1.5 w-6 h-6 rounded-full bg-slate-900 text-teal-300 flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-xs z-10 ring-2 ring-slate-100">
        {index + 1}
      </div>

      {/* Transit Transition Notice (if present) */}
      {activity.travelFromPrevious && (
        <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
          <Footprints className="w-3.5 h-3.5 text-slate-500" />
          <span>{activity.travelFromPrevious}</span>
        </div>
      )}

      {/* Activity Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all mb-6 print-card">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2.5">
          <div>
            {/* Time Slot & Category */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-900 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded">
                <Clock className="w-3 h-3 text-teal-700" />
                {activity.startTime} – {activity.endTime}
              </span>
              <span className="text-xs font-semibold text-slate-600 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 flex items-center gap-1">
                <Icon className="w-3 h-3 text-slate-500" />
                {activity.category}
              </span>
            </div>

            {/* Name & Location */}
            <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 tracking-tight">
              {activity.name}
            </h4>
            {activity.location && (
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{activity.location}</span>
              </p>
            )}
          </div>

          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap sm:justify-end shrink-0">
            {getReservationBadge(activity.reservation)}
            {getEnvironmentBadge(activity.indoorOutdoor)}
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-3">
          {activity.description}
        </p>

        {/* Verification Warning Alert if details couldn't be fully confirmed */}
        {isVerifyWarning && (
          <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-start gap-2 text-amber-950 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Verify before visiting:</span>{' '}
              {activity.verificationNote || 'Check current official opening hours or ticket availability before arriving.'}
            </div>
          </div>
        )}

        {/* Card Footer: Estimated Cost & Source Citations */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-600 font-medium">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            <span>Cost: {activity.estimatedCost || 'Free / Included'}</span>
          </div>

          {/* Source Citations */}
          {activity.sourceIds && activity.sourceIds.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium">Researched via:</span>
              {activity.sourceIds.map((srcId) => {
                const src = sourcesMap.get(srcId);
                if (!src) {
                  return (
                    <span
                      key={srcId}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono"
                    >
                      {srcId}
                    </span>
                  );
                }
                return (
                  <a
                    key={srcId}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-900 border border-slate-200 hover:border-teal-300 transition-colors font-medium cursor-pointer"
                    title={`${src.title} (${src.publisher || 'Web Source'})`}
                  >
                    <span>{src.publisher || src.title.slice(0, 20)}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
