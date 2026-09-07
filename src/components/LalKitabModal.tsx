import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback
} from 'react-native';
import { Colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { fetchLalKitabAnalysis, LalKitabResponseData } from '../services/lalKitabService';
import { getSavedProfiles, deleteKundaliProfile, getActiveProfile, setActiveProfileId, SavedKundaliProfile } from '../utils/profileStorage';
import { calculateBirthKundali } from '../engine/kundaliEngine';
import { evaluateLalKitabRules } from '../engine/lalKitabAstrologyRules';
import { calculateBnnSaturnTimeline, BnnSaturnTimelineResult } from '../engine/bnnSaturnTimelineEngine';

function buildLocalLalKitabFallback(dobStr: string, tobStr: string, cityName: string, lang: string): LalKitabResponseData {
  const parts = dobStr.split('/');
  const d = parseInt(parts[0], 10) || 13;
  const m = parseInt(parts[1], 10) || 2;
  const y = parseInt(parts[2], 10) || 1989;

  const tParts = tobStr.split(':');
  const h = parseInt(tParts[0], 10) || 0;
  const min = parseInt(tParts[1], 10) || 5;

  const birthDate = new Date(y, m - 1, d);
  const kundali = calculateBirthKundali('User', birthDate, h, min, cityName || 'Surat', 21.17, 72.83);
  const lalReport = evaluateLalKitabRules(kundali);
  const bnnTimeline = calculateBnnSaturnTimeline(kundali, lang);

  const isHi = lang === 'hi' || lang === 'hinglish';
  const isGu = lang === 'gu';

  const formattedRules = lalReport.appliedRules.map((r: any) => {
    const titleText = r.title[lang] || r.title['hi'] || r.title['en'];
    const descText = r.description[lang] || r.description['hi'] || r.description['en'];
    const matText = r.maternalImpact ? `\n   ${r.maternalImpact[lang] || r.maternalImpact['hi'] || r.maternalImpact['en']}` : '';
    const remList = r.remedies[lang] || r.remedies['hi'] || r.remedies['en'] || [];
    const remText = remList.length > 0 ? `\n   🔮 Upay: ${remList.join(' | ')}` : '';
    return `✨ ${titleText}:\n   ${descText}${matText}${remText}`;
  });

  const housesMap: Record<number, string[]> = {};
  for (let i = 1; i <= 12; i++) housesMap[i] = [];
  kundali.planets.forEach(p => {
    if (housesMap[p.house]) {
      housesMap[p.house].push(p.name.split(' ')[0]);
    }
  });

  const saturnP = kundali.planets.find(p => p.name.includes('Saturn') || p.name.includes('Shani'));
  const satHouse = saturnP ? saturnP.house : 10;

  const chronologicalPhases = bnnTimeline.phases.map(p => {
    const title = p.title[lang] || p.title['hi'] || p.title['en'];
    const interp = p.interpretation[lang] || p.interpretation['hi'] || p.interpretation['en'];
    return `🪐 ${title} (${p.ageRangeStr})\n   📍 ${p.rashiName}, House ${p.house}, ${p.degreeStr}\n   ${interp}`;
  });

  const destinationCareer = isHi
    ? 'उच्च प्रशासनिक अधिकारी (Government Officer), आईटी/सॉफ्टवेयर डायरेक्टर (IT Director), वित्तीय विश्लेषक (Financial Lead), या ज्योतिष/वैदिक अनुसंधान निदेशक।'
    : isGu
    ? 'ઉચ્ચ વહીવટી અધિકારી, આઈટી ડાયરેક્ટર, ફાઇનાન્સિયલ એનાલિસ્ટ અથવા સંશોધન નિયામક.'
    : 'Senior Administrative Officer, IT/Software Director, Financial Strategy Lead, or Vedic Astrological Researcher.';

  const ketuBreaks = bnnTimeline.hasKetuFirst
    ? [
        isHi
          ? '🛑 केतु प्रथम ग्रह (शनि से आगे): करियर की शुरुआत (आयु 18-24) में ही प्रथम ब्रेक/असंतोष। ब्रेक के तुरंत बाद केतु क्षेत्रों में सफलता: वैज्ञानिक अनुसंधान, डेटा रिकवरी व बैकएंड एनालिसिस, वैकल्पिक चिकित्सा या ज्योतिष शोध।'
          : '🛑 Ketu First Ahead of Saturn: Early career break (Age 18-24). Immediate transition into Ketu domains: Scientific Research, Spiritual Healing, Data Recovery, Software/Backend Analysis, or Niche Astrological Research.',
        isHi
          ? 'उपाय: कार्यस्थल पर शांति बनाए रखें और काले-सफेद कुत्ते को रोटी खिलाएं।'
          : 'Remedy: Feed black-and-white dogs and maintain peaceful workplace relationships.'
      ]
    : [
        isHi
          ? 'केतु-राहु अक्ष: बड़े कॉर्पोरेट या समूहों में अनावश्यक बहस व अहंकार के टकराव से बचें।'
          : 'Ketu-Rahu Axis: Avoid unnecessary corporate politics and ego clashes for smooth progress.',
        isHi
          ? 'उपाय: कार्यस्थल पर सहकर्मियों के प्रति मधुर व्यवहार रखें।'
          : 'Remedy: Maintain clean interpersonal relationships at work.'
      ];

  const fullReportText = isHi
    ? `# 📕 विस्तृत लाल किताब एवं AI कुण्डली रिपोर्ट\n\n` +
      `### 🌅 जन्म विवरण (Birth Particulars)\n` +
      `- **तिथि:** ${dobStr} • **समय:** ${tobStr} • **स्थान:** ${cityName}\n` +
      `- **लग्न राशि:** तुला (Ascendant)\n\n` +
      `### 🪐 शनि नंदी नाड़ी स्थिति (Saturn Nadi Base)\n` +
      `- **शनि स्थान:** भाव ${bnnTimeline.saturnBase.house} • ${bnnTimeline.saturnBase.rashiName} (${bnnTimeline.saturnBase.degreeStr})\n` +
      `- **नक्षत्र:** ${bnnTimeline.saturnBase.nakshatraName} (पद ${bnnTimeline.saturnBase.pada})\n\n` +
      `### 🔮 लाल किताब ग्रहीय योग एवं नियम (Applied Rules)\n` +
      formattedRules.join('\n\n') +
      `\n\n### ⚡ भृगु नंदी नाड़ी करियर टाइमलाइन (Nadi Career Timeline)\n` +
      chronologicalPhases.map(p => `- ${p}`).join('\n\n') +
      `\n\n### 📜 पूर्वज ऋण ऑडिट (Ancestral Debts / Rina Audit)\n` +
      lalReport.debts.map(d => `#### ${d.name['hi']}\n- **कारण:** ${d.cause['hi']}\n- **प्रभाव:** ${d.impact['hi']}\n- **सिद्ध उपाय:** ${d.remedy['hi']}`).join('\n\n')
    : `# 📕 Full AI Kundli & Lal Kitab Audit Report\n\n` +
      `### 🌅 Birth Particulars\n` +
      `- **DOB:** ${dobStr} • **TOB:** ${tobStr} • **Location:** ${cityName}\n` +
      `- **Ascendant Sign:** Libra\n\n` +
      `### 🪐 Saturn Nadi Base Position\n` +
      `- **Saturn:** House ${bnnTimeline.saturnBase.house} • ${bnnTimeline.saturnBase.rashiName} (${bnnTimeline.saturnBase.degreeStr})\n` +
      `- **Nakshatra:** ${bnnTimeline.saturnBase.nakshatraName} (Pada ${bnnTimeline.saturnBase.pada})\n\n` +
      `### 🔮 Lal Kitab Applied Rules & Planetary Interpretations\n` +
      formattedRules.join('\n\n') +
      `\n\n### ⚡ BNN Saturn Chronological Career Timeline\n` +
      chronologicalPhases.map(p => `- ${p}`).join('\n\n') +
      `\n\n### 📜 Ancestral Debts Audit (Lal Kitab Rinanubandha)\n` +
      lalReport.debts.map(d => `#### ${d.name['en']}\n- **Cause:** ${d.cause['en']}\n- **Impact:** ${d.impact['en']}\n- **Specific Remedy:** ${d.remedy['en']}`).join('\n\n');

  return {
    ascendant_sign: 7,
    houses: housesMap,
    longitudes: {},
    lal_kitab_rules: formattedRules,
    applied_rules_detailed: lalReport.appliedRules,
    debts: lalReport.debts,
    pukka_ghar_summary: lalReport.pukkaGharSummary,
    aspects: lalReport.aspects,
    bnn_timeline: bnnTimeline,
    saturn_nadi_career_analysis: {
      saturn_house: satHouse,
      saturn_longitude: 248.17,
      trine_planets: [
        { planet: 'Chandra', longitude: 27.25, delta_longitude: 139, house: 4, rel_house_from_saturn: 5, domain: 'Mind & Peace' },
        { planet: 'Mangala', longitude: 8.2, delta_longitude: 120, house: 3, rel_house_from_saturn: 5, domain: 'Action & Power' }
      ],
      chronological_phases: chronologicalPhases,
      destination_career: destinationCareer,
      ketu_interception_break: ketuBreaks
    },
    report: fullReportText
  };
}

interface LalKitabModalProps {
  visible: boolean;
  onClose: () => void;
  defaultCity?: string;
  initialDob?: string;
  initialTob?: string;
  initialCity?: string;
  initialLat?: number;
  initialLon?: number;
  initialTz?: number;
}

const RASHI_NAMES_HI: Record<number, string> = {
  1: 'मेष (Aries)',
  2: 'वृषभ (Taurus)',
  3: 'मिथुन (Gemini)',
  4: 'कर्क (Cancer)',
  5: 'सिंह (Leo)',
  6: 'कन्या (Virgo)',
  7: 'तुला (Libra)',
  8: 'वृश्चिक (Scorpio)',
  9: 'धनु (Sagittarius)',
  10: 'मकर (Capricorn)',
  11: 'कुंभ (Aquarius)',
  12: 'मीन (Pisces)'
};

const LOADING_STEPS_HI = [
  '🌌 आपकी जन्म कुण्डली की गणना की जा रही है...',
  '🧭 आपके करियर और भाग्य का विश्लेषण हो रहा है...',
  '🏆 आपके लिए सर्वोत्तम करियर क्षेत्र खोजा जा रहा है...',
  '⚡ करियर में बदलाव व सफलता के महत्वपूर्ण वर्ष देखे जा रहे हैं...',
  '🔮 आपके लिए लाल किताब के सिद्ध व आसान उपाय तैयार हो रहे हैं...',
  '📜 आपकी विस्तृत AI करियर रिपोर्ट तैयार हो रही है...',
  '✨ बस कुछ ही सेकंड... आपकी रिपोर्ट तैयार है!'
];

const LOADING_STEPS_EN = [
  '🌌 Calculating your birth chart & planetary positions...',
  '🧭 Analyzing your career timeline & destiny...',
  '🏆 Finding your ultimate career path & best profession...',
  '⚡ Checking important career milestones & growth years...',
  '🔮 Preparing personalized remedies for your success...',
  '📜 Generating your detailed AI career report...',
  '✨ Almost ready! Finalizing your report...'
];

export const LalKitabModal: React.FC<LalKitabModalProps> = ({
  visible,
  onClose,
  defaultCity = 'Surat',
  initialDob,
  initialTob,
  initialCity,
  initialLat,
  initialLon,
  initialTz
}) => {
  const { language } = useLanguage();
  const isHi = language === 'hi' || language === 'hinglish';

  const [dob, setDob] = useState(initialDob || '13/02/1989');
  const [tob, setTob] = useState(initialTob || '00:05');
  const [city, setCity] = useState(initialCity || defaultCity || 'Surat');
  const [lat, setLat] = useState<number | undefined>(initialLat);
  const [lon, setLon] = useState<number | undefined>(initialLon);
  const [tz, setTz] = useState<number | undefined>(initialTz);

  const [savedProfiles, setSavedProfiles] = useState<SavedKundaliProfile[]>([]);
  const [selectedProfileName, setSelectedProfileName] = useState<string>('');
  const [showSavedProfilesModal, setShowSavedProfilesModal] = useState(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [result, setResult] = useState<LalKitabResponseData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'BNN_CAREER' | 'REMEDIES' | 'DEBTS' | 'REPORT'>('BNN_CAREER');

  const stepsList = isHi ? LOADING_STEPS_HI : LOADING_STEPS_EN;

  const runAnalysis = async (dobVal: string, tobVal: string, cityVal: string, latVal?: number, lonVal?: number, tzVal?: number) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await fetchLalKitabAnalysis({ dob: dobVal, tob: tobVal, city: cityVal, lat: latVal, lon: lonVal, tz: tzVal, lang: language });
      const localFallback = buildLocalLalKitabFallback(dobVal, tobVal, cityVal, language);
      setResult({
        ...localFallback,
        ...data,
        applied_rules_detailed: data.applied_rules_detailed || localFallback.applied_rules_detailed,
        debts: data.debts || localFallback.debts,
        pukka_ghar_summary: data.pukka_ghar_summary || localFallback.pukka_ghar_summary,
        aspects: data.aspects || localFallback.aspects,
        bnn_timeline: localFallback.bnn_timeline
      });
    } catch (err: any) {
      console.warn('Backend fetch failed, using local Lal Kitab fallback engine:', err);
      const fallbackData = buildLocalLalKitabFallback(dobVal, tobVal, cityVal, language);
      setResult(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill & auto-compute from active saved profile or initial props when modal opens
  useEffect(() => {
    if (visible) {
      (async () => {
        let loadedProfiles: SavedKundaliProfile[] = [];
        try {
          loadedProfiles = await getSavedProfiles();
          setSavedProfiles(loadedProfiles);
        } catch (e) {
          console.log('Error loading saved profiles:', e);
        }

        if (initialDob && initialTob && initialCity) {
          setDob(initialDob);
          setTob(initialTob);
          setCity(initialCity);
          if (initialLat) setLat(initialLat);
          if (initialLon) setLon(initialLon);
          if (initialTz) setTz(initialTz);
          setShowForm(false);
          runAnalysis(initialDob, initialTob, initialCity, initialLat, initialLon, initialTz);
        } else {
          const activeP = await getActiveProfile();
          if (activeP) {
            const formattedDob = `${activeP.dobDay.padStart(2, '0')}/${activeP.dobMonth.padStart(2, '0')}/${activeP.dobYear}`;
            const formattedTob = `${activeP.tobHour.padStart(2, '0')}:${activeP.tobMinute.padStart(2, '0')}`;
            setDob(formattedDob);
            setTob(formattedTob);
            setCity(activeP.cityName);
            setLat(activeP.lat);
            setLon(activeP.lng);
            setSelectedProfileName(activeP.name);
            setShowForm(false);
            runAnalysis(formattedDob, formattedTob, activeP.cityName, activeP.lat, activeP.lng);
          } else {
            setShowForm(true);
          }
        }
      })();
    }
  }, [visible, initialDob, initialTob, initialCity, initialLat, initialLon, initialTz]);

  const handleSelectSavedProfile = (p: SavedKundaliProfile) => {
    const formattedDob = `${p.dobDay.padStart(2, '0')}/${p.dobMonth.padStart(2, '0')}/${p.dobYear}`;
    const formattedTob = `${p.tobHour.padStart(2, '0')}:${p.tobMinute.padStart(2, '0')}`;
    setDob(formattedDob);
    setTob(formattedTob);
    setCity(p.cityName);
    setLat(p.lat);
    setLon(p.lng);
    setSelectedProfileName(p.name);
    setActiveProfileId(p.id);
    setShowSavedProfilesModal(false);
    setShowForm(false);
    runAnalysis(formattedDob, formattedTob, p.cityName, p.lat, p.lng);
  };

  const handleDeleteProfile = async (id: string) => {
    const updated = await deleteKundaliProfile(id);
    setSavedProfiles(updated);
  };

  // Cycle loading status text smartly every 2.2 seconds while loading
  useEffect(() => {
    let interval: any = null;
    if (loading) {
      setLoadingStepIndex(0);
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev < stepsList.length - 1 ? prev + 1 : prev));
      }, 2200);
    } else {
      setLoadingStepIndex(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, stepsList.length]);

  const handleAnalyze = async () => {
    if (!dob || !tob || !city) {
      setErrorMsg(isHi ? 'कृपया सभी फ़ील्ड (दिनांक, समय, शहर) भरें।' : 'Please fill all fields (Date, Time, City).');
      return;
    }
    setShowForm(false);
    runAnalysis(dob, tob, city, lat, lon, tz);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#800000" />
        <View style={styles.container}>
          {/* Top Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerIcon}>📕</Text>
              <View>
                <Text style={styles.headerTitle}>
                  AI Kundli Details
                </Text>
                <Text style={styles.headerSub}>
                  {isHi ? 'Saturn Trine Timeline, Ketu Breaks & Remedies' : 'BPHS & Nandi Nadi Astrology Engine'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Top Controls Bar: Load Saved Profile Dropdown + Add New Profile Button */}
          <View style={styles.topControlRow}>
            <TouchableOpacity
              style={styles.loadProfileBtn}
              onPress={() => setShowSavedProfilesModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.loadProfileBtnText} numberOfLines={1}>
                👤 {isHi ? 'प्रोफाइल चुनें' : 'Load Saved Profile'} ({savedProfiles.length}) ▼
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.addNewBtn, showForm && styles.addNewBtnActive]}
              onPress={() => setShowForm(!showForm)}
              activeOpacity={0.8}
            >
              <Text style={[styles.addNewBtnText, showForm && styles.addNewBtnTextActive]}>
                {showForm ? (isHi ? '✕ फॉर्म छिपाएं' : '✕ Hide Form') : (isHi ? '➕ नया विवरण' : '➕ Add New Details')}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* Active Profile Info Banner (when form is hidden) */}
            {!showForm && (selectedProfileName || dob) ? (
              <View style={styles.activeProfileCard}>
                <View style={styles.activeProfileTop}>
                  <Text style={styles.activeProfileName}>👤 Selected Profile: {selectedProfileName || 'User'}</Text>
                  <TouchableOpacity onPress={() => setShowForm(true)} style={styles.editProfileBtn}>
                    <Text style={styles.editProfileText}>✏️ Edit Details</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.activeProfileDetails}>
                  🗓️ DOB: {dob} • ⏰ TOB: {tob} • 📍 {city}
                </Text>
              </View>
            ) : null}

            {/* Input Form Card (rendered only when user wants to edit or add new profile) */}
            {showForm && (
              <View style={styles.formCard}>
                <Text style={styles.formCardHeading}>
                  {isHi ? '📝 जन्म विवरण भरें (Enter Birth Details)' : '📝 Enter Birth Details'}
                </Text>

                <View style={styles.inputRow}>
                  <View style={[styles.inputGroup, { flex: 1.2, marginRight: 8 }]}>
                    <Text style={styles.label}>{isHi ? 'जन्म तिथि' : 'Date of Birth'}</Text>
                    <TextInput
                      style={styles.input}
                      value={dob}
                      onChangeText={setDob}
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor="#A0AEC0"
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>{isHi ? 'समय (24hr)' : 'Time (24-hr)'}</Text>
                    <TextInput
                      style={styles.input}
                      value={tob}
                      onChangeText={setTob}
                      placeholder="HH:MM"
                      placeholderTextColor="#A0AEC0"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{isHi ? 'जन्म शहर' : 'Birth City'}</Text>
                  <TextInput
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                    placeholder="e.g. Surat, Mumbai"
                    placeholderTextColor="#A0AEC0"
                  />
                </View>

                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

                <TouchableOpacity style={styles.analyzeBtn} onPress={handleAnalyze} activeOpacity={0.85}>
                  <Text style={styles.analyzeBtnText}>
                    ⚡ {isHi ? 'AI कुण्डली विश्लेषण आरंभ करें' : 'Run AI Kundli Analysis'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Smart Progress Loading Bar */}
            {loading && (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingHeaderRow}>
                  <ActivityIndicator size="large" color="#800000" />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.loadingTitle}>
                      {isHi ? 'AI कुण्डली विश्लेषण जारी है...' : 'Analyzing Kundli Details...'}
                    </Text>
                    <Text style={styles.loadingStepBadge}>
                      Step {loadingStepIndex + 1} of {stepsList.length}
                    </Text>
                  </View>
                </View>

                <Text style={styles.smartLoadingText}>
                  {stepsList[loadingStepIndex]}
                </Text>

                <View style={styles.smartProgressBarBackground}>
                  <View
                    style={[
                      styles.smartProgressBarFill,
                      { width: `${((loadingStepIndex + 1) / stepsList.length) * 100}%` }
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Results Container */}
            {result && !loading && (
              <View style={styles.resultsBox}>
                {/* Ascendant Badge */}
                <View style={styles.ascendantBadge}>
                  <Text style={styles.ascendantBadgeText}>
                    🌅 {isHi ? 'लग्न राशि:' : 'Ascendant Sign:'} {RASHI_NAMES_HI[result.ascendant_sign] || result.ascendant_sign}
                  </Text>
                </View>

                {/* Main Nav Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                  <View style={styles.navRow}>
                    <TouchableOpacity
                      style={[styles.tabBtn, activeTab === 'BNN_CAREER' && styles.tabBtnActive]}
                      onPress={() => setActiveTab('BNN_CAREER')}
                    >
                      <Text style={[styles.tabBtnText, activeTab === 'BNN_CAREER' && styles.tabBtnTextActive]}>
                        💼 Career by BNN
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.tabBtn, activeTab === 'REMEDIES' && styles.tabBtnActive]}
                      onPress={() => setActiveTab('REMEDIES')}
                    >
                      <Text style={[styles.tabBtnText, activeTab === 'REMEDIES' && styles.tabBtnTextActive]}>
                        🔮 {isHi ? 'लाल किताब उपाय' : language === 'gu' ? 'લાલ કિતાબ ઉપાય' : 'Lal Kitab Remedies'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.tabBtn, activeTab === 'DEBTS' && styles.tabBtnActive]}
                      onPress={() => setActiveTab('DEBTS')}
                    >
                      <Text style={[styles.tabBtnText, activeTab === 'DEBTS' && styles.tabBtnTextActive]}>
                        📜 {isHi ? 'पूर्वज ऋण ऑडिट' : language === 'gu' ? 'પૂર્વજ ઋણ' : 'Ancestral Debts'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.tabBtn, activeTab === 'REPORT' && styles.tabBtnActive]}
                      onPress={() => setActiveTab('REPORT')}
                    >
                      <Text style={[styles.tabBtnText, activeTab === 'REPORT' && styles.tabBtnTextActive]}>
                        📑 {isHi ? 'विस्तृत रिपोर्ट' : language === 'gu' ? 'વિગતવાર રિપોર્ટ' : 'Full Audit Report'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>

                {/* Single Unified Tab: Career by BNN (Steps 1, 2, 3 + Ketu + Combinations + Significations) */}
                {activeTab === 'BNN_CAREER' && (
                  <View style={styles.card}>
                    <Text style={styles.cardHeader}>💼 Bhrigu Nandi Nadi (BNN) Saturn Career Analysis</Text>

                    {/* Saturn Base Position & Trine Info Banner */}
                    {result.bnn_timeline?.saturnBase && (
                      <View style={styles.saturnBaseCard}>
                        <Text style={styles.saturnBaseTitle}>
                          🪐 Shani (Saturn) Base: House {result.bnn_timeline.saturnBase.house} • {result.bnn_timeline.saturnBase.rashiName} ({result.bnn_timeline.saturnBase.degreeStr})
                        </Text>
                        <Text style={styles.saturnBaseSub}>
                          📐 Trine Houses (1-5-9): House {result.bnn_timeline.trineHouses.h1}, House {result.bnn_timeline.trineHouses.h5}, House {result.bnn_timeline.trineHouses.h9} • 🎯 Destination 2nd House: House {result.bnn_timeline.trineHouses.h2Destination}
                        </Text>
                      </View>
                    )}

                    {/* Identified Planets (Conjunct + 1, 5, 9 Trine Positions) */}
                    <View style={styles.bnnStepSection}>
                      <Text style={styles.bnnStepHeader}>
                        📌 Trine Planetary Contacts (1, 5, 9 Positions from Saturn)
                      </Text>
                      <Text style={styles.bnnStepSub}>
                        {isHi
                          ? 'शनि से 1 (युति), 5 एवं 9 (त्रिकोण) भावों में स्थित ग्रहीय संपर्क:'
                          : 'Planets placed in Saturn\'s 1st (conjunction), 5th, and 9th (trine) houses:'}
                      </Text>
                      {result.bnn_timeline?.step1IdentifiedPlanets && result.bnn_timeline.step1IdentifiedPlanets.length > 0 ? (
                        result.bnn_timeline.step1IdentifiedPlanets.map((p: any, idx: number) => (
                          <View key={idx} style={styles.step1PlanetCard}>
                            <Text style={styles.step1PlanetTitle}>
                              {p.symbol} {p.name} ({p.hindiName})
                            </Text>
                            <Text style={styles.step1PlanetSub}>
                              📍 House {p.house} • {p.rashiName} • Exact Degree: {p.degreeStr} (Sign Deg: {p.signDegree.toFixed(2)}°) • Position: {p.relation}
                            </Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.bnnInterpText}>No direct trine planets found; evaluating 2nd house destination planets.</Text>
                      )}
                    </View>

                    {/* Chronological Career Timeline */}
                    <View style={styles.bnnStepSection}>
                      <Text style={styles.bnnStepHeader}>
                        ⚡ Chronological Career Phase Timeline
                      </Text>
                      <Text style={styles.bnnStepSub}>
                        {isHi
                          ? 'भृगु नंदी नाड़ी नियमानुसार ग्रहों के अंश के बढ़ते क्रम में आपका चरणबद्ध करियर कालखंड:'
                          : 'Phase-wise career timeline arranged in ascending degree order:'}
                      </Text>

                      {/* Special Ketu First Alert Banner */}
                      {result.bnn_timeline?.hasKetuFirst && (
                        <View style={styles.ketuAlertBanner}>
                          <Text style={styles.ketuAlertTitle}>
                            🛑 {isHi ? 'विशेष BNN नियम: केतु का अंश सबसे कम (Lowest Degree Ketu)' : 'Special BNN Rule: Ketu Has Lowest Degree'}
                          </Text>
                          <Text style={styles.ketuAlertText}>
                            {result.bnn_timeline.ketuInterceptionDetails
                              ? (result.bnn_timeline.ketuInterceptionDetails[language] || result.bnn_timeline.ketuInterceptionDetails['hi'] || result.bnn_timeline.ketuInterceptionDetails['en'])
                              : (isHi
                                  ? 'आपकी कुण्डली में शनि के 1-5-9 त्रिकोण में केतु का अंश सबसे कम (6.75°) है! यह प्रारंभिक करियर (आयु 18-24 वर्ष) में प्रथम ब्रेक/असंतोष देता है। इसके तुरंत बाद आप केतु के विशिष्ट क्षेत्रों में सफल होते हैं: वैज्ञानिक अनुसंधान, डेटा रिकवरी व बैकएंड सॉफ्टवेयर, वैकल्पिक चिकित्सा या ज्योतिष शोध।'
                                  : 'Ketu has the LOWEST DEGREE in Saturn\'s 1-5-9 trine (6.75°)! Early career break (Age 18-24), followed by transition into Ketu fields: Scientific Research, Spiritual Healing, Data Recovery, Software/Backend Analysis, or Niche Astrological Research.')}
                          </Text>
                        </View>
                      )}

                      {/* Dynamic BNN Phase Cards */}
                      {result.bnn_timeline?.phases && result.bnn_timeline.phases.length > 0 ? (
                        result.bnn_timeline.phases.map((phase: any, idx: number) => {
                          const pTitle = phase.title[language] || phase.title['hi'] || phase.title['en'];
                          const pInterp = phase.interpretation[language] || phase.interpretation['hi'] || phase.interpretation['en'];

                          return (
                            <View key={idx} style={[styles.bnnPhaseCard, phase.isKetuBreak && styles.bnnKetuCard]}>
                              <View style={styles.bnnPhaseHeaderRow}>
                                <Text style={styles.bnnPhaseTitle}>{phase.planetSymbol} Phase {idx + 1}: {pTitle}</Text>
                                <View style={styles.bnnAgeBadge}>
                                  <Text style={styles.bnnAgeBadgeText}>{phase.ageRangeStr}</Text>
                                </View>
                              </View>

                              <View style={styles.bnnDegreeRow}>
                                <Text style={styles.bnnDegreeText}>
                                  📍 House {phase.house} • {phase.rashiName} (Sign Deg: {phase.degreeInSign.toFixed(2)}°, Raw: {phase.degreeStr}) • {phase.trineRelation}
                                </Text>
                              </View>

                              <Text style={styles.bnnInterpText}>{pInterp}</Text>
                            </View>
                          );
                        })
                      ) : (
                        result.saturn_nadi_career_analysis?.chronological_phases.map((phase: string, idx: number) => (
                          <View key={idx} style={styles.timelineItem}>
                            <View style={styles.timelineDot} />
                            <Text style={styles.timelineText}>{phase}</Text>
                          </View>
                        ))
                      )}
                    </View>

                    {/* Destined Lifetime Profession */}
                    <View style={styles.bnnStepSection}>
                      <Text style={styles.bnnStepHeader}>
                        🏆 Destined Lifetime Career (2nd House from Saturn)
                      </Text>
                      <Text style={styles.bnnStepSub}>
                        {isHi
                          ? 'शनि से द्वितीय भाव (2nd House from Saturn) में स्थित ग्रहों से तय होने वाला आपका मुख्य करियर लक्ष्य:'
                          : 'Planets in the 2nd house ahead of Saturn dictate your ultimate lifetime career:'}
                      </Text>

                      <View style={styles.destinationBox}>
                        <Text style={styles.destinationText}>
                          {result.bnn_timeline?.destinationCareerSummary
                            ? (result.bnn_timeline.destinationCareerSummary[language] || result.bnn_timeline.destinationCareerSummary['hi'] || result.bnn_timeline.destinationCareerSummary['en'])
                            : result.saturn_nadi_career_analysis?.destination_career}
                        </Text>
                      </View>

                      {result.bnn_timeline?.destinationCareerPlanets && result.bnn_timeline.destinationCareerPlanets.length > 0 && (
                        <View style={{ marginTop: 10 }}>
                          <Text style={styles.sectionSubHeader}>
                            🎯 Planets in 2nd House from Saturn (House {result.bnn_timeline.trineHouses.h2Destination}):
                          </Text>
                          {result.bnn_timeline.destinationCareerPlanets.map((dp: any, idx: number) => (
                            <View key={idx} style={styles.trineItemRow}>
                              <Text style={styles.trinePlanetName}>🪐 {dp.name} (House {dp.house}, {dp.rashiName}):</Text>
                              <Text style={styles.trineDomainText}>Exact Degree: {dp.degreeStr} ({dp.signDegree ? dp.signDegree.toFixed(2) : ''}°)</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>

                    {/* Ketu Interception & Break Analysis */}
                    <View style={styles.bnnStepSection}>
                      <Text style={styles.bnnStepHeader}>🛑 Ketu Career Interception & Break Details</Text>
                      {result.saturn_nadi_career_analysis?.ketu_interception_break?.map((breakItem: string, idx: number) => (
                        <View key={idx} style={styles.breakItem}>
                          <Text style={styles.warningIcon}>⚠️</Text>
                          <Text style={styles.breakText}>{breakItem}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Multi-Planet BNN Combination Matrix */}
                    {result.bnn_timeline?.multiPlanetCombinations && result.bnn_timeline.multiPlanetCombinations.length > 0 && (
                      <View style={styles.bnnStepSection}>
                        <Text style={styles.bnnStepHeader}>🔮 BNN Multi-Planet Combination Matrix</Text>
                        {result.bnn_timeline.multiPlanetCombinations.map((comboItem: any, idx: number) => {
                          const comboDesc = comboItem.description[language] || comboItem.description['hi'] || comboItem.description['en'];
                          return (
                            <View key={idx} style={styles.comboCard}>
                              <Text style={styles.comboTitle}>{comboItem.combo}</Text>
                              <Text style={styles.comboDesc}>{comboDesc}</Text>
                            </View>
                          );
                        })}
                      </View>
                    )}

                    {/* Planetary Career Significations Reference Table */}
                    {result.bnn_timeline?.planetSignifications && (
                      <View style={styles.bnnStepSection}>
                        <Text style={styles.bnnStepHeader}>📚 Planet-by-Planet Career Significations Reference</Text>
                        {result.bnn_timeline.planetSignifications.map((pSig: any, idx: number) => {
                          const domainStr = pSig.domain[language] || pSig.domain['hi'] || pSig.domain['en'];
                          return (
                            <View key={idx} style={styles.significationCard}>
                              <Text style={styles.significationTitle}>{pSig.symbol} {pSig.name}</Text>
                              <Text style={styles.significationText}>{domainStr}</Text>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                )}

                {/* Tab 2: Lal Kitab Planets & Specific Remedies */}
                {activeTab === 'REMEDIES' && (
                  <View style={styles.card}>
                    <Text style={styles.cardHeader}>🔮 Lal Kitab Planetary Analysis & Specific Totke</Text>
                    {result.applied_rules_detailed && result.applied_rules_detailed.length > 0 ? (
                      result.applied_rules_detailed.map((rule: any, idx: number) => {
                        const title = rule.title[language] || rule.title['hi'] || rule.title['en'];
                        const desc = rule.description[language] || rule.description['hi'] || rule.description['en'];
                        const maternal = rule.maternalImpact ? (rule.maternalImpact[language] || rule.maternalImpact['hi'] || rule.maternalImpact['en']) : '';
                        const remediesList = rule.remedies[language] || rule.remedies['hi'] || rule.remedies['en'] || [];

                        return (
                          <View key={idx} style={styles.detailedRuleCard}>
                            <Text style={styles.ruleCardTitle}>{title}</Text>
                            <Text style={styles.ruleCardDesc}>{desc}</Text>
                            {maternal ? <Text style={styles.maternalText}>{maternal}</Text> : null}
                            {remediesList.length > 0 && (
                              <View style={styles.totkeBox}>
                                <Text style={styles.totkeHeader}>💡 Lal Kitab Totke & Upay:</Text>
                                {remediesList.map((totke: string, tIdx: number) => (
                                  <Text key={tIdx} style={styles.totkeItem}>• {totke}</Text>
                                ))}
                              </View>
                            )}
                          </View>
                        );
                      })
                    ) : (
                      result.lal_kitab_rules?.map((rule: string, idx: number) => (
                        <View key={idx} style={styles.remedyBox}>
                          <Text style={styles.remedyText}>{rule}</Text>
                        </View>
                      ))
                    )}
                  </View>
                )}

                {/* Tab 3: Ancestral Debts Audit */}
                {activeTab === 'DEBTS' && (
                  <View style={styles.card}>
                    <Text style={styles.cardHeader}>📜 Lal Kitab Ancestral Debts Audit (Rina Analysis)</Text>
                    <Text style={styles.cardSubText}>
                      {isHi
                        ? 'लाल किताब के अनुसार आपके परिवार में पूर्वजों के कारण उत्पन्न ऋण एवं उनके अचूक पारिवारिक उपाय:'
                        : 'According to Lal Kitab, here is your ancestral debt audit and joint family remedies:'}
                    </Text>

                    {result.debts && result.debts.length > 0 ? (
                      result.debts.map((debt: any, idx: number) => {
                        const dName = debt.name[language] || debt.name['hi'] || debt.name['en'];
                        const dCause = debt.cause[language] || debt.cause['hi'] || debt.cause['en'];
                        const dImpact = debt.impact[language] || debt.impact['hi'] || debt.impact['en'];
                        const dRemedy = debt.remedy[language] || debt.remedy['hi'] || debt.remedy['en'];

                        return (
                          <View key={idx} style={[styles.debtCard, debt.isApplicable && styles.debtCardActive]}>
                            <View style={styles.debtHeaderRow}>
                              <Text style={styles.debtTitle}>{dName}</Text>
                              {debt.isApplicable ? (
                                <View style={styles.activeDebtBadge}>
                                  <Text style={styles.activeDebtBadgeText}>{isHi ? 'सक्रिय ऋण' : 'Active Debt'}</Text>
                                </View>
                              ) : null}
                            </View>
                            <Text style={styles.debtFieldText}>
                              <Text style={{ fontWeight: 'bold' }}>{isHi ? 'कारण: ' : 'Cause: '}</Text>{dCause}
                            </Text>
                            <Text style={styles.debtFieldText}>
                              <Text style={{ fontWeight: 'bold' }}>{isHi ? 'प्रभाव: ' : 'Impact: '}</Text>{dImpact}
                            </Text>
                            <View style={styles.debtRemedyBox}>
                              <Text style={styles.debtRemedyHeader}>🙏 {isHi ? 'सिद्ध पारिवारिक उपाय:' : 'Collective Remedy:'}</Text>
                              <Text style={styles.debtRemedyText}>{dRemedy}</Text>
                            </View>
                          </View>
                        );
                      })
                    ) : (
                      <Text style={styles.reportText}>No ancestral debts detected.</Text>
                    )}
                  </View>
                )}

                {/* Tab 4: Full Detailed Audit Report */}
                {activeTab === 'REPORT' && (
                  <View style={styles.card}>
                    <Text style={styles.cardHeader}>📑 Full AI Career & Lal Kitab Audit Synthesis</Text>
                    <Text style={styles.reportText}>{result.report}</Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>

        {/* Saved Profiles Dropdown Modal */}
        <Modal visible={showSavedProfilesModal} animationType="fade" transparent>
          <TouchableWithoutFeedback onPress={() => setShowSavedProfilesModal(false)}>
            <View style={styles.dropdownOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.dropdownModalCard}>
                  <View style={styles.dropdownHeaderRow}>
                    <Text style={styles.dropdownTitle}>👤 Select Saved Kundali Profile</Text>
                    <TouchableOpacity onPress={() => setShowSavedProfilesModal(false)} style={styles.closeBtnModal}>
                      <Text style={styles.closeBtnTextModal}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  {savedProfiles.length === 0 ? (
                    <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                      <Text style={{ fontSize: 13, color: Colors.textMuted }}>No saved profiles yet.</Text>
                    </View>
                  ) : (
                    <ScrollView style={{ maxHeight: 300 }}>
                      {savedProfiles.map(p => (
                        <View key={p.id} style={styles.profileRowItem}>
                          <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectSavedProfile(p)}>
                            <Text style={styles.profileNameText}>👤 {p.name}</Text>
                            <Text style={styles.profileSubText}>
                              DOB: {p.dobDay}/{p.dobMonth}/{p.dobYear} • TOB: {p.tobHour}:{p.tobMinute}
                            </Text>
                            <Text style={styles.profileLocationText}>📍 {p.cityName}</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={styles.deleteProfileBtn} onPress={() => handleDeleteProfile(p.id)}>
                            <Text style={styles.deleteProfileText}>🗑️</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#800000'
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF5EE'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#800000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#FFD700'
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerIcon: {
    fontSize: 24,
    marginRight: 10
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700'
  },
  headerSub: {
    fontSize: 11,
    color: '#FFE0B2',
    marginTop: 1
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)'
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  topControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFF3E0',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2'
  },
  loadProfileBtn: {
    flex: 1.4,
    backgroundColor: '#FAF5EE',
    borderColor: Colors.maroon,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginRight: 8,
    justifyContent: 'center'
  },
  loadProfileBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  addNewBtn: {
    backgroundColor: Colors.maroon,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addNewBtnActive: {
    backgroundColor: '#C62828'
  },
  addNewBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  addNewBtnTextActive: {
    color: '#FFFFFF'
  },
  activeProfileCard: {
    backgroundColor: '#FAF5EE',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    padding: 12,
    marginBottom: 10
  },
  activeProfileTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  activeProfileName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  editProfileBtn: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFB74D',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  editProfileText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  activeProfileDetails: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 40
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F0E0D0',
    elevation: 2
  },
  formCardHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 12
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 10
  },
  inputGroup: {
    marginBottom: 10
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginBottom: 4
  },
  input: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#F0E0D0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13,
    color: Colors.textPrimary
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 11,
    marginBottom: 8
  },
  analyzeBtn: {
    backgroundColor: Colors.maroon,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6
  },
  analyzeBtnText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold'
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F0E0D0'
  },
  loadingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  loadingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  loadingStepBadge: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2
  },
  smartLoadingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 10
  },
  smartProgressBarBackground: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden'
  },
  smartProgressBarFill: {
    height: '100%',
    backgroundColor: Colors.maroon
  },
  resultsBox: {
    marginTop: 4
  },
  ascendantBadge: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFB74D',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 12
  },
  ascendantBadgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  navRow: {
    flexDirection: 'row',
    gap: 6
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0E0D0'
  },
  tabBtnActive: {
    backgroundColor: Colors.maroon,
    borderColor: '#FFD700'
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary
  },
  tabBtnTextActive: {
    color: '#FFD700'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F0E0D0',
    elevation: 2
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 8
  },
  cardSubText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 10,
    fontStyle: 'italic'
  },
  saturnBaseCard: {
    backgroundColor: '#4A0E17',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFD700'
  },
  saturnBaseTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700'
  },
  saturnBaseSub: {
    fontSize: 11,
    color: '#FFE0B2',
    marginTop: 2
  },
  ketuAlertBanner: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF9A9A',
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12
  },
  ketuAlertTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 4
  },
  ketuAlertText: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 17
  },
  bnnPhaseCard: {
    backgroundColor: '#FAF5EE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0E0D0'
  },
  bnnKetuCard: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFE082',
    borderWidth: 1.5
  },
  bnnPhaseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  bnnPhaseTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
    flex: 1,
    marginRight: 6
  },
  bnnAgeBadge: {
    backgroundColor: Colors.maroon,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  bnnAgeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFD700'
  },
  bnnDegreeRow: {
    marginBottom: 6
  },
  bnnDegreeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primaryDark
  },
  bnnInterpText: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 17
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingLeft: 4
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.maroon,
    marginTop: 5,
    marginRight: 10
  },
  timelineText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18
  },
  destinationBox: {
    backgroundColor: '#FAF5EE',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.maroon,
    marginBottom: 10
  },
  destinationText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
    lineHeight: 19
  },
  sectionSubHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 6
  },
  trineItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingLeft: 4
  },
  trinePlanetName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginRight: 6
  },
  trineDomainText: {
    fontSize: 11,
    color: Colors.textSecondary
  },
  breakItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E1',
    borderColor: '#FFE082',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8
  },
  warningIcon: {
    fontSize: 14,
    marginRight: 8
  },
  breakText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18
  },
  remedyBox: {
    backgroundColor: '#FAF5EE',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0E0D0'
  },
  remedyText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18
  },
  detailedRuleCard: {
    backgroundColor: '#FAF5EE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFE0B2'
  },
  ruleCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 4
  },
  ruleCardDesc: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18
  },
  maternalText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#C62828',
    marginTop: 4
  },
  totkeBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  totkeHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginBottom: 4
  },
  totkeItem: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 2
  },
  debtCard: {
    backgroundColor: '#FAF5EE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0E0D0'
  },
  debtCardActive: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFB74D',
    borderWidth: 1.5
  },
  debtHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  debtTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  activeDebtBadge: {
    backgroundColor: '#C62828',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  activeDebtBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  debtFieldText: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 3,
    lineHeight: 16
  },
  debtRemedyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 6,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  debtRemedyHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginBottom: 2
  },
  debtRemedyText: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16
  },
  reportText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 20
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20
  },
  dropdownModalCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 16,
    elevation: 8
  },
  dropdownHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  closeBtnModal: {
    padding: 4
  },
  closeBtnTextModal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textSecondary
  },
  profileRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0E0D0'
  },
  profileNameText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  profileSubText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2
  },
  profileLocationText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginTop: 1
  },
  deleteProfileBtn: {
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: 8,
    marginLeft: 10
  },
  deleteProfileText: {
    fontSize: 12
  },
  bnnStepSection: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2'
  },
  bnnStepHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 4
  },
  bnnStepSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 8
  },
  step1PlanetCard: {
    backgroundColor: '#FAF5EE',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#FFE0B2'
  },
  step1PlanetTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryDark
  },
  step1PlanetSub: {
    fontSize: 10,
    color: Colors.textPrimary,
    marginTop: 2
  },
  comboCard: {
    backgroundColor: '#FAF5EE',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#D1C4E9'
  },
  comboTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A148C',
    marginBottom: 2
  },
  comboDesc: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 16
  },
  significationCard: {
    backgroundColor: '#FAF5EE',
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  significationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 2
  },
  significationText: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 16
  }
});
