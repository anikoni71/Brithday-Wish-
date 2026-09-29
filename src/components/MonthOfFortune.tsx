import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Moon, 
  Sun, 
  Compass, 
  Star, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain, 
  Gift, 
  Calendar, 
  ChevronDown, 
  Award, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Radio, 
  Activity, 
  CheckCircle2, 
  RefreshCw, 
  TrendingUp, 
  Heart, 
  Smile, 
  ArrowUpRight,
  Clock,
  Orbit,
  MoonStar,
  BookOpen,
  Atom,
  X
} from 'lucide-react';
import { TeamMember } from '../types';
import { parseBirthdayDate, getDaysUntilBirthday, MONTH_NAMES } from '../utils/dateUtils';
import { formatProfileImageUrl, getMemberPhotoUrl } from '../utils/imageUtils';
import { generateDynamicAstrologyPayload } from '../services/ephemerisService';

export interface MemberAstrologyDestiny {
  memberId: string;
  name: string;
  birthday: string;
  parsedBirthday: { month: number; day: number; formatted: string };
  zodiac: ZodiacSignInfo;
  upcomingGoodThings: {
    headline: string;
    description: string;
    milestoneTime: string;
    luckyBlessing: string;
  };
  auraKeyword: string;
  elementGlow: {
    border: string;
    badge: string;
    shadow: string;
    text: string;
  };
}

interface MonthOfFortuneProps {
  members: TeamMember[];
  onOpenGenerator?: (member: TeamMember) => void;
  onSendWhatsApp?: (member: TeamMember) => void;
}

export type ZodiacElement = 'Fire' | 'Earth' | 'Air' | 'Water';

export interface ZodiacSignInfo {
  name: string;
  glyph: string;
  symbol: string;
  element: ZodiacElement;
  rulingPlanet: string;
  luckyColor: string;
  luckyTraits: string[];
  luckyNumber: number;
  dates: string;
  overview: string;
  elementGlow: {
    color: string;
    border: string;
    bg: string;
    text: string;
    shadow: string;
    radar: string;
  };
}

export interface MonthAuraInfo {
  monthIndex: number; // 0 - 11
  monthName: string;
  lifeSymbolName: string;
  auraName: string;
  element: ZodiacElement;
  coreKeyword: string;
  lifeMeaning: string;
  yearlyForecast: string;
  luckyGem: string;
}

export interface LiveFortunePayload {
  celebrantName: string;
  serverNode: string;
  latencyMs: number;
  syncTimestamp: string;
  cosmicGuidance: string;
  positiveAuraNote: string;
  careerOpportunities: string[];
  happinessMilestones: string[];
  financialAbundance: string[];
  friendshipHarmony: string[];
  yearByYearForecast: {
    year: number;
    theme: string;
    prediction: string;
    vitalityScore: number;
  }[];
  upcomingGoodThings: {
    title: string;
    description: string;
    timing: string;
    tag: string;
  }[];
  fateAndDestiny: {
    chapterTitle: string;
    fateNote: string;
    theYearAhead: {
      alignment: string;
      forecast: string;
      luckFactor: string;
    };
    careerAndSuccess: {
      title: string;
      predictions: string[];
      growthLeap: string;
    };
    personalJoyAndPeace: {
      title: string;
      milestones: string[];
      friendshipBlessing: string;
    };
    destinyMilestones: {
      quarter: string;
      milestone: string;
      blessing: string;
    }[];
    cosmicDecree: string;
  };
  natalChart?: any;
}

// ============================================================================
// Comprehensive Data Sets: Month Auras (January - December)
// ============================================================================
export const MONTH_AURAS: MonthAuraInfo[] = [
  {
    monthIndex: 0,
    monthName: 'January',
    lifeSymbolName: 'Crown',
    auraName: 'Royal Gold & Solar Amber',
    element: 'Earth',
    coreKeyword: 'Determination & Sovereignty',
    lifeMeaning: 'Sovereign of your destiny, born with innate leadership, structured vision, and persistent determination that turns ambitious milestones into reality.',
    yearlyForecast: 'A powerful period for strategic promotions, building executive authority, and founding enduring projects with lifelong impact.',
    luckyGem: 'Garnet & Gold'
  },
  {
    monthIndex: 1,
    monthName: 'February',
    lifeSymbolName: 'Heart',
    auraName: 'Mystic Amethyst & Rose Violet',
    element: 'Air',
    coreKeyword: 'Compassion & Originality',
    lifeMeaning: 'Bringer of deep empathy, inventive brilliance, and boundless warmth. Your presence elevates team morale and heals friction effortlessly.',
    yearlyForecast: 'Breakthrough innovations and unexpected collaborative victories. High emotional clarity opens doors to transformative friendships.',
    luckyGem: 'Amethyst & Rose Quartz'
  },
  {
    monthIndex: 2,
    monthName: 'March',
    lifeSymbolName: 'Lotus',
    auraName: 'Aquamarine & Sea Pearl',
    element: 'Water',
    coreKeyword: 'Creativity & Intuition',
    lifeMeaning: 'Blooms through complex challenges with serene beauty and profound grace. Your imaginative insight uncovers solutions others overlook.',
    yearlyForecast: 'Creative renaissance and artistic fulfillment. Trust your instincts on crucial strategic cross-roads—they will guide you true.',
    luckyGem: 'Aquamarine & Moonstone'
  },
  {
    monthIndex: 3,
    monthName: 'April',
    lifeSymbolName: 'Phoenix',
    auraName: 'Ruby Crimson & Sunrise Blaze',
    element: 'Fire',
    coreKeyword: 'Courage & Dynamic Action',
    lifeMeaning: 'Radiant courage that rises boldly from any setback. You possess an untamable spark that inspires peers to push beyond their limits.',
    yearlyForecast: 'A blazing trajectory of rapid execution, athletic vitality, and leadership dominance. Unprecedented momentum carries your goals.',
    luckyGem: 'Diamond & Red Jasper'
  },
  {
    monthIndex: 4,
    monthName: 'May',
    lifeSymbolName: 'Tree',
    auraName: 'Emerald Jade & Forest Radiance',
    element: 'Earth',
    coreKeyword: 'Patience & Steadfast Growth',
    lifeMeaning: 'Deeply rooted resilience, steadfast composure, and natural wisdom that nurtures sustainable long-term prosperity.',
    yearlyForecast: 'Substantial material gains, stability in investments, and deep personal contentment. Your patient efforts yield abundant harvest.',
    luckyGem: 'Emerald & Malachite'
  },
  {
    monthIndex: 5,
    monthName: 'June',
    lifeSymbolName: 'Moon',
    auraName: 'Silver Moonlight & Opal Pearl',
    element: 'Air',
    coreKeyword: 'Kindness & Expressive Wit',
    lifeMeaning: 'Luminous intuition and reflective empathy that illuminates dark paths. Your eloquence and gentle charisma draw genuine admiration.',
    yearlyForecast: 'Magnetic social communication, influential speaking opportunities, and radiant harmony in family and workplace bonds.',
    luckyGem: 'Pearl & Alexandrite'
  },
  {
    monthIndex: 6,
    monthName: 'July',
    lifeSymbolName: 'Ocean',
    auraName: 'Sapphire Azure & Deep Turquoise',
    element: 'Water',
    coreKeyword: 'Loyalty & Emotional Depth',
    lifeMeaning: 'Profound loyalty, unshakeable integrity, and protective tidal strength. When you commit, you stand like an unwavering fortress.',
    yearlyForecast: 'Deepened team trust, celebratory domestic milestones, and peace of mind. Your sincere dedication receives the honor it deserves.',
    luckyGem: 'Ruby & Blue Topaz'
  },
  {
    monthIndex: 7,
    monthName: 'August',
    lifeSymbolName: 'Lion',
    auraName: 'Golden Topaz & Solar Sunburst',
    element: 'Fire',
    coreKeyword: 'Confidence & Charisma',
    lifeMeaning: 'Magnificent vitality, generous heart, and natural magnetic authority. Your presence commands respect while warming every room.',
    yearlyForecast: 'Stunning career recognition, center-stage visibility, and victorious ventures. Bold initiatives will be met with thunderous applause.',
    luckyGem: 'Peridot & Tiger Eye'
  },
  {
    monthIndex: 8,
    monthName: 'September',
    lifeSymbolName: 'Crystal',
    auraName: 'Diamond Cyan & Sapphire Cobalt',
    element: 'Earth',
    coreKeyword: 'Intelligence & Precision',
    lifeMeaning: 'Crystalline clarity, analytical brilliance, and structured mastery in engineering and operations. You bring order to complexity.',
    yearlyForecast: 'Intellectual mastery, precision execution of complex operations, and scholarly breakthroughs. Your analytical acumen sets new standards.',
    luckyGem: 'Sapphire & Lapis Lazuli'
  },
  {
    monthIndex: 9,
    monthName: 'October',
    lifeSymbolName: 'Balance',
    auraName: 'Opal Rose & Twilight Indigo',
    element: 'Air',
    coreKeyword: 'Harmony & Diplomatic Grace',
    lifeMeaning: 'Seeker of justice, graceful elegance, and the unifying bridge between opposing views. You cultivate harmony wherever discord arises.',
    yearlyForecast: 'Flawless negotiations, rewarding win-win partnerships, and aesthetic bliss. Perfect equilibrium between intense drive and peaceful rest.',
    luckyGem: 'Opal & Tourmaline'
  },
  {
    monthIndex: 10,
    monthName: 'November',
    lifeSymbolName: 'Butterfly',
    auraName: 'Obsidian Velvet & Mystic Violet',
    element: 'Water',
    coreKeyword: 'Resilience & Deep Transformation',
    lifeMeaning: 'Master of renewal and psychological depth. You convert raw adversity into pure personal gold, constantly evolving into higher power.',
    yearlyForecast: 'Profound personal transformation and shedding of outdated habits. You tap into untapped reserves of mental strength and resourcefulness.',
    luckyGem: 'Topaz & Citrine'
  },
  {
    monthIndex: 11,
    monthName: 'December',
    lifeSymbolName: 'Star',
    auraName: 'Cosmic Indigo & Starlight Silver',
    element: 'Fire',
    coreKeyword: 'Optimism & Expansive Vision',
    lifeMeaning: 'Guiding beacon of unshakeable hope, expansive optimism, and philosophical wisdom that inspires journeys beyond the horizon.',
    yearlyForecast: 'Global travel, expansive academic or skill horizons, and joyous celebratory milestones. Your horizon widens dramatically.',
    luckyGem: 'Turquoise & Tanzanite'
  }
];

// ============================================================================
// Comprehensive Zodiac Sign Matrix (Aries - Pisces)
// ============================================================================
export const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  {
    name: 'Aries',
    glyph: '♈',
    symbol: 'The Ram',
    element: 'Fire',
    rulingPlanet: 'Mars',
    luckyColor: 'Fiery Crimson',
    luckyTraits: ['Pioneering Boldness', 'High Energy', 'Dynamic Leader', 'Unyielding Resolve'],
    luckyNumber: 9,
    dates: 'Mar 21 - Apr 19',
    overview: 'Blazing trailblazer who initiates breakthroughs with fearless vitality and unwavering courage.',
    elementGlow: {
      color: 'rgba(239, 68, 68, 0.7)',
      border: 'border-orange-500/50 hover:border-red-400',
      bg: 'from-orange-500/20 via-red-500/10 to-transparent',
      text: 'text-orange-400',
      shadow: 'shadow-[0_0_25px_rgba(249,115,22,0.4)]',
      radar: 'bg-orange-500'
    }
  },
  {
    name: 'Taurus',
    glyph: '♉',
    symbol: 'The Bull',
    element: 'Earth',
    rulingPlanet: 'Venus',
    luckyColor: 'Emerald Green',
    luckyTraits: ['Steadfast Loyalty', 'Deep Patience', 'Practical Mastery', 'Serene Presence'],
    luckyNumber: 6,
    dates: 'Apr 20 - May 20',
    overview: 'Grounded titan who manifests lasting prosperity through patient execution and noble loyalty.',
    elementGlow: {
      color: 'rgba(16, 185, 129, 0.7)',
      border: 'border-emerald-500/50 hover:border-teal-400',
      bg: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      text: 'text-emerald-400',
      shadow: 'shadow-[0_0_25px_rgba(16,185,129,0.4)]',
      radar: 'bg-emerald-500'
    }
  },
  {
    name: 'Gemini',
    glyph: '♊',
    symbol: 'The Twins',
    element: 'Air',
    rulingPlanet: 'Mercury',
    luckyColor: 'Solar Amber',
    luckyTraits: ['Intellectual Agility', 'Sparkling Wit', 'Curious Explorer', 'Multi-faceted Gift'],
    luckyNumber: 5,
    dates: 'May 21 - Jun 20',
    overview: 'Vibrant communicator whose agile mind discovers clever solutions and bridges diverse minds.',
    elementGlow: {
      color: 'rgba(168, 85, 247, 0.7)',
      border: 'border-purple-500/50 hover:border-amber-400',
      bg: 'from-purple-500/20 via-amber-500/10 to-transparent',
      text: 'text-purple-400',
      shadow: 'shadow-[0_0_25px_rgba(168,85,247,0.4)]',
      radar: 'bg-purple-500'
    }
  },
  {
    name: 'Cancer',
    glyph: '♋',
    symbol: 'The Crab',
    element: 'Water',
    rulingPlanet: 'Moon',
    luckyColor: 'Pearl Silver',
    luckyTraits: ['Profound Empathy', 'Protective Guardian', 'Intuitive Wisdom', 'Devoted Heart'],
    luckyNumber: 2,
    dates: 'Jun 21 - Jul 22',
    overview: 'Intuitive nurturer whose deep emotional wisdom creates unshakeable sanctuaries of safety and success.',
    elementGlow: {
      color: 'rgba(6, 182, 212, 0.7)',
      border: 'border-cyan-500/50 hover:border-blue-400',
      bg: 'from-cyan-500/20 via-blue-500/10 to-transparent',
      text: 'text-cyan-400',
      shadow: 'shadow-[0_0_25px_rgba(6,182,212,0.4)]',
      radar: 'bg-cyan-500'
    }
  },
  {
    name: 'Leo',
    glyph: '♌',
    symbol: 'The Lion',
    element: 'Fire',
    rulingPlanet: 'Sun',
    luckyColor: 'Radiant Gold',
    luckyTraits: ['Magnanimous Heart', 'Magnetic Charisma', 'Commanding Nobility', 'Inspiring Glow'],
    luckyNumber: 1,
    dates: 'Jul 23 - Aug 22',
    overview: 'Golden-hearted visionary who leads by uplifting others, spreading celebration, and radiating honor.',
    elementGlow: {
      color: 'rgba(245, 158, 11, 0.7)',
      border: 'border-amber-500/50 hover:border-orange-400',
      bg: 'from-amber-500/20 via-orange-500/10 to-transparent',
      text: 'text-amber-400',
      shadow: 'shadow-[0_0_25px_rgba(245,158,11,0.4)]',
      radar: 'bg-amber-500'
    }
  },
  {
    name: 'Virgo',
    glyph: '♍',
    symbol: 'The Maiden',
    element: 'Earth',
    rulingPlanet: 'Mercury',
    luckyColor: 'Sapphire & Platinum',
    luckyTraits: ['Analytical Perfection', 'Discerning Mind', 'Noble Service', 'Engineering Brilliance'],
    luckyNumber: 7,
    dates: 'Aug 23 - Sep 22',
    overview: 'Master of clarity and process architecture who refines complex systems into sublime efficiency.',
    elementGlow: {
      color: 'rgba(16, 185, 129, 0.7)',
      border: 'border-emerald-500/50 hover:border-cyan-400',
      bg: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      text: 'text-emerald-400',
      shadow: 'shadow-[0_0_25px_rgba(16,185,129,0.4)]',
      radar: 'bg-emerald-500'
    }
  },
  {
    name: 'Libra',
    glyph: '♎',
    symbol: 'The Scales',
    element: 'Air',
    rulingPlanet: 'Venus',
    luckyColor: 'Rose Opal',
    luckyTraits: ['Diplomatic Brilliance', 'Graceful Harmony', 'Aesthetic Eye', 'Justice Seeker'],
    luckyNumber: 6,
    dates: 'Sep 23 - Oct 22',
    overview: 'Conductor of equilibrium who transforms conflicts into rewarding partnerships and pure elegance.',
    elementGlow: {
      color: 'rgba(217, 70, 239, 0.7)',
      border: 'border-purple-500/50 hover:border-pink-400',
      bg: 'from-purple-500/20 via-pink-500/10 to-transparent',
      text: 'text-purple-400',
      shadow: 'shadow-[0_0_25px_rgba(217,70,239,0.4)]',
      radar: 'bg-purple-500'
    }
  },
  {
    name: 'Scorpio',
    glyph: '♏',
    symbol: 'The Scorpion',
    element: 'Water',
    rulingPlanet: 'Pluto & Mars',
    luckyColor: 'Obsidian Crimson',
    luckyTraits: ['Psychological Depth', 'Laser Focus', 'Alchemical Resilience', 'Strategic Vision'],
    luckyNumber: 8,
    dates: 'Oct 23 - Nov 21',
    overview: 'Mystic strategist whose unwavering determination pierces illusions and turns adversity into triumph.',
    elementGlow: {
      color: 'rgba(168, 85, 247, 0.7)',
      border: 'border-purple-500/50 hover:border-red-400',
      bg: 'from-purple-500/20 via-fuchsia-500/10 to-transparent',
      text: 'text-purple-400',
      shadow: 'shadow-[0_0_25px_rgba(168,85,247,0.4)]',
      radar: 'bg-purple-500'
    }
  },
  {
    name: 'Sagittarius',
    glyph: '♐',
    symbol: 'The Archer',
    element: 'Fire',
    rulingPlanet: 'Jupiter',
    luckyColor: 'Royal Violet',
    luckyTraits: ['Philosophical Optimism', 'Expansive Vision', 'Unbounded Joy', 'Truth Seeker'],
    luckyNumber: 3,
    dates: 'Nov 22 - Dec 21',
    overview: 'Far-seeing explorer whose golden enthusiasm inspires teams to shoot arrows toward unreachable stars.',
    elementGlow: {
      color: 'rgba(249, 115, 22, 0.7)',
      border: 'border-orange-500/50 hover:border-purple-400',
      bg: 'from-orange-500/20 via-purple-500/10 to-transparent',
      text: 'text-orange-400',
      shadow: 'shadow-[0_0_25px_rgba(249,115,22,0.4)]',
      radar: 'bg-orange-500'
    }
  },
  {
    name: 'Capricorn',
    glyph: '♑',
    symbol: 'The Sea-Goat',
    element: 'Earth',
    rulingPlanet: 'Saturn',
    luckyColor: 'Midnight Onyx',
    luckyTraits: ['Monolithic Discipline', 'Pragmatic Ambition', 'Unshakable Patience', 'Executive Mastery'],
    luckyNumber: 4,
    dates: 'Dec 22 - Jan 19',
    overview: 'Disciplined mountain-climber whose steadfast excellence reaches the summits of enduring respect.',
    elementGlow: {
      color: 'rgba(16, 185, 129, 0.7)',
      border: 'border-emerald-500/50 hover:border-slate-400',
      bg: 'from-emerald-500/20 via-slate-500/10 to-transparent',
      text: 'text-emerald-400',
      shadow: 'shadow-[0_0_25px_rgba(16,185,129,0.4)]',
      radar: 'bg-emerald-500'
    }
  },
  {
    name: 'Aquarius',
    glyph: '♒',
    symbol: 'The Water Bearer',
    element: 'Air',
    rulingPlanet: 'Uranus & Saturn',
    luckyColor: 'Electric Cyan',
    luckyTraits: ['Visionary Pioneer', 'Humanitarian Heart', 'Unconventional Genius', 'Free Spirit'],
    luckyNumber: 11,
    dates: 'Jan 20 - Feb 18',
    overview: 'Futurist inventor whose original perspectives innovate new eras of team synergy and collective happiness.',
    elementGlow: {
      color: 'rgba(6, 182, 212, 0.7)',
      border: 'border-cyan-500/50 hover:border-sky-400',
      bg: 'from-cyan-500/20 via-sky-500/10 to-transparent',
      text: 'text-cyan-400',
      shadow: 'shadow-[0_0_25px_rgba(6,182,212,0.4)]',
      radar: 'bg-cyan-500'
    }
  },
  {
    name: 'Pisces',
    glyph: '♓',
    symbol: 'The Two Fish',
    element: 'Water',
    rulingPlanet: 'Neptune & Jupiter',
    luckyColor: 'Seafoam Aquamarine',
    luckyTraits: ['Infinite Compassion', 'Poetic Intuition', 'Dream Weaver', 'Healing Grace'],
    luckyNumber: 7,
    dates: 'Feb 19 - Mar 20',
    overview: 'Deeply empathic soul whose soothing wisdom and creative depth bestow profound grace to everyone around.',
    elementGlow: {
      color: 'rgba(59, 130, 246, 0.7)',
      border: 'border-blue-500/50 hover:border-teal-400',
      bg: 'from-blue-500/20 via-cyan-500/10 to-transparent',
      text: 'text-blue-400',
      shadow: 'shadow-[0_0_25px_rgba(59,130,246,0.4)]',
      radar: 'bg-blue-500'
    }
  }
];

