import { TeamMember } from '../types';
import { checkIsTodayBirthday } from '../utils/dateUtils';

// Real baseline team roster matching the official Google Sheet records
export const REAL_IE_TEAM_ROSTER: TeamMember[] = [
  {
    sl: "1",
    id: "Z0876",
    name: "Danushka Wanniarachchi",
    designation: "Manager",
    birthday: "6th May",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Danushka! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("6th May"),
    lastSentYear: ""
  },
  {
    sl: "3",
    id: "Y1500",
    name: "Zahid Ul Hasan Ripon",
    designation: "Executive",
    birthday: "21st Feb",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Zahid! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("21st Feb"),
    lastSentYear: ""
  },
  {
    sl: "4",
    id: "Y1785",
    name: "Syed Arifur Rahman",
    designation: "Executive",
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
    designation: "Executive",
    birthday: "17th Apr",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Md. Khalid! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("17th Apr"),
    lastSentYear: ""
  },
  {
    sl: "6",
    id: "Z1107",
    name: "Abdulla Al Mahmud",
    designation: "Executive",
    birthday: "31st May",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Abdulla! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("31st May"),
    lastSentYear: ""
  },
  {
    sl: "7",
    id: "Y1855",
    name: "Bishnu Dhar",
    designation: "Jr. Executive",
    birthday: "13th Sep",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Bishnu! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("13th Sep"),
    lastSentYear: ""
  },
  {
    sl: "8",
    id: "Y1041",
    name: "Sudipta Barua",
    designation: "Executive",
    birthday: "29th Feb",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Sudipta! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("29th Feb"),
    lastSentYear: ""
  },
  {
    sl: "9",
    id: "Y1683",
    name: "Farjana Faria",
    designation: "MTO",
    birthday: "13th Jul",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Farjana! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("13th Jul"),
    lastSentYear: ""
  },
  {
    sl: "10",
    id: "G0898",
    name: "Samon Ara",
    designation: "Technical",
    birthday: "",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Samon! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: false,
    lastSentYear: ""
  },
  {
    sl: "11",
    id: "Z1279",
    name: "Irfan Alam",
    designation: "MTO",
    birthday: "20th Oct",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Irfan! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("20th Oct"),
    lastSentYear: ""
  },
  {
    sl: "12",
    id: "Z1281",
    name: "Anik Barua",
    designation: "Sr. Executive",
    birthday: "21st Feb",
    mobile: "8801815378940",
    email: "anik.barua@kdsgroup.net",
    whatsapp: "8801815378940",
    wishingMessage: "Happy Birthday, Anik! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("21st Feb"),
    lastSentYear: ""
  },
  {
    sl: "13",
    id: "Z1287",
    name: "Farhad Hossain",
    designation: "Executive",
    birthday: "4th Aug",
    mobile: "8801826116363",
    email: "farhad.hossain@kdsgroup.net",
    whatsapp: "8801826116363",
    wishingMessage: "Happy Birthday, Farhad! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("4th Aug"),
    lastSentYear: ""
  },
  {
    sl: "14",
    id: "",
    name: "Ranjith Sir",
    designation: "Advisor",
    birthday: "21st Dec",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Ranjith Sir! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("21st Dec"),
    lastSentYear: ""
  },
  {
    sl: "15",
    id: "",
    name: "Rohan Sir",
    designation: "Advisor",
    birthday: "17th Feb",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, Rohan Sir! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("17th Feb"),
    lastSentYear: ""
  },
  {
    sl: "16",
    id: "S1640",
    name: "Dipankar Barua",
    designation: "IE Specialist",
    birthday: "8/13",
    mobile: "8801829870593",
    email: "dipankar.barua@kdsgroup.net",
    whatsapp: "8801829870593",
    wishingMessage: "Happy Birthday, Dipankar! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("8/13"),
    lastSentYear: ""
  },
  {
    sl: "17",
    id: "Z1337",
    name: "MD. Tareq",
    designation: "Executive",
    birthday: "2nd April",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, MD. Tareq! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("2nd April"),
    lastSentYear: ""
  },
  {
    sl: "18",
    id: "Z1338",
    name: "MD. Asif Jaman",
    designation: "Executive",
    birthday: "4th Aug",
    mobile: "",
    email: "",
    whatsapp: "",
    wishingMessage: "Happy Birthday, MD. Asif Jaman! Wishing you a great day from the IE Central Team. 🎉",
    isBirthdayToday: checkIsTodayBirthday("4th Aug"),
    lastSentYear: ""
  }
];

export function getDemoTeamMembers(): TeamMember[] {
  return REAL_IE_TEAM_ROSTER.map((m) => ({
    ...m,
    isBirthdayToday: checkIsTodayBirthday(m.birthday)
  }));
}
