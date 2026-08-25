import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../theme/colors';
import { FESTIVALS } from '../engine/festivalRepository';

interface CalendarScreenProps {
  onSelectDate: (dateIso: string) => void;
}

const TITHI_NAMES = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shasthi", "Saptami",
  "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shasthi", "Saptami",
  "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getJulianDay = (d: Date) => {
  let y = d.getFullYear();
  let m = d.getMonth() + 1;
  let day = d.getDate();
  if (m <= 2) { y -= 1; m += 12; }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + 0.5 + b - 1524.5;
};

const calculateTithiForDate = (d: Date) => {
  const jd = getJulianDay(d);
  const T = (jd - 2451545.0) / 36525.0;
  const sunL = (280.46646 + 36000.76983 * T) % 360;
  const moonL = (218.3165 + 481267.8813 * T) % 360;
  const norm = (v: number) => (v < 0 ? (v % 360 + 360) : v % 360);
  const elongation = norm(norm(moonL) - norm(sunL));
  return Math.floor(elongation / 12) % 30;
};

const getHinduMonthName = (d: Date) => {
  const jd = getJulianDay(d);
  const T = (jd - 2451545.0) / 36525.0;
  const sunL = (280.46646 + 36000.76983 * T) % 360;
  const norm = (v: number) => (v < 0 ? (v % 360 + 360) : v % 360);
  const sunRashi = Math.floor(norm(sunL) / 30) % 12;

  const monthNames = [
    "Phalguni", "Chaitra", "Vaishakha", "Jyeshtha",
    "Ashadha", "Shravan", "Bhadrapada", "Ashwin",
    "Kartika", "Margashirsha", "Pausha", "Magha"
  ];
  return monthNames[sunRashi];
};

