import React, { useState } from 'react';
import { getAppsScriptCode } from '../data/googleAppsScriptCode';
import { TwilioConfig } from '../types';
import { Code2, Copy, Check, Download, Key, ShieldCheck, Clock, FileSpreadsheet, ArrowRight, Sparkles } from 'lucide-react';

interface AppsScriptStudioProps {
  twilioConfig: TwilioConfig;
  onUpdateTwilioConfig: (config: TwilioConfig) => void;
}

export const AppsScriptStudio: React.FC<AppsScriptStudioProps> = ({
  twilioConfig,
  onUpdateTwilioConfig,
}) => {
  const [copied, setCopied] = useState(false);

  const scriptCode = getAppsScriptCode(
    twilioConfig.accountSid,
    twilioConfig.authToken,
    twilioConfig.whatsappNumber
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([scriptCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'Code.gs';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 mb-8">
      
      {/* Title & Description Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-600/30 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Google Apps Script Studio
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Code.gs (100% Free - No Twilio Required)
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Automated daily birthday alert trigger for Google Sheets ("Central IE List"). Runs every year without human touch.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Script!' : 'Copy Apps Script'}
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Download Code.gs
            </button>
          </div>
        </div>
      </div>

      {/* Zero Touch Automation Engine Banner */}
      <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-6 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              100% Automated Zero-Human-Touch WhatsApp Delivery Engine
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-200 text-emerald-900 font-bold border border-emerald-300">
                Sender: {twilioConfig.whatsappNumber.replace('whatsapp:', '')}
              </span>
            </h3>
            <p className="text-xs text-emerald-900 mt-1.5 leading-relaxed">
              When configured with your Twilio / WhatsApp API credentials below, this script executes in Google Cloud at <strong>8:00 AM every morning</strong>. It matches birthdays in your Google Sheet ("Central IE List") and dispatches WhatsApp messages <strong>DIRECTLY to your colleagues' phones without opening WhatsApp Web, with zero manual touch and 0 clicks required!</strong>
            </p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-emerald-200/80">
          <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-emerald-700" />
            Twilio / WhatsApp API Credentials (Required for Zero-Touch Direct API Dispatch)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">TWILIO_ACCOUNT_SID</label>
              <input
                type="text"
                value={twilioConfig.accountSid}
                onChange={(e) => onUpdateTwilioConfig({ ...twilioConfig, accountSid: e.target.value })}
                placeholder="e.g. ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-hidden text-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">TWILIO_AUTH_TOKEN</label>
              <input
                type="password"
                value={twilioConfig.authToken}
                onChange={(e) => onUpdateTwilioConfig({ ...twilioConfig, authToken: e.target.value })}
                placeholder="e.g. 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 focus:border-emerald-600 focus:outline-hidden text-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>CONNECTED_SENDER_NUMBER</span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-100 px-1.5 py-0.2 rounded">LOCKED</span>
              </label>
              <input
                type="text"
                value="whatsapp:+8801625299521"
                disabled
                className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-emerald-300 text-emerald-900 bg-emerald-100/80 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Code Editor / Viewer */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
            <span className="text-xs font-mono text-slate-400 ml-2">Central IE List - Code.gs</span>
          </div>

          <button
            onClick={handleCopy}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <pre className="p-5 overflow-x-auto font-mono text-xs text-emerald-300/90 leading-relaxed max-h-[500px]">
          {scriptCode}
        </pre>
      </div>

      {/* How to deploy in Google Sheets */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          4-Step Google Apps Script Deployment Guide
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center mb-2">
              1
            </div>
            <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" /> Open Sheet
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Open your Google Sheet ("Central IE List"). Click <span className="font-semibold text-slate-700">Extensions → Apps Script</span>.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center mb-2">
              2
            </div>
            <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-blue-600" /> Paste Code
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Replace everything in <span className="font-mono text-slate-700">Code.gs</span> with the copied script above and press <span className="font-semibold text-slate-700">Ctrl+S</span>.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mb-2">
              3
            </div>
            <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-emerald-600" /> Admin Email
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Script auto-detects your Google email (<span className="font-mono text-slate-700">ADMIN_EMAIL</span>) to send 1-click WhatsApp alert emails daily.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center mb-2">
              4
            </div>
            <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> Daily Trigger
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Click <span className="font-semibold text-slate-700">Triggers (Clock icon)</span> → Add Trigger → <span className="font-mono text-slate-700">checkBirthdaysAndSendWishes</span> → Day timer (8:00 AM - 9:00 AM).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
