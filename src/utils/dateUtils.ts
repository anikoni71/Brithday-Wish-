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
 * Returns 0-based month index (0-11) or null
 */
export function parseBirthMonth(birthdayStr?: string | number): number | null {
  const res = parseBirthdayDate(birthdayStr);
  return res ? res.month : null;
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

