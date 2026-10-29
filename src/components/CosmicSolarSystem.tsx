import React, { useMemo, useRef, useEffect } from 'react';

interface CosmicSolarSystemProps {
  isPaused?: boolean;
  isTreeIconHovered?: boolean;
  onHoverPlanetChange?: (planet: string | null) => void;
}

interface PlanetConfig {
  id: string;
  name: string;
  symbol: string;
  pathId: string;
  dur: number;
  color: string;
  glowColor: string;
}

const PLANET_CONFIGS: PlanetConfig[] = [
  { id: 'mercury', name: 'Mercury', symbol: '☿', pathId: 'orbitMercuryPath', dur: 20, color: '#94a3b8', glowColor: '#cbd5e1' },
  { id: 'venus',   name: 'Venus',   symbol: '♀', pathId: 'orbitVenusPath',   dur: 32, color: '#fde047', glowColor: '#fef08a' },
  { id: 'earth',   name: 'Earth',   symbol: '♁', pathId: 'orbitEarthPath',   dur: 46, color: '#38bdf8', glowColor: '#7dd3fc' },
  { id: 'mars',    name: 'Mars',    symbol: '♂', pathId: 'orbitMarsPath',    dur: 62, color: '#fb7185', glowColor: '#fecdd3' },
  { id: 'jupiter', name: 'Jupiter', symbol: '♃', pathId: 'orbitJupiterPath', dur: 86, color: '#fbbf24', glowColor: '#fde68a' },
  { id: 'saturn',  name: 'Saturn',  symbol: '♄', pathId: 'orbitSaturnPath',  dur: 114, color: '#fcd34d', glowColor: '#fef08a' },
  { id: 'uranus',  name: 'Uranus',  symbol: '♅', pathId: 'orbitUranusPath',  dur: 146, color: '#22d3ee', glowColor: '#a5f3fc' },
  { id: 'neptune', name: 'Neptune', symbol: '♆', pathId: 'orbitNeptunePath', dur: 182, color: '#60a5fa', glowColor: '#93c5fd' },
];

interface ConstellationLineConfig {
  id: string;
  from: string;
  to: string;
  name: string;
  badge: string;
}

const CONSTELLATION_LINES: ConstellationLineConfig[] = [
  // 1. Planetary Sequential Ribbon (Harmonious orbit-to-orbit links across all 8 planets)
  { id: 'mercury-venus',  from: 'mercury', to: 'venus',   name: 'Mercury — Venus',   badge: '☿ ── ♀' },
  { id: 'venus-earth',    from: 'venus',   to: 'earth',   name: 'Venus — Earth',     badge: '♀ ── ♁' },
  { id: 'earth-mars',     from: 'earth',   to: 'mars',    name: 'Earth — Mars',      badge: '♁ ── ♂' },
  { id: 'mars-jupiter',   from: 'mars',    to: 'jupiter', name: 'Mars — Jupiter',    badge: '♂ ── ♃' },
  { id: 'jupiter-saturn', from: 'jupiter', to: 'saturn',  name: 'Jupiter — Saturn',  badge: '♃ ── ♄' },
  { id: 'saturn-uranus',  from: 'saturn',  to: 'uranus',  name: 'Saturn — Uranus',   badge: '♄ ── ♅' },
  { id: 'uranus-neptune', from: 'uranus',  to: 'neptune', name: 'Uranus — Neptune',  badge: '♅ ── ♆' },

  // 2. Solar & Gravitational Celestial Star Bridges
  { id: 'sun-mercury',       from: 'sun',       to: 'mercury', name: 'Sun — Mercury',       badge: '☉ ── ☿' },
  { id: 'sun-earth',         from: 'sun',       to: 'earth',   name: 'Sun — Earth',         badge: '☉ ── ♁' },
  { id: 'venus-mars',        from: 'venus',     to: 'mars',    name: 'Venus — Mars',        badge: '♀ ── ♂' },
  { id: 'earth-jupiter',     from: 'earth',     to: 'jupiter', name: 'Earth — Jupiter',     badge: '♁ ── ♃' },
  { id: 'mars-saturn',       from: 'mars',      to: 'saturn',  name: 'Mars — Saturn',       badge: '♂ ── ♄' },
  { id: 'jupiter-uranus',    from: 'jupiter',   to: 'uranus',  name: 'Jupiter — Uranus',    badge: '♃ ── ♅' },
  { id: 'blackhole-neptune', from: 'blackhole', to: 'neptune', name: 'Black Hole — Neptune',badge: '🕳 ── ♆' },
];

/**
 * Calculates Euclidean shortest distance from point (px, py) to line segment (x1, y1)-(x2, y2)
 */
function distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  return Math.hypot(px - projX, py - projY);
}

/**
 * CosmicSolarSystem
 * A breathtaking, cinematic live cosmic background featuring:
 * - A dual gravitational celestial center (Sun & Black Hole).
 * - All 8 realistic orbiting planets with crystal-clear upright identification tags.
 * - Interactive celestial star constellation lines connecting all planets that glow radiantly upon hover or cursor proximity.
 * - Deep space nebulae, galaxy spiral, twinkling starfield, and passing comets.
 * - Pure SVG & hardware-accelerated declarative animations with zero DOM layout shifts.
 * - Transform-based hardware-accelerated subtle mouse-following parallax drift for cosmic stars & nebula clouds.
 * - Interactive attract/repel depth response when hovering over the Birthday Tree icon.
 */
