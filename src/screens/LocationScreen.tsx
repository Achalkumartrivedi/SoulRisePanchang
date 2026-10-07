import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking,
  Dimensions
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import * as Location from 'expo-location';
import { Colors } from '../theme/colors';
import { Fonts } from '../constants/typography';
import { CityLocation } from '../types/panchang';
import { DEFAULT_CITIES } from '../data/cities';
import { searchGlobalLocations, GeocodedLocation } from '../utils/geocodingService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';

interface LocationScreenProps {
  selectedCity: CityLocation;
  onApplyLocation: (city: CityLocation) => void;
  onBack: () => void;
}

const LOC_HEADER_TITLES: Record<string, string> = {
  en: 'Select Location',
  hinglish: 'Select Location',
  hi: 'स्थान चयन',
  gu: 'સ્થળ પસંદ કરો',
  mr: 'स्थान निवडा',
  bn: 'স্থান নির্বাচন করুন',
  ta: 'இருப்பிடத்தைத் தேர்ந்தெடுக்கவும்',
  te: 'స్థానాన్ని ఎంచుకోండి',
  ru: 'Выберите местоположение',
  fr: 'Choisir le lieu',
  es: 'Seleccionar ubicación',
  he: 'בחר מיקום',
  id: 'Pilih Lokasi',
  th: 'เลือกสถานที่',
};

const LOC_CURRENT_PREFIX: Record<string, string> = {
  en: 'Current:',
  hinglish: 'Current:',
  hi: 'वर्तमान:',
  gu: 'વર્તમાન:',
  mr: 'सध्याचे:',
  bn: 'বর্তমান:',
  ta: 'தற்போதைய:',
  te: 'ప్రస్తుత:',
  ru: 'Текущее:',
  fr: 'Actuel:',
  es: 'Actual:',
  he: 'נוכחי:',
  id: 'Saat ini:',
  th: 'ปัจจุบัน:',
};

const LOC_SEARCH_PLACEHOLDER: Record<string, string> = {
  en: 'Search city, town, district or PIN code...',
  hinglish: 'Search city, town, district or PIN code...',
  hi: 'शहर, कस्बा, जिला या पिन कोड खोजें...',
  gu: 'શહેર, જિલ્લો અથવા પિન કોડ શોધો...',
  mr: 'शहर, जिल्हा किंवा पिन कोड शोधा...',
  bn: 'শহর, জেলা বা পিন কোড অনুসন্ধান করুন...',
  ta: 'நகரம், மாவட்டம் அல்லது பின் குறியீட்டைத் தேடுங்கள்...',
  te: 'నగరం, జిల్లా లేదా పిన్ కోడ్‌ను శోధించండి...',
  ru: 'Поиск города или индекса...',
  fr: 'Rechercher une ville, un code postal...',
  es: 'Buscar ciudad o código postal...',
  he: 'חפש עיר או מיקוד...',
  id: 'Cari kota atau kode pos...',
  th: 'ค้นหาเมืองหรือรหัสไปรษณีย์...',
};

const LOC_POPULAR_TITLE: Record<string, string> = {
  en: 'POPULAR CITIES',
  hinglish: 'POPULAR CITIES • प्रमुख नगर',
  hi: 'प्रमुख नगर',
  gu: 'મુખ્ય શહેરો',
  mr: 'प्रमुख शहरे',
  bn: 'জনপ্রিয় শহর',
  ta: 'பிரபலமான நகரங்கள்',
  te: 'ప్రముఖ నగరాలు',
  ru: 'ПОПУЛЯРНЫЕ ГОРОДА',
  fr: 'VILLES POPULAIRES',
  es: 'CIUDADES POPULARES',
  he: 'ערים פופולריות',
  id: 'KOTA POPULER',
  th: 'เมืองยอดนิยม',
};

