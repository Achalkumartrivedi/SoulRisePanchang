import { LanguageCode } from '../types/language';

export interface TithiSoulPurposeInfo {
  tithiNumber: number; // 1 to 15, 30
  name: string;
  groupType: 'Nandā' | 'Bhadrā' | 'Vijayā' | 'Riktā' | 'Pūrṇā';
  groupMeaning: string;
  rulingDeity: string;
  shuklaDeity: string;
  krishnaDeity: string;
  rulingPlanet: string;
  element: string; // Panchamahabhuta element (Fire, Earth, Space, Water, Air)
  elementMeaning: string;
  soulPurposeTitle: string;
  soulPurposeSummary: string;
  personalityTraits: string;
  strengths: string[];
  challenges: string[];
  spiritualGuidance: string;
  recommendedRituals: string;
  
  // Advanced Tithi Secrets
  dagdhaRashis: string; // Tithi Shoonya (Burnt Signs)
  dagdhaLords: string;
  dagdhaImpact: string;
  nullificationRule: string;
  westernLunationPhase: string; // Rudhyar Soli-Lunar Type
  westernPhaseDescription: string;
  epigeneticDiet: string;
  dayColorRemedy: string;
}

export type TithiDataMap = Record<number, TithiSoulPurposeInfo>;

const EN_TITHI_DATA: TithiDataMap = {
  1: {
    tithiNumber: 1,
    name: 'Pratipada (1st Lunar Day)',
    groupType: 'Nandā',
    groupMeaning: 'Joyful, Fire Element (Agni) • Venus Elemental Lord',
    rulingDeity: 'Agni & Brahma / Durga',
    shuklaDeity: 'Lord Brahma (Creator)',
    krishnaDeity: 'Goddess Durga (Supreme Protector)',
    rulingPlanet: 'Sun (Surya)',
    element: 'Fire (Agni Tattva)',
    elementMeaning: 'Promotes quick action, celebration, artistic initiatives, and physical vitality.',
    soulPurposeTitle: 'The Trailblazer & Sovereign Pioneer',
    soulPurposeSummary: 'Born on Pratipada, your soul purpose is to ignite new paths, pioneer fresh ideas, and lead others out of darkness with unshakeable willpower.',
    personalityTraits: 'Strong-willed, independent, and ambitious. You possess natural leadership potential and a fiery drive to initiate original projects.',
    strengths: ['Natural Leadership & Vision', 'High Energy & Enthusiasm', 'Uncompromising Integrity', 'Pioneering Spirit'],
    challenges: ['Can be stubborn or overly self-reliant', 'Restlessness with routine tasks', 'Prone to impulse decisions'],
    spiritualGuidance: 'Channel your fiery independence into selfless service and community leadership. Practice patience when working with others.',
    recommendedRituals: 'Offer water to the morning Sun (Surya Arghya) and light a ghee lamp for Lord Agni on Pratipada days.',
    dagdhaRashis: 'Libra (Tula) & Capricorn (Makara)',
    dagdhaLords: 'Venus (Shukra) & Saturn (Shani)',
    dagdhaImpact: 'Creates initial life delays, challenges with authority, and delayed marital stability.',
    nullificationRule: 'Nullified if Venus or Saturn sit in Dusthana houses (3rd, 6th, 8th, 12th), are Retrograde, or conjoin Rahu/Ketu/Mars.',
    westernLunationPhase: 'New Moon Phase (0° to 45°)',
    westernPhaseDescription: 'Subjective, instinctive drive to project personal identity and launch new life cycles.',
    epigeneticDiet: 'Avoid overly heating or toxic substances to protect cell nucleus vitality (Sun). Traditional ghee and pure water support digestive Agni.',
    dayColorRemedy: 'Wear Orange on Sundays (Sun) & White on Mondays (Moon) to balance primary vitality during Rahu Kaal.'
  },
  2: {
    tithiNumber: 2,
    name: 'Dvitiya (2nd Lunar Day)',
    groupType: 'Bhadrā',
    groupMeaning: 'Auspicious, Earth Element (Prithvi) • Mercury Elemental Lord',
    rulingDeity: 'Hari / Vidhatr & Yama',
    shuklaDeity: 'Vidhatr / Lord Vishnu (Preserver)',
    krishnaDeity: 'Dandadhara / Lord Yama (Justice)',
    rulingPlanet: 'Moon (Chandra)',
    element: 'Earth (Prithvi Tattva)',
    elementMeaning: 'Provides grounding, suitable for travel, business setups, and structural foundations.',
    soulPurposeTitle: 'The Disciplined Guardian & Administrator',
    soulPurposeSummary: 'Your soul mission is to bring structure, stability, and healing to society through disciplined administration and unwavering commitment to truth.',
    personalityTraits: 'Serious, disciplined, and highly organized. You carry strong decision-making abilities, administrative prowess, and deep devotion to family.',
    strengths: ['Exceptional Discipline & Reliability', 'Strong Administrative Skills', 'Courage in Adversity', 'High Respect for Tradition'],
    challenges: ['Can be overly stern or rigid', 'Difficulty expressing soft emotions', 'Tendency toward blunt communication'],
    spiritualGuidance: 'Cultivate compassion alongside discipline. Balance your serious nature with creative or musical relaxation.',
    recommendedRituals: 'Chant Vishnu Sahasranama and honor Lord Hari on Dvitiya days.',
    dagdhaRashis: 'Sagittarius (Dhanu) & Pisces (Meena)',
    dagdhaLords: 'Jupiter (Guru)',
    dagdhaImpact: 'Restricts access to higher wisdom, mentors, financial expansion, and structural logic.',
    nullificationRule: 'Shoonya Dosha is neutralized if Jupiter is in the 3rd, 6th, 8th, or 12th house, or retrograde in own sign.',
    westernLunationPhase: 'New Moon Phase (0° to 45°)',
    westernPhaseDescription: 'Focuses on grounding personal identity and establishing foundational habits.',
    epigeneticDiet: 'Dairy products and lower-glycemic foods align with Moon energy; ensure proper circulation with mild spices.',
    dayColorRemedy: 'Wear White on Mondays (Moon) & Yellow on Thursdays (Jupiter).'
  },
  3: {
    tithiNumber: 3,
    name: 'Tritiya (3rd Lunar Day)',
    groupType: 'Vijayā',
    groupMeaning: 'Victorious, Space Element (Akasha) • Mars Elemental Lord',
    rulingDeity: 'Gauri & Shiva / Virinchi',
    shuklaDeity: 'Goddess Gauri (Grace & Power)',
    krishnaDeity: 'Lord Shiva / Virinchi',
    rulingPlanet: 'Mars (Mangala)',
    element: 'Space (Akasha Tattva)',
    elementMeaning: 'Enhances competitive drive, litigation success, and defensive protective works.',
    soulPurposeTitle: 'The Fearless Conqueror & Victor',
    soulPurposeSummary: 'Born on Tritiya, your divine mandate is to conquer obstacles, defend righteousness, and achieve victory through courage and energetic action.',
    personalityTraits: 'Bold, energetic, and fearless. You thrive under challenge, possess magnetic charisma, and never back down from a worthy fight.',
    strengths: ['Fearless Courage', 'Dynamic Action & Enthusiasm', 'Magnetic Charisma', 'Unstoppable Determination'],
    challenges: ['Impatient with slow progress', 'Can become overly competitive', 'Risk of minor disputes'],
    spiritualGuidance: 'Direct your immense courage toward noble causes. Worship Goddess Gauri to infuse your power with divine grace.',
    recommendedRituals: 'Worship Goddess Parvati / Gauri and chant Mangal Mantras on Tritiya days.',
    dagdhaRashis: 'Leo (Simha) & Capricorn (Makara)',
    dagdhaLords: 'Sun (Surya) & Saturn (Shani)',
    dagdhaImpact: 'Impedes professional recognition, leadership roles, and structural growth.',
    nullificationRule: 'Neutralized if Sun or Saturn sit in Dusthanas (3rd, 6th, 8th, 12th) or have malefic conjunctions.',
    westernLunationPhase: 'New Moon Phase (0° to 45°)',
    westernPhaseDescription: 'Driven by instinctive urge for personal breakthrough and courageous self-expression.',
    epigeneticDiet: 'Spicy, iron-rich foods support Martian vital force; balance with cooling herbal teas.',
    dayColorRemedy: 'Wear Red on Tuesdays (Mars) and Orange on Sundays (Sun).'
  },
  4: {
    tithiNumber: 4,
    name: 'Chaturthi (4th Lunar Day)',
    groupType: 'Riktā',
    groupMeaning: 'Empty / Void, Water Element (Apas) • Saturn Elemental Lord',
    rulingDeity: 'Ganesha & Vishnu',
    shuklaDeity: 'Lord Ganesha (Remover of Obstacles)',
    krishnaDeity: 'Lord Vishnu (Preserver)',
    rulingPlanet: 'Mercury (Budha)',
    element: 'Water (Jala Tattva)',
    elementMeaning: 'Induces emotional sensitivity; preferred for cleansing, purification, and overcoming enemies.',
    soulPurposeTitle: 'The Master Alchemist & Obstacle Solver',
    soulPurposeSummary: 'Your soul chosen path is to turn challenges into spiritual wisdom, solve complex problems, and guide others through life’s transformations.',
    personalityTraits: 'Generous, highly intelligent, and resourceful. While life may test you with ups and downs, you possess deep resilience and sharp intellect.',
    strengths: ['Deep Problem-Solving Ability', 'Resilience in Adversity', 'Generous & Charitable Nature', 'Keen Intuition'],
    challenges: ['Occasional mental confusion or stress', 'Sudden shifts in fortune', 'Tendency to overthink'],
    spiritualGuidance: 'Surrender all worries to Lord Ganesha. Understand that life’s obstacles are stepping stones to your ultimate spiritual awakening.',
    recommendedRituals: 'Chant Ganesha Atharvashirsha and offer Durva grass on Sankashti / Vinayaka Chaturthi.',
    dagdhaRashis: 'Taurus (Vrishabha) & Aquarius (Kumbha)',
    dagdhaLords: 'Venus (Shukra) & Saturn (Shani)',
    dagdhaImpact: 'Heightens emotional anxiety, financial instability, and relationship friction.',
    nullificationRule: 'Fully nullified if Venus is in 6th house or Saturn is Retrograde (as seen in classic nullification cases).',
    westernLunationPhase: 'New Moon Phase (0° to 45°)',
    westernPhaseDescription: 'Transition phase requiring internal cleansing of past emotional patterns.',
    epigeneticDiet: 'Avoid excess refined sugars; consume green leafy vegetables and tulsi tea to align with Mercury/Ganesha energy.',
    dayColorRemedy: 'Wear Green on Wednesdays (Mercury) & Black/Blue on Saturdays.'
  },
  5: {
    tithiNumber: 5,
    name: 'Panchami (5th Lunar Day)',
    groupType: 'Pūrṇā',
    groupMeaning: 'Complete, Air Element (Vayu) • Jupiter Elemental Lord',
    rulingDeity: 'Gouri / Saraswati & Hari',
    shuklaDeity: 'Goddess Saraswati & Naga Devatas',
    krishnaDeity: 'Lord Hari / Vishnu',
    rulingPlanet: 'Jupiter (Brihaspati)',
    element: 'Air (Vayu Tattva)',
    elementMeaning: 'Represents completion, spiritual fulfillment, and general success in benevolent acts.',
    soulPurposeTitle: 'The Creative Artist & Divine Scholar',
    soulPurposeSummary: 'Born on Panchami, your soul mission is to bring beauty, wisdom, artistic elegance, and spiritual harmony into the world.',
    personalityTraits: 'Creative, harmonious, and aesthetics-oriented. You appreciate art, music, and literature, displaying warmth, kindness, and materialistic balance.',
    strengths: ['Artistic Genius & Aesthetic Sense', 'Gentle & Harmonious Speech', 'Deep Wisdom & Learning', 'Natural Philanthropy'],
    challenges: ['Sensitivity to harsh environments', 'Propensity for overindulgence in comfort', 'Avoiding necessary conflict'],
    spiritualGuidance: 'Use your artistic talents for divine expression. Seek knowledge continuously and honor teachers and elders.',
    recommendedRituals: 'Worship Goddess Saraswati and perform Nag Puja on Panchami days.',
    dagdhaRashis: 'Gemini (Mithuna) & Virgo (Kanya)',
    dagdhaLords: 'Mercury (Budha)',
    dagdhaImpact: 'Hampers early education, intellectual expression, and commercial transactions.',
    nullificationRule: 'Neutralized if Mercury is placed in the 3rd, 6th, 8th, or 12th house or conjoins a malefic.',
    westernLunationPhase: 'Waxing Crescent Phase (45° to 90°)',
    westernPhaseDescription: 'Confronting past inertia and establishing independent creative expression.',
    epigeneticDiet: 'Pure vegetarian diet, yellow lentils, and turmeric milk enhance Jovian intellectual clarity.',
    dayColorRemedy: 'Wear Yellow on Thursdays (Jupiter) & White on Fridays.'
  },
  6: {
    tithiNumber: 6,
    name: 'Shashthi (6th Lunar Day)',
    groupType: 'Nandā',
    groupMeaning: 'Joyful, Fire Element (Agni) • Venus Elemental Lord',
    rulingDeity: 'Kartikeya / Ganesha & Ravi / Agni',
    shuklaDeity: 'Lord Kartikeya / Skanda (Commander)',
    krishnaDeity: 'Ravi (Sun) & Agni',
    rulingPlanet: 'Venus (Shukra)',
    element: 'Fire (Agni Tattva)',
    elementMeaning: 'Promotes physical vitality, competitive excellence, exploration, and victory over inner enemies.',
    soulPurposeTitle: 'The Energetic Adventurer & Defender',
    soulPurposeSummary: 'Your soul mission is to explore horizons, defend the vulnerable, and spread joy through energetic action and sweet communication.',
    personalityTraits: 'Adventurous, energetic, and charming. You love travel, speak sweetly, maintain humility in relationships, and radiate youthful vitality.',
    strengths: ['High Vitality & Charisma', 'Love for Exploration & Travel', 'Sweet & Diplomatic Speech', 'Strong Moral Compass'],
    challenges: ['Tendency to overindulge in food or pleasure', 'Prone to occasional impatience', 'Restless energy'],
    spiritualGuidance: 'Chant Lord Subramanya / Kartikeya mantras for victory over inner enemies (passions, pride, and anger).',
    recommendedRituals: 'Offer red flowers to Lord Kartikeya / Skanda on Shashthi days.',
    dagdhaRashis: 'Aries (Mesha) & Leo (Simha)',
    dagdhaLords: 'Mars (Mangala) & Sun (Surya)',
    dagdhaImpact: 'Weakens physical vitality, compromises self-worth, and strains relations with paternal figures.',
    nullificationRule: 'Neutralized if Mars or Sun are in 3rd, 6th, 8th, 12th houses or retrograde.',
    westernLunationPhase: 'Waxing Crescent Phase (45° to 90°)',
    westernPhaseDescription: 'Mobilizing personal resources to overcome past limitations and build momentum.',
    epigeneticDiet: 'Fresh fruits and cooling pomegranate juice balance Venusian/Martian Agni.',
    dayColorRemedy: 'Wear Grey/White on Fridays (Venus) & Red on Tuesdays.'
  },
  7: {
    tithiNumber: 7,
    name: 'Saptami (7th Lunar Day)',
    groupType: 'Bhadrā',
    groupMeaning: 'Auspicious, Earth Element (Prithvi) • Mercury Elemental Lord',
    rulingDeity: 'Yama & Kama / Indra / Surya',
    shuklaDeity: 'Surya (Sun God) & Yama',
    krishnaDeity: 'Kama (Desire) & Lord Indra',
    rulingPlanet: 'Saturn (Shani)',
    element: 'Earth (Prithvi Tattva)',
    elementMeaning: 'Provides grounding, deep academic study, sustained endurance, and ethical foundations.',
    soulPurposeTitle: 'The Intellectual Scholar & Seeker of Truth',
    soulPurposeSummary: 'Born on Saptami, your soul purpose is to uncover deep truths, excel in sacred knowledge, and shine as a beacon of wisdom for society.',
    personalityTraits: 'Studious, intellectual, and spiritual. You possess serious analytical depth, contentment with simple living, and strong ethical principles.',
    strengths: ['Deep Intellectual & Spiritual Knowledge', 'Contentment & Serenity', 'Unwavering Ethics', 'Good Fortune in Family'],
    challenges: ['Can become overly detached', 'Reluctance to engage in worldly politics', 'Over-analytical mind'],
    spiritualGuidance: 'Share your wisdom generously. Maintain a balance between spiritual contemplation and worldly responsibilities.',
    recommendedRituals: 'Recite Aditya Hrudayam Stotram and offer red sandalwood to the Sun on Saptami.',
    dagdhaRashis: 'Cancer (Karka) & Sagittarius (Dhanu)',
    dagdhaLords: 'Moon (Chandra) & Jupiter (Guru)',
    dagdhaImpact: 'Destabilizes mental peace, affects relationship with mother, and challenges core ethics.',
    nullificationRule: 'Dosha is cleared if Moon or Jupiter sit in Dusthana houses or are conjoined with malefics.',
    westernLunationPhase: 'Waxing Crescent Phase (45° to 90°)',
    westernPhaseDescription: 'Establishing firm intellectual boundaries and refining personal ethics.',
    epigeneticDiet: 'Simple sattvic meals, sesame seeds, and whole grains align with Saturnian endurance.',
    dayColorRemedy: 'Wear Black/Dark Blue on Saturdays (Saturn) & Orange on Sundays.'
  },
  8: {
    tithiNumber: 8,
    name: 'Ashtami (8th Lunar Day)',
    groupType: 'Vijayā',
    groupMeaning: 'Victorious, Space Element (Akasha) • Mars Elemental Lord',
    rulingDeity: 'Naga / Durga & Shankara / Shiva',
    shuklaDeity: 'Goddess Durga & Naga Devatas',
    krishnaDeity: 'Lord Shankara / Shiva',
    rulingPlanet: 'Rahu',
    element: 'Space (Akasha Tattva)',
    elementMeaning: 'Enhances competitive drive, spiritual discipline, occult mastery, and strategic wisdom.',
    soulPurposeTitle: 'The Mystic Warrior & Strategic Philosopher',
    soulPurposeSummary: 'Your divine mission is to master deep spiritual mysteries, overcome worldly trials, and protect truth using strategic wisdom and devotion.',
    personalityTraits: 'Strategic, observant, and mystically inclined. You possess high patience in adversity, keen interest in philosophy or occult sciences, and deep piety.',
    strengths: ['Profound Strategic Insight', 'Mystical & Philosophical Aptitude', 'Patience & Endurance', 'Strong Devotional Faith'],
    challenges: ['Secretive nature', 'Prone to intense internal reflections', 'Suspicion of superficial motives'],
    spiritualGuidance: 'Devote yourself to Goddess Durga. Observe Ashtami fasting to refine decision-making and clear past karmic debts.',
    recommendedRituals: 'Chant Durga Saptashati or Om Dum Durgayei Namaha on Durgashtami days.',
    dagdhaRashis: 'Gemini (Mithuna) & Virgo (Kanya)',
    dagdhaLords: 'Mercury (Budha)',
    dagdhaImpact: 'Introduces analytical paralysis, nervous exhaustion, and communication blocks.',
    nullificationRule: 'Nullified if Mercury is in 3rd, 6th, 8th, or 12th house, Retrograde, or conjoined Rahu/Ketu.',
    westernLunationPhase: 'Waxing Crescent Phase (45° to 90°)',
    westernPhaseDescription: 'Crisis of action requiring transformation of internal shadows into strategic strength.',
    epigeneticDiet: 'Fasting on Ashtami clears nervous system inflammation; drink coconut water and herbal infusions.',
    dayColorRemedy: 'Wear Blue/Black on Saturdays (Rahu/Saturn) & Red on Tuesdays (Mars).'
  },
  9: {
    tithiNumber: 9,
    name: 'Navami (9th Lunar Day)',
    groupType: 'Riktā',
    groupMeaning: 'Empty / Void, Water Element (Apas) • Saturn Elemental Lord',
    rulingDeity: 'Chandra / Rama & Kaladhara / Durga',
    shuklaDeity: 'Chandra & Lord Rama',
    krishnaDeity: 'Kaladhara / Goddess Durga',
    rulingPlanet: 'Sun (Surya)',
    element: 'Water (Jala Tattva)',
    elementMeaning: 'Induces emotional purification, spiritual discipline, and devotion.',
    soulPurposeTitle: 'The Devotional Warrior & Divine Servant',
    soulPurposeSummary: 'Born on Navami, your soul purpose is to uphold righteousness, practice sacred discipline, and serve humanity with charitable devotion.',
    personalityTraits: 'Devout, honorable, and disciplined. You value family honor, worship divine ideals, display great scholarly potential, and stand firm in principles.',
    strengths: ['Unshakable Devotion & Duty', 'Scholarship & Moral Courage', 'Charitable Heart', 'Protection of Family Values'],
    challenges: ['Can become overly rigid or critical', 'Inner struggle with perfectionism', 'Emotional intensity'],
    spiritualGuidance: 'Practice unconditional compassion. Balance your high moral standards with forgiveness and warmth.',
    recommendedRituals: 'Worship Goddess Chamunda / Goddess Durga and recite Ramraksha Stotra on Navami days.',
    dagdhaRashis: 'Cancer (Karka) & Leo (Simha)',
    dagdhaLords: 'Moon (Chandra) & Sun (Surya)',
    dagdhaImpact: 'Affects maternal and paternal relationships and undermines foundational confidence.',
    nullificationRule: 'Nullified if Moon or Sun sit in Dusthana houses (3rd, 6th, 8th, 12th).',
    westernLunationPhase: 'First Quarter Phase (90° to 135°)',
    westernPhaseDescription: 'Active building phase requiring clear decision-making and clearing outdated habits.',
    epigeneticDiet: 'Wheat, honey, and solar-energized water support core vitality and digestive strength.',
    dayColorRemedy: 'Wear Orange on Sundays (Sun) & Red on Tuesdays.'
  },
  10: {
    tithiNumber: 10,
    name: 'Dashami (10th Lunar Day)',
    groupType: 'Pūrṇā',
    groupMeaning: 'Complete, Air Element (Vayu) • Jupiter Elemental Lord',
    rulingDeity: 'Kartikeya / Dharmaraja & Yama',
    shuklaDeity: 'Lord Kartikeya & Dharmaraja (Righteousness)',
    krishnaDeity: 'Lord Yama (Justice)',
    rulingPlanet: 'Moon (Chandra)',
    element: 'Air (Vayu Tattva)',
    elementMeaning: 'Represents completion, social order, justice, and spiritual harmony.',
    soulPurposeTitle: 'The Pillar of Justice & Social Harmony',
    soulPurposeSummary: 'Your soul mission is to restore balance, uphold justice, and serve as a stabilizing, respected figure in your community and family.',
    personalityTraits: 'Fair-minded, balanced, and ritualistic. You possess a strong natural sense of justice, respect for authority, and contentment with pure living.',
    strengths: ['High Sense of Justice & Fairness', 'Respected Leadership', 'Emotional Balance', 'Purity & Dignity'],
    challenges: ['Reluctance to compromise on ethics', 'High expectations of others', 'Avoiding messy conflicts'],
    spiritualGuidance: 'Lead by example. Use your natural authority to mediate conflicts and establish peace.',
    recommendedRituals: 'Perform Dharma Puja, honor elders, and chant Vishnu Mantras on Dashami days.',
    dagdhaRashis: 'Leo (Simha) & Scorpio (Vrishchika)',
    dagdhaLords: 'Sun (Surya) & Mars (Mangala)',
    dagdhaImpact: 'Strains relations with authority and causes sudden professional roadblocks.',
    nullificationRule: 'Neutralized if Sun or Mars sit in 3rd, 6th, 8th, 12th houses or are Retrograde.',
    westernLunationPhase: 'First Quarter Phase (90° to 135°)',
    westernPhaseDescription: 'Consolidating social structures and building tangible career success.',
    epigeneticDiet: 'Cooling milk beverages, almonds, and rice dishes promote emotional stability.',
    dayColorRemedy: 'Wear White on Mondays (Moon) & Yellow on Thursdays.'
  },
  11: {
    tithiNumber: 11,
    name: 'Ekadashi (11th Lunar Day)',
    groupType: 'Nandā',
    groupMeaning: 'Joyful, Fire Element (Agni) • Venus Elemental Lord',
    rulingDeity: 'Surya & Chandra / Vishnu',
    shuklaDeity: 'Surya & Lord Vishnu (Supreme Preserver)',
    krishnaDeity: 'Chandra (Moon God)',
    rulingPlanet: 'Mars (Mangala)',
    element: 'Fire (Agni Tattva)',
    elementMeaning: 'Produces intense spiritual Agni; suited for fasting, self-restraint, and clearing past karmic patterns.',
    soulPurposeTitle: 'The Spiritual Ascetic & Beacon of Faith',
    soulPurposeSummary: 'Born on Ekadashi, your soul purpose is to achieve spiritual mastery, live by sacred dharma, and inspire others toward liberation and faith.',
    personalityTraits: 'Highly spiritual, self-restrained, and devoted. You possess deep intuitive faith, interest in fasting and purity, and profound knowledge of dharma.',
    strengths: ['Profound Spiritual Inclination', 'High Self-Control & Willpower', 'Brilliant Intuition', 'Purity of Intent'],
    challenges: ['Detachments from material ambitions', 'Strict self-judgment', 'Misunderstanding by worldly people'],
    spiritualGuidance: 'Observe Ekadashi Vrat (fasting). Note: Break fast (Parana) during Dwadashi, outside Hari Vasara window.',
    recommendedRituals: 'Observe Ekadashi Vrat, chant Om Namo Bhagavate Vasudevaya, and offer Tulsi leaves to Lord Vishnu.',
    dagdhaRashis: 'Sagittarius (Dhanu) & Pisces (Meena)',
    dagdhaLords: 'Jupiter (Guru)',
    dagdhaImpact: 'Impedes spiritual development and restricts wealth-generating opportunities.',
    nullificationRule: 'Fully nullified if Jupiter is in 3rd, 6th, 8th, 12th house or retrograde.',
    westernLunationPhase: 'First Quarter Phase (90° to 135°)',
    westernPhaseDescription: 'Intense breakthrough phase overcoming material attachments.',
    epigeneticDiet: 'Fasting on grains/beans during Ekadashi clears metabolic debris and past emotional karmas.',
    dayColorRemedy: 'Wear Red on Tuesdays (Mars) & Yellow on Thursdays.'
  },
  12: {
    tithiNumber: 12,
    name: 'Dwadashi (12th Lunar Day)',
    groupType: 'Bhadrā',
    groupMeaning: 'Auspicious, Earth Element (Prithvi) • Mercury Elemental Lord',
    rulingDeity: 'Indra & Vishnu',
    shuklaDeity: 'Lord Indra (King of Devas) & Vishnu',
    krishnaDeity: 'Lord Vishnu (Preserver)',
    rulingPlanet: 'Mercury (Budha)',
    element: 'Earth (Prithvi Tattva)',
    elementMeaning: 'Provides grounding, practical commerce, asset building, and travel.',
    soulPurposeTitle: 'The Practical Merchant & Global Traveler',
    soulPurposeSummary: 'Your divine mission is to facilitate global trade, foster practical prosperity, and spread goodwill through movement and enterprise.',
    personalityTraits: 'Businesslike, versatile, and energetic. You excel in commerce, practical affairs, and travel, maintaining a keen eye for opportunity.',
    strengths: ['Commerce & Financial Acumen', 'Adaptability & Versatility', 'Global Perspective', 'Resourcefulness'],
    challenges: ['Fickle or restless mind', 'Physical fatigue from over-travel', 'Difficulty staying rooted'],
    spiritualGuidance: 'Anchor your busy enterprise in spiritual grounding. Dedicate a portion of your commercial gains to charity.',
    recommendedRituals: 'Perform Vishnu Puja, break Ekadashi fast cleanly after Hari Vasara, and feed cows (Go Seva).',
    dagdhaRashis: 'Libra (Tula) & Capricorn (Makara)',
    dagdhaLords: 'Venus (Shukra) & Saturn (Shani)',
    dagdhaImpact: 'Delays professional maturity, structural stability, and domestic harmony.',
    nullificationRule: 'Neutralized if Venus or Saturn are placed in Dusthana houses or conjoined malefics.',
    westernLunationPhase: 'First Quarter Phase (90° to 135°)',
    westernPhaseDescription: 'Building long-term practical structures and establishing trade connections.',
    epigeneticDiet: 'Nourishing grains, mung dal, and dairy support physical stamina after fasting.',
    dayColorRemedy: 'Wear Green on Wednesdays (Mercury) & White on Fridays.'
  },
  13: {
    tithiNumber: 13,
    name: 'Trayodashi (13th Lunar Day)',
    groupType: 'Vijayā',
    groupMeaning: 'Victorious, Space Element (Akasha) • Mars Elemental Lord',
    rulingDeity: 'Mahendra / Shiva & Kama',
    shuklaDeity: 'Mahendra / Lord Shiva (Pradosham)',
    krishnaDeity: 'Kamadeva (Deity of Desire & Love)',
    rulingPlanet: 'Jupiter (Brihaspati)',
    element: 'Space (Akasha Tattva)',
    elementMeaning: 'Enhances competitive victory, longevity, sacred study, and long-term goal achievement.',
    soulPurposeTitle: 'The Determined Scholar & Philanthropist',
    soulPurposeSummary: 'Born on Trayodashi, your soul mission is to achieve long-term goals through committed determination, sacred scholarship, and selfless philanthropy.',
    personalityTraits: 'Determined, scholarly, and generous. You pursue lifelong commitments with patience, excel in sacred learning, and possess strong self-control.',
    strengths: ['Long-Term Vision & Perseverance', 'Scholarly Excellence', 'Generous Philanthropy', 'Mastery over Desires'],
    challenges: ['Impatient with superficiality', 'Reluctance to ask for help', 'High personal standards'],
    spiritualGuidance: 'Observe Pradosham vrat for Lord Shiva. Your devotion brings divine grace and longevity to your undertakings.',
    recommendedRituals: 'Worship Lord Shiva during Pradosh Kaal on Trayodashi with Abhishekam.',
    dagdhaRashis: 'Taurus (Vrishabha) & Aquarius (Kumbha)',
    dagdhaLords: 'Venus (Shukra) & Saturn (Shani)',
    dagdhaImpact: 'Impedes long-term business investments and early asset accumulation.',
    nullificationRule: 'Neutralized if Venus or Saturn sit in 3rd, 6th, 8th, 12th houses or are Retrograde.',
    westernLunationPhase: 'Gibbous Phase (135° to 180°)',
    westernPhaseDescription: 'Self-analysis, refining long-term goals, and aligning spiritual details.',
    epigeneticDiet: 'Pure ghee, honey, and almonds nourish Jovian intellectual and spiritual endurance.',
    dayColorRemedy: 'Wear Yellow on Thursdays (Jupiter) & White on Fridays.'
  },
  14: {
    tithiNumber: 14,
    name: 'Chaturdashi (14th Lunar Day)',
    groupType: 'Riktā',
    groupMeaning: 'Empty / Void, Water Element (Apas) • Saturn Elemental Lord',
    rulingDeity: 'Vasva / Kali & Shiva',
    shuklaDeity: 'Vasva / Goddess Kali',
    krishnaDeity: 'Lord Shiva (Rudra)',
    rulingPlanet: 'Venus (Shukra)',
    element: 'Water (Jala Tattva)',
    elementMeaning: 'Induces intense emotional purification, spiritual transformation, and destruction of negativity.',
    soulPurposeTitle: 'The Brave Guardian & Mystical Healer',
    soulPurposeSummary: 'Your soul mission is to face deep fears, conquer inner shadow, and emerge as a courageous guardian and mystical healer.',
    personalityTraits: 'Courageous, brave, and honorable. You possess exceptional valor in crisis, deep intuitive perception, and high spiritual potential.',
    strengths: ['Exceptional Valor & Bravery', 'Deep Intuitive Insight', 'Honorable & Wealthy Potential', 'Resilience in Crisis'],
    challenges: ['Inner conflict or indecision', 'Susceptibility to mental stress', 'Intense emotional waves'],
    spiritualGuidance: 'Channel your intense energy into Shiva/Kali worship and meditation. Guard your mental peace above all else.',
    recommendedRituals: 'Worship Lord Shiva with Mahamrityunjaya Mantra on Shivaratri / Chaturdashi days.',
    dagdhaRashis: 'Gemini, Virgo, Sagittarius & Pisces (All 4 Dual Signs!)',
    dagdhaLords: 'Mercury (Budha) & Jupiter (Guru)',
    dagdhaImpact: 'Creates an intense struggle with mental and spiritual focus across all four dual signs.',
    nullificationRule: 'Fully nullified if Mercury or Jupiter sit in Dusthana houses or have malefic conjunctions.',
    westernLunationPhase: 'Gibbous Phase (135° to 180°)',
    westernPhaseDescription: 'Deep psychological self-evaluation preparing for full illumination.',
    epigeneticDiet: 'Light, non-stimulating foods; avoid heavy night meals to maintain mental tranquility.',
    dayColorRemedy: 'Wear Grey/White on Fridays (Venus) & Black/Blue on Saturdays.'
  },
  15: {
    tithiNumber: 15,
    name: 'Purnima (15th Full Moon)',
    groupType: 'Pūrṇā',
    groupMeaning: 'Complete, Air Element (Vayu) • Jupiter Elemental Lord',
    rulingDeity: 'Naga / Vishvadevas & Moon',
    shuklaDeity: 'Naga Devatas & Vishvadevas',
    krishnaDeity: 'Naga Devatas & Chandra',
    rulingPlanet: 'Saturn (Shani)',
    element: 'Water / Air',
    elementMeaning: 'Represents maximum solar-lunar illumination, complete fulfillment, and emotional expansion.',
    soulPurposeTitle: 'The Luminous Soul & Master of Joy',
    soulPurposeSummary: 'Born on the Full Moon, your soul mission is to radiate warmth, joy, artistic brilliance, and emotional nourishment to all around you.',
    personalityTraits: 'Emotional, intelligent, joyful, and radiant. You are blessed with artistic sensitivity, love for comfort, and a magnetic, generous spirit.',
    strengths: ['Magnetic Charm & Radiance', 'Emotional Depth & Empathy', 'Artistic & Intellectual Genius', 'Abundance & Prosperity'],
    challenges: ['Heightened emotional sensitivity', 'Vulnerability to mood fluctuations', 'Seeking validation from others'],
    spiritualGuidance: 'Keep your mind focused on divine love. Perform Satyanarayan Vrat to channel your full moon radiance into lasting peace.',
    recommendedRituals: 'Perform Satyanarayan Vrat Katha and offer milk/kheer to the Full Moon.',
    dagdhaRashis: 'None (No Zodiac Signs Burnt!)',
    dagdhaLords: 'None',
    dagdhaImpact: 'Maximum solar-lunar light is maintained; no astrological signs are shadowed.',
    nullificationRule: 'Exempt from Tithi Shoonya Dosha; all signs receive full lunar radiance.',
    westernLunationPhase: 'Full Moon Phase (180° to 135° Waning)',
    westernPhaseDescription: 'Full objectivity, realization, fulfillment, and translating mental vision into physical form.',
    epigeneticDiet: 'Kheer (rice pudding cooked in milk), coconut water, and pure dairy nourish Full Moon soma.',
    dayColorRemedy: 'Wear White/Silver on Mondays & Black/Blue on Saturdays.'
  },
  30: {
    tithiNumber: 30,
    name: 'Amavasya (30th New Moon)',
    groupType: 'Pūrṇā',
    groupMeaning: 'Complete, Air Element (Vayu) • Jupiter Elemental Lord',
    rulingDeity: 'Pitrus (Ancestors) & Goddess Kali / Rahu',
    shuklaDeity: 'Pitrus (Ancestral Lineage)',
    krishnaDeity: 'Pitrus (Ancestral Lineage)',
    rulingPlanet: 'Rahu & Moon',
    element: 'Water / Ether',
    elementMeaning: 'Represents internal introspection, secret knowledge, ancestral protection, and silent meditation.',
    soulPurposeTitle: 'The Introspective Mystic & Keeper of Secret Knowledge',
    soulPurposeSummary: 'Born on the New Moon, your soul purpose is to master deep inner meditation, honor ancestral lineages, and unlock profound esoteric wisdom.',
    personalityTraits: 'Reserved, introspective, and highly intuitive. You possess immense willpower, secret insight into human nature, and deep spiritual potential.',
    strengths: ['Unshakable Willpower', 'Profound Intuition & Esoteric Insight', 'Ancestral Blessing & Protection', 'Inner Resilience'],
    challenges: ['Tendency toward secrecy or isolation', 'Complex internal moods', 'Occasional skepticism'],
    spiritualGuidance: 'Honor your ancestors regularly. Use your deep inner light to transform shadows into spiritual enlightenment.',
    recommendedRituals: 'Perform Tarpanam for Ancestors (Pitrus) and chant Kali / Shiva Mantras on Amavasya days.',
    dagdhaRashis: 'None (No Zodiac Signs Burnt!)',
    dagdhaLords: 'None',
    dagdhaImpact: 'Focus is fully internal and ancestral; no zodiac signs are shadowed.',
    nullificationRule: 'Exempt from Tithi Shoonya Dosha; energy is channeled inward toward ancestral Pitru Karma.',
    westernLunationPhase: 'Balsamic / New Moon Phase (45° to 0° Waning)',
    westernPhaseDescription: 'Quiet reflection, releasing past karmas, spiritual transition, and inner renewal.',
    epigeneticDiet: 'Warm soups, honey offered on earth on Fridays, and temple incense clear ancestral debts (Pitru Karma).',
    dayColorRemedy: 'Wear Dark Blue/Black on Saturdays & Red on Tuesdays.'
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
      groupMeaning: lang === 'hi' ? 'शुभ आनंद, समृद्धि एवं पंचमहाभूत ऊर्जा' : 'Shubh Anand, Samriddhi & Panchamahabhuta Energy',
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
      groupMeaning: 'શુભ આનંદ, સમૃદ્ધિ અને પંચમહાભૂત શક્તિ',
      soulPurposeTitle: `આત્મિક હેતુ: ${base.soulPurposeTitle}`,
      soulPurposeSummary: `તમારી જન્મ તિથિ (${base.name}) દર્શાવે છે કે તમારો આત્મિક હેતુ જીવનમાં ધર્મ, સત્ય, સાહસ અને જ્ઞાનનો પ્રકાશ ફેલાવવાનો છે.`
    };
  }

  if (lang === 'ru') {
    return {
      ...base,
      groupMeaning: 'Священный радостный день, процветание и духовная сила',
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
