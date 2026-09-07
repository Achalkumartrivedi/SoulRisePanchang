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
import { KundaliResult } from '../engine/kundaliEngine';
import { evaluatePersonalShoonya } from '../utils/shoonyaEvaluator';
import { evaluateLeoSunSoulPurpose } from '../engine/leoSoulPurposeEngine';
import { evaluateVedicRules } from '../engine/vedicAstrologyRules';

interface SoulPurposeModalProps {
  visible: boolean;
  onClose: () => void;
  tithiNumber: number; // 1-15 or 30
  tithiName: string;
  kundali: KundaliResult;
}

export const SoulPurposeModal: React.FC<SoulPurposeModalProps> = ({
  visible,
  onClose,
  tithiNumber,
  tithiName,
  kundali
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'PURPOSE' | 'LEO_SUN' | 'SHOONYA' | 'EPIGENETICS' | 'DEITY'>('PURPOSE');

  const info = getLocalizedTithiSoulPurpose(tithiNumber, language);
  const shoonyaAnalysis = evaluatePersonalShoonya(kundali, tithiNumber, language);
  const leoSunPurpose = evaluateLeoSunSoulPurpose(kundali);
  const vedicReport = evaluateVedicRules(kundali);

  const getText = (textMap?: Record<string, any>, fallback: string = ''): string => {
    if (!textMap) return fallback;
    if (textMap[language]) return textMap[language];
    if (language === 'hinglish') return textMap['hi'] || textMap['en'] || fallback;
    if (language === 'mr') return textMap['hi'] || textMap['en'] || fallback;
    return textMap['en'] || textMap['hi'] || fallback;
  };

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
                      <Text style={styles.groupBadgeText}>{info.groupType} Division ({info.element})</Text>
                    </View>

                    <View style={styles.deityBadge}>
                      <Text style={styles.deityBadgeText}>Planet: {info.rulingPlanet}</Text>
                    </View>
                  </View>

                  <Text style={styles.groupMeaningText}>💡 {info.groupMeaning}</Text>
                </View>

                {/* Main Tab Navigation Bar */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                  <View style={styles.tabNavRow}>
                    <TouchableOpacity
                      style={[styles.tabBtn, activeTab === 'PURPOSE' && styles.tabBtnActive]}
                      onPress={() => setActiveTab('PURPOSE')}
                    >
                      <Text style={[styles.tabText, activeTab === 'PURPOSE' && styles.tabTextActive]}>✨ Tithi Secrets</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.tabBtn, activeTab === 'LEO_SUN' && styles.tabBtnActive]}
                      onPress={() => setActiveTab('LEO_SUN')}
                    >
                      <Text style={[styles.tabText, activeTab === 'LEO_SUN' && styles.tabTextActive]}>☀️ Sun - The Soul Secret</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.tabBtn, activeTab === 'SHOONYA' && styles.tabBtnActive]}
                      onPress={() => setActiveTab('SHOONYA')}
                    >
                      <Text style={[styles.tabText, activeTab === 'SHOONYA' && styles.tabTextActive]}>🌸 Tithi Shoonya</Text>
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
                      <Text style={[styles.tabText, activeTab === 'DEITY' && styles.tabTextActive]}>🏛️ Deities</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>

                {/* Tab 1: Tithi Soul Purpose & Western Lunation Phase */}
                {activeTab === 'PURPOSE' && (
                  <View style={styles.detailCard}>
                    <Text style={styles.purposeTitle}>{info.soulPurposeTitle}</Text>
                    <Text style={styles.purposeBody}>{info.soulPurposeSummary}</Text>

                    {/* Inherent Personality Traits */}
                    {info.personalityTraits ? (
                      <View style={{ marginTop: 6, marginBottom: 12 }}>
                        <Text style={[styles.sectionHeader, { color: Colors.maroon }]}>🧠 Personality Traits & Mind Matrix:</Text>
                        <Text style={styles.traitsBody}>{info.personalityTraits}</Text>
                      </View>
                    ) : null}

                    {/* Core Strengths & Powers (Green Checkmarks) */}
                    {info.strengths && info.strengths.length > 0 ? (
                      <View style={{ marginTop: 4, marginBottom: 12 }}>
                        <Text style={[styles.sectionHeader, { color: '#2E7D32' }]}>✨ Core Strengths & Blessings:</Text>
                        {info.strengths.map((str, idx) => (
                          <View key={idx} style={styles.bulletRow}>
                            <Text style={styles.greenCheck}>✓</Text>
                            <Text style={styles.bulletText}>{str}</Text>
                          </View>
                        ))}
                      </View>
                    ) : null}

                    {/* Shadow Challenges & Growth Points */}
                    {info.challenges && info.challenges.length > 0 ? (
                      <View style={{ marginTop: 4, marginBottom: 12 }}>
                        <Text style={[styles.sectionHeader, { color: '#C62828' }]}>⚠️ Shadow Challenges & Growth Areas:</Text>
                        {info.challenges.map((ch, idx) => (
                          <View key={idx} style={styles.bulletRow}>
                            <Text style={styles.redAlert}>•</Text>
                            <Text style={styles.bulletText}>{ch}</Text>
                          </View>
                        ))}
                      </View>
                    ) : null}

                    {/* Higher Spiritual Guidance */}
                    {info.spiritualGuidance ? (
                      <View style={[styles.epigeneticBox, { marginTop: 6, backgroundColor: '#FAF5EE', borderColor: '#FFE0B2' }]}>
                        <Text style={[styles.epigeneticTitle, { color: Colors.maroon }]}>🕊️ Higher Spiritual Guidance:</Text>
                        <Text style={styles.epigeneticBody}>{info.spiritualGuidance}</Text>
                      </View>
                    ) : null}

                    {/* Recommended Rituals & Remedies */}
                    {info.recommendedRituals ? (
                      <View style={[styles.epigeneticBox, { marginTop: 4, backgroundColor: '#FFF8E1', borderColor: '#FFE082' }]}>
                        <Text style={[styles.epigeneticTitle, { color: '#E65100' }]}>🪔 Recommended Rituals & Remedies:</Text>
                        <Text style={styles.epigeneticBody}>{info.recommendedRituals}</Text>
                      </View>
                    ) : null}

                    {/* Rudhyar Soli-Lunar Western Lunation Phase Synthesis */}
                    <View style={[styles.lunationCardBox, { marginTop: 8 }]}>
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

                {/* Tab 2: Solar & Leo Sovereign Purpose (Lunar Astro Matrix) */}
                {activeTab === 'LEO_SUN' && (
                  <View style={styles.detailCard}>
                    <Text style={styles.sectionHeader}>{getText(leoSunPurpose.generalDossier.title)}</Text>
                    <Text style={[styles.traitsBody, { fontWeight: '600', color: Colors.maroon }]}>
                      {getText(leoSunPurpose.generalDossier.subtitle)}
                    </Text>

                    {/* General Sun Overview */}
                    <View style={styles.epigeneticBox}>
                      <Text style={styles.epigeneticTitle}>☀️ Surya as Naisargika Atmakaraka:</Text>
                      <Text style={styles.epigeneticBody}>{getText(leoSunPurpose.generalDossier.whatIsSun)}</Text>
                      
                      <Text style={[styles.epigeneticTitle, { marginTop: 8 }]}>🦁 The Cosmic Throne of Leo:</Text>
                      <Text style={styles.epigeneticBody}>{getText(leoSunPurpose.generalDossier.significanceOfLeo)}</Text>
                      
                      <Text style={[styles.epigeneticTitle, { marginTop: 8, color: Colors.maroon }]}>👑 Core Sovereign Principle:</Text>
                      <Text style={styles.epigeneticBody}>{getText(leoSunPurpose.generalDossier.corePrinciple)}</Text>
                    </View>

                    {/* What Soul Craves */}
                    <Text style={[styles.sectionHeader, { marginTop: 14, color: '#B71C1C' }]}>
                      👑 {getText(leoSunPurpose.leoHouseDetail.title)}
                    </Text>
                    <View style={styles.bulletRow}>
                      <Text style={styles.greenCheck}>•</Text>
                      <Text style={styles.bulletText}>{getText(leoSunPurpose.leoHouseDetail.atmaIccha)}</Text>
                    </View>
                    <View style={styles.bulletRow}>
                      <Text style={styles.greenCheck}>•</Text>
                      <Text style={styles.bulletText}>{getText(leoSunPurpose.leoHouseDetail.karmicDrive)}</Text>
                    </View>

                    {/* How to Achieve It */}
                    <Text style={[styles.sectionHeader, { marginTop: 14, color: '#1B5E20' }]}>
                      ⚙️ {getText(leoSunPurpose.sunHouseDetail.title)}
                    </Text>
                    <View style={styles.bulletRow}>
                      <Text style={styles.greenCheck}>•</Text>
                      <Text style={styles.bulletText}>{getText(leoSunPurpose.sunHouseDetail.actionMechanism)}</Text>
                    </View>

                    {/* Synthesis Matrix */}
                    <View style={[styles.epigeneticBox, { marginTop: 14, backgroundColor: '#FFF8E1', borderColor: '#FFE082', borderWidth: 1 }]}>
                      <Text style={[styles.epigeneticTitle, { color: '#B71C1C' }]}>✨ Solar Soul Synthesis Matrix:</Text>
                      <Text style={[styles.epigeneticBody, { color: '#3E2723', fontWeight: '500' }]}>
                        {getText(leoSunPurpose.synthesisSummary)}
                      </Text>
                    </View>

                    {/* Additional Vedic Rules & Atmakaraka Alignments */}
                    {vedicReport.soulPurpose.length > 0 && (
                      <View style={{ marginTop: 14 }}>
                        <Text style={[styles.sectionHeader, { color: Colors.maroon }]}>📜 Additional Chart Placements & Atmakaraka Alignments:</Text>
                        {vedicReport.soulPurpose.map(rule => (
                          <View key={rule.id} style={[styles.epigeneticBox, { marginTop: 6, backgroundColor: '#FAF5EE' }]}>
                            <Text style={styles.epigeneticTitle}>{getText(rule.title, 'Soul Purpose')}</Text>
                            <Text style={styles.epigeneticBody}>{getText(rule.description)}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}

                {/* Tab 2: Tithi Shoonya (Dagdha Rashi / Burnt Signs & Personal Nullification) */}
                {activeTab === 'SHOONYA' && (
                  <View style={styles.detailCard}>
                    
                    {/* Upfront Reassuring Explanation of Burnt Signs */}
                    <View style={styles.reassuranceCard}>
                      <Text style={styles.reassuranceTitle}>🔥 What Does "Burnt Sign" (दग्ध राशि) Actually Mean?</Text>
                      <Text style={styles.reassuranceBody}>
                        <Text style={{ fontWeight: 'bold', color: '#C62828' }}>Does "Burnt" mean bad or ruined? ABSOLUTELY NOT! </Text>
                        In ancient Sanskrit, <Text style={{ fontStyle: 'italic' }}>"Dagdha"</Text> means <Text style={{ fontWeight: 'bold' }}>"Purification by Fire"</Text>. Just like raw gold is melted in fire to remove impurities, a Burnt Sign is a <Text style={{ fontWeight: 'bold' }}>Hidden Superpower</Text> that requires initial effort to unlock your highest potential!
                      </Text>

                      <View style={styles.threePillarsBox}>
                        <Text style={styles.pillarItem}>1. 🔥 <Text style={{ fontWeight: 'bold' }}>Purification by Fire:</Text> Initial effort turns into deep mastery.</Text>
                        <Text style={styles.pillarItem}>2. 🦁 <Text style={{ fontWeight: 'bold' }}>Hidden Superpower:</Text> Acts like a sleeping giant waiting to awaken.</Text>
                        <Text style={styles.pillarItem}>3. ✨ <Text style={{ fontWeight: 'bold' }}>Automatic Nullification:</Text> Most charts cancel the shadow into a Dhan Yoga!</Text>
                      </View>
                    </View>

                    {/* Personal Nullification Banner for this User's Kundali */}
                    <View style={[
                      styles.personalBanner,
                      shoonyaAnalysis.isNullified ? styles.bannerCancelled : styles.bannerActive
                    ]}>
                      <Text style={[
                        styles.bannerTitleText,
                        shoonyaAnalysis.isNullified ? styles.bannerTitleCancelled : styles.bannerTitleActive
                      ]}>
                        {shoonyaAnalysis.statusBannerTitle}
                      </Text>
                      <Text style={styles.bannerBodyText}>{shoonyaAnalysis.statusBannerBody}</Text>

                      {shoonyaAnalysis.nullificationReasons.length > 0 && (
                        <View style={styles.reasonsBox}>
                          <Text style={styles.reasonsHeader}>🔍 Kundali Analysis & Nullification Reasons:</Text>
                          {shoonyaAnalysis.nullificationReasons.map((r, idx) => (
                            <Text key={idx} style={styles.reasonItemText}>✓ {r}</Text>
                          ))}
                        </View>
                      )}
                    </View>

                    {/* User's Specific Burnt Signs Details */}
                    {!shoonyaAnalysis.isPurnimaOrAmavasya && (
                      <View style={styles.shoonyabox}>
                        <Text style={styles.shoonyaLabel}>Burnt Signs for Your Birth Tithi:</Text>
                        <Text style={styles.shoonyaVal}>{shoonyaAnalysis.dagdhaRashiNames.join(' & ')}</Text>

                        <Text style={[styles.shoonyaLabel, { marginTop: 6 }]}>Ruling Planets Affected:</Text>
                        <Text style={styles.shoonyaVal}>{shoonyaAnalysis.affectedLords.join(', ')}</Text>

                        <Text style={[styles.shoonyaLabel, { marginTop: 6 }]}>Planets in Your Burnt Signs:</Text>
                        <Text style={styles.shoonyaSubVal}>
                          {shoonyaAnalysis.planetsInDagdhaSigns.length > 0
                            ? shoonyaAnalysis.planetsInDagdhaSigns.join(', ')
                            : 'None (Your burnt signs are empty in your birth chart)'}
                        </Text>

                        <Text style={[styles.shoonyaLabel, { marginTop: 6 }]}>Life Placement Impact:</Text>
                        <Text style={styles.shoonyaSubVal}>{info.dagdhaImpact}</Text>
                      </View>
                    )}

                    {/* Principles of Nullification Laws */}
                    <Text style={[styles.sectionHeader, { marginTop: 10, color: '#2E7D32' }]}>
                      ⚖️ Universal Nullification Laws (Dagdha Dosha Bhanga)
                    </Text>
                    
                    <View style={styles.nullificationTipsBox}>
                      <Text style={styles.nullificationTipTitle}>💡 How Tithi Shoonya is Cancelled in Vedic Astrology:</Text>
                      <Text style={styles.nullificationTipItem}>• <Text style={{ fontWeight: 'bold' }}>Dusthana Placement (3rd, 6th, 8th, 12th):</Text> If the lord of the burnt sign sits in a struggle house, harm is restricted and turned into strength.</Text>
                      <Text style={styles.nullificationTipItem}>• <Text style={{ fontWeight: 'bold' }}>Retrograde Exception (वक्री):</Text> A Retrograde planet in its own Dagdha Rashi shines straight through the shadow.</Text>
                      <Text style={styles.nullificationTipItem}>• <Text style={{ fontWeight: 'bold' }}>Malefic Conjunction:</Text> Conjunction with Saturn, Mars, Rahu, or Ketu neutralizes the shadow into wealth.</Text>
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
    paddingVertical: 4,
    paddingHorizontal: 2,
    gap: 10,
  },
  tabBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: Colors.maroon,
    borderColor: '#FFD700',
    borderWidth: 1.5,
    elevation: 3,
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
    paddingHorizontal: 4,
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

  // Reassurance Upfront Explanation
  reassuranceCard: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFB300',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  reassuranceTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 4,
  },
  reassuranceBody: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 17,
    marginBottom: 8,
  },
  threePillarsBox: {
    backgroundColor: '#FFFDE7',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  pillarItem: {
    fontSize: 10,
    color: Colors.textPrimary,
    marginBottom: 3,
  },

  // Personal Banner
  personalBanner: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1.5,
  },
  bannerCancelled: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  bannerActive: {
    backgroundColor: '#FFF3E0',
    borderColor: '#E65100',
  },
  bannerTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerTitleCancelled: {
    color: '#2E7D32',
  },
  bannerTitleActive: {
    color: '#E65100',
  },
  bannerBodyText: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  reasonsBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  reasonsHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 4,
  },
  reasonItemText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 2,
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
    backgroundColor: '#FAF5EE',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E0D0',
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
    color: Colors.maroon,
    marginTop: 2,
  },
  shoonyaSubVal: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 2,
    lineHeight: 16,
  },
  nullificationTipsBox: {
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  nullificationTipTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
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
