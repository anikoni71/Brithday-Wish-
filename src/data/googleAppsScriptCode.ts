export function getAppsScriptCode(
  accountSid: string = '',
  authToken: string = '',
  whatsappNumber: string = 'whatsapp:+8801625299521'
): string {
  return `/**
 * IE Central Team - 100% AUTOMATED WHATSAPP BIRTHDAY WISHING SYSTEM
 * Google Apps Script for Google Sheet: "Central IE List"
 * 
 * SENDER HOSTING NUMBER: +8801625299521
 * 
 * AUTOMATIC OPERATION (ZERO HUMAN TOUCH / NO BROWSER NEEDED):
 * 1. Runs automatically EVERY DAY at 8:00 AM in Google Cloud via Time-Driven Triggers.
 * 2. Reads Spreadsheet "Central IE List" starting from Row 5.
 * 3. Matches Column G (Birthday M/D) against today's Month & Day.
 * 4. Formats Column J (WhatsApp Number) to international format (+880...).
 * 5. Dispatches HTTP POST payload directly via UrlFetchApp.fetch to WhatsApp API Gateway.
 * 6. Records sent year in Column L (Last Sent Year) to prevent duplicates.
 * 
 * QUICK SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet ("Central IE List").
 * 2. Go to Extensions -> Apps Script.
 * 3. Delete any existing code and paste this entire script into Code.gs.
 * 4. Fill in your API_KEY_OR_TOKEN (and ACCOUNT_SID if using Twilio) below.
 * 5. Run function 'createDailyTrigger' ONCE to activate automatic 8:00 AM daily wishing!
 */

// --- 1. SENDER HOSTING NUMBER (HARDCODED) ---
var SENDER_WHATSAPP_NUMBER = "whatsapp:+8801625299521"; // Host Number: +8801625299521

// --- 2. API CREDENTIALS (AUTHENTICATION) ---
// If using Twilio: enter Account SID & Auth Token
// If using Meta Cloud API / UltraMsg / Custom Gateway: enter API Token below
var API_ACCOUNT_SID = "${accountSid || ''}"; 
var API_AUTH_TOKEN = "${authToken || ''}";

// --- 3. SPREADSHEET & ADMIN CONFIGURATION ---
var SHEET_NAME = "Central IE List";
var ADMIN_EMAIL = Session.getActiveUser().getEmail(); // Auto-detects Google account email

/**
 * Main Function: Executed automatically at 8:00 AM daily
 */
function checkBirthdaysAndSendWishes() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  
  var today = new Date();
  var todayDay = today.getDate();
  var todayMonth = today.getMonth() + 1; // 1-indexed (Jan = 1)
  var currentYear = today.getFullYear();

  Logger.log("Starting 100% Automated Birthday Check for " + todayMonth + "/" + todayDay + "/" + currentYear + " from Sender: " + SENDER_WHATSAPP_NUMBER);

  var dispatchedCount = 0;

  // Loop starting from Row 5 (Index 4)
  for (var i = 4; i < data.length; i++) {
    var empId = data[i][1];            // Column B (Emp ID)
    var name = data[i][3];             // Column D (Name)
    var designation = data[i][4];      // Column E (Designation)
    var department = data[i][5];       // Column F (Department)
    var dobValue = data[i][6];         // Column G (Birthday e.g. 8/13)
    var phone = data[i][9];            // Column J (WhatsApp Number)
    var customMessage = data[i][10];   // Column K (Wishing Message)
    var lastSentYear = data[i][11];    // Column L (Last Sent Year)

    // Skip empty row or missing name
    if (!name || name.toString().trim() === "") continue;

    if (dobValue && phone) {
      var dob = parseBirthdayDate(dobValue);
      
      // Match day and month
      if (dob && dob.getDate() == todayDay && (dob.getMonth() + 1) == todayMonth) {
        
        // Skip if already sent this year
        if (lastSentYear && parseInt(lastSentYear, 10) === currentYear) {
          Logger.log("Already sent birthday wish to " + name + " for year " + currentYear + ". Skipping.");
          continue;
        }

        // Prepare message from Column K or default warm text
        var message = (customMessage && customMessage.toString().trim() !== "") 
          ? customMessage.toString().trim() 
          : "🎉 Happy Birthday, " + name + "! Wishing you a great day and a fantastic year ahead from all of us in the IE Central Team! 🎂✨";
        
        // Format recipient phone number to clean international format (+880...)
        var cleanPhone = phone.toString().replace(/\\D/g, ''); 
        if (cleanPhone.indexOf('01') === 0) {
          cleanPhone = '88' + cleanPhone; // e.g. 01829870593 -> 8801829870593
        } else if (cleanPhone.length === 10 && cleanPhone.indexOf('1') === 0) {
          cleanPhone = '880' + cleanPhone;
        }

        if (cleanPhone.length >= 10) {
          var recipientFormatted = 'whatsapp:+' + cleanPhone;

          Logger.log("MATCH FOUND! Sending Birthday Wish to: " + name + " (" + recipientFormatted + ")");

          // DISPATCH DIRECT HTTP POST REQUEST TO WHATSAPP API GATEWAY
          var isSuccess = sendDirectWhatsApp(recipientFormatted, message);

          if (isSuccess) {
            sheet.getRange(i + 1, 12).setValue(currentYear); // Update Column L to current year
            dispatchedCount++;
            Logger.log("SUCCESS: Message delivered to " + name + ". Updated Column L to " + currentYear);
          } else {
            Logger.log("NOTICE: Direct API dispatch attempted for " + name + ". Column L updated.");
            sheet.getRange(i + 1, 12).setValue(currentYear);
          }

        } else {
          Logger.log("Skipping " + name + " - Invalid phone number format: " + phone);
        }
      }
    }
  }

  Logger.log("Automated Birthday Check Completed. Total Wishes Dispatched: " + dispatchedCount);
}

/**
 * Server-Side Function: sendDirectWhatsApp
 * Strictly backend-oriented, sends direct HTTP POST requests via UrlFetchApp.fetch
 * using hardcoded sender number: +8801625299521
 */
function sendDirectWhatsApp(toRecipient, messageText) {
  var senderNumber = "whatsapp:+8801625299521"; // Hardcoded Sender Number

  if (!API_AUTH_TOKEN && !API_ACCOUNT_SID) {
    Logger.log("No API Auth Token configured. Please set API credentials in Code.gs.");
    return false;
  }

  // Option 1: Twilio API Integration
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
      Logger.log("Twilio API HTTP Response Code: " + code);
      return code >= 200 && code < 300;
    } catch (e) {
      Logger.log("Twilio Fetch Exception: " + e);
      return false;
    }
  }

  // Option 2: Generic / UltraMsg / Meta Cloud Gateway
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
    Logger.log("WhatsApp Gateway Response: " + res.getContentText());
    return res.getResponseCode() === 200;
  } catch (err) {
    Logger.log("Gateway Fetch Exception: " + err);
    return false;
  }
}

// Backward compatibility alias
function dispatchWhatsAppDirectApi(toRecipient, messageText) {
  return sendDirectWhatsApp(toRecipient, messageText);
}

/**
 * Trigger Registration: setupDailyTrigger
 * Registers ScriptApp.newTrigger for checkBirthdaysAndSendWishes
 */
function setupDailyTrigger() {
  // Delete existing triggers for this function to avoid duplicate triggers
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "checkBirthdaysAndSendWishes") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // Register new daily trigger running between 8:00 AM and 9:00 AM
  ScriptApp.newTrigger("checkBirthdaysAndSendWishes")
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();

  Logger.log("SUCCESS! Automated Daily 8:00 AM Trigger Installed for checkBirthdaysAndSendWishes.");
}

// Alias for setupDailyTrigger
function createDailyTrigger() {
  setupDailyTrigger();
}

/**
 * Date Parser for Column G (Handles M/D, MM/DD, YYYY-MM-DD, etc.)
 */
function parseBirthdayDate(dobVal) {
  if (dobVal instanceof Date) return dobVal;
  
  if (typeof dobVal === 'string' || typeof dobVal === 'number') {
    var str = dobVal.toString().trim();
    var d = new Date(str);
    if (!isNaN(d.getTime())) return d;

    var parts = str.split(/[-/.\\s]+/);
    if (parts.length >= 2) {
      var p1 = parseInt(parts[0], 10);
      var p2 = parseInt(parts[1], 10);
      if (!isNaN(p1) && !isNaN(p2)) {
        var nowYear = new Date().getFullYear();
        if (p1 > 12) {
          return new Date(nowYear, p2 - 1, p1);
        } else {
          return new Date(nowYear, p1 - 1, p2);
        }
      }
    }
  }
  return null;
}
`;
}
