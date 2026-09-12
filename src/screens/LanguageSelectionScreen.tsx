import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal
} from 'react-native';
import { Colors } from '../theme/colors';
import { SUPPORTED_LANGUAGES, LanguageCode, LanguageOption } from '../types/language';
import { useLanguage } from '../context/LanguageContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LanguageSelectionScreenProps {
  onComplete: () => void;
}

export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({ onComplete }) => {
  const { language, setLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(language || 'hinglish');
  const [pendingLang, setPendingLang] = useState<LanguageOption | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 8, (StatusBar.currentHeight || 24) + 12);
  const bottomPadding = Math.max(insets.bottom + 20, 40);

  const handleCardPress = (item: LanguageOption) => {
    setSelectedLang(item.code);
    setPendingLang(item);
    setShowConfirmModal(true);
  };

  const handleConfirmAndProceed = async () => {
    if (pendingLang) {
      await setLanguage(pendingLang.code);
    } else {
      await setLanguage(selectedLang);
    }
    setShowConfirmModal(false);
    onComplete();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.maroon} />

      {/* Header Banner */}
      <View style={[styles.headerBanner, { paddingTop: topPadding }]}>
        <Text style={styles.omIcon}>🕉️</Text>
        <Text style={styles.appName}>SoulRise Panchang</Text>
        <Text style={styles.headerTitle}>Choose Your Language / भाषा चुनें</Text>
        <Text style={styles.headerSubtitle}>
          Select your preferred language to customize Panchang, Festivals, Horoscope, Reminders & Settings.
        </Text>
      </View>

      {/* Full Screen Scrollable Language Cards List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollList, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.tapInstructionText}>
          👉 Tap any language to choose and continue:
        </Text>

        {SUPPORTED_LANGUAGES.map((item: LanguageOption) => {
          const isSelected = item.code === selectedLang;
          return (
            <TouchableOpacity
              key={item.code}
              style={[styles.langCard, isSelected && styles.langCardSelected]}
              onPress={() => handleCardPress(item)}
              activeOpacity={0.75}
            >
              <View style={styles.langLeftRow}>
                <Text style={styles.flagIcon}>{item.flag}</Text>
                <View style={styles.textContainer}>
                  <View style={styles.nameHeaderRow}>
                    <Text style={[styles.nativeScriptText, isSelected && styles.nativeScriptSelected]}>
                      {item.nativeName}
                    </Text>
                    {item.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.englishSubText}>{item.name}</Text>
                </View>
              </View>

              {/* Selection Radio Circle */}
              <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                {isSelected && <View style={styles.radioInnerDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Language Confirmation Popup Modal */}
      <Modal
        visible={showConfirmModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.confirmHeader}>
              <Text style={styles.confirmFlag}>{pendingLang?.flag || '🌐'}</Text>
              <Text style={styles.confirmTitle}>
                {pendingLang?.name || 'Selected Language'}
              </Text>
            </View>

            <Text style={styles.confirmNativeSub}>
              {pendingLang?.nativeName}
            </Text>

            <Text style={styles.confirmMessage}>
              Are you sure you want to continue with '{pendingLang?.name}'?
            </Text>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowConfirmModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleConfirmAndProceed}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmBtnText}>Continue ➔</Text>
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
    backgroundColor: Colors.creamBg
  },
  headerBanner: {
    backgroundColor: Colors.maroon,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6
  },
  omIcon: {
    fontSize: 28,
    marginBottom: 4
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 0.5
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#FFE0B2',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 15,
    paddingHorizontal: 10
  },
  tapInstructionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 12,
    textAlign: 'center'
  },
  scrollList: {
    padding: 16
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    elevation: 2
  },
  langCardSelected: {
    backgroundColor: '#FFF8E7',
    borderColor: Colors.maroon,
    borderWidth: 2
  },
  langLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  flagIcon: {
    fontSize: 28,
    marginRight: 14
  },
  textContainer: {
    flex: 1
  },
  nameHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  nativeScriptText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary
  },
  nativeScriptSelected: {
    color: Colors.maroon
  },
  englishSubText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2
  },
  defaultBadge: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8
  },
  defaultBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold'
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#B0BEC5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  radioCircleSelected: {
    borderColor: Colors.maroon,
    backgroundColor: '#FFFFFF'
  },
  radioInnerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.maroon
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  confirmCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    elevation: 10
  },
  confirmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  confirmFlag: {
    fontSize: 32,
    marginRight: 10
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.maroon
  },
  confirmNativeSub: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 16
  },
  confirmMessage: {
    fontSize: 15,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 8
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: Colors.maroon,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
    elevation: 3
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF'
  }
});
