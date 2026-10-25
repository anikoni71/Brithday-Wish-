import React from 'react';

interface BirthdayTreeIconGraphicProps {
  className?: string;
  isExpanded?: boolean;
}

/**
 * BirthdayTreeIconGraphic
 * Ultra-alive cinematic animation icon/graphic for the Interactive Birthday Tree:
 * - High-definition illustrated asset with enchanted evergreen birthday tree, glowing lanterns, and starry cosmos.
 * - Subtle organic swaying branches animation physics (grounded trunk with gently swaying upper canopy).
 * - Twinkling celestial starlight sparkles across the branches and night sky.
 * - Floating celebratory confetti particles fluttering downward with organic rotational drift.
 * - Warm golden lantern candlelight halos softly flickering on the branches.
 * - Ambient celebratory glowing pulse breathing emerald, jade, and golden radiance.
 * - Sweeping cinematic lighting gleam across the crystal badge surface.
 * - Supports both compact (2.5 cm square) and full expanded card views.
 */
export const BirthdayTreeIconGraphic: React.FC<BirthdayTreeIconGraphicProps> = ({
  className = 'w-full h-full',
  isExpanded = false,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none overflow-hidden rounded-2xl ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
      aria-label="Interactive Birthday Tree Cinematic Graphic"
    >
      {/* 1. Ambient Glowing Pulse Background Aura */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-tr from-emerald-500/40 via-teal-400/30 to-amber-400/35 tree-icon-glow"
        aria-hidden="true"
      />

      {/* 2. Main Tree Illustration Asset with Subtle Branch Sway Physics */}
      <div className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none">
        <img
          src="/assets/aistudio/birthday_tree_icon.jpg"
          alt="Enchanted Interactive Birthday Tree"
          className="w-full h-full object-cover rounded-2xl pointer-events-none tree-branches-sway transition-transform duration-500 group-hover:scale-105"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* 3. Sweeping Cinematic Lighting Sheen */}
      <div
        className="absolute inset-0 pointer-events-none z-15 tree-gleam-sheen"
        style={{
          background:
            'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.18) 42%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0.18) 58%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* 4. Warm Softly Flickering Lantern Halos on Hanging Lanterns */}
      {/* Lantern 1: Mid-Left Branch (~22% X, 43% Y) */}
      <span
        className="absolute left-[22.5%] top-[43.5%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 tree-lantern-halo"
        aria-hidden="true"
      >
        <span
          className={`block rounded-full bg-amber-400/70 ${
            isExpanded ? 'w-5 h-5 blur-[2.5px]' : 'w-2 h-2 blur-[1px]'
          }`}
        />
      </span>

      {/* Lantern 2: Upper Center Branch (~46% X, 21% Y) */}
      <span
        className="absolute left-[45.8%] top-[21.5%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 tree-lantern-halo"
        style={{ animationDelay: '0.8s' }}
        aria-hidden="true"
      >
        <span
          className={`block rounded-full bg-amber-300/80 ${
            isExpanded ? 'w-5 h-5 blur-[2.5px]' : 'w-2 h-2 blur-[1px]'
          }`}
        />
      </span>

      {/* Lantern 3: Right Branch (~76% X, 36% Y) */}
      <span
        className="absolute left-[76.2%] top-[36.2%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 tree-lantern-halo"
        style={{ animationDelay: '1.4s' }}
        aria-hidden="true"
      >
        <span
          className={`block rounded-full bg-amber-400/75 ${
            isExpanded ? 'w-5 h-5 blur-[2.5px]' : 'w-2 h-2 blur-[1px]'
          }`}
        />
      </span>

      {/* Lantern 4: Lower Center-Left (~33% X, 63% Y) */}
      <span
        className="absolute left-[33.5%] top-[63%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 tree-lantern-halo"
        style={{ animationDelay: '1.9s' }}
        aria-hidden="true"
      >
        <span
          className={`block rounded-full bg-yellow-300/70 ${
            isExpanded ? 'w-4 h-4 blur-[2px]' : 'w-1.5 h-1.5 blur-[1px]'
          }`}
        />
      </span>

      {/* Lantern 5: Lower Right (~81% X, 60% Y) */}
      <span
        className="absolute left-[81.5%] top-[59.8%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 tree-lantern-halo"
        style={{ animationDelay: '0.5s' }}
        aria-hidden="true"
      >
        <span
          className={`block rounded-full bg-amber-300/75 ${
            isExpanded ? 'w-4 h-4 blur-[2px]' : 'w-1.5 h-1.5 blur-[1px]'
          }`}
        />
      </span>

      {/* 5. Twinkling Celestial Starlight Sparkles */}
      {/* Star 1: Celestial Moon Area (Top-Left ~15% X, 12% Y) */}
      <span
        className="absolute left-[15%] top-[12%] pointer-events-none z-20 tree-star-twinkle"
        aria-hidden="true"
      >
        <svg
          viewBox="-4 -4 8 8"
          className={`text-amber-100 ${
            isExpanded ? 'w-5 h-5 drop-shadow-[0_0_5px_rgba(255,255,255,0.95)]' : 'w-2.5 h-2.5'
          }`}
        >
          <path d="M 0 -3.5 Q 0 0 3.5 0 Q 0 0 0 3.5 Q 0 0 -3.5 0 Z" fill="currentColor" />
        </svg>
      </span>

      {/* Star 2: Celestial Galaxy Area (Top-Right ~88% X, 14% Y) */}
      <span
        className="absolute right-[12%] top-[14%] pointer-events-none z-20 tree-star-twinkle"
        style={{ animationDelay: '1.1s' }}
        aria-hidden="true"
      >
        <svg
          viewBox="-4 -4 8 8"
          className={`text-cyan-200 ${
            isExpanded ? 'w-5 h-5 drop-shadow-[0_0_5px_rgba(103,232,249,0.95)]' : 'w-2.5 h-2.5'
          }`}
        >
          <path d="M 0 -3.5 Q 0 0 3.5 0 Q 0 0 0 3.5 Q 0 0 -3.5 0 Z" fill="currentColor" />
        </svg>
      </span>

      {/* Star 3: Upper Crown of Tree (~54% X, 10% Y) */}
      <span
        className="absolute left-[54%] top-[10%] pointer-events-none z-20 tree-star-twinkle"
        style={{ animationDelay: '2.1s' }}
        aria-hidden="true"
      >
        <svg
          viewBox="-4 -4 8 8"
          className={`text-yellow-200 ${
            isExpanded ? 'w-4 h-4 drop-shadow-[0_0_4px_rgba(253,224,71,0.9)]' : 'w-2 h-2'
          }`}
        >
          <path d="M 0 -3.5 Q 0 0 3.5 0 Q 0 0 0 3.5 Q 0 0 -3.5 0 Z" fill="currentColor" />
        </svg>
      </span>

      {/* Star 4: Mid Canopy Sparkle (~36% X, 32% Y) */}
      <span
        className="absolute left-[36%] top-[32%] pointer-events-none z-20 tree-star-twinkle"
        style={{ animationDelay: '1.6s' }}
        aria-hidden="true"
      >
        <svg
          viewBox="-4 -4 8 8"
          className={`text-emerald-200 ${
            isExpanded ? 'w-4 h-4 drop-shadow-[0_0_4px_rgba(110,231,183,0.9)]' : 'w-2 h-2'
          }`}
        >
          <path d="M 0 -3.5 Q 0 0 3.5 0 Q 0 0 0 3.5 Q 0 0 -3.5 0 Z" fill="currentColor" />
        </svg>
      </span>

      {/* 6. Floating Celebration Confetti Particles */}
      {/* Confetti 1: Golden Amber Ribbon */}
      <span
        className="absolute left-[26%] top-0 pointer-events-none z-15 tree-confetti-float-1"
        aria-hidden="true"
      >
        <span
          className={`block rounded-[1px] bg-amber-400 shadow-[0_0_3px_rgba(251,191,36,0.9)] ${
            isExpanded ? 'w-2.5 h-3.5' : 'w-1 h-1.5'
          }`}
        />
      </span>

      {/* Confetti 2: Emerald Green Spark */}
      <span
        className="absolute left-[48%] top-0 pointer-events-none z-15 tree-confetti-float-2"
        aria-hidden="true"
      >
        <span
          className={`block rounded-[1px] bg-emerald-400 shadow-[0_0_3px_rgba(52,211,153,0.9)] ${
            isExpanded ? 'w-3 h-2' : 'w-1.5 h-1'
          }`}
        />
      </span>

      {/* Confetti 3: Rose Pink Petal Fleck */}
      <span
        className="absolute left-[70%] top-0 pointer-events-none z-15 tree-confetti-float-3"
        aria-hidden="true"
      >
        <span
          className={`block rounded-[1px] bg-rose-400 shadow-[0_0_3px_rgba(251,113,133,0.9)] ${
            isExpanded ? 'w-2.5 h-2.5' : 'w-1 h-1'
          }`}
        />
      </span>

      {/* Confetti 4: Cyan Blue Shimmer */}
      <span
        className="absolute left-[38%] top-0 pointer-events-none z-15 tree-confetti-float-4"
        aria-hidden="true"
      >
        <span
          className={`block rounded-[0.5px] bg-cyan-300 shadow-[0_0_3px_rgba(103,232,249,0.9)] ${
            isExpanded ? 'w-3 h-1.5' : 'w-1.5 h-0.5'
          }`}
        />
      </span>

      {/* Extra Celebration Particles for Expanded Card Mode */}
      {isExpanded && (
        <>
          <span
            className="absolute left-[18%] top-0 pointer-events-none z-15 tree-confetti-float-2"
            style={{ animationDelay: '1.3s' }}
            aria-hidden="true"
          >
            <span className="block w-2.5 h-3 rounded-[1px] bg-teal-300 shadow-[0_0_4px_rgba(94,234,212,0.9)]" />
          </span>
          <span
            className="absolute left-[62%] top-0 pointer-events-none z-15 tree-confetti-float-4"
            style={{ animationDelay: '1.7s' }}
            aria-hidden="true"
          >
            <span className="block w-3 h-2 rounded-[1px] bg-purple-400 shadow-[0_0_4px_rgba(192,132,252,0.9)]" />
          </span>
          <span
            className="absolute left-[82%] top-0 pointer-events-none z-15 tree-confetti-float-1"
            style={{ animationDelay: '0.6s' }}
            aria-hidden="true"
          >
            <span className="block w-2.5 h-2.5 rounded-[1px] bg-yellow-300 shadow-[0_0_4px_rgba(253,224,71,0.9)]" />
          </span>

          {/* Golden gift boxes base glow */}
          <span
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-10 rounded-full bg-amber-400/20 blur-md pointer-events-none z-10 animate-pulse"
            aria-hidden="true"
          />
        </>
      )}

      {/* 7. Subtle Border Edge Highlight */}
      <div
        className="absolute inset-0 rounded-2xl border border-emerald-400/40 pointer-events-none z-25 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]"
        aria-hidden="true"
      />
    </div>
  );
};
