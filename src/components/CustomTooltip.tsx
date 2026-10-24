import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Users, PhoneCall, Mail, Bell, Cake, Clock, Send, ShieldCheck, Heart, Award, ArrowUpRight } from 'lucide-react';
import { TeamMember } from '../types';
import { checkIsTodayBirthday, getUpcomingBirthdayInfo } from '../utils/dateUtils';
import { formatProfileImageUrl } from '../utils/imageUtils';

export interface TooltipMetric {
  label: string;
  value: string | number;
  highlight?: boolean;
  color?: string;
}

export interface CustomTooltipProps {
  title: string;
  subtitle?: string;
  category?: string;
  badge?: string;
  badgeColor?: 'emerald' | 'amber' | 'blue' | 'indigo' | 'rose' | 'purple' | 'zinc';
  icon?: React.ReactNode;
  summary: string;
  metrics?: TooltipMetric[];
  footer?: string;
  children: React.ReactElement;
  delay?: number;
}

export interface MemberTooltipProps {
  member: TeamMember;
  customSummary?: string;
  children: React.ReactElement;
}

const BADGE_COLOR_MAP = {
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  blue: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  indigo: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  zinc: 'bg-zinc-800 text-zinc-300 border-zinc-700',
};

const BORDER_ACCENT_MAP = {
  emerald: 'border-emerald-500/40 shadow-emerald-950/40',
  amber: 'border-amber-500/40 shadow-amber-950/40',
  blue: 'border-blue-500/40 shadow-blue-950/40',
  indigo: 'border-indigo-500/40 shadow-indigo-950/40',
  rose: 'border-rose-500/40 shadow-rose-950/40',
  purple: 'border-purple-500/40 shadow-purple-950/40',
  zinc: 'border-zinc-700/80 shadow-black/60',
};

/**
 * CustomTooltip Component
 * Clones the child card directly without injecting any wrapper DOM element,
 * measuring the card's bounding box and displaying a high-end glassmorphic tooltip
 * with smooth fade-in and scale-up animations via React Portal.
 */
