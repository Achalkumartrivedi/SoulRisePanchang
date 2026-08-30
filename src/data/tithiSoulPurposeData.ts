import { LanguageCode } from '../types/language';

export interface TithiSoulPurposeInfo {
  tithiNumber: number; // 1 to 15, 30
  name: string;
  groupType: 'Nandā' | 'Bhadrā' | 'Vijayā' | 'Riktā' | 'Pūrṇā';
  groupMeaning: string;
  rulingDeity: string;
  rulingPlanet: string;
  element: string;
  soulPurposeTitle: string;
  soulPurposeSummary: string;
  personalityTraits: string;
  strengths: string[];
  challenges: string[];
  spiritualGuidance: string;
  recommendedRituals: string;
}

export type TithiDataMap = Record<number, TithiSoulPurposeInfo>;

const EN_TITHI_DATA: TithiDataMap = {
  1: {
    tithiNumber: 1,
    name: 'Pratipada (1st Lunar Day)',
    groupType: 'Nandā',
    groupMeaning: 'Delight, Prosperity & New Beginnings (Auspicious)',
    rulingDeity: 'Agni (God of Sacred Fire)',
    rulingPlanet: 'Sun (Surya)',
    element: 'Fire (Agni Tattva)',
    soulPurposeTitle: 'The Trailblazer & Sovereign Pioneer',
    soulPurposeSummary: 'Born on Pratipada, your soul purpose is to ignite new paths, pioneer fresh ideas, and lead others out of darkness with unshakeable willpower.',
    personalityTraits: 'Strong-willed, independent, and ambitious. You possess natural leadership potential and a fiery drive to initiate original projects.',
    strengths: ['Natural Leadership & Vision', 'High Energy & Enthusiasm', 'Uncompromising Integrity', 'Pioneering Spirit'],
    challenges: ['Can be stubborn or overly self-reliant', 'Restlessness with routine tasks', 'Prone to impulse decisions'],
    spiritualGuidance: 'Channel your fiery independence into selfless service and community leadership. Practice patience when working with others.',
    recommendedRituals: 'Offer water to the morning Sun (Surya Arghya) and light a ghee lamp for Lord Agni on Pratipada days.'
  },
  2: {
    tithiNumber: 2,
    name: 'Dvitiya (2nd Lunar Day)',
    groupType: 'Bhadrā',
    groupMeaning: 'Steadfastness, Protection & Order (Auspicious)',
    rulingDeity: 'Brahma & Ashwini Kumaras (Creators & Divine Healers)',
    rulingPlanet: 'Moon (Chandra)',
    element: 'Earth (Prithvi Tattva)',
    soulPurposeTitle: 'The Disciplined Guardian & Administrator',
    soulPurposeSummary: 'Your soul mission is to bring structure, stability, and healing to society through disciplined administration and unwavering commitment to truth.',
    personalityTraits: 'Serious, disciplined, and highly organized. You carry strong decision-making abilities, administrative prowess, and deep devotion to family.',
    strengths: ['Exceptional Discipline & Reliability', 'Strong Administrative Skills', 'Courage in Adversity', 'High Respect for Tradition'],
    challenges: ['Can be overly stern or rigid', 'Difficulty expressing soft emotions', 'Tendency toward blunt communication'],
    spiritualGuidance: 'Cultivate compassion alongside discipline. Balance your serious nature with creative or musical relaxation.',
    recommendedRituals: 'Chant Vishnu Sahasranama and honor Lord Brahma / Ashwini Kumaras on Dvitiya days.'
  },
  3: {
    tithiNumber: 3,
    name: 'Tritiya (3rd Lunar Day)',
    groupType: 'Vijayā',
    groupMeaning: 'Victory, Courage & Power (Highly Auspicious)',
    rulingDeity: 'Gauri / Parvati (Goddess of Grace & Power)',
    rulingPlanet: 'Mars (Mangala)',
    element: 'Space (Akasha Tattva)',
    soulPurposeTitle: 'The Fearless Conqueror & Victor',
    soulPurposeSummary: 'Born on Tritiya, your divine mandate is to conquer obstacles, defend righteousness, and achieve victory through courage and energetic action.',
    personalityTraits: 'Bold, energetic, and fearless. You thrive under challenge, possess magnetic charisma, and never back down from a worthy fight.',
    strengths: ['Fearless Courage', 'Dynamic Action & Enthusiasm', 'Magnetic Charisma', 'Unstoppable Determination'],
    challenges: ['Impatient with slow progress', 'Can become overly competitive', 'Risk of minor disputes'],
    spiritualGuidance: 'Direct your immense courage toward noble causes. Worship Goddess Gauri to infuse your power with divine grace.',
    recommendedRituals: 'Worship Goddess Parvati / Gauri and chant Mangal Mantras on Tritiya days.'
  },
  4: {
    tithiNumber: 4,
    name: 'Chaturthi (4th Lunar Day)',
    groupType: 'Riktā',
    groupMeaning: 'Transformation, Overcoming Obstacles & Cleansing',
    rulingDeity: 'Lord Ganesha (Remover of Obstacles)',
    rulingPlanet: 'Mercury (Budha)',
    element: 'Water (Jala Tattva)',
    soulPurposeTitle: 'The Master Alchemist & Obstacle Solver',
    soulPurposeSummary: 'Your soul chosen path is to turn challenges into spiritual wisdom, solve complex problems, and guide others through life’s transformations.',
    personalityTraits: 'Generous, highly intelligent, and resourceful. While life may test you with ups and downs, you possess deep resilience and sharp intellect.',
    strengths: ['Deep Problem-Solving Ability', 'Resilience in Adversity', 'Generous & Charitable Nature', 'Keen Intuition'],
    challenges: ['Occasional mental confusion or stress', 'Sudden shifts in fortune', 'Tendency to overthink'],
    spiritualGuidance: 'Surrender all worries to Lord Ganesha. Understand that life’s obstacles are stepping stones to your ultimate spiritual awakening.',
    recommendedRituals: 'Chant Ganesha Atharvashirsha and offer Durva grass to Lord Ganesha on Sankashti / Vinayaka Chaturthi.'
  },
  5: {
    tithiNumber: 5,
    name: 'Panchami (5th Lunar Day)',
    groupType: 'Pūrṇā',
    groupMeaning: 'Fullness, Wisdom & Abundance (Highly Auspicious)',
    rulingDeity: 'Naga Devatas & Goddess Saraswati',
    rulingPlanet: 'Jupiter (Brihaspati)',
    element: 'Air (Vayu Tattva)',
    soulPurposeTitle: 'The Creative Artist & Divine Scholar',
    soulPurposeSummary: 'Born on Panchami, your soul mission is to bring beauty, wisdom, artistic elegance, and spiritual harmony into the world.',
    personalityTraits: 'Creative, harmonious, and aesthetics-oriented. You appreciate art, music, and literature, displaying warmth, kindness, and materialistic balance.',
    strengths: ['Artistic Genius & Aesthetic Sense', 'Gentle & Harmonious Speech', 'Deep Wisdom & Learning', 'Natural Philanthropy'],
    challenges: ['Sensitivity to harsh environments', 'Propensity for overindulgence in comfort', 'Avoiding necessary conflict'],
    spiritualGuidance: 'Use your artistic talents for divine expression. Seek knowledge continuously and honor teachers and elders.',
    recommendedRituals: 'Worship Goddess Saraswati and perform Nag Puja on Panchami days.'
  },
  6: {
    tithiNumber: 6,
    name: 'Shashthi (6th Lunar Day)',
    groupType: 'Nandā',
    groupMeaning: 'Joy, Fame & Divine Victory (Auspicious)',
    rulingDeity: 'Lord Kartikeya / Skanda (Commander of Gods)',
    rulingPlanet: 'Venus (Shukra)',
    element: 'Fire (Agni Tattva)',
    soulPurposeTitle: 'The Energetic Adventurer & Defender',
    soulPurposeSummary: 'Your soul mission is to explore horizons, defend the vulnerable, and spread joy through energetic action and sweet communication.',
    personalityTraits: 'Adventurous, energetic, and charming. You love travel, speak sweetly, maintain humility in relationships, and radiate youthful vitality.',
    strengths: ['High Vitality & Charisma', 'Love for Exploration & Travel', 'Sweet & Diplomatic Speech', 'Strong Moral Compass'],
    challenges: ['Tendency to overindulge in food or pleasure', 'Prone to occasional impatience', 'Restless energy'],
    spiritualGuidance: 'Chant Lord Subramanya / Kartikeya mantras for victory over inner enemies (passions, pride, and anger).',
    recommendedRituals: 'Offer red flowers to Lord Kartikeya / Skanda on Shashthi days.'
  },
  7: {
    tithiNumber: 7,
    name: 'Saptami (7th Lunar Day)',
    groupType: 'Bhadrā',
    groupMeaning: 'Truth, Light & Sacred Knowledge (Auspicious)',
    rulingDeity: 'Surya (The Sun God)',
    rulingPlanet: 'Saturn (Shani)',
    element: 'Earth (Prithvi Tattva)',
    soulPurposeTitle: 'The Intellectual Scholar & Seeker of Truth',
    soulPurposeSummary: 'Born on Saptami, your soul purpose is to uncover deep truths, excel in sacred knowledge, and shine as a beacon of wisdom for society.',
    personalityTraits: 'Studious, intellectual, and spiritual. You possess serious analytical depth, contentment with simple living, and strong ethical principles.',
    strengths: ['Deep Intellectual & Spiritual Knowledge', 'Contentment & Serenity', 'Unwavering Ethics', 'Good Fortune in Family'],
    challenges: ['Can become overly detached', 'Reluctance to engage in worldly politics', 'Over-analytical mind'],
    spiritualGuidance: 'Share your wisdom generously. Maintain a balance between spiritual contemplation and worldly responsibilities.',
    recommendedRituals: 'Recite Aditya Hrudayam Stotram and offer red sandalwood to the Sun on Saptami.'
  },
  8: {
    tithiNumber: 8,
    name: 'Ashtami (8th Lunar Day)',
    groupType: 'Vijayā',
    groupMeaning: 'Mastery, Spiritual Power & Triumph (Auspicious)',
    rulingDeity: 'Goddess Durga & Lord Rudra / Shiva',
    rulingPlanet: 'Rahu',
    element: 'Space (Akasha Tattva)',
    soulPurposeTitle: 'The Mystic Warrior & Strategic Philosopher',
    soulPurposeSummary: 'Your divine mission is to master deep spiritual mysteries, overcome worldly trials, and protect truth using strategic wisdom and devotion.',
    personalityTraits: 'Strategic, observant, and mystically inclined. You possess high patience in adversity, keen interest in philosophy or occult sciences, and deep piety.',
    strengths: ['Profound Strategic Insight', 'Mystical & Philosophical Aptitude', 'Patience & Endurance', 'Strong Devotional Faith'],
    challenges: ['Secretive nature', 'Prone to intense internal reflections', 'Suspicion of superficial motives'],
    spiritualGuidance: 'Devote yourself to Goddess Durga. Use your deep insight to heal and protect others rather than withdrawing.',
    recommendedRituals: 'Chant Durga Saptashati or Om Dum Durgayei Namaha on Durgashtami days.'
  },
  9: {
    tithiNumber: 9,
    name: 'Navami (9th Lunar Day)',
    groupType: 'Riktā',
    groupMeaning: 'Sacred Austerity, Courage & Purification',
    rulingDeity: 'Goddess Chamunda / Durga & Lord Rama',
    rulingPlanet: 'Sun (Surya)',
    element: 'Water (Jala Tattva)',
    soulPurposeTitle: 'The Devotional Warrior & Divine Servant',
    soulPurposeSummary: 'Born on Navami, your soul purpose is to uphold righteousness, practice sacred discipline, and serve humanity with charitable devotion.',
    personalityTraits: 'Devout, honorable, and disciplined. You value family honor, worship divine ideals, display great scholarly potential, and stand firm in principles.',
    strengths: ['Unshakable Devotion & Duty', 'Scholarship & Moral Courage', 'Charitable Heart', 'Protection of Family Values'],
    challenges: ['Can become overly rigid or critical', 'Inner struggle with perfectionism', 'Emotional intensity'],
    spiritualGuidance: 'Practice unconditional compassion. Balance your high moral standards with forgiveness and warmth.',
    recommendedRituals: 'Worship Goddess Chamunda / Goddess Durga and recite Ramraksha Stotra on Navami days.'
  },
  10: {
    tithiNumber: 10,
    name: 'Dashami (10th Lunar Day)',
    groupType: 'Pūrṇā',
    groupMeaning: 'Complete Justice, Prosperity & Honor (Highly Auspicious)',
    rulingDeity: 'Dharmaraja (Lord of Righteousness & Justice)',
    rulingPlanet: 'Moon (Chandra)',
    element: 'Air (Vayu Tattva)',
    soulPurposeTitle: 'The Pillar of Justice & Social Harmony',
    soulPurposeSummary: 'Your soul mission is to restore balance, uphold justice, and serve as a stabilizing, respected figure in your community and family.',
    personalityTraits: 'Fair-minded, balanced, and ritualistic. You possess a strong natural sense of justice, respect for authority, and contentment with pure living.',
    strengths: ['High Sense of Justice & Fairness', 'Respected Leadership', 'Emotional Balance', 'Purity & Dignity'],
    challenges: ['Reluctance to compromise on ethics', 'High expectations of others', 'Avoiding messy conflicts'],
    spiritualGuidance: 'Lead by example. Use your natural authority to mediate conflicts and establish peace.',
    recommendedRituals: 'Perform Dharma Puja, honor elders, and chant Vishnu Mantras on Dashami days.'
  },
  11: {
    tithiNumber: 11,
    name: 'Ekadashi (11th Lunar Day)',
    groupType: 'Nandā',
    groupMeaning: 'Supreme Liberation, Faith & Purity (Most Auspicious)',
    rulingDeity: 'Lord Vishnu & Vishvadevas',
    rulingPlanet: 'Mars (Mangala)',
    element: 'Fire (Agni Tattva)',
    soulPurposeTitle: 'The Spiritual Ascetic & Beacon of Faith',
    soulPurposeSummary: 'Born on Ekadashi, your soul purpose is to achieve spiritual mastery, live by sacred dharma, and inspire others toward liberation and faith.',
    personalityTraits: 'Highly spiritual, self-restrained, and devoted. You possess deep intuitive faith, interest in fasting and purity, and profound knowledge of dharma.',
    strengths: ['Profound Spiritual Inclination', 'High Self-Control & Willpower', 'Brilliant Intuition', 'Purity of Intent'],
    challenges: ['Detachments from material ambitions', 'Strict self-judgment', 'Misunderstanding by worldly people'],
    spiritualGuidance: 'Remain steadfast in your spiritual vows while maintaining warm engagement with the world.',
    recommendedRituals: 'Observe Ekadashi Vrat (fasting), chant Om Namo Bhagavate Vasudevaya, and offer Tulsi leaves to Lord Vishnu.'
  },
  12: {
    tithiNumber: 12,
    name: 'Dwadashi (12th Lunar Day)',
    groupType: 'Bhadrā',
    groupMeaning: 'Abundance, Commerce & Mobility (Auspicious)',
    rulingDeity: 'Lord Vishnu & Goddess Aditi',
    rulingPlanet: 'Mercury (Budha)',
    element: 'Earth (Prithvi Tattva)',
    soulPurposeTitle: 'The Practical Merchant & Global Traveler',
    soulPurposeSummary: 'Your divine mission is to facilitate global trade, foster practical prosperity, and spread goodwill through movement and enterprise.',
    personalityTraits: 'Businesslike, versatile, and energetic. You excel in commerce, practical affairs, and travel, maintaining a keen eye for opportunity.',
    strengths: ['Commerce & Financial Acumen', 'Adaptability & Versatility', 'Global Perspective', 'Resourcefulness'],
    challenges: ['Fickle or restless mind', 'Physical fatigue from over-travel', 'Difficulty staying rooted'],
    spiritualGuidance: 'Anchor your busy enterprise in spiritual grounding. Dedicate a portion of your commercial gains to charity.',
    recommendedRituals: 'Perform Vishnu Puja and feed cows (Go Seva) on Dwadashi days.'
  },
  13: {
    tithiNumber: 13,
    name: 'Trayodashi (13th Lunar Day)',
    groupType: 'Vijayā',
    groupMeaning: 'Divine Grace, Longevity & Victory (Auspicious)',
    rulingDeity: 'Lord Shiva (Pradosha) & Kamadeva',
    rulingPlanet: 'Jupiter (Brihaspati)',
    element: 'Space (Akasha Tattva)',
    soulPurposeTitle: 'The Determined Scholar & Philanthropist',
    soulPurposeSummary: 'Born on Trayodashi, your soul mission is to achieve long-term goals through committed determination, sacred scholarship, and selfless philanthropy.',
    personalityTraits: 'Determined, scholarly, and generous. You pursue lifelong commitments with patience, excel in sacred learning, and possess strong self-control.',
    strengths: ['Long-Term Vision & Perseverance', 'Scholarly Excellence', 'Generous Philanthropy', 'Mastery over Desires'],
    challenges: ['Impatient with superficiality', 'Reluctance to ask for help', 'High personal standards'],
    spiritualGuidance: 'Observe Pradosham vrat for Lord Shiva. Your devotion brings divine grace and longevity to your undertakings.',
    recommendedRituals: 'Worship Lord Shiva during Pradosh Kaal on Trayodashi with Abhishekam.'
  },
  14: {
    tithiNumber: 14,
    name: 'Chaturdashi (14th Lunar Day)',
    groupType: 'Riktā',
    groupMeaning: 'Intense Valor, Mystical Power & Purification',
    rulingDeity: 'Lord Shiva (Rudra) & Goddess Kali',
    rulingPlanet: 'Venus (Shukra)',
    element: 'Water (Jala Tattva)',
    soulPurposeTitle: 'The Brave Guardian & Mystical Healer',
    soulPurposeSummary: 'Your soul mission is to face deep fears, conquer inner shadow, and emerge as a courageous guardian and mystical healer.',
    personalityTraits: 'Courageous, brave, and honorable. You possess exceptional valor in crisis, deep intuitive perception, and high spiritual potential.',
    strengths: ['Exceptional Valor & Bravery', 'Deep Intuitive Insight', 'Honorable & Wealthy Potential', 'Resilience in Crisis'],
    challenges: ['Inner conflict or indecision', 'Susceptibility to mental stress', 'Intense emotional waves'],
    spiritualGuidance: 'Channel your intense energy into Shiva worship and meditation. Guard your mental peace above all else.',
    recommendedRituals: 'Worship Lord Shiva with Mahamrityunjaya Mantra on Shivaratri / Chaturdashi days.'
  },
  15: {
    tithiNumber: 15,
    name: 'Purnima (15th Full Moon)',
    groupType: 'Pūrṇā',
    groupMeaning: 'Supreme Fulfillment, Radiance & Joy (Most Auspicious)',
    rulingDeity: 'Chandra (Moon God) & Lord Satyanarayan',
    rulingPlanet: 'Moon (Chandra)',
    element: 'Water (Jala Tattva)',
    soulPurposeTitle: 'The Luminous Soul & Master of Joy',
    soulPurposeSummary: 'Born on the Full Moon, your soul mission is to radiate warmth, joy, artistic brilliance, and emotional nourishment to all around you.',
    personalityTraits: 'Emotional, intelligent, joyful, and radiant. You are blessed with artistic sensitivity, love for comfort, and a magnetic, generous spirit.',
    strengths: ['Magnetic Charm & Radiance', 'Emotional Depth & Empathy', 'Artistic & Intellectual Genius', 'Abundance & Prosperity'],
    challenges: ['Heightened emotional sensitivity', 'Vulnerability to mood fluctuations', 'Seeking validation from others'],
    spiritualGuidance: 'Keep your mind focused on divine love. Perform Satyanarayan Vrat to channel your full moon radiance into lasting peace.',
    recommendedRituals: 'Perform Satyanarayan Vrat Katha and offer milk/kheer to the Full Moon.'
  },
  30: {
    tithiNumber: 30,
    name: 'Amavasya (30th New Moon)',
    groupType: 'Pūrṇā',
    groupMeaning: 'Introspective Power, Ancestral Wisdom & Secret Knowledge',
    rulingDeity: 'Pitrus (Ancestors) & Goddess Kali / Rahu',
    rulingPlanet: 'Rahu & Moon',
    element: 'Water / Ether',
    soulPurposeTitle: 'The Introspective Mystic & Keeper of Secret Knowledge',
    soulPurposeSummary: 'Born on the New Moon, your soul purpose is to master deep inner meditation, honor ancestral lineages, and unlock profound esoteric wisdom.',
    personalityTraits: 'Reserved, introspective, and highly intuitive. You possess immense willpower, secret insight into human nature, and deep spiritual potential.',
    strengths: ['Unshakable Willpower', 'Profound Intuition & Esoteric Insight', 'Ancestral Blessing & Protection', 'Inner Resilience'],
    challenges: ['Tendency toward secrecy or isolation', 'Complex internal moods', 'Occasional skepticism'],
    spiritualGuidance: 'Honor your ancestors regularly. Use your deep inner light to transform shadows into spiritual enlightenment.',
    recommendedRituals: 'Perform Tarpanam for Ancestors (Pitrus) and chant Kali / Shiva Mantras on Amavasya days.'
  }
};

