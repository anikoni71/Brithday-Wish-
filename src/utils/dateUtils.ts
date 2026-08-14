export const MONTH_NAMES = [
  { short: 'Jan', full: 'January', index: 0, monthNumber: 1 },
  { short: 'Feb', full: 'February', index: 1, monthNumber: 2 },
  { short: 'Mar', full: 'March', index: 2, monthNumber: 3 },
  { short: 'Apr', full: 'April', index: 3, monthNumber: 4 },
  { short: 'May', full: 'May', index: 4, monthNumber: 5 },
  { short: 'Jun', full: 'June', index: 5, monthNumber: 6 },
  { short: 'Jul', full: 'July', index: 6, monthNumber: 7 },
  { short: 'Aug', full: 'August', index: 7, monthNumber: 8 },
  { short: 'Sep', full: 'September', index: 8, monthNumber: 9 },
  { short: 'Oct', full: 'October', index: 9, monthNumber: 10 },
  { short: 'Nov', full: 'November', index: 10, monthNumber: 11 },
  { short: 'Dec', full: 'December', index: 11, monthNumber: 12 },
];

export const MONTH_ALIASES: Record<string, number> = {
  jan: 0, january: 0, '1': 0, '01': 0,
  feb: 1, february: 1, '2': 1, '02': 1,
  mar: 2, march: 2, '3': 2, '03': 2,
  apr: 3, april: 3, '4': 3, '04': 3,
  may: 4, '5': 4, '05': 4,
  jun: 5, june: 5, '6': 5, '06': 5,
  jul: 6, july: 6, '7': 6, '07': 6,
  aug: 7, august: 7, '8': 7, '08': 7,
  sep: 8, sept: 8, september: 8, '9': 8, '09': 8,
  oct: 9, october: 9, '10': 9,
  nov: 10, november: 10, '11': 10,
  dec: 11, december: 11, '12': 11,
};

export interface ParsedBirthday {
  month: number;          // 0 - 11 (for JS zero-indexed array access)
  monthNumber: number;    // 1 - 12 (calendar month number)
  day: number;            // 1 - 31
  formatted: string;      // e.g. "13 Aug"
  year?: number;          // optional year if provided
}

/**
 * Parse any Column G birthday string into month (0-11 & 1-12) and day (1-31).
 * Supported formats:
 * - ISO / Full dates: "1992-08-13", "2026-08-13", "13/08/1995", "13-08-1995", "08/13/1992"
 * - Short numeric: "8/13", "08/13", "8-13", "2/21", "8/4", "13/8", "21/2"
 * - Textual & Ordinal: "4th Aug", "4th August", "Aug 4", "August 4", "15 August", "21st Feb", "6-May", "May-06"
 * - Month and Day: "13th Jul", "13th Sep", "20th Oct", "21st Dec", "15-Jan", "10 Oct"
 * - Serial numbers from spreadsheets (e.g. 44800)
 */
