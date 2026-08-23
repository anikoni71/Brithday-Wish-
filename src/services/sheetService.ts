import { TeamMember, AdminSheetConfig } from '../types';
import { checkIsTodayBirthday } from '../utils/dateUtils';
import { REAL_IE_TEAM_ROSTER } from '../data/fallbackData';
import { formatProfileImageUrl } from '../utils/imageUtils';

export const DEFAULT_GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTODUAg2mUYQUTN3P9SPB5Q41Ta_9SufI2gct0GBYDUbPSJX81O1mWHgBjElAIfNfobEbd7Mkii18lt/pub?gid=0&single=true&output=csv";

/**
 * Intelligent Admin Configuration Collector from Google Sheet:
 * Scans top metadata rows, specific column headers (Sender Number, Admin Notification Email, Admin WhatsApp Number),
 * and management roles to automatically retrieve live configuration.
 */
export function extractAdminConfigFromSheet(
  rows: string[][],
  members: TeamMember[]
): AdminSheetConfig {
  let detectedSenderNumber = '';
  let detectedWhatsApp = '';
  let detectedEmail = '';
  let detectedTwilioSid = '';
  let detectedTwilioToken = '';
  let detectedRole = '';

  const normalizePhone = (numStr: string): string => {
    if (!numStr) return '';
    const clean = numStr.trim().replace(/[^\d+]/g, '');
    if (!clean) return '';
    if (clean.startsWith('+')) return clean;
    if (clean.startsWith('880')) return '+' + clean;
    if (clean.startsWith('01')) return '+88' + clean;
    return '+' + clean;
  };

  // 1. Check for specific table header row: "Sender Number", "Admin Notification Email", "Admin WhatsApp Number", "Twilio SID", "Twilio Token"
  for (let r = 0; r < Math.min(rows.length, 15); r++) {
    const row = rows[r] || [];
    for (let c = 0; c < row.length; c++) {
      const header = (row[c] || '').trim().toLowerCase();
      const nextRowVal = rows[r + 1] && rows[r + 1][c] ? (rows[r + 1][c] || '').trim() : '';

      // Match "Sender Number" / "WhatsApp Sender" / "Wishing Message Sender Number"
      if (header.includes('sender') && (header.includes('number') || header.includes('whatsapp') || header.includes('phone') || header.includes('sender'))) {
        if (nextRowVal && !detectedSenderNumber) {
          detectedSenderNumber = normalizePhone(nextRowVal);
          detectedRole = 'Google Sheet Config Table';
        }
      }

      // Match "Admin Notification Email" / "Admin Email"
      if (header.includes('admin') && (header.includes('email') || header.includes('mail') || header.includes('notification'))) {
        if (nextRowVal && nextRowVal.includes('@') && !detectedEmail) {
          const emailMatch = nextRowVal.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          if (emailMatch) {
            detectedEmail = emailMatch[0];
            detectedRole = 'Google Sheet Config Table';
          }
        }
      }

      // Match "Admin WhatsApp Number" / "Admin WhatsApp"
      if (header.includes('admin') && (header.includes('whatsapp') || header.includes('whatapp') || (header.includes('admin') && header.includes('number')))) {
        if (nextRowVal && !detectedWhatsApp) {
          detectedWhatsApp = normalizePhone(nextRowVal);
          detectedRole = 'Google Sheet Config Table';
        }
      }

      // Match Twilio Account SID
      if ((header.includes('twilio') && header.includes('sid')) || header.includes('api_account_sid') || header.includes('account_sid')) {
        if (nextRowVal && nextRowVal.startsWith('AC') && !detectedTwilioSid) {
          detectedTwilioSid = nextRowVal;
        }
      }

      // Match Twilio Auth Token
      if ((header.includes('twilio') && header.includes('token')) || header.includes('api_auth_token') || header.includes('auth_token')) {
        if (nextRowVal && nextRowVal.length > 20 && !detectedTwilioToken) {
          detectedTwilioToken = nextRowVal;
        }
      }
    }
  }

  // 2. Scan all cells for inline key-value pairs or metadata
  for (const row of rows) {
    for (let c = 0; c < row.length; c++) {
      const cell = (row[c] || '').trim();
      const cellLower = cell.toLowerCase();

      // Check for Sender Number inline
      if (!detectedSenderNumber && cellLower.includes('sender') && (cellLower.includes('number') || cellLower.includes('whatsapp') || cellLower.includes('phone') || cellLower.includes('sender'))) {
        const textToCheck = cell + ' ' + (row[c + 1] || '');
        const phoneMatch = textToCheck.match(/(\+?880[0-9]{9,10}|01[0-9]{9}|880[0-9]{9,10})/);
        if (phoneMatch) {
          detectedSenderNumber = normalizePhone(phoneMatch[0]);
        }
      }

      // Check for Admin Email patterns
      if (
        (cellLower.includes('admin') || cellLower.includes('leader') || cellLower.includes('notification')) &&
        cellLower.includes('@')
      ) {
        const emailMatch = cell.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch && !detectedEmail) {
          detectedEmail = emailMatch[0];
          detectedRole = 'Google Sheet Header Metadata';
        }
      } else if (cellLower.includes('admin email') || cellLower.includes('notification email') || cellLower.includes('leader email')) {
        const nextCell = (row[c + 1] || '').trim();
        const emailMatch = nextCell.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch && !detectedEmail) {
          detectedEmail = emailMatch[0];
          detectedRole = 'Google Sheet Header Metadata';
        }
      }

      // Check for Admin WhatsApp / Phone patterns
      if (
        (cellLower.includes('admin') || cellLower.includes('leader') || cellLower.includes('notification')) &&
        (cellLower.includes('whatsapp') || cellLower.includes('phone') || cellLower.includes('mobile') || cellLower.includes('contact'))
      ) {
        const textToCheck = cell + ' ' + (row[c + 1] || '');
        const phoneMatch = textToCheck.match(/(\+?880[0-9]{9,10}|01[0-9]{9}|880[0-9]{9,10})/);
        if (phoneMatch && !detectedWhatsApp) {
          detectedWhatsApp = normalizePhone(phoneMatch[0]);
          detectedRole = 'Google Sheet Header Metadata';
        }
      }
    }
  }

  // 3. Fallbacks from roster leadership roles if needed
  if (!detectedWhatsApp || !detectedEmail || !detectedSenderNumber) {
    const leader = members.find(
      (m) =>
        m.designation.toLowerCase().includes('manager') ||
        m.designation.toLowerCase().includes('leader') ||
        m.designation.toLowerCase().includes('head') ||
        m.name.toLowerCase().includes('danushka') ||
        m.name.toLowerCase().includes('anik')
    );

    if (leader) {
      if (!detectedWhatsApp && leader.whatsapp) {
        detectedWhatsApp = normalizePhone(leader.whatsapp);
      }
      if (!detectedEmail && leader.email && leader.email.includes('@')) {
        detectedEmail = leader.email;
      }
      if (!detectedSenderNumber) {
        detectedSenderNumber = normalizePhone(leader.whatsapp || '+8801625299521');
      }
      if (!detectedRole) {
        detectedRole = `${leader.name} (${leader.designation})`;
      }
    }
  }

  // Final default fallbacks matching latest official KDS Central IE credentials
  const finalSender = detectedSenderNumber || '+8801625299521';
  const finalWhatsApp = detectedWhatsApp || '+8801625299521';
  const finalEmail = detectedEmail || 'anik.barua@kdsgroup.net';

  return {
    senderWhatsApp: finalSender,
    adminWhatsApp: finalWhatsApp,
    adminEmail: finalEmail,
    twilioAccountSid: detectedTwilioSid,
    twilioAuthToken: detectedTwilioToken,
    source: detectedWhatsApp || detectedEmail || detectedSenderNumber || detectedTwilioSid ? 'google_sheet_meta' : 'google_sheet_default',
    isAutoDetected: true,
    sheetName: 'Central IE List',
    detectedRole: detectedRole || 'Central IE Management (Sender & Leadership)',
    lastSynced: new Date().toLocaleTimeString(),
    syncId: `sync-${Date.now()}`
  };
}

