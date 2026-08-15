export function getAppsScriptCode(
  accountSid: string = '',
  authToken: string = '',
  whatsappNumber: string = 'whatsapp:+8801625299521',
  adminWhatsApp: string = 'whatsapp:+880163529951'
): string {
  return `/**
 * IE Central Team - ZERO-TOUCH 100% AUTOMATED DUAL-CHANNEL BIRTHDAY & FESTIVE WISHING SYSTEM
 * Google Apps Script for Google Sheet: "Central IE List"
 * 
 * SENDER HOSTING NUMBER: +8801625299521
 * DESIGNATED ADMIN / TEAM LEADER WHATSAPP: +880163529951
 * 
 * CORE CAPABILITIES & UPGRADES:
 * 1. ZERO-TOUCH 8:00 AM MORNING DISPATCH: Scans Column G for today's celebrants, resolves placeholders,
 *    and delivers birthday wishes via WhatsApp (+8801625299521) and automated Email (Column H/I).
 * 2. GLOBAL SPECIAL DAYS & FESTIVE CALENDAR AUTOMATED EMAIL ENGINE:
 *    Whenever a team member's birthday coincides with or falls in the festive window of a major global/national
 *    special day (Eid-ul-Fitr, Eid-ul-Adha, Pohela Boishakh, Christmas, Victory Day, Independence Day, New Year,
 *    Valentine's Day, etc.), the system automatically composes and delivers a warm, beautifully styled HTML Festive Email
 *    merging the special occasion's theme and personal blessings to their registered email (Column H/I).
 * 3. ADMIN ADVANCE BIRTHDAY PLANNING ALERTS (1 TO 3 DAYS AHEAD):
 *    Automated trigger (5:00 PM evening or 7:30 AM morning) scans for upcoming celebrants in the next
 *    1 to 3 days and sends a multi-channel briefing directly to Admin WhatsApp (+880163529951) and Admin Email.
 * 4. ADVANCE PLANNING VERIFICATION CHECKLIST:
 *    • Celebrant Name, Designation, & Department
 *    • Exact Birthday Date & Days Remaining ("Tomorrow", "In 2 days")
 *    • Festive Coincidence Indicator (e.g., "Coincides with Pohela Boishakh")
 *    • Verification Check: Confirms presence of WhatsApp in Col J, Email in Col H, and custom wish in Col K
 * 5. SMART DATE NORMALIZER: Seamlessly handles "6th May", "21st Feb", "4th Aug", "8/13", "08/04", "13-Aug", Excel serials.
 * 6. DYNAMIC MESSAGE PERSONALIZATION: Resolves {Name}, {Designation}, {Department}, {ID}, {Birthday}.
 * 7. DUPLICATE PREVENTION: Records current year in Column L ("Last Sent Year") to prevent duplicate sends.
 * 
 * QUICK SETUP:
 * 1. Open Google Sheet ("Central IE List") -> Extensions -> Apps Script.
 * 2. Paste this entire script into Code.gs.
 * 3. Run function 'setupAllTriggers' ONCE to install both 8:00 AM Dispatch & Advance Planning Triggers!
 */

// --- 1. SENDER HOSTING & ADMIN CONFIGURATION ---
var SENDER_WHATSAPP_NUMBER = "whatsapp:+8801625299521"; // Server Host Number
var ADMIN_WHATSAPP_NUMBER = "${adminWhatsApp || 'whatsapp:+880163529951'}"; // Designated Team Leader WhatsApp
var ADMIN_EMAIL = Session.getActiveUser().getEmail() || "admin.ie@kdsgroup.net"; // Auto-detects Google Account Email

// --- 2. API CREDENTIALS (AUTHENTICATION) ---
var API_ACCOUNT_SID = "${accountSid || ''}"; 
var API_AUTH_TOKEN = "${authToken || ''}";

// --- 3. SPREADSHEET SETTINGS ---
var SHEET_NAME = "Central IE List";

// --- 4. GLOBAL SPECIAL DAYS & FESTIVE CALENDAR REGISTRY ---
var GLOBAL_SPECIAL_DAYS_MAP = [
  { id: 'new-year-day', name: "New Year's Day", month: 0, day: 1, icon: "🎉", theme: "New Year joy, fresh beginnings, and ambitious annual resolutions." },
  { id: 'world-logic-day', name: "World Logic Day", month: 0, day: 14, icon: "🧠", theme: "Analytical clarity, problem-solving, and rational thinking." },
  { id: 'int-education-day', name: "International Day of Education", month: 0, day: 24, icon: "🎓", theme: "Lifelong learning, skill mastery, and empowering through knowledge." },
  { id: 'data-privacy-day', name: "Data Privacy Day", month: 0, day: 28, icon: "🔒", theme: "Data integrity, cybersecurity, and information protection excellence." },
  { id: 'world-cancer-day', name: "World Cancer Day", month: 1, day: 4, icon: "🎗️", theme: "Health awareness, compassionate care, and solidarity." },
  { id: 'valentine-day', name: "Valentine's Day", month: 1, day: 14, icon: "💖", theme: "Warmth, kindness, appreciation, and spreading happiness." },
  { id: 'int-mother-language-day', name: "Language Martyrs' Day (Ekushey February)", month: 1, day: 21, icon: "🌺", theme: "Tribute to 1952 Language Martyrs, linguistic heritage, and pride." },
  { id: 'int-womens-day', name: "International Women's Day", month: 2, day: 8, icon: "👩‍💼", theme: "Celebrating leadership, innovation, and women's achievements." },
  { id: 'pi-day', name: "International Day of Mathematics (Pi Day)", month: 2, day: 14, icon: "📐", theme: "Precision engineering, numerical optimization, and industrial analytics." },
  { id: 'bangladesh-independence-day', name: "Independence & National Day of Bangladesh", month: 2, day: 26, icon: "🇧🇩", theme: "National independence, patriotic valor, and nation-building." },
  { id: 'world-health-day', name: "World Health Day", month: 3, day: 7, icon: "🩺", theme: "Physical wellness, ergonomic safety, and workplace vitality." },
  { id: 'pohela-boishakh', name: "Pohela Boishakh (Bengali New Year 1433)", month: 3, day: 14, icon: "🌺", theme: "Shuvo Noboborsho! New cultural beginnings, harmony, and joy." },
  { id: 'earth-day', name: "World Earth Day", month: 3, day: 22, icon: "🌍", theme: "Environmental sustainability, green manufacturing, and eco-responsibility." },
  { id: 'world-book-day', name: "World Book & Copyright Day", month: 3, day: 23, icon: "📚", theme: "Intellectual discovery, continuous self-improvement, and reading." },
  { id: 'world-safety-day', name: "World Day for Safety and Health at Work", month: 3, day: 28, icon: "🦺", theme: "Industrial ergonomics, workplace safety standards, and team well-being." },
  { id: 'may-day', name: "International Workers' Day (May Day)", month: 4, day: 1, icon: "✊", theme: "Honoring labor rights, industrial workforce diligence, and dignity of work." },
  { id: 'press-freedom-day', name: "World Press Freedom Day", month: 4, day: 3, icon: "📰", theme: "Transparency, authentic communication, and professional honesty." },
  { id: 'world-environment-day', name: "World Environment Day", month: 5, day: 5, icon: "🌱", theme: "Clean environment, carbon footprint reduction, and energy efficiency." },
  { id: 'world-blood-donor-day', name: "World Blood Donor Day", month: 5, day: 14, icon: "🩸", theme: "Life-saving generosity, humanitarian spirit, and community solidarity." },
  { id: 'world-productivity-day', name: "World Productivity Day", month: 5, day: 20, icon: "⚡", theme: "Industrial Engineering excellence, lean operations, and process speed." },
  { id: 'world-youth-skills-day', name: "World Youth Skills Day", month: 6, day: 15, icon: "🛠️", theme: "Technical upskilling, operational empowerment, and youth mastery." },
  { id: 'world-chess-day', name: "World Chess Day", month: 6, day: 20, icon: "♟️", theme: "Strategic planning, foresight, and systematic operational execution." },
  { id: 'sysadmin-day', name: "System Administrator Appreciation Day", month: 6, day: 25, icon: "💻", theme: "Digital infrastructure uptime, cloud architecture, and IT resilience." },
  { id: 'bangladesh-mourning-day', name: "National Mourning Day", month: 7, day: 15, icon: "🕊️", theme: "Solemn remembrance, national dignity, and historical respect." },
  { id: 'world-humanitarian-day', name: "World Humanitarian Day", month: 7, day: 19, icon: "🤝", theme: "Selfless service, compassionate teamwork, and helping others." },
  { id: 'int-literacy-day', name: "International Literacy Day", month: 8, day: 8, icon: "📖", theme: "Knowledge transfer, SOP literacy, and educational growth." },
  { id: 'int-day-peace', name: "International Day of Peace", month: 8, day: 21, icon: "🕊️", theme: "Workplace harmony, collaboration, and mutual respect." },
  { id: 'world-teachers-day', name: "World Teachers' Day", month: 9, day: 5, icon: "🧑‍🏫", theme: "Mentorship, guiding junior engineers, and knowledge coaching." },
  { id: 'world-mental-health-day', name: "World Mental Health Day", month: 9, day: 10, icon: "💚", theme: "Mindfulness, emotional well-being, and work-life balance." },
  { id: 'world-standards-day', name: "World Standards Day", month: 9, day: 14, icon: "📏", theme: "ISO standards, Six Sigma consistency, and quality compliance." },
  { id: 'world-statistics-day', name: "World Statistics Day", month: 9, day: 20, icon: "📊", theme: "Data integrity, statistical process control (SPC), and metrics." },
  { id: 'world-science-day', name: "World Science Day for Peace & Development", month: 10, day: 10, icon: "🔬", theme: "Scientific methodology, empirical data, and innovation." },
  { id: 'world-quality-day', name: "World Quality Day", month: 10, day: 13, icon: "🏅", theme: "Zero-defect mindset, kaizen continuous improvement, and total quality." },
  { id: 'int-mens-day', name: "International Men's Day", month: 10, day: 19, icon: "👨‍💼", theme: "Positive male role models, mental health, and team camaraderie." },
  { id: 'world-aids-day', name: "World AIDS Day", month: 11, day: 1, icon: "🎗️", theme: "Health awareness, empathy, and social solidarity." },
  { id: 'world-computer-literacy-day', name: "World Computer Literacy Day", month: 11, day: 2, icon: "🖥️", theme: "Digital transformation, automation, and technological advancement." },
  { id: 'human-rights-day', name: "Human Rights Day", month: 11, day: 10, icon: "⚖️", theme: "Fundamental dignity, equity, and ethical fairness in workplace." },
  { id: 'martyred-intellectuals-day', name: "Martyred Intellectuals Day", month: 11, day: 14, icon: "🕯️", theme: "Solemn tribute to Bangladesh's brightest thinkers and professors." },
  { id: 'bangladesh-victory-day', name: "Victory Day of Bangladesh (Bijoy Dibosh)", month: 11, day: 16, icon: "🇧🇩", theme: "Victory of 1971, sovereign pride, and resilient national spirit." },
  { id: 'christmas-day', name: "Christmas Day (Boro Din)", month: 11, day: 25, icon: "🎄", theme: "Peace, goodwill, festive family gatherings, and joy." },
  { id: 'new-year-eve', name: "New Year's Eve", month: 11, day: 31, icon: "✨", theme: "Year-end reflection, milestones celebration, and counting blessings." }
];

// Floating Lunar Holidays map by year
var FLOATING_SCHEDULES = {
  2025: {
    'eid-ul-fitr': { month: 2, day: 31, name: "Eid-ul-Fitr (Eid Mubarak)", icon: "🌙", theme: "Eid blessings, joy, charity, and heartfelt gratitude." },
    'eid-ul-adha': { month: 5, day: 7, name: "Eid-ul-Adha (Qurbani Eid)", icon: "🐑", theme: "Sacrifice, devotion, brotherhood, and generosity." },
    'mother-day': { month: 4, day: 11, name: "Mother's Day", icon: "💐", theme: "Honoring motherly love, sacrifices, and maternal warmth." },
    'father-day': { month: 5, day: 21, name: "Father's Day", icon: "👔", theme: "Celebrating paternal guidance, mentorship, and strength." },
    'friendship-day': { month: 7, day: 3, name: "International Friendship Day", icon: "🤝", theme: "Bonds of genuine friendship, mutual trust, and camaraderie." }
  },
  2026: {
    'eid-ul-fitr': { month: 2, day: 20, name: "Eid-ul-Fitr (Eid Mubarak)", icon: "🌙", theme: "Eid blessings, joy, charity, and heartfelt gratitude." },
    'eid-ul-adha': { month: 4, day: 27, name: "Eid-ul-Adha (Qurbani Eid)", icon: "🐑", theme: "Sacrifice, devotion, brotherhood, and generosity." },
    'mother-day': { month: 4, day: 10, name: "Mother's Day", icon: "💐", theme: "Honoring motherly love, sacrifices, and maternal warmth." },
    'father-day': { month: 5, day: 21, name: "Father's Day", icon: "👔", theme: "Celebrating paternal guidance, mentorship, and strength." },
    'friendship-day': { month: 7, day: 2, name: "International Friendship Day", icon: "🤝", theme: "Bonds of genuine friendship, mutual trust, and camaraderie." }
  },
  2027: {
    'eid-ul-fitr': { month: 2, day: 10, name: "Eid-ul-Fitr (Eid Mubarak)", icon: "🌙", theme: "Eid blessings, joy, charity, and heartfelt gratitude." },
    'eid-ul-adha': { month: 4, day: 16, name: "Eid-ul-Adha (Qurbani Eid)", icon: "🐑", theme: "Sacrifice, devotion, brotherhood, and generosity." },
    'mother-day': { month: 4, day: 9, name: "Mother's Day", icon: "💐", theme: "Honoring motherly love, sacrifices, and maternal warmth." },
    'father-day': { month: 5, day: 20, name: "Father's Day", icon: "👔", theme: "Celebrating paternal guidance, mentorship, and strength." },
    'friendship-day': { month: 7, day: 1, name: "International Friendship Day", icon: "🤝", theme: "Bonds of genuine friendship, mutual trust, and camaraderie." }
  }
};

/**
 * Checks if a specific date (0-indexed month, 1-indexed day) matches a global special day.
 */
function getSpecialDayForDate(monthIndex, day, year) {
  var y = year || new Date().getFullYear();
  // Check floating schedules first
  if (FLOATING_SCHEDULES[y]) {
    for (var key in FLOATING_SCHEDULES[y]) {
      var item = FLOATING_SCHEDULES[y][key];
      if (item.month === monthIndex && item.day === day) {
        return { name: item.name, icon: item.icon, theme: item.theme, id: key };
      }
    }
  }
  // Check fixed calendar
  for (var i = 0; i < GLOBAL_SPECIAL_DAYS_MAP.length; i++) {
    var sd = GLOBAL_SPECIAL_DAYS_MAP[i];
    if (sd.month === monthIndex && sd.day === day) {
      return { name: sd.name, icon: sd.icon, theme: sd.theme, id: sd.id };
    }
  }
  return null;
}

/**
 * 8:00 AM Daily Morning Trigger: Checks today's birthdays, resolves placeholders,
 * dispatches WhatsApp wish, and automatically delivers warm Festive HTML Email!
 */
function checkBirthdaysAndSendWishes() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  
  var today = new Date();
  var todayDay = today.getDate();
  var todayMonth = today.getMonth() + 1; // 1-indexed (Jan = 1)
  var monthIndex = today.getMonth();    // 0-indexed
  var currentYear = today.getFullYear();

  Logger.log("=== Starting Zero-Touch Birthday & Festive Dispatch for " + todayMonth + "/" + todayDay + "/" + currentYear + " ===");

  var dispatchedWhatsAppCount = 0;
  var dispatchedEmailCount = 0;

  // Header row detection
  var headerRow = 4; // Row 5 (index 4) by default
  for (var r = 0; r < Math.min(10, data.length); r++) {
    var rowText = data[r].join(" ").toLowerCase();
    if (rowText.indexOf("name") !== -1 && (rowText.indexOf("birthday") !== -1 || rowText.indexOf("sl") !== -1)) {
      headerRow = r;
      break;
    }
  }

  // Check if today is a Global Special Day or Festive Holiday
  var specialDayToday = getSpecialDayForDate(monthIndex, todayDay, currentYear);
  if (specialDayToday) {
    Logger.log("✨ Today coincides with Global Special Day: " + specialDayToday.name + " " + specialDayToday.icon);
  }

  for (var i = headerRow + 1; i < data.length; i++) {
    var empId = data[i][1] ? data[i][1].toString().trim() : "";         // Column B (Emp ID)
    var name = data[i][3] ? data[i][3].toString().trim() : "";          // Column D (Name)
    var designation = data[i][4] ? data[i][4].toString().trim() : "Team Member";   // Column E (Designation)
    var department = data[i][5] ? data[i][5].toString().trim() : "Industrial Engineering Central"; // Column F (Department)
    var dobValue = data[i][6];                                          // Column G (Birthday e.g. "6th May", "8/13")
    var email = data[i][7] ? data[i][7].toString().trim() : (data[i][8] ? data[i][8].toString().trim() : ""); // Column H/I (Email)
    var phone = data[i][9] ? data[i][9].toString().trim() : "";          // Column J (WhatsApp Number)
    var customMessage = data[i][10];                                    // Column K (Wishing Message)
    var lastSentYear = data[i][11];                                     // Column L (Last Sent Year)

    // Skip empty rows or invalid names
    if (!name || name.toLowerCase() === "name" || name.toLowerCase().indexOf("central team") !== -1) continue;
    if (!dobValue) continue;

    var dob = parseSmartBirthdayDate(dobValue);
    if (!dob) continue;

    // Check if birthday matches today (Month & Day)
    if (dob.day === todayDay && dob.monthNumber === todayMonth) {
      // Check if already sent for this calendar year
      if (lastSentYear && parseInt(lastSentYear.toString(), 10) === currentYear) {
        Logger.log("SKIPPED: Already sent wish to " + name + " for " + currentYear + ". Duplicate prevented.");
        continue;
      }

      // Check if this celebrant's birthday coincides with a special day
      var celebrantSpecialDay = getSpecialDayForDate(dob.monthIndex, dob.day, currentYear) || specialDayToday;

      // Resolve Dynamic Placeholders: {Name}, {Designation}, {Department}, {ID}, {Birthday}
      var personalizedWish = resolvePlaceholders(customMessage, {
        name: name,
        designation: designation,
        department: department,
        id: empId,
        birthday: dob.formatted
      });

      // Enhance message if festive coincidence exists
      if (celebrantSpecialDay && (!customMessage || customMessage.toString().trim() === "")) {
        personalizedWish = "🎉 Happy Birthday, " + name + "! Double celebration today as your special day coincides with " + celebrantSpecialDay.name + " " + celebrantSpecialDay.icon + "! Wishing you joy, good health, and stellar milestones from the IE Central Team! ✨";
      }

      var cleanPhone = phone.replace(/\\D/g, '');
      if (cleanPhone.indexOf('01') === 0) {
        cleanPhone = '88' + cleanPhone;
      } else if (cleanPhone.length === 10 && cleanPhone.indexOf('1') === 0) {
        cleanPhone = '880' + cleanPhone;
      }

      var sentSuccess = false;
      var channelsUsed = [];

      // 1. Dispatch Primary WhatsApp Channel
      if (cleanPhone.length >= 10) {
        var recipientFormatted = 'whatsapp:+' + cleanPhone;
        Logger.log("Attempting WhatsApp Dispatch to: " + name + " (" + recipientFormatted + ")");
        var waResult = sendDirectWhatsApp(recipientFormatted, personalizedWish);
        if (waResult) {
          dispatchedWhatsAppCount++;
          channelsUsed.push("WhatsApp");
        }
      }

      // 2. Dispatch Automated Email (Always sent if email is available for warm festive delivery!)
      if (email && email.indexOf('@') !== -1) {
        Logger.log("Dispatching Automated Email to: " + email + " for " + name);
        var emailSent = false;
        if (celebrantSpecialDay) {
          emailSent = sendFestiveBirthdayEmail(email, name, designation, department, dob.formatted, celebrantSpecialDay, personalizedWish);
        } else {
          emailSent = sendFallbackBirthdayEmail(email, name, designation, department, personalizedWish);
        }

        if (emailSent) {
          dispatchedEmailCount++;
          channelsUsed.push(celebrantSpecialDay ? "Festive HTML Email" : "HTML Email");
          sentSuccess = true;
        }
      }

      if (channelsUsed.length > 0) {
        sentSuccess = true;
      }

      // Record successful dispatch in Column L (Year)
      if (sentSuccess) {
        sheet.getRange(i + 1, 12).setValue(currentYear);
        Logger.log("SUCCESS [" + channelsUsed.join(" + ") + "]: Delivered to " + name + ". Recorded " + currentYear + " in Column L.");
      }
    }
  }

  Logger.log("=== 8:00 AM Dispatch Completed. WhatsApp: " + dispatchedWhatsAppCount + ", Emails Dispatched: " + dispatchedEmailCount + " ===");
}

/**
 * AUTOMATED ADMIN ADVANCE BIRTHDAY PLANNING NOTIFICATION (1 to 3 Days Ahead):
 * Scans Column G for upcoming birthdays in the next 1 to 3 days.
 * Dynamically collects Admin WhatsApp & Email from Google Sheet or falls back to defaults.
 * Dispatches multi-channel briefing to Admin WhatsApp & Admin Email.
 */
function extractAdminContactFromSheet(sheet, data) {
  var detected = {
    whatsapp: ADMIN_WHATSAPP_NUMBER || "whatsapp:+880163529951",
    email: ADMIN_EMAIL || "admin.ie@kdsgroup.net",
    source: "default"
  };

  // 1. Scan metadata header rows (Rows 1 to 5) for Admin / Leader keywords
  var maxHeaderRows = Math.min(6, data.length);
  for (var r = 0; r < maxHeaderRows; r++) {
    var row = data[r];
    for (var c = 0; c < row.length; c++) {
      var cell = row[c] ? row[c].toString().trim() : "";
      if (!cell) continue;

      var lower = cell.toLowerCase();
      if (lower.indexOf("admin") !== -1 || lower.indexOf("leader") !== -1 || lower.indexOf("manager") !== -1 || lower.indexOf("notification") !== -1) {
        // Look for phone or email in this cell or adjacent cells
        for (var off = 0; off <= 3; off++) {
          var targetVal = (row[c + off] ? row[c + off].toString().trim() : "") || cell;
          // Check for email
          var emailMatch = targetVal.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/);
          if (emailMatch && emailMatch[0]) {
            detected.email = emailMatch[0];
            detected.source = "sheet_header_metadata";
          }
          // Check for phone number
          var phoneMatch = targetVal.match(/(?:\\+?88)?01[3-9]\\d{8}/);
          if (phoneMatch && phoneMatch[0]) {
            var rawPhone = phoneMatch[0];
            var normalized = rawPhone.startsWith("+") ? rawPhone : (rawPhone.startsWith("88") ? "+" + rawPhone : "+88" + rawPhone);
            detected.whatsapp = "whatsapp:" + normalized;
            detected.source = "sheet_header_metadata";
          }
        }
      }
    }
  }

  // 2. Scan roster for designated Head / Manager / Lead if not found in header
  if (detected.source === "default") {
    for (var i = 4; i < data.length; i++) {
      var desig = data[i][4] ? data[i][4].toString().toLowerCase() : "";
      var name = data[i][3] ? data[i][3].toString().toLowerCase() : "";
      if (desig.indexOf("head") !== -1 || desig.indexOf("manager") !== -1 || desig.indexOf("leader") !== -1 || name.indexOf("danushka") !== -1 || name.indexOf("anik") !== -1) {
        var rosterPhone = data[i][9] ? data[i][9].toString().trim() : "";
        var rosterEmail = data[i][7] ? data[i][7].toString().trim() : (data[i][8] ? data[i][8].toString().trim() : "");
        if (rosterPhone && rosterPhone.replace(/\\D/g, '').length >= 10) {
          var pDigits = rosterPhone.replace(/\\D/g, '');
          var formattedP = pDigits.startsWith("88") ? "+" + pDigits : (pDigits.startsWith("01") ? "+88" + pDigits : "+" + pDigits);
          detected.whatsapp = "whatsapp:" + formattedP;
          detected.source = "roster_leadership_role";
        }
        if (rosterEmail && rosterEmail.indexOf("@") !== -1) {
          detected.email = rosterEmail;
          detected.source = "roster_leadership_role";
        }
        break;
      }
    }
  }

  return detected;
}

function sendAdminUpcomingBirthdayAlerts() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();

  var today = new Date();
  var currentYear = today.getFullYear();
  var todayZero = new Date(currentYear, today.getMonth(), today.getDate());

  // Dynamically extract active Admin WhatsApp & Email from Google Sheet
  var dynamicAdmin = extractAdminContactFromSheet(sheet, data);
  Logger.log("=== Scanning Column G for 1 to 3 Days Advance Birthdays for Admin Alert (Admin: " + dynamicAdmin.whatsapp + " / " + dynamicAdmin.email + " via " + dynamicAdmin.source + ") ===");

  var upcomingCelebrants = [];

  for (var i = 4; i < data.length; i++) {
    var empId = data[i][1] ? data[i][1].toString().trim() : "";
    var name = data[i][3] ? data[i][3].toString().trim() : "";
    var designation = data[i][4] ? data[i][4].toString().trim() : "Team Member";
    var department = data[i][5] ? data[i][5].toString().trim() : "IE Central";
    var dobValue = data[i][6];
    var email = data[i][7] ? data[i][7].toString().trim() : (data[i][8] ? data[i][8].toString().trim() : "");
    var phone = data[i][9] ? data[i][9].toString().trim() : "";
    var customMessage = data[i][10] ? data[i][10].toString().trim() : "";

    if (!name || !dobValue) continue;

    var dob = parseSmartBirthdayDate(dobValue);
    if (!dob) continue;

    // Calculate days until birthday
    var nextBday = new Date(currentYear, dob.monthIndex, dob.day);
    if (nextBday.getTime() < todayZero.getTime()) {
      nextBday = new Date(currentYear + 1, dob.monthIndex, dob.day);
    }
    var diffDays = Math.round((nextBday.getTime() - todayZero.getTime()) / (1000 * 60 * 60 * 24));

    // Focus on 1 to 3 days ahead (or today)
    if (diffDays >= 0 && diffDays <= 3) {
      var timeframe = diffDays === 0 ? "Today" : (diffDays === 1 ? "Tomorrow (1-Day Advance)" : "In " + diffDays + " days");
      var cleanPhone = phone.replace(/\\D/g, '');
      var hasWhatsApp = cleanPhone.length >= 10;
      var hasCustomWish = customMessage.length > 0;
      var hasEmail = email.indexOf('@') !== -1;

      // Check for festive coincidence
      var specialDayMatch = getSpecialDayForDate(dob.monthIndex, dob.day, currentYear);

      var resolvedWish = resolvePlaceholders(customMessage, {
        name: name,
        designation: designation,
        department: department,
        id: empId,
        birthday: dob.formatted
      });

      upcomingCelebrants.push({
        id: empId,
        name: name,
        designation: designation,
        department: department,
        birthday: dob.formatted,
        daysRemaining: diffDays,
        timeframe: timeframe,
        phone: phone || "Not Provided",
        hasWhatsApp: hasWhatsApp,
        email: email || "Not Provided",
        hasEmail: hasEmail,
        customMessage: customMessage,
        hasCustomWish: hasCustomWish,
        resolvedWish: resolvedWish,
        specialDay: specialDayMatch
      });
    }
  }

  // Sort ascending by days remaining
  upcomingCelebrants.sort(function(a, b) { return a.daysRemaining - b.daysRemaining; });

  if (upcomingCelebrants.length === 0) {
    Logger.log("No birthdays detected in the next 1-3 days. Admin advance alert not needed.");
    return;
  }

  Logger.log("Found " + upcomingCelebrants.length + " upcoming celebrant(s). Sending alerts to Admin...");

  // 1. Send WhatsApp Planning Briefing to Admin (+880163529951)
  var waMessage = "🔔 *IE CENTRAL TEAM - ADMIN ADVANCE BIRTHDAY PLANNING ALERT*\\n"
    + "📅 Window: Next 1-3 Days (" + upcomingCelebrants.length + " Upcoming Celebrant" + (upcomingCelebrants.length > 1 ? "s" : "") + ")\\n\\n";

  for (var k = 0; k < upcomingCelebrants.length; k++) {
    var item = upcomingCelebrants[k];
    var festiveNote = item.specialDay ? "   • ✨ *Festive Coincidence*: " + item.specialDay.icon + " " + item.specialDay.name + "\\n" : "";
    
    waMessage += "*" + (k + 1) + ". " + item.name + "* (" + item.designation + ")\\n"
      + "   • 🎂 Birthday: *" + item.birthday + "* (" + item.timeframe + ")\\n"
      + festiveNote
      + "   • 📱 Col J (WhatsApp): " + (item.hasWhatsApp ? item.phone : "❌ MISSING in Column J") + "\\n"
      + "   • ✉️ Col H (Email): " + (item.hasEmail ? item.email : "⚠️ Missing in Column H") + "\\n"
      + "   • 📝 Col K (Wish): " + (item.hasCustomWish ? "✅ Customized" : "⚠️ Default Template") + "\\n"
      + "   • 🔍 Wish Preview: _\\"" + item.resolvedWish.substring(0, 90) + "...\\"_\\n\\n";
  }

  waMessage += "📝 *Actionable Plan*: Please review Column J (WhatsApp) & Column K (Wishing Message) in Google Sheet before the 8:00 AM zero-touch dispatch!";

  var adminWaTarget = dynamicAdmin.whatsapp || ADMIN_WHATSAPP_NUMBER || "whatsapp:+880163529951";
  sendDirectWhatsApp(adminWaTarget, waMessage);
  Logger.log("Admin WhatsApp Advance Planning briefing dispatched to: " + adminWaTarget + " (Source: " + dynamicAdmin.source + ")");

  // 2. Send Email Planning Briefing to Admin Email
  var adminEmailTarget = dynamicAdmin.email || ADMIN_EMAIL || "admin.ie@kdsgroup.net";
  var emailSubject = "🔔 [Admin Advance Planning Alert] " + upcomingCelebrants.length + " Birthday(s) Coming Up (Next 1-3 Days) - IE Central Team";
  
  var html = "<div style='font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1e293b;'>"
    + "<div style='background: #0f172a; padding: 22px; border-radius: 12px 12px 0 0; color: #ffffff;'>"
    + "<h2 style='margin: 0; font-size: 18px; color: #f59e0b;'>🎂 Admin Advance Birthday Planning Alert</h2>"
    + "<p style='margin: 6px 0 0 0; font-size: 13px; color: #cbd5e1;'>Advance 1-3 days planning briefing for team leadership.</p>"
    + "</div>"
    + "<div style='padding: 22px; border: 1px solid #e2e8f0; border-top: none; background: #ffffff; border-radius: 0 0 12px 12px;'>"
    + "<p style='font-size: 13px; color: #475569;'>The automated wishing engine will trigger at <strong>8:00 AM</strong> on each celebrant's birthday. Please review the verification checklist below:</p>";

  for (var j = 0; j < upcomingCelebrants.length; j++) {
    var c = upcomingCelebrants[j];
    var festiveBadge = c.specialDay 
      ? "<div style='margin-top: 4px; display: inline-block; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: bold;'>✨ Coincides with " + c.specialDay.icon + " " + c.specialDay.name + "</div>" 
      : "";

    html += "<div style='background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 14px;'>"
      + "<div style='display: flex; justify-content: space-between; align-items: center;'>"
      + "<strong style='font-size: 15px; color: #0f172a;'>" + (j + 1) + ". " + c.name + "</strong> "
      + "<span style='background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: bold;'>" + c.timeframe + "</span>"
      + "</div>"
      + "<div style='font-size: 12px; color: #475569; margin-top: 4px;'><strong>Designation:</strong> " + c.designation + " | <strong>Dept:</strong> " + c.department + " | <strong>ID:</strong> " + c.id + "</div>"
      + festiveBadge
      + "<div style='font-size: 12px; color: #334155; margin-top: 6px; padding: 8px; background: #ffffff; border-radius: 6px; border: 1px solid #f1f5f9;'>"
      + "📱 <strong>Col J (WhatsApp):</strong> " + (c.hasWhatsApp ? "<span style='color:#16a34a; font-weight:bold;'>✓ " + c.phone + "</span>" : "<span style='color:#dc2626; font-weight:bold;'>✗ MISSING</span>") + "<br/>"
      + "✉️ <strong>Col H (Email):</strong> " + (c.hasEmail ? "<span style='color:#2563eb;'>✓ " + c.email + "</span>" : "<span style='color:#ea580c;'>✗ Missing</span>") + "<br/>"
      + "📝 <strong>Col K (Wish):</strong> " + (c.hasCustomWish ? "<span style='color:#16a34a;'>✓ Custom Message Configured</span>" : "<span style='color:#d97706;'>⚠ Standard Default</span>")
      + "</div>"
      + "<div style='margin-top: 8px; padding: 8px; background: #ffffff; border-left: 3px solid #10b981; font-size: 12px; color: #334155;'><em>\"" + c.resolvedWish + "\"</em></div>"
      + "</div>";
  }

  html += "<div style='background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px; font-size: 12px; color: #1e40af; margin-top: 16px;'>"
    + "<strong>Action Plan for Team Leader:</strong><br/>"
    + "1. Open Google Sheet ('Central IE List') to update any missing WhatsApp numbers (Column J) and emails (Column H).<br/>"
    + "2. Customize wishing messages in Column K before the 8:00 AM automated dispatch."
    + "</div>"
    + "<p style='font-size: 11px; color: #94a3b8; margin-top: 16px;'>Sent automatically by IE Central Team Birthday System via Google Apps Script.</p></div></div>";

  try {
    MailApp.sendEmail({
      to: adminEmailTarget,
      subject: emailSubject,
      htmlBody: html,
      name: "IE Central Team Planning Alert"
    });
    Logger.log("Admin Advance Planning Email delivered successfully to: " + adminEmailTarget);
  } catch (mErr) {
    Logger.log("Failed to send Admin Advance Planning Email: " + mErr);
  }
}

// Backward-compatible alias for 5:00 PM check
function checkTomorrowBirthdaysAndAlertAdmin() {
  sendAdminUpcomingBirthdayAlerts();
}

/**
 * Smart Date Normalizer: Parses various text date formats:
 * "6th May", "21st Feb", "4th Aug", "8/13", "08/04", "13-Aug", "6-May", "May-06", Excel serials
 */
function parseSmartBirthdayDate(dobVal) {
  if (!dobVal) return null;
  
  if (dobVal instanceof Date) {
    var m = dobVal.getMonth();
    var d = dobVal.getDate();
    return { monthIndex: m, monthNumber: m + 1, day: d, formatted: d + " " + getMonthShortName(m) };
  }

  // Handle Excel Serial number (e.g. 44800)
  if (typeof dobVal === 'number' || (!isNaN(Number(dobVal)) && Number(dobVal) > 20000 && String(dobVal).indexOf('/') === -1)) {
    var serial = Number(dobVal);
    var dateObj = new Date(Math.round((serial - 25569) * 86400 * 1000));
    if (!isNaN(dateObj.getTime())) {
      var sm = dateObj.getUTCMonth();
      var sd = dateObj.getUTCDate();
      return { monthIndex: sm, monthNumber: sm + 1, day: sd, formatted: sd + " " + getMonthShortName(sm) };
    }
  }

  var raw = dobVal.toString().trim();
  // Strip ordinal suffixes (1st -> 1, 2nd -> 2, 3rd -> 3, 4th -> 4)
  var clean = raw.replace(/(\\d+)(st|nd|rd|th)\\b/gi, '$1').trim();

  // Pattern 1: ISO YYYY-MM-DD
  var iso = clean.match(/^(\\d{4})[-/. ](\\d{1,2})[-/. ](\\d{1,2})/);
  if (iso) {
    var im = parseInt(iso[2], 10) - 1;
    var iday = parseInt(iso[3], 10);
    if (im >= 0 && im <= 11 && iday >= 1 && iday <= 31) {
      return { monthIndex: im, monthNumber: im + 1, day: iday, formatted: iday + " " + getMonthShortName(im) };
    }
  }

  // Pattern 2: Textual Month e.g. "6 May", "May 6", "21 Feb", "4 Aug", "6-May", "May-06", "August 15"
  var textPattern = clean.match(/([a-zA-Z]+)[^a-zA-Z0-9]*(\\d{1,2})|(\\d{1,2})[^a-zA-Z0-9]*([a-zA-Z]+)/);
  if (textPattern) {
    var word = (textPattern[1] || textPattern[4] || '').toLowerCase().trim();
    var dStr = textPattern[2] || textPattern[3] || '';
    var day = parseInt(dStr, 10);

    var monthIndex = getMonthIndexFromWord(word);
    if (monthIndex !== null && day >= 1 && day <= 31) {
      return { monthIndex: monthIndex, monthNumber: monthIndex + 1, day: day, formatted: day + " " + getMonthShortName(monthIndex) };
    }
  }

  // Pattern 3: Numeric M/D or MM/DD or D/M
  var parts = clean.split(/[-/. ]/);
  if (parts.length >= 2) {
    var p1 = parseInt(parts[0], 10);
    var p2 = parseInt(parts[1], 10);
    if (!isNaN(p1) && !isNaN(p2)) {
      if (p1 > 12 && p1 <= 31 && p2 >= 1 && p2 <= 12) {
        var mIdx = p2 - 1;
        return { monthIndex: mIdx, monthNumber: p2, day: p1, formatted: p1 + " " + getMonthShortName(mIdx) };
      }
      if (p1 >= 1 && p1 <= 12 && p2 >= 1 && p2 <= 31) {
        var mIdx = p1 - 1;
        return { monthIndex: mIdx, monthNumber: p1, day: p2, formatted: p2 + " " + getMonthShortName(mIdx) };
      }
    }
  }

  return null;
}

function getMonthIndexFromWord(word) {
  var map = {
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
    dec: 11, december: 11
  };
  for (var key in map) {
    if (word.indexOf(key) === 0 || key.indexOf(word) === 0) {
      return map[key];
    }
  }
  return null;
}

function getMonthShortName(monthIndex) {
  var names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return names[monthIndex] || '';
}

/**
 * Dynamic Placeholders Resolver
 */
function resolvePlaceholders(template, data) {
  var name = data.name || "Colleague";
  var designation = data.designation || "IE Central Team Colleague";
  var department = data.department || "Industrial Engineering Central";
  var id = data.id || "";
  var birthday = data.birthday || "";

  if (!template || template.toString().trim() === "") {
    return "🎉 Happy Birthday, " + name + "! Wishing you a great day and a fantastic year ahead from all of us in the IE Central Team! 🎂✨";
  }

  var res = template.toString()
    .replace(/\\{Name\\}/gi, name)
    .replace(/\\{Designation\\}/gi, designation)
    .replace(/\\{Department\\}/gi, department)
    .replace(/\\{Dept\\}/gi, department)
    .replace(/\\{ID\\}/gi, id)
    .replace(/\\{Birthday\\}/gi, birthday);

  return res;
}

/**
 * Direct WhatsApp API HTTP POST Dispatcher
 */
function sendDirectWhatsApp(toRecipient, messageText) {
  var senderNumber = "whatsapp:+8801625299521";

  if (!API_AUTH_TOKEN && !API_ACCOUNT_SID) {
    Logger.log("No API Auth Token configured. Please set API credentials in Code.gs.");
    return false;
  }

  // Twilio Integration
  if (API_ACCOUNT_SID && API_ACCOUNT_SID.indexOf("AC") === 0) {
    var twilioUrl = "https://api.twilio.com/2010-04-01/Accounts/" + API_ACCOUNT_SID + "/Messages.json";
    var payload = {
      "To": toRecipient,
      "From": senderNumber,
      "Body": messageText
    };

    var options = {
      "method": "post",
      "payload": payload,
      "headers": {
        "Authorization": "Basic " + Utilities.base64Encode(API_ACCOUNT_SID + ":" + API_AUTH_TOKEN)
      },
      "muteHttpExceptions": true
    };

    try {
      var response = UrlFetchApp.fetch(twilioUrl, options);
      var code = response.getResponseCode();
      return code >= 200 && code < 300;
    } catch (e) {
      Logger.log("Twilio Fetch Exception: " + e);
      return false;
    }
  }

  // UltraMsg / Gateway Integration
  var gatewayUrl = "https://api.ultramsg.com/instance/messages/chat";
  var gatewayPayload = JSON.stringify({
    "token": API_AUTH_TOKEN,
    "to": toRecipient.replace("whatsapp:", ""),
    "body": messageText,
    "from": "+8801625299521"
  });

  var gatewayOptions = {
    "method": "post",
    "contentType": "application/json",
    "payload": gatewayPayload,
    "muteHttpExceptions": true
  };

  try {
    var res = UrlFetchApp.fetch(gatewayUrl, gatewayOptions);
    return res.getResponseCode() === 200;
  } catch (err) {
    Logger.log("Gateway Fetch Exception: " + err);
    return false;
  }
}

/**
 * Specialized Warm Festive Birthday HTML Email Dispatcher
 */
function sendFestiveBirthdayEmail(toEmail, recipientName, designation, department, birthday, specialDay, messageBody) {
  var icon = specialDay.icon || "🎉";
  var specialName = specialDay.name || "Festive Celebration";
  var subject = icon + " Happy Birthday, " + recipientName + "! Festive Celebration on " + specialName + " - IE Central Team 🎂✨";
  
  var html = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);'>"
    + "<div style='background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%); padding: 32px 24px; text-align: center; color: #ffffff;'>"
    + "<div style='display: inline-block; background: rgba(251, 191, 36, 0.2); border: 1px solid rgba(251, 191, 36, 0.6); border-radius: 999px; padding: 4px 14px; font-size: 12px; font-weight: bold; color: #fde047; text-transform: uppercase; margin-bottom: 12px;'>"
    + icon + " Festive Celebration &bull; " + specialName
    + "</div>"
    + "<div style='font-size: 38px; margin-bottom: 8px;'>🎉🎂" + icon + "✨</div>"
    + "<h1 style='margin: 0; font-size: 24px; color: #fbbf24; font-weight: bold;'>Happy Birthday, " + recipientName + "!</h1>"
    + "<p style='margin: 6px 0 0 0; font-size: 13px; color: #cbd5e1;'>" + designation + " &bull; " + department + "</p>"
    + "</div>"
    + "<div style='background: #fef3c7; border-bottom: 1px solid #fde68a; padding: 12px 20px; text-align: center; font-size: 12px; color: #92400e; font-weight: 600;'>"
    + "🌟 <strong>Double Celebration:</strong> Today beautifully coincides with <strong>" + specialName + "</strong>!"
    + (specialDay.theme ? "<div style='font-size: 11px; color: #b45309; font-style: italic; margin-top: 2px;'>\"" + specialDay.theme + "\"</div>" : "")
    + "</div>"
    + "<div style='padding: 24px 24px; color: #334155; line-height: 1.65; font-size: 14px;'>"
    + "<p style='margin-top: 0;'>Dear <strong>" + recipientName + "</strong>,</p>"
    + "<div style='background: #f8fafc; border-left: 4px solid #f59e0b; padding: 16px 18px; border-radius: 0 8px 8px 0; margin: 16px 0; font-size: 15px; color: #0f172a; font-weight: 500;'>"
    + messageBody
    + "</div>"
    + "<p>On this auspicious occasion, on behalf of the entire Industrial Engineering Central Team, we extend our heartfelt wishes for your continued health, prosperity, and joyous achievements!</p>"
    + "<div style='margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;'>"
    + "<strong>IE Central Team Birthday & Festive Wishing Automation</strong><br/>"
    + "Sender Phone: <strong>+8801625299521</strong> &bull; KDS Group Central Operations"
    + "</div>"
    + "</div></div>";

  try {
    MailApp.sendEmail({
      to: toEmail,
      subject: subject,
      htmlBody: html,
      name: "IE Central Team Festive Wishes"
    });
    Logger.log("Festive Email delivered successfully to: " + toEmail);
    return true;
  } catch (e) {
    Logger.log("MailApp Festive delivery failed for " + toEmail + ": " + e);
    return false;
  }
}

/**
 * Standard Automated HTML Birthday Email
 */
function sendFallbackBirthdayEmail(toEmail, recipientName, designation, department, messageBody) {
  var subject = "🎂 Happy Birthday, " + recipientName + "! Special Wishes from IE Central Team 🎉";
  
  var html = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;'>"
    + "<div style='background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center; color: #ffffff;'>"
    + "<div style='font-size: 40px; margin-bottom: 8px;'>🎉🎂✨</div>"
    + "<h1 style='margin: 0; font-size: 22px; color: #fbbf24; font-weight: bold;'>Happy Birthday, " + recipientName + "!</h1>"
    + "<p style='margin: 6px 0 0 0; font-size: 13px; color: #cbd5e1;'>" + designation + " • " + department + "</p>"
    + "</div>"
    + "<div style='padding: 28px 24px; color: #334155; line-height: 1.6; font-size: 14px;'>"
    + "<p style='margin-top: 0;'>Dear <strong>" + recipientName + "</strong>,</p>"
    + "<div style='background: #f8fafc; border-left: 4px solid #10b981; padding: 16px; border-radius: 0 8px 8px 0; margin: 18px 0; font-size: 15px; color: #0f172a;'>"
    + messageBody
    + "</div>"
    + "<p>On behalf of the entire Industrial Engineering Central Team, we wish you great health, happiness, and continued excellence in all your endeavors!</p>"
    + "<div style='margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;'>"
    + "<strong>IE Central Team Birthday Wishing Automation</strong><br/>"
    + "Sender Phone: +8801625299521"
    + "</div>"
    + "</div></div>";

  try {
    MailApp.sendEmail({
      to: toEmail,
      subject: subject,
      htmlBody: html,
      name: "IE Central Team Wishes"
    });
    Logger.log("Email delivered successfully to: " + toEmail);
    return true;
  } catch (e) {
    Logger.log("MailApp delivery failed for " + toEmail + ": " + e);
    return false;
  }
}

/**
 * Setup All Cloud Triggers:
 * 1. 8:00 AM Daily Birthday & Festive Wishing Trigger (checkBirthdaysAndSendWishes)
 * 2. 5:00 PM (17:00) Evening Admin Advance Planning Alert Trigger (sendAdminUpcomingBirthdayAlerts)
 */
function setupAllTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    var fn = triggers[i].getHandlerFunction();
    if (fn === "checkBirthdaysAndSendWishes" || fn === "sendAdminUpcomingBirthdayAlerts" || fn === "checkTomorrowBirthdaysAndAlertAdmin") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // 1. 8:00 AM Morning Dispatch Trigger
  ScriptApp.newTrigger("checkBirthdaysAndSendWishes")
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();

  // 2. 5:00 PM (17:00) Evening Admin Advance Planning Alert Trigger (1 to 3 Days Ahead)
  ScriptApp.newTrigger("sendAdminUpcomingBirthdayAlerts")
    .timeBased()
    .everyDays(1)
    .atHour(17)
    .create();

  Logger.log("SUCCESS: Both 8:00 AM Wish Dispatch & 5:00 PM Admin Advance Planning Alert Triggers installed!");
}

/**
 * =========================================================================
 * REAL-TIME GOOGLE SHEET EDIT TRIGGER & INSTANT WEBHOOK SYNCHRONIZATION
 * =========================================================================
 * Whenever you update or edit:
 * 1. WhatsApp Wishing Message Sender Number (Connected WhatsApp)
 * 2. Admin Notification Email
 * 3. Admin WhatsApp Number
 * inside Google Sheets, this trigger immediately executes and pushes the changes
 * to the web application server in real time without manual reload!
 */

// Global Webhook URL (Current Hosted App Endpoint)
var WEBHOOK_APP_URL = ""; // Optional: Enter public custom URL if deployed to dedicated domain

/**
 * Real-Time onEdit Trigger: Fires automatically on every cell modification in Google Sheets
 */
function onEdit(e) {
  try {
    var range = e.range;
    var row = range.getRow();
    var col = range.getColumn();
    
    // If edit happened in top 20 rows or headers, sync real-time configuration
    if (row <= 20) {
      syncConfigWithWebApp();
    }
  } catch (err) {
    Logger.log("onEdit exception: " + err);
  }
}

/**
 * Reads the 3 configuration values directly from Google Sheet and posts them to Web App Webhook
 */
function syncConfigWithWebApp() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  
  var detectedSender = SENDER_WHATSAPP_NUMBER || "+8801625299521";
  var detectedAdminWA = ADMIN_WHATSAPP_NUMBER || "+8801625299521";
  var detectedAdminEmail = ADMIN_EMAIL || "anik.barua@kdsgroup.net";
  
  // Scan sheet rows for table headers / labels
  for (var r = 0; r < Math.min(data.length, 15); r++) {
    var row = data[r] || [];
    for (var c = 0; c < row.length; c++) {
      var cell = String(row[c] || "").trim().toLowerCase();
      var nextRowVal = data[r + 1] && data[r + 1][c] ? String(data[r + 1][c]).trim() : "";
      
      // Sender Number
      if (cell.indexOf("sender") !== -1 && (cell.indexOf("number") !== -1 || cell.indexOf("whatsapp") !== -1)) {
        if (nextRowVal) detectedSender = nextRowVal;
      }
      // Admin Notification Email
      if (cell.indexOf("admin") !== -1 && (cell.indexOf("email") !== -1 || cell.indexOf("mail") !== -1 || cell.indexOf("notification") !== -1)) {
        if (nextRowVal && nextRowVal.indexOf("@") !== -1) detectedAdminEmail = nextRowVal;
      }
      // Admin WhatsApp Number
      if (cell.indexOf("admin") !== -1 && (cell.indexOf("whatsapp") !== -1 || cell.indexOf("whatapp") !== -1 || cell.indexOf("number") !== -1)) {
        if (nextRowVal) detectedAdminWA = nextRowVal;
      }
    }
  }
  
  var payload = {
    source: "google_apps_script_onEdit",
    event: "onEdit",
    senderNumber: detectedSender,
    senderWhatsApp: detectedSender,
    adminNotificationEmail: detectedAdminEmail,
    adminEmail: detectedAdminEmail,
    adminWhatsAppNumber: detectedAdminWA,
    adminWhatsApp: detectedAdminWA,
    timestamp: new Date().toISOString()
  };
  
  Logger.log("Synchronizing Google Sheet Config with Web App: " + JSON.stringify(payload));
  
  // If WEBHOOK_APP_URL is specified, post over HTTP
  if (WEBHOOK_APP_URL) {
    try {
      var options = {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };
      UrlFetchApp.fetch(WEBHOOK_APP_URL + "/api/sheet/webhook", options);
    } catch (fetchErr) {
      Logger.log("UrlFetchApp failed: " + fetchErr);
    }
  }
  
  return payload;
}

/**
 * Creates custom interactive menu in Google Sheets toolbar
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("🎂 IE Birthday Engine")
    .addItem("⚡ Sync Configuration with Web App Now", "syncConfigWithWebApp")
    .addSeparator()
    .addItem("▶️ Test 8:00 AM Birthday & Festive Dispatch", "checkBirthdaysAndSendWishes")
    .addItem("🔔 Test 5:00 PM Admin Advance Planning Alert", "sendAdminUpcomingBirthdayAlerts")
    .addSeparator()
    .addItem("⚙️ Install Cloud Triggers", "setupAllTriggers")
    .addToUi();
}

// Backward compatibility aliases
function setupDailyTrigger() {
  setupAllTriggers();
}
function createDailyTrigger() {
  setupAllTriggers();
}
`;
}
