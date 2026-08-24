import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { MuhuratTiming } from '../types/panchang';

interface MuhuratCardProps {
  auspicious: MuhuratTiming[];
  inauspicious: MuhuratTiming[];
}

export const MuhuratCard: React.FC<MuhuratCardProps> = ({ auspicious, inauspicious }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardHeaderTitle}>✨ Auspicious & Inauspicious Timings</Text>

      {/* Auspicious Section */}
      <Text style={styles.sectionSubtitle}>🌟 Auspicious Muhurats (शुभ समय)</Text>
      {auspicious.map((item, index) => (
        <View key={index} style={[styles.muhuratItem, styles.auspiciousBorder]}>
          <View style={styles.muhuratTop}>
            <Text style={styles.muhuratName}>{item.name} ({item.hindiName})</Text>
            <Text style={styles.auspiciousTime}>{item.startTime} - {item.endTime}</Text>
          </View>
          <Text style={styles.muhuratDesc}>{item.description}</Text>
        </View>
      ))}

      <View style={styles.divider} />

      {/* Inauspicious Section */}
      <Text style={styles.sectionSubtitleRed}>⚠️ Inauspicious Timings (अशुभ समय)</Text>
      {inauspicious.map((item, index) => (
        <View key={index} style={[styles.muhuratItem, styles.inauspiciousBorder]}>
          <View style={styles.muhuratTop}>
            <Text style={styles.muhuratNameRed}>{item.name} ({item.hindiName})</Text>
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
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.auspiciousGreen,
    marginTop: 4,
    marginBottom: 8,
  },
  sectionSubtitleRed: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.inauspiciousRed,
    marginTop: 4,
    marginBottom: 8,
  },
  muhuratItem: {
    backgroundColor: Colors.creamBg,
    padding: 10,
    borderRadius: 10,
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
  },
  muhuratName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  muhuratNameRed: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.inauspiciousRed,
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
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 10,
  },
});
