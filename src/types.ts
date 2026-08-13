export interface TeamMember {
  sl: string;
  id: string;
  name: string;
  designation: string;
  birthday: string; // e.g. "8/13" or "2/21"
  mobile: string;
  email: string;
  whatsapp: string; // e.g. "8801829870593"
  wishingMessage: string;
  isBirthdayToday: boolean;
  lastSentYear?: string | number; // Year wish was sent (e.g. 2026)
  serverDispatched?: boolean; // Indicates message was sent via headless backend dispatch
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
  mode: 'AUTOMATED_CRON' | 'DIRECT_DISPATCH' | 'MANUAL';
  messageSnippet: string;
  details?: string;
  executionTimeMs?: number;
}

export interface EmailTemplateOption {
  id: string;
  name: string;
  tagline: string;
  subject: string;
  theme: 'festive' | 'corporate' | 'executive' | 'elegant';
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
}

export interface AutomationLogEntry {
  id: string;
  timestamp: string;
  triggerSource: 'Google Apps Script (Time-Driven 8:00 AM)' | 'Server Headless Dispatch' | 'Sheet Auto-Sync Trigger';
  recipientName: string;
  recipientPhone: string;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED_DUPLICATE';
  senderNumber: string; // "+8801625299521"
  message: string;
  executionTimeMs?: number;
  responseCode?: number | string;
  details?: string;
}
