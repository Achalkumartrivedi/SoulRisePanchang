import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle, Path, G } from 'react-native-svg';

interface MoonPhaseVisualProps {
  paksha?: 'SHUKLA' | 'KRISHNA' | string;
  tithiNumber?: number; // 1 to 15
  size?: number;
}

export const MoonPhaseVisual: React.FC<MoonPhaseVisualProps> = ({
  paksha = 'KRISHNA',
  tithiNumber = 2,
  size = 64,
}) => {
  const isShukla = String(paksha).toUpperCase().includes('SHUKLA');
  const isPurnima = isShukla && tithiNumber === 15;
  const isAmavasya = !isShukla && tithiNumber === 15;

  // Compute smooth terminator path based on lunar day (1-15) and paksha
  const getMoonPath = () => {
    if (isPurnima || isAmavasya) return null;

    // For Dwitiya (Day 2) specifically matching Stitch & Royal Heritage reference
    if (tithiNumber === 2 && !isShukla) {
      return 'M50 10C62 20 68 35 68 50C68 65 62 80 50 90C72.09 90 90 72.09 90 50C90 27.91 72.09 10 50 10Z';
    }

    // Dynamic terminator calculation for all 30 tithis
    // Normalized illumination phase 0 (new) to 1 (full)
    let phase = 0.5;
    if (isShukla) {
      phase = Math.max(0.08, Math.min(0.95, tithiNumber / 15));
    } else {
      phase = Math.max(0.08, Math.min(0.95, (15 - tithiNumber) / 15));
    }

    // Midpoint X of the terminator at the equator (Y=50)
    // When phase is 0.1 (crescent), midX ~ 75. When phase is 0.5 (quarter), midX = 50. When phase is 0.9 (gibbous), midX ~ 25.
    const midX = 50 + 40 * (1 - 2 * phase);
    const cpX1 = 50 + (midX - 50) * 0.55;
    const cpX2 = 50 + (midX - 50) * 0.95;

    return `M50 10 C${cpX1.toFixed(1)} 20 ${cpX2.toFixed(1)} 35 ${midX.toFixed(1)} 50 C${cpX2.toFixed(1)} 65 ${cpX1.toFixed(1)} 80 50 90 C72.09 90 90 72.09 90 50 C90 27.91 72.09 10 50 10 Z`;
  };

  const moonPath = getMoonPath();

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Golden Ethereal Glow Halo */}
      <View style={[styles.glowHalo, { width: size * 0.88, height: size * 0.88, borderRadius: size / 2 }]} />

      <Svg width={size} height={size} viewBox="0 0 100 100" style={styles.svg}>
        <Defs>
          {/* Radial Gradient matching Stitch specification */}
          <RadialGradient id="moonGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#FFDEA8" />
            <Stop offset="60%" stopColor="#FFB800" />
            <Stop offset="100%" stopColor="#7C5800" />
          </RadialGradient>
          <RadialGradient id="darkDisc" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#37151C" />
            <Stop offset="90%" stopColor="#21040B" />
          </RadialGradient>
        </Defs>

        {/* Dark Lunar Body Disc */}
        <Circle cx="50" cy="50" r="40" fill="url(#darkDisc)" />

        {/* Outer Circular Rim */}
        <Circle cx="50" cy="50" r="42" stroke="#FFDEA8" strokeOpacity="0.28" strokeWidth="1.5" />

        {/* Illuminated Lunar Phase */}
        {isPurnima ? (
          // Purnima: Full illuminated golden sphere
          <Circle cx="50" cy="50" r="40" fill="url(#moonGlow)" />
        ) : isAmavasya ? (
          // Amavasya: Dark new moon with glowing golden perimeter aura
          <Circle cx="50" cy="50" r="40" stroke="#FFB800" strokeOpacity="0.45" strokeWidth="1.5" fill="none" />
        ) : moonPath ? (
          // Crescent / Gibbous illuminated segment
          <Path d={moonPath} fill="url(#moonGlow)" />
        ) : null}

        {/* Lunar Surface Craters */}
        <G>
          <Circle cx="48" cy="48" r="4" fill="#FFE0B2" fillOpacity={isAmavasya ? 0.15 : 0.6} />
          <Circle cx="64" cy="38" r="2.5" fill="#FFE0B2" fillOpacity={isAmavasya ? 0.1 : 0.4} />
          <Circle cx="60" cy="62" r="3" fill="#FFE0B2" fillOpacity={isAmavasya ? 0.12 : 0.5} />
          <Circle cx="36" cy="56" r="2" fill="#FFE0B2" fillOpacity={0.2} />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowHalo: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 184, 0, 0.22)',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 8,
  },
  svg: {
    zIndex: 2,
  },
});
