import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { PanchangDayData } from '../types/panchang';

interface PanchangLimbCardProps {
  panchang: PanchangDayData;
}

export const PanchangLimbCard: React.FC<PanchangLimbCardProps> = ({ panchang }) => {
  const { tithi, nakshatra, yoga, karana, vaara } = panchang;

  return (
    <View style={styles.card}>
      <Text style={styles.cardHeaderTitle}>🪔 Panchangam (5 Limbs)</Text>

      {/* 1. Tithi */}
      <View style={styles.limbRow}>
        <View style={styles.limbLeft}>
          <Text style={styles.limbIcon}>🌑</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.limbLabel}>Tithi (तिथि)</Text>
            <Text style={styles.limbValueBold}>{tithi.name} ({tithi.hindiName})</Text>
            <Text style={styles.limbSub}>{tithi.pakshaHindi}</Text>
            <View style={styles.timingPillRow}>
              <View style={styles.startPill}>
                <Text style={styles.startPillText}>Starts: {tithi.startTimeFormatted || 'Aug 25, 06:22 AM IST'}</Text>
              </View>
              <View style={styles.endPill}>
                <Text style={styles.endPillText}>Ends: {tithi.endTimeFormatted}</Text>
              </View>
            </View>
          </View>
        </View>
        {tithi.isSpecial && (
          <View style={styles.specialBadge}>
            <Text style={styles.specialBadgeText}>{tithi.specialTag || 'Vrat'}</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {/* 2. Nakshatra */}
      <View style={styles.limbRow}>
        <View style={styles.limbLeft}>
          <Text style={styles.limbIcon}>⭐</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.limbLabel}>Nakshatra (नक्षत्र)</Text>
            <Text style={styles.limbValueBold}>{nakshatra.name} ({nakshatra.hindiName})</Text>
            <Text style={styles.limbSub}>Ruler: {nakshatra.ruler} • Deity: {nakshatra.deity}</Text>
            <View style={styles.timingPillRow}>
              <View style={styles.startPill}>
                <Text style={styles.startPillText}>Starts: {nakshatra.startTimeFormatted || 'Aug 25, 04:15 AM IST'}</Text>
              </View>
              <View style={styles.endPill}>
                <Text style={styles.endPillText}>Ends: {nakshatra.endTimeFormatted}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* 3. Yoga */}
      <View style={styles.limbRow}>
        <View style={styles.limbLeft}>
          <Text style={styles.limbIcon}>☸️</Text>
          <View>
            <Text style={styles.limbLabel}>Yoga (योग)</Text>
            <Text style={styles.limbValueBold}>{yoga.name} ({yoga.hindiName})</Text>
            <Text style={styles.limbSub}>{yoga.endTimeFormatted}</Text>
          </View>
        </View>
        <View style={[styles.statusTag, { backgroundColor: yoga.isAuspicious ? Colors.auspiciousGreen : Colors.inauspiciousRed }]}>
          <Text style={styles.statusTagText}>{yoga.isAuspicious ? 'Auspicious' : 'Inauspicious'}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* 4. Karana */}
      <View style={styles.limbRow}>
        <View style={styles.limbLeft}>
          <Text style={styles.limbIcon}>⏳</Text>
          <View>
            <Text style={styles.limbLabel}>Karana (करण)</Text>
            <Text style={styles.limbValueBold}>{karana.name} ({karana.hindiName})</Text>
            <Text style={styles.limbSub}>{karana.category} • {karana.endTimeFormatted}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* 5. Vaara */}
      <View style={styles.limbRow}>
        <View style={styles.limbLeft}>
          <Text style={styles.limbIcon}>☀️</Text>
          <View>
            <Text style={styles.limbLabel}>Vaara (वार)</Text>
            <Text style={styles.limbValueBold}>{vaara.name} ({vaara.hindiName})</Text>
            <Text style={styles.limbSub}>Planet: {vaara.rulingPlanet} • Deity: {vaara.deity}</Text>
          </View>
        </View>
      </View>
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
  limbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  limbLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  limbIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  limbLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  limbValueBold: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  limbSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 4,
  },
  specialBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accentGold,
  },
  specialBadgeText: {
    color: Colors.maroon,
    fontWeight: 'bold',
    fontSize: 11,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusTagText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 10,
  },
  timingPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
    flexWrap: 'wrap',
  },
  startPill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  startPillText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  endPill: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  endPillText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#C62828',
  },
});
