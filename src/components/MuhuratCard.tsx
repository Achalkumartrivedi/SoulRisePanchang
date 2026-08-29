import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { MuhuratTiming } from '../types/panchang';
import { useLanguage } from '../context/LanguageContext';
import { ABHIJIT_GUIDE } from '../data/abhijitGuideRepository';

interface MuhuratCardProps {
  auspicious: MuhuratTiming[];
  inauspicious: MuhuratTiming[];
}

export const MuhuratCard: React.FC<MuhuratCardProps> = ({ auspicious, inauspicious }) => {
  const { language, t } = useLanguage();
  const [activeInfoModal, setActiveInfoModal] = useState<'AUSPICIOUS' | 'INAUSPICIOUS' | null>(null);
  const [showAbhijitDetailModal, setShowAbhijitDetailModal] = useState<boolean>(false);

  const guide = ABHIJIT_GUIDE[language] || ABHIJIT_GUIDE.hinglish;

  const getCleanMuhuratName = (item: MuhuratTiming) => {
    if (language === 'hi') {
      return item.hindiName || item.name;
    }
    return item.name;
  };

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

      {auspicious.map((item, index) => {
        const isAbhijit = item.name.toLowerCase().includes('abhijit') || item.hindiName.includes('अभिजित') || item.hindiName.includes('अभिजीत');

        return (
          <TouchableOpacity
            key={index}
            style={[styles.muhuratItem, styles.auspiciousBorder]}
            onPress={() => {
              if (isAbhijit) {
                setShowAbhijitDetailModal(true);
              } else {
                setActiveInfoModal('AUSPICIOUS');
              }
            }}
            activeOpacity={0.7}
          >
            <View style={styles.muhuratTop}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 }}>
                <Text style={styles.muhuratName} numberOfLines={1}>
                  {getCleanMuhuratName(item)}
                </Text>
                {isAbhijit && (
                  <View style={styles.tapDetailPill}>
                    <Text style={styles.tapDetailText}>ℹ️ Tap Details</Text>
                  </View>
                )}
              </View>
              <Text style={styles.auspiciousTime}>{item.startTime} - {item.endTime}</Text>
            </View>
            <Text style={styles.muhuratDesc}>{item.description}</Text>
          </TouchableOpacity>
        );
      })}

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
            <Text style={styles.muhuratNameRed} numberOfLines={1}>
              {getCleanMuhuratName(item)}
            </Text>
            <Text style={styles.inauspiciousTime}>{item.startTime} - {item.endTime}</Text>
          </View>
          <Text style={styles.muhuratDesc}>{item.description}</Text>
        </View>
      ))}

      {/* 1. General Info Modal Popup */}
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

      {/* 2. Detailed Abhijit Time Educational Modal (13 Languages) */}
      <Modal
        visible={showAbhijitDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAbhijitDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.guideModalCard}>
            <View style={styles.guideHeader}>
              <Text style={styles.guideHeaderTitle}>{guide.modalHeaderTitle}</Text>
              <TouchableOpacity onPress={() => setShowAbhijitDetailModal(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.guideScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.guideSubtitle}>{guide.subtitle}</Text>

              {/* What is Abhijit Time */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>📌 {guide.whatIsTitle}</Text>
                {guide.whatIsPoints.map((pt, idx) => (
                  <Text key={idx} style={styles.guidePointText}>• {pt}</Text>
                ))}
                <View style={styles.examplePill}>
                  <Text style={styles.examplePillText}>💡 {guide.exampleText}</Text>
                </View>
              </View>

              {/* Meaning */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>🔍 {guide.meaningTitle}</Text>
                <Text style={styles.guideBodyText}>{guide.meaningText}</Text>
              </View>

              {/* Auspicious Reason */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>☀️ {guide.auspiciousReasonTitle}</Text>
                <Text style={styles.guideBodyText}>{guide.auspiciousReasonText}</Text>
              </View>

              {/* Good For */}
              <View style={styles.guideBoxGood}>
                <Text style={styles.guideBoxTitleGood}>✅ {guide.goodForTitle}</Text>
                {guide.goodForItems.map((item, idx) => (
                  <Text key={idx} style={styles.guideGoodItem}>✔ {item}</Text>
                ))}
              </View>

              {/* Avoid */}
              <View style={styles.guideBoxBad}>
                <Text style={styles.guideBoxTitleBad}>⚠️ {guide.avoidTitle}</Text>
                <Text style={styles.guideBadText}>{guide.avoidText}</Text>
              </View>

              {/* History */}
              <View style={styles.guideBoxHistory}>
                <Text style={styles.guideBoxTitleHistory}>📜 {guide.historyTitle}</Text>
                <Text style={styles.guideHistoryText}>{guide.historyText}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.gotItBtn} onPress={() => setShowAbhijitDetailModal(false)}>
              <Text style={styles.gotItBtnText}>Close / Close Guide</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  },
  tapDetailPill: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  tapDetailText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.maroon,
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
    padding: 16,
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
    marginTop: 8,
  },
  gotItBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },

  // Guide Modal Styles
  guideModalCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.accentGold,
    elevation: 10,
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  guideHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
    flex: 1,
    marginRight: 8,
  },
  guideScroll: {
    paddingBottom: 10,
  },
  guideSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  guideBox: {
    backgroundColor: '#FAF5EE',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  guideBoxTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 6,
  },
  guidePointText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
    marginBottom: 4,
  },
  examplePill: {
    backgroundColor: '#FFF8E1',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  examplePillText: {
    fontSize: 11,
    color: '#B78103',
    fontWeight: '500',
    lineHeight: 16,
  },
  guideBodyText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  guideBoxGood: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  guideBoxTitleGood: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
  },
  guideGoodItem: {
    fontSize: 12,
    color: '#1B5E20',
    lineHeight: 18,
    marginBottom: 2,
    fontWeight: '500',
  },
  guideBoxBad: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFCC80',
  },
  guideBoxTitleBad: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4,
  },
  guideBadText: {
    fontSize: 12,
    color: '#BF360C',
    lineHeight: 18,
  },
  guideBoxHistory: {
    backgroundColor: '#F3E5F5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CE93D8',
  },
  guideBoxTitleHistory: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#6A1B9A',
    marginBottom: 4,
  },
  guideHistoryText: {
    fontSize: 11,
    color: '#4A148C',
    lineHeight: 17,
  },
});
