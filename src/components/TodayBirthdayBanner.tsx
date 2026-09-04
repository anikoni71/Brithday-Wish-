import React, { useState } from 'react';
import { TeamMember } from '../types';
import { Sparkles, Send, MessageSquare, Copy, Check, User, Briefcase, Phone } from 'lucide-react';

interface TodayBirthdayBannerProps {
  todayBirthdays: TeamMember[];
  onOpenGenerator: (member: TeamMember) => void;
  onSendWhatsApp: (member: TeamMember, messageOverride?: string) => Promise<void>;
  isSending: boolean;
}

export const TodayBirthdayBanner: React.FC<TodayBirthdayBannerProps> = ({
  todayBirthdays,
  onOpenGenerator,
  onSendWhatsApp,
  isSending,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (todayBirthdays.length === 0) {
    return (
      <div className="bg-gradient-to-r from-slate-50 via-teal-50/30 to-slate-50 border border-slate-200/80 rounded-2xl p-5 mb-6 text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
            🗓️
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">No Birthdays Scheduled For Today</h3>
            <p className="text-xs text-slate-500">
              The automated Google Apps Script runs daily at 8:00 AM to check for matches in Column G ("Birthday").
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyMessage = (msg: string, id: string) => {
    navigator.clipboard.writeText(msg);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-700 rounded-2xl p-1 shadow-lg shadow-emerald-900/10">
        <div className="bg-slate-900 text-white rounded-[14px] p-6 relative overflow-hidden">
          
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <div>
                <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Today's Birthday Celebration! 🎉
                </h2>
                <p className="text-xs text-slate-300">
                  {todayBirthdays.length} IE Central Team colleague{todayBirthdays.length > 1 ? 's' : ''} celebrating today!
                </p>
              </div>
            </div>

            <div className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold border border-amber-500/30 self-start sm:self-auto">
              Auto-Trigger Match (Row 5+)
            </div>
          </div>

          {/* Member Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayBirthdays.map((member, idx) => {
              return (
                <div
                  key={`${member.id || member.sl || member.name}-${idx}`}
                  className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/50 transition"
                >
                  <div>
                    {/* Person Details */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                            <User className="w-4 h-4 text-emerald-400" />
                            {member.name}
                          </h3>
                          {member.id && (
                            <span className="text-[10px] font-mono bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">
                              ID: {member.id}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Briefcase className="w-3 h-3 text-slate-400" />
                          {member.designation || 'IE Central Team Member'}
                        </p>
                        {member.nameMeaning && (
                          <p className="text-xs text-amber-300/90 flex items-center gap-1 mt-1 font-medium" title={`Name Meaning: ${member.nameMeaning}`}>
                            <span className="text-amber-400">✦</span>
                            <span className="italic">{member.nameMeaning}</span>
                          </p>
                        )}
                        {member.specialDayMatch && (
                          <p className="text-xs text-emerald-300 flex items-center gap-1 mt-0.5 font-medium" title={`Birthday Special Day: ${member.specialDayMatch}`}>
                            <span>🌟</span>
                            <span>{member.specialDayMatch}</span>
                          </p>
                        )}
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        🎂 Birthday Today
                      </span>
                    </div>

                    {/* WhatsApp Details */}
                    <div className="mb-3 text-xs text-slate-300 flex items-center gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-mono">{member.whatsapp || 'No WhatsApp Number in Col J'}</span>
                    </div>

                    {/* Wishing Message Box */}
                    <div className="bg-slate-900/90 border border-slate-700/60 rounded-lg p-3 text-xs text-slate-200 relative group mb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex gap-2">
                          <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <p className="italic leading-relaxed font-medium">
                            "{member.wishingMessage}"
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopyMessage(member.wishingMessage, member.id || member.name)}
                          className="text-slate-400 hover:text-white p-1 rounded transition shrink-0"
                          title="Copy Wish"
                        >
                          {copiedId === (member.id || member.name) ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-2 text-right">
                        Source: Column K (Wishing Message)
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60 flex-wrap">
                    <button
                      onClick={() => onSendWhatsApp(member)}
                      disabled={isSending || !member.whatsapp}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-950/30"
                    >
                      <Send className="w-4 h-4" />
                      {isSending ? 'Sending Direct WhatsApp...' : 'Send WhatsApp Wish (Direct)'}
                    </button>

                    <button
                      onClick={() => onOpenGenerator(member)}
                      className="inline-flex items-center gap-1 px-3 py-2.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Customize Wish
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
