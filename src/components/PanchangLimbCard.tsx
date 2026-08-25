import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { PanchangDayData } from '../types/panchang';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedTithi, getLocalizedPakshaName } from '../i18n/vedicTerms';

interface PanchangLimbCardProps {
  panchang: PanchangDayData;
}

export const PanchangLimbCard: React.FC<PanchangLimbCardProps> = ({ panchang }) => {
  const { language, t } = useLanguage();
  const { tithi, nakshatra, yoga, karana, vaara } = panchang;

  const locTithi = getLocalizedTithi(tithi.number || 13, language);
  const locPaksha = getLocalizedPakshaName(tithi.paksha === 'KRISHNA' ? 'KRISHNA' : 'SHUKLA', language);

  const showHindiScript = language === 'hi' || language === 'hinglish';

  return (
    <View style={styles.card}>
      <Text style={styles.cardHeaderTitle} numberOfLines={1} adjustsFontSizeToFit>🪔 {t('panchangamHeader')}</Text>

      {/* 1. Tithi */}
      <View style={styles.limbRow}>
        <View style={styles.limbLeft}>
          <Text style={styles.limbIcon}>🌑</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.limbLabel}>Tithi {showHindiScript ? '(तिथि)' : ''}</Text>
            <Text style={styles.limbValueBold} numberOfLines={1} adjustsFontSizeToFit>
              {locTithi.name} {showHindiScript && tithi.hindiName ? `(${tithi.hindiName})` : ''}
            </Text>
            <Text style={styles.limbSub} numberOfLines={1} adjustsFontSizeToFit>{locPaksha} • {locTithi.desc}</Text>
            <View style={styles.timingPillRow}>
              <View style={styles.startPill}>
                <Text style={styles.startPillText}>Starts: {tithi.startTimeFormatted || 'Aug 25, 06:22 AM'}</Text>
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
            <Text style={styles.limbLabel}>Nakshatra {showHindiScript ? '(नक्षत्र)' : ''}</Text>
            <Text style={styles.limbValueBold} numberOfLines={1} adjustsFontSizeToFit>
              {nakshatra.name} {showHindiScript && nakshatra.hindiName ? `(${nakshatra.hindiName})` : ''}
            </Text>
            <Text style={styles.limbSub} numberOfLines={1} adjustsFontSizeToFit>Ruler: {nakshatra.ruler} • Deity: {nakshatra.deity}</Text>
            <View style={styles.timingPillRow}>
              <View style={styles.startPill}>
                <Text style={styles.startPillText}>Starts: {nakshatra.startTimeFormatted || 'Aug 25, 04:15 AM'}</Text>
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
          <View style={{ flex: 1 }}>
            <Text style={styles.limbLabel}>Yoga {showHindiScript ? '(योग)' : ''}</Text>
            <Text style={styles.limbValueBold} numberOfLines={1} adjustsFontSizeToFit>
              {yoga.name} {showHindiScript && yoga.hindiName ? `(${yoga.hindiName})` : ''}
            </Text>
            <Text style={styles.limbSub} numberOfLines={1}>{yoga.endTimeFormatted}</Text>
          </View>
        </View>
        <View style={[styles.statusTag, { backgroundColor: yoga.isAuspicious ? Colors.auspiciousGreen : Colors.inauspiciousRed }]}>
          <Text style={styles.statusTagText}>{yoga.isAuspicious ? (showHindiScript ? 'शुभ' : 'Auspicious') : (showHindiScript ? 'अशुभ' : 'Inauspicious')}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* 4. Karana */}
      <View style={styles.limbRow}>
        <View style={styles.limbLeft}>
          <Text style={styles.limbIcon}>⏳</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.limbLabel}>Karana {showHindiScript ? '(करण)' : ''}</Text>
            <Text style={styles.limbValueBold} numberOfLines={1} adjustsFontSizeToFit>
              {karana.name} {showHindiScript && karana.hindiName ? `(${karana.hindiName})` : ''}
            </Text>
            <Text style={styles.limbSub} numberOfLines={1}>{karana.category} • {karana.endTimeFormatted}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* 5. Vaara */}
      <View style={styles.limbRow}>
        <View style={styles.limbLeft}>
          <Text style={styles.limbIcon}>☀️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.limbLabel}>Vaara {showHindiScript ? '(वार)' : ''}</Text>
            <Text style={styles.limbValueBold} numberOfLines={1} adjustsFontSizeToFit>
              {vaara.name} {showHindiScript && vaara.hindiName ? `(${vaara.hindiName})` : ''}
            </Text>
            <Text style={styles.limbSub} numberOfLines={1}>Planet: {vaara.rulingPlanet} • Deity: {vaara.deity}</Text>
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
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 12,
  },
  limbRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  limbLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  limbIcon: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 2,
  },
  limbLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  limbValueBold: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginTop: 2,
  },
  limbSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  timingPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  startPill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  startPillText: {
    fontSize: 10,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  endPill: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  endPillText: {
    fontSize: 10,
    color: '#E65100',
    fontWeight: 'bold',
  },
  specialBadge: {
    backgroundColor: Colors.accentGold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 6,
  },
  specialBadgeText: {
    color: Colors.maroon,
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 6,
  },
  statusTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0E0D0',
    marginVertical: 6,
  },
});