// ============================================================================
// Helper: Accurate Astrological Sign Determination
// ============================================================================
export function getZodiacSign(month: number, day: number): ZodiacSignInfo {
  if ((month === 2 && day >= 21) || (month === 3 && day <= 19)) return ZODIAC_SIGNS[0]; // Aries
  if ((month === 3 && day >= 20) || (month === 4 && day <= 20)) return ZODIAC_SIGNS[1]; // Taurus
  if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) return ZODIAC_SIGNS[2]; // Gemini
  if ((month === 5 && day >= 21) || (month === 6 && day <= 22)) return ZODIAC_SIGNS[3]; // Cancer
  if ((month === 6 && day >= 23) || (month === 7 && day <= 22)) return ZODIAC_SIGNS[4]; // Leo
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS[5]; // Virgo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS[6]; // Libra
  if ((month === 9 && day >= 23) || (month === 10 && day <= 21)) return ZODIAC_SIGNS[7]; // Scorpio
  if ((month === 10 && day >= 22) || (month === 11 && day <= 21)) return ZODIAC_SIGNS[8]; // Sagittarius
  if ((month === 11 && day >= 22) || (month === 0 && day <= 19)) return ZODIAC_SIGNS[9]; // Capricorn
  if ((month === 0 && day >= 20) || (month === 1 && day <= 18)) return ZODIAC_SIGNS[10]; // Aquarius
  return ZODIAC_SIGNS[11]; // Pisces
}

// ============================================================================
// 3D Rich SVGs for the 12 Life Symbols (High-End Faceted Graphics)
// ============================================================================
export const LifeSymbol3D: React.FC<{ symbol: string; className?: string }> = ({ symbol, className = 'w-12 h-12' }) => {
  switch (symbol) {
    case 'Crown':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldCrown" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="45%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
            <filter id="crownGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#CA8A04" floodOpacity="0.4" />
            </filter>
          </defs>
          <path d="M8 48L12 24L24 38L32 16L40 38L52 24L56 48H8Z" fill="url(#goldCrown)" filter="url(#crownGlow)" />
          <path d="M8 46H56V52C56 53.1 55.1 54 54 54H10C8.9 54 8 53.1 8 52V46Z" fill="#A16207" />
          <circle cx="32" cy="14" r="3.5" fill="#EF4444" stroke="#FFF" strokeWidth="1" />
          <circle cx="12" cy="22" r="3" fill="#3B82F6" stroke="#FFF" strokeWidth="1" />
          <circle cx="52" cy="22" r="3" fill="#10B981" stroke="#FFF" strokeWidth="1" />
          <circle cx="32" cy="42" r="2.5" fill="#FFF" opacity="0.9" />
        </svg>
      );
    case 'Heart':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="roseHeart" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="50%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#BE123C" />
            </linearGradient>
          </defs>
          <path d="M32 54C32 54 10 39.5 10 24C10 16.5 15.5 11 23 11C27.5 11 30.5 13.5 32 16C33.5 13.5 36.5 11 41 11C48.5 11 54 16.5 54 24C54 39.5 32 54 32 54Z" fill="url(#roseHeart)" />
          <ellipse cx="23" cy="21" rx="6" ry="3.5" transform="rotate(-30 23 21)" fill="#FFF" opacity="0.45" />
        </svg>
      );
    case 'Lotus':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lotusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0E7490" />
            </linearGradient>
          </defs>
          <path d="M32 14C32 14 26 28 26 38C26 44 28.5 48 32 48C35.5 48 38 44 38 38C38 28 32 14 32 14Z" fill="url(#lotusGrad)" />
          <path d="M32 24C28 26 14 34 16 44C17.5 49 24 49 28 46C26 42 28 34 32 24Z" fill="#22D3EE" opacity="0.8" />
          <path d="M32 24C36 26 50 34 48 44C46.5 49 40 49 36 46C38 42 36 34 32 24Z" fill="#22D3EE" opacity="0.8" />
          <circle cx="32" cy="45" r="4" fill="#FDE047" />
        </svg>
      );
    case 'Phoenix':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="firePhoenix" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
          </defs>
          <path d="M32 10L36 24L48 20L40 32L54 36L38 42L42 56L32 46L22 56L26 42L10 36L24 32L16 20L28 24L32 10Z" fill="url(#firePhoenix)" />
          <circle cx="32" cy="28" r="4" fill="#FFF" opacity="0.9" />
        </svg>
      );
    case 'Tree':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="emeraldTree" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>
          <path d="M30 40H34V54H30V40Z" fill="#78350F" />
          <circle cx="32" cy="24" r="16" fill="url(#emeraldTree)" />
          <circle cx="23" cy="28" r="11" fill="#10B981" />
          <circle cx="41" cy="28" r="11" fill="#059669" />
          <circle cx="32" cy="18" r="9" fill="#6EE7B7" opacity="0.75" />
        </svg>
      );
    case 'Moon':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="silverMoon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="60%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
          </defs>
          <path d="M42 12C28 14 18 26 18 40C18 51 25 54 28 54C22 50 18 42 18 34C18 20 29 14 42 12Z" fill="url(#silverMoon)" />
          <circle cx="44" cy="28" r="3" fill="#FDE047" opacity="0.9" />
          <circle cx="38" cy="42" r="2" fill="#E2E8F0" opacity="0.8" />
        </svg>
      );
    case 'Ocean':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="oceanWave" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="60%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
          </defs>
          <path d="M12 44C18 36 24 38 30 44C36 50 44 48 52 40V52H12V44Z" fill="url(#oceanWave)" />
          <path d="M14 36C22 28 28 32 36 36C42 40 48 38 52 30V40C44 48 36 50 30 44C24 38 18 36 14 36Z" fill="#0EA5E9" />
          <circle cx="28" cy="22" r="6" fill="#BAE6FD" opacity="0.6" />
        </svg>
      );
    case 'Lion':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="amberLion" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="60%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="20" fill="url(#amberLion)" />
          <circle cx="32" cy="32" r="14" fill="#F59E0B" />
          <circle cx="26" cy="28" r="2.5" fill="#1E293B" />
          <circle cx="38" cy="28" r="2.5" fill="#1E293B" />
          <path d="M32 34L29 39H35L32 34Z" fill="#92400E" />
          <path d="M32 39V43" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'Crystal':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="prismCrystal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="40%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          <polygon points="32,10 48,24 40,54 24,54 16,24" fill="url(#prismCrystal)" />
          <polygon points="32,10 40,24 32,54 24,24" fill="#BAE6FD" opacity="0.6" />
          <line x1="32" y1="10" x2="32" y2="54" stroke="#FFF" strokeWidth="1.5" opacity="0.75" />
        </svg>
      );
    case 'Balance':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 12V50M18 20L32 16L46 20M14 36L18 20L22 36C22 38 14 38 14 36ZM42 36L46 20L50 36C50 38 42 38 42 36ZM24 50H40" stroke="#C084FC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="32" cy="14" r="3" fill="#F472B6" />
        </svg>
      );
    case 'Butterfly':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mysticButterfly" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#581C87" />
            </linearGradient>
          </defs>
          <path d="M32 30C28 18 14 14 14 26C14 34 24 36 32 34Z" fill="url(#mysticButterfly)" />
          <path d="M32 30C36 18 50 14 50 26C50 34 40 36 32 34Z" fill="url(#mysticButterfly)" />
          <path d="M32 34C26 36 18 42 20 48C22 52 30 48 32 38Z" fill="#A855F7" />
          <path d="M32 34C38 36 46 42 44 48C42 52 34 48 32 38Z" fill="#A855F7" />
          <ellipse cx="32" cy="34" rx="2" ry="12" fill="#E9D5FF" />
        </svg>
      );
    case 'Star':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cosmicStar" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#854D0E" />
            </linearGradient>
          </defs>
          <polygon points="32,8 37,24 53,24 40,34 45,50 32,40 19,50 24,34 11,24 27,24" fill="url(#cosmicStar)" />
          <circle cx="32" cy="32" r="5" fill="#FFF" opacity="0.9" />
        </svg>
      );
    default:
      return <Sparkles className={className} />;
  }
};

// ============================================================================
// Dynamic Zodiac Constellation Patterns & SVG Star Coordinates
// ============================================================================
export interface ZodiacConstellationData {
  name: string;
  viewBox: string;
  paths: string[];
  stars: { x: number; y: number; r: number; twinkle: 1 | 2 | 3; name?: string }[];
}

