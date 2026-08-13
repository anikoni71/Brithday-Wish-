import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { TeamMember } from '../types';
import { BarChart3, Calendar, Users, Sparkles, ChevronRight, Cake, Info } from 'lucide-react';

interface BirthdayDistributionChartProps {
  members: TeamMember[];
  onSelectMonth?: (monthIndex: number | null) => void;
  selectedMonth?: number | null;
}

interface MonthData {
  monthIndex: number; // 0-11
  shortName: string;
  fullName: string;
  count: number;
  members: TeamMember[];
  isCurrentMonth: boolean;
}

const MONTH_NAMES = [
  { short: 'Jan', full: 'January' },
  { short: 'Feb', full: 'February' },
  { short: 'Mar', full: 'March' },
  { short: 'Apr', full: 'April' },
  { short: 'May', full: 'May' },
  { short: 'Jun', full: 'June' },
  { short: 'Jul', full: 'July' },
  { short: 'Aug', full: 'August' },
  { short: 'Sep', full: 'September' },
  { short: 'Oct', full: 'October' },
  { short: 'Nov', full: 'November' },
  { short: 'Dec', full: 'December' },
];

export function parseBirthMonth(birthdayStr?: string): number | null {
  if (!birthdayStr || typeof birthdayStr !== 'string') return null;
  const clean = birthdayStr.trim();
  if (!clean) return null;

  // Format YYYY-MM-DD
  if (/^\d{4}-\d{1,2}-\d{1,2}/.test(clean)) {
    const parts = clean.split('-');
    const m = parseInt(parts[1], 10);
    return m >= 1 && m <= 12 ? m - 1 : null;
  }

  // Format M/D, MM/DD, M/D/YYYY, etc.
  const parts = clean.split(/[-/.]/);
  if (parts.length >= 2) {
    const firstNum = parseInt(parts[0], 10);
    const secondNum = parseInt(parts[1], 10);
    if (!isNaN(firstNum) && firstNum >= 1 && firstNum <= 12 && !isNaN(secondNum) && secondNum >= 1 && secondNum <= 31) {
      return firstNum - 1;
    }
  }

  // Textual month name matching
  const lower = clean.toLowerCase();
  for (let i = 0; i < MONTH_NAMES.length; i++) {
    if (lower.startsWith(MONTH_NAMES[i].short.toLowerCase())) {
      return i;
    }
  }

  return null;
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

  const currentMonthIndex = new Date().getMonth(); // 0-11

  // Compute month distribution data
  const monthData: MonthData[] = useMemo(() => {
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

  // D3 Chart Render
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll('*').remove(); // Clear previous render

    const containerWidth = containerRef.current.clientWidth || 700;
    const height = 260;
    const margin = { top: 30, right: 24, bottom: 44, left: 40 };
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

    // X scale
    const xScale = d3
      .scaleBand<string>()
      .domain(monthData.map((d) => d.shortName))
      .range([0, innerWidth])
      .padding(0.32);

    // Y scale
    const maxCount = d3.max(monthData, (d) => d.count) || 1;
    const yDomainMax = Math.max(maxCount + 1, 4);
    const yScale = d3
      .scaleLinear()
      .domain([0, yDomainMax])
      .range([innerHeight, 0])
      .nice();

    // Defs for gradients
    const defs = svgElement.append('defs');

    // Default bar gradient
    const defaultGrad = defs
      .append('linearGradient')
      .attr('id', 'bar-gradient-default')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    defaultGrad.append('stop').attr('offset', '0%').attr('stop-color', '#3b82f6');
    defaultGrad.append('stop').attr('offset', '100%').attr('stop-color', '#1d4ed8');

    // Current month gradient (Emerald/Teal)
    const currentGrad = defs
      .append('linearGradient')
      .attr('id', 'bar-gradient-current')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    currentGrad.append('stop').attr('offset', '0%').attr('stop-color', '#10b981');
    currentGrad.append('stop').attr('offset', '100%').attr('stop-color', '#047857');

    // Active selected gradient (Amber)
    const selectedGrad = defs
      .append('linearGradient')
      .attr('id', 'bar-gradient-selected')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    selectedGrad.append('stop').attr('offset', '0%').attr('stop-color', '#f59e0b');
    selectedGrad.append('stop').attr('offset', '100%').attr('stop-color', '#b45309');

    // Zero count placeholder pattern / gradient
    const zeroGrad = defs
      .append('linearGradient')
      .attr('id', 'bar-gradient-zero')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    zeroGrad.append('stop').attr('offset', '0%').attr('stop-color', '#f1f5f9');
    zeroGrad.append('stop').attr('offset', '100%').attr('stop-color', '#e2e8f0');

    // Horizontal grid lines
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
      .attr('stroke-dasharray', '3 3')
      .attr('stroke-width', 1);

    // X Axis
    const xAxis = d3.axisBottom(xScale).tickSize(0);
    const xAxisGroup = g
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisGroup.select('.domain').attr('stroke', '#cbd5e1');

    xAxisGroup
      .selectAll('.tick text')
      .attr('dy', '14px')
      .attr('font-size', '11px')
      .attr('font-weight', (d) => {
        const monthIdx = MONTH_NAMES.findIndex((m) => m.short === d);
        return monthIdx === currentMonthIndex ? '700' : '500';
      })
      .attr('fill', (d) => {
        const monthIdx = MONTH_NAMES.findIndex((m) => m.short === d);
        if (monthIdx === activeMonthFilter) return '#d97706';
        if (monthIdx === currentMonthIndex) return '#059669';
        return '#64748b';
      });

    // Y Axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(Math.min(yDomainMax, 5))
      .tickFormat(d3.format('d'))
      .tickSize(-6);

    const yAxisGroup = g.append('g').attr('class', 'y-axis').call(yAxis);
    yAxisGroup.select('.domain').remove();
    yAxisGroup
      .selectAll('.tick text')
      .attr('dx', '-8px')
      .attr('font-size', '10px')
      .attr('fill', '#94a3b8');

    // Background track columns (clickable full-height hit area)
    const barGroups = g
      .selectAll('.bar-group')
      .data(monthData)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        setHoveredMonth(d);
        const [x, y] = d3.pointer(event, containerRef.current);
        setTooltipPos({ x, y });
      })
      .on('mousemove', function (event) {
        const [x, y] = d3.pointer(event, containerRef.current);
        setTooltipPos({ x, y });
      })
      .on('mouseleave', function () {
        setHoveredMonth(null);
        setTooltipPos(null);
      })
      .on('click', function (_event, d) {
        const newFilter = activeMonthFilter === d.monthIndex ? null : d.monthIndex;
        setActiveMonthFilter(newFilter);
        if (onSelectMonth) {
          onSelectMonth(newFilter);
        }
      });

    // Transparent hover column for easy interaction
    barGroups
      .append('rect')
      .attr('class', 'hover-bg')
      .attr('x', (d) => xScale(d.shortName) || 0)
      .attr('y', 0)
      .attr('width', xScale.bandwidth())
      .attr('height', innerHeight)
      .attr('fill', (d) => {
        if (d.monthIndex === activeMonthFilter) return 'rgba(245, 158, 11, 0.08)';
        if (d.isCurrentMonth) return 'rgba(16, 185, 129, 0.06)';
        return 'transparent';
      })
      .attr('rx', 6);

    // Bars
    barGroups
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.shortName) || 0)
      .attr('width', xScale.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('rx', 5)
      .attr('fill', (d) => {
        if (d.monthIndex === activeMonthFilter) return 'url(#bar-gradient-selected)';
        if (d.isCurrentMonth) return 'url(#bar-gradient-current)';
        if (d.count === 0) return 'url(#bar-gradient-zero)';
        return 'url(#bar-gradient-default)';
      })
      .attr('stroke', (d) => {
        if (d.monthIndex === activeMonthFilter) return '#d97706';
        if (d.isCurrentMonth) return '#059669';
        return 'transparent';
      })
      .attr('stroke-width', 1)
      .transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => (d.count > 0 ? yScale(d.count) : yScale(0.15)))
      .attr('height', (d) => (d.count > 0 ? innerHeight - yScale(d.count) : innerHeight - yScale(0.15)));

    // Count badges above bars
    barGroups
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', (d) => (xScale(d.shortName) || 0) + xScale.bandwidth() / 2)
      .attr('y', (d) => (d.count > 0 ? yScale(d.count) - 7 : yScale(0.15) - 6))
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '700')
      .attr('fill', (d) => {
        if (d.monthIndex === activeMonthFilter) return '#b45309';
        if (d.isCurrentMonth) return '#047857';
        if (d.count === 0) return '#cbd5e1';
        return '#1e40af';
      })
      .text((d) => d.count);

    // Current month indicator indicator pill at the bottom
    const currentMonthObj = monthData[currentMonthIndex];
    if (currentMonthObj && xScale(currentMonthObj.shortName) !== undefined) {
      const cx = (xScale(currentMonthObj.shortName) || 0) + xScale.bandwidth() / 2;
      g.append('circle')
        .attr('cx', cx)
        .attr('cy', innerHeight + 28)
        .attr('r', 3)
        .attr('fill', '#10b981');
    }
  }, [monthData, currentMonthIndex, activeMonthFilter, onSelectMonth]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (!svgRef.current || !containerRef.current) return;
      // Re-trigger effect by shallow force update or dispatch
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden mb-6">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 via-white to-slate-50">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            D3.js Data Visualization
          </div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Birthday Distribution by Month
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive breakdown of team birthdays across all 12 calendar months ({totalWithBirthdays} recorded dates)
          </p>
        </div>

        {/* Quick Stats Summary */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-emerald-50/80 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-emerald-800">
                This Month ({MONTH_NAMES[currentMonthIndex].short})
              </span>
              <span className="text-xs font-extrabold text-emerald-950 font-mono">
                {currentMonthData?.count || 0} Celebrant{currentMonthData?.count === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {peakMonth && peakMonth.count > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Cake className="w-4 h-4 text-amber-600" />
              <div>
                <span className="block text-[10px] uppercase font-bold text-amber-800">
                  Peak Month ({peakMonth.shortName})
                </span>
                <span className="text-xs font-extrabold text-amber-950 font-mono">
                  {peakMonth.count} Birthdays
                </span>
              </div>
            </div>
          )}

          {activeMonthFilter !== null && (
            <button
              onClick={() => handleMonthPillClick(activeMonthFilter)}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="p-5 relative" ref={containerRef}>
        <div className="w-full overflow-hidden">
          <svg ref={svgRef} className="w-full overflow-visible" />
        </div>

        {/* Interactive Floating Tooltip */}
        {hoveredMonth && tooltipPos && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900 text-white rounded-xl shadow-xl p-3 text-xs w-64 border border-slate-700 backdrop-blur-md transition-all duration-75 -translate-x-1/2 -translate-y-full mb-3"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 12}px`,
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-2">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                {hoveredMonth.fullName}
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  hoveredMonth.isCurrentMonth
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {hoveredMonth.count} member{hoveredMonth.count === 1 ? '' : 's'}
              </span>
            </div>

            {hoveredMonth.count === 0 ? (
              <p className="text-[11px] text-slate-400 italic">No birthdays registered for this month.</p>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {hoveredMonth.members.map((m) => (
                  <div
                    key={m.id || m.sl || m.name}
                    className="flex items-center justify-between text-[11px] bg-slate-800/80 px-2 py-1 rounded border border-slate-700/50"
                  >
                    <div className="truncate pr-2">
                      <span className="font-semibold text-slate-200">{m.name}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{m.designation}</span>
                    </div>
                    <span className="font-mono text-amber-300 text-[10px] whitespace-nowrap font-bold">
                      {m.birthday}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Click bar to filter list</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </div>
          </div>
        )}
      </div>

      {/* Month Filter Selector Pills */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
          <FilterIcon className="w-3 h-3 text-slate-400" /> Month Filter:
        </span>

        <button
          onClick={() => handleMonthPillClick(-1)}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
            activeMonthFilter === null
              ? 'bg-slate-900 text-white shadow-2xs'
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
              className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                isActive
                  ? 'bg-amber-600 text-white font-bold shadow-2xs'
                  : isCurrent
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold hover:bg-emerald-200'
                  : m.count > 0
                  ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-slate-100/70 text-slate-400 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <span>{m.shortName}</span>
              <span
                className={`text-[10px] font-mono px-1 rounded ${
                  isActive
                    ? 'bg-amber-700 text-amber-100'
                    : isCurrent
                    ? 'bg-emerald-200 text-emerald-900'
                    : m.count > 0
                    ? 'bg-slate-100 text-slate-600 font-bold'
                    : 'text-slate-400'
                }`}
              >
                {m.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