const LOC_SEARCH_RESULTS_TITLE: Record<string, string> = {
  en: 'SEARCH RESULTS',
  hinglish: 'SEARCH RESULTS (वैश्विक परिणाम)',
  hi: 'खोज परिणाम (वैश्विक)',
  gu: 'શોધ પરિણામો',
  mr: 'शोध निकाल',
  bn: 'অনুসন্ধানের ফলাফল',
  ta: 'தேடல் முடிவுகள்',
  te: 'శోధన ఫలితాలు',
  ru: 'РЕЗУЛЬТАТЫ ПОИСКА',
  fr: 'RÉSULTATS DE RECHERCHE',
  es: 'RESULTADOS DE BÚSQUEDA',
  he: 'תוצאות חיפוש',
  id: 'HASIL PENCARIAN',
  th: 'ผลการค้นหา',
};

const LOC_SELECTED_LABEL: Record<string, string> = {
  en: 'SELECTED LOCATION:',
  hinglish: 'SELECTED LOCATION:',
  hi: 'चयनित स्थान:',
  gu: 'પસંદ કરેલ સ્થળ:',
  mr: 'निवडलेले स्थान:',
  bn: 'নির্বাচিত স্থান:',
  ta: 'தேர்ந்தெடுக்கப்பட்ட இடம்:',
  te: 'ఎంచుకున్న స్థానం:',
  ru: 'ВЫБРАННОЕ МЕСТО:',
  fr: 'LIEU SÉLECTIONNÉ:',
  es: 'UBICACIÓN SELECCIONADA:',
  he: 'מיקום שנבחר:',
  id: 'LOKASI TERPILIH:',
  th: 'สถานที่ที่เลือก:',
};

const LOC_APPLY_TEXT: Record<string, string> = {
  en: 'Apply Location ➔',
  hinglish: 'Apply Location (स्थान लागू करें) ➔',
  hi: 'स्थान लागू करें ➔',
  gu: 'સ્થળ લાગુ કરો ➔',
  mr: 'स्थान लागू करा ➔',
  bn: 'স্থান প্রয়োগ করুন ➔',
  ta: 'இருப்பிடத்தைப் பயன்படுத்து ➔',
  te: 'స్థానాన్ని వర్తింపజేయి ➔',
  ru: 'Применить местоположение ➔',
  fr: 'Appliquer le lieu ➔',
  es: 'Aplicar ubicación ➔',
  he: 'החל מיקום ➔',
  id: 'Terapkan Lokasi ➔',
  th: 'นำสถานที่ไปใช้ ➔',
};

const LOC_BACK_TEXT: Record<string, string> = {
  en: '‹ Back',
  hinglish: '‹ Back',
  hi: '‹ वापस',
  gu: '‹ પાછા',
  mr: '‹ मागे',
  bn: '‹ পিছনে',
  ta: '‹ பின்',
  te: '‹ వెనుకకు',
  ru: '‹ Назад',
  fr: '‹ Retour',
  es: '‹ Volver',
  he: '‹ חזרה',
  id: '‹ Kembali',
  th: '‹ ย้อนกลับ',
};

const LOC_GPS_MAIN_TITLE: Record<string, string> = {
  en: 'Use Current GPS Location',
  hinglish: 'Use Current GPS Location',
  hi: 'वर्तमान GPS स्थान का उपयोग करें',
  gu: 'વર્તમાન GPS સ્થળનો ઉપયોગ કરો',
  mr: 'सध्याचे GPS स्थान वापरा',
  bn: 'বর্তমান GPS অবস্থান ব্যবহার করুন',
  ta: 'தற்போதைய GPS இருப்பிடத்தைப் பயன்படுத்தவும்',
  te: 'ప్రస్తుత GPS స్థానాన్ని ఉపయోగించండి',
  ru: 'Использовать текущее GPS местоположение',
  fr: 'Utiliser la position GPS actuelle',
  es: 'Usar ubicación GPS actual',
  he: 'השתמש במיקום GPS הנוכחי',
  id: 'Gunakan Lokasi GPS Saat Ini',
  th: 'ใช้ตำแหน่ง GPS ปัจจุบัน',
};

