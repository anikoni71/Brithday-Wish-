import React, { useState, useMemo } from 'react';
import {
  X,
  Send,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail,
  Clock,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Layers,
  ListFilter,
  Users,
  PartyPopper,
  CalendarDays,
  Compass,
  Info,
  Check,
  Flame,
  UtensilsCrossed,
  TrendingUp,
  Copy,
  CalendarCheck,
  Coffee,
  Award,
} from 'lucide-react';
import { TeamMember, TwilioConfig } from '../types';
import {
  getUpcomingCelebrantsPlanningList,
  CelebrantPlanningItem,
  getNearbySpecialDayForBirthday,
  getUpcomingGlobalSpecialDays,
  UpcomingSpecialDayItem,
  parseBirthdayDate,
  calculateCelebrationIntensity,
  WeeklyCelebrationIntensity,
  CelebrationIntensityAnalysis,
} from '../utils/dateUtils';

interface AdminAdvanceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  twilioConfig: TwilioConfig;
  onRefreshLogs?: () => void;
}

type ViewMode = 'combined' | 'checklist';
type TimelineFilter = 'all' | 'birthdays' | 'holidays';

interface TimelineItem {
  id: string;
  key: string;
  type: 'birthday' | 'holiday';
  daysRemaining: number;
  timeframeLabel: string;
  dateFormatted: string;
  birthdayItem?: CelebrantPlanningItem;
  holidayItem?: UpcomingSpecialDayItem;
  coincidentSpecialDay?: ReturnType<typeof getNearbySpecialDayForBirthday>;
  nearbyCelebrants?: TeamMember[];
}

