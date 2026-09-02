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
import { getUserProfile, clearUserProfile, UserProfile } from '../engine/userDatabase';
import { AuthModal } from '../components/AuthModal';
import { FeedbackModal } from '../components/FeedbackModal';
import { AdminDatabaseModal } from '../components/AdminDatabaseModal';

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
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  const [useAmanta, setUseAmanta] = useState(false); // false = Purnimanta (North India default)
  const [useGps, setUseGps] = useState(selectedCity.stateCountry === 'GPS Location');
  const [useChoghadiyaNotif, setUseChoghadiyaNotif] = useState(false);

  // Purnima & Amavasya Reminder States
  const [purnimaNotif, setPurnimaNotif] = useState(true);
  const [amavasyaNotif, setAmavasyaNotif] = useState(true);
  const [reminderDays, setReminderDays] = useState<number>(1); // 0 (same day), 1, 2, or 5 days before

  // Customer Profile & Support Modal States
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [privacyPolicyVisible, setPrivacyPolicyVisible] = useState(false);
  const [adminModalVisible, setAdminModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const profile = await getUserProfile();
      setUserProfile(profile);

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
            setUserProfile(null);
            Alert.alert('✅ Data Cleared', 'Your account data and preferences have been completely deleted.');
          }
        }
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
            {[
              { id: 'HINDU', title: '🕉️ Hindu Calendar (Vikram Samvat)', desc: 'Standard Vedic Lunar/Solar Panchang with Tithis & Nakshatras' },
              { id: 'GLOBAL', title: '🌍 Gregorian Solar Calendar', desc: 'Standard Western Solar Dates & International Holidays' },
              { id: 'JAIN', title: '🪔 Jain Calendar (Vira Nirvana Samvat)', desc: 'Sacred Jain Parva Tithis (Aastham, Chaudas), Pachkhan & Fasting' },
              { id: 'SIKH', title: '☬ Nanakshahi Sikh Calendar', desc: 'Sikh Samvat 556, Gurpurabs, Shaheedi Diwas & Historic Dates' },
              { id: 'BUDDHIST', title: '☸️ Buddhist Lunar Calendar (BE 2568)', desc: 'Buddha Era 2568, Vesak, Asalha & Kathina Sacred Days' },
              { id: 'CHRISTIAN', title: '✝️ Christian Liturgical Calendar', desc: 'Feasts, Lent, Easter, Good Friday, Christmas & Seasons' },
              { id: 'PARSI', title: '🔥 Zoroastrian Parsi Calendar', desc: 'Shahenshahi / Fasli Yazdegerdi 1396 & Navroz Celebrations' },
            ].map(item => (
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

        {/* Lunar Month System (Amanta vs Purnimanta) Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {language === 'gu'
              ? '🌙 લૂનાર માસ પદ્ધતિ (અમાંત પદ્ધતિ)'
              : (language === 'hi' ? '🌙 लूनर मास पद्धति (अमांत / पूर्णिमांत)' : '🌙 Lunar Month System')}
          </Text>
          <Text style={styles.cardSubTitle}>Select Hindu Lunar Month calculation method for your region:</Text>

          <View style={styles.calSystemList}>
            {[
              { id: 'AMANTA', title: '🌾 Amanta (Gujarat / Maharashtra / South)', desc: 'Month ends on Amavasya. Shravana Month active during Vad/Krishna Paksha.' },
              { id: 'PURNIMANTA', title: '🏔️ Purnimanta (North India / Rajasthan / UP)', desc: 'Month ends on Purnima. Bhadrapada Month active during Krishna Paksha.' }
            ].map(item => (
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

        {/* 👤 Customer Profile Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👤 Customer Profile & Account</Text>

          {userProfile ? (
            <View style={styles.profileBox}>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileName}>
                  {userProfile.name} {userProfile.authType === 'GOOGLE' ? '🔴 (Google)' : '👤 (Guest)'}
                </Text>
                <Text style={styles.profileEmail}>{userProfile.email}</Text>
                <Text style={styles.profileDate}>
                  Member Since: {new Date(userProfile.createdAtIso).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.changeProfileBtn}
                onPress={() => setAuthModalVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.changeProfileText}>Switch User</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.signInBtn}
              onPress={() => setAuthModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.signInBtnText}>🔑 Sign In (Google or Guest)</Text>
            </TouchableOpacity>
          )}

          {/* Admin / Developer User DB Viewer */}
          <TouchableOpacity
            style={[styles.feedbackBtn, { backgroundColor: '#455A64', marginTop: 10 }]}
            onPress={() => setAdminModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.feedbackBtnText}>📊 View User Database & Logins</Text>
          </TouchableOpacity>
        </View>

        {/* 💬 Customer Feedback & Support Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💬 Support & Customer Feedback</Text>
          <Text style={styles.cardSubTitle}>
            {'Have a suggestion, bug report, or Panchang question? Send feedback directly to our team (Supports file attachments < 2MB, 3-day cooldown).'}
          </Text>

          <TouchableOpacity
            style={styles.feedbackBtn}
            onPress={() => setFeedbackModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.feedbackBtnText}>✉️ Send Feedback / Contact Us</Text>
          </TouchableOpacity>
        </View>

        {/* 🔐 Legal & Privacy Policy Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔐 Privacy & Legal Compliance</Text>
          <Text style={styles.cardSubTitle}>
            Google Play Developer Policy compliant data handling. We process location data locally and do not sell your personal data.
          </Text>

          <TouchableOpacity
            style={styles.policyBtn}
            onPress={() => setPrivacyPolicyVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.policyBtnText}>📜 View Official Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        {/* 🗑️ Google Play Compliant Account Deletion & Reset Card */}
        <View style={[styles.card, { borderColor: '#FFCDD2', backgroundColor: '#FFEBEE' }]}>
          <Text style={[styles.cardTitle, { color: '#C62828' }]}>🗑️ Account Deletion & Data Reset</Text>
          <Text style={styles.cardSubTitle}>
            Google Play Requirement: Delete your profile, saved custom reminders, and clear local storage data permanently.
          </Text>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDeleteAccountAndReset}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteBtnText}>⚠️ Delete Account & Erase All Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Auth Modal */}
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        onSuccess={(profile) => {
          setUserProfile(profile);
          setAuthModalVisible(false);
          Alert.alert('✅ Profile Saved', `Welcome, ${profile.name}! Your profile is now active.`);
        }}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        visible={feedbackModalVisible}
        onClose={() => setFeedbackModalVisible(false)}
        userEmail={userProfile?.email}
      />

      {/* Admin User Database & Logins Viewer Modal */}
      <AdminDatabaseModal
        visible={adminModalVisible}
        onClose={() => setAdminModalVisible(false)}
      />

      {/* Privacy Policy Modal */}
      <Modal visible={privacyPolicyVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { maxHeight: 580 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📜 Privacy Policy</Text>
              <TouchableOpacity onPress={() => setPrivacyPolicyVisible(false)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: Colors.maroon, marginBottom: 8 }}>
                🌐 Live GitHub Pages Privacy Policy URL:
              </Text>
              <View style={{ backgroundColor: '#FFF8E7', padding: 10, borderRadius: 6, marginBottom: 12 }}>
                <Text style={{ fontSize: 11, color: Colors.textPrimary, fontFamily: 'monospace' }}>
                  {'https://achalkumartrivedi.github.io/SoulRisePanchang/'}
                </Text>
              </View>

              <Text style={{ fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 6 }}>
                1. Data Collection & Location Usage
              </Text>
              <Text style={{ fontSize: 12, color: Colors.textSecondary, marginBottom: 10, lineHeight: 18 }}>
                SoulRise Panchang uses GPS location data solely to compute accurate city-specific sunrise, sunset, Tithi, Rahu Kalam, and planetary calculations. Location data is processed locally on your device and is NEVER sold or shared with third parties.
              </Text>

              <Text style={{ fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 6 }}>
                2. User Authentication & Profile
              </Text>
              <Text style={{ fontSize: 12, color: Colors.textSecondary, marginBottom: 10, lineHeight: 18 }}>
                Guest and Google Sign-In profile names are used to auto-populate your Janam Kundli charts and personalize your experience. Profile data remains under your full control.
              </Text>

              <Text style={{ fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 6 }}>
                3. Account Deletion Rights
              </Text>
              <Text style={{ fontSize: 12, color: Colors.textSecondary, marginBottom: 10, lineHeight: 18 }}>
                You can delete your account, wipe all stored local profiles, and clear all local data at any time under Settings ➔ Delete Account & Erase All Data.
              </Text>

              <Text style={{ fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 6 }}>
                4. Children's Privacy (COPPA)
              </Text>
              <Text style={{ fontSize: 12, color: Colors.textSecondary, marginBottom: 16, lineHeight: 18 }}>
                SoulRise Panchang is rated 3+ (Everyone). We do not knowingly collect personal data from children under 13.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border
  },
  profileName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary
  },
  profileEmail: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2
  },
  profileDate: {
    fontSize: 10,
    color: '#888888',
    marginTop: 2
  },
  changeProfileBtn: {
    backgroundColor: Colors.maroon,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6
  },
  changeProfileText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold'
  },
  signInBtn: {
    backgroundColor: Colors.maroon,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13
  },
  feedbackBtn: {
    backgroundColor: '#FF6F00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  feedbackBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13
  },
  policyBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  policyBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13
  },
  deleteBtn: {
    backgroundColor: '#D32F2F',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  deleteBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13
  }
});
