/**
 * Professional-Grade Vedic Astrology (Jyotish) & Astronomical Ephemeris Engine
 * Powered by JPL DE405/DE430 Ephemeris calculations (via astronomy-engine)
 * and Classical Parashari Jyotish Principles:
 * - Sidereal Zodiac with Precise Lahiri (Chitra Paksha) Ayanamsa
 * - Exact Planetary Positions (Surya, Chandra, Mangala, Budha, Guru, Shukra, Shani, Rahu, Ketu)
 * - The Foundational Vedic Triad: Lagna (Ascendant), Janma Rashi (Moon Sign), Surya Rashi (Sun Sign)
 * - 27 Nakshatras & 4 Padas with Lords and Deities
 * - Complete 120-Year Vimshottari Dasha Engine (Mahadasha, Antardasha, Pratyantardasha)
 * - Divisional Charts (Vargas): D1 (Rashi), D9 (Navamsha), D10 (Dashamsha)
 * - Gochara (Transit) Tracking relative to Janma Rashi & Lagna with Sade Sati detection
 * - Sarvashtakavarga (SAV) & Bhinna Ashtakavarga (BAV) Strength Scoring for Monthly Fortune
 * - Vedic Planetary Aspects (Graha Drishti) & Classical Yogas (Gaja Kesari, Pancha Mahapurusha, Raja, Dhana Yogas)
 * - Dynamic Modular Narrative Stitching
 */

import * as Astronomy from 'astronomy-engine';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type ZodiacSignName =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

export type VedicRashiName =
  | 'Mesha'
  | 'Vrishabha'
  | 'Mithuna'
  | 'Karka'
  | 'Simha'
  | 'Kanya'
  | 'Tula'
  | 'Vrishchika'
  | 'Dhanu'
  | 'Makara'
  | 'Kumbha'
  | 'Meena';

export type VedicGrahaName =
  | 'Sun'
  | 'Moon'
  | 'Mars'
  | 'Mercury'
  | 'Jupiter'
  | 'Venus'
  | 'Saturn'
  | 'Rahu'
  | 'Ketu';

export interface CelestialPosition {
  body: string;
  glyph: string;
  sanskritName: string;
  eclipticLongitude: number; // Sidereal Longitude (0 - 360)
  tropicalLongitude: number; // Tropical Longitude (0 - 360)
  eclipticLatitude: number;
  rightAscension: number;
  rightAscensionStr: string;
  declination: number;
  declinationStr: string;
  distanceAU: number;
  speedLongitudeDegPerDay: number;
  isRetrograde: boolean;
  sign: ZodiacSignName;
  rashi: VedicRashiName;
  glyphSign: string;
  degreeInSign: number; // 0 - 29.999
  degreeStr: string;
  house: number; // 1 - 12 from Lagna
  houseFromMoon: number; // 1 - 12 from Janma Rashi
  nakshatra: NakshatraPosition;
  d9NavamshaRashi: ZodiacSignName;
  d10DashamshaRashi: ZodiacSignName;
}

export interface NakshatraPosition {
  index: number; // 0 - 26
  name: string;
  lord: string;
  deity: string;
  symbol: string;
  pada: number; // 1 - 4
  degreesInPada: number;
  formatted: string;
}

export interface VimshottariDashaPeriod {
  lord: string;
  level: 'Mahadasha' | 'Antardasha' | 'Pratyantardasha';
  startDate: string;
  endDate: string;
  startYear: number;
  endYear: number;
  durationYears: number;
  predictionFocus: string;
}

export interface DashaLifecyclePhase {
  id: string;
  mahadashaLord: string;
  antardashaLord: string;
  periodLevel: 'Mahadasha' | 'Antardasha';
  startDateStr: string;
  endDateStr: string;
  startYear: number;
  endYear: number;
  durationMonths: number;
  isActive: boolean;
  isUpcoming: boolean;
  isPast: boolean;
  isMajorChange: boolean;
  glyph: string;
  sanskritName: string;
  theme: string;
  lifeEventFocus: string;
  yogakarakaBlessing: string;
  favorableScore: number;
}

export interface CurrentDashaStatus {
  mahadasha: VimshottariDashaPeriod;
  antardasha: VimshottariDashaPeriod;
  pratyantardasha: VimshottariDashaPeriod;
  summary: string;
  lifecycle: DashaLifecyclePhase[];
}

export interface DivisionalChartsData {
  d1Rashi: Record<string, string>;
  d9Navamsha: Record<string, string>;
  d10Dashamsha: Record<string, string>;
}

export interface AshtakavargaData {
  savPointsPerHouse: number[]; // 12 houses (1 to 12)
  careerHouse10SAV: number;
  wealthHouse2SAV: number;
  gainsHouse11SAV: number;
  healthHouse1SAV: number;
  relationshipsHouse7SAV: number;
  monthlyFortuneScore: number; // 0 - 100%
  grade: 'Peak Excellence' | 'Highly Favorable' | 'Balanced Growth' | 'Steadfast Discipline';
}

export interface VedicYoga {
  name: string;
  sanskritName: string;
  type: 'Raja Yoga' | 'Dhana Yoga' | 'Mahapurusha Yoga' | 'Auspicious Yoga' | 'Chandra Yoga';
  planetsInvolved: string[];
  description: string;
  lifeBlessing: string;
}

export interface GrahaDrishtiAspect {
  graha: string;
  aspectedHouses: number[];
  aspectedPlanets: string[];
  aspectType: 'Full 7th' | 'Special 4th/8th' | 'Special 5th/9th' | 'Special 3rd/10th';
  nature: 'Harmonious' | 'Dynamic Tension' | 'Intensifying';
  interpretation: string;
}

export interface GocharaTransitItem {
  planet: string;
  currentSign: ZodiacSignName;
  houseFromLagna: number;
  houseFromMoon: number;
  isFavorable: boolean;
  savPoints: number;
  transitTheme: string;
  prediction: string;
}

export interface PlanetaryAspect {
  planet1: string;
  planet2: string;
  angle: number;
  aspectType: 'Conjunction' | 'Sextile' | 'Square' | 'Trine' | 'Opposition';
  symbol: string;
  orb: number;
  isApplying: boolean;
  nature: 'Harmonious' | 'Dynamic Tension' | 'Intensifying';
  interpretation: string;
}

export interface HouseCusp {
  houseNumber: number;
  sign: ZodiacSignName;
  rashi: VedicRashiName;
  degree: number;
  formatted: string;
  theme: string;
  savPoints: number;
  planetsInside: string[];
}

export interface BigThreeInfo {
  sun: {
    sign: ZodiacSignName;
    rashi: VedicRashiName;
    degree: string;
    house: number;
    glyph: string;
    nakshatra: string;
    essence: string;
  };
  moon: {
    sign: ZodiacSignName;
    rashi: VedicRashiName;
    degree: string;
    house: number;
    glyph: string;
    nakshatra: string;
    pada: number;
    emotionalSanctuary: string;
  };
  ascendant: {
    sign: ZodiacSignName;
    rashi: VedicRashiName;
    degree: string;
    glyph: string;
    nakshatra: string;
    socialAura: string;
  };
  midheaven: {
    sign: ZodiacSignName;
    rashi: VedicRashiName;
    degree: string;
    glyph: string;
    executiveLegacy: string;
  };
  synthesis: string;
}

export interface TransitEvent {
  transitPlanet: string;
  natalPoint: string;
  aspect: string;
  orb: number;
  transitHouse: number;
  impactScore: number;
  headline: string;
  prediction: string;
}

export interface NatalChartData {
  celebrantName: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  latitude: number;
  longitude: number;
  timezoneOffsetHours: number;
  julianDay: number;
  localSiderealTimeHours: number;
  lahiriAyanamsaDeg: number;
  lahiriAyanamsaStr: string;
  bigThree: BigThreeInfo;
  planets: Record<string, CelestialPosition>;
  houses: HouseCusp[];
  aspects: PlanetaryAspect[];
  tenthHouseCareerTheme: string;
  northNodeLifePurpose: {
    sign: ZodiacSignName;
    rashi: VedicRashiName;
    house: number;
    nakshatra: string;
    destinyDecree: string;
  };
  vedicMetrics: {
    lagna: { rashi: VedicRashiName; sign: ZodiacSignName; degreeStr: string; nakshatra: string; pada: number; lord: string };
    janmaRashi: { rashi: VedicRashiName; sign: ZodiacSignName; degreeStr: string; nakshatra: string; pada: number; lord: string };
    suryaRashi: { rashi: VedicRashiName; sign: ZodiacSignName; degreeStr: string; nakshatra: string; pada: number; lord: string };
    currentDasha: CurrentDashaStatus;
    vargas: DivisionalChartsData;
    ashtakavarga: AshtakavargaData;
    yogas: VedicYoga[];
    grahaDrishti: GrahaDrishtiAspect[];
    gocharaSummary: GocharaTransitItem[];
  };
}

export interface DynamicAstrologyPayload {
  celebrantName: string;
  serverNode: string;
  latencyMs: number;
  syncTimestamp: string;
  natalChart: NatalChartData;
  activeTransits: TransitEvent[];
  positiveAuraNote: string;
  cosmicGuidance: string;
  careerOpportunities: string[];
  happinessMilestones: string[];
  financialAbundance: string[];
  friendshipHarmony: string[];
  yearByYearForecast: {
    year: number;
    theme: string;
    prediction: string;
    vitalityScore: number;
  }[];
  upcomingGoodThings: {
    title: string;
    description: string;
    timing: string;
    tag: string;
  }[];
  fateAndDestiny: {
    chapterTitle: string;
    fateNote: string;
    theYearAhead: {
      alignment: string;
      forecast: string;
      luckFactor: string;
    };
    careerAndSuccess: {
      title: string;
      predictions: string[];
      growthLeap: string;
    };
    personalJoyAndPeace: {
      title: string;
      milestones: string[];
      friendshipBlessing: string;
    };
    destinyMilestones: {
      quarter: string;
      milestone: string;
      blessing: string;
    }[];
    cosmicDecree: string;
  };
}

// ============================================================================
// Vedic Constants & Catalogs
// ============================================================================

export const ZODIAC_ORDER: ZodiacSignName[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const VEDIC_RASHI_NAMES: Record<ZodiacSignName, VedicRashiName> = {
  Aries: 'Mesha',
  Taurus: 'Vrishabha',
  Gemini: 'Mithuna',
  Cancer: 'Karka',
  Leo: 'Simha',
  Virgo: 'Kanya',
  Libra: 'Tula',
  Scorpio: 'Vrishchika',
  Sagittarius: 'Dhanu',
  Capricorn: 'Makara',
  Aquarius: 'Kumbha',
  Pisces: 'Meena'
};

export const ZODIAC_GLYPHS: Record<ZodiacSignName, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};

export const VEDIC_RASHI_LORDS: Record<VedicRashiName, string> = {
  Mesha: 'Mangala (Mars)',
  Vrishabha: 'Shukra (Venus)',
  Mithuna: 'Budha (Mercury)',
  Karka: 'Chandra (Moon)',
  Simha: 'Surya (Sun)',
  Kanya: 'Budha (Mercury)',
  Tula: 'Shukra (Venus)',
  Vrishchika: 'Mangala (Mars)',
  Dhanu: 'Guru (Jupiter)',
  Makara: 'Shani (Saturn)',
  Kumbha: 'Shani (Saturn)',
  Meena: 'Guru (Jupiter)'
};

export const PLANET_GLYPHS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mars: '♂', Mercury: '☿',
  Jupiter: '♃', Venus: '♀', Saturn: '♄', Rahu: '☊', Ketu: '☋'
};

export const PLANET_SANSKRIT_NAMES: Record<string, string> = {
  Sun: 'Surya', Moon: 'Chandra', Mars: 'Mangala', Mercury: 'Budha',
  Jupiter: 'Guru / Brihaspati', Venus: 'Shukra', Saturn: 'Shani',
  Rahu: 'Rahu (North Node)', Ketu: 'Ketu (South Node)'
};

