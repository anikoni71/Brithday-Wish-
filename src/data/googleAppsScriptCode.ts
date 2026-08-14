export function getAppsScriptCode(
  accountSid: string = '',
  authToken: string = '',
  whatsappNumber: string = 'whatsapp:+8801625299521',
  adminWhatsApp: string = 'whatsapp:+880163529951'
): string {
  return `/**
 * IE Central Team - ZERO-TOUCH 100% AUTOMATED DUAL-CHANNEL BIRTHDAY WISHING SYSTEM
 * Google Apps Script for Google Sheet: "Central IE List"
 * 
 * SENDER HOSTING NUMBER: +8801625299521
 * DESIGNATED ADMIN / TEAM LEADER WHATSAPP: +880163529951
 * 
 * CORE CAPABILITIES & UPGRADES:
 * 1. ZERO-TOUCH 8:00 AM MORNING DISPATCH: Scans Column G for today's celebrants, resolves placeholders,
 *    and delivers birthday wishes via WhatsApp (+8801625299521) with automatic Email fallback.
 * 2. ADMIN ADVANCE BIRTHDAY PLANNING ALERTS (1 TO 3 DAYS AHEAD):
 *    Automated trigger (5:00 PM evening or 7:30 AM morning) scans for upcoming celebrants in the next
 *    1 to 3 days and sends a multi-channel briefing directly to Admin WhatsApp (+880163529951) and Admin Email.
 * 3. ADVANCE PLANNING VERIFICATION CHECKLIST:
 *    • Celebrant Name, Designation, & Department
 *    • Exact Birthday Date & Days Remaining ("Tomorrow", "In 2 days")
 *    • Verification Check: Confirms presence of WhatsApp in Col J and custom wish in Col K
 *    • Actionable Plan Instructions: Prompts team leader to review/update wishes before morning dispatch.
 * 4. SMART DATE NORMALIZER: Seamlessly handles "6th May", "21st Feb", "4th Aug", "8/13", "08/04", "13-Aug", Excel serials.
 * 5. DYNAMIC MESSAGE PERSONALIZATION: Resolves {Name}, {Designation}, {Department}, {ID}, {Birthday}.
 * 6. DUPLICATE PREVENTION: Records current year in Column L ("Last Sent Year") to prevent duplicate sends.
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

/**
 * 8:00 AM Daily Morning Trigger: Checks today's birthdays, resolves placeholders,
 * dispatches WhatsApp wish, and falls back to Email if WhatsApp is unavailable.
 */
function checkBirthdaysAndSendWishes() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  
  var today = new Date();
  var todayDay = today.getDate();
  var todayMonth = today.getMonth() + 1; // 1-indexed (Jan = 1)
  var currentYear = today.getFullYear();

  Logger.log("=== Starting Zero-Touch Birthday Dispatch for " + todayMonth + "/" + todayDay + "/" + currentYear + " ===");

  var dispatchedWhatsAppCount = 0;
  var dispatchedEmailFallbackCount = 0;

  // Header row detection
  var headerRow = 4; // Row 5 (index 4) by default
  for (var r = 0; r < Math.min(10, data.length); r++) {
    var rowText = data[r].join(" ").toLowerCase();
    if (rowText.indexOf("name") !== -1 && (rowText.indexOf("birthday") !== -1 || rowText.indexOf("sl") !== -1)) {
      headerRow = r;
      break;
    }
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

      // Resolve Dynamic Placeholders: {Name}, {Designation}, {Department}, {ID}, {Birthday}
      var personalizedWish = resolvePlaceholders(customMessage, {
        name: name,
        designation: designation,
        department: department,
        id: empId,
        birthday: dob.formatted
      });

      var cleanPhone = phone.replace(/\\D/g, '');
      if (cleanPhone.indexOf('01') === 0) {
        cleanPhone = '88' + cleanPhone;
      } else if (cleanPhone.length === 10 && cleanPhone.indexOf('1') === 0) {
        cleanPhone = '880' + cleanPhone;
      }

      var sentSuccess = false;
      var usedChannel = "WhatsApp";

      // Try Primary Channel: WhatsApp
      if (cleanPhone.length >= 10) {
        var recipientFormatted = 'whatsapp:+' + cleanPhone;
        Logger.log("Attempting WhatsApp Dispatch to: " + name + " (" + recipientFormatted + ")");
        sentSuccess = sendDirectWhatsApp(recipientFormatted, personalizedWish);
      }

      // If WhatsApp failed or phone was missing -> Trigger Dual-Channel Email Fallback
      if (!sentSuccess) {
        if (email && email.indexOf('@') !== -1) {
          Logger.log("WhatsApp unavailable for " + name + ". Triggering automated Email Fallback to: " + email);
          var emailSuccess = sendFallbackBirthdayEmail(email, name, designation, department, personalizedWish);
          if (emailSuccess) {
            sentSuccess = true;
            usedChannel = "Email Fallback";
            dispatchedEmailFallbackCount++;
          }
        } else {
          Logger.log("WARNING: Neither valid WhatsApp (" + phone + ") nor Email (" + email + ") available for " + name);
        }
      } else {
        dispatchedWhatsAppCount++;
      }

      // Record successful dispatch in Column L (Year)
      if (sentSuccess) {
        sheet.getRange(i + 1, 12).setValue(currentYear);
        Logger.log("SUCCESS [" + usedChannel + "]: Delivered to " + name + ". Recorded " + currentYear + " in Column L.");
      }
    }
  }

  Logger.log("=== 8:00 AM Dispatch Completed. WhatsApp: " + dispatchedWhatsAppCount + ", Email Fallbacks: " + dispatchedEmailFallbackCount + " ===");
}

/**
 * AUTOMATED ADMIN ADVANCE BIRTHDAY PLANNING NOTIFICATION (1 to 3 Days Ahead):
 * Scans Column G for upcoming birthdays in the next 1 to 3 days.
 * Dispatches multi-channel briefing to Admin WhatsApp (+880163529951) and Admin Email.
 */
function sendAdminUpcomingBirthdayAlerts() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();

  var today = new Date();
  var currentYear = today.getFullYear();
  var todayZero = new Date(currentYear, today.getMonth(), today.getDate());

  Logger.log("=== Scanning Column G for 1 to 3 Days Advance Birthdays for Admin Alert ===");

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

    // Focus on 1 to 3 days ahead (or tomorrow)
    if (diffDays >= 0 && diffDays <= 3) {
      var timeframe = diffDays === 0 ? "Today" : (diffDays === 1 ? "Tomorrow (1-Day Advance)" : "In " + diffDays + " days");
      var cleanPhone = phone.replace(/\\D/g, '');
      var hasWhatsApp = cleanPhone.length >= 10;
      var hasCustomWish = customMessage.length > 0;
      var hasEmail = email.indexOf('@') !== -1;

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
        resolvedWish: resolvedWish
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
    waMessage += "*" + (k + 1) + ". " + item.name + "* (" + item.designation + ")\\n"
      + "   • 🎂 Birthday: *" + item.birthday + "* (" + item.timeframe + ")\\n"
      + "   • 📱 Col J (WhatsApp): " + (item.hasWhatsApp ? item.phone : "❌ MISSING in Column J") + "\\n"
      + "   • ✉️ Col H (Email): " + (item.hasEmail ? item.email : "⚠️ Missing in Column H") + "\\n"
      + "   • 📝 Col K (Wish): " + (item.hasCustomWish ? "✅ Customized" : "⚠️ Default Template") + "\\n"
      + "   • 🔍 Wish Preview: _\\"" + item.resolvedWish.substring(0, 90) + "...\\"_\\n\\n";
  }

  waMessage += "📝 *Actionable Plan*: Please review Column J (WhatsApp) & Column K (Wishing Message) in Google Sheet before the 8:00 AM zero-touch dispatch!";

  var adminWaTarget = ADMIN_WHATSAPP_NUMBER || "whatsapp:+880163529951";
  sendDirectWhatsApp(adminWaTarget, waMessage);
  Logger.log("Admin WhatsApp Advance Planning briefing dispatched to: " + adminWaTarget);

  // 2. Send Email Planning Briefing to Admin Email
  var adminEmailTarget = ADMIN_EMAIL || "admin.ie@kdsgroup.net";
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
    html += "<div style='background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 14px;'>"
      + "<div style='display: flex; justify-content: space-between; align-items: center;'>"
      + "<strong style='font-size: 15px; color: #0f172a;'>" + (j + 1) + ". " + c.name + "</strong> "
      + "<span style='background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: bold;'>" + c.timeframe + "</span>"
      + "</div>"
      + "<div style='font-size: 12px; color: #475569; margin-top: 4px;'><strong>Designation:</strong> " + c.designation + " | <strong>Dept:</strong> " + c.department + " | <strong>ID:</strong> " + c.id + "</div>"
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
    + "1. Open Google Sheet ('Central IE List') to update any missing WhatsApp numbers (Column J).<br/>"
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
 * Dual-Channel Delivery: Automated Email Fallback using MailApp
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
    Logger.log("Email fallback delivered successfully to: " + toEmail);
    return true;
  } catch (e) {
    Logger.log("MailApp delivery failed for " + toEmail + ": " + e);
    return false;
  }
}

/**
 * Setup All Cloud Triggers:
 * 1. 8:00 AM Daily Birthday Wishing Trigger (checkBirthdaysAndSendWishes)
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

// Backward compatibility aliases
function setupDailyTrigger() {
  setupAllTriggers();
}
function createDailyTrigger() {
  setupAllTriggers();
}
`;
}
