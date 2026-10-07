import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import Svg, { Path, Circle, Rect, Ellipse } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Fonts } from '../constants/typography';
import { FESTIVALS, getLocalizedFestivalTitle } from '../engine/festivalRepository';
import { CityLocation, PanchangDayData } from '../types/panchang';
import { DEFAULT_CITIES } from '../data/cities';
import { calculatePanchang, getHinduMonthName, calculateTithiForDate } from '../engine/panchangEngine';
import { calculateMuhurats, calculateChoghadiya } from '../engine/muhuratCalculator';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedTithi, getLocalizedPakshaName, getLocalizedMoonPhase } from '../i18n/vedicTerms';
import { useCalendarSystem, CalendarSystem } from '../context/CalendarContext';
import { getJainDayData } from '../engine/jainCalendarEngine';
import { getDharmaCalendarDayData } from '../engine/dharmaCalendarEngine';
import { saveReminder } from '../engine/reminderStorage';
import { analyzeMuhuratSafety } from '../engine/muhuratSafetyChecker';
import { TimePickerModal } from '../components/TimePickerModal';
import { CitySelectionModal } from '../components/CitySelectionModal';
import { CelestialBackground } from '../components/CelestialBackground';
import { DatePickerModal } from '../components/DatePickerModal';
import { isDateInPast, isTimeInPastOnDate, getNextUpcomingTimeSlot } from '../engine/dateTimeValidator';

