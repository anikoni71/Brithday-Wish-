import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TeamMember, TwilioConfig, LogEntry, AutomationLogEntry } from './types';
import { Header } from './components/Header';
import { BirthdayCakeHero } from './components/BirthdayCakeHero';
import { TodayBirthdayBanner } from './components/TodayBirthdayBanner';
import { UpcomingBirthdayAlertBanner } from './components/UpcomingBirthdayAlertBanner';
import { AdminAdvanceAlertModal } from './components/AdminAdvanceAlertModal';
import { RosterTable } from './components/RosterTable';
import { WishGeneratorModal } from './components/WishGeneratorModal';
import { AppsScriptStudio } from './components/AppsScriptStudio';
import { TwilioTester } from './components/TwilioTester';
import { AutomationHistory } from './components/AutomationHistory';
import { BirthdayDistributionChart } from './components/BirthdayDistributionChart';
import { MailWorkstation } from './components/MailWorkstation';
import { FestiveCalendarWorkstation } from './components/FestiveCalendarWorkstation';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { DispatchInsights } from './components/DispatchInsights';
import { checkIsTodayBirthday, getUpcomingBirthdayInfo } from './utils/dateUtils';
import { triggerBirthdayConfetti } from './utils/confetti';
import { useTeamData } from './hooks/useTeamData';
import { computeDerivedAnalytics } from './utils/analyticsCalculations';
import {
  requestNotificationPermission,
  sendBrowserBirthdayNotification,
  updateDocumentTitleWithBirthdayReminder,
  areNotificationsEnabled,
} from './utils/browserNotifications';
import { playBirthdayAlertChime, playSuccessChime } from './utils/notificationSound';
import { Sparkles, Calendar, Users, PhoneCall, Code2, CheckCircle2, X, Bot, Mail, RefreshCw, Bell, AlertCircle } from 'lucide-react';

