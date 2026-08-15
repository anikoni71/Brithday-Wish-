import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { MonthData } from './BirthdayDistributionChart';
import { PieChart, Sparkles, Filter, ChevronRight, Check } from 'lucide-react';

interface BirthdayMonthPieChartProps {
  monthData: MonthData[];
  totalCelebrants: number;
  activeMonthFilter: number | null;
  onSelectMonth?: (monthIndex: number | null) => void;
}

// Harmonious 12-month color palette for crisp distinction
const MONTH_PALETTE = [
  '#6366f1', // Jan - Indigo
  '#ec4899', // Feb - Pink
  '#8b5cf6', // Mar - Purple
  '#10b981', // Apr - Emerald
  '#f59e0b', // May - Amber
  '#06b6d4', // Jun - Cyan
  '#3b82f6', // Jul - Blue
  '#14b8a6', // Aug - Teal
  '#f97316', // Sep - Orange
  '#a855f7', // Oct - Violet
  '#e11d48', // Nov - Rose
  '#0284c7', // Dec - Sky
];

export const BirthdayMonthPieChart: React.FC<BirthdayMonthPieChartProps> = ({
  monthData,
  totalCelebrants,
  activeMonthFilter,
  onSelectMonth,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Filter months that actually have at least 1 celebrant for the pie slices
  const activeMonthsWithData = useMemo(() => {
    return monthData.filter((m) => m.count > 0);
  }, [monthData]);

  // Dimension settings
  const size = 200;
  const radius = size / 2;
  const innerRadius = radius * 0.58; // Doughnut style for modern feel
  const hoverOuterRadius = radius * 0.98;
  const normalOuterRadius = radius * 0.90;

  // D3 Pie layout generator
  const pieGenerator = useMemo(() => {
    return d3
      .pie<MonthData>()
      .value((d) => d.count)
      .sort(null) // Keep chronological month order
      .padAngle(0.03); // Slight separation between slices
  }, []);

  // Arc slices
  const arcData = useMemo(() => {
    if (activeMonthsWithData.length === 0) return [];
    return pieGenerator(activeMonthsWithData);
  }, [activeMonthsWithData, pieGenerator]);

  const activeSelectedMonth = activeMonthFilter !== null ? monthData[activeMonthFilter] : null;
  const activeHoveredMonth = hoveredIndex !== null ? monthData[hoveredIndex] : null;

  return (
    <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
            <PieChart className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Month-Wise Share</span>
              <span className="text-[10px] font-semibold text-slate-500 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                Pie Chart
              </span>
            </h4>
            <p className="text-[10px] text-slate-500">Distribution proportion</p>
          </div>
        </div>

        {activeMonthFilter !== null && (
          <button
            onClick={() => onSelectMonth && onSelectMonth(null)}
            className="text-[10px] font-bold text-amber-700 hover:text-amber-800 bg-amber-100/80 hover:bg-amber-200 px-2 py-0.5 rounded-md transition cursor-pointer"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Interactive Pie SVG Center Stage */}
      <div className="flex flex-col items-center justify-center my-1 relative select-none">
        {totalCelebrants === 0 || activeMonthsWithData.length === 0 ? (
          <div className="w-[180px] h-[180px] rounded-full border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-4">
            <span className="text-2xl mb-1">📊</span>
            <p className="text-xs text-slate-500 font-semibold">No Birthday Records</p>
          </div>
        ) : (
          <div className="relative">
            <svg width={size} height={size} className="overflow-visible">
              <g transform={`translate(${radius}, ${radius})`}>
                {arcData.map((slice, i) => {
                  const m = slice.data;
                  const isHovered = hoveredIndex === m.monthIndex;
                  const isSelected = activeMonthFilter === m.monthIndex;
                  const color = MONTH_PALETTE[m.monthIndex % MONTH_PALETTE.length];

                  const arcGenerator = d3
                    .arc<d3.PieArcDatum<MonthData>>()
                    .innerRadius(innerRadius)
                    .outerRadius(isHovered || isSelected ? hoverOuterRadius : normalOuterRadius)
                    .cornerRadius(4);

                  const pathString = arcGenerator(slice) || '';

                  return (
                    <path
                      key={m.shortName}
                      d={pathString}
                      fill={color}
                      stroke={isSelected ? '#0f172a' : '#ffffff'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="cursor-pointer transition-all duration-200 hover:opacity-90"
                      onMouseEnter={() => setHoveredIndex(m.monthIndex)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => {
                        const newFilter = activeMonthFilter === m.monthIndex ? null : m.monthIndex;
                        if (onSelectMonth) onSelectMonth(newFilter);
                      }}
                      title={`${m.fullName}: ${m.count} celebrants (${Math.round((m.count / totalCelebrants) * 100)}%)`}
                    />
                  );
                })}
              </g>
            </svg>

            {/* Center Doughnut Content Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              {activeHoveredMonth ? (
                <div className="animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {activeHoveredMonth.shortName}
                  </div>
                  <div className="text-lg font-black text-slate-900 font-mono leading-none my-0.5">
                    {activeHoveredMonth.count}
                  </div>
                  <div className="text-[9px] font-bold text-indigo-600">
                    {totalCelebrants > 0 ? `${Math.round((activeHoveredMonth.count / totalCelebrants) * 100)}%` : '0%'}
                  </div>
                </div>
              ) : activeSelectedMonth ? (
                <div className="animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                    {activeSelectedMonth.shortName}
                  </div>
                  <div className="text-lg font-black text-amber-900 font-mono leading-none my-0.5">
                    {activeSelectedMonth.count}
                  </div>
                  <div className="text-[9px] font-bold text-amber-700">
                    Selected
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-lg font-black text-slate-900 font-mono leading-none">
                    {totalCelebrants}
                  </div>
                  <div className="text-[9px] font-bold text-slate-500 tracking-tight mt-0.5">
                    Total Celebrants
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Month Breakdown Proportional Legend Grid */}
      <div className="mt-3 pt-2.5 border-t border-slate-200/80">
        <div className="text-[10px] font-bold text-slate-600 mb-1.5 flex items-center justify-between">
          <span>Active Birthday Months:</span>
          <span className="text-slate-400 font-normal text-[9px]">{activeMonthsWithData.length} of 12</span>
        </div>

        <div className="max-h-[110px] overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
          {activeMonthsWithData.map((m) => {
            const isSelected = activeMonthFilter === m.monthIndex;
            const color = MONTH_PALETTE[m.monthIndex % MONTH_PALETTE.length];
            const pct = totalCelebrants > 0 ? Math.round((m.count / totalCelebrants) * 100) : 0;

            return (
              <button
                key={m.shortName}
                onClick={() => {
                  const newFilter = activeMonthFilter === m.monthIndex ? null : m.monthIndex;
                  if (onSelectMonth) onSelectMonth(newFilter);
                }}
                className={`w-full flex items-center justify-between p-1.5 rounded-lg text-[11px] transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-amber-100/90 text-amber-950 font-bold border border-amber-300'
                    : 'bg-white hover:bg-slate-100/80 text-slate-700 border border-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-semibold">{m.fullName}</span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-slate-900">{m.count}</span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1 py-0.2 rounded">
                    {pct}%
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-amber-700 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
