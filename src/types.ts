export type TravelPace = 'Relaxed' | 'Balanced' | 'Full';
export type BudgetLevel = 'Budget' | 'Comfort' | 'Premium';
export type TransportationPreference =
  | 'Walk + transit'
  | 'Walking mainly'
  | 'Public transit'
  | 'Rental car'
  | 'Taxis & rideshares';

export type SupportedInterest =
  | 'Food'
  | 'Art and culture'
  | 'History'
  | 'Nature'
  | 'Hidden gems'
  | 'Shopping'
  | 'Nightlife'
  | 'Family-friendly';

export interface TripPreferences {
  destination: string;
  startDate: string;
  numberOfDays: number;
  travellers: number;
  transportation: TransportationPreference;
  pace: TravelPace;
  budget: BudgetLevel;
  interests: SupportedInterest[];
}

export type ReservationStatus = 'Not needed' | 'Recommended' | 'Required' | 'Verify';
export type ActivityCategory = 'Attraction' | 'Food' | 'Transit' | 'Break' | 'Experience';
export type EnvironmentType = 'Indoor' | 'Outdoor' | 'Both';

export interface Activity {
  startTime: string;
  endTime: string;
  name: string;
  category: ActivityCategory;
  location: string;
  description: string;
  travelFromPrevious: string;
  estimatedCost: string;
  reservation: ReservationStatus;
  indoorOutdoor: EnvironmentType;
  verificationNote: string | null;
  sourceIds: string[];
}

export interface MealSuggestion {
  meal: string;
  name: string;
  area: string;
  priceLevel: '$' | '$$' | '$$$' | string;
  whyRecommended: string;
  sourceIds: string[];
}

export interface RainAlternative {
  name: string;
  details: string;
  sourceIds: string[];
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  neighbourhoods: string[];
  overview: string;
  estimatedWalking: string;
  activities: Activity[];
  mealSuggestions: MealSuggestion[];
  rainAlternative: RainAlternative;
  localTip: string;
}

export interface ImportantTip {
  title: string;
  details: string;
}

export interface SourceCitation {
  id: string;
  title: string;
  url: string;
  publisher?: string;
  accessedFor?: string;
}

export interface TripMeta {
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  travellers: number;
  pace: TravelPace;
  budget: BudgetLevel;
  transportation: TransportationPreference;
  interests: string[];
  summary: string;
  seasonalNote: string;
}

export interface ItineraryResult {
  trip: TripMeta;
  importantBeforeYouGo: ImportantTip[];
  days: ItineraryDay[];
  sources: SourceCitation[];
  disclaimer: string;
}

export type ResearchStatus = 'idle' | 'researching' | 'complete' | 'failed';

export interface LoadingStage {
  id: number;
  label: string;
  description: string;
}
