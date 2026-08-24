import React, { useEffect, useState } from 'react';
import { Compass, Search, CalendarCheck, MapPinned, Loader2 } from 'lucide-react';

interface LoadingExperienceProps {
  destination: string;
}

const STAGES = [
  {
    id: 1,
    title: 'Understanding your travel preferences',
    description: 'Analyzing pace, budget style, group size, and interest mix...',
    icon: Compass,
    durationMs: 4000,
  },
  {
    id: 2,
    title: 'Researching current destination information',
    description: 'Conducting live web search for official attraction sites, events & regional updates...',
    icon: Search,
    durationMs: 7000,
  },
  {
    id: 3,
    title: 'Checking attractions, hours and logistics',
    description: 'Verifying opening days, seasonal closures, reservation requirements, and transit routes...',
    icon: CalendarCheck,
    durationMs: 8000,
  },
  {
    id: 4,
    title: 'Building a practical day-by-day route',
    description: 'Grouping nearby stops, balancing walking distances, and assembling meal spots...',
    icon: MapPinned,
    durationMs: 12000,
  },
];

const TRAVEL_TIPS = [
  'Checking official tourism listings and museum schedules for seasonal holiday hours...',
  'Verifying advance booking requirements to prevent entry issues...',
  'Calculating transit times between neighborhoods to avoid unnecessary cross-town travel...',
  'Curating authentic dining recommendations near your afternoon stops...',
];

export const LoadingExperience: React.FC<LoadingExperienceProps> = ({ destination }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    // Progress through stages
    const timeouts: NodeJS.Timeout[] = [];
    let accumulatedTime = 0;

    STAGES.forEach((stage, idx) => {
      if (idx > 0) {
        accumulatedTime += STAGES[idx - 1].durationMs;
        const t = setTimeout(() => {
          setCurrentStageIdx(idx);
        }, accumulatedTime);
        timeouts.push(t);
      }
    });

    // Tip rotation
    const tipInterval = setInterval(() => {
      setTipIdx((prev) => (prev + 1) % TRAVEL_TIPS.length);
    }, 4500);

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
      clearInterval(tipInterval);
    };
  }, []);

  const progressPercent = Math.min(15 + currentStageIdx * 25, 92);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-lg relative overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-400/10 rounded-full blur-2xl animate-pulse" />

        {/* Central Icon */}
        <div className="relative z-10 mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-teal-900 text-teal-300 flex items-center justify-center shadow-md ring-4 ring-teal-50 border border-slate-700/50">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 mb-2">
          Researching {destination || 'your destination'}...
        </h2>
        <p className="text-slate-500 text-sm mb-8">
          Conducting live web research to ensure hours, tickets, and logistical routes are accurate.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2.5 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 4 Multi-Stage Steps */}
        <div className="space-y-3.5 text-left max-w-md mx-auto mb-8">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isCurrent
                    ? 'border-teal-500 bg-teal-50/50 shadow-xs'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/40 opacity-90'
                    : 'border-slate-100 bg-slate-50/50 opacity-40'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isCurrent
                      ? 'bg-teal-600 text-white font-bold'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs font-semibold ${
                        isCurrent ? 'text-slate-900' : isCompleted ? 'text-emerald-900' : 'text-slate-500'
                      }`}
                    >
                      {stage.title}
                    </p>
                    {isCurrent && (
                      <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded">
                        In progress
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] font-bold text-emerald-700">✓ Done</span>
                    )}
                  </div>
                  {isCurrent && (
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      {stage.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Research Note Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping shrink-0" />
          <p className="text-xs text-slate-600 italic">
            {TRAVEL_TIPS[tipIdx]}
          </p>
        </div>
      </div>
    </div>
  );
};
