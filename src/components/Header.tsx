import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, StatusBar } from 'react-native';
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
      {/* Top Title Bar: Brand + Quick City/SAN pills + Bell + Profile */}
      <View style={styles.topRow}>
        <View style={styles.titleArea}>
          <View style={styles.brandRow}>
            <Text style={styles.brandStar}>✦</Text>
            <Text style={styles.appTitle}>SoulRise</Text>
          </View>
          <View style={styles.quickChipsRow}>
            <TouchableOpacity style={styles.quickChip} onPress={onOpenCityPicker} activeOpacity={0.75}>
              <Text style={styles.quickChipIcon}>📍</Text>
              <Text style={styles.quickChipText}>{selectedCity.name.toUpperCase()}</Text>
              <Text style={styles.quickChipArrow}>⌄</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickChip} onPress={() => {}} activeOpacity={0.75}>
              <Text style={styles.quickChipText}>SAN</Text>
              <Text style={styles.quickChipArrow}>⌄</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerRightActions}>
          {/* Notification Bell with Golden Dot */}
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

      {/* Scrubber / Pill Navigation Bar */}
      <View style={styles.scrubberRow}>
        {/* Language Pill */}
        <TouchableOpacity style={styles.scrubberChip} onPress={onOpenLanguagePicker} activeOpacity={0.75}>
          <Text style={styles.scrubberIcon}>文A</Text>
          <Text style={styles.scrubberText}>ગુજરાતી / ENG</Text>
        </TouchableOpacity>

        {/* Location Pill */}
        <TouchableOpacity style={styles.scrubberChip} onPress={onOpenCityPicker} activeOpacity={0.75}>
          <Text style={styles.scrubberIcon}>🧭</Text>
          <Text style={styles.scrubberText} numberOfLines={1}>{selectedCity.name}, India</Text>
          <Text style={styles.quickChipArrow}>⌄</Text>
        </TouchableOpacity>

        {/* Date Selector Pill */}
        <View style={styles.dateSelectorCapsule}>
          <TouchableOpacity style={styles.arrowBtn} onPress={onPrevDay} activeOpacity={0.7}>
            <Text style={styles.arrowText}>◀</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dateTextTouch} onPress={openPicker} activeOpacity={0.8}>
            <Text style={styles.datePillText}>📅 {dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} ▾</Text>
            {isTodayActive && <Text style={styles.todaySmallBadge}>Today</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.arrowBtn} onPress={onNextDay} activeOpacity={0.7}>
            <Text style={styles.arrowText}>▶</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#21040B', // Surface Container Lowest
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 220, 161, 0.16)',
    elevation: 8,
    shadowColor: '#180207',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleArea: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandStar: {
    fontSize: 16,
    color: '#FFDCA1',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFDCA1',
    letterSpacing: 0.8,
  },
  quickChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#431F26', // surface-container-high
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  quickChipIcon: {
    fontSize: 11,
  },
  quickChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D5C5A5',
    letterSpacing: 0.8,
  },
  quickChipArrow: {
    fontSize: 10,
    color: '#9E8F78',
    marginLeft: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#37151C',
  },
  iconBellText: {
    fontSize: 18,
  },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFB800',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFDCA1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarText: {
    fontSize: 16,
  },
  scrubberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
  },
  scrubberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#431F26',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: '#180207',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  scrubberIcon: {
    fontSize: 12,
    color: '#FFDCA1',
    fontWeight: '700',
  },
  scrubberText: {
    fontSize: 11,
    color: '#D5C5A5',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  dateSelectorCapsule: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#431F26',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.25)',
  },
  dateTextTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  datePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFDCA1',
  },
  todaySmallBadge: {
    backgroundColor: '#FFB800',
    color: '#412D00',
    fontSize: 8.5,
    fontWeight: '800',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
    textTransform: 'uppercase',
  },
  arrowBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  arrowText: {
    fontSize: 12,
    color: '#FFB800',
    fontWeight: '800',
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
