import React, { useState } from 'react';
import { AutomationLogEntry } from '../types';
import { AutomationAnalyticsChart } from './AutomationAnalyticsChart';
import { AutomationRateDonutChart } from './AutomationRateDonutChart';
import { Bot, CheckCircle2, XCircle, Clock, Search, Filter, RefreshCw, Play, Trash2, ShieldCheck, Terminal, AlertTriangle, Phone, Activity } from 'lucide-react';

interface AutomationHistoryProps {
  logs: AutomationLogEntry[];
  onRefresh: () => void;
  onSimulateTriggerRun: () => void;
  onClearLogs: () => void;
  isLoading?: boolean;
}

export const AutomationHistory: React.FC<AutomationHistoryProps> = ({
  logs,
  onRefresh,
  onSimulateTriggerRun,
  onClearLogs,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'FAILED' | 'SKIPPED_DUPLICATE'>('ALL');
  const [isSimulating, setIsSimulating] = useState(false);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recipientPhone.includes(searchTerm) ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.triggerSource.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ? true : log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const successCount = logs.filter((l) => l.status === 'SUCCESS').length;
  const failedCount = logs.filter((l) => l.status === 'FAILED').length;
  const skippedCount = logs.filter((l) => l.status === 'SKIPPED_DUPLICATE').length;

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    await onSimulateTriggerRun();
    setTimeout(() => setIsSimulating(false), 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Trigger Status Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Bot className="w-48 h-48 text-emerald-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
              <Bot className="w-4 h-4 text-emerald-400" />
              Google Apps Script Time-Driven Automation Engine
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Automated Cloud Trigger Execution History
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              This log exclusively records zero-touch background executions triggered daily at 8:00 AM by Google Apps Script (<code className="text-emerald-300 font-mono">checkBirthdaysAndSendWishes</code>) and headless server dispatches. Manual test logs are isolated in the WhatsApp Tester tab.
            </p>

            <div className="flex items-center gap-4 mt-4 flex-wrap text-xs text-slate-300 font-mono">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                Sender: <strong className="text-white">+8801625299521</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Schedule: <strong className="text-amber-300">Daily 8:00 AM - 9:00 AM Window</strong>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Mode: <strong className="text-blue-300">100% Zero-Touch Direct</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? 'Executing 8 AM Trigger...' : 'Simulate 8 AM Apps Script Trigger'}
            </button>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* D3 Automation Analytics & Donut Reliability Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-7 xl:col-span-8">
          <AutomationAnalyticsChart
            logs={logs}
            activeStatusFilter={statusFilter}
            onSelectStatusFilter={(status) => setStatusFilter(status)}
          />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <AutomationRateDonutChart
            logs={logs}
            activeStatusFilter={statusFilter}
            onSelectStatusFilter={(status) => setStatusFilter(status)}
          />
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Dispatches</p>
            <p className="text-xl font-bold text-slate-900">{logs.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Successful</p>
            <p className="text-xl font-bold text-emerald-600">{successCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Skipped / Duplicates</p>
            <p className="text-xl font-bold text-amber-600">{skippedCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Failed Dispatches</p>
            <p className="text-xl font-bold text-rose-600">{failedCount}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search recipient, phone, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50/50"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({logs.length})
          </button>

          <button
            onClick={() => setStatusFilter('SUCCESS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              statusFilter === 'SUCCESS'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Success ({successCount})
          </button>

          <button
            onClick={() => setStatusFilter('SKIPPED_DUPLICATE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              statusFilter === 'SKIPPED_DUPLICATE'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Skipped ({skippedCount})
          </button>

          <button
            onClick={() => setStatusFilter('FAILED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              statusFilter === 'FAILED'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Failed ({failedCount})
          </button>

          {logs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer ml-auto"
              title="Clear automation history"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Execution Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-600" />
            Apps Script Trigger Execution Stream ({filteredLogs.length})
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Host Sender: +8801625299521
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Trigger Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4 min-w-[240px]">Dispatched Birthday Message</th>
                <th className="py-3 px-4 min-w-[200px]">Execution Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Bot className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-600 text-sm">No Automation Logs Found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click "Simulate 8 AM Apps Script Trigger" above to execute a cloud run test.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, lIdx) => (
                  <tr key={log.id ? `${log.id}-${lIdx}` : `auto-log-${lIdx}`} className="hover:bg-slate-50/80 transition">
                    
                    {/* Timestamp */}
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    {/* Trigger Source */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        <Bot className="w-3 h-3 text-emerald-600" />
                        {log.triggerSource}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {log.status === 'SUCCESS' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          SUCCESS (200)
                        </span>
                      ) : log.status === 'SKIPPED_DUPLICATE' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3 h-3 text-amber-600" />
                          SKIPPED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          FAILED
                        </span>
                      )}
                    </td>

                    {/* Recipient & Phone */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{log.recipientName}</div>
                      <div className="font-mono text-[11px] text-slate-500">{log.recipientPhone}</div>
                    </td>

                    {/* Sender */}
                    <td className="py-3 px-4 font-mono text-[11px] text-emerald-700 font-bold whitespace-nowrap">
                      {log.senderNumber}
                    </td>

                    {/* Message */}
                    <td className="py-3 px-4 text-slate-600 text-xs leading-relaxed max-w-xs italic">
                      "{log.message}"
                    </td>

                    {/* Execution Details */}
                    <td className="py-3 px-4 text-[11px] text-slate-500 font-mono">
                      {log.details || 'Zero-touch HTTP POST request executed successfully.'}
                      {log.executionTimeMs && (
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          Latency: {log.executionTimeMs}ms
                        </span>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
