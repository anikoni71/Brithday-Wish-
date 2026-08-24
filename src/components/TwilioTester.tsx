import React, { useState } from 'react';
import { TwilioConfig, LogEntry } from '../types';
import { Send, Key, CheckCircle2, AlertCircle, Phone, MessageSquare, Terminal, Trash2 } from 'lucide-react';

interface TwilioTesterProps {
  twilioConfig: TwilioConfig;
  onUpdateTwilioConfig: (config: TwilioConfig) => void;
  logs: LogEntry[];
  onClearLogs: () => void;
  onSendWhatsAppDirect: (phone: string, msg: string) => Promise<void>;
  isSending: boolean;
}

export const TwilioTester: React.FC<TwilioTesterProps> = ({
  twilioConfig,
  onUpdateTwilioConfig,
  logs,
  onClearLogs,
  onSendWhatsAppDirect,
  isSending,
}) => {
  const [testPhone, setTestPhone] = useState('8801829870593');
  const [testMessage, setTestMessage] = useState('Happy Birthday, Dipankar! Wishing you a great day from the IE Central Team. 🎉');

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone || !testMessage) return;
    await onSendWhatsAppDirect(testPhone, testMessage);
  };

  return (
    <div className="space-y-6 mb-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-purple-900/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-purple-300">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">WhatsApp Integration & Delivery Logs</h2>
            <p className="text-xs text-purple-200">
              Test Twilio API WhatsApp message delivery and monitor API dispatch logs in real-time
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Test Sender Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-600" />
              Dispatch Test WhatsApp Wish
            </h3>

            <form onSubmit={handleTestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recipient Phone Number (Col J format):
                </label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="e.g. 8801829870593"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:border-purple-600 focus:outline-hidden text-slate-900 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp Message Body:
                </label>
                <textarea
                  rows={3}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full p-3 text-xs font-medium rounded-xl border border-slate-300 focus:border-purple-600 focus:outline-hidden text-slate-900 bg-slate-50 focus:bg-white leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSending || !testPhone || !testMessage}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSending ? 'Dispatching Background HTTP POST...' : 'Send WhatsApp Message (Zero-Touch Direct)'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            ⚡ All test dispatches execute as 100% zero-touch background HTTP POST requests using host sender +8801625299521.
          </div>
        </div>

        {/* Credentials Settings Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-600" />
            Twilio API Status & Keys
          </h3>

          <div className="space-y-3 mb-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800">Account SID</p>
                <p className="text-[11px] font-mono text-slate-500">
                  {twilioConfig.accountSid ? `${twilioConfig.accountSid.slice(0, 8)}...` : 'Not set'}
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${twilioConfig.accountSid ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                {twilioConfig.accountSid ? 'Configured' : 'Missing'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800">Auth Token</p>
                <p className="text-[11px] font-mono text-slate-500">
                  {twilioConfig.authToken ? '••••••••••••••••' : 'Not set'}
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${twilioConfig.authToken ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                {twilioConfig.authToken ? 'Configured' : 'Missing'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800">Twilio Sender WhatsApp Number</p>
                <p className="text-[11px] font-mono text-slate-500">
                  {twilioConfig.whatsappNumber || 'whatsapp:+14155238886'}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                Sandbox Default
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Logs Console */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">Live Activity Dispatch Logs</h3>
          </div>

          <button
            onClick={onClearLogs}
            className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Logs
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-72 overflow-y-auto font-mono text-xs">
          {logs.length === 0 ? (
            <p className="text-slate-500 italic py-4 text-center">No dispatch logs recorded yet.</p>
          ) : (
            logs.map((log, idx) => (
              <div
                key={log.id ? `${log.id}-${idx}` : `log-${idx}`}
                className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col gap-1 text-slate-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      log.type === 'success'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : log.type === 'error'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {log.type.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="font-bold text-emerald-400 shrink-0">Recipient: {log.recipient}</span>
                  <p className="text-slate-200 italic">"{log.message}"</p>
                </div>

                {log.details && <p className="text-[11px] text-slate-400">{log.details}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
