import { TeamMember } from '../types';
import { checkIsTodayBirthday } from '../utils/dateUtils';
import { REAL_IE_TEAM_ROSTER } from '../data/fallbackData';

export const DEFAULT_GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTODUAg2mUYQUTN3P9SPB5Q41Ta_9SufI2gct0GBYDUbPSJX81O1mWHgBjElAIfNfobEbd7Mkii18lt/pub?gid=0&single=true&output=csv";

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
  const bdayIdx = headers.findIndex(
    (h) => h.includes('birthday') || h.includes('birth') || h.includes('dob')
  );
  const mobileIdx = headers.findIndex(
    (h) => h.includes('mobile') || h.includes('phone') || h.includes('contact')
  );
  const emailIdx = headers.findIndex((h) => h.includes('mail'));
  const waIdx = headers.findIndex((h) => h.includes('whatapp') || h.includes('whatsapp'));
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
      birthday,
      mobile,
      email,
      whatsapp: whatsapp || mobile,
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
          data: json.data
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
              const birthday = item.birthday || item.Birthday || item.ColumnG || item.dob || '';
              const whatsapp = item.whatsapp || item.WhatsApp || item.ColumnJ || item.mobile || item.Mobile || '';
              const wishingMessage = item.wishingMessage || item.message || item.ColumnK || `Happy Birthday, ${name}! Wishing you a great day from the IE Central Team. 🎉`;
              const sl = item.sl || item.SL || `${idx + 1}`;
              const id = item.id || item.ID || '';
              const email = item.email || item.Email || item.ColumnI || '';
              const lastSentYear = item.lastSentYear || item.sentYear || '';

              return {
                sl: String(sl),
                id: String(id),
                name: String(name),
                designation: String(designation || 'Team Member'),
                birthday: String(birthday),
                mobile: String(whatsapp),
                email: String(email),
                whatsapp: String(whatsapp),
                wishingMessage: String(wishingMessage),
                isBirthdayToday: checkIsTodayBirthday(String(birthday)),
                lastSentYear: String(lastSentYear || '')
              };
            }).filter((m: any) => m.name && m.name.trim().length > 0);

            if (parsed.length > 0) {
              return {
                success: true,
                source: 'client_direct_apps_script',
                data: parsed
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
        return {
          success: true,
          source: 'client_direct_sheet_csv',
          data: members
        };
      }
    }
  } catch (directErr) {
    console.warn('Direct sheet fetch failed:', directErr);
  }

  // Step 3: Resilient fallback to real official baseline IE team data
  return {
    success: true,
    source: 'baseline_roster',
    data: REAL_IE_TEAM_ROSTER.map((m) => ({
      ...m,
      isBirthdayToday: checkIsTodayBirthday(m.birthday)
    }))
  };
}