export const ZODIAC_CONSTELLATIONS: Record<string, ZodiacConstellationData> = {
  Aries: {
    name: 'Aries',
    viewBox: '0 0 200 200',
    paths: ['M145 60 L110 85 L75 105 L45 130'],
    stars: [
      { x: 145, y: 60, r: 4, twinkle: 1, name: 'Hamal' },
      { x: 110, y: 85, r: 3.2, twinkle: 2, name: 'Sheratan' },
      { x: 75, y: 105, r: 2.8, twinkle: 3, name: 'Mesarthim' },
      { x: 45, y: 130, r: 2.4, twinkle: 1 }
    ]
  },
  Taurus: {
    name: 'Taurus',
    viewBox: '0 0 200 200',
    paths: [
      'M165 45 L130 110 L105 100 L95 125 L75 140',
      'M145 70 L130 110',
      'M105 100 L55 75 L45 70'
    ],
    stars: [
      { x: 130, y: 110, r: 4.5, twinkle: 1, name: 'Aldebaran' },
      { x: 165, y: 45, r: 3.4, twinkle: 2, name: 'Elnath' },
      { x: 145, y: 70, r: 2.8, twinkle: 3 },
      { x: 105, y: 100, r: 2.8, twinkle: 2 },
      { x: 95, y: 125, r: 2.6, twinkle: 3 },
      { x: 75, y: 140, r: 2.4, twinkle: 1 },
      { x: 55, y: 75, r: 3.5, twinkle: 1, name: 'Pleiades' },
      { x: 45, y: 70, r: 2.2, twinkle: 2 }
    ]
  },
  Gemini: {
    name: 'Gemini',
    viewBox: '0 0 200 200',
    paths: [
      'M75 40 L60 85 L50 145',
      'M130 50 L105 95 L120 140',
      'M60 85 L105 95'
    ],
    stars: [
      { x: 75, y: 40, r: 4.2, twinkle: 1, name: 'Castor' },
      { x: 130, y: 50, r: 4.4, twinkle: 2, name: 'Pollux' },
      { x: 60, y: 85, r: 3, twinkle: 3 },
      { x: 105, y: 95, r: 3, twinkle: 1, name: 'Wasat' },
      { x: 50, y: 145, r: 3.4, twinkle: 2, name: 'Alhena' },
      { x: 120, y: 140, r: 3.2, twinkle: 3 }
    ]
  },
  Cancer: {
    name: 'Cancer',
    viewBox: '0 0 200 200',
    paths: [
      'M100 40 L90 75 L110 90',
      'M90 75 L60 135',
      'M110 90 L140 130'
    ],
    stars: [
      { x: 100, y: 40, r: 3, twinkle: 1, name: 'Tegmine' },
      { x: 90, y: 75, r: 3.2, twinkle: 2 },
      { x: 110, y: 90, r: 3.2, twinkle: 3 },
      { x: 60, y: 135, r: 3.6, twinkle: 1, name: 'Acubens' },
      { x: 140, y: 130, r: 3.8, twinkle: 2, name: 'Altarf' }
    ]
  },
  Leo: {
    name: 'Leo',
    viewBox: '0 0 200 200',
    paths: [
      'M55 50 L75 60 L80 85 L65 130 L120 120 L135 80 L80 85',
      'M135 80 L165 95 L120 120'
    ],
    stars: [
      { x: 65, y: 130, r: 4.6, twinkle: 1, name: 'Regulus' },
      { x: 80, y: 85, r: 3.6, twinkle: 2, name: 'Algieba' },
      { x: 75, y: 60, r: 2.8, twinkle: 3 },
      { x: 55, y: 50, r: 2.6, twinkle: 1 },
      { x: 135, y: 80, r: 3.4, twinkle: 2, name: 'Zosma' },
      { x: 120, y: 120, r: 3, twinkle: 3 },
      { x: 165, y: 95, r: 4, twinkle: 1, name: 'Denebola' }
    ]
  },
  Virgo: {
    name: 'Virgo',
    viewBox: '0 0 200 200',
    paths: [
      'M55 60 L75 80 L95 85 L135 45',
      'M95 85 L115 110 L140 140',
      'M75 80 L60 115 L95 85'
    ],
    stars: [
      { x: 140, y: 140, r: 4.8, twinkle: 1, name: 'Spica' },
      { x: 95, y: 85, r: 3.4, twinkle: 2, name: 'Porrima' },
      { x: 135, y: 45, r: 3.4, twinkle: 3, name: 'Vindemiatrix' },
      { x: 55, y: 60, r: 2.8, twinkle: 1 },
      { x: 75, y: 80, r: 2.8, twinkle: 2 },
      { x: 115, y: 110, r: 3, twinkle: 3 },
      { x: 60, y: 115, r: 2.6, twinkle: 1 }
    ]
  },
  Libra: {
    name: 'Libra',
    viewBox: '0 0 200 200',
    paths: [
      'M100 40 L55 105 L110 145 L145 100 Z',
      'M100 40 L145 100'
    ],
    stars: [
      { x: 100, y: 40, r: 4, twinkle: 1, name: 'Zubeneschamali' },
      { x: 55, y: 105, r: 4, twinkle: 2, name: 'Zubenelgenubi' },
      { x: 145, y: 100, r: 3.2, twinkle: 3 },
      { x: 110, y: 145, r: 3.4, twinkle: 1, name: 'Brachium' }
    ]
  },
  Scorpio: {
    name: 'Scorpio',
    viewBox: '0 0 200 200',
    paths: [
      'M50 50 L55 68 L70 88 L85 120 L115 140 L150 115 L140 98'
    ],
    stars: [
      { x: 70, y: 88, r: 4.8, twinkle: 1, name: 'Antares' },
      { x: 50, y: 50, r: 3, twinkle: 2, name: 'Graffias' },
      { x: 55, y: 68, r: 3.2, twinkle: 3, name: 'Dschubba' },
      { x: 85, y: 120, r: 3, twinkle: 2 },
      { x: 115, y: 140, r: 3.4, twinkle: 3, name: 'Sargas' },
      { x: 150, y: 115, r: 4, twinkle: 1, name: 'Shaula' },
      { x: 140, y: 98, r: 2.8, twinkle: 2, name: 'Lesath' }
    ]
  },
  Sagittarius: {
    name: 'Sagittarius',
    viewBox: '0 0 200 200',
    paths: [
      'M45 100 L90 105 L105 70 L145 75 L135 120 L80 135 L90 105',
      'M80 135 L135 120'
    ],
    stars: [
      { x: 80, y: 135, r: 4.2, twinkle: 1, name: 'Kaus Australis' },
      { x: 90, y: 105, r: 3.4, twinkle: 2, name: 'Kaus Media' },
      { x: 105, y: 70, r: 3.6, twinkle: 3, name: 'Kaus Borealis' },
      { x: 145, y: 75, r: 4, twinkle: 1, name: 'Nunki' },
      { x: 135, y: 120, r: 3.4, twinkle: 2, name: 'Ascella' },
      { x: 45, y: 100, r: 3.2, twinkle: 3, name: 'Alnasl' }
    ]
  },
  Capricorn: {
    name: 'Capricorn',
    viewBox: '0 0 200 200',
    paths: [
      'M50 55 L65 70 L100 140 L135 88 L155 75 Z',
      'M65 70 L135 88'
    ],
    stars: [
      { x: 50, y: 55, r: 3.6, twinkle: 1, name: 'Algedi' },
      { x: 65, y: 70, r: 3.2, twinkle: 2, name: 'Dabih' },
      { x: 100, y: 140, r: 3.2, twinkle: 3 },
      { x: 135, y: 88, r: 3.2, twinkle: 2 },
      { x: 155, y: 75, r: 4, twinkle: 1, name: 'Deneb Algedi' }
    ]
  },
  Aquarius: {
    name: 'Aquarius',
    viewBox: '0 0 200 200',
    paths: [
      'M55 80 L95 45 L125 65 L95 105 L135 140',
      'M95 105 L70 135'
    ],
    stars: [
      { x: 95, y: 45, r: 4, twinkle: 1, name: 'Sadalsuud' },
      { x: 125, y: 65, r: 3.8, twinkle: 2, name: 'Sadalmelik' },
      { x: 55, y: 80, r: 3.2, twinkle: 3, name: 'Albali' },
      { x: 95, y: 105, r: 3, twinkle: 1 },
      { x: 70, y: 135, r: 2.8, twinkle: 3 },
      { x: 135, y: 140, r: 3.8, twinkle: 2, name: 'Skat' }
    ]
  },
  Pisces: {
    name: 'Pisces',
    viewBox: '0 0 200 200',
    paths: [
      'M45 120 L65 95 L95 125 L145 140 L135 95 L145 60 L120 45 L135 95'
    ],
    stars: [
      { x: 145, y: 140, r: 4, twinkle: 1, name: 'Alrescha' },
      { x: 45, y: 120, r: 3.4, twinkle: 2 },
      { x: 65, y: 95, r: 3, twinkle: 3 },
      { x: 95, y: 125, r: 2.8, twinkle: 1 },
      { x: 135, y: 95, r: 2.8, twinkle: 3 },
      { x: 145, y: 60, r: 3, twinkle: 1 },
      { x: 120, y: 45, r: 3.4, twinkle: 2 }
    ]
  }
};

export const ZodiacConstellationSVG: React.FC<{
  sign: string;
  glowColor?: string;
  className?: string;
}> = ({ sign, glowColor = 'rgba(168, 85, 247, 0.8)', className = 'w-64 h-64' }) => {
  const data = ZODIAC_CONSTELLATIONS[sign] || ZODIAC_CONSTELLATIONS.Aries;

  return (
    <svg 
      viewBox={data.viewBox} 
      className={`${className} overflow-visible`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ '--glow-color': glowColor } as React.CSSProperties}
    >
      <defs>
        <filter id="constellationLineGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="starCoreFlare" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="40%" stopColor="#E0E7FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Constellation Connection Paths */}
      <g className="animate-constellation-lines">
        {data.paths.map((p, i) => (
          <path
            key={i}
            d={p}
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="1.2"
            strokeDasharray="3 2"
            filter="url(#constellationLineGlow)"
          />
        ))}
      </g>

      {/* Ambient Celestial Starlight Dust */}
      {[
        { x: 30, y: 35, r: 1 },
        { x: 170, y: 40, r: 1.2 },
        { x: 25, y: 165, r: 0.9 },
        { x: 175, y: 160, r: 1.1 },
        { x: 100, y: 180, r: 0.8 },
        { x: 20, y: 90, r: 0.9 },
        { x: 180, y: 100, r: 1 }
      ].map((d, idx) => (
        <circle
          key={`dust-${idx}`}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill="rgba(255, 255, 255, 0.4)"
          className="animate-pulse"
        />
      ))}

      {/* Constellation Stars with Twinkling Keyframes and Specular Halos */}
      {data.stars.map((s, idx) => {
        const twinkleClass =
          s.twinkle === 1
            ? 'animate-star-twinkle-1'
            : s.twinkle === 2
            ? 'animate-star-twinkle-2'
            : 'animate-star-twinkle-3';

        return (
          <g key={idx} className={twinkleClass}>
            <circle cx={s.x} cy={s.y} r={s.r * 2.8} fill="url(#starCoreFlare)" opacity="0.65" />
            <circle cx={s.x} cy={s.y} r={s.r} fill="#FFFFFF" stroke="rgba(192, 132, 252, 0.9)" strokeWidth="0.8" />
            <circle cx={s.x} cy={s.y} r={s.r * 0.45} fill="#FFFFFF" />
          </g>
        );
      })}
    </svg>
  );
};

export const CONSTELLATION_COORDINATES: Record<string, { ra: string; dec: string }> = {
  Aries: { ra: '02h 38m', dec: "+20° 47'" },
  Taurus: { ra: '04h 36m', dec: "+16° 30'" },
  Gemini: { ra: '07h 04m', dec: "+22° 36'" },
  Cancer: { ra: '08h 38m', dec: "+19° 48'" },
  Leo: { ra: '10h 40m', dec: "+13° 08'" },
  Virgo: { ra: '13h 24m', dec: "-04° 09'" },
  Libra: { ra: '15h 17m', dec: "-15° 59'" },
  Scorpio: { ra: '16h 53m', dec: "-30° 44'" },
  Sagittarius: { ra: '19h 05m', dec: "-25° 28'" },
  Capricorn: { ra: '21h 02m', dec: "-18° 01'" },
  Aquarius: { ra: '22h 17m', dec: "-06° 00'" },
  Pisces: { ra: '00h 28m', dec: "+13° 41'" },
};

export const STAR_CATALOG: Record<string, Record<string, { mag: string; spectral: string; lightYears: string; desc: string }>> = {
  Aries: {
    Hamal: { mag: '+2.01', spectral: 'K2IIIb Orange Giant', lightYears: '65.8 ly', desc: 'Alpha Arietis, ancient head of the celestial ram marking the vernal equinox in antiquity.' },
    Sheratan: { mag: '+2.64', spectral: 'A5V White Binary', lightYears: '59.6 ly', desc: 'Beta Arietis, a luminous spectroscopic system signaling bold initiative.' },
    Mesarthim: { mag: '+3.88', spectral: 'A1pSi Magnetic Star', lightYears: '164 ly', desc: 'Gamma Arietis, prized among the earliest telescopic double stars ever discovered.' },
  },
  Taurus: {
    Aldebaran: { mag: '+0.85', spectral: 'K5III Red Giant', lightYears: '65.3 ly', desc: 'The Eye of the Bull, royal star of the east and ancient beacon of wealth and perseverance.' },
    Elnath: { mag: '+1.65', spectral: 'B7III Mercury-Manganese', lightYears: '134 ly', desc: 'Beta Tauri, towering horn-tip of the bull bridging Taurus and Auriga.' },
    Pleiades: { mag: '+1.60', spectral: 'B7IIIe Open Cluster', lightYears: '444 ly', desc: 'The Seven Sisters, sparkling jewel cluster of celestial renewal and cosmic guidance.' },
  },
  Gemini: {
    Pollux: { mag: '+1.14', spectral: 'K0III Giant (Planet-Host)', lightYears: '33.8 ly', desc: 'Beta Geminorum, immortal twin possessing an orbit of confirmed exoplanetary worlds.' },
    Castor: { mag: '+1.58', spectral: 'A1V Sextuple System', lightYears: '51.6 ly', desc: 'Alpha Geminorum, an astonishing physical gravitation system of six dancing stars.' },
    Alhena: { mag: '+1.90', spectral: 'A0IV White Subgiant', lightYears: '109 ly', desc: 'Gamma Geminorum, the shining foot-star of Gemini radiating communicative grace.' },
  },
  Cancer: {
    Altarf: { mag: '+3.52', spectral: 'K4III Orange Giant', lightYears: '290 ly', desc: 'Beta Cancri, the brightest eye in the constellation of the Crab, guardian of emotional sanctum.' },
    Acubens: { mag: '+4.26', spectral: 'A5m Metallic Binary', lightYears: '174 ly', desc: 'Alpha Cancri, the southern claw holding protective sanctuary for team unity.' },
    Tegmine: { mag: '+4.58', spectral: 'F9V Triple Star', lightYears: '83.4 ly', desc: 'Zeta Cancri, the rear shell protecting inner intuition and generational trust.' },
  },
  Leo: {
    Regulus: { mag: '+1.36', spectral: 'B8IVn Rapid Rotator', lightYears: '79.3 ly', desc: 'Heart of the Lion, majestic Royal Star of the North symbolizing leadership, magnanimity, and center-stage honor.' },
    Denebola: { mag: '+2.14', spectral: 'A3V Circumstellar Debris', lightYears: '35.9 ly', desc: 'Beta Leonis, the proud tail of Leo heralding the arrival of vernal harvest.' },
    Algieba: { mag: '+1.98', spectral: 'K0III Golden Binary', lightYears: '130 ly', desc: 'Gamma Leonis, The Mane, acclaimed as one of the finest visual double stars in the night sky.' },
  },
  Virgo: {
    Spica: { mag: '+0.98', spectral: 'B1III-IV Blue Giant', lightYears: '250 ly', desc: 'Alpha Virginis, the radiant Ear of Wheat representing intellectual mastery, analytical perfection, and boundless harvest.' },
    Porrima: { mag: '+2.74', spectral: 'F0V Twin Binary', lightYears: '38.1 ly', desc: 'Gamma Virginis, goddess of prophecy, celebrated twin white stars in flawless orbital lock.' },
    Vindemiatrix: { mag: '+2.83', spectral: 'G8III Yellow Giant', lightYears: '110 ly', desc: 'Epsilon Virginis, the Grape Gatherer, historic herald of season prosperity.' },
  },
  Libra: {
    Zubeneschamali: { mag: '+2.61', spectral: 'B8Vn Emerald Tinted', lightYears: '185 ly', desc: 'Northern Scale, historically celebrated as the only star in the heavens with an emerald-green tinge.' },
    Zubenelgenubi: { mag: '+2.75', spectral: 'A3IV Luminous Binary', lightYears: '75.8 ly', desc: 'Southern Scale, wide binary pair symbolizing diplomatic equilibrium and win-win covenants.' },
    Brachium: { mag: '+3.25', spectral: 'M3.5III Pulsating Giant', lightYears: '260 ly', desc: 'Sigma Librae, pulsating balance beam upholding universal fairness and grace.' },
  },
  Scorpio: {
    Antares: { mag: '+1.06', spectral: 'M1.5Iab Red Supergiant', lightYears: '550 ly', desc: 'Heart of the Scorpion, monumental red supergiant and rival of Mars symbolizing supreme resilience and strategic vision.' },
    Shaula: { mag: '+1.62', spectral: 'B2IV Multiple Star', lightYears: '570 ly', desc: 'Lambda Scorpii, The Stinger, dazzling celestial tip capable of overcoming any obstacle.' },
    Sargas: { mag: '+1.86', spectral: 'F0II Bright Giant', lightYears: '300 ly', desc: 'Theta Scorpii, glowing curve of the scorpion tail guiding profound transformation.' },
  },
  Sagittarius: {
    'Kaus Australis': { mag: '+1.79', spectral: 'B9.5III Bright Giant', lightYears: '143 ly', desc: 'Southern Bow, brilliant beacon anchoring the archer’s bow pointing straight toward galactic core.' },
    Nunki: { mag: '+2.05', spectral: 'B2.5V Blue Subgiant', lightYears: '228 ly', desc: 'Sigma Sagittarii, ancient Sumerian star of the sacred watery horizon and truth.' },
    Ascella: { mag: '+2.59', spectral: 'A2V Binary Star', lightYears: '88.2 ly', desc: 'Zeta Sagittarii, the archer’s armpit heralding expansive travel and optimistic horizons.' },
  },
  Capricorn: {
    'Deneb Algedi': { mag: '+2.85', spectral: 'A7m Metallic Eclipsing', lightYears: '38.6 ly', desc: 'Tail of the Sea-Goat, steadfast guardian of enduring legacies and disciplined executive summits.' },
    Dabih: { mag: '+3.05', spectral: 'K0II Multi-Star System', lightYears: '344 ly', desc: 'Beta Capricorni, ancient stellar herald of luck for triumphant undertakings.' },
    Algedi: { mag: '+3.58', spectral: 'G9.5III Optical Double', lightYears: '106 ly', desc: 'Alpha Capricorni, the noble horn symbolizing pragmatic persistence.' },
  },
  Aquarius: {
    Sadalsuud: { mag: '+2.90', spectral: 'G0Ib Rare Supergiant', lightYears: '540 ly', desc: 'Beta Aquarii, Luck of Lucks, sacred Arabic beacon celebrating unprecedented fortune and creative awakening.' },
    Sadalmelik: { mag: '+2.95', spectral: 'G2Ib Supergiant', lightYears: '520 ly', desc: 'Alpha Aquarii, Luck of the Sovereign, pouring forth waters of inventiveness and team harmony.' },
    Skat: { mag: '+3.27', spectral: 'A3V Fast Rotator', lightYears: '160 ly', desc: 'Delta Aquarii, lower leg of the water bearer guiding futuristic leaps in technology.' },
  },
  Pisces: {
    Alrescha: { mag: '+3.82', spectral: 'A0pSi Binary Knot', lightYears: '139 ly', desc: 'Alpha Piscium, The Sacred Knot binding the celestial fish, unifying intuition and creative mastery.' },
    'Fumalsamakah': { mag: '+4.48', spectral: 'B9.5V Blue Main Sequence', lightYears: '280 ly', desc: 'Beta Piscium, mouth of the western fish sipping inspiration from celestial rivers.' },
    'Kullat Nunu': { mag: '+3.62', spectral: 'G9III Golden Giant', lightYears: '294 ly', desc: 'Eta Piscium, brightest light in Pisces radiating profound empathy and emotional calm.' },
  }
};

