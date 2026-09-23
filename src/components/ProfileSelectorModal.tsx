import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import { SavedKundaliProfile, getSavedProfiles } from '../utils/profileStorage';
import { calculateBirthKundali } from '../engine/kundaliEngine';
import { ALL_27_NAKSHATRAS } from '../engine/navtaraEngine';
import { AddNewProfileModal } from './AddNewProfileModal';

interface ProfileSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectProfile: (profile: SavedKundaliProfile, nakshatraIndex: number) => void;
  activeProfileId?: string | null;
}

export const ProfileSelectorModal: React.FC<ProfileSelectorModalProps> = ({
  visible,
  onClose,
  onSelectProfile,
  activeProfileId
}) => {
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 8, (StatusBar.currentHeight || 24) + 12);

  const [profiles, setProfiles] = useState<SavedKundaliProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddNewModal, setShowAddNewModal] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      getSavedProfiles().then(list => {
        setProfiles(list);
        setLoading(false);
      });
    }
  }, [visible]);

  const getTxt = (guj: string, hin: string, eng: string) => {
    if (language === 'gu') return guj;
    if (language === 'hi') return hin;
    return eng;
  };

  const getProfileNakshatra = (profile: SavedKundaliProfile) => {
    try {
      const day = parseInt(profile.dobDay, 10) || 1;
      const month = (parseInt(profile.dobMonth, 10) || 1) - 1;
      const year = parseInt(profile.dobYear, 10) || 1990;
      const dob = new Date(year, month, day);
      const tobH = parseInt(profile.tobHour, 10) || 12;
      const tobM = parseInt(profile.tobMinute, 10) || 0;

      const kundali = calculateBirthKundali(
        profile.name,
        dob,
        tobH,
        tobM,
        profile.cityName || 'Surat',
        profile.lat || 21.1702,
        profile.lng || 72.8311
      );

      const bornNakName = kundali.particulars?.bornNakshatra || 'Ashwini';
      const matched = ALL_27_NAKSHATRAS.find(n =>
        bornNakName.toLowerCase().includes(n.eng.toLowerCase()) ||
        n.eng.toLowerCase().includes(bornNakName.toLowerCase())
      );

      return {
        nakName: bornNakName,
        nakIndex: matched ? matched.index : 1
      };
    } catch (e) {
      return { nakName: 'Ashwini', nakIndex: 1 };
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <SafeAreaView style={[styles.modalContainer, { marginTop: topPadding }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              👤 {getTxt('પસંદ કરેલ પ્રોફાઇલ લોડ કરો', 'सेव की गई प्रोफाइल लोड करें', 'Load Saved Profile')}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loaderBox}>
              <ActivityIndicator size="large" color="#580017" />
              <Text style={styles.loaderText}>
                {getTxt('પ્રોફાઇલ લોડ થઈ રહી છે...', 'प्रोफाइल लोड हो रही हैं...', 'Loading saved profiles...')}
              </Text>
            </View>
          ) : profiles.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>👤</Text>
              <Text style={styles.emptyTitle}>
                {getTxt('કોઈ સેવ કરેલ પ્રોફાઇલ નથી', 'कोई सहेजी गई प्रोफाइल नहीं मिली', 'No Saved Profiles Found')}
              </Text>

              <Text style={styles.emptyDesc}>
                {getTxt(
                  'તમે નીચેના બટન પર ક્લિક કરીને નવી પ્રોફાઇલ ઉમેરી શકો છો.',
                  'आप नीचे दिए गए बटन पर क्लिक करके नई प्रोफाइल जोड़ सकते हैं।',
                  'Tap the button below to add a new birth profile.'
                )}
              </Text>

              <TouchableOpacity
                style={{ backgroundColor: '#580017', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, marginTop: 14 }}
                onPress={() => setShowAddNewModal(true)}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' }}>
                  ➕ {getTxt('નવી પ્રોફાઇલ ઉમેરો', 'नया जन्म प्रोफाइल जोड़ें', 'Add New Birth Profile')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
              {profiles.map(p => {
                const isSelected = p.id === activeProfileId;
                const { nakName, nakIndex } = getProfileNakshatra(p);
                const nakObj = ALL_27_NAKSHATRAS.find(n => n.index === nakIndex) || ALL_27_NAKSHATRAS[0];
                const displayNak = language === 'gu' ? nakObj.guj : language === 'hi' ? nakObj.hin : nakObj.eng;

                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.profileCard, isSelected && styles.profileCardActive]}
                    onPress={() => onSelectProfile(p, nakIndex)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.avatarBox}>
                      <Text style={styles.avatarText}>👤</Text>
                    </View>

                    <View style={styles.profileInfo}>
                      <Text style={styles.profileName}>{p.name}</Text>
                      <Text style={styles.profileDetails}>
                        📅 {p.dobDay}/{p.dobMonth}/{p.dobYear} • 📍 {p.cityName || 'India'}
                      </Text>

                      <View style={styles.nakBadge}>
                        <Text style={styles.nakBadgeText}>
                          ✨ {getTxt('જન્મ નક્ષત્ર', 'जन्म नक्षत्र', 'Janma Nakshatra')}: {nakIndex}. {displayNak}
                        </Text>
                      </View>
                    </View>

                    {isSelected && (
                      <View style={styles.selectedIconChip}>
                        <Text style={styles.selectedIconText}>✓ Active</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={{ backgroundColor: '#580017', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 8, marginBottom: 8 }}
                onPress={() => setShowAddNewModal(true)}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' }}>
                  ➕ {getTxt('નવી પ્રોફાઇલ ઉમેરો', 'नया जन्म प्रोफाइल जोड़ें', 'Add New Birth Profile')}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>{getTxt('રદ કરો', 'रद्द करें', 'Cancel')}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <AddNewProfileModal
        visible={showAddNewModal}
        onClose={() => setShowAddNewModal(false)}
        onProfileAdded={async (newProfile) => {
          setShowAddNewModal(false);
          setLoading(true);
          const updated = await getSavedProfiles();
          setProfiles(updated);
          setLoading(false);
          const { nakIndex } = getProfileNakshatra(newProfile);
          onSelectProfile(newProfile, nakIndex);
        }}
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
  modalContainer: {
    backgroundColor: '#FFFDF6',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#580017',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
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
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  loaderBox: {
    padding: 32,
    alignItems: 'center'
  },
  loaderText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14
  },
  emptyBox: {
    padding: 32,
    alignItems: 'center'
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 8
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 6
  },
  emptyDesc: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center'
  },
  scrollList: {
    padding: 16
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2
  },
  profileCardActive: {
    borderColor: '#580017',
    borderWidth: 2,
    backgroundColor: '#FFF8F9'
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  avatarText: {
    fontSize: 22
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#212121'
  },
  profileDetails: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2
  },
  nakBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6
  },
  nakBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D84315'
  },
  selectedIconChip: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 8
  },
  selectedIconText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  cancelBtn: {
    backgroundColor: '#EEEEEE',
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  cancelBtnText: {
    color: '#424242',
    fontSize: 14,
    fontWeight: '700'
  }
});
