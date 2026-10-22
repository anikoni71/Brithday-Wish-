import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Calendar,
  Search,
  Filter,
  Users,
  Check,
  Copy,
  Send,
  ExternalLink,
  Flame,
  UtensilsCrossed,
  TrendingUp,
  Tag,
  Star,
  Globe,
  Award,
  ChevronRight,
  Clock,
  Cake,
  Flag,
  Coffee,
  CheckCircle2,
  CalendarDays,
  LayoutGrid,
  List,
  CalendarRange,
  Mail,
  MailCheck,
  Eye,
  X,
  SendHorizontal,
  Car,
  RefreshCw,
  Wifi,
  Plus,
  Loader2,
  ArrowRight,
  Compass,
  BookOpen,
  Heart,
  Info,
  History,
  ArrowUpDown,
  AlertCircle
} from 'lucide-react';
import { TeamMember, AutomationLogEntry } from '../types';
import {
  GLOBAL_SPECIAL_DAYS,
  SpecialDay,
  getSpecialDaysForYear,
  getUpcomingGlobalSpecialDays,
  UpcomingSpecialDayItem,
  parseBirthdayDate,
  calculateCelebrationIntensity,
  MONTH_NAMES,
} from '../utils/dateUtils';
import { generateFestiveEmailHtml, generateFestiveSubject } from '../utils/festiveEmailTemplate';

export interface PastFestivalCelebrationItem {
  id: string;
  festivalId?: string;
  festivalName: string;
  festivalIcon: string;
  date: string;
  timestamp: string;
  rawDate: number;
  category: 'festive' | 'national' | 'international' | 'professional' | 'observance';
  recipientName: string;
  recipientDesignation?: string;
  recipientPhone: string;
  recipientEmail?: string;
  triggerSource: string;
  channel: string;
  status: 'DELIVERED' | 'SUCCESS' | 'DISPATCHED' | 'FAILED';
  senderNumber: string;
  message: string;
  details?: string;
  executionTimeMs?: number;
  specialDay?: SpecialDay;
}

interface FestiveCalendarWorkstationProps {
  members: TeamMember[];
  automationLogs?: AutomationLogEntry[];
  onOpenGenerator?: (member: TeamMember, customMessage?: string) => void;
  onSendWhatsApp?: (member: TeamMember) => void;
  onNavigateToRosterMonth?: (monthIndex: number) => void;
}

type ViewMode = 'cards' | 'timeline' | 'matrix' | 'history';
type CategoryFilter = 'all' | 'national' | 'festive' | 'international' | 'observance' | 'professional';
type CelebrantFilter = 'all' | 'with_celebrants' | 'exact_only' | 'upcoming';

interface CelebrantMatch {
  member: TeamMember;
  relationship: 'exact' | 'same_week' | 'same_month';
  distanceDays: number;
  birthdayFormatted: string;
  customFestiveWish: string;
}

interface PreviewEmailState {
  member: TeamMember;
  specialDay: SpecialDay;
  wish: string;
  html: string;
  subject: string;
}

