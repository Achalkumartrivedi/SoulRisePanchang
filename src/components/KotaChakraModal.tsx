import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { calculateKotaChakra, KOTA_ZONES, KotaChakraResult, ALL_28_NAKSHATRAS, convert27to28NakshatraIndex, getTransitPlanetsForDate } from '../engine/kotaChakraEngine';
import { calculatePanchang } from '../engine/panchangEngine';
import { SavedKundaliProfile, getActiveProfile } from '../utils/profileStorage';
import { ProfileSelectorModal } from './ProfileSelectorModal';
import { NakshatraInfoModal } from './NakshatraInfoModal';
import { KotaChakraInfoModal } from './KotaChakraInfoModal';
import { KotaChakraDiagramSVG, PlanetFilterMode } from './KotaChakraDiagramSVG';
import { getProfileNakshatraDetails, getProfileBirthPlanets } from '../utils/profileNakshatraHelper';
import { KotaChakraTerminologyModal } from './KotaChakraTerminologyModal';
import { TransitDatePickerModal } from './TransitDatePickerModal';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface KotaChakraModalProps {
  visible: boolean;
  onClose: () => void;
  defaultNakshatraIndex?: number;
}

export const KotaChakraModal: React.FC<KotaChakraModalProps> = ({
  visible,
  onClose,
  defaultNakshatraIndex = 16 // Default Vishakha like reference image
}) => {
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 8, (StatusBar.currentHeight || 24) + 12);

  const [selectedNakshatraIdx, setSelectedNakshatraIdx] = useState<number>(defaultNakshatraIndex);
  const [filterMode, setFilterMode] = useState<PlanetFilterMode>('ALL');

  // Transit Date Selector State (Affects ONLY Transit Planets)
  const [transitDate, setTransitDate] = useState<Date>(new Date());
  const [showDatePickerModal, setShowDatePickerModal] = useState<boolean>(false);

  // Profile & Toast States
  const [loadedProfile, setLoadedProfile] = useState<SavedKundaliProfile | null>(null);
  const [lastLoadedProfile, setLastLoadedProfile] = useState<SavedKundaliProfile | null>(null);
  const [showProfileSelector, setShowProfileSelector] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Info Modals States
  const [infoNakIndex, setInfoNakIndex] = useState<number | null>(null);
  const [showKotaGuideModal, setShowKotaGuideModal] = useState<boolean>(false);
  const [showTerminologyModal, setShowTerminologyModal] = useState<boolean>(false);

  // Today's Running Nakshatra (5-Limbs Panchang)
  const [runningNakIndex, setRunningNakIndex] = useState<number>(1);

  useEffect(() => {
    if (visible) {
      const defaultCity = { name: 'New Delhi', hindiName: 'नई दिल्ली', stateCountry: 'India', latitude: 28.6139, longitude: 77.2090, timeZoneId: 'Asia/Kolkata' };
      const panchang = calculatePanchang(new Date(), defaultCity);
      const currNakIdx = panchang.nakshatra?.number || 1;
      const currNak28Idx = convert27to28NakshatraIndex(currNakIdx);
      setRunningNakIndex(currNak28Idx);

      // Automatically load active user profile on modal opening if available
      getActiveProfile().then(prof => {
        if (prof) {
          const { nak28Index } = getProfileNakshatraDetails(prof);
          setLoadedProfile(prof);
          setLastLoadedProfile(prof);
          setSelectedNakshatraIdx(nak28Index);
        }
      });
    }
  }, [visible]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const getTxt = (guj: string, hin: string, eng: string) => {
    if (language === 'gu') return guj;
    if (language === 'hi') return hin;
    return eng;
  };

  const handleSelectTransitDate = (newDate: Date) => {
    setTransitDate(newDate);
    const dateStr = `${newDate.getDate().toString().padStart(2, '0')} ${MONTHS_SHORT[newDate.getMonth()]} ${newDate.getFullYear()}`;

    // Recalculate transit condition for alert
    const newTransits = getTransitPlanetsForDate(newDate);
    const tempResult = calculateKotaChakra(selectedNakshatraIdx, moonSignLord, customBirthPlanets, newTransits);
    const category = tempResult.lifeImpactCategory;

    if (category === 'INAUSPICIOUS') {
      showToast(getTxt(
        `🔴 અશુભ ગોચર ચેતવણી! (${dateStr}): સ્તંભમાં ક્રૂર ગ્રહોનો પ્રવેશ છે!`,
        `🔴 अशुभ गोचर चेतावनी! (${dateStr}): स्तंभ में क्रूर ग्रहों का प्रवेश है!`,
        `🔴 Inauspicious Malefic Alert! (${dateStr}): Malefic planets in Stambha pillar on this date!`
      ));
    } else if (category === 'AUSPICIOUS') {
      showToast(getTxt(
        `🟢 શુભ ગોચર સ્થિતિ! (${dateStr}): કોટા સ્વામી અને શુભ ગ્રહો દ્વારા પૂર્ણ રક્ષણ!`,
        `🟢 शुभ गोचर स्थिति! (${dateStr}): कोटा स्वामी और शुभ ग्रहों द्वारा पूर्ण संरक्षण!`,
        `🟢 Auspicious Protection Found! (${dateStr}): Fortress safe & protected by Benefic planets!`
      ));
    } else {
      showToast(getTxt(
        `🟠 મિશ્ર ગોચર સ્થિતિ (${dateStr}): સંતુલિત ગોચર પ્રભાવ.`,
        `🟠 मिश्रित गोचर स्थिति (${dateStr}): संतुलित गोचर प्रभाव।`,
        `🟠 Mixed Transit Status (${dateStr}): Moderate fort defense forces on this date.`
      ));
    }
  };

  const handleResetTransitDate = () => {
    const today = new Date();
    setTransitDate(today);
    const dateStr = `${today.getDate().toString().padStart(2, '0')} ${MONTHS_SHORT[today.getMonth()]} ${today.getFullYear()}`;
    showToast(getTxt(
      `ગોચર તારીખ આજ પર રિસેટ કરી: ${dateStr}`,
      `गोचर तिथि आज पर रीसेट की: ${dateStr}`,
      `Transit Date reset to today: ${dateStr}`
    ));
  };

  const isTodayDate = (d: Date) => {
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  const profileForPlanets = loadedProfile || lastLoadedProfile;
  const customBirthPlanets = profileForPlanets ? getProfileBirthPlanets(profileForPlanets) : undefined;
  const profileDetails = profileForPlanets ? getProfileNakshatraDetails(profileForPlanets) : undefined;
  const moonSignLord = profileDetails ? profileDetails.moonSignLord : 'Mars';

  const customTransitPlanets = getTransitPlanetsForDate(transitDate);

  const result: KotaChakraResult = calculateKotaChakra(
    selectedNakshatraIdx,
    moonSignLord,
    customBirthPlanets,
    customTransitPlanets
  );

  const handleSelectProfile = (profile: SavedKundaliProfile, nakIndex: number) => {
    const { nak28Index } = getProfileNakshatraDetails(profile);
    setLoadedProfile(profile);
    setLastLoadedProfile(profile);
    setSelectedNakshatraIdx(nak28Index);
    setShowProfileSelector(false);

    const profNakName = language === 'gu'
      ? ALL_28_NAKSHATRAS[nak28Index - 1].nameGuj
      : language === 'hi'
      ? ALL_28_NAKSHATRAS[nak28Index - 1].nameHin
      : ALL_28_NAKSHATRAS[nak28Index - 1].nameEng;

    showToast(getTxt(
      `'${profile.name}' પ્રોફાઇલ લાગુ થઈ (${profNakName})`,
      `'${profile.name}' प्रोफाइल लागू की गई (${profNakName})`,
      `'${profile.name}' Profile is applied (${profNakName})`
    ));
  };

  const handleNakshatraChipPress = (targetNakIndex: number) => {
    const nakDetail = ALL_28_NAKSHATRAS[targetNakIndex - 1];
    const targetNakName = language === 'gu'
      ? nakDetail.nameGuj
      : language === 'hi'
      ? nakDetail.nameHin
      : nakDetail.nameEng;

    if (loadedProfile && targetNakIndex !== selectedNakshatraIdx) {
      setLoadedProfile(null);
    }

    setSelectedNakshatraIdx(targetNakIndex);

    showToast(getTxt(
      `તમે ${targetNakName} નક્ષત્ર પસંદ કર્યું છે.`,
      `आपने ${targetNakName} नक्षत्र चुना है।`,
      `You have changed to Selected Nakshatra: ${targetNakName}`
    ));
  };

  const handleFilterModeChange = async (mode: PlanetFilterMode) => {
    setFilterMode(mode);

    if (mode === 'TRANSIT') {
      const category = result.lifeImpactCategory;
      const dateStr = `${transitDate.getDate().toString().padStart(2, '0')} ${MONTHS_SHORT[transitDate.getMonth()]} ${transitDate.getFullYear()}`;

      if (category === 'INAUSPICIOUS') {
        showToast(getTxt(
          `🔴 અશુભ ગોચર ચેતવણી! (${dateStr}): સ્તંભમાં ક્રૂર ગ્રહોનો પ્રવેશ છે!`,
          `🔴 अशुभ गोचर चेतावनी! (${dateStr}): स्तंभ में क्रूर ग्रहों का प्रवेश है!`,
          `🔴 Inauspicious Malefic Alert! (${dateStr}): Malefic planets in Stambha pillar!`
        ));
      } else if (category === 'AUSPICIOUS') {
        showToast(getTxt(
          `🟢 શુભ ગોચર સ્થિતિ! (${dateStr}): કોટા સ્વામી અને સૌમ્ય ગ્રહોનું રક્ષણ!`,
          `🟢 शुभ गोचर स्थिति! (${dateStr}): कोटा स्वामी और सौम्य ग्रहों का संरक्षण!`,
          `🟢 Auspicious Protection Found! (${dateStr}): Fortress safe & protected by Benefic planets!`
        ));
      } else {
        showToast(getTxt(
          `🟠 મિશ્ર ગોચર સ્થિતિ (${dateStr}): સામાન્ય કિલ્લા રક્ષણ.`,
          `🟠 मिश्रित गोचर स्थिति (${dateStr}): सामान्य दुर्ग रक्षा।`,
          `🟠 Mixed Transit Status (${dateStr}): Balanced planetary forces.`
        ));
      }
    } else if (mode === 'NATAL') {
      let profToApply = loadedProfile || lastLoadedProfile;

      if (!profToApply) {
        profToApply = await getActiveProfile();
      }

      if (profToApply) {
        const { nak28Index } = getProfileNakshatraDetails(profToApply);
        setLoadedProfile(profToApply);
        setLastLoadedProfile(profToApply);
        setSelectedNakshatraIdx(nak28Index);

        const profNakName = language === 'gu'
          ? ALL_28_NAKSHATRAS[nak28Index - 1].nameGuj
          : language === 'hi'
          ? ALL_28_NAKSHATRAS[nak28Index - 1].nameHin
          : ALL_28_NAKSHATRAS[nak28Index - 1].nameEng;

        showToast(getTxt(
          `'${profToApply.name}' પ્રોફાઇલ લાગુ થઈ (${profNakName})`,
          `'${profToApply.name}' प्रोफाइल लागू की गई (${profNakName})`,
          `'${profToApply.name}' Profile is applied (${profNakName})`
        ));
      } else {
        setShowProfileSelector(true);
        showToast(getTxt(
          `જન્મ ગ્રહો ચાર્ટ જોવા માટે કૃપા કરીને પ્રોફાઇલ પસંદ કરો`,
          `जन्म ग्रह चार्ट देखने के लिए कृपया प्रोफाइल चुनें`,
          `Please load a profile to view Natal Planets chart`
        ));
      }
    }
  };

  const lifeImpactTitle = getTxt(result.lifeImpactTitle.gu, result.lifeImpactTitle.hi, result.lifeImpactTitle.en);
  const lifeImpactDesc = getTxt(result.lifeImpactDesc.gu, result.lifeImpactDesc.hi, result.lifeImpactDesc.en);
  const remedyText = getTxt(result.remedyText.gu, result.remedyText.hi, result.remedyText.en);

  const isRedAlert = result.lifeImpactCategory === 'INAUSPICIOUS';

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Toast Notification Banner */}
        {toastMessage && (
          <View style={[styles.toastContainer, { top: topPadding + 44 }]}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        {/* Header Bar with Title Info Button (ⓘ) */}
        <View style={[styles.headerRow, { paddingTop: topPadding }]}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>
                🏰 {getTxt('કોટા ચક્ર', 'कोटा चक्र', 'Kota Chakra')}
              </Text>

              {/* Header Title Info Button (ⓘ) */}
              <TouchableOpacity
                style={styles.headerInfoBtn}
                onPress={() => setShowKotaGuideModal(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.headerInfoBtnText}>ⓘ Guide</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.headerSub}>
              {getTxt('૨૮ નક્ષત્ર અને ૪ દુર્ગ ક્ષેત્ર ગોચર વિશ્લેષણ', '२८ नक्षत्र एवं ४ दुर्ग क्षेत्र गोचर विश्लेषण', 'Authentic 28-Nakshatra Concentric Fort Transit Defense')}
            </Text>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Automatic High-Severity Red Alert Banner */}
          {isRedAlert && (
            <View style={styles.redAlertBanner}>
              <Text style={styles.redAlertTitle}>
                🚨 {getTxt('અશુભ ગોચર સંકટ ચેતવણી!', 'अशुभ गोचर संकट चेतावनी!', 'Inauspicious Malefic Siege Alert!')}
              </Text>
              <Text style={styles.redAlertDesc}>{lifeImpactDesc}</Text>
              <View style={styles.remedyBox}>
                <Text style={styles.remedyText}>{remedyText}</Text>
              </View>
            </View>
          )}

          {/* Nakshatra Selector Card */}
          <View style={styles.selectorCard}>
            <View style={styles.selectorTopHeader}>
              <Text style={styles.cardLabel}>
                📍 {getTxt('જન્મ / કોટા કેન્દ્ર નક્ષત્ર પસંદ કરો', 'जन्म / कोटा केंद्र नक्षत्र चुनें', 'Select Janma / Kota Center Nakshatra')}:
              </Text>

              {/* Load Profile Button */}
              <TouchableOpacity
                style={[styles.loadProfileBtn, loadedProfile && styles.loadProfileBtnActive]}
                onPress={() => setShowProfileSelector(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.loadProfileBtnText}>
                  👤 {loadedProfile ? loadedProfile.name : getTxt('પ્રોફાઈલ લોડ કરો', 'प्रोफाइल लोड करें', 'Load Profile')}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.nakChipRow}>
              {ALL_28_NAKSHATRAS.map(nak => {
                const isActive = nak.index28 === selectedNakshatraIdx;
                const isRunning = nak.index28 === runningNakIndex;
                const nakName = language === 'gu' ? nak.nameGuj : language === 'hi' ? nak.nameHin : nak.nameEng;

                return (
                  <TouchableOpacity
                    key={nak.index28}
                    style={[
                      styles.nakChip,
                      isActive && styles.nakChipActive,
                      isRunning && !isActive && styles.nakChipRunning
                    ]}
                    onPress={() => handleNakshatraChipPress(nak.index28)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.nakChipText, isActive && styles.nakChipTextActive]}>
                      {nak.index28}. {nakName} {isRunning ? '⚡' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Transit Date Selector Bar (Life Event Inspection) */}
          <View style={styles.transitDateBarCard}>
            <View style={styles.transitDateInfoCol}>
              <Text style={styles.transitDateTitle}>
                📅 {getTxt('ગોચર તારીખ (લાઇફ ઇવેન્ટ)', 'गोचर तिथि (लाइफ इवेंट)', 'Transit Date (Life Event)')}:
              </Text>
              <Text style={styles.transitDateSubnote}>
                {getTxt(
                  'તારીખ માત્ર ગોચર (Red) ગ્રહોને અસર કરશે. નંબર ગણતરી પસંદ કરેલા જન્મ નક્ષત્રથી જ રહેશે.',
                  'तिथि केवल गोचर (Red) ग्रहों को प्रभावित करेगी। नंबर गिनती चयनित जन्म नक्षत्र से ही रहेगी।',
                  'Date affects ONLY Transit (Red) planets. Count #1..28 remains anchored to selected Janma Nakshatra.'
                )}
              </Text>
            </View>

            <View style={styles.transitDateBtnGroup}>
              <TouchableOpacity
                style={styles.dateSelectorPickerBtn}
                onPress={() => setShowDatePickerModal(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.dateSelectorPickerBtnText}>
                  📅 {transitDate.getDate().toString().padStart(2, '0')} {MONTHS_SHORT[transitDate.getMonth()]} {transitDate.getFullYear()} ✏️
                </Text>
              </TouchableOpacity>

              {!isTodayDate(transitDate) && (
                <TouchableOpacity
                  style={styles.resetTodayBtn}
                  onPress={handleResetTransitDate}
                  activeOpacity={0.8}
                >
                  <Text style={styles.resetTodayBtnText}>
                    🔄 {getTxt('આજે', 'आज', 'Today')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Fort Protection Summary Banner with Dynamic Color Category */}
          <View style={[styles.protectionBanner, { backgroundColor: result.stambhaColorHex }]}>
            <Text style={styles.protectionTitle}>{lifeImpactTitle}</Text>
            <Text style={styles.protectionDesc}>{lifeImpactDesc}</Text>
            <View style={styles.guardRow}>
              <Text style={styles.guardBadgeText}>
                👑 Kota Swami: <Text style={{ fontWeight: 'bold', color: '#FFD700' }}>{result.kotaSwami}</Text>
              </Text>
              <Text style={styles.guardBadgeText}>
                🛡️ Kota Pala: <Text style={{ fontWeight: 'bold', color: '#FFD700' }}>{result.kotaPala}</Text>
              </Text>
              <TouchableOpacity
                style={styles.guardInfoBtn}
                onPress={() => setShowTerminologyModal(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.guardInfoBtnText}>ⓘ Info</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Deep Life Event & Transit Insights (Mother, Mind, Career & Planetary Afflictions) */}
          <Text style={styles.sectionHeader}>
            🔮 {getTxt('દિપ લાઇફ ઇવેન્ટ અને ગ્રહ વિશ્લેષણ', 'गहरी जीवन घटना एवं ग्रह विश्लेषण', 'Deep Life Event & Transit Insights')}
          </Text>
          <Text style={styles.tableSubNote}>
            ({getTxt('મન, માતાજીના સ્વાસ્થ્ય, કારકિર્દી અને ગ્રહ દોષની વિગતવાર માહિતી', 'मन, माताजी का स्वास्थ्य, करियर एवं ग्रह दोष का विस्तृत विश्लेषण', 'Detailed Analysis of Mind, Mother\'s Health, Career & Afflictions')})
          </Text>

          <View style={styles.deepInsightsContainer}>
            {result.deepInsights.map(insight => {
              const title = getTxt(insight.title.gu, insight.title.hi, insight.title.en);
              const desc = getTxt(insight.description.gu, insight.description.hi, insight.description.en);

              const badgeColor = insight.severity === 'HIGH_ALERT' ? '#C62828' : insight.severity === 'WARNING' ? '#EF6C00' : insight.severity === 'AUSPICIOUS' ? '#2E7D32' : '#0277BD';

              return (
                <View key={insight.id} style={[styles.insightCard, { borderColor: badgeColor }]}>
                  <View style={[styles.insightHeader, { backgroundColor: badgeColor }]}>
                    <Text style={styles.insightHeaderTitle}>
                      {insight.icon} {title}
                    </Text>
                  </View>
                  <View style={styles.insightBody}>
                    <Text style={styles.insightDescText}>{desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Authentic 2D Concentric Fort Diagram (8 Pathways) */}
          <Text style={styles.sectionHeader}>
            🏰 {getTxt('પ્રામાણિક કોટા ચક્ર ૨D નકશો (૮ પ્રવેશ-નિકાસ માર્ગો)', 'प्रामाणिक कोटा चक्र २D मानचित्र (८ प्रवेश-निकास मार्ग)', 'Authentic 2D Kota Chakra Fort Map (8 Pathways)')}
          </Text>

          {/* SVG Diagram Component */}
          <KotaChakraDiagramSVG
            result={result}
            language={language}
            filterMode={filterMode}
            onFilterModeChange={handleFilterModeChange}
          />

          {/* 28-Nakshatra Categories Breakdown Table */}
          <Text style={styles.sectionHeader}>
            📊 List of the Categories of Nakshatras as per Kota Chakra
          </Text>
          <Text style={styles.tableSubNote}>
            ({getTxt('૨૮ નક્ષત્ર પદ્ધતિ મુજબ - અભિજિત સહિત', '२८ नक्षत्र पद्धति अनुसार - अभिजित सहित', 'As per 28 Nakshatra-system - including tiny tot Abhijit')})
          </Text>

          <View style={styles.tableCard}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableTh, { flex: 0.6 }]}>S.N.</Text>
              <Text style={[styles.tableTh, { flex: 2.2 }]}>{getTxt('શ્રેણી', 'श्रेणी', 'Category')}</Text>
              <Text style={[styles.tableTh, { flex: 1 }]}>I</Text>
              <Text style={[styles.tableTh, { flex: 1 }]}>II</Text>
              <Text style={[styles.tableTh, { flex: 1 }]}>III</Text>
              <Text style={[styles.tableTh, { flex: 1 }]}>IV</Text>
            </View>

            {/* Row 1: Stambha */}
            <View style={styles.tableBodyRow}>
              <Text style={[styles.tableTdBold, { flex: 0.6 }]}>1.</Text>
              <Text style={[styles.tableTdBold, { flex: 2.2, color: '#00838F' }]}>
                '{getTxt('સ્તંભ', 'स्तंभ', 'Stambha')}' Nakshatras
              </Text>
              {result.stambhaNakshatras.map((item, idx) => (
                <Text key={idx} style={[styles.tableTd, { flex: 1 }]}>
                  {language === 'gu' ? item.nameGuj : language === 'hi' ? item.nameHin : item.nameEng}(*{item.displayNumber})
                </Text>
              ))}
            </View>

            {/* Row 2: Madhya Entry */}
            <View style={[styles.tableBodyRow, styles.altRow]}>
              <Text style={[styles.tableTdBold, { flex: 0.6 }]}>2.</Text>
              <Text style={[styles.tableTdBold, { flex: 2.2, color: '#1565C0' }]}>
                '{getTxt('મધ્ય', 'मध्य', 'Madhya')}' (Entry ➔)
              </Text>
              {result.madhyaEntryNakshatras.map((item, idx) => (
                <Text key={idx} style={[styles.tableTd, { flex: 1 }]}>
                  {language === 'gu' ? item.nameGuj : language === 'hi' ? item.nameHin : item.nameEng}(*{item.displayNumber})
                </Text>
              ))}
            </View>

            {/* Row 3: Madhya Exit */}
            <View style={styles.tableBodyRow}>
              <Text style={[styles.tableTdBold, { flex: 0.6 }]}>3.</Text>
              <Text style={[styles.tableTdBold, { flex: 2.2, color: '#1565C0' }]}>
                '{getTxt('મધ્ય', 'मध्य', 'Madhya')}' (Exit 🏃)
              </Text>
              {result.madhyaExitNakshatras.map((item, idx) => (
                <Text key={idx} style={[styles.tableTd, { flex: 1 }]}>
                  {language === 'gu' ? item.nameGuj : language === 'hi' ? item.nameHin : item.nameEng}(*{item.displayNumber})
                </Text>
              ))}
            </View>

            {/* Row 4: Prakaara Entry */}
            <View style={[styles.tableBodyRow, styles.altRow]}>
              <Text style={[styles.tableTdBold, { flex: 0.6 }]}>4.</Text>
              <Text style={[styles.tableTdBold, { flex: 2.2, color: '#2E7D32' }]}>
                '{getTxt('પ્રાકાર', 'प्राकार', 'Prakaara')}' (Entry ➔)
              </Text>
              {result.prakaraEntryNakshatras.map((item, idx) => (
                <Text key={idx} style={[styles.tableTd, { flex: 1 }]}>
                  {language === 'gu' ? item.nameGuj : language === 'hi' ? item.nameHin : item.nameEng}(*{item.displayNumber})
                </Text>
              ))}
            </View>

            {/* Row 5: Prakaara Exit */}
            <View style={styles.tableBodyRow}>
              <Text style={[styles.tableTdBold, { flex: 0.6 }]}>5.</Text>
              <Text style={[styles.tableTdBold, { flex: 2.2, color: '#2E7D32' }]}>
                '{getTxt('પ્રાકાર', 'प्राकार', 'Prakaara')}' (Exit 🏃)
              </Text>
              {result.prakaraExitNakshatras.map((item, idx) => (
                <Text key={idx} style={[styles.tableTd, { flex: 1 }]}>
                  {language === 'gu' ? item.nameGuj : language === 'hi' ? item.nameHin : item.nameEng}(*{item.displayNumber})
                </Text>
              ))}
            </View>

            {/* Row 6: Bahya Entry */}
            <View style={[styles.tableBodyRow, styles.altRow]}>
              <Text style={[styles.tableTdBold, { flex: 0.6 }]}>6.</Text>
              <Text style={[styles.tableTdBold, { flex: 2.2, color: '#C62828' }]}>
                '{getTxt('બાહ્ય', 'बाह्य', 'Bahya')}' (Entry ➔)
              </Text>
              {result.bahyaEntryNakshatras.map((item, idx) => (
                <Text key={idx} style={[styles.tableTd, { flex: 1 }]}>
                  {language === 'gu' ? item.nameGuj : language === 'hi' ? item.nameHin : item.nameEng}(*{item.displayNumber})
                </Text>
              ))}
            </View>

            {/* Row 7: Bahya Exit */}
            <View style={styles.tableBodyRow}>
              <Text style={[styles.tableTdBold, { flex: 0.6 }]}>7.</Text>
              <Text style={[styles.tableTdBold, { flex: 2.2, color: '#C62828' }]}>
                '{getTxt('બાહ્ય', 'बाह्य', 'Bahya')}' (Exit 🏃)
              </Text>
              {result.bahyaExitNakshatras.map((item, idx) => (
                <Text key={idx} style={[styles.tableTd, { flex: 1 }]}>
                  {language === 'gu' ? item.nameGuj : language === 'hi' ? item.nameHin : item.nameEng}(*{item.displayNumber})
                </Text>
              ))}
            </View>
          </View>

          {/* Planetary Position Tables (Birth & Transit) */}
          <Text style={styles.sectionHeader}>
            🪐 {getTxt('જન્મ અને ગોચર ગ્રહોની વિગતવાર સ્થિતિ', 'जन्म एवं गोचर ग्रहों की विस्तृत स्थिति', 'Planetary Positions at Birth & Transit')}
          </Text>

          {/* Birth Planets Table (Blue Header) */}
          <View style={styles.planetTableCard}>
            <View style={[styles.planetTableHeader, { backgroundColor: '#1565C0' }]}>
              <Text style={styles.planetTableTitle}>
                🟦 {getTxt('જન્મ સમયની ગ્રહ સ્થિતિ', 'जन्म समय की ग्रह स्थिति', 'Planetary Position at Birth')}
              </Text>
            </View>

            <View style={styles.planetTableRowHeader}>
              <Text style={[styles.planetTh, { flex: 1.5 }]}>Planet</Text>
              <Text style={[styles.planetTh, { flex: 1.2 }]}>Sign</Text>
              <Text style={[styles.planetTh, { flex: 1.4 }]}>Degree</Text>
              <Text style={[styles.planetTh, { flex: 1.8 }]}>Nak(P)</Text>
              <Text style={[styles.planetTh, { flex: 1 }]}>NL</Text>
            </View>

            {result.birthPlanets.map((p, idx) => (
              <View key={idx} style={[styles.planetTableRow, idx % 2 === 1 && styles.altRow]}>
                <Text style={[styles.planetTdBold, { flex: 1.5, color: '#1565C0' }]}>
                  {p.symbol} {language === 'gu' ? p.nameGuj : language === 'hi' ? p.nameHin : p.nameEng}
                </Text>
                <Text style={[styles.planetTd, { flex: 1.2 }]}>{p.signEng}</Text>
                <Text style={[styles.planetTd, { flex: 1.4 }]}>{p.degreeStr}</Text>
                <Text style={[styles.planetTd, { flex: 1.8 }]}>{p.nakshatraName} ({p.pada})</Text>
                <Text style={[styles.planetTd, { flex: 1 }]}>{p.nakLord}</Text>
              </View>
            ))}
          </View>

          {/* Transit Planets Table (Dynamic Color Header based on Auspicious / Malefic condition) */}
          <View style={[
            styles.planetTableCard,
            {
              marginTop: 12,
              borderColor: result.lifeImpactCategory === 'AUSPICIOUS' ? '#2E7D32' : result.lifeImpactCategory === 'INAUSPICIOUS' ? '#C62828' : '#EF6C00',
              borderWidth: 2
            }
          ]}>
            <View style={[
              styles.planetTableHeader,
              { backgroundColor: result.lifeImpactCategory === 'AUSPICIOUS' ? '#2E7D32' : result.lifeImpactCategory === 'INAUSPICIOUS' ? '#C62828' : '#EF6C00' }
            ]}>
              <Text style={styles.planetTableTitle}>
                {result.lifeImpactCategory === 'AUSPICIOUS' ? '🟢' : result.lifeImpactCategory === 'INAUSPICIOUS' ? '🔴' : '🟠'} {getTxt('ગોચર સમયની ગ્રહ સ્થિતિ', 'गोचर समय की ग्रह स्थिति', 'Planetary Position of Transit')} ({result.lifeImpactCategory})
              </Text>
            </View>

            <View style={styles.planetTableRowHeader}>
              <Text style={[styles.planetTh, { flex: 1.5 }]}>Planet</Text>
              <Text style={[styles.planetTh, { flex: 1.2 }]}>Sign</Text>
              <Text style={[styles.planetTh, { flex: 1.4 }]}>Degree</Text>
              <Text style={[styles.planetTh, { flex: 1.8 }]}>Nak(P)</Text>
              <Text style={[styles.planetTh, { flex: 1 }]}>NL</Text>
            </View>

            {result.transitPlanets.map((p, idx) => (
              <View key={idx} style={[styles.planetTableRow, idx % 2 === 1 && styles.altRow]}>
                <Text style={[styles.planetTdBold, { flex: 1.5, color: '#C62828' }]}>
                  {p.symbol} {language === 'gu' ? p.nameGuj : language === 'hi' ? p.nameHin : p.nameEng}
                </Text>
                <Text style={[styles.planetTd, { flex: 1.2 }]}>{p.signEng}</Text>
                <Text style={[styles.planetTd, { flex: 1.4 }]}>{p.degreeStr}</Text>
                <Text style={[styles.planetTd, { flex: 1.8 }]}>{p.nakshatraName} ({p.pada})</Text>
                <Text style={[styles.planetTd, { flex: 1 }]}>{p.nakLord}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Profile Selector Modal */}
        <ProfileSelectorModal
          visible={showProfileSelector}
          onClose={() => setShowProfileSelector(false)}
          onSelectProfile={handleSelectProfile}
          activeProfileId={loadedProfile?.id}
        />

        {/* Nakshatra Info Modal (i) */}
        {infoNakIndex !== null && (
          <NakshatraInfoModal
            visible={infoNakIndex !== null}
            onClose={() => setInfoNakIndex(null)}
            nakshatraIndex={infoNakIndex}
          />
        )}

        {/* Kota Chakra Executive Guide Modal (ⓘ Title Button) */}
        <KotaChakraInfoModal
          visible={showKotaGuideModal}
          onClose={() => setShowKotaGuideModal(false)}
        />

        {/* Kota Swami & Kota Pala Terminology Explanation Modal (ⓘ Button) */}
        <KotaChakraTerminologyModal
          visible={showTerminologyModal}
          onClose={() => setShowTerminologyModal(false)}
        />

        {/* Transit Date Picker Modal */}
        <TransitDatePickerModal
          visible={showDatePickerModal}
          onClose={() => setShowDatePickerModal(false)}
          selectedDate={transitDate}
          onSelectDate={handleSelectTransitDate}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF6'
  },
  toastContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 999,
    backgroundColor: '#323232',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#580017',
    paddingHorizontal: 16,
    paddingBottom: 12
  },
  backBtn: {
    padding: 6
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700'
  },
  headerTitleCol: {
    flex: 1,
    marginLeft: 12
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800'
  },
  headerInfoBtn: {
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8
  },
  headerInfoBtnText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '800'
  },
  headerSub: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2
  },
  closeBtn: {
    padding: 6
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700'
  },
  scrollContent: {
    padding: 14
  },
  redAlertBanner: {
    backgroundColor: '#B71C1C',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FF5252'
  },
  redAlertTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4
  },
  redAlertDesc: {
    color: '#FFEBEE',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8
  },
  remedyBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 10,
    borderRadius: 8
  },
  remedyText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17
  },
  selectorCard: {
    backgroundColor: '#4A0012',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14
  },
  selectorTopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 6
  },
  cardLabel: {
    fontSize: 13,
    color: '#FFD700',
    fontWeight: '700',
    flex: 1
  },
  loadProfileBtn: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14
  },
  loadProfileBtnActive: {
    backgroundColor: '#81C784'
  },
  loadProfileBtnText: {
    color: '#3E2723',
    fontSize: 11,
    fontWeight: '800'
  },
  nakChipRow: {
    paddingVertical: 4
  },
  nakChip: {
    backgroundColor: '#6A0B21',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#801832'
  },
  nakChipActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFF'
  },
  nakChipRunning: {
    borderColor: '#FFD700',
    borderWidth: 1.5
  },
  nakChipText: {
    color: '#F5F5F5',
    fontSize: 12,
    fontWeight: '600'
  },
  nakChipTextActive: {
    color: '#4A0012',
    fontWeight: '800'
  },
  protectionBanner: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 14
  },
  protectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4
  },
  protectionDesc: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8
  },
  guardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 8,
    borderRadius: 8,
    flexWrap: 'wrap',
    gap: 6
  },
  guardBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600'
  },
  guardInfoBtn: {
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
    alignSelf: 'center'
  },
  guardInfoBtnText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '800'
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#212121',
    marginTop: 10,
    marginBottom: 4
  },
  tableSubNote: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 8,
    fontStyle: 'italic'
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#DCEDC8',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9'
  },
  tableTh: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2E7D32',
    textAlign: 'center'
  },
  tableBodyRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    alignItems: 'center'
  },
  altRow: {
    backgroundColor: '#FAFAFA'
  },
  tableTdBold: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#333333'
  },
  tableTd: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#424242',
    textAlign: 'center'
  },
  planetTableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2
  },
  planetTableHeader: {
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  planetTableTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  planetTableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  planetTh: {
    fontSize: 10,
    fontWeight: '800',
    color: '#616161',
    textAlign: 'center'
  },
  planetTableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    alignItems: 'center'
  },
  planetTdBold: {
    fontSize: 10,
    fontWeight: '800'
  },
  planetTd: {
    fontSize: 9.5,
    color: '#424242',
    textAlign: 'center'
  },
  transitDateBarCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFD54F',
    flexDirection: 'column',
    gap: 8,
    elevation: 2
  },
  transitDateInfoCol: {
    flex: 1
  },
  transitDateTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E65100'
  },
  transitDateSubnote: {
    fontSize: 10.5,
    color: '#616161',
    marginTop: 2
  },
  transitDateBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    flexWrap: 'wrap'
  },
  dateSelectorPickerBtn: {
    backgroundColor: '#8D6E63',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  dateSelectorPickerBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: 'bold'
  },
  resetTodayBtn: {
    backgroundColor: '#FFE0B2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFB74D'
  },
  resetTodayBtnText: {
    color: '#E65100',
    fontSize: 12,
    fontWeight: 'bold'
  },
  deepInsightsContainer: {
    marginBottom: 16,
    gap: 10
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  insightHeader: {
    paddingVertical: 9,
    paddingHorizontal: 12
  },
  insightHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  insightBody: {
    padding: 12,
    backgroundColor: '#FFFDF7'
  },
  insightDescText: {
    fontSize: 12,
    color: '#37474F',
    lineHeight: 18,
    fontWeight: '500'
  }
});
