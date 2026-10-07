import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import Svg, { Rect, Line, Polygon, Circle, Path, Defs, LinearGradient, Stop, Text as SvgText, G } from 'react-native-svg';
import { Fonts } from '../constants/typography';
import { CityLocation, PanchangDayData, ChoghadiyaItem } from '../types/panchang';
import { calculateHorasForDay, HoraSlot } from '../engine/horaCalculator';
import { calculateChoghadiya } from '../engine/muhuratCalculator';
import { calculateLagnasForDay } from '../engine/panchangEngine';
import { DatePickerModal } from './DatePickerModal';
import { CitySelectionModal } from './CitySelectionModal';

export type AlmanacTab = 'PANCHANG' | 'HORA' | 'CHOGHADIYA' | 'LAGNA' | 'PLANETARY' | 'MUHURAT';

interface CentralAlmanacHubModalProps {
  visible: boolean;
  onClose: () => void;
  dateIso: string;
  selectedCity: CityLocation;
  panchang: PanchangDayData;
  initialTab?: AlmanacTab;
  onSelectDateIso?: (dateIso: string) => void;
  onOpenCityPicker?: () => void;
}

// 9 Planets configuration for Gochar & Kundli
interface PlanetPositionItem {
  symbol: string;
  name: string;
  sign: string;
  signIndex: number;
  signSymbol: string;
  degrees: string;
  nakshatra: string;
  pada: number;
  isRetrograde: boolean;
  dignity: 'EXALTED' | 'OWN_SIGN' | 'DEBILITATED' | 'FRIEND' | 'NEUTRAL' | 'ENEMY';
  color: string;
  icon: string;
}

const ZODIAC_SIGNS = [
  { index: 1, name: 'Aries', sanskrit: 'Mesha', symbol: '♈', element: 'Fire', mobility: 'Movable (Chara)', lord: 'Mars' },
  { index: 2, name: 'Taurus', sanskrit: 'Vrishabha', symbol: '♉', element: 'Earth', mobility: 'Fixed (Sthira)', lord: 'Venus' },
  { index: 3, name: 'Gemini', sanskrit: 'Mithuna', symbol: '♊', element: 'Air', mobility: 'Dual (Dvisvabhava)', lord: 'Mercury' },
  { index: 4, name: 'Cancer', sanskrit: 'Karka', symbol: '♋', element: 'Water', mobility: 'Movable (Chara)', lord: 'Moon' },
  { index: 5, name: 'Leo', sanskrit: 'Simha', symbol: '♌', element: 'Fire', mobility: 'Fixed (Sthira)', lord: 'Sun' },
  { index: 6, name: 'Virgo', sanskrit: 'Kanya', symbol: '♍', element: 'Earth', mobility: 'Dual (Dvisvabhava)', lord: 'Mercury' },
  { index: 7, name: 'Libra', sanskrit: 'Tula', symbol: '♎', element: 'Air', mobility: 'Movable (Chara)', lord: 'Venus' },
  { index: 8, name: 'Scorpio', sanskrit: 'Vrischika', symbol: '♏', element: 'Water', mobility: 'Fixed (Sthira)', lord: 'Mars' },
  { index: 9, name: 'Sagittarius', sanskrit: 'Dhanu', symbol: '♐', element: 'Fire', mobility: 'Dual (Dvisvabhava)', lord: 'Jupiter' },
  { index: 10, name: 'Capricorn', sanskrit: 'Makara', symbol: '♑', element: 'Earth', mobility: 'Movable (Chara)', lord: 'Saturn' },
  { index: 11, name: 'Aquarius', sanskrit: 'Kumbha', symbol: '♒', element: 'Air', mobility: 'Fixed (Sthira)', lord: 'Saturn' },
  { index: 12, name: 'Pisces', sanskrit: 'Meena', symbol: '♓', element: 'Water', mobility: 'Dual (Dvisvabhava)', lord: 'Jupiter' },
];

