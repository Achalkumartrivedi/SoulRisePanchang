import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { SunMoonTiming } from '../types/panchang';

interface SunMoonWidgetProps {
  sunMoon: SunMoonTiming;
}

const GRAHAS_DETAIL = [
  { name: "Surya (Sun)", symbol: "☀️", rashi: "Leo (Simha)", deg: "07° 42'", nakshatra: "Magha (Pada 3)" },
  { name: "Chandra (Moon)", symbol: "🌙", rashi: "Capricorn (Makara)", deg: "14° 18'", nakshatra: "Shravana (Pada 2)" },
  { name: "Mangala (Mars)", symbol: "♂️", rashi: "Gemini (Mithuna)", deg: "21° 05'", nakshatra: "Punarvasu (Pada 1)" },
  { name: "Budha (Mercury)", symbol: "☿", rashi: "Leo (Simha)", deg: "12° 30'", nakshatra: "Purva Phalguni (Pada 1)" },
  { name: "Brihaspati (Jupiter)", symbol: "♃", rashi: "Taurus (Vrishabha)", deg: "09° 45'", nakshatra: "Krittika (Pada 4)" },
  { name: "Shukra (Venus)", symbol: "♀", rashi: "Virgo (Kanya)", deg: "18° 12'", nakshatra: "Hasta (Pada 3)" },
  { name: "Shani (Saturn)", symbol: "♄", rashi: "Pisces (Meena)", deg: "24° 50'", nakshatra: "Revati (Pada 3)" },
  { name: "Rahu", symbol: "☊", rashi: "Aquarius (Kumbha)", deg: "05° 15'", nakshatra: "Dhanishta (Pada 4)" },
  { name: "Ketu", symbol: "☋", rashi: "Leo (Simha)", deg: "05° 15'", nakshatra: "Magha (Pada 2)" }
];

export const SunMoonWidget: React.FC<SunMoonWidgetProps> = ({ sunMoon }) => {
  const [chartStyle, setChartStyle] = useState<'NORTH' | 'SOUTH'>('NORTH');

  return (
    <View style={styles.card}>
      {/* Kundali Chart Header & Style Switcher */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>🔮 Lagna Kundali Chart</Text>

        <View style={styles.toggleBar}>
          <TouchableOpacity
            style={[styles.toggleBtn, chartStyle === 'NORTH' && styles.toggleBtnActive]}
            onPress={() => setChartStyle('NORTH')}
          >
            <Text style={[styles.toggleText, chartStyle === 'NORTH' && styles.toggleTextActive]}>🏛️ North</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, chartStyle === 'SOUTH' && styles.toggleBtnActive]}
            onPress={() => setChartStyle('SOUTH')}
          >
            <Text style={[styles.toggleText, chartStyle === 'SOUTH' && styles.toggleTextActive]}>☸️ South</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Kundali Box Display */}
      <View style={styles.kundaliCardBox}>
        <Text style={styles.chartTitleText}>
          {chartStyle === 'NORTH' ? 'North Indian Diamond Chart' : 'South Indian Fixed Rashi Chart'}
        </Text>
        <Text style={styles.chartSubText}>Lagna (Ascendant): Leo (Simha) • 1st House</Text>
      </View>

      <View style={styles.divider} />

      {/* Graha Degrees & Nakshatras */}
      <Text style={styles.sectionSubtitle}>🪐 Navagraha Degrees & Nakshatras</Text>
      <View style={styles.grahaGrid}>
        {GRAHAS_DETAIL.map((g, index) => (
          <View key={index} style={styles.grahaItemCard}>
            <Text style={styles.grahaIcon}>{g.symbol}</Text>
            <View style={styles.grahaInfo}>
              <Text style={styles.grahaName}>{g.name}</Text>
              <Text style={styles.grahaRashi}>{g.rashi} • {g.deg}</Text>
              <Text style={styles.grahaNakshatra}>⭐ Nakshatra: {g.nakshatra}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  toggleBar: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: Colors.maroon,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  kundaliCardBox: {
    backgroundColor: Colors.creamBg,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  chartTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  chartSubText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 14,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 10,
  },
  grahaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  grahaItemCard: {
    width: '48%',
    backgroundColor: Colors.creamBg,
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  grahaIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  grahaInfo: {
    flex: 1,
  },
  grahaName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  grahaRashi: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginTop: 1,
  },
  grahaNakshatra: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 2,
    fontWeight: '600',
  },
});
