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
  isFloating?: boolean; // Whether the date moves annually (e.g. Eid, Mother's Day, Poya, Diwali)
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
 * Covers Sri Lankan Full Moon Poya days, Global Buddhist celebrations, Islamic holy days,
 * Hindu festivals, Christian movable feasts, Jewish holidays, and Sikh observances.
 */
export const FLOATING_HOLIDAY_SCHEDULES: Record<number, Record<string, { month: number; day: number; dateFormatted: string }>> = {
  2024: {
    // Sri Lankan Buddhist Full Moon Poya Days (2024)
    'duruthu-poya': { month: 0, day: 25, dateFormatted: '25 Jan' },
    'navam-poya': { month: 1, day: 23, dateFormatted: '23 Feb' },
    'medin-poya': { month: 2, day: 24, dateFormatted: '24 Mar' },
    'bak-poya': { month: 3, day: 23, dateFormatted: '23 Apr' },
    'vesak-poya': { month: 4, day: 23, dateFormatted: '23 May' },
    'poson-poya': { month: 5, day: 21, dateFormatted: '21 Jun' },
    'esala-poya': { month: 6, day: 20, dateFormatted: '20 Jul' },
    'nikini-poya': { month: 7, day: 19, dateFormatted: '19 Aug' },
    'binara-poya': { month: 8, day: 17, dateFormatted: '17 Sep' },
    'vap-poya': { month: 9, day: 16, dateFormatted: '16 Oct' },
    'ill-poya': { month: 10, day: 15, dateFormatted: '15 Nov' },
    'unduvap-poya': { month: 11, day: 14, dateFormatted: '14 Dec' },

    // Global Buddhist Festivals (2024)
    'magha-puja': { month: 1, day: 24, dateFormatted: '24 Feb' },
    'asalha-puja': { month: 6, day: 20, dateFormatted: '20 Jul' },
    'madhu-purnima': { month: 8, day: 17, dateFormatted: '17 Sep' },
    'kathina-pavarana': { month: 9, day: 16, dateFormatted: '16 Oct' },

    // Islamic Observances (2024)
    'shab-e-barat': { month: 1, day: 25, dateFormatted: '25 Feb' },
    'laylat-al-qadr': { month: 3, day: 5, dateFormatted: '5 Apr' },
    'eid-ul-fitr': { month: 3, day: 10, dateFormatted: '10 Apr' },
    'eid-ul-adha': { month: 5, day: 17, dateFormatted: '17 Jun' },
    'islamic-new-year': { month: 6, day: 7, dateFormatted: '7 Jul' },
    'ashura': { month: 6, day: 16, dateFormatted: '16 Jul' },
    'mawlid-al-nabi': { month: 8, day: 15, dateFormatted: '15 Sep' },

    // Hindu Observances & Gurus (2024)
    'saraswati-puja': { month: 1, day: 14, dateFormatted: '14 Feb' },
    'maha-shivaratri': { month: 2, day: 8, dateFormatted: '8 Mar' },
    'holi': { month: 2, day: 25, dateFormatted: '25 Mar' },
    'mahavira-jayanti': { month: 3, day: 21, dateFormatted: '21 Apr' },
    'adi-shankaracharya-day': { month: 4, day: 12, dateFormatted: '12 May' },
    'sant-kabir-day': { month: 5, day: 22, dateFormatted: '22 Jun' },
    'krishna-janmashtami': { month: 7, day: 26, dateFormatted: '26 Aug' },
    'durga-puja': { month: 9, day: 12, dateFormatted: '12 Oct' },
    'diwali': { month: 9, day: 31, dateFormatted: '31 Oct' },

    // Sikh Observances (2024)
    'guru-nanak-jayanti': { month: 10, day: 15, dateFormatted: '15 Nov' },

    // Christian Movable Observances (2024)
    'ash-wednesday': { month: 1, day: 14, dateFormatted: '14 Feb' },
    'good-friday': { month: 2, day: 29, dateFormatted: '29 Mar' },
    'easter-sunday': { month: 2, day: 31, dateFormatted: '31 Mar' },

    // Jewish Observances (2024)
    'rosh-hashanah': { month: 9, day: 3, dateFormatted: '3 Oct' },
    'yom-kippur': { month: 9, day: 12, dateFormatted: '12 Oct' },
    'hanukkah': { month: 11, day: 25, dateFormatted: '25 Dec' },

    // International Movable Days (2024)
    'mother-day': { month: 4, day: 12, dateFormatted: '12 May' },
    'father-day': { month: 5, day: 16, dateFormatted: '16 Jun' },
    'friendship-day': { month: 7, day: 4, dateFormatted: '4 Aug' },
  },
  2025: {
    // Sri Lankan Buddhist Full Moon Poya Days (2025)
    'duruthu-poya': { month: 0, day: 13, dateFormatted: '13 Jan' },
    'navam-poya': { month: 1, day: 12, dateFormatted: '12 Feb' },
    'medin-poya': { month: 2, day: 13, dateFormatted: '13 Mar' },
    'bak-poya': { month: 3, day: 12, dateFormatted: '12 Apr' },
    'vesak-poya': { month: 4, day: 12, dateFormatted: '12 May' },
    'poson-poya': { month: 5, day: 10, dateFormatted: '10 Jun' },
    'esala-poya': { month: 6, day: 10, dateFormatted: '10 Jul' },
    'nikini-poya': { month: 7, day: 9, dateFormatted: '9 Aug' },
    'binara-poya': { month: 8, day: 7, dateFormatted: '7 Sep' },
    'vap-poya': { month: 9, day: 6, dateFormatted: '6 Oct' },
    'ill-poya': { month: 10, day: 5, dateFormatted: '5 Nov' },
    'unduvap-poya': { month: 11, day: 4, dateFormatted: '4 Dec' },

    // Global Buddhist Festivals (2025)
    'magha-puja': { month: 1, day: 12, dateFormatted: '12 Feb' },
    'asalha-puja': { month: 6, day: 10, dateFormatted: '10 Jul' },
    'madhu-purnima': { month: 8, day: 7, dateFormatted: '7 Sep' },
    'kathina-pavarana': { month: 9, day: 6, dateFormatted: '6 Oct' },

    // Islamic Observances (2025)
    'shab-e-barat': { month: 1, day: 14, dateFormatted: '14 Feb' },
    'laylat-al-qadr': { month: 2, day: 26, dateFormatted: '26 Mar' },
    'eid-ul-fitr': { month: 2, day: 31, dateFormatted: '31 Mar' },
    'eid-ul-adha': { month: 5, day: 7, dateFormatted: '7 Jun' },
    'islamic-new-year': { month: 5, day: 26, dateFormatted: '26 Jun' },
    'ashura': { month: 6, day: 5, dateFormatted: '5 Jul' },
    'mawlid-al-nabi': { month: 8, day: 4, dateFormatted: '4 Sep' },

    // Hindu Observances & Gurus (2025)
    'saraswati-puja': { month: 1, day: 2, dateFormatted: '2 Feb' },
    'maha-shivaratri': { month: 1, day: 26, dateFormatted: '26 Feb' },
    'holi': { month: 2, day: 14, dateFormatted: '14 Mar' },
    'mahavira-jayanti': { month: 3, day: 10, dateFormatted: '10 Apr' },
    'adi-shankaracharya-day': { month: 4, day: 2, dateFormatted: '2 May' },
    'sant-kabir-day': { month: 5, day: 11, dateFormatted: '11 Jun' },
    'krishna-janmashtami': { month: 7, day: 16, dateFormatted: '16 Aug' },
    'durga-puja': { month: 9, day: 2, dateFormatted: '2 Oct' },
    'diwali': { month: 9, day: 20, dateFormatted: '20 Oct' },

    // Sikh Observances (2025)
    'guru-nanak-jayanti': { month: 10, day: 5, dateFormatted: '5 Nov' },

    // Christian Movable Observances (2025)
    'ash-wednesday': { month: 2, day: 5, dateFormatted: '5 Mar' },
    'good-friday': { month: 3, day: 18, dateFormatted: '18 Apr' },
    'easter-sunday': { month: 3, day: 20, dateFormatted: '20 Apr' },

    // Jewish Observances (2025)
    'rosh-hashanah': { month: 8, day: 23, dateFormatted: '23 Sep' },
    'yom-kippur': { month: 9, day: 2, dateFormatted: '2 Oct' },
    'hanukkah': { month: 11, day: 14, dateFormatted: '14 Dec' },

    // International Movable Days (2025)
    'mother-day': { month: 4, day: 11, dateFormatted: '11 May' },
    'father-day': { month: 5, day: 15, dateFormatted: '15 Jun' },
    'friendship-day': { month: 7, day: 3, dateFormatted: '3 Aug' },
  },
  2026: {
    // Sri Lankan Buddhist Full Moon Poya Days (2026)
    'duruthu-poya': { month: 0, day: 3, dateFormatted: '3 Jan' },
    'navam-poya': { month: 1, day: 1, dateFormatted: '1 Feb' },
    'medin-poya': { month: 2, day: 3, dateFormatted: '3 Mar' },
    'bak-poya': { month: 3, day: 1, dateFormatted: '1 Apr' },
    'vesak-poya': { month: 4, day: 1, dateFormatted: '1 May' },
    'poson-poya': { month: 4, day: 30, dateFormatted: '30 May' },
    'esala-poya': { month: 6, day: 28, dateFormatted: '28 Jul' },
    'nikini-poya': { month: 7, day: 27, dateFormatted: '27 Aug' },
    'binara-poya': { month: 8, day: 25, dateFormatted: '25 Sep' },
    'vap-poya': { month: 9, day: 25, dateFormatted: '25 Oct' },
    'ill-poya': { month: 10, day: 23, dateFormatted: '23 Nov' },
    'unduvap-poya': { month: 11, day: 23, dateFormatted: '23 Dec' },

    // Global Buddhist Festivals (2026)
    'magha-puja': { month: 2, day: 3, dateFormatted: '3 Mar' },
    'asalha-puja': { month: 6, day: 28, dateFormatted: '28 Jul' },
    'madhu-purnima': { month: 8, day: 25, dateFormatted: '25 Sep' },
    'kathina-pavarana': { month: 9, day: 25, dateFormatted: '25 Oct' },

    // Islamic Observances (2026)
    'shab-e-barat': { month: 1, day: 3, dateFormatted: '3 Feb' },
    'laylat-al-qadr': { month: 2, day: 16, dateFormatted: '16 Mar' },
    'eid-ul-fitr': { month: 2, day: 20, dateFormatted: '20 Mar' },
    'eid-ul-adha': { month: 4, day: 27, dateFormatted: '27 May' },
    'islamic-new-year': { month: 5, day: 16, dateFormatted: '16 Jun' },
    'ashura': { month: 5, day: 25, dateFormatted: '25 Jun' },
    'mawlid-al-nabi': { month: 7, day: 25, dateFormatted: '25 Aug' },

    // Hindu Observances & Gurus (2026)
    'saraswati-puja': { month: 0, day: 23, dateFormatted: '23 Jan' },
    'maha-shivaratri': { month: 1, day: 15, dateFormatted: '15 Feb' },
    'holi': { month: 2, day: 4, dateFormatted: '4 Mar' },
    'mahavira-jayanti': { month: 2, day: 31, dateFormatted: '31 Mar' },
    'adi-shankaracharya-day': { month: 4, day: 21, dateFormatted: '21 May' },
    'sant-kabir-day': { month: 5, day: 30, dateFormatted: '30 Jun' },
    'krishna-janmashtami': { month: 8, day: 4, dateFormatted: '4 Sep' },
    'durga-puja': { month: 9, day: 20, dateFormatted: '20 Oct' },
    'diwali': { month: 10, day: 8, dateFormatted: '8 Nov' },

    // Sikh Observances (2026)
    'guru-nanak-jayanti': { month: 10, day: 23, dateFormatted: '23 Nov' },

    // Christian Movable Observances (2026)
    'ash-wednesday': { month: 1, day: 18, dateFormatted: '18 Feb' },
    'good-friday': { month: 3, day: 3, dateFormatted: '3 Apr' },
    'easter-sunday': { month: 3, day: 5, dateFormatted: '5 Apr' },

    // Jewish Observances (2026)
    'rosh-hashanah': { month: 8, day: 12, dateFormatted: '12 Sep' },
    'yom-kippur': { month: 8, day: 21, dateFormatted: '21 Sep' },
    'hanukkah': { month: 11, day: 4, dateFormatted: '4 Dec' },

    // International Movable Days (2026)
    'mother-day': { month: 4, day: 10, dateFormatted: '10 May' },
    'father-day': { month: 5, day: 21, dateFormatted: '21 Jun' },
    'friendship-day': { month: 7, day: 2, dateFormatted: '2 Aug' },
  },
  2027: {
    // Sri Lankan Buddhist Full Moon Poya Days (2027)
    'duruthu-poya': { month: 0, day: 22, dateFormatted: '22 Jan' },
    'navam-poya': { month: 1, day: 20, dateFormatted: '20 Feb' },
    'medin-poya': { month: 2, day: 22, dateFormatted: '22 Mar' },
    'bak-poya': { month: 3, day: 20, dateFormatted: '20 Apr' },
    'vesak-poya': { month: 4, day: 20, dateFormatted: '20 May' },
    'poson-poya': { month: 5, day: 18, dateFormatted: '18 Jun' },
    'esala-poya': { month: 6, day: 18, dateFormatted: '18 Jul' },
    'nikini-poya': { month: 7, day: 16, dateFormatted: '16 Aug' },
    'binara-poya': { month: 8, day: 15, dateFormatted: '15 Sep' },
    'vap-poya': { month: 9, day: 14, dateFormatted: '14 Oct' },
    'ill-poya': { month: 10, day: 13, dateFormatted: '13 Nov' },
    'unduvap-poya': { month: 11, day: 13, dateFormatted: '13 Dec' },

    // Global Buddhist Festivals (2027)
    'magha-puja': { month: 1, day: 21, dateFormatted: '21 Feb' },
    'asalha-puja': { month: 6, day: 18, dateFormatted: '18 Jul' },
    'madhu-purnima': { month: 8, day: 15, dateFormatted: '15 Sep' },
    'kathina-pavarana': { month: 9, day: 14, dateFormatted: '14 Oct' },

    // Islamic Observances (2027)
    'shab-e-barat': { month: 0, day: 23, dateFormatted: '23 Jan' },
    'laylat-al-qadr': { month: 2, day: 6, dateFormatted: '6 Mar' },
    'eid-ul-fitr': { month: 2, day: 10, dateFormatted: '10 Mar' },
    'eid-ul-adha': { month: 4, day: 16, dateFormatted: '16 May' },
    'islamic-new-year': { month: 5, day: 5, dateFormatted: '5 Jun' },
    'ashura': { month: 5, day: 14, dateFormatted: '14 Jun' },
    'mawlid-al-nabi': { month: 7, day: 14, dateFormatted: '14 Aug' },

    // Hindu Observances & Gurus (2027)
    'saraswati-puja': { month: 1, day: 11, dateFormatted: '11 Feb' },
    'maha-shivaratri': { month: 2, day: 6, dateFormatted: '6 Mar' },
    'holi': { month: 2, day: 22, dateFormatted: '22 Mar' },
    'mahavira-jayanti': { month: 3, day: 19, dateFormatted: '19 Apr' },
    'adi-shankaracharya-day': { month: 4, day: 11, dateFormatted: '11 May' },
    'sant-kabir-day': { month: 5, day: 19, dateFormatted: '19 Jun' },
    'krishna-janmashtami': { month: 7, day: 25, dateFormatted: '25 Aug' },
    'durga-puja': { month: 9, day: 10, dateFormatted: '10 Oct' },
    'diwali': { month: 9, day: 29, dateFormatted: '29 Oct' },

    // Sikh Observances (2027)
    'guru-nanak-jayanti': { month: 10, day: 13, dateFormatted: '13 Nov' },

    // Christian Movable Observances (2027)
    'ash-wednesday': { month: 1, day: 10, dateFormatted: '10 Feb' },
    'good-friday': { month: 2, day: 26, dateFormatted: '26 Mar' },
    'easter-sunday': { month: 2, day: 28, dateFormatted: '28 Mar' },

    // Jewish Observances (2027)
    'rosh-hashanah': { month: 9, day: 2, dateFormatted: '2 Oct' },
    'yom-kippur': { month: 9, day: 11, dateFormatted: '11 Oct' },
    'hanukkah': { month: 11, day: 24, dateFormatted: '24 Dec' },

    // International Movable Days (2027)
    'mother-day': { month: 4, day: 9, dateFormatted: '9 May' },
    'father-day': { month: 5, day: 20, dateFormatted: '20 Jun' },
    'friendship-day': { month: 7, day: 1, dateFormatted: '1 Aug' },
  },
  2028: {
    // Sri Lankan Buddhist Full Moon Poya Days (2028)
    'duruthu-poya': { month: 0, day: 11, dateFormatted: '11 Jan' },
    'navam-poya': { month: 1, day: 10, dateFormatted: '10 Feb' },
    'medin-poya': { month: 2, day: 10, dateFormatted: '10 Mar' },
    'bak-poya': { month: 3, day: 9, dateFormatted: '9 Apr' },
    'vesak-poya': { month: 4, day: 8, dateFormatted: '8 May' },
    'poson-poya': { month: 5, day: 7, dateFormatted: '7 Jun' },
    'esala-poya': { month: 6, day: 6, dateFormatted: '6 Jul' },
    'nikini-poya': { month: 7, day: 5, dateFormatted: '5 Aug' },
    'binara-poya': { month: 8, day: 3, dateFormatted: '3 Sep' },
    'vap-poya': { month: 9, day: 3, dateFormatted: '3 Oct' },
    'ill-poya': { month: 10, day: 1, dateFormatted: '1 Nov' },
    'unduvap-poya': { month: 11, day: 1, dateFormatted: '1 Dec' },

    // Global Buddhist Festivals (2028)
    'magha-puja': { month: 1, day: 10, dateFormatted: '10 Feb' },
    'asalha-puja': { month: 6, day: 6, dateFormatted: '6 Jul' },
    'madhu-purnima': { month: 8, day: 3, dateFormatted: '3 Sep' },
    'kathina-pavarana': { month: 9, day: 3, dateFormatted: '3 Oct' },

    // Islamic Observances (2028)
    'shab-e-barat': { month: 0, day: 12, dateFormatted: '12 Jan' },
    'laylat-al-qadr': { month: 1, day: 23, dateFormatted: '23 Feb' },
    'eid-ul-fitr': { month: 1, day: 27, dateFormatted: '27 Feb' },
    'eid-ul-adha': { month: 4, day: 5, dateFormatted: '5 May' },
    'islamic-new-year': { month: 4, day: 24, dateFormatted: '24 May' },
    'ashura': { month: 5, day: 2, dateFormatted: '2 Jun' },
    'mawlid-al-nabi': { month: 7, day: 3, dateFormatted: '3 Aug' },

    // Hindu Observances & Gurus (2028)
    'saraswati-puja': { month: 0, day: 31, dateFormatted: '31 Jan' },
    'maha-shivaratri': { month: 1, day: 23, dateFormatted: '23 Feb' },
    'holi': { month: 2, day: 11, dateFormatted: '11 Mar' },
    'mahavira-jayanti': { month: 3, day: 7, dateFormatted: '7 Apr' },
    'adi-shankaracharya-day': { month: 3, day: 29, dateFormatted: '29 Apr' },
    'sant-kabir-day': { month: 5, day: 8, dateFormatted: '8 Jun' },
    'krishna-janmashtami': { month: 7, day: 13, dateFormatted: '13 Aug' },
    'durga-puja': { month: 8, day: 29, dateFormatted: '29 Sep' },
    'diwali': { month: 9, day: 17, dateFormatted: '17 Oct' },

    // Sikh Observances (2028)
    'guru-nanak-jayanti': { month: 10, day: 1, dateFormatted: '1 Nov' },

    // Christian Movable Observances (2028)
    'ash-wednesday': { month: 2, day: 1, dateFormatted: '1 Mar' },
    'good-friday': { month: 3, day: 14, dateFormatted: '14 Apr' },
    'easter-sunday': { month: 3, day: 16, dateFormatted: '16 Apr' },

    // Jewish Observances (2028)
    'rosh-hashanah': { month: 8, day: 21, dateFormatted: '21 Sep' },
    'yom-kippur': { month: 8, day: 30, dateFormatted: '30 Sep' },
    'hanukkah': { month: 11, day: 12, dateFormatted: '12 Dec' },

    // International Movable Days (2028)
    'mother-day': { month: 4, day: 14, dateFormatted: '14 May' },
    'father-day': { month: 5, day: 18, dateFormatted: '18 Jun' },
    'friendship-day': { month: 7, day: 6, dateFormatted: '6 Aug' },
  },
  2029: {
    'duruthu-poya': { month: 0, day: 29, dateFormatted: '29 Jan' },
    'navam-poya': { month: 1, day: 28, dateFormatted: '28 Feb' },
    'medin-poya': { month: 2, day: 29, dateFormatted: '29 Mar' },
    'bak-poya': { month: 3, day: 28, dateFormatted: '28 Apr' },
    'vesak-poya': { month: 4, day: 27, dateFormatted: '27 May' },
    'poson-poya': { month: 5, day: 26, dateFormatted: '26 Jun' },
    'esala-poya': { month: 6, day: 25, dateFormatted: '25 Jul' },
    'nikini-poya': { month: 7, day: 24, dateFormatted: '24 Aug' },
    'binara-poya': { month: 8, day: 22, dateFormatted: '22 Sep' },
    'vap-poya': { month: 9, day: 22, dateFormatted: '22 Oct' },
    'ill-poya': { month: 10, day: 20, dateFormatted: '20 Nov' },
    'unduvap-poya': { month: 11, day: 20, dateFormatted: '20 Dec' },
    'eid-ul-fitr': { month: 1, day: 15, dateFormatted: '15 Feb' },
    'eid-ul-adha': { month: 3, day: 24, dateFormatted: '24 Apr' },
    'mother-day': { month: 4, day: 13, dateFormatted: '13 May' },
    'father-day': { month: 5, day: 17, dateFormatted: '17 Jun' },
    'friendship-day': { month: 7, day: 5, dateFormatted: '5 Aug' },
    'diwali': { month: 10, day: 5, dateFormatted: '5 Nov' },
    'easter-sunday': { month: 3, day: 1, dateFormatted: '1 Apr' },
    'good-friday': { month: 2, day: 30, dateFormatted: '30 Mar' },
    'ash-wednesday': { month: 1, day: 14, dateFormatted: '14 Feb' },
    'hanukkah': { month: 11, day: 2, dateFormatted: '2 Dec' },
  },
  2030: {
    'duruthu-poya': { month: 0, day: 18, dateFormatted: '18 Jan' },
    'navam-poya': { month: 1, day: 17, dateFormatted: '17 Feb' },
    'medin-poya': { month: 2, day: 19, dateFormatted: '19 Mar' },
    'bak-poya': { month: 3, day: 17, dateFormatted: '17 Apr' },
    'vesak-poya': { month: 4, day: 17, dateFormatted: '17 May' },
    'poson-poya': { month: 5, day: 15, dateFormatted: '15 Jun' },
    'esala-poya': { month: 6, day: 15, dateFormatted: '15 Jul' },
    'nikini-poya': { month: 7, day: 13, dateFormatted: '13 Aug' },
    'binara-poya': { month: 8, day: 11, dateFormatted: '11 Sep' },
    'vap-poya': { month: 9, day: 11, dateFormatted: '11 Oct' },
    'ill-poya': { month: 10, day: 10, dateFormatted: '10 Nov' },
    'unduvap-poya': { month: 11, day: 9, dateFormatted: '9 Dec' },
    'eid-ul-fitr': { month: 1, day: 5, dateFormatted: '5 Feb' },
    'eid-ul-adha': { month: 3, day: 14, dateFormatted: '14 Apr' },
    'mother-day': { month: 4, day: 12, dateFormatted: '12 May' },
    'father-day': { month: 5, day: 16, dateFormatted: '16 Jun' },
    'friendship-day': { month: 7, day: 4, dateFormatted: '4 Aug' },
    'diwali': { month: 9, day: 26, dateFormatted: '26 Oct' },
    'easter-sunday': { month: 3, day: 21, dateFormatted: '21 Apr' },
    'good-friday': { month: 3, day: 19, dateFormatted: '19 Apr' },
    'ash-wednesday': { month: 2, day: 6, dateFormatted: '6 Mar' },
    'hanukkah': { month: 11, day: 20, dateFormatted: '20 Dec' },
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
  // ==========================================
  // JANUARY
  // ==========================================
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
    id: 'duruthu-poya',
    name: "Duruthu Full Moon Poya Day",
    shortName: "Duruthu Poya",
    dateFormatted: "3 Jan",
    month: 0,
    day: 3,
    icon: "🌕",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "First full moon of the year commemorating Lord Buddha's first visit to Sri Lanka (Mahiyangana) to restore peace.",
    greetingTheme: "Purity of mind, spiritual awakening, peace, and sacred new year blessings.",
    isFloating: true,
  },
  {
    id: 'isaac-newton-day',
    name: "Sir Isaac Newton's Birth Anniversary",
    shortName: "Isaac Newton Day",
    dateFormatted: "4 Jan",
    month: 0,
    day: 4,
    icon: "🍎",
    category: "observance",
    badgeColor: "bg-sky-50 text-sky-900 border-sky-200 font-semibold",
    description: "Commemorating the father of classical mechanics, universal gravitation, and calculus whose laws shaped physics.",
    greetingTheme: "Scientific curiosity, mathematical genius, and groundbreaking discovery."
  },
  {
    id: 'stephen-hawking-day',
    name: "Stephen Hawking's Birth Anniversary",
    shortName: "Stephen Hawking Day",
    dateFormatted: "8 Jan",
    month: 0,
    day: 8,
    icon: "🌌",
    category: "observance",
    badgeColor: "bg-indigo-50 text-indigo-900 border-indigo-200 font-semibold",
    description: "Commemorating legendary theoretical physicist and cosmologist famed for black hole thermodynamics and resilience.",
    greetingTheme: "Cosmic wonder, relentless intellectual resilience, and daring exploration."
  },
  {
    id: 'swami-vivekananda-day',
    name: "Swami Vivekananda's Birth Anniversary (National Youth Day)",
    shortName: "Swami Vivekananda Day",
    dateFormatted: "12 Jan",
    month: 0,
    day: 12,
    icon: "🔥",
    category: "observance",
    badgeColor: "bg-orange-50 text-orange-950 border-orange-200 font-semibold",
    description: "Celebrating the inspiring philosopher who introduced Vedanta and Yoga to the Western world at the 1893 Parliament of Religions.",
    greetingTheme: "Youth dynamism, spiritual fearlessness, universal tolerance, and character building."
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
    id: 'mlk-day',
    name: "Martin Luther King Jr. Day (Civil Rights & Peace)",
    shortName: "Martin Luther King Jr.",
    dateFormatted: "15 Jan",
    month: 0,
    day: 15,
    icon: "✊",
    category: "international",
    badgeColor: "bg-amber-50 text-amber-950 border-amber-300 font-semibold",
    description: "Honoring the iconic civil rights leader who championed racial equality and justice through nonviolent activism.",
    greetingTheme: "Equality, human dignity, courage, and dreams of universal brotherhood."
  },
  {
    id: 'saraswati-puja',
    name: "Saraswati Puja (Vasant Panchami)",
    shortName: "Saraswati Puja",
    dateFormatted: "23 Jan",
    month: 0,
    day: 23,
    icon: "🪕",
    category: "festive",
    badgeColor: "bg-yellow-100 text-yellow-950 border-yellow-300 font-bold",
    description: "Auspicious Hindu festival dedicated to Maa Saraswati, goddess of wisdom, learning, music, and arts.",
    greetingTheme: "Wisdom, creative arts, academic brilliance, and intellectual enlightenment.",
    isFloating: true,
  },

  // ==========================================
  // FEBRUARY
  // ==========================================
  {
    id: 'navam-poya',
    name: "Navam Full Moon Poya Day",
    shortName: "Navam Poya",
    dateFormatted: "1 Feb",
    month: 1,
    day: 1,
    icon: "🌕",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "Celebrates the appointment of Chief Disciples Sariputta and Moggallana, and the holding of the first Buddhist Sangha Council.",
    greetingTheme: "Righteous leadership, mindfulness, Dhamma fellowship, and wisdom.",
    isFloating: true,
  },
  {
    id: 'shab-e-barat',
    name: "Shab-e-Barat (Night of Forgiveness)",
    shortName: "Shab-e-Barat",
    dateFormatted: "3 Feb",
    month: 1,
    day: 3,
    icon: "🌙",
    category: "festive",
    badgeColor: "bg-emerald-100 text-emerald-950 border-emerald-300 font-bold",
    description: "Holy Islamic night of prayers, divine forgiveness, and salvation on the 15th of Sha'ban.",
    greetingTheme: "Divine forgiveness, sincere prayers, spiritual peace, and abundant blessings.",
    isFloating: true,
  },
  {
    id: 'thomas-edison-day',
    name: "Thomas Edison's Birth Anniversary (National Inventors' Day)",
    shortName: "Thomas Edison Day",
    dateFormatted: "11 Feb",
    month: 1,
    day: 11,
    icon: "💡",
    category: "observance",
    badgeColor: "bg-amber-50 text-amber-900 border-amber-200 font-semibold",
    description: "Celebrating the prolific American inventor whose electric power and phonograph transformed modern industry.",
    greetingTheme: "Relentless experimentation, creative persistence, and transformative invention."
  },
  {
    id: 'darwin-day',
    name: "Charles Darwin's Birth Anniversary (International Darwin Day)",
    shortName: "Darwin Day",
    dateFormatted: "12 Feb",
    month: 1,
    day: 12,
    icon: "🧬",
    category: "observance",
    badgeColor: "bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold",
    description: "Commemorating the pioneering naturalist whose theory of evolution revolutionized biological science.",
    greetingTheme: "Scientific inquiry, evolutionary insight, and awe for the natural world."
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
    id: 'galileo-galilei-day',
    name: "Galileo Galilei's Birth Anniversary",
    shortName: "Galileo Galilei Day",
    dateFormatted: "15 Feb",
    month: 1,
    day: 15,
    icon: "🔭",
    category: "observance",
    badgeColor: "bg-blue-50 text-blue-900 border-blue-200 font-semibold",
    description: "Honoring the Italian astronomer and father of modern observational astronomy and experimental physics.",
    greetingTheme: "Fearless truth-seeking, telescope wonders, and the scientific method."
  },
  {
    id: 'maha-shivaratri',
    name: "Maha Shivaratri (The Great Night of Shiva)",
    shortName: "Maha Shivaratri",
    dateFormatted: "15 Feb",
    month: 1,
    day: 15,
    icon: "🔱",
    category: "festive",
    badgeColor: "bg-orange-100 text-orange-950 border-orange-300 font-bold",
    description: "Great Hindu holy night dedicated to Lord Shiva, overcoming darkness and ignorance with divine awareness.",
    greetingTheme: "Spiritual strength, inner stillness, overcoming negativity, and divine energy.",
    isFloating: true,
  },
  {
    id: 'sri-ramakrishna-day',
    name: "Sri Ramakrishna Paramahamsa Jayanti",
    shortName: "Sri Ramakrishna Jayanti",
    dateFormatted: "18 Feb",
    month: 1,
    day: 18,
    icon: "🪷",
    category: "observance",
    badgeColor: "bg-orange-50 text-orange-950 border-orange-200 font-semibold",
    description: "Commemorating the mystic saint of Dakshineswar who realized and preached the ultimate unity and harmony of all religions.",
    greetingTheme: "Harmony of all religions, universal oneness, divine ecstasy, and spiritual purity."
  },
  {
    id: 'ash-wednesday',
    name: "Ash Wednesday",
    shortName: "Ash Wednesday",
    dateFormatted: "18 Feb",
    month: 1,
    day: 18,
    icon: "✝️",
    category: "observance",
    badgeColor: "bg-purple-100 text-purple-950 border-purple-300 font-bold",
    description: "First day of Lent marking forty days of prayer, fasting, humility, and spiritual contemplation.",
    greetingTheme: "Humility, solemn prayer, spiritual discipline, and mindful renewal.",
    isFloating: true,
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

  // ==========================================
  // MARCH
  // ==========================================
  {
    id: 'medin-poya',
    name: "Medin Full Moon Poya Day",
    shortName: "Medin Poya",
    dateFormatted: "3 Mar",
    month: 2,
    day: 3,
    icon: "🌕",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "Commemorates the Buddha’s journey back to Kapilavastu to preach the Dhamma to King Suddhodana and His royal Sakya clan.",
    greetingTheme: "Filial piety, family harmony, spiritual guidance, and compassion.",
    isFloating: true,
  },
  {
    id: 'magha-puja',
    name: "Magha Puja (Sangha Day)",
    shortName: "Magha Puja",
    dateFormatted: "3 Mar",
    month: 2,
    day: 3,
    icon: "☸️",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "Commemorating the spontaneous assembly of 1,250 Arahats to receive the Ovada Patimokkha fundamental teachings from Lord Buddha.",
    greetingTheme: "Sangha harmony, spiritual fellowship, moral purification, and Dhamma virtue.",
    isFloating: true,
  },
  {
    id: 'milarepa-day',
    name: "Milarepa Commemorative Day",
    shortName: "Milarepa Day",
    dateFormatted: "3 Mar",
    month: 2,
    day: 3,
    icon: "🏔️",
    category: "observance",
    badgeColor: "bg-blue-50 text-blue-900 border-blue-200 font-semibold",
    description: "Celebrating Tibet's most revered yogi and spiritual poet who transformed great darkness into supreme enlightenment in a single lifetime.",
    greetingTheme: "Spiritual endurance, spontaneous songs of liberation, austerity, and profound compassion."
  },
  {
    id: 'holi',
    name: "Holi (Festival of Colors & Spring)",
    shortName: "Holi",
    dateFormatted: "4 Mar",
    month: 2,
    day: 4,
    icon: "🎨",
    category: "festive",
    badgeColor: "bg-pink-100 text-pink-950 border-pink-300 font-bold",
    description: "Joyous festival of vibrant colors, marking the arrival of spring and victory of devotion over evil.",
    greetingTheme: "Vibrant colors, mutual forgiveness, energetic cheer, and festive warmth.",
    isFloating: true,
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
    id: 'albert-einstein-day',
    name: "Albert Einstein's Birth Anniversary (Genius & Relativity Day)",
    shortName: "Albert Einstein Day",
    dateFormatted: "14 Mar",
    month: 2,
    day: 14,
    icon: "⚛️",
    category: "observance",
    badgeColor: "bg-purple-50 text-purple-900 border-purple-200 font-semibold",
    description: "Celebrating the greatest theoretical physicist of modern times who revolutionized our understanding of space, time, and gravity.",
    greetingTheme: "Imagination, relativity genius, intellectual curiosity, and joyful wonder."
  },
  {
    id: 'laylat-al-qadr',
    name: "Laylat al-Qadr (Night of Power)",
    shortName: "Laylat al-Qadr",
    dateFormatted: "16 Mar",
    month: 2,
    day: 16,
    icon: "✨",
    category: "festive",
    badgeColor: "bg-emerald-100 text-emerald-950 border-emerald-300 font-bold",
    description: "The holiest night in Islam commemorating the revelation of the Holy Quran to Prophet Muhammad (PBUH).",
    greetingTheme: "Divine grace, mercy, spiritual illumination, and peaceful abundance.",
    isFloating: true,
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
    description: "Holy festival of joy, peace, family gatherings, charity, and feast concluding Ramadan.",
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
    id: 'laozi-day',
    name: "Laozi Commemoration Day (Way of the Dao)",
    shortName: "Laozi Day",
    dateFormatted: "24 Mar",
    month: 2,
    day: 24,
    icon: "☯️",
    category: "observance",
    badgeColor: "bg-slate-100 text-slate-900 border-slate-300 font-semibold",
    description: "Commemorating the ancient philosopher, author of the Tao Te Ching, and founder of philosophical Daoism.",
    greetingTheme: "Wu wei (effortless action), harmony with nature, humility, and the quiet flow of life."
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
    id: 'mahavira-jayanti',
    name: "Mahavir Jayanti (Birth of Lord Mahavira)",
    shortName: "Mahavir Jayanti",
    dateFormatted: "31 Mar",
    month: 2,
    day: 31,
    icon: "🪷",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-300 font-bold",
    description: "Celebration of the birth of Lord Mahavira, the 24th Tirthankara of Jainism and apostle of non-violence (Ahimsa) and truth.",
    greetingTheme: "Ahimsa (supreme non-violence), truth, self-restraint, and universal empathy.",
    isFloating: true,
  },

  // ==========================================
  // APRIL
  // ==========================================
  {
    id: 'bak-poya',
    name: "Bak Full Moon Poya Day",
    shortName: "Bak Poya",
    dateFormatted: "1 Apr",
    month: 3,
    day: 1,
    icon: "🌕",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "Marks the Buddha’s second visit to Sri Lanka (Nagadipa) to reconcile disputing Naga kings Chulodara and Mahodara.",
    greetingTheme: "Peaceful conflict resolution, harmony, reconciliation, and understanding.",
    isFloating: true,
  },
  {
    id: 'good-friday',
    name: "Good Friday",
    shortName: "Good Friday",
    dateFormatted: "3 Apr",
    month: 3,
    day: 3,
    icon: "✝️",
    category: "observance",
    badgeColor: "bg-slate-100 text-slate-900 border-slate-300 font-bold",
    description: "Solemn Christian holy day commemorating the passion, crucifixion, and redemptive sacrifice of Jesus Christ.",
    greetingTheme: "Grace, sacrifice, solemn reflection, and unconditional love.",
    isFloating: true,
  },
  {
    id: 'easter-sunday',
    name: "Easter Sunday (Resurrection Festival)",
    shortName: "Easter",
    dateFormatted: "5 Apr",
    month: 3,
    day: 5,
    icon: "🕊️",
    category: "festive",
    badgeColor: "bg-amber-50 text-amber-950 border-amber-300 font-bold",
    description: "Joyous Christian festival celebrating the glorious resurrection of Jesus Christ and new life.",
    greetingTheme: "Resurrection hope, rebirth, renewal, and joyful family celebrations.",
    isFloating: true,
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
    id: 'songkran-theravada-new-year',
    name: "Songkran & Traditional Theravada Buddhist New Year",
    shortName: "Songkran / Avurudda",
    dateFormatted: "13 Apr",
    month: 3,
    day: 13,
    icon: "💧",
    category: "festive",
    badgeColor: "bg-sky-100 text-sky-950 border-sky-300 font-bold",
    description: "Traditional Solar New Year celebrated across Sri Lanka (Aluth Avurudda), Thailand, Myanmar, Cambodia, and Laos with water blessings.",
    greetingTheme: "Cleansing renewal, filial respect, blessings of water, and vibrant joy."
  },
  {
    id: 'vaisakhi',
    name: "Vaisakhi (Baisakhi Harvest & Khalsa Day)",
    shortName: "Vaisakhi",
    dateFormatted: "13 Apr",
    month: 3,
    day: 13,
    icon: "🌾",
    category: "festive",
    badgeColor: "bg-orange-100 text-orange-950 border-orange-300 font-bold",
    description: "Historic Sikh celebration of the founding of the Khalsa panth by Guru Gobind Singh Ji in 1699 and traditional spring harvest.",
    greetingTheme: "Courage, righteousness, harvest celebration, and vibrant heritage."
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
    id: 'leonardo-da-vinci-day',
    name: "Leonardo da Vinci's Birth Anniversary (World Art & Polymath Day)",
    shortName: "Leonardo da Vinci Day",
    dateFormatted: "15 Apr",
    month: 3,
    day: 15,
    icon: "🎨",
    category: "observance",
    badgeColor: "bg-amber-50 text-amber-900 border-amber-200 font-semibold",
    description: "Commemorating the quintessential Renaissance polymath, painter of the Mona Lisa, engineer, and anatomical visionary.",
    greetingTheme: "Polymath mastery, harmonious art and science, and limitless curiosity."
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

  // ==========================================
  // MAY
  // ==========================================
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
    id: 'vesak-poya',
    name: "Vesak Full Moon Poya (Buddha Purnima)",
    shortName: "Vesak Poya",
    dateFormatted: "1 May",
    month: 4,
    day: 1,
    icon: "🪷",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "The most sacred Buddhist festival worldwide commemorating the Birth, Enlightenment, and Parinirvana of Gautama Buddha.",
    greetingTheme: "Peace, wisdom, loving-kindness (Metta), compassion, and inner serenity.",
    isFloating: true,
  },
  {
    id: 'national-nurses-day',
    name: "National Nurses Day",
    shortName: "Nurses Day",
    dateFormatted: "6 May",
    month: 4,
    day: 6,
    icon: "🩺",
    category: "observance",
    badgeColor: "bg-teal-100 text-teal-900 border-teal-300 font-semibold",
    description: "Honoring the extraordinary compassion, professional courage, and steadfast care of nurses worldwide.",
    greetingTheme: "Compassion, healing touch, patient care dedication, and selfless service."
  },
  {
    id: 'international-no-diet-day',
    name: "International No Diet Day",
    shortName: "No Diet Day",
    dateFormatted: "6 May",
    month: 4,
    day: 6,
    icon: "🌿",
    category: "international",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold",
    description: "Global annual celebration of body acceptance, diversity, self-compassion, and healthy relationships with food.",
    greetingTheme: "Body positivity, self-love, wholesome wellness, and acceptance."
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
    id: 'adi-shankaracharya-day',
    name: "Adi Shankaracharya Jayanti",
    shortName: "Adi Shankaracharya Day",
    dateFormatted: "21 May",
    month: 4,
    day: 21,
    icon: "🕉️",
    category: "observance",
    badgeColor: "bg-orange-50 text-orange-900 border-orange-200 font-semibold",
    description: "Commemorating the legendary Indian philosopher who consolidated the doctrine of Advaita Vedanta (Non-dualism).",
    greetingTheme: "Non-dual awareness (Advaita), supreme knowledge (Jnana), and philosophical clarity.",
    isFloating: true,
  },
  {
    id: 'nagarjuna-day',
    name: "Acharya Nagarjuna Commemorative Day",
    shortName: "Nagarjuna Day",
    dateFormatted: "23 May",
    month: 4,
    day: 23,
    icon: "📜",
    category: "observance",
    badgeColor: "bg-amber-50 text-amber-900 border-amber-200 font-semibold",
    description: "Commemorating the profound Buddhist master who systematized the Middle Way (Madhyamaka) philosophy and Sunyata.",
    greetingTheme: "Profound wisdom, non-dual perception, interdependent origination, and philosophical depth."
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
    id: 'poson-poya',
    name: "Poson Full Moon Poya Day",
    shortName: "Poson Poya",
    dateFormatted: "30 May",
    month: 4,
    day: 30,
    icon: "☸️",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "Commemorates the historic introduction of Buddhism to Sri Lanka by Arahat Mahinda Thero at Mihintale in the 3rd century BCE.",
    greetingTheme: "Spiritual renewal, peace, Buddhist heritage, and Dhamma wisdom.",
    isFloating: true,
  },

  // ==========================================
  // JUNE
  // ==========================================
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
    id: 'islamic-new-year',
    name: "Islamic New Year (Hijri 1 Muharram)",
    shortName: "Hijri New Year",
    dateFormatted: "16 Jun",
    month: 5,
    day: 16,
    icon: "🌙",
    category: "festive",
    badgeColor: "bg-emerald-100 text-emerald-950 border-emerald-300 font-bold",
    description: "Beginning of the Islamic lunar calendar year commemorating the historic migration (Hijrah).",
    greetingTheme: "New beginnings, spiritual resilience, unity, and peaceful aspirations.",
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
    id: 'alan-turing-day',
    name: "Alan Turing's Birth Anniversary (Computing & AI Pioneer Day)",
    shortName: "Alan Turing Day",
    dateFormatted: "23 Jun",
    month: 5,
    day: 23,
    icon: "💻",
    category: "observance",
    badgeColor: "bg-cyan-50 text-cyan-900 border-cyan-200 font-semibold",
    description: "Honoring the mathematical genius, Enigma codebreaker, and father of modern computer science and artificial intelligence.",
    greetingTheme: "Computational brilliance, algorithmic innovation, and integrity."
  },
  {
    id: 'ashura',
    name: "Day of Ashura (10 Muharram)",
    shortName: "Ashura",
    dateFormatted: "25 Jun",
    month: 5,
    day: 25,
    icon: "🕊️",
    category: "observance",
    badgeColor: "bg-emerald-50 text-emerald-950 border-emerald-200 font-bold",
    description: "Sacred day of remembrance, moral steadfastness, and commemoration of Imam Hussain at Karbala.",
    greetingTheme: "Moral steadfastness, justice, patience, and solemn reflection.",
    isFloating: true,
  },
  {
    id: 'sant-kabir-day',
    name: "Sant Kabir Jayanti",
    shortName: "Sant Kabir Day",
    dateFormatted: "30 Jun",
    month: 5,
    day: 30,
    icon: "🪕",
    category: "observance",
    badgeColor: "bg-amber-50 text-amber-900 border-amber-200 font-semibold",
    description: "Celebrating the mystic poet and saint whose timeless verses preached divine unity and transcended religious boundaries.",
    greetingTheme: "Inward spiritual truth, universal brotherhood, poetic wisdom, and simplicity.",
    isFloating: true,
  },

  // ==========================================
  // JULY
  // ==========================================
  {
    id: 'dalai-lama-birthday',
    name: "The 14th Dalai Lama's Birthday (Tenzin Gyatso)",
    shortName: "Dalai Lama's Birthday",
    dateFormatted: "6 Jul",
    month: 6,
    day: 6,
    icon: "🕊️",
    category: "observance",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "Celebrating the birth anniversary of His Holiness the 14th Dalai Lama, global ambassador of peace, compassion, and interfaith harmony.",
    greetingTheme: "Universal responsibility, warm-hearted kindness, secular ethics, and global peace."
  },
  {
    id: 'nikola-tesla-day',
    name: "Nikola Tesla's Birth Anniversary (Nikola Tesla Day)",
    shortName: "Nikola Tesla Day",
    dateFormatted: "10 Jul",
    month: 6,
    day: 10,
    icon: "⚡",
    category: "observance",
    badgeColor: "bg-sky-50 text-sky-900 border-sky-300 font-semibold",
    description: "Celebrating the revolutionary electrical engineer and inventor of the alternating current (AC) power system.",
    greetingTheme: "Visionary engineering, alternating current power, and futuristic innovation."
  },
  {
    id: 'padmasambhava-day',
    name: "Guru Padmasambhava Day (Guru Rinpoche)",
    shortName: "Guru Rinpoche Day",
    dateFormatted: "10 Jul",
    month: 6,
    day: 10,
    icon: "🪷",
    category: "festive",
    badgeColor: "bg-red-50 text-red-900 border-red-300 font-bold",
    description: "Celebrating Guru Rinpoche, the Lotus-Born Master who established Vajrayana Buddhism in Tibet and authored treasure texts (termas).",
    greetingTheme: "Tantric wisdom, spiritual protection, boundless courage, and transformation."
  },
  {
    id: 'nelson-mandela-day',
    name: "Nelson Mandela International Day (Freedom & Peace)",
    shortName: "Nelson Mandela Day",
    dateFormatted: "18 Jul",
    month: 6,
    day: 18,
    icon: "🕊️",
    category: "international",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-300 font-semibold",
    description: "UN international day honoring the South African anti-apartheid leader, Nobel laureate, and global icon of reconciliation.",
    greetingTheme: "Compassion, human rights, forgiveness, freedom, and democratic dignity."
  },
  {
    id: 'esala-poya',
    name: "Esala Full Moon Poya Day",
    shortName: "Esala Poya",
    dateFormatted: "28 Jul",
    month: 6,
    day: 28,
    icon: "🌕",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "Commemorates the Buddha’s first sermon (Dhammacakkappavattana Sutta) at Deer Park, conception of Prince Siddhartha, and the Kandy Esala Perahera.",
    greetingTheme: "Turning of the Dhamma wheel, sacred devotion, cultural heritage, and enlightenment.",
    isFloating: true,
  },
  {
    id: 'asalha-puja',
    name: "Asalha Puja (Dhamma Day)",
    shortName: "Asalha Puja",
    dateFormatted: "28 Jul",
    month: 6,
    day: 28,
    icon: "☸️",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "Celebrating the Buddha's first discourse on the Four Noble Truths to the five ascetics, setting in motion the Wheel of Dhamma.",
    greetingTheme: "Four Noble Truths, Noble Eightfold Path, wisdom, and spiritual liberation.",
    isFloating: true,
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

  // ==========================================
  // AUGUST
  // ==========================================
  {
    id: 'alexander-fleming-day',
    name: "Sir Alexander Fleming's Birth Anniversary",
    shortName: "Alexander Fleming Day",
    dateFormatted: "6 Aug",
    month: 7,
    day: 6,
    icon: "🔬",
    category: "observance",
    badgeColor: "bg-teal-50 text-teal-900 border-teal-200 font-semibold",
    description: "Commemorating the Scottish microbiologist who revolutionized modern medicine by discovering penicillin.",
    greetingTheme: "Life-saving biomedical innovation, serendipity, and medical humanitarianism."
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
    id: 'mawlid-al-nabi',
    name: "Mawlid al-Nabi (Prophet's Birthday)",
    shortName: "Mawlid al-Nabi",
    dateFormatted: "25 Aug",
    month: 7,
    day: 25,
    icon: "🕌",
    category: "festive",
    badgeColor: "bg-emerald-100 text-emerald-950 border-emerald-300 font-bold",
    description: "Commemoration of the birth of the Prophet Muhammad (PBUH) on 12 Rabi' al-Awwal.",
    greetingTheme: "Universal mercy, compassion, moral nobility, and spiritual blessings.",
    isFloating: true,
  },
  {
    id: 'nikini-poya',
    name: "Nikini Full Moon Poya Day",
    shortName: "Nikini Poya",
    dateFormatted: "27 Aug",
    month: 7,
    day: 27,
    icon: "🌕",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "Marks the commencement of Pasu Vas (rainy retreat for monks) and the convocation of the First Buddhist Council by Arahat Kassapa.",
    greetingTheme: "Meditation, discipline, monastic dedication, and spiritual reflection.",
    isFloating: true,
  },

  // ==========================================
  // SEPTEMBER
  // ==========================================
  {
    id: 'krishna-janmashtami',
    name: "Krishna Janmashtami",
    shortName: "Janmashtami",
    dateFormatted: "4 Sep",
    month: 8,
    day: 4,
    icon: "🪈",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-300 font-bold",
    description: "Celebration of the birth of Lord Krishna, embodiment of divine joy, love, righteousness, and the Bhagavad Gita.",
    greetingTheme: "Divine joy, righteous wisdom (Dharma), playful cheer, and prosperity.",
    isFloating: true,
  },
  {
    id: 'rosh-hashanah',
    name: "Rosh Hashanah (Jewish New Year)",
    shortName: "Rosh Hashanah",
    dateFormatted: "12 Sep",
    month: 8,
    day: 12,
    icon: "🍯",
    category: "festive",
    badgeColor: "bg-blue-100 text-blue-950 border-blue-300 font-bold",
    description: "The Jewish New Year celebrating the creation of the world, marked by sounding the shofar and dipping apples in honey.",
    greetingTheme: "Shanah Tovah, a sweet and prosperous new year, peace, and renewal.",
    isFloating: true,
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
    id: 'yom-kippur',
    name: "Yom Kippur (Day of Atonement)",
    shortName: "Yom Kippur",
    dateFormatted: "21 Sep",
    month: 8,
    day: 21,
    icon: "✡️",
    category: "observance",
    badgeColor: "bg-indigo-100 text-indigo-950 border-indigo-300 font-bold",
    description: "The holiest day in Judaism, observed with a 25-hour fast, prayer, and deep spiritual repentance.",
    greetingTheme: "Gmar Chatimah Tovah, spiritual atonement, deep inner peace, and reconciliation.",
    isFloating: true,
  },
  {
    id: 'binara-poya',
    name: "Binara Full Moon Poya Day",
    shortName: "Binara Poya",
    dateFormatted: "25 Sep",
    month: 8,
    day: 25,
    icon: "🌕",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "Commemorates the historic establishment of the Bhikkhuni Sasana (Order of Buddhist Nuns) with Queen Mahapajapati Gotami.",
    greetingTheme: "Gender equality in spirituality, women's empowerment, devotion, and compassion.",
    isFloating: true,
  },
  {
    id: 'madhu-purnima',
    name: "Madhu Purnima (Honey Full Moon Festival)",
    shortName: "Madhu Purnima",
    dateFormatted: "25 Sep",
    month: 8,
    day: 25,
    icon: "🍯",
    category: "festive",
    badgeColor: "bg-yellow-100 text-yellow-950 border-yellow-400 font-bold",
    description: "Commemorating the retreat of the Buddha in the Parileyyaka forest where a monkey offered honeycomb and an elephant served water.",
    greetingTheme: "Harmony, animal friendship, selfless service, sweet devotion, and reconciliation.",
    isFloating: true,
  },
  {
    id: 'confucius-day',
    name: "Confucius' Birth Anniversary (Teachers' & Moral Wisdom Day)",
    shortName: "Confucius Day",
    dateFormatted: "28 Sep",
    month: 8,
    day: 28,
    icon: "📜",
    category: "observance",
    badgeColor: "bg-stone-100 text-stone-900 border-stone-300 font-semibold",
    description: "Celebrating the ancient Chinese philosopher whose teachings on Ren (benevolence), filial piety, and social harmony shaped Asian civilization.",
    greetingTheme: "Benevolence (Ren), social harmony, moral rectitude, and lifelong learning."
  },
  {
    id: 'dogen-zenji-day',
    name: "Dogen Zenji Memorial Day (Founder of Soto Zen)",
    shortName: "Dogen Zenji Day",
    dateFormatted: "29 Sep",
    month: 8,
    day: 29,
    icon: "🧘",
    category: "observance",
    badgeColor: "bg-slate-100 text-slate-900 border-slate-300 font-semibold",
    description: "Commemorating Japanese Zen philosopher Dogen Kigen, author of the Shobogenzo and founder of the Soto Zen lineage of Shikantaza.",
    greetingTheme: "Just sitting (Shikantaza), presence in the current moment, and finding the sacred in everyday practice."
  },
  {
    id: 'rumi-commemoration-day',
    name: "Jalal al-Din Rumi Commemoration Day",
    shortName: "Rumi Commemoration",
    dateFormatted: "30 Sep",
    month: 8,
    day: 30,
    icon: "📜",
    category: "observance",
    badgeColor: "bg-teal-50 text-teal-900 border-teal-200 font-semibold",
    description: "Commemorating the 13th-century Persian Sufi mystic, poet, and teacher of transcendent divine love, tolerance, and spiritual reunion.",
    greetingTheme: "Transcendent divine love, ecstasy, inner surrender, and spiritual unity."
  },

  // ==========================================
  // OCTOBER
  // ==========================================
  {
    id: 'mahatma-gandhi-day',
    name: "Mahatma Gandhi's Birth Anniversary (International Day of Non-Violence)",
    shortName: "Mahatma Gandhi Day",
    dateFormatted: "2 Oct",
    month: 9,
    day: 2,
    icon: "🕊️",
    category: "international",
    badgeColor: "bg-stone-100 text-stone-900 border-stone-300 font-semibold",
    description: "Honoring the leader of India's independence movement and apostle of non-violence (Ahimsa) and truth (Satyagraha).",
    greetingTheme: "Truth, non-violence, moral rectitude, self-reliance, and peaceful change."
  },
  {
    id: 'bodhidharma-day',
    name: "Bodhidharma Memorial Day (Founder of Chan / Zen Buddhism)",
    shortName: "Bodhidharma Day",
    dateFormatted: "5 Oct",
    month: 9,
    day: 5,
    icon: "🧘",
    category: "observance",
    badgeColor: "bg-stone-100 text-stone-900 border-stone-300 font-semibold",
    description: "Honoring the semi-legendary Indian master who traveled to China and founded Chan (Zen) Buddhism and Shaolin meditation.",
    greetingTheme: "Direct perception of reality, zazen stillness, mental fortitude, and inner clarity."
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
    id: 'thich-nhat-hanh-day',
    name: "Thich Nhat Hanh's Birth Anniversary (Engaged Buddhism & Mindfulness)",
    shortName: "Thich Nhat Hanh Day",
    dateFormatted: "11 Oct",
    month: 9,
    day: 11,
    icon: "🍃",
    category: "observance",
    badgeColor: "bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold",
    description: "Commemorating the beloved Vietnamese Zen master, peace activist, and author who brought Engaged Buddhism and mindfulness to the world.",
    greetingTheme: "Peace in every step, mindful breathing, gentle compassion, and reconciliation."
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
    id: 'apj-abdul-kalam-day',
    name: "Dr. A.P.J. Abdul Kalam's Birth Anniversary (World Students' Day)",
    shortName: "A.P.J. Abdul Kalam Day",
    dateFormatted: "15 Oct",
    month: 9,
    day: 15,
    icon: "🚀",
    category: "observance",
    badgeColor: "bg-violet-50 text-violet-900 border-violet-200 font-semibold",
    description: "Celebrating India's 'Missile Man' and former President, beloved aerospace pioneer and inspirational mentor to youth.",
    greetingTheme: "Youth empowerment, soaring dreams, scientific integrity, and humble leadership."
  },
  {
    id: 'durga-puja',
    name: "Durga Puja (Maha Ashtami & Vijayadashami)",
    shortName: "Durga Puja",
    dateFormatted: "20 Oct",
    month: 9,
    day: 20,
    icon: "🔱",
    category: "festive",
    badgeColor: "bg-red-100 text-red-950 border-red-300 font-bold",
    description: "Grand celebration of Goddess Durga's triumph over Mahishasura, symbolizing strength and the victory of good over evil.",
    greetingTheme: "Courage, victory of righteousness, community warmth, and divine festive blessings.",
    isFloating: true,
  },
  {
    id: 'vap-poya',
    name: "Vap Full Moon Poya Day",
    shortName: "Vap Poya",
    dateFormatted: "25 Oct",
    month: 9,
    day: 25,
    icon: "🌕",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "Marks the end of the rainy retreat (Vassana), Katina Cheewara pinkama offerings, and sending emissaries to Emperor Ashoka for Sanghamitta Theri.",
    greetingTheme: "Generosity (Dana), merit-making, gratitude, and community harmony.",
    isFloating: true,
  },
  {
    id: 'kathina-pavarana',
    name: "Kathina & Pavarana Robe-Offering Ceremony",
    shortName: "Kathina Ceremony",
    dateFormatted: "25 Oct",
    month: 9,
    day: 25,
    icon: "🪷",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "Sacred Buddhist festival marking the conclusion of the three-month Vassana retreat and the offering of Kathina Cheewara robes to the Sangha.",
    greetingTheme: "Generosity (Dana), merit-making, monastic support, and joyful spiritual harmony.",
    isFloating: true,
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

  // ==========================================
  // NOVEMBER
  // ==========================================
  {
    id: 'marie-curie-day',
    name: "Marie Curie's Birth Anniversary",
    shortName: "Marie Curie Day",
    dateFormatted: "7 Nov",
    month: 10,
    day: 7,
    icon: "🧪",
    category: "observance",
    badgeColor: "bg-fuchsia-50 text-fuchsia-900 border-fuchsia-200 font-semibold",
    description: "Commemorating the only person to win Nobel Prizes in two different scientific fields (Physics and Chemistry) for discovering radium and polonium.",
    greetingTheme: "Pioneering scientific courage, discovery of radioactivity, and perseverance."
  },
  {
    id: 'diwali',
    name: "Diwali (Deepavali / Festival of Lights)",
    shortName: "Diwali",
    dateFormatted: "8 Nov",
    month: 10,
    day: 8,
    icon: "🪔",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "Great festival of lights celebrating the spiritual triumph of light over darkness, good over evil, and wisdom over ignorance.",
    greetingTheme: "Glowing lights, joyful prosperity, sweet blessings, and radiant happiness.",
    isFloating: true,
  },
  {
    id: 'atisha-day',
    name: "Atisha Dipankara Srijnana Commemorative Day",
    shortName: "Atisha Day",
    dateFormatted: "18 Nov",
    month: 10,
    day: 18,
    icon: "☸️",
    category: "observance",
    badgeColor: "bg-amber-50 text-amber-900 border-amber-300 font-semibold",
    description: "Honoring the Bengali Buddhist master and scholar of Nalanda and Vikramashila who revitalized Buddhism in Tibet and authored Bodhipathapradipa.",
    greetingTheme: "Mind training (Lojong), compassionate scholarly light, and bodhicitta."
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
    id: 'ill-poya',
    name: "Ill (Il) Full Moon Poya Day",
    shortName: "Ill Poya",
    dateFormatted: "23 Nov",
    month: 10,
    day: 23,
    icon: "🌕",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "Marks the dispatch of the first 60 Arahat missionaries and the prediction of the future Maitreya Buddha.",
    greetingTheme: "Missionary dedication, selfless service, Dhamma propagation, and hope.",
    isFloating: true,
  },
  {
    id: 'guru-nanak-jayanti',
    name: "Gurpurab (Guru Nanak Jayanti)",
    shortName: "Guru Nanak Jayanti",
    dateFormatted: "23 Nov",
    month: 10,
    day: 23,
    icon: "☬",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "Sacred Gurpurab celebrating the birth of Guru Nanak Dev Ji, founder of Sikhism and apostle of oneness (Ik Onkar) and selfless service.",
    greetingTheme: "Divine oneness, honest living (Kirat Karo), selfless service (Seva), and community harmony.",
    isFloating: true,
  },

  // ==========================================
  // DECEMBER
  // ==========================================
  {
    id: 'hanukkah',
    name: "Hanukkah (Chanukah / Festival of Lights)",
    shortName: "Hanukkah",
    dateFormatted: "4 Dec",
    month: 11,
    day: 4,
    icon: "🕎",
    category: "festive",
    badgeColor: "bg-blue-100 text-blue-950 border-blue-400 font-bold",
    description: "Eight-day festival of lights commemorating the rededication of the Second Temple and the miracle of the menorah oil.",
    greetingTheme: "Chag Sameach, radiant candlelights, miracles, and festive cheer.",
    isFloating: true,
  },
  {
    id: 'bodhi-day',
    name: "Bodhi Day (Rohatsu - Enlightenment Day)",
    shortName: "Bodhi Day",
    dateFormatted: "8 Dec",
    month: 11,
    day: 8,
    icon: "🌳",
    category: "festive",
    badgeColor: "bg-emerald-100 text-emerald-950 border-emerald-400 font-bold",
    description: "Global Mahayana and Zen observance commemorating Gautama Buddha's supreme enlightenment under the Bodhi tree at Bodh Gaya.",
    greetingTheme: "Awakening, deep meditation, supreme enlightenment, and universal compassion."
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
    id: 'ada-lovelace-day',
    name: "Ada Lovelace Day (First Computer Programmer)",
    shortName: "Ada Lovelace Day",
    dateFormatted: "10 Dec",
    month: 11,
    day: 10,
    icon: "⌨️",
    category: "observance",
    badgeColor: "bg-pink-50 text-pink-900 border-pink-200 font-semibold",
    description: "Celebrating the world's first computer programmer who authored the earliest algorithm for Babbage's Analytical Engine.",
    greetingTheme: "Poetical science, visionary software architecture, and women leadership in STEM."
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
    id: 'unduvap-poya',
    name: "Unduvap Full Moon Poya Day",
    shortName: "Unduvap Poya",
    dateFormatted: "23 Dec",
    month: 11,
    day: 23,
    icon: "🌕",
    category: "festive",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-400 font-bold",
    description: "Celebrates Sanghamitta Theri bringing the sacred Jaya Sri Maha Bodhi sapling to Anuradhapura and establishing the Bhikkhuni Order.",
    greetingTheme: "Sacred roots, deep Buddhist heritage, spiritual resilience, and reverence.",
    isFloating: true,
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

  const list = GLOBAL_SPECIAL_DAYS.map((sd) => {
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

  // Keep events sorted chronologically by month and day
  return list.sort((a, b) => {
    if (a.month !== b.month) return a.month - b.month;
    return a.day - b.day;
  });
}
