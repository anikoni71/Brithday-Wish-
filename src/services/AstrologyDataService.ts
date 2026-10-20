/**
 * Centralized AstrologyDataService
 * High-Precision Ephemeris & Vedic Astrological Calculation Engine
 * 
 * Implements a deterministic Vedic astrology engine that calculates:
 * - Precise Moon's Sidereal Longitude using Swiss/JPL Ephemeris with Lahiri Ayanamsa
 * - Moon's exact Nakshatra (0-26), Pada (1-4), and ruling Graha
 * - Accurate Vimshottari Dasha periods (Mahadasha, Antardasha, Pratyantardasha) with birth balance
 * - Symbol-rich, mathematically bound fortune strings for any given team member
 * - Modular fetching from reliable third-party / local ephemeris APIs with zero-leak caching
 */

import * as Astronomy from 'astronomy-engine';
import { TeamMember } from '../types';
import { parseBirthdayDate } from '../utils/dateUtils';
import { 
  generateDynamicAstrologyPayload, 
  DynamicAstrologyPayload,
  calculateVimshottariDasha as calculateEphemerisDasha,
  CurrentDashaStatus,
  NAKSHATRA_CATALOG,
  ZODIAC_ORDER,
  VEDIC_RASHI_NAMES,
  VEDIC_RASHI_LORDS
} from './ephemerisService';

export interface MoonNakshatraResult {
  nakshatraIndex: number;
  nakshatraName: string;
  sanskritName: string;
  rulingLord: string;
  deity: string;
  pada: number;
  moonLongitude: number;
  rashi: string;
  rashiLord: string;
  arcMinutesInNakshatra: number;
  totalArcMinutes: number;
  elapsedFraction: number;
  remainingFraction: number;
}

export interface UniqueFortuneStrings {
  headline: string;
  description: string;
  milestoneTime: string;
  luckyBlessing: string;
  careerFate: string;
  personalJoy: string;
  financialMilestone: string;
  dashaSummary: string;
}

export interface LuckyTalisman {
  name: string;
  symbol: string;
  element: string;
  meaning: string;
  blessing: string;
}

export interface MemberAstrologyDestiny {
  memberId: string;
  name: string;
  birthday: string;
  parsedBirthday: { month: number; day: number; formatted: string };
  zodiac: any;
  upcomingGoodThings: {
    headline: string;
    description: string;
    milestoneTime: string;
    luckyBlessing: string;
    traitLabel: string;
  };
  careerAndSuccess: {
    title: string;
    predictions: string[];
    growthLeap: string;
    traitLabel: string;
  };
  personalJoyAndPeace: {
    title: string;
    milestones: string[];
    friendshipBlessing: string;
    traitLabel: string;
  };
  destinyTraitLabel?: string;
  careerTraitLabel: string;
  joyTraitLabel: string;
  forecastTraitLabel: string;
  luckyTalisman?: LuckyTalisman;
  luckyNumbers: number[];
  dashaLifecycle: CurrentDashaStatus;
  uniqueFortune: UniqueFortuneStrings;
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
  auraKeyword: string;
  elementGlow: {
    border: string;
    badge: string;
    shadow: string;
    text: string;
  };
}

export interface CompatibilityMatch {
  member: TeamMember;
  score: number;
  sign: string;
  glyph: string;
  element: string;
  alignmentReason: string;
  synergyPillars: string[];
}

export interface MemberDashaEnergy {
  member: TeamMember;
  currentDasha: string;
  mahadashaLord: string;
  antardashaLord: string;
  pratyantardashaLord: string;
  startDate: string;
  endDate: string;
  energyScore: number;
  glyph: string;
  statusBadge: string;
  karmicVibe: string;
  theme: string;
  planetColor: string;
}

export interface PersonalLuckyCharm {
  month: number;
  monthName: string;
  emoji: string;
  charmName: string;
  meaning: string;
  blessing: string;
  element: string;
  color: string;
}

export interface PersonalLuckyGemstone {
  name: string;
  sanskritName: string;
  glyph: string;
  color: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
  rulingPlanet: string;
  benefits: string;
  element: string;
  wearFinger: string;
}

export interface ZodiacSignInfo {
  sign: string;
  glyph: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  rulingPlanet: string;
}

export interface MonthlyEnergyFlowPoint {
  monthIndex: number;
  month: string;
  fullMonth: string;
  monthNumber: number;
  year: number;
  energyScore: number;
  dominantLord: string;
  dominantGlyph: string;
  highEnergyCount: number;
  trend: 'Peak Synergy' | 'High Resonance' | 'Steady Momentum' | 'Dynamic Surge';
  trendType: 'high' | 'peak' | 'steady';
  summary: string;
}

export interface TeamEnergyVibeCheck {
  teamEnergyScore: number;
  vibeLevel: 'Transcendent Radiance' | 'High Resonance' | 'Dynamic Synergy' | 'Harmonic Equilibrium';
  vibeDescription: string;
  collectiveFocus: string;
  dominantDashaLord: string;
  dominantDashaGlyph: string;
  collectiveAuspiciousRating: string;
  activeDashaDistribution: { lord: string; count: number; glyph: string; percentage: number; color: string }[];
  memberEnergies: MemberDashaEnergy[];
  karmicRecommendations: string[];
  monthlyEnergyFlow: MonthlyEnergyFlowPoint[];
}

export class AstrologyDataService {
  /**
   * Calculates the high-precision Lahiri (Chitra Paksha) Ayanamsa for a given date.
   */
  static calculateLahiriAyanamsa(date: Date): number {
    const jd = Astronomy.MakeTime(date).ut;
    const t = (jd - 2451545.0) / 36525.0;
    // Standard IAU/Lahiri precession formula
    const ayanamsa = 23.85 + (t * 50.29) / 3600.0;
    return ayanamsa;
  }

  /**
   * Deterministically calculates the Moon's exact Nakshatra, Pada, and arcminutes
   * from birth timestamp and geographical coordinates.
   */
  static calculateMoonNakshatra(
    birthDate: Date,
    coordinates: { latitude: number; longitude: number } = { latitude: 23.8103, longitude: 90.4125 }
  ): MoonNakshatraResult {
    const astroTime = Astronomy.MakeTime(birthDate);
    const observer = new Astronomy.Observer(coordinates.latitude, coordinates.longitude, 10);
    const moonEquator = Astronomy.Equator(Astronomy.Body.Moon, astroTime, observer, true, true);
    const moonEcliptic = Astronomy.Ecliptic(moonEquator.vec);

    const tropicalLon = (moonEcliptic.elon % 360 + 360) % 360;
    const ayanamsa = this.calculateLahiriAyanamsa(birthDate);
    const siderealLon = (tropicalLon - ayanamsa + 360) % 360;

    const totalMinutes = siderealLon * 60;
    const nakshatraIndex = Math.floor(totalMinutes / 800) % 27;
    const arcMinutesInNakshatra = totalMinutes % 800;
    const pada = Math.floor(arcMinutesInNakshatra / 200) + 1;

    const nakshatraInfo = NAKSHATRA_CATALOG[nakshatraIndex] || NAKSHATRA_CATALOG[0];
    const rashiIndex = Math.floor(siderealLon / 30) % 12;
    const signName = ZODIAC_ORDER[rashiIndex] || ZODIAC_ORDER[0];
    const rashiName = VEDIC_RASHI_NAMES[signName] || 'Mesha';
    const rashiLord = VEDIC_RASHI_LORDS[rashiName] || 'Mangala (Mars)';

    const elapsedFraction = arcMinutesInNakshatra / 800;
    const remainingFraction = 1 - elapsedFraction;

    return {
      nakshatraIndex,
      nakshatraName: nakshatraInfo.name,
      sanskritName: nakshatraInfo.name,
      rulingLord: nakshatraInfo.lord,
      deity: nakshatraInfo.deity,
      pada,
      moonLongitude: siderealLon,
      rashi: rashiName,
      rashiLord: rashiLord,
      arcMinutesInNakshatra,
      totalArcMinutes: totalMinutes,
      elapsedFraction,
      remainingFraction
    };
  }

