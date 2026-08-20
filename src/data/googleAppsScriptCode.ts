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
  Logger.log("✅ All automatic daily triggers successfully setup!");
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
        sendWhatsApp(phone, finalMessage);
      }
      // Send Email independently if email address exists
      if (email && email.includes("@")) {
        sendEmailFallback(email, name, finalMessage);
      }
    }
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

function sendWhatsApp(phone, message) {
  try {
    let formattedPhone = String(phone).replace(/[^\\d]/g, "");
    if (formattedPhone.startsWith("01") && formattedPhone.length === 11) formattedPhone = "88" + formattedPhone;
    const payload = { "msgs": [{ "number": formattedPhone, "message": message }] };
    const options = { "method": "post", "contentType": "application/json", "headers": { "Authorization": "Bearer " + CONFIG.WA_API_TOKEN }, "payload": JSON.stringify(payload), "muteHttpExceptions": true };
    const response = UrlFetchApp.fetch(CONFIG.WA_API_URL, options);
    return response.getResponseCode() === 200;
  } catch (e) {
    return false;
  }
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
  return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Web App endpoint is active", timestamp: new Date().toISOString() })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = e.postData ? JSON.parse(e.postData.contents) : {};
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
