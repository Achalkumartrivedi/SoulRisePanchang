import { LanguageCode } from '../types/language';

export interface MuhuratNameTranslation {
  en: string;
  hi: string;
  gu?: string;
  mr?: string;
  ta?: string;
  te?: string;
  bn?: string;
}

export const MUHURAT_NAMES_MAP: Record<string, MuhuratNameTranslation> = {
  abhijit: {
    en: 'Abhijit Muhurat',
    hi: 'अभिजित मुहूर्त',
    gu: 'અભિજીત મુહૂર્ત',
    mr: 'अभिजित मुहूर्त',
    ta: 'அபிஜித் முகூர்த்தம்',
    te: 'అభిజిత్ ముహుర్తం',
    bn: 'অভিজিৎ মুহূর্ত',
  },
  brahma: {
    en: 'Brahma Muhurat',
    hi: 'ब्रह्म मुहूर्त',
    gu: 'બ્રહ્મ મુહૂર્ત',
    mr: 'ब्रह्म मुहूर्त',
    ta: 'பிரம்ம முகூர்த்தம்',
    te: 'బ్రహ్మ ముహుర్తం',
    bn: 'ব্রহ্ম মুহূর্ত',
  },
  pratah: {
    en: 'Pratah Sandhya',
    hi: 'प्रातः सन्ध्या',
    gu: 'પ્રાતઃ સંધ્યા',
    mr: 'प्रातः संध्या',
    ta: 'பிராத சந்தியா',
    te: 'ప్రాతః సంధ్య',
    bn: 'প্রাতঃ সন্ধ্যা',
  },
  vijay: {
    en: 'Vijaya Muhurat',
    hi: 'विजय मुहूर्त',
    gu: 'વિજય મુહૂર્ત',
    mr: 'विजय मुहूर्त',
    ta: 'விஜய முகூர்த்தம்',
    te: 'విజయ ముహుర్తం',
    bn: 'বিজয় মুহূর্ত',
  },
  godhuli: {
    en: 'Godhuli Muhurat',
    hi: 'गोधूलि मुहूर्त',
    gu: 'ગોધૂલિ મુહૂર્ત',
    mr: 'गोधूली मुहूर्त',
    ta: 'கோதூளி முகூர்த்தம்',
    te: 'గోధూళి ముహుర్తం',
    bn: 'গোধূলি মুহূর্ত',
  },
  sayahna: {
    en: 'Sayahna Sandhya',
    hi: 'सायाह्न सन्ध्या',
    gu: 'સાયાહ્ન સંધ્યા',
    mr: 'सायाह्न संध्या',
    ta: 'சாயாஹன சந்தியா',
    te: 'సాయాహ్న సంధ్య',
    bn: 'সায়াহ্ন সন্ধ্যা',
  },
  amrit: {
    en: 'Amrit Kaal',
    hi: 'अमृत काल',
    gu: 'અમૃત કાળ',
    mr: 'अमृत काल',
    ta: 'அமிர்த காலம்',
    te: 'అమృత కాలం',
    bn: 'অমৃত কাল',
  },
  nishita: {
    en: 'Nishita Muhurat',
    hi: 'निशीथ मुहूर्त',
    gu: 'નિશીથ મુહૂર્ત',
    mr: 'निशीथ मुहूर्त',
    ta: 'நிசீத முகூர்த்தம்',
    te: 'నిశీథ ముహుర్తం',
    bn: 'নিশীথ মুহূর্ত',
  },
  rahu: {
    en: 'Rahu Kaal',
    hi: 'राहु काल',
    gu: 'રાહુ કાળ',
    mr: 'राहु काल',
    ta: 'ராகு காலம்',
    te: 'రాహు కాలం',
    bn: 'রাহু কাল',
  },
  yama: {
    en: 'Yamaganda Kaal',
    hi: 'यमगण्ड काल',
    gu: 'યમગંડ કાળ',
    mr: 'यमगंड काल',
    ta: 'எமகண்டம்',
    te: 'యమగండ కాలం',
    bn: 'যমগণ্ড কাল',
  },
  gulika: {
    en: 'Gulika Kaal',
    hi: 'गुलिक काल',
    gu: 'ગુલિક કાળ',
    mr: 'गुलिक काल',
    ta: 'குளிகை காலம்',
    te: 'గుళిక కాలం',
    bn: 'গুলিক কাল',
  },
  dur: {
    en: 'Dur Muhurat',
    hi: 'दुर्मुहूर्त',
    gu: 'દુર્મુહૂર્ત',
    mr: 'दुर्मुहूर्त',
    ta: 'துர்முகூர்த்தம்',
    te: 'దుర్ముహుర్తం',
    bn: 'দুরমুহূর্ত',
  },
  varjyam: {
    en: 'Varjyam',
    hi: 'वर्ज्य काल',
    gu: 'વર્જ્ય કાળ',
    mr: 'वर्ज्य काल',
    ta: 'வர்ஜ்யம்',
    te: 'వర్జ్యం',
    bn: 'বর্জ্য কাল',
  },
  bhadra: {
    en: 'Bhadra (Vishti)',
    hi: 'भद्रा काल',
    gu: 'ભદ્રા કાળ',
    mr: 'ભદ્રા કાળ',
    ta: 'பத்ரா',
    te: 'భద్రా కాలం',
    bn: 'ভদ্রা কাল',
  },
};

