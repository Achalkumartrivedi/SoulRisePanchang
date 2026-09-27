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
        {/* 1. Hero Celestial Banner (Sunrise, Sunset, Moonrise, Moonset) */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.heroTithiName} numberOfLines={1} adjustsFontSizeToFit>
                {locHeroTithi.name}
              </Text>
              <Text style={styles.heroPakshaText} numberOfLines={1} adjustsFontSizeToFit>
                {locHeroPaksha} • {panchang.samvat.monthName} • {panchang.samvat.vikramSamvat} {showHindiScript ? 'विक्रम' : 'Vikram'}
              </Text>
            </View>
            <View style={styles.heroActiveTag}>
              <Text style={styles.heroActiveTagText}>🌕 {t('activeTithi')}</Text>
            </View>
          </View>

          {/* Astronomical Timings */}
          <View style={styles.astroGrid}>
            <View style={styles.astroItem}>
              <Text style={styles.astroIcon}>🌅</Text>
              <Text style={styles.astroLabel}>{t('sunrise')}</Text>
              <Text style={styles.astroVal}>{panchang.sunMoon.sunrise}</Text>
            </View>
            <View style={styles.astroItem}>
              <Text style={styles.astroIcon}>🌇</Text>
              <Text style={styles.astroLabel}>{t('sunset')}</Text>
              <Text style={styles.astroVal}>{panchang.sunMoon.sunset}</Text>
            </View>
            <View style={styles.astroItem}>
              <Text style={styles.astroIcon}>🌙</Text>
              <Text style={styles.astroLabel}>{t('moonrise')}</Text>
              <Text style={styles.astroVal}>{panchang.sunMoon.moonrise}</Text>
            </View>
            <View style={styles.astroItem}>
              <Text style={styles.astroIcon}>🌘</Text>
              <Text style={styles.astroLabel}>{t('moonset')}</Text>
              <Text style={styles.astroVal}>{panchang.sunMoon.moonset}</Text>
            </View>
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

          {/* ☸️ Section 5.5: Jain Calendar & Panchang (જૈન પંચાંગ અને કૅલેન્ડર) */}
          <TouchableOpacity
            style={[styles.featureCardContainer, { backgroundColor: '#26060B', borderColor: 'rgba(255, 215, 0, 0.35)', borderWidth: 1.2 }]}
            onPress={() => setShowJainCalendarModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.featureHeader}>
              <View style={styles.featureHeaderLeft}>
                <Text style={styles.featureIcon}>☸️</Text>
                <View style={{ flex: 1, paddingRight: 6 }}>
                  <View style={[styles.titleRow, { flexWrap: 'wrap', gap: 6, alignItems: 'center' }]}>
                    <Text style={[styles.featureTitle, { color: '#FFF8E7', fontWeight: 'bold', flexShrink: 1 }]} numberOfLines={1} adjustsFontSizeToFit>
                      જૈન પંચાંગ અને કૅલેન્ડર
                    </Text>
                    <View style={[styles.comingSoonBadge, { backgroundColor: '#FFD700', borderColor: '#FFD700', marginLeft: 0 }]}>
                      <Text style={[styles.comingSoonText, { color: '#210206' }]}>જૈન વિધિ</Text>
                    </View>
                  </View>
                  <Text style={[styles.featureSub, { color: '#E6C280' }]} numberOfLines={1} adjustsFontSizeToFit>
                    વીર નિર્વાણ સંવત ૨૫૫૧ • પચ્ચક્ખાણ • જૈન પર્વ અને વિધિ
                  </Text>
                </View>
              </View>
              <Text style={[styles.expandArrow, { color: '#FFD700' }]}>➔</Text>
            </View>
          </TouchableOpacity>

          {/* Section 7: AI Kundli Details */}
          <TouchableOpacity
            style={[styles.featureCardContainer, { backgroundColor: '#26060B', borderColor: 'rgba(255, 215, 0, 0.35)', borderWidth: 1.2 }]}
            onPress={() => setShowLalKitabModal(true)}
            activeOpacity={0.8}
          >
            <View style={styles.featureHeader}>
              <View style={styles.featureHeaderLeft}>
                <Text style={styles.featureIcon}>📕</Text>
                <View>
                  <View style={[styles.titleRow, { gap: 6, alignItems: 'center' }]}>
                    <Text style={[styles.featureTitle, { color: '#FFF8E7', fontWeight: 'bold' }]}>
                      {showHindiScript ? 'AI Kundli Details' : 'AI Kundli Details'}
                    </Text>
                    <View style={[styles.comingSoonBadge, { backgroundColor: '#FF8F00', borderColor: '#FFA000' }]}>
                      <Text style={[styles.comingSoonText, { color: '#FFFFFF' }]}>LIVE</Text>
                    </View>
                  </View>
                  <Text style={[styles.featureSub, { color: '#E6C280' }]}>
                    Saturn 1-5-9 Trine Timeline, Ketu Breaks & Remedies
                  </Text>
                </View>
              </View>
              <Text style={[styles.expandArrow, { color: '#FFD700' }]}>➔</Text>
            </View>
          </TouchableOpacity>

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
    backgroundColor: '#170205',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#26060B',
    borderRadius: 22,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 14,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 215, 0, 0.28)',
    elevation: 6,
    shadowColor: 'rgba(255, 215, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroTithiName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF8E7',
  },
  heroPakshaText: {
    fontSize: 12,
    color: '#E6C280',
    marginTop: 2,
    fontWeight: '500',
  },
  heroActiveTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  heroActiveTagText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: 'bold',
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
