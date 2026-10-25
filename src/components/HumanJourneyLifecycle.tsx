import React from 'react';

/**
 * HumanJourneyLifecycle
 * A cinematic, high-fidelity SVG lifecycle animation integrated into the
 * empty dark flanking zones on the left and right sides of the Interactive Birthday Tree.
 *
 * Left Flank (Dawn of Life):
 *  - Stage 01: Infancy & Birth (The Spark / Baby in celestial cradle)
 *  - Stage 02: Childhood & Wonder (Joyful child with soaring star balloon)
 *  - Stage 03: Youth & Dreams (Student with illuminated book of knowledge)
 *  - Stage 04: Ambition & Path (Young adult stepping boldly into the world)
 *
 * Right Flank (Harvest of Wisdom):
 *  - Stage 05: Union & Kinship (Partners holding hands with child under love constellation)
 *  - Stage 06: Mastery & Mentorship (Leader planting and nurturing young sapling)
 *  - Stage 07: Wisdom & Golden Years (Serene elder on starlight bench reflecting on life)
 *  - Stage 08: Legacy & Transcendence (Celestial spirit ascending into eternal cosmos)
 */
export const HumanJourneyLifecycle: React.FC = () => {
  return (
    <g id="humanJourneyLifecycle" className="human-journey-suite pointer-events-none select-none">
      <defs>
        {/* Bio-Luminescent Lifeline Gradient for Left Flank */}
        <linearGradient id="lifelineGradLeft" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
          <stop offset="35%" stopColor="#34d399" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#fde047" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
        </linearGradient>

        {/* Bio-Luminescent Lifeline Gradient for Right Flank */}
        <linearGradient id="lifelineGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#10b981" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#eab308" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.9" />
        </linearGradient>

        {/* Milestone Node Radiance Filter */}
        <filter id="humanNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Milestone Card Shadow Filter */}
        <filter id="humanBadgeShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.85" />
        </filter>
      </defs>

      {/* =========================================================================
          LEFT FLANK: THE DAWN OF LIFE & GROWTH (STAGES 01 - 04)
          Bounding Box: x: 45 - 385, y: 480 - 755
          ========================================================================= */}
      <g className="human-journey-left-flank">
        {/* Subtle Ambient Cosmic Under-Glow */}
        <ellipse cx="210" cy="625" rx="160" ry="110" fill="#38bdf8" opacity="0.04" filter="url(#humanNodeGlow)" />

        {/* Header Capsule: The Dawn of Life */}
        <g transform="translate(60, 482)" filter="url(#humanBadgeShadow)">
          <rect x="0" y="0" width="225" height="24" rx="12" fill="#030712" fillOpacity="0.88" stroke="#38bdf8" strokeWidth="0.85" />
          <circle cx="14" cy="12" r="4.5" fill="#38bdf8" filter="url(#humanNodeGlow)" />
          <circle cx="14" cy="12" r="2" fill="#ffffff" />
          <text x="26" y="15.5" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace" letterSpacing="0.6">
            THE HUMAN JOURNEY
          </text>
          <text x="138" y="15.5" fill="#38bdf8" fontSize="7.5" fontWeight="600" fontFamily="ui-monospace, monospace">
            • I: DAWN OF LIFE
          </text>
        </g>

        {/* Flowing Bio-Luminescent Lifeline Conduit (Left) */}
        <g>
          {/* Base Guide Trace */}
          <path
            d="M 65,730 C 95,680 115,615 155,610 C 195,605 215,720 255,715 C 295,710 325,595 365,585"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.35"
          />
          {/* Luminous Pulsing Telemetry Lifeline */}
          <path
            d="M 65,730 C 95,680 115,615 155,610 C 195,605 215,720 255,715 C 295,710 325,595 365,585"
            fill="none"
            stroke="url(#lifelineGradLeft)"
            strokeWidth="2.4"
            strokeLinecap="round"
            filter="url(#humanNodeGlow)"
            className="human-lifeline-stream-left"
          />
        </g>

        {/* STAGE 01: INFANCY & BIRTH (The Spark / Newborn Cradle) */}
        <g id="stage-01-infancy" transform="translate(85, 705)">
          {/* Stage Pedestal Halo */}
          <circle cx="0" cy="0" r="16" fill="#030712" fillOpacity="0.9" stroke="#38bdf8" strokeWidth="1.2" filter="url(#humanBadgeShadow)" />
          <circle cx="0" cy="0" r="16" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.6" className="human-halo-pulse" />
          <text x="0" y="3.5" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace">
            01
          </text>

          {/* Artistic Silhouette: Celestial Baby Cradle with Newborn & Rotating Mobile Star */}
          <g transform="translate(0, -32)">
            {/* Cradle Rocker Arch */}
            <path d="M -16,6 Q 0,18 16,6" fill="none" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" />
            {/* Cradle Basket */}
            <path d="M -15,5 Q 0,-3 15,5 L 14,12 Q 0,15 -14,12 Z" fill="#0f172a" stroke="#93c5fd" strokeWidth="1" />
            {/* Swaddled Baby */}
            <circle cx="-1" cy="5" r="4.5" fill="#fef08a" />
            <path d="M -5,9 Q -1,13 4,9 Z" fill="#38bdf8" opacity="0.9" />
            {/* Floating Mobile Arm & Star */}
            <line x1="8" y1="4" x2="10" y2="-10" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />
            <line x1="10" y1="-10" x2="3" y2="-10" stroke="#64748b" strokeWidth="1" strokeLinecap="round" />
            <g transform="translate(3, -6)" className="human-star-mobile">
              <path d="M 0,-4 Q 0,0 4,0 Q 0,0 0,4 Q 0,0 -4,0 Q 0,0 0,-4 Z" fill="#fef08a" filter="url(#humanNodeGlow)" />
            </g>
          </g>

          {/* Stage Title & Milestone Badge */}
          <g transform="translate(0, 24)" filter="url(#humanBadgeShadow)">
            <rect x="-35" y="-7" width="70" height="15" rx="7.5" fill="#030712" fillOpacity="0.88" stroke="#38bdf8" strokeWidth="0.75" />
            <text x="0" y="2.5" textAnchor="middle" fill="#f8fafc" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
              INFANCY
            </text>
            <text x="0" y="14" textAnchor="middle" fill="#38bdf8" fontSize="6.5" fontWeight="600" fontFamily="ui-monospace, monospace">
              Age 0–3 • Spark of Life
            </text>
          </g>
        </g>

        {/* STAGE 02: CHILDHOOD (Wonder & Play / Soaring Balloon) */}
        <g id="stage-02-childhood" transform="translate(160, 600)">
          {/* Stage Pedestal Halo */}
          <circle cx="0" cy="0" r="16" fill="#030712" fillOpacity="0.9" stroke="#34d399" strokeWidth="1.2" filter="url(#humanBadgeShadow)" />
          <circle cx="0" cy="0" r="16" fill="none" stroke="#34d399" strokeWidth="1" opacity="0.6" className="human-halo-pulse-delayed" />
          <text x="0" y="3.5" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace">
            02
          </text>

          {/* Artistic Silhouette: Joyful Child running forward holding soaring star balloon */}
          <g transform="translate(0, -32)">
            {/* Running Child Silhouette */}
            <circle cx="0" cy="-2" r="4.2" fill="#fef08a" />
            <path
              d="M 0,2 L 0,14 M 0,6 L -7,10 M 0,6 L 7,2 M 0,14 L -6,24 M 0,14 L 6,22"
              stroke="#34d399"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Balloon String & Soaring Heart Balloon */}
            <path d="M 7,2 Q 14,-10 12,-22" fill="none" stroke="#fcd34d" strokeWidth="0.85" strokeDasharray="1.5 2" />
            <g transform="translate(12, -26)" className="human-balloon-bob">
              <ellipse cx="0" cy="0" rx="6" ry="7.5" fill="#ec4899" filter="url(#humanNodeGlow)" />
              <polygon points="0,7.5 -2,9.5 2,9.5" fill="#ec4899" />
              <circle cx="-2" cy="-2" r="1.5" fill="#ffffff" opacity="0.6" />
            </g>
          </g>

          {/* Stage Title & Milestone Badge */}
          <g transform="translate(0, 24)" filter="url(#humanBadgeShadow)">
            <rect x="-38" y="-7" width="76" height="15" rx="7.5" fill="#030712" fillOpacity="0.88" stroke="#34d399" strokeWidth="0.75" />
            <text x="0" y="2.5" textAnchor="middle" fill="#f8fafc" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
              CHILDHOOD
            </text>
            <text x="0" y="14" textAnchor="middle" fill="#34d399" fontSize="6.5" fontWeight="600" fontFamily="ui-monospace, monospace">
              Age 4–11 • Play & Wonder
            </text>
          </g>
        </g>

        {/* STAGE 03: YOUTH (Knowledge & Dreams / Holographic Book) */}
        <g id="stage-03-youth" transform="translate(255, 705)">
          {/* Stage Pedestal Halo */}
          <circle cx="0" cy="0" r="16" fill="#030712" fillOpacity="0.9" stroke="#818cf8" strokeWidth="1.2" filter="url(#humanBadgeShadow)" />
          <circle cx="0" cy="0" r="16" fill="none" stroke="#818cf8" strokeWidth="1" opacity="0.6" className="human-halo-pulse" />
          <text x="0" y="3.5" textAnchor="middle" fill="#818cf8" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace">
            03
          </text>

          {/* Artistic Silhouette: Sitting Youth Reading Glowing Cosmic Book */}
          <g transform="translate(0, -32)">
            {/* Head & Torso */}
            <circle cx="-2" cy="-4" r="4.5" fill="#fef08a" />
            <path
              d="M -2,1 L -3,13 L -11,21 M -3,13 L 5,21 M -2,6 L 6,10"
              stroke="#818cf8"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Glowing Holographic Book on lap */}
            <path
              d="M 2,8 L 9,12 L 16,8 L 16,13 L 9,17 L 2,13 Z"
              fill="#38bdf8"
              opacity="0.9"
              filter="url(#humanNodeGlow)"
            />
            {/* Knowledge Photons ascending */}
            <circle cx="7" cy="3" r="1.2" fill="#ffffff" className="human-photon-spark-1" />
            <circle cx="11" cy="-2" r="1.4" fill="#a7f3d0" className="human-photon-spark-2" />
          </g>

          {/* Stage Title & Milestone Badge */}
          <g transform="translate(0, 24)" filter="url(#humanBadgeShadow)">
            <rect x="-33" y="-7" width="66" height="15" rx="7.5" fill="#030712" fillOpacity="0.88" stroke="#818cf8" strokeWidth="0.75" />
            <text x="0" y="2.5" textAnchor="middle" fill="#f8fafc" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
              YOUTH
            </text>
            <text x="0" y="14" textAnchor="middle" fill="#818cf8" fontSize="6.5" fontWeight="600" fontFamily="ui-monospace, monospace">
              Age 12–19 • Dreams & Path
            </text>
          </g>
        </g>

        {/* STAGE 04: AMBITION (Career, Voyage & Stride) */}
        <g id="stage-04-ambition" transform="translate(350, 580)">
          {/* Stage Pedestal Halo */}
          <circle cx="0" cy="0" r="16" fill="#030712" fillOpacity="0.9" stroke="#f59e0b" strokeWidth="1.2" filter="url(#humanBadgeShadow)" />
          <circle cx="0" cy="0" r="16" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.6" className="human-halo-pulse-delayed" />
          <text x="0" y="3.5" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace">
            04
          </text>

          {/* Artistic Silhouette: Ambitious Explorer / Graduate Stepping Boldly Forward */}
          <g transform="translate(0, -32)">
            {/* Head with Graduation / Explorer Cap */}
            <circle cx="0" cy="-6" r="4.5" fill="#fef08a" />
            <polygon points="-6,-9 0,-12 6,-9 0,-6" fill="#fbbf24" stroke="#d97706" strokeWidth="0.6" />
            {/* Confident Striding Body */}
            <path
              d="M 0,-1 L 0,13 M 0,4 L -8,9 M 0,4 L 9,-2 M 0,13 L -8,25 M 0,13 L 8,24"
              stroke="#f59e0b"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Explorer Torch / Compass Light Beam */}
            <line x1="9" y1="-2" x2="19" y2="-8" stroke="#fef08a" strokeWidth="1.6" strokeLinecap="round" filter="url(#humanNodeGlow)" />
            <circle cx="20" cy="-9" r="2" fill="#ffffff" filter="url(#humanNodeGlow)" />
          </g>

          {/* Stage Title & Milestone Badge */}
          <g transform="translate(0, 24)" filter="url(#humanBadgeShadow)">
            <rect x="-36" y="-7" width="72" height="15" rx="7.5" fill="#030712" fillOpacity="0.88" stroke="#f59e0b" strokeWidth="0.75" />
            <text x="0" y="2.5" textAnchor="middle" fill="#f8fafc" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
              AMBITION
            </text>
            <text x="0" y="14" textAnchor="middle" fill="#f59e0b" fontSize="6.5" fontWeight="600" fontFamily="ui-monospace, monospace">
              Age 20–35 • Purpose & Work
            </text>
          </g>
        </g>
      </g>

      {/* =========================================================================
          RIGHT FLANK: HARVEST OF WISDOM & LEGACY (STAGES 05 - 08)
          Bounding Box: x: 615 - 955, y: 480 - 755
          ========================================================================= */}
      <g className="human-journey-right-flank">
        {/* Subtle Ambient Cosmic Under-Glow */}
        <ellipse cx="790" cy="625" rx="160" ry="110" fill="#a855f7" opacity="0.04" filter="url(#humanNodeGlow)" />

        {/* Header Capsule: Harvest of Wisdom */}
        <g transform="translate(710, 482)" filter="url(#humanBadgeShadow)">
          <rect x="0" y="0" width="235" height="24" rx="12" fill="#030712" fillOpacity="0.88" stroke="#a855f7" strokeWidth="0.85" />
          <circle cx="14" cy="12" r="4.5" fill="#a855f7" filter="url(#humanNodeGlow)" />
          <circle cx="14" cy="12" r="2" fill="#ffffff" />
          <text x="26" y="15.5" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace" letterSpacing="0.6">
            THE HUMAN JOURNEY
          </text>
          <text x="138" y="15.5" fill="#a855f7" fontSize="7.5" fontWeight="600" fontFamily="ui-monospace, monospace">
            • II: HARVEST & WISDOM
          </text>
        </g>

        {/* Flowing Bio-Luminescent Lifeline Conduit (Right) */}
        <g>
          {/* Base Guide Trace */}
          <path
            d="M 645,585 C 685,595 705,710 745,715 C 785,720 805,605 845,600 C 885,595 910,705 940,730"
            fill="none"
            stroke="#a855f7"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.35"
          />
          {/* Luminous Pulsing Telemetry Lifeline */}
          <path
            d="M 645,585 C 685,595 705,710 745,715 C 785,720 805,605 845,600 C 885,595 910,705 940,730"
            fill="none"
            stroke="url(#lifelineGradRight)"
            strokeWidth="2.4"
            strokeLinecap="round"
            filter="url(#humanNodeGlow)"
            className="human-lifeline-stream-right"
          />
        </g>

        {/* STAGE 05: UNION & FAMILY (Love, Kinship & Partnership) */}
        <g id="stage-05-union" transform="translate(650, 580)">
          {/* Stage Pedestal Halo */}
          <circle cx="0" cy="0" r="16" fill="#030712" fillOpacity="0.9" stroke="#ec4899" strokeWidth="1.2" filter="url(#humanBadgeShadow)" />
          <circle cx="0" cy="0" r="16" fill="none" stroke="#ec4899" strokeWidth="1" opacity="0.6" className="human-halo-pulse" />
          <text x="0" y="3.5" textAnchor="middle" fill="#ec4899" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace">
            05
          </text>

          {/* Artistic Silhouette: Two partners holding hands with little child and constellation heart */}
          <g transform="translate(0, -32)">
            {/* Partner 1 (Left) */}
            <circle cx="-8" cy="-5" r="4" fill="#fef08a" />
            <path d="M -8,0 L -8,14 M -8,14 L -13,25 M -8,14 L -6,25 M -8,5 L -1,10" stroke="#ec4899" strokeWidth="1.6" strokeLinecap="round" />
            {/* Partner 2 (Right) */}
            <circle cx="8" cy="-5" r="4" fill="#fef08a" />
            <path d="M 8,0 L 8,14 M 8,14 L 13,25 M 8,14 L 6,25 M 8,5 L 1,10" stroke="#ec4899" strokeWidth="1.6" strokeLinecap="round" />
            {/* Little Child in center */}
            <circle cx="0" cy="6" r="3" fill="#a7f3d0" />
            <path d="M 0,9 L 0,18 M 0,18 L -3,25 M 0,18 L 3,25" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round" />
            {/* Overhead Pulsing Love Constellation */}
            <g transform="translate(0, -18)" className="human-heart-pulse">
              <path
                d="M 0,-4 C -3,-8 -9,-6 -8,-1 C -7,3 0,7 0,7 C 0,7 7,3 8,-1 C 9,-6 3,-8 0,-4 Z"
                fill="#f43f5e"
                filter="url(#humanNodeGlow)"
              />
            </g>
          </g>

          {/* Stage Title & Milestone Badge */}
          <g transform="translate(0, 24)" filter="url(#humanBadgeShadow)">
            <rect x="-38" y="-7" width="76" height="15" rx="7.5" fill="#030712" fillOpacity="0.88" stroke="#ec4899" strokeWidth="0.75" />
            <text x="0" y="2.5" textAnchor="middle" fill="#f8fafc" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
              UNION & KIN
            </text>
            <text x="0" y="14" textAnchor="middle" fill="#ec4899" fontSize="6.5" fontWeight="600" fontFamily="ui-monospace, monospace">
              Age 36–49 • Love & Family
            </text>
          </g>
        </g>

        {/* STAGE 06: MASTERY & MENTORSHIP (Planting Seeds for Tomorrow) */}
        <g id="stage-06-mastery" transform="translate(745, 705)">
          {/* Stage Pedestal Halo */}
          <circle cx="0" cy="0" r="16" fill="#030712" fillOpacity="0.9" stroke="#10b981" strokeWidth="1.2" filter="url(#humanBadgeShadow)" />
          <circle cx="0" cy="0" r="16" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.6" className="human-halo-pulse-delayed" />
          <text x="0" y="3.5" textAnchor="middle" fill="#10b981" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace">
            06
          </text>

          {/* Artistic Silhouette: Mature Leader Mentoring & Nurturing Sapling */}
          <g transform="translate(0, -32)">
            {/* Mentor Figure */}
            <circle cx="-5" cy="-5" r="4.5" fill="#fef08a" />
            <path
              d="M -5,0 L -5,15 M -5,15 L -10,26 M -5,15 L -2,26 M -5,5 L 7,12"
              stroke="#10b981"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Glowing Young Sapling growing from earth */}
            <path d="M 12,25 L 12,14 M 12,18 Q 7,14 7,10 M 12,16 Q 17,12 17,9" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <circle cx="7" cy="10" r="1.5" fill="#a7f3d0" />
            <circle cx="17" cy="9" r="1.5" fill="#a7f3d0" />
            {/* Mentorship Light Ray */}
            <line x1="7" y1="12" x2="12" y2="15" stroke="#fde047" strokeWidth="1" strokeDasharray="1.5 1.5" filter="url(#humanNodeGlow)" />
          </g>

          {/* Stage Title & Milestone Badge */}
          <g transform="translate(0, 24)" filter="url(#humanBadgeShadow)">
            <rect x="-35" y="-7" width="70" height="15" rx="7.5" fill="#030712" fillOpacity="0.88" stroke="#10b981" strokeWidth="0.75" />
            <text x="0" y="2.5" textAnchor="middle" fill="#f8fafc" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
              MASTERY
            </text>
            <text x="0" y="14" textAnchor="middle" fill="#10b981" fontSize="6.5" fontWeight="600" fontFamily="ui-monospace, monospace">
              Age 50–64 • Planting Seeds
            </text>
          </g>
        </g>

        {/* STAGE 07: WISDOM (Golden Reflection on Starlight Bench) */}
        <g id="stage-07-wisdom" transform="translate(845, 600)">
          {/* Stage Pedestal Halo */}
          <circle cx="0" cy="0" r="16" fill="#030712" fillOpacity="0.9" stroke="#eab308" strokeWidth="1.2" filter="url(#humanBadgeShadow)" />
          <circle cx="0" cy="0" r="16" fill="none" stroke="#eab308" strokeWidth="1" opacity="0.6" className="human-halo-pulse" />
          <text x="0" y="3.5" textAnchor="middle" fill="#eab308" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace">
            07
          </text>

          {/* Artistic Silhouette: Wise Elder on Bench with Walking Cane */}
          <g transform="translate(0, -32)">
            {/* Seated Wise Elder */}
            <circle cx="-3" cy="-4" r="4.5" fill="#fef08a" />
            <path
              d="M -3,1 L -3,13 L 5,16 L 5,26 M -3,13 L -8,16 L -8,26 M -3,5 L 8,11"
              stroke="#eab308"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Bench Support */}
            <line x1="-14" y1="16" x2="12" y2="16" stroke="#92400e" strokeWidth="2.2" strokeLinecap="round" />
            {/* Walking Cane held gracefully */}
            <path d="M 8,11 L 8,26 M 6,10 Q 8,8 10,10" stroke="#ca8a04" strokeWidth="1.4" strokeLinecap="round" fill="none" />
            <circle cx="8" cy="26" r="1.5" fill="#fef08a" filter="url(#humanNodeGlow)" />
          </g>

          {/* Stage Title & Milestone Badge */}
          <g transform="translate(0, 24)" filter="url(#humanBadgeShadow)">
            <rect x="-35" y="-7" width="70" height="15" rx="7.5" fill="#030712" fillOpacity="0.88" stroke="#eab308" strokeWidth="0.75" />
            <text x="0" y="2.5" textAnchor="middle" fill="#f8fafc" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
              WISDOM
            </text>
            <text x="0" y="14" textAnchor="middle" fill="#eab308" fontSize="6.5" fontWeight="600" fontFamily="ui-monospace, monospace">
              Age 65–79 • Golden Grace
            </text>
          </g>
        </g>

        {/* STAGE 08: LEGACY & TRANSCENDENCE (The Eternal Cosmic Star) */}
        <g id="stage-08-legacy" transform="translate(935, 715)">
          {/* Stage Pedestal Halo */}
          <circle cx="0" cy="0" r="16" fill="#030712" fillOpacity="0.9" stroke="#60a5fa" strokeWidth="1.2" filter="url(#humanBadgeShadow)" />
          <circle cx="0" cy="0" r="16" fill="none" stroke="#60a5fa" strokeWidth="1" opacity="0.6" className="human-halo-pulse-delayed" />
          <text x="0" y="3.5" textAnchor="middle" fill="#60a5fa" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace">
            08
          </text>

          {/* Artistic Silhouette: Ethereal Ascending Celestial Spirit dissolving into Starfield */}
          <g transform="translate(0, -32)">
            {/* Luminous Spirit Silhouette */}
            <circle cx="0" cy="-6" r="4.8" fill="#ffffff" filter="url(#humanNodeGlow)" className="human-spirit-glow" />
            <path
              d="M 0,-1 Q 2,10 -3,20 M 0,3 L -7,10 M 0,3 L 8,9"
              stroke="#93c5fd"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="2.5 2"
              className="human-spirit-stream"
            />
            {/* Constellation Star Sparkles ascending to cosmic sky */}
            <g transform="translate(0, -18)">
              <circle cx="-5" cy="-2" r="1.6" fill="#ffffff" className="human-photon-spark-1" />
              <circle cx="6" cy="-6" r="2" fill="#60a5fa" className="human-photon-spark-2" />
              <circle cx="0" cy="-12" r="2.4" fill="#fef08a" filter="url(#humanNodeGlow)" className="human-spirit-glow" />
            </g>
          </g>

          {/* Stage Title & Milestone Badge */}
          <g transform="translate(0, 24)" filter="url(#humanBadgeShadow)">
            <rect x="-34" y="-7" width="68" height="15" rx="7.5" fill="#030712" fillOpacity="0.88" stroke="#60a5fa" strokeWidth="0.75" />
            <text x="0" y="2.5" textAnchor="middle" fill="#f8fafc" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
              LEGACY
            </text>
            <text x="0" y="14" textAnchor="middle" fill="#60a5fa" fontSize="6.5" fontWeight="600" fontFamily="ui-monospace, monospace">
              Age 80+ • Eternal Memory
            </text>
          </g>
        </g>
      </g>
    </g>
  );
};