/**
 * Robust CSV string tokenizer handling RFC4180 quotes, commas, newlines
 */
export function parseCSV(csvText: string): string[][] {
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
      if (currentLine.some((cell) => cell.length > 0)) {
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
    if (currentLine.some((cell) => cell.length > 0)) {
      lines.push(currentLine);
    }
  }

  return lines;
}

/**
 * Parse rows into TeamMember objects with dynamic header detection
 */
export function parseSheetRowsToMembers(rows: string[][]): TeamMember[] {
  if (!rows || rows.length === 0) return [];

  // Find header row containing "Name" or "SL" or "Birthday"
  let headerRowIdx = -1;
  for (let i = 0; i < rows.length; i++) {
    const rowStr = rows[i].join(' ').toLowerCase();
    if (
      rowStr.includes('name') &&
      (rowStr.includes('birthday') ||
        rowStr.includes('designation') ||
        rowStr.includes('sl') ||
        rowStr.includes('id'))
    ) {
      headerRowIdx = i;
      break;
    }
  }

  if (headerRowIdx === -1) {
    // If no explicit header, assume Row 4 is header (index 3) or Row 2 (index 1)
    headerRowIdx = rows.length > 3 ? 3 : 0;
  }

  const headers = rows[headerRowIdx].map((h) => h.toLowerCase().trim());

  // Find column indices
  const slIdx = headers.findIndex((h) => h === 'sl' || h.includes('sl'));
  const idIdx = headers.findIndex((h) => h === 'id' || h.includes('id'));
  const nameIdx = headers.findIndex((h) => h === 'name' || h.includes('name'));
  const desigIdx = headers.findIndex((h) => h.includes('designation') || h.includes('desig'));
  const deptIdx = headers.findIndex((h) => h.includes('department') || h.includes('dept') || h.includes('section') || h.includes('team') || h.includes('unit'));
  const bdayIdx = headers.findIndex(
    (h) => h.includes('birthday') || h.includes('birth') || h.includes('dob')
  );
  const mobileIdx = headers.findIndex(
    (h) => h.includes('mobile') || h.includes('phone') || h.includes('contact')
  );
  const emailIdx = headers.findIndex((h) => h.includes('mail'));
  const waIdx = headers.findIndex((h) => h.includes('whatapp') || h.includes('whatsapp'));
  const imageIdx = headers.findIndex(
    (h) => h.includes('image') || h.includes('photo') || h.includes('avatar') || h.includes('picture') || h.includes('img') || h.includes('pic') || h.includes('profile')
  );
  const wishIdx = headers.findIndex(
    (h) => h.includes('wishing') || h.includes('massage') || h.includes('message')
  );
  const sentYearIdx = headers.findIndex(
    (h) => h.includes('last') || h.includes('sent') || h.includes('year')
  );

  const members: TeamMember[] = [];

  for (let i = headerRowIdx + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    // Name discovery
    let name = nameIdx !== -1 && row[nameIdx] !== undefined ? row[nameIdx].trim() : '';
    if (!name && nameIdx === -1 && row[2]) name = row[2].trim();
    if (!name && nameIdx === -1 && row[3]) name = row[3].trim();

    // Skip empty names or repeated header lines
    if (
      !name ||
      name.toLowerCase() === 'name' ||
      name.toLowerCase().includes('central team') ||
      name.toLowerCase() === 'colleague name'
    ) {
      continue;
    }

    const sl =
      slIdx !== -1 && row[slIdx] !== undefined ? row[slIdx].trim() : `${members.length + 1}`;
    const id =
      idIdx !== -1 && row[idIdx] !== undefined ? row[idIdx].trim() : '';
    const designation =
      desigIdx !== -1 && row[desigIdx] !== undefined
        ? row[desigIdx].trim()
        : 'Team Member';
    const department =
      deptIdx !== -1 && row[deptIdx] !== undefined
        ? row[deptIdx].trim()
        : '';
    const birthday =
      bdayIdx !== -1 && row[bdayIdx] !== undefined
        ? row[bdayIdx].trim()
        : '';
    const mobile =
      mobileIdx !== -1 && row[mobileIdx] !== undefined
        ? row[mobileIdx].trim()
        : '';
    const email =
      emailIdx !== -1 && row[emailIdx] !== undefined
        ? row[emailIdx].trim()
        : '';
    const whatsapp =
      waIdx !== -1 && row[waIdx] !== undefined && row[waIdx].trim().length > 0
        ? row[waIdx].trim()
        : mobile;
    let rawImage =
      imageIdx !== -1 && row[imageIdx] !== undefined && row[imageIdx].trim().length > 0
        ? row[imageIdx].trim()
        : '';

    // If imageIdx was not matched or cell was empty, check if any column contains a Drive or image URL
    if (!rawImage) {
      for (let c = 0; c < row.length; c++) {
        if (c === emailIdx || c === nameIdx || c === desigIdx || c === bdayIdx || c === mobileIdx || c === waIdx || c === wishIdx || c === sentYearIdx) {
          continue;
        }
        const val = row[c]?.trim() || '';
        if (val.includes('drive.google.com') || val.includes('docs.google.com') || val.includes('lh3.googleusercontent.com') || (val.startsWith('http') && (val.endsWith('.jpg') || val.endsWith('.jpeg') || val.endsWith('.png') || val.endsWith('.webp')))) {
          rawImage = val;
          break;
        }
      }
    }

    const imageUrl = rawImage ? formatProfileImageUrl(rawImage) : undefined;
    let wishingMessage =
      wishIdx !== -1 && row[wishIdx] !== undefined
        ? row[wishIdx].trim()
        : '';

    const lastSentYear =
      sentYearIdx !== -1 && row[sentYearIdx] !== undefined
        ? row[sentYearIdx].trim()
        : '';

    if (!wishingMessage) {
      wishingMessage = `Happy Birthday, ${name}! Wishing you a great day from the IE Central Team. 🎉`;
    }

    members.push({
      sl,
      id,
      name,
      designation: designation || 'Team Member',
      department: department || undefined,
      birthday,
      mobile,
      email,
      whatsapp: whatsapp || mobile,
      imageUrl,
      wishingMessage,
      isBirthdayToday: checkIsTodayBirthday(birthday),
      lastSentYear
    });
  }

  return members;
}

