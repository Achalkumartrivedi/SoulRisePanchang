import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Rect, Line, Polygon, Text as SvgText, G } from 'react-native-svg';
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

// Fixed South Indian Zodiac Map
const SOUTH_ZODIAC_GRID: { signIndex: number; abbrev: string; name: string; col: number; row: number; x: number; y: number }[] = [
  { signIndex: 12, abbrev: 'Pi', name: 'Meena', col: 0, row: 0, x: 10, y: 10 },
  { signIndex: 1, abbrev: 'Ar', name: 'Mesha', col: 1, row: 0, x: 80, y: 10 },
  { signIndex: 2, abbrev: 'Ta', name: 'Vrishabha', col: 2, row: 0, x: 150, y: 10 },
  { signIndex: 3, abbrev: 'Ge', name: 'Mithuna', col: 3, row: 0, x: 220, y: 10 },
  { signIndex: 4, abbrev: 'Cn', name: 'Karka', col: 3, row: 1, x: 220, y: 80 },
  { signIndex: 5, abbrev: 'Le', name: 'Simha', col: 3, row: 2, x: 220, y: 150 },
  { signIndex: 6, abbrev: 'Vi', name: 'Kanya', col: 3, row: 3, x: 220, y: 220 },
  { signIndex: 7, abbrev: 'Li', name: 'Tula', col: 2, row: 3, x: 150, y: 220 },
  { signIndex: 8, abbrev: 'Sc', name: 'Vrischika', col: 1, row: 3, x: 80, y: 220 },
  { signIndex: 9, abbrev: 'Sg', name: 'Dhanu', col: 0, row: 3, x: 10, y: 220 },
  { signIndex: 10, abbrev: 'Cp', name: 'Makara', col: 0, row: 2, x: 10, y: 150 },
  { signIndex: 11, abbrev: 'Aq', name: 'Kumbha', col: 0, row: 1, x: 10, y: 80 },
];

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

  // Get sign number for House 1..12 in North Indian chart
  const getSignForHouse = (houseNum: number): number => {
    return ((lagnaSign - 1 + houseNum - 1) % 12) + 1;
  };

  // Get planets inside a given zodiac sign index (1-12)
  const getPlanetsInSign = (signIdx: number): string[] => {
    return PLANET_POSITIONS.filter(p => p.signIndex === signIdx).map(p => p.symbol);
  };

  // Get planets inside a house (1-12) for North Chart
  const getPlanetsInHouse = (houseNum: number): string[] => {
    const signIdx = getSignForHouse(houseNum);
    return getPlanetsInSign(signIdx);
  };

  // House Label Positions for North Indian Diamond Chart SVG (300x300 canvas)
  const NORTH_HOUSE_POSITIONS: { houseNum: number; x: number; y: number; px: number; py: number }[] = [
    { houseNum: 1, x: 150, y: 55, px: 150, py: 78 },   // H1 (Top Center Diamond - Lagna)
    { houseNum: 2, x: 80, y: 35, px: 80, py: 55 },     // H2 (Upper Left)
    { houseNum: 3, x: 35, y: 80, px: 35, py: 100 },    // H3 (Left Upper)
    { houseNum: 4, x: 75, y: 150, px: 75, py: 170 },   // H4 (Left Center Diamond)
    { houseNum: 5, x: 35, y: 220, px: 35, py: 240 },   // H5 (Left Lower)
    { houseNum: 6, x: 80, y: 265, px: 80, py: 280 },   // H6 (Lower Left)
    { houseNum: 7, x: 150, y: 235, px: 150, py: 255 }, // H7 (Bottom Center Diamond)
    { houseNum: 8, x: 220, y: 265, px: 220, py: 280 }, // H8 (Lower Right)
    { houseNum: 9, x: 265, y: 220, px: 265, py: 240 }, // H9 (Right Lower)
    { houseNum: 10, x: 225, y: 150, px: 225, py: 170 },// H10 (Right Center Diamond)
    { houseNum: 11, x: 265, y: 80, px: 265, py: 100 }, // H11 (Right Upper)
    { houseNum: 12, x: 220, y: 35, px: 220, py: 55 },  // H12 (Upper Right)
  ];

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
      <View style={styles.chartWrapper}>
        {chartStyle === 'NORTH' ? (
          /* North Indian Diamond Chart (Exact Match to @image1) */
          <Svg width={300} height={300} viewBox="0 0 300 300" style={styles.svgChart}>
            {/* Background Parchment Box */}
            <Rect x={10} y={10} width={280} height={280} fill="#FAF5EC" stroke="#D4A359" strokeWidth={3} rx={4} />

            {/* Inner Gold Ornamental Border Lines */}
            <Rect x={14} y={14} width={272} height={272} fill="none" stroke="#C49347" strokeWidth={1} />

            {/* Main Diagonal Lines */}
            <Line x1={10} y1={10} x2={290} y2={290} stroke="#5D3A00" strokeWidth={1.5} />
            <Line x1={290} y1={10} x2={10} y2={290} stroke="#5D3A00" strokeWidth={1.5} />

            {/* Midpoint Diamond Polygon */}
            <Polygon points="150,10 290,150 150,290 10,150" fill="none" stroke="#5D3A00" strokeWidth={1.8} />

            {/* Houses 1 to 12 Labels & Planets */}
            {NORTH_HOUSE_POSITIONS.map((hp) => {
              const signIdx = getSignForHouse(hp.houseNum);
              const planets = getPlanetsInHouse(hp.houseNum);

              return (
                <G key={hp.houseNum}>
                  {/* Sign Number */}
                  <SvgText
                    x={hp.x}
                    y={hp.y}
                    fontSize={15}
                    fontWeight="bold"
                    fill={hp.houseNum === 1 ? '#800000' : '#5D3A00'}
                    textAnchor="middle"
                  >
                    {signIdx}
                  </SvgText>

                  {/* "Lagna" Subtitle under House 1 */}
                  {hp.houseNum === 1 && (
                    <SvgText
                      x={hp.x}
                      y={hp.y + 16}
                      fontSize={13}
                      fontWeight="bold"
                      fill="#800000"
                      textAnchor="middle"
                    >
                      Lagna
                    </SvgText>
                  )}

                  {/* Planets inside House */}
                  {planets.length > 0 && (
                    <SvgText
                      x={hp.px}
                      y={hp.houseNum === 1 ? hp.py + 10 : hp.py}
                      fontSize={11}
                      fontWeight="900"
                      fill={hp.houseNum === 1 ? '#D84315' : '#1B5E20'}
                      textAnchor="middle"
                    >
                      {planets.join(' ')}
                    </SvgText>
                  )}
                </G>
              );
            })}
          </Svg>
        ) : (
          /* South Indian Grid Chart (Exact Match to @image2) */
          <Svg width={300} height={300} viewBox="0 0 300 300" style={styles.svgChart}>
            {/* Background Parchment Box */}
            <Rect x={10} y={10} width={280} height={280} fill="#FAF5EC" stroke="#D4A359" strokeWidth={3} rx={4} />

            {/* Grid Dividers (4x4 Perimeter Grid) */}
            <Line x1={80} y1={10} x2={80} y2={290} stroke="#5D3A00" strokeWidth={1.5} />
            <Line x1={150} y1={10} x2={150} y2={290} stroke="#5D3A00" strokeWidth={1.5} />
            <Line x1={220} y1={10} x2={220} y2={290} stroke="#5D3A00" strokeWidth={1.5} />

            <Line x1={10} y1={80} x2={290} y2={80} stroke="#5D3A00" strokeWidth={1.5} />
            <Line x1={10} y1={150} x2={290} y2={150} stroke="#5D3A00" strokeWidth={1.5} />
            <Line x1={10} y1={220} x2={290} y2={220} stroke="#5D3A00" strokeWidth={1.5} />

            {/* Center Merged Box */}
            <Rect x={80} y={80} width={140} height={140} fill="#F4EADB" stroke="#5D3A00" strokeWidth={1.5} />
            <SvgText x={150} y={145} fontSize={14} fontWeight="bold" fill="#800000" textAnchor="middle">GOCHAR</SvgText>
            <SvgText x={150} y={165} fontSize={11} fontWeight="bold" fill="#C49347" textAnchor="middle">KUNDALI</SvgText>

            {/* Render 12 Fixed Sign Cells */}
            {SOUTH_ZODIAC_GRID.map((cell) => {
              const isLagna = cell.signIndex === lagnaSign;
              const planets = getPlanetsInSign(cell.signIndex);

              return (
                <G key={cell.signIndex}>
                  {/* Sign Abbreviation (Ar, Ta, Ge, Cn, Le, Vi, Li, Sc, Sg, Cp, Aq, Pi) */}
                  <SvgText
                    x={cell.x + 35}
                    y={cell.y + 32}
                    fontSize={17}
                    fontWeight="bold"
                    fill={isLagna ? '#800000' : '#5D3A00'}
                    textAnchor="middle"
                  >
                    {cell.abbrev}
                  </SvgText>

                  {/* Double Slash '//' for Lagna Sign Corner (as in @image2) */}
                  {isLagna && (
                    <G>
                      <Line x1={cell.x + 52} y1={cell.y + 12} x2={cell.x + 64} y2={cell.y + 24} stroke="#800000" strokeWidth={2} />
                      <Line x1={cell.x + 57} y1={cell.y + 12} x2={cell.x + 69} y2={cell.y + 24} stroke="#800000" strokeWidth={2} />
                    </G>
                  )}

                  {/* Planets inside Sign Cell */}
                  {planets.length > 0 && (
                    <SvgText
                      x={cell.x + 35}
                      y={cell.y + 54}
                      fontSize={11}
                      fontWeight="900"
                      fill={isLagna ? '#D84315' : '#1B5E20'}
                      textAnchor="middle"
                    >
                      {planets.join(' ')}
                    </SvgText>
                  )}
                </G>
              );
            })}
          </Svg>
        )}
      </View>

      {/* Planetary Legend */}
      <View style={styles.legendBox}>
        <Text style={styles.legendTitle}>🪐 Planetary Symbols Key (ग्रह संकेत):</Text>
        <Text style={styles.legendText}>
          <Text style={{ fontWeight: 'bold' }}>Su</Text>: Sun • <Text style={{ fontWeight: 'bold' }}>Mo</Text>: Moon • <Text style={{ fontWeight: 'bold' }}>Ma</Text>: Mars • <Text style={{ fontWeight: 'bold' }}>Me</Text>: Mercury • <Text style={{ fontWeight: 'bold' }}>Ju</Text>: Jupiter • <Text style={{ fontWeight: 'bold' }}>Ve</Text>: Venus • <Text style={{ fontWeight: 'bold' }}>Sa</Text>: Saturn • <Text style={{ fontWeight: 'bold' }}>Ra</Text>: Rahu • <Text style={{ fontWeight: 'bold' }}>Ke</Text>: Ketu
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
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  svgChart: {
    borderRadius: 14,
    elevation: 2,
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
    justify.content: 'space-between',
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
