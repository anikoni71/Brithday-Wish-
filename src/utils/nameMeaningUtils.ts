/**
 * Name Meaning Of Team Member - Dynamic & Automated Semantic Engine
 * 
 * Features:
 * 1. Curated exact mappings for the primary 16 IE Central team members with uplifting emojis and short meaningful notes.
 * 2. Extensive etymological and root dictionary (Bengali, Sanskrit, Arabic, Persian, Sinhala, English).
 * 3. Real-time automated dynamic semantic generator: whenever a new team member is added or synced from Google Sheet,
 *    an inspiring, spiritually uplifting short meaning and matching expressive emoji are automatically synthesized.
 */

export interface NameMeaningDetails {
  emoji: string;
  note: string;
  full: string;
  source: 'curated' | 'etymology' | 'generative';
}

/**
 * Curated Official Name Meanings for Core 16 Team Members
 */
export const CURATED_TEAM_NAME_MEANINGS: Record<string, { emoji: string; note: string }> = {
  danushka: {
    emoji: "🏹",
    note: "Armed with a bow / Prosperous",
  },
  zahid: {
    emoji: "✨",
    note: "Pious and devoted",
  },
  khalid: {
    emoji: "♾️",
    note: "Eternal and enduring",
  },
  rasij: {
    emoji: "♾️",
    note: "Eternal and enduring",
  },
  abdulla: {
    emoji: "🤲",
    note: "Servant of God",
  },
  abdullah: {
    emoji: "🤲",
    note: "Servant of God",
  },
  bishnu: {
    emoji: "🛡️",
    note: "The Preserver and Protector",
  },
  sudipta: {
    emoji: "🌟",
    note: "Bright and radiant",
  },
  farjana: {
    emoji: "💡",
    note: "Wise and knowledgeable",
  },
  samon: {
    emoji: "🌸",
    note: "Jasmine flower and valuable",
  },
  irfan: {
    emoji: "🕊️",
    note: "Deep knowledge and inner wisdom",
  },
  anik: {
    emoji: "🛡️",
    note: "Soldier and brave guardian",
  },
  farhad: {
    emoji: "😊",
    note: "Helper and joy",
  },
  ranjith: {
    emoji: "🎉",
    note: "Victorious and bringer of joy",
  },
  rohan: {
    emoji: "🌿",
    note: "Ascending and growing",
  },
  dipankar: {
    emoji: "🕯️",
    note: "Bringer of light",
  },
  tareq: {
    emoji: "⭐",
    note: "Morning star and guide",
  },
  tariq: {
    emoji: "⭐",
    note: "Morning star and guide",
  },
  asif: {
    emoji: "⚖️",
    note: "Strong, capable, and forgiving",
  },
  // Additional core roster teammate:
  arifur: {
    emoji: "👑",
    note: "Noble leader and wise guide",
  },
  syed: {
    emoji: "👑",
    note: "Noble leader and honored guide",
  },
};

/**
 * Etymological Roots Dictionary for Real-Time Dynamic Sheet Member Sync
 */
