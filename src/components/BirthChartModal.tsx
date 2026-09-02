import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import { Colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { calculateBirthKundali, KundaliResult, KundaliDivisionalChart } from '../engine/kundaliEngine';
import { GLOBAL_COUNTRIES, GlobalCountry } from '../data/globalCities';
import { CityLocation } from '../types/panchang';
import { ASTROLOGY_LOCALIZATION } from '../i18n/astrologyTerms';
import { searchGlobalLocations, GeocodedLocation } from '../utils/geocodingService';
import { NorthIndianTriangleChart } from './NorthIndianTriangleChart';
import { getSavedProfiles, saveKundaliProfile, deleteKundaliProfile, SavedKundaliProfile } from '../utils/profileStorage';
import { SoulPurposeModal } from './SoulPurposeModal';
import { getUserProfile } from '../engine/userDatabase';
import { AuthModal } from './AuthModal';
import { Alert } from 'react-native';

interface BirthChartModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCity: CityLocation;
}

const MONTHS_LIST = [
  'Jan (01)', 'Feb (02)', 'Mar (03)', 'Apr (04)', 'May (05)', 'Jun (06)',
  'Jul (07)', 'Aug (08)', 'Sep (09)', 'Oct (10)', 'Nov (11)', 'Dec (12)'
];

const DAYS_LIST = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const YEARS_LIST = Array.from({ length: 87 }, (_, i) => (2026 - i).toString());
const HOURS_LIST = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES_LIST = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

