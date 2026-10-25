import React, { useMemo } from 'react';

/**
 * CosmicSolarSystem
 * A breathtaking, cinematic live cosmic background featuring:
 * - A dual gravitational celestial center:
 *   1. Radiant central Sun with blazing thermonuclear core, coronal flares, magnetic loops, and solar aura.
 *   2. Dynamic Black Hole with pitch-black event horizon, photon ring, relativistic swirling accretion disk,
 *      gravitational lensing distortion rings, and polar relativistic plasma jets.
 *   3. Inter-stellar plasma accretion bridge connecting the gravitational core.
 * - All 8 realistic orbiting planets (Mercury, Venus, Earth with orbiting Moon, Mars, Jupiter with Great Red Spot,
 *   Saturn with 3D tilted rings, Uranus with icy atmosphere & vertical rings, and Neptune with azure storms).
 * - Crystal-clear, upright, high-contrast readable name tags moving dynamically with every single planet.
 * - Deep space nebulae, galaxy spiral, twinkling starfield, and passing comets.
 * - Pure SVG & hardware-accelerated declarative animations with zero DOM layout shifts.
 */
export const CosmicSolarSystem: React.FC = () => {
  // Generate random twinkling starfield with fixed deterministic seeds for stability
  const stars = useMemo(() => {
    const starList = [];
    const count = 110;
    for (let i = 0; i < count; i++) {
      const seed1 = (i * 137.5) % 1;
      const seed2 = (i * 293.7) % 1;
      const seed3 = (i * 419.1) % 1;

      const x = Math.floor(seed1 * 1000);
      const y = Math.floor(seed2 * 750) + 10;
      const r = seed3 > 0.88 ? 2.4 : seed3 > 0.5 ? 1.5 : 0.9;
      const opacity = 0.35 + seed2 * 0.6;
      const animType = i % 4; // 0, 1, 2, 3 for staggered twinkle
      const color =
        i % 5 === 0
          ? '#93c5fd' // Blue-white
          : i % 7 === 0
          ? '#fef08a' // Warm gold
          : i % 11 === 0
          ? '#f472b6' // Nebula pink
          : i % 13 === 0
          ? '#67e8f9' // Cyan star
          : '#ffffff';

      starList.push({ id: `cosmic-star-${i}`, x, y, r, opacity, animType, color });
    }
    return starList;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Deep Galactic Nebula Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,rgba(99,102,241,0.22)_0%,rgba(15,23,42,0.0)_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(6,182,212,0.16)_0%,rgba(15,23,42,0.0)_65%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(236,72,153,0.14)_0%,rgba(15,23,42,0.0)_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_75%,rgba(16,185,129,0.10)_0%,rgba(15,23,42,0.0)_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_28%,rgba(168,85,247,0.18)_0%,rgba(15,23,42,0.0)_55%)]" />

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
            <stop offset="30%" stopColor="#fffbeb" stopOpacity="1" />
            <stop offset="60%" stopColor="#fef08a" stopOpacity="1" />
            <stop offset="82%" stopColor="#f59e0b" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0.85" />
          </radialGradient>

          <radialGradient id="sunAuraGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
            <stop offset="25%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="55%" stopColor="#ea580c" stopOpacity="0.22" />
            <stop offset="80%" stopColor="#e11d48" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Black Hole Accretion Disk Gradient (Relativistic Doppler Beaming) */}
          <linearGradient id="blackHoleAccretionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" /> {/* Blue-shifted high energy */}
            <stop offset="25%" stopColor="#818cf8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0.75" /> {/* Red-shifted receding */}
          </linearGradient>

          <radialGradient id="blackHoleLensingGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="1" />
            <stop offset="65%" stopColor="#000000" stopOpacity="1" />
            <stop offset="78%" stopColor="#c084fc" stopOpacity="0.9" />
            <stop offset="88%" stopColor="#fbbf24" stopOpacity="0.7" />
            <stop offset="96%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Relativistic Plasma Jet Gradient */}
          <linearGradient id="relativisticJetGradUp" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="relativisticJetGradDown" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          {/* Gravitational Plasma Bridge between Sun & Black Hole */}
          <linearGradient id="plasmaBridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#fb7185" stopOpacity="0.65" />
            <stop offset="80%" stopColor="#a855f7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.85" />
          </linearGradient>

          {/* Planet Gradients */}
          {/* 1. Mercury */}
          <radialGradient id="mercuryGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="40%" stopColor="#94a3b8" />
            <stop offset="80%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1e293b" />
          </radialGradient>

          {/* 2. Venus */}
          <radialGradient id="venusGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="45%" stopColor="#fde047" />
            <stop offset="75%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>

          {/* 3. Earth */}
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

          {/* 4. Mars */}
          <radialGradient id="marsGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fecdd3" />
            <stop offset="35%" stopColor="#fb7185" />
            <stop offset="65%" stopColor="#e11d48" />
            <stop offset="85%" stopColor="#9f1239" />
            <stop offset="100%" stopColor="#4c0519" />
          </radialGradient>

          {/* 5. Jupiter Stripes */}
          <linearGradient id="jupiterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="16%" stopColor="#fef3c7" />
            <stop offset="30%" stopColor="#b45309" />
            <stop offset="46%" stopColor="#fed7aa" />
            <stop offset="62%" stopColor="#c2410c" />
            <stop offset="78%" stopColor="#ffedd5" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>

          {/* 6. Saturn Body */}
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

          {/* 7. Uranus (Aquamarine Ice Giant) */}
          <radialGradient id="uranusGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#cffafe" />
            <stop offset="35%" stopColor="#67e8f9" />
            <stop offset="70%" stopColor="#06b6d4" />
            <stop offset="90%" stopColor="#0e7490" />
            <stop offset="100%" stopColor="#164e63" />
          </radialGradient>

          {/* Uranus Vertical Faint Rings */}
          <linearGradient id="uranusRingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="25%" stopColor="#a5f3fc" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#a5f3fc" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* 8. Neptune (Deep Azure Storm Giant) */}
          <radialGradient id="neptuneGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="30%" stopColor="#3b82f6" />
            <stop offset="65%" stopColor="#1d4ed8" />
            <stop offset="85%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>

          {/* Solar & Cosmic Glow Filters */}
          <filter id="solarCoreGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="blackHoleGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="labelBadgeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.9" />
          </filter>

          {/* Elliptical Planetary Orbit Paths around the Dual System (cx=500, cy=240) */}
          {/* Orbit 1: Mercury */}
          <path id="orbitMercuryPath" d="M 500,198 a 100,42 0 1,0 0.1,0 Z" fill="none" />
          {/* Orbit 2: Venus */}
          <path id="orbitVenusPath" d="M 500,178 a 155,62 0 1,0 0.1,0 Z" fill="none" />
          {/* Orbit 3: Earth & Moon */}
          <path id="orbitEarthPath" d="M 500,156 a 215,84 0 1,0 0.1,0 Z" fill="none" />
          {/* Orbit 4: Mars */}
          <path id="orbitMarsPath" d="M 500,132 a 280,108 0 1,0 0.1,0 Z" fill="none" />
          {/* Orbit 5: Jupiter */}
          <path id="orbitJupiterPath" d="M 500,102 a 360,138 0 1,0 0.1,0 Z" fill="none" />
          {/* Orbit 6: Saturn */}
          <path id="orbitSaturnPath" d="M 500,72 a 445,168 0 1,0 0.1,0 Z" fill="none" />
          {/* Orbit 7: Uranus */}
          <path id="orbitUranusPath" d="M 500,44 a 525,196 0 1,0 0.1,0 Z" fill="none" />
          {/* Orbit 8: Neptune */}
          <path id="orbitNeptunePath" d="M 500,18 a 595,222 0 1,0 0.1,0 Z" fill="none" />

          {/* Comet Tail Gradient */}
          <linearGradient id="cometTailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#818cf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          {/* High-Tech Starship Explorer Gradients */}
          <linearGradient id="starshipHullGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="35%" stopColor="#94a3b8" />
            <stop offset="70%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <linearGradient id="starshipIonTrailGrad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#818cf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="starshipWarpTrailGrad" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          {/* Drifting Translucent Nebula Gradients */}
          <radialGradient id="nebulaIndigoGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.28" />
            <stop offset="40%" stopColor="#6366f1" stopOpacity="0.16" />
            <stop offset="75%" stopColor="#3b82f6" stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="nebulaCyanGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
            <stop offset="45%" stopColor="#0284c7" stopOpacity="0.14" />
            <stop offset="75%" stopColor="#0d9488" stopOpacity="0.05" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="nebulaRoseAmberGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.22" />
            <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.12" />
            <stop offset="75%" stopColor="#db2777" stopOpacity="0.04" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="nebulaEmeraldGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.20" />
            <stop offset="45%" stopColor="#059669" stopOpacity="0.10" />
            <stop offset="80%" stopColor="#047857" stopOpacity="0.03" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Nebula Deep Atmospheric Blur Filter */}
          <filter id="nebulaBlurFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="32" />
          </filter>
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
        <g transform="translate(875, 115) rotate(-22)" opacity="0.5" className="cosmic-galaxy-swirl">
          <ellipse cx="0" cy="0" rx="46" ry="16" fill="url(#sunAuraGrad)" />
          <path
            d="M -34,-4 C -22,-14 0,-9 20,-2 C 34,2 42,12 26,16 C 12,20 -12,14 -28,4 Z"
            fill="none"
            stroke="#c084fc"
            strokeWidth="1.8"
            opacity="0.65"
            strokeDasharray="4 3"
          />
          <circle cx="0" cy="0" r="3.5" fill="#ffffff" filter="url(#solarCoreGlow)" />
        </g>

        {/* 3. SHOOTING STARS / COMETS IN TRANSIT */}
        <g className="cosmic-shooting-comet-1">
          <line x1="110" y1="50" x2="185" y2="115" stroke="url(#cometTailGrad)" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="185" cy="115" r="2.5" fill="#ffffff" filter="url(#solarCoreGlow)" />
        </g>

        <g className="cosmic-shooting-comet-2">
          <line x1="740" y1="35" x2="835" y2="105" stroke="url(#cometTailGrad)" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="835" cy="105" r="3" fill="#ffffff" filter="url(#solarCoreGlow)" />
        </g>

        {/* 3.5 HIGH-TECH STARSHIP WARP EXPEDITION (Occasional warp transit through deep background behind planets) */}
        <g className="cosmic-starship-voyager">
          {/* Warp Relativity Distortion Field Ring */}
          <ellipse cx="2" cy="0" rx="28" ry="14" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.35" strokeDasharray="4 4" className="warp-nacelle-glow" />

          {/* Ion & Warp Plasma Trail Streams */}
          <polygon points="-12,-2.5 -12,2.5 -48,0" fill="url(#starshipIonTrailGrad)" className="warp-ion-stream" />
          <line x1="-14" y1="-6.5" x2="-54" y2="-6.5" stroke="url(#starshipWarpTrailGrad)" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="-14" y1="6.5" x2="-54" y2="6.5" stroke="url(#starshipWarpTrailGrad)" strokeWidth="1.4" strokeLinecap="round" />

          {/* Starship Primary Explorer Arrowhead Hull */}
          <path
            d="M 18,0 C 14,-5 6,-7 -2,-6 C -6,-5 -10,-3 -12,0 C -10,3 -6,5 -2,6 C 6,7 14,5 18,0 Z"
            fill="url(#starshipHullGrad)"
            stroke="#64748b"
            strokeWidth="0.6"
          />

          {/* Forward Navigational Deflector Dish Beacon */}
          <circle cx="16" cy="0" r="2.2" fill="#38bdf8" filter="url(#solarCoreGlow)" />
          <circle cx="17" cy="0" r="1.1" fill="#ffffff" />

          {/* Bridge Superstructure Module */}
          <ellipse cx="3" cy="0" rx="4" ry="2.2" fill="#e2e8f0" stroke="#0ea5e9" strokeWidth="0.5" />
          <circle cx="4.5" cy="0" r="1" fill="#38bdf8" />

          {/* Starship Twin Warp Nacelles & Connecting Pylons */}
          {/* Port Nacelle (Upper) */}
          <path d="M -2,-5 L -6,-2" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="-14" y="-8.5" width="17" height="3" rx="1.5" fill="#1e293b" stroke="#64748b" strokeWidth="0.6" />
          <line x1="-12" y1="-7" x2="1" y2="-7" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" className="warp-nacelle-glow" />

          {/* Starboard Nacelle (Lower) */}
          <path d="M -2,5 L -6,2" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="-14" y="5.5" width="17" height="3" rx="1.5" fill="#1e293b" stroke="#64748b" strokeWidth="0.6" />
          <line x1="-12" y1="7" x2="1" y2="7" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" className="warp-nacelle-glow" />
        </g>

        {/* 3.8 SLOWLY DRIFTING TRANSLUCENT NEBULA CLOUDS (Layered behind planets for deep interstellar atmosphere) */}
        <g className="cosmic-nebulae-container pointer-events-none" opacity="0.8">
          {/* Cloud 1: Cosmic Violet-Indigo Veil (Drifting in upper-left quadrant) */}
          <g className="cosmic-nebula-drift-1" filter="url(#nebulaBlurFilter)">
            <path
              d="M 110,170 C 170,110 280,130 350,180 C 410,230 380,310 300,330 C 230,350 140,310 100,250 C 80,210 90,190 110,170 Z"
              fill="url(#nebulaIndigoGrad)"
            />
            <ellipse cx="230" cy="220" rx="100" ry="60" fill="url(#nebulaIndigoGrad)" opacity="0.85" />
          </g>

          {/* Cloud 2: Cyan-Aquamarine Lagoon Nebula (Drifting in mid-right quadrant) */}
          <g className="cosmic-nebula-drift-2" filter="url(#nebulaBlurFilter)">
            <path
              d="M 610,220 C 670,170 790,190 870,230 C 930,270 900,350 820,370 C 740,390 660,350 610,300 C 590,270 590,240 610,220 Z"
              fill="url(#nebulaCyanGrad)"
            />
            <ellipse cx="760" cy="280" rx="105" ry="65" fill="url(#nebulaCyanGrad)" opacity="0.9" />
          </g>

          {/* Cloud 3: Rose-Amber Stellar Emission Nebula (Drifting across upper cosmic core) */}
          <g className="cosmic-nebula-drift-3" filter="url(#nebulaBlurFilter)">
            <path
              d="M 430,100 C 500,60 610,80 670,120 C 730,160 700,210 630,220 C 560,230 480,200 430,160 C 410,130 410,110 430,100 Z"
              fill="url(#nebulaRoseAmberGrad)"
            />
            <ellipse cx="550" cy="140" rx="90" ry="50" fill="url(#nebulaRoseAmberGrad)" opacity="0.8" />
          </g>

          {/* Cloud 4: Deep Emerald Aurora Drift (Lower sector deep expanse) */}
          <g className="cosmic-nebula-drift-4" filter="url(#nebulaBlurFilter)">
            <ellipse cx="370" cy="340" rx="120" ry="70" fill="url(#nebulaEmeraldGrad)" opacity="0.75" />
          </g>
        </g>

        {/* 4. PLANETARY ORBIT TRACKS (Ellipses centered at cx=500, cy=240) */}
        <g opacity="0.25" className="cosmic-orbit-tracks">
          {/* Mercury Track */}
          <ellipse cx="500" cy="240" rx="100" ry="42" fill="none" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="3 5" />
          {/* Venus Track */}
          <ellipse cx="500" cy="240" rx="155" ry="62" fill="none" stroke="#fde047" strokeWidth="0.8" strokeDasharray="3 6" />
          {/* Earth Track */}
          <ellipse cx="500" cy="240" rx="215" ry="84" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 7" />
          {/* Mars Track */}
          <ellipse cx="500" cy="240" rx="280" ry="108" fill="none" stroke="#f87171" strokeWidth="0.8" strokeDasharray="3 6" />
          {/* Jupiter Track */}
          <ellipse cx="500" cy="240" rx="360" ry="138" fill="none" stroke="#fbbf24" strokeWidth="1.1" strokeDasharray="5 8" />
          {/* Saturn Track */}
          <ellipse cx="500" cy="240" rx="445" ry="168" fill="none" stroke="#fcd34d" strokeWidth="1" strokeDasharray="4 8" />
          {/* Uranus Track */}
          <ellipse cx="500" cy="240" rx="525" ry="196" fill="none" stroke="#67e8f9" strokeWidth="1" strokeDasharray="4 8" />
          {/* Neptune Track */}
          <ellipse cx="500" cy="240" rx="595" ry="222" fill="none" stroke="#60a5fa" strokeWidth="1.1" strokeDasharray="5 9" />
        </g>

        {/* 5. GRAVITATIONAL ACCRETION STREAM BETWEEN SUN & BLACK HOLE */}
        <g className="cosmic-plasma-bridge" opacity="0.7">
          <path
            d="M 425,236 C 465,224 525,222 575,236 C 530,248 470,246 425,236 Z"
            fill="url(#plasmaBridgeGrad)"
            filter="url(#solarCoreGlow)"
          />
        </g>

        {/* 6. THE CENTRAL GLOWING SUN (Luminous Solar Powerhouse at cx=415, cy=240) */}
        <g id="cosmicSun" transform="translate(415, 240)">
          {/* Deep Solar Aura Glow */}
          <circle cx="0" cy="0" r="115" fill="url(#sunAuraGrad)" className="cosmic-sun-aura-pulse" />
          <circle cx="0" cy="0" r="75" fill="url(#sunAuraGrad)" className="cosmic-sun-aura-inner" />

          {/* Rotating Solar Coronal Flares & Prominence Streamers */}
          <g className="cosmic-solar-rays">
            {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((deg) => (
              <line
                key={`solar-flare-${deg}`}
                x1="0"
                y1="-28"
                x2="0"
                y2="-50"
                stroke="#f59e0b"
                strokeWidth={deg % 48 === 0 ? '3.5' : '1.8'}
                strokeLinecap="round"
                opacity={deg % 48 === 0 ? '0.8' : '0.5'}
                transform={`rotate(${deg})`}
              />
            ))}
          </g>

          {/* Magnetic Arc Loops */}
          <path
            d="M -16,-20 C -22,-32 -4,-34 0,-26 M 14,-18 C 24,-28 32,-14 22,-8"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="1.5"
            opacity="0.75"
            filter="url(#solarCoreGlow)"
          />

          {/* Photosphere Rim */}
          <circle cx="0" cy="0" r="30" fill="#ea580c" opacity="0.7" filter="url(#solarCoreGlow)" className="cosmic-sun-photosphere" />

          {/* Blazing Incandescent Core */}
          <circle cx="0" cy="0" r="25" fill="url(#sunCoreGrad)" filter="url(#solarCoreGlow)" className="cosmic-sun-core" />
          <circle cx="0" cy="0" r="14" fill="#ffffff" opacity="0.95" />

          {/* Sun Identification Badge (Upright) */}
          <g transform="translate(0, 36)" filter="url(#labelBadgeGlow)">
            <rect x="-24" y="-8" width="48" height="16" rx="8" fill="#180e04" fillOpacity="0.88" stroke="#f59e0b" strokeWidth="0.9" />
            <text x="0" y="3" textAnchor="middle" fill="#fef08a" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace" letterSpacing="0.4">
              ☉ SUN
            </text>
          </g>
        </g>

        {/* 7. THE AWE-INSPIRING BLACK HOLE (Singularity with Relativistic Accretion Disk at cx=585, cy=240) */}
        <g id="cosmicBlackHole" transform="translate(585, 240)">
          {/* Relativistic Plasma Jets (Shooting Polar Ejections) */}
          <g className="cosmic-blackhole-polar-jets" filter="url(#blackHoleGlow)">
            {/* North Polar Jet */}
            <polygon points="-3,-10 3,-10 6,-80 -6,-80" fill="url(#relativisticJetGradUp)" opacity="0.75" />
            <line x1="0" y1="-8" x2="0" y2="-95" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
            {/* South Polar Jet */}
            <polygon points="-3,10 3,10 6,80 -6,80" fill="url(#relativisticJetGradDown)" opacity="0.75" />
            <line x1="0" y1="8" x2="0" y2="95" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
          </g>

          {/* Gravitational Lensing Outer Warp Halo */}
          <circle cx="0" cy="0" r="54" fill="url(#blackHoleLensingGrad)" className="cosmic-blackhole-lensing-pulse" />

          {/* Back Arc of Swirling Accretion Disk (Curved Behind Singularity via Gravitational Lensing) */}
          <g className="cosmic-accretion-disk-swirl">
            {/* Top Lensed Light Arch (Interstellar-style gravitational wrap) */}
            <path
              d="M -46,-2 C -46,-32 46,-32 46,-2 C 40,-18 -40,-18 -46,-2 Z"
              fill="url(#blackHoleAccretionGrad)"
              opacity="0.85"
              filter="url(#blackHoleGlow)"
            />
            {/* Bottom Lensed Light Arch */}
            <path
              d="M -44,2 C -44,28 44,28 44,2 C 38,14 -38,14 -44,2 Z"
              fill="url(#blackHoleAccretionGrad)"
              opacity="0.7"
              filter="url(#blackHoleGlow)"
            />
            {/* Main Equatorial Accretion Disk (Tilted Perspective) */}
            <ellipse cx="0" cy="0" rx="48" ry="13" fill="none" stroke="url(#blackHoleAccretionGrad)" strokeWidth="6.5" opacity="0.92" filter="url(#blackHoleGlow)" />
            <ellipse cx="0" cy="0" rx="42" ry="10" fill="none" stroke="#fef08a" strokeWidth="1.8" opacity="0.8" />
          </g>

          {/* Photon Sphere (Ultra-Bright Ring of Trapped Photons) */}
          <circle cx="0" cy="0" r="18.5" fill="none" stroke="#ffffff" strokeWidth="1.8" filter="url(#blackHoleGlow)" className="cosmic-photon-sphere" />
          <circle cx="0" cy="0" r="17" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.9" />

          {/* Pitch-Black Event Horizon (Total Gravitational Light Trap) */}
          <circle cx="0" cy="0" r="16" fill="#000000" stroke="#000000" strokeWidth="1.5" />

          {/* Front Edge of Swirling Accretion Disk passing in front of Event Horizon */}
          <g transform="rotate(-6)">
            <path
              d="M -46,0 A 46 12 0 0 0 46,0"
              fill="none"
              stroke="url(#blackHoleAccretionGrad)"
              strokeWidth="5.5"
              opacity="0.95"
              filter="url(#blackHoleGlow)"
            />
          </g>

          {/* Black Hole Identification Badge (Upright) */}
          <g transform="translate(0, 36)" filter="url(#labelBadgeGlow)">
            <rect x="-38" y="-8" width="76" height="16" rx="8" fill="#070314" fillOpacity="0.88" stroke="#a855f7" strokeWidth="0.9" />
            <text x="0" y="3" textAnchor="middle" fill="#d8b4fe" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace" letterSpacing="0.4">
              🕳 BLACK HOLE
            </text>
          </g>
        </g>

        {/* 8. ORBITING PLANETS (ALL 8 PLANETS WITH REAL-TIME MOTION & UPRIGHT READABLE NAME TAGS) */}
        {/* Note: In SVG animateMotion without rotate="auto", coordinate orientation is preserved (0deg rotation),
            guaranteeing all child text labels and badges stay perfectly horizontal and crystal-clear! */}

        {/* Planet 1: Mercury */}
        <g className="cosmic-planet-group">
          <g>
            <animateMotion dur="20s" repeatCount="indefinite">
              <mpath href="#orbitMercuryPath" />
            </animateMotion>
            {/* Mercury Body */}
            <circle cx="0" cy="0" r="4.8" fill="url(#mercuryGrad)" />
            <circle cx="-1" cy="-1" r="1.2" fill="#ffffff" opacity="0.6" />
            {/* Upright Name Tag */}
            <g transform="translate(0, 16)" filter="url(#labelBadgeGlow)">
              <rect x="-26" y="-7" width="52" height="14" rx="7" fill="#090d16" fillOpacity="0.88" stroke="#94a3b8" strokeWidth="0.8" />
              <text x="0" y="2.5" textAnchor="middle" fill="#e2e8f0" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
                ☿ Mercury
              </text>
            </g>
          </g>
        </g>

        {/* Planet 2: Venus */}
        <g className="cosmic-planet-group">
          <g>
            <animateMotion dur="32s" repeatCount="indefinite">
              <mpath href="#orbitVenusPath" />
            </animateMotion>
            {/* Venus Atmosphere Glow */}
            <circle cx="0" cy="0" r="8.5" fill="#fde047" opacity="0.3" filter="url(#solarCoreGlow)" />
            {/* Venus Body */}
            <circle cx="0" cy="0" r="6.8" fill="url(#venusGrad)" />
            <path d="M -3.5,-4 A 5.5 5.5 0 0 1 3.5,3.5 A 5.5 5.5 0 0 0 -3.5,-4 Z" fill="#ffffff" opacity="0.45" />
            {/* Upright Name Tag */}
            <g transform="translate(0, 18)" filter="url(#labelBadgeGlow)">
              <rect x="-24" y="-7" width="48" height="14" rx="7" fill="#130e05" fillOpacity="0.88" stroke="#fde047" strokeWidth="0.8" />
              <text x="0" y="2.5" textAnchor="middle" fill="#fef08a" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
                ♀ Venus
              </text>
            </g>
          </g>
        </g>

        {/* Planet 3: Earth & Orbiting Moon */}
        <g className="cosmic-planet-group">
          <g>
            <animateMotion dur="46s" repeatCount="indefinite">
              <mpath href="#orbitEarthPath" />
            </animateMotion>
            {/* Earth Blue Atmospheric Glow Ring */}
            <circle cx="0" cy="0" r="11" fill="#38bdf8" opacity="0.35" filter="url(#solarCoreGlow)" />
            {/* Earth Ocean & Continents */}
            <circle cx="0" cy="0" r="8.5" fill="url(#earthGrad)" />
            {/* Continents Pattern */}
            <path
              d="M -4,-2 C -3,1 0,1 1,-1 C 2,-3 5,-2 4,1 C 3,4 0,4 -2,3 C -4,2 -5,-1 -4,-2 Z"
              fill="#10b981"
              opacity="0.85"
            />
            {/* Swirling Cloud Bands */}
            <path
              d="M -6.5,-3 C -2,-5 2,-2 6.5,-3 M -7,1.5 C -3,2.5 2,0.5 6.5,2"
              stroke="#ffffff"
              strokeWidth="1.3"
              fill="none"
              opacity="0.75"
              strokeLinecap="round"
            />
            {/* Miniature Orbiting Moon (Luna) */}
            <g className="cosmic-moon-orbit-system">
              <g transform="translate(15, -2)">
                <circle cx="0" cy="0" r="2.2" fill="url(#moonGrad)" />
              </g>
            </g>
            {/* Upright Name Tag */}
            <g transform="translate(0, 20)" filter="url(#labelBadgeGlow)">
              <rect x="-38" y="-7.5" width="76" height="15" rx="7.5" fill="#03111b" fillOpacity="0.88" stroke="#38bdf8" strokeWidth="0.9" />
              <text x="0" y="2.5" textAnchor="middle" fill="#7dd3fc" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
                ♁ Earth & Moon
              </text>
            </g>
          </g>
        </g>

        {/* Planet 4: Mars (The Red Planet) */}
        <g className="cosmic-planet-group">
          <g>
            <animateMotion dur="62s" repeatCount="indefinite">
              <mpath href="#orbitMarsPath" />
            </animateMotion>
            {/* Mars Atmospheric Glow */}
            <circle cx="0" cy="0" r="7.5" fill="#fb7185" opacity="0.3" filter="url(#solarCoreGlow)" />
            {/* Mars Body */}
            <circle cx="0" cy="0" r="5.8" fill="url(#marsGrad)" />
            {/* White Polar Ice Cap */}
            <circle cx="-1.5" cy="-3.8" r="1.4" fill="#ffffff" opacity="0.9" />
            {/* Upright Name Tag */}
            <g transform="translate(0, 18)" filter="url(#labelBadgeGlow)">
              <rect x="-22" y="-7" width="44" height="14" rx="7" fill="#180408" fillOpacity="0.88" stroke="#fb7185" strokeWidth="0.8" />
              <text x="0" y="2.5" textAnchor="middle" fill="#fca5a5" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
                ♂ Mars
              </text>
            </g>
          </g>
        </g>

        {/* Planet 5: Jupiter (Gas Giant with Great Red Spot) */}
        <g className="cosmic-planet-group">
          <g>
            <animateMotion dur="86s" repeatCount="indefinite">
              <mpath href="#orbitJupiterPath" />
            </animateMotion>
            {/* Jupiter Outer Gravity Glow */}
            <circle cx="0" cy="0" r="19" fill="#f59e0b" opacity="0.22" filter="url(#solarCoreGlow)" />
            {/* Striped Gas Giant Sphere */}
            <circle cx="0" cy="0" r="14.5" fill="url(#jupiterGrad)" />
            {/* Great Red Spot */}
            <ellipse cx="3.5" cy="2.5" rx="3.8" ry="2.4" fill="#991b1b" opacity="0.9" />
            <circle cx="3.5" cy="2.5" r="1.6" fill="#f87171" opacity="0.85" />
            {/* Nightside 3D Crescent Shadow */}
            <path
              d="M 0,-14.5 A 14.5 14.5 0 0 1 14.5,0 A 14.5 14.5 0 0 1 0,14.5 A 14.5 14.5 0 0 0 0,-14.5 Z"
              fill="#0f172a"
              opacity="0.38"
            />
            {/* Upright Name Tag (Positioned above to avoid overlap with large body) */}
            <g transform="translate(0, -21)" filter="url(#labelBadgeGlow)">
              <rect x="-26" y="-7" width="52" height="14" rx="7" fill="#170c04" fillOpacity="0.88" stroke="#f59e0b" strokeWidth="0.9" />
              <text x="0" y="2.5" textAnchor="middle" fill="#fde68a" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
                ♃ Jupiter
              </text>
            </g>
          </g>
        </g>

        {/* Planet 6: Saturn (Encircled by 3D Rings) */}
        <g className="cosmic-planet-group">
          <g>
            <animateMotion dur="114s" repeatCount="indefinite">
              <mpath href="#orbitSaturnPath" />
            </animateMotion>
            {/* Saturn Back Half of Rings */}
            <g transform="rotate(-18)">
              <ellipse cx="0" cy="0" rx="28" ry="8.5" fill="none" stroke="url(#saturnRingGrad)" strokeWidth="4.8" opacity="0.85" />
            </g>
            {/* Saturn Globe Body */}
            <circle cx="0" cy="0" r="11" fill="url(#saturnGrad)" />
            {/* Saturn Front Half of Rings passing over the planet */}
            <g transform="rotate(-18)">
              <path
                d="M -28,0 A 28 8.5 0 0 0 28,0"
                fill="none"
                stroke="url(#saturnRingGrad)"
                strokeWidth="4.8"
                opacity="0.95"
              />
            </g>
            {/* Upright Name Tag (Positioned above rings) */}
            <g transform="translate(0, -20)" filter="url(#labelBadgeGlow)">
              <rect x="-25" y="-7" width="50" height="14" rx="7" fill="#160e03" fillOpacity="0.88" stroke="#ca8a04" strokeWidth="0.9" />
              <text x="0" y="2.5" textAnchor="middle" fill="#fef08a" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
                ♄ Saturn
              </text>
            </g>
          </g>
        </g>

        {/* Planet 7: Uranus (Aquamarine Ice Giant with Vertical Rings) */}
        <g className="cosmic-planet-group">
          <g>
            <animateMotion dur="146s" repeatCount="indefinite">
              <mpath href="#orbitUranusPath" />
            </animateMotion>
            {/* Back half of vertical ice rings */}
            <g transform="rotate(78)">
              <ellipse cx="0" cy="0" rx="19" ry="4" fill="none" stroke="url(#uranusRingGrad)" strokeWidth="2.2" opacity="0.6" />
            </g>
            {/* Uranus Glow */}
            <circle cx="0" cy="0" r="12" fill="#22d3ee" opacity="0.25" filter="url(#solarCoreGlow)" />
            {/* Uranus Globe Body */}
            <circle cx="0" cy="0" r="9.2" fill="url(#uranusGrad)" />
            {/* Front half of vertical ice rings */}
            <g transform="rotate(78)">
              <path
                d="M -19,0 A 19 4 0 0 0 19,0"
                fill="none"
                stroke="url(#uranusRingGrad)"
                strokeWidth="2.2"
                opacity="0.85"
              />
            </g>
            {/* Upright Name Tag */}
            <g transform="translate(0, 20)" filter="url(#labelBadgeGlow)">
              <rect x="-26" y="-7" width="52" height="14" rx="7" fill="#04141c" fillOpacity="0.88" stroke="#22d3ee" strokeWidth="0.8" />
              <text x="0" y="2.5" textAnchor="middle" fill="#a5f3fc" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
                ♅ Uranus
              </text>
            </g>
          </g>
        </g>

        {/* Planet 8: Neptune (Deep Azure Storm Giant) */}
        <g className="cosmic-planet-group">
          <g>
            <animateMotion dur="182s" repeatCount="indefinite">
              <mpath href="#orbitNeptunePath" />
            </animateMotion>
            {/* Neptune Atmospheric Azure Glow */}
            <circle cx="0" cy="0" r="11.5" fill="#3b82f6" opacity="0.3" filter="url(#solarCoreGlow)" />
            {/* Neptune Globe Body */}
            <circle cx="0" cy="0" r="8.8" fill="url(#neptuneGrad)" />
            {/* High-Altitude White Cirrus Cloud Streaks */}
            <path
              d="M -6.5,-2.5 C -2,-4 2,-1.5 6.5,-2 M -7,2 C -3,3.5 2,1.5 6.5,2.5"
              stroke="#93c5fd"
              strokeWidth="1.2"
              fill="none"
              opacity="0.8"
              strokeLinecap="round"
            />
            {/* Great Dark Spot */}
            <ellipse cx="-2.5" cy="1" rx="2.2" ry="1.4" fill="#0f172a" opacity="0.7" />
            {/* Upright Name Tag */}
            <g transform="translate(0, 20)" filter="url(#labelBadgeGlow)">
              <rect x="-27" y="-7" width="54" height="14" rx="7" fill="#040b1e" fillOpacity="0.88" stroke="#60a5fa" strokeWidth="0.8" />
              <text x="0" y="2.5" textAnchor="middle" fill="#bfdbfe" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
                ♆ Neptune
              </text>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};
