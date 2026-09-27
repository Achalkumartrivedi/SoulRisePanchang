import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../theme/colors';
import { PanchangDayData, CityLocation } from '../types/panchang';
import { Header } from '../components/Header';
import { PanchangLimbCard } from '../components/PanchangLimbCard';
import { SunMoonWidget } from '../components/SunMoonWidget';
import { MuhuratCard } from '../components/MuhuratCard';
import { ChoghadiyaGrid } from '../components/ChoghadiyaGrid';
import { GocharKundaliCard } from '../components/GocharKundaliCard';
import { LanguageSelectionModal } from '../components/LanguageSelectionModal';
import { BirthChartModal } from '../components/BirthChartModal';
import { JainCalendarModal } from '../components/JainCalendarModal';
import { LalKitabModal } from '../components/LalKitabModal';
import { NavtaraModal } from '../components/NavtaraModal';
import { KotaChakraModal } from '../components/KotaChakraModal';
import { PaintBrushHeader } from '../components/PaintBrushHeader';
import { VedicDimensionsWidget } from '../components/VedicDimensionsWidget';
import { MoonPhaseVisual } from '../components/MoonPhaseVisual';
import Svg, { Circle, Path } from 'react-native-svg';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedTithi, getLocalizedPakshaName } from '../i18n/vedicTerms';

interface HomeScreenProps {
  panchang: PanchangDayData;
  currentDateIso: string;
  selectedCity: CityLocation;
  onOpenCityPicker: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onNavigateToFestivals: () => void;
  onSelectDateIso?: (dateIso: string) => void;
}

