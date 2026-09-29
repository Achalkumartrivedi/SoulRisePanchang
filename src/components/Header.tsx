import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, StatusBar, Image } from 'react-native';
import { Colors } from '../theme/colors';
import { CityLocation, SamvatInfo } from '../types/panchang';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../types/language';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
}

const MONTH_NAMES_ENG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const Header: React.FC<HeaderProps> = ({
  currentDateIso,
  selectedCity,
  samvat,
  onOpenCityPicker,
  onOpenLanguagePicker,
  onPrevDay,
  onNextDay,
  onToday,
  onSelectDateIso
}) => {
  const { language, t } = useLanguage();
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const parts = currentDateIso.split('-');
  const currYear = parseInt(parts[0], 10) || 2026;
  const currMonth = (parseInt(parts[1], 10) || 9) - 1;
  const currDay = parseInt(parts[2], 10) || 11;

  const dateObj = new Date(currYear, currMonth, currDay);
  const formattedDateStr = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const todayIso = (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  })();

  const isTodayActive = currentDateIso === todayIso;

  // Date/Month/Year Modal State
  const [pickerVisible, setPickerVisible] = useState(false);
  const [tempYear, setTempYear] = useState(currYear);
  const [tempMonth, setTempMonth] = useState(currMonth);
  const [tempDay, setTempDay] = useState(currDay);

  const openPicker = () => {
    setTempYear(currYear);
    setTempMonth(currMonth);
    setTempDay(currDay);
    setPickerVisible(true);
  };

  const applyPickerSelection = (d: number, m: number, y: number) => {
    const daysInM = new Date(y, m + 1, 0).getDate();
    const validDay = Math.min(d, daysInM);
    const mStr = String(m + 1).padStart(2, '0');
    const dStr = String(validDay).padStart(2, '0');
    const targetIso = `${y}-${mStr}-${dStr}`;
    setPickerVisible(false);
    if (onSelectDateIso) {
      onSelectDateIso(targetIso);
    }
  };

  const daysInTempMonth = new Date(tempYear, tempMonth + 1, 0).getDate();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 8, (StatusBar.currentHeight || 24) + 12);

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      {/* 1. Brand Masthead */}
      <View style={styles.brandCrestHeader}>
        <View style={styles.brandCrestLeft}>
          <View style={styles.emblemWrapper}>
            <Image
              source={require('../assets/surya_emblem.png')}
              style={styles.emblemImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.brandTypographyCol}>
            <Text style={styles.brandTitleSoulRise}>SoulRise Panchang</Text>
            <Text style={styles.brandSacredSubtitle}>SACRED SOLAR-LUNAR ALMANAC</Text>
          </View>
        </View>

        <View style={styles.headerTopRightIcons}>
          {/* Notification Bell with Amber Dot */}
          <TouchableOpacity style={styles.iconCircleBtn} activeOpacity={0.75}>
            <Text style={styles.iconBellText}>🔔</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>

          {/* Profile Avatar */}
          <TouchableOpacity style={styles.avatarCircle} activeOpacity={0.75}>
            <Text style={styles.avatarText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Location & Flow Bar */}
      <View style={styles.flowAndControlsRow}>
        <Text style={styles.flowText}>Prashanta Muhurta Flow</Text>
        <View style={styles.utilityRightAlignedGroup}>
          {/* Location Chip */}
          <TouchableOpacity style={styles.topActionChip} onPress={onOpenCityPicker} activeOpacity={0.75}>
            <Text style={styles.topActionChipIcon}>📍</Text>
            <Text style={styles.topActionChipText} numberOfLines={1}>{selectedCity.name}</Text>
            <Text style={styles.topActionChipArrow}>▼</Text>
          </TouchableOpacity>

          {/* Language Chip */}
          <TouchableOpacity style={styles.topActionChip} onPress={onOpenLanguagePicker} activeOpacity={0.75}>
            <Text style={styles.topActionChipIcon}>🌐</Text>
            <Text style={styles.topActionChipText}>{currentLangObj.code.toUpperCase()}</Text>
            <Text style={styles.topActionChipArrow}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Date Switcher Navigation Capsule */}
      <View style={styles.dateCapsuleContainer}>
        <TouchableOpacity style={styles.navArrowBtn} onPress={onPrevDay} activeOpacity={0.7}>
          <Text style={styles.navArrowText}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateCenterBtn} onPress={openPicker} activeOpacity={0.8}>
          <Text style={styles.calendarIcon}>📅</Text>
          <Text style={styles.datePillText}>{formattedDateStr}</Text>
          <Text style={styles.dateChevron}>▼</Text>
          {isTodayActive ? (
            <View style={styles.todayActiveBadge}>
              <Text style={styles.todayActiveBadgeText}>TODAY</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.todayInactiveBadge} onPress={onToday} activeOpacity={0.75}>
              <Text style={styles.todayInactiveBadgeText}>TODAY</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.navArrowBtn} onPress={onNextDay} activeOpacity={0.7}>
          <Text style={styles.navArrowText}>›</Text>
        </TouchableOpacity>
      </View>


      {/* Full Date, Month & Year Selector Modal */}
      <Modal visible={pickerVisible} transparent animationType="fade" onRequestClose={() => setPickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📅 Select Date, Month & Year</Text>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              {/* Year Stepper Bar */}
              <Text style={styles.sectionLabel}>1. Select Year ({tempYear})</Text>
              <View style={styles.yearStepperRow}>
                <TouchableOpacity style={styles.stepperBtn} onPress={() => setTempYear(y => y - 5)}>
                  <Text style={styles.stepperText}>-5</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.stepperBtn} onPress={() => setTempYear(y => y - 1)}>
                  <Text style={styles.stepperText}>-1</Text>
                </TouchableOpacity>
                <View style={styles.yearBox}>
                  <Text style={styles.yearBoxText}>{tempYear}</Text>
                </View>
                <TouchableOpacity style={styles.stepperBtn} onPress={() => setTempYear(y => y + 1)}>
                  <Text style={styles.stepperText}>+1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.stepperBtn} onPress={() => setTempYear(y => y + 5)}>
                  <Text style={styles.stepperText}>+5</Text>
                </TouchableOpacity>
              </View>

              {/* Quick Year Chips */}
              <View style={styles.yearChipRow}>
                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(y => (
                  <TouchableOpacity
                    key={y}
                    style={[styles.yearChip, tempYear === y && styles.yearChipActive]}
                    onPress={() => setTempYear(y)}
                  >
                    <Text style={[styles.yearChipText, tempYear === y && styles.yearChipTextActive]}>{y}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Month Grid */}
              <Text style={styles.sectionLabel}>2. Select Month ({MONTH_NAMES_ENG[tempMonth]})</Text>
              <View style={styles.monthGrid}>
                {MONTH_NAMES_ENG.map((mName, idx) => (
                  <TouchableOpacity
                    key={mName}
                    style={[styles.monthTile, tempMonth === idx && styles.monthTileActive]}
                    onPress={() => setTempMonth(idx)}
                  >
                    <Text style={[styles.monthTileText, tempMonth === idx && styles.monthTileTextActive]}>
                      {mName.substring(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Day Grid */}
              <Text style={styles.sectionLabel}>3. Select Day ({tempDay})</Text>
              <View style={styles.dayGrid}>
                {Array.from({ length: daysInTempMonth }, (_, i) => i + 1).map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.dayTile, tempDay === d && styles.dayTileActive]}
                    onPress={() => setTempDay(d)}
                  >
                    <Text style={[styles.dayTileText, tempDay === d && styles.dayTileTextActive]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActionRow}>
              <TouchableOpacity style={styles.resetBtn} onPress={() => { onToday(); setPickerVisible(false); }}>
                <Text style={styles.resetBtnText}>🔄 Reset to Today</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={() => applyPickerSelection(tempDay, tempMonth, tempYear)}>
                <Text style={styles.applyBtnText}>✓ Apply Date</Text>
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
    gap: 12,
    flex: 1,
  },
  emblemWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2B0E14',
    borderWidth: 2,
    borderColor: '#DFB059',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  emblemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  brandTypographyCol: {
    justifyContent: 'center',
  },
  brandTitleSoulRise: {
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '700',
    color: '#2B0E14',
    letterSpacing: 0.2,
    lineHeight: 26,
  },
  brandSacredSubtitle: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#7D6A68',
    letterSpacing: 1.6,
    marginTop: 1,
    textTransform: 'uppercase',
  },
  headerTopRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: '#EADBCE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  iconBellText: {
    fontSize: 17,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: '#EADBCE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarText: {
    fontSize: 16,
    color: '#2B0E14',
  },
  flowAndControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 6,
  },
  flowText: {
    fontFamily: 'serif',
    fontStyle: 'italic',
    fontSize: 12.5,
    fontWeight: '500',
    color: '#7D6A68',
    letterSpacing: 0.3,
  },
  utilityRightAlignedGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topActionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#EADBCE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  topActionChipIcon: {
    fontSize: 12,
  },
  topActionChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2B0E14',
    maxWidth: 90,
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
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#EADBCE',
    paddingHorizontal: 10,
    paddingVertical: 6,
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
  dateCenterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calendarIcon: {
    fontSize: 13,
  },
  datePillText: {
    fontFamily: 'serif',
    fontSize: 14,
    fontWeight: '700',
    color: '#2B0E14',
    letterSpacing: 0.2,
  },
  dateChevron: {
    fontSize: 9,
    color: 'rgba(43, 14, 20, 0.6)',
  },
  todayActiveBadge: {
    backgroundColor: '#F0B829',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginLeft: 4,
  },
  todayActiveBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#2B0E14',
    letterSpacing: 0.5,
  },
  todayInactiveBadge: {
    backgroundColor: '#F0B829',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginLeft: 4,
  },
  todayInactiveBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#2B0E14',
    letterSpacing: 0.5,
  },


  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  modalCloseIcon: {
    fontSize: 18,
    color: '#888888',
    fontWeight: 'bold',
    padding: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
    marginTop: 10,
    marginBottom: 6,
  },
  yearStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepperBtn: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  stepperText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  yearBox: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  yearBoxText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.accentGold,
  },
  yearChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  yearChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  yearChipActive: {
    backgroundColor: Colors.maroon,
  },
  yearChipText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '600',
  },
  yearChipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  monthTile: {
    width: '23%',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  monthTileActive: {
    backgroundColor: Colors.maroon,
  },
  monthTileText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },
  monthTileTextActive: {
    color: Colors.accentGold,
    fontWeight: 'bold',
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  dayTile: {
    width: '12%',
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  dayTileActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  dayTileText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },
  dayTileTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    gap: 10,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555555',
  },
  applyBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: Colors.maroon,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.accentGold,
  },
});
