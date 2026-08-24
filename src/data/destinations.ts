export interface DestinationItem {
  city: string;
  country: string;
  continent?: string;
  popular?: boolean;
}

export const WORLD_DESTINATIONS: DestinationItem[] = [
  // Japan
  { city: 'Kyoto', country: 'Japan', continent: 'Asia', popular: true },
  { city: 'Tokyo', country: 'Japan', continent: 'Asia', popular: true },
  { city: 'Osaka', country: 'Japan', continent: 'Asia', popular: true },
  { city: 'Sapporo', country: 'Japan', continent: 'Asia' },
  { city: 'Nara', country: 'Japan', continent: 'Asia' },
  { city: 'Hiroshima', country: 'Japan', continent: 'Asia' },
  { city: 'Fukuoka', country: 'Japan', continent: 'Asia' },

  // Italy
  { city: 'Rome', country: 'Italy', continent: 'Europe', popular: true },
  { city: 'Florence', country: 'Italy', continent: 'Europe', popular: true },
  { city: 'Venice', country: 'Italy', continent: 'Europe', popular: true },
  { city: 'Milan', country: 'Italy', continent: 'Europe' },
  { city: 'Naples', country: 'Italy', continent: 'Europe' },
  { city: 'Amalfi Coast', country: 'Italy', continent: 'Europe' },
  { city: 'Palermo', country: 'Italy', continent: 'Europe' },
  { city: 'Bologna', country: 'Italy', continent: 'Europe' },

  // Spain
  { city: 'Barcelona', country: 'Spain', continent: 'Europe', popular: true },
  { city: 'Madrid', country: 'Spain', continent: 'Europe', popular: true },
  { city: 'Seville', country: 'Spain', continent: 'Europe', popular: true },
  { city: 'Granada', country: 'Spain', continent: 'Europe' },
  { city: 'Valencia', country: 'Spain', continent: 'Europe' },
  { city: 'San Sebastian', country: 'Spain', continent: 'Europe' },
  { city: 'Mallorca', country: 'Spain', continent: 'Europe' },

  // France
  { city: 'Paris', country: 'France', continent: 'Europe', popular: true },
  { city: 'Nice', country: 'France', continent: 'Europe', popular: true },
  { city: 'Lyon', country: 'France', continent: 'Europe' },
  { city: 'Marseille', country: 'France', continent: 'Europe' },
  { city: 'Bordeaux', country: 'France', continent: 'Europe' },
  { city: 'Strasbourg', country: 'France', continent: 'Europe' },

  // United Kingdom
  { city: 'London', country: 'United Kingdom', continent: 'Europe', popular: true },
  { city: 'Edinburgh', country: 'United Kingdom', continent: 'Europe', popular: true },
  { city: 'Manchester', country: 'United Kingdom', continent: 'Europe' },
  { city: 'Bath', country: 'United Kingdom', continent: 'Europe' },
  { city: 'Oxford', country: 'United Kingdom', continent: 'Europe' },
  { city: 'Belfast', country: 'United Kingdom', continent: 'Europe' },

  // United States
  { city: 'New York City', country: 'United States', continent: 'North America', popular: true },
  { city: 'San Francisco', country: 'United States', continent: 'North America', popular: true },
  { city: 'Los Angeles', country: 'United States', continent: 'North America', popular: true },
  { city: 'Chicago', country: 'United States', continent: 'North America' },
  { city: 'Seattle', country: 'United States', continent: 'North America' },
  { city: 'Honolulu', country: 'United States', continent: 'North America', popular: true },
  { city: 'Miami', country: 'United States', continent: 'North America' },
  { city: 'New Orleans', country: 'United States', continent: 'North America' },
  { city: 'Las Vegas', country: 'United States', continent: 'North America' },
  { city: 'Boston', country: 'United States', continent: 'North America' },
  { city: 'Austin', country: 'United States', continent: 'North America' },
  { city: 'Washington D.C.', country: 'United States', continent: 'North America' },

  // Canada
  { city: 'Banff', country: 'Canada', continent: 'North America', popular: true },
  { city: 'Vancouver', country: 'Canada', continent: 'North America', popular: true },
  { city: 'Toronto', country: 'Canada', continent: 'North America' },
  { city: 'Montreal', country: 'Canada', continent: 'North America', popular: true },
  { city: 'Quebec City', country: 'Canada', continent: 'North America' },
  { city: 'Calgary', country: 'Canada', continent: 'North America' },

  // Mexico
  { city: 'Oaxaca', country: 'Mexico', continent: 'North America', popular: true },
  { city: 'Mexico City', country: 'Mexico', continent: 'North America', popular: true },
  { city: 'Cancun', country: 'Mexico', continent: 'North America', popular: true },
  { city: 'Playa del Carmen', country: 'Mexico', continent: 'North America' },
  { city: 'San Miguel de Allende', country: 'Mexico', continent: 'North America' },
  { city: 'Guadalajara', country: 'Mexico', continent: 'North America' },
  { city: 'Tulum', country: 'Mexico', continent: 'North America' },

  // Portugal
  { city: 'Lisbon', country: 'Portugal', continent: 'Europe', popular: true },
  { city: 'Porto', country: 'Portugal', continent: 'Europe', popular: true },
  { city: 'Faro', country: 'Portugal', continent: 'Europe' },
  { city: 'Sintra', country: 'Portugal', continent: 'Europe' },
  { city: 'Madeira', country: 'Portugal', continent: 'Europe' },

  // Greece
  { city: 'Athens', country: 'Greece', continent: 'Europe', popular: true },
  { city: 'Santorini', country: 'Greece', continent: 'Europe', popular: true },
  { city: 'Mykonos', country: 'Greece', continent: 'Europe' },
  { city: 'Crete', country: 'Greece', continent: 'Europe' },
  { city: 'Rhodes', country: 'Greece', continent: 'Europe' },

  // Germany
  { city: 'Berlin', country: 'Germany', continent: 'Europe', popular: true },
  { city: 'Munich', country: 'Germany', continent: 'Europe', popular: true },
  { city: 'Hamburg', country: 'Germany', continent: 'Europe' },
  { city: 'Frankfurt', country: 'Germany', continent: 'Europe' },
  { city: 'Cologne', country: 'Germany', continent: 'Europe' },

  // Netherlands
  { city: 'Amsterdam', country: 'Netherlands', continent: 'Europe', popular: true },
  { city: 'Rotterdam', country: 'Netherlands', continent: 'Europe' },
  { city: 'Utrecht', country: 'Netherlands', continent: 'Europe' },

  // Austria & Switzerland
  { city: 'Vienna', country: 'Austria', continent: 'Europe', popular: true },
  { city: 'Salzburg', country: 'Austria', continent: 'Europe' },
  { city: 'Innsbruck', country: 'Austria', continent: 'Europe' },
  { city: 'Zurich', country: 'Switzerland', continent: 'Europe' },
  { city: 'Geneva', country: 'Switzerland', continent: 'Europe' },
  { city: 'Lucerne', country: 'Switzerland', continent: 'Europe', popular: true },
  { city: 'Interlaken', country: 'Switzerland', continent: 'Europe' },

  // Nordic
  { city: 'Reykjavik', country: 'Iceland', continent: 'Europe', popular: true },
  { city: 'Stockholm', country: 'Sweden', continent: 'Europe' },
  { city: 'Copenhagen', country: 'Denmark', continent: 'Europe', popular: true },
  { city: 'Oslo', country: 'Norway', continent: 'Europe' },
  { city: 'Bergen', country: 'Norway', continent: 'Europe' },
  { city: 'Helsinki', country: 'Finland', continent: 'Europe' },

  // Central / Eastern Europe
  { city: 'Prague', country: 'Czech Republic', continent: 'Europe', popular: true },
  { city: 'Budapest', country: 'Hungary', continent: 'Europe', popular: true },
  { city: 'Dubrovnik', country: 'Croatia', continent: 'Europe', popular: true },
  { city: 'Split', country: 'Croatia', continent: 'Europe' },
  { city: 'Krakow', country: 'Poland', continent: 'Europe' },
  { city: 'Warsaw', country: 'Poland', continent: 'Europe' },
  { city: 'Ljubljana', country: 'Slovenia', continent: 'Europe' },

  // Turkey & Middle East
  { city: 'Istanbul', country: 'Turkey', continent: 'Europe/Asia', popular: true },
  { city: 'Cappadocia', country: 'Turkey', continent: 'Asia', popular: true },
  { city: 'Antalya', country: 'Turkey', continent: 'Asia' },
  { city: 'Dubai', country: 'United Arab Emirates', continent: 'Middle East', popular: true },
  { city: 'Abu Dhabi', country: 'United Arab Emirates', continent: 'Middle East' },
  { city: 'Doha', country: 'Qatar', continent: 'Middle East' },
  { city: 'Muscat', country: 'Oman', continent: 'Middle East' },
  { city: 'Amman', country: 'Jordan', continent: 'Middle East' },
  { city: 'Petra', country: 'Jordan', continent: 'Middle East', popular: true },
  { city: 'Tehran', country: 'Iran', continent: 'Middle East' },
  { city: 'Isfahan', country: 'Iran', continent: 'Middle East' },
  { city: 'Shiraz', country: 'Iran', continent: 'Middle East' },

  // Southeast Asia
  { city: 'Bangkok', country: 'Thailand', continent: 'Asia', popular: true },
  { city: 'Chiang Mai', country: 'Thailand', continent: 'Asia', popular: true },
  { city: 'Phuket', country: 'Thailand', continent: 'Asia' },
  { city: 'Singapore', country: 'Singapore', continent: 'Asia', popular: true },
  { city: 'Bali', country: 'Indonesia', continent: 'Asia', popular: true },
  { city: 'Jakarta', country: 'Indonesia', continent: 'Asia' },
  { city: 'Hanoi', country: 'Vietnam', continent: 'Asia', popular: true },
  { city: 'Ho Chi Minh City', country: 'Vietnam', continent: 'Asia' },
  { city: 'Da Nang', country: 'Vietnam', continent: 'Asia' },
  { city: 'Kuala Lumpur', country: 'Malaysia', continent: 'Asia' },
  { city: 'Penang', country: 'Malaysia', continent: 'Asia' },
  { city: 'Siem Reap', country: 'Cambodia', continent: 'Asia', popular: true },
  { city: 'Manila', country: 'Philippines', continent: 'Asia' },
  { city: 'Cebu', country: 'Philippines', continent: 'Asia' },

  // East Asia
  { city: 'Seoul', country: 'South Korea', continent: 'Asia', popular: true },
  { city: 'Busan', country: 'South Korea', continent: 'Asia' },
  { city: 'Taipei', country: 'Taiwan', continent: 'Asia', popular: true },
  { city: 'Hong Kong', country: 'Hong Kong', continent: 'Asia', popular: true },
  { city: 'Shanghai', country: 'China', continent: 'Asia' },
  { city: 'Beijing', country: 'China', continent: 'Asia' },

  // South Asia
  { city: 'Mumbai', country: 'India', continent: 'Asia' },
  { city: 'Delhi', country: 'India', continent: 'Asia' },
  { city: 'Jaipur', country: 'India', continent: 'Asia', popular: true },
  { city: 'Goa', country: 'India', continent: 'Asia' },
  { city: 'Colombo', country: 'Sri Lanka', continent: 'Asia' },
  { city: 'Kathmandu', country: 'Nepal', continent: 'Asia' },
  { city: 'Male', country: 'Maldives', continent: 'Asia', popular: true },

  // Australia & Oceania
  { city: 'Sydney', country: 'Australia', continent: 'Oceania', popular: true },
  { city: 'Melbourne', country: 'Australia', continent: 'Oceania', popular: true },
  { city: 'Brisbane', country: 'Australia', continent: 'Oceania' },
  { city: 'Perth', country: 'Australia', continent: 'Oceania' },
  { city: 'Auckland', country: 'New Zealand', continent: 'Oceania' },
  { city: 'Queenstown', country: 'New Zealand', continent: 'Oceania', popular: true },
  { city: 'Fiji', country: 'Fiji', continent: 'Oceania' },

  // South America
  { city: 'Buenos Aires', country: 'Argentina', continent: 'South America', popular: true },
  { city: 'Rio de Janeiro', country: 'Brazil', continent: 'South America', popular: true },
  { city: 'Sao Paulo', country: 'Brazil', continent: 'South America' },
  { city: 'Santiago', country: 'Chile', continent: 'South America' },
  { city: 'Lima', country: 'Peru', continent: 'South America', popular: true },
  { city: 'Cusco', country: 'Peru', continent: 'South America', popular: true },
  { city: 'Bogota', country: 'Colombia', continent: 'South America' },
  { city: 'Medellin', country: 'Colombia', continent: 'South America' },
  { city: 'Cartagena', country: 'Colombia', continent: 'South America', popular: true },
  { city: 'Quito', country: 'Ecuador', continent: 'South America' },

  // Africa
  { city: 'Cairo', country: 'Egypt', continent: 'Africa', popular: true },
  { city: 'Cape Town', country: 'South Africa', continent: 'Africa', popular: true },
  { city: 'Johannesburg', country: 'South Africa', continent: 'Africa' },
  { city: 'Marrakech', country: 'Morocco', continent: 'Africa', popular: true },
  { city: 'Casablanca', country: 'Morocco', continent: 'Africa' },
  { city: 'Nairobi', country: 'Kenya', continent: 'Africa' },
  { city: 'Zanzibar', country: 'Tanzania', continent: 'Africa' },
];

export function searchDestinations(query: string): DestinationItem[] {
  if (!query || query.trim().length === 0) {
    return WORLD_DESTINATIONS.filter((d) => d.popular).slice(0, 8);
  }

  const clean = query.trim().toLowerCase();

  // Exact or prefix matches first, then substring
  const exactCityMatches: DestinationItem[] = [];
  const startsWithMatches: DestinationItem[] = [];
  const containsMatches: DestinationItem[] = [];

  for (const item of WORLD_DESTINATIONS) {
    const cityLower = item.city.toLowerCase();
    const countryLower = item.country.toLowerCase();
    const full = `${cityLower}, ${countryLower}`;

    if (cityLower === clean || full === clean) {
      exactCityMatches.push(item);
    } else if (cityLower.startsWith(clean) || countryLower.startsWith(clean)) {
      startsWithMatches.push(item);
    } else if (cityLower.includes(clean) || countryLower.includes(clean)) {
      containsMatches.push(item);
    }
  }

  return [...exactCityMatches, ...startsWithMatches, ...containsMatches].slice(0, 10);
}
