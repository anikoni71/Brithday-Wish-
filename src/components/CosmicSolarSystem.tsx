import React, { useMemo } from 'react';

/**
 * CosmicSolarSystem
 * A high-performance, cinematic live space background featuring:
 * - A blazing, multi-layered solar core with pulsing coronal flares and glowing aura
 * - Realistic orbiting planets (Mercury, Venus, Earth with orbiting Moon, Mars, Jupiter with cloud bands & Great Red Spot, Saturn with 3D rings)
 * - Deep space nebulae, galaxy spiral, twinkling starfield, and passing comets
 * - Pure SVG & hardware-accelerated declarative animations with zero DOM layout shifts
 */
export const CosmicSolarSystem: React.FC = () => {
  // Generate random twinkling starfield with fixed deterministic seeds for stability
  const stars = useMemo(() => {
    const starList = [];
    const count = 90;
    for (let i = 0; i < count; i++) {
      // Pseudo-random deterministic distribution across 1000x800 canvas
      const seed1 = (i * 137.5) % 1;
      const seed2 = (i * 293.7) % 1;
      const seed3 = (i * 419.1) % 1;

      const x = Math.floor(seed1 * 1000);
      const y = Math.floor(seed2 * 740) + 10;
      const r = seed3 > 0.85 ? 2.2 : seed3 > 0.5 ? 1.4 : 0.9;
      const opacity = 0.35 + seed2 * 0.55;
      const animType = i % 4; // 0, 1, 2, 3 for staggered twinkle
      const color =
        i % 7 === 0
          ? '#93c5fd' // Blue-white
          : i % 11 === 0
          ? '#fef08a' // Warm gold
          : i % 13 === 0
          ? '#f472b6' // Nebula pink
          : '#ffffff';

      starList.push({ id: `star-${i}`, x, y, r, opacity, animType, color });
    }
    return starList;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Deep Galactic Nebula Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,rgba(99,102,241,0.18)_0%,rgba(15,23,42,0.0)_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(6,182,212,0.12)_0%,rgba(15,23,42,0.0)_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(236,72,153,0.10)_0%,rgba(15,23,42,0.0)_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_75%,rgba(16,185,129,0.08)_0%,rgba(15,23,42,0.0)_70%)]" />

      {/* SVG Cosmic Solar System Canvas */}
      <svg
        viewBox="0 0 1000 800"
        className="w-full h-full object-cover sm:object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.9)]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Solar Core & Corona Gradients */}
          <radialGradient id="sunCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#fffbeb" stopOpacity="1" />
            <stop offset="65%" stopColor="#fef08a" stopOpacity="1" />
            <stop offset="85%" stopColor="#f59e0b" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0.8" />
          </radialGradient>

          <radialGradient id="sunAuraGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
            <stop offset="25%" stopColor="#f59e0b" stopOpacity="0.45" />
            <stop offset="55%" stopColor="#ea580c" stopOpacity="0.2" />
            <stop offset="80%" stopColor="#e11d48" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Planet Gradients */}
          {/* Mercury */}
          <radialGradient id="mercuryGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="85%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </radialGradient>

          {/* Venus */}
          <radialGradient id="venusGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="45%" stopColor="#fde047" />
            <stop offset="75%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>

          {/* Earth */}
          <radialGradient id="earthGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="30%" stopColor="#38bdf8" />
            <stop offset="55%" stopColor="#0284c7" />
            <stop offset="75%" stopColor="#047857" />
            <stop offset="90%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Moon */}
          <radialGradient id="moonGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#475569" />
          </radialGradient>

          {/* Mars */}
          <radialGradient id="marsGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fecdd3" />
            <stop offset="35%" stopColor="#fb7185" />
            <stop offset="65%" stopColor="#e11d48" />
            <stop offset="85%" stopColor="#9f1239" />
            <stop offset="100%" stopColor="#4c0519" />
          </radialGradient>

          {/* Jupiter Stripes */}
          <linearGradient id="jupiterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="18%" stopColor="#fef3c7" />
            <stop offset="32%" stopColor="#b45309" />
            <stop offset="48%" stopColor="#fed7aa" />
            <stop offset="62%" stopColor="#c2410c" />
            <stop offset="78%" stopColor="#ffedd5" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>

          {/* Saturn Body */}
          <radialGradient id="saturnGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#fde047" />
            <stop offset="75%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#713f12" />
          </radialGradient>

          {/* Saturn Rings */}
          <linearGradient id="saturnRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="15%" stopColor="#fef08a" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#ca8a04" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#713f12" stopOpacity="0.3" />
            <stop offset="65%" stopColor="#fde047" stopOpacity="0.8" />
            <stop offset="85%" stopColor="#ca8a04" stopOpacity="0.65" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Solar Glow Filters */}
          <filter id="solarCoreGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Planet Atmosphere Rim Filter */}
          <filter id="planetAtmosphere" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
            <feOffset dx="-1" dy="-1" result="offset" />
            <feFlood floodColor="#38bdf8" floodOpacity="0.5" />
            <feComposite in2="offset" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Elliptical Planetary Orbit Paths around the Sun (cx=500, cy=240) */}
          <path
            id="orbitMercuryPath"
            d="M 500,165 a 105,45 0 1,0 0.1,0 Z"
            fill="none"
          />
          <path
            id="orbitVenusPath"
            d="M 500,140 a 160,65 0 1,0 0.1,0 Z"
            fill="none"
          />
          <path
            id="orbitEarthPath"
            d="M 500,115 a 225,90 0 1,0 0.1,0 Z"
            fill="none"
          />
          <path
            id="orbitMarsPath"
            d="M 500,90 a 290,115 0 1,0 0.1,0 Z"
            fill="none"
          />
          <path
            id="orbitJupiterPath"
            d="M 500,60 a 375,145 0 1,0 0.1,0 Z"
            fill="none"
          />
          <path
            id="orbitSaturnPath"
            d="M 500,30 a 465,178 0 1,0 0.1,0 Z"
            fill="none"
          />

          {/* Comet Tail Gradient */}
          <linearGradient id="cometTailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#818cf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. DISTANT COSMIC STARFIELD */}
        <g className="cosmic-stars-layer">
          {stars.map((star) => (
            <circle
              key={star.id}
              cx={star.x}
              cy={star.y}
              r={star.r}
              fill={star.color}
              opacity={star.opacity}
              className={`cosmic-twinkle-${star.animType}`}
            />
          ))}
        </g>

        {/* 2. DISTANT SPIRAL GALAXY (Deep Upper-Right Space) */}
        <g transform="translate(860, 110) rotate(-22)" opacity="0.45" className="cosmic-galaxy-swirl">
          <ellipse cx="0" cy="0" rx="42" ry="14" fill="url(#sunAuraGrad)" />
          <path
            d="M -30,-4 C -20,-12 0,-8 18,-2 C 30,2 38,10 24,14 C 10,18 -10,12 -24,4 Z"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="1.5"
            opacity="0.6"
            strokeDasharray="4 3"
          />
          <circle cx="0" cy="0" r="3" fill="#ffffff" filter="url(#solarCoreGlow)" />
        </g>

        {/* 3. SHOOTING STARS / COMETS IN TRANSIT */}
        <g className="cosmic-shooting-comet-1">
          <line x1="120" y1="60" x2="190" y2="120" stroke="url(#cometTailGrad)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="190" cy="120" r="2.5" fill="#ffffff" filter="url(#solarCoreGlow)" />
        </g>

        <g className="cosmic-shooting-comet-2">
          <line x1="720" y1="40" x2="810" y2="105" stroke="url(#cometTailGrad)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="810" cy="105" r="3" fill="#ffffff" filter="url(#solarCoreGlow)" />
        </g>

        {/* 4. PLANETARY ORBIT TRACKS (Subtle Translucent Ellipses centered at cx=500, cy=240) */}
        <g opacity="0.22" className="cosmic-orbit-tracks">
          {/* Mercury Track */}
          <ellipse cx="500" cy="240" rx="105" ry="45" fill="none" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="3 5" />
          {/* Venus Track */}
          <ellipse cx="500" cy="240" rx="160" ry="65" fill="none" stroke="#fde047" strokeWidth="0.8" strokeDasharray="3 6" />
          {/* Earth Track */}
          <ellipse cx="500" cy="240" rx="225" ry="90" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 7" />
          {/* Mars Track */}
          <ellipse cx="500" cy="240" rx="290" ry="115" fill="none" stroke="#f87171" strokeWidth="0.8" strokeDasharray="3 6" />
          {/* Jupiter Track */}
          <ellipse cx="500" cy="240" rx="375" ry="145" fill="none" stroke="#fbbf24" strokeWidth="1.1" strokeDasharray="5 8" />
          {/* Saturn Track */}
          <ellipse cx="500" cy="240" rx="465" ry="178" fill="none" stroke="#fcd34d" strokeWidth="1" strokeDasharray="4 8" />
        </g>

        {/* 5. THE CENTRAL GLOWING SUN (Luminous Cosmic Heart) */}
        <g id="cosmicSun" transform="translate(500, 240)">
          {/* Expansive Deep Solar Aura Glow */}
          <circle cx="0" cy="0" r="140" fill="url(#sunAuraGrad)" className="cosmic-sun-aura-pulse" />
          <circle cx="0" cy="0" r="95" fill="url(#sunAuraGrad)" className="cosmic-sun-aura-inner" />

          {/* Rotating Solar Flares & Coronal Rays */}
          <g className="cosmic-solar-rays">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={`flare-${deg}`}
                x1="0"
                y1="-32"
                x2="0"
                y2="-58"
                stroke="#f59e0b"
                strokeWidth={deg % 60 === 0 ? '3.5' : '1.8'}
                strokeLinecap="round"
                opacity={deg % 60 === 0 ? '0.75' : '0.45'}
                transform={`rotate(${deg})`}
              />
            ))}
          </g>

          {/* Photosphere Flare Edge */}
          <circle cx="0" cy="0" r="36" fill="#ea580c" opacity="0.6" filter="url(#solarCoreGlow)" className="cosmic-sun-photosphere" />

          {/* Blazing Incandescent Solar Core */}
          <circle cx="0" cy="0" r="30" fill="url(#sunCoreGrad)" filter="url(#solarCoreGlow)" className="cosmic-sun-core" />
          <circle cx="0" cy="0" r="18" fill="#ffffff" opacity="0.95" />
        </g>

        {/* 6. ORBITING PLANETS (Continuous Smooth Parametric Motion) */}
        {/* Planet 1: Mercury */}
        <g className="cosmic-planet-group">
          <g>
            <animateMotion dur="20s" repeatCount="indefinite">
              <mpath href="#orbitMercuryPath" />
            </animateMotion>
            {/* Mercury Body */}
            <circle cx="0" cy="0" r="4.2" fill="url(#mercuryGrad)" />
            {/* Cratered glint highlight */}
            <circle cx="-1" cy="-1" r="1.2" fill="#ffffff" opacity="0.5" />
          </g>
        </g>

        {/* Planet 2: Venus */}
        <g className="cosmic-planet-group">
          <g>
            <animateMotion dur="32s" repeatCount="indefinite">
              <mpath href="#orbitVenusPath" />
            </animateMotion>
            {/* Venus Atmosphere Glow */}
            <circle cx="0" cy="0" r="7.5" fill="#fde047" opacity="0.25" filter="url(#solarCoreGlow)" />
            {/* Venus Body */}
            <circle cx="0" cy="0" r="6" fill="url(#venusGrad)" />
            {/* Crescent cloud highlight */}
            <path d="M -3,-4 A 5 5 0 0 1 3,3 A 5 5 0 0 0 -3,-4 Z" fill="#ffffff" opacity="0.4" />
          </g>
        </g>

        {/* Planet 3: Earth & Orbiting Moon */}
        <g className="cosmic-planet-group">
          <g>
            <animateMotion dur="48s" repeatCount="indefinite">
              <mpath href="#orbitEarthPath" />
            </animateMotion>
            {/* Earth Blue Atmospheric Glow Ring */}
            <circle cx="0" cy="0" r="10" fill="#38bdf8" opacity="0.3" filter="url(#solarCoreGlow)" />
            {/* Earth Ocean & Continents */}
            <circle cx="0" cy="0" r="8" fill="url(#earthGrad)" />
            {/* Continents Pattern */}
            <path
              d="M -4,-2 C -3,1 0,1 1,-1 C 2,-3 5,-2 4,1 C 3,4 0,4 -2,3 C -4,2 -5,-1 -4,-2 Z"
              fill="#10b981"
              opacity="0.8"
            />
            {/* Swirling Cloud Bands */}
            <path
              d="M -6,-3 C -2,-5 2,-2 6,-3 M -7,1 C -3,2 2,0 6,2"
              stroke="#ffffff"
              strokeWidth="1.2"
              fill="none"
              opacity="0.7"
              strokeLinecap="round"
            />
            {/* Miniature Orbiting Moon (Luna) */}
            <g className="cosmic-moon-orbit-system">
              <g transform="translate(14, -2)">
                <circle cx="0" cy="0" r="2" fill="url(#moonGrad)" />
              </g>
            </g>
          </g>
        </g>

        {/* Planet 4: Mars (The Red Planet) */}
        <g className="cosmic-planet-group">
          <g>
            <animateMotion dur="64s" repeatCount="indefinite">
              <mpath href="#orbitMarsPath" />
            </animateMotion>
            {/* Mars Atmospheric Glow */}
            <circle cx="0" cy="0" r="6.8" fill="#fb7185" opacity="0.25" filter="url(#solarCoreGlow)" />
            {/* Mars Body */}
            <circle cx="0" cy="0" r="5.2" fill="url(#marsGrad)" />
            {/* White Polar Ice Cap */}
            <circle cx="-1.5" cy="-3.5" r="1.3" fill="#ffffff" opacity="0.85" />
          </g>
        </g>

        {/* Planet 5: Jupiter (Gas Giant with Red Spot) */}
        <g className="cosmic-planet-group">
          <g>
            <animateMotion dur="88s" repeatCount="indefinite">
              <mpath href="#orbitJupiterPath" />
            </animateMotion>
            {/* Jupiter Outer Gravity Glow */}
            <circle cx="0" cy="0" r="18" fill="#f59e0b" opacity="0.2" filter="url(#solarCoreGlow)" />
            {/* Striped Gas Giant Sphere */}
            <circle cx="0" cy="0" r="14" fill="url(#jupiterGrad)" />
            {/* Clip path for 3D sphere shading */}
            <ellipse cx="3" cy="2" rx="3.5" ry="2.2" fill="#991b1b" opacity="0.9" /> {/* Great Red Spot */}
            <circle cx="3" cy="2" r="1.5" fill="#f87171" opacity="0.8" />
            {/* Shadow edge on nightside */}
            <path
              d="M 0,-14 A 14 14 0 0 1 14,0 A 14 14 0 0 1 0,14 A 14 14 0 0 0 0,-14 Z"
              fill="#0f172a"
              opacity="0.38"
            />
          </g>
        </g>

        {/* Planet 6: Saturn (Encircled by 3D Rings) */}
        <g className="cosmic-planet-group">
          <g>
            <animateMotion dur="118s" repeatCount="indefinite">
              <mpath href="#orbitSaturnPath" />
            </animateMotion>
            {/* Saturn Back Half of Rings */}
            <g transform="rotate(-18)">
              <ellipse cx="0" cy="0" rx="26" ry="8" fill="none" stroke="url(#saturnRingGrad)" strokeWidth="4.5" opacity="0.85" />
            </g>
            {/* Saturn Globe Body */}
            <circle cx="0" cy="0" r="10.5" fill="url(#saturnGrad)" />
            {/* Saturn Shadow cast by planet on front rings */}
            <g transform="rotate(-18)">
              {/* Front Half of Rings passing over the planet */}
              <path
                d="M -26,0 A 26 8 0 0 0 26,0"
                fill="none"
                stroke="url(#saturnRingGrad)"
                strokeWidth="4.5"
                opacity="0.95"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};