export const NAME_ROOTS_DICTIONARY: Record<string, { emoji: string; note: string }> = {
  tanvir: { emoji: "✨", note: "Enlightened, radiant, and illuminated" },
  tanveer: { emoji: "✨", note: "Enlightened, radiant, and illuminated" },
  hasan: { emoji: "🌟", note: "Handsome, good-hearted, and virtuous" },
  hassan: { emoji: "🌟", note: "Handsome, good-hearted, and virtuous" },
  hossain: { emoji: "💫", note: "Goodness, beauty, and noble grace" },
  hussein: { emoji: "💫", note: "Goodness, beauty, and noble grace" },
  rahman: { emoji: "🌿", note: "Gracious, compassionate, and benevolent" },
  rahim: { emoji: "🕊️", note: "Kind, merciful, and caring soul" },
  ali: { emoji: "🦁", note: "Elevated, sublime, and noble champion" },
  ahmed: { emoji: "💎", note: "Praiseworthy and highly commended" },
  ahmad: { emoji: "💎", note: "Praiseworthy and highly commended" },
  mahmud: { emoji: "✨", note: "Praised, grateful, and noble-hearted" },
  mahmood: { emoji: "✨", note: "Praised, grateful, and noble-hearted" },
  islam: { emoji: "🕊️", note: "Bringer of peace, harmony, and faith" },
  rana: { emoji: "👑", note: "Royal monarch and visionary leader" },
  shohel: { emoji: "⭐", note: "Guiding star and radiant beacon" },
  sohel: { emoji: "⭐", note: "Guiding star and radiant beacon" },
  kamal: { emoji: "🏆", note: "Perfection, completeness, and excellence" },
  jamal: { emoji: "🌺", note: "Radiant grace and inner elegance" },
  saif: { emoji: "⚔️", note: "Sword of honor and brave protector" },
  saiful: { emoji: "⚔️", note: "Sword of truth and righteous valor" },
  nur: { emoji: "🕯️", note: "Divine light and spiritual brilliance" },
  noor: { emoji: "🕯️", note: "Divine light and spiritual brilliance" },
  badr: { emoji: "🌕", note: "Full moon and dazzling luminescence" },
  shams: { emoji: "☀️", note: "Radiant sun, warmth, and energy" },
  rashid: { emoji: "🧭", note: "Rightly guided and discerning leader" },
  mahbub: { emoji: "❤️", note: "Beloved and cherished companion" },
  nazmul: { emoji: "🌟", note: "Star of excellence and high virtue" },
  nayeem: { emoji: "🌱", note: "Blessed with comfort and tranquility" },
  naim: { emoji: "🌱", note: "Blessed with serenity and ease" },
  kabir: { emoji: "🏔️", note: "Grand, honorable, and venerable" },
  joy: { emoji: "🎉", note: "Triumph, cheer, and victory" },
  sumon: { emoji: "🌸", note: "Pleasant mind and warm benevolence" },
  soumen: { emoji: "🌸", note: "Pleasant mind and harmonious heart" },
  subrata: { emoji: "🛡️", note: "Devoted to noble principles and truth" },
  pritam: { emoji: "💖", note: "Beloved, dear, and deeply cherished" },
  pritom: { emoji: "💖", note: "Beloved, dear, and deeply cherished" },
  debabrata: { emoji: "🙏", note: "Devout and committed to righteousness" },
  fatima: { emoji: "🌷", note: "Captivating and pure of heart" },
  ayesha: { emoji: "🌿", note: "Living, prosperous, and vibrant" },
  nafisa: { emoji: "💎", note: "Precious, gem-like, and refined" },
  shirin: { emoji: "🍯", note: "Sweet, gentle, and pleasing demeanor" },
  fariha: { emoji: "😊", note: "Joyful, cheerful, and full of happiness" },
  sadia: { emoji: "🍀", note: "Blessed with good fortune and auspiciousness" },
  marium: { emoji: "🕊️", note: "Pure, elevated, and devout spirit" },
  maryam: { emoji: "🕊️", note: "Pure, elevated, and devout spirit" },
  tasnim: { emoji: "🌊", note: "Fountain of paradise and renewal" },
  maruf: { emoji: "🏅", note: "Renowned for good deeds and honor" },
  munir: { emoji: "💡", note: "Shining, radiant, and illuminating guide" },
  wahed: { emoji: "💎", note: "Unique, peerless, and steadfast" },
  wahid: { emoji: "💎", note: "Unique, peerless, and steadfast" },
  billal: { emoji: "💧", note: "Refreshing water and victorious spirit" },
  faisal: { emoji: "⚖️", note: "Decisive, just, and fair judge" },
  imran: { emoji: "🏰", note: "Prosperity, growth, and flourishing state" },
  zia: { emoji: "✨", note: "Splendor, glow, and source of light" },
  shakil: { emoji: "🌟", note: "Well-formed, graceful, and admirable" },
  habib: { emoji: "💙", note: "Beloved friend and trusted companion" },
  riaz: { emoji: "🌷", note: "Lush gardens and blooming prosperity" },
  amin: { emoji: "🤝", note: "Trustworthy, honest, and faithful" },
  saleh: { emoji: "🌿", note: "Righteous, devoted, and wholesome" },
  sultan: { emoji: "👑", note: "Sovereign leader and majestic presence" },
  salman: { emoji: "🛡️", note: "Safe, sound, and peaceful protector" },
  adnan: { emoji: "🌾", note: "Settler of prosperity and pioneer" },
  hamza: { emoji: "🦁", note: "Steadfast, lion-hearted, and courageous" },
  mustafa: { emoji: "🏆", note: "The chosen one and noble in spirit" },
  maksud: { emoji: "🎯", note: "Purposeful, focused, and goal-oriented" },
  mithun: { emoji: "🤝", note: "Friendly companion and harmonious bond" },
  shilpi: { emoji: "🎨", note: "Creative artisan and master craftsman" },
  swapan: { emoji: "✨", note: "Dreamer and visionary thinker" },
  chandan: { emoji: "🪵", note: "Fragrant sandalwood and auspicious grace" },
  anupam: { emoji: "🌟", note: "Incomparable, unique, and extraordinary" },
  avijit: { emoji: "🏹", note: "Invincible and one who conquers" },
  partha: { emoji: "🏹", note: "Steadfast archer and noble warrior" },
  rajib: { emoji: "🪷", note: "Blue lotus and symbol of purity" },
  rajiv: { emoji: "🪷", note: "Blue lotus and symbol of purity" },
  palash: { emoji: "🌺", note: "Flame of the forest and vibrant spirit" },
  sujan: { emoji: "🕊️", note: "Virtuous, noble, and kind person" },
  bijoy: { emoji: "🏆", note: "Triumphant and victorious" },
  milon: { emoji: "🤝", note: "Union, friendship, and togetherness" },
  tapash: { emoji: "🔥", note: "Dedicated seeker and inner warmth" },
  manik: { emoji: "💎", note: "Brilliant jewel and treasured mind" },
  ratan: { emoji: "💎", note: "Precious gem of wisdom and integrity" },
  prodip: { emoji: "🕯️", note: "Guiding light and illuminating lantern" },
  kavinda: { emoji: "🎨", note: "Chief poet, artistic creator, and visionary" },
  fernando: { emoji: "🛡️", note: "Adventurous voyager and brave protector" },
  chaminda: { emoji: "🌟", note: "Illustrious conqueror and bright spirit" },
  nuwan: { emoji: "💎", note: "Wisdom, intellect, and precious jewel" },
};