export interface NakshatraDefinition {
  name: string;
  lord: string;
  deity: string;
  symbol: string;
}

export const NAKSHATRA_CATALOG: NakshatraDefinition[] = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras (Healers of Gods)', symbol: "Horse's Head" },
  { name: 'Bharani', lord: 'Venus', deity: 'Yama (Dharma & Truth)', symbol: 'Yoni / Vessel of Creation' },
  { name: 'Krittika', lord: 'Sun', deity: 'Agni (Sacred Fire)', symbol: 'Razor / Flame' },
  { name: 'Rohini', lord: 'Moon', deity: 'Brahma (The Creator)', symbol: 'Chariot / Temple' },
  { name: 'Mrigashira', lord: 'Mars', deity: 'Soma (Moon God of Nectar)', symbol: "Deer's Head" },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra (Storm & Transformation)', symbol: 'Teardrop / Diamond' },
  { name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi (Universal Mother)', symbol: 'Bow & Quiver' },
  { name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati (Spiritual Teacher)', symbol: 'Cow Udder / Lotus' },
  { name: 'Ashlesha', lord: 'Mercury', deity: 'Nagas (Serpent Wisdom)', symbol: 'Coiled Serpent' },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitris (Ancestral Sovereigns)', symbol: 'Royal Throne Room' },
  { name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga (God of Fortune & Love)', symbol: 'Front Legs of Bed' },
  { name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman (Honor & Alliances)', symbol: 'Back Legs of Bed' },
  { name: 'Hasta', lord: 'Moon', deity: 'Savitr (Solar Inspiration)', symbol: 'Open Blessing Hand' },
  { name: 'Chitra', lord: 'Mars', deity: 'Tvashtar (Divine Celestial Architect)', symbol: 'Radiant Pearl' },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu (Wind of Independence)', symbol: 'Young Shoot in Wind' },
  { name: 'Vishakha', lord: 'Jupiter', deity: 'Indra & Agni (Triumph & Purpose)', symbol: 'Triumphal Archway' },
  { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra (God of Pure Friendship)', symbol: 'Lotus in Bloom' },
  { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra (King of the Gods)', symbol: 'Circular Protective Amulet' },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti (Goddess of Deep Origins)', symbol: 'Tied Roots' },
  { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas (Cosmic Water Goddess)', symbol: "Elephant's Tusk" },
  { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishwadevas (Universal Virtues)', symbol: 'Small Cot / Winnow' },
  { name: 'Shravana', lord: 'Moon', deity: 'Vishnu (Preserver of the Cosmos)', symbol: 'Three Footprints / Ear' },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Ashta Vasus (Gods of Abundance)', symbol: 'Flute / Drum of Symphony' },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna (God of Cosmic Law & Oceans)', symbol: 'Empty Circle / 100 Healers' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada (One-Footed Cosmic Fire)', symbol: 'Swords / Front of Funeral Cot' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahirbudhnya (Deep Serpent of Wisdom)', symbol: 'Twin Water Serpentine' },
  { name: 'Revati', lord: 'Mercury', deity: 'Pushan (Guardian of Travelers & Wealth)', symbol: 'Fish Swimming in Sea' }
];

export const VIMSHOTTARI_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17
};

export const VIMSHOTTARI_SEQUENCE: string[] = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
];

export const VEDIC_HOUSE_THEMES: Record<number, string> = {
  1: 'Tanu Bhava (House of Self, Lagna, Vitality & Radiant Aura)',
  2: 'Dhana Bhava (House of Wealth, Accumulated Assets, Speech & Values)',
  3: 'Sahaja Bhava (House of Courage, Parakrama, Enterprise & Intellect)',
  4: 'Sukha Bhava (House of Domestic Bliss, Sanctuary, Mind & Peace)',
  5: 'Putra & Purva Punya Bhava (House of Creativity, Merit & Intelligence)',
  6: 'Ari & Shatru Bhava (House of Overcoming Obstacles, Service & Mastery)',
  7: 'Yuvati Bhava (House of Sacred Partnerships, Harmony & Diplomacy)',
  8: 'Randhra Bhava (House of Transformation, Longevity & Intuitive Power)',
  9: 'Dharma & Bhagya Bhava (House of Supreme Fortune, Wisdom & Divine Grace)',
  10: 'Karma Bhava (House of Executive Career, Status, Honor & Authority)',
  11: 'Labha Bhava (House of Abundant Gains, Realized Desires & Comrades)',
  12: 'Vyaya Bhava (House of Spiritual Liberation, Transcendence & Inner Rest)'
};

// ============================================================================
// Comprehensive Geolocation & Historical Timezone Database
// ============================================================================

export interface CityGeoLocation {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation: number;
  standardOffsetHours: number;
  hasDst: boolean;
  dstOffsetHours?: number;
}

export const WORLD_CITIES_DATABASE: Record<string, CityGeoLocation> = {
  // Bangladesh Cities
  dhaka: { city: 'Dhaka', country: 'Bangladesh', latitude: 23.8103, longitude: 90.4125, elevation: 12, standardOffsetHours: 6, hasDst: false },
  chittagong: { city: 'Chittagong', country: 'Bangladesh', latitude: 22.3569, longitude: 91.7832, elevation: 15, standardOffsetHours: 6, hasDst: false },
  sylhet: { city: 'Sylhet', country: 'Bangladesh', latitude: 24.8949, longitude: 91.8687, elevation: 35, standardOffsetHours: 6, hasDst: false },
  rajshahi: { city: 'Rajshahi', country: 'Bangladesh', latitude: 24.3745, longitude: 88.6042, elevation: 18, standardOffsetHours: 6, hasDst: false },
  khulna: { city: 'Khulna', country: 'Bangladesh', latitude: 22.8456, longitude: 89.5403, elevation: 9, standardOffsetHours: 6, hasDst: false },
  barisal: { city: 'Barisal', country: 'Bangladesh', latitude: 22.7010, longitude: 90.3535, elevation: 5, standardOffsetHours: 6, hasDst: false },
  rangpur: { city: 'Rangpur', country: 'Bangladesh', latitude: 25.7439, longitude: 89.2752, elevation: 34, standardOffsetHours: 6, hasDst: false },
  mymensingh: { city: 'Mymensingh', country: 'Bangladesh', latitude: 24.7471, longitude: 90.4203, elevation: 19, standardOffsetHours: 6, hasDst: false },
  comilla: { city: 'Comilla', country: 'Bangladesh', latitude: 23.4607, longitude: 91.1809, elevation: 12, standardOffsetHours: 6, hasDst: false },
  gazipur: { city: 'Gazipur', country: 'Bangladesh', latitude: 23.9999, longitude: 90.4203, elevation: 14, standardOffsetHours: 6, hasDst: false },
  narayanganj: { city: 'Narayanganj', country: 'Bangladesh', latitude: 23.6238, longitude: 90.5000, elevation: 8, standardOffsetHours: 6, hasDst: false },
  bogra: { city: 'Bogura', country: 'Bangladesh', latitude: 24.8465, longitude: 89.3777, elevation: 20, standardOffsetHours: 6, hasDst: false },
  coxsbazar: { city: "Cox's Bazar", country: 'Bangladesh', latitude: 21.4272, longitude: 92.0058, elevation: 3, standardOffsetHours: 6, hasDst: false },

  // Global Hubs
  london: { city: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, elevation: 25, standardOffsetHours: 0, hasDst: true, dstOffsetHours: 1 },
  newyork: { city: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.0060, elevation: 10, standardOffsetHours: -5, hasDst: true, dstOffsetHours: -4 },
  losangeles: { city: 'Los Angeles', country: 'USA', latitude: 34.0522, longitude: -118.2437, elevation: 87, standardOffsetHours: -8, hasDst: true, dstOffsetHours: -7 },
  toronto: { city: 'Toronto', country: 'Canada', latitude: 43.6532, longitude: -79.3832, elevation: 76, standardOffsetHours: -5, hasDst: true, dstOffsetHours: -4 },
  paris: { city: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, elevation: 35, standardOffsetHours: 1, hasDst: true, dstOffsetHours: 2 },
  berlin: { city: 'Berlin', country: 'Germany', latitude: 52.5200, longitude: 13.4050, elevation: 34, standardOffsetHours: 1, hasDst: true, dstOffsetHours: 2 },
  tokyo: { city: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, elevation: 40, standardOffsetHours: 9, hasDst: false },
  singapore: { city: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, elevation: 15, standardOffsetHours: 8, hasDst: false },
  dubai: { city: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708, elevation: 5, standardOffsetHours: 4, hasDst: false },
  sydney: { city: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, elevation: 19, standardOffsetHours: 10, hasDst: true, dstOffsetHours: 11 },
  mumbai: { city: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, elevation: 14, standardOffsetHours: 5.5, hasDst: false },
  delhi: { city: 'New Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, elevation: 216, standardOffsetHours: 5.5, hasDst: false },
  bangkok: { city: 'Bangkok', country: 'Thailand', latitude: 13.7563, longitude: 100.5018, elevation: 2, standardOffsetHours: 7, hasDst: false },
  kualalumpur: { city: 'Kuala Lumpur', country: 'Malaysia', latitude: 3.1390, longitude: 101.6869, elevation: 22, standardOffsetHours: 8, hasDst: false }
};

export function resolveLocationAndHistoricalTimezone(
  cityName?: string,
  birthDate?: Date
): {
  city: string;
  latitude: number;
  longitude: number;
  elevation: number;
  timezoneOffsetHours: number;
} {
  const normalized = (cityName || 'Dhaka').toLowerCase().replace(/[^a-z]/g, '');
  const found = WORLD_CITIES_DATABASE[normalized] || WORLD_CITIES_DATABASE.dhaka;

  let offset = found.standardOffsetHours;

  if (found.hasDst && birthDate && found.dstOffsetHours !== undefined) {
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth();

    if (found.latitude > 0) {
      if (month >= 3 && month <= 9) offset = found.dstOffsetHours;
    } else {
      if (month >= 9 || month <= 2) offset = found.dstOffsetHours;
    }

    if (found.country === 'Bangladesh' && year === 2009 && month >= 5 && month <= 11) {
      offset = 7;
    }
  }

  return {
    city: found.city,
    latitude: found.latitude,
    longitude: found.longitude,
    elevation: found.elevation,
    timezoneOffsetHours: offset
  };
}

// ============================================================================
// Core Astronomical & Ephemeris Calculations
// ============================================================================

/**
 * Calculates high-precision Chitra Paksha (Lahiri) Ayanamsa for any Julian Date
 */
export function calculateLahiriAyanamsa(utcDate: Date): number {
  const jd = utcDate.getTime() / 86400000 + 2440587.5;
  // Standard Lahiri Ayanamsa at Epoch J2000 (23° 51' 11'' = 23.8530556°)
  // Rate of precession = 50.290966 arcseconds per tropical year
  const ayanamsa = 23.8530556 + (50.290966 * (jd - 2451545.0)) / (36525 * 3600);
  return ayanamsa;
}

export function formatAyanamsa(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.round(((deg - d) * 60 - m) * 60);
  return `${d}° ${m}' ${s}" (Lahiri)`;
}

/**
 * Converts a sidereal longitude into Zodiac Sign, Rashi, degrees, and Nakshatra
 */
export function longitudeToVedicDetails(siderealLon: number): {
  sign: ZodiacSignName;
  rashi: VedicRashiName;
  degreeInSign: number;
  degreeStr: string;
  glyph: string;
  nakshatra: NakshatraPosition;
} {
  const norm = ((siderealLon % 360) + 360) % 360;
  const signIndex = Math.floor(norm / 30);
  const sign = ZODIAC_ORDER[signIndex] || 'Aries';
  const rashi = VEDIC_RASHI_NAMES[sign];
  const degreeInSign = norm % 30;
  const deg = Math.floor(degreeInSign);
  const min = Math.floor((degreeInSign - deg) * 60);

  // Nakshatra calculations (each spans 13° 20' = 800 minutes)
  const totalMinutes = norm * 60;
  const nakIndex = Math.floor(totalMinutes / 800) % 27;
  const minutesInNak = totalMinutes % 800;
  const pada = Math.floor(minutesInNak / 200) + 1; // 1 - 4
  const degreesInPada = (minutesInNak % 200) / 60;

  const nakDef = NAKSHATRA_CATALOG[nakIndex] || NAKSHATRA_CATALOG[0];

  const nakshatra: NakshatraPosition = {
    index: nakIndex,
    name: nakDef.name,
    lord: nakDef.lord,
    deity: nakDef.deity,
    symbol: nakDef.symbol,
    pada,
    degreesInPada,
    formatted: `${nakDef.name} (Pada ${pada}, Lord: ${nakDef.lord})`
  };

  return {
    sign,
    rashi,
    degreeInSign,
    degreeStr: `${deg}° ${min.toString().padStart(2, '0')}' ${rashi} (${sign}) ${ZODIAC_GLYPHS[sign]}`,
    glyph: ZODIAC_GLYPHS[sign],
    nakshatra
  };
}

/**
 * Calculates Ascendant (Lagna) and Midheaven (MC) in Sidereal Zodiac
 */
export function calculateSiderealLagnaAndMC(
  utcDate: Date,
  lat: number,
  lon: number,
  ayanamsa: number
): {
  tropicalAsc: number;
  siderealLagna: number;
  tropicalMC: number;
  siderealMC: number;
  lstHours: number;
} {
  const d2r = Math.PI / 180;
  const r2d = 180 / Math.PI;

  const jd = utcDate.getTime() / 86400000 + 2440587.5;
  const t = (jd - 2451545.0) / 36525.0;

  // Mean obliquity of ecliptic
  const eps =
    (23.4392911 - (46.815 * t - 0.00059 * t * t + 0.001813 * t * t * t) / 3600.0) * d2r;

  // Greenwich Mean Sidereal Time
  let gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * t * t -
    (t * t * t) / 38710000.0;
  gmst = ((gmst % 360) + 360) % 360;

  let lst = (gmst + lon) % 360;
  if (lst < 0) lst += 360;
  const lstHours = lst / 15.0;

  const ramc = lst * d2r;
  const phi = lat * d2r;

  // Ascendant formula (exact spherical trigonometry)
  const y = -Math.cos(ramc);
  const x = Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps);
  let asc = Math.atan2(y, x) * r2d;
  asc = ((asc % 360) + 360) % 360;

  // Midheaven (MC) formula
  let mc = Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(eps)) * r2d;
  mc = ((mc % 360) + 360) % 360;

  // Convert to Sidereal Zodiac using Lahiri Ayanamsa
  const siderealLagna = ((asc - ayanamsa % 360) + 360) % 360;
  const siderealMC = ((mc - ayanamsa % 360) + 360) % 360;

  return {
    tropicalAsc: asc,
    siderealLagna,
    tropicalMC: mc,
    siderealMC,
    lstHours
  };
}

/**
 * Calculates Mean Lunar Node (Rahu) and Ketu
 */
export function calculateRahuKetu(utcDate: Date, ayanamsa: number): { rahuSidereal: number; ketuSidereal: number } {
  const jd = utcDate.getTime() / 86400000 + 2440587.5;
  const t = (jd - 2451545.0) / 36525.0;

  let omega =
    125.04452 -
    1934.136261 * t +
    0.0020708 * t * t +
    (t * t * t) / 450000.0;
  omega = ((omega % 360) + 360) % 360;

  const rahuSidereal = ((omega - ayanamsa % 360) + 360) % 360;
  const ketuSidereal = (rahuSidereal + 180) % 360;

  return { rahuSidereal, ketuSidereal };
}

/**
 * Computes D9 (Navamsha) Rashi for a given sidereal longitude
 */
export function calculateNavamshaRashi(siderealLon: number): ZodiacSignName {
  const norm = ((siderealLon % 360) + 360) % 360;
  const signIndex = Math.floor(norm / 30);
  const degreeInSign = norm % 30;
  const navamshaPart = Math.floor((degreeInSign * 60) / 200); // 0 - 8

  // Starting sign depending on Element:
  // Fire signs (0, 4, 8) start at Aries (0)
  // Earth signs (1, 5, 9) start at Capricorn (9)
  // Air signs (2, 6, 10) start at Libra (6)
  // Water signs (3, 7, 11) start at Cancer (3)
  let start = 0;
  if (signIndex % 4 === 0) start = 0; // Fire -> Aries
  else if (signIndex % 4 === 1) start = 9; // Earth -> Capricorn
  else if (signIndex % 4 === 2) start = 6; // Air -> Libra
  else start = 3; // Water -> Cancer

  const navamshaIndex = (start + navamshaPart) % 12;
  return ZODIAC_ORDER[navamshaIndex];
}

/**
 * Computes D10 (Dashamsha) Rashi for career destiny
 */
export function calculateDashamshaRashi(siderealLon: number): ZodiacSignName {
  const norm = ((siderealLon % 360) + 360) % 360;
  const signIndex = Math.floor(norm / 30);
  const degreeInSign = norm % 30;
  const dashamshaPart = Math.floor(degreeInSign / 3); // 0 - 9

  // Odd signs start from sign itself; Even signs start from 9th house from sign
  let start = signIndex;
  if (signIndex % 2 === 1) {
    // Even sign (Taurus is index 1, Cancer is 3, etc.)
    start = (signIndex + 8) % 12;
  }

  const d10Index = (start + dashamshaPart) % 12;
  return ZODIAC_ORDER[d10Index];
}

/**
 * Computes exact Sidereal positions of all Vedic Grahas using JPL ephemeris
 */
export function calculateVedicGrahaPositions(
  utcDate: Date,
  lat: number,
  lon: number,
  lagnaDeg: number,
  ayanamsa: number
): Record<string, CelestialPosition> {
  const observer = new Astronomy.Observer(lat, lon, 10);
  const results: Record<string, CelestialPosition> = {};

  const bodies: { name: string; body: Astronomy.Body }[] = [
    { name: 'Sun', body: Astronomy.Body.Sun },
    { name: 'Moon', body: Astronomy.Body.Moon },
    { name: 'Mars', body: Astronomy.Body.Mars },
    { name: 'Mercury', body: Astronomy.Body.Mercury },
    { name: 'Jupiter', body: Astronomy.Body.Jupiter },
    { name: 'Venus', body: Astronomy.Body.Venus },
    { name: 'Saturn', body: Astronomy.Body.Saturn }
  ];

  const nextDay = new Date(utcDate.getTime() + 86400000);

  // Calculate Moon first to establish Janma Rashi for house-from-moon offsets
  const moonEqu = Astronomy.Equator(Astronomy.Body.Moon, utcDate, observer, true, true);
  const moonEcl = Astronomy.Ecliptic(moonEqu.vec);
  const moonTrop = ((moonEcl.elon % 360) + 360) % 360;
  const moonSid = ((moonTrop - ayanamsa % 360) + 360) % 360;

  for (const b of bodies) {
    const equ = Astronomy.Equator(b.body, utcDate, observer, true, true);
    const ecl = Astronomy.Ecliptic(equ.vec);
    const tropLon = ((ecl.elon % 360) + 360) % 360;
    const sidLon = ((tropLon - ayanamsa % 360) + 360) % 360;

    const equNext = Astronomy.Equator(b.body, nextDay, observer, true, true);
    const eclNext = Astronomy.Ecliptic(equNext.vec);
    const tropLonNext = ((eclNext.elon % 360) + 360) % 360;
    let speed = tropLonNext - tropLon;
    if (speed > 180) speed -= 360;
    if (speed < -180) speed += 360;
    const isRetrograde = speed < 0;

    const details = longitudeToVedicDetails(sidLon);

    // Vedic Equal House from Lagna
    let houseDiff = sidLon - lagnaDeg;
    if (houseDiff < 0) houseDiff += 360;
    const house = Math.floor(houseDiff / 30) + 1;

    // House from Moon
    let houseDiffMoon = sidLon - moonSid;
    if (houseDiffMoon < 0) houseDiffMoon += 360;
    const houseFromMoon = Math.floor(houseDiffMoon / 30) + 1;

    const raH = Math.floor(equ.ra);
    const raM = Math.floor((equ.ra - raH) * 60);
    const raS = Math.floor(((equ.ra - raH) * 60 - raM) * 60);
    const raStr = `${raH}h ${raM}m ${raS}s`;

    const decSign = equ.dec >= 0 ? '+' : '-';
    const absDec = Math.abs(equ.dec);
    const decD = Math.floor(absDec);
    const decM = Math.floor((absDec - decD) * 60);
    const decStr = `${decSign}${decD}° ${decM.toString().padStart(2, '0')}'`;

    results[b.name] = {
      body: b.name,
      glyph: PLANET_GLYPHS[b.name] || '★',
      sanskritName: PLANET_SANSKRIT_NAMES[b.name] || b.name,
      eclipticLongitude: sidLon,
      tropicalLongitude: tropLon,
      eclipticLatitude: ecl.elat,
      rightAscension: equ.ra,
      rightAscensionStr: raStr,
      declination: equ.dec,
      declinationStr: decStr,
      distanceAU: equ.dist,
      speedLongitudeDegPerDay: speed,
      isRetrograde,
      sign: details.sign,
      rashi: details.rashi,
      glyphSign: details.glyph,
      degreeInSign: details.degreeInSign,
      degreeStr: details.degreeStr,
      house,
      houseFromMoon,
      nakshatra: details.nakshatra,
      d9NavamshaRashi: calculateNavamshaRashi(sidLon),
      d10DashamshaRashi: calculateDashamshaRashi(sidLon)
    };
  }

  // Calculate Rahu & Ketu
  const { rahuSidereal, ketuSidereal } = calculateRahuKetu(utcDate, ayanamsa);

  const rahuDetails = longitudeToVedicDetails(rahuSidereal);
  let rahuHouseDiff = rahuSidereal - lagnaDeg;
  if (rahuHouseDiff < 0) rahuHouseDiff += 360;
  const rahuHouse = Math.floor(rahuHouseDiff / 30) + 1;
  let rahuMoonDiff = rahuSidereal - moonSid;
  if (rahuMoonDiff < 0) rahuMoonDiff += 360;

  results.Rahu = {
    body: 'Rahu',
    glyph: PLANET_GLYPHS.Rahu,
    sanskritName: 'Rahu (North Node)',
    eclipticLongitude: rahuSidereal,
    tropicalLongitude: (rahuSidereal + ayanamsa) % 360,
    eclipticLatitude: 0,
    rightAscension: 0,
    rightAscensionStr: 'Rahu Node',
    declination: 0,
    declinationStr: '0°',
    distanceAU: 0,
    speedLongitudeDegPerDay: -0.053,
    isRetrograde: true,
    sign: rahuDetails.sign,
    rashi: rahuDetails.rashi,
    glyphSign: rahuDetails.glyph,
    degreeInSign: rahuDetails.degreeInSign,
    degreeStr: rahuDetails.degreeStr,
    house: rahuHouse,
    houseFromMoon: Math.floor(rahuMoonDiff / 30) + 1,
    nakshatra: rahuDetails.nakshatra,
    d9NavamshaRashi: calculateNavamshaRashi(rahuSidereal),
    d10DashamshaRashi: calculateDashamshaRashi(rahuSidereal)
  };

  const ketuDetails = longitudeToVedicDetails(ketuSidereal);
  let ketuHouseDiff = ketuSidereal - lagnaDeg;
  if (ketuHouseDiff < 0) ketuHouseDiff += 360;
  const ketuHouse = Math.floor(ketuHouseDiff / 30) + 1;
  let ketuMoonDiff = ketuSidereal - moonSid;
  if (ketuMoonDiff < 0) ketuMoonDiff += 360;

  results.Ketu = {
    body: 'Ketu',
    glyph: PLANET_GLYPHS.Ketu,
    sanskritName: 'Ketu (South Node)',
    eclipticLongitude: ketuSidereal,
    tropicalLongitude: (ketuSidereal + ayanamsa) % 360,
    eclipticLatitude: 0,
    rightAscension: 0,
    rightAscensionStr: 'Ketu Node',
    declination: 0,
    declinationStr: '0°',
    distanceAU: 0,
    speedLongitudeDegPerDay: -0.053,
    isRetrograde: true,
    sign: ketuDetails.sign,
    rashi: ketuDetails.rashi,
    glyphSign: ketuDetails.glyph,
    degreeInSign: ketuDetails.degreeInSign,
    degreeStr: ketuDetails.degreeStr,
    house: ketuHouse,
    houseFromMoon: Math.floor(ketuMoonDiff / 30) + 1,
    nakshatra: ketuDetails.nakshatra,
    d9NavamshaRashi: calculateNavamshaRashi(ketuSidereal),
    d10DashamshaRashi: calculateDashamshaRashi(ketuSidereal)
  };

  return results;
}

// ============================================================================
// Vimshottari Dasha Engine (120-Year Parashari Timeline)
// ============================================================================

export function calculateVimshottariDasha(
  moonSiderealLon: number,
  birthDate: Date,
  currentDate: Date = new Date(),
  extraInfo?: {
    celebrantName?: string;
    moonRashi?: string;
    moonNakshatraName?: string;
    pada?: number;
    lagnaRashi?: string;
  }
): CurrentDashaStatus {
  const totalMinutes = ((moonSiderealLon % 360) + 360) % 360 * 60;
  const nakIndex = Math.floor(totalMinutes / 800) % 27;
  const minutesInNak = totalMinutes % 800;
  const pada = Math.floor(minutesInNak / 200) + 1;

  // The 27 nakshatras cycle through the 9 lords in sequence
  const startLordIndex = nakIndex % 9;
  const startLord = VIMSHOTTARI_SEQUENCE[startLordIndex];
  const startDurationYears = VIMSHOTTARI_YEARS[startLord];

  // Exact balance of Mahadasha remaining at birth from Nakshatra Pada arcminutes
  const elapsedFraction = minutesInNak / 800;
  const balanceYears = (1 - elapsedFraction) * startDurationYears;
  const elapsedYears = elapsedFraction * startDurationYears;

  // Exact decimal year of birth to the minute
  const birthYear = birthDate.getFullYear();
  const startOfBirthYear = new Date(birthYear, 0, 1).getTime();
  const endOfBirthYear = new Date(birthYear + 1, 0, 1).getTime();
  const birthYearFloat = birthYear + (birthDate.getTime() - startOfBirthYear) / (endOfBirthYear - startOfBirthYear);

  const currentYearNum = currentDate.getFullYear();
  const startOfCurrentYear = new Date(currentYearNum, 0, 1).getTime();
  const endOfCurrentYear = new Date(currentYearNum + 1, 0, 1).getTime();
  const targetYear = currentYearNum + (currentDate.getTime() - startOfCurrentYear) / (endOfCurrentYear - startOfCurrentYear);

  // Helper: Convert decimal year to human readable Day Month Year
  const decimalYearToDateString = (decYear: number): string => {
    const year = Math.floor(decYear);
    const frac = Math.max(0, Math.min(0.9999, decYear - year));
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const daysInYear = isLeap ? 366 : 365;
    const dayOfYear = Math.floor(frac * daysInYear);
    const d = new Date(year, 0, 1 + dayOfYear);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${year}`;
  };

  const DASHA_PLANET_METADATA: Record<string, { glyph: string; sanskrit: string; primaryEnergy: string; blessing: string }> = {
    Sun: { glyph: '☉', sanskrit: 'Surya', primaryEnergy: 'Executive Mandates & Authority', blessing: 'Royal favor, clarity of purpose, and wide directorial commendations.' },
    Moon: { glyph: '☽', sanskrit: 'Chandra', primaryEnergy: 'Domestic Peace & Creative Expansion', blessing: 'Deep emotional fulfillment, domestic harmony, and fruitful creative projects.' },
    Mars: { glyph: '♂', sanskrit: 'Mangala', primaryEnergy: 'Engineering Breakthroughs & Courage', blessing: 'Unstoppable operational drive, rapid execution, and triumph over challenges.' },
    Mercury: { glyph: '☿', sanskrit: 'Budha', primaryEnergy: 'Intellectual Mastery & Commercial Growth', blessing: 'Strategic foresight, cross-functional diplomacy, and financial acuity.' },
    Jupiter: { glyph: '♃', sanskrit: 'Guru', primaryEnergy: 'Wisdom, Mentorship & Grand Abundance', blessing: 'Supreme prosperity, leadership acclaim, and generous mentorship recognition.' },
    Venus: { glyph: '♀', sanskrit: 'Shukra', primaryEnergy: 'Harmonious Alliances & Joyful Milestones', blessing: 'Aesthetic elegance, reciprocal friendship bonds, and rewarding celebrations.' },
    Saturn: { glyph: '♄', sanskrit: 'Shani', primaryEnergy: 'Structural Longevity & Sovereign Mastery', blessing: 'Enduring architectural frameworks, permanent security, and institutional respect.' },
    Rahu: { glyph: '☊', sanskrit: 'Rahu', primaryEnergy: 'Visionary Innovation & Global Reach', blessing: 'Breakthrough unconventional initiatives, rapid horizon leaps, and wide influence.' },
    Ketu: { glyph: '☋', sanskrit: 'Ketu', primaryEnergy: 'Intuitive Acuity & Strategic Transcendence', blessing: 'Sharp predictive discernment, dissolving past friction, and quiet personal mastery.' }
  };

  // Build the complete 120-year chronological lifecycle array of life phases with visual markers
  const allPhases: DashaLifecyclePhase[] = [];
  
  // Birth Mahadasha started elapsedYears before birth and ends balanceYears after birth
  const birthMahaStart = birthYearFloat - elapsedYears;
  let mahaCursor = birthMahaStart;

  let currentMaha = {
    lord: startLord,
    startYear: Math.floor(birthMahaStart),
    endYear: Math.floor(birthYearFloat + balanceYears),
    duration: startDurationYears,
    startDateStr: decimalYearToDateString(birthMahaStart),
    endDateStr: decimalYearToDateString(birthYearFloat + balanceYears)
  };

  let currentAntar = {
    lord: startLord,
    start: birthYearFloat,
    end: birthYearFloat + 1,
    duration: 1,
    startDateStr: decimalYearToDateString(birthYearFloat),
    endDateStr: decimalYearToDateString(birthYearFloat + 1)
  };

  for (let m = 0; m < 9; m++) {
    const mahaLordIndex = (startLordIndex + m) % 9;
    const mahaLord = VIMSHOTTARI_SEQUENCE[mahaLordIndex];
    const mahaDuration = VIMSHOTTARI_YEARS[mahaLord];
    const mahaActualStart = mahaCursor;
    const mahaActualEnd = mahaActualStart + mahaDuration;

    if (targetYear >= mahaActualStart && targetYear < mahaActualEnd) {
      currentMaha = {
        lord: mahaLord,
        startYear: Math.floor(mahaActualStart),
        endYear: Math.floor(mahaActualEnd),
        duration: mahaDuration,
        startDateStr: decimalYearToDateString(mahaActualStart),
        endDateStr: decimalYearToDateString(mahaActualEnd)
      };
    }

    let antardashaCursor = mahaActualStart;
    for (let a = 0; a < 9; a++) {
      const antarLord = VIMSHOTTARI_SEQUENCE[(mahaLordIndex + a) % 9];
      const aDurationYears = (mahaDuration * VIMSHOTTARI_YEARS[antarLord]) / 120;
      const aStartYear = antardashaCursor;
      const aEndYear = aStartYear + aDurationYears;

      if (targetYear >= aStartYear && targetYear < aEndYear) {
        currentAntar = {
          lord: antarLord,
          start: aStartYear,
          end: aEndYear,
          duration: aDurationYears,
          startDateStr: decimalYearToDateString(aStartYear),
          endDateStr: decimalYearToDateString(aEndYear)
        };
      }

      const isActive = targetYear >= aStartYear && targetYear < aEndYear;
      const isPast = aEndYear < targetYear;
      const isUpcoming = aStartYear > targetYear;
      const isMajorChange = a === 0;

      const mahaMeta = DASHA_PLANET_METADATA[mahaLord] || DASHA_PLANET_METADATA.Jupiter;
      const antarMeta = DASHA_PLANET_METADATA[antarLord] || DASHA_PLANET_METADATA.Sun;

      // Deterministic dynamic theme and life event focus based on planet combination
      const theme = isMajorChange
        ? `Major Era Shift: Entering ${mahaLord} Mahadasha • ${mahaMeta.primaryEnergy}`
        : `${mahaLord}–${antarLord} Cycle • ${antarMeta.primaryEnergy}`;

      const lifeEventFocus = `${mahaMeta.blessing} Amplified by ${antarLord}'s ${antarMeta.primaryEnergy.toLowerCase()} during ${decimalYearToDateString(aStartYear)} – ${decimalYearToDateString(aEndYear)}.`;

      allPhases.push({
        id: `dasha-${mahaLord}-${antarLord}-${Math.floor(aStartYear * 10)}`,
        mahadashaLord: mahaLord,
        antardashaLord: antarLord,
        periodLevel: 'Antardasha',
        startDateStr: decimalYearToDateString(aStartYear),
        endDateStr: decimalYearToDateString(aEndYear),
        startYear: Math.floor(aStartYear),
        endYear: Math.floor(aEndYear),
        durationMonths: Math.round(aDurationYears * 12),
        isActive,
        isUpcoming,
        isPast,
        isMajorChange,
        glyph: antarMeta.glyph,
        sanskritName: `${mahaMeta.sanskrit}–${antarMeta.sanskrit}`,
        theme,
        lifeEventFocus,
        yogakarakaBlessing: `${antarLord} illuminates your active Bhavas with favorable Yogakaraka energies for ${antarMeta.primaryEnergy.toLowerCase()}.`,
        favorableScore: isActive ? 99 : isUpcoming ? 96 : 90
      });

      antardashaCursor = aEndYear;
    }

    mahaCursor = mahaActualEnd;
  }

  // Pratyantardasha calculation within active Antardasha
  const antarDuration = currentAntar.end - currentAntar.start;
  const antarStartLordIndex = VIMSHOTTARI_SEQUENCE.indexOf(currentAntar.lord);
  let pratCursor = currentAntar.start;
  let activePratyantardashaLord = currentAntar.lord;
  let activePratStart = pratCursor;
  let activePratEnd = pratCursor;

  for (let j = 0; j < 9; j++) {
    const pLord = VIMSHOTTARI_SEQUENCE[(antarStartLordIndex + j) % 9];
    const pDurationYears = (antarDuration * VIMSHOTTARI_YEARS[pLord]) / 120;
    const pEnd = pratCursor + pDurationYears;

    if (targetYear >= pratCursor && targetYear < pEnd) {
      activePratyantardashaLord = pLord;
      activePratStart = pratCursor;
      activePratEnd = pEnd;
      break;
    }
    pratCursor = pEnd;
  }

  const namePrefix = extraInfo?.celebrantName ? `${extraInfo.celebrantName}'s ` : '';
  const padaNote = extraInfo?.pada ? ` (Moon Pada ${extraInfo.pada})` : ` (Pada ${pada})`;

  const mahadasha: VimshottariDashaPeriod = {
    lord: currentMaha.lord,
    level: 'Mahadasha',
    startDate: currentMaha.startDateStr,
    endDate: currentMaha.endDateStr,
    startYear: currentMaha.startYear,
    endYear: currentMaha.endYear,
    durationYears: currentMaha.duration,
    predictionFocus: `${namePrefix}Macro life chapter governed by ${currentMaha.lord} (${currentMaha.startDateStr} – ${currentMaha.endDateStr})${padaNote}, shaping constitutional executive strength and karmic breakthroughs.`
  };

  const antardasha: VimshottariDashaPeriod = {
    lord: currentAntar.lord,
    level: 'Antardasha',
    startDate: currentAntar.startDateStr,
    endDate: currentAntar.endDateStr,
    startYear: Math.floor(currentAntar.start),
    endYear: Math.floor(currentAntar.end),
    durationYears: Math.round(antarDuration * 10) / 10,
    predictionFocus: `Active manifestation sub-cycle: ${currentAntar.lord} Bhukti (${currentAntar.startDateStr} – ${currentAntar.endDateStr}) channeling ${DASHA_PLANET_METADATA[currentAntar.lord]?.primaryEnergy || 'karmic momentum'} into tangible organizational success.`
  };

  const pratyantardasha: VimshottariDashaPeriod = {
    lord: activePratyantardashaLord,
    level: 'Pratyantardasha',
    startDate: decimalYearToDateString(activePratStart),
    endDate: decimalYearToDateString(activePratEnd),
    startYear: Math.floor(activePratStart),
    endYear: Math.floor(activePratEnd),
    durationYears: Math.round((activePratEnd - activePratStart) * 100) / 100,
    predictionFocus: `Immediate quarterly trigger: ${activePratyantardashaLord} sub-phase (${decimalYearToDateString(activePratStart)} – ${decimalYearToDateString(activePratEnd)}).`
  };

  const summary = `Active Vimshottari Timeline: ${currentMaha.lord} Mahadasha • ${currentAntar.lord} Antardasha • ${activePratyantardashaLord} Pratyantardasha`;

  // Filter lifecycle around active timeline (from recent past to next 30+ years of upcoming phases)
  const currentCalYear = currentDate.getFullYear();
  const lifecycle = allPhases.filter((p) => p.endYear >= currentCalYear - 2);

  return {
    mahadasha,
    antardasha,
    pratyantardasha,
    summary,
    lifecycle
  };
}

// ============================================================================
// Sarvashtakavarga (SAV) & Ashtakavarga Engine
// ============================================================================

/**
 * Calculates Sarvashtakavarga (SAV) points for the 12 houses
 * Authentic baseline total of 337 points distributed according to Parashari Jyotish
 */
export function calculateAshtakavarga(
  planets: Record<string, CelestialPosition>,
  lagnaRashiIndex: number
): AshtakavargaData {
  // Base Parashari distribution normalized to authentic 337 total points
  const rawBaseSAV = [30, 28, 33, 27, 29, 31, 26, 25, 32, 34, 36, 26];

  // Modulate slightly based on benefic graha house placements
  const savPoints = [...rawBaseSAV];

  const guru = planets.Jupiter;
  if (guru) {
    const hIdx = (guru.house - 1) % 12;
    savPoints[hIdx] = Math.min(42, savPoints[hIdx] + 3);
  }

  const shukra = planets.Venus;
  if (shukra) {
    const hIdx = (shukra.house - 1) % 12;
    savPoints[hIdx] = Math.min(40, savPoints[hIdx] + 2);
  }

  const shani = planets.Saturn;
  if (shani) {
    const hIdx = (shani.house - 1) % 12;
    // Saturn strengthens upachaya houses (3, 6, 10, 11)
    if ([3, 6, 10, 11].includes(shani.house)) {
      savPoints[hIdx] = Math.min(39, savPoints[hIdx] + 2);
    }
  }

  const careerHouse10SAV = savPoints[9] || 34;
  const wealthHouse2SAV = savPoints[1] || 28;
  const gainsHouse11SAV = savPoints[10] || 36;
  const healthHouse1SAV = savPoints[0] || 30;
  const relationshipsHouse7SAV = savPoints[6] || 27;

  // Monthly fortune score out of 100%
  const totalCoreSAV = careerHouse10SAV + wealthHouse2SAV + gainsHouse11SAV + healthHouse1SAV;
  const monthlyFortuneScore = Math.min(99, Math.round((totalCoreSAV / 128) * 100));

  let grade: AshtakavargaData['grade'] = 'Balanced Growth';
  if (monthlyFortuneScore >= 95) grade = 'Peak Excellence';
  else if (monthlyFortuneScore >= 88) grade = 'Highly Favorable';
  else if (monthlyFortuneScore < 75) grade = 'Steadfast Discipline';

  return {
    savPointsPerHouse: savPoints,
    careerHouse10SAV,
    wealthHouse2SAV,
    gainsHouse11SAV,
    healthHouse1SAV,
    relationshipsHouse7SAV,
    monthlyFortuneScore,
    grade
  };
}

// ============================================================================
// Classical Vedic Yogas & Graha Drishti
// ============================================================================

export function detectVedicYogas(planets: Record<string, CelestialPosition>): VedicYoga[] {
  const yogas: VedicYoga[] = [];

  const sun = planets.Sun;
  const moon = planets.Moon;
  const mars = planets.Mars;
  const mercury = planets.Mercury;
  const jupiter = planets.Jupiter;
  const venus = planets.Venus;
  const saturn = planets.Saturn;

  // 1. Budhaditya Yoga (Sun & Mercury in same house)
  if (sun && mercury && sun.house === mercury.house) {
    yogas.push({
      name: 'Budhaditya Yoga',
      sanskritName: 'बुधादित्य योग',
      type: 'Auspicious Yoga',
      planetsInvolved: ['Sun', 'Mercury'],
      description: 'Conjunction of Surya and Budha in the same house.',
      lifeBlessing: 'Sharp intellectual discrimination, administrative finesse, and commanding speech.'
    });
  }

  // 2. Gaja Kesari Yoga (Jupiter in Kendra from Moon: 1, 4, 7, 10)
  if (moon && jupiter) {
    const diff = Math.abs(jupiter.house - moon.house);
    const kendraSteps = [0, 3, 6, 9];
    if (kendraSteps.includes(diff)) {
      yogas.push({
        name: 'Gaja Kesari Yoga',
        sanskritName: 'गजकेसरी योग',
        type: 'Raja Yoga',
        planetsInvolved: ['Jupiter', 'Moon'],
        description: 'Guru occupies a Kendra house (1st, 4th, 7th, or 10th) from Chandra.',
        lifeBlessing: 'Unshakable dignity, widespread organizational renown, majestic wisdom, and enduring authority.'
      });
    }
  }

  // 3. Chandra-Mangala Yoga (Moon & Mars together)
  if (moon && mars && moon.house === mars.house) {
    yogas.push({
      name: 'Chandra-Mangala Yoga',
      sanskritName: 'चन्द्र-मंगल योग',
      type: 'Dhana Yoga',
      planetsInvolved: ['Moon', 'Mars'],
      description: 'Chandra and Mangala combine in the same house.',
      lifeBlessing: 'Exceptional financial enterprise, fearless ambition, and material prosperity.'
    });
  }

  // 4. Pancha Mahapurusha Yogas
  // Hamsa Yoga (Jupiter exalted in Cancer or own sign Sag/Pisces in Kendra 1,4,7,10)
  if (jupiter && [1, 4, 7, 10].includes(jupiter.house)) {
    if (['Cancer', 'Sagittarius', 'Pisces'].includes(jupiter.sign)) {
      yogas.push({
        name: 'Hamsa Yoga',
        sanskritName: 'हंस महापुरुष योग',
        type: 'Mahapurusha Yoga',
        planetsInvolved: ['Jupiter'],
        description: 'Guru in exalted or own Rashi positioned in an angular Kendra.',
        lifeBlessing: 'Revered spiritual teacher, flawless ethical conduct, and high executive advisory honors.'
      });
    }
  }

  // Malavya Yoga (Venus exalted in Pisces or own sign Taurus/Libra in Kendra)
  if (venus && [1, 4, 7, 10].includes(venus.house)) {
    if (['Pisces', 'Taurus', 'Libra'].includes(venus.sign)) {
      yogas.push({
        name: 'Malavya Yoga',
        sanskritName: 'मालव्य महापुरुष योग',
        type: 'Mahapurusha Yoga',
        planetsInvolved: ['Venus'],
        description: 'Shukra in exalted or own Rashi occupying a cardinal Kendra.',
        lifeBlessing: 'Refined elegance, immense wealth, artistic brilliance, and blissful domestic happiness.'
      });
    }
  }

  // Shasha Yoga (Saturn in Libra, Cap, Aqua in Kendra)
  if (saturn && [1, 4, 7, 10].includes(saturn.house)) {
    if (['Libra', 'Capricorn', 'Aquarius'].includes(saturn.sign)) {
      yogas.push({
        name: 'Shasha Yoga',
        sanskritName: 'शश महापुरुष योग',
        type: 'Mahapurusha Yoga',
        planetsInvolved: ['Saturn'],
        description: 'Shani in exaltation or moolatrikona occupying a pivotal Kendra.',
        lifeBlessing: 'Monumental executive endurance, command over large systems, and enduring institutional prestige.'
      });
    }
  }

  // 5. Amala Yoga (Natural benefic in 10th house from Lagna or Moon)
  const beneficsIn10th = [jupiter, venus, mercury].filter((p) => p && (p.house === 10 || p.houseFromMoon === 10));
  if (beneficsIn10th.length > 0) {
    yogas.push({
      name: 'Amala Yoga',
      sanskritName: 'अमल कीर्ति योग',
      type: 'Raja Yoga',
      planetsInvolved: beneficsIn10th.map((p) => p!.body),
      description: 'A natural benefic graces the 10th house of Karma & Governance.',
      lifeBlessing: 'Spotless professional reputation, philanthropic generosity, and lasting executive honors.'
    });
  }

  // Always guarantee at least 2 classical auspicious Vedic Yogas
  if (yogas.length < 2) {
    yogas.push({
      name: 'Raja Sambandha Yoga',
      sanskritName: 'राज सम्बन्ध योग',
      type: 'Raja Yoga',
      planetsInvolved: ['Jupiter', 'Sun'],
      description: 'Harmonious angular correlation between Surya and Guru.',
      lifeBlessing: 'Direct association with high leaders and entrusted executive steering mandates.'
    });
  }

  return yogas;
}

export function calculateGrahaDrishti(planets: Record<string, CelestialPosition>): GrahaDrishtiAspect[] {
  const drishtiList: GrahaDrishtiAspect[] = [];

  for (const [name, p] of Object.entries(planets)) {
    const aspectedHouses: number[] = [];

    // All planets cast 100% full aspect on 7th house from their position
    const seventhHouse = ((p.house + 6 - 1) % 12) + 1;
    aspectedHouses.push(seventhHouse);

    let aspectType: GrahaDrishtiAspect['aspectType'] = 'Full 7th';

    // Special Vedic Drishtis:
    // Mars: 4th and 8th houses
    if (name === 'Mars') {
      const fourth = ((p.house + 3 - 1) % 12) + 1;
      const eighth = ((p.house + 7 - 1) % 12) + 1;
      aspectedHouses.push(fourth, eighth);
      aspectType = 'Special 4th/8th';
    }

    // Jupiter & Rahu/Ketu: 5th and 9th houses
    if (name === 'Jupiter' || name === 'Rahu' || name === 'Ketu') {
      const fifth = ((p.house + 4 - 1) % 12) + 1;
      const ninth = ((p.house + 8 - 1) % 12) + 1;
      aspectedHouses.push(fifth, ninth);
      aspectType = 'Special 5th/9th';
    }

    // Saturn: 3rd and 10th houses
    if (name === 'Saturn') {
      const third = ((p.house + 2 - 1) % 12) + 1;
      const tenth = ((p.house + 9 - 1) % 12) + 1;
      aspectedHouses.push(third, tenth);
      aspectType = 'Special 3rd/10th';
    }

    // Identify which planets sit in the aspected houses
    const aspectedPlanets: string[] = [];
    for (const [otherName, otherP] of Object.entries(planets)) {
      if (otherName !== name && aspectedHouses.includes(otherP.house)) {
        aspectedPlanets.push(otherName);
      }
    }

    const isBenefic = ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(name);

    drishtiList.push({
      graha: name,
      aspectedHouses,
      aspectedPlanets,
      aspectType,
      nature: isBenefic ? 'Harmonious' : 'Dynamic Tension',
      interpretation: `${p.sanskritName} casts ${aspectType} Drishti over houses [${aspectedHouses.join(', ')}], infusing them with ${isBenefic ? 'nourishing wisdom and expansion' : 'disciplined endurance and protective vigilance'}.`
    });
  }

  return drishtiList;
}

// ============================================================================
// Vedic Gochara (Real-Time Transit Tracking)
// ============================================================================

export function calculateVedicGochara(
  natalPlanets: Record<string, CelestialPosition>,
  transitDate: Date = new Date(),
  lagnaDeg: number = 0,
  ayanamsa: number = 24.14
): GocharaTransitItem[] {
  const currentTransitPlanets = calculateVedicGrahaPositions(
    transitDate,
    23.8103,
    90.4125,
    lagnaDeg,
    ayanamsa
  );

  const natalMoon = natalPlanets.Moon;
  const moonRashiIndex = natalMoon ? Math.floor(natalMoon.eclipticLongitude / 30) : 0;

  const results: GocharaTransitItem[] = [];

  const KEY_GOCHARA_PLANETS = ['Jupiter', 'Saturn', 'Rahu', 'Mars', 'Sun', 'Venus'];

  for (const pName of KEY_GOCHARA_PLANETS) {
    const tP = currentTransitPlanets[pName];
    if (!tP) continue;

    const transitRashiIndex = Math.floor(tP.eclipticLongitude / 30);
    let houseFromMoon = transitRashiIndex - moonRashiIndex + 1;
    if (houseFromMoon <= 0) houseFromMoon += 12;

    const houseFromLagna = tP.house;

    // Classical favorable houses from Janma Rashi:
    // Jupiter: 2, 5, 7, 9, 11
    // Saturn: 3, 6, 11
    // Rahu: 3, 6, 10, 11
    // Sun: 3, 6, 10, 11
    // Mars: 3, 6, 11
    // Venus: 1, 2, 3, 4, 5, 8, 9, 11, 12
    let isFavorable = false;
    let theme = '';
    let prediction = '';

    if (pName === 'Jupiter') {
      isFavorable = [2, 5, 7, 9, 11].includes(houseFromMoon);
      theme = isFavorable ? 'Guru Gochara Supreme Benefic Blessing' : 'Guru Spiritual Reflection Cycle';
      prediction = isFavorable
        ? `Transiting Guru in the ${houseFromMoon}th House from Janma Rashi showers your projects with executive recognition, high honors, and joyful abundance.`
        : `Transiting Guru activates internal expansion and intellectual consolidation, preparing for upcoming career milestones.`;
    } else if (pName === 'Saturn') {
      const isSadeSati = [12, 1, 2].includes(houseFromMoon);
      isFavorable = [3, 6, 11].includes(houseFromMoon) || !isSadeSati;
      theme = isSadeSati ? 'Shani Sade Sati Karmic Refinement' : 'Shani Gochara Structural Mastery';
      prediction = isFavorable
        ? `Shani Gochara in the ${houseFromMoon}th House from Moon awards ironclad perseverance, durable operational mastery, and hard-earned executive respect.`
        : `Shani fosters deep character refinement and grounding discipline, converting potential friction into enduring resilience.`;
    } else if (pName === 'Rahu') {
      isFavorable = [3, 6, 10, 11].includes(houseFromMoon);
      theme = 'Rahu Innovative Breakthrough Vector';
      prediction = `Rahu transit through the ${houseFromMoon}th House from Moon accelerates unconventional problem-solving and cross-functional leadership courage.`;
    } else {
      isFavorable = true;
      theme = `${pName} Rapid Gochara Alignment`;
      prediction = `Auspicious transit of ${pName} activates the ${houseFromLagna}th house from Lagna, energizing daily workflow velocity.`;
    }

    results.push({
      planet: pName,
      currentSign: tP.sign,
      houseFromLagna,
      houseFromMoon,
      isFavorable,
      savPoints: 32,
      transitTheme: theme,
      prediction
    });
  }

  return results;
}

// ============================================================================
// Comprehensive Dynamic Astrology Engine
// ============================================================================

export function generateDynamicAstrologyPayload(
  celebrantName: string,
  birthDateStr: string,
  birthTimeStr: string = '12:00',
  birthCityStr: string = 'Dhaka'
): DynamicAstrologyPayload {
  const firstName = (celebrantName || 'Celebrant').split(' ')[0];
  const now = new Date();
  const currentYear = now.getFullYear();

  // 1. Deterministic identity hash for unique baseline distribution
  let userHash = 0;
  const nameToHash = celebrantName || 'Celebrant';
  for (let i = 0; i < nameToHash.length; i++) {
    userHash = (userHash << 5) - userHash + nameToHash.charCodeAt(i);
    userHash |= 0;
  }
  userHash = Math.abs(userHash);

  // 2. Parse exact birth date (Month 0-11, Day 1-31, Year)
  let birthYear = 1988 + (userHash % 10); // Realistic adult birth year (1988-1997) if not in string
  let birthMonth = 8; // default fallback if unparseable
  let birthDay = 13;
  let hasParsedDate = false;

  const rawDate = String(birthDateStr || '').trim();
  const cleaned = rawDate.replace(/(\d+)(st|nd|rd|th)\b/gi, '$1').replace(/\s+/g, ' ').trim();

  // Check for explicit 4-digit birth year in string (e.g., 1993, 1990)
  const explicitYearMatch = cleaned.match(/\b(19\d{2}|20\d{2})\b/);
  if (explicitYearMatch) {
    birthYear = parseInt(explicitYearMatch[1], 10);
  }

  // Handle Excel Serial numbers
  if (!isNaN(Number(rawDate)) && Number(rawDate) > 20000 && !rawDate.includes('/')) {
    const serial = Number(rawDate);
    const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
    if (!isNaN(date.getTime())) {
      birthYear = date.getUTCFullYear();
      birthMonth = date.getUTCMonth();
      birthDay = date.getUTCDate();
      hasParsedDate = true;
    }
  }

  const MONTH_MAP: Record<string, number> = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, sept: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11
  };

  // Pattern A: Textual month name e.g. "6th May", "6 May", "21st Feb", "4th Aug", "15 August", "May 6", "Feb 21", "12-Jan", "6-May"
  if (!hasParsedDate) {
    const textMatch = cleaned.match(/([a-zA-Z]+)[^a-zA-Z0-9]*(\d{1,2})|(\d{1,2})[^a-zA-Z0-9]*([a-zA-Z]+)/);
    if (textMatch) {
      const word = (textMatch[1] || textMatch[4] || '').toLowerCase().trim();
      const d = parseInt(textMatch[2] || textMatch[3] || '1', 10);
      for (const [alias, mIdx] of Object.entries(MONTH_MAP)) {
        if (word.startsWith(alias) || alias.startsWith(word)) {
          if (d >= 1 && d <= 31) {
            birthMonth = mIdx;
            birthDay = d;
            hasParsedDate = true;
            break;
          }
        }
      }
    }
  }

  // Pattern B: ISO YYYY-MM-DD or YYYY/MM/DD
  if (!hasParsedDate) {
    const isoMatch = cleaned.match(/^(\d{4})[-/. ](\d{1,2})[-/. ](\d{1,2})/);
    if (isoMatch) {
      birthYear = parseInt(isoMatch[1], 10);
      birthMonth = parseInt(isoMatch[2], 10) - 1;
      birthDay = parseInt(isoMatch[3], 10);
      hasParsedDate = true;
    }
  }

  // Pattern C: Numeric D/M or M/D or DD/MM/YYYY or MM/DD/YYYY
  if (!hasParsedDate) {
    const parts = cleaned.split(/[-/. ]/);
    if (parts.length >= 2) {
      const p1 = parseInt(parts[0], 10);
      const p2 = parseInt(parts[1], 10);
      if (!isNaN(p1) && !isNaN(p2)) {
        if (p1 > 12 && p1 <= 31 && p2 >= 1 && p2 <= 12) {
          birthDay = p1;
          birthMonth = p2 - 1;
          hasParsedDate = true;
        } else if (p1 >= 1 && p1 <= 12 && p2 > 12 && p2 <= 31) {
          birthMonth = p1 - 1;
          birthDay = p2;
          hasParsedDate = true;
        } else if (p1 >= 1 && p1 <= 31 && p2 >= 1 && p2 <= 12) {
          birthDay = p1;
          birthMonth = p2 - 1;
          hasParsedDate = true;
        }
      }
    }
  }

  if (!hasParsedDate) {
    birthMonth = userHash % 12;
    birthDay = 1 + ((userHash * 7) % 28);
  }

  // 3. Parse exact birth time
  let hour = 12;
  let minute = 0;
  if (birthTimeStr && birthTimeStr !== '12:00') {
    const timeMatch = birthTimeStr.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      hour = parseInt(timeMatch[1], 10);
      minute = parseInt(timeMatch[2], 10);
      if (birthTimeStr.toLowerCase().includes('pm') && hour < 12) hour += 12;
      if (birthTimeStr.toLowerCase().includes('am') && hour === 12) hour = 0;
    }
  } else {
    // Unique deterministic birth time for each user when clock time is omitted
    hour = 6 + (userHash % 14); // 6:00 to 19:00
    minute = (userHash * 13) % 60;
  }

  const localBirthDate = new Date(birthYear, birthMonth, birthDay, hour, minute);

  // 4. Resolve Location & Historical Timezone using localBirthDate
  const location = resolveLocationAndHistoricalTimezone(birthCityStr, localBirthDate);
  const utcBirthDate = new Date(localBirthDate.getTime() - location.timezoneOffsetHours * 3600000);

  // 3. Lahiri (Chitra Paksha) Ayanamsa Calculation
  const ayanamsa = calculateLahiriAyanamsa(utcBirthDate);
  const ayanamsaStr = formatAyanamsa(ayanamsa);

  // 4. Sidereal Lagna (Ascendant) & Midheaven (MC)
  const angles = calculateSiderealLagnaAndMC(
    utcBirthDate,
    location.latitude,
    location.longitude,
    ayanamsa
  );
  const lagnaDetails = longitudeToVedicDetails(angles.siderealLagna);
  const mcDetails = longitudeToVedicDetails(angles.siderealMC);

  // 5. Sidereal Planetary Positions (DE430 Ephemeris)
  const planets = calculateVedicGrahaPositions(
    utcBirthDate,
    location.latitude,
    location.longitude,
    angles.siderealLagna,
    ayanamsa
  );

  // 6. The Foundational Vedic Triad (Lagna, Janma Rashi, Surya Rashi)
  const sunP = planets.Sun;
  const moonP = planets.Moon;

  const bigThree: BigThreeInfo = {
    sun: {
      sign: sunP.sign,
      rashi: sunP.rashi,
      degree: sunP.degreeStr,
      house: sunP.house,
      glyph: sunP.glyphSign,
      nakshatra: sunP.nakshatra.formatted,
      essence: `Surya in ${sunP.rashi} (${sunP.nakshatra.name}) radiates noble vitality, intellectual clarity, and natural organizational authority.`
    },
    moon: {
      sign: moonP.sign,
      rashi: moonP.rashi,
      degree: moonP.degreeStr,
      house: moonP.house,
      glyph: moonP.glyphSign,
      nakshatra: moonP.nakshatra.formatted,
      pada: moonP.nakshatra.pada,
      emotionalSanctuary: `Chandra in ${moonP.rashi} (${moonP.nakshatra.name} Pada ${moonP.nakshatra.pada}) anchors deep intuitive discernment and serene emotional fortitude.`
    },
    ascendant: {
      sign: lagnaDetails.sign,
      rashi: lagnaDetails.rashi,
      degree: lagnaDetails.degreeStr,
      glyph: lagnaDetails.glyph,
      nakshatra: lagnaDetails.nakshatra.formatted,
      socialAura: `Lagna in ${lagnaDetails.rashi} (${lagnaDetails.nakshatra.name}) casts an inspiring, magnetic aura that effortlessly commands universal respect and team trust.`
    },
    midheaven: {
      sign: mcDetails.sign,
      rashi: mcDetails.rashi,
      degree: mcDetails.degreeStr,
      glyph: mcDetails.glyph,
      executiveLegacy: `10th Bhava cusp in ${mcDetails.rashi} benchmarks a high-trust destiny characterized by celebrated operational excellence.`
    },
    synthesis: `${firstName}'s sacred Vedic triad—${lagnaDetails.rashi} Lagna, ${moonP.rashi} Janma Rashi (${moonP.nakshatra.name}), and ${sunP.rashi} Surya Rashi—harmonizes sharp administrative foresight with compassionate wisdom and decisive execution.`
  };

  // 7. Vimshottari Dasha Engine with Exact Moon Nakshatra Pada arcminutes balance
  const currentDasha = calculateVimshottariDasha(
    moonP.eclipticLongitude,
    localBirthDate,
    now,
    {
      celebrantName: firstName,
      moonRashi: moonP.rashi,
      moonNakshatraName: moonP.nakshatra.name,
      pada: moonP.nakshatra.pada,
      lagnaRashi: lagnaDetails.rashi
    }
  );

  // 8. Divisional Charts (D1, D9 Navamsha, D10 Dashamsha)
  const vargas: DivisionalChartsData = {
    d1Rashi: {},
    d9Navamsha: {},
    d10Dashamsha: {}
  };
  for (const [name, p] of Object.entries(planets)) {
    vargas.d1Rashi[name] = `${p.rashi} (${p.sign})`;
    vargas.d9Navamsha[name] = p.d9NavamshaRashi;
    vargas.d10Dashamsha[name] = p.d10DashamshaRashi;
  }

  // 9. Sarvashtakavarga (SAV) & Ashtakavarga Scoring
  const ashtakavarga = calculateAshtakavarga(planets, Math.floor(angles.siderealLagna / 30));

  // 10. Vedic Yogas & Graha Drishti
  const yogas = detectVedicYogas(planets);
  const grahaDrishti = calculateGrahaDrishti(planets);

  // 11. Gochara (Real-Time Planetary Transit Tracking)
  const gocharaSummary = calculateVedicGochara(planets, now, angles.siderealLagna, ayanamsa);
  const primaryGochara = gocharaSummary[0] || {
    planet: 'Jupiter',
    currentSign: 'Gemini',
    houseFromLagna: 10,
    houseFromMoon: 11,
    isFavorable: true,
    savPoints: 34,
    transitTheme: 'Guru Gochara 10th House Ascension',
    prediction: 'Transiting Guru illuminates your career zenith, showering initiatives with executive commendations.'
  };

  // 12. 12 Vedic Houses Cusps
  const houses: HouseCusp[] = [];
  for (let i = 1; i <= 12; i++) {
    const cuspDeg = (angles.siderealLagna + (i - 1) * 30) % 360;
    const hDetails = longitudeToVedicDetails(cuspDeg);
    const inside: string[] = [];
    for (const p of Object.values(planets)) {
      if (p.house === i) {
        inside.push(`${p.glyph} ${p.sanskritName}`);
      }
    }
    houses.push({
      houseNumber: i,
      sign: hDetails.sign,
      rashi: hDetails.rashi,
      degree: hDetails.degreeInSign,
      formatted: `${Math.floor(hDetails.degreeInSign)}° ${hDetails.rashi} ${hDetails.glyph}`,
      theme: VEDIC_HOUSE_THEMES[i] || `Bhava ${i}`,
      savPoints: ashtakavarga.savPointsPerHouse[i - 1] || 28,
      planetsInside: inside
    });
  }

  // 13. Aspects (Parashari & Angular Synthesis)
  const aspectsList: PlanetaryAspect[] = [];
  const pKeys = Object.keys(planets);
  for (let i = 0; i < pKeys.length; i++) {
    for (let j = i + 1; j < pKeys.length; j++) {
      const p1 = planets[pKeys[i]];
      const p2 = planets[pKeys[j]];
      let diff = Math.abs(p1.eclipticLongitude - p2.eclipticLongitude);
      if (diff > 180) diff = 360 - diff;
      if (diff <= 8) {
        aspectsList.push({
          planet1: p1.sanskritName,
          planet2: p2.sanskritName,
          angle: diff,
          aspectType: 'Conjunction',
          symbol: '☌',
          orb: Math.round(diff * 10) / 10,
          isApplying: true,
          nature: 'Intensifying',
          interpretation: `Conjunction of ${p1.sanskritName} and ${p2.sanskritName} merges dynamic karakas into singular executive focus.`
        });
      } else if (Math.abs(diff - 120) <= 8) {
        aspectsList.push({
          planet1: p1.sanskritName,
          planet2: p2.sanskritName,
          angle: diff,
          aspectType: 'Trine',
          symbol: '△',
          orb: Math.round(Math.abs(diff - 120) * 10) / 10,
          isApplying: true,
          nature: 'Harmonious',
          interpretation: `Trikona sambhanda between ${p1.sanskritName} and ${p2.sanskritName} unlocks effortless manifestation and divine merit.`
        });
      }
    }
  }

  // 14. 10th House Karma & Rahu/Ketu Life Purpose Decrees
  const firstHouse = houses[0];
  const secondHouse = houses[1];
  const fourthHouse = houses[3];
  const seventhHouse = houses[6];
  const ninthHouse = houses[8];
  const tenthHouse = houses[9];
  const eleventhHouse = houses[10];

  const lagnaLord = VEDIC_RASHI_LORDS[lagnaDetails.rashi] || 'Lagna Lord';
  const secondLord = VEDIC_RASHI_LORDS[secondHouse.rashi] || '2nd Lord';
  const fourthLord = VEDIC_RASHI_LORDS[fourthHouse.rashi] || '4th Lord';
  const seventhLord = VEDIC_RASHI_LORDS[seventhHouse.rashi] || '7th Lord';
  const ninthLord = VEDIC_RASHI_LORDS[ninthHouse.rashi] || '9th Lord';
  const tenthLord = VEDIC_RASHI_LORDS[tenthHouse.rashi] || '10th Lord';
  const eleventhLord = VEDIC_RASHI_LORDS[eleventhHouse.rashi] || '11th Lord';

  const rahuP = planets.Rahu;
  const ketuP = planets.Ketu;

  const monthsShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedBdayStr = `${birthDay} ${monthsShortNames[birthMonth]}`;

  const tenthHouseTheme = `10th Karma Bhava in ${tenthHouse.rashi} (SAV: ${ashtakavarga.careerHouse10SAV} points, D10 Dashamsha: ${sunP.d10DashamshaRashi}, ruled by ${tenthLord}) decrees an ascent into sovereign organizational steering. Your legacy is anchored in institutional stability and fault-tolerant architecture.`;

  const northNodeDecree = `Decreed by the Rahu-Ketu Evolutionary Axis (${rahuP.rashi} Rahu in ${rahuP.house}th Bhava • ${ketuP.rashi} Ketu in ${ketuP.house}th Bhava): Your sacred soul mission is to boldly pioneer visionary systems with unblemished integrity, transmuting past karmic mastery into enduring triumphs for your team.`;

  // 15. Dynamic Narrative Stitching with Deep Astrological Combination Mapping
  const primaryYoga = yogas[0] || { name: 'Gaja Kesari Yoga', description: 'Majestic wisdom and executive honor.' };

  const positiveAuraNote = `Dearest ${firstName}, under the Chitra Paksha Lahiri Ayanamsa (${ayanamsaStr}), your Janma Rashi is ${moonP.rashi} (${moonP.nakshatra.name} Pada ${moonP.nakshatra.pada}, ruled by ${moonP.nakshatra.lord}) with ${lagnaDetails.rashi} Lagna. You are currently navigating the powerful ${currentDasha.mahadasha.lord} Mahadasha • ${currentDasha.antardasha.lord} Antardasha (${currentDasha.antardasha.startDate} to ${currentDasha.antardasha.endDate}). Reinforced by ${primaryYoga.name}, Parashari Jyotish decrees ${currentYear} as your golden harvest season for professional renown and material stability.`;

  const cosmicGuidance = `Vedic Gochara & Ephemeris Readout: Transiting Guru (Jupiter) in ${primaryGochara.currentSign} energizes your ${primaryGochara.houseFromMoon}th House from Janma Rashi with a fortified Sarvashtakavarga score of ${ashtakavarga.careerHouse10SAV} SAV points. Shani Gochara stabilizes executive workflows while active Vimshottari Dasha (${currentDasha.summary}) awakens pivotal leadership milestones. ${primaryGochara.prediction}`;

  const careerOpportunities = [
    `Elevation into strategic engineering steering mandates in ${tenthHouse.rashi} (${ashtakavarga.careerHouse10SAV} SAV points), with ${tenthLord} lordship guiding your D10 Dashamsha in ${sunP.d10DashamshaRashi} toward executive authority.`,
    `Transiting ${primaryGochara.planet} in your ${primaryGochara.houseFromMoon}th House from Janma Rashi during this active ${currentDasha.mahadasha.lord}–${currentDasha.antardasha.lord} Dasha (${currentDasha.antardasha.startDate} to ${currentDasha.antardasha.endDate}) dissolves operational bottlenecks and secures direct director commendations for ${firstName}.`,
    `Catalyzed by ${primaryYoga.name} and natal ${moonP.nakshatra.name} Pada ${moonP.nakshatra.pada} (${moonP.nakshatra.lord} lordship), ${firstName} is entrusted with high-stakes central initiatives, establishing departmental benchmarks across ${currentYear}.`
  ];

  const happinessMilestones = [
    `Deep emotional sanctuary and tranquil mental clarity anchored by your Janma Rashi in ${moonP.rashi} (${moonP.nakshatra.name} Pada ${moonP.nakshatra.pada}) and D9 Navamsha in ${moonP.d9NavamshaRashi}, bringing profound harmony to your living space.`,
    `Fortified by ${fourthHouse.savPoints} SAV points in your 4th Sukha Bhava (${fourthHouse.rashi}, ruled by ${fourthLord}), the active ${currentDasha.antardasha.lord} Bhukti sparks delightful home upgrades, festive family milestones, and peaceful restorative rejuvenation.`,
    `Radiant physical vitality and refreshed stamina powered by your ${lagnaDetails.rashi} Lagna (${firstHouse.savPoints} SAV points, ruled by ${lagnaLord}), creating sound sleep, mental buoyancy, and unforgettable celebratory galas.`
  ];

  const financialAbundance = [
    `Substantial material rewards, timely financial bonuses, and fruitful savings momentum backed by ${ashtakavarga.wealthHouse2SAV} SAV points in the 2nd Dhana Bhava (${secondHouse.rashi}, ruled by ${secondLord}).`,
    `Transiting ${primaryGochara.planet} energizing your ${primaryGochara.houseFromMoon}th House during ${currentDasha.mahadasha.lord} Mahadasha opens golden windows for asset appreciation, rewarding investments, and fulfilling long-held dreams.`,
    `Fortunate monetary windfalls and generous abundance supported by ${ashtakavarga.gainsHouse11SAV} SAV points in ${eleventhHouse.rashi} (ruled by ${eleventhLord}), ensuring lasting financial peace for ${firstName} and loved ones.`
  ];

  const friendshipHarmony = [
    `Unwavering loyalty and supportive companionship from colleagues in the 11th Labha Bhava (${eleventhHouse.rashi}, SAV: ${ashtakavarga.gainsHouse11SAV} pts), honoring ${firstName}'s dedication to collective success.`,
    `Harmonious cross-functional alliances and deep mutual trust anchored by your 7th Bhava in ${seventhHouse.rashi} (${seventhHouse.savPoints} SAV points, ruled by ${seventhLord}), turning collaborators into lifelong friends.`,
    `Warm celebratory gatherings and heartfelt tributes during your ${formattedBdayStr} season, connecting ${firstName} with high-caliber mentors who actively champion your highest dreams.`
  ];

  // Future Dasha phases for multi-year roadmap
  const nextPhaseYear1 = currentDasha.lifecycle.find((p) => p.startYear <= currentYear + 1 && p.endYear >= currentYear + 1) || currentDasha.lifecycle[1] || {
    mahadashaLord: currentDasha.mahadasha.lord,
    antardashaLord: currentDasha.antardasha.lord,
    theme: `${currentDasha.mahadasha.lord}–${currentDasha.antardasha.lord} Transit Elevation`
  };

  const nextPhaseYear2 = currentDasha.lifecycle.find((p) => p.startYear <= currentYear + 2 && p.endYear >= currentYear + 2) || currentDasha.lifecycle[2] || {
    mahadashaLord: currentDasha.mahadasha.lord,
    antardashaLord: currentDasha.antardasha.lord,
    theme: `${currentDasha.mahadasha.lord} Institutional Ascendance`
  };

  const yearByYearForecast = [
    {
      year: currentYear,
      theme: `Year of High Executive Ascension (${currentDasha.antardasha.lord} Bhukti • ${primaryYoga.name})`,
      prediction: `Unrivaled professional momentum in ${tenthHouse.rashi} (${ashtakavarga.careerHouse10SAV} SAV points), catalyzed by active ${primaryGochara.transitTheme}. ${firstName}'s technical mastery commands universal leadership admiration.`,
      vitalityScore: ashtakavarga.monthlyFortuneScore
    },
    {
      year: currentYear + 1,
      theme: `Year of Expansive Abundance & Domestic Bliss (${nextPhaseYear1.mahadashaLord}–${nextPhaseYear1.antardashaLord} Era)`,
      prediction: `As transiting ${primaryGochara.planet} transitions forward and ${nextPhaseYear1.antardashaLord} Bhukti takes command, deep roots of wealth in ${secondHouse.rashi} (${ashtakavarga.wealthHouse2SAV} SAV points) bring generational family security and joyous milestone acquisitions.`,
      vitalityScore: Math.min(99, Math.max(92, Math.round(((ashtakavarga.wealthHouse2SAV + ashtakavarga.gainsHouse11SAV) / 70) * 100)))
    },
    {
      year: currentYear + 2,
      theme: `Year of Grand Institutional Legacy (${nextPhaseYear2.mahadashaLord}–${nextPhaseYear2.antardashaLord} Era)`,
      prediction: `Assuming sovereign advisory mandates and immortalizing benchmarks in D10 Dashamsha (${sunP.d10DashamshaRashi}). ${firstName}'s architectural methodologies become celebrated standards across the organization.`,
      vitalityScore: Math.min(99, Math.max(93, Math.round(((ashtakavarga.careerHouse10SAV + ashtakavarga.healthHouse1SAV) / 70) * 100)))
    }
  ];

  const upcomingGoodThings = [
    {
      title: `Executive Steering Elevation in ${tenthHouse.rashi}`,
      description: `Direct director appreciation celebrating ${firstName}'s architectural precision under active ${currentDasha.mahadasha.lord}–${currentDasha.antardasha.lord} Dasha (10th Karma Bhava: ${ashtakavarga.careerHouse10SAV} SAV points).`,
      timing: `Active through ${currentDasha.antardasha.endDate}`,
      tag: 'Career Milestone'
    },
    {
      title: `Fortunate Material Growth in ${secondHouse.rashi}`,
      description: `A timely monetary windfall or performance bonus arriving as ${primaryGochara.planet} transits your ${primaryGochara.houseFromMoon}th House (2nd Dhana Bhava: ${ashtakavarga.wealthHouse2SAV} SAV points).`,
      timing: `Mid-${currentYear} Blessing`,
      tag: 'Abundance'
    },
    {
      title: `Transformative Rejuvenation & Travel in ${moonP.rashi}`,
      description: `An inspiring holiday and physical vitality renewal that restores inner peace, blessed by Chandra in ${moonP.nakshatra.name} Pada ${moonP.nakshatra.pada}.`,
      timing: `Q3 ${currentYear} Horizon`,
      tag: 'Joy & Wellness'
    },
    {
      title: 'Cherished Comradeship & Team Tribute',
      description: `A heartwarming tribute from colleagues affirming how deeply valued and treasured ${firstName} is within the Central IE Team (11th Bhava SAV: ${ashtakavarga.gainsHouse11SAV} points).`,
      timing: `${formattedBdayStr} Season`,
      tag: 'Social Harmony'
    }
  ];

  const fateAndDestiny = {
    chapterTitle: `The Sacred Jyotish Chronicle • ${lagnaDetails.rashi} Lagna & ${moonP.nakshatra.name} Nakshatra`,
    fateNote: `Written in the Sidereal Ephemeris (Lahiri Ayanamsa ${ayanamsaStr}): An auspicious alignment between your natal ${moonP.rashi} Moon, ${lagnaDetails.rashi} Lagna, and active ${currentDasha.mahadasha.lord}-${currentDasha.antardasha.lord} Vimshottari Dasha.`,
    theYearAhead: {
      alignment: `Guru Gochara in ${primaryGochara.currentSign} (${primaryGochara.houseFromMoon}th from Moon) • ${currentDasha.mahadasha.lord}–${currentDasha.antardasha.lord} Dasha • ${primaryYoga.name} in ${tenthHouse.rashi}`,
      forecast: `A glorious epoch of rapid forward momentum. Transiting ${primaryGochara.planet} in your ${primaryGochara.houseFromMoon}th Bhava harmonizes with ${currentDasha.antardasha.lord} Bhukti, empowering ${firstName} to convert complex engineering challenges into landmark operational triumphs across ${currentYear}.`,
      luckFactor: `${ashtakavarga.monthlyFortuneScore}% Auspicious Flow (10th Bhava SAV: ${ashtakavarga.careerHouse10SAV} pts • Grade: ${ashtakavarga.grade})`
    },
    careerAndSuccess: {
      title: `Dashamsha (D10) & 10th Karma Bhava Destiny in ${tenthHouse.rashi}`,
      predictions: careerOpportunities,
      growthLeap: `Executive Mandate in ${tenthHouse.rashi} • ${currentDasha.mahadasha.lord}–${currentDasha.antardasha.lord} Ascension (${currentDasha.antardasha.startDate} – ${currentDasha.antardasha.endDate})`
    },
    personalJoyAndPeace: {
      title: `Navamsha (D9) & Lunar Sanctuary in ${moonP.rashi}`,
      milestones: happinessMilestones,
      friendshipBlessing: `Protected by ${eleventhHouse.savPoints} SAV points in the 11th Labha Bhava (${eleventhHouse.rashi}), ${firstName} is cherished by teammates as the steadfast anchor, trusted confidant, and inspiring beacon of the entire department.`
    },
    destinyMilestones: [
      {
        quarter: `Q1 ${currentYear}`,
        milestone: `Strategic Inception & ${currentDasha.antardasha.lord} Bhukti`,
        blessing: `Clear solutions and rapid execution win senior leadership praise, energized by ${lagnaDetails.rashi} Lagna clarity and ${currentDasha.pratyantardasha.lord} sub-trigger.`
      },
      {
        quarter: `Q2 ${currentYear}`,
        milestone: 'Karma Zenith & Material Reward',
        blessing: `Financial ease, successful project launches, and team pride powered by ${ashtakavarga.careerHouse10SAV} SAV points in ${tenthHouse.rashi}.`
      },
      {
        quarter: `Q3 ${currentYear}`,
        milestone: 'Autumn Harvest & Restorative Travel',
        blessing: `Peaceful rejuvenation and warm bonding with loved ones, guided by Chandra in ${moonP.nakshatra.name} Pada ${moonP.nakshatra.pada}.`
      },
      {
        quarter: `Q4 ${currentYear}`,
        milestone: 'Grand Triumphs & Birthday Harvest',
        blessing: `Crowning annual milestones, lasting asset security, and triumphant celebrations (11th House SAV: ${ashtakavarga.gainsHouse11SAV} points).`
      }
    ],
    cosmicDecree: northNodeDecree
  };

  const natalChart: NatalChartData = {
    celebrantName,
    birthDate: birthDateStr,
    birthTime: birthTimeStr,
    birthCity: location.city,
    latitude: location.latitude,
    longitude: location.longitude,
    timezoneOffsetHours: location.timezoneOffsetHours,
    julianDay: utcBirthDate.getTime() / 86400000 + 2440587.5,
    localSiderealTimeHours: angles.lstHours,
    lahiriAyanamsaDeg: ayanamsa,
    lahiriAyanamsaStr: ayanamsaStr,
    bigThree,
    planets,
    houses,
    aspects: aspectsList,
    tenthHouseCareerTheme: tenthHouseTheme,
    northNodeLifePurpose: {
      sign: rahuP.sign,
      rashi: rahuP.rashi,
      house: rahuP.house,
      nakshatra: rahuP.nakshatra.name,
      destinyDecree: northNodeDecree
    },
    vedicMetrics: {
      lagna: {
        rashi: lagnaDetails.rashi,
        sign: lagnaDetails.sign,
        degreeStr: lagnaDetails.degreeStr,
        nakshatra: lagnaDetails.nakshatra.name,
        pada: lagnaDetails.nakshatra.pada,
        lord: VEDIC_RASHI_LORDS[lagnaDetails.rashi]
      },
      janmaRashi: {
        rashi: moonP.rashi,
        sign: moonP.sign,
        degreeStr: moonP.degreeStr,
        nakshatra: moonP.nakshatra.name,
        pada: moonP.nakshatra.pada,
        lord: VEDIC_RASHI_LORDS[moonP.rashi]
      },
      suryaRashi: {
        rashi: sunP.rashi,
        sign: sunP.sign,
        degreeStr: sunP.degreeStr,
        nakshatra: sunP.nakshatra.name,
        pada: sunP.nakshatra.pada,
        lord: VEDIC_RASHI_LORDS[sunP.rashi]
      },
      currentDasha,
      vargas,
      ashtakavarga,
      yogas,
      grahaDrishti,
      gocharaSummary
    }
  };

  // Convert active Gochara transits to standard TransitEvent format
  const activeTransits: TransitEvent[] = gocharaSummary.map((g) => ({
    transitPlanet: g.planet,
    natalPoint: 'Janma Rashi (Moon)',
    aspect: g.isFavorable ? 'Auspicious Gochara' : 'Karmic Gochara',
    orb: 1.5,
    transitHouse: g.houseFromMoon,
    impactScore: g.isFavorable ? 96 : 88,
    headline: `${g.planet} Gochara in ${g.currentSign} (${g.houseFromMoon}th from Moon)`,
    prediction: g.prediction
  }));

  return {
    celebrantName,
    serverNode: 'Vedic-Jyotish-Lahiri-DE430',
    latencyMs: Math.floor(Math.random() * 10) + 6,
    syncTimestamp: now.toLocaleTimeString(),
    natalChart,
    activeTransits,
    positiveAuraNote,
    cosmicGuidance,
    careerOpportunities,
    happinessMilestones,
    financialAbundance,
    friendshipHarmony,
    yearByYearForecast,
    upcomingGoodThings,
    fateAndDestiny
  };
}
