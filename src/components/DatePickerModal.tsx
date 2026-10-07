import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../types/language';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDateIso: string;
  onSelectDateIso: (dateIso: string) => void;
  onToday: () => void;
}

const MONTH_NAMES_MAP: Record<string, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  hinglish: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'],
  gu: ['જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન', 'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'],
  mr: ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'],
  bn: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
  ta: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'],
  te: ['జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్', 'జూలై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
};

const WEEKDAY_NAMES_MAP: Record<string, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  hinglish: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  hi: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
  gu: ['રવિ', 'સોમ', 'મંગળ', 'બુધ', 'ગુરુ', 'શુક્ર', 'શનિ'],
  mr: ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
  bn: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'],
  ta: ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'],
  te: ['ఆది', 'సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని'],
  ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
};

const FULL_WEEKDAY_NAMES_MAP: Record<string, string[]> = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  hinglish: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
  gu: ['રવિવાર', 'સોમવાર', 'મંગળવાર', 'બુધવાર', 'ગુરુવાર', 'શુક્રવાર', 'શનિવાર'],
  mr: ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
};

const MODAL_LABELS: Record<string, { title: string; todayBtn: string; applyBtn: string; todayTag: string }> = {
  en: {
    title: 'Select Date',
    todayBtn: 'Today',
    applyBtn: 'Apply Date',
    todayTag: 'Today',
  },
  hinglish: {
    title: 'Select Date (तिथि चुनें)',
    todayBtn: 'Today (आज)',
    applyBtn: 'Apply Date (लागू करें)',
    todayTag: 'Today (आज)',
  },
  hi: {
    title: 'तिथि चयन',
    todayBtn: 'आज',
    applyBtn: 'तिथि लागू करें',
    todayTag: 'आज',
  },
  gu: {
    title: 'તારીખ પસંદ કરો',
    todayBtn: 'આજે',
    applyBtn: 'તારીખ લાગુ કરો',
    todayTag: 'આજે',
  },
  mr: {
    title: 'तारीख निवडा',
    todayBtn: 'आज',
    applyBtn: 'तारीख लागू करा',
    todayTag: 'आज',
  },
  bn: {
    title: 'তারিখ নির্বাচন করুন',
    todayBtn: 'আজ',
    applyBtn: 'প্রয়োগ করুন',
    todayTag: 'আজ',
  },
  ta: {
    title: 'தேதியைத் தேர்ந்தெடுக்கவும்',
    todayBtn: 'இன்று',
    applyBtn: 'பயன்படுத்து',
    todayTag: 'இன்று',
  },
  te: {
    title: 'తేదీని ఎంచుకోండి',
    todayBtn: 'ఈరోజు',
    applyBtn: 'వర్తింపజేయి',
    todayTag: 'ఈరోజు',
  },
  ru: {
    title: 'Выберите дату',
    todayBtn: 'Сегодня',
    applyBtn: 'Применить',
    todayTag: 'Сегодня',
  },
  fr: {
    title: 'Sélectionner la date',
    todayBtn: "Aujourd'hui",
    applyBtn: 'Appliquer',
    todayTag: "Aujourd'hui",
  },
  es: {
    title: 'Seleccionar fecha',
    todayBtn: 'Hoy',
    applyBtn: 'Aplicar',
    todayTag: 'Hoy',
  },
};

const CalendarSunIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="17" rx="3.5" fill="#FFFDF9" stroke="#DFB059" strokeWidth="1.8" />
    <Path d="M3 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v5H3V4z" fill="#2B0E14" />
    <Path d="M8 1.5v3M16 1.5v3" stroke="#DFB059" strokeWidth="2" strokeLinecap="round" />
    <Circle cx="8" cy="13" r="1.3" fill="#B88428" />
    <Circle cx="12" cy="13" r="1.3" fill="#B88428" />
    <Circle cx="16" cy="13" r="1.3" fill="#B88428" />
    <Circle cx="8" cy="17" r="1.3" fill="#B88428" />
    <Circle cx="12" cy="17" r="1.6" fill="#DFB059" />
    <Circle cx="16" cy="17" r="1.3" fill="#B88428" />
  </Svg>
);

