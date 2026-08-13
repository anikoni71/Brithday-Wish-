import React, { useLayoutEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { EmailLogEntry, TeamMember } from '../types';
import { MONTH_NAMES, getBirthMonth } from '../utils/dateUtils';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  PieChart as PieChartIcon,
  Filter,
  Info,
  Zap,
  Calendar,
  HeartPulse,
  TrendingUp,
  Mail
} from 'lucide-react';

interface DonutSliceData {
  key: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  label: string;
  count: number;
  color: string;
  gradientId: string;
  hoverColor: string;
  icon: typeof CheckCircle2;
  description: string;
}

interface MailSuccessRateDonutProps {
  logs?: EmailLogEntry[];
  members?: TeamMember[];
  sentEmailMap?: Record<string, boolean>;
  selectedMonthIndex?: number | null;
  onSelectMonth?: (monthIndex: number | null) => void;
  activeStatusFilter?: 'ALL' | 'SUCCESS' | 'FAILED' | 'SKIPPED';
  onSelectStatusFilter?: (status: 'ALL' | 'SUCCESS' | 'FAILED' | 'SKIPPED') => void;
  // Pre-calculated metrics passed as pure props
  deliverySuccessCount?: number;
  deliveryFailedCount?: number;
  deliverySkippedCount?: number;
  deliveryHealthPercent?: string;
}

