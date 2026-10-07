import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Fonts } from '../constants/typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onSkip: () => void;
}

const { width } = Dimensions.get('window');

const FeatureItem = ({
  icon,
  title,
  hindiTitle,
  description,
  accentColor
}: {
  icon: string;
  title: string;
  hindiTitle: string;
  description: string;
  accentColor: string;
}) => (
  <View style={styles.featureCard}>
    <View style={[styles.featureIconBadge, { backgroundColor: `${accentColor}15` }]}>
      <Text style={styles.featureIconText}>{icon}</Text>
    </View>
    <View style={styles.featureTextCol}>
      <View style={styles.featureTitleRow}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureHindiTitle}>{hindiTitle}</Text>
      </View>
      <Text style={styles.featureDesc}>{description}</Text>
    </View>
  </View>
);

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onSignIn,
  onSkip
}) => {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 10, 24);
  const bottomPadding = Math.max(insets.bottom + 16, 28);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5EE" />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: topPadding, paddingBottom: bottomPadding }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Sacred Masthead Crest */}
        <View style={styles.crestHeader}>
          <View style={styles.sunBadge}>
            <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={5} fill="#DFB059" />
              <Path
                d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"
                stroke="#2B0E14"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
          </View>
          <Text style={styles.brandTitle}>SoulRise Panchang</Text>
          <Text style={styles.brandSubtitle}>SACRED SOLAR-LUNAR ALMANAC</Text>
        </View>

        {/* Hero Card Banner */}
        <View style={styles.heroCard}>
          <Text style={styles.heroSanskrit}>कालस्य गतिः सूक्ष्मा</Text>
          <Text style={styles.heroMainTitle}>
            Experience the Sacred Rhythm of Time
          </Text>
          <Text style={styles.heroHindiTitle}>
            सनातन काल गणना एवं मुहूर्त का प्रामाणिक दर्पण
          </Text>
          <Text style={styles.heroDesc}>
            Accurate high-precision Vedic calculations tailored to your exact geographical coordinates, planetary positions, and lunar phases.
          </Text>
        </View>

        {/* Key Features Overview */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionHeaderTitle}>SACRED PILLARS • मुख्य विशेषताएं</Text>

          <FeatureItem
            icon="☀️"
            title="Vedic Panchang"
            hindiTitle="दैनिक पंचांग"
            description="Precise Tithi, Nakshatra, Yoga, Karana, and real-time Day & Night Choghadiya intervals."
            accentColor="#DFB059"
          />

          <FeatureItem
            icon="⏳"
            title="Prashanta Muhurats"
            hindiTitle="शुभ मुहूर्त एवं काल"
            description="Auspicious Abhijit, Brahma Muhurat, Vijay, and cautious Rahu Kaal & Yamaganda windows."
            accentColor="#237B4B"
          />

          <FeatureItem
            icon="🌌"
            title="Kundli & Horoscope"
            hindiTitle="जन्म कुंडली एवं राशिफल"
            description="Authentic North Indian birth charts, Navamsha, planetary transits, and daily rashiphal."
            accentColor="#7C3AED"
          />

          <FeatureItem
            icon="🔔"
            title="Dharma Reminders"
            hindiTitle="स्मार्ट व्रत स्मरण"
            description="Timely alerts for Ekadashi, Purnima, Pradosh, and your personal spiritual observances."
            accentColor="#C62828"
          />
        </View>

        {/* Action Controls */}
        <View style={styles.actionsContainer}>
          {/* Primary Action Button: Get Started */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onGetStarted}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>
              Choose Language & Get Started ➔
            </Text>
            <Text style={styles.primaryBtnSubText}>
              भाषा चुनें और आरंभ करें
            </Text>
          </TouchableOpacity>

          {/* Secondary Action Button: Sign In */}
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onSignIn}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryBtnText}>
              Sign In to Existing Account (खाता लॉगिन)
            </Text>
          </TouchableOpacity>

          {/* Tertiary Action Link: Guest Mode */}
          <TouchableOpacity
            style={styles.guestLink}
            onPress={onSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.guestLinkText}>
              Continue as Guest (अतिथि के रूप में जारी रखें) ➔
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          SoulRise Panchang respects your spiritual privacy. All calculations run locally on your device.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  crestHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sunBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#DFB059',
    marginBottom: 10,
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  brandTitle: {
    fontSize: 28,
    fontFamily: Fonts.cormorantBold,
    color: '#2B0E14',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 10,
    fontFamily: Fonts.jakartaSemiBold,
    color: '#DFB059',
    letterSpacing: 2.5,
    textAlign: 'center',
    marginTop: 2,
  },
  heroCard: {
    width: '100%',
    backgroundColor: '#2B0E14',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DFB059',
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  heroSanskrit: {
    fontSize: 12,
    fontFamily: Fonts.rozhaRegular,
    color: '#DFB059',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  heroMainTitle: {
    fontSize: 20,
    fontFamily: Fonts.cormorantBold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 26,
  },
  heroHindiTitle: {
    fontSize: 13,
    fontFamily: Fonts.rozhaRegular,
    color: '#F5DE9C',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroDesc: {
    fontSize: 12,
    fontFamily: Fonts.jakartaRegular,
    color: '#DCCECB',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 6,
  },
  featuresSection: {
    width: '100%',
    marginBottom: 24,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontFamily: Fonts.jakartaSemiBold,
    color: '#7D6A68',
    letterSpacing: 1.5,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EADBCE',
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureIconText: {
    fontSize: 22,
  },
  featureTextCol: {
    flex: 1,
  },
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: Fonts.jakartaBold,
    color: '#2B0E14',
  },
  featureHindiTitle: {
    fontSize: 11,
    fontFamily: Fonts.rozhaRegular,
    color: '#DFB059',
  },
  featureDesc: {
    fontSize: 11,
    fontFamily: Fonts.jakartaRegular,
    color: '#665554',
    lineHeight: 16,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#2B0E14',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#DFB059',
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 12,
  },
  primaryBtnText: {
    fontSize: 15,
    fontFamily: Fonts.jakartaBold,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  primaryBtnSubText: {
    fontSize: 11,
    fontFamily: Fonts.rozhaRegular,
    color: '#DFB059',
    marginTop: 2,
  },
  secondaryBtn: {
    width: '100%',
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#2B0E14',
    marginBottom: 14,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontFamily: Fonts.jakartaSemiBold,
    color: '#2B0E14',
  },
  guestLink: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  guestLinkText: {
    fontSize: 12,
    fontFamily: Fonts.jakartaSemiBold,
    color: '#7D6A68',
    textDecorationLine: 'underline',
  },
  footerNote: {
    fontSize: 10,
    fontFamily: Fonts.jakartaRegular,
    color: '#9C8885',
    textAlign: 'center',
    lineHeight: 14,
    marginTop: 10,
    paddingHorizontal: 16,
  },
});
