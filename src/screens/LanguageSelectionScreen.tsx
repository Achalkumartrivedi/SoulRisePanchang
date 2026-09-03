import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Colors } from '../theme/colors';
import { SUPPORTED_LANGUAGES, LanguageCode, LanguageOption } from '../types/language';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSelectionScreenProps {
  onComplete: () => void;
}

export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({ onComplete }) => {
  const { language, setLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(language || 'hinglish');

  const handleConfirmLanguage = async () => {
    await setLanguage(selectedLang);
    onComplete();
  };

  const selectedOption = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.maroon} />

      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <Text style={styles.omIcon}>🕉️</Text>
        <Text style={styles.appName}>SoulRise Panchang</Text>
        <Text style={styles.headerTitle}>Choose Your Language / भाषा चुनें</Text>
        <Text style={styles.headerSubtitle}>
          Select your preferred language to customize Panchang, Festivals, Horoscope, Reminders & Settings.
        </Text>
      </View>

      {/* Vertical Language List in Native Scripts */}
      <ScrollView contentContainerStyle={styles.scrollList} showsVerticalScrollIndicator={false}>
        {SUPPORTED_LANGUAGES.map((item: LanguageOption) => {
          const isSelected = item.code === selectedLang;
          return (
            <TouchableOpacity
              key={item.code}
              style={[styles.langCard, isSelected && styles.langCardSelected]}
              onPress={() => setSelectedLang(item.code)}
              activeOpacity={0.8}
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

      {/* Bottom Fixed Action Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleConfirmLanguage}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>
            Continue in {selectedOption.name} ({selectedOption.nativeName}) ➔
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBg
  },
  headerBanner: {
    backgroundColor: Colors.maroon,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6
  },
  omIcon: {
    fontSize: 32,
    marginBottom: 4
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 0.5
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 6
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#FFE0B2',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
    paddingHorizontal: 10
  },
  scrollList: {
    padding: 16,
    paddingBottom: 90
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 10
  },
  continueBtn: {
    backgroundColor: Colors.maroon,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold'
  }
});
