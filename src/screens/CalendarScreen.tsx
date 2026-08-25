import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Colors } from '../theme/colors';
import { FESTIVALS } from '../engine/festivalRepository';
import { CityLocation } from '../types/panchang';
import { DEFAULT_CITIES } from '../data/cities';
import { calculatePanchang } from '../engine/panchangEngine';

interface CalendarScreenProps {
  selectedCity?: CityLocation;
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
  if (m <= 2) { y -= 1; m += 12; }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d.getDate() + b - 1524.5;
};

const calculateTithiForDate = (d: Date): number => {
  const jd = getJulianDay(d);
  const diff = ((d.getTime() - new Date(2026, 7, 25).getTime()) / (1000 * 60 * 60 * 24)) * 12.2;
  let idx = Math.floor((12 + diff) % 30);
  if (idx < 0) idx += 30;
  return idx;
};

const getHinduMonthName = (d: Date): string => {
  const m = d.getMonth();
  const hinduMonths = ["Pausha", "Magha", "Phalguna", "Chaitra", "Vaisakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada", "Ashvin", "Kartika", "Margashirsha"];
  return hinduMonths[m % 12];
};

const getPerpetualMiniRitual = (d: Date, tithiIdx: number, monthName: string): string | null => {
  const dayOfWeek = d.getDay();
  if (tithiIdx === 12 && dayOfWeek === 1) return "🔱 Soma Pradosh Vrat";
  if (tithiIdx === 12 && dayOfWeek === 6) return "🔱 Shani Pradosh Vrat";
  if (tithiIdx === 12) return "🔱 Pradosh Vrat";
  if (tithiIdx === 10) return "🌿 Ekadashi Vrat";
  if (tithiIdx === 14) return "🌕 Satyanarayan Puja";
  if (tithiIdx === 29) return "🌑 Pitru Tarpana";
  if (dayOfWeek === 1 && monthName === "Shravana") return "🌿 Shravan Somvar Vrat";
  if (dayOfWeek === 2 && monthName === "Shravana") return "🌸 Mangla Gauri Puja";
  if (dayOfWeek === 4) return "💛 Guru Vrat";
  if (dayOfWeek === 6) return "🖤 Shani Dev Puja";
  return null;
};

