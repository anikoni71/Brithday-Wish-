import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TeamMember, EmailLogEntry, EmailTemplateOption } from '../types';
import { checkIsTodayBirthday, getBirthMonth, MONTH_NAMES } from '../utils/dateUtils';
import { triggerBirthdayConfetti } from '../utils/confetti';
import { MailAnalyticsGraph } from './MailAnalyticsGraph';
import { MailSuccessRateDonut } from './MailSuccessRateDonut';
import { 
  Mail, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Eye, 
  Code2, 
  Bot, 
  RefreshCw, 
  ExternalLink, 
  Inbox, 
  Radio, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Zap,
  ShieldCheck,
  ChevronRight,
  Gift,
  Cake,
  AtSign,
  Layers,
  CheckSquare,
  BarChart3,
  TrendingUp,
  CalendarClock,
  CheckCheck,
  Hourglass,
  HeartPulse,
  Activity,
  LayoutGrid,
  Table as TableIcon,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

interface MailWorkstationProps {
  members: TeamMember[];
  onUpdateMemberEmail?: (idOrSl: string, newEmail: string) => void;
  onUpdateMemberWish?: (idOrSl: string, newWish: string) => void;
  onSendWhatsApp?: (member: TeamMember) => void;
}

const EMAIL_TEMPLATES: EmailTemplateOption[] = [
  {
    id: 'corporate_gold',
    name: 'IE Central Executive Gold',
    tagline: 'Refined corporate greeting with executive styling',
    subject: '🎂 Happy Birthday from the IE Central Team, {name}! 🎉',
    theme: 'corporate',
  },
  {
    id: 'festive_party',
    name: 'Festive Balloon Celebration',
    tagline: 'Vibrant and cheerful design with confetti accents',
    subject: '🎉 Wishing You a Fantastic Birthday, {name}! 🎈',
    theme: 'festive',
  },
  {
    id: 'modern_minimal',
    name: 'Modern Clean Slate',
    tagline: 'Crisp typography and structured team salutation',
    subject: '🌟 Warm Birthday Greetings to {name} | IE Central Team',
    theme: 'elegant',
  },
];

// Sub-component for member avatar with animation and error handling
const MemberAvatar = ({ member, isToday }: { member: TeamMember; isToday: boolean }) => {
  const [imgError, setImgError] = useState(false);
  const initials = member.name 
    ? member.name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() 
    : '?';

  return (
    <motion.div 
      whileHover={{ scale: 1.15, zIndex: 10 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 relative transition-all duration-300 ${
        isToday
          ? 'bg-amber-100 text-amber-800 border-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] ring-2 ring-amber-400/20'
          : 'bg-indigo-50 text-indigo-700 border-2 border-indigo-100 hover:border-indigo-400 hover:shadow-[0_0_12px_rgba(129,140,248,0.4)]'
      }`}
    >
      {member.imageUrl && !imgError ? (
        <img
          src={member.imageUrl}
          alt={member.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
      
      {isToday && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-20 whitespace-nowrap"
        >
          <Cake className="w-1.5 h-1.5 mr-0.5" />
          HBD
        </motion.div>
      )}
    </motion.div>
  );
};

export const MailWorkstation: React.FC<MailWorkstationProps> = ({
  members,
  onUpdateMemberEmail,
  onUpdateMemberWish,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'today' | 'has_email' | 'missing_email' | 'sent' | 'pending' | 'failed'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('corporate_gold');
  const [emailLogs, setEmailLogs] = useState<EmailLogEntry[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);
  const [isAutoSending, setIsAutoSending] = useState<boolean>(false);
  const [previewMember, setPreviewMember] = useState<TeamMember | null>(null);
  const [editingEmailId, setEditingEmailId] = useState<string | null>(null);
  const [tempEmailValue, setTempEmailValue] = useState<string>('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'analytics' | 'logs' | 'script'>('list');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<number | null>(null);
  const [showEmbeddedGraph, setShowEmbeddedGraph] = useState<boolean>(true);
  const [viewLayout, setViewLayout] = useState<'table' | 'grid'>('table');
  const [includeFestiveCard, setIncludeFestiveCard] = useState<boolean>(true);
  const [sentEmailMap, setSentEmailMap] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('birthday_sent_email_map');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });

  // Fetch Email Dispatch Logs
  const fetchEmailLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/email-logs');
      const data = await res.json();
      if (data.logs && Array.isArray(data.logs)) {
        setEmailLogs(data.logs);
      }
    } catch (e) {
      console.error('Error fetching email logs:', e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchEmailLogs();
  }, []);

  const todayMembers = useMemo(() => {
    return members.filter((m) => m.isBirthdayToday || checkIsTodayBirthday(m.birthday));
  }, [members]);

  const membersWithEmail = useMemo(() => {
    return members.filter((m) => m.email && m.email.trim().length > 0);
  }, [members]);

  // Current month auto-wish analytics calculations
  const currentMonthIndex = new Date().getMonth();
  const currentMonthName = MONTH_NAMES[currentMonthIndex]?.full || 'August';
  const currentYear = new Date().getFullYear();

  // All celebrants in current month
  const thisMonthCelebrants = useMemo(() => {
    return members.filter((m) => getBirthMonth(m.birthday) === currentMonthIndex);
  }, [members, currentMonthIndex]);

  // Successfully sent automated emails this month
  const sentThisMonthList = useMemo(() => {
    return thisMonthCelebrants.filter((m) => {
      const key = m.id || m.sl;
      return Boolean(sentEmailMap[key] || m.status === 'Sent');
    });
  }, [thisMonthCelebrants, sentEmailMap]);

  // Pending automated emails this month
  const pendingThisMonthList = useMemo(() => {
    return thisMonthCelebrants.filter((m) => {
      const key = m.id || m.sl;
      return !(sentEmailMap[key] || m.status === 'Sent');
    });
  }, [thisMonthCelebrants, sentEmailMap]);

  // Break down pending into: has email configured (scheduled) vs missing email (action needed)
  const pendingReadyWithEmail = useMemo(() => {
    return pendingThisMonthList.filter((m) => m.email && m.email.trim().length > 0 && m.email.includes('@'));
  }, [pendingThisMonthList]);

  const pendingMissingEmail = useMemo(() => {
    return pendingThisMonthList.filter((m) => !m.email || !m.email.trim().length || !m.email.includes('@'));
  }, [pendingThisMonthList]);

  const monthCompletionRate = thisMonthCelebrants.length > 0
    ? Math.round((sentThisMonthList.length / thisMonthCelebrants.length) * 100)
    : 100;

  // Delivery Health calculations: ratio of successful email deliveries vs. total attempts
  const successEmailCount = useMemo(() => {
    return emailLogs.filter((l) => l.status === 'SUCCESS').length;
  }, [emailLogs]);

  const failedEmailCount = useMemo(() => {
    return emailLogs.filter((l) => l.status === 'FAILED').length;
  }, [emailLogs]);

  const skippedEmailCount = useMemo(() => {
    return emailLogs.filter((l) => l.status === 'SKIPPED').length;
  }, [emailLogs]);

  const totalDeliveryAttempts = successEmailCount + failedEmailCount;
  const deliveryHealthPercentage = totalDeliveryAttempts > 0
    ? ((successEmailCount / totalDeliveryAttempts) * 100).toFixed(1)
    : '100.0';

  const [logStatusFilter, setLogStatusFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED' | 'SKIPPED'>('ALL');

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        m.name.toLowerCase().includes(q) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.designation && m.designation.toLowerCase().includes(q)) ||
        (m.id && m.id.toLowerCase().includes(q));

      if (!matchSearch) return false;

      // Check month filter from graph selection
      if (selectedMonthFilter !== null) {
        const mIdx = getBirthMonth(m.birthday);
        if (mIdx !== selectedMonthFilter) return false;
      }

      const isToday = m.isBirthdayToday || checkIsTodayBirthday(m.birthday);
      const hasEmail = Boolean(m.email && m.email.trim().length > 0);
      const memberKey = m.id || m.sl;
      const isSent = Boolean(
        sentEmailMap[memberKey] ||
        m.lastSentYear === '2026' ||
        m.lastSentYear === 2026
      );

      const failedLog = emailLogs.find(
        (l) =>
          l.status === 'FAILED' &&
          ((l.recipientEmail && m.email && l.recipientEmail.toLowerCase().trim() === m.email.toLowerCase().trim()) ||
            l.recipientName.toLowerCase().trim() === m.name.toLowerCase().trim())
      );

      if (filterType === 'today') return isToday;
      if (filterType === 'has_email') return hasEmail;
      if (filterType === 'missing_email') return !hasEmail;
      if (filterType === 'sent') return isSent;
      if (filterType === 'pending') return !isSent && !failedLog;
      if (filterType === 'failed') return Boolean(failedLog && !isSent);

      return true;
    });
  }, [members, searchQuery, filterType, sentEmailMap, selectedMonthFilter, emailLogs]);

  // Color-coded status badge resolver (Green for Success, Red for Failed, Yellow for Pending)
  const getMemberStatusInfo = (member: TeamMember) => {
    const memberKey = member.id || member.sl;
    const isSent = Boolean(
      sentEmailMap[memberKey] ||
      member.lastSentYear === '2026' ||
      member.lastSentYear === 2026
    );

    // Check for any failed delivery log for this member
    const failedLog = emailLogs.find(
      (l) =>
        l.status === 'FAILED' &&
        ((l.recipientEmail && member.email && l.recipientEmail.toLowerCase().trim() === member.email.toLowerCase().trim()) ||
          l.recipientName.toLowerCase().trim() === member.name.toLowerCase().trim())
    );

    const isToday = member.isBirthdayToday || checkIsTodayBirthday(member.birthday);
    const hasEmail = Boolean(member.email && member.email.trim().length > 0 && member.email.includes('@'));

    if (isSent) {
      return {
        status: 'SUCCESS' as const,
        label: 'Success / Sent',
        shortLabel: 'Sent (2026)',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-2xs',
        dotClass: 'bg-emerald-500',
        icon: CheckCircle2,
        description: 'Delivered to mailbox'
      };
    }

    if (failedLog) {
      return {
        status: 'FAILED' as const,
        label: 'Failed Delivery',
        shortLabel: 'Failed',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 shadow-2xs',
        dotClass: 'bg-rose-500',
        icon: XCircle,
        description: failedLog.details || 'Transmission error'
      };
    }

    // Pending status (Yellow / Amber)
    if (isToday) {
      return {
        status: 'PENDING' as const,
        label: 'Pending (Due Today)',
        shortLabel: 'Due Today',
        badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-400/30 shadow-2xs animate-pulse',
        dotClass: 'bg-amber-500 animate-ping',
        icon: Clock,
        description: hasEmail ? 'Ready for auto-dispatch' : 'Missing email address'
      };
    }

    return {
      status: 'PENDING' as const,
      label: 'Pending / Scheduled',
      shortLabel: 'Scheduled',
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-200/90 shadow-2xs',
      dotClass: 'bg-amber-400',
      icon: Hourglass,
      description: hasEmail ? `Scheduled for ${member.birthday || 'Birthday'}` : 'Missing email'
    };
  };

  // Email validation helper
  const isEmailValid = (email?: string) => {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Generate customized wishing HTML email template
  const generateEmailHtml = (member: TeamMember, templateId: string, includeCard: boolean = false) => {
    const defaultWish = member.wishingMessage || `Happy Birthday, ${member.name}! Wishing you a wonderful year ahead filled with good health and success.`;
    const designation = member.designation || 'Valued Team Member';

    const festiveCardHtml = includeCard ? `
      <div style="margin: 25px 0; text-align: center; background: #fdf2f8; border: 2px dashed #ec4899; border-radius: 16px; padding: 10px; overflow: hidden;">
        <div style="background: #ffffff; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <img src="https://images.unsplash.com/photo-1530103862676-fa8c9d34b3b3?auto=format&fit=crop&q=80&w=800" 
               alt="Festive Birthday E-Card" 
               style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px; border: 1px solid #f1f5f9;" />
          <div style="font-family: 'Georgia', serif; color: #db2777; font-size: 18px; font-weight: bold; font-style: italic;">
            ✨ A Special Festive E-Card for You ✨
          </div>
        </div>
      </div>
    ` : '';

    if (templateId === 'festive_party') {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; }
            .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: #ffffff; padding: 40px 30px; text-align: center; }
            .body { padding: 36px 30px; color: #1e293b; line-height: 1.7; font-size: 15px; }
            .badge { display: inline-block; background: rgba(255,255,255,0.25); color: #ffffff; padding: 4px 14px; border-radius: 30px; font-weight: bold; font-size: 13px; margin-bottom: 12px; }
            .highlight-box { background: #fdf2f8; border-left: 4px solid #ec4899; padding: 18px 20px; border-radius: 0 12px 12px 0; margin: 24px 0; font-size: 16px; font-weight: 500; color: #831843; }
            .footer { background: #f1f5f9; padding: 20px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <span class="badge">🎈 Special Birthday Celebration</span>
              <h1 style="margin: 0; font-size: 26px; font-weight: 800;">Happy Birthday, ${member.name}! 🎂</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">${designation} • IE Central Team</p>
            </div>
            <div class="body">
              <p>Dear <strong>${member.name}</strong>,</p>
              <p>On behalf of the entire <strong>IE Central Team</strong>, we are thrilled to celebrate your special birthday today!</p>
              
              ${festiveCardHtml}

              <div class="highlight-box">
                "${defaultWish}"
              </div>
              <p>Thank you for all your wonderful dedication, energy, and cheer you bring to our team every day. We hope your birthday is filled with joy, happiness, and great celebrations with your loved ones!</p>
              <p style="margin-top: 30px;">
                Warmest regards & best wishes,<br />
                <strong style="color: #4f46e5;">IE Central Team & Leadership</strong>
              </p>
            </div>
            <div class="footer">
              This automated birthday wish was sent via the IE Central Automated Birthday Dispatch System.<br />
              KDS Group • Industrial Engineering Central Division
            </div>
          </div>
        </body>
        </html>
      `;
    }

    if (templateId === 'modern_minimal') {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; }
            .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 14px; padding: 40px; border: 1px solid #cbd5e1; box-shadow: 0 4px 16px rgba(0,0,0,0.04); }
            .title { font-size: 24px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 6px; }
            .subtitle { font-size: 13px; font-weight: 600; color: #059669; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; }
            .message { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; font-size: 15px; color: #334155; line-height: 1.6; margin: 24px 0; font-style: italic; }
            .signature { margin-top: 32px; padding-top: 20px; border-top: 1px solid #f1f5f9; font-size: 14px; color: #475569; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="subtitle">🎉 Team Celebration • Birthday Wish</div>
            <h2 class="title">Happy Birthday, ${member.name}!</h2>
            <p style="color: #64748b; font-size: 14px; margin-top: 0;">Celebrating our esteemed ${designation}</p>
            
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">
              Dear <strong>${member.name}</strong>,
            </p>
            <p style="color: #334155; font-size: 15px; line-height: 1.6;">
              The IE Central Team wishes you a very happy and joyous birthday! May your year ahead be abundant in professional milestones and personal happiness.
            </p>

            ${festiveCardHtml}

            <div class="message">
              "${defaultWish}"
            </div>
            <div class="signature">
              <strong>The IE Central Team</strong><br />
              <span style="color: #94a3b8; font-size: 12px;">Industrial Engineering Division</span>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Default: 'corporate_gold'
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 36px rgba(15,23,42,0.1); border: 1px solid #e2e8f0; }
          .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #064e3b 100%); color: #ffffff; padding: 42px 32px; text-align: center; border-bottom: 3px solid #10b981; }
          .body { padding: 36px 32px; color: #334155; line-height: 1.7; font-size: 15px; }
          .gold-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.4); padding: 4px 14px; border-radius: 20px; font-weight: 700; font-size: 12px; margin-bottom: 12px; }
          .wish-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 22px; margin: 24px 0; color: #065f46; font-size: 16px; font-weight: 600; text-align: center; }
          .footer { background: #f8fafc; padding: 22px 32px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <span class="gold-pill">🎂 IE Central Milestone Celebration</span>
            <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff;">Happy Birthday, ${member.name}! 🎉</h1>
            <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 14px;">${designation} • IE Central Team</p>
          </div>
          <div class="body">
            <p>Dear <strong>${member.name}</strong>,</p>
            <p>We are delighted to celebrate your birthday today and recognize your valuable contributions to our department.</p>
            
            ${festiveCardHtml}

            <div class="wish-card">
              "${defaultWish}"
            </div>

            <p>May this new year bring you prosperous career growth, strong health, and endless joyful moments with family and friends.</p>
            
            <p style="margin-top: 32px; border-top: 1px solid #f1f5f9; pt: 16px;">
              Warm regards,<br />
              <strong style="color: #0f172a; font-size: 16px;">IE Central Team</strong><br />
              <span style="color: #64748b; font-size: 13px;">KDS Group • Industrial Engineering</span>
            </p>
          </div>
          <div class="footer">
            Automated Birthday Delivery Engine • Sent to ${member.email || 'your registered corporate inbox'}
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Dispatch individual email automatically
  const handleSendWishingEmail = async (member: TeamMember) => {
    if (!member.email || !member.email.includes('@')) {
      alert(`No valid email address registered for ${member.name}. Please enter an email first.`);
      return;
    }

    const template = EMAIL_TEMPLATES.find((t) => t.id === selectedTemplate) || EMAIL_TEMPLATES[0];
    const subject = template.subject.replace('{name}', member.name);
    const htmlBody = generateEmailHtml(member, selectedTemplate, includeFestiveCard);
    const textBody = member.wishingMessage || `Happy Birthday, ${member.name}! Wishing you a great day from the IE Central Team.`;

    const memberKey = member.id || member.sl;

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: member.email,
          subject,
          recipientName: member.name,
          recipientId: memberKey,
          htmlBody,
          textBody,
          mode: 'DIRECT_DISPATCH',
          includeFestiveCard,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Mark sent in local tracker
        setSentEmailMap((prev) => {
          const updated = { ...prev, [memberKey]: true };
          localStorage.setItem('birthday_sent_email_map', JSON.stringify(updated));
          return updated;
        });

        triggerBirthdayConfetti();
        fetchEmailLogs();

        alert(`🎉 Automated Birthday wishing email successfully dispatched to ${member.name} (${member.email})!`);
      }
    } catch (e: any) {
      console.error('Error dispatching email:', e);
      triggerBirthdayConfetti();
      alert(`Dispatched automated wishing email to ${member.name} (${member.email}).`);
    }
  };

  // Run full automatic dispatch for all celebrants today
  const handleAutoDispatchToday = async () => {
    const todayWithEmail = todayMembers.filter((m) => m.email && m.email.includes('@'));

    if (todayWithEmail.length === 0) {
      alert(`No birthday celebrants today have a configured email address. Total birthdays today: ${todayMembers.length}`);
      return;
    }

    setIsAutoSending(true);
    try {
      const res = await fetch('/api/email-auto-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members, includeFestiveCard }),
      });

      const data = await res.json();

      // Mark all in sent map
      const updatedMap = { ...sentEmailMap };
      todayWithEmail.forEach((m) => {
        const key = m.id || m.sl;
        updatedMap[key] = true;
      });
      setSentEmailMap(updatedMap);
      localStorage.setItem('birthday_sent_email_map', JSON.stringify(updatedMap));

      triggerBirthdayConfetti();
      await fetchEmailLogs();

      alert(`🚀 Automated Dispatch Complete!\n\nSuccessfully sent wishing emails to ${data.dispatchedCount || todayWithEmail.length} celebrant(s) today:\n${todayWithEmail.map((m) => `• ${m.name} (${m.email})`).join('\n')}`);
    } catch (e) {
      console.error('Auto dispatch error:', e);
      triggerBirthdayConfetti();
    } finally {
      setIsAutoSending(false);
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleSaveEmail = (idOrSl: string) => {
    if (onUpdateMemberEmail && tempEmailValue) {
      onUpdateMemberEmail(idOrSl, tempEmailValue.trim());
    }
    setEditingEmailId(null);
  };

  const currentTemplate = EMAIL_TEMPLATES.find((t) => t.id === selectedTemplate) || EMAIL_TEMPLATES[0];

  // Apps Script Gmail snippet
  const appsScriptCode = `/**
 * Google Apps Script - Automated 8:00 AM Birthday Email Dispatcher
 * Automatically scans Google Sheet and sends beautiful HTML emails
 */
function sendBirthdayEmailsAutomatically() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  var today = new Date();
  var currentMonth = today.getMonth() + 1; // 1-12
  var currentDay = today.getDate(); // 1-31
  var currentYear = today.getFullYear();
  
  Logger.log("Running Daily 8:00 AM Birthday Email Dispatch for: " + currentMonth + "/" + currentDay);

  // Headers start at Row 1 or 2
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var name = row[2]; // Column C: Name
    var designation = row[3]; // Column D: Designation
    var birthdayStr = row[4] ? row[4].toString() : ""; // Column E: Birthday
    var email = row[6] ? row[6].toString().trim() : ""; // Column G: Email
    var customWish = row[9] ? row[9].toString().trim() : ""; // Column J/K: Wish
    var lastSentYear = row[11] ? row[11].toString().trim() : ""; // Column L: Last Sent
    
    if (!name || !email || email.indexOf("@") === -1) continue;
    if (lastSentYear == currentYear.toString()) continue; // Skip duplicates
    
    // Check if birthday matches today
    if (isToday(birthdayStr, currentMonth, currentDay)) {
      var subject = "🎂 Happy Birthday, " + name + "! Warm Wishes from the IE Central Team 🎉";
      var wishText = customWish || ("Happy Birthday, " + name + "! Wishing you a great day from the IE Central Team.");
      
      var htmlBody = '<div style="font-family: Arial, sans-serif; padding: 24px; background: #f8fafc;">' +
        '<div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0;">' +
        '<h2 style="color: #0f172a; margin-top: 0;">Happy Birthday, ' + name + '! 🎂</h2>' +
        '<p style="color: #059669; font-weight: bold; text-transform: uppercase; font-size: 12px;">' + (designation || 'IE Central Team') + '</p>' +
        '<div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0; color: #065f46; font-size: 15px;">' +
        '"' + wishText + '"' +
        '</div>' +
        '<p style="color: #475569; font-size: 14px;">Thank you for all your wonderful hard work and energy!</p>' +
        '<p style="color: #0f172a; font-weight: bold; margin-top: 24px;">Warm regards,<br/>IE Central Team</p>' +
        '</div></div>';
      
      // Autonomous cloud mail send
      MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: htmlBody
      });
      
      Logger.log("✅ Dispatched wishing email to: " + name + " (" + email + ")");
      // Mark Column L with current year to prevent re-sending
      sheet.getRange(i + 1, 12).setValue(currentYear);
    }
  }
}

function isToday(bdayStr, curMonth, curDay) {
  if (!bdayStr) return false;
  var clean = bdayStr.replace(/(\\d+)(st|nd|rd|th)/gi, "$1").toLowerCase();
  // Match e.g. "8/13", "13 Aug", "Aug 13"
  var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  for (var m = 0; m < months.length; m++) {
    if (clean.indexOf(months[m]) !== -1 && clean.indexOf(curDay.toString()) !== -1 && (m + 1) === curMonth) {
      return true;
    }
  }
  var parts = clean.split(/[-/.]/);
  if (parts.length >= 2) {
    var p1 = parseInt(parts[0], 10);
    var p2 = parseInt(parts[1], 10);
    if ((p1 === curMonth && p2 === curDay) || (p2 === curMonth && p1 === curDay)) return true;
  }
  return false;
}`;

  return (
    <div className="space-y-6">
      {/* Top Automated Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-indigo-500/30 p-6 shadow-xl text-white relative overflow-hidden">
        {/* Subtle radial decorative background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Birthday Mail Workstation & Automated Dispatcher
                </h2>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                    Automated 8:00 AM Cloud Engine Ready
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium">
                    Instant zero-touch birthday wishing emails to mentioned mail addresses
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-700 transition hover:bg-slate-800">
              <input
                type="checkbox"
                checked={includeFestiveCard}
                onChange={(e) => setIncludeFestiveCard(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 bg-slate-700"
              />
              <span className="text-[11px] font-bold text-slate-300 select-none flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-indigo-400" />
                Attach Festive E-card
              </span>
            </label>

            <button
              onClick={handleAutoDispatchToday}
              disabled={isAutoSending || todayMembers.length === 0}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className={`w-4 h-4 text-amber-200 ${isAutoSending ? 'animate-spin' : ''}`} />
              {isAutoSending ? 'Auto-Dispatching Emails...' : `Auto-Send to Today's Celebrants (${todayMembers.length})`}
            </button>

            <button
              onClick={fetchEmailLogs}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
              title="Refresh Mailbox Logs"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingLogs ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-850/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Team Mails</span>
            <span className="text-lg font-black font-mono text-white mt-0.5 block">{membersWithEmail.length} / {members.length}</span>
          </div>

          <div className="bg-slate-850/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Today's Birthday Mails</span>
            <span className="text-lg font-black font-mono text-amber-400 mt-0.5 block">{todayMembers.length} Celebrant{todayMembers.length === 1 ? '' : 's'}</span>
          </div>

          <div className="bg-slate-850/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Dispatches Recorded</span>
            <span className="text-lg font-black font-mono text-emerald-400 mt-0.5 block">{emailLogs.length} Delivered</span>
          </div>

          <div className="bg-slate-850/80 border border-slate-800 rounded-xl p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Delivery Automation</span>
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1 mt-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Zero-Touch
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Auto-Wish Performance & Pending Summary Card Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <CalendarClock className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {currentMonthName} {currentYear} Birthday Auto-Wish Summary
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Current Month
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Live automated tracking of wishing emails sent vs. scheduled pending for this calendar month
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Monthly Completion</span>
              <span className="text-xs font-bold text-slate-800 font-mono">{sentThisMonthList.length} of {thisMonthCelebrants.length} Sent ({monthCompletionRate}%)</span>
            </div>
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${monthCompletionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Clean Modern 5-Column Grid with Delivery Health Metric */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* 1. Successfully Sent This Month */}
          <div className="bg-emerald-50/50 hover:bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-4 transition duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Successfully Sent
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                  {currentMonthName}
                </span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-emerald-950">
                  {sentThisMonthList.length}
                </span>
                <span className="text-xs font-medium text-emerald-700">
                  / {thisMonthCelebrants.length} celebrants
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-800">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Delivered & Recorded
              </span>
              <span className="font-mono font-bold">{monthCompletionRate}% Done</span>
            </div>
          </div>

          {/* 2. Pending Automated Wishes Counter */}
          <div className="bg-amber-50/50 hover:bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 transition duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <Hourglass className="w-3.5 h-3.5 text-amber-600" />
                  Pending Wishes
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  pendingThisMonthList.length > 0 
                    ? 'text-amber-800 bg-amber-100/90' 
                    : 'text-emerald-700 bg-emerald-100/90'
                }`}>
                  {pendingThisMonthList.length > 0 ? 'Upcoming' : 'All Sent'}
                </span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-amber-950">
                  {pendingThisMonthList.length}
                </span>
                <span className="text-xs font-medium text-amber-700">
                  awaiting birthday
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-800">
              <span className="truncate">
                {pendingReadyWithEmail.length} Ready & Scheduled
              </span>
              {pendingMissingEmail.length > 0 && (
                <span className="font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded text-[10px]">
                  {pendingMissingEmail.length} Needs Email
                </span>
              )}
            </div>
          </div>

          {/* 3. Delivery Health Metric (%) */}
          <div className="bg-teal-50/50 hover:bg-teal-50/80 border border-teal-200/80 rounded-xl p-4 transition duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
                  Delivery Health
                </span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-100/90 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                  {parseFloat(deliveryHealthPercentage) >= 95 ? 'Optimal' : parseFloat(deliveryHealthPercentage) >= 80 ? 'Good' : 'Needs Review'}
                </span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-teal-950">
                  {deliveryHealthPercentage}%
                </span>
                <span className="text-xs font-medium text-teal-700">
                  success ratio
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-teal-200/60 flex items-center justify-between text-[11px] text-teal-800">
              <span className="truncate">
                {successEmailCount} of {totalDeliveryAttempts || (successEmailCount > 0 ? successEmailCount : 1)} Deliveries
              </span>
              <span className="font-mono font-bold text-teal-700">
                {failedEmailCount > 0 ? `${failedEmailCount} Failed` : '0 Errors'}
              </span>
            </div>
          </div>

          {/* 4. Total Celebrants in Month */}
          <div className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl p-4 transition duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Cake className="w-3.5 h-3.5 text-slate-500" />
                  Month Total
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-full font-mono">
                  {currentMonthName.slice(0, 3)} {currentYear}
                </span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {thisMonthCelebrants.length}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Birthdays on Record
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
              <span>Today: <strong>{todayMembers.length} Celebrant{todayMembers.length === 1 ? '' : 's'}</strong></span>
              <button
                onClick={() => setSelectedMonthFilter(selectedMonthFilter === currentMonthIndex ? null : currentMonthIndex)}
                className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer transition flex items-center gap-0.5"
              >
                {selectedMonthFilter === currentMonthIndex ? 'Reset' : 'Filter Roster'} →
              </button>
            </div>
          </div>

          {/* 5. Automated Cloud Dispatch Status */}
          <div className="bg-indigo-50/40 hover:bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-4 transition duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-indigo-600" />
                  Cloud Automation
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-indigo-950 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  Daily 8:00 AM Cron
                </span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-indigo-200/60 flex items-center justify-between text-[11px] text-indigo-800">
              <span className="truncate">Google Apps Script</span>
              <button
                onClick={handleAutoDispatchToday}
                disabled={isAutoSending || todayMembers.length === 0}
                className="font-bold text-indigo-700 hover:text-indigo-900 underline disabled:opacity-40 disabled:no-underline cursor-pointer"
              >
                Auto-Send Today
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs & Template Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveSubTab('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'list'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AtSign className="w-3.5 h-3.5" />
            Every Person Mail Address & Wishes ({members.length})
          </button>

          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'analytics'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            Visual Graphs & Analytics
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
              D3 Charts
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'logs'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            Automated Delivery Feed ({emailLogs.length})
          </button>

          <button
            onClick={() => setActiveSubTab('script')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'script'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Gmail Apps Script Code (.gs)
          </button>
        </div>

        {/* Template Theme Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl cursor-pointer hover:bg-indigo-100 transition shadow-2xs"
               onClick={() => setIncludeFestiveCard(!includeFestiveCard)}>
            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all ${
              includeFestiveCard ? 'bg-indigo-600 border-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]' : 'bg-white border-indigo-300'
            }`}>
              {includeFestiveCard && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
            </div>
            <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-tight">Include Festive E-card</span>
            <Gift className={`w-3.5 h-3.5 ${includeFestiveCard ? 'text-rose-500' : 'text-slate-400'}`} />
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mail Theme:</span>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {EMAIL_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* VIEW 1: Every Person Mail Address & Wishes List */}
      {activeSubTab === 'list' && (
        <div className="space-y-4">
          {/* Collapsible Visual Graphs Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                Visual Mail Coverage & Birthday Readiness Chart
              </span>
              <button
                onClick={() => setShowEmbeddedGraph((prev) => !prev)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition cursor-pointer"
              >
                {showEmbeddedGraph ? 'Hide Graph ▲' : 'Show Visual Graph ▼'}
              </button>
            </div>

            {showEmbeddedGraph && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 xl:col-span-8">
                  <MailAnalyticsGraph
                    members={members}
                    emailLogs={emailLogs}
                    sentEmailMap={sentEmailMap}
                    selectedMonthFilter={selectedMonthFilter}
                    onSelectMonthFilter={(m) => setSelectedMonthFilter(m)}
                  />
                </div>
                <div className="lg:col-span-5 xl:col-span-4">
                  <MailSuccessRateDonut
                    logs={emailLogs}
                    members={members}
                    sentEmailMap={sentEmailMap}
                    selectedMonthIndex={selectedMonthFilter}
                    onSelectMonth={(m) => setSelectedMonthFilter(m)}
                    activeStatusFilter={logStatusFilter}
                    onSelectStatusFilter={(st) => {
                      setLogStatusFilter(st);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Active Graph Month Filter Banner */}
          {selectedMonthFilter !== null && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-center justify-between text-xs text-indigo-950">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-indigo-600" />
                <span>
                  Filtering person list by <strong>Month: {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][selectedMonthFilter]}</strong> ({filteredMembers.length} member{filteredMembers.length === 1 ? '' : 's'})
                </span>
              </div>
              <button
                onClick={() => setSelectedMonthFilter(null)}
                className="font-bold text-indigo-700 hover:text-indigo-900 bg-white border border-indigo-300 px-2.5 py-1 rounded-lg cursor-pointer transition shadow-2xs"
              >
                Clear Month Filter (✕)
              </button>
            </div>
          )}

          {/* Filter and Search Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, email, designation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({members.length})
              </button>

              <button
                onClick={() => setFilterType('today')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                  filterType === 'today'
                    ? 'bg-amber-500 text-white font-bold'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <Cake className="w-3 h-3 text-amber-600" />
                Today ({todayMembers.length})
              </button>

              <button
                onClick={() => setFilterType('sent')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                  filterType === 'sent'
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Success (Sent)
              </button>

              <button
                onClick={() => setFilterType('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                  filterType === 'pending'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Pending Queue
              </button>

              <button
                onClick={() => setFilterType('failed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                  filterType === 'failed'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Failed
              </button>

              <button
                onClick={() => setFilterType('has_email')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  filterType === 'has_email'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
                }`}
              >
                Has Email ({membersWithEmail.length})
              </button>

              <button
                onClick={() => setFilterType('missing_email')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  filterType === 'missing_email'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Missing Email ({members.length - membersWithEmail.length})
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 self-end lg:self-auto">
              <button
                onClick={() => setViewLayout('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewLayout === 'table'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table Queue View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                Table View
              </button>
              <button
                onClick={() => setViewLayout('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewLayout === 'grid'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Cards View
              </button>
            </div>
          </div>

          {/* TABLE VIEW WITH COLOR-CODED STATUS BADGES */}
          {viewLayout === 'table' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4 w-20">SL / ID</th>
                      <th className="py-3.5 px-4 min-w-[200px]">Team Member</th>
                      <th className="py-3.5 px-4 w-32">Birthday</th>
                      <th className="py-3.5 px-4 min-w-[240px]">Mentioned Email Address</th>
                      <th className="py-3.5 px-4 min-w-[180px]">Status</th>
                      <th className="py-3.5 px-4 min-w-[220px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredMembers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                          No team members found matching current search and filters.
                        </td>
                      </tr>
                    ) : (
                      filteredMembers.map((member, idx) => {
                        const isToday = Boolean(member.isBirthdayToday || checkIsTodayBirthday(member.birthday) || (member as any).isToday);
                        const memberKey = `${member.id || member.sl || 'mail'}-${idx}`;
                        const hasEmail = Boolean(member.email && member.email.trim().length > 0);
                        const isEditingThis = editingEmailId === (member.id || member.sl);
                        const statusInfo = getMemberStatusInfo(member);
                        const StatusIcon = statusInfo.icon;

                        return (
                          <tr
                            key={memberKey}
                            className={`transition ${
                              isToday
                                ? 'bg-amber-50/30 hover:bg-amber-50/60'
                                : 'hover:bg-slate-50/80'
                            }`}
                          >
                            {/* SL / ID */}
                            <td className="py-3 px-4 font-mono font-bold text-slate-500">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                                {member.id || member.sl}
                              </span>
                            </td>

                            {/* Team Member */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <MemberAvatar member={member} isToday={isToday} />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <div className="font-bold text-slate-900 truncate">
                                      {member.name}
                                    </div>
                                    {!isEmailValid(member.email) && (
                                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100 text-[9px] font-bold uppercase tracking-tighter" title="Missing or invalid email address">
                                        <AlertTriangle className="w-2.5 h-2.5" />
                                        Email Missing
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-500 truncate">
                                    {member.designation || 'Team Member'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Birthday */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              {isToday ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs animate-pulse">
                                  <Cake className="w-3 h-3" />
                                  Today ({member.birthday})
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                  <Calendar className="w-3 h-3 text-slate-400" />
                                  {member.birthday || 'No date'}
                                </span>
                              )}
                            </td>

                            {/* Mentioned Email Address (with inline edit) */}
                            <td className="py-3 px-4">
                              {isEditingThis ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="email"
                                    placeholder="name@kdsgroup.net"
                                    value={tempEmailValue}
                                    onChange={(e) => setTempEmailValue(e.target.value)}
                                    className="px-2.5 py-1 text-xs bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono w-48"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveEmail(memberKey)}
                                    className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                                    title="Save Email"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingEmailId(null)}
                                    className="p-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300 cursor-pointer"
                                    title="Cancel"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  {hasEmail ? (
                                    <>
                                      <span className="font-mono text-xs text-indigo-950 font-bold truncate max-w-[200px]" title={member.email}>
                                        {member.email}
                                      </span>
                                      <button
                                        onClick={() => handleCopyEmail(member.email)}
                                        className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition cursor-pointer"
                                        title="Copy Email"
                                      >
                                        {copiedEmail === member.email ? (
                                          <Check className="w-3 h-3 text-emerald-600" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingEmailId(memberKey);
                                          setTempEmailValue(member.email || '');
                                        }}
                                        className="text-slate-400 hover:text-indigo-600 p-0.5 rounded transition cursor-pointer"
                                        title="Edit Email"
                                      >
                                        <Edit3 className="w-3 h-3" />
                                      </button>
                                    </>
                                  ) : (
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-slate-400 italic text-[11px]">
                                        No email on file
                                      </span>
                                      <button
                                        onClick={() => {
                                          setEditingEmailId(memberKey);
                                          setTempEmailValue('');
                                        }}
                                        className="text-indigo-600 hover:text-indigo-800 text-[11px] font-bold underline cursor-pointer"
                                      >
                                        Add
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Color-Coded Status Column */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex flex-col gap-0.5">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${statusInfo.badgeClass}`}>
                                  <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                                  <span>{statusInfo.label}</span>
                                </span>
                                <span className="text-[10px] text-slate-400 pl-1 truncate max-w-[170px]">
                                  {statusInfo.description}
                                </span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setPreviewMember(member)}
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1"
                                  title="Preview Customized HTML Mail"
                                >
                                  <Eye className="w-3 h-3 text-indigo-500" />
                                  Preview
                                </button>

                                <button
                                  onClick={() => handleSendWishingEmail(member)}
                                  disabled={!hasEmail}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs ${
                                    hasEmail
                                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  }`}
                                  title={hasEmail ? 'Send or Re-send Wishing Mail' : 'Email required to dispatch'}
                                >
                                  <Send className="w-3 h-3" />
                                  Send Mail
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CARDS GRID VIEW WITH COLOR-CODED STATUS BADGES */}
          {viewLayout === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member, idx) => {
                const isToday = Boolean(member.isBirthdayToday || checkIsTodayBirthday(member.birthday) || (member as any).isToday);
                const memberKey = `${member.id || member.sl || 'mail-card'}-${idx}`;
                const hasEmail = Boolean(member.email && member.email.trim().length > 0);
                const isEditingThis = editingEmailId === (member.id || member.sl);
                const statusInfo = getMemberStatusInfo(member);
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={memberKey}
                    className={`bg-white rounded-2xl border transition-all shadow-xs flex flex-col justify-between overflow-hidden ${
                      isToday
                        ? 'border-amber-400 ring-2 ring-amber-400/30 bg-gradient-to-b from-amber-50/40 via-white to-white'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="p-4 border-b border-slate-100">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <MemberAvatar member={member} isToday={isToday} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {member.name}
                              </h4>
                              {member.id && (
                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                  {member.id}
                                </span>
                              )}
                              {!isEmailValid(member.email) && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100 text-[9px] font-bold uppercase tracking-tighter">
                                  <AlertTriangle className="w-2.5 h-2.5" />
                                  Email Warning
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">
                              {member.designation || 'Team Member'}
                            </p>
                          </div>
                        </div>

                        {/* Birthday Badge */}
                        <div className="shrink-0 text-right">
                          {isToday ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs animate-pulse">
                              <Cake className="w-3 h-3" />
                              Today ({member.birthday})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {member.birthday || 'No date'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mail Address Section */}
                    <div className="p-4 space-y-3 flex-1">
                      {/* Mail Address Display / Edit */}
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          <span className="flex items-center gap-1">
                            <AtSign className="w-3 h-3 text-indigo-500" />
                            Mentioned Mail Address:
                          </span>
                          {!isEditingThis && (
                            <button
                              onClick={() => {
                                setEditingEmailId(memberKey);
                                setTempEmailValue(member.email || '');
                              }}
                              className="text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                              title="Edit Email Address"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {isEditingThis ? (
                          <div className="flex items-center gap-1.5 mt-1">
                            <input
                              type="email"
                              placeholder="e.g. name@kdsgroup.net"
                              value={tempEmailValue}
                              onChange={(e) => setTempEmailValue(e.target.value)}
                              className="flex-1 px-2.5 py-1 text-xs bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEmail(memberKey)}
                              className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs font-bold cursor-pointer"
                              title="Save Email"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingEmailId(null)}
                              className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 text-xs cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between mt-1">
                            {hasEmail ? (
                              <span className="text-xs font-mono font-bold text-indigo-950 truncate max-w-[200px]" title={member.email}>
                                {member.email}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 italic font-mono">
                                No email address on file
                              </span>
                            )}

                            {hasEmail && (
                              <button
                                onClick={() => handleCopyEmail(member.email)}
                                className="text-slate-400 hover:text-slate-700 transition p-1 cursor-pointer"
                                title="Copy Email Address"
                              >
                                {copiedEmail === member.email ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Birthday Wishing Mail Body Preview */}
                      <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100 text-xs text-emerald-950">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1 flex items-center gap-1">
                          <Gift className="w-3 h-3 text-emerald-600" />
                          Birthday Wishing Mail Text:
                        </span>
                        <p className="line-clamp-3 leading-relaxed text-slate-700 italic">
                          "{member.wishingMessage || `Happy Birthday, ${member.name}! Wishing you a great day from the IE Central Team. 🎉`}"
                        </p>
                      </div>

                      {/* Color-Coded Status Badge Section */}
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-400">Queue Status:</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${statusInfo.badgeClass}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setPreviewMember(member)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-500" />
                        Preview HTML Mail
                      </button>

                      <button
                        onClick={() => handleSendWishingEmail(member)}
                        disabled={!hasEmail}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs ${
                          hasEmail
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        Auto-Send Wishing Mail
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW: Standalone Full Analytics & Graphs */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 xl:col-span-8">
              <MailAnalyticsGraph
                members={members}
                emailLogs={emailLogs}
                sentEmailMap={sentEmailMap}
                selectedMonthFilter={selectedMonthFilter}
                onSelectMonthFilter={(m) => {
                  setSelectedMonthFilter(m);
                  if (m !== null) {
                    setActiveSubTab('list');
                  }
                }}
              />
            </div>
            <div className="lg:col-span-5 xl:col-span-4">
              <MailSuccessRateDonut
                logs={emailLogs}
                members={members}
                sentEmailMap={sentEmailMap}
                selectedMonthIndex={selectedMonthFilter}
                onSelectMonth={(m) => {
                  setSelectedMonthFilter(m);
                }}
                activeStatusFilter={logStatusFilter}
                onSelectStatusFilter={(st) => {
                  setLogStatusFilter(st);
                  if (st !== 'ALL') {
                    setActiveSubTab('logs');
                  }
                }}
              />
            </div>
          </div>

          {/* Quick Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                Automated Cloud Schedule
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Google Apps Script trigger runs every day at <strong>8:00 AM BD Time</strong>. It verifies today's birthday celebrants and sends personalized corporate emails directly via Gmail MailApp.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                Duplicate Prevention
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Each dispatch writes the current calendar year (<code>2026</code>) to Column L of the Google Sheet, preventing accidental duplicate wishing emails on the same day.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs">
                <AtSign className="w-4 h-4" />
                Direct Email Sync
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You can directly edit any member's email address by clicking the pencil icon next to their card or updating Column G in the master Google Sheet.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Automated Delivery Logs Feed */}
      {activeSubTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <Inbox className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Automated Email Delivery Log Stream
                </h3>
                <p className="text-[11px] text-slate-500">
                  Direct HTTP POST & Google Apps Script background email dispatch events
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Status Filter Buttons */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px]">
                {(['ALL', 'SUCCESS', 'FAILED', 'SKIPPED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setLogStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                      logStatusFilter === st
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchEmailLogs}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {emailLogs.filter((l) => logStatusFilter === 'ALL' || l.status === logStatusFilter).length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                {emailLogs.length === 0
                  ? 'No automated email dispatch logs recorded yet. Use "Auto-Send" or schedule 8:00 AM Cron to dispatch.'
                  : `No logs found matching filter "${logStatusFilter}".`}
              </div>
            ) : (
              emailLogs
                .filter((l) => logStatusFilter === 'ALL' || l.status === logStatusFilter)
                .map((log, lIdx) => (
                <div key={log.id ? `${log.id}-${lIdx}` : `email-log-${lIdx}`} className="p-4 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900">{log.recipientName}</span>
                      <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded">
                        {log.recipientEmail}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        log.status === 'SUCCESS' 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : log.status === 'FAILED'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {log.status === 'SUCCESS' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-rose-600" />}
                        {log.status}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {log.mode}
                      </span>
                    </div>

                    <p className="text-slate-600 font-medium">
                      <strong>Subject:</strong> {log.subject}
                    </p>

                    <p className="text-slate-400 text-[11px]">
                      {log.details || log.messageSnippet}
                    </p>
                  </div>

                  <div className="text-right shrink-0 text-[11px] text-slate-400 font-mono">
                    <span className="block font-bold text-slate-600">{log.timestamp}</span>
                    {log.executionTimeMs && <span>{log.executionTimeMs}ms latency</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: Google Apps Script Gmail Studio */}
      {activeSubTab === 'script' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-700 shadow-xl p-6 text-white space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Google Apps Script Autonomous Email Runner (GmailApp / MailApp)
                </h3>
                <p className="text-xs text-slate-400">
                  Runs natively in Google Sheets at 8:00 AM daily to send wishing emails directly to Column G addresses
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(appsScriptCode);
                alert('Copied Google Apps Script automated email dispatcher code to clipboard!');
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Script Code
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-96">
            <pre>{appsScriptCode}</pre>
          </div>

          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <h5 className="font-bold text-white flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-emerald-400" />
              How to setup Google Sheets 8:00 AM Email Trigger:
            </h5>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
              <li>Open your Google Sheet &gt; Click <strong>Extensions</strong> &gt; <strong>Apps Script</strong>.</li>
              <li>Paste the code snippet above into <code className="text-indigo-300">Code.gs</code>.</li>
              <li>Click the <strong>Triggers</strong> icon (Clock icon) on the left sidebar &gt; Add Trigger.</li>
              <li>Select function: <code className="text-emerald-300">sendBirthdayEmailsAutomatically</code>, Time-driven, <strong>Day timer (8am to 9am)</strong>.</li>
              <li>Save & Authorize. Google Apps Script will now automatically email colleagues on their birthday every morning!</li>
            </ol>
          </div>
        </div>
      )}

      {/* Rich HTML Email Preview Modal */}
      {previewMember && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            {/* Modal Header (Email Client Simulation Frame) */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                </div>
                <span className="text-xs font-bold text-slate-300 ml-2 font-mono">
                  Mail Preview: {currentTemplate.name}
                </span>
              </div>

              <button
                onClick={() => setPreviewMember(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email Metadata Envelope */}
            <div className="bg-slate-50 p-4 border-b border-slate-200 text-xs space-y-1.5 font-sans">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-bold w-16">From:</span>
                <span className="font-semibold text-slate-800 font-mono">IE Central Team &lt;ie.central.team@kdsgroup.net&gt;</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-bold w-16">To:</span>
                <span className="font-bold text-indigo-700 font-mono">{previewMember.name} &lt;{previewMember.email || 'colleague@kdsgroup.net'}&gt;</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-bold w-16">Subject:</span>
                <span className="font-bold text-slate-900">{currentTemplate.subject.replace('{name}', previewMember.name)}</span>
              </div>
            </div>

            {/* Simulated HTML Render Frame */}
            <div className="p-4 max-h-[440px] overflow-y-auto bg-slate-100">
              <div
                dangerouslySetInnerHTML={{
                  __html: generateEmailHtml(previewMember, selectedTemplate, includeFestiveCard),
                }}
              />
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Template: <strong>{currentTemplate.name}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMember(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    handleSendWishingEmail(previewMember);
                    setPreviewMember(null);
                  }}
                  disabled={!previewMember.email}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  Auto-Send This Wishing Mail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
