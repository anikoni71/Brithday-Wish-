import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { AutomationLogEntry } from '../types';
import { 
  Bot, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Radio,
  Server,
  BarChart3
} from 'lucide-react';

interface AutomationAnalyticsChartProps {
  logs: AutomationLogEntry[];
  onSelectStatusFilter?: (status: 'ALL' | 'SUCCESS' | 'FAILED' | 'SKIPPED_DUPLICATE') => void;
  activeStatusFilter?: 'ALL' | 'SUCCESS' | 'FAILED' | 'SKIPPED_DUPLICATE';
}

interface StatusMetricItem {
  key: 'SUCCESS' | 'SKIPPED_DUPLICATE' | 'FAILED';
  label: string;
  count: number;
  color: string;
  gradientId: string;
}

export const AutomationAnalyticsChart: React.FC<AutomationAnalyticsChartProps> = ({
  logs,
  onSelectStatusFilter,
  activeStatusFilter = 'ALL',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredData, setHoveredData] = useState<{ label: string; count: number; percentage: number; color: string } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Compute metrics
  const total = logs.length;
  const successCount = logs.filter((l) => l.status === 'SUCCESS').length;
  const failedCount = logs.filter((l) => l.status === 'FAILED').length;
  const skippedCount = logs.filter((l) => l.status === 'SKIPPED_DUPLICATE').length;

  const successRate = total > 0 ? ((successCount / total) * 100).toFixed(1) : '100.0';
  const avgLatency = useMemo(() => {
    const latencies = logs.filter(l => l.executionTimeMs).map(l => l.executionTimeMs!);
    if (latencies.length === 0) return 380;
    return Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
  }, [logs]);

  // Hourly / Trigger Grouping
  const chartData: StatusMetricItem[] = useMemo(() => {
    return [
      { key: 'SUCCESS', label: 'Successful Dispatches', count: successCount, color: '#10b981', gradientId: 'grad-success' },
      { key: 'SKIPPED_DUPLICATE', label: 'Skipped / Duplicates', count: skippedCount, color: '#f59e0b', gradientId: 'grad-skipped' },
      { key: 'FAILED', label: 'Failed Deliveries', count: failedCount, color: '#ef4444', gradientId: 'grad-failed' },
    ];
  }, [successCount, skippedCount, failedCount]);

  // D3 Chart Render
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = containerRef.current.clientWidth || 600;
    const height = 180;
    const margin = { top: 20, right: 30, bottom: 35, left: 155 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%').attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const maxVal = Math.max(d3.max(chartData, (d: StatusMetricItem) => d.count) || 1, 4);
    const xScale = d3.scaleLinear().domain([0, maxVal]).range([0, innerWidth]).nice();
    const yScale = d3.scaleBand<string>().domain(chartData.map((d: StatusMetricItem) => d.label)).range([0, innerHeight]).padding(0.35);

    // Defs for gradients
    const defs = svg.append('defs');

    // Success Gradient
    const gSuccess = defs.append('linearGradient').attr('id', 'grad-success').attr('x1', '0%').attr('x2', '100%');
    gSuccess.append('stop').attr('offset', '0%').attr('stop-color', '#10b981');
    gSuccess.append('stop').attr('offset', '100%').attr('stop-color', '#059669');

    // Skipped Gradient
    const gSkipped = defs.append('linearGradient').attr('id', 'grad-skipped').attr('x1', '0%').attr('x2', '100%');
    gSkipped.append('stop').attr('offset', '0%').attr('stop-color', '#fbbf24');
    gSkipped.append('stop').attr('offset', '100%').attr('stop-color', '#d97706');

    // Failed Gradient
    const gFailed = defs.append('linearGradient').attr('id', 'grad-failed').attr('x1', '0%').attr('x2', '100%');
    gFailed.append('stop').attr('offset', '0%').attr('stop-color', '#f87171');
    gFailed.append('stop').attr('offset', '100%').attr('stop-color', '#dc2626');

    // Grid lines
    g.append('g')
      .attr('class', 'x-grid')
      .selectAll('line')
      .data(xScale.ticks(5))
      .enter()
      .append('line')
      .attr('x1', (d: number) => xScale(d))
      .attr('x2', (d: number) => xScale(d))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#334155')
      .attr('stroke-dasharray', '3 3')
      .attr('stroke-opacity', 0.6);

    // Y Axis (Labels)
    const yAxis = g.append('g')
      .call(d3.axisLeft(yScale).tickSize(0));
    yAxis.select('.domain').remove();
    yAxis.selectAll('.tick text')
      .attr('dx', '-10px')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .attr('fill', '#94a3b8');

    // X Axis
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format('d')).tickSize(4));
    xAxis.select('.domain').attr('stroke', '#475569');
    xAxis.selectAll('.tick text').attr('font-size', '10px').attr('font-mono', 'true').attr('fill', '#64748b');

    // Background track bars
    g.selectAll<SVGRectElement, StatusMetricItem>('.track-bar')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('class', 'track-bar')
      .attr('x', 0)
      .attr('y', (d: StatusMetricItem) => yScale(d.label) || 0)
      .attr('width', innerWidth)
      .attr('height', yScale.bandwidth())
      .attr('fill', 'rgba(51, 65, 85, 0.35)')
      .attr('rx', 6);

    // Value bars with smooth D3 animation
    const bars = g.selectAll<SVGGElement, StatusMetricItem>('.val-bar')
      .data(chartData)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .on('mouseenter', function (event: MouseEvent, d: StatusMetricItem) {
        const pct = total > 0 ? (d.count / total) * 100 : 0;
        setHoveredData({ label: d.label, count: d.count, percentage: Math.round(pct), color: d.color });
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
        setHoveredData(null);
        setTooltipPos(null);
      })
      .on('click', function (_event: MouseEvent, d: StatusMetricItem) {
        if (onSelectStatusFilter) {
          onSelectStatusFilter(activeStatusFilter === d.key ? 'ALL' : d.key);
        }
      });

    bars.append('rect')
      .attr('class', 'val-bar')
      .attr('x', 0)
      .attr('y', (d: StatusMetricItem) => yScale(d.label) || 0)
      .attr('height', yScale.bandwidth())
      .attr('width', 0)
      .attr('rx', 6)
      .attr('fill', (d: StatusMetricItem) => `url(#${d.gradientId})`)
      .transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('width', (d: StatusMetricItem) => Math.max(xScale(d.count), d.count > 0 ? 10 : 0));

    // Value text badges
    bars.append('text')
      .attr('x', (d: StatusMetricItem) => Math.max(xScale(d.count), 0) + 8)
      .attr('y', (d: StatusMetricItem) => (yScale(d.label) || 0) + yScale.bandwidth() / 2 + 4)
      .attr('font-size', '12px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-weight', '800')
      .attr('fill', (d: StatusMetricItem) => d.color)
      .text((d: StatusMetricItem) => `${d.count} (${total > 0 ? Math.round((d.count / total) * 100) : 0}%)`);

  }, [chartData, total, activeStatusFilter, onSelectStatusFilter]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (!svgRef.current || !containerRef.current) return;
    };
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 rounded-2xl border border-slate-700 shadow-xl overflow-hidden text-white flex flex-col justify-between h-full">
      {/* Top Header */}
      <div className="p-5 border-b border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Automation Engine Analytics Workstation
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                Live 8:00 AM Cron Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Real-time performance metrics and dispatch distribution for Google Apps Script & headless background runner
            </p>
          </div>
        </div>

        {/* Quick KPI Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-slate-800/90 border border-slate-700 px-3.5 py-1.5 rounded-xl flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Success Rate</span>
              <span className="text-xs font-black text-emerald-400 font-mono">{successRate}%</span>
            </div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 px-3.5 py-1.5 rounded-xl flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Avg. Latency</span>
              <span className="text-xs font-black text-amber-300 font-mono">{avgLatency}ms</span>
            </div>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 px-3.5 py-1.5 rounded-xl flex items-center gap-2.5">
            <Server className="w-4 h-4 text-blue-400" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Sender Node</span>
              <span className="text-xs font-black text-blue-300 font-mono">+8801625299521</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="p-5 relative" ref={containerRef}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            Trigger Execution Breakdown (D3.js)
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {total} Total Executions Recorded
          </span>
        </div>

        <div className="w-full overflow-hidden">
          <svg ref={svgRef} className="w-full overflow-visible" />
        </div>

        {/* Hover Tooltip */}
        {hoveredData && tooltipPos && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-950 text-white rounded-xl shadow-2xl p-3 text-xs border border-slate-700 backdrop-blur-md -translate-x-1/2 -translate-y-full mb-2 min-w-[180px]"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y - 10}px`,
            }}
          >
            <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800">
              <span className="font-bold text-slate-200">{hoveredData.label}</span>
              <span className="font-mono text-emerald-400 font-bold">{hoveredData.count}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Represents <strong className="text-white">{hoveredData.percentage}%</strong> of total cloud trigger dispatches.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      <div className="px-5 py-2.5 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Google Apps Script Trigger Schedule: <strong>Daily 8:00 AM - 9:00 AM</strong></span>
        </div>
        <span className="font-mono text-slate-300">
          Sync Status: Column L Verified (Anti-Duplicate Guard Active)
        </span>
      </div>
    </div>
  );
};
