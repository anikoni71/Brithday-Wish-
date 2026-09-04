import { TeamMember } from '../types';
import { checkIsTodayBirthday, parseBirthdayDate } from '../utils/dateUtils';
import { GLOBAL_SPECIAL_DAYS } from '../data/specialDays';
import {
  getMemberNameMeaning,
  getMemberNameMeaningDetails,
  getMemberNameMeaningEmoji,
  getMemberNameMeaningFull,
  CURATED_TEAM_NAME_MEANINGS,
  NAME_ROOTS_DICTIONARY,
} from '../utils/nameMeaningUtils';

export {
  getMemberNameMeaning,
  getMemberNameMeaningDetails,
  getMemberNameMeaningEmoji,
  getMemberNameMeaningFull,
  CURATED_TEAM_NAME_MEANINGS,
  NAME_ROOTS_DICTIONARY,
};

/**
 * Short, strong, and meaningful literal meanings of each team member's name.
 */
export const TEAM_NAME_MEANINGS: Record<string, string> = {
  danushka: "Armed with a bow / Prosperous",
  zahid: "Pious and devoted",
  khalid: "Eternal and enduring",
  rasij: "Eternal and enduring",
  abdulla: "Servant of God",
  abdullah: "Servant of God",
  bishnu: "The Preserver and Protector",
  sudipta: "Bright and radiant",
  farjana: "Wise and knowledgeable",
  samon: "Jasmine flower and valuable",
  irfan: "Deep knowledge and inner wisdom",
  anik: "Soldier and brave guardian",
  farhad: "Helper and joy",
  ranjith: "Victorious and bringer of joy",
  rohan: "Ascending and growing",
  dipankar: "Bringer of light",
  tareq: "Morning star and guide",
  tariq: "Morning star and guide",
  asif: "Strong, capable, and forgiving",
  arifur: "Noble leader and wise guide",
};

/**
 * Birthday Date Matches with Global & Festive Special Days (Short Details).
 */
export const MEMBER_SPECIAL_DAY_MATCHES: Record<string, string> = {
  danushka: "National Nurses Day & International No Diet Day",
  zahid: "International Mother Language Day",
  khalid: "Bengali New Year Week",
  rasij: "Bengali New Year Week",
  abdulla: "World No-Tobacco Day",
  abdullah: "World No-Tobacco Day",
  bishnu: "IE Engineers Day Week",
  sudipta: "Leap Year / Spring Observance",
  farjana: "Mid-Summer Global Cultural Festivals",
  samon: "General Celebration",
  irfan: "Global Ethics & Leadership Day",
  anik: "International Mother Language Day",
  farhad: "International Friendship Day week",
  ranjith: "Winter Solstice / Festival of Light",
  rohan: "Valentine’s Week / Season of Love",
  dipankar: "Late Autumn & Global Awareness Observances",
  tareq: "International Children's Book Day",
  tariq: "International Children's Book Day",
  asif: "International Friendship Day week",
  arifur: "IE Engineers Day Week",
};

