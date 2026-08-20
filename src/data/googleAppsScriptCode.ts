/**
 * IE Central Team - Automated Birthday Wisher & Admin Alerts
 * Google Apps Script Generator
 */

export function getAppsScriptCode(
  accountSid: string = '',
  authToken: string = '',
  whatsappNumber: string = '+8801625299521',
  adminWhatsApp: string = '+8801625299521',
  adminEmail: string = 'anik.barua@kdsgroup.net',
  sheetName: string = 'Sheet1',
  waApiUrl: string = 'https://app.assistro.co/api/v1/send-message',
  waApiToken: string = 'pat_GOUOouAvExkrGBgAQYTjRBC73gpBb718fCW5mYBj'
): string {
  const cleanAdminPhone = adminWhatsApp.replace('whatsapp:', '').trim() || '+8801625299521';
  const cleanAdminEmail = adminEmail.trim() || 'anik.barua@kdsgroup.net';
  const cleanSheetName = sheetName.trim() || 'Sheet1';
  const activeWaUrl = waApiUrl.trim() || 'https://app.assistro.co/api/v1/send-message';
  const activeWaToken = (waApiToken || authToken || '').trim() || 'pat_GOUOouAvExkrGBgAQYTjRBC73gpBb718fCW5mYBj';

  return `/**
 * IE Central Team - Automated Birthday Wisher & Admin Alerts
 * Fully Automated Zero-Touch System
 */

// ================= CONFIGURATION =================
const CONFIG = {
  SHEET_NAME: "${cleanSheetName}", // Ensure this matches the exact tab name at the bottom of your Google Sheet
  ADMIN_WHATSAPP: "${cleanAdminPhone}", // Updated Admin Phone
  ADMIN_EMAIL: "${cleanAdminEmail}", // Updated Admin Email
  
  // WhatsApp Gateway Settings 
  WA_API_URL: "${activeWaUrl}", 
  WA_API_TOKEN: "${activeWaToken}",
  
  // Column Indexes (0-based array mapping)
  COLS: {
    NAME: 3,        // Column D
    DESIGNATION: 4, // Column E
    BIRTHDAY: 6,    // Column G
    EMAIL: 7,       // Column H
    WHATSAPP: 9,    // Column J
    WISH_MSG: 10    // Column K
  }
};

// ================= 1. SETUP TRIGGERS =================
function setupAllTriggers() {
  // Clear any existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  // 1. Trigger for sending birthday wishes (Runs every day between 8 AM - 9 AM)
  ScriptApp.newTrigger('checkBirthdaysAndSendWishes')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();

  // 2. Trigger for Admin Advance Planning Alerts (Runs every day between 5 PM - 6 PM)
  ScriptApp.newTrigger('sendAdminUpcomingBirthdayAlerts')
    .timeBased()
    .everyDays(1)
    .atHour(17)
    .create();

  Logger.log("✅ All triggers successfully setup!");
}


// ================= 2. MORNING AUTO-WISH DISPATCH =================
function checkBirthdaysAndSendWishes() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if(!sheet) return;
  const data = sheet.getDataRange().getValues();
  
  const today = new Date();
  
  // Loop through rows (skip header row 0)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const name = row[CONFIG.COLS.NAME];
    if (!name) continue; // Skip empty rows

    const birthdayStr = row[CONFIG.COLS.BIRTHDAY];
    const birthdayDate = normalizeDate(birthdayStr);
    
    // Check if birthday is today
    if (birthdayDate && birthdayDate.getMonth() === today.getMonth() && birthdayDate.getDate() === today.getDate()) {
      
      let phone = row[CONFIG.COLS.WHATSAPP] ? String(row[CONFIG.COLS.WHATSAPP]).trim() : null;
      let email = row[CONFIG.COLS.EMAIL] ? String(row[CONFIG.COLS.EMAIL]).trim() : null;
      let rawMessage = row[CONFIG.COLS.WISH_MSG] || \`Happy Birthday, \${'{Name}'}! Wishing you a great day from the IE Central Team. 🎉\`;
      
      // Dynamic Message Personalization
      let finalMessage = rawMessage
        .replace(/{Name}/gi, name)
        .replace(/{Designation}/gi, row[CONFIG.COLS.DESIGNATION]);

      let deliveredViaWA = false;

      // Try WhatsApp First
      if (phone && phone.startsWith("+880")) {
        const waResult = sendWhatsApp(phone, finalMessage);
        deliveredViaWA = waResult && (waResult === true || waResult.success === true);
      }

      // Email Fallback if WhatsApp fails or number is missing
      if (!deliveredViaWA && email && email.includes("@")) {
        sendEmailFallback(email, name, finalMessage);
      }
    }
  }
}


// 3. ADMIN ADVANCE ALERTS
function sendAdminUpcomingBirthdayAlerts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if(!sheet) return;
  const data = sheet.getDataRange().getValues();
  
  const today = new Date();
  let upcomingCelebrants = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const name = row[CONFIG.COLS.NAME];
    if (!name) continue;

    const birthdayStr = row[CONFIG.COLS.BIRTHDAY];
    const birthdayDate = normalizeDate(birthdayStr);
    
    if (birthdayDate) {
      // Calculate days difference
      const nextBirthday = new Date(today.getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate());
      if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1); // Next year if already passed
      
      const diffTime = Math.abs(nextBirthday - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays >= 1 && diffDays <= 3) {
        const hasPhone = row[CONFIG.COLS.WHATSAPP] ? "✅ Yes" : "❌ No Phone";
        const timeframe = diffDays === 1 ? "Tomorrow" : \`In \${diffDays} days\`;
        
        upcomingCelebrants.push(\`- *\${name}* (\${row[CONFIG.COLS.DESIGNATION]})\n📅 \${timeframe} | 📱 WA Ready: \${hasPhone}\`);
      }
    }
  }

  // Send Alert to Admin if there are upcoming birthdays
  if (upcomingCelebrants.length > 0) {
    const adminMessage = \`🔔 *IE Team Admin Alert: Upcoming Birthdays!*\n\n\${upcomingCelebrants.join("\\n\\n")}\n\n📝 Please verify their contact numbers in the Google Sheet before the 8:00 AM automated dispatch.\`;
    
    // Send to Admin WhatsApp
    sendWhatsApp(CONFIG.ADMIN_WHATSAPP, adminMessage);
    
    // Send to Admin Email
    MailApp.sendEmail({
      to: CONFIG.ADMIN_EMAIL,
      subject: "🔔 Upcoming IE Team Birthdays - Action Required",
      body: adminMessage.replace(/\\*/g, "") // Remove markdown for email
    });
  }
}


// ================= HELPER FUNCTIONS =================

// Smart Date Normalizer ("6th May", "08/13", "21st Feb")
function normalizeDate(dateStr) {
  if (!dateStr || String(dateStr).trim() === "" || String(dateStr).toLowerCase().includes("not set")) return null;
  
  // If it's already a JS Date object (parsed by Google Sheets)
  if (dateStr instanceof Date) return dateStr;
  
  let cleanStr = String(dateStr).trim().toLowerCase();
  
  // Remove ordinals (st, nd, rd, th)
  cleanStr = cleanStr.replace(/(\\d+)(st|nd|rd|th)/, "$1");
  
  // Handle DD/MM or MM/DD logic if needed, otherwise fallback to native Date parsing
  const parsedDate = new Date(cleanStr);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }
  
  return null;
}

// Send WhatsApp via API Gateway (Assistro)
function sendWhatsApp(phone, message) {
  if (!CONFIG.WA_API_URL || CONFIG.WA_API_URL.includes("your-whatsapp-gateway")) {
    const err = "WhatsApp Gateway URL is not configured in CONFIG.";
    Logger.log("WhatsApp Delivery Failed: " + err);
    return { success: false, error: err };
  }
  
  try {
    const payload = {
      "to": phone,
      "message": message,
      "token": CONFIG.WA_API_TOKEN
    };
    
    const options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };
    
    const response = UrlFetchApp.fetch(CONFIG.WA_API_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    // Capture the full body of the response when a non-200 code is received to aid in debugging
    if (responseCode !== 200 && responseCode !== 201) {
      Logger.log("⚠️ Assistro Gateway Non-200 Status [" + responseCode + "] Full Response Body: " + responseText);
    }
    
    var responseData = {};
    try {
      responseData = JSON.parse(responseText);
    } catch (parseErr) {
      Logger.log("⚠️ Could not parse JSON response from Assistro: " + parseErr.toString() + " | Raw text: " + responseText);
      responseData = { message: responseText };
    }
    
    if (responseCode === 200 || responseCode === 201) {
      if (responseData && (responseData.status === "error" || responseData.success === false)) {
        var errorMsg = responseData.error || responseData.message || responseData.msg || "Assistro API reported dispatch failure";
        Logger.log("WhatsApp Delivery Error (" + responseCode + "): " + errorMsg + " | Full Body: " + responseText);
        return {
          success: false,
          error: errorMsg,
          code: responseCode,
          details: responseData,
          rawBody: responseText
        };
      }
      return {
        success: true,
        message: responseData.message || "Message dispatched successfully via WhatsApp",
        data: responseData
      };
    } else {
      // Extract specific descriptive error message provided by the Assistro API gateway using JSON parsing
      var errorMsg = responseData.error || responseData.message || responseData.msg || responseData.details || responseText || ("Assistro API HTTP " + responseCode + " error");
      Logger.log("❌ WhatsApp Delivery Failed (" + responseCode + "): " + errorMsg + " | Full Body: " + responseText);
      return {
        success: false,
        error: errorMsg,
        code: responseCode,
        details: responseData,
        rawBody: responseText
      };
    }
  } catch (e) {
    var errorMsg = e.toString();
    Logger.log("❌ WhatsApp Delivery Exception: " + errorMsg);
    return {
      success: false,
      error: errorMsg
    };
  }
}

// Fallback Email Sender
function sendEmailFallback(email, name, message) {
  try {
    MailApp.sendEmail({
      to: email,
      subject: \`Happy Birthday, \${'{name}'}! 🎉\`.replace('{name}', name),
      htmlBody: \`
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; background-color: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #4CAF50;">Happy Birthday, \${name}! 🎂</h2>
          <p style="font-size: 16px; color: #333;">\${message}</p>
          <br>
          <p style="font-size: 12px; color: #888;">- Sent automatically from the IE Central Team Wisher App -</p>
        </div>
      \`
    });
    return { success: true, message: "Email fallback dispatched successfully to " + email };
  } catch (e) {
    var errorMsg = e.toString();
    Logger.log("Email Fallback Failed: " + errorMsg);
    return { success: false, error: errorMsg };
  }
}

function doGet(e) {
  var output = {
    status: "success",
    message: "Web App endpoint is active",
    timestamp: new Date().toISOString()
  };
  
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = e.postData ? JSON.parse(e.postData.contents) : {};
    
    // Direct dispatch trigger from Web App UI
    if (data.action === "sendWhatsApp" || data.to || data.phone) {
      var phone = data.to || data.phone;
      var message = data.message || data.msg;
      var result = sendWhatsApp(phone, message);
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", received: data }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString(), message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
}
