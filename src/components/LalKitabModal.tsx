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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { fetchLalKitabAnalysis, LalKitabResponseData } from '../services/lalKitabService';
import { getSavedProfiles, saveKundaliProfile, deleteKundaliProfile, getActiveProfile, setActiveProfileId, SavedKundaliProfile } from '../utils/profileStorage';
import { calculateBirthKundali } from '../engine/kundaliEngine';
import { evaluateLalKitabRules } from '../engine/lalKitabAstrologyRules';
import { calculateBnnSaturnTimeline, BnnSaturnTimelineResult } from '../engine/bnnSaturnTimelineEngine';
import { evaluateLalKitabSaturn } from '../engine/lalKitabSaturnEngine';
import { CitySelectionModal } from './CitySelectionModal';
import { AddNewProfileModal } from './AddNewProfileModal';

// In-Memory & AsyncStorage Cache for ultra-fast (0ms) profile report retrieval
const memoryLalKitabCache = new Map<string, LalKitabResponseData>();
const AI_KUNDLI_CACHE_PREFIX = 'SOULRISE_AI_KUNDLI_CACHE_v1_';

const generateCacheKey = (
  name: string,
  dob: string,
  tob: string,
  city: string,
  lat?: number,
  lon?: number,
  lang?: string
) => {
  const safeLat = lat !== undefined ? lat.toFixed(3) : '21.170';
  const safeLon = lon !== undefined ? lon.toFixed(3) : '72.831';
  return `${AI_KUNDLI_CACHE_PREFIX}${name.trim().toLowerCase()}_${dob}_${tob}_${city.trim().toLowerCase()}_${safeLat}_${safeLon}_${lang || 'en'}`;
};

const getCachedAnalysis = async (cacheKey: string): Promise<LalKitabResponseData | null> => {
  if (memoryLalKitabCache.has(cacheKey)) {
    return memoryLalKitabCache.get(cacheKey)!;
  }
  try {
    const raw = await AsyncStorage.getItem(cacheKey);
    if (raw) {
      const parsed: LalKitabResponseData = JSON.parse(raw);
      memoryLalKitabCache.set(cacheKey, parsed);
      return parsed;
    }
  } catch (err) {
    console.log('Error reading AI Kundli cache:', err);
  }
  return null;
};

const saveCachedAnalysis = async (cacheKey: string, data: LalKitabResponseData) => {
  memoryLalKitabCache.set(cacheKey, data);
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (err) {
    console.log('Error saving AI Kundli cache:', err);
  }
};

const DAYS_LIST = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MONTHS_LIST = [
  'January (01)', 'February (02)', 'March (03)', 'April (04)',
  'May (05)', 'June (06)', 'July (07)', 'August (08)',
  'September (09)', 'October (10)', 'November (11)', 'December (12)'
];
const YEARS_LIST = Array.from({ length: 111 }, (_, i) => (1920 + i).toString());
const HOURS_LIST = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES_LIST = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
import {
  evaluateChartLalKitabAspects,
  getLalKitabAspects,
  LAL_KITAB_DRISHTI,
  PASSIVE_HOUSES,
  LAL_KITAB_SPECIAL_RULES,
  HOUSE_BEHAVIOR,
  UNIVERSAL_REMEDIES,
  PLANET_HOUSE_REMEDIES,
  DRISHTI_REMEDY_RULES,
  PLANET_COMBINATION_REMEDIES
} from '../engine/lalKitabDrishtiEngine';