export const DATE_SPECIAL_DAY_MATCHES: Record<string, string> = {
  // 6th May
  "6th May": "National Nurses Day & International No Diet Day",
  "6 May": "National Nurses Day & International No Diet Day",
  "5/6": "National Nurses Day & International No Diet Day",
  "05/06": "National Nurses Day & International No Diet Day",

  // 21st Feb
  "21st Feb": "International Mother Language Day",
  "21st February": "International Mother Language Day",
  "21 Feb": "International Mother Language Day",
  "2/21": "International Mother Language Day",
  "02/21": "International Mother Language Day",

  // 17th Apr
  "17th Apr": "Bengali New Year Week",
  "17th April": "Bengali New Year Week",
  "17 Apr": "Bengali New Year Week",
  "4/17": "Bengali New Year Week",
  "04/17": "Bengali New Year Week",

  // 31st May
  "31st May": "World No-Tobacco Day",
  "31 May": "World No-Tobacco Day",
  "5/31": "World No-Tobacco Day",
  "05/31": "World No-Tobacco Day",

  // 13th Sep
  "13th Sep": "IE Engineers Day Week",
  "13th September": "IE Engineers Day Week",
  "13 Sep": "IE Engineers Day Week",
  "9/13": "IE Engineers Day Week",
  "09/13": "IE Engineers Day Week",

  // 29th Feb
  "29th Feb": "Leap Year / Spring Observance",
  "29th February": "Leap Year / Spring Observance",
  "29 Feb": "Leap Year / Spring Observance",
  "2/29": "Leap Year / Spring Observance",
  "02/29": "Leap Year / Spring Observance",

  // 13th Jul
  "13th Jul": "Mid-Summer Global Cultural Festivals",
  "13th July": "Mid-Summer Global Cultural Festivals",
  "13 Jul": "Mid-Summer Global Cultural Festivals",
  "7/13": "Mid-Summer Global Cultural Festivals",
  "07/13": "Mid-Summer Global Cultural Festivals",

  // 20th Oct
  "20th Oct": "Global Ethics & Leadership Day",
  "20th October": "Global Ethics & Leadership Day",
  "20 Oct": "Global Ethics & Leadership Day",
  "10/20": "Global Ethics & Leadership Day",

  // 4th Aug
  "4th Aug": "International Friendship Day week",
  "4th August": "International Friendship Day week",
  "4 Aug": "International Friendship Day week",
  "8/4": "International Friendship Day week",
  "08/04": "International Friendship Day week",

  // 21st Dec
  "21st Dec": "Winter Solstice / Festival of Light",
  "21st December": "Winter Solstice / Festival of Light",
  "21 Dec": "Winter Solstice / Festival of Light",
  "12/21": "Winter Solstice / Festival of Light",

  // 17th Feb
  "17th Feb": "Valentine’s Week / Season of Love",
  "17th February": "Valentine’s Week / Season of Love",
  "17 Feb": "Valentine’s Week / Season of Love",
  "2/17": "Valentine’s Week / Season of Love",
  "02/17": "Valentine’s Week / Season of Love",

  // 25th Nov
  "25th Nov": "Late Autumn & Global Awareness Observances",
  "25th November": "Late Autumn & Global Awareness Observances",
  "25 Nov": "Late Autumn & Global Awareness Observances",
  "11/25": "Late Autumn & Global Awareness Observances",

  // 2nd Apr
  "2nd Apr": "International Children's Book Day",
  "2nd April": "International Children's Book Day",
  "2 Apr": "International Children's Book Day",
  "4/2": "International Children's Book Day",
  "04/02": "International Children's Book Day",
};

/**
 * Returns matching global and festive special day details for a member's birthday.
 * 
 * Dynamic Real-Time Resolution:
 * 1. Checks curated team member name match.
 * 2. Checks exact birthday date match.
 * 3. Dynamically resolves newly synced sheet members using parseBirthdayDate and GLOBAL_SPECIAL_DAYS.
 * 4. Fallbacks gracefully to seasonal/general celebration.
 */
export function getMemberSpecialDayMatch(birthday?: string, name?: string): string {
  // 1. Check curated member name
  if (name) {
    const lowerName = name.toLowerCase().trim();
    for (const [key, match] of Object.entries(MEMBER_SPECIAL_DAY_MATCHES)) {
      if (lowerName.includes(key)) return match;
    }
  }

  // 2. Check exact birthday string in curated date dictionary
  if (birthday) {
    const cleanBday = birthday.trim();
    if (DATE_SPECIAL_DAY_MATCHES[cleanBday]) {
      return DATE_SPECIAL_DAY_MATCHES[cleanBday];
    }
  }

  // 3. Dynamic Real-Time Parsing for any new Google Sheet row
  if (birthday && birthday.trim().length > 0 && birthday.toLowerCase() !== 'not set' && birthday.toLowerCase() !== 'null') {
    const parsed = parseBirthdayDate(birthday);
    if (parsed) {
      // Look up in comprehensive GLOBAL_SPECIAL_DAYS database
      const exactDay = GLOBAL_SPECIAL_DAYS.find(
        (sd) => sd.month === parsed.month && sd.day === parsed.day
      );
      if (exactDay) {
        return exactDay.name;
      }

      // Look within +/- 3 days for major observances
      const nearDay = GLOBAL_SPECIAL_DAYS.find(
        (sd) => sd.month === parsed.month && Math.abs(sd.day - parsed.day) <= 3
      );
      if (nearDay) {
        return `${nearDay.shortName || nearDay.name} Week`;
      }

      // Seasonal Observance by month
      const seasonMap: Record<number, string> = {
        0: "Winter Renewal & New Year Season",
        1: "Spring Transition & Heritage Month",
        2: "Global Spring & Harmony Season",
        3: "Bengali Spring & Cultural Festivals",
        4: "Mid-Year Dedication & Health Observance",
        5: "Summer Solstice & Joy Season",
        6: "Mid-Summer Global Cultural Festivals",
        7: "Friendship & Unity Observance Season",
        8: "IE Engineers Excellence & Autumn Observance",
        9: "Global Ethics & Wisdom Season",
        10: "Late Autumn & Global Awareness Observances",
        11: "Winter Solstice & Year-End Joy",
      };
      return seasonMap[parsed.month] || "Global Cultural Observance";
    }
  }

  // 4. Fallback for unassigned or missing dates (e.g., Samon Ara)
  return "General Celebration";
}

