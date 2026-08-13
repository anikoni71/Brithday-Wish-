import React, { useState } from 'react';
import { TeamMember } from '../types';
import { parseBirthMonth, checkIsTodayBirthday, MONTH_NAMES } from '../utils/dateUtils';
import { Search, Filter, Phone, MessageSquare, Send, Sparkles, Check, Copy, User, CheckCircle2, Clock, CheckSquare, Square, ShieldCheck, Radio, X, Calendar } from 'lucide-react';

interface RosterTableProps {
  members: TeamMember[];
  onOpenGenerator: (member: TeamMember) => void;
  onSendWhatsApp: (member: TeamMember, messageOverride?: string) => Promise<void>;
  isSending: boolean;
  onUpdateMemberMessage: (idOrSl: string, newMessage: string) => void;
  onToggleWishSent?: (idOrSl: string) => void;
  selectedMonthFilter?: number | null;
  onClearMonthFilter?: () => void;
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
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'today' | 'sent_2026' | 'pending' | 'has_wa'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentYear = new Date().getFullYear().toString();

  // Filter members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.whatsapp.includes(searchTerm);

    if (!matchesSearch) return false;

    if (selectedMonthFilter !== null && selectedMonthFilter !== undefined) {
      const birthMonth = parseBirthMonth(m.birthday);
      if (birthMonth !== selectedMonthFilter) return false;
    }

    const isSentThisYear = m.lastSentYear ? m.lastSentYear.toString() === currentYear : false;

    if (filterType === 'today') return m.isBirthdayToday || checkIsTodayBirthday(m.birthday);
    if (filterType === 'sent_2026') return isSentThisYear;
    if (filterType === 'pending') return !isSentThisYear;
    if (filterType === 'has_wa') return Boolean(m.whatsapp && m.whatsapp.trim().length > 0);

    return true;
  });

  const todayCount = members.filter((m) => m.isBirthdayToday || checkIsTodayBirthday(m.birthday)).length;
  const sentCount = members.filter((m) => m.lastSentYear ? m.lastSentYear.toString() === currentYear : false).length;

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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mb-8">
      
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search team member by Name, Designation, ID, Phone..."
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-hidden text-slate-800"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Members ({members.length})
          </button>

          <button
            onClick={() => setFilterType('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
              filterType === 'today'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
            }`}
          >
            🎂 Today ({todayCount})
          </button>

          <button
            onClick={() => setFilterType('sent_2026')}
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
            onClick={() => setFilterType('pending')}
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
            onClick={() => setFilterType('has_wa')}
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px]">
            <tr>
              <th className="py-3 px-4 w-12">SL</th>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name (Col D)</th>
              <th className="py-3 px-4">Designation (Col E)</th>
              <th className="py-3 px-4">Birthday (Col G)</th>
              <th className="py-3 px-4 min-w-[150px]">Wish Status ({currentYear})</th>
              <th className="py-3 px-4 min-w-[150px]">Server Dispatch</th>
              <th className="py-3 px-4">WhatsApp (Col J)</th>
              <th className="py-3 px-4 min-w-[260px]">Wishing Message (Col K)</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400">
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
              filteredMembers.map((member, idx) => {
                const key = member.id || member.sl || `member-${idx}`;
                const cleanPhone = member.whatsapp || member.mobile;

                const isEditing = editingId === (member.id || member.sl);
                const isSentThisYear = member.lastSentYear ? member.lastSentYear.toString() === currentYear : false;

                return (
                  <tr
                    key={key}
                    className={`hover:bg-slate-50/80 transition ${
                      member.isBirthdayToday ? 'bg-amber-50/60 font-medium' : ''
                    }`}
                  >
                    {/* SL */}
                    <td className="py-3 px-4 font-mono text-slate-500">{member.sl || idx + 1}</td>

                    {/* ID */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-600">
                      {member.id || '-'}
                    </td>

                    {/* Name (Column D) */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        {member.name}
                        {member.isBirthdayToday && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white font-bold animate-pulse">
                            🎂 Today!
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Designation (Column E) */}
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {member.designation || '-'}
                    </td>

                    {/* Birthday (Column G) */}
                    <td className="py-3 px-4">
                      {member.birthday ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                            member.isBirthdayToday
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          🗓️ {member.birthday}
                        </span>
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
                        ) : member.isBirthdayToday ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-400 animate-pulse shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            Birthday Today (Pending)
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
                      ) : member.isBirthdayToday ? (
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
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Showing {filteredMembers.length} of {members.length} team members from "Central IE List"</span>
        <span>Google Apps Script inspects Row 5+ daily for birthday matches & logs Column L</span>
      </div>
    </div>
  );
};