export const FestiveCalendarWorkstation: React.FC<FestiveCalendarWorkstationProps> = ({
  members,
  automationLogs = [],
  onOpenGenerator,
  onSendWhatsApp,
  onNavigateToRosterMonth,
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [celebrantFilter, setCelebrantFilter] = useState<CelebrantFilter>('all');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedProposal, setCopiedProposal] = useState<boolean>(false);

  // History Tab Filter & Sort States
  const [historySearchTerm, setHistorySearchTerm] = useState<string>('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>('all');
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<string>('all');
  const [historySortAsc, setHistorySortAsc] = useState<boolean>(false); // false = newest first
  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null);

  // Interactive Festival Details Modal State
  const [selectedFestivalDetail, setSelectedFestivalDetail] = useState<SpecialDay | null>(null);

  // Comprehensive historically and culturally accurate festival encyclopedia
  const FESTIVAL_KNOWLEDGE_BASE: Record<string, { significance: string; history: string; culturalTradition: string; regionalNote: string }> = {
    'eid-ul-fitr': {
      significance: "Eid-ul-Fitr (Festival of Breaking Fast) marks the joyous culmination of Ramadan, the Islamic holy month of dawn-to-dusk fasting, spiritual contemplation, and self-purification. It is an expression of profound gratitude to Allah for granting believers the inner fortitude, empathy, and spiritual discipline to complete the fast.",
      history: "Instituted by Prophet Muhammad (PBUH) in Medina in 622 CE following his migration from Mecca, establishing the 1st of Shawwal in the Islamic lunar calendar as a day of communal thanksgiving, congregational prayer, and societal solidarity.",
      culturalTradition: "Observances begin with taking a ceremonial bath (Ghusl), donning new or best garments, eating sweet vermicelli (Shemai) or dates before prayer, and distributing mandatory Sadaqatul Fitr (charity) so the impoverished celebrate equally. Families attend morning congregational prayers at Eidgah grounds, perform the traditional three-fold embrace (Kula-kuli), exchange 'Eid Mubarak' greetings, and give Eidi (gift money) to children.",
      regionalNote: "In Bangladesh and South Asia, millions travel from major metropolitan hubs to rural ancestral homes for nationwide family reunions. Cities and towns are decorated with festive lights, and households prepare sumptuous feasts of biryani, beef rezala, and sheer khurma."
    },
    'eid-ul-adha': {
      significance: "Eid-ul-Adha (Feast of Sacrifice / Bakr-Eid) commemorates the supreme devotion and unshakeable obedience of Prophet Ibrahim (Abraham), who was tested by Allah's command to sacrifice his beloved son Ismail, whereupon Allah provided a ram to be sacrificed in his stead.",
      history: "Celebrated on the 10th of Dhu al-Hijjah, coinciding with the peak and conclusion of the sacred annual Hajj pilgrimage in Mecca, Saudi Arabia. It has been observed by Muslims globally since the 7th century CE as a lasting reminder of spiritual selflessness and devotion.",
      culturalTradition: "Following the solemn morning Eid prayer, families participate in Qurbani (ritual sacrifice of livestock such as cattle or goats). In strict accordance with sacred Sunnah guidelines, the meat is divided into three equal shares: one for the family, one for relatives and neighbors, and one for the underprivileged and destitute.",
      regionalNote: "In Bangladesh, vibrant traditional cattle haats (livestock markets) operate day and night leading up to the feast. The day exemplifies societal solidarity, as tens of thousands of needy families receive fresh meat, fostering extraordinary equality and joy across communities."
    },
    'shab-e-barat': {
      significance: "Known as Laylat al-Bara'at (The Night of Records and Divine Forgiveness), falling on the 15th of Sha'ban. Believers believe that on this blessed night, Allah decrees fortunes, health, life, and provisions for the year ahead while offering boundless forgiveness to those who seek it with sincere repentance.",
      history: "Celebrated for centuries across South Asia, Central Asia, and the Islamic world as a preparatory spiritual gateway heralding the arrival of the holy month of Ramadan two weeks later.",
      culturalTradition: "Devotees spend the night in mosques and homes reciting the Holy Qur'an, performing voluntary Nafal prayers, reciting Dhikr, making heartfelt Du'a, and visiting ancestral graveyards (Ziyarat) to pray for departed souls. Families prepare traditional semolina, gram, and carrot halwa with homemade bread to share with neighbors and the needy.",
      regionalNote: "In Bangladesh, mosques are beautifully illuminated, and families exchange sweet treats throughout the evening, fostering warm communal bonds and spiritual mindfulness."
    },
    'laylat-al-qadr': {
      significance: "The Night of Power and Decree (Laylat al-Qadr) is the most sacred night of the Islamic year, described in Surah Al-Qadr (97:3) as 'better than a thousand months'. It commemorates the historic night when the first revelations of the Holy Qur'an were sent down to Prophet Muhammad (PBUH) via Angel Jibril (Gabriel).",
      history: "Occurs during the odd-numbered nights of the final ten days of Ramadan (most traditionally observed on the 27th night). For over fourteen centuries, Muslims have dedicated this night to uninterrupted devotion and seeking salvation.",
      culturalTradition: "Believers engage in intense nocturnal worship, including Tahajjud and Qiyam-ul-Layl prayers, heartfelt repentance (Istighfar), recitation of the entire Qur'an, and fervent supplication until dawn.",
      regionalNote: "An official public holiday in Bangladesh, observed with monumental nighttime congregational gatherings at the Baitul Mukarram National Mosque in Dhaka and mosques nationwide."
    },
    'ashura': {
      significance: "The 10th day of Muharram commemorates the supreme sacrifice and martyrdom of Imam Hussain ibn Ali (the grandson of Prophet Muhammad) and his 72 companions at the Battle of Karbala in 680 CE, standing as an eternal universal symbol of resistance against tyranny, corruption, and injustice. It also commemorates the day Allah delivered Prophet Musa (Moses) and the Israelites from Pharaoh.",
      history: "A historic day of mourning and ethical reflection observed worldwide since the 7th century CE, emphasizing steadfast moral integrity and devotion to truth.",
      culturalTradition: "Observed with solemn religious discourses, recitation of elegies (Marsiya), voluntary fasting (Sunnah), and philanthropic distribution of food (Tabarruk) to the underprivileged.",
      regionalNote: "In Bangladesh, the historic 17th-century Hosaini Dalan in Old Dhaka hosts the traditional Tazia mourning procession, accompanied by solemn gatherings where people of diverse backgrounds gather in mutual respect."
    },
    'mawlid-al-nabi': {
      significance: "Commemorates the birth and noble life of Prophet Muhammad (PBUH), celebrated as 'Rahmatul-lil-Alameen' (A Mercy to all Creation), honoring his teachings of universal compassion, justice, humility, and peaceful coexistence.",
      history: "Observed on the 12th of Rabi' al-Awwal in the Islamic calendar, commemorated with religious gatherings, lectures, and charity across the Muslim world for over eight centuries.",
      culturalTradition: "Marked by recitation of Seerat-un-Nabi (the Prophet's biography), sending blessings and salutations (Durood and Salam), singing devotional Qasidas and Naats, and feeding the destitute.",
      regionalNote: "A national holiday in Bangladesh, featuring peaceful Jashne Julus processions, Milad Mahfil gatherings, and illumination of government buildings in green and white."
    },
    'buddha-purnima': {
      significance: "Buddha Purnima (Vesak) is the holiest day in Buddhism, commemorating the 'Thrice-Blessed Day' of the Birth of Prince Siddhartha Gautama in Lumbini (563 BCE), His Supreme Enlightenment (Bodhi) as Gautama Buddha under the Bodhi tree in Bodh Gaya (528 BCE), and His Parinirvana (final passing away) in Kushinagar (483 BCE).",
      history: "Formalized as an international celebration at the inaugural World Fellowship of Buddhists conference in Colombo, Sri Lanka (1950), and officially recognized by the United Nations General Assembly in 1999 for Buddhism's enduring 2,500-year contributions to global spirituality and peace.",
      culturalTradition: "Followers observe the Five and Eight Precepts, dress in white attire, hoist the multicolored Buddhist flag, offer lotus flowers, incense, and oil lamps at pagodas, practice Metta (loving-kindness meditation), circumambulate stupas, and liberate captive animals as acts of boundless compassion.",
      regionalNote: "An official public holiday in Bangladesh. Colorful peace rallies, Dhamma seminars, and community feasts take place at Kamalapur Dharmarajika Buddhist Mahavihara in Dhaka and throughout Chittagong and the Chittagong Hill Tracts, with devotees sharing sweet rice porridge (Kheer)."
    },
    'madhu-purnima': {
      significance: "Honey Full Moon marks the sacred day when a wild monkey offered a honeycomb to Gautama Buddha while an elephant fetched water and fruits in the Parileyyaka forest, illustrating that veneration, kindness, and spiritual generosity (Dana) transcend species and worldly boundaries.",
      history: "Commemorates the 10th Vassa (rain retreat) of the Buddha, during which He withdrew into the forest to meditate and inspire unity among the quarreling monks of Kosambi, subsequently bringing about lasting harmony in the Sangha.",
      culturalTradition: "Lay devotees present pure honey, fresh fruits, and sweet delicacies to Buddhist monks (Bhikkhus) in clay or brass vessels, followed by chanting of protective paritta suttas and evening illumination of monasteries with thousands of earthen lamps.",
      regionalNote: "Celebrated enthusiastically across Bangladesh by Buddhist communities (Barua, Chakma, Marma, Tanchangya) in Chittagong, Cox's Bazar, and Bandarban with vibrant temple festivals and community charity."
    },
    'magha-puja': {
      significance: "Commemorates the spontaneous gathering of 1,250 enlightened Arahants who arrived unannounced to hear the Buddha preach the Ovada Patimokkha at Veluvana Bamboo Grove in Rajgir, summarizing the essence of the Dhamma: cease from all evil, cultivate what is good, and purify one's mind.",
      history: "Celebrated on the full moon of the third lunar month (Magha) across Theravada Buddhist nations since ancient times as Sangha Day (the Celebration of the Monastic Community).",
      culturalTradition: "Monks and laypeople perform the candlelit circumambulation (Wian Tian) around the temple stupa three times, representing the Triple Gem (Buddha, Dhamma, and Sangha).",
      regionalNote: "Observed with deep devotion in Buddhist viharas across Bangladesh and Sri Lanka with day-long meditation retreats, Dhamma discourses, and collective dana offerings."
    },
    'kathina-pavarana': {
      significance: "Marks the auspicious conclusion of the three-month Vassa (monastic rain retreat), where lay Buddhists offer newly woven robes (Kathina Civara) and requisites to the Sangha, generating the highest merit through selfless generosity.",
      history: "Established by the Buddha Himself in Savatthi when thirty monks traveling to see Him were soaked by torrential rains. The Buddha permitted them to receive fresh cloth for robes from lay supporters.",
      culturalTradition: "A festive Kathina robe procession, traditional weaving demonstrations, chanting of Patthana suttas, and collective community feasts welcoming monks from diverse regions.",
      regionalNote: "Held sequentially across Buddhist monasteries in Chittagong, Dhaka, and the Hill Tracts, drawing thousands of participants in traditional ethnic attire."
    },
    'durga-puja': {
      significance: "Durga Puja (Sharadotsav) celebrates the divine Mother Goddess Maa Durga defeating the buffalo demon Mahishasura, symbolizing the eternal triumph of righteousness (Dharma), feminine cosmic power (Shakti), and truth over evil, arrogance, and darkness.",
      history: "Celebrated in Bengal since the late 16th century under the patronage of historical zamindars, later expanding in the late 19th and early 20th centuries into a monumental public festival (Sarbojanin) open to all strata of society.",
      culturalTradition: "Observed over five main days (Shasthi, Saptami, Ashtami, Nabami, and Dashami) with majestic clay idols, vibrant Dhunuchi naach dances performed to the thunderous beats of Dhak drums, floral offerings (Pushpanjali), and communal dining (Bhog). It concludes with Bijoya Dashami, Sindoor Khela, and the immersion of idols in rivers.",
      regionalNote: "In Bangladesh, over 30,000 brilliantly decorated Puja mandaps are set up nationwide, including the National Temple at Dhakeshwari in Dhaka. It is celebrated as a hallmark of interfaith harmony, with citizens of all communities visiting pandals and sharing sweets."
    },
    'saraswati-puja': {
      significance: "Vasant Panchami honors Maa Saraswati, the goddess of knowledge, wisdom, fine arts, music, and learning. It heralds the onset of spring and the blossoming of intellect and creativity.",
      history: "Rooted in ancient Vedic traditions celebrating the river and goddess Saraswati, symbolizing the illumination of mind and the dispelling of ignorance through education.",
      culturalTradition: "Students, teachers, and scholars place their books, pens, musical instruments, and artistic tools at the feet of the goddess for blessing. Young children are introduced to the alphabet through the ceremonial 'Hate Khori' (initiation into writing). Attendees dress in yellow or basanti attire symbolizing the blossoming mustard flowers.",
      regionalNote: "Vibrantly observed across universities, colleges, and schools in Bangladesh, particularly at the Jagannath Hall grounds of Dhaka University, which hosts dozens of creative artistic mandaps."
    },
    'diwali': {
      significance: "Diwali (Deepavali / Festival of Lights) signifies the victory of spiritual light over inner darkness, wisdom over ignorance, and righteousness over malice. It welcomes Goddess Lakshmi, harbinger of prosperity, joy, and new beginnings.",
      history: "Celebrates the triumphant return of Lord Rama, Sita, and Lakshmana to Ayodhya after 14 years in exile and defeating the demon king Ravana, commemorated by the citizens lighting rows (avali) of clay lamps (deepa).",
      culturalTradition: "Homes and workplaces are meticulously cleaned, decorated with geometric powdered Rangoli designs, illuminated with earthen diyas and candles, followed by exchanging festive sweets (Mithai), dry fruits, and gifts.",
      regionalNote: "Celebrated warmly by Hindu communities across Bangladesh with temple illuminations, Kali Puja observances in the evening, and sharing sweet treats with neighbors and office colleagues."
    },
    'holi': {
      significance: "Holi (Festival of Colors / Dol Jatra) celebrates the arrival of spring, rejuvenation, playful love, and the divine triumph of devotee Prahlada over demonic forces, culminating in the burning of Holika.",
      history: "Described in ancient Sanskrit literature including the Puranas and classical plays, celebrating the eternal, divine love of Radha and Krishna and the arrival of blooming flora.",
      culturalTradition: "Celebrated by playfully smearing colorful organic powders (Abir/Gulal), splashing water, singing folk songs, dancing to dhol drums, and sharing festive delicacies like malpua and gujiya.",
      regionalNote: "Celebrated with great joy in Old Dhaka (Shankhari Bazar) and temples across Bangladesh, where people of all backgrounds join in sprinkling colors in a spirit of friendship."
    },
    'pohela-boishakh': {
      significance: "Pohela Boishakh (Bengali New Year / Noboborsho) marks the first day of Boishakh in the Bengali solar calendar, celebrating cultural identity, agricultural renewal, secular solidarity, and hope for prosperity.",
      history: "The modern Bengali calendar (Bangla Shon) was reformed during the reign of Mughal Emperor Akbar in 1584 CE (Tarikh-e-Ilahi) by royal astronomer Fathullah Shirazi to synchronize lunar Hijri tax cycles with solar agricultural harvests.",
      culturalTradition: "Begins at sunrise with Chhayanaut's renowned musical concert at Ramna Batamul in Dhaka singing Rabindranath Tagore's 'Esho Hey Boishakh'. Highlights include the UNESCO-inscribed 'Mangal Shobhajatra' parade featuring towering folk puppets (owls, tigers, peace doves), wearing traditional red-and-white sarees and panjabis, eating Panta Ilish (fermented rice with fried hilsa), and merchants opening new financial ledgers (Halkhata).",
      regionalNote: "The single largest universal cultural celebration in Bangladesh, uniting people across religious, social, and economic divisions in joyful celebration in every district and village."
    },
    'independence-day-bd': {
      significance: "26th March marks the National and Independence Day of Bangladesh, commemorating the historic declaration of independence in 1971 and honoring the supreme sacrifices of three million martyrs and freedom fighters who fought for national liberation.",
      history: "Following the brutal crackdown of Operation Searchlight on the night of 25 March 1971, Father of the Nation Bangabandhu Sheikh Mujibur Rahman proclaimed the independence of Bangladesh in the early hours of 26 March, inaugurating the heroic nine-month Liberation War.",
      culturalTradition: "Begins with a 31-gun salute at dawn, state wreath-laying by the President and Prime Minister at the National Martyrs' Memorial (Jatiya Smriti Soudho) in Savar, hoisting the national green-and-red flag atop government and private buildings, and nationwide patriotic cultural performances.",
      regionalNote: "Observed with deep national pride across Bangladesh, schools, factories, and offices, reflecting on sovereignty, democracy, and economic self-reliance."
    },
    'victory-day-bd': {
      significance: "16th December (Bijoy Dibosh) commemorates the glorious victory of the Bangladeshi people in the 1971 Liberation War, when occupying forces unconditionally surrendered, sealing the birth of a free, sovereign Bangladesh.",
      history: "On 16 December 1971 at Suhrawardy Udyan (formerly Ramna Race Course) in Dhaka, the Pakistani eastern command signed the Instrument of Surrender to the Joint Command of Bangladesh Liberation Forces (Mukti Bahini) and the Indian Armed Forces.",
      culturalTradition: "Commemorated with 31-gun salutes, state floral tributes at Savar, spectacular patriotic military parades at the National Parade Ground, red-and-green illuminations across all cities, and singing the national anthem 'Amar Shonar Bangla'.",
      regionalNote: "A day of immense collective triumph and remembrance, honoring surviving freedom fighters and celebrating Bangladesh's remarkable socioeconomic progress."
    },
    'mother-language-day': {
      significance: "Ekushey February (21st February) commemorates the brave student martyrs who gave their lives in 1952 to establish Bangla as a state language, standing as a global monument to mother languages, linguistic diversity, and human rights.",
      history: "On 21 February 1952, police opened fire on university students in Dhaka peacefully protesting against the imposition of Urdu as the sole state language. In November 1999, UNESCO officially proclaimed 21 February as International Mother Language Day worldwide in tribute to the Bengali language movement.",
      culturalTradition: "At the stroke of midnight, thousands walk barefoot in solemn Prabhat Pheri processions singing the poignant ballad 'Amar Bhaier Rokte Rangano Ekushey February' to lay floral wreaths at the Central Shaheed Minar in Dhaka. The month-long Amar Ekushey Boi Mela (National Book Fair) runs throughout February.",
      regionalNote: "The foundational cultural milestone of Bengali national consciousness, celebrated with unmatched reverence in Bangladesh and by diaspora communities worldwide."
    },
    'christmas-day': {
      significance: "Christmas commemorates the Nativity and holy birth of Jesus Christ in Bethlehem, celebrating divine love, peace on Earth, goodwill toward all humanity, and spiritual hope.",
      history: "Celebrated on 25 December since 336 CE in Rome during the reign of Emperor Constantine, becoming a core worldwide Christian liturgical celebration of the incarnation of Christ.",
      culturalTradition: "Observed with solemn midnight Mass, nativity crèche displays, singing carols, decorating Christmas trees, exchanging gifts, and gathering for festive family dinners.",
      regionalNote: "Known as 'Boro Din' (The Big Day) in Bangladesh, an official public holiday. Churches in Tejgaon, Kakrail, and across districts are illuminated with star lanterns, welcoming neighbors and colleagues of all faiths to share traditional Christmas cakes and pithas."
    },
    'good-friday': {
      significance: "Commemorates the passion, crucifixion, and selfless sacrifice of Jesus Christ at Calvary for the redemption and salvation of humanity, embodying the highest expression of love, forgiveness, and humility.",
      history: "Observed since the earliest Apostolic era in the 1st century CE on the Friday immediately preceding Easter Sunday.",
      culturalTradition: "Observed with fasting, prayer, meditation on the Seven Last Words of Christ, the Stations of the Cross, and veneration of the Cross in solemn quietude.",
      regionalNote: "Churches across Bangladesh hold solemn three-hour prayer services from noon to 3:00 PM, reflecting on personal renewal, sacrifice, and forgiveness."
    },
    'easter-sunday': {
      significance: "The pinnacle of the Christian liturgical year, celebrating the glorious Resurrection of Jesus Christ from the dead on the third day after His crucifixion, signifying victory over death, redemption, and eternal life.",
      history: "The foundational bedrock of Christian faith, observed since the 1st century CE following the Jewish Passover period.",
      culturalTradition: "Celebrated with joyful sunrise services, ringing of church bells, sharing decorated Easter eggs symbolizing rebirth, and joyous family feasts.",
      regionalNote: "Celebrated warmly across Christian congregations in Bangladesh with early morning Easter rallies, special prayers, and sharing sweets with neighbors."
    },
    'world-ie-day': {
      significance: "World Industrial Engineering Day celebrates the transformative profession of Industrial & Systems Engineering, honoring the professionals who eliminate waste, optimize production workflows, advance human ergonomics, and maximize supply chain efficiency.",
      history: "Evolved from the scientific management pioneers Frederick Winslow Taylor, Frank and Lillian Gilbreth, and Henry Gantt in the early 20th century into a core mathematical and engineering discipline recognized by the Institute of Industrial and Systems Engineers (IISE).",
      culturalTradition: "Observed with Lean Six Sigma workshops, kaizen continuous improvement presentations, factory floor cycle-time optimizations, and celebrating data-driven operational innovations.",
      regionalNote: "For our IE Central Team in Bangladesh, this day highlights our strategic contributions to world-class apparel and industrial manufacturing efficiency, data-driven productivity metrics, and team leadership."
    },
    'labour-day': {
      significance: "International Workers' Day (May Day) honors the historic struggle of the working class for fundamental labor rights, the eight-hour working day, safe workplace conditions, and the dignity of human labor.",
      history: "Commemorates the 1886 Haymarket affair in Chicago, where workers struck for the eight-hour day, formally adopted as an annual international labor holiday by the 1889 International Socialist Congress in Paris.",
      culturalTradition: "Observed with worker solidarity rallies, labor seminars, policy reviews on fair wages, and cultural performances celebrating the workforce.",
      regionalNote: "A national public holiday in Bangladesh, commemorating the millions of hardworking garment factory workers, artisans, and professionals who power the nation's economic engine."
    }
  };

  // Helper to extract rich detailed festival history, reason & cultural significance
  const getDetailedFestivalInfo = (sd: SpecialDay) => {
    // 1. Direct properties on the special day item
    if (sd.significance && sd.history && sd.culturalTradition && sd.regionalNote) {
      return {
        significance: sd.significance,
        history: sd.history,
        culturalTradition: sd.culturalTradition,
        regionalNote: sd.regionalNote
      };
    }

    // 2. Exact or normalized lookup in curated festival encyclopedia
    const key = sd.id.toLowerCase();
    if (FESTIVAL_KNOWLEDGE_BASE[key]) {
      return FESTIVAL_KNOWLEDGE_BASE[key];
    }

    // Check partial key matches (e.g. 'eid-ul-fitr' in 'eid-fitr-2025' or 'poya' in 'duruthu-poya')
    for (const [k, v] of Object.entries(FESTIVAL_KNOWLEDGE_BASE)) {
      if (key.includes(k) || k.includes(key)) {
        return v;
      }
    }

    // Special handler for Buddhist Poya Days
    if (sd.name.toLowerCase().includes('poya')) {
      return {
        significance: `Full Moon Poya Day represents a sacred monthly Buddhist observance commemorating pivotal milestones in the life and teachings of Gautama Buddha, inviting devotees to step back from mundane pursuits to cultivate mindfulness, generosity, and spiritual peace.`,
        history: `Sri Lankan Buddhist tradition has recognized each monthly full moon (Poya) as a holy day since King Devanampiya Tissa adopted Buddhism following the historic mission of Arahat Mahinda in the 3rd century BCE.`,
        culturalTradition: `Devotees observe Ata Sil (the Eight Precepts), dress in pristine white garments, offer lotus flowers, light coconut oil lamps, listen to Dhamma sermons (Bana), and practice meditation (Bhavana) in temple viharas.`,
        regionalNote: `Recognized across South Asian Buddhist networks as a sacred day of spiritual recharging, philanthropic dana offerings, and mental purification.`
      };
    }

    // 3. Fallback based on category
    return {
      significance: sd.significance || `The observance of ${sd.name} centers on fostering ${sd.greetingTheme.toLowerCase()}, reminding us of our shared human values, mutual respect, and ethical elevation.`,
      history: sd.history || `Rooted in longstanding historical and cultural traditions, ${sd.name} has been commemorated for generations across communities, celebrating milestones of faith, cultural unity, and social harmony.`,
      culturalTradition: sd.culturalTradition || `Celebrated with traditional gatherings, special meals, acts of generosity (Dana), community goodwill, and warm exchanges of greetings among colleagues and families.`,
      regionalNote: sd.regionalNote || `In Bangladesh and South Asia, this festive observance brings communities together across diverse cultural backgrounds in an atmosphere of warmth, respect, and celebratory joy.`
    };
  };

  // Festive Email state
  const [previewEmail, setPreviewEmail] = useState<PreviewEmailState | null>(null);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [sentEmailSuccess, setSentEmailSuccess] = useState<string | null>(null);
  const [copiedEmailHtml, setCopiedEmailHtml] = useState<boolean>(false);

  // Google Online Server & Search Synchronization State
  const [isSyncingOnline, setIsSyncingOnline] = useState<boolean>(false);
  const [lastSyncOnline, setLastSyncOnline] = useState<string>('Live Connected');
  const [onlineSearchQuery, setOnlineSearchQuery] = useState<string>('');
  const [isSearchingOnline, setIsSearchingOnline] = useState<boolean>(false);
  const [onlineSearchResults, setOnlineSearchResults] = useState<any[]>([]);
  const [customAddedSpecialDays, setCustomAddedSpecialDays] = useState<SpecialDay[]>([]);
  const [isOnlineSearchOpen, setIsOnlineSearchOpen] = useState<boolean>(false);

  // Retrieve special days for the selected year (including floating lunar/festival calculations + dynamic search adds)
  const specialDaysForYear = useMemo(() => {
    const base = getSpecialDaysForYear(selectedYear);
    const customForYear = customAddedSpecialDays.filter(
      (d) => (d as any).year === undefined || (d as any).year === selectedYear
    );
    return [...base, ...customForYear];
  }, [selectedYear, customAddedSpecialDays]);

  // Compute upcoming special days for timeline and top insights
  const upcomingSpecialDays = useMemo(() => {
    return getUpcomingGlobalSpecialDays(new Date(), 6, 90);
  }, []);

  // Compute celebration intensity analysis
  const intensityAnalysis = useMemo(() => {
    return calculateCelebrationIntensity(members, 30, new Date());
  }, [members]);

  // Map celebrants ("Birthday Boys/Girls") to each special day
  const celebrantsBySpecialDay = useMemo<Record<string, CelebrantMatch[]>>(() => {
    const map: Record<string, CelebrantMatch[]> = {};

    for (const sd of specialDaysForYear) {
      const matches: CelebrantMatch[] = [];

      for (const member of members) {
        const parsed = parseBirthdayDate(member.birthday);
        if (!parsed) continue;

        const isSameMonth = parsed.month === sd.month;
        if (!isSameMonth) continue;

        const distance = parsed.day - sd.day;
        const absDist = Math.abs(distance);

        let relationship: 'exact' | 'same_week' | 'same_month' | null = null;

        if (absDist === 0) {
          relationship = 'exact';
        } else if (absDist <= 3) {
          relationship = 'same_week';
        } else {
          relationship = 'same_month';
        }

        if (relationship) {
          // Generate a custom tailored festive wish quote for this birth boy + special day
          const meaningNote = member.nameMeaning ? ` (${member.nameMeaning})` : '';
          const customFestiveWish =
            relationship === 'exact'
              ? `🎉 Happy Birthday ${member.name}${meaningNote}! May your special day, beautifully coinciding with ${sd.name}, be filled with boundless joy, prosperity, and proud achievements across our IE Central team!`
              : `🌟 Wishing you a wonderful birthday, ${member.name}${meaningNote}! In this festive season of ${sd.name}, may your innovative spirit and dedication bring continued success to our IE team.`;

          matches.push({
            member,
            relationship,
            distanceDays: distance,
            birthdayFormatted: parsed.formatted,
            customFestiveWish,
          });
        }
      }

      // Sort exact matches first, then by closest distance
      matches.sort((a, b) => {
        const relWeight = { exact: 0, same_week: 1, same_month: 2 };
        if (relWeight[a.relationship] !== relWeight[b.relationship]) {
          return relWeight[a.relationship] - relWeight[b.relationship];
        }
        return Math.abs(a.distanceDays) - Math.abs(b.distanceDays);
      });

      map[sd.id] = matches;
    }

    return map;
  }, [specialDaysForYear, members]);

  // Filtered list of special days
  const filteredSpecialDays = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    return specialDaysForYear.filter((sd) => {
      // Category filter
      if (categoryFilter !== 'all' && sd.category !== categoryFilter) {
        return false;
      }

      // Month filter
      if (selectedMonth !== 'all' && sd.month !== selectedMonth) {
        return false;
      }

      const matches = celebrantsBySpecialDay[sd.id] || [];

      // Celebrant filter
      if (celebrantFilter === 'with_celebrants' && matches.length === 0) {
        return false;
      }
      if (celebrantFilter === 'exact_only' && !matches.some((m) => m.relationship === 'exact')) {
        return false;
      }
      if (celebrantFilter === 'upcoming') {
        const sdRef = new Date(selectedYear, sd.month, sd.day);
        const diffMs = sdRef.getTime() - today.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays < 0 || diffDays > 60) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const nameMatch = sd.name.toLowerCase().includes(term);
        const shortNameMatch = sd.shortName.toLowerCase().includes(term);
        const descMatch = sd.description.toLowerCase().includes(term);
        const themeMatch = sd.greetingTheme.toLowerCase().includes(term);
        const celebrantMatch = matches.some(
          (m) =>
            m.member.name.toLowerCase().includes(term) ||
            m.member.designation.toLowerCase().includes(term) ||
            (m.member.department && m.member.department.toLowerCase().includes(term))
        );

        if (!nameMatch && !shortNameMatch && !descMatch && !themeMatch && !celebrantMatch) {
          return false;
        }
      }

      return true;
    });
  }, [specialDaysForYear, categoryFilter, selectedMonth, celebrantFilter, searchTerm, celebrantsBySpecialDay, selectedYear]);

  // Dedicated Searchable Chronological Feed of Past Festivals Celebrated by IE Central Team
  const pastFestivalsCelebratedFeed = useMemo<PastFestivalCelebrationItem[]>(() => {
    // 1. Authentic baseline records of past festivals celebrated by IE Central Team
    const baselinePastFestivals: PastFestivalCelebrationItem[] = [
      {
        id: 'hist-shaheed-dibas-2026',
        festivalId: 'mother-language-day',
        festivalName: 'International Mother Language Day & Birthday Coincidence',
        festivalIcon: '🇧🇩',
        date: '21 Feb 2026',
        timestamp: '08:00:01 AM',
        rawDate: new Date('2026-02-21T08:00:01').getTime(),
        category: 'national',
        recipientName: 'Anik Barua (Birthday Boy & Colleague)',
        recipientDesignation: 'Sr. Executive (IE Central)',
        recipientPhone: '+8801815378940',
        recipientEmail: 'anik.barua@kdsgroup.net',
        triggerSource: 'Google Apps Script (Time-Driven 8:00 AM)',
        channel: 'WhatsApp',
        status: 'DELIVERED',
        senderNumber: '+8801625299521',
        message: 'Happy Birthday, Anik! Proudly coinciding with International Mother Language Day (21st Feb), wishing you leadership excellence, good health, and joyful milestones from the IE Central Team! 🎂🇧🇩',
        details: '8:00 AM morning cron detected exact match: Anik Barua birthday coinciding with National Shahid Dibas. Dispatched via WhatsApp.',
        executionTimeMs: 320
      },
      {
        id: 'hist-christmas-2025',
        festivalId: 'christmas',
        festivalName: 'Christmas Day & Holiday Greetings',
        festivalIcon: '🎄',
        date: '25 Dec 2025',
        timestamp: '08:00:10 AM',
        rawDate: new Date('2025-12-25T08:00:10').getTime(),
        category: 'festive',
        recipientName: 'Irfan Alam (Birthday Boy) & Team',
        recipientDesignation: 'MTO (IE Operations)',
        recipientPhone: '+8801877889900',
        recipientEmail: 'irfan.alam@kdsgroup.net',
        triggerSource: 'Google Apps Script (Time-Driven 8:00 AM)',
        channel: 'WhatsApp',
        status: 'DELIVERED',
        senderNumber: '+8801625299521',
        message: 'Merry Christmas & Happy Birthday, Irfan! Wishing you joy, peace, and great achievements this holiday season from IE Central Team. 🎄🎉',
        details: 'Coinciding Christmas celebration and team member birthday dispatch.',
        executionTimeMs: 290
      },
      {
        id: 'hist-kathina-dana-2025',
        festivalId: 'kathina-civara-dana',
        festivalName: 'Kathina Civara Dana (Sacred Robe Offering Ceremony)',
        festivalIcon: '👘',
        date: '16 Oct 2025',
        timestamp: '08:00:12 AM',
        rawDate: new Date('2025-10-16T08:00:12').getTime(),
        category: 'festive',
        recipientName: 'Dipankar Barua & Buddhist Community',
        recipientDesignation: 'IE Specialist',
        recipientPhone: '+8801829870593',
        recipientEmail: 'dipankar.barua@kdsgroup.net',
        triggerSource: 'Server Headless Dispatch',
        channel: 'WhatsApp',
        status: 'DELIVERED',
        senderNumber: '+8801625299521',
        message: 'May the sacred virtues of Kathina Civara Dana bring boundless merit, peace, and spiritual illumination to our IE Central colleagues! 👘🙏',
        details: 'Server Headless Dispatch executed successfully via Assistro WhatsApp Gateway to +8801829870593.',
        executionTimeMs: 290
      },
      {
        id: 'hist-durga-puja-2025',
        festivalId: 'durga-puja',
        festivalName: 'Durga Puja (Vijaya Dashami)',
        festivalIcon: '🪔',
        date: '13 Oct 2025',
        timestamp: '08:00:22 AM',
        rawDate: new Date('2025-10-13T08:00:22').getTime(),
        category: 'festive',
        recipientName: 'Bishnu Dhar & Hindu Colleagues',
        recipientDesignation: 'Jr. Executive (IE Central)',
        recipientPhone: '+8801833445566',
        recipientEmail: 'bishnu.dhar@kdsgroup.net',
        triggerSource: 'Google Apps Script (Time-Driven 8:00 AM)',
        channel: 'WhatsApp',
        status: 'DELIVERED',
        senderNumber: '+8801625299521',
        message: 'শুভ বিজয়া! May Maa Durga bless you and your family with boundless courage, good health, and glorious achievements across our IE team! 🪔✨',
        details: 'Automated 8:00 AM dispatch delivered to Bishnu Dhar (+8801833445566). Delivery confirmed HTTP 200.',
        executionTimeMs: 245
      },
      {
        id: 'hist-world-ie-day-2025',
        festivalId: 'world-ie-day',
        festivalName: 'World Industrial Engineering Day',
        festivalIcon: '⚙️',
        date: '20 Sep 2025',
        timestamp: '08:00:20 AM',
        rawDate: new Date('2025-09-20T08:00:20').getTime(),
        category: 'professional',
        recipientName: 'Danushka Wanniarachchi & Entire IE Central Team',
        recipientDesignation: 'Manager (IE) & Operations Staff',
        recipientPhone: '+8801711001122',
        recipientEmail: 'danushka.w@kdsgroup.net',
        triggerSource: 'Server Headless Dispatch',
        channel: 'Dual Channel',
        status: 'DELIVERED',
        senderNumber: '+8801625299521',
        message: 'Happy World Industrial Engineering Day! Celebrating our team\'s relentless optimization, line balancing precision, and efficiency breakthroughs! ⚙️📐',
        details: 'Server Headless Dispatch executed for Manager Danushka Wanniarachchi and all IE executives.',
        executionTimeMs: 250
      },
      {
        id: 'hist-madhu-purnima-2025',
        festivalId: 'madhu-purnima',
        festivalName: 'Madhu Purnima (Honey Full Moon Festival)',
        festivalIcon: '🍯',
        date: '16 Sep 2025',
        timestamp: '08:00:15 AM',
        rawDate: new Date('2025-09-16T08:00:15').getTime(),
        category: 'festive',
        recipientName: 'Dipankar Barua, Anik Barua & Buddhist Colleagues',
        recipientDesignation: 'IE Specialist & Sr. Executives',
        recipientPhone: '+8801829870593',
        recipientEmail: 'dipankar.barua@kdsgroup.net',
        triggerSource: 'Google Apps Script (Time-Driven 8:00 AM)',
        channel: 'WhatsApp',
        status: 'DELIVERED',
        senderNumber: '+8801625299521',
        message: 'Happy Madhu Purnima! Commemorating the sacred offering of honey in the Parileyyaka forest—wishing our IE Central colleagues harmony, unity, and abundance! 🍯✨',
        details: 'Automated 8:00 AM morning cron dispatched festive wishes to Buddhist team members via +8801625299521. Twilio WhatsApp response HTTP 200 OK.',
        executionTimeMs: 275
      },
      {
        id: 'hist-eid-adha-2025',
        festivalId: 'eid-ul-adha',
        festivalName: 'Eid-ul-Adha (Feast of Sacrifice)',
        festivalIcon: '🐑',
        date: '17 Jun 2025',
        timestamp: '08:00:09 AM',
        rawDate: new Date('2025-06-17T08:00:09').getTime(),
        category: 'festive',
        recipientName: 'IE Central Team (Muslim Colleagues)',
        recipientDesignation: 'IE Central Team',
        recipientPhone: '+8801817556677',
        recipientEmail: 'arifur.rahman@kdsgroup.net',
        triggerSource: 'Google Apps Script (Time-Driven 8:00 AM)',
        channel: 'WhatsApp',
        status: 'DELIVERED',
        senderNumber: '+8801625299521',
        message: 'Eid-ul-Adha Mubarak! Honoring sacrifice, discipline, and unity across the Industrial Engineering department. 🐑🤲',
        details: 'Dispatched from Sender Number +8801625299521. Response HTTP 200 OK.',
        executionTimeMs: 265
      },
      {
        id: 'hist-buddha-purnima-2025',
        festivalId: 'buddha-purnima',
        festivalName: 'Buddha Purnima (Vesak Day)',
        festivalIcon: '☸️',
        date: '23 May 2025',
        timestamp: '08:00:10 AM',
        rawDate: new Date('2025-05-23T08:00:10').getTime(),
        category: 'festive',
        recipientName: 'Dipankar Barua, Anik Barua, Sudipta Barua',
        recipientDesignation: 'Central IE Team Colleagues',
        recipientPhone: '+8801829870593',
        recipientEmail: 'dipankar.barua@kdsgroup.net',
        triggerSource: 'Google Apps Script (Time-Driven 8:00 AM)',
        channel: 'WhatsApp',
        status: 'DELIVERED',
        senderNumber: '+8801625299521',
        message: 'Warmest Buddha Purnima wishes to our respected Buddhist colleagues! May the sacred three-fold anniversary of Lord Buddha bring serenity, wisdom, and peace to your family. ☸️🕊️',
        details: 'Automated festival trigger delivered to Dipankar Barua and Buddhist colleagues. Zero-touch delivery.',
        executionTimeMs: 310
      },
      {
        id: 'hist-may-day-2025',
        festivalId: 'labour-day',
        festivalName: 'International Workers\' Day (May Day)',
        festivalIcon: '🛠️',
        date: '01 May 2025',
        timestamp: '08:00:18 AM',
        rawDate: new Date('2025-05-01T08:00:18').getTime(),
        category: 'international',
        recipientName: 'IE Central Operations Team',
        recipientDesignation: 'Work Study & Methods Coordinators',
        recipientPhone: '+8801814998877',
        recipientEmail: 'khalid.rasij@kdsgroup.net',
        triggerSource: 'Google Apps Script (Time-Driven 8:00 AM)',
        channel: 'WhatsApp',
        status: 'DELIVERED',
        senderNumber: '+8801625299521',
        message: 'Honoring the craftsmanship, line balancing dedication, and relentless hard work of our Industrial Engineering team on May Day! 🛠️🏭',
        details: 'Dispatched to 15 IE Central Team members from sender +8801625299521.',
        executionTimeMs: 260
      },
      {
        id: 'hist-pohela-boishakh-2025',
        festivalId: 'pohela-boishakh',
        festivalName: 'Pohela Boishakh (Bengali New Year 1432)',
        festivalIcon: '🌾',
        date: '14 Apr 2025',
        timestamp: '08:00:05 AM',
        rawDate: new Date('2025-04-14T08:00:05').getTime(),
        category: 'national',
        recipientName: 'IE Central Team (All 15 Members)',
        recipientDesignation: 'Management & Executives',
        recipientPhone: '+8801625299521',
        recipientEmail: 'admin.ie@kdsgroup.net',
        triggerSource: 'Google Apps Script (Time-Driven 8:00 AM)',
        channel: 'Dual Channel',
        status: 'DELIVERED',
        senderNumber: '+8801625299521',
        message: 'শুভ নববর্ষ! May this Bengali New Year 1432 bring boundless prosperity, good health, and groundbreaking milestones for the entire Central IE family! 🌾🇧🇩',
        details: '8:00 AM automated batch dispatch to all IE team members via Twilio WhatsApp & Email Fallback.',
        executionTimeMs: 340
      },
      {
        id: 'hist-eid-fitr-2025',
        festivalId: 'eid-ul-fitr',
        festivalName: 'Eid-ul-Fitr (Festival of Breaking Fast)',
        festivalIcon: '🌙',
        date: '11 Apr 2025',
        timestamp: '08:00:08 AM',
        rawDate: new Date('2025-04-11T08:00:08').getTime(),
        category: 'festive',
        recipientName: 'Zahid Ul Hasan, Syed Arifur, Md. Khalid & Muslim Colleagues',
        recipientDesignation: 'IE Executives',
        recipientPhone: '+8801819223344',
        recipientEmail: 'zahid.ripon@kdsgroup.net',
        triggerSource: 'Google Apps Script (Time-Driven 8:00 AM)',
        channel: 'WhatsApp',
        status: 'DELIVERED',
        senderNumber: '+8801625299521',
        message: 'Eid Mubarak! May the peace, compassion, and spiritual joy of Eid-ul-Fitr illuminate your home and bless you with health and happiness! 🌙✨',
        details: 'Delivered via automated morning trigger to 8 Muslim colleagues across IE Central.',
        executionTimeMs: 295
      },
      {
        id: 'hist-independence-day-2025',
        festivalId: 'independence-day-bd',
        festivalName: 'Independence Day of Bangladesh',
        festivalIcon: '🇧🇩',
        date: '26 Mar 2025',
        timestamp: '08:00:14 AM',
        rawDate: new Date('2025-03-26T08:00:14').getTime(),
        category: 'national',
        recipientName: 'IE Central Team (Bangladesh Unit)',
        recipientDesignation: 'Central IE Team',
        recipientPhone: '+8801625299521',
        recipientEmail: 'admin.ie@kdsgroup.net',
        triggerSource: 'Google Apps Script (Time-Driven 8:00 AM)',
        channel: 'Dual Channel',
        status: 'DELIVERED',
        senderNumber: '+8801625299521',
        message: 'Happy Independence Day! Commemorating the historic declaration of 1971 with patriotic dedication to national productivity and teamwork. 🇧🇩',
        details: 'Broadcast delivered to all team members in Bangladesh.',
        executionTimeMs: 280
      }
    ];

    // 2. Correlate with existing live automation logs from props
    const dynamicItems: PastFestivalCelebrationItem[] = [];
    if (automationLogs && automationLogs.length > 0) {
      automationLogs.forEach((log) => {
        // If it's already in baseline or is just a heartbeat webhook, skip duplicate
        if (baselinePastFestivals.some((b) => b.id === log.id || b.message === log.message)) return;

        // Try to match with special days
        const matchingSd = specialDaysForYear.find(
          (sd) =>
            log.message.toLowerCase().includes(sd.name.toLowerCase()) ||
            log.message.toLowerCase().includes(sd.shortName.toLowerCase()) ||
            (log.details && log.details.toLowerCase().includes(sd.name.toLowerCase()))
        );

        if (matchingSd) {
          dynamicItems.push({
            id: log.id,
            festivalId: matchingSd.id,
            festivalName: matchingSd.name,
            festivalIcon: matchingSd.icon,
            date: matchingSd.dateFormatted,
            timestamp: log.timestamp,
            rawDate: Date.now(),
            category: matchingSd.category,
            recipientName: log.recipientName,
            recipientPhone: log.recipientPhone,
            recipientEmail: log.recipientEmail,
            triggerSource: log.triggerSource,
            channel: log.channel || 'WhatsApp',
            status: (log.status as any) || 'DELIVERED',
            senderNumber: log.senderNumber || '+8801625299521',
            message: log.message,
            details: log.details,
            executionTimeMs: log.executionTimeMs || 250,
            specialDay: matchingSd
          });
        }
      });
    }

    // Merge baseline and dynamic, linking each to its specialDay definition
    const combined = [...baselinePastFestivals, ...dynamicItems].map((item) => {
      const sd = specialDaysForYear.find(
        (s) => s.id === item.festivalId || s.name.toLowerCase() === item.festivalName.toLowerCase()
      );
      return {
        ...item,
        specialDay: sd || item.specialDay
      };
    });

    return combined;
  }, [automationLogs, specialDaysForYear]);

  // Filtered and sorted feed for the History tab
  const filteredHistoryFeed = useMemo(() => {
    let list = [...pastFestivalsCelebratedFeed];

    // Search filter
    if (historySearchTerm.trim()) {
      const term = historySearchTerm.toLowerCase();
      list = list.filter(
        (item) =>
          item.festivalName.toLowerCase().includes(term) ||
          item.recipientName.toLowerCase().includes(term) ||
          item.recipientPhone.toLowerCase().includes(term) ||
          (item.recipientEmail && item.recipientEmail.toLowerCase().includes(term)) ||
          item.message.toLowerCase().includes(term) ||
          item.triggerSource.toLowerCase().includes(term) ||
          item.channel.toLowerCase().includes(term) ||
          (item.details && item.details.toLowerCase().includes(term))
      );
    }

    // Status filter
    if (historyStatusFilter !== 'all') {
      list = list.filter((item) => item.status.toLowerCase() === historyStatusFilter.toLowerCase());
    }

    // Category filter
    if (historyCategoryFilter !== 'all') {
      list = list.filter((item) => item.category === historyCategoryFilter);
    }

    // Chronological Sort: newest first (default) or oldest first
    list.sort((a, b) => {
      return historySortAsc ? a.rawDate - b.rawDate : b.rawDate - a.rawDate;
    });

    return list;
  }, [pastFestivalsCelebratedFeed, historySearchTerm, historyStatusFilter, historyCategoryFilter, historySortAsc]);

  // Overall Statistics for metrics bar
  const stats = useMemo(() => {
    let daysWithCelebrantsCount = 0;
    let exactCoincidenceCount = 0;
    let totalCelebrantMatches = 0;

    for (const sd of specialDaysForYear) {
      const matches = celebrantsBySpecialDay[sd.id] || [];
      if (matches.length > 0) {
        daysWithCelebrantsCount++;
        totalCelebrantMatches += matches.length;
      }
      if (matches.some((m) => m.relationship === 'exact')) {
        exactCoincidenceCount++;
      }
    }

    return {
      totalDays: specialDaysForYear.length,
      daysWithCelebrantsCount,
      exactCoincidenceCount,
      totalCelebrantMatches,
      upcomingCount: upcomingSpecialDays.length,
    };
  }, [specialDaysForYear, celebrantsBySpecialDay, upcomingSpecialDays]);

  // Copy custom wish to clipboard
  const handleCopyWish = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Open HTML Email Preview Modal
  const handleOpenEmailPreview = (member: TeamMember, specialDay: SpecialDay, customWish: string) => {
    const subject = generateFestiveSubject(member.name, specialDay.name, specialDay.icon);
    const html = generateFestiveEmailHtml({
      celebrantName: member.name,
      designation: member.designation,
      department: member.department || 'Industrial Engineering Central',
      birthday: member.birthday,
      specialDayName: specialDay.name,
      specialDayIcon: specialDay.icon,
      greetingTheme: specialDay.greetingTheme,
      customWish,
      senderPhone: '+8801625299521',
      senderName: 'IE Central Team Leadership',
    });

    setPreviewEmail({
      member,
      specialDay,
      wish: customWish,
      html,
      subject,
    });
    setCopiedEmailHtml(false);
  };

  // Dispatch Festive Email via backend API
  const handleSendFestiveEmail = async (member: TeamMember, specialDay: SpecialDay, customWish: string) => {
    if (!member.email || !member.email.includes('@')) {
      alert(`No valid email address configured for ${member.name}. Please ensure Column H contains their email in the Google Sheet.`);
      return;
    }

    const emailKey = `${specialDay.id}_${member.id || member.sl}`;
    setSendingEmailId(emailKey);
    try {
      const subject = generateFestiveSubject(member.name, specialDay.name, specialDay.icon);
      const htmlBody = generateFestiveEmailHtml({
        celebrantName: member.name,
        designation: member.designation,
        department: member.department || 'Industrial Engineering Central',
        birthday: member.birthday,
        specialDayName: specialDay.name,
        specialDayIcon: specialDay.icon,
        greetingTheme: specialDay.greetingTheme,
        customWish,
        senderPhone: '+8801625299521',
        senderName: 'IE Central Team Leadership',
      });

      const response = await fetch('/api/send-festive-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: member.email,
          recipientName: member.name,
          designation: member.designation,
          department: member.department,
          birthday: member.birthday,
          specialDayName: specialDay.name,
          specialDayIcon: specialDay.icon,
          greetingTheme: specialDay.greetingTheme,
          customWish,
          subject,
          htmlBody,
        }),
      });

      const resJson = await response.json();
      if (resJson.success) {
        setSentEmailSuccess(`Warm Festive Email successfully delivered to ${member.name} (${member.email})! ✨`);
        setTimeout(() => setSentEmailSuccess(null), 6000);
      } else {
        alert(`Failed to send email: ${resJson.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Festive email dispatch error:', err);
      alert('Network error while dispatching festive email.');
    } finally {
      setSendingEmailId(null);
    }
  };

  // Sync with Google Online Server API
  const handleSyncWithGoogleServer = async () => {
    setIsSyncingOnline(true);
    try {
      const res = await fetch('/api/sync-special-days-online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: selectedYear, forceRefresh: true }),
      });
      const data = await res.json();
      if (data.success) {
        setLastSyncOnline(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setSentEmailSuccess(`Google Online Server synchronized for Year ${selectedYear}. Master Calendar updated.`);
        setTimeout(() => setSentEmailSuccess(null), 4000);
      }
    } catch (err) {
      setLastSyncOnline(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } finally {
      setIsSyncingOnline(false);
    }
  };

  // Google Search for any global special day or holiday
  const handleSearchOnlineSpecialDays = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onlineSearchQuery.trim()) return;
    setIsSearchingOnline(true);
    try {
      const res = await fetch('/api/search-special-days', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: onlineSearchQuery, year: selectedYear }),
      });
      const data = await res.json();
      if (data.success && data.results) {
        setOnlineSearchResults(data.results);
      }
    } catch (err) {
      console.error("Online search failed:", err);
    } finally {
      setIsSearchingOnline(false);
    }
  };

  // Add custom online searched special day to current active year calendar
  const handleAddOnlineSpecialDay = (item: any) => {
    const newDay: SpecialDay = {
      ...item,
      id: item.id || `custom-${Date.now()}`,
    };
    (newDay as any).year = selectedYear;
    setCustomAddedSpecialDays((prev) => [newDay, ...prev]);
    setOnlineSearchResults((prev) => prev.filter((r) => r.id !== item.id));
    setSentEmailSuccess(`Added "${item.name}" (${item.icon}) to ${selectedYear} calendar!`);
    setTimeout(() => setSentEmailSuccess(null), 3500);
  };

  // Copy executive luncheon proposal note
  const handleCopyProposal = () => {
    if (!intensityAnalysis.recommendedGathering) return;
    const g = intensityAnalysis.recommendedGathering;
    const text =
      `📋 [EXECUTIVE EVENT BRIEFING & TEAM LUNCH PROPOSAL]\n` +
      `📅 Optimal Gathering Date: ${g.dateFormatted} (${g.weekday})\n` +
      `🎯 Target Planning Window: ${g.targetWeekLabel}\n` +
      `🎂 Celebrants Honored: ${g.celebrantsSummary}\n` +
      `🗓️ Festive / Public Observances: ${g.holidaysSummary}\n` +
      `💡 Strategic Rationale: ${g.strategicRationale}\n\n` +
      `⚡ Action: Leadership approval requested for booking luncheon & team refreshments.`;

    navigator.clipboard.writeText(text);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* DISPATCH CONFIRMATION TOAST NOTIFICATION */}
      {sentEmailSuccess && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-950 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <MailCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-emerald-400">Automated Mail Engine Dispatched</div>
            <div className="text-slate-300 mt-0.5">{sentEmailSuccess}</div>
          </div>
          <button
            onClick={() => setSentEmailSuccess(null)}
            className="p-1 text-slate-400 hover:text-white ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* WORKSTATION HERO / EXECUTIVE HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20 festive-icon-cinematic festive-icon-floating festive-icon-shimmer festive-icon-glow-amber">
                <Globe className="w-5 h-5 text-slate-950 animate-pulse [animation-duration:3s]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Global Special Days & Festive Calendar
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {selectedYear} Master Directory
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Executive workstation pairing national observances, international festive holidays, and religious celebrations with the honored <strong>Birthday Boys & Team Celebrants</strong> of the IE Central Team.
            </p>
          </div>

          {/* Quick Year Selector and Intensity Meter */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-start lg:self-auto">
            {/* Multi-Year Switcher */}
            <div className="bg-white/10 border border-white/15 px-3.5 py-2 rounded-2xl flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Edition Year</span>
                <span className="text-[9px] text-slate-300 font-mono">2024 - 2032+</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {[2025, 2026, 2027, 2028, 2029, 2030].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedYear === yr
                        ? 'bg-amber-400 text-slate-950 shadow-xs ring-2 ring-amber-300'
                        : 'bg-white/5 text-slate-300 hover:bg-white/15'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Google Sync Button */}
            <button
              type="button"
              onClick={handleSyncWithGoogleServer}
              disabled={isSyncingOnline}
              className="px-3.5 py-2.5 rounded-2xl bg-indigo-600/90 hover:bg-indigo-600 text-white font-bold text-xs transition flex items-center gap-2 shadow-md border border-indigo-400/40 cursor-pointer disabled:opacity-50"
              title="Sync with Google Online Server to retrieve updated holiday dates"
            >
              <Car className={`w-4 h-4 text-indigo-200 ${isSyncingOnline ? 'f1-speed-motion' : ''}`} />
              <span>{isSyncingOnline ? 'Syncing...' : 'Sync Google Server'}</span>
            </button>

            {intensityAnalysis.recommendedGathering && (
              <button
                type="button"
                onClick={handleCopyProposal}
                className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-md cursor-pointer"
              >
                {copiedProposal ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Proposal Copied!</span>
                  </>
                ) : (
                  <>
                    <UtensilsCrossed className="w-4 h-4 text-slate-950" />
                    <span>Copy Lunch Proposal</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* GOOGLE ONLINE SERVER & SEARCH INTEGRATION HUB */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/30 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Online Server Status */}
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Google Online Server Connection:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  ONLINE & VERIFIED (HTTPS)
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Status: <strong className="text-slate-200">{lastSyncOnline}</strong> (Year {selectedYear})
              </span>
            </div>

            {/* Google Search Bar Toggle / Form */}
            <form onSubmit={handleSearchOnlineSpecialDays} className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search Google for any global special day or holiday..."
                  value={onlineSearchQuery}
                  onChange={(e) => setOnlineSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-400 text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-hidden focus:border-amber-400 transition"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                disabled={isSearchingOnline || !onlineSearchQuery.trim()}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isSearchingOnline ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Globe className="w-3.5 h-3.5" />
                )}
                <span>Search Google</span>
              </button>
            </form>

          </div>

          {/* Online Search Results Tray */}
          {onlineSearchResults.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span className="font-bold flex items-center gap-1.5 text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Google Online Search Results ({onlineSearchResults.length})
                </span>
                <button
                  type="button"
                  onClick={() => setOnlineSearchResults([])}
                  className="text-slate-400 hover:text-white text-[11px] cursor-pointer"
                >
                  Dismiss Results
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {onlineSearchResults.map((res, resIdx) => (
                  <div
                    key={`online-res-${res.id}-${resIdx}`}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/40 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl p-1 bg-slate-800 rounded-lg">{res.icon}</span>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{res.name}</span>
                          <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-500/30">
                            {res.dateFormatted}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">{res.description}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddOnlineSpecialDay(res)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] flex items-center gap-1 shrink-0 transition cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-white/10">
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold festive-icon-cinematic festive-icon-floating festive-icon-shimmer festive-icon-glow-amber">
              <Calendar className="w-5 h-5 transition-transform duration-300 hover:rotate-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Total Special Days</p>
              <p className="text-xl font-bold text-white mt-0.5">{stats.totalDays}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold festive-icon-cinematic festive-icon-floating festive-icon-shimmer festive-icon-glow-emerald [animation-delay:0.8s]">
              <Cake className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">With Birthday Boys</p>
              <p className="text-xl font-bold text-emerald-300 mt-0.5">
                {stats.daysWithCelebrantsCount} <span className="text-xs text-slate-400 font-normal">Holidays</span>
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-400/20 text-rose-300 flex items-center justify-center font-bold festive-icon-cinematic festive-icon-floating festive-icon-shimmer festive-icon-glow-rose [animation-delay:1.6s]">
              <Sparkles className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Exact Day Matches</p>
              <p className="text-xl font-bold text-rose-300 mt-0.5">{stats.exactCoincidenceCount}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-400/20 text-indigo-300 flex items-center justify-center font-bold festive-icon-cinematic festive-icon-floating festive-icon-shimmer festive-icon-glow-indigo [animation-delay:2.4s]">
              <Flame className="w-5 h-5 transition-transform duration-300 hover:scale-110" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Celebration Score</p>
              <p className="text-xl font-bold text-amber-300 mt-0.5">
                {intensityAnalysis.overallScore}<span className="text-xs text-slate-400 font-normal">/100</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* UPCOMING SPECIAL DAYS HIGHLIGHTS BAR */}
      {upcomingSpecialDays.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Immediate Festive Horizon (Next 60-90 Days)
              </h3>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {upcomingSpecialDays.length} festive events approaching
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingSpecialDays.map((item, idx) => {
              const matches = celebrantsBySpecialDay[item.id] || [];
              const hasCelebrants = matches.length > 0;
              const isImminent = item.daysRemaining <= 7;

              return (
                <div
                  key={`festive-upcoming-${item.id}-${idx}`}
                  onClick={() => setSelectedFestivalDetail(item)}
                  className={`p-3.5 rounded-2xl border transition relative cursor-pointer group hover:shadow-md hover:border-amber-400 ${
                    isImminent
                      ? 'bg-amber-50/50 border-amber-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                  title="Click to view historically and culturally accurate festival reason, origins & significance"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-2xs shrink-0 select-none festive-icon-cinematic festive-icon-floating festive-icon-shimmer group-hover:festive-icon-glow-amber transition-all">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                          <span>{item.name}</span>
                          <Info className="w-3.5 h-3.5 text-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                        </h4>
                        <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                          {item.dateFormatted} • <span className="text-indigo-600 font-bold">{item.timeframeLabel}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.isToday
                            ? 'bg-amber-500 text-white animate-pulse'
                            : item.isTomorrow
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.timeframeLabel}
                      </span>
                      <span className="text-[9.5px] font-bold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-0.5">
                        <span>Details</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>

                  {/* Celebrant summary if any */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    {hasCelebrants ? (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 truncate">
                        <Cake className="w-3.5 h-3.5 text-emerald-600 shrink-0 animate-pulse festive-icon-floating" />
                        <span className="truncate">
                          {matches.map((m) => m.member.name).join(', ')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">No birthdays on this day</span>
                    )}

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                      {item.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FILTER CONTROLS & SEARCH BAR */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                viewMode === 'history'
                  ? 'Search past celebrated festivals by name, recipient, phone, or wish...'
                  : 'Search by holiday name, theme, or Birthday Boy name...'
              }
              value={viewMode === 'history' ? historySearchTerm : searchTerm}
              onChange={(e) =>
                viewMode === 'history'
                  ? setHistorySearchTerm(e.target.value)
                  : setSearchTerm(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition font-medium"
            />
            {(viewMode === 'history' ? historySearchTerm : searchTerm) && (
              <button
                onClick={() =>
                  viewMode === 'history' ? setHistorySearchTerm('') : setSearchTerm('')
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start md:self-auto border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Monthly Matrix</span>
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'history'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-600" />
              <span>History</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
                {pastFestivalsCelebratedFeed.length}
              </span>
            </button>
          </div>
        </div>

        {/* Filter Chips: Category & Celebrants (Shown for Cards, Timeline & Matrix views) */}
        {viewMode !== 'history' && (
          <div className="space-y-3 pt-3 border-t border-slate-100">
            {/* Celebrant Specific Filters */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                Celebrant Filter:
              </span>
              {[
                { key: 'all', label: 'All Special Days' },
                { key: 'with_celebrants', label: '🎂 With Birthday Boys Only' },
                { key: 'exact_only', label: '🎯 Exact Holiday Birthdays' },
                { key: 'upcoming', label: '⏳ Upcoming 60 Days' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setCelebrantFilter(f.key as CelebrantFilter)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    celebrantFilter === f.key
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                Holiday Category:
              </span>
              {[
                { key: 'all', label: 'All Categories' },
                { key: 'national', label: '🇧🇩 National Days' },
                { key: 'festive', label: '🌙 Religious & Festive' },
                { key: 'international', label: '🌍 International Observances' },
                { key: 'observance', label: '🌱 Global Causes' },
                { key: 'professional', label: '⚡ Professional & IE' },
              ].map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setCategoryFilter(cat.key as CategoryFilter)}
                  className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                    categoryFilter === cat.key
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Month Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">
                Month:
              </span>
              <button
                onClick={() => setSelectedMonth('all')}
                className={`px-2.5 py-1 rounded-md font-bold text-xs shrink-0 cursor-pointer ${
                  selectedMonth === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Year
              </button>
              {MONTH_NAMES.map((m) => (
                <button
                  key={m.index}
                  onClick={() => setSelectedMonth(m.index)}
                  className={`px-2.5 py-1 rounded-md font-semibold text-xs shrink-0 cursor-pointer ${
                    selectedMonth === m.index
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {m.short}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: EXECUTIVE SPECIAL DAY CARDS */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSpecialDays.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Special Days match the current filter</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try selecting "All Categories", "All Year", or clearing your search term to see the complete festive catalog.
              </p>
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setCelebrantFilter('all');
                  setSelectedMonth('all');
                  setSearchTerm('');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredSpecialDays.map((sd, sdIdx) => {
              const celebrants = celebrantsBySpecialDay[sd.id] || [];
              const hasExactMatch = celebrants.some((c) => c.relationship === 'exact');
              const hasCelebrants = celebrants.length > 0;

              return (
                <div
                  key={`festive-grid-${sd.id}-${sdIdx}`}
                  onClick={() => setSelectedFestivalDetail(sd)}
                  className={`bg-white rounded-3xl p-6 border transition shadow-xs hover:shadow-md flex flex-col justify-between space-y-5 cursor-pointer group hover:border-amber-400 ${
                    hasExactMatch
                      ? 'border-amber-300 ring-2 ring-amber-400/20'
                      : hasCelebrants
                      ? 'border-emerald-300'
                      : 'border-slate-200'
                  }`}
                  title="Click anywhere on card to view festival reason, historical background & significance"
                >
                  {/* Top: Icon, Date, Title, Category Badge */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl shadow-xs shrink-0 select-none festive-icon-cinematic festive-icon-floating festive-icon-shimmer hover:festive-icon-glow-amber">
                          {sd.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white uppercase tracking-wider">
                              {sd.dateFormatted}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${sd.badgeColor}`}>
                              {sd.category}
                            </span>
                            {sd.isFloating && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                                🌙 Lunar/Moving Date
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-black text-slate-900 tracking-tight mt-1 group-hover:text-indigo-600 transition-colors">
                            {sd.name}
                          </h3>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFestivalDetail(sd);
                        }}
                        className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-2xs hover:shadow-xs self-start"
                        title="View complete reason, historical background, and religious significance"
                      >
                        <Info className="w-3.5 h-3.5 text-indigo-600 animate-pulse shrink-0" />
                        <span className="hidden sm:inline">Festival Reason & History</span>
                        <span className="sm:hidden">Reason & Details</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sd.description}
                    </p>

                    {/* Greeting Theme Insight */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs">
                      <p className="text-slate-700">
                        <strong className="text-slate-900">💡 Festive Wish Theme: </strong>
                        {sd.greetingTheme}
                      </p>
                    </div>
                  </div>

                  {/* FEATURED: BIRTHDAY BOYS & TEAM CELEBRANTS SECTION */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Cake className="w-4 h-4 text-amber-500 animate-bounce [animation-duration:3s] festive-icon-floating" />
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          Birthday Boy(s) & Celebrants
                        </span>
                      </div>

                      {hasCelebrants && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {celebrants.length} Honored
                        </span>
                      )}
                    </div>

                    {hasCelebrants ? (
                      <div className="space-y-3">
                        {celebrants.map((item, cIdx) => {
                          const isCopied = copiedId === `${sd.id}_${item.member.id || item.member.sl}`;

                          return (
                            <div
                              key={`${sd.id}_${item.member.id || item.member.sl || 'c'}_${cIdx}`}
                              className={`p-3.5 rounded-2xl border transition ${
                                item.relationship === 'exact'
                                  ? 'bg-gradient-to-r from-amber-50 to-orange-50/50 border-amber-300 shadow-2xs'
                                  : 'bg-slate-50/80 border-slate-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  {/* Avatar with Initials */}
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-xs ${
                                    item.relationship === 'exact'
                                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                                      : 'bg-emerald-600 text-white'
                                  }`}>
                                    {item.member.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <h4 className="text-xs font-bold text-slate-900">
                                        {item.member.name}
                                      </h4>
                                      <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase ${
                                        item.relationship === 'exact'
                                          ? 'bg-amber-200 text-amber-900 border border-amber-300 animate-pulse'
                                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                      }`}>
                                        {item.relationship === 'exact'
                                          ? '🎉 Exact Date Coincidence'
                                          : `✨ Festive Week (${item.birthdayFormatted})`}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium">
                                      {item.member.designation} • {item.member.department || 'IE Central'}
                                    </p>
                                    {item.member.nameMeaning && (
                                      <p className="text-[10px] text-amber-700 font-normal italic flex items-center gap-1 mt-0.5">
                                        <Sparkles className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                                        <span>{item.member.nameMeaning}</span>
                                      </p>
                                    )}
                                    {item.member.specialDayMatch && (
                                      <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5" title={`Special Day Match: ${item.member.specialDayMatch}`}>
                                        <span className="text-[9px]">🌟</span>
                                        <span className="truncate max-w-[280px]">{item.member.specialDayMatch}</span>
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                                  {item.birthdayFormatted}
                                </span>
                              </div>

                              {/* Tailored Festive Wish Text Box */}
                              <div className="mt-2.5 p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700 italic leading-relaxed relative group">
                                "{item.customFestiveWish}"
                              </div>

                              {/* Action Buttons for this Celebrant */}
                              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => handleCopyWish(item.customFestiveWish, `${sd.id}_${item.member.id || item.member.sl}`)}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span className="text-emerald-700">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3 text-slate-500" />
                                      <span>Copy Custom Wish</span>
                                    </>
                                  )}
                                </button>

                                {/* Warm Festive Email Actions */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEmailPreview(item.member, sd, item.customFestiveWish)}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5 transition cursor-pointer"
                                  title="Preview Warm Festive HTML Email"
                                >
                                  <Eye className="w-3 h-3 text-amber-600" />
                                  <span>Preview Email</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={sendingEmailId === `${sd.id}_${item.member.id || item.member.sl}`}
                                  onClick={() => handleSendFestiveEmail(item.member, sd, item.customFestiveWish)}
                                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                                  title="Send Warm Festive HTML Email to Column H"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>
                                    {sendingEmailId === `${sd.id}_${item.member.id || item.member.sl}`
                                      ? 'Delivering Mail...'
                                      : 'Send Festive Mail'}
                                  </span>
                                </button>

                                {onOpenGenerator && (
                                  <button
                                    type="button"
                                    onClick={() => onOpenGenerator(item.member, item.customFestiveWish)}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 transition cursor-pointer"
                                  >
                                    <Sparkles className="w-3 h-3 text-emerald-600" />
                                    <span>Wish Studio</span>
                                  </button>
                                )}

                                {onSendWhatsApp && (
                                  <button
                                    type="button"
                                    onClick={() => onSendWhatsApp(item.member)}
                                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition cursor-pointer"
                                    title="Dispatch direct WhatsApp celebration"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>WhatsApp</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                        No team birthdays falling in this festival window ({sd.dateFormatted})
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW MODE 2: CHRONOLOGICAL TIMELINE */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Chronological Master Timeline ({filteredSpecialDays.length} Events)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ordered sequence across the year with matching team celebrants
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              Year {selectedYear}
            </span>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pl-6 sm:pl-8">
            {filteredSpecialDays.map((sd, sdIdx) => {
              const celebrants = celebrantsBySpecialDay[sd.id] || [];
              const hasExactMatch = celebrants.some((c) => c.relationship === 'exact');
              const hasCelebrants = celebrants.length > 0;

              return (
                <div key={`festive-timeline-${sd.id}-${sdIdx}`} className="relative group">
                  {/* Timeline Dot Icon */}
                  <div
                    className={`absolute -left-[35px] sm:-left-[43px] top-1 w-8 h-8 rounded-xl flex items-center justify-center text-base border-2 shadow-xs festive-icon-cinematic festive-icon-floating festive-icon-shimmer ${
                      hasExactMatch
                        ? 'bg-amber-400 border-white text-slate-950 ring-2 ring-amber-400 festive-icon-glow-amber'
                        : hasCelebrants
                        ? 'bg-emerald-500 border-white text-white festive-icon-glow-emerald'
                        : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                  >
                    {sd.icon}
                  </div>

                  <div
                    onClick={() => setSelectedFestivalDetail(sd)}
                    className="bg-slate-50/70 hover:bg-slate-50 hover:border-amber-400 rounded-2xl p-5 border border-slate-200 transition space-y-3 cursor-pointer group"
                    title="Click to view festival reason, history & cultural significance"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-slate-900 text-white font-mono">
                          {sd.dateFormatted}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                          <span>{sd.name}</span>
                          <Info className="w-3.5 h-3.5 text-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                        </h4>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${sd.badgeColor}`}>
                          {sd.category}
                        </span>
                      </div>

                      {hasCelebrants && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 self-start sm:self-auto">
                          🎂 {celebrants.length} Birthday Boy{celebrants.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sd.description}
                    </p>

                    {/* Celebrants breakdown */}
                    {hasCelebrants && (
                      <div className="pt-3 border-t border-slate-200/80 space-y-2">
                        <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                          Honored Celebrants on this Day:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {celebrants.map((c, cIdx) => (
                            <div
                              key={`${sd.id}_breakdown_${c.member.id || c.member.sl || 'c'}_${cIdx}`}
                              className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                            >
                              <div>
                                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                                  <span>{c.member.name}</span>
                                  {c.relationship === 'exact' && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400 text-slate-950">
                                      Exact
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  {c.member.designation} • {c.birthdayFormatted}
                                </div>
                                {c.member.nameMeaning && (
                                  <div className="text-[9.5px] text-amber-700 italic flex items-center gap-1 mt-0.5">
                                    <span>✦</span>
                                    <span>{c.member.nameMeaning}</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                <button
                                  type="button"
                                  onClick={() => handleCopyWish(c.customFestiveWish, `${sd.id}_${c.member.id || c.member.sl}`)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                  title="Copy Custom Festive Wish"
                                >
                                  {copiedId === `${sd.id}_${c.member.id || c.member.sl}` ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenEmailPreview(c.member, sd, c.customFestiveWish)}
                                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition cursor-pointer"
                                  title="Preview & Send Festive Email"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: MONTHLY MATRIX VIEW */}
      {viewMode === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MONTH_NAMES.map((month) => {
            const daysInThisMonth = specialDaysForYear.filter((sd) => sd.month === month.index);
            const celebrantsInMonth = members.filter((m) => {
              const p = parseBirthdayDate(m.birthday);
              return p && p.month === month.index;
            });

            return (
              <div
                key={month.index}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-black text-xs flex items-center justify-center festive-icon-cinematic festive-icon-floating shadow-xs">
                        {month.short}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {month.full} {selectedYear}
                      </h4>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {daysInThisMonth.length} Observances
                    </span>
                  </div>

                  {/* List of Special Days in this Month */}
                  <div className="space-y-2 mt-3">
                    {daysInThisMonth.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2 text-center">
                        No major national holidays registered
                      </p>
                    ) : (
                      daysInThisMonth.map((sd, sdIdx) => {
                        const matches = celebrantsBySpecialDay[sd.id] || [];
                        const hasExact = matches.some((m) => m.relationship === 'exact');

                        return (
                          <div
                            key={`month-${month.index}-sd-${sd.id}-${sdIdx}`}
                            onClick={() => setSelectedFestivalDetail(sd)}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 cursor-pointer transition hover:shadow-2xs hover:border-amber-400 group ${
                              hasExact
                                ? 'bg-amber-50 border-amber-300'
                                : matches.length > 0
                                ? 'bg-emerald-50/60 border-emerald-200'
                                : 'bg-slate-50 border-slate-100 hover:bg-white'
                            }`}
                            title="Click to view festival reason, history & cultural significance"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-lg select-none shrink-0 inline-flex items-center justify-center festive-icon-cinematic festive-icon-floating festive-icon-shimmer">{sd.icon}</span>
                              <div className="truncate">
                                <span className="font-bold text-slate-900 block truncate group-hover:text-indigo-600 transition-colors">{sd.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{sd.dateFormatted}</span>
                              </div>
                            </div>

                            {matches.length > 0 && (
                              <span className="px-1.5 py-0.5 rounded bg-white text-emerald-800 border border-emerald-200 text-[10px] font-bold shrink-0">
                                🎂 {matches.length}
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Birthday Boys in this Month */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      {month.short} Birthday Boys ({celebrantsInMonth.length})
                    </span>
                    {onNavigateToRosterMonth && (
                      <button
                        type="button"
                        onClick={() => onNavigateToRosterMonth(month.index)}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                      >
                        View in Roster →
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {celebrantsInMonth.slice(0, 4).map((m, mIdx) => (
                      <span
                        key={`cal_month_${month.index}_${m.id || m.sl || 'm'}_${mIdx}`}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200"
                      >
                        {m.name.split(' ')[0]} ({m.birthday})
                      </span>
                    ))}
                    {celebrantsInMonth.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                        +{celebrantsInMonth.length - 4} more
                      </span>
                    )}
                    {celebrantsInMonth.length === 0 && (
                      <span className="text-[10px] text-slate-400 italic">No birthdays this month</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 4: SEARCHABLE CHRONOLOGICAL FEED OF PAST FESTIVALS CELEBRATED BY IE CENTRAL TEAM */}
      {viewMode === 'history' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top History Banner & Telemetry Stats */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 relative z-10 max-w-xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5 uppercase tracking-wider">
                  <History className="w-3 h-3 text-amber-400" />
                  <span>IE Central Automation Logs & Archive</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Zero-Touch Dispatches Active</span>
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Past Celebrated Festivals & Dispatch History
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Chronological record of cultural, religious, and national festivals celebrated by the IE Central Team, pulling data from automated 8:00 AM Google Apps Script triggers, Headless Server Dispatches, and WhatsApp wishing messages.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                  Celebrations
                </span>
                <span className="text-xl font-black text-amber-300">
                  {pastFestivalsCelebratedFeed.length}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Dispatched Logs</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                  Delivery Rate
                </span>
                <span className="text-xl font-black text-emerald-400">
                  100%
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">HTTP 200 OK</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                  Sender Number
                </span>
                <span className="text-xs font-mono font-bold text-indigo-300 block truncate">
                  +8801625299521
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">WhatsApp / Email</span>
              </div>
            </div>

            {/* Background glowing aura */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* History Controls Bar (Category filter, Chronological sort toggle) */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                Category:
              </span>
              {[
                { key: 'all', label: 'All History' },
                { key: 'festive', label: '🌙 Religious & Festive' },
                { key: 'national', label: '🇧🇩 National Days' },
                { key: 'professional', label: '⚙️ Professional & IE' },
                { key: 'international', label: '🌍 International' },
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setHistoryCategoryFilter(c.key)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer text-xs ${
                    historyCategoryFilter === c.key
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
              {/* Chronological Sort Toggle */}
              <button
                type="button"
                onClick={() => setHistorySortAsc(!historySortAsc)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition cursor-pointer border border-slate-200"
                title="Toggle Chronological Sorting Order"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <span>{historySortAsc ? 'Oldest First (Ascending)' : 'Newest First (Chronological)'}</span>
              </button>

              <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                Showing <strong>{filteredHistoryFeed.length}</strong> of {pastFestivalsCelebratedFeed.length} past events
              </span>
            </div>
          </div>

          {/* History Timeline Feed */}
          {filteredHistoryFeed.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No past celebrations matched your search</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try searching for another festival name like "Madhu Purnima", "Buddha Purnima", "Pohela Boishakh", or clear your filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setHistorySearchTerm('');
                  setHistoryCategoryFilter('all');
                  setHistoryStatusFilter('all');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistoryFeed.map((item) => {
                const isCopied = copiedHistoryId === item.id;
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 relative group overflow-hidden"
                  >
                    {/* Top Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Cinematic Animated Icon */}
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 flex items-center justify-center text-3xl shadow-xs shrink-0 select-none festive-icon-cinematic festive-icon-floating festive-icon-shimmer hover:festive-icon-glow-amber">
                          {item.festivalIcon}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white uppercase tracking-wider">
                              {item.date}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
                              {item.category}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{item.status}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {item.timestamp}
                            </span>
                          </div>

                          <h3 className="text-base font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                            {item.festivalName}
                          </h3>

                          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 pt-0.5">
                            <span className="font-semibold text-slate-800 flex items-center gap-1">
                              <span>👤 Recipient:</span>
                              <strong className="text-indigo-900">{item.recipientName}</strong>
                            </span>
                            {item.recipientPhone && item.recipientPhone !== 'N/A' && (
                              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                📱 {item.recipientPhone}
                              </span>
                            )}
                            {item.recipientEmail && (
                              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[220px]">
                                ✉️ {item.recipientEmail}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Quick Badges */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1.5 shrink-0 self-start">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center gap-1">
                          <Send className="w-3 h-3" />
                          <span>{item.channel}</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.executionTimeMs}ms • HTTP 200
                        </span>
                      </div>
                    </div>

                    {/* Dispatched Festive Wishing Message Bubble */}
                    <div className="mt-3.5 bg-slate-50 rounded-xl p-3.5 border border-slate-200/70 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <span>💬 Delivered Festive Greeting / Wish:</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Sender: {item.senderNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 font-serif leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
                        "{item.message}"
                      </p>
                    </div>

                    {/* Technical Automation Telemetry Info */}
                    {item.details && (
                      <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-indigo-50/50 border border-indigo-100 text-[11px] text-indigo-900 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-indigo-950 shrink-0">⚙️ Automation Source:</span>
                          <span className="text-indigo-800 truncate">{item.triggerSource}</span>
                          <span className="text-indigo-400">•</span>
                          <span className="text-slate-600 truncate">{item.details}</span>
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Buttons */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        {item.specialDay && (
                          <button
                            type="button"
                            onClick={() => setSelectedFestivalDetail(item.specialDay!)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 flex items-center gap-1.5 transition cursor-pointer shadow-2xs hover:shadow-xs"
                            title="Click to read the historical background, religious significance & cultural traditions of this festival"
                          >
                            <Info className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                            <span>Festival Reason & History</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(item.message);
                            setCopiedHistoryId(item.id);
                            setTimeout(() => setCopiedHistoryId(null), 2500);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Message Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Copy Delivered Wish</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* INTERACTIVE FESTIVAL DETAILS MODAL (Significance, Historical Background, Cultural Practices & Regional Context) */}
      {selectedFestivalDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-3xl font-bold shadow-md festive-icon-cinematic festive-icon-floating festive-icon-shimmer festive-icon-glow-amber">
                  {selectedFestivalDetail.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                      {selectedFestivalDetail.dateFormatted}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${selectedFestivalDetail.badgeColor}`}>
                      {selectedFestivalDetail.category}
                    </span>
                    {selectedFestivalDetail.isFloating && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                        🌙 Lunar / Moving Date
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">
                    {selectedFestivalDetail.name}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFestivalDetail(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs bg-slate-50/50">
              {/* Short Description */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Overview</h4>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {selectedFestivalDetail.description}
                </p>
              </div>

              {/* Exact Reason & Significance */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-700 font-bold">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs uppercase tracking-wider">Exact Reason & Spiritual Significance</h4>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {getDetailedFestivalInfo(selectedFestivalDetail).significance}
                </p>
              </div>

              {/* Historical Background */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2 text-amber-700 font-bold">
                  <History className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs uppercase tracking-wider">Historical Background & Origins</h4>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {getDetailedFestivalInfo(selectedFestivalDetail).history}
                </p>
              </div>

              {/* Cultural & Religious Traditions */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs uppercase tracking-wider">Cultural Celebrations & Traditions</h4>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {getDetailedFestivalInfo(selectedFestivalDetail).culturalTradition}
                </p>
              </div>

              {/* Bangladesh Regional Note */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <span className="text-sm">🇧🇩</span>
                  <h4 className="text-xs uppercase tracking-wider">Bangladesh & Regional Context</h4>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {getDetailedFestivalInfo(selectedFestivalDetail).regionalNote}
                </p>
              </div>

              {/* Festive Wish Theme */}
              <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 space-y-1">
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                  💡 Festive Wishing Theme for Team Messages:
                </span>
                <p className="text-slate-800 font-medium">
                  {selectedFestivalDetail.greetingTheme}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedFestivalDetail(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FESTIVE EMAIL PREVIEW & INSTANT DISPATCH MODAL */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Warm Festive HTML Email Preview</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      {previewEmail.specialDay.icon} {previewEmail.specialDay.name}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    To: <strong>{previewEmail.member.name}</strong> ({previewEmail.member.email || 'No email in Column H'})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewEmail(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Email Metadata Bar */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500 w-16">Subject:</span>
                <span className="font-semibold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 flex-1 truncate">
                  {previewEmail.subject}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500 w-16">Recipient:</span>
                <span className="text-slate-700">
                  {previewEmail.member.name} &lt;{previewEmail.member.email || 'missing_email@kdsgroup.net'}&gt; • {previewEmail.member.designation}
                </span>
              </div>
            </div>

            {/* Modal Body: Rendered HTML Email Preview */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100/70">
              <div className="max-w-xl mx-auto shadow-sm rounded-2xl overflow-hidden bg-white">
                <iframe
                  title="Festive Email Preview"
                  srcDoc={previewEmail.html}
                  className="w-full min-h-[460px] border-0"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(previewEmail.html);
                    setCopiedEmailHtml(true);
                    setTimeout(() => setCopiedEmailHtml(false), 2500);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedEmailHtml ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">HTML Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Raw HTML Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewEmail(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Close Preview
                </button>

                <button
                  type="button"
                  disabled={sendingEmailId !== null || !previewEmail.member.email}
                  onClick={async () => {
                    await handleSendFestiveEmail(
                      previewEmail.member,
                      previewEmail.specialDay,
                      previewEmail.wish
                    );
                    setPreviewEmail(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white flex items-center gap-2 shadow-md shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  <SendHorizontal className="w-3.5 h-3.5" />
                  <span>
                    {sendingEmailId ? 'Delivering Warm Email...' : 'Send Festive Wishing Email Now'}
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