export const MailSuccessRateDonut: React.FC<MailSuccessRateDonutProps> = ({
  logs = [],
  members = [],
  sentEmailMap = {},
  selectedMonthIndex = null,
  onSelectMonth,
  activeStatusFilter = 'ALL',
  onSelectStatusFilter,
  deliverySuccessCount: precomputedSuccessCount,
  deliveryFailedCount: precomputedFailedCount,
  deliverySkippedCount: precomputedSkippedCount,
  deliveryHealthPercent: precomputedHealthPercent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredSlice, setHoveredSlice] = useState<DonutSliceData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [monthScope, setMonthScope] = useState<number | 'ALL'>(
    selectedMonthIndex !== null ? selectedMonthIndex : 'ALL'
  );

  React.useEffect(() => {
    if (selectedMonthIndex !== null) {
      setMonthScope(selectedMonthIndex);
    }
  }, [selectedMonthIndex]);

  const currentMonthIndex = new Date().getMonth();
  const currentMonthName = MONTH_NAMES[currentMonthIndex]?.full || 'August';

  // Filter logs according to the selected month scope if specified
  const scopedLogs = useMemo(() => {
    if (monthScope === 'ALL') {
      return logs;
    }
    const celebrantNames = new Set(
      members
        .filter((m) => getBirthMonth(m.birthday) === monthScope)
        .map((m) => m.name.toLowerCase().trim())
    );

    return logs.filter((l) => celebrantNames.has(l.recipientName.toLowerCase().trim()));
  }, [logs, members, monthScope]);

  // Calculations: use scoped count if month filtered, or use precomputed values
  const totalLogs = scopedLogs.length;
  const successCount = monthScope === 'ALL' && precomputedSuccessCount !== undefined
    ? precomputedSuccessCount
    : scopedLogs.filter((l) => l.status === 'SUCCESS').length;

  const failedCount = monthScope === 'ALL' && precomputedFailedCount !== undefined
    ? precomputedFailedCount
    : scopedLogs.filter((l) => l.status === 'FAILED').length;

  const skippedCount = monthScope === 'ALL' && precomputedSkippedCount !== undefined
    ? precomputedSkippedCount
    : scopedLogs.filter((l) => l.status === 'SKIPPED').length;

  const totalAttempts = successCount + failedCount;
  const deliveryHealthRate = totalAttempts > 0 
    ? ((successCount / totalAttempts) * 100) 
    : 100.0;
  const deliveryHealthPercent = precomputedHealthPercent && monthScope === 'ALL'
    ? precomputedHealthPercent
    : deliveryHealthRate.toFixed(1);

  // Health state description
  const healthStatus = useMemo(() => {
    if (deliveryHealthRate >= 95) return { label: 'Optimal', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (deliveryHealthRate >= 80) return { label: 'Good', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (deliveryHealthRate >= 60) return { label: 'Moderate', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'Needs Attention', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  }, [deliveryHealthRate]);

  // Donut slices dataset
  const chartData: DonutSliceData[] = useMemo(() => {
    if (totalLogs === 0 && successCount === 0 && failedCount === 0 && skippedCount === 0) {
      return [
        {
          key: 'SUCCESS',
          label: 'Successful Deliveries',
          count: 1,
          color: '#10b981',
          gradientId: 'mail-donut-success',
          hoverColor: '#059669',
          icon: CheckCircle2,
          description: 'No transmission logs yet recorded for this period (Standing by)',
        },
      ];
    }

    const slices: DonutSliceData[] = [];

    if (successCount > 0 || (failedCount === 0 && skippedCount === 0)) {
      slices.push({
        key: 'SUCCESS',
        label: 'Successful Deliveries',
        count: successCount > 0 ? successCount : 1,
        color: '#10b981',
        gradientId: 'mail-donut-success',
        hoverColor: '#059669',
        icon: CheckCircle2,
        description: 'Emails delivered to recipient mailboxes & recorded in Sheet',
      });
    }

    if (failedCount > 0) {
      slices.push({
        key: 'FAILED',
        label: 'Delivery Failures',
        count: failedCount,
        color: '#f43f5e',
        gradientId: 'mail-donut-failed',
        hoverColor: '#e11d48',
        icon: XCircle,
        description: 'SMTP connection or invalid email syntax error',
      });
    }

    if (skippedCount > 0) {
      slices.push({
        key: 'SKIPPED',
        label: 'Skipped / Missing Email',
        count: skippedCount,
        color: '#f59e0b',
        gradientId: 'mail-donut-skipped',
        hoverColor: '#d97706',
        icon: Clock,
        description: 'Colleague has no registered email or was already wished in current cycle',
      });
    }

    return slices;
  }, [totalLogs, successCount, failedCount, skippedCount]);

  const dataSignature = useMemo(() => {
    return chartData.map((s) => `${s.key}:${s.count}`).join('|') + `_health:${deliveryHealthPercent}`;
  }, [chartData, deliveryHealthPercent]);

  // D3 Donut Chart Rendering with useLayoutEffect
  useLayoutEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const containerWidth = containerRef.current.clientWidth || 300;
    const width = Math.min(containerWidth, 320);
    const height = 220;
    const margin = 12;
    const radius = Math.min(width, height) / 2 - margin;
    const innerRadius = radius * 0.68;
    const padAngle = chartData.length > 1 ? 0.04 : 0;

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height);

    let mainG = svg.select<SVGGElement>('g.main-donut-group');
    if (mainG.empty()) {
      svg.selectAll('*').remove();

      const defs = svg.append('defs');

      // Gradients for slices
      const successGrad = defs
        .append('linearGradient')
        .attr('id', 'mail-donut-success')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');
      successGrad.append('stop').attr('offset', '0%').attr('stop-color', '#34d399');
      successGrad.append('stop').attr('offset', '100%').attr('stop-color', '#059669');

      const failGrad = defs
        .append('linearGradient')
        .attr('id', 'mail-donut-failed')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');
      failGrad.append('stop').attr('offset', '0%').attr('stop-color', '#fb7185');
      failGrad.append('stop').attr('offset', '100%').attr('stop-color', '#e11d48');

      const skipGrad = defs
        .append('linearGradient')
        .attr('id', 'mail-donut-skipped')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');
      skipGrad.append('stop').attr('offset', '0%').attr('stop-color', '#fcd34d');
      skipGrad.append('stop').attr('offset', '100%').attr('stop-color', '#d97706');

      mainG = svg
        .append('g')
        .attr('class', 'main-donut-group')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

      mainG.append('g').attr('class', 'slices-layer');
      const centerG = mainG.append('g').attr('class', 'center-display').attr('text-anchor', 'middle');
      centerG.append('text').attr('class', 'health-percent');
      centerG.append('text').attr('class', 'health-label');
    }

    mainG.attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie<DonutSliceData>()
      .value((d) => d.count)
      .sort(null)
      .padAngle(padAngle);

    const arc = d3
      .arc<d3.PieArcDatum<DonutSliceData>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(5);

    const arcHover = d3
      .arc<d3.PieArcDatum<DonutSliceData>>()
      .innerRadius(innerRadius - 2)
      .outerRadius(radius + 5)
      .cornerRadius(6);

    const slicesLayer = mainG.select('.slices-layer');
    const arcs = slicesLayer
      .selectAll<SVGGElement, d3.PieArcDatum<DonutSliceData>>('g.donut-slice')
      .data(pie(chartData), (d) => d.data.key);

    arcs.exit().remove();

    const arcsEnter = arcs
      .enter()
      .append('g')
      .attr('class', 'donut-slice')
      .style('cursor', 'pointer');

    arcsEnter
      .append('path')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    const mergedArcs = arcsEnter.merge(arcs);

    mergedArcs
      .select('path')
      .attr('fill', (d) => `url(#${d.data.gradientId})`)
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', arcHover as any)
          .attr('stroke-width', 3);

        setHoveredSlice(d.data);
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        setTooltipPos({ x: rect.x + rect.width / 2, y: rect.y });
      })
      .on('mouseleave', function () {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', arc as any)
          .attr('stroke-width', 2);

        setHoveredSlice(null);
      })
      .on('click', (_event, d) => {
        if (onSelectStatusFilter) {
          onSelectStatusFilter(activeStatusFilter === d.data.key ? 'ALL' : d.data.key);
        }
      })
      .transition()
      .duration(450)
      .ease(d3.easeCubicOut)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t)) || '';
        };
      });

    // Center Display Updates
    mainG
      .select('.health-percent')
      .attr('dy', '-5px')
      .attr('font-size', '22px')
      .attr('font-weight', '900')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('fill', '#0f172a')
      .text(`${deliveryHealthPercent}%`);

    mainG
      .select('.health-label')
      .attr('dy', '14px')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('text-transform', 'uppercase')
      .attr('letter-spacing', '0.5px')
      .attr('fill', '#64748b')
      .text('Delivery Health');
  }, [dataSignature, activeStatusFilter, onSelectStatusFilter]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Email Delivery Health</h3>
            <p className="text-xs text-slate-500">Transmission success and dispatch reliability</p>
          </div>
        </div>

        {/* Scope Indicator */}
        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${healthStatus.color}`}>
            {healthStatus.label}
          </span>
        </div>
      </div>

      {/* Donut Canvas and Metrics */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* SVG Container */}
        <div ref={containerRef} className="w-[180px] h-[180px] shrink-0 relative flex items-center justify-center">
          <svg ref={svgRef} className="w-full h-full overflow-visible" />
        </div>

        {/* Legend / Metrics List */}
        <div className="flex-1 w-full space-y-2">
          <div
            onClick={() => onSelectStatusFilter && onSelectStatusFilter(activeStatusFilter === 'SUCCESS' ? 'ALL' : 'SUCCESS')}
            className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
              activeStatusFilter === 'SUCCESS'
                ? 'bg-emerald-50 border-emerald-300 shadow-2xs'
                : 'bg-slate-50/70 border-slate-100 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-slate-700">Delivered</span>
            </div>
            <span className="text-xs font-extrabold text-slate-900 font-mono">{successCount}</span>
          </div>

          <div
            onClick={() => onSelectStatusFilter && onSelectStatusFilter(activeStatusFilter === 'FAILED' ? 'ALL' : 'FAILED')}
            className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
              activeStatusFilter === 'FAILED'
                ? 'bg-rose-50 border-rose-300 shadow-2xs'
                : 'bg-slate-50/70 border-slate-100 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-xs font-semibold text-slate-700">Failed</span>
            </div>
            <span className="text-xs font-extrabold text-slate-900 font-mono">{failedCount}</span>
          </div>

          <div
            onClick={() => onSelectStatusFilter && onSelectStatusFilter(activeStatusFilter === 'SKIPPED' ? 'ALL' : 'SKIPPED')}
            className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
              activeStatusFilter === 'SKIPPED'
                ? 'bg-amber-50 border-amber-300 shadow-2xs'
                : 'bg-slate-50/70 border-slate-100 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-xs font-semibold text-slate-700">Skipped / Pending</span>
            </div>
            <span className="text-xs font-extrabold text-slate-900 font-mono">{skippedCount}</span>
          </div>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredSlice && tooltipPos && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-700 min-w-[200px]"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y - 10}px`,
          }}
        >
          <div className="font-bold text-slate-100 border-b border-slate-700 pb-1.5 mb-1.5 flex items-center justify-between">
            <span>{hoveredSlice.label}</span>
            <span className="font-mono text-emerald-400 font-bold">{hoveredSlice.count}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">{hoveredSlice.description}</p>
        </div>
      )}
    </div>
  );
};
