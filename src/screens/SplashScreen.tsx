import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from 'react-native';
import { Colors } from '../theme/colors';
import { Fonts } from '../constants/typography';
import { CelestialBackground } from '../components/CelestialBackground';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width } = Dimensions.get('window');

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    // 1. Subtle celestial pulse on Surya emblem
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // 3. Auto-advance after 2.4 seconds
    const timer = setTimeout(() => {
      triggerFinish();
    }, 2400);

    return () => {
      clearTimeout(timer);
      pulseLoop.stop();
    };
  }, [fadeAnim, scaleAnim, pulseAnim]);

  const triggerFinish = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onFinish();
    });
  };

  return (
    <TouchableWithoutFeedback onPress={triggerFinish}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F5EE" />

        {/* Signature Celestial Dotted Stipple Background */}
        <CelestialBackground />

        {/* Centered Brand Emblem + Logo */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Sacred Vedic Invocation */}
          <View style={styles.invocationPill}>
            <Text style={styles.omSymbol}>ॐ</Text>
            <Text style={styles.invocationText}>श्री गणेशाय नमः</Text>
            <Text style={styles.omSymbol}>ॐ</Text>
          </View>

          {/* Official Royal Surya Emblem Symbol */}
          <Animated.View style={[styles.emblemContainer, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.emblemRingOuter}>
              <Image
                source={require('../../assets/surya_emblem_clean.png')}
                style={styles.emblemImage}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          {/* Brand Identity Typography: SoulRise Panchang Logo */}
          <Text style={styles.brandTitle}>SoulRise Panchang</Text>
          <Text style={styles.brandTagline}>SACRED SOLAR-LUNAR ALMANAC</Text>

          {/* Ornamental Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerStar}>✦ ✧ ✦</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.subtext}>
            Prashanta Muhurta Flow • Vedic Astrology • Dharma Reminders
          </Text>
        </Animated.View>

        {/* Footer Sacred Shloka */}
        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <Text style={styles.footerShloka}>
            असतो मा सद्गमय • तमसो मा ज्योतिर्गमय
          </Text>
          <Text style={styles.footerSub}>
            Tap anywhere to proceed
          </Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  invocationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(223, 176, 89, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.45)',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 24,
  },
  omSymbol: {
    fontSize: 15,
    color: '#B88428',
    marginHorizontal: 6,
  },
  invocationText: {
    fontSize: 13,
    color: '#2B0E14',
    fontFamily: Fonts.rozhaRegular,
    letterSpacing: 1.2,
  },
  emblemContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  emblemRingOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#2B0E14',
    borderWidth: 2.5,
    borderColor: '#DFB059',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  emblemImage: {
    width: 132,
    height: 132,
    borderRadius: 66,
  },
  brandTitle: {
    fontSize: 34,
    fontFamily: Fonts.cormorantBold,
    color: '#2B0E14',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 6,
  },
  brandTagline: {
    fontSize: 11,
    fontFamily: Fonts.jakartaSemiBold,
    color: '#B88428',
    letterSpacing: 3.2,
    textAlign: 'center',
    marginBottom: 14,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 180,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(223, 176, 89, 0.4)',
  },
  dividerStar: {
    fontSize: 11,
    color: '#DFB059',
    marginHorizontal: 10,
    letterSpacing: 2,
  },
  subtext: {
    fontSize: 12,
    fontFamily: Fonts.jakartaRegular,
    color: '#7D6A68',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 36,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerShloka: {
    fontSize: 12,
    fontFamily: Fonts.rozhaRegular,
    color: '#7D6A68',
    textAlign: 'center',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  footerSub: {
    fontSize: 10,
    fontFamily: Fonts.jakartaMedium,
    color: '#A99895',
    letterSpacing: 0.6,
  },
});
