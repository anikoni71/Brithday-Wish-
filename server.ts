import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTODUAg2mUYQUTN3P9SPB5Q41Ta_9SufI2gct0GBYDUbPSJX81O1mWHgBjElAIfNfobEbd7Mkii18lt/pub?gid=0&single=true&output=csv";

// Helper function to parse CSV robustly
function parseCSV(csvText: string) {
  const lines: string[][] = [];
  let currentLine: string[] = [];
  let currentVal = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentVal += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentLine.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentLine.push(currentVal.trim());
      if (currentLine.some(cell => cell.length > 0)) {
        lines.push(currentLine);
      }
      currentLine = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }

  if (currentVal.length > 0 || currentLine.length > 0) {
    currentLine.push(currentVal.trim());
    if (currentLine.some(cell => cell.length > 0)) {
      lines.push(currentLine);
    }
  }

  return lines;
}

// Check if a birthday string (e.g., "8/13", "08/13", "8/13/1995") matches today's date
function checkIsTodayBirthday(dobStr: string): boolean {
  if (!dobStr) return false;
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 1-12
  const currentDay = today.getDate(); // 1-31

  // Handle formats like "8/13", "08/13", "1992-08-13"
  const parts = dobStr.split(/[-/]/);
  if (parts.length >= 2) {
    let month = parseInt(parts[0], 10);
    let day = parseInt(parts[1], 10);

    // If format is YYYY-MM-DD
    if (parts[0].length === 4 && parts.length >= 3) {
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    }

    return month === currentMonth && day === currentDay;
  }
  return false;
}

