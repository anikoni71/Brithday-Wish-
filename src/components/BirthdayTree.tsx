import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TreePine,
  Cake,
  Calendar,
  Sparkles,
  Search,
  Users,
  Send,
  ExternalLink,
  ChevronRight,
  Star,
  Flame,
  Info,
  CheckCircle2,
  X,
  Phone,
  Mail,
  Award,
  LayoutGrid,
  LayoutList,
  Briefcase,
  Maximize,
  Minimize,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { TeamMember } from '../types';
import {
  MONTH_NAMES,
  getBirthMonth,
  parseBirthdayDate,
  checkIsTodayBirthday,
  getUpcomingBirthdayInfo,
  normalizeBirthdayString
} from '../utils/dateUtils';
import { formatProfileImageUrl } from '../utils/imageUtils';

interface BirthdayTreeProps {
  members: TeamMember[];
  onOpenGenerator: (member: TeamMember) => void;
  onSendWhatsApp: (member: TeamMember) => void;
  isSendingWhatsApp?: boolean;
}

// 12 Scalloped Palette Colors matching the reference physical craft board
const MONTH_THEMES = [
  { month: 'Jan', full: 'January', petalColor: '#0ea5e9', innerBg: '#0284c7', ribbonColor: '#38bdf8', ringBorder: '#bae6fd' },     // Sky Blue
  { month: 'Feb', full: 'February', petalColor: '#ec4899', innerBg: '#db2777', ribbonColor: '#f472b6', ringBorder: '#fbcfe8' },    // Rose Pink
  { month: 'Mar', full: 'March', petalColor: '#10b981', innerBg: '#059669', ribbonColor: '#34d399', ringBorder: '#a7f3d0' },       // Emerald Green
  { month: 'Apr', full: 'April', petalColor: '#f59e0b', innerBg: '#d97706', ribbonColor: '#fbbf24', ringBorder: '#fde68a' },       // Sun Amber
  { month: 'May', full: 'May', petalColor: '#8b5cf6', innerBg: '#7c3aed', ribbonColor: '#a78bfa', ringBorder: '#ddd6fe' },         // Purple
  { month: 'Jun', full: 'June', petalColor: '#ef4444', innerBg: '#dc2626', ribbonColor: '#f87171', ringBorder: '#fecaca' },        // Poppy Red
  { month: 'Jul', full: 'July', petalColor: '#06b6d4', innerBg: '#0891b2', ribbonColor: '#22d3ee', ringBorder: '#cffafe' },       // Cyan Teal
  { month: 'Aug', full: 'August', petalColor: '#f97316', innerBg: '#ea580c', ribbonColor: '#fb923c', ringBorder: '#ffedd5' },     // Warm Orange
  { month: 'Sep', full: 'September', petalColor: '#14b8a6', innerBg: '#0d9488', ribbonColor: '#2dd4bf', ringBorder: '#ccfbf1' },  // Mint Teal
  { month: 'Oct', full: 'October', petalColor: '#eab308', innerBg: '#ca8a04', ribbonColor: '#fde047', ringBorder: '#fef08a' },     // Golden Yellow
  { month: 'Nov', full: 'November', petalColor: '#f43f5e', innerBg: '#e11d48', ribbonColor: '#fb7185', ringBorder: '#ffe4e6' },    // Crimson Berry
  { month: 'Dec', full: 'December', petalColor: '#6366f1', innerBg: '#4f46e5', ribbonColor: '#818cf8', ringBorder: '#e0e7ff' },    // Royal Indigo
];

