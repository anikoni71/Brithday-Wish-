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

        {/* 360 3D Isometric Pedestal & Volumetric Diorama Gradients */}
        <radialGradient id="pedestal3DTopGrad" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="60%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>

        <linearGradient id="pedestal3DSideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="25%" stopColor="#1e293b" />
          <stop offset="75%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        <linearGradient id="goldSpecularGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>

        <linearGradient id="brassSpecularGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>

        <linearGradient id="crystalGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="30%" stopColor="#e0f2fe" stopOpacity="0.45" />
          <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.35" />
        </linearGradient>

        <radialGradient id="diorama3DLightDome" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

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

        {/* Photorealistic Divine Light Beams & Angel Gradients */}
        <linearGradient id="divineLightBeamInfancy" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="25%" stopColor="#fef08a" stopOpacity="0.6" />
          <stop offset="65%" stopColor="#7dd3fc" stopOpacity="0.32" />
          <stop offset="90%" stopColor="#38bdf8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="divineLightCoreInfancy" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#fef08a" stopOpacity="0.65" />
          <stop offset="65%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="angelWingFeatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#fef9c3" />
          <stop offset="65%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>

        <linearGradient id="angelWingAscentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="35%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>

        <linearGradient id="angelRobeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#fef9c3" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#bae6fd" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.15" />
        </linearGradient>

        <linearGradient id="angelHaloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#fef08a" />
          <stop offset="75%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        <radialGradient id="angelBlessingAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#fef08a" stopOpacity="0.65" />
          <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="heavenlyAscensionPortal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="25%" stopColor="#fef08a" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#93c5fd" stopOpacity="0.65" />
          <stop offset="80%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="heavenGoldenRaysGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#fde047" stopOpacity="0.65" />
          <stop offset="75%" stopColor="#f59e0b" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>

        {/* Photorealistic Subsurface Skin Scattering */}
        <radialGradient id="photorealSkinSSS" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="28%" stopColor="#fef3c7" />
          <stop offset="55%" stopColor="#fed7aa" />
          <stop offset="85%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f43f5e" />
        </radialGradient>

        {/* Polished Mahogany Woodgrain */}
        <linearGradient id="mahoganyGlossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="30%" stopColor="#b45309" />
          <stop offset="60%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>

        {/* High-Precision Optical Coating Flare */}
        <linearGradient id="telescopeLensCoating" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#818cf8" stopOpacity="0.8" />
          <stop offset="80%" stopColor="#c084fc" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.95" />
        </linearGradient>

        {/* Deep Contact Ambient Occlusion Filter */}
        <filter id="humanDeepAO" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.9" />
        </filter>

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
          {/* 360 3D Isometric Cylinder Pedestal Base with Deep Contact AO */}
          <ellipse cx="0" cy="7" rx="27" ry="9.5" fill="#000000" opacity="0.75" filter="url(#humanDeepAO)" />
          {/* Extruded 3D Cylinder Wall with Brushed Metal Sheen */}
          <path d="M -22,0 L -22,6.5 C -22,11.5 22,11.5 22,6.5 L 22,0 Z" fill="url(#pedestal3DSideGrad)" stroke="#0284c7" strokeWidth="0.8" opacity="0.95" />
          {/* Top 3D Platform Surface with Specular Rim */}
          <ellipse cx="0" cy="0" rx="22" ry="7.5" fill="url(#pedestal3DTopGrad)" stroke="#38bdf8" strokeWidth="1.2" />
          <ellipse cx="0" cy="-0.5" rx="19" ry="6" fill="none" stroke="#7dd3fc" strokeWidth="0.6" strokeDasharray="4 6" opacity="0.6" />

          {/* 360 3D Continuous Rotating Astrolabe / Gyroscope Orbital Rings */}
          <g className="human-360-gyro-1">
            <ellipse cx="0" cy="0" rx="28" ry="9.5" fill="none" stroke="#38bdf8" strokeWidth="0.95" strokeDasharray="3 5" opacity="0.9" />
          </g>
          <g className="human-360-gyro-2">
            <ellipse cx="0" cy="0" rx="30" ry="10.5" fill="none" stroke="#bae6fd" strokeWidth="0.65" strokeDasharray="2 7" opacity="0.7" />
          </g>

          {/* 360 Orbiting Starlight Photons with Pinpoint Specular Gleam */}
          <g className="human-360-photon-1">
            <circle cx="0" cy="0" r="1.6" fill="#ffffff" filter="url(#humanCinemaGlow)" />
            <circle cx="0" cy="0" r="2.5" fill="#38bdf8" opacity="0.6" className="human-pinpoint-gleam" />
          </g>
          <g className="human-360-photon-2">
            <circle cx="0" cy="0" r="1.4" fill="#38bdf8" filter="url(#humanCinemaGlow)" />
          </g>

          {/* Central Stage 3D Metallic Badge */}
          <ellipse cx="0" cy="1" rx="10.5" ry="4.8" fill="#030712" stroke="#38bdf8" strokeWidth="1" />
          <text x="0" y="3.6" textAnchor="middle" fill="#38bdf8" fontSize="7.8" fontWeight="900" fontFamily="ui-monospace, monospace">
            01
          </text>

          {/* HIGH-DEFINITION CINEMATIC 3D DIORAMA: Angel Arrival, Divine Light Beam, Crystal Bassinet & Newborn */}
          <g transform="translate(0, -36)" className="human-3d-diorama-float">
            {/* Volumetric 3D Light Dome & Rim Glow */}
            <ellipse cx="0" cy="8" rx="28" ry="16" fill="url(#diorama3DLightDome)" opacity="0.8" />
            <ellipse cx="0" cy="14" rx="22" ry="7" fill="#38bdf8" opacity="0.2" filter="url(#humanCinemaGlow)" />

            {/* 1. BEAM OF SOFT DIVINE CELESTIAL LIGHT DESCENDING FROM THE STARRY COSMOS */}
            <g className="pointer-events-none">
              {/* Outer Soft Cascading Divine Cone */}
              <polygon
                points="-12,-86 12,-86 38,22 -38,22"
                fill="url(#divineLightBeamInfancy)"
                className="human-divine-beam-shimmer"
              />
              {/* Concentrated Divine Core Ray */}
              <polygon
                points="-5,-86 5,-86 20,18 -20,18"
                fill="url(#divineLightCoreInfancy)"
                opacity="0.65"
                className="human-godray-shimmer"
              />

              {/* Shimmering Stardust & Heavenly Sparkles Drifting Downward along the Divine Beam */}
              <g className="human-angel-stardust-drift">
                <circle cx="-7" cy="-62" r="1.4" fill="#ffffff" filter="url(#humanCinemaGlow)" />
                <circle cx="9" cy="-72" r="1.2" fill="#fef08a" />
                <circle cx="-14" cy="-38" r="1.1" fill="#7dd3fc" />
                <circle cx="5" cy="-28" r="1.5" fill="#fef08a" filter="url(#humanCinemaGlow)" />
                <polygon points="12,-48 13.5,-46.5 12,-45 10.5,-46.5" fill="#ffffff" className="human-pinpoint-gleam" />
              </g>
              <g className="human-angel-stardust-drift-delayed">
                <circle cx="12" cy="-58" r="1.5" fill="#fef08a" filter="url(#humanCinemaGlow)" />
                <circle cx="-10" cy="-78" r="1.2" fill="#ffffff" />
                <circle cx="15" cy="-34" r="1" fill="#bae6fd" />
                <circle cx="-6" cy="-24" r="1.3" fill="#ffffff" filter="url(#humanCinemaGlow)" />
                <polygon points="-8,-42 -6.5,-40.5 -8,-39 -9.5,-40.5" fill="#fef08a" className="human-pinpoint-gleam" />
              </g>
            </g>

            {/* 2. PHOTOREALISTIC CINEMATIC GOOD GUARDIAN ANGEL DESCENDING GENTLY */}
            <g transform="translate(0, -42)" className="human-angel-descend">
              {/* Divine Celestial Aura Behind Angel */}
              <ellipse cx="0" cy="0" rx="24" ry="26" fill="url(#angelBlessingAura)" opacity="0.6" filter="url(#humanCinemaGlow)" />

              {/* Majestic Layered Feathered Angelic Wings */}
              <g className="human-angel-wings-gentle">
                {/* Left Feathered Wing (Outer Flight Feathers + Layered Plumage) */}
                <g>
                  {/* Wing Base & Primary Covert Feathers */}
                  <path
                    d="M -3,-6 C -16,-26 -28,-22 -30,-6 C -30,6 -20,10 -4,0 Z"
                    fill="url(#angelWingFeatherGrad)"
                    stroke="#ffffff"
                    strokeWidth="0.75"
                    filter="url(#humanSubtleDrop)"
                  />
                  {/* Articulated Primary Flight Feather Flutes */}
                  <path d="M -8,-9 C -16,-22 -24,-18 -26,-6" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.9" />
                  <path d="M -12,-8 C -20,-17 -26,-12 -28,-3" fill="none" stroke="#fef9c3" strokeWidth="0.6" opacity="0.85" />
                  <path d="M -6,-5 C -13,-12 -18,-7 -20,1" fill="none" stroke="#e0f2fe" strokeWidth="0.6" opacity="0.8" />
                  {/* Translucent Gossamer Edge Feather Plumes */}
                  <path d="M -26,-6 Q -31,-2 -28,4 Q -23,8 -16,6" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.95" />
                </g>

                {/* Right Feathered Wing (Outer Flight Feathers + Layered Plumage) */}
                <g>
                  {/* Wing Base & Primary Covert Feathers */}
                  <path
                    d="M 3,-6 C 16,-26 28,-22 30,-6 C 30,6 20,10 4,0 Z"
                    fill="url(#angelWingFeatherGrad)"
                    stroke="#ffffff"
                    strokeWidth="0.75"
                    filter="url(#humanSubtleDrop)"
                  />
                  {/* Articulated Primary Flight Feather Flutes */}
                  <path d="M 8,-9 C 16,-22 24,-18 26,-6" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.9" />
                  <path d="M 12,-8 C 20,-17 26,-12 28,-3" fill="none" stroke="#fef9c3" strokeWidth="0.6" opacity="0.85" />
                  <path d="M 6,-5 C 13,-12 18,-7 20,1" fill="none" stroke="#e0f2fe" strokeWidth="0.6" opacity="0.8" />
                  {/* Translucent Gossamer Edge Feather Plumes */}
                  <path d="M 26,-6 Q 31,-2 28,4 Q 23,8 16,6" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.95" />
                </g>
              </g>

              {/* Radiant Starlight Halo Above Angel Head */}
              <ellipse cx="0" cy="-17" rx="7.5" ry="2.2" fill="none" stroke="url(#angelHaloGrad)" strokeWidth="1.3" opacity="0.95" filter="url(#humanCinemaGlow)" />
              <polygon points="0,-19 1.5,-17 0,-15 -1.5,-17" fill="#ffffff" className="human-pinpoint-gleam" />

              {/* Flowing Celestial Gossamer Robe Billowing Downward in Soft Zero-G Folds */}
              <g className="human-angel-robe-flow">
                <path
                  d="M -4.5,-2 C -7,8 -8.5,18 -3,27 C 0,29 3,29 6,27 C 9,18 7,8 4.5,-2 Z"
                  fill="url(#angelRobeGrad)"
                  stroke="#ffffff"
                  strokeWidth="0.65"
                  opacity="0.92"
                />
                {/* Golden Embroidered Hem Ribbon Ribs */}
                <path d="M -3.5,6 Q 0,8 3.5,6" fill="none" stroke="url(#goldSpecularGrad)" strokeWidth="0.6" opacity="0.8" />
                <path d="M -4,14 Q 0,17 4,14" fill="none" stroke="url(#goldSpecularGrad)" strokeWidth="0.6" opacity="0.8" />
                <path d="M -3,25 Q 1,28 5,25" fill="none" stroke="#fef08a" strokeWidth="0.8" opacity="0.9" />
              </g>

              {/* Serene Angel Face with Loving Maternal Expression & Golden Starlight Curls */}
              <circle cx="0" cy="-9" r="4.2" fill="url(#photorealSkinSSS)" />
              {/* Cascading Golden Locks */}
              <path d="M -4,-11 C -4,-15 4,-15 4,-11 C 3,-13 -3,-13 -4,-11 Z" fill="#fef08a" />
              <path d="M -4,-9 Q -6,-4 -4,1" fill="none" stroke="#fde047" strokeWidth="0.9" strokeLinecap="round" />
              <path d="M 4,-9 Q 6,-4 4,1" fill="none" stroke="#fde047" strokeWidth="0.9" strokeLinecap="round" />
              {/* Gentle Downcast Eyelashes Gazing Tenderly at the Baby */}
              <path d="M -2.2,-8.8 Q -1.2,-7.6 -0.4,-8.8" fill="none" stroke="#451a03" strokeWidth="0.65" strokeLinecap="round" />
              <path d="M 0.4,-8.8 Q 1.2,-7.6 2.2,-8.8" fill="none" stroke="#451a03" strokeWidth="0.65" strokeLinecap="round" />
              {/* Soft Rosy Cheeks */}
              <circle cx="-1.6" cy="-7.5" r="1.1" fill="#fb7185" opacity="0.75" />
              <circle cx="1.6" cy="-7.5" r="1.1" fill="#fb7185" opacity="0.75" />
              {/* Sweet Seraphic Smile */}
              <path d="M -1,-6.3 Q 0,-5.4 1,-6.3" fill="none" stroke="#b91c1c" strokeWidth="0.55" strokeLinecap="round" />

              {/* Loving Outstretched Angel Arms & Cradled Newborn Delivered in Flight */}
              <path d="M -4.5,-2 Q -9,7 -3.5,13.5" fill="none" stroke="url(#photorealSkinSSS)" strokeWidth="2.1" strokeLinecap="round" />
              <path d="M 4.5,-2 Q 9,7 3.5,13.5" fill="none" stroke="url(#photorealSkinSSS)" strokeWidth="2.1" strokeLinecap="round" />
              {/* Tender Cradling Hands with Subsurface Skin Scattering */}
              <ellipse cx="-3.5" cy="14" rx="1.8" ry="1.3" fill="url(#photorealSkinSSS)" />
              <ellipse cx="3.5" cy="14" rx="1.8" ry="1.3" fill="url(#photorealSkinSSS)" />

              {/* Swaddled Celestial Infant Nestled in Angel's Loving Hands in Flight Descent */}
              <g transform="translate(0, 11)">
                {/* Luminous Presentation Aura & Starlight Cocoon */}
                <ellipse cx="0" cy="0" rx="9.5" ry="6.5" fill="url(#angelBlessingAura)" opacity="0.95" filter="url(#humanCinemaGlow)" />
                {/* Golden & Silk Swaddle Wrap */}
                <ellipse cx="0" cy="0.5" rx="7" ry="4.5" fill="url(#cradleBlanketGrad)" stroke="#fef08a" strokeWidth="0.8" />
                <path d="M -4.5,-1 Q 0,3 4.5,-1" fill="none" stroke="url(#goldSpecularGrad)" strokeWidth="0.75" />
                <path d="M -3.5,1.5 Q 0,4.5 3.5,1.5" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.8" />
                {/* Tiny Peaceful Newborn Face with Subsurface Scattering */}
                <circle cx="-2.5" cy="-0.5" r="2.8" fill="url(#photorealSkinSSS)" />
                {/* Sleeping Eyelash */}
                <path d="M -3.2,-0.5 Q -2.5,0.3 -1.8,-0.5" fill="none" stroke="#581c87" strokeWidth="0.55" strokeLinecap="round" />
                {/* Rosy Baby Cheek */}
                <circle cx="-1.8" cy="0.4" r="0.8" fill="#fb7185" opacity="0.8" />
                {/* Tiny Golden Hair Tuft */}
                <path d="M -3.8,-1.8 Q -3,-3.2 -2,-2" fill="none" stroke="#d97706" strokeWidth="0.6" strokeLinecap="round" />
                {/* Divine Gift of Life Halo */}
                <ellipse cx="0" cy="0" rx="11" ry="7.5" fill="none" stroke="#fde047" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.85" className="human-halo-pulse" />
              </g>

              {/* Stream of Divine Life Starlight Flowing Down from Angel's Hands into Bassinet */}
              <g className="human-divine-beam-shimmer">
                <line x1="0" y1="18" x2="0" y2="34" stroke="url(#heavenGoldenRaysGrad)" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.8" />
                <circle cx="0" cy="24" r="1.2" fill="#ffffff" filter="url(#humanCinemaGlow)" />
                <circle cx="0" cy="30" r="1" fill="#fef08a" />
              </g>
            </g>

            {/* Companion Celestial Cherub Herald Gliding & Circling in Flight Escort */}
            <g transform="translate(18, -62)" className="human-cherub-flying pointer-events-none">
              <ellipse cx="0" cy="-5" rx="3.5" ry="1.2" fill="none" stroke="url(#angelHaloGrad)" strokeWidth="0.8" opacity="0.9" />
              <circle cx="0" cy="0" r="2.8" fill="url(#photorealSkinSSS)" />
              {/* Mini Fluttering Starlight Wings */}
              <path d="M -1,-1 Q -6,-8 -3,-2 Z" fill="url(#angelWingFeatherGrad)" stroke="#ffffff" strokeWidth="0.4" />
              <path d="M 1,-1 Q 6,-8 3,-2 Z" fill="url(#angelWingFeatherGrad)" stroke="#ffffff" strokeWidth="0.4" />
              {/* Golden Hair & Smile */}
              <path d="M -2.5,-1.5 Q 0,-4.5 2.5,-1.5" fill="#fef08a" />
              <circle cx="0" cy="0" r="0.8" fill="#fb7185" opacity="0.6" />
            </g>

            {/* 3. CRYSTAL BASSINET, NEWBORN BABY & CELESTIAL MOBILE */}
            {/* Polished Cast Brass Curved Rockers with Micro-Rivets */}
            <path d="M -21,16 Q 0,26 21,16" fill="none" stroke="url(#brassSpecularGrad)" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="-16" cy="17" r="0.9" fill="#fef08a" />
            <circle cx="16" cy="17" r="0.9" fill="#fef08a" />
            <path d="M -16,15 L -12,5 M 16,15 L 12,5" stroke="url(#brassSpecularGrad)" strokeWidth="1.8" strokeLinecap="round" />

            {/* Carved Wicker & Crystal Bassinet Shell with Starlight Inlays & Micro-Weave Pattern */}
            <path
              d="M -20,4 C -22,-5 -14,-9.5 0,-9.5 C 14,-9.5 22,-5 20,4 C 18,13.5 13,16.5 0,16.5 C -13,16.5 -18,13.5 -20,4 Z"
              fill="url(#cradleWoodGrad)"
              stroke="#7dd3fc"
              strokeWidth="1.3"
              filter="url(#humanSubtleDrop)"
            />
            {/* Micro Wicker Horizontal Texture Lines */}
            <path d="M -16,6 Q 0,12 16,6" fill="none" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="1.5 2" opacity="0.8" />
            <path d="M -18,1 Q 0,7 18,1" fill="none" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="1.5 2" opacity="0.8" />
            {/* Crystal Glass Canopy Rim Highlight */}
            <path d="M -17,-2 C -11,-8.5 11,-8.5 17,-2" fill="none" stroke="url(#crystalGlassGrad)" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />

            {/* Ergonomic Memory Cushion & Satin Pillow */}
            <ellipse cx="0" cy="2" rx="15" ry="7.5" fill="#f8fafc" opacity="0.95" />
            <ellipse cx="-8" cy="1" rx="5.5" ry="4" fill="#e2e8f0" />

            {/* Realistic Swaddled Sleeping Baby with Breathing Motion & Subsurface Skin Scattering */}
            <g className="human-baby-breathe">
              {/* Swaddling Blanket with Quilted Diamond Stitches & Embroidered Golden Hem */}
              <path
                d="M -8.5,4 C -4.5,1 6.5,1 13.5,4 C 15.5,8 11.5,11.5 5,11.5 C -1,11.5 -7.5,9.5 -8.5,4 Z"
                fill="url(#cradleBlanketGrad)"
                stroke="#bae6fd"
                strokeWidth="0.9"
              />
              {/* Quilted Diamond Texture Over Blanket */}
              <path d="M -6,5 L -2,9 L 2,5 L 6,9 L 10,5" fill="none" stroke="#ffffff" strokeWidth="0.45" opacity="0.6" />
              <path d="M -4,7 L 0,3 L 4,7 L 8,3" fill="none" stroke="#ffffff" strokeWidth="0.45" opacity="0.6" />
              <path d="M -2,3 C 3,4 8,4 10,8" stroke="#38bdf8" strokeWidth="0.9" fill="none" opacity="0.75" />
              <path d="M -5,4 Q 3,7 11,6" stroke="url(#goldSpecularGrad)" strokeWidth="0.7" fill="none" opacity="0.85" />

              {/* Baby Head & Sweet Peaceful Face with 5-Stop Photoreal Subsurface Scattering */}
              <circle cx="-6.5" cy="1" r="4.5" fill="url(#photorealSkinSSS)" />
              {/* Delicate Eyelash Arc & Natural Shadow */}
              <path d="M -7.6,1 Q -6.5,2.4 -5.4,1" fill="none" stroke="#581c87" strokeWidth="0.8" strokeLinecap="round" />
              <path d="M -6.8,1.7 L -6.8,2.3 M -6.2,1.6 L -6.0,2.2" stroke="#78350f" strokeWidth="0.4" />
              {/* Soft Rosy 3D Cheek with Specular Highlight */}
              <circle cx="-5.2" cy="2.3" r="1.4" fill="#fb7185" opacity="0.8" />
              <circle cx="-5.5" cy="2" r="0.4" fill="#ffffff" opacity="0.7" />
              {/* Tiny Soft Mouth */}
              <path d="M -6.2,3.3 Q -5.6,3.8 -5.0,3.3" fill="none" stroke="#e11d48" strokeWidth="0.6" strokeLinecap="round" />
              {/* Baby Ear & Fine Hair Strands */}
              <circle cx="-10.6" cy="1" r="1.2" fill="#fed7aa" />
              <path d="M -9.6,-0.2 Q -8.5,-2.6 -6.5,-1.2" fill="none" stroke="#92400e" strokeWidth="0.9" strokeLinecap="round" />
              <path d="M -9.2,-0.8 Q -8,-2.8 -6.2,-1.8" fill="none" stroke="#d97706" strokeWidth="0.5" strokeLinecap="round" />
              {/* Tiny Hand over Swaddle with Defined Fingers */}
              <ellipse cx="-1" cy="3.5" rx="1.6" ry="1.2" fill="#fed7aa" />
              <line x1="-1.4" y1="4.3" x2="-1.4" y2="4.7" stroke="#fb923c" strokeWidth="0.5" />
              <line x1="-0.9" y1="4.3" x2="-0.9" y2="4.7" stroke="#fb923c" strokeWidth="0.5" />
            </g>

            {/* Articulated Polished Brass Mobile Arm */}
            <path d="M 13,4 L 15,-15 L 0,-15" fill="none" stroke="url(#brassSpecularGrad)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="15" cy="-15" r="1.3" fill="#fef08a" />

            {/* 360-Degree Revolving Celestial Mobile with Photorealistic 3D Orbs */}
            <g transform="translate(0, -15)" className="human-star-mobile">
              <line x1="0" y1="0" x2="-9.5" y2="7.5" stroke="#cbd5e1" strokeWidth="0.8" />
              <line x1="0" y1="0" x2="9.5" y2="7.5" stroke="#cbd5e1" strokeWidth="0.8" />
              <line x1="0" y1="0" x2="0" y2="9.5" stroke="#cbd5e1" strokeWidth="0.8" />

              {/* Mini Crescent Luna with Realistic Crater Texture & Rim Light */}
              <path d="M -10.5,6.5 A 3.2 3.2 0 0 0 -8.5,10.2 A 2.4 2.4 0 0 1 -10.5,6.5 Z" fill="#fef08a" />
              <circle cx="-9.8" cy="8.2" r="0.6" fill="#fde047" opacity="0.9" />
              <circle cx="-9.2" cy="9.2" r="0.4" fill="#fde047" opacity="0.8" />

              {/* Mini Saturn with 360 Tilted 3D Ring with Shadow */}
              <circle cx="9.5" cy="7.5" r="2.4" fill="#f59e0b" />
              <ellipse cx="9.5" cy="7.5" rx="5" ry="1.5" fill="none" stroke="url(#goldSpecularGrad)" strokeWidth="0.9" transform="rotate(-18 9.5 7.5)" />
              <path d="M 7.5,7.5 A 2 0.8 0 0 0 11.5,7.5" fill="none" stroke="#78350f" strokeWidth="0.6" opacity="0.6" transform="rotate(-18 9.5 7.5)" />

              {/* Twinkling Diamond Starlight Crystal with 4-Point Specular Cross */}
              <polygon points="0,6 1.5,9.5 0,13 -1.5,9.5" fill="#ffffff" filter="url(#humanCinemaGlow)" />
              <line x1="-3" y1="9.5" x2="3" y2="9.5" stroke="#ffffff" strokeWidth="0.7" className="human-pinpoint-gleam" />
            </g>
          </g>

          {/* Stage Title Card (Frosted Glassmorphism Pill) */}
          <g transform="translate(0, 26)" filter="url(#humanCardBackdrop)">
            <rect x="-44" y="-8" width="88" height="17" rx="8.5" fill="#030712" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="0.85" />
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
          {/* 360 3D Isometric Cylinder Pedestal Base with Deep Contact AO */}
          <ellipse cx="0" cy="7" rx="27" ry="9.5" fill="#000000" opacity="0.75" filter="url(#humanDeepAO)" />
          <path d="M -22,0 L -22,6.5 C -22,11.5 22,11.5 22,6.5 L 22,0 Z" fill="url(#pedestal3DSideGrad)" stroke="#059669" strokeWidth="0.8" opacity="0.95" />
          <ellipse cx="0" cy="0" rx="22" ry="7.5" fill="url(#pedestal3DTopGrad)" stroke="#34d399" strokeWidth="1.2" />
          <ellipse cx="0" cy="-0.5" rx="19" ry="6" fill="none" stroke="#a7f3d0" strokeWidth="0.6" strokeDasharray="4 6" opacity="0.6" />

          {/* 360 3D Continuous Rotating Astrolabe / Gyroscope Orbital Rings */}
          <g className="human-360-gyro-1">
            <ellipse cx="0" cy="0" rx="28" ry="9.5" fill="none" stroke="#34d399" strokeWidth="0.95" strokeDasharray="3 5" opacity="0.9" />
          </g>
          <g className="human-360-gyro-2">
            <ellipse cx="0" cy="0" rx="30" ry="10.5" fill="none" stroke="#a7f3d0" strokeWidth="0.65" strokeDasharray="2 7" opacity="0.7" />
          </g>

          {/* 360 Orbiting Starlight Photons */}
          <g className="human-360-photon-1">
            <circle cx="0" cy="0" r="1.6" fill="#ffffff" filter="url(#humanCinemaGlow)" />
            <circle cx="0" cy="0" r="2.5" fill="#34d399" opacity="0.6" className="human-pinpoint-gleam" />
          </g>
          <g className="human-360-photon-2">
            <circle cx="0" cy="0" r="1.4" fill="#34d399" filter="url(#humanCinemaGlow)" />
          </g>

          {/* Central Stage 3D Metallic Badge */}
          <ellipse cx="0" cy="1" rx="10.5" ry="4.8" fill="#030712" stroke="#34d399" strokeWidth="1" />
          <text x="0" y="3.6" textAnchor="middle" fill="#34d399" fontSize="7.8" fontWeight="900" fontFamily="ui-monospace, monospace">
            02
          </text>

          {/* HIGH-DEFINITION CINEMATIC 3D DIORAMA: Running Child, 3D Balloon, Meadow & Butterflies */}
          <g transform="translate(0, -36)" className="human-3d-diorama-float">
            {/* Volumetric 3D Light Dome */}
            <ellipse cx="0" cy="8" rx="28" ry="16" fill="url(#diorama3DLightDome)" opacity="0.75" />

            {/* Layered 3D Grassy Meadow Knoll with Bio-Luminescent Wildflowers & Morning Dewdrops */}
            <path d="M -25,20 Q 0,14.5 25,20" fill="none" stroke="#047857" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M -21,18 Q 0,13.5 21,18" fill="none" stroke="#10b981" strokeWidth="1.6" strokeLinecap="round" />
            {/* Dewdrop Pinpoints */}
            <circle cx="-18" cy="17" r="1.8" fill="#fde047" />
            <circle cx="-18" cy="16.5" r="0.6" fill="#ffffff" className="human-pinpoint-gleam" />
            <circle cx="-13" cy="18" r="1.4" fill="#34d399" />
            <circle cx="18" cy="17" r="1.8" fill="#ec4899" />
            <circle cx="13" cy="18" r="1.4" fill="#38bdf8" />

            {/* Realistic Running Child Figure with Dynamic Kinetic Stride */}
            <g className="human-child-stride">
              {/* Running Sneakers with Tread & Defined Red Lace Loops */}
              <ellipse cx="-8.5" cy="18" rx="3" ry="1.5" fill="#ffffff" />
              <path d="M -10,17 L -7,17" stroke="#ef4444" strokeWidth="0.8" />
              <path d="M -9,16 Q -8.5,15 -8,16" fill="none" stroke="#ef4444" strokeWidth="0.5" />
              <ellipse cx="9.5" cy="15" rx="3" ry="1.5" fill="#ffffff" />
              <path d="M 8,14 L 11,14" stroke="#ef4444" strokeWidth="0.8" />
              <path d="M 9,13 Q 9.5,12 10,13" fill="none" stroke="#ef4444" strokeWidth="0.5" />

              {/* Legs in Active Running Motion with Denim Twill Folds */}
              <path d="M -2,7 L -7.5,17" stroke="#0284c7" strokeWidth="2.7" strokeLinecap="round" />
              <path d="M 2,7 L 8.5,14" stroke="#0284c7" strokeWidth="2.7" strokeLinecap="round" />
              <line x1="-6.5" y1="12" x2="-4" y2="12" stroke="#bae6fd" strokeWidth="0.7" />
              <line x1="5.5" y1="10" x2="7.5" y2="10" stroke="#bae6fd" strokeWidth="0.7" />

              {/* Torso in Vibrant Wind-Swept Sport Jacket with Striped Polo & Zipper Track */}
              <path d="M -3.5,-1 L 3.5,-1 L 2.5,8 L -2.5,8 Z" fill="#10b981" stroke="#059669" strokeWidth="0.75" />
              <line x1="0" y1="-1" x2="0" y2="8" stroke="#34d399" strokeWidth="0.6" />
              <line x1="-3" y1="2" x2="3" y2="2" stroke="#fef08a" strokeWidth="1.2" />
              <line x1="-3" y1="5" x2="3" y2="5" stroke="#fef08a" strokeWidth="1.2" />

              {/* Left Arm extending backward with Natural Hand */}
              <path d="M -3.5,0 L -10,5.5" stroke="#fed7aa" strokeWidth="1.9" strokeLinecap="round" />
              <circle cx="-10.5" cy="6" r="1.1" fill="#fed7aa" />

              {/* Child Head with Joyful Expression, Wind-Swept Hair & Eye Catchlight */}
              <circle cx="0" cy="-6" r="4.7" fill="url(#photorealSkinSSS)" />
              {/* Dynamic Wind-Tousled Hairlocks with High-Shine Highlights */}
              <path d="M -4.5,-8 Q 0,-13.5 4.5,-7 Q 1,-11.5 -3.5,-9" fill="#92400e" />
              <path d="M -2,-10 Q 1,-13 3.5,-8.5" fill="none" stroke="#d97706" strokeWidth="0.6" />
              {/* Happy Smiling Eye with Eye Catchlight */}
              <circle cx="1.6" cy="-6" r="1" fill="#1e293b" />
              <circle cx="1.8" cy="-6.2" r="0.35" fill="#ffffff" />
              {/* Joyful Laughing Mouth with Glimpse of White Teeth */}
              <path d="M 0.5,-4 Q 2,-2.6 3.5,-4" fill="none" stroke="#b91c1c" strokeWidth="0.8" strokeLinecap="round" />
              <line x1="1.3" y1="-3.5" x2="2.7" y2="-3.5" stroke="#ffffff" strokeWidth="0.5" />
              <circle cx="1.6" cy="-4.5" r="1.4" fill="#fb7185" opacity="0.75" />

              {/* Right Arm raised up holding the balloon string */}
              <path d="M 3.5,0 L 9,-5" stroke="#fed7aa" strokeWidth="1.9" strokeLinecap="round" />
              <circle cx="9.5" cy="-5.5" r="1.1" fill="#fed7aa" />
            </g>

            {/* Twisted Golden Balloon Cord with Floating Knot */}
            <path d="M 9.5,-5.5 Q 17,-18 14,-28" fill="none" stroke="url(#goldSpecularGrad)" strokeWidth="0.95" strokeDasharray="2 2" />

            {/* 360 3D Volumetric Glossy Candy-Apple Balloon with Triple Specular Highlights */}
            <g transform="translate(14, -34)" className="human-balloon-bob">
              <ellipse cx="0" cy="0" rx="8.5" ry="10.5" fill="url(#balloonSphereGrad)" filter="url(#humanCinemaGlow)" />
              <polygon points="0,10.5 -2.5,13 2.5,13" fill="#881337" />
              {/* Primary Key-Light Specular Arc */}
              <path d="M -3.8,-7 A 6.5 8 0 0 1 1.2,-2.5" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.95" strokeLinecap="round" />
              <circle cx="-2.2" cy="-4.5" r="1.2" fill="#ffffff" opacity="0.85" />
              {/* Secondary Ground Bounce Light Highlight */}
              <path d="M -3.5,6 A 6 7 0 0 0 2,7.5" fill="none" stroke="#fda4af" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
            </g>

            {/* Fluttering Starlight Morpho Butterfly with 3D Translucent Wings & Antennae */}
            <g transform="translate(-14, -8)" className="human-butterfly-flutter">
              <ellipse cx="0" cy="0" rx="1.2" ry="2.4" fill="#1e293b" />
              <line x1="0" y1="-2" x2="-1.5" y2="-4" stroke="#fde047" strokeWidth="0.5" />
              <line x1="0" y1="-2" x2="1.5" y2="-4" stroke="#fde047" strokeWidth="0.5" />
              <path d="M 0,-1 Q -5,-6.5 -3.2,0 Q -5,3.8 0,1.4" fill="#ec4899" opacity="0.95" stroke="#fbcfe8" strokeWidth="0.5" />
              <path d="M 0,-1 Q 5,-6.5 3.2,0 Q 5,3.8 0,1.4" fill="#ec4899" opacity="0.95" stroke="#fbcfe8" strokeWidth="0.5" />
              <circle cx="-2.5" cy="-2.5" r="0.5" fill="#ffffff" opacity="0.9" />
              <circle cx="2.5" cy="-2.5" r="0.5" fill="#ffffff" opacity="0.9" />
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
          {/* 360 3D Isometric Cylinder Pedestal Base with Deep Contact AO */}
          <ellipse cx="0" cy="7" rx="27" ry="9.5" fill="#000000" opacity="0.75" filter="url(#humanDeepAO)" />
          <path d="M -22,0 L -22,6.5 C -22,11.5 22,11.5 22,6.5 L 22,0 Z" fill="url(#pedestal3DSideGrad)" stroke="#4f46e5" strokeWidth="0.8" opacity="0.95" />
          <ellipse cx="0" cy="0" rx="22" ry="7.5" fill="url(#pedestal3DTopGrad)" stroke="#818cf8" strokeWidth="1.2" />
          <ellipse cx="0" cy="-0.5" rx="19" ry="6" fill="none" stroke="#c7d2fe" strokeWidth="0.6" strokeDasharray="4 6" opacity="0.6" />

          {/* 360 3D Continuous Rotating Astrolabe / Gyroscope Orbital Rings */}
          <g className="human-360-gyro-1">
            <ellipse cx="0" cy="0" rx="28" ry="9.5" fill="none" stroke="#818cf8" strokeWidth="0.95" strokeDasharray="3 5" opacity="0.9" />
          </g>
          <g className="human-360-gyro-2">
            <ellipse cx="0" cy="0" rx="30" ry="10.5" fill="none" stroke="#c7d2fe" strokeWidth="0.65" strokeDasharray="2 7" opacity="0.7" />
          </g>

          {/* 360 Orbiting Starlight Photons */}
          <g className="human-360-photon-1">
            <circle cx="0" cy="0" r="1.6" fill="#ffffff" filter="url(#humanCinemaGlow)" />
            <circle cx="0" cy="0" r="2.5" fill="#818cf8" opacity="0.6" className="human-pinpoint-gleam" />
          </g>
          <g className="human-360-photon-2">
            <circle cx="0" cy="0" r="1.4" fill="#818cf8" filter="url(#humanCinemaGlow)" />
          </g>

          {/* Central Stage 3D Metallic Badge */}
          <ellipse cx="0" cy="1" rx="10.5" ry="4.8" fill="#030712" stroke="#818cf8" strokeWidth="1" />
          <text x="0" y="3.6" textAnchor="middle" fill="#818cf8" fontSize="7.8" fontWeight="900" fontFamily="ui-monospace, monospace">
            03
          </text>

          {/* HIGH-DEFINITION CINEMATIC 3D DIORAMA: Student, Holographic Tome, 3D Galaxy & Telescope */}
          <g transform="translate(0, -36)" className="human-3d-diorama-float">
            {/* Volumetric 3D Light Dome */}
            <ellipse cx="0" cy="8" rx="28" ry="16" fill="url(#diorama3DLightDome)" opacity="0.75" />

            {/* Faceted Cosmic Granite Seat Monolith with Quartz Vein */}
            <polygon points="-19,14 -13,8 5,7 19,11 17,18 -17,19" fill="#1e293b" stroke="#475569" strokeWidth="1.1" />
            <path d="M -12,12 Q 0,10 14,14" stroke="#94a3b8" strokeWidth="0.8" fill="none" opacity="0.8" />

            {/* Astronomical Brass Telescope on Articulated 3D Tripod with Coated Lens Flare */}
            <g transform="translate(-19, -4)">
              <line x1="0" y1="18" x2="-5.5" y2="25.5" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="0" y1="18" x2="5.5" y2="25.5" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="0" y1="18" x2="0" y2="25.5" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
              {/* Knurled Adjustment Ring & Counterweight */}
              <circle cx="0" cy="18" r="1.6" fill="url(#brassSpecularGrad)" />
              {/* Telescope Barrel angled up with golden lacquer & dials */}
              <line x1="-8.5" y1="21" x2="6.5" y2="10" stroke="url(#goldSpecularGrad)" strokeWidth="2.8" strokeLinecap="round" />
              {/* Multi-Coated Optical Lens with Anti-Reflective Flare */}
              <ellipse cx="7.5" cy="9" rx="2.5" ry="1.8" fill="url(#telescopeLensCoating)" filter="url(#humanCinemaGlow)" transform="rotate(-38 7.5 9)" />
              <circle cx="8" cy="8.5" r="0.6" fill="#ffffff" className="human-pinpoint-gleam" />
              <circle cx="-7.5" cy="20" r="1.4" fill="url(#brassSpecularGrad)" />
            </g>

            {/* Youth Figure in Indigo Hoodie & Jeans */}
            <path d="M 0,8 L 6.5,14 L 6.5,23" stroke="#1e3a8a" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M -4,8 L -2,15 L -2,23" stroke="#1d4ed8" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" />

            {/* Modern Indigo Hoodie with Folds, Zipper & Fabric Ribbing */}
            <path d="M -6.5,0 C -7.5,5 -4.5,8 0,8 C 4.5,8 7.5,5 6.5,0 C 5.5,-4 -5.5,-4 -6.5,0 Z" fill="#4338ca" stroke="#6366f1" strokeWidth="0.9" />
            <line x1="0" y1="-2" x2="0" y2="7" stroke="#a5b4fc" strokeWidth="0.65" />
            <path d="M -5.5,1 L 0,6" stroke="#4338ca" strokeWidth="2.3" strokeLinecap="round" />
            <path d="M 5.5,1 L 0,6" stroke="#4338ca" strokeWidth="2.3" strokeLinecap="round" />

            {/* Head with Contemporary Hair & Eye Catchlight */}
            <circle cx="0" cy="-6" r="4.7" fill="url(#photorealSkinSSS)" />
            <path d="M -4.5,-8 C -4.5,-12 3.5,-12 4.5,-7 C 2,-9 -2,-9 -4.5,-8 Z" fill="#451a03" />
            <line x1="-1.4" y1="-5.5" x2="1.4" y2="-5.5" stroke="#1e293b" strokeWidth="0.9" />
            <circle cx="0" cy="-5.5" r="0.3" fill="#ffffff" />

            {/* Open Holographic Folio of Wisdom with Micro-Runes */}
            <path d="M -7.5,6 L 0,8.5 L 7.5,6 L 7.5,10 L 0,12.5 L -7.5,10 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="0.95" />
            <line x1="0" y1="8.5" x2="0" y2="12.5" stroke="#ffffff" strokeWidth="0.9" />
            {/* Glowing Text Lines in Folio */}
            <line x1="-5.5" y1="7.2" x2="-1.5" y2="7.8" stroke="#ffffff" strokeWidth="0.4" opacity="0.8" />
            <line x1="1.5" y1="7.8" x2="5.5" y2="7.2" stroke="#ffffff" strokeWidth="0.4" opacity="0.8" />

            {/* Holographic Knowledge Beam Rising into the Sky */}
            <polygon points="-7.5,6 7.5,6 13.5,-18 -13.5,-18" fill="url(#studentHoloBeam)" />

            {/* 360 3D Holographic Galaxy Sphere & DNA Double Helix Ascent with Base Pairs */}
            <g transform="translate(0, -19)" className="human-holo-swirl">
              <ellipse cx="0" cy="0" rx="9.5" ry="3.8" fill="none" stroke="#38bdf8" strokeWidth="0.95" opacity="0.9" strokeDasharray="2 2" />
              <ellipse cx="0" cy="0" rx="4.2" ry="8.5" fill="none" stroke="#a855f7" strokeWidth="0.75" opacity="0.8" />
              <circle cx="0" cy="0" r="2" fill="#ffffff" filter="url(#humanCinemaGlow)" />
              {/* DNA Base Pairs */}
              <line x1="-3" y1="-2" x2="3" y2="2" stroke="#67e8f9" strokeWidth="0.6" opacity="0.9" />
              <line x1="-3" y1="2" x2="3" y2="-2" stroke="#c084fc" strokeWidth="0.6" opacity="0.9" />
              <circle cx="-5" cy="-3" r="1.4" fill="#a7f3d0" className="human-photon-spark-1" />
              <circle cx="6" cy="-4" r="1.6" fill="#fde047" className="human-photon-spark-2" />
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
          {/* 360 3D Isometric Cylinder Pedestal Base with Deep Contact AO */}
          <ellipse cx="0" cy="7" rx="27" ry="9.5" fill="#000000" opacity="0.75" filter="url(#humanDeepAO)" />
          <path d="M -22,0 L -22,6.5 C -22,11.5 22,11.5 22,6.5 L 22,0 Z" fill="url(#pedestal3DSideGrad)" stroke="#b45309" strokeWidth="0.8" opacity="0.95" />
          <ellipse cx="0" cy="0" rx="22" ry="7.5" fill="url(#pedestal3DTopGrad)" stroke="#f59e0b" strokeWidth="1.2" />
          <ellipse cx="0" cy="-0.5" rx="19" ry="6" fill="none" stroke="#fde047" strokeWidth="0.6" strokeDasharray="4 6" opacity="0.6" />

          {/* 360 3D Continuous Rotating Astrolabe / Gyroscope Orbital Rings */}
          <g className="human-360-gyro-1">
            <ellipse cx="0" cy="0" rx="28" ry="9.5" fill="none" stroke="#f59e0b" strokeWidth="0.95" strokeDasharray="3 5" opacity="0.9" />
          </g>
          <g className="human-360-gyro-2">
            <ellipse cx="0" cy="0" rx="30" ry="10.5" fill="none" stroke="#fde047" strokeWidth="0.65" strokeDasharray="2 7" opacity="0.7" />
          </g>

          {/* 360 Orbiting Starlight Photons */}
          <g className="human-360-photon-1">
            <circle cx="0" cy="0" r="1.6" fill="#ffffff" filter="url(#humanCinemaGlow)" />
            <circle cx="0" cy="0" r="2.5" fill="#f59e0b" opacity="0.6" className="human-pinpoint-gleam" />
          </g>
          <g className="human-360-photon-2">
            <circle cx="0" cy="0" r="1.4" fill="#f59e0b" filter="url(#humanCinemaGlow)" />
          </g>

          {/* Central Stage 3D Metallic Badge */}
          <ellipse cx="0" cy="1" rx="10.5" ry="4.8" fill="#030712" stroke="#f59e0b" strokeWidth="1" />
          <text x="0" y="3.6" textAnchor="middle" fill="#f59e0b" fontSize="7.8" fontWeight="900" fontFamily="ui-monospace, monospace">
            04
          </text>

          {/* HIGH-DEFINITION CINEMATIC 3D DIORAMA: Summit Explorer, 360 Rotating Sextant & Dawn Rays */}
          <g transform="translate(0, -36)" className="human-3d-diorama-float">
            {/* Volumetric 3D Light Dome */}
            <ellipse cx="0" cy="8" rx="28" ry="16" fill="url(#diorama3DLightDome)" opacity="0.8" />

            {/* Faceted Crystalline Alpine Summit Pinnacle with Snow Dust & Stratum */}
            <polygon points="-19,22 0,14 19,22 12,28 -12,28" fill="#1e293b" stroke="#475569" strokeWidth="1.1" />
            <polygon points="0,14 19,22 9,26 0,22" fill="#0f172a" />
            <path d="M -8,19 L -1,15 L 4,18" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.85" />

            {/* Cinematic Golden Sunrise God-Rays with Volumetric Particulate Shimmer */}
            <polygon points="0,14 44,-17 21,-28 -10,14" fill="url(#ambitionDawnBeam)" className="human-godray-shimmer" />

            {/* Confident Young Leader / Executive Figure in Striding Stance */}
            <path d="M 0,6 L -6.5,18 M 0,6 L 6.5,17" stroke="#334155" strokeWidth="2.7" strokeLinecap="round" />
            <ellipse cx="-6.5" cy="18" rx="2.3" ry="1.2" fill="#0f172a" />
            <ellipse cx="6.5" cy="17" rx="2.3" ry="1.2" fill="#0f172a" />

            {/* Tailored Coat with 3D Lapels, Belt Buckle & Fluttering Scarf in High-Altitude Wind */}
            <path d="M -4.5,-2 L 4.5,-2 L 5.5,9 L -5.5,9 Z" fill="#b45309" stroke="#f59e0b" strokeWidth="0.9" />
            {/* Gold Buckle on Waist Belt */}
            <rect x="-2" y="3.5" width="4" height="1.8" rx="0.5" fill="url(#goldSpecularGrad)" />
            <path d="M -4.5,-2 Q -13.5,0 -17.5,-3.5" stroke="url(#goldSpecularGrad)" strokeWidth="1.9" strokeLinecap="round" className="human-coat-flutter" />

            {/* Confident Head with Modern Hair & Eye Catchlight */}
            <circle cx="0" cy="-7" r="4.8" fill="url(#photorealSkinSSS)" />
            <path d="M -4.5,-9 C -3.5,-13.5 4.5,-12.5 4.5,-8 C 1.5,-9.5 -2,-9.5 -4.5,-9 Z" fill="#292524" />
            <circle cx="2" cy="-7" r="1" fill="#1e293b" />
            <circle cx="2.3" cy="-7.2" r="0.35" fill="#ffffff" />

            {/* Left Arm holding Parchment Blueprint with Compass Rose Seal */}
            <path d="M -4.5,-1 L -9,5" stroke="#fed7aa" strokeWidth="1.8" strokeLinecap="round" />
            <rect x="-11.5" y="3" width="3" height="7" rx="1.5" fill="#fef08a" transform="rotate(20 -10 6)" />
            <circle cx="-9" cy="6" r="0.6" fill="#b91c1c" />

            {/* Right Arm raised with 360-Spinning Geared Navigational Astrolabe & Collimated Guidance Laser */}
            <path d="M 4.5,-1 L 13,-6.5" stroke="#fed7aa" strokeWidth="2" strokeLinecap="round" />
            <g transform="translate(14, -7.5)" className="human-sextant-sweep">
              <circle cx="0" cy="0" r="3" fill="url(#goldSpecularGrad)" stroke="#d97706" strokeWidth="1" filter="url(#humanCinemaGlow)" />
              <ellipse cx="0" cy="0" rx="4" ry="1.5" fill="none" stroke="#ffffff" strokeWidth="0.7" className="human-360-orbit-cw" />
              {/* Laser Guidance Ray piercing the dawn horizon with Collimated Core */}
              <line x1="2" y1="-1" x2="24" y2="-13" stroke="#fef08a" strokeWidth="2.5" opacity="0.6" filter="url(#humanCinemaGlow)" />
              <line x1="2" y1="-1" x2="24" y2="-13" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="24" cy="-13" r="1.5" fill="#ffffff" className="human-pinpoint-gleam" />
            </g>
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
          {/* Deep Contact Ambient Occlusion Ground Shadow */}
          <ellipse cx="0" cy="8" rx="30" ry="11" fill="#000000" opacity="0.82" filter="url(#humanDeepAO)" />
          {/* 360 3D Isometric Cylinder Pedestal Base */}
          <path d="M -24,0 L -24,7 C -24,12.5 24,12.5 24,7 L 24,0 Z" fill="url(#pedestal3DSideGrad)" stroke="#be185d" strokeWidth="0.8" opacity="0.95" />
          <ellipse cx="0" cy="0" rx="24" ry="8" fill="url(#pedestal3DTopGrad)" stroke="#ec4899" strokeWidth="1.2" />

          {/* 360 3D Continuous Rotating Astrolabe / Gyroscope Orbital Rings */}
          <g className="human-360-gyro-1">
            <ellipse cx="0" cy="0" rx="29" ry="9.5" fill="none" stroke="#ec4899" strokeWidth="0.9" strokeDasharray="3 5" opacity="0.85" />
          </g>
          <g className="human-360-gyro-2">
            <ellipse cx="0" cy="0" rx="31" ry="10.5" fill="none" stroke="#fbcfe8" strokeWidth="0.6" strokeDasharray="2 7" opacity="0.65" />
          </g>

          {/* 360 Orbiting Starlight Photons */}
          <g className="human-360-photon-1">
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" filter="url(#humanCinemaGlow)" />
          </g>
          <g className="human-360-photon-2">
            <circle cx="0" cy="0" r="1.3" fill="#ec4899" filter="url(#humanCinemaGlow)" />
          </g>

          {/* Central Stage 3D Metallic Badge */}
          <ellipse cx="0" cy="1" rx="10" ry="4.5" fill="#030712" stroke="#ec4899" strokeWidth="0.9" />
          <text x="0" y="3.5" textAnchor="middle" fill="#ec4899" fontSize="7.5" fontWeight="900" fontFamily="ui-monospace, monospace">
            05
          </text>

          {/* PHOTOREALISTIC CINEMATIC 3D DIORAMA: Loving Couple, Child Swinging, Heart Nebula & 3D Möbius Bands */}
          <g transform="translate(0, -36)" className="human-3d-diorama-float">
            {/* Volumetric 3D Light Dome */}
            <ellipse cx="0" cy="8" rx="30" ry="17" fill="url(#diorama3DLightDome)" opacity="0.85" />

            {/* Cozy Home Flagstone Terrace & Deck Threshold */}
            <path d="M -22,21 Q 0,16 22,21" fill="none" stroke="#831843" strokeWidth="3" strokeLinecap="round" />
            <path d="M -20,20 Q 0,15.5 20,20" fill="none" stroke="#9d174d" strokeWidth="1.8" strokeLinecap="round" />
            {/* Flagstone paving lines & mortar texture */}
            <line x1="-14" y1="18.5" x2="-14" y2="21.5" stroke="#4c0519" strokeWidth="0.7" />
            <line x1="-6" y1="17.5" x2="-6" y2="20.5" stroke="#4c0519" strokeWidth="0.7" />
            <line x1="5" y1="17.5" x2="5" y2="20.5" stroke="#4c0519" strokeWidth="0.7" />
            <line x1="14" y1="18.5" x2="14" y2="21.5" stroke="#4c0519" strokeWidth="0.7" />

            {/* 360 3D Interlocking Golden Möbius Wedding Bands revolving around Volumetric Heart Nebula */}
            <g transform="translate(0, -22)" className="human-heart-pulse">
              <path
                d="M 0,-4.5 C -5,-10.5 -13,-8.5 -12,-1.5 C -11,4.5 0,11 0,11 C 0,11 11,4.5 12,-1.5 C 13,-8.5 5,-10.5 0,-4.5 Z"
                fill="url(#unionHeartAura)"
                filter="url(#humanCinemaGlow)"
              />
              {/* Subtle inner heart core glow */}
              <path
                d="M 0,-3 C -3.5,-7.5 -9,-6 -8.5,-1 C -8,3.5 0,8 0,8 C 0,8 8,3.5 8.5,-1 C 9,-6 3.5,-7.5 0,-3 Z"
                fill="#fda4af"
                opacity="0.35"
              />
              {/* 360 Rotating 3D Intertwined Golden Rings with Specular Diamond Gem */}
              <g className="human-3d-rings-spin">
                <ellipse cx="-2.6" cy="0" rx="4.2" ry="2.3" fill="none" stroke="url(#goldSpecularGrad)" strokeWidth="1.2" />
                <ellipse cx="2.6" cy="0" rx="4.2" ry="2.3" fill="none" stroke="url(#goldSpecularGrad)" strokeWidth="1.2" />
                {/* Brilliant cut diamond gem facet catching light */}
                <circle cx="0" cy="-2.5" r="1.1" fill="#ffffff" filter="url(#humanCinemaGlow)" className="human-pinpoint-gleam" />
              </g>
              <circle cx="0" cy="0" r="1.4" fill="#ffffff" filter="url(#humanCinemaGlow)" />
            </g>

            {/* Partner 1 (Left - Warm Tall Adult Figure with Tailored Knitwear) */}
            <g transform="translate(-8.8, 0)">
              {/* Subsurface scattering photoreal head */}
              <circle cx="0" cy="-6" r="4.5" fill="url(#photorealSkinSSS)" />
              {/* Textured groomed hair with ear contour */}
              <path d="M -3.5,-8 C -2.2,-11.8 3.5,-10.8 3.5,-6 C 1.2,-7.2 -0.8,-7.2 -3.5,-8 Z" fill="#27272a" />
              <circle cx="-3.8" cy="-5.5" r="0.9" fill="#fbcfe8" />
              {/* Eye catchlight & serene smile */}
              <circle cx="1.2" cy="-6" r="0.4" fill="#ffffff" />
              <path d="M -0.5,-4 Q 1,-3.2 2.2,-4" stroke="#e11d48" strokeWidth="0.5" fill="none" strokeLinecap="round" />

              {/* Textured crimson cable-knit sweater with ribbed collar */}
              <path d="M -3.5,-2 L 3.5,-2 L 2.5,8 L -3.5,8 Z" fill="#9f1239" stroke="#be123c" strokeWidth="0.8" />
              <line x1="-1" y1="-1.5" x2="-1" y2="7.5" stroke="#f43f5e" strokeWidth="0.5" strokeDasharray="1 1.5" opacity="0.6" />
              <line x1="1" y1="-1.5" x2="1" y2="7.5" stroke="#f43f5e" strokeWidth="0.5" strokeDasharray="1 1.5" opacity="0.6" />

              {/* Trousers & shoes with realistic sole rim */}
              <path d="M -2,8 L -4.5,14 L -6.5,20.5 M 2,8 L 2.2,14 L 3,20.5" stroke="#334155" strokeWidth="2.3" strokeLinecap="round" />
              <rect x="-8.2" y="19.5" width="4.2" height="1.8" rx="0.9" fill="#0f172a" />
              <rect x="1.5" y="19.5" width="4.2" height="1.8" rx="0.9" fill="#0f172a" />

              {/* Arm reaching around partner with sweater cuff */}
              <path d="M 2.2,0 Q 6.8,2.2 9,2.2" stroke="url(#photorealSkinSSS)" strokeWidth="1.7" strokeLinecap="round" />
              <circle cx="2.6" cy="0.4" r="1.1" fill="#be123c" />
              {/* Outer arm holding child's hand */}
              <path d="M -3.5,0 L -7,6.5 L -2.8,12.5" stroke="url(#photorealSkinSSS)" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="-3.6" cy="0.4" r="1.1" fill="#be123c" />
            </g>

            {/* Partner 2 (Right - Gentle Adult Figure with Elegant Draped Coat) */}
            <g transform="translate(8.8, 0)">
              {/* Subsurface scattering photoreal head */}
              <circle cx="0" cy="-5.6" r="4.5" fill="url(#photorealSkinSSS)" />
              {/* Flowing chestnut hair with golden specular sheen */}
              <path d="M -3.5,-7.5 C -2.2,-12 4.5,-11 4.5,-5 C 2.2,-7.2 -0.8,-7.2 -3.5,-7.5 Z" fill="#581c87" />
              <path d="M 3.8,-5.5 C 5,-2 4.5,2 3.8,4.5" stroke="#7e22ce" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              <circle cx="3.8" cy="-5.2" r="0.9" fill="#fbcfe8" />
              {/* Eye catchlight & serene smile */}
              <circle cx="-1.2" cy="-5.8" r="0.4" fill="#ffffff" />
              <path d="M -2.2,-3.8 Q -1,-3 -0.2,-3.8" stroke="#db2777" strokeWidth="0.5" fill="none" strokeLinecap="round" />

              {/* Plum textured draped coat with fine collar lapels */}
              <path d="M -3.5,-2 L 3.5,-2 L 2.5,8 L -3.5,8 Z" fill="#831843" stroke="#9d174d" strokeWidth="0.8" />
              <path d="M -0.5,-2 L -1.5,8" stroke="#f472b6" strokeWidth="0.6" opacity="0.6" />

              {/* Trousers & polished shoes */}
              <path d="M -2,8 L -2.2,14 L -3,20.5 M 2,8 L 4.5,14 L 6.5,20.5" stroke="#475569" strokeWidth="2.3" strokeLinecap="round" />
              <rect x="-4.8" y="19.5" width="4.2" height="1.8" rx="0.9" fill="#0f172a" />
              <rect x="5.2" y="19.5" width="4.2" height="1.8" rx="0.9" fill="#0f172a" />

              {/* Arm around partner */}
              <path d="M -2.2,0 Q -6.8,2.2 -9,2.2" stroke="url(#photorealSkinSSS)" strokeWidth="1.7" strokeLinecap="round" />
              <circle cx="-2.6" cy="0.4" r="1.1" fill="#9d174d" />
              {/* Outer arm holding child's other hand */}
              <path d="M 3.5,0 L 7,6.5 L 2.8,12.5" stroke="url(#photorealSkinSSS)" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="3.6" cy="0.4" r="1.1" fill="#9d174d" />
            </g>

            {/* Little Child in Center (Joyfully swinging high between parents) */}
            <g transform="translate(0, 6)">
              {/* Child head with rosy cheeks and smile */}
              <circle cx="0" cy="0.8" r="3.5" fill="url(#photorealSkinSSS)" />
              <circle cx="-1.6" cy="1.6" r="0.9" fill="#f43f5e" opacity="0.45" />
              <circle cx="1.6" cy="1.6" r="0.9" fill="#f43f5e" opacity="0.45" />
              <circle cx="-0.8" cy="0.5" r="0.35" fill="#ffffff" />
              <circle cx="0.8" cy="0.5" r="0.35" fill="#ffffff" />
              <path d="M -1.2,2.2 Q 0,3.2 1.2,2.2" stroke="#e11d48" strokeWidth="0.6" fill="#ffffff" />

              {/* Bright emerald dungarees with brass buckles */}
              <path d="M -2.2,4.2 L 2.2,4.2 L 1.8,10.5 L -1.8,10.5 Z" fill="#059669" stroke="#10b981" strokeWidth="0.6" />
              <circle cx="-1.2" cy="4.8" r="0.4" fill="#fbbf24" />
              <circle cx="1.2" cy="4.8" r="0.4" fill="#fbbf24" />

              {/* Legs kicking in mid-air with red sneakers */}
              <path d="M -1.3,10.5 L -3.8,16.5 M 1.3,10.5 L 3.8,16.5" stroke="#0284c7" strokeWidth="1.9" strokeLinecap="round" />
              <rect x="-5.6" y="15.8" width="3.2" height="1.6" rx="0.8" fill="#e11d48" />
              <rect x="2.6" y="15.8" width="3.2" height="1.6" rx="0.8" fill="#e11d48" />
              <line x1="-5.6" y1="17.2" x2="-2.4" y2="17.2" stroke="#ffffff" strokeWidth="0.5" />
              <line x1="2.6" y1="17.2" x2="5.8" y2="17.2" stroke="#ffffff" strokeWidth="0.5" />

              {/* Joyfully raised arms holding parents' hands */}
              <path d="M -1.8,5.2 L -6.8,1.2" stroke="url(#photorealSkinSSS)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 1.8,5.2 L 6.8,1.2" stroke="url(#photorealSkinSSS)" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Hanging Antique Brass Lantern with Flickering Hearth Flame */}
            <g transform="translate(-19, 4)">
              <line x1="0" y1="0" x2="0" y2="9" stroke="url(#brassSpecularGrad)" strokeWidth="0.9" />
              {/* Octagonal beveled lantern cage */}
              <polygon points="-3.2,9 3.2,9 2.5,14.5 -2.5,14.5" fill="#0f172a" stroke="url(#goldSpecularGrad)" strokeWidth="0.7" />
              {/* Flickering warm flame */}
              <circle cx="0" cy="11.8" r="1.8" fill="#fef08a" filter="url(#humanCinemaGlow)" className="human-lantern-flicker" />
              <circle cx="0" cy="11.8" r="0.8" fill="#ffffff" />
            </g>

            {/* Floating Soft Cherry Blossom Petals */}
            <circle cx="16" cy="-10" r="1" fill="#f472b6" opacity="0.8" className="tree-sparkle-1" />
            <circle cx="-14" cy="-8" r="0.9" fill="#fda4af" opacity="0.8" className="tree-sparkle-2" />
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
          {/* Deep Contact Ambient Occlusion Ground Shadow */}
          <ellipse cx="0" cy="8" rx="30" ry="11" fill="#000000" opacity="0.82" filter="url(#humanDeepAO)" />
          {/* 360 3D Isometric Cylinder Pedestal Base */}
          <path d="M -24,0 L -24,7 C -24,12.5 24,12.5 24,7 L 24,0 Z" fill="url(#pedestal3DSideGrad)" stroke="#047857" strokeWidth="0.8" opacity="0.95" />
          <ellipse cx="0" cy="0" rx="24" ry="8" fill="url(#pedestal3DTopGrad)" stroke="#10b981" strokeWidth="1.2" />

          {/* 360 3D Continuous Rotating Astrolabe / Gyroscope Orbital Rings */}
          <g className="human-360-gyro-1">
            <ellipse cx="0" cy="0" rx="29" ry="9.5" fill="none" stroke="#10b981" strokeWidth="0.9" strokeDasharray="3 5" opacity="0.85" />
          </g>
          <g className="human-360-gyro-2">
            <ellipse cx="0" cy="0" rx="31" ry="10.5" fill="none" stroke="#6ee7b7" strokeWidth="0.6" strokeDasharray="2 7" opacity="0.65" />
          </g>

          {/* 360 Orbiting Starlight Photons */}
          <g className="human-360-photon-1">
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" filter="url(#humanCinemaGlow)" />
          </g>
          <g className="human-360-photon-2">
            <circle cx="0" cy="0" r="1.3" fill="#10b981" filter="url(#humanCinemaGlow)" />
          </g>

          {/* Central Stage 3D Metallic Badge */}
          <ellipse cx="0" cy="1" rx="10" ry="4.5" fill="#030712" stroke="#10b981" strokeWidth="0.9" />
          <text x="0" y="3.5" textAnchor="middle" fill="#10b981" fontSize="7.5" fontWeight="900" fontFamily="ui-monospace, monospace">
            06
          </text>

          {/* PHOTOREALISTIC CINEMATIC 3D DIORAMA: Mentor Guiding Apprentice, 360 Sacred Bonsai Sapling & Mycelium */}
          <g transform="translate(0, -36)" className="human-3d-diorama-float">
            {/* Volumetric 3D Light Dome */}
            <ellipse cx="0" cy="8" rx="30" ry="17" fill="url(#diorama3DLightDome)" opacity="0.85" />

            {/* Layered Stratified Fertile Soil Mound with Mineral Pebbles */}
            <path d="M -22,21 Q 0,15 22,21" fill="none" stroke="#451a03" strokeWidth="3.6" strokeLinecap="round" />
            <path d="M -18,19 Q 0,14 18,19" fill="none" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="-12" cy="19.5" r="0.9" fill="#92400e" />
            <circle cx="8" cy="19" r="0.8" fill="#b45309" />
            <circle cx="14" cy="20" r="1" fill="#713f12" />

            {/* Glowing Subterranean Mycorrhizal Mycelium Fungal Network */}
            <path
              d="M -16,21 Q -10,23 -4,22 Q 4,23 16,21 M -8,22 Q -3,25 2,24"
              fill="none"
              stroke="#6ee7b7"
              strokeWidth="0.7"
              strokeDasharray="2 3"
              opacity="0.85"
              className="human-godray-shimmer"
            />

            {/* Mature Mentor Figure (Distinguished Scholar with Flowing Celestial Robe & Silver Hair) */}
            <g transform="translate(-7.8, 0)">
              {/* Subsurface scattering photoreal head */}
              <circle cx="0" cy="-6.2" r="4.8" fill="url(#photorealSkinSSS)" />
              {/* Silver-streaked dignified hair with specular strand & beard contour */}
              <path d="M -4.8,-9.2 C -4.8,-13.5 4.8,-12.5 4.8,-7.2 C 2.2,-9.5 -2,-9.5 -4.8,-9.2 Z" fill="#cbd5e1" />
              <path d="M -2.2,-11.5 Q 1,-13 3.8,-8.5" stroke="#f8fafc" strokeWidth="1" fill="none" />
              {/* Trim silver goatee/beard */}
              <path d="M -2,-2 Q 0,-0.5 2,-2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.6" />
              {/* Kind eye catchlight */}
              <circle cx="1.6" cy="-6.2" r="0.45" fill="#ffffff" />
              <path d="M 0.2,-4.2 Q 1.5,-3.5 2.8,-4.2" stroke="#047857" strokeWidth="0.5" fill="none" />

              {/* Dignified Scholar's Tunic with Gold-Embroidered Constellation Border */}
              <path d="M -4.8,-1 L 4.8,-1 L 5.8,12 L -5.8,12 Z" fill="#064e3b" stroke="#059669" strokeWidth="0.9" />
              <line x1="-4.8" y1="11.2" x2="4.8" y2="11.2" stroke="url(#goldSpecularGrad)" strokeWidth="0.8" />
              <circle cx="-1" cy="5" r="0.5" fill="#fbbf24" />
              <circle cx="1" cy="7" r="0.5" fill="#fbbf24" />
              <circle cx="2.5" cy="4" r="0.5" fill="#fbbf24" />
              <line x1="-1" y1="5" x2="1" y2="7" stroke="#fbbf24" strokeWidth="0.3" opacity="0.7" />

              {/* Trousers & dignified dark shoes */}
              <path d="M -3.2,12 L -6.5,20.5 M 3.2,12 L 5.5,20.5" stroke="#1e293b" strokeWidth="2.4" strokeLinecap="round" />
              <rect x="-8.2" y="19.5" width="4.5" height="2" rx="1" fill="#0f172a" />
              <rect x="4" y="19.5" width="4.5" height="2" rx="1" fill="#0f172a" />

              {/* Gentle Outstretched Hand Guiding Apprentice with delicate knuckle curves */}
              <path d="M 4.8,2 L 13.5,8.8" stroke="url(#photorealSkinSSS)" strokeWidth="2" strokeLinecap="round" />
              <circle cx="4.8" cy="2" r="1.2" fill="#047857" />
              <circle cx="13.5" cy="8.8" r="0.9" fill="url(#photorealSkinSSS)" />
            </g>

            {/* Young Apprentice Kneeling Eagerly with Leather Satchel */}
            <g transform="translate(12.5, 4)">
              {/* Youthful head with subsurface scattering */}
              <circle cx="0" cy="-2.2" r="3.8" fill="url(#photorealSkinSSS)" />
              {/* Dark textured hair and bright observant eye */}
              <path d="M -2.2,-4.5 C -2.2,-8 3.5,-8 3.5,-3.2" stroke="#292524" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <circle cx="-1.2" cy="-2.2" r="0.4" fill="#ffffff" />

              {/* Cobalt apprentice tunic with leather waist belt & satchel */}
              <path d="M -2.4,1.8 L 2.4,1.8 L 1.4,9 L -2.4,9 Z" fill="#0369a1" stroke="#0284c7" strokeWidth="0.7" />
              <line x1="-2.4" y1="5" x2="2" y2="5" stroke="#78350f" strokeWidth="0.8" />
              <rect x="1.2" y="4.5" width="2" height="2.5" rx="0.5" fill="#92400e" stroke="#fbbf24" strokeWidth="0.4" />

              {/* Kneeling pose on mossy ground */}
              <path d="M 0,9 L 2.2,16.5 M -1.2,9 L -3.5,16.5" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="-4" cy="16.5" rx="2" ry="1" fill="#0f172a" />

              {/* Hands gently touching soil near roots in respectful planting gesture */}
              <path d="M -2.4,3.8 L -6.8,9.8" stroke="url(#photorealSkinSSS)" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="-6.8" cy="9.8" r="0.8" fill="url(#photorealSkinSSS)" />
            </g>

            {/* The Thriving 360 3D Sacred Bonsai Sapling with Veined Leaves & Golden Fruit */}
            <g transform="translate(4.2, 3)">
              {/* Ancient gnarled driftwood trunk with root flares */}
              <path d="M 0,16.5 L 0,3 M 0,13 L -3.8,17.5 M 0,14.5 L 3.8,17.5" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
              <path d="M -3.8,17.5 Q -8.5,19.5 -13,21 M 3.8,17.5 Q 8.5,19.5 13,21" stroke="url(#goldSpecularGrad)" strokeWidth="0.9" fill="none" opacity="0.8" />
              {/* Bark crevice line */}
              <line x1="-0.4" y1="5" x2="-0.4" y2="12" stroke="#451a03" strokeWidth="0.6" />

              {/* 360 3D Rotating Golden Orbital Growth Ring with Celestial Nodes */}
              <g className="human-360-orbit-cw">
                <ellipse cx="0" cy="3" rx="7.5" ry="2.7" fill="none" stroke="url(#goldSpecularGrad)" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.9" />
                <circle cx="-7.5" cy="3" r="0.8" fill="#fde047" />
                <circle cx="7.5" cy="3" r="0.8" fill="#ffffff" />
              </g>

              {/* Radiant Translucent Emerald Leaves with Micro-Veins */}
              <path d="M 0,9 Q -7.5,2.5 -4.5,-1.5 Q 0,4 0,9" fill="url(#mentorSaplingGlow)" filter="url(#humanCinemaGlow)" />
              <path d="M 0,7 Q 7.5,0.5 4.5,-3.5 Q 0,2 0,7" fill="url(#mentorSaplingGlow)" filter="url(#humanCinemaGlow)" />
              {/* Leaf midrib veins */}
              <path d="M 0,7 Q -3.5,3 -4,-0.5" stroke="#a7f3d0" strokeWidth="0.4" fill="none" />
              <path d="M 0,5 Q 3.5,1.5 4,-2" stroke="#a7f3d0" strokeWidth="0.4" fill="none" />

              {/* Glowing Golden Wisdom Fruit with internal pulp core */}
              <circle cx="-4.8" cy="-0.8" r="1.8" fill="#fde047" filter="url(#humanCinemaGlow)" />
              <circle cx="-4.8" cy="-0.8" r="0.7" fill="#ffffff" />
              <circle cx="4.8" cy="-2.8" r="1.8" fill="#34d399" filter="url(#humanCinemaGlow)" />
              <circle cx="4.8" cy="-2.8" r="0.7" fill="#ffffff" />
              {/* Apex crowning blossom with starlight flare */}
              <circle cx="0" cy="-5.5" r="2.2" fill="#ffffff" filter="url(#humanCinemaGlow)" className="human-pinpoint-gleam" />
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
          {/* Deep Contact Ambient Occlusion Ground Shadow */}
          <ellipse cx="0" cy="8" rx="30" ry="11" fill="#000000" opacity="0.82" filter="url(#humanDeepAO)" />
          {/* 360 3D Isometric Cylinder Pedestal Base */}
          <path d="M -24,0 L -24,7 C -24,12.5 24,12.5 24,7 L 24,0 Z" fill="url(#pedestal3DSideGrad)" stroke="#a16207" strokeWidth="0.8" opacity="0.95" />
          <ellipse cx="0" cy="0" rx="24" ry="8" fill="url(#pedestal3DTopGrad)" stroke="#eab308" strokeWidth="1.2" />

          {/* 360 3D Continuous Rotating Astrolabe / Gyroscope Orbital Rings */}
          <g className="human-360-gyro-1">
            <ellipse cx="0" cy="0" rx="29" ry="9.5" fill="none" stroke="#eab308" strokeWidth="0.9" strokeDasharray="3 5" opacity="0.85" />
          </g>
          <g className="human-360-gyro-2">
            <ellipse cx="0" cy="0" rx="31" ry="10.5" fill="none" stroke="#fef08a" strokeWidth="0.6" strokeDasharray="2 7" opacity="0.65" />
          </g>

          {/* 360 Orbiting Starlight Photons */}
          <g className="human-360-photon-1">
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" filter="url(#humanCinemaGlow)" />
          </g>
          <g className="human-360-photon-2">
            <circle cx="0" cy="0" r="1.3" fill="#eab308" filter="url(#humanCinemaGlow)" />
          </g>

          {/* Central Stage 3D Metallic Badge */}
          <ellipse cx="0" cy="1" rx="10" ry="4.5" fill="#030712" stroke="#eab308" strokeWidth="0.9" />
          <text x="0" y="3.5" textAnchor="middle" fill="#eab308" fontSize="7.5" fontWeight="900" fontFamily="ui-monospace, monospace">
            07
          </text>

          {/* PHOTOREALISTIC CINEMATIC 3D DIORAMA: Elder on Mahogany Bench, Gas Lamp, Cane & Azure Songbird */}
          <g transform="translate(0, -36)" className="human-3d-diorama-float">
            {/* Volumetric 3D Light Dome */}
            <ellipse cx="0" cy="8" rx="30" ry="17" fill="url(#diorama3DLightDome)" opacity="0.85" />

            {/* Antique Victorian Gas Streetlamp with Beveled Glass & Downward Volumetric Godray Cone */}
            <g transform="translate(-17.5, -16)">
              {/* Fluted cast-iron lamp post */}
              <line x1="0" y1="36" x2="0" y2="4" stroke="#334155" strokeWidth="2.4" strokeLinecap="round" />
              <ellipse cx="0" cy="35" rx="3.5" ry="1.2" fill="#1e293b" />
              {/* Octagonal beveled lantern housing with brass spire */}
              <line x1="0" y1="-3" x2="0" y2="-6" stroke="url(#goldSpecularGrad)" strokeWidth="1" />
              <polygon points="-5,4 5,4 4,-3 -4,-3" fill="#0f172a" stroke="url(#goldSpecularGrad)" strokeWidth="0.9" />
              {/* Warm gas mantle flame with flicker */}
              <circle cx="0" cy="0.5" r="2.8" fill="#fef08a" filter="url(#humanCinemaGlow)" className="human-lantern-flicker" />
              <circle cx="0" cy="0.5" r="1.2" fill="#ffffff" />
              {/* 3D Downward Volumetric Golden Light Cone */}
              <polygon points="0,4 -16,35 16,35" fill="url(#wisdomLampGlow)" className="human-godray-shimmer" />
            </g>

            {/* Classical Carved Mahogany & Wrought-Iron Park Bench with Lion-Paw Feet */}
            {/* Iron scrollwork legs & lion paws */}
            <line x1="-12" y1="12" x2="-12" y2="21" stroke="#1e293b" strokeWidth="2" />
            <line x1="14" y1="12" x2="14" y2="21" stroke="#1e293b" strokeWidth="2" />
            <circle cx="-12" cy="21" r="1.1" fill="#0f172a" />
            <circle cx="14" cy="21" r="1.1" fill="#0f172a" />
            {/* Glossy mahogany seat slats with amber varnish reflections */}
            <path d="M -14,12 L 16,12" stroke="url(#mahoganyGlossGrad)" strokeWidth="3" strokeLinecap="round" />
            <path d="M -14,6 L 16,6" stroke="url(#mahoganyGlossGrad)" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="-13" cy="12" r="0.6" fill="#fbbf24" />
            <circle cx="15" cy="12" r="0.6" fill="#fbbf24" />
            {/* Decorative curved armrest scroll */}
            <path d="M -14,6 Q -16.5,0.5 -11.5,-0.5" stroke="#334155" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            {/* Venerable Elder Seated in Serenity */}
            <g transform="translate(0, 0)">
              {/* Cable-knit textured mustard cardigan with tortoiseshell buttons */}
              <path d="M -5.8,0 C -6.8,6 -4.8,11.5 0,11.5 C 4.8,11.5 6.8,6 5.8,0 C 4.8,-3 -4.8,-3 -5.8,0 Z" fill="#b45309" stroke="#d97706" strokeWidth="0.9" />
              {/* Crisp inner shirt collar and tortoiseshell buttons */}
              <polygon points="0,-1 -1.5,1 0,3 1.5,1" fill="#f8fafc" />
              <circle cx="0" cy="5" r="0.5" fill="#451a03" />
              <circle cx="0" cy="8" r="0.5" fill="#451a03" />

              {/* Wool blanket across lap with Scottish tartan fringe accent */}
              <rect x="-5" y="10" width="10" height="4" rx="1" fill="#78350f" />
              <line x1="-5" y1="12" x2="5" y2="12" stroke="#fef08a" strokeWidth="0.5" />
              <line x1="-5" y1="14" x2="5" y2="14" stroke="#fef08a" strokeWidth="0.5" strokeDasharray="1 1" />

              {/* Trousers & polished dark leather shoes */}
              <path d="M -2.2,13 L -4.5,20 M 2.2,13 L 3.5,20" stroke="#334155" strokeWidth="2.4" strokeLinecap="round" />
              <rect x="-6" y="19.2" width="4" height="2" rx="1" fill="#0f172a" />
              <rect x="2.5" y="19.2" width="4" height="2" rx="1" fill="#0f172a" />

              {/* Distinguished Elder Head with Silver Hair & Wire-Rim Spectacles */}
              <circle cx="0" cy="-6.2" r="4.7" fill="url(#photorealSkinSSS)" />
              {/* Silver-white lustrous hair and gentle beard contour */}
              <path d="M -4.8,-8.2 C -4.8,-12.8 4.8,-12.8 4.8,-7.2 C 2.2,-9.5 -2.2,-9.5 -4.8,-8.2 Z" fill="#f8fafc" />
              <path d="M -2,-2.2 Q 0,-0.8 2,-2.2" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
              {/* Gold wire-rim spectacles catching pinpoint specular starlight */}
              <circle cx="1.7" cy="-6.2" r="1.3" fill="none" stroke="url(#goldSpecularGrad)" strokeWidth="0.75" />
              <line x1="0.4" y1="-6.2" x2="0.8" y2="-6.2" stroke="url(#goldSpecularGrad)" strokeWidth="0.75" />
              <circle cx="1.7" cy="-6.2" r="0.4" fill="#ffffff" className="human-pinpoint-gleam" />
              {/* Warm wise smile lines */}
              <path d="M 0,-4 Q 2,-2.6 3.4,-4" fill="none" stroke="#92400e" strokeWidth="0.65" strokeLinecap="round" />

              {/* Hands resting on Carved Mahogany Cane with 3D Polished Gold Grip */}
              <path d="M 2.2,2 L 8.8,8.8" stroke="url(#photorealSkinSSS)" strokeWidth="1.9" strokeLinecap="round" />
              <path d="M 7.8,6.2 Q 9.8,4.2 10.8,6.2 L 10.8,21" fill="none" stroke="url(#mahoganyGlossGrad)" strokeWidth="1.8" strokeLinecap="round" />
              {/* Spherical solid brass/gold cane knob reflecting lamp light */}
              <circle cx="9.8" cy="5.2" r="2" fill="url(#goldSpecularGrad)" stroke="#b45309" strokeWidth="0.6" filter="url(#humanCinemaGlow)" />
              <circle cx="9.3" cy="4.6" r="0.6" fill="#ffffff" />
            </g>

            {/* Azure Songbird Perched on Bench Back with Detailed Feather Plumage */}
            <g transform="translate(13.5, 3)" className="human-songbird-chirp">
              {/* Body & wing feathers */}
              <ellipse cx="0" cy="0" rx="3" ry="1.9" fill="#0284c7" />
              <path d="M -1.5,0.5 Q -3.5,2.5 -5,1.5 Q -2.5,0 -1,0" fill="#0369a1" />
              <circle cx="2.4" cy="-1.1" r="1.4" fill="#38bdf8" />
              {/* Golden beak & sparkling eye */}
              <polygon points="3.6,-1.1 5.2,-0.9 3.6,-0.3" fill="#f59e0b" />
              <circle cx="2.6" cy="-1.4" r="0.45" fill="#020617" />
              <circle cx="2.7" cy="-1.5" r="0.15" fill="#ffffff" />
              {/* Micro musical notes drifting in the air */}
              <g transform="translate(5, -4)" opacity="0.8">
                <circle cx="0" cy="0" r="0.6" fill="#fbbf24" />
                <line x1="0.6" y1="0" x2="0.6" y2="-2.5" stroke="#fbbf24" strokeWidth="0.4" />
              </g>
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
          {/* Deep Contact Ambient Occlusion Ground Shadow */}
          <ellipse cx="0" cy="8" rx="30" ry="11" fill="#000000" opacity="0.82" filter="url(#humanDeepAO)" />
          {/* 360 3D Isometric Cylinder Pedestal Base */}
          <path d="M -24,0 L -24,7 C -24,12.5 24,12.5 24,7 L 24,0 Z" fill="url(#pedestal3DSideGrad)" stroke="#1d4ed8" strokeWidth="0.8" opacity="0.95" />
          <ellipse cx="0" cy="0" rx="24" ry="8" fill="url(#pedestal3DTopGrad)" stroke="#60a5fa" strokeWidth="1.2" />

          {/* 360 3D Continuous Rotating Astrolabe / Gyroscope Orbital Rings */}
          <g className="human-360-gyro-1">
            <ellipse cx="0" cy="0" rx="29" ry="9.5" fill="none" stroke="#60a5fa" strokeWidth="0.9" strokeDasharray="3 5" opacity="0.85" />
          </g>
          <g className="human-360-gyro-2">
            <ellipse cx="0" cy="0" rx="31" ry="10.5" fill="none" stroke="#bfdbfe" strokeWidth="0.6" strokeDasharray="2 7" opacity="0.65" />
          </g>

          {/* 360 Orbiting Starlight Photons */}
          <g className="human-360-photon-1">
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" filter="url(#humanCinemaGlow)" />
          </g>
          <g className="human-360-photon-2">
            <circle cx="0" cy="0" r="1.3" fill="#60a5fa" filter="url(#humanCinemaGlow)" />
          </g>

          {/* Central Stage 3D Metallic Badge */}
          <ellipse cx="0" cy="1" rx="10" ry="4.5" fill="#030712" stroke="#60a5fa" strokeWidth="0.9" />
          <text x="0" y="3.5" textAnchor="middle" fill="#60a5fa" fontSize="7.5" fontWeight="900" fontFamily="ui-monospace, monospace">
            08
          </text>

          {/* PHOTOREALISTIC CINEMATIC 3D DIORAMA: Angels of Ascension, Heavenly Portal, Translucent Spirit & Golden Rays */}
          <g transform="translate(0, -36)" className="human-3d-diorama-float">
            {/* Luminous 3D Ascension Nebula with Prismatic Chromatic Dispersion */}
            <ellipse cx="0" cy="0" rx="25" ry="28" fill="url(#legacyApotheosisGrad)" filter="url(#humanCinemaGlow)" />

            {/* 1. CELESTIAL HEAVEN GATEWAY PORTAL & RADIANT GOLDEN RAYS */}
            <g transform="translate(0, -34)">
              {/* Diverging Rotating Golden Rays into Heaven */}
              <g className="human-divine-ray-spin opacity-75">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <polygon
                    key={`heaven-ray-${deg}`}
                    points="-1,-2 1,-2 3.5,-26 -3.5,-26"
                    fill="url(#heavenGoldenRaysGrad)"
                    transform={`rotate(${deg})`}
                  />
                ))}
              </g>

              {/* Concentric Pulsating Golden-White Heavenly Portal Gateway */}
              <circle cx="0" cy="0" r="18" fill="url(#heavenlyAscensionPortal)" className="human-heaven-portal-pulse" />
              <circle cx="0" cy="0" r="9" fill="#ffffff" opacity="0.9" filter="url(#humanCinemaGlow)" />
              <circle cx="0" cy="0" r="3.5" fill="#fef08a" />

              {/* Shimmering Ascension Stardust Rising Into Celestial Heaven */}
              <g className="human-stardust-ascend pointer-events-none">
                <circle cx="-6" cy="12" r="1.2" fill="#ffffff" filter="url(#humanCinemaGlow)" />
                <circle cx="7" cy="8" r="1.4" fill="#fde047" />
                <circle cx="-12" cy="18" r="1" fill="#93c5fd" />
                <polygon points="10,14 11.5,15.5 10,17 8.5,15.5" fill="#ffffff" className="human-pinpoint-gleam" />
              </g>
              <g className="human-stardust-ascend-delayed pointer-events-none">
                <circle cx="5" cy="14" r="1.3" fill="#ffffff" filter="url(#humanCinemaGlow)" />
                <circle cx="-8" cy="9" r="1.5" fill="#fef08a" />
                <circle cx="12" cy="20" r="1" fill="#60a5fa" />
                <polygon points="-10,16 -8.5,17.5 -10,19 -11.5,17.5" fill="#fef08a" className="human-pinpoint-gleam" />
              </g>
            </g>

            {/* 2. PHOTOREALISTIC CINEMATIC GOOD GUARDIAN ANGELS OF ASCENSION */}
            {/* Left Guardian Angel (Seraph of Light) Dynamically Flying Upward and Guiding the Spirit */}
            <g transform="translate(-18, -4)" className="human-angel-ascent-float-left">
              {/* Divine Golden Halo Above Head */}
              <ellipse cx="-1.5" cy="-14" rx="5.5" ry="1.7" fill="none" stroke="url(#angelHaloGrad)" strokeWidth="1.1" opacity="0.95" filter="url(#humanCinemaGlow)" />
              <circle cx="-1.5" cy="-14" r="0.8" fill="#ffffff" />

              {/* Majestic Feathery Wings Unfurled Upward Toward Heaven with Propulsion Flight Beats */}
              <g className="human-angel-wing-ascent-l">
                <path
                  d="M 0,-4 C -12,-24 -24,-22 -26,-7 C -26,4 -16,8 -1,1 Z"
                  fill="url(#angelWingAscentGrad)"
                  stroke="#ffffff"
                  strokeWidth="0.75"
                  filter="url(#humanSubtleDrop)"
                />
                {/* Individual Wing Feather Vanes */}
                <path d="M -5,-7 C -12,-19 -19,-17 -22,-6" fill="none" stroke="#ffffff" strokeWidth="0.7" opacity="0.9" />
                <path d="M -9,-6 C -16,-15 -21,-11 -23,-3" fill="none" stroke="#fef9c3" strokeWidth="0.55" opacity="0.85" />
                <path d="M -4,-3 C -10,-9 -15,-5 -17,2" fill="none" stroke="#93c5fd" strokeWidth="0.55" opacity="0.8" />
              </g>

              {/* Serene Celestial Angel Face Smiling Heavenward */}
              <circle cx="-1" cy="-7" r="3.6" fill="url(#photorealSkinSSS)" />
              {/* Golden Hairlocks Streaming in Ascent */}
              <path d="M -3,-10 C -3,-14 3,-14 3,-10 C 2,-12 -2,-12 -3,-10 Z" fill="#fef08a" />
              <path d="M -3,-8 Q -6,-2 -4,3" fill="none" stroke="#fde047" strokeWidth="0.8" strokeLinecap="round" />
              {/* Peaceful Eyes Gazing at Heaven & Gentle Smile */}
              <path d="M -2.2,-6.8 Q -1.2,-5.8 -0.4,-6.8" fill="none" stroke="#451a03" strokeWidth="0.6" strokeLinecap="round" />
              <circle cx="-1.2" cy="-5.8" r="0.9" fill="#fb7185" opacity="0.7" />
              <path d="M -1.2,-4.8 Q 0,-4 1,-4.8" fill="none" stroke="#b91c1c" strokeWidth="0.5" strokeLinecap="round" />

              {/* Flowing Gossamer Celestial Robes Billowing in Ascent */}
              <g className="human-angel-robe-flow">
                <path
                  d="M -3,-1 C -6,8 -7,18 -2,25 C 1,27 3,27 5,24 C 6,17 4,7 2,-1 Z"
                  fill="url(#angelRobeGrad)"
                  stroke="#ffffff"
                  strokeWidth="0.55"
                  opacity="0.9"
                />
                <path d="M -2,7 Q 1,9 4,7" fill="none" stroke="url(#goldSpecularGrad)" strokeWidth="0.5" opacity="0.8" />
                <path d="M -1,16 Q 2,19 4,16" fill="none" stroke="url(#goldSpecularGrad)" strokeWidth="0.5" opacity="0.8" />
              </g>

              {/* Outstretched Loving Right Arm & Hand Guiding the Spirit */}
              <path d="M 2,-2 Q 9,1 13,-3" fill="none" stroke="url(#photorealSkinSSS)" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="13" cy="-3" r="1.1" fill="url(#photorealSkinSSS)" />
              {/* Uplifting Golden Light Tether from Palm to Spirit */}
              <path d="M 13,-3 Q 16,-5 18,-6" fill="none" stroke="#fef08a" strokeWidth="0.9" strokeDasharray="1.5 2" opacity="0.9" className="human-flight-tether-pulse" />
              <circle cx="13" cy="-3" r="1.4" fill="#fef08a" opacity="0.8" filter="url(#humanCinemaGlow)" />
            </g>

            {/* Right Guardian Angel (Seraph of Grace) Dynamically Flying Upward and Guiding the Spirit */}
            <g transform="translate(18, -4)" className="human-angel-ascent-float-right">
              {/* Divine Golden Halo Above Head */}
              <ellipse cx="1.5" cy="-14" rx="5.5" ry="1.7" fill="none" stroke="url(#angelHaloGrad)" strokeWidth="1.1" opacity="0.95" filter="url(#humanCinemaGlow)" />
              <circle cx="1.5" cy="-14" r="0.8" fill="#ffffff" />

              {/* Majestic Feathery Wings Unfurled Upward Toward Heaven with Propulsion Flight Beats */}
              <g className="human-angel-wing-ascent-r">
                <path
                  d="M 0,-4 C 12,-24 24,-22 26,-7 C 26,4 16,8 1,1 Z"
                  fill="url(#angelWingAscentGrad)"
                  stroke="#ffffff"
                  strokeWidth="0.75"
                  filter="url(#humanSubtleDrop)"
                />
                {/* Individual Wing Feather Vanes */}
                <path d="M 5,-7 C 12,-19 19,-17 22,-6" fill="none" stroke="#ffffff" strokeWidth="0.7" opacity="0.9" />
                <path d="M 9,-6 C 16,-15 21,-11 23,-3" fill="none" stroke="#fef9c3" strokeWidth="0.55" opacity="0.85" />
                <path d="M 4,-3 C 10,-9 15,-5 17,2" fill="none" stroke="#93c5fd" strokeWidth="0.55" opacity="0.8" />
              </g>

              {/* Serene Celestial Angel Face Smiling Heavenward */}
              <circle cx="1" cy="-7" r="3.6" fill="url(#photorealSkinSSS)" />
              {/* Golden Hairlocks Streaming in Ascent */}
              <path d="M -3,-10 C -3,-14 3,-14 3,-10 C 2,-12 -2,-12 -3,-10 Z" fill="#fef08a" />
              <path d="M 3,-8 Q 6,-2 4,3" fill="none" stroke="#fde047" strokeWidth="0.8" strokeLinecap="round" />
              {/* Peaceful Eyes & Seraphic Smile */}
              <path d="M 0.4,-6.8 Q 1.2,-5.8 2.2,-6.8" fill="none" stroke="#451a03" strokeWidth="0.6" strokeLinecap="round" />
              <circle cx="1.2" cy="-5.8" r="0.9" fill="#fb7185" opacity="0.7" />
              <path d="M -1,-4.8 Q 0,-4 1.2,-4.8" fill="none" stroke="#b91c1c" strokeWidth="0.5" strokeLinecap="round" />

              {/* Flowing Gossamer Celestial Robes Billowing in Ascent */}
              <g className="human-angel-robe-flow">
                <path
                  d="M -2,-1 C -4,7 -6,17 -5,24 C -3,27 -1,27 2,25 C 7,18 6,8 3,-1 Z"
                  fill="url(#angelRobeGrad)"
                  stroke="#ffffff"
                  strokeWidth="0.55"
                  opacity="0.9"
                />
                <path d="M -4,7 Q -1,9 2,7" fill="none" stroke="url(#goldSpecularGrad)" strokeWidth="0.5" opacity="0.8" />
                <path d="M -4,16 Q -2,19 1,16" fill="none" stroke="url(#goldSpecularGrad)" strokeWidth="0.5" opacity="0.8" />
              </g>

              {/* Outstretched Loving Left Arm & Hand Guiding the Spirit */}
              <path d="M -2,-2 Q -9,1 -13,-3" fill="none" stroke="url(#photorealSkinSSS)" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="-13" cy="-3" r="1.1" fill="url(#photorealSkinSSS)" />
              {/* Uplifting Golden Light Tether from Palm to Spirit */}
              <path d="M -13,-3 Q -16,-5 -18,-6" fill="none" stroke="#fef08a" strokeWidth="0.9" strokeDasharray="1.5 2" opacity="0.9" className="human-flight-tether-pulse" />
              <circle cx="-13" cy="-3" r="1.4" fill="#fef08a" opacity="0.8" filter="url(#humanCinemaGlow)" />
            </g>

            {/* 3. ASCENDING TRANSLUCENT CRYSTALLINE SPIRIT UPLIFTED IN FLIGHT TOWARD HEAVEN */}
            <g className="human-spirit-ascent-flight">
              {/* Radiant Starlight Halo & Diamond Facet Crown */}
              <circle cx="0" cy="-8.8" r="5.5" fill="#ffffff" filter="url(#humanCinemaGlow)" />
              <ellipse cx="0" cy="-14" rx="8" ry="2.4" fill="none" stroke="url(#goldSpecularGrad)" strokeWidth="1.2" opacity="0.95" filter="url(#humanCinemaGlow)" />
              {/* Internal chakra solar plexus diamond star */}
              <polygon points="0,-4 1.5,-2 0,0 -1.5,-2" fill="#ffffff" filter="url(#humanCinemaGlow)" className="human-pinpoint-gleam" />

              {/* Graceful Ascending Torso dissolving seamlessly into Crystalline Light Stream */}
              <path
                d="M -4.8,-3.2 C -5.8,5 -2.4,13.5 0,20 C 2.4,13.5 5.8,5 4.8,-3.2 Z"
                fill="url(#photorealSkinSSS)"
                opacity="0.88"
                filter="url(#humanCinemaGlow)"
              />
              {/* Translucent crystal core overlay */}
              <path
                d="M -3,-1 C -4,6 -1.8,11 0,16 C 1.8,11 4,6 3,-1 Z"
                fill="#93c5fd"
                opacity="0.6"
              />

              {/* Gracefully outstretched arms in universal blessing & peace */}
              <path d="M -3.8,-2.2 Q -14,-7 -18,-3.8" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" filter="url(#humanCinemaGlow)" />
              <path d="M 3.8,-2.2 Q 14,-7 18,-3.8" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" filter="url(#humanCinemaGlow)" />
              {/* Blessing light emanations from palms */}
              <circle cx="-18" cy="-3.8" r="1.2" fill="#fef08a" filter="url(#humanCinemaGlow)" />
              <circle cx="18" cy="-3.8" r="1.2" fill="#fef08a" filter="url(#humanCinemaGlow)" />
            </g>

            {/* 360-Rotating Stardust DNA Double Helix Ribbons with Memory Nodes */}
            <g className="human-3d-dna-stream">
              <circle cx="-7.5" cy="6" r="1.8" fill="#ffffff" filter="url(#humanCinemaGlow)" />
              <circle cx="7.5" cy="8" r="2" fill="#fde047" filter="url(#humanCinemaGlow)" />
              <circle cx="-5.5" cy="15" r="1.8" fill="#60a5fa" />
              <circle cx="5.5" cy="17" r="1.6" fill="#ffffff" />
              {/* Connecting base-pair hydrogen rungs carrying memory codes */}
              <line x1="-7.5" y1="6" x2="7.5" y2="8" stroke="#93c5fd" strokeWidth="0.9" strokeDasharray="1.5 2.5" opacity="0.85" />
              <line x1="-5.5" y1="15" x2="5.5" y2="17" stroke="#93c5fd" strokeWidth="0.9" strokeDasharray="1.5 2.5" opacity="0.85" />
            </g>

            {/* Constellation Star Diamonds with 4-Point Diffraction Spikes ascending toward the Cosmic Tree */}
            <g transform="translate(0, -24)">
              <circle cx="-9.5" cy="-2.5" r="2.2" fill="#ffffff" className="tree-sparkle-1" />
              <circle cx="9.5" cy="-5.5" r="2.6" fill="#60a5fa" className="tree-sparkle-2" />
              <circle cx="0" cy="-16" r="3.6" fill="#fef08a" filter="url(#humanCinemaGlow)" className="human-pinpoint-gleam" />
              {/* 4-point diffraction spike on the apex legacy star */}
              <line x1="-6" y1="-16" x2="6" y2="-16" stroke="#ffffff" strokeWidth="0.8" opacity="0.9" />
              <line x1="0" y1="-22" x2="0" y2="-10" stroke="#ffffff" strokeWidth="0.8" opacity="0.9" />
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
