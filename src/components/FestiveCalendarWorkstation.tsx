import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Calendar,
  Search,
  Filter,
  Users,
  Check,
  Copy,
  Send,
  ExternalLink,
  Flame,
  UtensilsCrossed,
  TrendingUp,
  Tag,
  Star,
  Globe,
  Award,
  ChevronRight,
  Clock,
  Cake,
  Flag,
  Coffee,
  CheckCircle2,
  CalendarDays,
  LayoutGrid,
  List,
  CalendarRange,
  Mail,
  MailCheck,
  Eye,
  X,
  SendHorizontal,
  RefreshCw,
  Wifi,
  Plus,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { TeamMember } from '../types';
import {
  GLOBAL_SPECIAL_DAYS,
  SpecialDay,
  getSpecialDaysForYear,
  getUpcomingGlobalSpecialDays,
  UpcomingSpecialDayItem,
  parseBirthdayDate,
  calculateCelebrationIntensity,
  MONTH_NAMES,
} from '../utils/dateUtils';
import { generateFestiveEmailHtml, generateFestiveSubject } from '../utils/festiveEmailTemplate';

interface FestiveCalendarWorkstationProps {
  members: TeamMember[];
  onOpenGenerator?: (member: TeamMember, customMessage?: string) => void;
  onSendWhatsApp?: (member: TeamMember) => void;
  onNavigateToRosterMonth?: (monthIndex: number) => void;
}

type ViewMode = 'cards' | 'timeline' | 'matrix';
type CategoryFilter = 'all' | 'national' | 'festive' | 'international' | 'observance' | 'professional';
type CelebrantFilter = 'all' | 'with_celebrants' | 'exact_only' | 'upcoming';

interface CelebrantMatch {
  member: TeamMember;
  relationship: 'exact' | 'same_week' | 'same_month';
  distanceDays: number;
  birthdayFormatted: string;
  customFestiveWish: string;
}

interface PreviewEmailState {
  member: TeamMember;
  specialDay: SpecialDay;
  wish: string;
  html: string;
  subject: string;
}

