import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../theme/colors';
import { CityLocation, SamvatInfo } from '../types/panchang';

interface HeaderProps {
  currentDateIso: string;
  selectedCity: CityLocation;
  samvat: SamvatInfo;
  onOpenCityPicker: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDateIso,
  selectedCity,
  samvat,
  onOpenCityPicker,
  onPrevDay,
  onNextDay,
  onToday
}) => {
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
        <View>
          <Text style={styles.appTitle}>🕉️ SoulRise Panchang</Text>
          <Text style={styles.samvatSubtitle}>
            {samvat.monthNameHindi} • {samvat.pakshaHindi || 'शुक्ल'} • {samvat.vikramSamvat} विक्रम
          </Text>
        </View>

        <TouchableOpacity style={styles.cityBadge} onPress={onOpenCityPicker} activeOpacity={0.7}>
          <Text style={styles.cityIcon}>📍</Text>
          <View>
            <Text style={styles.cityName}>{selectedCity.name}</Text>
            <Text style={styles.cityHindi}>{selectedCity.hindiName}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Date Navigation Bar */}
      <View style={styles.dateBar}>
        <TouchableOpacity style={styles.arrowBtn} onPress={onPrevDay}>
          <Text style={styles.arrowText}>◀</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateDisplay} onPress={onToday} activeOpacity={0.8}>
          <Text style={styles.dateText}>{formattedDateStr}</Text>
          <Text style={styles.todayBadge}>Today</Text>
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
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  samvatSubtitle: {
    fontSize: 13,
    color: Colors.accentGold,
    fontWeight: '600',
    marginTop: 2,
  },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cityIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  cityName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cityHindi: {
    color: Colors.primaryLight,
    fontSize: 10,
  },
  dateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  arrowBtn: {
    padding: 8,
    borderRadius: 8,
  },
  arrowText: {
    color: Colors.accentGold,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginRight: 8,
  },
  todayBadge: {
    backgroundColor: Colors.accentGold,
    color: Colors.maroon,
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
