import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  Dimensions
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Fonts } from '../constants/typography';
import { SUPPORTED_LANGUAGES, LanguageCode, LanguageOption } from '../types/language';
import { useLanguage } from '../context/LanguageContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LanguageSelectionScreenProps {
  onComplete: () => void;
  isFromHome?: boolean;
  onBack?: () => void;
}

const { width } = Dimensions.get('window');

const NATIVE_GREETINGS: Record<string, string> = {
  hi: 'नमस्ते! SoulRise पंचांग में आपका स्वागत है।',
  en: 'Welcome to SoulRise Panchang Almanac.',
  gu: 'નમસ્તે! SoulRise પંચાંગમાં તમારું સ્વાગત છે.',
  mr: 'नमस्कार! SoulRise पंचांग मध्ये आपले स्वागत आहे.',
  bn: 'নমস্কার! SoulRise পঞ্জিকায় আপনাকে স্বাগতম।',
  ta: 'வணக்கம்! SoulRise பஞ்சாங்கத்திற்கு நல்வரவு.',
  te: 'నమస్కారం! SoulRise పంచాంగానికి స్వాగతం.',
  kn: 'ನಮಸ್ಕಾರ! SoulRise ಪಂಚಾಂಗಕ್ಕೆ ಸ್ವಾಗತ.',
  ml: 'നമസ്കാരം! SoulRise പഞ്ചാംഗത്തിലേക്ക് സ്വാഗതം.',
  pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! SoulRise ਪੰਚਾਂਗ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ।',
  or: 'ନମସ୍କାର! SoulRise ପଞ୍ଜିକାରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ।',
  sa: 'नमो नमः! SoulRise पञ्चाङ्गे भवतां स्वागतम्।',
  hinglish: 'Namaste! SoulRise Panchang me aapka swagat hai.',
  es: '¡Bienvenido a SoulRise Panchang!',
  fr: 'Bienvenue sur SoulRise Panchang!',
  ru: 'Добро пожаловать в SoulRise Panchang!',
  he: 'ברוכים הבאים ל-SoulRise Panchang!',
  id: 'Selamat datang di SoulRise Panchang!',
  th: 'ยินดีต้อนรับสู่ SoulRise Panchang!',
};

// Native "Apply" translations for the confirmation button
const NATIVE_APPLY_TEXT: Record<string, string> = {
  hi: 'लागू करें',
  en: 'Apply',
  gu: 'લાગુ કરો',
  mr: 'लागू करा',
  bn: 'প্রয়োগ করুন',
  ta: 'பயன்படுத்து',
  te: 'వర్తింపజేయి',
  kn: 'ಅನ್ವಯಿಸು',
  ml: 'പ്രയോഗിക്കുക',
  pa: 'ਲਾਗੂ ਕਰੋ',
  or: 'ପ୍ରୟୋଗ କରନ୍ତୁ',
  sa: 'प्रयुज्यताम्',
  hinglish: 'Apply (लागू करें)',
  es: 'Aplicar',
  fr: 'Appliquer',
  ru: 'Применить',
  he: 'החל',
  id: 'Terapkan',
  th: 'นำไปใช้',
};

const HEADER_TITLES: Record<string, string> = {
  en: 'Select Language',
  hinglish: 'Select Language',
  hi: 'भाषा चयन',
  gu: 'ભાષા પસંદ કરો',
  mr: 'भाषा निवडा',
  bn: 'ভাষা নির্বাচন করুন',
  ta: 'மொழியைத் தேர்ந்தெடுக்கவும்',
  te: 'భాషను ఎంచుకోండి',
  ru: 'Выберите язык',
  fr: 'Choisir la langue',
  es: 'Seleccionar idioma',
  he: 'בחר שפה',
  id: 'Pilih Bahasa',
  th: 'เลือกภาษา',
};

