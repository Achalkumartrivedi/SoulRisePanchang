import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { saveKundaliProfile, SavedKundaliProfile } from '../utils/profileStorage';
import { CitySelectionModal } from './CitySelectionModal';
import { DEFAULT_CITIES } from '../data/cities';

const DAYS_LIST = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MONTHS_LIST = [
  'January (01)', 'February (02)', 'March (03)', 'April (04)',
  'May (05)', 'June (06)', 'July (07)', 'August (08)',
  'September (09)', 'October (10)', 'November (11)', 'December (12)'
];
const YEARS_LIST = Array.from({ length: 111 }, (_, i) => (1920 + i).toString());
const HOURS_LIST = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const MINUTES_LIST = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

interface AddNewProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onProfileAdded: (profile: SavedKundaliProfile) => void;
}

export const AddNewProfileModal: React.FC<AddNewProfileModalProps> = ({
  visible,
  onClose,
  onProfileAdded
}) => {
  const { language } = useLanguage();
  const isHi = language === 'hi';
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 8, (StatusBar.currentHeight || 24) + 12);

  const [profileName, setProfileName] = useState('');
  const [dobDay, setDobDay] = useState('15');
  const [dobMonth, setDobMonth] = useState('08');
  const [dobYear, setDobYear] = useState('1995');
  const [tobHour, setTobHour] = useState('12');
  const [tobMinute, setTobMinute] = useState('00');
  const [city, setCity] = useState(DEFAULT_CITIES[0].name);
  const [lat, setLat] = useState<number>(DEFAULT_CITIES[0].latitude);
  const [lng, setLng] = useState<number>(DEFAULT_CITIES[0].longitude);

  // Picker Modals
  const [showDayModal, setShowDayModal] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [showHourModal, setShowHourModal] = useState(false);
  const [showMinuteModal, setShowMinuteModal] = useState(false);
  const [showCityPickerModal, setShowCityPickerModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    const nameVal = profileName.trim() || (isHi ? 'उपयोगकर्ता' : 'User');
    const dayNum = parseInt(dobDay, 10);
    const monthNum = parseInt(dobMonth, 10);
    const yearNum = parseInt(dobYear, 10);

    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
      Alert.alert(isHi ? 'त्रुटि' : 'Validation Error', isHi ? 'कृपया वैध जन्म तिथि (1-31) दर्ज करें।' : 'Please enter a valid birth day (1-31).');
      return;
    }
    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      Alert.alert(isHi ? 'त्रुटि' : 'Validation Error', isHi ? 'कृपया वैध जन्म महीना (1-12) दर्ज करें।' : 'Please enter a valid birth month (1-12).');
      return;
    }
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      Alert.alert(isHi ? 'त्रुटि' : 'Validation Error', isHi ? 'कृपया वैध जन्म वर्ष (1900-2100) दर्ज करें।' : 'Please enter a valid birth year (1900-2100).');
      return;
    }

    const rawH = parseInt(tobHour, 10) || 0;
    const rawM = parseInt(tobMinute, 10) || 0;

    setIsSaving(true);
    try {
      const updatedProfiles = await saveKundaliProfile({
        name: nameVal,
        dobDay: String(dayNum).padStart(2, '0'),
        dobMonth: String(monthNum).padStart(2, '0'),
        dobYear: String(yearNum),
        tobHour: String(rawH).padStart(2, '0'),
        tobMinute: String(rawM).padStart(2, '0'),
        cityName: city,
        lat: lat,
        lng: lng
      });

      const newProfile = updatedProfiles[0];
      setIsSaving(false);
      onProfileAdded(newProfile);
      onClose();
    } catch (err) {
      setIsSaving(false);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={[styles.container, { marginTop: topPadding }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              ➕ {isHi ? 'नया जन्म विवरण जोड़ें' : 'Add New Birth Profile'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
            <View style={styles.formCard}>
              <Text style={styles.formSectionTitle}>
                📝 {isHi ? 'जन्म विवरण दर्ज करें' : 'Enter Birth Details'}
              </Text>

              {/* 1. Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{isHi ? 'पूरा नाम (Full Name)' : 'Full Name'}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={isHi ? 'उदा. राहुल शर्मा' : 'Enter full name'}
                  placeholderTextColor={Colors.textMuted}
                  value={profileName}
                  onChangeText={setProfileName}
                />
              </View>

              {/* 2. Date of Birth (DOB) Dropdowns */}
              <Text style={styles.inputLabel}>{isHi ? 'जन्म तिथि (Date of Birth)' : 'Date of Birth (DOB)'}</Text>
              <View style={styles.dropdownRow}>
                <TouchableOpacity
                  style={[styles.dropdownField, styles.col3]}
                  onPress={() => setShowDayModal(true)}
                >
                  <Text style={styles.dropdownValText}>Day: {dobDay || 'DD'}</Text>
                  <Text style={styles.fieldArrow}>▼</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.dropdownField, styles.col3]}
                  onPress={() => setShowMonthModal(true)}
                >
                  <Text style={styles.dropdownValText}>
                    {MONTHS_LIST[parseInt(dobMonth, 10) - 1] || 'Month: MM'}
                  </Text>
                  <Text style={styles.fieldArrow}>▼</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.dropdownField, styles.col3]}
                  onPress={() => setShowYearModal(true)}
                >
                  <Text style={styles.dropdownValText}>Year: {dobYear || 'YYYY'}</Text>
                  <Text style={styles.fieldArrow}>▼</Text>
                </TouchableOpacity>
              </View>

              {/* 3. Time of Birth (TOB) Dropdowns */}
              <Text style={styles.inputLabel}>{isHi ? 'जन्म समय (Time of Birth 24-hr)' : 'Time of Birth (TOB 24-hr)'}</Text>
              <View style={styles.dropdownRow}>
                <TouchableOpacity
                  style={[styles.dropdownField, styles.col2]}
                  onPress={() => setShowHourModal(true)}
                >
                  <Text style={styles.dropdownValText}>Hour: {tobHour !== '' ? tobHour : 'HH'}</Text>
                  <Text style={styles.fieldArrow}>▼</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.dropdownField, styles.col2]}
                  onPress={() => setShowMinuteModal(true)}
                >
                  <Text style={styles.dropdownValText}>Min: {tobMinute !== '' ? tobMinute : 'MM'}</Text>
                  <Text style={styles.fieldArrow}>▼</Text>
                </TouchableOpacity>
              </View>

              {/* 4. Global Location Picker Dropdown */}
              <Text style={styles.inputLabel}>{isHi ? 'जन्म स्थान (Global Location)' : 'Global Location of Birth'}</Text>
              <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() => setShowCityPickerModal(true)}
                activeOpacity={0.8}
              >
                <View style={{ flex: 1 }}>
                  {city ? (
                    <>
                      <Text style={styles.dropdownCityName}>📍 {city}</Text>
                      <Text style={styles.dropdownCitySub}>
                        Lat: {lat.toFixed(4)}° • Lng: {lng.toFixed(4)}°
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={[styles.dropdownCityName, { color: Colors.textMuted }]}>
                        📍 {isHi ? 'जन्म स्थान चुनें' : 'Select Birth Location'}
                      </Text>
                      <Text style={styles.dropdownCitySub}>
                        {isHi ? 'शहर का नाम खोजें' : 'Tap to search birth city'}
                      </Text>
                    </>
                  )}
                </View>
                <Text style={styles.dropdownArrow}>🔍 Search Place ▼</Text>
              </TouchableOpacity>

              {/* Action Save Button */}
              <TouchableOpacity
                style={styles.saveSubmitBtn}
                onPress={handleSaveProfile}
                disabled={isSaving}
                activeOpacity={0.85}
              >
                <Text style={styles.saveSubmitBtnText}>
                  {isSaving ? (isHi ? 'सहेजा जा रहा है...' : 'Saving Profile...') : (isHi ? '💾 प्रोफाइल सहेजें एवं लोड करें' : '💾 Save & Load Profile')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>{isHi ? 'रद्द करें' : 'Cancel'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>

      {/* Day Picker Modal */}
      <Modal visible={showDayModal} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setShowDayModal(false)}>
          <View style={styles.dropdownOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownModalCard}>
                <Text style={styles.dropdownTitle}>{isHi ? 'जन्म तिथि चुनें (Day)' : 'Select Day of Birth'}</Text>
                <ScrollView style={{ maxHeight: 300, marginTop: 10 }}>
                  {DAYS_LIST.map(d => (
                    <TouchableOpacity
                      key={d}
                      style={[styles.pickerItem, dobDay === d && styles.pickerItemActive]}
                      onPress={() => {
                        setDobDay(d);
                        setShowDayModal(false);
                      }}
                    >
                      <Text style={[styles.pickerItemText, dobDay === d && styles.pickerItemTextActive]}>Day {d}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Month Picker Modal */}
      <Modal visible={showMonthModal} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setShowMonthModal(false)}>
          <View style={styles.dropdownOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownModalCard}>
                <Text style={styles.dropdownTitle}>{isHi ? 'जन्म महीना चुनें (Month)' : 'Select Month of Birth'}</Text>
                <ScrollView style={{ maxHeight: 300, marginTop: 10 }}>
                  {MONTHS_LIST.map((m, idx) => {
                    const mVal = (idx + 1).toString().padStart(2, '0');
                    return (
                      <TouchableOpacity
                        key={m}
                        style={[styles.pickerItem, dobMonth === mVal && styles.pickerItemActive]}
                        onPress={() => {
                          setDobMonth(mVal);
                          setShowMonthModal(false);
                        }}
                      >
                        <Text style={[styles.pickerItemText, dobMonth === mVal && styles.pickerItemTextActive]}>{m}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Year Picker Modal */}
      <Modal visible={showYearModal} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setShowYearModal(false)}>
          <View style={styles.dropdownOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownModalCard}>
                <Text style={styles.dropdownTitle}>{isHi ? 'जन्म वर्ष चुनें (Year)' : 'Select Year of Birth'}</Text>
                <ScrollView style={{ maxHeight: 300, marginTop: 10 }}>
                  {YEARS_LIST.map(y => (
                    <TouchableOpacity
                      key={y}
                      style={[styles.pickerItem, dobYear === y && styles.pickerItemActive]}
                      onPress={() => {
                        setDobYear(y);
                        setShowYearModal(false);
                      }}
                    >
                      <Text style={[styles.pickerItemText, dobYear === y && styles.pickerItemTextActive]}>{y}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Hour Picker Modal */}
      <Modal visible={showHourModal} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setShowHourModal(false)}>
          <View style={styles.dropdownOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownModalCard}>
                <Text style={styles.dropdownTitle}>{isHi ? 'जन्म घंटा चुनें (Hour)' : 'Select Hour of Birth (24-Hour)'}</Text>
                <ScrollView style={{ maxHeight: 300, marginTop: 10 }}>
                  {HOURS_LIST.map(h => (
                    <TouchableOpacity
                      key={h}
                      style={[styles.pickerItem, tobHour === h && styles.pickerItemActive]}
                      onPress={() => {
                        setTobHour(h);
                        setShowHourModal(false);
                      }}
                    >
                      <Text style={[styles.pickerItemText, tobHour === h && styles.pickerItemTextActive]}>{h}:00 Hours</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Minute Picker Modal */}
      <Modal visible={showMinuteModal} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setShowMinuteModal(false)}>
          <View style={styles.dropdownOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownModalCard}>
                <Text style={styles.dropdownTitle}>{isHi ? 'जन्म मिनट चुनें (Minute)' : 'Select Minute of Birth'}</Text>
                <ScrollView style={{ maxHeight: 300, marginTop: 10 }}>
                  {MINUTES_LIST.map(m => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.pickerItem, tobMinute === m && styles.pickerItemActive]}
                      onPress={() => {
                        setTobMinute(m);
                        setShowMinuteModal(false);
                      }}
                    >
                      <Text style={[styles.pickerItemText, tobMinute === m && styles.pickerItemTextActive]}>{m} Minutes</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Embedded Location Selection Picker Modal */}
      <CitySelectionModal
        visible={showCityPickerModal}
        onClose={() => setShowCityPickerModal(false)}
        onSelectCity={(selectedLoc) => {
          const cleanName = selectedLoc.name.replace(/\s*\(GPS\)/gi, '').trim() || selectedLoc.name;
          setCity(cleanName);
          if (selectedLoc.latitude) setLat(selectedLoc.latitude);
          if (selectedLoc.longitude) setLng(selectedLoc.longitude);
          setShowCityPickerModal(false);
        }}
        selectedCity={{
          name: city,
          hindiName: city,
          stateCountry: '',
          latitude: lat,
          longitude: lng,
          timeZoneId: 'Asia/Kolkata'
        }}
        title={isHi ? 'जन्म स्थान चुनें' : 'Select Birth Place'}
        persistToGlobalStorage={false}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end'
  },
  container: {
    backgroundColor: '#FFFDF6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#580017',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  formContent: {
    padding: 16
  },
  formCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16
  },
  formSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 10
  },
  inputGroup: {
    marginBottom: 10
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
    marginTop: 4
  },
  textInput: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.textPrimary
  },
  dropdownRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  dropdownField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  dropdownValText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary
  },
  fieldArrow: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginLeft: 4
  },
  col3: {
    flex: 1
  },
  col2: {
    flex: 1
  },
  dropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.maroon,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12
  },
  dropdownCityName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  dropdownCitySub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1
  },
  dropdownArrow: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  saveSubmitBtn: {
    backgroundColor: '#580017',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#580017',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4
  },
  saveSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center'
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B'
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  dropdownModalCard: {
    width: '100%',
    maxHeight: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border
  },
  dropdownTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 10
  },
  pickerItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4
  },
  pickerItemActive: {
    backgroundColor: '#FFF8E7'
  },
  pickerItemText: {
    fontSize: 13,
    color: Colors.textPrimary
  },
  pickerItemTextActive: {
    fontWeight: 'bold',
    color: Colors.maroon
  }
});
