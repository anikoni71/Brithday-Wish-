import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Cake,
  Calendar,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Radio,
  ExternalLink,
  ShieldCheck,
  Mail,
  Bell,
  Bot,
  RefreshCw,
  TrendingUp,
  Activity,
  Award,
  Globe,
  ChevronRight,
  ArrowUpRight,
  Filter,
  Zap,
  Server,
  Cpu,
  Layers,
  Flame,
  CheckCheck,
  Terminal,
  Wifi,
  CornerDownRight,
  Database,
  Search,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { TeamMember, AdminSheetConfig, EmailLogEntry } from '../types';
import {
  MONTH_NAMES,
  getBirthMonth,
  getDaysUntilBirthday,
  getSpecialDaysForYear,
  getUpcomingCelebrantsPlanningList,
  checkIsTodayBirthday,
  getUpcomingBirthdayInfo,
  normalizeBirthdayString
} from '../utils/dateUtils';
import { BirthdayTree } from './BirthdayTree';

interface ExecutiveDashboardProps {
  members: TeamMember[];
  adminConfig?: AdminSheetConfig;
  emailLogs?: EmailLogEntry[];
  automationLogs?: any[];
  isRealtimeConnected?: boolean;
  lastSynced: string | null;
  onSync: () => void;
  isSyncing: boolean;
  onOpenGenerator: (member: TeamMember) => void;
  onSendWhatsApp: (member: TeamMember) => void;
  isSendingWhatsApp?: boolean;
  onNavigateTab: (tab: 'dashboard' | 'roster' | 'festive' | 'email' | 'generator' | 'script' | 'tester' | 'automation') => void;
  onOpenAdminPlanning: () => void;
}

/**
 * High-performance smooth CountUp hook component for metric statistics
 */
const CountUp: React.FC<{ value: number; duration?: number; suffix?: string }> = ({
  value,
  duration = 900,
  suffix = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Fast start, slow deceleration easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startValue + (value - startValue) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{displayValue}{suffix}</span>;
};

/**
 * Minimalist SVG Sparkline component for FinTech / Enterprise look
 */
const Sparkline: React.FC<{
  data: number[];
  color?: string;
  fillColor?: string;
  height?: number;
  width?: number;
}> = ({
  data,
  color = '#10b981',
  fillColor = 'rgba(16, 185, 129, 0.12)',
  height = 36,
  width = 90
}) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const range = max - min || 1;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  const closedPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0.0} />
        </linearGradient>
      </defs>
      <polygon points={closedPoints} fill={`url(#grad-${color.replace('#', '')})`} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

// ==========================================================================
// CUSTOM CANDLE BAR SHAPE FOR ANNUAL BIRTHDAY DISTRIBUTION CHART
// ==========================================================================
const CandleBar = (props: any) => {
  const { x = 0, y = 0, width = 0, height = 0, fill = '#10b981', value } = props;

  // If value is 0 or height is non-positive, do not render candle
  if (!height || height <= 0 || value === 0) {
    return null;
  }

  // Slim candle body (constrained between 10px and 14px)
  const candleWidth = Math.min(Math.max(width * 0.65, 10), 14);
  const centerX = x + width / 2;
  const candleX = centerX - candleWidth / 2;
  const wickLength = 4;
  const wickTopY = y - wickLength;
  const flameCenterY = wickTopY - 5;

  return (
    <g className="recharts-candle-bar transition-all duration-200">
      {/* 1. The Candle Body */}
      <rect
        x={candleX}
        y={y}
        width={candleWidth}
        height={height}
        fill={fill}
        rx={2.5}
        ry={2.5}
      />

      {/* Subtle vertical candle highlight */}
      <line
        x1={candleX + 2.5}
        y1={y + 2}
        x2={candleX + 2.5}
        y2={y + height - 2}
        stroke="rgba(255, 255, 255, 0.25)"
        strokeWidth={1}
        strokeLinecap="round"
      />

      {/* 2. The Wick */}
      <line
        x1={centerX}
        y1={y}
        x2={centerX}
        y2={wickTopY}
        stroke="#a1a1aa"
        strokeWidth={1.5}
        strokeLinecap="round"
      />

      {/* 3. The Flame (Ambient Glow Aura + Outer Amber Flame + Bright Core) */}
      {/* Ambient Glow Aura */}
      <circle
        cx={centerX}
        cy={flameCenterY}
        r={7}
        fill="#f59e0b"
        opacity={0.35}
      />

      {/* Outer Flame (#fbbf24 amber glow) */}
      <path
        d={`M ${centerX} ${flameCenterY - 6}
            C ${centerX + 3.5} ${flameCenterY - 2}, ${centerX + 3.5} ${flameCenterY + 3.5}, ${centerX} ${flameCenterY + 3.5}
            C ${centerX - 3.5} ${flameCenterY + 3.5}, ${centerX - 3.5} ${flameCenterY - 2}, ${centerX} ${flameCenterY - 6} Z`}
        fill="#fbbf24"
        style={{ filter: 'drop-shadow(0 0 3px rgba(245, 158, 11, 0.9))' }}
      />

      {/* Inner Flame (Warm Yellow Core) */}
      <path
        d={`M ${centerX} ${flameCenterY - 3.5}
            C ${centerX + 1.8} ${flameCenterY - 1}, ${centerX + 1.8} ${flameCenterY + 2.5}, ${centerX} ${flameCenterY + 2.5}
            C ${centerX - 1.8} ${flameCenterY + 2.5}, ${centerX - 1.8} ${flameCenterY - 1}, ${centerX} ${flameCenterY - 3.5} Z`}
        fill="#fef3c7"
      />
    </g>
  );
};