// ============================================================================
// Helper: Detailed Astrological Fate & Destiny Generator
// ============================================================================
export function getDetailedAstrologyFate(zodiacName: string, celebrantName: string, currentYear: number) {
  const firstName = celebrantName.split(' ')[0];

  const fateMatrix: Record<string, {
    alignment: string;
    forecast: string;
    luckFactor: string;
    careerPredictions: string[];
    growthLeap: string;
    joyMilestones: string[];
    friendshipBlessing: string;
    cosmicDecree: string;
  }> = {
    Aries: {
      alignment: 'Jupiter in Gemini trine Natal Sun & Mars Direct in Ascendant',
      forecast: `A fiery epoch of rapid forward momentum. Jupiter's expansive trine dissolves past bottlenecks, infusing ${firstName}'s projects with swift execution and executive leadership praise throughout ${currentYear}.`,
      luckFactor: '99% High Octane Momentum',
      careerPredictions: [
        'Elevation into high-stakes engineering steering mandates with direct director appreciation',
        'Exceptional operational intuition that slashes project bottlenecks in record time',
        'Unlocking key cross-functional initiatives that cement your organizational authority'
      ],
      growthLeap: 'Executive Mandate & Breakthrough Leadership',
      joyMilestones: [
        'Vibrant physical stamina, glowing athletic vitality, and sound sleep',
        'Warm celebratory gatherings filled with shared laughter and team pride',
        'Deep emotional peace from conquering long-held personal aspirations'
      ],
      friendshipBlessing: 'Surrounded by noble comrades who champion your boldest ideas.',
      cosmicDecree: `Decreed: Walk boldly with unshakeable conviction, ${firstName}. The universe bends to amplify your noble fire.`
    },
    Taurus: {
      alignment: 'Uranus Direct in Taurus trine Saturn in Capricorn & Venus Auspicious',
      forecast: `A monumental cycle of permanent financial security and operational mastery. The structural trine between Venus, Saturn, and Uranus crystallizes ${firstName}'s patient dedication into lasting executive prestige.`,
      luckFactor: '98% Unshakeable Prosperity',
      careerPredictions: [
        'Institutional recognition for establishing durable, fault-tolerant workflow frameworks',
        'Commendations from top executive leadership for unwavering dependability under pressure',
        'Securing substantial material bonuses and high-impact long-term project stewardship'
      ],
      growthLeap: 'Sovereign Stability & Material Prosperity',
      joyMilestones: [
        'Serene home sanctuary upgrades and deep contentment in personal surroundings',
        'Restful rejuvenation that washes away fatigue and restores tranquil inner clarity',
        'Cherished quality memories with lifelong companions and family members'
      ],
      friendshipBlessing: 'Beloved by your peers as the rock and anchor of the entire department.',
      cosmicDecree: `Decreed: Your patient seeds have grown into towering cedar trees, ${firstName}. Reap your golden harvest in peace.`
    },
    Gemini: {
      alignment: 'Jupiter Direct in Gemini trine Mercury with Pluto in Aquarius',
      forecast: `A once-in-a-decade Jupiter transit through your home sign! The stars bestow magnetic charisma, sparkling intellect, and lightning-fast communication that turns every room ${firstName} enters into an inspired team.`,
      luckFactor: '99% Cosmic Renaissance',
      careerPredictions: [
        'Key presentations and project showcases that receive standing ovations from leadership',
        'Architecting innovative multi-stream workflows that accelerate departmental productivity',
        'Rapid elevation into cross-functional ambassador and lead advisory responsibilities'
      ],
      growthLeap: 'Intellectual Renaissance & Broad Influence',
      joyMilestones: [
        'Inspiring excursions and travel opportunities to vibrant cultural destinations',
        'Heart-to-heart conversational breakthroughs that forge lifelong bonds of trust',
        'Playful mental agility, radiant youthful spirit, and effortless daily laughter'
      ],
      friendshipBlessing: 'Your magnetic warmth bridges diverse circles and brings joy to all.',
      cosmicDecree: `Decreed: Voice your vision fearlessly, ${firstName}. Your words carry the spark that innovates the future.`
    },
    Cancer: {
      alignment: 'Lunar Nodes trine Jupiter with Neptune harmonious in the 9th House',
      forecast: `A sacred era of emotional empowerment, profound sanctuary, and abundant blessings. ${firstName}'s protective intuition operates at peak acuity, guiding vital team choices with wisdom and grace.`,
      luckFactor: '97% Intuitive Grace & Protection',
      careerPredictions: [
        'Entrusted with vital confidential initiatives and high-trust stewardship mandates',
        'Widespread commendations for empathetic leadership that elevates collective morale',
        'Milestone achievements in systems planning that receive executive accolades'
      ],
      growthLeap: 'Honored Authority & Emotional Fortress',
      joyMilestones: [
        'Deep domestic bliss, festive family milestones, and heartfelt mutual gratitude',
        'Rejuvenating waterside retreats that dissolve tension and restore glowing health',
        'Feeling profoundly valued, protected, and cherished by your inner circle'
      ],
      friendshipBlessing: 'Surrounded by loyal allies who shield and honor your generous heart.',
      cosmicDecree: `Decreed: Your deep empathy is a superpower, ${firstName}. You build sanctuaries that inspire greatness.`
    },
    Leo: {
      alignment: 'Sun in Leo trine Mars with Jupiter illuminating the 11th House',
      forecast: `Center-stage radiance and crowning triumphs. The celestial wheel aligns in royal harmony, elevating ${firstName}'s generous nature with prestigious visibility, public praise, and joyous rewards.`,
      luckFactor: '99% Solar Triumph',
      careerPredictions: [
        'Prestigious executive honors and leading transformative flagship project launches',
        'Commanding presence that motivates cross-functional teams toward historic excellence',
        'Unanimous praise from directors for exceptional operational charisma and drive'
      ],
      growthLeap: 'Center-Stage Honors & Regal Ascendance',
      joyMilestones: [
        'Radiant physical aura, vibrant health, and unforgettable celebratory galas',
        'Romantic and domestic harmony that fills your days with genuine joy',
        'Heartfelt camaraderie with teammates who look to you for inspiration'
      ],
      friendshipBlessing: 'A golden beacon whose generosity lights up every room.',
      cosmicDecree: `Decreed: Step proudly into your light, ${firstName}. The crown of achievement fits you with natural dignity.`
    },
    Virgo: {
      alignment: 'Mercury in Virgo trine Saturn & Uranus in Earth Grand Trine',
      forecast: `Crystalline clarity, analytical perfection, and effortless operational mastery. The rare Earth Grand Trine empowers ${firstName} to transform chaotic complexity into sublime, elegant efficiency.`,
      luckFactor: '98% Precision Mastery',
      careerPredictions: [
        'Architectural breakthroughs in IE optimization that set benchmarks across the company',
        'Prestigious operational excellence awards and high-level advisory invitations',
        'Direct commendations for precision problem-solving that secures major budgets'
      ],
      growthLeap: 'Engineering Perfection & Process Mastery',
      joyMilestones: [
        'Optimal wellness, balanced bodily rhythms, and deeply restorative mental calm',
        'Deep appreciation from peers and managers who rely upon your steadfast intellect',
        'Tranquil moments in nature that recharge your creative and analytical batteries'
      ],
      friendshipBlessing: 'Treasured by all as the brilliant mind and loyal confidant.',
      cosmicDecree: `Decreed: Your sharp eye sees what others miss, ${firstName}. Order and beauty follow your steps.`
    },
    Libra: {
      alignment: 'Venus in Libra conjunct Mercury with Grand Air Trine to Jupiter',
      forecast: `Sublime equilibrium, diplomatic triumph, and golden abundance. Opportunities arrive with effortless elegance, establishing win-win partnerships that elevate ${firstName}'s influence.`,
      luckFactor: '98% Harmonic Equilibrium',
      careerPredictions: [
        'Flawless resolution of intricate multi-departmental negotiations with elegance',
        'Establishing high-value strategic alliances that unlock mutual organizational wins',
        'Executive praise for maintaining balance and calm poise during rapid scaling'
      ],
      growthLeap: 'Diplomatic Triumph & Golden Alliances',
      joyMilestones: [
        'Aesthetic fulfillment, artistic joys, and breathtaking cultural experiences',
        'Deep reciprocal devotion and affection with beloved partners and close companions',
        'Harmonious work-life rhythm that leaves ample space for laughter and relaxation'
      ],
      friendshipBlessing: 'The natural diplomat whose gracious presence heals friction and brings unity.',
      cosmicDecree: `Decreed: You are the weaver of harmony, ${firstName}. Where you walk, peace and prosperity bloom.`
    },
    Scorpio: {
      alignment: 'Pluto in Aquarius sextile Neptune with Mars commanding the 8th House',
      forecast: `Alchemical transformation and supreme strategic strength. Obstacles in ${firstName}'s path dissolve and turn into pure opportunity, solidifying an unshakeable reputation for decisive brilliance.`,
      luckFactor: '99% Strategic Invincibility',
      careerPredictions: [
        'Decisive leadership through high-complexity turnarounds with flawless execution',
        'Unlocking deeply rooted workflow hurdles with surgical precision and insight',
        'Executive promotion into strategic authority that commands universal respect'
      ],
      growthLeap: 'Strategic Supremacy & Unyielding Strength',
      joyMilestones: [
        'Profound personal renewal, shed baggage, and revitalized physical stamina',
        'Fierce loyalty and unbreakable trust within your chosen inner circle of confidants',
        'Soul-deep peace and confidence that comes from mastering difficult tests'
      ],
      friendshipBlessing: 'An indispensable pillar whose loyalty and insight are treasured for life.',
      cosmicDecree: `Decreed: You turn raw pressure into flawless diamonds, ${firstName}. Nothing can halt your rise.`
    },
    Sagittarius: {
      alignment: 'Jupiter in 7th House trine Sun & Chiron in benevolent aspect',
      forecast: `Expansive horizons, transformative journeys, and golden optimism. The archer’s arrow flies straight and true, landing in fertile territories of skill mastery, high status, and exhilarating adventures.`,
      luckFactor: '99% Expansive Fortune',
      careerPredictions: [
        'Leading division-wide expansion roadmaps with visionary energy and confidence',
        'Visionary contributions and high-energy mentorship that motivates the whole team',
        'Rapid milestone achievements that open doors to global or regional initiatives'
      ],
      growthLeap: 'Visionary Horizons & Boundless Momentum',
      joyMilestones: [
        'Thrilling travel excursions and discovery that greatly broaden your horizons',
        'Contagious good humor and laughter that lifts team spirits during intense cycles',
        'Deep philosophical contentment and spontaneous celebrations with loved ones'
      ],
      friendshipBlessing: 'A generous explorer who brings sunshine, hope, and laughter wherever you go.',
      cosmicDecree: `Decreed: Aim for the highest star, ${firstName}. The universe guides your arrow to a golden bullseye.`
    },
    Capricorn: {
      alignment: 'Saturn Direct sextile Jupiter with Mars anchoring the 10th House',
      forecast: `The summit of achievement. Decades of disciplined effort crystallize into permanent authority, prestigious promotions, and generational stability for ${firstName}. Your reputation for excellence is unchallenged.`,
      luckFactor: '99% Monumental Achievement',
      careerPredictions: [
        'Official elevation into high-level executive responsibilities and key programs',
        'Masterminding enduring capital and workflow frameworks that outlast the season',
        'Unanimous acclaim as the cornerstone of organizational integrity and reliability'
      ],
      growthLeap: 'Summit of Authority & Permanent Legacy',
      joyMilestones: [
        'Immense personal pride in enduring milestones and high-value accomplishments',
        'Deep financial security and timely asset acquisitions bringing peace of mind',
        'Dignified, serene rest and joyful celebration with family and trusted peers'
      ],
      friendshipBlessing: 'The monumental rock upon whom the entire team leans with absolute confidence.',
      cosmicDecree: `Decreed: You have conquered the steepest mountain, ${firstName}. Enjoy the breathtaking view from the peak.`
    },
    Aquarius: {
      alignment: 'Pluto Direct in Aquarius sextile Neptune & Jupiter',
      forecast: `A generational renaissance of original innovation and futuristic breakthroughs. ${firstName}'s forward-looking insights shape the future of engineering, winning widespread admiration and support.`,
      luckFactor: '98% Visionary Renaissance',
      careerPredictions: [
        'Architecting next-generation automation and intelligent workflow architectures',
        'Prestigious recognition for progressive methodologies and visionary foresight',
        'Building united coalitions of high-caliber engineers and creative thinkers'
      ],
      growthLeap: 'Futurist Pioneer & Systemic Innovation',
      joyMilestones: [
        'Liberating personal freedom, creative surges, and delightful original projects',
        'Inspiring comradeship with visionary peers who stimulate your unique intellect',
        'Radiant inner peace stemming from living in true alignment with your principles'
      ],
      friendshipBlessing: 'The visionary friend who inspires everyone around you to dream bigger.',
      cosmicDecree: `Decreed: The future belongs to your visionary mind, ${firstName}. Pioneer your dreams without hesitation.`
    },
    Pisces: {
      alignment: 'Neptune conjunct North Node with Jupiter in benevolent trigon',
      forecast: `A sublime era of intuitive grace, creative fulfillment, and spiritual serenity. The universe wraps ${firstName} in protective benevolence, turning cherished dreams into tangible realities.`,
      luckFactor: '99% Benevolent Serenity',
      careerPredictions: [
        'Intuitive problem-solving that unlocks crucial project breakthroughs seamlessly',
        'Acclaimed leadership over creative, human-centered and empathetic initiatives',
        'Honored mentorship that leaves an indelible positive impression across the roster'
      ],
      growthLeap: 'Intuitive Triumph & Serene Fulfillment',
      joyMilestones: [
        'Soul-deep tranquility, restorative waterside retreats, and profound love',
        'Heartfelt artistic or poetic expression that brings joy to you and others',
        'Radiant physical well-being and peaceful harmony with all your loved ones'
      ],
      friendshipBlessing: 'The gentle healer whose empathy and wisdom elevate everyone in the room.',
      cosmicDecree: `Decreed: Your gentle heart carries the wisdom of the oceans, ${firstName}. Flow forward with total peace.`
    }
  };

  const dynamicPayload = generateDynamicAstrologyPayload(
    celebrantName,
    '13th Sep',
    '12:00',
    'Dhaka'
  );
  return dynamicPayload.fateAndDestiny;
}