// Localized versions generator helper
export function getLocalizedTithiSoulPurpose(tithiNum: number, lang: LanguageCode): TithiSoulPurposeInfo {
  // Normalize tithiNum to 1-15 or 30
  let key = tithiNum;
  if (key > 15 && key < 30) key = key - 15;
  if (key > 30) key = 30;
  if (key <= 0) key = 1;

  const base = EN_TITHI_DATA[key] || EN_TITHI_DATA[1];

  if (lang === 'en') return base;

  // Localized Overrides for Hindi, Gujarati, Hinglish, Tamil, Telugu, Bengali, Marathi, Russian, French, Spanish, Hebrew, Indonesian, Thai
  if (lang === 'hi' || lang === 'hinglish') {
    return {
      ...base,
      groupMeaning: lang === 'hi' ? 'शुभ आनंद, समृद्धि एवं नवीन कार्य' : 'Shubh Anand, Samriddhi & New Beginnings',
      soulPurposeTitle: base.tithiNumber === 1 ? 'पथप्रदर्शक एवं अग्रणी नेता' :
                        base.tithiNumber === 2 ? 'अनुशासित रक्षक एवं प्रशासक' :
                        base.tithiNumber === 3 ? 'साहसी एवं विजयी योद्धा' :
                        base.tithiNumber === 4 ? 'विघ्नहर्ता एवं परिवर्तनकर्ता' :
                        base.tithiNumber === 5 ? 'कलात्मक ज्ञानी एवं साधक' :
                        base.tithiNumber === 6 ? 'ऊर्जावान साहसी एवं रक्षक' :
                        base.tithiNumber === 7 ? 'सत्य का शोधक एवं विद्वान' :
                        base.tithiNumber === 8 ? 'रहस्यवादी एवं रणनीतिकार' :
                        base.tithiNumber === 9 ? 'धर्मनिष्ठ एवं परोपकारी सेवक' :
                        base.tithiNumber === 10 ? 'न्यायप्रिय एवं संतुलित व्यक्तित्व' :
                        base.tithiNumber === 11 ? 'परम धार्मिक एवं तपस्वी आत्मा' :
                        base.tithiNumber === 12 ? 'व्यापार कुशल एवं विश्व यात्री' :
                        base.tithiNumber === 13 ? 'दृढ़ संकल्पी एवं दानवीर विद्वान' :
                        base.tithiNumber === 14 ? 'साहसी वीर एवं रहस्यवादी रक्षक' :
                        base.tithiNumber === 15 ? 'पूर्ण तेजस्वी एवं आनंदमयी आत्मा' : 'गूढ़ ज्ञानी एवं आत्मज्ञानी साधक',
      soulPurposeSummary: lang === 'hi'
        ? `आपकी जन्म तिथि (${base.name}) दर्शाती है कि आपकी आत्मा का उद्देश्य समाज में सत्य, ज्ञान, साहस एवं आध्यात्मिक उन्नति फैलाना है।`
        : `Aapki Janma Tithi (${base.name}) darshati hai ki aapki aatma ka uddeshya samaj me satya, gyan, sahas aur spiritual progress phailana hai.`
    };
  }

  if (lang === 'gu') {
    return {
      ...base,
      groupMeaning: 'શુભ આનંદ, સમૃદ્ધિ અને નવી શરુઆતો',
      soulPurposeTitle: `આત્મિક હેતુ: ${base.soulPurposeTitle}`,
      soulPurposeSummary: `તમારી જન્મ તિથિ (${base.name}) દર્શાવે છે કે તમારો આત્મિક હેતુ જીવનમાં ધર્મ, સત્ય, સાહસ અને જ્ઞાનનો પ્રકાશ ફેલાવવાનો છે.`
    };
  }

  if (lang === 'ru') {
    return {
      ...base,
      groupMeaning: 'Священный радостный день, процветание и благословение',
      soulPurposeTitle: `Предназначение Души: ${base.soulPurposeTitle}`,
      soulPurposeSummary: `Ваш Лунный день рождения (${base.name}) указывает на великое предназначение вашей души: нести мудрость, свет и духовную силу в этот мир.`
    };
  }

  if (lang === 'ta') {
    return {
      ...base,
      groupMeaning: 'மங்களகரமான நாள், மகிழ்ச்சி & வளமை',
      soulPurposeTitle: `ஆன்மாவின் நோக்கம்: ${base.soulPurposeTitle}`,
      soulPurposeSummary: `உங்கள் திதி (${base.name}) உங்கள் ஆன்மாவின் முக்கிய நோக்கத்தை வெளிப்படுத்துகிறது: சமூகத்திற்கு நன்மையும் வழிகாட்டுதலும் வழங்குதல்.`
    };
  }

  if (lang === 'te') {
    return {
      ...base,
      groupMeaning: 'శుభకరమైన రోజు, ఆనందం & సమృద్ధి',
      soulPurposeTitle: `ఆత్మ లక్ష్యం: ${base.soulPurposeTitle}`,
      soulPurposeSummary: `మీ జన్మ తిథి (${base.name}) మీ ఆత్మ యొక్క దివ్య లక్ష్యాన్ని సూచిస్తుంది: సమాజంలో సత్యం మరియు జ్ఞానాన్ని వ్యాప్తి చేయడం.`
    };
  }

  if (lang === 'bn') {
    return {
      ...base,
      groupMeaning: 'শুভ আনন্দ, সমৃদ্ধি ও নব সূচনা',
      soulPurposeTitle: `আত্মার উদ্দেশ্য: ${base.soulPurposeTitle}`,
      soulPurposeSummary: `আপনার জন্ম তিথি (${base.name}) প্রকাশ করে আপনার আত্মার প্রধান উদ্দেশ্য: জীবনে সত্য, সাহস ও জ্ঞানের আলো ছড়িয়ে দেওয়া।`
    };
  }

  if (lang === 'mr') {
    return {
      ...base,
      groupMeaning: 'आनंद, समृद्धी आणि शुभ कार्य',
      soulPurposeTitle: `आत्म्याचा उद्देश: ${base.soulPurposeTitle}`,
      soulPurposeSummary: `तुमची जन्म तिथी (${base.name}) हे दर्शवते की तुमच्या आत्म्याचा उद्देश समाजात धर्म, सत्य आणि ज्ञानाचा प्रकाश पसरवणे हा आहे.`
    };
  }

  if (lang === 'fr') {
    return {
      ...base,
      groupMeaning: 'Jour sacré, joie, prospérité et bénédictions',
      soulPurposeTitle: `Mission de l'Âme: ${base.soulPurposeTitle}`,
      soulPurposeSummary: `Votre Tithi de naissance (${base.name}) révèle le but profond de votre âme: inspirer la sagesse, la force et l'harmonie spirituelle.`
    };
  }

  if (lang === 'es') {
    return {
      ...base,
      groupMeaning: 'Día sagrado, prosperidad y bendiciones divinas',
      soulPurposeTitle: `Propósito del Alma: ${base.soulPurposeTitle}`,
      soulPurposeSummary: `Su Tithi de nacimiento (${base.name}) revela el propósito sagrado de su alma: difundir sabiduría, coraje y luz espiritual.`
    };
  }

  if (lang === 'th') {
    return {
      ...base,
      groupMeaning: 'วันฤกษ์ดี มงคล ความสุข และความเจริญรุ่งเรือง',
      soulPurposeTitle: `จุดมุ่งหมายของจิตวิญญาณ: ${base.soulPurposeTitle}`,
      soulPurposeSummary: `ดิถีกำเนิดของคุณ (${base.name}) เผยถึงปณิธานแห่งจิตวิญญาณในการนำปัญญา ความกล้าหาญ และความเจริญมาสู่ชีวิต`
    };
  }

  if (lang === 'id') {
    return {
      ...base,
      groupMeaning: 'Hari Suci, Keberkahan, Kedamaian & Kebijaksanaan',
      soulPurposeTitle: `Tujuan Jiwa di Bumi: ${base.soulPurposeTitle}`,
      soulPurposeSummary: `Tithi Kelahiran Anda (${base.name}) menunjukkan tujuan suci jiwa Anda untuk menyebarkan kebenaran, keberanian, dan kebijaksanaan.`
    };
  }

  return base;
}
