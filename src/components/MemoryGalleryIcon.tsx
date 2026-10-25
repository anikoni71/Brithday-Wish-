import React from 'react';

interface MemoryGalleryIconProps {
  className?: string;
  active?: boolean;
}

/**
 * MemoryGalleryIcon
 * Ultra-alive cinematic animation icon for the Memory Gallery section:
 * - Hanging polaroids on the clothesline string swaying smoothly in a subtle breeze.
 * - Camera lens specular catchlight gleams & prismatic flare pulses.
 * - Delicate starlight sparkles floating and twinkling around the composition.
 * - Warm ambient depth aura that responds dynamically to active / hover states.
 */
export const MemoryGalleryIcon: React.FC<MemoryGalleryIconProps> = ({
  className = 'w-5 h-5',
  active = false,
}) => {
  return (
    <span
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none group/mem-icon ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '400px',
      }}
      aria-label="Memory Gallery Icon"
    >
      {/* Ambient Warm Golden Glow Halo */}
      <span
        className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none -z-10 ${
          active
            ? 'bg-amber-400/25 blur-[5px] scale-125'
            : 'bg-amber-400/10 blur-[4px] scale-100 group-hover/mem-icon:bg-amber-400/25 group-hover/mem-icon:scale-120'
        }`}
      />

      {/* Main Container with Gentle Polaroid String Sway & Micro-breathe */}
      <span className="relative w-full h-full flex items-center justify-center memory-gallery-sway-wrap">
        {/* Base Image Asset: Photographer with hanging polaroids on string */}
        <img
          src="/assets/aistudio/image_6e86f1c2.png"
          alt="Memory Gallery"
          className={`w-full h-full object-contain pointer-events-none transition-transform duration-300 memory-gallery-photo-img ${
            active ? 'brightness-105 contrast-105' : 'group-hover/mem-icon:brightness-105'
          }`}
          loading="eager"
          decoding="async"
        />

        {/* Camera Lens Gleam & Flare System */}
        {/* Centered on the camera lens held by photographer (~49% X, 63% Y) */}
        <span
          className="absolute left-[49%] top-[63%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center w-[28%] h-[28%]"
          aria-hidden="true"
        >
          {/* Circular aperture catchlight halo */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/60 via-amber-200 to-white/90 memory-gallery-lens-ring" />

          {/* Anamorphic horizontal lens flare glint */}
          <span className="absolute w-[200%] h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent memory-gallery-lens-streak" />

          {/* Core high-intensity specular starburst */}
          <svg
            viewBox="-10 -10 20 20"
            className="w-full h-full memory-gallery-lens-star text-white drop-shadow-[0_0_4px_rgba(251,191,36,0.9)]"
          >
            {/* 4-point Diamond Star Flare */}
            <path
              d="M 0 -8 Q 0 0 8 0 Q 0 0 0 8 Q 0 0 -8 0 Z"
              fill="url(#lensFlareGrad)"
            />
            {/* Secondary 4-point subtle diagonal flare */}
            <path
              d="M -4 -4 Q 0 0 4 -4 Q 0 0 4 4 Q 0 0 -4 4 Z"
              fill="rgba(255, 255, 255, 0.65)"
            />
            <defs>
              <linearGradient id="lensFlareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="50%" stopColor="#fef08a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </span>

        {/* Floating Starlight Sparkles (Drifting & Twinkling) */}
        {/* Sparkle 1: Top-Left above first hanging polaroid */}
        <span
          className="absolute left-[12%] top-[12%] pointer-events-none z-20 memory-gallery-sparkle-1"
          aria-hidden="true"
        >
          <svg viewBox="-6 -6 12 12" className="w-2 h-2 text-amber-200 drop-shadow-[0_0_3px_rgba(251,191,36,0.85)]">
            <path d="M 0 -5 Q 0 0 5 0 Q 0 0 0 5 Q 0 0 -5 0 Z" fill="currentColor" />
          </svg>
        </span>

        {/* Sparkle 2: Top-Right above forest polaroid */}
        <span
          className="absolute right-[10%] top-[10%] pointer-events-none z-20 memory-gallery-sparkle-2"
          aria-hidden="true"
        >
          <svg viewBox="-6 -6 12 12" className="w-2.5 h-2.5 text-amber-100 drop-shadow-[0_0_3px_rgba(253,224,71,0.9)]">
            <path d="M 0 -6 Q 0 0 6 0 Q 0 0 0 6 Q 0 0 -6 0 Z" fill="currentColor" />
          </svg>
        </span>

        {/* Sparkle 3: Mid-Right near photographer hood & camera */}
        <span
          className="absolute right-[14%] top-[50%] pointer-events-none z-20 memory-gallery-sparkle-3"
          aria-hidden="true"
        >
          <svg viewBox="-5 -5 10 10" className="w-1.5 h-1.5 text-yellow-300 drop-shadow-[0_0_2px_rgba(250,204,21,0.8)]">
            <path d="M 0 -4 Q 0 0 4 0 Q 0 0 0 4 Q 0 0 -4 0 Z" fill="currentColor" />
          </svg>
        </span>

        {/* Sparkle 4: Mid-Left floating beside camera */}
        <span
          className="absolute left-[8%] top-[56%] pointer-events-none z-20 memory-gallery-sparkle-4"
          aria-hidden="true"
        >
          <svg viewBox="-5 -5 10 10" className="w-1.5 h-1.5 text-amber-200 drop-shadow-[0_0_2px_rgba(251,191,36,0.7)]">
            <path d="M 0 -4 Q 0 0 4 0 Q 0 0 0 4 Q 0 0 -4 0 Z" fill="currentColor" />
          </svg>
        </span>
      </span>
    </span>
  );
};
