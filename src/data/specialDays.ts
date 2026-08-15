export interface SpecialDay {
  id: string;
  name: string;
  shortName: string;
  dateFormatted: string; // e.g. "1 Jan", "21 Feb"
  month: number; // 0-indexed: 0 = Jan, 11 = Dec
  day: number; // 1-31
  icon: string;
  category: 'international' | 'national' | 'festive' | 'observance' | 'professional';
  badgeColor: string; // Tailwind color class combo
  description: string;
  greetingTheme: string;
  isFloating?: boolean; // Whether the date moves annually (e.g. Eid, Mother's Day)
}

/**
 * Calculates the Nth occurrence of a weekday in a given month and year.
 * @param year e.g. 2026
 * @param month 0-11
 * @param weekday 0=Sun, 1=Mon, ..., 6=Sat
 * @param nth 1st, 2nd, etc.
 */
export function getNthWeekdayOfMonth(year: number, month: number, weekday: number, nth: number): number {
  let count = 0;
  for (let day = 1; day <= 31; day++) {
    const d = new Date(year, month, day);
    if (d.getMonth() !== month) break;
    if (d.getDay() === weekday) {
      count++;
      if (count === nth) return day;
    }
  }
  return 1;
}

/**
 * Verified Lunar / Floating holidays reference map by year (2024 to 2035)
 */
export const FLOATING_HOLIDAY_SCHEDULES: Record<number, Record<string, { month: number; day: number; dateFormatted: string }>> = {
  2024: {
    'eid-ul-fitr': { month: 3, day: 10, dateFormatted: '10 Apr' },
    'eid-ul-adha': { month: 5, day: 17, dateFormatted: '17 Jun' },
    'mother-day': { month: 4, day: 12, dateFormatted: '12 May' },
    'father-day': { month: 5, day: 16, dateFormatted: '16 Jun' },
    'friendship-day': { month: 7, day: 4, dateFormatted: '4 Aug' },
  },
  2025: {
    'eid-ul-fitr': { month: 2, day: 31, dateFormatted: '31 Mar' },
    'eid-ul-adha': { month: 5, day: 7, dateFormatted: '7 Jun' },
    'mother-day': { month: 4, day: 11, dateFormatted: '11 May' }, // 2nd Sunday of May
    'father-day': { month: 5, day: 15, dateFormatted: '15 Jun' }, // 3rd Sunday of Jun
    'friendship-day': { month: 7, day: 3, dateFormatted: '3 Aug' }, // 1st Sunday of Aug
  },
  2026: {
    'eid-ul-fitr': { month: 2, day: 20, dateFormatted: '20 Mar' },
    'eid-ul-adha': { month: 4, day: 27, dateFormatted: '27 May' },
    'mother-day': { month: 4, day: 10, dateFormatted: '10 May' }, // 2nd Sunday of May
    'father-day': { month: 5, day: 21, dateFormatted: '21 Jun' }, // 3rd Sunday of Jun
    'friendship-day': { month: 7, day: 2, dateFormatted: '2 Aug' }, // 1st Sunday of Aug
  },
  2027: {
    'eid-ul-fitr': { month: 2, day: 10, dateFormatted: '10 Mar' },
    'eid-ul-adha': { month: 4, day: 16, dateFormatted: '16 May' },
    'mother-day': { month: 4, day: 9, dateFormatted: '9 May' }, // 2nd Sunday of May
    'father-day': { month: 5, day: 20, dateFormatted: '20 Jun' }, // 3rd Sunday of Jun
    'friendship-day': { month: 7, day: 1, dateFormatted: '1 Aug' }, // 1st Sunday of Aug
  },
  2028: {
    'eid-ul-fitr': { month: 1, day: 27, dateFormatted: '27 Feb' },
    'eid-ul-adha': { month: 4, day: 5, dateFormatted: '5 May' },
    'mother-day': { month: 4, day: 14, dateFormatted: '14 May' },
    'father-day': { month: 5, day: 18, dateFormatted: '18 Jun' },
    'friendship-day': { month: 7, day: 6, dateFormatted: '6 Aug' },
  },
  2029: {
    'eid-ul-fitr': { month: 1, day: 15, dateFormatted: '15 Feb' },
    'eid-ul-adha': { month: 3, day: 24, dateFormatted: '24 Apr' },
    'mother-day': { month: 4, day: 13, dateFormatted: '13 May' },
    'father-day': { month: 5, day: 17, dateFormatted: '17 Jun' },
    'friendship-day': { month: 7, day: 5, dateFormatted: '5 Aug' },
  },
  2030: {
    'eid-ul-fitr': { month: 1, day: 5, dateFormatted: '5 Feb' },
    'eid-ul-adha': { month: 3, day: 14, dateFormatted: '14 Apr' },
    'mother-day': { month: 4, day: 12, dateFormatted: '12 May' },
    'father-day': { month: 5, day: 16, dateFormatted: '16 Jun' },
    'friendship-day': { month: 7, day: 4, dateFormatted: '4 Aug' },
  },
  2031: {
    'eid-ul-fitr': { month: 0, day: 25, dateFormatted: '25 Jan' },
    'eid-ul-adha': { month: 3, day: 3, dateFormatted: '3 Apr' },
    'mother-day': { month: 4, day: 11, dateFormatted: '11 May' },
    'father-day': { month: 5, day: 15, dateFormatted: '15 Jun' },
    'friendship-day': { month: 7, day: 3, dateFormatted: '3 Aug' },
  },
  2032: {
    'eid-ul-fitr': { month: 0, day: 14, dateFormatted: '14 Jan' },
    'eid-ul-adha': { month: 2, day: 22, dateFormatted: '22 Mar' },
    'mother-day': { month: 4, day: 9, dateFormatted: '9 May' },
    'father-day': { month: 5, day: 20, dateFormatted: '20 Jun' },
    'friendship-day': { month: 7, day: 1, dateFormatted: '1 Aug' },
  },
  2033: {
    'eid-ul-fitr': { month: 0, day: 2, dateFormatted: '2 Jan' },
    'eid-ul-adha': { month: 2, day: 11, dateFormatted: '11 Mar' },
    'mother-day': { month: 4, day: 8, dateFormatted: '8 May' },
    'father-day': { month: 5, day: 19, dateFormatted: '19 Jun' },
    'friendship-day': { month: 7, day: 7, dateFormatted: '7 Aug' },
  },
  2034: {
    'eid-ul-fitr': { month: 11, day: 22, dateFormatted: '22 Dec' },
    'eid-ul-adha': { month: 2, day: 1, dateFormatted: '1 Mar' },
    'mother-day': { month: 4, day: 14, dateFormatted: '14 May' },
    'father-day': { month: 5, day: 18, dateFormatted: '18 Jun' },
    'friendship-day': { month: 7, day: 6, dateFormatted: '6 Aug' },
  },
  2035: {
    'eid-ul-fitr': { month: 11, day: 12, dateFormatted: '12 Dec' },
    'eid-ul-adha': { month: 1, day: 19, dateFormatted: '19 Feb' },
    'mother-day': { month: 4, day: 13, dateFormatted: '13 May' },
    'father-day': { month: 5, day: 17, dateFormatted: '17 Jun' },
    'friendship-day': { month: 7, day: 5, dateFormatted: '5 Aug' },
  }
};