// Real baseline team roster matching the official Google Sheet records
export const REAL_IE_TEAM_ROSTER: TeamMember[] = [
  {
    sl: "1",
    id: "Z0876",
    name: "Danushka Wanniarachchi",
    nameMeaning: "Armed with a bow / Prosperous",
    specialDayMatch: "National Nurses Day & International No Diet Day",
    designation: "Manager",
    department: "IE Central & Management",
    birthday: "6th May",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Danushka! (Armed with a bow / Prosperous). Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("6th May"),
    lastSentYear: ""
  },
  {
    sl: "3",
    id: "Y1500",
    name: "Zahid Ul Hasan Ripon",
    nameMeaning: "Pious and devoted",
    specialDayMatch: "International Mother Language Day",
    designation: "Executive",
    department: "IE Operations (Unit 1)",
    birthday: "21st Feb",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Zahid! (Pious and devoted). Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("21st Feb"),
    lastSentYear: ""
  },
  {
    sl: "4",
    id: "Y1785",
    name: "Syed Arifur Rahman",
    nameMeaning: "Noble leader and wise guide",
    specialDayMatch: "IE Engineers Day Week",
    designation: "Executive",
    department: "IE Planning & Analytics",
    birthday: "21st Sep",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Syed! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("21st Sep"),
    lastSentYear: ""
  },
  {
    sl: "5",
    id: "Y1504",
    name: "Md. Khalid Hossain Rasij",
    nameMeaning: "Eternal and enduring",
    specialDayMatch: "Bengali New Year Week",
    designation: "Executive",
    department: "Garments IE & Development",
    birthday: "17th Apr",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Md. Khalid! (Eternal and enduring). Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("17th Apr"),
    lastSentYear: ""
  },
  {
    sl: "6",
    id: "Z1107",
    name: "Abdulla Al Mahmud",
    nameMeaning: "Servant of God",
    specialDayMatch: "World No-Tobacco Day",
    designation: "Executive",
    department: "IE Operations (Unit 2)",
    birthday: "31st May",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Abdulla! (Servant of God). Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("31st May"),
    lastSentYear: ""
  },
  {
    sl: "7",
    id: "Y1855",
    name: "Bishnu Dhar",
    nameMeaning: "The Preserver and Protector",
    specialDayMatch: "IE Engineers Day Week",
    designation: "Jr. Executive",
    department: "IE Operations (Unit 1)",
    birthday: "13th Sep",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Bishnu! (The Preserver and Protector). Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("13th Sep"),
    lastSentYear: ""
  },
  {
    sl: "8",
    id: "Y1041",
    name: "Sudipta Barua",
    nameMeaning: "Bright and radiant",
    specialDayMatch: "Leap Year / Spring Observance",
    designation: "Executive",
    department: "IE Planning & Analytics",
    birthday: "29th Feb",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Sudipta! (Bright and radiant). Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("29th Feb"),
    lastSentYear: ""
  },
  {
    sl: "9",
    id: "Y1683",
    name: "Farjana Faria",
    nameMeaning: "Wise and knowledgeable",
    specialDayMatch: "Mid-Summer Global Cultural Festivals",
    designation: "MTO",
    department: "IE Development & Training",
    birthday: "13th Jul",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Farjana! (Wise and knowledgeable). Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("13th Jul"),
    lastSentYear: ""
  },
  {
    sl: "10",
    id: "G0898",
    name: "Samon Ara",
    nameMeaning: "Jasmine flower and valuable",
    specialDayMatch: "General Celebration",
    designation: "Technical",
    department: "IE Technical Support",
    birthday: "",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Samon! (Jasmine flower and valuable). Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: false,
    lastSentYear: ""
  },
  {
    sl: "11",
    id: "Z1279",
    name: "Irfan Alam",
    nameMeaning: "Deep knowledge and inner wisdom",
    specialDayMatch: "Global Ethics & Leadership Day",
    designation: "MTO",
    department: "IE Development & Training",
    birthday: "20th Oct",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Irfan! (Deep knowledge and inner wisdom). Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("20th Oct"),
    lastSentYear: ""
  },
  {
    sl: "12",
    id: "Z1281",
    name: "Anik Barua",
    nameMeaning: "Soldier and brave guardian",
    specialDayMatch: "International Mother Language Day",
    designation: "Sr. Executive",
    department: "Central IE & Automation",
    birthday: "21st Feb",
    mobile: "8801815378940",
    email: "anik.barua@kdsgroup.net",
    whatsapp: "8801815378940",
    wishingMessage: "Happy Birthday, Anik! (Soldier and brave guardian). Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("21st Feb"),
    lastSentYear: ""
  },
  {
    sl: "13",
    id: "Z1287",
    name: "Farhad Hossain",
    nameMeaning: "Helper and joy",
    specialDayMatch: "International Friendship Day week",
    designation: "Executive",
    department: "Garments IE & Development",
    birthday: "4th Aug",
    mobile: "8801826116363",
    email: "farhad.hossain@kdsgroup.net",
    whatsapp: "8801826116363",
    wishingMessage: "Happy Birthday, Farhad! (Helper and joy). Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("4th Aug"),
    lastSentYear: ""
  },
  {
    sl: "14",
    id: "",
    name: "Ranjith Sir",
    nameMeaning: "Victorious and bringer of joy",
    specialDayMatch: "Winter Solstice / Festival of Light",
    designation: "Advisor",
    department: "Executive & Strategic Advisory",
    birthday: "21st Dec",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Ranjith Sir! (Victorious and bringer of joy). Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("21st Dec"),
    lastSentYear: ""
  },
  {
    sl: "15",
    id: "",
    name: "Rohan Sir",
    nameMeaning: "Ascending and growing",
    specialDayMatch: "Valentine’s Week / Season of Love",
    designation: "Advisor",
    department: "Executive & Strategic Advisory",
    birthday: "17th Feb",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Rohan Sir! (Ascending and growing). Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("17th Feb"),
    lastSentYear: ""
  },
  {
    sl: "16",
    id: "S1640",
    name: "Dipankar Barua",
    nameMeaning: "Bringer of light",
    specialDayMatch: "Late Autumn & Global Awareness Observances",
    designation: "IE Specialist",
    department: "Central IE & Automation",
    birthday: "25th Nov",
    mobile: "8801829870593",
    email: "dipankar.barua@kdsgroup.net",
    whatsapp: "8801829870593",
    wishingMessage: "Happy Birthday, Dipankar! (Bringer of light). Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("25th Nov"),
    lastSentYear: ""
  },
  {
    sl: "17",
    id: "Z1337",
    name: "MD. Tareq",
    nameMeaning: "Morning star and guide",
    specialDayMatch: "International Children's Book Day",
    designation: "Executive",
    department: "IE Operations (Unit 2)",
    birthday: "2nd April",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, MD. Tareq! (Morning star and guide). Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("2nd April"),
    lastSentYear: ""
  },
  {
    sl: "18",
    id: "Z1338",
    name: "MD. Asif Jaman",
    nameMeaning: "Strong, capable, and forgiving",
    specialDayMatch: "International Friendship Day week",
    designation: "Executive",
    department: "Garments IE & Development",
    birthday: "4th Aug",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, MD. Asif Jaman! (Strong, capable, and forgiving). Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("4th Aug"),
    lastSentYear: ""
  }
];

export function getDemoTeamMembers(): TeamMember[] {
  return REAL_IE_TEAM_ROSTER.map((m) => {
    const details = getMemberNameMeaningDetails(m.name);
    return {
      ...m,
      nameMeaning: details.note,
      nameMeaningEmoji: details.emoji,
      nameMeaningNote: details.note,
      specialDayMatch: getMemberSpecialDayMatch(m.birthday, m.name),
      isBirthdayToday: checkIsTodayBirthday(m.birthday)
    };
  });
}