const HEADER_SUBTITLES_HOME: Record<string, string> = {
  en: 'Change primary app language',
  hinglish: 'Change primary app language',
  hi: 'ऐप की प्राथमिक भाषा बदलें',
  gu: 'એપ્લિકેશનની પ્રાથમિક ભાષા બદલો',
  mr: 'अ‍ॅपची प्राथमिक भाषा बदला',
  bn: 'অ্যাপের প্রাথমিক ভাষা পরিবর্তন করুন',
  ta: 'பயன்பாட்டின் முதன்மை மொழியை மாற்றவும்',
  te: 'యాప్ ప్రాథమిక భాషను మార్చండి',
  ru: 'Изменить основной язык приложения',
  fr: 'Changer la langue principale de l\'application',
  es: 'Cambiar el idioma principal de la aplicación',
  he: 'שנה את שפת האפליקציה הראשית',
  id: 'Ubah bahasa utama aplikasi',
  th: 'เปลี่ยนภาษาหลักของแอป',
};

const HEADER_SUBTITLES_ONBOARDING: Record<string, string> = {
  en: 'Choose your preferred spiritual script',
  hinglish: 'Choose your preferred spiritual script',
  hi: 'अपनी पसंदीदा आध्यात्मिक भाषा चुनें',
  gu: 'તમારી મનપસંદ ભાષા પસંદ કરો',
  mr: 'आपली पसंतीची भाषा निवडा',
  bn: 'আপনার পছন্দের ভাষা নির্বাচন করুন',
  ta: 'உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்',
  te: 'మీకు నచ్చిన భాషను ఎంచుకోండి',
  ru: 'Выберите предпочитаемый язык',
  fr: 'Choisissez votre langue préférée',
  es: 'Elige tu idioma preferido',
  he: 'בחר את השפה המועדפת עליך',
  id: 'Pilih bahasa yang Anda inginkan',
  th: 'เลือกภาษาที่คุณต้องการ',
};

const INSTRUCTION_BANNERS: Record<string, string> = {
  en: 'Tap any language radio button to open preview and apply.',
  hinglish: 'Tap any language radio button to open preview and apply.',
  hi: 'पूर्वावलोकन और लागू करने के लिए किसी भी भाषा के रेडियो बटन पर टैप करें।',
  gu: 'પૂર્વાવલોકન અને લાગુ કરવા માટે કોઈપણ ભાષાના રેડિયો બટન પર ટેપ કરો.',
  mr: 'पूर्वावलोकन आणि लागू करण्यासाठी कोणत्याही भाषेच्या रेडिओ बटणावर टॅप करा.',
  bn: 'প্রিভিউ এবং প্রয়োগ করতে যেকোনো ভাষার রেডিও বাটনে টॅप করুন।',
  ta: 'முன்னோட்டம் பார்த்து பயன்படுத்த எந்தவொரு மொழி வானொலி பொத்தானையும் தட்டவும்.',
  te: 'ప్రివ్యూ చేసి వర్తింపజేయడానికి ఏదైనా భాష రేడియో బటన్‌ను నొక్కండి.',
  ru: 'Нажмите на переключатель языка для предварительного просмотра и применения.',
  fr: 'Appuyez sur un bouton radio pour prévisualiser et appliquer.',
  es: 'Toca cualquier botón de opción para previsualizar y aplicar.',
  he: 'הקש על לחצן הבחירה של שפה כלשהי כדי להציג בתצוגה מקדימה ולהחיל.',
  id: 'Ketuk tombol radio bahasa mana saja untuk melihat pratinjau dan menerapkan.',
  th: 'แตะปุ่มตัวเลือกภาษาใดก็ได้เพื่อดูตัวอย่างและนำไปใช้',
};

const BACK_BUTTON_TEXTS: Record<string, string> = {
  en: '‹ Back',
  hinglish: '‹ Back',
  hi: '‹ वापस',
  gu: '‹ પાછા',
  mr: '‹ मागे',
  bn: '‹ পিছনে',
  ta: '‹ பின்',
  te: '‹ వెనుకకు',
  ru: '‹ Назад',
  fr: '‹ Retour',
  es: '‹ Volver',
  he: '‹ חזרה',
  id: '‹ Kembali',
  th: '‹ ย้อนกลับ',
};

interface LangPreview {
  title: string;
  bullets: string[];
}