interface ToastNotification {
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
  recipientName?: string;
  errorDetails?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'insights' | 'roster' | 'festive' | 'email' | 'generator' | 'script' | 'automation' | 'tester'>('dashboard');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);
  const [toastNotification, setToastNotification] = useState<ToastNotification | null>(null);
  const [isWishModalOpen, setIsWishModalOpen] = useState<boolean>(false);
  const [isAdminPlanningOpen, setIsAdminPlanningOpen] = useState<boolean>(false);
  const [isAlertBannerDismissed, setIsAlertBannerDismissed] = useState<boolean>(false);
  const [selectedMemberForWish, setSelectedMemberForWish] = useState<TeamMember | null>(null);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState<boolean>(false);
  const [manualLogs, setManualLogs] = useState<LogEntry[]>([]);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<number | null>(null);
  const [rosterFilterType, setRosterFilterType] = useState<'all' | 'today' | 'due_soon' | 'sent_2026' | 'pending' | 'has_wa'>('all');

  // Desktop Notifications & Audio settings
  const [desktopNotificationsEnabled, setDesktopNotificationsEnabled] = useState<boolean>(() => {
    return areNotificationsEnabled() && localStorage.getItem('desktop_notifications_pref') === 'true';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('birthday_sound_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  const hasTriggeredInitialAlertsRef = useRef(false);

  // Persistent Twilio & Connected WhatsApp Number configuration (Default: +8801625299521)
  const [twilioConfig, setTwilioConfig] = useState<TwilioConfig>(() => {
    const saved = localStorage.getItem('twilio_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.whatsappNumber) return parsed;
      } catch (e) {}
    }
    return {
      accountSid: 'YOUR_TWILIO_ACCOUNT_SID',
      authToken: 'YOUR_TWILIO_AUTH_TOKEN',
      whatsappNumber: 'whatsapp:+8801625299521',
    };
  });

  const handleUpdateTwilioConfig = (newConfig: TwilioConfig) => {
    setTwilioConfig(newConfig);
    localStorage.setItem('twilio_config', JSON.stringify(newConfig));
  };

  // Local persistent tracker for wish sent status per year
  const [sentYearMap, setSentYearMap] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('birthday_sent_year_map');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });

  // Centralized State & Single Source of Truth via Dedicated Hook
  const {
    teamMembers,
    adminConfig,
    automationLogs,
    emailLogs,
    isLoading,
    isSyncing,
    isRealtimeConnected,
    lastSynced,
    error,
    refetch,
    refetchAutomationLogs,
    refetchEmailLogs,
    setTeamMembers,
    setAutomationLogs,
  } = useTeamData(autoSyncEnabled, sentYearMap);

  // Automatically keep twilioConfig sender synced with Google Sheet master source
  useEffect(() => {
    if (adminConfig) {
      setTwilioConfig((prev) => {
        let updated = false;
        const newConfig = { ...prev };

        if (adminConfig.senderWhatsApp) {
          const formatted = adminConfig.senderWhatsApp.startsWith('whatsapp:')
            ? adminConfig.senderWhatsApp
            : `whatsapp:${adminConfig.senderWhatsApp}`;
          if (prev.whatsappNumber !== formatted) {
            newConfig.whatsappNumber = formatted;
            updated = true;
          }
        }

        if (adminConfig.twilioAccountSid && adminConfig.twilioAccountSid !== prev.accountSid) {
          newConfig.accountSid = adminConfig.twilioAccountSid;
          updated = true;
        }

        if (adminConfig.twilioAuthToken && adminConfig.twilioAuthToken !== prev.authToken) {
          newConfig.authToken = adminConfig.twilioAuthToken;
          updated = true;
        }

        return updated ? newConfig : prev;
      });
    }
  }, [adminConfig]);

  // Pre-calculated memoized derived analytics
  const derivedAnalytics = useMemo(() => {
    return computeDerivedAnalytics(teamMembers, emailLogs);
  }, [teamMembers, emailLogs]);

  const todayBirthdays = useMemo(() => {
    return teamMembers.filter((m) => m.isBirthdayToday || checkIsTodayBirthday(m.birthday));
  }, [teamMembers]);

  const dueSoonBirthdays = useMemo(() => {
    return teamMembers.filter((m) => {
      const info = getUpcomingBirthdayInfo(m.birthday, 7);
      return info.isDueSoon && !info.isToday;
    });
  }, [teamMembers]);

  // Sync browser tab title with dynamic reminder badge
  useEffect(() => {
    updateDocumentTitleWithBirthdayReminder(todayBirthdays.length, dueSoonBirthdays.length);
  }, [todayBirthdays.length, dueSoonBirthdays.length]);

  // Trigger initial sound & desktop alert when data first loads
  useEffect(() => {
    if (teamMembers.length > 0 && !hasTriggeredInitialAlertsRef.current) {
      hasTriggeredInitialAlertsRef.current = true;

      // Play audio chime if enabled and there are birthdays today or due soon
      if (soundEnabled && (todayBirthdays.length > 0 || dueSoonBirthdays.length > 0)) {
        // Small delay to allow audio context readiness
        setTimeout(() => {
          playBirthdayAlertChime(soundEnabled);
        }, 800);
      }

      // Dispatch desktop notification if permission enabled
      if (desktopNotificationsEnabled && (todayBirthdays.length > 0 || dueSoonBirthdays.length > 0)) {
        if (todayBirthdays.length > 0) {
          sendBrowserBirthdayNotification(
            `🎉 Birthday Alert: ${todayBirthdays.length} Celebrant(s) Today!`,
            `${todayBirthdays.map((m) => m.name).join(', ')} from the IE Central Team have birthdays today.`
          );
        } else if (dueSoonBirthdays.length > 0) {
          const firstDue = dueSoonBirthdays[0];
          sendBrowserBirthdayNotification(
            `🔔 Advance Birthday Alert (${dueSoonBirthdays.length} Due Soon)`,
            `${firstDue.name}'s birthday is coming up on ${firstDue.birthday}. Total ${dueSoonBirthdays.length} due this week.`
          );
        }
      }
    }
  }, [teamMembers.length, todayBirthdays, dueSoonBirthdays, soundEnabled, desktopNotificationsEnabled]);

  // Toggle Desktop Notifications
  const handleToggleDesktopNotifications = async () => {
    if (!desktopNotificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        setDesktopNotificationsEnabled(true);
        localStorage.setItem('desktop_notifications_pref', 'true');
        sendBrowserBirthdayNotification(
          '🔔 Desktop Notifications Enabled!',
          'You will receive instant alerts for today and due soon birthdays (1-7 days advance).'
        );
      } else {
        alert('Notification permission was blocked in your browser. Please enable permissions in browser site settings.');
      }
    } else {
      setDesktopNotificationsEnabled(false);
      localStorage.setItem('desktop_notifications_pref', 'false');
    }
  };

  // Toggle Sound Chimes
  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('birthday_sound_enabled', String(next));
      if (next) {
        playBirthdayAlertChime(true);
      }
      return next;
    });
  };

  // Handle View Due Soon filter from Alert Banner
  const handleViewDueSoonFilter = () => {
    setActiveTab('roster');
    setRosterFilterType('due_soon');
    setSelectedMonthFilter(null);
  };

  // Simulate Google Apps Script 8:00 AM Cloud Trigger run
  const handleSimulateTriggerRun = async () => {
    const todayMember = derivedAnalytics.todayCelebrants[0] || teamMembers.find(m => m.whatsapp) || teamMembers[0];
    try {
      await fetch('/api/automation-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: todayMember ? todayMember.name : "Dipankar Barua",
          recipientPhone: todayMember ? (todayMember.whatsapp || todayMember.mobile) : "+8801829870593",
          status: "SUCCESS",
          message: todayMember ? todayMember.wishingMessage : "Happy Birthday, Dipankar! Wishing you a great day from the IE Central Team. 🎉",
          details: "Google Apps Script 8:00 AM Trigger executed successfully via Cloud runner. Column L updated.",
          triggerSource: "Google Apps Script (Time-Driven 8:00 AM)"
        })
      });
      await refetchAutomationLogs();
    } catch (e) {
      console.error('Simulation trigger error:', e);
    }
  };

  // Toggle wish sent status for current year
  const handleToggleWishSent = (idOrSl: string) => {
    const currentYear = new Date().getFullYear().toString();
    const key = idOrSl;

    setSentYearMap((prev) => {
      const existing = prev[key];
      const newYear = existing === currentYear ? '' : currentYear;
      const updated = { ...prev, [key]: newYear };
      localStorage.setItem('birthday_sent_year_map', JSON.stringify(updated));
      return updated;
    });

    setTeamMembers((prev) =>
      prev.map((m) => {
        const memberKey = m.id || m.sl;
        if (memberKey === idOrSl) {
          const existingYear = m.lastSentYear ? m.lastSentYear.toString() : '';
          const updatedYear = existingYear === currentYear ? '' : currentYear;
          const isDispatched = updatedYear === currentYear;
          return { ...m, lastSentYear: updatedYear, serverDispatched: isDispatched };
        }
        return m;
      })
    );
  };

  // Handle open wish generator for a specific member
  const handleOpenGenerator = (member: TeamMember) => {
    setSelectedMemberForWish(member);
    setIsWishModalOpen(true);
  };

  // Handle Send WhatsApp message via backend API & connected WhatsApp sender
  const handleSendWhatsApp = async (member: TeamMember, messageOverride?: string) => {
    const messageToSend = messageOverride || member.wishingMessage;
    const phone = member.whatsapp || member.mobile;

    if (!phone) {
      alert(`No WhatsApp phone number set for ${member.name}`);
      return;
    }

    const currentYear = new Date().getFullYear().toString();
    const memberKey = member.id || member.sl;

    // Automatically mark as sent for current year
    setSentYearMap((prev) => {
      const updated = { ...prev, [memberKey]: currentYear };
      localStorage.setItem('birthday_sent_year_map', JSON.stringify(updated));
      return updated;
    });

    setTeamMembers((prev) =>
      prev.map((m) => {
        if ((m.id && m.id === memberKey) || m.sl === memberKey) {
          return { ...m, lastSentYear: currentYear };
        }
        return m;
      })
    );

    setIsSendingWhatsApp(true);
    try {
      const res = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phone,
          message: messageToSend,
          accountSid: twilioConfig.accountSid,
          authToken: twilioConfig.authToken,
          fromNumber: twilioConfig.whatsappNumber,
          member: member,
        }),
      });

      const rawText = await res.text().catch(() => '');
      let data: any = {};
      if (rawText && rawText.trim().length > 0) {
        try {
          data = JSON.parse(rawText);
        } catch {
          data = { success: res.ok, message: rawText };
        }
      } else if (res.ok) {
        data = { success: true, serverDispatched: true, message: 'Delivered successfully' };
      } else {
        data = { success: false, error: `HTTP ${res.status} error: Empty response` };
      }

      const isDispatched = data.serverDispatched || data.success;

      setTeamMembers((prev) =>
        prev.map((m) => {
          if ((m.id && m.id === memberKey) || m.sl === memberKey) {
            return {
              ...m,
              lastSentYear: currentYear,
              serverDispatched: isDispatched,
              lastDispatchError: !data.success ? (data.error || data.message) : undefined
            };
          }
          return m;
        })
      );

      // Record entry in automationLogs API
      fetch('/api/automation-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: member.name,
          recipientPhone: phone,
          status: data.success ? 'SUCCESS' : 'FAILED',
          message: messageToSend,
          details: data.success
            ? `Headless Server Dispatch executed via Assistro Gateway.`
            : `Dispatch failed: ${data.error || data.message || 'API error'}`,
          triggerSource: 'Server Headless Dispatch'
        })
      }).then(() => refetchAutomationLogs()).catch(() => {});

      if (data.success) {
        triggerBirthdayConfetti();
        playSuccessChime(soundEnabled);

        setToastNotification({
          type: 'success',
          title: 'Wish Dispatched Automatically via +8801625299521 (Background Automation)',
          message: `Direct background HTTP POST dispatch completed for ${member.name}. Zero manual touch required.`,
          recipientName: member.name,
        });
      } else {
        const errorDetail = data.error || data.message || 'Assistro WhatsApp Gateway returned an error.';
        setToastNotification({
          type: 'error',
          title: 'WhatsApp Dispatch Failed',
          message: `${errorDetail} (Recipient: ${member.name})`,
          recipientName: member.name,
          errorDetails: errorDetail
        });
      }
    } catch (err: any) {
      console.error('Send WhatsApp error:', err);
      const errMsg = err.message || 'Network exception connecting to WhatsApp service';

      setToastNotification({
        type: 'error',
        title: 'WhatsApp Gateway Error',
        message: `${errMsg} (Recipient: ${member.name})`,
        recipientName: member.name,
        errorDetails: errMsg
      });
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  // Direct test send from tester tab
  const handleSendWhatsAppDirect = async (phone: string, msg: string) => {
    if (!phone) return;

    setIsSendingWhatsApp(true);
    try {
      const res = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phone,
          message: msg,
          accountSid: twilioConfig.accountSid,
          authToken: twilioConfig.authToken,
          fromNumber: twilioConfig.whatsappNumber,
        }),
      });

      const rawText = await res.text().catch(() => '');
      let data: any = {};
      if (rawText && rawText.trim().length > 0) {
        try {
          data = JSON.parse(rawText);
        } catch {
          data = { success: res.ok, message: rawText };
        }
      } else if (res.ok) {
        data = { success: true, serverDispatched: true, message: 'Delivered successfully' };
      } else {
        data = { success: false, error: `HTTP ${res.status} error: Empty response` };
      }

      const newManualLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        type: data.success ? 'success' : 'error',
        recipient: phone,
        message: msg,
        details: data.success ? `Manual Test Dispatch via +8801625299521` : `Error: ${data.error || data.message}`,
        source: 'manual',
      };

      setManualLogs((prev) => [newManualLog, ...prev]);

      if (data.success) {
        triggerBirthdayConfetti();
        playSuccessChime(soundEnabled);

        setToastNotification({
          type: 'success',
          title: 'Wish Dispatched Automatically via +8801625299521 (Background Automation)',
          message: `Direct background HTTP POST test dispatch to ${phone} completed. Zero manual touch required.`,
          recipientName: phone,
        });
      } else {
        const errorDetail = data.error || data.message || 'Assistro WhatsApp Gateway returned an error.';
        setToastNotification({
          type: 'error',
          title: 'WhatsApp Test Dispatch Failed',
          message: `${errorDetail} (Recipient: ${phone})`,
          recipientName: phone,
          errorDetails: errorDetail
        });
      }
    } catch (err: any) {
      const errMsg = err.message || 'Network exception connecting to WhatsApp service';
      setToastNotification({
        type: 'error',
        title: 'WhatsApp Dispatch Error',
        message: `${errMsg} (Recipient: ${phone})`,
        recipientName: phone,
        errorDetails: errMsg
      });
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  // Local update of member's wishing message
  const handleUpdateMemberMessage = (idOrSl: string, newMessage: string) => {
    setTeamMembers((prev) =>
      prev.map((m) => {
        if ((m.id && m.id === idOrSl) || m.sl === idOrSl) {
          return { ...m, wishingMessage: newMessage };
        }
        return m;
      })
    );
  };

  // Local update of member's email address
  const handleUpdateMemberEmail = (idOrSl: string, newEmail: string) => {
    setTeamMembers((prev) =>
      prev.map((m) => {
        if ((m.id && m.id === idOrSl) || m.sl === idOrSl) {
          return { ...m, email: newEmail };
        }
        return m;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-800 antialiased flex flex-col relative">
      
      {/* Toast Notification Banner Overlay */}
      {toastNotification && (
        <div
          className={`fixed top-20 right-4 sm:right-6 z-50 max-w-md w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border animate-in fade-in slide-in-from-top duration-300 ${
            toastNotification.type === 'error'
              ? 'border-rose-500/50 shadow-rose-950/30'
              : toastNotification.type === 'info'
              ? 'border-sky-500/50 shadow-sky-950/30'
              : 'border-emerald-500/40 shadow-emerald-950/30'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                toastNotification.type === 'error'
                  ? 'bg-rose-500/20 text-rose-400'
                  : toastNotification.type === 'info'
                  ? 'bg-sky-500/20 text-sky-400'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {toastNotification.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-rose-400" />
              ) : toastNotification.type === 'info' ? (
                <Bell className="w-5 h-5 text-sky-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                {toastNotification.title}
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {toastNotification.message}
              </p>

              <div className="mt-2.5 flex items-center gap-2">
                {toastNotification.type === 'error' ? (
                  <span className="px-2.5 py-1 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold inline-flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                    Assistro Gateway Response Error
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    100% Direct API Dispatched (+8801625299521)
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition cursor-pointer"
              title="Close Notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Header with Notification Controls */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSync={() => refetch(false)}
        isSyncing={isSyncing}
        error={error}
        isRealtimeConnected={isRealtimeConnected}
        lastSynced={lastSynced}
        todayCount={todayBirthdays.length}
        dueSoonCount={dueSoonBirthdays.length}
        connectedPhone={adminConfig?.senderWhatsApp || twilioConfig.whatsappNumber}
        adminConfig={adminConfig}
        autoSyncEnabled={autoSyncEnabled}
        onToggleAutoSync={() => setAutoSyncEnabled((prev) => !prev)}
        desktopNotificationsEnabled={desktopNotificationsEnabled}
        onToggleDesktopNotifications={handleToggleDesktopNotifications}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenNotificationCenter={() => setIsAdminPlanningOpen(true)}
        onOpenAdminPlanning={() => setIsAdminPlanningOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* In-App Notification Alert Banner for Due Soon & Today Birthdays */}
        <UpcomingBirthdayAlertBanner
          members={teamMembers}
          onViewDueSoon={handleViewDueSoonFilter}
          onOpenAdminPlanning={() => setIsAdminPlanningOpen(true)}
          onDismiss={() => setIsAlertBannerDismissed(true)}
          isDismissed={isAlertBannerDismissed}
        />

        {/* Top Summary Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Team</p>
              <p className="text-lg font-bold text-slate-900">{teamMembers.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-amber-200 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Today's Birthdays</p>
              <p className="text-lg font-bold text-amber-600">{todayBirthdays.length}</p>
            </div>
          </div>

          <div
            className="bg-white rounded-2xl p-3.5 border border-amber-200 shadow-2xs flex items-center gap-3 cursor-pointer hover:border-amber-400 transition"
            onClick={() => setActiveTab('festive')}
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Festive Hub</p>
              <p className="text-xs font-bold text-amber-800 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Special Days
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <PhoneCall className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sender WA</p>
              <p className="text-xs font-mono font-bold text-slate-900 mt-0.5 truncate max-w-[95px]" title={adminConfig?.senderWhatsApp || twilioConfig.whatsappNumber}>
                {(adminConfig?.senderWhatsApp || twilioConfig.whatsappNumber).replace('whatsapp:', '')}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-indigo-200 shadow-2xs flex items-center gap-3 cursor-pointer hover:border-indigo-300 transition" onClick={() => setActiveTab('email')}>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
              <Mail className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admin Email</p>
              <p className="text-xs font-bold text-indigo-700 mt-0.5 flex items-center gap-1 truncate max-w-[95px]" title={adminConfig?.adminEmail || 'anik.barua@kdsgroup.net'}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                {adminConfig?.adminEmail || 'anik.barua@kdsgroup.net'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center gap-3 cursor-pointer hover:border-slate-300 transition" onClick={() => setIsAdminPlanningOpen(true)}>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
              <Bell className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admin Planning</p>
              <p className="text-xs font-bold text-amber-700 flex items-center gap-1 mt-0.5 truncate max-w-[95px]" title={adminConfig?.adminWhatsApp || '+8801625299521'}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block shrink-0"></span>
                {(adminConfig?.adminWhatsApp || '+8801625299521').replace('whatsapp:', '')}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive 3D Animated Birthday Cake Hero & Celebration Experience */}
        {activeTab === 'roster' && (
          <BirthdayCakeHero
            todayBirthdays={todayBirthdays}
            dueSoonBirthdays={dueSoonBirthdays}
            onOpenWishModal={handleOpenGenerator}
          />
        )}

        {/* Today's Birthday Banner (Only on Roster or Global) */}
        {activeTab === 'roster' && (
          <TodayBirthdayBanner
            todayBirthdays={todayBirthdays}
            onOpenGenerator={handleOpenGenerator}
            onSendWhatsApp={handleSendWhatsApp}
            isSending={isSendingWhatsApp}
          />
        )}

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            members={teamMembers}
            adminConfig={adminConfig}
            emailLogs={emailLogs}
            automationLogs={automationLogs}
            isRealtimeConnected={isRealtimeConnected}
            lastSynced={lastSynced}
            onSync={() => refetch(false)}
            isSyncing={isSyncing}
            onOpenGenerator={handleOpenGenerator}
            onSendWhatsApp={handleSendWhatsApp}
            isSendingWhatsApp={isSendingWhatsApp}
            onNavigateTab={setActiveTab}
            onOpenAdminPlanning={() => setIsAdminPlanningOpen(true)}
          />
        )}

        {activeTab === 'insights' && (
          <DispatchInsights 
            automationLogs={automationLogs}
            emailLogs={emailLogs}
            members={teamMembers}
          />
        )}

        {/* Central IE Team Roster & Birthday Workstation */}
        {activeTab === 'roster' && (
          <div className="space-y-6">
            {/* D3 Birthday Distribution Chart Section with Pre-Calculated Props */}
            <BirthdayDistributionChart
              members={teamMembers}
              monthData={derivedAnalytics.monthlyBirthdayData}
              selectedMonth={selectedMonthFilter}
              onSelectMonth={(month) => {
                setSelectedMonthFilter(month);
                setRosterFilterType('all');
              }}
            />

            {/* Central IE Team Roster Table */}
            <RosterTable
              members={teamMembers}
              selectedMonthFilter={selectedMonthFilter}
              onClearMonthFilter={() => setSelectedMonthFilter(null)}
              externalFilterType={rosterFilterType}
              onFilterChange={setRosterFilterType}
              onOpenGenerator={handleOpenGenerator}
              onSendWhatsApp={handleSendWhatsApp}
              isSending={isSendingWhatsApp}
              onUpdateMemberMessage={handleUpdateMemberMessage}
              onToggleWishSent={handleToggleWishSent}
            />
          </div>
        )}

        {/* Dedicated Global Special Days & Festive Calendar Workstation */}
        {activeTab === 'festive' && (
          <FestiveCalendarWorkstation
            members={teamMembers}
            onOpenGenerator={handleOpenGenerator}
            onSendWhatsApp={handleSendWhatsApp}
            onNavigateToRosterMonth={(month) => {
              setSelectedMonthFilter(month);
              setRosterFilterType('all');
              setActiveTab('roster');
            }}
          />
        )}

        {/* Mail Workstation */}
        {activeTab === 'email' && (
          <MailWorkstation
            members={teamMembers}
            onUpdateMemberEmail={handleUpdateMemberEmail}
            onUpdateMemberWish={handleUpdateMemberMessage}
            onSendWhatsApp={handleSendWhatsApp}
          />
        )}

        {/* Wish Generator Hub */}
        {activeTab === 'generator' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs mb-8 max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Team Leader Wish Generator Hub
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Craft concise, warm 1-2 sentence birthday wishes ending with "Wishing you a great day from the IE Central Team!"
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedMemberForWish(todayBirthdays[0] || teamMembers[0] || null);
                setIsWishModalOpen(true);
              }}
              className="w-full py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Launch Interactive Wish Generator Modal
            </button>
          </div>
        )}

        {/* Apps Script Studio */}
        {activeTab === 'script' && (
          <AppsScriptStudio
            twilioConfig={twilioConfig}
            adminConfig={adminConfig}
            onUpdateTwilioConfig={handleUpdateTwilioConfig}
          />
        )}

        {/* Automation History */}
        {activeTab === 'automation' && (
          <AutomationHistory
            logs={automationLogs}
            onRefresh={refetchAutomationLogs}
            onSimulateTriggerRun={handleSimulateTriggerRun}
            onClearLogs={() => setAutomationLogs([])}
          />
        )}

        {/* WhatsApp Tester & Credentials */}
        {activeTab === 'tester' && (
          <TwilioTester
            twilioConfig={twilioConfig}
            onUpdateTwilioConfig={handleUpdateTwilioConfig}
            logs={manualLogs}
            onClearLogs={() => setManualLogs([])}
            onSendWhatsAppDirect={handleSendWhatsAppDirect}
            isSending={isSendingWhatsApp}
          />
        )}
      </main>

      {/* Wish Generator Modal */}
      <WishGeneratorModal
        isOpen={isWishModalOpen}
        onClose={() => setIsWishModalOpen(false)}
        teamMembers={teamMembers}
        initialMember={selectedMemberForWish}
        onSendWhatsApp={handleSendWhatsApp}
        onApplyWishToMember={(idOrSl, wish) => {
          handleUpdateMemberMessage(idOrSl, wish);
          setIsWishModalOpen(false);
          alert('Updated local Column K wish preview!');
        }}
      />

      {/* Admin Advance Birthday Planning Alert Modal */}
      <AdminAdvanceAlertModal
        isOpen={isAdminPlanningOpen}
        onClose={() => setIsAdminPlanningOpen(false)}
        members={teamMembers}
        twilioConfig={twilioConfig}
        adminConfig={adminConfig}
        onRefreshLogs={refetchAutomationLogs}
        onReCollectFromSheet={() => refetch(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          IE Central Team Birthday Wishing System • Connected WhatsApp: {twilioConfig.whatsappNumber.replace('whatsapp:', '')}
        </div>
      </footer>
    </div>
  );
}
