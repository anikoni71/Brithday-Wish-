import React, { useState, useMemo } from 'react';
import { TeamMember } from '../types';
import {
  parseBirthMonth,
  checkIsTodayBirthday,
  getUpcomingBirthdayInfo,
  getNearbySpecialDayForBirthday,
  MONTH_NAMES,
} from '../utils/dateUtils';
import { formatProfileImageUrl } from '../utils/imageUtils';
import {
  Search,
  Filter,
  Phone,
  MessageSquare,
  Send,
  Sparkles,
  Check,
  Copy,
  User,
  CheckCircle2,
  Clock,
  CheckSquare,
  Square,
  ShieldCheck,
  Radio,
  X,
  Calendar,
  CalendarClock,
  AlertCircle,
  Building2,
  LayoutList,
  ChevronDown,
  ChevronUp,
  Layers,
  Users,
  Cake,
} from 'lucide-react';

interface RosterTableProps {
  members: TeamMember[];
  onOpenGenerator: (member: TeamMember) => void;
  onSendWhatsApp: (member: TeamMember, messageOverride?: string) => Promise<void>;
  isSending: boolean;
  onUpdateMemberMessage: (idOrSl: string, newMessage: string) => void;
  onToggleWishSent?: (idOrSl: string) => void;
  selectedMonthFilter?: number | null;
  onClearMonthFilter?: () => void;
  externalFilterType?: 'all' | 'today' | 'due_soon' | 'sent_2026' | 'pending' | 'has_wa';
  onFilterChange?: (filter: 'all' | 'today' | 'due_soon' | 'sent_2026' | 'pending' | 'has_wa') => void;
}

