import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface PaintBrushHeaderProps {
  title: string;
}

export const PaintBrushHeader: React.FC<PaintBrushHeaderProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Svg height="32" width="260" viewBox="0 0 260 32" style={styles.svgBackground}>
        <Defs>
          <LinearGradient id="brushGradient" x1="0" y1="0.5" x2="1" y2="0.5">
            <Stop offset="0%" stopColor="#FFC107" stopOpacity="0.95" />
            <Stop offset="55%" stopColor="#FFD54F" stopOpacity="0.85" />
            <Stop offset="80%" stopColor="#FFE082" stopOpacity="0.4" />
            <Stop offset="95%" stopColor="#FFF8E1" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#FFF8E1" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Slimmer Paint Brush Stroke Path with soft feathered right edge */}
        <Path
          d="M 8 2 
             C 4 2, 0 5, 0 10 
             L 0 24 
             C 0 29, 4 32, 8 32 
             L 205 32 
             C 215 32, 222 30, 228 26 
             C 234 23, 240 25, 246 20 
             C 252 15, 257 17, 260 13 
             C 254 10, 247 11, 238 7 
             C 229 3, 218 2, 206 2 
             Z"
          fill="url(#brushGradient)"
        />
      </Svg>

      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 32,
    width: 260,
    justifyContent: 'center',
    paddingLeft: 12,
    marginBottom: 12,
  },
  svgBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  titleText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1C1B1F',
    letterSpacing: 0.1,
  },
});
