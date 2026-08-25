import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '../theme/colors';
import { PanchangDayData, CityLocation } from '../types/panchang';
import { Header } from '../components/Header';
import { PanchangLimbCard } from '../components/PanchangLimbCard';
import { SunMoonWidget } from '../components/SunMoonWidget';
import { MuhuratCard } from '../components/MuhuratCard';
import { ChoghadiyaGrid } from '../components/ChoghadiyaGrid';
import { GocharKundaliCard } from '../components/GocharKundaliCard';

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
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('LIMBS');

  return (
    <View style={styles.container}>
      <Header
        currentDateIso={currentDateIso}
        selectedCity={selectedCity}
        samvat={panchang.samvat}
        onOpenCityPicker={onOpenCityPicker}
        onPrevDay={onPrevDay}
        onNextDay={onNextDay}
        onToday={onToday}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Celestial Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.heroTithiName}>{panchang.tithi.name} ({panchang.tithi.hindiName})</Text>
              <Text style={styles.heroPakshaText}>{panchang.tithi.pakshaHindi} • {panchang.samvat.monthNameHindi} • {panchang.samvat.vikramSamvat} विक्रम</Text>
            </View>
            <View style={styles.heroActiveTag}>
              <Text style={styles.heroActiveTagText}>🌕 Active Tithi</Text>
            </View>
          </View>

          {/* Astronomical Timings */}
          <View style={styles.astroGrid}>
            <View style={styles.astroItem}>
              <Text style={styles.astroIcon}>🌅</Text>
              <Text style={styles.astroLabel}>Sunrise</Text>
              <Text style={styles.astroVal}>{panchang.sunMoon.sunrise}</Text>
            </View>
            <View style={styles.astroItem}>
              <Text style={styles.astroIcon}>🌇</Text>
              <Text style={styles.astroLabel}>Sunset</Text>
              <Text style={styles.astroVal}>{panchang.sunMoon.sunset}</Text>
            </View>
            <View style={styles.astroItem}>
              <Text style={styles.astroIcon}>🌙</Text>
              <Text style={styles.astroLabel}>Moonrise</Text>
              <Text style={styles.astroVal}>{panchang.sunMoon.moonrise}</Text>
            </View>
            <View style={styles.astroItem}>
              <Text style={styles.astroIcon}>🌘</Text>
              <Text style={styles.astroLabel}>Moonset</Text>
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
            <Text style={[styles.subTabText, activeSubTab === 'LIMBS' && styles.subTabTextActive]}>Panchangam (5 Limbs)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabItem, activeSubTab === 'MUHURAT' && styles.subTabItemActive]}
            onPress={() => setActiveSubTab('MUHURAT')}
          >
            <Text style={styles.subTabIcon}>✨</Text>
            <Text style={[styles.subTabText, activeSubTab === 'MUHURAT' && styles.subTabTextActive]}>Muhurat & Timings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabItem, activeSubTab === 'CHOGHADIYA' && styles.subTabItemActive]}
            onPress={() => setActiveSubTab('CHOGHADIYA')}
          >
            <Text style={styles.subTabIcon}>⏱️</Text>
            <Text style={[styles.subTabText, activeSubTab === 'CHOGHADIYA' && styles.subTabTextActive]}>Choghadiya</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabItem, activeSubTab === 'PLANETS' && styles.subTabItemActive]}
            onPress={() => setActiveSubTab('PLANETS')}
          >
            <Text style={styles.subTabIcon}>🪐</Text>
            <Text style={[styles.subTabText, activeSubTab === 'PLANETS' && styles.subTabTextActive]}>Planetary & Kundali</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Sub-Tab Dynamic Views */}
        {activeSubTab === 'LIMBS' && <PanchangLimbCard panchang={panchang} />}

        {activeSubTab === 'MUHURAT' && (
          <MuhuratCard
            auspicious={panchang.auspiciousMuhurats}
            inauspicious={panchang.inauspiciousMuhurats}
          />
        )}

        {activeSubTab === 'CHOGHADIYA' && (
          <ChoghadiyaGrid
            dayChoghadiya={panchang.dayChoghadiya}
            nightChoghadiya={panchang.nightChoghadiya}
          />
        )}

        {activeSubTab === 'PLANETS' && (
          <View>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => Alert.alert("Saved", `Kundali snapshot saved for ${currentDateIso}`)}
              >
                <Text style={styles.saveBtnText}>💾 1-Click Save Kundali</Text>
              </TouchableOpacity>
            </View>

            <GocharKundaliCard panchang={panchang} />
            <SunMoonWidget sunMoon={panchang.sunMoon} />
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBg,
  },
  scrollContent: {
    paddingVertical: 12,
  },
  heroCard: {
    backgroundColor: '#2B1810',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.accentGold,
    elevation: 4,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  heroTithiName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.accentGold,
  },
  heroPakshaText: {
    fontSize: 12,
    color: '#FFE0B2',
    marginTop: 2,
    fontWeight: '600',
  },
  heroActiveTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: Colors.accentGold,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  heroActiveTagText: {
    color: Colors.accentGold,
    fontSize: 11,
    fontWeight: 'bold',
  },
  astroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 12,
  },
  astroItem: {
    alignItems: 'center',
    flex: 1,
  },
  astroIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  astroLabel: {
    fontSize: 10,
    color: '#FFE0B2',
    fontWeight: 'bold',
  },
  astroVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  subTabScroll: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  subTabContent: {
    flexDirection: 'row',
    gap: 8,
  },
  subTabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 1,
  },
  subTabItemActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  subTabIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  subTabText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  subTabTextActive: {
    color: '#FFFFFF',
  },
  actionRow: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: Colors.auspiciousGreen,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  bottomSpacer: {
    height: 30,
  },
});
