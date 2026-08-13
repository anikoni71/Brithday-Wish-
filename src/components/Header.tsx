import React from 'react';
import { RefreshCw, ExternalLink, Cake, Sparkles, Code2, Send, PhoneCall, Radio, CheckCircle2, Bot } from 'lucide-react';

interface HeaderProps {
  activeTab: 'roster' | 'generator' | 'script' | 'tester' | 'automation';
  setActiveTab: (tab: 'roster' | 'generator' | 'script' | 'tester' | 'automation') => void;
  onSync: () => void;
  isSyncing: boolean;
  lastSynced: string | null;
  todayCount: number;
  connectedPhone?: string;
  autoSyncEnabled?: boolean;
  onToggleAutoSync?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSync,
  isSyncing,
  lastSynced,
  todayCount,
  connectedPhone = '+8801625299521',
  autoSyncEnabled = true,
  onToggleAutoSync,
}) => {
  const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTODUAg2mUYQUTN3P9SPB5Q41Ta_9SufI2gct0GBYDUbPSJX81O1mWHgBjElAIfNfobEbd7Mkii18lt/pubhtml?gid=0&single=true";

  const displayPhone = connectedPhone.replace('whatsapp:', '');

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
              </div>

              <div className="flex items-center gap-3 mt-1 flex-wrap">
                {/* Connected WhatsApp Badge */}
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-bold">
                  <PhoneCall className="w-3 h-3 text-emerald-600" />
                  Connected WhatsApp: {displayPhone}
                </span>

                {/* Auto Sync Badge */}
                <button
                  onClick={onToggleAutoSync}
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border transition cursor-pointer ${
                    autoSyncEnabled
                      ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                  title="Click to toggle real-time background sync"
                >
                  <Radio className={`w-3 h-3 ${autoSyncEnabled ? 'text-blue-600 animate-pulse' : 'text-slate-400'}`} />
                  {autoSyncEnabled ? 'Live Sync (15s)' : 'Sync Paused'}
                  {lastSynced && <span className="text-[10px] text-slate-500">({lastSynced})</span>}
                </button>

                {/* Direct Automation Badge */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300 text-[11px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  Direct API Mode (Zero Touch)
                </span>
              </div>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
              {isSyncing ? 'Syncing Sheet...' : 'Sync Sheet Data'}
            </button>

            <a
              href={sheetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Central IE List
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 border-t border-slate-100 pt-2 overflow-x-auto no-scrollbar">
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
            {todayCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                {todayCount}
              </span>
            )}
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
