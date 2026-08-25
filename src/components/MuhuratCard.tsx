import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { MuhuratTiming } from '../types/panchang';
import { useLanguage } from '../context/LanguageContext';

interface MuhuratCardProps {
  auspicious: MuhuratTiming[];
  inauspicious: MuhuratTiming[];
}

export const MuhuratCard: React.FC<MuhuratCardProps> = ({ auspicious, inauspicious }) => {
  const { language, t } = useLanguage();
  const showHindiScript = language === 'hi' || language === 'hinglish';

  return (
    <View style={styles.card}>
      <Text style={styles.cardHeaderTitle} numberOfLines={1} adjustsFontSizeToFit>✨ {t('auspiciousTimingsHeader')}</Text>

      {/* Auspicious Section */}
      <Text style={styles.sectionSubtitle}>{t('auspiciousSection')}</Text>
      {auspicious.map((item, index) => (
        <View key={index} style={[styles.muhuratItem, styles.auspiciousBorder]}>
          <View style={styles.muhuratTop}>
            <Text style={styles.muhuratName} numberOfLines={1} adjustsFontSizeToFit>
              {item.name} {showHindiScript && item.hindiName ? `(${item.hindiName})` : ''}
            </Text>
            <Text style={styles.auspiciousTime}>{item.startTime} - {item.endTime}</Text>
          </View>
          <Text style={styles.muhuratDesc}>{item.description}</Text>
        </View>
      ))}

      <View style={styles.divider} />

      {/* Inauspicious Section */}
      <Text style={styles.sectionSubtitleRed}>{t('inauspiciousSection')}</Text>
      {inauspicious.map((item, index) => (
        <View key={index} style={[styles.muhuratItem, styles.inauspiciousBorder]}>
          <View style={styles.muhuratTop}>
            <Text style={styles.muhuratNameRed} numberOfLines={1} adjustsFontSizeToFit>
              {item.name} {showHindiScript && item.hindiName ? `(${item.hindiName})` : ''}
            </Text>
            <Text style={styles.inauspiciousTime}>{item.startTime} - {item.endTime}</Text>
          </View>
          <Text style={styles.muhuratDesc}>{item.description}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.auspiciousGreen,
    marginBottom: 8,
    marginTop: 4,
  },
  sectionSubtitleRed: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.inauspiciousRed,
    marginBottom: 8,
    marginTop: 4,
  },
  muhuratItem: {
    backgroundColor: '#FAF5EE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  auspiciousBorder: {
    borderLeftColor: Colors.auspiciousGreen,
  },
  inauspiciousBorder: {
    borderLeftColor: Colors.inauspiciousRed,
  },
  muhuratTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  muhuratName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  muhuratNameRed: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.inauspiciousRed,
    flex: 1,
    marginRight: 8,
  },
  auspiciousTime: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.auspiciousGreen,
  },
  inauspiciousTime: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.inauspiciousRed,
  },
  muhuratDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0E0D0',
    marginVertical: 8,
  },
});
