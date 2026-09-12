import { LanguageCode } from '../types/language';
import { getLocalizedNatureBadge } from './vedicTerms';

export interface GroupMetaLocalized {
  groupName: string;
  hindiGroup: string;
  meaning: string;
  tithis: string;
  ruler: string;
  nature: string;
  color: string;
  bgColor: string;
  recommended: string;
}

export interface TithiGuidanceLocalized {
  title: string;
  type: 'FRUITFUL' | 'CHALLENGING';
  detail: string;
}

export interface TithiModalUiLabels {
  activeTimingWindow: string;
  startTime: string;
  endTime: string;
  siddhaYogaTitle: string;
  siddhaYogaText: string;
  dagddhaTitle: string;
  dagddhaText: string;
  tithiWisdomHeader: string;
  panchaVargasHeader: string;
  ruledBy: string;
  essence: string;
  bestFor: string;
  fruitful: string;
  sensitive: string;
  pakshaLabel: string;
  tithisLabel: string;
}

// 1. UI Labels across 14 Languages
export const TITHI_MODAL_UI_LABELS: Record<LanguageCode, TithiModalUiLabels> = {
  hinglish: {
    activeTimingWindow: '⏱️ Active Timing Window',
    startTime: 'Start Time',
    endTime: 'End Time',
    siddhaYogaTitle: '⚡ Siddha Yoga Exception!',
    siddhaYogaText: 'Yeh Rikta Tithi shubh vaar ke saath milkar sacred Siddha Yoga banati hai! Is din competitive & technical karya me safalta milti hai.',
    dagddhaTitle: '⚠️ Dagddha (Burnt) Tithi Combination!',
    dagddhaText: 'Yeh Tithi aaj ke vaar ke saath milkar Dagddha Tithi banati hai. Naye shubh manglik karya aavoid karein.',
    tithiWisdomHeader: '📜 Tithi Wisdom & Guidance',
    panchaVargasHeader: '🏛️ The Five Functional Groups (Pancha Vargas)',
    ruledBy: 'Ruled by',
    essence: 'Essence',
    bestFor: 'Best For',
    fruitful: 'Fruitful',
    sensitive: 'Sensitive',
    pakshaLabel: 'Paksha',
    tithisLabel: 'Tithis'
  },
  hi: {
    activeTimingWindow: '⏱️ सक्रिय समयावधि (समय सीमा)',
    startTime: 'प्रारंभ समय',
    endTime: 'समाप्ति समय',
    siddhaYogaTitle: '⚡ सिद्ध योग विशेष फल!',
    siddhaYogaText: 'यह रिक्ता तिथि अनुकूल वार के साथ मिलकर सिद्ध योग बनाती है! इससे नकारात्मकता दूर होती है तथा प्रतिस्पर्धा एवं तकनीकी कार्यों में सफलता मिलती है।',
    dagddhaTitle: '⚠️ दग्ध (दग्ध तिथि) संयोग!',
    dagddhaText: 'यह तिथि आज के वार के साथ मिलकर दग्ध तिथि बनाती है। दीर्घकालिक नए मांगलिक व शुभ कार्यों से बचें।',
    tithiWisdomHeader: '📜 तिथि ज्ञान एवं मार्गदर्शन',
    panchaVargasHeader: '🏛️ पंच वर्ग विभाजन (पंच वर्गाः)',
    ruledBy: 'स्वामी ग्रह',
    essence: 'मूल तत्व',
    bestFor: 'श्रेष्ठ कार्य',
    fruitful: 'शुभ फलदायी',
    sensitive: 'संवेदनशील / सावधान',
    pakshaLabel: 'पक्ष',
    tithisLabel: 'तिथियां'
  },
  gu: {
    activeTimingWindow: '⏱️ સક્રિય સમયગાળો',
    startTime: 'પ્રારંભ સમય',
    endTime: 'સમાપ્તિ સમય',
    siddhaYogaTitle: '⚡ સિદ્ધ યોગ વિશેષ યોગ!',
    siddhaYogaText: 'આ રિક્તા તિથિ અનુકૂળ વાર સાથે મળીને સિદ્ધ યોગ બનાવે છે! તકનીકી અને સ્પર્ધાત્મક કાર્યોમાં સફળતા આપે છે.',
    dagddhaTitle: '⚠️ દગ્ધ તિથિ સંયોગ!',
    dagddhaText: 'આ તિથિ આજના વાર સાથે મળીને દગ્ધ તિથિ બનાવે છે. નવા શુભ કે માંગલિક કાર્યો ટાળવા.',
    tithiWisdomHeader: '📜 તિથિ જ્ઞાન અને માર્ગદર્શન',
    panchaVargasHeader: '🏛️ પાંચ વર્ગ વિભાજન (પંચ વર્ગ)',
    ruledBy: 'સ્વામી ગ્રહ',
    essence: 'મૂળ તત્વ',
    bestFor: 'શ્રેષ્ઠ કાર્યો',
    fruitful: 'શુભ ફળદાયી',
    sensitive: 'સંવેદનશીલ',
    pakshaLabel: 'પક્ષ',
    tithisLabel: 'તિથિઓ'
  },
  en: {
    activeTimingWindow: '⏱️ Active Timing Window',
    startTime: 'Start Time',
    endTime: 'End Time',
    siddhaYogaTitle: '⚡ Siddha Yoga Exception!',
    siddhaYogaText: 'This Rikta Tithi combines with a compatible weekday forming sacred Siddha Yoga! Converts negativity into success for competitive and technical tasks.',
    dagddhaTitle: '⚠️ Dagddha (Burnt) Tithi Combination!',
    dagddhaText: 'This Tithi combined with today’s weekday forms Dagddha Tithi, neutralizing positive energy for long-term milestones.',
    tithiWisdomHeader: '📜 Tithi Wisdom & Guidance',
    panchaVargasHeader: '🏛️ The Five Functional Groups (Pancha Vargas)',
    ruledBy: 'Ruled by',
    essence: 'Essence',
    bestFor: 'Best For',
    fruitful: 'Fruitful',
    sensitive: 'Sensitive',
    pakshaLabel: 'Paksha',
    tithisLabel: 'Tithis'
  },
  mr: {
    activeTimingWindow: '⏱️ सक्रिय वेळ मर्यादा',
    startTime: 'प्रारंभ वेळ',
    endTime: 'समाप्ती वेळ',
    siddhaYogaTitle: '⚡ सिद्ध योग विशेष शुभ योग!',
    siddhaYogaText: 'ही रिक्ता तिथी आजच्या वारासोबत सिद्ध योग बनवते! स्पर्धात्मक व तांत्रिक कामात यश मिळते.',
    dagddhaTitle: '⚠️ दग्ध तिथी योग!',
    dagddhaText: 'ही तिथी आजच्या वारासोबत दग्ध तिथी बनवते. नवीन शुभ कार्ये करणे टाळावे.',
    tithiWisdomHeader: '📜 तिथी मार्गदर्शन व ज्ञान',
    panchaVargasHeader: '🏛️ पंच वर्ग विभाग (पंच वर्ग)',
    ruledBy: 'स्वामी ग्रह',
    essence: 'मूळ तत्व',
    bestFor: 'उत्तम कार्ये',
    fruitful: 'शुभ फलदायी',
    sensitive: 'संवेदनशील',
    pakshaLabel: 'पक्ष',
    tithisLabel: 'तिथी'
  },
  bn: {
    activeTimingWindow: '⏱️ সক্রিয় সময়সীমা',
    startTime: 'শুরুর সময়',
    endTime: 'শেষের সময়',
    siddhaYogaTitle: '⚡ সিদ্ধ যোগ বিশেষ শুভ!',
    siddhaYogaText: 'এই রিক্তা তিথি বারের সাথে সিদ্ধ যোগ তৈরি করে, যা প্রতিযোগিতামূলক কাজে সাফল্য এনে দেয়।',
    dagddhaTitle: '⚠️ দগ্ধ তিথি সংযোগ!',
    dagddhaText: 'এই তিথি বারের সাথে মিলে দগ্ধ তিথি তৈরি করছে। নতুন শুভ কাজ এড়িয়ে চলুন।',
    tithiWisdomHeader: '📜 তিথি জ্ঞান ও নির্দেশনা',
    panchaVargasHeader: '🏛️ পঞ্চ বর্গ বিভাগ (পঞ্চ বর্গ)',
    ruledBy: 'অধিপতি গ্রহ',
    essence: 'মূল সারমর্ম',
    bestFor: 'উত্তম কাজ',
    fruitful: 'শুভ ফলদায়ক',
    sensitive: 'সংবেদনশীল',
    pakshaLabel: 'পক্ষ',
    tithisLabel: 'তিথি'
  },
  ta: {
    activeTimingWindow: '⏱️ செயல்படும் நேர அளவு',
    startTime: 'ஆரம்ப நேரம்',
    endTime: 'முடிவு நேரம்',
    siddhaYogaTitle: '⚡ சித்த யோக சிறப்பு சேர்க்கை!',
    siddhaYogaText: 'இந்த திதி சித்த யோகத்தை உருவாக்குகிறது! போட்டி மற்றும் தொழில்நுட்ப பணிகளுக்கு வெற்றி தரும்.',
    dagddhaTitle: '⚠️ தக்த்த திதி சேர்க்கை!',
    dagddhaText: 'இந்த திதி தக்த்த திதியை உருவாக்குகிறது. புதிய சுப காரியங்களை தவிர்க்கவும்.',
    tithiWisdomHeader: '📜 திதி ஞானம் & வழிகாட்டுதல்',
    panchaVargasHeader: '🏛️ பஞ்ச வர்க்க பிரிவுகள்',
    ruledBy: 'ஆளும் கிரஹம்',
    essence: 'தத்துவம்',
    bestFor: 'சிறந்த செயல்கள்',
    fruitful: 'சுப பலன்',
    sensitive: 'கவனம் தேவை',
    pakshaLabel: 'பட்சம்',
    tithisLabel: 'திதிகள்'
  },
  te: {
    activeTimingWindow: '⏱️ క్రియాశీల సమయం',
    startTime: 'ప్రారంభ సమయం',
    endTime: 'ముగింపు సమయం',
    siddhaYogaTitle: '⚡ సిద్ధ యోగం ప్రత్యేకత!',
    siddhaYogaText: 'ఈ తిథి సిద్ధ యోగాన్ని ఏర్పరుస్తుంది, సాంకేతిక మరియు పోటీ పనులలో విజయాన్ని ఇస్తుంది.',
    dagddhaTitle: '⚠️ దగ్ధ తిథి కలయిక!',
    dagddhaText: 'ఈ తిథి దగ్ధ తిథిగా మారుతుంది. కొత్త శుభ కార్యాలను వాయిదా వేయండి.',
    tithiWisdomHeader: '📜 తిథి జ్ఞానం & మార్గదర్శకత్వం',
    panchaVargasHeader: '🏛️ పంచ వర్గ విభాగం',
    ruledBy: 'అధిపతి గ్రహం',
    essence: 'ముఖ్య తత్త్వం',
    bestFor: 'మంచి పనులు',
    fruitful: 'శుభ ఫలితం',
    sensitive: 'జాగ్రత్త అవసరం',
    pakshaLabel: 'పక్షం',
    tithisLabel: 'తిథులు'
  },
  ru: {
    activeTimingWindow: '⏱️ Активное время Титхи',
    startTime: 'Время начала',
    endTime: 'Время окончания',
    siddhaYogaTitle: '⚡ Особенная Сиддха Йога!',
    siddhaYogaText: 'Эта Титхи образует Сиддха Йогу! Отлично подходит для преодоления препятствий и технических задач.',
    dagddhaTitle: '⚠️ Комбинация Дагдха (Сожженная) Титхи!',
    dagddhaText: 'Эта Титхи нейтрализует благоприятные энергии для долгосрочных проектов.',
    tithiWisdomHeader: '📜 Мудрость и наставления Титхи',
    panchaVargasHeader: '🏛️ Пять функциональных групп (Панча Варга)',
    ruledBy: 'Управитель',
    essence: 'Суть',
    bestFor: 'Благоприятно для',
    fruitful: 'Благоприятный',
    sensitive: 'Чувствительный',
    pakshaLabel: 'Пакша',
    tithisLabel: 'Титхи'
  },
  fr: {
    activeTimingWindow: '⏱️ Fenêtre temporelle active',
    startTime: 'Heure de début',
    endTime: 'Heure de fin',
    siddhaYogaTitle: '⚡ Exception Siddha Yoga!',
    siddhaYogaText: 'Cette Tithi forme un Siddha Yoga sacré! Favorable au succès dans les tâches compétitives.',
    dagddhaTitle: '⚠️ Combinaison Dagddha (Tithi Brûlée)!',
    dagddhaText: 'Cette Tithi forme une Tithi Dagddha. Évitez de commencer de grands projets favorables.',
    tithiWisdomHeader: '📜 Sagesse & Conseils Tithi',
    panchaVargasHeader: '🏛️ Les Cinq Groupes Fonctionnels (Pancha Vargas)',
    ruledBy: 'Gouverné par',
    essence: 'Essence',
    bestFor: 'Recommandé pour',
    fruitful: 'Fructueux',
    sensitive: 'Sensible',
    pakshaLabel: 'Paksha',
    tithisLabel: 'Tithis'
  },
  es: {
    activeTimingWindow: '⏱️ Ventana de tiempo activa',
    startTime: 'Hora de inicio',
    endTime: 'Hora de fin',
    siddhaYogaTitle: '⚡ ¡Excepción Siddha Yoga!',
    siddhaYogaText: '¡Esta Tithi forma un sagrado Siddha Yoga! Otorga éxito en tareas competitivas y técnicas.',
    dagddhaTitle: '⚠️ ¡Combinación Dagddha (Tithi Quemada)!',
    dagddhaText: 'Esta Tithi forma una Tithi Dagddha. Evite iniciar nuevos proyectos importantes.',
    tithiWisdomHeader: '📜 Sabiduría y guía de Tithi',
    panchaVargasHeader: '🏛️ Los Cinco Grupos Funcionales (Pancha Vargas)',
    ruledBy: 'Regido por',
    essence: 'Esencia',
    bestFor: 'Recomendado para',
    fruitful: 'Fructífero',
    sensitive: 'Sensible',
    pakshaLabel: 'Paksha',
    tithisLabel: 'Tithis'
  },
  he: {
    activeTimingWindow: '⏱️ חלון זמן פעיל',
    startTime: 'זמן התחלה',
    endTime: 'זמן סיום',
    siddhaYogaTitle: '⚡ סידהא יוגה מיוחדת!',
    siddhaYogaText: 'טיטהי זו יוצרת סידהא יוגה מבורכת המעניקה הצלחה במשימות תחרותיות וטכניות.',
    dagddhaTitle: '⚠️ שילוב דאגדאה (טיטהי שרופה)!',
    dagddhaText: 'שילוב זה מנטרל אנרגיות חיוביות. מומלץ להימנע מהתחלות חדשות חשובות.',
    tithiWisdomHeader: '📜 חוכמה והדרכת טיטהי',
    panchaVargasHeader: '🏛️ חמש הקבוצות התפקודיות (פנצ\'ה וארגאס)',
    ruledBy: 'נשלט על ידי',
    essence: 'מהות',
    bestFor: 'מומלץ עבור',
    fruitful: 'פורה / מבורך',
    sensitive: 'רגיש',
    pakshaLabel: 'פאקשה',
    tithisLabel: 'טיטהים'
  },
  id: {
    activeTimingWindow: '⏱️ Jendela Waktu Aktif',
    startTime: 'Waktu Mulai',
    endTime: 'Waktu Selesai',
    siddhaYogaTitle: '⚡ Pengecualian Siddha Yoga!',
    siddhaYogaText: 'Tithi ini membentuk Siddha Yoga suci yang membawa keberhasilan untuk tugas kompetitif & teknis.',
    dagddhaTitle: '⚠️ Kombinasi Dagddha (Tithi Hangus)!',
    dagddhaText: 'Tithi ini membentuk Dagddha Tithi. Hindari memulai proyek besar atau pernikahan.',
    tithiWisdomHeader: '📜 Kebijaksanaan & Panduan Tithi',
    panchaVargasHeader: '🏛️ Lima Kelompok Fungsional (Pancha Vargas)',
    ruledBy: 'Dikuasai oleh',
    essence: 'Esensi',
    bestFor: 'Terbaik Untuk',
    fruitful: 'Bermanfaat',
    sensitive: 'Sensitif',
    pakshaLabel: 'Paksha',
    tithisLabel: 'Tithi'
  },
  th: {
    activeTimingWindow: '⏱️ ช่วงเวลาที่มีผล',
    startTime: 'เวลาเริ่มต้น',
    endTime: 'เวลาสิ้นสุด',
    siddhaYogaTitle: '⚡ สิทธิโยคะพิเศษ!',
    siddhaYogaText: 'ดิถีนี้ก่อให้เกิดสิทธิโยคะ ให้ผลสำเร็จในการแข่งขันและการแก้ปัญหา.',
    dagddhaTitle: '⚠️ ดิถีทักธะ (ดิถีไหม้)!',
    dagddhaText: 'ดิถีนี้ก่อให้เกิดดิถีทักธะ ควรหลีกเลี่ยงการเริ่มมงคลสมรสหรือโครงการสำคัญ.',
    tithiWisdomHeader: '📜 ภูมิปัญญาและคำแนะนำของดิถี',
    panchaVargasHeader: '🏛️ กลุ่มฟังก์ชันทั้ง 5 (ปัญจวรรค)',
    ruledBy: 'ดาวผู้ครอง',
    essence: 'แก่นแท้',
    bestFor: 'เหมาะสำหรับ',
    fruitful: 'ให้ผลดี',
    sensitive: 'ควรระมัดระวัง',
    pakshaLabel: 'ปักษ์',
    tithisLabel: 'ดิถี'
  }
};