const PREVIEW_CONTENT: Record<string, LangPreview> = {
  hinglish: {
    title: 'What will be updated in Hinglish / क्या अपडेट होगा:',
    bullets: [
      '• Tithi, Nakshatra, Yoga & Karana Vedic titles',
      '• Prashanta Muhurat & Choghadiya periods',
      '• Daily Festivals & Dharma Vrat notifications',
      '• Kundli interpretations & Daily Rashiphal',
    ],
  },
  hi: {
    title: 'पंचांग में अपडेट होगा:',
    bullets: [
      '• तिथि, नक्षत्र, योग और करण की वैदिक गणना',
      '• प्रशांत मुहूर्त और चौघड़िया काल',
      '• दैनिक व्रत, पर्व एवं धार्मिक त्यौहार',
      '• जन्म कुंडली और दैनिक राशिफल',
    ],
  },
  en: {
    title: 'What will be updated in English:',
    bullets: [
      '• Tithi, Nakshatra, Yoga & Karana Vedic titles',
      '• Prashanta Muhurat & Choghadiya periods',
      '• Daily Festivals & Dharma Vrat notifications',
      '• Kundli interpretations & Daily Rashiphal',
    ],
  },
  gu: {
    title: 'પંચાંગમાં અપડેટ થશે:',
    bullets: [
      '• તિથિ, નક્ષત્ર, યોગ અને કરણ ગણતરી',
      '• પ્રશાંત મુહૂર્ત અને ચોઘડિયા સમય',
      '• દૈનિક વ્રત અને ધાર્મિક ઉત્સવો',
      '• જન્મ કુંડળી અને દૈનિક રાશિફળ',
    ],
  },
  mr: {
    title: 'पंचांग मध्ये अपडेट होईल:',
    bullets: [
      '• तिथी, नक्षत्र, योग आणि करण माहिती',
      '• प्रशांत मुहूर्त आणि चौघडिया कालावधी',
      '• दैनंदिन सण, उत्सव आणि धर्म व्रत',
      '• जन्म कुंडली आणि दैनिक राशीभविष्य',
    ],
  },
  bn: {
    title: 'পঞ্জিকায় আপডেট হবে:',
    bullets: [
      '• তিথি, নক্ষত্র, যোগ ও করণ বৈদিক তথ্য',
      '• শুভ মুহূর্ত ও চৌঘড়িয়া সময়সূচী',
      '• দৈনিক ব্রত ও ধর্মীয় উৎসব',
      '• জন্ম কুণ্ডলী ও রাশিফল',
    ],
  },
  ta: {
    title: 'பஞ்சாங்கத்தில் புதுப்பிக்கப்படும்:',
    bullets: [
      '• திதி, நட்சத்திரம், யோகம் மற்றும் கரணம்',
      '• சுப முகூர்த்தம் மற்றும் சோகடியா நேரங்கள்',
      '• தினசரி விரதங்கள் மற்றும் பண்டிகைகள்',
      '• ஜாதகம் மற்றும் ராசி பலன்கள்',
    ],
  },
  te: {
    title: 'పంచాంగంలో నవీకరించబడుతుంది:',
    bullets: [
      '• తిథి, నక్షత్రం, యోగం మరియు కరణం',
      '• ప్రశాంత ముహూర్తం మరియు చోఘడియా',
      '• దినసరి వ్రతాలు మరియు పండుగలు',
      '• జన్మ కుండలి మరియు దిన ఫలాలు',
    ],
  },
  ru: {
    title: 'Что обновится в Панчанге:',
    bullets: [
      '• Расчет Титхи, Накшатры, Йоги и Караны',
      '• Периоды Мухурта и Чогхадия',
      '• Ежедневные ведические праздники и посты',
      '• Натальная карта Кундли и гороскоп',
    ],
  },
  fr: {
    title: 'Mises à jour dans le Panchang :',
    bullets: [
      '• Calculs védiques de Tithi, Nakshatra, Yoga & Karana',
      '• Périodes propices Prashanta Muhurat & Choghadiya',
      '• Fêtes religieuses et jeûnes quotidiens',
      '• Thème astral Kundli et horoscope quotidien',
    ],
  },
  es: {
    title: 'Lo que se actualizará en Panchang:',
    bullets: [
      '• Cálculo védico de Tithi, Nakshatra, Yoga y Karana',
      '• Períodos propicios Prashanta Muhurat y Choghadiya',
      '• Fiestas religiosas y ayunos diarios',
      '• Carta astral Kundli y horóscopo diario',
    ],
  },
  he: {
    title: 'מה יעודכן בפאנצ׳אנג:',
    bullets: [
      '• חישוב טיטהי, נקשאטרה, יוגה וקאראנה',
      '• זמני מוהורטה וצ׳וגאדיה מבורכים',
      '• חגים ומועדים וודיים יומיים',
      '• מפת לידה קונדלי והורוסקופ יומי',
    ],
  },
  id: {
    title: 'Pembaruan di Panchang:',
    bullets: [
      '• Perhitungan Veda Tithi, Nakshatra, Yoga & Karana',
      '• Periode berkah Prashanta Muhurat & Choghadiya',
      '• Festival harian dan puasa Dharma Vrat',
      '• Interpretasi Kundli dan ramalan harian',
    ],
  },
  th: {
    title: 'สิ่งที่จะอัปเดตในปฏิทินปัญจางค์:',
    bullets: [
      '• การคำนวณ ติถี, นักษัตร, โยคะ และการณะ',
      '• ช่วงเวลาฤกษ์มงคล มุหูรตะ และโชฆทิยา',
      '• วันสำคัญทางศาสนาและการถือศีล',
      '• ดวงชาตา กุณฑลี และคำพยากรณ์ประจำวัน',
    ],
  },
};

