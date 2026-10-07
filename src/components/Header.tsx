import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Svg, { Path, Circle, Rect, Ellipse } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Fonts } from '../constants/typography';
import { CityLocation, SamvatInfo } from '../types/panchang';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../types/language';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DatePickerModal } from './DatePickerModal';
import { ReminderBellModal } from './ReminderBellModal';
import { ProfileModal } from './ProfileModal';
import { getLocalizedDateTitle } from '../i18n/kaalMuhuratI18n';

const LocationPinIcon = () => (
  <Svg width={11} height={13} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      fill="#D32F2F"
    />
    <Circle cx="12" cy="9" r="2.8" fill="#FFFFFF" />
  </Svg>
);

const GlobeIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9.5" stroke="#0288D1" strokeWidth="1.8" />
    <Path
      d="M3 12h18M3.6 8h16.8M3.6 16h16.8"
      stroke="#0288D1"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <Ellipse cx="12" cy="12" rx="4.8" ry="9.5" stroke="#0288D1" strokeWidth="1.6" />
  </Svg>
);

const DateCalendarIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="17" rx="3.5" fill="#FFFFFF" stroke="#2B0E14" strokeWidth="1.6" />
    <Path d="M3 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v5H3V4z" fill="#2B0E14" />
    <Path d="M8 1.5v3M16 1.5v3" stroke="#DFB059" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="8" cy="13" r="1.1" fill="#7D6A68" />
    <Circle cx="12" cy="13" r="1.1" fill="#7D6A68" />
    <Circle cx="16" cy="13" r="1.1" fill="#7D6A68" />
    <Circle cx="8" cy="17" r="1.1" fill="#7D6A68" />
    <Circle cx="12" cy="17" r="1.1" fill="#DFB059" />
    <Circle cx="16" cy="17" r="1.1" fill="#7D6A68" />
  </Svg>
);

