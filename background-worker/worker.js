const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const path = require('path');
require('dotenv').config();

// ==========================================
// CONFIGURATION & INITIALIZATION
// ==========================================

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SERVICE_ACCOUNT_PATH = process.env.SERVICE_ACCOUNT_JSON_PATH || './service-account.json';

// Initialize WhatsApp Client with Local Session Saving
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: path.join(__dirname, '.wwebjs_auth')
  }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true
  }
});

client.on('qr', (qr) => {
  console.log('SCAN THIS QR CODE WITH YOUR WHATSAPP TO LOG IN:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp Engine is READY & CONNECTED.');
});

client.on('authenticated', () => {
  console.log('WhatsApp Authenticated Successfully.');
});

// ==========================================
// CORE FUNCTIONS
// ==========================================

/**
 * Fetches dynamic credentials directly from the Google Sheet Config table
 */
async function fetchDynamicConfig() {
  try {
    const serviceAccount = require(path.resolve(SERVICE_ACCOUNT_PATH));
    const auth = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth);
    await doc.loadInfo();

    // Look for a sheet named "Config" or use the first sheet if not found
    const configSheet = doc.sheetsByTitle['Config'] || doc.sheetsByIndex[0];
    const rows = await configSheet.getRows();
    
    const config = {};
    rows.forEach(row => {
      // Assuming Column A is 'Key' and Column B is 'Value'
      const key = row.get('Key') || row._rawData[0];
      const value = row.get('Value') || row._rawData[1];
      if (key) config[key.trim()] = value ? value.toString().trim() : '';
    });

    return {
      adminWhatsApp: config['adminWhatsApp'] || '+8801625299521',
      adminEmail: config['adminEmail'] || 'anik.barua@kdsgroup.net',
      gmailUser: process.env.GMAIL_USER,
      gmailPass: process.env.GMAIL_PASS
    };
  } catch (err) {
    console.error('Error fetching dynamic config:', err.message);
    return null;
  }
}

/**
 * Main automation engine: Scans roster and dispatches wishes
 */
async function runBirthdayAutomation() {
  console.log(`[${new Date().toLocaleString()}] Starting daily automation run...`);
  
  const config = await fetchDynamicConfig();
  if (!config) return;

  try {
    const serviceAccount = require(path.resolve(SERVICE_ACCOUNT_PATH));
    const auth = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth);
    await doc.loadInfo();

    const rosterSheet = doc.sheetsByTitle['Roster'];
    if (!rosterSheet) throw new Error('Roster sheet not found!');
    
    const rows = await rosterSheet.getRows();
    const today = new Date();
    const todayStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}`;

    console.log(`Scanning ${rows.length} team members for birthdays matching ${todayStr}...`);

    let wishesSent = 0;
    const celebrants = [];

    for (const row of rows) {
      const bday = row.get('Birthday') || row._rawData[2]; // Adjust index if needed
      const name = row.get('Name') || row._rawData[1];
      const whatsapp = row.get('WhatsApp') || row._rawData[6];
      
      if (bday && bday.includes(todayStr)) {
        celebrants.push(name);
        
        // 1. Send WhatsApp Wish
        if (whatsapp && client.info) {
          const cleanWA = whatsapp.replace(/[^0-9]/g, '');
          const chatId = `${cleanWA}@c.us`;
          const message = `Happy Birthday ${name}! 🎂 Wishing you a fantastic day ahead! - IE Central Team`;
          
          try {
            await client.sendMessage(chatId, message);
            console.log(`WhatsApp wish sent to ${name} (${whatsapp})`);
          } catch (waErr) {
            console.error(`Failed to send WA to ${name}:`, waErr.message);
          }
        }

        // 2. Mark as sent in sheet (optional - assuming a 'Status' or 'LastSent' column exists)
        try {
          // row.set('Status', 'Delivered');
          // await row.save();
        } catch (saveErr) {}
        
        wishesSent++;
      }
    }

    // 3. Send Admin Notification Email if there were celebrants
    if (celebrants.length > 0 && config.gmailUser && config.gmailPass) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: config.gmailUser, pass: config.gmailPass }
      });

      const mailOptions = {
        from: `"IE Birthday Bot" <${config.gmailUser}>`,
        to: config.adminEmail,
        subject: `[SYSTEM] ${celebrants.length} Birthdays Processed Today`,
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: #10b981;">Daily Birthday Report</h2>
            <p>Today's celebrants have been processed successfully:</p>
            <ul>
              ${celebrants.map(c => `<li><strong>${c}</strong></li>`).join('')}
            </ul>
            <p style="font-size: 12px; color: #666;">Total Wishes Dispatched: ${wishesSent}</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`Admin notification email sent to ${config.adminEmail}`);
    }

    console.log(`Automation run complete. ${wishesSent} wishes processed.`);

  } catch (err) {
    console.error('Automation failed:', err.message);
  }
}

// ==========================================
// SCHEDULING (8:00 AM DAILY)
// ==========================================

// Run once on startup to verify connection
client.initialize();

client.on('ready', () => {
  // Cron: Minute(0) Hour(8) Day(*) Month(*) DayOfWeek(*)
  cron.schedule('0 8 * * *', () => {
    runBirthdayAutomation();
  });
  
  console.log('Automation Schedule Active: 8:00 AM Daily.');
});

// For manual testing: uncomment below to run immediately on start
// client.on('ready', () => { runBirthdayAutomation(); });
