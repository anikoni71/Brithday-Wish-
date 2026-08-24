import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, Volume2, VolumeX, Gift, Wand2, RefreshCw, PartyPopper, Heart } from 'lucide-react';
import { triggerBirthdayConfetti } from '../utils/confetti';
import { playBirthdayAlertChime } from '../utils/notificationSound';
import { TeamMember } from '../types';

interface BirthdayCakeHeroProps {
  todayBirthdays?: TeamMember[];
  dueSoonBirthdays?: TeamMember[];
  onOpenWishModal?: (member: TeamMember) => void;
}

export const BirthdayCakeHero: React.FC<BirthdayCakeHeroProps> = ({
  todayBirthdays = [],
  dueSoonBirthdays = [],
  onOpenWishModal,
}) => {
  const [candlesLit, setCandlesLit] = useState<boolean>(true);
  const [wishMade, setWishMade] = useState<boolean>(false);
  const [cakeCut, setCakeCut] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [sparkleActive, setSparkleActive] = useState<boolean>(false);

  const hasTodayCelebrants = todayBirthdays.length > 0;

  // Handler for blowing candles
  const handleBlowCandles = () => {
    setCandlesLit(false);
    setWishMade(true);
    setSparkleActive(true);

    if (!soundMuted) {
      playBirthdayAlertChime(true);
    }
    triggerBirthdayConfetti();

    setTimeout(() => setSparkleActive(false), 3000);
  };

  // Handler for relighting candles
  const handleRelight = () => {
    setCandlesLit(true);
    setWishMade(false);
    setCakeCut(false);
  };

  // Handler for cutting cake
  const handleCutCake = () => {
    setCakeCut(true);
    triggerBirthdayConfetti();
    if (!soundMuted) {
      playBirthdayAlertChime(true);
    }
  };

  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-2xl border border-slate-800 transition-all">
      {/* Dynamic Ambient Background Lights */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Particle Stars */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-4 left-10 text-amber-300 text-xs animate-bounce">✨</div>
        <div className="absolute top-12 right-20 text-yellow-200 text-sm animate-pulse">⭐</div>
        <div className="absolute bottom-6 left-1/4 text-rose-300 text-xs animate-bounce delay-300">🎉</div>
        <div className="absolute bottom-10 right-1/3 text-indigo-300 text-sm animate-pulse delay-500">✨</div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* LEFT COLUMN: Animated Celebration Narrative & Celebrants Spotlight */}
        <div className="flex-1 text-center lg:text-left space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-indigo-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>IE Central Team Celebration Hub</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {hasTodayCelebrants ? (
              <>
                Double Celebrations Today!{' '}
                <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                  {todayBirthdays.map(m => m.name).join(' & ')}
                </span>{' '}
                🎂
              </>
            ) : (
              <>
                Wishing You Joy & Milestones!{' '}
                <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                  IE Central Family
                </span>{' '}
                ✨
              </>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {hasTodayCelebrants ? (
              <>
                We celebrate our outstanding team members on their special day! Join the Industrial Engineering Central Team in sending heartfelt blessings, cutting the celebratory cake, and sharing joyous memories.
              </>
            ) : (
              <>
                A dedicated space of camaraderie and appreciation. Automated morning dispatches via WhatsApp (+8801625299521) and warm festive emails ensure no team milestone goes uncelebrated!
              </>
            )}
          </p>

          {/* Celebrants Chip Carousel if Today */}
          {hasTodayCelebrants && (
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              {todayBirthdays.map((member, idx) => (
                <div
                  key={`${member.id || member.sl || member.name}-${idx}`}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md text-white text-xs transition"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 text-slate-950 font-bold flex items-center justify-center text-xs shadow-md">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-100">{member.name}</div>
                    <div className="text-[10px] text-amber-300 font-medium">
                      {member.designation || 'Industrial Engineer'} • {member.birthday}
                    </div>
                  </div>
                  {onOpenWishModal && (
                    <button
                      onClick={() => onOpenWishModal(member)}
                      className="ml-1.5 px-2 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold text-[10px] hover:bg-amber-300 transition cursor-pointer"
                    >
                      Wish
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Interactive Cake Controls */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            {candlesLit ? (
              <button
                type="button"
                onClick={handleBlowCandles}
                className="group relative px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transform hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-950 group-hover:scale-125 transition-transform" />
                <span>Blow Out Candles & Make a Wish! 💨</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRelight}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Relight Birthday Candles 🔥</span>
              </button>
            )}

            {!cakeCut ? (
              <button
                type="button"
                onClick={handleCutCake}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer"
              >
                <PartyPopper className="w-3.5 h-3.5 text-rose-400" />
                <span>Cut Celebration Cake 🍰</span>
              </button>
            ) : (
              <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
                <span>Celebration Cake Shared with IE Team!</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSoundMuted(!soundMuted)}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition cursor-pointer"
              title={soundMuted ? 'Unmute celebration chime' : 'Mute celebration chime'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
          </div>

          {/* Wish Granted Feedback */}
          {wishMade && (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-400/30 text-amber-200 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
              <span className="text-lg">✨</span>
              <span>
                <strong>Wish Made!</strong> May every milestone bring good health, prosperity, and engineering breakthroughs to our IE Central colleagues!
              </span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: 3D Layered Animated Birthday Cake Vector */}
        <div className="relative flex flex-col items-center justify-center p-4">
          
          {/* Cake Glow Aura */}
          <div className={`absolute w-64 h-64 rounded-full transition-all duration-700 pointer-events-none ${
            candlesLit ? 'bg-amber-400/20 blur-3xl' : 'bg-indigo-500/10 blur-2xl'
          }`} />

          {/* SVG Animated Cake Component */}
          <div className="relative select-none transform hover:scale-105 transition-transform duration-300">
            <svg
              viewBox="0 0 320 280"
              className="w-64 h-56 sm:w-72 sm:h-64 overflow-visible"
            >
              <defs>
                {/* Gradients for Cake Tiers */}
                <linearGradient id="cake-plate" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="50%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>

                <linearGradient id="cake-bottom" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#451a03" />
                  <stop offset="50%" stopColor="#78350f" />
                  <stop offset="100%" stopColor="#451a03" />
                </linearGradient>

                <linearGradient id="cake-top" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="50%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>

                <linearGradient id="frosting-cream" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fffbeb" />
                  <stop offset="100%" stopColor="#fef3c7" />
                </linearGradient>

                <linearGradient id="candle-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>

                <linearGradient id="candle-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#db2777" />
                </linearGradient>

                <linearGradient id="candle-gradient-3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>

                {/* Flame Radial Glow */}
                <radialGradient id="flame-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#fef08a" />
                  <stop offset="70%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>

                <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Pedestal / Plate */}
              <ellipse cx="160" cy="245" rx="130" ry="24" fill="url(#cake-plate)" opacity="0.9" />
              <ellipse cx="160" cy="242" rx="120" ry="18" fill="#f8fafc" />
              <ellipse cx="160" cy="240" rx="116" ry="14" fill="#ffffff" />

              {/* BOTTOM TIER (Rich Dark Chocolate Sponge) */}
              <g className="transition-all duration-500">
                {/* Bottom Tier Body */}
                <path
                  d="M 60 170 Q 160 195 260 170 L 260 220 Q 160 245 60 220 Z"
                  fill="url(#cake-bottom)"
                />
                {/* Bottom Tier Top Surface */}
                <ellipse cx="160" cy="170" rx="100" ry="22" fill="#92400e" />

                {/* Bottom Tier Frosting Drips */}
                <path
                  d="M 60 170 
                     Q 75 195 90 174 
                     Q 105 200 120 173 
                     Q 135 198 150 175 
                     Q 170 205 190 174 
                     Q 210 196 230 173 
                     Q 245 195 260 170 
                     Q 160 190 60 170 Z"
                  fill="url(#frosting-cream)"
                />

                {/* Sprinkles on Bottom Tier */}
                <circle cx="85" cy="205" r="2.5" fill="#f43f5e" />
                <circle cx="115" cy="215" r="2.5" fill="#38bdf8" />
                <circle cx="150" cy="218" r="2.5" fill="#facc15" />
                <circle cx="185" cy="214" r="2.5" fill="#4ade80" />
                <circle cx="215" cy="208" r="2.5" fill="#e879f9" />
                <circle cx="240" cy="200" r="2.5" fill="#fb923c" />
              </g>

              {/* TOP TIER (Strawberry Cream Sponge) */}
              <g className="transition-all duration-500">
                {/* Top Tier Body */}
                <path
                  d="M 95 110 Q 160 130 225 110 L 225 155 Q 160 175 95 155 Z"
                  fill="url(#cake-top)"
                />
                {/* Top Tier Top Surface */}
                <ellipse cx="160" cy="110" rx="65" ry="16" fill="#fb7185" />

                {/* Top Tier Vanilla Cream Drip */}
                <path
                  d="M 95 110 
                     Q 110 132 125 113 
                     Q 140 136 155 112 
                     Q 175 138 195 114 
                     Q 210 134 225 110 
                     Q 160 126 95 110 Z"
                  fill="#ffffff"
                />

                {/* Golden Strawberry Pearls on Top Tier */}
                <circle cx="110" cy="108" r="4.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />
                <circle cx="135" cy="116" r="4.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />
                <circle cx="160" cy="118" r="5" fill="#e11d48" stroke="#ffffff" strokeWidth="1" />
                <circle cx="185" cy="116" r="4.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />
                <circle cx="210" cy="108" r="4.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />
              </g>

              {/* CANDLE 1 (Left) */}
              <g>
                <rect x="125" y="70" width="8" height="35" rx="4" fill="url(#candle-gradient-1)" />
                {/* Candle stripes */}
                <line x1="125" y1="78" x2="133" y2="82" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                <line x1="125" y1="90" x2="133" y2="94" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                {/* Wick */}
                <line x1="129" y1="70" x2="129" y2="62" stroke="#475569" strokeWidth="1.5" />
                
                {/* Flame 1 */}
                {candlesLit ? (
                  <g className="animate-pulse origin-bottom" style={{ transformOrigin: '129px 62px' }}>
                    <circle cx="129" cy="54" r="10" fill="url(#flame-glow)" filter="url(#glow-filter)" />
                    <path
                      d="M 129 45 Q 134 54 129 60 Q 124 54 129 45 Z"
                      fill="#fef08a"
                      stroke="#f59e0b"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M 129 50 Q 132 55 129 59 Q 126 55 129 50 Z"
                      fill="#ffffff"
                    />
                  </g>
                ) : (
                  <path
                    d="M 129 60 Q 127 52 131 46"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.6"
                    className="animate-pulse"
                  />
                )}
              </g>

              {/* CANDLE 2 (Center - Tall) */}
              <g>
                <rect x="156" y="60" width="8" height="45" rx="4" fill="url(#candle-gradient-3)" />
                {/* Candle stripes */}
                <line x1="156" y1="70" x2="164" y2="74" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                <line x1="156" y1="84" x2="164" y2="88" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                {/* Wick */}
                <line x1="160" y1="60" x2="160" y2="52" stroke="#475569" strokeWidth="1.5" />
                
                {/* Flame 2 */}
                {candlesLit ? (
                  <g className="animate-pulse origin-bottom" style={{ transformOrigin: '160px 52px', animationDuration: '0.8s' }}>
                    <circle cx="160" cy="44" r="12" fill="url(#flame-glow)" filter="url(#glow-filter)" />
                    <path
                      d="M 160 33 Q 166 44 160 50 Q 154 44 160 33 Z"
                      fill="#fef08a"
                      stroke="#f59e0b"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M 160 39 Q 163 45 160 49 Q 157 45 160 39 Z"
                      fill="#ffffff"
                    />
                  </g>
                ) : (
                  <path
                    d="M 160 50 Q 163 42 159 36"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.6"
                    className="animate-pulse"
                  />
                )}
              </g>

              {/* CANDLE 3 (Right) */}
              <g>
                <rect x="187" y="70" width="8" height="35" rx="4" fill="url(#candle-gradient-2)" />
                {/* Candle stripes */}
                <line x1="187" y1="78" x2="195" y2="82" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                <line x1="187" y1="90" x2="195" y2="94" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                {/* Wick */}
                <line x1="191" y1="70" x2="191" y2="62" stroke="#475569" strokeWidth="1.5" />
                
                {/* Flame 3 */}
                {candlesLit ? (
                  <g className="animate-pulse origin-bottom" style={{ transformOrigin: '191px 62px', animationDuration: '1.2s' }}>
                    <circle cx="191" cy="54" r="10" fill="url(#flame-glow)" filter="url(#glow-filter)" />
                    <path
                      d="M 191 45 Q 196 54 191 60 Q 186 54 191 45 Z"
                      fill="#fef08a"
                      stroke="#f59e0b"
                      strokeWidth="0.5"
                    />
                    <path
                      d="M 191 50 Q 194 55 191 59 Q 188 55 191 50 Z"
                      fill="#ffffff"
                    />
                  </g>
                ) : (
                  <path
                    d="M 191 60 Q 189 52 193 46"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.6"
                    className="animate-pulse"
                  />
                )}
              </g>

              {/* Celebration Sparkles when cut */}
              {cakeCut && (
                <g className="animate-in fade-in duration-300">
                  <path d="M 160 170 L 160 230" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
                  <text x="160" y="205" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                    🍰 DELICIOUS!
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Badge below cake */}
          <div className="mt-2 text-center">
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
              {candlesLit ? '🔥 Candles Burning Warmly' : '💨 Candles Blown with Blessings!'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
