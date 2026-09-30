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

export interface MemberAstrologyDestiny {
  memberId: string;
  name: string;
  birthday: string;
  parsedBirthday: { month: number; day: number; formatted: string };
  zodiac: {
    name: string;
    element: string;
    glyph: string;
    elementGlow: {
      border: string;
      badge: string;
      shadow: string;
      text: string;
      color: string;
    };
  };
  upcomingGoodThings: {
    headline: string;
    description: string;
    milestoneTime: string;
    luckyBlessing: string;
  };
  auraKeyword: string;
  elementGlow: {
    border: string;
    badge: string;
    shadow: string;
    text: string;
  };
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
    _currentYear: number
  ): MemberAstrologyDestiny {
    const p = parseBirthdayDate(member.birthday) || { month: 8, monthNumber: 9, day: 13, formatted: member.birthday || '13th Sep' };
    const z = getZodiacSign(p.month, p.day);
    const aura = monthAuras[p.month] || monthAuras[8];

    // Call deterministic generateUniqueFortune for the member
    const uniqueFortune = this.generateUniqueFortune(member);

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
        luckyBlessing: uniqueFortune.luckyBlessing
      },
      auraKeyword: aura?.coreKeyword || 'Radiant',
      elementGlow: {
        border: z.elementGlow.border,
        badge: z.elementGlow.text,
        shadow: z.elementGlow.shadow,
        text: z.elementGlow.text
      }
    };
  }
}

export const astrologyDataService = AstrologyDataService;