const LOC_GPS_SUBTITLE: Record<string, string> = {
  en: 'Automatically detect exact coordinates via device satellite GPS',
  hinglish: 'Automatically detect exact coordinates via device satellite GPS',
  hi: 'डिवाइस सैटेलाइट GPS द्वारा सटीक निर्देशांक स्वतः प्राप्त करें',
  gu: 'ઉપકરણ સેટેલાઇટ GPS દ્વારા ચોક્કસ સ્થાન આપમેળે મેળવો',
  mr: 'डिव्हाइस सॅटेलाइट GPS द्वारे अचूक समन्वय आपोआप शोधा',
  bn: 'ডিভাইস স্যাটেলাইট জিপিএসের মাধ্যমে সঠিক স্থানাঙ্ক সনাক্ত করুন',
  ta: 'சாதன செயற்கைக்கோள் ஜிபிஎஸ் வழியாக துல்லியமான ஒருங்கிணைப்புகளைக் கண்டறியவும்',
  te: 'పరికర శాటిలైట్ జీపీఎస్ ద్వారా ఖచ్చితమైన సమన్వయాలను స్వయంచాలకంగా గుర్తించండి',
  ru: 'Автоматическое определение точных координат по спутникам GPS',
  fr: 'Détecter automatiquement les coordonnées exactes via le GPS',
  es: 'Detectar automáticamente las coordenadas exactas vía GPS',
  he: 'זיהוי קואורדינטות מדויקות באופן אוטומטי באמצעות GPS',
  id: 'Deteksi koordinat akurat otomatis melalui GPS satelit perangkat',
  th: 'ตรวจหาพิกัดที่แน่นอนโดยอัตโนมัติผ่าน GPS ดาวเทียมของอุปกรณ์',
};

const REGION_TABS = [
  'All',
  'North',
  'South',
  'West',
  'East & Central',
  'International'
] as const;

type RegionTab = typeof REGION_TABS[number];

