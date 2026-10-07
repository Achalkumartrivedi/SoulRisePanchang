import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Switch,
  Alert,
  StatusBar,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Fonts } from '../constants/typography';
import { CityLocation } from '../types/panchang';
import { DEFAULT_CITIES } from '../data/cities';
import {
  CHOGHADIYA_NOTIF_KEY,
  updateLiveChoghadiyaNotification,
  cancelChoghadiyaNotification,
} from '../utils/choghadiyaNotifier';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../types/language';
import { useCalendarSystem, CalendarSystem } from '../context/CalendarContext';
import { clearUserProfile } from '../engine/userDatabase';
import { FeedbackModal } from '../components/FeedbackModal';

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
  const { calendarSystem, setCalendarSystem, lunarSystem, setLunarSystem } = useCalendarSystem();
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const [useGps, setUseGps] = useState(selectedCity.stateCountry === 'GPS Location');
  const [useChoghadiyaNotif, setUseChoghadiyaNotif] = useState(false);

  // Purnima & Amavasya Reminder States
  const [purnimaNotif, setPurnimaNotif] = useState(true);
  const [amavasyaNotif, setAmavasyaNotif] = useState(true);
  const [reminderDays, setReminderDays] = useState<number>(1); // 0, 1, 2, or 5 days before

  // Feedback, Legal & Account Deletion Modal States
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [privacyPolicyVisible, setPrivacyPolicyVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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

  const handleDeleteAccountAndReset = () => {
    Alert.alert(
      '🗑️ Delete Account & Reset Data',
      'Are you sure you want to delete your profile, saved reminders, and reset all app preferences? This action is permanent.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete & Reset',
          style: 'destructive',
          onPress: async () => {
            await clearUserProfile();
            await AsyncStorage.clear();
            Alert.alert('✅ Data Cleared', 'Your account data and preferences have been completely deleted.');
          },
        },
      ]
    );
  };

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

  useEffect(() => {
    const isGps = selectedCity.stateCountry === 'GPS Location' || selectedCity.name.includes('(GPS)');
    setUseGps(isGps);
  }, [selectedCity]);

  const handleGpsToggle = async (val: boolean) => {
    setUseGps(val);
    if (val) {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let loc = await Location.getLastKnownPositionAsync();
          if (!loc) {
            loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          }

          const latitude = loc ? loc.coords.latitude : 28.6139;
          const longitude = loc ? loc.coords.longitude : 77.2090;

          let cityName = 'Current Location';
          let hindiName = 'वर्तमान स्थान';
          try {
            const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (geocode && geocode.length > 0) {
              const place = geocode[0];
              cityName = place.city || place.subregion || place.district || place.region || 'Current Location';
              hindiName = place.city || place.district || place.region || 'वर्तमान स्थान';
            }
          } catch (err) {
            console.log('Reverse geocode error:', err);
          }

          const gpsCity: CityLocation = {
            name: `${cityName} (GPS)`,
            hindiName,
            stateCountry: 'GPS Location',
            latitude,
            longitude,
            timeZoneId: 'Asia/Kolkata',
          };
          onSelectCity(gpsCity);
          await AsyncStorage.setItem('SOULRISE_SELECTED_CITY', JSON.stringify(gpsCity));
          await AsyncStorage.setItem('SOULRISE_USE_GPS', 'true');
        } else {
          setUseGps(false);
          Alert.alert(
            '📍 Location Permission Required',
            'Without location permission, accurate local Tithi, Sunrise, Sunset, Muhurat and Planetary positions for your exact location cannot be calculated.\n\nWould you like to turn on location permission in device settings?',
            [
              {
                text: 'Turn On in Settings',
                onPress: () => {
                  Linking.openSettings().catch(() => {});
                },
              },
              {
                text: 'No, Use Default (New Delhi)',
                style: 'cancel',
                onPress: async () => {
                  const defaultCity = DEFAULT_CITIES[0];
                  onSelectCity(defaultCity);
                  await AsyncStorage.setItem('SOULRISE_SELECTED_CITY', JSON.stringify(defaultCity));
                  await AsyncStorage.setItem('SOULRISE_USE_GPS', 'false');
                  Alert.alert(
                    '📍 Default Location Active',
                    'Showing Panchang & Planetary info for New Delhi as default.'
                  );
                },
              },
            ],
            { cancelable: false }
          );
        }
      } catch (e) {
        setUseGps(false);
      }
    } else {
      await AsyncStorage.setItem('SOULRISE_USE_GPS', 'false');
      const cleanName = selectedCity.name.replace(/\s*\(GPS\)/gi, '').trim() || selectedCity.name;
      const manualCity: CityLocation = {
        ...selectedCity,
        name: cleanName,
        stateCountry: selectedCity.stateCountry === 'GPS Location' ? 'Manual Selection' : selectedCity.stateCountry,
      };
      onSelectCity(manualCity);
      await AsyncStorage.setItem('SOULRISE_SELECTED_CITY', JSON.stringify(manualCity));
    }
  };

  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 8, (StatusBar.currentHeight || 24) + 12);

  // Single-Language helper: only Hinglish displays dual-language brackets
  const isHinglish = language === 'hinglish';
  const displayCityName = isHinglish && selectedCity.hindiName
    ? `${selectedCity.name} (${selectedCity.hindiName})`
    : selectedCity.name;

  return (
    <View style={styles.container}>
      {/* Sacred Velvet Burgundy Header */}
      <View style={[styles.header, { paddingTop: topPadding }]}>
        <View style={styles.headerTitleRow}>
          <View style={styles.headerIconBox}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19.4 13a7.7 7.7 0 0 0 .1-1 7.7 7.7 0 0 0-.1-1l2.1-1.6c.2-.2.3-.5.1-.7l-2-3.5c-.1-.2-.4-.3-.7-.2l-2.5 1a7.4 7.4 0 0 0-1.7-1l-.4-2.6A.6.6 0 0 0 14 2h-4c-.3 0-.6.2-.6.5l-.4 2.6c-.6.3-1.2.6-1.7 1l-2.5-1c-.3-.1-.6 0-.7.2l-2 3.5c-.1.2 0 .5.1.7L4.3 11a7.7 7.7 0 0 0-.1 1c0 .3 0 .7.1 1l-2.1 1.6c-.2.2-.3.5-.1.7l2 3.5c.1.2.4.3.7.2l2.5-1c.5.4 1.1.7 1.7 1l.4 2.6c0 .3.3.5.6.5h4c.3 0 .6-.2.6-.5l.4-2.6c.6-.3 1.2-.6 1.7-1l2.5 1c.3.1.6 0 .7-.2l2-3.5c.1-.2 0-.5-.1-.7L19.4 13z"
                fill="#DFB059"
              />
            </Svg>
          </View>
          <View>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {t('settingsTitle')}
            </Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {t('settingsSub')}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 1. App Language Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('appLanguage')}</Text>
          <Text style={styles.cardSubTitle}>Choose your preferred display language:</Text>

          <TouchableOpacity style={styles.selectorBox} onPress={onOpenLanguageModal} activeOpacity={0.8}>
            <View style={styles.selectorLeft}>
              <Text style={{ fontSize: 24, marginRight: 12 }}>{currentLangObj.flag}</Text>
              <View>
                <Text style={styles.selectorPrimaryText}>{currentLangObj.name}</Text>
                <Text style={styles.selectorSubText}>{currentLangObj.nativeName}</Text>
              </View>
            </View>
            <View style={styles.changeActionBadge}>
              <Text style={styles.changeActionText}>Change ➔</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 2. Calendar System Preference Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📅 Calendar System Preference</Text>
          <Text style={styles.cardSubTitle}>Select default astronomical system across the app:</Text>

          <View style={styles.calSystemList}>
            {[
              { id: 'HINDU', title: '🕉️ Hindu Calendar (Vikram Samvat)', desc: 'Standard Vedic Lunar/Solar Panchang with Tithis & Nakshatras' },
              { id: 'GLOBAL', title: '🌍 Gregorian Solar Calendar', desc: 'Standard Western Solar Dates & International Holidays' },
              { id: 'JAIN', title: '🪔 Jain Calendar (Vira Nirvana Samvat)', desc: 'Sacred Jain Parva Tithis (Aastham, Chaudas), Pachkhan & Fasting' },
              { id: 'SIKH', title: '☬ Nanakshahi Sikh Calendar', desc: 'Sikh Samvat 556, Gurpurabs, Shaheedi Diwas & Historic Dates' },
              { id: 'BUDDHIST', title: '☸️ Buddhist Lunar Calendar (BE 2568)', desc: 'Buddha Era 2568, Vesak, Asalha & Kathina Sacred Days' },
              { id: 'CHRISTIAN', title: '✝️ Christian Liturgical Calendar', desc: 'Feasts, Lent, Easter, Good Friday, Christmas & Seasons' },
              { id: 'PARSI', title: '🔥 Zoroastrian Parsi Calendar', desc: 'Shahenshahi / Fasli Yazdegerdi 1396 & Navroz Celebrations' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.calSystemItem, calendarSystem === item.id && styles.calSystemItemActive]}
                onPress={() => setCalendarSystem(item.id as any)}
                activeOpacity={0.8}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.calSystemTitle, calendarSystem === item.id && styles.calSystemTitleActive]}>
                    {item.title}
                  </Text>
                  <Text style={styles.calSystemDesc}>{item.desc}</Text>
                </View>
                {calendarSystem === item.id && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. Lunar Month System (Amanta vs Purnimanta) Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {language === 'gu'
              ? '🌙 લૂનાર માસ પદ્ધતિ (અમાંત પદ્ધતિ)'
              : language === 'hi'
              ? '🌙 लूनर मास पद्धति (अमांत / पूर्णिमांत)'
              : '🌙 Lunar Month System'}
          </Text>
          <Text style={styles.cardSubTitle}>Select Hindu Lunar Month calculation method for your region:</Text>

          <View style={styles.calSystemList}>
            {[
              { id: 'AMANTA', title: '🌾 Amanta (Gujarat / Maharashtra / South)', desc: 'Month ends on Amavasya. Shravana Month active during Vad/Krishna Paksha.' },
              { id: 'PURNIMANTA', title: '🏔️ Purnimanta (North India / Rajasthan / UP)', desc: 'Month ends on Purnima. Bhadrapada Month active during Krishna Paksha.' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.calSystemItem, lunarSystem === item.id && styles.calSystemItemActive]}
                onPress={() => setLunarSystem(item.id as any)}
                activeOpacity={0.8}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.calSystemTitle, lunarSystem === item.id && styles.calSystemTitleActive]}>
                    {item.title}
                  </Text>
                  <Text style={styles.calSystemDesc}>{item.desc}</Text>
                </View>
                {lunarSystem === item.id && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 4. Active Location Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('activeLocation')}</Text>
          <Text style={styles.cardSubTitle}>Accurate Tithi, Sunrise, Sunset, and Muhurat calculations:</Text>

          <TouchableOpacity style={styles.selectorBox} onPress={onOpenCityModal} activeOpacity={0.8}>
            <View style={styles.selectorLeft}>
              <Text style={{ fontSize: 22, marginRight: 10 }}>📍</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.selectorPrimaryText}>{displayCityName}</Text>
                <Text style={styles.selectorSubText}>
                  {selectedCity.stateCountry} • Lat: {selectedCity.latitude.toFixed(2)}, Lon: {selectedCity.longitude.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.changeActionBadge}>
              <Text style={styles.changeActionText}>Change ➔</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchLabel}>Auto Detect Location (GPS)</Text>
              <Text style={styles.switchSub}>Use device coordinates for high precision astronomical positions</Text>
            </View>
            <Switch
              value={useGps}
              onValueChange={handleGpsToggle}
              trackColor={{ false: '#D1D5DB', true: '#2B0E14' }}
              thumbColor={useGps ? '#DFB059' : '#F4F3F4'}
            />
          </View>
        </View>

        {/* 5. Live Choghadiya Notification Bar Setting */}
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
              trackColor={{ false: '#D1D5DB', true: '#2B0E14' }}
              thumbColor={useChoghadiyaNotif ? '#DFB059' : '#F4F3F4'}
            />
          </View>
        </View>

        {/* 6. Purnima & Amavasya Push Notification Reminders */}
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
              trackColor={{ false: '#D1D5DB', true: '#2B0E14' }}
              thumbColor={purnimaNotif ? '#DFB059' : '#F4F3F4'}
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
              trackColor={{ false: '#D1D5DB', true: '#2B0E14' }}
              thumbColor={amavasyaNotif ? '#DFB059' : '#F4F3F4'}
            />
          </View>

          {/* Timing Days Picker */}
          <Text style={[styles.switchLabel, { marginTop: 14, marginBottom: 8 }]}>
            ⏰ Notification Advance Timing:
          </Text>
          <View style={styles.timingDaysRow}>
            {[
              { label: 'Same Day', days: 0 },
              { label: '1 Day Before', days: 1 },
              { label: '2 Days Before', days: 2 },
              { label: '5 Days Before', days: 5 },
            ].map((item) => (
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

        {/* 7. Customer Support & Feedback Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💬 Support & Customer Feedback</Text>
          <Text style={styles.cardSubTitle}>
            Have a suggestion, bug report, or Panchang question? Send feedback directly to our team.
          </Text>

          <TouchableOpacity
            style={styles.feedbackBtn}
            onPress={() => setFeedbackModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.feedbackBtnText}>✉️ Send Feedback / Contact Us</Text>
          </TouchableOpacity>
        </View>

        {/* 8. Legal & Privacy Policy Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔐 Privacy & Legal Compliance</Text>
          <Text style={styles.cardSubTitle}>
            Google Play Developer Policy compliant data handling. We compute astronomical data locally and never sell your personal data.
          </Text>

          <TouchableOpacity
            style={styles.policyBtn}
            onPress={() => setPrivacyPolicyVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.policyBtnText}>📜 View Official Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* 9. Google Play Compliant Account Deletion & Reset Card */}
        <View style={[styles.card, styles.deleteCard]}>
          <Text style={styles.deleteCardTitle}>🗑️ Account Deletion & Data Reset</Text>
          <Text style={styles.cardSubTitle}>
            Google Play Requirement: Delete your profile, saved custom reminders, and clear local storage data permanently.
          </Text>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => setDeleteModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteBtnText}>⚠️ Delete Account & Erase All Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Feedback Modal */}
      <FeedbackModal
        visible={feedbackModalVisible}
        onClose={() => setFeedbackModalVisible(false)}
      />

      {/* Privacy Policy Modal */}
      <Modal visible={privacyPolicyVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📜 Privacy Policy</Text>
              <TouchableOpacity onPress={() => setPrivacyPolicyVisible(false)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <Text style={styles.policyHeading}>1. Data Collection & Location Usage</Text>
              <Text style={styles.policyBody}>
                SoulRise Panchang uses GPS location data solely to compute accurate city-specific sunrise, sunset, Tithi, Rahu Kalam, and planetary calculations. Location data is processed locally on your device and is NEVER sold or shared with third parties.
              </Text>

              <Text style={styles.policyHeading}>2. User Authentication & Profile</Text>
              <Text style={styles.policyBody}>
                User profile names and details are stored locally and used to personalize your Vedic charts and reminders. Profile data remains under your complete control.
              </Text>

              <Text style={styles.policyHeading}>3. Account Deletion Rights</Text>
              <Text style={styles.policyBody}>
                You can delete your account, wipe all stored local profiles, and clear all local data at any time under Settings ➔ Delete Account & Erase All Data.
              </Text>

              <Text style={styles.policyHeading}>4. Children's Privacy (COPPA)</Text>
              <Text style={styles.policyBody}>
                SoulRise Panchang is rated 3+ (Everyone). We do not knowingly collect personal data from children under 13.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Custom Delete Account Confirmation Modal */}
      <Modal visible={deleteModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, styles.deleteConfirmCard]}>
            <Text style={styles.deleteConfirmTitle}>⚠️ Delete Account & Clear Data</Text>
            <Text style={styles.deleteConfirmDesc}>
              CAUTION: Deleting your account will permanently erase your user profile, saved Janam Kundli charts, and custom reminders from this device. Are you sure you want to proceed?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
              <TouchableOpacity
                style={styles.cancelDeleteBtn}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelDeleteBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmDeleteBtn}
                onPress={async () => {
                  setDeleteModalVisible(false);
                  await handleDeleteAccountAndReset();
                }}
              >
                <Text style={styles.confirmDeleteBtnText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    backgroundColor: '#2B0E14',
    paddingBottom: 16,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: '#DFB059',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(223, 176, 89, 0.15)',
    borderWidth: 1,
    borderColor: '#DFB059',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 20,
    color: '#DFB059',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11,
    color: '#F8F5EE',
    opacity: 0.85,
    marginTop: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.28)',
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 16.5,
    color: '#2B0E14',
    marginBottom: 4,
  },
  cardSubTitle: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11.5,
    color: '#7D6A68',
    marginBottom: 12,
    lineHeight: 16,
  },
  calSystemList: {
    gap: 8,
  },
  calSystemItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.25)',
    borderRadius: 12,
    padding: 11,
  },
  calSystemItemActive: {
    backgroundColor: '#FFFDF6',
    borderColor: '#2B0E14',
    borderWidth: 1.5,
  },
  calSystemTitle: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 12.5,
    color: '#2B0E14',
  },
  calSystemTitleActive: {
    fontFamily: Fonts.jakartaBold,
    color: '#2B0E14',
  },
  calSystemDesc: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 10.5,
    color: '#7D6A68',
    marginTop: 2,
    lineHeight: 14,
  },
  selectorBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.3)',
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorPrimaryText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 13.5,
    color: '#2B0E14',
  },
  selectorSubText: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11,
    color: '#7D6A68',
    marginTop: 2,
  },
  changeActionBadge: {
    backgroundColor: '#2B0E14',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  changeActionText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11,
    color: '#DFB059',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(223, 176, 89, 0.15)',
  },
  switchTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  switchLabel: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 12.5,
    color: '#2B0E14',
  },
  switchSub: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 10.5,
    color: '#7D6A68',
    marginTop: 2,
  },
  timingDaysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 4,
  },
  dayPill: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  dayPillActive: {
    backgroundColor: '#2B0E14',
    borderColor: '#DFB059',
  },
  dayPillText: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 11,
    color: '#7D6A68',
  },
  dayPillTextActive: {
    fontFamily: Fonts.jakartaBold,
    color: '#DFB059',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 9, 13, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#FAF7F0',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#DFB059',
    width: '100%',
    maxWidth: 400,
    maxHeight: 560,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2B0E14',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(223, 176, 89, 0.3)',
  },
  modalTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 17,
    color: '#F8F5EE',
  },
  closeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F8F5EE',
  },
  checkIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DFB059',
    marginLeft: 8,
  },
  feedbackBtn: {
    backgroundColor: '#2B0E14',
    borderWidth: 1,
    borderColor: '#DFB059',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  feedbackBtnText: {
    fontFamily: Fonts.jakartaBold,
    color: '#DFB059',
    fontSize: 12.5,
    letterSpacing: 0.3,
  },
  policyBtn: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.35)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  policyBtnText: {
    fontFamily: Fonts.jakartaBold,
    color: '#2B0E14',
    fontSize: 12.5,
  },
  deleteCard: {
    borderColor: 'rgba(220, 38, 38, 0.3)',
    backgroundColor: '#FFF8F8',
  },
  deleteCardTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 16.5,
    color: '#B91C1C',
    marginBottom: 4,
  },
  deleteBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteBtnText: {
    fontFamily: Fonts.jakartaBold,
    color: '#DC2626',
    fontSize: 12.5,
  },
  policyHeading: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 13.5,
    color: '#2B0E14',
    marginBottom: 4,
    marginTop: 8,
  },
  policyBody: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11.5,
    color: '#7D6A68',
    marginBottom: 10,
    lineHeight: 17,
  },
  deleteConfirmCard: {
    padding: 20,
    maxWidth: 360,
  },
  deleteConfirmTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 18,
    color: '#B91C1C',
    marginBottom: 8,
    textAlign: 'center',
  },
  deleteConfirmDesc: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 18,
  },
  cancelDeleteBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelDeleteBtnText: {
    fontFamily: Fonts.jakartaBold,
    color: '#374151',
    fontSize: 13,
  },
  confirmDeleteBtn: {
    flex: 1.2,
    backgroundColor: '#DC2626',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmDeleteBtnText: {
    fontFamily: Fonts.jakartaBold,
    color: '#FFFFFF',
    fontSize: 12.5,
  },
});