interface CalendarScreenProps {
  selectedCity?: CityLocation;
  initialDateIso?: string;
  onSelectDate: (dateIso: string) => void;
}

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function getLocalizedDateString(date: Date, lang: string): string {
  const localeMap: Record<string, string> = {
    hinglish: 'en-US',
    hi: 'hi-IN',
    en: 'en-US',
    ta: 'ta-IN',
    te: 'te-IN',
    bn: 'bn-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    ru: 'ru-RU',
    fr: 'fr-FR',
    es: 'es-ES',
    he: 'he-IL',
    id: 'id-ID',
    th: 'th-TH'
  };

  try {
    const locale = localeMap[lang] || 'en-US';
    return date.toLocaleDateString(locale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }
}

const getPerpetualMiniRitual = (d: Date, tithiIdx: number, monthName: string): string | null => {
  const dayOfWeek = d.getDay();
  if (tithiIdx === 12 && dayOfWeek === 1) return "🔱 Soma Pradosh";
  if (tithiIdx === 12 && dayOfWeek === 6) return "🔱 Shani Pradosh";
  if (tithiIdx === 12) return "🔱 Pradosh Vrat";
  if (tithiIdx === 10) return "🌿 Ekadashi Vrat";
  if (tithiIdx === 14) return "🌕 Satyanarayan";
  if (tithiIdx === 29) return "🌑 Pitru Tarpana";
  if (dayOfWeek === 1 && monthName === "Shravana") return "🌿 Shravan Somvar";
  if (dayOfWeek === 2 && monthName === "Shravana") return "🌸 Mangla Gauri";
  if (dayOfWeek === 4) return "💛 Guru Vrat";
  if (dayOfWeek === 6) return "🖤 Shani Dev Puja";
  return null;
};

const getRahuKalamForDate = (d: Date): string => {
  const dayOfWeek = d.getDay();
  const windows = [
    "04:30 PM - 06:00 PM",
    "07:30 AM - 09:00 AM",
    "03:00 PM - 04:30 PM",
    "12:00 PM - 01:30 PM",
    "01:30 PM - 03:00 PM",
    "10:30 AM - 12:00 PM",
    "09:00 AM - 10:30 AM"
  ];
  return windows[dayOfWeek];
};

const CALENDAR_SYSTEM_OPTIONS: { id: CalendarSystem; title: string; desc: string; icon: string }[] = [
  { id: 'HINDU', title: '🕉️ Hindu Calendar (Vikram Samvat)', desc: 'Standard Vedic Lunar/Solar Panchang with Tithis, Nakshatras & Vrats [Default]', icon: '🕉️' },
  { id: 'JAIN', title: '🪔 Jain Calendar (Vira Nirvana Samvat)', desc: 'Sacred Jain Parva Tithis (Aastham, Chaudas), Pachkhan & Fasting Days', icon: '🪔' },
  { id: 'SIKH', title: '☬ Nanakshahi Sikh Calendar', desc: 'Sikh Samvat 556, Gurpurabs, Shaheedi Diwas & Sangrand Celebrations', icon: '☬' },
  { id: 'BUDDHIST', title: '☸️ Buddhist Lunar Calendar (BE 2568)', desc: 'Buddha Era 2568, Vesak, Asalha, Pavarana & Kathina Sacred Days', icon: '☸️' },
  { id: 'CHRISTIAN', title: '✝️ Christian Liturgical Calendar', desc: 'Feasts, Advent, Lent, Easter, Good Friday & Christmas Celebrations', icon: '✝️' },
  { id: 'PARSI', title: '🔥 Zoroastrian Parsi Calendar', desc: 'Shahenshahi / Fasli Yazdegerdi 1396 & Navroz Celebrations', icon: '🔥' },
  { id: 'GLOBAL', title: '🌍 Gregorian Solar Calendar', desc: 'Standard Western Solar Dates & International Observances', icon: '🌍' },
];

const getChoghadiyaDetails = (type: string) => {
  const t = type.toUpperCase();
  switch (t) {
    case 'AMRIT':
      return {
        quality: 'HIGHLY_AUSPICIOUS',
        qualityLabel: 'Highly Auspicious ⭐',
        accentColor: '#10B981',
        guidance: 'Moon influence • Sacred nectar period. Supreme window for all pujas, rituals, oath ceremonies & prosperous deeds.',
      };
    case 'SHUBH':
      return {
        quality: 'AUSPICIOUS',
        qualityLabel: 'Auspicious',
        accentColor: '#10B981',
        guidance: 'Jupiter influence • Divine favor. Ideal for religious ceremonies, prayer rituals, agreements & sacred beginnings.',
      };
    case 'LABH':
      return {
        quality: 'AUSPICIOUS',
        qualityLabel: 'Auspicious',
        accentColor: '#10B981',
        guidance: 'Mercury influence • Fruitful gains. Highly recommended for commercial business, investments, study & trade expansion.',
      };
    case 'CHAR':
      return {
        quality: 'NEUTRAL',
        qualityLabel: 'Neutral',
        accentColor: '#F59E0B',
        guidance: 'Venus influence • Dynamic & movable period. Favorable for journeys, travel, vehicle purchases & communication.',
      };
    case 'ROG':
      return {
        quality: 'INAUSPICIOUS',
        qualityLabel: 'Inauspicious',
        accentColor: '#EF4444',
        guidance: 'Mars influence • Friction & discord. Refrain from starting new ventures, medical treatments, or financial dealings.',
      };
    case 'KAAL':
      return {
        quality: 'INAUSPICIOUS',
        qualityLabel: 'Inauspicious',
        accentColor: '#EF4444',
        guidance: 'Saturn influence • Governed by delay and loss. Refrain from initiating vital endeavors or important journeys.',
      };
    case 'UDVEG':
      return {
        quality: 'INAUSPICIOUS',
        qualityLabel: 'Inauspicious',
        accentColor: '#EF4444',
        guidance: 'Sun influence • Agitation & anxiety. Unfavorable for peace treaties, government negotiations, or high-stakes matters.',
      };
    default:
      return {
        quality: 'NEUTRAL',
        qualityLabel: 'Neutral',
        accentColor: '#8B5CF6',
        guidance: 'Vedic planetary transition interval.',
      };
  }
};

const isChogSlotActiveNow = (startTime: string, endTime: string, isToday: boolean): boolean => {
  if (!isToday) return false;
  try {
    const now = new Date();
    const curMin = now.getHours() * 60 + now.getMinutes();
    const parseM = (t: string) => {
      const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return 0;
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const isPM = match[3].toUpperCase() === 'PM';
      if (isPM && h !== 12) h += 12;
      if (!isPM && h === 12) h = 0;
      return h * 60 + m;
    };
    const sMin = parseM(startTime);
    let eMin = parseM(endTime);
    if (eMin < sMin) eMin += 1440;
    let testMin = curMin;
    if (eMin > 1440 && curMin < sMin) testMin += 1440;
    return testMin >= sMin && testMin < eMin;
  } catch (e) {
    return false;
  }
};

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  selectedCity = DEFAULT_CITIES[0],
  initialDateIso,
  onSelectDate,
}) => {
  const { language, t } = useLanguage();
  const { calendarSystem, setCalendarSystem, lunarSystem } = useCalendarSystem();

  // Local independent calendar location
  const [calendarCity, setCalendarCity] = useState<CityLocation>(selectedCity);
  const [showCityModal, setShowCityModal] = useState(false);

  useEffect(() => {
    if (selectedCity) {
      setCalendarCity(selectedCity);
    }
  }, [selectedCity]);

  // Current displayed month & active selected day
  const [currentDate, setCurrentDate] = useState(() => {
    if (initialDateIso) {
      try {
        const parts = initialDateIso.split('-');
        if (parts.length === 3) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const d = parseInt(parts[2], 10);
          if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            return new Date(y, m, d);
          }
        }
      } catch (e) {}
    }
    return new Date();
  });

  const realToday = new Date();
  const realTodayIso = `${realToday.getFullYear()}-${String(realToday.getMonth() + 1).padStart(2, '0')}-${String(realToday.getDate()).padStart(2, '0')}`;

  const [selectedActiveDateIso, setSelectedActiveDateIso] = useState<string>(() => {
    if (initialDateIso) return initialDateIso;
    return realTodayIso;
  });

  useEffect(() => {
    if (initialDateIso) {
      try {
        const parts = initialDateIso.split('-');
        if (parts.length === 3) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const d = parseInt(parts[2], 10);
          if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
            setCurrentDate(new Date(y, m, d));
            setSelectedActiveDateIso(initialDateIso);
          }
        }
      } catch (e) {}
    }
  }, [initialDateIso]);

  // DatePickerModal State (Unified with HomeScreen)
  const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);

  // Full Day Detail Bottom Sheet State
  const [selectedModalDateIso, setSelectedModalDateIso] = useState<string | null>(null);

  // Day & Night Choghadiya Accordion State in Day Detail Modal
  const [choghadiyaExpanded, setChoghadiyaExpanded] = useState<boolean>(false);
  const [choghadiyaActiveTab, setChoghadiyaActiveTab] = useState<'DAY' | 'NIGHT'>('DAY');

  useEffect(() => {
    if (selectedModalDateIso) {
      setChoghadiyaExpanded(false);
      setChoghadiyaActiveTab('DAY');
    }
  }, [selectedModalDateIso]);

  // Multi-Calendar Selector Modal State
  const [calSystemModalVisible, setCalSystemModalVisible] = useState(false);

  // Date Quick Reminder Modal State
  const [dateRemModalVisible, setDateRemModalVisible] = useState(false);
  const [dateRemTitle, setDateRemTitle] = useState('');
  const [dateRemTimeStr, setDateRemTimeStr] = useState('10:30 AM');
  const [dateRemNotes, setDateRemNotes] = useState('');
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    setCurrentDate(prev);
    const newIso = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}-01`;
    setSelectedActiveDateIso(newIso);
  };

  const handleNextMonth = () => {
    const next = new Date(year, month + 1, 1);
    setCurrentDate(next);
    const newIso = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-01`;
    setSelectedActiveDateIso(newIso);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedActiveDateIso(realTodayIso);
    if (onSelectDate) onSelectDate(realTodayIso);
  };

  const monthFestivals = FESTIVALS.filter(f => {
    const parts = f.dateIso.split('-');
    const matchesMonth = parseInt(parts[0], 10) === year && parseInt(parts[1], 10) === month + 1;
    if (!matchesMonth) return false;
    if (calendarSystem === 'HINDU') return f.category !== 'JAIN_FESTIVAL';
    if (calendarSystem === 'JAIN') return f.category === 'JAIN_FESTIVAL';
    return true;
  });

  // Calculate Selected Active Date Panchang for the Almanac Glance Card
  const activeSelectedDateObj = useMemo(() => {
    try {
      const parts = selectedActiveDateIso.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
      }
    } catch (e) {}
    return new Date();
  }, [selectedActiveDateIso]);

  const activeSelectedPanchang = useMemo(() => {
    return calculatePanchang(activeSelectedDateObj, calendarCity, lunarSystem);
  }, [activeSelectedDateObj, calendarCity, lunarSystem]);

  const activeSelectedTithiIdx = calculateTithiForDate(activeSelectedDateObj);
  const activeSelectedTithiName = getLocalizedTithi(activeSelectedTithiIdx + 1, language, activeSelectedTithiIdx <= 14 ? 'SHUKLA' : 'KRISHNA').name;
  const activeSelectedMonthName = getHinduMonthName(activeSelectedDateObj, lunarSystem);
  const activeSelectedPakshaName = getLocalizedPakshaName(activeSelectedTithiIdx <= 14 ? 'SHUKLA' : 'KRISHNA', language);
  const activeSelectedFest = FESTIVALS.find(f => f.dateIso === selectedActiveDateIso);

  // Calculate Details for Modal Bottom Sheet if open
  let mDate = activeSelectedDateObj;
  let mTithiIdx = activeSelectedTithiIdx;
  let mTithiName = activeSelectedTithiName;
  let mMonthName = activeSelectedMonthName;
  let mPakshaFull = activeSelectedPakshaName;
  let mMoonPhaseStr = "";
  let mRitual: string | null = null;
  let festMatchModal: typeof FESTIVALS[0] | null = null;
  let mPanchang = activeSelectedPanchang;
  let mJainData = getJainDayData(mDate, 0);
  let mRahuKaalStr = "04:30 PM - 06:00 PM";
  let mChoghadiya: { dayChoghadiya: any[]; nightChoghadiya: any[] } | null = null;

  if (selectedModalDateIso) {
    try {
      const parts = selectedModalDateIso.split('-');
      if (parts.length === 3) {
        mDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
      }
    } catch (e) {
      mDate = new Date();
    }
    mTithiIdx = calculateTithiForDate(mDate);
    mTithiName = getLocalizedTithi(mTithiIdx + 1, language, mTithiIdx <= 14 ? 'SHUKLA' : 'KRISHNA').name;
    mMonthName = getHinduMonthName(mDate, lunarSystem);
    mPakshaFull = getLocalizedPakshaName(mTithiIdx <= 14 ? 'SHUKLA' : 'KRISHNA', language);
    mMoonPhaseStr = getLocalizedMoonPhase(mTithiIdx, language);

    mRitual = (calendarSystem === 'HINDU' || !calendarSystem) ? getPerpetualMiniRitual(mDate, mTithiIdx, mMonthName) : null;

    if (calendarSystem === 'HINDU' || !calendarSystem) {
      festMatchModal = FESTIVALS.find(f => f.dateIso === selectedModalDateIso && (f.category === 'MAJOR_FESTIVAL' || f.category === 'VRAT' || f.category === 'JAYANTI' || f.category === 'CULTURAL')) || null;
    } else if (calendarSystem === 'JAIN') {
      festMatchModal = FESTIVALS.find(f => f.dateIso === selectedModalDateIso && f.category === 'JAIN_FESTIVAL') || null;
    } else if (calendarSystem === 'SIKH') {
      festMatchModal = FESTIVALS.find(f => f.dateIso === selectedModalDateIso && f.category === 'SIKH_FESTIVAL') || null;
    } else if (calendarSystem === 'BUDDHIST') {
      festMatchModal = FESTIVALS.find(f => f.dateIso === selectedModalDateIso && f.category === 'BUDDHIST_FESTIVAL') || null;
    } else if (calendarSystem === 'CHRISTIAN') {
      festMatchModal = FESTIVALS.find(f => f.dateIso === selectedModalDateIso && f.category === 'CHRISTIAN_FESTIVAL') || null;
    } else if (calendarSystem === 'PARSI') {
      festMatchModal = FESTIVALS.find(f => f.dateIso === selectedModalDateIso && f.category === 'PARSI_FESTIVAL') || null;
    } else {
      festMatchModal = null;
    }

    mPanchang = calculatePanchang(mDate, calendarCity, lunarSystem);
    mJainData = getJainDayData(mDate, mTithiIdx);

    try {
      const muhurats = calculateMuhurats(mDate, mPanchang.sunMoon.sunrise, mPanchang.sunMoon.sunset);
      const rahu = muhurats.inauspicious.find(m => m.name.toLowerCase().includes('rahu')) || muhurats.inauspicious[0];
      if (rahu) {
        mRahuKaalStr = `${rahu.startTime} - ${rahu.endTime}`;
      } else {
        mRahuKaalStr = getRahuKalamForDate(mDate);
      }
    } catch (e) {
      mRahuKaalStr = getRahuKalamForDate(mDate);
    }

    try {
      mChoghadiya = calculateChoghadiya(mDate, mPanchang.sunMoon.sunrise, mPanchang.sunMoon.sunset);
    } catch (e) {
      mChoghadiya = null;
    }
  }

  const isModalDateToday = useMemo(() => {
    if (!selectedModalDateIso) return false;
    const now = new Date();
    const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return selectedModalDateIso === todayIso;
  }, [selectedModalDateIso]);

  const getCalendarTitle = (sys: CalendarSystem) => {
    const item = CALENDAR_SYSTEM_OPTIONS.find(o => o.id === sys);
    return item ? item.title : '🕉️ Hindu Calendar (Vikram Samvat)';
  };

  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 6, (StatusBar.currentHeight || 24) + 8);

  return (
    <View style={styles.screenWrapper}>
      {/* Sacred Parchment Cream Celestial Background */}
      <CelestialBackground id="calCelestialBg" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: topPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. TOP BRAND MASTHEAD (Matching HomeScreen Heritage Aesthetic) */}
        <View style={styles.masthead}>
          <View style={styles.brandLeftCol}>
            <View style={styles.brandTitleRow}>
              <View style={styles.sunEmblemBox}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="#DFB059">
                  <Circle cx="12" cy="12" r="5" />
                  <Path
                    d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                    stroke="#DFB059"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </Svg>
              </View>
              <Text style={styles.brandTitleText}>SoulRise Calendar</Text>
            </View>
            <Text style={styles.brandSubtitleText}>SACRED MONTHLY ALMANAC</Text>
          </View>

          {/* Action Chips: Location & Calendar System */}
          <View style={styles.topChipsGroup}>
            <TouchableOpacity
              style={styles.pillChip}
              onPress={() => setShowCityModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.chipPinIcon}>📍</Text>
              <Text style={styles.chipLabelText} numberOfLines={1}>{calendarCity.name}</Text>
              <Text style={styles.chipArrow}>▼</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pillChip}
              onPress={() => setCalSystemModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.chipPinIcon}>🕉️</Text>
              <Text style={styles.chipLabelText}>Hindu</Text>
              <Text style={styles.chipArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. REGAL MONTH NAVIGATION CAPSULE */}
        <View style={styles.monthCapsuleCard}>
          <View style={styles.monthNavRow}>
            {/* Prev Arrow */}
            <TouchableOpacity
              style={styles.capsuleArrowBtn}
              onPress={handlePrevMonth}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.capsuleArrowText}>‹</Text>
            </TouchableOpacity>

            {/* Center Month Button (Tapping opens HomeScreen's DatePickerModal!) */}
            <TouchableOpacity
              style={styles.monthCenterBtn}
              onPress={() => setDatePickerModalVisible(true)}
              activeOpacity={0.75}
            >
              <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
                <Rect x="3" y="4" width="18" height="17" rx="3" fill="#FFFFFF" stroke="#2B0E14" strokeWidth="1.6" />
                <Path d="M3 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v5H3V4z" fill="#2B0E14" />
                <Path d="M8 1.5v3M16 1.5v3" stroke="#DFB059" strokeWidth="2" strokeLinecap="round" />
                <Circle cx="8" cy="13" r="1.1" fill="#7D6A68" />
                <Circle cx="12" cy="13" r="1.1" fill="#7D6A68" />
                <Circle cx="16" cy="13" r="1.1" fill="#7D6A68" />
                <Circle cx="8" cy="17" r="1.1" fill="#7D6A68" />
                <Circle cx="12" cy="17" r="1.1" fill="#DFB059" />
                <Circle cx="16" cy="17" r="1.1" fill="#7D6A68" />
              </Svg>
              <Text style={styles.monthCenterText}>
                {MONTH_NAMES[month]} {year}
              </Text>
              <Text style={styles.monthCenterChevron}>▼</Text>
            </TouchableOpacity>

            {/* TODAY Pill Button */}
            <TouchableOpacity
              style={styles.todayPillBtn}
              onPress={handleToday}
              activeOpacity={0.8}
            >
              <Text style={styles.todayPillBtnText}>TODAY</Text>
            </TouchableOpacity>

            {/* Next Arrow */}
            <TouchableOpacity
              style={styles.capsuleArrowBtn}
              onPress={handleNextMonth}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.capsuleArrowText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Samvat Era Sub-Banner */}
          {(() => {
            const startMonthDate = new Date(year, month, 1);
            const endMonthDate = new Date(year, month, 25);
            const startData = getDharmaCalendarDayData(startMonthDate, calendarSystem, language, lunarSystem);
            const endData = getDharmaCalendarDayData(endMonthDate, calendarSystem, language, lunarSystem);

            let monthDisplay = startData.monthName;
            if (endData.monthName && endData.monthName !== startData.monthName) {
              monthDisplay = `${startData.monthName} – ${endData.monthName}`;
            }

            return (
              <View style={styles.samvatPillBanner}>
                <Text style={styles.samvatPillText} numberOfLines={1}>
                  ✦ {monthDisplay.toUpperCase()} {mPanchang.samvat.vikramSamvat || 2083} VIKRAM SAMVAT ✦
                </Text>
              </View>
            );
          })()}
        </View>

        {/* 3. WEEKDAY HEADER ROW */}
        <View style={styles.weekdayRow}>
          {WEEKDAYS.map((day, i) => (
            <View key={day} style={styles.weekdayCol}>
              <Text style={[styles.weekdayText, i === 0 && styles.sunWeekdayText]}>
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* 4. MONTHLY CALENDAR GRID OF ROUNDED DATE TILES (THE CORE HERO) */}
        <View style={styles.calendarGrid}>
          {/* Empty spacer cells before 1st day */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.emptyTile} />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateIso = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dateObj = new Date(year, month, dayNum, 12, 0, 0);
            const isSunday = dateObj.getDay() === 0;

            const festMatch = monthFestivals.find(f => f.dateIso === dateIso);
            const cellPanchang = calculatePanchang(dateObj, calendarCity, lunarSystem);
            const tithiNum = ((cellPanchang.tithi.number - 1) % 15) + 1;
            const isKrishna = cellPanchang.tithi.paksha === 'KRISHNA';

            // Moon icon
            let moonIcon = '🌒';
            if (cellPanchang.tithi.number === 15) moonIcon = '🌕';
            else if (cellPanchang.tithi.number === 30) moonIcon = '🌑';
            else if (!isKrishna) {
              if (tithiNum <= 4) moonIcon = '🌒';
              else if (tithiNum <= 9) moonIcon = '🌓';
              else moonIcon = '🌔';
            } else {
              if (tithiNum <= 5) moonIcon = '🌖';
              else if (tithiNum <= 9) moonIcon = '🌗';
              else moonIcon = '🌘';
            }

            const isTodayCell = dayNum === realToday.getDate() && month === realToday.getMonth() && year === realToday.getFullYear();
            const isSelectedCell = dateIso === selectedActiveDateIso;

            // Tithi Name
            let tithiShortName = getLocalizedTithi(cellPanchang.tithi.number, language, cellPanchang.tithi.paksha).name;
            if (tithiShortName.includes('/')) {
              tithiShortName = isKrishna ? 'Amavasya' : 'Purnima';
            }

            // Paksha display
            const pakshaLabel = isKrishna ? 'Kri.' : 'Shu.';

            // Bottom Badge Logic (Guarantees zero empty space at bottom!)
            const isEkadashi = tithiNum === 11;
            const isPurnima = cellPanchang.tithi.number === 15;
            const isAmavasya = cellPanchang.tithi.number === 30;
            const miniRitual = getPerpetualMiniRitual(dateObj, cellPanchang.tithi.number - 1, cellPanchang.samvat.monthName || '');

            let badgeConfig = {
              text: `✦ ${cellPanchang.nakshatra.name.slice(0, 4)}`,
              bg: '#F8F5EE',
              border: '#EADBCE',
              color: '#7D6A68',
            };

            if (isEkadashi) {
              badgeConfig = {
                text: '🌿 Ekadashi',
                bg: '#E9F5EE',
                border: '#86EFAC',
                color: '#166534',
              };
            } else if (isPurnima) {
              badgeConfig = {
                text: '🌕 Purnima',
                bg: '#FEF3C7',
                border: '#FCD34D',
                color: '#92400E',
              };
            } else if (isAmavasya) {
              badgeConfig = {
                text: '🌑 Amavasya',
                bg: '#EEF2FF',
                border: '#C7D2FE',
                color: '#1E3A8A',
              };
            } else if (festMatch) {
              const cleanFestName = (festMatch.name || 'Festival').replace(/[^a-zA-Z\s]/g, '').trim().split(' ')[0] || 'Vrat';
              badgeConfig = {
                text: `🪔 ${cleanFestName.slice(0, 5)}`,
                bg: '#FEF2F2',
                border: '#FECACA',
                color: '#991B1B',
              };
            } else if (miniRitual) {
              const cleanRitual = miniRitual.replace(/[🔱🌿🌸💛🖤]/g, '').trim().split(' ')[0] || 'Puja';
              badgeConfig = {
                text: `✨ ${cleanRitual.slice(0, 5)}`,
                bg: '#FFF7ED',
                border: '#FFEDD5',
                color: '#C2410C',
              };
            }

            return (
              <TouchableOpacity
                key={`day-${dayNum}`}
                style={[
                  styles.dayTile,
                  isTodayCell && styles.todayDayTile,
                  isSelectedCell && !isTodayCell && styles.selectedDayTile,
                ]}
                onPress={() => {
                  setSelectedActiveDateIso(dateIso);
                  setSelectedModalDateIso(dateIso);
                  if (onSelectDate) onSelectDate(dateIso);
                }}
                activeOpacity={0.75}
              >
                {/* Gold Micro-Badge for TODAY */}
                {isTodayCell && (
                  <View style={styles.todayMicroTag}>
                    <Text style={styles.todayMicroTagText}>TODAY</Text>
                  </View>
                )}

                {/* Top Row: English Day Number & Moon Phase Glyph */}
                <View style={styles.tileTopRow}>
                  <Text style={[
                    styles.tileDayNumText,
                    isSunday && styles.sundayDayNumText,
                    isTodayCell && styles.todayDayNumText,
                  ]}>
                    {dayNum}
                  </Text>
                  <Text style={styles.tileMoonGlyph}>{moonIcon}</Text>
                </View>

                {/* Middle Row: Lunar Tithi Name & Paksha */}
                <View style={styles.tileTithiRow}>
                  <Text
                    style={styles.tileTithiText}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                  >
                    {tithiShortName}
                  </Text>
                  <Text style={styles.tilePakshaText} numberOfLines={1}>
                    {pakshaLabel}
                  </Text>
                </View>

                {/* Bottom Row: Meaningful Colorful Badge (Zero Blank Space!) */}
                <View style={[styles.tileBadgeBox, { backgroundColor: badgeConfig.bg, borderColor: badgeConfig.border }]}>
                  <Text
                    style={[styles.tileBadgeText, { color: badgeConfig.color }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {badgeConfig.text}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 5. SELECTED DAY ALMANAC GLANCE CARD (BELOW GRID) */}
        <View style={styles.almanacMasterCard}>
          {/* Card Header */}
          <View style={styles.almanacHeaderRow}>
            <View style={styles.almanacHeaderLeft}>
              <Text style={styles.almanacHeaderTag}>✦ SELECTED DAY ALMANAC ✦</Text>
              <Text style={styles.almanacDateTitle} numberOfLines={1}>
                {getLocalizedDateString(activeSelectedDateObj, language)}
              </Text>
              <Text style={styles.almanacTithiSubtitle} numberOfLines={1}>
                {activeSelectedPakshaName} {activeSelectedTithiName} • {activeSelectedMonthName} Masa
              </Text>
            </View>

            {/* Astrolabe Moon Phase Emblem */}
            <View style={styles.almanacMoonOrb}>
              <Text style={styles.almanacMoonGlyph}>
                {activeSelectedPanchang.tithi.number === 15 ? '🌕' : activeSelectedPanchang.tithi.number === 30 ? '🌑' : '🌖'}
              </Text>
            </View>
          </View>

          {/* 3-Column Vedic Micro-Grid (Nakshatra, Yoga, Karana) */}
          <View style={styles.almanacTriadRow}>
            <View style={styles.almanacTriadCol}>
              <Text style={styles.almanacTriadLabel}>NAKSHATRA</Text>
              <Text style={styles.almanacTriadVal} numberOfLines={1}>{activeSelectedPanchang.nakshatra.name}</Text>
              <Text style={styles.almanacTriadSub} numberOfLines={1}>
                Unto {activeSelectedPanchang.nakshatra.endTimeFormatted?.replace(/\b(Today|Tomorrow|IST)\b/gi, '').trim() || '04:12 PM'}
              </Text>
            </View>

            <View style={[styles.almanacTriadCol, styles.almanacTriadDivider]}>
              <Text style={styles.almanacTriadLabel}>YOGA</Text>
              <Text style={styles.almanacTriadVal} numberOfLines={1}>{activeSelectedPanchang.yoga.name}</Text>
              <Text style={styles.almanacTriadSub} numberOfLines={1}>
                Unto {activeSelectedPanchang.yoga.endTimeFormatted?.replace(/\b(Today|Tomorrow|IST)\b/gi, '').trim() || '10:25 AM'}
              </Text>
            </View>

            <View style={[styles.almanacTriadCol, styles.almanacTriadDivider]}>
              <Text style={styles.almanacTriadLabel}>KARANA</Text>
              <Text style={styles.almanacTriadVal} numberOfLines={1}>{activeSelectedPanchang.karana.name}</Text>
              <Text style={styles.almanacTriadSub} numberOfLines={1}>
                Unto {activeSelectedPanchang.karana.endTimeFormatted?.replace(/\b(Today|Tomorrow|IST)\b/gi, '').trim() || '06:10 PM'}
              </Text>
            </View>
          </View>

          {/* Sun & Rahu Pods */}
          <View style={styles.almanacSunRow}>
            <View style={styles.almanacSunChip}>
              <Text style={styles.almanacSunLabel}>🌅 SUNRISE</Text>
              <Text style={styles.almanacSunVal}>{activeSelectedPanchang.sunMoon.sunrise || '06:15 AM'}</Text>
            </View>
            <View style={styles.almanacSunChip}>
              <Text style={styles.almanacSunLabel}>🌇 SUNSET</Text>
              <Text style={styles.almanacSunVal}>{activeSelectedPanchang.sunMoon.sunset || '06:05 PM'}</Text>
            </View>
            <View style={styles.almanacSunChip}>
              <Text style={styles.almanacSunLabel}>⏳ RAHU KAAL</Text>
              <Text style={styles.almanacSunVal}>{getRahuKalamForDate(activeSelectedDateObj)}</Text>
            </View>
          </View>

          {/* Festival Alert Banner if Applicable */}
          {activeSelectedFest && (
            <View style={styles.almanacFestBanner}>
              <Text style={styles.almanacFestText} numberOfLines={1}>
                🪔 {getLocalizedFestivalTitle(activeSelectedFest, language)}
              </Text>
              <View style={styles.almanacShubhaPill}>
                <Text style={styles.almanacShubhaText}>SHUBHA</Text>
              </View>
            </View>
          )}

          {/* Tap to View Full Day Details & Reminders Button */}
          <TouchableOpacity
            style={styles.almanacFullDetailsBtn}
            onPress={() => setSelectedModalDateIso(selectedActiveDateIso)}
            activeOpacity={0.8}
          >
            <Text style={styles.almanacFullDetailsBtnText}>
              VIEW FULL DAY PANCHANG & REMINDERS ➔
            </Text>
          </TouchableOpacity>
        </View>

        {/* 6. MONTHLY FESTIVALS HIGHLIGHTS LIST */}
        <View style={styles.monthlyFestivalsCard}>
          <View style={styles.festivalsCardHeader}>
            <Text style={styles.festivalsCardTitle}>
              ✦ {MONTH_NAMES[month]} Festivals & Vrats
            </Text>
            <Text style={styles.festivalsCardCount}>
              {monthFestivals.length} Observances
            </Text>
          </View>

          {monthFestivals.length === 0 ? (
            <Text style={styles.emptyFestivalsText}>No major festivals listed for this month view.</Text>
          ) : (
            monthFestivals.slice(0, 6).map((fest, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.festivalItemRow}
                onPress={() => {
                  setSelectedActiveDateIso(fest.dateIso);
                  setSelectedModalDateIso(fest.dateIso);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.festDateBadge}>
                  <Text style={styles.festDateDay}>{fest.dateIso.split('-')[2]}</Text>
                  <Text style={styles.festDateMonth}>{MONTH_NAMES[month].slice(0, 3)}</Text>
                </View>
                <View style={styles.festInfoCol}>
                  <Text style={styles.festNameText} numberOfLines={1}>
                    {getLocalizedFestivalTitle(fest, language)}
                  </Text>
                  <Text style={styles.festCategoryText} numberOfLines={1}>
                    {fest.isHoliday ? '🔴 Public Holiday' : '🪔 Auspicious Fast / Vrat'}
                  </Text>
                </View>
                <Text style={styles.festArrow}>›</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* 7. UNIFIED DATE PICKER MODAL (HomeScreen DatePickerModal) */}
      <DatePickerModal
        visible={datePickerModalVisible}
        onClose={() => setDatePickerModalVisible(false)}
        selectedDateIso={selectedActiveDateIso}
        onSelectDateIso={(iso) => {
          try {
            const parts = iso.split('-');
            if (parts.length === 3) {
              const y = parseInt(parts[0], 10);
              const m = parseInt(parts[1], 10) - 1;
              const d = parseInt(parts[2], 10);
              setCurrentDate(new Date(y, m, d));
              setSelectedActiveDateIso(iso);
              if (onSelectDate) onSelectDate(iso);
            }
          } catch (e) {}
          setDatePickerModalVisible(false);
        }}
        onToday={handleToday}
      />

      {/* 8. FULL DAY DETAILS BOTTOM SHEET MODAL */}
      {selectedModalDateIso && (
        <Modal
          visible={!!selectedModalDateIso}
          animationType="slide"
          transparent
          statusBarTranslucent
          onRequestClose={() => setSelectedModalDateIso(null)}
        >
          <View style={styles.bottomSheetOverlay}>
            <View style={styles.bottomSheetCard}>
              <View style={styles.sheetDragBar} />

              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.modalSubHeaderLabel}>
                    SACRED DAY ALMANAC
                  </Text>
                  <Text style={styles.modalTitleDate}>{getLocalizedDateString(mDate, language)}</Text>
                  <Text style={styles.modalSubLocation}>📍 {calendarCity.name}</Text>
                </View>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelectedModalDateIso(null)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 32 }}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {/* 1. TITHI PRADHANA WITH START & END */}
                <View style={styles.detailCard}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardMicroHeader}>TITHI PRADHANA</Text>
                    <Text style={{ fontSize: 16 }}>
                      {mPanchang.tithi.number === 15 ? '🌕' : mPanchang.tithi.number === 30 ? '🌑' : '🌓'}
                    </Text>
                  </View>
                  <View style={styles.tithiHeroRow}>
                    <Text style={styles.tithiHeroName}>{mTithiName}</Text>
                    <View style={styles.pakshaPill}>
                      <Text style={styles.pakshaPillText}>{mPakshaFull}</Text>
                    </View>
                  </View>
                  <View style={styles.startEndRow}>
                    <View style={[styles.startEndBadge, { backgroundColor: '#E9F5EE', borderColor: '#C6E7D2' }]}>
                      <Text style={[styles.startEndLabel, { color: '#237B4B' }]}>Starts</Text>
                      <Text style={[styles.startEndTime, { color: '#1B5E39' }]} numberOfLines={1}>
                        {mPanchang.tithi.startTimeFormatted || '02:40 AM IST'}
                      </Text>
                    </View>
                    <View style={[styles.startEndBadge, { backgroundColor: '#FDF0F0', borderColor: '#FBCACA' }]}>
                      <Text style={[styles.startEndLabel, { color: '#BC2C2C' }]}>Ends</Text>
                      <Text style={[styles.startEndTime, { color: '#991B1B' }]} numberOfLines={1}>
                        {mPanchang.tithi.endTimeFormatted || '01:07 AM IST'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 2. UNIVERSAL ALMANAC REFERENCE / LUNAR DAY ROW (FOR FOREIGNERS) */}
                <View style={styles.lunarDayBox}>
                  <Text style={styles.lunarDayMicro}>UNIVERSAL ALMANAC REFERENCE</Text>
                  <View style={styles.lunarDayRow}>
                    <Text style={styles.lunarDayGlyph}>
                      {mPanchang.tithi.number === 15 ? '🌕' : mPanchang.tithi.number === 30 ? '🌑' : '🌘'}
                    </Text>
                    <Text style={styles.lunarDayText}>{mMoonPhaseStr}</Text>
                  </View>
                </View>

                {/* 3. NAKSHATRA EXACT TIMINGS CARD */}
                <View style={styles.detailCard}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardMicroHeader}>NAKSHATRA</Text>
                    {mPanchang.nakshatra.ruler && (
                      <View style={styles.deityPill}>
                        <Text style={styles.deityPillText}>{mPanchang.nakshatra.ruler}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.nakshatraHeroName}>{mPanchang.nakshatra.name}</Text>
                  <View style={styles.startEndRow}>
                    <View style={[styles.startEndBadge, { backgroundColor: '#FAF5EE', borderColor: '#EADBCE' }]}>
                      <Text style={[styles.startEndLabel, { color: '#7D6A68' }]}>Commenced</Text>
                      <Text style={[styles.startEndTime, { color: '#2B0E14' }]} numberOfLines={1}>
                        {mPanchang.nakshatra.startTimeFormatted || 'Yesterday 11:15 PM'}
                      </Text>
                    </View>
                    <View style={[styles.startEndBadge, { backgroundColor: '#FDF0F0', borderColor: '#FBCACA' }]}>
                      <Text style={[styles.startEndLabel, { color: '#BC2C2C' }]}>Concludes</Text>
                      <Text style={[styles.startEndTime, { color: '#991B1B' }]} numberOfLines={1}>
                        {mPanchang.nakshatra.endTimeFormatted || 'Today 10:46 PM IST'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 4. PANCHANG LIMBS & TIMINGS */}
                <View style={styles.detailCard}>
                  <Text style={styles.detailCardTitle}>Panchang Limbs & Timings</Text>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Yoga:</Text>
                    <Text style={styles.timingVal}>
                      {mPanchang.yoga.name} (Ends {mPanchang.yoga.endTimeFormatted || '07:46 AM'})
                    </Text>
                  </View>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Karana:</Text>
                    <Text style={styles.timingVal}>
                      {mPanchang.karana.name} (Ends {mPanchang.karana.endTimeFormatted || '01:52 PM'})
                    </Text>
                  </View>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Vara (Weekday):</Text>
                    <Text style={styles.timingVal}>
                      {mPanchang.vaara.name} - Ruled by {mPanchang.vaara.rulingPlanet}
                    </Text>
                  </View>
                  <View style={styles.timingDivider} />
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Sunrise / Sunset:</Text>
                    <Text style={styles.timingVal}>{mPanchang.sunMoon.sunrise} • {mPanchang.sunMoon.sunset}</Text>
                  </View>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Moonrise / Moonset:</Text>
                    <Text style={styles.timingVal}>{mPanchang.sunMoon.moonrise || 'N/A'} • {mPanchang.sunMoon.moonset || 'N/A'}</Text>
                  </View>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Abhijit Muhurat:</Text>
                    <Text style={[styles.timingVal, { color: '#237B4B', backgroundColor: '#E9F5EE' }]}>
                      {mPanchang.auspiciousMuhurats.find(m => m.name.toLowerCase().includes('abhijit'))?.startTime || '11:45 AM'} - {mPanchang.auspiciousMuhurats.find(m => m.name.toLowerCase().includes('abhijit'))?.endTime || '12:33 PM'}
                    </Text>
                  </View>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Rahu Kaal:</Text>
                    <Text style={[styles.timingVal, { color: '#BC2C2C', backgroundColor: '#FDF0F0' }]}>
                      {mRahuKaalStr}
                    </Text>
                  </View>
                  <View style={styles.timingDivider} />
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Masa & Samvat:</Text>
                    <Text style={styles.timingVal}>
                      {mMonthName} • Vikram {mPanchang.samvat.vikramSamvat} ({mPanchang.samvat.vikramName})
                    </Text>
                  </View>
                </View>

                {/* 5. FESTIVAL FOR SELECTED CALENDAR (STRICTLY ISOLATED - BLANK IF NONE) */}
                {festMatchModal ? (
                  <View style={styles.modalFestBanner}>
                    <View style={styles.festHeaderRow}>
                      <Text style={styles.modalFestTitle}>🪔 {getLocalizedFestivalTitle(festMatchModal, language)}</Text>
                      <View style={styles.modalFestCategoryPill}>
                        <Text style={styles.modalFestCategoryText}>
                          {festMatchModal.category === 'VRAT' ? 'VRAT' : 'FESTIVAL'}
                        </Text>
                      </View>
                    </View>
                    {festMatchModal.description ? (
                      <Text style={styles.modalFestDesc}>{festMatchModal.description}</Text>
                    ) : null}
                    {festMatchModal.rituals ? (
                      <Text style={[styles.modalFestDesc, { fontStyle: 'italic', marginTop: 4, color: '#991B1B' }]}>
                        ✨ Rituals: {festMatchModal.rituals}
                      </Text>
                    ) : null}
                  </View>
                ) : null}

                {/* Perpetual Mini Ritual Badge if exists */}
                {mRitual && (
                  <View style={styles.modalRitualBox}>
                    <Text style={styles.modalRitualText}>{mRitual}</Text>
                  </View>
                )}

                {/* 6. ACTION BUTTON: SET REMINDER FOR THIS DATE */}
                <TouchableOpacity
                  style={styles.setReminderBtn}
                  onPress={() => {
                    const defaultTime = getNextUpcomingTimeSlot(mDate);
                    setDateRemTimeStr(defaultTime);
                    setDateRemTitle(festMatchModal?.name || `${mTithiName} Puja / Vrat`);
                    setDateRemModalVisible(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.setReminderBtnText}>🔔 Set Vrat / Puja Reminder for This Day</Text>
                </TouchableOpacity>

                {/* 7. DAY & NIGHT CHOGHADIYA ACCORDION */}
                {mChoghadiya && (
                  <View style={styles.chogAccordionContainer}>
                    <View style={styles.filigreeDivider}>
                      <View style={styles.filigreeLine} />
                      <Text style={styles.filigreeSymbol}>✦ ❖ ✦</Text>
                      <View style={styles.filigreeLine} />
                    </View>

                    <View style={styles.chogAccordionCard}>
                      {/* Accordion Trigger Header */}
                      <TouchableOpacity
                        style={styles.chogAccordionHeader}
                        onPress={() => setChoghadiyaExpanded(!choghadiyaExpanded)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.chogHeaderLeft}>
                          <View style={styles.chogIconCircle}>
                            <Text style={styles.chogIconText}>{choghadiyaExpanded ? '☀️' : '⏳'}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.chogHeaderTitle}>Day & Night Choghadiya</Text>
                            <Text style={styles.chogHeaderSubtitle}>
                              {choghadiyaExpanded
                                ? '8 Day & 8 Night Sacred Muhurat Windows'
                                : 'View 16 Sacred Muhurats for Priests & Auspicious Tasks'}
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.chogExpandBtn, choghadiyaExpanded && styles.chogExpandBtnActive]}>
                          <Text style={[styles.chogExpandBtnText, choghadiyaExpanded && styles.chogExpandBtnTextActive]}>
                            {choghadiyaExpanded ? '▲ Collapse' : '▼ View Choghadiya'}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {/* Expanded Choghadiya Content */}
                      {choghadiyaExpanded && (
                        <View style={styles.chogExpandedBody}>
                          {/* Day / Night Segmented Switcher */}
                          <View style={styles.chogTabRow}>
                            <TouchableOpacity
                              style={[styles.chogTabBtn, choghadiyaActiveTab === 'DAY' && styles.chogTabBtnActive]}
                              onPress={() => setChoghadiyaActiveTab('DAY')}
                              activeOpacity={0.8}
                            >
                              <Text style={[styles.chogTabText, choghadiyaActiveTab === 'DAY' && styles.chogTabTextActive]}>
                                ☀️ Day ({mPanchang.sunMoon.sunrise} – {mPanchang.sunMoon.sunset})
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.chogTabBtn, choghadiyaActiveTab === 'NIGHT' && styles.chogTabBtnActive]}
                              onPress={() => setChoghadiyaActiveTab('NIGHT')}
                              activeOpacity={0.8}
                            >
                              <Text style={[styles.chogTabText, choghadiyaActiveTab === 'NIGHT' && styles.chogTabTextActive]}>
                                🌙 Night ({mPanchang.sunMoon.sunset} – Next Sunrise)
                              </Text>
                            </TouchableOpacity>
                          </View>

                          {/* Quick Summary Counts */}
                          {(() => {
                            const activeSlots = choghadiyaActiveTab === 'DAY' ? mChoghadiya.dayChoghadiya : mChoghadiya.nightChoghadiya;
                            const auspCount = activeSlots.filter(s => {
                              const d = getChoghadiyaDetails(s.type);
                              return d.quality === 'AUSPICIOUS' || d.quality === 'HIGHLY_AUSPICIOUS';
                            }).length;
                            const neutCount = activeSlots.filter(s => getChoghadiyaDetails(s.type).quality === 'NEUTRAL').length;
                            const inauspCount = activeSlots.filter(s => getChoghadiyaDetails(s.type).quality === 'INAUSPICIOUS').length;
                            return (
                              <View style={styles.chogSummaryRow}>
                                <Text style={styles.chogSummaryText}>
                                  🟢 {auspCount} Auspicious  •  🟡 {neutCount} Neutral  •  🔴 {inauspCount} Avoid
                                </Text>
                              </View>
                            );
                          })()}

                          {/* 8 Choghadiya Slot Cards */}
                          {(choghadiyaActiveTab === 'DAY' ? mChoghadiya.dayChoghadiya : mChoghadiya.nightChoghadiya).map((slot, index) => {
                            const details = getChoghadiyaDetails(slot.type);
                            const isLive = isChogSlotActiveNow(slot.startTime, slot.endTime, isModalDateToday);
                            const isHigh = details.quality === 'HIGHLY_AUSPICIOUS';
                            const isAusp = details.quality === 'AUSPICIOUS';
                            const isNeut = details.quality === 'NEUTRAL';

                            return (
                              <View
                                key={`chog-${choghadiyaActiveTab}-${index}`}
                                style={[
                                  styles.chogSlotCard,
                                  isLive && styles.chogSlotCardLive,
                                  isHigh && { borderColor: '#DFB059' },
                                ]}
                              >
                                <View style={[styles.chogSlotAccentBar, { backgroundColor: details.accentColor }]} />
                                <View style={styles.chogSlotContent}>
                                  <View style={styles.chogSlotTopRow}>
                                    <View style={styles.chogSlotNameRow}>
                                      <Text style={styles.chogSlotName}>{slot.name}</Text>
                                      {isLive && (
                                        <View style={styles.chogLiveTag}>
                                          <Text style={styles.chogLiveTagText}>● LIVE NOW</Text>
                                        </View>
                                      )}
                                    </View>
                                    <View
                                      style={[
                                        styles.chogQualityBadge,
                                        isHigh && styles.chogQualityBadgeHigh,
                                        isAusp && styles.chogQualityBadgeAuspicious,
                                        isNeut && styles.chogQualityBadgeNeutral,
                                        !isHigh && !isAusp && !isNeut && styles.chogQualityBadgeInauspicious,
                                      ]}
                                    >
                                      <Text
                                        style={[
                                          isHigh && styles.chogQualityTextHigh,
                                          isAusp && styles.chogQualityTextAuspicious,
                                          isNeut && styles.chogQualityTextNeutral,
                                          !isHigh && !isAusp && !isNeut && styles.chogQualityTextInauspicious,
                                        ]}
                                      >
                                        {details.qualityLabel}
                                      </Text>
                                    </View>
                                  </View>

                                  <Text style={styles.chogSlotTime}>
                                    ⏱️ {slot.startTime} – {slot.endTime}
                                  </Text>

                                  <Text style={styles.chogSlotGuidance}>{details.guidance}</Text>
                                </View>
                              </View>
                            );
                          })}

                          {/* Astronomical Location Footnote */}
                          <View style={styles.chogEphemerisNote}>
                            <Text style={styles.chogEphemerisText}>
                              📍 Calculated for {calendarCity.name} using exact Sunrise ({mPanchang.sunMoon.sunrise}) and Sunset ({mPanchang.sunMoon.sunset}).
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* 9. CITY SELECTION MODAL */}
      <CitySelectionModal
        visible={showCityModal}
        selectedCity={calendarCity}
        onSelectCity={(city) => {
          setCalendarCity(city);
          setShowCityModal(false);
        }}
        onClose={() => setShowCityModal(false)}
      />

      {/* 10. CALENDAR SYSTEM SELECTION MODAL */}
      <Modal
        visible={calSystemModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setCalSystemModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.sysModalOverlay}
          activeOpacity={1}
          onPress={() => setCalSystemModalVisible(false)}
        >
          <View style={styles.sysModalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.sysModalHeader}>
              <Text style={styles.sysModalTitle}>Choose Calendar System</Text>
              <TouchableOpacity onPress={() => setCalSystemModalVisible(false)}>
                <Text style={styles.sysCloseBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 380 }}>
              {CALENDAR_SYSTEM_OPTIONS.map((sys) => {
                const isSelected = calendarSystem === sys.id;
                return (
                  <TouchableOpacity
                    key={sys.id}
                    style={[styles.sysOptionItem, isSelected && styles.sysOptionItemActive]}
                    onPress={() => {
                      setCalendarSystem(sys.id);
                      setCalSystemModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.sysOptionIcon}>{sys.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.sysOptionTitle, isSelected && styles.sysOptionTitleActive]}>
                        {sys.title}
                      </Text>
                      <Text style={styles.sysOptionDesc}>{sys.desc}</Text>
                    </View>
                    {isSelected && <Text style={styles.sysCheckmark}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 11. QUICK REMINDER CREATION MODAL */}
      {dateRemModalVisible && (
        <Modal
          visible={dateRemModalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setDateRemModalVisible(false)}
        >
          <View style={styles.remModalOverlay}>
            <View style={styles.remModalCard}>
              <View style={styles.remModalHeader}>
                <Text style={styles.remModalTitle}>Set Ritual / Vrat Reminder</Text>
                <TouchableOpacity onPress={() => setDateRemModalVisible(false)}>
                  <Text style={styles.remCloseBtn}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.remDateSubtitle}>
                📅 {getLocalizedDateString(mDate, language)}
              </Text>

              {/* Title Input */}
              <Text style={styles.inputFieldLabel}>Reminder Title</Text>
              <TextInput
                style={styles.input}
                value={dateRemTitle}
                onChangeText={setDateRemTitle}
                placeholder="e.g. Ekadashi Fasting, Puja at Sunrise"
                placeholderTextColor="#A89A95"
              />

              {/* Time Selector */}
              <Text style={[styles.inputFieldLabel, { marginTop: 12 }]}>Time</Text>
              <TouchableOpacity
                style={styles.timeSelectorBox}
                onPress={() => setTimePickerVisible(true)}
              >
                <Text style={styles.timeSelectorText}>🕒 {dateRemTimeStr}</Text>
                <Text style={styles.timeChangeTag}>Change</Text>
              </TouchableOpacity>

              {/* Notes Input */}
              <Text style={[styles.inputFieldLabel, { marginTop: 12 }]}>Notes / Samagri (Optional)</Text>
              <TextInput
                style={[styles.input, { height: 60 }]}
                value={dateRemNotes}
                onChangeText={setDateRemNotes}
                placeholder="Bring flowers, sweets, fruits..."
                placeholderTextColor="#A89A95"
                multiline
              />

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveReminderBtn}
                onPress={async () => {
                  if (!dateRemTitle.trim()) {
                    Alert.alert('Missing Title', 'Please enter a reminder title.');
                    return;
                  }
                  try {
                    await saveReminder({
                      id: `rem_${Date.now()}`,
                      title: dateRemTitle.trim(),
                      dateIso: selectedModalDateIso || selectedActiveDateIso,
                      timeStr: dateRemTimeStr,
                      notes: dateRemNotes.trim(),
                      category: 'DATE_SPECIFIC',
                      enabled: true,
                      createdAtIso: new Date().toISOString(),
                    });
                    Alert.alert('Reminder Saved', `Reminder scheduled for ${dateRemTimeStr}.`);
                    setDateRemModalVisible(false);
                  } catch (e) {
                    Alert.alert('Error', 'Could not schedule reminder.');
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.saveReminderBtnText}>Save Sacred Reminder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* 12. TIME PICKER MODAL */}
      <TimePickerModal
        visible={timePickerVisible}
        initialTimeStr={dateRemTimeStr}
        targetDate={mDate}
        onConfirm={(timeStr: string) => setDateRemTimeStr(timeStr)}
        onClose={() => setTimePickerVisible(false)}
      />
    </View>
  );
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAL_HORIZONTAL_PADDING = 12;
const CAL_CONTENT_WIDTH = SCREEN_WIDTH - (CAL_HORIZONTAL_PADDING * 2);
const DAY_TILE_WIDTH = Math.floor((CAL_CONTENT_WIDTH - 24) / 7);

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F8F5EE',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: CAL_HORIZONTAL_PADDING,
    paddingBottom: 110, // Breathing space above bottom navigation dock
  },

  // 1. Top Masthead Styles
  masthead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 8,
  },
  brandLeftCol: {
    flex: 1,
    marginRight: 8,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  sunEmblemBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FAF5EA',
    borderWidth: 1,
    borderColor: '#DFB059',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleText: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 22,
    color: '#2B0E14',
    letterSpacing: -0.3,
  },
  brandSubtitleText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#7D6A68',
    letterSpacing: 1.2,
    marginTop: 1,
    marginLeft: 35,
  },
  topChipsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EADBCE',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chipPinIcon: {
    fontSize: 11,
  },
  chipLabelText: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 11,
    color: '#2B0E14',
    maxWidth: 75,
  },
  chipArrow: {
    fontSize: 7,
    color: '#7D6A68',
  },

  // 2. Month Navigation Capsule Card
  monthCapsuleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EADBCE',
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  capsuleArrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8F5EE',
    borderWidth: 1,
    borderColor: '#EADBCE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capsuleArrowText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 18,
    color: '#2B0E14',
    marginTop: -2,
  },
  monthCenterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 8,
    backgroundColor: '#FAF7F0',
    borderWidth: 1,
    borderColor: '#EADBCE',
    borderRadius: 12,
  },
  monthCenterText: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 17,
    color: '#2B0E14',
  },
  monthCenterChevron: {
    fontSize: 9,
    color: '#7D6A68',
  },
  todayPillBtn: {
    backgroundColor: '#2B0E14',
    borderWidth: 1,
    borderColor: '#DFB059',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayPillBtnText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9.5,
    color: '#DFB059',
    letterSpacing: 0.8,
  },
  samvatPillBanner: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#DFB059',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  samvatPillText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    color: '#2B0E14',
    letterSpacing: 0.6,
  },

  // 3. Weekday Row
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  weekdayCol: {
    width: DAY_TILE_WIDTH,
    alignItems: 'center',
  },
  weekdayText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11,
    color: '#7D6A68',
    letterSpacing: 0.5,
  },
  sunWeekdayText: {
    color: '#D32F2F',
  },

  // 4. Calendar Grid & Rounded Tiles
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  emptyTile: {
    width: DAY_TILE_WIDTH,
    height: 84,
    marginVertical: 3,
    backgroundColor: 'transparent',
  },
  dayTile: {
    width: DAY_TILE_WIDTH,
    height: 84,
    marginVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EADBCE',
    backgroundColor: '#FFFDF9',
    paddingHorizontal: 2,
    paddingTop: 3,
    paddingBottom: 3,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  todayDayTile: {
    borderWidth: 2,
    borderColor: '#DFB059',
    backgroundColor: '#FFFDF2',
    shadowColor: '#DFB059',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDayTile: {
    borderWidth: 2,
    borderColor: '#2B0E14',
    backgroundColor: '#FFF8F0',
  },
  todayMicroTag: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#DFB059',
    alignItems: 'center',
    paddingVertical: 1,
    zIndex: 2,
  },
  todayMicroTagText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 6.5,
    color: '#2B0E14',
    letterSpacing: 0.5,
  },
  tileTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
    marginTop: 2,
  },
  tileDayNumText: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 16,
    color: '#2B0E14',
    lineHeight: 18,
  },
  sundayDayNumText: {
    color: '#D32F2F',
  },
  todayDayNumText: {
    color: '#2B0E14',
  },
  tileMoonGlyph: {
    fontSize: 9.5,
  },
  tileTithiRow: {
    alignItems: 'center',
    marginVertical: 1,
  },
  tileTithiText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 7.5,
    color: '#7D6A68',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  tilePakshaText: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 6.5,
    color: '#9E8E88',
    textAlign: 'center',
  },
  tileBadgeBox: {
    borderRadius: 5,
    borderWidth: 0.5,
    paddingVertical: 1.5,
    paddingHorizontal: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 14,
  },
  tileBadgeText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 6.8,
    textAlign: 'center',
    letterSpacing: -0.2,
  },

  // 5. Selected Day Almanac Glance Card (Regal Velvet Burgundy Masterpiece)
  almanacMasterCard: {
    backgroundColor: '#2B0E14',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#DFB059',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  almanacHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  almanacHeaderLeft: {
    flex: 1,
    marginRight: 10,
  },
  almanacHeaderTag: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9.5,
    color: '#DFB059',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  almanacDateTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 20,
    color: '#FFFDF9',
    letterSpacing: -0.2,
  },
  almanacTithiSubtitle: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 12,
    color: '#F5DE9C',
    marginTop: 2,
  },
  almanacMoonOrb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3D151D',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  almanacMoonGlyph: {
    fontSize: 22,
  },
  almanacTriadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.2)',
  },
  almanacTriadCol: {
    flex: 1,
    alignItems: 'center',
  },
  almanacTriadDivider: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(223, 176, 89, 0.2)',
  },
  almanacTriadLabel: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 8.5,
    color: '#DFB059',
    letterSpacing: 0.8,
  },
  almanacTriadVal: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 15,
    color: '#FFFDF9',
    marginTop: 2,
  },
  almanacTriadSub: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 9,
    color: '#D1C4C0',
    marginTop: 1,
  },
  almanacSunRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 10,
  },
  almanacSunChip: {
    flex: 1,
    backgroundColor: 'rgba(61, 21, 29, 0.8)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.25)',
  },
  almanacSunLabel: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 8.5,
    color: '#F5DE9C',
    letterSpacing: 0.5,
  },
  almanacSunVal: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 10.5,
    color: '#FFFDF9',
    marginTop: 2,
  },
  almanacFestBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  almanacFestText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 12,
    color: '#FCA5A5',
    flex: 1,
    marginRight: 6,
  },
  almanacShubhaPill: {
    backgroundColor: '#DFB059',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  almanacShubhaText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 8.5,
    color: '#2B0E14',
    letterSpacing: 0.5,
  },
  almanacFullDetailsBtn: {
    backgroundColor: '#DFB059',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  almanacFullDetailsBtnText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11,
    color: '#2B0E14',
    letterSpacing: 0.8,
  },

  // 6. Monthly Festivals Highlights Card
  monthlyFestivalsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EADBCE',
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  festivalsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8DC',
  },
  festivalsCardTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 16,
    color: '#2B0E14',
  },
  festivalsCardCount: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 10.5,
    color: '#DFB059',
    backgroundColor: '#2B0E14',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  emptyFestivalsText: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 12,
    color: '#7D6A68',
    textAlign: 'center',
    paddingVertical: 12,
  },
  festivalItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F5EFE6',
  },
  festDateBadge: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#EADBCE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  festDateDay: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 16,
    color: '#2B0E14',
    lineHeight: 18,
  },
  festDateMonth: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 8,
    color: '#7D6A68',
    textTransform: 'uppercase',
  },
  festInfoCol: {
    flex: 1,
    marginRight: 6,
  },
  festNameText: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 15,
    color: '#2B0E14',
  },
  festCategoryText: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 10.5,
    color: '#7D6A68',
    marginTop: 1,
  },
  festArrow: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 16,
    color: '#A89A95',
  },

  // 8. Bottom Sheet Modal Styles
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 8, 12, 0.65)',
    justifyContent: 'flex-end',
  },
  bottomSheetCard: {
    backgroundColor: '#FFFDF9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
    height: '85%',
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: '#EADBCE',
  },
  sheetDragBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D6C8B8',
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EADBCE',
  },
  modalSubHeaderLabel: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#DFB059',
    letterSpacing: 1.2,
  },
  modalTitleDate: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 22,
    color: '#2B0E14',
    marginTop: 2,
  },
  modalSubLocation: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 11,
    color: '#7D6A68',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F5EE',
    borderWidth: 1,
    borderColor: '#EADBCE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2B0E14',
  },
  modalFestBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  modalFestTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 17,
    color: '#991B1B',
  },
  modalFestDesc: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11.5,
    color: '#4B1D1D',
    marginTop: 3,
    lineHeight: 16,
  },
  modalRitualBox: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  modalRitualText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 12,
    color: '#C2410C',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EADBCE',
    padding: 14,
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardMicroHeader: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9.5,
    color: '#DFB059',
    letterSpacing: 1.1,
  },
  tithiHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tithiHeroName: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 22,
    color: '#2B0E14',
  },
  pakshaPill: {
    backgroundColor: 'rgba(223, 176, 89, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.4)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pakshaPillText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11,
    color: '#2B0E14',
  },
  startEndRow: {
    flexDirection: 'row',
    gap: 8,
  },
  startEndBadge: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  startEndLabel: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  startEndTime: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11.5,
  },
  lunarDayBox: {
    backgroundColor: '#2B0E14',
    borderWidth: 1,
    borderColor: '#DFB059',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  lunarDayMicro: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 8.5,
    color: '#DFB059',
    letterSpacing: 1.2,
  },
  lunarDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  lunarDayGlyph: {
    fontSize: 18,
  },
  lunarDayText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 13.5,
    color: '#FFFDF9',
  },
  nakshatraHeroName: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 21,
    color: '#2B0E14',
    marginBottom: 10,
  },
  deityPill: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#EADBCE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  deityPillText: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 10.5,
    color: '#7D6A68',
  },
  festHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalFestCategoryPill: {
    backgroundColor: '#FDE68A',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  modalFestCategoryText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 8.5,
    color: '#92400E',
  },
  timingDivider: {
    height: 1,
    backgroundColor: '#F5EFE6',
    marginVertical: 6,
  },
  detailCardTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 15.5,
    color: '#2B0E14',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5EFE6',
    paddingBottom: 4,
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3.5,
  },
  timingLabel: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 12,
    color: '#7D6A68',
  },
  timingVal: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 12,
    color: '#2B0E14',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  setReminderBtn: {
    backgroundColor: '#2B0E14',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DFB059',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  setReminderBtnText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
    color: '#DFB059',
    letterSpacing: 0.6,
  },

  // System Modal Styles
  sysModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 8, 12, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sysModalCard: {
    width: '100%',
    backgroundColor: '#FFFDF9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EADBCE',
    padding: 16,
  },
  sysModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EADBCE',
  },
  sysModalTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 18,
    color: '#2B0E14',
  },
  sysCloseBtn: {
    fontSize: 16,
    color: '#7D6A68',
    paddingHorizontal: 6,
  },
  sysOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 6,
  },
  sysOptionItemActive: {
    backgroundColor: '#FAF5EE',
    borderColor: '#DFB059',
  },
  sysOptionIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sysOptionTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 15,
    color: '#2B0E14',
  },
  sysOptionTitleActive: {
    color: '#2B0E14',
  },
  sysOptionDesc: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 10.5,
    color: '#7D6A68',
    marginTop: 1,
  },
  sysCheckmark: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 14,
    color: '#2B0E14',
    marginLeft: 8,
  },

  // Reminder Modal Styles
  remModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 8, 12, 0.65)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  remModalCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EADBCE',
    padding: 18,
  },
  remModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  remModalTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 18,
    color: '#2B0E14',
  },
  remCloseBtn: {
    fontSize: 16,
    color: '#7D6A68',
  },
  remDateSubtitle: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 12,
    color: '#7D6A68',
    marginBottom: 12,
  },
  inputFieldLabel: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11,
    color: '#2B0E14',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EADBCE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: Fonts.jakartaRegular,
    fontSize: 13,
    color: '#2B0E14',
  },
  timeSelectorBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#EADBCE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  timeSelectorText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
    color: '#2B0E14',
  },
  timeChangeTag: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11,
    color: '#DFB059',
  },
  saveReminderBtn: {
    backgroundColor: '#2B0E14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFB059',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  saveReminderBtnText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 12,
    color: '#DFB059',
    letterSpacing: 0.8,
  },
  // Filigree Divider
  filigreeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  filigreeLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EADBCE',
  },
  filigreeSymbol: {
    marginHorizontal: 12,
    fontSize: 10,
    color: '#DFB059',
    letterSpacing: 2,
  },
  // Choghadiya Accordion Styles
  chogAccordionContainer: {
    marginTop: 4,
    marginBottom: 20,
  },
  chogAccordionCard: {
    backgroundColor: '#FFFDF9',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EADBCE',
    padding: 14,
  },
  chogAccordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chogHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  chogIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#DFB059',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chogIconText: {
    fontSize: 18,
  },
  chogHeaderTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 17,
    color: '#2B0E14',
    letterSpacing: 0.3,
  },
  chogHeaderSubtitle: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11,
    color: '#7D6A68',
    marginTop: 2,
  },
  chogExpandBtn: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#DFB059',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chogExpandBtnActive: {
    backgroundColor: '#2B0E14',
    borderColor: '#DFB059',
  },
  chogExpandBtnText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11,
    color: '#2B0E14',
  },
  chogExpandBtnTextActive: {
    color: '#DFB059',
  },
  chogExpandedBody: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0E6D8',
    paddingTop: 12,
  },
  chogTabRow: {
    flexDirection: 'row',
    backgroundColor: '#FAF5EE',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EADBCE',
    padding: 3,
    marginBottom: 10,
  },
  chogTabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  chogTabBtnActive: {
    backgroundColor: '#2B0E14',
  },
  chogTabText: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 11,
    color: '#6B5238',
  },
  chogTabTextActive: {
    fontFamily: Fonts.jakartaBold,
    color: '#DFB059',
  },
  chogSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF5EE',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  chogSummaryText: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 11,
    color: '#4A3B32',
  },
  chogSlotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EADBCE',
    marginBottom: 8,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  chogSlotCardLive: {
    borderColor: '#DFB059',
    borderWidth: 1.5,
    backgroundColor: '#FFFDF5',
  },
  chogSlotAccentBar: {
    width: 4,
  },
  chogSlotContent: {
    flex: 1,
    padding: 10,
  },
  chogSlotTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chogSlotNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chogSlotName: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 16,
    color: '#2B0E14',
    marginRight: 6,
  },
  chogLiveTag: {
    backgroundColor: '#2B0E14',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 0.5,
    borderColor: '#DFB059',
  },
  chogLiveTagText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#DFB059',
    letterSpacing: 0.5,
  },
  chogQualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  chogQualityBadgeAuspicious: {
    backgroundColor: '#E9F5EE',
    borderWidth: 0.5,
    borderColor: '#A7F3D0',
  },
  chogQualityBadgeHigh: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#DFB059',
  },
  chogQualityBadgeNeutral: {
    backgroundColor: '#FEF3C7',
    borderWidth: 0.5,
    borderColor: '#FDE68A',
  },
  chogQualityBadgeInauspicious: {
    backgroundColor: '#FEF2F2',
    borderWidth: 0.5,
    borderColor: '#FECACA',
  },
  chogQualityTextAuspicious: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    color: '#166534',
  },
  chogQualityTextHigh: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    color: '#065F46',
  },
  chogQualityTextNeutral: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    color: '#92400E',
  },
  chogQualityTextInauspicious: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    color: '#991B1B',
  },
  chogSlotTime: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 12,
    color: '#7D6A68',
    marginBottom: 4,
  },
  chogSlotGuidance: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11,
    color: '#5A4A42',
    lineHeight: 15,
  },
  chogEphemerisNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#FAF5EE',
    borderRadius: 8,
  },
  chogEphemerisText: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 10,
    color: '#7D6A68',
    textAlign: 'center',
  },
});
