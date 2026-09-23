import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert, AppState, AppStateStatus, Linking } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';
import { CityLocation, PanchangDayData } from '../types/panchang';
import { DEFAULT_CITIES } from '../data/cities';
import { calculatePanchang } from '../engine/panchangEngine';
import { updateLiveChoghadiyaNotification } from '../utils/choghadiyaNotifier';
import { getStoredReminders } from '../engine/reminderStorage';
import { rescheduleAllReminders } from '../utils/reminderScheduler';

import { HomeScreen } from '../screens/HomeScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { FestivalsScreen } from '../screens/FestivalsScreen';
import { RashiphalScreen } from '../screens/RashiphalScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { RemindersScreen } from '../screens/RemindersScreen';
import { LanguageSelectionScreen } from '../screens/LanguageSelectionScreen';
import { OnboardingAuthScreen } from '../screens/OnboardingAuthScreen';

import { LanguageSelectionModal } from '../components/LanguageSelectionModal';
import { CitySelectionModal } from '../components/CitySelectionModal';
import { useLanguage } from '../context/LanguageContext';
import { useCalendarSystem } from '../context/CalendarContext';
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabName = 'TODAY' | 'CALENDAR' | 'FESTIVALS' | 'REMINDERS' | 'RASHIPHAL' | 'SETTINGS';

const CITY_STORAGE_KEY = 'SOULRISE_SELECTED_CITY';
const GPS_STORAGE_KEY = 'SOULRISE_USE_GPS';
const FIRST_LAUNCH_LANG_KEY = '@soulrise_lang_first_launch_done';
const FIRST_LAUNCH_AUTH_KEY = '@soulrise_onboarding_auth_done';

