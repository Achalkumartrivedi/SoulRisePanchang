import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { CityLocation, SamvatInfo } from '../types/panchang';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../types/language';

interface HeaderProps {
  currentDateIso: string;
  selectedCity: CityLocation;
  samvat: SamvatInfo;
  onOpenCityPicker: () => void;
  onOpenLanguagePicker: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDateIso,
  selectedCity,
  samvat,
  onOpenCityPicker,
  onOpenLanguagePicker,
  onPrevDay,
  onNextDay,
  onToday
}) => {
  const { language, t } = useLanguage();
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const dateObj = new Date(currentDateIso + 'T00:00:00');
  const formattedDateStr = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <View style={styles.container}>
      {/* Top Title Bar */}
      <View style={styles.topRow}>
        <View style={styles.titleArea}>
          <Text style={styles.appTitle} numberOfLines={1} adjustsFontSizeToFit>🕉️ {t('appName')}</Text>
          <Text style={styles.samvatSubtitle} numberOfLines={1} adjustsFontSizeToFit>
            {language === 'hi' || language === 'hinglish' ? samvat.monthNameHindi : samvat.monthName} • {samvat.vikramSamvat} {language === 'hi' || language === 'hinglish' ? 'विक्रम' : 'Vikram Samvat'}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          {/* 🌐 Language Switcher Button */}
          <TouchableOpacity style={styles.langBadge} onPress={onOpenLanguagePicker} activeOpacity={0.7}>
            <Text style={styles.langFlag}>{currentLangObj.flag}</Text>
            <Text style={styles.langText} numberOfLines={1} adjustsFontSizeToFit>{currentLangObj.name}</Text>
          </TouchableOpacity>

          {/* 📍 City Location Button */}
          <TouchableOpacity style={styles.cityBadge} onPress={onOpenCityPicker} activeOpacity={0.7}>
            <Text style={styles.cityIcon}>📍</Text>
            <View>
              <Text style={styles.cityName} numberOfLines={1} adjustsFontSizeToFit>{selectedCity.name}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Navigation Bar */}
      <View style={styles.dateBar}>
        <TouchableOpacity style={styles.arrowBtn} onPress={onPrevDay}>
          <Text style={styles.arrowText}>◀</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateDisplay} onPress={onToday} activeOpacity={0.8}>
          <Text style={styles.dateText}>{formattedDateStr}</Text>
          <Text style={styles.todayBadge}>{t('today')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.arrowBtn} onPress={onNextDay}>
          <Text style={styles.arrowText}>▶</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleArea: {
    flex: 1,
  },
  appTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  samvatSubtitle: {
    fontSize: 11,
    color: '#FFE0B2',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  langFlag: {
    fontSize: 14,
    marginRight: 4,
  },
  langText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cityIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  cityName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dateBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  arrowBtn: {
    padding: 8,
  },
  arrowText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  todayBadge: {
    backgroundColor: Colors.accentGold,
    color: Colors.maroon,
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
});
