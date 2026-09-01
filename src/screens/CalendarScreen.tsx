import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { Colors } from '../theme/colors';
import { FESTIVALS, getLocalizedFestivalTitle } from '../engine/festivalRepository';
import { CityLocation, PanchangDayData } from '../types/panchang';
import { DEFAULT_CITIES } from '../data/cities';
import { calculatePanchang, getHinduMonthName } from '../engine/panchangEngine';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedTithi, getLocalizedPakshaName } from '../i18n/vedicTerms';
import { useCalendarSystem, CalendarSystem } from '../context/CalendarContext';
import { getJainDayData } from '../engine/jainCalendarEngine';
import { getWorldFestivalForDate } from '../engine/worldFestivalRepository';
import { getDharmaCalendarDayData, DharmaDayData } from '../engine/dharmaCalendarEngine';
import { saveReminder } from '../engine/reminderStorage';
import { analyzeMuhuratSafety } from '../engine/muhuratSafetyChecker';
import { TimePickerModal } from '../components/TimePickerModal';
import { isDateInPast, isTimeInPastOnDate, getNextUpcomingTimeSlot } from '../engine/dateTimeValidator';

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
  const { calendarSystem, setCalendarSystem, lunarSystem } = useCalendarSystem();
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedModalDateIso, setSelectedModalDateIso] = useState<string | null>(null);
  const [showPopupInfoModal, setShowPopupInfoModal] = useState(false);

  // Date Quick Reminder Modal State
  const [dateRemModalVisible, setDateRemModalVisible] = useState(false);
  const [dateRemTitle, setDateRemTitle] = useState('');
  const [dateRemTimeStr, setDateRemTimeStr] = useState('10:30 AM');
  const [dateRemNotes, setDateRemNotes] = useState('');
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  const monthFestivals = FESTIVALS.filter(f => {
    const parts = f.dateIso.split('-');
    const matchesMonth = parseInt(parts[0], 10) === year && parseInt(parts[1], 10) === month + 1;
    if (!matchesMonth) return false;
    if (calendarSystem === 'HINDU') return f.category !== 'JAIN_FESTIVAL';
    if (calendarSystem === 'JAIN') return f.category === 'JAIN_FESTIVAL';
    return true;
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
  let festMatchModal: typeof FESTIVALS[0] | null = null;
  let mPanchang = calculatePanchang(new Date(), selectedCity);
  let mJainData = getJainDayData(new Date(), 0);

  let mWorldFest = selectedModalDateIso ? getWorldFestivalForDate(selectedModalDateIso) : null;

  if (selectedModalDateIso) {
    const parts = selectedModalDateIso.split('-');
    mDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
    mTithiIdx = calculateTithiForDate(mDate);
    mTithiName = getLocalizedTithi((mTithiIdx % 15) + 1, language).name;
    mMonthName = getHinduMonthName(mDate);
    mPakshaFull = getLocalizedPakshaName(mTithiIdx <= 14 ? 'SHUKLA' : 'KRISHNA', language);
    
    // Strict Segregation: Hindu Rituals & Festivals only for HINDU mode!
    mRitual = calendarSystem === 'HINDU' ? getPerpetualMiniRitual(mDate, mTithiIdx, mMonthName) : null;
    
    if (calendarSystem === 'JAIN') {
      festMatchModal = FESTIVALS.find(f => f.dateIso === selectedModalDateIso && f.category === 'JAIN_FESTIVAL') || null;
    } else if (calendarSystem === 'HINDU') {
      festMatchModal = FESTIVALS.find(f => f.dateIso === selectedModalDateIso && f.category !== 'JAIN_FESTIVAL') || null;
    } else {
      festMatchModal = FESTIVALS.find(f => f.dateIso === selectedModalDateIso) || null;
    }

    mPanchang = calculatePanchang(mDate, selectedCity);
    mJainData = getJainDayData(mDate, mTithiIdx);
  }

  const locPurnima = getLocalizedTithi(15, language).name;
  const locAmavasya = getLocalizedTithi(30, language).name;
  const showHindiScript = language === 'hi' || language === 'hinglish';

  const [calSystemModalVisible, setCalSystemModalVisible] = useState(false);

  const getCalendarTitle = (sys: CalendarSystem) => {
    switch (sys) {
      case 'HINDU': return '🕉️ Hindu Calendar (Vikram Samvat)';
      case 'GLOBAL': return '🌍 Gregorian Solar Calendar';
      case 'JAIN': return '🪔 Jain Calendar (Vira Nirvana Samvat)';
      case 'SIKH': return '☬ Nanakshahi Sikh Calendar';
      case 'BUDDHIST': return '☸️ Buddhist Lunar Calendar (BE 2568)';
      case 'CHRISTIAN': return '✝️ Christian Liturgical Calendar';
      case 'PARSI': return '🔥 Zoroastrian Parsi Calendar';
      default: return '🕉️ Hindu Calendar';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Monthly Calendar Card */}
      <View style={styles.card}>

        {/* Multi-Calendar System Switcher Bar (Dropdown Pill) */}
        <TouchableOpacity
          style={styles.calendarDropdownPill}
          onPress={() => setCalSystemModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.calendarDropdownPillText}>
            {getCalendarTitle(calendarSystem)}
          </Text>
          <Text style={styles.calendarDropdownArrow}>▼</Text>
        </TouchableOpacity>

        {/* Location & Today Quick Jump Sub-Header */}
        <View style={styles.locationSubBar}>
          <Text style={styles.locationSubText}>📍 Location: {selectedCity.name} ({selectedCity.hindiName})</Text>
          <TouchableOpacity style={styles.todayQuickBtn} onPress={handleToday} activeOpacity={0.8}>
            <Text style={styles.todayQuickBtnText}>📅 Today (आज)</Text>
          </TouchableOpacity>
        </View>

        {/* Month Header Navigation */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.navBtn} onPress={handlePrevMonth} activeOpacity={0.7}>
            <Text style={styles.navBtnText}>◀ Prev</Text>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.monthTitle} numberOfLines={1}>
              {MONTH_NAMES[month]} {year}
            </Text>
            {(() => {
              const startMonthDate = new Date(year, month, 1);
              const endMonthDate = new Date(year, month, 25);
              const startData = getDharmaCalendarDayData(startMonthDate, calendarSystem, language);
              const endData = getDharmaCalendarDayData(endMonthDate, calendarSystem, language);

              const shortEra = startData.eraTitle
                .replace('Vikram Samvat', 'Vi.Sa.')
                .replace('Nanakshahi Samvat', 'N.Sa.')
                .replace('Buddha Era', 'B.E.');

              let monthDisplay = startData.monthName;
              if (endData.monthName && endData.monthName !== startData.monthName) {
                monthDisplay = `${startData.monthName} / ${endData.monthName}`;
              }

              // Selected or Today Date Paksha & Tithi
              const realToday = new Date();
              const activeTargetDate = selectedModalDateIso
                ? new Date(selectedModalDateIso)
                : (month === realToday.getMonth() && year === realToday.getFullYear()
                    ? realToday
                    : new Date(year, month, 15));
              
              const tIdx = calculateTithiForDate(activeTargetDate);
              const pakshaName = tIdx <= 14 ? 'Shukla Paksha (शुक्ल पक्ष)' : 'Krishna Paksha (कृष्ण पक्ष)';
              const tName = getLocalizedTithi((tIdx % 15) + 1, language).name;

              return (
                <>
                  <Text style={styles.samvatTitle} numberOfLines={1} ellipsizeMode="tail">
                    {shortEra} • {monthDisplay}
                  </Text>
                  <Text style={styles.pakshaSubTitle} numberOfLines={1} ellipsizeMode="tail">
                    🌙 {pakshaName} • {tName}
                  </Text>
                </>
              );
            })()}
          </View>

          <TouchableOpacity style={styles.navBtn} onPress={handleNextMonth} activeOpacity={0.7}>
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

            const cellPanchang = calculatePanchang(dateObj, selectedCity, lunarSystem);
            const tithiNum = ((cellPanchang.tithi.number - 1) % 15) + 1;
            const isKrishna = cellPanchang.tithi.paksha === 'KRISHNA';

            let pakshaTitle = 'Krishna';
            if (language === 'gu') {
              pakshaTitle = isKrishna ? 'વદ' : 'સુદ';
            } else if (language === 'hi') {
              pakshaTitle = isKrishna ? 'कृष्ण' : 'शुक्ल';
            } else {
              pakshaTitle = isKrishna ? 'Krishna' : 'Shukla';
            }

            const jainData = getJainDayData(dateObj, cellPanchang.tithi.number - 1);

            let moonIcon = '🌒';
            if (cellPanchang.tithi.number === 15) moonIcon = '🌕';
            else if (cellPanchang.tithi.number === 30) moonIcon = '🌑';
            else if (isKrishna) moonIcon = '🌘';

            const realToday = new Date();
            const isTodayCell = dayNum === realToday.getDate() && month === realToday.getMonth() && year === realToday.getFullYear();
            const cellDharma = getDharmaCalendarDayData(dateObj, calendarSystem, language);

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
                {/* 1. Large Light Gray Background Watermark Tithi Number */}
                <Text style={styles.watermarkTithiNum} numberOfLines={1}>{tithiNum}</Text>

                {/* 2. Top Row: Day Number & Moon Icon */}
                <View style={styles.dayTopRow}>
                  <Text style={[styles.dayNumText, isHoliday && styles.holidayDayNum]}>{dayNum}</Text>
                  <Text style={styles.moonIconText}>{moonIcon}</Text>
                </View>

                {/* 3. Foreground Paksha Label */}
                <Text style={styles.monthPakshaText} numberOfLines={1}>
                  {pakshaTitle}
                </Text>

                {/* Specific Tradition Badge */}
                {cellDharma.badgeText ? (
                  <View style={[
                    styles.festBadge,
                    cellDharma.calendarSystem === 'JAIN' && styles.jainFestBadge,
                    cellDharma.calendarSystem === 'SIKH' && { backgroundColor: '#FFF3E0', borderColor: '#FFB74D' },
                    cellDharma.calendarSystem === 'BUDDHIST' && { backgroundColor: '#E8F5E9', borderColor: '#81C784' },
                    cellDharma.calendarSystem === 'CHRISTIAN' && { backgroundColor: '#E1F5FE', borderColor: '#4FC3F7' },
                    cellDharma.calendarSystem === 'PARSI' && { backgroundColor: '#FBE9E7', borderColor: '#FF8A65' },
                    cellDharma.calendarSystem === 'GLOBAL' && { backgroundColor: '#E0F2F1', borderColor: '#4DB6AC' },
                  ]}>
                    <Text style={[
                      styles.festBadgeText,
                      cellDharma.calendarSystem === 'SIKH' && { color: '#E65100' },
                      cellDharma.calendarSystem === 'BUDDHIST' && { color: '#2E7D32' },
                      cellDharma.calendarSystem === 'CHRISTIAN' && { color: '#0277BD' },
                      cellDharma.calendarSystem === 'PARSI' && { color: '#D84315' },
                      cellDharma.calendarSystem === 'GLOBAL' && { color: '#00695C' },
                    ]} numberOfLines={1}>
                      {cellDharma.badgeText}
                    </Text>
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
                  <Text style={[styles.modalSubLocation, { fontWeight: 'bold', color: Colors.maroon, fontSize: 13, marginBottom: 2 }]}>
                    {language === 'gu'
                      ? '🕉️ હિન્દુ તિથિ અને પંચાંગ વિગત'
                      : (language === 'hi' ? '🕉️ हिंदू तिथि एवं पंचांग विवरण' : '🕉️ Hindu Date & Panchang Details')}
                  </Text>
                  <Text style={styles.modalTitleDate}>{getLocalizedDateString(mDate, language)}</Text>
                  <Text style={styles.modalSubLocation}>📍 {selectedCity.name} ({selectedCity.hindiName})</Text>
                </View>

                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedModalDateIso(null)}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 420 }}>
                {(() => {
                  const mDharmaData = getDharmaCalendarDayData(mDate, calendarSystem, language);
                  return (
                    <View style={styles.jainModalCard}>
                      <Text style={styles.jainModalTitle}>{mDharmaData.eraTitle}</Text>
                      <Text style={styles.jainModalTithi}>
                        Month: {mDharmaData.monthName} • Date: {mDharmaData.dayLabel}
                      </Text>

                      {mDharmaData.badgeText ? (
                        <View style={styles.chaturmasModalBadge}>
                          <Text style={styles.chaturmasModalBadgeText}>{mDharmaData.badgeText}</Text>
                        </View>
                      ) : null}

                      <Text style={[styles.worldModalDesc, { marginTop: 8 }]}>
                        {mDharmaData.significance}
                      </Text>

                      {/* Additional Tradition Details */}
                      <View style={{ marginTop: 10 }}>
                        {mDharmaData.additionalDetails.map((item, idx) => (
                          <View key={idx} style={styles.timingRow}>
                            <Text style={styles.timingLabel}>{item.label}:</Text>
                            <Text style={styles.timingVal}>{item.value}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  );
                })()}

                {/* Specific Festival / Event Banner if exists */}
                {(() => {
                  const mDharmaData = getDharmaCalendarDayData(mDate, calendarSystem, language);
                  const fest = mDharmaData.festivalMatch || festMatchModal;
                  if (!fest) return null;
                  return (
                    <View style={styles.modalFestBanner}>
                      <Text style={styles.modalFestTitle}>🚩 {getLocalizedFestivalTitle(fest, language)}</Text>
                      {language === 'hi' && fest.hindiName && fest.hindiName !== getLocalizedFestivalTitle(fest, language) ? (
                        <Text style={[styles.modalFestDesc, { fontWeight: 'bold' }]}>{fest.hindiName}</Text>
                      ) : null}
                      {language === 'gu' && fest.gujaratiName && fest.gujaratiName !== getLocalizedFestivalTitle(fest, language) ? (
                        <Text style={[styles.modalFestDesc, { fontWeight: 'bold' }]}>{fest.gujaratiName}</Text>
                      ) : null}
                      {fest.description ? (
                        <Text style={styles.modalFestDesc}>{fest.description}</Text>
                      ) : null}
                      {fest.rituals ? (
                        <Text style={[styles.modalFestDesc, { fontStyle: 'italic', marginTop: 4 }]}>
                          ✨ Rituals: {fest.rituals}
                        </Text>
                      ) : null}
                    </View>
                  );
                })()}

                {/* Mini Ritual Badge if exists */}
                {mRitual && (
                  <View style={styles.modalRitualBox}>
                    <Text style={styles.modalRitualText}>{mRitual}</Text>
                  </View>
                )}

                {/* Tithi Exact Timings Box */}
                <View style={styles.timingBox}>
                  <Text style={styles.timingBoxTitle}>🌙 Tithi (तिथि) Exact Timings</Text>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Active Tithi:</Text>
                    <Text style={[styles.timingVal, { color: Colors.maroon, backgroundColor: '#FFF3E0' }]}>
                      {mTithiName} ({mPakshaFull})
                    </Text>
                  </View>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Tithi Starts:</Text>
                    <Text style={[styles.timingVal, { color: '#2E7D32', backgroundColor: '#E8F5E9' }]}>
                      {mPanchang.tithi.startTimeFormatted || '06:22 AM IST'}
                    </Text>
                  </View>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Tithi Ends:</Text>
                    <Text style={[styles.timingVal, { color: '#C62828', backgroundColor: '#FFEBEE' }]}>
                      {mPanchang.tithi.endTimeFormatted || '04:54 AM IST (Next Day)'}
                    </Text>
                  </View>
                </View>

                {/* Nakshatra Exact Timings Box */}
                <View style={styles.timingBox}>
                  <Text style={styles.timingBoxTitle}>⭐ Nakshatra (नक्षत्र) Exact Timings</Text>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Nakshatra Name:</Text>
                    <Text style={[styles.timingVal, { color: Colors.maroon, backgroundColor: '#FFF3E0' }]}>
                      {mPanchang.nakshatra.name} ({mPanchang.nakshatra.hindiName || mPanchang.nakshatra.name})
                    </Text>
                  </View>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Ruler & Deity:</Text>
                    <Text style={styles.timingVal}>
                      {mPanchang.nakshatra.ruler} • {mPanchang.nakshatra.deity}
                    </Text>
                  </View>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Nakshatra Starts:</Text>
                    <Text style={[styles.timingVal, { color: '#2E7D32', backgroundColor: '#E8F5E9' }]}>
                      {mPanchang.nakshatra.startTimeFormatted || '04:15 AM IST'}
                    </Text>
                  </View>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Nakshatra Ends:</Text>
                    <Text style={[styles.timingVal, { color: '#C62828', backgroundColor: '#FFEBEE' }]}>
                      {mPanchang.nakshatra.endTimeFormatted || '02:48 AM IST (Next Day)'}
                    </Text>
                  </View>
                </View>

                {/* Yoga & Karana Details Box */}
                <View style={styles.timingBox}>
                  <Text style={styles.timingBoxTitle}>✨ Yoga & Karana Details</Text>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Yoga (योग):</Text>
                    <Text style={[styles.timingVal, { color: Colors.maroon, backgroundColor: '#FFF3E0' }]}>
                      {mPanchang.yoga.name} (Ends: {mPanchang.yoga.endTimeFormatted})
                    </Text>
                  </View>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Karana (करण):</Text>
                    <Text style={styles.timingVal}>
                      {mPanchang.karana.name} (Ends: {mPanchang.karana.endTimeFormatted})
                    </Text>
                  </View>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>Month & Paksha:</Text>
                    <Text style={styles.timingVal}>
                      {mMonthName} ({mPakshaFull})
                    </Text>
                  </View>
                </View>

                {/* Muhurat & Rahu Kalam Box */}
                <View style={styles.timingBox}>
                  <Text style={styles.timingBoxTitle}>🕒 Sunrise, Sunset & Rahu Kalam</Text>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>🌅 Sunrise / 🌇 Sunset:</Text>
                    <Text style={[styles.timingVal, { color: '#2E7D32', backgroundColor: '#E8F5E9' }]}>
                      {mPanchang.sunMoon.sunrise} / {mPanchang.sunMoon.sunset}
                    </Text>
                  </View>
                  <View style={styles.timingRow}>
                    <Text style={styles.timingLabel}>⚠️ Rahu Kalam (राहु काल):</Text>
                    <Text style={[styles.timingVal, { color: '#C62828', backgroundColor: '#FFEBEE' }]}>
                      {getRahuKalamForDate(mDate)}
                    </Text>
                  </View>
                </View>

                {/* Quick Date Reminder Trigger Button */}
                <TouchableOpacity
                  style={[styles.openDailyPanchangBtn, { backgroundColor: '#FF6F00', marginBottom: 8 }]}
                  onPress={() => {
                    if (isDateInPast(mDate)) {
                      Alert.alert(
                        '⚠️ Past Date Blocked',
                        `Reminders cannot be scheduled for past dates (${mDate.toDateString()}). Please select today or a future date.`
                      );
                      return;
                    }
                    const dData = getDharmaCalendarDayData(mDate, calendarSystem, language);
                    const defaultRemTitle = festMatchModal ? festMatchModal.name : `${dData.dayLabel} Reminder`;
                    const defaultUpcomingTime = getNextUpcomingTimeSlot(mDate);
                    setDateRemTitle(defaultRemTitle);
                    setDateRemNotes(`Reminder for ${dData.monthName} (${dData.dayLabel})`);
                    setDateRemTimeStr(defaultUpcomingTime);
                    setDateRemModalVisible(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.openDailyPanchangText}>⏰ Set Reminder for this Date (इस तिथि का स्मरण)</Text>
                </TouchableOpacity>

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

      {/* Date Quick Reminder & Real-Time Muhurat Safety Checker Modal */}
      {dateRemModalVisible && (
        <Modal visible={dateRemModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitleDate}>⏰ Date Reminder & Muhurat Checker</Text>
                  <Text style={styles.modalSubLocation}>
                    📅 {mDate.toDateString()} • 📍 {selectedCity.name}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setDateRemModalVisible(false)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 440 }}>
                {/* Title Input */}
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 }}>
                  Reminder Title / Event Name:
                </Text>
                <TextInput
                  style={[styles.input, { marginBottom: 10 }]}
                  value={dateRemTitle}
                  onChangeText={setDateRemTitle}
                  placeholder="e.g. Raksha Bandhan Puja, Fasting, Remedy"
                />

                {/* Time Input */}
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 }}>
                  Select Time Slot (Tap to Change):
                </Text>
                <TouchableOpacity
                  style={[styles.input, { marginBottom: 10, justifyContent: 'center', height: 42 }]}
                  onPress={() => setTimePickerVisible(true)}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: Colors.maroon }}>
                    🕒 {dateRemTimeStr} (Tap to Select Time)
                  </Text>
                </TouchableOpacity>

                {/* LIVE MUHURAT SAFETY CHECKER CARD */}
                {(() => {
                  const safety = analyzeMuhuratSafety(mDate, dateRemTimeStr, selectedCity);
                  const isBad = safety.safetyRating === 'INAUSPICIOUS';
                  const isGood = safety.safetyRating === 'AUSPICIOUS';

                  return (
                    <View style={[
                      styles.muhuratSafetyBox,
                      isBad && styles.muhuratSafetyBad,
                      isGood && styles.muhuratSafetyGood
                    ]}>
                      <Text style={[
                        styles.muhuratSafetyTitle,
                        isBad && { color: '#C62828' },
                        isGood && { color: '#2E7D32' }
                      ]}>
                        {safety.title}
                      </Text>

                      <Text style={styles.muhuratSafetyAdvice}>{safety.advice}</Text>

                      <View style={{ marginTop: 8, gap: 4 }}>
                        <Text style={{ fontSize: 11, color: Colors.textPrimary }}>
                          • Active Choghadiya: <Text style={{ fontWeight: 'bold' }}>{safety.activeChoghadiyaName} ({safety.activeChoghadiyaHindi})</Text>
                        </Text>
                        <Text style={{ fontSize: 11, color: Colors.textPrimary }}>
                          • Rahu Kalam Range: <Text style={{ fontWeight: 'bold', color: '#C62828' }}>{safety.rahuKalamRange}</Text>
                        </Text>
                        {safety.isAbhijitMuhurat && (
                          <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#2E7D32' }}>
                            ✨ Abhijit Muhurat is Active!
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })()}

                {/* Notes Input */}
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: Colors.textPrimary, marginTop: 10, marginBottom: 4 }}>
                  Special Ritual Notes:
                </Text>
                <TextInput
                  style={[styles.input, { height: 50, marginBottom: 12 }]}
                  value={dateRemNotes}
                  onChangeText={setDateRemNotes}
                  multiline
                />

                {/* Save Button */}
                <TouchableOpacity
                  style={[styles.openDailyPanchangBtn, { backgroundColor: Colors.maroon, marginTop: 6 }]}
                  onPress={async () => {
                    if (isTimeInPastOnDate(mDate, dateRemTimeStr)) {
                      Alert.alert(
                        '⚠️ Past Time Blocked',
                        `Selected time slot (${dateRemTimeStr}) has already passed today. Please pick an upcoming time slot.`
                      );
                      return;
                    }
                    const safety = analyzeMuhuratSafety(mDate, dateRemTimeStr, selectedCity);
                    await saveReminder({
                      id: `rem-date-${Date.now()}`,
                      title: dateRemTitle.trim() || 'Date Reminder',
                      category: 'DATE_SPECIFIC',
                      dateIso: selectedModalDateIso || undefined,
                      timeStr: dateRemTimeStr,
                      enabled: true,
                      notes: dateRemNotes.trim(),
                      createdAtIso: new Date().toISOString(),
                      muhuratSafetyRating: safety.safetyRating,
                      muhuratAdvice: safety.advice
                    });

                    setDateRemModalVisible(false);
                    Alert.alert(
                      '⏰ Reminder Saved!',
                      `Reminder set for ${dateRemTitle} on ${mDate.toDateString()} at ${dateRemTimeStr}.\n\nAstrological Safety: ${safety.title}`
                    );
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.openDailyPanchangText}>💾 Save Date Reminder</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Multi-Dharma Calendar System Selector Modal */}
      {calSystemModalVisible && (
        <Modal visible={calSystemModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitleDate}>📅 Choose Calendar System</Text>
                <TouchableOpacity onPress={() => setCalSystemModalVisible(false)} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 420 }}>
                {[
                  { id: 'HINDU', title: '🕉️ Hindu Calendar (Vikram Samvat)', desc: 'Standard Vedic Lunar/Solar Panchang with Tithis & Nakshatras' },
                  { id: 'GLOBAL', title: '🌍 Gregorian Solar Calendar', desc: 'Standard Western Solar Dates & International Holidays' },
                  { id: 'JAIN', title: '🪔 Jain Calendar (Vira Nirvana Samvat)', desc: 'Sacred Jain Parva Tithis (Aastham, Chaudas), Pachkhan & Fasting' },
                  { id: 'SIKH', title: '☬ Nanakshahi Sikh Calendar', desc: 'Sikh Samvat 556, Gurpurabs, Shaheedi Diwas & Historic Dates' },
                  { id: 'BUDDHIST', title: '☸️ Buddhist Lunar Calendar (BE 2568)', desc: 'Buddha Era 2568, Vesak, Asalha & Kathina Sacred Days' },
                  { id: 'CHRISTIAN', title: '✝️ Christian Liturgical Calendar', desc: 'Feasts, Lent, Easter, Good Friday, Christmas & Seasons' },
                  { id: 'PARSI', title: '🔥 Zoroastrian Parsi Calendar', desc: 'Shahenshahi / Fasli Yazdegerdi 1396 & Navroz Celebrations' },
                ].map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.calModalOption, calendarSystem === item.id && styles.calModalOptionActive]}
                    onPress={() => {
                      setCalendarSystem(item.id as CalendarSystem);
                      setCalSystemModalVisible(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.calModalTitle, calendarSystem === item.id && styles.calModalTitleActive]}>
                        {item.title}
                      </Text>
                      <Text style={styles.calModalDesc}>{item.desc}</Text>
                    </View>
                    {calendarSystem === item.id && <Text style={styles.checkIcon}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Interactive Time Picker Modal Component */}
      <TimePickerModal
        visible={timePickerVisible}
        initialTimeStr={dateRemTimeStr}
        onClose={() => setTimePickerVisible(false)}
        onConfirm={(newTime) => setDateRemTimeStr(newTime)}
      />
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

  // Multi-Calendar Switcher Dropdown Pill & Modal
  calendarDropdownPill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.maroon,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
  },
  locationSubBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#E8D8C8',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  locationSubText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    flex: 1,
  },
  todayQuickBtn: {
    backgroundColor: Colors.maroon,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  todayQuickBtnText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  calendarDropdownPillText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  calendarDropdownArrow: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  calModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8D8C8',
  },
  calModalOptionActive: {
    backgroundColor: '#FFF3E0',
    borderColor: Colors.maroon,
  },
  calModalTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  calModalTitleActive: {
    color: Colors.maroon,
  },
  calModalDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  checkIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginLeft: 8,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
    textAlign: 'center',
  },
  samvatTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 1,
    textAlign: 'center',
  },
  pakshaSubTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#C62828',
    marginTop: 1,
    textAlign: 'center',
  },
  navBtn: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 54,
    alignItems: 'center',
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
    height: 88,
  },
  dayCell: {
    width: '14.28%',
    height: 88,
    borderWidth: 0.5,
    borderColor: '#F0E0D0',
    padding: 3,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  watermarkTithiNum: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    fontSize: 28,
    fontWeight: '900',
    color: 'rgba(0, 0, 0, 0.08)',
    letterSpacing: -1.5,
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
    fontSize: 9.2,
    fontWeight: 'bold',
    color: '#424242',
    marginTop: 2,
    letterSpacing: -0.3,
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
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 2,
  },
  festBadgeText: {
    fontSize: 11.5,
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
  timingBox: {
    backgroundColor: '#FAF5EE',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E0D0',
    padding: 10,
    marginBottom: 10,
  },
  timingBoxTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 6,
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timingLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  timingVal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.maroon,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  worldModalCard: {
    backgroundColor: '#E8EAF6',
    borderColor: '#C5CAE9',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  worldModalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A237E',
  },
  worldModalSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3949AB',
    marginTop: 2,
  },
  worldModalDesc: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 4,
    lineHeight: 16,
  },
  worldSigBox: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  worldSigTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#283593',
  },
  worldSigText: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
  muhuratSafetyBox: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFE082',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
  },
  muhuratSafetyBad: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF9A9A',
  },
  muhuratSafetyGood: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
  muhuratSafetyTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#F57F17',
    marginBottom: 4,
  },
  muhuratSafetyAdvice: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  input: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#E8D8C8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: Colors.textPrimary,
  },
});