const getPerpetualMiniRitual = (d: Date, tithiIdx: number, hinduMonth: string) => {
  const dayOfWeek = d.getDay();
  
  if (tithiIdx === 14) return "🌕 Purnima";
  if (tithiIdx === 29) return "🌑 Amavasya";
  if (tithiIdx === 10 || tithiIdx === 25) return "🌿 Ekadashi";
  if (tithiIdx === 12 || tithiIdx === 27) return "🔱 Pradosh Vrat";
  if (tithiIdx === 18) return "🐘 Sankashti Chauth";
  if (tithiIdx === 3) return "🐘 Vinayaka Chauth";
  if (tithiIdx === 7) return "🔱 Durgashtami";
  if (tithiIdx === 22) return "🔱 Kalashtami";
  if (tithiIdx === 28) return "🔱 Masik Shivratri";
  if (tithiIdx === 2) return "🌸 Teej Vrat";
  if (tithiIdx === 4 && hinduMonth === "Shravan") return "🌸 Nag Panchami";
  if (tithiIdx === 5 && (hinduMonth === "Shravan" || hinduMonth === "Bhadrapada")) return "🌾 Randhan Chhath";
  if (tithiIdx === 6 && (hinduMonth === "Shravan" || hinduMonth === "Bhadrapada")) return "❄️ Shitala Satam";

  if (hinduMonth === "Shravan" && dayOfWeek === 2) return "🌸 ManglaGauri Pujan";
  if (hinduMonth === "Shravan" && dayOfWeek === 1) return "🌺 Shravan Somvar";

  return null;
};

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 24)); // August 2026

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthFestivals = FESTIVALS.filter(f => {
    const parts = f.dateIso.split('-');
    return parseInt(parts[0], 10) === year && parseInt(parts[1], 10) === month + 1;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.navBtn} onPress={handlePrevMonth}>
            <Text style={styles.navBtnText}>◀ Prev</Text>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.monthTitle}>{MONTH_NAMES[month]} {year}</Text>
            <Text style={styles.samvatTitle}>Vikram Samvat 2083 • Shravana / Bhadrapada</Text>
          </View>

          <TouchableOpacity style={styles.navBtn} onPress={handleNextMonth}>
            <Text style={styles.navBtnText}>Next ▶</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekdayRow}>
          {WEEKDAYS.map((day, i) => (
            <Text key={i} style={[styles.weekdayText, i === 0 && styles.sunText]}>{day}</Text>
          ))}
        </View>

        <View style={styles.grid}>
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.emptyDayCell} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateIso = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dateObj = new Date(year, month, dayNum, 12, 0, 0);
            const isSunday = dateObj.getDay() === 0;

            const festMatch = monthFestivals.find(f => f.dateIso === dateIso);
            const isHoliday = isSunday || (festMatch && festMatch.isHoliday);

            const tithiIdx = calculateTithiForDate(dateObj);
            const tithiName = TITHI_NAMES[tithiIdx];

            const hinduMonthName = getHinduMonthName(dateObj);
            const pakshaShort = tithiIdx <= 14 ? "Shu." : "Kru.";
            const monthPakshaDisplay = `${hinduMonthName} - ${pakshaShort}`;

            const miniRitual = getPerpetualMiniRitual(dateObj, tithiIdx, hinduMonthName);

            let moonIcon = '🌒';
            if (tithiIdx === 14) moonIcon = '🌕';
            else if (tithiIdx === 29) moonIcon = '🌑';
            else if (tithiIdx > 14) moonIcon = '🌘';

            const realToday = new Date();
            const isTodayCell = dayNum === realToday.getDate() && month === realToday.getMonth() && year === realToday.getFullYear();

            return (
              <TouchableOpacity
                key={`day-${dayNum}`}
                style={[
                  styles.dayCell,
                  isHoliday && styles.holidayCell,
                  isTodayCell && styles.todayCell
                ]}
                onPress={() => onSelectDate(dateIso)}
                activeOpacity={0.7}
              >
                <View style={styles.dayTopRow}>
                  <Text style={[styles.dayNumText, isHoliday && styles.holidayDayNum]}>{dayNum}</Text>
                  <Text style={styles.moonIconText}>{moonIcon}</Text>
                </View>

                <Text style={styles.monthPakshaText} numberOfLines={1}>{monthPakshaDisplay}</Text>

                {tithiIdx === 14 ? (
                  <View style={styles.purnimaBadge}><Text style={styles.purnimaBadgeText}>🌕 Purnima</Text></View>
                ) : tithiIdx === 29 ? (
                  <View style={styles.amavasyaBadge}><Text style={styles.amavasyaBadgeText}>🌑 Amavasya</Text></View>
                ) : tithiIdx === 10 || tithiIdx === 25 ? (
                  <View style={styles.ekadashiBadge}><Text style={styles.ekadashiBadgeText}>🌿 Ekadashi</Text></View>
                ) : festMatch ? (
                  <View style={styles.festBadge}><Text style={styles.festBadgeText}>🚩 {festMatch.name.split(' ')[0]}</Text></View>
                ) : (
                  <Text style={styles.tithiText} numberOfLines={1}>{tithiName}</Text>
                )}

                {miniRitual ? (
                  <View style={styles.ritualBadge}>
                    <Text style={styles.ritualBadgeText} numberOfLines={1}>{miniRitual}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.creamBg },
  content: { paddingVertical: 12 },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  navBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: '#F0F0F0' },
  navBtnText: { fontSize: 12, fontWeight: 'bold', color: Colors.maroon },
  titleContainer: { alignItems: 'center' },
  monthTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.maroon },
  samvatTitle: { fontSize: 11, color: Colors.accentGold, fontWeight: 'bold', marginTop: 2 },
  weekdayRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8, backgroundColor: Colors.creamBg, borderRadius: 10, marginBottom: 8 },
  weekdayText: { fontSize: 12, fontWeight: 'bold', color: Colors.textSecondary, width: 40, textAlign: 'center' },
  sunText: { color: Colors.inauspiciousRed },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  emptyDayCell: { width: '14.28%', height: 85 },
  dayCell: {
    width: '14.28%',
    height: 85,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 3,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  holidayCell: { backgroundColor: '#FFEBEE', borderColor: '#EF9A9A' },
  todayCell: { borderWidth: 2, borderColor: Colors.primary, backgroundColor: '#FFF8E1' },
  dayTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayNumText: { fontSize: 11, fontWeight: 'bold', color: Colors.textPrimary },
  holidayDayNum: { color: Colors.inauspiciousRed },
  moonIconText: { fontSize: 9 },
  monthPakshaText: { fontSize: 8, color: '#800000', fontWeight: 'bold', backgroundColor: '#FFF3E0', borderRadius: 3, textAlign: 'center', paddingVertical: 1 },
  tithiText: { fontSize: 8, color: '#666', fontWeight: 'bold', textAlign: 'center' },
  purnimaBadge: { backgroundColor: '#FFD700', borderRadius: 4, paddingHorizontal: 2, paddingVertical: 1 },
  purnimaBadgeText: { fontSize: 8, fontWeight: 'bold', color: '#800000', textAlign: 'center' },
  amavasyaBadge: { backgroundColor: '#212121', borderRadius: 4, paddingHorizontal: 2, paddingVertical: 1 },
  amavasyaBadgeText: { fontSize: 8, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  ekadashiBadge: { backgroundColor: Colors.auspiciousGreen, borderRadius: 4, paddingHorizontal: 2, paddingVertical: 1 },
  ekadashiBadgeText: { fontSize: 8, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  festBadge: { backgroundColor: Colors.inauspiciousRed, borderRadius: 4, paddingHorizontal: 2, paddingVertical: 1 },
  festBadgeText: { fontSize: 8, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  ritualBadge: { backgroundColor: '#FFE0B2', borderRadius: 3, paddingHorizontal: 2, paddingVertical: 1, borderWidth: 0.5, borderColor: '#FFB74D' },
  ritualBadgeText: { fontSize: 7, fontWeight: 'bold', color: '#D84315', textAlign: 'center' },
});
