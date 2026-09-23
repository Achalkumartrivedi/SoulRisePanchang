import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Polygon } from 'react-native-svg';
import { Colors } from '../theme/colors';

interface HouseData {
  houseNumber: number;
  rashiName: string;
  planets: string[];
}

interface NorthIndianTriangleChartProps {
  houses: HouseData[];
  size?: number;
}

export const NorthIndianTriangleChart: React.FC<NorthIndianTriangleChartProps> = ({
  houses,
  size = 320
}) => {
  const windowWidth = Dimensions.get('window').width;
  // Responsively scale chart graphics to fit smaller mobile devices cleanly
  const S = Math.min(size, Math.max(windowWidth - 56, 250));
  const H = S / 2;

  // Map house numbers 1-12 to their geometric center positions in the North Indian Kundali graphic
  const housePositions: Record<number, { x: number; y: number }> = {
    1:  { x: H,       y: H / 2.2 },   // Top Center Diamond (Lagna)
    2:  { x: H / 2.5, y: H / 4.5 },   // Top-Left Triangle
    3:  { x: H / 4.5, y: H / 2.5 },   // Left-Top Triangle
    4:  { x: H / 2.2, y: H },         // Left Center Diamond
    5:  { x: H / 4.5, y: H * 1.55 },  // Left-Bottom Triangle
    6:  { x: H / 2.5, y: H * 1.78 },  // Bottom-Left Triangle
    7:  { x: H,       y: H * 1.55 },  // Bottom Center Diamond
    8:  { x: H * 1.6, y: H * 1.78 },  // Bottom-Right Triangle
    9:  { x: H * 1.78,y: H * 1.55 },  // Right-Bottom Triangle
    10: { x: H * 1.58,y: H },         // Right Center Diamond
    11: { x: H * 1.78,y: H / 2.5 },   // Right-Top Triangle
    12: { x: H * 1.6, y: H / 4.5 }    // Top-Right Triangle
  };

  const houseMap = new Map<number, HouseData>();
  houses.forEach(h => houseMap.set(h.houseNumber, h));

  const scaleFactor = S / 320;
  const badgeW = Math.round(scaleFactor * 72);

  return (
    <View style={[styles.container, { width: S, height: S }]}>
      {/* SVG Background Lines forming the 4 Central Diamonds & 8 Outer Triangles */}
      <Svg width={S} height={S} style={StyleSheet.absoluteFill}>
        {/* Outer Square */}
        <Rect x="2" y="2" width={S - 4} height={S - 4} stroke={Colors.maroon} strokeWidth="3" fill="#FFF8F0" />

        {/* Diagonal Cross (Corner to Corner) */}
        <Line x1="2" y1="2" x2={S - 2} y2={S - 2} stroke={Colors.maroon} strokeWidth="2" />
        <Line x1={S - 2} y1="2" x2="2" y2={S - 2} stroke={Colors.maroon} strokeWidth="2" />

        {/* Inner Diamond (Connecting Midpoints of Outer Box) */}
        <Polygon
          points={`${H},2 ${S - 2},${H} ${H},${S - 2} 2,${H}`}
          stroke={Colors.maroon}
          strokeWidth="2.5"
          fill="none"
        />

        {/* Central Lagna Gold Highlight for House 1 Diamond */}
        <Polygon
          points={`${H},2 ${H * 1.5},${H / 2} ${H},${H} ${H / 2},${H / 2}`}
          fill="rgba(255, 215, 0, 0.15)"
        />
      </Svg>

      {/* Render 12 House Badges with House Numbers, Rashi Names & Occupying Planets */}
      {Array.from({ length: 12 }, (_, i) => i + 1).map(hNum => {
        const hData = houseMap.get(hNum);
        const pos = housePositions[hNum];
        if (!pos) return null;

        const isLagna = hNum === 1;

        return (
          <View
            key={hNum}
            style={[
              styles.houseTextBadge,
              {
                left: pos.x - badgeW / 2,
                top: pos.y - 22,
                width: badgeW,
              }
            ]}
          >
            {/* House Number Tag */}
            <Text style={[styles.houseNumText, isLagna && styles.lagnaNumText]}>
              {hNum}{isLagna ? ' (Lagna)' : ''}
            </Text>

            {/* Rashi Name */}
            {hData && (
              <Text style={styles.rashiText} numberOfLines={1}>
                {hData.rashiName.split(' ')[0]}
              </Text>
            )}

            {/* Planets in this House */}
            {hData && hData.planets.length > 0 ? (
              <Text style={styles.planetListText} numberOfLines={2}>
                {hData.planets.join(' ')}
              </Text>
            ) : (
              <Text style={styles.emptyHouseText}>—</Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  houseTextBadge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  houseNumText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.maroon,
    textAlign: 'center',
  },
  lagnaNumText: {
    color: '#D84315',
    fontSize: 10,
  },
  rashiText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  planetListText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    textAlign: 'center',
    marginTop: 1,
  },
  emptyHouseText: {
    fontSize: 8,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
