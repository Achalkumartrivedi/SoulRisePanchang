import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { PanchangDayData, DailyLagnaItem } from '../types/panchang';

interface GocharKundaliCardProps {
  panchang: PanchangDayData;
}

// 9 Planets & their current transit signs for Aug 2026
// Sign Index 1 to 12: 1=Mesha, 2=Vrishabha, 3=Mithuna, 4=Karka, 5=Simha, 6=Kanya, 7=Tula, 8=Vrischika, 9=Dhanu, 10=Makara, 11=Kumbha, 12=Meena
const PLANET_POSITIONS: { symbol: string; name: string; hindiName: string; signIndex: number }[] = [
  { symbol: 'Su', name: 'Sun', hindiName: 'सूर्य', signIndex: 5 },      // Simha (Leo)
  { symbol: 'Mo', name: 'Moon', hindiName: 'चंद्र', signIndex: 10 },    // Makara (Capricorn)
  { symbol: 'Ma', name: 'Mars', hindiName: 'मंगल', signIndex: 3 },     // Mithuna (Gemini)
  { symbol: 'Me', name: 'Mercury', hindiName: 'बुध', signIndex: 4 },   // Karka (Cancer)
  { symbol: 'Ju', name: 'Jupiter', hindiName: 'गुरु', signIndex: 3 },   // Mithuna (Gemini)
  { symbol: 'Ve', name: 'Venus', hindiName: 'शुक्र', signIndex: 6 },   // Kanya (Virgo)
  { symbol: 'Sa', name: 'Saturn', hindiName: 'शनि', signIndex: 12 },   // Meena (Pisces)
  { symbol: 'Ra', name: 'Rahu', hindiName: 'राहु', signIndex: 11 },    // Kumbha (Aquarius)
  { symbol: 'Ke', name: 'Ketu', hindiName: 'केतु', signIndex: 5 },     // Simha (Leo)
];

const SIGN_NAMES: Record<number, { name: string; hindiName: string }> = {
  1: { name: 'Mesha', hindiName: 'मेष' },
  2: { name: 'Vrishabha', hindiName: 'वृषभ' },
  3: { name: 'Mithuna', hindiName: 'मिथुन' },
  4: { name: 'Karka', hindiName: 'कर्क' },
  5: { name: 'Simha', hindiName: 'सिंह' },
  6: { name: 'Kanya', hindiName: 'कन्या' },
  7: { name: 'Tula', hindiName: 'तुला' },
  8: { name: 'Vrischika', hindiName: 'वृश्चिक' },
  9: { name: 'Dhanu', hindiName: 'धनु' },
  10: { name: 'Makara', hindiName: 'मकर' },
  11: { name: 'Kumbha', hindiName: 'कुम्भ' },
  12: { name: 'Meena', hindiName: 'मीन' },
};

