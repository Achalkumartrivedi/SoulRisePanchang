import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Colors } from '../theme/colors';
import { FESTIVALS } from '../engine/festivalRepository';
import { CityLocation, PanchangDayData } from '../types/panchang';
import { DEFAULT_CITIES } from '../data/cities';
import { calculatePanchang } from '../engine/panchangEngine';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedTithi, getLocalizedPakshaName } from '../i18n/vedicTerms';
import { useCalendarSystem, CalendarSystem } from '../context/CalendarContext';
import { getJainDayData } from '../engine/jainCalendarEngine';

interface CalendarScreenProps {
  selectedCity?: CityLocation;
  onSelectDate: (dateIso: string) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function getLocalizedDateString(date: Date, lang: string): string {
  const localeMap: Record<string, string> = {
    hinglish: 'en-US',
    hi: 'hi-IN',
    en: 'en-US',
    ta: 'ta-IN',
    te: 'te-IN',
    bn: 'bn-IN',
    mr: 'mr-IN',
    ru: 'ru-RU',
    fr: 'fr-FR',
    es: 'es-ES',
    he: 'he-IL',
    id: 'id-ID',
    th: 'th-TH'
  };

  try {
    const locale = localeMap[lang] || 'en-US';
    return date.toLocaleDateString(locale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }
}

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
  const { calendarSystem, setCalendarSystem } = useCalendarSystem();
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
  let mJainData = getJainDayData(new Date(), 0);

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
    mJainData = getJainDayData(mDate, mTithiIdx);
  }

