import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';
import { RashiDetail } from '../types/panchang';
import { RASHIPHAL_DATA, getRashiById } from '../engine/rashiphalRepository';
import { useLanguage } from '../context/LanguageContext';
import { getSavedProfiles, SavedKundaliProfile } from '../utils/profileStorage';
import { calculateBirthKundali } from '../engine/kundaliEngine';
import { BirthChartModal } from '../components/BirthChartModal';
import { DEFAULT_CITIES } from '../data/cities';

const PREF_KEY = '@soulrise_user_horoscope_pref_v1';

export const RashiphalScreen: React.FC = () => {
  const { t } = useLanguage();

  // Active view tab: 'PERSONAL' (User's Moon & Sun signs) or 'ALL_12'
  const [viewMode, setViewMode] = useState<'PERSONAL' | 'ALL_12'>('PERSONAL');

  // Selected rashi in ALL_12 mode
  const [selectedRashi, setSelectedRashi] = useState<RashiDetail>(RASHIPHAL_DATA[0]);

  // Selected sign tab in PERSONAL mode: 'MOON' or 'SUN'
  const [personalSignTab, setPersonalSignTab] = useState<'MOON' | 'SUN'>('MOON');

  // Personal Horoscope preferences
  const [savedProfiles, setSavedProfiles] = useState<SavedKundaliProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<SavedKundaliProfile | null>(null);
  const [userMoonRashiId, setUserMoonRashiId] = useState<string>('mesha'); // Default Aries
  const [userSunRashiId, setUserSunRashiId] = useState<string>('kumbha');   // Default Aquarius
  const [isSignSet, setIsSignSet] = useState<boolean>(false);

  // Modals
  const [showManualSignModal, setShowManualSignModal] = useState(false);
  const [showProfileDropdownModal, setShowProfileDropdownModal] = useState(false);
  const [showBirthDetailsModal, setShowBirthDetailsModal] = useState(false);

  // Load Saved Profiles & User Preferences on Mount
  useEffect(() => {
    (async () => {
      try {
        const profiles = await getSavedProfiles();
        setSavedProfiles(profiles);

        const storedPrefJson = await AsyncStorage.getItem(PREF_KEY);
        if (storedPrefJson) {
          const pref = JSON.parse(storedPrefJson);
          if (pref.moonRashiId) setUserMoonRashiId(pref.moonRashiId);
          if (pref.sunRashiId) setUserSunRashiId(pref.sunRashiId);
          if (pref.isSet !== undefined) setIsSignSet(pref.isSet);
        }

        // If saved profiles exist, automatically load the first profile (e.g. Achal)
        if (profiles.length > 0) {
          loadProfileHoroscope(profiles[0]);
        }
      } catch (e) {
        console.log('Error loading horoscope preferences:', e);
      }
    })();
  }, []);

  const loadProfileHoroscope = (profile: SavedKundaliProfile) => {
    try {
      setActiveProfile(profile);
      const dobDate = new Date(
        parseInt(profile.dobYear, 10),
        parseInt(profile.dobMonth, 10) - 1,
        parseInt(profile.dobDay, 10)
      );

      const res = calculateBirthKundali(
        profile.name || 'User',
        dobDate,
        parseInt(profile.tobHour, 10) || 0,
        parseInt(profile.tobMinute, 10) || 0,
        profile.cityName || 'Surat',
        profile.lat || 21.1702,
        profile.lng || 72.8311
      );

      // Extract Moon Rashi & Sun Rashi from calculated Kundali
      const mRashiName = res.westernNatal.moonSign.toLowerCase();
      const sRashiName = res.westernNatal.sunSign.toLowerCase();

      // Map to Rashi ID
      const mRashiObj = RASHIPHAL_DATA.find(r => r.name.toLowerCase().includes(mRashiName)) || RASHIPHAL_DATA[0];
      const sRashiObj = RASHIPHAL_DATA.find(r => r.name.toLowerCase().includes(sRashiName)) || RASHIPHAL_DATA[10];

      setUserMoonRashiId(mRashiObj.id);
      setUserSunRashiId(sRashiObj.id);
      setIsSignSet(true);

      AsyncStorage.setItem(
        PREF_KEY,
        JSON.stringify({ moonRashiId: mRashiObj.id, sunRashiId: sRashiObj.id, isSet: true })
      );
    } catch (err) {
      console.log('Error calculating profile horoscope:', err);
    }
  };

  const handleSaveManualSigns = async (moonId: string, sunId: string) => {
    setUserMoonRashiId(moonId);
    setUserSunRashiId(sunId);
    setIsSignSet(true);
    setShowManualSignModal(false);

    await AsyncStorage.setItem(
      PREF_KEY,
      JSON.stringify({ moonRashiId: moonId, sunRashiId: sunId, isSet: true })
    );
  };

  const activeMoonRashi = getRashiById(userMoonRashiId);
  const activeSunRashi = getRashiById(userSunRashiId);
  const currentPersonalRashi = personalSignTab === 'MOON' ? activeMoonRashi : activeSunRashi;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>{t('rashiphalTitle')}</Text>
        <Text style={styles.headerSubtitle} numberOfLines={2} adjustsFontSizeToFit>{t('rashiphalSub')}</Text>

        {/* View Mode Switcher: Personal Horoscope vs All 12 Signs */}
        <View style={styles.viewModeNav}>
          <TouchableOpacity
            style={[styles.viewModeBtn, viewMode === 'PERSONAL' && styles.viewModeBtnActive]}
            onPress={() => setViewMode('PERSONAL')}
            activeOpacity={0.8}
          >
            <Text style={[styles.viewModeText, viewMode === 'PERSONAL' && styles.viewModeTextActive]}>
              👤 My Horoscope (Moon & Sun)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.viewModeBtn, viewMode === 'ALL_12' && styles.viewModeBtnActive]}
            onPress={() => setViewMode('ALL_12')}
            activeOpacity={0.8}
          >
            <Text style={[styles.viewModeText, viewMode === 'ALL_12' && styles.viewModeTextActive]}>
              🌌 All 12 Zodiac Signs
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* PERSONAL HOROSCOPE MODE */}
        {viewMode === 'PERSONAL' && (
          <View>
            {/* Active Profile / Sign Selector Banner */}
            <View style={styles.profileBanner}>
              {savedProfiles.length > 0 ? (
                <TouchableOpacity
                  style={styles.profileSelectRow}
                  onPress={() => setShowProfileDropdownModal(true)}
                  activeOpacity={0.8}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.profileBannerSubtitle}>PERSONALIZED HOROSCOPE PROFILE</Text>
                    <Text style={styles.profileBannerName}>
                      👤 {activeProfile ? activeProfile.name : 'Saved Profile'} ▼
                    </Text>
                    <Text style={styles.profileBannerSigns}>
                      🌙 Moon: {activeMoonRashi.name.split(' ')[0]} {activeMoonRashi.symbol} • ☀️ Sun: {activeSunRashi.name.split(' ')[0]} {activeSunRashi.symbol}
                    </Text>
                  </View>
                  <Text style={styles.profileChangeBtnText}>Switch Profile ➔</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.noProfileBanner}>
                  <Text style={styles.noProfileTitle}>👤 Personalize Your Daily Horoscope</Text>
                  <Text style={styles.noProfileSub}>
                    Select your Moon & Sun signs or calculate them using your Birth Details generator!
                  </Text>

                  <View style={styles.noProfileBtnRow}>
                    <TouchableOpacity
                      style={styles.selectSignsBtn}
                      onPress={() => setShowManualSignModal(true)}
                    >
                      <Text style={styles.selectSignsBtnText}>📌 Select Signs</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.generateBirthBtn}
                      onPress={() => setShowBirthDetailsModal(true)}
                    >
                      <Text style={styles.generateBirthBtnText}>✨ Calculate via Birth Generator ➔</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Moon Sign vs Sun Sign Tab Switcher */}
            <View style={styles.signTabContainer}>
              <TouchableOpacity
                style={[styles.signTabBtn, personalSignTab === 'MOON' && styles.signTabBtnActive]}
                onPress={() => setPersonalSignTab('MOON')}
                activeOpacity={0.8}
              >
                <Text style={[styles.signTabText, personalSignTab === 'MOON' && styles.signTabTextActive]}>
                  🌙 Moon Sign ({activeMoonRashi.name.split(' ')[0]} {activeMoonRashi.symbol})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.signTabBtn, personalSignTab === 'SUN' && styles.signTabBtnActive]}
                onPress={() => setPersonalSignTab('SUN')}
                activeOpacity={0.8}
              >
                <Text style={[styles.signTabText, personalSignTab === 'SUN' && styles.signTabTextActive]}>
                  ☀️ Sun Sign ({activeSunRashi.name.split(' ')[0]} {activeSunRashi.symbol})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Render Selected Personal Rashi Predictions */}
            {renderRashiCard(currentPersonalRashi, personalSignTab === 'MOON' ? 'Vedic Moon Sign (Chandra Rashi)' : 'Western Sun Sign (Surya Rashi)')}
          </View>
        )}

        {/* ALL 12 ZODIAC SIGNS MODE */}
        {viewMode === 'ALL_12' && (
          <View>
            {/* Horizontally Scrollable 12 Rashi Selector Bar */}
            <View style={styles.selectorContainer}>
              <FlatList
                horizontal
                data={RASHIPHAL_DATA}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isSelected = selectedRashi.id === item.id;
                  return (
                    <TouchableOpacity
                      style={[styles.rashiTab, isSelected && styles.rashiTabSelected]}
                      onPress={() => setSelectedRashi(item)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.rashiSymbol}>{item.symbol}</Text>
                      <Text style={[styles.rashiTabName, isSelected && styles.rashiTabNameSelected]}>
                        {item.name.split(' ')[0]}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>

            {/* Render Selected Rashi Details */}
            {renderRashiCard(selectedRashi, `${selectedRashi.name} Horoscope`)}
          </View>
        )}
      </ScrollView>

      {/* Manual Sign Selector Modal */}
      <Modal visible={showManualSignModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📌 Select Moon & Sun Signs</Text>
              <TouchableOpacity onPress={() => setShowManualSignModal(false)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }}>
              <Text style={styles.pickerLabel}>🌙 Select Your Moon Sign (Chandra Rashi):</Text>
              <View style={styles.rashiGridPicker}>
                {RASHIPHAL_DATA.map(r => (
                  <TouchableOpacity
                    key={`m-${r.id}`}
                    style={[styles.pickerChip, userMoonRashiId === r.id && styles.pickerChipActive]}
                    onPress={() => setUserMoonRashiId(r.id)}
                  >
                    <Text style={[styles.pickerChipText, userMoonRashiId === r.id && styles.pickerChipTextActive]}>
                      {r.symbol} {r.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.pickerLabel, { marginTop: 14 }]}>☀️ Select Your Sun Sign (Surya Rashi):</Text>
              <View style={styles.rashiGridPicker}>
                {RASHIPHAL_DATA.map(r => (
                  <TouchableOpacity
                    key={`s-${r.id}`}
                    style={[styles.pickerChip, userSunRashiId === r.id && styles.pickerChipActive]}
                    onPress={() => setUserSunRashiId(r.id)}
                  >
                    <Text style={[styles.pickerChipText, userSunRashiId === r.id && styles.pickerChipTextActive]}>
                      {r.symbol} {r.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.saveSignsBtn}
                onPress={() => handleSaveManualSigns(userMoonRashiId, userSunRashiId)}
              >
                <Text style={styles.saveSignsBtnText}>Save Preferences ➔</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Saved Profile Switcher Modal */}
      <Modal visible={showProfileDropdownModal} animationType="fade" transparent>
        <TouchableOpacity style={styles.dropdownOverlay} activeOpacity={1} onPress={() => setShowProfileDropdownModal(false)}>
          <View style={styles.dropdownCard}>
            <Text style={styles.dropdownTitle}>👤 Select Active Horoscope Profile</Text>

            {savedProfiles.map(p => {
              const isCurr = activeProfile?.id === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.profileDropDownItem, isCurr && styles.profileDropDownItemActive]}
                  onPress={() => {
                    loadProfileHoroscope(p);
                    setShowProfileDropdownModal(false);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.profileItemName, isCurr && styles.profileItemNameActive]}>{p.name}</Text>
                    <Text style={styles.profileItemSub}>DOB: {p.dobDay}/{p.dobMonth}/{p.dobYear} • {p.cityName}</Text>
                  </View>
                  {isCurr && <Text style={styles.checkIcon}>✓</Text>}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.addNewProfileBtn}
              onPress={() => {
                setShowProfileDropdownModal(false);
                setShowBirthDetailsModal(true);
              }}
            >
              <Text style={styles.addNewProfileBtnText}>+ Add New Birth Profile</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Birth Details Generator Modal */}
      {showBirthDetailsModal && (
        <BirthChartModal
          visible={showBirthDetailsModal}
          onClose={() => setShowBirthDetailsModal(false)}
          selectedCity={DEFAULT_CITIES[0]}
        />
      )}
    </View>
  );

  // Helper Function to Render Rich Horoscope Card
  function renderRashiCard(rashi: RashiDetail, subtitleLabel: string) {
    return (
      <View style={styles.card}>
        {/* Rashi Header Badge */}
        <View style={styles.cardHeaderRow}>
          <View style={styles.symbolBox}>
            <Text style={styles.bigSymbol}>{rashi.symbol}</Text>
          </View>
          <View style={styles.cardTitleBox}>
            <Text style={styles.rashiMainTitle}>{rashi.name}</Text>
            <Text style={styles.rashiMainHindi}>{rashi.hindiName}</Text>
            <Text style={styles.rashiMeta}>
              Element: {rashi.element} • Ruler: {rashi.rulingPlanet}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 🔮 General Daily Guidance */}
        <Text style={styles.sectionTitle}>🔮 Daily Guidance (आज का फलादेश)</Text>
        <Text style={styles.predictionHindi}>{rashi.predictionHindi}</Text>
        <Text style={styles.predictionEnglish}>{rashi.dailyPrediction}</Text>

        <View style={styles.divider} />

        {/* 💼 Career & Business */}
        <View style={styles.pillarBox}>
          <Text style={styles.pillarTitle}>💼 Career & Business (करियर एवं व्यापार)</Text>
          <Text style={styles.pillarText}>{rashi.careerPrediction}</Text>
        </View>

        {/* 💰 Finance & Wealth */}
        <View style={styles.pillarBox}>
          <Text style={styles.pillarTitle}>💰 Finance & Wealth (वित्त एवं समृद्धि)</Text>
          <Text style={styles.pillarText}>{rashi.financePrediction}</Text>
        </View>

        {/* ❤️ Love & Relationships */}
        <View style={styles.pillarBox}>
          <Text style={styles.pillarTitle}>❤️ Love & Relationships (प्रेम एवं संबंध)</Text>
          <Text style={styles.pillarText}>{rashi.lovePrediction}</Text>
        </View>

        {/* 🩺 Health & Energy */}
        <View style={styles.pillarBox}>
          <Text style={styles.pillarTitle}>🩺 Health & Energy (स्वास्थ्य एवं ऊर्जा)</Text>
          <Text style={styles.pillarText}>{rashi.healthPrediction}</Text>
        </View>

        <View style={styles.divider} />

        {/* 🍀 Lucky Elements Grid */}
        <Text style={styles.sectionTitle}>🍀 Lucky Elements & Guidance</Text>

        <View style={styles.attrGrid}>
          <View style={styles.attrBox}>
            <Text style={styles.attrLabel}>Lucky Number</Text>
            <Text style={styles.attrValueNum}>{rashi.luckyNumber}</Text>
          </View>

          {/* Lucky Color - HUMAN-READABLE COLOR NAME (NO RAW HEX!) */}
          <View style={styles.attrBox}>
            <Text style={styles.attrLabel}>Lucky Color</Text>
            <View style={styles.colorPillRow}>
              <View style={[styles.colorDot, { backgroundColor: rashi.luckyColorHex }]} />
              <Text style={styles.attrValue}>{rashi.luckyColorName}</Text>
            </View>
          </View>

          <View style={styles.attrBox}>
            <Text style={styles.attrLabel}>Lucky Direction</Text>
            <Text style={styles.attrValue}>{rashi.luckyDirection}</Text>
          </View>

          <View style={styles.attrBox}>
            <Text style={styles.attrLabel}>Best Time Window</Text>
            <Text style={styles.attrValue}>{rashi.auspiciousTimeWindow}</Text>
          </View>
        </View>

        {/* 🧘 Daily Remedial Action & Mantra */}
        <View style={styles.remedyCard}>
          <Text style={styles.remedyTitle}>🧘 Daily Remedial Action & Mantra (आज का उपाय)</Text>
          <Text style={styles.remedyText}>{rashi.dailyRemedy}</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBg,
  },
  header: {
    backgroundColor: Colors.maroon,
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.creamBg,
    marginTop: 2,
    opacity: 0.9,
  },
  viewModeNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 3,
    marginTop: 10,
    gap: 4,
  },
  viewModeBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewModeBtnActive: {
    backgroundColor: '#FFD700',
  },
  viewModeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  viewModeTextActive: {
    color: Colors.maroon,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  // Profile Banner
  profileBanner: {
    backgroundColor: '#4A0E17',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FFD700',
    elevation: 4,
  },
  profileSelectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileBannerSubtitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 1,
  },
  profileBannerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  profileBannerSigns: {
    fontSize: 11,
    color: '#FFE0B2',
    marginTop: 2,
  },
  profileChangeBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  noProfileBanner: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  noProfileTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  noProfileSub: {
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 16,
  },
  noProfileBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  selectSignsBtn: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  selectSignsBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  generateBirthBtn: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  generateBirthBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
  },

  // Moon vs Sun Sign Tabs
  signTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    padding: 3,
    marginBottom: 14,
    gap: 4,
  },
  signTabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  signTabBtnActive: {
    backgroundColor: Colors.maroon,
  },
  signTabText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  signTabTextActive: {
    color: '#FFD700',
  },

  // 12 Rashi Selector Bar
  selectorContainer: {
    marginBottom: 14,
  },
  rashiTab: {
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rashiTabSelected: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  rashiSymbol: {
    fontSize: 18,
  },
  rashiTabName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rashiTabNameSelected: {
    color: '#FFD700',
  },

  // Rashi Card
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolBox: {
    backgroundColor: '#FAF5EE',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.accentGold,
    marginRight: 12,
  },
  bigSymbol: {
    fontSize: 28,
  },
  cardTitleBox: {
    flex: 1,
  },
  rashiMainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  rashiMainHindi: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  rashiMeta: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 6,
  },
  predictionHindi: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    lineHeight: 19,
    marginBottom: 4,
  },
  predictionEnglish: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  pillarBox: {
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  pillarTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 3,
  },
  pillarText: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 16,
  },

  // Lucky Elements Grid
  attrGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  attrBox: {
    width: '48%',
    backgroundColor: '#FAF5EE',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  attrLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  attrValueNum: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginTop: 2,
  },
  colorPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  attrValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 2,
  },

  // Remedy Card
  remedyCard: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFC107',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  remedyTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 3,
  },
  remedyText: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 16,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: Colors.creamBg,
    borderRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  closeBtn: {
    backgroundColor: '#E0E0E0',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 8,
  },
  rashiGridPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pickerChip: {
    width: '31%',
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  pickerChipActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  pickerChipText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  pickerChipTextActive: {
    color: '#FFD700',
  },
  saveSignsBtn: {
    backgroundColor: Colors.maroon,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveSignsBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFD700',
  },

  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  dropdownCard: {
    backgroundColor: Colors.creamBg,
    borderRadius: 20,
    padding: 16,
    elevation: 8,
  },
  dropdownTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 12,
  },
  profileDropDownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileDropDownItemActive: {
    backgroundColor: '#FFF3E0',
    borderColor: Colors.maroon,
    borderWidth: 1.5,
  },
  profileItemName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  profileItemNameActive: {
    color: Colors.maroon,
  },
  profileItemSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  checkIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  addNewProfileBtn: {
    backgroundColor: Colors.maroon,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  addNewProfileBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
  },
});
