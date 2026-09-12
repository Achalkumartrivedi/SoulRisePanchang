import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { TithiInfo } from '../types/panchang';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedTithi, getLocalizedPakshaName, getLocalizedNatureBadge } from '../i18n/vedicTerms';
import {
  TITHI_MODAL_UI_LABELS,
  GET_LOCALIZED_GROUPS_DATA,
  GET_LOCALIZED_TITHI_GUIDANCE
} from '../i18n/tithiDetailTranslations';

interface TithiDetailModalProps {
  visible: boolean;
  onClose: () => void;
  tithi: TithiInfo;
  dayOfWeek?: number;
}

export const TithiDetailModal: React.FC<TithiDetailModalProps> = ({ visible, onClose, tithi, dayOfWeek }) => {
  const { language } = useLanguage();
  const ui = TITHI_MODAL_UI_LABELS[language] || TITHI_MODAL_UI_LABELS['en'];
  const groupsData = GET_LOCALIZED_GROUPS_DATA(language);

  const tithiNumInPaksha = ((tithi.number - 1) % 15) + 1;
  const isAmavasya = tithi.number === 30 || tithi.number === 29;

  // Determine Pancha Varga Group Key
  let groupKey = 'NANDA';
  if ([1, 6, 11].includes(tithiNumInPaksha)) groupKey = 'NANDA';
  else if ([2, 7, 12].includes(tithiNumInPaksha)) groupKey = 'BHADRA';
  else if ([3, 8, 13].includes(tithiNumInPaksha)) groupKey = 'JAYA';
  else if ([4, 9, 14].includes(tithiNumInPaksha)) groupKey = 'RIKTA';
  else if ([5, 10, 15, 30].includes(tithiNumInPaksha) || isAmavasya) groupKey = 'POORNA';

  const groupMeta = groupsData[groupKey] || groupsData['NANDA'];

  // Specific Tithi guidance lookup
  const guidanceKey = isAmavasya ? 30 : tithiNumInPaksha;
  const guidance = GET_LOCALIZED_TITHI_GUIDANCE(guidanceKey, language);
  const localizedTithiName = getLocalizedTithi(guidanceKey, language).name || tithi.name;
  const localizedPaksha = tithi.paksha ? getLocalizedPakshaName(tithi.paksha, language) : (tithi.pakshaHindi || 'Paksha');

  // Siddha Yoga check
  let isSiddhaYoga = false;
  if (tithiNumInPaksha === 4 && dayOfWeek === 6) isSiddhaYoga = true; // Chaturthi on Saturday
  if (tithiNumInPaksha === 9 && dayOfWeek === 0) isSiddhaYoga = true; // Navami on Sunday

  // Dagddha Tithi check
  let isDagddha = false;
  if (tithiNumInPaksha === 2 && dayOfWeek === 0) isDagddha = true; // Dwitiya on Sunday
  if (tithiNumInPaksha === 11 && dayOfWeek === 1) isDagddha = true; // Ekadashi on Monday

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
                🌑 {localizedTithiName}
              </Text>
              <Text style={styles.subTitle} numberOfLines={1} adjustsFontSizeToFit>
                {localizedPaksha} • {groupMeta.groupName}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.8}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* 1. Group Badge Banner */}
            <View style={[styles.groupBanner, { backgroundColor: groupMeta.bgColor }]}>
              <View style={styles.groupBannerHeader}>
                <Text style={[styles.groupNameText, { color: groupMeta.color }]}>{groupMeta.groupName}</Text>
                <View style={[styles.natureTag, { backgroundColor: groupMeta.color }]}>
                  <Text style={styles.natureTagText}>{groupMeta.nature}</Text>
                </View>
              </View>
              <Text style={styles.groupDetailText}>
                <Text style={{ fontWeight: 'bold' }}>{ui.ruledBy}:</Text> {groupMeta.ruler} • <Text style={{ fontWeight: 'bold' }}>{ui.essence}:</Text> {groupMeta.meaning}
              </Text>
              <Text style={styles.groupRecText}>
                <Text style={{ fontWeight: 'bold' }}>{ui.bestFor}:</Text> {groupMeta.recommended}
              </Text>
            </View>

            {/* 2. Timing Breakdown Card */}
            <View style={styles.timingCard}>
              <Text style={styles.cardHeaderTitle}>{ui.activeTimingWindow}</Text>
              <View style={styles.timingRow}>
                <View style={styles.timingBoxStart}>
                  <Text style={styles.timingBoxLabel}>{ui.startTime}</Text>
                  <Text style={styles.timingBoxVal}>{tithi.startTimeFormatted || 'Yesterday 06:22 AM IST'}</Text>
                </View>
                <Text style={styles.timingArrow}>➔</Text>
                <View style={styles.timingBoxEnd}>
                  <Text style={styles.timingBoxLabel}>{ui.endTime}</Text>
                  <Text style={styles.timingBoxVal}>{tithi.endTimeFormatted || 'Today 08:04 AM IST'}</Text>
                </View>
              </View>
            </View>

            {/* 3. Special Dosha / Exception Alerts */}
            {isSiddhaYoga && (
              <View style={styles.alertSiddha}>
                <Text style={styles.alertTitle}>{ui.siddhaYogaTitle}</Text>
                <Text style={styles.alertText}>{ui.siddhaYogaText}</Text>
              </View>
            )}

            {isDagddha && (
              <View style={styles.alertDagddha}>
                <Text style={styles.alertTitle}>{ui.dagddhaTitle}</Text>
                <Text style={styles.alertText}>{ui.dagddhaText}</Text>
              </View>
            )}

            {/* 4. Tithi-Wise Guidance */}
            <View style={styles.card}>
              <View style={styles.guidanceHeader}>
                <Text style={styles.cardHeaderTitle}>{ui.tithiWisdomHeader}</Text>
                <View style={[styles.typeBadge, { backgroundColor: guidance.type === 'FRUITFUL' ? '#2E7D32' : '#C62828' }]}>
                  <Text style={styles.typeBadgeText}>{getLocalizedNatureBadge(guidance.type === 'FRUITFUL' ? 'FRUITFUL' : 'SENSITIVE', language)}</Text>
                </View>
              </View>
              <Text style={styles.guidanceDetail}>{guidance.detail}</Text>
            </View>

            {/* 5. Pancha Vargas (Five Functional Groups) Table */}
            <View style={styles.card}>
              <Text style={styles.cardHeaderTitle}>{ui.panchaVargasHeader}</Text>
              {Object.values(groupsData).map(g => (
                <View key={g.groupName} style={[styles.vargaRow, g.groupName === groupMeta.groupName && styles.vargaRowActive]}>
                  <View style={styles.vargaLeft}>
                    <Text style={styles.vargaTitle}>{g.groupName}</Text>
                    <Text style={styles.vargaRuler}>{ui.ruledBy}: {g.ruler}</Text>
                    <Text style={styles.vargaTithis}>{g.tithis}</Text>
                  </View>
                  <View style={[styles.vargaBadge, { backgroundColor: g.color }]}>
                    <Text style={styles.vargaBadgeText}>{g.nature.split(' ')[0]}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.creamBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  subTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: '#E0E0E0',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  scrollBody: {
    marginBottom: 10,
  },
  groupBanner: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  groupBannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupNameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  natureTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  natureTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  groupDetailText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
    marginBottom: 4,
  },
  groupRecText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  timingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 10,
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timingBoxStart: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 8,
  },
  timingBoxEnd: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 8,
  },
  timingBoxLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  timingBoxVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  timingArrow: {
    fontSize: 14,
    color: Colors.textMuted,
    marginHorizontal: 8,
  },
  alertSiddha: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  alertDagddha: {
    backgroundColor: '#FFEBEE',
    borderColor: '#C62828',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  alertText: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  guidanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  guidanceDetail: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  vargaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  vargaRowActive: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    paddingHorizontal: 6,
  },
  vargaLeft: {
    flex: 1,
    marginRight: 8,
  },
  vargaTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  vargaRuler: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  vargaTithis: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  vargaBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vargaBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
