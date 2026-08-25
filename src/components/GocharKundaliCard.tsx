import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Rect, Line, Polygon, Text as SvgText, G } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { PanchangDayData, DailyLagnaItem } from '../types/panchang';
import { useLanguage } from '../context/LanguageContext';

interface GocharKundaliCardProps {
  panchang: PanchangDayData;
}

export type ReferenceMode = 'LAGNA' | 'MOON' | 'SUN';

export interface PlanetConfig {
  symbol: string;       // 'Su', 'Mo', etc.
  name: string;
  hindiName: string;
  signIndex: number;    // 1-12
  icon: string;         // Visual icon / emoji
  color: string;        // Text & icon color
  desc: string;
}

// 9 Planets with custom visual icons, colors, & Aug 2026 transits
const PLANET_CONFIGS: Record<string, PlanetConfig> = {
  Su: { symbol: 'Su', name: 'Sun', hindiName: 'सूर्य', signIndex: 5, icon: '☀️', color: '#FF5722', desc: 'Orange flare' },
  Mo: { symbol: 'Mo', name: 'Moon', hindiName: 'चंद्र', signIndex: 10, icon: '🌙', color: '#607D8B', desc: 'White/Silver with grey' },
  Ma: { symbol: 'Ma', name: 'Mars', hindiName: 'मंगल', signIndex: 3, icon: '♂️', color: '#D32F2F', desc: 'Red planet' },
  Me: { symbol: 'Me', name: 'Mercury', hindiName: 'बुध', signIndex: 4, icon: '☿', color: '#00897B', desc: 'Light green planet' },
  Ju: { symbol: 'Ju', name: 'Jupiter', hindiName: 'गुरु', signIndex: 3, icon: '♃', color: '#FFB300', desc: 'Yellow gas giant' },
  Ve: { symbol: 'Ve', name: 'Venus', hindiName: 'शुक्र', signIndex: 6, icon: '♀', color: '#0288D1', desc: 'Blue radiant planet' },
  Sa: { symbol: 'Sa', name: 'Saturn', hindiName: 'शनि', signIndex: 12, icon: '♄', color: '#827717', desc: 'Ringed golden planet' },
  Ra: { symbol: 'Ra', name: 'Rahu', hindiName: 'राहु', signIndex: 11, icon: '☊', color: '#616161', desc: 'Shadow dark grey' },
  Ke: { symbol: 'Ke', name: 'Ketu', hindiName: 'केतु', signIndex: 5, icon: '☋', color: '#546E7A', desc: 'Shadow slate grey' },
};

const PLANETS_ARRAY = Object.values(PLANET_CONFIGS);