const getNumericTithiNumber = (tithiStr: string): number => {
  if (!tithiStr) return 1;
  const match = tithiStr.match(/(\d+)/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  const lower = tithiStr.toLowerCase();
  if (lower.includes('pratipada')) return 1;
  if (lower.includes('dvitiya') || lower.includes('dwitiya')) return 2;
  if (lower.includes('tritiya')) return 3;
  if (lower.includes('chaturthi')) return 4;
  if (lower.includes('panchami')) return 5;
  if (lower.includes('shashthi')) return 6;
  if (lower.includes('saptami')) return 7;
  if (lower.includes('ashtami')) return 8;
  if (lower.includes('navami')) return 9;
  if (lower.includes('dashami')) return 10;
  if (lower.includes('ekadashi')) return 11;
  if (lower.includes('dwadashi')) return 12;
  if (lower.includes('trayodashi')) return 13;
  if (lower.includes('chaturdashi')) return 14;
  if (lower.includes('purnima')) return 15;
  if (lower.includes('amavasya')) return 30;
  return 1;
};

export const BirthChartModal: React.FC<BirthChartModalProps> = ({
  visible,
  onClose,
  selectedCity
}) => {
  const { language } = useLanguage();
  const loc = ASTROLOGY_LOCALIZATION[language] || ASTROLOGY_LOCALIZATION.en;

  // Achal Ground-Truth Benchmark Test Default Values
  const [name, setName] = useState('Achal');
  const [dobDay, setDobDay] = useState('13');
  const [dobMonth, setDobMonth] = useState('02');
  const [dobYear, setDobYear] = useState('1989');
  const [tobHour, setTobHour] = useState('00');
  const [tobMinute, setTobMinute] = useState('05');

  // Active Location State (Default Surat, Gujarat per user test benchmark)
  const [activeLocation, setActiveLocation] = useState<{
    cityName: string;
    lat: number;
    lng: number;
  }>({
    cityName: 'Surat, Gujarat, India',
    lat: 21.1702,
    lng: 72.8311
  });

  // Saved Kundali Profiles State
  const [savedProfiles, setSavedProfiles] = useState<SavedKundaliProfile[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Country & Preset City State
  const [selectedCountry, setSelectedCountry] = useState<GlobalCountry>(GLOBAL_COUNTRIES[0]);

  // Live Location Search State
  const [placeSearchQuery, setPlaceSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodedLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Dropdown Picker & Sub-Modal States
  const [showSavedProfilesModal, setShowSavedProfilesModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSoulPurposeModal, setShowSoulPurposeModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [showHourModal, setShowHourModal] = useState(false);
  const [showMinuteModal, setShowMinuteModal] = useState(false);
  const [authModalVisible, setAuthModalVisible] = useState(false);

  // Default Chart Style is NORTH (North Indian Diamond Style)
  const [chartStyle, setChartStyle] = useState<'NORTH' | 'SOUTH' | 'GLOBAL'>('NORTH');

  // Active Tab for Divisional & Global Charts
  const [activeChartKey, setActiveChartKey] = useState<'D1' | 'MOON' | 'SUN' | 'D2' | 'D9' | 'D10' | 'WESTERN' | 'RUSSIAN' | 'THAI' | 'INDONESIAN'>('D1');
  const [activeDetailSection, setActiveDetailSection] = useState<'PARTICULARS' | 'PLANETS' | 'HOUSES' | 'GLOBAL'>('PARTICULARS');

  // Kundali Result State
  const [kundali, setKundali] = useState<KundaliResult | null>(() => {
    return calculateBirthKundali(
      'Achal',
      new Date(1989, 1, 13),
      0,
      5,
      'Surat, Gujarat, India',
      21.1702,
      72.8311
    );
  });

  useEffect(() => {
    if (visible) {
      (async () => {
        const profile = await getUserProfile();
        if (profile && profile.name) {
          setName(profile.name);
        }
      })();
    }
  }, [visible]);

  // Load saved profiles from AsyncStorage on mount
  useEffect(() => {
    getSavedProfiles().then(setSavedProfiles);
  }, []);

  // Live Free Geocoding API Search debouncer
  useEffect(() => {
    if (!placeSearchQuery || placeSearchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchGlobalLocations(placeSearchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [placeSearchQuery]);

  const handleGenerate = () => {
    const day = parseInt(dobDay, 10) || 13;
    const month = (parseInt(dobMonth, 10) || 2) - 1;
    const year = parseInt(dobYear, 10) || 1989;
    const h = parseInt(tobHour, 10) || 0;
    const m = parseInt(tobMinute, 10) || 5;

    const dob = new Date(year, month, day);
    const result = calculateBirthKundali(
      name || 'Achal',
      dob,
      h,
      m,
      activeLocation.cityName,
      activeLocation.lat,
      activeLocation.lng
    );
    setKundali(result);
  };

  const handleSaveProfile = async () => {
    const currentProfile = await getUserProfile();
    if (!currentProfile) {
      Alert.alert(
        '🔒 Sign In Required',
        'You are currently not signed in!\n\nWithout creating a profile, your saved Kundli charts are stored locally and will be cleared if the app is uninstalled.\n\nPlease sign in or register as a Guest with a 6-digit PIN to save and sync your profile.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In / Register ➔',
            onPress: () => setAuthModalVisible(true)
          }
        ]
      );
      return;
    }

    const profileName = name.trim() || currentProfile.name || 'Achal';
    const updated = await saveKundaliProfile({
      name: profileName,
      dobDay,
      dobMonth,
      dobYear,
      tobHour,
      tobMinute,
      cityName: activeLocation.cityName,
      lat: activeLocation.lat,
      lng: activeLocation.lng
    });
    setSavedProfiles(updated);
    setSaveSuccessMsg(`Saved "${profileName}"! ✓`);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleSelectProfile = (p: SavedKundaliProfile) => {
    setName(p.name);
    setDobDay(p.dobDay);
    setDobMonth(p.dobMonth);
    setDobYear(p.dobYear);
    setTobHour(p.tobHour);
    setTobMinute(p.tobMinute);
    setActiveLocation({
      cityName: p.cityName,
      lat: p.lat,
      lng: p.lng
    });

    const day = parseInt(p.dobDay, 10) || 1;
    const month = (parseInt(p.dobMonth, 10) || 1) - 1;
    const year = parseInt(p.dobYear, 10) || 1990;
    const h = parseInt(p.tobHour, 10) || 0;
    const m = parseInt(p.tobMinute, 10) || 0;

    const result = calculateBirthKundali(p.name, new Date(year, month, day), h, m, p.cityName, p.lat, p.lng);
    setKundali(result);
    setShowSavedProfilesModal(false);
  };

  const handleDeleteProfile = async (id: string) => {
    const updated = await deleteKundaliProfile(id);
    setSavedProfiles(updated);
  };

  const activeChart: KundaliDivisionalChart | undefined = kundali?.divisionalCharts[activeChartKey];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Header Bar */}
              <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>{loc.birthChartTitle}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* 1. Birth Details Form Card */}
                <View style={styles.formCard}>
                  
                  {/* Saved Kundali Profiles Dropdown Picker */}
                  <TouchableOpacity
                    style={styles.savedProfilesBtn}
                    onPress={() => setShowSavedProfilesModal(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.savedProfilesBtnText}>
                      👤 Load Saved Profile ({savedProfiles.length}) ▼
                    </Text>
                  </TouchableOpacity>

                  <Text style={styles.formSectionTitle}>{loc.birthDetailsInput}</Text>

                  {/* Name Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{loc.fullName}</Text>
                    <TextInput
                      style={styles.textInput}
                      value={name}
                      onChangeText={setName}
                      placeholder="Enter name"
                      placeholderTextColor={Colors.textMuted}
                    />
                  </View>

                  {/* Date of Birth (DOB) Dropdowns */}
                  <Text style={styles.inputLabel}>{loc.dobLabel}</Text>
                  <View style={styles.dropdownRow}>
                    <TouchableOpacity
                      style={[styles.dropdownField, styles.col3]}
                      onPress={() => setShowDayModal(true)}
                    >
                      <Text style={styles.dropdownValText}>Day: {dobDay}</Text>
                      <Text style={styles.fieldArrow}>▼</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.dropdownField, styles.col3]}
                      onPress={() => setShowMonthModal(true)}
                    >
                      <Text style={styles.dropdownValText}>{MONTHS_LIST[parseInt(dobMonth, 10) - 1] || 'Month'}</Text>
                      <Text style={styles.fieldArrow}>▼</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.dropdownField, styles.col3]}
                      onPress={() => setShowYearModal(true)}
                    >
                      <Text style={styles.dropdownValText}>Year: {dobYear}</Text>
                      <Text style={styles.fieldArrow}>▼</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Time of Birth (TOB) Dropdowns */}
                  <Text style={styles.inputLabel}>{loc.tobLabel}</Text>
                  <View style={styles.dropdownRow}>
                    <TouchableOpacity
                      style={[styles.dropdownField, styles.col2]}
                      onPress={() => setShowHourModal(true)}
                    >
                      <Text style={styles.dropdownValText}>Hour: {tobHour} : 00</Text>
                      <Text style={styles.fieldArrow}>▼</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.dropdownField, styles.col2]}
                      onPress={() => setShowMinuteModal(true)}
                    >
                      <Text style={styles.dropdownValText}>Min: {tobMinute}</Text>
                      <Text style={styles.fieldArrow}>▼</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Free Global Location Picker Dropdown */}
                  <Text style={styles.inputLabel}>Global Location of Birth (Lat & Lng Search)</Text>
                  <TouchableOpacity
                    style={styles.dropdownBtn}
                    onPress={() => setShowLocationModal(true)}
                    activeOpacity={0.8}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dropdownCityName}>📍 {activeLocation.cityName}</Text>
                      <Text style={styles.dropdownCitySub}>
                        Lat: {activeLocation.lat.toFixed(4)}° • Lng: {activeLocation.lng.toFixed(4)}°
                      </Text>
                    </View>
                    <Text style={styles.dropdownArrow}>🔍 Search Place ▼</Text>
                  </TouchableOpacity>

                  {/* Action Buttons Row: Generate + Save */}
                  <View style={styles.actionBtnRow}>
                    <TouchableOpacity style={[styles.actionBtn, styles.generateBtn]} onPress={handleGenerate} activeOpacity={0.8}>
                      <Text style={styles.generateBtnText}>{loc.generateBtn}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionBtn, styles.saveBtn]} onPress={handleSaveProfile} activeOpacity={0.8}>
                      <Text style={styles.saveBtnText}>💾 Save Profile</Text>
                    </TouchableOpacity>
                  </View>

                  {saveSuccessMsg ? (
                    <Text style={styles.saveSuccessText}>{saveSuccessMsg}</Text>
                  ) : null}
                </View>

                {/* 2. Kundali Results Container */}
                {kundali && (
                  <View style={styles.resultsContainer}>

                    {/* Divisional & Global Chart Switcher Tabs */}
                    <Text style={styles.sectionHeaderTitle}>{loc.divisionalChartsTitle}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartTabsScroll}>
                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'D1' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('D1')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'D1' && styles.chartTabTextActive]}>{loc.d1Lagna}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'MOON' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('MOON')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'MOON' && styles.chartTabTextActive]}>{loc.chandraMoon}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'SUN' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('SUN')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'SUN' && styles.chartTabTextActive]}>{loc.suryaSun}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'D2' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('D2')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'D2' && styles.chartTabTextActive]}>{loc.d2Hora}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'D9' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('D9')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'D9' && styles.chartTabTextActive]}>{loc.d9Navamsha}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'D10' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('D10')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'D10' && styles.chartTabTextActive]}>{loc.d10Dashamsha}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'WESTERN' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('WESTERN')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'WESTERN' && styles.chartTabTextActive]}>{loc.westernNatal}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'RUSSIAN' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('RUSSIAN')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'RUSSIAN' && styles.chartTabTextActive]}>{loc.russianCosmogram}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'THAI' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('THAI')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'THAI' && styles.chartTabTextActive]}>{loc.thaiSuryayatra}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.chartTabBtn, activeChartKey === 'INDONESIAN' && styles.chartTabBtnActive]}
                        onPress={() => setActiveChartKey('INDONESIAN')}
                      >
                        <Text style={[styles.chartTabText, activeChartKey === 'INDONESIAN' && styles.chartTabTextActive]}>{loc.indonesianPawukon}</Text>
                      </TouchableOpacity>
                    </ScrollView>

                    {/* Chart Graphic Box */}
                    {activeChart && (
                      <View style={styles.chartGraphicBox}>
                        <View style={styles.chartGraphicHeaderRow}>
                          <Text style={styles.chartGraphicTitle}>{activeChart.title}</Text>

                          {/* Chart Style Switcher (North Indian Default / South / Global) */}
                          <View style={styles.styleToggleBar}>
                            <TouchableOpacity
                              style={[styles.styleBtn, chartStyle === 'NORTH' && styles.styleBtnActive]}
                              onPress={() => setChartStyle('NORTH')}
                            >
                              <Text style={[styles.styleBtnText, chartStyle === 'NORTH' && styles.styleBtnTextActive]}>🏛️ North</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[styles.styleBtn, chartStyle === 'SOUTH' && styles.styleBtnActive]}
                              onPress={() => setChartStyle('SOUTH')}
                            >
                              <Text style={[styles.styleBtnText, chartStyle === 'SOUTH' && styles.styleBtnTextActive]}>☸️ South</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[styles.styleBtn, chartStyle === 'GLOBAL' && styles.styleBtnActive]}
                              onPress={() => setChartStyle('GLOBAL')}
                            >
                              <Text style={[styles.styleBtnText, chartStyle === 'GLOBAL' && styles.styleBtnTextActive]}>🌍 Global</Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        <Text style={styles.chartGraphicSub}>
                          Ascendant (Lagna): {kundali.lagnaRashi} • Degree: {kundali.lagnaDegree} • Style: {chartStyle === 'NORTH' ? 'North Indian Diamond Style' : chartStyle === 'SOUTH' ? 'South Indian Fixed Rashi Style' : 'Global Grid'}
                        </Text>

                        {/* Visual Chart Graphic (North Indian Authentic Diamond-Triangle vs South Fixed Rashi Grid vs Global Grid) */}
                        {chartStyle === 'NORTH' ? (
                          <NorthIndianTriangleChart houses={activeChart.houses} size={300} />
                        ) : (
                          <View style={chartStyle === 'SOUTH' ? styles.southFixedGrid : styles.diamondGrid}>
                            {activeChart.houses.map(h => (
                              <View
                                key={h.houseNumber}
                                style={[
                                  styles.houseBox,
                                  chartStyle === 'SOUTH' && styles.southHouseBox
                                ]}
                              >
                                <View style={styles.houseHeaderRow}>
                                  <Text style={[styles.houseNumText, chartStyle === 'SOUTH' && styles.southHouseNumText]}>
                                    {chartStyle === 'SOUTH' ? `Rashi ${h.houseNumber}` : `H${h.houseNumber}`}
                                  </Text>
                                  <Text style={styles.houseRashiText} numberOfLines={1}>{h.rashiName.split(' ')[0]}</Text>
                                </View>
                                <Text style={styles.housePlanetsText} numberOfLines={2}>
                                  {h.planets.length > 0 ? h.planets.join(', ') : '—'}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    )}

                    {/* 3. Deep Analysis Section Switcher */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                      <View style={styles.detailSectionSwitcher}>
                        <TouchableOpacity
                          style={[styles.detailSwitchBtn, activeDetailSection === 'PARTICULARS' && styles.detailSwitchBtnActive]}
                          onPress={() => setActiveDetailSection('PARTICULARS')}
                        >
                          <Text style={[styles.detailSwitchText, activeDetailSection === 'PARTICULARS' && styles.detailSwitchTextActive]}>
                            {loc.birthPanchangTab}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.detailSwitchBtn, activeDetailSection === 'PLANETS' && styles.detailSwitchBtnActive]}
                          onPress={() => setActiveDetailSection('PLANETS')}
                        >
                          <Text style={[styles.detailSwitchText, activeDetailSection === 'PLANETS' && styles.detailSwitchTextActive]}>
                            {loc.planetaryDegreesTab}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.detailSwitchBtn, activeDetailSection === 'HOUSES' && styles.detailSwitchBtnActive]}
                          onPress={() => setActiveDetailSection('HOUSES')}
                        >
                          <Text style={[styles.detailSwitchText, activeDetailSection === 'HOUSES' && styles.detailSwitchTextActive]}>
                            {loc.houseAnalysisTab}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.detailSwitchBtn, activeDetailSection === 'GLOBAL' && styles.detailSwitchBtnActive]}
                          onPress={() => setActiveDetailSection('GLOBAL')}
                        >
                          <Text style={[styles.detailSwitchText, activeDetailSection === 'GLOBAL' && styles.detailSwitchTextActive]}>
                            {loc.westernAspectsTab}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </ScrollView>

                    {/* Detail Section 1: Avakahada Chakra / Particulars */}
                    {activeDetailSection === 'PARTICULARS' && (
                      <View style={styles.detailCard}>
                        <Text style={styles.detailCardTitle}>📋 Birth Panchang & Avakahada Particulars</Text>
                        
                        <View style={styles.particularsGrid}>
                          {/* Clickable Born Tithi Item for Soul Purpose */}
                          <TouchableOpacity
                            style={[styles.partItem, styles.tithiPartItem]}
                            onPress={() => setShowSoulPurposeModal(true)}
                          >
                            <Text style={styles.partLabel}>{loc.bornTithi}:</Text>
                            <Text style={styles.partVal}>{kundali.particulars.bornTithi}</Text>
                            <Text style={styles.tithiTapHint}>✨ Tap for Soul Purpose</Text>
                          </TouchableOpacity>

                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.bornPaksha}:</Text><Text style={styles.partVal}>{kundali.particulars.bornPaksha}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.bornNakshatra}:</Text><Text style={styles.partVal}>{kundali.particulars.bornNakshatra} (Pada {kundali.particulars.bornPada})</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.bornYoga}:</Text><Text style={styles.partVal}>{kundali.particulars.bornYoga}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.bornKarana}:</Text><Text style={styles.partVal}>{kundali.particulars.bornKarana}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.bornVaara}:</Text><Text style={styles.partVal}>{kundali.particulars.bornVaara}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.varna}:</Text><Text style={styles.partVal}>{kundali.particulars.varna}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.vashya}:</Text><Text style={styles.partVal}>{kundali.particulars.vashya}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.yoni}:</Text><Text style={styles.partVal}>{kundali.particulars.yoni}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.gana}:</Text><Text style={styles.partVal}>{kundali.particulars.gana}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.nadi}:</Text><Text style={styles.partVal}>{kundali.particulars.nadi}</Text></View>
                          <View style={styles.partItem}><Text style={styles.partLabel}>{loc.paya}:</Text><Text style={styles.partVal}>{kundali.particulars.paya}</Text></View>
                        </View>
                      </View>
                    )}

                    {/* Detail Section 2: Planetary Degrees Table */}
                    {activeDetailSection === 'PLANETS' && (
                      <View style={styles.detailCard}>
                        <Text style={styles.detailCardTitle}>🪐 Navagraha Degrees, Nakshatras & Houses</Text>

                        {kundali.planets.map(p => (
                          <View key={p.name} style={styles.planetRowCard}>
                            <View style={styles.planetRowLeft}>
                              <Text style={styles.planetSymbol}>{p.symbol}</Text>
                              <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Text style={styles.planetName}>{p.name}</Text>
                                  {p.isRetrograde && (
                                    <View style={styles.retroBadge}>
                                      <Text style={styles.retroText}>R ({loc.retrograde})</Text>
                                    </View>
                                  )}
                                </View>
                                <Text style={styles.planetRashiSub}>{p.rashiName} ({p.rashiHindi})</Text>
                              </View>
                            </View>

                            <View style={styles.planetRowRight}>
                              <Text style={styles.planetDegreeText}>Deg: {p.degreeStr}</Text>
                              <Text style={styles.planetNakText}>⭐ {p.nakshatraName} • Pada {p.pada}</Text>
                              <Text style={styles.planetHouseText}>House: {p.house}th House</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Detail Section 3: 12 Houses Analysis */}
                    {activeDetailSection === 'HOUSES' && (
                      <View style={styles.detailCard}>
                        <Text style={styles.detailCardTitle}>🏠 12 Bhavas (Houses) Analysis</Text>

                        {kundali.houseDetails.map(h => (
                          <View key={h.houseNumber} style={styles.houseDetailRowCard}>
                            <View style={styles.houseDetailTop}>
                              <Text style={styles.houseHeaderTitleText}>House {h.houseNumber}: {h.rashiName}</Text>
                              <Text style={styles.houseLordText}>Lord: {h.rashiLord}</Text>
                            </View>
                            <Text style={styles.houseOccupantsText}>
                              Occupying Planets: {h.planets.length > 0 ? h.planets.join(', ') : 'None (Empty House)'}
                            </Text>
                            <Text style={styles.houseSignificationsText}>💡 Significations: {h.significations}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Detail Section 4: Global & Western Astrology */}
                    {activeDetailSection === 'GLOBAL' && (
                      <View style={styles.detailCard}>
                        <Text style={styles.detailCardTitle}>🌌 Global & Western Astrological Systems</Text>

                        {/* Big 3 */}
                        <View style={styles.globalCardBox}>
                          <Text style={styles.globalCardTitle}>🌟 {loc.bigThree}</Text>
                          <Text style={styles.globalItemText}>☀️ {loc.sunSign}: <Text style={styles.boldVal}>{kundali.westernNatal.sunSign}</Text> ({kundali.westernNatal.sunElement} • {kundali.westernNatal.sunModality})</Text>
                          <Text style={styles.globalItemText}>🌙 {loc.moonSign}: <Text style={styles.boldVal}>{kundali.westernNatal.moonSign}</Text></Text>
                          <Text style={styles.globalItemText}>🌅 {loc.risingSign}: <Text style={styles.boldVal}>{kundali.westernNatal.risingSign}</Text></Text>
                        </View>

                        {/* Russian Cosmogram */}
                        <View style={styles.globalCardBox}>
                          <Text style={styles.globalCardTitle}>🪆 Russian Cosmogram (Космограмма)</Text>
                          <Text style={styles.globalItemText}>🌙 Lunar Day (Лунный день): <Text style={styles.boldVal}>Day {kundali.russianCosmogram.lunarDayNumber}</Text></Text>
                          <Text style={styles.globalItemText}>✨ Symbol: <Text style={styles.boldVal}>{kundali.russianCosmogram.lunarDayMeaning}</Text></Text>
                          <Text style={styles.globalItemText}>⚡ Cosmic Ruler: <Text style={styles.boldVal}>{kundali.russianCosmogram.cosmicRuler}</Text></Text>
                        </View>

                        {/* Thai Suryayatra */}
                        <View style={styles.globalCardBox}>
                          <Text style={styles.globalCardTitle}>🛕 Thai Suryayatra (โหราศาสตร์ไทย)</Text>
                          <Text style={styles.globalItemText}>ลัคนา (Ascendant): <Text style={styles.boldVal}>{kundali.thaiSuryayatra.lakkhanaRashi}</Text></Text>
                          <Text style={styles.globalItemText}>ฤกษ์ (Naksatra): <Text style={styles.boldVal}>{kundali.thaiSuryayatra.naksatraName} (Pada {kundali.thaiSuryayatra.pada})</Text></Text>
                        </View>

                        {/* Indonesian Pawukon */}
                        <View style={styles.globalCardBox}>
                          <Text style={styles.globalCardTitle}>🌺 Indonesian Pawukon (Wariga Bali)</Text>
                          <Text style={styles.globalItemText}>Wuku Sign: <Text style={styles.boldVal}>{kundali.indonesianPawukon.wukuName}</Text> (Deity: {kundali.indonesianPawukon.wukuDeity})</Text>
                          <Text style={styles.globalItemText}>Saptawara (Day): <Text style={styles.boldVal}>{kundali.indonesianPawukon.saptawara}</Text> • Triwara: <Text style={styles.boldVal}>{kundali.indonesianPawukon.triwara}</Text></Text>
                        </View>
                      </View>
                    )}

                    {/* Prominent Magical Soul Purpose Button at the Bottom */}
                    <TouchableOpacity
                      style={styles.soulPurposeMagicBtn}
                      onPress={() => setShowSoulPurposeModal(true)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.magicBtnRow}>
                        <Text style={styles.magicBtnIcon}>✨</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.soulPurposeMagicBtnText}>Soul Purpose on Earth</Text>
                          <Text style={styles.soulPurposeMagicBtnSub}>Discover your birth Tithi personality, deity & cosmic mission</Text>
                        </View>
                        <Text style={styles.magicBtnArrow}>➔</Text>
                      </View>
                    </TouchableOpacity>

                  </View>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      {/* Soul Purpose Modal */}
      {kundali && (
        <SoulPurposeModal
          visible={showSoulPurposeModal}
          onClose={() => setShowSoulPurposeModal(false)}
          tithiNumber={getNumericTithiNumber(kundali.particulars.bornTithi)}
          tithiName={kundali.particulars.bornTithi}
          kundali={kundali}
        />
      )}

      {/* Saved Profiles Dropdown Modal */}
      <Modal visible={showSavedProfilesModal} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setShowSavedProfilesModal(false)}>
          <View style={styles.dropdownOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownModalCard}>
                <View style={styles.dropdownHeaderRow}>
                  <Text style={styles.dropdownTitle}>👤 Select Saved Kundali Profile</Text>
                  <TouchableOpacity onPress={() => setShowSavedProfilesModal(false)} style={styles.closeBtn}>
                    <Text style={styles.closeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {savedProfiles.length === 0 ? (
                  <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                    <Text style={{ fontSize: 13, color: Colors.textMuted }}>No saved profiles yet.</Text>
                    <Text style={{ fontSize: 11, color: Colors.textMuted, marginTop: 4 }}>
                      Generate a birth chart and tap "Save Profile" to store it here!
                    </Text>
                  </View>
                ) : (
                  <ScrollView style={{ maxHeight: 300 }}>
                    {savedProfiles.map(p => (
                      <View key={p.id} style={styles.profileRowItem}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSelectProfile(p)}>
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

      {/* Free Live Global Location Search Modal */}
      <Modal visible={showLocationModal} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setShowLocationModal(false)}>
          <View style={styles.dropdownOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownModalCard}>
                <View style={styles.dropdownHeaderRow}>
                  <Text style={styles.dropdownTitle}>🔍 Search Global Birth Location</Text>
                  <TouchableOpacity onPress={() => setShowLocationModal(false)} style={styles.closeBtn}>
                    <Text style={styles.closeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.citySearchInput}
                  value={placeSearchQuery}
                  onChangeText={setPlaceSearchQuery}
                  placeholder="Type any city, village, state or country..."
                  placeholderTextColor={Colors.textMuted}
                />

                {isSearching && (
                  <View style={{ paddingVertical: 10, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color={Colors.maroon} />
                    <Text style={{ fontSize: 11, color: Colors.textMuted, marginTop: 4 }}>Fetching exact Lat & Lng coordinates...</Text>
                  </View>
                )}

                <ScrollView style={{ maxHeight: 300 }}>
                  {searchResults.map((res, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.cityListItem}
                      onPress={() => {
                        setActiveLocation({
                          cityName: res.cityName,
                          lat: res.lat,
                          lng: res.lng
                        });
                        setShowLocationModal(false);
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cityItemName}>📍 {res.cityName}</Text>
                        <Text style={styles.cityItemSub} numberOfLines={2}>{res.displayName}</Text>
                        <Text style={styles.latLngTag}>Lat: {res.lat.toFixed(4)}° | Lng: {res.lng.toFixed(4)}°</Text>
                      </View>
                    </TouchableOpacity>
                  ))}

                  {searchResults.length === 0 && (
                    <View style={{ marginTop: 8 }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: Colors.maroon, marginBottom: 8 }}>
                        🌐 Or Pick Popular Presets ({selectedCountry.countryName}):
                      </Text>
                      
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                        {GLOBAL_COUNTRIES.map(c => (
                          <TouchableOpacity
                            key={c.countryCode}
                            style={[styles.countryPill, selectedCountry.countryCode === c.countryCode && styles.countryPillActive]}
                            onPress={() => setSelectedCountry(c)}
                          >
                            <Text style={[styles.countryPillText, selectedCountry.countryCode === c.countryCode && styles.countryPillTextActive]}>
                              {c.flagEmoji} {c.countryName}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>

                      {selectedCountry.cities.map(c => (
                        <TouchableOpacity
                          key={c.cityName}
                          style={[styles.cityListItem, activeLocation.cityName === c.cityName && styles.cityListItemActive]}
                          onPress={() => {
                            setActiveLocation({
                              cityName: `${c.cityName}, ${selectedCountry.countryName}`,
                              lat: c.lat,
                              lng: c.lng
                            });
                            setShowLocationModal(false);
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.cityItemName, activeLocation.cityName === c.cityName && styles.cityItemNameActive]}>
                              📍 {c.cityName} {c.hindiName ? `(${c.hindiName})` : ''}
                            </Text>
                            <Text style={styles.latLngTag}>Lat: {c.lat.toFixed(4)}° | Lng: {c.lng.toFixed(4)}°</Text>
                          </View>
                          {activeLocation.cityName === c.cityName && <Text style={styles.checkIcon}>✓</Text>}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </ScrollView>
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
                <Text style={styles.dropdownTitle}>Select Day of Birth</Text>
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
                <Text style={styles.dropdownTitle}>Select Month of Birth</Text>
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
                <Text style={styles.dropdownTitle}>Select Year of Birth</Text>
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
                <Text style={styles.dropdownTitle}>Select Hour of Birth (24-Hour)</Text>
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
                <Text style={styles.dropdownTitle}>Select Minute of Birth</Text>
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

      {/* Auth Modal Triggered when user attempts to save profile without sign in */}
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        onSuccess={(profile) => {
          setAuthModalVisible(false);
          setName(profile.name);
          // Automatically complete profile saving after sign in
          setTimeout(() => {
            handleSaveProfile();
          }, 300);
        }}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
    flex: 1,
  },
  closeBtn: {
    backgroundColor: '#F0F0F0',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  formCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  savedProfilesBtn: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFB74D',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  savedProfilesBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  formSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
    marginTop: 4,
  },
  textInput: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  dropdownRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  dropdownField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dropdownValText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  fieldArrow: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginLeft: 4,
  },
  col3: {
    flex: 1,
  },
  col2: {
    flex: 1,
  },

  // City Dropdown Styles
  dropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.maroon,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  dropdownCityName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  dropdownCitySub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  dropdownArrow: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
  },

  actionBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateBtn: {
    backgroundColor: Colors.maroon,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#2E7D32',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  saveSuccessText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginTop: 6,
  },

  resultsContainer: {
    marginTop: 4,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 8,
  },
  chartTabsScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  chartTabBtn: {
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chartTabBtnActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  chartTabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  chartTabTextActive: {
    color: '#FFD700',
  },
  chartGraphicBox: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.accentGold,
    elevation: 3,
  },
  chartGraphicHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chartGraphicTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
    flex: 1,
  },
  styleToggleBar: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: 2,
  },
  styleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  styleBtnActive: {
    backgroundColor: Colors.maroon,
  },
  styleBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  styleBtnTextActive: {
    color: '#FFFFFF',
  },
  chartGraphicSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  diamondGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  southFixedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  houseBox: {
    width: '31%',
    backgroundColor: '#FAF5EE',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F0E0D0',
    minHeight: 64,
  },
  southHouseBox: {
    backgroundColor: '#F0F8FF',
    borderColor: '#90CAF9',
  },
  houseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  houseNumText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  southHouseNumText: {
    color: '#1565C0',
  },
  houseRashiText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  housePlanetsText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },

  // Deep Analysis Switcher
  detailSectionSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    padding: 3,
    gap: 4,
  },
  detailSwitchBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  detailSwitchBtnActive: {
    backgroundColor: Colors.maroon,
  },
  detailSwitchText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  detailSwitchTextActive: {
    color: '#FFFFFF',
  },

  // Detail Cards
  detailCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 10,
  },
  particularsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  partItem: {
    width: '48%',
    backgroundColor: '#FAF5EE',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  tithiPartItem: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFB74D',
    borderWidth: 1.5,
  },
  tithiTapHint: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginTop: 3,
  },
  partLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  partVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 2,
  },

  // Magical Soul Purpose Button
  soulPurposeMagicBtn: {
    backgroundColor: '#4A0E17',
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#FFD700',
    elevation: 5,
  },
  magicBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  magicBtnIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  soulPurposeMagicBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  soulPurposeMagicBtnSub: {
    fontSize: 11,
    color: '#FFE0B2',
    marginTop: 2,
  },
  magicBtnArrow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 8,
  },

  // Planet Rows
  planetRowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  planetRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  planetSymbol: {
    fontSize: 22,
    marginRight: 10,
  },
  planetName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  retroBadge: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF9A9A',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 6,
  },
  retroText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#C62828',
  },
  planetRashiSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  planetRowRight: {
    alignItems: 'flex-end',
  },
  planetDegreeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  planetNakText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  planetHouseText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginTop: 1,
  },

  // House Detail Rows
  houseDetailRowCard: {
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  houseDetailTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  houseHeaderTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  houseLordText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  houseOccupantsText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  houseSignificationsText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },

  // Global Cards
  globalCardBox: {
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  globalCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 4,
  },
  globalItemText: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  boldVal: {
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },

  // Dropdown City Modal Styles
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  dropdownModalCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 16,
    elevation: 8,
  },
  dropdownHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  citySearchInput: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  cityListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cityListItemActive: {
    backgroundColor: '#FAF5EE',
  },
  cityItemName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  cityItemNameActive: {
    color: Colors.maroon,
  },
  cityItemSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  latLngTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginTop: 2,
  },
  countryPill: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 6,
  },
  countryPillActive: {
    backgroundColor: Colors.maroon,
  },
  countryPillText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  countryPillTextActive: {
    color: '#FFFFFF',
  },
  checkIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  pickerItemActive: {
    backgroundColor: '#FAF5EE',
  },
  pickerItemText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  pickerItemTextActive: {
    color: Colors.maroon,
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
    borderColor: '#F0E0D0',
  },
  profileNameText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  profileSubText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  profileLocationText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginTop: 1,
  },
  deleteProfileBtn: {
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteProfileText: {
    fontSize: 12,
  },
});
