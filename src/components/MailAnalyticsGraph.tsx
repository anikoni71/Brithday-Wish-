import React, { useLayoutEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { TeamMember, EmailLogEntry } from '../types';
import { MONTH_NAMES, getBirthMonth } from '../utils/dateUtils';
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

interface MailAnalyticsGraphProps {
  members?: TeamMember[];
  emailLogs?: EmailLogEntry[];
  sentEmailMap?: Record<string, boolean>;
  monthlyStats?: MonthlyEmailStats[];
  domainStats?: DomainStats[];
  designationStats?: DesignationStats[];
  totalWithEmail?: number;
  overallCoverage?: number;
  onSelectMonthFilter?: (monthIndex: number | null) => void;
  selectedMonthFilter?: number | null;
}

export const MailAnalyticsGraph: React.FC<MailAnalyticsGraphProps> = ({
  members = [],
  emailLogs = [],
  sentEmailMap = {},
  monthlyStats: precomputedMonthlyStats,
  domainStats: precomputedDomainStats,
  designationStats: precomputedDesignationStats,
  totalWithEmail: precomputedTotalWithEmail,
  overallCoverage: precomputedOverallCoverage,
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

  // Compute or consume monthly email readiness statistics
  const monthlyStats: MonthlyEmailStats[] = useMemo(() => {
    if (precomputedMonthlyStats && precomputedMonthlyStats.length === 12) {
      return precomputedMonthlyStats;
    }

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
      const monthIdx = getBirthMonth(member.birthday);
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
  }, [precomputedMonthlyStats, members, currentMonthIndex]);

  // Overall calculations
  const totalMembers = members.length;
  const totalWithEmail = precomputedTotalWithEmail !== undefined 
    ? precomputedTotalWithEmail 
    : members.filter((m) => m.email && m.email.trim().length > 0).length;
  const totalMissingEmail = totalMembers - totalWithEmail;
  const overallCoverage = precomputedOverallCoverage !== undefined
    ? precomputedOverallCoverage
    : totalMembers > 0 ? Math.round((totalWithEmail / totalMembers) * 100) : 0;
  const sentCount = Object.keys(sentEmailMap).length;

  // Domain breakdown
  const domainStats: DomainStats[] = useMemo(() => {
    if (precomputedDomainStats) {
      return precomputedDomainStats;
    }

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
  }, [precomputedDomainStats, members, totalMembers]);

  // Designation breakdown
  const designationStats: DesignationStats[] = useMemo(() => {
    if (precomputedDesignationStats) {
      return precomputedDesignationStats;
    }

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
      .slice(0, 7);
  }, [precomputedDesignationStats, members]);

  // Memoized signature for monthly bar chart to prevent re-render flicker
  const monthlyDataSignature = useMemo(() => {
    return monthlyStats.map((s) => `${s.shortName}:${s.withEmail}/${s.totalBirthdays}`).join('|') + `_filter:${selectedMonthFilter}`;
  }, [monthlyStats, selectedMonthFilter]);

  // Render Monthly D3 Grouped Bar Chart using useLayoutEffect and morph animations
  useLayoutEffect(() => {
    if (activeGraphTab !== 'monthly' || !barSvgRef.current) return;

    const svg = d3.select(barSvgRef.current);
    const width = 640;
    const height = 240;
    const margin = { top: 25, right: 20, bottom: 35, left: 35 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    let g = svg.select<SVGGElement>('g.chart-group');
    if (g.empty()) {
      svg.selectAll('*').remove();

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

      g = svg
        .append('g')
        .attr('class', 'chart-group')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      g.append('g').attr('class', 'grid');
      g.append('g').attr('class', 'x-axis');
      g.append('g').attr('class', 'y-axis');
      g.append('g').attr('class', 'bars-group');
    }

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

    // Grid lines update
    g.select<SVGGElement>('.grid')
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

    // X Axis update
    g.select<SVGGElement>('.x-axis')
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

    // Y Axis update
    g.select<SVGGElement>('.y-axis')
      .call(d3.axisLeft(yScale).ticks(4).tickFormat(d3.format('d')))
      .call((axis) => axis.select('.domain').remove())
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('fill', '#94a3b8');

    // Data-bound monthly bar groups
    const barWidth = xScale.bandwidth();
    const barsContainer = g.select('.bars-group');
    const monthGroups = barsContainer
      .selectAll<SVGGElement, MonthlyEmailStats>('.month-bar-group')
      .data(monthlyStats, (d) => d.shortName);

    monthGroups.exit().remove();

    const monthGroupsEnter = monthGroups
      .enter()
      .append('g')
      .attr('class', 'month-bar-group');

    monthGroupsEnter
      .append('rect')
      .attr('class', 'col-hover-bg')
      .attr('y', 0)
      .attr('rx', 6)
      .attr('opacity', 0.8)
      .style('cursor', 'pointer');

    monthGroupsEnter
      .append('rect')
      .attr('class', 'total-bar')
      .attr('rx', 4)
      .attr('fill', '#e2e8f0')
      .style('cursor', 'pointer');

    monthGroupsEnter
      .append('rect')
      .attr('class', 'email-bar')
      .attr('rx', 4)
      .style('cursor', 'pointer');

    monthGroupsEnter
      .append('text')
      .attr('class', 'count-label')
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold');

    const mergedGroups = monthGroupsEnter.merge(monthGroups);

    // Interactive event handlers
    mergedGroups.each(function (d) {
      const groupEl = d3.select(this);
      const isSelected = selectedMonthFilter === d.monthIndex;
      const isCurrent = d.isCurrentMonth;
      const x = xScale(d.shortName) || 0;

      groupEl
        .select('.col-hover-bg')
        .attr('x', x - 2)
        .attr('width', barWidth + 4)
        .attr('height', innerHeight)
        .attr('fill', isSelected ? '#eef2ff' : isCurrent ? '#fdf4ff' : 'transparent')
        .on('click', () => {
          if (onSelectMonthFilter) {
            onSelectMonthFilter(isSelected ? null : d.monthIndex);
          }
        });

      const totalHeight = d.totalBirthdays > 0 ? innerHeight - yScale(d.totalBirthdays) : 0;
      const totalY = d.totalBirthdays > 0 ? yScale(d.totalBirthdays) : innerHeight;

      groupEl
        .select('.total-bar')
        .attr('x', x)
        .attr('width', barWidth)
        .on('mouseenter', (event) => {
          setHoveredMonth(d);
          const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
          setTooltipPos({ x: rect.x + rect.width / 2, y: rect.y });
        })
        .on('mouseleave', () => setHoveredMonth(null))
        .on('click', () => {
          if (onSelectMonthFilter) {
            onSelectMonthFilter(isSelected ? null : d.monthIndex);
          }
        })
        .transition()
        .duration(400)
        .ease(d3.easeCubicOut)
        .attr('y', totalY)
        .attr('height', totalHeight)
        .attr('opacity', d.totalBirthdays > 0 ? 1 : 0);

      const emailHeight = d.withEmail > 0 ? innerHeight - yScale(d.withEmail) : 0;
      const emailY = d.withEmail > 0 ? innerHeight - emailHeight : innerHeight;

      groupEl
        .select('.email-bar')
        .attr('x', x)
        .attr('width', barWidth)
        .attr('fill', isCurrent ? 'url(#currentMonthGrad)' : isSelected ? '#4f46e5' : '#10b981')
        .on('mouseenter', (event) => {
          setHoveredMonth(d);
          const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
          setTooltipPos({ x: rect.x + rect.width / 2, y: rect.y });
        })
        .on('mouseleave', () => setHoveredMonth(null))
        .on('click', () => {
          if (onSelectMonthFilter) {
            onSelectMonthFilter(isSelected ? null : d.monthIndex);
          }
        })
        .transition()
        .duration(400)
        .ease(d3.easeCubicOut)
        .attr('y', emailY)
        .attr('height', emailHeight)
        .attr('opacity', d.withEmail > 0 ? 1 : 0);

      groupEl
        .select('.count-label')
        .attr('x', x + barWidth / 2)
        .attr('fill', isCurrent ? '#9333ea' : isSelected ? '#4f46e5' : '#334155')
        .text(d.totalBirthdays > 0 ? d.totalBirthdays : '')
        .transition()
        .duration(400)
        .ease(d3.easeCubicOut)
        .attr('y', totalY - 5);
    });
  }, [monthlyDataSignature, activeGraphTab, selectedMonthFilter, currentMonthIndex, onSelectMonthFilter]);

  // Render Domain D3 Donut Chart with useLayoutEffect
  useLayoutEffect(() => {
    if (activeGraphTab !== 'donut' || !donutSvgRef.current) return;

    const svg = d3.select(donutSvgRef.current);
    const size = 220;
    const radius = size / 2 - 10;
    const innerRadius = radius * 0.62;

    svg.attr('viewBox', `0 0 ${size} ${size}`);

    let g = svg.select<SVGGElement>('g.donut-group');
    if (g.empty()) {
      svg.selectAll('*').remove();
      g = svg
        .append('g')
        .attr('class', 'donut-group')
        .attr('transform', `translate(${size / 2},${size / 2})`);

      g.append('g').attr('class', 'slices');
      g.append('text').attr('class', 'center-percent');
      g.append('text').attr('class', 'center-label');
    }

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

    const slicesContainer = g.select('.slices');
    const arcs = slicesContainer.selectAll<SVGPathElement, d3.PieArcDatum<DomainStats>>('path').data(pie(domainStats));

    arcs.exit().remove();

    arcs
      .enter()
      .append('path')
      .merge(arcs)
      .attr('fill', (d) => d.data.color)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        setHoveredDomain(d.data);
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        setTooltipPos({ x: rect.x + rect.width / 2, y: rect.y });
      })
      .on('mouseleave', () => setHoveredDomain(null))
      .transition()
      .duration(400)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t)) || '';
        };
      });

    g.select('.center-percent')
      .attr('text-anchor', 'middle')
      .attr('dy', '-4px')
      .attr('font-size', '20px')
      .attr('font-weight', '900')
      .attr('fill', '#0f172a')
      .text(`${overallCoverage}%`);

    g.select('.center-label')
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
              <p className="text-xs text-slate-500">
                Email database readiness, domain distribution, and monthly birthday email coverage
              </p>
            </div>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div className="flex items-center p-1 bg-slate-100/80 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveGraphTab('monthly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeGraphTab === 'monthly'
                ? 'bg-white text-indigo-600 shadow-xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Monthly Coverage</span>
          </button>
          <button
            onClick={() => setActiveGraphTab('donut')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeGraphTab === 'donut'
                ? 'bg-white text-indigo-600 shadow-xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <PieChartIcon className="w-3.5 h-3.5" />
            <span>Domains</span>
          </button>
          <button
            onClick={() => setActiveGraphTab('designation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeGraphTab === 'designation'
                ? 'bg-white text-indigo-600 shadow-xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Designations</span>
          </button>
        </div>
      </div>

      {/* Main KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
          <div className="flex items-center justify-between text-indigo-700 text-xs font-medium mb-1">
            <span>Overall Coverage</span>
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-indigo-950">{overallCoverage}%</div>
          <div className="text-[11px] text-indigo-600 font-medium mt-0.5">
            {totalWithEmail} of {totalMembers} members registered
          </div>
        </div>

        <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-medium mb-1">
            <span>Ready for Auto-Wish</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-950">{totalWithEmail}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
            Valid email address on file
          </div>
        </div>

        <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl">
          <div className="flex items-center justify-between text-amber-700 text-xs font-medium mb-1">
            <span>Missing Email</span>
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-950">{totalMissingEmail}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-0.5">
            Manual input or WhatsApp only
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
          <div className="flex items-center justify-between text-slate-700 text-xs font-medium mb-1">
            <span>Dispatched Wishes</span>
            <Send className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900">{sentCount}</div>
          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
            Sent in current cycle
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div ref={containerRef} className="relative min-h-[240px] flex items-center justify-center">
        {/* Tab 1: Monthly Bar Chart */}
        {activeGraphTab === 'monthly' && (
          <div className="w-full">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block"></span>
                  <span>Email Present</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-slate-200 inline-block"></span>
                  <span>Missing Email</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-gradient-to-r from-pink-500 to-purple-500 inline-block"></span>
                  <span>Current Month ({MONTH_NAMES[currentMonthIndex]?.short})</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Click a bar to filter</span>
            </div>

            <svg ref={barSvgRef} className="w-full h-[240px] overflow-visible" />
          </div>
        )}

        {/* Tab 2: Domain Donut Chart */}
        {activeGraphTab === 'donut' && (
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 py-2">
            <div className="w-[220px] h-[220px] shrink-0">
              <svg ref={donutSvgRef} className="w-full h-full" />
            </div>

            <div className="flex-1 max-w-md space-y-2">
              <div className="text-xs font-bold text-slate-700 mb-2">
                Top Recipient Domain Distribution
              </div>
              <div className="space-y-1.5 max-h-[170px] overflow-y-auto pr-1">
                {domainStats.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="font-medium text-slate-700 truncate font-mono text-[11px]">
                        {item.domain}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-slate-900">{item.count}</span>
                      <span className="text-[11px] text-slate-400 font-mono w-8 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Designation Coverage Breakdown */}
        {activeGraphTab === 'designation' && (
          <div className="w-full space-y-2.5 py-1">
            <div className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Email Coverage by Team Designation</span>
              <span className="text-[11px] text-slate-400 font-normal">Top Job Roles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {designationStats.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 space-y-1.5 transition-all"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate pr-2">
                      {item.designation}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
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

                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.coveragePercent === 100
                          ? 'bg-emerald-500'
                          : item.coveragePercent >= 50
                          ? 'bg-indigo-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.coveragePercent}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>
                      {item.withEmail} of {item.total} with registered email
                    </span>
                    <span>{item.total - item.withEmail} missing</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Tooltip */}
        {hoveredMonth && tooltipPos && (
          <div
            className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-700 min-w-[180px]"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 10}px`,
            }}
          >
            <div className="font-bold text-slate-100 border-b border-slate-700 pb-1.5 mb-1.5 flex items-center justify-between">
              <span>{hoveredMonth.fullName}</span>
              <span className="text-emerald-400 font-mono">{hoveredMonth.coveragePercent}%</span>
            </div>
            <div className="space-y-1 text-slate-300 text-[11px]">
              <div className="flex justify-between">
                <span>Total Birthdays:</span>
                <span className="font-bold text-white">{hoveredMonth.totalBirthdays}</span>
              </div>
              <div className="flex justify-between">
                <span>With Email:</span>
                <span className="font-bold text-emerald-400">{hoveredMonth.withEmail}</span>
              </div>
              <div className="flex justify-between">
                <span>Missing Email:</span>
                <span className="font-bold text-amber-400">{hoveredMonth.missingEmail}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
