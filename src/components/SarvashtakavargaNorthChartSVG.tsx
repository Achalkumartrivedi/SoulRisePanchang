import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Polygon } from 'react-native-svg';
import { HouseSAVDiagnostic, SAV_BANDS } from '../engine/sarvashtakavargaEngine';
import { Colors } from '../theme/colors';

interface SarvashtakavargaNorthChartSVGProps {
  houses: HouseSAVDiagnostic[];
  size?: number;
  isHindi?: boolean;
}

export const SarvashtakavargaNorthChartSVG: React.FC<SarvashtakavargaNorthChartSVGProps> = ({
  houses,
  size = 320,
  isHindi = false
}) => {
  const windowWidth = Dimensions.get('window').width;
  const S = Math.min(size, Math.max(windowWidth - 48, 260));
  const H = S / 2;

  // Geometric center coordinates for 12 North Indian Kundli houses
  const housePositions: Record<number, { x: number; y: number }> = {
    1:  { x: H,        y: H / 2.2 },   // Top Center Diamond (Lagna)
    2:  { x: H / 2.5,  y: H / 4.6 },   // Top-Left Triangle
    3:  { x: H / 4.6,  y: H / 2.5 },   // Left-Top Triangle
    4:  { x: H / 2.2,  y: H },         // Left Center Diamond
    5:  { x: H / 4.6,  y: H * 1.55 },  // Left-Bottom Triangle
    6:  { x: H / 2.5,  y: H * 1.78 },  // Bottom-Left Triangle
    7:  { x: H,        y: H * 1.55 },  // Bottom Center Diamond
    8:  { x: H * 1.6,  y: H * 1.78 },  // Bottom-Right Triangle
    9:  { x: H * 1.78, y: H * 1.55 },  // Right-Bottom Triangle
    10: { x: H * 1.58, y: H },         // Right Center Diamond
    11: { x: H * 1.78, y: H / 2.5 },   // Right-Top Triangle
    12: { x: H * 1.6,  y: H / 4.6 }    // Top-Right Triangle
  };

  const houseMap = new Map<number, HouseSAVDiagnostic>();
  houses.forEach(h => houseMap.set(h.houseNumber, h));

  const scaleFactor = S / 320;
  const badgeW = Math.round(scaleFactor * 68);

  return (
    <View style={styles.outerWrapper}>
      {/* North Indian Diamond Kundli Chart Box */}
      <View style={[styles.chartContainer, { width: S, height: S }]}>
        <Svg width={S} height={S} style={StyleSheet.absoluteFill}>
          {/* Outer Square Background */}
          <Rect x="2" y="2" width={S - 4} height={S - 4} stroke={Colors.maroon} strokeWidth="3" fill="#FFFDF9" />

          {/* Corner-to-Corner Diagonals */}
          <Line x1="2" y1="2" x2={S - 2} y2={S - 2} stroke={Colors.maroon} strokeWidth="1.8" />
          <Line x1={S - 2} y1="2" x2="2" y2={S - 2} stroke={Colors.maroon} strokeWidth="1.8" />

          {/* Central Inner Diamond */}
          <Polygon
            points={`${H},2 ${S - 2},${H} ${H},${S - 2} 2,${H}`}
            stroke={Colors.maroon}
            strokeWidth="2.2"
            fill="none"
          />

          {/* Subtle Golden Glow for Lagna (House 1) */}
          <Polygon
            points={`${H},2 ${H * 1.5},${H / 2} ${H},${H} ${H / 2},${H / 2}`}
            fill="rgba(255, 215, 0, 0.12)"
          />
        </Svg>

        {/* 12 House Points Overlays */}
        {Array.from({ length: 12 }, (_, i) => i + 1).map(hNum => {
          const hData = houseMap.get(hNum);
          const pos = housePositions[hNum];
          if (!pos || !hData) return null;

          const isLagna = hNum === 1;
          const band = hData.band;

          return (
            <View
              key={hNum}
              style={[
                styles.houseBadgeContainer,
                {
                  left: pos.x - badgeW / 2,
                  top: pos.y - 24,
                  width: badgeW,
                }
              ]}
            >
              {/* House Number & Rashi Indicator */}
              <Text style={[styles.houseNumText, isLagna && styles.lagnaNumText]}>
                {isLagna ? (isHindi ? 'H1 लग्न' : 'H1 Lagna') : `H${hNum}`}
              </Text>
              <Text style={styles.rashiShortText} numberOfLines={1}>
                {isHindi ? hData.rashiHindi : hData.rashiName.split(' ')[0]}
              </Text>

              {/* Prominent Colored Points Pill */}
              <View
                style={[
                  styles.pointPill,
                  {
                    backgroundColor: band.color,
                    borderColor: band.borderColor,
                  }
                ]}
              >
                <Text style={styles.pointNumberText}>{hData.points}</Text>
                <Text style={styles.pointUnitText}>{isHindi ? 'अंक' : 'pts'}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* 4-Band Color Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: SAV_BANDS.SHRESTHA.color }]} />
          <Text style={styles.legendText}>
            {isHindi ? '≥30 श्रेष्ठ (प्रबल)' : '≥30 Fortified'}
          </Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: SAV_BANDS.MADHYAMA.color }]} />
          <Text style={styles.legendText}>
            {isHindi ? '25-29 मध्यम' : '25-29 Moderate'}
          </Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: SAV_BANDS.ALPA.color }]} />
          <Text style={styles.legendText}>
            {isHindi ? '20-24 अल्प (मेहनत)' : '20-24 Deficit'}
          </Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: SAV_BANDS.ATI_KASHTA.color }]} />
          <Text style={styles.legendText}>
            {isHindi ? '<20 अति-कष्ट' : '<20 Severe'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    alignItems: 'center',
    marginVertical: 8,
  },
  chartContainer: {
    position: 'relative',
    backgroundColor: '#FFFDF9',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  houseBadgeContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  houseNumText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#5D4037',
    textAlign: 'center',
  },
  lagnaNumText: {
    color: '#B71C1C',
    fontWeight: '800',
  },
  rashiShortText: {
    fontSize: 8.5,
    color: '#8D6E63',
    fontWeight: '600',
    marginTop: -1,
    marginBottom: 2,
    textAlign: 'center',
  },
  pointPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    elevation: 2,
    gap: 2,
  },
  pointNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  pointUnitText: {
    fontSize: 7.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 8,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#424242',
  },
});
