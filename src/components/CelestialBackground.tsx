import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Pattern, Circle, Rect } from 'react-native-svg';

interface CelestialBackgroundProps {
  id?: string;
}

export const CelestialBackground: React.FC<CelestialBackgroundProps> = ({ id = 'celestialDots' }) => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <Pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
            <Circle cx="8" cy="8" r="1.05" fill="#C8BAA8" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="#F8F5EE" />
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
};
