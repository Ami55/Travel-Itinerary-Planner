import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Footprints,
  Sparkles,
  Utensils,
  Landmark,
  Compass,
  TreePine,
  Gem,
  ShoppingBag,
  Moon,
  Baby,
  ArrowRight,
  HelpCircle,
  Car,
  Bus,
  Search,
  Check,
  Globe2,
  CornerDownLeft,
} from 'lucide-react';
import {
  TripPreferences,
  TravelPace,
  BudgetLevel,
  TransportationPreference,
  SupportedInterest,
} from '../types';
import { searchDestinations, WORLD_DESTINATIONS, DestinationItem } from '../data/destinations';

interface TripFormProps {
  initialValues: TripPreferences;
  onSubmit: (preferences: TripPreferences) => void;
  isLoading: boolean;
  onOpenHowItWorks?: () => void;
}

const INTERESTS_CONFIG: Array<{
  id: SupportedInterest;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'Food', label: 'Food & Dining', icon: Utensils },
  { id: 'Art and culture', label: 'Art & Culture', icon: Landmark },
  { id: 'History', label: 'History & Heritage', icon: Compass },
  { id: 'Nature', label: 'Nature & Parks', icon: TreePine },
  { id: 'Hidden gems', label: 'Hidden Gems', icon: Gem },
  { id: 'Shopping', label: 'Shopping & Markets', icon: ShoppingBag },
  { id: 'Nightlife', label: 'Nightlife & Evening', icon: Moon },
  { id: 'Family-friendly', label: 'Family-Friendly', icon: Baby },
];

const POPULAR_DESTINATIONS = [
  'Kyoto, Japan',
  'Rome, Italy',
  'Barcelona, Spain',
  'Oaxaca, Mexico',
  'Banff, Canada',
  'Lisbon, Portugal',
];