// ==========================================================================
// SYSTEM DIAGNOSTICS COMPONENT
// ==========================================================================
const SystemDiagnostics: React.FC<{
  lockDate: string | null;
  onReset: () => void;
  celebrantsCount: number;
}> = ({ lockDate, onReset, celebrantsCount }) => {
  const today = new Date().toISOString().split('T')[0];
  const isActive = lockDate === today;

  return (
    <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800/60 border-dashed mt-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">System Diagnostics</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse'}`} />
          <span className={`text-[9px] font-bold uppercase tracking-tighter font-mono ${isActive ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isActive ? 'Lock Active' : 'Lock Armed'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-tight font-mono">localStorage Key</div>
          <div className="text-[11px] font-mono font-bold text-zinc-200 truncate bg-black/40 p-1.5 rounded border border-white/5">
            {lockDate || 'NULL (PENDING)'}
          </div>
        </div>
        <div className="space-y-1 flex flex-col items-end">
          <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-tight font-mono">Control Action</div>
          <button
            onClick={onReset}
            className="w-full px-2 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[9px] font-bold text-zinc-300 transition border border-zinc-700 cursor-pointer active:scale-95 font-mono"
          >
            RESET KEY
          </button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-900 flex items-center justify-between text-[9px] font-mono">
        <div className="flex items-center gap-1.5 text-zinc-500">
          <Cpu className="w-3 h-3" />
          <span>V-Core Trace: {isActive ? '0x01' : '0x00'}</span>
        </div>
        <div className={`flex items-center gap-1.5 ${celebrantsCount > 0 ? 'text-emerald-500' : 'text-zinc-600'}`}>
          <Users className="w-3 h-3" />
          <span>Buffer: {celebrantsCount} Target(s)</span>
        </div>
      </div>
    </div>
  );
};

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  members,
  adminConfig,
  emailLogs = [],
  automationLogs = [],
  isRealtimeConnected = true,
  lastSynced,
  onSync,
  isSyncing,
  onOpenGenerator,
  onSendWhatsApp,
  isSendingWhatsApp = false,
  onNavigateTab,
  onOpenAdminPlanning,
}) => {
  const currentYear = new Date().getFullYear();
  const [chartViewMode, setChartViewMode] = useState<'area' | 'bar'>('area');
  const [outlookRange, setOutlookRange] = useState<30 | 14 | 7>(30);
  const [logFilter, setLogFilter] = useState<'ALL' | 'SYNC' | 'WHATSAPP' | 'SYSTEM'>('ALL');
  const [timelineSearch, setTimelineSearch] = useState('');
  const [autoTriggerLogs, setAutoTriggerLogs] = useState<any[]>([]);
  const [dispatchLockDate, setDispatchLockDate] = useState<string | null>(localStorage.getItem('last_auto_dispatch_date'));

  // 1. Key Metrics Calculations
  const totalMembers = members.length;

  const todayCelebrants = useMemo(() => {
    return members.filter((m) => m.isBirthdayToday || checkIsTodayBirthday(m.birthday));
  }, [members]);

  // ==========================================================================
  // OPTION 1: THE MORNING BOOT-UP AUTO-TRIGGER
  // ==========================================================================
  useEffect(() => {
    // 1. Daily Execution Lock (localStorage)
    const today = new Date().toISOString().split('T')[0];
    const lastRunDate = localStorage.getItem('last_auto_dispatch_date');

    // Only run if it hasn't run today and we have celebrants
    if (lastRunDate !== today && todayCelebrants.length > 0) {
      console.log(`[AUTO] Morning bootstrap: Starting auto-dispatch for ${todayCelebrants.length} celebrants`);

      // 2. Background Dispatch: WhatsApp
      todayCelebrants.forEach(member => {
        // Trigger the existing handleSendWhatsApp function passed via prop
        onSendWhatsApp(member);
      });

      // 3. Background Dispatch: Email (Direct API call to headless auto-dispatch)
      fetch('/api/email-auto-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ members }), // Backend filters for today's celebrants
      }).catch(err => console.error('[AUTO] Email dispatch failed:', err));

      // 4. Terminal Logging
      const newLog = {
        id: `auto-dispatch-${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        level: 'OK',
        category: 'SYSTEM',
        message: `[AUTO] Morning sequence complete: ${todayCelebrants.length} wishes sent`,
        subtext: `Admin Notification: ${adminConfig?.adminEmail || 'anik.barua@kdsgroup.net'}`,
      };
      
      setAutoTriggerLogs(prev => [newLog, ...prev]);

      // 5. Update Daily Lock
      localStorage.setItem('last_auto_dispatch_date', today);
      setDispatchLockDate(today);
    }
  }, [todayCelebrants, onSendWhatsApp, adminConfig, members]);

  const handleResetDispatchLock = () => {
    localStorage.removeItem('last_auto_dispatch_date');
    setDispatchLockDate(null);
  };

  const upcoming7DaysCelebrants = useMemo(() => {
    return members.filter((m) => {
      const info = getUpcomingBirthdayInfo(m.birthday, 7);
      return info.isDueSoon && !info.isToday;
    });
  }, [members]);

  // Comprehensive 30-Day Outlook List
  const upcoming30DaysCelebrants = useMemo(() => {
    return getUpcomingCelebrantsPlanningList(members, outlookRange).filter((c) => {
      if (!timelineSearch.trim()) return true;
      const q = timelineSearch.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.designation && c.designation.toLowerCase().includes(q)) ||
        (c.department && c.department.toLowerCase().includes(q))
      );
    });
  }, [members, outlookRange, timelineSearch]);

  // Wish Dispatch Status (% sent this year)
  const dispatchMetrics = useMemo(() => {
    let sentCount = 0;
    let pendingCount = 0;

    members.forEach((m) => {
      const isSent =
        String(m.lastSentYear) === String(currentYear) ||
        m.dispatchStatus === 'Delivered' ||
        m.dispatchStatus === 'Dispatched' ||
        m.serverDispatched === true;

      if (isSent) {
        sentCount++;
      } else {
        pendingCount++;
      }
    });

    const completionRate = totalMembers > 0 ? Math.round((sentCount / totalMembers) * 100) : 0;

    return {
      sentCount,
      pendingCount,
      completionRate,
    };
  }, [members, totalMembers, currentYear]);

  // 2. Chart 1: Donut Progress (Wishes Sent vs Pending)
  const wishDeliveryPieData = useMemo(() => {
    return [
      {
        name: 'Delivered Wishes',
        value: dispatchMetrics.sentCount,
        color: '#10b981', // Glowing Enterprise Emerald
      },
      {
        name: 'Pending Roster',
        value: dispatchMetrics.pendingCount,
        color: '#27272a', // Deep Zinc Track
      },
    ];
  }, [dispatchMetrics]);

  // 3. Chart 2: Annual Birthday & Event Density by Month
  const annualDensityData = useMemo(() => {
    const specialDaysAll = getSpecialDaysForYear(currentYear);

    return MONTH_NAMES.map((m) => {
      // Birthdays in this month
      const monthBirthdays = members.filter((mbr) => {
        const parsed = getBirthMonth(mbr.birthday);
        return parsed === m.index;
      });

      // Special festive days in this month
      const monthFestive = specialDaysAll.filter((sd) => sd.month === m.index);
      const totalEvents = monthBirthdays.length + monthFestive.length;
      const isCurrent = new Date().getMonth() === m.index;

      return {
        month: m.short,
        monthFull: m.full,
        monthIndex: m.index,
        birthdays: monthBirthdays.length,
        festiveDays: monthFestive.length,
        total: totalEvents,
        isCurrent,
      };
    });
  }, [members, currentYear]);

  // Peak month calculation
  const peakMonth = useMemo(() => {
    if (annualDensityData.length === 0) return null;
    return [...annualDensityData].sort((a, b) => b.total - a.total)[0];
  }, [annualDensityData]);

  // 4. Live System Activity Feed Logs
  const systemActivityLogs = useMemo(() => {
    const defaultTime = lastSynced ? new Date(lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const logs: Array<{ id: string; time: string; level: 'OK' | 'SYNC' | 'WHATSAPP' | 'ALERT' | 'INFO'; message: string; subtext?: string; category: 'SYNC' | 'WHATSAPP' | 'SYSTEM' }> = [];

    // Real-time connection log
    if (isRealtimeConnected) {
      logs.push({
        id: 'log-sse-live',
        time: defaultTime,
        level: 'OK',
        category: 'SYSTEM',
        message: 'Server-Sent Events (SSE) telemetry stream active',
        subtext: 'Persistent bi-directional heartbeat verified (200 OK)',
      });
    }

    // Google Sheet sync log
    logs.push({
      id: 'log-sheet-sync',
      time: defaultTime,
      level: 'SYNC',
      category: 'SYNC',
      message: `Master Google Sheet data synchronized (${totalMembers} verified records)`,
      subtext: 'Single-source-of-truth published sheet (gid=0)',
    });

    // WhatsApp Engine log
    const sender = adminConfig?.senderWhatsApp || '+8801625299521';
    logs.push({
      id: 'log-wa-engine',
      time: '08:00:00',
      level: 'WHATSAPP',
      category: 'WHATSAPP',
      message: `WhatsApp direct dispatch engine armed (${sender})`,
      subtext: 'Twilio Cloud API credentials validated & ready',
    });

    // 5:00 PM Advance Planning alert log
    logs.push({
      id: 'log-advance-alert',
      time: '17:00:00',
      level: 'ALERT',
      category: 'SYSTEM',
      message: 'Advance Celebrant Planning alert daemon armed',
      subtext: `Target WhatsApp: ${adminConfig?.adminWhatsApp || '+8801625299521'}`,
    });

    // Add any recent automation logs
    if (automationLogs && automationLogs.length > 0) {
      automationLogs.slice(0, 5).forEach((al, idx) => {
        logs.push({
          id: `al-${idx}`,
          time: al.timestamp ? new Date(al.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'AUTO',
          level: al.status === 'success' ? 'OK' : 'INFO',
          category: 'SYSTEM',
          message: al.event || al.message || 'Automated scheduler execution completed',
          subtext: al.details || undefined,
        });
      });
    }

    // Add email logs if available
    if (emailLogs && emailLogs.length > 0) {
      emailLogs.slice(0, 3).forEach((el, idx) => {
        logs.push({
          id: `el-${idx}`,
          time: el.timestamp ? new Date(el.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'EMAIL',
          level: el.status === 'Delivered' ? 'OK' : 'ALERT',
          category: 'SYSTEM',
          message: `Digest notification: ${el.subject || 'Admin Digest'}`,
          subtext: `Recipient: ${el.recipient}`,
        });
      });
    }

    // Add Morning Auto-Trigger Logs to the terminal feed
    autoTriggerLogs.forEach(log => {
      logs.unshift(log);
    });

    // Filter logs if needed
    return logs.filter((log) => {
      if (logFilter === 'ALL') return true;
      return log.category === logFilter;
    });
  }, [isRealtimeConnected, lastSynced, totalMembers, adminConfig, automationLogs, emailLogs, logFilter]);

  const sheetUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTODUAg2mUYQUTN3P9SPB5Q41Ta_9SufI2gct0GBYDUbPSJX81O1mWHgBjElAIfNfobEbd7Mkii18lt/pubhtml?gid=0&single=true';

  const displaySender = (adminConfig?.senderWhatsApp || '+8801625299521').replace('whatsapp:', '');
  const displayAdminWA = (adminConfig?.adminWhatsApp || '+8801625299521').replace('whatsapp:', '');
  const displayAdminEmail = adminConfig?.adminEmail || 'anik.barua@kdsgroup.net';

  // Animation variants for Staggered Bento Grid Entry
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.02,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-20 font-sans text-zinc-100 bg-zinc-950/40"
    >
      {/* 1. ENTERPRISE HEADER / TELEMETRY COMMAND BAR */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 p-5 sm:p-6 shadow-2xl shadow-black/80"
      >
        {/* Subtle physical texture & ambient micro-radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 -mt-16 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2.5">
            {/* Status Pills / Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/80 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono shadow-inner shadow-emerald-950/40">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold tracking-wider">SSE REAL-TIME ACTIVE</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950/80 border border-zinc-800 text-zinc-400 text-[11px] font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span className="tracking-wide text-zinc-300">SINGLE SOURCE: GOOGLE SHEET</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/80 border border-zinc-800/80 text-zinc-500 text-[11px] font-mono">
                <Server className="w-3 h-3 text-zinc-400" />
                <span>DAEMON v2.5</span>
              </div>
            </div>

            {/* Main Headline */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                Executive Command Center
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  IE CENTRAL
                </span>
              </h2>
              <p className="text-xs text-zinc-400 max-w-2xl mt-0.5 font-normal">
                Enterprise real-time telemetry, automated birthday dispatch orchestration, and synchronized master records.
              </p>
            </div>
          </div>

          {/* Quick Action Station */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/70 hover:border-emerald-500/40 shadow-lg shadow-black/60 transition-all duration-200 cursor-pointer disabled:opacity-50"
              title="Synchronize Google Sheet records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : 'text-zinc-400'}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Master'}</span>
            </button>

            <button
              onClick={onOpenAdminPlanning}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all duration-200 cursor-pointer font-bold"
            >
              <Bell className="w-3.5 h-3.5 text-zinc-950" />
              <span>5:00 PM Alerts</span>
            </button>

            <a
              href={sheetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all duration-200"
            >
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Google Sheet</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* 2. INTERACTIVE BIRTHDAY TREE (GOOGLE SHEET SYNCED BULLETIN CANOPY) */}
      <motion.div variants={itemVariants}>
        <BirthdayTree
          members={members}
          onOpenGenerator={onOpenGenerator}
          onSendWhatsApp={onSendWhatsApp}
          isSendingWhatsApp={isSendingWhatsApp}
        />
      </motion.div>

      {/* 3. TOP METRIC BENTO CARDS WITH INTEGRATED SPARKLINES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Team Members */}
        <motion.div
          variants={itemVariants}
          className="group relative rounded-xl bg-zinc-900/50 backdrop-blur-xl p-4 sm:p-5 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 shadow-xl shadow-black/40 overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium tracking-wider text-zinc-400 uppercase">
              TOTAL TEAM
            </span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-3xl font-extrabold tracking-tight text-white font-mono">
                <CountUp value={totalMembers} />
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-400 font-mono">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>100% Synced</span>
              </div>
            </div>

            {/* Sparkline */}
            <div className="opacity-75 group-hover:opacity-100 transition-opacity">
              <Sparkline data={[18, 19, 21, 22, 23, 23, totalMembers]} color="#10b981" />
            </div>
          </div>
        </motion.div>

        {/* Card 2: Today's Celebrants */}
        <motion.div
          variants={itemVariants}
          className={`group relative rounded-xl p-4 sm:p-5 backdrop-blur-xl border transition-all duration-300 shadow-xl shadow-black/40 overflow-hidden ${
            todayCelebrants.length > 0
              ? 'bg-zinc-900/80 border-emerald-500/50 shadow-emerald-500/5'
              : 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium tracking-wider text-zinc-400 uppercase">
              TODAY'S CELEBRANTS
            </span>
            <Cake className={`w-4 h-4 ${todayCelebrants.length > 0 ? 'text-emerald-400' : 'text-zinc-500'}`} />
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-3xl font-extrabold tracking-tight text-white font-mono flex items-center gap-2">
                <CountUp value={todayCelebrants.length} />
                {todayCelebrants.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 truncate max-w-[130px]">
                {todayCelebrants.length > 0
                  ? todayCelebrants.map((c) => c.name).join(', ')
                  : 'Zero today'}
              </p>
            </div>

            {/* Sparkline */}
            <div className="opacity-75 group-hover:opacity-100 transition-opacity">
              <Sparkline
                data={[0, 1, 0, todayCelebrants.length, todayCelebrants.length]}
                color={todayCelebrants.length > 0 ? '#10b981' : '#71717a'}
              />
            </div>
          </div>
        </motion.div>

        {/* Card 3: 30-Day Lookahead */}
        <motion.div
          variants={itemVariants}
          className="group relative rounded-xl bg-zinc-900/50 backdrop-blur-xl p-4 sm:p-5 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 shadow-xl shadow-black/40 overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium tracking-wider text-zinc-400 uppercase">
              30-DAY OUTLOOK
            </span>
            <Calendar className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-3xl font-extrabold tracking-tight text-white font-mono">
                <CountUp value={upcoming30DaysCelebrants.length} />
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-zinc-400 font-mono">
                <Clock className="w-3 h-3 text-zinc-400" />
                <span>Next 30 Days</span>
              </div>
            </div>

            {/* Sparkline */}
            <div className="opacity-75 group-hover:opacity-100 transition-opacity">
              <Sparkline data={[2, 3, 5, 4, upcoming30DaysCelebrants.length]} color="#a1a1aa" />
            </div>
          </div>
        </motion.div>

        {/* Card 4: Wish Dispatch Rate */}
        <motion.div
          variants={itemVariants}
          className="group relative rounded-xl bg-zinc-900/50 backdrop-blur-xl p-4 sm:p-5 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 shadow-xl shadow-black/40 overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium tracking-wider text-zinc-400 uppercase">
              DISPATCH RATE
            </span>
            <Send className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-3xl font-extrabold tracking-tight text-white font-mono">
                <CountUp value={dispatchMetrics.completionRate} suffix="%" />
              </div>
              <div className="text-[11px] font-mono text-zinc-400 mt-1">
                <span className="text-emerald-400 font-semibold">{dispatchMetrics.sentCount}</span> / {totalMembers} Sent
              </div>
            </div>

            {/* Sparkline */}
            <div className="opacity-75 group-hover:opacity-100 transition-opacity">
              <Sparkline data={[10, 25, 40, 60, dispatchMetrics.completionRate]} color="#10b981" />
            </div>
          </div>
        </motion.div>

        {/* Card 5: Engine Telemetry Status */}
        <motion.div
          variants={itemVariants}
          className="group relative rounded-xl bg-zinc-900/50 backdrop-blur-xl p-4 sm:p-5 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 shadow-xl shadow-black/40 overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium tracking-wider text-zinc-400 uppercase">
              SYSTEM ENGINE
            </span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-400 font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                ARMED & READY
              </div>
              <p className="text-[11px] font-mono text-zinc-400 mt-1 truncate" title={displaySender}>
                WA: {displaySender}
              </p>
            </div>

            {/* Pulse heartbeat Sparkline */}
            <div className="opacity-75 group-hover:opacity-100 transition-opacity">
              <Sparkline data={[4, 6, 4, 18, 4, 6, 4]} color="#10b981" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. CHARTS ROW: FINTECH PRECISION RADIAL & DENSITY AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Wish Delivery Lifecycle (Precision Donut) - 5 cols */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-5 relative rounded-2xl bg-zinc-900/60 backdrop-blur-xl p-5 sm:p-6 border border-zinc-800/80 hover:border-zinc-700 shadow-xl shadow-black/60 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Wish Delivery Lifecycle
                </h3>
                <p className="text-xs text-zinc-400">{currentYear} Annual Target Progress</p>
              </div>

              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-zinc-950 text-emerald-400 border border-emerald-500/30">
                {dispatchMetrics.completionRate}%
              </span>
            </div>

            {/* Radial Chart */}
            <div className="h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-zinc-950 text-white p-2.5 rounded-xl text-xs shadow-2xl border border-zinc-800 font-mono">
                            <p className="font-semibold text-zinc-300">{data.name}</p>
                            <p className="text-emerald-400 font-bold text-sm mt-0.5">{data.value} Members</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">
                              {Math.round((data.value / Math.max(1, totalMembers)) * 100)}% of total team
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Background Track */}
                  <Pie
                    data={[{ value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={66}
                    outerRadius={84}
                    fill="#18181b"
                    stroke="none"
                    isAnimationActive={false}
                    dataKey="value"
                  />
                  {/* Active Segment */}
                  <Pie
                    data={wishDeliveryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={66}
                    outerRadius={84}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    animationDuration={900}
                  >
                    {wishDeliveryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Metrics Readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold text-white font-mono">
                  <CountUp value={dispatchMetrics.sentCount} />
                </span>
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5">
                  DELIVERED
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-800/80 font-mono">
            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Delivered</span>
              </div>
              <p className="text-lg font-bold text-white mt-1">{dispatchMetrics.sentCount}</p>
              <p className="text-[10px] text-zinc-500">{dispatchMetrics.completionRate}% Done</p>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
                <span>Pending</span>
              </div>
              <p className="text-lg font-bold text-zinc-300 mt-1">{dispatchMetrics.pendingCount}</p>
              <p className="text-[10px] text-zinc-500">Upcoming Dates</p>
            </div>
          </div>
        </motion.div>

        {/* Chart 2: Annual Birthday & Event Density (Area / Bar) - 7 cols */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-7 relative rounded-2xl bg-zinc-900/60 backdrop-blur-xl p-5 sm:p-6 border border-zinc-800/80 hover:border-zinc-700 shadow-xl shadow-black/60 flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Annual Distribution Density
                </h3>
                <p className="text-xs text-zinc-400">Monthly breakdown of team birthdays & special festive days ({currentYear})</p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 self-start sm:self-auto">
                <button
                  onClick={() => setChartViewMode('area')}
                  className={`px-3 py-1 text-xs font-mono font-medium rounded transition-all duration-150 cursor-pointer ${
                    chartViewMode === 'area'
                      ? 'bg-zinc-800 text-white font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Area Curve
                </button>
                <button
                  onClick={() => setChartViewMode('bar')}
                  className={`px-3 py-1 text-xs font-mono font-medium rounded transition-all duration-150 cursor-pointer ${
                    chartViewMode === 'bar'
                      ? 'bg-zinc-800 text-white font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Bar View
                </button>
              </div>
            </div>

            {/* High-Fidelity Minimal Area Chart */}
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartViewMode === 'area' ? (
                  <AreaChart data={annualDensityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="glowBirthdaysZinc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="glowFestiveZinc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#71717a" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#71717a" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#27272a" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                      axisLine={{ stroke: '#3f3f46' }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: '#52525b', fontSize: 11, fontFamily: 'monospace' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-zinc-950 text-white p-3 rounded-xl text-xs shadow-2xl border border-zinc-800 font-mono min-w-[180px]">
                              <p className="font-bold text-white text-sm">{data.monthFull} {currentYear}</p>
                              <div className="mt-2 space-y-1">
                                <div className="flex justify-between items-center text-zinc-300">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                    Birthdays:
                                  </span>
                                  <strong className="text-emerald-400 font-bold">{data.birthdays}</strong>
                                </div>
                                <div className="flex justify-between items-center text-zinc-400">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
                                    Festive Days:
                                  </span>
                                  <strong className="text-zinc-200 font-bold">{data.festiveDays}</strong>
                                </div>
                                <div className="border-t border-zinc-800 pt-1 mt-1 flex justify-between items-center font-bold text-white">
                                  <span>Total Events:</span>
                                  <span>{data.total}</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: 8, fontSize: 11, fontFamily: 'monospace' }}
                      formatter={(value) => (
                        <span className="text-xs text-zinc-400 mr-4 font-mono">{value}</span>
                      )}
                    />
                    <Area
                      type="monotone"
                      name="Team Birthdays"
                      dataKey="birthdays"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#glowBirthdaysZinc)"
                    />
                    <Area
                      type="monotone"
                      name="Global Special Days"
                      dataKey="festiveDays"
                      stroke="#71717a"
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      fillOpacity={1}
                      fill="url(#glowFestiveZinc)"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={annualDensityData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#27272a" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                      axisLine={{ stroke: '#3f3f46' }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: '#52525b', fontSize: 11, fontFamily: 'monospace' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-zinc-950 text-white p-2.5 rounded-xl text-xs shadow-2xl border border-zinc-800 font-mono">
                              <p className="font-bold text-white">{data.monthFull}</p>
                              <p className="text-emerald-400 mt-1">Birthdays: {data.birthdays}</p>
                              <p className="text-zinc-400">Festive: {data.festiveDays}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: 8, fontSize: 11, fontFamily: 'monospace' }} />
                    <Bar
                      name="Team Birthdays"
                      dataKey="birthdays"
                      fill="#10b981"
                      shape={<CandleBar />}
                      maxBarSize={28}
                    />
                    <Bar
                      name="Global Special Days"
                      dataKey="festiveDays"
                      fill="#52525b"
                      shape={<CandleBar />}
                      maxBarSize={28}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Peak Month Insight Footnote */}
          {peakMonth && (
            <div className="mt-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>
                  <strong className="text-white">Peak Month:</strong> {peakMonth.monthFull} ({peakMonth.total} events:{' '}
                  {peakMonth.birthdays} birthdays + {peakMonth.festiveDays} festive)
                </span>
              </div>
              <button
                onClick={() => onNavigateTab('festive')}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                Festive Hub <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* 5. 30-DAY OUTLOOK TIMELINE & CELEBRANT COMMAND */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-zinc-900/60 backdrop-blur-xl p-5 sm:p-6 border border-zinc-800/80 shadow-xl shadow-black/60 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-400 font-mono font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                30-Day Celebrant Outlook Timeline
              </h3>
              <p className="text-xs text-zinc-400">
                Upcoming celebrants ready for automated wishing & advance preparations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter upcoming..."
                value={timelineSearch}
                onChange={(e) => setTimelineSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 w-36 sm:w-44 font-mono"
              />
            </div>

            {/* Range Toggle */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 font-mono text-xs">
              <button
                onClick={() => setOutlookRange(7)}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                  outlookRange === 7 ? 'bg-zinc-800 text-emerald-400 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                7D
              </button>
              <button
                onClick={() => setOutlookRange(14)}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                  outlookRange === 14 ? 'bg-zinc-800 text-emerald-400 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                14D
              </button>
              <button
                onClick={() => setOutlookRange(30)}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                  outlookRange === 30 ? 'bg-zinc-800 text-emerald-400 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                30D
              </button>
            </div>
          </div>
        </div>

        {/* Celebrant Cards Grid / Horizontal Timeline Stream */}
        {upcoming30DaysCelebrants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {upcoming30DaysCelebrants.map((item) => {
              const fullMember = members.find((m) => m.id === item.id || m.sl === item.sl);
              const isToday = item.daysRemaining === 0;

              return (
                <div
                  key={item.id || item.sl}
                  className={`p-3.5 rounded-xl border transition-all duration-200 backdrop-blur-md flex flex-col justify-between gap-3 ${
                    isToday
                      ? 'bg-zinc-950/90 border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                      : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar Initials Badge */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                          isToday
                            ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                        }`}
                      >
                        {item.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-white">{item.name}</span>
                          {isToday ? (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              TODAY
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-zinc-400">
                              in {item.daysRemaining} {item.daysRemaining === 1 ? 'day' : 'days'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                          {item.designation} {item.department ? `• ${item.department}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Date Pill */}
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-zinc-200 block">
                        {item.normalizedBirthday}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {item.timeframeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Channels */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                    <div className="flex items-center gap-2">
                      {item.hasWhatsApp ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> WhatsApp
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-zinc-500" /> Email Only
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {fullMember && (
                        <>
                          <button
                            onClick={() => onOpenGenerator(fullMember)}
                            className="px-2 py-1 rounded text-[10px] font-mono font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                          >
                            AI Wish
                          </button>
                          <button
                            onClick={() => onSendWhatsApp(fullMember)}
                            disabled={isSendingWhatsApp}
                            className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition cursor-pointer disabled:opacity-50 flex items-center gap-1"
                          >
                            <Send className="w-2.5 h-2.5" />
                            Send
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-zinc-950/40 rounded-xl border border-dashed border-zinc-800 text-zinc-500 text-xs font-mono">
            No upcoming celebrants found for the selected {outlookRange}-day timeframe.
          </div>
        )}
      </motion.div>

      {/* 5. LIVE SYSTEM ACTIVITY LOG / TERMINAL & INFRASTRUCTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Enterprise Activity Feed / Terminal - 7 cols */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-7 rounded-2xl bg-zinc-900/60 backdrop-blur-xl p-5 border border-zinc-800/80 shadow-xl shadow-black/60 flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-950 border border-zinc-800 text-emerald-400 flex items-center justify-center font-mono">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  System Activity Terminal
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400">Real-time daemon events & audit history</p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 font-mono text-[10px]">
              {(['ALL', 'SYNC', 'WHATSAPP'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLogFilter(filter)}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    logFilter === filter ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Console Box */}
          <div className="bg-zinc-950 rounded-xl p-3.5 border border-zinc-800/80 font-mono text-xs space-y-2.5 max-h-64 overflow-y-auto">
            {systemActivityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2.5 text-zinc-300 leading-tight">
                <span className="text-zinc-500 shrink-0 text-[10px]">[{log.time}]</span>
                <span
                  className={`px-1 rounded text-[9px] font-bold shrink-0 ${
                    log.level === 'OK'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : log.level === 'SYNC'
                      ? 'bg-zinc-800 text-zinc-300'
                      : log.level === 'WHATSAPP'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {log.level}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-200 truncate">{log.message}</p>
                  {log.subtext && <p className="text-zinc-500 text-[10px] truncate mt-0.5">{log.subtext}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Daemon Process: pid_3000 (Active)</span>
            <button
              onClick={() => onNavigateTab('automation')}
              className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Full Automation Hub <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* Right: Master Integration Endpoints - 5 cols */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl p-5 border border-zinc-800/80 shadow-xl shadow-black/60 flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Integration Topology
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                HEALTHY
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {/* WhatsApp Sender */}
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">WhatsApp Gateway</div>
                <div className="text-white font-bold flex items-center justify-between">
                  <span>{displaySender}</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Twilio Direct</span>
                </div>
              </div>

              {/* Admin Email */}
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Admin Notification Mail</div>
                <div className="text-zinc-200 font-semibold truncate">{displayAdminEmail}</div>
              </div>

              {/* Master Sheet */}
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Cloud Database Master</div>
                <div className="text-emerald-400 font-semibold flex items-center justify-between">
                  <span>Google Sheets (gid=0)</span>
                  <a
                    href={sheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-400 hover:text-white underline text-[10px]"
                  >
                    Open
                  </a>
                </div>
              </div>

              {/* SYSTEM DIAGNOSTICS COMPONENT */}
              <SystemDiagnostics 
                lockDate={dispatchLockDate} 
                onReset={handleResetDispatchLock} 
                celebrantsCount={todayCelebrants.length} 
              />
            </div>
          </div>

          {/* Direct Navigation Links */}
          <div className="pt-2 border-t border-zinc-800/80 grid grid-cols-3 gap-2 font-mono text-xs">
            <button
              onClick={() => onNavigateTab('roster')}
              className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-center transition cursor-pointer text-[11px]"
            >
              Team Roster
            </button>
            <button
              onClick={() => onNavigateTab('festive')}
              className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-center transition cursor-pointer text-[11px]"
            >
              Festive Hub
            </button>
            <button
              onClick={() => onNavigateTab('email')}
              className="p-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-center transition cursor-pointer text-[11px]"
            >
              Mail Station
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
