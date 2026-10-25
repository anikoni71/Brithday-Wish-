import React, { useState, useEffect } from 'react';

/**
 * HumanJourneyLifecycle
 * High-definition, exceptionally realistic, and deeply cinematic lifecycle animation suite.
 * Perfectly calibrated for the left and right empty background zones flanking the lower trunk
 * of the Interactive Birthday Tree.
 *
 * Features:
 *  1. 8 High-Definition Life Stages:
 *     - Left Flank (Dawn of Life & Growth):
 *       • Stage 01: Infancy (Age 0–3) - Celestial cradle with breathing baby & mobile
 *       • Stage 02: Childhood (Age 4–11) - Running child with 3D balloon & butterflies
 *       • Stage 03: Youth (Age 12–19) - Student reading with holographic galaxy & telescope
 *       • Stage 04: Ambition (Age 20–35) - Explorer on summit with sextant & dawn sunbeam
 *     - Right Flank (Harvest of Wisdom & Legacy):
 *       • Stage 05: Union & Kin (Age 36–49) - Loving partners, child, heart nebula & rings
 *       • Stage 06: Mastery (Age 50–64) - Mentor guiding apprentice to plant glowing sapling
 *       • Stage 07: Wisdom (Age 65–79) - Venerable elder on mahogany bench with cane & songbird
 *       • Stage 08: Legacy (Age 80+) - Diamond spirit ascending into cosmic stardust
 *
 *  2. Subtle, Evolving Progress Line from Legacy to Tree Roots:
 *     - Maps Stage 08 directly into an aesthetic bio-luminescent energy trail that connects
 *       visually into the central roots and trunk base of the Birthday Tree.
 *
 *  3. Seamless, Smooth Dissolve Animation Transition:
 *     - Interactive Life Stage Slider allowing smooth navigation across the 8 phases.
 *     - Cinematic spotlighting and organic lighting shift dynamically between stages with
 *       smooth cubic-bezier cross-dissolve transitions.
 */

interface StageInfo {
  id: number;
  name: string;
  age: string;
  theme: string;
  flank: 'left' | 'right';
  x: number;
  y: number;
  color: string;
}

const STAGES: StageInfo[] = [
  { id: 1, name: 'INFANCY', age: 'Age 0–3', theme: 'Miracle of Birth & Wonder', flank: 'left', x: 85, y: 705, color: '#38bdf8' },
  { id: 2, name: 'CHILDHOOD', age: 'Age 4–11', theme: 'Pure Play & Discovery', flank: 'left', x: 160, y: 595, color: '#34d399' },
  { id: 3, name: 'YOUTH', age: 'Age 12–19', theme: 'Dreams & Knowledge', flank: 'left', x: 255, y: 705, color: '#818cf8' },
  { id: 4, name: 'AMBITION', age: 'Age 20–35', theme: 'Career, Voyage & Striving', flank: 'left', x: 350, y: 580, color: '#f59e0b' },
  { id: 5, name: 'UNION & KIN', age: 'Age 36–49', theme: 'Love, Family & Home', flank: 'right', x: 650, y: 580, color: '#ec4899' },
  { id: 6, name: 'MASTERY', age: 'Age 50–64', theme: 'Mentorship & Planting Seeds', flank: 'right', x: 745, y: 705, color: '#10b981' },
  { id: 7, name: 'WISDOM', age: 'Age 65–79', theme: 'Golden Grace & Serenity', flank: 'right', x: 845, y: 595, color: '#eab308' },
  { id: 8, name: 'LEGACY', age: 'Age 80+', theme: 'The Eternal Star & Confluence', flank: 'right', x: 935, y: 715, color: '#60a5fa' },
];

