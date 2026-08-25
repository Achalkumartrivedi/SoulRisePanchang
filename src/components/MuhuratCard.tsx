import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
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
  const [activeInfoModal, setActiveInfoModal] = useState<'AUSPICIOUS' | 'INAUSPICIOUS' | null>(null);

  return (
    <View style={styles.card}>
      <Text style={styles.cardHeaderTitle} numberOfLines={1} adjustsFontSizeToFit>✨ {t('auspiciousTimingsHeader')}</Text>

      {/* Auspicious Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionSubtitle}>{t('auspiciousSection')}</Text>
        <TouchableOpacity
          style={styles.infoBtn}
          onPress={() => setActiveInfoModal('AUSPICIOUS')}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.infoIcon}>ℹ️</Text>
        </TouchableOpacity>
      </View>

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
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionSubtitleRed}>{t('inauspiciousSection')}</Text>
        <TouchableOpacity
          style={styles.infoBtn}
          onPress={() => setActiveInfoModal('INAUSPICIOUS')}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.infoIcon}>ℹ️</Text>
        </TouchableOpacity>
      </View>

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

      {/* Info Modal Popup */}
      <Modal
        visible={activeInfoModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveInfoModal(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveInfoModal(null)}
        >
          <View style={styles.infoModalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.infoModalHeader}>
              <Text style={styles.infoModalTitle}>
                {activeInfoModal === 'AUSPICIOUS' ? '🌟 Auspicious Timings Guidance' : '⚠️ Inauspicious Timings Guidance'}
              </Text>
              <TouchableOpacity onPress={() => setActiveInfoModal(null)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.infoMsgBox, activeInfoModal === 'AUSPICIOUS' ? styles.msgGood : styles.msgBad]}>
              <Text style={styles.infoMsgText}>
                {activeInfoModal === 'AUSPICIOUS' ? t('auspiciousInfoText') : t('inauspiciousInfoText')}
              </Text>
            </View>

            <TouchableOpacity style={styles.gotItBtn} onPress={() => setActiveInfoModal(null)}>
              <Text style={styles.gotItBtnText}>Understand / Got It</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.auspiciousGreen,
    marginRight: 6,
  },
  sectionSubtitleRed: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.inauspiciousRed,
    marginRight: 6,
  },
  infoBtn: {
    padding: 2,
  },
  infoIcon: {
    fontSize: 14,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoModalCard: {
    width: '100%',
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.accentGold,
    elevation: 8,
  },
  infoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  infoModalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
    flex: 1,
    marginRight: 10,
  },
  closeBtnText: {
    fontSize: 18,
    color: Colors.textMuted,
    fontWeight: 'bold',
  },
  infoMsgBox: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  msgGood: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
  msgBad: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF9A9A',
  },
  infoMsgText: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
    fontWeight: '500',
  },
  gotItBtn: {
    backgroundColor: Colors.maroon,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  gotItBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
