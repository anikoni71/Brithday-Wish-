import React from 'react';
import { RefreshCw, ExternalLink, Cake, Sparkles, Code2, Send, PhoneCall, Radio, CheckCircle2, Bot, Mail, Bell, Volume2, VolumeX, Globe, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { AdminSheetConfig } from '../types';

interface HeaderProps {
  activeTab: 'dashboard' | 'roster' | 'festive' | 'email' | 'generator' | 'script' | 'tester' | 'automation';
  setActiveTab: (tab: 'dashboard' | 'roster' | 'festive' | 'email' | 'generator' | 'script' | 'tester' | 'automation') => void;
  onSync: () => void;
  isSyncing: boolean;
  isRealtimeConnected?: boolean;
  lastSynced: string | null;
  todayCount: number;
  dueSoonCount?: number;
  connectedPhone?: string;
  adminConfig?: AdminSheetConfig;
  autoSyncEnabled?: boolean;
  onToggleAutoSync?: () => void;
  desktopNotificationsEnabled?: boolean;
  onToggleDesktopNotifications?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onOpenNotificationCenter?: () => void;
  onOpenAdminPlanning?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSync,
  isSyncing,
  isRealtimeConnected = true,
  lastSynced,
  todayCount,
  dueSoonCount = 0,
  connectedPhone = '+8801625299521',
  adminConfig,
  autoSyncEnabled = true,
  onToggleAutoSync,
  desktopNotificationsEnabled = false,
  onToggleDesktopNotifications,
  soundEnabled = true,
  onToggleSound,
  onOpenNotificationCenter,
  onOpenAdminPlanning,
}) => {
  const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTODUAg2mUYQUTN3P9SPB5Q41Ta_9SufI2gct0GBYDUbPSJX81O1mWHgBjElAIfNfobEbd7Mkii18lt/pubhtml?gid=0&single=true";

  const effectiveSender = adminConfig?.senderWhatsApp || connectedPhone;
  const displayPhone = effectiveSender.replace('whatsapp:', '');
  const totalUpcomingAlerts = todayCount + dueSoonCount;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Cake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  IE Central Team <span className="text-emerald-600">Birthday Wisher</span>
                </h1>
                {todayCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    {todayCount} Birthday{todayCount > 1 ? 's' : ''} Today!
                  </span>
                )}
                {dueSoonCount > 0 && todayCount === 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                    🔔 {dueSoonCount} Due Soon (7 Days)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                {/* Connected WhatsApp Sender Badge */}
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-300 font-mono text-[11px] font-bold shadow-2xs">
                  <PhoneCall className="w-3 h-3 text-emerald-600" />
                  Sender: {displayPhone}
                </span>

                {/* Auto Sync & Real-Time SSE Badge */}
                <button
                  onClick={onToggleAutoSync}
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border transition cursor-pointer shadow-2xs ${
                    autoSyncEnabled
                      ? 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                  title="Click to toggle real-time background sync"
                >
                  <Radio className={`w-3 h-3 ${isRealtimeConnected ? 'text-emerald-600 animate-pulse' : autoSyncEnabled ? 'text-blue-600 animate-pulse' : 'text-slate-400'}`} />
                  {isRealtimeConnected ? 'Sheet Real-Time (SSE)' : autoSyncEnabled ? 'Live Sync (15s)' : 'Sync Paused'}
                  {lastSynced && <span className="text-[10px] text-slate-500">({lastSynced})</span>}
                </button>

                {/* Google Sheet Direct Source Tag */}
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-teal-50 text-teal-900 border border-teal-300 text-[11px] font-bold shadow-2xs" title={`Single Source of Truth: Google Sheet (${adminConfig?.sheetName || 'Central IE List'})\nAdmin WA: ${adminConfig?.adminWhatsApp || '+8801625299521'}\nAdmin Email: ${adminConfig?.adminEmail || 'anik.barua@kdsgroup.net'}`}>
                  <CheckCircle2 className="w-3 h-3 text-teal-700" />
                  Sheet Synced ({adminConfig?.sheetName || 'Central IE List'})
                </span>
              </div>
            </div>
          </div>

          {/* Action Tools & Reminder Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Notification Bell with Badge Counter */}
            <button
              onClick={onOpenNotificationCenter}
              className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              title={`Notification Center (${totalUpcomingAlerts} upcoming birthdays)`}
            >
              <Bell className={`w-4 h-4 ${totalUpcomingAlerts > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-600'}`} />
              {totalUpcomingAlerts > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 flex items-center justify-center border-2 border-white shadow-xs">
                  {totalUpcomingAlerts}
                </span>
              )}
            </button>

            {/* Desktop Web Notifications Toggle */}
            {onToggleDesktopNotifications && (
              <button
                onClick={onToggleDesktopNotifications}
                className={`inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  desktopNotificationsEnabled
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
                title={desktopNotificationsEnabled ? 'Desktop Web Notifications Enabled' : 'Click to Enable Desktop Notifications'}
              >
                <Bell className={`w-3.5 h-3.5 ${desktopNotificationsEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">
                  {desktopNotificationsEnabled ? 'Desktop Alerts: ON' : 'Enable Desktop Alerts'}
                </span>
              </button>
            )}

            {/* Sound Chime Toggle */}
            {onToggleSound && (
              <button
                onClick={onToggleSound}
                className={`p-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  soundEnabled
                    ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                    : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                }`}
                title={soundEnabled ? 'Chime Audio Cue: Enabled (Plays on upcoming birthdays)' : 'Chime Audio Cue: Muted'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-amber-600" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
              </button>
            )}

            {/* Admin Planning Alert Trigger */}
            {onOpenAdminPlanning && (
              <button
                onClick={onOpenAdminPlanning}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 transition cursor-pointer shadow-xs"
                title="Admin Advance Birthday Planning Alert (WhatsApp + Email)"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Admin Planning</span>
                <span className="md:hidden">Planning</span>
              </button>
            )}

            <button
              onClick={onSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
              <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Sheet'}</span>
            </button>

            <a
              href={sheetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Central IE List</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 border-t border-slate-100 pt-2 overflow-x-auto no-scrollbar">
          {/* Executive Dashboard Tab (First Position) */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'border-indigo-600 text-indigo-900 bg-indigo-50/70 font-bold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-500'}`} />
            Executive Dashboard
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold">
              Overview
            </span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'roster'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Cake className="w-4 h-4" />
            Team Roster & Birthdays
            {todayCount > 0 ? (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                {todayCount}
              </span>
            ) : dueSoonCount > 0 ? (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold border border-amber-200">
                {dueSoonCount}
              </span>
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab('festive')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'festive'
                ? 'border-amber-500 text-amber-900 bg-amber-50/60 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4 text-amber-600" />
            Global Special Days & Festive Calendar
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-amber-100 text-amber-900 border border-amber-300 font-bold">
              2026
            </span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'email'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Mail className="w-4 h-4 text-indigo-600" />
            Mail Address & Auto-Wish
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold">
              Automated
            </span>
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'generator'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Wish Generator
          </button>

          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'script'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Code2 className="w-4 h-4 text-blue-600" />
            Google Apps Script (.gs)
          </button>

          <button
            onClick={() => setActiveTab('automation')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'automation'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-600 animate-pulse" />
            Automation History
          </button>

          <button
            onClick={() => setActiveTab('tester')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'tester'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Send className="w-4 h-4 text-purple-600" />
            WhatsApp Tester & Credentials
          </button>
        </div>
      </div>
    </header>
  );
};