export function getLocalizedMuhuratDisplayName(
  rawName: string,
  rawHindiName: string | undefined,
  language: LanguageCode | string
): string {
  const lower = rawName.toLowerCase();
  let key = '';
  if (lower.includes('abhijit')) key = 'abhijit';
  else if (lower.includes('brahma')) key = 'brahma';
  else if (lower.includes('pratah')) key = 'pratah';
  else if (lower.includes('vijay')) key = 'vijay';
  else if (lower.includes('godhuli')) key = 'godhuli';
  else if (lower.includes('sayahna')) key = 'sayahna';
  else if (lower.includes('amrit')) key = 'amrit';
  else if (lower.includes('nishita')) key = 'nishita';
  else if (lower.includes('rahu')) key = 'rahu';
  else if (lower.includes('yama')) key = 'yama';
  else if (lower.includes('gulika')) key = 'gulika';
  else if (lower.includes('dur')) key = 'dur';
  else if (lower.includes('varjyam')) key = 'varjyam';
  else if (lower.includes('bhadra')) key = 'bhadra';

  const entry = key ? MUHURAT_NAMES_MAP[key] : null;

  // STRICT RULE:
  // If Hinglish -> DUAL English & Hindi (e.g. "Abhijit Muhurat • अभिजित मुहूर्त")
  // If Hindi -> ONLY Hindi (e.g. "अभिजित मुहूर्त")
  // If English -> ONLY English (e.g. "Abhijit Muhurat")
  // If other language -> ONLY that language (or Hindi/English fallback without dual)
  if (language === 'hinglish') {
    if (entry) {
      return `${entry.en} • ${entry.hi}`;
    }
    return rawHindiName ? `${rawName} • ${rawHindiName}` : rawName;
  }

  if (language === 'hi') {
    return entry?.hi || rawHindiName || rawName;
  }

  if (language === 'en') {
    return entry?.en || rawName;
  }

  // Other regional languages (Gujarati, Marathi, Tamil, etc.)
  if (entry && (entry as any)[language]) {
    return (entry as any)[language];
  }

  // Fallback for foreign languages: just English, no dual
  return entry?.en || rawName;
}

