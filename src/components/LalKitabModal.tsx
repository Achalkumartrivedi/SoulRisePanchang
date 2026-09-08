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

function buildLocalLalKitabFallback(dobStr: string, tobStr: string, cityName: string, lang: string, latVal?: number, lonVal?: number): LalKitabResponseData {
  const parts = dobStr.split('/');
  const d = parseInt(parts[0], 10) || 13;
  const m = parseInt(parts[1], 10) || 2;
  const y = parseInt(parts[2], 10) || 1989;

  const tParts = tobStr.split(':');
  const h = parseInt(tParts[0], 10) || 0;
  const min = parseInt(tParts[1], 10) || 5;

  const birthDate = new Date(y, m - 1, d);
  const finalLat = latVal !== undefined ? latVal : 21.17;
  const finalLon = lonVal !== undefined ? lonVal : 72.83;
  const kundali = calculateBirthKundali('User', birthDate, h, min, cityName || 'Surat', finalLat, finalLon);
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

  const destinationCareer = bnnTimeline.destinationCareerSummary[lang] || bnnTimeline.destinationCareerSummary['hi'] || bnnTimeline.destinationCareerSummary['en'];

  const ketuBreaks = bnnTimeline.hasKetuFirst
    ? [
        isHi
          ? '🛑 केतु प्रथम ग्रह (शनि से आगे): करियर की शुरुआत (आयु 18-24) में ही प्रथम ब्रेक/असंतोष। ब्रेक के तुरंत बाद केतु क्षेत्रों में सफलता: वैज्ञानिक अनुसंधान, डेटा रिकवरी व बैकएंड एनालिसिस, वैकल्पिक चिकित्सा या ज्योतिष शोध।'
          : '🛑 Ketu First Ahead of Saturn: Early career break (Age 18-24). Immediate transition into Ketu domains: Scientific Research, Spiritual Healing, Data Recovery, Software/Backend Analysis, or Niche Astrological Research.',
        isHi
          ? 'उपाय: कार्यस्थल पर शांति बनाए रखें और काले-सफेद कुत्ते को रोटी खिलाएं।'
          : 'Remedy: Feed black-and-white dogs and maintain peaceful workplace relationships.'
      ]
    : [];

  const ascSignIdx = kundali.lagnaRashiIndex + 1;
  const ascSignName = RASHI_NAMES_HI[ascSignIdx] || kundali.lagnaRashi;

  const fullReportText = isHi
    ? `# 📕 विस्तृत लाल किताब एवं AI कुण्डली रिपोर्ट\n\n` +
      `### 🌅 जन्म विवरण (Birth Particulars)\n` +
      `- **तिथि:** ${dobStr} • **समय:** ${tobStr} • **स्थान:** ${cityName}\n` +
      `- **लग्न राशि:** ${ascSignName}\n\n` +
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
      `- **Ascendant Sign:** ${ascSignName}\n\n` +
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
    ascendant_sign: ascSignIdx,
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
      saturn_longitude: bnnTimeline.saturnBase.totalDegrees,
      trine_planets: bnnTimeline.step1IdentifiedPlanets.map(p => ({
        planet: p.name,
        longitude: p.signDegree,
        delta_longitude: 0,
        house: p.house,
        rel_house_from_saturn: p.house === satHouse ? 1 : p.house === bnnTimeline.trineHouses.h5 ? 5 : 9,
        domain: p.relation
      })),
      chronological_phases: chronologicalPhases,
      destination_career: destinationCareer,
      destination_career_planets: bnnTimeline.destinationCareerPlanets,
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

function getShortBnnPlanetText(dp: any): string {
  const pRawName = String(dp.name || dp.planet || '');
  const houseNum = dp.house || '';
  const rashiRaw = String(dp.rashiName || dp.sign || '');
  const degRaw = String(dp.degreeStr || (dp.signDegree !== undefined ? `${dp.signDegree.toFixed(2)}°` : (dp.sign_degree !== undefined ? `${dp.sign_degree}°` : '')));

  let symbol = '🪐';
  let shortName = pRawName;
  if (pRawName.includes('Shukra') || pRawName.includes('Venus')) { symbol = '💎'; shortName = 'Shukra (Ve)'; }
  else if (pRawName.includes('Budha') || pRawName.includes('Mercury')) { symbol = '🟢'; shortName = 'Budha (Me)'; }
  else if (pRawName.includes('Surya') || pRawName.includes('Sun')) { symbol = '☀️'; shortName = 'Surya (Su)'; }
  else if (pRawName.includes('Chandra') || pRawName.includes('Moon')) { symbol = '🌙'; shortName = 'Chandra (Mo)'; }
  else if (pRawName.includes('Mangala') || pRawName.includes('Mars')) { symbol = '🔴'; shortName = 'Mangala (Ma)'; }
  else if (pRawName.includes('Brihaspati') || pRawName.includes('Jupiter')) { symbol = '🟡'; shortName = 'Brihaspati (Ju)'; }
  else if (pRawName.includes('Shani') || pRawName.includes('Saturn')) { symbol = '🪐'; shortName = 'Shani (Sa)'; }
  else if (pRawName.includes('Rahu')) { symbol = '🚀'; shortName = 'Rahu (Ra)'; }
  else if (pRawName.includes('Ketu')) { symbol = '🛑'; shortName = 'Ketu (Ke)'; }

  let shortRashi = rashiRaw;
  if (rashiRaw.includes('Capricorn') || rashiRaw.includes('Makara') || rashiRaw.includes('मकर')) shortRashi = 'Makar (Cap.)';
  else if (rashiRaw.includes('Aries') || rashiRaw.includes('Mesha') || rashiRaw.includes('मेष')) shortRashi = 'Mesha (Ari.)';
  else if (rashiRaw.includes('Taurus') || rashiRaw.includes('Vrishabha') || rashiRaw.includes('वृषभ')) shortRashi = 'Vrishabh (Tau.)';
  else if (rashiRaw.includes('Gemini') || rashiRaw.includes('Mithuna') || rashiRaw.includes('मिथुन')) shortRashi = 'Mithun (Gem.)';
  else if (rashiRaw.includes('Cancer') || rashiRaw.includes('Karka') || rashiRaw.includes('कर्क')) shortRashi = 'Karka (Can.)';
  else if (rashiRaw.includes('Leo') || rashiRaw.includes('Simha') || rashiRaw.includes('सिंह')) shortRashi = 'Simha (Leo)';
  else if (rashiRaw.includes('Virgo') || rashiRaw.includes('Kanya') || rashiRaw.includes('कन्या')) shortRashi = 'Kanya (Vir.)';
  else if (rashiRaw.includes('Libra') || rashiRaw.includes('Tula') || rashiRaw.includes('तुला')) shortRashi = 'Tula (Lib.)';
  else if (rashiRaw.includes('Scorpio') || rashiRaw.includes('Vrishchika') || rashiRaw.includes('वृश्चिक')) shortRashi = 'Vrischika (Sco.)';
  else if (rashiRaw.includes('Sagittarius') || rashiRaw.includes('Dhanu') || rashiRaw.includes('धनु')) shortRashi = 'Dhanu (Sag.)';
  else if (rashiRaw.includes('Aquarius') || rashiRaw.includes('Kumbha') || rashiRaw.includes('कुंभ')) shortRashi = 'Kumbh (Aqu.)';
  else if (rashiRaw.includes('Pisces') || rashiRaw.includes('Meena') || rashiRaw.includes('मीन')) shortRashi = 'Meen (Pis.)';

  const cleanDeg = degRaw.replace(/Exact Degree:\s*/i, '').split('(')[0].trim();
  const degFormatted = cleanDeg ? `Deg ${cleanDeg}` : '';

  return `${symbol} ${shortName} - H${houseNum}, ${shortRashi}${degFormatted ? ' - ' + degFormatted : ''}`;
}

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
  const [activeTab, setActiveTab] = useState<'BNN_CAREER' | 'REMEDIES' | 'DEBTS'>('BNN_CAREER');

  const stepsList = isHi ? LOADING_STEPS_HI : LOADING_STEPS_EN;

  const runAnalysis = async (dobVal: string, tobVal: string, cityVal: string, latVal?: number, lonVal?: number, tzVal?: number) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await fetchLalKitabAnalysis({ dob: dobVal, tob: tobVal, city: cityVal, lat: latVal, lon: lonVal, tz: tzVal, lang: language });
      const localFallback = buildLocalLalKitabFallback(dobVal, tobVal, cityVal, language, latVal, lonVal);
      setResult({
        ...localFallback,
        ...data,
        applied_rules_detailed: data.applied_rules_detailed || localFallback.applied_rules_detailed,
        debts: data.debts || localFallback.debts,
        pukka_ghar_summary: data.pukka_ghar_summary || localFallback.pukka_ghar_summary,
        aspects: data.aspects || localFallback.aspects,
        bnn_timeline: data.bnn_timeline || localFallback.bnn_timeline
      });
    } catch (err: any) {
      console.warn('Backend fetch failed, using local Lal Kitab fallback engine:', err);
      const fallbackData = buildLocalLalKitabFallback(dobVal, tobVal, cityVal, language, latVal, lonVal);
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
                  </View>
                </ScrollView>

                {/* Single Unified Tab: Career by BNN */}
                {activeTab === 'BNN_CAREER' && (
                  <View style={styles.card}>
                    <Text style={styles.cardHeader}>💼 Bhrigu Nandi Nadi (BNN) Saturn Career Analysis</Text>

                    {/* Birth Chart Placement Banner */}
                    {result.bnn_timeline?.saturnBase && (
                      <View style={styles.saturnBaseCard}>
                        <Text style={styles.saturnBaseTitle}>
                          🌅 Birth Chart Placement
                        </Text>
                        <Text style={styles.saturnBaseSub}>
                          • Lagna (Ascendant): {result.bnn_timeline?.lagnaRashi || RASHI_NAMES_HI[result.ascendant_sign] || result.ascendant_sign}{'\n'}
                          • Saturn (Shani — Karma Karaka): House {result.bnn_timeline.saturnBase.house} ({result.bnn_timeline.saturnBase.rashiName}) at {result.bnn_timeline.saturnBase.degreeStr}{'\n'}
                          • Trine Houses (1-5-9): House {result.bnn_timeline.trineHouses.h1}, House {result.bnn_timeline.trineHouses.h5}, House {result.bnn_timeline.trineHouses.h9}{'\n'}
                          • 2nd House Ahead of Saturn: House {result.bnn_timeline.trineHouses.h2Destination}
                        </Text>
                      </View>
                    )}

                    {/* Chronological Career Phase Timeline */}
                    <View style={styles.bnnStepSection}>
                      <Text style={styles.bnnStepHeader}>
                        ⚡ Phase-Wise Career Timeline (Ascending Degree Order)
                      </Text>

                      {/* Visual Sequence Chain Banner */}
                      {result.bnn_timeline?.phases && result.bnn_timeline.phases.length > 0 && (
                        <View style={{ backgroundColor: '#FFF5F5', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#FEB2B2', marginBottom: 12 }}>
                          <Text style={{ fontSize: 13, fontWeight: '700', color: '#9B2C2C', textAlign: 'center' }}>
                            {result.bnn_timeline.phases.map((p: any, i: number) => `[Phase ${i + 1}: ${p.planetName.split(' ')[0]} (${p.degreeInSign.toFixed(2)}°)]`).join(' ➔ ')}
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

                    {/* Destined Lifetime Profession (Only displayed if 2nd House ahead of Saturn has planets AND a non-empty summary) */}
                    {(() => {
                      const destPlanets = (result.bnn_timeline?.destinationCareerPlanets && result.bnn_timeline.destinationCareerPlanets.length > 0)
                        ? result.bnn_timeline.destinationCareerPlanets.filter((p: any) => p && (p.name || p.planet))
                        : (result.saturn_nadi_career_analysis?.destination_career_planets && result.saturn_nadi_career_analysis.destination_career_planets.length > 0)
                          ? result.saturn_nadi_career_analysis.destination_career_planets.filter((p: any) => p && (p.name || p.planet))
                          : [];

                      const rawSummary = result.bnn_timeline?.destinationCareerSummary
                        ? (result.bnn_timeline.destinationCareerSummary[language] || result.bnn_timeline.destinationCareerSummary['hi'] || result.bnn_timeline.destinationCareerSummary['en'] || '')
                        : (result.saturn_nadi_career_analysis?.destination_career || '');

                      const summaryText = typeof rawSummary === 'string' ? rawSummary.trim() : '';

                      if (destPlanets.length === 0 || summaryText.length === 0) {
                        return null; // 100% HIDDEN - NO BLANK FIELD OR EMPTY CARD RENDERED AT ALL
                      }

                      const h2DestNum = result.bnn_timeline?.trineHouses?.h2Destination || destPlanets[0]?.house || '';

                      return (
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
                            <Text style={styles.destinationText}>{summaryText}</Text>
                          </View>

                          <View style={{ marginTop: 10 }}>
                            <Text style={styles.sectionSubHeader}>
                              🎯 Planets in 2nd House from Saturn (House {h2DestNum}):
                            </Text>
                            {destPlanets.map((dp: any, idx: number) => (
                              <View key={idx} style={styles.trineItemRow}>
                                <Text style={styles.trinePlanetShortText}>
                                  {getShortBnnPlanetText(dp)}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      );
                    })()}




                  </View>
                )}

                {/* Tab 2: Lal Kitab Planets & Specific Remedies */}
                {activeTab === 'REMEDIES' && (
                  <View style={styles.card}>
                    <Text style={styles.cardHeader}>🔮 Lal Kitab Planetary Analysis & Specific Totke</Text>
                    {(() => {
                      const rules = result.applied_rules_detailed || [];

                      if (!rules || rules.length === 0) {
                        return <Text style={styles.cardSubText}>No planetary remedies detected.</Text>;
                      }

                      return rules.map((rule: any, idx: number) => {
                        const title = rule.title?.[language] || rule.title?.['hi'] || rule.title?.['en'] || '';
                        const desc = rule.description?.[language] || rule.description?.['hi'] || rule.description?.['en'] || '';
                        const maternal = rule.maternalImpact
                          ? (rule.maternalImpact[language] || rule.maternalImpact['hi'] || rule.maternalImpact['en'])
                          : '';

                        const rawRemedies = (rule.remedies?.[language] && rule.remedies[language].length > 0)
                          ? rule.remedies[language]
                          : ((language === 'hinglish' || language === 'mr') && rule.remedies?.['hi'] && rule.remedies['hi'].length > 0)
                            ? rule.remedies['hi']
                            : (rule.remedies?.['hi'] && rule.remedies['hi'].length > 0)
                              ? rule.remedies['hi']
                              : (rule.remedies?.['en'] || []);

                        const remediesList = rawRemedies.map((item: string) => item.replace(/^[•\s]+/, '').trim());

                        return (
                          <View key={rule.id || idx} style={styles.detailedRuleCard}>
                            <Text style={styles.ruleCardTitle}>{title}</Text>
                            <Text style={styles.ruleCardDesc}>{desc}</Text>
                            {maternal ? <Text style={styles.maternalText}>{maternal}</Text> : null}
                            {remediesList.length > 0 && (
                              <View style={styles.totkeBox}>
                                <Text style={styles.totkeHeader}>
                                  💡 {isHi ? 'लाल किताब टोटके एवं अचूक उपाय:' : language === 'gu' ? 'લાલ કિતાબ તોટકા અને ઉપાયો:' : 'Lal Kitab Totke & Upay:'}
                                </Text>
                                {remediesList.map((totke: string, tIdx: number) => (
                                  <Text key={tIdx} style={styles.totkeItem}>• {totke}</Text>
                                ))}
                              </View>
                            )}
                          </View>
                        );
                      });
                    })()}
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

                    {(() => {
                      const activeDebts = (result.debts || []).filter((d: any) => d.isApplicable !== false);
                      if (activeDebts.length > 0) {
                        return activeDebts.map((debt: any, idx: number) => {
                          const dName = debt.name[language] || debt.name['hi'] || debt.name['en'];
                          const dCause = debt.cause[language] || debt.cause['hi'] || debt.cause['en'];
                          const dImpact = debt.impact[language] || debt.impact['hi'] || debt.impact['en'];
                          const dRemedy = debt.remedy[language] || debt.remedy['hi'] || debt.remedy['en'];

                          return (
                            <View key={idx} style={[styles.debtCard, styles.debtCardActive]}>
                              <View style={styles.debtHeaderRow}>
                                <Text style={styles.debtTitle}>{dName}</Text>
                                <View style={styles.activeDebtBadge}>
                                  <Text style={styles.activeDebtBadgeText}>{isHi ? 'सक्रिय ऋण' : 'Active Debt'}</Text>
                                </View>
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
                        });
                      }
                      return (
                        <View style={{ backgroundColor: '#F0FDF4', borderRadius: 12, padding: 18, borderWidth: 1, borderColor: '#BBF7D0', marginTop: 12, alignItems: 'center' }}>
                          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#15803D', textAlign: 'center', marginBottom: 8 }}>
                            ✨ {isHi ? 'आपकी कुंडली पूर्णतः पितृ व पूर्वज ऋणों से मुक्त है' : 'Your Kundli is Ancestral Debt Free'}
                          </Text>
                          <Text style={{ fontSize: 13, color: '#166534', textAlign: 'center', lineHeight: 18 }}>
                            {isHi
                              ? 'लाल किताब विश्लेषण के अनुसार आपके जन्मांक में कोई भी सक्रिय पितृ या पूर्वज ऋण (Rina) उपस्थित नहीं है। आपका वंश ईश्वरीय कृपा व सौहार्द से परिपूर्ण है।'
                              : 'According to Lal Kitab analysis, there are no active ancestral debts or karmic Rina obligations in your horoscope. Your lineage is blessed with divine harmony.'}
                          </Text>
                        </View>
                      );
                    })()}
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
    marginBottom: 6,
    paddingLeft: 4,
    flexWrap: 'wrap'
  },
  trinePlanetShortText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
    flexWrap: 'wrap'
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
