import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';
import { CityLocation, PanchangDayData } from '../types/panchang';
import { DEFAULT_CITIES } from '../data/cities';
import { calculatePanchang } from '../engine/panchangEngine';
import { updateLiveChoghadiyaNotification } from '../utils/choghadiyaNotifier';

import { HomeScreen } from '../screens/HomeScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { FestivalsScreen } from '../screens/FestivalsScreen';
import { RashiphalScreen } from '../screens/RashiphalScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { RemindersScreen } from '../screens/RemindersScreen';

import { LanguageSelectionModal } from '../components/LanguageSelectionModal';
import { useLanguage } from '../context/LanguageContext';
import { useCalendarSystem } from '../context/CalendarContext';

type TabName = 'TODAY' | 'CALENDAR' | 'FESTIVALS' | 'REMINDERS' | 'RASHIPHAL' | 'SETTINGS';

const CITY_STORAGE_KEY = 'SOULRISE_SELECTED_CITY';
const GPS_STORAGE_KEY = 'SOULRISE_USE_GPS';

export const AppNavigator: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabName>('TODAY');
  const [selectedCity, setSelectedCity] = useState<CityLocation>(DEFAULT_CITIES[0]); // Default New Delhi
  const [currentDateIso, setCurrentDateIso] = useState<string>(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
    const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
    return `${y}-${m}-${day}`;
  });
  const [isCityModalVisible, setIsCityModalVisible] = useState(false);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const savedCityJson = await AsyncStorage.getItem(CITY_STORAGE_KEY);
        const savedUseGps = await AsyncStorage.getItem(GPS_STORAGE_KEY);

        // If user manually selected a custom city in settings, preserve it!
        if (savedCityJson && savedUseGps === 'false') {
          const city = JSON.parse(savedCityJson);
          setSelectedCity(city);
          return;
        }

        // Otherwise request location permission on launch
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
              const name = place.city || place.subregion || place.region || 'Current Location';
              cityName = `${name} (GPS)`;
              hindiName = name;
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

          setSelectedCity(userGpsCity);
          await AsyncStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(userGpsCity));
          await AsyncStorage.setItem(GPS_STORAGE_KEY, 'true');
        } else if (savedCityJson) {
          setSelectedCity(JSON.parse(savedCityJson));
        }
      } catch (e) {
        console.log('App launch location init error:', e);
      }
    })();
  }, []);

  const { lunarSystem } = useCalendarSystem();
  const currentDateObj = new Date(currentDateIso + 'T00:00:00');
  const panchangData: PanchangDayData = calculatePanchang(currentDateObj, selectedCity, lunarSystem);

  const handleSelectCity = async (city: CityLocation) => {
    setSelectedCity(city);
    setIsCityModalVisible(false);
    try {
      await AsyncStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(city));
      await AsyncStorage.setItem(GPS_STORAGE_KEY, city.stateCountry === 'GPS Location' ? 'true' : 'false');
      await updateLiveChoghadiyaNotification(city);
    } catch (e) {
      console.log('Save city error:', e);
    }
  };

  const handlePrevDay = () => {
    const d = new Date(currentDateIso + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    setCurrentDateIso(formatDateIso(d));
  };

  const handleNextDay = () => {
    const d = new Date(currentDateIso + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    setCurrentDateIso(formatDateIso(d));
  };

  const handleToday = () => {
    const d = new Date();
    setCurrentDateIso(formatDateIso(d));
  };

  const handleSelectFestivalDate = (dateIso: string) => {
    setCurrentDateIso(dateIso);
    setActiveTab('TODAY');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.maroon} />

      <View style={styles.contentArea}>
        {activeTab === 'TODAY' && (
          <HomeScreen
            panchang={panchangData}
            currentDateIso={currentDateIso}
            selectedCity={selectedCity}
            onOpenCityPicker={() => setIsCityModalVisible(true)}
            onPrevDay={handlePrevDay}
            onNextDay={handleNextDay}
            onToday={handleToday}
            onNavigateToFestivals={() => setActiveTab('FESTIVALS')}
          />
        )}

        {activeTab === 'CALENDAR' && (
          <CalendarScreen
            selectedCity={selectedCity}
            onSelectDate={(dateIso) => {
              setCurrentDateIso(dateIso);
              setActiveTab('TODAY');
            }}
          />
        )}

        {activeTab === 'FESTIVALS' && (
          <FestivalsScreen onSelectFestivalDate={handleSelectFestivalDate} />
        )}

        {activeTab === 'REMINDERS' && <RemindersScreen />}

        {activeTab === 'RASHIPHAL' && <RashiphalScreen />}

        {activeTab === 'SETTINGS' && (
          <SettingsScreen
            selectedCity={selectedCity}
            onSelectCity={handleSelectCity}
            isModalVisible={isCityModalVisible}
            onOpenCityModal={() => setIsCityModalVisible(true)}
            onCloseCityModal={() => setIsCityModalVisible(false)}
            onOpenLanguageModal={() => setIsLangModalVisible(true)}
          />
        )}
      </View>

      {/* Custom Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'TODAY' && styles.tabItemActive]}
          onPress={() => setActiveTab('TODAY')}
        >
          <Text style={styles.tabIcon}>☀️</Text>
          <Text style={[styles.tabLabel, activeTab === 'TODAY' && styles.tabLabelActive]} numberOfLines={1} adjustsFontSizeToFit>{t('today')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'CALENDAR' && styles.tabItemActive]}
          onPress={() => setActiveTab('CALENDAR')}
        >
          <Text style={styles.tabIcon}>📅</Text>
          <Text style={[styles.tabLabel, activeTab === 'CALENDAR' && styles.tabLabelActive]} numberOfLines={1} adjustsFontSizeToFit>{t('calendar')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'FESTIVALS' && styles.tabItemActive]}
          onPress={() => setActiveTab('FESTIVALS')}
        >
          <Text style={styles.tabIcon}>🚩</Text>
          <Text style={[styles.tabLabel, activeTab === 'FESTIVALS' && styles.tabLabelActive]} numberOfLines={1} adjustsFontSizeToFit>{t('festivals')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'REMINDERS' && styles.tabItemActive]}
          onPress={() => setActiveTab('REMINDERS')}
        >
          <Text style={styles.tabIcon}>⏰</Text>
          <Text style={[styles.tabLabel, activeTab === 'REMINDERS' && styles.tabLabelActive]} numberOfLines={1} adjustsFontSizeToFit>Reminders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'RASHIPHAL' && styles.tabItemActive]}
          onPress={() => setActiveTab('RASHIPHAL')}
        >
          <Text style={styles.tabIcon}>♈</Text>
          <Text style={[styles.tabLabel, activeTab === 'RASHIPHAL' && styles.tabLabelActive]} numberOfLines={1} adjustsFontSizeToFit>{t('horoscope')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'SETTINGS' && styles.tabItemActive]}
          onPress={() => setActiveTab('SETTINGS')}
        >
          <Text style={styles.tabIcon}>⚙️</Text>
          <Text style={[styles.tabLabel, activeTab === 'SETTINGS' && styles.tabLabelActive]} numberOfLines={1} adjustsFontSizeToFit>{t('settings')}</Text>
        </TouchableOpacity>
      </View>

      {/* Language Selection Modal triggered from Settings */}
      <LanguageSelectionModal
        visible={isLangModalVisible}
        onClose={() => setIsLangModalVisible(false)}
      />
    </SafeAreaView>
  );
};

function formatDateIso(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
  const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
  return `${y}-${m}-${day}`;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  contentArea: {
    flex: 1,
    backgroundColor: Colors.creamBg,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 6,
    paddingBottom: 8,
    elevation: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabItemActive: {
    transform: [{ scale: 1.05 }],
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.maroon,
    fontWeight: 'bold',
  },
});
