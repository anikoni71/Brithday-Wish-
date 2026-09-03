import React, { useState, useMemo } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Cake,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TeamMember } from '../types';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, parse, isValid } from 'date-fns';

interface BirthdayCalendarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  teamMembers: TeamMember[];
}

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
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const birthdaysByDay = useMemo(() => {
    const map: Record<string, TeamMember[]> = {};
    
    teamMembers.forEach(member => {
      try {
        const bDay = parse(member.birthday, 'dd-MMM', new Date());
        if (isValid(bDay)) {
          // Set to current month/year for comparison
          const key = format(bDay, 'MM-dd');
          if (!map[key]) map[key] = [];
          map[key].push(member);
        }
      } catch (e) {
        // Silently skip invalid dates
      }
    });
    
    return map;
  }, [teamMembers]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
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
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Team Birthdays</h2>
                <p className="text-sm text-slate-500 font-medium">{format(currentDate, 'MMMM yyyy')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex bg-white border border-slate-200 rounded-lg p-1 mr-2">
                <button 
                  onClick={prevMonth}
                  className="p-1.5 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  Today
                </button>
                <button 
                  onClick={nextMonth}
                  className="p-1.5 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
            <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-slate-100 py-3 text-center text-xs font-black text-slate-400 uppercase tracking-widest">
                  {day}
                </div>
              ))}
              
              {calendarDays.map((day, i) => {
                const dayBirthdays = birthdaysByDay[format(day, 'MM-dd')] || [];
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div 
                    key={day.toString()} 
                    className={`min-h-[100px] p-2 transition-colors ${
                      isCurrentMonth ? 'bg-white' : 'bg-slate-50/50 text-slate-300'
                    } ${isToday ? 'bg-indigo-50/30' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-indigo-600 text-white shadow-md' : isCurrentMonth ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        {format(day, 'd')}
                      </span>
                      {dayBirthdays.length > 0 && (
                        <div className="flex -space-x-1">
                          {dayBirthdays.slice(0, 3).map((m, idx) => (
                            <div 
                              key={m.sl} 
                              className={`w-2 h-2 rounded-full border border-white ${COLOR_PALETTE[Number(m.sl) % COLOR_PALETTE.length]}`}
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
                    
                    <div className="space-y-1 mt-2">
                      {dayBirthdays.map((member) => (
                        <div 
                          key={member.sl}
                          className={`px-1.5 py-1 rounded text-[10px] font-bold truncate border flex items-center gap-1 shadow-sm transition-transform hover:scale-[1.02] ${
                            COLOR_PALETTE[Number(member.sl) % COLOR_PALETTE.length].replace('bg-', 'text-').replace('-500', '-700')
                          } ${COLOR_PALETTE[Number(member.sl) % COLOR_PALETTE.length].replace('bg-', 'bg-').replace('-500', '-50')}`}
                          style={{ borderColor: 'currentColor' }}
                        >
                          <Cake className="w-2.5 h-2.5 shrink-0" />
                          {member.name.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Legend */}
          <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-sm" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-400 shadow-sm" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Other Month</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-4 h-4" />
              <span className="text-xs font-bold tracking-tight">{teamMembers.length} Team Members</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