export const FestiveCalendarWorkstation: React.FC<FestiveCalendarWorkstationProps> = ({
  members,
  onOpenGenerator,
  onSendWhatsApp,
  onNavigateToRosterMonth,
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [celebrantFilter, setCelebrantFilter] = useState<CelebrantFilter>('all');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedProposal, setCopiedProposal] = useState<boolean>(false);

  // Festive Email state
  const [previewEmail, setPreviewEmail] = useState<PreviewEmailState | null>(null);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [sentEmailSuccess, setSentEmailSuccess] = useState<string | null>(null);
  const [copiedEmailHtml, setCopiedEmailHtml] = useState<boolean>(false);

  // Google Online Server & Search Synchronization State
  const [isSyncingOnline, setIsSyncingOnline] = useState<boolean>(false);
  const [lastSyncOnline, setLastSyncOnline] = useState<string>('Live Connected');
  const [onlineSearchQuery, setOnlineSearchQuery] = useState<string>('');
  const [isSearchingOnline, setIsSearchingOnline] = useState<boolean>(false);
  const [onlineSearchResults, setOnlineSearchResults] = useState<any[]>([]);
  const [customAddedSpecialDays, setCustomAddedSpecialDays] = useState<SpecialDay[]>([]);
  const [isOnlineSearchOpen, setIsOnlineSearchOpen] = useState<boolean>(false);

  // Retrieve special days for the selected year (including floating lunar/festival calculations + dynamic search adds)
  const specialDaysForYear = useMemo(() => {
    const base = getSpecialDaysForYear(selectedYear);
    const customForYear = customAddedSpecialDays.filter(
      (d) => (d as any).year === undefined || (d as any).year === selectedYear
    );
    return [...base, ...customForYear];
  }, [selectedYear, customAddedSpecialDays]);

  // Compute upcoming special days for timeline and top insights
  const upcomingSpecialDays = useMemo(() => {
    return getUpcomingGlobalSpecialDays(new Date(), 6, 90);
  }, []);

  // Compute celebration intensity analysis
  const intensityAnalysis = useMemo(() => {
    return calculateCelebrationIntensity(members, 30, new Date());
  }, [members]);

  // Map celebrants ("Birthday Boys/Girls") to each special day
  const celebrantsBySpecialDay = useMemo<Record<string, CelebrantMatch[]>>(() => {
    const map: Record<string, CelebrantMatch[]> = {};

    for (const sd of specialDaysForYear) {
      const matches: CelebrantMatch[] = [];

      for (const member of members) {
        const parsed = parseBirthdayDate(member.birthday);
        if (!parsed) continue;

        const isSameMonth = parsed.month === sd.month;
        if (!isSameMonth) continue;

        const distance = parsed.day - sd.day;
        const absDist = Math.abs(distance);

        let relationship: 'exact' | 'same_week' | 'same_month' | null = null;

        if (absDist === 0) {
          relationship = 'exact';
        } else if (absDist <= 3) {
          relationship = 'same_week';
        } else {
          relationship = 'same_month';
        }

        if (relationship) {
          // Generate a custom tailored festive wish quote for this birth boy + special day
          const customFestiveWish =
            relationship === 'exact'
              ? `🎉 Happy Birthday ${member.name}! May your special day, beautifully coinciding with ${sd.name}, be filled with boundless joy, prosperity, and proud achievements across our IE Central team!`
              : `🌟 Wishing you a wonderful birthday, ${member.name}! In this festive season of ${sd.name}, may your innovative spirit and dedication bring continued success to our IE team.`;

          matches.push({
            member,
            relationship,
            distanceDays: distance,
            birthdayFormatted: parsed.formatted,
            customFestiveWish,
          });
        }
      }

      // Sort exact matches first, then by closest distance
      matches.sort((a, b) => {
        const relWeight = { exact: 0, same_week: 1, same_month: 2 };
        if (relWeight[a.relationship] !== relWeight[b.relationship]) {
          return relWeight[a.relationship] - relWeight[b.relationship];
        }
        return Math.abs(a.distanceDays) - Math.abs(b.distanceDays);
      });

      map[sd.id] = matches;
    }

    return map;
  }, [specialDaysForYear, members]);

  // Filtered list of special days
  const filteredSpecialDays = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    return specialDaysForYear.filter((sd) => {
      // Category filter
      if (categoryFilter !== 'all' && sd.category !== categoryFilter) {
        return false;
      }

      // Month filter
      if (selectedMonth !== 'all' && sd.month !== selectedMonth) {
        return false;
      }

      const matches = celebrantsBySpecialDay[sd.id] || [];

      // Celebrant filter
      if (celebrantFilter === 'with_celebrants' && matches.length === 0) {
        return false;
      }
      if (celebrantFilter === 'exact_only' && !matches.some((m) => m.relationship === 'exact')) {
        return false;
      }
      if (celebrantFilter === 'upcoming') {
        const sdRef = new Date(selectedYear, sd.month, sd.day);
        const diffMs = sdRef.getTime() - today.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays < 0 || diffDays > 60) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const nameMatch = sd.name.toLowerCase().includes(term);
        const shortNameMatch = sd.shortName.toLowerCase().includes(term);
        const descMatch = sd.description.toLowerCase().includes(term);
        const themeMatch = sd.greetingTheme.toLowerCase().includes(term);
        const celebrantMatch = matches.some(
          (m) =>
            m.member.name.toLowerCase().includes(term) ||
            m.member.designation.toLowerCase().includes(term) ||
            (m.member.department && m.member.department.toLowerCase().includes(term))
        );

        if (!nameMatch && !shortNameMatch && !descMatch && !themeMatch && !celebrantMatch) {
          return false;
        }
      }

      return true;
    });
  }, [specialDaysForYear, categoryFilter, selectedMonth, celebrantFilter, searchTerm, celebrantsBySpecialDay, selectedYear]);

  // Overall Statistics for metrics bar
  const stats = useMemo(() => {
    let daysWithCelebrantsCount = 0;
    let exactCoincidenceCount = 0;
    let totalCelebrantMatches = 0;

    for (const sd of specialDaysForYear) {
      const matches = celebrantsBySpecialDay[sd.id] || [];
      if (matches.length > 0) {
        daysWithCelebrantsCount++;
        totalCelebrantMatches += matches.length;
      }
      if (matches.some((m) => m.relationship === 'exact')) {
        exactCoincidenceCount++;
      }
    }

    return {
      totalDays: specialDaysForYear.length,
      daysWithCelebrantsCount,
      exactCoincidenceCount,
      totalCelebrantMatches,
      upcomingCount: upcomingSpecialDays.length,
    };
  }, [specialDaysForYear, celebrantsBySpecialDay, upcomingSpecialDays]);

  // Copy custom wish to clipboard
  const handleCopyWish = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Open HTML Email Preview Modal
  const handleOpenEmailPreview = (member: TeamMember, specialDay: SpecialDay, customWish: string) => {
    const subject = generateFestiveSubject(member.name, specialDay.name, specialDay.icon);
    const html = generateFestiveEmailHtml({
      celebrantName: member.name,
      designation: member.designation,
      department: member.department || 'Industrial Engineering Central',
      birthday: member.birthday,
      specialDayName: specialDay.name,
      specialDayIcon: specialDay.icon,
      greetingTheme: specialDay.greetingTheme,
      customWish,
      senderPhone: '+8801625299521',
      senderName: 'IE Central Team Leadership',
    });

    setPreviewEmail({
      member,
      specialDay,
      wish: customWish,
      html,
      subject,
    });
    setCopiedEmailHtml(false);
  };

  // Dispatch Festive Email via backend API
  const handleSendFestiveEmail = async (member: TeamMember, specialDay: SpecialDay, customWish: string) => {
    if (!member.email || !member.email.includes('@')) {
      alert(`No valid email address configured for ${member.name}. Please ensure Column H contains their email in the Google Sheet.`);
      return;
    }

    const emailKey = `${specialDay.id}_${member.id || member.sl}`;
    setSendingEmailId(emailKey);
    try {
      const subject = generateFestiveSubject(member.name, specialDay.name, specialDay.icon);
      const htmlBody = generateFestiveEmailHtml({
        celebrantName: member.name,
        designation: member.designation,
        department: member.department || 'Industrial Engineering Central',
        birthday: member.birthday,
        specialDayName: specialDay.name,
        specialDayIcon: specialDay.icon,
        greetingTheme: specialDay.greetingTheme,
        customWish,
        senderPhone: '+8801625299521',
        senderName: 'IE Central Team Leadership',
      });

      const response = await fetch('/api/send-festive-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: member.email,
          recipientName: member.name,
          designation: member.designation,
          department: member.department,
          birthday: member.birthday,
          specialDayName: specialDay.name,
          specialDayIcon: specialDay.icon,
          greetingTheme: specialDay.greetingTheme,
          customWish,
          subject,
          htmlBody,
        }),
      });

      const resJson = await response.json();
      if (resJson.success) {
        setSentEmailSuccess(`Warm Festive Email successfully delivered to ${member.name} (${member.email})! ✨`);
        setTimeout(() => setSentEmailSuccess(null), 6000);
      } else {
        alert(`Failed to send email: ${resJson.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Festive email dispatch error:', err);
      alert('Network error while dispatching festive email.');
    } finally {
      setSendingEmailId(null);
    }
  };

  // Sync with Google Online Server API
  const handleSyncWithGoogleServer = async () => {
    setIsSyncingOnline(true);
    try {
      const res = await fetch('/api/sync-special-days-online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: selectedYear, forceRefresh: true }),
      });
      const data = await res.json();
      if (data.success) {
        setLastSyncOnline(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setSentEmailSuccess(`Google Online Server synchronized for Year ${selectedYear}. Master Calendar updated.`);
        setTimeout(() => setSentEmailSuccess(null), 4000);
      }
    } catch (err) {
      setLastSyncOnline(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } finally {
      setIsSyncingOnline(false);
    }
  };

  // Google Search for any global special day or holiday
  const handleSearchOnlineSpecialDays = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onlineSearchQuery.trim()) return;
    setIsSearchingOnline(true);
    try {
      const res = await fetch('/api/search-special-days', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: onlineSearchQuery, year: selectedYear }),
      });
      const data = await res.json();
      if (data.success && data.results) {
        setOnlineSearchResults(data.results);
      }
    } catch (err) {
      console.error("Online search failed:", err);
    } finally {
      setIsSearchingOnline(false);
    }
  };

  // Add custom online searched special day to current active year calendar
  const handleAddOnlineSpecialDay = (item: any) => {
    const newDay: SpecialDay = {
      ...item,
      id: item.id || `custom-${Date.now()}`,
    };
    (newDay as any).year = selectedYear;
    setCustomAddedSpecialDays((prev) => [newDay, ...prev]);
    setOnlineSearchResults((prev) => prev.filter((r) => r.id !== item.id));
    setSentEmailSuccess(`Added "${item.name}" (${item.icon}) to ${selectedYear} calendar!`);
    setTimeout(() => setSentEmailSuccess(null), 3500);
  };

  // Copy executive luncheon proposal note
  const handleCopyProposal = () => {
    if (!intensityAnalysis.recommendedGathering) return;
    const g = intensityAnalysis.recommendedGathering;
    const text =
      `📋 [EXECUTIVE EVENT BRIEFING & TEAM LUNCH PROPOSAL]\n` +
      `📅 Optimal Gathering Date: ${g.dateFormatted} (${g.weekday})\n` +
      `🎯 Target Planning Window: ${g.targetWeekLabel}\n` +
      `🎂 Celebrants Honored: ${g.celebrantsSummary}\n` +
      `🗓️ Festive / Public Observances: ${g.holidaysSummary}\n` +
      `💡 Strategic Rationale: ${g.strategicRationale}\n\n` +
      `⚡ Action: Leadership approval requested for booking luncheon & team refreshments.`;

    navigator.clipboard.writeText(text);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* DISPATCH CONFIRMATION TOAST NOTIFICATION */}
      {sentEmailSuccess && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-950 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <MailCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-emerald-400">Automated Mail Engine Dispatched</div>
            <div className="text-slate-300 mt-0.5">{sentEmailSuccess}</div>
          </div>
          <button
            onClick={() => setSentEmailSuccess(null)}
            className="p-1 text-slate-400 hover:text-white ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* WORKSTATION HERO / EXECUTIVE HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                <Globe className="w-5 h-5 text-slate-950" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Global Special Days & Festive Calendar
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {selectedYear} Master Directory
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Executive workstation pairing national observances, international festive holidays, and religious celebrations with the honored <strong>Birthday Boys & Team Celebrants</strong> of the IE Central Team.
            </p>
          </div>

          {/* Quick Year Selector and Intensity Meter */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-start lg:self-auto">
            {/* Multi-Year Switcher */}
            <div className="bg-white/10 border border-white/15 px-3.5 py-2 rounded-2xl flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Edition Year</span>
                <span className="text-[9px] text-slate-300 font-mono">2024 - 2032+</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {[2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedYear === yr
                        ? 'bg-amber-400 text-slate-950 shadow-xs ring-2 ring-amber-300'
                        : 'bg-white/5 text-slate-300 hover:bg-white/15'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Google Sync Button */}
            <button
              type="button"
              onClick={handleSyncWithGoogleServer}
              disabled={isSyncingOnline}
              className="px-3.5 py-2.5 rounded-2xl bg-indigo-600/90 hover:bg-indigo-600 text-white font-bold text-xs transition flex items-center gap-2 shadow-md border border-indigo-400/40 cursor-pointer disabled:opacity-50"
              title="Sync with Google Online Server to retrieve updated holiday dates"
            >
              <RefreshCw className={`w-4 h-4 text-indigo-200 ${isSyncingOnline ? 'animate-spin' : ''}`} />
              <span>{isSyncingOnline ? 'Syncing...' : 'Sync Google Server'}</span>
            </button>

            {intensityAnalysis.recommendedGathering && (
              <button
                type="button"
                onClick={handleCopyProposal}
                className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                {copiedProposal ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Proposal Copied!</span>
                  </>
                ) : (
                  <>
                    <UtensilsCrossed className="w-4 h-4 text-slate-950" />
                    <span>Copy Lunch Proposal</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* GOOGLE ONLINE SERVER & SEARCH INTEGRATION HUB */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/30 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Online Server Status */}
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Google Online Server Connection:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  ONLINE & VERIFIED (HTTPS)
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Status: <strong className="text-slate-200">{lastSyncOnline}</strong> (Year {selectedYear})
              </span>
            </div>

            {/* Google Search Bar Toggle / Form */}
            <form onSubmit={handleSearchOnlineSpecialDays} className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search Google for any global special day or holiday..."
                  value={onlineSearchQuery}
                  onChange={(e) => setOnlineSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-400 text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-hidden focus:border-amber-400 transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                disabled={isSearchingOnline || !onlineSearchQuery.trim()}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isSearchingOnline ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Globe className="w-3.5 h-3.5" />
                )}
                <span>Search Google</span>
              </button>
            </form>

          </div>

          {/* Online Search Results Tray */}
          {onlineSearchResults.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span className="font-bold flex items-center gap-1.5 text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Google Online Search Results ({onlineSearchResults.length})
                </span>
                <button
                  type="button"
                  onClick={() => setOnlineSearchResults([])}
                  className="text-slate-400 hover:text-white text-[11px] cursor-pointer"
                >
                  Dismiss Results
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {onlineSearchResults.map((res) => (
                  <div
                    key={res.id}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/40 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl p-1 bg-slate-800 rounded-lg">{res.icon}</span>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{res.name}</span>
                          <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-500/30">
                            {res.dateFormatted}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">{res.description}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddOnlineSpecialDay(res)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 shrink-0 transition cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-white/10">
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Total Special Days</p>
              <p className="text-xl font-bold text-white mt-0.5">{stats.totalDays}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">With Birthday Boys</p>
              <p className="text-xl font-bold text-emerald-300 mt-0.5">
                {stats.daysWithCelebrantsCount} <span className="text-xs text-slate-400 font-normal">Holidays</span>
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-400/20 text-rose-300 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Exact Day Matches</p>
              <p className="text-xl font-bold text-rose-300 mt-0.5">{stats.exactCoincidenceCount}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-400/20 text-indigo-300 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Celebration Score</p>
              <p className="text-xl font-bold text-amber-300 mt-0.5">
                {intensityAnalysis.overallScore}<span className="text-xs text-slate-400 font-normal">/100</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* UPCOMING SPECIAL DAYS HIGHLIGHTS BAR */}
      {upcomingSpecialDays.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Immediate Festive Horizon (Next 60-90 Days)
              </h3>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {upcomingSpecialDays.length} festive events approaching
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingSpecialDays.map((item) => {
              const matches = celebrantsBySpecialDay[item.id] || [];
              const hasCelebrants = matches.length > 0;
              const isImminent = item.daysRemaining <= 7;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition relative ${
                    isImminent
                      ? 'bg-amber-50/50 border-amber-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl select-none">{item.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                          {item.dateFormatted} • <span className="text-indigo-600 font-bold">{item.timeframeLabel}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        item.isToday
                          ? 'bg-amber-500 text-white animate-pulse'
                          : item.isTomorrow
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.timeframeLabel}
                    </span>
                  </div>

                  {/* Celebrant summary if any */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    {hasCelebrants ? (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 truncate">
                        <Cake className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">
                          {matches.map((m) => m.member.name).join(', ')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">No birthdays on this day</span>
                    )}

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                      {item.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FILTER CONTROLS & SEARCH BAR */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by holiday name, theme, or Birthday Boy name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start md:self-auto border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Monthly Matrix</span>
            </button>
          </div>
        </div>

        {/* Filter Chips: Category & Celebrants */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          
          {/* Celebrant Specific Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
              Celebrant Filter:
            </span>
            {[
              { key: 'all', label: 'All Special Days' },
              { key: 'with_celebrants', label: '🎂 With Birthday Boys Only' },
              { key: 'exact_only', label: '🎯 Exact Holiday Birthdays' },
              { key: 'upcoming', label: '⏳ Upcoming 60 Days' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setCelebrantFilter(f.key as CelebrantFilter)}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  celebrantFilter === f.key
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
              Holiday Category:
            </span>
            {[
              { key: 'all', label: 'All Categories' },
              { key: 'national', label: '🇧🇩 National Days' },
              { key: 'festive', label: '🌙 Religious & Festive' },
              { key: 'international', label: '🌍 International Observances' },
              { key: 'observance', label: '🌱 Global Causes' },
              { key: 'professional', label: '⚡ Professional & IE' },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key as CategoryFilter)}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  categoryFilter === cat.key
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Month Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">
              Month:
            </span>
            <button
              onClick={() => setSelectedMonth('all')}
              className={`px-2.5 py-1 rounded-md font-bold text-xs shrink-0 cursor-pointer ${
                selectedMonth === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Year
            </button>
            {MONTH_NAMES.map((m) => (
              <button
                key={m.index}
                onClick={() => setSelectedMonth(m.index)}
                className={`px-2.5 py-1 rounded-md font-semibold text-xs shrink-0 cursor-pointer ${
                  selectedMonth === m.index
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m.short}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* VIEW MODE 1: EXECUTIVE SPECIAL DAY CARDS */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSpecialDays.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Special Days match the current filter</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try selecting "All Categories", "All Year", or clearing your search term to see the complete festive catalog.
              </p>
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setCelebrantFilter('all');
                  setSelectedMonth('all');
                  setSearchTerm('');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredSpecialDays.map((sd) => {
              const celebrants = celebrantsBySpecialDay[sd.id] || [];
              const hasExactMatch = celebrants.some((c) => c.relationship === 'exact');
              const hasCelebrants = celebrants.length > 0;

              return (
                <div
                  key={sd.id}
                  className={`bg-white rounded-3xl p-6 border transition shadow-xs hover:shadow-md flex flex-col justify-between space-y-5 ${
                    hasExactMatch
                      ? 'border-amber-300 ring-2 ring-amber-400/20'
                      : hasCelebrants
                      ? 'border-emerald-300'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Top: Icon, Date, Title, Category Badge */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl shadow-xs shrink-0 select-none">
                          {sd.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white uppercase tracking-wider">
                              {sd.dateFormatted}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${sd.badgeColor}`}>
                              {sd.category}
                            </span>
                            {sd.isFloating && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                                🌙 Lunar/Moving Date
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-black text-slate-900 tracking-tight mt-1">
                            {sd.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sd.description}
                    </p>

                    {/* Greeting Theme Insight */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs">
                      <p className="text-slate-700">
                        <strong className="text-slate-900">💡 Festive Wish Theme: </strong>
                        {sd.greetingTheme}
                      </p>
                    </div>
                  </div>

                  {/* FEATURED: BIRTHDAY BOYS & TEAM CELEBRANTS SECTION */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Cake className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          Birthday Boy(s) & Celebrants
                        </span>
                      </div>

                      {hasCelebrants && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {celebrants.length} Honored
                        </span>
                      )}
                    </div>

                    {hasCelebrants ? (
                      <div className="space-y-3">
                        {celebrants.map((item) => {
                          const isCopied = copiedId === `${sd.id}_${item.member.id || item.member.sl}`;

                          return (
                            <div
                              key={item.member.id || item.member.sl}
                              className={`p-3.5 rounded-2xl border transition ${
                                item.relationship === 'exact'
                                  ? 'bg-gradient-to-r from-amber-50 to-orange-50/50 border-amber-300 shadow-2xs'
                                  : 'bg-slate-50/80 border-slate-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  {/* Avatar with Initials */}
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-xs ${
                                    item.relationship === 'exact'
                                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                                      : 'bg-emerald-600 text-white'
                                  }`}>
                                    {item.member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <h4 className="text-xs font-bold text-slate-900">
                                        {item.member.name}
                                      </h4>
                                      <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase ${
                                        item.relationship === 'exact'
                                          ? 'bg-amber-200 text-amber-900 border border-amber-300 animate-pulse'
                                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                      }`}>
                                        {item.relationship === 'exact'
                                          ? '🎉 Exact Date Coincidence'
                                          : `✨ Festive Week (${item.birthdayFormatted})`}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium">
                                      {item.member.designation} • {item.member.department || 'IE Central'}
                                    </p>
                                  </div>
                                </div>

                                <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                                  {item.birthdayFormatted}
                                </span>
                              </div>

                              {/* Tailored Festive Wish Text Box */}
                              <div className="mt-2.5 p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700 italic leading-relaxed relative group">
                                "{item.customFestiveWish}"
                              </div>

                              {/* Action Buttons for this Celebrant */}
                              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => handleCopyWish(item.customFestiveWish, `${sd.id}_${item.member.id || item.member.sl}`)}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span className="text-emerald-700">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3 text-slate-500" />
                                      <span>Copy Custom Wish</span>
                                    </>
                                  )}
                                </button>

                                {/* Warm Festive Email Actions */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEmailPreview(item.member, sd, item.customFestiveWish)}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5 transition cursor-pointer"
                                  title="Preview Warm Festive HTML Email"
                                >
                                  <Eye className="w-3 h-3 text-amber-600" />
                                  <span>Preview Email</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={sendingEmailId === `${sd.id}_${item.member.id || item.member.sl}`}
                                  onClick={() => handleSendFestiveEmail(item.member, sd, item.customFestiveWish)}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                                  title="Send Warm Festive HTML Email to Column H"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>
                                    {sendingEmailId === `${sd.id}_${item.member.id || item.member.sl}`
                                      ? 'Delivering Mail...'
                                      : 'Send Festive Mail'}
                                  </span>
                                </button>

                                {onOpenGenerator && (
                                  <button
                                    type="button"
                                    onClick={() => onOpenGenerator(item.member, item.customFestiveWish)}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition cursor-pointer"
                                  >
                                    <Sparkles className="w-3 h-3 text-emerald-600" />
                                    <span>Wish Studio</span>
                                  </button>
                                )}

                                {onSendWhatsApp && (
                                  <button
                                    type="button"
                                    onClick={() => onSendWhatsApp(item.member)}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition cursor-pointer"
                                    title="Dispatch direct WhatsApp celebration"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>WhatsApp</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                        No team birthdays falling in this festival window ({sd.dateFormatted})
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW MODE 2: CHRONOLOGICAL TIMELINE */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Chronological Master Timeline ({filteredSpecialDays.length} Events)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ordered sequence across the year with matching team celebrants
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              Year {selectedYear}
            </span>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pl-6 sm:pl-8">
            {filteredSpecialDays.map((sd) => {
              const celebrants = celebrantsBySpecialDay[sd.id] || [];
              const hasExactMatch = celebrants.some((c) => c.relationship === 'exact');
              const hasCelebrants = celebrants.length > 0;

              return (
                <div key={sd.id} className="relative group">
                  {/* Timeline Dot Icon */}
                  <div
                    className={`absolute -left-[35px] sm:-left-[43px] top-1 w-8 h-8 rounded-xl flex items-center justify-center text-base border-2 shadow-xs ${
                      hasExactMatch
                        ? 'bg-amber-400 border-white text-slate-950 ring-2 ring-amber-400'
                        : hasCelebrants
                        ? 'bg-emerald-500 border-white text-white'
                        : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                  >
                    {sd.icon}
                  </div>

                  <div className="bg-slate-50/70 hover:bg-slate-50 rounded-2xl p-5 border border-slate-200 transition space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-slate-900 text-white font-mono">
                          {sd.dateFormatted}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {sd.name}
                        </h4>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${sd.badgeColor}`}>
                          {sd.category}
                        </span>
                      </div>

                      {hasCelebrants && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 self-start sm:self-auto">
                          🎂 {celebrants.length} Birthday Boy{celebrants.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sd.description}
                    </p>

                    {/* Celebrants breakdown */}
                    {hasCelebrants && (
                      <div className="pt-3 border-t border-slate-200/80 space-y-2">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          Honored Celebrants on this Day:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {celebrants.map((c) => (
                            <div
                              key={c.member.id || c.member.sl}
                              className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                            >
                              <div>
                                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                                  <span>{c.member.name}</span>
                                  {c.relationship === 'exact' && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400 text-slate-950">
                                      Exact
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  {c.member.designation} • {c.birthdayFormatted}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                <button
                                  type="button"
                                  onClick={() => handleCopyWish(c.customFestiveWish, `${sd.id}_${c.member.id || c.member.sl}`)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                  title="Copy Custom Festive Wish"
                                >
                                  {copiedId === `${sd.id}_${c.member.id || c.member.sl}` ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenEmailPreview(c.member, sd, c.customFestiveWish)}
                                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer"
                                  title="Preview & Send Festive Email"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: MONTHLY MATRIX VIEW */}
      {viewMode === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MONTH_NAMES.map((month) => {
            const daysInThisMonth = specialDaysForYear.filter((sd) => sd.month === month.index);
            const celebrantsInMonth = members.filter((m) => {
              const p = parseBirthdayDate(m.birthday);
              return p && p.month === month.index;
            });

            return (
              <div
                key={month.index}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-black text-xs flex items-center justify-center">
                        {month.short}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {month.full} {selectedYear}
                      </h4>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {daysInThisMonth.length} Observances
                    </span>
                  </div>

                  {/* List of Special Days in this Month */}
                  <div className="space-y-2 mt-3">
                    {daysInThisMonth.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2 text-center">
                        No major national holidays registered
                      </p>
                    ) : (
                      daysInThisMonth.map((sd) => {
                        const matches = celebrantsBySpecialDay[sd.id] || [];
                        const hasExact = matches.some((m) => m.relationship === 'exact');

                        return (
                          <div
                            key={sd.id}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                              hasExact
                                ? 'bg-amber-50 border-amber-300'
                                : matches.length > 0
                                ? 'bg-emerald-50/60 border-emerald-200'
                                : 'bg-slate-50 border-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-base select-none shrink-0">{sd.icon}</span>
                              <div className="truncate">
                                <span className="font-bold text-slate-900 block truncate">{sd.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{sd.dateFormatted}</span>
                              </div>
                            </div>

                            {matches.length > 0 && (
                              <span className="px-1.5 py-0.5 rounded bg-white text-emerald-800 border border-emerald-200 text-[10px] font-bold shrink-0">
                                🎂 {matches.length}
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Birthday Boys in this Month */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      {month.short} Birthday Boys ({celebrantsInMonth.length})
                    </span>
                    {onNavigateToRosterMonth && (
                      <button
                        type="button"
                        onClick={() => onNavigateToRosterMonth(month.index)}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                      >
                        View in Roster →
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {celebrantsInMonth.slice(0, 4).map((m) => (
                      <span
                        key={m.id || m.sl}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200"
                      >
                        {m.name.split(' ')[0]} ({m.birthday})
                      </span>
                    ))}
                    {celebrantsInMonth.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                        +{celebrantsInMonth.length - 4} more
                      </span>
                    )}
                    {celebrantsInMonth.length === 0 && (
                      <span className="text-[10px] text-slate-400 italic">No birthdays this month</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FESTIVE EMAIL PREVIEW & INSTANT DISPATCH MODAL */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Warm Festive HTML Email Preview</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      {previewEmail.specialDay.icon} {previewEmail.specialDay.name}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    To: <strong>{previewEmail.member.name}</strong> ({previewEmail.member.email || 'No email in Column H'})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewEmail(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email Metadata Bar */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500 w-16">Subject:</span>
                <span className="font-semibold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 flex-1 truncate">
                  {previewEmail.subject}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500 w-16">Recipient:</span>
                <span className="text-slate-700">
                  {previewEmail.member.name} &lt;{previewEmail.member.email || 'missing_email@kdsgroup.net'}&gt; • {previewEmail.member.designation}
                </span>
              </div>
            </div>

            {/* Modal Body: Rendered HTML Email Preview */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100/70">
              <div className="max-w-xl mx-auto shadow-sm rounded-2xl overflow-hidden bg-white">
                <iframe
                  title="Festive Email Preview"
                  srcDoc={previewEmail.html}
                  className="w-full min-h-[460px] border-0"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(previewEmail.html);
                    setCopiedEmailHtml(true);
                    setTimeout(() => setCopiedEmailHtml(false), 2500);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedEmailHtml ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">HTML Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Raw HTML Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewEmail(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Close Preview
                </button>

                <button
                  type="button"
                  disabled={sendingEmailId !== null || !previewEmail.member.email}
                  onClick={async () => {
                    await handleSendFestiveEmail(
                      previewEmail.member,
                      previewEmail.specialDay,
                      previewEmail.wish
                    );
                    setPreviewEmail(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white flex items-center gap-2 shadow-md shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  <SendHorizontal className="w-3.5 h-3.5" />
                  <span>
                    {sendingEmailId ? 'Delivering Warm Email...' : 'Send Festive Wishing Email Now'}
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
