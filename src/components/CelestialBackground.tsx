import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Pattern, Circle, Rect } from 'react-native-svg';

export const CelestialBackground: React.FC = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern id="celestialDots" width="16" height="16" patternUnits="userSpaceOnUse">
            <Circle cx="8" cy="8" r="0.95" fill="#D3C7B8" />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="#F8F5EE" />
        <Rect width="100%" height="100%" fill="url(#celestialDots)" />
      </Svg>
    </View>
  );
};
