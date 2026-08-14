import React from 'react';
import { Sparkles, Bell, Calendar, ChevronRight, X, Clock, AlertTriangle, ShieldCheck, Send } from 'lucide-react';
import { TeamMember } from '../types';
import { getUpcomingBirthdayInfo, checkIsTodayBirthday } from '../utils/dateUtils';

interface UpcomingBirthdayAlertBannerProps {
  members: TeamMember[];
  onViewDueSoon: () => void;
  onOpenAdminPlanning: () => void;
  onDismiss?: () => void;
  isDismissed?: boolean;
}

export const UpcomingBirthdayAlertBanner: React.FC<UpcomingBirthdayAlertBannerProps> = ({
  members,
  onViewDueSoon,
  onOpenAdminPlanning,
  onDismiss,
  isDismissed = false,
}) => {
  if (isDismissed) return null;

  const todayCelebrants = members.filter((m) => m.isBirthdayToday || checkIsTodayBirthday(m.birthday));
  const dueSoonCelebrants = members.filter((m) => {
    const info = getUpcomingBirthdayInfo(m.birthday, 7);
    return info.isDueSoon && !info.isToday;
  });

  const tomorrowCelebrants = members.filter((m) => {
    const info = getUpcomingBirthdayInfo(m.birthday, 7);
    return info.isTomorrow;
  });

  const totalUpcomingCount = todayCelebrants.length + dueSoonCelebrants.length;

  if (totalUpcomingCount === 0) return null;

  // Highlight message construction
  let bannerTitle = '';
  let bannerSubtitle = '';

  if (todayCelebrants.length > 0 && dueSoonCelebrants.length > 0) {
    bannerTitle = `🔔 Birthday Reminder: ${todayCelebrants.length} Today & ${dueSoonCelebrants.length} Due Soon this week!`;
    bannerSubtitle = `Today: ${todayCelebrants.map(m => m.name).join(', ')} • Upcoming: ${dueSoonCelebrants.slice(0, 3).map(m => m.name).join(', ')}`;
  } else if (todayCelebrants.length > 0) {
    bannerTitle = `🎉 Birthday Alert: ${todayCelebrants.length} team member${todayCelebrants.length > 1 ? 's have' : ' has'} a birthday Today!`;
    bannerSubtitle = `${todayCelebrants.map(m => `${m.name} (${m.designation})`).join(', ')}`;
  } else if (tomorrowCelebrants.length > 0) {
    bannerTitle = `🔔 Advance Alert: ${tomorrowCelebrants.length} birthday${tomorrowCelebrants.length > 1 ? 's' : ''} Tomorrow!`;
    bannerSubtitle = `${tomorrowCelebrants.map(m => `${m.name} (${m.designation})`).join(', ')} • Ensure WhatsApp & wishes are verified.`;
  } else {
    bannerTitle = `🔔 Upcoming Birthdays: ${dueSoonCelebrants.length} team member${dueSoonCelebrants.length > 1 ? 's have' : ' has'} birthdays within the next 7 days!`;
    bannerSubtitle = `${dueSoonCelebrants.slice(0, 3).map(m => `${m.name} (${getUpcomingBirthdayInfo(m.birthday).badgeLabel})`).join(', ')}`;
  }

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 p-0.5 shadow-md shadow-amber-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/95 backdrop-blur-md px-4 sm:px-5 py-3.5 rounded-[14px] text-white">
        
        {/* Left info */}
        <div 
          onClick={onViewDueSoon}
          className="flex items-center gap-3 cursor-pointer group flex-1"
          title="Click to apply Due Soon (7 Days) filter"
        >
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
              {totalUpcomingCount}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition flex items-center gap-1.5">
                {bannerTitle}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Due Soon Active
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1 group-hover:text-white transition">
              {bannerSubtitle}
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0 flex-wrap">
          <button
            onClick={onViewDueSoon}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            View Due Soon ({dueSoonCelebrants.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenAdminPlanning}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100 border border-emerald-500/30 transition cursor-pointer"
            title="Dispatch 1-3 Days Advance Planning briefing to Admin WhatsApp (+880163529951)"
          >
            <Send className="w-3.5 h-3.5 text-emerald-300" />
            Admin Planning
          </button>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Dismiss Alert"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
