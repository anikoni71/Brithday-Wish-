import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { TeamMember, EmailLogEntry } from '../types';
import { MONTH_NAMES, parseBirthMonth } from '../utils/dateUtils';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  Mail, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  Calendar,
  Layers,
  AtSign,
  Send,
  Zap,
  ArrowUpRight,
  Filter
} from 'lucide-react';

interface MailAnalyticsGraphProps {
  members: TeamMember[];
  emailLogs?: EmailLogEntry[];
  sentEmailMap?: Record<string, boolean>;
  onSelectMonthFilter?: (monthIndex: number | null) => void;
  selectedMonthFilter?: number | null;
}

export interface MonthlyEmailStats {
  monthIndex: number;
  shortName: string;
  fullName: string;
  totalBirthdays: number;
  withEmail: number;
  missingEmail: number;
  coveragePercent: number;
  members: TeamMember[];
  isCurrentMonth: boolean;
}

export interface DomainStats {
  domain: string;
  count: number;
  percentage: number;
  color: string;
}

export interface DesignationStats {
  designation: string;
  total: number;
  withEmail: number;
  coveragePercent: number;
}

export const MailAnalyticsGraph: React.FC<MailAnalyticsGraphProps> = ({
  members,
  emailLogs = [],
  sentEmailMap = {},
  onSelectMonthFilter,
  selectedMonthFilter = null,
}) => {
  const barSvgRef = useRef<SVGSVGElement>(null);
  const donutSvgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeGraphTab, setActiveGraphTab] = useState<'monthly' | 'donut' | 'designation'>('monthly');
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyEmailStats | null>(null);
  const [hoveredDomain, setHoveredDomain] = useState<DomainStats | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const currentMonthIndex = new Date().getMonth();

  // Compute monthly email readiness statistics
  const monthlyStats: MonthlyEmailStats[] = useMemo(() => {
    const list: MonthlyEmailStats[] = MONTH_NAMES.map((m, idx) => ({
      monthIndex: idx,
      shortName: m.short,
      fullName: m.full,
      totalBirthdays: 0,
      withEmail: 0,
      missingEmail: 0,
      coveragePercent: 0,
      members: [],
      isCurrentMonth: idx === currentMonthIndex,
    }));

    members.forEach((member) => {
      const monthIdx = parseBirthMonth(member.birthday);
      if (monthIdx !== null && monthIdx >= 0 && monthIdx <= 11) {
        list[monthIdx].totalBirthdays += 1;
        list[monthIdx].members.push(member);
        if (member.email && member.email.trim().length > 0 && member.email.includes('@')) {
          list[monthIdx].withEmail += 1;
        } else {
          list[monthIdx].missingEmail += 1;
        }
      }
    });

    list.forEach((item) => {
      item.coveragePercent = item.totalBirthdays > 0 
        ? Math.round((item.withEmail / item.totalBirthdays) * 100) 
        : 100;
    });

    return list;
  }, [members, currentMonthIndex]);

  // Overall calculations
  const totalMembers = members.length;
  const totalWithEmail = members.filter((m) => m.email && m.email.trim().length > 0).length;
  const totalMissingEmail = totalMembers - totalWithEmail;
  const overallCoverage = totalMembers > 0 ? Math.round((totalWithEmail / totalMembers) * 100) : 0;
  const sentCount = Object.keys(sentEmailMap).length;

  // Domain breakdown
  const domainStats: DomainStats[] = useMemo(() => {
    const domainCounts: Record<string, number> = {};
    let noEmailCount = 0;

    members.forEach((m) => {
      if (!m.email || !m.email.includes('@')) {
        noEmailCount++;
      } else {
        const parts = m.email.split('@');
        const dom = parts[1]?.toLowerCase().trim() || 'other';
        domainCounts[dom] = (domainCounts[dom] || 0) + 1;
      }
    });

    const colors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    let colorIdx = 0;

    const list: DomainStats[] = Object.entries(domainCounts).map(([dom, count]) => {
      const percentage = totalMembers > 0 ? Math.round((count / totalMembers) * 100) : 0;
      const color = colors[colorIdx % colors.length];
      colorIdx++;
      return {
        domain: `@${dom}`,
        count,
        percentage,
        color,
      };
    });

    if (noEmailCount > 0) {
      list.push({
        domain: 'Missing / Unset',
        count: noEmailCount,
        percentage: totalMembers > 0 ? Math.round((noEmailCount / totalMembers) * 100) : 0,
        color: '#94a3b8',
      });
    }

    return list.sort((a, b) => b.count - a.count);
  }, [members, totalMembers]);

  // Designation breakdown
  const designationStats: DesignationStats[] = useMemo(() => {
    const desMap: Record<string, { total: number; withEmail: number }> = {};
    members.forEach((m) => {
      const des = m.designation?.trim() || 'General Team';
      if (!desMap[des]) {
        desMap[des] = { total: 0, withEmail: 0 };
      }
      desMap[des].total += 1;
      if (m.email && m.email.includes('@')) {
        desMap[des].withEmail += 1;
      }
    });

    return Object.entries(desMap)
      .map(([designation, data]) => ({
        designation,
        total: data.total,
        withEmail: data.withEmail,
        coveragePercent: Math.round((data.withEmail / data.total) * 100),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 7); // top 7 designations
  }, [members]);

  // Render Monthly D3 Grouped Bar Chart
  useEffect(() => {
    if (activeGraphTab !== 'monthly' || !barSvgRef.current) return;

    const svg = d3.select(barSvgRef.current);
    svg.selectAll('*').remove();

    const width = 640;
    const height = 240;
    const margin = { top: 25, right: 20, bottom: 35, left: 35 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const maxCount = Math.max(d3.max(monthlyStats, (d) => d.totalBirthdays) || 4, 4);

    const xScale = d3
      .scaleBand()
      .domain(monthlyStats.map((d) => d.shortName))
      .range([0, innerWidth])
      .padding(0.24);

    const yScale = d3
      .scaleLinear()
      .domain([0, maxCount + 1])
      .range([innerHeight, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(yScale)
          .ticks(4)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .call((grid) => grid.select('.domain').remove())
      .call((grid) =>
        grid.selectAll('line').attr('stroke', '#f1f5f9').attr('stroke-dasharray', '3,3')
      );

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .call((axis) => axis.select('.domain').attr('stroke', '#e2e8f0'))
      .selectAll('text')
      .attr('dy', '10px')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .attr('fill', (_d, i) =>
        i === currentMonthIndex ? '#4f46e5' : selectedMonthFilter === i ? '#0f172a' : '#64748b'
      );

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(4).tickFormat(d3.format('d')))
      .call((axis) => axis.select('.domain').remove())
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('fill', '#94a3b8');

    // Draw stacked or grouped bars
    const barWidth = xScale.bandwidth();

    monthlyStats.forEach((d) => {
      const x = xScale(d.shortName) || 0;
      const isSelected = selectedMonthFilter === d.monthIndex;
      const isCurrent = d.isCurrentMonth;

      // Base highlight background on hover or selection
      g.append('rect')
        .attr('x', x - 2)
        .attr('y', 0)
        .attr('width', barWidth + 4)
        .attr('height', innerHeight)
        .attr('fill', isSelected ? '#eef2ff' : isCurrent ? '#fdf4ff' : 'transparent')
        .attr('rx', 6)
        .attr('opacity', 0.8)
        .style('cursor', 'pointer')
        .on('click', () => {
          if (onSelectMonthFilter) {
            onSelectMonthFilter(isSelected ? null : d.monthIndex);
          }
        });

      if (d.totalBirthdays === 0) {
        // Dot for zero count
        g.append('circle')
          .attr('cx', x + barWidth / 2)
          .attr('cy', innerHeight - 4)
          .attr('r', 2.5)
          .attr('fill', '#cbd5e1');
        return;
      }

      // Bar with Email (Emerald / Indigo)
      const emailHeight = innerHeight - yScale(d.withEmail);
      const emailY = yScale(d.withEmail);

      // Missing Email portion
      const missingHeight = innerHeight - yScale(d.missingEmail);
      const totalHeight = innerHeight - yScale(d.totalBirthdays);
      const totalY = yScale(d.totalBirthdays);

      // Render Total Bar (Backdrop)
      g.append('rect')
        .attr('x', x)
        .attr('y', totalY)
        .attr('width', barWidth)
        .attr('height', totalHeight)
        .attr('rx', 4)
        .attr('fill', '#e2e8f0')
        .style('cursor', 'pointer')
        .on('mouseenter', (event) => {
          setHoveredMonth(d);
          const rect = event.currentTarget.getBoundingClientRect();
          setTooltipPos({ x: rect.x + rect.width / 2, y: rect.y });
        })
        .on('mouseleave', () => setHoveredMonth(null))
        .on('click', () => {
          if (onSelectMonthFilter) {
            onSelectMonthFilter(isSelected ? null : d.monthIndex);
          }
        });

      // Render With Email Bar (Active fill)
      if (d.withEmail > 0) {
        g.append('rect')
          .attr('x', x)
          .attr('y', innerHeight - emailHeight)
          .attr('width', barWidth)
          .attr('height', emailHeight)
          .attr('rx', 4)
          .attr(
            'fill',
            isCurrent
              ? 'url(#currentMonthGrad)'
              : isSelected
              ? '#4f46e5'
              : '#10b981'
          )
          .style('cursor', 'pointer')
          .on('mouseenter', (event) => {
            setHoveredMonth(d);
            const rect = event.currentTarget.getBoundingClientRect();
            setTooltipPos({ x: rect.x + rect.width / 2, y: rect.y });
          })
          .on('mouseleave', () => setHoveredMonth(null))
          .on('click', () => {
            if (onSelectMonthFilter) {
              onSelectMonthFilter(isSelected ? null : d.monthIndex);
            }
          });
      }

      // Bar top label (count)
      g.append('text')
        .attr('x', x + barWidth / 2)
        .attr('y', totalY - 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('fill', isCurrent ? '#9333ea' : isSelected ? '#4f46e5' : '#334155')
        .text(d.totalBirthdays);
    });

    // Gradient definitions
    const defs = svg.append('defs');
    const grad = defs
      .append('linearGradient')
      .attr('id', 'currentMonthGrad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#ec4899');
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#8b5cf6');
  }, [monthlyStats, activeGraphTab, selectedMonthFilter, currentMonthIndex, onSelectMonthFilter]);

  // Render Domain D3 Donut Chart
  useEffect(() => {
    if (activeGraphTab !== 'donut' || !donutSvgRef.current) return;

    const svg = d3.select(donutSvgRef.current);
    svg.selectAll('*').remove();

    const size = 220;
    const radius = size / 2 - 10;
    const innerRadius = radius * 0.62;

    const g = svg
      .attr('viewBox', `0 0 ${size} ${size}`)
      .append('g')
      .attr('transform', `translate(${size / 2},${size / 2})`);

    const pie = d3
      .pie<DomainStats>()
      .value((d) => d.count)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<DomainStats>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(4)
      .padAngle(0.03);

    const arcs = g
      .selectAll('.arc')
      .data(pie(domainStats))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        setHoveredDomain(d.data);
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltipPos({ x: rect.x + rect.width / 2, y: rect.y });
      })
      .on('mouseleave', () => setHoveredDomain(null));

    // Center Text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-4px')
      .attr('font-size', '20px')
      .attr('font-weight', '900')
      .attr('fill', '#0f172a')
      .text(`${overallCoverage}%`);

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '14px')
      .attr('font-size', '9px')
      .attr('font-weight', '700')
      .attr('text-transform', 'uppercase')
      .attr('letter-spacing', '0.5px')
      .attr('fill', '#64748b')
      .text('Email Ready');
  }, [domainStats, activeGraphTab, overallCoverage]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
      {/* Graph Header and Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Mail Address & Auto-Wish Analytics Visualizer
              </h3>
              <p className="text-[11px] text-slate-500">
                Visual breakdown of email readiness, month-wise celebrant distribution & automated coverage
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveGraphTab('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeGraphTab === 'monthly'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Monthly Readiness
          </button>

          <button
            onClick={() => setActiveGraphTab('donut')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeGraphTab === 'donut'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5" />
            Domain & Splits
          </button>

          <button
            onClick={() => setActiveGraphTab('designation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeGraphTab === 'designation'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Role Coverage
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500">Email Coverage</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
              {overallCoverage}%
            </span>
          </div>
          <p className="text-lg font-black text-slate-900 mt-1 font-mono">
            {totalWithEmail} <span className="text-xs font-normal text-slate-400">/ {totalMembers} members</span>
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500">Missing Email</span>
            {totalMissingEmail > 0 ? (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded flex items-center gap-1">
                <AlertCircle className="w-2.5 h-2.5" />
                Action Needed
              </span>
            ) : (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                All Set
              </span>
            )}
          </div>
          <p className="text-lg font-black text-slate-900 mt-1 font-mono">
            {totalMissingEmail} <span className="text-xs font-normal text-slate-400">pending info</span>
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500">Primary Domain</span>
            <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
              Corporate
            </span>
          </div>
          <p className="text-sm font-bold text-slate-900 mt-1.5 truncate">
            {domainStats[0]?.domain || '@kdsgroup.net'}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500">Auto Dispatches</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 text-emerald-500" />
              Active
            </span>
          </div>
          <p className="text-lg font-black text-emerald-600 mt-1 font-mono">
            {sentCount} <span className="text-xs font-normal text-slate-400">recorded</span>
          </p>
        </div>
      </div>

      {/* GRAPH CONTENT SECTION */}
      <div ref={containerRef} className="relative">
        {/* VIEW 1: MONTHLY GROUPED BAR CHART */}
        {activeGraphTab === 'monthly' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block"></span>
                  <span className="font-semibold text-slate-700">Configured Email Ready</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-slate-300 inline-block"></span>
                  <span className="font-semibold text-slate-700">Missing Email</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-gradient-to-r from-pink-500 to-purple-500 inline-block"></span>
                  <span className="font-semibold text-purple-700">Current Month (Aug)</span>
                </span>
              </div>

              {selectedMonthFilter !== null && (
                <button
                  onClick={() => onSelectMonthFilter && onSelectMonthFilter(null)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md cursor-pointer transition"
                >
                  Clear Month Filter (✕)
                </button>
              )}
            </div>

            {/* D3 SVG Bar Chart */}
            <div className="w-full bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex items-center justify-center">
              <svg ref={barSvgRef} className="w-full max-w-2xl h-auto" />
            </div>

            <p className="text-[11px] text-center text-slate-400">
              💡 Tip: Click any month bar on the graph to filter the list of teammates below!
            </p>
          </div>
        )}

        {/* VIEW 2: DOMAIN & SPLIT DONUT CHART */}
        {activeGraphTab === 'donut' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-50/50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-center">
              <svg ref={donutSvgRef} className="w-52 h-52" />
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Corporate Email Domain Distribution
              </h4>
              <div className="space-y-2">
                {domainStats.map((item) => (
                  <div key={item.domain} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded-xs shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="font-mono font-bold text-slate-700 truncate">
                        {item.domain}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-500">{item.count} members</span>
                      <span className="font-bold text-slate-900 w-10 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: DESIGNATION ROLE READINESS */}
        {activeGraphTab === 'designation' && (
          <div className="space-y-3 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Email Auto-Wish Readiness by Team Designation
            </h4>
            <div className="space-y-3">
              {designationStats.map((item) => (
                <div key={item.designation} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate max-w-[280px]">
                      {item.designation}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-slate-500">
                        {item.withEmail} / {item.total} ready
                      </span>
                      <span
                        className={`font-bold px-1.5 py-0.2 rounded ${
                          item.coveragePercent === 100
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.coveragePercent >= 50
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.coveragePercent}%
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                      style={{ width: `${item.coveragePercent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hover Tooltip for Month */}
        {hoveredMonth && tooltipPos && (
          <div
            className="fixed z-50 bg-slate-900 text-white rounded-xl px-3.5 py-2 text-xs shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 font-sans border border-slate-700"
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
          >
            <p className="font-bold text-amber-300 text-sm">
              {hoveredMonth.fullName}
            </p>
            <div className="space-y-0.5 mt-1 text-[11px] text-slate-300">
              <p>🎂 Total Birthdays: <strong className="text-white">{hoveredMonth.totalBirthdays}</strong></p>
              <p>✉️ Configured Email: <strong className="text-emerald-400">{hoveredMonth.withEmail}</strong></p>
              <p>⚠️ Missing Email: <strong className="text-rose-300">{hoveredMonth.missingEmail}</strong></p>
              <p>📊 Auto-Wish Readiness: <strong className="text-indigo-300">{hoveredMonth.coveragePercent}%</strong></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