/**
 * Fetch live data from Google Sheet or Apps Script Web App.
 * Works seamlessly on Vercel (client-side CORS direct fetch) AND local/Cloud Run server proxy.
 */
export async function fetchLiveTeamData(targetSheetUrl?: string): Promise<{
  success: boolean;
  source: string;
  data: TeamMember[];
  adminConfig?: AdminSheetConfig;
}> {
  const finalUrl = targetSheetUrl || DEFAULT_GOOGLE_SHEET_CSV_URL;

  // Step 1: Try server-side API proxy first
  try {
    const res = await fetch(`/api/sheet-data?sheetUrl=${encodeURIComponent(finalUrl)}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        return {
          success: true,
          source: json.source || 'server_proxy',
          data: json.data,
          adminConfig: json.adminConfig
        };
      }
    }
  } catch (_proxyErr) {
    // Expected on static hosting platforms like Vercel without Node backend
  }

  // Step 2: Direct client-side fetch from Google Sheet CSV or Apps Script
  try {
    const directRes = await fetch(finalUrl, {
      headers: {
        Accept: 'text/csv, application/json, text/plain, */*'
      }
    });

    if (directRes.ok) {
      const rawText = await directRes.text();

      // Check if it's JSON from Google Apps Script Web App
      if (rawText.trim().startsWith('{') || rawText.trim().startsWith('[')) {
        try {
          const jsonData = JSON.parse(rawText);
          const list = Array.isArray(jsonData) ? jsonData : jsonData.data || jsonData.members || [];
          if (Array.isArray(list) && list.length > 0) {
            const parsed = list.map((item: any, idx: number) => {
              const name = item.name || item.Name || item.ColumnD || item.colD || '';
              const designation = item.designation || item.Designation || item.ColumnE || '';
              const department = item.department || item.Department || item.ColumnF || item.dept || item.Dept || '';
              const birthday = item.birthday || item.Birthday || item.ColumnG || item.dob || '';
              const whatsapp = item.whatsapp || item.WhatsApp || item.ColumnJ || item.mobile || item.Mobile || '';
              const wishingMessage = item.wishingMessage || item.message || item.ColumnK || `Happy Birthday, ${name}! Wishing you a great day from the IE Central Team. 🎉`;
              const sl = item.sl || item.SL || `${idx + 1}`;
              const id = item.id || item.ID || '';
              const email = item.email || item.Email || item.ColumnI || '';
              const imageUrl = item.imageUrl || item.ImageUrl || item.image || item.Image || item.imageURL || item.ImageURL || item.photo || item.Photo || item.avatar || item.Avatar || item['Image URL'] || item['Image_URL'] || '';
              const formattedImage = formatProfileImageUrl(imageUrl);
              const lastSentYear = item.lastSentYear || item.sentYear || '';

              return {
                sl: String(sl),
                id: String(id),
                name: String(name),
                designation: String(designation || 'Team Member'),
                department: department ? String(department) : undefined,
                birthday: String(birthday),
                mobile: String(whatsapp),
                email: String(email),
                whatsapp: String(whatsapp),
                imageUrl: formattedImage || undefined,
                wishingMessage: String(wishingMessage),
                isBirthdayToday: checkIsTodayBirthday(String(birthday)),
                lastSentYear: String(lastSentYear || '')
              };
            }).filter((m: any) => m.name && m.name.trim().length > 0);

            if (parsed.length > 0) {
              const adminConfig = jsonData.adminConfig || extractAdminConfigFromSheet([], parsed);
              return {
                success: true,
                source: 'client_direct_apps_script',
                data: parsed,
                adminConfig
              };
            }
          }
        } catch (_jsonErr) {
          // Continue to CSV parsing
        }
      }

      // Parse CSV
      const rows = parseCSV(rawText);
      const members = parseSheetRowsToMembers(rows);
      if (members.length > 0) {
        const adminConfig = extractAdminConfigFromSheet(rows, members);
        return {
          success: true,
          source: 'client_direct_sheet_csv',
          data: members,
          adminConfig
        };
      }
    }
  } catch (directErr) {
    console.warn('Direct sheet fetch failed:', directErr);
  }

  // Step 3: Resilient fallback to real official baseline IE team data
  const fallbackMembers = REAL_IE_TEAM_ROSTER.map((m) => ({
    ...m,
    isBirthdayToday: checkIsTodayBirthday(m.birthday)
  }));
  return {
    success: true,
    source: 'baseline_roster',
    data: fallbackMembers,
    adminConfig: {
      senderWhatsApp: '+8801625299521',
      adminWhatsApp: '+8801625299521',
      adminEmail: 'anik.barua@kdsgroup.net',
      source: 'google_sheet_default',
      isAutoDetected: true,
      sheetName: 'Central IE List',
      detectedRole: 'IE Central Management (Danushka Wanniarachchi / Anik Barua)'
    }
  };
}
