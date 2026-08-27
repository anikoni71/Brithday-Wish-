import React, { useLayoutEffect, useRef, useState, useMemo, useEffect } from 'react';
import * as d3 from 'd3';
import { TeamMember } from '../types';
import { MONTH_NAMES, getBirthMonth, parseBirthdayDate } from '../utils/dateUtils';
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
  Filter,
  PieChart
} from 'lucide-react';
import { BirthdayMonthPieChart } from './BirthdayMonthPieChart';

export interface MonthData {
  monthIndex: number; // 0-11
  shortName: string;
  fullName: string;
  count: number;
  members: TeamMember[];
  isCurrentMonth: boolean;
}

export { getBirthMonth, parseBirthdayDate };

interface BirthdayDistributionChartProps {
  members?: TeamMember[];
  monthData?: MonthData[];
  onSelectMonth?: (monthIndex: number | null) => void;
  selectedMonth?: number | null;
}

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
  members = [],
  monthData: precomputedMonthData,
  onSelectMonth,
  selectedMonth = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isInitializedRef = useRef<boolean>(false);
  const prevDataSignatureRef = useRef<string>('');

  const [hoveredMonth, setHoveredMonth] = useState<MonthData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [activeMonthFilter, setActiveMonthFilter] = useState<number | null>(selectedMonth);
  const [chartWidth, setChartWidth] = useState<number>(0);

  // Sync external selectedMonth changes
  useEffect(() => {
    setActiveMonthFilter(selectedMonth);
  }, [selectedMonth]);

  // Responsive ResizeObserver with debounce
  useEffect(() => {
    if (!containerRef.current) return;
    let timeoutId: any = null;

    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setChartWidth(w);
      }
    };
    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateWidth, 100);
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, []);

  const currentMonthIndex = new Date().getMonth(); // 0-11 (e.g. August = 7)

  // Use precomputed data if provided, otherwise compute locally
  const monthData: MonthData[] = useMemo(() => {
    if (precomputedMonthData && precomputedMonthData.length === 12) {
      return precomputedMonthData;
    }

    const groups: MonthData[] = MONTH_NAMES.map((m, idx) => ({
      monthIndex: idx,
      shortName: m.short,
      fullName: m.full,
      count: 0,
      members: [],
      isCurrentMonth: idx === currentMonthIndex,
    }));

    members.forEach((member) => {
      const monthIdx = getBirthMonth(member.birthday);
      if (monthIdx !== null && monthIdx >= 0 && monthIdx <= 11) {
        groups[monthIdx].count += 1;
        groups[monthIdx].members.push(member);
      }
    });

    return groups;
  }, [precomputedMonthData, members, currentMonthIndex]);

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

  // Compute signature of data values to distinguish structural init from dynamic updates
  const dataSignature = useMemo(() => {
    return monthData.map((m) => `${m.shortName}:${m.count}`).join('|') + `_w:${chartWidth}_filter:${activeMonthFilter}`;
  }, [monthData, chartWidth, activeMonthFilter]);

  // D3 Chart Lifecycle using useEffect to ensure safe rendering scope
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svgElement = d3.select(svgRef.current);
    const containerWidth = containerRef.current.clientWidth || 750;
    const height = 310;
    const margin = { top: 56, right: 22, bottom: 48, left: 38 };
    const width = containerWidth;
    const innerWidth = Math.max(100, width - margin.left - margin.right);
    const innerHeight = Math.max(50, height - margin.top - margin.bottom);

    svgElement
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height);

    const allMonthShortNames = MONTH_NAMES.map((m) => m.short);
    const xScale = d3
      .scaleBand<string>()
      .domain(allMonthShortNames)
      .range([0, innerWidth])
      .padding(0.28);

    const maxCount = d3.max(monthData, (d) => d.count) || 1;
    const yDomainMax = Math.max(maxCount + 1, 4);
    const yScale = d3
      .scaleLinear()
      .domain([0, yDomainMax])
      .range([innerHeight, 0])
      .nice();

    let g = svgElement.select<SVGGElement>('g.main-chart-group');

    // ONLY create structural DOM elements (defs, axes, background grids) if they do not exist
    if (g.empty()) {
      isInitializedRef.current = false;
      svgElement.selectAll('*').remove();

      // Defs setup
      const defs = svgElement.append('defs');

      // Add Candle Flame CSS animation styles into defs
      defs.append('style').attr('id', 'candle-flame-styles').text(`
        @keyframes candleFlicker {
          0% {
            transform: scale(1, 1) rotate(0deg) translateY(0);
            filter: drop-shadow(0 0 3.5px rgba(251, 191, 36, 0.85));
          }
          20% {
            transform: scale(1.08, 0.92) rotate(-2.5deg) translateY(-0.6px);
            filter: drop-shadow(0 0 5.5px rgba(245, 158, 11, 0.95));
          }
          40% {
            transform: scale(0.92, 1.08) rotate(2deg) translateY(-1.2px);
            filter: drop-shadow(0 0 3px rgba(251, 191, 36, 0.8));
          }
          60% {
            transform: scale(1.05, 0.95) rotate(-1.5deg) translateY(-0.4px);
            filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.9));
          }
          80% {
            transform: scale(0.95, 1.05) rotate(1.8deg) translateY(-0.9px);
            filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.85));
          }
          100% {
            transform: scale(1, 1) rotate(0deg) translateY(0);
            filter: drop-shadow(0 0 3.5px rgba(251, 191, 36, 0.85));
          }
        }

        @keyframes candleHaloPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.18);
            opacity: 0.98;
          }
        }

        .candle-flame-outer, .candle-flame-inner {
          transform-origin: 0px 0px;
          animation: candleFlicker 1.35s ease-in-out infinite;
          animation-delay: var(--flame-delay, 0s);
        }

        .candle-halo {
          transform-origin: 0px -9px;
          animation: candleHaloPulse 1.6s ease-in-out infinite;
          animation-delay: var(--flame-delay, 0s);
        }

        /* Performance optimized CSS transitions for SVG elements */
        .candle-pillar, .candle-highlight, .candle-wick, .candle-flame-group, .bar-label {
          transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        @keyframes barFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .bar-group {
          animation: barFadeIn 0.5s ease-out forwards;
          animation-delay: var(--stagger-delay, 0s);
          opacity: 0;
        }

        .bar-group.is-hovered .candle-pillar,
        .bar-group.is-active .candle-pillar {
          filter: brightness(1.1) drop-shadow(0 0 8px rgba(16, 185, 129, 0.3));
          transform: scaleY(1.03);
          transform-origin: bottom;
        }

        .bar-group.is-hovered .candle-flame-group,
        .bar-group.is-active .candle-flame-group {
          transform: translate(var(--flame-x), calc(var(--flame-y) - 3px)) scale(1.1) !important;
        }

        .grid-line {
          transition: transform 0.4s ease-out, opacity 0.4s ease-out;
        }
      `);

      // Candle Glow Filter
      const candleGlow = defs
        .append('filter')
        .attr('id', 'bday-candle-glow')
        .attr('x', '-30%')
        .attr('y', '-30%')
        .attr('width', '160%')
        .attr('height', '160%');
      candleGlow.append('feDropShadow')
        .attr('dx', '0')
        .attr('dy', '4')
        .attr('stdDeviation', '4')
        .attr('flood-opacity', '0.25')
        .attr('flood-color', '#047857');

      // Current Month Candle Glow
      const currentMonthGlow = defs
        .append('filter')
        .attr('id', 'bday-current-candle-glow')
        .attr('x', '-35%')
        .attr('y', '-35%')
        .attr('width', '170%')
        .attr('height', '170%');
      currentMonthGlow.append('feDropShadow')
        .attr('dx', '0')
        .attr('dy', '4')
        .attr('stdDeviation', '6')
        .attr('flood-opacity', '0.4')
        .attr('flood-color', '#10b981');

      // Candle Cylinder Teal/Emerald Gradient (matching attached image)
      const emeraldGrad = defs
        .append('linearGradient')
        .attr('id', 'candle-pillar-emerald')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '0%');
      emeraldGrad.append('stop').attr('offset', '0%').attr('stop-color', '#059669');
      emeraldGrad.append('stop').attr('offset', '18%').attr('stop-color', '#10b981');
      emeraldGrad.append('stop').attr('offset', '50%').attr('stop-color', '#34d399');
      emeraldGrad.append('stop').attr('offset', '82%').attr('stop-color', '#10b981');
      emeraldGrad.append('stop').attr('offset', '100%').attr('stop-color', '#059669');

      // Current Month Candle Gradient
      const currentGrad = defs
        .append('linearGradient')
        .attr('id', 'candle-pillar-current')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '0%');
      currentGrad.append('stop').attr('offset', '0%').attr('stop-color', '#047857');
      currentGrad.append('stop').attr('offset', '20%').attr('stop-color', '#059669');
      currentGrad.append('stop').attr('offset', '50%').attr('stop-color', '#6ee7b7');
      currentGrad.append('stop').attr('offset', '80%').attr('stop-color', '#10b981');
      currentGrad.append('stop').attr('offset', '100%').attr('stop-color', '#047857');

      // Selected Candle Gradient
      const selectedGrad = defs
        .append('linearGradient')
        .attr('id', 'candle-pillar-selected')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '0%');
      selectedGrad.append('stop').attr('offset', '0%').attr('stop-color', '#b45309');
      selectedGrad.append('stop').attr('offset', '20%').attr('stop-color', '#d97706');
      selectedGrad.append('stop').attr('offset', '50%').attr('stop-color', '#fde68a');
      selectedGrad.append('stop').attr('offset', '80%').attr('stop-color', '#f59e0b');
      selectedGrad.append('stop').attr('offset', '100%').attr('stop-color', '#b45309');

      // Zero count bar background
      const zeroGrad = defs
        .append('linearGradient')
        .attr('id', 'candle-pillar-zero')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '0%');
      zeroGrad.append('stop').attr('offset', '0%').attr('stop-color', '#cbd5e1');
      zeroGrad.append('stop').attr('offset', '50%').attr('stop-color', '#e2e8f0');
      zeroGrad.append('stop').attr('offset', '100%').attr('stop-color', '#cbd5e1');

      // Candle Flame Halo (Warm Amber Glow)
      const haloGrad = defs
        .append('radialGradient')
        .attr('id', 'candle-halo-glow')
        .attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
      haloGrad.append('stop').attr('offset', '0%').attr('stop-color', '#fbbf24').attr('stop-opacity', '0.85');
      haloGrad.append('stop').attr('offset', '35%').attr('stop-color', '#f59e0b').attr('stop-opacity', '0.55');
      haloGrad.append('stop').attr('offset', '70%').attr('stop-color', '#d97706').attr('stop-opacity', '0.18');
      haloGrad.append('stop').attr('offset', '100%').attr('stop-color', '#d97706').attr('stop-opacity', '0');

      // Candle Flame Outer Teardrop Gradient
      const flameOuterGrad = defs
        .append('linearGradient')
        .attr('id', 'candle-flame-outer-grad')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '0%').attr('y2', '100%');
      flameOuterGrad.append('stop').attr('offset', '0%').attr('stop-color', '#ffffff');
      flameOuterGrad.append('stop').attr('offset', '20%').attr('stop-color', '#fef08a');
      flameOuterGrad.append('stop').attr('offset', '55%').attr('stop-color', '#fbbf24');
      flameOuterGrad.append('stop').attr('offset', '80%').attr('stop-color', '#f97316');
      flameOuterGrad.append('stop').attr('offset', '100%').attr('stop-color', '#ea580c');

      // Candle Flame Inner Core Gradient
      const flameInnerGrad = defs
        .append('linearGradient')
        .attr('id', 'candle-flame-inner-grad')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '0%').attr('y2', '100%');
      flameInnerGrad.append('stop').attr('offset', '0%').attr('stop-color', '#ffffff');
      flameInnerGrad.append('stop').attr('offset', '65%').attr('stop-color', '#ffffff');
      flameInnerGrad.append('stop').attr('offset', '100%').attr('stop-color', '#fef08a');

      g = svgElement
        .append('g')
        .attr('class', 'main-chart-group')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      g.append('g').attr('class', 'grid-lines');
      g.append('g').attr('class', 'x-axis');
      g.append('g').attr('class', 'y-axis');
      g.append('g').attr('class', 'bars-container');
      g.append('circle').attr('class', 'current-month-indicator');
    }

    g.attr('transform', `translate(${margin.left},${margin.top})`);

    // Render Grid Lines
    const yTicks = yScale.ticks(Math.min(yDomainMax, 5));
    const gridLines = g.select('.grid-lines').selectAll<SVGLineElement, number>('line').data(yTicks);

    gridLines.exit().remove();

    gridLines
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .merge(gridLines)
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', '#e2e8f0')
      .attr('stroke-dasharray', '4 4')
      .attr('stroke-width', 1);

    // Render X Axis
    const xAxis = d3.axisBottom(xScale).tickSize(0);
    const xAxisGroup = g
      .select<SVGGElement>('.x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisGroup.select('.domain').attr('stroke', '#cbd5e1').attr('stroke-width', 1.5);
    xAxisGroup
      .selectAll<SVGTextElement, string>('.tick text')
      .attr('dy', '14px')
      .attr('font-size', '12px')
      .attr('class', (d: string) => {
        const monthIdx = MONTH_NAMES.findIndex((m) => m.short === d);
        let classes = 'month-tick-label transition-colors duration-300 ';
        if (monthIdx === activeMonthFilter) classes += 'font-extrabold fill-amber-700';
        else if (monthIdx === currentMonthIndex) classes += 'font-bold fill-emerald-700';
        else classes += 'font-semibold fill-slate-500';
        return classes;
      });

    // Render Y Axis
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(Math.min(yDomainMax, 5))
      .tickFormat(d3.format('d'))
      .tickSize(-4);

    const yAxisGroup = g.select<SVGGElement>('.y-axis').call(yAxis);
    yAxisGroup.select('.domain').remove();
    yAxisGroup
      .selectAll('.tick text')
      .attr('dx', '-8px')
      .attr('font-size', '11px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-weight', '600')
      .attr('fill', '#94a3b8');

    // Candle Pillar Width & Geometry calculation
    const bandwidth = xScale.bandwidth();
    const candleWidth = Math.max(14, Math.min(bandwidth * 0.52, 24));
    const candleRadius = Math.min(candleWidth / 2, 7);

    // Data-Join for Bars
    const barsContainer = g.select('.bars-container');
    const barGroups = barsContainer
      .selectAll<SVGGElement, MonthData>('.bar-group')
      .data(monthData, (d) => d.shortName);

    barGroups.exit().remove();

    const barGroupsEnter = barGroups
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('cursor', 'pointer')
      .style('--stagger-delay', (d: MonthData) => `${d.monthIndex * 0.05}s`);

    // Attach mouse interactions on enter selection
    barGroupsEnter
      .on('mouseenter', function (event: MouseEvent, d: MonthData) {
        d3.select(this).classed('is-hovered', true);
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
        d3.select(this).classed('is-hovered', false);
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

    // 1. Hover Backdrop Rect
    barGroupsEnter
      .append('rect')
      .attr('class', 'hover-bg transition-all duration-300')
      .attr('y', 0)
      .attr('rx', 8);

    // 2. Candle Body Rect (smooth cylindrical pill)
    barGroupsEnter
      .append('rect')
      .attr('class', 'candle-pillar transition-all duration-500')
      .attr('rx', candleRadius)
      .attr('ry', candleRadius);

    // 3. Specular Vertical Highlight Strip (left 3D shine matching attached image)
    barGroupsEnter
      .append('rect')
      .attr('class', 'candle-highlight transition-all duration-500')
      .attr('rx', 1)
      .attr('ry', 1)
      .attr('fill', 'rgba(255, 255, 255, 0.48)')
      .attr('pointer-events', 'none');

    // 4. Candle Wick (gray stick at top center)
    barGroupsEnter
      .append('line')
      .attr('class', 'candle-wick transition-all duration-500')
      .attr('stroke', '#64748b')
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round')
      .attr('pointer-events', 'none');

    // 5. Candle Flame Group (halo + animated teardrop flames)
    const flameGroup = barGroupsEnter
      .append('g')
      .attr('class', 'candle-flame-group transition-all duration-500')
      .attr('pointer-events', 'none');

    // Halo Glow
    flameGroup
      .append('circle')
      .attr('class', 'candle-halo')
      .attr('cx', 0)
      .attr('cy', -9)
      .attr('r', 13)
      .attr('fill', 'url(#candle-halo-glow)');

    // Outer Teardrop Flame
    flameGroup
      .append('path')
      .attr('class', 'candle-flame-outer')
      .attr('d', 'M 0 0 C -4 -4, -6 -10, 0 -17 C 6 -10, 4 -4, 0 0 Z')
      .attr('fill', 'url(#candle-flame-outer-grad)');

    // Inner Bright Core Flame
    flameGroup
      .append('path')
      .attr('class', 'candle-flame-inner')
      .attr('d', 'M 0 -1.5 C -2 -4, -2.5 -7.5, 0 -12 C 2.5 -7.5, 2 -4, 0 -1.5 Z')
      .attr('fill', 'url(#candle-flame-inner-grad)');

    // 6. Bar Count Text Label
    barGroupsEnter
      .append('text')
      .attr('class', 'bar-label transition-all duration-500')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-weight', '800')
      .attr('opacity', 0);

    const allBarGroups = barGroupsEnter.merge(barGroups);

    // Apply state classes for CSS styling
    allBarGroups
      .classed('is-active', (d: MonthData) => d.monthIndex === activeMonthFilter)
      .classed('is-current', (d: MonthData) => d.isCurrentMonth)
      .classed('is-zero', (d: MonthData) => d.count === 0);

    // Update hover backgrounds
    allBarGroups
      .select<SVGRectElement>('.hover-bg')
      .attr('x', (d: MonthData) => (xScale(d.shortName) || 0) - 2)
      .attr('width', xScale.bandwidth() + 4)
      .attr('height', innerHeight)
      .attr('fill', (d: MonthData) => {
        if (d.monthIndex === activeMonthFilter) return 'rgba(245, 158, 11, 0.09)';
        if (d.isCurrentMonth) return 'rgba(16, 185, 129, 0.08)';
        return 'transparent';
      });

    // Update Candle Pillars
    allBarGroups
      .select<SVGRectElement>('.candle-pillar')
      .attr('x', (d: MonthData) => (xScale(d.shortName) || 0) + (xScale.bandwidth() - candleWidth) / 2)
      .attr('width', candleWidth)
      .attr('rx', candleRadius)
      .attr('ry', candleRadius)
      .attr('fill', (d: MonthData) => {
        if (d.monthIndex === activeMonthFilter) return 'url(#candle-pillar-selected)';
        if (d.isCurrentMonth) return 'url(#candle-pillar-current)';
        if (d.count === 0) return 'url(#candle-pillar-zero)';
        return 'url(#candle-pillar-emerald)';
      })
      .attr('filter', (d: MonthData) => {
        if (d.count === 0) return null;
        if (d.isCurrentMonth) return 'url(#bday-current-candle-glow)';
        return 'url(#bday-candle-glow)';
      })
      .attr('stroke', (d: MonthData) => {
        if (d.monthIndex === activeMonthFilter) return '#d97706';
        if (d.isCurrentMonth) return '#059669';
        if (d.count === 0) return '#cbd5e1';
        return '#047857';
      })
      .attr('stroke-width', (d: MonthData) => (d.count === 0 ? 1 : 1.2))
      .attr('y', (d: MonthData) => (d.count > 0 ? yScale(d.count) : innerHeight - 4))
      .attr('height', (d: MonthData) => (d.count > 0 ? innerHeight - yScale(d.count) : 4));

    // Update Specular Highlight Stripes
    allBarGroups
      .select<SVGRectElement>('.candle-highlight')
      .attr('x', (d: MonthData) => (xScale(d.shortName) || 0) + (xScale.bandwidth() - candleWidth) / 2 + 2.5)
      .attr('width', 2)
      .attr('opacity', (d: MonthData) => (d.count > 0 ? 1 : 0))
      .attr('y', (d: MonthData) => (d.count > 0 ? yScale(d.count) + 3.5 : innerHeight - 3))
      .attr('height', (d: MonthData) => (d.count > 0 ? Math.max(0, innerHeight - yScale(d.count) - 7) : 0));

    // Update Candle Wicks
    allBarGroups
      .select<SVGLineElement>('.candle-wick')
      .attr('x1', (d: MonthData) => (xScale(d.shortName) || 0) + xScale.bandwidth() / 2)
      .attr('x2', (d: MonthData) => (xScale(d.shortName) || 0) + xScale.bandwidth() / 2)
      .attr('opacity', (d: MonthData) => (d.count > 0 ? 1 : 0))
      .attr('y1', (d: MonthData) => (d.count > 0 ? yScale(d.count) : innerHeight))
      .attr('y2', (d: MonthData) => (d.count > 0 ? yScale(d.count) - 6 : innerHeight));

    // Update Candle Flame Group Positions & Staggered Animation Delays
    allBarGroups
      .select<SVGGElement>('.candle-flame-group')
      .attr('opacity', (d: MonthData) => (d.count > 0 ? 1 : 0))
      .attr('style', (d: MonthData) => {
        const cx = (xScale(d.shortName) || 0) + xScale.bandwidth() / 2;
        const cy = d.count > 0 ? yScale(d.count) - 6 : innerHeight - 6;
        return `--flame-delay: ${((d.monthIndex * 0.23) % 1.6).toFixed(2)}s; --flame-x: ${cx}px; --flame-y: ${cy}px;`;
      })
      .attr('transform', (d: MonthData) => {
        const cx = (xScale(d.shortName) || 0) + xScale.bandwidth() / 2;
        const cy = d.count > 0 ? yScale(d.count) - 6 : innerHeight - 6;
        return `translate(${cx}, ${cy})`;
      });

    // Morph label positions
    allBarGroups
      .select<SVGTextElement>('.bar-label')
      .attr('x', (d: MonthData) => (xScale(d.shortName) || 0) + xScale.bandwidth() / 2)
      .attr('fill', (d: MonthData) => {
        if (d.monthIndex === activeMonthFilter) return '#b45309';
        if (d.isCurrentMonth) return '#047857';
        if (d.count === 0) return '#94a3b8';
        return '#047857';
      })
      .text((d: MonthData) => d.count)
      .attr('opacity', 1)
      .attr('y', (d: MonthData) => (d.count > 0 ? yScale(d.count) - 26 : innerHeight - 8));

    // Update current month bottom dot
    const currentMonthObj = monthData[currentMonthIndex];
    if (currentMonthObj && xScale(currentMonthObj.shortName) !== undefined) {
      const cx = (xScale(currentMonthObj.shortName) || 0) + xScale.bandwidth() / 2;
      g.select<SVGCircleElement>('.current-month-indicator')
        .attr('cx', cx)
        .attr('cy', innerHeight + 28)
        .attr('r', 3.5)
        .attr('fill', '#10b981');
    }

    isInitializedRef.current = true;
    prevDataSignatureRef.current = dataSignature;

    return () => {
      // Explicitly clean up D3 selections and remove structural groups on unmount
      if (svgRef.current) {
        const svg = d3.select(svgRef.current);
        // Explicitly remove listeners from bar-groups to prevent memory leaks
        svg.selectAll('.bar-group')
          .on('mouseenter', null)
          .on('mousemove', null)
          .on('mouseleave', null)
          .on('click', null);

        // Interrupt all active transitions across the entire SVG
        svg.selectAll('*').interrupt();
      }
    };
  }, [dataSignature, currentMonthIndex, activeMonthFilter, onSelectMonth, chartWidth]);

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
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-indigo-50/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-100/80 text-indigo-700 rounded-xl shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-lg tracking-tight">
                  Annual Birthday Distribution
                </h3>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  12 Calendar Months
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete team birthday cadence across the calendar year
              </p>
            </div>
          </div>
        </div>

        {/* Quick Executive Stats Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Current Month Highlight */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {currentMonthData ? currentMonthData.fullName : 'August'}:{' '}
              <strong className="font-extrabold text-emerald-700">
                {currentMonthData ? currentMonthData.count : 0} Celebrants
              </strong>
            </span>
          </div>

          {/* Peak Month */}
          {peakMonth && peakMonth.count > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-semibold shadow-2xs">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>
                Peak: <strong>{peakMonth.fullName}</strong> ({peakMonth.count})
              </span>
            </div>
          )}

          {/* Active Filter Clear Button */}
          {activeMonthFilter !== null && (
            <button
              onClick={() => handleMonthPillClick(activeMonthFilter)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-xs hover:bg-amber-600 transition-all"
            >
              <Filter className="w-3 h-3" />
              <span>Filtered: {MONTH_NAMES[activeMonthFilter]?.short}</span>
              <X className="w-3 h-3 ml-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Chart Canvas Container */}
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT 8 COLS: 12-Month Bar Chart Workspace */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Month Selector Pills on Top of Canvas */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-2 scrollbar-thin scrollbar-thumb-slate-200">
              <button
                onClick={() => handleMonthPillClick(-1)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                  activeMonthFilter === null
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Months ({totalWithBirthdays})
              </button>
              {monthData.map((m) => {
                const isSelected = activeMonthFilter === m.monthIndex;
                const isCurrent = m.isCurrentMonth;
                return (
                  <button
                    key={m.shortName}
                    onClick={() => handleMonthPillClick(m.monthIndex)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-300'
                        : isCurrent
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold hover:bg-emerald-200'
                        : m.count > 0
                        ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100'
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    <span>{m.shortName}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isSelected
                          ? 'bg-amber-600 text-white'
                          : isCurrent
                          ? 'bg-emerald-600 text-white'
                          : m.count > 0
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {m.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* SVG Container */}
            <div ref={containerRef} className="w-full relative min-h-[310px] select-none">
              <svg ref={svgRef} className="w-full h-[310px] overflow-visible" />

              {/* Interactive Floating Tooltip */}
              {hoveredMonth && tooltipPos && (
                <div
                  className="absolute z-30 pointer-events-none transition-all duration-75 transform -translate-x-1/2 -translate-y-full bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-xl p-3 shadow-xl border border-slate-700 min-w-[200px]"
                  style={{
                    left: `${tooltipPos.x}px`,
                    top: `${tooltipPos.y - 12}px`,
                  }}
                >
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
                    <div className="flex items-center gap-1.5 font-bold text-slate-100 text-sm">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      <span>{hoveredMonth.fullName}</span>
                    </div>
                    {hoveredMonth.isCurrentMonth && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40">
                        Active Month
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-slate-300">
                      <span>Total Celebrants:</span>
                      <span className="font-mono font-bold text-white text-sm">
                        {hoveredMonth.count}
                      </span>
                    </div>

                    {hoveredMonth.count > 0 ? (
                      <div className="pt-1.5 border-t border-slate-800">
                        <p className="text-[10px] text-slate-400 font-medium mb-1">Celebrants:</p>
                        <div className="max-h-[110px] overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-slate-700">
                          {hoveredMonth.members.map((member, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-[11px] bg-slate-800/80 px-2 py-1 rounded border border-slate-700/50"
                            >
                              <span className="font-semibold text-slate-200 truncate max-w-[120px]">
                                {member.name}
                              </span>
                              <span className="font-mono text-emerald-400 font-bold ml-2">
                                {member.birthday}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic pt-1">
                        No birthdays in this month.
                      </p>
                    )}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-indigo-300 font-medium">
                    <span>Click bar to filter roster</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 4 COLS: Dedicated Month-Wise Total Birthday Pie Chart Card */}
          <div className="lg:col-span-4 h-full">
            <BirthdayMonthPieChart
              monthData={monthData}
              totalCelebrants={totalWithBirthdays}
              activeMonthFilter={activeMonthFilter}
              onSelectMonth={onSelectMonth || handleMonthPillClick}
            />
          </div>

        </div>
      </div>

      {/* Selected / Active Month Detail Banner */}
      {activeSelectedData && (
        <div className="px-5 py-3.5 bg-amber-50/70 border-t border-amber-200/80 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-900 font-medium">
            <span className="p-1.5 bg-amber-200/70 text-amber-900 rounded-lg">
              <Filter className="w-4 h-4" />
            </span>
            <span>
              Filtering roster for <strong>{activeSelectedData.fullName}</strong> (
              {activeSelectedData.count} colleagues)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5 overflow-hidden">
              {activeSelectedData.members.slice(0, 5).map((m, i) => (
                <div
                  key={i}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-amber-200 text-amber-800 text-[10px] font-bold flex items-center justify-center"
                  title={`${m.name} (${m.birthday})`}
                >
                  {m.name.charAt(0)}
                </div>
              ))}
            </div>
            {activeSelectedData.count > 5 && (
              <span className="text-amber-800 font-bold text-[11px]">
                +{activeSelectedData.count - 5} more
              </span>
            )}
            <button
              onClick={() => handleMonthPillClick(activeMonthFilter!)}
              className="ml-2 px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 font-bold transition-all"
            >
              Reset Filter
            </button>
          </div>
        </div>
      )}

      {/* Current Month Active Summary Footer */}
      {!activeSelectedData && currentMonthData && currentMonthData.count > 0 && (
        <div className="px-5 py-3.5 bg-emerald-50/60 border-t border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>{currentMonthData.fullName} Birthday Celebrants ({currentMonthData.count}):</strong>
            </span>
            <div className="flex flex-wrap items-center gap-1.5 ml-1">
              {currentMonthData.members.map((m, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-white border border-emerald-200 text-emerald-800 rounded-md font-semibold text-[11px] flex items-center gap-1"
                >
                  <span>{m.name}</span>
                  <span className="text-emerald-600 font-mono font-bold text-[10px]">
                    {m.birthday}
                  </span>
                </span>
              ))}
            </div>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium italic shrink-0">
            Click month bars above to filter roster table
          </span>
        </div>
      )}
    </div>
  );
};
