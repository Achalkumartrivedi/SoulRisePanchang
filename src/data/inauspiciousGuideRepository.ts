import { LanguageCode } from '../types/language';

export interface InauspiciousGuideContent {
  modalHeaderTitle: string;
  subtitle: string;
  meaningTitle: string;
  meaningText: string;
  whyCalledTitle: string;
  whyCalledText: string;
  whyAvoidedTitle: string;
  whyAvoidedText: string;
  noteText: string;
}

// 1. RAHU KALAM GUIDE (13 Languages)
export const RAHU_GUIDE: Record<LanguageCode, InauspiciousGuideContent> = {
  hinglish: {
    modalHeaderTitle: '⚠️ Rahu Kalam',
    subtitle: 'Rahu ke samay mein naye shubh karya shuru karne se bachein.',
    meaningTitle: 'Meaning',
    meaningText: 'Rahu ka Samay (Rahu = Chhaya Grah, Kalam = Samay).',
    whyCalledTitle: 'Why is it called?',
    whyCalledText: 'Yeh samay Rahu grah ke prabhav wala mana jata hai.',
    whyAvoidedTitle: 'Why Avoided?',
    whyAvoidedText: 'Naye karya shuru karne par rukawat, vilamb ya bhram aane ki sambhavna rehti hai.',
    noteText: 'Niyamit (routine) karya dwara bina kisi rukawat ke jaari rakhe ja sakte hain.'
  },
  hi: {
    modalHeaderTitle: '⚠️ राहु काल',
    subtitle: 'राहु के समय में नए शुभ कार्य शुरू करने से बचें।',
    meaningTitle: 'अर्थ',
    meaningText: '"राहु का समय" (राहु = छाया ग्रह, काल = समय)।',
    whyCalledTitle: 'क्यों कहा जाता है?',
    whyCalledText: 'यह समय राहु ग्रह के प्रभाव वाला माना जाता है।',
    whyAvoidedTitle: 'क्यों टालते हैं?',
    whyAvoidedText: 'नए काम में रुकावट, विलंब या भ्रम आने की आशंका रहती है।',
    noteText: 'नियमित दैनिक कार्य सामान्य रूप से जारी रखे जा सकते हैं।'
  },
  en: {
    modalHeaderTitle: '⚠️ Rahu Kalam',
    subtitle: 'Avoid starting important new work during Rahu\'s time.',
    meaningTitle: 'Meaning',
    meaningText: '"Rahu\'s Time" (Rahu = shadow planet, Kalam = time).',
    whyCalledTitle: 'Why is it called?',
    whyCalledText: 'This period is traditionally believed to be ruled by Rahu.',
    whyAvoidedTitle: 'Why Avoided?',
    whyAvoidedText: 'New beginnings may face delays, confusion, or unexpected obstacles.',
    noteText: 'Routine daily activities and ongoing work may safely continue.'
  },
  ta: {
    modalHeaderTitle: '⚠️ ராகு காலம்',
    subtitle: 'ராகுவின் நேரத்தில் புதிய சுப காரியங்களைத் தொடங்க வேண்டாம்.',
    meaningTitle: 'பொருள்',
    meaningText: '"ராகுவின் நேரம்" (ராகு = நிழல் கிரகம், காலம் = நேரம்).',
    whyCalledTitle: 'ஏன் இந்த பெயர்?',
    whyCalledText: 'இந்த காலம் ராகுவின் ஆட்சியில் இருப்பதாக நம்பப்படுகிறது.',
    whyAvoidedTitle: 'ஏன் தவிர்க்கப்படுகிறது?',
    whyAvoidedText: 'புதிய தொடக்கங்களில் தடை அல்லது குழப்பம் ஏற்படலாம்.',
    noteText: 'வழக்கமான தினசரி பணிகளைத் தொடர்ந்து செய்யலாம்.'
  },
  te: {
    modalHeaderTitle: '⚠️ రాహు కాలం',
    subtitle: 'రాహు సమయంలో ముఖ్యమైన కొత్త పనులు ప్రారంభించవద్దు.',
    meaningTitle: 'అర్థం',
    meaningText: '"రాహువు యొక్క సమయం" (రాహువు = ఛాయా గ్రహం, కాలం = సమయం).',
    whyCalledTitle: 'ఎందుకు అంటారు?',
    whyCalledText: 'ఈ సమయం రాహువు ప్రభావంలో ఉంటుందని నమ్ముతారు.',
    whyAvoidedTitle: 'ఎందుకు వర్జిస్తారు?',
    whyAvoidedText: 'కొత్త పనులలో ఆటంకాలు లేదా జాప్యం కలగవచ్చు.',
    noteText: 'నిత్యకృత్య పనులను నిరభ్యంతరంగా కొనసాగించవచ్చు.'
  },
  bn: {
    modalHeaderTitle: '⚠️ রাহু কাল',
    subtitle: 'রাহুর সময়ে নতুন শুভ কাজ শুরু করা থেকে বিরত থাকুন।',
    meaningTitle: 'অর্থ',
    meaningText: '"রাহুর সময়" (রাহু = ছায়া গ্রহ, কাল = সময়)।',
    whyCalledTitle: 'কেন বলা হয়?',
    whyCalledText: 'এই সময়টি রাহুর প্রভাবে থাকে বলে ধরা হয়।',
    whyAvoidedTitle: 'কেন বর্জনীয়?',
    whyAvoidedText: 'নতুন কাজে বাধা, বিলম্ব বা বিভ্রান্তির আশঙ্কা থাকে।',
    noteText: 'দৈনন্দিন রুটিন কাজ স্বাভাবিকভাবে চালিয়ে যাওয়া যায়।'
  },
  mr: {
    modalHeaderTitle: '⚠️ राहु काल',
    subtitle: 'राहुच्या काळात नवीन शुभ कार्ये सुरू करणे टाळावे.',
    meaningTitle: 'अर्थ',
    meaningText: '"राहुचा काळ" (राहु = छाया ग्रह, काल = वेळ).',
    whyCalledTitle: 'का म्हणतात?',
    whyCalledText: 'हा काळ राहु ग्रहाच्या प्रभावाखाली मानला जातो.',
    whyAvoidedTitle: 'का टाळतात?',
    whyAvoidedText: 'नवीन कामात अडथळे किंवा विलंब होण्याची शक्यता असते.',
    noteText: 'नियमित दैनंदिन कामे चालू ठेवता येतात.'
  },
  ru: {
    modalHeaderTitle: '⚠️ Раху Калам',
    subtitle: 'Избегайте начала важных новых дел во время Раху.',
    meaningTitle: 'Значение',
    meaningText: '«Время Раху» (Раху = теневая планета, Калам = время).',
    whyCalledTitle: 'Почему так называется?',
    whyCalledText: 'Этот период традиционно считается находящимся под управлением Раху.',
    whyAvoidedTitle: 'Почему избегают?',
    whyAvoidedText: 'Новые начинания могут столкнуться с задержками и препятствиями.',
    noteText: 'Обычные повседневные дела можно продолжать.'
  },
  fr: {
    modalHeaderTitle: '⚠️ Rahu Kalam',
    subtitle: 'Évitez de commencer d\'importants nouveaux travaux pendant l\'heure de Rahu.',
    meaningTitle: 'Signification',
    meaningText: '« Heure de Rahu » (Rahu = planète ombre, Kalam = heure).',
    whyCalledTitle: 'Pourquoi ce nom ?',
    whyCalledText: 'Période considérée sous l\'influence de Rahu.',
    whyAvoidedTitle: 'Pourquoi l\'éviter ?',
    whyAvoidedText: 'Les nouveaux départs peuvent subir des retards ou obstacles.',
    noteText: 'Les activités quotidiennes normales peuvent continuer.'
  },
  es: {
    modalHeaderTitle: '⚠️ Rahu Kalam',
    subtitle: 'Evite comenzar trabajos nuevos e importantes durante el tiempo de Rahu.',
    meaningTitle: 'Significado',
    meaningText: '"Tiempo de Rahu" (Rahu = planeta sombra, Kalam = tiempo).',
    whyCalledTitle: '¿Por qué se llama así?',
    whyCalledText: 'Se cree que este período está regido por Rahu.',
    whyAvoidedTitle: '¿Por qué se evita?',
    whyAvoidedText: 'Los nuevos comienzos pueden sufrir retrasos u obstáculos.',
    noteText: 'Las tareas rutinarias pueden continuar con normalidad.'
  },
  he: {
    modalHeaderTitle: '⚠️ ראחו קאלם',
    subtitle: 'מומלץ להימנע מהתחלת עבודות חדשות וחשובות בזמן ראחו.',
    meaningTitle: 'משמעות',
    meaningText: '"זמנו של ראחו" (ראחו = כוכב הצל, קאלם = זמן).',
    whyCalledTitle: 'למה נקרא כך?',
    whyCalledText: 'תקופה זו נחשבת תחת השפעתו של ראחו.',
    whyAvoidedTitle: 'למה נמנעים?',
    whyAvoidedText: 'התחלות חדשות עלולות להיתקל בעיכובים ומכשולים.',
    noteText: 'ניתן להמשיך בפעילויות יומיות שגרתיות.'
  },
  id: {
    modalHeaderTitle: '⚠️ Rahu Kalam',
    subtitle: 'Hindari memulai pekerjaan baru yang penting selama waktu Rahu.',
    meaningTitle: 'Arti Kata',
    meaningText: '"Waktu Rahu" (Rahu = planet bayangan, Kalam = waktu).',
    whyCalledTitle: 'Mengapa dinamakan demikian?',
    whyCalledText: 'Periode ini dipercaya berada di bawah pengaruh Rahu.',
    whyAvoidedTitle: 'Mengapa dihindari?',
    whyAvoidedText: 'Awal baru dapat menghadapi penundaan atau rintangan.',
    noteText: 'Pekerjaan rutin harian tetap dapat dilanjutkan.'
  },
  th: {
    modalHeaderTitle: '⚠️ ราหูกาล (Rahu Kalam)',
    subtitle: 'ควรงดเว้นการเริ่มงานใหม่สำคัญในช่วงเวลาราหู',
    meaningTitle: 'ความหมาย',
    meaningText: '"เวลาราหู" (ราหู = ดาวเงา, กาล = เวลา)',
    whyCalledTitle: 'ทำไมจึงเรียกว่าอย่างนั้น?',
    whyCalledText: 'เชื่อว่าเป็นช่วงเวลาที่ราหูครอบงำ',
    whyAvoidedTitle: 'ทำไมจึงควรงดเว้น?',
    whyAvoidedText: 'การเริ่มต้นใหม่อาจพบเจอความล่าช้าหรืออุปสรรค',
    noteText: 'งานประจำวันทั่วไปสามารถดำเนินต่อไปได้ตามปกติ'
  }
};