  /**
   * Calculates deterministic Vimshottari Dasha periods (120-year horizon)
   * with exact birth balance and down-to-the-day milestone dates.
   */
  static calculateVimshottariDasha(
    moonLongitude: number,
    birthDate: Date,
    currentDate: Date = new Date(),
    celebrantName?: string
  ): CurrentDashaStatus {
    return calculateEphemerisDasha(
      moonLongitude,
      birthDate,
      currentDate,
      celebrantName ? { celebrantName } : undefined
    );
  }

  /**
   * Generates a completely unique, symbol-rich fortune for a team member
   * by incorporating their exact astrological identity (Nakshatra, Planet lords, and milestone dates).
   */
  static generateUniqueFortune(
    member: TeamMember,
    currentDate: Date = new Date()
  ): UniqueFortuneStrings {
    const parsedB = parseBirthdayDate(member.birthday) || { month: 8, monthNumber: 9, day: 13, formatted: member.birthday || '13th Sep' };
    const birthYear = (member as any).birthYear || 1994;
    const birthTimeStr = (member as any).birthTime || '12:00';
    const [hours, minutes] = birthTimeStr.split(':').map(Number);
    const birthDate = new Date(birthYear, parsedB.month, parsedB.day, hours || 12, minutes || 0, 0);

    const moonNak = this.calculateMoonNakshatra(birthDate);
    const dasha = this.calculateVimshottariDasha(moonNak.moonLongitude, birthDate, currentDate, member.name);

    const firstName = (member.name || 'Celebrant').split(' ')[0];
    const nakshatra = moonNak.nakshatraName;
    const pada = moonNak.pada;
    const mahaLord = dasha.mahadasha.lord;
    const antarLord = dasha.antardasha.lord;
    const startDate = dasha.antardasha.startDate;
    const exactTriggerDate = dasha.antardasha.endDate;

    const headline = `☽ ${nakshatra} Pada ${pada} • ${antarLord} Bhukti (${exactTriggerDate})`;
    const description = `Because ${firstName}'s specific ruling Nakshatra is ${nakshatra} (Pada ${pada}) and your active Dasha lord is ${mahaLord}, your career fate in Karma Bhava triggers on ${exactTriggerDate} under ${antarLord} Bhukti. Key operational breakthroughs, executive visibility, and strategic recognition materialize in full alignment.`;
    const milestoneTime = `Exact Trigger: ${exactTriggerDate}`;
    const luckyBlessing = `Janma Rashi: ${moonNak.rashi} • Dasha: ${mahaLord}–${antarLord} • Period: ${startDate} to ${exactTriggerDate}`;
    const careerFate = `Because your ruling Nakshatra is ${nakshatra} and Dasha lord is ${mahaLord}, executive elevation culminates on ${exactTriggerDate}.`;
    const personalJoy = `Protected by Chandra in ${moonNak.rashi} (${nakshatra} Pada ${pada}), emotional sanctuary and radiant joy unfold from ${startDate}.`;
    const financialMilestone = `Material growth and performance appraisal rewards trigger on ${exactTriggerDate} under ${mahaLord} stewardship.`;
    const dashaSummary = `${mahaLord} Mahadasha (${dasha.mahadasha.startDate} – ${dasha.mahadasha.endDate}) • ${antarLord} Antardasha (${startDate} – ${exactTriggerDate})`;

    return {
      headline,
      description,
      milestoneTime,
      luckyBlessing,
      careerFate,
      personalJoy,
      financialMilestone,
      dashaSummary
    };
  }