export function parseBirthdayDate(birthdayStr?: string | number): ParsedBirthday | null {
  if (birthdayStr === undefined || birthdayStr === null) return null;
  
  // Handle numeric Excel date serial (e.g. 44800)
  if (typeof birthdayStr === 'number' || (!isNaN(Number(birthdayStr)) && Number(birthdayStr) > 20000 && !String(birthdayStr).includes('/'))) {
    const serial = Number(birthdayStr);
    const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
    if (!isNaN(date.getTime())) {
      const month = date.getUTCMonth();
      const day = date.getUTCDate();
      return {
        month,
        monthNumber: month + 1,
        day,
        formatted: `${day} ${MONTH_NAMES[month].short}`,
        year: date.getUTCFullYear()
      };
    }
  }

  const raw = String(birthdayStr).trim();
  if (!raw || raw.toLowerCase() === 'null' || raw.toLowerCase() === 'undefined') return null;

  // Clean ordinal suffixes: 1st -> 1, 2nd -> 2, 3rd -> 3, 4th -> 4, etc.
  const cleaned = raw.replace(/(\d+)(st|nd|rd|th)\b/gi, '$1').replace(/\s+/g, ' ').trim();

  // Pattern 1: ISO date (YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD)
  const isoMatch = cleaned.match(/^(\d{4})[-/. ](\d{1,2})[-/. ](\d{1,2})/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1;
    const day = parseInt(isoMatch[3], 10);
    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      return { month, monthNumber: month + 1, day, formatted: `${day} ${MONTH_NAMES[month].short}`, year };
    }
  }

  // Pattern 2: Full DD/MM/YYYY or MM/DD/YYYY (4-digit year at end)
  const fullDateMatch = cleaned.match(/^(\d{1,2})[-/. ](\d{1,2})[-/. ](\d{4})/);
  if (fullDateMatch) {
    const first = parseInt(fullDateMatch[1], 10);
    const second = parseInt(fullDateMatch[2], 10);
    const year = parseInt(fullDateMatch[3], 10);

    // If first > 12, it must be DD/MM/YYYY
    if (first > 12 && first <= 31 && second >= 1 && second <= 12) {
      const month = second - 1;
      const day = first;
      return { month, monthNumber: month + 1, day, formatted: `${day} ${MONTH_NAMES[month].short}`, year };
    }
    // Standard MM/DD/YYYY or DD/MM/YYYY
    if (first >= 1 && first <= 12 && second >= 1 && second <= 31) {
      const month = first - 1;
      const day = second;
      return { month, monthNumber: month + 1, day, formatted: `${day} ${MONTH_NAMES[month].short}`, year };
    }
  }

  // Pattern 3: Textual month e.g. "15 August", "August 15", "4 Aug", "Aug 4", "21 Feb", "6-May", "May-06"
  const textMatch = cleaned.match(/([a-zA-Z]+)[^a-zA-Z0-9]*(\d{1,2})|(\d{1,2})[^a-zA-Z0-9]*([a-zA-Z]+)/);
  if (textMatch) {
    const word = (textMatch[1] || textMatch[4] || '').toLowerCase().trim();
    const dayStr = textMatch[2] || textMatch[3] || '';
    const day = parseInt(dayStr, 10);

    for (const [alias, monthIdx] of Object.entries(MONTH_ALIASES)) {
      if (word.startsWith(alias) || alias.startsWith(word)) {
        if (day >= 1 && day <= 31) {
          return {
            month: monthIdx,
            monthNumber: monthIdx + 1,
            day,
            formatted: `${day} ${MONTH_NAMES[monthIdx].short}`
          };
        }
      }
    }
  }

  // Pattern 4: Numeric M/D or MM/DD or D/M (e.g. "8/13", "8/4", "2/21", "13/8")
  const numParts = cleaned.split(/[-/. ]/);
  if (numParts.length >= 2) {
    const first = parseInt(numParts[0], 10);
    const second = parseInt(numParts[1], 10);

    if (!isNaN(first) && !isNaN(second)) {
      // If first > 12, it's Day / Month (e.g. 13/8 or 21/2)
      if (first > 12 && first <= 31 && second >= 1 && second <= 12) {
        const month = second - 1;
        const day = first;
        return { month, monthNumber: month + 1, day, formatted: `${day} ${MONTH_NAMES[month].short}` };
      }
      // Standard US format: Month / Day (8/13 -> Month 8, Day 13)
      if (first >= 1 && first <= 12 && second >= 1 && second <= 31) {
        const month = first - 1;
        const day = second;
        return { month, monthNumber: month + 1, day, formatted: `${day} ${MONTH_NAMES[month].short}` };
      }
      // Fallback: second is month (e.g. 4/8 when 4th Aug)
      if (second >= 1 && second <= 12 && first >= 1 && first <= 31) {
        const month = second - 1;
        const day = first;
        return { month, monthNumber: month + 1, day, formatted: `${day} ${MONTH_NAMES[month].short}` };
      }
    }
  }

  return null;
}

/**
 * Returns 0-based month index (0-11) or null.
 * Standardized across all chart visualizers, tables, and summary cards.
 */
