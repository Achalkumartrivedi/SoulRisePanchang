import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, Switch, Alert } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';
import { CityLocation } from '../types/panchang';
import { DEFAULT_CITIES } from '../data/cities';
import {
  CHOGHADIYA_NOTIF_KEY,
  updateLiveChoghadiyaNotification,
  cancelChoghadiyaNotification
} from '../utils/choghadiyaNotifier';

import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../types/language';

interface SettingsScreenProps {
  selectedCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  isModalVisible: boolean;
  onCloseCityModal: () => void;
  onOpenCityModal: () => void;
  onOpenLanguageModal?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  selectedCity,
  onSelectCity,
  isModalVisible,
  onCloseCityModal,
  onOpenCityModal,
  onOpenLanguageModal,
}) => {
  const { language, t } = useLanguage();
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const [useAmanta, setUseAmanta] = useState(false); // false = Purnimanta (North India default)
  const [useGps, setUseGps] = useState(selectedCity.stateCountry === 'GPS Location');
  const [useChoghadiyaNotif, setUseChoghadiyaNotif] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(CHOGHADIYA_NOTIF_KEY);
      if (stored === 'true') {
        setUseChoghadiyaNotif(true);
      }
    })();
  }, []);

  const handleChoghadiyaToggle = async (val: boolean) => {
    setUseChoghadiyaNotif(val);
    await AsyncStorage.setItem(CHOGHADIYA_NOTIF_KEY, val ? 'true' : 'false');
    if (val) {
      await updateLiveChoghadiyaNotification(selectedCity);
      Alert.alert('⏰ Live Choghadiya Active', 'Pinned notification started in your status bar!');
    } else {
      await cancelChoghadiyaNotification();
    }
  };

  const handleGpsToggle = async (val: boolean) => {
    setUseGps(val);
    if (val) {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let loc = await Location.getLastKnownPositionAsync();
          if (!loc) {
            loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
          }

          const latitude = loc ? loc.coords.latitude : 28.6139;
          const longitude = loc ? loc.coords.longitude : 77.2090;

          let cityName = 'GPS Location';
          let hindiName = 'वर्तमान स्थान';

          try {
            const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (geocode && geocode.length > 0) {
              const place = geocode[0];
              const name = place.city || place.subregion || place.region || 'GPS Location';
              cityName = `${name} (GPS)`;
              hindiName = name;
            }
          } catch (err) {}

          onSelectCity({
            name: cityName,
            hindiName,
            stateCountry: 'GPS Location',
            latitude,
            longitude,
            timeZoneId: 'Asia/Kolkata'
          });
        } else {
          setUseGps(false);
        }
      } catch (e) {
        onSelectCity(DEFAULT_CITIES[0]);
        setUseGps(false);
      }
    } else {
      onSelectCity(DEFAULT_CITIES[0]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1} adjustsFontSizeToFit>{t('settingsTitle')}</Text>
        <Text style={styles.headerSubtitle} numberOfLines={2} adjustsFontSizeToFit>{t('settingsSub')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* App Language Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('appLanguage')}</Text>

          <TouchableOpacity style={styles.citySelectorBox} onPress={onOpenLanguageModal} activeOpacity={0.8}>
            <View style={styles.cityLeft}>
              <Text style={{ fontSize: 24, marginRight: 12 }}>{currentLangObj.flag}</Text>
              <View>
                <Text style={styles.cityNameText}>{currentLangObj.name}</Text>
                <Text style={styles.citySubText}>{currentLangObj.nativeName}</Text>
              </View>
            </View>
            <Text style={styles.changeBtnText}>Select ➔</Text>
          </TouchableOpacity>
        </View>

        {/* Active Location Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('activeLocation')}</Text>

          <TouchableOpacity style={styles.citySelectorBox} onPress={onOpenCityModal} activeOpacity={0.8}>
            <View style={styles.cityLeft}>
              <Text style={styles.cityPinIcon}>📍</Text>
              <View>
                <Text style={styles.cityNameText}>{selectedCity.name} ({selectedCity.hindiName})</Text>
                <Text style={styles.citySubText}>{selectedCity.stateCountry} • Lat: {selectedCity.latitude}, Lon: {selectedCity.longitude}</Text>
              </View>
            </View>
            <Text style={styles.changeBtnText}>Change ➔</Text>
          </TouchableOpacity>

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Auto Detect Location (GPS)</Text>
              <Text style={styles.switchSub}>Use device coordinates for high precision sunrise</Text>
            </View>
            <Switch
              value={useGps}
              onValueChange={handleGpsToggle}
              trackColor={{ false: '#767577', true: Colors.primary }}
              thumbColor={useGps ? Colors.accentGold : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Timings & Persistent Notifications */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⏰ Timings & Persistent Notifications</Text>

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Choghadiya Status Bar Notification</Text>
              <Text style={styles.switchSub}>Show pinned ongoing notification with current & next 3 Choghadiyas (Auspicious 🟩 / Inauspicious 🟥)</Text>
            </View>
            <Switch
              value={useChoghadiyaNotif}
              onValueChange={handleChoghadiyaToggle}
              trackColor={{ false: '#767577', true: Colors.primary }}
              thumbColor={useChoghadiyaNotif ? Colors.accentGold : '#f4f3f4'}
            />
          </View>
          <Text style={styles.infoHint}>
            Status: {useChoghadiyaNotif ? '🟢 Pinned Live Status Active in Android Notification Bar' : '⚪ Notification Disabled'}
          </Text>
        </View>

        {/* Calculation System */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌙 Lunar Month System (मास पद्धति)</Text>

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Amanta System (अमान्त)</Text>
              <Text style={styles.switchSub}>Month ends on Amavasya (South & West India standard)</Text>
            </View>
            <Switch
              value={useAmanta}
              onValueChange={setUseAmanta}
              trackColor={{ false: '#767577', true: Colors.primary }}
              thumbColor={useAmanta ? Colors.accentGold : '#f4f3f4'}
            />
          </View>
          <Text style={styles.infoHint}>
            Current System: {useAmanta ? 'Amanta (New Moon to New Moon)' : 'Purnimanta (Full Moon to Full Moon - North India)'}
          </Text>
        </View>

        {/* About App */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🕉️ About SoulRise Panchang</Text>
          <Text style={styles.aboutText}>
            SoulRise Panchang provides highly accurate, offline astronomical Hindu calendar calculations including Tithi, Nakshatra, Yoga, Karana, Vaara, Abhijit Muhurat, Rahu Kalam, Choghadiya, and Hindu Festivals.
          </Text>

          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Version</Text>
            <Text style={styles.versionValue}>1.0.0 (Expo React Native)</Text>
          </View>
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Calculation Engine</Text>
            <Text style={styles.versionValue}>Offline Meeus Solar/Lunar Precision Math</Text>
          </View>
        </View>
      </ScrollView>

      {/* City Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={onCloseCityModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Select City</Text>
              <TouchableOpacity onPress={onCloseCityModal}>
                <Text style={styles.closeText}>Done</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={DEFAULT_CITIES}
              keyExtractor={item => item.name}
              renderItem={({ item }) => {
                const isSelected = item.name === selectedCity.name;
                return (
                  <TouchableOpacity
                    style={[styles.cityItem, isSelected && styles.cityItemSelected]}
                    onPress={() => {
                      onSelectCity(item);
                      onCloseCityModal();
                    }}
                  >
                    <Text style={styles.cityPin}>📍</Text>
                    <View style={styles.cityItemTextContainer}>
                      <Text style={[styles.cityItemName, isSelected && styles.cityItemNameSelected]}>
                        {item.name} ({item.hindiName})
                      </Text>
                      <Text style={styles.cityItemCountry}>{item.stateCountry}</Text>
                    </View>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBg,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.primaryLight,
    marginTop: 2,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 12,
  },
  citySelectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.creamBg,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    marginBottom: 12,
  },
  cityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cityPinIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  cityNameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  citySubText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  changeBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  switchTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  switchSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  infoHint: {
    fontSize: 11,
    color: Colors.primaryDark,
    fontWeight: '600',
    marginTop: 8,
    backgroundColor: Colors.creamBg,
    padding: 8,
    borderRadius: 8,
  },
  aboutText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  versionLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  versionValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.cardBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  closeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cityItemSelected: {
    backgroundColor: '#FFF8E1',
  },
  cityPin: {
    fontSize: 16,
    marginRight: 12,
  },
  cityItemTextContainer: {
    flex: 1,
  },
  cityItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cityItemNameSelected: {
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  cityItemCountry: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  checkmark: {
    color: Colors.auspiciousGreen,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
