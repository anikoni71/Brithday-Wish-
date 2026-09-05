export type DispatchLifecycleStatus = 'Pending' | 'Dispatched' | 'Delivered' | 'Failed';
export type DeliveryChannelType = 'WhatsApp' | 'Email Fallback' | 'Dual Channel';

export interface TeamMember {
  sl: string;
  id: string;
  name: string;
  designation: string;
  department?: string; // Column F (Department)
  birthday: string; // e.g. "8/13", "2/21", "6th May", "21st Feb", "4th Aug"
  mobile: string;
  email: string;
  whatsapp: string; // e.g. "8801829870593"
  imageUrl?: string; // Image URL from Google Sheet Column
  wishingMessage: string;
  isBirthdayToday: boolean;
  lastSentYear?: string | number; // Year wish was sent (e.g. 2026)
  serverDispatched?: boolean; // Indicates message was sent via headless backend dispatch
  dispatchStatus?: DispatchLifecycleStatus; // 'Pending' | 'Dispatched' | 'Delivered' | 'Failed'
  deliveryChannel?: 'whatsapp' | 'email_fallback' | 'dual_channel';
  lastDispatchError?: string;
  status?: string;
  nameMeaning?: string; // Meaning and spiritual significance of the member's name
  nameMeaningEmoji?: string; // Uplifting emoji (e.g. "🏹", "✨", "♾️", "🤲")
  nameMeaningNote?: string; // Short meaningful note (e.g. "Armed with a bow / Prosperous leader")
  nameEtymology?: string; // Short etymological meaning (e.g. "Armed with a bow / Prosperous")
  inspiringNote?: string; // Short inspiring note matching the deeper significance of their name
  specialDayMatch?: string; // Matching global & festive special day details for their birthday
}

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  whatsappNumber: string;
}

export interface EmailLogEntry {
  id: string;
  timestamp: string;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  mode: 'AUTOMATED_CRON' | 'DIRECT_DISPATCH' | 'MANUAL' | 'FALLBACK_AUTO' | 'ADMIN_ADVANCE_ALERT';
  messageSnippet: string;
  details?: string;
  executionTimeMs?: number;
  errorCode?: string;
}

export interface EmailTemplateOption {
  id: string;
  name: string;
  tagline: string;
  subject: string;
  theme: 'festive' | 'corporate' | 'executive' | 'elegant';
}

export interface AdminSheetConfig {
  senderWhatsApp: string; // WhatsApp Wishing Message Sender Number (e.g. "+8801625299521")
  adminWhatsApp: string;  // Admin WhatsApp Number (e.g. "+8801625299521")
  adminEmail: string;     // Admin Notification Email (e.g. "anik.barua@kdsgroup.net")
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  source: 'google_sheet_meta' | 'google_sheet_webhook' | 'google_sheet_roster' | 'google_sheet_default' | 'user_override';
  isAutoDetected: boolean;
  sheetName?: string;
  detectedRole?: string;
  lastSynced?: string;
  syncId?: string;
}

export interface WishGenerationRequest {
  name: string;
  designation: string;
  tone: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'error';
  recipient: string;
  message: string;
  details?: string;
  source?: 'manual' | 'automation';
  waLink?: string;
  channel?: string;
}

export interface BirthdayAlert {
  memberId: string;
  memberName: string;
  birthday: string;
  enabled: boolean;
  lastNotifiedYear?: number;
}

export interface AutomationLogEntry {
  id: string;
  timestamp: string;
  triggerSource:
    | 'Google Apps Script (Time-Driven 8:00 AM)'
    | 'Google Apps Script (5:00 PM Advance Alert)'
    | 'Server Headless Dispatch'
    | 'Sheet Auto-Sync Trigger'
    | 'Email Fallback Router';
  recipientName: string;
  recipientPhone: string;
  recipientEmail?: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED_DUPLICATE' | 'DELIVERED' | 'DISPATCHED' | 'PENDING';
  lifecycleState?: DispatchLifecycleStatus;
  channel?: DeliveryChannelType;
  senderNumber: string; // "+8801625299521"
  message: string;
  executionTimeMs?: number;
  responseCode?: number | string;
  errorCode?: string;
  errorReason?: string;
  details?: string;
}