export function getBirthMonth(birthdayStr?: string | number): number | null {
  const res = parseBirthdayDate(birthdayStr);
  return res !== null ? res.month : null;
}

/**
 * Alias for getBirthMonth (0-11)
 */
export function parseBirthMonth(birthdayStr?: string | number): number | null {
  return getBirthMonth(birthdayStr);
}

/**
 * Returns 1-based calendar month number (1-12) or null
 */
export function parseBirthMonth1Based(birthdayStr?: string | number): number | null {
  const res = parseBirthdayDate(birthdayStr);
  return res ? res.monthNumber : null;
}

/**
 * Check if the birthday matches today (or a specific date)
 */
export function checkIsTodayBirthday(birthdayStr?: string | number, targetDate = new Date()): boolean {
  const parsed = parseBirthdayDate(birthdayStr);
  if (!parsed) return false;

  const currentMonth = targetDate.getMonth(); // 0-11
  const currentDay = targetDate.getDate();     // 1-31

  return parsed.month === currentMonth && parsed.day === currentDay;
}

/**
 * Calculate the number of calendar days until the member's next birthday.
 * Returns:
 * - 0 if the birthday is today
 * - 1 if the birthday is tomorrow
 * - 2..365 for upcoming days
 * - null if date is unparseable
 */
