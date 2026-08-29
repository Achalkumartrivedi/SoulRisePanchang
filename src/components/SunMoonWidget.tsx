import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { SunMoonTiming } from '../types/panchang';
import { NorthIndianTriangleChart } from './NorthIndianTriangleChart';

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

const GOCHAR_HOUSES = [
  { houseNumber: 1, rashiName: 'Leo (Simha)', planets: ['☀️ Sun', '☿ Merc', '☋ Ketu'] },
  { houseNumber: 2, rashiName: 'Virgo (Kanya)', planets: ['♀ Venus'] },
  { houseNumber: 3, rashiName: 'Libra (Tula)', planets: [] },
  { houseNumber: 4, rashiName: 'Scorpio (Vrishchika)', planets: [] },
  { houseNumber: 5, rashiName: 'Sagittarius (Dhanu)', planets: [] },
  { houseNumber: 6, rashiName: 'Capricorn (Makara)', planets: ['🌙 Moon'] },
  { houseNumber: 7, rashiName: 'Aquarius (Kumbha)', planets: ['☊ Rahu'] },
  { houseNumber: 8, rashiName: 'Pisces (Meena)', planets: ['♄ Sat'] },
  { houseNumber: 9, rashiName: 'Aries (Mesha)', planets: [] },
  { houseNumber: 10, rashiName: 'Taurus (Vrishabha)', planets: ['♃ Jup'] },
  { houseNumber: 11, rashiName: 'Gemini (Mithuna)', planets: ['♂️ Mars'] },
  { houseNumber: 12, rashiName: 'Cancer (Karka)', planets: [] }
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

      {/* Authentic North Indian Triangle Chart vs South Indian Fixed Grid */}
      {chartStyle === 'NORTH' ? (
        <NorthIndianTriangleChart houses={GOCHAR_HOUSES} size={290} />
      ) : (
        <View style={styles.southFixedGrid}>
          {GOCHAR_HOUSES.map(h => (
            <View key={h.houseNumber} style={styles.southHouseBox}>
              <Text style={styles.southHouseNumText}>Rashi {h.houseNumber}</Text>
              <Text style={styles.rashiText} numberOfLines={1}>{h.rashiName.split(' ')[0]}</Text>
              <Text style={styles.planetsText} numberOfLines={2}>
                {h.planets.length > 0 ? h.planets.join(', ') : '—'}
              </Text>
            </View>
          ))}
        </View>
      )}

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
    borderRadius: 10,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: Colors.maroon,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  southFixedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 6,
    marginVertical: 10,
  },
  southHouseBox: {
    width: '31%',
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
    borderColor: '#90CAF9',
    minHeight: 58,
  },
  southHouseNumText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  rashiText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  planetsText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 10,
  },
  grahaGrid: {
    gap: 8,
  },
  grahaItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  grahaIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  grahaInfo: {
    flex: 1,
  },
  grahaName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  grahaRashi: {
    fontSize: 11,
    color: Colors.maroon,
    fontWeight: '600',
    marginTop: 1,
  },
  grahaNakshatra: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
});