  const locPurnima = getLocalizedTithi(15, language).name;
  const locAmavasya = getLocalizedTithi(30, language).name;
  const showHindiScript = language === 'hi' || language === 'hinglish';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Monthly Calendar Card */}
      <View style={styles.card}>

        {/* Multi-Calendar System Switcher Bar */}
        <View style={styles.calendarToggleContainer}>
          <TouchableOpacity
            style={[styles.calToggleBtn, calendarSystem === 'HINDU' && styles.calToggleBtnActive]}
            onPress={() => setCalendarSystem('HINDU')}
            activeOpacity={0.8}
          >
            <Text style={[styles.calToggleText, calendarSystem === 'HINDU' && styles.calToggleTextActive]}>
              🕉️ Hindu Panchang
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.calToggleBtn, calendarSystem === 'JAIN' && styles.calToggleBtnActive]}
            onPress={() => setCalendarSystem('JAIN')}
            activeOpacity={0.8}
          >
            <Text style={[styles.calToggleText, calendarSystem === 'JAIN' && styles.calToggleTextActive]}>
              🪔 Jain Calendar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.calToggleBtn, calendarSystem === 'GLOBAL' && styles.calToggleBtnActive]}
            onPress={() => setCalendarSystem('GLOBAL')}
            activeOpacity={0.8}
          >
            <Text style={[styles.calToggleText, calendarSystem === 'GLOBAL' && styles.calToggleTextActive]}>
              🌍 Gregorian
            </Text>
          </TouchableOpacity>
        </View>

        {/* Month Header Navigation */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.navBtn} onPress={handlePrevMonth}>
            <Text style={styles.navBtnText}>◀ Prev</Text>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.monthTitle}>{MONTH_NAMES[month]} {year}</Text>
            {calendarSystem === 'JAIN' ? (
              <Text style={styles.samvatTitle}>
                Vira Nirvana Samvat {year + 527} • {getJainDayData(new Date(year, month, 15), 0).jainMonthName}
              </Text>
            ) : (
              <Text style={styles.samvatTitle}>Vikram Samvat 2083 • Shravana / Bhadrapada</Text>
            )}
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
            const jainData = getJainDayData(dateObj, tithiIdx);

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
                  isTodayCell && styles.todayCell,
                  calendarSystem === 'JAIN' && jainData.isParvaTithi && styles.jainParvaCell
                ]}
                onPress={() => setSelectedModalDateIso(dateIso)}
                activeOpacity={0.7}
              >
                <View style={styles.dayTopRow}>
                  <Text style={[styles.dayNumText, isHoliday && styles.holidayDayNum]}>{dayNum}</Text>
                  <Text style={styles.moonIconText}>{moonIcon}</Text>
                </View>

                {calendarSystem === 'JAIN' ? (
                  <>
                    <Text style={styles.jainMonthText} numberOfLines={1}>{jainData.jainTithiName}</Text>

                    {jainData.jainFestivalName ? (
                      <View style={styles.jainFestBadge}>
                        <Text style={styles.jainFestText} numberOfLines={1}>🪔 {jainData.jainFestivalName.split(' ')[1] || 'Parva'}</Text>
                      </View>
                    ) : jainData.isParvaTithi ? (
                      <View style={styles.jainParvaBadge}>
                        <Text style={styles.jainParvaBadgeText} numberOfLines={1}>🪔 {jainData.parvaType?.split(' ')[1] || 'Parva'}</Text>
                      </View>
                    ) : (
                      <Text style={styles.tithiText} numberOfLines={1}>{jainData.jainMonthName.split(' ')[0]}</Text>
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
          <Text style={styles.summarySectionTitle}>🌕 {locPurnima} (Full Moon)</Text>
          {purnimaList.length === 0 ? (
            <Text style={styles.emptySummaryText}>No Purnima in this calendar month view.</Text>
          ) : (
            purnimaList.map((item, idx) => (
              <View key={idx} style={styles.summaryItemBox}>
                <View style={styles.summaryItemHeader}>
                  <Text style={styles.summaryDateText}>📅 {getLocalizedDateString(item.dateObj, language)}</Text>
                  <TouchableOpacity
                    style={styles.detailsMiniBtn}
                    onPress={() => setSelectedModalDateIso(item.dateIso)}
                  >
                    <Text style={styles.detailsMiniBtnText}>Full Panchang ➔</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.summaryGrid}>
                  <Text style={styles.summarySubText}>🌅 Sunrise: {item.panchang.sunMoon.sunrise}</Text>
                  <Text style={styles.summarySubText}>🌇 Sunset: {item.panchang.sunMoon.sunset}</Text>
                  <Text style={styles.summarySubText}>⭐ Nakshatra: {item.panchang.nakshatra.name}</Text>
                  <Text style={styles.summarySubText}>✨ Yoga: {item.panchang.yoga.name}</Text>
                  <Text style={styles.summarySubText}>🕒 Rahu Kalam: {getRahuKalamForDate(item.dateObj)}</Text>
                </View>

                <View style={styles.ritualAdviceBox}>
                  <Text style={styles.ritualAdviceText}>🌸 Ritual Advice: Fasting, Satyanarayan Puja & Moon Arghya at night.</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Amavasya Section */}
        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitle}>🌑 {locAmavasya} (New Moon)</Text>
          {amavasyaList.length === 0 ? (
            <Text style={styles.emptySummaryText}>No Amavasya in this calendar month view.</Text>
          ) : (
            amavasyaList.map((item, idx) => (
              <View key={idx} style={styles.summaryItemBox}>
                <View style={styles.summaryItemHeader}>
                  <Text style={styles.summaryDateText}>📅 {getLocalizedDateString(item.dateObj, language)}</Text>
                  <TouchableOpacity
                    style={styles.detailsMiniBtn}
                    onPress={() => setSelectedModalDateIso(item.dateIso)}
                  >
                    <Text style={styles.detailsMiniBtnText}>Full Panchang ➔</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.summaryGrid}>
                  <Text style={styles.summarySubText}>🌅 Sunrise: {item.panchang.sunMoon.sunrise}</Text>
                  <Text style={styles.summarySubText}>🌇 Sunset: {item.panchang.sunMoon.sunset}</Text>
                  <Text style={styles.summarySubText}>⭐ Nakshatra: {item.panchang.nakshatra.name}</Text>
                  <Text style={styles.summarySubText}>✨ Yoga: {item.panchang.yoga.name}</Text>
                  <Text style={styles.summarySubText}>🕒 Rahu Kalam: {getRahuKalamForDate(item.dateObj)}</Text>
                </View>

                <View style={styles.ritualAdviceBox}>
                  <Text style={styles.ritualAdviceText}>🙏 Ritual Advice: Pitru Tarpana, Ancestral Puja & Lamp offering at riverbank.</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Date Detail Popup Modal */}
      {selectedModalDateIso && (
        <Modal visible={!!selectedModalDateIso} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitleDate}>{getLocalizedDateString(mDate, language)}</Text>
                  <Text style={styles.modalSubLocation}>📍 {selectedCity.name} ({selectedCity.hindiName})</Text>
                </View>

                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedModalDateIso(null)}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 420 }}>
                {/* Active Calendar System Indicator */}
                {calendarSystem === 'JAIN' ? (
                  <View style={styles.jainModalCard}>
                    <Text style={styles.jainModalTitle}>🪔 Jain Vira Nirvana Samvat {mJainData.viraSamvatYear}</Text>
                    <Text style={styles.jainModalTithi}>Month: {mJainData.jainMonthName} • Tithi: {mJainData.jainTithiName}</Text>
                    
                    {mJainData.isInChaturmas && (
                      <View style={styles.chaturmasModalBadge}>
                        <Text style={styles.chaturmasModalBadgeText}>{mJainData.chaturmasStatus}</Text>
                      </View>
                    )}

                    {mJainData.isParvaTithi && (
                      <View style={styles.jainParvaBox}>
                        <Text style={styles.jainParvaBoxTitle}>{mJainData.parvaType}</Text>
                        <Text style={styles.jainParvaBoxSub}>{mJainData.pachkhanInfo}</Text>
                      </View>
                    )}

                    {mJainData.jainFestivalName && (
                      <View style={styles.jainFestBox}>
                        <Text style={styles.jainFestBoxTitle}>{mJainData.jainFestivalName}</Text>
                      </View>
                    )}

                    {/* Religious Activities for the Date */}
                    <Text style={styles.jainActHeader}>🪔 Tithi Guidelines & Spiritual Activities:</Text>
                    {mJainData.religiousActivities.map((act, idx) => (
                      <Text key={idx} style={styles.jainActItem}>• {act}</Text>
                    ))}
                  </View>
                ) : null}

                {/* Festival / Event Banner if exists */}
                {festMatchModal && (
                  <View style={styles.modalFestBanner}>
                    <Text style={styles.modalFestTitle}>🚩 {festMatchModal.name}</Text>
                    {festMatchModal.description ? (
                      <Text style={styles.modalFestDesc}>{festMatchModal.description}</Text>
                    ) : null}
                  </View>
                )}

                {/* Mini Ritual Badge if exists */}
                {mRitual && (
                  <View style={styles.modalRitualBox}>
                    <Text style={styles.modalRitualText}>{mRitual}</Text>
                  </View>
                )}

                {/* Main 5 Panchang Limbs Grid */}
                <Text style={styles.limbsSectionTitle}>📜 5 Limbs of Panchang (पंचांग अंग)</Text>

                <View style={styles.limbsGrid}>
                  <View style={styles.limbBox}>
                    <Text style={styles.limbLabel}>🌙 Tithi (तिथि)</Text>
                    <Text style={styles.limbVal}>{mTithiName} ({mPakshaFull})</Text>
                  </View>

                  <View style={styles.limbBox}>
                    <Text style={styles.limbLabel}>⭐ Nakshatra (नक्षत्र)</Text>
                    <Text style={styles.limbVal}>{mPanchang.nakshatra.name}</Text>
                  </View>

                  <View style={styles.limbBox}>
                    <Text style={styles.limbLabel}>✨ Yoga (योग)</Text>
                    <Text style={styles.limbVal}>{mPanchang.yoga.name}</Text>
                  </View>

                  <View style={styles.limbBox}>
                    <Text style={styles.limbLabel}>🦁 Karana (करण)</Text>
                    <Text style={styles.limbVal}>{mPanchang.karana.name}</Text>
                  </View>

                  <View style={styles.limbBox}>
                    <Text style={styles.limbLabel}>📅 Month & Paksha</Text>
                    <Text style={styles.limbVal}>{mMonthName} ({mPakshaFull})</Text>
                  </View>

                  <View style={styles.limbBox}>
                    <Text style={styles.limbLabel}>🕒 Rahu Kalam (राहु काल)</Text>
                    <Text style={styles.limbVal}>{getRahuKalamForDate(mDate)}</Text>
                  </View>
                </View>

                {/* Sun & Moon Times */}
                <View style={styles.sunMoonBox}>
                  <Text style={styles.sunMoonItem}>🌅 Sunrise: <Text style={{ fontWeight: 'bold' }}>{mPanchang.sunMoon.sunrise}</Text></Text>
                  <Text style={styles.sunMoonItem}>🌇 Sunset: <Text style={{ fontWeight: 'bold' }}>{mPanchang.sunMoon.sunset}</Text></Text>
                </View>

                {/* Action Button: Navigate to Daily Panchang */}
                <TouchableOpacity
                  style={styles.openDailyPanchangBtn}
                  onPress={() => {
                    onSelectDate(selectedModalDateIso);
                    setSelectedModalDateIso(null);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.openDailyPanchangText}>View Complete Daily Panchang ➔</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamBg,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // Multi-Calendar Switcher Toggle Bar
  calendarToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
    gap: 4,
  },
  calToggleBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: 'center',
  },
  calToggleBtnActive: {
    backgroundColor: Colors.maroon,
  },
  calToggleText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  calToggleTextActive: {
    color: '#FFD700',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  samvatTitle: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  navBtn: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  navBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  weekdayText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    width: '14%',
    textAlign: 'center',
  },
  sunText: {
    color: '#C62828',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyDayCell: {
    width: '14.28%',
    height: 76,
  },
  dayCell: {
    width: '14.28%',
    height: 76,
    borderWidth: 0.5,
    borderColor: '#F0E0D0',
    padding: 3,
    backgroundColor: '#FFFFFF',
  },
  jainParvaCell: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFC107',
  },
  holidayCell: {
    backgroundColor: '#FFF5F5',
  },
  todayCell: {
    borderColor: Colors.maroon,
    borderWidth: 2,
    backgroundColor: '#FAF5EE',
  },
  dayTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayNumText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  holidayDayNum: {
    color: '#C62828',
  },
  moonIconText: {
    fontSize: 9,
  },
  monthPakshaText: {
    fontSize: 8,
    color: Colors.textMuted,
    marginTop: 1,
  },
  jainMonthText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginTop: 1,
  },
  tithiText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginTop: 2,
  },
  purnimaBadge: {
    backgroundColor: '#FFF8E1',
    borderRadius: 4,
    paddingHorizontal: 2,
    paddingVertical: 1,
    marginTop: 2,
  },
  purnimaBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#B78103',
  },
  amavasyaBadge: {
    backgroundColor: '#EDE7F6',
    borderRadius: 4,
    paddingHorizontal: 2,
    paddingVertical: 1,
    marginTop: 2,
  },
  amavasyaBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#4A148C',
  },
  ekadashiBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    paddingHorizontal: 2,
    paddingVertical: 1,
    marginTop: 2,
  },
  ekadashiBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  jainParvaBadge: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFB74D',
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 2,
    paddingVertical: 1,
    marginTop: 2,
  },
  jainParvaBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#E65100',
  },
  jainFestBadge: {
    backgroundColor: '#F3E5F5',
    borderColor: '#CE93D8',
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 2,
    paddingVertical: 1,
    marginTop: 2,
  },
  jainFestText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#6A1B9A',
  },
  festBadge: {
    backgroundColor: '#FFEBEE',
    borderRadius: 4,
    paddingHorizontal: 2,
    paddingVertical: 1,
    marginTop: 2,
  },
  festBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#C62828',
  },
  ritualBadge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 4,
    paddingHorizontal: 2,
    paddingVertical: 1,
    marginTop: 2,
  },
  ritualBadgeText: {
    fontSize: 7,
    color: Colors.maroon,
    fontWeight: 'bold',
  },

  summaryCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 3,
  },
  summaryCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 12,
  },
  summarySection: {
    marginBottom: 14,
  },
  summarySectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.primaryDark,
    marginBottom: 8,
  },
  emptySummaryText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  summaryItemBox: {
    backgroundColor: '#FAF5EE',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  summaryItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryDateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  detailsMiniBtn: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  detailsMiniBtnText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  summarySubText: {
    fontSize: 10,
    color: Colors.textPrimary,
    width: '48%',
  },
  ritualAdviceBox: {
    backgroundColor: '#FFF3E0',
    padding: 6,
    borderRadius: 6,
  },
  ritualAdviceText: {
    fontSize: 10,
    color: Colors.maroon,
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: Colors.creamBg,
    borderRadius: 20,
    padding: 16,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitleDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  modalSubLocation: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: '#E0E0E0',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textMuted,
  },
  jainModalCard: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFC107',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  jainModalTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  jainModalTithi: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  jainParvaBox: {
    backgroundColor: '#FFF3E0',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  jainParvaBoxTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#E65100',
  },
  jainParvaBoxSub: {
    fontSize: 10,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  jainFestBox: {
    backgroundColor: '#F3E5F5',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  jainFestBoxTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6A1B9A',
  },
  chaturmasModalBadge: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFB74D',
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    marginTop: 6,
  },
  chaturmasModalBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#E65100',
  },
  jainActHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginTop: 8,
    marginBottom: 4,
  },
  jainActItem: {
    fontSize: 10,
    color: Colors.textPrimary,
    marginBottom: 3,
    lineHeight: 15,
  },
  modalFestBanner: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF9A9A',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  modalFestTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#C62828',
  },
  modalFestDesc: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  modalRitualBox: {
    backgroundColor: '#FFF3E0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalRitualText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  limbsSectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 8,
  },
  limbsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  limbBox: {
    width: '48%',
    backgroundColor: '#FAF5EE',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  limbLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  limbVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  sunMoonBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  sunMoonItem: {
    fontSize: 11,
    color: Colors.textPrimary,
  },
  openDailyPanchangBtn: {
    backgroundColor: Colors.maroon,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  openDailyPanchangText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