export const GLOBAL_SPECIAL_DAYS: SpecialDay[] = [
  {
    id: 'new-year-day',
    name: "New Year's Day",
    shortName: "New Year",
    dateFormatted: "1 Jan",
    month: 0,
    day: 1,
    icon: "🎉",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    description: "First day of the year in modern Gregorian calendar.",
    greetingTheme: "New Year joy, fresh beginnings, and ambitious annual resolutions."
  },
  {
    id: 'world-logic-day',
    name: "World Logic Day",
    shortName: "Logic Day",
    dateFormatted: "14 Jan",
    month: 0,
    day: 14,
    icon: "🧠",
    category: "observance",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
    description: "Celebration of intellectual discipline, engineering logic and science.",
    greetingTheme: "Sharp problem-solving and systematic engineering precision."
  },
  {
    id: 'valentine-day',
    name: "Valentine's Day",
    shortName: "Valentine's Day",
    dateFormatted: "14 Feb",
    month: 1,
    day: 14,
    icon: "❤️",
    category: "festive",
    badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
    description: "International celebration of love, friendship, and appreciation.",
    greetingTheme: "Warmth, kindness, camaraderie, and team appreciation."
  },
  {
    id: 'mother-language-day',
    name: "International Mother Language Day",
    shortName: "Language Day",
    dateFormatted: "21 Feb",
    month: 1,
    day: 21,
    icon: "🇧🇩",
    category: "national",
    badgeColor: "bg-slate-900 text-emerald-300 border-slate-700",
    description: "Ekushey February & UNESCO International Mother Language Day.",
    greetingTheme: "Cultural heritage, pride, diversity, and linguistic harmony."
  },
  {
    id: 'women-day',
    name: "International Women's Day",
    shortName: "Women's Day",
    dateFormatted: "8 Mar",
    month: 2,
    day: 8,
    icon: "🌸",
    category: "international",
    badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
    description: "Global celebration of women's achievements, leadership, and equality.",
    greetingTheme: "Inspiration, empowering leadership, and outstanding excellence."
  },
  {
    id: 'eid-ul-fitr',
    name: "Eid-ul-Fitr (Holy Festival)",
    shortName: "Eid-ul-Fitr",
    dateFormatted: "20 Mar",
    month: 2,
    day: 20,
    icon: "🌙",
    category: "festive",
    badgeColor: "bg-emerald-100 text-emerald-950 border-emerald-300 font-bold",
    description: "Holy festival of joy, peace, family gatherings, and feast.",
    greetingTheme: "Eid Mubarak blessings, prosperity, happiness, and peace.",
    isFloating: true,
  },
  {
    id: 'happiness-day',
    name: "International Day of Happiness",
    shortName: "Day of Happiness",
    dateFormatted: "20 Mar",
    month: 2,
    day: 20,
    icon: "😊",
    category: "observance",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    description: "UN International Day of Happiness recognizing well-being.",
    greetingTheme: "Smiling faces, joyful workplace vibes, and positive energy."
  },
  {
    id: 'bangladesh-independence-day',
    name: "Bangladesh Independence Day",
    shortName: "Independence Day",
    dateFormatted: "26 Mar",
    month: 2,
    day: 26,
    icon: "🇧🇩",
    category: "national",
    badgeColor: "bg-red-50 text-red-950 border-red-300 font-bold",
    description: "National Day of Bangladesh celebrating sovereignty and victory.",
    greetingTheme: "National patriotism, unity, courage, and pride."
  },
  {
    id: 'world-health-day',
    name: "World Health Day",
    shortName: "World Health Day",
    dateFormatted: "7 Apr",
    month: 3,
    day: 7,
    icon: "🩺",
    category: "observance",
    badgeColor: "bg-teal-100 text-teal-900 border-teal-300",
    description: "Global health awareness sponsored by WHO.",
    greetingTheme: "Vibrant wellness, radiant health, and active vitality."
  },
  {
    id: 'pohela-boishakh',
    name: "Pohela Boishakh (Bengali New Year)",
    shortName: "Bengali New Year",
    dateFormatted: "14 Apr",
    month: 3,
    day: 14,
    icon: "🌾",
    category: "national",
    badgeColor: "bg-amber-100 text-red-900 border-amber-400 font-bold",
    description: "Traditional first day of the Bengali calendar (Shubho Noboborsho).",
    greetingTheme: "Shubho Noboborsho, festive traditions, color, and prosperity."
  },
  {
    id: 'earth-day',
    name: "Earth Day",
    shortName: "Earth Day",
    dateFormatted: "22 Apr",
    month: 3,
    day: 22,
    icon: "🌍",
    category: "international",
    badgeColor: "bg-green-100 text-green-900 border-green-300",
    description: "International celebration of environmental protection and sustainability.",
    greetingTheme: "Green thinking, sustainability, and harmony with nature."
  },
  {
    id: 'may-day',
    name: "International Workers' Day (May Day)",
    shortName: "May Day",
    dateFormatted: "1 May",
    month: 4,
    day: 1,
    icon: "🛠️",
    category: "international",
    badgeColor: "bg-rose-100 text-rose-950 border-rose-300",
    description: "Celebration of laborers and the working classes worldwide.",
    greetingTheme: "Dedication, hard work, engineering craftsmanship, and solidarity."
  },
  {
    id: 'mother-day',
    name: "Mother's Day",
    shortName: "Mother's Day",
    dateFormatted: "10 May",
    month: 4,
    day: 10,
    icon: "👩‍👧",
    category: "festive",
    badgeColor: "bg-pink-100 text-pink-900 border-pink-300",
    description: "Celebration honoring mothers, motherhood, and maternal bonds.",
    greetingTheme: "Unconditional love, gratitude, maternal blessing, and warmth.",
    isFloating: true,
  },
  {
    id: 'eid-ul-adha',
    name: "Eid-ul-Adha (Feast of Sacrifice)",
    shortName: "Eid-ul-Adha",
    dateFormatted: "27 May",
    month: 4,
    day: 27,
    icon: "🌙",
    category: "festive",
    badgeColor: "bg-emerald-100 text-emerald-950 border-emerald-300 font-bold",
    description: "Feast of Sacrifice, devotion, compassion, and generosity.",
    greetingTheme: "Sacrifice, mutual compassion, togetherness, and joy.",
    isFloating: true,
  },
  {
    id: 'environment-day',
    name: "World Environment Day",
    shortName: "Environment Day",
    dateFormatted: "5 Jun",
    month: 5,
    day: 5,
    icon: "🌱",
    category: "observance",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    description: "Global day for encouraging worldwide awareness and environmental action.",
    greetingTheme: "Eco-conscious innovation, nature preservation, and vitality."
  },
  {
    id: 'father-day',
    name: "Father's Day",
    shortName: "Father's Day",
    dateFormatted: "21 Jun",
    month: 5,
    day: 21,
    icon: "👨‍👧",
    category: "festive",
    badgeColor: "bg-sky-100 text-sky-900 border-sky-300",
    description: "Global celebration honoring fathers, fatherhood, and guidance.",
    greetingTheme: "Strength, fatherly mentorship, wisdom, and steadfast support.",
    isFloating: true,
  },
  {
    id: 'productivity-day',
    name: "World Productivity & Efficiency Day",
    shortName: "Productivity Day",
    dateFormatted: "20 Jun",
    month: 5,
    day: 20,
    icon: "⚡",
    category: "professional",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-300",
    description: "Honoring Industrial Engineering efficiency, Kaizen, and optimization.",
    greetingTheme: "Process optimization, lean efficiency, and operational excellence."
  },
  {
    id: 'friendship-day',
    name: "International Friendship Day",
    shortName: "Friendship Day",
    dateFormatted: "30 Jul",
    month: 6,
    day: 30,
    icon: "🤝",
    category: "festive",
    badgeColor: "bg-yellow-100 text-yellow-900 border-yellow-400",
    description: "UN day celebrating the power of trust and friendship.",
    greetingTheme: "Team bonding, trust, camaraderie, and lifelong camaraderie."
  },
  {
    id: 'youth-day',
    name: "International Youth Day",
    shortName: "Youth Day",
    dateFormatted: "12 Aug",
    month: 7,
    day: 12,
    icon: "🌟",
    category: "international",
    badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
    description: "Empowering youth leadership, ingenuity, and future innovators.",
    greetingTheme: "Energy, youthful creativity, and fearless innovation."
  },
  {
    id: 'humanitarian-day',
    name: "World Humanitarian Day",
    shortName: "Humanitarian Day",
    dateFormatted: "19 Aug",
    month: 7,
    day: 19,
    icon: "🤝",
    category: "international",
    badgeColor: "bg-teal-100 text-teal-900 border-teal-300",
    description: "Honoring humanitarians who provide life-saving assistance worldwide.",
    greetingTheme: "Empathy, selflessness, community service, and uplifting others."
  },
  {
    id: 'engineers-day',
    name: "World Industrial & Systems Engineers Day",
    shortName: "IE Engineers Day",
    dateFormatted: "15 Sep",
    month: 8,
    day: 15,
    icon: "⚙️",
    category: "professional",
    badgeColor: "bg-slate-900 text-amber-300 border-slate-700 font-bold",
    description: "Special recognition for Industrial Engineers, systems thinkers, and innovators.",
    greetingTheme: "Engineering excellence, workflow innovation, and benchmark achievements."
  },
  {
    id: 'peace-day',
    name: "International Day of Peace",
    shortName: "Peace Day",
    dateFormatted: "21 Sep",
    month: 8,
    day: 21,
    icon: "🕊️",
    category: "observance",
    badgeColor: "bg-blue-50 text-blue-900 border-blue-200",
    description: "Global day dedicated to world peace and non-violence.",
    greetingTheme: "Serenity, balance, peaceful collaboration, and mutual goodwill."
  },
  {
    id: 'teachers-day',
    name: "World Teachers' & Mentors' Day",
    shortName: "Teachers' Day",
    dateFormatted: "5 Oct",
    month: 9,
    day: 5,
    icon: "📚",
    category: "international",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    description: "Recognizing the vital role of teachers, trainers, and industrial coaches.",
    greetingTheme: "Wisdom, coaching impact, guidance, and continuous learning."
  },
  {
    id: 'standards-day',
    name: "World Standards & Quality Day",
    shortName: "Quality Day",
    dateFormatted: "14 Oct",
    month: 9,
    day: 14,
    icon: "📐",
    category: "professional",
    badgeColor: "bg-cyan-100 text-cyan-900 border-cyan-300",
    description: "Celebration of international standardized practices and quality control.",
    greetingTheme: "High quality standards, zero defects, and flawless precision."
  },
  {
    id: 'halloween',
    name: "Halloween",
    shortName: "Halloween",
    dateFormatted: "31 Oct",
    month: 9,
    day: 31,
    icon: "🎃",
    category: "festive",
    badgeColor: "bg-orange-100 text-orange-950 border-orange-300",
    description: "All Hallows' Eve celebration filled with festive fun and treats.",
    greetingTheme: "Fun thrills, festive sweets, and lively team spirit."
  },
  {
    id: 'mens-day',
    name: "International Men's Day",
    shortName: "Men's Day",
    dateFormatted: "19 Nov",
    month: 10,
    day: 19,
    icon: "💼",
    category: "international",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
    description: "Recognizing men's contributions, positive role models, and wellbeing.",
    greetingTheme: "Leadership, integrity, dedicated brotherhood, and resilience."
  },
  {
    id: 'children-day',
    name: "Universal Children's Day",
    shortName: "Children's Day",
    dateFormatted: "20 Nov",
    month: 10,
    day: 20,
    icon: "🎈",
    category: "international",
    badgeColor: "bg-pink-100 text-pink-900 border-pink-300",
    description: "Promoting international togetherness, awareness among children worldwide.",
    greetingTheme: "Childlike curiosity, bright hopes, playfulness, and family warmth."
  },
  {
    id: 'human-rights-day',
    name: "Human Rights Day",
    shortName: "Human Rights Day",
    dateFormatted: "10 Dec",
    month: 11,
    day: 10,
    icon: "🕊️",
    category: "international",
    badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
    description: "Commemorating the adoption of the Universal Declaration of Human Rights.",
    greetingTheme: "Dignity, equality, mutual respect, and fairness in all endeavors."
  },
  {
    id: 'bangladesh-victory-day',
    name: "Bangladesh Victory Day (Bijoy Dibos)",
    shortName: "Victory Day",
    dateFormatted: "16 Dec",
    month: 11,
    day: 16,
    icon: "🇧🇩",
    category: "national",
    badgeColor: "bg-emerald-900 text-red-300 border-emerald-700 font-bold",
    description: "Commemoration of the victory of allied forces in the Liberation War.",
    greetingTheme: "Victory pride, liberation courage, and glory for the motherland."
  },
  {
    id: 'christmas-day',
    name: "Christmas Day",
    shortName: "Christmas",
    dateFormatted: "25 Dec",
    month: 11,
    day: 25,
    icon: "🎄",
    category: "festive",
    badgeColor: "bg-red-100 text-red-950 border-red-400 font-bold",
    description: "Global celebration of peace, family gatherings, gifts, and goodwill.",
    greetingTheme: "Merry Christmas blessings, heartfelt peace, and family joy."
  },
  {
    id: 'new-year-eve',
    name: "New Year's Eve",
    shortName: "New Year's Eve",
    dateFormatted: "31 Dec",
    month: 11,
    day: 31,
    icon: "✨",
    category: "festive",
    badgeColor: "bg-indigo-900 text-amber-300 border-indigo-700 font-bold",
    description: "Countdown to the new year with grand celebrations and reflections.",
    greetingTheme: "Year-end triumphs, grand countdowns, and soaring aspirations."
  }
];

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Normalizes and calculates accurate SpecialDay object for any given year.
 */