// 2. Pancha Varga Group Metadata across 14 Languages
export const GET_LOCALIZED_GROUPS_DATA = (lang: LanguageCode): Record<string, GroupMetaLocalized> => {
  const isHi = lang === 'hi';
  const isGu = lang === 'gu';
  const isHing = lang === 'hinglish';
  const isMr = lang === 'mr';
  const isBn = lang === 'bn';
  const isTa = lang === 'ta';
  const isTe = lang === 'te';

  return {
    NANDA: {
      groupName: isGu ? 'નંદા (Nanda)' : (isHi || isMr ? 'नंदा (Nanda)' : 'Nanda (नंदा)'),
      hindiGroup: 'नंदा वर्ग',
      meaning: isGu ? 'આનંદ, ઉલ્લાસ અને સમૃદ્ધિ' : (isHi ? 'आनंद, प्रसन्नता एवं समृद्धि' : (isHing ? 'Joy, Delight & Prosperity' : (isMr ? 'आनंद व समृद्धी' : (isBn ? 'আনন্দ ও সমৃদ্ধি' : (isTa ? 'மகிழ்ச்சி & வளம்' : (isTe ? 'సంతోషం & సమృద్ధి' : 'Joy, Delight & Prosperity')))))),
      tithis: isGu ? 'એકમ (૧લી), છઠ (૬ઠ્ઠી), અગિયારસ (૧૧મી)' : (isHi || isMr ? 'प्रतिपदा (1st), षष्ठी (6th), एकादशी (11th)' : 'Pratipada (1st), Shashthi (6th), Ekadashi (11th)'),
      ruler: isGu ? 'શુક્ર (Venus)' : (isHi || isMr ? 'शुक्र (Venus)' : 'Venus (Shukra)'),
      nature: getLocalizedNatureBadge('FRUITFUL', lang),
      color: '#2E7D32',
      bgColor: '#E8F5E9',
      recommended: isGu
        ? 'ઉત્સવ, કળા, ઉત્સવો, નવા સાહસો, ખરીદી અને યાત્રા.'
        : (isHi
          ? 'उत्सव, कला, नए व्यवसाय प्रारंभ, वस्त्र-आभूषण क्रय एवं यात्रा।'
          : (isHing
            ? 'Celebrations, arts, festivals, starting new ventures, luxury purchases & travel.'
            : (isMr
              ? 'उत्सव, कला, नवीन व्यवसाय प्रारंभ, खरेदी व प्रवास.'
              : 'Celebrations, arts, festivals, starting new ventures, luxury purchases, travel.')))
    },
    BHADRA: {
      groupName: isGu ? 'ભદ્રા (Bhadra)' : (isHi || isMr ? 'भद्रा (Bhadra)' : 'Bhadra (भद्रा)'),
      hindiGroup: 'भद्रा वर्ग',
      meaning: isGu ? 'કલ્યાણ, રક્ષણ અને મંગળકારી' : (isHi ? 'कल्याण, संरक्षण एवं शुभता' : (isHing ? 'Welfare, Protection & Auspiciousness' : 'Welfare, Protection & Auspiciousness')),
      tithis: isGu ? 'બીજ (૨જી), સાતમ (૭મી), બારસ (૧૨મી)' : (isHi || isMr ? 'द्वितीया (2nd), सप्तमी (7th), द्वादशी (12th)' : 'Dwitiya (2nd), Saptami (7th), Dwadashi (12th)'),
      ruler: isGu ? 'બુધ (Mercury)' : (isHi || isMr ? 'बुध (Mercury)' : 'Mercury (Budh)'),
      nature: getLocalizedNatureBadge('AUSPICIOUS', lang),
      color: '#2E7D32',
      bgColor: '#E8F5E9',
      recommended: isGu
        ? 'નાણાકીય રોકાણ, કરાર કરવા, શિક્ષણ, ગૃહપ્રવેશ અને લગ્ન.'
        : (isHi
          ? 'वित्तीय निवेश, अनुबंध हस्ताक्षर, शिक्षा, गृह प्रवेश एवं विवाह।'
          : (isHing
            ? 'Financial investments, signing contracts, education, marriage, shifting residence.'
            : (isMr
              ? 'आर्थिक गुंतवणूक, करार, शिक्षण, गृहप्रवेश व विवाह.'
              : 'Financial investments, signing contracts, education, marriage, shifting residence.')))
    },
    JAYA: {
      groupName: isGu ? 'જયા (Jaya)' : (isHi || isMr ? 'जया (Jaya)' : 'Jaya (जया)'),
      hindiGroup: 'जया वर्ग',
      meaning: isGu ? 'વિજય, પરાક્રમ અને ઊર્જા' : (isHi ? 'विजय, पराक्रम एवं ऊर्जा' : (isHing ? 'Victory, Conquest & Energy' : 'Victory, Conquest & Energy')),
      tithis: isGu ? 'ત્રીજ (૩જી), આઠમ (૮મી), તેરસ (૧૩મી)' : (isHi || isMr ? 'तृतीया (3rd), अष्टमी (8th), त्रयोदशी (13th)' : 'Tritiya (3rd), Ashtami (8th), Trayodashi (13th)'),
      ruler: isGu ? 'મંગળ (Mars)' : (isHi || isMr ? 'मंगल (Mars)' : 'Mars (Mangal)'),
      nature: getLocalizedNatureBadge('MIXED', lang),
      color: '#E65100',
      bgColor: '#FFF3E0',
      recommended: isGu
        ? 'કાયદાકીય કાર્યો, સ્પર્ધાત્મક પરીક્ષાઓ, મશીનરી ખરીદી, સર્જરી.'
        : (isHi
          ? 'न्यायालयीन कार्य, प्रतियोगी परीक्षा, यंत्र-शस्त्र क्रय, शल्य चिकित्सा।'
          : (isHing
            ? 'Lawsuits, competitive exams, acquiring tools/machinery, strategic disputes, surgical procedures.'
            : 'Lawsuits, competitive exams, acquiring tools/machinery, strategic disputes, surgical procedures.'))
    },
    RIKTA: {
      groupName: isGu ? 'રિક્તા (Rikta)' : (isHi || isMr ? 'रिक्ता (Rikta)' : 'Rikta (रिक्ता)'),
      hindiGroup: 'रिक्ता वर्ग',
      meaning: isGu ? 'ખાલી, રિક્ત અને સફાઈ' : (isHi ? 'रिक्त, शून्य एवं निष्कासन' : (isHing ? 'Empty, Hollow & Elimination' : 'Empty, Hollow & Elimination')),
      tithis: isGu ? 'ચોથ (૪થી), નોમ (૯મી), ચૌદસ (૧૪મી)' : (isHi || isMr ? 'चतुर्थी (4th), नवमी (9th), चतुर्दशी (14th)' : 'Chaturthi (4th), Navami (9th), Chaturdashi (14th)'),
      ruler: isGu ? 'શનિ (Saturn)' : (isHi || isMr ? 'शनi (Saturn)' : 'Saturn (Shani)'),
      nature: getLocalizedNatureBadge('INAUSPICIOUS', lang),
      color: '#C62828',
      bgColor: '#FFEBEE',
      recommended: isGu
        ? 'જૂના બાંધકામ હટાવવા, દેવું ચૂકવવું, સર્જરી, તંત્ર પૂજા. નવા કાર્યો ટાળવા.'
        : (isHi
          ? 'पुराने ढांचों का निस्तारण, ऋण चुकाना, शल्य क्रिया, तंत्र साधना। नए कार्य न करें।'
          : (isHing
            ? 'Demolishing structures, debt clearing, surgery, tantric rituals, weapon testing. Avoid new material starts.'
            : 'Demolishing structures, debt clearing, surgery, tantric rituals, weapon testing. Avoid new material starts.'))
    },
    POORNA: {
      groupName: isGu ? 'પૂર્ણા (Poorna)' : (isHi || isMr ? 'पूर्णा (Poorna)' : 'Poorna (पूर्णा)'),
      hindiGroup: 'पूर्णा वर्ग',
      meaning: isGu ? 'પૂર્ણતા, સમૃદ્ધિ અને પ્રચુરતા' : (isHi ? 'पूर्णता, परिपूर्णता एवं प्रचुरता' : (isHing ? 'Fullness, Completeness & Abundance' : 'Fullness, Completeness & Abundance')),
      tithis: isGu ? 'પાંચમ (૫મી), દસમ (૧૦મી), પૂનમ/અમાસ (૧૫મી/૩૦મી)' : (isHi || isMr ? 'पंचमी (5th), दशमी (10th), पूर्णिमा / अमावस्या (15th/30th)' : 'Panchami (5th), Dashami (10th), Purnima / Amavasya (15th/30th)'),
      ruler: isGu ? 'ગુરુ (Jupiter)' : (isHi || isMr ? 'गुरु (Jupiter)' : 'Jupiter (Guru)'),
      nature: getLocalizedNatureBadge('AUSPICIOUS', lang),
      color: '#2E7D32',
      bgColor: '#E8F5E9',
      recommended: isGu
        ? 'શુભ પ્રસંગો, પાયો નાખવો, લગ્ન, પ્રમોશન, ધાર્મિક અનુષ્ઠાન.'
        : (isHi
          ? 'महत्वपूर्ण मील का पत्थर, शिलान्यास, विवाह, पदोन्नति एवं धार्मिक समारोह।'
          : (isHing
            ? 'Milestones, long-term foundation stones, marriages, promotions, ceremonies.'
            : 'Milestones, long-term foundation stones, marriages, promotions, ceremonies.'))
    }
  };
};

