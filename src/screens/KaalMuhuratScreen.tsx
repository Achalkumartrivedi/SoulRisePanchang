import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Fonts } from '../constants/typography';
import { PanchangDayData, CityLocation, MuhuratTiming } from '../types/panchang';
import { useLanguage } from '../context/LanguageContext';
import { CelestialBackground } from '../components/CelestialBackground';
import { DatePickerModal } from '../components/DatePickerModal';
import { calculateTimingProgress } from '../engine/muhuratCalculator';
import {
  getLocalizedMuhuratDisplayName,
  getKaalMuhuratLabels,
  getLocalizedDateTitle,
  getLocalizedChoghadiyaName,
  getLocalizedMuhuratDescription,
} from '../i18n/kaalMuhuratI18n';
import { ABHIJIT_GUIDE } from '../data/abhijitGuideRepository';
import { BRAHMA_GUIDE } from '../data/brahmaGuideRepository';
import { VIJAYA_GUIDE } from '../data/vijayaGuideRepository';
import { RAHU_GUIDE, YAMAGANDA_GUIDE, GULIKA_GUIDE } from '../data/inauspiciousGuideRepository';

interface KaalMuhuratScreenProps {
  panchang: PanchangDayData;
  currentDateIso: string;
  selectedCity: CityLocation;
  initialTab?: 'ALL' | 'AUSPICIOUS' | 'INAUSPICIOUS';
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onSelectDateIso: (dateIso: string) => void;
  onBack: () => void;
}