export function getDaysUntilBirthday(birthdayStr?: string | number, baseDate = new Date()): number | null {
  const parsed = parseBirthdayDate(birthdayStr);
  if (!parsed) return null;

  const today = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const targetYear = today.getFullYear();
  let nextBday = new Date(targetYear, parsed.month, parsed.day);

  // If this year's birthday has already passed, check next year
  if (nextBday.getTime() < today.getTime()) {
    nextBday = new Date(targetYear + 1, parsed.month, parsed.day);
  }

  const diffTime = nextBday.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export interface UpcomingBirthdayInfo {
  isToday: boolean;
  isTomorrow: boolean;
  isDueSoon: boolean;
  daysRemaining: number | null;
  badgeLabel: string;
  normalizedDate: string;
}

/**
 * Returns a clean, normalized standard calendar string (e.g. "6 May" or "13 Aug")
 * from any arbitrary text format ("6th May", "21st Feb", "08/13", "8/4", "6-May").
 */
export function normalizeBirthdayString(birthdayStr?: string | number): string {
  const parsed = parseBirthdayDate(birthdayStr);
  if (!parsed) return typeof birthdayStr === 'string' ? birthdayStr.trim() : '';
  return parsed.formatted;
}

/**
 * Check if the birthday is tomorrow (1 day advance alert)
 */
export function checkIsTomorrowBirthday(birthdayStr?: string | number, baseDate = new Date()): boolean {
  const days = getDaysUntilBirthday(birthdayStr, baseDate);
  return days === 1;
}

/**
 * Dynamic Message Personalizer:
 * Resolves placeholders like {Name}, {Designation}, {Department}, {ID}, {Birthday}
 * inside Column K wishing message templates.
 */
export function resolveMessagePlaceholders(
  template: string,
  member: {
    name?: string;
    designation?: string;
    department?: string;
    id?: string;
    sl?: string;
    birthday?: string;
  }
): string {
  if (!template) {
    const name = member.name || 'Colleague';
    return `Happy Birthday, ${name}! Wishing you a great day from the IE Central Team. 🎉`;
  }

  const name = member.name || 'Colleague';
  const designation = member.designation || 'IE Central Team Colleague';
  const department = member.department || 'Industrial Engineering Central';
  const id = member.id || member.sl || '';
  const birthday = normalizeBirthdayString(member.birthday) || member.birthday || '';

  let resolved = template
    .replace(/\{Name\}/gi, name)
    .replace(/\{Designation\}/gi, designation)
    .replace(/\{Department\}/gi, department)
    .replace(/\{Dept\}/gi, department)
    .replace(/\{ID\}/gi, id)
    .replace(/\{Birthday\}/gi, birthday);

  return resolved;
}

/**
 * Returns structured upcoming birthday status (e.g. whether it falls within the next 7 days).
 */
export function getUpcomingBirthdayInfo(birthdayStr?: string | number, withinDays = 7, baseDate = new Date()): UpcomingBirthdayInfo {
  const parsed = parseBirthdayDate(birthdayStr);
  const normalizedDate = parsed ? parsed.formatted : (typeof birthdayStr === 'string' ? birthdayStr : '');
  const days = getDaysUntilBirthday(birthdayStr, baseDate);
  
  if (days === null) {
    return {
      isToday: false,
      isTomorrow: false,
      isDueSoon: false,
      daysRemaining: null,
      badgeLabel: '',
      normalizedDate
    };
  }

  const isToday = days === 0;
  const isTomorrow = days === 1;
  const isDueSoon = days > 0 && days <= withinDays;
  let badgeLabel = '';

  if (isToday) {
    badgeLabel = 'Today';
  } else if (isTomorrow) {
    badgeLabel = 'Tomorrow (1-Day Alert)';
  } else if (isDueSoon) {
    badgeLabel = `In ${days} days`;
  }

  return {
    isToday,
    isTomorrow,
    isDueSoon,
    daysRemaining: days,
    badgeLabel,
    normalizedDate
  };
}

export interface CelebrantPlanningItem {
  id: string;
  sl: string;
  name: string;
  designation: string;
  department: string;
  birthday: string;
  normalizedBirthday: string;
  daysRemaining: number;
  isTomorrow: boolean;
  timeframeLabel: string; // e.g. "Tomorrow" or "In 2 days"
  whatsapp: string;
  hasWhatsApp: boolean;
  email: string;
  hasEmail: boolean;
  wishingMessage: string;
  hasCustomMessage: boolean;
  resolvedMessage: string;
  readyForZeroTouch: boolean;
}

/**
 * Returns upcoming celebrants within the given window (default: 1-3 days or 7 days)
 * with a full verification checklist for Admin Advance Planning.
 */
export function getUpcomingCelebrantsPlanningList(
  members: any[],
  maxDays = 3,
  baseDate = new Date()
): CelebrantPlanningItem[] {
  const result: CelebrantPlanningItem[] = [];

  for (const m of members) {
    const days = getDaysUntilBirthday(m.birthday, baseDate);
    if (days !== null && days >= 0 && days <= maxDays) {
      const isTomorrow = days === 1;
      const timeframeLabel = days === 0 ? 'Today' : isTomorrow ? 'Tomorrow' : `In ${days} days`;
      const cleanPhone = m.whatsapp ? String(m.whatsapp).replace(/\D/g, '') : '';
      const hasWhatsApp = cleanPhone.length >= 10;
      const hasEmail = Boolean(m.email && m.email.includes('@'));
      const hasCustomMessage = Boolean(m.wishingMessage && String(m.wishingMessage).trim().length > 0);
      const resolved = resolveMessagePlaceholders(m.wishingMessage, m);

      result.push({
        id: m.id || m.sl || '',
        sl: m.sl || '',
        name: m.name || 'Unknown',
        designation: m.designation || 'Team Member',
        department: m.department || 'IE Central',
        birthday: m.birthday || '',
        normalizedBirthday: normalizeBirthdayString(m.birthday) || m.birthday || '',
        daysRemaining: days,
        isTomorrow,
        timeframeLabel,
        whatsapp: m.whatsapp || m.mobile || '',
        hasWhatsApp,
        email: m.email || '',
        hasEmail,
        wishingMessage: m.wishingMessage || '',
        hasCustomMessage,
        resolvedMessage: resolved,
        readyForZeroTouch: hasWhatsApp && hasCustomMessage,
      });
    }
  }

  // Sort by days remaining (ascending)
  return result.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

export { GLOBAL_SPECIAL_DAYS, getSpecialDaysForYear, type SpecialDay } from '../data/specialDays';
import { GLOBAL_SPECIAL_DAYS, getSpecialDaysForYear, SpecialDay } from '../data/specialDays';

/**
 * Find exact special day(s) for a given month index (0-11) and day (1-31).
 */
export function getSpecialDaysForDate(month: number, day: number, year: number = new Date().getFullYear()): SpecialDay[] {
  const daysForYear = getSpecialDaysForYear(year);
  return daysForYear.filter((sd) => sd.month === month && sd.day === day);
}

/**
 * Returns any special days that fall within a given month (0-11).
 */
export function getSpecialDaysInMonth(month: number, year: number = new Date().getFullYear()): SpecialDay[] {
  const daysForYear = getSpecialDaysForYear(year);
  return daysForYear.filter((sd) => sd.month === month).sort((a, b) => a.day - b.day);
}

export interface BirthdaySpecialDayMatch {
  specialDay: SpecialDay;
  relationship: 'exact' | 'same_week' | 'same_month';
  label: string;
  subText: string;
  distanceDays: number; // 0 for exact match, negative/positive for difference
}

/**
 * Checks if a celebrant's birthday coincides with or falls in the same week (+/- 3 days)
 * as a global/national special day or festive holiday.
 */
export function getNearbySpecialDayForBirthday(
  birthdayStr?: string | number,
  windowDays: number = 3,
  targetYear: number = new Date().getFullYear()
): BirthdaySpecialDayMatch | null {
  const parsed = parseBirthdayDate(birthdayStr);
  if (!parsed) return null;

  const bDayRef = new Date(targetYear, parsed.month, parsed.day);
  const daysForYear = getSpecialDaysForYear(targetYear);

  let bestMatch: BirthdaySpecialDayMatch | null = null;
  let minDistance = Infinity;

  for (const sd of daysForYear) {
    const sdRef = new Date(targetYear, sd.month, sd.day);
    const diffMs = sdRef.getTime() - bDayRef.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const absDiff = Math.abs(diffDays);

    if (absDiff <= windowDays && absDiff < minDistance) {
      minDistance = absDiff;
      if (absDiff === 0) {
        bestMatch = {
          specialDay: sd,
          relationship: 'exact',
          label: `${sd.icon} ${sd.shortName}`,
          subText: `Coincides with ${sd.name}`,
          distanceDays: 0,
        };
      } else {
        bestMatch = {
          specialDay: sd,
          relationship: 'same_week',
          label: `${sd.icon} ${sd.shortName} Week`,
          subText: `${sd.name} (${sd.dateFormatted})`,
          distanceDays: diffDays,
        };
      }
    }
  }

  return bestMatch;
}

export interface UpcomingSpecialDayItem extends SpecialDay {
  daysRemaining: number;
  isToday: boolean;
  isTomorrow: boolean;
  timeframeLabel: string;
  targetYear: number;
}

/**
 * Returns upcoming global special days & festive holidays from baseDate within lookahead window.
 */
export function getUpcomingGlobalSpecialDays(
  baseDate: Date = new Date(),
  limit: number = 6,
  lookaheadDays: number = 60
): UpcomingSpecialDayItem[] {
  const baseYear = baseDate.getFullYear();
  const startOfDay = new Date(baseYear, baseDate.getMonth(), baseDate.getDate());

  const candidates: UpcomingSpecialDayItem[] = [];

  for (const year of [baseYear, baseYear + 1]) {
    const daysForYear = getSpecialDaysForYear(year);
    for (const sd of daysForYear) {
      const eventDate = new Date(year, sd.month, sd.day);
      const diffMs = eventDate.getTime() - startOfDay.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= lookaheadDays) {
        const isToday = diffDays === 0;
        const isTomorrow = diffDays === 1;
        const timeframeLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : `In ${diffDays} days`;

        // avoid duplicate events across year boundary
        if (!candidates.some(c => c.id === sd.id && c.targetYear === year)) {
          candidates.push({
            ...sd,
            daysRemaining: diffDays,
            isToday,
            isTomorrow,
            timeframeLabel,
            targetYear: year,
          });
        }
      }
    }
  }

  candidates.sort((a, b) => a.daysRemaining - b.daysRemaining);
  return candidates.slice(0, limit);
}