const MONTH_SHORT_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const RosterTable: React.FC<RosterTableProps> = ({
  members,
  onOpenGenerator,
  onSendWhatsApp,
  isSending,
  onUpdateMemberMessage,
  onToggleWishSent,
  selectedMonthFilter = null,
  onClearMonthFilter,
  externalFilterType,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [internalFilterType, setInternalFilterType] = useState<'all' | 'today' | 'due_soon' | 'sent_2026' | 'pending' | 'has_wa'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'department'>('list');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [collapsedDepts, setCollapsedDepts] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filterType = externalFilterType || internalFilterType;

  const handleSetFilterType = (newFilter: 'all' | 'today' | 'due_soon' | 'sent_2026' | 'pending' | 'has_wa') => {
    setInternalFilterType(newFilter);
    if (onFilterChange) {
      onFilterChange(newFilter);
    }
  };

  const currentYear = new Date().getFullYear().toString();

  // Filter members based on search, month, status filters, and optional department selection
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const deptName = m.department || 'Central Industrial Engineering';
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.whatsapp.includes(searchTerm);

      if (!matchesSearch) return false;

      if (selectedDeptFilter !== 'all' && deptName !== selectedDeptFilter) {
        return false;
      }

      if (selectedMonthFilter !== null && selectedMonthFilter !== undefined) {
        const birthMonth = parseBirthMonth(m.birthday);
        if (birthMonth !== selectedMonthFilter) return false;
      }

      const isSentThisYear = m.lastSentYear ? m.lastSentYear.toString() === currentYear : false;
      const upcomingInfo = getUpcomingBirthdayInfo(m.birthday, 7);

      if (filterType === 'today') return m.isBirthdayToday || checkIsTodayBirthday(m.birthday);
      if (filterType === 'due_soon') return upcomingInfo.isDueSoon;
      if (filterType === 'sent_2026') return isSentThisYear;
      if (filterType === 'pending') return !isSentThisYear;
      if (filterType === 'has_wa') return Boolean(m.whatsapp && m.whatsapp.trim().length > 0);

      return true;
    });
  }, [members, searchTerm, selectedDeptFilter, selectedMonthFilter, filterType, currentYear]);

  // Overall and Department-level analytics & groupings
  const todayCount = members.filter((m) => m.isBirthdayToday || checkIsTodayBirthday(m.birthday)).length;
  const dueSoonCount = members.filter((m) => getUpcomingBirthdayInfo(m.birthday, 7).isDueSoon).length;
  const sentCount = members.filter((m) => m.lastSentYear ? m.lastSentYear.toString() === currentYear : false).length;

  // Distinct department names list from all members
  const allDepartmentNames = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      set.add(m.department?.trim() || 'Central Industrial Engineering');
    });
    return Array.from(set).sort();
  }, [members]);

  // Group filtered members by Department
  const departmentGroups = useMemo(() => {
    const map = new Map<string, TeamMember[]>();

    // Initialize all departments if selectedDeptFilter is 'all' or just the selected one
    allDepartmentNames.forEach((dept) => {
      if (selectedDeptFilter === 'all' || selectedDeptFilter === dept) {
        map.set(dept, []);
      }
    });

    filteredMembers.forEach((m) => {
      const dept = m.department?.trim() || 'Central Industrial Engineering';
      if (!map.has(dept)) {
        map.set(dept, []);
      }
      map.get(dept)!.push(m);
    });

    return Array.from(map.entries()).map(([deptName, deptMembers]) => {
      const deptAllMembers = members.filter(
        (m) => (m.department?.trim() || 'Central Industrial Engineering') === deptName
      );
      const deptTodayCount = deptAllMembers.filter(
        (m) => m.isBirthdayToday || checkIsTodayBirthday(m.birthday)
      ).length;
      const deptDueSoonCount = deptAllMembers.filter(
        (m) => getUpcomingBirthdayInfo(m.birthday, 7).isDueSoon
      ).length;
      const deptSentCount = deptAllMembers.filter(
        (m) => m.lastSentYear ? m.lastSentYear.toString() === currentYear : false
      ).length;

      return {
        department: deptName,
        members: deptMembers,
        totalHeadcount: deptAllMembers.length,
        todayCount: deptTodayCount,
        dueSoonCount: deptDueSoonCount,
        sentCount: deptSentCount,
        pendingCount: deptAllMembers.length - deptSentCount,
      };
    });
  }, [allDepartmentNames, filteredMembers, members, selectedDeptFilter, currentYear]);

  const toggleDeptCollapse = (deptName: string) => {
    setCollapsedDepts((prev) => ({
      ...prev,
      [deptName]: !prev[deptName],
    }));
  };

  const collapseAllDepts = () => {
    const all: Record<string, boolean> = {};
    allDepartmentNames.forEach((d) => {
      all[d] = true;
    });
    setCollapsedDepts(all);
  };

  const expandAllDepts = () => {
    setCollapsedDepts({});
  };

  const handleStartEdit = (m: TeamMember) => {
    setEditingId(m.id || m.sl);
    setEditingText(m.wishingMessage);
  };

  const handleSaveEdit = (idOrSl: string) => {
    onUpdateMemberMessage(idOrSl, editingText);
    setEditingId(null);
  };

  const handleCopyWish = (msg: string, key: string) => {
    navigator.clipboard.writeText(msg);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Render Member Table Row (reused across Flat Table and Department Table)
  const renderMemberRow = (member: TeamMember, idx: number, showDeptBadge = true) => {
    const key = member.id || member.sl || `member-${idx}`;
    const cleanPhone = member.whatsapp || member.mobile;

    const isEditing = editingId === (member.id || member.sl);
    const isSentThisYear = member.lastSentYear ? member.lastSentYear.toString() === currentYear : false;
    const isToday = member.isBirthdayToday || checkIsTodayBirthday(member.birthday);
    const upcomingInfo = getUpcomingBirthdayInfo(member.birthday, 7);
    const isDueSoon = !isToday && upcomingInfo.isDueSoon;
    const specialDayMatch = getNearbySpecialDayForBirthday(member.birthday, 3);
    const formattedImageUrl = formatProfileImageUrl(member.imageUrl);

    return (
      <tr
        key={key}
        id={`roster-row-${member.id || member.sl}`}
        className={`hover:bg-slate-50/80 transition ${
          isToday
            ? 'bg-amber-50/60 font-medium'
            : isDueSoon
            ? 'bg-amber-50/25'
            : ''
        }`}
      >
        {/* SL */}
        <td className="py-3 px-4 font-mono text-slate-500">{member.sl || idx + 1}</td>

        {/* PHOTO (Avatar Thumbnail) */}
        <td className="py-2 px-3 text-center">
          <div className="flex items-center justify-center">
            {formattedImageUrl ? (
              <img
                src={formattedImageUrl}
                alt={member.name}
                className="w-8 h-8 rounded-full object-cover border border-amber-500/40 shadow-sm"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallbackEl = e.currentTarget.parentElement?.querySelector('.avatar-initials-fallback');
                  if (fallbackEl) {
                    (fallbackEl as HTMLElement).classList.remove('hidden');
                    (fallbackEl as HTMLElement).classList.add('flex');
                  }
                }}
              />
            ) : null}
            <div
              className={`avatar-initials-fallback w-8 h-8 rounded-full items-center justify-center text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-300 shadow-2xs shrink-0 ${
                formattedImageUrl ? 'hidden' : 'flex'
              }`}
            >
              {member.name
                ? member.name
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'IE'}
            </div>
          </div>
        </td>

        {/* ID */}
        <td className="py-3 px-4 font-mono font-medium text-slate-600">
          {member.id || '-'}
        </td>

        {/* Name (Column D) */}
        <td className="py-3 px-4 font-bold text-slate-900">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>{member.name}</span>
            {isToday && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold animate-pulse shadow-2xs inline-flex items-center gap-0.5">
                🎂 Today!
              </span>
            )}
            {isDueSoon && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold inline-flex items-center gap-1 shadow-2xs">
                <CalendarClock className="w-2.5 h-2.5 text-indigo-500" />
                Upcoming ({upcomingInfo.daysRemaining === 1 ? 'Tomorrow' : `in ${upcomingInfo.daysRemaining}d`})
              </span>
            )}
          </div>
        </td>

        {/* Designation & Department (Column E & F) */}
        <td className="py-3 px-4 text-slate-600 font-medium">
          <div>{member.designation || '-'}</div>
          {showDeptBadge && (
            <div className="mt-0.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                <Building2 className="w-2.5 h-2.5 text-slate-400" />
                {member.department || 'Central Industrial Engineering'}
              </span>
            </div>
          )}
        </td>

        {/* Birthday & Global Holiday Alignments (Column G) */}
        <td className="py-3 px-4">
          {member.birthday ? (
            <div className="flex flex-col gap-1 items-start">
              <div className="inline-flex items-center gap-1.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                    isToday
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : isDueSoon
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  🗓️ {member.birthday}
                </span>
                {isDueSoon && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                    {upcomingInfo.daysRemaining === 1 ? 'Tomorrow' : `In ${upcomingInfo.daysRemaining}d`}
                  </span>
                )}
              </div>

              {/* Global / National Festive Sub-Badge */}
              {specialDayMatch && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border transition shadow-2xs ${
                    specialDayMatch.relationship === 'exact'
                      ? specialDayMatch.specialDay.badgeColor || 'bg-amber-100 text-amber-950 border-amber-300'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title={`${specialDayMatch.subText} • Greeting Theme: ${specialDayMatch.specialDay.greetingTheme}`}
                >
                  <span>{specialDayMatch.label}</span>
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-400 italic">Not set</span>
          )}
        </td>

        {/* Wish Status Indicator (Column L Tracker) */}
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            {isSentThisYear ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Wish Sent ({currentYear})
              </span>
            ) : isToday ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-400 animate-pulse shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Birthday Today (Pending)
              </span>
            ) : isDueSoon ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-2xs">
                <CalendarClock className="w-3.5 h-3.5 text-indigo-600" />
                Upcoming ({upcomingInfo.daysRemaining === 1 ? 'Tomorrow' : `in ${upcomingInfo.daysRemaining}d`})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Pending Wish
              </span>
            )}

            {onToggleWishSent && (
              <button
                onClick={() => onToggleWishSent(member.id || member.sl)}
                className={`p-1 rounded transition cursor-pointer ${
                  isSentThisYear
                    ? 'text-emerald-600 hover:bg-emerald-50'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title={isSentThisYear ? "Mark as Unsent" : "Mark as Sent"}
              >
                {isSentThisYear ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              </button>
            )}
          </div>
        </td>

        {/* Server Dispatch Status Badge */}
        <td className="py-3 px-4">
          {member.serverDispatched || isSentThisYear ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Dispatched (Headless)
            </span>
          ) : isToday ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse shadow-2xs">
              <Radio className="w-3 h-3 text-amber-600 animate-pulse" />
              Awaiting 8 AM Trigger
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
              <Clock className="w-3 h-3 text-slate-400" />
              Idle
            </span>
          )}
        </td>

        {/* WhatsApp Number (Column J) */}
        <td className="py-3 px-4 font-mono">
          {member.whatsapp ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
              {member.whatsapp}
            </span>
          ) : (
            <span className="text-slate-400 italic">No phone</span>
          )}
        </td>

        {/* Wishing Message (Column K) */}
        <td className="py-3 px-4">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-emerald-500 rounded bg-white text-slate-900 font-medium focus:outline-hidden"
              />
              <button
                onClick={() => handleSaveEdit(member.id || member.sl)}
                className="p-1 text-emerald-600 hover:text-emerald-800 font-bold cursor-pointer"
                title="Save message"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-1 group">
              <p
                className="text-slate-700 italic text-[11px] leading-snug cursor-pointer hover:text-slate-900"
                onClick={() => handleStartEdit(member)}
                title="Click to inline edit wishing message"
              >
                "{member.wishingMessage}"
              </p>
              <button
                onClick={() => handleCopyWish(member.wishingMessage, key)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700 p-0.5 transition shrink-0 cursor-pointer"
                title="Copy wish text"
              >
                {copiedId === key ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          )}
        </td>

        {/* Actions */}
        <td className="py-3 px-4 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => onSendWhatsApp(member)}
              disabled={isSending || !member.whatsapp}
              className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition cursor-pointer disabled:opacity-40 shadow-2xs"
              title="Send wish directly via server API (+8801625299521)"
            >
              <Send className="w-3 h-3" />
              Send Wish (Direct)
            </button>

            <button
              onClick={() => onOpenGenerator(member)}
              className="p-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition cursor-pointer"
              title="Generate Custom Wish with Gemini AI"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div id="roster-table-container" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-8">
      
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col gap-4">
        
        {/* Top Control Bar: View Switcher + Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="roster-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Name, Designation, Department, ID, Phone..."
              className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-hidden text-slate-800"
            />
          </div>

          {/* View Mode Toggle: List View vs Department View */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="inline-flex items-center bg-slate-200/80 p-1 rounded-xl border border-slate-300/80 shadow-2xs">
              <button
                id="btn-view-list"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View full roster table"
              >
                <LayoutList className="w-3.5 h-3.5 text-slate-500" />
                <span>List View</span>
              </button>

              <button
                id="btn-view-department"
                onClick={() => setViewMode('department')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'department'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Group team members by Department for regional & team-specific birthday management"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Department View</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  viewMode === 'department' ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-300 text-slate-700'
                }`}>
                  {allDepartmentNames.length}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-slate-200/60">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              id="filter-all"
              onClick={() => handleSetFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Members ({members.length})
            </button>

            <button
              id="filter-today"
              onClick={() => handleSetFilterType('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                filterType === 'today'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
              }`}
            >
              🎂 Today ({todayCount})
            </button>

            <button
              id="filter-due-soon"
              onClick={() => handleSetFilterType('due_soon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                filterType === 'due_soon'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'bg-indigo-50/80 border border-indigo-200 text-indigo-900 hover:bg-indigo-100'
              }`}
            >
              <CalendarClock className="w-3.5 h-3.5" />
              Upcoming (7 Days) ({dueSoonCount})
            </button>

            <button
              id="filter-sent"
              onClick={() => handleSetFilterType('sent_2026')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                filterType === 'sent_2026'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Wish Sent ({sentCount})
            </button>

            <button
              id="filter-pending"
              onClick={() => handleSetFilterType('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                filterType === 'pending'
                  ? 'bg-slate-800 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Pending Wish ({members.length - sentCount})
            </button>

            <button
              id="filter-whatsapp"
              onClick={() => handleSetFilterType('has_wa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === 'has_wa'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              WhatsApp Ready ({members.filter((m) => m.whatsapp).length})
            </button>

            {selectedMonthFilter !== null && (
              <div className="flex items-center gap-1.5 bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>Month: {MONTH_SHORT_NAMES[selectedMonthFilter]}</span>
                {onClearMonthFilter && (
                  <button
                    onClick={onClearMonthFilter}
                    className="hover:bg-amber-600 p-0.5 rounded-full transition cursor-pointer ml-1"
                    title="Clear Month Filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Department View Controls (Expand / Collapse all & Quick Dept Filter) */}
          {viewMode === 'department' && (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Department Dropdown Selector */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium hidden sm:inline">Department:</span>
                <select
                  id="department-select-filter"
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className="bg-white border border-slate-300 text-slate-800 font-semibold rounded-lg px-2.5 py-1 text-xs focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="all">All Departments ({allDepartmentNames.length})</option>
                  {allDepartmentNames.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept} ({members.filter((m) => (m.department?.trim() || 'Central Industrial Engineering') === dept).length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Accordion Expand / Collapse shortcuts */}
              <div className="flex items-center gap-1">
                <button
                  onClick={expandAllDepts}
                  className="px-2 py-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded text-[11px] font-medium transition cursor-pointer"
                  title="Expand all department sections"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAllDepts}
                  className="px-2 py-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded text-[11px] font-medium transition cursor-pointer"
                  title="Collapse all department sections"
                >
                  Collapse All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: DEPARTMENT GROUPED VIEW                                      */}
      {/* ========================================================================= */}
      {viewMode === 'department' && (
        <div id="department-view-content" className="p-5 space-y-6 bg-slate-50/40">
          
          {/* Department Overview Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {departmentGroups.map((grp) => {
              const isSelected = selectedDeptFilter === grp.department;
              const hasToday = grp.todayCount > 0;
              const hasDueSoon = grp.dueSoonCount > 0;

              return (
                <div
                  key={grp.department}
                  id={`dept-card-${grp.department.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setSelectedDeptFilter(isSelected ? 'all' : grp.department)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        hasToday
                          ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-400/40 animate-pulse'
                          : isSelected
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1" title={grp.department}>
                          {grp.department}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {grp.totalHeadcount} {grp.totalHeadcount === 1 ? 'member' : 'members'}
                        </p>
                      </div>
                    </div>

                    {hasToday && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold animate-pulse inline-flex items-center gap-0.5 shrink-0 shadow-2xs">
                        🎂 {grp.todayCount}
                      </span>
                    )}
                  </div>

                  {/* Quick status counters */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 text-slate-600">
                      <CalendarClock className={`w-3 h-3 ${hasDueSoon ? 'text-indigo-600 font-bold' : 'text-slate-400'}`} />
                      <span className={hasDueSoon ? 'text-indigo-700 font-bold' : ''}>
                        {grp.dueSoonCount} Upcoming (7d)
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{grp.sentCount}/{grp.totalHeadcount} Sent</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Department Sections List */}
          {departmentGroups.length === 0 || filteredMembers.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-700 text-sm">No Department Records Match Filters</p>
              <p className="text-xs text-slate-400 mt-1">
                Try resetting search queries or changing active status filters.
              </p>
              <button
                onClick={() => {
                  setSelectedDeptFilter('all');
                  setSearchTerm('');
                  handleSetFilterType('all');
                }}
                className="mt-3 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {departmentGroups.map((grp) => {
                // If filtering by search/status has reduced this department's member list to 0, hide or show minimal card
                if (grp.members.length === 0 && (searchTerm || filterType !== 'all' || selectedMonthFilter !== null)) {
                  return null;
                }

                const isCollapsed = Boolean(collapsedDepts[grp.department]);
                const hasToday = grp.todayCount > 0;
                const hasUpcoming = grp.dueSoonCount > 0;

                return (
                  <div
                    key={grp.department}
                    id={`dept-section-${grp.department.replace(/\s+/g, '-').toLowerCase()}`}
                    className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition"
                  >
                    {/* Department Section Header Bar */}
                    <div
                      onClick={() => toggleDeptCollapse(grp.department)}
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition select-none ${
                        hasToday
                          ? 'bg-amber-50/70 border-b border-amber-200'
                          : 'bg-slate-50/80 border-b border-slate-200 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${
                          hasToday
                            ? 'bg-amber-500 text-white shadow-xs animate-pulse'
                            : 'bg-slate-900 text-white shadow-2xs'
                        }`}>
                          <Building2 className="w-4 h-4" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm text-slate-900">
                              {grp.department}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-700">
                              {grp.members.length} {grp.members.length === 1 ? 'member' : 'members'}
                            </span>
                            {hasToday && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold animate-pulse inline-flex items-center gap-1 shadow-2xs">
                                🎂 {grp.todayCount} Birthday Today!
                              </span>
                            )}
                            {hasUpcoming && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold inline-flex items-center gap-1 shadow-2xs">
                                <CalendarClock className="w-3 h-3 text-indigo-500" />
                                {grp.dueSoonCount} Upcoming (7d)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Regional & Team Birthday Wishes Dispatch Hub &bull; {grp.sentCount} wish sent &bull; {grp.pendingCount} pending
                          </p>
                        </div>
                      </div>

                      {/* Right controls: Status summary + Collapse Chevron */}
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                          <span>Progress:</span>
                          <span className="text-emerald-700 font-bold">
                            {grp.totalHeadcount > 0 ? Math.round((grp.sentCount / grp.totalHeadcount) * 100) : 0}%
                          </span>
                        </div>

                        <button
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
                          aria-label={isCollapsed ? "Expand department" : "Collapse department"}
                        >
                          {isCollapsed ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronUp className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Department Member Table Body */}
                    {!isCollapsed && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100/60 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                            <tr>
                              <th className="py-2.5 px-4 w-12">SL</th>
                              <th className="py-2.5 px-3 w-14 text-center">PHOTO</th>
                              <th className="py-2.5 px-4">ID</th>
                              <th className="py-2.5 px-4">Name (Col D)</th>
                              <th className="py-2.5 px-4">Designation (Col E)</th>
                              <th className="py-2.5 px-4">Birthday (Col G)</th>
                              <th className="py-2.5 px-4 min-w-[160px]">Wish Status ({currentYear})</th>
                              <th className="py-2.5 px-4 min-w-[150px]">Server Dispatch</th>
                              <th className="py-2.5 px-4">WhatsApp (Col J)</th>
                              <th className="py-2.5 px-4 min-w-[260px]">Wishing Message (Col K)</th>
                              <th className="py-2.5 px-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 text-slate-700">
                            {grp.members.length === 0 ? (
                              <tr>
                                <td colSpan={11} className="py-6 text-center text-slate-400">
                                  No members match the current filter in {grp.department}.
                                </td>
                              </tr>
                            ) : (
                              grp.members.map((member, idx) => renderMemberRow(member, idx, false))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: STANDARD FLAT LIST ROSTER TABLE                               */}
      {/* ========================================================================= */}
      {viewMode === 'list' && (
        <div id="list-view-content" className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12">SL</th>
                <th className="py-3 px-3 w-14 text-center">PHOTO</th>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Name (Col D)</th>
                <th className="py-3 px-4">Designation & Dept (Col E/F)</th>
                <th className="py-3 px-4">Birthday (Col G)</th>
                <th className="py-3 px-4 min-w-[160px]">Wish Status ({currentYear})</th>
                <th className="py-3 px-4 min-w-[150px]">Server Dispatch</th>
                <th className="py-3 px-4">WhatsApp (Col J)</th>
                <th className="py-3 px-4 min-w-[260px]">Wishing Message (Col K)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto">
                      <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-600 text-sm">No Team Members Found</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Try clearing search filters or syncing sheet data.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, idx) => renderMemberRow(member, idx, true))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer info */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span>Showing {filteredMembers.length} of {members.length} team members across {allDepartmentNames.length} departments</span>
          {viewMode === 'department' && (
            <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold text-[10px]">
              Department View Active
            </span>
          )}
        </div>
        <span>Google Apps Script inspects Row 5+ daily for birthday matches & logs Column L</span>
      </div>
    </div>
  );
};