export function getSpecialDaysForYear(targetYear: number): SpecialDay[] {
  const scheduleForYear = FLOATING_HOLIDAY_SCHEDULES[targetYear];

  return GLOBAL_SPECIAL_DAYS.map((sd) => {
    if (sd.isFloating) {
      if (scheduleForYear && scheduleForYear[sd.id]) {
        const override = scheduleForYear[sd.id];
        return {
          ...sd,
          month: override.month,
          day: override.day,
          dateFormatted: override.dateFormatted,
        };
      }

      // Dynamic fallback calculations for years beyond schedule table
      if (sd.id === 'mother-day') {
        const day = getNthWeekdayOfMonth(targetYear, 4, 0, 2); // 2nd Sunday in May (month 4)
        return { ...sd, month: 4, day, dateFormatted: `${day} May` };
      }
      if (sd.id === 'father-day') {
        const day = getNthWeekdayOfMonth(targetYear, 5, 0, 3); // 3rd Sunday in Jun (month 5)
        return { ...sd, month: 5, day, dateFormatted: `${day} Jun` };
      }
      if (sd.id === 'friendship-day') {
        const day = getNthWeekdayOfMonth(targetYear, 7, 0, 1); // 1st Sunday in Aug (month 7)
        return { ...sd, month: 7, day, dateFormatted: `${day} Aug` };
      }
    }
    return sd;
  });
}
