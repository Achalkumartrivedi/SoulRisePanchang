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

type SubTab = 'LIMBS' | 'MUHURAT' | 'CHOGHADIYA' | 'PLANETS';

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
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('LIMBS');
  const [showLangModal, setShowLangModal] = useState(false);

  const locHeroTithi = getLocalizedTithi(panchang.tithi.number || 13, language);
  const locHeroPaksha = getLocalizedPakshaName(panchang.tithi.paksha === 'KRISHNA' ? 'KRISHNA' : 'SHUKLA', language);
  const showHindiScript = language === 'hi' || language === 'hinglish';

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
        {/* Hero Celestial Banner */}
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

        {/* Sub-Tabs Navigation */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subTabScroll} contentContainerStyle={styles.subTabContent}>
          <TouchableOpacity
            style={[styles.subTabItem, activeSubTab === 'LIMBS' && styles.subTabItemActive]}
            onPress={() => setActiveSubTab('LIMBS')}
          >
            <Text style={styles.subTabIcon}>🪔</Text>
            <Text style={[styles.subTabText, activeSubTab === 'LIMBS' && styles.subTabTextActive]} numberOfLines={1}>{t('limbsTab')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabItem, activeSubTab === 'MUHURAT' && styles.subTabItemActive]}
            onPress={() => setActiveSubTab('MUHURAT')}
          >
            <Text style={styles.subTabIcon}>✨</Text>
            <Text style={[styles.subTabText, activeSubTab === 'MUHURAT' && styles.subTabTextActive]} numberOfLines={1}>{t('muhuratTab')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabItem, activeSubTab === 'CHOGHADIYA' && styles.subTabItemActive]}
            onPress={() => setActiveSubTab('CHOGHADIYA')}
          >
            <Text style={styles.subTabIcon}>⏱️</Text>
            <Text style={[styles.subTabText, activeSubTab === 'CHOGHADIYA' && styles.subTabTextActive]} numberOfLines={1}>{t('choghadiyaTab')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabItem, activeSubTab === 'PLANETS' && styles.subTabItemActive]}
            onPress={() => setActiveSubTab('PLANETS')}
          >
            <Text style={styles.subTabIcon}>🪐</Text>
            <Text style={[styles.subTabText, activeSubTab === 'PLANETS' && styles.subTabTextActive]} numberOfLines={1}>{t('planetsTab')}</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Sub-Tab Views */}
        {activeSubTab === 'LIMBS' && (
          <View>
            <Text style={styles.sectionHeaderTitle} numberOfLines={2} adjustsFontSizeToFit>🪔 {t('panchangamHeader')} - {selectedCity.name}</Text>
            <PanchangLimbCard panchang={panchang} />
            <SunMoonWidget sunMoon={panchang.sunMoon} />
          </View>
        )}

        {activeSubTab === 'MUHURAT' && (
          <View>
            <Text style={styles.sectionHeaderTitle}>✨ {t('muhuratHeader')} - {selectedCity.name}</Text>
            <MuhuratCard auspicious={panchang.auspiciousMuhurats} inauspicious={panchang.inauspiciousMuhurats} />
          </View>
        )}

        {activeSubTab === 'CHOGHADIYA' && (
          <View>
            <ChoghadiyaGrid dayChoghadiya={panchang.dayChoghadiya} nightChoghadiya={panchang.nightChoghadiya} />
          </View>
        )}

        {activeSubTab === 'PLANETS' && (
          <View>
            <GocharKundaliCard panchang={panchang} />
          </View>
        )}
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
    paddingBottom: 30,
  },
  heroCard: {
    backgroundColor: Colors.maroon,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
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
  subTabScroll: {
    marginVertical: 10,
  },
  subTabContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  subTabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subTabItemActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  subTabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  subTabText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  subTabTextActive: {
    color: '#FFFFFF',
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
  },
});
