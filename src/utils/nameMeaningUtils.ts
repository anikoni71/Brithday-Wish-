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
  etymology: string;
  inspiringNote: string;
  note: string;
  full: string;
  source: 'curated' | 'etymology' | 'generative';
}

export interface CuratedMeaningEntry {
  emoji: string;
  etymology: string;
  inspiringNote: string;
  note?: string;
}

/**
 * Curated Official Name Meanings for Core Team Members
 */
export const CURATED_TEAM_NAME_MEANINGS: Record<string, CuratedMeaningEntry> = {
  danushka: {
    emoji: "🏹",
    etymology: "Armed with a bow / Prosperous",
    inspiringNote: "A symbol of sharp focus, precision, and leading the team toward abundant success.",
    note: "Armed with a bow / Prosperous — A symbol of sharp focus, precision, and leading the team toward abundant success.",
  },
  zahid: {
    emoji: "✨",
    etymology: "Pious, dedicated, and devout",
    inspiringNote: "Radiating integrity, unwavering commitment, and a soulful dedication to excellence.",
    note: "Pious, dedicated, and devout — Radiating integrity, unwavering commitment, and a soulful dedication to excellence.",
  },
  khalid: {
    emoji: "♾️",
    etymology: "Eternal, enduring, and timeless",
    inspiringNote: "Representing resilience, steadfast character, and lasting contributions to the team.",
    note: "Eternal, enduring, and timeless — Representing resilience, steadfast character, and lasting contributions to the team.",
  },
  rasij: {
    emoji: "♾️",
    etymology: "Eternal, enduring, and timeless",
    inspiringNote: "Representing resilience, steadfast character, and lasting contributions to the team.",
    note: "Eternal, enduring, and timeless — Representing resilience, steadfast character, and lasting contributions to the team.",
  },
  abdulla: {
    emoji: "🤲",
    etymology: "Servant of God / Gracious soul",
    inspiringNote: "Embodying humility, kindness, and a compassionate spirit that uplifts everyone around.",
    note: "Servant of God / Gracious soul — Embodying humility, kindness, and a compassionate spirit that uplifts everyone around.",
  },
  abdullah: {
    emoji: "🤲",
    etymology: "Servant of God / Gracious soul",
    inspiringNote: "Embodying humility, kindness, and a compassionate spirit that uplifts everyone around.",
    note: "Servant of God / Gracious soul — Embodying humility, kindness, and a compassionate spirit that uplifts everyone around.",
  },
  bishnu: {
    emoji: "🛡️",
    etymology: "The Preserver and Protector",
    inspiringNote: "Acting as a dependable anchor, safeguarding teamwork and engineering stability.",
    note: "The Preserver and Protector — Acting as a dependable anchor, safeguarding teamwork and engineering stability.",
  },
  sudipta: {
    emoji: "🌟",
    etymology: "Bright, radiant, and illuminated",
    inspiringNote: "Bringing a spark of brilliant clarity and positive energy to every project.",
    note: "Bright, radiant, and illuminated — Bringing a spark of brilliant clarity and positive energy to every project.",
  },
  farjana: {
    emoji: "💡",
    etymology: "Wise, intelligent, and knowledgeable",
    inspiringNote: "A sharp analytical thinker providing insightful guidance and smart solutions.",
    note: "Wise, intelligent, and knowledgeable — A sharp analytical thinker providing insightful guidance and smart solutions.",
  },
  samon: {
    emoji: "🌸",
    etymology: "Precious Jasmine flower and valuable",
    inspiringNote: "Infusing grace, elegance, and treasured collaborative harmony into the workplace.",
    note: "Precious Jasmine flower and valuable — Infusing grace, elegance, and treasured collaborative harmony into the workplace.",
  },
  irfan: {
    emoji: "🕊️",
    etymology: "Deep knowledge, wisdom, and inner awareness",
    inspiringNote: "Offering thoughtful perspectives, profound clarity, and peaceful leadership.",
    note: "Deep knowledge, wisdom, and inner awareness — Offering thoughtful perspectives, profound clarity, and peaceful leadership.",
  },
  anik: {
    emoji: "🛡️",
    etymology: "Brave guardian and strong defender",
    inspiringNote: "A steadfast pillar of strength who protects the team's goals with courage.",
    note: "Brave guardian and strong defender — A steadfast pillar of strength who protects the team's goals with courage.",
  },
  farhad: {
    emoji: "😊",
    etymology: "Helper, joy, and elation",
    inspiringNote: "Bringing instant smiles, helpful hands, and an uplifting cheerful spirit to daily routines.",
    note: "Helper, joy, and elation — Bringing instant smiles, helpful hands, and an uplifting cheerful spirit to daily routines.",
  },
  ranjith: {
    emoji: "🎉",
    etymology: "Victorious and bringer of joy",
    inspiringNote: "Inspiring triumph, celebration, and high-spirited motivation across the board.",
    note: "Victorious and bringer of joy — Inspiring triumph, celebration, and high-spirited motivation across the board.",
  },
  rohan: {
    emoji: "🌿",
    etymology: "Ascending, growing, and reaching higher paths",
    inspiringNote: "Guiding continuous professional elevation, growth, and forward-thinking vision.",
    note: "Ascending, growing, and reaching higher paths — Guiding continuous professional elevation, growth, and forward-thinking vision.",
  },
  dipankar: {
    emoji: "🕯️",
    etymology: "Bringer of light and illumination",
    inspiringNote: "Dispelling challenges with clear guidance, optimism, and brilliant insight.",
    note: "Bringer of light and illumination — Dispelling challenges with clear guidance, optimism, and brilliant insight.",
  },
  tareq: {
    emoji: "⭐",
    etymology: "Morning star and guiding light",
    inspiringNote: "A dependable beacon of direction who starts every day with high purpose and momentum.",
    note: "Morning star and guiding light — A dependable beacon of direction who starts every day with high purpose and momentum.",
  },
  tariq: {
    emoji: "⭐",
    etymology: "Morning star and guiding light",
    inspiringNote: "A dependable beacon of direction who starts every day with high purpose and momentum.",
    note: "Morning star and guiding light — A dependable beacon of direction who starts every day with high purpose and momentum.",
  },
  asif: {
    emoji: "⚖️",
    etymology: "Strong, capable, and forgiving",
    inspiringNote: "Blending robust technical capability with a fair, gracious, and balanced nature.",
    note: "Strong, capable, and forgiving — Blending robust technical capability with a fair, gracious, and balanced nature.",
  },
  // Additional core roster teammate:
  arifur: {
    emoji: "👑",
    etymology: "Noble leader and wise guide",
    inspiringNote: "Cultivating disciplined planning, strategic vision, and thoughtful guidance.",
    note: "Noble leader and wise guide — Cultivating disciplined planning, strategic vision, and thoughtful guidance.",
  },
  syed: {
    emoji: "👑",
    etymology: "Noble leader and wise guide",
    inspiringNote: "Cultivating disciplined planning, strategic vision, and thoughtful guidance.",
    note: "Noble leader and wise guide — Cultivating disciplined planning, strategic vision, and thoughtful guidance.",
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
const INSPIRING_ARCHETYPES: Array<{ emoji: string; etymology: string; inspiringNote: string; note: string }> = [
  {
    emoji: "🌟",
    etymology: "Radiant spirit & innovative mind",
    inspiringNote: "Bringing brilliance, positive energy, and thoughtful innovation to every endeavor.",
    note: "Radiant spirit & innovative mind — Bringing brilliance, positive energy, and thoughtful innovation to every endeavor.",
  },
  {
    emoji: "🛡️",
    etymology: "Courageous visionary & steadfast anchor",
    inspiringNote: "Safeguarding the team's mission with dependable strength and loyal dedication.",
    note: "Courageous visionary & steadfast anchor — Safeguarding the team's mission with dependable strength and loyal dedication.",
  },
  {
    emoji: "✨",
    etymology: "Inspiring presence & inner wisdom",
    inspiringNote: "A beacon of positivity and integrity who elevates and enriches those around.",
    note: "Inspiring presence & inner wisdom — A beacon of positivity and integrity who elevates and enriches those around.",
  },
  {
    emoji: "🕊️",
    etymology: "Harmony bringer & benevolent heart",
    inspiringNote: "Fostering peaceful collaboration, mutual respect, and gracious goodwill.",
    note: "Harmony bringer & benevolent heart — Fostering peaceful collaboration, mutual respect, and gracious goodwill.",
  },
  {
    emoji: "💎",
    etymology: "Treasured intellect & refined character",
    inspiringNote: "Demonstrating genuine value, analytical clarity, and pristine integrity.",
    note: "Treasured intellect & refined character — Demonstrating genuine value, analytical clarity, and pristine integrity.",
  },
  {
    emoji: "🌿",
    etymology: "Continuous growth & resilient strength",
    inspiringNote: "Cultivating flourishing potential, perseverance, and sustainable progress.",
    note: "Continuous growth & resilient strength — Cultivating flourishing potential, perseverance, and sustainable progress.",
  },
  {
    emoji: "🏹",
    etymology: "Purpose-driven achiever & bold pioneer",
    inspiringNote: "Leading with razor-sharp focus and inspiring determination toward shared milestones.",
    note: "Purpose-driven achiever & bold pioneer — Leading with razor-sharp focus and inspiring determination toward shared milestones.",
  },
  {
    emoji: "💡",
    etymology: "Creative illuminator & perceptive thinker",
    inspiringNote: "Sparking fresh solutions, smart methodologies, and lucid problem-solving.",
    note: "Creative illuminator & perceptive thinker — Sparking fresh solutions, smart methodologies, and lucid problem-solving.",
  },
  {
    emoji: "⚡",
    etymology: "Dynamic energy & spirited drive",
    inspiringNote: "Infusing high motivation, swift execution, and vibrant enthusiasm into daily teamwork.",
    note: "Dynamic energy & spirited drive — Infusing high motivation, swift execution, and vibrant enthusiasm into daily teamwork.",
  },
  {
    emoji: "🧭",
    etymology: "Steadfast navigator & principled mentor",
    inspiringNote: "Providing sound direction, dependable stability, and principled guidance.",
    note: "Steadfast navigator & principled mentor — Providing sound direction, dependable stability, and principled guidance.",
  },
  {
    emoji: "🌺",
    etymology: "Flourishing spirit & gracious demeanor",
    inspiringNote: "Spreading genuine warmth, artistic grace, and treasured harmony across the team.",
    note: "Flourishing spirit & gracious demeanor — Spreading genuine warmth, artistic grace, and treasured harmony across the team.",
  },
  {
    emoji: "👑",
    etymology: "Empowering leader & noble visionary",
    inspiringNote: "Inspiring excellence, strategic fortitude, and long-lasting collective achievement.",
    note: "Empowering leader & noble visionary — Inspiring excellence, strategic fortitude, and long-lasting collective achievement.",
  },
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
 * Returns structured name meaning details (emoji, etymology, short inspiring note, formatted full representation).
 * Automatically checks curated list first, then etymology tokens, then synthesizes dynamically in real-time.
 */
export function getMemberNameMeaningDetails(name?: string): NameMeaningDetails {
  if (!name || !name.trim()) {
    return {
      emoji: "✨",
      etymology: "Inspiring presence and dedicated team member",
      inspiringNote: "Bringing steadfast dedication, positive energy, and valuable collaborative strength.",
      note: "Inspiring presence and dedicated team member — Bringing steadfast dedication, positive energy, and valuable collaborative strength.",
      full: "✨ Inspiring presence and dedicated team member — Bringing steadfast dedication, positive energy, and valuable collaborative strength.",
      source: "generative",
    };
  }

  const cleanName = name.trim();
  const lower = cleanName.toLowerCase();

  // 1. Check Exact or Substring match in Core Curated List
  for (const [key, val] of Object.entries(CURATED_TEAM_NAME_MEANINGS)) {
    if (lower.includes(key)) {
      const etymology = val.etymology || val.note || "Inspiring team member";
      const inspiringNote = val.inspiringNote || "A valued contributor dedicated to excellence and teamwork.";
      const note = val.note || `${etymology} — ${inspiringNote}`;
      return {
        emoji: val.emoji,
        etymology,
        inspiringNote,
        note,
        full: `${val.emoji} ${note}`,
        source: "curated",
      };
    }
  }

  // 2. Tokenize and check Etymology Roots Dictionary
  const tokens = lower.split(/[\s,.-]+/).filter((t) => t.length >= 3);
  for (const token of tokens) {
    if (NAME_ROOTS_DICTIONARY[token]) {
      const val = NAME_ROOTS_DICTIONARY[token];
      const etymology = val.note;
      const inspiringNote = "Demonstrating steadfast character, admirable dedication, and uplifting positivity.";
      const note = `${etymology} — ${inspiringNote}`;
      return {
        emoji: val.emoji,
        etymology,
        inspiringNote,
        note,
        full: `${val.emoji} ${note}`,
        source: "etymology",
      };
    }
  }

  // 3. Automated Real-Time Generative Synthesis for Novel Names
  const hash = getDeterministicNameHash(lower);
  const archetype = INSPIRING_ARCHETYPES[hash % INSPIRING_ARCHETYPES.length];

  return {
    emoji: archetype.emoji,
    etymology: archetype.etymology,
    inspiringNote: archetype.inspiringNote,
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
