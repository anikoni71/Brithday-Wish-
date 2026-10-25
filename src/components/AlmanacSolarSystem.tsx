import React, { useMemo, useState } from 'react';

interface AlmanacSolarSystemProps {
  glowColor?: string;
  className?: string;
}

export interface PlanetConfig {
  name: string;
  radius: number; // orbital radius in px
  duration: number; // orbital period in seconds
  startAngle: number; // initial degree offset
  size: number; // planet diameter in px
  color: string;
  accentColor: string;
  hasRings?: boolean;
  hasMoon?: boolean;
  category: string;
  orbitalSpeedKmS: string;
  orbitalSpeedMph: string;
  distanceAU: string;
  distanceKm: string;
  distanceMiles: string;
  orbitalPeriod: string;
  solarFact: string;
}

/**
 * AlmanacSolarSystem
 * A fully animated, cinematic live solar system background designed specifically
 * for the Cosmic Ephemeris Almanac section.
 * Features:
 * - A radiant glowing Sun at the center with pulsing photosphere and rotating solar flares
 * - Realistic orbiting planets (Mercury, Venus, Earth with orbiting Moon, Mars, Jupiter, Saturn with 3D rings, Uranus, Neptune)
 * - Dynamic Planet Name Labels moving continuously alongside each planet along its orbit
 * - Pause-on-hover effect across the entire solar system simulation for focused planet inspection
 * - Instant resumption when mouse leaves the container
 * - Interactive hover tooltips displaying authentic orbital speeds, distance facts (AU & km/mi), and celestial telemetry
 * - Pure hardware-accelerated CSS 3D transforms for silky smooth 60fps performance
 */