// Predefined branch slot coordinates on the tree canopy (percentages: x%, y%)
// Arranged organically across left, center, right spreading branches
const BRANCH_POSITIONS = [
  // Top canopy crown (4 slots)
  { x: 28, y: 15, rotate: -6 },
  { x: 42, y: 12, rotate: -2 },
  { x: 58, y: 12, rotate: 3 },
  { x: 72, y: 16, rotate: 8 },

  // Upper branches (6 slots)
  { x: 16, y: 26, rotate: -12 },
  { x: 32, y: 25, rotate: -5 },
  { x: 48, y: 23, rotate: 0 },
  { x: 64, y: 25, rotate: 6 },
  { x: 82, y: 27, rotate: 14 },
  { x: 92, y: 35, rotate: 18 },

  // Mid branches (8 slots)
  { x: 10, y: 42, rotate: -16 },
  { x: 23, y: 39, rotate: -8 },
  { x: 37, y: 37, rotate: -3 },
  { x: 50, y: 36, rotate: 1 },
  { x: 63, y: 38, rotate: 4 },
  { x: 77, y: 40, rotate: 10 },
  { x: 88, y: 48, rotate: 16 },
  { x: 12, y: 58, rotate: -14 },

  // Lower branches (8 slots)
  { x: 25, y: 53, rotate: -6 },
  { x: 38, y: 51, rotate: -2 },
  { x: 62, y: 52, rotate: 3 },
  { x: 75, y: 54, rotate: 8 },
  { x: 20, y: 68, rotate: -10 },
  { x: 33, y: 66, rotate: -4 },
  { x: 67, y: 67, rotate: 5 },
  { x: 80, y: 70, rotate: 12 },

  // Base / low clusters (4 slots)
  { x: 27, y: 81, rotate: -5 },
  { x: 40, y: 78, rotate: -1 },
  { x: 60, y: 79, rotate: 2 },
  { x: 73, y: 82, rotate: 6 },
];

