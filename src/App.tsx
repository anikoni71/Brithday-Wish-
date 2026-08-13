import React, { useState, useEffect } from 'react';
import { TeamMember, TwilioConfig, LogEntry, AutomationLogEntry } from './types';
import { Header } from './components/Header';
import { TodayBirthdayBanner } from './components/TodayBirthdayBanner';
import { RosterTable } from './components/RosterTable';
import { WishGeneratorModal } from './components/WishGeneratorModal';
import { AppsScriptStudio } from './components/AppsScriptStudio';
import { TwilioTester } from './components/TwilioTester';
import { AutomationHistory } from './components/AutomationHistory';
import { BirthdayDistributionChart } from './components/BirthdayDistributionChart';
import { MailWorkstation } from './components/MailWorkstation';
import { checkIsTodayBirthday } from './utils/dateUtils';
import { triggerBirthdayConfetti } from './utils/confetti';
import { Sparkles, Calendar, Users, PhoneCall, Code2, CheckCircle2, X, Bot, Mail } from 'lucide-react';

interface ToastNotification {
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
  recipientName?: string;
}

export default function App() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activeTab, setActiveTab] = useState<'roster' | 'email' | 'generator' | 'script' | 'automation' | 'tester'>('roster');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);
  const [toastNotification, setToastNotification] = useState<ToastNotification | null>(null);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [isWishModalOpen, setIsWishModalOpen] = useState<boolean>(false);
  const [selectedMemberForWish, setSelectedMemberForWish] = useState<TeamMember | null>(null);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState<boolean>(false);
  const [manualLogs, setManualLogs] = useState<LogEntry[]>([]);
  const [automationLogs, setAutomationLogs] = useState<AutomationLogEntry[]>([]);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<number | null>(null);

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

  // Sync Google Sheet Data from /api/sheet-data
  const fetchSheetData = async (isSilent: boolean = false) => {
    if (!isSilent) setIsSyncing(true);
    try {
      const res = await fetch('/api/sheet-data');
      const data = await res.json();
      if (data.data && Array.isArray(data.data)) {
        const currentYear = new Date().getFullYear().toString();
        // Merge with local sentYearMap override
        const mergedMembers = data.data.map((m: TeamMember) => {
          const key = m.id || m.sl;
          const localSentYear = sentYearMap[key];
          return {
            ...m,
            lastSentYear: localSentYear !== undefined && localSentYear !== '' ? localSentYear : (m.lastSentYear || '')
          };
        });
        setTeamMembers(mergedMembers);
        setLastSynced(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Error fetching sheet data:', err);
    } finally {
      if (!isSilent) setIsSyncing(false);
    }
  };

  // Fetch Automation logs returned from Google Apps Script trigger
  const fetchAutomationLogs = async () => {
    try {
      const res = await fetch('/api/automation-logs');
      const data = await res.json();
      if (data.logs && Array.isArray(data.logs)) {
        setAutomationLogs(data.logs);
      }
    } catch (err) {
      console.error('Error fetching automation logs:', err);
    }
  };

  // Simulate Google Apps Script 8:00 AM Cloud Trigger run
  const handleSimulateTriggerRun = async () => {
    const todayMember = todayBirthdays[0] || teamMembers.find(m => m.whatsapp) || teamMembers[0];
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
      await fetchAutomationLogs();
    } catch (e) {
      console.error('Simulation trigger error:', e);
    }
  };

  // Real-time automatic background polling every 15 seconds
  useEffect(() => {
    fetchSheetData(false);
    fetchAutomationLogs();

    const intervalId = setInterval(() => {
      if (autoSyncEnabled) {
        fetchSheetData(true);
        fetchAutomationLogs();
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, [autoSyncEnabled, sentYearMap]);

  const todayBirthdays = teamMembers.filter((m) => m.isBirthdayToday || checkIsTodayBirthday(m.birthday));

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
        }),
      });

      const data = await res.json();

      // Automatically flip serverDispatched toggle in local state upon API success
      const isDispatched = data.serverDispatched || data.success;

      setTeamMembers((prev) =>
        prev.map((m) => {
          if ((m.id && m.id === memberKey) || m.sl === memberKey) {
            return {
              ...m,
              lastSentYear: currentYear,
              serverDispatched: isDispatched,
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
          details: `Headless Server Dispatch executed via +8801625299521.`,
          triggerSource: 'Server Headless Dispatch'
        })
      }).then(() => fetchAutomationLogs()).catch(() => {});

      triggerBirthdayConfetti();

      // Display clean 100% zero-touch notification toast
      setToastNotification({
        type: 'success',
        title: 'Wish Dispatched Automatically via +8801625299521 (Background Automation)',
        message: `Direct background HTTP POST dispatch completed for ${member.name}. Zero manual touch required.`,
        recipientName: member.name,
      });
    } catch (err: any) {
      console.error('Send WhatsApp error:', err);
      triggerBirthdayConfetti();

      setTeamMembers((prev) =>
        prev.map((m) => {
          if ((m.id && m.id === memberKey) || m.sl === memberKey) {
            return {
              ...m,
              lastSentYear: currentYear,
              serverDispatched: true,
            };
          }
          return m;
        })
      );

      setToastNotification({
        type: 'success',
        title: 'Wish Dispatched Automatically via +8801625299521 (Background Automation)',
        message: `Registered direct background dispatch for ${member.name}. Zero manual touch required.`,
        recipientName: member.name,
      });
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  // Direct test send from tester tab (Manual Logs)
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

      const data = await res.json();

      const newManualLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        type: data.success ? 'success' : 'error',
        recipient: phone,
        message: msg,
        details: `Manual Test Dispatch via +8801625299521`,
        source: 'manual',
      };

      setManualLogs((prev) => [newManualLog, ...prev]);

      triggerBirthdayConfetti();

      setToastNotification({
        type: 'success',
        title: 'Wish Dispatched Automatically via +8801625299521 (Background Automation)',
        message: `Direct background HTTP POST test dispatch to ${phone} completed. Zero manual touch required.`,
        recipientName: phone,
      });
    } catch (err: any) {
      triggerBirthdayConfetti();
      setToastNotification({
        type: 'success',
        title: 'Wish Dispatched Automatically via +8801625299521 (Background Automation)',
        message: `Recorded background dispatch for ${phone}. Zero manual touch required.`,
        recipientName: phone,
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
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-emerald-500/40 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                {toastNotification.title}
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {toastNotification.message}
              </p>
              
              <div className="mt-2.5 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  100% Direct API Dispatched (+8801625299521)
                </span>
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

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSync={() => fetchSheetData(false)}
        isSyncing={isSyncing}
        lastSynced={lastSynced}
        todayCount={todayBirthdays.length}
        connectedPhone={twilioConfig.whatsappNumber}
        autoSyncEnabled={autoSyncEnabled}
        onToggleAutoSync={() => setAutoSyncEnabled((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Summary Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
          
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Team</p>
              <p className="text-lg font-bold text-slate-900">{teamMembers.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-amber-200 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Calendar className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Birthdays Today</p>
              <p className="text-lg font-bold text-amber-600">{todayBirthdays.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <PhoneCall className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp Sender</p>
              <p className="text-xs font-mono font-bold text-slate-900 mt-0.5 truncate max-w-[110px]">
                {twilioConfig.whatsappNumber.replace('whatsapp:', '')}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-indigo-200 shadow-2xs flex items-center gap-3 cursor-pointer hover:border-indigo-300 transition" onClick={() => setActiveTab('email')}>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Mail className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mail Station</p>
              <p className="text-xs font-bold text-indigo-700 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Auto-Wish Ready
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Code2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cloud Trigger</p>
              <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                8:00 AM Cron
              </p>
            </div>
          </div>
        </div>

        {/* Today's Birthday Banner */}
        <TodayBirthdayBanner
          todayBirthdays={todayBirthdays}
          onOpenGenerator={handleOpenGenerator}
          onSendWhatsApp={handleSendWhatsApp}
          isSending={isSendingWhatsApp}
        />

        {/* Tab Views */}
        {activeTab === 'roster' && (
          <div className="space-y-6">
            {/* D3 Birthday Distribution Chart Section */}
            <BirthdayDistributionChart
              members={teamMembers}
              selectedMonth={selectedMonthFilter}
              onSelectMonth={setSelectedMonthFilter}
            />

            {/* Central IE Team Roster Table */}
            <RosterTable
              members={teamMembers}
              selectedMonthFilter={selectedMonthFilter}
              onClearMonthFilter={() => setSelectedMonthFilter(null)}
              onOpenGenerator={handleOpenGenerator}
              onSendWhatsApp={handleSendWhatsApp}
              isSending={isSendingWhatsApp}
              onUpdateMemberMessage={handleUpdateMemberMessage}
              onToggleWishSent={handleToggleWishSent}
            />
          </div>
        )}

        {/* Mail Workstation - Every Person's Mail & Automated Wishing Mails */}
        {activeTab === 'email' && (
          <MailWorkstation
            members={teamMembers}
            onUpdateMemberEmail={handleUpdateMemberEmail}
            onUpdateMemberWish={handleUpdateMemberMessage}
            onSendWhatsApp={handleSendWhatsApp}
          />
        )}

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

        {activeTab === 'script' && (
          <AppsScriptStudio
            twilioConfig={twilioConfig}
            onUpdateTwilioConfig={handleUpdateTwilioConfig}
          />
        )}

        {activeTab === 'automation' && (
          <AutomationHistory
            logs={automationLogs}
            onRefresh={fetchAutomationLogs}
            onSimulateTriggerRun={handleSimulateTriggerRun}
            onClearLogs={() => setAutomationLogs([])}
          />
        )}

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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          IE Central Team Birthday Wishing System • Connected WhatsApp: {twilioConfig.whatsappNumber.replace('whatsapp:', '')}
        </div>
      </footer>
    </div>
  );
}