// 3. Tithi Wisdom Guidance Details localized for 14 Languages
export const GET_LOCALIZED_TITHI_GUIDANCE = (tithiNum: number, lang: LanguageCode): TithiGuidanceLocalized => {
  const isHi = lang === 'hi';
  const isGu = lang === 'gu';
  const isHing = lang === 'hinglish';
  const isMr = lang === 'mr';
  const isBn = lang === 'bn';
  const isTa = lang === 'ta';
  const isTe = lang === 'te';

  switch (tithiNum) {
    case 1:
      return {
        title: isGu ? 'એકમ / પડવો (Pratipada 1st)' : (isHi ? 'प्रतिपदा (प्रथम तिथि)' : 'Pratipada (1st)'),
        type: 'CHALLENGING',
        detail: isGu
          ? 'શુક્લ પક્ષની એકમ ભૌતિક કાર્યો માટે નબળી ગણાય છે, પરંતુ ધાર્મિક વિધિઓ અને મંત્ર સાધના માટે ઉત્તમ છે.'
          : (isHi
            ? 'शुक्ल पक्ष प्रतिपदा भौतिक कार्यों हेतु मध्यम मानी जाती है, परंतु धार्मिक अनुष्ठान एवं मंत्र साधना के लिए उत्तम है।'
            : (isHing
              ? 'Considered weak for constructive material work in Shukla Paksha, though favorable for starting sacred rites. Krishna Pratipada is moderately auspicious.'
              : (isMr
                ? 'शुक्ल पक्ष प्रतिपदा भौतिक कामांसाठी मध्यम, परंतु धार्मिक विधी व साधना करण्यासाठी अत्यंत शुभ मानली जाते.'
                : 'Considered weak for constructive material work in Shukla Paksha, though favorable for starting sacred rites.')))
      };
    case 2:
      return {
        title: isGu ? 'બીજ (Dwitiya 2nd)' : (isHi ? 'द्वितीया (द्वितीय तिथि)' : 'Dwitiya (2nd)'),
        type: 'FRUITFUL',
        detail: isGu
          ? 'ગૃહપ્રવેશ, નવું મકાન બાંધવું, નાણાકીય વ્યવહારો અને ભાગીદારી શરૂ કરવા માટે અત્યંત શુભ તિથિ.'
          : (isHi
            ? 'गृह प्रवेश, भवन निर्माण प्रारंभ, वित्तीय लेनदेन एवं व्यावसायिक साझेदारी हेतु अत्यंत शुभ तिथि।'
            : (isHing
              ? 'Highly favorable for commencing construction, entering a new home (Griha Pravesh), financial dealings, and entering partnerships.'
              : (isMr
                ? 'गृहप्रवेश, नवीन वास्तू निर्माण, आर्थिक व्यवहार आणि भागीदारी सुरू करण्यासाठी अत्यंत शुभ तिथी.'
                : 'Highly favorable for commencing construction, entering a new home (Griha Pravesh), financial dealings, and entering partnerships.')))
      };
    case 3:
      return {
        title: isGu ? 'ત્રીજ (Tritiya 3rd)' : (isHi ? 'तृतीया (तृतीय तिथि)' : 'Tritiya (3rd)'),
        type: 'FRUITFUL',
        detail: isGu
          ? 'રચનાત્મક કાર્યો, કળા, સંગીત, લગ્ન અને નવી સ્પર્ધાત્મક પહેલ માટે ઉત્તમ તિથિ.'
          : (isHi
            ? 'रचनात्मक कार्य, कला, संगीत, विवाह एवं नए रणनीतिक प्रयासों के लिए अति उत्तम।'
            : (isHing
              ? 'Excellent for creative ventures, arts, weddings, and taking competitive initiatives.'
              : (isMr
                ? 'कलात्मक कामे, संगीत, विवाह आणि नवीन धोरणात्मक उपक्रम सुरू करण्यासाठी उत्तम.'
                : 'Excellent for creative ventures, arts, weddings, and taking competitive initiatives.')))
      };
    case 4:
      return {
        title: isGu ? 'ચોથ (Chaturthi 4th - Rikta)' : (isHi ? 'चतुर्थी (रिक्ता तिथि)' : 'Chaturthi (4th - Rikta)'),
        type: 'CHALLENGING',
        detail: isGu
          ? 'રોકાણ, યાત્રા કે નવા કરિયર માટે અશુભ; ગણેશ પૂજન અને વિઘ્નનિવારણ માટે શ્રેષ્ઠ.'
          : (isHi
            ? 'निवेश, यात्रा या नए करियर प्रारंभ हेतु अशुभ; गणेश पूजन एवं बाधा निवारण के लिए श्रेष्ठ।'
            : (isHing
              ? 'Unfavorable for investments, travel, or starting a new career; suitable for overcoming obstacles (worship of Ganesha) or counter-adversary actions.'
              : (isMr
                ? 'गुंतवणूक, प्रवास किंवा नवीन करिअरसाठी वर्ज्य; गणेश पूजन व संकट निवारणासाठी उत्तम.'
                : 'Unfavorable for investments, travel, or starting a new career; suitable for overcoming obstacles.')))
      };
    case 5:
      return {
        title: isGu ? 'પાંચમ (Panchami 5th)' : (isHi ? 'पंचमी (पंचम तिथि)' : 'Panchami (5th)'),
        type: 'FRUITFUL',
        detail: isGu
          ? 'શિક્ષણ, વિદ્યાભ્યાસ, તબીબી સારવાર અને નવું જ્ઞાન મેળવવા માટે અત્યંત શુભ.'
          : (isHi
            ? 'शिक्षा, पठन-पाठन, चिकित्सा प्रारंभ एवं बौद्धिक कार्यों के लिए अत्यंत शुभ।'
            : (isHing
              ? 'Auspicious for education, medical treatments, learning new subjects, and intellectual pursuits.'
              : (isMr
                ? 'शिक्षण, नवीन विद्या ग्रहण, वैद्यकीय उपचार आणि बौद्धिक कामांसाठी अत्यंत शुभ.'
                : 'Auspicious for education, medical treatments, learning new subjects, and intellectual pursuits.')))
      };
    case 6:
      return {
        title: isGu ? 'છઠ (Shashthi 6th)' : (isHi ? 'षष्ठी (छठी तिथि)' : 'Shashthi (6th)'),
        type: 'CHALLENGING',
        detail: isGu
          ? 'ઘરેલુ નવા કાર્યો માટે ચંચળ; સ્પર્ધાત્મક કાર્યો, આરોગ્ય સુધાર અને રક્ષણાત્મક કાર્ય માટે ઉત્તમ.'
          : (isHi
            ? 'पारिवारिक कार्यों हेतु चंचल; प्रतिस्पर्धा, स्वास्थ्य संवर्धन एवं सुरक्षात्मक कार्यों के लिए उपयुक्त।'
            : (isHing
              ? 'Often volatile for domestic beginnings; better suited for competitive tasks, defense, or health building.'
              : (isMr
                ? 'घरगुती कामांसाठी चंचल; स्पर्धा, आरोग्य सुधारणा आणि संरक्षणात्मक कामांसाठी उत्तम.'
                : 'Often volatile for domestic beginnings; better suited for competitive tasks, defense, or health building.')))
      };
    case 7:
      return {
        title: isGu ? 'સાતમ (Saptami 7th)' : (isHi ? 'सप्तमी (सप्तम तिथि)' : 'Saptami (7th)'),
        type: 'FRUITFUL',
        detail: isGu
          ? 'લાંબી યાત્રા શરૂ કરવા, વાહન ખરીદવા, કરાર કરવા અને જાહેર જવાબદારીઓ સ્વીકારવા માટે ઉત્તમ.'
          : (isHi
            ? 'दीर्घ यात्रा प्रारंभ, वाहन क्रय, अनुबंध करने एवं नए सार्वजनिक उत्तरदायित्व हेतु उत्तम।'
            : (isHing
              ? 'Ideal for beginning long-distance journeys, buying vehicles, entering contracts, and taking up public responsibilities.'
              : (isMr
                ? 'दीर्घ प्रवास, वाहन खरेदी, करार करणे व सार्वजनिक जबाबदाऱ्या स्वीकारण्यासाठी उत्तम.'
                : 'Ideal for beginning long-distance journeys, buying vehicles, entering contracts, and taking up public responsibilities.')))
      };
    case 8:
      return {
        title: isGu ? 'આઠમ (Ashtami 8th)' : (isHi ? 'अष्टमी (अष्टम तिथि)' : 'Ashtami (8th)'),
        type: 'CHALLENGING',
        detail: isGu
          ? 'લગ્ન કે યાત્રા માટે ટાળવી; દુર્ગા પૂજન, શક્તિ સાધના અને કઠિન કાર્યો માટે શ્રેષ્ઠ.'
          : (isHi
            ? 'विवाह एवं यात्रा हेतु वर्जित; दुर्गा पूजन, शक्ति साधना एवं कठोर कार्यों के लिए उत्तम।'
            : (isHing
              ? 'Known for volatility and dual nature. Generally avoided for weddings and travel; favorable for protective, rigorous, or competitive tasks.'
              : (isMr
                ? 'विवाह व प्रवासासाठी वर्ज्य; दुर्गा पूजन, शक्ती साधना व कठीण कामांसाठी शुभ.'
                : 'Generally avoided for weddings and travel; favorable for protective, rigorous, or competitive tasks.')))
      };
    case 9:
      return {
        title: isGu ? 'નોમ (Navami 9th - Rikta)' : (isHi ? 'नवमी (रिक्ता तिथि)' : 'Navami (9th - Rikta)'),
        type: 'CHALLENGING',
        detail: isGu
          ? 'મકાન ખરીદી, લગ્ન કે નવો વેપાર માટે અશુભ; કાયદાકીય વિવાદો અને શત્રુ વિજય માટે અનુકૂળ.'
          : (isHi
            ? 'संपत्ति क्रय, विवाह या नया व्यापार हेतु अनुयुक्त; कानूनी विवाद एवं बाधा निवारण हेतु अनुकूल।'
            : (isHing
              ? 'Unsuitable for constructive beginnings (buying property, marriage, business). Favorable for combat, legal confrontation, and purging.'
              : (isMr
                ? 'वास्तू खरेदी, विवाह वा नवीन व्यापारासाठी अयोग्य; कायदेशीर विवाद व शत्रू विजयासाठी अनुकूल.'
                : 'Unsuitable for constructive beginnings. Favorable for combat, legal confrontation, and purging.')))
      };
    case 10:
      return {
        title: isGu ? 'દસમ (Dashami 10th)' : (isHi ? 'दशमी (दशम तिथि)' : 'Dashami (10th)'),
        type: 'FRUITFUL',
        detail: isGu
          ? 'સરકારી કાર્યો, નવો વેપાર શરૂ કરવા, વહીવટ અને સન્માન મેળવવા માટે સૌથી મજબૂત તિથિ.'
          : (isHi
            ? 'सरकारी कार्य, नया व्यापार प्रारंभ, प्रशासनिक कार्य एवं प्रतिष्ठा प्राप्ति हेतु अत्यंत बलवान तिथि।'
            : (isHing
              ? 'One of the strongest Tithis for government-related works, launching businesses, administration, and public recognition.'
              : (isMr
                ? 'शासकीय कामे, नवीन व्यवसाय प्रारंभ, प्रशासन व सन्मान मिळवण्यासाठी अत्यंत बलवान तिथी.'
                : 'One of the strongest Tithis for government-related works, launching businesses, administration, and public recognition.')))
      };
    case 11:
      return {
        title: isGu ? 'અગિયારસ (Ekadashi 11th)' : (isHi ? 'एकादशी (एकादश तिथि)' : 'Ekadashi (11th)'),
        type: 'FRUITFUL',
        detail: isGu
          ? 'ઉપવાસ, આધ્યાત્મિક પ્રગતિ, દાન અને ધ્યાન માટે શ્રેષ્ઠ. તમામ પવિત્ર કાર્યો માટે અત્યંત પૂજનીય.'
          : (isHi
            ? 'व्रत, आध्यात्मिक उन्नति, दान एवं ध्यान हेतु श्रेष्ठ। समस्त धार्मिक कार्यों के लिए परम पवित्र।'
            : (isHing
              ? 'Excellent for fasting, spiritual elevation, charity, and meditation. Generally considered sacred for all virtuous acts.'
              : (isMr
                ? 'उपवास, अध्यात्म, दान व ध्यानासाठी अत्यंत श्रेष्ठ व पवित्र तिथी.'
                : 'Excellent for fasting, spiritual elevation, charity, and meditation.')))
      };
    case 12:
      return {
        title: isGu ? 'બારસ (Dwadashi 12th)' : (isHi ? 'द्वादशी (द्वादश तिथि)' : 'Dwadashi (12th)'),
        type: 'FRUITFUL',
        detail: isGu
          ? 'વ્રતનું પારણું, મોટા કરારો, શિક્ષણ અને નાણાકીય પાયો નાખવા માટે અત્યંત શુભ.'
          : (isHi
            ? 'व्रत पारण, दीर्घकालिक अनुबंध, शिक्षा एवं वित्तीय नीव रखने हेतु अत्यंत शुभ।'
            : (isHing
              ? 'Auspicious for completing vows, major contracts, education, and long-term financial foundations.'
              : (isMr
                ? 'व्रत पारणे, मोठे करार, शिक्षण व आर्थिक पाया रचण्यासाठी अत्यंत शुभ.'
                : 'Auspicious for completing vows, major contracts, education, and long-term financial foundations.')))
      };
    case 13:
      return {
        title: isGu ? 'તેરસ (Trayodashi 13th)' : (isHi ? 'त्रयोदशी (त्रयोदश तिथि)' : 'Trayodashi (13th)'),
        type: 'FRUITFUL',
        detail: isGu
          ? 'શાંતિ સ્થાપવા, આભૂષણ ખરીદવા, મિત્રતા અને પ્રદોષ વ્રત પૂજા માટે અતિ ફળદાયી.'
          : (isHi
            ? 'सद्भाव स्थापना, वस्त्र-आभूषण क्रय, सामाजिक मेलजोल एवं प्रदोष व्रत पूजा हेतु अति फलदायी।'
            : (isHing
              ? 'Highly favorable for making peace, sensual arts, buying clothing/jewelry, socializing, and Pradosh Puja.'
              : (isMr
                ? 'शांतता प्रस्थापित करणे, दागिने खरेदी, सामाजिक संबंध व प्रदोष पूजेसाठी अति फलदायी.'
                : 'Highly favorable for making peace, buying clothing/jewelry, socializing, and Pradosh Puja.')))
      };
    case 14:
      return {
        title: isGu ? 'ચૌદસ (Chaturdashi 14th - Rikta)' : (isHi ? 'चतुर्दशी (रिक्ता तिथि)' : 'Chaturdashi (14th - Rikta)'),
        type: 'CHALLENGING',
        detail: isGu
          ? 'લગ્ન, યાત્રા કે મિલકત ખરીદી માટે અશુભ; શિવ સાધના, સર્જરી અને નકારાત્મકતા દૂર કરવા માટે ઉત્તમ.'
          : (isHi
            ? 'विवाह, यात्रा या संपत्ति क्रय हेतु वर्जित; शिव साधना, शल्य चिकित्सा एवं नकारात्मकता नाश हेतु उत्तम।'
            : (isHing
              ? 'Strictly avoided for standard auspicious events (weddings, journey, buying assets). Favorable for Shiva sadhana, medical surgeries, and eradicating negativity.'
              : (isMr
                ? 'विवाह, प्रवास वा नवीन खरेदीसाठी वर्ज्य; शिव साधना व शल्य क्रियेसाठी उत्तम.'
                : 'Strictly avoided for standard auspicious events. Favorable for Shiva sadhana and medical surgeries.')))
      };
    case 15:
      return {
        title: isGu ? 'પૂનમ / પૂર્ણિમા (Purnima 15th)' : (isHi ? 'पूर्णिमा (पूर्ण तिथि)' : 'Purnima (15th / Full Moon)'),
        type: 'FRUITFUL',
        detail: isGu
          ? 'પૂર્ણ ફળદાયી; સત્યનારાયણ કથા, મહાપૂજા, હવન અને ધાર્મિક ઉત્સવો માટે અતિ ઉત્તમ.'
          : (isHi
            ? 'पूर्ण फलदायी; सत्यनारायण कथा, महापूजा, हवन एवं मांगलिक आयोजनों के लिए सर्वोत्तम।'
            : (isHing
              ? 'Complete fruition; ideal for spiritual ceremonies, Satyanarayan puja, homams, and grand community events.'
              : (isMr
                ? 'पूर्ण फलदायी; सत्यनारायण पूजा, होम-हवन व भव्य धार्मिक कार्यक्रमांसाठी सर्वोत्तम.'
                : 'Complete fruition; ideal for spiritual ceremonies, Satyanarayan puja, homams, and grand community events.')))
      };
    case 30:
    default:
      return {
        title: isGu ? 'અમાસ / અમાવાસ્યા (Amavasya New Moon)' : (isHi ? 'अमावस्या (अमा तिथि)' : 'Amavasya (New Moon)'),
        type: 'CHALLENGING',
        detail: isGu
          ? 'વેપાર, લગ્ન, યાત્રા કે કરાર માટે અશુભ; પિતૃ તર્પણ, શ્રાધ અને આંતરિક સાધના માટે જ શ્રેષ્ઠ.'
          : (isHi
            ? 'व्यापार प्रारंभ, विवाह, यात्रा या वित्तीय अनुबंध हेतु अनुयुक्त; केवल पितृ तर्पण, श्राद्ध एवं आंतरिक साधना हेतु उपयुक्त।'
            : (isHing
              ? 'Heavy planetary quietude. Avoid starting commercial projects, travel, marriages, or financial contracts; exclusively suited for ancestral worship (Pitr Tarpan) and internal sadhana.'
              : (isMr
                ? 'व्यापार, विवाह, प्रवास वा करारांसाठी अयोग्य; केवळ पितृ तर्पण, श्राद्ध व आंतरिक साधनेसाठी योग्य.'
                : 'Exclusively suited for ancestral worship (Pitr Tarpan) and internal sadhana.')))
      };
  }
};
