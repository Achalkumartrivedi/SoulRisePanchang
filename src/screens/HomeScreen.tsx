import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Colors } from '../theme/colors';
import { PanchangDayData, CityLocation } from '../types/panchang';
import { Header } from '../components/Header';
import { CelestialBackground } from '../components/CelestialBackground';
import { MoonPhaseVisual } from '../components/MoonPhaseVisual';
import { LanguageSelectionModal } from '../components/LanguageSelectionModal';
import { BirthChartModal } from '../components/BirthChartModal';
import { JainCalendarModal } from '../components/JainCalendarModal';
import { LalKitabModal } from '../components/LalKitabModal';
import { NavtaraModal } from '../components/NavtaraModal';
import { KotaChakraModal } from '../components/KotaChakraModal';
import { CentralAlmanacHubModal, AlmanacTab } from '../components/CentralAlmanacHubModal';
import { calculateTimingProgress } from '../engine/muhuratCalculator';
import Svg, { Circle, Path, Defs, LinearGradient, Stop, Rect, Line, Polygon, G, Text as SvgText } from 'react-native-svg';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedTithi, getLocalizedPakshaName } from '../i18n/vedicTerms';

interface HomeScreenProps {
  panchang: PanchangDayData;
  currentDateIso: string;
  selectedCity: CityLocation;
  onOpenCityPicker: () => void;
  onOpenLanguagePicker?: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onNavigateToFestivals: () => void;
  onSelectDateIso?: (dateIso: string) => void;
  onNavigateToReminders?: () => void;
  onOpenKaalMuhurat?: (tab?: 'AUSPICIOUS' | 'INAUSPICIOUS' | 'ALL') => void;
}