export const HumanJourneyLifecycle: React.FC = () => {
  // Slider state: 0 = All Stages Overview (default), 1..8 = Individual Life Stages
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Auto-play interval for gentle cyclic evolution
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev >= 8 ? 1 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Active stage details
  const activeStageInfo = currentStage > 0 ? STAGES[currentStage - 1] : null;

  return (
    <g id="humanJourneyLifecycle" className="human-journey-suite select-none">
      <defs>
        {/* Lifeline Conduit Gradients */}
        <linearGradient id="lifelineGradLeft" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
          <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#34d399" stopOpacity="1" />
          <stop offset="85%" stopColor="#fde047" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient id="lifelineGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
          <stop offset="30%" stopColor="#ec4899" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#10b981" stopOpacity="0.95" />
          <stop offset="85%" stopColor="#eab308" stopOpacity="1" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.95" />
        </linearGradient>

        {/* Evolving Energy Trail from Stage 08 Legacy into the Tree Roots */}
        <linearGradient id="legacyToRootsEnergyGrad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.95" />
          <stop offset="25%" stopColor="#a855f7" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ec4899" stopOpacity="0.85" />
          <stop offset="75%" stopColor="#10b981" stopOpacity="0.95" />
          <stop offset="90%" stopColor="#34d399" stopOpacity="1" />
          <stop offset="100%" stopColor="#fde047" stopOpacity="1" />
        </linearGradient>

        {/* Cinematic Spotlight Beam Gradient */}
        <linearGradient id="stageCinemaSpotlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="40%" stopColor="#fde047" stopOpacity="0.25" />
          <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>

        {/* Realistic Metallic & Fabric Gradients */}
        <linearGradient id="cradleWoodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="45%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#082f49" />
        </linearGradient>

        <linearGradient id="cradleBlanketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="50%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        <radialGradient id="babySkinGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="55%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#f97316" />
        </radialGradient>

        <radialGradient id="balloonSphereGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="25%" stopColor="#fda4af" />
          <stop offset="65%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#881337" />
        </radialGradient>

        <linearGradient id="studentHoloBeam" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#818cf8" stopOpacity="0.6" />
          <stop offset="80%" stopColor="#c084fc" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="ambitionDawnBeam" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
          <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.25" />
          <stop offset="75%" stopColor="#fef08a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
        </linearGradient>

        <radialGradient id="unionHeartAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#ec4899" stopOpacity="0.5" />
          <stop offset="80%" stopColor="#a855f7" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="mentorSaplingGlow" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#059669" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#10b981" stopOpacity="0.95" />
          <stop offset="80%" stopColor="#34d399" stopOpacity="1" />
          <stop offset="100%" stopColor="#fef08a" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient id="wisdomLampGlow" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#ea580c" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>

        <radialGradient id="legacyApotheosisGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="25%" stopColor="#93c5fd" stopOpacity="0.85" />
          <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.4" />
          <stop offset="85%" stopColor="#1d4ed8" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        {/* High-Definition Multi-Tier Glow Filters */}
        <filter id="humanCinemaGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur3" />
          <feMerge>
            <feMergeNode in="blur3" />
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="humanActiveStageGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="blur3" />
          <feMerge>
            <feMergeNode in="blur3" />
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="humanCardBackdrop" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.9" />
        </filter>

        <filter id="humanSubtleDrop" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* =========================================================================
          INTERACTIVE LIFE STAGE SLIDER & TIME-SCRUBBER CONTROLLER
          Seamlessly shifts cinematic lighting and dissolves across the 8 life stages
          ========================================================================= */}
      <g className="human-journey-slider-controller" style={{ pointerEvents: 'auto' }}>
        {/* Floating Glassmorphic Time-Scrubber Capsule at Top of Flanks */}
        <g transform="translate(500, 480)" filter="url(#humanCardBackdrop)">
          {/* Centered Controller Pill spanning the middle under the tree fork */}
          <rect
            x="-180"
            y="-16"
            width="360"
            height="32"
            rx="16"
            fill="#030712"
            fillOpacity="0.94"
            stroke={currentStage === 0 ? '#38bdf8' : activeStageInfo?.color || '#f59e0b'}
            strokeWidth="1.2"
            className="transition-colors duration-500"
          />

          {/* Left Arrow Button (Previous Stage) */}
          <g
            className="cursor-pointer group"
            onClick={() => setCurrentStage((prev) => (prev <= 0 ? 8 : prev - 1))}
          >
            <circle cx="-160" cy="0" r="10" fill="#1e293b" className="group-hover:fill-zinc-800 transition-colors" />
            <path d="M -158,-4 L -164,0 L -158,4" fill="none" stroke="#f8fafc" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Play/Pause Auto-Advance Toggle */}
          <g
            className="cursor-pointer group"
            onClick={() => setIsPlaying((prev) => !prev)}
          >
            <circle
              cx="-134"
              cy="0"
              r="10"
              fill={isPlaying ? '#059669' : '#1e293b'}
              className="group-hover:opacity-90 transition-colors"
            />
            {isPlaying ? (
              <path d="M -136,-3 L -136,3 M -132,-3 L -132,3" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <polygon points="-136,-4 -130,0 -136,4" fill="#ffffff" />
            )}
          </g>

          {/* Life Stage Step Dots (0: All, 1: Infancy, ... 8: Legacy) */}
          <g transform="translate(-105, 0)">
            {/* Step 0: All Stages */}
            <circle
              cx="0"
              cy="0"
              r={currentStage === 0 ? 6 : 4}
              fill={currentStage === 0 ? '#38bdf8' : '#475569'}
              stroke="#ffffff"
              strokeWidth={currentStage === 0 ? 1.5 : 0}
              className="cursor-pointer hover:scale-125 transition-all"
              onClick={() => setCurrentStage(0)}
            />

            {/* Steps 1 to 8 */}
            {STAGES.map((s, idx) => {
              const cx = (idx + 1) * 24;
              const isSel = currentStage === s.id;
              return (
                <circle
                  key={`slider-dot-${s.id}`}
                  cx={cx}
                  cy="0"
                  r={isSel ? 6.5 : 4}
                  fill={isSel ? s.color : '#334155'}
                  stroke="#ffffff"
                  strokeWidth={isSel ? 1.6 : 0}
                  className="cursor-pointer hover:scale-125 transition-all"
                  onClick={() => setCurrentStage(s.id)}
                />
              );
            })}
          </g>

          {/* Right Arrow Button (Next Stage) */}
          <g
            className="cursor-pointer group"
            onClick={() => setCurrentStage((prev) => (prev >= 8 ? 0 : prev + 1))}
          >
            <circle cx="134" cy="0" r="10" fill="#1e293b" className="group-hover:fill-zinc-800 transition-colors" />
            <path d="M 132,-4 L 138,0 L 132,4" fill="none" stroke="#f8fafc" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* "ALL" Reset Button */}
          <g
            className="cursor-pointer group"
            onClick={() => setCurrentStage(0)}
          >
            <rect
              x="148"
              y="-10"
              width="24"
              height="20"
              rx="6"
              fill={currentStage === 0 ? '#0284c7' : '#1e293b'}
              className="group-hover:opacity-90 transition-colors"
            />
            <text x="160" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="monospace">
              ALL
            </text>
          </g>

          {/* Active Stage Label Display (Dynamic Text Readout under pill) */}
          <text
            x="0"
            y="28"
            textAnchor="middle"
            fill={currentStage === 0 ? '#38bdf8' : activeStageInfo?.color || '#fde047'}
            fontSize="8.5"
            fontWeight="bold"
            fontFamily="ui-monospace, monospace"
            className="transition-colors duration-500"
          >
            {currentStage === 0
              ? '★ ALL 8 STAGES ACTIVE • SEAMLESS LIFECYCLE DISSOLVE'
              : `STAGE 0${activeStageInfo?.id} • ${activeStageInfo?.name} (${activeStageInfo?.age}) — ${activeStageInfo?.theme}`}
          </text>
        </g>
      </g>

      {/* =========================================================================
          DYNAMIC CINEMATIC SPOTLIGHT BEAM
          Shifts organically over the currently selected life stage with smooth dissolve
          ========================================================================= */}
      {activeStageInfo && (
        <g
          className="human-stage-spotlight pointer-events-none"
          style={{
            transition: 'opacity 0.65s cubic-bezier(0.25, 0.8, 0.25, 1)',
            opacity: currentStage > 0 ? 0.75 : 0,
          }}
        >
          <polygon
            points={`500,420 ${activeStageInfo.x - 55},${activeStageInfo.y + 25} ${activeStageInfo.x + 55},${activeStageInfo.y + 25}`}
            fill="url(#stageCinemaSpotlight)"
            filter="url(#humanCinemaGlow)"
          />
          <ellipse
            cx={activeStageInfo.x}
            cy={activeStageInfo.y + 10}
            rx="50"
            ry="20"
            fill={activeStageInfo.color}
            opacity="0.18"
            filter="url(#humanCinemaGlow)"
          />
        </g>
      )}

      {/* =========================================================================
          LEFT FLANK: THE DAWN OF LIFE & GROWTH (STAGES 01 - 04)
          Bounding Box: x: 35 - 385, y: 470 - 755
          ========================================================================= */}
      <g className="human-journey-left-flank">
        {/* Ambient Interstellar Volumetric Under-Glow */}
        <ellipse cx="210" cy="625" rx="170" ry="115" fill="#0284c7" opacity="0.06" filter="url(#humanCinemaGlow)" />

        {/* Header Capsule: The Dawn of Life */}
        <g transform="translate(55, 478)" filter="url(#humanCardBackdrop)">
          <rect x="0" y="0" width="225" height="26" rx="13" fill="#030712" fillOpacity="0.92" stroke="#38bdf8" strokeWidth="0.9" />
          <circle cx="15" cy="13" r="5" fill="#38bdf8" filter="url(#humanCinemaGlow)" />
          <circle cx="15" cy="13" r="2.2" fill="#ffffff" />
          <text x="28" y="16.5" fill="#f8fafc" fontSize="8" fontWeight="900" fontFamily="ui-monospace, monospace" letterSpacing="0.8">
            THE HUMAN JOURNEY
          </text>
          <text x="136" y="16.5" fill="#38bdf8" fontSize="7.5" fontWeight="700" fontFamily="ui-monospace, monospace">
            • I: DAWN OF LIFE
          </text>
        </g>

        {/* Flowing Bio-Luminescent Lifeline Conduit (Left) */}
        <g>
          {/* Base Guide Trace */}
          <path
            d="M 60,735 C 95,680 115,615 155,610 C 195,605 215,720 255,715 C 295,710 325,595 365,585"
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.4"
          />
          {/* Luminous Pulsing Telemetry Lifeline */}
          <path
            d="M 60,735 C 95,680 115,615 155,610 C 195,605 215,720 255,715 C 295,710 325,595 365,585"
            fill="none"
            stroke="url(#lifelineGradLeft)"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter="url(#humanCinemaGlow)"
            className="human-lifeline-stream-left"
          />
        </g>

        {/* STAGE 01: INFANCY & BIRTH (The Miracle of Birth) */}
        <g
          id="stage-01-infancy"
          style={{
            cursor: 'pointer',
            pointerEvents: 'auto',
            opacity: currentStage === 0 ? 0.95 : currentStage === 1 ? 1 : 0.24,
            transform: `translate(85px, 705px) scale(${currentStage === 1 ? 1.08 : 1})`,
            transformOrigin: '85px 705px',
            transition: 'opacity 0.65s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.65s cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
          onClick={() => setCurrentStage(1)}
        >
          {/* Stage Pedestal Platform & Concentric Radar Ring */}
          <circle cx="0" cy="0" r="18" fill="#030712" fillOpacity="0.92" stroke="#38bdf8" strokeWidth="1.4" filter="url(#humanCardBackdrop)" />
          <circle cx="0" cy="0" r="18" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.65" className="human-halo-pulse" />
          <circle cx="0" cy="0" r="24" fill="none" stroke="#0ea5e9" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.4" />
          <text x="0" y="4" textAnchor="middle" fill="#38bdf8" fontSize="8.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
            01
          </text>

          {/* HIGH-DEFINITION ARTWORK: Realistic Celestial Bassinet, Swaddled Sleeping Baby & Crib Mobile */}
          <g transform="translate(0, -36)">
            {/* Ambient Cradle Soft Warm Glow */}
            <ellipse cx="0" cy="12" rx="22" ry="10" fill="#38bdf8" opacity="0.15" filter="url(#humanCinemaGlow)" />

            {/* Cradle Stand & Rocker Base */}
            <path d="M -18,14 Q 0,24 18,14" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
            <path d="M -16,13 L -12,5 M 16,13 L 12,5" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />

            {/* Carved Wicker/Starlight Bassinet Body */}
            <path
              d="M -17,4 C -19,-4 -12,-8 0,-8 C 12,-8 19,-4 17,4 C 15,12 11,15 0,15 C -11,15 -15,12 -17,4 Z"
              fill="url(#cradleWoodGrad)"
              stroke="#7dd3fc"
              strokeWidth="1.2"
              filter="url(#humanSubtleDrop)"
            />

            {/* Soft Mattress & Pillow */}
            <ellipse cx="0" cy="2" rx="14" ry="7" fill="#f8fafc" opacity="0.9" />
            <ellipse cx="-7" cy="1" rx="5" ry="3.5" fill="#e2e8f0" />

            {/* Realistic Swaddled Sleeping Baby with Breathing Motion */}
            <g className="human-baby-breathe">
              {/* Swaddling Blanket with Realistic Folds */}
              <path
                d="M -7,4 C -3,2 6,1 12,4 C 14,7 10,10 5,10 C -1,10 -6,8 -7,4 Z"
                fill="url(#cradleBlanketGrad)"
                stroke="#bae6fd"
                strokeWidth="0.8"
              />
              <path d="M -1,3 C 3,4 7,4 9,8" stroke="#38bdf8" strokeWidth="0.8" fill="none" opacity="0.7" />

              {/* Baby Head & Sweet Peaceful Face */}
              <circle cx="-6" cy="1" r="4.2" fill="url(#babySkinGrad)" />
              {/* Sleeping Eye Arc */}
              <path d="M -7,1 Q -6,2.2 -5,1" fill="none" stroke="#78350f" strokeWidth="0.7" strokeLinecap="round" />
              {/* Rosy Cheek */}
              <circle cx="-5" cy="2.2" r="1.1" fill="#fb7185" opacity="0.75" />
              {/* Baby Hair Tuft */}
              <path d="M -9,0 Q -8,-2 -6,-1" fill="none" stroke="#b45309" strokeWidth="0.8" strokeLinecap="round" />
              {/* Tiny Sleeping Hand */}
              <ellipse cx="-1" cy="3" rx="1.4" ry="1.1" fill="#fed7aa" />
            </g>

            {/* Polished Brass Mobile Arm */}
            <path d="M 12,4 L 14,-14 L 0,-14" fill="none" stroke="#fde047" strokeWidth="1.2" strokeLinecap="round" />
            {/* Spinning Mobile Ring with Planet, Moon & Star */}
            <g transform="translate(0, -14)" className="human-star-mobile">
              <line x1="0" y1="0" x2="-8" y2="6" stroke="#94a3b8" strokeWidth="0.7" />
              <line x1="0" y1="0" x2="8" y2="6" stroke="#94a3b8" strokeWidth="0.7" />
              <line x1="0" y1="0" x2="0" y2="8" stroke="#94a3b8" strokeWidth="0.7" />
              {/* Mini Crescent Moon */}
              <path d="M -9,5 A 2.5 2.5 0 0 0 -7,8 A 2 2 0 0 1 -9,5 Z" fill="#fef08a" />
              {/* Mini Saturn with Ring */}
              <circle cx="8" cy="6" r="1.8" fill="#f59e0b" />
              <ellipse cx="8" cy="6" rx="3.5" ry="1" fill="none" stroke="#fcd34d" strokeWidth="0.6" transform="rotate(-15 8 6)" />
              {/* Twinkling Starlight Crystal */}
              <path d="M 0,6 L 1,8 L 0,10 L -1,8 Z" fill="#ffffff" filter="url(#humanCinemaGlow)" />
            </g>
          </g>

          {/* Stage Title Card (Frosted Glassmorphism Pill) */}
          <g transform="translate(0, 26)" filter="url(#humanCardBackdrop)">
            <rect x="-42" y="-8" width="84" height="17" rx="8.5" fill="#030712" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="0.85" />
            <text x="0" y="2.5" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace" letterSpacing="0.4">
              INFANCY
            </text>
            <text x="0" y="15" textAnchor="middle" fill="#38bdf8" fontSize="7" fontWeight="600" fontFamily="ui-monospace, monospace">
              Age 0–3 • Miracle of Birth
            </text>
          </g>
        </g>

        {/* STAGE 02: CHILDHOOD (Play & Discovery) */}
        <g
          id="stage-02-childhood"
          style={{
            cursor: 'pointer',
            pointerEvents: 'auto',
            opacity: currentStage === 0 ? 0.95 : currentStage === 2 ? 1 : 0.24,
            transform: `translate(160px, 595px) scale(${currentStage === 2 ? 1.08 : 1})`,
            transformOrigin: '160px 595px',
            transition: 'opacity 0.65s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.65s cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
          onClick={() => setCurrentStage(2)}
        >
          {/* Stage Pedestal Platform & Radar Ring */}
          <circle cx="0" cy="0" r="18" fill="#030712" fillOpacity="0.92" stroke="#34d399" strokeWidth="1.4" filter="url(#humanCardBackdrop)" />
          <circle cx="0" cy="0" r="18" fill="none" stroke="#34d399" strokeWidth="1" opacity="0.65" className="human-halo-pulse-delayed" />
          <circle cx="0" cy="0" r="24" fill="none" stroke="#10b981" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.4" />
          <text x="0" y="4" textAnchor="middle" fill="#34d399" fontSize="8.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
            02
          </text>

          {/* HIGH-DEFINITION ARTWORK: Realistic Running Child, 3D Balloon, Butterflies & Wildflowers */}
          <g transform="translate(0, -36)">
            {/* Grassy Meadow Knoll with Bio-Luminescent Wildflowers */}
            <path d="M -22,20 Q 0,16 22,20" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            <circle cx="-16" cy="18" r="1.5" fill="#fde047" />
            <circle cx="-12" cy="19" r="1.2" fill="#34d399" />
            <circle cx="16" cy="18" r="1.5" fill="#ec4899" />
            <circle cx="12" cy="19" r="1.2" fill="#38bdf8" />

            {/* Realistic Running Child Figure */}
            <g className="human-child-stride">
              {/* Shoes/Sneakers with White Soles */}
              <ellipse cx="-8" cy="18" rx="2.5" ry="1.2" fill="#ffffff" />
              <ellipse cx="9" cy="15" rx="2.5" ry="1.2" fill="#ffffff" />

              {/* Legs in Active Running Motion (Cuffed Denim Jeans) */}
              <path d="M -2,7 L -7,17" stroke="#0284c7" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M 2,7 L 8,14" stroke="#0284c7" strokeWidth="2.4" strokeLinecap="round" />

              {/* Torso in Vibrant Striped T-Shirt / Jacket */}
              <path d="M -3,-1 L 3,-1 L 2,8 L -2,8 Z" fill="#10b981" stroke="#059669" strokeWidth="0.6" />
              <line x1="-2.5" y1="2" x2="2.5" y2="2" stroke="#fef08a" strokeWidth="1" />
              <line x1="-2.5" y1="5" x2="2.5" y2="5" stroke="#fef08a" strokeWidth="1" />

              {/* Left Arm extending backward for balance */}
              <path d="M -3,0 L -9,5" stroke="#fed7aa" strokeWidth="1.6" strokeLinecap="round" />

              {/* Child Head with Joyful Expression & Wind-Swept Hair */}
              <circle cx="0" cy="-6" r="4.5" fill="url(#babySkinGrad)" />
              {/* Wind-swept Hairlocks */}
              <path d="M -4,-8 Q 0,-12 4,-7 Q 1,-10 -3,-9" fill="#92400e" />
              {/* Happy Smiling Eye & Rosy Cheek */}
              <circle cx="1.5" cy="-6" r="0.8" fill="#1e293b" />
              <path d="M 0.5,-4 Q 2,-3 3.5,-4" fill="none" stroke="#b91c1c" strokeWidth="0.6" strokeLinecap="round" />
              <circle cx="1.5" cy="-4.5" r="1.2" fill="#fb7185" opacity="0.6" />

              {/* Right Arm raised up holding the balloon string */}
              <path d="M 3,0 L 8,-5" stroke="#fed7aa" strokeWidth="1.6" strokeLinecap="round" />
            </g>

            {/* Balloon String & 3D Volumetric Sphere Balloon */}
            <path d="M 8,-5 Q 16,-18 14,-28" fill="none" stroke="#fde047" strokeWidth="0.8" strokeDasharray="1.5 2" />
            <g transform="translate(14, -34)" className="human-balloon-bob">
              <ellipse cx="0" cy="0" rx="7.5" ry="9.5" fill="url(#balloonSphereGrad)" filter="url(#humanCinemaGlow)" />
              <polygon points="0,9.5 -2.5,12 2.5,12" fill="#be123c" />
              {/* 3D Specular Highlight Crescent */}
              <path d="M -3,-6 A 6 7 0 0 1 1,-2" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.85" strokeLinecap="round" />
            </g>

            {/* Fluttering Starlight Butterfly */}
            <g transform="translate(-14, -8)" className="human-butterfly-flutter">
              <ellipse cx="0" cy="0" rx="1" ry="2" fill="#fef08a" />
              <path d="M 0,-1 Q -4,-5 -3,0 Q -4,3 0,1" fill="#ec4899" opacity="0.9" />
              <path d="M 0,-1 Q 4,-5 3,0 Q 4,3 0,1" fill="#ec4899" opacity="0.9" />
            </g>
          </g>

          {/* Stage Title Card */}
          <g transform="translate(0, 26)" filter="url(#humanCardBackdrop)">
            <rect x="-44" y="-8" width="88" height="17" rx="8.5" fill="#030712" fillOpacity="0.9" stroke="#34d399" strokeWidth="0.85" />
            <text x="0" y="2.5" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace" letterSpacing="0.4">
              CHILDHOOD
            </text>
            <text x="0" y="15" textAnchor="middle" fill="#34d399" fontSize="7" fontWeight="600" fontFamily="ui-monospace, monospace">
              Age 4–11 • Wonder & Play
            </text>
          </g>
        </g>

        {/* STAGE 03: YOUTH (Dreams & Knowledge) */}
        <g
          id="stage-03-youth"
          style={{
            cursor: 'pointer',
            pointerEvents: 'auto',
            opacity: currentStage === 0 ? 0.95 : currentStage === 3 ? 1 : 0.24,
            transform: `translate(255px, 705px) scale(${currentStage === 3 ? 1.08 : 1})`,
            transformOrigin: '255px 705px',
            transition: 'opacity 0.65s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.65s cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
          onClick={() => setCurrentStage(3)}
        >
          {/* Stage Pedestal Platform & Radar Ring */}
          <circle cx="0" cy="0" r="18" fill="#030712" fillOpacity="0.92" stroke="#818cf8" strokeWidth="1.4" filter="url(#humanCardBackdrop)" />
          <circle cx="0" cy="0" r="18" fill="none" stroke="#818cf8" strokeWidth="1" opacity="0.65" className="human-halo-pulse" />
          <circle cx="0" cy="0" r="24" fill="none" stroke="#6366f1" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.4" />
          <text x="0" y="4" textAnchor="middle" fill="#818cf8" fontSize="8.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
            03
          </text>

          {/* HIGH-DEFINITION ARTWORK: Student, Illuminated Tome of Knowledge, Holographic Galaxies & Telescope */}
          <g transform="translate(0, -36)">
            {/* Ancient Cosmic Mossy Rock Seat */}
            <path d="M -16,14 C -18,8 -10,6 2,6 C 14,6 18,10 16,15 C 14,20 -14,20 -16,14 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" />

            {/* Astronomical Brass Telescope on Tripod beside the student */}
            <g transform="translate(-18, -4)">
              <line x1="0" y1="18" x2="-4" y2="24" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="0" y1="18" x2="4" y2="24" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="0" y1="18" x2="0" y2="24" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />
              {/* Telescope Barrel angled up to sky */}
              <line x1="-7" y1="21" x2="5" y2="11" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="6" cy="10" r="1.8" fill="#38bdf8" filter="url(#humanCinemaGlow)" />
            </g>

            {/* Youth Figure in Hoodie & Jeans */}
            {/* Denim Legs draped over stone */}
            <path d="M 0,8 L 6,14 L 6,22" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M -4,8 L -2,15 L -2,22" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Modern Indigo Hoodie with Folds */}
            <path d="M -6,0 C -7,5 -4,8 0,8 C 4,8 7,5 6,0 C 5,-4 -5,-4 -6,0 Z" fill="#4338ca" stroke="#6366f1" strokeWidth="0.8" />
            {/* Arms holding the glowing open tome */}
            <path d="M -5,1 L 0,6" stroke="#4338ca" strokeWidth="2" strokeLinecap="round" />
            <path d="M 5,1 L 0,6" stroke="#4338ca" strokeWidth="2" strokeLinecap="round" />

            {/* Head with Contemporary Hair & Focused Expression */}
            <circle cx="0" cy="-6" r="4.5" fill="url(#babySkinGrad)" />
            <path d="M -4,-8 C -4,-12 3,-12 4,-7 C 2,-9 -2,-9 -4,-8 Z" fill="#451a03" />
            {/* Studious Eyes looking down at page */}
            <line x1="-1" y1="-5.5" x2="1" y2="-5.5" stroke="#1e293b" strokeWidth="0.8" />

            {/* Open Holographic Book on Lap */}
            <path d="M -6,6 L 0,8 L 6,6 L 6,9 L 0,11 L -6,9 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.8" />
            <line x1="0" y1="8" x2="0" y2="11" stroke="#ffffff" strokeWidth="0.8" />

            {/* Holographic Knowledge Beam Rising into the Sky */}
            <polygon points="-6,6 6,6 12,-16 -12,-16" fill="url(#studentHoloBeam)" />

            {/* Rising Holographic Galaxy Swirl & Formulas */}
            <g transform="translate(0, -18)" className="human-holo-swirl">
              <ellipse cx="0" cy="0" rx="8" ry="3" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.85" strokeDasharray="2 2" />
              <circle cx="0" cy="0" r="1.5" fill="#ffffff" filter="url(#humanCinemaGlow)" />
              {/* Rising Idea Photons */}
              <circle cx="-5" cy="-3" r="1.2" fill="#a7f3d0" className="human-photon-spark-1" />
              <circle cx="6" cy="-4" r="1.4" fill="#fde047" className="human-photon-spark-2" />
            </g>
          </g>

          {/* Stage Title Card */}
          <g transform="translate(0, 26)" filter="url(#humanCardBackdrop)">
            <rect x="-42" y="-8" width="84" height="17" rx="8.5" fill="#030712" fillOpacity="0.9" stroke="#818cf8" strokeWidth="0.85" />
            <text x="0" y="2.5" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace" letterSpacing="0.4">
              YOUTH
            </text>
            <text x="0" y="15" textAnchor="middle" fill="#818cf8" fontSize="7" fontWeight="600" fontFamily="ui-monospace, monospace">
              Age 12–19 • Dreams & Path
            </text>
          </g>
        </g>

        {/* STAGE 04: AMBITION (Career & Purpose) */}
        <g
          id="stage-04-ambition"
          style={{
            cursor: 'pointer',
            pointerEvents: 'auto',
            opacity: currentStage === 0 ? 0.95 : currentStage === 4 ? 1 : 0.24,
            transform: `translate(350px, 580px) scale(${currentStage === 4 ? 1.08 : 1})`,
            transformOrigin: '350px 580px',
            transition: 'opacity 0.65s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.65s cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
          onClick={() => setCurrentStage(4)}
        >
          {/* Stage Pedestal Platform & Radar Ring */}
          <circle cx="0" cy="0" r="18" fill="#030712" fillOpacity="0.92" stroke="#f59e0b" strokeWidth="1.4" filter="url(#humanCardBackdrop)" />
          <circle cx="0" cy="0" r="18" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.65" className="human-halo-pulse-delayed" />
          <circle cx="0" cy="0" r="24" fill="none" stroke="#d97706" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.4" />
          <text x="0" y="4" textAnchor="middle" fill="#f59e0b" fontSize="8.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
            04
          </text>

          {/* HIGH-DEFINITION ARTWORK: Young Leader on Summit, Sextant, Dawn Sunbeam & Flowing Coat */}
          <g transform="translate(0, -36)">
            {/* Majestic Mountain Peak / Futuristic Summit Platform */}
            <polygon points="-16,22 0,15 16,22 10,26 -10,26" fill="#1e293b" stroke="#475569" strokeWidth="1" />

            {/* Cinematic Golden Sunrise Diagonal Beam */}
            <polygon points="0,15 40,-15 18,-25 -10,15" fill="url(#ambitionDawnBeam)" />

            {/* Confident Young Professional / Explorer Figure */}
            {/* Trousers in purposeful, striding stance */}
            <path d="M 0,6 L -6,18 M 0,6 L 6,17" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="-6" cy="18" rx="2" ry="1" fill="#0f172a" />
            <ellipse cx="6" cy="17" rx="2" ry="1" fill="#0f172a" />

            {/* Tailored Coat with Wind-Swept Lapel */}
            <path d="M -4,-2 L 4,-2 L 5,9 L -5,9 Z" fill="#b45309" stroke="#f59e0b" strokeWidth="0.8" />
            {/* Flowing Scarf / Capelet fluttering in cosmic wind */}
            <path d="M -4,-2 Q -12,0 -16,-3" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" className="human-coat-flutter" />

            {/* Confident Head with Modern Hair */}
            <circle cx="0" cy="-7" r="4.6" fill="url(#babySkinGrad)" />
            <path d="M -4,-9 C -3,-13 4,-12 4,-8 C 1,-9 -2,-9 -4,-9 Z" fill="#292524" />
            {/* Determined Eye looking forward */}
            <circle cx="2" cy="-7" r="0.8" fill="#1e293b" />

            {/* Left Arm holding Graduation Scroll / Blueprint */}
            <path d="M -4,-1 L -8,5" stroke="#fed7aa" strokeWidth="1.6" strokeLinecap="round" />
            <rect x="-10" y="3" width="2.5" height="6" rx="1.2" fill="#fef08a" transform="rotate(20 -9 6)" />

            {/* Right Arm raised holding glowing Navigator Sextant / Compass aiming toward dawn */}
            <path d="M 4,-1 L 12,-6" stroke="#fed7aa" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="13" cy="-7" r="2.5" fill="#fde047" stroke="#d97706" strokeWidth="0.8" filter="url(#humanCinemaGlow)" />
            {/* Ray of Guidance piercing forward */}
            <line x1="15" y1="-8" x2="28" y2="-15" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" filter="url(#humanCinemaGlow)" />
          </g>

          {/* Stage Title Card */}
          <g transform="translate(0, 26)" filter="url(#humanCardBackdrop)">
            <rect x="-42" y="-8" width="84" height="17" rx="8.5" fill="#030712" fillOpacity="0.9" stroke="#f59e0b" strokeWidth="0.85" />
            <text x="0" y="2.5" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace" letterSpacing="0.4">
              AMBITION
            </text>
            <text x="0" y="15" textAnchor="middle" fill="#f59e0b" fontSize="7" fontWeight="600" fontFamily="ui-monospace, monospace">
              Age 20–35 • Purpose & Work
            </text>
          </g>
        </g>
      </g>

      {/* =========================================================================
          RIGHT FLANK: HARVEST OF WISDOM & LEGACY (STAGES 05 - 08)
          Bounding Box: x: 615 - 965, y: 470 - 755
          ========================================================================= */}
      <g className="human-journey-right-flank">
        {/* Ambient Interstellar Volumetric Under-Glow */}
        <ellipse cx="790" cy="625" rx="170" ry="115" fill="#a855f7" opacity="0.06" filter="url(#humanCinemaGlow)" />

        {/* Header Capsule: Harvest of Wisdom */}
        <g transform="translate(700, 478)" filter="url(#humanCardBackdrop)">
          <rect x="0" y="0" width="235" height="26" rx="13" fill="#030712" fillOpacity="0.92" stroke="#a855f7" strokeWidth="0.9" />
          <circle cx="15" cy="13" r="5" fill="#a855f7" filter="url(#humanCinemaGlow)" />
          <circle cx="15" cy="13" r="2.2" fill="#ffffff" />
          <text x="28" y="16.5" fill="#f8fafc" fontSize="8" fontWeight="900" fontFamily="ui-monospace, monospace" letterSpacing="0.8">
            THE HUMAN JOURNEY
          </text>
          <text x="136" y="16.5" fill="#a855f7" fontSize="7.5" fontWeight="700" fontFamily="ui-monospace, monospace">
            • II: HARVEST & WISDOM
          </text>
        </g>

        {/* Flowing Bio-Luminescent Lifeline Conduit (Right) */}
        <g>
          {/* Base Guide Trace */}
          <path
            d="M 645,585 C 685,595 705,710 745,715 C 785,720 805,605 845,600 C 885,595 910,705 940,730"
            fill="none"
            stroke="#ec4899"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.4"
          />
          {/* Luminous Pulsing Telemetry Lifeline */}
          <path
            d="M 645,585 C 685,595 705,710 745,715 C 785,720 805,605 845,600 C 885,595 910,705 940,730"
            fill="none"
            stroke="url(#lifelineGradRight)"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter="url(#humanCinemaGlow)"
            className="human-lifeline-stream-right"
          />
        </g>

        {/* STAGE 05: UNION & KIN (Love, Kinship & Partnership) */}
        <g
          id="stage-05-union"
          style={{
            cursor: 'pointer',
            pointerEvents: 'auto',
            opacity: currentStage === 0 ? 0.95 : currentStage === 5 ? 1 : 0.24,
            transform: `translate(650px, 580px) scale(${currentStage === 5 ? 1.08 : 1})`,
            transformOrigin: '650px 580px',
            transition: 'opacity 0.65s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.65s cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
          onClick={() => setCurrentStage(5)}
        >
          {/* Stage Pedestal Platform & Radar Ring */}
          <circle cx="0" cy="0" r="18" fill="#030712" fillOpacity="0.92" stroke="#ec4899" strokeWidth="1.4" filter="url(#humanCardBackdrop)" />
          <circle cx="0" cy="0" r="18" fill="none" stroke="#ec4899" strokeWidth="1" opacity="0.65" className="human-halo-pulse" />
          <circle cx="0" cy="0" r="24" fill="none" stroke="#f43f5e" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.4" />
          <text x="0" y="4" textAnchor="middle" fill="#ec4899" fontSize="8.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
            05
          </text>

          {/* HIGH-DEFINITION ARTWORK: Loving Couple, Child Swinging, Heart Nebula & Intertwined Golden Rings */}
          <g transform="translate(0, -36)">
            {/* Cozy Home Threshold & Lantern Glow */}
            <path d="M -18,20 Q 0,16 18,20" fill="none" stroke="#be185d" strokeWidth="2" strokeLinecap="round" />

            {/* Pulsing Rose-Magenta Love Constellation & Rings */}
            <g transform="translate(0, -20)" className="human-heart-pulse">
              <path
                d="M 0,-4 C -4,-9 -11,-7 -10,-1 C -9,4 0,9 0,9 C 0,9 9,4 10,-1 C 11,-7 4,-9 0,-4 Z"
                fill="url(#unionHeartAura)"
                filter="url(#humanCinemaGlow)"
              />
              {/* Interlocking Golden Wedding Rings */}
              <ellipse cx="-2" cy="0" rx="3.5" ry="2" fill="none" stroke="#fde047" strokeWidth="0.9" />
              <ellipse cx="2" cy="0" rx="3.5" ry="2" fill="none" stroke="#fde047" strokeWidth="0.9" />
            </g>

            {/* Partner 1 (Left - Tall Adult Figure) */}
            <g transform="translate(-8, 0)">
              <circle cx="0" cy="-6" r="4.2" fill="url(#babySkinGrad)" />
              <path d="M -3,-8 C -2,-11 3,-10 3,-6 C 1,-7 -1,-7 -3,-8 Z" fill="#3f3f46" />
              <path d="M -2,0 L -4,12 L -6,20 M 2,0 L 2,12 L 3,20" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              <path d="M -3,-2 L 3,-2 L 2,8 L -3,8 Z" fill="#be123c" stroke="#e11d48" strokeWidth="0.6" />
              {/* Arm reaching around partner */}
              <path d="M 2,0 Q 6,2 8,2" stroke="#fed7aa" strokeWidth="1.5" strokeLinecap="round" />
              {/* Outer arm holding child's hand */}
              <path d="M -3,0 L -6,6 L -2,12" stroke="#fed7aa" strokeWidth="1.4" strokeLinecap="round" />
            </g>

            {/* Partner 2 (Right - Gentle Adult Figure) */}
            <g transform="translate(8, 0)">
              <circle cx="0" cy="-5.5" r="4.2" fill="url(#babySkinGrad)" />
              <path d="M -3,-7 C -2,-11 4,-10 4,-5 C 2,-7 -1,-7 -3,-7 Z" fill="#78350f" />
              <path d="M -2,0 L -2,12 L -3,20 M 2,0 L 4,12 L 6,20" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
              <path d="M -3,-2 L 3,-2 L 2,8 L -3,8 Z" fill="#9d174d" stroke="#db2777" strokeWidth="0.6" />
              {/* Arm around partner */}
              <path d="M -2,0 Q -6,2 -8,2" stroke="#fed7aa" strokeWidth="1.5" strokeLinecap="round" />
              {/* Outer arm holding child's other hand */}
              <path d="M 3,0 L 6,6 L 2,12" stroke="#fed7aa" strokeWidth="1.4" strokeLinecap="round" />
            </g>

            {/* Little Child in Center (Joyfully swinging between parents) */}
            <g transform="translate(0, 6)">
              <circle cx="0" cy="1" r="3.2" fill="url(#babySkinGrad)" />
              <path d="M -2,4 L 2,4 L 1.5,10 L -1.5,10 Z" fill="#10b981" />
              <path d="M -1,10 L -3,15 M 1,10 L 3,15" stroke="#0284c7" strokeWidth="1.6" strokeLinecap="round" />
              {/* Arms holding parents' hands */}
              <path d="M -1.5,5 L -6,1" stroke="#fed7aa" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 1.5,5 L 6,1" stroke="#fed7aa" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          </g>

          {/* Stage Title Card */}
          <g transform="translate(0, 26)" filter="url(#humanCardBackdrop)">
            <rect x="-44" y="-8" width="88" height="17" rx="8.5" fill="#030712" fillOpacity="0.9" stroke="#ec4899" strokeWidth="0.85" />
            <text x="0" y="2.5" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace" letterSpacing="0.4">
              UNION & KIN
            </text>
            <text x="0" y="15" textAnchor="middle" fill="#ec4899" fontSize="7" fontWeight="600" fontFamily="ui-monospace, monospace">
              Age 36–49 • Love & Family
            </text>
          </g>
        </g>

        {/* STAGE 06: MASTERY (Mentorship & Planting Seeds) */}
        <g
          id="stage-06-mastery"
          style={{
            cursor: 'pointer',
            pointerEvents: 'auto',
            opacity: currentStage === 0 ? 0.95 : currentStage === 6 ? 1 : 0.24,
            transform: `translate(745px, 705px) scale(${currentStage === 6 ? 1.08 : 1})`,
            transformOrigin: '745px 705px',
            transition: 'opacity 0.65s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.65s cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
          onClick={() => setCurrentStage(6)}
        >
          {/* Stage Pedestal Platform & Radar Ring */}
          <circle cx="0" cy="0" r="18" fill="#030712" fillOpacity="0.92" stroke="#10b981" strokeWidth="1.4" filter="url(#humanCardBackdrop)" />
          <circle cx="0" cy="0" r="18" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.65" className="human-halo-pulse-delayed" />
          <circle cx="0" cy="0" r="24" fill="none" stroke="#059669" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.4" />
          <text x="0" y="4" textAnchor="middle" fill="#10b981" fontSize="8.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
            06
          </text>

          {/* HIGH-DEFINITION ARTWORK: Distinguished Mentor Guiding Apprentice, Nurturing Glowing Sapling */}
          <g transform="translate(0, -36)">
            {/* Rich Fertile Soil Mound */}
            <path d="M -18,20 Q 0,16 18,20" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />

            {/* Mature Mentor Figure (Distinguished, Silver-Streaked Hair) */}
            <g transform="translate(-7, 0)">
              <circle cx="0" cy="-6" r="4.6" fill="url(#babySkinGrad)" />
              {/* Silver-streaked dignified hair */}
              <path d="M -4,-9 C -4,-13 4,-12 4,-7 C 2,-9 -2,-9 -4,-9 Z" fill="#94a3b8" />
              <path d="M -2,-11 Q 1,-12 3,-8" stroke="#f1f5f9" strokeWidth="0.8" fill="none" />

              {/* Dignified Scholar's / Craftsman's Tunic */}
              <path d="M -4,-1 L 4,-1 L 5,12 L -5,12 Z" fill="#065f46" stroke="#10b981" strokeWidth="0.8" />
              <path d="M -3,12 L -6,20 M 3,12 L 5,20" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" />

              {/* Gentle Outstretched Hand Guiding Apprentice */}
              <path d="M 4,2 L 12,8" stroke="#fed7aa" strokeWidth="1.8" strokeLinecap="round" />
            </g>

            {/* Young Apprentice / Student Kneeling Eagerly */}
            <g transform="translate(11, 4)">
              <circle cx="0" cy="-2" r="3.6" fill="url(#babySkinGrad)" />
              <path d="M -2,-4 C -2,-7 3,-7 3,-3" stroke="#451a03" strokeWidth="1.2" fill="none" />
              <path d="M -2,2 L 2,2 L 1,9 L -2,9 Z" fill="#0284c7" />
              <path d="M 0,9 L 2,16 M -1,9 L -3,16" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />
              {/* Hands gently touching the soil near the sapling roots */}
              <path d="M -2,4 L -6,9" stroke="#fed7aa" strokeWidth="1.4" strokeLinecap="round" />
            </g>

            {/* The Thriving Bio-Luminescent Sapling Tree */}
            <g transform="translate(4, 3)">
              {/* Sapling Trunk & Roots */}
              <path d="M 0,16 L 0,4 M 0,14 L -3,17 M 0,15 L 3,17" stroke="#92400e" strokeWidth="1.4" strokeLinecap="round" />
              {/* Radiant Emerald Branches with Glowing Leaves */}
              <path d="M 0,9 Q -6,4 -4,0 Q 0,4 0,9" fill="url(#mentorSaplingGlow)" filter="url(#humanCinemaGlow)" />
              <path d="M 0,7 Q 6,2 4,-2 Q 0,2 0,7" fill="url(#mentorSaplingGlow)" filter="url(#humanCinemaGlow)" />
              <circle cx="-4" cy="0" r="1.5" fill="#fde047" />
              <circle cx="4" cy="-2" r="1.5" fill="#34d399" />
              <circle cx="0" cy="-4" r="1.8" fill="#ffffff" filter="url(#humanCinemaGlow)" />
            </g>
          </g>

          {/* Stage Title Card */}
          <g transform="translate(0, 26)" filter="url(#humanCardBackdrop)">
            <rect x="-42" y="-8" width="84" height="17" rx="8.5" fill="#030712" fillOpacity="0.9" stroke="#10b981" strokeWidth="0.85" />
            <text x="0" y="2.5" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace" letterSpacing="0.4">
              MASTERY
            </text>
            <text x="0" y="15" textAnchor="middle" fill="#10b981" fontSize="7" fontWeight="600" fontFamily="ui-monospace, monospace">
              Age 50–64 • Planting Seeds
            </text>
          </g>
        </g>

        {/* STAGE 07: WISDOM (Golden Reflection on Garden Bench) */}
        <g
          id="stage-07-wisdom"
          style={{
            cursor: 'pointer',
            pointerEvents: 'auto',
            opacity: currentStage === 0 ? 0.95 : currentStage === 7 ? 1 : 0.24,
            transform: `translate(845px, 595px) scale(${currentStage === 7 ? 1.08 : 1})`,
            transformOrigin: '845px 595px',
            transition: 'opacity 0.65s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.65s cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
          onClick={() => setCurrentStage(7)}
        >
          {/* Stage Pedestal Platform & Radar Ring */}
          <circle cx="0" cy="0" r="18" fill="#030712" fillOpacity="0.92" stroke="#eab308" strokeWidth="1.4" filter="url(#humanCardBackdrop)" />
          <circle cx="0" cy="0" r="18" fill="none" stroke="#eab308" strokeWidth="1" opacity="0.65" className="human-halo-pulse" />
          <circle cx="0" cy="0" r="24" fill="none" stroke="#ca8a04" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.4" />
          <text x="0" y="4" textAnchor="middle" fill="#eab308" fontSize="8.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
            07
          </text>

          {/* HIGH-DEFINITION ARTWORK: Venerable Elder, Carved Bench, Antique Streetlamp & Starlight Songbird */}
          <g transform="translate(0, -36)">
            {/* Antique Wrought-Iron Streetlamp */}
            <g transform="translate(-16, -14)">
              <line x1="0" y1="34" x2="0" y2="4" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
              {/* Lamp Housing */}
              <polygon points="-4,4 4,4 3,-3 -3,-3" fill="#1e293b" stroke="#64748b" strokeWidth="0.8" />
              <circle cx="0" cy="0.5" r="2.4" fill="#fef08a" filter="url(#humanCinemaGlow)" />
              {/* Downward Warm Cone of Light */}
              <polygon points="0,4 -12,32 12,32" fill="url(#wisdomLampGlow)" />
            </g>

            {/* Classical Carved Mahogany & Iron Park Bench */}
            <path d="M -12,12 L 14,12" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-10" y1="12" x2="-10" y2="20" stroke="#334155" strokeWidth="1.6" />
            <line x1="12" y1="12" x2="12" y2="20" stroke="#334155" strokeWidth="1.6" />
            <path d="M -12,6 L 14,6" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" />

            {/* Venerable Elder Seated in Serenity */}
            <g transform="translate(0, 0)">
              {/* Textured Warm Shawl & Cardigan */}
              <path d="M -5,0 C -6,6 -4,11 0,11 C 4,11 6,6 5,0 C 4,-3 -4,-3 -5,0 Z" fill="#b45309" stroke="#d97706" strokeWidth="0.8" />
              <path d="M -2,11 L -4,19 M 2,11 L 3,19" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" />

              {/* Distinguished Elder Head with Silver Hair & Spectacles */}
              <circle cx="0" cy="-6" r="4.5" fill="url(#babySkinGrad)" />
              {/* Silver White Hair & Warm Smile */}
              <path d="M -4,-8 C -4,-12 4,-12 4,-7 C 2,-9 -2,-9 -4,-8 Z" fill="#e2e8f0" />
              {/* Spectacles Arc */}
              <circle cx="1.5" cy="-6" r="1.1" fill="none" stroke="#ca8a04" strokeWidth="0.6" />
              {/* Gentle Peaceful Smile */}
              <path d="M 0,-4 Q 2,-3 3,-4" fill="none" stroke="#b45309" strokeWidth="0.6" strokeLinecap="round" />

              {/* Hands resting on Carved Wooden Cane with Gold Handle */}
              <path d="M 2,2 L 8,8" stroke="#fed7aa" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M 7,6 Q 9,4 10,6 L 10,20" fill="none" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="9" cy="5" r="1.5" fill="#fde047" />
            </g>

            {/* Little Starlight Songbird Perched on Bench Back */}
            <g transform="translate(12, 3)" className="human-songbird-chirp">
              <ellipse cx="0" cy="0" rx="2.5" ry="1.6" fill="#38bdf8" />
              <circle cx="2" cy="-1" r="1.2" fill="#bae6fd" />
              <polygon points="3,-1 4.5,-0.8 3,-0.2" fill="#f59e0b" />
              <polygon points="-2,1 -4,3 -1,2" fill="#0284c7" />
            </g>
          </g>

          {/* Stage Title Card */}
          <g transform="translate(0, 26)" filter="url(#humanCardBackdrop)">
            <rect x="-42" y="-8" width="84" height="17" rx="8.5" fill="#030712" fillOpacity="0.9" stroke="#eab308" strokeWidth="0.85" />
            <text x="0" y="2.5" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace" letterSpacing="0.4">
              WISDOM
            </text>
            <text x="0" y="15" textAnchor="middle" fill="#eab308" fontSize="7" fontWeight="600" fontFamily="ui-monospace, monospace">
              Age 65–79 • Golden Grace
            </text>
          </g>
        </g>

        {/* STAGE 08: LEGACY & TRANSCENDENCE (The Eternal Cosmic Star) */}
        <g
          id="stage-08-legacy"
          style={{
            cursor: 'pointer',
            pointerEvents: 'auto',
            opacity: currentStage === 0 ? 0.95 : currentStage === 8 ? 1 : 0.24,
            transform: `translate(935px, 715px) scale(${currentStage === 8 ? 1.08 : 1})`,
            transformOrigin: '935px 715px',
            transition: 'opacity 0.65s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.65s cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
          onClick={() => setCurrentStage(8)}
        >
          {/* Stage Pedestal Platform & Radar Ring */}
          <circle cx="0" cy="0" r="18" fill="#030712" fillOpacity="0.92" stroke="#60a5fa" strokeWidth="1.4" filter="url(#humanCardBackdrop)" />
          <circle cx="0" cy="0" r="18" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.65" className="human-halo-pulse-delayed" />
          <circle cx="0" cy="0" r="24" fill="none" stroke="#3b82f6" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.4" />
          <text x="0" y="4" textAnchor="middle" fill="#60a5fa" fontSize="8.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
            08
          </text>

          {/* HIGH-DEFINITION ARTWORK: Ethereal Diamond Spirit, Stardust Ascension & Constellation Apotheosis */}
          <g transform="translate(0, -36)">
            {/* Luminous Ascension Nebula Aura */}
            <ellipse cx="0" cy="0" rx="20" ry="24" fill="url(#legacyApotheosisGrad)" filter="url(#humanCinemaGlow)" />

            {/* Ascending Translucent Spirit with Open Arms in Universal Embrace */}
            <g className="human-spirit-glow">
              {/* Radiant Halo & Head */}
              <circle cx="0" cy="-8" r="5" fill="#ffffff" filter="url(#humanCinemaGlow)" />
              <ellipse cx="0" cy="-12" rx="7" ry="2" fill="none" stroke="#fde047" strokeWidth="1" opacity="0.9" filter="url(#humanCinemaGlow)" />

              {/* Graceful Ascending Torso dissolving into Starlight */}
              <path
                d="M -4,-3 C -5,5 -2,12 0,18 C 2,12 5,5 4,-3 Z"
                fill="#93c5fd"
                opacity="0.85"
                filter="url(#humanCinemaGlow)"
              />

              {/* Arms spread wide in universal blessing and peace */}
              <path d="M -3,-2 Q -12,-6 -16,-3" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" filter="url(#humanCinemaGlow)" />
              <path d="M 3,-2 Q 12,-6 16,-3" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" filter="url(#humanCinemaGlow)" />
            </g>

            {/* Flowing Stardust DNA Helix & Dissolving Constellations */}
            <g className="human-spirit-stream">
              <circle cx="-6" cy="6" r="1.4" fill="#ffffff" />
              <circle cx="6" cy="8" r="1.6" fill="#fde047" />
              <circle cx="-4" cy="14" r="1.5" fill="#60a5fa" />
              <circle cx="4" cy="16" r="1.3" fill="#ffffff" />
              <line x1="-6" y1="6" x2="6" y2="8" stroke="#93c5fd" strokeWidth="0.6" strokeDasharray="1 2" opacity="0.7" />
              <line x1="-4" y1="14" x2="4" y2="16" stroke="#93c5fd" strokeWidth="0.6" strokeDasharray="1 2" opacity="0.7" />
            </g>

            {/* Constellation Star Sparkles ascending to the Cosmic Tree */}
            <g transform="translate(0, -22)">
              <circle cx="-8" cy="-2" r="1.8" fill="#ffffff" className="tree-sparkle-1" />
              <circle cx="8" cy="-5" r="2.2" fill="#60a5fa" className="tree-sparkle-2" />
              <circle cx="0" cy="-14" r="3.2" fill="#fef08a" filter="url(#humanCinemaGlow)" className="tree-sparkle-3" />
            </g>
          </g>

          {/* Stage Title Card */}
          <g transform="translate(0, 26)" filter="url(#humanCardBackdrop)">
            <rect x="-42" y="-8" width="84" height="17" rx="8.5" fill="#030712" fillOpacity="0.9" stroke="#60a5fa" strokeWidth="0.85" />
            <text x="0" y="2.5" textAnchor="middle" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace" letterSpacing="0.4">
              LEGACY
            </text>
            <text x="0" y="15" textAnchor="middle" fill="#60a5fa" fontSize="7" fontWeight="600" fontFamily="ui-monospace, monospace">
              Age 80+ • Eternal Memory
            </text>
          </g>
        </g>

        {/* =========================================================================
            SUBTLE, EVOLVING PROGRESS LINE: LEGACY STAGE TO TREE ROOTS CONFLUENCE
            Maps Stage 08 (Legacy) into an aesthetic bio-luminescent energy trail
            connecting visually into the central roots & trunk of the Birthday Tree
            ========================================================================= */}
        <g
          id="legacy-to-roots-energy-trail"
          className="pointer-events-none"
          style={{
            opacity: currentStage === 0 || currentStage === 8 ? 0.95 : 0.45,
            transition: 'opacity 0.7s cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
        >
          {/* Broad Ambient Luminous Under-Glow */}
          <path
            d="M 935,715 C 935,745 905,768 860,774 C 790,782 710,772 630,776 C 590,778 565,774 530,772"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.22"
            filter="url(#humanCinemaGlow)"
          />

          {/* Secondary Biological Fibril Conduits Weaving into the Soil */}
          <path
            d="M 860,774 C 820,780 760,775 690,776 C 650,777 620,773 590,775"
            fill="none"
            stroke="#34d399"
            strokeWidth="1.6"
            strokeDasharray="4 6"
            opacity="0.6"
          />

          {/* Primary Aesthetic Energy Trail Path */}
          <path
            d="M 935,715 C 935,745 905,768 860,774 C 790,782 710,772 630,776 C 590,778 565,774 530,772"
            fill="none"
            stroke="url(#legacyToRootsEnergyGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter="url(#humanCinemaGlow)"
          />

          {/* Dynamic Laser Starlight Photon Packets Sweeping From Legacy into Roots */}
          <path
            d="M 935,715 C 935,745 905,768 860,774 C 790,782 710,772 630,776 C 590,778 565,774 530,772"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="legacy-root-energy-flow"
            filter="url(#humanCinemaGlow)"
          />

          {/* Confluence Nexus Node at Central Tree Root Base */}
          <g transform="translate(530, 772)">
            <circle cx="0" cy="0" r="14" fill="none" stroke="#fde047" strokeWidth="1" opacity="0.6" className="legacy-root-nexus-ping" />
            <circle cx="0" cy="0" r="7" fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.8" className="human-halo-pulse" />
            <circle cx="0" cy="0" r="3.5" fill="#ffffff" filter="url(#humanCinemaGlow)" />
          </g>

          {/* Subtle Telemetry Micro-Pill Tag */}
          <g transform="translate(710, 790)" filter="url(#humanCardBackdrop)">
            <rect x="-85" y="-6" width="170" height="12" rx="6" fill="#030712" fillOpacity="0.88" stroke="#34d399" strokeWidth="0.6" />
            <text x="0" y="2.5" textAnchor="middle" fill="#a7f3d0" fontSize="6.5" fontWeight="bold" fontFamily="monospace" letterSpacing="0.5">
              LEGACY CONFLUENCE ➔ ROOT SYSTEM
            </text>
          </g>
        </g>
      </g>
    </g>
  );
};
