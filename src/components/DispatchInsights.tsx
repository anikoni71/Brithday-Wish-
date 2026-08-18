import React, { useState, useMemo, useEffect } from 'react';
import { AutomationLogEntry, EmailLogEntry } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Activity, BarChart3, Clock, CheckCircle2, XCircle, Mail, Phone, Calendar, 
  Filter, TrendingUp, History, LayoutDashboard, ChevronRight, Search, Zap, ArrowUpRight, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DispatchInsightsProps {
  automationLogs: AutomationLogEntry[];
  emailLogs: EmailLogEntry[];
}

/**
 * High-performance smooth CountUp hook component for metric statistics
 */
const CountUp: React.FC<{ value: number; duration?: number; suffix?: string }> = ({
  value,
  duration = 900,
  suffix = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startValue + (value - startValue) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{displayValue}{suffix}</span>;
};

export const DispatchInsights: React.FC<DispatchInsightsProps> = ({ automationLogs, emailLogs }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'whatsapp' | 'email'>('all');
  const [selectedYear, setSelectedYear] = useState<string>('All Years');
  const [searchTerm, setSearchTerm] = useState('');

  // Extract years from logs
  const years = useMemo(() => {
    const allDates = [
      ...automationLogs.map(l => l.timestamp),
      ...emailLogs.map(l => l.timestamp)
    ];
    const uniqueYears = Array.from(new Set(allDates.map(d => {
      const date = new Date(d);
      return isNaN(date.getTime()) ? new Date().getFullYear().toString() : date.getFullYear().toString();
    })));
    return ['All Years', ...uniqueYears.sort((a, b) => b.localeCompare(a))];
  }, [automationLogs, emailLogs]);

  // Combine and normalize logs for the timeline
  const combinedLogs = useMemo(() => {
    const normalizedWA = automationLogs.map(log => ({
      id: log.id,
      timestamp: new Date(log.timestamp),
      type: 'whatsapp' as const,
      recipient: log.recipientName,
      contact: log.recipientPhone,
      status: log.status,
      message: log.message,
      source: log.triggerSource,
      details: log.details || 'WhatsApp dispatch'
    }));

    const normalizedEmail = emailLogs.map(log => ({
      id: log.id,
      timestamp: new Date(log.timestamp),
      type: 'email' as const,
      recipient: log.recipientName,
      contact: log.recipientEmail,
      status: log.status,
      message: log.messageSnippet,
      source: log.mode,
      details: log.details || 'Email dispatch'
    }));

    let all = [...normalizedWA, ...normalizedEmail];

    // Filter by tab
    if (activeTab === 'whatsapp') all = all.filter(l => l.type === 'whatsapp');
    if (activeTab === 'email') all = all.filter(l => l.type === 'email');

    // Filter by year
    if (selectedYear !== 'All Years') {
      all = all.filter(l => l.timestamp.getFullYear().toString() === selectedYear);
    }

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      all = all.filter(l => 
        l.recipient.toLowerCase().includes(term) || 
        l.contact.toLowerCase().includes(term) || 
        l.message.toLowerCase().includes(term)
      );
    }

    return all.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [automationLogs, emailLogs, activeTab, selectedYear, searchTerm]);

  // Data for yearly chart
  const yearlyData = useMemo(() => {
    const dataMap: Record<string, { year: string; success: number; failed: number }> = {};
    
    [...automationLogs, ...emailLogs].forEach(log => {
      const date = new Date(log.timestamp);
      const year = isNaN(date.getTime()) ? new Date().getFullYear().toString() : date.getFullYear().toString();
      
      if (!dataMap[year]) {
        dataMap[year] = { year, success: 0, failed: 0 };
      }
      
      if (log.status === 'SUCCESS' || log.status === 'DELIVERED' || log.status === 'DISPATCHED') {
        dataMap[year].success++;
      } else if (log.status === 'FAILED') {
        dataMap[year].failed++;
      }
    });

    return Object.values(dataMap).sort((a, b) => a.year.localeCompare(b.year));
  }, [automationLogs, emailLogs]);

  // Data for Pie chart
  const statusDistribution = useMemo(() => {
    const stats = { SUCCESS: 0, FAILED: 0, SKIPPED: 0 };
    
    combinedLogs.forEach(log => {
      if (log.status === 'SUCCESS' || log.status === 'DELIVERED' || log.status === 'DISPATCHED') {
        stats.SUCCESS++;
      } else if (log.status === 'FAILED') {
        stats.FAILED++;
      } else {
        stats.SKIPPED++;
      }
    });

    return [
      { name: 'Success', value: stats.SUCCESS, color: '#10b981' },
      { name: 'Failed', value: stats.FAILED, color: '#ef4444' },
      { name: 'Skipped', value: stats.SKIPPED, color: '#3f3f46' }
    ].filter(s => s.value > 0);
  }, [combinedLogs]);

  const stats = useMemo(() => {
    const total = combinedLogs.length;
    const success = combinedLogs.filter(l => l.status === 'SUCCESS' || l.status === 'DELIVERED' || l.status === 'DISPATCHED').length;
    const failed = combinedLogs.filter(l => l.status === 'FAILED').length;
    const rate = total > 0 ? Math.round((success / total) * 100) : 0;
    
    const whatsappCount = combinedLogs.filter(l => l.type === 'whatsapp').length;
    const emailCount = combinedLogs.filter(l => l.type === 'email').length;
    
    return { total, success, failed, rate, whatsappCount, emailCount };
  }, [combinedLogs]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12 font-sans text-zinc-100 bg-zinc-950/40"
    >
      {/* 1. Header Command Bar */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 p-6 shadow-2xl shadow-black/80"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
              <TrendingUp className="w-7 h-7 text-emerald-400" />
              Dispatch Intelligence Dashboard
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-medium flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-zinc-500" />
              Cross-channel automation telemetry and historical performance auditing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="pl-9 pr-8 py-2 rounded-xl border border-zinc-800 bg-zinc-950 text-[11px] font-bold text-zinc-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 appearance-none cursor-pointer hover:bg-zinc-900 transition-colors"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            
            <button 
              onClick={() => window.print()}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 transition shadow-lg"
              title="Print Analytics Report"
            >
              <History className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Top Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants} className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/80 hover:border-zinc-700 transition-all shadow-xl shadow-black/40">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-zinc-400 border border-white/5">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Total Volume</span>
          </div>
          <p className="text-3xl font-black text-white font-mono"><CountUp value={stats.total} /></p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
            <Zap className="w-3 h-3 text-amber-500" /> Aggregated Dispatches
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/80 hover:border-emerald-500/30 transition-all shadow-xl shadow-black/40">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center text-emerald-400 border border-white/5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest font-mono">Successful</span>
          </div>
          <p className="text-3xl font-black text-emerald-400 font-mono"><CountUp value={stats.success} /></p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
            <ArrowUpRight className="w-3 h-3 text-emerald-500" /> {stats.rate}% Delivery Success
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/80 hover:border-zinc-700 transition-all shadow-xl shadow-black/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">WhatsApp</span>
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono"><CountUp value={stats.whatsappCount} /></p>
          <div className="mt-2 text-[10px] font-bold text-zinc-500 uppercase font-mono">
            Direct Mobile
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-5 border border-zinc-800/80 hover:border-zinc-700 transition-all shadow-xl shadow-black/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Email Channel</span>
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono"><CountUp value={stats.emailCount} /></p>
          <div className="mt-2 text-[10px] font-bold text-zinc-500 uppercase font-mono">
            Admin Digests
          </div>
        </motion.div>
      </div>

      {/* 3. Analytical Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Yearly Bar Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-8 bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-6 border border-zinc-800/80 shadow-2xl shadow-black/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Annual Performance Audit
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-1">Cross-year delivery integrity comparison</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 font-mono">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> SUCCESS</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div> FAILED</div>
            </div>
          </div>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis 
                  dataKey="year" 
                  axisLine={{ stroke: '#3f3f46' }} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#71717a', fontFamily: 'monospace' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#52525b', fontFamily: 'monospace' }} 
                />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ 
                    backgroundColor: '#09090b',
                    borderRadius: '12px', 
                    border: '1px solid #27272a', 
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    fontSize: '11px',
                    fontWeight: '700',
                    fontFamily: 'monospace'
                  }}
                  itemStyle={{ padding: '2px 0' }}
                />
                <Bar dataKey="success" fill="#10b981" radius={[3, 3, 0, 0]} barSize={36} />
                <Bar dataKey="failed" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Donut Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-4 bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-6 border border-zinc-800/80 shadow-2xl shadow-black/60 flex flex-col">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-2 mb-8">
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            Integrity Distribution
          </h3>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#09090b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      fontFamily: 'monospace'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-white font-mono">{stats.rate}%</span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Success</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 space-y-3">
            {statusDistribution.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: s.color }}></div>
                  <span className="text-zinc-400 font-bold uppercase tracking-wider">{s.name}</span>
                </div>
                <span className="font-black text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 4. Visual Lifecycle Timeline Card */}
      <motion.div variants={itemVariants} className="bg-zinc-900/60 backdrop-blur-2xl rounded-3xl border border-zinc-800/80 shadow-2xl shadow-black/80 overflow-hidden">
        {/* Timeline Header */}
        <div className="p-6 border-b border-zinc-800/50 bg-zinc-950/30">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] font-mono flex items-center gap-3">
                <History className="w-5 h-5 text-emerald-400" />
                Dispatch Lifecycle Timeline
              </h3>
              
              <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 shadow-inner">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition tracking-widest ${
                    activeTab === 'all' ? 'bg-zinc-800 text-emerald-400 shadow-lg border border-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  ALL
                </button>
                <button
                  onClick={() => setActiveTab('whatsapp')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition flex items-center gap-2 tracking-widest ${
                    activeTab === 'whatsapp' ? 'bg-zinc-800 text-emerald-400 shadow-lg border border-emerald-500/20' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Phone className="w-3 h-3" /> WHATSAPP
                </button>
                <button
                  onClick={() => setActiveTab('email')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition flex items-center gap-2 tracking-widest ${
                    activeTab === 'email' ? 'bg-zinc-800 text-blue-400 shadow-lg border border-blue-500/20' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Mail className="w-3 h-3" /> EMAIL
                </button>
              </div>
            </div>

            <div className="relative w-full xl:w-80">
              <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Audit Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 placeholder:text-zinc-700 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="max-h-[600px] overflow-y-auto p-6 bg-zinc-950/20 custom-scrollbar scroll-smooth">
          <AnimatePresence mode="popLayout">
            {combinedLogs.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="empty"
                className="py-24 text-center flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 border border-white/5">
                  <Clock className="w-10 h-10 text-zinc-800" />
                </div>
                <p className="font-bold text-zinc-400 font-mono tracking-widest uppercase text-sm">Log Buffer Empty</p>
                <p className="text-xs text-zinc-600 mt-2 font-mono max-w-xs mx-auto">
                  {searchTerm ? 'Audit search yield zero results. Adjust filtering parameters.' : 'System dispatches will appear here upon automated execution.'}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-10 relative before:absolute before:inset-0 before:left-5 before:w-px before:bg-zinc-800/40">
                {combinedLogs.map((log, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.8) }}
                    key={log.id} 
                    className="relative pl-14"
                  >
                    {/* Node Icon */}
                    <div className={`absolute left-0 top-0 w-10 h-10 rounded-xl border-2 border-zinc-950 shadow-2xl flex items-center justify-center z-10 ${
                      log.type === 'whatsapp' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {log.type === 'whatsapp' ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/40 hover:border-emerald-500/20 hover:bg-zinc-900/60 transition-all duration-300 group shadow-lg">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm font-black text-white font-mono tracking-tight">{log.recipient}</span>
                          <span className="text-[10px] font-bold text-zinc-500 px-2 py-0.5 bg-zinc-950 rounded border border-white/5 font-mono">
                            {log.contact}
                          </span>
                          
                          {(log.status === 'SUCCESS' || log.status === 'DELIVERED' || log.status === 'DISPATCHED') ? (
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-[0.1em] font-mono">
                              <CheckCircle2 className="w-3.5 h-3.5" /> DELIVERED
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-[9px] font-black text-rose-500 uppercase tracking-[0.1em] font-mono">
                              <XCircle className="w-3.5 h-3.5" /> FAILED
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs text-zinc-400 leading-relaxed font-mono line-clamp-2 max-w-4xl">
                          <span className="text-emerald-500/60 mr-2 opacity-50">&gt;</span>
                          {log.message}
                        </p>
                        
                        <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 font-mono">
                          <span className="flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-emerald-500" /> {log.source}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-zinc-600" /> {log.timestamp.toLocaleDateString()} @ {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3">
                        <div className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-[0.2em] font-mono border ${
                          log.type === 'whatsapp' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' : 'bg-blue-500/5 text-blue-400 border-blue-500/10'
                        }`}>
                          {log.type}
                        </div>
                        <button className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 text-[10px] font-black font-mono">
                          AUDIT <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
