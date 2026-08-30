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
import { useCalendarSystem, CalendarSystem } from '../context/CalendarContext';

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
  const { calendarSystem, setCalendarSystem } = useCalendarSystem();
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const [useAmanta, setUseAmanta] = useState(false); // false = Purnimanta (North India default)
  const [useGps, setUseGps] = useState(selectedCity.stateCountry === 'GPS Location');
  const [useChoghadiyaNotif, setUseChoghadiyaNotif] = useState(false);

  // Purnima & Amavasya Reminder States
  const [purnimaNotif, setPurnimaNotif] = useState(true);
  const [amavasyaNotif, setAmavasyaNotif] = useState(true);
  const [reminderDays, setReminderDays] = useState<number>(1); // 0 (same day), 1, 2, or 5 days before

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(CHOGHADIYA_NOTIF_KEY);
      if (stored === 'true') {
        setUseChoghadiyaNotif(true);
      }
      const pNotif = await AsyncStorage.getItem('PURNIMA_REMINDER_ENABLED');
      if (pNotif !== null) setPurnimaNotif(pNotif === 'true');
      const aNotif = await AsyncStorage.getItem('AMAVASYA_REMINDER_ENABLED');
      if (aNotif !== null) setAmavasyaNotif(aNotif === 'true');
      const rDays = await AsyncStorage.getItem('MOON_REMINDER_TIMING_DAYS');
      if (rDays !== null) setReminderDays(parseInt(rDays, 10));
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

  const handlePurnimaToggle = async (val: boolean) => {
    setPurnimaNotif(val);
    await AsyncStorage.setItem('PURNIMA_REMINDER_ENABLED', val ? 'true' : 'false');
  };

  const handleAmavasyaToggle = async (val: boolean) => {
    setAmavasyaNotif(val);
    await AsyncStorage.setItem('AMAVASYA_REMINDER_ENABLED', val ? 'true' : 'false');
  };

  const handleSelectTimingDays = async (days: number) => {
    setReminderDays(days);
    await AsyncStorage.setItem('MOON_REMINDER_TIMING_DAYS', days.toString());
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
          try {
            const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (geocode && geocode.length > 0) {
              const place = geocode[0];
              cityName = place.city || place.subregion || place.district || 'GPS Location';
            }
          } catch (err) {
            console.log('Reverse geocode error:', err);
          }

          const gpsCity: CityLocation = {
            name: cityName,
            hindiName: 'जीपीएस स्थान',
            stateCountry: 'GPS Location',
            latitude,
            longitude,
            timeZoneId: 'Asia/Kolkata'
          };
          onSelectCity(gpsCity);
          await AsyncStorage.setItem('SOULRISE_SELECTED_CITY', JSON.stringify(gpsCity));
          await AsyncStorage.setItem('SOULRISE_USE_GPS', 'true');
        } else {
          setUseGps(false);
        }
      } catch (e) {
        onSelectCity(DEFAULT_CITIES[0]);
        setUseGps(false);
      }
    } else {
      onSelectCity(DEFAULT_CITIES[0]);
      await AsyncStorage.setItem('SOULRISE_USE_GPS', 'false');
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

        {/* Calendar System Preference Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📅 Calendar System Preference</Text>
          <Text style={styles.cardSubTitle}>Choose your default calendar view (persists across app restarts):</Text>

          <View style={styles.calSystemList}>
            <TouchableOpacity
              style={[styles.calSystemItem, calendarSystem === 'HINDU' && styles.calSystemItemActive]}
              onPress={() => setCalendarSystem('HINDU')}
              activeOpacity={0.8}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.calSystemTitle, calendarSystem === 'HINDU' && styles.calSystemTitleActive]}>
                  🕉️ Hindu Calendar (Vikram Samvat)
                </Text>
                <Text style={styles.calSystemDesc}>Standard Vedic Lunar/Solar Panchang with Tithis & Nakshatras</Text>
              </View>
              {calendarSystem === 'HINDU' && <Text style={styles.checkIcon}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.calSystemItem, calendarSystem === 'JAIN' && styles.calSystemItemActive]}
              onPress={() => setCalendarSystem('JAIN')}
              activeOpacity={0.8}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.calSystemTitle, calendarSystem === 'JAIN' && styles.calSystemTitleActive]}>
                  🪔 Jain Calendar (Vira Nirvana Samvat)
                </Text>
                <Text style={styles.calSystemDesc}>Sacred Jain Parva Tithis (Aastham, Chaudas), Pachkhan & Festivals</Text>
              </View>
              {calendarSystem === 'JAIN' && <Text style={styles.checkIcon}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.calSystemItem, calendarSystem === 'GLOBAL' && styles.calSystemItemActive]}
              onPress={() => setCalendarSystem('GLOBAL')}
              activeOpacity={0.8}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.calSystemTitle, calendarSystem === 'GLOBAL' && styles.calSystemTitleActive]}>
                  🌍 Global Gregorian Solar Calendar
                </Text>
                <Text style={styles.calSystemDesc}>Standard Western Solar Dates & International Holidays</Text>
              </View>
              {calendarSystem === 'GLOBAL' && <Text style={styles.checkIcon}>✓</Text>}
            </TouchableOpacity>
          </View>
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
              trackColor={{ false: '#D0D0D0', true: Colors.maroon }}
              thumbColor={useGps ? '#FFD700' : '#F4F3F4'}
            />
          </View>
        </View>

        {/* Live Choghadiya Notification Bar Setting */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⏰ Live Choghadiya Status Bar Widget</Text>

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Pin Live Choghadiya to Status Bar</Text>
              <Text style={styles.switchSub}>Auto-updates current auspicious muhurt every hour in notifications</Text>
            </View>
            <Switch
              value={useChoghadiyaNotif}
              onValueChange={handleChoghadiyaToggle}
              trackColor={{ false: '#D0D0D0', true: Colors.maroon }}
              thumbColor={useChoghadiyaNotif ? '#FFD700' : '#F4F3F4'}
            />
          </View>
        </View>

        {/* Purnima & Amavasya Push Notification Reminders */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔔 Purnima & Amavasya Reminders</Text>

          {/* Purnima Switch */}
          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>🌕 Purnima (Full Moon) Reminder</Text>
              <Text style={styles.switchSub}>Get notified for Satyanarayan Puja & Fasting</Text>
            </View>
            <Switch
              value={purnimaNotif}
              onValueChange={handlePurnimaToggle}
              trackColor={{ false: '#D0D0D0', true: Colors.maroon }}
              thumbColor={purnimaNotif ? '#FFD700' : '#F4F3F4'}
            />
          </View>

          {/* Amavasya Switch */}
          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>🌑 Amavasya (New Moon) Reminder</Text>
              <Text style={styles.switchSub}>Get notified for Pitru Tarpana & Ancestral Puja</Text>
            </View>
            <Switch
              value={amavasyaNotif}
              onValueChange={handleAmavasyaToggle}
              trackColor={{ false: '#D0D0D0', true: Colors.maroon }}
              thumbColor={amavasyaNotif ? '#FFD700' : '#F4F3F4'}
            />
          </View>

          {/* Timing Days Picker */}
          <Text style={[styles.switchLabel, { marginTop: 12, marginBottom: 6 }]}>
            ⏰ Notification Advance Timing:
          </Text>
          <View style={styles.timingDaysRow}>
            {[
              { label: 'Same Day', days: 0 },
              { label: '1 Day Before', days: 1 },
              { label: '2 Days Before', days: 2 },
              { label: '5 Days Before', days: 5 },
            ].map(item => (
              <TouchableOpacity
                key={item.days}
                style={[styles.dayPill, reminderDays === item.days && styles.dayPillActive]}
                onPress={() => handleSelectTimingDays(item.days)}
              >
                <Text style={[styles.dayPillText, reminderDays === item.days && styles.dayPillTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* City Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('activeLocation')}</Text>
              <TouchableOpacity onPress={onCloseCityModal} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={DEFAULT_CITIES}
              keyExtractor={item => item.name}
              renderItem={({ item }) => {
                const isSelected = item.name === selectedCity.name;
                return (
                  <TouchableOpacity
                    style={[styles.cityItem, isSelected && styles.cityItemActive]}
                    onPress={async () => {
                      onSelectCity(item);
                      setUseGps(false);
                      await AsyncStorage.setItem('SOULRISE_SELECTED_CITY', JSON.stringify(item));
                      await AsyncStorage.setItem('SOULRISE_USE_GPS', 'false');
                      onCloseCityModal();
                    }}
                  >
                    <View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBg,
  },
  header: {
    backgroundColor: Colors.maroon,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
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
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 8,
  },
  cardSubTitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  calSystemList: {
    gap: 8,
  },
  calSystemItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 10,
  },
  calSystemItemActive: {
    backgroundColor: '#FFF3E0',
    borderColor: Colors.maroon,
    borderWidth: 1.5,
  },
  calSystemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  calSystemTitleActive: {
    color: Colors.maroon,
  },
  calSystemDesc: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  citySelectorBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
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
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  citySubText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  changeBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginLeft: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  switchTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  switchLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  switchSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  timingDaysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  dayPill: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dayPillActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  dayPillText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  dayPillTextActive: {
    color: '#FFD700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.creamBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    color: Colors.textSecondary,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cityItemActive: {
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
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  checkIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
});
