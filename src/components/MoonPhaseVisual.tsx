import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing } from 'react-native';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Fonts } from '../constants/typography';

interface MoonPhaseVisualProps {
  paksha?: 'SHUKLA' | 'KRISHNA' | string;
  tithiNumber?: number; // 1 to 30, or 1 to 15 within paksha
  size?: number; // Moon disc diameter (default 60)
  showBadge?: boolean;
}

export const MoonPhaseVisual: React.FC<MoonPhaseVisualProps> = ({
  paksha = 'KRISHNA',
  tithiNumber = 2,
  size = 60,
  showBadge = true,
}) => {
  const isShukla = String(paksha).toUpperCase().includes('SHUKLA');

  // Normalize tithi to 1-15 within current paksha
  let tithiInPaksha = tithiNumber;
  if (tithiNumber > 15) {
    tithiInPaksha = ((tithiNumber - 1) % 15) + 1;
  }
  tithiInPaksha = Math.max(1, Math.min(15, tithiInPaksha));

  // Astronomical phase angle from 0° (New Moon) to 360° (Next New Moon):
  // Astronomical phase angle from 0° (New Moon) to 360° (Next New Moon):
  // Shukla Paksha: 0° -> 180° (Waxing)
  // Krishna Paksha: 180° -> 360° (Waning)
  const angleDeg = isShukla
    ? (tithiInPaksha / 15.0) * 180.0
    : 180.0 + (tithiInPaksha / 15.0) * 180.0;

  const angleRad = (angleDeg * Math.PI) / 180.0;
  let illumination = Math.max(0.0, Math.min(1.0, (1.0 - Math.cos(angleRad)) / 2.0));

  // Explicit tithi tuning based on traditional Vedic Lunar Observation:
  // - Shukla 1 (Pratipada): exactly 1% visible crescent (99% dark)
  // - Shukla 2 (Dwitiya): exactly 5% visible crescent (95% dark)
  // - Shukla 15 (Purnima): 100% full moon
  // - Krishna 15 / Tithi 30 (Amavasya): 0% new moon
  // - Krishna 14 (Chaturdashi): 1% waning crescent (99% dark)
  // - Krishna 13 (Trayodashi): 5% waning crescent (95% dark)
  if (isShukla && tithiInPaksha === 1) illumination = 0.01;
  else if (isShukla && tithiInPaksha === 2) illumination = 0.05;
  else if (!isShukla && tithiInPaksha === 15) illumination = 0.00;
  else if (isShukla && tithiInPaksha === 15) illumination = 1.00;
  else if (!isShukla && tithiInPaksha === 14) illumination = 0.01;
  else if (!isShukla && tithiInPaksha === 13) illumination = 0.05;

  const isPurnima = (isShukla && tithiInPaksha === 15);
  const isAmavasya = (!isShukla && tithiInPaksha === 15);

  const illumPercent = isPurnima ? 100 : isAmavasya ? 0 : Math.round(illumination * 100);
  const phaseLabel = isPurnima
    ? 'Full Moon'
    : isAmavasya
    ? 'New Moon'
    : isShukla
    ? 'Waxing'
    : 'Waning';

  const badgeText = `${phaseLabel} • ${illumPercent}%`;

  // Continuous slow rotation for celestial orbital system (36s loop)
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const orbitLoop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 36000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    orbitLoop.start();
    return () => orbitLoop.stop();
  }, [spinAnim]);

  const spinInterpolation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Orbital dimensions based on moon size
  const moonR = size / 2;
  const outerOrbitSize = size + 36; // ~96px for size=60
  const dottedOrbitSize = size + 24; // ~84px
  const haloSize = size + 16; // ~76px
  const innerRingSize = size + 12; // ~72px

  // Dynamic SVG dual-arc terminator path calculation
  const getShadowPath = () => {
    if (isPurnima) return null;
    if (isAmavasya) {
      // Full circular dark mask
      return `M ${moonR} 0 A ${moonR} ${moonR} 0 1 0 ${moonR} ${size} A ${moonR} ${moonR} 0 1 0 ${moonR} 0 Z`;
    }

    const k = 2 * illumination - 1; // -1 at new, 0 at half, +1 at full
    const rx = Math.max(0.5, Math.abs(k) * moonR);

    if (isShukla) {
      // Waxing: illuminated crescent is on the right limb
      if (illumination < 0.5) {
        // Crescent: Shadow covers left half + curves into the right side up to (moonR + rx)
        // Arc 1: curves left (x = 0), Arc 2: curves right (x = moonR + rx)
        return `M ${moonR} 0 A ${moonR} ${moonR} 0 0 0 ${moonR} ${size} A ${rx} ${moonR} 0 0 0 ${moonR} 0 Z`;
      } else {
        // Gibbous: Shadow is a crescent on the far left (between x = 0 and x = moonR - rx)
        // Arc 1: curves left (x = 0), Arc 2: curves left (x = moonR - rx)
        return `M ${moonR} 0 A ${moonR} ${moonR} 0 0 0 ${moonR} ${size} A ${rx} ${moonR} 0 0 1 ${moonR} 0 Z`;
      }
    } else {
      // Waning: illuminated crescent is on the left limb
      if (illumination < 0.5) {
        // Crescent: Shadow covers right half + curves into the left side up to (moonR - rx)
        // Arc 1: curves right (x = size), Arc 2: curves left (x = moonR - rx)
        return `M ${moonR} 0 A ${moonR} ${moonR} 0 0 1 ${moonR} ${size} A ${rx} ${moonR} 0 0 1 ${moonR} 0 Z`;
      } else {
        // Gibbous: Shadow is a crescent on the far right (between x = moonR + rx and x = size)
        // Arc 1: curves right (x = size), Arc 2: curves right (x = moonR + rx)
        return `M ${moonR} 0 A ${moonR} ${moonR} 0 0 1 ${moonR} ${size} A ${rx} ${moonR} 0 0 0 ${moonR} 0 Z`;
      }
    }
  };

  const shadowPath = getShadowPath();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { width: outerOrbitSize, height: outerOrbitSize }]}>
        
        {/* 1. ROTATING CELESTIAL ORBIT SYSTEM (Outer Ring, Dotted Ring, Celestial ✦ Marker) */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.centeredLayer,
            { transform: [{ rotate: spinInterpolation }] },
          ]}
        >
          {/* Outer continuous circular orbit (96px) */}
          <View
            style={[
              styles.outerOrbitCircle,
              { width: outerOrbitSize, height: outerOrbitSize, borderRadius: outerOrbitSize / 2 },
            ]}
          />

          {/* Dotted concentric celestial orbit (84px) */}
          <View
            style={[
              styles.dottedOrbitCircle,
              { width: dottedOrbitSize, height: dottedOrbitSize, borderRadius: dottedOrbitSize / 2 },
            ]}
          />

          {/* Celestial Spark Marker (✦) attached to the outer orbit at ~45° */}
          <View
            style={[
              styles.starMarkerContainer,
              { width: outerOrbitSize, height: outerOrbitSize },
            ]}
          >
            <Text style={styles.celestialStar}>✦</Text>
          </View>
        </Animated.View>

        {/* 2. STATIC SOFT CHAMPAGNE ATMOSPHERIC HALO (76px, Deliberate Breathing Room) */}
        <View
          pointerEvents="none"
          style={[
            styles.haloContainer,
            {
              width: haloSize,
              height: haloSize,
              borderRadius: haloSize / 2,
              opacity: isAmavasya ? 0.2 : isPurnima ? 0.95 : 0.65,
            },
          ]}
        >
          <Svg width={haloSize} height={haloSize}>
            <Defs>
              <RadialGradient id="champagneHalo" cx="50%" cy="50%" r="50%">
                <Stop offset="55%" stopColor="#FBF1D5" stopOpacity="0.22" />
                <Stop offset="82%" stopColor="#DFB059" stopOpacity="0.10" />
                <Stop offset="100%" stopColor="#DFB059" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx={haloSize / 2} cy={haloSize / 2} r={haloSize / 2} fill="url(#champagneHalo)" />
          </Svg>
        </View>

        {/* 3. STATIC INNER ORBIT RING (72px) */}
        <View
          pointerEvents="none"
          style={[
            styles.innerRingCircle,
            { width: innerRingSize, height: innerRingSize, borderRadius: innerRingSize / 2 },
          ]}
        />

        {/* 4. STATIC REALISTIC PHOTOGRAPHIC MOON (60px, White/Gray Cratering) */}
        <View
          style={[
            styles.moonDiscContainer,
            {
              width: size,
              height: size,
              borderRadius: moonR,
            },
          ]}
        >
          <Image
            source={require('../../assets/moon_real.png')}
            style={{ width: size, height: size, borderRadius: moonR }}
            resizeMode="cover"
          />

          {/* Dynamic Astronomical Terminator Shadow Mask */}
          {shadowPath && (
            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
              <Svg width={size} height={size}>
                <Path d={shadowPath} fill="rgba(24, 7, 11, 0.88)" />
              </Svg>
            </View>
          )}

          {/* Subtle atmospheric edge glow for Amavasya so moon position is visible */}
          {isAmavasya && (
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                {
                  borderRadius: moonR,
                  borderWidth: 1,
                  borderColor: 'rgba(223, 176, 89, 0.35)',
                },
              ]}
            />
          )}
        </View>

      </View>

      {/* Telemetry Badge: WANING • 96% (Strict Single Line) */}
      {showBadge && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText} numberOfLines={1}>
            {badgeText}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centeredLayer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerOrbitCircle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.28)',
  },
  dottedOrbitCircle: {
    position: 'absolute',
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: 'rgba(223, 176, 89, 0.42)',
  },
  starMarkerContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  celestialStar: {
    position: 'absolute',
    top: -5,
    right: 14,
    fontSize: 10,
    color: '#DFB059',
  },
  haloContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRingCircle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.24)',
  },
  moonDiscContainer: {
    overflow: 'hidden',
    backgroundColor: '#150608',
    elevation: 6,
    shadowColor: '#DFB059',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  badgeContainer: {
    marginTop: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.5)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  badgeText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 8.5,
    color: '#DFB059',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
