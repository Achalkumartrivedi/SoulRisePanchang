import { LanguageCode } from '../types/language';

export interface BrahmaGuideContent {
  modalHeaderTitle: string;
  subtitle: string;
  whatIsTitle: string;
  whatIsText: string;
  meaningTitle: string;
  meaningPoints: string[];
  meaningSummary: string;
  timingTitle: string;
  timingPoints: string[];
  whySpecialTitle: string;
  whySpecialPoints: string[];
  bestActivitiesTitle: string;
  bestActivitiesItems: string[];
  quickFactTitle: string;
  quickFactText: string;
}

export const BRAHMA_GUIDE: Record<LanguageCode, BrahmaGuideContent> = {
  hinglish: {
    modalHeaderTitle: '🌅 Brahma Time (Brahma Muhurat)',
    subtitle: 'Suryoday se pehle ka pavitra samay, dhyan, yoga aur prarthna ke liye shreshth. Yeh suryoday se lagbhag 1 ghanta 36 minute pehle shuru hota hai.',
    whatIsTitle: 'What is Brahma Muhurat?',
    whatIsText: 'Brahma Muhurat suryoday se pehle ka pavitra samay hai, jo dhyan, yoga, prarthna aur aatm-chintan ke liye sabse uttam mana jata hai.',
    meaningTitle: 'Meaning',
    meaningPoints: [
      'Brahma = Srishti-karta ya Sarvoch Gyan',
      'Muhurat = 48 minute ka samay'
    ],
    meaningSummary: 'Ise "Creator\'s Time" kaha jata hai kyunki is shant samay mein mann ekaghr aur urjavan rehta hai.',
    timingTitle: 'Timing',
    timingPoints: [
      'Suryoday se 1 hr 36 mins pehle shuru hota hai',
      'Suryoday se 48 mins pehle samapt hota hai',
      'Har din local suryoday ke anusar badalta hai'
    ],
    whySpecialTitle: 'Why is it Special?',
    whySpecialPoints: [
      'Shant aur pavitra vatavaran',
      'Shuddh pratahkaal ki hawa',
      'Uchhatam ekagrata aur spashtta',
      'Yoga aur Ayurveda parampara mein atyantik shubh'
    ],
    bestActivitiesTitle: 'Best Activities',
    bestActivitiesItems: [
      'Dhyan (Meditation)',
      'Yoga aasan',
      'Pranayama',
      'Mantra Chanting',
      'Aadhyatmik granth padhna',
      'Gratitude Journaling'
    ],
    quickFactTitle: 'Quick Fact',
    quickFactText: 'Agar suryoday 6:00 AM par ho, toh Brahma Muhurat lagbhag 4:24 AM se 5:12 AM tak hoga.'
  },
  hi: {
    modalHeaderTitle: '🌅 ब्रह्म समय (ब्रह्म मुहूर्त)',
    subtitle: 'सूर्योदय से पहले का पवित्र समय, ध्यान और योग के लिए श्रेष्ठ। यह सूर्योदय से लगभग 1 घंटा 36 मिनट पहले शुरू होता है।',
    whatIsTitle: 'ब्रह्म मुहूर्त क्या है?',
    whatIsText: 'ब्रह्म मुहूर्त सूर्योदय से पहले का पवित्र समय है। इसे ध्यान, योग, प्रार्थना और आत्मचिंतन के लिए सबसे श्रेष्ठ माना जाता है।',
    meaningTitle: 'अर्थ',
    meaningPoints: [
      'ब्रह्म = सृष्टिकर्ता या सर्वोच्च ज्ञान',
      'मुहूर्त = 48 मिनट का समय'
    ],
    meaningSummary: 'इसे "सृष्टिकर्ता का समय" कहा जाता है क्योंकि इस समय मन शांत और एकाग्र माना जाता है।',
    timingTitle: 'समय',
    timingPoints: [
      'सूर्योदय से 1 घंटा 36 मिनट पहले शुरू',
      'सूर्योदय से 48 मिनट पहले समाप्त',
      'समय प्रतिदिन सूर्योदय के अनुसार बदलता है।'
    ],
    whySpecialTitle: 'क्यों विशेष है?',
    whySpecialPoints: [
      'शांत वातावरण',
      'शुद्ध सुबह की हवा',
      'बेहतर एकाग्रता',
      'ध्यान और साधना के लिए उत्तम',
      'योग और आयुर्वेद में अत्यंत शुभ माना गया है।'
    ],
    bestActivitiesTitle: 'इस समय क्या करें?',
    bestActivitiesItems: [
      'ध्यान',
      'योग',
      'प्राणायाम',
      'मंत्र जाप',
      'आध्यात्मिक ग्रंथ पढ़ना',
      'कृतज्ञता लेखन'
    ],
    quickFactTitle: 'रोचक तथ्य',
    quickFactText: 'यदि सूर्योदय 6:00 बजे हो, तो ब्रह्म मुहूर्त लगभग 4:24–5:12 बजे होगा।'
  },
  gu: {
    modalHeaderTitle: '🌅 બ્રહ્મ સમય (બ્રહ્મ મુહૂર્ત)',
    subtitle: 'સૂર્યોદય પહેલાનો પવિત્ર સમય, ધ્યાન અને યોગ માટે શ્રેષ્ઠ. આ સૂર્યોદયના આશરે ૧ કલાક ૩૬ મિનિટ પહેલા શરૂ થાય છે.',
    whatIsTitle: 'બ્રહ્મ મુહૂર્ત શું છે?',
    whatIsText: 'બ્રહ્મ મુહૂર્ત એ સૂર્યોદય પહેલાનો પવિત્ર સમય છે. ધ્યાન, યોગ, પ્રાર્થના અને આત્મચિંતન માટે આ શ્રેષ્ઠ માનવામાં આવે છે.',
    meaningTitle: 'અર્થ',
    meaningPoints: [
      'બ્રહ્મ = સૃષ્ટિકર્તા અથવા સર્વોચ્ચ જ્ઞાન',
      'મુહૂર્ત = ૪૮ મિનિટનો સમય'
    ],
    meaningSummary: 'આને "સૃષ્ટિકર્તાનો સમય" કહેવામાં આવે છે કારણ કે આ સમયે મન શાંત અને એકાગ્ર રહે છે.',
    timingTitle: 'સમય',
    timingPoints: [
      'સૂર્યોદયના ૧ કલાક ૩૬ મિનિટ પહેલા શરૂ થાય છે',
      'સૂર્યોદયના ૪૮ મિનિટ પહેલા પૂર્ણ થાય છે',
      'દરરોજ સ્થાનિક સૂર્યોદય મુજબ બદલાય છે.'
    ],
    whySpecialTitle: 'શા માટે વિશેષ છે?',
    whySpecialPoints: [
      'શાંત વાતાવરણ',
      'શુદ્ધ સવારની હવા',
      'ઉત્તમ એકાગ્રતા',
      'યોગ અને આયુર્વેદમાં અત્યંત શુભ માનવામાં આવે છે.'
    ],
    bestActivitiesTitle: 'આ સમયે શું કરવું?',
    bestActivitiesItems: [
      'ધ્યાન (Meditation)',
      'યોગ',
      'પ્રાણાયામ',
      'મંત્ર જાપ',
      'આધ્યાત્મિક ગ્રંથો વાંચવા',
      'કૃતજ્ઞતા નોંધવી'
    ],
    quickFactTitle: 'રસપ્રદ તથ્ય',
    quickFactText: 'જો સૂર્યોદય સવારે ૬:૦૦ વાગ્યે હોય, તો બ્રહ્મ મુહૂર્ત આશરે ૪:૨૪ થી ૫:૧૨ વાગ્યા સુધી રહેશે.'
  },
  en: {
    modalHeaderTitle: '🌅 Brahma Time (Brahma Muhurat)',
    subtitle: 'The sacred time before sunrise for meditation, yoga, and prayer. Begins about 1 hour 36 minutes before sunrise.',
    whatIsTitle: 'What is Brahma Muhurat?',
    whatIsText: 'Brahma Muhurat is the sacred period before sunrise, traditionally considered the most peaceful and spiritually uplifting time of the day. It is ideal for meditation, yoga, prayer, and self-reflection.',
    meaningTitle: 'Meaning',
    meaningPoints: [
      'Brahma = Creator or Supreme Knowledge',
      'Muhurat = A 48-minute time period'
    ],
    meaningSummary: 'It is called the "Creator\'s Time" because this quiet hour is believed to make the mind calm, clear, and receptive.',
    timingTitle: 'Timing',
    timingPoints: [
      'Starts 1 hour 36 minutes before sunrise',
      'Ends 48 minutes before sunrise',
      'Changes daily based on local sunrise.'
    ],
    whySpecialTitle: 'Why is it Special?',
    whySpecialPoints: [
      'Peaceful surroundings',
      'Fresh morning air',
      'Better focus',
      'Ideal for spiritual practices',
      'Highly valued in Yoga and Ayurveda traditions.'
    ],
    bestActivitiesTitle: 'Best Activities',
    bestActivitiesItems: [
      'Meditation',
      'Yoga',
      'Pranayama',
      'Mantra chanting',
      'Reading spiritual texts',
      'Gratitude journaling'
    ],
    quickFactTitle: 'Quick Fact',
    quickFactText: 'If sunrise is 6:00 AM, Brahma Muhurat is approximately 4:24 AM–5:12 AM.'
  },
  ta: {
    modalHeaderTitle: '🌅 பிரம்ம நேரம் (பிரம்ம முகூர்த்தம்)',
    subtitle: 'சூரிய உதயத்திற்கு முன் தியானம், யோகம், பிரார்த்தனைக்கு சிறந்த நேரம். இது சூரிய உதயத்திற்கு சுமார் 1 மணி 36 நிமிடங்கள் முன் தொடங்கும்.',
    whatIsTitle: 'பிரம்ம முகூர்த்தம் என்றால் என்ன?',
    whatIsText: 'பிரம்ம முகூர்த்தம் என்பது சூரிய உதயத்திற்கு முன் வரும் புனித நேரமாகும். தியானம், யோகம், பிரார்த்தனை மற்றும் உள்ளார்ந்த சிந்தனைக்கு இது மிகவும் சிறந்ததாக கருதப்படுகிறது.',
    meaningTitle: 'பொருள்',
    meaningPoints: [
      'பிரம்மம் = படைப்பாளர் அல்லது உயர்ந்த ஞானம்',
      'முகூர்த்தம் = 48 நிமிட நேரம்'
    ],
    meaningSummary: 'இந்த நேரத்தில் மனம் அமைதியாகவும் தெளிவாகவும் இருக்கும் என்று நம்பப்படுவதால் இதை "படைப்பாளரின் நேரம்" என்று அழைக்கப்படுகிறது.',
    timingTitle: 'நேரம்',
    timingPoints: [
      'சூரிய உதயத்திற்கு 1 மணி 36 நிமிடங்கள் முன் தொடங்கும்',
      'சூரிய உதயத்திற்கு 48 நிமிடங்கள் முன் முடியும்',
      'தினமும் சூரிய உதய நேரத்திற்கேற்ப மாறும்.'
    ],
    whySpecialTitle: 'ஏன் இது சிறப்பு?',
    whySpecialPoints: [
      'அமைதியான சூழல்',
      'தூய காலை காற்று',
      'சிறந்த கவனம்',
      'ஆன்மீக பயிற்சிகளுக்கு ஏற்ற நேரம்',
      'யோகம் மற்றும் ஆயுர்வேதத்தில் மிகவும் சுப நேரமாக கருதப்படுகிறது.'
    ],
    bestActivitiesTitle: 'செய்ய ஏற்றவை',
    bestActivitiesItems: [
      'தியானம்',
      'யோகம்',
      'பிராணாயாமம்',
      'மந்திர ஜபம்',
      'ஆன்மீக நூல்கள் வாசித்தல்',
      'நன்றியுணர்வு குறிப்பேடு எழுதுதல்'
    ],
    quickFactTitle: 'சுவாரஸ்ய தகவல்',
    quickFactText: 'சூரிய உதயம் 6:00 AM என்றால், பிரம்ம முகூர்த்தம் சுமார் 4:24–5:12 AM ஆகும்.'
  },
  te: {
    modalHeaderTitle: '🌅 బ్రహ్మ సమయం (బ్రహ్మ ముహుర్తం)',
    subtitle: 'సూర్యోదయానికి ముందు ధ్యానం, యోగా మరియు ప్రార్థనలకు పవిత్రమైన సమయం. ఇది సూర్యోదయానికి సుమారు 1 గంట 36 నిమిషాల ముందు ప్రారంభమవుతుంది.',
    whatIsTitle: 'బ్రహ్మ ముహుర్తం అంటే ఏమిటి?',
    whatIsText: 'బ్రహ్మ ముహుర్తం అనేది సూర్యోదయానికి ముందు వచ్చే అత్యంత పవిత్రమైన సమయం. ఇది ధ్యానం, యోగా మరియు ఆధ్యాత్మిక సాధనకు శ్రేష్ఠమైనది.',
    meaningTitle: 'అర్థం',
    meaningPoints: [
      'బ్రహ్మ = సృష్టికర్త లేదా అత్యున్నత జ్ఞానం',
      'ముహుర్తం = 48 నిమిషాల కాల వ్యవధి'
    ],
    meaningSummary: 'ఈ ప్రశాంత సమయంలో మనస్సు ఏకాగ్రంగా ఉంటుందని దీనిని "సృష్టికర్త సమయం" అంటారు.',
    timingTitle: 'సమయం',
    timingPoints: [
      'సూర్యోదయానికి 1 గంట 36 నిమిషాల ముందు ప్రారంభం',
      'సూర్యోదయానికి 48 నిమిషాల ముందు ముగుస్తుంది',
      'సూర్యోదయం ఆధారంగా ప్రతిరోజూ మారుతుంది.'
    ],
    whySpecialTitle: 'ఎందుకు ప్రత్యేకమైనది?',
    whySpecialPoints: [
      'ప్రశాంత వాతావరణం',
      'పరిశుద్ధమైన ఉదయపు గాలి',
      'మెరుగైన ఏకాగ్రత',
      'యోగ మరియు ఆయుర్వేదంలో అత్యంత పవిత్రమైనది'
    ],
    bestActivitiesTitle: 'చేయవలసిన పనులు',
    bestActivitiesItems: [
      'ధ్యానం',
      'యోగా',
      'ప్రాణాయామం',
      'మంత్ర జపం',
      'గ్రంథ పఠనం',
      'కృతజ్ఞతా లేఖనం'
    ],
    quickFactTitle: 'త్వరిత నిజం',
    quickFactText: 'సూర్యోదయం 6:00 AM అయితే, బ్రహ్మ ముహుర్తం 4:24 AM–5:12 AM వరకు ఉంటుంది.'
  },
  bn: {
    modalHeaderTitle: '🌅 ব্রহ্ম সময় (ব্রহ্ম মুহূর্ত)',
    subtitle: 'সূর্যোদয়ের আগের পবিত্র সময়, ধ্যান ও যোগের জন্য উপযুক্ত। এটি সূর্যোদয়ের প্রায় ১ ঘণ্টা ৩৬ মিনিট আগে শুরু হয়।',
    whatIsTitle: 'ব্রহ্ম মুহূর্ত কী?',
    whatIsText: 'ব্রহ্ম মুহূর্ত হলো সূর্যোদয়ের পূর্ববর্তী এক পরম পবিত্র সময়, যা ধ্যান, যোগ এবং প্রার্থনার জন্য সর্বাপেক্ষা উত্তম।',
    meaningTitle: 'অর্থ',
    meaningPoints: [
      'ব্রহ্ম = সৃষ্টিকর্তা বা পরম জ্ঞান',
      'মুহূর্ত = ৪৮ মিনিটের সময়কাল'
    ],
    meaningSummary: 'একে "সৃষ্টিকর্তার সময়" বলা হয় কারণ এই সময়ে মন শান্ত ও একাগ্র থাকে।',
    timingTitle: 'সময়কাল',
    timingPoints: [
      'সূর্যোদয়ের ১ ঘণ্টা ৩৬ মিনিট আগে শুরু',
      'সূর্যোদয়ের ৪৮ মিনিট আগে শেষ',
      'স্থানীয় সূর্যোদয়ের ওপর ভিত্তি করে পরিবর্তিত হয়।'
    ],
    whySpecialTitle: 'কেন এটি বিশেষ?',
    whySpecialPoints: [
      'শান্ত পরিবেশ',
      'বিশুদ্ধ সকালের বাতাস',
      'উন্নত মনঃসংযোগ',
      'যোগ ও আয়ুর্বেদে অত্যন্ত পবিত্র বলে গণ্য'
    ],
    bestActivitiesTitle: 'করণীয় কাজসমূহ',
    bestActivitiesItems: [
      'ধ্যান',
      'যোগাসন',
      'প্রাণায়াম',
      'মন্ত্র জপ',
      'আধ্যাত্মিক গ্রন্থ পাঠ',
      'কৃতজ্ঞতা প্রকাশ'
    ],
    quickFactTitle: 'তথ্যকথা',
    quickFactText: 'সূর্যোদয় সকাল ৬:০০টায় হলে ব্রহ্ম মুহূর্ত হবে সকাল ৪:২৪ থেকে ৫:১২ পর্যন্ত।'
  },
  mr: {
    modalHeaderTitle: '🌅 ब्रह्म वेळ (ब्रह्म मुहूर्त)',
    subtitle: 'सूर्योदयापूर्वीची अत्यंत पवित्र वेळ, ध्यान व योगासाठी उत्तम. ही वेळ सूर्योदयाच्या १ तास ३६ मिनिटे आधी सुरू होते.',
    whatIsTitle: 'ब्रह्म मुहूर्त म्हणजे काय?',
    whatIsText: 'ब्रह्म मुहूर्त हा सूर्योदयापूर्वीचा पवित्र काळ आहे. ध्यान, योग साधना, प्रार्थना व आत्मचिंतनासाठी हा काळ सर्वोत्तम मानला जातो.',
    meaningTitle: 'अर्थ',
    meaningPoints: [
      'ब्रह्म = सृष्टीकर्ता किंवा सर्वोच्च ज्ञान',
      'मुहूर्त = ४८ मिनिटांचा कालावधी'
    ],
    meaningSummary: 'याला "सृष्टीकर्त्याची वेळ" म्हणतात कारण या काळात मन शांत व एकाग्र असते.',
    timingTitle: 'वेळ',
    timingPoints: [
      'सूर्योदयाच्या १ तास ३६ मिनिटे आधी सुरू',
      'सूर्योदयाच्या ४८ मिनिटे आधी समाप्त',
      'सूर्योदयानुसार दररोज वेळ बदलते.'
    ],
    whySpecialTitle: 'विशेष का आहे?',
    whySpecialPoints: [
      'शांत वातावरण',
      'शुद्ध सकाळची हवा',
      'उत्तम एकाग्रता',
      'योग व आयुर्वेदात अत्यंत पवित्र मानले गेले आहे.'
    ],
    bestActivitiesTitle: 'या वेळी काय करावे?',
    bestActivitiesItems: [
      'ध्यान',
      'योग',
      'प्राणायाम',
      'मंत्र जाप',
      'ग्रंथ वाचन',
      'कृतज्ञता नोंदवणे'
    ],
    quickFactTitle: 'महत्त्वाची टीप',
    quickFactText: 'सूर्योदय सकाळी ६:०० वाजता असल्यास ब्रह्म मुहूर्त ४:२४ ते ५:१२ वाजता असेल.'
  },
  ru: {
    modalHeaderTitle: '🌅 Время Брахма (Брахма Мухурта)',
    subtitle: 'Священное время перед рассветом для медитации, йоги и молитвы. Начинается примерно за 1 час 36 минут до восхода.',
    whatIsTitle: 'Что такое Брахма Мухурта?',
    whatIsText: 'Брахма Мухурта — священный период перед рассветом, традиционно считающийся самым мирным и духовно возвышенным временем дня.',
    meaningTitle: 'Значение',
    meaningPoints: [
      'Брахма = Создатель или Высшее Знание',
      'Мухурта = 48-минутный период'
    ],
    meaningSummary: 'Его называют «Временем Творца», так как в этот тихий час ум становится спокойным и восприимчивым.',
    timingTitle: 'Время проведения',
    timingPoints: [
      'Начинается за 1 час 36 минут до восхода',
      'Заканчивается за 48 минут до восхода',
      'Меняется ежедневно в зависимости от восхода солнца'
    ],
    whySpecialTitle: 'Почему оно особенное?',
    whySpecialPoints: [
      'Мирная атмосфера',
      'Свежий утренний воздух',
      'Лучшая концентрация',
      'Высоко ценится в Йоге и Аюрведе'
    ],
    bestActivitiesTitle: 'Лучшие занятия',
    bestActivitiesItems: [
      'Медитация',
      'Йога',
      'Пранаяма',
      'Чтение мантр',
      'Чтение духовных текстов',
      'Дневник благодарности'
    ],
    quickFactTitle: 'Быстрый факт',
    quickFactText: 'Если восход в 6:00, то Брахма Мухурта длится примерно с 4:24 до 5:12.'
  },
  fr: {
    modalHeaderTitle: '🌅 Heure Brahma (Brahma Muhurat)',
    subtitle: 'Moment sacré avant le lever du soleil pour la méditation, le yoga et la prière. Commence environ 1 heure 36 minutes avant l\'aube.',
    whatIsTitle: 'Qu\'est-ce que Brahma Muhurat ?',
    whatIsText: 'Brahma Muhurat est la période sacrée précédant le lever du soleil, considérée comme le moment le plus paisible de la journée.',
    meaningTitle: 'Signification',
    meaningPoints: [
      'Brahma = Créateur ou Connaissance Suprême',
      'Muhurat = Période de 48 minutes'
    ],
    meaningSummary: 'Appelé « Heure du Créateur », cet instant rend l\'esprit calme et réceptif.',
    timingTitle: 'Horaire',
    timingPoints: [
      'Commence 1h 36m avant le lever du soleil',
      'Se termine 48m avant le lever du soleil',
      'Varie quotidiennement selon l\'aube'
    ],
    whySpecialTitle: 'Pourquoi est-ce spécial ?',
    whySpecialPoints: [
      'Environnement paisible',
      'Air pur du matin',
      'Excellente concentration',
      'Très valorisé en Yoga et Ayurvéda'
    ],
    bestActivitiesTitle: 'Meilleures activités',
    bestActivitiesItems: [
      'Méditation',
      'Yoga',
      'Pranayama',
      'Récitation de mantras',
      'Lecture de textes sacrés',
      'Journal de gratitude'
    ],
    quickFactTitle: 'Fait rapide',
    quickFactText: 'Si le soleil se lève à 6h00, Brahma Muhurat s\'étend de 4h24 à 5h12.'
  },
  es: {
    modalHeaderTitle: '🌅 Hora Brahma (Brahma Muhurat)',
    subtitle: 'El tiempo sagrado antes del amanecer para la meditación, el yoga y la oración. Comienza 1 hora y 36 minutos antes del amanecer.',
    whatIsTitle: '¿Qué es Brahma Muhurat?',
    whatIsText: 'Brahma Muhurat es el período sagrado antes del amanecer, considerado el momento más pacífico y espiritualmente elevado del día.',
    meaningTitle: 'Significado',
    meaningPoints: [
      'Brahma = Creador o Conocimiento Supremo',
      'Muhurat = Período de 48 minutos'
    ],
    meaningSummary: 'Se le llama la "Hora del Creador" porque calma la mente y la vuelve receptiva.',
    timingTitle: 'Horario',
    timingPoints: [
      'Empieza 1h 36m antes del amanecer',
      'Termina 48m antes del amanecer',
      'Cambia diariamente según el amanecer local'
    ],
    whySpecialTitle: '¿Por qué es especial?',
    whySpecialPoints: [
      'Entorno de paz',
      'Aire fresco matutino',
      'Mejor enfoque',
      'Muy valorado en Yoga y Ayurveda'
    ],
    bestActivitiesTitle: 'Mejores actividades',
    bestActivitiesItems: [
      'Meditación',
      'Yoga',
      'Pranayama',
      'Canto de mantras',
      'Lectura espiritual',
      'Diario de gratitud'
    ],
    quickFactTitle: 'Dato rápido',
    quickFactText: 'Si el amanecer es a las 6:00 AM, Brahma Muhurat será aproximadamente de 4:24 AM a 5:12 AM.'
  },
  he: {
    modalHeaderTitle: '🌅 זמן בראהמה (בראהמה מוהורט)',
    subtitle: 'הזמן המקודש לפני הזריחה למדיטציה, יוגה ותפילה. מתחיל כשעה ו-36 דקות לפני הזריחה.',
    whatIsTitle: 'מהו בראהמה מוהורט?',
    whatIsText: 'בראהמה מוהורט הוא החלון המקודש לפני הזריחה, הנחשב לזמן השקט והרוחני ביותר ביום.',
    meaningTitle: 'משמעות',
    meaningPoints: [
      'בראהמה = הבורא או הידע העליון',
      'מוהורט = פרק זמן של 48 דקות'
    ],
    meaningSummary: 'נקרא "זמן הבורא" כי בשעה שקטה זו התודעה הופכת לצלולה ורגועה.',
    timingTitle: 'זמנים',
    timingPoints: [
      'מתחיל שעה ו-36 דקות לפני הזריחה',
      'מסתיים 48 דקות לפני הזריחה',
      'משתנה מדי יום לפי הזריחה המקומית'
    ],
    whySpecialTitle: 'למה זה מיוחד?',
    whySpecialPoints: [
      'סביבה שקטה',
      'אוויר בוקר צלול',
      'ריכוז מירבי',
      'מוערך מאוד ביוגה ואיוורเวדה'
    ],
    bestActivitiesTitle: 'פעילויות מומלצות',
    bestActivitiesItems: [
      'מדיטציה',
      'יוגה',
      'פראניאמה',
      'שירת מנטרות',
      'קריאת טקסטים רוחניים',
      'יומן תודה'
    ],
    quickFactTitle: 'עובדה מהירה',
    quickFactText: 'אם הזריחה ב-6:00 בבוקר, בראהמה מוהורט יהיה בערך ב-4:24–5:12 בבוקר.'
  },
  id: {
    modalHeaderTitle: '🌅 Waktu Brahma (Brahma Muhurat)',
    subtitle: 'Waktu suci sebelum matahari terbit untuk meditasi, yoga, dan doa. Dimulai 1 jam 36 menit sebelum matahari terbit.',
    whatIsTitle: 'Apa itu Brahma Muhurat?',
    whatIsText: 'Brahma Muhurat adalah periode suci sebelum fajar yang dianggap paling damai dan spiritual untuk memulai hari.',
    meaningTitle: 'Arti Kata',
    meaningPoints: [
      'Brahma = Pencipta atau Pengetahuan Tertinggi',
      'Muhurat = Durasi waktu 48 menit'
    ],
    meaningSummary: 'Disebut "Waktu Sang Pencipta" karena membuat pikiran tenang dan fokus.',
    timingTitle: 'Waktu',
    timingPoints: [
      'Dimulai 1 jam 36 menit sebelum fajar',
      'Berakhir 48 menit sebelum fajar',
      'Berubah setiap hari mengikuti fajar lokal'
    ],
    whySpecialTitle: 'Mengapa Spesial?',
    whySpecialPoints: [
      'Suasana tenang',
      'Udara pagi yang segar',
      'Fokus lebih baik',
      'Sangat dihargai dalam tradisi Yoga dan Ayurveda'
    ],
    bestActivitiesTitle: 'Aktivitas Terbaik',
    bestActivitiesItems: [
      'Meditasi',
      'Yoga',
      'Pranayama',
      'Chanting Mantra',
      'Membaca kitab suci',
      'Jurnal rasa syukur'
    ],
    quickFactTitle: 'Fakta Singkat',
    quickFactText: 'Jika matahari terbit pukul 06.00, Brahma Muhurat berlangsung pukul 04.24–05.12.'
  },
  th: {
    modalHeaderTitle: '🌅 เวลาพรหม (ฤกษ์พรหม)',
    subtitle: 'ช่วงเวลามงคลก่อนพระอาทิตย์ขึ้นสำหรับการทำสมาธิ โยคะ และการสวดมนต์ เริ่มต้นก่อนพระอาทิตย์ขึ้นประมาณ 1 ชั่วโมง 36 นาที',
    whatIsTitle: 'ฤกษ์พรหมคืออะไร?',
    whatIsText: 'ฤกษ์พรหม คือช่วงเวลาอันศักดิ์สิทธิ์ก่อนพระอาทิตย์ขึ้น ถือเป็นช่วงเวลาที่สงบและทรงพลังทางจิตวิญญาณมากที่สุด',
    meaningTitle: 'ความหมาย',
    meaningPoints: [
      'พรหม = ผู้สร้าง หรือ ความรู้สูงสุด',
      'ฤกษ์ (Muhurat) = ช่วงเวลา 48 นาที'
    ],
    meaningSummary: 'เรียกว่า "เวลาของผู้สร้าง" เพราะเชื่อว่าทำให้จิตใจสงบ สว่าง และพร้อมเรียนรู้',
    timingTitle: 'ช่วงเวลา',
    timingPoints: [
      'เริ่มก่อนพระอาทิตย์ขึ้น 1 ชั่วโมง 36 นาที',
      'สิ้นสุดก่อนพระอาทิตย์ขึ้น 48 นาที',
      'เปลี่ยนแปลงทุกวันตามเวลาพระอาทิตย์ขึ้น'
    ],
    whySpecialTitle: 'ทำไมจึงมีความพิเศษ?',
    whySpecialPoints: [
      'บรรยากาศสงบเงียบ',
      'อากาศบริสุทธิ์ในยามเช้า',
      'จิตใจมีสมาธิสูง',
      'ได้รับความสำคัญอย่างมากในศาสตร์โยคะและอายุรเวท'
    ],
    bestActivitiesTitle: 'กิจกรรมที่เหมาะสม',
    bestActivitiesItems: [
      'ทำสมาธิ',
      'เล่นโยคะ',
      'ฝึกปราณายามะ (ฝึกหายใจ)',
      'สวดมนต์และท่องมนต์',
      'อ่านหนังสือธรรมะ',
      'เขียนบันทึกขอบคุณ'
    ],
    quickFactTitle: 'เกร็ดน่ารู้',
    quickFactText: 'หากพระอาทิตย์ขึ้นเวลา 06:00 น. ฤกษ์พรหมจะอยู่ช่วงประมาณ 04:24 น. ถึง 05:12 น.'
  }
};
