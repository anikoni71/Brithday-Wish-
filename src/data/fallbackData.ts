import { TeamMember } from '../types';
import { checkIsTodayBirthday } from '../utils/dateUtils';

export function getDemoTeamMembers(): TeamMember[] {
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  const todayBdayStr = `${todayMonth}/${todayDay}`;

  return [
    {
      sl: "1",
      id: "Z0876",
      name: "Danushka Wanniarachchi",
      designation: "Manager (IE)",
      birthday: "1/15",
      mobile: "+8801711001122",
      email: "danushka.w@kdsgroup.net",
      whatsapp: "8801711001122",
      wishingMessage: "Happy Birthday, Danushka! Wishing you leadership excellence and great success this year from IE Central Team. 🎂",
      isBirthdayToday: checkIsTodayBirthday("1/15"),
      lastSentYear: ""
    },
    {
      sl: "2",
      id: "Z1281",
      name: "Anik Barua",
      designation: "Sr. Executive (IE Central)",
      birthday: "2/21",
      mobile: "8801815378940",
      email: "anik.barua@kdsgroup.net",
      whatsapp: "8801815378940",
      wishingMessage: "Happy Birthday, Anik! Wishing you a joyous celebration, good health, and prosperous milestones ahead! 🎉",
      isBirthdayToday: checkIsTodayBirthday("2/21"),
      lastSentYear: ""
    },
    {
      sl: "3",
      id: "Y1500",
      name: "Zahid Ul Hasan Ripon",
      designation: "Executive (Work Study)",
      birthday: "3/10",
      mobile: "+8801819223344",
      email: "zahid.ripon@kdsgroup.net",
      whatsapp: "8801819223344",
      wishingMessage: "Happy Birthday, Zahid! Wishing you a wonderful birthday filled with joy and productivity. 🌟",
      isBirthdayToday: checkIsTodayBirthday("3/10"),
      lastSentYear: ""
    },
    {
      sl: "4",
      id: "Y1785",
      name: "Syed Arifur Rahman",
      designation: "Executive (Process Flow)",
      birthday: "4/18",
      mobile: "+8801817556677",
      email: "arifur.rahman@kdsgroup.net",
      whatsapp: "8801817556677",
      wishingMessage: "Happy Birthday, Syed! Wishing you a fantastic year filled with achievements and happiness. 🎈",
      isBirthdayToday: checkIsTodayBirthday("4/18"),
      lastSentYear: ""
    },
    {
      sl: "5",
      id: "Y1504",
      name: "Md. Khalid Hossain Rasij",
      designation: "Executive (Capacity Planning)",
      birthday: "5/06",
      mobile: "+8801814998877",
      email: "khalid.rasij@kdsgroup.net",
      whatsapp: "8801814998877",
      wishingMessage: "Happy Birthday, Md. Khalid! Wishing you continuous growth and celebration on your special day! ✨",
      isBirthdayToday: checkIsTodayBirthday("5/06"),
      lastSentYear: ""
    },
    {
      sl: "6",
      id: "Z1107",
      name: "Abdulla Al Mahmud",
      designation: "Executive (Line Balancing)",
      birthday: "6/22",
      mobile: "+8801823114455",
      email: "abdulla.mahmud@kdsgroup.net",
      whatsapp: "8801823114455",
      wishingMessage: "Happy Birthday, Abdulla! Wishing you a very happy birthday and great times ahead. 🎁",
      isBirthdayToday: checkIsTodayBirthday("6/22"),
      lastSentYear: ""
    },
    {
      sl: "7",
      id: "Y1855",
      name: "Bishnu Dhar",
      designation: "Jr. Executive (IE Central)",
      birthday: "7/13",
      mobile: "+8801833445566",
      email: "bishnu.dhar@kdsgroup.net",
      whatsapp: "8801833445566",
      wishingMessage: "Happy Birthday, Bishnu! Wishing you joy, good health, and boundless enthusiasm for the future! 🍰",
      isBirthdayToday: checkIsTodayBirthday("7/13"),
      lastSentYear: ""
    },
    {
      sl: "8",
      id: "Z1287",
      name: "Farhad Hossain",
      designation: "Executive (IE Projects)",
      birthday: "8/4",
      mobile: "8801826116363",
      email: "farhad.hossain@kdsgroup.net",
      whatsapp: "8801826116363",
      wishingMessage: "Happy Birthday, Farhad! May your day be filled with happiness and your year with accomplishments. 🎉",
      isBirthdayToday: checkIsTodayBirthday("8/4"),
      lastSentYear: ""
    },
    {
      sl: "9",
      id: "S1640",
      name: "Dipankar Barua",
      designation: "IE Specialist",
      birthday: todayBdayStr,
      mobile: "8801829870593",
      email: "dipankar.barua@kdsgroup.net",
      whatsapp: "8801829870593",
      wishingMessage: "Happy Birthday, Dipankar! Wishing you a great day from the IE Central Team with joy and success! 🎂🎉",
      isBirthdayToday: true,
      lastSentYear: ""
    },
    {
      sl: "10",
      id: "Y1041",
      name: "Sudipta Barua",
      designation: "Executive (SMV Analysis)",
      birthday: "9/19",
      mobile: "+8801844556677",
      email: "sudipta.barua@kdsgroup.net",
      whatsapp: "8801844556677",
      wishingMessage: "Happy Birthday, Sudipta! Wishing you an exceptional day and continued prosperity in the team. 🎈",
      isBirthdayToday: checkIsTodayBirthday("9/19"),
      lastSentYear: ""
    },
    {
      sl: "11",
      id: "Y1683",
      name: "Farjana Faria",
      designation: "MTO (Industrial Engineering)",
      birthday: "10/20",
      mobile: "+8801855667788",
      email: "farjana.faria@kdsgroup.net",
      whatsapp: "8801855667788",
      wishingMessage: "Happy Birthday, Farjana! Wishing you bright opportunities, happiness, and a splendid celebration today! 💐",
      isBirthdayToday: checkIsTodayBirthday("10/20"),
      lastSentYear: ""
    },
    {
      sl: "12",
      id: "G0898",
      name: "Samon Ara",
      designation: "Technical IE Coordinator",
      birthday: "11/14",
      mobile: "+8801866778899",
      email: "samon.ara@kdsgroup.net",
      whatsapp: "8801866778899",
      wishingMessage: "Happy Birthday, Samon! Wishing you peace, happiness, and continued success across all goals. 🎊",
      isBirthdayToday: checkIsTodayBirthday("11/14"),
      lastSentYear: ""
    },
    {
      sl: "13",
      id: "Z1279",
      name: "Irfan Alam",
      designation: "MTO (IE Operations)",
      birthday: "12/25",
      mobile: "+8801877889900",
      email: "irfan.alam@kdsgroup.net",
      whatsapp: "8801877889900",
      wishingMessage: "Happy Birthday, Irfan! Wishing you a joyful birthday, good health, and rewarding achievements. 🎄🎉",
      isBirthdayToday: checkIsTodayBirthday("12/25"),
      lastSentYear: ""
    },
    {
      sl: "14",
      id: "Z1337",
      name: "MD. Tareq",
      designation: "Executive (IE Central)",
      birthday: "8/15",
      mobile: "8801888990011",
      email: "tareq.ie@kdsgroup.net",
      whatsapp: "8801888990011",
      wishingMessage: "Happy Birthday, MD. Tareq! Wishing you great milestones, good health, and joyful moments today. 🎁",
      isBirthdayToday: checkIsTodayBirthday("8/15"),
      lastSentYear: ""
    },
    {
      sl: "15",
      id: "Z1338",
      name: "MD. Asif Jaman",
      designation: "Executive (Work Methods)",
      birthday: "8/28",
      mobile: "8801899001122",
      email: "asif.jaman@kdsgroup.net",
      whatsapp: "8801899001122",
      wishingMessage: "Happy Birthday, MD. Asif! Wishing you all the best and celebration from the entire IE team! ✨",
      isBirthdayToday: checkIsTodayBirthday("8/28"),
      lastSentYear: ""
    }
  ];
}