// 2. YAMAGANDA KALAM GUIDE (13 Languages)
export const YAMAGANDA_GUIDE: Record<LanguageCode, InauspiciousGuideContent> = {
  hinglish: {
    modalHeaderTitle: '⚠️ Yamaganda Kalam',
    subtitle: 'Yatra aur naye karya shuru karne se bacha jata hai.',
    meaningTitle: 'Meaning',
    meaningText: 'Yama ka Samay (Yama = Mrityu ke Devta).',
    whyCalledTitle: 'Why is it called?',
    whyCalledText: 'Yeh samay parampara se Yama dev se juda mana jata hai.',
    whyAvoidedTitle: 'Why Avoided?',
    whyAvoidedText: 'Naye karya aur yatraon ke liye ashubh parinam la sakta hai.',
    noteText: 'Zaruri yatraon mein dev-smaran karke jana shreyaskar hota hai.'
  },
  hi: {
    modalHeaderTitle: '⚠️ यमगण्ड काल',
    subtitle: 'यात्रा और नए कार्य शुरू करने से बचा जाता है।',
    meaningTitle: 'अर्थ',
    meaningText: '"यम का समय" (यम = मृत्यु के देवता)।',
    whyCalledTitle: 'क्यों कहा जाता है?',
    whyCalledText: 'यह समय परंपरा से यम से जुड़ा माना जाता है।',
    whyAvoidedTitle: 'क्यों टालते हैं?',
    whyAvoidedText: 'नए काम और यात्रा के लिए अशुभ परिणाम ला सकता है।',
    noteText: 'विशेष परिस्थितियों में ईश्वर स्मरण कर यात्रा की जा सकती है।'
  },
  en: {
    modalHeaderTitle: '⚠️ Yamaganda Kalam',
    subtitle: 'Traditionally avoided for travel and new beginnings.',
    meaningTitle: 'Meaning',
    meaningText: '"Yama\'s Time" (Yama = Lord of Death).',
    whyCalledTitle: 'Why is it called?',
    whyCalledText: 'This period is traditionally linked with Yama.',
    whyAvoidedTitle: 'Why Avoided?',
    whyAvoidedText: 'It is believed to bring unfavorable outcomes for new ventures and journeys.',
    noteText: 'Routine tasks may be safely performed during this window.'
  },
  ta: {
    modalHeaderTitle: '⚠️ எமகண்டம் (Yamaganda Kalam)',
    subtitle: 'பயணம் மற்றும் புதிய தொடக்கங்களுக்கு தவிர்க்கப்படும் நேரம்.',
    meaningTitle: 'பொருள்',
    meaningText: '"எமனின் நேரம்" (எமன் = மரணத்தின் கடவுள்).',
    whyCalledTitle: 'ஏன் இந்த பெயர்?',
    whyCalledText: 'இது எமனுடன் தொடர்புடைய காலமாக கருதப்படுகிறது.',
    whyAvoidedTitle: 'ஏன் தவிர்க்கப்படுகிறது?',
    whyAvoidedText: 'புதிய முயற்சிகள் மற்றும் பயணங்களுக்கு நல்லதல்ல என்று நம்பப்படுகிறது.',
    noteText: 'அத்தியாவசிய தினசரி பணிகளைச் செய்யலாம்.'
  },
  te: {
    modalHeaderTitle: '⚠️ యమగండ కాలం',
    subtitle: 'ప్రయాణాలు మరియు కొత్త పనులు ప్రారంభించడానికి వర్జించే సమయం.',
    meaningTitle: 'అర్థం',
    meaningText: '"యముని సమయం" (యముడు = కాల దేవుడు).',
    whyCalledTitle: 'ఎందుకు అంటారు?',
    whyCalledText: 'ఈ సమయం యముని ప్రభావంతో కూడి ఉంటుందని నమ్ముతారు.',
    whyAvoidedTitle: 'ఎందుకు వర్జిస్తారు?',
    whyAvoidedText: 'కొత్త పనులు మరియు ప్రయాణాలకు అశుభ ఫలితాలు రావచ్చు.',
    noteText: 'సాధారణ పనులకు ఇబ్బంది ఉండదు.'
  },
  bn: {
    modalHeaderTitle: '⚠️ যমগণ্ড কাল',
    subtitle: 'ভ্রমণ এবং নতুন কাজ শুরুর জন্য বর্জনীয় সময়।',
    meaningTitle: 'অর্থ',
    meaningText: '"যমের সময়" (যম = মৃত্যুর দেবতা)।',
    whyCalledTitle: 'কেন বলা হয়?',
    whyCalledText: 'এই সময়টি ঐতিহ্যগতভাবে যমের সাথে যুক্ত।',
    whyAvoidedTitle: 'কেন বর্জনীয়?',
    whyAvoidedText: 'নতুন উদ্যোগ ও যাত্রার জন্য অশুভ ফল আনতে পারে।',
    noteText: 'সাধারণ কাজ চালিয়ে যাওয়া যেতে পারে।'
  },
  mr: {
    modalHeaderTitle: '⚠️ यमगंड काल',
    subtitle: 'प्रवास व नवीन कार्ये सुरू करणे टाळावे.',
    meaningTitle: 'अर्थ',
    meaningText: '"यमाचा काळ" (यम = मृत्यूचे दैवत).',
    whyCalledTitle: 'का म्हणतात?',
    whyCalledText: 'हा काळ यमाशी जोडलेला मानला जातो.',
    whyAvoidedTitle: 'का टाळतात?',
    whyAvoidedText: 'नवीन कामे व प्रवासासाठी अयोग्य मानला जातो.',
    noteText: 'दैनंदिन सामान्य कामांवर परिणाम होत नाही.'
  },
  ru: {
    modalHeaderTitle: '⚠️ Ямаганда Калам',
    subtitle: 'Традиционно избегают для путешествий и новых начинаний.',
    meaningTitle: 'Значение',
    meaningText: '«Время Ямы» (Яма = владыка времени/смерти).',
    whyCalledTitle: 'Почему так называется?',
    whyCalledText: 'Связано с энергией Ямы.',
    whyAvoidedTitle: 'Почему избегают?',
    whyAvoidedText: 'Считается неблагоприятным для поездок и новых стартов.',
    noteText: 'Обычные рутинные дела разрешены.'
  },
  fr: {
    modalHeaderTitle: '⚠️ Yamaganda Kalam',
    subtitle: 'Traditionnellement évité pour les voyages et les nouveaux départs.',
    meaningTitle: 'Signification',
    meaningText: '« Heure de Yama » (Yama = seigneur du temps/mort).',
    whyCalledTitle: 'Pourquoi ce nom ?',
    whyCalledText: 'Période liée à la tradition de Yama.',
    whyAvoidedTitle: 'Pourquoi l\'éviter ?',
    whyAvoidedText: 'Défavorable pour les voyages et lancements.',
    noteText: 'Les tâches courantes peuvent être effectuées.'
  },
  es: {
    modalHeaderTitle: '⚠️ Yamaganda Kalam',
    subtitle: 'Tradicionalmente evitado para viajes y nuevos comienzos.',
    meaningTitle: 'Significado',
    meaningText: '"Tiempo de Yama" (Yama = señor del tiempo/muerte).',
    whyCalledTitle: '¿Por qué se llama así?',
    whyCalledText: 'Vinculado tradicionalmente con Yama.',
    whyAvoidedTitle: '¿Por qué se evita?',
    whyAvoidedText: 'Desfavorable para viajes e iniciativas nuevas.',
    noteText: 'Las tareas diarias no se ven afectadas.'
  },
  he: {
    modalHeaderTitle: '⚠️ יאמאגאנדה קאלם',
    subtitle: 'נהוג להימנע מנסיעות ומהתחלות חדשות בזמן זה.',
    meaningTitle: 'משמעות',
    meaningText: '"זמנו של יאמה" (יאמה = שליט הזמן והמוות).',
    whyCalledTitle: 'למה נקרא כך?',
    whyCalledText: 'מקושש במסורת עם יאמה.',
    whyAvoidedTitle: 'למה נמנעים?',
    whyAvoidedText: 'נחשב ללא מומלץ למסעות ולפרויקטים חדשים.',
    noteText: 'משימות שגרתיות אינן מושפעות.'
  },
  id: {
    modalHeaderTitle: '⚠️ Yamaganda Kalam',
    subtitle: 'Secara tradisional dihindari untuk perjalanan dan awal baru.',
    meaningTitle: 'Arti Kata',
    meaningText: '"Waktu Yama" (Yama = Dewa Waktu/Kematian).',
    whyCalledTitle: 'Mengapa dinamakan demikian?',
    whyCalledText: 'Periode ini dihubungkan dengan Yama.',
    whyAvoidedTitle: 'Mengapa dihindari?',
    whyAvoidedText: 'Dianggap kurang baik untuk perjalanan dan usaha baru.',
    noteText: 'Tugas rutin biasa aman dilakukan.'
  },
  th: {
    modalHeaderTitle: '⚠️ ยมกาล (Yamaganda Kalam)',
    subtitle: 'หลีกเลี่ยงการเดินทางและการเริ่มต้นสิ่งใหม่ๆ',
    meaningTitle: 'ความหมาย',
    meaningText: '"เวลาแห่งพญายม"',
    whyCalledTitle: 'ทำไมจึงเรียกว่าอย่างนั้น?',
    whyCalledText: 'เชื่อว่ามีความเชื่อมโยงกับพญายม',
    whyAvoidedTitle: 'ทำไมจึงควรงดเว้น?',
    whyAvoidedText: 'ส่งผลไม่เอื้อต่อการเดินทางและการเริ่มต้นใหม่',
    noteText: 'ภารกิจประจำวันทั่วไปทำได้ตามปกติ'
  }
};

