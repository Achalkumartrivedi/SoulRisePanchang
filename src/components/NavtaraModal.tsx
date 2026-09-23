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
import { calculateNavtara, ALL_27_NAKSHATRAS, NAVTARA_DEFINITIONS } from '../engine/navtaraEngine';
import { calculatePanchang } from '../engine/panchangEngine';
import { SavedKundaliProfile, getActiveProfile } from '../utils/profileStorage';
import { ProfileSelectorModal } from './ProfileSelectorModal';
import { NakshatraInfoModal } from './NakshatraInfoModal';
import { getProfileNakshatraDetails } from '../utils/profileNakshatraHelper';

interface NavtaraModalProps {
  visible: boolean;
  onClose: () => void;
  defaultNakshatraIndex?: number;
}

export const NavtaraModal: React.FC<NavtaraModalProps> = ({
  visible,
  onClose,
  defaultNakshatraIndex = 1
}) => {
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 8, (StatusBar.currentHeight || 24) + 12);

  const [selectedNakshatraIdx, setSelectedNakshatraIdx] = useState<number>(defaultNakshatraIndex);
  const [activeTaraFilter, setActiveTaraFilter] = useState<number | null>(null);

  // Profile & Toast States
  const [loadedProfile, setLoadedProfile] = useState<SavedKundaliProfile | null>(null);
  const [showProfileSelector, setShowProfileSelector] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Info Modal State
  const [infoNakIndex, setInfoNakIndex] = useState<number | null>(null);

  // Today's Running Nakshatra (5-Limbs Panchang)
  const [runningNakIndex, setRunningNakIndex] = useState<number>(1);

  useEffect(() => {
    if (visible) {
      // Calculate today's running Nakshatra from Panchang
      const defaultCity = { name: 'New Delhi', hindiName: 'नई दिल्ली', stateCountry: 'India', latitude: 28.6139, longitude: 77.2090, timeZoneId: 'Asia/Kolkata' };
      const panchang = calculatePanchang(new Date(), defaultCity);
      const currNakIdx = panchang.nakshatra?.number || 1;
      setRunningNakIndex(currNakIdx);

      // Auto-load active user profile if available
      getActiveProfile().then(prof => {
        if (prof) {
          const { nak27Index } = getProfileNakshatraDetails(prof);
          setLoadedProfile(prof);
          setSelectedNakshatraIdx(nak27Index);
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

  const getTxt = (guj: string, hin: string, hing: string) => {
    if (language === 'gu') return guj;
    if (language === 'hi') return hin;
    return hing;
  };

  const calculatedTararows = calculateNavtara(selectedNakshatraIdx);
  const selectedBirthNak = ALL_27_NAKSHATRAS[selectedNakshatraIdx - 1];

  const filteredRows = activeTaraFilter !== null
    ? calculatedTararows.filter(r => r.taraId === activeTaraFilter)
    : calculatedTararows;

  const handleSelectProfile = (profile: SavedKundaliProfile, nakIndex: number) => {
    const { nak27Index } = getProfileNakshatraDetails(profile);
    setLoadedProfile(profile);
    setSelectedNakshatraIdx(nak27Index);
    setShowProfileSelector(false);

    const profNakName = language === 'gu'
      ? ALL_27_NAKSHATRAS[nak27Index - 1].guj
      : language === 'hi'
      ? ALL_27_NAKSHATRAS[nak27Index - 1].hin
      : ALL_27_NAKSHATRAS[nak27Index - 1].eng;

    showToast(getTxt(
      `'${profile.name}' પ્રોફાઇલ લાગુ થઈ (${profNakName})`,
      `'${profile.name}' प्रोफाइल लागू की गई (${profNakName})`,
      `'${profile.name}' Profile is applied (${profNakName})`
    ));
  };

  const handleNakshatraChipPress = (targetNakIndex: number) => {
    const nakDetail = ALL_27_NAKSHATRAS[targetNakIndex - 1];
    const targetNakName = language === 'gu'
      ? nakDetail.guj
      : language === 'hi'
      ? nakDetail.hin
      : nakDetail.eng;

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

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Toast Notification Banner */}
        {toastMessage && (
          <View style={[styles.toastContainer, { top: topPadding + 44 }]}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        {/* Header Bar */}
        <View style={[styles.headerRow, { paddingTop: topPadding }]}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>
              🌟 {getTxt('નવતારા ચક્ર', 'नवतारा चक्र', 'Navtara Chakra')}
            </Text>
            <Text style={styles.headerSub}>
              {getTxt('૯ તારા યોજના અને નક્ષત્ર વર્ગીકરણ', '९ तारा योजना एवं नक्षत्र वर्गीकरण', '9-Star Transit Classification')}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Birth Nakshatra Selector Card */}
          <View style={styles.selectorCard}>
            <View style={styles.selectorTopHeader}>
              <Text style={styles.cardLabel}>
                📍 {getTxt('જન્મ / લગ્ન નક્ષત્ર પસંદ કરો', 'जन्म / लग्न नक्षत्र चुनें', 'Select Janma / Lagna Nakshatra')}:
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
              {ALL_27_NAKSHATRAS.map(nak => {
                const isActive = nak.index === selectedNakshatraIdx;
                const isRunning = nak.index === runningNakIndex;
                const nakName = language === 'gu' ? nak.guj : language === 'hi' ? nak.hin : nak.eng;

                return (
                  <TouchableOpacity
                    key={nak.index}
                    style={[
                      styles.nakChip,
                      isActive && styles.nakChipActive,
                      isRunning && !isActive && styles.nakChipRunning
                    ]}
                    onPress={() => handleNakshatraChipPress(nak.index)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.nakChipText, isActive && styles.nakChipTextActive]}>
                      {nak.index}. {nakName} {isRunning ? '⚡' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.activeNakBanner}>
              <Text style={styles.activeNakText}>
                ✨ {getTxt('પસંદ કરેલ નક્ષત્ર', 'चयनित जन्म नक्षत्र', 'Active Janma Nakshatra')}: <Text style={{ color: '#FFD700', fontWeight: '800' }}>{selectedBirthNak.eng} ({selectedBirthNak.lord} Lord)</Text>
              </Text>
              {loadedProfile && (
                <Text style={styles.profileBadgeTag}>
                  🔒 {loadedProfile.name}'s Profile Active
                </Text>
              )}
            </View>
          </View>

          {/* 9 Tara Category Filter Bar */}
          <Text style={styles.sectionHeader}>
            🎯 {getTxt('૯ તારા ફિલ્ટર (૯ તરંગ શ્રેણી)', '९ तारा फ़िल्टर (९ तरंग श्रेणी)', '9 Tara Classification Filter')}
          </Text>

          <View style={styles.taraFilterGrid}>
            <TouchableOpacity
              style={[styles.taraFilterChip, activeTaraFilter === null && styles.taraFilterChipActiveAll]}
              onPress={() => setActiveTaraFilter(null)}
            >
              <Text style={[styles.taraFilterText, activeTaraFilter === null && { color: '#FFFFFF' }]}>
                {getTxt('તમામ ૨૭ નક્ષત્રો', 'सभी २७ नक्षत्र', 'All 27 Stars')}
              </Text>
            </TouchableOpacity>

            {Object.values(NAVTARA_DEFINITIONS).map(def => {
              const isSelected = activeTaraFilter === def.id;
              const name = language === 'gu' ? def.nameGuj : language === 'hi' ? def.nameHin : def.nameEng;
              return (
                <TouchableOpacity
                  key={def.id}
                  style={[
                    styles.taraFilterChip,
                    { borderColor: def.colorHex },
                    isSelected && { backgroundColor: def.colorHex }
                  ]}
                  onPress={() => setActiveTaraFilter(isSelected ? null : def.id)}
                >
                  <Text style={[styles.taraFilterText, isSelected && { color: '#FFFFFF' }]}>
                    {def.id}. {name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 27 Nakshatra Tara Breakdown List */}
          <Text style={styles.sectionHeader}>
            📜 {getTxt('નક્ષત્ર અને તારા વર્ગીકરણ યાદી', 'नक्षत्र एवं तारा वर्गीकरण सूची', 'Nakshatra & Tara Breakdown')} ({filteredRows.length})
          </Text>

          {filteredRows.map(row => {
            const def = NAVTARA_DEFINITIONS[row.taraId];
            const resultText = language === 'gu' ? def.resultGuj : language === 'hi' ? def.resultHin : def.resultEng;
            const descText = language === 'gu' ? def.descGuj : language === 'hi' ? def.descHin : def.descEng;
            const nakName = language === 'gu' ? row.nakshatraGuj : language === 'hi' ? row.nakshatraHin : row.nakshatraEng;
            const isRunningToday = row.nakshatraIndex === runningNakIndex;

            return (
              <View key={row.nakshatraIndex} style={[styles.taraCard, { borderLeftColor: def.colorHex }, isRunningToday && styles.taraCardRunning]}>
                <View style={styles.taraCardTop}>
                  <View style={styles.taraCardLeft}>
                    <View style={styles.nakTitleRow}>
                      <Text style={styles.nakNameTitle}>
                        {row.nakshatraIndex}. {nakName}
                      </Text>

                      {/* (i) Info Icon Button */}
                      <TouchableOpacity
                        style={styles.infoBtn}
                        onPress={() => setInfoNakIndex(row.nakshatraIndex)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.infoBtnText}>ⓘ</Text>
                      </TouchableOpacity>

                      {/* Running Today Chip */}
                      {isRunningToday && (
                        <View style={styles.runningChip}>
                          <Text style={styles.runningChipText}>⚡ {getTxt('આજે કાર્યરત', 'आज सक्रिय', 'Running Today')}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.nakLordSub}>Lord: {row.lord} • Paryaya {row.paryaya}</Text>
                  </View>

                  <View style={[styles.taraBadge, { backgroundColor: def.colorHex }]}>
                    <Text style={styles.taraBadgeText}>
                      {row.taraId}. {language === 'gu' ? def.nameGuj : language === 'hi' ? def.nameHin : def.nameEng}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.taraResultText, { color: def.colorHex }]}>
                  {row.category === 'SHUBHA' ? '✓ ' : row.category === 'ASHUBHA' ? '⚠ ' : 'ℹ '}
                  {resultText}
                </Text>

                <Text style={styles.taraDescText}>{descText}</Text>
              </View>
            );
          })}
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
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
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
  selectorCard: {
    backgroundColor: '#4A0012',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16
  },
  selectorTopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
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
    paddingVertical: 6
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
  activeNakBanner: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6
  },
  activeNakText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600'
  },
  profileBadgeTag: {
    color: '#81C784',
    fontSize: 10,
    fontWeight: '800'
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#212121',
    marginTop: 6,
    marginBottom: 10
  },
  taraFilterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14
  },
  taraFilterChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  taraFilterChipActiveAll: {
    backgroundColor: '#580017',
    borderColor: '#580017'
  },
  taraFilterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#424242'
  },
  taraCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  taraCardRunning: {
    borderColor: '#FFC107',
    backgroundColor: '#FFFDE7'
  },
  taraCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    flexWrap: 'wrap',
    gap: 6
  },
  taraCardLeft: {
    flex: 1
  },
  nakTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4
  },
  nakNameTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#212121'
  },
  infoBtn: {
    marginLeft: 6,
    paddingHorizontal: 4,
    paddingVertical: 2
  },
  infoBtnText: {
    fontSize: 16,
    color: '#1E88E5',
    fontWeight: '800'
  },
  runningChip: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FF9800',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6
  },
  runningChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E65100'
  },
  nakLordSub: {
    fontSize: 11,
    color: '#666666',
    marginTop: 2
  },
  taraBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    flexShrink: 0,
    alignSelf: 'flex-start'
  },
  taraBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  taraResultText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 4
  },
  taraDescText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 17
  }
});