export interface KaalMuhuratLabels {
  headerTitle: string;
  allTimingsLink: string;
  prevDay: string;
  nextDay: string;
  today: string;
  goToToday: string;
  tabAll: string;
  tabShubh: string;
  tabKaal: string;
  badgeLiveShubh: string;
  badgeLiveKaal: string;
  badgePassed: string;
  badgeUpcoming: string;
  endsIn: string;
  startsIn: string;
  elapsed: string;
  durationLabel: string;
  tapDetails: string;
  choghadiyaTitle: string;
  choghadiyaSubOpen: string;
  choghadiyaSubClosed: string;
  choghadiyaDayTitle: string;
  choghadiyaNightTitle: string;
  modalTimingLabel: string;
  modalRecommended: string;
  modalAvoid: string;
  modalVedicTip: string;
  modalDoneBtn: string;
  minsUnit: string;
  shubhTag: string;
  ashubhTag: string;
}

export function getKaalMuhuratLabels(language: LanguageCode | string): KaalMuhuratLabels {
  if (language === 'hinglish') {
    return {
      headerTitle: 'Kaal & Muhurat',
      allTimingsLink: 'ALL TIMINGS →',
      prevDay: 'Prev Day',
      nextDay: 'Next Day',
      today: 'Today',
      goToToday: 'Go to Today',
      tabAll: 'All',
      tabShubh: '✨ Shubh',
      tabKaal: '⚠️ Kaal',
      badgeLiveShubh: 'LIVE NOW',
      badgeLiveKaal: 'LIVE NOW',
      badgePassed: 'PASSED',
      badgeUpcoming: 'UPCOMING',
      endsIn: 'Ends in',
      startsIn: 'Starts in',
      elapsed: 'Elapsed',
      durationLabel: 'Duration:',
      tapDetails: 'Tap for Details ℹ️',
      choghadiyaTitle: 'Day & Night Choghadiya',
      choghadiyaSubOpen: 'Hide 16 Muhurats',
      choghadiyaSubClosed: 'Tap to view 16 Choghadiya Muhurats',
      choghadiyaDayTitle: '☀️ DAY CHOGHADIYA',
      choghadiyaNightTitle: '🌙 NIGHT CHOGHADIYA',
      modalTimingLabel: 'Calculated Timing for Selected Date',
      modalRecommended: '✅ Recommended Activities',
      modalAvoid: '⚠️ What to Avoid',
      modalVedicTip: 'Vedic Wisdom & Remedies',
      modalDoneBtn: 'Understood',
      minsUnit: 'mins',
      shubhTag: 'Shubh',
      ashubhTag: 'Ashubh',
    };
  }

  if (language === 'hi') {
    return {
      headerTitle: 'काल एवं मुहूर्त',
      allTimingsLink: 'सभी समय →',
      prevDay: 'पिछला दिन',
      nextDay: 'अगला दिन',
      today: 'आज',
      goToToday: 'आज पर जाएं',
      tabAll: 'सभी',
      tabShubh: '✨ शुभ मुहूर्त',
      tabKaal: '⚠️ अशुभ काल',
      badgeLiveShubh: 'सक्रिय शुभ काल',
      badgeLiveKaal: 'सक्रिय अशुभ काल',
      badgePassed: 'समाप्त',
      badgeUpcoming: 'आगामी',
      endsIn: 'समाप्ति में',
      startsIn: 'शुरू होने में',
      elapsed: 'बीत चुका',
      durationLabel: 'अवधि:',
      tapDetails: 'विवरण देखें ℹ️',
      choghadiyaTitle: 'दिन एवं रात्रि चौघड़िया',
      choghadiyaSubOpen: 'चौघड़िया तालिका छिपाएं',
      choghadiyaSubClosed: 'संपूर्ण चौघड़िया तालिका देखें',
      choghadiyaDayTitle: '☀️ दिन का चौघड़िया',
      choghadiyaNightTitle: '🌙 रात्रि का चौघड़िया',
      modalTimingLabel: 'चुनी गई तिथि का सटीक समय',
      modalRecommended: '✅ अनुशंसित शुभ कार्य',
      modalAvoid: '⚠️ वर्जित कार्य एवं सावधानियां',
      modalVedicTip: 'वैदिक ज्ञान एवं उपाय',
      modalDoneBtn: 'समझ गया',
      minsUnit: 'मिनट',
      shubhTag: 'शुभ',
      ashubhTag: 'अशुभ',
    };
  }

  if (language === 'gu') {
    return {
      headerTitle: 'કાળ અને મુહૂર્ત',
      allTimingsLink: 'બધા સમય →',
      prevDay: 'પાછલો દિવસ',
      nextDay: 'આગલો દિવસ',
      today: 'આજે',
      goToToday: 'આજ પર જાઓ',
      tabAll: 'બધા',
      tabShubh: '✨ શુભ મુહૂર્ત',
      tabKaal: '⚠️ અશુભ કાળ',
      badgeLiveShubh: 'ચાલુ શુભ મુહૂર્ત',
      badgeLiveKaal: 'ચાલુ અશુભ કાળ',
      badgePassed: 'સમાપ્ત',
      badgeUpcoming: 'આગામી',
      endsIn: 'બાકી સમય',
      startsIn: 'શરૂ થવામાં',
      elapsed: 'વીતી ગયેલ',
      durationLabel: 'સમયગાળો:',
      tapDetails: 'વિગત જુઓ ℹ️',
      choghadiyaTitle: 'દિવસ અને રાત્રિ ચોઘડિયાં',
      choghadiyaSubOpen: 'ચોઘડિયાં છુપાવો',
      choghadiyaSubClosed: 'સંપૂર્ણ ચોઘડિયાં જુઓ',
      choghadiyaDayTitle: '☀️ દિવસના ચોઘડિયાં',
      choghadiyaNightTitle: '🌙 રાત્રિના ચોઘડિયાં',
      modalTimingLabel: 'પસંદ કરેલ તારીખનો ચોક્કસ સમય',
      modalRecommended: '✅ શુભ કાર્યો',
      modalAvoid: '⚠️ વર્જ્ય કાર્યો',
      modalVedicTip: 'વૈદિક જ્ઞાન અને ઉપાય',
      modalDoneBtn: 'સમજાયું',
      minsUnit: 'મિનિટ',
      shubhTag: 'શુભ',
      ashubhTag: 'અશુભ',
    };
  }

  if (language === 'mr') {
    return {
      headerTitle: 'काल आणि मुहूर्त',
      allTimingsLink: 'सर्व वेळ →',
      prevDay: 'मागील दिवस',
      nextDay: 'पुढील दिवस',
      today: 'आज',
      goToToday: 'आजवर जा',
      tabAll: 'सर्व',
      tabShubh: '✨ शुभ मुहूर्त',
      tabKaal: '⚠️ अशुभ काल',
      badgeLiveShubh: 'सुरू शुभ काळ',
      badgeLiveKaal: 'सुरू अशुभ काळ',
      badgePassed: 'समाप्त',
      badgeUpcoming: 'आगामी',
      endsIn: 'उर्वरित वेळ',
      startsIn: 'सुरू होण्यास',
      elapsed: 'झालेली वेळ',
      durationLabel: 'कालावधी:',
      tapDetails: 'तपशील पहा ℹ️',
      choghadiyaTitle: 'दिवस आणि रात्र चौघडिया',
      choghadiyaSubOpen: 'चौघडिया लपवा',
      choghadiyaSubClosed: 'पूर्ण चौघडिया पहा',
      choghadiyaDayTitle: '☀️ दिवसाचे चौघडिया',
      choghadiyaNightTitle: '🌙 रात्रीचे चौघडिया',
      modalTimingLabel: 'निवडलेल्या तारखेची अचूक वेळ',
      modalRecommended: '✅ शिफारस केलेले कार्य',
      modalAvoid: '⚠️ टाळावयाचे कार्य',
      modalVedicTip: 'वैदिक ज्ञान आणि उपाय',
      modalDoneBtn: 'समजले',
      minsUnit: 'मिनिटे',
      shubhTag: 'शुभ',
      ashubhTag: 'अशुभ',
    };
  }

  // Default English (strictly single language)
  return {
    headerTitle: 'Kaal & Muhurat',
    allTimingsLink: 'ALL TIMINGS →',
    prevDay: 'Prev Day',
    nextDay: 'Next Day',
    today: 'Today',
    goToToday: 'Go to Today',
    tabAll: 'All',
    tabShubh: '✨ Auspicious',
    tabKaal: '⚠️ Inauspicious',
    badgeLiveShubh: 'LIVE NOW • AUSPICIOUS',
    badgeLiveKaal: 'LIVE NOW • INAUSPICIOUS',
    badgePassed: 'PASSED',
    badgeUpcoming: 'UPCOMING',
    endsIn: 'Ends in',
    startsIn: 'Starts in',
    elapsed: 'Elapsed',
    durationLabel: 'Duration:',
    tapDetails: 'Tap for Details ℹ️',
    choghadiyaTitle: 'Day & Night Choghadiya Timings',
    choghadiyaSubOpen: 'Hide 16 Muhurats',
    choghadiyaSubClosed: 'Tap to expand full Choghadiya table',
    choghadiyaDayTitle: '☀️ DAY CHOGHADIYA',
    choghadiyaNightTitle: '🌙 NIGHT CHOGHADIYA',
    modalTimingLabel: 'Calculated Timing for Selected Date',
    modalRecommended: '✅ Recommended Activities',
    modalAvoid: '⚠️ What to Avoid',
    modalVedicTip: 'Vedic Wisdom & Remedies',
    modalDoneBtn: 'Understood',
    minsUnit: 'mins',
    shubhTag: 'Auspicious',
    ashubhTag: 'Inauspicious',
  };
}

