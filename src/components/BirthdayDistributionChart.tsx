import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { TeamMember } from '../types';
import { MONTH_NAMES, parseBirthMonth, parseBirthdayDate } from '../utils/dateUtils';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Sparkles, 
  Cake, 
  ChevronRight, 
  CheckCircle2,
  Gift,
  ArrowUpRight,
  TrendingUp,
  X,
  Filter
} from 'lucide-react';

interface BirthdayDistributionChartProps {
  members: TeamMember[];
  onSelectMonth?: (monthIndex: number | null) => void;
  selectedMonth?: number | null;
}

export interface MonthData {
  monthIndex: number; // 0-11
  shortName: string;
  fullName: string;
  count: number;
  members: TeamMember[];
  isCurrentMonth: boolean;
}

export { parseBirthMonth, parseBirthdayDate };

// Helper to generate SVG path for a bar with rounded top corners only
function topRoundedRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): string {
  if (height <= 0 || width <= 0) return '';
  const r = Math.max(0, Math.min(radius, height, width / 2));
  const bottom = y + height;
  const right = x + width;

  if (r === 0) {
    return `M ${x} ${bottom} L ${x} ${y} L ${right} ${y} L ${right} ${bottom} Z`;
  }

  return `M ${x} ${bottom} 
          L ${x} ${y + r} 
          A ${r} ${r} 0 0 1 ${x + r} ${y} 
          L ${right - r} ${y} 
          A ${r} ${r} 0 0 1 ${right} ${y + r} 
          L ${right} ${bottom} 
          Z`;
}

