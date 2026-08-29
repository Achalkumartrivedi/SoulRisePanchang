import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { PanchangDayData, CityLocation } from '../types/panchang';
import { Header } from '../components/Header';
import { PanchangLimbCard } from '../components/PanchangLimbCard';
import { SunMoonWidget } from '../components/SunMoonWidget';
import { MuhuratCard } from '../components/MuhuratCard';
import { ChoghadiyaGrid } from '../components/ChoghadiyaGrid';
import { GocharKundaliCard } from '../components/GocharKundaliCard';
import { LanguageSelectionModal } from '../components/LanguageSelectionModal';
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
}) => {
  const { language, t } = useLanguage();

  // Default active section on app open is LIMBS (Panchangam 5 Sacred Limbs)
  const [activeSection, setActiveSection] = useState<SectionKey>('LIMBS');
  const [showLangModal, setShowLangModal] = useState(false);

  const locHeroTithi = getLocalizedTithi(panchang.tithi.number || 13, language);
  const locHeroPaksha = getLocalizedPakshaName(panchang.tithi.paksha === 'KRISHNA' ? 'KRISHNA' : 'SHUKLA', language);
  const showHindiScript = language === 'hi' || language === 'hinglish';

  const toggleSection = (key: SectionKey) => {
    setActiveSection(prev => (prev === key ? key : key));
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

        {/* 2. Popular Features Section Header */}
        <View style={styles.popularHeaderRow}>
          <Text style={styles.popularHeaderTitle}>⭐ {t('popularFeatures')}</Text>
          <Text style={styles.popularHeaderSub}>Choose a feature below</Text>
        </View>

        {/* 3. Vertical Section Cards Container */}
        <View style={styles.verticalListContainer}>
          
          {/* Section 1: Panchangam (5 Sacred Limbs) - OPEN BY DEFAULT */}
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
                <SunMoonWidget sunMoon={panchang.sunMoon} />
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

          {/* Section 4: Planetary & Kundali Chart */}
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
                    North & South Indian Gochar Transit Charts
                  </Text>
                </View>
              </View>
              <Text style={styles.expandArrow}>{activeSection === 'PLANETS' ? '▼' : '▶'}</Text>
            </TouchableOpacity>

            {activeSection === 'PLANETS' && (
              <View style={styles.featureBody}>
                <GocharKundaliCard panchang={panchang} />
              </View>
            )}
          </View>

          {/* Section 5 (Future Expansion): Birth Chart Generator */}
          <View style={styles.featureCardContainer}>
            <TouchableOpacity
              style={styles.featureHeaderDisabled}
              activeOpacity={0.9}
            >
              <View style={styles.featureHeaderLeft}>
                <Text style={styles.featureIcon}>🔮</Text>
                <View>
                  <View style={styles.titleRow}>
                    <Text style={styles.featureTitleMuted}>Birth Chart Generator (Kundali)</Text>
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>{t('comingSoon')}</Text>
                    </View>
                  </View>
                  <Text style={styles.featureSubMuted}>
                    Generate Janam Patrika, Lagna chart & Dasha predictions
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Section 6 (Future Expansion): Western Astrology */}
          <View style={styles.featureCardContainer}>
            <TouchableOpacity
              style={styles.featureHeaderDisabled}
              activeOpacity={0.9}
            >
              <View style={styles.featureHeaderLeft}>
                <Text style={styles.featureIcon}>🌌</Text>
                <View>
                  <View style={styles.titleRow}>
                    <Text style={styles.featureTitleMuted}>Western Astrology & Natal Chart</Text>
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>{t('comingSoon')}</Text>
                    </View>
                  </View>
                  <Text style={styles.featureSubMuted}>
                    Tropical zodiac placements, house cusps & synastry
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Section 7 (Future Expansion): Lal Kitab Astro */}
          <View style={styles.featureCardContainer}>
            <TouchableOpacity
              style={styles.featureHeaderDisabled}
              activeOpacity={0.9}
            >
              <View style={styles.featureHeaderLeft}>
                <Text style={styles.featureIcon}>📜</Text>
                <View>
                  <View style={styles.titleRow}>
                    <Text style={styles.featureTitleMuted}>Lal Kitab Remedies & Predictions</Text>
                    <View style={styles.comingSoonBadge}>
                      <Text style={styles.comingSoonText}>{t('comingSoon')}</Text>
                    </View>
                  </View>
                  <Text style={styles.featureSubMuted}>
                    Unique planetary remedies, totke & Varshphal charts
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        visible={showLangModal}
        onClose={() => setShowLangModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBg,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: Colors.maroon,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 14,
    elevation: 4,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroTithiName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  heroPakshaText: {
    fontSize: 12,
    color: '#FFE0B2',
    marginTop: 2,
    fontWeight: '500',
  },
  heroActiveTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 14,
    padding: 12,
  },
  astroItem: {
    alignItems: 'center',
  },
  astroIcon: {
    fontSize: 18,
  },
  astroLabel: {
    fontSize: 10,
    color: '#FFE0B2',
    marginTop: 2,
    fontWeight: '600',
  },
  astroVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    color: Colors.maroon,
  },
  popularHeaderSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // Vertical List Styles
  verticalListContainer: {
    marginHorizontal: 16,
  },
  featureCardContainer: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBg,
    elevation: 2,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FAF5EE',
  },
  featureHeaderActive: {
    backgroundColor: Colors.maroon,
  },
  featureHeaderDisabled: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#F7F7F7',
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
    color: Colors.textPrimary,
  },
  featureTitleActive: {
    color: '#FFD700',
  },
  featureTitleMuted: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  featureSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  featureSubActive: {
    color: '#FFE0B2',
  },
  featureSubMuted: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  expandArrow: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginLeft: 8,
  },
  comingSoonBadge: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFB74D',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  comingSoonText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#E65100',
  },
  featureBody: {
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: Colors.creamBg,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 4,
  },
});
