import React from 'react';

interface BirthdayWisherHeaderGraphicProps {
  className?: string;
  isExpanded?: boolean;
}

/**
 * BirthdayWisherHeaderGraphic
 * Ultra-alive cinematic animation graphic for the IE Central Team Birthday Wisher brand identity:
 * - High-DPI illustration asset with 4 friends celebrating, cake, and "HAPPY BIRTHDAY" banner.
 * - Floating & falling colorful celebration confetti particles fluttering downward with tumbling rotation.
 * - Gently swaying celebration balloons (top-right magenta, top-left blue, mid-right green).
 * - Softly flickering candle flame with a warm amber-golden aura dancing right on top of the cake.
 * - Subtle celebratory glowing pulse breathing radiance around the badge.
 * - Sweeping cinematic lighting gleam across the glass surface.
 * - Lively twinkling starlight particles around the festive scene.
 * - Supports both compact (2.5 cm square) and full expanded card views.
 */
export const BirthdayWisherHeaderGraphic: React.FC<BirthdayWisherHeaderGraphicProps> = ({
  className = 'w-full h-full',
  isExpanded = false,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none overflow-hidden rounded-xl ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
      aria-label="IE Central Team Birthday Wisher Graphic"
    >
      {/* Subtle Glowing Pulse Background Aura */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-tr from-emerald-500/35 via-amber-400/30 to-rose-400/25 wisher-ambient-glow"
        aria-hidden="true"
      />

      {/* Main Base Asset Image */}
      <img
        src="/assets/aistudio/image_17dbbae3.png"
        alt="IE Central Team Birthday Celebration"
        className="w-full h-full object-cover rounded-xl pointer-events-none transition-transform duration-500 group-hover:scale-105"
        loading="eager"
        decoding="async"
      />

      {/* Sweeping Cinematic Lighting Gleam */}
      <div
        className="absolute inset-0 pointer-events-none z-15 wisher-gleam-sheen"
        style={{
          background:
            'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.2) 42%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.2) 58%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* Gently Swaying Balloons Overlays */}
      {/* 1. Top-Right Magenta Balloon (~80% X, 30% Y) */}
      <div
        className="absolute left-[80%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-[22%] h-[22%] pointer-events-none wisher-balloon-sway-r"
        aria-hidden="true"
      >
        <div className="w-full h-full rounded-full bg-rose-400/25 blur-[1.5px] animate-pulse" />
      </div>

      {/* 2. Top-Left Blue Balloon (~17% X, 38.5% Y) */}
      <div
        className="absolute left-[17%] top-[38.5%] -translate-x-1/2 -translate-y-1/2 w-[20%] h-[20%] pointer-events-none wisher-balloon-sway-l"
        aria-hidden="true"
      >
        <div className="w-full h-full rounded-full bg-blue-400/25 blur-[1.5px] animate-pulse" />
      </div>

      {/* 3. Mid-Right Green Balloon (~87% X, 61.5% Y) */}
      <div
        className="absolute left-[87%] top-[61.5%] -translate-x-1/2 -translate-y-1/2 w-[18%] h-[18%] pointer-events-none wisher-balloon-sway-r"
        aria-hidden="true"
      >
        <div className="w-full h-full rounded-full bg-emerald-400/20 blur-[1px]" />
      </div>

      {/* Softly Flickering Candle Flame on the Cake (~51.3% X, 49.1% Y) */}
      <div
        className={`absolute left-[51.3%] top-[49.1%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex items-center justify-center ${
          isExpanded ? 'w-8 h-8' : 'w-4 h-4'
        }`}
        aria-hidden="true"
      >
        {/* Warm Ambient Candle Light Glow Halo */}
        <span
          className={`absolute rounded-full bg-amber-400/50 wisher-candle-halo ${
            isExpanded ? 'w-8 h-8 blur-[4px]' : 'w-3.5 h-3.5 blur-[2px]'
          }`}
        />

        {/* Flickering Teardrop Flame */}
        <svg
          viewBox="-4 -7 8 10"
          className={`wisher-flame-flicker text-amber-300 ${
            isExpanded ? 'w-5 h-7' : 'w-2.5 h-3.5'
          }`}
          style={{ transformOrigin: 'center bottom' }}
        >
          {/* Flame outer amber gradient */}
          <path
            d="M 0 -6 C 2 -3, 3 -1, 3 1 C 3 2.5, 1.8 3.5, 0 3.5 C -1.8 3.5, -3 2.5, -3 1 C -3 -1, -2 -3, 0 -6 Z"
            fill="url(#wisherFlameOuter2)"
          />
          {/* Inner intense golden-white core */}
          <path
            d="M 0 -4 C 1 -2, 1.5 -0.5, 1.5 1 C 1.5 2, 0.8 2.5, 0 2.5 C -0.8 2.5, -1.5 2, -1.5 1 C -1.5 -0.5, -1 -2, 0 -4 Z"
            fill="#ffffff"
            opacity="0.95"
          />
          <defs>
            <linearGradient id="wisherFlameOuter2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="35%" stopColor="#fef08a" stopOpacity="1" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Subtle cake frosting reflection glint */}
        <span
          className={`absolute rounded-full bg-amber-200/80 ${
            isExpanded ? 'top-4 w-4 h-1 blur-[1px]' : 'top-2 w-2 h-0.5 blur-[0.5px]'
          }`}
        />
      </div>

      {/* Floating & Falling Confetti Particles System */}
      {/* Confetti Particle 1: Golden Amber Ribbon */}
      <span
        className="absolute left-[22%] top-0 pointer-events-none z-10 wisher-confetti-1"
        aria-hidden="true"
      >
        <span
          className={`block rounded-[1px] bg-amber-400 shadow-[0_0_2px_rgba(251,191,36,0.8)] ${
            isExpanded ? 'w-2 h-3.5' : 'w-1 h-1.5'
          }`}
        />
      </span>

      {/* Confetti Particle 2: Emerald Green Spark */}
      <span
        className="absolute left-[45%] top-0 pointer-events-none z-10 wisher-confetti-2"
        aria-hidden="true"
      >
        <span
          className={`block rounded-[1px] bg-emerald-400 shadow-[0_0_2px_rgba(52,211,153,0.8)] ${
            isExpanded ? 'w-3 h-2' : 'w-1.5 h-1'
          }`}
        />
      </span>

      {/* Confetti Particle 3: Rose Pink Square */}
      <span
        className="absolute left-[72%] top-0 pointer-events-none z-10 wisher-confetti-3"
        aria-hidden="true"
      >
        <span
          className={`block rounded-[1px] bg-rose-400 shadow-[0_0_2px_rgba(251,113,133,0.8)] ${
            isExpanded ? 'w-2.5 h-2.5' : 'w-1 h-1'
          }`}
        />
      </span>

      {/* Confetti Particle 4: Cyan Blue Fleck */}
      <span
        className="absolute left-[35%] top-0 pointer-events-none z-10 wisher-confetti-4"
        aria-hidden="true"
      >
        <span
          className={`block rounded-[0.5px] bg-cyan-300 shadow-[0_0_2px_rgba(103,232,249,0.8)] ${
            isExpanded ? 'w-3 h-1.5' : 'w-1.5 h-0.5'
          }`}
        />
      </span>

      {/* Confetti Particle 5: Violet Starlet */}
      <span
        className="absolute left-[60%] top-0 pointer-events-none z-10 wisher-confetti-1"
        style={{ animationDelay: '1.4s' }}
        aria-hidden="true"
      >
        <span
          className={`block rounded-full bg-purple-400 shadow-[0_0_2px_rgba(192,132,252,0.8)] ${
            isExpanded ? 'w-2.5 h-2.5' : 'w-1 h-1'
          }`}
        />
      </span>

      {/* Confetti Particle 6: Yellow Gold Specks */}
      <span
        className="absolute left-[84%] top-0 pointer-events-none z-10 wisher-confetti-2"
        style={{ animationDelay: '0.8s' }}
        aria-hidden="true"
      >
        <span
          className={`block rounded-[1px] bg-yellow-300 shadow-[0_0_2px_rgba(253,224,71,0.8)] ${
            isExpanded ? 'w-2 h-2' : 'w-1 h-1'
          }`}
        />
      </span>

      {/* Additional Confetti for Expanded Mode */}
      {isExpanded && (
        <>
          <span
            className="absolute left-[15%] top-0 pointer-events-none z-10 wisher-confetti-3"
            style={{ animationDelay: '1.8s' }}
            aria-hidden="true"
          >
            <span className="block w-2.5 h-2.5 rounded-[1px] bg-rose-500 shadow-[0_0_3px_rgba(244,63,94,0.8)]" />
          </span>
          <span
            className="absolute left-[52%] top-0 pointer-events-none z-10 wisher-confetti-4"
            style={{ animationDelay: '2.3s' }}
            aria-hidden="true"
          >
            <span className="block w-3 h-1.5 rounded-[0.5px] bg-amber-300 shadow-[0_0_3px_rgba(252,211,77,0.8)]" />
          </span>
          <span
            className="absolute left-[78%] top-0 pointer-events-none z-10 wisher-confetti-1"
            style={{ animationDelay: '0.4s' }}
            aria-hidden="true"
          >
            <span className="block w-2 h-3 rounded-[1px] bg-teal-400 shadow-[0_0_3px_rgba(45,212,191,0.8)]" />
          </span>
        </>
      )}

      {/* Lively Twinkling Starlight Particles */}
      {/* Star 1: Upper Left near celebration banner */}
      <span
        className="absolute left-[26%] top-[14%] pointer-events-none z-20 wisher-sparkle-star"
        aria-hidden="true"
      >
        <svg
          viewBox="-4 -4 8 8"
          className={`text-amber-200 ${isExpanded ? 'w-4 h-4 drop-shadow-[0_0_4px_rgba(251,191,36,0.9)]' : 'w-2.5 h-2.5'}`}
        >
          <path d="M 0 -3.5 Q 0 0 3.5 0 Q 0 0 0 3.5 Q 0 0 -3.5 0 Z" fill="currentColor" />
        </svg>
      </span>

      {/* Star 2: Upper Right near waving hand */}
      <span
        className="absolute right-[22%] top-[12%] pointer-events-none z-20 wisher-sparkle-star"
        style={{ animationDelay: '1.2s' }}
        aria-hidden="true"
      >
        <svg
          viewBox="-4 -4 8 8"
          className={`text-yellow-200 ${isExpanded ? 'w-4 h-4 drop-shadow-[0_0_4px_rgba(253,224,71,0.9)]' : 'w-2.5 h-2.5'}`}
        >
          <path d="M 0 -3.5 Q 0 0 3.5 0 Q 0 0 0 3.5 Q 0 0 -3.5 0 Z" fill="currentColor" />
        </svg>
      </span>

      {/* Micro Starlight Glint on Banner Top */}
      <span
        className="absolute left-[50%] top-[18%] -translate-x-1/2 pointer-events-none z-10 animate-ping opacity-60"
        aria-hidden="true"
      >
        <span
          className={`block rounded-full bg-white shadow-[0_0_4px_white] ${
            isExpanded ? 'w-2 h-2' : 'w-1 h-1'
          }`}
        />
      </span>
    </div>
  );
};