export function getLocalizedChoghadiyaName(
  name: string,
  hindiName: string,
  language: LanguageCode | string
): string {
  if (language === 'hinglish') {
    return `${name} (${hindiName})`;
  }
  if (language === 'hi') {
    return hindiName || name;
  }
  if (language === 'gu') {
    const guMap: Record<string, string> = {
      Amrit: 'અમૃત',
      Shubh: 'શુભ',
      Labh: 'લાભ',
      Char: 'ચલ',
      Rog: 'રોગ',
      Kaal: 'કાળ',
      Udveg: 'ઉદ્વેગ',
    };
    return guMap[name] || hindiName || name;
  }
  if (language === 'mr') {
    const mrMap: Record<string, string> = {
      Amrit: 'अमृत',
      Shubh: 'शुभ',
      Labh: 'लाभ',
      Char: 'चल',
      Rog: 'रोग',
      Kaal: 'काळ',
      Udveg: 'उद्वेग',
    };
    return mrMap[name] || hindiName || name;
  }
  return name;
}

export function getLocalizedDateTitle(
  dateObj: Date,
  language: LanguageCode | string,
  shortFormat: boolean = false
): string {
  const day = dateObj.getDate();
  const monthIdx = dateObj.getMonth();
  const dayIdx = dateObj.getDay();
  const year = dateObj.getFullYear();

  const hiWeekdays = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const hiMonths = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];

  const guWeekdays = ['રવિવાર', 'સોમવાર', 'મંગળવાર', 'બુધવાર', 'ગુરુવાર', 'શુક્રવાર', 'શનિવાર'];
  const guMonths = ['જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન', 'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'];

  const mrWeekdays = ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const mrMonths = ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'];

  const enWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const enWeekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const enMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const enMonthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (language === 'hinglish') {
    const w = shortFormat ? enWeekdaysShort[dayIdx] : enWeekdays[dayIdx];
    const m = shortFormat ? enMonthsShort[monthIdx] : enMonths[monthIdx];
    return `${w}, ${day} ${m} ${year}`;
  }

  if (language === 'hi') {
    const w = shortFormat ? hiWeekdays[dayIdx].slice(0, 4) : hiWeekdays[dayIdx];
    const m = shortFormat ? hiMonths[monthIdx].slice(0, 3) : hiMonths[monthIdx];
    return `${w}, ${day} ${m} ${year}`;
  }

  if (language === 'gu') {
    return `${guWeekdays[dayIdx]}, ${day} ${guMonths[monthIdx]} ${year}`;
  }

  if (language === 'mr') {
    return `${mrWeekdays[dayIdx]}, ${day} ${mrMonths[monthIdx]} ${year}`;
  }

  // English
  const w = shortFormat ? enWeekdaysShort[dayIdx] : enWeekdays[dayIdx];
  const m = shortFormat ? enMonthsShort[monthIdx] : enMonths[monthIdx];
  return `${w}, ${day} ${m} ${year}`;
}

