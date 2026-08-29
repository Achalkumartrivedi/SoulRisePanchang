import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { MuhuratTiming } from '../types/panchang';
import { useLanguage } from '../context/LanguageContext';
import { ABHIJIT_GUIDE } from '../data/abhijitGuideRepository';
import { BRAHMA_GUIDE } from '../data/brahmaGuideRepository';
import { VIJAYA_GUIDE } from '../data/vijayaGuideRepository';
import { RAHU_GUIDE, YAMAGANDA_GUIDE, GULIKA_GUIDE } from '../data/inauspiciousGuideRepository';

interface MuhuratCardProps {
  auspicious: MuhuratTiming[];
  inauspicious: MuhuratTiming[];
}

const ABHIJIT_LANG_MAP: Record<string, string> = {
  hinglish: 'Abhijit Muhurat',
  hi: 'अभिजित मुहूर्त',
  gu: 'અભિજીત મુહૂર્ત',
  ta: 'அபிஜித் முகூர்த்தம்',
  te: 'అభిజిత్ ముహుర్తం',
  bn: 'অভিজিৎ মুহূর্ত',
  mr: 'अभिजित मुहूर्त',
  en: 'Abhijit Time',
  ru: 'Время Абхиджит',
  fr: 'Heure Abhijit',
  es: 'Hora Abhijit',
  he: "זמן אבהיג'יט",
  id: 'Waktu Abhijit',
  th: 'เวลาอภิจิต'
};

const BRAHMA_LANG_MAP: Record<string, string> = {
  hinglish: 'Brahma Muhurat',
  hi: 'ब्रह्म मुहूर्त',
  gu: 'બ્રહ્મ મુહૂર્ત',
  ta: 'பிரம்ம முகூர்த்தம்',
  te: 'బ్రహ్మ ముహుర్తం',
  bn: 'ব্রহ্ম মুহূর্ত',
  mr: 'ब्रह्म मुहूर्त',
  en: 'Brahma Time',
  ru: 'Время Брахма',
  fr: 'Heure Brahma',
  es: 'Hora Brahma',
  he: 'זמן בראהמה',
  id: 'Waktu Brahma',
  th: 'เวลาพรหม'
};

const VIJAYA_LANG_MAP: Record<string, string> = {
  hinglish: 'Vijaya Muhurat',
  hi: 'विजय मुहूर्त',
  gu: 'વિજય મુહૂર્ત',
  ta: 'விஜய முகூர்த்தம்',
  te: 'విజయ ముహుర్తం',
  bn: 'বিজয় মুহূর্ত',
  mr: 'विजय मुहूर्त',
  en: 'Vijaya Time',
  ru: 'Время Виджая',
  fr: 'Heure Vijaya',
  es: 'Hora Vijaya',
  he: "זמן ויג'איה",
  id: 'Waktu Vijaya',
  th: 'เวลาวิชัย'
};

const RAHU_LANG_MAP: Record<string, string> = {
  hinglish: 'Rahu Kalam',
  hi: 'राहु काल',
  gu: 'રાહુ કાળ',
  ta: 'ராகு காலம்',
  te: 'రాహు కాలం',
  bn: 'রাহু কাল',
  mr: 'राहु काल',
  en: 'Rahu Kalam',
  ru: 'Раху Калам',
  fr: 'Rahu Kalam',
  es: 'Rahu Kalam',
  he: 'ראחו קאלם',
  id: 'Rahu Kalam',
  th: 'ราหูกาล'
};

const YAMAGANDA_LANG_MAP: Record<string, string> = {
  hinglish: 'Yamaganda Kalam',
  hi: 'यमगण्ड काल',
  gu: 'યમગંડ કાળ',
  ta: 'எமகண்டம்',
  te: 'యమగండ కాలం',
  bn: 'যমগণ্ড কাল',
  mr: 'यमगंड काल',
  en: 'Yamaganda Kalam',
  ru: 'Ямаганда Калам',
  fr: 'Yamaganda Kalam',
  es: 'Yamaganda Kalam',
  he: 'יאמאגאנדה קאלם',
  id: 'Yamaganda Kalam',
  th: 'ยมกาล'
};