export const BirthdayTree: React.FC<BirthdayTreeProps> = ({
  members,
  onOpenGenerator,
  onSendWhatsApp,
  isSendingWhatsApp = false,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'months'>('tree');
  const [cardDetailLevel, setCardDetailLevel] = useState<'compact' | 'detailed'>('compact');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Handle ESC key to exit fullscreen and lock body scroll
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Process members with parsed dates
  const processedMembers = useMemo(() => {
    return (members || []).map((m, idx) => {
      const parsed = parseBirthdayDate(m.birthday);
      const rawMonth = parsed ? parsed.month : getBirthMonth(m.birthday);
      const monthIdx = typeof rawMonth === 'number' && !isNaN(rawMonth) && rawMonth >= 0 && rawMonth <= 11 
        ? rawMonth 
        : (idx % 12);
      const isToday = Boolean(m.isBirthdayToday || checkIsTodayBirthday(m.birthday));
      const upcomingInfo = getUpcomingBirthdayInfo(m.birthday, 30);
      const normalized = normalizeBirthdayString(m.birthday);
      const theme = MONTH_THEMES[monthIdx] || MONTH_THEMES[0];

      return {
        ...m,
        parsedMonth: monthIdx,
        parsedDay: parsed ? parsed.day : null,
        formattedBirthday: normalized || m.birthday || 'Celebration',
        isToday,
        isUpcoming: Boolean(upcomingInfo?.isDueSoon),
        daysRemaining: upcomingInfo?.daysRemaining ?? null,
        theme,
        slotIndex: idx,
      };
    });
  }, [members]);

  // Filter members based on month and search
  const filteredMembers = useMemo(() => {
    return processedMembers.filter((m) => {
      if (selectedMonth !== null && m.parsedMonth !== selectedMonth) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (m.name || '').toLowerCase().includes(q);
        const matchDept = m.department ? m.department.toLowerCase().includes(q) : false;
        const matchDesig = m.designation ? m.designation.toLowerCase().includes(q) : false;
        const matchMonth = MONTH_NAMES[m.parsedMonth]?.full.toLowerCase().includes(q) || false;
        return matchName || matchDept || matchDesig || matchMonth;
      }
      return true;
    });
  }, [processedMembers, selectedMonth, searchQuery]);

  // Group members by month
  const monthlyGroups = useMemo(() => {
    const groups: { [key: number]: typeof processedMembers } = {};
    for (let i = 0; i < 12; i++) {
      groups[i] = [];
    }
    processedMembers.forEach((m) => {
      if (typeof m.parsedMonth === 'number' && m.parsedMonth >= 0 && m.parsedMonth < 12) {
        if (!groups[m.parsedMonth]) {
          groups[m.parsedMonth] = [];
        }
        groups[m.parsedMonth].push(m);
      }
    });
    return groups;
  }, [processedMembers]);

  // Today & this month counts
  const currentMonthIdx = new Date().getMonth();
  const todayCount = useMemo(() => processedMembers.filter((m) => m.isToday).length, [processedMembers]);
  const thisMonthCount = useMemo(
    () => processedMembers.filter((m) => m.parsedMonth === currentMonthIdx).length,
    [processedMembers, currentMonthIdx]
  );

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-[100] w-screen h-screen overflow-y-auto bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-4 sm:p-7 flex flex-col justify-start select-none shadow-2xl backdrop-blur-2xl"
          : "relative rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-zinc-950 border border-zinc-800/90 shadow-2xl shadow-black/80 overflow-hidden"
      }
    >
      {/* Background Decorative Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* 1. TOP HEADER & BULLETIN BOARD WOODEN HEADING BANNER */}
      <div className={`relative z-10 p-5 sm:p-7 border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md ${isFullscreen ? 'rounded-2xl border border-zinc-800/90' : ''}`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 via-emerald-500/20 to-teal-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <TreePine className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  Interactive Birthday Tree
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> GOOGLE SHEET SYNCED
                </span>
                {isFullscreen && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 flex items-center gap-1">
                    FULL SCREEN MODE (ESC to exit)
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 font-normal">
                Visual bulletin tree mapping all {members.length} team members by birth months with blossom ornaments & direct wishing
              </p>
            </div>
          </div>

          {/* Quick Metrics & Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Today Pill */}
            <div
              onClick={() => {
                setSelectedMonth(null);
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 cursor-pointer transition ${
                todayCount > 0
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 animate-pulse shadow-lg shadow-emerald-500/10'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              <Cake className="w-3.5 h-3.5 text-emerald-400" />
              <span>Today: <strong className="text-white">{todayCount}</strong></span>
            </div>

            {/* Current Month Pill */}
            <button
              onClick={() => setSelectedMonth(selectedMonth === currentMonthIdx ? null : currentMonthIdx)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 cursor-pointer transition ${
                selectedMonth === currentMonthIdx
                  ? 'bg-amber-500 text-zinc-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{MONTH_NAMES[currentMonthIdx].short}: <strong className={selectedMonth === currentMonthIdx ? 'text-zinc-950' : 'text-white'}>{thisMonthCount}</strong></span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 font-mono text-xs">
              <button
                onClick={() => setViewMode('tree')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'tree' ? 'bg-zinc-800 text-emerald-400 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <TreePine className="w-3 h-3" />
                <span>Canopy Tree</span>
              </button>
              <button
                onClick={() => setViewMode('months')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'months' ? 'bg-zinc-800 text-emerald-400 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Users className="w-3 h-3" />
                <span>12 Boughs</span>
              </button>
            </div>

            {/* Card Detail Level Toggle (Compact vs Full Details) */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 font-mono text-xs">
              <button
                onClick={() => setCardDetailLevel('compact')}
                title="Compact Card View"
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  cardDetailLevel === 'compact' ? 'bg-zinc-800 text-amber-400 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>Compact</span>
              </button>
              <button
                onClick={() => setCardDetailLevel('detailed')}
                title="Full Details Card View"
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  cardDetailLevel === 'detailed' ? 'bg-zinc-800 text-amber-400 font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutList className="w-3 h-3" />
                <span>Full Details</span>
              </button>
            </div>

            {/* Full Screen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Full Screen Mode (Esc)" : "Enter Full Screen Mode"}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 cursor-pointer transition shadow-sm ${
                isFullscreen
                  ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold border-amber-400 shadow-amber-500/30'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800'
              }`}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Exit Full Screen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Full Screen</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. FILTER & SEARCH BAR */}
        <div className="mt-4 pt-4 border-t border-zinc-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Month Quick Tabs (Jan - Dec) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none font-mono text-xs">
            <button
              onClick={() => setSelectedMonth(null)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition shrink-0 cursor-pointer ${
                selectedMonth === null
                  ? 'bg-zinc-100 text-zinc-950 font-bold shadow-sm'
                  : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
              }`}
            >
              All Year ({members.length})
            </button>
            {MONTH_NAMES.map((m) => {
              const count = monthlyGroups[m.index]?.length || 0;
              const isCurrent = m.index === currentMonthIdx;
              const isSel = selectedMonth === m.index;
              const theme = MONTH_THEMES[m.index];

              return (
                <button
                  key={m.short}
                  onClick={() => setSelectedMonth(isSel ? null : m.index)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition shrink-0 flex items-center gap-1 cursor-pointer border ${
                    isSel
                      ? 'text-white font-bold shadow-md'
                      : isCurrent
                      ? 'bg-zinc-900/90 text-emerald-400 border-emerald-500/40 hover:bg-zinc-800'
                      : 'bg-zinc-900/70 text-zinc-400 hover:text-zinc-200 border-zinc-800/80'
                  }`}
                  style={isSel ? { backgroundColor: theme.innerBg, borderColor: theme.petalColor } : {}}
                >
                  <span>{m.short}</span>
                  <span
                    className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                      isSel ? 'bg-black/30 text-white' : count > 0 ? 'bg-zinc-800 text-zinc-300' : 'text-zinc-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search input */}
          <div className="relative shrink-0">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search member on tree..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 w-full sm:w-56 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. MAIN BIRTHDAY TREE CANVAS (REFERENCE PHOTO RECREATION) */}
      {viewMode === 'tree' ? (
        <div className={`relative ${isFullscreen ? 'flex-1 min-h-[720px] sm:min-h-[820px] lg:min-h-[920px]' : 'min-h-[640px] sm:min-h-[720px] lg:min-h-[820px]'} p-4 sm:p-6 flex flex-col items-center justify-center overflow-hidden select-none bg-gradient-to-b from-zinc-950/40 via-zinc-900/20 to-zinc-950/60`}>
          {/* Stylized Physical Bulletin Wall Framing */}
          {/* Top Decorative Star Garland */}
          <div className="absolute top-3 left-0 right-0 flex items-center justify-between px-6 pointer-events-none opacity-80 z-0">
            <div className="flex items-center gap-3">
              <Star className="w-7 h-7 text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse" />
              <Star className="w-5 h-5 text-orange-400 fill-orange-400 drop-shadow-[0_0_6px_rgba(251,146,60,0.5)]" />
              <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <Star className="w-5 h-5 text-rose-400 fill-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.5)]" />
              <Star className="w-7 h-7 text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse" />
            </div>
          </div>

          {/* ICONIC VINTAGE BANNER ON TOP: "BIRTHDAY TREE" (from Reference Picture) */}
          <div className="relative z-10 mb-4 -mt-2 sm:mt-0">
            <div className="relative inline-flex items-center justify-center">
              {/* Banner Ribbon Tails (Left & Right) */}
              <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-6 h-9 bg-amber-950/90 border border-amber-600/60 rounded-l-md transform -skew-y-6 shadow-md shadow-black/80" />
              <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-6 h-9 bg-amber-950/90 border border-amber-600/60 rounded-r-md transform skew-y-6 shadow-md shadow-black/80" />

              {/* Main Banner Arch */}
              <div className="relative px-8 py-2.5 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-2 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center gap-3">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-spin [animation-duration:8s]" />
                <h2 className="text-sm sm:text-base font-black tracking-widest text-amber-300 font-mono uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  ★ BIRTHDAY TREE ★
                </h2>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-spin [animation-duration:8s]" />
              </div>
            </div>
            <p className="text-[10px] text-center font-mono text-zinc-400 mt-1">
              IE Central Team Google Sheet Master Canopy
            </p>
          </div>

          {/* SVG ORGANIC TREE TRUNK & EXPANDING BRANCH CANOPY */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90 z-0">
            <svg
              viewBox="0 0 1000 800"
              className={`w-full h-full ${isFullscreen ? 'max-h-[950px]' : 'max-h-[850px]'} object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]`}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Wood Grain Gradient for Trunk */}
                <linearGradient id="treeBarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#451a03" />
                  <stop offset="35%" stopColor="#78350f" />
                  <stop offset="50%" stopColor="#92400e" />
                  <stop offset="70%" stopColor="#78350f" />
                  <stop offset="100%" stopColor="#271103" />
                </linearGradient>

                {/* Branch Accent Line */}
                <linearGradient id="branchGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#78350f" stopOpacity="0.1" />
                </linearGradient>

                {/* Foliage Glow Canopy */}
                <radialGradient id="foliageGlow" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
                  <stop offset="50%" stopColor="#059669" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Ambient Foliage Glow Cloud */}
              <ellipse cx="500" cy="350" rx="440" ry="290" fill="url(#foliageGlow)" />

              {/* Central Trunk Base Roots */}
              <path
                d="M 420 780 C 430 680, 460 550, 470 420 
                   C 440 380, 360 340, 240 300 
                   C 200 290, 140 280, 80 270
                   C 100 285, 180 310, 220 325 
                   C 340 370, 430 420, 460 480 
                   C 450 580, 420 680, 380 780 Z"
                fill="url(#treeBarkGrad)"
                stroke="#92400e"
                strokeWidth="1.5"
              />

              {/* Right Lower Branch */}
              <path
                d="M 540 460 C 580 430, 680 380, 800 340 
                   C 860 320, 920 305, 950 295 
                   C 920 315, 840 340, 770 370 
                   C 660 420, 580 470, 550 520 Z"
                fill="url(#treeBarkGrad)"
                stroke="#92400e"
                strokeWidth="1.5"
              />

              {/* Main Center Trunk and Crown Fork */}
              <path
                d="M 430 780 C 440 680, 470 540, 480 400
                   C 480 340, 450 280, 390 220
                   C 340 170, 280 140, 200 120
                   C 230 135, 300 170, 340 210
                   C 420 280, 460 350, 475 420
                   C 485 360, 500 280, 500 170
                   C 500 130, 495 100, 490 80
                   C 510 95, 520 130, 520 180
                   C 520 280, 530 360, 545 420
                   C 560 350, 600 280, 680 210
                   C 720 170, 780 135, 810 120
                   C 740 140, 680 170, 630 220
                   C 570 280, 540 340, 540 400
                   C 550 540, 580 680, 590 780 Z"
                fill="url(#treeBarkGrad)"
                stroke="#92400e"
                strokeWidth="1.5"
              />

              {/* Mid Sub-Branches */}
              <path
                d="M 330 230 C 270 230, 200 210, 130 180 C 170 200, 240 225, 310 240 Z"
                fill="url(#treeBarkGrad)"
              />
              <path
                d="M 690 230 C 750 230, 820 210, 890 180 C 850 200, 780 225, 710 240 Z"
                fill="url(#treeBarkGrad)"
              />
              <path
                d="M 450 310 C 370 280, 300 250, 220 210 C 270 235, 350 270, 420 295 Z"
                fill="url(#treeBarkGrad)"
              />
              <path
                d="M 570 310 C 650 280, 720 250, 800 210 C 750 235, 670 270, 600 295 Z"
                fill="url(#treeBarkGrad)"
              />

              {/* Bark Grain Lines (like in reference picture) */}
              <path d="M 460 760 C 470 650, 490 520, 495 440" stroke="#fcd34d" strokeWidth="1.5" strokeDasharray="6 8" opacity="0.35" fill="none" />
              <path d="M 490 770 C 500 660, 510 530, 510 440" stroke="#fcd34d" strokeWidth="2" opacity="0.4" fill="none" />
              <path d="M 520 760 C 530 650, 530 520, 525 440" stroke="#fcd34d" strokeWidth="1.5" strokeDasharray="6 8" opacity="0.35" fill="none" />

              {/* Bottom Grass & Flower Trim */}
              <path
                d="M 50 780 C 150 750, 250 770, 350 755 C 450 770, 550 770, 650 755 C 750 770, 850 750, 950 780 L 950 800 L 50 800 Z"
                fill="#064e3b"
                opacity="0.8"
              />
            </svg>
          </div>

          {/* DYNAMIC CELEBRANT FLOWER / BALLOON ORNAMENTS HANGING ON BRANCHES */}
          <div className="relative z-10 w-full max-w-5xl h-[560px] sm:h-[640px] lg:h-[720px] mx-auto">
            {filteredMembers.map((member, idx) => {
              // Assign coordinate position based on index or custom spread
              const pos = BRANCH_POSITIONS[idx % BRANCH_POSITIONS.length];
              const isSelected = activeMember?.id === member.id || activeMember?.sl === member.sl;
              const isToday = member.isToday;
              const theme = member.theme;

              return (
                <motion.div
                  key={member.id || member.sl || idx}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.02, duration: 0.4, type: 'spring' }}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: `translate(-50%, -50%) rotate(${pos.rotate}deg)`,
                  }}
                  onClick={() => setActiveMember(member)}
                  className="absolute cursor-pointer group select-none z-10 hover:z-30 transition-all duration-300"
                >
                  {/* SCALLOPED ROSETTE / BALLOON CRAFT SHAPE (MATCHING REFERENCE PICTURE) */}
                  <div className="relative flex flex-col items-center">
                    {/* Top Month Tag */}
                    <div
                      className="px-2 py-0.5 rounded-md text-[9px] font-black font-mono tracking-wider uppercase text-white shadow-md mb-0.5 border"
                      style={{ backgroundColor: theme.innerBg, borderColor: theme.ringBorder }}
                    >
                      {MONTH_NAMES[member.parsedMonth]?.short || 'BDAY'}
                    </div>

                    {/* Scalloped Petal Badge Container */}
                    <div className="relative">
                      {/* Pulsing Aura if Today's Birthday */}
                      {isToday && (
                        <div className="absolute -inset-2 rounded-full bg-amber-400/40 animate-ping pointer-events-none" />
                      )}

                      {/* Scalloped Flower Petal SVG Frame */}
                      <svg width="68" height="68" viewBox="0 0 100 100" className="drop-shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                        {/* 12-Petal Flower Rosette */}
                        <g fill={theme.petalColor} stroke={theme.ringBorder} strokeWidth="2">
                          <circle cx="50" cy="18" r="16" />
                          <circle cx="66" cy="22" r="16" />
                          <circle cx="78" cy="34" r="16" />
                          <circle cx="82" cy="50" r="16" />
                          <circle cx="78" cy="66" r="16" />
                          <circle cx="66" cy="78" r="16" />
                          <circle cx="50" cy="82" r="16" />
                          <circle cx="34" cy="78" r="16" />
                          <circle cx="22" cy="66" r="16" />
                          <circle cx="18" cy="50" r="16" />
                          <circle cx="22" cy="34" r="16" />
                          <circle cx="34" cy="22" r="16" />
                          <circle cx="50" cy="50" r="38" fill={theme.innerBg} stroke="#ffffff" strokeWidth="2.5" />
                        </g>
                      </svg>

                      {/* Member Center Avatar / Initials Photo Port */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          className={`w-[46px] h-[46px] rounded-full flex items-center justify-center font-bold text-xs text-white font-mono shadow-md border-2 border-white overflow-hidden transition-transform duration-200 group-hover:scale-105 transform-gpu [backface-visibility:hidden] ${
                            isToday ? 'bg-amber-400 text-zinc-950 font-black ring-2 ring-amber-300' : 'bg-zinc-900'
                          }`}
                        >
                          {member.imageUrl ? (
                            <img
                              src={formatProfileImageUrl(member.imageUrl)}
                              alt={member.name}
                              className="w-full h-full object-cover object-center aspect-square rounded-full block select-none pointer-events-auto [image-rendering:-webkit-optimize-contrast] [image-rendering:high-quality] [transform:translateZ(0)] [backface-visibility:hidden]"
                              loading="eager"
                              decoding="sync"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            member.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')
                          )}
                        </div>
                      </div>

                      {/* Star Badge if Today */}
                      {isToday && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shadow-lg border border-white animate-bounce">
                          <Sparkles className="w-3 h-3 text-zinc-950" />
                        </div>
                      )}
                    </div>

                    {/* Member Name Plate / Badge (under ornament) */}
                    {cardDetailLevel === 'compact' ? (
                      <div className="mt-0.5 px-2 py-0.5 rounded bg-zinc-950/90 border border-zinc-700/80 shadow-md text-center max-w-[85px] truncate transition-all">
                        <p className="text-[10px] font-bold text-white truncate leading-tight">{member.name}</p>
                        <p className="text-[8px] font-mono text-amber-300 font-semibold leading-tight">{member.formattedBirthday}</p>
                      </div>
                    ) : (
                      <div className="mt-0.5 p-1.5 rounded-xl bg-zinc-950/95 border border-zinc-700/90 shadow-xl text-center min-w-[105px] max-w-[125px] backdrop-blur-md transition-all">
                        <p className="text-[10px] font-bold text-white truncate leading-tight">{member.name}</p>
                        {member.designation && (
                          <p className="text-[8px] font-mono text-zinc-400 truncate leading-tight mt-0.5">{member.designation}</p>
                        )}
                        <div className="flex items-center justify-center gap-1 mt-1 pt-1 border-t border-zinc-800/80">
                          <span className="text-[8px] font-mono text-amber-300 font-bold">{member.formattedBirthday}</span>
                          {member.daysRemaining !== null && member.daysRemaining >= 0 && member.daysRemaining <= 30 && !member.isToday && (
                            <span className="text-[7.5px] font-mono px-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              {member.daysRemaining === 0 ? 'Soon' : `${member.daysRemaining}d`}
                            </span>
                          )}
                        </div>
                        {/* Quick Action Icons in Full Details */}
                        <div className="flex items-center justify-center gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => onOpenGenerator(member)}
                            title="AI Wish Generator"
                            className="p-1 rounded-md bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-amber-400 transition cursor-pointer"
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onSendWhatsApp(member)}
                            title="WhatsApp Wish"
                            className="p-1 rounded-md bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-emerald-400 transition cursor-pointer"
                          >
                            <Send className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Squiggly Ribbon Tail (Like in reference picture) */}
                    <svg width="20" height="28" viewBox="0 0 20 28" className="mt-0.5 opacity-85">
                      <path
                        d="M 10 0 Q 3 7, 10 14 T 10 28"
                        fill="none"
                        stroke={theme.ribbonColor}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Grass / Festive Trim Banner */}
          <div className="relative z-10 mt-auto pt-2 w-full flex items-center justify-between text-xs font-mono text-zinc-400 px-4 border-t border-zinc-800/60 bg-zinc-950/40 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Google Sheet Master: <strong>{filteredMembers.length} Blossom Ornaments</strong> Active</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400">
              <span>Click any blossom to view details & trigger AI / WhatsApp wish</span>
            </div>
          </div>
        </div>
      ) : (
        /* 4. ALTERNATIVE: 12 SEASONAL BOUGHS VIEW */
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MONTH_NAMES.map((m) => {
            const group = monthlyGroups[m.index] || [];
            const theme = MONTH_THEMES[m.index];
            const isCurrentMonth = m.index === currentMonthIdx;

            return (
              <div
                key={m.short}
                className={`rounded-2xl p-4 border transition-all duration-200 backdrop-blur-md flex flex-col justify-between ${
                  isCurrentMonth
                    ? 'bg-zinc-950/90 border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                    : 'bg-zinc-950/50 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white font-mono shadow-sm"
                      style={{ backgroundColor: theme.innerBg }}
                    >
                      {m.short}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        {m.full}
                        {isCurrentMonth && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            CURRENT
                          </span>
                        )}
                      </h4>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-400">
                    {group.length} {group.length === 1 ? 'member' : 'members'}
                  </span>
                </div>

                {/* Celebrants in Month */}
                <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
                  {group.length > 0 ? (
                    group.map((mem) => {
                      if (cardDetailLevel === 'compact') {
                        return (
                          <div
                            key={mem.id || mem.sl}
                            onClick={() => setActiveMember(mem)}
                            className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition ${
                              mem.isToday
                                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                                : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800 text-zinc-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white font-mono shrink-0 overflow-hidden border border-white/30 shadow-sm bg-zinc-900"
                                style={{ backgroundColor: theme.innerBg }}
                              >
                                {mem.imageUrl ? (
                                  <img
                                    src={formatProfileImageUrl(mem.imageUrl)}
                                    alt={mem.name}
                                    className="w-full h-full object-cover object-center aspect-square rounded-full block select-none [image-rendering:-webkit-optimize-contrast] [image-rendering:high-quality] [transform:translateZ(0)]"
                                    loading="eager"
                                    decoding="sync"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  mem.name[0]
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold truncate text-white">{mem.name}</p>
                                <p className="text-[10px] text-zinc-400 font-mono">{mem.formattedBirthday}</p>
                              </div>
                            </div>
                            {mem.isToday && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400 text-zinc-950 font-mono shrink-0 animate-pulse">
                                TODAY
                              </span>
                            )}
                          </div>
                        );
                      }

                      // Full details card view
                      return (
                        <div
                          key={mem.id || mem.sl}
                          onClick={() => setActiveMember(mem)}
                          className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                            mem.isToday
                              ? 'bg-emerald-950/70 border-emerald-500/70 text-emerald-100 shadow-md shadow-emerald-500/10'
                              : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white font-mono shrink-0 shadow-md overflow-hidden border border-white/30 bg-zinc-900"
                                style={{ backgroundColor: theme.innerBg }}
                              >
                                {mem.imageUrl ? (
                                  <img
                                    src={formatProfileImageUrl(mem.imageUrl)}
                                    alt={mem.name}
                                    className="w-full h-full object-cover object-center aspect-square rounded-lg block select-none [image-rendering:-webkit-optimize-contrast] [image-rendering:high-quality] [transform:translateZ(0)]"
                                    loading="eager"
                                    decoding="sync"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  mem.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join('')
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold truncate text-white">{mem.name}</p>
                                <p className="text-[10px] text-zinc-400 font-mono truncate">{mem.designation || 'Team Member'}</p>
                              </div>
                            </div>
                            {mem.isToday ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400 text-zinc-950 font-mono shrink-0 animate-pulse">
                                TODAY!
                              </span>
                            ) : mem.daysRemaining !== null && mem.daysRemaining >= 0 && mem.daysRemaining <= 30 ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono shrink-0">
                                in {mem.daysRemaining}d
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-2 pt-1.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                            <span className="flex items-center gap-1 text-amber-300 font-semibold">
                              <Cake className="w-3 h-3 text-amber-400" />
                              {mem.formattedBirthday}
                            </span>
                            {mem.department && (
                              <span className="truncate max-w-[90px] text-zinc-500 text-[9px]">
                                {mem.department}
                              </span>
                            )}
                          </div>

                          <div className="mt-2 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => onOpenGenerator(mem)}
                              className="flex-1 py-1 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] font-mono font-medium flex items-center justify-center gap-1 transition cursor-pointer border border-zinc-700/60"
                            >
                              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                              <span>AI Wish</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onSendWhatsApp(mem)}
                              disabled={isSendingWhatsApp}
                              className="flex-1 py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-[10px] font-mono flex items-center justify-center gap-1 transition cursor-pointer shadow-sm disabled:opacity-50"
                            >
                              <Send className="w-2.5 h-2.5" />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-4 text-center text-xs font-mono text-zinc-600">
                      No birthdays recorded
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. INTERACTIVE CELEBRANT DETAIL DRAWER / POPUP MODAL */}
      <AnimatePresence>
        {activeMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-zinc-950 border border-zinc-800 p-6 shadow-2xl shadow-black overflow-hidden font-mono"
            >
              {/* Top Colorful Accent Line */}
              <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{ backgroundColor: activeMember.theme?.innerBg || '#10b981' }}
              />

              {/* Close Button */}
              <button
                onClick={() => setActiveMember(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 mt-2">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-xl shrink-0 overflow-hidden border-2 border-white/30 bg-zinc-900"
                  style={{ backgroundColor: activeMember.theme?.innerBg || '#10b981' }}
                >
                  {activeMember.imageUrl ? (
                    <img
                      src={formatProfileImageUrl(activeMember.imageUrl)}
                      alt={activeMember.name}
                      className="w-full h-full object-cover object-center aspect-square rounded-2xl block select-none [image-rendering:-webkit-optimize-contrast] [image-rendering:high-quality] [transform:translateZ(0)]"
                      loading="eager"
                      decoding="sync"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    activeMember.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white truncate">{activeMember.name}</h3>
                    {activeMember.isToday && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-zinc-950 animate-pulse">
                        TODAY!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 truncate">
                    {activeMember.designation} {activeMember.department ? `• ${activeMember.department}` : ''}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="mt-5 space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between">
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Cake className="w-3.5 h-3.5 text-amber-400" /> Birthday:
                  </span>
                  <span className="font-bold text-white">
                    {activeMember.formattedBirthday} ({MONTH_NAMES[activeMember.parsedMonth]?.full || 'Celebration'})
                  </span>
                </div>

                {activeMember.whatsapp && (
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp:
                    </span>
                    <span className="font-bold text-emerald-400">{activeMember.whatsapp}</span>
                  </div>
                )}

                {activeMember.email && (
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between">
                    <span className="text-zinc-400 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-zinc-400" /> Email:
                    </span>
                    <span className="font-semibold text-zinc-200 truncate max-w-[200px]">{activeMember.email}</span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onOpenGenerator(activeMember);
                    setActiveMember(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-zinc-700"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Wish</span>
                </button>

                <button
                  onClick={() => {
                    onSendWhatsApp(activeMember);
                    setActiveMember(null);
                  }}
                  disabled={isSendingWhatsApp}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Wish</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