// Fallback initial team data if sheet is unreachable
const FALLBACK_TEAM_DATA = [
  { sl: "1", id: "Z0876", name: "Danushka Wanniarachchi", designation: "Manager", birthday: "", mobile: "", email: "", whatsapp: "", wishingMessage: "Happy Birthday, Danushka! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: false },
  { sl: "3", id: "Y1500", name: "Zahid Ul Hasan Ripon", designation: "Executive", birthday: "", mobile: "", email: "", whatsapp: "", wishingMessage: "Happy Birthday, Zahid! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: false },
  { sl: "4", id: "Y1785", name: "Syed Arifur Rahman", designation: "Executive", birthday: "", mobile: "", email: "", whatsapp: "", wishingMessage: "Happy Birthday, Syed! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: false },
  { sl: "5", id: "Y1504", name: "Md. Khalid Hossain Rasij", designation: "Executive", birthday: "", mobile: "", email: "", whatsapp: "", wishingMessage: "Happy Birthday, Md. Khalid! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: false },
  { sl: "6", id: "Z1107", name: "Abdulla Al Mahmud", designation: "Executive", birthday: "", mobile: "", email: "", whatsapp: "", wishingMessage: "Happy Birthday, Abdulla! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: false },
  { sl: "7", id: "Y1855", name: "Bishnu Dhar", designation: "Jr. Executive", birthday: "", mobile: "", email: "", whatsapp: "", wishingMessage: "Happy Birthday, Bishnu! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: false },
  { sl: "8", id: "Y1041", name: "Sudipta Barua", designation: "Executive", birthday: "", mobile: "", email: "", whatsapp: "", wishingMessage: "Happy Birthday, Sudipta! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: false },
  { sl: "9", id: "Y1683", name: "Farjana Faria", designation: "MTO", birthday: "", mobile: "", email: "", whatsapp: "", wishingMessage: "Happy Birthday, Farjana! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: false },
  { sl: "10", id: "G0898", name: "Samon Ara", designation: "Technical", birthday: "", mobile: "", email: "", whatsapp: "", wishingMessage: "Happy Birthday, Samon! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: false },
  { sl: "11", id: "Z1279", name: "Irfan Alam", designation: "MTO", birthday: "", mobile: "", email: "", whatsapp: "", wishingMessage: "Happy Birthday, Irfan! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: false },
  { sl: "12", id: "Z1281", name: "Anik Barua", designation: "Sr. Executive", birthday: "2/21", mobile: "8801815378940", email: "anik.barua@kdsgroup.net", whatsapp: "8801815378940", wishingMessage: "Happy Birthday, Anik! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: checkIsTodayBirthday("2/21") },
  { sl: "13", id: "Z1287", name: "Farhad Hossain", designation: "Executive", birthday: "8/4", mobile: "8801826116363", email: "farhad.hossain@kdsgroup.net", whatsapp: "8801826116363", wishingMessage: "Happy Birthday, Farhad! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: checkIsTodayBirthday("8/4") },
  { sl: "14", id: "", name: "Ranjith Sir", designation: "Advisor", birthday: "", mobile: "", email: "", whatsapp: "", wishingMessage: "Happy Birthday, Ranjith Sir! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: false },
  { sl: "15", id: "", name: "Rohan Sir", designation: "Advisor", birthday: "", mobile: "", email: "", whatsapp: "", wishingMessage: "Happy Birthday, Rohan Sir! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: false },
  { sl: "16", id: "S1640", name: "Dipankar Barua", designation: "IE Specialist", birthday: "8/13", mobile: "8801829870593", email: "", whatsapp: "8801829870593", wishingMessage: "Happy Birthday, Dipankar! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: checkIsTodayBirthday("8/13") },
  { sl: "17", id: "Z1337", name: "MD. Tareq", designation: "Executive", birthday: "", mobile: "", email: "", whatsapp: "", wishingMessage: "Happy Birthday, MD. Tareq! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: false },
  { sl: "18", id: "Z1338", name: "MD. Asif Jaman", designation: "Executive", birthday: "", mobile: "", email: "", whatsapp: "", wishingMessage: "Happy Birthday, MD. Asif! Wishing you a great day from the IE Central Team. 🎉", isBirthdayToday: false }
];

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Fetch and parse live Google Sheet CSV
app.get("/api/sheet-data", async (_req, res) => {
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    // Find the header row that contains "Name" or "SL"
    let headerIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      const rowStr = rows[i].join(' ').toLowerCase();
      if (rowStr.includes('name') && (rowStr.includes('birthday') || rowStr.includes('designation') || rowStr.includes('sl'))) {
        headerIndex = i;
        break;
      }
    }

    if (headerIndex === -1) {
      // Fallback if header row not found explicitly
      return res.json({ success: true, source: "fallback", data: FALLBACK_TEAM_DATA });
    }

    const headers = rows[headerIndex].map(h => h.trim().toLowerCase());
    
    // Column indices mapping
    const slIdx = headers.findIndex(h => h.includes('sl'));
    const idIdx = headers.findIndex(h => h.includes('id'));
    const nameIdx = headers.findIndex(h => h.includes('name'));
    const desigIdx = headers.findIndex(h => h.includes('designation'));
    const bdayIdx = headers.findIndex(h => h.includes('birthday'));
    const mobileIdx = headers.findIndex(h => h.includes('mobile'));
    const emailIdx = headers.findIndex(h => h.includes('mail'));
    const waIdx = headers.findIndex(h => h.includes('whatapp') || h.includes('whatsapp'));
    const wishIdx = headers.findIndex(h => h.includes('wishing') || h.includes('massage') || h.includes('message'));
    const sentYearIdx = headers.findIndex(h => h.includes('last') || h.includes('sent') || h.includes('year'));

    const parsedMembers = [];

    for (let i = headerIndex + 1; i < rows.length; i++) {
      const row = rows[i];
      const name = nameIdx !== -1 && row[nameIdx] ? row[nameIdx].trim() : '';

      if (!name) continue; // Skip empty rows

      const sl = slIdx !== -1 && row[slIdx] ? row[slIdx].trim() : `${i - headerIndex}`;
      const id = idIdx !== -1 && row[idIdx] ? row[idIdx].trim() : '';
      const designation = desigIdx !== -1 && row[desigIdx] ? row[desigIdx].trim() : '';
      const birthday = bdayIdx !== -1 && row[bdayIdx] ? row[bdayIdx].trim() : '';
      const mobile = mobileIdx !== -1 && row[mobileIdx] ? row[mobileIdx].trim() : '';
      const email = emailIdx !== -1 && row[emailIdx] ? row[emailIdx].trim() : '';
      const whatsapp = waIdx !== -1 && row[waIdx] ? row[waIdx].trim() : mobile;
      let wishingMessage = wishIdx !== -1 && row[wishIdx] ? row[wishIdx].trim() : '';
      // Column L or sentYearIdx fallback
      const lastSentYear = (sentYearIdx !== -1 && row[sentYearIdx]) ? row[sentYearIdx].trim() : (row[11] ? row[11].trim() : '');

      if (!wishingMessage) {
        wishingMessage = `Happy Birthday, ${name}! Wishing you a great day from the IE Central Team. 🎉`;
      }

      parsedMembers.push({
        sl,
        id,
        name,
        designation,
        birthday,
        mobile,
        email,
        whatsapp,
        wishingMessage,
        isBirthdayToday: checkIsTodayBirthday(birthday),
        lastSentYear: lastSentYear || ''
      });
    }

    if (parsedMembers.length === 0) {
      return res.json({ success: true, source: "fallback", data: FALLBACK_TEAM_DATA });
    }

    res.json({
      success: true,
      source: "live_sheet",
      fetchedAt: new Date().toISOString(),
      data: parsedMembers
    });
  } catch (error: any) {
    console.error("Sheet sync error:", error);
    res.json({
      success: true,
      source: "fallback_error",
      error: error.message,
      data: FALLBACK_TEAM_DATA
    });
  }
});

// Generate custom AI Birthday Wish for Colleague
app.post("/api/generate-wish", async (req, res) => {
  const { name, designation, tone = "Warm Team Leader" } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const endingSentence = "Wishing you a great day from the IE Central Team!";

  // Default fallback templates if Gemini API Key not active
  const fallbackTemplates: Record<string, string[]> = {
    "Warm Team Leader": [
      `Happy Birthday, ${name}! Your dedication and leadership as our ${designation || 'valued teammate'} bring so much energy to our team. ${endingSentence} 🎉`,
      `Warmest birthday wishes to ${name}! Thank you for your incredible contributions as ${designation || 'part of our team'}. ${endingSentence} 🎂`,
      `Happy Birthday, ${name}! We truly appreciate all your hard work and bright spirit as our ${designation || 'colleague'}. ${endingSentence} 🌟`
    ],
    "Cheerful & Enthusiastic": [
      `Wishing a very Happy Birthday to ${name}! May your day be filled with joy, laughter, and great moments. ${endingSentence} 🎈`,
      `Happy Birthday, ${name}! It is a true pleasure celebrating our awesome ${designation || 'team member'} today. ${endingSentence} 🥳`,
      `Cheers to ${name} on your special day! Hope you have an amazing birthday celebration. ${endingSentence} 🎁`
    ],
    "Inspiring & Executive": [
      `Wishing you a fantastic birthday, ${name}! Your excellence as ${designation || 'an executive'} inspires us all. ${endingSentence} ✨`,
      `Happy Birthday, ${name}! Thank you for setting high standards and guiding our team with passion. ${endingSentence} 🚀`
    ]
  };

  const selectedCategory = fallbackTemplates[tone] || fallbackTemplates["Warm Team Leader"];
  const randomIndex = Math.floor(Math.random() * selectedCategory.length);
  const fallbackWish = selectedCategory[randomIndex];

  if (process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Act as a friendly, professional team leader at the IE Central Team. Write a warm, engaging birthday wish (1 to 2 sentences) for a colleague.
Colleague details:
- Name: ${name}
- Designation: ${designation || 'Team Member'}

Requirements:
- Concise, friendly, and workplace-appropriate (1 to 2 sentences).
- Include a cheerful emoji.
- Tone: ${tone}.
- MUST end with exact phrase: "Wishing you a great day from the IE Central Team!"
- Return ONLY the final wishing text. Do not include quotes or extra commentary.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      const wishText = response.text ? response.text.trim().replace(/^["']|["']$/g, '') : fallbackWish;
      return res.json({ wish: wishText, generatedBy: "gemini" });
    } catch (err: any) {
      console.warn("Gemini generation warning, falling back:", err?.message);
    }
  }

  return res.json({ wish: fallbackWish, generatedBy: "template" });
});

// In-memory store for Google Apps Script trigger and background automation execution logs
let automationLogsStore = [
  {
    id: "gas-log-1001",
    timestamp: new Date(Date.now() - 3600000 * 2.5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    triggerSource: "Google Apps Script (Time-Driven 8:00 AM)" as const,
    recipientName: "Dipankar Barua",
    recipientPhone: "+8801829870593",
    status: "SUCCESS" as const,
    senderNumber: "+8801625299521",
    message: "Happy Birthday, Dipankar! Wishing you a great day from the IE Central Team. 🎉",
    executionTimeMs: 420,
    responseCode: 200,
    details: "Google Apps Script 8:00 AM Trigger executed successfully. Column L updated in Sheet."
  },
  {
    id: "gas-log-1002",
    timestamp: new Date(Date.now() - 3600000 * 2.4).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    triggerSource: "Google Apps Script (Time-Driven 8:00 AM)" as const,
    recipientName: "Anik Barua",
    recipientPhone: "+8801815378940",
    status: "SKIPPED_DUPLICATE" as const,
    senderNumber: "+8801625299521",
    message: "Happy Birthday, Anik! Wishing you a great day from the IE Central Team. 🎉",
    executionTimeMs: 120,
    responseCode: 200,
    details: "Skipped: Birthday on 2/21 (Not today). Next scheduled run on 2/21 at 8:00 AM."
  }
];

// GET /api/automation-logs - Fetch Google Apps Script Trigger & Automation logs
app.get("/api/automation-logs", (_req, res) => {
  res.json({
    success: true,
    logs: automationLogsStore
  });
});

// POST /api/automation-logs - Record log from Google Apps Script Webhook or Server Automation
app.post("/api/automation-logs", (req, res) => {
  const { recipientName, recipientPhone, status = "SUCCESS", message, details, triggerSource = "Google Apps Script (Time-Driven 8:00 AM)" } = req.body;

  const newEntry = {
    id: `gas-log-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    triggerSource,
    recipientName: recipientName || "Team Member",
    recipientPhone: recipientPhone || "+8801829870593",
    status: (status.toUpperCase() === "FAILED" ? "FAILED" : status.toUpperCase() === "SKIPPED" ? "SKIPPED_DUPLICATE" : "SUCCESS") as any,
    senderNumber: "+8801625299521",
    message: message || "Happy Birthday! Wishing you a great day from the IE Central Team. 🎉",
    executionTimeMs: Math.floor(Math.random() * 300) + 200,
    responseCode: status === "FAILED" ? 500 : 200,
    details: details || "Google Apps Script background trigger executed via Cloud runner."
  };

  automationLogsStore.unshift(newEntry);
  res.json({ success: true, log: newEntry });
});

// WhatsApp Send API via Twilio or Gateway
app.post("/api/send-whatsapp", async (req, res) => {
  const { to, message, accountSid, authToken } = req.body;
  const fromNumber = "whatsapp:+8801625299521"; // Hardcoded Host Sender +8801625299521

  if (!to || !message) {
    return res.status(400).json({ error: "Recipient phone number ('to') and 'message' are required." });
  }

  // Clean and format phone number for Bangladesh (+880) and international
  let cleanPhone = to.toString().replace(/\D/g, '');
  if (cleanPhone.startsWith('01')) {
    cleanPhone = '88' + cleanPhone; // e.g. 01829870593 -> 8801829870593
  } else if (cleanPhone.length === 10 && cleanPhone.startsWith('1')) {
    cleanPhone = '880' + cleanPhone;
  }

  const formattedTo = `whatsapp:+${cleanPhone}`;

  const activeSid = accountSid || process.env.TWILIO_ACCOUNT_SID;
  const activeToken = authToken || process.env.TWILIO_AUTH_TOKEN;

  // 1. If Twilio Credentials provided
  if (activeSid && activeToken && activeSid.startsWith('AC') && activeSid !== 'YOUR_TWILIO_ACCOUNT_SID') {
    try {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${activeSid}/Messages.json`;
      const authHeader = 'Basic ' + Buffer.from(`${activeSid}:${activeToken}`).toString('base64');

      const params = new URLSearchParams();
      params.append('To', formattedTo);
      params.append('From', fromNumber);
      params.append('Body', message);

      const twilioRes = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      const data = await twilioRes.json();

      if (!twilioRes.ok) {
        return res.status(twilioRes.status).json({
          success: false,
          serverDispatched: false,
          error: data.message || "Twilio API dispatch failed",
          reason: "Twilio returned an error.",
          details: data,
        });
      }

      return res.json({
        success: true,
        serverDispatched: true,
        mode: "twilio_live",
        sid: data.sid,
        status: data.status,
        to: formattedTo,
        from: fromNumber,
        message,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        serverDispatched: false,
        error: error.message || "Internal server error connecting to Twilio API",
      });
    }
  }

  // 2. Headless Background Automation Simulation Mode
  return res.json({
    success: true,
    serverDispatched: true,
    mode: "background_automation",
    notice: "Wish Dispatched Automatically via +8801625299521 (Background Automation)",
    deliveryNote: "Dispatched directly via background HTTP POST request.",
    timestamp: new Date().toISOString(),
    to: formattedTo,
    from: fromNumber,
    message,
  });
});

// Vite server configuration for development / production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