const getApplyButtonLabel = (langCode?: string): string => {
  if (!langCode || langCode === 'en') {
    return 'Apply';
  }
  const native = NATIVE_APPLY_TEXT[langCode];
  return native || 'Apply';
};

export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  onComplete,
  isFromHome = false,
  onBack
}) => {
  const { language, setLanguage } = useLanguage();
  const [selectedLangCode, setSelectedLangCode] = useState<LanguageCode>(language || 'en');
  const [pendingLang, setPendingLang] = useState<LanguageOption | null>(null);
  const [showSubPopup, setShowSubPopup] = useState(false);

  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 6, 20);
  const bottomPadding = Math.max(insets.bottom + 16, 28);

  const handleCardOrRadioPress = (item: LanguageOption) => {
    setSelectedLangCode(item.code);
    setPendingLang(item);
    setShowSubPopup(true);
  };

  const handleApplyLanguage = async () => {
    const langToApply = pendingLang ? pendingLang.code : selectedLangCode;
    await setLanguage(langToApply);
    setShowSubPopup(false);
    onComplete();
  };

  const activeLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLangCode) || SUPPORTED_LANGUAGES[0];
  const preview = pendingLang ? (PREVIEW_CONTENT[pendingLang.code] || PREVIEW_CONTENT.en) : PREVIEW_CONTENT.en;

  const currentAppliedLang = language || 'en';
  const headerTitle = HEADER_TITLES[currentAppliedLang] || 'Select Language';
  const headerSubtitle = isFromHome
    ? (HEADER_SUBTITLES_HOME[currentAppliedLang] || 'Change primary app language')
    : (HEADER_SUBTITLES_ONBOARDING[currentAppliedLang] || 'Choose your preferred spiritual script');
  const bannerText = INSTRUCTION_BANNERS[currentAppliedLang] || 'Tap any language radio button to open preview and apply.';
  const backText = BACK_BUTTON_TEXTS[currentAppliedLang] || '‹ Back';
  const badgeCode = (currentAppliedLang || 'EN').toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5EE" />

      {/* Top Header Navigation Bar */}
      <View style={[styles.topHeader, { paddingTop: topPadding }]}>
        {isFromHome ? (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack || onComplete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Text style={styles.backBtnText}>{backText}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.mastheadEmblem}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={4.5} fill="#DFB059" />
              <Path
                d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"
                stroke="#2B0E14"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
          </View>
        )}

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerTitleMain}>{headerTitle}</Text>
          <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>
        </View>

        <View style={styles.headerRightBadge}>
          <Text style={styles.currentCodeBadge}>{badgeCode}</Text>
        </View>
      </View>

      {/* Instructional Banner */}
      <View style={styles.instructionBanner}>
        <Text style={styles.instructionIcon}>🌐</Text>
        <Text style={styles.instructionText}>{bannerText}</Text>
      </View>

      {/* Scrollable Language Options List */}
      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {SUPPORTED_LANGUAGES.map((item: LanguageOption) => {
          const isSelected = item.code === selectedLangCode;

          return (
            <TouchableOpacity
              key={item.code}
              style={[styles.langCard, isSelected && styles.langCardSelected]}
              onPress={() => handleCardOrRadioPress(item)}
              activeOpacity={0.75}
            >
              <View style={styles.langLeftCol}>
                <View style={[styles.flagBadge, isSelected && styles.flagBadgeSelected]}>
                  <Text style={styles.flagText}>{item.flag || '🕉️'}</Text>
                </View>

                <View style={styles.langTextContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text
                      style={[styles.singleLangTitleText, isSelected && styles.singleLangTitleTextSelected]}
                      numberOfLines={1}
                    >
                      {item.nativeName}
                    </Text>
                    {item.isDefault && (
                      <View style={styles.defaultPill}>
                        <Text style={styles.defaultPillText}>DEFAULT</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Dedicated Radio Wrapper ensuring ZERO overlap */}
              <View style={styles.radioWrapper}>
                <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                  {isSelected && <View style={styles.radioInnerDot} />}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ======================================================== */}
      {/* SUB-POPUP MODAL: Triggered on Radio Button / Card Tap     */}
      {/* ======================================================== */}
      <Modal
        visible={showSubPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSubPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupCard}>
            {/* Header Crest with Close '✕' Button */}
            <View style={styles.popupCrestRow}>
              <View style={styles.popupFlagCircle}>
                <Text style={styles.popupFlagEmoji}>{pendingLang?.flag || '🌐'}</Text>
              </View>
              <View style={styles.popupHeaderCol}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={styles.popupSingleTitle}>{pendingLang?.nativeName}</Text>
                  {pendingLang?.isDefault && (
                    <View style={styles.defaultPill}>
                      <Text style={styles.defaultPillText}>DEFAULT</Text>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowSubPopup(false)}
                style={styles.popupCloseBtn}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.7}
              >
                <Text style={styles.popupCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Sacred Native Greeting */}
            <View style={styles.greetingBox}>
              <Text style={styles.greetingText}>
                {pendingLang ? (NATIVE_GREETINGS[pendingLang.code] || NATIVE_GREETINGS.en) : ''}
              </Text>
            </View>

            {/* Description & Impact Preview in Selected Language */}
            {preview && (
              <View style={styles.previewInfoBox}>
                <Text style={styles.previewInfoTitle}>{preview.title}</Text>
                {preview.bullets.map((bullet, idx) => (
                  <Text key={idx} style={styles.previewInfoBullet}>
                    {bullet}
                  </Text>
                ))}
              </View>
            )}

            {/* Action Button: ONLY show 'Apply' in selection's language (or dual for Hinglish) */}
            <TouchableOpacity
              style={styles.popupApplyBtnSingle}
              onPress={handleApplyLanguage}
              activeOpacity={0.85}
            >
              <Text style={styles.popupApplyText}>
                {getApplyButtonLabel(pendingLang?.code)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EADBCE',
    backgroundColor: 'rgba(248, 245, 238, 0.92)',
  },
  backBtn: {
    paddingVertical: 6,
    paddingRight: 10,
  },
  backBtnText: {
    fontSize: 16,
    fontFamily: Fonts.jakartaBold,
    color: '#2B0E14',
  },
  mastheadEmblem: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DFB059',
  },
  headerTitleCol: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitleMain: {
    fontSize: 17,
    fontFamily: Fonts.cormorantBold,
    color: '#2B0E14',
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: Fonts.jakartaRegular,
    color: '#7D6A68',
    marginTop: 1,
  },
  headerRightBadge: {
    backgroundColor: '#2B0E14',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFB059',
  },
  currentCodeBadge: {
    fontSize: 11,
    fontFamily: Fonts.jakartaBold,
    color: '#DFB059',
    letterSpacing: 1,
  },
  instructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(223, 176, 89, 0.12)',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(223, 176, 89, 0.25)',
  },
  instructionIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  instructionText: {
    fontSize: 12,
    fontFamily: Fonts.jakartaMedium,
    color: '#4A3533',
    flex: 1,
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1.2,
    borderColor: '#EADBCE',
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  langCardSelected: {
    backgroundColor: '#FFFDF9',
    borderColor: '#DFB059',
    borderWidth: 1.5,
    shadowColor: '#DFB059',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  langLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16, // Generous spacing ensuring no element touches the radio button
  },
  flagBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#EADBCE',
  },
  flagBadgeSelected: {
    backgroundColor: 'rgba(223, 176, 89, 0.15)',
    borderColor: '#DFB059',
  },
  flagText: {
    fontSize: 20,
  },
  langTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  hinglishHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hinglishTitleText: {
    fontSize: 16,
    fontFamily: Fonts.rozhaRegular,
    color: '#2B0E14',
  },
  hinglishTitleTextSelected: {
    color: '#2B0E14',
  },
  hinglishSubtitleText: {
    fontSize: 12,
    fontFamily: Fonts.jakartaRegular,
    color: '#7D6A68',
    marginTop: 2,
  },
  defaultPill: {
    backgroundColor: '#2B0E14',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DFB059',
  },
  defaultPillText: {
    fontSize: 9,
    fontFamily: Fonts.jakartaBold,
    color: '#DFB059',
    letterSpacing: 0.6,
  },
  singleLangTitleText: {
    fontSize: 16,
    fontFamily: Fonts.rozhaRegular,
    color: '#2B0E14',
  },
  singleLangTitleTextSelected: {
    color: '#2B0E14',
  },
  radioWrapper: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.8,
    borderColor: '#C4B2AE',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioCircleSelected: {
    borderColor: '#2B0E14',
    backgroundColor: '#FFFDF9',
  },
  radioInnerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#DFB059',
    borderWidth: 1.5,
    borderColor: '#2B0E14',
  },

  // Modal Sub-Popup Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 7, 12, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popupCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FBF9F4',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1.5,
    borderColor: '#DFB059',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  popupCrestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  popupFlagCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#DFB059',
    marginRight: 12,
  },
  popupFlagEmoji: {
    fontSize: 24,
  },
  popupHeaderCol: {
    flex: 1,
  },
  popupNativeTitle: {
    fontSize: 18,
    fontFamily: Fonts.rozhaRegular,
    color: '#2B0E14',
  },
  popupEnglishTitle: {
    fontSize: 12,
    fontFamily: Fonts.jakartaRegular,
    color: '#7D6A68',
    marginTop: 1,
  },
  popupSingleTitle: {
    fontSize: 20,
    fontFamily: Fonts.rozhaRegular,
    color: '#2B0E14',
  },
  popupCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2ECE1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D8C7B8',
  },
  popupCloseBtnText: {
    fontSize: 14,
    color: '#7D6A68',
    fontWeight: 'bold',
  },
  greetingBox: {
    backgroundColor: '#2B0E14',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DFB059',
    marginBottom: 14,
  },
  greetingText: {
    fontSize: 13,
    fontFamily: Fonts.rozhaRegular,
    color: '#F5DE9C',
    textAlign: 'center',
    lineHeight: 18,
  },
  previewInfoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EADBCE',
    marginBottom: 18,
  },
  previewInfoTitle: {
    fontSize: 13,
    fontFamily: Fonts.jakartaBold,
    color: '#2B0E14',
    marginBottom: 8,
  },
  previewInfoBullet: {
    fontSize: 11.5,
    fontFamily: Fonts.jakartaRegular,
    color: '#5C4745',
    lineHeight: 17,
    marginBottom: 4,
  },
  popupApplyBtnSingle: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2B0E14',
    borderWidth: 1.2,
    borderColor: '#DFB059',
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  popupApplyText: {
    fontSize: 15,
    fontFamily: Fonts.jakartaBold,
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});