export const TripForm: React.FC<TripFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  onOpenHowItWorks,
}) => {
  const [destination, setDestination] = useState(initialValues.destination);
  const [startDate, setStartDate] = useState(initialValues.startDate);
  const [numberOfDays, setNumberOfDays] = useState(initialValues.numberOfDays);
  const [travellers, setTravellers] = useState(initialValues.travellers);
  const [transportation, setTransportation] = useState<TransportationPreference>(
    initialValues.transportation
  );
  const [pace, setPace] = useState<TravelPace>(initialValues.pace);
  const [budget, setBudget] = useState<BudgetLevel>(initialValues.budget);
  const [interests, setInterests] = useState<SupportedInterest[]>(initialValues.interests);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Autocomplete state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<DestinationItem[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update suggestions when destination changes
  useEffect(() => {
    if (destination.trim().length > 0) {
      const results = searchDestinations(destination);
      setSuggestions(results);
      setHighlightedIndex(-1);
    } else {
      setSuggestions(WORLD_DESTINATIONS.filter((d) => d.popular).slice(0, 8));
    }
  }, [destination]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper to select a destination item and format as City, Country
  const selectDestinationItem = (item: DestinationItem, triggerSubmit = false) => {
    const formatted = `${item.city}, ${item.country}`;
    setDestination(formatted);
    setIsDropdownOpen(false);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.destination;
      return copy;
    });

    if (triggerSubmit && !isLoading) {
      onSubmit({
        destination: formatted,
        startDate,
        numberOfDays,
        travellers,
        transportation,
        pace,
        budget,
        interests,
      });
    }
  };

  // Helper when user searches or presses Enter
  const handleDestinationSearchOrEnter = (autoSubmit = true) => {
    let finalDest = destination.trim();
    if (!finalDest) {
      setErrors((prev) => ({ ...prev, destination: 'Please enter a city or destination name.' }));
      inputRef.current?.focus();
      return;
    }

    // Check if user selected via arrow navigation
    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      const item = suggestions[highlightedIndex];
      finalDest = `${item.city}, ${item.country}`;
    } else {
      // Check if query is just a city name, find closest match and auto-complete to "City, Country"
      const queryLower = finalDest.toLowerCase();
      const exactMatch = WORLD_DESTINATIONS.find(
        (d) =>
          d.city.toLowerCase() === queryLower ||
          `${d.city.toLowerCase()}, ${d.country.toLowerCase()}` === queryLower
      );

      if (exactMatch) {
        finalDest = `${exactMatch.city}, ${exactMatch.country}`;
      } else if (suggestions.length > 0) {
        // Pick top matching suggestion if prefix matches
        const topMatch = suggestions[0];
        if (
          topMatch.city.toLowerCase().startsWith(queryLower) ||
          queryLower.startsWith(topMatch.city.toLowerCase())
        ) {
          finalDest = `${topMatch.city}, ${topMatch.country}`;
        }
      }
    }

    setDestination(finalDest);
    setIsDropdownOpen(false);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.destination;
      return copy;
    });

    if (autoSubmit && !isLoading) {
      // Run validation for other fields
      if (!startDate) {
        setErrors((prev) => ({ ...prev, startDate: 'Please select a valid start date.' }));
        return;
      }
      if (!numberOfDays || numberOfDays < 1) {
        setErrors((prev) => ({ ...prev, numberOfDays: 'At least 1 day is required.' }));
        return;
      }
      if (interests.length === 0) {
        setErrors((prev) => ({ ...prev, interests: 'Please select at least one interest.' }));
        return;
      }

      onSubmit({
        destination: finalDest,
        startDate,
        numberOfDays,
        travellers,
        transportation,
        pace,
        budget,
        interests,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
      }
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleDestinationSearchOrEnter(true);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  const toggleInterest = (interest: SupportedInterest) => {
    if (interests.includes(interest)) {
      if (interests.length === 1) {
        setErrors((prev) => ({ ...prev, interests: 'Select at least one interest' }));
        return;
      }
      setInterests(interests.filter((i) => i !== interest));
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.interests;
        return copy;
      });
    } else {
      setInterests([...interests, interest]);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.interests;
        return copy;
      });
    }
  };

  const handleValidation = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!destination || destination.trim().length === 0) {
      newErrors.destination = 'Destination is required.';
    }

    if (!startDate) {
      newErrors.startDate = 'Please select a valid start date.';
    }

    if (!numberOfDays || numberOfDays < 1) {
      newErrors.numberOfDays = 'At least 1 day is required.';
    } else if (numberOfDays > 21) {
      newErrors.numberOfDays = 'Maximum 21 days allowed per itinerary.';
    }

    if (!travellers || travellers < 1) {
      newErrors.travellers = 'At least 1 traveller is required.';
    }

    if (interests.length === 0) {
      newErrors.interests = 'Please select at least one interest.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (handleValidation()) {
      onSubmit({
        destination: destination.trim(),
        startDate,
        numberOfDays,
        travellers,
        transportation,
        pace,
        budget,
        interests,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" id="semanticmapper-trip-form">
      {/* Top Banner with Overview */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800/80">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-teal-300 text-xs font-medium shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Real-time destination search & itinerary engine</span>
            </div>
            {onOpenHowItWorks && (
              <button
                type="button"
                onClick={onOpenHowItWorks}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 text-teal-200 hover:text-white text-xs font-medium transition-all cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-teal-300" />
                <span>How it works</span>
              </button>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Plan your next journey with live web intelligence
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Our travel planner conducts live web research across official attraction websites, opening hours, seasonal schedules, and transit connections to craft a personalized, realistic day-by-day travel route.
          </p>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Destination & Autocomplete Search Bar */}
        <div ref={dropdownRef} className="relative">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="destination-input" className="block text-sm font-semibold text-slate-900">
              Where are you traveling? <span className="text-teal-600">*</span>
            </label>
            <span className="text-xs text-slate-500">Auto-suggests City & Country</span>
          </div>

          <div className="relative">
            {/* Left Location Icon */}
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-5 h-5" />
            </div>

            {/* Input field */}
            <input
              ref={inputRef}
              id="destination-input"
              type="text"
              value={destination}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setDestination(e.target.value);
                setIsDropdownOpen(true);
                if (errors.destination) {
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.destination;
                    return copy;
                  });
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter city (e.g. Rome, Tokyo, Paris, Oaxaca)..."
              autoComplete="off"
              className={`w-full pl-11 pr-36 py-3 rounded-xl border ${
                errors.destination
                  ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-500 focus:border-rose-500'
                  : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600'
              } text-slate-900 placeholder:text-slate-400 transition-all text-base font-medium`}
            />

            {/* Right-side Action Button: Search / Enter */}
            <div className="absolute inset-y-1.5 right-1.5 flex items-center">
              <button
                type="button"
                id="btn-search-destination"
                onClick={() => handleDestinationSearchOrEnter(true)}
                title="Search destination and create itinerary (Enter)"
                className="h-full px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="font-bold">Search</span>
                <span className="inline-flex items-center text-[10px] opacity-90 font-mono bg-teal-700/80 px-1 py-0.5 rounded ml-0.5">
                  <CornerDownLeft className="w-2.5 h-2.5" />
                </span>
              </button>
            </div>
          </div>

          {errors.destination && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.destination}</p>
          )}

          {/* Autocomplete Dropdown popup */}
          {isDropdownOpen && suggestions.length > 0 && (
            <div
              id="destination-autocomplete-dropdown"
              className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="px-3.5 py-2 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Suggested Destinations</span>
                <span className="text-[10px] text-slate-400 font-normal">Click to select & search</span>
              </div>

              {suggestions.map((item, idx) => {
                const isSelected = highlightedIndex === idx;
                const formatted = `${item.city}, ${item.country}`;
                const isCurrentMatch = destination.toLowerCase() === formatted.toLowerCase();

                return (
                  <button
                    key={`${item.city}-${item.country}-${idx}`}
                    type="button"
                    onClick={() => selectDestinationItem(item, false)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50/80 text-teal-950'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Globe2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-sm text-slate-900">{item.city}</span>
                        <span className="text-slate-400 mx-1.5">,</span>
                        <span className="text-xs font-semibold text-teal-700">{item.country}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.continent && (
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full hidden sm:inline">
                          {item.continent}
                        </span>
                      )}
                      {isCurrentMatch && (
                        <Check className="w-4 h-4 text-teal-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick inspiration chips */}
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Popular:</span>
            {POPULAR_DESTINATIONS.map((pop) => (
              <button
                key={pop}
                type="button"
                onClick={() => {
                  setDestination(pop);
                  setIsDropdownOpen(false);
                  if (errors.destination) {
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.destination;
                      return copy;
                    });
                  }
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-900 border border-slate-200/80 hover:border-teal-200 text-slate-700 transition-all font-medium cursor-pointer"
              >
                {pop}
              </button>
            ))}
          </div>
        </div>

        {/* Dates, Duration & Travellers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Start Date */}
          <div>
            <label htmlFor="start-date-input" className="block text-sm font-semibold text-slate-900 mb-1.5">
              Start Date <span className="text-teal-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                id="start-date-input"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (errors.startDate) {
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.startDate;
                      return copy;
                    });
                  }
                }}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${
                  errors.startDate
                    ? 'border-rose-400 bg-rose-50/30'
                    : 'border-slate-200 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600'
                } text-slate-900 text-sm font-medium transition-all`}
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.startDate}</p>
            )}
          </div>

          {/* Number of Days */}
          <div>
            <label htmlFor="days-input" className="block text-sm font-semibold text-slate-900 mb-1.5">
              Number of Days <span className="text-teal-600">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Clock className="w-4 h-4" />
              </div>
              <input
                id="days-input"
                type="number"
                min={1}
                max={21}
                value={numberOfDays}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setNumberOfDays(isNaN(val) ? 1 : val);
                  if (errors.numberOfDays) {
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.numberOfDays;
                      return copy;
                    });
                  }
                }}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${
                  errors.numberOfDays
                    ? 'border-rose-400 bg-rose-50/30'
                    : 'border-slate-200 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600'
                } text-slate-900 text-sm font-medium transition-all`}
              />
            </div>
            {errors.numberOfDays && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.numberOfDays}</p>
            )}
          </div>

          {/* Travellers */}
          <div>
            <label htmlFor="travellers-input" className="block text-sm font-semibold text-slate-900 mb-1.5">
              Travellers <span className="text-teal-600">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Users className="w-4 h-4" />
              </div>
              <input
                id="travellers-input"
                type="number"
                min={1}
                max={20}
                value={travellers}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setTravellers(isNaN(val) ? 1 : val);
                  if (errors.travellers) {
                    setErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.travellers;
                      return copy;
                    });
                  }
                }}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border ${
                  errors.travellers
                    ? 'border-rose-400 bg-rose-50/30'
                    : 'border-slate-200 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-teal-600 focus:border-teal-600'
                } text-slate-900 text-sm font-medium transition-all`}
              />
            </div>
            {errors.travellers && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.travellers}</p>
            )}
          </div>
        </div>

        {/* Transportation Preference */}
        <div className="pt-2">
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Transportation Preference
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {(
              [
                { id: 'Walk + transit', label: 'Walk + Transit', icon: Footprints },
                { id: 'Walking mainly', label: 'Walking Mainly', icon: Footprints },
                { id: 'Public transit', label: 'Public Transit', icon: Bus },
                { id: 'Rental car', label: 'Rental Car', icon: Car },
                { id: 'Taxis & rideshares', label: 'Taxis & Rides', icon: Car },
              ] as const
            ).map((item) => {
              const isSelected = transportation === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTransportation(item.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-teal-300' : 'text-slate-500'}`} />
                  <span className="text-xs font-semibold leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Travel Pace & Budget Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Travel Pace */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-900">Travel Pace</label>
              <span className="text-xs text-slate-500">Activity density</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  {
                    id: 'Relaxed' as TravelPace,
                    title: 'Relaxed',
                    subtitle: '2–3 activities/day',
                    desc: 'Longer meals & flexible downtime',
                  },
                  {
                    id: 'Balanced' as TravelPace,
                    title: 'Balanced',
                    subtitle: '3–4 activities/day',
                    desc: 'Moderate walking & sensible breaks',
                  },
                  {
                    id: 'Full' as TravelPace,
                    title: 'Full',
                    subtitle: '4–6 activities/day',
                    desc: 'Structured & early starts',
                  },
                ] as const
              ).map((p) => {
                const isSelected = pace === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPace(p.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs ring-2 ring-slate-900/10'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm">{p.title}</div>
                      <div className={`text-[11px] font-medium mt-0.5 ${isSelected ? 'text-teal-300' : 'text-slate-500'}`}>
                        {p.subtitle}
                      </div>
                    </div>
                    <div className={`text-[10px] mt-2 leading-tight ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {p.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-900">Budget Style</label>
              <span className="text-xs text-slate-500">Attractions & dining</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  {
                    id: 'Budget' as BudgetLevel,
                    title: 'Budget',
                    badge: '$',
                    desc: 'Free sights & affordable dining',
                  },
                  {
                    id: 'Comfort' as BudgetLevel,
                    title: 'Comfort',
                    badge: '$$',
                    desc: 'Balanced mid-range experiences',
                  },
                  {
                    id: 'Premium' as BudgetLevel,
                    title: 'Premium',
                    badge: '$$$',
                    desc: 'Elevated & exclusive dining/tours',
                  },
                ] as const
              ).map((b) => {
                const isSelected = budget === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBudget(b.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs ring-2 ring-slate-900/10'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{b.title}</span>
                      <span className={`text-xs font-mono font-bold ${isSelected ? 'text-teal-300' : 'text-slate-500'}`}>
                        {b.badge}
                      </span>
                    </div>
                    <div className={`text-[10px] mt-2 leading-tight ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {b.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-slate-900">
              Interests & Focus Areas <span className="text-teal-600">*</span>
            </label>
            <span className="text-xs text-slate-500">Choose all that apply</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {INTERESTS_CONFIG.map((item) => {
              const isSelected = interests.includes(item.id);
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleInterest(item.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/80 text-teal-950 ring-1 ring-teal-600 shadow-xs'
                      : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
          {errors.interests && (
            <p className="mt-2 text-xs text-rose-600 font-medium">{errors.interests}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Web research checks opening days, reservations & transit connections before building your schedule.</span>
          </div>

          <button
            id="btn-create-itinerary"
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm text-white bg-teal-600 hover:bg-teal-500 active:bg-teal-700 shadow-md shadow-teal-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <span>Create my itinerary</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
};