export const AlmanacSolarSystem: React.FC<AlmanacSolarSystemProps> = ({
  glowColor = '#a855f7',
  className = '',
}) => {
  // State to track hover pause and active inspected planet
  const [isContainerHovered, setIsContainerHovered] = useState(false);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  // Overall pause condition
  const isPaused = isContainerHovered || hoveredPlanet !== null;

  // Planetary specifications with realistic astronomical data & telemetry facts
  const planets: PlanetConfig[] = useMemo(
    () => [
      {
        name: 'Mercury',
        radius: 88,
        duration: 16,
        startAngle: 45,
        size: 7,
        color: '#94a3b8',
        accentColor: '#cbd5e1',
        category: 'Terrestrial Planet',
        orbitalSpeedKmS: '47.4 km/s',
        orbitalSpeedMph: '106,000 mph',
        distanceAU: '0.39 AU',
        distanceKm: '57.9M km',
        distanceMiles: '36.0M mi',
        orbitalPeriod: '87.97 Earth Days',
        solarFact: 'Fastest orbital speed in the Solar System, enduring intense solar radiation.',
      },
      {
        name: 'Venus',
        radius: 120,
        duration: 24,
        startAngle: 175,
        size: 9.5,
        color: '#fde047',
        accentColor: '#d97706',
        category: 'Terrestrial Planet',
        orbitalSpeedKmS: '35.0 km/s',
        orbitalSpeedMph: '78,300 mph',
        distanceAU: '0.72 AU',
        distanceKm: '108.2M km',
        distanceMiles: '67.2M mi',
        orbitalPeriod: '224.7 Earth Days',
        solarFact: 'Hottest planetary surface (465°C) with dense runaway greenhouse clouds.',
      },
      {
        name: 'Earth',
        radius: 156,
        duration: 36,
        startAngle: 290,
        size: 11,
        color: '#38bdf8',
        accentColor: '#10b981',
        hasMoon: true,
        category: 'Terrestrial (Home World)',
        orbitalSpeedKmS: '29.8 km/s',
        orbitalSpeedMph: '66,600 mph',
        distanceAU: '1.00 AU',
        distanceKm: '149.6M km',
        distanceMiles: '93.0M mi',
        orbitalPeriod: '365.25 Days (1 Year)',
        solarFact: 'The Goldilocks sanctuary harboring liquid oceans, life, and an orbiting Moon.',
      },
      {
        name: 'Mars',
        radius: 196,
        duration: 48,
        startAngle: 110,
        size: 8.5,
        color: '#f87171',
        accentColor: '#ef4444',
        category: 'Terrestrial Planet',
        orbitalSpeedKmS: '24.1 km/s',
        orbitalSpeedMph: '53,900 mph',
        distanceAU: '1.52 AU',
        distanceKm: '227.9M km',
        distanceMiles: '141.6M mi',
        orbitalPeriod: '687 Earth Days (1.88 yrs)',
        solarFact: 'Home to Olympus Mons (tallest solar volcano) and dramatic polar ice caps.',
      },
      {
        name: 'Jupiter',
        radius: 242,
        duration: 68,
        startAngle: 220,
        size: 16,
        color: '#fbbf24',
        accentColor: '#b45309',
        category: 'Gas Giant Monarch',
        orbitalSpeedKmS: '13.1 km/s',
        orbitalSpeedMph: '29,300 mph',
        distanceAU: '5.20 AU',
        distanceKm: '778.5M km',
        distanceMiles: '483.8M mi',
        orbitalPeriod: '11.86 Earth Years',
        solarFact: 'Holds 2.5x the mass of all other planets combined, with 95 known moons.',
      },
      {
        name: 'Saturn',
        radius: 292,
        duration: 92,
        startAngle: 340,
        size: 13,
        color: '#fef08a',
        accentColor: '#ca8a04',
        hasRings: true,
        category: 'Gas Giant (Ringed)',
        orbitalSpeedKmS: '9.7 km/s',
        orbitalSpeedMph: '21,700 mph',
        distanceAU: '9.58 AU',
        distanceKm: '1.43 Billion km',
        distanceMiles: '886M mi',
        orbitalPeriod: '29.45 Earth Years',
        solarFact: 'Encircled by 7 concentric ring groups composed of billions of water-ice shards.',
      },
      {
        name: 'Uranus',
        radius: 342,
        duration: 124,
        startAngle: 140,
        size: 10.5,
        color: '#22d3ee',
        accentColor: '#0891b2',
        category: 'Ice Giant',
        orbitalSpeedKmS: '6.8 km/s',
        orbitalSpeedMph: '15,200 mph',
        distanceAU: '19.2 AU',
        distanceKm: '2.87 Billion km',
        distanceMiles: '1.78B mi',
        orbitalPeriod: '84.0 Earth Years',
        solarFact: 'Extreme 97.8° axial tilt makes it rotate virtually sideways around the Sun.',
      },
      {
        name: 'Neptune',
        radius: 390,
        duration: 160,
        startAngle: 15,
        size: 10.5,
        color: '#818cf8',
        accentColor: '#4f46e5',
        category: 'Ice Giant',
        orbitalSpeedKmS: '5.4 km/s',
        orbitalSpeedMph: '12,100 mph',
        distanceAU: '30.1 AU',
        distanceKm: '4.50 Billion km',
        distanceMiles: '2.79B mi',
        orbitalPeriod: '164.8 Earth Years',
        solarFact: 'Deep blue methane atmosphere experiencing supersonic winds up to 2,100 km/h.',
      },
    ],
    []
  );

  // Background astral star dust particles with deterministic distribution
  const stars = useMemo(() => {
    const list = [];
    for (let i = 0; i < 48; i++) {
      const angle = (i * 137.5) * (Math.PI / 180);
      const dist = 60 + ((i * 37) % 340);
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      const r = i % 5 === 0 ? 1.8 : i % 2 === 0 ? 1.2 : 0.8;
      const opacity = 0.3 + ((i * 19) % 50) / 100;
      const color =
        i % 7 === 0
          ? '#93c5fd'
          : i % 11 === 0
          ? '#fef08a'
          : i % 13 === 0
          ? '#f472b6'
          : '#ffffff';
      const delay = (i % 6) * 0.7;
      list.push({ id: `star-${i}`, x, y, r, opacity, color, delay });
    }
    return list;
  }, []);

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center select-none overflow-visible z-0 almanac-solar-container ${
        isPaused ? 'almanac-solar-paused' : ''
      } ${className}`}
      onMouseEnter={() => setIsContainerHovered(true)}
      onMouseLeave={() => {
        setIsContainerHovered(false);
        setHoveredPlanet(null);
      }}
      aria-label="Interactive Live Solar System"
    >
      {/* 1. Deep Celestial Nebula Ambient Glows */}
      <div
        className="absolute w-[600px] h-[600px] sm:w-[760px] sm:h-[760px] rounded-full blur-3xl opacity-50 animate-pulse pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, rgba(245,158,11,0.22) 35%, rgba(59,130,246,0.18) 60%, transparent 75%)`,
          animationDuration: '6s',
        }}
      />
      <div
        className="absolute w-[450px] h-[450px] rounded-full blur-2xl opacity-40 animate-pulse pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(254,240,138,0.3) 0%, rgba(245,158,11,0.25) 45%, transparent 70%)`,
          animationDuration: '4.5s',
          animationDelay: '1.5s',
        }}
      />

      {/* 2. Twinkling Star Dust in Deep Orbit Space */}
      <svg
        className="absolute w-[800px] h-[800px] pointer-events-none overflow-visible opacity-75"
        viewBox="-400 -400 800 800"
      >
        {stars.map((s) => (
          <circle
            key={s.id}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={s.color}
            opacity={s.opacity}
            className="animate-pulse"
            style={{ animationDelay: `${s.delay}s`, animationDuration: '3s' }}
          />
        ))}
      </svg>

      {/* 3. THE GLOWING SUN AT THE CENTER (Luminous Epicenter) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
        {/* Expansive Outer Solar Atmosphere Glow */}
        <div
          className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full blur-xl pointer-events-none animate-pulse"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(254,240,138,0.7) 25%, rgba(245,158,11,0.45) 55%, rgba(234,88,12,0.18) 75%, transparent 85%)',
            animationDuration: '3.6s',
          }}
        />

        {/* Rotating Radiant Solar Flare Rays */}
        <div
          className="absolute w-60 h-60 pointer-events-none animate-spin-celestial"
          style={{
            animationDuration: '50s',
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible opacity-65">
            <defs>
              <linearGradient id="solarRayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="35%" stopColor="#fef08a" stopOpacity="0.75" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map(
              (deg, idx) => (
                <line
                  key={`ray-${deg}`}
                  x1="100"
                  y1={idx % 2 === 0 ? '48' : '58'}
                  x2="100"
                  y2={idx % 2 === 0 ? '12' : '24'}
                  stroke="url(#solarRayGrad)"
                  strokeWidth={idx % 2 === 0 ? '2.5' : '1.5'}
                  strokeLinecap="round"
                  transform={`rotate(${deg} 100 100)`}
                />
              )
            )}
          </svg>
        </div>

        {/* Dense Solar Photosphere Disc */}
        <div
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full relative flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.85)] border border-amber-300/40"
          style={{
            background:
              'radial-gradient(circle, #ffffff 0%, #fffbeb 20%, #fde047 50%, #f59e0b 80%, #ea580c 100%)',
          }}
        >
          {/* Solar Core Highlight glint */}
          <div className="w-14 h-14 rounded-full bg-white/70 blur-xs" />
        </div>
      </div>

      {/* 4. PLANETARY ORBIT TRACKS AND REAL-TIME ORBITING PLANETS WITH INTERACTIVE HOVER TOOLTIPS */}
      {planets.map((planet) => {
        const diameter = planet.radius * 2;
        const isThisPlanetHovered = hoveredPlanet === planet.name;

        return (
          <div
            key={planet.name}
            className="absolute top-1/2 left-1/2 rounded-full almanac-orbit-track pointer-events-none"
            style={{
              width: `${diameter}px`,
              height: `${diameter}px`,
              marginLeft: `-${planet.radius}px`,
              marginTop: `-${planet.radius}px`,
              // Primary Orbital Rotation (Keplerian Track)
              animation: `almanac-orbit ${planet.duration}s linear infinite`,
              animationPlayState: isPaused ? 'paused' : 'running',
              transformOrigin: 'center center',
            }}
          >
            {/* Visual Orbit Track Line (Delicate Semi-Transparent Celestial Guide) */}
            <div
              className={`absolute inset-0 rounded-full border border-dashed transition-all duration-300 ${
                isThisPlanetHovered
                  ? 'border-white/60 shadow-[0_0_15px_rgba(255,255,255,0.4)] opacity-100'
                  : 'opacity-40'
              }`}
              style={{
                borderColor: isThisPlanetHovered ? planet.color : `${planet.color}35`,
                borderWidth: isThisPlanetHovered ? '1.5px' : '1px',
                boxShadow: isThisPlanetHovered
                  ? `0 0 16px ${planet.color}80`
                  : `0 0 8px ${planet.color}15`,
              }}
            />

            {/* Orbit Node Anchor (Positioned exactly on the perimeter at top 12 o'clock) */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto almanac-counter-node"
              style={{
                // Counter-rotation so the planet body and its name label remain strictly upright and legible
                animation: `almanac-counter-orbit ${planet.duration}s linear infinite`,
                animationPlayState: isPaused ? 'paused' : 'running',
                transformOrigin: 'center center',
              }}
            >
              {/* Planetary Entity & Dynamic Name Label Group */}
              <div
                className="group relative flex items-center gap-1.5 cursor-pointer py-1.5 px-2"
                onMouseEnter={() => setHoveredPlanet(planet.name)}
                onMouseLeave={() => setHoveredPlanet(null)}
                title={`${planet.name} • Speed: ${planet.orbitalSpeedKmS} • Distance: ${planet.distanceAU}`}
              >
                {/* 1. Realistic Planet Sphere Body */}
                <div className="relative flex items-center justify-center shrink-0">
                  {/* Atmospheric Glow Aura */}
                  <div
                    className={`absolute rounded-full blur-xs pointer-events-none transition-transform duration-300 ${
                      isThisPlanetHovered ? 'scale-175 opacity-90' : 'group-hover:scale-150 opacity-45'
                    }`}
                    style={{
                      width: `${planet.size * 1.8}px`,
                      height: `${planet.size * 1.8}px`,
                      backgroundColor: planet.color,
                    }}
                  />

                  {/* Planet Core Sphere */}
                  <div
                    className={`rounded-full relative overflow-visible shadow-md transition-transform duration-300 ${
                      isThisPlanetHovered ? 'scale-135 ring-2 ring-white/80' : 'group-hover:scale-125'
                    }`}
                    style={{
                      width: `${planet.size}px`,
                      height: `${planet.size}px`,
                      background:
                        planet.name === 'Earth'
                          ? 'radial-gradient(circle at 35% 35%, #93c5fd 0%, #0284c7 40%, #047857 70%, #0f172a 100%)'
                          : planet.name === 'Mars'
                          ? 'radial-gradient(circle at 35% 35%, #fecdd3 0%, #fb7185 35%, #e11d48 70%, #4c0519 100%)'
                          : planet.name === 'Venus'
                          ? 'radial-gradient(circle at 35% 35%, #fef9c3 0%, #fde047 40%, #d97706 75%, #78350f 100%)'
                          : planet.name === 'Mercury'
                          ? 'radial-gradient(circle at 35% 35%, #f1f5f9 0%, #94a3b8 50%, #475569 80%, #1e293b 100%)'
                          : planet.name === 'Jupiter'
                          ? 'linear-gradient(180deg, #d97706 0%, #fef3c7 20%, #b45309 38%, #fef3c7 52%, #b45309 72%, #78350f 100%)'
                          : planet.name === 'Saturn'
                          ? 'radial-gradient(circle at 35% 35%, #fef9c3 0%, #fde047 45%, #ca8a04 80%, #713f12 100%)'
                          : planet.name === 'Uranus'
                          ? 'radial-gradient(circle at 35% 35%, #cffafe 0%, #22d3ee 45%, #0891b2 80%, #164e63 100%)'
                          : 'radial-gradient(circle at 35% 35%, #e0e7ff 0%, #818cf8 45%, #4338ca 80%, #1e1b4b 100%)',
                      boxShadow: `0 0 8px ${planet.color}80, inset -1px -1px 2px rgba(0,0,0,0.6)`,
                    }}
                  >
                    {/* Jupiter Great Red Spot */}
                    {planet.name === 'Jupiter' && (
                      <div className="absolute bottom-1 right-0.5 w-1.5 h-1 rounded-full bg-rose-600/90 shadow-xs" />
                    )}

                    {/* Mars Northern Polar Ice Cap */}
                    {planet.name === 'Mars' && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-0.5 rounded-full bg-white/90" />
                    )}

                    {/* Earth Orbiting Moon */}
                    {planet.hasMoon && (
                      <div
                        className="absolute top-1/2 left-1/2 w-6 h-6 -ml-3 -mt-3 rounded-full pointer-events-none"
                        style={{
                          animation: 'almanac-orbit 6s linear infinite',
                          animationPlayState: isPaused ? 'paused' : 'running',
                        }}
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-100 shadow-[0_0_4px_#ffffff]" />
                      </div>
                    )}
                  </div>

                  {/* Saturn 3D Planetary Ring System */}
                  {planet.hasRings && (
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      style={{
                        width: `${planet.size * 2.6}px`,
                        height: `${planet.size * 0.9}px`,
                        borderRadius: '50%',
                        border: '2px solid rgba(254, 240, 138, 0.85)',
                        borderTopColor: 'rgba(202, 138, 4, 0.95)',
                        borderBottomColor: 'rgba(254, 240, 138, 0.65)',
                        transform: 'rotate(-25deg)',
                        boxShadow: '0 0 6px rgba(254, 240, 138, 0.5)',
                      }}
                    />
                  )}
                </div>

                {/* 2. DYNAMIC PLANET NAME LABEL (Moving alongside the planet on its orbit path) */}
                <div
                  className={`px-1.5 py-0.5 rounded-full backdrop-blur-md border shadow-[0_2px_10px_rgba(0,0,0,0.85)] flex items-center gap-1 transition-all duration-200 ${
                    isThisPlanetHovered
                      ? 'scale-115 bg-slate-900 border-white/60 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                      : 'bg-slate-950/85 border-white/20 group-hover:scale-110 group-hover:bg-slate-900 group-hover:border-white/40'
                  }`}
                  style={{
                    boxShadow: `0 0 12px ${planet.color}35, 0 2px 6px rgba(0,0,0,0.9)`,
                  }}
                >
                  {/* Planet Color Indicator Pip */}
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 shadow-xs animate-pulse"
                    style={{ backgroundColor: planet.color }}
                  />
                  {/* Planet Name */}
                  <span
                    className="text-[8px] sm:text-[9px] font-mono font-extrabold tracking-wider text-slate-100 uppercase"
                    style={{
                      textShadow: `0 0 8px ${planet.color}80`,
                    }}
                  >
                    {planet.name}
                  </span>
                </div>

                {/* 3. INTERACTIVE HOVER TOOLTIP (Displaying Orbital Speed, Distance Facts & Telemetry) */}
                {(isThisPlanetHovered || hoveredPlanet === planet.name) && (
                  <div
                    className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 sm:w-72 p-3 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-white/25 shadow-[0_15px_40px_rgba(0,0,0,0.95),0_0_25px_rgba(0,0,0,0.8)] pointer-events-auto z-50 text-left transition-all duration-200 animate-in fade-in zoom-in-95"
                    style={{
                      boxShadow: `0 20px 45px rgba(0,0,0,0.9), 0 0 30px ${planet.color}30`,
                    }}
                  >
                    {/* Downward pointer triangle */}
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2.5 h-2.5 rotate-45 bg-slate-950 border-r border-b border-white/25"
                    />

                    {/* Tooltip Header */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor]"
                          style={{ backgroundColor: planet.color, color: planet.color }}
                        />
                        <span className="text-xs font-black text-white tracking-wide uppercase">
                          {planet.name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-white/10 text-slate-300 font-semibold">
                          {planet.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[8px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                        <span>PAUSED</span>
                      </div>
                    </div>

                    {/* Telemetry Fact Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {/* Orbital Speed Metric */}
                      <div className="p-2 rounded-xl bg-slate-900/90 border border-amber-500/25">
                        <div className="flex items-center gap-1 text-[9px] font-mono font-semibold text-amber-300 uppercase tracking-wider mb-0.5">
                          <span>🚀</span>
                          <span>Orbital Speed</span>
                        </div>
                        <div className="text-xs sm:text-sm font-mono font-black text-amber-100">
                          {planet.orbitalSpeedKmS}
                        </div>
                        <div className="text-[8.5px] font-mono text-slate-400">
                          {planet.orbitalSpeedMph}
                        </div>
                      </div>

                      {/* Distance from Sun Metric */}
                      <div className="p-2 rounded-xl bg-slate-900/90 border border-cyan-500/25">
                        <div className="flex items-center gap-1 text-[9px] font-mono font-semibold text-cyan-300 uppercase tracking-wider mb-0.5">
                          <span>☀️</span>
                          <span>Sun Distance</span>
                        </div>
                        <div className="text-xs sm:text-sm font-mono font-black text-cyan-100">
                          {planet.distanceAU}
                        </div>
                        <div className="text-[8.5px] font-mono text-slate-400">
                          {planet.distanceKm}
                        </div>
                      </div>
                    </div>

                    {/* Orbital Period Row */}
                    <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-mono mb-2">
                      <span className="text-slate-400 flex items-center gap-1">
                        <span>⏱️</span>
                        <span>Orbital Period:</span>
                      </span>
                      <span className="font-bold text-slate-200">
                        {planet.orbitalPeriod}
                      </span>
                    </div>

                    {/* Astronomical Fact */}
                    <p className="text-[9px] text-slate-300/90 leading-relaxed italic px-1 pb-1">
                      "{planet.solarFact}"
                    </p>

                    {/* Footer helper note */}
                    <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[8px] font-mono text-slate-400">
                      <span className="flex items-center gap-1 text-slate-400">
                        <span>🌌</span>
                        <span>Orbit resumes on mouse leave</span>
                      </span>
                      <span className="text-indigo-300 font-semibold">Keplerian Model</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Embedded Hardware-Accelerated CSS Keyframes for Keplerian Rotation & Counter-Rotation */}
      <style>{`
        @keyframes almanac-orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes almanac-counter-orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        .almanac-solar-container:hover .almanac-orbit-track,
        .almanac-solar-container:hover .almanac-counter-node,
        .almanac-solar-paused .almanac-orbit-track,
        .almanac-solar-paused .almanac-counter-node {
          animation-play-state: paused !important;
        }
      `}</style>
    </div>
  );
};
