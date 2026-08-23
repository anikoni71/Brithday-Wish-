/**
 * IE Central Team - Automated Birthday Wisher & Admin Alerts
 * Google Apps Script Generator (AUTO-SHEET RECOVERY & DYNAMIC HEADER DETECTION)
 */

export function getAppsScriptCode(
  accountSid: string = '',
  authToken: string = '',
  whatsappNumber: string = '+8801625299521',
  adminWhatsApp: string = '+8801625299521',
  adminEmail: string = 'anik.barua@kdsgroup.net',
  sheetName: string = 'Sheet1',
  waApiUrl: string = 'https://app.assistro.co/api/v1/wapushplus/single/message',
  waApiToken: string = 'pat_FAvA0pxp3PfZt48Lr61JiFKp9MIcow1SmyQzQyKE'
): string {
  const cleanAdminPhone = adminWhatsApp.replace('whatsapp:', '').trim() || '+8801625299521';
  const cleanAdminEmail = adminEmail.trim() || 'anik.barua@kdsgroup.net';
  const cleanSheetName = sheetName.trim() || 'Sheet1';
  const activeWaUrl = waApiUrl.trim() || 'https://app.assistro.co/api/v1/wapushplus/single/message';
  const activeWaToken = (waApiToken || authToken || '').trim() || 'pat_FAvA0pxp3PfZt48Lr61JiFKp9MIcow1SmyQzQyKE';

  return `/**
 * IE Central Team - Automated Birthday Wisher & Admin Alerts
 * Fully Automated Zero-Touch System (AUTO-SHEET RECOVERY EDITION)
 */

// ================= CONFIGURATION =================
const CONFIG = {
  PREFERRED_SHEET_NAME: "${cleanSheetName}", 
  ADMIN_WHATSAPP: "${cleanAdminPhone}", 
  ADMIN_EMAIL: "${cleanAdminEmail}", 
  WA_API_URL: "${activeWaUrl}", 
  WA_API_TOKEN: "${activeWaToken}",
  COLS: {
    NAME: 3,        
    DESIGNATION: 4, 
    BIRTHDAY: 6,    
    EMAIL: 7,       
    WHATSAPP: 9,    
    WISH_MSG: 10    
  }
};

function setupAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  ScriptApp.newTrigger('checkBirthdaysAndSendWishes').timeBased().everyDays(1).atHour(8).create();
  ScriptApp.newTrigger('sendAdminUpcomingBirthdayAlerts').timeBased().everyDays(1).atHour(17).create();
  ScriptApp.newTrigger('syncBirthdaysToCalendar').timeBased().everyDays(1).atHour(6).create();
  Logger.log("✅ All automatic daily triggers & calendar sync successfully setup!");
}

function checkBirthdaysAndSendWishes() {
  const sheetContext = getSheetAndColumnMapping();
  if (!sheetContext) return;
  const { sheet, cols } = sheetContext;
  const data = sheet.getDataRange().getValues();
  const today = new Date();

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const name = row[cols.NAME];
    if (!name) continue;
    const birthdayDate = normalizeDate(row[cols.BIRTHDAY]);

    if (birthdayDate && birthdayDate.getMonth() === today.getMonth() && birthdayDate.getDate() === today.getDate()) {
      let phone = row[cols.WHATSAPP] ? String(row[cols.WHATSAPP]).trim() : null;
      let email = row[cols.EMAIL] ? String(row[cols.EMAIL]).trim() : null;
      let rawMessage = row[cols.WISH_MSG] || \`Happy Birthday, {Name}! Wishing you a great day from the IE Central Team. 🎉\`;
      let finalMessage = String(rawMessage).replace(/{Name}/gi, name).replace(/{Designation}/gi, row[cols.DESIGNATION] || "");

      // Send WhatsApp if phone number exists
      if (phone && phone.length >= 10) {
        sendWhatsApp(phone, finalMessage, name);
      }
      // Send Email independently if email address exists
      if (email && email.includes("@")) {
        sendEmailFallback(email, name, finalMessage);
      }
    }
  }

  // Safely maintain Google Calendar sync alongside daily engine
  try {
    syncBirthdaysToCalendar();
  } catch (calErr) {
    Logger.log("Calendar sync background notice: " + calErr);
  }
}

/**
 * AUTOMATED CALENDAR SYNCHRONIZATION
 * Synchronizes all team member birthdays from Google Sheets into a dedicated
 * Google Calendar named 'IE Team Birthdays' as all-day yearly recurring events.
 * Prevents duplicate events by checking existing entries.
 */
function syncBirthdaysToCalendar() {
  try {
    const CALENDAR_NAME = "IE Team Birthdays";
    let calendar;
    const calendars = CalendarApp.getCalendarsByName(CALENDAR_NAME);
    if (calendars.length > 0) {
      calendar = calendars[0];
    } else {
      calendar = CalendarApp.createCalendar(CALENDAR_NAME, {
        summary: "Automated birthday calendar for IE Central Team members",
        color: CalendarApp.Color.GREEN,
        timeZone: Session.getScriptTimeZone() || "Asia/Dhaka"
      });
      Logger.log("📅 Created new Google Calendar: " + CALENDAR_NAME);
    }

    const sheetContext = getSheetAndColumnMapping();
    if (!sheetContext) {
      Logger.log("⚠️ Sheet context not found for calendar synchronization.");
      return { success: false, message: "Sheet context not found" };
    }

    const { sheet, cols } = sheetContext;
    const data = sheet.getDataRange().getValues();
    const now = new Date();
    const currentYear = now.getFullYear();

    let createdCount = 0;
    let existingCount = 0;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const name = row[cols.NAME];
      if (!name || String(name).trim() === "") continue;

      const birthdayDate = normalizeDate(row[cols.BIRTHDAY]);
      if (!birthdayDate) continue;

      const designation = cols.DESIGNATION !== undefined && row[cols.DESIGNATION] ? String(row[cols.DESIGNATION]).trim() : "IE Team Member";
      const eventTitle = "🎂 " + name + " Birthday";

      // Calculate the start date for this birthday in the current calendar year
      const eventDate = new Date(currentYear, birthdayDate.getMonth(), birthdayDate.getDate());

      // Search a window around this day to verify if an event already exists
      const searchStart = new Date(currentYear, birthdayDate.getMonth(), birthdayDate.getDate() - 1);
      const searchEnd = new Date(currentYear, birthdayDate.getMonth(), birthdayDate.getDate() + 2);

      const existingEvents = calendar.getEvents(searchStart, searchEnd);
      const alreadyExists = existingEvents.some(function(evt) {
        const title = evt.getTitle() || "";
        return title.indexOf(name) !== -1 || title === eventTitle;
      });

      if (!alreadyExists) {
        // Create an All-Day yearly recurring event series
        const recurrence = CalendarApp.newRecurrence().addYearlyRule();
        const description = "🎉 IE Central Team Birthday Celebration\\n" +
                            "👤 Name: " + name + "\\n" +
                            "💼 Designation: " + designation + "\\n" +
                            "🏢 Department: Central Industrial Engineering\\n" +
                            "📅 Birthday: " + (row[cols.BIRTHDAY] || "") + "\\n\\n" +
                            "- Automated Synchronization by IE Central Birthday Hub -";

        calendar.createAllDayEventSeries(
          eventTitle,
          eventDate,
          recurrence,
          {
            description: description,
            location: "IE Central Department"
          }
        );
        createdCount++;
        Logger.log("✅ Created yearly calendar event for: " + name);
      } else {
        existingCount++;
      }
    }

    Logger.log("📅 Calendar sync complete! Added: " + createdCount + ", Existing: " + existingCount);
    return { success: true, created: createdCount, existing: existingCount, totalChecked: data.length - 1 };
  } catch (err) {
    Logger.log("❌ Error in syncBirthdaysToCalendar: " + err.toString());
    return { success: false, error: err.toString() };
  }
}

/**
 * DATA SANITIZATION & AUTO-FORMATTING (onEdit TRIGGER)
 * Automatically self-heals data on every edit:
 * - Trims leading/trailing spaces from Email column
 * - Cleans up Phone/WhatsApp column (removes spaces/dashes, auto-prepends +880 if missing)
 * - Automatically keeps Google Calendar synchronized
 */
function onEdit(e) {
  try {
    if (!e || !e.range) {
      sanitizeAllSheetData();
      syncBirthdaysToCalendar();
      return;
    }

    var sheet = e.range.getSheet();
    var row = e.range.getRow();
    var col = e.range.getColumn();

    // Skip header row
    if (row < 2) return;

    var sheetContext = getSheetAndColumnMapping();
    if (!sheetContext) return;
    var cols = sheetContext.cols;

    // Check if edited cell is the Email column (0-indexed col mapped to 1-indexed range)
    if (col === cols.EMAIL + 1) {
      var emailVal = e.range.getValue();
      if (emailVal && typeof emailVal === "string") {
        var trimmedEmail = emailVal.trim();
        if (trimmedEmail !== emailVal) {
          e.range.setValue(trimmedEmail);
          Logger.log("🧹 Sanitized email for row " + row + ": " + trimmedEmail);
        }
      }
    }

    // Check if edited cell is the Phone / WhatsApp column
    if (col === cols.WHATSAPP + 1) {
      var phoneVal = e.range.getValue();
      if (phoneVal) {
        var formattedPhone = formatPhoneNumber(phoneVal);
        if (formattedPhone && formattedPhone !== String(phoneVal)) {
          e.range.setValue(formattedPhone);
          Logger.log("🧹 Sanitized phone for row " + row + ": " + formattedPhone);
        }
      }
    }

    // Synchronize birthday events to Google Calendar
    syncBirthdaysToCalendar();
  } catch (err) {
    Logger.log("onEdit self-healing note: " + err.toString());
  }
}

/**
 * Format and sanitize phone numbers:
 * - Strips whitespace, dashes, brackets, and non-digit characters (except leading +)
 * - Automatically prepends +880 for standard Bangladesh mobile numbers if missing
 */
function formatPhoneNumber(phone) {
  if (!phone) return "";
  var raw = String(phone).trim();
  if (raw === "") return "";

  // Remove spaces, dashes, brackets
  var cleaned = raw.replace(/[\\s\\-\\(\\)]/g, "");

  // If already starts with +880
  if (cleaned.startsWith("+880")) {
    return cleaned;
  }
  // If starts with +88
  if (cleaned.startsWith("+88")) {
    return "+880" + cleaned.substring(3).replace(/^0+/, "");
  }
  // If starts with 880
  if (cleaned.startsWith("880")) {
    return "+" + cleaned;
  }
  // If starts with 01 (11 digits e.g. 01812345678)
  if (cleaned.startsWith("01") && cleaned.length === 11) {
    return "+880" + cleaned.substring(1);
  }
  // If starts with 1 (10 digits e.g. 1812345678)
  if (cleaned.startsWith("1") && cleaned.length === 10) {
    return "+880" + cleaned;
  }
  // If already has standard international prefix with +
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  // Fallback: prepend +880 if 9-11 digits
  var digitsOnly = cleaned.replace(/[^\\d]/g, "");
  if (digitsOnly.length >= 10 && digitsOnly.length <= 11) {
    return "+880" + digitsOnly.replace(/^0+/, "");
  }

  return raw;
}

/**
 * Batch sanitizes all rows in the active sheet
 */
function sanitizeAllSheetData() {
  try {
    var sheetContext = getSheetAndColumnMapping();
    if (!sheetContext) return;
    var sheet = sheetContext.sheet;
    var cols = sheetContext.cols;
    var data = sheet.getDataRange().getValues();

    for (var r = 1; r < data.length; r++) {
      var rowNum = r + 1;
      // Sanitize Email
      var email = data[r][cols.EMAIL];
      if (email && typeof email === "string") {
        var cleanEmail = email.trim();
        if (cleanEmail !== email) {
          sheet.getRange(rowNum, cols.EMAIL + 1).setValue(cleanEmail);
        }
      }
      // Sanitize WhatsApp / Phone
      var phone = data[r][cols.WHATSAPP];
      if (phone) {
        var cleanPhone = formatPhoneNumber(phone);
        if (cleanPhone && cleanPhone !== String(phone)) {
          sheet.getRange(rowNum, cols.WHATSAPP + 1).setValue(cleanPhone);
        }
      }
    }
    Logger.log("✅ Batch sheet data sanitization complete!");
  } catch (err) {
    Logger.log("sanitizeAllSheetData error: " + err.toString());
  }
}

function sendAdminUpcomingBirthdayAlerts() {
  const sheetContext = getSheetAndColumnMapping();
  if (!sheetContext) return;
  const { sheet, cols } = sheetContext;
  const data = sheet.getDataRange().getValues();
  const today = new Date();
  let upcomingCelebrants = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const name = row[cols.NAME];
    if (!name) continue;
    const birthdayDate = normalizeDate(row[cols.BIRTHDAY]);

    if (birthdayDate) {
      const nextBirthday = new Date(today.getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate());
      if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
      const diffDays = Math.ceil(Math.abs(nextBirthday - today) / (1000 * 60 * 60 * 24));

      if (diffDays >= 1 && diffDays <= 3) {
        const hasPhone = row[cols.WHATSAPP] ? "✅ Yes" : "❌ No Phone";
        const timeframe = diffDays === 1 ? "Tomorrow" : \`In \${diffDays} days\`;
        upcomingCelebrants.push(\`- *\${name}* (\${row[cols.DESIGNATION] || "N/A"})\n📅 \${timeframe} | 📱 WA Ready: \${hasPhone}\`);
      }
    }
  }

  if (upcomingCelebrants.length > 0) {
    const adminMessage = \`🔔 *IE TEAM ADMIN ALERT: 1-3 DAYS ADVANCE PLANNING CHECKLIST*\\n\\n\` + \n                         \`This is an automated alert to help you prepare for upcoming birthdays:\\n\\n\` + \n                         \`\${upcomingCelebrants.join("\\\\n\\\\n")}\\n\\n\` + \n                         \`📝 *Admin Checklist*:\\n\` + \n                         \`1. Verify Column J (WhatsApp) for all above members.\\n\` + \n                         \`2. Review Column K (Personalized Wish) if you want to override the default.\\n\` + \n                         \`3. Ensure Column H (Email) is present for fallback delivery.\\n\\n\` + \n                         \`The system will attempt Zero-Touch dispatch at 8:00 AM on the respective days.\`;
    sendWhatsApp(CONFIG.ADMIN_WHATSAPP, adminMessage);
    MailApp.sendEmail({ to: CONFIG.ADMIN_EMAIL, subject: "🔔 IE Team Advance Planning Checklist: 1-3 Days Birthday Alert", body: adminMessage.replace(/\\*/g, "") });
  }
}

function getSheetAndColumnMapping() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.PREFERRED_SHEET_NAME);
  if (!sheet) {
    const sheets = ss.getSheets();
    if (sheets.length > 0) sheet = sheets[0];
    else return null;
  }
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  let detectedCols = { ...CONFIG.COLS };
  headers.forEach((header, index) => {
    const title = String(header).toLowerCase().trim();
    if (title.includes("name")) detectedCols.NAME = index;
    else if (title.includes("designation") || title.includes("role")) detectedCols.DESIGNATION = index;
    else if (title.includes("birth") || title.includes("dob")) detectedCols.BIRTHDAY = index;
    else if (title.includes("email") || title.includes("mail")) detectedCols.EMAIL = index;
    else if (title.includes("whatsapp") || title.includes("phone") || title.includes("mobile")) detectedCols.WHATSAPP = index;
    else if (title.includes("wish") || title.includes("message")) detectedCols.WISH_MSG = index;
  });
  return { sheet, cols: detectedCols };
}

function normalizeDate(dateVal) {
  if (!dateVal || String(dateVal).trim() === "" || String(dateVal).toLowerCase().includes("not set")) return null;
  if (dateVal instanceof Date) return dateVal;
  let cleanStr = String(dateVal).trim().toLowerCase().replace(/(\\d+)(st|nd|rd|th)/, "$1");
  const parsedDate = new Date(cleanStr);
  if (!isNaN(parsedDate.getTime())) return parsedDate;
  return null;
}

/**
 * WhatsApp Dispatch with Automated Retry & Error Handling
 */
function sendWhatsApp(phone, message, recipientName, isRetry) {
  try {
    var formattedPhone = String(phone).replace(/[^\\d]/g, "");
    if (formattedPhone.startsWith("01") && formattedPhone.length === 11) formattedPhone = "88" + formattedPhone;
    if (!formattedPhone.startsWith("88") && formattedPhone.length === 10) formattedPhone = "880" + formattedPhone;

    var payload = { "msgs": [{ "number": formattedPhone, "message": message }] };
    var options = {
      "method": "post",
      "contentType": "application/json",
      "headers": { "Authorization": "Bearer " + CONFIG.WA_API_TOKEN },
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };

    var response = UrlFetchApp.fetch(CONFIG.WA_API_URL, options);
    var responseCode = response.getResponseCode();

    if (responseCode === 200) {
      Logger.log("✅ WhatsApp dispatched successfully to: " + formattedPhone + (recipientName ? " (" + recipientName + ")" : ""));
      return true;
    } else {
      var errorMsg = "HTTP " + responseCode + ": " + response.getContentText().slice(0, 120);
      Logger.log("⚠️ WhatsApp dispatch failed: " + errorMsg);
      if (!isRetry) {
        scheduleWhatsAppRetry(phone, message, recipientName || "Team Member", errorMsg);
      }
      return false;
    }
  } catch (e) {
    Logger.log("❌ WhatsApp dispatch exception for " + phone + ": " + e.toString());
    if (!isRetry) {
      scheduleWhatsAppRetry(phone, message, recipientName || "Team Member", e.toString());
    }
    return false;
  }
}

/**
 * AUTOMATED RETRY QUEUE:
 * Schedules a one-time time-based trigger to retry failed WhatsApp messages 2 hours later
 */
function scheduleWhatsAppRetry(phone, message, recipientName, errorReason) {
  try {
    var scriptProps = PropertiesService.getScriptProperties();
    var queue = [];
    var existingQueueStr = scriptProps.getProperty("FAILED_WA_RETRY_QUEUE");
    if (existingQueueStr) {
      try {
        queue = JSON.parse(existingQueueStr);
      } catch (err) {
        queue = [];
      }
    }

    queue.push({
      phone: phone,
      message: message,
      recipientName: recipientName,
      errorReason: errorReason,
      failedAt: new Date().toISOString(),
      retryCount: 0
    });

    scriptProps.setProperty("FAILED_WA_RETRY_QUEUE", JSON.stringify(queue));

    // Clear any previous retryFailedWhatsApp triggers to prevent redundant executions
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === "retryFailedWhatsApp") {
        ScriptApp.deleteTrigger(triggers[i]);
      }
    }

    // Schedule exact 2-hour retry trigger (2 hours = 120 minutes = 7,200,000 ms)
    ScriptApp.newTrigger("retryFailedWhatsApp")
      .timeBased()
      .after(2 * 60 * 60 * 1000)
      .create();

    Logger.log("⏳ Automated 2-Hour Retry Trigger scheduled for: " + recipientName + " (" + phone + ")");
  } catch (err) {
    Logger.log("scheduleWhatsAppRetry error: " + err.toString());
  }
}

/**
 * RETRY ENGINE (Executes 2 Hours After Initial Failure)
 * If this retry also fails, an urgent Admin Alert email is dispatched to CONFIG.ADMIN_EMAIL
 */
function retryFailedWhatsApp() {
  var scriptProps = PropertiesService.getScriptProperties();
  var queueStr = scriptProps.getProperty("FAILED_WA_RETRY_QUEUE");
  if (!queueStr) {
    Logger.log("ℹ️ No pending WhatsApp retries in queue.");
    return { success: true, message: "No items in retry queue" };
  }

  var queue = [];
  try {
    queue = JSON.parse(queueStr);
  } catch (e) {
    queue = [];
  }

  if (queue.length === 0) return { success: true, message: "Queue is empty" };

  var stillFailed = [];
  var recoveredCount = 0;

  for (var i = 0; i < queue.length; i++) {
    var item = queue[i];
    Logger.log("🔄 Executing 2-Hour Automated Retry for: " + item.recipientName + " (" + item.phone + ")");

    var success = sendWhatsApp(item.phone, item.message, item.recipientName, true);
    if (success) {
      recoveredCount++;
      Logger.log("🎉 2-Hour Retry Succeeded for: " + item.recipientName);
    } else {
      item.retryCount = (item.retryCount || 0) + 1;
      stillFailed.push(item);
    }
  }

  // If items still failed after the 2-hour retry, dispatch Admin Alert Email for manual follow-up
  if (stillFailed.length > 0) {
    var failedListLines = stillFailed.map(function(f) {
      return "• " + f.recipientName + " (" + f.phone + ") — Error: " + (f.errorReason || "API Rejected");
    }).join("\\n");

    var adminSubject = "🚨 URGENT: WhatsApp Birthday Wish Dispatch Failed (2-Hour Retry Exhausted)";
    var adminBody = "⚠️ AUTOMATED BIRTHDAY DISPATCH FAILURE REPORT\\n\\n" +
                    "The system attempted automated 8:00 AM dispatch and executed the 2-Hour Retry fallback, but WhatsApp delivery failed for the following team member(s):\\n\\n" +
                    failedListLines + "\\n\\n" +
                    "👉 Required Action: Please verify the phone number in Google Sheets ('" + CONFIG.PREFERRED_SHEET_NAME + "') or send the birthday wish manually.\\n\\n" +
                    "- IE Central Team Automated Birthday Wisher Engine -";

    try {
      MailApp.sendEmail({
        to: CONFIG.ADMIN_EMAIL,
        subject: adminSubject,
        body: adminBody
      });
      Logger.log("🚨 Admin alert email dispatched to: " + CONFIG.ADMIN_EMAIL);
    } catch (mailErr) {
      Logger.log("Failed to send admin failure email: " + mailErr.toString());
    }
  }

  // Update or clear the retry queue
  if (stillFailed.length > 0) {
    scriptProps.setProperty("FAILED_WA_RETRY_QUEUE", JSON.stringify(stillFailed));
  } else {
    scriptProps.deleteProperty("FAILED_WA_RETRY_QUEUE");
  }

  return {
    success: true,
    recovered: recoveredCount,
    failed: stillFailed.length,
    timestamp: new Date().toISOString()
  };
}

function sendEmailFallback(email, name, message) {
  try {
    MailApp.sendEmail({ to: email, subject: \`Happy Birthday, \${name}! 🎉\`, htmlBody: \`<div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background-color: #f9f9f9; border-radius: 10px;"><h2 style="color: #4CAF50;">Happy Birthday, \${name}! 🎂</h2><p style="font-size: 16px; color: #333;">\${message}</p><br><p style="font-size: 12px; color: #888;">- Sent automatically from the IE Central Team Wisher App -</p></div>\` });
    return true;
  } catch (e) {
    return false;
  }
}

function doGet(e) {
  if (e && e.parameter) {
    if (e.parameter.action === 'syncCalendar' || e.parameter.action === 'syncBirthdaysToCalendar') {
      const result = syncBirthdaysToCalendar();
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (e.parameter.action === 'sanitizeData' || e.parameter.action === 'sanitizeSheet') {
      sanitizeAllSheetData();
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data sanitized successfully" })).setMimeType(ContentService.MimeType.JSON);
    }
    if (e.parameter.action === 'retryFailedWhatsApp') {
      const result = retryFailedWhatsApp();
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Web App endpoint is active", timestamp: new Date().toISOString() })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = e.postData ? JSON.parse(e.postData.contents) : {};
    if (data.action === 'syncCalendar' || data.action === 'syncBirthdaysToCalendar') {
      const result = syncBirthdaysToCalendar();
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    if (data.action === 'sanitizeData' || data.action === 'sanitizeSheet') {
      sanitizeAllSheetData();
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Data sanitized successfully" })).setMimeType(ContentService.MimeType.JSON);
    }
    if (data.action === 'retryFailedWhatsApp') {
      const result = retryFailedWhatsApp();
      return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "success", received: data })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function testRun() {
  const sheetContext = getSheetAndColumnMapping();
  sendWhatsApp(CONFIG.ADMIN_WHATSAPP, "🤖 IE Team System Test: WhatsApp API connection is active!");
  MailApp.sendEmail(CONFIG.ADMIN_EMAIL, "IE Team System Test", "Google Apps Script email authorization is working.");
}
`;
}
