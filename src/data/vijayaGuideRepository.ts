import { LanguageCode } from '../types/language';

export interface VijayaGuideContent {
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

export const VIJAYA_GUIDE: Record<LanguageCode, VijayaGuideContent> = {
  hinglish: {
    modalHeaderTitle: '✌️ Vijaya Time (Vijaya Muhurat)',
    subtitle: 'Vijay aur safalta ka atyant shubh samay. Naye project, business deals, yatra aur mahatvapurna karyon ke liye sabse uttam.',
    whatIsTitle: 'What is Vijaya Muhurat?',
    whatIsText: 'Vijaya Muhurat dopahar ke baad ka ek aesa shubh samay hai jo karya mein vijay, safalta aur badhaon ko door karne ke liye jana jata hai.',
    meaningTitle: 'Meaning',
    meaningPoints: [
      'Vijaya (विजय) = Jeet, Vijay ya Safalta',
      'Muhurat = 48 minute ka shubh samay'
    ],
    meaningSummary: 'Ise "Vijay ka Samay" kaha jata hai kyunki is samay shuru kiye gaye karya mein safalta milne ki sambhavna sabse adhik hoti hai.',
    timingTitle: 'Timing',
    timingPoints: [
      'Dopahar ke baad lagbhag 2:00 PM se 3:00 PM ke beech hota hai',
      'Iska kul samay lagbhag 48 minutes ka hota hai',
      'Suryoday aur suryast ke anusar roz badalta hai'
    ],
    whySpecialTitle: 'Why is it Special?',
    whySpecialPoints: [
      'Shri Ram ki vijay parampara se juda hai',
      'Karya mein aane wali badhaon ko kam karta hai',
      'Naye samjhote aur pratiyogita mein aatmavishvas badhata hai',
      'Vedic jyotish mein karya safalta ke liye vishesh sthan'
    ],
    bestActivitiesTitle: 'Best Activities',
    bestActivitiesItems: [
      'Naya business ya project shuru karna',
      'Important contracts aur deals sign karna',
      'Yatra (travel) shuru karna',
      'Court case ya legal matters initiate karna',
      'Exam ya Job Interview ke liye jana',
      'Vehicle ya Property khareedna'
    ],
    quickFactTitle: 'Quick Fact',
    quickFactText: 'Pauranik kathaon ke anusar Bhagwan Shri Ram ne Ravan par vijay ke liye Vijaya Muhurat mein hi prasthan kiya tha.'
  },
  hi: {
    modalHeaderTitle: '✌️ विजय समय (विजय मुहूर्त)',
    subtitle: 'विजय और सफलता का अत्यंत शुभ समय। नए प्रोजेक्ट, बिजनेस डील, यात्रा और महत्वपूर्ण कार्यों के लिए सर्वश्रेष्ठ।',
    whatIsTitle: 'विजय मुहूर्त क्या है?',
    whatIsText: 'विजय मुहूर्त दोपहर के बाद का वह परम शुभ समय है जो कार्यों में सफलता, विजय और बाधाओं के निवारण के लिए प्रसिद्ध है।',
    meaningTitle: 'अर्थ',
    meaningPoints: [
      'विजय (Vijaya) = जीत, सफलता या पराक्रम',
      'मुहूर्त (Muhurat) = 48 मिनट का शुभ समय'
    ],
    meaningSummary: 'इसे "विजय का समय" कहा जाता है क्योंकि इस अवधि में प्रारंभ किए गए कार्य निर्विघ्न संपन्न होकर सफलता दिलाते हैं।',
    timingTitle: 'समय',
    timingPoints: [
      'अपरान्ह (दोपहर बाद) लगभग 2:00 PM से 3:00 PM के मध्य',
      'इसकी कुल अवधि लगभग 48 मिनट होती है',
      'स्थानीय सूर्योदय और सूर्यास्त के अनुसार प्रतिदिन बदलता है'
    ],
    whySpecialTitle: 'क्यों विशेष है?',
    whySpecialPoints: [
      'भगवान श्री राम की विजय गाथा से जुड़ा हुआ',
      'बाधाओं और दोषों को शांत करता है',
      'महत्वपूर्ण समझौतों में सफलता एवं आत्मविश्वास प्रदान करता है',
      'वैदिक ज्योतिष में कार्य सिद्धि का प्रतीक'
    ],
    bestActivitiesTitle: 'इस समय क्या करें?',
    bestActivitiesItems: [
      'नया व्यापार या प्रोजेक्ट शुरू करना',
      'महत्वपूर्ण अनुबंधों पर हस्ताक्षर करना',
      'यात्रा का शुभारंभ',
      'कानूनी कार्य एवं न्यायालय संबंधी मामले',
      'परीक्षा या साक्षात्कार (Interview) हेतु प्रस्थान',
      'संपत्ति या वाहन की खरीदारी'
    ],
    quickFactTitle: 'रोचक तथ्य',
    quickFactText: 'पौराणिक मान्यताओं के अनुसार भगवान श्री राम ने लंका विजय हेतु विजय मुहूर्त में ही प्रस्थान किया था।'
  },
  en: {
    modalHeaderTitle: '✌️ Vijaya Time (Vijaya Muhurat)',
    subtitle: 'The auspicious window of victory and success. Ideal for launching new projects, business deals, travel, and legal matters.',
    whatIsTitle: 'What is Vijaya Muhurat?',
    whatIsText: 'Vijaya Muhurat is a highly favorable afternoon period in the Hindu calendar, traditionally associated with triumph, success, and overcoming obstacles.',
    meaningTitle: 'Meaning',
    meaningPoints: [
      'Vijaya = Victory, Triumph, or Success',
      'Muhurat = A 48-minute auspicious window'
    ],
    meaningSummary: 'It is called the "Time of Victory" because endeavors initiated during this period are believed to overcome hurdles and meet with success.',
    timingTitle: 'Timing',
    timingPoints: [
      'Occurs in the afternoon (typically between 2:00 PM and 3:00 PM)',
      'Lasts for approximately 48 minutes',
      'Varies daily based on local sunrise and sunset'
    ],
    whySpecialTitle: 'Why is it Special?',
    whySpecialPoints: [
      'Associated with Lord Rama\'s victorious march',
      'Reduces obstacles and counteracts negative influences',
      'Enhances focus, confidence, and strategic success',
      'Revered in Vedic tradition for key milestones'
    ],
    bestActivitiesTitle: 'Best Activities',
    bestActivitiesItems: [
      'Launching a new project or business',
      'Signing key contracts & business agreements',
      'Beginning travel or long journeys',
      'Filing legal matters or resolving disputes',
      'Appearing for exams or job interviews',
      'Purchasing property, vehicles, or assets'
    ],
    quickFactTitle: 'Quick Fact',
    quickFactText: 'According to tradition, Lord Rama set out on his campaign to defeat Ravana during Vijaya Muhurat.'
  },
  ta: {
    modalHeaderTitle: '✌️ விஜய நேரம் (விஜய முகூர்த்தம்)',
    subtitle: 'வெற்றி மற்றும் சாதனைகளுக்கான சுப நேரம். புதிய திட்டங்கள், வணிக ஒப்பந்தங்கள் மற்றும் பயணங்களுக்கு ஏற்றது.',
    whatIsTitle: 'விஜய முகூர்த்தம் என்றால் என்ன?',
    whatIsText: 'விஜய முகூர்த்தம் என்பது பிற்பகலில் வரும் வெற்றி தருணத்தைக் குறிக்கும் சுப நேரமாகும்.',
    meaningTitle: 'பொருள்',
    meaningPoints: [
      'விஜயம் = வெற்றி அல்லது சாதனை',
      'முகூர்த்தம் = 48 நிமிட சுப நேரம்'
    ],
    meaningSummary: 'இந்த நேரத்தில் தொடங்கும் காரியங்கள் தடைகளைத் தாண்டி வெற்றி பெறும் என்பதால் இது "வெற்றி நேரம்" எனப்படுகிறது.',
    timingTitle: 'நேரம்',
    timingPoints: [
      'பிற்பகல் சுமார் 2:00 PM முதல் 3:00 PM வரை நிகழும்',
      'சுமார் 48 நிமிடங்கள் நீடிக்கும்',
      'தினமும் சூரிய உதய அஸ்தமன நேரத்திற்கேற்ப மாறும்'
    ],
    whySpecialTitle: 'ஏன் இது சிறப்பு?',
    whySpecialPoints: [
      'ஸ்ரீ ராமரின் வெற்றிப் பயணத்துடன் தொடர்புடையது',
      'காரியத் தடைகளைக் குறைக்கும்',
      'நம்பிக்கை மற்றும் கவனத்தை அதிகரிக்கும்'
    ],
    bestActivitiesTitle: 'செய்ய ஏற்றவை',
    bestActivitiesItems: [
      'புதிய தொழில் தொடங்குதல்',
      'ஒப்பந்தங்களில் கையெழுத்திடுதல்',
      'பயணங்கள் தொடங்குதல்',
      'சட்ட காரியங்கள்',
      'நேர்முகத் தேர்வு மற்றும் தேர்வுகள்',
      'வாகனம் மற்றும் சொத்து வாங்குதல்'
    ],
    quickFactTitle: 'சுவாரஸ்ய தகவல்',
    quickFactText: 'ஸ்ரீ ராமர் இராவணனை வெல்ல புறப்பட்ட தருணம் விஜய முகூர்த்தமாகும்.'
  },
  te: {
    modalHeaderTitle: '✌️ విజయ సమయం (విజయ ముహుర్తం)',
    subtitle: 'విజయం మరియు సఫలతకు అత్యంత శుభప్రదమైన సమయం. కొత్త ప్రాజెక్ట్‌లు, వ్యాపార ఒప్పందాలు మరియు ప్రయాణాలకు శ్రేష్ఠమైనది.',
    whatIsTitle: 'విజయ ముహుర్తం అంటే ఏమిటి?',
    whatIsText: 'విజయ ముహుర్తం అనేది మధ్యాహ్నం తర్వాత వచ్చే పవిత్రమైన సమయం. ఇది పనులలో విజయాన్ని అందిస్తుంది.',
    meaningTitle: 'అర్థం',
    meaningPoints: [
      'విజయ = గెలుపు లేదా విజయం',
      'ముహుర్తం = 48 నిమిషాల కాల వ్యవధి'
    ],
    meaningSummary: 'ఈ సమయంలో ప్రారంభించిన పనులు ఆటంకాలు తొలగి విజయవంతమవుతాయి.',
    timingTitle: 'సమయం',
    timingPoints: [
      'మధ్యాహ్నం సుమారు 2:00 PM నుండి 3:00 PM మధ్య',
      'సుమారు 48 నిమిషాల పాటు ఉంటుంది',
      'ప్రతిరోజూ సూర్యోదయాన్ననుసరించి మారుతుంది'
    ],
    whySpecialTitle: 'ఎందుకు ప్రత్యేకమైనది?',
    whySpecialPoints: [
      'శ్రీరాముని విజయ యాత్రతో ముడిపడి ఉంది',
      'ఆటంకాలను తొలగిస్తుంది',
      'ఆత్మవిశ్వాసాన్ని పెంచుతుంది'
    ],
    bestActivitiesTitle: 'చేయవలసిన పనులు',
    bestActivitiesItems: [
      'కొత్త వ్యాపారం ప్రారంభించడం',
      'ఒప్పందాలపై సంతకాలు చేయడం',
      'ప్రయాణాలు ప్రారంభించడం',
      'న్యాయపరమైన వ్యవహారాలు',
      'ఇంటర్వ్యూలు మరియు పరీక్షలు',
      'ఆస్తులు లేదా వాహనాల కొనుగోలు'
    ],
    quickFactTitle: 'త్వరిత నిజం',
    quickFactText: 'శ్రీరాముడు రావణాసురునిపై విజయానికి విజయ ముహుర్తంలోనే ప్రయాణమయ్యారు.'
  },
  bn: {
    modalHeaderTitle: '✌️ বিজয় সময় (বিজয় মুহূর্ত)',
    subtitle: 'জয় ও সাফল্যের পরম শুভ সময়। নতুন কাজ, ব্যবসায়িক চুক্তি ও যাত্রার জন্য অত্যন্ত উপযুক্ত।',
    whatIsTitle: 'বিজয় মুহূর্ত কী?',
    whatIsText: 'বিজয় মুহূর্ত হলো দুপুরের পরের এক বিশেষ শুভ সময়, যা কার্যে সাফল্য লাভ ও বাধা দূরীকরণের জন্য বিখ্যাত।',
    meaningTitle: 'অর্থ',
    meaningPoints: [
      'বিজয় = জয় বা সাফল্য',
      'মুহূর্ত = ৪৮ মিনিটের শুভ সময়কাল'
    ],
    meaningSummary: 'একে "জয়ের সময়" বলা হয় কারণ এই সময়ে সূচিত কাজ সফলতা লাভ করে।',
    timingTitle: 'সময়কাল',
    timingPoints: [
      'বিকেল প্রায় ২:০০ থেকে ৩:০০টার মধ্যে',
      'স্থায়িত্ব প্রায় ৪৮ মিনিট',
      'সূর্যোদয় ও সূর্যাস্তের ওপর ভিত্তি করে পরিবর্তনশীল'
    ],
    whySpecialTitle: 'কেন এটি বিশেষ?',
    whySpecialPoints: [
      'শ্রী রামের বিজয় যাত্রার স্মৃতিবিজড়িত',
      'কাজের বাধা শান্ত করে',
      'আত্মবিশ্বাস বৃদ্ধি করে'
    ],
    bestActivitiesTitle: 'করণীয় কাজসমূহ',
    bestActivitiesItems: [
      'নতুন ব্যবসা বা প্রজেক্ট শুরু',
      'চুক্তিপত্রে স্বাক্ষর',
      'ভ্রমণ শুরু',
      'আইনি পদক্ষেপ গ্রহণ',
      'ইন্টারভিউ ও পরীক্ষা',
      'সম্পত্তি বা গাড়ি কেনা'
    ],
    quickFactTitle: 'তথ্যকথা',
    quickFactText: 'পৌরাণিক কাহিনী অনুযায়ী শ্রী রাম বিজয় মুহূর্তেই লঙ্কা জয়ের জন্য যাত্রা করেছিলেন।'
  },
  mr: {
    modalHeaderTitle: '✌️ विजय वेळ (विजय मुहूर्त)',
    subtitle: 'विजय आणि यशाची अत्यंत शुभ वेळ. नवीन व्यवसाय, करार, प्रवास आणि महत्त्वाच्या कामांसाठी उत्तम.',
    whatIsTitle: 'विजय मुहूर्त म्हणजे काय?',
    whatIsText: 'विजय मुहूर्त ही दुपारनंतर येणारी शुभ वेळ आहे, जी कार्यात यश व विजय मिळवून देण्यासाठी प्रसिद्ध आहे.',
    meaningTitle: 'अर्थ',
    meaningPoints: [
      'विजय = जीत किंवा यश',
      'मुहूर्त = ४८ मिनिटांचा काळ'
    ],
    meaningSummary: 'याला "यशाची वेळ" म्हणतात कारण या काळात सुरू केलेली कामे यशस्वी होतात.',
    timingTitle: 'वेळ',
    timingPoints: [
      'दुपारी २:०० ते ३:०० च्या दरम्यान',
      'कालावधी सुमारे ४८ मिनिटे',
      'दररोज सूर्योदयानुसार बदलते'
    ],
    whySpecialTitle: 'विशेष का आहे?',
    whySpecialPoints: [
      'प्रभू श्री रामचंद्रांच्या विजय प्रवासाशी जोडलेले',
      'अडचणींवर मात करते',
      'आत्मविश्वास वाढवते'
    ],
    bestActivitiesTitle: 'या वेळी काय करावे?',
    bestActivitiesItems: [
      'नवीन व्यवसाय सुरू करणे',
      'करार पक्का करणे',
      'प्रवासाची सुरुवात',
      'कायदेशीर कामे',
      'मुलाखत व परीक्षा',
      'गाडी किंवा मालमत्ता खरेदी'
    ],
    quickFactTitle: 'महत्त्वाची टीप',
    quickFactText: 'प्रभू श्री रामाने रावणावर विजय मिळवण्यासाठी विजय मुहूर्तावरच प्रस्थान केले होते.'
  },
  ru: {
    modalHeaderTitle: '✌️ Время Виджая (Виджая Мухурта)',
    subtitle: 'Благоприятный период победы и успеха. Идеально для запуска новых проектов, сделок и путешествий.',
    whatIsTitle: 'Что такое Виджая Мухурта?',
    whatIsText: 'Виджая Мухурта — это период во второй половине дня, традиционно ассоциирующийся с победой и преодолением препятствий.',
    meaningTitle: 'Значение',
    meaningPoints: [
      'Виджая = Победа или Триумф',
      'Мухурта = 48-минутный период'
    ],
    meaningSummary: 'Называется «Временем Победы», так как начатые дела преодолевают трудности.',
    timingTitle: 'Время',
    timingPoints: [
      'Днем (обычно с 14:00 до 15:00)',
      'Длится около 48 минут',
      'Меняется ежедневно по восходу солнца'
    ],
    whySpecialTitle: 'Почему оно особенное?',
    whySpecialPoints: [
      'Связано с победоносным походом Господа Рамы',
      'Уменьшает препятствия',
      'Увеличивает уверенность и фокус'
    ],
    bestActivitiesTitle: 'Лучшие занятия',
    bestActivitiesItems: [
      'Запуск новых проектов',
      'Подписание контрактов',
      'Начало путешествий',
      'Юридические дела',
      'Собеседования и экзамены',
      'Покупка недвижимости или авто'
    ],
    quickFactTitle: 'Быстрый факт',
    quickFactText: 'По преданию, Господь Рама отправился побеждать Равану именно в Виджая Мухурту.'
  },
  fr: {
    modalHeaderTitle: '✌️ Heure Vijaya (Vijaya Muhurat)',
    subtitle: 'La période victorieuse du succès. Idéale pour lancer de nouveaux projets, contrats, voyages et affaires juridiques.',
    whatIsTitle: 'Qu\'est-ce que Vijaya Muhurat ?',
    whatIsText: 'Vijaya Muhurat est une période favorable de l\'après-midi associée au succès et au triomphe sur les obstacles.',
    meaningTitle: 'Signification',
    meaningPoints: [
      'Vijaya = Victoire ou Triomphe',
      'Muhurat = Période de 48 minutes'
    ],
    meaningSummary: 'Appelée « Heure de la Victoire », les actions entreprises surmontent les obstacles.',
    timingTitle: 'Horaire',
    timingPoints: [
      'En après-midi (vers 14h00 - 15h00)',
      'Dure environ 48 minutes',
      'Varie quotidiennement selon le soleil'
    ],
    whySpecialTitle: 'Pourquoi est-ce spécial ?',
    whySpecialPoints: [
      'Associé à la marche victorieuse de Rama',
      'Réduit les obstacles',
      'Renforce la confiance et le succès'
    ],
    bestActivitiesTitle: 'Meilleures activités',
    bestActivitiesItems: [
      'Lancement de projets et entreprises',
      'Signature de contrats',
      'Début de voyages',
      'Affaires juridiques',
      'Entretiens et examens',
      'Achat de biens ou véhicules'
    ],
    quickFactTitle: 'Fait rapide',
    quickFactText: 'Le Seigneur Rama s\'est mis en route pour vaincre Ravana pendant Vijaya Muhurat.'
  },
  es: {
    modalHeaderTitle: '✌️ Hora Vijaya (Vijaya Muhurat)',
    subtitle: 'La ventana auspiciosa de la victoria y el éxito. Ideal para iniciar proyectos, contratos, viajes y trámites legales.',
    whatIsTitle: '¿Qué es Vijaya Muhurat?',
    whatIsText: 'Vijaya Muhurat es un período de la tarde favorable asociado con el triunfo y la superación de obstáculos.',
    meaningTitle: 'Significado',
    meaningPoints: [
      'Vijaya = Victoria o Triunfo',
      'Muhurat = Período de 48 minutos'
    ],
    meaningSummary: 'Llamada la "Hora de la Victoria", las tareas iniciadas logran superar las dificultades.',
    timingTitle: 'Horario',
    timingPoints: [
      'Por la tarde (aprox. 2:00 PM a 3:00 PM)',
      'Dura aproximadamente 48 minutos',
      'Varía diariamente según el sol'
    ],
    whySpecialTitle: '¿Por qué es especial?',
    whySpecialPoints: [
      'Asociado con la victoria del Señor Rama',
      'Reduce obstáculos',
      'Aumenta la confianza y la estrategia'
    ],
    bestActivitiesTitle: 'Mejores actividades',
    bestActivitiesItems: [
      'Lanzar un nuevo proyecto o negocio',
      'Firmar contratos importantes',
      'Iniciar viajes',
      'Trámites legales',
      'Exámenes y entrevistas',
      'Comprar propiedades o vehículos'
    ],
    quickFactTitle: 'Dato rápido',
    quickFactText: 'Según la tradición, el Señor Rama inició su marcha victoriosa durante Vijaya Muhurat.'
  },
  he: {
    modalHeaderTitle: '✌️ זמן ויג\'איה (ויג\'איה מוהורט)',
    subtitle: 'חלון זמן מבורך של ניצחון והצלחה. אידיאלי להשקת פרויקטים, עסקאות, נסיעות ועניינים משפטיים.',
    whatIsTitle: 'מהו ויג\'איה מוהורט?',
    whatIsText: 'ויג\'איה מוהורט הוא חלון זמן מבורך בשעות אחר הצהריים הקשור בניצחון והתגברות על מכשולים.',
    meaningTitle: 'משמעות',
    meaningPoints: [
      'ויג\'איה = ניצחון או הצלחה',
      'מוהורט = פרק זמן של 48 דקות'
    ],
    meaningSummary: 'נקרא "זמן הניצחון" כי משימות שמתחילות בזמן זה מתגברות על מכשולים.',
    timingTitle: 'זמנים',
    timingPoints: [
      'בשעות אחר הצהריים (סביב 14:00-15:00)',
      'נמשך כ-48 דקות',
      'משתנה מדי יום לפי הזריחה והשקיעה'
    ],
    whySpecialTitle: 'למה זה מיוחד?',
    whySpecialPoints: [
      'קשור במסע הניצחון של האל ראמה',
      'מפחית מכשולים',
      'מעצים ביטחון עצמי ומיקוד'
    ],
    bestActivitiesTitle: 'פעילויות מומלצות',
    bestActivitiesItems: [
      'השקת פרויקט או עסק חדש',
      'חתימה על חוזים ועסקאות',
      'יציאה לנסיעות וטיולים',
      'עניינים משפטיים',
      'ראיונות עבודה ובחינות',
      'רכישת נכסים או רכבים'
    ],
    quickFactTitle: 'עובדה מהירה',
    quickFactText: 'האמונה מספרת כי האל ראמה יצא לנצח את ראוואנה במהלך ויג\'איה מוהורט.'
  },
  id: {
    modalHeaderTitle: '✌️ Waktu Vijaya (Vijaya Muhurat)',
    subtitle: 'Waktu keberuntungan untuk kemenangan dan kesuksesan. Sangat baik untuk proyek baru, kesepakatan bisnis, dan perjalanan.',
    whatIsTitle: 'Apa itu Vijaya Muhurat?',
    whatIsText: 'Vijaya Muhurat adalah periode sore hari yang dikaitkan dengan kemenangan dan mengatasi rintangan.',
    meaningTitle: 'Arti Kata',
    meaningPoints: [
      'Vijaya = Kemenangan atau Kesuksesan',
      'Muhurat = Durasi waktu 48 menit'
    ],
    meaningSummary: 'Disebut "Waktu Kemenangan" karena usaha yang dimulai dapat mengatasi hambatan.',
    timingTitle: 'Waktu',
    timingPoints: [
      'Sore hari (sekitar 14.00 - 15.00)',
      'Berlangsung sekitar 48 menit',
      'Berubah setiap hari mengikuti matahari'
    ],
    whySpecialTitle: 'Mengapa Spesial?',
    whySpecialPoints: [
      'Dihubungkan dengan kemenangan Sri Rama',
      'Mengurangi rintangan',
      'Meningkatkan rasa percaya diri'
    ],
    bestActivitiesTitle: 'Aktivitas Terbaik',
    bestActivitiesItems: [
      'Memulai proyek atau bisnis baru',
      'Menandatangani kontrak bisnis',
      'Memulai perjalanan jauh',
      'Urusan hukum',
      'Wawancara kerja & ujian',
      'Membeli properti atau kendaraan'
    ],
    quickFactTitle: 'Fakta Singkat',
    quickFactText: 'Kisah klasik mencatat Sri Rama berangkat untuk menang dalam Vijaya Muhurat.'
  },
  th: {
    modalHeaderTitle: '✌️ เวลาวิชัย (ฤกษ์วิชัย)',
    subtitle: 'ช่วงเวลามงคลแห่งชัยชนะและความสำเร็จ เหมาะสำหรับการเปิดตัวโครงการใหม่ ข้อตกลงธุรกิจ การเดินทาง และเรื่องกฎหมาย',
    whatIsTitle: 'ฤกษ์วิชัยคืออะไร?',
    whatIsText: 'ฤกษ์วิชัย คือช่วงเวลาช่วงบ่ายอันทรงพลัง สื่อถึงชัยชนะและความสำเร็จในการเอาชนะอุปสรรคทั้งปวง',
    meaningTitle: 'ความหมาย',
    meaningPoints: [
      'วิชัย (Vijaya) = ชัยชนะ หรือ ความสำเร็จ',
      'ฤกษ์ (Muhurat) = ช่วงเวลา 48 นาที'
    ],
    meaningSummary: 'เรียกว่า "เวลาแห่งชัยชนะ" เพราะเชื่อว่าสิ่งที่เริ่มในช่วงเวลานี้จะข้ามพ้นอุปสรรคและประสบผลสำเร็จ',
    timingTitle: 'ช่วงเวลา',
    timingPoints: [
      'ช่วงบ่าย (ประมาณ 14:00 น. ถึง 15:00 น.)',
      'กินเวลาประมาณ 48 นาที',
      'เปลี่ยนแปลงทุกวันตามเวลาดวงอาทิตย์'
    ],
    whySpecialTitle: 'ทำไมจึงมีความพิเศษ?',
    whySpecialPoints: [
      'เชื่อมโยงกับชัยชนะของพระราม',
      'ขจัดอุปสรรคและข้อผิดพลาด',
      'เพิ่มความมั่นใจและการตัดสินใจ'
    ],
    bestActivitiesTitle: 'กิจกรรมที่เหมาะสม',
    bestActivitiesItems: [
      'เปิดตัวธุรกิจหรือโครงการใหม่',
      'เซ็นสัญญาข้อตกลงสำคัญ',
      'เริ่มออกเดินทางไกล',
      'ดำเนินการทางกฎหมาย',
      'สอบแข่งขันและสัมภาษณ์งาน',
      'ซื้ออสังหาริมทรัพย์หรือยานพาหนะ'
    ],
    quickFactTitle: 'เกร็ดน่ารู้',
    quickFactText: 'ตามตำนานเล่าว่าพระรามออกเดินทางไปปราบทศกัณฐ์ในฤกษ์วิชัยนี้'
  }
};
