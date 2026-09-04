import React, { useState, useMemo } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Cake,
  Users,
  List,
  Search,
  Sparkles,
  Clock,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TeamMember } from '../types';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { parseBirthdayDate, getDaysUntilBirthday, MONTH_NAMES } from '../utils/dateUtils';

interface BirthdayCalendarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  teamMembers: TeamMember[];
}

type CalendarViewMode = 'month' | 'upcoming';

const COLOR_PALETTE = [
  'bg-pink-500', 'bg-rose-500', 'bg-orange-500', 'bg-amber-500',
  'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500',
  'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500',
  'bg-fuchsia-500'
];

export const BirthdayCalendarOverlay: React.FC<BirthdayCalendarOverlayProps> = ({
  isOpen,
  onClose,
  teamMembers
}) => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [horizonFilter, setHorizonFilter] = useState<'all' | '30days' | '7days'>('all');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  // Map birthdays to MM-dd keys for the calendar grid
  const birthdaysByDay = useMemo(() => {
    const map: Record<string, TeamMember[]> = {};
    
    teamMembers.forEach(member => {
      const parsed = parseBirthdayDate(member.birthday);
      if (parsed) {
        const key = `${String(parsed.month + 1).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`;
        if (!map[key]) map[key] = [];
        map[key].push(member);
      }
    });
    
    return map;
  }, [teamMembers]);

  // Chronologically sorted upcoming celebrants for the Upcoming List View
  const upcomingCelebrants = useMemo(() => {
    const today = new Date();
    return teamMembers
      .map(member => {
        const parsed = parseBirthdayDate(member.birthday);
        const days = getDaysUntilBirthday(member.birthday, today);
        return {
          member,
          parsed,
          days: days !== null ? days : 999
        };
      })
      .filter((item): item is { member: TeamMember; parsed: NonNullable<ReturnType<typeof parseBirthdayDate>>; days: number } => item.parsed !== null)
      .sort((a, b) => a.days - b.days);
  }, [teamMembers]);

  // Filtered upcoming list based on search and horizon
  const filteredUpcoming = useMemo(() => {
    return upcomingCelebrants.filter(item => {
      // Horizon filter
      if (horizonFilter === '7days' && item.days > 7) return false;
      if (horizonFilter === '30days' && item.days > 30) return false;

      // Text search filter
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        item.member.name.toLowerCase().includes(query) ||
        (item.member.department && item.member.department.toLowerCase().includes(query)) ||
        (item.member.designation && item.member.designation.toLowerCase().includes(query)) ||
        (item.member.nameMeaning && item.member.nameMeaning.toLowerCase().includes(query)) ||
        (item.member.specialDayMatch && item.member.specialDayMatch.toLowerCase().includes(query)) ||
        (item.member.birthday && item.member.birthday.toLowerCase().includes(query))
      );
    });
  }, [upcomingCelebrants, searchQuery, horizonFilter]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200"
        >
          {/* Header */}
          <div className="bg-slate-50 px-5 sm:px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Title & Context */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600 shrink-0">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 leading-tight">Team Birthdays</h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {viewMode === 'month' 
                    ? format(currentDate, 'MMMM yyyy')
                    : `${upcomingCelebrants.length} upcoming celebrations mapped`}
                </p>
              </div>
            </div>

            {/* Controls Bar: Toggle & Navigation */}
            <div className="flex items-center flex-wrap gap-2 justify-between sm:justify-end">
              {/* View Switcher Toggle */}
              <div 
                id="birthday-calendar-view-toggle"
                className="flex items-center bg-slate-200/80 p-1 rounded-xl border border-slate-200 shadow-2xs"
                role="tablist"
                aria-label="Calendar view selector"
              >
                <button
                  id="view-toggle-month"
                  role="tab"
                  aria-selected={viewMode === 'month'}
                  onClick={() => setViewMode('month')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'month'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Month View</span>
                </button>
                <button
                  id="view-toggle-upcoming"
                  role="tab"
                  aria-selected={viewMode === 'upcoming'}
                  onClick={() => setViewMode('upcoming')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'upcoming'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Upcoming List View</span>
                </button>
              </div>

              {/* Month Navigation (Only shown in Month View) */}
              {viewMode === 'month' && (
                <div className="flex bg-white border border-slate-200 rounded-xl p-0.5 shadow-2xs">
                  <button 
                    id="prev-month-btn"
                    onClick={prevMonth}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-600"
                    title="Previous month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button 
                    id="current-month-btn"
                    onClick={() => setCurrentDate(new Date())}
                    className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Today
                  </button>
                  <button 
                    id="next-month-btn"
                    onClick={nextMonth}
                    className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-600"
                    title="Next month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Close Button */}
              <button 
                id="close-calendar-overlay"
                onClick={onClose}
                className="p-1.5 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-slate-700 ml-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* View Body: Month View vs Upcoming List View */}
          {viewMode === 'month' ? (
            /* Month Calendar Grid */
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50">
              <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-slate-100 py-2.5 text-center text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
                
                {calendarDays.map((day) => {
                  const dayBirthdays = birthdaysByDay[format(day, 'MM-dd')] || [];
                  const isCurrentMonth = isSameMonth(day, monthStart);
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <div 
                      key={day.toString()} 
                      className={`min-h-[100px] p-2 transition-colors ${
                        isCurrentMonth ? 'bg-white' : 'bg-slate-50/40 text-slate-300'
                      } ${isToday ? 'bg-indigo-50/40 ring-1 ring-inset ring-indigo-300' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                          isToday ? 'bg-indigo-600 text-white shadow-xs' : isCurrentMonth ? 'text-slate-700' : 'text-slate-400'
                        }`}>
                          {format(day, 'd')}
                        </span>
                        {dayBirthdays.length > 0 && (
                          <div className="flex -space-x-1">
                            {dayBirthdays.slice(0, 3).map((m) => (
                              <div 
                                key={m.sl || m.id || m.name} 
                                className={`w-2.5 h-2.5 rounded-full border border-white ${COLOR_PALETTE[Number(m.sl || 1) % COLOR_PALETTE.length]}`}
                                title={m.name}
                              />
                            ))}
                            {dayBirthdays.length > 3 && (
                              <div className="text-[9px] font-bold text-slate-400 pl-1">
                                +{dayBirthdays.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-1 mt-1.5">
                        {dayBirthdays.map((member) => (
                          <div 
                            key={member.sl || member.id || member.name}
                            className={`px-1.5 py-1 rounded-md text-[10px] font-bold truncate border flex items-center gap-1 shadow-2xs transition-transform hover:scale-[1.02] cursor-default ${
                              COLOR_PALETTE[Number(member.sl || 1) % COLOR_PALETTE.length].replace('bg-', 'text-').replace('-500', '-700')
                            } ${COLOR_PALETTE[Number(member.sl || 1) % COLOR_PALETTE.length].replace('bg-', 'bg-').replace('-500', '-50')}`}
                            style={{ borderColor: 'currentColor' }}
                            title={`${member.name}${member.nameMeaning ? ` (${member.nameMeaning})` : ''}${member.specialDayMatch ? ` • Match: ${member.specialDayMatch}` : ''} - ${member.designation || ''}`}
                          >
                            <Cake className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{member.name.split(' ')[0]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Upcoming List View */
            <div className="flex-1 overflow-auto flex flex-col bg-slate-50/50">
              {/* Search & Filter Bar */}
              <div className="p-4 sm:px-6 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    id="upcoming-list-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, department, or date..."
                    className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:bg-white transition"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Horizon Quick Filters */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Filter:</span>
                  <button
                    id="filter-all-upcoming"
                    onClick={() => setHorizonFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      horizonFilter === 'all'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    All ({upcomingCelebrants.length})
                  </button>
                  <button
                    id="filter-30-days"
                    onClick={() => setHorizonFilter('30days')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      horizonFilter === '30days'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Next 30 Days ({upcomingCelebrants.filter(i => i.days <= 30).length})
                  </button>
                  <button
                    id="filter-7-days"
                    onClick={() => setHorizonFilter('7days')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      horizonFilter === '7days'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    This Week ({upcomingCelebrants.filter(i => i.days <= 7).length})
                  </button>
                </div>
              </div>

              {/* Celebrants Chronological Timeline Cards */}
              <div className="p-4 sm:p-6 space-y-2.5 overflow-y-auto">
                {filteredUpcoming.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 p-8">
                    <Cake className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-600">No birthday celebrations match your filter</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing your search term or choosing "All".</p>
                  </div>
                ) : (
                  filteredUpcoming.map(({ member, parsed, days }) => {
                    const isToday = days === 0;
                    const isTomorrow = days === 1;
                    const isWithinWeek = days <= 7;
                    const isWithinMonth = days <= 30;

                    return (
                      <div 
                        key={`${member.id || member.sl || member.name}`}
                        className={`rounded-2xl p-3.5 sm:p-4 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isToday
                            ? 'bg-linear-to-r from-amber-50/90 to-rose-50/70 border-amber-300 shadow-sm ring-1 ring-amber-300'
                            : isWithinWeek
                            ? 'bg-indigo-50/40 border-indigo-200 hover:border-indigo-300 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        {/* Member Identity & Details */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Visual Date Badge */}
                          <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black shrink-0 shadow-2xs border ${
                            isToday
                              ? 'bg-amber-500 text-white border-amber-600'
                              : isWithinWeek
                              ? 'bg-indigo-600 text-white border-indigo-700'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            <span className="text-[10px] uppercase font-bold tracking-wider leading-none">
                              {MONTH_NAMES[parsed.month]?.short || 'Day'}
                            </span>
                            <span className="text-lg font-black leading-tight mt-0.5">
                              {parsed.day}
                            </span>
                          </div>

                          {/* Avatar Initials */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-2xs ${
                            COLOR_PALETTE[Number(member.sl || 1) % COLOR_PALETTE.length]
                          }`}>
                            {member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </div>

                          {/* Names and Department */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-extrabold text-slate-900 leading-snug truncate">
                                {member.name}
                              </h3>
                              {isToday && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white shadow-2xs animate-pulse">
                                  <Gift className="w-2.5 h-2.5" />
                                  Today!
                                </span>
                              )}
                              {isTomorrow && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                  Tomorrow
                                </span>
                              )}
                            </div>

                            {/* Name Meaning if available */}
                            {member.nameMeaning && (
                              <p className="text-[11px] font-normal text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                                <Sparkles className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                                <span className="italic truncate">{member.nameMeaning}</span>
                              </p>
                            )}

                            {/* Special Day Match */}
                            {member.specialDayMatch && (
                              <p className="text-[11px] font-medium text-amber-700/90 flex items-center gap-1 mt-0.5 truncate" title={`Special Day Match: ${member.specialDayMatch}`}>
                                <span className="shrink-0 text-amber-600 text-[10px]">🌟</span>
                                <span className="truncate">{member.specialDayMatch}</span>
                              </p>
                            )}

                            {/* Designation & Department */}
                            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                              {member.designation || 'Team Member'} 
                              {member.department ? ` • ${member.department}` : ''}
                            </p>
                          </div>
                        </div>

                        {/* Right: Days Countdown & Birthday Label */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 shrink-0 gap-1">
                          <div className="text-xs font-bold text-slate-500">
                            {member.birthday}
                          </div>
                          <div className={`px-2.5 py-1 rounded-full text-xs font-extrabold inline-flex items-center gap-1 ${
                            isToday
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : isWithinWeek
                              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                              : isWithinMonth
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            <Clock className="w-3 h-3" />
                            {days === 0
                              ? 'Celebrates Today'
                              : days === 1
                              ? '1 day remaining'
                              : `In ${days} days`}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Footer Legend */}
          <div className="px-5 sm:px-6 py-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            {viewMode === 'month' ? (
              <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-xs" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Today</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-300 shadow-xs" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Other Month</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  Showing <strong>{filteredUpcoming.length}</strong> of <strong>{upcomingCelebrants.length}</strong> upcoming celebrations in chronological order
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-1.5 text-slate-500 ml-auto">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold tracking-tight">{teamMembers.length} Team Members</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