export const KaalMuhuratScreen: React.FC<KaalMuhuratScreenProps> = ({
  panchang,
  currentDateIso,
  selectedCity,
  initialTab = 'ALL',
  onPrevDay,
  onNextDay,
  onToday,
  onSelectDateIso,
  onBack,
}) => {
  const { language } = useLanguage();
  const labels = useMemo(() => getKaalMuhuratLabels(language), [language]);

  const [activeTab, setActiveTab] = useState<'ALL' | 'AUSPICIOUS' | 'INAUSPICIOUS'>(initialTab);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<MuhuratTiming | null>(null);
  const [showChoghadiya, setShowChoghadiya] = useState(false);
  const [tick, setTick] = useState(0);

  // Live timer tick every 15 seconds to update active timers and progress bars
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Pulsing animation for LIVE NOW indicator
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.35,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Formatted date string
  const dateObj = useMemo(() => {
    const parts = currentDateIso.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    return new Date();
  }, [currentDateIso]);

  const formattedDateTitle = useMemo(() => {
    return getLocalizedDateTitle(dateObj, language);
  }, [dateObj, language]);

  const realTodayIso = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);
  const isToday = currentDateIso === realTodayIso;

  const auspiciousList = panchang.auspiciousMuhurats || [];
  const inauspiciousList = panchang.inauspiciousMuhurats || [];

  // Compute progress items
  const evaluatedAuspicious = useMemo(() => {
    const isWednesday = dateObj.getDay() === 3;
    return auspiciousList.map((item) => ({
      ...item,
      displayName: getLocalizedMuhuratDisplayName(item.name, item.hindiName, language),
      localizedDescription: getLocalizedMuhuratDescription(item.name, item.description, language, isWednesday),
      progress: calculateTimingProgress(item.startTime, item.endTime, currentDateIso, new Date(), language),
    }));
  }, [auspiciousList, currentDateIso, language, tick, dateObj]);

  const evaluatedInauspicious = useMemo(() => {
    return inauspiciousList.map((item) => ({
      ...item,
      displayName: getLocalizedMuhuratDisplayName(item.name, item.hindiName, language),
      localizedDescription: getLocalizedMuhuratDescription(item.name, item.description, language),
      progress: calculateTimingProgress(item.startTime, item.endTime, currentDateIso, new Date(), language),
    }));
  }, [inauspiciousList, currentDateIso, language, tick]);

  // Find if any item is active RIGHT NOW
  const activeNowItem = useMemo(() => {
    if (!isToday) return null;
    const activeShubh = evaluatedAuspicious.find((m) => m.progress.status === 'ACTIVE');
    if (activeShubh) return { item: activeShubh, isAuspicious: true };
    const activeKaal = evaluatedInauspicious.find((m) => m.progress.status === 'ACTIVE');
    if (activeKaal) return { item: activeKaal, isAuspicious: false };
    return null;
  }, [evaluatedAuspicious, evaluatedInauspicious, isToday]);

  // Next upcoming item if none is currently active
  const nextUpcomingItem = useMemo(() => {
    if (!isToday || activeNowItem) return null;
    const allUpcoming = [
      ...evaluatedAuspicious.map((m) => ({ item: m, isAuspicious: true })),
      ...evaluatedInauspicious.map((m) => ({ item: m, isAuspicious: false })),
    ].filter((entry) => entry.item.progress.status === 'UPCOMING');

    if (allUpcoming.length === 0) return null;
    return allUpcoming[0];
  }, [evaluatedAuspicious, evaluatedInauspicious, isToday, activeNowItem]);

  // Filter list by selected tab
  const displayedItems = useMemo(() => {
    if (activeTab === 'AUSPICIOUS') {
      return evaluatedAuspicious.map((item) => ({ item, isAuspicious: true }));
    }
    if (activeTab === 'INAUSPICIOUS') {
      return evaluatedInauspicious.map((item) => ({ item, isAuspicious: false }));
    }
    // 'ALL' tab: chronologically by start time
    const combined = [
      ...evaluatedAuspicious.map((item) => ({ item, isAuspicious: true })),
      ...evaluatedInauspicious.map((item) => ({ item, isAuspicious: false })),
    ];
    return combined.sort((a, b) => {
      const getMin = (tStr: string) => {
        const clean = tStr.replace(/\b(Today|Tomorrow|IST)\b/gi, '').trim();
        const parts = clean.split(' ');
        const [hStr, mStr] = (parts[0] || '06:00').split(':');
        let h = parseInt(hStr, 10) || 0;
        const m = parseInt(mStr, 10) || 0;
        if (parts.length > 1) {
          const ampm = parts[1].toUpperCase();
          if (ampm === 'PM' && h < 12) h += 12;
          if (ampm === 'AM' && h === 12) h = 0;
        }
        return h * 60 + m;
      };
      return getMin(a.item.startTime) - getMin(b.item.startTime);
    });
  }, [activeTab, evaluatedAuspicious, evaluatedInauspicious]);

  // Helper to open guide modal details
  const getModalGuideContent = (item: MuhuratTiming | null) => {
    if (!item) return null;
    const nameLower = item.name.toLowerCase();
    const langKey = language as any;

    if (nameLower.includes('abhijit')) {
      const g = (ABHIJIT_GUIDE as any)[langKey] || ABHIJIT_GUIDE.hinglish;
      return {
        title: getLocalizedMuhuratDisplayName(item.name, item.hindiName, language),
        subtitle: g.subtitle,
        ideal: g.idealFor || [],
        avoid: g.avoidFor || [],
        tip: g.vedicSecret || item.description,
      };
    }
    if (nameLower.includes('brahma')) {
      const g = (BRAHMA_GUIDE as any)[langKey] || BRAHMA_GUIDE.hinglish;
      return {
        title: getLocalizedMuhuratDisplayName(item.name, item.hindiName, language),
        subtitle: g.subtitle,
        ideal: g.idealFor || [],
        avoid: g.avoidFor || [],
        tip: g.vedicSecret || item.description,
      };
    }
    if (nameLower.includes('vijay')) {
      const g = (VIJAYA_GUIDE as any)[langKey] || VIJAYA_GUIDE.hinglish;
      return {
        title: getLocalizedMuhuratDisplayName(item.name, item.hindiName, language),
        subtitle: g.subtitle,
        ideal: g.idealFor || [],
        avoid: g.avoidFor || [],
        tip: g.vedicSecret || item.description,
      };
    }
    if (nameLower.includes('rahu')) {
      const g = (RAHU_GUIDE as any)[langKey] || RAHU_GUIDE.hinglish;
      return {
        title: getLocalizedMuhuratDisplayName(item.name, item.hindiName, language),
        subtitle: g.subtitle,
        ideal: g.whatToAvoid || [],
        avoid: g.safeActivities || [],
        tip: g.remedies ? g.remedies[0] : item.description,
      };
    }
    if (nameLower.includes('yama')) {
      const g = (YAMAGANDA_GUIDE as any)[langKey] || YAMAGANDA_GUIDE.hinglish;
      return {
        title: getLocalizedMuhuratDisplayName(item.name, item.hindiName, language),
        subtitle: g.subtitle,
        ideal: g.whatToAvoid || [],
        avoid: g.safeActivities || [],
        tip: g.remedies ? g.remedies[0] : item.description,
      };
    }
    if (nameLower.includes('gulika')) {
      const g = (GULIKA_GUIDE as any)[langKey] || GULIKA_GUIDE.hinglish;
      return {
        title: getLocalizedMuhuratDisplayName(item.name, item.hindiName, language),
        subtitle: g.subtitle,
        ideal: g.whatToAvoid || [],
        avoid: g.safeActivities || [],
        tip: g.remedies ? g.remedies[0] : item.description,
      };
    }

    return {
      title: getLocalizedMuhuratDisplayName(item.name, item.hindiName, language),
      subtitle: item.isAuspicious ? labels.tabShubh : labels.tabKaal,
      ideal: item.isAuspicious ? ['Spiritual activities', 'New beginnings', 'Prayers'] : ['Avoid starting important projects'],
      avoid: item.isAuspicious ? ['Tamasic activities'] : ['Crucial transactions', 'Travel', 'Contracts'],
      tip: item.description,
    };
  };

  const modalData = getModalGuideContent(selectedItemForModal);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5EE" />

      {/* 1. Header with Back Button */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="#2B0E14"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{labels.headerTitle}</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {selectedCity.name} • {formattedDateTitle}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.calendarIconBtn}
          onPress={() => setIsDatePickerVisible(true)}
          activeOpacity={0.7}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="4" width="18" height="17" rx="3" stroke="#2B0E14" strokeWidth="1.8" />
            <Path d="M3 9h18" stroke="#2B0E14" strokeWidth="1.8" />
            <Path d="M8 2v3M16 2v3" stroke="#DFB059" strokeWidth="2" strokeLinecap="round" />
            <Circle cx="8" cy="14" r="1.2" fill="#2B0E14" />
            <Circle cx="12" cy="14" r="1.2" fill="#2B0E14" />
            <Circle cx="16" cy="14" r="1.2" fill="#2B0E14" />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 2. Date Navigation Bar */}
        <View style={styles.dateNavBar}>
          <TouchableOpacity style={styles.dateNavBtn} onPress={onPrevDay} activeOpacity={0.7}>
            <Text style={styles.dateNavArrow}>◀</Text>
            <Text style={styles.dateNavBtnText}>{labels.prevDay}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.todayBadge, isToday && styles.todayBadgeActive]}
            onPress={onToday}
            activeOpacity={0.8}
          >
            <Text style={[styles.todayBadgeText, isToday && styles.todayBadgeTextActive]}>
              {isToday ? labels.today : labels.goToToday}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dateNavBtn} onPress={onNextDay} activeOpacity={0.7}>
            <Text style={styles.dateNavBtnText}>{labels.nextDay}</Text>
            <Text style={styles.dateNavArrow}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Hero Status Banner */}
        {activeNowItem ? (
          <View
            style={[
              styles.heroActiveCard,
              activeNowItem.isAuspicious ? styles.heroActiveShubh : styles.heroActiveKaal,
            ]}
          >
            <View style={styles.heroTopRow}>
              <View style={styles.liveIndicatorRow}>
                <Animated.View
                  style={[
                    styles.pulsingDot,
                    {
                      backgroundColor: activeNowItem.isAuspicious ? '#237B4B' : '#BC2C2C',
                      opacity: pulseAnim,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.liveBadgeText,
                    { color: activeNowItem.isAuspicious ? '#237B4B' : '#BC2C2C' },
                  ]}
                >
                  {activeNowItem.isAuspicious ? labels.badgeLiveShubh : labels.badgeLiveKaal}
                </Text>
              </View>

              <Text
                style={[
                  styles.heroCountdownText,
                  { color: activeNowItem.isAuspicious ? '#237B4B' : '#BC2C2C' },
                ]}
              >
                {activeNowItem.item.progress.timeRemainingLabel}
              </Text>
            </View>

            <Text style={styles.heroItemTitle}>
              {activeNowItem.item.displayName}
            </Text>

            <Text style={styles.heroTimeRange}>
              {activeNowItem.item.startTime} – {activeNowItem.item.endTime} ({activeNowItem.item.progress.durationMinutes} {labels.minsUnit})
            </Text>

            {/* Active Progression Bar */}
            <View style={styles.heroProgressTrack}>
              <View
                style={[
                  styles.heroProgressFill,
                  {
                    backgroundColor: activeNowItem.isAuspicious ? '#237B4B' : '#BC2C2C',
                    width: `${activeNowItem.item.progress.progressPercent}%`,
                  },
                ]}
              />
            </View>

            <View style={styles.heroProgressInfoRow}>
              <Text style={styles.heroProgressPctText}>
                {activeNowItem.item.progress.progressPercent}% {labels.elapsed}
              </Text>
              <Text style={styles.heroProgressRemainingText}>
                {activeNowItem.item.progress.timeRemainingLabel}
              </Text>
            </View>

            <Text style={styles.heroDescriptionText}>
              {activeNowItem.item.localizedDescription || activeNowItem.item.description}
            </Text>
          </View>
        ) : nextUpcomingItem ? (
          <View style={styles.heroUpcomingCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.upcomingBadge}>
                <Text style={styles.upcomingBadgeText}>{labels.badgeUpcoming}</Text>
              </View>
              <Text style={styles.upcomingCountdownText}>
                {nextUpcomingItem.item.progress.timeRemainingLabel}
              </Text>
            </View>
            <Text style={styles.upcomingItemTitle}>
              {nextUpcomingItem.item.displayName}
            </Text>
            <Text style={styles.upcomingTimeRange}>
              {nextUpcomingItem.item.startTime} – {nextUpcomingItem.item.endTime}
            </Text>
            <Text style={styles.upcomingDescText}>
              {nextUpcomingItem.item.localizedDescription || nextUpcomingItem.item.description}
            </Text>
          </View>
        ) : null}

        {/* 4. Segmented Control Tabs */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'ALL' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('ALL')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeTab === 'ALL' && styles.segmentTextActive]}>
              {labels.tabAll} ({auspiciousList.length + inauspiciousList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'AUSPICIOUS' && styles.segmentBtnActiveShubh]}
            onPress={() => setActiveTab('AUSPICIOUS')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeTab === 'AUSPICIOUS' && styles.segmentTextActiveShubh]}>
              {labels.tabShubh} ({auspiciousList.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'INAUSPICIOUS' && styles.segmentBtnActiveKaal]}
            onPress={() => setActiveTab('INAUSPICIOUS')}
            activeOpacity={0.8}
          >
            <Text style={[styles.segmentText, activeTab === 'INAUSPICIOUS' && styles.segmentTextActiveKaal]}>
              {labels.tabKaal} ({inauspiciousList.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* 5. Timings List */}
        <View style={styles.cardsList}>
          {displayedItems.map(({ item, isAuspicious }, idx) => {
            const prog = item.progress;
            const isLive = prog.status === 'ACTIVE';
            const isPassed = prog.status === 'COMPLETED';

            return (
              <TouchableOpacity
                key={`${item.name}-${idx}`}
                style={[
                  styles.timingCard,
                  isAuspicious ? styles.timingCardShubh : styles.timingCardKaal,
                  isLive && (isAuspicious ? styles.timingCardLiveShubh : styles.timingCardLiveKaal),
                ]}
                activeOpacity={0.75}
                onPress={() => setSelectedItemForModal(item)}
              >
                {/* Header row inside card */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardTitleCol}>
                    <Text style={styles.timingCardTitle}>{item.displayName}</Text>
                    <Text style={styles.timingDurationText}>
                      {labels.durationLabel} {prog.durationMinutes} {labels.minsUnit}
                    </Text>
                  </View>

                  {/* Status Badge */}
                  <View>
                    {isLive ? (
                      <View style={isAuspicious ? styles.badgeLiveShubh : styles.badgeLiveKaal}>
                        <Animated.View
                          style={[
                            styles.badgeLiveDot,
                            {
                              backgroundColor: isAuspicious ? '#237B4B' : '#BC2C2C',
                              opacity: pulseAnim,
                            },
                          ]}
                        />
                        <Text style={isAuspicious ? styles.badgeLiveTextShubh : styles.badgeLiveTextKaal}>
                          {labels.badgeLiveShubh} ({prog.progressPercent}%)
                        </Text>
                      </View>
                    ) : isPassed ? (
                      <View style={styles.badgePassed}>
                        <Text style={styles.badgePassedText}>{labels.badgePassed}</Text>
                      </View>
                    ) : (
                      <View style={styles.badgeUpcoming}>
                        <Text style={styles.badgeUpcomingText}>{prog.timeRemainingLabel}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Timing Range Display */}
                <View style={styles.timingRangeRow}>
                  <Text
                    style={[
                      styles.timingRangeText,
                      isAuspicious ? styles.timingRangeShubh : styles.timingRangeKaal,
                    ]}
                  >
                    {item.startTime} – {item.endTime}
                  </Text>
                  <Text style={styles.tapDetailsHint}>{labels.tapDetails}</Text>
                </View>

                {/* Progression Bar: Green for Shubh, Red for Kaal */}
                <View
                  style={[
                    styles.cardProgressTrack,
                    {
                      backgroundColor: isAuspicious
                        ? 'rgba(35, 123, 75, 0.12)'
                        : 'rgba(188, 44, 44, 0.12)',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.cardProgressFill,
                      {
                        backgroundColor: isAuspicious ? '#237B4B' : '#BC2C2C',
                        width: `${prog.progressPercent}%`,
                      },
                    ]}
                  />
                </View>

                {/* Description / Vedic Advice */}
                <Text style={styles.cardDescText} numberOfLines={2}>
                  {item.localizedDescription || item.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 6. Day & Night Choghadiya Collapsible Section */}
        <View style={styles.choghadiyaContainer}>
          <TouchableOpacity
            style={styles.choghadiyaToggleBtn}
            onPress={() => setShowChoghadiya((prev) => !prev)}
            activeOpacity={0.8}
          >
            <View style={styles.choghadiyaToggleLeft}>
              <Text style={styles.choghadiyaToggleIcon}>🕒</Text>
              <View>
                <Text style={styles.choghadiyaToggleTitle}>{labels.choghadiyaTitle}</Text>
                <Text style={styles.choghadiyaToggleSub}>
                  {showChoghadiya ? labels.choghadiyaSubOpen : labels.choghadiyaSubClosed}
                </Text>
              </View>
            </View>
            <Text style={styles.choghadiyaArrow}>{showChoghadiya ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showChoghadiya && (
            <View style={styles.choghadiyaTable}>
              <Text style={styles.choghadiyaSectionTitle}>{labels.choghadiyaDayTitle}</Text>
              <View style={styles.choghadiyaGrid}>
                {(panchang.dayChoghadiya || []).map((c, i) => (
                  <View
                    key={`day-${i}`}
                    style={[
                      styles.choghadiyaItem,
                      c.isAuspicious ? styles.choghadiyaItemShubh : styles.choghadiyaItemAshubh,
                    ]}
                  >
                    <View style={styles.choghadiyaItemTop}>
                      <Text style={styles.choghadiyaName}>
                        {getLocalizedChoghadiyaName(c.name, c.hindiName, language)}
                      </Text>
                      <Text
                        style={[
                          styles.choghadiyaTag,
                          c.isAuspicious ? styles.tagShubhText : styles.tagAshubhText,
                        ]}
                      >
                        {c.isAuspicious ? labels.shubhTag : labels.ashubhTag}
                      </Text>
                    </View>
                    <Text style={styles.choghadiyaTime}>{c.startTime} – {c.endTime}</Text>
                  </View>
                ))}
              </View>

              <Text style={[styles.choghadiyaSectionTitle, { marginTop: 16 }]}>
                {labels.choghadiyaNightTitle}
              </Text>
              <View style={styles.choghadiyaGrid}>
                {(panchang.nightChoghadiya || []).map((c, i) => (
                  <View
                    key={`night-${i}`}
                    style={[
                      styles.choghadiyaItem,
                      c.isAuspicious ? styles.choghadiyaItemShubh : styles.choghadiyaItemAshubh,
                    ]}
                  >
                    <View style={styles.choghadiyaItemTop}>
                      <Text style={styles.choghadiyaName}>
                        {getLocalizedChoghadiyaName(c.name, c.hindiName, language)}
                      </Text>
                      <Text
                        style={[
                          styles.choghadiyaTag,
                          c.isAuspicious ? styles.tagShubhText : styles.tagAshubhText,
                        ]}
                      >
                        {c.isAuspicious ? labels.shubhTag : labels.ashubhTag}
                      </Text>
                    </View>
                    <Text style={styles.choghadiyaTime}>{c.startTime} – {c.endTime}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        selectedDateIso={currentDateIso}
        onSelectDateIso={(iso) => {
          onSelectDateIso(iso);
          setIsDatePickerVisible(false);
        }}
        onToday={() => {
          onToday();
          setIsDatePickerVisible(false);
        }}
      />

      {/* Detailed Vedic Info Modal */}
      <Modal
        visible={!!selectedItemForModal}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItemForModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.modalTitle}>{modalData?.title}</Text>
                <Text style={styles.modalSubtitle}>{modalData?.subtitle}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedItemForModal(null)}
                style={styles.modalCloseBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedItemForModal && (
              <View style={styles.modalTimingBox}>
                <Text style={styles.modalTimingLabel}>{labels.modalTimingLabel}</Text>
                <Text
                  style={[
                    styles.modalTimingValue,
                    selectedItemForModal.isAuspicious
                      ? { color: '#237B4B' }
                      : { color: '#BC2C2C' },
                  ]}
                >
                  {selectedItemForModal.startTime} – {selectedItemForModal.endTime}
                </Text>
              </View>
            )}

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Guidance Sections */}
              {modalData?.ideal && modalData.ideal.length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionHeader}>{labels.modalRecommended}</Text>
                  {modalData.ideal.map((act: string, i: number) => (
                    <Text key={`act-${i}`} style={styles.modalBullet}>
                      • {act}
                    </Text>
                  ))}
                </View>
              )}

              {modalData?.avoid && modalData.avoid.length > 0 && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionHeader}>{labels.modalAvoid}</Text>
                  {modalData.avoid.map((act: string, i: number) => (
                    <Text key={`avoid-${i}`} style={styles.modalBullet}>
                      • {act}
                    </Text>
                  ))}
                </View>
              )}

              {modalData?.tip && (
                <View style={styles.modalTipBox}>
                  <Text style={styles.modalTipTitle}>{labels.modalVedicTip}</Text>
                  <Text style={styles.modalTipText}>{modalData.tip}</Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={() => setSelectedItemForModal(null)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalDoneText}>{labels.modalDoneBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(248, 245, 238, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(234, 219, 206, 0.7)',
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(43, 14, 20, 0.05)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  headerTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 18,
    color: '#2B0E14',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11,
    color: '#7D6A68',
    marginTop: 1,
  },
  calendarIconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(223, 176, 89, 0.15)',
  },
  scrollArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // Date Navigation Bar
  dateNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(234, 219, 206, 0.8)',
    marginBottom: 14,
  },
  dateNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
  },
  dateNavArrow: {
    fontSize: 10,
    color: '#DFB059',
  },
  dateNavBtnText: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 11,
    color: '#2B0E14',
  },
  todayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(43, 14, 20, 0.05)',
  },
  todayBadgeActive: {
    backgroundColor: '#2B0E14',
  },
  todayBadgeText: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 11,
    color: '#2B0E14',
  },
  todayBadgeTextActive: {
    color: '#DFB059',
  },

  // Hero Active Card
  heroActiveCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  heroActiveShubh: {
    borderColor: '#237B4B',
    backgroundColor: 'rgba(243, 250, 246, 0.94)',
  },
  heroActiveKaal: {
    borderColor: '#BC2C2C',
    backgroundColor: 'rgba(255, 245, 245, 0.94)',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulsingDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  liveBadgeText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    letterSpacing: 0.6,
  },
  heroCountdownText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 12,
  },
  heroItemTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 19,
    color: '#2B0E14',
    marginTop: 2,
  },
  heroTimeRange: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 13,
    color: '#2B0E14',
    marginTop: 2,
  },
  heroProgressTrack: {
    height: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 3,
    marginVertical: 10,
    overflow: 'hidden',
  },
  heroProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  heroProgressInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroProgressPctText: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 10,
    color: '#7D6A68',
  },
  heroProgressRemainingText: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 10,
    color: '#7D6A68',
  },
  heroDescriptionText: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 12,
    color: '#5C4745',
    lineHeight: 17,
  },

  // Upcoming Banner
  heroUpcomingCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(223, 176, 89, 0.4)',
    backgroundColor: 'rgba(255, 253, 249, 0.94)',
    marginBottom: 16,
  },
  upcomingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  upcomingBadgeText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#92400E',
    letterSpacing: 0.5,
  },
  upcomingCountdownText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11,
    color: '#92400E',
  },
  upcomingItemTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 18,
    color: '#2B0E14',
    marginTop: 4,
  },
  upcomingTimeRange: {
    fontFamily: Fonts.jakartaSemiBold,
    fontSize: 12,
    color: '#7D6A68',
    marginTop: 1,
  },
  upcomingDescText: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11,
    color: '#5C4745',
    marginTop: 4,
  },

  // Segment Tabs
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(234, 219, 206, 0.8)',
    marginBottom: 14,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: '#2B0E14',
  },
  segmentBtnActiveShubh: {
    backgroundColor: '#E9F5EE',
    borderWidth: 1,
    borderColor: 'rgba(35, 123, 75, 0.4)',
  },
  segmentBtnActiveKaal: {
    backgroundColor: '#FDF0F0',
    borderWidth: 1,
    borderColor: 'rgba(188, 44, 44, 0.4)',
  },
  segmentText: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 11,
    color: '#7D6A68',
  },
  segmentTextActive: {
    fontFamily: Fonts.jakartaBold,
    color: '#DFB059',
  },
  segmentTextActiveShubh: {
    fontFamily: Fonts.jakartaBold,
    color: '#237B4B',
  },
  segmentTextActiveKaal: {
    fontFamily: Fonts.jakartaBold,
    color: '#BC2C2C',
  },

  // Timing Cards
  cardsList: {
    gap: 12,
  },
  timingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: 'rgba(234, 219, 206, 0.7)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  timingCardShubh: {
    borderLeftWidth: 4,
    borderLeftColor: '#237B4B',
  },
  timingCardKaal: {
    borderLeftWidth: 4,
    borderLeftColor: '#BC2C2C',
  },
  timingCardLiveShubh: {
    borderColor: '#237B4B',
    backgroundColor: '#FAFCFA',
  },
  timingCardLiveKaal: {
    borderColor: '#BC2C2C',
    backgroundColor: '#FFFBFB',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardTitleCol: {
    flex: 1,
    paddingRight: 8,
  },
  timingCardTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 17,
    color: '#2B0E14',
  },
  timingDurationText: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 10,
    color: '#8A7571',
    marginTop: 2,
  },

  // Badges
  badgeLiveShubh: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9F5EE',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(35, 123, 75, 0.3)',
  },
  badgeLiveKaal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF0F0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(188, 44, 44, 0.3)',
  },
  badgeLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeLiveTextShubh: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#237B4B',
  },
  badgeLiveTextKaal: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#BC2C2C',
  },
  badgePassed: {
    backgroundColor: 'rgba(125, 106, 104, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgePassedText: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 9,
    color: '#7D6A68',
  },
  badgeUpcoming: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeUpcomingText: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 9,
    color: '#92400E',
  },

  // Timing Range
  timingRangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  timingRangeText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
  },
  timingRangeShubh: {
    color: '#237B4B',
  },
  timingRangeKaal: {
    color: '#BC2C2C',
  },
  tapDetailsHint: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 10,
    color: '#8A7571',
  },

  // Progression Line
  cardProgressTrack: {
    height: 3.5,
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  cardProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  cardDescText: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11,
    color: '#5C4745',
    lineHeight: 15,
  },

  // Choghadiya Collapsible
  choghadiyaContainer: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(234, 219, 206, 0.8)',
    overflow: 'hidden',
  },
  choghadiyaToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  choghadiyaToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  choghadiyaToggleIcon: {
    fontSize: 20,
  },
  choghadiyaToggleTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 16,
    color: '#2B0E14',
  },
  choghadiyaToggleSub: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 10,
    color: '#7D6A68',
    marginTop: 1,
  },
  choghadiyaArrow: {
    fontSize: 12,
    color: '#DFB059',
    marginLeft: 8,
  },
  choghadiyaTable: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(234, 219, 206, 0.6)',
  },
  choghadiyaSectionTitle: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11,
    color: '#2B0E14',
    marginTop: 10,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  choghadiyaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choghadiyaItem: {
    width: (Dimensions.get('window').width - 76) / 2,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  choghadiyaItemShubh: {
    backgroundColor: '#F3FAF6',
    borderColor: 'rgba(35, 123, 75, 0.25)',
  },
  choghadiyaItemAshubh: {
    backgroundColor: '#FFF5F5',
    borderColor: 'rgba(188, 44, 44, 0.25)',
  },
  choghadiyaItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  choghadiyaName: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 12,
    color: '#2B0E14',
  },
  choghadiyaTag: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
  },
  tagShubhText: {
    color: '#237B4B',
  },
  tagAshubhText: {
    color: '#BC2C2C',
  },
  choghadiyaTime: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 10,
    color: '#7D6A68',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFDF9',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#DFB059',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 20,
    color: '#2B0E14',
  },
  modalSubtitle: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 12,
    color: '#DFB059',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalCloseText: {
    fontSize: 18,
    color: '#7D6A68',
    fontFamily: Fonts.jakartaBold,
  },
  modalTimingBox: {
    backgroundColor: '#F8F5EE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(234, 219, 206, 0.9)',
  },
  modalTimingLabel: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 10,
    color: '#7D6A68',
  },
  modalTimingValue: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 15,
    marginTop: 2,
  },
  modalBody: {
    marginBottom: 14,
  },
  modalSection: {
    marginBottom: 12,
  },
  modalSectionHeader: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 12,
    color: '#2B0E14',
    marginBottom: 6,
  },
  modalBullet: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11,
    color: '#5C4745',
    lineHeight: 18,
    marginLeft: 4,
  },
  modalTipBox: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  modalTipTitle: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 11,
    color: '#92400E',
    marginBottom: 3,
  },
  modalTipText: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 10,
    color: '#78350F',
    lineHeight: 15,
  },
  modalDoneBtn: {
    backgroundColor: '#2B0E14',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalDoneText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 13,
    color: '#DFB059',
  },
});
