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
  const [activeTab, setActiveTab] = useState<'PURPOSE' | 'SHOONYA' | 'EPIGENETICS' | 'DEITY'>('PURPOSE');

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
                  <Text style={styles.headerTitle}>Soul Purpose & Tithi Secrets</Text>
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
                      <Text style={styles.groupBadgeText}>{info.groupType} Division ({info.element})</Text>
                    </View>

                    <View style={styles.deityBadge}>
                      <Text style={styles.deityBadgeText}>Planet: {info.rulingPlanet}</Text>
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
                    <Text style={[styles.tabText, activeTab === 'PURPOSE' && styles.tabTextActive]}>🌟 Purpose</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'SHOONYA' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('SHOONYA')}
                  >
                    <Text style={[styles.tabText, activeTab === 'SHOONYA' && styles.tabTextActive]}>🔥 Shoonya</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'EPIGENETICS' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('EPIGENETICS')}
                  >
                    <Text style={[styles.tabText, activeTab === 'EPIGENETICS' && styles.tabTextActive]}>🧬 Epigenetics</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.tabBtn, activeTab === 'DEITY' && styles.tabBtnActive]}
                    onPress={() => setActiveTab('DEITY')}
                  >
                    <Text style={[styles.tabText, activeTab === 'DEITY' && styles.tabTextActive]}>🕉️ Deities</Text>
                  </TouchableOpacity>
                </View>

                {/* Tab 1: Soul Purpose & Western Lunation Phase */}
                {activeTab === 'PURPOSE' && (
                  <View style={styles.detailCard}>
                    <Text style={styles.purposeTitle}>{info.soulPurposeTitle}</Text>
                    <Text style={styles.purposeBody}>{info.soulPurposeSummary}</Text>

                    {/* Rudhyar Soli-Lunar Western Lunation Phase Synthesis */}
                    <View style={styles.lunationCardBox}>
                      <Text style={styles.lunationCardTitle}>🌙 Western Soli-Lunar Phase (Dane Rudhyar Synthesis)</Text>
                      <Text style={styles.lunationPhaseName}>Phase: {info.westernLunationPhase}</Text>
                      <Text style={styles.lunationPhaseDesc}>{info.westernPhaseDescription}</Text>
                    </View>

                    <View style={styles.quoteBox}>
                      <Text style={styles.quoteIcon}>📜</Text>
                      <Text style={styles.quoteText}>
                        "Vedic & Western lunation synthesis reveals that your Janma Tithi establishes the foundational baseline of your emotional body, mind, and soul mission on Earth."
                      </Text>
                    </View>
                  </View>
                )}

                {/* Tab 2: Tithi Shoonya (Dagdha Rashi / Burnt Signs & Nullification) */}
                {activeTab === 'SHOONYA' && (
                  <View style={styles.detailCard}>
                    <Text style={styles.sectionHeader}>🔥 Tithi Shoonya (Dagdha Rashi / Burnt Signs)</Text>
                    <Text style={styles.traitsBody}>
                      Because the Sun and Moon cast an astrological shadow on certain zodiac coordinates, specific signs become "burnt" (Dagdha) on your birth Tithi:
                    </Text>

                    <View style={styles.shoonyabox}>
                      <Text style={styles.shoonyaLabel}>Burnt Zodiac Signs (Dagdha Rashis):</Text>
                      <Text style={styles.shoonyaVal}>{info.dagdhaRashis}</Text>

                      <Text style={[styles.shoonyaLabel, { marginTop: 6 }]}>Primary Affected Planets:</Text>
                      <Text style={styles.shoonyaVal}>{info.dagdhaLords}</Text>

                      <Text style={[styles.shoonyaLabel, { marginTop: 6 }]}>Impact on Life Placements:</Text>
                      <Text style={styles.shoonyaSubVal}>{info.dagdhaImpact}</Text>
                    </View>

                    {/* Principles of Nullification */}
                    <Text style={[styles.sectionHeader, { marginTop: 14, color: '#2E7D32' }]}>
                      ✨ Principles of Nullification (Dagdha Dosha Bhanga)
                    </Text>
                    <Text style={styles.nullificationText}>{info.nullificationRule}</Text>
                    
                    <View style={styles.nullificationTipsBox}>
                      <Text style={styles.nullificationTipTitle}>💡 How Tithi Shoonya is Cancelled:</Text>
                      <Text style={styles.nullificationTipItem}>• <Text style={{ fontWeight: 'bold' }}>Dusthana Placement:</Text> If the lord of the burnt sign sits in the 3rd, 6th, 8th, or 12th house, harm is restricted.</Text>
                      <Text style={styles.nullificationTipItem}>• <Text style={{ fontWeight: 'bold' }}>Retrograde Exception:</Text> A Retrograde planet in its own Dagdha Rashi shines through the shadow.</Text>
                      <Text style={styles.nullificationTipItem}>• <Text style={{ fontWeight: 'bold' }}>Malefic Conjunction:</Text> Conjunction with Saturn, Mars, or Rahu/Ketu Nakshatras neutralizes the shadow.</Text>
                    </View>
                  </View>
                )}

                {/* Tab 3: Epigenetic DNA & Dietary Remedies */}
                {activeTab === 'EPIGENETICS' && (
                  <View style={styles.detailCard}>
                    <Text style={styles.sectionHeader}>🧬 Epigenetic Jyotish & Ancestral Karma (Pitru Karma)</Text>
                    <Text style={styles.traitsBody}>
                      Planetary placements act as dynamic epigenetic switches encoded in physical DNA. Dietary choices directly activate or balance these cosmic energies:
                    </Text>

                    <View style={styles.epigeneticBox}>
                      <Text style={styles.epigeneticTitle}>🥗 Epigenetic Dietary Guidance:</Text>
                      <Text style={styles.epigeneticBody}>{info.epigeneticDiet}</Text>
                    </View>

                    <Text style={[styles.sectionHeader, { marginTop: 14, color: '#2E7D32' }]}>⭐ Character Strengths</Text>
                    {info.strengths.map((s, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.greenCheck}>✓</Text>
                        <Text style={styles.bulletText}>{s}</Text>
                      </View>
                    ))}

                    <Text style={[styles.sectionHeader, { marginTop: 14, color: '#C62828' }]}>⚠️ Potential Life Challenges</Text>
                    {info.challenges.map((c, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.redAlert}>!</Text>
                        <Text style={styles.bulletText}>{c}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Tab 4: Narada Purana Deities & Birthday Sadhana */}
                {activeTab === 'DEITY' && (
                  <View style={styles.detailCard}>
                    <Text style={styles.sectionHeader}>🕉️ Narada Purana Presiding Deities</Text>
                    
                    <View style={styles.deityGrid}>
                      <View style={styles.deityItem}>
                        <Text style={styles.deityLabel}>Shukla Paksha Deity:</Text>
                        <Text style={styles.deityVal}>{info.shuklaDeity}</Text>
                      </View>

                      <View style={styles.deityItem}>
                        <Text style={styles.deityLabel}>Krishna Paksha Deity:</Text>
                        <Text style={styles.deityVal}>{info.krishnaDeity}</Text>
                      </View>

                      <View style={styles.deityItem}>
                        <Text style={styles.deityLabel}>Panchamahabhuta:</Text>
                        <Text style={styles.deityVal}>{info.element}</Text>
                      </View>

                      <View style={styles.deityItem}>
                        <Text style={styles.deityLabel}>Ruling Planet:</Text>
                        <Text style={styles.deityVal}>{info.rulingPlanet}</Text>
                      </View>
                    </View>

                    {/* Day-Based Color Remedy */}
                    <View style={styles.colorRemedyBox}>
                      <Text style={styles.colorRemedyTitle}>🎨 Day Color & Rahu Kaal Remedy:</Text>
                      <Text style={styles.colorRemedyText}>{info.dayColorRemedy}</Text>
                    </View>

                    <Text style={[styles.sectionHeader, { marginTop: 14 }]}>🌸 Annual Birthday Sadhana & Rituals</Text>
                    <Text style={styles.ritualText}>{info.recommendedRituals}</Text>

                    <View style={styles.sadhanaList}>
                      <Text style={styles.sadhanaItem}>🛁 <Text style={{ fontWeight: 'bold' }}>Purification Bath:</Text> Bath with turmeric & sandalwood water on your birth Tithi.</Text>
                      <Text style={styles.sadhanaItem}>🪔 <Text style={{ fontWeight: 'bold' }}>Sunrise Ghee Lamp:</Text> Light a ghee lamp at sunrise to align inner awareness.</Text>
                      <Text style={styles.sadhanaItem}>🎁 <Text style={{ fontWeight: 'bold' }}>Acts of Charity (Dana):</Text> Feed the needy or donate to clear past karmic debts.</Text>
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
    backgroundColor: '#4A0E17',
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
  lunationCardBox: {
    backgroundColor: '#FAF5EE',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accentGold,
    marginBottom: 12,
  },
  lunationCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 4,
  },
  lunationPhaseName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  lunationPhaseDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
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
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
    marginBottom: 10,
  },
  shoonyabox: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFB74D',
    marginBottom: 12,
  },
  shoonyaLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  shoonyaVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#C62828',
    marginTop: 2,
  },
  shoonyaSubVal: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 2,
    lineHeight: 16,
  },
  nullificationText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
    marginBottom: 8,
  },
  nullificationTipsBox: {
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  nullificationTipTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  nullificationTipItem: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 2,
    lineHeight: 16,
  },
  epigeneticBox: {
    backgroundColor: '#FAF5EE',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E0D0',
    marginBottom: 12,
  },
  epigeneticTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 4,
  },
  epigeneticBody: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 16,
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
  colorRemedyBox: {
    backgroundColor: '#FFF8F0',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFCC80',
    marginBottom: 12,
  },
  colorRemedyTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 2,
  },
  colorRemedyText: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  ritualText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0E0D0',
    marginBottom: 10,
  },
  sadhanaList: {
    marginTop: 4,
  },
  sadhanaItem: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginBottom: 6,
    lineHeight: 16,
  },
});
