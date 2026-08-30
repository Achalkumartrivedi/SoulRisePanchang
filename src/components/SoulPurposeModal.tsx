import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { Colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedTithiSoulPurpose } from '../data/tithiSoulPurposeData';

interface SoulPurposeModalProps {
  visible: boolean;
  onClose: () => void;
  tithiNumber: number; // 1-15 or 30
  tithiName: string;
}

export const SoulPurposeModal: React.FC<SoulPurposeModalProps> = ({
  visible,
  onClose,
  tithiNumber,
  tithiName
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'PURPOSE' | 'PERSONALITY' | 'DEITY' | 'HARMONY'>('PURPOSE');

  const info = getLocalizedTithiSoulPurpose(tithiNumber, language);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              
              {/* Header Bar */}
              <View style={styles.headerRow}>
                <View style={styles.titleBadge}>
                  <Text style={styles.headerIcon}>✨</Text>
                  <Text style={styles.headerTitle}>Soul Purpose on Earth</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                
                {/* Hero Tithi Badge Card */}
                <View style={styles.heroCard}>
                  <Text style={styles.heroSubtitle}>BIRTH LUNAR DAY (JANMA TITHI)</Text>
                  <Text style={styles.heroTithiName}>{tithiName || info.name}</Text>

                  <View style={styles.groupPillRow}>
                    <View style={styles.groupBadge}>
                      <Text style={styles.groupBadgeText}>Group: {info.groupType}</Text>
                    </View>

                    <View style={styles.deityBadge}>
                      <Text style={styles.deityBadgeText}>Deity: {info.rulingDeity}</Text>
                    </View>
                  </View>

                  <Text style={styles.groupMeaningText}>💡 {info.groupMeaning}</Text>
                </View>

                {/* Sub-Tab Navigation Bar */}
                <View style={styles.tabNavRow}>
                  <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'PURPOSE' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('PURPOSE')}
                  >
                    <Text style={[styles.tabText, activeTab === 'PURPOSE' && styles.tabTextActive]}>🌟 Mission</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'PERSONALITY' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('PERSONALITY')}
                  >
                    <Text style={[styles.tabText, activeTab === 'PERSONALITY' && styles.tabTextActive]}>👤 Traits</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'DEITY' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('DEITY')}
                  >
                    <Text style={[styles.tabText, activeTab === 'DEITY' && styles.tabTextActive]}>🕉️ Deity</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'HARMONY' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('HARMONY')}
                  >
                    <Text style={[styles.tabText, activeTab === 'HARMONY' && styles.tabTextActive]}>🔮 Wisdom</Text>
                  </TouchableOpacity>
                </View>

                {/* Tab 1: Soul Purpose & Mission */}
                {activeTab === 'PURPOSE' && (
                  <View style={styles.detailCard}>
                    <Text style={styles.purposeTitle}>{info.soulPurposeTitle}</Text>
                    <Text style={styles.purposeBody}>{info.soulPurposeSummary}</Text>

                    <View style={styles.quoteBox}>
                      <Text style={styles.quoteIcon}>📜</Text>
                      <Text style={styles.quoteText}>
                        "Vedic astrology holds that your Janma Tithi leaves a profound energetic imprint on your mind and emotions, directing your soul towards its chosen evolution on Earth."
                      </Text>
                    </View>
                  </View>
                )}

                {/* Tab 2: Personality Traits & Strengths */}
                {activeTab === 'PERSONALITY' && (
                  <View style={styles.detailCard}>
                    <Text style={styles.sectionHeader}>🎭 Character & Behavioral Tendencies</Text>
                    <Text style={styles.traitsBody}>{info.personalityTraits}</Text>

                    <Text style={[styles.sectionHeader, { marginTop: 14, color: '#2E7D32' }]}>⭐ Core Strengths</Text>
                    {info.strengths.map((s, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.greenCheck}>✓</Text>
                        <Text style={styles.bulletText}>{s}</Text>
                      </View>
                    ))}

                    <Text style={[styles.sectionHeader, { marginTop: 14, color: '#C62828' }]}>⚠️ Life Challenges & Growth Points</Text>
                    {info.challenges.map((c, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.redAlert}>!</Text>
                        <Text style={styles.bulletText}>{c}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Tab 3: Deity & Rituals */}
                {activeTab === 'DEITY' && (
                  <View style={styles.detailCard}>
                    <Text style={styles.sectionHeader}>🕉️ Presiding Deity & Celestial Attributes</Text>
                    
                    <View style={styles.deityGrid}>
                      <View style={styles.deityItem}>
                        <Text style={styles.deityLabel}>Presiding Deity:</Text>
                        <Text style={styles.deityVal}>{info.rulingDeity}</Text>
                      </View>

                      <View style={styles.deityItem}>
                        <Text style={styles.deityLabel}>Ruling Planet:</Text>
                        <Text style={styles.deityVal}>{info.rulingPlanet}</Text>
                      </View>

                      <View style={styles.deityItem}>
                        <Text style={styles.deityLabel}>Tattva Element:</Text>
                        <Text style={styles.deityVal}>{info.element}</Text>
                      </View>

                      <View style={styles.deityItem}>
                        <Text style={styles.deityLabel}>Tithi Classification:</Text>
                        <Text style={styles.deityVal}>{info.groupType} Tithi</Text>
                      </View>
                    </View>

                    <Text style={[styles.sectionHeader, { marginTop: 14 }]}>🌸 Recommended Remedies & Tithi Puja</Text>
                    <Text style={styles.ritualText}>{info.recommendedRituals}</Text>
                  </View>
                )}

                {/* Tab 4: Cosmic Wisdom & Favorable Pairings */}
                {activeTab === 'HARMONY' && (
                  <View style={styles.detailCard}>
                    <Text style={styles.sectionHeader}>🔮 Spiritual Guidance & Harmony</Text>
                    <Text style={styles.guidanceText}>{info.spiritualGuidance}</Text>

                    <View style={styles.harmonyBox}>
                      <Text style={styles.harmonyTitle}>🌌 Tithi Harmony Principle:</Text>
                      <Text style={styles.harmonyBody}>
                        Days belonging to the same Guna classification ({info.groupType}) harmonize naturally with your mind. Worshiping the presiding deity ({info.rulingDeity}) on your birth Tithi each month brings immense clarity and peace.
                      </Text>
                    </View>
                  </View>
                )}

              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.creamBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    padding: 16,
    elevation: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  headerIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  closeBtn: {
    backgroundColor: '#F0F0F0',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  heroCard: {
    backgroundColor: '#4A0E17', // Deep Maroon Gold Card
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FFD700',
    elevation: 4,
  },
  heroSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroTithiName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  groupPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  groupBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  groupBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  deityBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deityBadgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  groupMeaningText: {
    fontSize: 11,
    color: '#FFE0B2',
    fontStyle: 'italic',
  },
  tabNavRow: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    padding: 3,
    marginBottom: 14,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: Colors.maroon,
  },
  tabText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFD700',
  },
  detailCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  purposeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 8,
  },
  purposeBody: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 14,
  },
  quoteBox: {
    flexDirection: 'row',
    backgroundColor: '#FAF5EE',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E0D0',
    alignItems: 'flex-start',
  },
  quoteIcon: {
    fontSize: 18,
    marginRight: 8,
    marginTop: 2,
  },
  quoteText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 8,
  },
  traitsBody: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  greenCheck: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginRight: 8,
    marginTop: 1,
  },
  redAlert: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#C62828',
    marginRight: 8,
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textPrimary,
  },
  deityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  deityItem: {
    width: '48%',
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  deityLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  deityVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginTop: 2,
  },
  ritualText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
    backgroundColor: '#FFF8F0',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFCC80',
  },
  guidanceText: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
    marginBottom: 12,
  },
  harmonyBox: {
    backgroundColor: '#FAF5EE',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  harmonyTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 4,
  },
  harmonyBody: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
