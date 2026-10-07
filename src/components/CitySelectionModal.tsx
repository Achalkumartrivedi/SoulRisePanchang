import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';
import { Fonts } from '../constants/typography';
import { CityLocation } from '../types/panchang';
import { DEFAULT_CITIES } from '../data/cities';
import { useLanguage } from '../context/LanguageContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { searchGlobalLocations, GeocodedLocation } from '../utils/geocodingService';

const CITY_STORAGE_KEY = 'SOULRISE_SELECTED_CITY';
const GPS_STORAGE_KEY = 'SOULRISE_USE_GPS';

interface CitySelectionModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  title?: string;
  persistToGlobalStorage?: boolean;
}

export const CitySelectionModal: React.FC<CitySelectionModalProps> = ({
  visible,
  onClose,
  selectedCity,
  onSelectCity,
  title,
  persistToGlobalStorage = false,
}) => {
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + 12, 24);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodedLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  const isGpsActive = selectedCity.stateCountry === 'GPS Location' || selectedCity.name.includes('(GPS)');

  // Reset search when modal opens
  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [visible]);

  // Live Free Geocoding API Search debouncer (400ms)
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
        console.log('Global geocoding search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredDefaultCities = DEFAULT_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hindiName.includes(searchQuery) ||
      c.stateCountry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDetectGps = async () => {
    setIsDetectingGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsDetectingGps(false);
        Alert.alert(
          t('locationPermRequired'),
          t('locationPermMessage'),
          [
            {
              text: t('turnOnSettings'),
              onPress: () => {
                Linking.openSettings().catch(() => {});
              },
            },
            {
              text: t('useDefaultLocation'),
              style: 'cancel',
              onPress: async () => {
                if (persistToGlobalStorage) {
                  const defaultCity = DEFAULT_CITIES[0];
                  onSelectCity(defaultCity);
                  await AsyncStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(defaultCity));
                  await AsyncStorage.setItem(GPS_STORAGE_KEY, 'false');
                  Alert.alert(
                    t('defaultLocationActive'),
                    t('defaultLocationMessage')
                  );
                }
                onClose();
              },
            },
          ],
          { cancelable: false }
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
          t('weakSignal'),
          t('weakSignalMessage')
        );
        setIsDetectingGps(false);
        return;
      }

      const latitude = loc.coords.latitude;
      const longitude = loc.coords.longitude;

      let cityName = 'Current Location';
      let hindiName = 'वर्तमान स्थान';

      try {
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocode && geocode.length > 0) {
          const place = geocode[0];
          const foundName = place.city || place.subregion || place.district || place.region || 'Current Location';
          cityName = persistToGlobalStorage ? `${foundName} (GPS)` : foundName;
          hindiName = place.city || place.district || place.region || 'वर्तमान स्थान';
        }
      } catch (err) {
        console.log('Reverse geocode error:', err);
      }

      const userGpsCity: CityLocation = {
        name: cityName,
        hindiName,
        stateCountry: persistToGlobalStorage ? 'GPS Location' : 'Device Location',
        latitude,
        longitude,
        timeZoneId: 'Asia/Kolkata',
      };

      onSelectCity(userGpsCity);
      if (persistToGlobalStorage) {
        await AsyncStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(userGpsCity));
        await AsyncStorage.setItem(GPS_STORAGE_KEY, 'true');
      }
      onClose();
    } catch (e: any) {
      console.log('GPS detection error:', e);
      Alert.alert(t('gpsError'), e?.message || 'Failed to detect current location.');
    } finally {
      setIsDetectingGps(false);
    }
  };

  const handleSelectPredefinedCity = async (item: CityLocation) => {
    onSelectCity(item);
    if (persistToGlobalStorage) {
      try {
        await AsyncStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(item));
        await AsyncStorage.setItem(GPS_STORAGE_KEY, 'false');
      } catch (e) {
        console.log('Save city error:', e);
      }
    }
    onClose();
  };

  const handleSelectGeocoded = async (res: GeocodedLocation) => {
    const cityObj: CityLocation = {
      name: res.cityName,
      hindiName: res.cityName,
      stateCountry: res.countryName || res.displayName,
      latitude: res.lat,
      longitude: res.lng,
      timeZoneId: 'Asia/Kolkata',
    };
    onSelectCity(cityObj);
    if (persistToGlobalStorage) {
      try {
        await AsyncStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(cityObj));
        await AsyncStorage.setItem(GPS_STORAGE_KEY, 'false');
      } catch (e) {
        console.log('Save city error:', e);
      }
    }
    onClose();
  };

  const isQueryTyped = searchQuery.trim().length >= 2;

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { paddingTop: 14, paddingBottom: bottomPadding }]}>
          {/* Drag Handle Indicator */}
          <View style={styles.sheetDragBar} />

          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.modalTitle}>📍 {title || t('activeLocation') || 'Select Location'}</Text>
              <Text style={styles.modalSub}>
                {language === 'hi' || language === 'hinglish'
                  ? 'विश्वभर में कोई भी शहर या स्थान खोजें'
                  : 'Search any city, town or country worldwide'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 🎯 Auto-Detect GPS Location Button */}
          <TouchableOpacity
            style={[styles.gpsDetectBtn, isGpsActive && styles.gpsDetectBtnActive]}
            onPress={handleDetectGps}
            disabled={isDetectingGps}
            activeOpacity={0.8}
          >
            {isDetectingGps ? (
              <View style={styles.gpsRowCenter}>
                <ActivityIndicator size="small" color="#DFB059" />
                <Text style={styles.gpsBtnTextActive}>  {t('detectingGps')}</Text>
              </View>
            ) : (
              <View style={styles.gpsRowCenter}>
                <Text style={styles.gpsIcon}>🎯</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.gpsBtnTitle, isGpsActive && styles.gpsBtnTitleActive]}>
                    {t('useGpsLocation')}
                  </Text>
                  <Text style={[styles.gpsBtnSub, isGpsActive && styles.gpsBtnSubActive]}>
                    {persistToGlobalStorage
                      ? isGpsActive
                        ? `Active: ${selectedCity.name}`
                        : 'Auto-detect exact latitude & longitude via device GPS'
                      : 'Use device current latitude & longitude for this profile'}
                  </Text>
                </View>
                {isGpsActive && <Text style={styles.checkIconLight}>✓</Text>}
              </View>
            )}
          </TouchableOpacity>

          {/* Search Box */}
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder={t('searchCityPlaceholder')}
              placeholderTextColor={Colors.panchangTextMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={{ fontSize: 14, color: Colors.panchangTextMuted, paddingHorizontal: 6 }}>✖</Text>
              </TouchableOpacity>
            )}
          </View>

          {isSearching && (
            <View style={styles.searchingRow}>
              <ActivityIndicator size="small" color={Colors.panchangGold} />
              <Text style={styles.searchingText}>{t('searchingLocations')}</Text>
            </View>
          )}

          <Text style={styles.sectionHeaderLabel}>
            {isQueryTyped
              ? searchResults.length > 0
                ? `${t('searchResultsHeader')} (${searchResults.length})`
                : t('matchingCitiesHeader')
              : t('popularCitiesHeader')}
          </Text>

          {/* Global Search Results List or Default Cities List */}
          {isQueryTyped && searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => `${item.cityName}_${item.lat}_${item.lng}_${index}`}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cityItem}
                  onPress={() => handleSelectGeocoded(item)}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cityItemName}>📍 {item.cityName}</Text>
                    <Text style={styles.cityItemSub} numberOfLines={2}>
                      {item.displayName}
                    </Text>
                    <Text style={styles.latLngTag}>
                      Lat: {item.lat.toFixed(4)}° | Lng: {item.lng.toFixed(4)}°
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <FlatList
              data={filteredDefaultCities}
              keyExtractor={(item, index) => `${item.name}_${index}`}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = !isGpsActive && item.name === selectedCity.name;
                return (
                  <TouchableOpacity
                    style={[styles.cityItem, isSelected && styles.cityItemActive]}
                    onPress={() => handleSelectPredefinedCity(item)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.cityItemName, isSelected && styles.cityItemNameActive]}>
                        📍 {language === 'hi' ? (item.hindiName || item.name) : item.name}
                      </Text>
                      <Text style={[styles.cityItemSub, isSelected && styles.cityItemSubActive]}>
                        {item.stateCountry}
                      </Text>
                      <Text style={[styles.latLngTag, isSelected && styles.latLngTagActive]}>
                        Lat: {item.latitude.toFixed(4)}° | Lng: {item.longitude.toFixed(4)}°
                      </Text>
                    </View>
                    {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(23, 2, 5, 0.72)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.panchangCream,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: Colors.panchangGold,
    paddingHorizontal: 16,
    maxHeight: '85%',
  },
  sheetDragBar: {
    width: 44,
    height: 4.5,
    backgroundColor: Colors.panchangGold,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.panchangBorderLight,
  },
  modalTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 20,
    color: Colors.panchangMaroon,
    letterSpacing: 0.3,
  },
  modalSub: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11.5,
    color: Colors.panchangTextMuted,
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: '#F3EDE6',
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: Colors.panchangBorderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
    color: Colors.panchangMaroon,
  },
  gpsDetectBtn: {
    backgroundColor: '#FFFDF6',
    borderWidth: 1.5,
    borderColor: Colors.panchangGold,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  gpsDetectBtnActive: {
    backgroundColor: Colors.panchangMaroon,
    borderColor: Colors.panchangGold,
  },
  gpsRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpsIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  gpsBtnTitle: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
    color: Colors.panchangMaroon,
  },
  gpsBtnTitleActive: {
    color: Colors.panchangGold,
  },
  gpsBtnSub: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11,
    color: Colors.panchangTextMuted,
    marginTop: 1,
  },
  gpsBtnTextActive: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
    color: Colors.panchangGoldLight,
  },
  gpsBtnSubActive: {
    color: Colors.panchangGoldLight,
  },
  checkIconLight: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 18,
    color: Colors.panchangGold,
    marginLeft: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.panchangGold,
    paddingHorizontal: 12,
    marginBottom: 10,
    height: 44,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.jakartaRegular,
    fontSize: 13,
    color: Colors.panchangTextMain,
  },
  searchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    marginBottom: 6,
  },
  searchingText: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 12,
    color: Colors.panchangMaroon,
    marginLeft: 8,
  },
  sectionHeaderLabel: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10.5,
    color: Colors.panchangTextMuted,
    marginBottom: 8,
    letterSpacing: 0.8,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.panchangBorderLight,
  },
  cityItemActive: {
    backgroundColor: Colors.panchangMaroon,
    borderColor: Colors.panchangGold,
    borderWidth: 1.5,
  },
  cityItemName: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 16.5,
    color: Colors.panchangMaroon,
  },
  cityItemNameActive: {
    color: Colors.panchangGoldLight,
  },
  cityItemSub: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11.5,
    color: Colors.panchangTextMuted,
    marginTop: 2,
  },
  cityItemSubActive: {
    color: Colors.panchangBorderLight,
  },
  latLngTag: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 10.5,
    color: Colors.panchangGoldDark,
    marginTop: 3,
  },
  latLngTagActive: {
    color: Colors.panchangGold,
  },
  checkIcon: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 18,
    color: Colors.panchangGold,
    marginLeft: 8,
  },
});
