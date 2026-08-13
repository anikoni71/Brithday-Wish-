import React, { useEffect, useRef, useState, useMemo } from 'react';
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

interface MailSuccessRateDonutProps {
  logs: EmailLogEntry[];
  members?: TeamMember[];
  sentEmailMap?: Record<string, boolean>;
  selectedMonthIndex?: number | null;
  onSelectMonth?: (monthIndex: number | null) => void;
  activeStatusFilter?: 'ALL' | 'SUCCESS' | 'FAILED' | 'SKIPPED';
  onSelectStatusFilter?: (status: 'ALL' | 'SUCCESS' | 'FAILED' | 'SKIPPED') => void;
}

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

export const MailSuccessRateDonut: React.FC<MailSuccessRateDonutProps> = ({
  logs,
  members = [],
  sentEmailMap = {},
  selectedMonthIndex = null,
  onSelectMonth,
  activeStatusFilter = 'ALL',
  onSelectStatusFilter,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredSlice, setHoveredSlice] = useState<DonutSliceData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [monthScope, setMonthScope] = useState<number | 'ALL'>(
    selectedMonthIndex !== null ? selectedMonthIndex : 'ALL'
  );

  useEffect(() => {
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
    // Filter logs timestamp/recipient matching this month's celebrants
    const celebrantNames = new Set(
      members
        .filter((m) => getBirthMonth(m.birthday) === monthScope)
        .map((m) => m.name.toLowerCase().trim())
    );

    return logs.filter((l) => celebrantNames.has(l.recipientName.toLowerCase().trim()));
  }, [logs, members, monthScope]);

  // Calculations
  const totalLogs = scopedLogs.length;
  const successCount = scopedLogs.filter((l) => l.status === 'SUCCESS').length;
  const failedCount = scopedLogs.filter((l) => l.status === 'FAILED').length;
  const skippedCount = scopedLogs.filter((l) => l.status === 'SKIPPED').length;

  const totalAttempts = successCount + failedCount;
  const deliveryHealthRate = totalAttempts > 0 
    ? ((successCount / totalAttempts) * 100) 
    : 100.0;
  const deliveryHealthPercent = deliveryHealthRate.toFixed(1);

  // Health state description
  const healthStatus = useMemo(() => {
    if (deliveryHealthRate >= 95) return { label: 'Optimal', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (deliveryHealthRate >= 80) return { label: 'Good', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    if (deliveryHealthRate >= 60) return { label: 'Moderate', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'Needs Attention', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  }, [deliveryHealthRate]);

  // Donut slices dataset
  const chartData: DonutSliceData[] = useMemo(() => {
    if (totalLogs === 0) {
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

    // Success slice
    if (successCount > 0 || (failedCount === 0 && skippedCount === 0)) {
      slices.push({
        key: 'SUCCESS',
        label: 'Successful Deliveries',
        count: successCount,
        color: '#10b981',
        gradientId: 'mail-donut-success',
        hoverColor: '#059669',
        icon: CheckCircle2,
        description: 'Emails delivered to recipient mailboxes & recorded in Sheet',
      });
    }

    // Failures slice
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

    // Skipped slice
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

  // D3 Donut Chart Rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

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

    // Main donut group
    const mainG = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

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

    const arcs = mainG
      .selectAll('.donut-slice')
      .data(pie(chartData))
      .enter()
      .append('g')
      .attr('class', 'donut-slice')
      .style('cursor', 'pointer');

    // Slice Paths
    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => `url(#${d.data.gradientId})`)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .style('transition', 'all 0.25s ease')
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('d', arcHover as any)
          .attr('stroke-width', 3);

        setHoveredSlice(d.data);
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltipPos({ x: rect.x + rect.width / 2, y: rect.y });
      })
      .on('mouseleave', function (_event, _d) {
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
      });

    // Center Display - Delivery Health % & Label
    const centerG = mainG.append('g').attr('text-anchor', 'middle');

    centerG
      .append('text')
      .attr('dy', '-5px')
      .attr('font-size', '22px')
      .attr('font-weight', '900')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('fill', '#0f172a')
      .text(`${deliveryHealthPercent}%`);

    centerG
      .append('text')
      .attr('dy', '14px')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('text-transform', 'uppercase')
      .attr('letter-spacing', '0.5px')
      .attr('fill', '#64748b')
      .text('Delivery Health');

    centerG
      .append('text')
      .attr('dy', '27px')
      .attr('font-size', '9px')
      .attr('font-weight', '600')
      .attr('fill', '#10b981')
      .text(`${successCount}/${totalAttempts || totalLogs} Delivered`);
  }, [chartData, deliveryHealthPercent, successCount, totalAttempts, totalLogs, activeStatusFilter, onSelectStatusFilter]);

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Header with Title and Month Filter Scope */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              Monthly Auto-Wish Success Rate
            </h4>
            <p className="text-[10px] text-slate-400">
              D3 Donut Reliability & Delivery Health ratio
            </p>
          </div>
        </div>

        {/* Scope Dropdown */}
        <div className="flex items-center gap-1.5">
          <select
            value={monthScope}
            onChange={(e) => {
              const val = e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10);
              setMonthScope(val);
              if (onSelectMonth) {
                onSelectMonth(val === 'ALL' ? null : val);
              }
            }}
            className="text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-slate-300"
          >
            <option value="ALL">All Time Logs</option>
            {MONTH_NAMES.map((m, idx) => (
              <option key={m.short} value={idx}>
                {m.full} {idx === currentMonthIndex ? '(Current)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Donut Chart Canvas */}
      <div className="my-2 flex items-center justify-center relative">
        <svg ref={svgRef} className="max-w-[280px] h-auto" />

        {/* Floating Health Status Badge */}
        <div className="absolute top-0 right-1">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${healthStatus.color} flex items-center gap-1`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {healthStatus.label}
          </span>
        </div>
      </div>

      {/* Legend & Breakdown Strip */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="grid grid-cols-3 gap-2 text-center">
          {/* Success */}
          <div
            onClick={() => onSelectStatusFilter && onSelectStatusFilter('SUCCESS')}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              activeStatusFilter === 'SUCCESS'
                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20'
                : 'bg-slate-50/70 border-slate-100 hover:bg-emerald-50/40'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              Success
            </div>
            <p className="text-sm font-black font-mono text-emerald-950 mt-0.5">
              {successCount}
            </p>
          </div>

          {/* Failed */}
          <div
            onClick={() => onSelectStatusFilter && onSelectStatusFilter('FAILED')}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              activeStatusFilter === 'FAILED'
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20'
                : 'bg-slate-50/70 border-slate-100 hover:bg-rose-50/40'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-rose-700">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
              Failed
            </div>
            <p className="text-sm font-black font-mono text-rose-950 mt-0.5">
              {failedCount}
            </p>
          </div>

          {/* Skipped */}
          <div
            onClick={() => onSelectStatusFilter && onSelectStatusFilter('SKIPPED')}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              activeStatusFilter === 'SKIPPED'
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20'
                : 'bg-slate-50/70 border-slate-100 hover:bg-amber-50/40'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              Skipped
            </div>
            <p className="text-sm font-black font-mono text-amber-950 mt-0.5">
              {skippedCount}
            </p>
          </div>
        </div>

        {activeStatusFilter !== 'ALL' && (
          <div className="flex items-center justify-between text-[11px] bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
            <span>Filtering logs by: <strong>{activeStatusFilter}</strong></span>
            <button
              onClick={() => onSelectStatusFilter && onSelectStatusFilter('ALL')}
              className="text-indigo-600 font-bold hover:text-indigo-800 cursor-pointer"
            >
              Reset (✕)
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Hover Tooltip */}
      {hoveredSlice && tooltipPos && (
        <div
          className="fixed z-50 bg-slate-900 text-white rounded-xl px-3.5 py-2 text-xs shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 font-sans border border-slate-700 max-w-xs"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
            <span>{hoveredSlice.label}</span>
            <span className="text-slate-300 font-mono">({hoveredSlice.count} logs)</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-snug">
            {hoveredSlice.description}
          </p>
        </div>
      )}
    </div>
  );
};
