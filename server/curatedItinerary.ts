export interface TripPreferencesInput {
  destination: string;
  startDate: string;
  numberOfDays: number;
  travellers: number;
  transportation?: string;
  pace?: string;
  budget?: string;
  interests?: string[];
}

export function generateCuratedItinerary(prefs: TripPreferencesInput) {
  const destParts = prefs.destination.split(',').map((s) => s.trim());
  const city = destParts[0] || prefs.destination;
  const country = destParts[1] || 'Global Destination';
  const daysCount = Math.min(Math.max(1, Number(prefs.numberOfDays) || 3), 14);
  const travellers = Number(prefs.travellers) || 2;
  const pace = prefs.pace || 'Balanced';
  const budget = prefs.budget || 'Comfort';
  const transportation = prefs.transportation || 'Walk + transit';
  const interests = prefs.interests && prefs.interests.length > 0 ? prefs.interests : ['Culture', 'Food', 'Sightseeing'];

  const startDateObj = new Date(prefs.startDate || new Date().toISOString().split('T')[0]);

  // Compute end date
  const endDateObj = new Date(startDateObj);
  endDateObj.setDate(endDateObj.getDate() + daysCount - 1);
  const endDateStr = endDateObj.toISOString().split('T')[0];

  const cityHighlights: Record<string, { themes: string[]; highlights: string[]; foods: string[]; tips: string }> = {
    Kyoto: {
      themes: ['Historic Higashiyama & Gion', 'Arashiyama Bamboo Grove & Tenryu-ji', 'Fushimi Inari Shrine & Uji Tea', 'Golden Pavilion & Northern Zen Gardens', 'Nijo Castle & Downtown Food Markets'],
      highlights: ['Kiyomizu-dera Temple', 'Fushimi Inari Shrine Torii Gates', 'Arashiyama Bamboo Grove', 'Kinkaku-ji (Golden Pavilion)', 'Gion Hanami-koji Street', 'Nishiki Market', 'Tenryu-ji Zen Garden', 'Philosopher’s Path'],
      foods: ['Matcha parfait and dango', 'Traditional Kaiseki dinner', 'Crispy Katsu curry', 'Nishiki Market skewered delicacies', 'Fresh handmade Soba noodles'],
      tips: 'Start early around 07:30 to experience Fushimi Inari and Arashiyama before tour groups arrive.',
    },
    Rome: {
      themes: ['Ancient Imperial Heart & Colosseum', 'Vatican City & St. Peter’s Basilica', 'Baroque Fountains & Historic Piazzas', 'Trastevere Culinary Stroll & Janiculum Hill', 'Appian Way & Catacombs Exploration'],
      highlights: ['Colosseum & Roman Forum', 'Vatican Museums & Sistine Chapel', 'Pantheon & Piazza Navona', 'Trevi Fountain & Spanish Steps', 'Borghese Gallery & Gardens', 'Trastevere alleys', 'Castel Sant’Angelo'],
      foods: ['Authentic Cacio e Pepe pasta', 'Roman-style thin crust pizza', 'Artisanal Pistachio Gelato', 'Crispy Suppli snack', 'Espresso at Sant’Eustachio'],
      tips: 'Book Colosseum and Vatican museum entry at least 3 weeks in advance. Carry a refillable water bottle for the public nasoni fountains.',
    },
    Paris: {
      themes: ['Historic Île de la Cité & Left Bank', 'The Louvre & Tuileries Promenade', 'Montmartre Artistic Quarter & Sacré-Cœur', 'Eiffel Tower & Seine Sunset Cruise', 'Le Marais Boutiques & Musée Picasso'],
      highlights: ['Eiffel Tower & Champ de Mars', 'Louvre Museum Masterpieces', 'Musée d’Orsay Impressionists', 'Notre-Dame Cathedral & Sainte-Chapelle', 'Montmartre & Sacré-Cœur Basilica', 'Le Marais district', 'Luxembourg Gardens'],
      foods: ['Fresh warm morning croissants', 'Steak frites with béarnaise', 'Savory galettes & sweet crepes', 'Artisanal cheese platter & baguette', 'Macarons from Pierre Hermé'],
      tips: 'Use the Paris Metro with contactless Navigo Easy passes for effortless navigation across all arrondissements.',
    },
    Barcelona: {
      themes: ['Gothic Quarter & Born Neighborhood', 'Gaudí’s Masterpiece: Sagrada Família & Eixample', 'Park Güell & Carmel Bunkers Sunset', 'Montjuïc Hill & Olympic Park', 'Barceloneta Beach & Seaside Tapas'],
      highlights: ['Basílica de la Sagrada Família', 'Park Güell & Casa Batlló', 'Gothic Quarter & Cathedral of Barcelona', 'La Boqueria Food Market', 'Palau de la Música Catalana', 'Barceloneta Waterfront'],
      foods: ['Tapas selection with Patatas Bravas', 'Seafood Paella with saffron', 'Pan con tomate and Jamón Ibérico', 'Churros con chocolate', 'Fresh sangria or crisp Cava'],
      tips: 'Sagrada Família tickets must be booked online ahead of time with scheduled time slots.',
    },
    Tokyo: {
      themes: ['Shibuya Crossing & Meiji Shrine', 'Historic Asakusa & Senso-ji', 'Shinjuku Skyscraper Views & Omoide Yokocho', 'Ginza Luxury & Tsukiji Outer Market', 'Akihabara & Ueno Cultural Gardens'],
      highlights: ['Meiji Jingu Shrine', 'Shibuya Sky Observatory', 'Senso-ji Temple Asakusa', 'Tsukiji Outer Market', 'TeamLab Planets Immersive Experience', 'Shinjuku Gyoen National Garden'],
      foods: ['Fresh Tsukiji Sashimi bowl', 'Steaming Tonkotsu Ramen', 'Crispy Tempura set', 'Yakitori skewers in Omoide Yokocho', 'Fluffy Japanese Soufflé Pancakes'],
      tips: 'Get a digital Suica or Pasmo transit card on your phone for seamless tap-and-go metro travel.',
    },
  };

  const matchedCityKey = Object.keys(cityHighlights).find(
    (k) => k.toLowerCase() === city.toLowerCase() || city.toLowerCase().includes(k.toLowerCase())
  );

  const cityData = matchedCityKey
    ? cityHighlights[matchedCityKey]
    : {
        themes: [
          `Historic Old Town & Iconic Landmarks of ${city}`,
          `Cultural Treasures, Museums & Scenic Views`,
          `Local Neighborhoods, Markets & Hidden Gems`,
          `Parks, Waterfront & Architectural Wonders`,
          `Day Excursions & Regional Highlights`,
        ],
        highlights: [
          `${city} Historic Center & Town Square`,
          `${city} Cultural & Heritage Museum`,
          `Scenic Panoramic Viewpoint of ${city}`,
          `Artisanal Craft Market & Waterfront Promenade`,
          `Iconic Monument & Historic Cathedral of ${city}`,
          `Botanical Gardens & Grand Public Plaza`,
        ],
        foods: [
          `Signature local specialty dish of ${city}`,
          `Fresh seasonal market lunch`,
          `Artisanal neighborhood bakery treats`,
          `Atmospheric dinner with regional wine or beverage`,
          `Traditional cafe snack and dessert`,
        ],
        tips: `Check opening days for major museums, and wear comfortable walking shoes for cobblestone streets.`,
      };

  const days = [];

  for (let i = 0; i < daysCount; i++) {
    const dayDate = new Date(startDateObj);
    dayDate.setDate(dayDate.getDate() + i);
    const dateStr = dayDate.toISOString().split('T')[0];

    const theme = cityData.themes[i % cityData.themes.length];
    const h1 = cityData.highlights[(i * 2) % cityData.highlights.length];
    const h2 = cityData.highlights[(i * 2 + 1) % cityData.highlights.length];
    const h3 = cityData.highlights[(i * 2 + 2) % cityData.highlights.length];

    const dayActivities = [
      {
        startTime: '09:00',
        endTime: '11:30',
        name: h1,
        category: 'Attraction',
        location: `${city} Central District`,
        description: `Explore ${h1} during the morning hours when crowds are light and lighting is ideal for photography.`,
        travelFromPrevious: 'Hotel departure via ' + transportation,
        estimatedCost: budget === 'Budget' ? 'Free / $10' : budget === 'Premium' ? '$35 (Fast-track)' : '$18',
        reservation: i === 0 ? 'Recommended' : 'Not needed',
        indoorOutdoor: 'Both',
        verificationNote: null,
        sourceIds: ['source-1'],
      },
      {
        startTime: '12:00',
        endTime: '13:30',
        name: `Lunch: ${cityData.foods[i % cityData.foods.length]}`,
        category: 'Food',
        location: `${city} Historic Quarter`,
        description: `Savor authentic regional flavors at a welcoming neighborhood eatery frequented by locals.`,
        travelFromPrevious: '5–10 min walk',
        estimatedCost: budget === 'Budget' ? '$12–$18' : budget === 'Premium' ? '$50–$85' : '$25–$35',
        reservation: 'Not needed',
        indoorOutdoor: 'Indoor',
        verificationNote: null,
        sourceIds: ['source-2'],
      },
      {
        startTime: '14:00',
        endTime: '16:30',
        name: h2,
        category: 'Experience',
        location: `${city} Cultural Quarter`,
        description: `Immerse yourself in ${h2}, taking time to discover scenic viewpoints and architectural highlights.`,
        travelFromPrevious: '12 min walk or short transit ride',
        estimatedCost: budget === 'Budget' ? 'Free' : '$15–$25',
        reservation: 'Recommended',
        indoorOutdoor: 'Both',
        verificationNote: null,
        sourceIds: ['source-1'],
      },
      {
        startTime: '17:00',
        endTime: '19:00',
        name: `Evening Stroll: ${h3}`,
        category: 'Attraction',
        location: `${city} Promenade & Squares`,
        description: `Enjoy the golden hour atmosphere around ${h3} as dusk settles over the city streets.`,
        travelFromPrevious: '10 min walk',
        estimatedCost: 'Free / Included',
        reservation: 'Not needed',
        indoorOutdoor: 'Outdoor',
        verificationNote: null,
        sourceIds: ['source-2'],
      },
    ];

    if (pace === 'Relaxed') {
      // Keep to 2-3 activities
      dayActivities.splice(2, 1);
    } else if (pace === 'Full') {
      // Add an evening activity
      dayActivities.push({
        startTime: '20:00',
        endTime: '21:30',
        name: `Night Experience in ${city}`,
        category: 'Experience',
        location: `${city} Vibrant District`,
        description: `Experience the illuminated landmarks and ambient nightlife in the lively district.`,
        travelFromPrevious: 'Short walk or taxi',
        estimatedCost: '$15–$30',
        reservation: 'Not needed',
        indoorOutdoor: 'Both',
        verificationNote: null,
        sourceIds: ['source-2'],
      });
    }

    days.push({
      day: i + 1,
      date: dateStr,
      title: theme,
      neighbourhoods: [`${city} Historic Center`, `${city} Cultural District`],
      overview: `A curated ${pace.toLowerCase()}-paced day highlighting iconic sights, local food discoveries, and picturesque walking routes.`,
      estimatedWalking: pace === 'Relaxed' ? '5,000 – 7,000 steps (3–4 km)' : pace === 'Full' ? '12,000 – 16,000 steps (8–11 km)' : '8,000 – 11,000 steps (5–7 km)',
      activities: dayActivities,
      mealSuggestions: [
        {
          meal: 'Dinner',
          name: `Trattoria & Bistro ${city}`,
          area: `${city} Central Area`,
          priceLevel: budget === 'Budget' ? '$' : budget === 'Premium' ? '$$$' : '$$',
          whyRecommended: `Renowned for seasonal specialties and warm local ambiance.`,
          sourceIds: ['source-2'],
        },
      ],
      rainAlternative: {
        name: `${city} Fine Arts & Covered Gallery`,
        details: `Indoor cultural gallery with interactive exhibits and cozy covered cafe walkways.`,
        sourceIds: ['source-1'],
      },
      localTip: `Visit morning attractions right at opening time to capture beautiful photos without crowds.`,
    });
  }

  return {
    trip: {
      destination: city,
      country: country,
      startDate: prefs.startDate,
      endDate: endDateStr,
      numberOfDays: daysCount,
      travellers: travellers,
      pace: pace,
      budget: budget,
      transportation: transportation,
      interests: interests,
      summary: `A carefully crafted ${daysCount}-day ${pace.toLowerCase()} travel itinerary through ${city}, ${country}, customized for ${travellers} traveller${travellers > 1 ? 's' : ''} focused on ${interests.join(', ')}.`,
      seasonalNote: `Expected pleasant conditions for walking and sightseeing. Keep a light layer handy for morning and evening transitions.`,
    },
    importantBeforeYouGo: [
      {
        title: 'Advance Reservations',
        details: `Book flagship attractions and popular evening restaurants in advance to guarantee entry and avoid long ticket queues.`,
      },
      {
        title: 'Transit & Connectivity',
        details: `Get a rechargeable transit pass or use contactless payment for ${transportation.toLowerCase()} travel.`,
      },
      {
        title: 'Currency & Payment',
        details: `Credit and debit cards are widely accepted, though carrying a small amount of local currency is recommended for small vendors and tips.`,
      },
    ],
    days: days,
    sources: [
      {
        id: 'source-1',
        title: `${city} Official Tourism Guide & Cultural Heritage`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(city)}`,
        publisher: `${city} Tourism Bureau`,
        accessedFor: 'Opening hours, ticketing policies, and landmark geography',
      },
      {
        id: 'source-2',
        title: `${city} Neighborhood Transit & Culinary Map`,
        url: `https://www.google.com/travel`,
        publisher: 'Global Travel Intelligence',
        accessedFor: 'Walking routes, dining areas, and neighborhood navigation',
      },
    ],
    disclaimer: 'Opening hours, ticket pricing, and transit schedules can shift seasonally. Please verify specific details before your visit.',
  };
}