const QUICK_YEARS = Array.from({ length: 101 }, (_, i) => 1950 + i); // 1950 to 2050
const YEAR_CHIP_WIDTH = 64;
const YEAR_CHIP_GAP = 8;
const YEAR_ITEM_TOTAL = YEAR_CHIP_WIDTH + YEAR_CHIP_GAP; // 72

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  selectedDateIso,
  onSelectDateIso,
  onToday,
}) => {
  const { language } = useLanguage();

  const labels = MODAL_LABELS[language] || MODAL_LABELS.en;
  const monthNames = MONTH_NAMES_MAP[language] || MONTH_NAMES_MAP.en;
  const weekdayNames = WEEKDAY_NAMES_MAP[language] || WEEKDAY_NAMES_MAP.en;
  const fullWeekdayNames = FULL_WEEKDAY_NAMES_MAP[language] || FULL_WEEKDAY_NAMES_MAP.en;

  // Real today reference
  const realToday = new Date();
  const realYear = realToday.getFullYear();
  const realMonth = realToday.getMonth();
  const realDay = realToday.getDate();
  const todayIso = `${realYear}-${String(realMonth + 1).padStart(2, '0')}-${String(realDay).padStart(2, '0')}`;

  // Parse initial selected date
  const parts = (selectedDateIso || todayIso).split('-');
  const initialYear = parseInt(parts[0], 10) || realYear;
  const initialMonth = (parseInt(parts[1], 10) || (realMonth + 1)) - 1;
  const initialDay = parseInt(parts[2], 10) || realDay;

  // Internal state
  const [viewYear, setViewYear] = useState(initialYear);
  const [viewMonth, setViewMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState(initialDay);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [yearPickerWidth, setYearPickerWidth] = useState(340);
  const yearScrollRef = React.useRef<ScrollView>(null);

  // Helper to scroll active year directly to the exact horizontal center
  const scrollToActiveYear = (targetYear: number, animated = true) => {
    const yearIndex = Math.max(0, Math.min(QUICK_YEARS.length - 1, targetYear - 1950));
    // Since paddingHorizontal is (yearPickerWidth - YEAR_CHIP_WIDTH) / 2,
    // the 0-th chip is already centered at scroll offset 0.
    // Each subsequent chip is centered at yearIndex * YEAR_ITEM_TOTAL.
    const targetX = yearIndex * YEAR_ITEM_TOTAL;
    yearScrollRef.current?.scrollTo({ x: targetX, animated });
  };

  // Auto scroll to current year in exact center whenever year picker opens or viewYear changes
  React.useEffect(() => {
    if (showYearPicker) {
      // Immediate scroll without animation
      scrollToActiveYear(viewYear, false);
      const timer = setTimeout(() => {
        scrollToActiveYear(viewYear, false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showYearPicker, viewYear, yearPickerWidth]);

  // Sync state whenever modal becomes visible
  useEffect(() => {
    if (visible) {
      const p = (selectedDateIso || todayIso).split('-');
      const y = parseInt(p[0], 10) || realYear;
      const m = (parseInt(p[1], 10) || (realMonth + 1)) - 1;
      const d = parseInt(p[2], 10) || realDay;
      setViewYear(y);
      setViewMonth(m);
      setSelectedDay(d);
      setShowYearPicker(false);
    }
  }, [visible, selectedDateIso]);

  // Calendar calculations
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sun
  const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const handlePrevYear = () => {
    setViewYear(y => y - 1);
  };

  const handleNextYear = () => {
    setViewYear(y => y + 1);
  };

  const handleSelectDay = (dayNum: number) => {
    setSelectedDay(dayNum);
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    const targetIso = `${viewYear}-${mStr}-${dStr}`;
    onSelectDateIso(targetIso);
    onClose();
  };

  const handleSelectPrevMonthDay = (dayNum: number) => {
    let y = viewYear;
    let m = viewMonth - 1;
    if (m < 0) {
      m = 11;
      y = y - 1;
    }
    const mStr = String(m + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    const targetIso = `${y}-${mStr}-${dStr}`;
    onSelectDateIso(targetIso);
    onClose();
  };

  const handleSelectNextMonthDay = (dayNum: number) => {
    let y = viewYear;
    let m = viewMonth + 1;
    if (m > 11) {
      m = 0;
      y = y + 1;
    }
    const mStr = String(m + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    const targetIso = `${y}-${mStr}-${dStr}`;
    onSelectDateIso(targetIso);
    onClose();
  };

  const handleResetToToday = () => {
    setViewYear(realYear);
    setViewMonth(realMonth);
    setSelectedDay(realDay);
    setShowYearPicker(false);
    onSelectDateIso(todayIso);
    if (onToday) {
      onToday();
    }
    onClose();
  };

  const handleApply = () => {
    const validDay = Math.min(selectedDay, daysInCurrentMonth);
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(validDay).padStart(2, '0');
    const targetIso = `${viewYear}-${mStr}-${dStr}`;
    onSelectDateIso(targetIso);
    onClose();
  };

  // Formatted date string for candidate preview
  const candidateDate = new Date(viewYear, viewMonth, Math.min(selectedDay, daysInCurrentMonth));
  const candidateDayOfWeek = candidateDate.getDay();
  const candidateDayName = fullWeekdayNames[candidateDayOfWeek] || weekdayNames[candidateDayOfWeek];
  const candidateMonthName = monthNames[viewMonth];
  const candidateIso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(Math.min(selectedDay, daysInCurrentMonth)).padStart(2, '0')}`;
  const isCandidateToday = candidateIso === todayIso;

  // Render day cells
  const totalSlots = Math.ceil((firstDayOfWeek + daysInCurrentMonth) / 7) * 7;
  const trailingCount = totalSlots - (firstDayOfWeek + daysInCurrentMonth);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => {}}
        >
          {/* 1. Header with Sacred Crest & Selected Date Preview */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeftGroup}>
              <View style={styles.crestCircle}>
                <CalendarSunIcon />
              </View>
              <TouchableOpacity 
                style={styles.headerTextGroup}
                onPress={() => setShowYearPicker(v => !v)}
                activeOpacity={0.75}
              >
                <Text style={styles.modalTitle}>{labels.title}</Text>
                <View style={styles.previewDateRow}>
                  <Text style={styles.previewDateText}>
                    {candidateDayName}, {Math.min(selectedDay, daysInCurrentMonth)} {candidateMonthName} {viewYear}
                  </Text>
                  {isCandidateToday && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayBadgeText}>{labels.todayTag}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 2. Month & Year Navigator Bar */}
          <View style={styles.navigatorContainer}>
            <View style={styles.navArrowsGroup}>
              <TouchableOpacity
                style={styles.navStepBtn}
                onPress={handlePrevYear}
                activeOpacity={0.65}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              >
                <Text style={styles.navStepText}>«</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navStepBtn}
                onPress={handlePrevMonth}
                activeOpacity={0.65}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              >
                <Text style={styles.navStepText}>‹</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.monthYearCenterBtn}
              onPress={() => setShowYearPicker(v => !v)}
              activeOpacity={0.75}
            >
              <Text style={styles.monthYearText}>
                {monthNames[viewMonth]} {viewYear}
              </Text>
              <Text style={styles.monthYearChevron}>{showYearPicker ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            <View style={styles.navArrowsGroup}>
              <TouchableOpacity
                style={styles.navStepBtn}
                onPress={handleNextMonth}
                activeOpacity={0.65}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              >
                <Text style={styles.navStepText}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navStepBtn}
                onPress={handleNextYear}
                activeOpacity={0.65}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              >
                <Text style={styles.navStepText}>»</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Quick Year Strip (Always centered on current/selected year) */}
          {showYearPicker && (
            <View 
              style={styles.yearPickerContainer}
              onLayout={(e) => {
                const w = e.nativeEvent.layout.width;
                if (w > 0 && Math.abs(w - yearPickerWidth) > 2) {
                  setYearPickerWidth(w);
                }
              }}
            >
              <ScrollView 
                ref={yearScrollRef} 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={[
                  styles.yearScrollContent,
                  { paddingHorizontal: Math.max(16, (yearPickerWidth - YEAR_CHIP_WIDTH) / 2) }
                ]}
                onContentSizeChange={() => {
                  scrollToActiveYear(viewYear, false);
                }}
              >
                {QUICK_YEARS.map(y => {
                  const isActive = viewYear === y;
                  return (
                    <TouchableOpacity
                      key={y}
                      style={[styles.yearChip, isActive && styles.yearChipActive]}
                      onPress={() => {
                        setViewYear(y);
                        scrollToActiveYear(y, true);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.yearChipText, isActive && styles.yearChipTextActive]}>
                        {y}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* 4. Weekday Headers Row */}
          <View style={styles.weekdayRow}>
            {weekdayNames.map((wName, idx) => {
              const isSunday = idx === 0;
              return (
                <View key={wName} style={styles.weekdayCell}>
                  <Text style={[styles.weekdayText, isSunday && styles.weekdaySundayText]}>
                    {wName}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* 5. 7-Column Monthly Calendar Grid */}
          <View style={styles.gridContainer}>
            {/* A. Leading ghost days from previous month */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => {
              const prevMonthDay = daysInPrevMonth - firstDayOfWeek + 1 + i;
              return (
                <TouchableOpacity
                  key={`prev-${i}`}
                  style={styles.dayCellContainer}
                  onPress={() => handleSelectPrevMonthDay(prevMonthDay)}
                  activeOpacity={0.6}
                >
                  <View style={styles.ghostDayCircle}>
                    <Text style={styles.ghostDayText}>{prevMonthDay}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* B. Active days of current month */}
            {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
              const d = i + 1;
              const isSelected = selectedDay === d;
              const isTodayCell = d === realDay && viewMonth === realMonth && viewYear === realYear;
              const isSunday = (firstDayOfWeek + i) % 7 === 0;

              return (
                <TouchableOpacity
                  key={`cur-${d}`}
                  style={styles.dayCellContainer}
                  onPress={() => handleSelectDay(d)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.dayCircle,
                      isSelected && styles.dayCircleSelected,
                      isTodayCell && !isSelected && styles.dayCircleToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isSunday && !isSelected && styles.daySundayText,
                        isTodayCell && !isSelected && styles.dayTodayText,
                        isSelected && styles.daySelectedText,
                      ]}
                    >
                      {d}
                    </Text>
                    {isTodayCell && !isSelected && <View style={styles.todayIndicatorDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* C. Trailing ghost days from next month */}
            {Array.from({ length: trailingCount }).map((_, i) => {
              const nextMonthDay = i + 1;
              return (
                <TouchableOpacity
                  key={`next-${i}`}
                  style={styles.dayCellContainer}
                  onPress={() => handleSelectNextMonthDay(nextMonthDay)}
                  activeOpacity={0.6}
                >
                  <View style={styles.ghostDayCircle}>
                    <Text style={styles.ghostDayText}>{nextMonthDay}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 6. Action Buttons Bar */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetToToday}
              activeOpacity={0.75}
            >
              <Text style={styles.resetButtonIcon}>↺</Text>
              <Text style={styles.resetButtonText}>{labels.todayBtn}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonIcon}>✓</Text>
              <Text style={styles.applyButtonText}>{labels.applyBtn}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 7, 11, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFDF9',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#DFB059',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE7D8',
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  crestCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2B0E14',
    borderWidth: 1.2,
    borderColor: '#DFB059',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextGroup: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B0E14',
    letterSpacing: 0.3,
  },
  previewDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  previewDateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B88428',
    flexShrink: 1,
  },
  todayBadge: {
    backgroundColor: '#DFB059',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  todayBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2B0E14',
    textTransform: 'uppercase',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5EEE2',
    borderWidth: 1,
    borderColor: '#E8DDCB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7D6A68',
  },
  navigatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F5EC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8DDCB',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 12,
    marginBottom: 8,
  },
  navArrowsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navStepBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#E0D4C0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navStepText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2B0E14',
    lineHeight: 18,
  },
  monthYearCenterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  monthYearText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2B0E14',
    letterSpacing: 0.2,
  },
  monthYearChevron: {
    fontSize: 10,
    color: '#DFB059',
    fontWeight: 'bold',
  },
  yearPickerContainer: {
    backgroundColor: '#F3EDE2',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginBottom: 8,
  },
  yearScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  yearChip: {
    width: YEAR_CHIP_WIDTH,
    marginRight: YEAR_CHIP_GAP,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#DFCFA8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearChipActive: {
    backgroundColor: '#2B0E14',
    borderColor: '#DFB059',
  },
  yearChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2B0E14',
  },
  yearChipTextActive: {
    color: '#DFB059',
    fontWeight: '700',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8DC',
    marginBottom: 4,
  },
  weekdayCell: {
    width: '14.28%',
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7D6A68',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  weekdaySundayText: {
    color: '#D32F2F',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 4,
  },
  dayCellContainer: {
    width: '14.28%',
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dayCircleSelected: {
    backgroundColor: '#2B0E14',
    borderWidth: 1.5,
    borderColor: '#DFB059',
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dayCircleToday: {
    borderWidth: 1.5,
    borderColor: '#DFB059',
    backgroundColor: '#F9F4E8',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B0E14',
  },
  daySundayText: {
    color: '#D32F2F',
  },
  dayTodayText: {
    fontWeight: '700',
    color: '#2B0E14',
  },
  daySelectedText: {
    color: '#DFB059',
    fontWeight: '800',
  },
  todayIndicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DFB059',
    position: 'absolute',
    bottom: 2,
  },
  ghostDayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostDayText: {
    fontSize: 12,
    color: '#CCC3B4',
    fontWeight: '500',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EFE7D8',
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#F5EEE2',
    borderWidth: 1,
    borderColor: '#E0D4C0',
  },
  resetButtonIcon: {
    fontSize: 14,
    color: '#7D6A68',
    fontWeight: 'bold',
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2B0E14',
  },
  applyButton: {
    flex: 1.25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#2B0E14',
    borderWidth: 1.5,
    borderColor: '#DFB059',
    shadowColor: '#2B0E14',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  applyButtonIcon: {
    fontSize: 14,
    color: '#DFB059',
    fontWeight: 'bold',
  },
  applyButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DFB059',
    letterSpacing: 0.3,
  },
});
