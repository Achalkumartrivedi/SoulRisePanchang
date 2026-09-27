import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle, Path, G } from 'react-native-svg';

interface MoonPhaseVisualProps {
  paksha?: 'SHUKLA' | 'KRISHNA' | string;
  tithiNumber?: number; // 1 to 30, or 1 to 15 within paksha
  size?: number;
  showBadge?: boolean;
}

export const MoonPhaseVisual: React.FC<MoonPhaseVisualProps> = ({
  paksha = 'KRISHNA',
  tithiNumber = 2,
  size = 68,
  showBadge = false,
}) => {
  const isShukla = String(paksha).toUpperCase().includes('SHUKLA');

  // Normalize tithi to 1-15 within the current paksha
  // If tithiNumber is 1..30 (e.g., 17 for Krishna Dwitiya), modulo to 1..15
  let tithiInPaksha = tithiNumber;
  if (tithiNumber > 15) {
    tithiInPaksha = ((tithiNumber - 1) % 15) + 1;
  }
  tithiInPaksha = Math.max(1, Math.min(15, tithiInPaksha));

  // Astronomical phase angle from 0° (New Moon) to 360° (Next New Moon):
  // Shukla Paksha: 0° -> 180° (Waxing / Growing, illuminated limb on RIGHT)
  // Krishna Paksha: 180° -> 360° (Waning / Shrinking, illuminated limb on LEFT)
  const angleDeg = isShukla
    ? (tithiInPaksha / 15.0) * 180.0
    : 180.0 + (tithiInPaksha / 15.0) * 180.0;

  const angleRad = (angleDeg * Math.PI) / 180.0;

  // Illumination fraction of lunar disc: (1 - cos(angle)) / 2
  const illumination = Math.max(0.0, Math.min(1.0, (1.0 - Math.cos(angleRad)) / 2.0));

  const isPurnima = (isShukla && tithiInPaksha === 15) || illumination >= 0.985;
  const isAmavasya = (!isShukla && tithiInPaksha === 15) || illumination <= 0.015;

  const R = 40.0;
  // rx is the horizontal semi-axis of the elliptical terminator
  const rx = Math.max(0.1, Number((R * Math.abs(Math.cos(angleRad))).toFixed(1)));

  // SVG Path generation for both Waxing (Shukla) and Waning (Krishna)
  const getMoonPath = (): string | null => {
    if (isPurnima || isAmavasya) return null;

    if (isShukla) {
      // 1. WAXING (Shukla Paksha):
      // Outer arc is the RIGHT perimeter: from (50, 10) clockwise to (50, 90)
      // Terminator returns from (50, 90) to (50, 10):
      // - If Crescent (illumination < 0.5): curves RIGHT (sweep=0)
      // - If Gibbous (illumination >= 0.5): curves LEFT (sweep=1)
      const sweep = illumination < 0.5 ? 0 : 1;
      return `M 50 10 A ${R} ${R} 0 0 1 50 90 A ${rx} ${R} 0 0 ${sweep} 50 10 Z`;
    } else {
      // 2. WANING (Krishna Paksha):
      // Outer arc is the LEFT perimeter: from (50, 10) counter-clockwise to (50, 90)
      // Terminator returns from (50, 90) to (50, 10):
      // - If Gibbous (illumination >= 0.5, right after Purnima): curves RIGHT (sweep=0)
      // - If Crescent (illumination < 0.5, nearing Amavasya): curves LEFT (sweep=1)
      const sweep = illumination < 0.5 ? 1 : 0;
      return `M 50 10 A ${R} ${R} 0 0 0 50 90 A ${rx} ${R} 0 0 ${sweep} 50 10 Z`;
    }
  };

  const moonPath = getMoonPath();
  const illumPercent = Math.round(illumination * 100);
  const phaseLabel = isPurnima
    ? 'Full Moon'
    : isAmavasya
    ? 'New Moon'
    : isShukla
    ? 'Waxing'
    : 'Waning';

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { width: size, height: size }]}>
        {/* Tier 3 & 2: Radiant Ethereal Golden Corona & Photon Halo */}
        <View
          style={[
            styles.glowCorona,
            {
              width: size * 0.95,
              height: size * 0.95,
              borderRadius: (size * 0.95) / 2,
            },
          ]}
        />

        {/* Astrolabe Circular Dashed Compass Ring (from Royal Heritage Stitch spec) */}
        <View
          style={[
            styles.astrolabeRing,
            {
              width: size + 8,
              height: size + 8,
              borderRadius: (size + 8) / 2,
            },
          ]}
        />

        <Svg width={size} height={size} viewBox="0 0 100 100" style={styles.svg}>
          <Defs>
            {/* Primary Royal Heritage Lunar Gradient */}
            <RadialGradient id="moonGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#FFDEA8" />
              <Stop offset="55%" stopColor="#FFB800" />
              <Stop offset="100%" stopColor="#7C5800" />
            </RadialGradient>

            {/* Dark Velvet Obsidian Substrate */}
            <RadialGradient id="darkDisc" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#37151C" />
              <Stop offset="85%" stopColor="#1F040A" />
              <Stop offset="100%" stopColor="#150206" />
            </RadialGradient>
          </Defs>

          {/* Dark Lunar Body Disc */}
          <Circle cx="50" cy="50" r="40" fill="url(#darkDisc)" />

          {/* Outer Specular Gilded Rim */}
          <Circle
            cx="50"
            cy="50"
            r="41.5"
            stroke="#FFDEA8"
            strokeOpacity="0.32"
            strokeWidth="1.2"
          />

          {/* Dynamic Illuminated Lunar Phase */}
          {isPurnima ? (
            // Full Moon (Purnima): fully illuminated glowing sphere
            <Circle cx="50" cy="50" r="40" fill="url(#moonGlow)" />
          ) : isAmavasya ? (
            // New Moon (Amavasya): dark disc with fine golden perimeter aura
            <Circle
              cx="50"
              cy="50"
              r="40"
              stroke="#FFB800"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              fill="none"
            />
          ) : moonPath ? (
            // Active Waxing or Waning Segment
            <Path d={moonPath} fill="url(#moonGlow)" />
          ) : null}

          {/* Dynamic Lunar Craters (Adjusted based on Waxing vs Waning visibility) */}
          <G>
            {/* Central stable mare */}
            <Circle cx="50" cy="48" r="3.5" fill="#FFE0B2" fillOpacity={isAmavasya ? 0.12 : 0.55} />
            
            {/* Right-hemisphere craters (prominent during Waxing) */}
            <Circle
              cx="64"
              cy="38"
              r="2.5"
              fill="#FFE0B2"
              fillOpacity={isShukla || isPurnima ? 0.5 : 0.18}
            />
            <Circle
              cx="60"
              cy="62"
              r="3.2"
              fill="#FFE0B2"
              fillOpacity={isShukla || isPurnima ? 0.55 : 0.18}
            />

            {/* Left-hemisphere craters (prominent during Waning) */}
            <Circle
              cx="36"
              cy="38"
              r="2.5"
              fill="#FFE0B2"
              fillOpacity={!isShukla || isPurnima ? 0.5 : 0.18}
            />
            <Circle
              cx="40"
              cy="62"
              r="3.2"
              fill="#FFE0B2"
              fillOpacity={!isShukla || isPurnima ? 0.55 : 0.18}
            />
            <Circle
              cx="32"
              cy="52"
              r="1.8"
              fill="#FFE0B2"
              fillOpacity={!isShukla || isPurnima ? 0.45 : 0.15}
            />
          </G>
        </Svg>
      </View>

      {/* Illumination & Phase Telemetry Tag */}
      {(showBadge || true) && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>
            {phaseLabel} • {illumPercent}%
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
  glowCorona: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 184, 0, 0.22)',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 18,
    elevation: 10,
  },
  astrolabeRing: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 222, 168, 0.35)',
  },
  svg: {
    zIndex: 2,
  },
  badgeContainer: {
    marginTop: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(67, 31, 38, 0.8)',
    borderWidth: 0.8,
    borderColor: 'rgba(255, 220, 161, 0.25)',
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFDCA1',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