/**
 * Dynamic Archetypes for Algorithmic Synthesis of Novel Names
 */
const INSPIRING_ARCHETYPES: Array<{ emoji: string; note: string }> = [
  { emoji: "🌟", note: "Radiant spirit, innovative mind, and pillar of excellence" },
  { emoji: "🛡️", note: "Courageous visionary, steadfast anchor, and loyal guide" },
  { emoji: "✨", note: "Inspiring presence, inner wisdom, and beacon of positivity" },
  { emoji: "🕊️", note: "Harmony bringer, benevolent heart, and thoughtful soul" },
  { emoji: "💎", note: "Treasured intellect, integrity-driven, and refined character" },
  { emoji: "🌿", note: "Continuous growth, resilient strength, and flourishing talent" },
  { emoji: "🏹", note: "Purpose-driven achiever, focused leader, and bold pioneer" },
  { emoji: "💡", note: "Creative illuminator, perceptive thinker, and problem solver" },
  { emoji: "⚡", note: "Dynamic energy, spirited drive, and enthusiastic contributor" },
  { emoji: "🧭", note: "Steadfast navigator, principled mentor, and trustworthy ally" },
  { emoji: "🌺", note: "Flourishing spirit, gracious demeanor, and inspiring warmth" },
  { emoji: "👑", note: "Empowering leader, visionary strategist, and noble guide" },
];

/**
 * Deterministic hash algorithm for stable synthesis across app refreshes
 */
function getDeterministicNameHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Returns structured name meaning details (emoji, short note, formatted full representation).
 * Automatically checks curated list first, then etymology tokens, then synthesizes dynamically in real-time.
 */
export function getMemberNameMeaningDetails(name?: string): NameMeaningDetails {
  if (!name || !name.trim()) {
    return {
      emoji: "✨",
      note: "Inspiring presence and dedicated team member",
      full: "✨ Inspiring presence and dedicated team member",
      source: "generative",
    };
  }

  const cleanName = name.trim();
  const lower = cleanName.toLowerCase();

  // 1. Check Exact or Substring match in Core Curated List
  for (const [key, val] of Object.entries(CURATED_TEAM_NAME_MEANINGS)) {
    if (lower.includes(key)) {
      return {
        emoji: val.emoji,
        note: val.note,
        full: `${val.emoji} ${val.note}`,
        source: "curated",
      };
    }
  }

  // 2. Tokenize and check Etymology Roots Dictionary
  const tokens = lower.split(/[\s,.-]+/).filter((t) => t.length >= 3);
  for (const token of tokens) {
    if (NAME_ROOTS_DICTIONARY[token]) {
      const val = NAME_ROOTS_DICTIONARY[token];
      return {
        emoji: val.emoji,
        note: val.note,
        full: `${val.emoji} ${val.note}`,
        source: "etymology",
      };
    }
  }

  // 3. Automated Real-Time Generative Synthesis for Novel Names
  const hash = getDeterministicNameHash(lower);
  const archetype = INSPIRING_ARCHETYPES[hash % INSPIRING_ARCHETYPES.length];

  return {
    emoji: archetype.emoji,
    note: archetype.note,
    full: `${archetype.emoji} ${archetype.note}`,
    source: "generative",
  };
}

/**
 * Backwards-compatible getter returning the short meaningful note.
 */
export function getMemberNameMeaning(name?: string): string {
  return getMemberNameMeaningDetails(name).note;
}

/**
 * Returns the uplifting emoji associated with the team member's name.
 */
export function getMemberNameMeaningEmoji(name?: string): string {
  return getMemberNameMeaningDetails(name).emoji;
}

/**
 * Returns the full string formatted with emoji and note.
 */
export function getMemberNameMeaningFull(name?: string): string {
  return getMemberNameMeaningDetails(name).full;
}