// Fixed South Indian Zodiac Map
const SOUTH_ZODIAC_GRID = [
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
  const { t } = useLanguage();
  const [chartStyle, setChartStyle] = useState<'NORTH' | 'SOUTH'>('NORTH');
  const [refMode, setRefMode] = useState<ReferenceMode>('LAGNA');

  const lagnaInfo = panchang.lagnaInfo || {
    currentLagnaSign: 5,
    name: 'Simha (Leo)',
    hindiName: 'सिंह',
    startTime: '06:15 AM',
    endTime: '08:20 AM',
    allLagnas: []
  };

  const lagnaSign = lagnaInfo.currentLagnaSign;
  const sunSign = 5; // Simha
  const moonSign = 10; // Makara

  // Determine which Zodiac Sign is placed in the 1st House (Lagna house)
  const firstHouseSign = 
    refMode === 'MOON' ? moonSign :
    refMode === 'SUN' ? sunSign :
    lagnaSign;

  // Get sign number for House 1..12 in North Indian chart
  const getSignForHouse = (houseNum: number): number => {
    return ((firstHouseSign - 1 + houseNum - 1) % 12) + 1;
  };

  // Get planets inside a given zodiac sign index (1-12)
  const getPlanetsInSign = (signIdx: number): PlanetConfig[] => {
    return PLANETS_ARRAY.filter(p => p.signIndex === signIdx);
  };

  // Get planets inside a house (1-12) for North Chart
  const getPlanetsInHouse = (houseNum: number): PlanetConfig[] => {
    const signIdx = getSignForHouse(houseNum);
    return getPlanetsInSign(signIdx);
  };

  // House Label Positions for North Indian Diamond Chart SVG (300x300 canvas)
  const NORTH_HOUSE_POSITIONS = [
    { houseNum: 1, x: 150, y: 44, px: 150, py: 70 },   // H1 (Top Center Diamond - 1st House)
    { houseNum: 2, x: 80, y: 32, px: 80, py: 48 },     // H2 (Upper Left)
    { houseNum: 3, x: 35, y: 70, px: 35, py: 86 },    // H3 (Left Upper)
    { houseNum: 4, x: 80, y: 138, px: 80, py: 155 },   // H4 (Left Center Diamond)
    { houseNum: 5, x: 35, y: 210, px: 35, py: 226 },   // H5 (Left Lower)
    { houseNum: 6, x: 80, y: 250, px: 80, py: 266 },   // H6 (Lower Left)
    { houseNum: 7, x: 150, y: 208, px: 150, py: 225 }, // H7 (Bottom Center Diamond)
    { houseNum: 8, x: 220, y: 250, px: 220, py: 266 }, // H8 (Lower Right)
    { houseNum: 9, x: 265, y: 210, px: 265, py: 226 }, // H9 (Right Lower)
    { houseNum: 10, x: 220, y: 138, px: 220, py: 155 },// H10 (Right Center Diamond)
    { houseNum: 11, x: 265, y: 70, px: 265, py: 86 }, // H11 (Right Upper)
    { houseNum: 12, x: 220, y: 32, px: 220, py: 48 },  // H12 (Upper Right)
  ];

  return (
    <View style={styles.card}>
      {/* Header Row with North/South Toggle cleanly contained */}
      <View style={styles.headerRow}>
        <View style={styles.titleBox}>
          <Text style={styles.cardTitle} numberOfLines={1} adjustsFontSizeToFit>🪐 {t('gocharKundaliHeader')}</Text>
        </View>

        {/* Segmented Control - North vs South Indian */}
        <View style={styles.chartToggleBar}>
          <TouchableOpacity
            style={[styles.chartToggleBtn, chartStyle === 'NORTH' && styles.chartToggleBtnActive]}
            onPress={() => setChartStyle('NORTH')}
          >
            <Text style={[styles.chartToggleText, chartStyle === 'NORTH' && styles.chartToggleTextActive]} numberOfLines={1} adjustsFontSizeToFit>
              {t('northIndian')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.chartToggleBtn, chartStyle === 'SOUTH' && styles.chartToggleBtnActive]}
            onPress={() => setChartStyle('SOUTH')}
          >
            <Text style={[styles.chartToggleText, chartStyle === 'SOUTH' && styles.chartToggleTextActive]} numberOfLines={1} adjustsFontSizeToFit>
              {t('southIndian')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3-Way Chart Reference Mode Switcher: Ascendant / Moon Sign / Sun Sign */}
      <View style={styles.refModeContainer}>
        <TouchableOpacity
          style={[styles.refModeBtn, refMode === 'LAGNA' && styles.refModeBtnActive]}
          onPress={() => setRefMode('LAGNA')}
        >
          <Text style={[styles.refModeText, refMode === 'LAGNA' && styles.refModeTextActive]} numberOfLines={1} adjustsFontSizeToFit>
            🌅 {t('ascendant')}
          </Text>
          <Text style={[styles.refModeSubText, refMode === 'LAGNA' && styles.refModeSubTextActive]} numberOfLines={1} adjustsFontSizeToFit>
            {t('risingLagna')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.refModeBtn, refMode === 'MOON' && styles.refModeBtnActive]}
          onPress={() => setRefMode('MOON')}
        >
          <Text style={[styles.refModeText, refMode === 'MOON' && styles.refModeTextActive]} numberOfLines={1} adjustsFontSizeToFit>
            🌙 {t('moonSign')}
          </Text>
          <Text style={[styles.refModeSubText, refMode === 'MOON' && styles.refModeSubTextActive]} numberOfLines={1} adjustsFontSizeToFit>
            {t('chandraLagna')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.refModeBtn, refMode === 'SUN' && styles.refModeBtnActive]}
          onPress={() => setRefMode('SUN')}
        >
          <Text style={[styles.refModeText, refMode === 'SUN' && styles.refModeTextActive]} numberOfLines={1} adjustsFontSizeToFit>
            ☀️ {t('sunSign')}
          </Text>
          <Text style={[styles.refModeSubText, refMode === 'SUN' && styles.refModeSubTextActive]} numberOfLines={1} adjustsFontSizeToFit>
            {t('suryaLagna')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Mode Banner */}
      <View style={styles.lagnaBanner}>
        <View style={styles.lagnaLeft}>
          <Text style={styles.lagnaIcon}>
            {refMode === 'MOON' ? '🌙' : refMode === 'SUN' ? '☀️' : '🌅'}
          </Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.lagnaTitleText} numberOfLines={2} adjustsFontSizeToFit>
              {refMode === 'MOON' ? `${t('moonSign')} (${t('chandraLagna')}) : Capricorn (Makara) (मकर)` :
               refMode === 'SUN' ? `${t('sunSign')} (${t('suryaLagna')}) : Leo (Simha) (सिंह)` :
               `${t('ascendant')} (${t('risingLagna')}) : ${lagnaInfo.name} (${lagnaInfo.hindiName})`}
            </Text>
            <Text style={styles.lagnaTimeSub} numberOfLines={1} adjustsFontSizeToFit>
              {refMode === 'MOON' ? '1st House = Makara (Capricorn)' :
               refMode === 'SUN' ? '1st House = Simha (Leo)' :
               `Rising Window: ${lagnaInfo.startTime} - ${lagnaInfo.endTime}`}
            </Text>
          </View>
        </View>
        <View style={styles.activeLagnaBadge}>
          <Text style={styles.activeLagnaBadgeText}>1st House</Text>
        </View>
      </View>

      {/* Chart Visualization */}
      <View style={styles.chartWrapper}>
        {chartStyle === 'NORTH' ? (
          /* North Indian Diamond Chart */
          <Svg width={300} height={300} viewBox="0 0 300 300" style={styles.svgChart}>
            {/* Background Parchment Box */}
            <Rect x={10} y={10} width={280} height={280} fill="#FAF5EC" stroke="#D4A359" strokeWidth={3} rx={4} />
            <Rect x={14} y={14} width={272} height={272} fill="none" stroke="#C49347" strokeWidth={1} />

            {/* Main Diagonals */}
            <Line x1={10} y1={10} x2={290} y2={290} stroke="#5D3A00" strokeWidth={1.5} />
            <Line x1={290} y1={10} x2={10} y2={290} stroke="#5D3A00" strokeWidth={1.5} />

            {/* Midpoint Diamond Polygon */}
            <Polygon points="150,10 290,150 150,290 10,150" fill="none" stroke="#5D3A00" strokeWidth={1.8} />

            {/* Render Houses 1 to 12 Labels & Custom Colored Planet Icons */}
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

                  {/* House 1 Subtitle */}
                  {hp.houseNum === 1 && (
                    <SvgText
                      x={hp.x}
                      y={hp.y + 14}
                      fontSize={11}
                      fontWeight="bold"
                      fill="#800000"
                      textAnchor="middle"
                    >
                      {refMode === 'MOON' ? t('chandraLagna') : refMode === 'SUN' ? t('suryaLagna') : t('risingLagna')}
                    </SvgText>
                  )}

                  {/* Render Planets in House with Custom Colors & Icons (Zero Overlap Vertical Stacking) */}
                  {planets.map((p, pIdx) => {
                    let px = hp.px;
                    let py = hp.houseNum === 1 ? hp.py + 10 : hp.py;

                    if (planets.length > 1) {
                      if (planets.length <= 3) {
                        const startY = hp.houseNum === 1 ? hp.py + 8 : hp.py - ((planets.length - 1) * 6);
                        py = startY + pIdx * 13;
                      } else {
                        const row = Math.floor(pIdx / 2);
                        const col = pIdx % 2;
                        px = hp.px + (col === 0 ? -18 : 18);
                        py = (hp.houseNum === 1 ? hp.py + 8 : hp.py - 6) + row * 13;
                      }
                    }

                    return (
                      <SvgText
                        key={p.symbol}
                        x={px}
                        y={py}
                        fontSize={10}
                        fontWeight="900"
                        fill={p.color}
                        textAnchor="middle"
                      >
                        {`${p.icon} ${p.symbol}`}
                      </SvgText>
                    );
                  })}
                </G>
              );
            })}
          </Svg>
        ) : (
          /* South Indian Grid Chart (Matching @image2 with double slash '//' on 1st House cell) */
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
            <SvgText x={150} y={140} fontSize={12} fontWeight="bold" fill="#800000" textAnchor="middle">
              {refMode === 'MOON' ? t('chandraLagna').toUpperCase() : refMode === 'SUN' ? t('suryaLagna').toUpperCase() : t('risingLagna').toUpperCase()}
            </SvgText>
            <SvgText x={150} y={160} fontSize={10} fontWeight="bold" fill="#C49347" textAnchor="middle">
              {refMode === 'MOON' ? '1st House = Moon Sign' : refMode === 'SUN' ? '1st House = Sun Sign' : '1st House = Ascendant'}
            </SvgText>

            {/* Render 12 Fixed Sign Cells */}
            {SOUTH_ZODIAC_GRID.map((cell) => {
              const isFirstHouse = cell.signIndex === firstHouseSign;
              const planets = getPlanetsInSign(cell.signIndex);

              return (
                <G key={cell.signIndex}>
                  {/* Sign Abbreviation (Ar, Ta, Ge, Cn, Le, Vi, Li, Sc, Sg, Cp, Aq, Pi) */}
                  <SvgText
                    x={cell.x + 35}
                    y={cell.y + 28}
                    fontSize={16}
                    fontWeight="bold"
                    fill={isFirstHouse ? '#800000' : '#5D3A00'}
                    textAnchor="middle"
                  >
                    {cell.abbrev}
                  </SvgText>

                  {/* Double Slash '//' for 1st House Corner (as in @image2) */}
                  {isFirstHouse && (
                    <G>
                      <Line x1={cell.x + 52} y1={cell.y + 12} x2={cell.x + 64} y2={cell.y + 24} stroke="#800000" strokeWidth={2} />
                      <Line x1={cell.x + 57} y1={cell.y + 12} x2={cell.x + 69} y2={cell.y + 24} stroke="#800000" strokeWidth={2} />
                    </G>
                  )}

                  {/* Planets inside Sign Cell with Custom Colors & Icons (Vertical Stacking) */}
                  {planets.map((p, pIdx) => {
                    let px = cell.x + 35;
                    let py = cell.y + 50;

                    if (planets.length > 1) {
                      if (planets.length <= 2) {
                        py = cell.y + 44 + pIdx * 13;
                      } else {
                        const offset = (pIdx - (planets.length - 1) / 2) * 14;
                        px = cell.x + 35 + offset;
                        py = cell.y + 52;
                      }
                    }

                    return (
                      <SvgText
                        key={p.symbol}
                        x={px}
                        y={py}
                        fontSize={9}
                        fontWeight="900"
                        fill={p.color}
                        textAnchor="middle"
                      >
                        {`${p.icon} ${p.symbol}`}
                      </SvgText>
                    );
                  })}
                </G>
              );
            })}
          </Svg>
        )}
      </View>

      {/* Visual Planetary Key (matching user's color description) */}
      <View style={styles.planetKeyContainer}>
        <Text style={styles.legendTitle}>🪐 Navagraha Color & Symbol Key (ग्रह रंग संकेत):</Text>

        <View style={styles.planetKeyGrid}>
          {PLANETS_ARRAY.map((p) => (
            <View key={p.symbol} style={styles.planetKeyPill}>
              <Text style={{ fontSize: 13, marginRight: 4 }}>{p.icon}</Text>
              <Text style={[styles.planetKeySymbol, { color: p.color }]}>{p.symbol}</Text>
              <Text style={styles.planetKeyName}> ({p.hindiName})</Text>
            </View>
          ))}
        </View>
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
    marginBottom: 10,
    gap: 8,
  },
  titleBox: {
    flexShrink: 1,
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
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
    paddingHorizontal: 10,
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
  refModeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5EBE6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
    justifyContent: 'space-between',
    gap: 4,
  },
  refModeBtn: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 9,
    alignItems: 'center',
  },
  refModeBtnActive: {
    backgroundColor: Colors.maroon,
  },
  refModeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  refModeTextActive: {
    color: '#FFFFFF',
  },
  refModeSubText: {
    fontSize: 9,
    fontWeight: '500',
    color: Colors.textMuted,
    marginTop: 1,
  },
  refModeSubTextActive: {
    color: '#FFE0B2',
  },
  lagnaBanner: {
    backgroundColor: '#FFF3E0',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  lagnaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lagnaIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  lagnaTitleText: {
    fontSize: 12,
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
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 6,
    flexShrink: 0,
  },
  activeLagnaBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  svgChart: {
    borderRadius: 14,
    elevation: 2,
  },
  planetKeyContainer: {
    backgroundColor: '#FAF5EE',
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E0D0B8',
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 8,
  },
  planetKeyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  planetKeyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  planetKeySymbol: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  planetKeyName: {
    fontSize: 10,
    color: Colors.textSecondary,
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
