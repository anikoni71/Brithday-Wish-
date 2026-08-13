export const MONTH_NAMES = [
  { short: 'Jan', full: 'January', index: 0 },
  { short: 'Feb', full: 'February', index: 1 },
  { short: 'Mar', full: 'March', index: 2 },
  { short: 'Apr', full: 'April', index: 3 },
  { short: 'May', full: 'May', index: 4 },
  { short: 'Jun', full: 'June', index: 5 },
  { short: 'Jul', full: 'July', index: 6 },
  { short: 'Aug', full: 'August', index: 7 },
  { short: 'Sep', full: 'September', index: 8 },
  { short: 'Oct', full: 'October', index: 9 },
  { short: 'Nov', full: 'November', index: 10 },
  { short: 'Dec', full: 'December', index: 11 },
];

const MONTH_ALIASES: Record<string, number> = {
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
  dec: 11, december: 11,
};

/**
 * Parse any birthday string into month (0-11) and day (1-31).
 * Supported formats:
 * - "4th Aug", "4th August", "4 Aug", "Aug 4th", "August 4", "4-Aug"
 * - "21st Feb", "2nd April", "6th May", "31st May", "13th Jul", "13th Sep", "20th Oct", "21st Dec"
 * - "8/13", "08/13", "8-13", "2026-08-13", "1995-08-13", "2/21", "8/4"
 */
export function parseBirthdayDate(birthdayStr?: string): { month: number; day: number; formatted: string } | null {
  if (!birthdayStr || typeof birthdayStr !== 'string') return null;
  const raw = birthdayStr.trim();
  if (!raw) return null;

  // Clean ordinal suffixes: 1st -> 1, 2nd -> 2, 3rd -> 3, 4th -> 4, etc.
  const cleaned = raw.replace(/(\d+)(st|nd|rd|th)\b/gi, '$1').trim();

  // Pattern 1: ISO date (YYYY-MM-DD or YYYY/MM/DD)
  const isoMatch = cleaned.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (isoMatch) {
    const month = parseInt(isoMatch[2], 10) - 1;
    const day = parseInt(isoMatch[3], 10);
    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      return { month, day, formatted: `${day} ${MONTH_NAMES[month].short}` };
    }
  }

  // Pattern 2: Day Month or Month Day with word month (e.g. "4 Aug", "Aug 4", "4th August", "August 4")
  const wordMatch = cleaned.match(/([a-zA-Z]+)[^a-zA-Z0-9]*(\d+)|(\d+)[^a-zA-Z0-9]*([a-zA-Z]+)/);
  if (wordMatch) {
    const word = (wordMatch[1] || wordMatch[4] || '').toLowerCase();
    const numStr = wordMatch[2] || wordMatch[3] || '';
    const day = parseInt(numStr, 10);

    for (const [alias, monthIdx] of Object.entries(MONTH_ALIASES)) {
      if (word.startsWith(alias) || alias.startsWith(word)) {
        if (day >= 1 && day <= 31) {
          return { month: monthIdx, day, formatted: `${day} ${MONTH_NAMES[monthIdx].short}` };
        }
      }
    }
  }

  // Pattern 3: Numeric M/D or MM/DD or D/M (e.g. "8/13", "8/4", "2/21")
  const numParts = cleaned.split(/[-/.]/);
  if (numParts.length >= 2) {
    const first = parseInt(numParts[0], 10);
    const second = parseInt(numParts[1], 10);

    if (!isNaN(first) && !isNaN(second)) {
      // Standard US format: Month / Day (8/13 -> Month 8, Day 13)
      if (first >= 1 && first <= 12 && second >= 1 && second <= 31) {
        const month = first - 1;
        const day = second;
        return { month, day, formatted: `${day} ${MONTH_NAMES[month].short}` };
      }
      // Alternate format: Day / Month (e.g. 21/2 -> Day 21, Month 2)
      if (second >= 1 && second <= 12 && first >= 1 && first <= 31) {
        const month = second - 1;
        const day = first;
        return { month, day, formatted: `${day} ${MONTH_NAMES[month].short}` };
      }
    }
  }

  return null;
}

/**
 * Returns month index (0-11) or null
 */
export function parseBirthMonth(birthdayStr?: string): number | null {
  const res = parseBirthdayDate(birthdayStr);
  return res ? res.month : null;
}

/**
 * Check if the birthday matches today (or a specific date)
 */
export function checkIsTodayBirthday(birthdayStr?: string, targetDate = new Date()): boolean {
  const parsed = parseBirthdayDate(birthdayStr);
  if (!parsed) return false;

  const currentMonth = targetDate.getMonth(); // 0-11
  const currentDay = targetDate.getDate(); // 1-31

  return parsed.month === currentMonth && parsed.day === currentDay;
}