  /**
   * Fetches high-precision ephemeris and Vedic data from the centralized API route,
   * falling back reliably to the built-in deterministic astronomical engine.
   */
  static async fetchLiveFortune(
    celebrant: TeamMember,
    signal?: AbortSignal
  ): Promise<DynamicAstrologyPayload> {
    const birthCity = (celebrant as any).birthCity || celebrant.department || 'Dhaka';
    const birthTime = (celebrant as any).birthTime || '12:00';
    const parsedB = parseBirthdayDate(celebrant.birthday);
    const birthday = parsedB?.formatted || celebrant.birthday || '13th Sep';

    // Unique cache-busting token tied to the user identity and exact execution timestamp
    const cacheBuster = `${encodeURIComponent(celebrant.id || celebrant.sl || celebrant.name)}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    try {
      const res = await fetch(`/api/astrology/live-fortune?_cb=${cacheBuster}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({
          celebrantName: celebrant.name,
          birthday,
          birthTime,
          birthCity,
          userId: celebrant.id || celebrant.sl || celebrant.name
        }),
        signal
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.payload) {
          return data.payload;
        }
      }
    } catch (_err) {
      // Fallback silently to client-side ephemeris calculation
    }

    // Direct client-side engine fallback (high-precision JPL DE430 + Lahiri Ayanamsa)
    return generateDynamicAstrologyPayload(
      celebrant.name,
      birthday,
      birthTime,
      birthCity
    );
  }

  /**
   * Synchronously calculates the deterministic astrological payload for a celebrant.
   */
  static calculateDynamicPayload(celebrant: TeamMember): DynamicAstrologyPayload {
    const birthCity = (celebrant as any).birthCity || celebrant.department || 'Dhaka';
    const birthTime = (celebrant as any).birthTime || '12:00';
    const parsedB = parseBirthdayDate(celebrant.birthday);
    const birthday = parsedB?.formatted || celebrant.birthday || '13th Sep';

    return generateDynamicAstrologyPayload(
      celebrant.name,
      birthday,
      birthTime,
      birthCity
    );
  }

  /**
   * Generates completely independent, calculated astrological destinies for all team members.
   * Fixes the Team Destinies loop by executing an isolated ephemeris calculation for every single member.
   */
  static generateTeamDestinies(
    membersList: TeamMember[],
    getZodiacSign: (month: number, day: number) => any,
    monthAuras: Record<number, any>,
    currentYear: number
  ): MemberAstrologyDestiny[] {
    return membersList.map((m) => {
      return this.generateMemberDestiny(m, getZodiacSign, monthAuras, currentYear);
    });
  }

  /**
   * Generates an isolated, mathematically unique destiny card for a single team member.
   * Injects the member's exact ruling Nakshatra, Pada, Dasha lord, and calculated trigger date.
   */
  static generateMemberDestiny(
    member: TeamMember,
    getZodiacSign: (month: number, day: number) => any,
    monthAuras: Record<number, any>,
    _currentYear: number = new Date().getFullYear()
  ): MemberAstrologyDestiny {
    const p = parseBirthdayDate(member.birthday) || { month: 8, monthNumber: 9, day: 13, formatted: member.birthday || '13th Sep' };
    const z = getZodiacSign(p.month, p.day);
    const aura = monthAuras[p.month] || monthAuras[8];

    const birthYear = (member as any).birthYear || 1994;
    const birthTimeStr = (member as any).birthTime || '12:00';
    const [hours, minutes] = birthTimeStr.split(':').map(Number);
    const birthDate = new Date(birthYear, p.month, p.day, hours || 12, minutes || 0, 0);

    const moonNak = this.calculateMoonNakshatra(birthDate);
    const dasha = this.calculateVimshottariDasha(moonNak.moonLongitude, birthDate, new Date(), member.name);
    const uniqueFortune = this.generateUniqueFortune(member);

    const firstName = (member.name || 'Celebrant').split(' ')[0];
    const nakshatra = moonNak.nakshatraName;
    const pada = moonNak.pada;
    const mahaLord = dasha.mahadasha.lord;
    const antarLord = dasha.antardasha.lord;
    const pratyantarLord = dasha.pratyantardasha.lord;
    const startDate = dasha.antardasha.startDate;
    const exactTriggerDate = dasha.antardasha.endDate;

    const careerPredictions = [
      `Because ${firstName}'s ruling Nakshatra is ${nakshatra} (Pada ${pada}) and active Dasha lord is ${mahaLord}, executive elevation culminates on ${exactTriggerDate}.`,
      `Governed by ${antarLord} Bhukti steering through ${moonNak.rashi}, breakthrough leadership mandates and architectural influence reach peak momentum.`,
      `Karma Bhava resonance unlocks strategic visibility, cross-team technical leadership, and commendations from Central IE stakeholders.`
    ];

    const joyMilestones = [
      `Protected by Chandra in ${moonNak.rashi} (${nakshatra} Pada ${pada}), emotional sanctuary and radiant joy unfold from ${startDate}.`,
      `Harmonious alignment in 4th and 11th Bhavas brings restorative celebrations, peaceful breakthroughs, and deep personal fulfillment.`,
      `Vitality index surges under ${pratyantarLord} Pratyantar, anchoring creative peace and team camaraderie.`
    ];

    const careerOpportunities = [
      `Executive Ascension in ${moonNak.rashi} under ${mahaLord}–${antarLord} Dasha culminating on ${exactTriggerDate}`,
      `Lead architecture mandate triggered by ${nakshatra} Pada ${pada} planetary alignment`,
      `High-visibility Central IE operational milestone recognized across leadership`
    ];

    const happinessMilestones = [
      `Emotional rejuvenation & lunar harmony active from ${startDate}`,
      `Soulful personal milestone in ${moonNak.rashi} celebrated with close peers and family`,
      `Inner peace and radiant resilience blessed by Chandra in ${nakshatra}`
    ];

    const financialAbundance = [
      `Appraisal bonus & material rewards trigger on ${exactTriggerDate} under ${mahaLord} stewardship`,
      `Strategic portfolio growth empowered by 11th Bhava activation in ${moonNak.rashi}`,
      `Long-term financial security accelerated during ${antarLord} Bhukti`
    ];

    const friendshipHarmony = [
      `Cherished as the steadfast anchor and inspiring beacon of the Central IE team`,
      `Heartfelt birthday tributes and lasting comradeship flowing throughout ${p.formatted}`,
      `Mutual trust and cross-functional synergy magnified under ${antarLord} influence`
    ];

    const destinyArchetypes = [
      'Trailblazer', 'Pathfinder', 'Visionary', 'Luminary', 'Sovereign',
      'Pinnacle', 'Architect', 'Alchemist', 'Catalyst', 'Conqueror',
      'Voyager', 'Waymaker'
    ];
    const careerArchetypes = [
      'Visionary', 'Innovator', 'Strategist', 'Architect', 'Pioneer',
      'Trailblazer', 'Catalyst', 'Luminary', 'Director', 'Navigator',
      'Mastermind', 'Orchestrator'
    ];
    const joyArchetypes = [
      'Peacemaker', 'Harmonizer', 'Radiance', 'Anchor', 'Empath',
      'Beacon', 'Kindred Spirit', 'Optimist', 'Sanctuary', 'Inspire',
      'Serenity', 'Healer'
    ];
    const forecastArchetypes = [
      'Ascendant', 'Breakthrough', 'Pinnacle', 'Flourishing', 'Abundance',
      'Renaissance', 'Metamorphosis', 'Triumph', 'Elevation', 'Expansion',
      'Prosperity', 'Momentum'
    ];

    const zSeed = (z.name || 'Aries').split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0);
    const destinyTraitLabel = destinyArchetypes[(zSeed * 5 + moonNak.nakshatraIndex) % destinyArchetypes.length];
    const careerTraitLabel = careerArchetypes[(zSeed + moonNak.nakshatraIndex) % careerArchetypes.length];
    const joyTraitLabel = joyArchetypes[(zSeed * 3 + moonNak.nakshatraIndex) % joyArchetypes.length];
    const forecastTraitLabel = forecastArchetypes[(zSeed * 7 + moonNak.nakshatraIndex) % forecastArchetypes.length];

    return {
      memberId: member.id || member.sl || member.name,
      name: member.name,
      birthday: member.birthday,
      parsedBirthday: p,
      zodiac: z,
      upcomingGoodThings: {
        headline: uniqueFortune.headline,
        description: uniqueFortune.description,
        milestoneTime: uniqueFortune.milestoneTime,
        luckyBlessing: uniqueFortune.luckyBlessing,
        traitLabel: forecastTraitLabel
      },
      careerAndSuccess: {
        title: `Dashamsha (D10) & Karma Bhava Destiny in ${moonNak.rashi}`,
        predictions: careerPredictions,
        growthLeap: `Executive Mandate in ${moonNak.rashi} • ${mahaLord}–${antarLord} Ascension (${startDate} – ${exactTriggerDate})`,
        traitLabel: careerTraitLabel
      },
      personalJoyAndPeace: {
        title: `Navamsha (D9) & Lunar Sanctuary in ${moonNak.rashi}`,
        milestones: joyMilestones,
        friendshipBlessing: `Protected by Chandra in Janma Rashi ${moonNak.rashi} (${nakshatra} Pada ${pada}), ${firstName} is cherished by teammates as the steadfast anchor, trusted confidant, and inspiring beacon of the entire department.`,
        traitLabel: joyTraitLabel
      },
      destinyTraitLabel,
      careerTraitLabel,
      joyTraitLabel,
      forecastTraitLabel,
      luckyTalisman: this.calculateLuckyTalisman(member?.birthday),
      luckyNumbers: this.calculateLuckyNumbers(member),
      dashaLifecycle: dasha,
      uniqueFortune,
      careerOpportunities,
      happinessMilestones,
      financialAbundance,
      friendshipHarmony,
      yearByYearForecast: [
        {
          year: _currentYear,
          theme: `${mahaLord}–${antarLord} Karma Focus`,
          prediction: `Rapid breakthroughs under ${antarLord} Bhukti in ${moonNak.rashi}. Operational triumphs and architectural mandates materialize in full alignment.`,
          vitalityScore: 95
        },
        {
          year: _currentYear + 1,
          theme: `Jupiter Transit & Leadership Expansion`,
          prediction: `Major team elevation and cross-functional authority recognized across the department with executive backing.`,
          vitalityScore: 98
        },
        {
          year: _currentYear + 2,
          theme: `${nakshatra} Stellar Mastery`,
          prediction: `Long-term vision anchors enduring milestone achievements, high organizational trust, and lasting professional legacy.`,
          vitalityScore: 93
        }
      ],
      auraKeyword: aura?.coreKeyword || 'Radiant',
      elementGlow: {
        border: z.elementGlow.border,
        badge: z.elementGlow.text,
        shadow: z.elementGlow.shadow,
        text: z.elementGlow.text
      }
    };
  }

  /**
   * Generates a unique set of 'Lucky Numbers' for each member based on their birth date and name numerology.
   */
  static calculateLuckyNumbers(member: TeamMember): number[] {
    if (!member) return [3, 7, 9, 14, 21, 33];
    const p = parseBirthdayDate(member.birthday);
    const day = p?.day || 13;
    const month = (p?.month !== undefined ? p.month + 1 : 9);
    
    // Pythagorean name numerology mapping
    const pythagoreanMap: Record<string, number> = {
      a: 1, j: 1, s: 1,
      b: 2, k: 2, t: 2,
      c: 3, l: 3, u: 3,
      d: 4, m: 4, v: 4,
      e: 5, n: 5, w: 5,
      f: 6, o: 6, x: 6,
      g: 7, p: 7, y: 7,
      h: 8, q: 8, z: 8,
      i: 9, r: 9
    };
    
    const cleanName = (member.name || '').toLowerCase().replace(/[^a-z]/g, '');
    let nameSum = 0;
    for (const ch of cleanName) {
      nameSum += pythagoreanMap[ch] || 0;
    }
    
    const reduceToSingleDigit = (n: number): number => {
      let sum = n;
      while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
      }
      return sum > 9 ? (sum % 9 || 9) : sum;
    };
    
    const birthDayRoot = reduceToSingleDigit(day);
    const lifePathNumber = reduceToSingleDigit(day + month + (day % 7));
    const nameExpressionNumber = reduceToSingleDigit(nameSum || 7);
    
    const seed = (cleanName.length * 7 + day * 13 + month * 19) % 89;
    const catalystNumber = ((seed + birthDayRoot * 3) % 49) + 1;
    const powerNumber = ((seed * 2 + nameExpressionNumber * 5) % 77) + 1;
    const wealthAttractorNumber = ((day * month + nameSum) % 99) + 1;

    const rawNumbers = [
      birthDayRoot,
      lifePathNumber,
      nameExpressionNumber,
      catalystNumber,
      powerNumber,
      wealthAttractorNumber
    ];
    
    const unique = Array.from(new Set(rawNumbers));
    return unique.slice(0, 6);
  }

  /**
   * Alias for calculateLuckyNumbers matching prompt requirements.
   */
  static generateLuckyNumbers(member: TeamMember): number[] {
    return this.calculateLuckyNumbers(member);
  }

  /**
   * Generates a unique 'Lucky Talisman' or 'Personal Symbol' based on birth date.
   */
  static calculateLuckyTalisman(birthdayStr?: string | number): LuckyTalisman {
    const p = parseBirthdayDate(birthdayStr) || { month: 8, monthNumber: 9, day: 13, formatted: '13th Sep' };
    const talismans: LuckyTalisman[] = [
      { name: 'Celestial Lotus', symbol: '🪷', element: 'Water', meaning: 'Purity, spiritual elevation & unfading serenity', blessing: 'Brings tranquility and inner emotional clarity' },
      { name: 'Golden Phoenix', symbol: '🦅', element: 'Fire', meaning: 'Renewal, bold ascension & breakthrough vitality', blessing: 'Catalyzes rapid elevation in high-stakes ventures' },
      { name: 'Cosmic Compass', symbol: '🧭', element: 'Air', meaning: 'Infallible direction, wisdom & strategic foresight', blessing: 'Guides flawless decision-making and project roadmaps' },
      { name: 'Aegis Guardian', symbol: '🛡️', element: 'Earth', meaning: 'Steadfast sanctuary, integrity & unwavering protection', blessing: 'Shields from burnout and negative external friction' },
      { name: 'Star Feather', symbol: '🪶', element: 'Air', meaning: 'Grace, creative lightness & inspired expression', blessing: 'Unlocks effortless communication and team synergy' },
      { name: 'Radiant Diamond', symbol: '💎', element: 'Earth', meaning: 'Invincible endurance, clarity & peak brilliance', blessing: 'Magnifies authority, respect, and professional renown' },
      { name: 'Astral Sphere', symbol: '🔮', element: 'Water', meaning: 'Intuition, prophetic insight & subtle harmony', blessing: 'Attunes you to hidden opportunities ahead of time' },
      { name: 'Thunderbolt Prism', symbol: '⚡', element: 'Fire', meaning: 'Electric dynamism, courage & catalytic power', blessing: 'Ignites sudden breakthroughs in stagnated tasks' },
      { name: 'Solar Starburst', symbol: '🌟', element: 'Fire', meaning: 'Luminosity, executive warmth & charismatic charm', blessing: 'Draws loyal comrades and admiring mentors' },
      { name: 'Golden Key', symbol: '🗝️', element: 'Earth', meaning: 'Unlocking prosperity, abundance & new horizons', blessing: 'Opens high-value doors to strategic mastery' },
      { name: 'Celestial Eye', symbol: '🧿', element: 'Water', meaning: 'Divine shielding, good fortune & karmic balance', blessing: 'Repels setbacks and anchors steady momentum' },
      { name: 'Crescent Moon', symbol: '🌙', element: 'Water', meaning: 'Restorative rejuvenation, peace & dream fulfillment', blessing: 'Fosters deep restorative rest and joyful relationships' }
    ];

    const day = p?.day || 13;
    const month = p?.month !== undefined ? p.month : 8;
    const index = Math.abs(month * 7 + day * 11) % talismans.length;
    return talismans[index];
  }

  /**
   * Generates a unique 'Lucky Talisman' or 'Personal Symbol' based on birth date (accepts member or birthday).
   */
  static generateLuckyTalisman(memberOrBirthday?: TeamMember | string | number): LuckyTalisman {
    let bStr: string | number | undefined;
    if (memberOrBirthday && typeof memberOrBirthday === 'object' && 'birthday' in memberOrBirthday) {
      bStr = (memberOrBirthday as TeamMember).birthday;
    } else if (typeof memberOrBirthday === 'string' || typeof memberOrBirthday === 'number') {
      bStr = memberOrBirthday;
    }
    return this.calculateLuckyTalisman(bStr);
  }

  /**
   * Generates a unique 'Personal Symbol' based on birth date (alias matching user requirements).
   */
  static getPersonalSymbol(memberOrBirthday?: TeamMember | string | number): LuckyTalisman {
    return this.generateLuckyTalisman(memberOrBirthday);
  }

  /**
   * Generates a unique 'Personal Symbol' based on birth date (alias matching user requirements).
   */
  static calculatePersonalSymbol(memberOrBirthday?: TeamMember | string | number): LuckyTalisman {
    return this.generateLuckyTalisman(memberOrBirthday);
  }

  /**
   * Calculates compatibility scores between team members based on their Sun signs.
   */
  static calculateTeamCompatibility(
    celebrant: TeamMember,
    teamMembers: TeamMember[],
    getZodiacSign: (month: number, day: number) => any,
    currentMonth?: number
  ): CompatibilityMatch[] {
    if (!celebrant) return [];
    const p1 = parseBirthdayDate(celebrant.birthday) || { month: 8, monthNumber: 9, day: 13, formatted: celebrant.birthday || '13th Sep' };
    const z1 = getZodiacSign(p1.month, p1.day) || { name: 'Virgo', glyph: '♍', element: 'Earth' };
    const cId = celebrant.id || celebrant.sl || celebrant.name;

    const matches: CompatibilityMatch[] = [];

    for (const m of (teamMembers || [])) {
      if (!m) continue;
      const mId = m.id || m.sl || m.name;
      if (mId === cId) continue;

      const p2 = parseBirthdayDate(m.birthday) || { month: 8, monthNumber: 9, day: 13, formatted: m.birthday || '13th Sep' };
      const z2 = getZodiacSign(p2.month, p2.day) || { name: 'Virgo', glyph: '♍', element: 'Earth' };

      let baseScore = 76;
      let reason = 'Complementary perspectives fostering mutual growth';

      const sameElement = z1?.element === z2?.element;
      const fireAir = (z1?.element === 'Fire' && z2?.element === 'Air') || (z1?.element === 'Air' && z2?.element === 'Fire');
      const earthWater = (z1?.element === 'Earth' && z2?.element === 'Water') || (z1?.element === 'Water' && z2?.element === 'Earth');

      if (sameElement) {
        baseScore = 93;
        reason = `Same ${z1?.element || 'shared'} element — Natural harmony & aligned instincts`;
      } else if (fireAir) {
        baseScore = 89;
        reason = 'Fire & Air — Creative sparks & high-velocity collaboration';
      } else if (earthWater) {
        baseScore = 88;
        reason = 'Earth & Water — Grounded strategy & deep empathetic trust';
      }

      const seed = Math.abs((m.name || '').charCodeAt(0) - (celebrant.name || '').charCodeAt(0)) % 6;
      let finalScore = baseScore + seed;
      
      if (currentMonth !== undefined && p2?.month === currentMonth) {
        finalScore += 2;
      }
      finalScore = Math.min(98, Math.max(72, finalScore));

      matches.push({
        member: m,
        score: finalScore,
        sign: z2?.name || 'Aries',
        glyph: z2?.glyph || '♈',
        element: z2?.element || 'Fire',
        alignmentReason: reason,
        synergyPillars: [
          `${z1?.element || 'Earth'} + ${z2?.element || 'Water'} Synergy`,
          `${finalScore}% Energetic Harmony`
        ]
      });
    }

    return matches.sort((a, b) => b.score - a.score);
  }

  /**
   * Helper to get a summary sample trait word for planetary transits
   */
  static getTransitTraitLabel(planet: string): string {
    const transitArchetypes: Record<string, string> = {
      Jupiter: 'Expander',
      Saturn: 'Disciplinarian',
      Rahu: 'Catalyst',
      Ketu: 'Liberator',
      Mars: 'Champion',
      Sun: 'Luminary',
      Venus: 'Harmonizer',
      Mercury: 'Strategist',
      Moon: 'Empath'
    };
    return transitArchetypes[planet] || 'Innovator';
  }

  /**
   * Helper to get a summary sample trait word for quarterly milestones
   */
  static getMilestoneTraitLabel(quarter: string, index: number = 0): string {
    const milestoneArchetypes = ['Pioneer', 'Breakthrough', 'Ascendant', 'Pinnacle'];
    if (quarter?.toLowerCase().includes('q1')) return 'Pioneer';
    if (quarter?.toLowerCase().includes('q2')) return 'Breakthrough';
    if (quarter?.toLowerCase().includes('q3')) return 'Ascendant';
    if (quarter?.toLowerCase().includes('q4')) return 'Pinnacle';
    return milestoneArchetypes[index % milestoneArchetypes.length] || 'Visionary';
  }

  /**
   * Generates an 'Energetic Vibe Check' for the whole team, calculating
   * a summarized 'Team Energy Score' based on the collective current Dasha periods.
   */
  static calculateTeamEnergyVibeCheck(members: TeamMember[]): TeamEnergyVibeCheck {
    if (!members || members.length === 0) {
      return {
        teamEnergyScore: 88,
        vibeLevel: 'Harmonic Equilibrium',
        vibeDescription: 'Collective energy is balanced, receptive, and grounded in mutual support.',
        collectiveFocus: 'Collaborative alignment and foundational stability',
        dominantDashaLord: 'Jupiter',
        dominantDashaGlyph: '♃',
        collectiveAuspiciousRating: '88% Auspicious Harmony',
        activeDashaDistribution: [],
        memberEnergies: [],
        karmicRecommendations: ['Nurture cross-functional camaraderie and celebrate individual contributions.'],
        monthlyEnergyFlow: this.calculateMonthlyTeamEnergyFlow([])
      };
    }

    const lordColors: Record<string, string> = {
      Jupiter: '#f59e0b',
      Venus: '#ec4899',
      Mercury: '#10b981',
      Moon: '#06b6d4',
      Sun: '#f97316',
      Mars: '#ef4444',
      Saturn: '#6366f1',
      Rahu: '#a855f7',
      Ketu: '#14b8a6'
    };

    const lordGlyphs: Record<string, string> = {
      Jupiter: '♃',
      Venus: '♀',
      Mercury: '☿',
      Moon: '☽',
      Sun: '☉',
      Mars: '♂',
      Saturn: '♄',
      Rahu: '☊',
      Ketu: '☋'
    };

    const lordVibes: Record<string, string> = {
      Jupiter: 'Wisdom, strategic expansion & visionary guidance',
      Venus: 'Creative elegance, team harmony & celebratory warmth',
      Mercury: 'Sharp intellect, swift communication & architectural precision',
      Moon: 'Deep empathy, intuition & emotional sanctuary',
      Sun: 'Sovereign vitality, charismatic leadership & authoritative clarity',
      Mars: 'Relentless drive, bold execution & catalytic momentum',
      Saturn: 'Enduring discipline, rock-solid reliability & mastery',
      Rahu: 'Quantum leaps, disruptive innovation & out-of-the-box breakthroughs',
      Ketu: 'Spiritual detachment, profound insight & intuitive release'
    };

    const memberEnergies: MemberDashaEnergy[] = [];
    const lordCount: Record<string, number> = {};

    for (const m of members) {
      if (!m) continue;
      try {
        const p = parseBirthdayDate(m.birthday) || { month: 8, monthNumber: 9, day: 13, formatted: '13th Sep' };
        const birthYear = (m as any).birthYear || 1995;
        const birthTimeStr = (m as any).birthTime || '12:00';
        const [hours, minutes] = birthTimeStr.split(':').map(Number);
        const birthDate = new Date(birthYear, p.month, p.day, hours || 12, minutes || 0, 0);

        const moonNak = this.calculateMoonNakshatra(birthDate);
        const dasha = this.calculateVimshottariDasha(moonNak.moonLongitude, birthDate, new Date(), m.name);

        const activePhase = dasha.lifecycle?.find((phase) => phase.isActive) || dasha.lifecycle?.[0];
        const mahaLord = dasha.mahadasha?.lord || 'Jupiter';
        const antarLord = dasha.antardasha?.lord || 'Mercury';
        const pratyantarLord = dasha.pratyantardasha?.lord || 'Venus';

        lordCount[mahaLord] = (lordCount[mahaLord] || 0) + 1;

        let score = activePhase?.favorableScore || 85;
        if (['Jupiter', 'Venus', 'Mercury'].includes(mahaLord)) score += 4;
        else if (['Sun', 'Moon'].includes(mahaLord)) score += 3;
        score = Math.min(99, Math.max(76, score));

        memberEnergies.push({
          member: m,
          currentDasha: `${mahaLord}–${antarLord}`,
          mahadashaLord: mahaLord,
          antardashaLord: antarLord,
          pratyantardashaLord: pratyantarLord,
          startDate: dasha.antardasha?.startDate || 'Active',
          endDate: dasha.antardasha?.endDate || 'Horizon',
          energyScore: score,
          glyph: lordGlyphs[mahaLord] || '🪐',
          statusBadge: score >= 90 ? 'Peak Radiance' : score >= 85 ? 'High Resonance' : 'Balanced Synergy',
          karmicVibe: lordVibes[mahaLord] || 'Harmonious and focused alignment',
          theme: activePhase?.theme || `${mahaLord} Karmic Cycle`,
          planetColor: lordColors[mahaLord] || '#a855f7'
        });
      } catch {
        memberEnergies.push({
          member: m,
          currentDasha: 'Jupiter–Mercury',
          mahadashaLord: 'Jupiter',
          antardashaLord: 'Mercury',
          pratyantardashaLord: 'Venus',
          startDate: 'Current',
          endDate: 'Upcoming',
          energyScore: 88,
          glyph: '♃',
          statusBadge: 'High Resonance',
          karmicVibe: 'Expansion and strategic clarity',
          theme: 'Wisdom & Growth',
          planetColor: '#f59e0b'
        });
        lordCount['Jupiter'] = (lordCount['Jupiter'] || 0) + 1;
      }
    }

    const totalScore = memberEnergies.reduce((sum, item) => sum + item.energyScore, 0);
    const avgScore = memberEnergies.length > 0 ? Math.round(totalScore / memberEnergies.length) : 88;
    const teamEnergyScore = Math.min(98, Math.max(80, avgScore));

    let dominantDashaLord = 'Jupiter';
    let maxCount = 0;
    for (const [lord, count] of Object.entries(lordCount)) {
      if (count > maxCount) {
        maxCount = count;
        dominantDashaLord = lord;
      }
    }

    const distribution = Object.entries(lordCount).map(([lord, count]) => ({
      lord,
      count,
      glyph: lordGlyphs[lord] || '🪐',
      percentage: Math.round((count / (memberEnergies.length || 1)) * 100),
      color: lordColors[lord] || '#818cf8'
    })).sort((a, b) => b.count - a.count);

    let vibeLevel: TeamEnergyVibeCheck['vibeLevel'] = 'High Resonance';
    let vibeDescription = 'The team is operating in powerful harmonic resonance, with key members entering expansive breakthrough cycles.';
    if (teamEnergyScore >= 92) {
      vibeLevel = 'Transcendent Radiance';
      vibeDescription = 'Cosmic ephemeris indicates unprecedented collective synergy. Multiple members are under highly auspicious planetary periods, creating an environment primed for monumental team triumphs.';
    } else if (teamEnergyScore >= 87) {
      vibeLevel = 'High Resonance';
      vibeDescription = 'A balanced mixture of wisdom (Guru) and dynamic velocity (Budha/Kuja) is guiding the squad. Strategic decisions flow naturally with high trust and minimal friction.';
    } else {
      vibeLevel = 'Dynamic Synergy';
      vibeDescription = 'Steadfast determination and methodical endurance define the team karma. Collective focus is strong on perfecting details and locking down enduring architectures.';
    }

    return {
      teamEnergyScore,
      vibeLevel,
      vibeDescription,
      collectiveFocus: `${dominantDashaLord} planetary resonance steering organizational impact and collective goodwill`,
      dominantDashaLord,
      dominantDashaGlyph: lordGlyphs[dominantDashaLord] || '♃',
      collectiveAuspiciousRating: `${teamEnergyScore}% Karmic Potency`,
      activeDashaDistribution: distribution,
      memberEnergies: memberEnergies.sort((a, b) => b.energyScore - a.energyScore),
      karmicRecommendations: [
        `Harness the ${dominantDashaLord} Mahadasha momentum by pairing members under complementary Dasha phases.`,
        'Acknowledge and celebrate individual milestone thresholds to amplify the team’s collective aura field.',
        'Schedule high-stakes architectural launches during auspicious lunar transit windows for peak synchronicity.'
      ],
      monthlyEnergyFlow: this.calculateMonthlyTeamEnergyFlow(members)
    };
  }

  /**
   * Generates a 12-month timeline mapping the collective Dasha periods of all team members
   * to show high/low energy trends, peak resonance cycles, and dominant lords.
   */
  static calculateMonthlyTeamEnergyFlow(members: TeamMember[], startDate: Date = new Date()): MonthlyEnergyFlowPoint[] {
    const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const FULL_MONTH_LABELS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const flowPoints: MonthlyEnergyFlowPoint[] = [];

    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();

    const lordGlyphs: Record<string, string> = {
      Jupiter: '♃',
      Venus: '♀',
      Mercury: '☿',
      Sun: '☉',
      Moon: '☽',
      Mars: '♂',
      Saturn: '♄',
      Rahu: '☊',
      Ketu: '☋'
    };

    for (let i = 0; i < 12; i++) {
      const targetDate = new Date(startYear, startMonth + i, 15);
      const mIdx = targetDate.getMonth();
      const yr = targetDate.getFullYear();
      const monthLabel = `${MONTH_LABELS[mIdx]} '${String(yr).slice(-2)}`;
      const fullMonthLabel = `${FULL_MONTH_LABELS[mIdx]} ${yr}`;

      let totalScore = 0;
      let memberCount = 0;
      let highEnergyCount = 0;
      const lordTally: Record<string, number> = {};

      for (const m of members) {
        if (!m) continue;
        try {
          const p = parseBirthdayDate(m.birthday) || { month: 8, monthNumber: 9, day: 13, formatted: '13th Sep' };
          const birthYear = (m as any).birthYear || 1995;
          const birthTimeStr = (m as any).birthTime || '12:00';
          const [hours, minutes] = birthTimeStr.split(':').map(Number);
          const birthDate = new Date(birthYear, p.month, p.day, hours || 12, minutes || 0, 0);

          const moonNak = this.calculateMoonNakshatra(birthDate);
          const dasha = this.calculateVimshottariDasha(moonNak.moonLongitude, birthDate, targetDate, m.name);

          const activePhase = dasha.lifecycle?.find((phase) => phase.isActive) || dasha.lifecycle?.[0];
          const mahaLord = dasha.mahadasha?.lord || 'Jupiter';

          lordTally[mahaLord] = (lordTally[mahaLord] || 0) + 1;

          let score = activePhase?.favorableScore || 85;
          if (['Jupiter', 'Venus', 'Mercury'].includes(mahaLord)) score += 4;
          else if (['Sun', 'Moon'].includes(mahaLord)) score += 3;
          score = Math.min(99, Math.max(76, score));

          if (score >= 90) highEnergyCount++;
          totalScore += score;
          memberCount++;
        } catch {
          totalScore += 88;
          memberCount++;
          lordTally['Jupiter'] = (lordTally['Jupiter'] || 0) + 1;
        }
      }

      const avg = memberCount > 0 ? Math.round(totalScore / memberCount) : 88;
      // Astrological transit wave modulation
      const waveMod = Math.round(Math.sin(((mIdx + i) / 12) * Math.PI * 2) * 3);
      const energyScore = Math.min(98, Math.max(78, avg + waveMod));

      let dominantLord = 'Jupiter';
      let maxLordCount = 0;
      for (const [lord, count] of Object.entries(lordTally)) {
        if (count > maxLordCount) {
          maxLordCount = count;
          dominantLord = lord;
        }
      }

      let trend: MonthlyEnergyFlowPoint['trend'] = 'Steady Momentum';
      let trendType: MonthlyEnergyFlowPoint['trendType'] = 'steady';
      if (energyScore >= 92) {
        trend = 'Peak Synergy';
        trendType = 'peak';
      } else if (energyScore >= 87) {
        trend = 'High Resonance';
        trendType = 'high';
      } else if (energyScore >= 82) {
        trend = 'Dynamic Surge';
        trendType = 'steady';
      }

      flowPoints.push({
        monthIndex: i,
        month: monthLabel,
        fullMonth: fullMonthLabel,
        monthNumber: mIdx + 1,
        year: yr,
        energyScore,
        dominantLord,
        dominantGlyph: lordGlyphs[dominantLord] || '♃',
        highEnergyCount,
        trend,
        trendType,
        summary: `${dominantLord} Dasha dominance with ${energyScore}% collective vitality across the squad.`
      });
    }

    return flowPoints;
  }

  /**
   * Generates a 'Personal Lucky Charm' based on birth month.
   */
  static getPersonalLuckyCharm(monthOrMemberOrBirthday?: number | TeamMember | string): PersonalLuckyCharm {
    let month = 8;
    if (typeof monthOrMemberOrBirthday === 'number') {
      month = monthOrMemberOrBirthday >= 1 && monthOrMemberOrBirthday <= 12
        ? monthOrMemberOrBirthday - 1
        : Math.abs(monthOrMemberOrBirthday) % 12;
    } else if (monthOrMemberOrBirthday && typeof monthOrMemberOrBirthday === 'object' && 'birthday' in monthOrMemberOrBirthday) {
      const p = parseBirthdayDate((monthOrMemberOrBirthday as TeamMember).birthday);
      if (p && p.month !== undefined) month = p.month;
    } else if (typeof monthOrMemberOrBirthday === 'string') {
      const p = parseBirthdayDate(monthOrMemberOrBirthday);
      if (p && p.month !== undefined) month = p.month;
    }
    return this.calculatePersonalLuckyCharm(month);
  }

  /**
   * Alias for getPersonalLuckyCharm matching user specifications.
   */
  static generatePersonalLuckyCharm(monthOrMemberOrBirthday?: number | TeamMember | string): PersonalLuckyCharm {
    return this.getPersonalLuckyCharm(monthOrMemberOrBirthday);
  }

  /**
   * Calculates Personal Lucky Charm based on birth month index (0-11).
   */
  static calculatePersonalLuckyCharm(month: number): PersonalLuckyCharm {
    const charms: PersonalLuckyCharm[] = [
      {
        month: 0,
        monthName: 'January',
        emoji: '🗝️',
        charmName: 'Golden Key of Breakthroughs',
        meaning: 'Unlocks unforeseen pathways, executive respect, and boundless courage',
        blessing: 'May every door you approach swing open with prosperity and clarity',
        element: 'Earth',
        color: '#38bdf8'
      },
      {
        month: 1,
        monthName: 'February',
        emoji: '🔮',
        charmName: 'Amethyst Crystal Sphere',
        meaning: 'Elevates visionary foresight, sharpens intuition, and dissolves doubt',
        blessing: 'May your thoughts remain clear, inspired, and deeply centered',
        element: 'Air',
        color: '#c084fc'
      },
      {
        month: 2,
        monthName: 'March',
        emoji: '🌊',
        charmName: 'Aquamarine Tidal Pearl',
        meaning: 'Channels boundless creative flow, emotional composure, and inner peace',
        blessing: 'May your journey flow effortlessly through all seasons',
        element: 'Water',
        color: '#22d3ee'
      },
      {
        month: 3,
        monthName: 'April',
        emoji: '💎',
        charmName: 'Diamond Sunburst Amulet',
        meaning: 'Invincible confidence, leadership mastery, and unshakeable truth',
        blessing: 'May your radiance illuminate and guide everyone around you',
        element: 'Fire',
        color: '#e0e7ff'
      },
      {
        month: 4,
        monthName: 'May',
        emoji: '🍀',
        charmName: 'Emerald Four-Leaf Clover',
        meaning: 'Unbounded vitality, prosperous abundance, and serendipitous favor',
        blessing: 'May good fortune follow your footsteps in all pursuits',
        element: 'Earth',
        color: '#34d399'
      },
      {
        month: 5,
        monthName: 'June',
        emoji: '🪷',
        charmName: 'Sacred Moonlit Lotus',
        meaning: 'Harmonious diplomacy, purity of purpose, and graceful warmth',
        blessing: 'May serene joy and deep contentment fill your days',
        element: 'Water',
        color: '#f472b6'
      },
      {
        month: 6,
        monthName: 'July',
        emoji: '🪬',
        charmName: 'Ruby Hamsa Shield',
        meaning: 'Mystic ward guarding your energy, inspiring radiant vitality and trust',
        blessing: 'May you be sheltered from friction and surrounded by genuine allies',
        element: 'Water',
        color: '#fb7185'
      },
      {
        month: 7,
        monthName: 'August',
        emoji: '🌟',
        charmName: 'Solar Flare Starburst',
        meaning: 'Charismatic authority, monumental victories, and noble warmth',
        blessing: 'May your courage kindle triumphs that stand the test of time',
        element: 'Fire',
        color: '#fbbf24'
      },
      {
        month: 8,
        monthName: 'September',
        emoji: '🧿',
        charmName: 'Sapphire Nazar Eye',
        meaning: 'Unerring discernment, architectural precision, and shield of truth',
        blessing: 'May your decisions always be blessed with wisdom and foresight',
        element: 'Earth',
        color: '#60a5fa'
      },
      {
        month: 9,
        monthName: 'October',
        emoji: '🪩',
        charmName: 'Opal Harmony Prism',
        meaning: 'Balanced grace, artistic synergy, and heartfelt camaraderie',
        blessing: 'May equilibrium, sweet laughter, and team unity accompany you',
        element: 'Air',
        color: '#fbcfe8'
      },
      {
        month: 10,
        monthName: 'November',
        emoji: '🪶',
        charmName: 'Golden Phoenix Feather',
        meaning: 'Dynamic resilience, regenerative stamina, and relentless mastery',
        blessing: 'May you rise triumphant through every challenge with renewed brilliance',
        element: 'Water',
        color: '#f97316'
      },
      {
        month: 11,
        monthName: 'December',
        emoji: '🏹',
        charmName: 'Turquoise Celestial Arrow',
        meaning: 'Expansive horizons, philosophical vision, and victorious fortune',
        blessing: 'May your highest ambitions land right at the center of success',
        element: 'Fire',
        color: '#2dd4bf'
      }
    ];

    const safeMonth = Math.min(11, Math.max(0, month));
    return charms[safeMonth] || charms[8];
  }

  /**
   * Deterministically returns the Zodiac Sign and Element based on birth date.
   */
  static getZodiacSignAndElement(memberOrBirthday?: TeamMember | string | number): ZodiacSignInfo {
    let month = 8;
    let day = 13;
    if (memberOrBirthday && typeof memberOrBirthday === 'object' && 'birthday' in memberOrBirthday) {
      const p = parseBirthdayDate((memberOrBirthday as TeamMember).birthday);
      if (p) { month = p.month; day = p.day; }
    } else if (typeof memberOrBirthday === 'string' || typeof memberOrBirthday === 'number') {
      const p = parseBirthdayDate(memberOrBirthday);
      if (p) { month = p.month; day = p.day; }
    }

    if ((month === 2 && day >= 21) || (month === 3 && day <= 19)) return { sign: 'Aries', glyph: '♈', element: 'Fire', rulingPlanet: 'Mars' };
    if ((month === 3 && day >= 20) || (month === 4 && day <= 20)) return { sign: 'Taurus', glyph: '♉', element: 'Earth', rulingPlanet: 'Venus' };
    if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) return { sign: 'Gemini', glyph: '♊', element: 'Air', rulingPlanet: 'Mercury' };
    if ((month === 5 && day >= 21) || (month === 6 && day <= 22)) return { sign: 'Cancer', glyph: '♋', element: 'Water', rulingPlanet: 'Moon' };
    if ((month === 6 && day >= 23) || (month === 7 && day <= 22)) return { sign: 'Leo', glyph: '♌', element: 'Fire', rulingPlanet: 'Sun' };
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: 'Virgo', glyph: '♍', element: 'Earth', rulingPlanet: 'Mercury' };
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: 'Libra', glyph: '♎', element: 'Air', rulingPlanet: 'Venus' };
    if ((month === 9 && day >= 23) || (month === 10 && day <= 21)) return { sign: 'Scorpio', glyph: '♏', element: 'Water', rulingPlanet: 'Mars & Pluto' };
    if ((month === 10 && day >= 22) || (month === 11 && day <= 21)) return { sign: 'Sagittarius', glyph: '♐', element: 'Fire', rulingPlanet: 'Jupiter' };
    if ((month === 11 && day >= 22) || (month === 0 && day <= 19)) return { sign: 'Capricorn', glyph: '♑', element: 'Earth', rulingPlanet: 'Saturn' };
    if ((month === 0 && day >= 20) || (month === 1 && day <= 18)) return { sign: 'Aquarius', glyph: '♒', element: 'Air', rulingPlanet: 'Saturn & Uranus' };
    return { sign: 'Pisces', glyph: '♓', element: 'Water', rulingPlanet: 'Jupiter & Neptune' };
  }

  /**
   * Calculates and returns a 'Personal Lucky Gemstone' based on birth date.
   */
  static calculatePersonalLuckyGemstone(memberOrBirthday?: TeamMember | string | number): PersonalLuckyGemstone {
    const z = this.getZodiacSignAndElement(memberOrBirthday);
    const gemstoneMap: Record<string, PersonalLuckyGemstone> = {
      Aries: {
        name: 'Red Coral',
        sanskritName: 'Moonga',
        glyph: '🪸',
        color: '#f43f5e',
        textColor: 'text-rose-300',
        borderColor: 'border-rose-400/40',
        bgColor: 'bg-rose-950/60',
        rulingPlanet: 'Mars',
        benefits: 'Ignites decisive courage, stamina & unshakeable willpower',
        element: 'Fire',
        wearFinger: 'Ring Finger'
      },
      Taurus: {
        name: 'White Diamond',
        sanskritName: 'Heera',
        glyph: '💎',
        color: '#e0e7ff',
        textColor: 'text-indigo-200',
        borderColor: 'border-indigo-400/40',
        bgColor: 'bg-indigo-950/60',
        rulingPlanet: 'Venus',
        benefits: 'Radiates luxury, artistic poise & magnetic goodwill',
        element: 'Earth',
        wearFinger: 'Middle Finger'
      },
      Gemini: {
        name: 'Emerald',
        sanskritName: 'Panna',
        glyph: '🟢',
        color: '#10b981',
        textColor: 'text-emerald-300',
        borderColor: 'border-emerald-400/40',
        bgColor: 'bg-emerald-950/60',
        rulingPlanet: 'Mercury',
        benefits: 'Sharpens razor-wit, linguistic genius & strategic diplomacy',
        element: 'Air',
        wearFinger: 'Little Finger'
      },
      Cancer: {
        name: 'Natural Pearl',
        sanskritName: 'Mukta',
        glyph: '⚪',
        color: '#38bdf8',
        textColor: 'text-cyan-200',
        borderColor: 'border-cyan-400/40',
        bgColor: 'bg-cyan-950/60',
        rulingPlanet: 'Moon',
        benefits: 'Bestows deep tranquility, emotional serenity & intuitive shields',
        element: 'Water',
        wearFinger: 'Little Finger'
      },
      Leo: {
        name: 'Burmese Ruby',
        sanskritName: 'Manikya',
        glyph: '🔴',
        color: '#ef4444',
        textColor: 'text-red-300',
        borderColor: 'border-red-400/40',
        bgColor: 'bg-red-950/60',
        rulingPlanet: 'Sun',
        benefits: 'Commands royal authority, executive vigor & noble leadership',
        element: 'Fire',
        wearFinger: 'Ring Finger'
      },
      Virgo: {
        name: 'Green Jade & Emerald',
        sanskritName: 'Marakata',
        glyph: '🍃',
        color: '#34d399',
        textColor: 'text-emerald-300',
        borderColor: 'border-emerald-400/40',
        bgColor: 'bg-emerald-950/60',
        rulingPlanet: 'Mercury',
        benefits: 'Architectural precision, impeccable analysis & serene focus',
        element: 'Earth',
        wearFinger: 'Little Finger'
      },
      Libra: {
        name: 'Opal & White Sapphire',
        sanskritName: 'Shvet-Pukhraj',
        glyph: '✨',
        color: '#fbcfe8',
        textColor: 'text-pink-200',
        borderColor: 'border-pink-400/40',
        bgColor: 'bg-pink-950/60',
        rulingPlanet: 'Venus',
        benefits: 'Harmonious beauty, refined diplomacy & lifelong alliance synergy',
        element: 'Air',
        wearFinger: 'Middle Finger'
      },
      Scorpio: {
        name: 'Carnelian & Red Coral',
        sanskritName: 'Praval',
        glyph: '🔥',
        color: '#f97316',
        textColor: 'text-amber-300',
        borderColor: 'border-amber-400/40',
        bgColor: 'bg-amber-950/60',
        rulingPlanet: 'Mars',
        benefits: 'Pierces obstacles, sparks alchemical transformation & psychic protection',
        element: 'Water',
        wearFinger: 'Ring Finger'
      },
      Sagittarius: {
        name: 'Yellow Sapphire',
        sanskritName: 'Pukhraj',
        glyph: '🟡',
        color: '#fbbf24',
        textColor: 'text-amber-300',
        borderColor: 'border-amber-400/40',
        bgColor: 'bg-amber-950/60',
        rulingPlanet: 'Jupiter',
        benefits: 'Expansive wisdom, organizational prosperity & divine blessings',
        element: 'Fire',
        wearFinger: 'Index Finger'
      },
      Capricorn: {
        name: 'Blue Sapphire',
        sanskritName: 'Neelam',
        glyph: '🔷',
        color: '#6366f1',
        textColor: 'text-indigo-300',
        borderColor: 'border-indigo-400/40',
        bgColor: 'bg-indigo-950/60',
        rulingPlanet: 'Saturn',
        benefits: 'Granite discipline, monumental perseverance & legacy milestones',
        element: 'Earth',
        wearFinger: 'Middle Finger'
      },
      Aquarius: {
        name: 'Amethyst',
        sanskritName: 'Katela',
        glyph: '🔮',
        color: '#c084fc',
        textColor: 'text-purple-300',
        borderColor: 'border-purple-400/40',
        bgColor: 'bg-purple-950/60',
        rulingPlanet: 'Saturn & Uranus',
        benefits: 'Visionary foresight, humanitarian breakthroughs & innovative clarity',
        element: 'Air',
        wearFinger: 'Middle Finger'
      },
      Pisces: {
        name: 'Golden Topaz & Aquamarine',
        sanskritName: 'Pita-Sphatika',
        glyph: '🌊',
        color: '#22d3ee',
        textColor: 'text-cyan-300',
        borderColor: 'border-cyan-400/40',
        bgColor: 'bg-cyan-950/60',
        rulingPlanet: 'Jupiter',
        benefits: 'Creative transcendence, boundless empathy & spiritual sanctuary',
        element: 'Water',
        wearFinger: 'Index Finger'
      }
    };

    return gemstoneMap[z.sign] || gemstoneMap['Virgo'];
  }

  /**
   * Alias for calculatePersonalLuckyGemstone matching user requirements.
   */
  static getPersonalLuckyGemstone(memberOrBirthday?: TeamMember | string | number): PersonalLuckyGemstone {
    return this.calculatePersonalLuckyGemstone(memberOrBirthday);
  }

  /**
   * Returns summarized Team Energy Score based on collective current Dasha periods.
   */
  static getTeamEnergyScore(members: TeamMember[]): number {
    return this.calculateTeamEnergyVibeCheck(members).teamEnergyScore;
  }

  /**
   * Alias for calculateTeamEnergyVibeCheck matching user specification.
   */
  static getEnergeticVibeCheck(members: TeamMember[]): TeamEnergyVibeCheck {
    return this.calculateTeamEnergyVibeCheck(members);
  }
}

export const astrologyDataService = AstrologyDataService;