export function getLocalizedMuhuratDescription(
  rawName: string,
  fallbackDesc: string,
  language: LanguageCode | string,
  isWednesday: boolean = false
): string {
  const lower = rawName.toLowerCase();

  const DESCRIPTIONS: Record<string, { hi: string; hinglish: string; en: string }> = {
    abhijit: {
      hi: isWednesday
        ? 'मध्याह्न का पावन समय। ध्यान दें: ज्योतिष में बुधवार को राहु काल योग के कारण इसे वर्जित माना जाता है।'
        : 'सभी मुख्य कार्यों, नए व्यापार एवं मांगलिक अनुष्ठानों के लिए सर्वाधिक शुभ एवं शक्तिशाली मुहूर्त।',
      hinglish: isWednesday
        ? 'Dopahar ka shubh samay. Budhwar ko Rahu Kaal overlap ke karan ise avoid kiya jata hai.'
        : 'Sabhi naye business deals, manglik karya aur ceremonies ke liye most powerful shubh window.',
      en: isWednesday
        ? 'Most sacred midday window. Note: In traditional Jyotish, avoided on Wednesdays due to Rahu Kaal overlap.'
        : 'Most sacred and powerful auspicious window for all major endeavors, new ventures, and ceremonies.',
    },
    brahma: {
      hi: 'ध्यान, पूजा-अर्चना, आध्यात्मिक स्वाध्याय, योग एवं मानसिक शांति हेतु सर्वोत्तम समय।',
      hinglish: 'Meditation, puja, spiritual study aur yoga ke liye best sacred time.',
      en: 'Ideal sacred window for meditation, prayer, spiritual study, yoga, and mental clarity.',
    },
    pratah: {
      hi: 'गायत्री मंत्र जप, सूर्य अर्घ्य एवं आध्यात्मिक नवचेतना को समर्पित प्रातःकालीन पुण्य बेला।',
      hinglish: 'Gayatri mantra japa aur Surya arghya ke liye pratahkaal ka pavitra samay.',
      en: 'Morning twilight period dedicated to Gayatri mantra japa, solar oblations, and spiritual renewal.',
    },
    vijay: {
      hi: 'नए कार्य आरंभ, अनुबंध, महत्वपूर्ण यात्रा एवं विवाद निवारण के लिए अत्यंत फलदायी मुहूर्त।',
      hinglish: 'Naya venture, contracts, yatra aur conflict resolve karne ke liye highly auspicious muhurat.',
      en: 'Highly auspicious for beginning new ventures, contracts, important journeys, and resolving conflicts.',
    },
    godhuli: {
      hi: 'संध्याकालीन दिव्य वेला। संध्या वंदन, गृह प्रवेश, दीपदान एवं मांगलिक कार्यों हेतु अत्यंत शुभ।',
      hinglish: 'Sandhya aarti, deep lighting aur griha pravesh ke liye divine twilight period.',
      en: 'Divine twilight hour when dusk settles. Highly auspicious for evening prayers, Griha Pravesh, and ceremonies.',
    },
    sayahna: {
      hi: 'सायंकालीन आध्यात्मिक वेला। संध्या आरती, दीप प्रज्वलन एवं आत्म-चिंतन के लिए उत्तम समय।',
      hinglish: 'Shaam ki aarti, diya jalane aur aatm-shanti ke liye prashanta sandhya samay.',
      en: 'Evening spiritual twilight. Auspicious for evening aarti, lamp lighting, and contemplation.',
    },
    amrit: {
      hi: 'दैवीय कृपा से युक्त अमृतमयी बेला। सभी महत्वपूर्ण एवं मांगलिक कार्यों के लिए अति श्रेष्ठ।',
      hinglish: 'Divine blessings se yukt amrit samay. Sabhi important ceremonies ke liye exceptional.',
      en: 'Sacred nectar window endowed with divine blessings. Exceptional for important ceremonies.',
    },
    nishita: {
      hi: 'मध्यरात्रि का पावन मुहूर्त, शिव उपासना, गहन साधना एवं आत्म-अनुसंधान हेतु विशेष फलदायी।',
      hinglish: 'Midnight shiv puja, deep spiritual meditation aur sadhana ke liye pavitra muhurat.',
      en: 'Midnight sacred muhurat revered for Shiva worship, deep spiritual meditation, and esoteric practices.',
    },
    rahu: {
      hi: 'राहु द्वारा शासित अशुभ काल। इस समय नए कार्य, धन निवेश अथवा महत्वपूर्ण यात्रा से पूर्णतः बचें।',
      hinglish: 'Rahu governed ashubh kaal. Naye projects, investment aur yatra strictly avoid karein.',
      en: 'Inauspicious window governed by Rahu. Strictly avoid launching new projects, investments, or travels.',
    },
    yama: {
      hi: 'यम द्वारा शासित अशुभ समय। महत्वपूर्ण लेन-देन एवं यात्रा आरंभ करने से बचें।',
      hinglish: 'Yama ruled inauspicious window. Zaroori len-den aur travel start karne se bachein.',
      en: 'Inauspicious window ruled by Yama. Avoid important transactions and starting journeys.',
    },
    gulika: {
      hi: 'शनि पुत्र गुलिक द्वारा शासित समय। इस अवधि में किए गए कार्य बार-बार दोहराने पड़ते हैं।',
      hinglish: 'Gulika kaal. Is dauran shuru kiye gaye kaam repeat hone ki sambhavna rehti hai.',
      en: 'Window ruled by Gulika (son of Shani). Actions initiated during Gulika tend to repeat.',
    },
    dur: {
      hi: 'वार स्वामी के अनुसार प्रतिकूल ज्योतिषीय समय। इस दौरान मांगलिक कार्यों से बचें।',
      hinglish: 'Unfavorable astrological window. Is samay shubh aur manglik karyon se bachein.',
      en: 'Unfavorable astrological window based on day ruler. Avoid major auspicious tasks during this time.',
    },
    varjyam: {
      hi: 'हानिकारक खगोलीय संक्रमण काल। विवाह, गृह प्रवेश एवं नए कार्यों का सर्वथा त्याग करें।',
      hinglish: 'Harmful transit period. Weddings, griha pravesh aur naye karya avoid karein.',
      en: 'Harmful astronomical transit period. Strictly avoid weddings, Griha Pravesh, and vital beginnings.',
    },
    bhadra: {
      hi: 'विष्टि करण का प्रभाव। भद्रा काल में मांगलिक कार्य, यात्रा एवं नए अनुबंध वर्जित हैं।',
      hinglish: 'Vishti karana ka prabhav. Bhadra ke dauran manglik karya aur travel avoid karein.',
      en: 'Vishti Karana influence. Auspicious ceremonies and travels should be avoided during Bhadra.',
    },
  };

  let matchedKey = '';
  for (const k of Object.keys(DESCRIPTIONS)) {
    if (lower.includes(k)) {
      matchedKey = k;
      break;
    }
  }

  if (matchedKey) {
    const entry = DESCRIPTIONS[matchedKey];
    if (language === 'hi') return entry.hi;
    if (language === 'hinglish') return entry.hinglish;
    return entry.en;
  }

  return fallbackDesc;
}

