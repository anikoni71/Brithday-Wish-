import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TeamMember, AdminSheetConfig, CustomEmailReminder, ReminderRecurrence } from '../types';
import { getDaysUntilBirthday, normalizeBirthdayString } from '../utils/dateUtils';
import { triggerBirthdayConfetti } from '../utils/confetti';
import {
  Bell,
  Calendar,
  Clock,
  Mail,
  Send,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  Copy,
  Check,
  CheckCheck,
  Layers,
  Cake,
  User,
  ShieldCheck,
  Zap,
  ChevronRight,
  Sliders,
  X,
  ExternalLink
} from 'lucide-react';

interface RemindersWorkstationProps {
  members: TeamMember[];
  adminConfig?: AdminSheetConfig;
  onNavigateTab?: (tab: any) => void;
}

const DEFAULT_REMINDERS: CustomEmailReminder[] = [
  {
    id: "rem-default-1",
    memberId: "1",
    memberName: "Danushka Wanniarachchi",
    birthday: "5/6",
    memberEmail: "danushka.w@kdsgroup.net",
    targetEmail: "anik.barua@kdsgroup.net",
    advanceDays: 3,
    recurrence: "YEARLY",
    alertTime: "08:00 AM",
    subject: "🔔 [Birthday Reminder] Danushka Wanniarachchi's birthday in 3 days (6th May)",
    customNotes: "Coordinate leadership team greeting card and digital bouquet celebration.",
    enabled: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    lastDispatchedAt: new Date(Date.now() - 86400000 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    lastDispatchStatus: "SUCCESS"
  },
  {
    id: "rem-default-2",
    memberId: "2",
    memberName: "Zahid Ul Hasan Ripon",
    birthday: "2/21",
    memberEmail: "zahid.ripon@kdsgroup.net",
    targetEmail: "anik.barua@kdsgroup.net",
    advanceDays: 1,
    recurrence: "YEARLY",
    alertTime: "08:00 AM",
    subject: "🔔 [Birthday Alert] Zahid Ul Hasan Ripon's Birthday is Tomorrow!",
    customNotes: "Ensure WhatsApp wish in Column K is scheduled for automated morning dispatch.",
    enabled: true,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    lastDispatchedAt: undefined,
    lastDispatchStatus: undefined
  },
  {
    id: "rem-default-3",
    memberId: "7",
    memberName: "Bishnu Dhar",
    birthday: "8/13",
    memberEmail: "bishnu.dhar@kdsgroup.net",
    targetEmail: "anik.barua@kdsgroup.net",
    advanceDays: 7,
    recurrence: "WEEKLY_BEFORE",
    alertTime: "09:00 AM",
    subject: "🔔 [1-Week Advance Alert] Bishnu Dhar's Birthday is in 7 days",
    customNotes: "Reminder for IE Central engineers team greeting preparation.",
    enabled: true,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    lastDispatchedAt: undefined,
    lastDispatchStatus: undefined
  }
];

export const RemindersWorkstation: React.FC<RemindersWorkstationProps> = ({
  members,
  adminConfig,
  onNavigateTab
}) => {
  const defaultTargetEmail = adminConfig?.adminEmail || 'anik.barua@kdsgroup.net';

  const [reminders, setReminders] = useState<CustomEmailReminder[]>(() => {
    const saved = localStorage.getItem('ie_custom_email_reminders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved reminders", e);
      }
    }
    return DEFAULT_REMINDERS;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRecurrence, setFilterRecurrence] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused'>('all');
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [alertNotice, setAlertNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingReminder, setEditingReminder] = useState<CustomEmailReminder | null>(null);
  const [formData, setFormData] = useState<{
    memberId: string;
    targetEmail: string;
    advanceDays: number;
    recurrence: ReminderRecurrence;
    alertTime: string;
    subject: string;
    customNotes: string;
    enabled: boolean;
  }>({
    memberId: '',
    targetEmail: defaultTargetEmail,
    advanceDays: 1,
    recurrence: 'YEARLY',
    alertTime: '08:00 AM',
    subject: '',
    customNotes: '',
    enabled: true
  });

  // Sync with backend API
  useEffect(() => {
    const fetchServerReminders = async () => {
      try {
        const res = await fetch('/api/custom-reminders');
        if (res.ok) {
          const data = await res.json();
          if (data.reminders && data.reminders.length > 0) {
            setReminders(data.reminders);
            localStorage.setItem('ie_custom_email_reminders', JSON.stringify(data.reminders));
          }
        }
      } catch (e) {
        console.warn("Backend custom-reminders offline, using local state", e);
      }
    };
    fetchServerReminders();
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('ie_custom_email_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Handle opening modal for new reminder
  const handleOpenCreateModal = (preselectedMember?: TeamMember) => {
    const targetMember = preselectedMember || members[0];
    const memberName = targetMember?.name || '';
    const birthdayStr = targetMember?.birthday || '';
    const normBday = normalizeBirthdayString(birthdayStr);

    setEditingReminder(null);
    setFormData({
      memberId: targetMember?.id || targetMember?.sl || '',
      targetEmail: defaultTargetEmail,
      advanceDays: 1,
      recurrence: 'YEARLY',
      alertTime: '08:00 AM',
      subject: `🔔 [Birthday Alert] ${memberName}'s Birthday is Tomorrow (${normBday})`,
      customNotes: 'Send automated greeting and review Column K message in Google Sheet.',
      enabled: true
    });
    setIsModalOpen(true);
  };

  // Handle opening modal for edit
  const handleOpenEditModal = (reminder: CustomEmailReminder) => {
    setEditingReminder(reminder);
    setFormData({
      memberId: reminder.memberId,
      targetEmail: reminder.targetEmail,
      advanceDays: reminder.advanceDays,
      recurrence: reminder.recurrence,
      alertTime: reminder.alertTime,
      subject: reminder.subject,
      customNotes: reminder.customNotes || '',
      enabled: reminder.enabled
    });
    setIsModalOpen(true);
  };

  // Member select change in modal
  const handleMemberSelect = (mId: string) => {
    const selected = members.find(m => (m.id && m.id === mId) || m.sl === mId);
    if (selected) {
      const normBday = normalizeBirthdayString(selected.birthday);
      const advText = formData.advanceDays === 0 ? 'Today' : formData.advanceDays === 1 ? 'Tomorrow' : `in ${formData.advanceDays} days`;
      setFormData(prev => ({
        ...prev,
        memberId: mId,
        subject: `🔔 [Birthday Alert] ${selected.name}'s Birthday is ${advText} (${normBday})`
      }));
    } else {
      setFormData(prev => ({ ...prev, memberId: mId }));
    }
  };

  // Advance days change
  const handleAdvanceDaysChange = (days: number) => {
    const selected = members.find(m => (m.id && m.id === formData.memberId) || m.sl === formData.memberId);
    const mName = selected?.name || 'Team Member';
    const normBday = normalizeBirthdayString(selected?.birthday);
    const advText = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `in ${days} days`;

    setFormData(prev => ({
      ...prev,
      advanceDays: days,
      subject: `🔔 [Birthday Alert] ${mName}'s Birthday is ${advText} (${normBday})`
    }));
  };

  // Save Reminder (Create or Update)
  const handleSaveReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.memberId) {
      setAlertNotice({ type: 'error', text: 'Please select a team member.' });
      return;
    }
    if (!formData.targetEmail || !formData.targetEmail.includes('@')) {
      setAlertNotice({ type: 'error', text: 'Please provide a valid recipient email address.' });
      return;
    }

    const selected = members.find(m => (m.id && m.id === formData.memberId) || m.sl === formData.memberId);
    const memberName = selected?.name || 'Team Member';
    const birthday = selected?.birthday || '';
    const memberEmail = selected?.email || '';

    const newReminder: CustomEmailReminder = {
      id: editingReminder ? editingReminder.id : `rem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      memberId: formData.memberId,
      memberName,
      birthday,
      memberEmail,
      targetEmail: formData.targetEmail.trim(),
      advanceDays: formData.advanceDays,
      recurrence: formData.recurrence,
      alertTime: formData.alertTime,
      subject: formData.subject.trim() || `🔔 [Birthday Alert] ${memberName}'s Birthday is approaching!`,
      customNotes: formData.customNotes.trim(),
      enabled: formData.enabled,
      createdAt: editingReminder ? editingReminder.createdAt : new Date().toISOString(),
      lastDispatchedAt: editingReminder?.lastDispatchedAt,
      lastDispatchStatus: editingReminder?.lastDispatchStatus
    };

    try {
      setIsLoading(true);
      const res = await fetch('/api/custom-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReminder)
      });
      if (res.ok) {
        const data = await res.json();
        if (editingReminder) {
          setReminders(prev => prev.map(r => r.id === editingReminder.id ? data.reminder : r));
        } else {
          setReminders(prev => [data.reminder, ...prev]);
        }
      } else {
        // Fallback local update
        if (editingReminder) {
          setReminders(prev => prev.map(r => r.id === editingReminder.id ? newReminder : r));
        } else {
          setReminders(prev => [newReminder, ...prev]);
        }
      }
      setIsModalOpen(false);
      setAlertNotice({
        type: 'success',
        text: editingReminder ? `Reminder for ${memberName} updated successfully.` : `Custom reminder for ${memberName} saved!`
      });
    } catch (err) {
      // Offline fallback
      if (editingReminder) {
        setReminders(prev => prev.map(r => r.id === editingReminder.id ? newReminder : r));
      } else {
        setReminders(prev => [newReminder, ...prev]);
      }
      setIsModalOpen(false);
      setAlertNotice({
        type: 'success',
        text: `Custom reminder for ${memberName} saved locally!`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Reminder Active / Paused
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const updated = reminders.map(r => r.id === id ? { ...r, enabled: !currentStatus } : r);
    setReminders(updated);
    const target = updated.find(r => r.id === id);
    if (target) {
      try {
        await fetch('/api/custom-reminders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(target)
        });
      } catch (e) {
        console.warn("Failed to sync toggle status to server", e);
      }
    }
  };

  // Delete Reminder
  const handleDeleteReminder = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the email reminder alert for ${name}?`)) {
      return;
    }
    setReminders(prev => prev.filter(r => r.id !== id));
    try {
      await fetch(`/api/custom-reminders/${id}`, { method: 'DELETE' });
      setAlertNotice({ type: 'info', text: `Email reminder for ${name} removed.` });
    } catch (e) {
      console.warn("Server delete failed, removed locally", e);
    }
  };

  // Trigger / Test Dispatch email alert via existing email infrastructure
  const handleTriggerReminderNow = async (reminder: CustomEmailReminder) => {
    try {
      setDispatchingId(reminder.id);
      const res = await fetch(`/api/trigger-reminder/${reminder.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        triggerBirthdayConfetti();
        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setReminders(prev => prev.map(r => r.id === reminder.id ? { ...r, lastDispatchedAt: nowTime, lastDispatchStatus: 'SUCCESS' } : r));
        setAlertNotice({
          type: 'success',
          text: `Test Alert successfully delivered to ${reminder.targetEmail} for ${reminder.memberName} via existing email infrastructure!`
        });
      } else {
        // Fallback: use /api/send-email directly
        const fallbackRes = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: reminder.targetEmail,
            subject: reminder.subject,
            recipientName: `Administrator (${reminder.targetEmail})`,
            textBody: `Custom Email Alert for ${reminder.memberName}: Birthday is approaching. Advance warning: ${reminder.advanceDays} days. Notes: ${reminder.customNotes || 'N/A'}`
          })
        });

        if (fallbackRes.ok) {
          triggerBirthdayConfetti();
          const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setReminders(prev => prev.map(r => r.id === reminder.id ? { ...r, lastDispatchedAt: nowTime, lastDispatchStatus: 'SUCCESS' } : r));
          setAlertNotice({
            type: 'success',
            text: `Alert dispatched to ${reminder.targetEmail} via /api/send-email infrastructure!`
          });
        } else {
          setAlertNotice({
            type: 'error',
            text: `Failed to dispatch reminder to ${reminder.targetEmail}.`
          });
        }
      }
    } catch (err: any) {
      setAlertNotice({
        type: 'error',
        text: `Error dispatching reminder alert: ${err.message || 'Network error'}`
      });
    } finally {
      setDispatchingId(null);
    }
  };

  // Quick Preset: Bulk 1-Day Advance Alerts for Everyone
  const handleApplyPresetAllMembers = async (advanceDays: number) => {
    const label = advanceDays === 0 ? 'Same-Day' : `${advanceDays}-Day Advance`;
    if (!window.confirm(`Create automated ${label} recurring email alerts for all ${members.length} team members sent to ${defaultTargetEmail}?`)) {
      return;
    }

    setIsLoading(true);
    const newAlerts: CustomEmailReminder[] = members.map(m => {
      const normBday = normalizeBirthdayString(m.birthday);
      const advText = advanceDays === 0 ? 'Today' : advanceDays === 1 ? 'Tomorrow' : `in ${advanceDays} days`;
      return {
        id: `rem-preset-${m.id || m.sl}-${advanceDays}-${Date.now()}`,
        memberId: m.id || m.sl,
        memberName: m.name,
        birthday: m.birthday,
        memberEmail: m.email,
        targetEmail: defaultTargetEmail,
        advanceDays,
        recurrence: 'YEARLY',
        alertTime: '08:00 AM',
        subject: `🔔 [Birthday Alert] ${m.name}'s Birthday is ${advText} (${normBday})`,
        customNotes: `Automated ${label} checklist reminder for IE Central Team celebrations.`,
        enabled: true,
        createdAt: new Date().toISOString()
      };
    });

    // Merge without duplicates for same member and advanceDays
    const existingKeys = new Set(reminders.map(r => `${r.memberId}_${r.advanceDays}`));
    const filteredNew = newAlerts.filter(r => !existingKeys.has(`${r.memberId}_${r.advanceDays}`));

    const merged = [...filteredNew, ...reminders];
    setReminders(merged);

    // Save batch to server
    for (const item of filteredNew) {
      try {
        await fetch('/api/custom-reminders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      } catch (e) {
        // ignore individual failures
      }
    }

    setIsLoading(false);
    triggerBirthdayConfetti();
    setAlertNotice({
      type: 'success',
      text: `Added ${filteredNew.length} ${label} recurring alerts! Existing duplicates were preserved.`
    });
  };

  // Filtered Reminders List
  const filteredReminders = useMemo(() => {
    return reminders.filter(r => {
      // Search
      const searchMatch = !searchTerm || 
        r.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.targetEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.customNotes && r.customNotes.toLowerCase().includes(searchTerm.toLowerCase()));

      // Recurrence filter
      const recMatch = filterRecurrence === 'all' || r.recurrence === filterRecurrence;

      // Status filter
      const statusMatch = filterStatus === 'all' || 
        (filterStatus === 'active' && r.enabled) ||
        (filterStatus === 'paused' && !r.enabled);

      return searchMatch && recMatch && statusMatch;
    });
  }, [reminders, searchTerm, filterRecurrence, filterStatus]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = reminders.length;
    const active = reminders.filter(r => r.enabled).length;
    const yearly = reminders.filter(r => r.recurrence === 'YEARLY').length;
    const deliveredCount = reminders.filter(r => r.lastDispatchStatus === 'SUCCESS').length;

    // Find nearest birthday among active reminders
    let nearestMember: { name: string; days: number; birthday: string } | null = null;
    reminders.filter(r => r.enabled).forEach(r => {
      const days = getDaysUntilBirthday(r.birthday);
      if (days !== null) {
        if (!nearestMember || days < nearestMember.days) {
          nearestMember = { name: r.memberName, days, birthday: r.birthday };
        }
      }
    });

    return { total, active, yearly, deliveredCount, nearestMember };
  }, [reminders]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 pb-12">
      {/* Alert Notice Banner */}
      <AnimatePresence>
        {alertNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 shadow-xs ${
              alertNotice.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : alertNotice.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-indigo-50 border-indigo-200 text-indigo-900'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              {alertNotice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : alertNotice.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              )}
              <span>{alertNotice.text}</span>
            </div>
            <button
              onClick={() => setAlertNotice(null)}
              className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Bell className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
              Custom Recurring Birthday Alert Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              Email Reminders Workstation
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold uppercase tracking-wider">
                Automated
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Schedule personalized, recurring email alerts for specific team members. Configure advance warning windows (e.g. 1 day, 3 days, or 1 week), automated dispatch times, and designated manager recipients leveraging our existing email infrastructure.
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => handleOpenCreateModal()}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Custom Reminder
            </button>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('email')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15 flex items-center gap-2 transition cursor-pointer"
              >
                <Mail className="w-4 h-4 text-indigo-300" />
                View Mail Logs
              </button>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Configured Alerts</p>
            <p className="text-xl sm:text-2xl font-black text-white mt-1">{metrics.total}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{metrics.active} active alerts scheduled</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recurrence Cadence</p>
            <p className="text-xl sm:text-2xl font-black text-indigo-300 mt-1">{metrics.yearly} Yearly</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Automated annual refresh</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next Upcoming Alert</p>
            <p className="text-sm font-bold text-amber-300 mt-1 truncate">
              {metrics.nearestMember ? (metrics.nearestMember as any).name : 'No active alerts'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {metrics.nearestMember ? `In ${(metrics.nearestMember as any).days} days (${normalizeBirthdayString((metrics.nearestMember as any).birthday)})` : 'None pending'}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email System Status</p>
            <div className="flex items-center gap-1.5 mt-1 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Connected
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Via /api/send-email engine</p>
          </div>
        </div>
      </div>

      {/* Quick Setup Presets Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">One-Click Quick Presets for Entire Team</h3>
              <p className="text-[11px] text-slate-500">Auto-create standardized reminders for all {members.length} team members delivered to {defaultTargetEmail}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleApplyPresetAllMembers(1)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-semibold border border-slate-200 hover:border-indigo-200 transition cursor-pointer flex items-center gap-1.5"
              title="Add 1-Day Advance Reminder for every team member"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              + 1-Day Advance for All
            </button>

            <button
              onClick={() => handleApplyPresetAllMembers(3)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 text-xs font-semibold border border-slate-200 hover:border-amber-200 transition cursor-pointer flex items-center gap-1.5"
              title="Add 3-Day Planning Alert for every team member"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              + 3-Day Planning for All
            </button>

            <button
              onClick={() => handleApplyPresetAllMembers(0)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold border border-slate-200 hover:border-emerald-200 transition cursor-pointer flex items-center gap-1.5"
              title="Add Day-of 8:00 AM Morning Alert for every team member"
            >
              <Cake className="w-3.5 h-3.5 text-emerald-600" />
              + Same-Day Morning for All
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by team member name, email or note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Status:</span>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                filterStatus === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({reminders.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                filterStatus === 'active' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Active ({reminders.filter(r => r.enabled).length})
            </button>
            <button
              onClick={() => setFilterStatus('paused')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                filterStatus === 'paused' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Paused ({reminders.filter(r => !r.enabled).length})
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Recurrence:</span>
            <select
              value={filterRecurrence}
              onChange={(e) => setFilterRecurrence(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 py-1 pr-3 focus:outline-none cursor-pointer"
            >
              <option value="all">All Frequencies</option>
              <option value="YEARLY">Yearly Annual</option>
              <option value="WEEKLY_BEFORE">Weekly Countdown</option>
              <option value="DAILY_WEEK_OF">Daily Birthday Week</option>
              <option value="ONE_TIME">One-Time Alert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reminders Cards Grid */}
      {filteredReminders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Email Reminders Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {searchTerm || filterRecurrence !== 'all' || filterStatus !== 'all'
              ? 'No reminders match your current search filters. Try clearing filters.'
              : 'You have not set up any custom recurring email alerts yet. Click below to add your first reminder.'}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={() => handleOpenCreateModal()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              Create Custom Reminder
            </button>
            {(searchTerm || filterRecurrence !== 'all' || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterRecurrence('all');
                  setFilterStatus('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReminders.map((reminder) => {
            const daysUntil = getDaysUntilBirthday(reminder.birthday);
            const isToday = daysUntil === 0;
            const isTomorrow = daysUntil === 1;
            const isDueSoon = daysUntil !== null && daysUntil <= 7;
            const isDispatching = dispatchingId === reminder.id;

            return (
              <motion.div
                key={reminder.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`bg-white rounded-2xl border transition-all duration-200 p-5 shadow-2xs hover:shadow-md flex flex-col justify-between ${
                  !reminder.enabled 
                    ? 'border-slate-200 opacity-70 bg-slate-50/40' 
                    : isToday 
                    ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-amber-100' 
                    : isTomorrow 
                    ? 'border-indigo-300 ring-1 ring-indigo-200' 
                    : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                {/* Top Row: Member Info + Status Toggle */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                        {reminder.memberName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate" title={reminder.memberName}>
                          {reminder.memberName}
                        </h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Cake className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>{normalizeBirthdayString(reminder.birthday)}</span>
                          {daysUntil !== null && (
                            <span className={`px-1.5 py-0.2 rounded-full font-bold text-[9px] ${
                              isToday 
                                ? 'bg-amber-500 text-white animate-pulse' 
                                : isTomorrow 
                                ? 'bg-indigo-100 text-indigo-800' 
                                : isDueSoon 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {isToday ? 'Today! 🎉' : isTomorrow ? 'Tomorrow' : `In ${daysUntil}d`}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Enable / Pause Switch */}
                    <button
                      onClick={() => handleToggleActive(reminder.id, reminder.enabled)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        reminder.enabled ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                      title={reminder.enabled ? 'Active - Click to Pause' : 'Paused - Click to Activate'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          reminder.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Badges & Alert Settings */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Advance Timing Badge */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        {reminder.advanceDays === 0 ? 'Same-Day (0-Day)' : `${reminder.advanceDays} Days in Advance`}
                      </span>

                      {/* Recurrence Badge */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        <RefreshCw className="w-3 h-3 text-purple-500" />
                        {reminder.recurrence === 'YEARLY' ? 'Yearly' : reminder.recurrence === 'WEEKLY_BEFORE' ? 'Weekly' : reminder.recurrence === 'DAILY_WEEK_OF' ? 'Daily Week Of' : 'One-Time'}
                      </span>

                      {/* Time */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                        {reminder.alertTime || '08:00 AM'}
                      </span>
                    </div>

                    {/* Target Email */}
                    <div className="bg-slate-50/70 rounded-xl p-2.5 border border-slate-200/80 flex items-center justify-between gap-2">
                      <div className="min-w-0 flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-[11px] font-medium text-slate-700 truncate" title={reminder.targetEmail}>
                          {reminder.targetEmail}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(reminder.targetEmail, reminder.id)}
                        className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer shrink-0"
                        title="Copy target email"
                      >
                        {copiedId === reminder.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Subject snippet */}
                    <div className="text-[11px] text-slate-600 font-medium line-clamp-1 bg-white p-2 rounded-lg border border-slate-100">
                      <span className="text-slate-400 font-normal">Subject: </span>
                      {reminder.subject}
                    </div>

                    {/* Custom Notes */}
                    {reminder.customNotes && (
                      <p className="text-[10px] text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100 line-clamp-2">
                        📝 {reminder.customNotes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Actions & Status */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[10px] text-slate-400">
                    {reminder.lastDispatchedAt ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCheck className="w-3 h-3 text-emerald-500" />
                        Dispatched {reminder.lastDispatchedAt}
                      </span>
                    ) : (
                      <span className="text-slate-400">Awaiting trigger</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Trigger test alert now */}
                    <button
                      onClick={() => handleTriggerReminderNow(reminder)}
                      disabled={isDispatching}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200 transition cursor-pointer flex items-center gap-1"
                      title="Dispatch test email alert right now to target mailbox"
                    >
                      {isDispatching ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Send className="w-3 h-3 text-indigo-600" />
                      )}
                      Test Send
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleOpenEditModal(reminder)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title="Edit reminder settings"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteReminder(reminder.id, reminder.memberName)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Reminder Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Bell className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {editingReminder ? 'Edit Birthday Email Reminder' : 'Set Custom Birthday Email Alert'}
                    </h3>
                    <p className="text-xs text-slate-500">Configure recurring email alerts leveraging existing email infrastructure</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveReminder} className="p-6 space-y-4">
                {/* 1. Select Team Member */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Team Member <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.memberId}
                    onChange={(e) => handleMemberSelect(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">Select team member...</option>
                    {members.map((m) => (
                      <option key={m.id || m.sl} value={m.id || m.sl}>
                        {m.name} — {normalizeBirthdayString(m.birthday)} ({m.designation || 'Team Member'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Target Recipient Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Recipient Alert Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. anik.barua@kdsgroup.net or manager@kdsgroup.net"
                      value={formData.targetEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetEmail: e.target.value }))}
                      className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">This mailbox will receive the recurring birthday alert notification.</p>
                </div>

                {/* 3. Advance Warning Days */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Advance Warning Schedule
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[
                      { days: 0, label: 'Day of (0d)' },
                      { days: 1, label: '1 Day Before' },
                      { days: 3, label: '3 Days Before' },
                      { days: 7, label: '1 Week Before' },
                      { days: 14, label: '2 Weeks' }
                    ].map(item => (
                      <button
                        type="button"
                        key={item.days}
                        onClick={() => handleAdvanceDaysChange(item.days)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold text-center border transition cursor-pointer ${
                          formData.advanceDays === item.days
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Recurrence & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Recurrence Pattern
                    </label>
                    <select
                      value={formData.recurrence}
                      onChange={(e) => setFormData(prev => ({ ...prev, recurrence: e.target.value as ReminderRecurrence }))}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="YEARLY">Yearly (Every Year on Birthday)</option>
                      <option value="WEEKLY_BEFORE">Weekly (Leading to Birthday)</option>
                      <option value="DAILY_WEEK_OF">Daily during Birthday Week</option>
                      <option value="ONE_TIME">One-Time (This Year Only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Preferred Dispatch Time
                    </label>
                    <select
                      value={formData.alertTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, alertTime: e.target.value }))}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="07:00 AM">07:00 AM (Early Bird)</option>
                      <option value="08:00 AM">08:00 AM (Morning Standard)</option>
                      <option value="09:00 AM">09:00 AM (Workday Start)</option>
                      <option value="12:00 PM">12:00 PM (Midday Noon)</option>
                      <option value="05:00 PM">05:00 PM (Evening Briefing)</option>
                    </select>
                  </div>
                </div>

                {/* 5. Custom Subject Line */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Subject Line
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g. 🔔 [Birthday Reminder] Upcoming Birthday..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                </div>

                {/* 6. Custom Notes / Checklist */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Action Items / Personal Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.customNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, customNotes: e.target.value }))}
                    placeholder="e.g. Prepare executive greeting card, verify Column K WhatsApp message, order cake..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Alert Activation</p>
                    <p className="text-[11px] text-slate-500">Enable automated schedule execution immediately upon saving</p>
                  </div>
                  <input
                    type="checkbox"
                    id="reminder-enabled-toggle"
                    checked={formData.enabled}
                    onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                </div>

                {/* Form Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {editingReminder ? 'Update Reminder' : 'Save Email Alert'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