const cleanVedicTime = (timeStr?: string): string => {
  if (!timeStr) return '';
  return timeStr
    .replace(/\b(Today|Tomorrow|IST)\b/gi, '')
    .trim()
    .replace(/\s+/g, ' ');
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  panchang,
  currentDateIso,
  selectedCity,
  onOpenCityPicker,
  onPrevDay,
  onNextDay,
  onToday,
  onNavigateToFestivals,
  onSelectDateIso,
  onOpenKaalMuhurat,
}) => {
  const { language, t } = useLanguage();

  const [showLangModal, setShowLangModal] = useState(false);
  const [showBirthChartModal, setShowBirthChartModal] = useState(false);
  const [showJainCalendarModal, setShowJainCalendarModal] = useState(false);
  const [showLalKitabModal, setShowLalKitabModal] = useState(false);
  const [showNavtaraModal, setShowNavtaraModal] = useState(false);
  const [showKotaChakraModal, setShowKotaChakraModal] = useState(false);
  const [showCentralHubModal, setShowCentralHubModal] = useState(false);
  const [centralHubInitialTab, setCentralHubInitialTab] = useState<AlmanacTab>('PANCHANG');
  const [lalKitabPayload, setLalKitabPayload] = useState<{
    dob?: string;
    tob?: string;
    city?: string;
    lat?: number;
    lon?: number;
  }>({});

  const tithiInPaksha = (((panchang.tithi.number || 1) - 1) % 15) + 1;
  const locHeroTithi = getLocalizedTithi(tithiInPaksha, language);
  const locHeroPaksha = getLocalizedPakshaName(panchang.tithi.paksha === 'KRISHNA' ? 'KRISHNA' : 'SHUKLA', language);

  const abhijitItem = panchang.auspiciousMuhurats?.find(m => m.name.toLowerCase().includes('abhijit'));
  const rahuItem = panchang.inauspiciousMuhurats?.find(m => m.name.toLowerCase().includes('rahu'));

  const abhijitProgress = useMemo(() => {
    if (!abhijitItem) return null;
    return calculateTimingProgress(abhijitItem.startTime, abhijitItem.endTime, currentDateIso, new Date(), language);
  }, [abhijitItem, currentDateIso, language]);

  const rahuProgress = useMemo(() => {
    if (!rahuItem) return null;
    return calculateTimingProgress(rahuItem.startTime, rahuItem.endTime, currentDateIso, new Date(), language);
  }, [rahuItem, currentDateIso, language]);

  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.25,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [blinkAnim]);

  // Derived Hindu Masa Name
  const masaName = (panchang.samvat.monthName || 'BHADRAPADA').toUpperCase();
  const samvatYear = panchang.samvat.vikramSamvat || 2083;

  return (
    <View style={styles.container}>
      {/* 0. Subtle Celestial Dotted Stipple Texture Background */}
      <CelestialBackground />

      {/* 1. Masthead and Controls */}
      <Header
        currentDateIso={currentDateIso}
        selectedCity={selectedCity}
        samvat={panchang.samvat}
        onOpenCityPicker={onOpenCityPicker}
        onOpenLanguagePicker={() => setShowLangModal(true)}
        onPrevDay={onPrevDay}
        onNextDay={onNextDay}
        onToday={onToday}
        onSelectDateIso={onSelectDateIso}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 2. Master Hero Almanac Card (Heritage Velvet Burgundy Centerpiece) */}
        <TouchableOpacity
          style={styles.heroCard}
          onPress={() => {
            setCentralHubInitialTab('PANCHANG');
            setShowCentralHubModal(true);
          }}
          activeOpacity={0.92}
        >
          {/* Multi-Stop Sacred Burgundy Gradient */}
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id="heroGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#37151C" />
                <Stop offset="48%" stopColor="#2B0E14" />
                <Stop offset="100%" stopColor="#1E070C" />
              </LinearGradient>
              <LinearGradient id="heroAura" x1="100%" y1="25%" x2="20%" y2="50%">
                <Stop offset="0%" stopColor="#DFB059" stopOpacity="0.22" />
                <Stop offset="25%" stopColor="#DFB059" stopOpacity="0.15" />
                <Stop offset="60%" stopColor="#DFB059" stopOpacity="0.05" />
                <Stop offset="85%" stopColor="#DFB059" stopOpacity="0" />
                <Stop offset="100%" stopColor="#DFB059" stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Rect width="100" height="100" fill="url(#heroGradient)" />
            <Rect width="100" height="100" fill="url(#heroAura)" />
          </Svg>

          {/* Celestial Orbit Watermark Backdrop */}
          <View style={styles.orbitCircle1} pointerEvents="none" />
          <View style={styles.orbitCircle2} pointerEvents="none" />

          {/* Inner Content with Dedicated Padding */}
          <View style={styles.heroContentInner}>
            {/* Top Badges Row */}
            <View style={styles.heroTopBadgesRow}>
            <View style={styles.heroVikramBadge}>
              <Text style={styles.heroBadgeStar}>✦</Text>
              <Text style={styles.heroVikramText}>VIKRAM {samvatYear}</Text>
            </View>

            <View style={styles.heroMasaBadge}>
              <Animated.View style={[styles.glowingDot, { opacity: blinkAnim }]} />
              <Text style={styles.heroMasaText}>{masaName} MASA</Text>
            </View>
          </View>

          {/* Tithi Header & 3D Astrolabe Moon Display */}
          <View style={styles.heroMiddleRow}>
            <View style={styles.heroTithiCol}>
              <Text style={styles.tithiPradhanaLabel}>TITHI PRADHANA</Text>
              <Text style={styles.tithiTitleText}>
                {locHeroPaksha}
                {'\n'}
                {typeof locHeroTithi === 'string' ? locHeroTithi : locHeroTithi?.name || panchang.tithi.name}
              </Text>
              <View style={styles.lunarDayRow}>
                <Text style={styles.moonIconText}>🌙</Text>
                <Text style={styles.lunarDayText}>
                  {tithiInPaksha}th Lunar Day • Unto {cleanVedicTime(panchang.tithi.endTimeFormatted) || '07:42 PM'}
                </Text>
              </View>
            </View>

            {/* Moon Graphic with Astrolabe Orbit and Glow */}
            <View style={styles.heroMoonCol}>
              <MoonPhaseVisual
                size={76}
                paksha={panchang.tithi.paksha}
                tithiNumber={panchang.tithi.number}
                showBadge={true}
              />
            </View>
          </View>

          {/* Sunrise / Sunset Frosted Glass Pods */}
          <View style={styles.sunPodsRow}>
            {/* Sunrise Pod */}
            <View style={styles.sunPodCard}>
              <View style={styles.sunPodIconBox}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#DFB059" strokeWidth="2">
                  <Circle cx="12" cy="12" r="4" />
                  <Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </Svg>
              </View>
              <View style={styles.sunPodTextBox}>
                <Text style={styles.sunPodLabel}>SUNRISE</Text>
                <Text style={styles.sunPodTime}>{cleanVedicTime(panchang.sunMoon.sunrise) || '06:12 AM'}</Text>
              </View>
            </View>

            {/* Sunset Pod */}
            <View style={styles.sunPodCard}>
              <View style={styles.sunPodIconBox}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#DFB059" strokeWidth="2">
                  <Path d="M17 18a5 5 0 0 0-10 0" />
                  <Path d="M12 2v7M4.22 10.22l1.42 1.42M1 18h22M19.78 10.22l-1.42 1.42" />
                </Svg>
              </View>
              <View style={styles.sunPodTextBox}>
                <Text style={styles.sunPodLabel}>SUNSET</Text>
                <Text style={styles.sunPodTime}>{cleanVedicTime(panchang.sunMoon.sunset) || '06:12 PM'}</Text>
              </View>
            </View>
          </View>

          {/* Vedic Panchang Triad Grid: Nakshatra, Yoga, Karana */}
          <View style={styles.sacredTriadRow}>
            <View style={styles.triadCol}>
              <Text style={styles.triadLabel}>NAKSHATRA</Text>
              <Text style={styles.triadVal} numberOfLines={1}>{panchang.nakshatra.name || 'Revati'}</Text>
              <Text style={styles.triadSub} numberOfLines={1}>Till {cleanVedicTime(panchang.nakshatra.endTimeFormatted) || '02:44 PM'}</Text>
            </View>

            <View style={[styles.triadCol, styles.triadColDivider]}>
              <Text style={styles.triadLabel}>YOGA</Text>
              <Text style={styles.triadVal} numberOfLines={1}>{panchang.yoga.name || 'Dhruva'}</Text>
              <Text style={styles.triadSub} numberOfLines={1}>Till {cleanVedicTime(panchang.yoga.endTimeFormatted) || '09:18 AM'}</Text>
            </View>

            <View style={styles.triadCol}>
              <Text style={styles.triadLabel}>KARANA</Text>
              <Text style={styles.triadVal} numberOfLines={1}>{panchang.karana.name || 'Taitila'}</Text>
              <Text style={styles.triadSub} numberOfLines={1}>Till {cleanVedicTime(panchang.karana.endTimeFormatted) || '07:42 PM'}</Text>
            </View>
          </View>

          {/* Ambient Bottom Expand Central Almanac Hub Badge */}
          <View style={styles.expandHubBadge}>
            <Text style={styles.expandHubBadgeText}>✦ TAP TO EXPAND CENTRAL ALMANAC HUB ✦</Text>
          </View>
        </View>
      </TouchableOpacity>

        {/* 3. Kaal & Muhurat Highlights */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.maroonPillIndicator} />
              <Text style={styles.sectionTitleText}>Kaal & Muhurat</Text>
            </View>
            <TouchableOpacity
              style={styles.sectionLinkBtn}
              activeOpacity={0.7}
              onPress={() => onOpenKaalMuhurat?.('ALL')}
            >
              <Text style={styles.sectionLinkText}>ALL TIMINGS →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsTwoColGrid}>
            {/* Abhijit Muhurat Card (Shubha) */}
            <TouchableOpacity
              style={styles.abhijitCard}
              activeOpacity={0.88}
              onPress={() => onOpenKaalMuhurat?.('AUSPICIOUS')}
            >
              <View>
                <View style={styles.cardBadgeRow}>
                  <Text style={styles.sparkleIcon}>✨</Text>
                  <View style={styles.shubhaBadge}>
                    <Text style={styles.shubhaBadgeText}>
                      {abhijitProgress?.status === 'ACTIVE' ? '● LIVE' : 'SHUBHA'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.muhuratCardHeading}>Abhijit Muhurat</Text>
                <Text style={styles.muhuratCardSub} numberOfLines={1}>
                  {abhijitProgress?.status === 'ACTIVE'
                    ? abhijitProgress.timeRemainingLabel
                    : 'Most Auspicious Window'}
                </Text>
              </View>
              <View style={styles.muhuratCardFooter}>
                <Text style={styles.abhijitTimingText}>
                  {abhijitItem ? `${abhijitItem.startTime} – ${abhijitItem.endTime}` : '11:48 AM – 12:36 PM'}
                </Text>
                {abhijitProgress?.status === 'ACTIVE' && (
                  <View style={styles.muhuratProgressTrack}>
                    <View
                      style={[
                        styles.muhuratProgressFillShubh,
                        { width: `${abhijitProgress.progressPercent}%` },
                      ]}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>

            {/* Rahu Kaal Card (Varjya) */}
            <TouchableOpacity
              style={styles.rahuCard}
              activeOpacity={0.88}
              onPress={() => onOpenKaalMuhurat?.('INAUSPICIOUS')}
            >
              <View>
                <View style={styles.cardBadgeRow}>
                  <Text style={styles.warningIcon}>⚠️</Text>
                  <View style={styles.varjyaBadge}>
                    <Text style={styles.varjyaBadgeText}>
                      {rahuProgress?.status === 'ACTIVE' ? '● LIVE' : 'VARJYA'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.muhuratCardHeading}>Rahu Kaal</Text>
                <Text style={styles.muhuratCardSub} numberOfLines={1}>
                  {rahuProgress?.status === 'ACTIVE'
                    ? rahuProgress.timeRemainingLabel
                    : 'Inauspicious Period'}
                </Text>
              </View>
              <View style={styles.muhuratCardFooter}>
                <Text style={styles.rahuTimingText}>
                  {rahuItem ? `${rahuItem.startTime} – ${rahuItem.endTime}` : '07:42 AM – 09:12 AM'}
                </Text>
                {rahuProgress?.status === 'ACTIVE' && (
                  <View style={styles.muhuratProgressTrack}>
                    <View
                      style={[
                        styles.muhuratProgressFillVarjya,
                        { width: `${rahuProgress.progressPercent}%` },
                      ]}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. Day Choghadiya Active Strip */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.choghadiyaStripCard}
            onPress={() => {
              setCentralHubInitialTab('CHOGHADIYA');
              setShowCentralHubModal(true);
            }}
            activeOpacity={0.88}
          >
            <View style={styles.choghadiyaTopRow}>
              <View style={styles.choghadiyaTitleGroup}>
                <Text style={styles.clockIcon}>🕒</Text>
                <Text style={styles.choghadiyaStripTitle}>Day Choghadiya Active</Text>
              </View>
              <View style={styles.amritBadge}>
                <Text style={styles.amritBadgeText}>AMRIT CURRENT</Text>
              </View>
            </View>

            <View style={styles.choghadiyaBottomRow}>
              <View style={styles.choghadiyaStatusGroup}>
                <View style={styles.choghadiyaPulseDot} />
                <Text style={styles.choghadiyaActiveName}>
                  <Text style={styles.boldText}>Amrit (अमृत)</Text> • Auspicious
                </Text>
              </View>
              <Text style={styles.choghadiyaTimeWindow}>06:12 – 07:42 AM</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 5. Current Planetary & Gochar */}
        <View style={styles.sectionContainer}>
          <View style={styles.planetaryMasterCard}>
            <Svg style={StyleSheet.absoluteFill} viewBox="0 0 100 100" preserveAspectRatio="none">
              <Defs>
                <LinearGradient id="planetaryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#37151C" />
                  <Stop offset="100%" stopColor="#200A0F" />
                </LinearGradient>
              </Defs>
              <Rect width="100" height="100" fill="url(#planetaryGrad)" />
            </Svg>

            {/* Header */}
            <View style={styles.planetaryHeaderRow}>
              <View style={styles.planetaryHeaderLeft}>
                <View style={styles.planetIconCircle}>
                  <Text style={styles.planetEmoji}>🪐</Text>
                </View>
                <View style={styles.planetaryTitleGroup}>
                  <Text style={styles.planetaryTitle} numberOfLines={1}>Current Planetary & Gochar</Text>
                  <Text style={styles.planetarySub} numberOfLines={1}>SIDEREAL VEDIC TRANSITS</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.planetaryViewBtn}
                activeOpacity={0.7}
                onPress={() => {
                  setCentralHubInitialTab('PLANETARY');
                  setShowCentralHubModal(true);
                }}
              >
                <Text style={styles.planetaryViewText}>VIEW DETAILS</Text>
                <Text style={styles.planetaryViewArrow}>→</Text>
              </TouchableOpacity>
            </View>

            {/* 2x2 Transit Cards Grid: Row 1 */}
            <View style={styles.cardsTwoColGrid}>
              {/* Surya */}
              <View style={styles.planetTransitCard}>
                <View>
                  <View style={styles.planetCardTopRow}>
                    <Text style={styles.planetName}>Surya</Text>
                    <View style={styles.neechaBadge}>
                      <Text style={styles.neechaBadgeText}>NEECHA</Text>
                    </View>
                  </View>
                  <Text style={styles.planetRashi}>In Tula (Libra)</Text>
                </View>
                <View style={styles.planetBottomRow}>
                  <Text style={styles.planetDesc}>Debilitated</Text>
                  <Text style={styles.planetDeg}>11°04'</Text>
                </View>
              </View>

              {/* Guru */}
              <View style={styles.planetTransitCard}>
                <View>
                  <View style={styles.planetCardTopRow}>
                    <Text style={styles.planetName}>Guru</Text>
                    <View style={styles.vakriBadge}>
                      <Text style={styles.vakriBadgeText}>VAKRI</Text>
                    </View>
                  </View>
                  <Text style={styles.planetRashi}>In Vrishabha</Text>
                </View>
                <View style={styles.planetBottomRow}>
                  <Text style={styles.planetDesc}>Retrograde</Text>
                  <Text style={styles.planetDeg}>26°18'</Text>
                </View>
              </View>
            </View>

            {/* 2x2 Transit Cards Grid: Row 2 */}
            <View style={[styles.cardsTwoColGrid, { marginTop: 10 }]}>
              {/* Chandra */}
              <View style={styles.planetTransitCard}>
                <View>
                  <View style={styles.planetCardTopRow}>
                    <Text style={styles.planetName}>Chandra</Text>
                    <View style={styles.gocharBadge}>
                      <Text style={styles.gocharBadgeText}>GOCHAR</Text>
                    </View>
                  </View>
                  <Text style={styles.planetRashi}>In Kumbha (Aquarius)</Text>
                </View>
                <View style={styles.planetBottomRow}>
                  <Text style={styles.planetDesc}>Purva Bhadra</Text>
                  <Text style={styles.planetDeg}>18°42'</Text>
                </View>
              </View>

              {/* Shani */}
              <View style={styles.planetTransitCard}>
                <View>
                  <View style={styles.planetCardTopRow}>
                    <Text style={styles.planetName}>Shani</Text>
                    <View style={styles.swakshetraBadge}>
                      <Text style={styles.swakshetraBadgeText}>SWA-KSHETRA</Text>
                    </View>
                  </View>
                  <Text style={styles.planetRashi}>In Kumbha (Aquarius)</Text>
                </View>
                <View style={styles.planetBottomRow}>
                  <Text style={styles.planetDesc}>Own House</Text>
                  <Text style={styles.planetDeg}>04°12'</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 6. Kundli – Birth Chart Details */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.kundliMasterCard}
            onPress={() => setShowBirthChartModal(true)}
            activeOpacity={0.9}
          >
            {/* Header */}
            <View style={styles.kundliHeaderRow}>
              <View style={styles.kundliHeaderLeft}>
                <View style={styles.crystalOrbBox}>
                  <Text style={styles.crystalOrbText}>🔮</Text>
                </View>
                <View>
                  <Text style={styles.kundliTitle}>Kundli – Birth Chart</Text>
                  <Text style={styles.kundliSub}>D1 Lagna & Divisional Preview</Text>
                </View>
              </View>
              <View style={styles.openBtnRow}>
                <Text style={styles.openBtnText}>OPEN ➔</Text>
              </View>
            </View>

            {/* Grid with Details on Left and Authentic Vedic Lagna Diamond Yantra on Right */}
            <View style={styles.kundliBodyRow}>
              {/* Left Column: Sign & Lagna specifics */}
              <View style={styles.kundliDetailsCol}>
                <View style={styles.kundliSpecBox}>
                  <Text style={styles.kundliSpecLabel}>ASCENDANT (LAGNA)</Text>
                  <Text style={styles.kundliSpecVal}>Vrishchika (Scorpio)</Text>
                  <Text style={styles.kundliSpecDeg}>14°22' • Anuradha</Text>
                </View>

                <View style={styles.signsPairRow}>
                  <View style={styles.signPillBox}>
                    <Text style={styles.signPillLabel}>MOON SIGN</Text>
                    <Text style={styles.signPillVal}>Kumbha</Text>
                  </View>
                  <View style={styles.signPillBox}>
                    <Text style={styles.signPillLabel}>SUN SIGN</Text>
                    <Text style={styles.signPillVal}>Tula</Text>
                  </View>
                </View>
              </View>

              {/* Right Column: Authentic Vedic Lagna Diamond Yantra Graphic */}
              <View style={styles.kundliYantraBox}>
                <Svg width={96} height={96} viewBox="0 0 100 100">
                  <Rect x="2" y="2" width="96" height="96" stroke="#DFB059" strokeWidth="1.25" fill="none" />
                  <Line x1="2" y1="2" x2="98" y2="98" stroke="#DFB059" strokeWidth="1.25" />
                  <Line x1="98" y1="2" x2="2" y2="98" stroke="#DFB059" strokeWidth="1.25" />
                  <Polygon points="50,2 98,50 50,98 2,50" stroke="#DFB059" strokeWidth="1.25" fill="none" />
                  <SvgText x="50" y="44" fill="#DFB059" fontFamily="serif" fontSize="9" fontWeight="bold" textAnchor="middle">
                    D1
                  </SvgText>
                  <SvgText x="50" y="58" fill="#F8F5EE" fontFamily="serif" fontSize="8" textAnchor="middle">
                    Lagna
                  </SvgText>
                  <SvgText x="50" y="22" fill="#EADBCE" fontSize="6.5" textAnchor="middle">VIII</SvgText>
                  <SvgText x="22" y="50" fill="#EADBCE" fontSize="6.5" textAnchor="middle">IV</SvgText>
                  <SvgText x="78" y="50" fill="#EADBCE" fontSize="6.5" textAnchor="middle">X</SvgText>
                  <SvgText x="50" y="78" fill="#EADBCE" fontSize="6.5" textAnchor="middle">VII</SvgText>
                </Svg>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 7. AI Kundli Details */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.aiKundliMasterCard}
            onPress={() => setShowLalKitabModal(true)}
            activeOpacity={0.9}
          >
            <Svg style={StyleSheet.absoluteFill} viewBox="0 0 100 100" preserveAspectRatio="none">
              <Defs>
                <LinearGradient id="aiKundliGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#37151C" />
                  <Stop offset="100%" stopColor="#1E070C" />
                </LinearGradient>
              </Defs>
              <Rect width="100" height="100" fill="url(#aiKundliGrad)" />
            </Svg>

            {/* Header */}
            <View style={styles.aiKundliHeaderRow}>
              <View style={styles.aiKundliHeaderLeft}>
                <View style={styles.aiIconBox}>
                  <Text style={styles.aiIconText}>📖</Text>
                </View>
                <View style={styles.aiTitleGroup}>
                  <View style={styles.aiTitleRow}>
                    <Text style={styles.aiKundliTitle} numberOfLines={1}>AI Kundli Details</Text>
                    <View style={styles.liveBadge}>
                      <Text style={styles.liveBadgeText}>LIVE</Text>
                    </View>
                  </View>
                  <Text style={styles.aiKundliSub} numberOfLines={1}>LAL KITAB & BRIGHU ALGORITHM</Text>
                </View>
              </View>
              <View style={styles.aiConsultBtn}>
                <Text style={styles.aiConsultText}>CONSULT PANDIT AI</Text>
                <Text style={styles.aiConsultArrow}>→</Text>
              </View>
            </View>

            {/* Insights Timeline */}
            <View style={styles.aiInsightsContainer}>
              <View style={styles.aiInsightCard}>
                <View style={styles.aiInsightTopRow}>
                  <Text style={styles.aiInsightTitle}>Saturn 1-5-9 Trine Timeline</Text>
                  <View style={styles.activeTransitBadge}>
                    <Text style={styles.activeTransitText}>ACTIVE TRANSIT</Text>
                  </View>
                </View>
                <Text style={styles.aiInsightDesc}>
                  Saturn’s trine aspect initiates career stabilization. Strong indicators for realigning enterprise strategy and persistent karmic duty.
                </Text>
              </View>

              <View style={styles.aiInsightCard}>
                <View style={styles.aiInsightTopRow}>
                  <Text style={styles.aiInsightTitle}>Ketu Breaks & Karmic Detachment</Text>
                  <View style={styles.tenthHouseBadge}>
                    <Text style={styles.tenthHouseText}>10TH HOUSE</Text>
                  </View>
                </View>
                <Text style={styles.aiInsightDesc}>
                  Minor frictions in partnerships resolve through non-reaction and focused introspective meditation.
                </Text>
              </View>

              {/* Recommended Vedic Remedy Capsule */}
              <View style={styles.remedyCapsule}>
                <Text style={styles.diyaIcon}>🪔</Text>
                <View style={styles.remedyTextBox}>
                  <Text style={styles.remedyLabel}>RECOMMENDED VEDIC REMEDY</Text>
                  <Text style={styles.remedyVal}>Daily Surya Arghya at dawn & Gayatri Samput</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 8. Explore Vedic Astrology Discovery Rail */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.maroonPillIndicator} />
              <View>
                <Text style={styles.sectionTitleText}>Explore Vedic Astrology</Text>
                <Text style={styles.exploreSubtitle}>SACRED CALCULATION TOOLS</Text>
              </View>
            </View>
            <Text style={styles.swipeHintText}>Swipe →</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.exploreScrollRail}
          >
            {/* Item 1: Navtara */}
            <TouchableOpacity
              style={styles.exploreRailCard}
              onPress={() => setShowNavtaraModal(true)}
              activeOpacity={0.8}
            >
              <View style={styles.exploreMedallionBox}>
                <View style={styles.floatingNewBadge}>
                  <Text style={styles.floatingNewBadgeText}>NEW</Text>
                </View>
                <View style={styles.navtaraMedallion}>
                  <Svg width={72} height={72} viewBox="0 0 100 100">
                    <Circle cx="50" cy="50" r="42" fill="none" stroke="#DFB059" strokeDasharray="2 3" strokeWidth="1.5" />
                    <Circle cx="50" cy="50" r="30" fill="none" stroke="#F5DE9C" strokeWidth="1" />
                    <G transform="translate(50,50)">
                      <Line x1="0" y1="-42" x2="0" y2="42" stroke="#DFB059" strokeWidth="1.5" />
                      <Line x1="-36.4" y1="-21" x2="36.4" y2="21" stroke="#DFB059" strokeWidth="1.5" />
                      <Line x1="-36.4" y1="21" x2="36.4" y2="-21" stroke="#DFB059" strokeWidth="1.5" />
                      <Circle cx="0" cy="0" r="10" fill="#DFB059" />
                      <Circle cx="0" cy="0" r="5" fill="#280910" />
                    </G>
                  </Svg>
                </View>
              </View>
              <Text style={styles.exploreItemName}>Navtara</Text>
              <Text style={styles.exploreItemDesc}>9-Fold Nakshatra</Text>
            </TouchableOpacity>

            {/* Item 2: Kota Chakra */}
            <TouchableOpacity
              style={styles.exploreRailCard}
              onPress={() => setShowKotaChakraModal(true)}
              activeOpacity={0.8}
            >
              <View style={styles.exploreMedallionBox}>
                <View style={styles.floatingNewBadge}>
                  <Text style={styles.floatingNewBadgeText}>NEW</Text>
                </View>
                <View style={styles.kotaMedallion}>
                  <Svg width={72} height={72} viewBox="0 0 100 100">
                    <Circle cx="50" cy="50" r="44" fill="none" stroke="#E3B35D" strokeWidth="1.5" />
                    <Rect x="18" y="18" width="64" height="64" rx="3" fill="none" stroke="#DFB059" strokeWidth="1.5" />
                    <Rect x="28" y="28" width="44" height="44" rx="2" fill="none" stroke="#F5DE9C" strokeWidth="1.5" />
                    <Rect x="38" y="38" width="24" height="24" fill="#672715" stroke="#DFB059" strokeWidth="1.5" />
                    <Circle cx="50" cy="50" r="4" fill="#DFB059" />
                    <Line x1="50" y1="6" x2="50" y2="94" stroke="#DFB059" strokeWidth="1" />
                    <Line x1="6" y1="50" x2="94" y2="50" stroke="#DFB059" strokeWidth="1" />
                  </Svg>
                </View>
              </View>
              <Text style={styles.exploreItemName}>Kota Chakra</Text>
              <Text style={styles.exploreItemDesc}>Fortified Defense</Text>
            </TouchableOpacity>

            {/* Item 3: Pataki Chakra */}
            <TouchableOpacity style={styles.exploreRailCard} activeOpacity={0.8}>
              <View style={styles.exploreMedallionBox}>
                <View style={styles.floatingProBadge}>
                  <Text style={styles.floatingProBadgeText}>PRO</Text>
                </View>
                <View style={styles.patakiMedallion}>
                  <Svg width={72} height={72} viewBox="0 0 100 100">
                    <Circle cx="50" cy="50" r="42" fill="none" stroke="#DFB059" strokeWidth="1.5" />
                    <Line x1="20" y1="20" x2="80" y2="80" stroke="#DFB059" strokeWidth="2" />
                    <Line x1="80" y1="20" x2="20" y2="80" stroke="#DFB059" strokeWidth="2" />
                    <Polygon points="50,15 65,30 50,45 35,30" fill="#9333ea" stroke="#DFB059" strokeWidth="1" />
                    <Polygon points="50,55 65,70 50,85 35,70" fill="#9333ea" stroke="#DFB059" strokeWidth="1" />
                    <Circle cx="50" cy="50" r="7" fill="#DFB059" />
                  </Svg>
                </View>
              </View>
              <Text style={styles.exploreItemName}>Pataki Chakra</Text>
              <Text style={styles.exploreItemDesc}>Vulnerability Map</Text>
            </TouchableOpacity>

            {/* Item 4: Sarvatobhadra Chakra */}
            <TouchableOpacity
              style={styles.exploreRailCardCompact}
              onPress={() => setShowJainCalendarModal(true)}
              activeOpacity={0.8}
            >
              <View style={styles.sarvatoMedallion}>
                <Text style={styles.wheelEmoji}>☸</Text>
              </View>
              <Text style={styles.exploreItemNameSmall}>Sarvato-bhadra</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 9. Daily Spiritual Guidance */}
        <View style={styles.sectionContainer}>
          <View style={styles.guidanceMasterCard}>
            {/* Header */}
            <View style={styles.guidanceHeaderRow}>
              <View style={styles.guidanceHeaderLeft}>
                <View style={styles.goldPillIndicator} />
                <Text style={styles.guidanceTitleText} numberOfLines={1}>Daily Spiritual Guidance</Text>
              </View>
              <View style={styles.sadhanaBadge}>
                <Text style={styles.sadhanaBadgeText}>TODAY'S SADHANA</Text>
              </View>
            </View>

            {/* Ritual Overview */}
            <View style={styles.ritualHeaderRow}>
              <View>
                <Text style={styles.ritualCategory}>SOLAR RITUAL</Text>
                <Text style={styles.ritualName}>Surya Arghya Vidhi</Text>
              </View>
              <View style={styles.ritualTimeTag}>
                <Text style={styles.ritualTimeText}>
                  {cleanVedicTime(panchang.sunMoon.sunrise) || '06:12 AM'} – 06:45 AM
                </Text>
              </View>
            </View>

            {/* Sacred Velvet Maroon Mantra Pod */}
            <View style={styles.mantraPod}>
              <Text style={styles.mantraCategory}>PRATYAKSHA DEVATA MANTRA</Text>
              <Text style={styles.sanskritMantra}>ॐ सूर्याय नमः</Text>
              <Text style={styles.iastMantra}>Om Suryaya Namah</Text>
              <Text style={styles.mantraTranslation}>
                "Salutations to the Sun — source of divine vitality, inner illumination & cosmic order."
              </Text>
            </View>

            <Text style={styles.ritualInstructions}>
              Offer pure water infused with red sandalwood, kumkum, and fresh akshat in a sacred copper vessel facing East within one hour of sunrise.
            </Text>

            {/* Complete Vidhi Action Button */}
            <TouchableOpacity style={styles.completeVidhiBtn} activeOpacity={0.85}>
              <Text style={styles.completeVidhiBtnText}>VIEW COMPLETE VIDHI & 12 SOLAR MANTRAS →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modals & Dialogs */}
      <LanguageSelectionModal
        visible={showLangModal}
        onClose={() => setShowLangModal(false)}
      />

      <LalKitabModal
        visible={showLalKitabModal}
        onClose={() => setShowLalKitabModal(false)}
        defaultCity={selectedCity?.name}
        initialDob={lalKitabPayload.dob}
        initialTob={lalKitabPayload.tob}
        initialCity={lalKitabPayload.city}
        initialLat={lalKitabPayload.lat}
        initialLon={lalKitabPayload.lon}
      />

      <BirthChartModal
        visible={showBirthChartModal}
        onClose={() => setShowBirthChartModal(false)}
        selectedCity={selectedCity}
      />

      <JainCalendarModal
        visible={showJainCalendarModal}
        onClose={() => setShowJainCalendarModal(false)}
        selectedCity={selectedCity}
        panchang={panchang}
      />

      <NavtaraModal
        visible={showNavtaraModal}
        onClose={() => setShowNavtaraModal(false)}
        defaultNakshatraIndex={panchang.nakshatra.number || 1}
      />

      <KotaChakraModal
        visible={showKotaChakraModal}
        onClose={() => setShowKotaChakraModal(false)}
        defaultNakshatraIndex={panchang.nakshatra.number || 1}
      />

      <CentralAlmanacHubModal
        visible={showCentralHubModal}
        onClose={() => setShowCentralHubModal(false)}
        dateIso={currentDateIso}
        selectedCity={selectedCity}
        panchang={panchang}
        initialTab={centralHubInitialTab}
        onSelectDateIso={onSelectDateIso}
        onOpenCityPicker={onOpenCityPicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5EE', // Celestial Dots light canvas
  },
  scrollContent: {
    paddingBottom: 95, // Breathing room above floating dock
  },

  // 1. Master Hero Card Styles
  heroCard: {
    backgroundColor: '#37151C',
    borderRadius: 28,
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 14,
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(252, 211, 77, 0.3)',
    elevation: 8,
    shadowColor: '#1E070C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  heroContentInner: {
    padding: 18,
  },
  orbitCircle1: {
    position: 'absolute',
    top: -45,
    right: -45,
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.15)',
  },
  orbitCircle2: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 330,
    height: 330,
    borderRadius: 165,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(223, 176, 89, 0.10)',
  },
  heroTopBadgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 5,
  },
  heroVikramBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.4)',
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 999,
  },
  heroBadgeStar: {
    fontSize: 10,
    color: '#DFB059',
  },
  heroVikramText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F5DE9C',
    letterSpacing: 0.8,
  },
  heroMasaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  glowingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DFB059',
  },
  heroMasaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F5DE9C',
    letterSpacing: 1.2,
  },
  heroMiddleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    zIndex: 5,
  },
  heroTithiCol: {
    flex: 1,
    paddingRight: 12,
  },
  tithiPradhanaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(223, 176, 89, 0.9)',
    letterSpacing: 2,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  tithiTitleText: {
    fontFamily: 'serif',
    fontSize: 25,
    lineHeight: 29,
    fontWeight: '700',
    color: '#FDF8EE',
    letterSpacing: 0.3,
  },
  lunarDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  moonIconText: {
    fontSize: 13,
  },
  lunarDayText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#EAD8B8',
  },
  heroMoonCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunPodsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    zIndex: 5,
  },
  sunPodCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.2)',
    borderRadius: 16,
    padding: 10,
  },
  sunPodIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(68, 28, 34, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunPodTextBox: {
    flex: 1,
  },
  sunPodLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: 'rgba(223, 176, 89, 0.7)',
    letterSpacing: 1,
  },
  sunPodTime: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 1,
  },
  sacredTriadRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(223, 176, 89, 0.2)',
    marginTop: 18,
    paddingTop: 14,
    zIndex: 5,
  },
  triadCol: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  triadColDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.2)',
  },
  triadLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: 'rgba(223, 176, 89, 0.8)',
    letterSpacing: 1.5,
  },
  triadVal: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  triadSub: {
    fontSize: 10,
    color: 'rgba(245, 222, 156, 0.7)',
    marginTop: 2,
  },
  expandHubBadge: {
    marginTop: 14,
    backgroundColor: 'rgba(223, 176, 89, 0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.35)',
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  expandHubBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#DFB059',
    letterSpacing: 1.2,
  },

  // Common Section Layout Styles
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  maroonPillIndicator: {
    width: 5,
    height: 18,
    borderRadius: 2.5,
    backgroundColor: '#2B0E14',
  },
  goldPillIndicator: {
    width: 5,
    height: 18,
    borderRadius: 2.5,
    backgroundColor: '#B88428',
  },
  sectionTitleText: {
    fontFamily: 'serif',
    fontSize: 20,
    fontWeight: '700',
    color: '#2B0E14',
  },
  sectionLinkBtn: {
    paddingVertical: 2,
  },
  sectionLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(43, 14, 20, 0.7)',
    letterSpacing: 0.8,
  },
  cardsTwoColGrid: {
    flexDirection: 'row',
    gap: 12,
  },

  // 2. Kaal & Muhurat Styles
  abhijitCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(35, 123, 75, 0.3)',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  rahuCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(188, 44, 44, 0.3)',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sparkleIcon: {
    fontSize: 14,
    color: '#F59E0B',
  },
  warningIcon: {
    fontSize: 14,
  },
  shubhaBadge: {
    backgroundColor: '#E9F5EE',
    borderWidth: 1,
    borderColor: 'rgba(35, 123, 75, 0.3)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  shubhaBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#237B4B',
    letterSpacing: 0.8,
  },
  varjyaBadge: {
    backgroundColor: '#FDF0F0',
    borderWidth: 1,
    borderColor: 'rgba(188, 44, 44, 0.3)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  varjyaBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#BC2C2C',
    letterSpacing: 0.8,
  },
  muhuratCardHeading: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: '#2B0E14',
  },
  muhuratCardSub: {
    fontSize: 10.5,
    color: '#7D6A68',
    marginTop: 2,
  },
  muhuratCardFooter: {
    marginTop: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(234, 219, 206, 0.6)',
  },
  abhijitTimingText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#237B4B',
  },
  rahuTimingText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#BC2C2C',
  },
  muhuratProgressTrack: {
    height: 3.5,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
    width: '100%',
  },
  muhuratProgressFillShubh: {
    height: '100%',
    backgroundColor: '#237B4B',
    borderRadius: 2,
  },
  muhuratProgressFillVarjya: {
    height: '100%',
    backgroundColor: '#BC2C2C',
    borderRadius: 2,
  },

  // 3. Day Choghadiya Strip Styles
  choghadiyaStripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EADBCE',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  choghadiyaTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  choghadiyaTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clockIcon: {
    fontSize: 14,
  },
  choghadiyaStripTitle: {
    fontFamily: 'serif',
    fontSize: 16,
    fontWeight: '700',
    color: '#2B0E14',
  },
  amritBadge: {
    backgroundColor: '#E9F5EE',
    borderWidth: 1,
    borderColor: 'rgba(35, 123, 75, 0.3)',
    paddingHorizontal: 9,
    paddingVertical: 2.5,
    borderRadius: 999,
  },
  amritBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#237B4B',
    letterSpacing: 0.8,
  },
  choghadiyaBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  choghadiyaStatusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  choghadiyaPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
  },
  choghadiyaActiveName: {
    fontSize: 12,
    color: '#2D1B1E',
  },
  boldText: {
    fontWeight: '700',
  },
  choghadiyaTimeWindow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2B0E14',
  },

  // 4. Current Planetary & Gochar Styles
  planetaryMasterCard: {
    backgroundColor: '#37151C',
    borderRadius: 24,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(223, 176, 89, 0.3)',
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#200A0F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  planetaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(223, 176, 89, 0.2)',
    paddingBottom: 11,
    marginBottom: 13,
    zIndex: 5,
  },
  planetaryHeaderLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 8,
  },
  planetaryTitleGroup: {
    flex: 1,
    minWidth: 0,
  },
  planetIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  planetEmoji: {
    fontSize: 13,
  },
  planetaryTitle: {
    fontFamily: 'serif',
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  planetarySub: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#F5DE9C',
    letterSpacing: 0.8,
  },
  planetaryViewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(223, 176, 89, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.38)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 999,
    flexShrink: 0,
  },
  planetaryViewText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#F5DE9C',
    letterSpacing: 0.5,
  },
  planetaryViewArrow: {
    fontSize: 9,
    fontWeight: '700',
    color: '#F5DE9C',
  },
  planetTransitCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 14,
    padding: 11,
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.2)',
    justifyContent: 'space-between',
    minHeight: 82,
  },
  planetCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planetName: {
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '700',
    color: '#DFB059',
  },
  neechaBadge: {
    backgroundColor: 'rgba(60, 10, 15, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  neechaBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#FCA5A5',
  },
  vakriBadge: {
    backgroundColor: 'rgba(60, 40, 10, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  vakriBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#FCD34D',
  },
  gocharBadge: {
    backgroundColor: 'rgba(15, 25, 60, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  gocharBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#93C5FD',
  },
  swakshetraBadge: {
    backgroundColor: 'rgba(10, 50, 30, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  swakshetraBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#A7F3D0',
  },
  planetRashi: {
    fontSize: 11.5,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 3,
  },
  planetBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  planetDesc: {
    fontSize: 9.5,
    color: 'rgba(245, 222, 156, 0.7)',
  },
  planetDeg: {
    fontSize: 10.5,
    fontFamily: 'monospace',
    color: '#DFB059',
  },

  // 5. Kundli Master Card Styles
  kundliMasterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EADBCE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  kundliHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(234, 219, 206, 0.7)',
    paddingBottom: 12,
    marginBottom: 14,
  },
  kundliHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  crystalOrbBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#F6EEFA',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crystalOrbText: {
    fontSize: 18,
  },
  kundliTitle: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: '#2B0E14',
  },
  kundliSub: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#7D6A68',
    letterSpacing: 0.8,
  },
  openBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  openBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#2B0E14',
  },
  kundliBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  kundliDetailsCol: {
    flex: 1.2,
    gap: 8,
  },
  kundliSpecBox: {
    backgroundColor: '#FBF9F4',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(234, 219, 206, 0.6)',
  },
  kundliSpecLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#7D6A68',
    letterSpacing: 0.8,
  },
  kundliSpecVal: {
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '700',
    color: '#2B0E14',
    marginTop: 1,
  },
  kundliSpecDeg: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#B45309',
    marginTop: 1,
  },
  signsPairRow: {
    flexDirection: 'row',
    gap: 8,
  },
  signPillBox: {
    flex: 1,
    backgroundColor: '#FBF9F4',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(234, 219, 206, 0.6)',
  },
  signPillLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#7D6A68',
    letterSpacing: 0.6,
  },
  signPillVal: {
    fontFamily: 'serif',
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2B0E14',
    marginTop: 1,
  },
  kundliYantraBox: {
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: '#37151C',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 6. AI Kundli Details Styles
  aiKundliMasterCard: {
    backgroundColor: '#37151C',
    borderRadius: 24,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(223, 176, 89, 0.3)',
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#1E070C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  aiKundliHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(223, 176, 89, 0.2)',
    paddingBottom: 11,
    marginBottom: 12,
    zIndex: 5,
    gap: 8,
  },
  aiKundliHeaderLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 6,
  },
  aiTitleGroup: {
    flex: 1,
    minWidth: 0,
  },
  aiIconBox: {
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  aiIconText: {
    fontSize: 14,
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiKundliTitle: {
    fontFamily: 'serif',
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  liveBadge: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 999,
  },
  liveBadgeText: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  aiKundliSub: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#F5DE9C',
    letterSpacing: 0.8,
  },
  aiConsultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(223, 176, 89, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.38)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 999,
    flexShrink: 0,
  },
  aiConsultText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#F5DE9C',
    letterSpacing: 0.4,
  },
  aiConsultArrow: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#F5DE9C',
  },
  aiInsightsContainer: {
    gap: 10,
    zIndex: 5,
  },
  aiInsightCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 12,
    padding: 11,
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.2)',
  },
  aiInsightTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiInsightTitle: {
    fontFamily: 'serif',
    fontSize: 13.5,
    fontWeight: '600',
    color: '#F5DE9C',
  },
  activeTransitBadge: {
    backgroundColor: '#2B0E14',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  activeTransitText: {
    fontSize: 8.5,
    fontFamily: 'monospace',
    color: '#DFB059',
  },
  tenthHouseBadge: {
    backgroundColor: '#2B0E14',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  tenthHouseText: {
    fontSize: 8.5,
    fontFamily: 'monospace',
    color: '#FCD34D',
  },
  aiInsightDesc: {
    fontSize: 11.5,
    color: '#E5E7EB',
    lineHeight: 16,
  },
  remedyCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#37151C',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.4)',
  },
  diyaIcon: {
    fontSize: 20,
  },
  remedyTextBox: {
    flex: 1,
  },
  remedyLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#DFB059',
    letterSpacing: 1,
  },
  remedyVal: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 1,
  },

  // 7. Explore Vedic Astrology Rail Styles
  exploreSubtitle: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#7D6A68',
    letterSpacing: 0.8,
  },
  swipeHintText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: 'rgba(125, 106, 104, 0.8)',
  },
  exploreScrollRail: {
    paddingVertical: 4,
    gap: 14,
  },
  exploreRailCard: {
    width: 136,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EADBCE',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  exploreRailCardCompact: {
    width: 108,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EADBCE',
    alignItems: 'center',
    opacity: 0.85,
  },
  exploreMedallionBox: {
    position: 'relative',
    marginBottom: 8,
  },
  floatingNewBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    zIndex: 10,
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 999,
  },
  floatingNewBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  floatingProBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    zIndex: 10,
    backgroundColor: '#2B0E14',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.4)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 999,
  },
  floatingProBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#DFB059',
    letterSpacing: 0.4,
  },
  navtaraMedallion: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#37151C',
    borderWidth: 2,
    borderColor: '#DFB059',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kotaMedallion: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#25100B',
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patakiMedallion: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#1B1933',
    borderWidth: 2,
    borderColor: '#DFB059',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sarvatoMedallion: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(55, 21, 28, 0.7)',
    borderWidth: 1.5,
    borderColor: 'rgba(223, 176, 89, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  wheelEmoji: {
    fontSize: 22,
    color: '#DFB059',
  },
  exploreItemName: {
    fontFamily: 'serif',
    fontSize: 15,
    fontWeight: '700',
    color: '#2B0E14',
    textAlign: 'center',
  },
  exploreItemNameSmall: {
    fontFamily: 'serif',
    fontSize: 13,
    fontWeight: '700',
    color: '#2B0E14',
    textAlign: 'center',
  },
  exploreItemDesc: {
    fontSize: 10,
    fontWeight: '500',
    color: '#7D6A68',
    textAlign: 'center',
    marginTop: 1,
  },

  // 8. Daily Spiritual Guidance Styles
  guidanceMasterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EADBCE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  guidanceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(234, 219, 206, 0.7)',
    paddingBottom: 12,
    marginBottom: 12,
    gap: 8,
  },
  guidanceHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 6,
  },
  guidanceTitleText: {
    fontFamily: 'serif',
    fontSize: 14.8,
    fontWeight: '700',
    color: '#2B0E14',
    flexShrink: 1,
  },
  sadhanaBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    flexShrink: 0,
    alignSelf: 'center',
  },
  sadhanaBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#78350F',
    letterSpacing: 0.5,
  },
  ritualHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  ritualCategory: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 0.8,
  },
  ritualName: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: '700',
    color: '#2B0E14',
    marginTop: 1,
  },
  ritualTimeTag: {
    backgroundColor: '#F8F5EE',
    borderWidth: 1,
    borderColor: '#EADBCE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ritualTimeText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#7D6A68',
  },
  mantraPod: {
    backgroundColor: '#37151C',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.4)',
    alignItems: 'center',
    marginBottom: 10,
  },
  mantraCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DFB059',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  sanskritMantra: {
    fontFamily: 'serif',
    fontSize: 23,
    fontWeight: '700',
    color: '#F5DE9C',
    letterSpacing: 0.5,
  },
  iastMantra: {
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontSize: 13.5,
    color: '#F7EDE1',
    marginTop: 1,
  },
  mantraTranslation: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#D1D5DB',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
  },
  ritualInstructions: {
    fontSize: 11.5,
    color: '#2D1B1E',
    lineHeight: 17,
    marginBottom: 12,
  },
  completeVidhiBtn: {
    backgroundColor: '#DFB059',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  completeVidhiBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2B0E14',
    letterSpacing: 0.8,
  },
});
