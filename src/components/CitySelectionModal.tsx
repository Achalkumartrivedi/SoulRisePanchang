import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';
import { CityLocation } from '../types/panchang';
import { DEFAULT_CITIES } from '../data/cities';
import { useLanguage } from '../context/LanguageContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CITY_STORAGE_KEY = 'SOULRISE_SELECTED_CITY';
const GPS_STORAGE_KEY = 'SOULRISE_USE_GPS';

interface CitySelectionModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
}

export const CitySelectionModal: React.FC<CitySelectionModalProps> = ({
  visible,
  onClose,
  selectedCity,
  onSelectCity
}) => {
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom + 12, 24);

  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  const isGpsActive = selectedCity.stateCountry === 'GPS Location' || selectedCity.name.includes('(GPS)');

  const filteredCities = DEFAULT_CITIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.hindiName.includes(searchQuery) ||
    c.stateCountry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDetectGps = async () => {
    setIsDetectingGps(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '📍 Permission Required / स्थान अनुमति आवश्यक',
          'Please allow location permission in your device settings to auto-detect your current GPS location.'
        );
        setIsDetectingGps(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      }).catch(async () => {
        return await Location.getLastKnownPositionAsync();
      });

      if (!loc) {
        Alert.alert(
          '⚠️ Location Signal Weak',
          'Unable to acquire GPS fix. Please ensure location/GPS is toggled ON in your phone status bar.'
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
          cityName = `${foundName} (GPS)`;
          hindiName = place.city || place.district || place.region || 'वर्तमान स्थान';
        }
      } catch (err) {
        console.log('Reverse geocode error:', err);
      }

      const userGpsCity: CityLocation = {
        name: cityName,
        hindiName,
        stateCountry: 'GPS Location',
        latitude,
        longitude,
        timeZoneId: 'Asia/Kolkata'
      };

      onSelectCity(userGpsCity);
      await AsyncStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(userGpsCity));
      await AsyncStorage.setItem(GPS_STORAGE_KEY, 'true');
      onClose();
    } catch (e: any) {
      console.log('GPS detection error:', e);
      Alert.alert('⚠️ GPS Error', e?.message || 'Failed to detect current location.');
    } finally {
      setIsDetectingGps(false);
    }
  };

  const handleSelectPredefinedCity = async (item: CityLocation) => {
    onSelectCity(item);
    try {
      await AsyncStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(item));
      await AsyncStorage.setItem(GPS_STORAGE_KEY, 'false');
    } catch (e) {
      console.log('Save city error:', e);
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { paddingTop: 16, paddingBottom: bottomPadding }]}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>📍 {t('activeLocation') || 'Select Location'}</Text>
              <Text style={styles.modalSub}>
                {language === 'hi' || language === 'hinglish' ? 'पंचांग व त्योहार हेतु अपना स्थान चुनें' : 'Panchang & Sunrise timed to your location'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.8}>
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
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.gpsBtnTextActive}>  📡 Detecting GPS location...</Text>
              </View>
            ) : (
              <View style={styles.gpsRowCenter}>
                <Text style={styles.gpsIcon}>🎯</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.gpsBtnTitle, isGpsActive && styles.gpsBtnTextActive]}>
                    Use Current GPS Location (वर्तमान स्थान)
                  </Text>
                  <Text style={[styles.gpsBtnSub, isGpsActive && styles.gpsBtnSubActive]}>
                    {isGpsActive ? `Active: ${selectedCity.name}` : 'Auto-detect exact latitude & longitude via device GPS'}
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
              placeholder="Search city, state or country..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={{ fontSize: 14, color: Colors.textMuted, paddingHorizontal: 6 }}>✖</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.sectionHeaderLabel}>POPULAR CITIES & SACRED HUBS (प्रमुख शहर)</Text>

          {/* Predefined Cities List */}
          <FlatList
            data={filteredCities}
            keyExtractor={item => item.name}
            showsVerticalScrollIndicator={true}
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
                      {item.name} ({item.hindiName})
                    </Text>
                    <Text style={styles.cityItemSub}>{item.stateCountry}</Text>
                  </View>
                  {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.creamBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  modalSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: '#E0E0E0',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555555',
  },
  gpsDetectBtn: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1.5,
    borderColor: '#FFB300',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  gpsDetectBtnActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
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
    fontSize: 13,
    fontWeight: 'bold',
    color: '#B71C1C',
  },
  gpsBtnSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  gpsBtnTextActive: {
    color: '#FFD700',
  },
  gpsBtnSubActive: {
    color: '#FFFFFF',
  },
  checkIconLight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    marginBottom: 12,
    height: 42,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  sectionHeaderLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textMuted,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cityItemActive: {
    backgroundColor: '#FFF3E0',
    borderColor: Colors.maroon,
  },
  cityItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cityItemNameActive: {
    color: Colors.maroon,
    fontWeight: 'bold',
  },
  cityItemSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  checkIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
});