type SectionKey = 'LIMBS' | 'MUHURAT' | 'CHOGHADIYA' | 'PLANETS' | 'KUNDALI' | 'WESTERN' | 'LALKITAB';

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
}) => {
  const { language, t } = useLanguage();

  // Default active section on app open is LIMBS (Panchangam 5 Sacred Limbs), nullable so re-click collapses it!
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);
  const [showLangModal, setShowLangModal] = useState(false);
  const [showBirthChartModal, setShowBirthChartModal] = useState(false);
  const [showJainCalendarModal, setShowJainCalendarModal] = useState(false);
  const [showLalKitabModal, setShowLalKitabModal] = useState(false);
  const [showNavtaraModal, setShowNavtaraModal] = useState(false);
  const [showKotaChakraModal, setShowKotaChakraModal] = useState(false);
  const [lalKitabPayload, setLalKitabPayload] = useState<{
    dob?: string;
    tob?: string;
    city?: string;
    lat?: number;
    lon?: number;
  }>({});

  const handleOpenLalKitabFromChart = (profile: { dob: string; tob: string; city: string; lat?: number; lon?: number }) => {
    setLalKitabPayload(profile);
    setShowBirthChartModal(false);
    setShowLalKitabModal(true);
  };

  const tithiInPaksha = (((panchang.tithi.number || 1) - 1) % 15) + 1;
  const locHeroTithi = getLocalizedTithi(tithiInPaksha, language);
  const locHeroPaksha = getLocalizedPakshaName(panchang.tithi.paksha === 'KRISHNA' ? 'KRISHNA' : 'SHUKLA', language);
  const showHindiScript = language === 'hi' || language === 'hinglish';

  const abhijitItem = panchang.auspiciousMuhurats?.find(m => m.name.toLowerCase().includes('abhijit'));
  const rahuItem = panchang.inauspiciousMuhurats?.find(m => m.name.toLowerCase().includes('rahu'));

  const toggleSection = (key: SectionKey) => {
    setActiveSection(prev => (prev === key ? null : key));
  };

  return (
    <View style={styles.container}>
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
        {/* 1. Hero Celestial Sanctuary Card */}
        <View style={styles.heroCard}>
          {/* Astrological Mandala Watermark in Background */}
          <View style={styles.watermarkContainer} pointerEvents="none">
            <Svg width={140} height={140} viewBox="0 0 100 100">
              <Circle cx="50" cy="50" r="48" fill="none" stroke="#FFDCA1" strokeWidth="1.5" />
              <Circle cx="50" cy="50" r="32" fill="none" stroke="#FFDCA1" strokeWidth="1" />
              <Path d="M50 2 L50 98 M2 50 L98 50 M16 16 L84 84 M16 84 L84 16" stroke="#FFDCA1" strokeWidth="0.8" />
              <Circle cx="50" cy="50" r="14" fill="#FFDCA1" />
            </Svg>
          </View>

          {/* Era Badges */}
          <View style={styles.heroEraRow}>
            <View style={styles.eraBadgesLeft}>
              <View style={styles.eraPillHigh}>
                <Text style={styles.eraPillTextHigh}>VIKRAM {panchang.samvat.vikramSamvat || 2083}</Text>
              </View>
              <View style={styles.eraPillHighest}>
                <Text style={styles.eraPillTextHighest}>VEER 2553</Text>
              </View>
            </View>
            <View style={styles.masaBadge}>
              <View style={styles.masaPulseDot} />
              <Text style={styles.masaText}>{(panchang.samvat.monthName || 'ASHVIN').toUpperCase()} MASA</Text>
            </View>
          </View>

          {/* Main Lunar Phase Centerpiece */}
          <View style={styles.heroLunarCenterpiece}>
            <View style={styles.heroTithiInfo}>
              <Text style={styles.tithiPradhanaLabel}>TITHI PRADHANA</Text>
              <Text style={styles.heroTithiTitle}>{locHeroPaksha}</Text>
              <Text style={styles.heroTithiTitle}>{locHeroTithi.name}</Text>
              <Text style={styles.heroLunarSubtitle}>
                {panchang.tithi.number ? `${panchang.tithi.number}th Lunar Day` : '2nd Lunar Day'} • Unto {panchang.tithi.endTimeFormatted || '04:38 PM'}
              </Text>
            </View>

            {/* 🌙 Luminous Golden Moon Phase */}
            <MoonPhaseVisual
              paksha={panchang.tithi.paksha}
              tithiNumber={panchang.tithi.number || 2}
              size={66}
            />
          </View>

          {/* Surya / Chandra Solar Telemetry Dual Cards */}
          <View style={styles.solarTelemetryRow}>
            <View style={styles.telemetryCard}>
              <View style={styles.telemetryIconContainer}>
                <Text style={styles.telemetryIcon}>☼</Text>
              </View>
              <View style={styles.telemetryCol}>
                <Text style={styles.telemetryLabel}>SUNRISE</Text>
                <Text style={styles.telemetryVal}>{panchang.sunMoon.sunrise || '06:12 AM'}</Text>
              </View>
            </View>

            <View style={styles.telemetryCard}>
              <View style={[styles.telemetryIconContainer, { backgroundColor: 'rgba(255, 183, 78, 0.2)' }]}>
                <Text style={styles.telemetryIcon}>🌅</Text>
              </View>
              <View style={styles.telemetryCol}>
                <Text style={styles.telemetryLabel}>SUNSET</Text>
                <Text style={styles.telemetryVal}>{panchang.sunMoon.sunset || '06:12 PM'}</Text>
              </View>
            </View>
          </View>

          {/* Sacred Triad Astrological Parameters */}
          <View style={styles.sacredTriadRow}>
            <View style={styles.triadCol}>
              <Text style={styles.triadLabel}>NAKSHATRA</Text>
              <Text style={styles.triadVal} numberOfLines={1}>{panchang.nakshatra.name || 'Revati'}</Text>
              <Text style={styles.triadSub} numberOfLines={1}>Till {panchang.nakshatra.endTimeFormatted || '08:24 PM'}</Text>
            </View>
            <View style={[styles.triadCol, styles.triadColBorder]}>
              <Text style={styles.triadLabel}>YOGA</Text>
              <Text style={styles.triadVal} numberOfLines={1}>{panchang.yoga.name || 'Dhruva'}</Text>
              <Text style={styles.triadSub} numberOfLines={1}>Till {panchang.yoga.endTimeFormatted || '11:15 AM'}</Text>
            </View>
            <View style={styles.triadCol}>
              <Text style={styles.triadLabel}>KARANA</Text>
              <Text style={styles.triadVal} numberOfLines={1}>{panchang.karana.name || 'Taitila'}</Text>
              <Text style={styles.triadSub} numberOfLines={1}>Till {panchang.karana.endTimeFormatted || '04:38 PM'}</Text>
            </View>
          </View>
        </View>

        {/* 2. Kaal & Muhurat Highlights */}
        <View style={styles.kaalMuhuratSection}>
          <View style={styles.kaalHeaderRow}>
            <View style={styles.kaalHeaderLeft}>
              <Text style={styles.kaalHeaderIcon}>⌛</Text>
              <Text style={styles.kaalHeaderTitle}>Kaal & Muhurat</Text>
            </View>
            <TouchableOpacity
              style={styles.allTimingsBtn}
              onPress={() => toggleSection('MUHURAT')}
              activeOpacity={0.7}
            >
              <Text style={styles.allTimingsText}>ALL TIMINGS ❯</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.muhuratHighlightsGrid}>
            {/* Abhijit Muhurat (Auspicious) */}
            <TouchableOpacity
              style={styles.muhuratAuspiciousCard}
              onPress={() => toggleSection('MUHURAT')}
              activeOpacity={0.8}
            >
              <View style={styles.muhuratCardLeft}>
                <View style={styles.starIconContainer}>
                  <Text style={styles.starIconText}>⭐</Text>
                </View>
                <View style={styles.muhuratCardInfo}>
                  <View style={styles.muhuratTitleBadgeRow}>
                    <Text style={styles.muhuratCardTitle}>Abhijit Muhurat</Text>
                    <View style={styles.shubhBadge}>
                      <Text style={styles.shubhBadgeText}>SHUBHA</Text>
                    </View>
                  </View>
                  <Text style={styles.muhuratCardTiming}>
                    {abhijitItem ? `${abhijitItem.startTime} – ${abhijitItem.endTime}` : '11:45 AM – 12:30 PM'} • Golden Auspicious
                  </Text>
                </View>
              </View>
              <View style={styles.muhuratActionBtn}>
                <Text style={styles.muhuratActionIcon}>🔔</Text>
              </View>
            </TouchableOpacity>

            {/* Rahu Kaal (Varjya) */}
            <TouchableOpacity
              style={styles.muhuratInauspiciousCard}
              onPress={() => toggleSection('MUHURAT')}
              activeOpacity={0.8}
            >
              <View style={styles.muhuratCardLeft}>
                <View style={styles.blockIconContainer}>
                  <Text style={styles.blockIconText}>🚫</Text>
                </View>
                <View style={styles.muhuratCardInfo}>
                  <View style={styles.muhuratTitleBadgeRow}>
                    <Text style={styles.muhuratCardTitleInauspicious}>Rahu Kaal</Text>
                    <View style={styles.varjyaBadge}>
                      <Text style={styles.varjyaBadgeText}>VARJYA</Text>
                    </View>
                  </View>
                  <Text style={styles.muhuratCardTiming}>
                    {rahuItem ? `${rahuItem.startTime} – ${rahuItem.endTime}` : '01:25 PM – 02:50 PM'} • Inauspicious Window
                  </Text>
                </View>
              </View>
              <View style={styles.muhuratActionBtn}>
                <Text style={styles.muhuratActionIcon}>ℹ️</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 1.5 ⭐ Vedic Dimensions (Real-Time Precision: Choghadiya Countdown & Graha Sthiti) */}
        <VedicDimensionsWidget
          panchang={panchang}
          onPressChoghadiya={() => toggleSection('CHOGHADIYA')}
          onPressPlanets={() => toggleSection('PLANETS')}
        />

        {/* 2. Popular Features Section Header */}
        <View style={styles.popularHeaderRow}>
          <Text style={styles.popularHeaderTitle}>⭐ {t('popularFeatures')}</Text>
          <Text style={styles.popularHeaderSub}>Choose a feature below</Text>
        </View>

        {/* 3. Vertical Section Cards Container */}
        <View style={styles.verticalListContainer}>
          
          {/* Section 1: Panchangam (5 Sacred Limbs) - OPEN BY DEFAULT, CLICK AGAIN TO COLLAPSE */}
          <View style={styles.featureCardContainer}>
            <TouchableOpacity
              style={[styles.featureHeader, activeSection === 'LIMBS' && styles.featureHeaderActive]}
              onPress={() => toggleSection('LIMBS')}
              activeOpacity={0.8}
            >
              <View style={styles.featureHeaderLeft}>
                <Text style={styles.featureIcon}>🪔</Text>
                <View>
                  <Text style={[styles.featureTitle, activeSection === 'LIMBS' && styles.featureTitleActive]}>
                    {t('limbsTab')}
                  </Text>
                  <Text style={[styles.featureSub, activeSection === 'LIMBS' && styles.featureSubActive]}>
                    Tithi, Nakshatra, Yoga, Karana & Vaara
                  </Text>
                </View>
              </View>
              <Text style={styles.expandArrow}>{activeSection === 'LIMBS' ? '▼' : '▶'}</Text>
            </TouchableOpacity>

            {activeSection === 'LIMBS' && (
              <View style={styles.featureBody}>
                <Text style={styles.sectionHeaderTitle} numberOfLines={2} adjustsFontSizeToFit>
                  🪔 {t('panchangamHeader')} - {selectedCity.name}
                </Text>
                <PanchangLimbCard panchang={panchang} />
              </View>
            )}
          </View>

          {/* Section 2: Muhurat & Timings */}
          <View style={styles.featureCardContainer}>
            <TouchableOpacity
              style={[styles.featureHeader, activeSection === 'MUHURAT' && styles.featureHeaderActive]}
              onPress={() => toggleSection('MUHURAT')}
              activeOpacity={0.8}
            >
              <View style={styles.featureHeaderLeft}>
                <Text style={styles.featureIcon}>✨</Text>
                <View>
                  <Text style={[styles.featureTitle, activeSection === 'MUHURAT' && styles.featureTitleActive]}>
                    {t('muhuratTab')}
                  </Text>
                  <Text style={[styles.featureSub, activeSection === 'MUHURAT' && styles.featureSubActive]}>
                    Abhijit, Brahma, Vijaya, Rahu Kalam & Yamaganda
                  </Text>
                </View>
              </View>
              <Text style={styles.expandArrow}>{activeSection === 'MUHURAT' ? '▼' : '▶'}</Text>
            </TouchableOpacity>

            {activeSection === 'MUHURAT' && (
              <View style={styles.featureBody}>
                <MuhuratCard auspicious={panchang.auspiciousMuhurats} inauspicious={panchang.inauspiciousMuhurats} />
              </View>
            )}
          </View>

          {/* Section 3: Day & Night Choghadiya */}
          <View style={styles.featureCardContainer}>
            <TouchableOpacity
              style={[styles.featureHeader, activeSection === 'CHOGHADIYA' && styles.featureHeaderActive]}
              onPress={() => toggleSection('CHOGHADIYA')}
              activeOpacity={0.8}
            >
              <View style={styles.featureHeaderLeft}>
                <Text style={styles.featureIcon}>⏱️</Text>
                <View>
                  <Text style={[styles.featureTitle, activeSection === 'CHOGHADIYA' && styles.featureTitleActive]}>
                    {t('choghadiyaTab')}
                  </Text>
                  <Text style={[styles.featureSub, activeSection === 'CHOGHADIYA' && styles.featureSubActive]}>
                    Amrit, Shubh, Labh, Char, Rog, Kaal & Udveg
                  </Text>
                </View>
              </View>
              <Text style={styles.expandArrow}>{activeSection === 'CHOGHADIYA' ? '▼' : '▶'}</Text>
            </TouchableOpacity>

            {activeSection === 'CHOGHADIYA' && (
              <View style={styles.featureBody}>
                <ChoghadiyaGrid dayChoghadiya={panchang.dayChoghadiya} nightChoghadiya={panchang.nightChoghadiya} />
              </View>
            )}
          </View>

          {/* Section 4: Planetary & Kundali Chart - CONTAINS LAGNA KUNDALI CHART ONLY HERE */}
          <View style={styles.featureCardContainer}>
            <TouchableOpacity
              style={[styles.featureHeader, activeSection === 'PLANETS' && styles.featureHeaderActive]}
              onPress={() => toggleSection('PLANETS')}
              activeOpacity={0.8}
            >
              <View style={styles.featureHeaderLeft}>
                <Text style={styles.featureIcon}>🪐</Text>
                <View>
                  <Text style={[styles.featureTitle, activeSection === 'PLANETS' && styles.featureTitleActive]}>
                    {t('planetsTab')}
                  </Text>
                  <Text style={[styles.featureSub, activeSection === 'PLANETS' && styles.featureSubActive]}>
                    Lagna Kundali Chart & Gochar Planetary Transits
                  </Text>
                </View>
              </View>
              <Text style={styles.expandArrow}>{activeSection === 'PLANETS' ? '▼' : '▶'}</Text>
            </TouchableOpacity>

            {activeSection === 'PLANETS' && (
              <View style={styles.featureBody}>
                <SunMoonWidget sunMoon={panchang.sunMoon} />
                <GocharKundaliCard panchang={panchang} />
              </View>
            )}
          </View>

          {/* Section 5: Kundli - Birth Chart Details */}
          <TouchableOpacity
            style={styles.featureCardContainer}
            onPress={() => setShowBirthChartModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.featureHeader}>
              <View style={styles.featureHeaderLeft}>
                <Text style={styles.featureIcon}>🔮</Text>
                <View>
                  <View style={styles.titleRow}>
                    <Text style={styles.featureTitle}>Kundli - Birth Chart Details</Text>
                  </View>
                  <Text style={styles.featureSub}>
                    D1, Moon, Sun, D2, D9 & D10 Charts, Avakahada & Planets
                  </Text>
                </View>
              </View>
              <Text style={styles.expandArrow}>▶</Text>
            </View>
          </TouchableOpacity>

          {/* Section 6: Jain Niyama & Pachkhan (Royal Heritage Stitch Style) */}
          <View style={styles.jainNiyamaCard}>
            <View style={styles.jainCardHeader}>
              <View style={styles.jainTitleRow}>
                <Text style={styles.jainIcon}>🪔</Text>
                <Text style={styles.jainTitle}>Jain Niyama & Pachkhan</Text>
              </View>
              <View style={styles.tithiBadge}>
                <Text style={styles.tithiBadgeText}>TITHI {panchang.tithi.number || 2}</Text>
              </View>
            </View>

            <View style={styles.jainPachkhanGrid}>
              <View style={styles.pachkhanTile}>
                <Text style={styles.pachkhanLabel}>NAVKARSI</Text>
                <Text style={styles.pachkhanTime}>07:00 AM</Text>
                <Text style={styles.pachkhanSub}>Sunrise + 48m</Text>
              </View>
              <View style={styles.pachkhanTile}>
                <Text style={styles.pachkhanLabel}>PORSI</Text>
                <Text style={styles.pachkhanTime}>09:12 AM</Text>
                <Text style={styles.pachkhanSub}>1 Prahar</Text>
              </View>
              <View style={styles.pachkhanTile}>
                <Text style={styles.pachkhanLabel}>CHAUVIHAR</Text>
                <Text style={styles.pachkhanTime}>06:12 PM</Text>
                <Text style={styles.pachkhanSub}>Sunset Exact</Text>
              </View>
            </View>

            <View style={styles.jainAudioRow}>
              <Text style={styles.jainAudioText}>Listen to Daily Pachkhan audio recital</Text>
              <TouchableOpacity
                style={styles.playSutraBtn}
                onPress={() => setShowJainCalendarModal(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.playSutraText}>▶ Play Sutra</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section 7: SoulRise Vedic Oracle / Ask Pandit AI */}
          <View style={styles.oracleCard}>
            <View style={styles.oracleTopRow}>
              <View style={styles.oracleTextCol}>
                <View style={styles.oracleLabelRow}>
                  <Text style={styles.oracleSparkle}>✦</Text>
                  <Text style={styles.oracleLabel}>SOULRISE VEDIC ORACLE</Text>
                </View>
                <Text style={styles.oracleHeading}>Ask Pandit AI</Text>
                <Text style={styles.oracleDesc}>
                  Receive tailored astrological clarity for investments, relationships & today's queries.
                </Text>
              </View>
              <View style={styles.oracleIconBox}>
                <Text style={styles.oracleIconText}>💡</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.oracleGoldBtn}
              onPress={() => setShowLalKitabModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.oracleGoldBtnText}>CONSULT ORACLE ✨</Text>
            </TouchableOpacity>
          </View>

          {/* Section 7.5: Daily Sacred Rituals */}
          <View style={styles.ritualsContainer}>
            <View style={styles.ritualsHeaderRow}>
              <View style={styles.ritualsHeaderLeft}>
                <Text style={styles.ritualsHeaderIcon}>🪔</Text>
                <Text style={styles.ritualsHeaderTitle}>Daily Sacred Rituals</Text>
              </View>
              <Text style={styles.ritualsGuidanceText}>Guidance</Text>
            </View>
            <View style={styles.ritualCard}>
              <View style={styles.ritualBannerBadge}>
                <Text style={styles.ritualBannerBadgeText}>Pratah Niyama</Text>
              </View>
              <View style={styles.ritualContent}>
                <View style={styles.ritualTitleRow}>
                  <Text style={styles.ritualHeading}>Surya Arghya & Gayatri Samput</Text>
                  <Text style={styles.ritualTimeTag}>06:15 - 06:45 AM</Text>
                </View>
                <Text style={styles.ritualDesc}>
                  Offer holy water in a copper urn facing east during sunrise to balance the solar plexus chakra and invoke vitality for the {panchang.nakshatra.name || 'Revati'} transit.
                </Text>
                <View style={styles.ritualFooterRow}>
                  <View style={styles.mantraRow}>
                    <Text style={styles.mantraIcon}>📖</Text>
                    <Text style={styles.mantraText}>Step-by-step mantra guide included</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.beginVidhiBtn}
                    onPress={() => toggleSection('LIMBS')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.beginVidhiText}>BEGIN VIDHI ➔</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* 🌟 Section 8: Explore Vedic Astrology (Feature Expansion Grid) */}
          <View style={styles.exploreSectionContainer}>
            <PaintBrushHeader
              title={language === 'gu' ? 'વૈદિક જ્યોતિષની શોધ કરો' : language === 'hi' ? 'वैदिक ज्योतिष का अन्वेषण करें' : 'Explore Vedic Astrology'}
            />

            <View style={styles.exploreGridRow}>
              {/* Feature 1: Navtara */}
              <TouchableOpacity
                style={styles.exploreItemCard}
                onPress={() => setShowNavtaraModal(true)}
                activeOpacity={0.7}
              >
                <View style={styles.iconWrapper}>
                  <View style={styles.iconCircleBg}>
                    <Image source={require('../../assets/navtara_icon.png')} style={styles.explore3DIcon} resizeMode="contain" />
                  </View>
                  <View style={styles.newBadgeChip}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                </View>
                <Text style={styles.exploreItemTitle}>
                  {language === 'gu' ? 'નવતારા' : language === 'hi' ? 'नवतारा' : 'Navtara'}
                </Text>
              </TouchableOpacity>

              {/* Feature 2: Kota Chakra */}
              <TouchableOpacity
                style={styles.exploreItemCard}
                onPress={() => setShowKotaChakraModal(true)}
                activeOpacity={0.7}
              >
                <View style={styles.iconWrapper}>
                  <View style={styles.iconCircleBg}>
                    <Image source={require('../../assets/kota_chakra_icon.png')} style={styles.explore3DIcon} resizeMode="contain" />
                  </View>
                  <View style={styles.newBadgeChip}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                </View>
                <Text style={styles.exploreItemTitle}>
                  {language === 'gu' ? 'કોટા ચક્ર' : language === 'hi' ? 'कोटा चक्र' : 'Kota Chakra'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        visible={showLangModal}
        onClose={() => setShowLangModal(false)}
      />

      {/* Lal Kitab & Career Kundli Modal */}
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

      {/* Birth Chart Generator (Janam Kundali) Modal */}
      <BirthChartModal
        visible={showBirthChartModal}
        onClose={() => setShowBirthChartModal(false)}
        selectedCity={selectedCity}
      />

      {/* ☸️ Jain Calendar Modal (જૈન પંચાંગ અને કૅલેન્ડર) */}
      <JainCalendarModal
        visible={showJainCalendarModal}
        onClose={() => setShowJainCalendarModal(false)}
        selectedCity={selectedCity}
        panchang={panchang}
      />

      {/* 🌟 Navtara Chakra Modal */}
      <NavtaraModal
        visible={showNavtaraModal}
        onClose={() => setShowNavtaraModal(false)}
        defaultNakshatraIndex={panchang.nakshatra.number || 1}
      />

      {/* 🏰 Kota Chakra Modal */}
      <KotaChakraModal
        visible={showKotaChakraModal}
        onClose={() => setShowKotaChakraModal(false)}
        defaultNakshatraIndex={panchang.nakshatra.number || 1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#280910', // Deep Canvas (#280910)
  },
  scrollContent: {
    paddingBottom: 48,
  },
  heroCard: {
    backgroundColor: '#37151C', // surface-container (#37151C)
    borderRadius: 28,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 220, 161, 0.16)',
    elevation: 8,
    shadowColor: '#180207',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  watermarkContainer: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    opacity: 0.06,
  },
  heroEraRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  eraBadgesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eraPillHigh: {
    backgroundColor: '#431F26', // surface-container-high
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 999,
  },
  eraPillTextHigh: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFDCA1',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  eraPillHighest: {
    backgroundColor: '#502930', // surface-container-highest
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 999,
  },
  eraPillTextHighest: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#D5C5A5',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  masaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  masaPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFB800',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  masaText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D5C5A5',
    letterSpacing: 0.6,
  },
  heroLunarCenterpiece: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroTithiInfo: {
    flex: 1,
    marginRight: 12,
  },
  tithiPradhanaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFDCA1',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroTithiTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFDCA1',
    marginTop: 2,
    lineHeight: 27,
  },
  heroLunarSubtitle: {
    fontSize: 12.5,
    color: '#D5C4AB',
    marginTop: 3,
  },
  solarTelemetryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  telemetryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(67, 31, 38, 0.7)',
    borderRadius: 18,
    padding: 10,
    shadowColor: '#180207',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  telemetryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 184, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  telemetryIcon: {
    fontSize: 16,
    color: '#FFB800',
  },
  telemetryCol: {
    flex: 1,
  },
  telemetryLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#D5C4AB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  telemetryVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFD9DE',
    marginTop: 1,
  },
  sacredTriadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(81, 69, 45, 0.35)',
    paddingTop: 12,
  },
  triadCol: {
    flex: 1,
    alignItems: 'center',
  },
  triadColBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(81, 69, 45, 0.35)',
    paddingHorizontal: 4,
  },
  triadLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#D5C5A5',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  triadVal: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFDCA1',
    marginTop: 2,
  },
  triadSub: {
    fontSize: 9.5,
    color: '#D5C4AB',
    marginTop: 1,
  },

  // 2. Kaal & Muhurat Highlights Styles
  kaalMuhuratSection: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  kaalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  kaalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  kaalHeaderIcon: {
    fontSize: 15,
  },
  kaalHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFDCA1',
    letterSpacing: 0.3,
  },
  allTimingsBtn: {
    paddingVertical: 2,
  },
  allTimingsText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D5C5A5',
    letterSpacing: 0.8,
  },
  muhuratHighlightsGrid: {
    gap: 8,
  },
  muhuratAuspiciousCard: {
    backgroundColor: '#37151C',
    borderRadius: 24,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 220, 161, 0.16)',
    shadowColor: '#180207',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  muhuratInauspiciousCard: {
    backgroundColor: '#321118',
    borderRadius: 24,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(147, 0, 10, 0.35)',
    shadowColor: '#180207',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  muhuratCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  starIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 184, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starIconText: {
    fontSize: 16,
  },
  blockIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(147, 0, 10, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockIconText: {
    fontSize: 14,
  },
  muhuratCardInfo: {
    flex: 1,
  },
  muhuratTitleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  muhuratCardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFDCA1',
  },
  muhuratCardTitleInauspicious: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFD9DE',
  },
  shubhBadge: {
    backgroundColor: '#FFB800',
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 999,
  },
  shubhBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#412D00',
    textTransform: 'uppercase',
  },
  varjyaBadge: {
    backgroundColor: '#93000A',
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 999,
  },
  varjyaBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#FFDAD6',
    textTransform: 'uppercase',
  },
  muhuratCardTiming: {
    fontSize: 11,
    color: '#D5C4AB',
    marginTop: 2,
  },
  muhuratActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#431F26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  muhuratActionIcon: {
    fontSize: 14,
  },

  // Jain Niyama & Pachkhan Card Styles
  jainNiyamaCard: {
    backgroundColor: '#37151C',
    borderRadius: 24,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 220, 161, 0.16)',
    shadowColor: '#180207',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  jainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jainTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jainIcon: {
    fontSize: 16,
  },
  jainTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFDCA1',
  },
  tithiBadge: {
    backgroundColor: '#431F26',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  tithiBadgeText: {
    fontSize: 9.5,
    color: '#D5C5A5',
    fontWeight: '700',
  },
  jainPachkhanGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  pachkhanTile: {
    flex: 1,
    backgroundColor: 'rgba(67, 31, 38, 0.6)',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
  },
  pachkhanLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#D5C5A5',
    textTransform: 'uppercase',
  },
  pachkhanTime: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFDCA1',
    marginTop: 2,
  },
  pachkhanSub: {
    fontSize: 9.5,
    color: '#D5C4AB',
    marginTop: 1,
  },
  jainAudioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(81, 69, 45, 0.3)',
  },
  jainAudioText: {
    fontSize: 11,
    color: '#D5C4AB',
  },
  playSutraBtn: {
    paddingVertical: 2,
  },
  playSutraText: {
    fontSize: 11.5,
    color: '#FFDCA1',
    fontWeight: '700',
  },

  // SoulRise Cosmic AI Card Styles
  oracleCard: {
    backgroundColor: '#37151C',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.25)',
    shadowColor: 'rgba(255, 184, 0, 0.18)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  oracleTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  oracleTextCol: {
    flex: 1,
    marginRight: 10,
  },
  oracleLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  oracleSparkle: {
    fontSize: 12,
    color: '#FFDCA1',
  },
  oracleLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFDCA1',
    letterSpacing: 1,
  },
  oracleHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFDCA1',
  },
  oracleDesc: {
    fontSize: 11.5,
    color: '#D5C4AB',
    lineHeight: 16,
    marginTop: 3,
  },
  oracleIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 184, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oracleIconText: {
    fontSize: 20,
  },
  oracleGoldBtn: {
    backgroundColor: '#FFB800',
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  oracleGoldBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#412D00',
    letterSpacing: 0.8,
  },

  // Daily Sacred Rituals Styles
  ritualsContainer: {
    marginBottom: 14,
  },
  ritualsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  ritualsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ritualsHeaderIcon: {
    fontSize: 15,
  },
  ritualsHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFDCA1',
  },
  ritualsGuidanceText: {
    fontSize: 10.5,
    color: '#D5C5A5',
    fontWeight: '600',
  },
  ritualCard: {
    backgroundColor: '#37151C',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 220, 161, 0.16)',
    shadowColor: '#180207',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  ritualBannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#431F26',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    margin: 12,
    marginBottom: 4,
  },
  ritualBannerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFDCA1',
  },
  ritualContent: {
    padding: 14,
    paddingTop: 4,
  },
  ritualTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  ritualHeading: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFDCA1',
    flex: 1,
  },
  ritualTimeTag: {
    fontSize: 10,
    color: '#D5C5A5',
    fontWeight: '600',
  },
  ritualDesc: {
    fontSize: 11.5,
    color: '#D5C4AB',
    lineHeight: 16,
    marginBottom: 10,
  },
  ritualFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(81, 69, 45, 0.3)',
  },
  mantraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  mantraIcon: {
    fontSize: 13,
  },
  mantraText: {
    fontSize: 10.5,
    color: '#D5C5A5',
  },
  beginVidhiBtn: {
    paddingVertical: 2,
  },
  beginVidhiText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFDCA1',
    letterSpacing: 0.5,
  },
  astroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(230, 194, 128, 0.14)',
  },
  astroItem: {
    alignItems: 'center',
  },
  astroIcon: {
    fontSize: 18,
  },
  astroLabel: {
    fontSize: 10,
    color: '#C8B89E',
    marginTop: 2,
    fontWeight: '600',
  },
  astroVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFF8E7',
    marginTop: 2,
  },

  // Popular Features Section Styles
  popularHeaderRow: {
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 10,
  },
  popularHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF8E7',
  },
  popularHeaderSub: {
    fontSize: 12,
    color: '#E6C280',
    marginTop: 2,
  },

  // Vertical List Styles
  verticalListContainer: {
    marginHorizontal: 16,
  },
  featureCardContainer: {
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.22)',
    backgroundColor: '#26060B',
    elevation: 4,
    shadowColor: 'rgba(255, 215, 0, 0.12)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#26060B',
    borderRadius: 20,
  },
  featureHeaderActive: {
    backgroundColor: '#350A12',
  },
  featureHeaderDisabled: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#1F060A',
  },
  featureHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF8E7',
  },
  featureTitleActive: {
    color: '#FFD700',
  },
  featureTitleMuted: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8C676E',
  },
  featureSub: {
    fontSize: 11,
    color: '#C8B89E',
    marginTop: 2,
  },
  featureSubActive: {
    color: '#E6C280',
  },
  featureSubMuted: {
    fontSize: 11,
    color: '#8C676E',
    marginTop: 2,
  },
  expandArrow: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 8,
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.18)',
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  comingSoonText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  featureBody: {
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#1E0509',
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF8E7',
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 4,
  },

  // Explore Vedic Astrology Grid Styles (Reference UI)
  exploreSectionContainer: {
    marginTop: 18,
    marginBottom: 24,
  },
  exploreGridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    paddingHorizontal: 16,
  },
  exploreItemCard: {
    width: 95,
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  iconCircleBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#26060B',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  explore3DIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  newBadgeChip: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#210206',
    elevation: 3,
  },
  newBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#210206',
    letterSpacing: 0.2,
  },
  exploreItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF8E7',
    textAlign: 'center',
    lineHeight: 17,
  },
});
