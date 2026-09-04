import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Search,
  Users,
  Copy,
  Check,
  Filter,
  Cake,
  Calendar,
  Send,
  ExternalLink,
  ShieldCheck,
  Award,
  BookOpen,
  LayoutGrid,
  List,
  RefreshCw,
  Heart,
  ArrowRight,
  Shuffle,
  RotateCcw
} from 'lucide-react';
import { TeamMember } from '../types';
import { getMemberNameMeaningDetails } from '../utils/nameMeaningUtils';
import { checkIsTodayBirthday } from '../utils/dateUtils';

interface NameMeaningWorkstationProps {
  members: TeamMember[];
  onOpenGenerator?: (member: TeamMember) => void;
  onSendWhatsApp?: (member: TeamMember) => void;
  isSendingWhatsApp?: boolean;
}

export const NameMeaningWorkstation: React.FC<NameMeaningWorkstationProps> = ({
  members,
  onOpenGenerator,
  onSendWhatsApp,
  isSendingWhatsApp = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyAllSuccess, setCopyAllSuccess] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Normalize members with dynamic real-time meanings and emojis
  const enrichedMembers = useMemo(() => {
    return members.map((member) => {
      const details = getMemberNameMeaningDetails(member.name);
      return {
        ...member,
        nameMeaning: member.nameMeaning || details.note,
        nameMeaningEmoji: member.nameMeaningEmoji || details.emoji,
        nameMeaningNote: member.nameMeaningNote || details.note,
        meaningSource: details.source,
        isBirthdayToday: member.isBirthdayToday || checkIsTodayBirthday(member.birthday),
      };
    });
  }, [members]);

  // Unique departments for filter
  const departments = useMemo(() => {
    const set = new Set<string>();
    enrichedMembers.forEach((m) => {
      if (m.department) set.add(m.department);
    });
    return Array.from(set).sort();
  }, [enrichedMembers]);

  // Filtered members based on search and department
  const filteredMembers = useMemo(() => {
    return enrichedMembers.filter((m) => {
      const matchesDept = selectedDept === 'all' || m.department === selectedDept;
      if (!matchesDept) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        m.name.toLowerCase().includes(term) ||
        (m.nameMeaning && m.nameMeaning.toLowerCase().includes(term)) ||
        (m.nameMeaningEmoji && m.nameMeaningEmoji.includes(term)) ||
        (m.designation && m.designation.toLowerCase().includes(term)) ||
        (m.department && m.department.toLowerCase().includes(term)) ||
        (m.specialDayMatch && m.specialDayMatch.toLowerCase().includes(term))
      );
    });
  }, [enrichedMembers, selectedDept, searchTerm]);

  // Randomized / shuffled members to bring fresh dynamic energy to display
  const displayMembers = useMemo(() => {
    if (!isShuffled) {
      return filteredMembers;
    }
    const arr = [...filteredMembers];
    // Fisher-Yates random shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }, [filteredMembers, isShuffled, shuffleSeed]);

  // Toggle shuffle mode or generate a fresh shuffle permutation
  const handleToggleShuffle = () => {
    if (!isShuffled) {
      setIsShuffled(true);
      setShuffleSeed((s) => s + 1);
    } else {
      setIsShuffled(false);
    }
  };

  const handleReshuffleAgain = () => {
    setIsShuffled(true);
    setShuffleSeed((s) => s + 1);
  };

  // Copy single member card info to clipboard
  const handleCopyMember = (m: (typeof enrichedMembers)[0]) => {
    const text = `${m.name}: ${m.nameMeaningEmoji || '✨'} ${m.nameMeaning}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(m.id || m.sl);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Copy all member meanings formatted as a clean list in current display order
  const handleCopyAll = () => {
    const text = displayMembers
      .map((m) => `${m.name}: ${m.nameMeaningEmoji || '✨'} ${m.nameMeaning}`)
      .join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopyAllSuccess(true);
      setTimeout(() => setCopyAllSuccess(false), 2500);
    });
  };

  return (
    <section id="name-meaning-of-team-member" className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>IE Central Team Heritage & Ethos</span>
              <span className="w-1 h-1 rounded-full bg-amber-400"></span>
              <span className="text-amber-200">Real-Time Auto-Generated</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Name Meaning Of Team Member</span>
              <span className="text-xl sm:text-2xl">✨</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Explore the spiritual significance, etymological roots, and empowering leadership traits behind our 16 IE Central team champions. Every newly synced team member is automatically assigned a tailored uplifting note and expressive emoji in real-time.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <button
              id="header-shuffle-btn"
              onClick={handleToggleShuffle}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all shadow-sm cursor-pointer active:scale-95 ${
                isShuffled
                  ? 'bg-amber-500 text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
              }`}
              title={isShuffled ? 'Shuffle mode active: click to reset to default order' : 'Shuffle/Randomize cards to bring fresh energy'}
            >
              <Shuffle className={`w-4 h-4 ${isShuffled ? 'rotate-180 transition-transform duration-300' : 'text-amber-300'}`} />
              <span>{isShuffled ? 'Shuffled View' : 'Shuffle / Randomize'}</span>
            </button>

            <button
              onClick={handleCopyAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all shadow-sm cursor-pointer active:scale-95"
              title="Copy all name meanings to clipboard"
            >
              {copyAllSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">All 16 Meanings Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-300" />
                  <span>Copy Roster Meanings</span>
                </>
              )}
            </button>

            <div className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-slate-300 flex items-center gap-2 backdrop-blur-md">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>
                <strong className="text-white font-bold">{enrichedMembers.length}</strong> Profiles Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80 lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, meaning, or emoji..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters & View Toggles */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 font-medium cursor-pointer"
            >
              <option value="all">All Departments ({enrichedMembers.length})</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Shuffle / Randomize Toggle & Re-roll */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              id="shuffle-toggle-btn"
              onClick={handleToggleShuffle}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                isShuffled
                  ? 'bg-amber-500 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
              title={isShuffled ? 'Shuffle is active. Click to restore original roster order' : 'Shuffle/Randomize cards to bring fresh energy'}
            >
              <Shuffle className={`w-3.5 h-3.5 ${isShuffled ? 'rotate-180 transition-transform duration-300' : ''}`} />
              <span>{isShuffled ? 'Shuffled' : 'Shuffle / Randomize'}</span>
              {isShuffled && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>

            {isShuffled && (
              <button
                id="reshuffle-again-btn"
                onClick={handleReshuffleAgain}
                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-amber-800 hover:text-amber-950 hover:bg-amber-100/80 transition cursor-pointer"
                title="Shuffle again with a new random combination"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="text-[11px]">Re-roll</span>
              </button>
            )}
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Bento Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Compact List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Shuffle Banner Indicator */}
      <AnimatePresence>
        {isShuffled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 px-4 py-2.5 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-2xs">
              <div className="flex items-center gap-2">
                <Shuffle className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
                <span>
                  <strong className="font-bold">Randomized Display Active:</strong> Cards are dynamically shuffled to bring fresh discovery and spotlight different team members!
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  onClick={handleReshuffleAgain}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reshuffle</span>
                </button>
                <button
                  onClick={() => setIsShuffled(false)}
                  className="px-2.5 py-1 rounded-lg bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Order</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid or List Display */}
      {viewMode === 'grid' ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {displayMembers.map((member, index) => (
              <motion.div
                layout
                key={member.id || member.sl}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  layout: { duration: 0.35, ease: 'easeInOut' },
                  duration: 0.2,
                  delay: Math.min(index * 0.02, 0.2)
                }}
                className="group relative bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all p-4.5 flex flex-col justify-between overflow-hidden"
              >
                {/* Birthday Accent Ribbon if celebrant today */}
                {member.isBirthdayToday && (
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-bl-xl shadow-xs flex items-center gap-1 z-10">
                    <Cake className="w-3 h-3 animate-bounce" /> Today Celebrant!
                  </div>
                )}

                <div>
                  {/* Top Bar: Dept / SL Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-600 font-mono">
                      #{member.sl || member.id}
                    </span>

                    {member.department && (
                      <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[170px]" title={member.department}>
                        {member.department}
                      </span>
                    )}
                  </div>

                  {/* Profile & Emoji Medallion Hero */}
                  <div className="flex items-center gap-3.5 mb-3.5">
                    {/* Expressive Emoji Medallion */}
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/60 to-yellow-50 border border-amber-200/80 shadow-2xs flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 group-hover:shadow-xs transition-transform duration-200">
                      <span>{member.nameMeaningEmoji || '✨'}</span>
                    </div>

                    {/* Member Details */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition truncate leading-snug" title={member.name}>
                        {member.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {member.designation || 'IE Central Member'}
                      </p>
                    </div>
                  </div>

                  {/* Name Meaning Highlight Container */}
                  <div className="rounded-xl p-3 bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-amber-50/60 border border-amber-200/70 relative">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[9.5px] font-black uppercase tracking-wider text-amber-800/90 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                        Meaning & Spirit
                      </span>

                      <button
                        onClick={() => handleCopyMember(member)}
                        className="p-1 rounded text-amber-600 hover:text-amber-900 hover:bg-amber-100/60 transition cursor-pointer"
                        title="Copy meaning note"
                      >
                        {copiedId === (member.id || member.sl) ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-amber-950 leading-relaxed italic">
                      "{member.nameMeaning}"
                    </p>
                  </div>

                  {/* Special Day Match or Birthday Meta */}
                  {member.specialDayMatch && (
                    <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-emerald-50/80 border border-emerald-200/70 text-[10.5px] text-emerald-900 flex items-start gap-1.5" title={`Special Day Match: ${member.specialDayMatch}`}>
                      <span className="shrink-0 text-emerald-600 text-xs">🌟</span>
                      <span className="truncate font-medium">{member.specialDayMatch}</span>
                    </div>
                  )}
                </div>

                {/* Card Footer: Birthday & Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                    <Cake className="w-3.5 h-3.5 text-amber-500" />
                    <span>{member.birthday || 'Date not set'}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {onOpenGenerator && (
                      <button
                        onClick={() => onOpenGenerator(member)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                        title="Draft customized birthday wish"
                      >
                        Wish
                      </button>
                    )}

                    {onSendWhatsApp && (
                      <button
                        onClick={() => onSendWhatsApp(member)}
                        disabled={isSendingWhatsApp}
                        className="p-1.5 rounded-lg text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 transition cursor-pointer disabled:opacity-50"
                        title="Send birthday wish via WhatsApp"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Detailed List View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">SL</th>
                  <th className="py-3 px-4">Member Name & Role</th>
                  <th className="py-3 px-4">Uplifting Meaning & Notes</th>
                  <th className="py-3 px-4">Birthday</th>
                  <th className="py-3 px-4">Special Day Alignment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {displayMembers.map((m) => (
                  <tr key={m.id || m.sl} className="hover:bg-amber-50/40 transition">
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">
                      {m.sl || m.id}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-base shrink-0">
                          {m.nameMeaningEmoji || '✨'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-snug">{m.name}</p>
                          <p className="text-[10px] text-slate-500">{m.designation || 'Team Member'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-950 font-semibold text-xs">
                        <span>{m.nameMeaningEmoji || '✨'}</span>
                        <span className="italic">{m.nameMeaning}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-600">
                      <div className="flex items-center gap-1">
                        <Cake className="w-3.5 h-3.5 text-amber-500" />
                        <span>{m.birthday || '—'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {m.specialDayMatch ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-medium truncate max-w-[220px]" title={m.specialDayMatch}>
                          <span className="text-emerald-500">🌟</span>
                          <span className="truncate">{m.specialDayMatch}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Regular observance</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyMember(m)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                          title="Copy meaning"
                        >
                          {copiedId === (m.id || m.sl) ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {onOpenGenerator && (
                          <button
                            onClick={() => onOpenGenerator(m)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] transition cursor-pointer"
                          >
                            Wish
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dynamic Sync Architecture Reassurance Card */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-indigo-50/70 p-4 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0">
            <RefreshCw className="w-4.5 h-4.5 animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Automatic Real-Time Google Sheet Dynamic Name Meaning Generator</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase">Live</span>
            </h4>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              When new team members are added or synced via the Google Sheet, our semantic engine automatically analyzes their name, extracts etymological roots, and pairs them with an expressive emoji and spiritually uplifting note without manual intervention.
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-white/80 border border-emerald-200 text-[11px] font-bold text-emerald-800 shrink-0 self-end sm:self-auto">
          ✨ 100% Dynamic Coverage
        </div>
      </div>
    </section>
  );
};