export const LocationScreen: React.FC<LocationScreenProps> = ({
  selectedCity,
  onApplyLocation,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 6, 20);
  const bottomPadding = Math.max(insets.bottom + 12, 24);

  const { language } = useLanguage();
  const currentLang = language || 'en';
  const locHeaderTitle = LOC_HEADER_TITLES[currentLang] || 'Select Location';
  const locCurrentPrefix = LOC_CURRENT_PREFIX[currentLang] || 'Current:';
  const locSearchPlaceholder = LOC_SEARCH_PLACEHOLDER[currentLang] || 'Search city, town, district or PIN code...';
  const locPopularTitle = LOC_POPULAR_TITLE[currentLang] || 'POPULAR CITIES';
  const locSearchResultsTitle = LOC_SEARCH_RESULTS_TITLE[currentLang] || 'SEARCH RESULTS';
  const locSelectedLabel = LOC_SELECTED_LABEL[currentLang] || 'SELECTED LOCATION:';
  const locApplyText = LOC_APPLY_TEXT[currentLang] || 'Apply Location ➔';
  const locBackText = LOC_BACK_TEXT[currentLang] || '‹ Back';
  const locGpsTitle = LOC_GPS_MAIN_TITLE[currentLang] || 'Use Current GPS Location';
  const locGpsSubtitle = LOC_GPS_SUBTITLE[currentLang] || 'Automatically detect exact coordinates via device satellite GPS';

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodedLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [activeTab, setActiveTab] = useState<RegionTab>('All');
  const [candidateCity, setCandidateCity] = useState<CityLocation>(selectedCity);

  // Live Geocoding Search Debouncer (400ms)
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchGlobalLocations(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.log('Location search geocoding error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // GPS Auto-Detection Handler
  const handleDetectGps = async () => {
    setIsDetectingGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsDetectingGps(false);
        Alert.alert(
          '📍 Location Permission Required',
          'Location permission is needed to compute astronomical Sunrise, Sunset, Muhurat and Tithi for your exact geographical coordinates.\n\nOpen Settings to grant location permission?',
          [
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings().catch(() => {}),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
        return;
      }

      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }).catch(async () => {
        return await Location.getLastKnownPositionAsync();
      });

      if (!loc) {
        Alert.alert(
          '⚠️ Signal Weak',
          'Unable to acquire GPS fix. Please ensure location services are turned on in your device settings.'
        );
        setIsDetectingGps(false);
        return;
      }

      let cityName = 'Current Location (GPS)';
      let hindiName = 'वर्तमान स्थान';

      try {
        const geocode = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        if (geocode && geocode.length > 0) {
          const place = geocode[0];
          const name = place.city || place.subregion || place.district || place.region || 'Current Location';
          cityName = `${name} (GPS)`;
          hindiName = place.city || place.district || place.region || 'वर्तमान स्थान';
        }
      } catch (err) {
        console.log('Reverse geocoding error:', err);
      }

      const gpsCity: CityLocation = {
        name: cityName,
        hindiName,
        stateCountry: 'GPS Location',
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        timeZoneId: 'Asia/Kolkata',
      };

      setCandidateCity(gpsCity);
    } catch (e) {
      console.log('GPS error:', e);
      Alert.alert('Location Error', 'Failed to detect GPS location. Please try selecting a city manually.');
    } finally {
      setIsDetectingGps(false);
    }
  };

  // Filter default cities by search query and region tab
  const filteredCities = DEFAULT_CITIES.filter((city) => {
    const matchesSearch =
      searchQuery.trim().length === 0 ||
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.hindiName.includes(searchQuery) ||
      city.stateCountry.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'All') return true;
    if (activeTab === 'North') {
      return (
        city.stateCountry.includes('Delhi') ||
        city.stateCountry.includes('Uttar Pradesh') ||
        city.stateCountry.includes('Punjab') ||
        city.stateCountry.includes('Rajasthan') ||
        city.stateCountry.includes('Uttarakhand') ||
        city.stateCountry.includes('Himachal') ||
        city.stateCountry.includes('Haryana') ||
        city.stateCountry.includes('Jammu')
      );
    }
    if (activeTab === 'South') {
      return (
        city.stateCountry.includes('Karnataka') ||
        city.stateCountry.includes('Tamil Nadu') ||
        city.stateCountry.includes('Kerala') ||
        city.stateCountry.includes('Andhra') ||
        city.stateCountry.includes('Telangana')
      );
    }
    if (activeTab === 'West') {
      return (
        city.stateCountry.includes('Maharashtra') ||
        city.stateCountry.includes('Gujarat') ||
        city.stateCountry.includes('Goa')
      );
    }
    if (activeTab === 'East & Central') {
      return (
        city.stateCountry.includes('Madhya Pradesh') ||
        city.stateCountry.includes('West Bengal') ||
        city.stateCountry.includes('Bihar') ||
        city.stateCountry.includes('Odisha') ||
        city.stateCountry.includes('Assam') ||
        city.stateCountry.includes('Chhattisgarh') ||
        city.stateCountry.includes('Jharkhand')
      );
    }
    if (activeTab === 'International') {
      return (
        city.stateCountry.includes('UK') ||
        city.stateCountry.includes('USA') ||
        city.stateCountry.includes('UAE') ||
        city.stateCountry.includes('Nepal') ||
        city.stateCountry.includes('Singapore') ||
        city.stateCountry.includes('Australia') ||
        city.stateCountry.includes('Canada')
      );
    }
    return true;
  });

  const handleApplyPress = () => {
    onApplyLocation(candidateCity);
  };

  const isCandidateSelected = (city: CityLocation) => {
    return (
      candidateCity.name === city.name &&
      Math.abs(candidateCity.latitude - city.latitude) < 0.001 &&
      Math.abs(candidateCity.longitude - city.longitude) < 0.001
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5EE" />

      {/* 1. Header Navigation Bar */}
      <View style={[styles.headerBar, { paddingTop: topPadding }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Text style={styles.backBtnText}>{locBackText}</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleCol}>
          <Text style={styles.headerMainTitle}>{locHeaderTitle}</Text>
          <Text style={styles.headerSubTitle}>
            {locCurrentPrefix} {currentLang === 'hi' ? (candidateCity.hindiName || candidateCity.name) : (currentLang === 'hinglish' ? `${candidateCity.name} (${candidateCity.hindiName})` : candidateCity.name)}
          </Text>
        </View>

        <View style={styles.locationPinBadge}>
          <Text style={styles.pinEmoji}>📍</Text>
        </View>
      </View>

      {/* 2. Search Bar Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={locSearchPlaceholder}
            placeholderTextColor="#8A7571"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* 3. GPS Auto-Detection Card */}
        <TouchableOpacity
          style={[
            styles.gpsCard,
            candidateCity.stateCountry === 'GPS Location' && styles.gpsCardActive,
          ]}
          onPress={handleDetectGps}
          activeOpacity={0.8}
        >
          <View style={styles.gpsIconBadge}>
            {isDetectingGps ? (
              <ActivityIndicator size="small" color="#2B0E14" />
            ) : (
              <Text style={styles.gpsIconEmoji}>📡</Text>
            )}
          </View>
          <View style={styles.gpsTextCol}>
            <View style={styles.gpsTitleRow}>
              <Text style={styles.gpsMainTitle}>{locGpsTitle}</Text>
              {currentLang === 'hinglish' && (
                <Text style={styles.gpsHindiTitle}>वर्तमान स्थान</Text>
              )}
            </View>
            <Text style={styles.gpsSubtitle}>
              {locGpsSubtitle}
            </Text>
          </View>
          {candidateCity.stateCountry === 'GPS Location' && (
            <View style={styles.checkBadge}>
              <Text style={styles.checkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 4. Live Geocoding Search Results (If searching) */}
        {isSearching && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#2B0E14" />
            <Text style={styles.loadingText}>Searching global coordinates...</Text>
          </View>
        )}

        {searchResults.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionHeaderTitle}>{locSearchResultsTitle}</Text>
            {searchResults.map((item, idx) => {
              const asCity: CityLocation = {
                name: item.cityName,
                hindiName: item.cityName,
                stateCountry: item.displayName || item.countryName || 'Global',
                latitude: item.lat,
                longitude: item.lng,
                timeZoneId: 'Asia/Kolkata',
              };
              const isSelected = isCandidateSelected(asCity);

              return (
                <TouchableOpacity
                  key={`search-${idx}-${item.cityName}`}
                  style={[styles.cityCard, isSelected && styles.cityCardSelected]}
                  onPress={() => setCandidateCity(asCity)}
                  activeOpacity={0.75}
                >
                  <View style={styles.cityLeftCol}>
                    <Text style={styles.cityPin}>📍</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cityNameText}>{item.cityName}</Text>
                      <Text style={styles.cityStateText} numberOfLines={1}>{item.displayName}</Text>
                    </View>
                  </View>
                  <View style={styles.coordCol}>
                    <Text style={styles.coordText}>
                      {item.lat.toFixed(2)}°, {item.lng.toFixed(2)}°
                    </Text>
                    {isSelected && (
                      <View style={styles.checkBadgeSmall}>
                        <Text style={styles.checkTextSmall}>✓</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* 5. Region Tabs */}
        <View style={styles.tabsSection}>
          <Text style={styles.sectionHeaderTitle}>{locPopularTitle}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
            {REGION_TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.regionTabPill, activeTab === tab && styles.regionTabPillActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.regionTabText,
                    activeTab === tab && styles.regionTabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 6. Popular Cities List */}
        <View style={styles.citiesGrid}>
          {filteredCities.map((city) => {
            const isSelected = isCandidateSelected(city);
            return (
              <TouchableOpacity
                key={`city-${city.name}`}
                style={[styles.cityCard, isSelected && styles.cityCardSelected]}
                onPress={() => setCandidateCity(city)}
                activeOpacity={0.75}
              >
                <View style={styles.cityLeftCol}>
                  <View style={[styles.templeBadge, isSelected && styles.templeBadgeSelected]}>
                    <Text style={styles.templeIcon}>🏛️</Text>
                  </View>
                  <View>
                    <View style={styles.cityNameRow}>
                      <Text style={[styles.cityNameText, isSelected && styles.cityNameTextSelected]}>
                        {currentLang === 'hi' ? (city.hindiName || city.name) : city.name}
                      </Text>
                      {currentLang === 'hinglish' && (
                        <Text style={styles.cityHindiNameText}>{city.hindiName}</Text>
                      )}
                    </View>
                    <Text style={styles.cityStateText}>{city.stateCountry}</Text>
                  </View>
                </View>

                <View style={styles.coordCol}>
                  <Text style={styles.coordText}>
                    {city.latitude.toFixed(2)}°N, {city.longitude.toFixed(2)}°E
                  </Text>
                  {isSelected && (
                    <View style={styles.checkBadgeSmall}>
                      <Text style={styles.checkTextSmall}>✓</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* ======================================================== */}
      {/* 7. Sticky Bottom Bar: Candidate Preview + "Apply Location" */}
      {/* ======================================================== */}
      <View style={[styles.stickyBottomBar, { paddingBottom: bottomPadding }]}>
        <View style={styles.previewCandidateBox}>
          <Text style={styles.previewCandidateLabel}>{locSelectedLabel}</Text>
          <Text style={styles.previewCandidateName} numberOfLines={1}>
            {currentLang === 'hi' ? (candidateCity.hindiName || candidateCity.name) : (currentLang === 'hinglish' ? `${candidateCity.name} (${candidateCity.hindiName})` : candidateCity.name)}
          </Text>
          <Text style={styles.previewCandidateCoords}>
            {candidateCity.latitude.toFixed(3)}°N, {candidateCity.longitude.toFixed(3)}°E • {candidateCity.timeZoneId || 'Asia/Kolkata'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.applyBtn}
          onPress={handleApplyPress}
          activeOpacity={0.85}
        >
          <Text style={styles.applyBtnText}>
            {locApplyText}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EADBCE',
    backgroundColor: 'rgba(248, 245, 238, 0.92)',
  },
  backBtn: {
    paddingVertical: 6,
    paddingRight: 10,
  },
  backBtnText: {
    fontSize: 16,
    fontFamily: Fonts.jakartaBold,
    color: '#2B0E14',
  },
  headerTitleCol: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerMainTitle: {
    fontSize: 17,
    fontFamily: Fonts.cormorantBold,
    color: '#2B0E14',
  },
  headerSubTitle: {
    fontSize: 11,
    fontFamily: Fonts.jakartaRegular,
    color: '#7D6A68',
    marginTop: 1,
  },
  locationPinBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DFB059',
  },
  pinEmoji: {
    fontSize: 16,
  },
  searchSection: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#F8F5EE',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(234, 219, 206, 0.6)',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1.2,
    borderColor: '#EADBCE',
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.jakartaRegular,
    color: '#2B0E14',
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    fontSize: 13,
    color: '#7D6A68',
  },
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 28,
    flexGrow: 1,
  },
  gpsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#DFB059',
    marginBottom: 16,
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  gpsCardActive: {
    backgroundColor: 'rgba(223, 176, 89, 0.15)',
    borderColor: '#2B0E14',
  },
  gpsIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DFB059',
    marginRight: 12,
  },
  gpsIconEmoji: {
    fontSize: 22,
  },
  gpsTextCol: {
    flex: 1,
  },
  gpsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  gpsMainTitle: {
    fontSize: 13,
    fontFamily: Fonts.jakartaBold,
    color: '#2B0E14',
    marginRight: 8,
  },
  gpsHindiTitle: {
    fontSize: 11,
    fontFamily: Fonts.rozhaRegular,
    color: '#DFB059',
  },
  gpsSubtitle: {
    fontSize: 11,
    fontFamily: Fonts.jakartaRegular,
    color: '#7D6A68',
    lineHeight: 15,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#237B4B',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 12,
    fontFamily: Fonts.jakartaRegular,
    color: '#7D6A68',
    marginLeft: 8,
  },
  resultsSection: {
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontFamily: Fonts.jakartaSemiBold,
    color: '#7D6A68',
    letterSpacing: 1.2,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  tabsSection: {
    marginBottom: 12,
  },
  tabsScroll: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  regionTabPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EADBCE',
    marginRight: 8,
  },
  regionTabPillActive: {
    backgroundColor: '#2B0E14',
    borderColor: '#2B0E14',
  },
  regionTabText: {
    fontSize: 11,
    fontFamily: Fonts.jakartaMedium,
    color: '#7D6A68',
  },
  regionTabTextActive: {
    color: '#DFB059',
    fontFamily: Fonts.jakartaBold,
  },
  citiesGrid: {
    gap: 8,
  },
  cityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.2,
    borderColor: '#EADBCE',
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cityCardSelected: {
    backgroundColor: '#FFFDF9',
    borderColor: '#DFB059',
    borderWidth: 1.5,
    shadowColor: '#DFB059',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  cityLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  templeBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EADBCE',
  },
  templeBadgeSelected: {
    backgroundColor: 'rgba(223, 176, 89, 0.15)',
    borderColor: '#DFB059',
  },
  templeIcon: {
    fontSize: 16,
  },
  cityNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityNameText: {
    fontSize: 14,
    fontFamily: Fonts.jakartaBold,
    color: '#2B0E14',
    marginRight: 6,
  },
  cityNameTextSelected: {
    color: '#2B0E14',
  },
  cityHindiNameText: {
    fontSize: 11,
    fontFamily: Fonts.rozhaRegular,
    color: '#DFB059',
  },
  cityStateText: {
    fontSize: 11,
    fontFamily: Fonts.jakartaRegular,
    color: '#7D6A68',
    marginTop: 1,
  },
  cityPin: {
    fontSize: 16,
    marginRight: 8,
  },
  coordCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
  },
  coordText: {
    fontSize: 10,
    fontFamily: Fonts.jakartaRegular,
    color: '#9C8885',
    marginBottom: 4,
  },
  checkBadgeSmall: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2B0E14',
    borderWidth: 1,
    borderColor: '#DFB059',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkTextSmall: {
    color: '#DFB059',
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Sticky Bottom Bar
  stickyBottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: '#DFB059',
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  previewCandidateBox: {
    marginBottom: 8,
  },
  previewCandidateLabel: {
    fontSize: 9,
    fontFamily: Fonts.jakartaSemiBold,
    color: '#7D6A68',
    letterSpacing: 1,
  },
  previewCandidateName: {
    fontSize: 13,
    fontFamily: Fonts.jakartaBold,
    color: '#2B0E14',
    marginTop: 1,
  },
  previewCandidateCoords: {
    fontSize: 10,
    fontFamily: Fonts.jakartaRegular,
    color: '#8A7571',
  },
  applyBtn: {
    backgroundColor: '#2B0E14',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: '#DFB059',
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  applyBtnText: {
    fontSize: 14,
    fontFamily: Fonts.jakartaBold,
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});
