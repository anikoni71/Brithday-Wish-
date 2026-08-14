import React, { useState, useMemo } from 'react';
import { X, Send, Calendar, CheckCircle2, AlertTriangle, Phone, Mail, Clock, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';
import { TeamMember, TwilioConfig } from '../types';
import { getUpcomingCelebrantsPlanningList, CelebrantPlanningItem, getNearbySpecialDayForBirthday } from '../utils/dateUtils';

interface AdminAdvanceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  twilioConfig: TwilioConfig;
  onRefreshLogs?: () => void;
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
  const [advanceDays, setAdvanceDays] = useState<number>(3);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [resultStatus, setResultStatus] = useState<{
    success: boolean;
    message: string;
    count: number;
    details?: string;
  } | null>(null);

  // Compute upcoming celebrants planning list (1 to 3 days or selected days)
  const planningList: CelebrantPlanningItem[] = useMemo(() => {
    return getUpcomingCelebrantsPlanningList(members, advanceDays);
  }, [members, advanceDays]);

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    localStorage.setItem('admin_planning_whatsapp', adminPhone);
    localStorage.setItem('admin_planning_email', adminEmail);
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
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Admin Advance Birthday Planning Alert
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                  1-3 Days Advance
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Automated multi-channel briefings for Team Leadership via WhatsApp & Email
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
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Admin Target Configuration Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Target Recipient & Admin Settings
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
                  className="w-full px-3 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-xl focus:border-emerald-600 focus:outline-hidden"
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
                  className="w-full px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-hidden"
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
                  className="w-full px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:border-amber-600 focus:outline-hidden"
                >
                  <option value={1}>Tomorrow Only (1 Day)</option>
                  <option value={3}>Next 1 to 3 Days (Recommended)</option>
                  <option value={5}>Next 5 Days</option>
                  <option value={7}>Next 7 Days (Full Week)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Verification Checklist Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Upcoming Celebrants Checklist ({planningList.length} Found)
              </h4>
              <span className="text-[11px] font-semibold text-slate-500">
                Window: Next {advanceDays} Day{advanceDays > 1 ? 's' : ''}
              </span>
            </div>

            {planningList.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200">
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

          {/* Actionable Plan Guidance */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 space-y-1">
            <p className="font-bold flex items-center gap-1 text-blue-900">
              📝 Actionable Plan for Team Leadership:
            </p>
            <p className="text-[11px] text-blue-800">
              • Review the checklist above to ensure no celebrants have missing Column J WhatsApp numbers.
            </p>
            <p className="text-[11px] text-blue-800">
              • Customize Column K wishing messages in the Google Sheet before the zero-touch 8:00 AM morning run.
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
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-[11px] text-slate-500">
            Dispatches WhatsApp to <strong className="font-mono text-slate-700">{adminPhone}</strong> + Email to <strong className="text-slate-700">{adminEmail}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
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
