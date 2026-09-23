import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text as RNText, TouchableOpacity } from 'react-native';
import Svg, { Rect, Line, Polygon, Circle, G, Text as SvgText } from 'react-native-svg';
import { KotaChakraResult } from '../engine/kotaChakraEngine';
import { LanguageCode } from '../types/language';

export type PlanetFilterMode = 'ALL' | 'TRANSIT' | 'NATAL';

interface KotaChakraDiagramSVGProps {
  result: KotaChakraResult;
  language: LanguageCode;
  filterMode?: PlanetFilterMode;
  onFilterModeChange?: (mode: PlanetFilterMode) => void;
}

const SvgTextComp = SvgText as any;

export const KotaChakraDiagramSVG: React.FC<KotaChakraDiagramSVGProps> = ({
  result,
  language,
  filterMode: controlledFilterMode,
  onFilterModeChange
}) => {
  const [internalFilterMode, setInternalFilterMode] = useState<PlanetFilterMode>('ALL');
  const filterMode = controlledFilterMode !== undefined ? controlledFilterMode : internalFilterMode;

  const handleTabPress = (mode: PlanetFilterMode) => {
    setInternalFilterMode(mode);
    if (onFilterModeChange) {
      onFilterModeChange(mode);
    }
  };

  const size = Math.min(Dimensions.get('window').width - 32, 380);

  // 28 Rotated Path Coordinates on 380x380 SVG Canvas
  // Diagonals positioned close to fort corners; Horizontal/Vertical numbers sit right at boundary lines with planets beside them!
  const pathCoords: Record<number, {
    numX: number; numY: number; numAnchor: 'start' | 'middle' | 'end';
    roadX: number; roadY: number; roadAnchor: 'start' | 'middle' | 'end';
  }> = {
    // Path 1 – Upper-left diagonal (Inward ↙) [3 numbers: 0, 1, 2] -> right at diagonal corners
    0: { numX: 44, numY: 44, numAnchor: 'middle', roadX: 32, roadY: 32, roadAnchor: 'end' },       // Bahya Red Corner (35, 35)
    1: { numX: 78, numY: 78, numAnchor: 'middle', roadX: 66, roadY: 66, roadAnchor: 'end' },       // Prakaara Blue Corner (72, 72)
    2: { numX: 116, numY: 116, numAnchor: 'middle', roadX: 104, roadY: 104, roadAnchor: 'end' },   // Madhya Brown Corner (110, 110)

    // Path 2 – Upper vertical (Outward ↑) [4 numbers: 3, 4, 5, 6] -> right against wall lines
    3: { numX: 190, numY: 162, numAnchor: 'middle', roadX: 190, roadY: 148, roadAnchor: 'middle' }, // Stambha top
    4: { numX: 175, numY: 110, numAnchor: 'end', roadX: 202, roadY: 110, roadAnchor: 'start' },     // Madhya top (Line y=110, planets right beside at x=202)
    5: { numX: 175, numY: 72, numAnchor: 'end', roadX: 202, roadY: 72, roadAnchor: 'start' },       // Prakaara top (Line y=72, planets right beside at x=202)
    6: { numX: 175, numY: 35, numAnchor: 'end', roadX: 202, roadY: 35, roadAnchor: 'start' },       // Bahya top (Line y=35, planets right beside at x=202)

    // Path 3 – Upper-right diagonal (Inward ↘) [3 numbers: 7, 8, 9] -> right at diagonal corners
    7: { numX: 336, numY: 44, numAnchor: 'middle', roadX: 348, roadY: 32, roadAnchor: 'start' },     // Bahya Red Corner (345, 35)
    8: { numX: 302, numY: 78, numAnchor: 'middle', roadX: 314, roadY: 66, roadAnchor: 'start' },     // Prakaara Blue Corner (308, 72)
    9: { numX: 264, numY: 116, numAnchor: 'middle', roadX: 276, roadY: 104, roadAnchor: 'start' },   // Madhya Brown Corner (270, 110)

    // Path 4 – Right horizontal (Outward →) [4 numbers: 10, 11, 12, 13] -> right against wall lines
    10: { numX: 218, numY: 190, numAnchor: 'middle', roadX: 218, roadY: 190, roadAnchor: 'middle' }, // Stambha right
    11: { numX: 270, numY: 177, numAnchor: 'middle', roadX: 270, roadY: 201, roadAnchor: 'middle' }, // Madhya right (Line x=270, planets below at y=201)
    12: { numX: 308, numY: 177, numAnchor: 'middle', roadX: 308, roadY: 201, roadAnchor: 'middle' }, // Prakaara right (Line x=308, planets below at y=201)
    13: { numX: 345, numY: 177, numAnchor: 'middle', roadX: 345, roadY: 201, roadAnchor: 'middle' }, // Bahya right (Line x=345, planets below at y=201)

    // Path 5 – Lower-right diagonal (Inward ↖) [3 numbers: 14, 15, 16] -> right at diagonal corners
    14: { numX: 336, numY: 336, numAnchor: 'middle', roadX: 348, roadY: 348, roadAnchor: 'start' }, // Bahya Red Corner (345, 345)
    15: { numX: 302, numY: 302, numAnchor: 'middle', roadX: 314, roadY: 314, roadAnchor: 'start' }, // Prakaara Blue Corner (308, 308)
    16: { numX: 264, numY: 264, numAnchor: 'middle', roadX: 276, roadY: 276, roadAnchor: 'start' }, // Madhya Brown Corner (270, 270)

    // Path 6 – Lower vertical (Outward ↓) [4 numbers: 17, 18, 19, 20] -> right against wall lines
    17: { numX: 190, numY: 218, numAnchor: 'middle', roadX: 190, roadY: 232, roadAnchor: 'middle' },// Stambha bottom
    18: { numX: 175, numY: 270, numAnchor: 'end', roadX: 202, roadY: 270, roadAnchor: 'start' },    // Madhya bottom (Line y=270, planets beside at x=202)
    19: { numX: 175, numY: 308, numAnchor: 'end', roadX: 202, roadY: 308, roadAnchor: 'start' },    // Prakaara bottom (Line y=308, planets beside at x=202)
    20: { numX: 175, numY: 345, numAnchor: 'end', roadX: 202, roadY: 345, roadAnchor: 'start' },    // Bahya bottom (Line y=345, planets beside at x=202)

    // Path 7 – Lower-left diagonal (Inward ↗) [3 numbers: 21, 22, 23] -> right at diagonal corners
    21: { numX: 44, numY: 336, numAnchor: 'middle', roadX: 32, roadY: 348, roadAnchor: 'end' },       // Bahya Red Corner (35, 345)
    22: { numX: 78, numY: 302, numAnchor: 'middle', roadX: 66, roadY: 314, roadAnchor: 'end' },       // Prakaara Blue Corner (72, 308)
    23: { numX: 116, numY: 264, numAnchor: 'middle', roadX: 104, roadY: 276, roadAnchor: 'end' },     // Madhya Brown Corner (110, 270)

    // Path 8 – Left horizontal (Outward ←) [4 numbers: 24, 25, 26, 27] -> right against wall lines
    24: { numX: 162, numY: 190, numAnchor: 'middle', roadX: 162, roadY: 190, roadAnchor: 'middle' },// Stambha left
    25: { numX: 110, numY: 177, numAnchor: 'middle', roadX: 110, roadY: 201, roadAnchor: 'middle' },// Madhya left (Line x=110, planets below at y=201)
    26: { numX: 72, numY: 177, numAnchor: 'middle', roadX: 72, roadY: 201, roadAnchor: 'middle' }, // Prakaara left (Line x=72, planets below at y=201)
    27: { numX: 35, numY: 177, numAnchor: 'middle', roadX: 35, roadY: 201, roadAnchor: 'middle' }  // Bahya left (Line x=35, planets below at y=201)
  };

  const getTxt = (guj: string, hin: string, eng: string) => {
    if (language === 'gu') return guj;
    if (language === 'hi') return hin;
    return eng;
  };

  // Format short code with Red Asterisk (*) for Malefics (Sun, Mars, Saturn, Rahu, Ketu)
  const formatPlanetCode = (shortCode: string, isBenefic: boolean) => {
    if (!isBenefic) {
      return `${shortCode}*`;
    }
    return shortCode;
  };

  return (
    <View style={styles.container}>
      {/* Interactive Tab Switcher for Transit / Natal / All Planets */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, filterMode === 'ALL' && styles.tabBtnActive]}
          onPress={() => handleTabPress('ALL')}
          activeOpacity={0.8}
        >
          <RNText style={[styles.tabBtnText, filterMode === 'ALL' && styles.tabBtnTextActive]}>
            🌌 {getTxt('તમામ ગ્રહો', 'सभी ग्रह', 'All Planets')}
          </RNText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, filterMode === 'TRANSIT' && styles.tabBtnTransitActive]}
          onPress={() => handleTabPress('TRANSIT')}
          activeOpacity={0.8}
        >
          <RNText style={[styles.tabBtnText, filterMode === 'TRANSIT' && styles.tabBtnTextTransitActive]}>
            🟠 {getTxt('ગોચર ગ્રહો', 'गोचर ग्रह', 'Transit Planets')}
          </RNText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, filterMode === 'NATAL' && styles.tabBtnNatalActive]}
          onPress={() => handleTabPress('NATAL')}
          activeOpacity={0.8}
        >
          <RNText style={[styles.tabBtnText, filterMode === 'NATAL' && styles.tabBtnTextNatalActive]}>
            🟦 {getTxt('જન્મ ગ્રહો', 'जन्म ग्रह', 'Natal Planets')}
          </RNText>
        </TouchableOpacity>
      </View>

      {/* Legend & Malefic Asterisk Explanation Bar */}
      <View style={styles.legendHeader}>
        { (filterMode === 'ALL' || filterMode === 'TRANSIT') && (
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: '#D84315' }]} />
            <RNText style={[styles.legendText, { color: '#D84315' }]}>
              {getTxt('ગોચર', 'गोचर', 'Transit')}
            </RNText>
          </View>
        )}

        { (filterMode === 'ALL' || filterMode === 'NATAL') && (
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, { backgroundColor: '#1565C0' }]} />
            <RNText style={[styles.legendText, { color: '#1565C0' }]}>
              {getTxt('જન્મ', 'जन्म', 'Natal')}
            </RNText>
          </View>
        )}

        <View style={styles.legendItem}>
          <RNText style={styles.maleficNoteText}>
            <RNText style={{ color: '#C62828', fontWeight: 'bold' }}>*</RNText> = {getTxt('ક્રૂર ગ્રહ', 'क्रूर ग्रह', 'Malefic')}
          </RNText>
        </View>
      </View>

      <Svg width={size} height={size} viewBox="0 0 380 380">
        {/* Background - Traditional Cream */}
        <Rect x="0" y="0" width="380" height="380" fill="#FFFDF0" rx="12" />

        {/* 1. Bahya Outer Fort (Red Square Border) */}
        <Rect x="35" y="35" width="310" height="310" stroke="#C62828" strokeWidth="2.5" fill="#FFFDF5" />
        <SvgTextComp x="205" y="31" fill="#C62828" fontSize="11" fontWeight="bold" textAnchor="middle">
          {getTxt('બાહ્ય', 'बाह्य', 'Bahya')}
        </SvgTextComp>

        {/* 2. Prakaara Second Fort (Blue Square Border) */}
        <Rect x="72" y="72" width="236" height="236" stroke="#1565C0" strokeWidth="2.5" fill="none" />
        <SvgTextComp x="218" y="68" fill="#1565C0" fontSize="11" fontWeight="bold" textAnchor="middle">
          {getTxt('પ્રાકાર', 'प्राकार', 'Prakaara')}
        </SvgTextComp>

        {/* 3. Madhya Third Fort (Brown/Amber Square Border & Cream Fill) */}
        <Rect x="110" y="110" width="160" height="160" stroke="#8D6E63" strokeWidth="2.5" fill="#FFF8E1" />
        <SvgTextComp x="210" y="106" fill="#8D6E63" fontSize="11" fontWeight="bold" textAnchor="middle">
          {getTxt('મધ્ય', 'मध्य', 'Madhya')}
        </SvgTextComp>

        {/* 4. Stambha Inner Fort (PROMINENT & BIGGER 84x84 Square with Cyan Fill) */}
        <Rect x="148" y="148" width="84" height="84" stroke="#00838F" strokeWidth="3" fill="#B2EBF2" />
        <SvgTextComp x="190" y="144" fill="#00838F" fontSize="11" fontWeight="bold" textAnchor="middle">
          {getTxt('સ્તંભ', 'स्तंभ', 'Stambha')}
        </SvgTextComp>

        {/* 8 Broad Pathway Roads (Tracks) */}
        {/* Path 1 – Upper-left diagonal Road (Inward ↙) */}
        <Line x1="15" y1="15" x2="148" y2="148" stroke="rgba(121, 85, 72, 0.12)" strokeWidth="24" strokeLinecap="round" />
        <Line x1="15" y1="15" x2="148" y2="148" stroke="#8D6E63" strokeWidth="1" strokeDasharray="4 3" />
        <Polygon points="148,148 136,146 146,136" fill="#333333" />

        {/* Path 2 – Upper vertical Road (Outward ↑) */}
        <Line x1="190" y1="148" x2="190" y2="15" stroke="rgba(121, 85, 72, 0.12)" strokeWidth="24" strokeLinecap="round" />
        <Line x1="190" y1="148" x2="190" y2="15" stroke="#8D6E63" strokeWidth="1" strokeDasharray="4 3" />
        <Polygon points="190,15 186,26 194,26" fill="#333333" />

        {/* Path 3 – Upper-right diagonal Road (Inward ↘) */}
        <Line x1="365" y1="15" x2="232" y2="148" stroke="rgba(121, 85, 72, 0.12)" strokeWidth="24" strokeLinecap="round" />
        <Line x1="365" y1="15" x2="232" y2="148" stroke="#8D6E63" strokeWidth="1" strokeDasharray="4 3" />
        <Polygon points="232,148 234,136 244,146" fill="#333333" />

        {/* Path 4 – Right horizontal Road (Outward →) */}
        <Line x1="232" y1="190" x2="365" y2="190" stroke="rgba(121, 85, 72, 0.12)" strokeWidth="24" strokeLinecap="round" />
        <Line x1="232" y1="190" x2="365" y2="190" stroke="#8D6E63" strokeWidth="1" strokeDasharray="4 3" />
        <Polygon points="365,190 354,186 354,194" fill="#333333" />

        {/* Path 5 – Lower-right diagonal Road (Inward ↖) */}
        <Line x1="365" y1="365" x2="232" y2="232" stroke="rgba(121, 85, 72, 0.12)" strokeWidth="24" strokeLinecap="round" />
        <Line x1="365" y1="365" x2="232" y2="232" stroke="#8D6E63" strokeWidth="1" strokeDasharray="4 3" />
        <Polygon points="232,232 244,234 234,244" fill="#333333" />

        {/* Path 6 – Lower vertical Road (Outward ↓) */}
        <Line x1="190" y1="232" x2="190" y2="365" stroke="rgba(121, 85, 72, 0.12)" strokeWidth="24" strokeLinecap="round" />
        <Line x1="190" y1="232" x2="190" y2="365" stroke="#8D6E63" strokeWidth="1" strokeDasharray="4 3" />
        <Polygon points="190,365 186,354 194,354" fill="#333333" />

        {/* Path 7 – Lower-left diagonal Road (Inward ↗) */}
        <Line x1="15" y1="365" x2="148" y2="232" stroke="rgba(121, 85, 72, 0.12)" strokeWidth="24" strokeLinecap="round" />
        <Line x1="15" y1="365" x2="148" y2="232" stroke="#8D6E63" strokeWidth="1" strokeDasharray="4 3" />
        <Polygon points="148,232 146,244 136,234" fill="#333333" />

        {/* Path 8 – Left horizontal Road (Outward ←) */}
        <Line x1="148" y1="190" x2="15" y2="190" stroke="rgba(121, 85, 72, 0.12)" strokeWidth="24" strokeLinecap="round" />
        <Line x1="148" y1="190" x2="15" y2="190" stroke="#8D6E63" strokeWidth="1" strokeDasharray="4 3" />
        <Polygon points="15,190 26,186 26,194" fill="#333333" />

        {/* Render 28 Rotated Path Positions (k = 0..27) */}
        {Object.entries(result.pathPositions).map(([kStr, pos]) => {
          const k = parseInt(kStr, 10);
          const coord = pathCoords[k];
          if (!coord) return null;

          const isStambha = pos.zone === 'STAMBHA';

          // Filter planets based on tab mode (ALL, TRANSIT, NATAL)
          const showNatal = filterMode === 'ALL' || filterMode === 'NATAL';
          const showTransit = filterMode === 'ALL' || filterMode === 'TRANSIT';

          const natalCodes = showNatal ? pos.natalPlanets.map(p => formatPlanetCode(p.shortCode, p.isBenefic)).join(' ') : '';
          const transitCodes = showTransit ? pos.transitPlanets.map(p => formatPlanetCode(p.shortCode, p.isBenefic)).join(' ') : '';

          return (
            <G key={k}>
              {/* Red dot indicator for Stambha Core entries */}
              {isStambha && (
                <Circle
                  cx={k === 3 ? 190 : k === 10 ? 228 : k === 17 ? 190 : 152}
                  cy={k === 3 ? 152 : k === 10 ? 190 : k === 17 ? 228 : 190}
                  r="4"
                  fill="#C62828"
                />
              )}

              {/* Rotated Nakshatra Number positioned neatly near closed Fort Wall */}
              <G>
                {/* Soft White background pill to prevent any line overlap */}
                <Rect
                  x={coord.numX - 8.5}
                  y={coord.numY - 6.5}
                  width="17"
                  height="13"
                  rx="3"
                  fill="#FFFFFF"
                  stroke="#B0BEC5"
                  strokeWidth="0.8"
                />
                <SvgTextComp
                  x={coord.numX}
                  y={coord.numY + 3}
                  fill="#212121"
                  fontSize={isStambha ? "9.5" : "8.5"}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {pos.displayNumber}
                </SvgTextComp>
              </G>

              {/* Planet Names Positioned INSIDE Pathway Road (Bold & Clear) */}
              {/* Transit Planets (Deep Orange Coral) */}
              {transitCodes.length > 0 && (
                <SvgTextComp
                  x={coord.roadX}
                  y={coord.roadY - (natalCodes.length > 0 ? 6 : 0)}
                  fill="#BF360C"
                  fontSize="11.5"
                  fontWeight="bold"
                  textAnchor={coord.roadAnchor}
                >
                  {transitCodes}
                </SvgTextComp>
              )}

              {/* Natal Planets (Royal Blue) */}
              {natalCodes.length > 0 && (
                <SvgTextComp
                  x={coord.roadX}
                  y={coord.roadY + (transitCodes.length > 0 ? 6 : 0)}
                  fill="#0D47A1"
                  fontSize="11.5"
                  fontWeight="bold"
                  textAnchor={coord.roadAnchor}
                >
                  {natalCodes}
                </SvgTextComp>
              )}
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 3,
    marginBottom: 8,
    width: '100%',
    justifyContent: 'space-between'
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2
  },
  tabBtnActive: {
    backgroundColor: '#37474F'
  },
  tabBtnTransitActive: {
    backgroundColor: '#D84315'
  },
  tabBtnNatalActive: {
    backgroundColor: '#1565C0'
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#616161'
  },
  tabBtnTextActive: {
    color: '#FFFFFF'
  },
  tabBtnTextTransitActive: {
    color: '#FFFFFF'
  },
  tabBtnTextNatalActive: {
    color: '#FFFFFF'
  },
  legendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 5,
    marginBottom: 6,
    backgroundColor: '#FFFDE7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFF59D'
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  legendBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 5
  },
  legendText: {
    fontSize: 10.5,
    fontWeight: '700'
  },
  maleficNoteText: {
    fontSize: 10.5,
    color: '#333333',
    fontWeight: '700'
  }
});