function buildLocalLalKitabFallback(profileNameStr: string, dobStr: string, tobStr: string, cityName: string, lang: string, latVal?: number, lonVal?: number): LalKitabResponseData {
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
  const kundali = calculateBirthKundali(profileNameStr || 'User', birthDate, h, min, cityName || 'Surat', finalLat, finalLon);
  const lalReport = evaluateLalKitabRules(kundali);
  const bnnTimeline = calculateBnnSaturnTimeline(kundali, lang);
  const saturnReport = evaluateLalKitabSaturn(kundali, lang);
  const drishtiReport = evaluateChartLalKitabAspects(kundali, lang);

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
    saturn_report: saturnReport,
    drishti_report: drishtiReport,
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

  const [profileName, setProfileName] = useState<string>('User');
  const [dobDay, setDobDay] = useState<string>('13');
  const [dobMonth, setDobMonth] = useState<string>('02');
  const [dobYear, setDobYear] = useState<string>('1989');
  const [tobHour, setTobHour] = useState<string>('00');
  const [tobMinute, setTobMinute] = useState<string>('05');
  const [dob, setDob] = useState(initialDob || '13/02/1989');
  const [tob, setTob] = useState(initialTob || '00:05');
  const [city, setCity] = useState(initialCity || defaultCity || 'Surat');
  const [lat, setLat] = useState<number | undefined>(initialLat);
  const [lon, setLon] = useState<number | undefined>(initialLon);
  const [tz, setTz] = useState<number | undefined>(initialTz);

  const [savedProfiles, setSavedProfiles] = useState<SavedKundaliProfile[]>([]);
  const [selectedProfileName, setSelectedProfileName] = useState<string>('');
  const [showSavedProfilesModal, setShowSavedProfilesModal] = useState(false);
  const [showCityPickerModal, setShowCityPickerModal] = useState(false);
  const [showAddNewProfileModal, setShowAddNewProfileModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [showHourModal, setShowHourModal] = useState(false);
  const [showMinuteModal, setShowMinuteModal] = useState(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [result, setResult] = useState<LalKitabResponseData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'BNN_CAREER' | 'SATURN_GUIDE' | 'REMEDIES' | 'DEBTS' | 'DRISHTI'>('BNN_CAREER');
  const [selectedDrishtiHouse, setSelectedDrishtiHouse] = useState<number>(1);

  const stepsList = isHi ? LOADING_STEPS_HI : LOADING_STEPS_EN;

  const runAnalysis = async (
    profNameVal: string,
    dobVal: string,
    tobVal: string,
    cityVal: string,
    latVal?: number,
    lonVal?: number,
    tzVal?: number,
    forceRefresh: boolean = false
  ) => {
    const cacheKey = generateCacheKey(profNameVal, dobVal, tobVal, cityVal, latVal, lonVal, language);

    // ⚡ Ultra-fast Local Cache Check (0ms latency, zero unnecessary API calls)
    if (!forceRefresh) {
      const cachedData = await getCachedAnalysis(cacheKey);
      if (cachedData) {
        setResult(cachedData);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const data = await fetchLalKitabAnalysis({ dob: dobVal, tob: tobVal, city: cityVal, lat: latVal, lon: lonVal, tz: tzVal, lang: language });
      const localFallback = buildLocalLalKitabFallback(profNameVal, dobVal, tobVal, cityVal, language, latVal, lonVal);
      const mergedResult: LalKitabResponseData = {
        ...localFallback,
        ...data,
        applied_rules_detailed: data.applied_rules_detailed || localFallback.applied_rules_detailed,
        debts: data.debts || localFallback.debts,
        pukka_ghar_summary: data.pukka_ghar_summary || localFallback.pukka_ghar_summary,
        aspects: data.aspects || localFallback.aspects,
        bnn_timeline: data.bnn_timeline || localFallback.bnn_timeline,
        saturn_report: data.saturn_report || localFallback.saturn_report,
        drishti_report: data.drishti_report || localFallback.drishti_report
      };
      setResult(mergedResult);
      await saveCachedAnalysis(cacheKey, mergedResult);
    } catch (err: any) {
      console.warn('Backend fetch failed, using local Lal Kitab fallback engine:', err);
      const fallbackData = buildLocalLalKitabFallback(profNameVal, dobVal, tobVal, cityVal, language, latVal, lonVal);
      setResult(fallbackData);
      await saveCachedAnalysis(cacheKey, fallbackData);
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
          runAnalysis('User', initialDob, initialTob, initialCity, initialLat, initialLon, initialTz);
        } else {
          const activeP = await getActiveProfile();
          if (activeP) {
            const dDay = activeP.dobDay.padStart(2, '0');
            const dMon = activeP.dobMonth.padStart(2, '0');
            const dYr = activeP.dobYear;
            const tH = activeP.tobHour.padStart(2, '0');
            const tM = activeP.tobMinute.padStart(2, '0');

            setProfileName(activeP.name);
            setDobDay(dDay);
            setDobMonth(dMon);
            setDobYear(dYr);
            setTobHour(tH);
            setTobMinute(tM);

            const formattedDob = `${dDay}/${dMon}/${dYr}`;
            const formattedTob = `${tH}:${tM}`;
            setDob(formattedDob);
            setTob(formattedTob);
            setCity(activeP.cityName);
            setLat(activeP.lat);
            setLon(activeP.lng);
            setSelectedProfileName(activeP.name);
            setShowForm(false);
            runAnalysis(activeP.name, formattedDob, formattedTob, activeP.cityName, activeP.lat, activeP.lng);
          } else {
            setShowForm(true);
          }
        }
      })();
    }
  }, [visible, initialDob, initialTob, initialCity, initialLat, initialLon, initialTz]);

  const handleSelectSavedProfile = (p: SavedKundaliProfile) => {
    const dDay = p.dobDay.padStart(2, '0');
    const dMon = p.dobMonth.padStart(2, '0');
    const dYr = p.dobYear;
    const tH = p.tobHour.padStart(2, '0');
    const tM = p.tobMinute.padStart(2, '0');

    setProfileName(p.name);
    setDobDay(dDay);
    setDobMonth(dMon);
    setDobYear(dYr);
    setTobHour(tH);
    setTobMinute(tM);

    const formattedDob = `${dDay}/${dMon}/${dYr}`;
    const formattedTob = `${tH}:${tM}`;
    setDob(formattedDob);
    setTob(formattedTob);
    setCity(p.cityName);
    setLat(p.lat);
    setLon(p.lng);
    setSelectedProfileName(p.name);
    setActiveProfileId(p.id);
    setShowSavedProfilesModal(false);
    setShowForm(false);
    runAnalysis(p.name, formattedDob, formattedTob, p.cityName, p.lat, p.lng);
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
    const finalName = profileName.trim() || 'User';
    const formattedDob = `${dobDay.padStart(2, '0')}/${dobMonth.padStart(2, '0')}/${dobYear}`;
    const formattedTob = `${tobHour.padStart(2, '0')}:${tobMinute.padStart(2, '0')}`;
    setDob(formattedDob);
    setTob(formattedTob);
    setSelectedProfileName(finalName);
    setShowForm(false);

    try {
      const updated = await saveKundaliProfile({
        name: finalName,
        dobDay: dobDay.padStart(2, '0'),
        dobMonth: dobMonth.padStart(2, '0'),
        dobYear: dobYear,
        tobHour: tobHour.padStart(2, '0'),
        tobMinute: tobMinute.padStart(2, '0'),
        cityName: city,
        lat: lat || 21.1702,
        lng: lon || 72.8311
      });
      setSavedProfiles(updated);
    } catch (e) {
      console.log('Error saving profile in LalKitabModal:', e);
    }

    runAnalysis(finalName, formattedDob, formattedTob, city, lat, lon, tz, true);
  };

  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 8, (StatusBar.currentHeight || 24) + 12);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#800000" />
        <View style={styles.container}>
          {/* Top Header */}
          <View style={[styles.header, { paddingTop: topPadding }]}>
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
              style={styles.addNewBtn}
              onPress={() => setShowAddNewProfileModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.addNewBtnText}>
                ➕ {isHi ? 'नया प्रोफाइल जोड़ें' : 'Add New Profile'}
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

                {/* Full Name Field */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{isHi ? 'नाम (Full Name)' : 'Full Name'}</Text>
                  <TextInput
                    style={styles.input}
                    value={profileName}
                    onChangeText={setProfileName}
                    placeholder={isHi ? 'अपना नाम दर्ज करें' : 'Enter full name'}
                    placeholderTextColor="#A0AEC0"
                  />
                </View>

                {/* Date of Birth (DOB) Dropdowns */}
                <Text style={styles.label}>{isHi ? 'जन्म तिथि (Date of Birth)' : 'Date of Birth (DOB)'}</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                  <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF5EE', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10 }}
                    onPress={() => setShowDayModal(true)}
                  >
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1E293B' }}>Day: {dobDay || 'DD'}</Text>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#800000' }}>▼</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF5EE', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10 }}
                    onPress={() => setShowMonthModal(true)}
                  >
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1E293B' }}>
                      {MONTHS_LIST[parseInt(dobMonth, 10) - 1] || 'Month: MM'}
                    </Text>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#800000' }}>▼</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF5EE', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10 }}
                    onPress={() => setShowYearModal(true)}
                  >
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1E293B' }}>Year: {dobYear || 'YYYY'}</Text>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#800000' }}>▼</Text>
                  </TouchableOpacity>
                </View>

                {/* Time of Birth (TOB) Dropdowns */}
                <Text style={styles.label}>{isHi ? 'जन्म समय (Time of Birth 24-hr)' : 'Time of Birth (TOB 24-hr)'}</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                  <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF5EE', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10 }}
                    onPress={() => setShowHourModal(true)}
                  >
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1E293B' }}>Hour: {tobHour !== '' ? tobHour : 'HH'}</Text>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#800000' }}>▼</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FAF5EE', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 10 }}
                    onPress={() => setShowMinuteModal(true)}
                  >
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1E293B' }}>Min: {tobMinute !== '' ? tobMinute : 'MM'}</Text>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#800000' }}>▼</Text>
                  </TouchableOpacity>
                </View>

                {/* Global Location of Birth Search Dropdown */}
                <Text style={styles.label}>{isHi ? 'जन्म स्थान (Global Location)' : 'Global Location of Birth'}</Text>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#FAF5EE',
                    borderWidth: 1,
                    borderColor: '#800000',
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    marginBottom: 14
                  }}
                  onPress={() => setShowCityPickerModal(true)}
                  activeOpacity={0.8}
                >
                  <View style={{ flex: 1 }}>
                    {city ? (
                      <>
                        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#800000' }}>📍 {city}</Text>
                        <Text style={{ fontSize: 10, color: '#666666', marginTop: 1 }}>
                          Lat: {lat ? lat.toFixed(4) : '21.1702'}° • Lng: {lon ? lon.toFixed(4) : '72.8311'}°
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#A0AEC0' }}>
                          📍 {isHi ? 'जन्म स्थान चुनें' : 'Select Birth Location'}
                        </Text>
                        <Text style={{ fontSize: 10, color: '#666666', marginTop: 1 }}>
                          {isHi ? 'शहर का नाम खोजें' : 'Tap to search birth city'}
                        </Text>
                      </>
                    )}
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#800000' }}>🔍 Search Place ▼</Text>
                </TouchableOpacity>

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
                      style={[styles.tabBtn, activeTab === 'SATURN_GUIDE' && styles.tabBtnActive]}
                      onPress={() => setActiveTab('SATURN_GUIDE')}
                    >
                      <Text style={[styles.tabBtnText, activeTab === 'SATURN_GUIDE' && styles.tabBtnTextActive]}>
                        🪐 {isHi ? 'लाल किताब शनि' : language === 'gu' ? 'શનિ ગાઇડ' : 'Saturn Guide'}
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
                      style={[styles.tabBtn, activeTab === 'DRISHTI' && styles.tabBtnActive]}
                      onPress={() => setActiveTab('DRISHTI')}
                    >
                      <Text style={[styles.tabBtnText, activeTab === 'DRISHTI' && styles.tabBtnTextActive]}>
                        👁️ {isHi ? 'दृष्टि व अचूक उपाय' : language === 'gu' ? 'દ્રષ્ટિ અને ઉપાય' : 'Drishti & Remedies'}
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

                {/* Tab: Lal Kitab Saturn Guide */}
                {activeTab === 'SATURN_GUIDE' && (() => {
                  const satReport = result.saturn_report;
                  if (!satReport) return null;

                  const hGuide = satReport.houseGuide;
                  const statusText = hGuide?.status?.[language] || hGuide?.status?.['hi'] || hGuide?.status?.['en'] || '';
                  
                  const manifestations = hGuide?.manifestations?.[language] || hGuide?.manifestations?.['hi'] || hGuide?.manifestations?.['en'] || [];
                  const becomesGood = hGuide?.becomesGoodWhen?.[language] || hGuide?.becomesGoodWhen?.['hi'] || hGuide?.becomesGoodWhen?.['en'] || [];
                  const becomesBad = hGuide?.becomesBadWhen?.[language] || hGuide?.becomesBadWhen?.['hi'] || hGuide?.becomesBadWhen?.['en'] || [];
                  const warnings = hGuide?.warnings?.[language] || hGuide?.warnings?.['hi'] || hGuide?.warnings?.['en'] || [];
                  const remedies = hGuide?.remedies?.[language] || hGuide?.remedies?.['hi'] || hGuide?.remedies?.['en'] || [];

                  const poisonChannel = satReport.poisonReleaseChannel?.[language] || satReport.poisonReleaseChannel?.['hi'] || satReport.poisonReleaseChannel?.['en'] || '';
                  const threeHouseName = satReport.threeHouseGroup?.name || '';
                  const threeHouseDesc = satReport.threeHouseGroup?.description?.[language] || satReport.threeHouseGroup?.description?.['hi'] || satReport.threeHouseGroup?.description?.['en'] || '';
                  const digLabel = satReport.saturnDignity ? (satReport.saturnDignity[language] || satReport.saturnDignity['hi'] || satReport.saturnDignity['en']) : hGuide?.dignityType;
                  const satChains = satReport.saturnChains;
                  const rkChain = satChains?.rahuKetuChain;
                  const jupChain = satChains?.jupiterChain;

                  let dignityBg = '#FEF3C7';
                  let dignityTextColor = '#92400E';
                  if (hGuide?.dignityType === 'EXALTED' || hGuide?.dignityType === 'OWN_HOUSE' || hGuide?.dignityType === 'EXCELLENT') {
                    dignityBg = '#DCFCE7';
                    dignityTextColor = '#166534';
                  } else if (hGuide?.dignityType === 'DEBILITATED') {
                    dignityBg = '#FEE2E2';
                    dignityTextColor = '#991B1B';
                  } else if (hGuide?.dignityType === 'DIFFICULT' || hGuide?.dignityType === 'CHALLENGING') {
                    dignityBg = '#FFEDD5';
                    dignityTextColor = '#9A3412';
                  }

                  return (
                    <View style={styles.card}>
                      <Text style={styles.cardHeader}>🪐 {isHi ? 'लाल किताब शनि (Saturn) संपूर्ण गाइड' : 'Lal Kitab Shani (Saturn) Complete House Guide'}</Text>
                      
                      {/* User Saturn Placement Badge */}
                      <View style={{ backgroundColor: '#1E293B', padding: 14, borderRadius: 12, marginBottom: 14 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#FFD700', flex: 1, flexShrink: 1 }}>
                            🪐 {isHi ? `शनि स्थिति: भाव ${satReport.userSaturnHouse}` : `Saturn Placement: House ${satReport.userSaturnHouse}`}
                          </Text>
                          <View style={{ backgroundColor: dignityBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, flexShrink: 0, alignSelf: 'flex-start' }}>
                            <Text style={{ fontSize: 11, fontWeight: 'bold', color: dignityTextColor }}>
                              {digLabel}
                            </Text>
                          </View>
                        </View>
                        
                        <Text style={{ fontSize: 13, color: '#E2E8F0', marginTop: 2, fontWeight: '600' }}>
                          📍 Rashi: {satReport.userSaturnRashi} • Degree: {satReport.userSaturnDegree}
                        </Text>
                        <Text style={{ fontSize: 13, color: '#FCD34D', marginTop: 4, fontStyle: 'italic' }}>
                          {statusText}
                        </Text>
                      </View>

                      {/* Permanent Section 1: Career - Saturn / Rahu / Ketu chain */}
                      {rkChain && (
                        <View style={{ backgroundColor: '#FFFFFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1', marginBottom: 14 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#800000', flex: 1, flexShrink: 1 }}>
                              🔗 Career - Saturn / Rahu / Ketu chain
                            </Text>
                            <View style={{ backgroundColor: rkChain.chainType === 'SATURN_RAHU' ? '#DCFCE7' : '#FEF3C7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: rkChain.chainType === 'SATURN_RAHU' ? '#86EFAC' : '#FDE68A' }}>
                              <Text style={{ fontSize: 11, fontWeight: 'bold', color: rkChain.chainType === 'SATURN_RAHU' ? '#166534' : '#92400E' }}>
                                {rkChain.chainType === 'SATURN_RAHU' ? (isHi ? 'उमदा ग्रोथ (RAHU)' : 'EXPANSIVE (RAHU)') : (isHi ? 'मंदा गति (KETU)' : 'MANDA PACE (KETU)')}
                              </Text>
                            </View>
                          </View>
                          <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1E293B', marginBottom: 6 }}>
                            {rkChain.statusTitle[language] || rkChain.statusTitle['hi'] || rkChain.statusTitle['en']}
                          </Text>
                          <Text style={{ fontSize: 12, color: '#334155', lineHeight: 18 }}>
                            {rkChain.summary[language] || rkChain.summary['hi'] || rkChain.summary['en']}
                          </Text>
                        </View>
                      )}

                      {/* Permanent Section 2: Career - Saturn - Jupiter chain */}
                      {jupChain && (
                        <View style={{ backgroundColor: '#FFFFFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1', marginBottom: 14 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#800000', flex: 1, flexShrink: 1 }}>
                              👑 Career - Saturn - Jupiter chain
                            </Text>
                            <View style={{ backgroundColor: jupChain.chainType === 'JUPITER_BEHIND' ? '#DCFCE7' : '#FEF3C7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: jupChain.chainType === 'JUPITER_BEHIND' ? '#86EFAC' : '#FDE68A' }}>
                              <Text style={{ fontSize: 11, fontWeight: 'bold', color: jupChain.chainType === 'JUPITER_BEHIND' ? '#166534' : '#92400E' }}>
                                {jupChain.chainType === 'JUPITER_BEHIND' ? (isHi ? 'उमदा लक (GURU BEHIND)' : 'SUPREME LUCK') : (isHi ? 'कठोर परिश्रम (GURU AHEAD)' : 'HARD WORK NEEDED')}
                              </Text>
                            </View>
                          </View>
                          <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1E293B', marginBottom: 6 }}>
                            {jupChain.statusTitle[language] || jupChain.statusTitle['hi'] || jupChain.statusTitle['en']}
                          </Text>
                          <Text style={{ fontSize: 12, color: '#334155', lineHeight: 18 }}>
                            {jupChain.summary[language] || jupChain.summary['hi'] || jupChain.summary['en']}
                          </Text>
                        </View>
                      )}



                      {/* House Specific Manifestation */}
                      <View style={{ backgroundColor: '#FFFFFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 14 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#800000', marginBottom: 8 }}>
                          📖 House {satReport.userSaturnHouse} Specific Life Manifestation:
                        </Text>
                        {manifestations.map((m: string, idx: number) => (
                          <Text key={idx} style={{ fontSize: 13, color: '#334155', marginBottom: 6, lineHeight: 19 }}>
                            • {m}
                          </Text>
                        ))}

                        {/* Becomes Good When */}
                        {becomesGood.length > 0 && (
                          <View style={{ marginTop: 8, backgroundColor: '#F0FDF4', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#BBF7D0' }}>
                            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#166534', marginBottom: 4 }}>
                              ✅ Becomes Auspicious / Good When:
                            </Text>
                            {becomesGood.map((bg: string, idx: number) => (
                              <Text key={idx} style={{ fontSize: 12, color: '#15803D', marginBottom: 3, lineHeight: 18 }}>
                                ✓ {bg}
                              </Text>
                            ))}
                          </View>
                        )}

                        {/* Becomes Bad When */}
                        {becomesBad.length > 0 && (
                          <View style={{ marginTop: 8, backgroundColor: '#FEF2F2', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#FECACA' }}>
                            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#991B1B', marginBottom: 4 }}>
                              ⚠️ Becomes Inauspicious / Malefic When:
                            </Text>
                            {becomesBad.map((bb: string, idx: number) => (
                              <Text key={idx} style={{ fontSize: 12, color: '#B91C1C', marginBottom: 3, lineHeight: 18 }}>
                                ✗ {bb}
                              </Text>
                            ))}
                          </View>
                        )}

                        {/* Warnings */}
                        {warnings.length > 0 && (
                          <View style={{ marginTop: 8, backgroundColor: '#FFF7ED', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#FFEDD5' }}>
                            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#C2410C', marginBottom: 4 }}>
                              🚫 Warnings & Strict Prohibitions:
                            </Text>
                            {warnings.map((w: string, idx: number) => (
                              <Text key={idx} style={{ fontSize: 12, color: '#9A3412', marginBottom: 3, lineHeight: 18 }}>
                                🛑 {w}
                              </Text>
                            ))}
                          </View>
                        )}

                        {/* House Specific Remedies */}
                        {remedies.length > 0 && (
                          <View style={{ marginTop: 10, backgroundColor: '#EFF6FF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#BFDBFE' }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1D4ED8', marginBottom: 6 }}>
                              🔮 House {satReport.userSaturnHouse} Specific Lal Kitab Remedies:
                            </Text>
                            {remedies.map((rem: string, idx: number) => (
                              <Text key={idx} style={{ fontSize: 13, color: '#1E40AF', marginBottom: 4, lineHeight: 19 }}>
                                💡 {rem}
                              </Text>
                            ))}
                          </View>
                        )}
                      </View>

                      {/* Evaluated Special Lal Kitab Rules (Render ONLY triggered active rules) */}
                      {(() => {
                        const activeSpecialRules = (satReport.specialRulesEvaluated || []).filter((r: any) => r.isTriggered === true);
                        if (activeSpecialRules.length === 0) return null;

                        return (
                          <View style={{ backgroundColor: '#FFFFFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 14 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#800000', marginBottom: 8 }}>
                              ⚡ Evaluated Special Lal Kitab Rules for Saturn:
                            </Text>
                            {activeSpecialRules.map((rule: any, idx: number) => {
                              const rName = rule.ruleName[language] || rule.ruleName['hi'] || rule.ruleName['en'];
                              const rDesc = rule.description[language] || rule.description['hi'] || rule.description['en'];
                              return (
                                <View
                                  key={idx}
                                  style={{
                                    backgroundColor: '#FFF5F5',
                                    padding: 10,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: '#FEB2B2',
                                    marginBottom: 8
                                  }}
                                >
                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#9B2C2C', flex: 1, flexShrink: 1 }}>
                                      🔥 {rName}
                                    </Text>
                                    <View style={{ backgroundColor: '#E53E3E', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, flexShrink: 0, alignSelf: 'flex-start' }}>
                                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#FFFFFF' }}>
                                        ACTIVE
                                      </Text>
                                    </View>
                                  </View>
                                  <Text style={{ fontSize: 12, color: '#742A2A', lineHeight: 18 }}>
                                    {rDesc}
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        );
                      })()}

                      {/* Conjunctions (Render ONLY IF active conjunctions exist) */}
                      {satReport.activeConjunctions && satReport.activeConjunctions.length > 0 ? (
                        <View style={{ backgroundColor: '#FFFFFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 14 }}>
                          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#800000', marginBottom: 8 }}>
                            🤝 Saturn Planetary Conjunctions (साथ बैठे ग्रह):
                          </Text>
                          {satReport.activeConjunctions.map((conj: any, idx: number) => {
                            const effText = conj.effect[language] || conj.effect['hi'] || conj.effect['en'];
                            return (
                              <View key={idx} style={{ backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 8 }}>
                                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1E293B', marginBottom: 3 }}>
                                  🪐 Saturn + {conj.planet} ({conj.nature})
                                </Text>
                                <Text style={{ fontSize: 12, color: '#475569', lineHeight: 18 }}>
                                  {effText}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      ) : null}

                      {/* Poison Release Channel (Render ONLY IF specific house triggers an active poison channel) */}
                      {satReport.hasActivePoisonChannel && poisonChannel ? (
                        <View style={{ backgroundColor: '#FDF4FF', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#F5D0FE', marginBottom: 14 }}>
                          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#86198F', marginBottom: 4 }}>
                            🧪 Saturn Poison Release Theory (विष निकास मार्ग):
                          </Text>
                          <Text style={{ fontSize: 12, color: '#701A75', lineHeight: 18 }}>
                            {poisonChannel}
                          </Text>
                        </View>
                      ) : null}

                      {/* 3 House Grouping & Age Milestones */}
                      <View style={{ backgroundColor: '#FFFFFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 14 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#800000', marginBottom: 6 }}>
                          🔄 Saturn 3-House Life Focus Group:
                        </Text>
                        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 }}>
                          {threeHouseName} (Houses: {satReport.threeHouseGroup?.houses?.join(', ')})
                        </Text>
                        <Text style={{ fontSize: 12, color: '#475569', marginBottom: 10, lineHeight: 18 }}>
                          {threeHouseDesc}
                        </Text>

                        <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#800000', marginBottom: 6 }}>
                          ⏱️ Key Age Activation Milestones of Saturn:
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                          {satReport.ageMilestones?.map((age: number, idx: number) => (
                            <View key={idx} style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, borderWidth: 1, borderColor: '#BFDBFE' }}>
                              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1D4ED8' }}>
                                Age {age}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>



                    </View>
                  );
                })()}

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
                          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#15803D', textAlign: 'center', marginBottom: 8 }}>
                            ✨ Your Kundli is Ancestral Debt Free (आपकी कुंडली पूर्णतः पितृ व पूर्वज ऋणों से मुक्त है)
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

                {/* Tab: Lal Kitab Drishti & Remedies Engine */}
                {activeTab === 'DRISHTI' && (() => {
                  const drishtiReport = result.drishti_report;
                  if (!drishtiReport) return null;

                  const remedyAudit = drishtiReport.remedyAudit || {};
                  const houseRemedies = remedyAudit.houseRemedies || [];
                  const drishtiRemedies = remedyAudit.drishtiRemedies || [];
                  const combinationRemedies = remedyAudit.combinationRemedies || [];
                  const universalRemedies = remedyAudit.universalRemedies || [];

                  return (
                    <View style={styles.card}>
                      <Text style={styles.cardHeader}>
                        👁️ {isHi ? 'दृष्टि व अचूक उपाय (Lal Kitab Drishti & Remedies)' : language === 'gu' ? 'દ્રષ્ટિ અને ઉપાય' : 'Lal Kitab Drishti & Remedies'}
                      </Text>
                      <Text style={styles.cardSubText}>
                        {isHi
                          ? 'लाल किताब दृष्टि सिद्धान्त और प्राथमिकताओं के अनुसार ग्रहीय युति व अचूक निवारण उपाय:'
                          : 'Lal Kitab House Aspect laws, Virtual Conjunctions & Priority Remedial Engine:'}
                      </Text>

                      {/* 🔮 Section 1: Active Planetary Drishti (सक्रिय ग्रहीय दृष्टियां) */}
                      <View style={{ backgroundColor: '#FFFFFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 14 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#800000', marginBottom: 8 }}>
                          🔮 {isHi ? 'सक्रिय ग्रहीय दृष्टियां (Active Chart Aspects)' : 'Active Planetary Drishti (Birth Chart)'}
                        </Text>

                        {/* 🛑 Ulti Drishti Red Alert Card (if House 8 contains planets casting aspect on House 2) */}
                        {(() => {
                          const ultiAspect = drishtiReport.activeAspects?.find((a: any) => a.rule?.alwaysMalefic || a.rule?.from === 8);
                          if (ultiAspect) {
                            return (
                              <View style={{ backgroundColor: '#FEE2E2', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#FECACA', marginBottom: 12 }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#991B1B', marginBottom: 4 }}>
                                  🛑 Ulti Drishti Active (अष्टम से द्वितीय भाव उल्टी दृष्टि)
                                </Text>
                                <Text style={{ fontSize: 12, color: '#7F1D1D', lineHeight: 18, marginBottom: 6 }}>
                                  {isHi
                                    ? `अष्टम भाव का ग्रह (${ultiAspect.fromPlanets.join(', ')}) द्वितीय भाव (${ultiAspect.toPlanets.length > 0 ? ultiAspect.toPlanets.join(', ') : 'कुटुंब व धन'}) को पीड़ित कर रहा है। यह धन व पारिवारिक सौहार्द पर प्रतिकूल प्रभाव डालता है।`
                                    : `Planets in House 8 (${ultiAspect.fromPlanets.join(', ')}) cast a 100% malefic Ulti Drishti (Reverse Aspect) onto House 2 (${ultiAspect.toPlanets.length > 0 ? ultiAspect.toPlanets.join(', ') : 'Wealth & Family'}).`}
                                </Text>
                                {drishtiRemedies.map((dr: any, idx: number) => (
                                  <View key={idx} style={{ marginTop: 4 }}>
                                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#991B1B' }}>
                                      💡 Trigger {dr.trigger} Remedies:
                                    </Text>
                                    {dr.remedy?.map((rem: string, rIdx: number) => (
                                      <Text key={rIdx} style={{ fontSize: 11, color: '#7F1D1D', lineHeight: 16 }}>
                                        • {rem}
                                      </Text>
                                    ))}
                                  </View>
                                ))}
                              </View>
                            );
                          }
                          return null;
                        })()}

                        {/* List of Active Aspects */}
                        {drishtiReport.activeAspects && drishtiReport.activeAspects.length > 0 ? (
                          drishtiReport.activeAspects.map((aspect: any, idx: number) => {
                            const pct = aspect.aspectStrengthPct;
                            let badgeBg = '#F1F5F9';
                            let badgeTextColor = '#475569';
                            let badgeLabel = `🔹 25% Quarter Aspect`;

                            if (aspect.rule?.alwaysMalefic || aspect.rule?.from === 8) {
                              badgeBg = '#FEE2E2';
                              badgeTextColor = '#991B1B';
                              badgeLabel = `🛑 100% Ulti Drishti Alert`;
                            } else if (pct === 100) {
                              badgeBg = '#DCFCE7';
                              badgeTextColor = '#166534';
                              badgeLabel = `🎯 100% Full Aspect`;
                            } else if (pct === 50) {
                              badgeBg = '#FEF3C7';
                              badgeTextColor = '#92400E';
                              badgeLabel = `⚡ 50% Half Aspect`;
                            }

                            const interpText = aspect.interpretation?.[language] || aspect.interpretation?.['hi'] || aspect.interpretation?.['en'];

                            return (
                              <View key={idx} style={{ backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 8 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
                                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1E293B', flex: 1, flexShrink: 1 }}>
                                    House {aspect.rule.from} ➔ House {aspect.rule.to}
                                  </Text>
                                  <View style={{ backgroundColor: badgeBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, flexShrink: 0, alignSelf: 'flex-start' }}>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: badgeTextColor }}>
                                      {badgeLabel}
                                    </Text>
                                  </View>
                                </View>
                                <Text style={{ fontSize: 12, color: '#334155', lineHeight: 18 }}>
                                  {interpText}
                                </Text>
                              </View>
                            );
                          })
                        ) : (
                          <Text style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic' }}>
                            No active planetary aspects detected in this birth chart.
                          </Text>
                        )}
                      </View>

                      {/* 🤝 Section 2: Special Relationships & Virtual Conjunctions */}
                      <View style={{ backgroundColor: '#FFFFFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 14 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#800000', marginBottom: 8 }}>
                          🤝 {isHi ? 'विशेष ग्रहीय संबंध व आभासी युति (Special Relationships)' : 'Special Relationships & Virtual Conjunctions'}
                        </Text>

                        {drishtiReport.specialRelationships && drishtiReport.specialRelationships.length > 0 ? (
                          drishtiReport.specialRelationships.map((rel: any, idx: number) => {
                            let relBg = '#F8FAFC';
                            let relBorder = '#E2E8F0';
                            let relBadgeBg = '#E0F2FE';
                            let relBadgeText = '#075985';
                            let relLabel = `🏡 Neighbor House`;

                            if (rel.type === 'OPPOSITE_AXIS') {
                              relBg = '#FAF5FF';
                              relBorder = '#E9D5FF';
                              relBadgeBg = '#F3E8FF';
                              relBadgeText = '#6B21A8';
                              relLabel = `🔄 Virtual Conjunction`;
                            } else if (rel.type === 'ULTI_DRISHTI') {
                              relBadgeBg = '#FEE2E2';
                              relBadgeText = '#991B1B';
                              relLabel = `🛑 Ulti Drishti`;
                            } else if (rel.type === 'DHARMA_SUPPORT') {
                              relBadgeBg = '#FEF3C7';
                              relBadgeText = '#92400E';
                              relLabel = `👑 Dharma Axis Support`;
                            }

                            const relDesc = rel.description?.[language] || rel.description?.['hi'] || rel.description?.['en'];

                            return (
                              <View key={idx} style={{ backgroundColor: relBg, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: relBorder, marginBottom: 8 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
                                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1E293B', flex: 1, flexShrink: 1 }}>
                                    Houses {rel.houses[0]} & {rel.houses[1]}
                                  </Text>
                                  <View style={{ backgroundColor: relBadgeBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, flexShrink: 0, alignSelf: 'flex-start' }}>
                                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: relBadgeText }}>
                                      {relLabel}
                                    </Text>
                                  </View>
                                </View>
                                <Text style={{ fontSize: 12, color: '#334155', lineHeight: 18 }}>
                                  {relDesc}
                                </Text>
                              </View>
                            );
                          })
                        ) : (
                          <Text style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic' }}>
                            No special relationship pairs active in current placements.
                          </Text>
                        )}
                      </View>

                      {/* ⚡ Section 3: Planet Combination Remedies (सर्वोच्च प्राथमिकता योग) */}
                      <View style={{ backgroundColor: '#FFF7ED', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#FFEDD5', marginBottom: 14 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#C2410C', marginBottom: 8 }}>
                          ⚡ {isHi ? 'सर्वोच्च प्राथमिकता ग्रहीय योग व उपाय (Planet Combination Remedies)' : 'Planet Combination Remedies (Highest Priority)'}
                        </Text>
                        {combinationRemedies.length > 0 ? (
                          combinationRemedies.map((cRem: any, idx: number) => (
                            <View key={idx} style={{ backgroundColor: '#FFFFFF', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#FDBA74', marginBottom: 8 }}>
                              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#9A3412', marginBottom: 2 }}>
                                💡 {cRem.combo}
                              </Text>
                              <Text style={{ fontSize: 12, color: '#C2410C', fontStyle: 'italic', marginBottom: 4 }}>
                                Impact: {cRem.result}
                              </Text>
                              <Text style={{ fontSize: 12, fontWeight: '600', color: '#7C2D12' }}>
                                🙏 Upay: {cRem.remedy}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <Text style={{ fontSize: 12, color: '#9A3412', fontStyle: 'italic' }}>
                            No major conflicting or protective planet combinations in same house or opposite axis.
                          </Text>
                        )}
                      </View>

                      {/* 🏠 Section 4: House-Specific Planet Remedies (भाव अनुसार अचूक टोटके) */}
                      <View style={{ backgroundColor: '#FFFFFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 14 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#800000', marginBottom: 8 }}>
                          🏠 {isHi ? 'भाव अनुसार अचूक लाल किताब टोटके (House Placement Remedies)' : 'House-Specific Planet Remedies'}
                        </Text>
                        {houseRemedies.length > 0 ? (
                          houseRemedies.map((hRem: any, idx: number) => (
                            <View key={idx} style={{ backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 8 }}>
                              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1E293B', marginBottom: 2 }}>
                                🪐 {hRem.planet} in House {hRem.house}
                              </Text>
                              <Text style={{ fontSize: 12, color: '#334155', lineHeight: 18 }}>
                                💡 {hRem.remedy}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <Text style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic' }}>
                            Standard house remedies evaluated.
                          </Text>
                        )}
                      </View>

                      {/* 🛡️ Section 5: Universal Planet Remedies (सार्वभौमिक नियम) */}
                      <View style={{ backgroundColor: '#F0FDF4', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#BBF7D0' }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#166534', marginBottom: 8 }}>
                          🛡️ {isHi ? 'सार्वभौमिक ग्रहीय नियम व अचूक उपाय (Universal Planet Remedies)' : 'Universal Planet Lifestyle Remedies'}
                        </Text>
                        {universalRemedies.length > 0 ? (
                          universalRemedies.map((uRem: any, idx: number) => (
                            <View key={idx} style={{ marginBottom: 8 }}>
                              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#15803D', marginBottom: 2 }}>
                                🌟 {uRem.planet}:
                              </Text>
                              {uRem.remedies.map((rem: string, rIdx: number) => (
                                <Text key={rIdx} style={{ fontSize: 12, color: '#166534', lineHeight: 18, paddingLeft: 8 }}>
                                  • {rem}
                                </Text>
                              ))}
                            </View>
                          ))
                        ) : (
                          <Text style={{ fontSize: 12, color: '#15803D', fontStyle: 'italic' }}>
                            Daily lifestyle remedies active.
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })()}

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

                  <TouchableOpacity
                    style={{ backgroundColor: '#800000', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 12 }}
                    onPress={() => {
                      setShowSavedProfilesModal(false);
                      setShowAddNewProfileModal(true);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' }}>
                      ➕ {isHi ? 'नया जन्म प्रोफाइल जोड़ें' : 'Add New Birth Profile'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Day Picker Modal */}
        <Modal visible={showDayModal} animationType="fade" transparent>
          <TouchableWithoutFeedback onPress={() => setShowDayModal(false)}>
            <View style={styles.dropdownOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.dropdownModalCard}>
                  <Text style={styles.dropdownTitle}>{isHi ? 'जन्म तिथि चुनें (Day)' : 'Select Day of Birth'}</Text>
                  <ScrollView style={{ maxHeight: 300, marginTop: 10 }}>
                    {DAYS_LIST.map(d => (
                      <TouchableOpacity
                        key={d}
                        style={[styles.pickerItem, dobDay === d && styles.pickerItemActive]}
                        onPress={() => {
                          setDobDay(d);
                          setShowDayModal(false);
                        }}
                      >
                        <Text style={[styles.pickerItemText, dobDay === d && styles.pickerItemTextActive]}>Day {d}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Month Picker Modal */}
        <Modal visible={showMonthModal} animationType="fade" transparent>
          <TouchableWithoutFeedback onPress={() => setShowMonthModal(false)}>
            <View style={styles.dropdownOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.dropdownModalCard}>
                  <Text style={styles.dropdownTitle}>{isHi ? 'जन्म महीना चुनें (Month)' : 'Select Month of Birth'}</Text>
                  <ScrollView style={{ maxHeight: 300, marginTop: 10 }}>
                    {MONTHS_LIST.map((m, idx) => {
                      const mVal = (idx + 1).toString().padStart(2, '0');
                      return (
                        <TouchableOpacity
                          key={m}
                          style={[styles.pickerItem, dobMonth === mVal && styles.pickerItemActive]}
                          onPress={() => {
                            setDobMonth(mVal);
                            setShowMonthModal(false);
                          }}
                        >
                          <Text style={[styles.pickerItemText, dobMonth === mVal && styles.pickerItemTextActive]}>{m}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Year Picker Modal */}
        <Modal visible={showYearModal} animationType="fade" transparent>
          <TouchableWithoutFeedback onPress={() => setShowYearModal(false)}>
            <View style={styles.dropdownOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.dropdownModalCard}>
                  <Text style={styles.dropdownTitle}>{isHi ? 'जन्म वर्ष चुनें (Year)' : 'Select Year of Birth'}</Text>
                  <ScrollView style={{ maxHeight: 300, marginTop: 10 }}>
                    {YEARS_LIST.map(y => (
                      <TouchableOpacity
                        key={y}
                        style={[styles.pickerItem, dobYear === y && styles.pickerItemActive]}
                        onPress={() => {
                          setDobYear(y);
                          setShowYearModal(false);
                        }}
                      >
                        <Text style={[styles.pickerItemText, dobYear === y && styles.pickerItemTextActive]}>{y}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Hour Picker Modal */}
        <Modal visible={showHourModal} animationType="fade" transparent>
          <TouchableWithoutFeedback onPress={() => setShowHourModal(false)}>
            <View style={styles.dropdownOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.dropdownModalCard}>
                  <Text style={styles.dropdownTitle}>{isHi ? 'जन्म घंटा चुनें (Hour)' : 'Select Hour of Birth (24-Hour)'}</Text>
                  <ScrollView style={{ maxHeight: 300, marginTop: 10 }}>
                    {HOURS_LIST.map(h => (
                      <TouchableOpacity
                        key={h}
                        style={[styles.pickerItem, tobHour === h && styles.pickerItemActive]}
                        onPress={() => {
                          setTobHour(h);
                          setShowHourModal(false);
                        }}
                      >
                        <Text style={[styles.pickerItemText, tobHour === h && styles.pickerItemTextActive]}>{h}:00 Hours</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Minute Picker Modal */}
        <Modal visible={showMinuteModal} animationType="fade" transparent>
          <TouchableWithoutFeedback onPress={() => setShowMinuteModal(false)}>
            <View style={styles.dropdownOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.dropdownModalCard}>
                  <Text style={styles.dropdownTitle}>{isHi ? 'जन्म मिनट चुनें (Minute)' : 'Select Minute of Birth'}</Text>
                  <ScrollView style={{ maxHeight: 300, marginTop: 10 }}>
                    {MINUTES_LIST.map(m => (
                      <TouchableOpacity
                        key={m}
                        style={[styles.pickerItem, tobMinute === m && styles.pickerItemActive]}
                        onPress={() => {
                          setTobMinute(m);
                          setShowMinuteModal(false);
                        }}
                      >
                        <Text style={[styles.pickerItemText, tobMinute === m && styles.pickerItemTextActive]}>{m} Minutes</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <CitySelectionModal
          visible={showCityPickerModal}
          onClose={() => setShowCityPickerModal(false)}
          onSelectCity={(selectedLoc) => {
            const cleanName = selectedLoc.name.replace(/\s*\(GPS\)/gi, '').trim() || selectedLoc.name;
            setCity(cleanName);
            if (selectedLoc.latitude) setLat(selectedLoc.latitude);
            if (selectedLoc.longitude) setLon(selectedLoc.longitude);
            setShowCityPickerModal(false);
          }}
          selectedCity={{
            name: city || 'Surat',
            hindiName: city || 'सूरत',
            stateCountry: '',
            latitude: lat || 21.17,
            longitude: lon || 72.83,
            timeZoneId: 'Asia/Kolkata'
          }}
          title="Select Birth Place / जन्म स्थान"
          persistToGlobalStorage={false}
        />

        <AddNewProfileModal
          visible={showAddNewProfileModal}
          onClose={() => setShowAddNewProfileModal(false)}
          onProfileAdded={async (newP) => {
            const fresh = await getSavedProfiles();
            setSavedProfiles(fresh);
            handleSelectSavedProfile(newP);
          }}
        />
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
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFF3E0',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
    gap: 6,
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
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6
  },
  activeProfileName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    flex: 1,
    flexShrink: 1
  },
  editProfileBtn: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFB74D',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexShrink: 0,
    alignSelf: 'flex-start'
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
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 6
  },
  debtTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
    flex: 1,
    flexShrink: 1
  },
  activeDebtBadge: {
    backgroundColor: '#C62828',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexShrink: 0,
    alignSelf: 'flex-start'
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
  },
  pickerItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4
  },
  pickerItemActive: {
    backgroundColor: '#FFF8E7'
  },
  pickerItemText: {
    fontSize: 13,
    color: Colors.textPrimary
  },
  pickerItemTextActive: {
    fontWeight: 'bold',
    color: Colors.maroon
  }
});
