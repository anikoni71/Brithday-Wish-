import React, { useMemo, useState, useRef } from 'react';
import * as d3 from 'd3';
import { MonthData } from './BirthdayDistributionChart';
import { Check, Lightbulb, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BirthdayMonthPieChartProps {
  monthData: MonthData[];
  totalCelebrants: number;
  activeMonthFilter: number | null;
  onSelectMonth?: (monthIndex: number | null) => void;
}

export const BirthdayMonthPieChart: React.FC<BirthdayMonthPieChartProps> = ({
  monthData,
  totalCelebrants,
  activeMonthFilter,
  onSelectMonth,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter months that actually have at least 1 celebrant for the pie slices
  const activeMonthsWithData = useMemo(() => {
    return monthData.filter((m) => m.count > 0);
  }, [monthData]);

  // Determine featured month (active filter, or hovered month, or largest month)
  const featuredMonth = useMemo(() => {
    if (activeMonthFilter !== null) {
      const found = monthData.find((m) => m.monthIndex === activeMonthFilter && m.count > 0);
      if (found) return found;
    }
    if (hoveredIndex !== null) {
      const found = monthData.find((m) => m.monthIndex === hoveredIndex && m.count > 0);
      if (found) return found;
    }
    if (activeMonthsWithData.length > 0) {
      // Return highest count month
      return [...activeMonthsWithData].sort((a, b) => b.count - a.count)[0];
    }
    return null;
  }, [activeMonthFilter, hoveredIndex, monthData, activeMonthsWithData]);

  // 3D Cake Ellipse Geometry Parameters
  const cakeCx = 120;
  const cakeCy = 145;
  const rx = 82;
  const ry = 36;
  const cakeHeight = 36;

  // D3 Pie Generator with sort
  const pieSlices = useMemo(() => {
    if (activeMonthsWithData.length === 0) return [];
    
    // Sort chronological or by count
    const pie = d3
      .pie<MonthData>()
      .value((d) => d.count)
      .sort(null)
      .startAngle(0)
      .endAngle(Math.PI * 2);

    return pie(activeMonthsWithData);
  }, [activeMonthsWithData]);

  // Helpers to calculate 3D Cake coordinates
  // Angle convention: 0 is top, π/2 is right, π is bottom, 3π/2 is left
  const getEllipsePoint = (angle: number, customRx = rx, customRy = ry, cx = cakeCx, cy = cakeCy) => {
    // Convert D3 clock angle (0 is up) to standard trig angle (0 is right)
    const trigAngle = angle - Math.PI / 2;
    return {
      x: cx + customRx * Math.cos(trigAngle),
      y: cy + customRy * Math.sin(trigAngle),
    };
  };

  // Top surface slice path
  const getTopSlicePath = (startAngle: number, endAngle: number, cx = cakeCx, cy = cakeCy, customRx = rx, customRy = ry) => {
    const p1 = getEllipsePoint(startAngle, customRx, customRy, cx, cy);
    const p2 = getEllipsePoint(endAngle, customRx, customRy, cx, cy);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    return `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${customRx} ${customRy} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`;
  };

  // Front cylinder side wall for a slice
  const getSideWallPath = (startAngle: number, endAngle: number, cx = cakeCx, cy = cakeCy, customRx = rx, customRy = ry, h = cakeHeight) => {
    // Only visible if facing forward: when trigAngle is in [0, π], which corresponds to clock angle [π/2, 3π/2]
    // We clamp the visible portion between π/2 and 3π/2
    const visStart = Math.max(startAngle, Math.PI / 2);
    const visEnd = Math.min(endAngle, (3 * Math.PI) / 2);

    if (visStart >= visEnd) return null;

    const p1Top = getEllipsePoint(visStart, customRx, customRy, cx, cy);
    const p2Top = getEllipsePoint(visEnd, customRx, customRy, cx, cy);
    const p1Bot = { x: p1Top.x, y: p1Top.y + h };
    const p2Bot = { x: p2Top.x, y: p2Top.y + h };

    const largeArc = visEnd - visStart > Math.PI ? 1 : 0;

    return `M ${p1Top.x} ${p1Top.y} A ${customRx} ${customRy} 0 ${largeArc} 1 ${p2Top.x} ${p2Top.y} L ${p2Bot.x} ${p2Bot.y} A ${customRx} ${customRy} 0 ${largeArc} 0 ${p1Bot.x} ${p1Bot.y} Z`;
  };

  const featuredPct = featuredMonth && totalCelebrants > 0 ? Math.round((featuredMonth.count / totalCelebrants) * 100) : 0;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const hoveredMonthData = useMemo(() => {
    return hoveredIndex !== null ? monthData.find(m => m.monthIndex === hoveredIndex) : null;
  }, [hoveredIndex, monthData]);

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      className="bg-[#fbf7f2] rounded-2xl border border-amber-200/80 p-4 flex flex-col justify-between h-full shadow-xs relative overflow-hidden"
    >
      {/* Decorative Warm Cake Card Ambient Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-200/60 pb-3 mb-2 z-10">
        <div className="flex items-center gap-2">
          <div className="relative p-1.5 bg-teal-500 text-white rounded-lg shadow-sm border border-teal-400/30">
            <Lightbulb className="w-4 h-4" />
            <Sparkles className="w-2 h-2 absolute -top-0.5 -right-0.5 text-amber-200 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#381c0e] tracking-tight flex items-center gap-1.5">
              <span>Month-Wise Share</span>
              <span className="text-[10px] font-semibold text-amber-900 bg-amber-100/80 px-1.5 py-0.2 rounded border border-amber-200">
                Birthday Cake 3D
              </span>
            </h4>
            <p className="text-[10px] text-amber-800/80">Proportional cake slices & cherries</p>
          </div>
        </div>

        {activeMonthFilter !== null && (
          <button
            onClick={() => onSelectMonth && onSelectMonth(null)}
            className="text-[10px] font-bold text-amber-800 hover:text-amber-900 bg-amber-200/70 hover:bg-amber-300/80 px-2 py-0.5 rounded-md transition cursor-pointer"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Interactive 3D Cake SVG Center Stage */}
      <div className="flex flex-col items-center justify-center my-0.5 relative select-none w-full">
        {totalCelebrants === 0 || activeMonthsWithData.length === 0 ? (
          <div className="w-[180px] h-[180px] rounded-full border-4 border-dashed border-amber-200 flex flex-col items-center justify-center text-center p-4">
            <span className="text-3xl mb-1">🎂</span>
            <p className="text-xs text-amber-800 font-semibold">No Birthday Records</p>
          </div>
        ) : (
          <div className="relative w-full max-w-[340px] flex items-center justify-center">
            <svg
              viewBox="0 0 340 215"
              className="w-full h-[215px] overflow-visible"
              style={{ filter: 'drop-shadow(0 6px 12px rgba(69, 26, 3, 0.12))' }}
            >
              <defs>
                {/* Cool SVG Keyframe Animations */}
                <style>{`
                  @keyframes cakeSliceFloat {
                    0%, 100% {
                      transform: translate(236px, 42px);
                    }
                    50% {
                      transform: translate(236px, 36px);
                    }
                  }
                  @keyframes sliceShadowBreathe {
                    0%, 100% {
                      transform: scale(1);
                      opacity: 0.18;
                    }
                    50% {
                      transform: scale(0.92);
                      opacity: 0.11;
                    }
                  }
                  @keyframes cherryGleam {
                    0%, 100% {
                      transform: scale(1);
                      filter: drop-shadow(0 0 0px rgba(239, 68, 68, 0));
                    }
                    50% {
                      transform: scale(1.06);
                      filter: drop-shadow(0 1px 3px rgba(239, 68, 68, 0.6));
                    }
                  }
                  @keyframes rosetteBreathe {
                    0%, 100% {
                      transform: scale(1) rotate(0deg);
                    }
                    50% {
                      transform: scale(1.05) rotate(3deg);
                    }
                  }
                  @keyframes twinkleSparkle {
                    0%, 100% {
                      opacity: 0.2;
                      transform: scale(0.7) rotate(0deg);
                    }
                    50% {
                      opacity: 0.95;
                      transform: scale(1.2) rotate(45deg);
                    }
                  }
                  @keyframes cakeEntrance {
                    from { transform: scale(0.8) translateY(30px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                  }
                  .floating-cake-slice {
                    animation: cakeSliceFloat 3.6s ease-in-out infinite;
                  }
                  .slice-shadow-anim {
                    transform-origin: 44px 62px;
                    animation: sliceShadowBreathe 3.6s ease-in-out infinite;
                  }
                  .cake-main-group {
                    animation: cakeEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                  }
                  .cherry-anim-0 { animation: cherryGleam 2.8s ease-in-out infinite; animation-delay: 0s; transform-box: fill-box; transform-origin: center; }
                  .cherry-anim-1 { animation: cherryGleam 2.8s ease-in-out infinite; animation-delay: 0.4s; transform-box: fill-box; transform-origin: center; }
                  .cherry-anim-2 { animation: cherryGleam 2.8s ease-in-out infinite; animation-delay: 0.8s; transform-box: fill-box; transform-origin: center; }
                  .cherry-anim-3 { animation: cherryGleam 2.8s ease-in-out infinite; animation-delay: 1.2s; transform-box: fill-box; transform-origin: center; }
                  .cherry-anim-4 { animation: cherryGleam 2.8s ease-in-out infinite; animation-delay: 1.6s; transform-box: fill-box; transform-origin: center; }
                  .cherry-anim-5 { animation: cherryGleam 2.8s ease-in-out infinite; animation-delay: 2.0s; transform-box: fill-box; transform-origin: center; }
                  
                  .rosette-animated {
                    transform-origin: 0px 0px;
                    animation: rosetteBreathe 4.2s ease-in-out infinite;
                  }
                  .sparkle-1 { animation: twinkleSparkle 2.4s ease-in-out infinite; animation-delay: 0.2s; }
                  .sparkle-2 { animation: twinkleSparkle 3.1s ease-in-out infinite; animation-delay: 1.1s; }
                  .sparkle-3 { animation: twinkleSparkle 2.7s ease-in-out infinite; animation-delay: 0.7s; }
                `}</style>

                {/* Chocolate Cake Top Glaze Gradient */}
                <linearGradient id="cake-top-glaze" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4a2411" />
                  <stop offset="50%" stopColor="#381c0e" />
                  <stop offset="100%" stopColor="#2b1409" />
                </linearGradient>

                {/* Selected/Hovered Cake Slice Top Gradient */}
                <linearGradient id="cake-top-selected" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#633219" />
                  <stop offset="50%" stopColor="#4e2511" />
                  <stop offset="100%" stopColor="#381909" />
                </linearGradient>

                {/* Chocolate Cylinder Side Wall Gradient */}
                <linearGradient id="cake-side-wall" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3d1e0f" />
                  <stop offset="40%" stopColor="#2e1509" />
                  <stop offset="100%" stopColor="#1a0a04" />
                </linearGradient>

                {/* Inner Cut Sponge Layer 1 - Vanilla Custard */}
                <linearGradient id="sponge-layer-1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fae8b6" />
                  <stop offset="100%" stopColor="#e8cf97" />
                </linearGradient>

                {/* Inner Cut Sponge Layer 2 - Rich Chocolate Cream */}
                <linearGradient id="sponge-layer-2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#854d32" />
                  <stop offset="100%" stopColor="#693720" />
                </linearGradient>

                {/* Inner Cut Sponge Layer 3 - Strawberry Mousse */}
                <linearGradient id="sponge-layer-3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f3abbc" />
                  <stop offset="100%" stopColor="#df8fa3" />
                </linearGradient>

                {/* Red Cherry Radial Gradient */}
                <radialGradient id="cherry-red-grad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="25%" stopColor="#ee2222" />
                  <stop offset="70%" stopColor="#b91c1c" />
                  <stop offset="100%" stopColor="#580808" />
                </radialGradient>

                {/* Cherry Specular Glow */}
                <radialGradient id="cherry-specular" cx="40%" cy="30%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>

                {/* Cream Rosette Petal Gradient */}
                <radialGradient id="cream-petal-grad" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </radialGradient>
              </defs>

              {/* 3D CAKE SHADOW AT BASE */}
              <g className="cake-main-group">
                <ellipse
                  cx={cakeCx + 2}
                  cy={cakeCy + cakeHeight + 4}
                  rx={rx + 8}
                  ry={ry + 4}
                  fill="rgba(69, 26, 3, 0.16)"
                  filter="blur(3px)"
                />

                {/* Celebratory Twinkling Sparkles */}
                <g className="cake-ambient-sparkles pointer-events-none">
                  <path
                    d="M 45 65 Q 45 72 38 72 Q 45 72 45 79 Q 45 72 52 72 Q 45 72 45 65 Z"
                    fill="#f59e0b"
                    className="sparkle-1"
                  />
                  <path
                    d="M 215 170 Q 215 175 210 175 Q 215 175 215 180 Q 215 175 220 175 Q 215 175 215 170 Z"
                    fill="#fbbf24"
                    className="sparkle-2"
                  />
                  <path
                    d="M 125 78 Q 125 82 121 82 Q 125 82 125 86 Q 125 82 129 82 Q 125 82 125 78 Z"
                    fill="#fcd34d"
                    className="sparkle-3"
                  />
                </g>

                {/* 1. FRONT CYLINDER BASE WALLS (FOR EACH VISIBLE SLICE) */}
                <g className="cake-side-walls">
                  {pieSlices.map((slice) => {
                    const m = slice.data;
                    const isSelected = activeMonthFilter === m.monthIndex;
                    const isHovered = hoveredIndex === m.monthIndex;
                    const sidePath = getSideWallPath(slice.startAngle, slice.endAngle);

                    if (!sidePath) return null;

                    return (
                      <path
                        key={`side-${m.shortName}`}
                        d={sidePath}
                        fill="url(#cake-side-wall)"
                        stroke="#1e0c05"
                        strokeWidth="0.8"
                        className="transition-all duration-200 cursor-pointer hover:brightness-110"
                        opacity={isSelected || isHovered ? 1 : 0.95}
                        onMouseEnter={() => setHoveredIndex(m.monthIndex)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => {
                          const newFilter = activeMonthFilter === m.monthIndex ? null : m.monthIndex;
                          if (onSelectMonth) onSelectMonth(newFilter);
                        }}
                      />
                    );
                  })}
                </g>

                {/* 2. TOP CAKE SLICES */}
                <g className="cake-top-slices">
                  {pieSlices.map((slice) => {
                    const m = slice.data;
                    const isSelected = activeMonthFilter === m.monthIndex;
                    const isHovered = hoveredIndex === m.monthIndex;
                    const topPath = getTopSlicePath(slice.startAngle, slice.endAngle);

                    return (
                      <path
                        key={`top-${m.shortName}`}
                        d={topPath}
                        fill={isSelected || isHovered ? 'url(#cake-top-selected)' : 'url(#cake-top-glaze)'}
                        stroke={isSelected ? '#f59e0b' : '#2b1308'}
                        strokeWidth={isSelected ? '2' : '1'}
                        className="cursor-pointer transition-all duration-200 hover:brightness-110"
                        onMouseEnter={() => setHoveredIndex(m.monthIndex)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => {
                          const newFilter = activeMonthFilter === m.monthIndex ? null : m.monthIndex;
                          if (onSelectMonth) onSelectMonth(newFilter);
                        }}
                      />
                    );
                  })}
                </g>

                {/* 3. CENTER WHIPPED CREAM FLOWER / ROSETTE */}
                <g className="center-rosette rosette-animated" transform={`translate(${cakeCx}, ${cakeCy})`}>
                  {/* 5 Petals */}
                  {[0, 72, 144, 216, 288].map((deg, pIdx) => {
                    const rad = (deg * Math.PI) / 180;
                    const px = Math.cos(rad) * 6.5;
                    const py = Math.sin(rad) * 4.2;
                    return (
                      <ellipse
                        key={`petal-${pIdx}`}
                        cx={px}
                        cy={py}
                        rx={4.8}
                        ry={3.5}
                        fill="url(#cream-petal-grad)"
                        stroke="#cbd5e1"
                        strokeWidth="0.5"
                      />
                    );
                  })}
                  {/* Center Cherry Berry */}
                  <ellipse cx={0} cy={0} rx={3.2} ry={2.5} fill="url(#cherry-red-grad)" />
                  <ellipse cx={-0.8} cy={-0.6} rx={0.9} ry={0.6} fill="#ffffff" opacity={0.8} />
                </g>

                {/* 4. GLOSSY CHERRIES ON EACH SLICE WITH CALLOUT POINTERS */}
                <g className="cake-cherries-and-callouts">
                  {pieSlices.map((slice, i) => {
                    const m = slice.data;
                    const isSelected = activeMonthFilter === m.monthIndex;
                    const isHovered = hoveredIndex === m.monthIndex;
                    const midAngle = (slice.startAngle + slice.endAngle) / 2;
                    const pct = totalCelebrants > 0 ? Math.round((m.count / totalCelebrants) * 100) : 0;

                    // Cherry position on cake top ellipse
                    const cherryPos = getEllipsePoint(midAngle, rx * 0.68, ry * 0.68, cakeCx, cakeCy);

                    // Callout label endpoint calculation (left or right side depending on angle)
                    const isLeftSide = Math.sin(midAngle - Math.PI / 2) < 0;
                    const trigAngle = midAngle - Math.PI / 2;

                    // Determine callout line target
                    let calloutX = isLeftSide ? 34 : 205;
                    let calloutY = cherryPos.y;

                    // Spread out callouts vertically for clarity
                    if (trigAngle < -Math.PI / 3) {
                      calloutY = Math.max(18, cherryPos.y - 32);
                      calloutX = 60;
                    } else if (trigAngle > Math.PI / 3 && trigAngle < (2 * Math.PI) / 3) {
                      calloutY = cherryPos.y + 40;
                      calloutX = isLeftSide ? 42 : 190;
                    }

                    return (
                      <g
                        key={`cherry-callout-${m.shortName}`}
                        className="cursor-pointer group"
                        onMouseEnter={() => setHoveredIndex(m.monthIndex)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => {
                          const newFilter = activeMonthFilter === m.monthIndex ? null : m.monthIndex;
                          if (onSelectMonth) onSelectMonth(newFilter);
                        }}
                      >
                        {/* Callout Leader Line */}
                        <polyline
                          points={`${cherryPos.x},${cherryPos.y} ${calloutX + (isLeftSide ? 20 : -20)},${calloutY} ${calloutX},${calloutY}`}
                          fill="none"
                          stroke={isSelected || isHovered ? '#b45309' : '#381c0e'}
                          strokeWidth={isSelected || isHovered ? '1.8' : '1.1'}
                          opacity={isSelected || isHovered ? 1 : 0.85}
                          className="transition-all duration-200"
                        />

                        {/* Small anchor dot on cherry */}
                        <circle
                          cx={cherryPos.x}
                          cy={cherryPos.y}
                          r={1.8}
                          fill={isSelected || isHovered ? '#f59e0b' : '#381c0e'}
                        />

                        {/* Callout Percentage Number */}
                        <text
                          x={isLeftSide ? calloutX - 4 : calloutX + 4}
                          y={calloutY + 4}
                          textAnchor={isLeftSide ? 'end' : 'start'}
                          fill={isSelected ? '#92400e' : isHovered ? '#b45309' : '#2b1409'}
                          fontFamily="serif"
                          fontSize={pct >= 30 ? '19' : pct >= 20 ? '16' : '13'}
                          fontWeight="900"
                          className="transition-all duration-200 select-none group-hover:scale-105"
                        >
                          {pct}
                          <tspan fontSize="10" fontWeight="600" dx="1">
                            %
                          </tspan>
                        </text>

                        {/* Cherry Shadow on cake */}
                        <ellipse
                          cx={cherryPos.x + 1}
                          cy={cherryPos.y + 3}
                          rx={5}
                          ry={2.5}
                          fill="rgba(0,0,0,0.35)"
                        />

                        {/* Cherry Body with animation class */}
                        <circle
                          cx={cherryPos.x}
                          cy={cherryPos.y}
                          r={isHovered || isSelected ? 7.2 : 5.8}
                          fill="url(#cherry-red-grad)"
                          stroke="#7f1d1d"
                          strokeWidth="0.6"
                          className={`transition-all duration-200 cherry-anim-${i % 6}`}
                        />

                        {/* Specular White Highlight Dot */}
                        <circle
                          cx={cherryPos.x - 1.8}
                          cy={cherryPos.y - 1.8}
                          r={1.6}
                          fill="#ffffff"
                          opacity={0.88}
                          className="pointer-events-none"
                        />
                      </g>
                    );
                  })}
                </g>
              </g>

              {/* 5. SEPARATED FEATURED SLICE SHOWING 3-LAYER SPONGE CAKE (Top Right) WITH FLOAT ANIMATION */}
              {featuredMonth && (
                <g
                  className="featured-layered-slice floating-cake-slice cursor-pointer transition-all duration-300 hover:brightness-105"
                  onClick={() => {
                    const newFilter = activeMonthFilter === featuredMonth.monthIndex ? null : featuredMonth.monthIndex;
                    if (onSelectMonth) onSelectMonth(newFilter);
                  }}
                  onMouseEnter={() => setHoveredIndex(featuredMonth.monthIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Month Label Above the Slice */}
                  <g transform="translate(46, -10)">
                    <path d="M -38 -8 L 38 -8 L 38 8 L -38 8 Z" fill="#451a03" rx="4" />
                    <text
                      textAnchor="middle"
                      fill="#fef3c7"
                      fontSize="9"
                      fontWeight="900"
                      dy="3"
                      className="select-none uppercase tracking-widest font-serif"
                    >
                      {featuredMonth.fullName}
                    </text>
                  </g>

                  {/* Shadow beneath cut slice with breathe animation */}
                  <ellipse
                    cx="44"
                    cy="62"
                    rx="42"
                    ry="7"
                    fill="rgba(69,26,3,0.18)"
                    filter="blur(2px)"
                    className="slice-shadow-anim"
                  />

                  {/* Cut Slice Back Chocolate Wall / Glaze Roof */}
                  <path
                    d="M 4 10 L 46 2 L 86 12 L 4 10 Z"
                    fill="#3d1e0f"
                    stroke="#271107"
                    strokeWidth="0.8"
                  />
                  {/* Right side dark chocolate frosting edge */}
                  <path
                    d="M 86 12 L 88 56 L 86 56 Z"
                    fill="#271107"
                    stroke="#1e0c05"
                    strokeWidth="1.5"
                  />

                  {/* LAYER 1: Vanilla Custard Sponge (Top) */}
                  <path
                    d="M 4 10 L 86 12 L 86 26 L 4 24 Z"
                    fill="url(#sponge-layer-1)"
                    stroke="#2b1409"
                    strokeWidth="1"
                  />
                  <text x="12" y="20" fontSize="8" fontFamily="serif" fontWeight="bold" fill="#713f12">
                    1.
                  </text>

                  {/* LAYER 2: Chocolate Truffle Sponge (Middle) */}
                  <path
                    d="M 4 24 L 86 26 L 86 40 L 4 38 Z"
                    fill="url(#sponge-layer-2)"
                    stroke="#2b1409"
                    strokeWidth="1"
                  />
                  <text x="12" y="34" fontSize="8" fontFamily="serif" fontWeight="bold" fill="#fef3c7">
                    2.
                  </text>

                  {/* LAYER 3: Strawberry Mousse Sponge (Bottom) */}
                  <path
                    d="M 4 38 L 86 40 L 86 54 L 4 52 Z"
                    fill="url(#sponge-layer-3)"
                    stroke="#2b1409"
                    strokeWidth="1"
                  />
                  <text x="12" y="48" fontSize="8" fontFamily="serif" fontWeight="bold" fill="#831843">
                    3.
                  </text>

                  {/* Cream Rosette on cut slice top */}
                  <path
                    d="M 4 10 C 6 2, 14 2, 18 10 Z"
                    fill="url(#cream-petal-grad)"
                    stroke="#cbd5e1"
                    strokeWidth="0.6"
                  />

                  {/* Cherry on top of layered slice with gleam */}
                  <circle
                    cx="56"
                    cy="4"
                    r="6.5"
                    fill="url(#cherry-red-grad)"
                    stroke="#7f1d1d"
                    strokeWidth="0.6"
                    className="cherry-anim-0"
                  />
                  <circle cx="54.2" cy="2.2" r="1.6" fill="#ffffff" opacity={0.9} />

                  {/* Connecting Callout Line to Big Percentage */}
                  <polyline
                    points="56,4 98,4 98,42"
                    fill="none"
                    stroke="#381c0e"
                    strokeWidth="1.1"
                  />

                  {/* Big Hero Percentage Callout (e.g., 40%) */}
                  <g transform="translate(32, 68)">
                    <text
                      x="0"
                      y="32"
                      fill="#2b1409"
                      fontFamily="serif"
                      fontSize="36"
                      fontWeight="900"
                      className="select-none transition-transform duration-200"
                    >
                      {featuredPct}
                    </text>
                    <text
                      x="48"
                      y="46"
                      fill="#2b1409"
                      fontFamily="serif"
                      fontSize="22"
                      fontWeight="900"
                      className="select-none"
                    >
                      %
                    </text>
                  </g>
                </g>
              )}
            </svg>
          </div>
        )}
      </div>

      {/* Custom Styled Tooltip */}
      <AnimatePresence>
        {hoveredMonthData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute z-[100] pointer-events-none bg-[#451a03] text-amber-50 px-3 py-2 rounded-xl shadow-xl border border-amber-400/30 flex flex-col items-center gap-1 min-w-[110px]"
            style={{
              left: mousePos.x,
              top: mousePos.y - 75,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300/80 leading-none">
              {hoveredMonthData.fullName}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black font-mono leading-none">{hoveredMonthData.count}</span>
              <span className="text-[10px] font-bold bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                {totalCelebrants > 0 ? Math.round((hoveredMonthData.count / totalCelebrants) * 100) : 0}%
              </span>
            </div>
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#451a03] rotate-45 border-r border-b border-amber-400/30" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Month Breakdown Proportional Legend Grid */}
      <div className="mt-2 pt-2 border-t border-amber-200/70 z-10">
        <div className="text-[10px] font-bold text-amber-950 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block shadow-xs" />
            <span>Active Birthday Slices:</span>
          </span>
          <span className="text-amber-800/80 font-semibold text-[9px] bg-amber-100/90 px-1.5 py-0.2 rounded border border-amber-200">
            {activeMonthsWithData.length} active months
          </span>
        </div>

        <div className="max-h-[105px] overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-amber-200">
          {activeMonthsWithData.map((m) => {
            const isSelected = activeMonthFilter === m.monthIndex;
            const isHovered = hoveredIndex === m.monthIndex;
            const pct = totalCelebrants > 0 ? Math.round((m.count / totalCelebrants) * 100) : 0;

            return (
              <button
                key={m.shortName}
                onClick={() => {
                  const newFilter = activeMonthFilter === m.monthIndex ? null : m.monthIndex;
                  if (onSelectMonth) onSelectMonth(newFilter);
                }}
                onMouseEnter={() => setHoveredIndex(m.monthIndex)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`w-full flex items-center justify-between p-1.5 rounded-lg text-[11px] transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-amber-200/90 text-amber-950 font-bold border border-amber-400 shadow-xs'
                    : isHovered
                    ? 'bg-amber-100/80 text-amber-900 border border-amber-200'
                    : 'bg-white/90 hover:bg-amber-50 text-stone-800 border border-amber-200/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs">🍒</span>
                  <span className="font-semibold text-stone-900">{m.fullName}</span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-stone-900">{m.count}</span>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100/80 border border-amber-200/70 px-1.5 py-0.2 rounded">
                    {pct}%
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-800 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