export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  title,
  subtitle,
  category,
  badge,
  badgeColor = 'emerald',
  icon,
  summary,
  metrics,
  footer,
  children,
  delay = 120,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; position: 'top' | 'bottom'; arrowLeft: number }>({
    top: 0,
    left: 0,
    position: 'top',
    arrowLeft: 0,
  });

  const timerRef = useRef<number | null>(null);
  const targetElementRef = useRef<HTMLElement | null>(null);

  const updatePosition = useCallback(() => {
    if (!targetElementRef.current) return;
    const rect = targetElementRef.current.getBoundingClientRect();
    const tooltipWidth = 310;
    const estimatedHeight = 170;

    // Determine vertical placement (above or below)
    const spaceAbove = rect.top;
    const placeTop = spaceAbove >= estimatedHeight + 15;
    const top = placeTop
      ? rect.top - estimatedHeight - 10
      : rect.bottom + 10;

    // Center horizontally over the card and clamp to viewport
    const rawLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
    const left = Math.max(12, Math.min(window.innerWidth - tooltipWidth - 12, rawLeft));

    // Calculate arrow offset relative to tooltip's left
    const cardCenterX = rect.left + rect.width / 2;
    const arrowLeft = Math.max(18, Math.min(tooltipWidth - 18, cardCenterX - left));

    setCoords({
      top: Math.max(10, top),
      left,
      position: placeTop ? 'top' : 'bottom',
      arrowLeft,
    });
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    // Call child's existing onMouseEnter if defined
    if (children.props && typeof children.props.onMouseEnter === 'function') {
      children.props.onMouseEnter(e);
    }

    targetElementRef.current = e.currentTarget;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      updatePosition();
      setIsOpen(true);
    }, delay);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (children.props && typeof children.props.onMouseLeave === 'function') {
      children.props.onMouseLeave(e);
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const tooltipPortal = isOpen && typeof document !== 'undefined'
    ? createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
                y: coords.position === 'top' ? 6 : -6,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                y: coords.position === 'top' ? 4 : -4,
              }}
              transition={{
                duration: 0.22,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: 'fixed',
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                width: '310px',
                zIndex: 99999,
                pointerEvents: 'none',
              }}
              className="select-none"
            >
              {/* Tooltip Card Body */}
              <div
                className={`relative rounded-2xl bg-zinc-950/95 backdrop-blur-2xl border p-4 shadow-2xl transition-all ${
                  BORDER_ACCENT_MAP[badgeColor] || BORDER_ACCENT_MAP.zinc
                }`}
              >
                {/* Ambient Subtle Glow Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent rounded-2xl pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 flex items-start justify-between gap-2.5 pb-2.5 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {icon && (
                      <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shrink-0 shadow-sm text-zinc-200">
                        {icon}
                      </div>
                    )}
                    <div className="min-w-0">
                      {category && (
                        <p className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                          {category}
                        </p>
                      )}
                      <h4 className="text-xs font-bold text-white tracking-tight truncate leading-tight">
                        {title}
                      </h4>
                      {subtitle && (
                        <p className="text-[10px] text-zinc-400 truncate leading-tight mt-0.5">
                          {subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border tracking-wider uppercase shrink-0 ${
                        BADGE_COLOR_MAP[badgeColor] || BADGE_COLOR_MAP.zinc
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </div>

                {/* Quick Summary Section */}
                <div className="relative z-10 py-2.5">
                  <p className="text-[11.5px] leading-relaxed text-zinc-300 font-normal">
                    {summary}
                  </p>
                </div>

                {/* Metrics Breakdown */}
                {metrics && metrics.length > 0 && (
                  <div className="relative z-10 pt-2 border-t border-zinc-800/60 grid grid-cols-2 gap-2">
                    {metrics.map((m, idx) => (
                      <div
                        key={`tooltip-metric-${idx}`}
                        className="bg-zinc-900/80 rounded-lg p-1.5 px-2 border border-zinc-800/70"
                      >
                        <span className="text-[9px] font-mono text-zinc-400 block uppercase tracking-wider truncate">
                          {m.label}
                        </span>
                        <span
                          className={`text-[11px] font-bold font-mono block truncate ${
                            m.highlight
                              ? 'text-emerald-400'
                              : m.color || 'text-zinc-200'
                          }`}
                        >
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Optional Footer */}
                {footer && (
                  <div className="relative z-10 mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[9.5px] font-mono text-zinc-400">
                    <span className="truncate">{footer}</span>
                    <span className="text-zinc-400 flex items-center gap-0.5 shrink-0">
                      LIVE DATA <ArrowUpRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                )}

                {/* Pointing Caret Arrow */}
                <div
                  className={`absolute w-3 h-3 bg-zinc-950 border transform rotate-45 pointer-events-none ${
                    coords.position === 'top'
                      ? 'bottom-[-6px] border-b border-r border-zinc-700/80'
                      : 'top-[-6px] border-t border-l border-zinc-700/80'
                  }`}
                  style={{ left: `${coords.arrowLeft}px` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )
    : null;

  return (
    <>
      {React.cloneElement(React.Children.only(children), {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })}
      {tooltipPortal}
    </>
  );
};

/**
 * MemberCardTooltip Component
 * Specialized wrapper for team member cards displaying full profile summary,
 * birthday dates, name meaning, and communication channel readiness.
 */
export const MemberCardTooltip: React.FC<MemberTooltipProps> = ({
  member,
  customSummary,
  children,
}) => {
  const isToday = member.isBirthdayToday || checkIsTodayBirthday(member.birthday);
  const upcomingInfo = getUpcomingBirthdayInfo(member.birthday, 30);
  const daysText = isToday
    ? 'Celebration is Today!'
    : upcomingInfo?.daysRemaining === 0
    ? 'Celebrating today'
    : upcomingInfo?.daysRemaining !== null && upcomingInfo?.daysRemaining !== undefined
    ? `In ${upcomingInfo.daysRemaining} days (${upcomingInfo.badgeLabel || 'Upcoming'})`
    : member.birthday || 'Date on record';

  const summary =
    customSummary ||
    `${member.name} (${member.designation || 'Team Member'}, ${member.department || 'Central IE'}). Birthday: ${member.birthday || 'Celebration'}. ${
      member.nameMeaning ? `Cultural meaning: "${member.nameMeaning}".` : ''
    } Ready for direct WhatsApp & email greetings.`;

  const metrics: TooltipMetric[] = [
    {
      label: 'Birthday',
      value: member.birthday || 'Pending',
      highlight: isToday,
      color: isToday ? 'text-amber-400 font-extrabold' : 'text-zinc-200',
    },
    {
      label: 'Timeline',
      value: daysText,
      highlight: isToday || (upcomingInfo?.daysRemaining !== null && upcomingInfo.daysRemaining <= 7),
      color: isToday ? 'text-emerald-400' : 'text-zinc-300',
    },
    {
      label: 'WhatsApp Gateway',
      value: member.whatsapp || member.mobile || 'Email Only',
      color: member.whatsapp ? 'text-emerald-400' : 'text-zinc-400',
    },
    {
      label: 'Annual Cycle',
      value: member.lastSentYear || member.wishSent || 'Pending 2026',
      color: member.lastSentYear ? 'text-cyan-400' : 'text-amber-400',
    },
  ];

  if (member.nameMeaning) {
    metrics.push({
      label: 'Name Meaning',
      value: member.nameMeaning,
      color: 'text-amber-300',
    });
  }

  if (member.specialDayMatch) {
    metrics.push({
      label: 'Festive Match',
      value: member.specialDayMatch,
      color: 'text-emerald-300',
    });
  }

  const badgeColor = isToday
    ? 'amber'
    : upcomingInfo?.isDueSoon
    ? 'emerald'
    : 'indigo';

  const avatar = member.imageUrl ? (
    <img
      src={formatProfileImageUrl(member.imageUrl)}
      alt={member.name}
      className="w-full h-full object-cover rounded-xl"
    />
  ) : (
    <span className="font-bold text-xs font-mono text-zinc-300">
      {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
    </span>
  );

  return (
    <CustomTooltip
      title={member.name}
      subtitle={`${member.designation || 'Team Member'} • ${member.department || 'Central IE'}`}
      category={isToday ? "TODAY'S CELEBRANT" : "TEAM MEMBER PROFILE"}
      badge={isToday ? 'BIRTHDAY TODAY 🎉' : upcomingInfo?.isDueSoon ? 'DUE SOON' : 'ACTIVE'}
      badgeColor={badgeColor}
      icon={avatar}
      summary={summary}
      metrics={metrics.slice(0, 4)}
      footer={`ID: ${member.id || member.sl || 'IE'} • Single Source Google Sheet`}
    >
      {children}
    </CustomTooltip>
  );
};
