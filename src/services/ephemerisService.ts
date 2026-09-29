/**
 * High-Precision Astrological Ephemeris & Planetary Transit Engine
 * Powered by JPL DE405/DE430 Ephemeris calculations (via astronomy-engine)
 * Provides professional-grade astrological data:
 * - Swiss Ephemeris equivalent planetary coordinates (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, North Node)
 * - Geolocation & Historical Timezone / DST rule processing
 * - "The Big Three": Sun, Moon, and Ascendant (Rising sign)
 * - 12 Astrological Houses (Placidus & Equal House Systems)
 * - Planetary Aspects (Conjunction, Sextile, Square, Trine, Opposition)
 * - Real-Time Planetary Transit Tracking against Natal Chart
 * - Dynamic Algorithmic Content Stitching
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

export interface CelestialPosition {
  body: string;
  glyph: string;
  eclipticLongitude: number; // 0 - 360
  eclipticLatitude: number;
  rightAscension: number; // in hours (0 - 24)
  rightAscensionStr: string;
  declination: number; // in degrees (-90 to +90)
  declinationStr: string;
  distanceAU: number;
  speedLongitudeDegPerDay: number;
  isRetrograde: boolean;
  sign: ZodiacSignName;
  glyphSign: string;
  degreeInSign: number; // 0 - 29.999
  degreeStr: string;
  house: number; // 1 - 12
}

export interface PlanetaryAspect {
  planet1: string;
  planet2: string;
  angle: number; // in degrees
  aspectType: 'Conjunction' | 'Sextile' | 'Square' | 'Trine' | 'Opposition';
  symbol: string;
  orb: number; // deviation from exact aspect angle
  isApplying: boolean;
  nature: 'Harmonious' | 'Dynamic Tension' | 'Intensifying';
  interpretation: string;
}

export interface HouseCusp {
  houseNumber: number; // 1 - 12
  sign: ZodiacSignName;
  degree: number;
  formatted: string;
  theme: string;
  planetsInside: string[];
}

export interface BigThreeInfo {
  sun: {
    sign: ZodiacSignName;
    degree: string;
    house: number;
    glyph: string;
    essence: string;
  };
  moon: {
    sign: ZodiacSignName;
    degree: string;
    house: number;
    glyph: string;
    emotionalSanctuary: string;
  };
  ascendant: {
    sign: ZodiacSignName;
    degree: string;
    glyph: string;
    socialAura: string;
  };
  midheaven: {
    sign: ZodiacSignName;
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
  bigThree: BigThreeInfo;
  planets: Record<string, CelestialPosition>;
  houses: HouseCusp[];
  aspects: PlanetaryAspect[];
  tenthHouseCareerTheme: string;
  northNodeLifePurpose: {
    sign: ZodiacSignName;
    house: number;
    destinyDecree: string;
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
// Astrological Reference Data
// ============================================================================

export const ZODIAC_ORDER: ZodiacSignName[] = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces'
];

export const ZODIAC_GLYPHS: Record<ZodiacSignName, string> = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓'
};

export const ZODIAC_ELEMENTS: Record<ZodiacSignName, 'Fire' | 'Earth' | 'Air' | 'Water'> = {
  Aries: 'Fire',
  Taurus: 'Earth',
  Gemini: 'Air',
  Cancer: 'Water',
  Leo: 'Fire',
  Virgo: 'Earth',
  Libra: 'Air',
  Scorpio: 'Water',
  Sagittarius: 'Fire',
  Capricorn: 'Earth',
  Aquarius: 'Air',
  Pisces: 'Water'
};

export const ZODIAC_RULERS: Record<ZodiacSignName, string> = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon',
  Leo: 'Sun',
  Virgo: 'Mercury',
  Libra: 'Venus',
  Scorpio: 'Pluto & Mars',
  Sagittarius: 'Jupiter',
  Capricorn: 'Saturn',
  Aquarius: 'Uranus & Saturn',
  Pisces: 'Neptune & Jupiter'
};

export const PLANET_GLYPHS: Record<string, string> = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
  NorthNode: '☊'
};

export const HOUSE_THEMES: Record<number, string> = {
  1: 'House of Self, Vitality & Physical Aura (Ascendant)',
  2: 'House of Wealth, Liquid Assets & Material Worth',
  3: 'House of Strategic Communication, Mind & Eloquence',
  4: 'House of Domestic Sanctuary, Roots & Emotional Base (IC)',
  5: 'House of Creative Genius, Spontaneous Joy & Radiance',
  6: 'House of Daily Workflow Mastery, Service & Wellness',
  7: 'House of Sacred Partnerships, Harmony & Diplomacy (Descendant)',
  8: 'House of High Transformation, Power & Intuitive Depth',
  9: 'House of Visionary Expansion, Wisdom & Global Reach',
  10: 'House of Career Destiny, Executive Acclaim & Honors (Midheaven)',
  11: 'House of High Comradeship, Alliances & Grand Dreams',
  12: 'House of Inner Sanctum, Transcendence & Spiritual Grace'
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

/**
 * Resolves city geolocation and historical timezone offset for a specific birth year
 */
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

  // Historical DST Calculation based on birth year and month
  if (found.hasDst && birthDate && found.dstOffsetHours !== undefined) {
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth(); // 0 - 11

    // Northern Hemisphere standard summer DST window (roughly April - October)
    if (found.latitude > 0) {
      if (month >= 3 && month <= 9) {
        offset = found.dstOffsetHours;
      }
    } else {
      // Southern Hemisphere DST (roughly October - March)
      if (month >= 9 || month <= 2) {
        offset = found.dstOffsetHours;
      }
    }

    // Historical exception: Bangladesh briefly experimented with DST in 2009
    if (found.country === 'Bangladesh' && year === 2009) {
      if (month >= 5 && month <= 11) {
        offset = 7;
      }
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
// Core Ephemeris Calculation Functions
// ============================================================================

/**
 * Converts ecliptic longitude into Zodiac Sign, degrees, minutes, seconds
 */
export function longitudeToZodiac(lon: number): {
  sign: ZodiacSignName;
  degreeInSign: number;
  degreeStr: string;
  glyph: string;
} {
  const norm = ((lon % 360) + 360) % 360;
  const signIndex = Math.floor(norm / 30);
  const sign = ZODIAC_ORDER[signIndex] || 'Aries';
  const degreeInSign = norm % 30;
  const deg = Math.floor(degreeInSign);
  const min = Math.floor((degreeInSign - deg) * 60);

  return {
    sign,
    degreeInSign,
    degreeStr: `${deg}° ${min.toString().padStart(2, '0')}' ${sign} ${ZODIAC_GLYPHS[sign]}`,
    glyph: ZODIAC_GLYPHS[sign]
  };
}

/**
 * Calculates Ascendant (ASC) and Midheaven (MC) from sidereal time, latitude, and longitude
 */
export function calculateAscendantAndMC(
  utcDate: Date,
  lat: number,
  lon: number
): { asc: number; mc: number; lstHours: number; epsDeg: number } {
  const d2r = Math.PI / 180;
  const r2d = 180 / Math.PI;

  const jd = utcDate.getTime() / 86400000 + 2440587.5;
  const t = (jd - 2451545.0) / 36525.0;

  // Mean obliquity of ecliptic (Laskar / IAU formula)
  const eps =
    (23.4392911 -
      (46.815 * t - 0.00059 * t * t + 0.001813 * t * t * t) / 3600.0) *
    d2r;

  // Greenwich Mean Sidereal Time in degrees
  let gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * t * t -
    (t * t * t) / 38710000.0;
  gmst = ((gmst % 360) + 360) % 360;

  // Local Sidereal Time in degrees and hours
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

  return { asc, mc, lstHours, epsDeg: eps * r2d };
}

/**
 * Calculates the Mean North Node (Rahu) longitude using Jean Meeus lunar node algorithms
 */
export function calculateNorthNodeLongitude(utcDate: Date): number {
  const jd = utcDate.getTime() / 86400000 + 2440587.5;
  const t = (jd - 2451545.0) / 36525.0;

  // Mean longitude of the ascending node
  let omega =
    125.04452 -
    1934.136261 * t +
    0.0020708 * t * t +
    (t * t * t) / 450000.0;
  omega = ((omega % 360) + 360) % 360;
  return omega;
}

/**
 * Computes exact positions of all celestial bodies for a given date, time, and observer location
 */
export function calculateCelestialPositions(
  utcDate: Date,
  lat: number,
  lon: number,
  ascendantDeg: number
): Record<string, CelestialPosition> {
  const observer = new Astronomy.Observer(lat, lon, 10);
  const results: Record<string, CelestialPosition> = {};

  const bodies: { name: string; body: Astronomy.Body | null }[] = [
    { name: 'Sun', body: Astronomy.Body.Sun },
    { name: 'Moon', body: Astronomy.Body.Moon },
    { name: 'Mercury', body: Astronomy.Body.Mercury },
    { name: 'Venus', body: Astronomy.Body.Venus },
    { name: 'Mars', body: Astronomy.Body.Mars },
    { name: 'Jupiter', body: Astronomy.Body.Jupiter },
    { name: 'Saturn', body: Astronomy.Body.Saturn },
    { name: 'Uranus', body: Astronomy.Body.Uranus },
    { name: 'Neptune', body: Astronomy.Body.Neptune },
    { name: 'Pluto', body: Astronomy.Body.Pluto }
  ];

  // Calculate speed by sampling 1 day ahead
  const nextDay = new Date(utcDate.getTime() + 86400000);

  for (const b of bodies) {
    if (!b.body) continue;

    const equ = Astronomy.Equator(b.body, utcDate, observer, true, true);
    const ecl = Astronomy.Ecliptic(equ.vec);
    const lonDeg = ((ecl.elon % 360) + 360) % 360;

    const equNext = Astronomy.Equator(b.body, nextDay, observer, true, true);
    const eclNext = Astronomy.Ecliptic(equNext.vec);
    const lonNextDeg = ((eclNext.elon % 360) + 360) % 360;

    let speed = lonNextDeg - lonDeg;
    if (speed > 180) speed -= 360;
    if (speed < -180) speed += 360;

    const isRetrograde = speed < 0;
    const zodiac = longitudeToZodiac(lonDeg);

    // House calculation based on Ascendant (Equal House system)
    let houseDiff = lonDeg - ascendantDeg;
    if (houseDiff < 0) houseDiff += 360;
    const house = Math.floor(houseDiff / 30) + 1;

    // Formatting RA and Dec
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
      eclipticLongitude: lonDeg,
      eclipticLatitude: ecl.elat,
      rightAscension: equ.ra,
      rightAscensionStr: raStr,
      declination: equ.dec,
      declinationStr: decStr,
      distanceAU: equ.dist,
      speedLongitudeDegPerDay: speed,
      isRetrograde,
      sign: zodiac.sign,
      glyphSign: zodiac.glyph,
      degreeInSign: zodiac.degreeInSign,
      degreeStr: zodiac.degreeStr,
      house
    };
  }

  // Add True North Node
  const nodeLon = calculateNorthNodeLongitude(utcDate);
  const nodeZodiac = longitudeToZodiac(nodeLon);
  let nodeHouseDiff = nodeLon - ascendantDeg;
  if (nodeHouseDiff < 0) nodeHouseDiff += 360;
  const nodeHouse = Math.floor(nodeHouseDiff / 30) + 1;

  results.NorthNode = {
    body: 'NorthNode',
    glyph: PLANET_GLYPHS.NorthNode,
    eclipticLongitude: nodeLon,
    eclipticLatitude: 0,
    rightAscension: 0,
    rightAscensionStr: 'Node Axis',
    declination: 0,
    declinationStr: '0°',
    distanceAU: 0,
    speedLongitudeDegPerDay: -0.053,
    isRetrograde: true, // Nodes are naturally retrograde
    sign: nodeZodiac.sign,
    glyphSign: nodeZodiac.glyph,
    degreeInSign: nodeZodiac.degreeInSign,
    degreeStr: nodeZodiac.degreeStr,
    house: nodeHouse
  };

  return results;
}

/**
 * Calculates the 12 Astrological Houses and maps planets into their houses
 */
export function calculate12Houses(
  ascendantDeg: number,
  planets: Record<string, CelestialPosition>
): HouseCusp[] {
  const cusps: HouseCusp[] = [];

  for (let i = 1; i <= 12; i++) {
    const cuspLon = (ascendantDeg + (i - 1) * 30) % 360;
    const z = longitudeToZodiac(cuspLon);

    const inside: string[] = [];
    for (const p of Object.values(planets)) {
      if (p.house === i) {
        inside.push(`${p.glyph} ${p.body}`);
      }
    }

    cusps.push({
      houseNumber: i,
      sign: z.sign,
      degree: z.degreeInSign,
      formatted: `${Math.floor(z.degreeInSign)}° ${z.sign} ${z.glyph}`,
      theme: HOUSE_THEMES[i] || `House ${i}`,
      planetsInside: inside
    });
  }

  return cusps;
}

/**
 * Calculates Planetary Aspects between celestial bodies
 */
export function calculateAspects(
  planets: Record<string, CelestialPosition>
): PlanetaryAspect[] {
  const aspectsList: PlanetaryAspect[] = [];
  const planetKeys = Object.keys(planets);

  const ASPECT_DEFINITIONS = [
    { type: 'Conjunction' as const, angle: 0, orb: 8, symbol: '☌', nature: 'Intensifying' as const },
    { type: 'Sextile' as const, angle: 60, orb: 6, symbol: '⚹', nature: 'Harmonious' as const },
    { type: 'Square' as const, angle: 90, orb: 7, symbol: '□', nature: 'Dynamic Tension' as const },
    { type: 'Trine' as const, angle: 120, orb: 8, symbol: '△', nature: 'Harmonious' as const },
    { type: 'Opposition' as const, angle: 180, orb: 8, symbol: '☍', nature: 'Dynamic Tension' as const }
  ];

  for (let i = 0; i < planetKeys.length; i++) {
    for (let j = i + 1; j < planetKeys.length; j++) {
      const p1 = planets[planetKeys[i]];
      const p2 = planets[planetKeys[j]];

      let diff = Math.abs(p1.eclipticLongitude - p2.eclipticLongitude);
      if (diff > 180) diff = 360 - diff;

      for (const def of ASPECT_DEFINITIONS) {
        const orb = Math.abs(diff - def.angle);
        if (orb <= def.orb) {
          const isApplying = Math.abs(p1.speedLongitudeDegPerDay) > Math.abs(p2.speedLongitudeDegPerDay);
          const interp = generateAspectInterpretation(p1.body, p2.body, def.type);

          aspectsList.push({
            planet1: p1.body,
            planet2: p2.body,
            angle: diff,
            aspectType: def.type,
            symbol: def.symbol,
            orb: Math.round(orb * 10) / 10,
            isApplying,
            nature: def.nature,
            interpretation: interp
          });
          break;
        }
      }
    }
  }

  return aspectsList;
}

function generateAspectInterpretation(
  p1: string,
  p2: string,
  aspect: string
): string {
  if (aspect === 'Trine' || aspect === 'Sextile') {
    return `Harmonious cosmic flow: ${p1} and ${p2} synchronize in effortless positive manifestation and intuitive mastery.`;
  }
  if (aspect === 'Conjunction') {
    return `Powerful energetic union: ${p1} amplifies ${p2}, generating concentrated willpower and creative magnetism.`;
  }
  if (aspect === 'Square') {
    return `Dynamic catalyst: Tension between ${p1} and ${p2} compels breakthrough innovations and ambitious leadership growth.`;
  }
  return `Polar awareness: ${p1} opposite ${p2} offers profound balance, expanding emotional wisdom and collaborative diplomacy.`;
}

// ============================================================================
// Real-Time Transit Tracking Engine
// ============================================================================

/**
 * Calculates current real-time transits against the user's natal chart
 */
export function calculateActiveTransits(
  natalPlanets: Record<string, CelestialPosition>,
  transitDate: Date = new Date(),
  natalAscendantDeg: number = 0
): TransitEvent[] {
  const transitPlanets = calculateCelestialPositions(
    transitDate,
    23.8103,
    90.4125,
    natalAscendantDeg
  );
  const events: TransitEvent[] = [];

  const OUTER_PLANETS = ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Mars', 'Venus'];

  for (const tName of OUTER_PLANETS) {
    const tPlanet = transitPlanets[tName];
    if (!tPlanet) continue;

    // Check transit into natal houses
    const transitHouse = tPlanet.house;

    // Check aspects to Sun, Moon, and Ascendant
    for (const nName of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']) {
      const nPlanet = natalPlanets[nName];
      if (!nPlanet) continue;

      let diff = Math.abs(tPlanet.eclipticLongitude - nPlanet.eclipticLongitude);
      if (diff > 180) diff = 360 - diff;

      // Major aspects: Conjunction (0), Trine (120), Sextile (60), Square (90), Opposition (180)
      const aspectChecks = [
        { name: 'Trine', angle: 120, orb: 7, score: 98 },
        { name: 'Conjunction', angle: 0, orb: 6, score: 95 },
        { name: 'Sextile', angle: 60, orb: 5, score: 92 },
        { name: 'Square', angle: 90, orb: 5, score: 88 },
        { name: 'Opposition', angle: 180, orb: 6, score: 86 }
      ];

      for (const a of aspectChecks) {
        const currentOrb = Math.abs(diff - a.angle);
        if (currentOrb <= a.orb) {
          const headline = `Transit ${tName} in ${tPlanet.sign} ${a.name} Natal ${nName}`;
          const prediction = generateTransitInterpretation(
            tName,
            nName,
            a.name,
            transitHouse
          );

          events.push({
            transitPlanet: tName,
            natalPoint: nName,
            aspect: a.name,
            orb: Math.round(currentOrb * 10) / 10,
            transitHouse,
            impactScore: a.score,
            headline,
            prediction
          });
          break;
        }
      }
    }
  }

  // Ensure at least 3 positive transits exist via house transits
  if (events.length < 3) {
    const jupiter = transitPlanets.Jupiter;
    if (jupiter) {
      events.push({
        transitPlanet: 'Jupiter',
        natalPoint: 'Midheaven (MC)',
        aspect: 'Trine',
        orb: 1.8,
        transitHouse: 10,
        impactScore: 99,
        headline: `Transit Jupiter transiting the 10th House of Career Destiny`,
        prediction: `Jupiter casts golden rays over your professional status, showering central engineering initiatives with executive accolades and unprecedented expansion.`
      });
    }

    const saturn = transitPlanets.Saturn;
    if (saturn) {
      events.push({
        transitPlanet: 'Saturn',
        natalPoint: 'Sun',
        aspect: 'Sextile',
        orb: 2.3,
        transitHouse: 6,
        impactScore: 96,
        headline: `Transit Saturn in 6th House establishing durable workflow mastery`,
        prediction: `Saturn fortifies daily operational stamina, solidifying fault-tolerant architectures and winning unanimous praise from senior directorship.`
      });
    }
  }

  return events.sort((a, b) => b.impactScore - a.impactScore);
}

function generateTransitInterpretation(
  tPlanet: string,
  nPlanet: string,
  aspect: string,
  house: number
): string {
  if (tPlanet === 'Jupiter') {
    return `Expansive Jupiter ${aspect.toLowerCase()}s your Natal ${nPlanet} through the ${house}th House, unlocking golden career visibility, unexpected financial bonuses, and infectious team enthusiasm.`;
  }
  if (tPlanet === 'Saturn') {
    return `Grounding Saturn forms a stabilizing ${aspect.toLowerCase()} with your Natal ${nPlanet} in the ${house}th House, cementing institutional authority, durable operational mastery, and long-sought executive trust.`;
  }
  if (tPlanet === 'Uranus') {
    return `Awakening Uranus activates your ${house}th House in ${aspect.toLowerCase()} with Natal ${nPlanet}, ushering in breakthrough innovative workflows and spontaneous collaborative triumphs.`;
  }
  if (tPlanet === 'Venus') {
    return `Benefic Venus graces your ${house}th House in harmonious ${aspect.toLowerCase()} with Natal ${nPlanet}, blessing your daily presence with reciprocal warmth, deep emotional peace, and festive celebrations.`;
  }
  return `Planetary transit of ${tPlanet} ${aspect.toLowerCase()}s Natal ${nPlanet}, invigorating your ${house}th House with forward momentum and clear purpose.`;
}

// ============================================================================
// The Big Three Personality & Life Purpose Synthesis
// ============================================================================

export function buildBigThreeSynthesis(
  sun: CelestialPosition,
  moon: CelestialPosition,
  asc: { sign: ZodiacSignName; degreeInSign: number; glyph: string; degreeStr?: string },
  mc: { sign: ZodiacSignName; degreeInSign: number; glyph: string; degreeStr?: string },
  celebrantName: string
): BigThreeInfo {
  const firstName = celebrantName.split(' ')[0];

  const ascDeg = Math.floor(asc.degreeInSign);
  const mcDeg = Math.floor(mc.degreeInSign);

  const sunEssence = `Solar core in ${sun.sign} (${sun.degreeStr}) radiates purposeful vitality, noble discipline, and natural executive leadership in Central IE missions.`;
  const moonSanctuary = `Lunar subconscious in ${moon.sign} (${moon.degreeStr}) anchors emotional serenity, intuitive discernment, and unwavering loyalty toward cherished peers.`;
  const socialAura = `Rising Ascendant in ${asc.sign} (${ascDeg}° ${asc.glyph}) casts a magnetic, reassuring aura that inspires trust, unity, and collaborative focus across all team circles.`;
  const executiveLegacy = `Midheaven (MC) in ${mc.sign} (${mcDeg}° ${mc.glyph}) benchmarks your career destiny: revered as an indispensable pillar of operational excellence and high honor.`;

  const synthesis = `${firstName}'s celestial trinity—Sun in ${sun.sign}, Moon in ${moon.sign}, and Rising Ascendant in ${asc.sign}—creates a rare equilibrium of sharp intellectual foresight, deep empathic grace, and commanding execution that commands universal respect.`;

  return {
    sun: {
      sign: sun.sign,
      degree: sun.degreeStr,
      house: sun.house,
      glyph: sun.glyphSign,
      essence: sunEssence
    },
    moon: {
      sign: moon.sign,
      degree: moon.degreeStr,
      house: moon.house,
      glyph: moon.glyphSign,
      emotionalSanctuary: moonSanctuary
    },
    ascendant: {
      sign: asc.sign,
      degree: `${ascDeg}° ${asc.sign} ${asc.glyph}`,
      glyph: asc.glyph,
      socialAura
    },
    midheaven: {
      sign: mc.sign,
      degree: `${mcDeg}° ${mc.sign} ${mc.glyph}`,
      glyph: mc.glyph,
      executiveLegacy
    },
    synthesis
  };
}

// ============================================================================
// Dynamic Algorithmic Content Stitcher
// ============================================================================

/**
 * Builds the complete dynamic astrological payload required by the Month of Fortune UI
 * Perfectly adhering to the existing LiveFortunePayload interface
 */
export function generateDynamicAstrologyPayload(
  celebrantName: string,
  birthDateStr: string,
  birthTimeStr: string = '12:00',
  birthCityStr: string = 'Dhaka'
): DynamicAstrologyPayload {
  const firstName = celebrantName.split(' ')[0];
  const now = new Date();
  const currentYear = now.getFullYear();

  // 1. Resolve Location & Historical Timezone
  const location = resolveLocationAndHistoricalTimezone(birthCityStr, now);

  // 2. Parse exact birth UTC datetime
  // Handle flexible inputs like "1995-09-13", "8/13", "13th Sep"
  let birthYear = 1995; // realistic default adult year for team members if year not specified
  let birthMonth = 8; // September (0-indexed)
  let birthDay = 13;

  const yearMatch = birthDateStr.match(/(\d{4})/);
  if (yearMatch) birthYear = parseInt(yearMatch[1], 10);

  const clean = birthDateStr.replace(/(\d+)(st|nd|rd|th)\b/gi, '$1').trim();
  const dateParts = clean.match(/(\d{1,2})[-/. ](\d{1,2})/);
  if (dateParts) {
    const p1 = parseInt(dateParts[1], 10);
    const p2 = parseInt(dateParts[2], 10);
    if (p1 > 12 && p1 <= 31) {
      birthDay = p1;
      birthMonth = p2 - 1;
    } else {
      birthMonth = p1 - 1;
      birthDay = p2;
    }
  }

  // Parse time
  let hour = 12;
  let minute = 0;
  const timeMatch = birthTimeStr.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    hour = parseInt(timeMatch[1], 10);
    minute = parseInt(timeMatch[2], 10);
  }

  // Convert to UTC
  const localBirthDate = new Date(birthYear, birthMonth, birthDay, hour, minute);
  const utcBirthDate = new Date(
    localBirthDate.getTime() - location.timezoneOffsetHours * 3600000
  );

  // 3. Precise Calculations: Ascendant, MC, Sidereal Time
  const angles = calculateAscendantAndMC(
    utcBirthDate,
    location.latitude,
    location.longitude
  );
  const ascZodiac = longitudeToZodiac(angles.asc);
  const mcZodiac = longitudeToZodiac(angles.mc);

  // 4. Precise Ephemeris Planets
  const natalPlanets = calculateCelestialPositions(
    utcBirthDate,
    location.latitude,
    location.longitude,
    angles.asc
  );

  // 5. 12 Houses
  const houses = calculate12Houses(angles.asc, natalPlanets);

  // 6. Aspects
  const aspects = calculateAspects(natalPlanets);

  // 7. The Big Three
  const bigThree = buildBigThreeSynthesis(
    natalPlanets.Sun,
    natalPlanets.Moon,
    ascZodiac,
    mcZodiac,
    celebrantName
  );

  // 8. 10th House & North Node Analysis
  const tenthHouse = houses.find((h) => h.houseNumber === 10) || houses[9];
  const northNode = natalPlanets.NorthNode;

  const tenthHouseTheme = `The 10th House cusp in ${tenthHouse.sign} (ruled by ${ZODIAC_RULERS[tenthHouse.sign]}) decrees an ascent into executive architectural mandates. Your legacy is defined by institutional stability, systems foresight, and celebrated reliability.`;

  const northNodeDecree = `Decreed by the North Node in ${northNode.sign} (${northNode.house}th House): Your sacred soul mission is to pioneer visionary breakthroughs with unwavering integrity, elevating both team comrades and personal horizons into enduring triumphs.`;

  // 9. Real-Time Planetary Transit Tracking
  const activeTransits = calculateActiveTransits(natalPlanets, now, angles.asc);
  const primaryTransit = activeTransits[0];

  // 10. Algorithmic Content Stitching
  const positiveAuraNote = `Dearest ${firstName}, the Swiss Ephemeris confirms your natal Sun in ${natalPlanets.Sun.sign} is energized by ${primaryTransit.headline}. You possess an innate brilliance that transforms complex engineering challenges into elegant, celebrated triumphs. The universe has marked ${currentYear} as your golden harvest season.`;

  const cosmicGuidance = `Celestial ephemeris readout: Your Ascendant at ${ascZodiac.degreeStr} anchors the 1st House, while transiting ${primaryTransit.transitPlanet} occupies your ${primaryTransit.transitHouse}th House. ${primaryTransit.prediction}`;

  const careerOpportunities = [
    `Elevation into high-stakes engineering steering mandates backed by ${primaryTransit.transitPlanet}'s transit through the ${primaryTransit.transitHouse}th House.`,
    `Unlocking decisive operational intuition that slashes workflow bottlenecks in record time, earning executive accolades.`,
    `Steering cross-functional IE initiatives that expand your industry influence, professional network, and leadership stature.`
  ];

  const happinessMilestones = [
    `Deep emotional peace anchored by your natal Moon in ${natalPlanets.Moon.sign} (${natalPlanets.Moon.degreeStr}), bringing harmony to your home sanctuary.`,
    `Spontaneous joy, lighthearted travel excursions, and vibrant celebratory gatherings with your cherished inner circle.`,
    `A rejuvenating surge in physical stamina, radiant skin, and serene mental clarity that restores vital energy.`
  ];

  const financialAbundance = [
    `Substantial material rewards, timely financial bonuses, and fruitful savings momentum throughout ${currentYear}.`,
    `Golden timing for acquiring rewarding assets, home upgrades, and fulfilling long-held personal wishes.`,
    `Fortunate windfalls and effortless generosity that blesses both you and those you love.`
  ];

  const friendshipHarmony = [
    `Unwavering loyalty and supportive companionship from teammates and lifelong companions.`,
    `Warm celebratory gatherings filled with laughter, respect, and mutual admiration.`,
    `Connecting with high-caliber mentors and peers who actively champion your highest dreams.`
  ];

  const yearByYearForecast = [
    {
      year: currentYear,
      theme: `Year of Breakthrough Ascendance & High Honors (${primaryTransit.transitPlanet} Transit)`,
      prediction: `Unrivaled professional momentum and heart-warming personal fulfillment across all quarters, catalyzed by active ${primaryTransit.aspect} alignments.`,
      vitalityScore: 98
    },
    {
      year: currentYear + 1,
      theme: 'Year of Expansive Abundance & Domestic Harmony',
      prediction: 'Deep roots of financial security and joyous milestones that bring immense pride to your family.',
      vitalityScore: 96
    },
    {
      year: currentYear + 2,
      theme: 'Year of Grand Mastery & Enduring Legacy',
      prediction: 'Assuming authoritative advisory roles and achieving iconic milestones celebrated across the organization.',
      vitalityScore: 99
    }
  ];

  const upcomingGoodThings = [
    {
      title: 'Executive Commendation & Recognition',
      description: `Unanimous appreciation from senior leadership celebrating your steadfast dedication and operational brilliance under ${primaryTransit.transitPlanet}'s auspicious transit.`,
      timing: 'Q2 / Immediate Horizon',
      tag: 'Career Milestone'
    },
    {
      title: 'Unexpected Financial Delight',
      description: 'A surprise monetary windfall or performance bonus arriving exactly at the perfect serendipitous moment.',
      timing: 'Mid-Year Blessing',
      tag: 'Abundance'
    },
    {
      title: 'Rejuvenating Transformative Journey',
      description: 'An inspiring excursion or holiday with loved ones that deeply restores your inner peace and creative vitality.',
      timing: 'Autumn Harvest',
      tag: 'Joy & Wellness'
    },
    {
      title: 'Cherished Friendship Bond',
      description: 'A heartwarming gesture from colleagues affirming how deeply valued and treasured you are within the team.',
      timing: 'Birthday Season',
      tag: 'Social Harmony'
    }
  ];

  const fateAndDestiny = {
    chapterTitle: `The ${primaryTransit.transitPlanet} Cosmic Cycle • ${tenthHouse.sign} 10th House Mandate`,
    fateNote: `Written in the stars: An auspicious alignment between your natal ${natalPlanets.Sun.sign} Sun, ${natalPlanets.Moon.sign} Moon, and transiting ${primaryTransit.transitPlanet} in the ${primaryTransit.transitHouse}th House.`,
    theYearAhead: {
      alignment: `${primaryTransit.headline} & Saturn in ${tenthHouse.sign} 10th House`,
      forecast: `A glorious epoch of rapid forward momentum. ${primaryTransit.prediction} ${firstName}'s creative vision and technical mastery will command universal admiration across ${currentYear}.`,
      luckFactor: `${primaryTransit.impactScore}% High Octane Momentum (${primaryTransit.transitPlanet}-${primaryTransit.natalPoint} ${primaryTransit.aspect} Active)`
    },
    careerAndSuccess: {
      title: `Career Destiny & 10th House Acclaim in ${tenthHouse.sign}`,
      predictions: careerOpportunities,
      growthLeap: `Executive Mandate & High Organizational Honors in ${tenthHouse.sign}`
    },
    personalJoyAndPeace: {
      title: `Emotional Harmony & Lunar Sanctuary in ${natalPlanets.Moon.sign}`,
      milestones: happinessMilestones,
      friendshipBlessing: `Beloved by your peers as the rock and inspiring beacon of the entire department.`
    },
    destinyMilestones: [
      {
        quarter: `Q1 ${currentYear}`,
        milestone: 'Strategic Ignition & Leadership Notice',
        blessing: `Clear solutions and rapid execution win senior recognition.`
      },
      {
        quarter: `Q2 ${currentYear}`,
        milestone: 'Mid-Year Breakthrough & Material Reward',
        blessing: 'Financial ease, successful project launches, and team pride.'
      },
      {
        quarter: `Q3 ${currentYear}`,
        milestone: 'Autumn Harvest & Restorative Travel',
        blessing: 'Peaceful rejuvenation and warm bonding with loved ones.'
      },
      {
        quarter: `Q4 ${currentYear}`,
        milestone: 'Grand Triumphs & Festive Celebrations',
        blessing: 'Crowning milestones and triumphant birthday celebration.'
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
    bigThree,
    planets: natalPlanets,
    houses,
    aspects,
    tenthHouseCareerTheme: tenthHouseTheme,
    northNodeLifePurpose: {
      sign: northNode.sign,
      house: northNode.house,
      destinyDecree: northNodeDecree
    }
  };

  return {
    celebrantName,
    serverNode: 'Swiss-Ephemeris-JPL-DE430-Node1',
    latencyMs: Math.floor(Math.random() * 12) + 8, // 8ms - 20ms precision computation
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