export const AppNavigator: React.FC = () => {
  const { t } = useLanguage();
  const { user, isLoading: isAuthLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const tabBarBottomPadding = Math.max(insets.bottom, 16) + 8;
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
  const [showFirstLaunchLangScreen, setShowFirstLaunchLangScreen] = useState<boolean | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);

  const selectedCityRef = useRef<CityLocation>(DEFAULT_CITIES[0]);
  const isSyncingGpsRef = useRef(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Keep selectedCityRef in sync with state
  useEffect(() => {
    selectedCityRef.current = selectedCity;
  }, [selectedCity]);

  // Robust GPS location fetcher (fast cached fix + fresh accurate fix with timeout + traveling detection)
  const syncGpsLocation = useCallback(async (options?: { requestPermissionIfUndetermined?: boolean }) => {
    if (isSyncingGpsRef.current) return;
    isSyncingGpsRef.current = true;

    try {
      const savedUseGps = await AsyncStorage.getItem(GPS_STORAGE_KEY);
      // If user explicitly chose a fixed manual city, respect user choice
      if (savedUseGps === 'false') {
        isSyncingGpsRef.current = false;
        return;
      }

      let { status } = await Location.getForegroundPermissionsAsync();
      let wasPrompted = false;
      if (status !== 'granted') {
        if (options?.requestPermissionIfUndetermined) {
          const req = await Location.requestForegroundPermissionsAsync();
          status = req.status;
          wasPrompted = true;
        }
      }

      if (status !== 'granted') {
        isSyncingGpsRef.current = false;
        if (wasPrompted) {
          Alert.alert(
            '📍 Location Permission Required / स्थान अनुमति आवश्यक',
            'Without location permission, accurate local Tithi, Sunrise, Sunset, Muhurat and Planetary positions for your exact location cannot be calculated.\n\nस्थान अनुमति के बिना आपके सटीक क्षेत्र की सही तिथि, सूर्योदय और ग्रह स्थिति की सटीक गणना संभव नहीं है।\n\nWould you like to turn on location permission in device settings?',
            [
              {
                text: 'Turn On in Settings (सेटिंग खोलें)',
                onPress: () => {
                  Linking.openSettings().catch(() => {});
                }
              },
              {
                text: 'No, Use Default (New Delhi)',
                style: 'cancel',
                onPress: async () => {
                  const defaultCity = DEFAULT_CITIES[0];
                  selectedCityRef.current = defaultCity;
                  setSelectedCity(defaultCity);
                  await AsyncStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(defaultCity));
                  await AsyncStorage.setItem(GPS_STORAGE_KEY, 'false');
                  await updateLiveChoghadiyaNotification(defaultCity).catch(() => {});
                  Alert.alert(
                    '📍 Default Location Active',
                    'Showing Panchang & Planetary info for New Delhi (नई दिल्ली) as default. You can change your location anytime from Settings or top header.'
                  );
                }
              }
            ],
            { cancelable: false }
          );
        }
        return;
      }

      const applyLocationFix = async (latitude: number, longitude: number) => {
        const current = selectedCityRef.current;
        const distKm = getDistanceFromLatLonInKm(current.latitude, current.longitude, latitude, longitude);
        const isNotYetGps = !current.name.includes('(GPS)') && current.stateCountry !== 'GPS Location';

        // Refresh geocode if user traveled > 1.5 km or current location is not yet GPS or is fallback New Delhi
        if (distKm > 1.5 || isNotYetGps || current.name === 'New Delhi') {
          let cityName = 'Current Location (GPS)';
          let hindiName = 'वर्तमान स्थान';

          try {
            const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (geocode && geocode.length > 0) {
              const place = geocode[0];
              const name = place.city || place.subregion || place.district || place.region || 'Current Location';
              cityName = `${name} (GPS)`;
              hindiName = place.city || place.district || place.region || 'वर्तमान स्थान';
            }
          } catch (err) {
            console.log('Reverse geocode error during sync:', err);
            if (distKm < 5 && current.name && current.name.includes('(GPS)')) {
              cityName = current.name;
              hindiName = current.hindiName;
            }
          }

          const userGpsCity: CityLocation = {
            name: cityName,
            hindiName,
            stateCountry: 'GPS Location',
            latitude,
            longitude,
            timeZoneId: current.timeZoneId || 'Asia/Kolkata'
          };

          selectedCityRef.current = userGpsCity;
          setSelectedCity(userGpsCity);
          await AsyncStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(userGpsCity));
          await AsyncStorage.setItem(GPS_STORAGE_KEY, 'true');
          await updateLiveChoghadiyaNotification(userGpsCity).catch(() => {});
        }
      };

      // 1. FAST: Try getLastKnownPositionAsync first (Instantaneous, 0-50ms)
      try {
        const lastKnown = await Location.getLastKnownPositionAsync();
        if (lastKnown && lastKnown.coords) {
          await applyLocationFix(lastKnown.coords.latitude, lastKnown.coords.longitude);
        }
      } catch (e) {
        console.log('getLastKnownPosition error:', e);
      }

      // 2. FRESH: Accurate current position with 6-second timeout
      try {
        const freshLocPromise = Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });
        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 6000));
        const freshLoc = await Promise.race([freshLocPromise, timeoutPromise]);
        if (freshLoc && freshLoc.coords) {
          await applyLocationFix(freshLoc.coords.latitude, freshLoc.coords.longitude);
        }
      } catch (e) {
        console.log('getCurrentPosition error:', e);
      }
    } catch (err) {
      console.log('syncGpsLocation error:', err);
    } finally {
      isSyncingGpsRef.current = false;
    }
  }, []);

  // AppState listener (resumes from background, unlocks phone) & Periodic traveling sync (every 3 minutes)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // User came back to the app from background / unlocked phone / traveling
        syncGpsLocation({ requestPermissionIfUndetermined: false });
      }
      appStateRef.current = nextAppState;
    });

    const travelInterval = setInterval(() => {
      if (appStateRef.current === 'active') {
        syncGpsLocation({ requestPermissionIfUndetermined: false });
      }
    }, 3 * 60 * 1000);

    return () => {
      subscription.remove();
      clearInterval(travelInterval);
    };
  }, [syncGpsLocation]);

  // Initial App Launch: Immediate Cache Hydration + GPS Sync
  useEffect(() => {
    (async () => {
      try {
        const langDone = await AsyncStorage.getItem(FIRST_LAUNCH_LANG_KEY);
        setShowFirstLaunchLangScreen(langDone !== 'true');

        const authDone = await AsyncStorage.getItem(FIRST_LAUNCH_AUTH_KEY);
        if (authDone === 'true' || authDone === 'skipped') {
          setIsGuestMode(true);
        }

        // 1. Immediately hydrate selectedCity from cache (Zero latency, never shows New Delhi if previously saved!)
        const savedCityJson = await AsyncStorage.getItem(CITY_STORAGE_KEY);
        if (savedCityJson) {
          try {
            const cachedCity = JSON.parse(savedCityJson);
            if (cachedCity && cachedCity.name && typeof cachedCity.latitude === 'number') {
              setSelectedCity(cachedCity);
              selectedCityRef.current = cachedCity;
            }
          } catch (err) {
            console.log('Error parsing cached city on launch:', err);
          }
        }

        // 2. Refresh GPS location (requests permission if fresh install)
        await syncGpsLocation({ requestPermissionIfUndetermined: true });
      } catch (e) {
        console.log('App launch location init error:', e);
      } finally {
        try {
          const reminders = await getStoredReminders();
          await rescheduleAllReminders(reminders);
        } catch (err) {
          console.log('App launch reminder reschedule error:', err);
        }
      }
    })();
  }, [syncGpsLocation]);

  const { lunarSystem } = useCalendarSystem();
  const currentDateObj = new Date(currentDateIso + 'T00:00:00');
  const panchangData: PanchangDayData = calculatePanchang(currentDateObj, selectedCity, lunarSystem);

  const handleSelectCity = async (city: CityLocation) => {
    selectedCityRef.current = city;
    setSelectedCity(city);
    setIsCityModalVisible(false);
    try {
      await AsyncStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(city));
      await AsyncStorage.setItem(GPS_STORAGE_KEY, (city.stateCountry === 'GPS Location' || city.name.includes('(GPS)')) ? 'true' : 'false');
      await updateLiveChoghadiyaNotification(city);
    } catch (e) {
      console.log('Save city error:', e);
    }
  };

  const handlePrevDay = () => {
    const parts = currentDateIso.split('-');
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(y, m, day - 1);
    setCurrentDateIso(formatDateIso(d));
  };

  const handleNextDay = () => {
    const parts = currentDateIso.split('-');
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(y, m, day + 1);
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

  const handleTabPress = async (tab: TabName) => {
    if (tab === 'REMINDERS') {
      try {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          const req = await Notifications.requestPermissionsAsync();
          if (req.status !== 'granted') {
            Alert.alert(
              '🔔 Notification Permission Required',
              'Please allow notification permissions so SoulRise Panchang can alert you for your set reminders on time.'
            );
          }
        }
      } catch (e) {
        console.log('Error requesting notification permission on tab press:', e);
      }
    }
    setActiveTab(tab);
  };

  const handleFirstLaunchLangComplete = async () => {
    try {
      await AsyncStorage.setItem(FIRST_LAUNCH_LANG_KEY, 'true');
    } catch (e) {
      console.log('Error saving first launch lang status:', e);
    }
    setShowFirstLaunchLangScreen(false);
  };

  if (showFirstLaunchLangScreen === true) {
    return <LanguageSelectionScreen onComplete={handleFirstLaunchLangComplete} />;
  }

  const handleSkipAuth = async () => {
    try {
      await AsyncStorage.setItem(FIRST_LAUNCH_AUTH_KEY, 'skipped');
    } catch (e) {
      console.log('Error persisting skip auth status:', e);
    }
    setIsGuestMode(true);
  };

  const handleAuthComplete = async () => {
    try {
      await AsyncStorage.setItem(FIRST_LAUNCH_AUTH_KEY, 'true');
    } catch (e) {
      console.log('Error persisting auth complete status:', e);
    }
    setIsGuestMode(true);
  };

  // Single Source of Truth Auth Check: If no authenticated user exists and not in guest mode, render Login Screen
  if (!user && !isGuestMode && !isAuthLoading) {
    return (
      <OnboardingAuthScreen
        onComplete={handleAuthComplete}
        onSkip={handleSkipAuth}
      />
    );
  }

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
            onNavigateToFestivals={() => handleTabPress('FESTIVALS')}
            onSelectDateIso={(dateIso) => setCurrentDateIso(dateIso)}
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
      <View style={[styles.tabBar, { paddingBottom: tabBarBottomPadding }]}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'TODAY' && styles.tabItemActive]}
          onPress={() => handleTabPress('TODAY')}
        >
          <Text style={styles.tabIcon}>☀️</Text>
          <Text style={[styles.tabLabel, activeTab === 'TODAY' && styles.tabLabelActive]} numberOfLines={1} adjustsFontSizeToFit>{t('today')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'CALENDAR' && styles.tabItemActive]}
          onPress={() => handleTabPress('CALENDAR')}
        >
          <Text style={styles.tabIcon}>📅</Text>
          <Text style={[styles.tabLabel, activeTab === 'CALENDAR' && styles.tabLabelActive]} numberOfLines={1} adjustsFontSizeToFit>{t('calendar')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'FESTIVALS' && styles.tabItemActive]}
          onPress={() => handleTabPress('FESTIVALS')}
        >
          <Text style={styles.tabIcon}>🚩</Text>
          <Text style={[styles.tabLabel, activeTab === 'FESTIVALS' && styles.tabLabelActive]} numberOfLines={1} adjustsFontSizeToFit>{t('festivals')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'REMINDERS' && styles.tabItemActive]}
          onPress={() => handleTabPress('REMINDERS')}
        >
          <Text style={styles.tabIcon}>⏰</Text>
          <Text style={[styles.tabLabel, activeTab === 'REMINDERS' && styles.tabLabelActive]} numberOfLines={1} adjustsFontSizeToFit>Reminders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'RASHIPHAL' && styles.tabItemActive]}
          onPress={() => handleTabPress('RASHIPHAL')}
        >
          <Text style={styles.tabIcon}>♈</Text>
          <Text style={[styles.tabLabel, activeTab === 'RASHIPHAL' && styles.tabLabelActive]} numberOfLines={1} adjustsFontSizeToFit>{t('horoscope')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'SETTINGS' && styles.tabItemActive]}
          onPress={() => handleTabPress('SETTINGS')}
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

      {/* Global City Selection Modal triggered from Header or Settings */}
      <CitySelectionModal
        visible={isCityModalVisible}
        onClose={() => setIsCityModalVisible(false)}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        persistToGlobalStorage={true}
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

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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