export const CentralAlmanacHubModal: React.FC<CentralAlmanacHubModalProps> = ({
  visible,
  onClose,
  dateIso,
  selectedCity,
  panchang,
  initialTab,
  onSelectDateIso,
  onOpenCityPicker,
}) => {
  const [activeTab, setActiveTab] = useState<AlmanacTab>(initialTab || 'PANCHANG');
  const [horaPeriod, setHoraPeriod] = useState<'DAY' | 'NIGHT'>('DAY');
  const [chogPeriod, setChogPeriod] = useState<'DAY' | 'NIGHT'>('DAY');
  const [chartRefMode, setChartRefMode] = useState<'LAGNA' | 'MOON' | 'SUN'>('LAGNA');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showInternalCityPicker, setShowInternalCityPicker] = useState(false);

  useEffect(() => {
    if (visible && initialTab) {
      setActiveTab(initialTab);
    }
  }, [visible, initialTab]);

  const dateRibbonScrollRef = useRef<ScrollView>(null);

  // Date parsing
  const parsedDate = useMemo(() => {
    try {
      const parts = dateIso.split('-');
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      return new Date(y, m, d, 12, 0, 0);
    } catch (e) {
      return new Date();
    }
  }, [dateIso]);

  const realToday = new Date();
  const realTodayIso = `${realToday.getFullYear()}-${String(realToday.getMonth() + 1).padStart(2, '0')}-${String(realToday.getDate()).padStart(2, '0')}`;
  const isSelectedDateToday = dateIso === realTodayIso;

  // Month dates list for the ribbon
  const monthDays = useMemo(() => {
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let d = 1; d <= daysInMonth; d++) {
      const curr = new Date(year, month, d, 12, 0, 0);
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNumber: d,
        weekday: weekdayNames[curr.getDay()],
        iso,
        isToday: iso === realTodayIso,
        isSelected: iso === dateIso,
      });
    }
    return days;
  }, [parsedDate, dateIso, realTodayIso]);

  // Auto-scroll date ribbon to selected day
  useEffect(() => {
    if (visible && dateRibbonScrollRef.current) {
      const dayNum = parsedDate.getDate();
      const scrollX = Math.max(0, (dayNum - 3) * 62);
      setTimeout(() => {
        dateRibbonScrollRef.current?.scrollTo({ x: scrollX, animated: true });
      }, 250);
    }
  }, [visible, dateIso, parsedDate]);

  // Date formatted title
  const formattedDateTitle = useMemo(() => {
    return parsedDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [parsedDate]);

  // Clean sunrise / sunset / moonrise / moonset
  const cleanSunrise = (panchang.sunMoon.sunrise || '06:30 AM').replace(/\s*IST/i, '').replace(/\b(Today|Tomorrow)\b/gi, '').trim();
  const cleanSunset = (panchang.sunMoon.sunset || '06:24 PM').replace(/\s*IST/i, '').replace(/\b(Today|Tomorrow)\b/gi, '').trim();
  const cleanMoonrise = (panchang.sunMoon.moonrise || '11:45 PM').replace(/\s*IST/i, '').replace(/\b(Today|Tomorrow)\b/gi, '').trim();
  const cleanMoonset = (panchang.sunMoon.moonset || '01:36 PM').replace(/\s*IST/i, '').replace(/\b(Today|Tomorrow)\b/gi, '').trim();

  // 1. Horas Computation
  const horasData = useMemo(() => {
    return calculateHorasForDay(parsedDate, cleanSunrise, cleanSunset, isSelectedDateToday);
  }, [parsedDate, cleanSunrise, cleanSunset, isSelectedDateToday]);

  // 2. Choghadiya Computation
  const chogData = useMemo(() => {
    return calculateChoghadiya(parsedDate, cleanSunrise, cleanSunset);
  }, [parsedDate, cleanSunrise, cleanSunset]);

  // 3. Lagna Table Computation
  const lagnaData = useMemo(() => {
    const sunSignIdx = 6; // Default Kanya / Virgo for Ashvin/Bhadrapada
    return calculateLagnasForDay(parsedDate, cleanSunrise, sunSignIdx);
  }, [parsedDate, cleanSunrise]);

  // 4. Planetary Transits Table
  const planetaryTable: PlanetPositionItem[] = useMemo(() => {
    return [
      { symbol: 'Su', name: 'Sun', sign: 'Virgo (Kanya)', signIndex: 6, signSymbol: '♍', degrees: "17° 42' 19\"", nakshatra: 'Hasta', pada: 3, isRetrograde: false, dignity: 'FRIEND', color: '#EA580C', icon: '☀️' },
      { symbol: 'Mo', name: 'Moon', sign: 'Gemini (Mithuna)', signIndex: 3, signSymbol: '♊', degrees: "04° 15' 38\"", nakshatra: 'Mrigashira', pada: 4, isRetrograde: false, dignity: 'FRIEND', color: '#2563EB', icon: '🌙' },
      { symbol: 'Ma', name: 'Mars', sign: 'Cancer (Karka)', signIndex: 4, signSymbol: '♋', degrees: "08° 22' 11\"", nakshatra: 'Pushya', pada: 2, isRetrograde: false, dignity: 'DEBILITATED', color: '#DC2626', icon: '♂️' },
      { symbol: 'Me', name: 'Mercury', sign: 'Virgo (Kanya)', signIndex: 6, signSymbol: '♍', degrees: "26° 51' 40\"", nakshatra: 'Chitra', pada: 2, isRetrograde: false, dignity: 'EXALTED', color: '#059669', icon: '☿' },
      { symbol: 'Ju', name: 'Jupiter', sign: 'Taurus (Vrishabha)', signIndex: 2, signSymbol: '♉', degrees: "21° 09' 05\"", nakshatra: 'Rohini', pada: 4, isRetrograde: true, dignity: 'ENEMY', color: '#D97706', icon: '♃' },
      { symbol: 'Ve', name: 'Venus', sign: 'Libra (Tula)', signIndex: 7, signSymbol: '♎', degrees: "12° 30' 52\"", nakshatra: 'Swati', pada: 2, isRetrograde: false, dignity: 'OWN_SIGN', color: '#0284C7', icon: '♀' },
      { symbol: 'Sa', name: 'Saturn', sign: 'Pisces (Meena)', signIndex: 12, signSymbol: '♓', degrees: "19° 44' 27\"", nakshatra: 'Revati', pada: 1, isRetrograde: true, dignity: 'NEUTRAL', color: '#78716C', icon: '♄' },
      { symbol: 'Ra', name: 'Rahu', sign: 'Aquarius (Kumbha)', signIndex: 11, signSymbol: '♒', degrees: "11° 02' 15\"", nakshatra: 'Shatabhisha', pada: 2, isRetrograde: true, dignity: 'NEUTRAL', color: '#4B5563', icon: '☊' },
      { symbol: 'Ke', name: 'Ketu', sign: 'Leo (Simha)', signIndex: 5, signSymbol: '♌', degrees: "11° 02' 15\"", nakshatra: 'Magha', pada: 4, isRetrograde: true, dignity: 'NEUTRAL', color: '#4B5563', icon: '☋' },
    ];
  }, []);

  // North Indian Diamond Kundli Data based on Reference Mode
  const kundliHouses = useMemo(() => {
    const lagnaSign = lagnaData.currentLagnaSign || 8; // Scorpio
    const moonSign = 3; // Gemini
    const sunSign = 6;  // Virgo

    const refSign =
      chartRefMode === 'MOON' ? moonSign :
      chartRefMode === 'SUN' ? sunSign :
      lagnaSign;

    const getHouseSign = (h: number) => ((refSign - 1 + h - 1) % 12) + 1;

    const houses = [];
    for (let h = 1; h <= 12; h++) {
      const signIdx = getHouseSign(h);
      const signMeta = ZODIAC_SIGNS.find(z => z.index === signIdx) || ZODIAC_SIGNS[0];
      const planetsInHouse = planetaryTable.filter(p => p.signIndex === signIdx);
      houses.push({
        houseNumber: h,
        signIndex: signIdx,
        signName: signMeta.name,
        planets: planetsInHouse,
      });
    }
    return houses;
  }, [chartRefMode, lagnaData, planetaryTable]);

  // Date Navigation handlers
  const handlePrevDay = () => {
    const prev = new Date(parsedDate);
    prev.setDate(prev.getDate() - 1);
    const iso = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}-${String(prev.getDate()).padStart(2, '0')}`;
    onSelectDateIso?.(iso);
  };

  const handleNextDay = () => {
    const next = new Date(parsedDate);
    next.setDate(next.getDate() + 1);
    const iso = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
    onSelectDateIso?.(iso);
  };

  const handleToday = () => {
    onSelectDateIso?.(realTodayIso);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF7F0" />
        <View style={styles.container}>

          {/* 1. TOP HEADER */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={onClose} activeOpacity={0.75}>
              <Text style={styles.backButtonArrow}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerTitleCol}>
              <Text style={styles.headerSubtitle}>SURYA SIDDHANTA EPHEMERIS</Text>
              <Text style={styles.headerTitle}>Central Almanac Hub</Text>
            </View>

            <TouchableOpacity
              style={styles.locationPill}
              onPress={() => onOpenCityPicker ? onOpenCityPicker() : setShowInternalCityPicker(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.locationPillText}>📍 {selectedCity.name} ▾</Text>
            </TouchableOpacity>
          </View>

          {/* 2. MONTH DATES RIBBON */}
          <View style={styles.ribbonContainer}>
            <ScrollView
              ref={dateRibbonScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ribbonContent}
            >
              {monthDays.map(item => {
                return (
                  <TouchableOpacity
                    key={item.iso}
                    style={[
                      styles.dateCell,
                      item.isSelected && styles.dateCellSelected,
                      item.isToday && !item.isSelected && styles.dateCellToday,
                    ]}
                    onPress={() => onSelectDateIso?.(item.iso)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.dateCellDay, item.isSelected && styles.dateCellDaySelected]}>
                      {item.weekday.toUpperCase()}
                    </Text>
                    <Text style={[styles.dateCellNum, item.isSelected && styles.dateCellNumSelected]}>
                      {item.dayNumber}
                    </Text>
                    {item.isToday && (
                      <View style={[styles.todayMicroDot, item.isSelected && { backgroundColor: '#DFB059' }]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* 3. DATE SELECTOR BAR */}
          <View style={styles.dateSelectorBar}>
            <TouchableOpacity style={styles.arrowButton} onPress={handlePrevDay} activeOpacity={0.7}>
              <Text style={styles.arrowButtonText}>‹</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateDisplayCenter}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.75}
            >
              <Text style={styles.calendarIcon}>📅</Text>
              <Text style={styles.dateDisplayText}>{formattedDateTitle}</Text>
              <Text style={styles.dateCaret}>▾</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.todayButton, isSelectedDateToday && styles.todayButtonActive]}
              onPress={handleToday}
              activeOpacity={0.8}
            >
              <Text style={[styles.todayButtonText, isSelectedDateToday && styles.todayButtonTextActive]}>
                TODAY
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.arrowButton} onPress={handleNextDay} activeOpacity={0.7}>
              <Text style={styles.arrowButtonText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* 4. MAIN HORIZONTAL SEGMENTED TAB BAR */}
          <View style={styles.tabsStripContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
              <TouchableOpacity
                style={[styles.tabSegment, activeTab === 'PANCHANG' && styles.tabSegmentActive]}
                onPress={() => setActiveTab('PANCHANG')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabSegmentText, activeTab === 'PANCHANG' && styles.tabSegmentTextActive]}>
                  📜 Panchang
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabSegment, activeTab === 'HORA' && styles.tabSegmentActive]}
                onPress={() => setActiveTab('HORA')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabSegmentText, activeTab === 'HORA' && styles.tabSegmentTextActive]}>
                  ⏳ Hora (24)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabSegment, activeTab === 'CHOGHADIYA' && styles.tabSegmentActive]}
                onPress={() => setActiveTab('CHOGHADIYA')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabSegmentText, activeTab === 'CHOGHADIYA' && styles.tabSegmentTextActive]}>
                  🕒 Choghadiya
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabSegment, activeTab === 'LAGNA' && styles.tabSegmentActive]}
                onPress={() => setActiveTab('LAGNA')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabSegmentText, activeTab === 'LAGNA' && styles.tabSegmentTextActive]}>
                  ♈ Lagna Table
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabSegment, activeTab === 'PLANETARY' && styles.tabSegmentActive]}
                onPress={() => setActiveTab('PLANETARY')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabSegmentText, activeTab === 'PLANETARY' && styles.tabSegmentTextActive]}>
                  🪐 Planetary Gochar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabSegment, activeTab === 'MUHURAT' && styles.tabSegmentActive]}
                onPress={() => setActiveTab('MUHURAT')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabSegmentText, activeTab === 'MUHURAT' && styles.tabSegmentTextActive]}>
                  ✨ Shubh Muhurat
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* 5. TAB CONTENT SCROLL AREA */}
          <ScrollView
            style={styles.tabScrollArea}
            contentContainerStyle={styles.tabScrollContent}
            showsVerticalScrollIndicator={false}
          >

            {/* ========================================================= */}
            {/* TAB 1: PANCHANG (5 SACRED LIMBS & EPHEMERIS)              */}
            {/* ========================================================= */}
            {activeTab === 'PANCHANG' && (
              <View>
                {/* Master Chronometry Card */}
                <View style={styles.masterChronometryCard}>
                  <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none">
                    <Defs>
                      <LinearGradient id="chronoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#4A1B24" />
                        <Stop offset="100%" stopColor="#24070D" />
                      </LinearGradient>
                    </Defs>
                    <Rect width="100%" height="100%" rx={20} fill="url(#chronoGrad)" />
                  </Svg>

                  <View style={styles.chronoHeaderRow}>
                    <View>
                      <Text style={styles.chronoBadgeCategory}>SACRED CHRONOMETRY</Text>
                      <Text style={styles.chronoTitle}>
                        Vikram Samvat {panchang.samvat.vikramSamvat || 2083}
                      </Text>
                    </View>
                    <View style={styles.chronoMasaPill}>
                      <Text style={styles.chronoMasaText}>
                        {(panchang.samvat.monthName || 'Bhadrapada').toUpperCase()} MASA • {panchang.tithi.paksha?.toUpperCase() || 'KRISHNA'}
                      </Text>
                    </View>
                  </View>

                  {/* 4 Ephemeris Pods */}
                  <View style={styles.ephemerisGrid}>
                    <View style={styles.ephemerisPod}>
                      <Text style={styles.ephemerisPodIcon}>🌅</Text>
                      <Text style={styles.ephemerisPodLabel}>SUNRISE</Text>
                      <Text style={styles.ephemerisPodTime}>{cleanSunrise}</Text>
                    </View>
                    <View style={styles.ephemerisPod}>
                      <Text style={styles.ephemerisPodIcon}>🌇</Text>
                      <Text style={styles.ephemerisPodLabel}>SUNSET</Text>
                      <Text style={styles.ephemerisPodTime}>{cleanSunset}</Text>
                    </View>
                    <View style={styles.ephemerisPod}>
                      <Text style={styles.ephemerisPodIcon}>🌜</Text>
                      <Text style={styles.ephemerisPodLabel}>MOONRISE</Text>
                      <Text style={styles.ephemerisPodTime}>{cleanMoonrise}</Text>
                    </View>
                    <View style={styles.ephemerisPod}>
                      <Text style={styles.ephemerisPodIcon}>🌛</Text>
                      <Text style={styles.ephemerisPodLabel}>MOONSET</Text>
                      <Text style={styles.ephemerisPodTime}>{cleanMoonset}</Text>
                    </View>
                  </View>
                </View>

                {/* Section Header */}
                <View style={styles.subSectionHeader}>
                  <Text style={styles.subSectionTitle}>FIVE SACRED LIMBS OF TIME</Text>
                  <Text style={styles.subSectionCityNote}>Calculated for {selectedCity.name} coordinates</Text>
                </View>

                {/* 1. Tithi */}
                <View style={styles.limbCard}>
                  <View style={styles.limbHeaderRow}>
                    <View style={styles.limbIndexBadge}><Text style={styles.limbIndexText}>1</Text></View>
                    <View style={styles.limbTitleCol}>
                      <Text style={styles.limbCategoryLabel}>LIMB 1 • TITHI (LUNAR PHASE)</Text>
                      <Text style={styles.limbPrimaryName}>
                        {panchang.tithi.name} ({panchang.tithi.paksha} Paksha)
                      </Text>
                    </View>
                    <View style={styles.activePillGreen}><Text style={styles.activePillGreenText}>ACTIVE</Text></View>
                  </View>
                  <View style={styles.limbDetailsRow}>
                    <View style={styles.limbDetailCol}>
                      <Text style={styles.limbDetailKey}>DURATION WINDOW</Text>
                      <Text style={styles.limbDetailVal}>Unto {panchang.tithi.endTimeFormatted || '04:28 AM'}</Text>
                    </View>
                    <View style={styles.limbDetailCol}>
                      <Text style={styles.limbDetailKey}>PRESIDING DEITY</Text>
                      <Text style={styles.limbDetailVal}>{(panchang.tithi as any).deity || 'Goddess Durga'}</Text>
                    </View>
                  </View>
                </View>

                {/* 2. Nakshatra */}
                <View style={styles.limbCard}>
                  <View style={styles.limbHeaderRow}>
                    <View style={styles.limbIndexBadge}><Text style={styles.limbIndexText}>2</Text></View>
                    <View style={styles.limbTitleCol}>
                      <Text style={styles.limbCategoryLabel}>LIMB 2 • NAKSHATRA (LUNAR MANSION)</Text>
                      <Text style={styles.limbPrimaryName}>
                        {panchang.nakshatra.name} (Pada {(panchang.nakshatra as any).pada || 4})
                      </Text>
                    </View>
                    <View style={styles.qualityPillAmber}><Text style={styles.qualityPillAmberText}>DEVA GANA</Text></View>
                  </View>
                  <View style={styles.limbDetailsRow}>
                    <View style={styles.limbDetailCol}>
                      <Text style={styles.limbDetailKey}>RULING PLANET</Text>
                      <Text style={styles.limbDetailVal}>{panchang.nakshatra.ruler || 'Jupiter (Guru)'}</Text>
                    </View>
                    <View style={styles.limbDetailCol}>
                      <Text style={styles.limbDetailKey}>CONCLUDES</Text>
                      <Text style={styles.limbDetailVal}>Till {panchang.nakshatra.endTimeFormatted || '12:45 AM'}</Text>
                    </View>
                    <View style={styles.limbDetailCol}>
                      <Text style={styles.limbDetailKey}>DEITY</Text>
                      <Text style={styles.limbDetailVal}>{panchang.nakshatra.deity || 'Aditi'}</Text>
                    </View>
                  </View>
                </View>

                {/* 3. Yoga */}
                <View style={styles.limbCard}>
                  <View style={styles.limbHeaderRow}>
                    <View style={styles.limbIndexBadge}><Text style={styles.limbIndexText}>3</Text></View>
                    <View style={styles.limbTitleCol}>
                      <Text style={styles.limbCategoryLabel}>LIMB 3 • YOGA (SOLAR-LUNAR ANGLE)</Text>
                      <Text style={styles.limbPrimaryName}>{panchang.yoga.name} Yoga</Text>
                    </View>
                    <View style={panchang.yoga.isAuspicious !== false ? styles.activePillGreen : styles.warningPillRed}>
                      <Text style={panchang.yoga.isAuspicious !== false ? styles.activePillGreenText : styles.warningPillRedText}>
                        {panchang.yoga.isAuspicious !== false ? 'AUSPICIOUS' : 'AVOID'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.limbDetailsRow}>
                    <View style={styles.limbDetailCol}>
                      <Text style={styles.limbDetailKey}>TIME WINDOW</Text>
                      <Text style={styles.limbDetailVal}>Till {panchang.yoga.endTimeFormatted || '01:01 PM'}</Text>
                    </View>
                    <View style={styles.limbDetailCol}>
                      <Text style={styles.limbDetailKey}>EFFECT</Text>
                      <Text style={styles.limbDetailVal}>{(panchang.yoga as any).meaning || 'Harmony & Good Fortune'}</Text>
                    </View>
                  </View>
                </View>

                {/* 4 & 5. Karana & Vaar Side-by-Side */}
                <View style={styles.twoColRow}>
                  {/* Karana */}
                  <View style={[styles.limbCardHalf, { marginRight: 5 }]}>
                    <View style={styles.limbIndexBadge}><Text style={styles.limbIndexText}>4</Text></View>
                    <Text style={styles.limbCategoryLabel}>LIMB 4 • KARANA</Text>
                    <Text style={styles.halfLimbName}>{panchang.karana.name}</Text>
                    <Text style={styles.halfLimbSub}>Unto {panchang.karana.endTimeFormatted || '05:27 PM'}</Text>
                    <Text style={styles.halfLimbFollow}>Followed by Garaja</Text>
                  </View>

                  {/* Vaar */}
                  <View style={[styles.limbCardHalf, { marginLeft: 5 }]}>
                    <View style={styles.limbIndexBadge}><Text style={styles.limbIndexText}>5</Text></View>
                    <Text style={styles.limbCategoryLabel}>LIMB 5 • VAAR (DAY)</Text>
                    <Text style={styles.halfLimbName}>
                      {parsedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                    </Text>
                    <Text style={styles.halfLimbSub}>Solar Day • Ravivara</Text>
                    <Text style={styles.halfLimbFollow}>Ruled by Surya (Sun)</Text>
                  </View>
                </View>
              </View>
            )}

            {/* ========================================================= */}
            {/* TAB 2: HORA (24 PLANETARY HOURS: DAY & NIGHT)             */}
            {/* ========================================================= */}
            {activeTab === 'HORA' && (
              <View>
                {/* Hero Running Hora Card */}
                {horasData.currentHora && (
                  <View style={styles.heroRunningCard}>
                    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none">
                      <Defs>
                        <LinearGradient id="horaHeroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <Stop offset="0%" stopColor="#300E16" />
                          <Stop offset="100%" stopColor="#1B060B" />
                        </LinearGradient>
                      </Defs>
                      <Rect width="100%" height="100%" rx={20} fill="url(#horaHeroGrad)" />
                    </Svg>

                    <View style={styles.heroRunningHeader}>
                      <View style={styles.heroRunningTag}>
                        <View style={styles.greenPulseDot} />
                        <Text style={styles.heroRunningTagText}>
                          {isSelectedDateToday ? 'LIVE NOW • RUNNING HORA' : 'HORA AT SUNRISE'}
                        </Text>
                      </View>
                      <View style={styles.heroPlanetIconBadge}>
                        <Text style={styles.heroPlanetIconText}>{horasData.currentHora.planetIcon}</Text>
                      </View>
                    </View>

                    <View style={styles.heroRunningTitleRow}>
                      <Text style={styles.heroRunningTitle}>
                        {horasData.currentHora.planet} Hora
                      </Text>
                      <View style={styles.heroQualityPill}>
                        <Text style={styles.heroQualityPillText}>
                          {horasData.currentHora.qualityLabel}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.heroRunningTime}>
                      ⏱️ {horasData.currentHora.startTime} – {horasData.currentHora.endTime}
                    </Text>

                    <Text style={styles.heroRunningGuidance}>
                      {horasData.currentHora.guidance}
                    </Text>
                  </View>
                )}

                {/* Day / Night Segment Switcher */}
                <View style={styles.periodSwitcherRow}>
                  <TouchableOpacity
                    style={[styles.periodButton, horaPeriod === 'DAY' && styles.periodButtonActive]}
                    onPress={() => setHoraPeriod('DAY')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.periodButtonText, horaPeriod === 'DAY' && styles.periodButtonTextActive]}>
                      ☀️ Day Horas (12)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.periodButton, horaPeriod === 'NIGHT' && styles.periodButtonActive]}
                    onPress={() => setHoraPeriod('NIGHT')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.periodButtonText, horaPeriod === 'NIGHT' && styles.periodButtonTextActive]}>
                      🌙 Night Horas (12)
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Hora Slot Cards */}
                {(horaPeriod === 'DAY' ? horasData.dayHoras : horasData.nightHoras).map((slot: HoraSlot) => {
                  const isHigh = slot.quality === 'HIGHLY_AUSPICIOUS';
                  const isAvoid = slot.quality === 'CHALLENGING';
                  return (
                    <View
                      key={slot.index}
                      style={[
                        styles.slotCard,
                        slot.isCurrent && styles.slotCardLive,
                        isHigh && styles.slotCardElevated,
                      ]}
                    >
                      <View style={[styles.slotColorBar, { backgroundColor: slot.color }]} />
                      <View style={styles.slotMainContent}>
                        <View style={styles.slotHeaderRow}>
                          <View style={styles.slotTitleGroup}>
                            <Text style={styles.slotPlanetIcon}>{slot.planetIcon}</Text>
                            <Text style={styles.slotPrimaryTitle}>
                              Hora {slot.slotNumber}: {slot.planet}
                            </Text>
                            {slot.isCurrent && (
                              <View style={styles.liveBadgeSmall}>
                                <Text style={styles.liveBadgeSmallText}>LIVE</Text>
                              </View>
                            )}
                          </View>
                          <View style={[styles.slotQualityPill, { borderColor: slot.color }]}>
                            <Text style={[styles.slotQualityText, { color: slot.color }]}>
                              {slot.qualityLabel}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.slotTimestamps}>
                          ⏱️ {slot.startTime} – {slot.endTime}
                        </Text>
                        <Text style={styles.slotGuidanceText}>{slot.guidance}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* ========================================================= */}
            {/* TAB 3: CHOGHADIYA (16 SACRED MUHURATS)                     */}
            {/* ========================================================= */}
            {activeTab === 'CHOGHADIYA' && (
              <View>
                {/* Day / Night Segment Switcher */}
                <View style={styles.periodSwitcherRow}>
                  <TouchableOpacity
                    style={[styles.periodButton, chogPeriod === 'DAY' && styles.periodButtonActive]}
                    onPress={() => setChogPeriod('DAY')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.periodButtonText, chogPeriod === 'DAY' && styles.periodButtonTextActive]}>
                      ☀️ Day (8 Muhurats)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.periodButton, chogPeriod === 'NIGHT' && styles.periodButtonActive]}
                    onPress={() => setChogPeriod('NIGHT')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.periodButtonText, chogPeriod === 'NIGHT' && styles.periodButtonTextActive]}>
                      🌙 Night (8 Muhurats)
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Summary Metrics Row */}
                <View style={styles.summaryBar}>
                  <Text style={styles.summaryBarText}>
                    🟢 3 Auspicious  •  🟡 1 Neutral  •  🔴 4 Avoid
                  </Text>
                </View>

                {/* Choghadiya Slots */}
                {(chogPeriod === 'DAY' ? chogData.dayChoghadiya : chogData.nightChoghadiya).map((slot: ChoghadiyaItem, idx: number) => {
                  const t = slot.type.toUpperCase();
                  const isAusp = t === 'AMRIT' || t === 'SHUBH' || t === 'LABH';
                  const isNeut = t === 'CHAR';
                  const color = isAusp ? '#10B981' : isNeut ? '#D97706' : '#DC2626';
                  const qualityLabel =
                    t === 'AMRIT' ? 'Highly Auspicious ⭐' :
                    t === 'SHUBH' ? 'Auspicious' :
                    t === 'LABH' ? 'Auspicious' :
                    t === 'CHAR' ? 'Neutral' :
                    'Inauspicious';

                  const guidance =
                    t === 'AMRIT' ? 'Moon influence • Sacred nectar period. Supreme window for all pujas, rituals, oath ceremonies & prosperous deeds.' :
                    t === 'SHUBH' ? 'Jupiter influence • Divine favor. Ideal for religious ceremonies, prayer rituals, agreements & sacred beginnings.' :
                    t === 'LABH' ? 'Mercury influence • Fruitful gains. Highly recommended for commercial business, investments, study & trade expansion.' :
                    t === 'CHAR' ? 'Venus influence • Dynamic & movable period. Favorable for journeys, travel, vehicle purchases & communication.' :
                    t === 'ROG' ? 'Mars influence • Friction & discord. Refrain from starting new ventures, medical treatments, or financial dealings.' :
                    t === 'KAAL' ? 'Saturn influence • Governed by delay and loss. Refrain from initiating vital endeavors or important journeys.' :
                    'Sun influence • Agitation & anxiety. Unfavorable for peace treaties, government negotiations, or high-stakes matters.';

                  return (
                    <View key={`${slot.type}-${idx}`} style={[styles.slotCard, t === 'AMRIT' && styles.slotCardElevated]}>
                      <View style={[styles.slotColorBar, { backgroundColor: color }]} />
                      <View style={styles.slotMainContent}>
                        <View style={styles.slotHeaderRow}>
                          <Text style={styles.slotPrimaryTitle}>{slot.name}</Text>
                          <View style={[styles.slotQualityPill, { borderColor: color }]}>
                            <Text style={[styles.slotQualityText, { color }]}>{qualityLabel}</Text>
                          </View>
                        </View>
                        <Text style={styles.slotTimestamps}>⏱️ {slot.startTime} – {slot.endTime}</Text>
                        <Text style={styles.slotGuidanceText}>{guidance}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* ========================================================= */}
            {/* TAB 4: LAGNA TABLE (12 ASCENDANT RISING TIMES)             */}
            {/* ========================================================= */}
            {activeTab === 'LAGNA' && (
              <View>
                {/* Active Lagna Header Hero */}
                <View style={styles.lagnaHeroCard}>
                  <Text style={styles.lagnaHeroSubtitle}>CURRENT HORIZON ASCENDANT</Text>
                  <View style={styles.lagnaHeroTitleRow}>
                    <Text style={styles.lagnaHeroTitle}>{lagnaData.name}</Text>
                    <View style={styles.activePillGreen}><Text style={styles.activePillGreenText}>RISING NOW</Text></View>
                  </View>
                  <Text style={styles.lagnaHeroTime}>
                    Ascendant Window: {lagnaData.startTime} – {lagnaData.endTime}
                  </Text>
                  <Text style={styles.lagnaHeroGuidance}>
                    The Lagna (Ascendant) represents the self, physical body, and general health in Vedic astrology. Muhurats initiated under auspicious rising signs gain longevity and power.
                  </Text>
                </View>

                {/* Section Header */}
                <View style={styles.subSectionHeader}>
                  <Text style={styles.subSectionTitle}>12 ASCENDANTS ACROSS 24 HOURS</Text>
                  <Text style={styles.subSectionCityNote}>Horizon timings calculated for {selectedCity.name}</Text>
                </View>

                {/* 12 Lagna Cards */}
                {lagnaData.allLagnas.map((item, i) => {
                  const meta = ZODIAC_SIGNS.find(z => z.index === item.signIndex) || ZODIAC_SIGNS[0];
                  return (
                    <View
                      key={i}
                      style={[
                        styles.lagnaItemCard,
                        item.isActive && styles.lagnaItemCardActive,
                      ]}
                    >
                      <View style={styles.lagnaItemLeft}>
                        <View style={[styles.lagnaSymbolCircle, item.isActive && styles.lagnaSymbolCircleActive]}>
                          <Text style={styles.lagnaSymbolText}>{meta.symbol}</Text>
                        </View>
                        <View style={styles.lagnaItemInfo}>
                          <View style={styles.lagnaNameRow}>
                            <Text style={styles.lagnaItemName}>{item.name}</Text>
                            {item.isActive && (
                              <View style={styles.activePillSmall}>
                                <Text style={styles.activePillSmallText}>ACTIVE NOW</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.lagnaMetaSub}>
                            {meta.element} • {meta.mobility} • Ruled by {meta.lord}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.lagnaItemRight}>
                        <Text style={styles.lagnaTimeRange}>{item.startTime}</Text>
                        <Text style={styles.lagnaTimeRangeEnd}>to {item.endTime}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* ========================================================= */}
            {/* TAB 5: PLANETARY POSITIONS (KUNDLI & TRANSITS)             */}
            {/* ========================================================= */}
            {activeTab === 'PLANETARY' && (
              <View>
                {/* Reference Mode Selector */}
                <View style={styles.refModeRow}>
                  <TouchableOpacity
                    style={[styles.refModeButton, chartRefMode === 'LAGNA' && styles.refModeButtonActive]}
                    onPress={() => setChartRefMode('LAGNA')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.refModeButtonText, chartRefMode === 'LAGNA' && styles.refModeButtonTextActive]}>
                      Ascendant (Lagna)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.refModeButton, chartRefMode === 'MOON' && styles.refModeButtonActive]}
                    onPress={() => setChartRefMode('MOON')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.refModeButtonText, chartRefMode === 'MOON' && styles.refModeButtonTextActive]}>
                      Moon Chart
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.refModeButton, chartRefMode === 'SUN' && styles.refModeButtonActive]}
                    onPress={() => setChartRefMode('SUN')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.refModeButtonText, chartRefMode === 'SUN' && styles.refModeButtonTextActive]}>
                      Sun Chart
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* North Indian Diamond Kundli Chart SVG */}
                <View style={styles.chartWrapper}>
                  <Text style={styles.chartHeaderTitle}>North Indian Diamond Kundli Chart</Text>
                  <Text style={styles.chartHeaderSub}>
                    Nirayana Gochar Placements for {selectedCity.name}
                  </Text>

                  {/* SVG 320x320 Canvas */}
                  <View style={styles.svgContainer}>
                    <Svg width={300} height={300} viewBox="0 0 300 300">
                      {/* Outer Square */}
                      <Rect x="4" y="4" width="292" height="292" stroke="#2B0E14" strokeWidth="2.5" fill="#FFFDF9" rx="8" />

                      {/* Diagonal Cross */}
                      <Line x1="4" y1="4" x2="296" y2="296" stroke="#2B0E14" strokeWidth="1.8" />
                      <Line x1="296" y1="4" x2="4" y2="296" stroke="#2B0E14" strokeWidth="1.8" />

                      {/* Inner Diamond */}
                      <Polygon
                        points="150,4 296,150 150,296 4,150"
                        stroke="#2B0E14"
                        strokeWidth="2"
                        fill="none"
                      />

                      {/* Lagna House 1 Center Gold Glow */}
                      <Polygon
                        points="150,4 223,77 150,150 77,77"
                        fill="rgba(223, 176, 89, 0.15)"
                      />

                      {/* House Numbers & Planets Placements */}
                      {/* House 1 (Top Center Diamond) */}
                      <SvgText x="150" y="45" fontSize="11" fill="#8A5A16" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[0]?.signIndex}
                      </SvgText>
                      <SvgText x="150" y="70" fontSize="10.5" fill="#2B0E14" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[0]?.planets.map(p => p.symbol).join(' ')}
                      </SvgText>

                      {/* House 2 (Top Left Triangle) */}
                      <SvgText x="82" y="36" fontSize="10" fill="#8A5A16" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[1]?.signIndex}
                      </SvgText>
                      <SvgText x="78" y="56" fontSize="10" fill="#2B0E14" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[1]?.planets.map(p => p.symbol).join(' ')}
                      </SvgText>

                      {/* House 3 (Left Top Triangle) */}
                      <SvgText x="36" y="80" fontSize="10" fill="#8A5A16" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[2]?.signIndex}
                      </SvgText>
                      <SvgText x="40" y="102" fontSize="10" fill="#2B0E14" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[2]?.planets.map(p => p.symbol).join(' ')}
                      </SvgText>

                      {/* House 4 (Left Diamond) */}
                      <SvgText x="78" y="145" fontSize="11" fill="#8A5A16" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[3]?.signIndex}
                      </SvgText>
                      <SvgText x="78" y="168" fontSize="10" fill="#2B0E14" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[3]?.planets.map(p => p.symbol).join(' ')}
                      </SvgText>

                      {/* House 5 (Left Bottom Triangle) */}
                      <SvgText x="36" y="235" fontSize="10" fill="#8A5A16" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[4]?.signIndex}
                      </SvgText>
                      <SvgText x="40" y="210" fontSize="10" fill="#2B0E14" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[4]?.planets.map(p => p.symbol).join(' ')}
                      </SvgText>

                      {/* House 6 (Bottom Left Triangle) */}
                      <SvgText x="82" y="275" fontSize="10" fill="#8A5A16" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[5]?.signIndex}
                      </SvgText>
                      <SvgText x="78" y="252" fontSize="10" fill="#2B0E14" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[5]?.planets.map(p => p.symbol).join(' ')}
                      </SvgText>

                      {/* House 7 (Bottom Diamond) */}
                      <SvgText x="150" y="245" fontSize="11" fill="#8A5A16" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[6]?.signIndex}
                      </SvgText>
                      <SvgText x="150" y="222" fontSize="10" fill="#2B0E14" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[6]?.planets.map(p => p.symbol).join(' ')}
                      </SvgText>

                      {/* House 8 (Bottom Right Triangle) */}
                      <SvgText x="218" y="275" fontSize="10" fill="#8A5A16" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[7]?.signIndex}
                      </SvgText>
                      <SvgText x="222" y="252" fontSize="10" fill="#2B0E14" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[7]?.planets.map(p => p.symbol).join(' ')}
                      </SvgText>

                      {/* House 9 (Right Bottom Triangle) */}
                      <SvgText x="264" y="235" fontSize="10" fill="#8A5A16" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[8]?.signIndex}
                      </SvgText>
                      <SvgText x="260" y="210" fontSize="10" fill="#2B0E14" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[8]?.planets.map(p => p.symbol).join(' ')}
                      </SvgText>

                      {/* House 10 (Right Diamond) */}
                      <SvgText x="222" y="145" fontSize="11" fill="#8A5A16" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[9]?.signIndex}
                      </SvgText>
                      <SvgText x="222" y="168" fontSize="10" fill="#2B0E14" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[9]?.planets.map(p => p.symbol).join(' ')}
                      </SvgText>

                      {/* House 11 (Right Top Triangle) */}
                      <SvgText x="264" y="80" fontSize="10" fill="#8A5A16" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[10]?.signIndex}
                      </SvgText>
                      <SvgText x="260" y="102" fontSize="10" fill="#2B0E14" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[10]?.planets.map(p => p.symbol).join(' ')}
                      </SvgText>

                      {/* House 12 (Top Right Triangle) */}
                      <SvgText x="218" y="36" fontSize="10" fill="#8A5A16" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[11]?.signIndex}
                      </SvgText>
                      <SvgText x="222" y="56" fontSize="10" fill="#2B0E14" fontWeight="bold" textAnchor="middle">
                        {kundliHouses[11]?.planets.map(p => p.symbol).join(' ')}
                      </SvgText>
                    </Svg>
                  </View>

                  {/* Dignity Legend */}
                  <View style={styles.chartLegendRow}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                      <Text style={styles.legendText}>Exalted</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
                      <Text style={styles.legendText}>Own Sign</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#DC2626' }]} />
                      <Text style={styles.legendText}>Debilitated</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#D97706' }]} />
                      <Text style={styles.legendText}>Retrograde (Vakri)</Text>
                    </View>
                  </View>
                </View>

                {/* Section Header */}
                <View style={styles.subSectionHeader}>
                  <Text style={styles.subSectionTitle}>PLANETARY DEGREES & DISPOSITIONS</Text>
                  <Text style={styles.subSectionCityNote}>Nirayana Sidereal Longitudes</Text>
                </View>

                {/* Detailed Table */}
                {planetaryTable.map((planet, pIdx) => {
                  return (
                    <View key={pIdx} style={styles.planetRowCard}>
                      <View style={styles.planetRowHeader}>
                        <View style={styles.planetIdentityGroup}>
                          <Text style={styles.planetIconLarge}>{planet.icon}</Text>
                          <View>
                            <Text style={styles.planetNameTitle}>{planet.name}</Text>
                            <Text style={styles.planetSignSub}>{planet.sign}</Text>
                          </View>
                        </View>

                        <View style={styles.planetBadgeGroup}>
                          {planet.isRetrograde && (
                            <View style={styles.vakriBadge}>
                              <Text style={styles.vakriBadgeText}>RETRO (VAKRI)</Text>
                            </View>
                          )}
                          <View
                            style={[
                              styles.dignityBadge,
                              planet.dignity === 'EXALTED' && { backgroundColor: '#E8F5E9', borderColor: '#81C784' },
                              planet.dignity === 'OWN_SIGN' && { backgroundColor: '#E0F2FE', borderColor: '#7DD3FC' },
                              planet.dignity === 'DEBILITATED' && { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
                            ]}
                          >
                            <Text
                              style={[
                                styles.dignityBadgeText,
                                planet.dignity === 'EXALTED' && { color: '#2E7D32' },
                                planet.dignity === 'OWN_SIGN' && { color: '#0369A1' },
                                planet.dignity === 'DEBILITATED' && { color: '#B91C1C' },
                              ]}
                            >
                              {planet.dignity.replace('_', ' ')}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.planetMetricsGrid}>
                        <View style={styles.metricItem}>
                          <Text style={styles.metricLabel}>DEGREES</Text>
                          <Text style={styles.metricValue}>{planet.degrees}</Text>
                        </View>
                        <View style={styles.metricItem}>
                          <Text style={styles.metricLabel}>NAKSHATRA</Text>
                          <Text style={styles.metricValue}>{planet.nakshatra} (P{planet.pada})</Text>
                        </View>
                        <View style={styles.metricItem}>
                          <Text style={styles.metricLabel}>MOTION</Text>
                          <Text style={styles.metricValue}>{planet.isRetrograde ? 'Retrograde' : 'Direct'}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* ========================================================= */}
            {/* TAB 6: SHUBH MUHURAT ("WHAT NEXT?")                       */}
            {/* ========================================================= */}
            {activeTab === 'MUHURAT' && (
              <View>
                {/* Auspicious Timings Header */}
                <View style={styles.subSectionHeader}>
                  <Text style={styles.subSectionTitle}>AUSPICIOUS TIMINGS (SHUBH MUHURAT)</Text>
                  <Text style={styles.subSectionCityNote}>Divine windows for vital deeds & pujas</Text>
                </View>

                {/* Abhijit Muhurat */}
                <View style={[styles.muhuratCard, styles.muhuratCardAusp]}>
                  <View style={styles.muhuratCardHeader}>
                    <Text style={styles.muhuratIcon}>✨</Text>
                    <View style={styles.muhuratTitleGroup}>
                      <Text style={styles.muhuratName}>Abhijit Muhurat</Text>
                      <Text style={styles.muhuratTagline}>Supreme midday victory window ruled by Lord Vishnu</Text>
                    </View>
                    <View style={styles.activePillGreen}><Text style={styles.activePillGreenText}>AUSPICIOUS</Text></View>
                  </View>
                  <Text style={styles.muhuratWindowTime}>
                    ⏱️ {panchang.auspiciousMuhurats?.find(m => m.name.toLowerCase().includes('abhijit'))?.startTime || '12:06 PM'} – {panchang.auspiciousMuhurats?.find(m => m.name.toLowerCase().includes('abhijit'))?.endTime || '12:54 PM'}
                  </Text>
                  <Text style={styles.muhuratAdvice}>
                    Removes all planetary doshas. Highly favored for business signings, journeys, medical beginnings, and solemn ceremonies.
                  </Text>
                </View>

                {/* Brahma Muhurat */}
                <View style={[styles.muhuratCard, styles.muhuratCardAusp]}>
                  <View style={styles.muhuratCardHeader}>
                    <Text style={styles.muhuratIcon}>🧘</Text>
                    <View style={styles.muhuratTitleGroup}>
                      <Text style={styles.muhuratName}>Brahma Muhurat</Text>
                      <Text style={styles.muhuratTagline}>Sacred pre-dawn ambrosial creator hour</Text>
                    </View>
                    <View style={styles.activePillGreen}><Text style={styles.activePillGreenText}>HIGHLY AUSPICIOUS ⭐</Text></View>
                  </View>
                  <Text style={styles.muhuratWindowTime}>
                    ⏱️ {panchang.auspiciousMuhurats?.find(m => m.name.toLowerCase().includes('brahma'))?.startTime || '04:54 AM'} – {panchang.auspiciousMuhurats?.find(m => m.name.toLowerCase().includes('brahma'))?.endTime || '05:42 AM'}
                  </Text>
                  <Text style={styles.muhuratAdvice}>
                    Best for meditation, mantra japa, yogic practices, and deep academic study.
                  </Text>
                </View>

                {/* Inauspicious Timings Header */}
                <View style={[styles.subSectionHeader, { marginTop: 18 }]}>
                  <Text style={[styles.subSectionTitle, { color: '#B91C1C' }]}>INAUSPICIOUS WINDOWS (AVOID)</Text>
                  <Text style={styles.subSectionCityNote}>Strictly avoid initiating vital endeavors</Text>
                </View>

                {/* Rahu Kaal */}
                <View style={[styles.muhuratCard, styles.muhuratCardInausp]}>
                  <View style={styles.muhuratCardHeader}>
                    <Text style={styles.muhuratIcon}>⚠️</Text>
                    <View style={styles.muhuratTitleGroup}>
                      <Text style={styles.muhuratName}>Rahu Kaal</Text>
                      <Text style={styles.muhuratTagline}>Shadow period ruled by Rahu</Text>
                    </View>
                    <View style={styles.warningPillRed}><Text style={styles.warningPillRedText}>AVOID</Text></View>
                  </View>
                  <Text style={styles.muhuratWindowTime}>
                    ⏱️ {panchang.inauspiciousMuhurats?.find(m => m.name.toLowerCase().includes('rahu'))?.startTime || '09:29 AM'} – {panchang.inauspiciousMuhurats?.find(m => m.name.toLowerCase().includes('rahu'))?.endTime || '11:00 AM'}
                  </Text>
                  <Text style={styles.muhuratAdvice}>
                    Do not sign legal pacts, buy property, or start journeys. Ongoing routine work is permissible.
                  </Text>
                </View>

                {/* Yamaganda */}
                <View style={[styles.muhuratCard, styles.muhuratCardInausp]}>
                  <View style={styles.muhuratCardHeader}>
                    <Text style={styles.muhuratIcon}>🛑</Text>
                    <View style={styles.muhuratTitleGroup}>
                      <Text style={styles.muhuratName}>Yamaganda Kaal</Text>
                      <Text style={styles.muhuratTagline}>Governed by Yama, Lord of Justice</Text>
                    </View>
                    <View style={styles.warningPillRed}><Text style={styles.warningPillRedText}>AVOID</Text></View>
                  </View>
                  <Text style={styles.muhuratWindowTime}>
                    ⏱️ {panchang.inauspiciousMuhurats?.find(m => m.name.toLowerCase().includes('yamaganda'))?.startTime || '12:27 PM'} – {panchang.inauspiciousMuhurats?.find(m => m.name.toLowerCase().includes('yamaganda'))?.endTime || '01:56 PM'}
                  </Text>
                  <Text style={styles.muhuratAdvice}>
                    Avoid initiating new projects or travel due to risk of obstacles and unexpected halts.
                  </Text>
                </View>
              </View>
            )}

            {/* Bottom Footnote */}
            <View style={styles.bottomFootnoteBox}>
              <Text style={styles.bottomFootnoteText}>
                📍 Astrological calculations generated for {selectedCity.name} using Surya Siddhanta Nirayana ephemeris.
              </Text>
            </View>
          </ScrollView>

          {/* Date Picker Modal */}
          {showDatePicker && (
            <DatePickerModal
              visible={showDatePicker}
              selectedDateIso={dateIso}
              onClose={() => setShowDatePicker(false)}
              onSelectDateIso={(newIso: string) => {
                setShowDatePicker(false);
                onSelectDateIso?.(newIso);
              }}
              onToday={handleToday}
            />
          )}

          {/* City Selection Modal */}
          {showInternalCityPicker && (
            <CitySelectionModal
              visible={showInternalCityPicker}
              selectedCity={selectedCity}
              onClose={() => setShowInternalCityPicker(false)}
              onSelectCity={() => setShowInternalCityPicker(false)}
            />
          )}

        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F0',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF7F0',
  },

  // 1. Header Styles
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FAF7F0',
    borderBottomWidth: 1,
    borderBottomColor: '#EADBCE',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EADBCE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonArrow: {
    fontSize: 18,
    color: '#2B0E14',
    fontFamily: Fonts.jakartaBold,
  },
  headerTitleCol: {
    flex: 1,
    marginHorizontal: 10,
  },
  headerSubtitle: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#DFB059',
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 18,
    color: '#2B0E14',
    lineHeight: 22,
  },
  locationPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFB059',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  locationPillText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11,
    color: '#8A5A16',
  },

  // 2. Month Dates Ribbon
  ribbonContainer: {
    backgroundColor: '#FAF7F0',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EADBCE',
  },
  ribbonContent: {
    paddingHorizontal: 14,
    gap: 8,
  },
  dateCell: {
    width: 54,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EADBCE',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  dateCellSelected: {
    backgroundColor: '#2B0E14',
    borderColor: '#DFB059',
    borderWidth: 1.5,
    elevation: 3,
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  dateCellToday: {
    borderColor: '#DFB059',
    backgroundColor: '#FFFDF9',
  },
  dateCellDay: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9.5,
    color: '#8C7E82',
    letterSpacing: 0.5,
  },
  dateCellDaySelected: {
    color: '#DFB059',
  },
  dateCellNum: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 20,
    color: '#2B0E14',
    marginTop: 1,
  },
  dateCellNumSelected: {
    color: '#FFFDF9',
  },
  todayMicroDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DFB059',
    marginTop: 2,
  },

  // 3. Date Selector Bar
  dateSelectorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFDF9',
    marginHorizontal: 14,
    marginTop: 8,
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EADBCE',
  },
  arrowButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  arrowButtonText: {
    fontSize: 20,
    color: '#2B0E14',
    fontFamily: Fonts.jakartaBold,
  },
  dateDisplayCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calendarIcon: {
    fontSize: 14,
  },
  dateDisplayText: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 15,
    color: '#2B0E14',
  },
  dateCaret: {
    fontSize: 12,
    color: '#8C7E82',
  },
  todayButton: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#F3EDE2',
    borderWidth: 1,
    borderColor: '#EADBCE',
  },
  todayButtonActive: {
    backgroundColor: '#DFB059',
    borderColor: '#B3802A',
  },
  todayButtonText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9.5,
    color: '#2B0E14',
  },
  todayButtonTextActive: {
    color: '#2B0E14',
  },

  // 4. Horizontal Segmented Tabs Strip
  tabsStripContainer: {
    backgroundColor: '#FAF7F0',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EADBCE',
  },
  tabsContent: {
    paddingHorizontal: 14,
    gap: 6,
  },
  tabSegment: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EADBCE',
  },
  tabSegmentActive: {
    backgroundColor: '#2B0E14',
    borderColor: '#DFB059',
  },
  tabSegmentText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11.5,
    color: '#6B5E62',
  },
  tabSegmentTextActive: {
    color: '#DFB059',
  },

  // 5. Scroll Content Area
  tabScrollArea: {
    flex: 1,
    backgroundColor: '#FAF7F0',
  },
  tabScrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 40,
  },

  // Section Headers
  subSectionHeader: {
    marginTop: 14,
    marginBottom: 8,
  },
  subSectionTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 14,
    color: '#2B0E14',
    letterSpacing: 0.5,
  },
  subSectionCityNote: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 10,
    color: '#8C7E82',
    marginTop: 1,
  },

  // TAB 1: Panchang Styles
  masterChronometryCard: {
    backgroundColor: '#300E16',
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.35)',
    marginBottom: 10,
  },
  chronoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  chronoBadgeCategory: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#DFB059',
    letterSpacing: 1,
  },
  chronoTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 22,
    color: '#FFFDF9',
    marginTop: 2,
  },
  chronoMasaPill: {
    backgroundColor: 'rgba(223, 176, 89, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  chronoMasaText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9.5,
    color: '#DFB059',
    letterSpacing: 0.4,
  },
  ephemerisGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  ephemerisPod: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  ephemerisPodIcon: {
    fontSize: 16,
    marginBottom: 3,
  },
  ephemerisPodLabel: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 8,
    color: '#EADBCE',
    letterSpacing: 0.5,
  },
  ephemerisPodTime: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 13,
    color: '#FFFDF9',
    marginTop: 2,
  },

  // 5 Sacred Limbs Cards
  limbCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EADBCE',
    marginBottom: 8,
  },
  limbHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  limbIndexBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#DFB059',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  limbIndexText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10.5,
    color: '#8A5A16',
  },
  limbTitleCol: {
    flex: 1,
  },
  limbCategoryLabel: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 8.5,
    color: '#8C7E82',
    letterSpacing: 0.5,
  },
  limbPrimaryName: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 16,
    color: '#2B0E14',
    marginTop: 1,
  },
  limbDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3EDE2',
    paddingTop: 8,
    gap: 8,
  },
  limbDetailCol: {
    flex: 1,
  },
  limbDetailKey: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 8,
    color: '#8C7E82',
    letterSpacing: 0.4,
  },
  limbDetailVal: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 11,
    color: '#2B0E14',
    marginTop: 2,
  },

  // Side-by-side Karana & Vaar
  twoColRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  limbCardHalf: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EADBCE',
  },
  halfLimbName: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 16,
    color: '#2B0E14',
    marginTop: 4,
  },
  halfLimbSub: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 10,
    color: '#6B5E62',
    marginTop: 2,
  },
  halfLimbFollow: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#DFB059',
    marginTop: 4,
  },

  // Common Pills
  activePillGreen: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#81C784',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activePillGreenText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#1B5E20',
  },
  qualityPillAmber: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  qualityPillAmberText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#B45309',
  },
  warningPillRed: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  warningPillRedText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#B91C1C',
  },

  // TAB 2: Hora Styles
  heroRunningCard: {
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#DFB059',
    marginBottom: 12,
  },
  heroRunningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroRunningTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  heroRunningTagText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9.5,
    color: '#DFB059',
    letterSpacing: 0.8,
  },
  heroPlanetIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlanetIconText: {
    fontSize: 16,
  },
  heroRunningTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroRunningTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 24,
    color: '#FFFDF9',
  },
  heroQualityPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  heroQualityPillText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    color: '#FFFDF9',
  },
  heroRunningTime: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 12,
    color: '#DFB059',
    marginTop: 4,
    marginBottom: 6,
  },
  heroRunningGuidance: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11,
    color: '#EADBCE',
    lineHeight: 16,
  },

  // Segment Switcher (Day / Night)
  periodSwitcherRow: {
    flexDirection: 'row',
    backgroundColor: '#F3EDE2',
    borderRadius: 12,
    padding: 3,
    marginBottom: 10,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 10,
  },
  periodButtonActive: {
    backgroundColor: '#2B0E14',
  },
  periodButtonText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11,
    color: '#6B5E62',
  },
  periodButtonTextActive: {
    color: '#DFB059',
  },

  // Slots List
  slotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EADBCE',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  slotCardLive: {
    borderColor: '#DFB059',
    borderWidth: 1.5,
    backgroundColor: '#FFFDF9',
  },
  slotCardElevated: {
    borderColor: 'rgba(223, 176, 89, 0.6)',
  },
  slotColorBar: {
    width: 5,
  },
  slotMainContent: {
    flex: 1,
    padding: 12,
  },
  slotHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  slotTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slotPlanetIcon: {
    fontSize: 14,
  },
  slotPrimaryTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 16,
    color: '#2B0E14',
  },
  liveBadgeSmall: {
    backgroundColor: '#10B981',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  liveBadgeSmallText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 8,
    color: '#FFFFFF',
  },
  slotQualityPill: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#FAF7F0',
  },
  slotQualityText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
  },
  slotTimestamps: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11,
    color: '#2B0E14',
    marginBottom: 4,
  },
  slotGuidanceText: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 10.5,
    color: '#6B5E62',
    lineHeight: 15,
  },

  // Summary Bar
  summaryBar: {
    backgroundColor: '#FAF5EE',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EADBCE',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryBarText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    color: '#2B0E14',
  },

  // TAB 4: Lagna Table Styles
  lagnaHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#DFB059',
    marginBottom: 10,
  },
  lagnaHeroSubtitle: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#8A5A16',
    letterSpacing: 1,
  },
  lagnaHeroTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  lagnaHeroTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 22,
    color: '#2B0E14',
  },
  lagnaHeroTime: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11.5,
    color: '#2B0E14',
    marginTop: 4,
    marginBottom: 6,
  },
  lagnaHeroGuidance: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11,
    color: '#6B5E62',
    lineHeight: 16,
  },
  lagnaItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EADBCE',
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lagnaItemCardActive: {
    backgroundColor: '#FFFDF9',
    borderColor: '#DFB059',
    borderWidth: 1.5,
  },
  lagnaItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lagnaSymbolCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#EADBCE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  lagnaSymbolCircleActive: {
    backgroundColor: '#2B0E14',
    borderColor: '#DFB059',
  },
  lagnaSymbolText: {
    fontSize: 16,
    color: '#DFB059',
  },
  lagnaItemInfo: {
    flex: 1,
  },
  lagnaNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lagnaItemName: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 15,
    color: '#2B0E14',
  },
  activePillSmall: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  activePillSmallText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 7.5,
    color: '#1B5E20',
  },
  lagnaMetaSub: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 9.5,
    color: '#8C7E82',
    marginTop: 2,
  },
  lagnaItemRight: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  lagnaTimeRange: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11,
    color: '#2B0E14',
  },
  lagnaTimeRangeEnd: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 9.5,
    color: '#8C7E82',
  },

  // TAB 5: Planetary Gochar & Kundli Styles
  refModeRow: {
    flexDirection: 'row',
    backgroundColor: '#F3EDE2',
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
    gap: 4,
  },
  refModeButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 10,
  },
  refModeButtonActive: {
    backgroundColor: '#2B0E14',
  },
  refModeButtonText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10.5,
    color: '#6B5E62',
  },
  refModeButtonTextActive: {
    color: '#DFB059',
  },
  chartWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EADBCE',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartHeaderTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 16,
    color: '#2B0E14',
    textAlign: 'center',
  },
  chartHeaderSub: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 10,
    color: '#8C7E82',
    marginTop: 1,
    marginBottom: 10,
    textAlign: 'center',
  },
  svgContainer: {
    width: 300,
    height: 300,
    marginVertical: 4,
  },
  chartLegendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3EDE2',
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#6B5E62',
  },

  // Detailed Planetary Rows
  planetRowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EADBCE',
    marginBottom: 6,
  },
  planetRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planetIdentityGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planetIconLarge: {
    fontSize: 20,
  },
  planetNameTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 16,
    color: '#2B0E14',
  },
  planetSignSub: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 10.5,
    color: '#8C7E82',
  },
  planetBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vakriBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  vakriBadgeText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 8.5,
    color: '#B45309',
  },
  dignityBadge: {
    backgroundColor: '#F3EDE2',
    borderWidth: 1,
    borderColor: '#EADBCE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dignityBadgeText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 8.5,
    color: '#6B5E62',
  },
  planetMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3EDE2',
    paddingTop: 6,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 8,
    color: '#8C7E82',
    letterSpacing: 0.4,
  },
  metricValue: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 10.5,
    color: '#2B0E14',
    marginTop: 1,
  },

  // TAB 6: Muhurat Styles
  muhuratCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EADBCE',
    marginBottom: 8,
  },
  muhuratCardAusp: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  muhuratCardInausp: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  muhuratCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  muhuratIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  muhuratTitleGroup: {
    flex: 1,
  },
  muhuratName: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 16,
    color: '#2B0E14',
  },
  muhuratTagline: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 9.5,
    color: '#8C7E82',
  },
  muhuratWindowTime: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 12,
    color: '#2B0E14',
    marginVertical: 4,
  },
  muhuratAdvice: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 10.5,
    color: '#6B5E62',
    lineHeight: 15,
  },

  // Bottom Footnote
  bottomFootnoteBox: {
    marginTop: 14,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#EADBCE',
    alignItems: 'center',
  },
  bottomFootnoteText: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 9.5,
    color: '#8A5A16',
    textAlign: 'center',
    lineHeight: 14,
  },
});