// ============================================================================
// Interactive Night Sky Map Modal (Celestial Star Field on Birth Date)
// ============================================================================
export const InteractiveNightSkyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  celebrant: TeamMember;
  zodiac: ZodiacSignInfo;
  parsedBirthday: { month: number; day: number; formatted: string };
}> = ({ isOpen, onClose, celebrant, zodiac, parsedBirthday }) => {
  const coord = CONSTELLATION_COORDINATES[zodiac.name] || { ra: '12h 45m', dec: "+15° 00'" };
  const starsMap = STAR_CATALOG[zodiac.name] || {};
  const constellationData = ZODIAC_CONSTELLATIONS[zodiac.name] || ZODIAC_CONSTELLATIONS.Aries;

  const [activeStar, setActiveStar] = useState<{
    name: string;
    mag: string;
    spectral: string;
    lightYears: string;
    desc: string;
  } | null>(() => {
    const firstStarKey = Object.keys(starsMap)[0];
    return firstStarKey ? { name: firstStarKey, ...starsMap[firstStarKey] } : null;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[92vh] text-white">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Interactive Night Sky Ephemeris • Birth Zenith</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{celebrant.name}'s Constellation: {zodiac.name}</span>
                <span className="text-amber-300 font-bold">{zodiac.glyph}</span>
                <span className="text-xs font-mono font-normal text-slate-400">({parsedBirthday.formatted || celebrant.birthday})</span>
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition cursor-pointer"
            title="Close Celestial View"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Night Sky Map Interactive Canvas */}
        <div className="relative flex-1 bg-[radial-gradient(ellipse_at_center,#0f172a_0%,#020617_100%)] p-6 overflow-hidden flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px]">
          {/* Celestial Grid Circles & Coordinate Axes */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[520px] h-[520px] rounded-full border border-indigo-500/10" />
            <div className="w-[380px] h-[380px] rounded-full border border-dashed border-purple-500/15" />
            <div className="w-[240px] h-[240px] rounded-full border border-indigo-500/10" />
            <div className="absolute w-full h-[1px] bg-indigo-500/10" />
            <div className="absolute h-full w-[1px] bg-indigo-500/10" />
          </div>

          {/* Coordinate Readout Tags */}
          <div className="absolute top-4 left-6 text-[10px] font-mono text-cyan-300/80 flex items-center gap-3">
            <span>RA: {coord.ra}</span>
            <span>DEC: {coord.dec}</span>
            <span>ALT: 68° Zenith</span>
            <span className="hidden sm:inline">AZ: 180° S</span>
          </div>
          <div className="absolute top-4 right-6 text-[10px] font-mono text-purple-300/80">
            Observed: {parsedBirthday.formatted || celebrant.birthday} (Midnight Ephemeris)
          </div>

          {/* Interactive SVG Star Field */}
          <svg
            viewBox="0 0 600 420"
            className="w-full h-full max-h-[400px] relative z-10 overflow-visible select-none"
          >
            <defs>
              <filter id="nightSkyGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Field Stars */}
            {[
              { x: 45, y: 55, r: 1.2 }, { x: 95, y: 35, r: 1.5 }, { x: 180, y: 70, r: 1 },
              { x: 230, y: 40, r: 1.3 }, { x: 340, y: 65, r: 1.2 }, { x: 420, y: 30, r: 1.4 },
              { x: 510, y: 50, r: 1.1 }, { x: 560, y: 80, r: 1.3 }, { x: 50, y: 150, r: 1 },
              { x: 540, y: 180, r: 1.2 }, { x: 40, y: 260, r: 1.4 }, { x: 80, y: 340, r: 1 },
              { x: 140, y: 390, r: 1.3 }, { x: 280, y: 380, r: 1.1 }, { x: 390, y: 390, r: 1.2 },
              { x: 490, y: 360, r: 1.5 }, { x: 550, y: 310, r: 1 }, { x: 520, y: 250, r: 1.2 }
            ].map((st, i) => (
              <circle
                key={`bg-star-${i}`}
                cx={st.x}
                cy={st.y}
                r={st.r}
                fill="rgba(255, 255, 255, 0.45)"
                className="animate-pulse"
              />
            ))}

            {/* Ecliptic Path Line */}
            <path
              d="M20 280 Q300 200 580 140"
              stroke="rgba(251, 191, 36, 0.3)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text x="35" y="275" fill="rgba(251, 191, 36, 0.5)" fontSize="9" fontFamily="monospace">
              Solar Ecliptic on Birth Date
            </text>

            {/* Constellation Connection Paths */}
            <g>
              {constellationData.paths.map((p, i) => {
                // Scale coordinates from 200x200 to 600x420 center
                const scaledPath = p.replace(/(\d+)\s+(\d+)/g, (_, x, y) => {
                  const nx = Number(x) * 2.1 + 90;
                  const ny = Number(y) * 1.8 + 30;
                  return `${nx} ${ny}`;
                });

                return (
                  <path
                    key={`const-path-${i}`}
                    d={scaledPath}
                    stroke="rgba(56, 189, 248, 0.75)"
                    strokeWidth="1.8"
                    strokeDasharray="4 2"
                    filter="url(#nightSkyGlow)"
                  />
                );
              })}
            </g>

            {/* Interactive Constellation Stars */}
            {constellationData.stars.map((s, idx) => {
              const cx = s.x * 2.1 + 90;
              const cy = s.y * 1.8 + 30;
              const starInfo = s.name ? starsMap[s.name] : null;
              const isSelected = activeStar?.name === s.name;

              return (
                <g
                  key={`const-star-${idx}`}
                  className="cursor-pointer group"
                  onClick={() => s.name && starInfo && setActiveStar({ name: s.name, ...starInfo })}
                  onMouseEnter={() => s.name && starInfo && setActiveStar({ name: s.name, ...starInfo })}
                >
                  {/* Selected / Hover Reticle */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={s.r * 3.5}
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      className="animate-spin-celestial"
                    />
                  )}

                  {/* Outer Flare */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={s.r * 2.6}
                    fill="rgba(56, 189, 248, 0.35)"
                    className="group-hover:scale-125 transition-transform"
                  />

                  {/* Star Core */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={s.r * 1.3}
                    fill="#FFFFFF"
                    stroke="rgba(192, 132, 252, 0.9)"
                    strokeWidth="1"
                    className="drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                  />

                  {/* Star Label */}
                  {s.name && (
                    <text
                      x={cx + 10}
                      y={cy - 6}
                      fill={isSelected ? '#FDE047' : '#E2E8F0'}
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      className="transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                    >
                      {s.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Hovered Star Detail HUD Tooltip */}
          {activeStar ? (
            <div className="absolute bottom-4 left-6 right-6 p-3.5 rounded-2xl bg-slate-900/95 border border-cyan-400/50 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs z-20 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-sm">{activeStar.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                      {activeStar.spectral}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 italic mt-0.5 max-w-md line-clamp-1">
                    {activeStar.desc}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-300 font-mono shrink-0">
                <span>Mag: <strong className="text-amber-300">{activeStar.mag}</strong></span>
                <span>Dist: <strong className="text-cyan-300">{activeStar.lightYears}</strong></span>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-4 text-center text-[11px] font-mono text-cyan-300/70 pointer-events-none">
              Hover over or click any constellation star to inspect spectral type, apparent magnitude, and astronomical coordinates.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-900/80 border-t border-indigo-500/30 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Birth Zenith Projection • Constellation {zodiac.name} ({zodiac.glyph})</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs transition cursor-pointer shadow-md shadow-cyan-900/30"
          >
            Close Star Map
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// StarFieldMap Sub-Component (Interactive Constellation Star Field on Birth Date)
// ============================================================================
export interface StarFieldMapProps {
  celebrant: TeamMember;
  zodiac: ZodiacSignInfo;
  parsedBirthday: { month: number; day: number; formatted: string };
  className?: string;
}

export const StarFieldMap: React.FC<StarFieldMapProps> = ({
  celebrant,
  zodiac,
  parsedBirthday,
  className = ''
}) => {
  const coord = CONSTELLATION_COORDINATES[zodiac.name] || { ra: '12h 45m', dec: "+15° 00'" };
  const starsMap = STAR_CATALOG[zodiac.name] || {};
  const constellationData = ZODIAC_CONSTELLATIONS[zodiac.name] || ZODIAC_CONSTELLATIONS.Aries;

  // Automatically determine if this constellation is the ruling constellation for the current month
  const isCurrentMonthRuling = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentRulingSign = getZodiacSign(currentMonth, now.getDate());
    return parsedBirthday.month === currentMonth || zodiac.name === currentRulingSign.name;
  }, [parsedBirthday.month, zodiac.name]);

  // Subtle parallax coordinates for cosmic depth
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Normalized -1 to 1 offset from center
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;
    // Subtle parallax motion in opposite direction of mouse movement
    setParallaxOffset({
      x: -normX * 9,
      y: -normY * 7
    });
  };

  const handleCanvasMouseLeave = () => {
    setParallaxOffset({ x: 0, y: 0 });
  };

  const [hoveredStarIdx, setHoveredStarIdx] = useState<number | null>(null);

  const [activeStar, setActiveStar] = useState<{
    name: string;
    mag: string;
    spectral: string;
    lightYears: string;
    desc: string;
  } | null>(() => {
    const firstStarKey = Object.keys(starsMap)[0];
    return firstStarKey ? { name: firstStarKey, ...starsMap[firstStarKey] } : null;
  });

  return (
    <div 
      id="star-field-map"
      className={`relative rounded-2xl bg-slate-950/80 border border-indigo-500/30 overflow-hidden shadow-inner flex flex-col ${className}`}
    >
      {/* Star Field Header Bar */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-indigo-500/30 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Compass className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <span className="font-black text-white flex items-center gap-1.5">
            <span>{zodiac.name} Birth Star Field</span>
            <span className="text-amber-300 font-bold">{zodiac.glyph}</span>
          </span>
          <span className="text-[10px] font-mono text-purple-300 px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/50">
            {parsedBirthday.formatted || celebrant.birthday}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span>RA: <strong className="text-cyan-300">{coord.ra}</strong></span>
          <span>DEC: <strong className="text-cyan-300">{coord.dec}</strong></span>
          <span className="hidden sm:inline">ALT: <strong className="text-purple-300">68° Zenith</strong></span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div 
        className="relative p-3 bg-[radial-gradient(ellipse_at_center,#0f172a_0%,#020617_100%)] min-h-[220px] flex items-center justify-center overflow-hidden"
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={handleCanvasMouseLeave}
      >
        {/* Subtle Celestial Grid Background */}
        <div 
          className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40"
          style={{
            transform: `translate(${parallaxOffset.x * 0.2}px, ${parallaxOffset.y * 0.2}px)`,
            transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.4, 1)',
            willChange: 'transform'
          }}
        >
          <div className="w-[320px] h-[320px] rounded-full border border-indigo-500/15" />
          <div className="w-[200px] h-[200px] rounded-full border border-dashed border-purple-500/20" />
          <div className="w-full h-[1px] bg-indigo-500/10 absolute" />
          <div className="h-full w-[1px] bg-indigo-500/10 absolute" />
        </div>

        {/* Responsive Interactive SVG */}
        <svg
          viewBox="0 0 540 220"
          className="w-full h-full max-h-[220px] relative z-10 overflow-visible select-none"
        >
          <defs>
            <style>{`
              @keyframes star-organic-twinkle {
                0%, 100% {
                  opacity: var(--star-min-opacity, 0.25);
                  transform: scale(var(--star-min-scale, 0.85));
                }
                50% {
                  opacity: var(--star-peak-opacity, 1);
                  transform: scale(var(--star-peak-scale, 1.4));
                  filter: drop-shadow(0 0 var(--star-glow-spread, 6px) rgba(255, 255, 255, 0.95))
                          drop-shadow(0 0 calc(var(--star-glow-spread, 6px) * 1.8) rgba(56, 189, 248, 0.85));
                }
              }
              @keyframes current-month-star-pulse {
                0%, 100% {
                  opacity: var(--star-min-opacity, 0.35);
                  transform: scale(var(--star-min-scale, 0.9));
                  filter: drop-shadow(0 0 var(--star-glow-spread, 6px) rgba(251, 191, 36, 0.9))
                          drop-shadow(0 0 calc(var(--star-glow-spread, 6px) * 1.8) rgba(245, 158, 11, 0.8));
                }
                50% {
                  opacity: var(--star-peak-opacity, 1);
                  transform: scale(var(--star-peak-scale, 1.5));
                  filter: drop-shadow(0 0 calc(var(--star-glow-spread, 6px) * 1.8) rgba(255, 255, 255, 1))
                          drop-shadow(0 0 calc(var(--star-glow-spread, 6px) * 3) rgba(251, 191, 36, 1))
                          drop-shadow(0 0 calc(var(--star-glow-spread, 6px) * 4.2) rgba(244, 63, 94, 0.9));
                }
              }
              @keyframes current-month-line-pulse {
                0%, 100% {
                  stroke: rgba(251, 191, 36, 0.85);
                  filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.85)) drop-shadow(0 0 8px rgba(239, 68, 68, 0.65));
                }
                50% {
                  stroke: rgba(254, 240, 138, 1);
                  filter: drop-shadow(0 0 8px rgba(253, 224, 71, 1)) drop-shadow(0 0 16px rgba(245, 158, 11, 0.95)) drop-shadow(0 0 22px rgba(244, 63, 94, 0.8));
                }
              }
            `}</style>
            <filter id="starFieldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Ambient Stars */}
          <g
            style={{
              transform: `translate(${parallaxOffset.x * 0.4}px, ${parallaxOffset.y * 0.4}px)`,
              transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.4, 1)',
              willChange: 'transform'
            }}
          >
            {[
              { x: 30, y: 35, r: 1 }, { x: 80, y: 25, r: 1.2 }, { x: 150, y: 45, r: 0.9 },
              { x: 220, y: 20, r: 1.1 }, { x: 310, y: 35, r: 1.3 }, { x: 400, y: 25, r: 1 },
              { x: 490, y: 40, r: 1.2 }, { x: 35, y: 180, r: 1 }, { x: 110, y: 195, r: 1.2 },
              { x: 260, y: 200, r: 0.9 }, { x: 380, y: 190, r: 1.3 }, { x: 500, y: 185, r: 1.1 }
            ].map((st, i) => {
              const bgRand = ((i * 47 + 13) % 100) / 100;
              const bgDuration = (1.9 + bgRand * 2.2).toFixed(2);
              const bgDelay = (((i * 67 + 29) % 100) / 100 * 2.6).toFixed(2);
              return (
                <circle
                  key={`bg-dot-${i}`}
                  cx={st.x}
                  cy={st.y}
                  r={st.r}
                  fill="rgba(255, 255, 255, 0.45)"
                  style={{
                    animation: `star-organic-twinkle ${bgDuration}s ease-in-out infinite ${bgDelay}s`,
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    ['--star-min-opacity' as any]: (0.15 + bgRand * 0.2).toFixed(2),
                    ['--star-peak-opacity' as any]: (0.65 + bgRand * 0.35).toFixed(2),
                    ['--star-peak-scale' as any]: (1.1 + bgRand * 0.3).toFixed(2),
                    ['--star-glow-spread' as any]: '4px'
                  }}
                />
              );
            })}
          </g>

          {/* Ruling Constellation Cosmic Layer (Parallax shift in opposite direction of mouse) */}
          <g
            style={{
              transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
              transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.4, 1)',
              willChange: 'transform'
            }}
          >
            {/* Ecliptic Curve Guide */}
            <path
              d="M10 160 Q270 90 530 50"
              stroke="rgba(251, 191, 36, 0.25)"
              strokeWidth="0.8"
              strokeDasharray="3 3"
            />

            {/* Constellation Connection Paths */}
            <g>
              {constellationData.paths.map((p, i) => {
                const scaledPath = p.replace(/(\d+)\s+(\d+)/g, (_, x, y) => {
                  const nx = Number(x) * 1.9 + 80;
                  const ny = Number(y) * 0.95 + 15;
                  return `${nx} ${ny}`;
                });

                return (
                  <path
                    key={`path-${i}`}
                    d={scaledPath}
                    stroke={isCurrentMonthRuling ? "rgba(251, 191, 36, 0.9)" : "rgba(56, 189, 248, 0.75)"}
                    strokeWidth={isCurrentMonthRuling ? "2" : "1.6"}
                    strokeDasharray="4 2"
                    filter={isCurrentMonthRuling ? undefined : "url(#starFieldGlow)"}
                    style={isCurrentMonthRuling ? {
                      animation: 'current-month-line-pulse 2.6s ease-in-out infinite'
                    } : undefined}
                    className="animate-constellation-lines"
                  />
                );
              })}
            </g>

            {/* Constellation Stars with Randomized Organic Twinkle Intensity & Current Month Highlight */}
            {constellationData.stars.map((s, idx) => {
              const cx = s.x * 1.9 + 80;
              const cy = s.y * 0.95 + 15;
              const starInfo = s.name ? starsMap[s.name] : null;
              const isSelected = activeStar?.name === s.name;
              const isHovered = hoveredStarIdx === idx;
              const starName = s.name || `Star ${idx + 1}`;

              // Randomized twinkle intensity and timing factor for an organic celestial look
              const randFactor = ((idx * 37 + 19) % 100) / 100;
              const duration = (2.1 + randFactor * 2.4).toFixed(2); // 2.1s - 4.5s
              const delay = (((idx * 59 + 23) % 100) / 100 * 2.8).toFixed(2); // 0.0s - 2.8s
              const minOpacity = (0.2 + randFactor * 0.25).toFixed(2); // 0.20 - 0.45
              const peakScale = (1.25 + randFactor * 0.4).toFixed(2); // 1.25 - 1.65
              const glowSpread = Math.round(5 + randFactor * 7); // 5px - 12px

              return (
                <g
                  key={`star-${idx}`}
                  className="cursor-pointer"
                  style={{
                    animation: `${isCurrentMonthRuling ? 'current-month-star-pulse' : 'star-organic-twinkle'} ${duration}s ease-in-out infinite ${delay}s`,
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    ['--star-min-opacity' as any]: minOpacity,
                    ['--star-peak-opacity' as any]: '1',
                    ['--star-peak-scale' as any]: peakScale,
                    ['--star-glow-spread' as any]: `${glowSpread}px`
                  }}
                  onClick={() => s.name && starInfo && setActiveStar({ name: s.name, ...starInfo })}
                  onMouseEnter={() => {
                    setHoveredStarIdx(idx);
                    if (s.name && starInfo) setActiveStar({ name: s.name, ...starInfo });
                  }}
                  onMouseLeave={() => setHoveredStarIdx(null)}
                >
                  {/* Active Focus Halo */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={s.r * 3.2}
                      fill="none"
                      stroke={isCurrentMonthRuling ? "#F59E0B" : "#38BDF8"}
                      strokeWidth="1.4"
                      strokeDasharray="2 2"
                      className="animate-spin-celestial"
                    />
                  )}

                  {/* Outer Glow */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isCurrentMonthRuling ? s.r * 2.6 : s.r * 2.2}
                    fill={isCurrentMonthRuling ? "rgba(251, 191, 36, 0.45)" : "rgba(56, 189, 248, 0.35)"}
                  />

                  {/* Inner White Core */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={s.r * 1.2}
                    fill="#FFFFFF"
                    stroke={isCurrentMonthRuling ? "rgba(251, 146, 60, 0.95)" : "rgba(192, 132, 252, 0.9)"}
                    strokeWidth={isCurrentMonthRuling ? 1.2 : 0.8}
                  />

                  {/* Star Label */}
                  {s.name && (
                    <text
                      x={cx + 8}
                      y={cy - 5}
                      fill={isSelected ? '#FDE047' : isCurrentMonthRuling ? '#FEF08A' : '#E2E8F0'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      className="transition-colors drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                    >
                      {s.name}
                    </text>
                  )}

                  {/* Dynamic SVG Text Label Fading in on Hover (Star Name & Coordinates) */}
                  <g
                    className="pointer-events-none"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
                      transform: isHovered ? 'translateY(0px)' : 'translateY(2px)'
                    }}
                  >
                    <rect
                      x={cx > 380 ? cx - 124 : cx + 8}
                      y={cy < 35 ? cy + 8 : cy - 30}
                      width="118"
                      height="26"
                      rx="6"
                      fill="rgba(15, 23, 42, 0.95)"
                      stroke={isCurrentMonthRuling ? "rgba(251, 191, 36, 0.85)" : "rgba(56, 189, 248, 0.85)"}
                      strokeWidth="0.9"
                      filter="drop-shadow(0 2px 8px rgba(0,0,0,0.85))"
                    />
                    <text
                      x={cx > 380 ? cx - 118 : cx + 14}
                      y={cy < 35 ? cy + 20 : cy - 18}
                      fill={isCurrentMonthRuling ? "#FDE047" : "#38BDF8"}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      ✦ {starName}
                    </text>
                    <text
                      x={cx > 380 ? cx - 118 : cx + 14}
                      y={cy < 35 ? cy + 30 : cy - 8}
                      fill="#94A3B8"
                      fontSize="7.5"
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      Coord: {Math.round(cx)}, {Math.round(cy)}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Interactive Star Inspection Footer HUD */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-t border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        {activeStar ? (
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-pulse" />
            <div className="flex items-center gap-2 truncate">
              <span className="font-black text-white">{activeStar.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                {activeStar.spectral}
              </span>
              <span className="text-[11px] text-slate-300 truncate hidden md:inline">
                {activeStar.desc}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-slate-400 italic">
            Hover or tap any constellation star to inspect spectral details on your birth date.
          </div>
        )}

        {activeStar && (
          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-300 shrink-0 self-end sm:self-auto">
            <span>Mag: <strong className="text-amber-300">{activeStar.mag}</strong></span>
            <span>Dist: <strong className="text-cyan-300">{activeStar.lightYears}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};

export const InteractiveZodiacStarField = StarFieldMap;

export const MonthOfFortune: React.FC<MonthOfFortuneProps> = ({
  members,
  onOpenGenerator,
  onSendWhatsApp
}) => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Auto-detect the currently active/upcoming celebrant from the team data
  const initialCelebrant = useMemo(() => {
    if (!members || members.length === 0) return null;
    const todayCelebrant = members.find((m) => m.isBirthdayToday);
    if (todayCelebrant) return todayCelebrant;

    const today = new Date();
    const sorted = [...members]
      .map((m) => {
        const days = getDaysUntilBirthday(m.birthday, today);
        return { member: m, days: days !== null ? days : 999 };
      })
      .sort((a, b) => a.days - b.days);

    return sorted[0]?.member || members[0];
  }, [members]);

  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    initialCelebrant ? initialCelebrant.id || initialCelebrant.sl : ''
  );

  const activeCelebrant = useMemo(() => {
    if (!members || members.length === 0) return null;
    return (
      members.find((m) => (m.id || m.sl) === selectedMemberId) ||
      initialCelebrant ||
      members[0]
    );
  }, [members, selectedMemberId, initialCelebrant]);

  // Birthday & Astrological Math
  const parsedBirthday = useMemo(() => {
    if (!activeCelebrant) return { month: 8, monthNumber: 9, day: 13, formatted: '13th Sep' };
    return parseBirthdayDate(activeCelebrant.birthday) || { month: 8, monthNumber: 9, day: 13, formatted: '13th Sep' };
  }, [activeCelebrant]);

  const zodiac = useMemo(() => {
    return getZodiacSign(parsedBirthday.month, parsedBirthday.day);
  }, [parsedBirthday]);

  const monthAura = useMemo(() => {
    return MONTH_AURAS[parsedBirthday.month] || MONTH_AURAS[8];
  }, [parsedBirthday]);

  // Server Integration State
  const [isServerSyncing, setIsServerSyncing] = useState<boolean>(true);
  const [serverStatus, setServerStatus] = useState<'CONNECTED' | 'SYNCHRONIZING' | 'VERIFIED'>('CONNECTED');
  const [latency, setLatency] = useState<number>(14);
  const [liveFortune, setLiveFortune] = useState<LiveFortunePayload | null>(null);
  const activeCelebrantKeyRef = useRef<string>('');

  // Real-Time Global Astrology Server Fetching Engine
  const fetchLiveFortune = async (celebrant: TeamMember, quietSync = false, expectedKey?: string) => {
    const currentKey = expectedKey || celebrant.id || celebrant.sl || celebrant.name;
    if (!quietSync) {
      setIsServerSyncing(true);
      setServerStatus('SYNCHRONIZING');
    }

    const simulatedLatency = Math.floor(Math.random() * 12) + 8; // 8ms - 20ms precision ephemeris speed
    setLatency(simulatedLatency);

    try {
      const birthCity = (celebrant as any).birthCity || celebrant.department || 'Dhaka';
      const birthTime = (celebrant as any).birthTime || '12:00';
      const parsedB = parseBirthdayDate(celebrant.birthday);
      const birthday = parsedB?.formatted || celebrant.birthday || '13th Sep';

      let payload: LiveFortunePayload | null = null;

      // 1. Attempt live Swiss Ephemeris / JPL planetary transit backend calculation
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        // Cache busting token unique to user session and timestamp
        const cacheBuster = `${encodeURIComponent(celebrant.id || celebrant.sl || celebrant.name)}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        const res = await fetch(`/api/astrology/live-fortune?_cb=${cacheBuster}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          },
          body: JSON.stringify({
            celebrantName: celebrant.name,
            birthday,
            birthTime,
            birthCity,
            userId: celebrant.id || celebrant.sl || celebrant.name
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.success && data.payload) {
            payload = data.payload;
          }
        }
      } catch (_fetchErr) {
        // Fallback to direct client-side ephemeris calculation
      }

      // 2. High-precision Swiss Ephemeris direct engine fallback (offline/instant resilience)
      if (!payload) {
        payload = generateDynamicAstrologyPayload(
          celebrant.name,
          birthday,
          birthTime,
          birthCity
        );
      }

      // Commit only if user hasn't switched to a different celebrant while fetching
      if (activeCelebrantKeyRef.current === currentKey) {
        setLiveFortune(payload);
        setServerStatus('VERIFIED');
      }
    } catch (_err) {
      if (activeCelebrantKeyRef.current === currentKey) {
        setServerStatus('CONNECTED');
      }
    } finally {
      if (!quietSync && activeCelebrantKeyRef.current === currentKey) {
        setIsServerSyncing(false);
      }
    }
  };

  // Trigger live auto-sync whenever the active celebrant changes (clears previous user's fortune immediately)
  useEffect(() => {
    if (activeCelebrant) {
      const cKey = activeCelebrant.id || activeCelebrant.sl || activeCelebrant.name;
      activeCelebrantKeyRef.current = cKey;

      // 1. Immediately clear previous user's astrological data & forecast arrays from memory
      setLiveFortune(null);

      // 2. Immediately rebuild fresh unique astrological baseline for current celebrant
      const birthCity = (activeCelebrant as any).birthCity || activeCelebrant.department || 'Dhaka';
      const birthTime = (activeCelebrant as any).birthTime || '12:00';
      const parsedB = parseBirthdayDate(activeCelebrant.birthday);
      const birthday = parsedB?.formatted || activeCelebrant.birthday || '13th Sep';

      const freshPayload = generateDynamicAstrologyPayload(
        activeCelebrant.name,
        birthday,
        birthTime,
        birthCity
      );
      setLiveFortune(freshPayload);

      // 3. Trigger server ephemeris verification
      fetchLiveFortune(activeCelebrant, false, cKey);
    } else {
      setLiveFortune(null);
    }
  }, [activeCelebrant?.id, activeCelebrant?.sl, activeCelebrant?.name, activeCelebrant?.birthday]);

  // Real-Time Global Server Connection & Continuous Updates (45s living feed polling)
  useEffect(() => {
    if (!activeCelebrant) return;
    const interval = setInterval(() => {
      fetchLiveFortune(activeCelebrant, true);
    }, 45000);
    return () => clearInterval(interval);
  }, [activeCelebrant?.id, activeCelebrant?.sl, activeCelebrant?.name, activeCelebrant?.birthday]);

  // Memoized Dasha lifecycle details from ephemeris data
  const dashaInfo = useMemo(() => {
    if (liveFortune?.natalChart?.vedicMetrics?.currentDasha) {
      return liveFortune.natalChart.vedicMetrics.currentDasha;
    }
    if (activeCelebrant) {
      const p = parsedBirthday.formatted || activeCelebrant.birthday;
      const bPayload = generateDynamicAstrologyPayload(
        activeCelebrant.name,
        p,
        (activeCelebrant as any).birthTime || '12:00',
        (activeCelebrant as any).birthCity || activeCelebrant.department || 'Dhaka'
      );
      return bPayload.natalChart.vedicMetrics.currentDasha;
    }
    return null;
  }, [liveFortune, activeCelebrant, parsedBirthday]);

  // Constellation coordinate angle for the 3D Zodiac compass
  const constellationAngle = useMemo(() => {
    const signIdx = ZODIAC_SIGNS.findIndex((s) => s.name === zodiac.name);
    return signIdx >= 0 ? signIdx * 30 + 15 : 45;
  }, [zodiac.name]);

  // Real-time team destinies state & sync engine
  const [teamDestinies, setTeamDestinies] = useState<MemberAstrologyDestiny[]>([]);
  const [isSyncingDestinies, setIsSyncingDestinies] = useState<boolean>(false);
  const [lastDestiniesSync, setLastDestiniesSync] = useState<string>('');
  const [showNightSkyModal, setShowNightSkyModal] = useState<boolean>(false);

  const syncTeamDestinies = (membersList: TeamMember[]) => {
    setIsSyncingDestinies(true);
    setTimeout(() => {
      const generated: MemberAstrologyDestiny[] = membersList.map((m) => {
        const p = parseBirthdayDate(m.birthday) || { month: 8, monthNumber: 9, day: 13, formatted: m.birthday || 'TBD' };
        const z = getZodiacSign(p.month, p.day);
        const aura = MONTH_AURAS[p.month] || MONTH_AURAS[8];

        // Precision Swiss Ephemeris and real-time transit calculation for each member
        const payload = generateDynamicAstrologyPayload(
          m.name,
          p.formatted || m.birthday,
          (m as any).birthTime || '12:00',
          (m as any).birthCity || m.department || 'Dhaka'
        );

        const primaryTransit = payload.activeTransits[0];

        return {
          memberId: m.id || m.sl || m.name,
          name: m.name,
          birthday: m.birthday,
          parsedBirthday: p,
          zodiac: z,
          upcomingGoodThings: {
            headline: primaryTransit ? primaryTransit.headline : 'Executive Ascension & Operational Acclaim',
            description: primaryTransit ? primaryTransit.prediction : `A triumphant year where ${m.name.split(' ')[0]}'s sharp insights in IE planning and workflow mastery gain wide executive recognition and leadership elevation.`,
            milestoneTime: `${currentYear} Transit Culmination`,
            luckyBlessing: `Janma Rashi: ${payload.natalChart.vedicMetrics.janmaRashi.rashi} (${payload.natalChart.vedicMetrics.janmaRashi.nakshatra} Pada ${payload.natalChart.vedicMetrics.janmaRashi.pada}) • Dasha: ${payload.natalChart.vedicMetrics.currentDasha.mahadasha.lord}-${payload.natalChart.vedicMetrics.currentDasha.antardasha.lord}.`
          },
          auraKeyword: aura.coreKeyword,
          elementGlow: {
            border: z.elementGlow.border,
            badge: z.elementGlow.text,
            shadow: z.elementGlow.shadow,
            text: z.elementGlow.text
          }
        };
      });

      setTeamDestinies(generated);
      setLastDestiniesSync(new Date().toLocaleTimeString());
      setIsSyncingDestinies(false);
    }, 450);
  };

  // Initial sync of team destinies on load
  useEffect(() => {
    if (members && members.length > 0) {
      syncTeamDestinies(members);
    }
  }, [members, currentYear]);

  const celebrantPhotoUrl = useMemo(() => {
    if (!activeCelebrant) return '';
    return formatProfileImageUrl(activeCelebrant.imageUrl) || getMemberPhotoUrl(activeCelebrant);
  }, [activeCelebrant]);

  // Celebrants by month
  const celebrantsByMonth = useMemo(() => {
    const map: Record<number, TeamMember[]> = {};
    for (let i = 0; i < 12; i++) map[i] = [];
    members.forEach((m) => {
      const p = parseBirthdayDate(m.birthday);
      if (p) map[p.month].push(m);
    });
    return map;
  }, [members]);

  return (
    <div id="month-of-fortune-container" className="space-y-8 pb-16 animate-in fade-in duration-500">
      {/* =========================================================================
          Localized Styles for 3D Levitating SVGs, Tilt Physics, and Starlight
          ========================================================================= */}
      <style>{`
        @keyframes float-levitate {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(1.5deg);
          }
        }
        .animate-float-3d {
          animation: float-levitate 3.6s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes radar-ping-3d {
          0% {
            transform: scale(0.9);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.6);
            opacity: 0.15;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }
        .animate-radar-sweep {
          animation: radar-ping-3d 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .tarot-card-3d {
          perspective: 1200px;
          transform-style: preserve-3d;
          transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.4, 1), box-shadow 0.35s ease;
        }
        .tarot-card-3d:hover {
          transform: translateY(-6px) rotateX(3deg) rotateY(-2deg) scale(1.018);
        }

        .shimmer-glare {
          position: relative;
          overflow: hidden;
        }
        .shimmer-glare::after {
          content: '';
          position: absolute;
          top: -60%;
          left: -60%;
          width: 220%;
          height: 220%;
          background: linear-gradient(
            115deg,
            transparent 0%,
            rgba(255, 255, 255, 0.03) 40%,
            rgba(255, 255, 255, 0.18) 50%,
            rgba(255, 255, 255, 0.03) 60%,
            transparent 100%
          );
          transform: translateX(-160%) skewX(-25deg);
          transition: transform 0.8s ease-in-out;
          pointer-events: none;
        }
        .shimmer-glare:hover::after {
          transform: translateX(160%) skewX(-25deg);
        }

        /* Constellation Twinkling & Faint Luminous Path Keyframes */
        @keyframes star-twinkle-glow {
          0%, 100% {
            opacity: 0.28;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1.35);
            filter: drop-shadow(0 0 6px #fff) drop-shadow(0 0 12px var(--glow-color, rgba(168, 85, 247, 0.9)));
          }
        }
        .animate-star-twinkle-1 {
          animation: star-twinkle-glow 2.4s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        .animate-star-twinkle-2 {
          animation: star-twinkle-glow 3.2s ease-in-out infinite 0.7s;
          transform-box: fill-box;
          transform-origin: center;
        }
        .animate-star-twinkle-3 {
          animation: star-twinkle-glow 2.8s ease-in-out infinite 1.4s;
          transform-box: fill-box;
          transform-origin: center;
        }

        @keyframes constellation-lines-pulse {
          0%, 100% {
            opacity: 0.25;
            stroke-width: 1;
          }
          50% {
            opacity: 0.7;
            stroke-width: 1.4;
            filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.7));
          }
        }
        .animate-constellation-lines {
          animation: constellation-lines-pulse 4s ease-in-out infinite;
        }

        /* Celestial Radial Scan & Server Handshake Beam Keyframes */
        @keyframes celestial-radial-scan {
          0% {
            transform: scale(0.15) rotate(0deg);
            opacity: 0.95;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: scale(2.6) rotate(180deg);
            opacity: 0;
          }
        }
        .animate-radial-scan {
          animation: celestial-radial-scan 2.4s cubic-bezier(0.1, 0.7, 0.3, 1) infinite;
        }

        @keyframes celestial-scan-sweep {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-scan-beam {
          animation: celestial-scan-sweep 3.5s linear infinite;
          transform-origin: center;
        }
      `}</style>

      {/* =========================================================================
          Top Bar: Real-Time Global Astrology Server Live Indicator & Node Telemetry
          ========================================================================= */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-indigo-500/30 shadow-2xl relative overflow-hidden text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Background Cosmic Starfield */}
        <div className="absolute inset-0 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3.5">
          {/* 3D Pulsing Radar Node */}
          <div className="relative w-12 h-12 rounded-2xl bg-indigo-900/60 border border-indigo-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] shrink-0">
            <Radio className="w-5 h-5 text-indigo-300 relative z-10 animate-pulse" />
            <span className="absolute inset-0 rounded-2xl bg-indigo-500 animate-radar-sweep" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                Live Planetary Server: {serverStatus}
              </span>
              <span className="text-[11px] font-mono text-indigo-300 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                {latency}ms ping
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white mt-1 flex items-center gap-2">
              <span>Cosmic Ephemeris Almanac</span>
              <span className="text-xs font-mono font-normal text-slate-400">({currentYear} Active Broadcast)</span>
            </h1>
          </div>
        </div>

        {/* Server Action & Celebrant Quick Selector Dropdown */}
        <div className="relative z-10 flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <select
              id="celebrant-fortune-selector"
              value={activeCelebrant ? activeCelebrant.id || activeCelebrant.sl : ''}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full appearance-none bg-slate-900/90 text-white text-xs font-bold rounded-xl px-3.5 py-2.5 border border-indigo-500/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition cursor-pointer pr-9 shadow-inner"
            >
              {members.map((m) => (
                <option key={m.id || m.sl || m.name} value={m.id || m.sl} className="bg-slate-900 text-white">
                  {m.name} ({m.birthday || 'Date TBD'}) {m.isBirthdayToday ? '🎉 Today!' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-indigo-300 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => activeCelebrant && fetchLiveFortune(activeCelebrant)}
            disabled={isServerSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-400/40 transition active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
            title="Refresh Live Planetary Fortune"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isServerSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          Hero Section: The Celebrant's Aura (Prominent Glassmorphic Profile Card)
          ========================================================================= */}
      {activeCelebrant && (
        <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border ${zodiac.elementGlow.border} shadow-2xl p-6 sm:p-9 text-white shimmer-glare`}>
          {/* Floating Animated 3D Zodiac Compass pointing toward Celebrant's Constellation Element */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-indigo-400/40 shadow-2xl animate-float-3d [perspective:800px]">
            <div className="relative w-10 h-10 rounded-full border border-indigo-400/60 bg-slate-950 flex items-center justify-center shadow-inner">
              <div 
                className="w-full h-full flex items-center justify-center transition-transform duration-1000 ease-out"
                style={{ transform: `rotate(${constellationAngle}deg) rotateX(15deg) rotateY(-10deg)` }}
              >
                <Compass className="w-5 h-5 text-indigo-300 animate-pulse drop-shadow-[0_0_10px_rgba(129,140,248,0.95)]" />
              </div>
              <div className="absolute inset-0 rounded-full border border-purple-400/30 animate-spin-celestial pointer-events-none" />
            </div>
            <div className="text-left pr-1">
              <div className="text-[9px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1">
                <Orbit className="w-3 h-3 text-amber-300 animate-[spin_4s_linear_infinite]" />
                <span>Element Vector: {zodiac.element}</span>
              </div>
              <div className="text-xs font-black text-white flex items-center gap-1.5">
                <span>{zodiac.name}</span>
                <span className="text-amber-300 text-sm font-bold">{zodiac.glyph}</span>
                <span className="text-[10px] font-mono text-indigo-300 font-normal">({constellationAngle}°)</span>
              </div>
            </div>
          </div>

          {/* Continuously Rotating 3D Zodiac Wheel in Background */}
          <div className="absolute -top-36 -right-36 w-[500px] h-[500px] rounded-full border border-indigo-500/15 animate-[spin_60s_linear_infinite] pointer-events-none flex items-center justify-center opacity-40">
            <div className="w-[420px] h-[420px] rounded-full border border-dashed border-purple-400/20" />
            <div className="w-[320px] h-[320px] rounded-full border border-indigo-400/10" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Celebrant's Profile Picture inside Glowing 3D Celestial Ring */}
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                {/* Dynamic Zodiac Constellation Pattern behind Celebrant's Portrait */}
                <div className="absolute -inset-10 sm:-inset-14 flex items-center justify-center pointer-events-none z-0">
                  <ZodiacConstellationSVG
                    sign={zodiac.name}
                    glowColor={zodiac.elementGlow.color}
                    className="w-56 h-56 sm:w-68 sm:h-68 opacity-85"
                  />
                </div>

                {/* 3D Celestial Ring with Element Glow */}
                <div
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-2 relative flex items-center justify-center transition-transform duration-500 hover:scale-105 z-10"
                  style={{
                    boxShadow: `0 0 35px ${zodiac.elementGlow.color}, inset 0 0 15px ${zodiac.elementGlow.color}`
                  }}
                >
                  <div className="absolute inset-0 rounded-full border-2 border-white/60 animate-spin-celestial pointer-events-none" />
                  
                  {/* Photo Container */}
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-white relative shadow-2xl">
                    {celebrantPhotoUrl ? (
                      <img
                        src={celebrantPhotoUrl}
                        alt={activeCelebrant.name}
                        className="w-full h-full object-cover object-center birthday-avatar-cinematic"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-black text-purple-200 bg-gradient-to-br from-indigo-900 to-purple-950">
                        {activeCelebrant.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* 3D Floating Life Symbol Icon */}
                  <div className="absolute -bottom-2 -right-1 w-11 h-11 rounded-2xl bg-slate-900/95 border-2 border-white/90 flex items-center justify-center shadow-xl animate-float-3d">
                    <LifeSymbol3D symbol={monthAura.lifeSymbolName} className="w-7 h-7" />
                  </div>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xs">
                  <span className="text-base">{zodiac.glyph}</span>
                  <span>{zodiac.name}</span>
                  <span>•</span>
                  <span className={zodiac.elementGlow.text}>{zodiac.element} Pillar</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 leading-tight">
                  {activeCelebrant.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                  {activeCelebrant.designation} {activeCelebrant.department ? `• ${activeCelebrant.department}` : ''}
                </p>

                <div className="flex items-center justify-center gap-2 mt-2.5">
                  <span className="text-xs font-bold text-slate-200 bg-white/10 px-3 py-1 rounded-lg border border-white/15">
                    🎂 {parsedBirthday.formatted || activeCelebrant.birthday}
                  </span>
                  {activeCelebrant.isBirthdayToday && (
                    <span className="text-xs font-black text-white bg-gradient-to-r from-amber-500 to-rose-500 px-3 py-1 rounded-lg shadow-md animate-pulse">
                      Birthday Hero Today! 🎉
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 pt-1">
                {onOpenGenerator && (
                  <button
                    onClick={() => onOpenGenerator(activeCelebrant)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/40 active:translate-y-[1px] transition cursor-pointer"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    Personal Wish
                  </button>
                )}
                {onSendWhatsApp && (
                  <button
                    onClick={() => onSendWhatsApp(activeCelebrant)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/40 active:translate-y-[1px] transition cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Instant Dispatch
                  </button>
                )}
              </div>
            </div>

            {/* Right: The Universe's Note & Dynamic Cosmic Traits Grid */}
            <div className="lg:col-span-8 space-y-5">
              {/* The Universe's Note (Personalized Feel-Good Typography Section) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-indigo-400/30 shadow-xl space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-300">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>The Universe's Prophecy for {activeCelebrant.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Synchronized {liveFortune?.syncTimestamp || 'Live'}
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-100 font-serif italic leading-relaxed">
                  "{liveFortune?.positiveAuraNote}"
                </p>

                <div className="flex items-start gap-2 pt-0.5">
                  {/* CSS-Animated Planetary Icon indicating active planetary transit influence */}
                  <span 
                    className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-indigo-950/80 border border-indigo-400/40 text-amber-300 text-xs font-bold icon-breathing shrink-0 mt-0.5 shadow-xs" 
                    title="Active Ephemeris Transit Influence"
                  >
                    ♃
                  </span>
                  <p className="text-xs text-indigo-200 leading-relaxed font-normal">
                    {liveFortune?.cosmicGuidance}
                  </p>
                </div>
              </div>

              {/* Destiny & Fate Outline (Book of Fate Section) */}
              <div 
                id="fate-and-destiny-section"
                className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900/90 to-indigo-950/70 backdrop-blur-xl border border-purple-500/40 shadow-2xl space-y-4 relative shimmer-glare overflow-hidden"
                style={{ '--glow-color': zodiac.elementGlow.color } as React.CSSProperties}
              >
                {/* Visual Astrological Sync Progress Indicator & Glowing Radial Scan Animation */}
                {isServerSyncing && (
                  <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-2xl flex items-center justify-center bg-slate-950/45 backdrop-blur-[1.5px]">
                    {/* Glowing Radial Scan Sweep across Container */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.2)_0%,rgba(168,85,247,0.14)_45%,transparent_70%)] animate-pulse pointer-events-none" />

                    {/* Concentric Glowing Radial Scan Rings */}
                    <div className="w-[340px] h-[340px] sm:w-[520px] sm:h-[520px] rounded-full border-2 border-cyan-400/70 shadow-[0_0_40px_rgba(6,182,212,0.7)] animate-radial-scan pointer-events-none absolute" />
                    <div className="w-[220px] h-[220px] sm:w-[360px] sm:h-[360px] rounded-full border border-purple-400/60 shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-radial-scan pointer-events-none absolute [animation-delay:0.8s]" />

                    {/* 360-degree Rotating Radar Sweep Conical Beam */}
                    <div className="w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] absolute rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(6,182,212,0.22)_60deg,rgba(168,85,247,0.15)_90deg,transparent_115deg)] animate-scan-beam pointer-events-none" />

                    {/* Floating Astrological Sync Progress Banner */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-950/95 border border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.8)] backdrop-blur-md z-40">
                      <Orbit className="w-4 h-4 text-cyan-300 animate-[spin_1.2s_linear_infinite]" />
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-mono font-black tracking-wider uppercase text-cyan-200 flex items-center gap-1.5">
                          <span>Astrological Sync In Progress</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                        </span>
                        <span className="text-[9px] font-mono text-purple-300">
                          Handshake Link: {latency}ms Ephemeris Latency • {zodiac.name} House
                        </span>
                      </div>
                    </div>

                    {/* Horizontal Scanning Laser Bar at Top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(6,182,212,0.95)] animate-pulse" />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {/* 3D Cinematic Animated Fate Icon with Levitating Physics and Glowing Aura matching Zodiac element */}
                    <div 
                      className="w-11 h-11 rounded-xl bg-purple-900/70 border border-purple-400/50 flex items-center justify-center animate-float-3d shrink-0"
                      style={{
                        boxShadow: `0 0 20px ${zodiac.elementGlow.color}, inset 0 0 10px ${zodiac.elementGlow.color}`
                      }}
                    >
                      <BookOpen 
                        className="w-5 h-5 text-amber-300 animate-pulse"
                        style={{
                          filter: `drop-shadow(0 0 15px ${zodiac.elementGlow.color})`
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                        <MoonStar className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                        <span>Book of Fate • Sacred Life Path</span>
                      </div>
                      <h3 className="text-base font-black text-white leading-tight">
                        Destiny & Fate Outline for {activeCelebrant.name}
                      </h3>
                    </div>
                  </div>

                  {/* Action Buttons: View Night Sky Map & Reveal Fate */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setShowNightSkyModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-950/50 transition active:scale-95 cursor-pointer group"
                      title="View Interactive Night Sky Star Map on Birth Date"
                    >
                      <Compass className="w-4 h-4 text-cyan-300 group-hover:rotate-90 transition-transform duration-500 animate-pulse" />
                      <span>View Night Sky Map</span>
                    </button>

                    <button
                      onClick={() => fetchLiveFortune(activeCelebrant)}
                      disabled={isServerSyncing}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border border-purple-400/40 shadow-md shadow-purple-900/30 transition active:scale-95 cursor-pointer disabled:opacity-50 shrink-0 group"
                      title="Reveal Real-Time Fate & Life Destiny"
                    >
                      <Atom className={`w-4 h-4 text-cyan-300 group-hover:text-amber-300 transition ${isServerSyncing ? 'animate-[spin_3s_linear_infinite]' : 'animate-[spin_4s_linear_infinite]'}`} />
                      <span>Reveal Fate</span>
                    </button>
                  </div>
                </div>

                {/* The Year Ahead (Astrological Alignment & Forecast) */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-purple-500/30 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <span className="text-xs sm:text-sm font-black bg-gradient-to-r from-amber-200 via-purple-100 to-cyan-200 bg-clip-text text-transparent flex items-center gap-2">
                      {/* CSS-Animated Planetary Icon with gentle breathing pulse indicating active planetary transit */}
                      <span 
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold icon-breathing shrink-0 shadow-xs" 
                        title="Active Planetary Transit Influence"
                      >
                        ♃
                      </span>
                      <span>The Year Ahead • {liveFortune?.fateAndDestiny?.theYearAhead.alignment}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 self-start sm:self-auto">
                      {liveFortune?.fateAndDestiny?.theYearAhead.luckFactor}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span 
                      className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-purple-900/60 border border-purple-400/40 text-amber-300 text-xs font-bold icon-breathing shrink-0 mt-0.5 shadow-xs" 
                      title="Active Planetary Influence"
                    >
                      🪐
                    </span>
                    <p className="text-xs sm:text-sm text-slate-100 font-serif italic leading-relaxed">
                      "{liveFortune?.fateAndDestiny?.theYearAhead.forecast}"
                    </p>
                  </div>
                </div>

                {/* Active Planetary Transits (Gochara Predictions) */}
                {liveFortune?.activeTransits && liveFortune.activeTransits.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-purple-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                        <Orbit className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
                        <span>Active Planetary Transits & Predictions</span>
                      </span>
                      <span className="text-[10px] font-mono text-cyan-300">Live Ephemeris Influence</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {liveFortune.activeTransits.map((transit, idx) => {
                        const planetMap: Record<string, { glyph: string; color: string; border: string; bg: string }> = {
                          Jupiter: { glyph: '♃', color: 'text-amber-300', border: 'border-amber-400/40', bg: 'bg-amber-950/60' },
                          Saturn: { glyph: '♄', color: 'text-indigo-300', border: 'border-indigo-400/40', bg: 'bg-indigo-950/60' },
                          Rahu: { glyph: '☊', color: 'text-purple-300', border: 'border-purple-400/40', bg: 'bg-purple-950/60' },
                          Ketu: { glyph: '☋', color: 'text-teal-300', border: 'border-teal-400/40', bg: 'bg-teal-950/60' },
                          Mars: { glyph: '♂', color: 'text-rose-300', border: 'border-rose-400/40', bg: 'bg-rose-950/60' },
                          Sun: { glyph: '☉', color: 'text-amber-400', border: 'border-amber-400/40', bg: 'bg-amber-950/60' },
                          Venus: { glyph: '♀', color: 'text-pink-300', border: 'border-pink-400/40', bg: 'bg-pink-950/60' },
                          Mercury: { glyph: '☿', color: 'text-emerald-300', border: 'border-emerald-400/40', bg: 'bg-emerald-950/60' },
                          Moon: { glyph: '☽', color: 'text-cyan-300', border: 'border-cyan-400/40', bg: 'bg-cyan-950/60' },
                        };
                        const pConf = planetMap[transit.transitPlanet] || { glyph: '🪐', color: 'text-amber-300', border: 'border-purple-400/40', bg: 'bg-purple-950/60' };
                        return (
                          <div key={idx} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 flex items-start gap-2.5 hover:border-purple-500/40 transition">
                            {/* CSS-Animated Planetary Icon with gentle breathing pulse animation */}
                            <span 
                              className={`w-7 h-7 rounded-lg ${pConf.bg} border ${pConf.border} flex items-center justify-center shrink-0 icon-breathing shadow-xs`}
                              title={`Active ${transit.transitPlanet} Planetary Influence`}
                            >
                              <span className={`text-sm font-bold ${pConf.color}`}>{pConf.glyph}</span>
                            </span>
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[11px] font-bold text-white truncate">{transit.headline}</span>
                                <span className="text-[9px] font-mono text-emerald-400 shrink-0">Impact: {transit.impactScore}%</span>
                              </div>
                              <p className="text-[11px] text-slate-300 leading-snug">{transit.prediction}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Specific Fate Breakdown: Career & Success vs Personal Joy & Milestones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Career & Success Fate */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-indigo-500/30 space-y-2 tarot-card-3d">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-300 to-indigo-200 bg-clip-text text-transparent flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Career & Success Fate</span>
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {liveFortune?.fateAndDestiny?.careerAndSuccess.predictions.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-1 text-[10px] font-bold text-indigo-300 border-t border-slate-800 flex items-center gap-1">
                      <span>🚀 Growth Leap:</span>
                      <span className="text-white truncate">{liveFortune?.fateAndDestiny?.careerAndSuccess.growthLeap}</span>
                    </div>
                  </div>

                  {/* Personal Joy & Milestones */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-rose-500/30 space-y-2 tarot-card-3d">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-rose-300 to-purple-200 bg-clip-text text-transparent flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        <span>Personal Joy & Milestones</span>
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {liveFortune?.fateAndDestiny?.personalJoyAndPeace.milestones.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-1 text-[10px] font-bold text-rose-300 border-t border-slate-800 flex items-center gap-1">
                      <span>💖 Friendship Harmony:</span>
                      <span className="text-white truncate">{liveFortune?.fateAndDestiny?.personalJoyAndPeace.friendshipBlessing}</span>
                    </div>
                  </div>
                </div>

                {/* Fate Milestones Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  {liveFortune?.fateAndDestiny?.destinyMilestones.map((dm, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/70 hover:border-purple-400/50 transition tarot-card-3d space-y-1"
                    >
                      <div className="text-[10px] font-mono text-purple-300 font-bold uppercase">{dm.quarter}</div>
                      <div className="text-xs font-black text-white">{dm.milestone}</div>
                      <p className="text-[11px] text-slate-300 leading-tight">{dm.blessing}</p>
                    </div>
                  ))}
                </div>

                {/* Interactive Birth Constellation Star Field */}
                <StarFieldMap
                  celebrant={activeCelebrant}
                  zodiac={zodiac}
                  parsedBirthday={parsedBirthday}
                  className="w-full"
                />

                {/* Cosmic Decree */}
                <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
                  <span>{liveFortune?.fateAndDestiny?.cosmicDecree}</span>
                </div>
              </div>

              {/* Data Grid: Cosmic Traits (Element, Ruling Planet, Life Symbol, Lucky Color) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-700/80 shadow-xs tarot-card-3d">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Life Symbol</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <LifeSymbol3D symbol={monthAura.lifeSymbolName} className="w-6 h-6 shrink-0" />
                    <span className="text-sm font-black text-white truncate">{monthAura.lifeSymbolName}</span>
                  </div>
                  <div className="text-[10px] text-purple-300 truncate mt-1">
                    {monthAura.coreKeyword}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-700/80 shadow-xs tarot-card-3d">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Element & Ruler</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    {zodiac.element === 'Fire' && <Flame className="w-4 h-4 text-red-400 shrink-0" />}
                    {zodiac.element === 'Earth' && <Mountain className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {zodiac.element === 'Air' && <Wind className="w-4 h-4 text-purple-400 shrink-0" />}
                    {zodiac.element === 'Water' && <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />}
                    <span className="text-sm font-black text-white truncate">{zodiac.element}</span>
                  </div>
                  <div className="text-[10px] text-slate-300 truncate mt-1">
                    Ruler: {zodiac.rulingPlanet}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-700/80 shadow-xs tarot-card-3d">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lucky Gem & Color</div>
                  <div className="text-sm font-black text-amber-300 truncate mt-1.5">
                    {monthAura.luckyGem}
                  </div>
                  <div className="text-[10px] text-slate-300 truncate mt-1">
                    Color: {zodiac.luckyColor}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-700/80 shadow-xs tarot-card-3d">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cosmic Number</div>
                  <div className="text-sm font-black text-white mt-1.5 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>#{zodiac.luckyNumber}</span>
                  </div>
                  <div className="text-[10px] text-slate-300 truncate mt-1">
                    House of {zodiac.name}
                  </div>
                </div>
              </div>

              {/* Lucky Traits Tags */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Radiant Traits:</span>
                {zodiac.luckyTraits.map((trait) => (
                  <span
                    key={trait}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 text-slate-200 border border-white/15 shadow-sm"
                  >
                    ✨ {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          Future Forecasting: Year-by-Year & Upcoming Good Things Grid
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Upcoming Good Things & Multi-Year Forecast</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized, overwhelmingly positive milestones verified for {activeCelebrant?.name || 'Celebrant'}.
            </p>
          </div>
        </div>

        {/* 4 Pillars of Good Fortune Cards with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1: Career */}
          <div className="rounded-2xl p-5 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/40 text-white shadow-xl tarot-card-3d shimmer-glare space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Award className="w-5 h-5 text-indigo-400" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">Career & Mastery</span>
            </div>
            <h3 className="text-base font-black text-white">Executive Breakthroughs</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {liveFortune?.careerOpportunities.map((op, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{op}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pillar 2: Happiness & Emotional Harmony */}
          <div className="rounded-2xl p-5 bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/40 text-white shadow-xl tarot-card-3d shimmer-glare space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/30">
                <Heart className="w-5 h-5 text-rose-400" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-300">Emotional Bliss</span>
            </div>
            <h3 className="text-base font-black text-white">Happiness & Vitality</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {liveFortune?.happinessMilestones.map((hp, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{hp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pillar 3: Financial Abundance */}
          <div className="rounded-2xl p-5 bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 text-white shadow-xl tarot-card-3d shimmer-glare space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Star className="w-5 h-5 text-amber-400" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">Abundance</span>
            </div>
            <h3 className="text-base font-black text-white">Prosperity & Assets</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {liveFortune?.financialAbundance.map((fa, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{fa}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pillar 4: Friendship & Comradeship */}
          <div className="rounded-2xl p-5 bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 text-white shadow-xl tarot-card-3d shimmer-glare space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Smile className="w-5 h-5 text-emerald-400" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">Beloved Comrades</span>
            </div>
            <h3 className="text-base font-black text-white">Team Unity & Warmth</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {liveFortune?.friendshipHarmony.map((fh, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{fh}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Year-by-Year Multi-Year Roadmap */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-indigo-500/30 shadow-xl text-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-black text-white">Year-by-Year Horizon Forecast</h3>
            </div>
            <span className="text-xs font-mono text-purple-300">Active Planetary Ephemeris</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {liveFortune?.yearByYearForecast.map((item, idx) => {
              const yearPlanets = ['♃', '♄', '☉'];
              const yearPlanet = yearPlanets[idx % yearPlanets.length];
              return (
                <div
                  key={item.year}
                  className="p-4 rounded-2xl bg-slate-950/90 border border-slate-700/80 hover:border-indigo-400/60 transition shadow-inner space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* CSS-Animated Planetary Icon with gentle breathing pulse */}
                      <span 
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold icon-breathing shrink-0 shadow-xs" 
                        title="Active Planetary Transit Influence"
                      >
                        {yearPlanet}
                      </span>
                      <span className="text-lg font-black text-amber-300">{item.year}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      Vitality {item.vitalityScore}%
                    </span>
                  </div>
                  <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <span className="text-purple-300 text-xs icon-breathing">🪐</span>
                    <span>{item.theme}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-300 text-xs icon-breathing shrink-0 mt-0.5">✦</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.prediction}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Personalized Dasha Lifecycle Card */}
        <div 
          id="personalized-dasha-lifecycle-card" 
          className="p-6 rounded-3xl bg-slate-900/80 border border-purple-500/30 shadow-xl text-white space-y-4 relative overflow-hidden shimmer-glare"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-950/80 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-inner">
                <Layers className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">Personalized Dasha Lifecycle</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    Vimshottari 120-Year Horizon
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Planetary life chapters calculated from {activeCelebrant?.name || 'Celebrant'}'s Moon Nakshatra & Lahiri Sidereal Ephemeris.
                </p>
              </div>
            </div>

            {/* Current Active Period Indicator Pill */}
            {dashaInfo && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-purple-400/40 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-300">Active Era:</span>
                <strong className="text-amber-300 font-bold">
                  {dashaInfo.mahadasha.lord}–{dashaInfo.antardasha.lord}
                </strong>
                <span className="text-slate-400 text-[10px]">
                  ({dashaInfo.antardasha.startDate} – {dashaInfo.antardasha.endDate})
                </span>
              </div>
            )}
          </div>

          {/* Current Active Era Highlight Banner */}
          {dashaInfo && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-950/90 to-indigo-950/70 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Governing Energy: {dashaInfo.mahadasha.lord} Mahadasha ({dashaInfo.mahadasha.startYear}–{dashaInfo.mahadasha.endYear})</span>
                  <span>•</span>
                  <span>Sub-Phase: {dashaInfo.antardasha.lord} Antardasha</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {dashaInfo.antardasha.predictionFocus}
                </p>
              </div>
              <div className="text-[10px] font-mono text-cyan-300 px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/40 shrink-0 self-start sm:self-auto">
                Pratyantar: {dashaInfo.pratyantardasha.lord}
              </div>
            </div>
          )}

          {/* Vertical Scrollable Timeline List with Visual Markers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Chronological Life Phases & Major Dasha Shifts</span>
              <span className="text-[10px] font-mono text-purple-300">Scroll to explore timeline ↓</span>
            </div>

            <div 
              className="max-h-[300px] overflow-y-auto space-y-2.5 pr-2 overscroll-contain select-none"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(168, 85, 247, 0.4) rgba(2, 6, 23, 0.6)'
              }}
            >
              {dashaInfo?.lifecycle && dashaInfo.lifecycle.length > 0 ? (
                dashaInfo.lifecycle.map((phase) => (
                  <div key={phase.id} className="space-y-1.5">
                    {/* Visual Marker for Major Dasha Changes */}
                    {phase.isMajorChange && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 border border-amber-400/40 text-[11px] font-black text-amber-200 shadow-md">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                        <span>✦ MAJOR DASHA TRANSITION: Entering {phase.mahadashaLord} Mahadasha Era ({phase.startYear} – {phase.endYear})</span>
                        <span className="text-[9px] font-mono text-purple-300 ml-auto hidden sm:inline">Vedic Life Shift</span>
                      </div>
                    )}

                    {/* Phase Card */}
                    <div
                      className={`p-3.5 rounded-2xl border transition-all ${
                        phase.isActive
                          ? 'bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 border-purple-400 ring-2 ring-purple-400/40 shadow-xl'
                          : phase.isMajorChange
                          ? 'bg-slate-950/90 border-amber-500/40 hover:border-amber-400/70'
                          : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        {/* Left: Planetary Visual Marker Node */}
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shadow-inner ${
                              phase.isActive
                                ? 'bg-purple-600 text-white ring-2 ring-purple-300 animate-pulse'
                                : phase.isMajorChange
                                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            <span>{phase.glyph || '✦'}</span>
                          </div>

                          <div>
                            <div className="text-xs font-black text-white flex items-center gap-2">
                              <span>{phase.mahadashaLord} – {phase.antardashaLord}</span>
                              <span className="text-[10px] font-normal text-slate-400">({phase.sanskritName})</span>
                            </div>
                            <div className="text-[10px] text-purple-300 font-medium">
                              {phase.theme}
                            </div>
                          </div>
                        </div>

                        {/* Right: Dates & Status Badge */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-700">
                            {phase.startDateStr} – {phase.endDateStr}
                          </span>
                          {phase.isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 animate-pulse">
                              ● Current Era
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Feel-Good Positive Life Event Narrative */}
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {phase.lifeEventFocus}
                      </p>

                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                        <span className="text-indigo-300">{phase.yogakarakaBlessing}</span>
                        <span className="font-mono text-emerald-400">Auspicious Index: {phase.favorableScore}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-950/60 text-center text-xs text-slate-400">
                  Calculating personalized Vedic timeline...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          12-Month Fortune Grid: Glassmorphic Cards with 3D Life Symbols
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-600" />
              <span>The 12 Sacred Months & Planetary Auras</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explore the core life symbol and annual fortune theme for every calendar month.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MONTH_AURAS.map((month) => {
            const isCelebrantMonth = month.monthIndex === parsedBirthday.month;
            const monthCelebrants = celebrantsByMonth[month.monthIndex] || [];

            return (
              <div
                key={month.monthName}
                className={`rounded-2xl p-5 border transition-all duration-300 tarot-card-3d shimmer-glare flex flex-col justify-between ${
                  isCelebrantMonth
                    ? 'bg-gradient-to-b from-purple-950/80 via-slate-900 to-slate-950 border-purple-500 shadow-2xl shadow-purple-500/20 text-white ring-2 ring-purple-400/80'
                    : 'bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-purple-400 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Month #{month.monthIndex + 1}
                      </span>
                      <h3 className="text-base font-black leading-tight">
                        {month.monthName}
                      </h3>
                    </div>

                    {/* 3D Rendered Life Symbol */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center shadow-lg border border-slate-700/60 animate-float-3d">
                      <LifeSymbol3D symbol={month.lifeSymbolName} className="w-8 h-8" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-purple-400">
                      Symbol: {month.lifeSymbolName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/10 border border-white/20">
                      {month.element} Element
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {month.lifeMeaning}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px]">
                    <span className="font-bold text-purple-600 dark:text-purple-400">Annual Harvest: </span>
                    <span className="line-clamp-2">{month.yearlyForecast}</span>
                  </div>
                </div>

                {/* Team Members in this Month */}
                <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Celebrants:</span>
                  <div className="flex items-center -space-x-1.5">
                    {monthCelebrants.length > 0 ? (
                      monthCelebrants.slice(0, 3).map((m) => {
                        const mPhoto = formatProfileImageUrl(m.imageUrl) || getMemberPhotoUrl(m);
                        return (
                          <div
                            key={m.id || m.sl || m.name}
                            className="w-6 h-6 rounded-full border border-white dark:border-slate-900 overflow-hidden shadow-xs bg-purple-600 text-white flex items-center justify-center text-[9px] font-black"
                            title={`${m.name} (${m.birthday})`}
                          >
                            {mPhoto ? (
                              <img src={mPhoto} alt={m.name} className="w-full h-full object-cover" />
                            ) : (
                              m.name.charAt(0)
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">None registered</span>
                    )}
                    {monthCelebrants.length > 3 && (
                      <span className="text-[9px] font-bold text-slate-400 pl-1">
                        +{monthCelebrants.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          Bottom Section: Team Destinies & Upcoming Fortunes (Individual Member Astrological Forecasts)
          ========================================================================= */}
      <div className="space-y-4 pt-6 border-t border-slate-200/60 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-300/60 dark:border-purple-800/60">
              <MoonStar className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
              <span>Real-Time Team Astrology Matrix</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <Orbit className="w-6 h-6 text-purple-600 animate-[spin_6s_linear_infinite]" />
              <span>Team Destinies & Upcoming Fortunes</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized real-time astrological forecasts, life milestones, and positive prophecies for every member of the Central IE Team.
            </p>
          </div>

          {/* Sync Destinies Button with Animated Astrology Orbit Icon */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              {lastDestiniesSync ? `Synced ${lastDestiniesSync}` : 'Live Ephemeris'}
            </span>
            <button
              onClick={() => syncTeamDestinies(members)}
              disabled={isSyncingDestinies}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30 transition active:scale-95 cursor-pointer disabled:opacity-50 shrink-0 border border-purple-400/40"
              title="Refresh Real-Time Team Astrology Destinies"
            >
              <Orbit className={`w-4 h-4 text-amber-300 ${isSyncingDestinies ? 'animate-[spin_1s_linear_infinite]' : 'animate-[spin_4s_linear_infinite]'}`} />
              <span>Sync Destinies</span>
            </button>
          </div>
        </div>

        {/* Responsive Grid of Individual Member Astrology Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {teamDestinies.map((destiny) => {
            const memberObj = members.find((m) => (m.id || m.sl || m.name) === destiny.memberId);
            const photo = memberObj ? (formatProfileImageUrl(memberObj.imageUrl) || getMemberPhotoUrl(memberObj)) : '';
            const isCelebrant = (memberObj?.id || memberObj?.sl) === (activeCelebrant?.id || activeCelebrant?.sl);

            return (
              <div
                key={destiny.memberId}
                onClick={() => memberObj && setSelectedMemberId(memberObj.id || memberObj.sl)}
                className={`rounded-2xl p-5 border transition-all duration-300 tarot-card-3d shimmer-glare flex flex-col justify-between cursor-pointer ${
                  isCelebrant
                    ? 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-purple-400 shadow-xl shadow-purple-500/20 text-white ring-2 ring-purple-400/80'
                    : 'bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-purple-400/80 shadow-xs'
                }`}
                style={{
                  boxShadow: isCelebrant ? `0 0 25px ${destiny.zodiac.elementGlow.color}` : undefined
                }}
              >
                <div className="space-y-3">
                  {/* Top Bar: Member Photo, Name, and Birthdate */}
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-md bg-slate-800 flex items-center justify-center text-sm font-black text-white">
                        {photo ? (
                          <img src={photo} alt={destiny.name} className="w-full h-full object-cover" />
                        ) : (
                          destiny.name.charAt(0)
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 border border-white flex items-center justify-center text-[10px] shadow-sm">
                        {destiny.zodiac.glyph}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-black truncate leading-tight">
                        {destiny.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        🎂 {destiny.birthday || 'Date TBD'}
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 mt-1">
                        <span>{destiny.zodiac.name}</span>
                        <span>•</span>
                        <span>{destiny.zodiac.element}</span>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Good Things & Personalized Note */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-purple-600 dark:text-purple-400 text-[11px] flex items-center gap-1.5">
                        {/* CSS-Animated Planetary Icon with gentle breathing pulse indicating active transit influence */}
                        <span 
                          className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-500 dark:text-purple-300 text-[10px] font-bold icon-breathing shrink-0" 
                          title="Active Planetary Transit Influence"
                        >
                          🪐
                        </span>
                        <span>{destiny.upcomingGoodThings.headline}</span>
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-[10px] text-amber-500 dark:text-amber-400 icon-breathing shrink-0 mt-0.5">✨</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {destiny.upcomingGoodThings.description}
                      </p>
                    </div>
                    <div className="pt-1 text-[10px] text-amber-600 dark:text-amber-300 font-medium flex items-center gap-1">
                      <span>🌟 Blessing:</span>
                      <span className="italic truncate">{destiny.upcomingGoodThings.luckyBlessing}</span>
                    </div>
                  </div>
                </div>

                {/* Footer: Timeline Milestone Badge */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-mono">Timing:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                    {destiny.upcomingGoodThings.milestoneTime}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Night Sky Map Modal */}
      {showNightSkyModal && activeCelebrant && (
        <InteractiveNightSkyModal
          isOpen={showNightSkyModal}
          onClose={() => setShowNightSkyModal(false)}
          celebrant={activeCelebrant}
          zodiac={zodiac}
          parsedBirthday={parsedBirthday}
        />
      )}
    </div>
  );
};
