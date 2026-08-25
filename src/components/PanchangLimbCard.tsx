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

  const isHindi = language === 'hi';
  const isHinglish = language === 'hinglish';

  // Clean Limb Labels without redundant bracket noise
  const tithiLabel = isHindi ? 'तिथि' : 'Tithi';
  const nakshatraLabel = isHindi ? 'नक्षत्र' : 'Nakshatra';
  const yogaLabel = isHindi ? 'योग' : 'Yoga';
  const karanaLabel = isHindi ? 'करण' : 'Karana';
  const vaaraLabel = isHindi ? 'वार' : 'Vaara';

  // Clean Limb Values
  const displayTithiName = locTithi.name;
  const displayNakshatraName = isHindi ? nakshatra.hindiName : nakshatra.name;
  const displayYogaName = isHindi ? yoga.hindiName : yoga.name;
  const displayKaranaName = isHindi ? karana.hindiName : karana.name;

  let displayVaaraName = vaara.name;
  if (isHindi) {
    displayVaaraName = vaara.hindiName; // e.g. "मंगलवार"
  } else if (isHinglish) {
    // Extract Sanskrit/Hinglish day name without English (e.g. "Mangalavara")
    displayVaaraName = vaara.name.split(' ')[0] || vaara.name;
  }

  const startsText = isHindi ? 'प्रारंभ' : 'Starts';
  const endsText = isHindi ? 'समाप्त' : 'Ends';

  return (
    <View style={styles.card}>
      <Text style={styles.cardHeaderTitle} numberOfLines={1} adjustsFontSizeToFit>🪔 {t('panchangamHeader')}</Text>

      {/* 1. Tithi */}
      <View style={styles.limbRow}>
        <View style={styles.limbLeft}>
          <Text style={styles.limbIcon}>🌑</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.limbLabel}>{tithiLabel}</Text>
            <Text style={styles.limbValueBold} numberOfLines={1} adjustsFontSizeToFit>
              {displayTithiName}
            </Text>
            <Text style={styles.limbSub} numberOfLines={1} adjustsFontSizeToFit>{locPaksha} • {locTithi.desc}</Text>
            <View style={styles.timingPillRow}>
              <View style={styles.startPill}>
                <Text style={styles.startPillText}>{startsText}: {tithi.startTimeFormatted || '06:22 AM'}</Text>
              </View>
              <View style={styles.endPill}>
                <Text style={styles.endPillText}>{endsText}: {tithi.endTimeFormatted}</Text>
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
            <Text style={styles.limbLabel}>{nakshatraLabel}</Text>
            <Text style={styles.limbValueBold} numberOfLines={1} adjustsFontSizeToFit>
              {displayNakshatraName}
            </Text>
            <Text style={styles.limbSub} numberOfLines={1} adjustsFontSizeToFit>Ruler: {nakshatra.ruler} • Deity: {nakshatra.deity}</Text>
            <View style={styles.timingPillRow}>
              <View style={styles.startPill}>
                <Text style={styles.startPillText}>{startsText}: {nakshatra.startTimeFormatted || '04:15 AM'}</Text>
              </View>
              <View style={styles.endPill}>
                <Text style={styles.endPillText}>{endsText}: {nakshatra.endTimeFormatted}</Text>
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
            <Text style={styles.limbLabel}>{yogaLabel}</Text>
            <Text style={styles.limbValueBold} numberOfLines={1} adjustsFontSizeToFit>
              {displayYogaName}
            </Text>
            <Text style={styles.limbSub} numberOfLines={1}>{yoga.endTimeFormatted}</Text>
          </View>
        </View>
        <View style={[styles.statusTag, { backgroundColor: yoga.isAuspicious ? Colors.auspiciousGreen : Colors.inauspiciousRed }]}>
          <Text style={styles.statusTagText}>{yoga.isAuspicious ? (isHindi ? 'शुभ' : 'Auspicious') : (isHindi ? 'अशुभ' : 'Inauspicious')}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* 4. Karana */}
      <View style={styles.limbRow}>
        <View style={styles.limbLeft}>
          <Text style={styles.limbIcon}>⏳</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.limbLabel}>{karanaLabel}</Text>
            <Text style={styles.limbValueBold} numberOfLines={1} adjustsFontSizeToFit>
              {displayKaranaName}
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
            <Text style={styles.limbLabel}>{vaaraLabel}</Text>
            <Text style={styles.limbValueBold} numberOfLines={1} adjustsFontSizeToFit>
              {displayVaaraName}
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
  },
  limbLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  limbIcon: {
    fontSize: 22,
    marginRight: 12,
    marginTop: 2,
  },
  limbLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  limbValueBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginTop: 2,
  },
  limbSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  timingPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  startPill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  startPillText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  endPill: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  endPillText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#E65100',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0E0D0',
    marginVertical: 12,
  },
  specialBadge: {
    backgroundColor: Colors.accentGold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 6,
  },
  specialBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 6,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