export const BirthdayDistributionChart: React.FC<BirthdayDistributionChartProps> = ({
  members,
  onSelectMonth,
  selectedMonth = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredMonth, setHoveredMonth] = useState<MonthData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [activeMonthFilter, setActiveMonthFilter] = useState<number | null>(selectedMonth);

  // Sync external selectedMonth changes
  useEffect(() => {
    setActiveMonthFilter(selectedMonth);
  }, [selectedMonth]);

  const currentMonthIndex = new Date().getMonth(); // 0-11 (e.g. August = 7)

  // Compute month distribution data guaranteeing all 12 calendar months (0..11)
  const monthData: MonthData[] = useMemo(() => {
    // Explicitly initialize all 12 calendar months
    const groups: MonthData[] = MONTH_NAMES.map((m, idx) => ({
      monthIndex: idx,
      shortName: m.short,
      fullName: m.full,
      count: 0,
      members: [],
      isCurrentMonth: idx === currentMonthIndex,
    }));

    members.forEach((member) => {
      const monthIdx = parseBirthMonth(member.birthday);
      if (monthIdx !== null && monthIdx >= 0 && monthIdx <= 11) {
        groups[monthIdx].count += 1;
        groups[monthIdx].members.push(member);
      }
    });

    return groups;
  }, [members, currentMonthIndex]);

  const totalWithBirthdays = useMemo(() => {
    return monthData.reduce((acc, curr) => acc + curr.count, 0);
  }, [monthData]);

  const peakMonth = useMemo(() => {
    let max = 0;
    let peak: MonthData | null = null;
    monthData.forEach((m) => {
      if (m.count > max) {
        max = m.count;
        peak = m;
      }
    });
    return peak;
  }, [monthData]);

  const currentMonthData = monthData[currentMonthIndex];
  const activeSelectedData = activeMonthFilter !== null ? monthData[activeMonthFilter] : null;

  // D3 Chart Render
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll('*').remove(); // Clear previous render

    const containerWidth = containerRef.current.clientWidth || 750;
    const height = 290;
    const margin = { top: 38, right: 24, bottom: 48, left: 38 };
    const width = containerWidth;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svgElement
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height);

    const g = svgElement
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale with all 12 months explicitly mapped
    const allMonthShortNames = MONTH_NAMES.map((m) => m.short);
    const xScale = d3
      .scaleBand<string>()
      .domain(allMonthShortNames)
      .range([0, innerWidth])
      .padding(0.30);

    // Y scale
    const maxCount = d3.max(monthData, (d) => d.count) || 1;
    const yDomainMax = Math.max(maxCount + 1, 4);
    const yScale = d3
      .scaleLinear()
      .domain([0, yDomainMax])
      .range([innerHeight, 0])
      .nice();

    // Defs for gradients & shadow filters
    const defs = svgElement.append('defs');

    // Filter for bar glow
    const barGlow = defs
      .append('filter')
      .attr('id', 'bday-bar-glow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');
    barGlow.append('feDropShadow')
      .attr('dx', '0')
      .attr('dy', '4')
      .attr('stdDeviation', '4')
      .attr('flood-opacity', '0.22')
      .attr('flood-color', '#1e40af');

    // Current Month Bar Glow
    const currentMonthGlow = defs
      .append('filter')
      .attr('id', 'bday-current-glow')
      .attr('x', '-25%')
      .attr('y', '-25%')
      .attr('width', '150%')
      .attr('height', '150%');
    currentMonthGlow.append('feDropShadow')
      .attr('dx', '0')
      .attr('dy', '4')
      .attr('stdDeviation', '5')
      .attr('flood-opacity', '0.35')
      .attr('flood-color', '#059669');

    // Default primary bar gradient (Royal Blue to Indigo)
    const defaultGrad = defs
      .append('linearGradient')
      .attr('id', 'bday-bar-default')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    defaultGrad.append('stop').attr('offset', '0%').attr('stop-color', '#60a5fa');
    defaultGrad.append('stop').attr('offset', '40%').attr('stop-color', '#3b82f6');
    defaultGrad.append('stop').attr('offset', '100%').attr('stop-color', '#1d4ed8');

    // Current month gradient (Vibrant Emerald / Teal)
    const currentGrad = defs
      .append('linearGradient')
      .attr('id', 'bday-bar-current')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    currentGrad.append('stop').attr('offset', '0%').attr('stop-color', '#34d399');
    currentGrad.append('stop').attr('offset', '40%').attr('stop-color', '#10b981');
    currentGrad.append('stop').attr('offset', '100%').attr('stop-color', '#047857');

    // Active selected gradient (Amber)
    const selectedGrad = defs
      .append('linearGradient')
      .attr('id', 'bday-bar-selected')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    selectedGrad.append('stop').attr('offset', '0%').attr('stop-color', '#fbbf24');
    selectedGrad.append('stop').attr('offset', '40%').attr('stop-color', '#f59e0b');
    selectedGrad.append('stop').attr('offset', '100%').attr('stop-color', '#b45309');

    // Zero count bar background (Subtle Slate Pill)
    const zeroGrad = defs
      .append('linearGradient')
      .attr('id', 'bday-bar-zero')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    zeroGrad.append('stop').attr('offset', '0%').attr('stop-color', '#e2e8f0');
    zeroGrad.append('stop').attr('offset', '100%').attr('stop-color', '#cbd5e1');

    // Horizontal subtle dashed grid lines
    const yTicks = yScale.ticks(Math.min(yDomainMax, 5));
    g.append('g')
      .attr('class', 'grid-lines')
      .selectAll('line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', '#e2e8f0')
      .attr('stroke-dasharray', '4 4')
      .attr('stroke-width', 1);

    // X Axis with all 12 months explicitly displayed
    const xAxis = d3.axisBottom(xScale).tickSize(0);
    const xAxisGroup = g
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisGroup.select('.domain').attr('stroke', '#cbd5e1').attr('stroke-width', 1.5);

    xAxisGroup
      .selectAll<SVGTextElement, string>('.tick text')
      .attr('dy', '14px')
      .attr('font-size', '12px')
      .attr('font-weight', (d: string) => {
        const monthIdx = MONTH_NAMES.findIndex((m) => m.short === d);
        return monthIdx === currentMonthIndex || monthIdx === activeMonthFilter ? '800' : '600';
      })
      .attr('fill', (d: string) => {
        const monthIdx = MONTH_NAMES.findIndex((m) => m.short === d);
        if (monthIdx === activeMonthFilter) return '#b45309';
        if (monthIdx === currentMonthIndex) return '#047857';
        return '#64748b';
      });

    // Y Axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(Math.min(yDomainMax, 5))
      .tickFormat(d3.format('d'))
      .tickSize(-4);

    const yAxisGroup = g.append('g').attr('class', 'y-axis').call(yAxis);
    yAxisGroup.select('.domain').remove();
    yAxisGroup
      .selectAll('.tick text')
      .attr('dx', '-8px')
      .attr('font-size', '11px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-weight', '600')
      .attr('fill', '#94a3b8');

    // Bar Groups for each of the 12 calendar months
    const barGroups = g
      .selectAll<SVGGElement, MonthData>('.bar-group')
      .data(monthData)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('cursor', 'pointer')
      .on('mouseenter', function (event: MouseEvent, d: MonthData) {
        setHoveredMonth(d);
        if (containerRef.current) {
          const [x, y] = d3.pointer(event, containerRef.current);
          setTooltipPos({ x, y });
        }
      })
      .on('mousemove', function (event: MouseEvent) {
        if (containerRef.current) {
          const [x, y] = d3.pointer(event, containerRef.current);
          setTooltipPos({ x, y });
        }
      })
      .on('mouseleave', function () {
        setHoveredMonth(null);
        setTooltipPos(null);
      })
      .on('click', function (_event: MouseEvent, d: MonthData) {
        const newFilter = activeMonthFilter === d.monthIndex ? null : d.monthIndex;
        setActiveMonthFilter(newFilter);
        if (onSelectMonth) {
          onSelectMonth(newFilter);
        }
      });

    // Column background track on hover
    barGroups
      .append('rect')
      .attr('class', 'hover-bg')
      .attr('x', (d: MonthData) => (xScale(d.shortName) || 0) - 3)
      .attr('y', 0)
      .attr('width', xScale.bandwidth() + 6)
      .attr('height', innerHeight)
      .attr('fill', (d: MonthData) => {
        if (d.monthIndex === activeMonthFilter) return 'rgba(245, 158, 11, 0.09)';
        if (d.isCurrentMonth) return 'rgba(16, 185, 129, 0.08)';
        return 'transparent';
      })
      .attr('rx', 8);

    // Render Bars with Rounded Top Corners
    const barRadius = 7; // radius for top corners

    barGroups
      .append('path')
      .attr('class', 'bar-path')
      .attr('fill', (d: MonthData) => {
        if (d.monthIndex === activeMonthFilter) return 'url(#bday-bar-selected)';
        if (d.isCurrentMonth) return 'url(#bday-bar-current)';
        if (d.count === 0) return 'url(#bday-bar-zero)';
        return 'url(#bday-bar-default)';
      })
      .attr('filter', (d: MonthData) => {
        if (d.count === 0) return null;
        if (d.isCurrentMonth) return 'url(#bday-current-glow)';
        return 'url(#bday-bar-glow)';
      })
      .attr('stroke', (d: MonthData) => {
        if (d.monthIndex === activeMonthFilter) return '#b45309';
        if (d.isCurrentMonth) return '#059669';
        if (d.count === 0) return '#cbd5e1';
        return '#2563eb';
      })
      .attr('stroke-width', (d: MonthData) => (d.count === 0 ? 1 : 1.2))
      .attr('stroke-dasharray', (d: MonthData) => (d.count === 0 ? '2 2' : 'none'))
      // Initial path at zero height
      .attr('d', (d: MonthData) => {
        const bx = xScale(d.shortName) || 0;
        const bw = xScale.bandwidth();
        return topRoundedRectPath(bx, innerHeight, bw, 0, barRadius);
      })
      // Smooth D3 Transition Animation to target height
      .transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attrTween('d', function (d: MonthData) {
        const bx = xScale(d.shortName) || 0;
        const bw = xScale.bandwidth();
        const targetHeight = d.count > 0 ? innerHeight - yScale(d.count) : 5; // 5px subtle cap for zero count
        const targetY = d.count > 0 ? yScale(d.count) : innerHeight - 5;

        return function (t: number) {
          const curH = targetHeight * t;
          const curY = innerHeight - curH;
          return topRoundedRectPath(bx, curY, bw, curH, barRadius);
        };
      });

    // Count badge above bars with animated movement and fade-in
    barGroups
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d: MonthData) => (xScale(d.shortName) || 0) + xScale.bandwidth() / 2)
      .attr('y', innerHeight - 4)
      .attr('opacity', 0)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-weight', '800')
      .attr('fill', (d: MonthData) => {
        if (d.monthIndex === activeMonthFilter) return '#b45309';
        if (d.isCurrentMonth) return '#047857';
        if (d.count === 0) return '#94a3b8';
        return '#1e40af';
      })
      .text((d: MonthData) => d.count)
      .transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('opacity', 1)
      .attr('y', (d: MonthData) => (d.count > 0 ? yScale(d.count) - 8 : innerHeight - 9));

    // Current month bottom indicator dot
    const currentMonthObj = monthData[currentMonthIndex];
    if (currentMonthObj && xScale(currentMonthObj.shortName) !== undefined) {
      const cx = (xScale(currentMonthObj.shortName) || 0) + xScale.bandwidth() / 2;
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', innerHeight + 28)
        .attr('r', 3.5)
        .attr('fill', '#10b981');
    }
  }, [monthData, currentMonthIndex, activeMonthFilter, onSelectMonth]);

  // Handle Resize Observer
  useEffect(() => {
    const handleResize = () => {
      if (!svgRef.current || !containerRef.current) return;
      setActiveMonthFilter((prev) => prev);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const handleMonthPillClick = (monthIdx: number) => {
    const newIdx = activeMonthFilter === monthIdx ? null : monthIdx;
    setActiveMonthFilter(newIdx);
    if (onSelectMonth) {
      onSelectMonth(newIdx);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-6 transition-all">
      {/* Executive Header */}
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                Team Birthday Distribution Analytics
              </h3>
              <span className="text-[11px] font-semibold font-mono px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-400/30">
                All 12 Calendar Months (D3.js)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Live calendar distribution based on Google Sheet roster • <span className="font-semibold text-slate-100">{totalWithBirthdays} registered dates</span>
            </p>
          </div>
        </div>

        {/* Highlight KPI Pills */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Current Month Active Pill */}
          <div 
            onClick={() => handleMonthPillClick(currentMonthIndex)}
            className="cursor-pointer bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 px-3 py-1.5 rounded-xl flex items-center gap-2.5 transition"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                This Month ({MONTH_NAMES[currentMonthIndex].full})
              </span>
              <span className="text-xs font-black text-emerald-100 font-mono flex items-center gap-1.5">
                {currentMonthData?.count || 0} Celebrant{currentMonthData?.count === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {/* Peak Month Pill */}
          {peakMonth && peakMonth.count > 0 && (
            <div 
              onClick={() => handleMonthPillClick(peakMonth.monthIndex)}
              className="cursor-pointer bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 px-3 py-1.5 rounded-xl flex items-center gap-2.5 transition"
            >
              <Cake className="w-4 h-4 text-amber-400" />
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-amber-300">
                  Peak Month ({peakMonth.shortName})
                </span>
                <span className="text-xs font-black text-amber-100 font-mono">
                  {peakMonth.count} Birthdays
                </span>
              </div>
            </div>
          )}

          {activeMonthFilter !== null && (
            <button
              onClick={() => handleMonthPillClick(activeMonthFilter)}
              className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Current Month Active Celebrants Quick Bar */}
      {currentMonthData && currentMonthData.count > 0 && (
        <div className="px-5 py-2.5 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-950 font-bold">
            <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{MONTH_NAMES[currentMonthIndex].full} Birthday Celebrants ({currentMonthData.count}):</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {currentMonthData.members.map((m) => (
                <span
                  key={m.id || m.sl || m.name}
                  className="inline-flex items-center gap-1 bg-white border border-emerald-300 text-emerald-900 font-semibold px-2 py-0.5 rounded-lg shadow-2xs text-[11px]"
                >
                  <span className="font-bold text-emerald-950">{m.name}</span>
                  <span className="text-emerald-700 font-mono font-bold bg-emerald-100 px-1 py-0.2 rounded text-[10px]">
                    {m.birthday}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <span className="text-[11px] text-emerald-700 font-medium hidden sm:inline">
            Click month bars below to filter roster table
          </span>
        </div>
      )}

      {/* Chart Canvas Area */}
      <div className="p-5 relative" ref={containerRef}>
        <div className="w-full overflow-hidden">
          <svg ref={svgRef} className="w-full overflow-visible" />
        </div>

        {/* Interactive Floating Tooltip */}
        {hoveredMonth && tooltipPos && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900 text-white rounded-xl shadow-2xl p-3.5 text-xs w-72 border border-slate-700/80 backdrop-blur-md transition-all duration-75 -translate-x-1/2 -translate-y-full mb-3"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 14}px`,
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
              <div className="flex items-center gap-1.5 font-bold text-white text-sm">
                <Calendar className="w-4 h-4 text-emerald-400" />
                {hoveredMonth.fullName}
              </div>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  hoveredMonth.isCurrentMonth
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {hoveredMonth.count} member{hoveredMonth.count === 1 ? '' : 's'}
              </span>
            </div>

            {hoveredMonth.count === 0 ? (
              <p className="text-[11px] text-slate-400 italic py-1">No birthdays registered for this month.</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {hoveredMonth.members.map((m) => (
                  <div
                    key={m.id || m.sl || m.name}
                    className="flex items-center justify-between text-[11px] bg-slate-800/90 px-2.5 py-1.5 rounded-lg border border-slate-700/60"
                  >
                    <div className="truncate pr-2">
                      <span className="font-bold text-slate-100 block truncate">{m.name}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{m.designation || 'Team Member'}</span>
                    </div>
                    <span className="font-mono text-amber-300 text-[11px] whitespace-nowrap font-bold bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded">
                      {m.birthday}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Click bar to filter table</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>
        )}
      </div>

      {/* Month Filter Selector Pills for all 12 months */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200/70 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
          Month Filter:
        </span>

        <button
          onClick={() => handleMonthPillClick(-1)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            activeMonthFilter === null
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Months ({members.length})
        </button>

        {monthData.map((m) => {
          const isActive = activeMonthFilter === m.monthIndex;
          const isCurrent = m.isCurrentMonth;

          return (
            <button
              key={m.shortName}
              onClick={() => handleMonthPillClick(m.monthIndex)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-amber-600 text-white font-bold shadow-sm'
                  : isCurrent
                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold hover:bg-emerald-200'
                  : m.count > 0
                  ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
                  : 'bg-slate-100/70 text-slate-400 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <span>{m.shortName}</span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                  isActive
                    ? 'bg-amber-700 text-white'
                    : isCurrent
                    ? 'bg-emerald-200 text-emerald-950'
                    : m.count > 0
                    ? 'bg-slate-100 text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {m.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Month Detail Drawer if filtered */}
      {activeSelectedData && (
        <div className="p-4 bg-amber-50/70 border-t border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            <span className="font-bold text-amber-950">
              Showing {activeSelectedData.fullName} Celebrants ({activeSelectedData.count}):
            </span>
            <span className="text-amber-800">
              {activeSelectedData.members.map((m) => `${m.name} (${m.birthday})`).join(', ') || 'None'}
            </span>
          </div>
          <button
            onClick={() => handleMonthPillClick(activeSelectedData.monthIndex)}
            className="text-[11px] font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3 py-1 rounded-lg transition self-start sm:self-auto cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
};
