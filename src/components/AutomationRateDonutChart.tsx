import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { AutomationLogEntry } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  PieChart as PieChartIcon,
  Filter,
  Info
} from 'lucide-react';

interface AutomationRateDonutChartProps {
  logs: AutomationLogEntry[];
  onSelectStatusFilter?: (status: 'ALL' | 'SUCCESS' | 'FAILED' | 'SKIPPED_DUPLICATE') => void;
  activeStatusFilter?: 'ALL' | 'SUCCESS' | 'FAILED' | 'SKIPPED_DUPLICATE';
}

interface DonutSliceData {
  key: 'SUCCESS' | 'FAILED' | 'SKIPPED_DUPLICATE';
  label: string;
  count: number;
  color: string;
  hoverColor: string;
  glowColor: string;
  icon: typeof CheckCircle2;
  description: string;
}

export const AutomationRateDonutChart: React.FC<AutomationRateDonutChartProps> = ({
  logs,
  onSelectStatusFilter,
  activeStatusFilter = 'ALL',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredSlice, setHoveredSlice] = useState<DonutSliceData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const total = logs.length;
  const successCount = logs.filter((l) => l.status === 'SUCCESS').length;
  const failedCount = logs.filter((l) => l.status === 'FAILED').length;
  const skippedCount = logs.filter((l) => l.status === 'SKIPPED_DUPLICATE').length;

  const successPercent = total > 0 ? ((successCount / total) * 100).toFixed(1) : '100.0';
  const failurePercent = total > 0 ? ((failedCount / total) * 100).toFixed(1) : '0.0';

  const chartData: DonutSliceData[] = useMemo(() => {
    // If no logs yet, provide default preview breakdown for visual elegance
    if (total === 0) {
      return [
        {
          key: 'SUCCESS',
          label: 'Success Deliveries',
          count: 1,
          color: '#10b981', // emerald-500
          hoverColor: '#059669',
          glowColor: 'rgba(16, 185, 129, 0.4)',
          icon: CheckCircle2,
          description: 'No dispatches recorded yet (Standing by)',
        },
      ];
    }

    const items: DonutSliceData[] = [];

    // Success segment (emerald-500)
    if (successCount > 0 || (failedCount === 0 && skippedCount === 0)) {
      items.push({
        key: 'SUCCESS',
        label: 'Success Deliveries',
        count: successCount,
        color: '#10b981', // emerald-500
        hoverColor: '#059669', // emerald-600
        glowColor: 'rgba(16, 185, 129, 0.35)',
        icon: CheckCircle2,
        description: 'Successfully transmitted to WhatsApp & marked in Sheet',
      });
    }

    // Failures segment (rose-500)
    if (failedCount > 0) {
      items.push({
        key: 'FAILED',
        label: 'Failed Dispatches',
        count: failedCount,
        color: '#f43f5e', // rose-500
        hoverColor: '#e11d48', // rose-600
        glowColor: 'rgba(244, 63, 94, 0.35)',
        icon: XCircle,
        description: 'Network error or invalid phone number format',
      });
    }

    // Skipped/Duplicate segment (amber-500)
    if (skippedCount > 0) {
      items.push({
        key: 'SKIPPED_DUPLICATE',
        label: 'Skipped / Duplicates',
        count: skippedCount,
        color: '#f59e0b', // amber-500
        hoverColor: '#d97706',
        glowColor: 'rgba(245, 158, 11, 0.35)',
        icon: Clock,
        description: 'Column L already marked for current year (Anti-spam guard)',
      });
    }

    return items;
  }, [total, successCount, failedCount, skippedCount]);

  // D3 Donut Rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current.clientWidth || 320;
    const width = Math.min(containerWidth, 340);
    const height = 240;
    const margin = 16;
    const radius = Math.min(width, height) / 2 - margin;
    const innerRadius = radius * 0.68; // Donut thickness
    const cornerRadius = 6;
    const padAngle = chartData.length > 1 ? 0.04 : 0;

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height);

    // Defs for gradients and glow filters
    const defs = svg.append('defs');

    // Filter for hover glow
    const filter = defs.append('filter').attr('id', 'donut-glow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    filter.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'blur').attr('operator', 'over');

    // Linear Gradients for Donut Slices
    const successGrad = defs.append('linearGradient').attr('id', 'donut-grad-success').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    successGrad.append('stop').attr('offset', '0%').attr('stop-color', '#34d399'); // emerald-400
    successGrad.append('stop').attr('offset', '100%').attr('stop-color', '#059669'); // emerald-600

    const failGrad = defs.append('linearGradient').attr('id', 'donut-grad-failed').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    failGrad.append('stop').attr('offset', '0%').attr('stop-color', '#fb7185'); // rose-400
    failGrad.append('stop').attr('offset', '100%').attr('stop-color', '#e11d48'); // rose-600

    const skipGrad = defs.append('linearGradient').attr('id', 'donut-grad-skipped').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    skipGrad.append('stop').attr('offset', '0%').attr('stop-color', '#fcd34d'); // amber-300
    skipGrad.append('stop').attr('offset', '100%').attr('stop-color', '#d97706'); // amber-600

    const mainG = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Subtle background track circle
    mainG.append('circle')
      .attr('r', (radius + innerRadius) / 2)
      .attr('fill', 'none')
      .attr('stroke', '#1e293b')
      .attr('stroke-width', radius - innerRadius + 2)
      .attr('opacity', 0.5);

    // Pie & Arc generators
    const pie = d3.pie<DonutSliceData>()
      .value((d) => d.count)
      .sort(null)
      .padAngle(padAngle);

    const arc = d3.arc<d3.PieArcDatum<DonutSliceData>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(cornerRadius);

    const arcHover = d3.arc<d3.PieArcDatum<DonutSliceData>>()
      .innerRadius(innerRadius - 2)
      .outerRadius(radius + 6)
      .cornerRadius(cornerRadius + 2);

    const pieData = pie(chartData);

    // Render Slices with smooth path animation
    const sliceGroups = mainG
      .selectAll('.donut-slice')
      .data(pieData)
      .enter()
      .append('g')
      .attr('class', 'donut-slice')
      .attr('cursor', 'pointer');

    const paths = sliceGroups
      .append('path')
      .attr('fill', (d) => {
        if (d.data.key === 'SUCCESS') return 'url(#donut-grad-success)';
        if (d.data.key === 'FAILED') return 'url(#donut-grad-fail)';
        return 'url(#donut-grad-skipped)';
      })
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 2)
      .attr('opacity', (d) => {
        if (activeStatusFilter === 'ALL') return 1;
        return activeStatusFilter === d.data.key ? 1 : 0.35;
      });

    // Smooth entry transition
    paths
      .transition()
      .duration(850)
      .ease(d3.easeCubicOut)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t)) || '';
        };
      });

    // Slice interaction events
    sliceGroups
      .on('mouseenter', function (event: MouseEvent, d) {
        d3.select(this)
          .select('path')
          .transition()
          .duration(200)
          .attr('d', (dItem) => arcHover(dItem as d3.PieArcDatum<DonutSliceData>) || '')
          .attr('filter', 'url(#donut-glow)')
          .attr('stroke-width', 3);

        setHoveredSlice(d.data);
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
        d3.select(this)
          .select('path')
          .transition()
          .duration(200)
          .attr('d', (dItem) => arc(dItem as d3.PieArcDatum<DonutSliceData>) || '')
          .attr('filter', null)
          .attr('stroke-width', 2);

        setHoveredSlice(null);
        setTooltipPos(null);
      })
      .on('click', function (_event: MouseEvent, d) {
        if (onSelectStatusFilter) {
          onSelectStatusFilter(activeStatusFilter === d.data.key ? 'ALL' : d.data.key);
        }
      });

  }, [chartData, activeStatusFilter, onSelectStatusFilter]);

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-xl text-white relative overflow-hidden flex flex-col justify-between" ref={containerRef}>
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <PieChartIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              Success vs. Failure Rate
            </h4>
            <p className="text-[11px] text-slate-400 font-mono">D3.js Vector Analytics</p>
          </div>
        </div>

        {activeStatusFilter !== 'ALL' && (
          <button
            onClick={() => onSelectStatusFilter && onSelectStatusFilter('ALL')}
            className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer flex items-center gap-1"
          >
            <Filter className="w-3 h-3" />
            Reset Filter
          </button>
        )}
      </div>

      {/* Donut Stage Container with Center Overlay */}
      <div className="relative flex items-center justify-center my-1">
        <svg ref={svgRef} className="overflow-visible select-none" />

        {/* Center Donut Hub Statistic */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Reliability
          </span>
          <span className="text-2xl font-black font-mono text-emerald-400 tracking-tight flex items-baseline justify-center gap-0.5">
            {successPercent}
            <span className="text-xs text-emerald-500 font-bold">%</span>
          </span>
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700 font-mono mt-0.5">
            {total} Total Dispatches
          </span>
        </div>

        {/* Custom Sleek Hover Tooltip */}
        {hoveredSlice && tooltipPos && (
          <div
            className="absolute z-30 pointer-events-none bg-slate-950/95 text-white rounded-xl shadow-2xl p-3 text-xs border border-slate-700 backdrop-blur-md -translate-x-1/2 -translate-y-full mb-3 min-w-[200px]"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 12}px`,
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
              <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: hoveredSlice.color }}
                ></span>
                {hoveredSlice.label}
              </div>
              <span
                className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: `${hoveredSlice.color}20`,
                  color: hoveredSlice.color,
                  border: `1px solid ${hoveredSlice.color}40`,
                }}
              >
                {total > 0 ? Math.round((hoveredSlice.count / total) * 100) : 100}%
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-slate-300">
                <span>Total Count:</span>
                <strong className="font-mono text-white text-xs">{hoveredSlice.count}</strong>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight pt-1 border-t border-slate-800/80">
                {hoveredSlice.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Legend Badges */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
        {/* Success Legend */}
        <button
          onClick={() => onSelectStatusFilter && onSelectStatusFilter(activeStatusFilter === 'SUCCESS' ? 'ALL' : 'SUCCESS')}
          className={`p-2 rounded-xl text-left border transition flex items-center justify-between cursor-pointer ${
            activeStatusFilter === 'SUCCESS'
              ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm'
              : 'bg-slate-850 hover:bg-slate-800 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <div>
              <span className="text-[11px] font-bold block text-slate-200">Success</span>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">{successPercent}%</span>
            </div>
          </div>
          <span className="text-xs font-black font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
            {successCount}
          </span>
        </button>

        {/* Failure Legend */}
        <button
          onClick={() => onSelectStatusFilter && onSelectStatusFilter(activeStatusFilter === 'FAILED' ? 'ALL' : 'FAILED')}
          className={`p-2 rounded-xl text-left border transition flex items-center justify-between cursor-pointer ${
            activeStatusFilter === 'FAILED'
              ? 'bg-rose-500/20 border-rose-500 text-white shadow-sm'
              : 'bg-slate-850 hover:bg-slate-800 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
            <div>
              <span className="text-[11px] font-bold block text-slate-200">Failure</span>
              <span className="text-[10px] text-rose-400 font-mono font-semibold">{failurePercent}%</span>
            </div>
          </div>
          <span className="text-xs font-black font-mono text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-500/30">
            {failedCount}
          </span>
        </button>
      </div>
    </div>
  );
};
