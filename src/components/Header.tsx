import React from 'react';
import { Car, RefreshCw, ExternalLink, Cake, Sparkles, Code2, Send, PhoneCall, Radio, CheckCircle2, Bot, Mail, Bell, Volume2, VolumeX, Globe, ShieldCheck, LayoutDashboard, TrendingUp, AlertCircle, Sun, Moon, Images } from 'lucide-react';
import { AdminSheetConfig } from '../types';

interface HeaderProps {
  activeTab: 'dashboard' | 'roster' | 'meanings' | 'festive' | 'email' | 'generator' | 'script' | 'tester' | 'automation' | 'insights' | 'gallery' | 'fortune';
  setActiveTab: (tab: 'dashboard' | 'roster' | 'meanings' | 'festive' | 'email' | 'generator' | 'script' | 'tester' | 'automation' | 'insights' | 'gallery' | 'fortune') => void;
  onSync: () => void;
  isSyncing: boolean;
  error?: string | null;
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
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSync,
  isSyncing,
  error = null,
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
  isDarkMode = false,
  onToggleTheme,
}) => {
  const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTODUAg2mUYQUTN3P9SPB5Q41Ta_9SufI2gct0GBYDUbPSJX81O1mWHgBjElAIfNfobEbd7Mkii18lt/pubhtml?gid=0&single=true";

  const effectiveSender = adminConfig?.senderWhatsApp || connectedPhone;
  const displayPhone = effectiveSender.replace('whatsapp:', '');
  const totalUpcomingAlerts = todayCount + dueSoonCount;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-rose-50 border-b border-rose-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-800 text-[11px] font-bold">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              ⚠️ {error}
            </div>
            <button 
              onClick={onSync}
              className="text-[10px] font-bold text-rose-700 hover:text-rose-900 underline uppercase tracking-wider cursor-pointer"
            >
              Force Retry Sync
            </button>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] border border-emerald-400/30 relative group overflow-hidden transition-all duration-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
              <Cake className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  IE Central Team <span className="text-emerald-600">Birthday Wisher</span>
                </h1>
                {todayCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 animate-pulse">
                    <Cake className="w-3.5 h-3.5 text-amber-600 cake-celebrate-anim" />
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
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50/70 text-emerald-950 border border-emerald-300/40 font-mono text-[11px] font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] shadow-xs">
                  <PhoneCall className="w-3 h-3 text-emerald-600 icon-breathing" />
                  Sender: {displayPhone}
                </span>

                {/* Auto Sync & Real-Time SSE Badge */}
                <button
                  onClick={onToggleAutoSync}
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border transition cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] shadow-xs ${
                    autoSyncEnabled
                      ? 'bg-blue-50/70 text-blue-950 border-blue-300/40 hover:bg-blue-100/70'
                      : 'bg-slate-100/70 text-slate-700 border-slate-300/40 hover:bg-slate-200/70'
                  }`}
                  title="Click to toggle real-time background sync"
                >
                  <Radio className={`w-3 h-3 icon-breathing ${isRealtimeConnected ? 'text-emerald-600' : autoSyncEnabled ? 'text-blue-600' : 'text-slate-400'}`} />
                  {isRealtimeConnected ? 'Sheet Real-Time (SSE)' : autoSyncEnabled ? 'Live Sync (15s)' : 'Sync Paused'}
                  {lastSynced && <span className="text-[10px] text-slate-500">({lastSynced})</span>}
                </button>

                {/* Google Sheet Direct Source Tag */}
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.08)] shadow-xs ${error ? 'bg-rose-50/70 text-rose-950 border-rose-300/40' : 'bg-emerald-50/70 text-emerald-950 border-emerald-300/40'}`} title={error ? `Error: ${error}` : `Single Source of Truth: Google Sheet (${adminConfig?.sheetName || 'Central IE List'})\nAdmin WA: ${adminConfig?.adminWhatsApp || '+8801625299521'}\nAdmin Email: ${adminConfig?.adminEmail || 'anik.barua@kdsgroup.net'}`}>
                  {error ? <AlertCircle className="w-3 h-3 text-rose-700 icon-breathing" /> : <CheckCircle2 className="w-3 h-3 text-emerald-600 icon-breathing" />}
                  {error ? 'Sync Error' : 'Sheet Synced'} ({adminConfig?.sheetName || 'Central IE List'})
                </span>
              </div>
            </div>
          </div>

          {/* Action Tools & Reminder Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Notification Bell with Badge Counter */}
            <button
              onClick={onOpenNotificationCenter}
              className="relative p-2 rounded-lg bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border border-slate-200/90 shadow-sm shadow-slate-900/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)] transition-all duration-300 ease-out hover:shadow-md hover:shadow-slate-900/15 hover:brightness-105 active:translate-y-[1px] active:shadow-inner cursor-pointer"
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
                className={`inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold border border-slate-200/90 shadow-sm shadow-slate-900/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)] transition-all duration-300 ease-out hover:shadow-md hover:shadow-slate-900/15 hover:brightness-105 active:translate-y-[1px] active:shadow-inner cursor-pointer ${
                  desktopNotificationsEnabled
                    ? 'bg-gradient-to-b from-white via-emerald-50/40 to-slate-100 text-emerald-800'
                    : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-600'
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
                className={`p-2 rounded-lg text-xs font-semibold border border-slate-200/90 shadow-sm shadow-slate-900/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)] transition-all duration-300 ease-out hover:shadow-md hover:shadow-slate-900/15 hover:brightness-105 active:translate-y-[1px] active:shadow-inner cursor-pointer ${
                  soundEnabled
                    ? 'bg-gradient-to-b from-white via-amber-50/40 to-slate-100 text-amber-800'
                    : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-400'
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

            {/* Simple Light / High-Contrast Dark Mode Toggle */}
            {onToggleTheme && (
              <button
                id="theme-mode-toggle"
                onClick={onToggleTheme}
                className={`p-2 rounded-lg text-xs font-semibold border transition-all duration-300 ease-out hover:shadow-md hover:brightness-105 active:translate-y-[1px] active:shadow-inner cursor-pointer flex items-center gap-1.5 ${
                  isDarkMode
                    ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 shadow-sm'
                    : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-700 border-slate-200/90 shadow-sm shadow-slate-900/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)] hover:shadow-slate-900/15'
                }`}
                title={isDarkMode ? 'High-Contrast Dark Mode Active (Click for Light Mode)' : 'Light Mode Active (Click for High-Contrast Dark Mode)'}
                aria-label="Toggle light and high-contrast dark theme"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-600" />
                )}
                <span className="hidden xl:inline text-[11px] font-bold">
                  {isDarkMode ? 'Dark' : 'Light'}
                </span>
              </button>
            )}

            {/* Admin Planning Alert Trigger */}
            {onOpenAdminPlanning && (
              <button
                onClick={onOpenAdminPlanning}
                className="relative overflow-hidden btn-shimmer-sweep inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 text-white shadow-lg shadow-orange-900/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-[2px] active:scale-95 transition-all duration-500 ease-out cursor-pointer"
                title="Admin Advance Birthday Planning Alert (WhatsApp + Email)"
              >
                <Send className="w-3.5 h-3.5 relative z-10" />
                <span className="hidden md:inline relative z-10">Admin Planning</span>
                <span className="md:hidden relative z-10">Planning</span>
              </button>
            )}

            <button
              onClick={onSync}
              disabled={isSyncing}
              className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-75 overflow-hidden transition-all duration-300 ease-out ${
                isSyncing
                  ? 'bg-slate-100 text-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.32),inset_0_-1px_1px_rgba(255,255,255,0.95)] border border-slate-300/80 syncing-glow-active'
                  : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 hover:from-slate-50 hover:to-slate-200 text-slate-700 border border-slate-200/90 shadow-sm shadow-slate-900/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)] hover:shadow-md hover:shadow-slate-900/15 hover:brightness-105 active:translate-y-[1px] active:shadow-inner'
              }`}
            >
              {isSyncing && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-35">
                  <span className="f1-speed-line top-1 left-0 w-8" style={{ animationDelay: '0s' }} />
                  <span className="f1-speed-line top-3 left-0 w-12" style={{ animationDelay: '0.15s' }} />
                  <span className="f1-speed-line bottom-1.5 left-0 w-10" style={{ animationDelay: '0.25s' }} />
                </div>
              )}
              {isSyncing ? (
                <svg
                  viewBox="0 0 40 14"
                  className="w-7 h-3.5 shrink-0 f1-realistic-motion"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Ferrari Red F1 Race Car"
                >
                  {/* Rear Wing Endplate & Wing Blades */}
                  <rect x="1" y="2" width="2.5" height="5.5" rx="0.5" fill="#b91c1c" />
                  <path d="M 2 2.5 L 5.5 2.5 L 5.5 4.5 L 2 4.5 Z" fill="#111111" />
                  <path d="M 3 4.5 L 6 7.5" stroke="#111111" strokeWidth="0.8" />
                  
                  {/* Shark Fin & Engine Cowl */}
                  <path d="M 3.5 3.5 L 14 2 L 14 5.5 L 3.5 6 Z" fill="#dc2626" />
                  
                  {/* Airbox Intake */}
                  <path d="M 13 2 Q 16 1.5 17 3 L 17 5.5 L 13 5.5 Z" fill="#b91c1c" />
                  <ellipse cx="15.2" cy="2.8" rx="1.1" ry="0.7" fill="#111111" />
                  
                  {/* Driver Helmet & Halo Protection System */}
                  <circle cx="17.8" cy="4.2" r="1.3" fill="#facc15" />
                  <path d="M 16 4.8 Q 18.5 3.6 20.8 5.6" stroke="#111111" strokeWidth="0.85" strokeLinecap="round" />
                  
                  {/* Underfloor / Carbon Diffuser */}
                  <rect x="7" y="10" width="24" height="1.2" rx="0.4" fill="#111111" />
                  
                  {/* Main Chassis / Sidepod / Nose Cone (Ferrari Red #dc2626) */}
                  <path
                    d="M 9 7.2 C 9 5.4, 13 5.2, 18 5.4 C 23 5.6, 27 6.8, 33 8.6 L 37.5 9.6 L 37.5 10.6 L 33 10.6 C 32 9.4, 29 9.4, 28 10.6 L 12 10.6 C 11 9.4, 8 9.4, 7 10.6 Z"
                    fill="#dc2626"
                  />
                  
                  {/* Aerodynamic highlight / white Italian racing stripe */}
                  <path d="M 16 6.8 L 30 8.2" stroke="#ffffff" strokeWidth="0.5" strokeLinecap="round" opacity="0.85" />
                  
                  {/* Front Wing Assembly & Endplate */}
                  <path d="M 35 10.2 L 39.5 10.2" stroke="#111111" strokeWidth="0.9" strokeLinecap="round" />
                  <path d="M 36.5 8.2 L 39.5 8.2 L 39.5 11.5 L 37 11 Z" fill="#b91c1c" />
                  
                  {/* Rear Wheel (Black Racing Tire #111111 with Red Pirelli Accent & Rim) */}
                  <circle cx="7.5" cy="9.5" r="3.5" fill="#111111" />
                  <circle cx="7.5" cy="9.5" r="3" stroke="#262626" strokeWidth="0.5" fill="none" />
                  <circle cx="7.5" cy="9.5" r="2.5" stroke="#ef4444" strokeWidth="0.35" fill="none" />
                  <circle cx="7.5" cy="9.5" r="1.6" fill="#334155" />
                  <circle cx="7.5" cy="9.5" r="0.6" fill="#facc15" />
                  
                  {/* Front Wheel (Black Racing Tire #111111 with Red Pirelli Accent & Rim) */}
                  <circle cx="30.5" cy="9.5" r="3.2" fill="#111111" />
                  <circle cx="30.5" cy="9.5" r="2.7" stroke="#262626" strokeWidth="0.5" fill="none" />
                  <circle cx="30.5" cy="9.5" r="2.2" stroke="#ef4444" strokeWidth="0.35" fill="none" />
                  <circle cx="30.5" cy="9.5" r="1.5" fill="#334155" />
                  <circle cx="30.5" cy="9.5" r="0.5" fill="#facc15" />
                </svg>
              ) : (
                <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
              )}
              <span className="hidden sm:inline relative z-10">{isSyncing ? 'Syncing...' : 'Sync Sheet'}</span>
            </button>

            <a
              href={sheetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-b from-white via-emerald-50/50 to-slate-100 text-emerald-800 hover:text-emerald-900 border border-emerald-300/80 shadow-sm shadow-emerald-900/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95)] transition-all duration-300 ease-out hover:shadow-md hover:shadow-emerald-900/15 hover:brightness-105 active:translate-y-[1px] active:shadow-inner cursor-pointer"
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

          {/* Memory Gallery Tab (Placed after Executive Dashboard) */}
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'gallery'
                ? 'border-amber-500 text-amber-900 bg-amber-50/70 font-bold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Images className={`w-4 h-4 ${activeTab === 'gallery' ? 'text-amber-600' : 'text-slate-500'}`} />
            Memory Gallery
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-amber-100 text-amber-900 border border-amber-300 font-bold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
              Live
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

          {/* Month of Fortune Astrological Tab */}
          <button
            onClick={() => setActiveTab('fortune')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'fortune'
                ? 'border-purple-600 text-purple-900 bg-purple-50/70 font-bold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'fortune' ? 'text-purple-600 animate-pulse' : 'text-slate-500'}`} />
            Month of Fortune
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-purple-100 text-purple-900 border border-purple-300 font-bold flex items-center gap-1">
              <Moon className="w-2.5 h-2.5 text-purple-600" />
              Aura
            </span>
          </button>

          <button
            onClick={() => setActiveTab('meanings')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'meanings'
                ? 'border-amber-500 text-amber-900 bg-amber-50/70 font-bold shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Name Meaning Of Team Member
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-amber-100 text-amber-900 border border-amber-300 font-bold">
              16 Meanings
            </span>
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
            onClick={() => setActiveTab('insights')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'insights'
                ? 'border-indigo-600 text-indigo-900 bg-indigo-50/70 font-bold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className={`w-4 h-4 ${activeTab === 'insights' ? 'text-indigo-600' : 'text-slate-500'}`} />
            Dispatch Insights
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
              New
            </span>
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
