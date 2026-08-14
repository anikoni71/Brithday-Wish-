import React, { useState, useMemo } from 'react';
import { Sparkles, Calendar, ChevronRight, ChevronDown, Flag, Globe, Gift, Award, Star, Users, Info } from 'lucide-react';
import { TeamMember } from '../types';
import {
  GLOBAL_SPECIAL_DAYS,
  SpecialDay,
  getUpcomingGlobalSpecialDays,
  UpcomingSpecialDayItem,
  getNearbySpecialDayForBirthday,
  parseBirthdayDate
} from '../utils/dateUtils';

interface GlobalSpecialDaysBannerProps {
  members: TeamMember[];
  onSelectMemberFilter?: (month: number | null) => void;
}

export const GlobalSpecialDaysBanner: React.FC<GlobalSpecialDaysBannerProps> = ({
  members,
  onSelectMemberFilter,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSpecialDay, setActiveSpecialDay] = useState<UpcomingSpecialDayItem | null>(null);

  // Compute upcoming special days (next 60 days, up to 5)
  const upcomingSpecialDays = useMemo(() => {
    return getUpcomingGlobalSpecialDays(new Date(), 6, 75);
  }, []);

  // Map celebrants near each special day
  const celebrantsBySpecialDay = useMemo(() => {
    const map: Record<string, TeamMember[]> = {};
    for (const sd of GLOBAL_SPECIAL_DAYS) {
      map[sd.id] = members.filter((m) => {
        const parsed = parseBirthdayDate(m.birthday);
        if (!parsed) return false;
        // Check if in the same month and within +/- 4 days
        if (parsed.month === sd.month) {
          return Math.abs(parsed.day - sd.day) <= 4;
        }
        return false;
      });
    }
    return map;
  }, [members]);

  const filteredFullList = useMemo(() => {
    if (selectedCategory === 'all') return GLOBAL_SPECIAL_DAYS;
    return GLOBAL_SPECIAL_DAYS.filter((sd) => sd.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs mb-8 overflow-hidden transition">
      
      {/* Top Banner Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                Global Special Days & Festive Calendar
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                2026 Edition
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Coordinating team birthday wishes with national & international festive themes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1.5 transition cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            {isExpanded ? 'Collapse Calendar' : 'View Full Special Days Directory'}
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Upcoming Festive Events Carousel / Cards Bar */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Upcoming Global Days & Team Alignment
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Next {upcomingSpecialDays.length} festive celebrations
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {upcomingSpecialDays.map((event) => {
            const nearMembers = celebrantsBySpecialDay[event.id] || [];
            const isNear = event.daysRemaining <= 7;

            return (
              <div
                key={event.id}
                onClick={() => setActiveSpecialDay(activeSpecialDay?.id === event.id ? null : event)}
                className={`p-3.5 rounded-xl border transition cursor-pointer relative bg-white ${
                  isNear
                    ? 'border-amber-300 shadow-xs hover:border-amber-400'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl select-none" role="img" aria-label={event.name}>
                      {event.icon}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {event.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        {event.dateFormatted} • <span className="text-indigo-600 font-bold">{event.timeframeLabel}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 ${
                      event.isToday
                        ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                        : event.isTomorrow
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {event.timeframeLabel}
                  </span>
                </div>

                {/* Greeting theme hint */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 truncate max-w-[200px]" title={event.greetingTheme}>
                    💡 {event.greetingTheme}
                  </span>

                  {nearMembers.length > 0 ? (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] inline-flex items-center gap-1 shrink-0">
                      <Users className="w-3 h-3 text-emerald-600" />
                      {nearMembers.length} Celebrant{nearMembers.length > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">0 celebrants</span>
                  )}
                </div>

                {/* Expanded active details card */}
                {activeSpecialDay?.id === event.id && (
                  <div className="mt-3 p-2.5 bg-slate-900 text-white rounded-lg text-xs animate-in fade-in duration-150">
                    <p className="font-semibold text-amber-300 text-[11px]">{event.description}</p>
                    <p className="text-[10px] text-slate-300 mt-1">
                      <strong className="text-white">Recommended Wish Theme:</strong> "{event.greetingTheme}"
                    </p>
                    {nearMembers.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-slate-800">
                        <p className="text-[10px] font-bold text-emerald-400">
                          Birthdays Near this Holiday:
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {nearMembers.map((nm) => (
                            <span key={nm.id || nm.sl} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-200 border border-slate-700">
                              {nm.name} ({nm.birthday})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Special Days Directory (Collapsible) */}
      {isExpanded && (
        <div className="p-4 sm:p-6 bg-white animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-4 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Category:
            </span>
            {[
              { id: 'all', label: 'All Special Days' },
              { id: 'national', label: '🇧🇩 National Days' },
              { id: 'festive', label: '🎉 Festive & Cultural' },
              { id: 'international', label: '🌍 International Observances' },
              { id: 'professional', label: '⚙️ Professional & IE Days' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Special Days Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredFullList.map((sd) => {
              const nearMembers = celebrantsBySpecialDay[sd.id] || [];

              return (
                <div
                  key={sd.id}
                  className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <span className="text-xl select-none">{sd.icon}</span>
                      <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 shadow-2xs">
                        {sd.dateFormatted}
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-slate-900 leading-snug">
                      {sd.name}
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {sd.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-400 capitalize">
                      {sd.category}
                    </span>

                    {nearMembers.length > 0 ? (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        {nearMembers.length} match{nearMembers.length > 1 ? 'es' : ''}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