// 3. GULIKA KALAM GUIDE (13 Languages)
export const GULIKA_GUIDE: Record<LanguageCode, InauspiciousGuideContent> = {
  hinglish: {
    modalHeaderTitle: '⚠️ Gulika Kalam',
    subtitle: 'Shani se juda samay, naye shubh karyon mein savdhani rakhein.',
    meaningTitle: 'Meaning',
    meaningText: 'Gulika ka Samay (Gulika Shani grah se juda hai).',
    whyCalledTitle: 'Why is it called?',
    whyCalledText: 'Yeh samay Shani ke putra Gulika ke prabhav wala mana jata hai.',
    whyAvoidedTitle: 'Why Avoided?',
    whyAvoidedText: 'Is samay shuru kiye gaye karya mein dohrana (repetition) ya vilamb ho sakta hai.',
    noteText: 'Yeh Rahu Kalam se halka mana jata hai, par savdhani bhalai hai.'
  },
  hi: {
    modalHeaderTitle: '⚠️ गुलिक काल',
    subtitle: 'शनि से जुड़ा समय, नए शुभ कार्यों में सावधानी रखें।',
    meaningTitle: 'अर्थ',
    meaningText: '"गुलिक का समय" (गुलिक शनि ग्रह से संबंधित है)।',
    whyCalledTitle: 'क्यों कहा जाता है?',
    whyCalledText: 'यह समय शनि से जुड़े गुलिक के प्रभाव वाला माना जाता है।',
    whyAvoidedTitle: 'क्यों टालते हैं?',
    whyAvoidedText: 'नए काम में देरी या बार-बार प्रयास करना पड़ सकता है।',
    noteText: 'इसका प्रभाव राहु काल से धीमा और सौम्य होता है।'
  },
  en: {
    modalHeaderTitle: '⚠️ Gulika Kalam',
    subtitle: 'A Saturn-linked period with mixed but cautious influence.',
    meaningTitle: 'Meaning',
    meaningText: '"Gulika\'s Time" (Gulika is associated with Saturn).',
    whyCalledTitle: 'Why is it called?',
    whyCalledText: 'This period is believed to be influenced by Gulika (son of Saturn).',
    whyAvoidedTitle: 'Why Avoided?',
    whyAvoidedText: 'Tasks started now may face delays or require repeated effort.',
    noteText: 'Its impact is generally considered milder than Rahu Kalam.'
  },
  ta: {
    modalHeaderTitle: '⚠️ குளிகை காலம் (Gulika Kalam)',
    subtitle: 'சனியுடன் தொடர்புடைய நேரம்; புதிய தொடக்கங்களில் எச்சரிக்கை.',
    meaningTitle: 'பொருள்',
    meaningText: '"குளிகையின் நேரம்" (குளிகை சனியுடன் தொடர்புடையது).',
    whyCalledTitle: 'ஏன் இந்த பெயர்?',
    whyCalledText: 'இது சனியுடன் தொடர்புடைய குளிகையின் காலமாக கருதப்படுகிறது.',
    whyAvoidedTitle: 'ஏன் தவிர்க்கப்படுகிறது?',
    whyAvoidedText: 'புதிய வேலைகளில் தாமதம் அல்லது மீண்டும் முயற்சி தேவைப்படலாம்.',
    noteText: 'இதன் தாக்கம் ராகு காலத்தை விடக் குறைவானது.'
  },
  te: {
    modalHeaderTitle: '⚠️ గుళిక కాలం',
    subtitle: 'శని సంబంధిత సమయం; కొత్త పనులలో జాగ్రత్త అవసరం.',
    meaningTitle: 'అర్థం',
    meaningText: '"గుళిక సమయం" (గుళిక శని గ్రహ సంబంధితం).',
    whyCalledTitle: 'ఎందుకు అంటారు?',
    whyCalledText: 'ఈ సమయం శని పుత్రుడైన గుళిక ప్రభావంలో ఉంటుంది.',
    whyAvoidedTitle: 'ఎందుకు వర్జిస్తారు?',
    whyAvoidedText: 'పనులలో ఆలస్యం లేదా మళ్లీ మళ్లీ చేయవలసి రావచ్చు.',
    noteText: 'దీని ప్రభావం రాహు కాలం కంటే తక్కువగా ఉంటుంది.'
  },
  bn: {
    modalHeaderTitle: '⚠️ গুলিক কাল',
    subtitle: 'শনির সাথে যুক্ত সময়, নতুন কাজে সতর্কতা প্রয়োজন।',
    meaningTitle: 'অর্থ',
    meaningText: '"গুলিকের সময়" (গুলিক শনির সাথে যুক্ত)।',
    whyCalledTitle: 'কেন বলা হয়?',
    whyCalledText: 'এই সময়টি গুলিকের প্রভাবে থাকে।',
    whyAvoidedTitle: 'কেন বর্জনীয়?',
    whyAvoidedText: 'কাজে বিলম্ব বা পুনরাবৃত্তির প্রয়োজন হতে পারে।',
    noteText: 'এর প্রভাব রাহু কালের চেয়ে কম।'
  },
  mr: {
    modalHeaderTitle: '⚠️ गुलिक काल',
    subtitle: 'शनीशी जोडलेली वेळ, नवीन कामात काळजी घ्यावी.',
    meaningTitle: 'अर्थ',
    meaningText: '"गुलिकचा काळ" (गुलिक शनीशी संबंधित आहे).',
    whyCalledTitle: 'का म्हणतात?',
    whyCalledText: 'हा काळ शनीशी जोडलेल्या गुलिकच्या प्रभावाखाली असतो.',
    whyAvoidedTitle: 'का टाळतात?',
    whyAvoidedText: 'कामात विलंब किंवा पुन्हा पुन्हा प्रयत्न करावे लागतात.',
    noteText: 'राहु काळापेक्षा याचा प्रभाव सौम्य मानला जातो.'
  },
  ru: {
    modalHeaderTitle: '⚠️ Гулика Калам',
    subtitle: 'Период, связанный с Сатурном. Требуется осторожность в новых делах.',
    meaningTitle: 'Значение',
    meaningText: '«Время Гулики» (Гулика связан с Сатурном).',
    whyCalledTitle: 'Почему так называется?',
    whyCalledText: 'Считается находящимся под влиянием Гулики.',
    whyAvoidedTitle: 'Почему избегают?',
    whyAvoidedText: 'Дела могут потребовать повторных усилий или задерживаться.',
    noteText: 'Влияние мягче, чем у Раху Калам.'
  },
  fr: {
    modalHeaderTitle: '⚠️ Gulika Kalam',
    subtitle: 'Période liée à Saturne. Prudence recommandée pour les nouvelles tâches.',
    meaningTitle: 'Signification',
    meaningText: '« Heure de Gulika » (Gulika est lié à Saturne).',
    whyCalledTitle: 'Pourquoi ce nom ?',
    whyCalledText: 'Influencé par Gulika (fils de Saturne).',
    whyAvoidedTitle: 'Pourquoi l\'éviter ?',
    whyAvoidedText: 'Les tâches peuvent nécessiter des efforts répétés.',
    noteText: 'Impact plus doux que Rahu Kalam.'
  },
  es: {
    modalHeaderTitle: '⚠️ Gulika Kalam',
    subtitle: 'Período vinculado a Saturno. Se recomienda precaución en tareas nuevas.',
    meaningTitle: 'Significado',
    meaningText: '"Tiempo de Gulika" (Gulika está asociado con Saturno).',
    whyCalledTitle: '¿Por qué se llama así?',
    whyCalledText: 'Influenciado por Gulika (hijo de Saturno).',
    whyAvoidedTitle: '¿Por qué se evita?',
    whyAvoidedText: 'Las tareas pueden sufrir retrasos o repetición.',
    noteText: 'Su impacto es más suave que el de Rahu Kalam.'
  },
  he: {
    modalHeaderTitle: '⚠️ גוליקה קאלם',
    subtitle: 'זמן הקשור לשבתאי; מומלצת זהירות בהתחלות חדשות.',
    meaningTitle: 'משמעות',
    meaningText: '"זמנה של גוליקה" (גוליקה קשורה לשבתאי).',
    whyCalledTitle: 'למה נקרא כך?',
    whyCalledText: 'מושפע מחרבות גוליקה.',
    whyAvoidedTitle: 'למה נמנעים?',
    whyAvoidedText: 'משימות עלולות להידחות או לדרוש מאמץ חוזר.',
    noteText: 'השפעתו קלה יותר מזו של ראחו קאלם.'
  },
  id: {
    modalHeaderTitle: '⚠️ Gulika Kalam',
    subtitle: 'Periode terkait Saturnus; berhati-hatilah pada awal baru.',
    meaningTitle: 'Arti Kata',
    meaningText: '"Waktu Gulika" (Gulika terkait dengan Saturnus).',
    whyCalledTitle: 'Mengapa dinamakan demikian?',
    whyCalledText: 'Dipengaruhi oleh Gulika (putra Saturnus).',
    whyAvoidedTitle: 'Mengapa dihindari?',
    whyAvoidedText: 'Tugas yang dimulai mungkin memerlukan usaha berulang.',
    noteText: 'Dampaknya lebih ringan daripada Rahu Kalam.'
  },
  th: {
    modalHeaderTitle: '⚠️ กุลิกกาล (Gulika Kalam)',
    subtitle: 'ช่วงเวลาที่เชื่อมโยงกับดาวเสาร์ ควรระมัดระวังในการเริ่มงานใหม่',
    meaningTitle: 'ความหมาย',
    meaningText: '"เวลากุลิกะ" (เกี่ยวข้องกับดาวเสาร์)',
    whyCalledTitle: 'ทำไมจึงเรียกว่าอย่างนั้น?',
    whyCalledText: 'เชื่อว่าได้รับอิทธิพลจากกุลิกะ',
    whyAvoidedTitle: 'ทำไมจึงควรงดเว้น?',
    whyAvoidedText: 'งานใหม่อาจพบความล่าช้าหรือต้องทำซ้ำ',
    noteText: 'ผลกระทบเบาบางกว่าราหูกาล'
  }
};
