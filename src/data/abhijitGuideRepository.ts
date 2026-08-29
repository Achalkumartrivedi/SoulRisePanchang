import { LanguageCode } from '../types/language';

export interface AbhijitGuideContent {
  modalHeaderTitle: string;
  subtitle: string;
  whatIsTitle: string;
  whatIsPoints: string[];
  exampleText: string;
  meaningTitle: string;
  meaningText: string;
  auspiciousReasonTitle: string;
  auspiciousReasonText: string;
  goodForTitle: string;
  goodForItems: string[];
  avoidTitle: string;
  avoidText: string;
  historyTitle: string;
  historyText: string;
}

export const ABHIJIT_GUIDE: Record<LanguageCode, AbhijitGuideContent> = {
  hinglish: {
    modalHeaderTitle: '🌟 Abhijit Time (Abhijit Muhurat)',
    subtitle: 'Abhijit Muhurat ek vishesh shubh samay hai jo dopahar (solar noon) ke aas-paas hota hai. Yeh naye karya shuru karne ke liye sabse uttam samay mana jata hai.',
    whatIsTitle: 'What is Abhijit Time?',
    whatIsPoints: [
      'Yeh local solar noon (dopahar ke surya samay) ke aas-paas hota hai.',
      'Yeh lagbhag 48 minutes tak rehta hai, jiska madhya bindu solar noon hota hai.',
      'Parampara ke anusar, ise din ke kul samay ka 1/15va hissa mana jata hai.'
    ],
    exampleText: 'Udaharan: Agar suryoday 6:00 AM aur suryast 6:00 PM par ho, toh Abhijit Muhurat lagbhag 11:36 AM se 12:24 PM tak hoga.',
    meaningTitle: 'Why is it called "Abhijit"?',
    meaningText: 'Sanskrit shabd Abhijit (अभिजित) do shabdon se bana hai:\n• Abhi = Aage, Upar\n• Ji = Jeetna ya Vijay praapt karna\nIska arth hai "Vijeta" (The Victorious One). Yeh naam karya mein safalta aur badhaon par vijay ka prateek hai.',
    auspiciousReasonTitle: 'Why is it considered auspicious?',
    auspiciousReasonText: 'Vedic parampara ke anusar, dopahar ke samay Surya apne sabse prachand roop mein hota hai, jo spashtta aur urja ka prateek hai. Yeh samay samanya doshon ke prabhav ko kam karta hai.',
    goodForTitle: 'Good For:',
    goodForItems: [
      'Naya project ya karya shuru karna',
      'Business deals aur agreement sign karna',
      'Yatra (travel) shuru karna',
      'Job interview aur naye avsar',
      'Kagazat par hastakshar karna'
    ],
    avoidTitle: 'Generally Avoided For:',
    avoidText: 'Vivah (marriage) aur kuch vishesh anushthano ke liye dedicated kundali muhurat ko prathamikta di jaati hai.',
    historyTitle: 'Historical & Astronomical Note:',
    historyText: 'Prachin samay mein Abhijit 28va Nakshatra tha (star Vega). Bhale hi aaj 27 Nakshatron ka prayog hota hai, Abhijit naam vijay aur shubhata ke prateek ke roop mein aaj bhi jeevit hai.'
  },
  hi: {
    modalHeaderTitle: '🌟 अभिजित समय (अभिजित मुहूर्त)',
    subtitle: 'अभिजित मुहूर्त हिंदू पंचांग में दोपहर (सूर्य मध्याह्न) के समय का एक अत्यंत पवित्र एवं शुभ समय है। जब कोई अन्य मुहूर्त उपलब्ध न हो, तब इसे कार्य आरंभ हेतु सर्वश्रेष्ठ माना जाता है।',
    whatIsTitle: 'अभिजित समय क्या है?',
    whatIsPoints: [
      'यह स्थानीय सूर्य मध्याह्न (Solar Noon) के आसपास होता है।',
      'यह लगभग 48 मिनट तक रहता है, जिसका मध्य बिंदु सूर्य मध्याह्न होता है।',
      'परंपरागत रूप से यह संपूर्ण दिनमान के समय का 1/15वां भाग होता है।'
    ],
    exampleText: 'उदाहरण: यदि सूर्योदय प्रातः 6:00 बजे और सूर्यास्त सायं 6:00 बजे हो, तो अभिजित समय लगभग 11:36 AM से 12:24 PM तक होगा।',
    meaningTitle: 'इसे "अभिजित" क्यों कहा जाता है?',
    meaningText: 'संस्कृत शब्द अभिजित (अभिजित) दो शब्दों से मिलकर बना है:\n• अभि = आगे, ऊपर\n• जि = जीतना या विजय प्राप्त करना\nअतः अभिजित का शाब्दिक अर्थ है "विजयी" या "विजेता"। यह नाम बाधाओं पर विजय और सफलता का प्रतीक है।',
    auspiciousReasonTitle: 'यह शुभ क्यों माना जाता है?',
    auspiciousReasonText: 'वैदिक परंपरा में दोपहर के समय सूर्य अपनी उच्चतम शक्ति पर होता है, जो स्पष्टता, ऊर्जा और तेज का प्रतीक है। अभिजित समय साधारण दोषों के प्रभाव को शांत करने में सक्षम माना गया है।',
    goodForTitle: 'किन कार्यों के लिए शुभ है:',
    goodForItems: [
      'नया प्रोजेक्ट या व्यापार शुरू करना',
      'व्यावसायिक समझौते एवं सौदे',
      'यात्रा का शुभारंभ',
      'नौकरी के इंटरव्यू एवं महत्वपूर्ण बैठकें',
      'दस्तावेजों पर हस्ताक्षर करना'
    ],
    avoidTitle: 'किन कार्यों से बचना चाहिए:',
    avoidText: 'विवाह एवं कुछ विशेष धार्मिक अनुष्ठानों हेतु संपूर्ण कुंडली पर आधारित समर्पित मुहूर्त को प्राथमिकता दी जाती है।',
    historyTitle: 'ऐतिहासिक एवं खगोलीय तथ्य:',
    historyText: 'प्राचीन काल में अभिजित को 28वां नक्षत्र माना जाता था (अभिजीत तारा - Vega)। यद्यपि आधुनिक पंचांग में 27 नक्षत्रों का उपयोग होता है, किंतु अभिजित नाम आज भी विजय और मांगलिकता का प्रतीक बना हुआ है।'
  },
  en: {
    modalHeaderTitle: '🌟 Abhijit Time (Abhijit Muhurat)',
    subtitle: 'Abhijit Muhurat is a special auspicious window around midday in the Hindu calendar. It is considered one of the most favorable times to start important work.',
    whatIsTitle: 'What is Abhijit Time?',
    whatIsPoints: [
      'It occurs around local solar noon (centered on when the Sun is at peak elevation).',
      'It lasts for approximately 48 minutes, with the exact solar noon as its midpoint.',
      'Traditionally, it is calculated as 1/15th of the total daytime duration.'
    ],
    exampleText: 'Example: If sunrise is at 6:00 AM and sunset is at 6:00 PM, Abhijit Time will span approximately 11:36 AM to 12:24 PM.',
    meaningTitle: 'Why is it called "Abhijit"?',
    meaningText: 'The Sanskrit word Abhijit (अभिजित) originates from:\n• Abhi = toward, over\n• Ji = to conquer or win\nThus, Abhijit literally means "the victorious one" or "the conqueror." The name symbolizes victory over obstacles and guaranteed success.',
    auspiciousReasonTitle: 'Why is it considered auspicious?',
    auspiciousReasonText: 'In Vedic tradition, midday is when the Sun is at its maximum strength, symbolizing clarity, authority, and vitality. Ancient texts mention that Abhijit Time neutralizes many ordinary daily doshas (inauspicious factors).',
    goodForTitle: 'Good For:',
    goodForItems: [
      'Starting a new project or business',
      'Business deals & agreements',
      'Beginning journeys & travel',
      'Interviews & career milestones',
      'Signing contracts & legal documents'
    ],
    avoidTitle: 'Generally Avoided For:',
    avoidText: 'Some traditions avoid it for marriage or specific lifelong sacraments where full horoscope matching is preferred.',
    historyTitle: 'Historical & Astronomical Note:',
    historyText: 'Historically, Abhijit was recognized as the 28th Nakshatra (identified with the star Vega in the Lyra constellation). Although 27 Nakshatras are used today, the name Abhijit survives in Abhijit Time, preserving its legacy of victory.'
  },
  ta: {
    modalHeaderTitle: '🌟 அபிஜித் நேரம் (அபிஜித் முகூர்த்தம்)',
    subtitle: 'அபிஜித் நேரம் என்பது நண்பகலில் அமையும் மிகவும் சுபமான நேரமாகும். முக்கிய பணிகளைத் தொடங்க இது மிகவும் உகந்த நேரமாகக் கருதப்படுகிறது.',
    whatIsTitle: 'அபிஜித் நேரம் என்றால் என்ன?',
    whatIsPoints: [
      'இது உள்ளூர் நண்பகல் சூரிய நேரத்தைச் சுற்றி நிகழ்கிறது.',
      'இது சுமார் 48 நிமிடங்கள் நீடிக்கும்.',
      'பகலின் மொத்த நேரத்தில் 1/15 பங்கு என கணக்கிடப்படுகிறது.'
    ],
    exampleText: 'உதாரணம்: சூரியோதயம் காலை 6:00 மணி மற்றும் அஸ்தமனம் மாலை 6:00 மணி எனில், அபிஜித் நேரம் முற்பகல் 11:36 முதல் பிற்பகல் 12:24 வரை இருக்கும்.',
    meaningTitle: 'ஏன் "அபிஜித்" என்று அழைக்கப்படுகிறது?',
    meaningText: 'சம்ஸ்கிருத சொல் அபிஜித் என்றால் "வெற்றி பெறுபவர்" அல்லது "வெற்றி தருபவர்" என்று பொருள். இது தடைகளை வெல்லும் வெற்றிக்கான அடையாளமாகும்.',
    auspiciousReasonTitle: 'இது ஏன் சுபமானதாகக் கருதப்படுகிறது?',
    auspiciousReasonText: 'நண்பகலில் சூரியன் உச்ச வலிமையுடன் இருக்கும். இது தெளிவு மற்றும் ஆற்றலின் அடையாளமாகும்.',
    goodForTitle: 'எதற்கு நல்லது:',
    goodForItems: [
      'புதிய திட்டம் அல்லது தொழில் தொடங்குதல்',
      'வணிக ஒப்பந்தங்கள்',
      'பயணங்கள் தொடங்குதல்',
      'நேர்முகத் தேர்வுகள்',
      'முக்கிய ஆவணங்களில் கையெழுத்திடுதல்'
    ],
    avoidTitle: 'தவிர்க்கப்பட வேண்டியவை:',
    avoidText: 'திருமணம் போன்ற சில சிறப்பு சடங்குகளுக்கு ஜாதகப் பொருத்த முகூர்த்தமே முன்னுரிமை பெறுகிறது.',
    historyTitle: 'வரலாற்று குறிப்பு:',
    historyText: 'பண்டைய காலத்தில் அபிஜித் 28வது நட்சத்திரமாக (வேகா நட்சத்திரம்) கருதப்பட்டது. இன்றும் வெற்றித் தருணமாக இது போற்றப்படுகிறது.'
  },
  te: {
    modalHeaderTitle: '🌟 అభిజిత్ సమయం (అభిజిత్ ముహుర్తం)',
    subtitle: 'అభిజిత్ సమయం అనేది మధ్యాహ్న సమయంలో వచ్చే అత్యంత శుభప్రదమైన సమయం. కొత్త పనులు ప్రారంభించడానికి ఇది చాలా శ్రేష్ఠమైనది.',
    whatIsTitle: 'అభిజిత్ సమయం అంటే ఏమిటి?',
    whatIsPoints: [
      'ఇది స్థానిక సూర్య మధ్యాహ్నం ఆధారంగా వస్తుంది.',
      'ఇది సుమారు 48 నిమిషాల పాటు ఉంటుంది.',
      'పగటి సమయంలో 1/15వ వంతుగా దీనిని లెక్కిస్తారు.'
    ],
    exampleText: 'ఉదాహరణ: సూర్యోదయం ఉదయం 6:00 గంటలకు, సూర్యాస్తమయం సాయంత్రం 6:00 గంటలకు అయితే, అభిజిత్ సమయం 11:36 AM నుండి 12:24 PM వరకు ఉంటుంది.',
    meaningTitle: '"అభిజిత్" అని ఎందుకు పిలుస్తారు?',
    meaningText: 'సంస్కృత పదం అభిజిత్ అంటే "విజేత" లేదా "విజయాన్ని అందించేది". ఇది ఆటంకాలను అధిగమించి విజయం సాధించడాన్ని సూచిస్తుంది.',
    auspiciousReasonTitle: 'ఇది ఎందుకు శుభప్రదమైనది?',
    auspiciousReasonText: 'మధ్యాహ్న సమయంలో సూర్యుడు అత్యంత శక్తివంతంగా ఉంటాడు. ఇది స్పష్టత మరియు శక్తికి సంకేతం.',
    goodForTitle: 'దేనికి మంచిది:',
    goodForItems: [
      'కొత్త ప్రాజెక్ట్‌లు ప్రారంభించడం',
      'వ్యాపార ఒప్పందాలు',
      'ప్రయాణాలు ప్రారంభించడం',
      'ఇంటర్వ్యూలు',
      'పత్రాలపై సంతకాలు చేయడం'
    ],
    avoidTitle: 'వర్జించవలసినవి:',
    avoidText: 'వివాహం వంటి కొన్ని ప్రత్యేక కార్యాలకు సంపూర్ణ జాతక ముహుర్తాన్నే ఎంచుకుంటారు.',
    historyTitle: 'చారిత్రక అంశం:',
    historyText: 'ప్రాచీన కాలంలో అభిజిత్ 28వ నక్షత్రంగా ఉండేది. నేటికీ అభిజిత్ సమయం విజయాన్ని ఇచ్చేదిగా నిలిచింది.'
  },
  bn: {
    modalHeaderTitle: '🌟 অভিজিৎ সময় (অভিজিৎ মুহূর্ত)',
    subtitle: 'অভিজিৎ সময় হলো দুপুরের সময়কার এক অত্যন্ত শুভ সময়। নতুন কাজ শুরু করার জন্য এটি অত্যন্ত উপযুক্ত।',
    whatIsTitle: 'অভিজিৎ সময় কী?',
    whatIsPoints: [
      'এটি স্থানীয় সৌর দুপুরের সময় ঘটে।',
      'এটি প্রায় ৪৮ মিনিট স্থায়ী হয়।',
      'দিনের মোট সময়ের ১/১৫ অংশ হিসেবে এটি গণিত হয়।'
    ],
    exampleText: 'উদাহরণ: সূর্যোদয় সকাল ৬:০০ এবং সূর্যাস্ত সন্ধ্যা ৬:০০ হলে, অভিজিৎ সময় হবে সকাল ১১:৩৬ থেকে দুপুর ১২:২৪ পর্যন্ত।',
    meaningTitle: 'কেন একে "অভিজিৎ" বলা হয়?',
    meaningText: 'সংস্কৃত শব্দ অভিজিৎ মানে হলো "বিজয়ী" বা "জয় প্রদানকারী"। এটি বাধা অতিক্রম করে সাফল্য লাভের প্রতীক।',
    auspiciousReasonTitle: 'কেন এটি শুভ বলে গণ্য হয়?',
    auspiciousReasonText: 'দুপুরে সূর্য তার সর্বোচ্চ শক্তিতে থাকে, যা স্পষ্টতা ও শক্তির প্রতীক।',
    goodForTitle: 'কিসের জন্য শুভ:',
    goodForItems: [
      'নতুন কাজ বা ব্যবসা শুরু',
      'ব্যবসায়িক চুক্তি',
      'যাত্রা শুরু',
      'ইন্টারভিউ ও নতুন সুযোগ',
      'কাগজপত্রে স্বাক্ষর'
    ],
    avoidTitle: 'সাধারণত বর্জিত:',
    avoidText: 'বিবাহের মতো কিছু বিশেষ অনুষ্ঠানের জন্য জ্যতিষীয় কোষ্ঠী ভিত্তিক সময়কে প্রাধান্য দেওয়া হয়।',
    historyTitle: 'ঐতিহাসিক তথ্য:',
    historyText: 'প্রাচীনকালে অভিজিৎ ছিল ২৮তম নক্ষত্র। আজও এটি সাফল্য ও শুভত্বের প্রতীক।'
  },
  mr: {
    modalHeaderTitle: '🌟 अभिजित वेळ (अभिजित मुहूर्त)',
    subtitle: 'अभिजित वेळ ही दुपारी सूर्य मध्यान्हाच्या वेळी येणारी अत्यंत शुभ वेळ आहे. नवीन कामे सुरू करण्यासाठी ही वेळ उत्तम मानली जाते.',
    whatIsTitle: 'अभिजित वेळ म्हणजे काय?',
    whatIsPoints: [
      'ही वेळ स्थानिक सूर्य मध्यान्हाच्या (Solar Noon) आसपास असते.',
      'ही सुमारे ४८ मिनिटे राहते.',
      'दिवसाच्या एकूण वेळेचा १/१५ वा भाग म्हणून ही गणली जाते.'
    ],
    exampleText: 'उदाहरण: सूर्योदय सकाळी ६:०० वाजता आणि सूर्यास्त संध्याकाळी ६:०० वाजता असल्यास, अभिजित वेळ ११:३६ AM ते १२:२४ PM असेल.',
    meaningTitle: 'याला "अभिजित" का म्हणतात?',
    meaningText: 'संस्कृत शब्द अभिजित म्हणजे "विजयी" किंवा "विजेता". हे नाव अडचणींवर मात करून विजय मिळवण्याचे प्रतीक आहे.',
    auspiciousReasonTitle: 'ही वेळ शुभ का मानली जाते?',
    auspiciousReasonText: 'दुपारी सूर्य आपल्या पूर्ण तेजात असतो, जो ऊर्जा व स्पष्टतेचे प्रतीक आहे.',
    goodForTitle: 'कशासाठी शुभ आहे:',
    goodForItems: [
      'नवीन काम किंवा व्यवसाय सुरू करणे',
      'व्यावसायिक करार',
      'प्रवासाची सुरुवात',
      'मुलाखती (Interviews)',
      'कागदपत्रांवर सह्या करणे'
    ],
    avoidTitle: 'कशासाठी टाळावे:',
    avoidText: 'विवाहासारख्या काही विशेष कार्यासाठी संपूर्ण कुंडलीवर आधारित मुहूर्ताला प्राधान्य दिले जाते.',
    historyTitle: 'ऐतिहासिक नोंद:',
    historyText: 'प्राचीन काळात अभिजित हे २८ वे नक्षत्र मानले जात होते. आज २७ नक्षत्रे वापरली जात असली तरी अभिजित हे नाव शुभतेचे प्रतीक म्हणून टिकून आहे.'
  },
  ru: {
    modalHeaderTitle: '🌟 Время Абхиджит (Абхиджит Мухурта)',
    subtitle: 'Время Абхиджит — это благословенный период около солнечного полдня. Считается одним из лучших моментов для начала новых дел.',
    whatIsTitle: 'Что такое Время Абхиджит?',
    whatIsPoints: [
      'Наступает около местного солнечного полдня.',
      'Длится около 48 минут (полдень является центром).',
      'Рассчитывается как 1/15 часть дневного времени.'
    ],
    exampleText: 'Пример: Если восход в 6:00, а закат в 18:00, Время Абхиджит будет с 11:36 до 12:24.',
    meaningTitle: 'Почему оно называется "Абхиджит"?',
    meaningText: 'На санскрите Абхиджит означает "Победитель" или "Приносящий победу". Символизирует преодоление препятствий.',
    auspiciousReasonTitle: 'Почему оно считается благоприятным?',
    auspiciousReasonText: 'В полдень Солнце находится в наивысшей точке силы, символизируя ясность и жизненную энергию.',
    goodForTitle: 'Благоприятно для:',
    goodForItems: [
      'Запуска новых проектов и бизнеса',
      'Подписания договоров и сделок',
      'Начала путешествий',
      'Собеседований и важных встреч',
      'Подписания документов'
    ],
    avoidTitle: 'Не рекомендуется для:',
    avoidText: 'Свадебных церемоний, где требуется индивидуальный подбор по гороскопу.',
    historyTitle: 'Исторический факт:',
    historyText: 'В древности Абхиджит считалась 28-й Накшатрой (звезда Вега). Имя сохраняет свое значение победы.'
  },
  fr: {
    modalHeaderTitle: '🌟 Heure Abhijit (Abhijit Muhurat)',
    subtitle: 'L\'Heure Abhijit est une période auspicieuse vers le midi solaire. C\'est l\'un des meilleurs moments pour commencer un travail important.',
    whatIsTitle: 'Qu\'est-ce que l\'Heure Abhijit ?',
    whatIsPoints: [
      'Elle se produit autour du midi solaire local.',
      'Elle dure environ 48 minutes.',
      'Calculée comme 1/15ème de la durée du jour.'
    ],
    exampleText: 'Exemple : Si le lever est à 6h00 et le coucher à 18h00, l\'Heure Abhijit sera de 11h36 à 12h24.',
    meaningTitle: 'Pourquoi "Abhijit" ?',
    meaningText: 'En sanskrit, Abhijit signifie "Le Victorieux". Ce nom symbolise la victoire sur les obstacles.',
    auspiciousReasonTitle: 'Pourquoi est-ce auspicieux ?',
    auspiciousReasonText: 'À midi, le Soleil est au sommet de sa puissance, symbolisant la clarté et la vitalité.',
    goodForTitle: 'Favorable pour :',
    goodForItems: [
      'Lancer de nouveaux projets ou entreprises',
      'Contrats et accords commerciaux',
      'Début de voyages',
      'Entretiens importants',
      'Signature de documents'
    ],
    avoidTitle: 'À éviter pour :',
    avoidText: 'Certains mariages nécessitant une étude astrologique complète.',
    historyTitle: 'Note historique :',
    historyText: 'Autrefois 28ème Nakshatra (étoile Véga), le nom Abhijit conserve sa renommée de victoire.'
  },
  es: {
    modalHeaderTitle: '🌟 Hora Abhijit (Abhijit Muhurat)',
    subtitle: 'La Hora Abhijit es un período auspicioso alrededor del mediodía solar. Es un momento ideal para iniciar actividades importantes.',
    whatIsTitle: '¿Qué es la Hora Abhijit?',
    whatIsPoints: [
      'Ocurre alrededor del mediodía solar local.',
      'Dura aproximadamente 48 minutos.',
      'Se calcula como 1/15 del tiempo diurno.'
    ],
    exampleText: 'Ejemplo: Si el sol sale a las 6:00 AM y se pone a las 6:00 PM, la Hora Abhijit será de 11:36 AM a 12:24 PM.',
    meaningTitle: '¿Por qué se llama "Abhijit"?',
    meaningText: 'En sánscrito, Abhijit significa "El Victorioso". Simboliza la victoria sobre los obstáculos.',
    auspiciousReasonTitle: '¿Por qué es auspicioso?',
    auspiciousReasonText: 'Al mediodía el Sol está en su punto máximo de energía y claridad.',
    goodForTitle: 'Favorable para:',
    goodForItems: [
      'Iniciar proyectos y negocios',
      'Acuerdos comerciales',
      'Iniciar viajes',
      'Entrevistas de trabajo',
      'Firmar documentos'
    ],
    avoidTitle: 'Generalmente evitado para:',
    avoidText: 'Bodas donde se requiere una selección horaria personalizada según la carta astral.',
    historyTitle: 'Nota histórica:',
    historyText: 'Antiguamente era la 28.ª Nakshatra (estrella Vega). Conserva su fama de éxito y victoria.'
  },
  he: {
    modalHeaderTitle: '🌟 זמן אבהיג\'יט (אבהיג\'יט מוהורט)',
    subtitle: 'זמן אבהיג\'יט הוא חלון זמן מבורך סביב חצות היום השמשי. מומלץ מאוד להתחלת פרויקטים חדשים.',
    whatIsTitle: 'מהו זמן אבהיג\'יט?',
    whatIsPoints: [
      'מתרחש סביב חצות היום השמשי המקומי.',
      'נמשך כ-48 דקות.',
      'מחושב כ-1/15 ממידת שעות האור.'
    ],
    exampleText: 'דוגמה: אם הזריחה ב-6:00 והשקיעה ב-18:00, זמן אבהיג\'יט יהיה מ-11:36 עד 12:24.',
    meaningTitle: 'למה נקרא "אבהיג\'יט"?',
    meaningText: 'בסנסקריט פירוש השם הוא "המנצח" או "המביא ניצחון". מסמל התגברות על מכשולים.',
    auspiciousReasonTitle: 'למה זה מבורך?',
    auspiciousReasonText: 'בחצות היום השמש בשיא עוצמתה, דבר המסמל בהירות ואנרגיה.',
    goodForTitle: 'מצויין עבור:',
    goodForItems: [
      'התחלת פרויקט או עסק חדש',
      'חתימה על הסכמים עסקיים',
      'יציאה לדרך ולנסיעות',
      'ראיונות עבודה',
      'חתימת מסמכים'
    ],
    avoidTitle: 'פחות מומלץ עבור:',
    avoidText: 'טקסי נישואין הדורשים התאמת מפה אישית מקיפה.',
    historyTitle: 'הערה היסטורית:',
    historyText: 'בעבר נחשבה לנאקשאטרה ה-28 (כוכב וגה). השם נשאר כסמל לניצחון ולהצלחה.'
  },
  id: {
    modalHeaderTitle: '🌟 Waktu Abhijit (Abhijit Muhurat)',
    subtitle: 'Waktu Abhijit adalah waktu baik di sekitar tengah hari solar. Ini adalah waktu terbaik untuk memulai pekerjaan penting.',
    whatIsTitle: 'Apa itu Waktu Abhijit?',
    whatIsPoints: [
      'Terjadi di sekitar tengah hari solar lokal.',
      'Berlangsung sekitar 48 menit.',
      'Dihitung sebagai 1/15 dari total waktu siang hari.'
    ],
    exampleText: 'Contoh: Jika matahari terbit pukul 06:00 dan terbenam pukul 18:00, Waktu Abhijit adalah 11:36 hingga 12:24.',
    meaningTitle: 'Mengapa dinamakan "Abhijit"?',
    meaningText: 'Dalam bahasa Sanskerta, Abhijit berarti "Sang Pemenang". Ini melambangkan kemenangan atas hambatan.',
    auspiciousReasonTitle: 'Mengapa dianggap baik?',
    auspiciousReasonText: 'Tengah hari adalah saat Matahari berada pada puncak kekuatan dan kejelasan.',
    goodForTitle: 'Baik untuk:',
    goodForItems: [
      'Memulai proyek atau bisnis baru',
      'Kesepakatan bisnis & kontrak',
      'Memulai perjalanan',
      'Wawancara kerja',
      'Menandatangani dokumen'
    ],
    avoidTitle: 'Hindari untuk:',
    avoidText: 'Pernikahan yang membutuhkan perhitungan horoskop khusus.',
    historyTitle: 'Catatan Sejarah:',
    historyText: 'Dahulu merupakan Nakshatra ke-28 (bintang Vega). Nama ini melambangkan keberhasilan.'
  },
  th: {
    modalHeaderTitle: '🌟 เวลาอภิจิต (ฤกษ์อภิจิต)',
    subtitle: 'เวลาอภิจิต คือช่วงเวลามงคลพิเศษในช่วงเที่ยงวัน ถือเป็นช่วงเวลาที่ดีที่สุดในการเริ่มต้นงานสำคัญ',
    whatIsTitle: 'เวลาอภิจิตคืออะไร?',
    whatIsPoints: [
      'เกิดขึ้นในช่วงเที่ยงวันตามเวลาสุริยคติ',
      'กินเวลาประมาณ 48 นาที',
      'คำนวณเป็น 1 ใน 15 ส่วนของช่วงเวลากลางวัน'
    ],
    exampleText: 'ตัวอย่าง: หากพระอาทิตย์ขึ้นเวลา 06:00 น. และตกเวลา 18:00 น. เวลาอภิจิตจะอยู่ช่วงประมาณ 11:36 น. ถึง 12:24 น.',
    meaningTitle: 'ทำไมจึงเรียกว่า "อภิจิต"?',
    meaningText: 'คำว่า อภิจิต ในภาษาสันสกฤตหมายถึง "ผู้พิชิต" หรือ "ผู้ได้รับชัยชนะ" เป็นสัญลักษณ์ของการเอาชนะอุปสรรค',
    auspiciousReasonTitle: 'ทำไมจึงถือเป็นเวลามงคล?',
    auspiciousReasonText: 'เที่ยงวันคือช่วงที่พระอาทิตย์มีพลังสูงสุด สื่อถึงความกระจ่างแจ้งและพลังชีวิต',
    goodForTitle: 'เหมาะสำหรับ:',
    goodForItems: [
      'เริ่มโครงการใหม่หรือธุรกิจใหม่',
      'การทำสัญญาเจรจาธุรกิจ',
      'เริ่มออกเดินทาง',
      'สัมภาษณ์งาน',
      'เซ็นเอกสารสำคัญ'
    ],
    avoidTitle: 'ควรงดเว้นสำหรับ:',
    avoidText: 'พิธีมงคลสมรสซึ่งต้องใช้การคำนวณดวงชะตาเฉพาะบุคคล',
    historyTitle: 'เกร็ดประวัติศาสตร์:',
    historyText: 'ในอดีตเคยเป็นนักษัตรที่ 28 (ดาวเวกา) ชื่ออภิจิตยังคงเป็นสัญลักษณ์แห่งชัยชนะและความเป็นมงคล'
  }
};
