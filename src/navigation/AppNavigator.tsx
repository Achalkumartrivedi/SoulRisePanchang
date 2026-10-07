import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert, AppState, AppStateStatus, Linking } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';
import { Fonts } from '../constants/typography';
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
import { SplashScreen } from '../screens/SplashScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { LocationScreen } from '../screens/LocationScreen';
import { KaalMuhuratScreen } from '../screens/KaalMuhuratScreen';
import { CelestialBackground } from '../components/CelestialBackground';

import { LanguageSelectionModal } from '../components/LanguageSelectionModal';
import { CitySelectionModal } from '../components/CitySelectionModal';
import { useLanguage } from '../context/LanguageContext';
import { useCalendarSystem } from '../context/CalendarContext';
import { useAuth } from '../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Ellipse } from 'react-native-svg';

// Dedicated Vector Icons for Bottom Navigation Dock (Matching Approved Stitch UI)
const TabSunIcon = ({ active }: { active: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Circle cx={12} cy={12} r={4.5} fill={active ? '#DFB059' : '#7D6A68'} />
    <Path
      d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77"
      stroke={active ? '#DFB059' : '#7D6A68'}
      strokeLinecap="round"
      strokeWidth="2"
    />
  </Svg>
);

const TabCalendarIcon = ({ active }: { active: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="4"
      width="18"
      height="17"
      rx="3"
      fill={active ? '#FFFDF9' : '#FFFFFF'}
      stroke={active ? '#2B0E14' : '#7D6A68'}
      strokeWidth="1.6"
    />
    <Path
      d="M3 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v5H3V4z"
      fill={active ? '#2B0E14' : '#7D6A68'}
    />
    <Path
      d="M8 1.5v3M16 1.5v3"
      stroke={active ? '#DFB059' : '#7D6A68'}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="8" cy="13" r="1.1" fill={active ? '#2B0E14' : '#8A7571'} />
    <Circle cx="12" cy="13" r="1.1" fill={active ? '#2B0E14' : '#8A7571'} />
    <Circle cx="16" cy="13" r="1.1" fill={active ? '#2B0E14' : '#8A7571'} />
    <Circle cx="8" cy="17" r="1.1" fill={active ? '#2B0E14' : '#8A7571'} />
    <Circle cx="12" cy="17" r="1.1" fill={active ? '#DFB059' : '#8A7571'} />
    <Circle cx="16" cy="17" r="1.1" fill={active ? '#2B0E14' : '#8A7571'} />
  </Svg>
);

const TabFestivalsIcon = ({ active }: { active: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 21l3.5-1.5L19 7l-2-2L4.5 17.5 3 21z"
      fill={active ? '#DDAA33' : '#E8B949'}
      stroke={active ? '#2B0E14' : '#7D6A68'}
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <Path d="M7.5 14.5l2 2M11.5 10.5l2 2" stroke={active ? '#991B1B' : '#DC2626'} strokeWidth="1.4" />
    <Ellipse cx="18" cy="6" rx="2.2" ry="1.6" transform="rotate(-45 18 6)" fill="#FEF08A" stroke={active ? '#2B0E14' : '#7D6A68'} strokeWidth="1" />
    <Circle cx="20" cy="3" r="1.2" fill="#EF4444" />
    <Circle cx="22" cy="7.5" r="1" fill="#3B82F6" />
    <Circle cx="14.5" cy="2" r="1.1" fill="#10B981" />
    <Path d="M17.5 1.5c1 1 2 0 3 1" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" />
    <Path d="M20.5 9c.5 1 1.5 1 2 1.5" stroke="#A855F7" strokeWidth="1.2" strokeLinecap="round" />
  </Svg>
);

const TabRemindersIcon = ({ active }: { active: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3a2 2 0 0 0-2 2v.3C7.6 6 6 8.3 6 11v4l-2 2v1h16v-1l-2-2v-4c0-2.7-1.6-5-4-5.7V5a2 2 0 0 0-2-2z"
      fill={active ? '#DFB059' : '#C5A059'}
      stroke={active ? '#2B0E14' : '#7D6A68'}
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <Path
      d="M10 18.5a2 2 0 0 0 4 0"
      stroke={active ? '#2B0E14' : '#7D6A68'}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M7 16h10"
      stroke={active ? '#FFF5DC' : '#EAD8B8'}
      strokeWidth="1"
    />
  </Svg>
);

const TabHoroscopeIcon = ({ active }: { active: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2c0 4.5-1.5 6-6 6 4.5 0 6 1.5 6 6 0-4.5 1.5-6 6-6-4.5 0-6-1.5-6-6z"
      fill={active ? '#DFB059' : '#D4AF37'}
      stroke={active ? '#2B0E14' : '#7D6A68'}
      strokeWidth="0.8"
    />
    <Path
      d="M19 12c0 2.2-.8 3-3 3 2.2 0 3 .8 3 3 0-2.2.8-3 3-3-2.2 0-3-.8-3-3z"
      fill={active ? '#F5DE9C' : '#E0C57A'}
    />
    <Circle cx="5" cy="18" r="1.2" fill={active ? '#DFB059' : '#B89742'} />
  </Svg>
);

const TabSettingsIcon = ({ active }: { active: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19.4 13a7.7 7.7 0 0 0 .1-1 7.7 7.7 0 0 0-.1-1l2.1-1.6c.2-.2.3-.5.1-.7l-2-3.5c-.1-.2-.4-.3-.7-.2l-2.5 1a7.4 7.4 0 0 0-1.7-1l-.4-2.6A.6.6 0 0 0 14 2h-4c-.3 0-.6.2-.6.5l-.4 2.6c-.6.3-1.2.6-1.7 1l-2.5-1c-.3-.1-.6 0-.7.2l-2 3.5c-.1.2 0 .5.1.7L4.3 11a7.7 7.7 0 0 0-.1 1c0 .3 0 .7.1 1l-2.1 1.6c-.2.2-.3.5-.1.7l2 3.5c.1.2.4.3.7.2l2.5-1c.5.4 1.1.7 1.7 1l.4 2.6c0 .3.3.5.6.5h4c.3 0 .6-.2.6-.5l.4-2.6c.6-.3 1.2-.6 1.7-1l2.5 1c.3.1.6 0 .7-.2l2-3.5c.1-.2 0-.5-.1-.7L19.4 13z"
      fill={active ? '#2B0E14' : '#7D6A68'}
      stroke={active ? '#DFB059' : '#5C4745'}
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="3" fill="#FFFFFF" stroke={active ? '#2B0E14' : '#7D6A68'} strokeWidth="1.2" />
  </Svg>
);

type TabName = 'TODAY' | 'CALENDAR' | 'FESTIVALS' | 'REMINDERS' | 'RASHIPHAL' | 'SETTINGS';
type AppFlowScreen = 'SPLASH' | 'WELCOME' | 'LANGUAGE' | 'SIGN_IN' | 'LOCATION' | 'MAIN' | 'KAAL_MUHURAT';
type FlowSource = 'ONBOARDING' | 'HOME' | 'SETTINGS';

const CITY_STORAGE_KEY = 'SOULRISE_SELECTED_CITY';
const GPS_STORAGE_KEY = 'SOULRISE_USE_GPS';
const FIRST_LAUNCH_LANG_KEY = '@soulrise_lang_first_launch_done';
const FIRST_LAUNCH_AUTH_KEY = '@soulrise_onboarding_auth_done';
const ONBOARDING_COMPLETED_KEY = '@soulrise_onboarding_completed';

export const AppNavigator: React.FC = () => {
  const { t } = useLanguage();
  const { user, isLoading: isAuthLoading } = useAuth();
  const insets = useSafeAreaInsets();
  const tabBarBottomPadding = Math.max(insets.bottom, 16) + 8;
  const [activeTab, setActiveTab] = useState<TabName>('TODAY');
  const [selectedCity, setSelectedCity] = useState<CityLocation>(DEFAULT_CITIES[0]); // Default New Delhi
  const [currentDateIso, setCurrentDateIso] = useState<string>(() => formatDateIso(new Date()));
  const [isCityModalVisible, setIsCityModalVisible] = useState(false);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [flowScreen, setFlowScreen] = useState<AppFlowScreen>('SPLASH');
  const [kaalMuhuratInitialTab, setKaalMuhuratInitialTab] = useState<'ALL' | 'AUSPICIOUS' | 'INAUSPICIOUS'>('ALL');
  const [flowSource, setFlowSource] = useState<FlowSource>('ONBOARDING');
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

  const handleSplashFinish = async () => {
    try {
      const authDone = await AsyncStorage.getItem(FIRST_LAUNCH_AUTH_KEY);
      const onboardingDone = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      if (user || authDone === 'true' || authDone === 'skipped' || onboardingDone === 'true' || onboardingDone === 'skipped' || isGuestMode) {
        setFlowScreen('MAIN');
      } else {
        setFlowScreen('WELCOME');
      }
    } catch (e) {
      setFlowScreen('WELCOME');
    }
  };

  const handleSkipAuth = async () => {
    try {
      await AsyncStorage.setItem(FIRST_LAUNCH_AUTH_KEY, 'skipped');
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'skipped');
    } catch (e) {
      console.log('Error persisting skip auth status:', e);
    }
    setIsGuestMode(true);
    setFlowScreen('MAIN');
  };

  const handleAuthComplete = async () => {
    try {
      await AsyncStorage.setItem(FIRST_LAUNCH_AUTH_KEY, 'true');
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch (e) {
      console.log('Error persisting auth complete status:', e);
    }
    setIsGuestMode(true);
    setFlowScreen('MAIN');
  };

  if (flowScreen === 'SPLASH') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (flowScreen === 'WELCOME') {
    return (
      <View style={styles.rootContainer}>
        <CelestialBackground id="welcomeDots" />
        <WelcomeScreen
          onGetStarted={() => {
            setFlowSource('ONBOARDING');
            setFlowScreen('LANGUAGE');
          }}
          onSignIn={() => {
            setFlowSource('ONBOARDING');
            setFlowScreen('SIGN_IN');
          }}
          onSkip={handleSkipAuth}
        />
      </View>
    );
  }

  if (flowScreen === 'LANGUAGE') {
    return (
      <View style={styles.rootContainer}>
        <CelestialBackground id="langDots" />
        <LanguageSelectionScreen
          onComplete={async () => {
            try {
              await AsyncStorage.setItem(FIRST_LAUNCH_LANG_KEY, 'true');
            } catch (e) {}
            if (flowSource === 'ONBOARDING') {
              setFlowScreen('SIGN_IN');
            } else {
              setFlowScreen('MAIN');
            }
          }}
          isFromHome={flowSource === 'HOME' || flowSource === 'SETTINGS'}
          onBack={() => setFlowScreen('MAIN')}
        />
      </View>
    );
  }

  if (flowScreen === 'SIGN_IN') {
    return (
      <View style={styles.rootContainer}>
        <CelestialBackground id="signInDots" />
        <OnboardingAuthScreen
          onComplete={handleAuthComplete}
          onSkip={handleSkipAuth}
        />
      </View>
    );
  }

  if (flowScreen === 'LOCATION') {
    return (
      <View style={styles.rootContainer}>
        <CelestialBackground id="locDots" />
        <LocationScreen
          selectedCity={selectedCity}
          onApplyLocation={async (city) => {
            await handleSelectCity(city);
            setFlowScreen('MAIN');
          }}
          onBack={() => setFlowScreen('MAIN')}
        />
      </View>
    );
  }

  if (flowScreen === 'KAAL_MUHURAT') {
    return (
      <View style={styles.rootContainer}>
        <CelestialBackground id="kaalDots" />
        <KaalMuhuratScreen
          panchang={panchangData}
          currentDateIso={currentDateIso}
          selectedCity={selectedCity}
          initialTab={kaalMuhuratInitialTab}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
          onToday={handleToday}
          onSelectDateIso={(dateIso) => setCurrentDateIso(dateIso)}
          onBack={() => setFlowScreen('MAIN')}
        />
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      <CelestialBackground id="rootMainDots" />
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F5EE" />

        <View style={styles.contentArea}>
        {activeTab === 'TODAY' && (
          <HomeScreen
            panchang={panchangData}
            currentDateIso={currentDateIso}
            selectedCity={selectedCity}
            onOpenCityPicker={() => {
              setFlowSource('HOME');
              setFlowScreen('LOCATION');
            }}
            onOpenLanguagePicker={() => {
              setFlowSource('HOME');
              setFlowScreen('LANGUAGE');
            }}
            onPrevDay={handlePrevDay}
            onNextDay={handleNextDay}
            onToday={handleToday}
            onNavigateToFestivals={() => handleTabPress('FESTIVALS')}
            onSelectDateIso={(dateIso) => setCurrentDateIso(dateIso)}
            onNavigateToReminders={() => handleTabPress('REMINDERS')}
            onOpenKaalMuhurat={(tab: 'ALL' | 'AUSPICIOUS' | 'INAUSPICIOUS' = 'ALL') => {
              setKaalMuhuratInitialTab(tab);
              setFlowScreen('KAAL_MUHURAT');
            }}
          />
        )}

        {activeTab === 'CALENDAR' && (
          <CalendarScreen
            selectedCity={selectedCity}
            initialDateIso={currentDateIso}
            onSelectDate={(dateIso) => {
              setCurrentDateIso(dateIso);
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
            onOpenCityModal={() => {
              setFlowSource('SETTINGS');
              setFlowScreen('LOCATION');
            }}
            onCloseCityModal={() => setIsCityModalVisible(false)}
            onOpenLanguageModal={() => {
              setFlowSource('SETTINGS');
              setFlowScreen('LANGUAGE');
            }}
          />
        )}
      </View>

      {/* Floating Bottom Navigation Dock */}
      <View
        pointerEvents="box-none"
        style={[styles.tabBarDockWrapper, { paddingBottom: Math.max(tabBarBottomPadding, 8) }]}
      >
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'TODAY' && styles.tabItemActive]}
            onPress={() => handleTabPress('TODAY')}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <View style={styles.tabIconContainer}>
              <TabSunIcon active={activeTab === 'TODAY'} />
            </View>
            <Text style={[styles.tabLabel, activeTab === 'TODAY' && styles.tabLabelActive]} numberOfLines={1}>{t('today')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'CALENDAR' && styles.tabItemActive]}
            onPress={() => handleTabPress('CALENDAR')}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <View style={styles.tabIconContainer}>
              <TabCalendarIcon active={activeTab === 'CALENDAR'} />
            </View>
            <Text style={[styles.tabLabel, activeTab === 'CALENDAR' && styles.tabLabelActive]} numberOfLines={1}>{t('calendar')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'FESTIVALS' && styles.tabItemActive]}
            onPress={() => handleTabPress('FESTIVALS')}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <View style={styles.tabIconContainer}>
              <TabFestivalsIcon active={activeTab === 'FESTIVALS'} />
            </View>
            <Text style={[styles.tabLabel, activeTab === 'FESTIVALS' && styles.tabLabelActive]} numberOfLines={1}>{t('festivals')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'REMINDERS' && styles.tabItemActive]}
            onPress={() => handleTabPress('REMINDERS')}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <View style={styles.tabIconContainer}>
              <TabRemindersIcon active={activeTab === 'REMINDERS'} />
            </View>
            <Text style={[styles.tabLabel, activeTab === 'REMINDERS' && styles.tabLabelActive]} numberOfLines={1}>Reminders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'RASHIPHAL' && styles.tabItemActive]}
            onPress={() => handleTabPress('RASHIPHAL')}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <View style={styles.tabIconContainer}>
              <TabHoroscopeIcon active={activeTab === 'RASHIPHAL'} />
            </View>
            <Text style={[styles.tabLabel, activeTab === 'RASHIPHAL' && styles.tabLabelActive]} numberOfLines={1}>{t('horoscope')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'SETTINGS' && styles.tabItemActive]}
            onPress={() => handleTabPress('SETTINGS')}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <View style={styles.tabIconContainer}>
              <TabSettingsIcon active={activeTab === 'SETTINGS'} />
            </View>
            <Text style={[styles.tabLabel, activeTab === 'SETTINGS' && styles.tabLabelActive]} numberOfLines={1}>{t('settings')}</Text>
          </TouchableOpacity>
        </View>
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
    </View>
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
  rootContainer: {
    flex: 1,
    backgroundColor: '#F8F5EE',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tabBarDockWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 12,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  tabBar: {
    width: '100%',
    maxWidth: 410,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 253, 249, 0.96)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(230, 194, 128, 0.7)',
    paddingVertical: 4,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    paddingVertical: 4,
    borderRadius: 14,
  },
  tabItemActive: {
    backgroundColor: 'rgba(43, 14, 20, 0.08)',
  },
  tabIconContainer: {
    width: 22,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 9.5,
    color: '#7D6A68',
    marginTop: 2,
  },
  tabLabelActive: {
    fontFamily: Fonts.jakartaBold,
    color: '#2B0E14',
  },
});