const GULIKA_LANG_MAP: Record<string, string> = {
  hinglish: 'Gulika Kalam',
  hi: 'गुलिक काल',
  gu: 'ગુલિક કાળ',
  ta: 'குளிகை காலம்',
  te: 'గుళిక కాలం',
  bn: 'গুলিক কাল',
  mr: 'गुलिक काल',
  en: 'Gulika Kalam',
  ru: 'Гулика Калам',
  fr: 'Gulika Kalam',
  es: 'Gulika Kalam',
  he: 'גוליקה קאלם',
  id: 'Gulika Kalam',
  th: 'กุลิกกาล'
};

export const MuhuratCard: React.FC<MuhuratCardProps> = ({ auspicious, inauspicious }) => {
  const { language, t } = useLanguage();
  const [activeInfoModal, setActiveInfoModal] = useState<'AUSPICIOUS' | 'INAUSPICIOUS' | null>(null);
  
  // Modals for Auspicious Timings
  const [showAbhijitDetailModal, setShowAbhijitDetailModal] = useState<boolean>(false);
  const [showBrahmaDetailModal, setShowBrahmaDetailModal] = useState<boolean>(false);
  const [showVijayaDetailModal, setShowVijayaDetailModal] = useState<boolean>(false);

  // Modals for Inauspicious Timings
  const [showRahuDetailModal, setShowRahuDetailModal] = useState<boolean>(false);
  const [showYamaDetailModal, setShowYamaDetailModal] = useState<boolean>(false);
  const [showGulikaDetailModal, setShowGulikaDetailModal] = useState<boolean>(false);

  const abhijitGuide = ABHIJIT_GUIDE[language] || ABHIJIT_GUIDE.hinglish;
  const brahmaGuide = BRAHMA_GUIDE[language] || BRAHMA_GUIDE.hinglish;
  const vijayaGuide = VIJAYA_GUIDE[language] || VIJAYA_GUIDE.hinglish;

  const rahuGuide = RAHU_GUIDE[language] || RAHU_GUIDE.hinglish;
  const yamaGuide = YAMAGANDA_GUIDE[language] || YAMAGANDA_GUIDE.hinglish;
  const gulikaGuide = GULIKA_GUIDE[language] || GULIKA_GUIDE.hinglish;

  const getCleanMuhuratName = (item: MuhuratTiming) => {
    const nameLower = item.name.toLowerCase();
    const hindiLower = item.hindiName || '';

    const isAbhijit = nameLower.includes('abhijit') || hindiLower.includes('अभिजित') || hindiLower.includes('अभिजीत');
    const isBrahma = nameLower.includes('brahma') || hindiLower.includes('ब्रह्म');
    const isVijaya = nameLower.includes('vijaya') || hindiLower.includes('विजय');

    const isRahu = nameLower.includes('rahu') || hindiLower.includes('राहु') || hindiLower.includes('ராகு');
    const isYama = nameLower.includes('yama') || hindiLower.includes('यम') || hindiLower.includes('எம');
    const isGulika = nameLower.includes('gulika') || hindiLower.includes('गुलिक') || hindiLower.includes('குளிகை');

    if (isAbhijit && ABHIJIT_LANG_MAP[language]) return ABHIJIT_LANG_MAP[language];
    if (isBrahma && BRAHMA_LANG_MAP[language]) return BRAHMA_LANG_MAP[language];
    if (isVijaya && VIJAYA_LANG_MAP[language]) return VIJAYA_LANG_MAP[language];

    if (isRahu && RAHU_LANG_MAP[language]) return RAHU_LANG_MAP[language];
    if (isYama && YAMAGANDA_LANG_MAP[language]) return YAMAGANDA_LANG_MAP[language];
    if (isGulika && GULIKA_LANG_MAP[language]) return GULIKA_LANG_MAP[language];

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
        const isBrahma = item.name.toLowerCase().includes('brahma') || item.hindiName.includes('ब्रह्म');
        const isVijaya = item.name.toLowerCase().includes('vijaya') || item.hindiName.includes('विजय');

        return (
          <TouchableOpacity
            key={index}
            style={[styles.muhuratItem, styles.auspiciousBorder]}
            onPress={() => {
              if (isAbhijit) setShowAbhijitDetailModal(true);
              else if (isBrahma) setShowBrahmaDetailModal(true);
              else if (isVijaya) setShowVijayaDetailModal(true);
              else setActiveInfoModal('AUSPICIOUS');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.muhuratTop}>
              <Text style={styles.muhuratName} numberOfLines={1}>
                {getCleanMuhuratName(item)}
              </Text>
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

      {inauspicious.map((item, index) => {
        const nameLower = item.name.toLowerCase();
        const hindiLower = item.hindiName || '';

        const isRahu = nameLower.includes('rahu') || hindiLower.includes('राहु');
        const isYama = nameLower.includes('yama') || hindiLower.includes('यम');
        const isGulika = nameLower.includes('gulika') || hindiLower.includes('गुलिक');

        return (
          <TouchableOpacity
            key={index}
            style={[styles.muhuratItem, styles.inauspiciousBorder]}
            onPress={() => {
              if (isRahu) setShowRahuDetailModal(true);
              else if (isYama) setShowYamaDetailModal(true);
              else if (isGulika) setShowGulikaDetailModal(true);
              else setActiveInfoModal('INAUSPICIOUS');
            }}
            activeOpacity={0.7}
          >
            <View style={styles.muhuratTop}>
              <Text style={styles.muhuratNameRed} numberOfLines={1}>
                {getCleanMuhuratName(item)}
              </Text>
              <Text style={styles.inauspiciousTime}>{item.startTime} - {item.endTime}</Text>
            </View>
            <Text style={styles.muhuratDesc}>{item.description}</Text>
          </TouchableOpacity>
        );
      })}

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

      {/* 2. Detailed Abhijit Time Educational Modal */}
      <Modal
        visible={showAbhijitDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAbhijitDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.guideModalCard}>
            <View style={styles.guideHeader}>
              <Text style={styles.guideHeaderTitle}>{abhijitGuide.modalHeaderTitle}</Text>
              <TouchableOpacity onPress={() => setShowAbhijitDetailModal(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.guideScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.guideSubtitle}>{abhijitGuide.subtitle}</Text>

              {/* What is Abhijit Time */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>📌 {abhijitGuide.whatIsTitle}</Text>
                {abhijitGuide.whatIsPoints.map((pt, idx) => (
                  <Text key={idx} style={styles.guidePointText}>• {pt}</Text>
                ))}
                <View style={styles.examplePill}>
                  <Text style={styles.examplePillText}>💡 {abhijitGuide.exampleText}</Text>
                </View>
              </View>

              {/* Meaning */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>🔍 {abhijitGuide.meaningTitle}</Text>
                <Text style={styles.guideBodyText}>{abhijitGuide.meaningText}</Text>
              </View>

              {/* Auspicious Reason */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>☀️ {abhijitGuide.auspiciousReasonTitle}</Text>
                <Text style={styles.guideBodyText}>{abhijitGuide.auspiciousReasonText}</Text>
              </View>

              {/* Good For */}
              <View style={styles.guideBoxGood}>
                <Text style={styles.guideBoxTitleGood}>✅ {abhijitGuide.goodForTitle}</Text>
                {abhijitGuide.goodForItems.map((item, idx) => (
                  <Text key={idx} style={styles.guideGoodItem}>✔ {item}</Text>
                ))}
              </View>

              {/* Avoid */}
              <View style={styles.guideBoxBad}>
                <Text style={styles.guideBoxTitleBad}>⚠️ {abhijitGuide.avoidTitle}</Text>
                <Text style={styles.guideBadText}>{abhijitGuide.avoidText}</Text>
              </View>

              {/* History */}
              <View style={styles.guideBoxHistory}>
                <Text style={styles.guideBoxTitleHistory}>📜 {abhijitGuide.historyTitle}</Text>
                <Text style={styles.guideHistoryText}>{abhijitGuide.historyText}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.gotItBtn} onPress={() => setShowAbhijitDetailModal(false)}>
              <Text style={styles.gotItBtnText}>Close / Close Guide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3. Detailed Brahma Time Educational Modal */}
      <Modal
        visible={showBrahmaDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBrahmaDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.guideModalCard}>
            <View style={styles.guideHeader}>
              <Text style={styles.guideHeaderTitle}>{brahmaGuide.modalHeaderTitle}</Text>
              <TouchableOpacity onPress={() => setShowBrahmaDetailModal(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.guideScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.guideSubtitle}>{brahmaGuide.subtitle}</Text>

              {/* What is Brahma Muhurat */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>📌 {brahmaGuide.whatIsTitle}</Text>
                <Text style={styles.guideBodyText}>{brahmaGuide.whatIsText}</Text>
              </View>

              {/* Meaning */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>🔍 {brahmaGuide.meaningTitle}</Text>
                {brahmaGuide.meaningPoints.map((pt, idx) => (
                  <Text key={idx} style={styles.guidePointText}>• {pt}</Text>
                ))}
                <Text style={[styles.guideBodyText, { marginTop: 4 }]}>{brahmaGuide.meaningSummary}</Text>
              </View>

              {/* Timing */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>⏰ {brahmaGuide.timingTitle}</Text>
                {brahmaGuide.timingPoints.map((pt, idx) => (
                  <Text key={idx} style={styles.guidePointText}>• {pt}</Text>
                ))}
              </View>

              {/* Why Special */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>🌟 {brahmaGuide.whySpecialTitle}</Text>
                {brahmaGuide.whySpecialPoints.map((pt, idx) => (
                  <Text key={idx} style={styles.guidePointText}>• {pt}</Text>
                ))}
              </View>

              {/* Best Activities */}
              <View style={styles.guideBoxGood}>
                <Text style={styles.guideBoxTitleGood}>✅ {brahmaGuide.bestActivitiesTitle}</Text>
                {brahmaGuide.bestActivitiesItems.map((item, idx) => (
                  <Text key={idx} style={styles.guideGoodItem}>✔ {item}</Text>
                ))}
              </View>

              {/* Quick Fact */}
              <View style={styles.guideBoxHistory}>
                <Text style={styles.guideBoxTitleHistory}>💡 {brahmaGuide.quickFactTitle}</Text>
                <Text style={styles.guideHistoryText}>{brahmaGuide.quickFactText}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.gotItBtn} onPress={() => setShowBrahmaDetailModal(false)}>
              <Text style={styles.gotItBtnText}>Close / Close Guide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 4. Detailed Vijaya Time Educational Modal */}
      <Modal
        visible={showVijayaDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowVijayaDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.guideModalCard}>
            <View style={styles.guideHeader}>
              <Text style={styles.guideHeaderTitle}>{vijayaGuide.modalHeaderTitle}</Text>
              <TouchableOpacity onPress={() => setShowVijayaDetailModal(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.guideScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.guideSubtitle}>{vijayaGuide.subtitle}</Text>

              {/* What is Vijaya Muhurat */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>📌 {vijayaGuide.whatIsTitle}</Text>
                <Text style={styles.guideBodyText}>{vijayaGuide.whatIsText}</Text>
              </View>

              {/* Meaning */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>🔍 {vijayaGuide.meaningTitle}</Text>
                {vijayaGuide.meaningPoints.map((pt, idx) => (
                  <Text key={idx} style={styles.guidePointText}>• {pt}</Text>
                ))}
                <Text style={[styles.guideBodyText, { marginTop: 4 }]}>{vijayaGuide.meaningSummary}</Text>
              </View>

              {/* Timing */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>⏰ {vijayaGuide.timingTitle}</Text>
                {vijayaGuide.timingPoints.map((pt, idx) => (
                  <Text key={idx} style={styles.guidePointText}>• {pt}</Text>
                ))}
              </View>

              {/* Why Special */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>🌟 {vijayaGuide.whySpecialTitle}</Text>
                {vijayaGuide.whySpecialPoints.map((pt, idx) => (
                  <Text key={idx} style={styles.guidePointText}>• {pt}</Text>
                ))}
              </View>

              {/* Best Activities */}
              <View style={styles.guideBoxGood}>
                <Text style={styles.guideBoxTitleGood}>✅ {vijayaGuide.bestActivitiesTitle}</Text>
                {vijayaGuide.bestActivitiesItems.map((item, idx) => (
                  <Text key={idx} style={styles.guideGoodItem}>✔ {item}</Text>
                ))}
              </View>

              {/* Quick Fact */}
              <View style={styles.guideBoxHistory}>
                <Text style={styles.guideBoxTitleHistory}>💡 {vijayaGuide.quickFactTitle}</Text>
                <Text style={styles.guideHistoryText}>{vijayaGuide.quickFactText}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.gotItBtn} onPress={() => setShowVijayaDetailModal(false)}>
              <Text style={styles.gotItBtnText}>Close / Close Guide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 5. Detailed Rahu Kalam Educational Modal */}
      <Modal
        visible={showRahuDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRahuDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.guideModalCard}>
            <View style={styles.guideHeader}>
              <Text style={styles.guideHeaderTitle}>{rahuGuide.modalHeaderTitle}</Text>
              <TouchableOpacity onPress={() => setShowRahuDetailModal(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.guideScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.guideSubtitle}>{rahuGuide.subtitle}</Text>

              {/* Meaning */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>🔍 {rahuGuide.meaningTitle}</Text>
                <Text style={styles.guideBodyText}>{rahuGuide.meaningText}</Text>
              </View>

              {/* Why Called */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>❓ {rahuGuide.whyCalledTitle}</Text>
                <Text style={styles.guideBodyText}>{rahuGuide.whyCalledText}</Text>
              </View>

              {/* Why Avoided */}
              <View style={styles.guideBoxBad}>
                <Text style={styles.guideBoxTitleBad}>⚠️ {rahuGuide.whyAvoidedTitle}</Text>
                <Text style={styles.guideBadText}>{rahuGuide.whyAvoidedText}</Text>
              </View>

              {/* Note */}
              <View style={styles.guideBoxHistory}>
                <Text style={styles.guideBoxTitleHistory}>ℹ️ Note</Text>
                <Text style={styles.guideHistoryText}>{rahuGuide.noteText}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.gotItBtn} onPress={() => setShowRahuDetailModal(false)}>
              <Text style={styles.gotItBtnText}>Close / Close Guide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 6. Detailed Yamaganda Kalam Educational Modal */}
      <Modal
        visible={showYamaDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowYamaDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.guideModalCard}>
            <View style={styles.guideHeader}>
              <Text style={styles.guideHeaderTitle}>{yamaGuide.modalHeaderTitle}</Text>
              <TouchableOpacity onPress={() => setShowYamaDetailModal(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.guideScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.guideSubtitle}>{yamaGuide.subtitle}</Text>

              {/* Meaning */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>🔍 {yamaGuide.meaningTitle}</Text>
                <Text style={styles.guideBodyText}>{yamaGuide.meaningText}</Text>
              </View>

              {/* Why Called */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>❓ {yamaGuide.whyCalledTitle}</Text>
                <Text style={styles.guideBodyText}>{yamaGuide.whyCalledText}</Text>
              </View>

              {/* Why Avoided */}
              <View style={styles.guideBoxBad}>
                <Text style={styles.guideBoxTitleBad}>⚠️ {yamaGuide.whyAvoidedTitle}</Text>
                <Text style={styles.guideBadText}>{yamaGuide.whyAvoidedText}</Text>
              </View>

              {/* Note */}
              <View style={styles.guideBoxHistory}>
                <Text style={styles.guideBoxTitleHistory}>ℹ️ Note</Text>
                <Text style={styles.guideHistoryText}>{yamaGuide.noteText}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.gotItBtn} onPress={() => setShowYamaDetailModal(false)}>
              <Text style={styles.gotItBtnText}>Close / Close Guide</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 7. Detailed Gulika Kalam Educational Modal */}
      <Modal
        visible={showGulikaDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGulikaDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.guideModalCard}>
            <View style={styles.guideHeader}>
              <Text style={styles.guideHeaderTitle}>{gulikaGuide.modalHeaderTitle}</Text>
              <TouchableOpacity onPress={() => setShowGulikaDetailModal(false)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.guideScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.guideSubtitle}>{gulikaGuide.subtitle}</Text>

              {/* Meaning */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>🔍 {gulikaGuide.meaningTitle}</Text>
                <Text style={styles.guideBodyText}>{gulikaGuide.meaningText}</Text>
              </View>

              {/* Why Called */}
              <View style={styles.guideBox}>
                <Text style={styles.guideBoxTitle}>❓ {gulikaGuide.whyCalledTitle}</Text>
                <Text style={styles.guideBodyText}>{gulikaGuide.whyCalledText}</Text>
              </View>

              {/* Why Avoided */}
              <View style={styles.guideBoxBad}>
                <Text style={styles.guideBoxTitleBad}>⚠️ {gulikaGuide.whyAvoidedTitle}</Text>
                <Text style={styles.guideBadText}>{gulikaGuide.whyAvoidedText}</Text>
              </View>

              {/* Note */}
              <View style={styles.guideBoxHistory}>
                <Text style={styles.guideBoxTitleHistory}>ℹ️ Note</Text>
                <Text style={styles.guideHistoryText}>{gulikaGuide.noteText}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.gotItBtn} onPress={() => setShowGulikaDetailModal(false)}>
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
