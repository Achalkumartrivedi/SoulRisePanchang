import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import * as Location from 'expo-location';
import { Colors } from '../theme/colors';
import { CityLocation, PanchangDayData } from '../types/panchang';
import { DEFAULT_CITIES } from '../data/cities';
import { calculatePanchang } from '../engine/panchangEngine';

import { HomeScreen } from '../screens/HomeScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { FestivalsScreen } from '../screens/FestivalsScreen';
import { RashiphalScreen } from '../screens/RashiphalScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

type TabName = 'TODAY' | 'CALENDAR' | 'FESTIVALS' | 'RASHIPHAL' | 'SETTINGS';

export const AppNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('TODAY');
  const [selectedCity, setSelectedCity] = useState<CityLocation>(DEFAULT_CITIES[0]); // New Delhi
  const [currentDateIso, setCurrentDateIso] = useState<string>(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
    const day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
    return `${y}-${m}-${day}`;
  });
  const [isCityModalVisible, setIsCityModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const { latitude, longitude } = loc.coords;

          let cityName = 'Current Location';
          let hindiName = 'वर्तमान स्थान';

          try {
            const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (geocode && geocode.length > 0) {
              const place = geocode[0];
              const name = place.city || place.subregion || place.region || 'Current Location';
              cityName = `${name} (Current GPS)`;
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
        }
      } catch (e) {
        console.log('GPS Location Error:', e);
      }
    })();
  }, []);

  const currentDateObj = new Date(currentDateIso + 'T00:00:00');
  const panchangData: PanchangDayData = calculatePanchang(currentDateObj, selectedCity);

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
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

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

        {activeTab === 'RASHIPHAL' && <RashiphalScreen />}

        {activeTab === 'SETTINGS' && (
          <SettingsScreen
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            isModalVisible={isCityModalVisible}
            onOpenCityModal={() => setIsCityModalVisible(true)}
            onCloseCityModal={() => setIsCityModalVisible(false)}
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

          <Text style={[styles.tabLabel, activeTab === 'TODAY' && styles.tabLabelActive]}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'CALENDAR' && styles.tabItemActive]}
          onPress={() => setActiveTab('CALENDAR')}
        >
          <Text style={styles.tabIcon}>📅</Text>
          <Text style={[styles.tabLabel, activeTab === 'CALENDAR' && styles.tabLabelActive]}>Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'FESTIVALS' && styles.tabItemActive]}
          onPress={() => setActiveTab('FESTIVALS')}
        >
          <Text style={styles.tabIcon}>🚩</Text>
          <Text style={[styles.tabLabel, activeTab === 'FESTIVALS' && styles.tabLabelActive]}>Festivals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'RASHIPHAL' && styles.tabItemActive]}
          onPress={() => setActiveTab('RASHIPHAL')}
        >
          <Text style={styles.tabIcon}>♈</Text>
          <Text style={[styles.tabLabel, activeTab === 'RASHIPHAL' && styles.tabLabelActive]}>Horoscope</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'SETTINGS' && styles.tabItemActive]}
          onPress={() => setActiveTab('SETTINGS')}
        >
          <Text style={styles.tabIcon}>⚙️</Text>
          <Text style={[styles.tabLabel, activeTab === 'SETTINGS' && styles.tabLabelActive]}>Settings</Text>
        </TouchableOpacity>
      </View>
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
