import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Colors } from '../theme/colors';
import { FESTIVALS } from '../engine/festivalRepository';
import { CityLocation, PanchangDayData } from '../types/panchang';
import { DEFAULT_CITIES } from '../data/cities';
import { calculatePanchang } from '../engine/panchangEngine';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedTithi, getLocalizedPakshaName } from '../i18n/vedicTerms';

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
    "04:30 PM - 06:00 PM",
    "07:30 AM - 09:00 AM",
    "03:07 PM - 04:42 PM",
    "12:00 PM - 01:30 PM",
    "01:30 PM - 03:00 PM",
    "10:30 AM - 12:00 PM",
    "09:00 AM - 10:30 AM"
  ];
  return windows[dayOfWeek];
};

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ selectedCity = DEFAULT_CITIES[0], onSelectDate }) => {
  const { language, t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 24)); 
  const [selectedModalDateIso, setSelectedModalDateIso] = useState<string | null>(null);
  const [showPopupInfoModal, setShowPopupInfoModal] = useState(false);

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

  // Calculate Monthly Purnima & Amavasya occurrences
  const purnimaList: { dateObj: Date; dateIso: string; panchang: PanchangDayData }[] = [];
  const amavasyaList: { dateObj: Date; dateIso: string; panchang: PanchangDayData }[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d, 12, 0, 0);
    const dateIso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const tithiIdx = calculateTithiForDate(dateObj);

    if (tithiIdx === 14) {
      const panchang = calculatePanchang(dateObj, selectedCity);
      purnimaList.push({ dateObj, dateIso, panchang });
    } else if (tithiIdx === 29) {
      const panchang = calculatePanchang(dateObj, selectedCity);
      amavasyaList.push({ dateObj, dateIso, panchang });
    }
  }

  // Calculate Modal details if open
  let mDate = new Date();
  let mTithiIdx = 0;
  let mTithiName = "";
  let mMonthName = "";
  let mPakshaFull = "";
  let mRitual: string | null = null;
  let festMatchModal = null;
  let mPanchang = calculatePanchang(new Date(), selectedCity);

  if (selectedModalDateIso) {
    const parts = selectedModalDateIso.split('-');
    mDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
    mTithiIdx = calculateTithiForDate(mDate);
    mTithiName = getLocalizedTithi((mTithiIdx % 15) + 1, language).name;
    mMonthName = getHinduMonthName(mDate);
    mPakshaFull = getLocalizedPakshaName(mTithiIdx <= 14 ? 'SHUKLA' : 'KRISHNA', language);
    mRitual = getPerpetualMiniRitual(mDate, mTithiIdx, mMonthName);
    festMatchModal = FESTIVALS.find(f => f.dateIso === selectedModalDateIso);
    mPanchang = calculatePanchang(mDate, selectedCity);
  }

  const locPurnima = getLocalizedTithi(15, language).name;
  const locAmavasya = getLocalizedTithi(30, language).name;
  const showHindiScript = language === 'hi' || language === 'hinglish';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Monthly Calendar Card */}
      <View style={styles.card}>
        {/* Month Header Navigation */}
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
            const tithiName = getLocalizedTithi((tithiIdx % 15) + 1, language).name;

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
                  <View style={styles.purnimaBadge}>
                    <Text style={styles.purnimaBadgeText} numberOfLines={1} adjustsFontSizeToFit>🌕 {locPurnima}</Text>
                  </View>
                ) : tithiIdx === 29 ? (
                  <View style={styles.amavasyaBadge}>
                    <Text style={styles.amavasyaBadgeText} numberOfLines={1} adjustsFontSizeToFit>🌑 {locAmavasya}</Text>
                  </View>
                ) : tithiIdx === 10 || tithiIdx === 25 ? (
                  <View style={styles.ekadashiBadge}>
                    <Text style={styles.ekadashiBadgeText} numberOfLines={1}>🌿 Ekadashi</Text>
                  </View>
                ) : festMatch ? (
                  <View style={styles.festBadge}>
                    <Text style={styles.festBadgeText} numberOfLines={1}>🚩 {festMatch.name.split(' ')[0]}</Text>
                  </View>
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

      {/* Monthly Purnima & Amavasya Summary Card (Below Calendar Grid) */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryCardTitle} numberOfLines={1} adjustsFontSizeToFit>
          {t('purnimaAmavasyaHeader')}
        </Text>

        {/* Purnima Section */}
        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitle} numberOfLines={1} adjustsFontSizeToFit>
            {t('purnimaTitle')}
          </Text>
          {purnimaList.length > 0 ? (
            purnimaList.map((item, idx) => (
              <TouchableOpacity
                key={`purnima-${idx}`}
                style={styles.summaryItemBoxGood}
                onPress={() => setSelectedModalDateIso(item.dateIso)}
                activeOpacity={0.7}
              >
                <View style={styles.summaryItemTop}>
                  <Text style={styles.summaryMoonIcon}>🌕</Text>
                  <View style={{ flex: 1, marginRight: 6 }}>
                    <Text style={styles.summaryDateText}>
                      {item.dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                    <Text style={styles.summaryTimingText}>
                      Tithi Starts: {item.panchang.tithi.startTimeFormatted || '06:15 AM'} • Ends: {item.panchang.tithi.endTimeFormatted}
                    </Text>
                    <Text style={styles.summaryRitualText}>✨ {t('purnimaRitual')}</Text>
                  </View>
                  <Text style={styles.summaryArrow}>➔</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noDataText}>No Purnima in this date range</Text>
          )}
        </View>

        <View style={styles.summaryDivider} />

        {/* Amavasya Section */}
        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitleDark} numberOfLines={1} adjustsFontSizeToFit>
            {t('amavasyaTitle')}
          </Text>
          {amavasyaList.length > 0 ? (
            amavasyaList.map((item, idx) => (
              <TouchableOpacity
                key={`amavasya-${idx}`}
                style={styles.summaryItemBoxDark}
                onPress={() => setSelectedModalDateIso(item.dateIso)}
                activeOpacity={0.7}
              >
                <View style={styles.summaryItemTop}>
                  <Text style={styles.summaryMoonIcon}>🌑</Text>
                  <View style={{ flex: 1, marginRight: 6 }}>
                    <Text style={styles.summaryDateText}>
                      {item.dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                    <Text style={styles.summaryTimingText}>
                      Tithi Starts: {item.panchang.tithi.startTimeFormatted || '05:45 AM'} • Ends: {item.panchang.tithi.endTimeFormatted}
                    </Text>
                    <Text style={styles.summaryRitualText}>✨ {t('amavasyaRitual')}</Text>
                  </View>
                  <Text style={styles.summaryArrow}>➔</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noDataText}>No Amavasya in this date range</Text>
          )}
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
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.modalDateTitle} numberOfLines={1} adjustsFontSizeToFit>
                  🕉️ {mDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
                <Text style={styles.modalSubtitle} numberOfLines={1} adjustsFontSizeToFit>
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
              <Text style={styles.timingBoxTitle}>🌑 Tithi {showHindiScript ? '(तिथि)' : ''} Timings</Text>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Active Tithi:</Text>
                <Text style={[styles.timingVal, { color: Colors.maroon, backgroundColor: '#FFF3E0' }]}>
                  {getLocalizedTithi(mPanchang.tithi.number || 13, language).name} {showHindiScript && mPanchang.tithi.hindiName ? `(${mPanchang.tithi.hindiName})` : ''}
                </Text>
              </View>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Tithi Starts:</Text>
                <Text style={[styles.timingVal, { color: Colors.auspiciousGreen, backgroundColor: '#E8F5E9' }]}>
                  {mPanchang.tithi.startTimeFormatted || '06:15 AM'}
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
              <Text style={styles.timingBoxTitle}>⭐ Nakshatra {showHindiScript ? '(नक्षत्र)' : ''} Timings</Text>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Nakshatra Name:</Text>
                <Text style={[styles.timingVal, { color: Colors.maroon, backgroundColor: '#FFF3E0' }]}>
                  {mPanchang.nakshatra.name} {showHindiScript && mPanchang.nakshatra.hindiName ? `(${mPanchang.nakshatra.hindiName})` : ''}
                </Text>
              </View>
              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>Ruler & Deity:</Text>
                <Text style={styles.timingVal}>
                  Ruler: {mPanchang.nakshatra.ruler} • Deity: {mPanchang.nakshatra.deity}
                </Text>
              </View>
            </View>

            {/* Muhurat & Rahu Kalam Details with SINGLE info icon */}
            <View style={styles.timingBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.timingBoxTitle}>✨ Muhurat & Rahu Kalam</Text>
                <TouchableOpacity
                  onPress={() => setShowPopupInfoModal(true)}
                  style={{ padding: 2 }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={{ fontSize: 16 }}>ℹ️</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>🌟 Abhijit Muhurat:</Text>
                <Text style={[styles.timingVal, { color: Colors.auspiciousGreen, backgroundColor: '#E8F5E9' }]}>
                  {mPanchang.auspiciousMuhurats?.[0] ? `${mPanchang.auspiciousMuhurats[0].startTime} - ${mPanchang.auspiciousMuhurats[0].endTime}` : '12:05 PM - 12:55 PM'}
                </Text>
              </View>

              <View style={styles.timingRow}>
                <Text style={styles.timingLabel}>⚠️ Rahu Kalam:</Text>
                <Text style={[styles.timingVal, { color: Colors.inauspiciousRed, backgroundColor: '#FFEBEE' }]}>
                  {mPanchang.inauspiciousMuhurats?.[0] ? `${mPanchang.inauspiciousMuhurats[0].startTime} - ${mPanchang.inauspiciousMuhurats[0].endTime}` : getRahuKalamForDate(mDate)}
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

      {/* Calendar Popup ℹ️ Info Modal displaying TWO lines */}
      <Modal
        visible={showPopupInfoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPopupInfoModal(false)}
      >
        <TouchableOpacity
          style={styles.infoModalOverlay}
          activeOpacity={1}
          onPress={() => setShowPopupInfoModal(false)}
        >
          <View style={styles.infoModalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.infoModalHeader}>
              <Text style={styles.infoModalHeaderTitle}>✨ Muhurat & Rahu Kalam Guidance</Text>
              <TouchableOpacity onPress={() => setShowPopupInfoModal(false)}>
                <Text style={styles.infoModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Line 1: Auspicious Abhijit Muhurat */}
            <View style={styles.infoBoxGood}>
              <Text style={styles.infoBoxText}>{t('calendarPopupAbhijitInfo')}</Text>
            </View>

            {/* Line 2: Inauspicious Rahu Kalam */}
            <View style={styles.infoBoxBad}>
              <Text style={styles.infoBoxText}>{t('calendarPopupRahuInfo')}</Text>
            </View>

            <TouchableOpacity style={styles.gotItBtn} onPress={() => setShowPopupInfoModal(false)}>
              <Text style={styles.gotItBtnText}>Understand / Got It</Text>
            </TouchableOpacity>
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
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  navBtn: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  titleContainer: {
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  samvatTitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  weekdayRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E0D0',
    paddingBottom: 8,
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  sunText: {
    color: Colors.inauspiciousRed,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyDayCell: {
    width: '14.28%',
    height: 70,
  },
  dayCell: {
    width: '14.28%',
    height: 72,
    padding: 4,
    borderWidth: 0.5,
    borderColor: '#F0E0D0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  holidayCell: {
    backgroundColor: '#FFF8E1',
  },
  todayCell: {
    borderColor: Colors.maroon,
    borderWidth: 2,
    backgroundColor: '#FFF3E0',
  },
  dayTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayNumText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  holidayDayNum: {
    color: Colors.inauspiciousRed,
  },
  moonIconText: {
    fontSize: 10,
  },
  monthPakshaText: {
    fontSize: 8,
    color: Colors.textMuted,
  },
  purnimaBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#FFE082',
  },
  purnimaBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#F57F17',
    textAlign: 'center',
  },
  amavasyaBadge: {
    backgroundColor: '#ECEFF1',
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#CFD8DC',
  },
  amavasyaBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#37474F',
    textAlign: 'center',
  },
  ekadashiBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderRadius: 4,
  },
  ekadashiBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
  },
  festBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderRadius: 4,
  },
  festBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: Colors.maroon,
    textAlign: 'center',
  },
  tithiText: {
    fontSize: 9,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  ritualBadge: {
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 2,
    paddingVertical: 1,
    borderRadius: 4,
  },
  ritualBadgeText: {
    fontSize: 7,
    color: '#7B1FA2',
    fontWeight: 'bold',
  },

  // Monthly Purnima & Amavasya Summary Card Styles
  summaryCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
  },
  summaryCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 12,
  },
  summarySection: {
    marginVertical: 4,
  },
  summarySectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
  },
  summarySectionTitleDark: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#37474F',
    marginBottom: 8,
  },
  summaryItemBoxGood: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F57F17',
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  summaryItemBoxDark: {
    backgroundColor: '#ECEFF1',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#37474F',
    borderWidth: 1,
    borderColor: '#CFD8DC',
  },
  summaryItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryMoonIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  summaryDateText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  summaryTimingText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  summaryRitualText: {
    fontSize: 11,
    color: Colors.maroon,
    marginTop: 4,
    fontWeight: 'bold',
  },
  summaryArrow: {
    fontSize: 16,
    color: Colors.maroon,
    fontWeight: 'bold',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F0E0D0',
    marginVertical: 10,
  },
  noDataText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.accentGold,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalDateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  modalSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalCloseBtnText: {
    fontSize: 18,
    color: Colors.textMuted,
    fontWeight: 'bold',
  },
  ritualAlertBox: {
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  ritualAlertText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  timingBox: {
    backgroundColor: '#FAF5EE',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  timingBoxTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 6,
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  timingLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  timingVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  modalActionRow: {
    marginTop: 6,
  },
  fullPanchangBtn: {
    backgroundColor: Colors.maroon,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  fullPanchangBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoModalContent: {
    width: '100%',
    backgroundColor: Colors.cardBg,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: Colors.accentGold,
    elevation: 10,
  },
  infoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  infoModalHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
    flex: 1,
  },
  infoModalClose: {
    fontSize: 18,
    color: Colors.textMuted,
    fontWeight: 'bold',
  },
  infoBoxGood: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  infoBoxBad: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF9A9A',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  infoBoxText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
    fontWeight: '500',
  },
  gotItBtn: {
    backgroundColor: Colors.maroon,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  gotItBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
