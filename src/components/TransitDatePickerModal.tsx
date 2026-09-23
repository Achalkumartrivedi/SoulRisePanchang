import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';

interface TransitDatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const MONTHS_LIST = [
  { en: 'Jan (01)', hi: 'जनवरी (01)', gu: 'જાન્યુઆરી (01)' },
  { en: 'Feb (02)', hi: 'फरवरी (02)', gu: 'ફેબ્રુઆરી (02)' },
  { en: 'Mar (03)', hi: 'मार्च (03)', gu: 'માર્ચ (03)' },
  { en: 'Apr (04)', hi: 'अप्रैल (04)', gu: 'એપ્રિલ (04)' },
  { en: 'May (05)', hi: 'मई (05)', gu: 'મે (05)' },
  { en: 'Jun (06)', hi: 'जून (06)', gu: 'જૂન (06)' },
  { en: 'Jul (07)', hi: 'जुलाई (07)', gu: 'જુલાઈ (07)' },
  { en: 'Aug (08)', hi: 'अगस्त (08)', gu: 'ઓગસ્ટ (08)' },
  { en: 'Sep (09)', hi: 'सितंबर (09)', gu: 'સપ્ટેમ્બર (09)' },
  { en: 'Oct (10)', hi: 'अक्टूबर (10)', gu: 'ઓક્ટોબર (10)' },
  { en: 'Nov (11)', hi: 'नवंबर (11)', gu: 'નવેમ્બર (11)' },
  { en: 'Dec (12)', hi: 'दिसंबर (12)', gu: 'ડિસેમ્બર (12)' }
];

const DAYS_LIST = Array.from({ length: 31 }, (_, i) => i + 1);

// Years list from 1950 to 2050
const CURRENT_YEAR = new Date().getFullYear();
const YEARS_LIST = Array.from({ length: 101 }, (_, i) => CURRENT_YEAR - 50 + i);

export const TransitDatePickerModal: React.FC<TransitDatePickerModalProps> = ({
  visible,
  onClose,
  selectedDate,
  onSelectDate
}) => {
  const { language } = useLanguage();

  const [day, setDay] = useState<number>(selectedDate.getDate());
  const [month, setMonth] = useState<number>(selectedDate.getMonth());
  const [year, setYear] = useState<number>(selectedDate.getFullYear());

  useEffect(() => {
    if (visible) {
      setDay(selectedDate.getDate());
      setMonth(selectedDate.getMonth());
      setYear(selectedDate.getFullYear());
    }
  }, [visible, selectedDate]);

  const getTxt = (guj: string, hin: string, eng: string) => {
    if (language === 'gu') return guj;
    if (language === 'hi') return hin;
    return eng;
  };

  const handleApply = () => {
    // Validate days in month
    const maxDays = new Date(year, month + 1, 0).getDate();
    const validDay = Math.min(day, maxDays);
    const newDate = new Date(year, month, validDay, 12, 0, 0);
    onSelectDate(newDate);
    onClose();
  };

  const handleSetToday = () => {
    const today = new Date();
    setDay(today.getDate());
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <View style={styles.modalCard}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                📅 {getTxt('ગોચર તારીખ પસંદ કરો', 'गोचर तिथि चुनें', 'Select Transit Date')}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
              {getTxt(
                'લાઇફ ઇવેન્ટ જોવા માટે તારીખ પસંદ કરો. આ તારીખ ફક્ત ગોચર ગ્રહોને અસર કરશે.',
                'जीवन की घटना देखने के लिए तिथि चुनें। यह तिथि केवल गोचर ग्रहों को प्रभावित करेगी।',
                'Select a date to inspect life events. This date will only affect Transit Planets.'
              )}
            </Text>

            {/* Date Pickers Section */}
            <View style={styles.pickersContainer}>
              {/* Day Column */}
              <View style={styles.pickerColumn}>
                <Text style={styles.columnLabel}>
                  {getTxt('દિવસ', 'दिन', 'Day')}
                </Text>
                <ScrollView style={styles.scrollList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  {DAYS_LIST.map(d => (
                    <TouchableOpacity
                      key={d}
                      style={[styles.itemChip, day === d && styles.selectedChip]}
                      onPress={() => setDay(d)}
                    >
                      <Text style={[styles.itemChipText, day === d && styles.selectedChipText]}>
                        {d.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Month Column */}
              <View style={[styles.pickerColumn, { flex: 1.4 }]}>
                <Text style={styles.columnLabel}>
                  {getTxt('મહિનો', 'महीना', 'Month')}
                </Text>
                <ScrollView style={styles.scrollList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  {MONTHS_LIST.map((m, idx) => {
                    const mName = language === 'gu' ? m.gu : language === 'hi' ? m.hi : m.en;
                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.itemChip, month === idx && styles.selectedChip]}
                        onPress={() => setMonth(idx)}
                      >
                        <Text style={[styles.itemChipText, month === idx && styles.selectedChipText]}>
                          {mName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Year Column */}
              <View style={styles.pickerColumn}>
                <Text style={styles.columnLabel}>
                  {getTxt('વર્ષ', 'वर्ष', 'Year')}
                </Text>
                <ScrollView style={styles.scrollList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  {YEARS_LIST.map(y => (
                    <TouchableOpacity
                      key={y}
                      style={[styles.itemChip, year === y && styles.selectedChip]}
                      onPress={() => setYear(y)}
                    >
                      <Text style={[styles.itemChipText, year === y && styles.selectedChipText]}>
                        {y}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Quick Today & Action Buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.todayBtn} onPress={handleSetToday}>
                <Text style={styles.todayBtnText}>
                  🔄 {getTxt('આજે (Today)', 'आज (Today)', 'Today')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                <Text style={styles.applyBtnText}>
                  ✓ {getTxt('તારીખ લાગુ કરો', 'तिथि लागू करें', 'Apply Date')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  container: {
    width: '100%',
    maxWidth: 400
  },
  modalCard: {
    backgroundColor: '#FFFDE7',
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: '#F57F17',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4E342E'
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#E0E0E0'
  },
  closeBtnText: {
    fontSize: 16,
    color: '#424242',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 12,
    color: '#616161',
    marginBottom: 14,
    lineHeight: 16
  },
  pickersContainer: {
    flexDirection: 'row',
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
    padding: 8,
    marginBottom: 16
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 4
  },
  columnLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E65100',
    textAlign: 'center',
    marginBottom: 6
  },
  scrollList: {
    flex: 1
  },
  itemChip: {
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#FFF9C4',
    alignItems: 'center'
  },
  selectedChip: {
    backgroundColor: '#E65100'
  },
  itemChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#37474F'
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10
  },
  todayBtn: {
    flex: 1,
    backgroundColor: '#FFF3E0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFB74D'
  },
  todayBtnText: {
    color: '#E65100',
    fontSize: 13,
    fontWeight: 'bold'
  },
  applyBtn: {
    flex: 1.2,
    backgroundColor: '#4E342E',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold'
  }
});
