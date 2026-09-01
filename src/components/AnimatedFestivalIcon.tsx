import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface AnimatedFestivalIconProps {
  text: string;
  style?: any;
  badgeStyle?: any;
}

/**
 * Determines the micro-animation style based on festival emoji/type:
 * - SWAY: Snake (🐍), Flag (🚩), Hanuman (🐒), Leaf (🌿) -> Smooth side-to-side oscillation
 * - PULSE: Gau Mata (🐄), Cooking (🍲), Flower (🌸), Diya (🪔), Trishul (🔱), Moon (🌕/🌑) -> Breathing scale & glow
 */
export const AnimatedFestivalIcon: React.FC<AnimatedFestivalIconProps> = ({ text, style, badgeStyle }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  // Extract first emoji if present
  const firstChar = Array.from(text)[0] || '';
  const isSway = ['🐍', '🚩', '🐒', '🌿'].includes(firstChar);

  useEffect(() => {
    let animation: Animated.CompositeAnimation;

    if (isSway) {
      // Smooth continuous pendulum sway loop (-10 deg to +10 deg)
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: -1,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
    } else {
      // Gentle breathing pulse loop (scale 1.0 -> 1.15 -> 1.0)
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 1400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    }

    animation.start();

    return () => animation.stop();
  }, [animValue, isSway]);

  // Interpolations for Native Driver
  const rotateInterpolation = animValue.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  const scaleInterpolation = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.14],
  });

  const opacityInterpolation = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  const animatedTransformStyle = isSway
    ? { transform: [{ rotate: rotateInterpolation }] }
    : { transform: [{ scale: scaleInterpolation }], opacity: opacityInterpolation };

  return (
    <View style={badgeStyle}>
      <Animated.View style={animatedTransformStyle}>
        <Text style={style} numberOfLines={1}>
          {text}
        </Text>
      </Animated.View>
    </View>
  );
};