interface HeaderProps {
  currentDateIso: string;
  selectedCity: CityLocation;
  samvat: SamvatInfo;
  onOpenCityPicker: () => void;
  onOpenLanguagePicker: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onSelectDateIso?: (dateIso: string) => void;
  onNavigateToReminders?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDateIso,
  selectedCity,
  samvat,
  onOpenCityPicker,
  onOpenLanguagePicker,
  onPrevDay,
  onNextDay,
  onToday,
  onSelectDateIso,
  onNavigateToReminders
}) => {
  const { language, t } = useLanguage();
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const parts = currentDateIso.split('-');
  const currYear = parseInt(parts[0], 10) || 2026;
  const currMonth = (parseInt(parts[1], 10) || 9) - 1;
  const currDay = parseInt(parts[2], 10) || 11;

  const dateObj = new Date(currYear, currMonth, currDay);
  const formattedDateStr = getLocalizedDateTitle(dateObj, language, true);

  const todayIso = (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  })();

  const isTodayActive = currentDateIso === todayIso;

  // Modal Visibility States
  const [pickerVisible, setPickerVisible] = useState(false);
  const [bellModalVisible, setBellModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const openPicker = () => {
    setPickerVisible(true);
  };
  const insets = useSafeAreaInsets();
  // Avoid double status bar inset since SafeAreaView in AppNavigator already provides top inset
  const topPadding = 6;

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      {/* 1. Brand Masthead */}
      <View style={styles.brandCrestHeader}>
        <View style={styles.brandCrestLeft}>
          <View style={styles.emblemWrapper}>
            <Svg width={25} height={25} viewBox="0 0 24 24" fill="#FFD700">
              <Path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
            </Svg>
          </View>
          <View style={styles.brandTypographyCol}>
            <Text style={styles.brandTitleSoulRise} numberOfLines={1} ellipsizeMode="tail">
              SoulRise Panchang
            </Text>
            <Text style={styles.brandSacredSubtitle} numberOfLines={1}>
              SACRED SOLAR-LUNAR ALMANAC
            </Text>
          </View>
        </View>

        <View style={styles.headerTopRightIcons}>
          {/* Notification Bell with Amber Dot */}
          <TouchableOpacity
            style={styles.iconCircleBtn}
            onPress={() => setBellModalVisible(true)}
            activeOpacity={0.75}
            hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#2B0E14" strokeWidth="1.8">
              <Path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <View style={styles.notificationDot} />
          </TouchableOpacity>

          {/* Profile Avatar */}
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => setProfileModalVisible(true)}
            activeOpacity={0.75}
            hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#2B0E14" strokeWidth="1.8">
              <Path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Location & Flow Bar */}
      <View style={styles.flowAndControlsRow}>
        <Text style={styles.flowText} numberOfLines={1}>
          {language === 'hi' ? 'प्रशांत मुहूर्त प्रवाह' : 'Prashanta Muhurta Flow'}
        </Text>
        <View style={styles.utilityRightAlignedGroup}>
          {/* Location Chip */}
          <TouchableOpacity
            style={styles.topActionChip}
            onPress={onOpenCityPicker}
            activeOpacity={0.75}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <LocationPinIcon />
            <Text style={styles.topActionChipText} numberOfLines={1}>{selectedCity.name}</Text>
            <Text style={styles.topActionChipArrow}>▼</Text>
          </TouchableOpacity>

          {/* Language Chip */}
          <TouchableOpacity
            style={styles.topActionChip}
            onPress={onOpenLanguagePicker}
            activeOpacity={0.75}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <GlobeIcon />
            <Text style={styles.topActionChipText}>{currentLangObj.code.toUpperCase()}</Text>
            <Text style={styles.topActionChipArrow}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Date Switcher Navigation Capsule */}
      <View style={styles.dateCapsuleContainer}>
        <TouchableOpacity
          style={styles.navArrowBtn}
          onPress={onPrevDay}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.navArrowText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.dateCenterWrapper}>
          <TouchableOpacity
            style={styles.dateCenterBtn}
            onPress={openPicker}
            activeOpacity={0.8}
            hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
          >
            <DateCalendarIcon />
            <Text style={styles.datePillText}>{formattedDateStr}</Text>
            <Text style={styles.dateChevron}>▼</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.todayPillBtn, isTodayActive && styles.todayPillBtnActive]}
            onPress={onToday}
            activeOpacity={0.75}
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
          >
            <Text style={styles.todayPillBtnText}>
              {language === 'hi' ? 'आज' : language === 'gu' ? 'આજે' : language === 'mr' ? 'आज' : 'TODAY'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.navArrowBtn}
          onPress={onNextDay}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.navArrowText}>›</Text>
        </TouchableOpacity>
      </View>


      {/* Sacred Monthly Calendar Grid Date Picker Modal */}
      <DatePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        selectedDateIso={currentDateIso}
        onSelectDateIso={(iso) => {
          if (onSelectDateIso) {
            onSelectDateIso(iso);
          }
        }}
        onToday={onToday}
      />

      {/* Reminder Bell & Alarms Modal */}
      <ReminderBellModal
        visible={bellModalVisible}
        onClose={() => setBellModalVisible(false)}
        onNavigateToReminders={onNavigateToReminders}
      />

      {/* Customer Profile & Account Modal */}
      <ProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  brandCrestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 8,
  },
  brandCrestLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  emblemWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2B0E14',
    borderWidth: 1.5,
    borderColor: '#DFB059',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  emblemImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  brandTypographyCol: {
    justifyContent: 'center',
    flex: 1,
  },
  brandTitleSoulRise: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 22,
    color: '#2B0E14',
    letterSpacing: 0.5,
    lineHeight: 25,
  },
  brandSacredSubtitle: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 8,
    color: '#7D6A68',
    letterSpacing: 1.2,
    marginTop: 1,
    textTransform: 'uppercase',
  },
  headerTopRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: '#EADBCE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  iconBellText: {
    fontSize: 16,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#F59E0B',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: '#EADBCE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarText: {
    fontSize: 15,
    color: '#2B0E14',
  },
  flowAndControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
    marginBottom: 4,
  },
  flowText: {
    fontFamily: Fonts.cormorantMediumItalic,
    fontSize: 12.5,
    color: '#7D6A68',
    letterSpacing: 0.3,
    flex: 1,
  },
  utilityRightAlignedGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topActionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#EADBCE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  topActionChipIcon: {
    fontSize: 11,
  },
  topActionChipText: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 11,
    color: '#2B0E14',
    maxWidth: 80,
  },
  topActionChipArrow: {
    fontSize: 8,
    color: '#2B0E14',
    opacity: 0.6,
  },
  dateCapsuleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#EADBCE',
    paddingHorizontal: 8,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  navArrowBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  navArrowText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(43, 14, 20, 0.8)',
    lineHeight: 20,
  },
  dateCenterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateCenterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calendarIcon: {
    fontSize: 13,
  },
  datePillText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
    color: '#2B0E14',
    letterSpacing: 0.2,
  },
  dateChevron: {
    fontSize: 9,
    color: 'rgba(43, 14, 20, 0.6)',
  },
  todayPillBtn: {
    backgroundColor: '#DFB059',
    paddingHorizontal: 12,
    paddingVertical: 4.5,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  todayPillBtnActive: {
    backgroundColor: '#D9A443',
  },
  todayPillBtnText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    color: '#2B0E14',
    letterSpacing: 0.8,
  },
});