export const AdminAdvanceAlertModal: React.FC<AdminAdvanceAlertModalProps> = ({
  isOpen,
  onClose,
  members,
  twilioConfig,
  onRefreshLogs,
}) => {
  const [adminPhone, setAdminPhone] = useState<string>(() => {
    return localStorage.getItem('admin_planning_whatsapp') || '+880163529951';
  });
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem('admin_planning_email') || 'admin.ie@kdsgroup.net';
  });
  const [advanceDays, setAdvanceDays] = useState<number>(7);
  const [viewMode, setViewMode] = useState<ViewMode>('combined');
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('all');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | 'all'>('all');
  const [copiedProposal, setCopiedProposal] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [resultStatus, setResultStatus] = useState<{
    success: boolean;
    message: string;
    count: number;
    details?: string;
  } | null>(null);

  // Compute upcoming celebrants planning list
  const planningList: CelebrantPlanningItem[] = useMemo(() => {
    return getUpcomingCelebrantsPlanningList(members, advanceDays);
  }, [members, advanceDays]);

  // Compute upcoming public holidays & special days within the selected horizon
  const upcomingHolidays: UpcomingSpecialDayItem[] = useMemo(() => {
    return getUpcomingGlobalSpecialDays(new Date(), 25, advanceDays);
  }, [advanceDays]);

  // Map celebrants near each special day (within 3 days)
  const celebrantsByHoliday = useMemo(() => {
    const map: Record<string, TeamMember[]> = {};
    for (const h of upcomingHolidays) {
      map[h.id] = members.filter((m) => {
        const parsed = parseBirthdayDate(m.birthday);
        if (!parsed) return false;
        if (parsed.month === h.month) {
          return Math.abs(parsed.day - h.day) <= 3;
        }
        return false;
      });
    }
    return map;
  }, [upcomingHolidays, members]);

  // Compute Celebration Intensity Metric and optimal gathering recommendations
  const intensityAnalysis: CelebrationIntensityAnalysis = useMemo(() => {
    return calculateCelebrationIntensity(members, advanceDays, new Date());
  }, [members, advanceDays]);

  // Unified Chronological Timeline
  const combinedTimeline = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = [];

    // 1. Add employee birthdays
    for (const b of planningList) {
      const specialDayMatch = getNearbySpecialDayForBirthday(b.birthday, 3);
      items.push({
        id: `bday-${b.id || b.sl}-${b.name}`,
        key: `bday-${b.id || b.sl}`,
        type: 'birthday',
        daysRemaining: b.daysRemaining,
        timeframeLabel: b.timeframeLabel,
        dateFormatted: b.birthday,
        birthdayItem: b,
        coincidentSpecialDay: specialDayMatch,
      });
    }

    // 2. Add public holidays & special days
    for (const h of upcomingHolidays) {
      const nearMembers = celebrantsByHoliday[h.id] || [];
      items.push({
        id: `holiday-${h.id}-${h.targetYear}`,
        key: `holiday-${h.id}`,
        type: 'holiday',
        daysRemaining: h.daysRemaining,
        timeframeLabel: h.timeframeLabel,
        dateFormatted: h.dateFormatted,
        holidayItem: h,
        nearbyCelebrants: nearMembers,
      });
    }

    // Sort chronologically by daysRemaining ascending
    return items.sort((a, b) => {
      if (a.daysRemaining !== b.daysRemaining) {
        return a.daysRemaining - b.daysRemaining;
      }
      // Put holidays first if on same day for better scheduling context
      return a.type === 'holiday' ? -1 : 1;
    });
  }, [planningList, upcomingHolidays, celebrantsByHoliday]);

  // Filtered timeline (incorporating type filter + week cluster filter)
  const filteredTimeline = useMemo(() => {
    let list = combinedTimeline;

    if (timelineFilter === 'birthdays') {
      list = list.filter((t) => t.type === 'birthday');
    } else if (timelineFilter === 'holidays') {
      list = list.filter((t) => t.type === 'holiday');
    }

    if (selectedWeekFilter !== 'all') {
      const startOffset = (selectedWeekFilter - 1) * 7;
      const endOffset = selectedWeekFilter * 7 - 1;
      list = list.filter((t) => t.daysRemaining >= startOffset && t.daysRemaining <= endOffset);
    }

    return list;
  }, [combinedTimeline, timelineFilter, selectedWeekFilter]);

  // Joint events counter (birthdays coinciding directly with a special day)
  const jointEventsCount = useMemo(() => {
    return planningList.filter((b) => {
      const match = getNearbySpecialDayForBirthday(b.birthday, 1);
      return match && match.relationship === 'exact';
    }).length;
  }, [planningList]);

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    localStorage.setItem('admin_planning_whatsapp', adminPhone);
    localStorage.setItem('admin_planning_email', adminEmail);
  };

  const handleCopyProposal = () => {
    if (!intensityAnalysis.recommendedGathering) return;
    const g = intensityAnalysis.recommendedGathering;
    const text = `📋 [EXECUTIVE EVENT BRIEFING & TEAM LUNCH PROPOSAL]\n` +
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

  const handleDispatchPlanningAlert = async () => {
    handleSaveSettings();
    setIsSending(true);
    setResultStatus(null);

    try {
      const res = await fetch('/api/admin-advance-planning-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          members,
          adminWhatsApp: adminPhone,
          adminEmail: adminEmail,
          advanceDays,
          accountSid: twilioConfig.accountSid,
          authToken: twilioConfig.authToken,
        }),
      });

      const data = await res.json();
      setResultStatus({
        success: data.success,
        message: data.message || 'Advance Planning Alert Dispatched Successfully',
        count: data.count || 0,
        details: data.waSummary,
      });

      if (onRefreshLogs) {
        onRefreshLogs();
      }
    } catch (e: any) {
      setResultStatus({
        success: false,
        message: e.message || 'Failed to dispatch Advance Planning Alert',
        count: 0,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white">
                  Leadership Advance Event & Birthday Briefing
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                  Planning Horizon: {advanceDays} Days
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Coordinated timeline of employee birthdays and public festive holidays for executive event scheduling
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 bg-slate-50/30">
          
          {/* Admin Target Configuration Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Target Recipient & Horizon Window
              </h4>
              <span className="text-[11px] text-slate-500">Auto-saved locally</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  Admin WhatsApp Number:
                </label>
                <input
                  type="text"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  placeholder="+880163529951"
                  className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-indigo-600" />
                  Admin Notification Email:
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin.ie@kdsgroup.net"
                  className="w-full px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  Scan Horizon Window:
                </label>
                <select
                  value={advanceDays}
                  onChange={(e) => setAdvanceDays(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-600 focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  <option value={1}>Tomorrow Only (1 Day)</option>
                  <option value={3}>Next 3 Days (Standard)</option>
                  <option value={7}>Next 7 Days (1 Week - Recommended)</option>
                  <option value={14}>Next 14 Days (Bi-Weekly)</option>
                  <option value={30}>Next 30 Days (Full Month Horizon)</option>
                </select>
              </div>
            </div>
          </div>

          {/* View Toggle Bar & Metric Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              {/* Primary View Toggle (Combined Timeline vs Checklist) */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
                <button
                  type="button"
                  onClick={() => setViewMode('combined')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'combined'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <CalendarDays className="w-3.5 h-3.5 text-amber-400" />
                  Combined Event Timeline
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${viewMode === 'combined' ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-200 text-slate-700'}`}>
                    {combinedTimeline.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('checklist')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'checklist'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Celebrants Checklist Only
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${viewMode === 'checklist' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-slate-200 text-slate-700'}`}>
                    {planningList.length}
                  </span>
                </button>
              </div>

              {/* Quick Horizon Summary Chips */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-semibold inline-flex items-center gap-1">
                  🎂 <strong>{planningList.length}</strong> Birthday{planningList.length === 1 ? '' : 's'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 font-semibold inline-flex items-center gap-1">
                  🗓️ <strong>{upcomingHolidays.length}</strong> Holiday{upcomingHolidays.length === 1 ? '' : 's'}
                </span>
                {jointEventsCount > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold inline-flex items-center gap-1 animate-pulse">
                    ✨ <strong>{jointEventsCount}</strong> Coincident Date{jointEventsCount === 1 ? '' : 's'}
                  </span>
                )}
              </div>
            </div>

            {/* Sub-Filter for Combined Timeline */}
            {viewMode === 'combined' && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <ListFilter className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Filter Feed:</span>
                  {(['all', 'birthdays', 'holidays'] as TimelineFilter[]).map((filterKey) => (
                    <button
                      key={filterKey}
                      onClick={() => setTimelineFilter(filterKey)}
                      className={`px-2.5 py-0.8 rounded-md text-[11px] font-semibold transition cursor-pointer capitalize ${
                        timelineFilter === filterKey
                          ? 'bg-slate-800 text-white font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {filterKey === 'all' ? 'All Events' : filterKey === 'birthdays' ? '🎂 Birthdays' : '🎉 Holidays'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {selectedWeekFilter !== 'all' && (
                    <button
                      onClick={() => setSelectedWeekFilter('all')}
                      className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition cursor-pointer"
                    >
                      Clear Week Filter (Showing Week {selectedWeekFilter})
                    </button>
                  )}
                  <span className="text-[11px] text-slate-400 italic">
                    Chronological order
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* CELEBRATION INTENSITY & OPTIMAL TEAM GATHERING ENGINE */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-5 shadow-lg border border-slate-700/80 space-y-4">
            {/* Header with Intensity Level and Score */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  intensityAnalysis.overallLevel === 'peak'
                    ? 'bg-rose-500/25 border border-rose-400/40 text-rose-400'
                    : intensityAnalysis.overallLevel === 'high'
                    ? 'bg-amber-500/25 border border-amber-400/40 text-amber-400'
                    : intensityAnalysis.overallLevel === 'moderate'
                    ? 'bg-indigo-500/25 border border-indigo-400/40 text-indigo-300'
                    : 'bg-slate-700/40 border border-slate-600/40 text-slate-300'
                }`}>
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                      Celebration Intensity Metric
                    </h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      intensityAnalysis.overallLevel === 'peak'
                        ? 'bg-rose-500 text-white shadow-xs'
                        : intensityAnalysis.overallLevel === 'high'
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : intensityAnalysis.overallLevel === 'moderate'
                        ? 'bg-indigo-400 text-slate-950'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {intensityAnalysis.overallLevel === 'peak' && '🔥 Peak Celebration Week'}
                      {intensityAnalysis.overallLevel === 'high' && '⚡ High Event Intensity'}
                      {intensityAnalysis.overallLevel === 'moderate' && '✨ Moderate Intensity'}
                      {intensityAnalysis.overallLevel === 'low' && '🌱 Steady Operations'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Analyzes weekly event clusters combining birthdays and public holidays to recommend prime dates for team lunches
                  </p>
                </div>
              </div>

              {/* Intensity Score Meter & Horizon Gauge */}
              <div className="flex items-center gap-3 bg-white/10 border border-white/15 px-3 py-2 rounded-xl self-start sm:self-auto">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Intensity Score</div>
                  <div className="text-base font-black font-mono text-amber-300">
                    {intensityAnalysis.overallScore}<span className="text-xs text-slate-400 font-normal">/100</span>
                  </div>
                </div>
                <div className="w-16 bg-white/15 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      intensityAnalysis.overallScore >= 50
                        ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                        : intensityAnalysis.overallScore >= 20
                        ? 'bg-gradient-to-r from-indigo-400 to-amber-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.max(12, intensityAnalysis.overallScore)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Optimal Date Recommendation Highlight Box */}
            {intensityAnalysis.recommendedGathering && (
              <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-indigo-500/15 border border-amber-400/30 rounded-xl p-3.5 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        Suggested Optimal Gathering / Team Lunch Date
                      </span>
                      <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                        <span>{intensityAnalysis.recommendedGathering.dateFormatted}</span>
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-white/15 text-amber-200">
                          {intensityAnalysis.recommendedGathering.targetWeekLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyProposal}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
                  >
                    {copiedProposal ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Proposal Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-300" />
                        <span>Copy Lunch Proposal Note</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-slate-200 bg-black/20 p-2.5 rounded-lg border border-white/5 space-y-1">
                  <p className="leading-relaxed">
                    <strong className="text-amber-300">💡 Executive Rationale: </strong>
                    {intensityAnalysis.recommendedGathering.strategicRationale}
                  </p>
                  <div className="pt-1 border-t border-white/10 flex items-center gap-3 text-[10px] text-slate-300 flex-wrap">
                    <span>🎂 <strong>Honoring:</strong> {intensityAnalysis.recommendedGathering.celebrantsSummary}</span>
                    {intensityAnalysis.recommendedGathering.holidaysSummary !== 'None in peak week' && (
                      <span>🗓️ <strong>Holidays:</strong> {intensityAnalysis.recommendedGathering.holidaysSummary}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Celebration Heatmap Breakdown Grid */}
            <div className="space-y-2 pt-1 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  Weekly Volume & Cluster Breakdown ({intensityAnalysis.weeks.length} Weeks Analyzed)
                </span>
                <span className="text-[10px] text-slate-400">Click any week to focus timeline</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {intensityAnalysis.weeks.map((w) => {
                  const isSelected = selectedWeekFilter === w.weekNumber;
                  const isPeak = intensityAnalysis.peakWeek?.weekNumber === w.weekNumber;

                  return (
                    <button
                      key={w.weekNumber}
                      type="button"
                      onClick={() => setSelectedWeekFilter(isSelected ? 'all' : w.weekNumber)}
                      className={`text-left p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'bg-white/20 border-amber-400 ring-2 ring-amber-400/40 shadow-md'
                          : isPeak
                          ? 'bg-white/10 border-amber-400/50 hover:bg-white/15'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 w-full">
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          Week {w.weekNumber}
                          {isPeak && <span className="text-amber-300" title="Peak Celebration Week">🔥</span>}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                          w.intensityLevel === 'peak'
                            ? 'bg-rose-500 text-white'
                            : w.intensityLevel === 'high'
                            ? 'bg-amber-400 text-slate-950'
                            : w.intensityLevel === 'moderate'
                            ? 'bg-indigo-400 text-slate-950'
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {w.intensityLevel}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-300 font-mono">
                        {w.startDateFormatted} - {w.endDateFormatted}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-semibold">
                        <span className="inline-flex items-center gap-0.5 text-amber-300">
                          🎂 {w.birthdays.length}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-indigo-300">
                          🗓️ {w.holidays.length}
                        </span>
                        {w.coincidentCount > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-emerald-300">
                            ✨ {w.coincidentCount}
                          </span>
                        )}
                      </div>

                      <div className="pt-1.5 border-t border-white/10 text-[10px] text-slate-300 flex items-center justify-between w-full">
                        <span className="truncate text-slate-200 flex items-center gap-1">
                          <Coffee className="w-3 h-3 text-amber-300 shrink-0" />
                          {w.suggestedLunchDate.dayFormatted} ({w.suggestedLunchDate.weekday.slice(0, 3)})
                        </span>
                        <span className="text-[9px] font-bold text-amber-300">
                          {isSelected ? 'Active' : 'Filter'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MAIN VIEW: COMBINED TIMELINE */}
          {viewMode === 'combined' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  Chronological Event Timeline ({filteredTimeline.length} Events in Next {advanceDays} Days)
                </h4>
                <span className="text-[11px] font-medium text-slate-500">
                  Ideal for scheduling team lunches, meetings & group celebrations
                </span>
              </div>

              {filteredTimeline.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
                  <Clock className="w-9 h-9 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">
                    No events or public holidays found in the next {advanceDays} days.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Try expanding the scan horizon window to 14 or 30 days above.
                  </p>
                </div>
              ) : (
                <div className="relative pl-4 sm:pl-6 border-l-2 border-slate-200 space-y-4 my-2">
                  {filteredTimeline.map((item) => {
                    const isToday = item.daysRemaining === 0;
                    const isTomorrow = item.daysRemaining === 1;

                    if (item.type === 'birthday' && item.birthdayItem) {
                      const b = item.birthdayItem;
                      const spec = item.coincidentSpecialDay;

                      return (
                        <div key={item.id} className="relative group">
                          {/* Timeline node dot */}
                          <div className={`absolute -left-[23px] sm:-left-[31px] top-4 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                            isToday ? 'border-amber-500 bg-amber-500' : 'border-indigo-500'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-indigo-600'}`} />
                          </div>

                          {/* Birthday Event Card */}
                          <div className="bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 shadow-2xs transition space-y-2.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                                  🎂
                                </span>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <strong className="text-xs font-bold text-slate-900">
                                      {b.name}
                                    </strong>
                                    <span className="text-[11px] font-medium text-slate-500">
                                      ({b.designation} • {b.department})
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                    ID: {b.id || b.sl} • Birthday: <strong className="text-slate-700">{b.birthday}</strong>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                                {spec && (
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shadow-2xs ${
                                      spec.relationship === 'exact'
                                        ? spec.specialDay.badgeColor
                                        : 'bg-slate-100 text-slate-700 border-slate-200'
                                    }`}
                                    title={`${spec.subText} • Theme: ${spec.specialDay.greetingTheme}`}
                                  >
                                    {spec.label}
                                  </span>
                                )}
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    isToday
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                                      : isTomorrow
                                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                      : 'bg-indigo-50 text-indigo-800'
                                  }`}
                                >
                                  {item.timeframeLabel}
                                </span>
                              </div>
                            </div>

                            {/* Verification Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                              <div className={`p-1.5 px-2.5 rounded-lg border flex items-center gap-1.5 ${
                                b.hasWhatsApp
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                  : 'bg-rose-50 border-rose-200 text-rose-800'
                              }`}>
                                {b.hasWhatsApp ? (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                ) : (
                                  <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                                )}
                                <span className="truncate">
                                  <strong>WhatsApp:</strong> {b.hasWhatsApp ? b.whatsapp : 'Missing'}
                                </span>
                              </div>

                              <div className={`p-1.5 px-2.5 rounded-lg border flex items-center gap-1.5 ${
                                b.hasEmail
                                  ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
                                  : 'bg-amber-50 border-amber-200 text-amber-800'
                              }`}>
                                {b.hasEmail ? (
                                  <CheckCircle2 className="w-3 h-3 text-indigo-600 shrink-0" />
                                ) : (
                                  <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                                )}
                                <span className="truncate">
                                  <strong>Email:</strong> {b.hasEmail ? b.email : 'Missing'}
                                </span>
                              </div>

                              <div className="p-1.5 px-2.5 rounded-lg border bg-slate-50 border-slate-200 text-slate-700 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                                <span className="truncate">
                                  <strong>Wish:</strong> {b.hasCustomMessage ? 'Custom Message' : 'Team Default'}
                                </span>
                              </div>
                            </div>

                            {/* Wish message snippet */}
                            <div className="bg-slate-50 border-l-2 border-amber-400 rounded-r-lg p-2 text-[11px] text-slate-600 italic">
                              "{b.resolvedMessage}"
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (item.type === 'holiday' && item.holidayItem) {
                      const h = item.holidayItem;
                      const nearMembers = item.nearbyCelebrants || [];

                      return (
                        <div key={item.id} className="relative group">
                          {/* Timeline node dot for holiday */}
                          <div className="absolute -left-[23px] sm:-left-[31px] top-4 w-4 h-4 rounded-full border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center shadow-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>

                          {/* Public Holiday Event Card */}
                          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 shadow-md space-y-2.5 border border-slate-700">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <span className="text-2xl select-none" role="img" aria-label={h.name}>
                                  {h.icon}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h5 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                                      {h.name}
                                    </h5>
                                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-white/10 text-amber-300 border border-white/15 uppercase">
                                      {h.category}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-300 mt-0.5">
                                    {h.dateFormatted} ({h.targetYear}) • {h.description}
                                  </p>
                                </div>
                              </div>

                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-auto uppercase tracking-wider ${
                                  isToday
                                    ? 'bg-amber-400 text-slate-950 font-bold animate-pulse'
                                    : isTomorrow
                                    ? 'bg-emerald-400 text-slate-950'
                                    : 'bg-white/10 text-white border border-white/20'
                                }`}
                              >
                                {item.timeframeLabel}
                              </span>
                            </div>

                            {/* Recommended Wish Theme & Team Scheduling Guidance */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-[11px] space-y-1.5">
                              <div className="flex items-start gap-1.5 text-slate-200">
                                <span className="text-amber-300 font-bold shrink-0">💡 Festive Theme:</span>
                                <span>"{h.greetingTheme}"</span>
                              </div>

                              {nearMembers.length > 0 ? (
                                <div className="pt-1.5 border-t border-white/10 flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-emerald-300 inline-flex items-center gap-1 text-[11px]">
                                    <Users className="w-3 h-3 text-emerald-400" />
                                    {nearMembers.length} Team Celebrant{nearMembers.length > 1 ? 's' : ''} in this Holiday Window:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {nearMembers.map((nm) => (
                                      <span
                                        key={nm.id || nm.sl}
                                        className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-medium text-amber-200 border border-white/10"
                                      >
                                        🎂 {nm.name} ({nm.birthday})
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-[10px] text-slate-400">
                                  No team member birthdays coincide with this holiday window.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ALTERNATIVE VIEW: CELEBRANTS CHECKLIST ONLY */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Upcoming Celebrants Checklist ({planningList.length} Found)
                </h4>
                <span className="text-[11px] font-semibold text-slate-500">
                  Window: Next {advanceDays} Day{advanceDays > 1 ? 's' : ''}
                </span>
              </div>

              {planningList.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-2xl border border-slate-200">
                  <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">
                    No birthdays detected in the next {advanceDays} days.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    All morning 8:00 AM triggers are in standby mode.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white">
                  {planningList.map((item, idx) => {
                    const specialDayMatch = getNearbySpecialDayForBirthday(item.birthday, 4);

                    return (
                      <div key={item.id || idx} className="p-4 space-y-2.5 hover:bg-slate-50/50 transition">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <strong className="text-xs font-bold text-slate-900">
                              {item.name}
                            </strong>
                            <span className="text-[11px] text-slate-500">
                              ({item.designation} • {item.department})
                            </span>
                            {specialDayMatch && (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border shadow-2xs ${
                                  specialDayMatch.relationship === 'exact'
                                    ? specialDayMatch.specialDay.badgeColor
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                                title={specialDayMatch.subText}
                              >
                                {specialDayMatch.label}
                              </span>
                            )}
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-auto ${
                            item.daysRemaining === 0
                              ? 'bg-amber-100 text-amber-800'
                              : item.daysRemaining === 1
                              ? 'bg-amber-50 text-amber-900 border border-amber-300 font-bold'
                              : 'bg-blue-50 text-blue-800'
                          }`}>
                            📅 {item.birthday} ({item.timeframeLabel})
                          </span>
                        </div>

                        {/* Verification Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                          <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                            item.hasWhatsApp 
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                              : 'bg-rose-50 border-rose-200 text-rose-800'
                          }`}>
                            {item.hasWhatsApp ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            )}
                            <span>
                              <strong>Col J (WhatsApp):</strong> {item.hasWhatsApp ? item.whatsapp : 'Missing!'}
                            </span>
                          </div>

                          <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                            item.hasEmail
                              ? 'bg-indigo-50/60 border-indigo-200 text-indigo-900'
                              : 'bg-amber-50 border-amber-200 text-amber-800'
                          }`}>
                            {item.hasEmail ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                            <span>
                              <strong>Col H (Email):</strong> {item.hasEmail ? item.email : 'Missing'}
                            </span>
                          </div>

                          <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${
                            item.hasCustomMessage
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                              : 'bg-amber-50 border-amber-200 text-amber-800'
                          }`}>
                            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>
                              <strong>Col K (Wish):</strong> {item.hasCustomMessage ? 'Customized' : 'Standard Default'}
                            </span>
                          </div>
                        </div>

                        {/* Resolved Wish Message Preview */}
                        <div className="bg-slate-50 border-l-2 border-amber-500 rounded-r-xl p-2.5 text-[11px] text-slate-700 italic">
                          "{item.resolvedMessage}"
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Actionable Plan Guidance */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 space-y-1">
            <p className="font-bold flex items-center gap-1 text-blue-900">
              📝 Executive Scheduling Strategy:
            </p>
            <p className="text-[11px] text-blue-800">
              • <strong>Team Event Alignment:</strong> If employee birthdays fall near public holidays, leadership can schedule combined group luncheons or festive meetings.
            </p>
            <p className="text-[11px] text-blue-800">
              • <strong>Contact Verification:</strong> Verify Column J WhatsApp numbers before automated 8:00 AM dispatch runs.
            </p>
          </div>

          {/* Dispatch Result Status Banner */}
          {resultStatus && (
            <div className={`p-4 rounded-2xl border text-xs ${
              resultStatus.success 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                {resultStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                {resultStatus.message}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between gap-3 flex-wrap">
          <div className="text-[11px] text-slate-500">
            Dispatches WhatsApp to <strong className="font-mono text-slate-700">{adminPhone}</strong> + Email to <strong className="text-slate-700">{adminEmail}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={handleDispatchPlanningAlert}
              disabled={isSending || planningList.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Dispatching Multi-Channel Alert...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Send Advance Planning Alert ({adminPhone})
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