export const CosmicSolarSystem: React.FC<CosmicSolarSystemProps> = ({
  isPaused = false,
  isTreeIconHovered = false,
  onHoverPlanetChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const starsLayerRef = useRef<SVGGElement>(null);
  const nebulaeLayerRef = useRef<SVGGElement>(null);
  const nebulaeGradRef = useRef<HTMLDivElement>(null);
  const isIconHoveredRef = useRef(isTreeIconHovered);
  isIconHoveredRef.current = isTreeIconHovered;

  const constellationGroupRef = useRef<SVGGElement>(null);
  const hoveredLineIdRef = useRef<string | null>(null);
  const glowLevelsRef = useRef<number[]>(CONSTELLATION_LINES.map(() => 0));
  const orbitPathsRef = useRef<{ [key: string]: { path: SVGPathElement; length: number; dur: number } }>({});

  const lineElsRef = useRef<{
    ambient: SVGLineElement | null;
    glow: SVGLineElement | null;
    core: SVGLineElement | null;
    hit: SVGLineElement | null;
    midStar: SVGGElement | null;
    badge: SVGGElement | null;
  }[]>([]);

  const vertexElsRef = useRef<{ [key: string]: SVGGElement | null }>({});

  // Subtle mouse-following parallax drift effect & interactive star constellation hover tracking
  useEffect(() => {
    let animId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let currentHover = 0;

    let mouseSvgX = -9999;
    let mouseSvgY = -9999;
    let isMouseActive = false;

    // Cache orbit path references once mounted
    PLANET_CONFIGS.forEach((config) => {
      const pathEl = document.getElementById(config.pathId) as unknown as SVGPathElement | null;
      if (pathEl && typeof pathEl.getTotalLength === 'function') {
        orbitPathsRef.current[config.id] = {
          path: pathEl,
          length: pathEl.getTotalLength(),
          dur: config.dur,
        };
      }
    });

    const onMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate normalized cursor position relative to the tree canvas center (-1 to 1)
      const normX = (e.clientX - centerX) / (rect.width / 2 || 1);
      const normY = (e.clientY - centerY) / (rect.height / 2 || 1);

      // Clamped gentle range to preserve elegance
      targetX = Math.max(-1.25, Math.min(1.25, normX));
      targetY = Math.max(-1.25, Math.min(1.25, normY));

      // Calculate cursor position in SVG coordinate system (0 to 1000, 0 to 800)
      const svg = svgRef.current;
      if (svg) {
        const ctm = svg.getScreenCTM();
        if (ctm) {
          const pt = svg.createSVGPoint();
          pt.x = e.clientX;
          pt.y = e.clientY;
          const svgPt = pt.matrixTransform(ctm.inverse());
          mouseSvgX = svgPt.x;
          mouseSvgY = svgPt.y;
          isMouseActive = svgPt.x >= -60 && svgPt.x <= 1060 && svgPt.y >= -60 && svgPt.y <= 860;
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        onMouseMove(e.touches[0] as unknown as MouseEvent);
      }
    };

    const onMouseLeave = () => {
      targetX = 0;
      targetY = 0;
      isMouseActive = false;
      hoveredLineIdRef.current = null;
    };

    let lastFlickerTime = 0;

    const updateParallax = (time: number) => {
      // Fluid linear interpolation (lerp) for smooth gliding reaction
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      currentX += dx * 0.055;
      currentY += dy * 0.055;

      // Smooth lerp for subtle attract (stars) / repel (clouds) effect when mouse hovers Birthday Tree icon
      const targetHover = isIconHoveredRef.current ? 1 : 0;
      currentHover += (targetHover - currentHover) * 0.075;

      // Transform-based hardware acceleration via translate3d
      // 1. Cosmic Stars Layer: subtle distant celestial drift + attract focus toward Birthday Tree icon
      if (starsLayerRef.current) {
        const starAttractX = (-currentHover * 18).toFixed(2);
        const starAttractY = (-currentHover * 14).toFixed(2);
        const sx = (Number(currentX * 14) + Number(starAttractX)).toFixed(2);
        const sy = (Number(currentY * 10) + Number(starAttractY)).toFixed(2);
        const starScale = (1 + currentHover * 0.038).toFixed(3);
        starsLayerRef.current.style.transform = `translate3d(${sx}px, ${sy}px, 0) scale(${starScale})`;
      }

      // 2. Cosmic Nebula Clouds Layer: fluid interstellar gas drift + repel outward dispersion from Birthday Tree icon
      if (nebulaeLayerRef.current) {
        const nebulaRepelX = (currentHover * 24).toFixed(2);
        const nebulaRepelY = (currentHover * 18).toFixed(2);
        const nx = (Number(currentX * 22) + Number(nebulaRepelX)).toFixed(2);
        const ny = (Number(currentY * 15) + Number(nebulaRepelY)).toFixed(2);
        const nebulaScale = (1 - currentHover * 0.045).toFixed(3);
        nebulaeLayerRef.current.style.transform = `translate3d(${nx}px, ${ny}px, 0) scale(${nebulaScale})`;
      }

      // 3. Deep Galactic Nebula Gradients Layer
      if (nebulaeGradRef.current) {
        const gradRepelX = (currentHover * 10).toFixed(2);
        const gradRepelY = (currentHover * 8).toFixed(2);
        const gx = (Number(currentX * 8) + Number(gradRepelX)).toFixed(2);
        const gy = (Number(currentY * 6) + Number(gradRepelY)).toFixed(2);
        const gradScale = (1 + currentHover * 0.02).toFixed(3);
        nebulaeGradRef.current.style.transform = `translate3d(${gx}px, ${gy}px, 0) scale(${gradScale})`;
      }

      // Sporadically trigger small flickering star animations in cosmic-stars-layer based on mouse parallax movement
      const motionVelocity = Math.hypot(dx, dy);
      if (motionVelocity > 0.0022 && time - lastFlickerTime > 110) {
        if (Math.random() < 0.6) {
          lastFlickerTime = time;
          const randomIndex = Math.floor(Math.random() * 32);
          const starEl = document.getElementById(`cosmic-flicker-star-${randomIndex}`);
          if (starEl) {
            const variant = starEl.getAttribute('data-variant') || 'flicker-fast';
            starEl.classList.remove('flicker-fast', 'flicker-medium', 'flicker-bright');
            // Trigger reflow to restart CSS animation
            void starEl.clientWidth;
            starEl.classList.add(variant);
          }
        }
      }

      // Update interactive planetary constellation star lines connecting the solar system
      const svg = svgRef.current;
      if (svg) {
        const smilTime = typeof svg.getCurrentTime === 'function' ? svg.getCurrentTime() : (time / 1000);

        // Calculate live coordinates for celestial hubs and planets
        const positions: { [key: string]: { x: number; y: number } } = {
          sun: { x: 415, y: 240 },
          blackhole: { x: 585, y: 240 },
        };

        for (let i = 0; i < PLANET_CONFIGS.length; i++) {
          const cfg = PLANET_CONFIGS[i];
          let entry = orbitPathsRef.current[cfg.id];
          if (!entry) {
            const pathEl = document.getElementById(cfg.pathId) as unknown as SVGPathElement | null;
            if (pathEl && typeof pathEl.getTotalLength === 'function') {
              entry = {
                path: pathEl,
                length: pathEl.getTotalLength(),
                dur: cfg.dur,
              };
              orbitPathsRef.current[cfg.id] = entry;
            }
          }

          if (entry) {
            const progress = ((smilTime % entry.dur) + entry.dur) % entry.dur / entry.dur;
            const pt = entry.path.getPointAtLength(progress * entry.length);
            positions[cfg.id] = { x: pt.x, y: pt.y };
          } else {
            positions[cfg.id] = { x: 500, y: 240 };
          }
        }

        // Track maximum glow per planetary vertex
        const vertexGlows: { [key: string]: number } = {
          sun: 0,
          blackhole: 0,
          mercury: 0,
          venus: 0,
          earth: 0,
          mars: 0,
          jupiter: 0,
          saturn: 0,
          uranus: 0,
          neptune: 0,
        };

        const PROXIMITY_THRESHOLD = 82; // Distance in SVG units for proximity hover glow

        for (let j = 0; j < CONSTELLATION_LINES.length; j++) {
          const lineCfg = CONSTELLATION_LINES[j];
          const p1 = positions[lineCfg.from] || { x: 500, y: 240 };
          const p2 = positions[lineCfg.to] || { x: 500, y: 240 };

          // Determine target glow based on direct hover or proximity to line segment
          let targetGlow = 0;
          if (hoveredLineIdRef.current === lineCfg.id) {
            targetGlow = 1.0;
          } else if (isMouseActive) {
            const dist = distToSegment(mouseSvgX, mouseSvgY, p1.x, p1.y, p2.x, p2.y);
            if (dist < PROXIMITY_THRESHOLD) {
              const factor = 1 - (dist / PROXIMITY_THRESHOLD);
              targetGlow = Math.max(targetGlow, Math.pow(factor, 1.25));
            }
            // Proximity to endpoints (planets)
            const d1 = Math.hypot(mouseSvgX - p1.x, mouseSvgY - p1.y);
            const d2 = Math.hypot(mouseSvgX - p2.x, mouseSvgY - p2.y);
            if (d1 < 50) targetGlow = Math.max(targetGlow, (1 - d1 / 50) * 0.88);
            if (d2 < 50) targetGlow = Math.max(targetGlow, (1 - d2 / 50) * 0.88);
          }

          // Smooth lerp interpolation for glowing transition
          glowLevelsRef.current[j] += (targetGlow - glowLevelsRef.current[j]) * 0.16;
          const currentGlow = glowLevelsRef.current[j];

          vertexGlows[lineCfg.from] = Math.max(vertexGlows[lineCfg.from] || 0, currentGlow);
          vertexGlows[lineCfg.to] = Math.max(vertexGlows[lineCfg.to] || 0, currentGlow);

          const els = lineElsRef.current[j];
          if (els) {
            const sx1 = p1.x.toFixed(1);
            const sy1 = p1.y.toFixed(1);
            const sx2 = p2.x.toFixed(1);
            const sy2 = p2.y.toFixed(1);

            if (els.ambient) {
              els.ambient.setAttribute('x1', sx1);
              els.ambient.setAttribute('y1', sy1);
              els.ambient.setAttribute('x2', sx2);
              els.ambient.setAttribute('y2', sy2);
              els.ambient.setAttribute('stroke-opacity', (0.28 + currentGlow * 0.52).toFixed(2));
            }

            if (els.glow) {
              els.glow.setAttribute('x1', sx1);
              els.glow.setAttribute('y1', sy1);
              els.glow.setAttribute('x2', sx2);
              els.glow.setAttribute('y2', sy2);
              els.glow.setAttribute('stroke-opacity', (currentGlow * 0.95).toFixed(2));
              els.glow.setAttribute('stroke-width', (2.2 + currentGlow * 3.6).toFixed(1));
            }

            if (els.core) {
              els.core.setAttribute('x1', sx1);
              els.core.setAttribute('y1', sy1);
              els.core.setAttribute('x2', sx2);
              els.core.setAttribute('y2', sy2);
              els.core.setAttribute('stroke-opacity', (currentGlow * 0.92).toFixed(2));
            }

            if (els.hit) {
              els.hit.setAttribute('x1', sx1);
              els.hit.setAttribute('y1', sy1);
              els.hit.setAttribute('x2', sx2);
              els.hit.setAttribute('y2', sy2);
            }

            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            if (els.midStar) {
              const starScale = (0.75 + currentGlow * 0.85).toFixed(2);
              els.midStar.setAttribute('transform', `translate(${midX.toFixed(1)}, ${midY.toFixed(1)}) scale(${starScale})`);
              els.midStar.setAttribute('opacity', (0.35 + currentGlow * 0.65).toFixed(2));
            }

            if (els.badge) {
              if (currentGlow > 0.28) {
                const badgeOpacity = Math.min(1, (currentGlow - 0.28) / 0.52).toFixed(2);
                els.badge.setAttribute('transform', `translate(${midX.toFixed(1)}, ${(midY - 14).toFixed(1)})`);
                els.badge.setAttribute('opacity', badgeOpacity);
              } else {
                els.badge.setAttribute('opacity', '0');
              }
            }
          }
        }

        // Update planetary star vertices
        const vertexKeys = Object.keys(vertexGlows);
        for (let k = 0; k < vertexKeys.length; k++) {
          const key = vertexKeys[k];
          const vEl = vertexElsRef.current[key];
          const pos = positions[key];
          if (vEl && pos) {
            const vGlow = vertexGlows[key] || 0;
            const vScale = (0.85 + vGlow * 0.65).toFixed(2);
            vEl.setAttribute('transform', `translate(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}) scale(${vScale})`);
            vEl.setAttribute('opacity', (0.36 + vGlow * 0.64).toFixed(2));
          }
        }
      }

      animId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    animId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

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

  // Generate designated flickering stars that trigger sporadically on mouse parallax movement
  const flickerStars = useMemo(() => {
    const list = [];
    const count = 32;
    for (let i = 0; i < count; i++) {
      const seed1 = (i * 179.3) % 1;
      const seed2 = (i * 311.9) % 1;
      const seed3 = (i * 547.1) % 1;

      const x = Math.floor(seed1 * 960) + 20;
      const y = Math.floor(seed2 * 720) + 15;
      const r = seed3 > 0.7 ? 2.2 : seed3 > 0.35 ? 1.6 : 1.1;
      const color =
        i % 4 === 0
          ? '#ffffff'
          : i % 4 === 1
          ? '#93c5fd'
          : i % 4 === 2
          ? '#fef08a'
          : '#67e8f9';
      const animVariant = i % 3 === 0 ? 'flicker-bright' : i % 3 === 1 ? 'flicker-medium' : 'flicker-fast';

      list.push({ id: i, x, y, r, color, animVariant });
    }
    return list;
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Deep Galactic Nebula Gradients with Hardware-Accelerated Parallax */}
      <div ref={nebulaeGradRef} className="absolute inset-0 pointer-events-none will-change-transform">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,rgba(99,102,241,0.22)_0%,rgba(15,23,42,0.0)_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_35%,rgba(6,182,212,0.16)_0%,rgba(15,23,42,0.0)_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(236,72,153,0.14)_0%,rgba(15,23,42,0.0)_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_75%,rgba(16,185,129,0.10)_0%,rgba(15,23,42,0.0)_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_28%,rgba(168,85,247,0.18)_0%,rgba(15,23,42,0.0)_55%)]" />
      </div>

      {/* SVG Cosmic Solar System Canvas */}
      <svg
        ref={svgRef}
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

          {/* Constellation Starlight Line Glow Filters */}
          <filter id="constellationLineGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="constellationLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0.95" />
          </linearGradient>

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

          {/* Advanced Comet Dual Tail Gradients (Ion & Dust Tails) */}
          <linearGradient id="cometIonTailGrad" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="12%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="38%" stopColor="#818cf8" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#c084fc" stopOpacity="0.35" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="cometDustTailGrad" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="18%" stopColor="#fef08a" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.55" />
            <stop offset="80%" stopColor="#ea580c" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="cometSungrazerTailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="20%" stopColor="#34d399" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="85%" stopColor="#0284c7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          <filter id="cometHeadGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="glow1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="glow2" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="glow3" />
            <feMerge>
              <feMergeNode in="glow3" />
              <feMergeNode in="glow2" />
              <feMergeNode in="glow1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Dynamic Meteor Shower Trail Gradients */}
          <linearGradient id="meteorShowerGrad1" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="20%" stopColor="#67e8f9" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="meteorShowerGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="25%" stopColor="#fef08a" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="meteorShowerGrad3" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="25%" stopColor="#34d399" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#059669" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="meteorShowerGrad4" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="25%" stopColor="#c084fc" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="meteorShowerGrad5" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="25%" stopColor="#f472b6" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#e11d48" stopOpacity="0.35" />
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

        {/* 1. DISTANT COSMIC STARFIELD with Mouse-Following Parallax Drift & Sporadic Movement-Triggered Flickers */}
        <g ref={starsLayerRef} className="cosmic-stars-layer will-change-transform">
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

          {/* Small Sporadic Flickering Stars triggered by mouse parallax movement */}
          {flickerStars.map((star) => (
            <g
              key={`flicker-star-item-${star.id}`}
              id={`cosmic-flicker-star-${star.id}`}
              data-variant={star.animVariant}
              className="cosmic-flicker-star"
              transform={`translate(${star.x}, ${star.y})`}
            >
              <circle cx="0" cy="0" r={star.r} fill={star.color} />
              {/* Delicate 4-point Diamond Diffraction Spikes */}
              <path
                d={`M 0 -${(star.r * 2.8).toFixed(1)} Q 0 0 ${(star.r * 2.8).toFixed(1)} 0 Q 0 0 0 ${(star.r * 2.8).toFixed(1)} Q 0 0 -${(star.r * 2.8).toFixed(1)} 0 Z`}
                fill={star.color}
                opacity="0.9"
              />
              <circle cx="0" cy="0" r={(star.r * 0.45).toFixed(1)} fill="#ffffff" />
            </g>
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

        {/* 3. DYNAMIC COMET TRAVERSALS & BRILLIANT METEOR SHOWER TRAILS with Ion and Dust Tails */}
        <g className="cosmic-shooting-stars-layer pointer-events-none">
          {/* Great Comet 1: Majestic Long-Period Comet with Ion and Curved Dust Tails */}
          <g className="cosmic-comet-traverse-1">
            {/* Curved Diffuse Dust Tail (Swept backward by radiation pressure & orbital curvature) */}
            <path
              d="M 120,45 C 50,20 -40,10 -150,25 C -50,4 -10,12 120,45 Z"
              fill="url(#cometDustTailGrad)"
              opacity="0.8"
            />
            {/* Luminous Straight Ion Tail (Electric cyan-blue stream pointing directly away from solar wind) */}
            <polygon
              points="120,43 120,47 -170,12 -170,6"
              fill="url(#cometIonTailGrad)"
              opacity="0.95"
            />
            {/* Inner High-Density Ion Stream Filament */}
            <line x1="120" y1="45" x2="-100" y2="18" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
            {/* Trailing Micro-dust Sparkles */}
            <circle cx="60" cy="36" r="1.2" fill="#fef08a" opacity="0.8" />
            <circle cx="-10" cy="24" r="1.0" fill="#38bdf8" opacity="0.75" />
            <circle cx="-70" cy="18" r="0.8" fill="#ffffff" opacity="0.6" />
            {/* Glowing Coma Atmosphere */}
            <circle cx="120" cy="45" r="7" fill="#38bdf8" opacity="0.4" filter="url(#cometHeadGlow)" />
            <circle cx="120" cy="45" r="4.2" fill="#ffffff" filter="url(#cometHeadGlow)" />
            {/* Compact Brilliant Nucleus */}
            <circle cx="120" cy="45" r="2.2" fill="#ffffff" />
          </g>

          {/* Comet 2: Swift Sun-Grazer Perihelion Comet with Vaporizing Emerald/Cyan Tail */}
          <g className="cosmic-comet-traverse-2">
            {/* Vaporizing Sun-Grazing Tail Stream */}
            <polygon
              points="0,0 2,-4 -180,-35 -176,-30"
              fill="url(#cometSungrazerTailGrad)"
              opacity="0.9"
            />
            <line x1="0" y1="0" x2="-110" y2="-22" stroke="#ffffff" strokeWidth="1.4" opacity="0.85" />
            {/* Trailing Vapor Sparkles */}
            <circle cx="-35" cy="-7" r="1.1" fill="#34d399" opacity="0.8" />
            <circle cx="-85" cy="-17" r="0.9" fill="#67e8f9" opacity="0.7" />
            {/* Glowing Coma Head */}
            <circle cx="0" cy="0" r="6" fill="#34d399" opacity="0.38" filter="url(#cometHeadGlow)" />
            <circle cx="0" cy="0" r="3.4" fill="#ffffff" filter="url(#cometHeadGlow)" />
            <circle cx="0" cy="0" r="1.8" fill="#ffffff" />
          </g>

          {/* Meteor Shower Trail 1: Cyan-White High-Velocity Streak */}
          <g className="cosmic-meteor-streak-1">
            <line x1="140" y1="60" x2="-40" y2="-15" stroke="url(#meteorShowerGrad1)" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="140" y1="60" x2="50" y2="22" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" opacity="0.95" />
            <circle cx="140" cy="60" r="2.8" fill="#ffffff" filter="url(#solarCoreGlow)" />
            <circle cx="140" cy="60" r="1.4" fill="#67e8f9" />
          </g>

          {/* Meteor Shower Trail 2: Golden Amber Fireball Bolide with Spark Burst */}
          <g className="cosmic-meteor-streak-2">
            <line x1="780" y1="35" x2="940" y2="-30" stroke="url(#meteorShowerGrad2)" strokeWidth="3.4" strokeLinecap="round" />
            <line x1="780" y1="35" x2="860" y2="2" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.95" />
            <circle cx="780" cy="35" r="3.2" fill="#ffffff" filter="url(#solarCoreGlow)" />
            <circle cx="780" cy="35" r="1.6" fill="#fef08a" />
            {/* Fireball fragmentation sparks */}
            <circle cx="792" cy="30" r="0.9" fill="#f59e0b" opacity="0.8" />
            <circle cx="806" cy="24" r="0.7" fill="#fbbf24" opacity="0.7" />
          </g>

          {/* Meteor Shower Trail 3: Emerald Atmospheric Ionization Streak */}
          <g className="cosmic-meteor-streak-3">
            <line x1="220" y1="120" x2="50" y2="45" stroke="url(#meteorShowerGrad3)" strokeWidth="2.6" strokeLinecap="round" />
            <line x1="220" y1="120" x2="140" y2="85" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
            <circle cx="220" cy="120" r="2.5" fill="#ffffff" filter="url(#solarCoreGlow)" />
            <circle cx="220" cy="120" r="1.3" fill="#34d399" />
          </g>

          {/* Meteor Shower Trail 4: Violet-Blue High-Altitude Micro Meteor */}
          <g className="cosmic-meteor-streak-4">
            <line x1="680" y1="90" x2="820" y2="30" stroke="url(#meteorShowerGrad4)" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="680" y1="90" x2="730" y2="68" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" opacity="0.9" />
            <circle cx="680" cy="90" r="2.4" fill="#ffffff" filter="url(#solarCoreGlow)" />
            <circle cx="680" cy="90" r="1.2" fill="#c084fc" />
          </g>

          {/* Meteor Shower Trail 5: Luminous Rose-Pink Twilight Meteor */}
          <g className="cosmic-meteor-streak-5">
            <line x1="310" y1="80" x2="160" y2="15" stroke="url(#meteorShowerGrad5)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="310" y1="80" x2="240" y2="50" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
            <circle cx="310" cy="80" r="2.6" fill="#ffffff" filter="url(#solarCoreGlow)" />
            <circle cx="310" cy="80" r="1.3" fill="#f472b6" />
          </g>
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

        {/* 3.8 SLOWLY DRIFTING TRANSLUCENT NEBULA CLOUDS with Mouse-Following Parallax Drift */}
        <g ref={nebulaeLayerRef} className="cosmic-nebulae-container pointer-events-none will-change-transform" opacity="0.8">
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
        <g className="cosmic-plasma-bridge" opacity="0.75">
          <path
            d="M 425,236 C 465,224 525,222 575,236 C 530,248 470,246 425,236 Z"
            fill="url(#plasmaBridgeGrad)"
            filter="url(#solarCoreGlow)"
          />
          {/* Flowing plasma knots being siphoned across gravitational bridge */}
          <circle cx="465" cy="233" r="1.8" fill="#fef08a" opacity="0.8" className="cosmic-twinkle-1" />
          <circle cx="505" cy="231" r="2.2" fill="#38bdf8" opacity="0.85" className="cosmic-twinkle-2" />
          <circle cx="545" cy="234" r="1.6" fill="#c084fc" opacity="0.8" className="cosmic-twinkle-3" />
        </g>

        {/* 6. THE CENTRAL GLOWING SUN (Luminous Solar Powerhouse at cx=415, cy=240) */}
        <g id="cosmicSun" transform="translate(415, 240)">
          {/* Deep Solar Aura Glow (Volumetric Multi-Tier Flare) */}
          <circle cx="0" cy="0" r="125" fill="url(#sunAuraGrad)" className="cosmic-sun-aura-pulse" />
          <circle cx="0" cy="0" r="85" fill="url(#sunAuraGrad)" className="cosmic-sun-aura-inner" />

          {/* Dynamic Coronal Flare Prominences (Staggered Rotating Corona Rays) */}
          <g className="cosmic-solar-rays">
            {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((deg, i) => (
              <g key={`sun-ray-${deg}`} transform={`rotate(${deg})`}>
                <line
                  x1="0"
                  y1="-26"
                  x2="0"
                  y2={i % 3 === 0 ? '-58' : i % 2 === 0 ? '-48' : '-40'}
                  stroke="#f59e0b"
                  strokeWidth={i % 3 === 0 ? '3.2' : i % 2 === 0 ? '2.2' : '1.4'}
                  strokeLinecap="round"
                  opacity={i % 3 === 0 ? '0.85' : '0.55'}
                />
                {i % 4 === 0 && (
                  <circle cx="0" cy="-56" r="1.5" fill="#fef08a" filter="url(#solarCoreGlow)" />
                )}
              </g>
            ))}
          </g>

          {/* Magnetic Prominence Loops with Plasma Arcs (Organic Twisting Flare Wave) */}
          <g className="cosmic-sun-prominences">
            <path
              d="M -18,-20 C -25,-36 -2,-38 2,-25 M 14,-19 C 26,-30 36,-14 24,-7 M -22,8 C -35,16 -24,30 -12,24"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.8"
              opacity="0.85"
              filter="url(#solarCoreGlow)"
            />
            <path
              d="M 6,22 C 16,34 28,26 20,15"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              opacity="0.75"
              filter="url(#solarCoreGlow)"
            />
          </g>

          {/* Solar Photosphere & Chromospheric Edge Rim */}
          <circle cx="0" cy="0" r="32" fill="#ea580c" opacity="0.75" filter="url(#solarCoreGlow)" className="cosmic-sun-photosphere" />

          {/* Granulation & Internal Solar Convection Swirls */}
          <circle cx="0" cy="0" r="28" fill="#f97316" opacity="0.6" />
          <path
            d="M -12,-8 Q 0,-16 12,-6 Q 16,10 0,14 Q -16,8 -12,-8 Z"
            fill="#fbbf24"
            opacity="0.5"
            className="cosmic-sun-core"
          />

          {/* Blazing Incandescent Core (Thermonuclear Fusion Center) */}
          <circle cx="0" cy="0" r="25" fill="url(#sunCoreGrad)" filter="url(#solarCoreGlow)" className="cosmic-sun-core" />
          <circle cx="0" cy="0" r="15" fill="#ffffff" opacity="0.95" />
          <circle cx="0" cy="0" r="8" fill="#ffffff" filter="url(#solarCoreGlow)" />

          {/* Upright Crystal-Clear Sun Identification Badge */}
          <g transform="translate(0, 42)" filter="url(#labelBadgeGlow)">
            <rect x="-30" y="-8.5" width="60" height="17" rx="8.5" fill="#020617" fillOpacity="0.95" stroke="#f59e0b" strokeWidth="1.2" />
            <circle cx="-20" cy="0" r="2.2" fill="#f59e0b" filter="url(#solarCoreGlow)" />
            <text x="4" y="3.2" textAnchor="middle" fill="#fef08a" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace" letterSpacing="0.4">
              ☉ SUN
            </text>
          </g>
        </g>

        {/* 7. THE AWE-INSPIRING BLACK HOLE (Singularity with Relativistic Accretion Disk at cx=585, cy=240) */}
        <g id="cosmicBlackHole" transform="translate(585, 240)">
          {/* Relativistic Collimated Astrophysical Plasma Jets (North & South Poles) */}
          <g className="cosmic-blackhole-polar-jets" filter="url(#blackHoleGlow)">
            {/* North Polar Jet with Magnetic Pinch Nodes */}
            <polygon points="-3.5,-10 3.5,-10 7,-85 -7,-85" fill="url(#relativisticJetGradUp)" opacity="0.8" />
            <line x1="0" y1="-8" x2="0" y2="-105" stroke="#38bdf8" strokeWidth="2.4" strokeLinecap="round" opacity="0.95" />
            {/* North Jet Shock Diamonds */}
            <circle cx="0" cy="-35" r="2.2" fill="#ffffff" filter="url(#blackHoleGlow)" />
            <circle cx="0" cy="-65" r="1.8" fill="#c084fc" />
            <circle cx="0" cy="-90" r="1.4" fill="#38bdf8" />

            {/* South Polar Jet with Magnetic Pinch Nodes */}
            <polygon points="-3.5,10 3.5,10 7,85 -7,85" fill="url(#relativisticJetGradDown)" opacity="0.8" />
            <line x1="0" y1="8" x2="0" y2="105" stroke="#38bdf8" strokeWidth="2.4" strokeLinecap="round" opacity="0.95" />
            {/* South Jet Shock Diamonds */}
            <circle cx="0" cy="35" r="2.2" fill="#ffffff" filter="url(#blackHoleGlow)" />
            <circle cx="0" cy="65" r="1.8" fill="#c084fc" />
            <circle cx="0" cy="90" r="1.4" fill="#38bdf8" />
          </g>

          {/* Gravitational Lensing Outer Spacetime Warp Halo (Einstein Ring Distortion) */}
          <circle cx="0" cy="0" r="58" fill="url(#blackHoleLensingGrad)" className="cosmic-blackhole-lensing-pulse" />

          {/* Back Arc of Relativistic Swirling Accretion Disk (Gravitationally Lensed Over & Under Singularity) */}
          <g className="cosmic-accretion-disk-swirl cosmic-accretion-warp">
            {/* Top Lensed Light Arch (Interstellar-Style Gravitational Wrap) */}
            <path
              d="M -48,-2 C -48,-36 48,-36 48,-2 C 42,-20 -42,-20 -48,-2 Z"
              fill="url(#blackHoleAccretionGrad)"
              opacity="0.9"
              filter="url(#blackHoleGlow)"
            />
            {/* Inner hot edge of top lensed light */}
            <path
              d="M -38,-4 C -38,-28 38,-28 38,-4 C 32,-16 -32,-16 -38,-4 Z"
              fill="none"
              stroke="#fef08a"
              strokeWidth="1.2"
              opacity="0.85"
            />
            {/* Bottom Lensed Light Arch */}
            <path
              d="M -46,2 C -46,32 46,32 46,2 C 40,16 -40,16 -46,2 Z"
              fill="url(#blackHoleAccretionGrad)"
              opacity="0.75"
              filter="url(#blackHoleGlow)"
            />

            {/* Main Equatorial Accretion Disk (Tilted 3D Relativistic Swirl) */}
            <ellipse cx="0" cy="0" rx="52" ry="14" fill="none" stroke="url(#blackHoleAccretionGrad)" strokeWidth="7" opacity="0.95" filter="url(#blackHoleGlow)" />
            <ellipse cx="0" cy="0" rx="44" ry="11" fill="none" stroke="#fde047" strokeWidth="2.2" opacity="0.85" />
            <ellipse cx="0" cy="0" rx="38" ry="9" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.9" />
          </g>

          {/* Photon Sphere (Ultra-Bright Relativistic Ring of Trapped Photons at 1.5 R_s) */}
          <circle cx="0" cy="0" r="18.5" fill="none" stroke="#ffffff" strokeWidth="2" filter="url(#blackHoleGlow)" className="cosmic-photon-sphere" />
          <circle cx="0" cy="0" r="17.2" fill="none" stroke="#38bdf8" strokeWidth="1.2" opacity="0.95" />

          {/* Pitch-Black Event Horizon (Absolute Gravitational Singularity Shadow) */}
          <circle cx="0" cy="0" r="16" fill="#000000" stroke="#000000" strokeWidth="1.6" />

          {/* Front Edge of Swirling Accretion Disk passing in front of Event Horizon with Doppler Asymmetry */}
          <g transform="rotate(-6)">
            {/* Approaching blue-shifted left side */}
            <path
              d="M -48,0 A 48 13 0 0 0 0,13"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="6"
              opacity="0.98"
              filter="url(#blackHoleGlow)"
            />
            {/* Receding red-shifted right side */}
            <path
              d="M 0,13 A 48 13 0 0 0 48,0"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="5"
              opacity="0.85"
              filter="url(#blackHoleGlow)"
            />
            <path
              d="M -44,0 A 44 11 0 0 0 44,0"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.2"
              opacity="0.9"
            />
          </g>

          {/* Upright Crystal-Clear Black Hole Identification Badge */}
          <g transform="translate(0, 42)" filter="url(#labelBadgeGlow)">
            <rect x="-44" y="-8.5" width="88" height="17" rx="8.5" fill="#020617" fillOpacity="0.95" stroke="#a855f7" strokeWidth="1.2" />
            <circle cx="-32" cy="0" r="2.2" fill="#a855f7" filter="url(#solarCoreGlow)" />
            <text x="5" y="3.2" textAnchor="middle" fill="#e9d5ff" fontSize="8" fontWeight="bold" fontFamily="ui-monospace, monospace" letterSpacing="0.4">
              🕳 BLACK HOLE
            </text>
          </g>
        </g>

        {/* 7.5 INTERACTIVE PLANETARY CONSTELLATION STAR LINES (Glow on Hover/Proximity) */}
        <g ref={constellationGroupRef} className="cosmic-constellations-layer">
          {/* Constellation Line Segments */}
          {CONSTELLATION_LINES.map((line, idx) => (
            <g key={`constellation-${line.id}`} className="cosmic-constellation-pair">
              {/* 1. Ambient Background Constellation Line (Subtle celestial dashed guide) */}
              <line
                ref={(el) => {
                  if (!lineElsRef.current[idx]) {
                    lineElsRef.current[idx] = { ambient: null, glow: null, core: null, hit: null, midStar: null, badge: null };
                  }
                  lineElsRef.current[idx].ambient = el;
                }}
                className="constellation-ambient-line"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeOpacity="0.28"
                strokeDasharray="4 6"
              />

              {/* 2. Radiant Starlight Glow Aura (Intensifies on Hover/Proximity) */}
              <line
                ref={(el) => {
                  if (!lineElsRef.current[idx]) {
                    lineElsRef.current[idx] = { ambient: null, glow: null, core: null, hit: null, midStar: null, badge: null };
                  }
                  lineElsRef.current[idx].glow = el;
                }}
                stroke="#38bdf8"
                strokeWidth="3.6"
                strokeOpacity="0"
                strokeLinecap="round"
                filter="url(#constellationLineGlow)"
              />

              {/* 3. Incandescent Core Starlight Beam */}
              <line
                ref={(el) => {
                  if (!lineElsRef.current[idx]) {
                    lineElsRef.current[idx] = { ambient: null, glow: null, core: null, hit: null, midStar: null, badge: null };
                  }
                  lineElsRef.current[idx].core = el;
                }}
                stroke="#f0f9ff"
                strokeWidth="1.4"
                strokeOpacity="0"
                strokeLinecap="round"
              />

              {/* 4. Interactive Transparent Hover Target (Wider stroke for direct hovering) */}
              <line
                ref={(el) => {
                  if (!lineElsRef.current[idx]) {
                    lineElsRef.current[idx] = { ambient: null, glow: null, core: null, hit: null, midStar: null, badge: null };
                  }
                  lineElsRef.current[idx].hit = el;
                }}
                stroke="transparent"
                strokeWidth="32"
                pointerEvents="stroke"
                className="cursor-pointer"
                onMouseEnter={() => {
                  hoveredLineIdRef.current = line.id;
                }}
                onMouseLeave={() => {
                  if (hoveredLineIdRef.current === line.id) {
                    hoveredLineIdRef.current = null;
                  }
                }}
              />

              {/* 5. Midpoint Constellation Diamond Star Node */}
              <g
                ref={(el) => {
                  if (!lineElsRef.current[idx]) {
                    lineElsRef.current[idx] = { ambient: null, glow: null, core: null, hit: null, midStar: null, badge: null };
                  }
                  lineElsRef.current[idx].midStar = el;
                }}
                className="constellation-mid-star pointer-events-none"
                opacity="0.35"
              >
                {/* 4-point Diamond Diffraction Spikes */}
                <polygon points="0,-4.5 3.5,0 0,4.5 -3.5,0" fill="#38bdf8" opacity="0.85" />
                <circle cx="0" cy="0" r="1.4" fill="#ffffff" filter="url(#solarCoreGlow)" />
                <circle cx="0" cy="0" r="0.8" fill="#ffffff" />
              </g>

              {/* 6. Midpoint Upright Readable Constellation Label Badge */}
              <g
                ref={(el) => {
                  if (!lineElsRef.current[idx]) {
                    lineElsRef.current[idx] = { ambient: null, glow: null, core: null, hit: null, midStar: null, badge: null };
                  }
                  lineElsRef.current[idx].badge = el;
                }}
                className="pointer-events-none"
                opacity="0"
                filter="url(#labelBadgeGlow)"
              >
                <rect x="-38" y="-8.5" width="76" height="17" rx="8.5" fill="#020617" fillOpacity="0.95" stroke="#38bdf8" strokeWidth="1.2" />
                <circle cx="-28" cy="0" r="2.2" fill="#38bdf8" filter="url(#solarCoreGlow)" />
                <text x="4" y="3.2" textAnchor="middle" fill="#bae6fd" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace" letterSpacing="0.3">
                  {line.badge}
                </text>
              </g>
            </g>
          ))}

          {/* Constellation Star Vertices at Each Planet & Celestial Center */}
          {[
            { id: 'sun', symbol: '☉', color: '#f59e0b' },
            { id: 'blackhole', symbol: '🕳', color: '#a855f7' },
            ...PLANET_CONFIGS,
          ].map((item) => (
            <g
              key={`vertex-${item.id}`}
              ref={(el) => {
                vertexElsRef.current[item.id] = el;
              }}
              className="constellation-vertex pointer-events-none"
              opacity="0.4"
            >
              {/* Outer pulsing starlight halo ring */}
              <circle cx="0" cy="0" r="12" fill="none" stroke={item.color} strokeWidth="0.8" opacity="0.5" strokeDasharray="2 3" />
              {/* 4-point diamond diffraction spikes */}
              <path
                d="M 0 -9 Q 0 0 9 0 Q 0 0 0 9 Q 0 0 -9 0 Z"
                fill={item.color}
                opacity="0.8"
                filter="url(#solarCoreGlow)"
              />
              {/* Brilliant starlight nucleus */}
              <circle cx="0" cy="0" r="2.4" fill="#ffffff" filter="url(#solarCoreGlow)" />
              <circle cx="0" cy="0" r="1.3" fill="#ffffff" />
            </g>
          ))}
        </g>

        {/* 8. ORBITING PLANETS (ALL 8 REALISTIC PLANETS WITH REAL-TIME MOTION & UPRIGHT READABLE NAME TAGS) */}
        {/* SVG animateMotion without rotate="auto" guarantees all child badges & typography stay perfectly upright! */}

        {/* Planet 1: Mercury */}
        <g className="cosmic-planet-group">
          <g>
            <animateMotion dur="20s" repeatCount="indefinite">
              <mpath href="#orbitMercuryPath" />
            </animateMotion>
            {/* Specular Limb Ambient Ring */}
            <circle cx="0" cy="0" r="6.2" fill="#94a3b8" opacity="0.22" filter="url(#solarCoreGlow)" />
            {/* Mercury Body with Basalt Impact Craters & Terminator Shadow */}
            <circle cx="0" cy="0" r="5" fill="url(#mercuryGrad)" />
            {/* Daytime Specular Crescent */}
            <path d="M -3.5,-3.5 A 5 5 0 0 1 3.5,3.5 A 5 5 0 0 0 -3.5,-3.5 Z" fill="#ffffff" opacity="0.45" />
            <circle cx="-1.2" cy="-1.4" r="1.3" fill="#ffffff" opacity="0.65" />
            {/* Caloris Basin Impact Ring */}
            <circle cx="1.5" cy="0.8" r="1.5" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.8" />
            <circle cx="1.5" cy="0.8" r="0.6" fill="#1e293b" />
            {/* Terminator 3D Shadow */}
            <path d="M 0,-5 A 5 5 0 0 1 5,0 A 5 5 0 0 1 0,5 A 5 5 0 0 0 0,-5 Z" fill="#020617" opacity="0.45" />

            {/* Upright Readable Name Tag */}
            <g transform="translate(0, 16)" filter="url(#labelBadgeGlow)">
              <rect x="-28" y="-7.5" width="56" height="15" rx="7.5" fill="#020617" fillOpacity="0.95" stroke="#94a3b8" strokeWidth="1.2" />
              <circle cx="-18" cy="0" r="2.2" fill="#94a3b8" filter="url(#solarCoreGlow)" />
              <text x="3" y="3" textAnchor="middle" fill="#f1f5f9" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
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
            {/* Venus Runaway Greenhouse Atmosphere Glow */}
            <circle cx="0" cy="0" r="10" fill="#fde047" opacity="0.36" filter="url(#solarCoreGlow)" />
            {/* Venus Body with Swirling Sulfuric Acid Cloud Deck */}
            <circle cx="0" cy="0" r="7.2" fill="url(#venusGrad)" />
            {/* Daytime Specular Atmospheric Crescent */}
            <path d="M -5,-5 A 7.2 7.2 0 0 1 5,5 A 7.2 7.2 0 0 0 -5,-5 Z" fill="#ffffff" opacity="0.45" />
            <path d="M -4,-3.5 C -1,-5 2,-2 5,-4 M -5,1.5 C -2,3.5 2,1 5,3" stroke="#fef08a" strokeWidth="1.2" fill="none" opacity="0.75" strokeLinecap="round" />

            {/* Upright Readable Name Tag */}
            <g transform="translate(0, 19)" filter="url(#labelBadgeGlow)">
              <rect x="-26" y="-7.5" width="52" height="15" rx="7.5" fill="#020617" fillOpacity="0.95" stroke="#fde047" strokeWidth="1.2" />
              <circle cx="-17" cy="0" r="2.2" fill="#fde047" filter="url(#solarCoreGlow)" />
              <text x="3" y="3" textAnchor="middle" fill="#fef08a" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
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
            {/* Earth Rayleigh Scattering Atmospheric Ozone Glow */}
            <circle cx="0" cy="0" r="12.5" fill="#38bdf8" opacity="0.42" filter="url(#solarCoreGlow)" />
            {/* Earth Ocean Body */}
            <circle cx="0" cy="0" r="9" fill="url(#earthGrad)" />
            {/* Continental Landmasses (Africa / Eurasia / Americas in Emerald & Ochre) */}
            <path
              d="M -4.5,-2.5 C -3,1 0,1 1.2,-1.2 C 2.5,-3 5,-2 4.2,1.2 C 3.2,4.2 0,4.2 -2.2,3 C -4.2,2 -5.5,-1 -4.5,-2.5 Z"
              fill="#10b981"
              opacity="0.95"
            />
            <path
              d="M -6,0 C -5,2 -4,3 -3,1.5 Z"
              fill="#d97706"
              opacity="0.8"
            />
            {/* Swirling Cyclonic Cloud Decks */}
            <path
              d="M -7,-3 C -2.5,-5.5 2,-2 7,-3.5 M -7.5,1.5 C -3,3 2,0.5 7,2.5"
              stroke="#ffffff"
              strokeWidth="1.3"
              fill="none"
              opacity="0.85"
              strokeLinecap="round"
            />
            {/* Daytime Atmospheric Specular Crescent */}
            <path d="M -6,-6 A 9 9 0 0 1 6,6 A 9 9 0 0 0 -6,-6 Z" fill="#ffffff" opacity="0.4" />
            {/* Realistic Miniature Moon (Luna) with Elliptical Sub-Orbit */}
            <g className="cosmic-moon-orbit-system">
              <g transform="translate(17, -2)">
                <circle cx="0" cy="0" r="2.8" fill="#e2e8f0" opacity="0.3" filter="url(#solarCoreGlow)" />
                <circle cx="0" cy="0" r="2.4" fill="url(#moonGrad)" />
                <circle cx="-0.5" cy="-0.5" r="0.8" fill="#334155" opacity="0.75" />
              </g>
            </g>

            {/* Upright Readable Name Tag */}
            <g transform="translate(0, 22)" filter="url(#labelBadgeGlow)">
              <rect x="-42" y="-7.5" width="84" height="15" rx="7.5" fill="#020617" fillOpacity="0.95" stroke="#38bdf8" strokeWidth="1.2" />
              <circle cx="-32" cy="0" r="2.2" fill="#38bdf8" filter="url(#solarCoreGlow)" />
              <text x="3" y="3" textAnchor="middle" fill="#7dd3fc" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
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
            {/* Mars Thin Atmospheric Rim */}
            <circle cx="0" cy="0" r="8.8" fill="#fb7185" opacity="0.38" filter="url(#solarCoreGlow)" />
            {/* Mars Iron-Oxide Body */}
            <circle cx="0" cy="0" r="6.2" fill="url(#marsGrad)" />
            {/* Daytime Specular Rim */}
            <path d="M -4.2,-4.2 A 6.2 6.2 0 0 1 4.2,4.2 A 6.2 6.2 0 0 0 -4.2,-4.2 Z" fill="#fecdd3" opacity="0.4" />
            {/* Dark Volcanic Basalt Plateaus & Valles Marineris Canyon Rift */}
            <path d="M -3,0 L 2.5,-1" stroke="#4c0519" strokeWidth="0.8" strokeLinecap="round" opacity="0.9" />
            <circle cx="-1.5" cy="2" r="1.2" fill="#7f1d1d" opacity="0.75" />
            {/* Brilliant White Polar Ice Cap */}
            <ellipse cx="-1.5" cy="-4" rx="1.6" ry="0.9" fill="#ffffff" opacity="0.98" />

            {/* Upright Readable Name Tag */}
            <g transform="translate(0, 18)" filter="url(#labelBadgeGlow)">
              <rect x="-24" y="-7.5" width="48" height="15" rx="7.5" fill="#020617" fillOpacity="0.95" stroke="#fb7185" strokeWidth="1.2" />
              <circle cx="-15" cy="0" r="2.2" fill="#fb7185" filter="url(#solarCoreGlow)" />
              <text x="3" y="3" textAnchor="middle" fill="#fca5a5" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
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
            {/* Jupiter Magnetosphere & Radiation Belt Glow */}
            <circle cx="0" cy="0" r="22" fill="#f59e0b" opacity="0.28" filter="url(#solarCoreGlow)" />
            {/* Multi-Banded Gas Giant Sphere (Belts and Zones) */}
            <circle cx="0" cy="0" r="15" fill="url(#jupiterGrad)" />
            {/* Atmospheric Banding Details */}
            <line x1="-14" y1="-5" x2="14" y2="-5" stroke="#78350f" strokeWidth="1.2" opacity="0.75" />
            <line x1="-15" y1="0" x2="15" y2="0" stroke="#fef3c7" strokeWidth="1.2" opacity="0.85" />
            <line x1="-14" y1="5" x2="14" y2="5" stroke="#9a3412" strokeWidth="1.4" opacity="0.8" />
            {/* The Iconic Great Red Spot with Internal Swirling Core */}
            <ellipse cx="4" cy="3" rx="4.2" ry="2.6" fill="#991b1b" opacity="0.98" />
            <ellipse cx="4" cy="3" rx="2.5" ry="1.5" fill="#f87171" opacity="0.95" />
            <circle cx="4.2" cy="3" r="0.8" fill="#ffffff" opacity="0.9" />
            {/* 3D Daytime Specular Edge */}
            <path d="M -10,-10 A 15 15 0 0 1 10,10 A 15 15 0 0 0 -10,-10 Z" fill="#ffffff" opacity="0.32" />
            {/* 3D Terminator Shadow */}
            <path
              d="M 0,-15 A 15 15 0 0 1 15,0 A 15 15 0 0 1 0,15 A 15 15 0 0 0 0,-15 Z"
              fill="#0f172a"
              opacity="0.38"
            />

            {/* Upright Readable Name Tag (Above planet body for clear view) */}
            <g transform="translate(0, -23)" filter="url(#labelBadgeGlow)">
              <rect x="-28" y="-7.5" width="56" height="15" rx="7.5" fill="#020617" fillOpacity="0.95" stroke="#fbbf24" strokeWidth="1.2" />
              <circle cx="-19" cy="0" r="2.2" fill="#fbbf24" filter="url(#solarCoreGlow)" />
              <text x="3" y="3" textAnchor="middle" fill="#fde68a" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
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
              {/* Outer A Ring */}
              <ellipse cx="0" cy="0" rx="30" ry="9" fill="none" stroke="url(#saturnRingGrad)" strokeWidth="5.2" opacity="0.9" />
              {/* Cassini Division Gap */}
              <ellipse cx="0" cy="0" rx="25" ry="7.5" fill="none" stroke="#000000" strokeWidth="0.8" opacity="0.95" />
              {/* Inner B Ring */}
              <ellipse cx="0" cy="0" rx="22" ry="6.5" fill="none" stroke="#fef08a" strokeWidth="2.8" opacity="0.8" />
            </g>
            {/* Saturn Globe Body */}
            <circle cx="0" cy="0" r="11.5" fill="url(#saturnGrad)" />
            {/* Daytime Specular Crescent */}
            <path d="M -8,-8 A 11.5 11.5 0 0 1 8,8 A 11.5 11.5 0 0 0 -8,-8 Z" fill="#ffffff" opacity="0.35" />
            {/* Ring Shadow cast across Globe */}
            <path d="M -9,1 L 9,-2" stroke="#451a03" strokeWidth="1.2" opacity="0.65" />

            {/* Saturn Front Half of Rings passing over the Globe */}
            <g transform="rotate(-18)">
              <path
                d="M -30,0 A 30 9 0 0 0 30,0"
                fill="none"
                stroke="url(#saturnRingGrad)"
                strokeWidth="5.2"
                opacity="0.98"
              />
              <path
                d="M -25,0 A 25 7.5 0 0 0 25,0"
                fill="none"
                stroke="#000000"
                strokeWidth="0.8"
                opacity="0.98"
              />
              <path
                d="M -22,0 A 22 6.5 0 0 0 22,0"
                fill="none"
                stroke="#fef08a"
                strokeWidth="2.8"
                opacity="0.88"
              />
            </g>

            {/* Upright Readable Name Tag (Above rings for clear view) */}
            <g transform="translate(0, -22)" filter="url(#labelBadgeGlow)">
              <rect x="-27" y="-7.5" width="54" height="15" rx="7.5" fill="#020617" fillOpacity="0.95" stroke="#fcd34d" strokeWidth="1.2" />
              <circle cx="-18" cy="0" r="2.2" fill="#fcd34d" filter="url(#solarCoreGlow)" />
              <text x="3" y="3" textAnchor="middle" fill="#fef08a" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
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
              <ellipse cx="0" cy="0" rx="20" ry="4.2" fill="none" stroke="url(#uranusRingGrad)" strokeWidth="2.4" opacity="0.7" />
            </g>
            {/* Uranus Atmospheric Methane Haze Glow */}
            <circle cx="0" cy="0" r="13.5" fill="#22d3ee" opacity="0.32" filter="url(#solarCoreGlow)" />
            {/* Uranus Globe Body */}
            <circle cx="0" cy="0" r="9.5" fill="url(#uranusGrad)" />
            {/* Delicate atmospheric limb brightening */}
            <circle cx="0" cy="0" r="8.5" fill="none" stroke="#cffafe" strokeWidth="0.8" opacity="0.7" />
            {/* Daytime Specular Crescent */}
            <path d="M -6.5,-6.5 A 9.5 9.5 0 0 1 6.5,6.5 A 9.5 9.5 0 0 0 -6.5,-6.5 Z" fill="#ffffff" opacity="0.4" />
            {/* Front half of vertical ice rings */}
            <g transform="rotate(78)">
              <path
                d="M -20,0 A 20 4.2 0 0 0 20,0"
                fill="none"
                stroke="url(#uranusRingGrad)"
                strokeWidth="2.4"
                opacity="0.92"
              />
            </g>

            {/* Upright Readable Name Tag */}
            <g transform="translate(0, 22)" filter="url(#labelBadgeGlow)">
              <rect x="-28" y="-7.5" width="56" height="15" rx="7.5" fill="#020617" fillOpacity="0.95" stroke="#22d3ee" strokeWidth="1.2" />
              <circle cx="-19" cy="0" r="2.2" fill="#22d3ee" filter="url(#solarCoreGlow)" />
              <text x="3" y="3" textAnchor="middle" fill="#a5f3fc" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
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
            <circle cx="0" cy="0" r="13" fill="#3b82f6" opacity="0.36" filter="url(#solarCoreGlow)" />
            {/* Neptune Globe Body */}
            <circle cx="0" cy="0" r="9" fill="url(#neptuneGrad)" />
            {/* Daytime Specular Crescent */}
            <path d="M -6,-6 A 9 9 0 0 1 6,6 A 9 9 0 0 0 -6,-6 Z" fill="#ffffff" opacity="0.4" />
            {/* High-Altitude White Methane Cirrus Cloud Streaks */}
            <path
              d="M -7,-2.8 C -2,-4.5 2,-1.5 7,-2.2 M -7.5,2.2 C -3,3.8 2,1.5 7,2.8"
              stroke="#bae6fd"
              strokeWidth="1.2"
              fill="none"
              opacity="0.9"
              strokeLinecap="round"
            />
            {/* The Great Dark Spot Storm Vortex */}
            <ellipse cx="-2.5" cy="1" rx="2.4" ry="1.5" fill="#020617" opacity="0.85" />
            <circle cx="-2.5" cy="1" r="0.6" fill="#38bdf8" opacity="0.75" />

            {/* Upright Readable Name Tag */}
            <g transform="translate(0, 22)" filter="url(#labelBadgeGlow)">
              <rect x="-29" y="-7.5" width="58" height="15" rx="7.5" fill="#020617" fillOpacity="0.95" stroke="#60a5fa" strokeWidth="1.2" />
              <circle cx="-20" cy="0" r="2.2" fill="#60a5fa" filter="url(#solarCoreGlow)" />
              <text x="3" y="3" textAnchor="middle" fill="#bfdbfe" fontSize="7.5" fontWeight="bold" fontFamily="ui-monospace, monospace">
                ♆ Neptune
              </text>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};