export const GocharKundaliCard: React.FC<GocharKundaliCardProps> = ({ panchang }) => {
  const [chartStyle, setChartStyle] = useState<'NORTH' | 'SOUTH'>('NORTH');

  const lagnaInfo = panchang.lagnaInfo || {
    currentLagnaSign: 5,
    name: 'Simha (Leo)',
    hindiName: 'सिंह',
    startTime: '06:15 AM',
    endTime: '08:20 AM',
    allLagnas: []
  };

  const lagnaSign = lagnaInfo.currentLagnaSign;

  // Given house number 1 to 12 in North Indian chart, get zodiac sign index (1-12)
  const getSignForHouse = (houseNum: number): number => {
    return ((lagnaSign - 1 + houseNum - 1) % 12) + 1;
  };

  // Get planets inside a given zodiac sign index (1-12)
  const getPlanetsInSign = (signIdx: number): string[] => {
    return PLANET_POSITIONS.filter(p => p.signIndex === signIdx).map(p => p.symbol);
  };

  // Get planets inside a house (1-12)
  const getPlanetsInHouse = (houseNum: number): string[] => {
    const signIdx = getSignForHouse(houseNum);
    return getPlanetsInSign(signIdx);
  };

  return (
    <View style={styles.card}>
      {/* Header Row with North/South Toggle cleanly contained */}
      <View style={styles.headerRow}>
        <View style={styles.titleBox}>
          <Text style={styles.cardTitle}>🪐 Gochar Kundali (गोचर कुण्डली)</Text>
        </View>

        {/* Segmented Control - Fixed container alignment */}
        <View style={styles.chartToggleBar}>
          <TouchableOpacity
            style={[styles.chartToggleBtn, chartStyle === 'NORTH' && styles.chartToggleBtnActive]}
            onPress={() => setChartStyle('NORTH')}
          >
            <Text style={[styles.chartToggleText, chartStyle === 'NORTH' && styles.chartToggleTextActive]}>
              North (उत्तर)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chartToggleBtn, chartStyle === 'SOUTH' && styles.chartToggleBtnActive]}
            onPress={() => setChartStyle('SOUTH')}
          >
            <Text style={[styles.chartToggleText, chartStyle === 'SOUTH' && styles.chartToggleTextActive]}>
              South (दक्षिण)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Ascendant (Lagna) Header Banner */}
      <View style={styles.lagnaBanner}>
        <View style={styles.lagnaLeft}>
          <Text style={styles.lagnaIcon}>🌅</Text>
          <View>
            <Text style={styles.lagnaTitleText}>Current Ascendant (लग्न): {lagnaInfo.name} ({lagnaInfo.hindiName})</Text>
            <Text style={styles.lagnaTimeSub}>Rising Window: {lagnaInfo.startTime} - {lagnaInfo.endTime}</Text>
          </View>
        </View>
        <View style={styles.activeLagnaBadge}>
          <Text style={styles.activeLagnaBadgeText}>1st House (Lagna)</Text>
        </View>
      </View>

      {/* Chart Visualization */}
      {chartStyle === 'NORTH' ? (
        /* North Indian Diamond Chart Grid */
        <View style={styles.northChartContainer}>
          {/* Top Row: H12, H1 (Lagna), H2 */}
          <View style={styles.chartRow}>
            <View style={styles.houseBox}>
              <Text style={styles.signNum}>{getSignForHouse(12)}</Text>
              <Text style={styles.houseLabel}>H12</Text>
              <Text style={styles.planetText}>{getPlanetsInHouse(12).join(' ')}</Text>
            </View>
            <View style={[styles.houseBox, styles.lagnaHouseBox]}>
              <Text style={styles.lagnaTag}>Lag</Text>
              <Text style={[styles.signNum, { color: Colors.maroon }]}>{getSignForHouse(1)}</Text>
              <Text style={[styles.houseLabel, { color: Colors.maroon }]}>H1 (Lagna)</Text>
              <Text style={styles.planetTextBold}>{getPlanetsInHouse(1).join(' ') || '-'}</Text>
            </View>
            <View style={styles.houseBox}>
              <Text style={styles.signNum}>{getSignForHouse(2)}</Text>
              <Text style={styles.houseLabel}>H2</Text>
              <Text style={styles.planetText}>{getPlanetsInHouse(2).join(' ')}</Text>
            </View>
          </View>

          {/* Middle Row: H11, Center, H3 */}
          <View style={styles.chartRow}>
            <View style={styles.houseBox}>
              <Text style={styles.signNum}>{getSignForHouse(11)}</Text>
              <Text style={styles.houseLabel}>H11</Text>
              <Text style={styles.planetText}>{getPlanetsInHouse(11).join(' ')}</Text>
            </View>
            <View style={styles.centerChartBox}>
              <Text style={styles.centerOm}>🕉️</Text>
              <Text style={styles.centerTitle}>GOCHAR</Text>
              <Text style={styles.centerSub}>{panchang.tithi.name}</Text>
            </View>
            <View style={styles.houseBox}>
              <Text style={styles.signNum}>{getSignForHouse(3)}</Text>
              <Text style={styles.houseLabel}>H3</Text>
              <Text style={styles.planetText}>{getPlanetsInHouse(3).join(' ')}</Text>
            </View>
          </View>

          {/* Row 3: H10, H4, H5 */}
          <View style={styles.chartRow}>
            <View style={styles.houseBox}>
              <Text style={styles.signNum}>{getSignForHouse(10)}</Text>
              <Text style={styles.houseLabel}>H10</Text>
              <Text style={styles.planetText}>{getPlanetsInHouse(10).join(' ')}</Text>
            </View>
            <View style={styles.houseBox}>
              <Text style={styles.signNum}>{getSignForHouse(4)}</Text>
              <Text style={styles.houseLabel}>H4</Text>
              <Text style={styles.planetText}>{getPlanetsInHouse(4).join(' ')}</Text>
            </View>
            <View style={styles.houseBox}>
              <Text style={styles.signNum}>{getSignForHouse(5)}</Text>
              <Text style={styles.houseLabel}>H5</Text>
              <Text style={styles.planetText}>{getPlanetsInHouse(5).join(' ')}</Text>
            </View>
          </View>

          {/* Bottom Row: H9, H8, H7, H6 */}
          <View style={styles.chartRow}>
            <View style={styles.houseBox}>
              <Text style={styles.signNum}>{getSignForHouse(9)}</Text>
              <Text style={styles.houseLabel}>H9</Text>
              <Text style={styles.planetText}>{getPlanetsInHouse(9).join(' ')}</Text>
            </View>
            <View style={styles.houseBox}>
              <Text style={styles.signNum}>{getSignForHouse(8)}</Text>
              <Text style={styles.houseLabel}>H8</Text>
              <Text style={styles.planetText}>{getPlanetsInHouse(8).join(' ')}</Text>
            </View>
            <View style={styles.houseBox}>
              <Text style={styles.signNum}>{getSignForHouse(7)}</Text>
              <Text style={styles.houseLabel}>H7</Text>
              <Text style={styles.planetText}>{getPlanetsInHouse(7).join(' ')}</Text>
            </View>
            <View style={styles.houseBox}>
              <Text style={styles.signNum}>{getSignForHouse(6)}</Text>
              <Text style={styles.houseLabel}>H6</Text>
              <Text style={styles.planetText}>{getPlanetsInHouse(6).join(' ')}</Text>
            </View>
          </View>
        </View>
      ) : (
        /* South Indian Grid Chart */
        <View style={styles.southChartContainer}>
          {[12, 1, 2, 3, 11, 4, 10, 5, 9, 8, 7, 6].map((signIdx) => {
            const isLagna = signIdx === lagnaSign;
            const planets = getPlanetsInSign(signIdx);
            const meta = SIGN_NAMES[signIdx];

            return (
              <View key={signIdx} style={[styles.southCell, isLagna && styles.southLagnaCell]}>
                <View style={styles.southCellHeader}>
                  <Text style={[styles.southSignName, isLagna && { color: Colors.maroon }]}>
                    {meta.hindiName} ({signIdx})
                  </Text>
                  {isLagna && <Text style={styles.southLagnaBadge}>Lagna</Text>}
                </View>
                <Text style={styles.southPlanetsText}>{planets.join('  ') || '-'}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Planetary Legend */}
      <View style={styles.legendBox}>
        <Text style={styles.legendTitle}>🪐 Planetary Symbols Key (ग्रह संकेत):</Text>
        <Text style={styles.legendText}>
          <Text style={{ fontWeight: 'bold' }}>Su</Text>: Sun (सूर्य) • <Text style={{ fontWeight: 'bold' }}>Mo</Text>: Moon (चंद्र) • <Text style={{ fontWeight: 'bold' }}>Ma</Text>: Mars (मंगल) • <Text style={{ fontWeight: 'bold' }}>Me</Text>: Mercury (बुध) • <Text style={{ fontWeight: 'bold' }}>Ju</Text>: Jupiter (गुरु) • <Text style={{ fontWeight: 'bold' }}>Ve</Text>: Venus (शुक्र) • <Text style={{ fontWeight: 'bold' }}>Sa</Text>: Saturn (शनि) • <Text style={{ fontWeight: 'bold' }}>Ra</Text>: Rahu (राहु) • <Text style={{ fontWeight: 'bold' }}>Ke</Text>: Ketu (केतु)
        </Text>
      </View>

      {/* Daily 12 Ascendants Rising Timings Table */}
      <View style={styles.lagnaTableBox}>
        <Text style={styles.lagnaTableTitle}>⏰ Today's 12 Ascendant (Lagna) Rising Timings</Text>
        <Text style={styles.lagnaTableSub}>Ascendant changes approx every ~2 hours based on Earth's rotation</Text>

        <View style={styles.lagnaList}>
          {lagnaInfo.allLagnas.map((item, index) => (
            <View
              key={index}
              style={[
                styles.lagnaRow,
                item.isActive && styles.lagnaRowActive
              ]}
            >
              <View style={styles.lagnaRowLeft}>
                <Text style={[styles.lagnaSignBadge, item.isActive && styles.lagnaSignBadgeActive]}>
                  {item.signIndex}
                </Text>
                <View>
                  <Text style={[styles.lagnaRowName, item.isActive && styles.lagnaRowNameActive]}>
                    {item.name} ({item.hindiName})
                  </Text>
                  <Text style={styles.lagnaRowTime}>{item.startTime} - {item.endTime}</Text>
                </View>
              </View>

              {item.isActive ? (
                <View style={styles.runningTag}>
                  <Text style={styles.runningTagText}>⚡ RISING NOW</Text>
                </View>
              ) : (
                <Text style={styles.upcomingText}>Scheduled</Text>
              )}
            </View>
          ))}
        </View>
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
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  titleBox: {
    flexShrink: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  chartToggleBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  chartToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9,
  },
  chartToggleBtnActive: {
    backgroundColor: Colors.maroon,
  },
  chartToggleText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  chartToggleTextActive: {
    color: '#FFFFFF',
  },
  lagnaBanner: {
    backgroundColor: '#FFF3E0',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  lagnaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lagnaIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  lagnaTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  lagnaTimeSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  activeLagnaBadge: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeLagnaBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  northChartContainer: {
    backgroundColor: '#FAF5EE',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0D0B8',
    marginBottom: 14,
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  houseBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 8,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 65,
    justifyContent: 'space-between',
    position: 'relative',
  },
  lagnaHouseBox: {
    backgroundColor: '#FFF8E1',
    borderColor: Colors.accentGold,
    borderWidth: 1.5,
  },
  lagnaTag: {
    position: 'absolute',
    top: 3,
    right: 4,
    fontSize: 8,
    fontWeight: 'bold',
    color: Colors.maroon,
    backgroundColor: '#FFE0B2',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  signNum: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  houseLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  planetText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginTop: 2,
  },
  planetTextBold: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.maroon,
    marginTop: 2,
  },
  centerChartBox: {
    flex: 1,
    backgroundColor: Colors.maroon,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    padding: 6,
  },
  centerOm: {
    fontSize: 18,
    color: Colors.accentGold,
  },
  centerTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.accentGold,
  },
  centerSub: {
    fontSize: 8,
    color: '#FFFFFF',
  },
  southChartContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#FAF5EE',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E0D0B8',
    marginBottom: 14,
  },
  southCell: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 55,
    justifyContent: 'space-between',
  },
  southLagnaCell: {
    backgroundColor: '#FFF8E1',
    borderColor: Colors.accentGold,
    borderWidth: 1.5,
  },
  southCellHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  southSignName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  southLagnaBadge: {
    fontSize: 8,
    fontWeight: 'bold',
    color: Colors.maroon,
    backgroundColor: '#FFE0B2',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  southPlanetsText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginTop: 4,
  },
  legendBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  legendText: {
    fontSize: 10,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  lagnaTableBox: {
    marginTop: 4,
  },
  lagnaTableTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  lagnaTableSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  lagnaList: {
    marginTop: 4,
  },
  lagnaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  lagnaRowActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
    borderWidth: 1.5,
  },
  lagnaRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lagnaSignBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F0F0F0',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: 'bold',
    fontSize: 12,
    color: Colors.textPrimary,
    marginRight: 10,
  },
  lagnaSignBadgeActive: {
    backgroundColor: Colors.auspiciousGreen,
    color: '#FFFFFF',
  },
  lagnaRowName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  lagnaRowNameActive: {
    color: Colors.maroon,
  },
  lagnaRowTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  runningTag: {
    backgroundColor: Colors.auspiciousGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  runningTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  upcomingText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
});