const getRahuKalamForDate = (d: Date): string => {
  const dayOfWeek = d.getDay();
  const windows = [
    "04:30 PM - 06:00 PM", // Sun (8th)
    "07:30 AM - 09:00 AM", // Mon (2nd)
    "03:07 PM - 04:42 PM", // Tue (7th)
    "12:00 PM - 01:30 PM", // Wed (5th)
    "01:30 PM - 03:00 PM", // Thu (6th)
    "10:30 AM - 12:00 PM", // Fri (4th)
    "09:00 AM - 10:30 AM"  // Sat (3rd)
  ];
  return windows[dayOfWeek];
};

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ selectedCity = DEFAULT_CITIES[0], onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 24)); 
  const [selectedModalDateIso, setSelectedModalDateIso] = useState<string | null>(null);

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

  // Calculate Modal details if open
  let mDate = new Date();
  let mTithiIdx = 0;
  let mTithiName = "";
  let mMonthName = "";
  let mPakshaFull = "";
  let mRitual: string | null = null;
  let festMatchModal = null;
  let mPanchang = calculatePanchang(mDate, selectedCity);

  if (selectedModalDateIso) {
    const parts = selectedModalDateIso.split('-');
    const mY = parseInt(parts[0], 10);
    const mM = parseInt(parts[1], 10) - 1;
    const mD = parseInt(parts[2], 10);
    mDate = new Date(mY, mM, mD, 12, 0, 0);

    mPanchang = calculatePanchang(mDate, selectedCity);
    mTithiIdx = calculateTithiForDate(mDate);
    mTithiName = TITHI_NAMES[mTithiIdx];
    mMonthName = getHinduMonthName(mDate);
    mPakshaFull = mTithiIdx <= 14 ? 'Shukla Paksha' : 'Krishna Paksha';
    mRitual = getPerpetualMiniRitual(mDate, mTithiIdx, mMonthName);
    festMatchModal = FESTIVALS.find(f => f.dateIso === selectedModalDateIso);
  }

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
                onPress={() => setSelectedModalDateIso(dateIso)}
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

      {/* Date Details Modal Popup */}
      <Modal
        visible={selectedModalDateIso !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedModalDateIso(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedModalDateIso(null)}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalDateTitle}>
                  🕉️ {mDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {mMonthName} • {mPakshaFull} • Samvat 2083
                </Text>
              </View>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedModalDateIso(null)}>
                <Text style={styles.modalCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {(mRitual || festMatchModal) && (
              <View style={styles.ritualAlertBox}>
                <Text style={styles.ritualAlertText}>✨ {mRitual || festMatchModal?.name}</Text>
              </View>
            )}

            {/* Tithi Details */}
            <View style={styles.timingBox}>
              <Text style={styles.timingBoxTitle}>🌑 Tithi (तिथि) Exact Timings</Text>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Active Tithi:</Text>
                <Text style={[styles.timingVal, { color: Colors.maroon, backgroundColor: '#FFF3E0' }]}>
                  {mPanchang.tithi.paksha === 'SHUKLA' ? 'Shukla' : 'Krishna'} {mPanchang.tithi.name} ({mPanchang.tithi.hindiName})
                </Text>
              </View>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Tithi Starts:</Text>
                <Text style={[styles.timingVal, { color: Colors.auspiciousGreen, backgroundColor: '#E8F5E9' }]}>
                  {mPanchang.tithi.startTimeFormatted || '06:15 AM IST'}
                </Text>
              </View>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Tithi Ends:</Text>
                <Text style={[styles.timingVal, { color: Colors.inauspiciousRed, backgroundColor: '#FFEBEE' }]}>
                  {mPanchang.tithi.endTimeFormatted}
                </Text>
              </View>
            </View>

            {/* Nakshatra Details */}
            <View style={styles.timingBox}>
              <Text style={styles.timingBoxTitle}>⭐ Nakshatra (नक्षत्र) Exact Timings</Text>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Nakshatra Name:</Text>
                <Text style={[styles.timingVal, { color: Colors.maroon, backgroundColor: '#FFF3E0' }]}>
                  {mPanchang.nakshatra.name} ({mPanchang.nakshatra.hindiName})
                </Text>
              </View>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Ruler & Deity:</Text>
                <Text style={styles.timingVal}>
                  Ruler: {mPanchang.nakshatra.ruler} • Deity: {mPanchang.nakshatra.deity}
                </Text>
              </View>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Nakshatra Starts:</Text>
                <Text style={[styles.timingVal, { color: Colors.auspiciousGreen, backgroundColor: '#E8F5E9' }]}>
                  {mPanchang.nakshatra.startTimeFormatted || '04:15 AM IST'}
                </Text>
              </View>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Nakshatra Ends:</Text>
                <Text style={[styles.timingVal, { color: Colors.inauspiciousRed, backgroundColor: '#FFEBEE' }]}>
                  {mPanchang.nakshatra.endTimeFormatted}
                </Text>
              </View>
            </View>

            {/* Muhurat Details */}
            <View style={styles.timingBox}>
              <Text style={styles.timingBoxTitle}>✨ Muhurat & Rahu Kalam</Text>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>🌟 Abhijit Muhurat:</Text>
                <Text style={[styles.timingVal, { color: Colors.auspiciousGreen, backgroundColor: '#E8F5E9' }]}>
                  {mPanchang.auspiciousMuhurats?.find(m => m.name.includes('Abhijit'))?.timeWindow || '12:05 PM - 12:55 PM'}
                </Text>
              </View>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>⚠️ Rahu Kalam:</Text>
                <Text style={[styles.timingVal, { color: Colors.inauspiciousRed, backgroundColor: '#FFEBEE' }]}>
                  {mPanchang.inauspiciousMuhurats?.find(m => m.name.includes('Rahu'))?.timeWindow || getRahuKalamForDate(mDate)}
                </Text>
              </View>
            </View>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.fullPanchangBtn}
                onPress={() => {
                  const targetIso = selectedModalDateIso!;
                  setSelectedModalDateIso(null);
                  onSelectDate(targetIso);
                }}
              >
                <Text style={styles.fullPanchangBtnText}>View Full Today Panchang ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  // Modal Popup Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.65)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 20, width: '100%', maxWidth: 500, padding: 20, borderContainer: 1, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#EEEEEE', paddingBottom: 10, marginBottom: 12 },
  modalDateTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.maroon },
  modalSubtitle: { fontSize: 12, fontWeight: 'bold', color: Colors.primary, marginTop: 2 },
  modalCloseBtn: { backgroundColor: '#F0F0F0', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  modalCloseBtnText: { fontSize: 14, fontWeight: 'bold', color: '#666' },
  ritualAlertBox: { backgroundColor: '#FFF3E0', borderWidth: 1, borderColor: '#FFB74D', borderRadius: 10, padding: 10, marginBottom: 12 },
  ritualAlertText: { color: '#D84315', fontWeight: 'bold', fontSize: 13, textAlign: 'center' },
  timingBox: { backgroundColor: Colors.creamBg, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 12, marginBottom: 10 },
  timingBoxTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.maroon, marginBottom: 6 },
  timingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  timingLabel: { fontSize: 12, fontWeight: 'bold', color: Colors.textPrimary },
  timingVal: { fontSize: 11, fontWeight: 'bold', color: Colors.primary, backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  modalActionRow: { marginTop: 10 },
  fullPanchangBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  fullPanchangBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
});
