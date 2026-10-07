import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Fonts } from '../constants/typography';
import { CityLocation, ChoghadiyaItem } from '../types/panchang';
import { calculateChoghadiya } from '../engine/muhuratCalculator';

interface DayNightChoghadiyaModalProps {
  visible: boolean;
  onClose: () => void;
  dateIso: string;
  selectedCity: CityLocation;
  sunriseStr: string;
  sunsetStr: string;
  dayChoghadiya?: ChoghadiyaItem[];
  nightChoghadiya?: ChoghadiyaItem[];
}

const getChoghadiyaDetails = (type: string) => {
  const t = type.toUpperCase();
  switch (t) {
    case 'AMRIT':
      return {
        quality: 'HIGHLY_AUSPICIOUS',
        qualityLabel: 'Highly Auspicious ⭐',
        accentColor: '#10B981',
        guidance: 'Moon influence • Sacred nectar period. Supreme window for all pujas, rituals, oath ceremonies & prosperous deeds.',
      };
    case 'SHUBH':
      return {
        quality: 'AUSPICIOUS',
        qualityLabel: 'Auspicious',
        accentColor: '#10B981',
        guidance: 'Jupiter influence • Divine favor. Ideal for religious ceremonies, prayer rituals, agreements & sacred beginnings.',
      };
    case 'LABH':
      return {
        quality: 'AUSPICIOUS',
        qualityLabel: 'Auspicious',
        accentColor: '#10B981',
        guidance: 'Mercury influence • Fruitful gains. Highly recommended for commercial business, investments, study & trade expansion.',
      };
    case 'CHAR':
      return {
        quality: 'NEUTRAL',
        qualityLabel: 'Neutral',
        accentColor: '#F59E0B',
        guidance: 'Venus influence • Dynamic & movable period. Favorable for journeys, travel, vehicle purchases & communication.',
      };
    case 'ROG':
      return {
        quality: 'INAUSPICIOUS',
        qualityLabel: 'Inauspicious',
        accentColor: '#EF4444',
        guidance: 'Mars influence • Friction & discord. Refrain from starting new ventures, medical treatments, or financial dealings.',
      };
    case 'KAAL':
      return {
        quality: 'INAUSPICIOUS',
        qualityLabel: 'Inauspicious',
        accentColor: '#EF4444',
        guidance: 'Saturn influence • Governed by delay and loss. Refrain from initiating vital endeavors or important journeys.',
      };
    case 'UDVEG':
      return {
        quality: 'INAUSPICIOUS',
        qualityLabel: 'Inauspicious',
        accentColor: '#EF4444',
        guidance: 'Sun influence • Agitation & anxiety. Unfavorable for peace treaties, government negotiations, or high-stakes matters.',
      };
    default:
      return {
        quality: 'NEUTRAL',
        qualityLabel: 'Neutral',
        accentColor: '#8B5CF6',
        guidance: 'Vedic planetary transition interval.',
      };
  }
};

const parseTimeToMinutes = (t: string): number => {
  try {
    const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 0;
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const isPM = match[3].toUpperCase() === 'PM';
    if (isPM && h !== 12) h += 12;
    if (!isPM && h === 12) h = 0;
    return h * 60 + m;
  } catch (e) {
    return 0;
  }
};

const isChogSlotActiveNow = (startTime: string, endTime: string, isToday: boolean): boolean => {
  if (!isToday) return false;
  try {
    const now = new Date();
    const curMin = now.getHours() * 60 + now.getMinutes();
    const sMin = parseTimeToMinutes(startTime);
    let eMin = parseTimeToMinutes(endTime);
    if (eMin < sMin) eMin += 1440;
    let testMin = curMin;
    if (eMin > 1440 && curMin < sMin) testMin += 1440;
    return testMin >= sMin && testMin < eMin;
  } catch (e) {
    return false;
  }
};

const getSlotRemainingMinutes = (endTime: string): number => {
  try {
    const now = new Date();
    const curMin = now.getHours() * 60 + now.getMinutes();
    let eMin = parseTimeToMinutes(endTime);
    if (eMin < curMin && eMin < 360) eMin += 1440;
    return Math.max(1, eMin - curMin);
  } catch (e) {
    return 30;
  }
};

export const DayNightChoghadiyaModal: React.FC<DayNightChoghadiyaModalProps> = ({
  visible,
  onClose,
  dateIso,
  selectedCity,
  sunriseStr,
  sunsetStr,
  dayChoghadiya,
  nightChoghadiya,
}) => {
  const [activeTab, setActiveTab] = useState<'DAY' | 'NIGHT'>('DAY');

  const isToday = useMemo(() => {
    const now = new Date();
    const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return dateIso === todayIso;
  }, [dateIso]);

  // Compute 8 Day & 8 Night slots
  const chogData = useMemo(() => {
    if (dayChoghadiya && dayChoghadiya.length === 8 && nightChoghadiya && nightChoghadiya.length === 8) {
      return { dayChoghadiya, nightChoghadiya };
    }
    try {
      const parts = dateIso.split('-');
      const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
      return calculateChoghadiya(dateObj, sunriseStr, sunsetStr);
    } catch (e) {
      return { dayChoghadiya: [], nightChoghadiya: [] };
    }
  }, [dateIso, sunriseStr, sunsetStr, dayChoghadiya, nightChoghadiya]);

  // Auto-switch to current tab on initial open if today
  useEffect(() => {
    if (visible && isToday && chogData) {
      const isNightRunning = chogData.nightChoghadiya.some(s => isChogSlotActiveNow(s.startTime, s.endTime, true));
      setActiveTab(isNightRunning ? 'NIGHT' : 'DAY');
    }
  }, [visible, isToday, chogData]);

  // Formatted date string (e.g., Sun, Oct 4, 2026)
  const formattedDate = useMemo(() => {
    try {
      const parts = dateIso.split('-');
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateIso;
    }
  }, [dateIso]);

  // Find currently active slot
  const currentRunningSlot = useMemo(() => {
    const allSlots = [...chogData.dayChoghadiya, ...chogData.nightChoghadiya];
    if (isToday) {
      const active = allSlots.find(s => isChogSlotActiveNow(s.startTime, s.endTime, true));
      if (active) return active;
    }
    return chogData.dayChoghadiya[0] || null;
  }, [chogData, isToday]);

  const activeSlots = activeTab === 'DAY' ? chogData.dayChoghadiya : chogData.nightChoghadiya;

  // Breakdown summary metrics
  const summaryCounts = useMemo(() => {
    const ausp = activeSlots.filter(s => {
      const d = getChoghadiyaDetails(s.type);
      return d.quality === 'AUSPICIOUS' || d.quality === 'HIGHLY_AUSPICIOUS';
    }).length;
    const neut = activeSlots.filter(s => getChoghadiyaDetails(s.type).quality === 'NEUTRAL').length;
    const avoid = activeSlots.filter(s => getChoghadiyaDetails(s.type).quality === 'INAUSPICIOUS').length;
    return { ausp, neut, avoid };
  }, [activeSlots]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.backdropPressable} activeOpacity={1} onPress={onClose} />
        <View style={styles.modalSheet}>
          {/* Drag Handle Pill */}
          <View style={styles.dragHandle} />

          {/* Modal Header */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.subHeaderCaps}>SACRED CHOGHADIYA ALMANAC</Text>
              <View style={styles.titleLocationRow}>
                <Text style={styles.dateTitleText}>{formattedDate}</Text>
                <View style={styles.cityBadge}>
                  <Text style={styles.cityBadgeText}>📍 {selectedCity.name}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Solar Cycle Strip */}
          <View style={styles.solarCycleBanner}>
            <Text style={styles.solarCycleText}>
              🌅 Sunrise: <Text style={styles.solarBold}>{sunriseStr.replace(/\s*IST/i, '')}</Text>  •  🌇 Sunset: <Text style={styles.solarBold}>{sunsetStr.replace(/\s*IST/i, '')}</Text>
            </Text>
          </View>

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* HERO CARD: LIVE ACTIVE RUNNING CHOGHADIYA */}
            {currentRunningSlot && (
              <View style={styles.heroCard}>
                <View style={styles.heroTopRow}>
                  <View style={styles.liveTagRow}>
                    <View style={styles.livePulseDot} />
                    <Text style={styles.liveTagText}>
                      {isToday ? '● LIVE NOW • RUNNING CHOGHADIYA' : '● PRADHAN CHOGHADIYA'}
                    </Text>
                  </View>
                  {isToday && (
                    <View style={styles.countdownBadge}>
                      <Text style={styles.countdownText}>
                        Ends in {getSlotRemainingMinutes(currentRunningSlot.endTime)}m
                      </Text>
                    </View>
                  )}
                </View>

                {(() => {
                  const details = getChoghadiyaDetails(currentRunningSlot.type);
                  return (
                    <View style={{ marginTop: 6 }}>
                      <View style={styles.heroNameRow}>
                        <Text style={styles.heroSlotName}>{currentRunningSlot.name}</Text>
                        <View
                          style={[
                            styles.heroQualityBadge,
                            details.quality === 'HIGHLY_AUSPICIOUS' && styles.heroQualityHigh,
                            details.quality === 'AUSPICIOUS' && styles.heroQualityAusp,
                            details.quality === 'NEUTRAL' && styles.heroQualityNeut,
                            details.quality === 'INAUSPICIOUS' && styles.heroQualityInausp,
                          ]}
                        >
                          <Text
                            style={[
                              styles.heroQualityText,
                              details.quality === 'HIGHLY_AUSPICIOUS' && { color: '#065F46' },
                              details.quality === 'AUSPICIOUS' && { color: '#166534' },
                              details.quality === 'NEUTRAL' && { color: '#92400E' },
                              details.quality === 'INAUSPICIOUS' && { color: '#991B1B' },
                            ]}
                          >
                            {details.qualityLabel}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.heroTimeWindow}>
                        ⏱️ {currentRunningSlot.startTime} – {currentRunningSlot.endTime}
                      </Text>

                      <Text style={styles.heroGuidanceText}>{details.guidance}</Text>
                    </View>
                  );
                })()}
              </View>
            )}

            {/* DAY & NIGHT SEGMENTED SWITCHER TABS */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'DAY' && styles.tabButtonActive]}
                onPress={() => setActiveTab('DAY')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabButtonText, activeTab === 'DAY' && styles.tabButtonTextActive]}>
                  ☀️ Day (8 Muhurats)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'NIGHT' && styles.tabButtonActive]}
                onPress={() => setActiveTab('NIGHT')}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabButtonText, activeTab === 'NIGHT' && styles.tabButtonTextActive]}>
                  🌙 Night (8 Muhurats)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Summary Metrics Row */}
            <View style={styles.summaryMetricsRow}>
              <Text style={styles.summaryMetricsText}>
                🟢 {summaryCounts.ausp} Auspicious  •  🟡 {summaryCounts.neut} Neutral  •  🔴 {summaryCounts.avoid} Avoid
              </Text>
            </View>

            {/* 8 CHOGHADIYA SLOTS */}
            {activeSlots.map((slot, index) => {
              const details = getChoghadiyaDetails(slot.type);
              const isLive = isChogSlotActiveNow(slot.startTime, slot.endTime, isToday);
              const isHigh = details.quality === 'HIGHLY_AUSPICIOUS';
              const isAusp = details.quality === 'AUSPICIOUS';
              const isNeut = details.quality === 'NEUTRAL';

              return (
                <View
                  key={`slot-${activeTab}-${index}`}
                  style={[
                    styles.slotCard,
                    isLive && styles.slotCardLive,
                    isHigh && { borderColor: '#DFB059' },
                  ]}
                >
                  <View style={[styles.slotAccentBar, { backgroundColor: details.accentColor }]} />
                  <View style={styles.slotContent}>
                    <View style={styles.slotTopRow}>
                      <View style={styles.slotNameRow}>
                        <Text style={styles.slotName}>{slot.name}</Text>
                        {isLive && (
                          <View style={styles.liveTagBadge}>
                            <Text style={styles.liveTagBadgeText}>● LIVE NOW</Text>
                          </View>
                        )}
                      </View>
                      <View
                        style={[
                          styles.qualityBadge,
                          isHigh && styles.qualityBadgeHigh,
                          isAusp && styles.qualityBadgeAusp,
                          isNeut && styles.qualityBadgeNeut,
                          !isHigh && !isAusp && !isNeut && styles.qualityBadgeInausp,
                        ]}
                      >
                        <Text
                          style={[
                            isHigh && styles.qualityTextHigh,
                            isAusp && styles.qualityTextAusp,
                            isNeut && styles.qualityTextNeut,
                            !isHigh && !isAusp && !isNeut && styles.qualityTextInausp,
                          ]}
                        >
                          {details.qualityLabel}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.slotTimeText}>
                      ⏱️ {slot.startTime} – {slot.endTime}
                    </Text>

                    <Text style={styles.slotGuidanceText}>{details.guidance}</Text>
                  </View>
                </View>
              );
            })}

            {/* Astronomical Ephemeris Footnote */}
            <View style={styles.ephemerisFootnote}>
              <Text style={styles.ephemerisFootnoteText}>
                📍 Calculated for {selectedCity.name} using exact local Sunrise ({sunriseStr.replace(/\s*IST/i, '')}) and Sunset ({sunsetStr.replace(/\s*IST/i, '')}).
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27, 8, 12, 0.65)',
    justifyContent: 'flex-end',
  },
  backdropPressable: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: '#FFFDF9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#EADBCE',
    maxHeight: '88%',
    paddingBottom: 24,
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D4C5B9',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
  subHeaderCaps: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    color: '#DFB059',
    letterSpacing: 1.2,
  },
  titleLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    flexWrap: 'wrap',
    gap: 8,
  },
  dateTitleText: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 22,
    color: '#2B0E14',
  },
  cityBadge: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#EADBCE',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  cityBadgeText: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 11,
    color: '#7D6A68',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#EADBCE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  closeBtnText: {
    fontSize: 15,
    color: '#2B0E14',
  },
  solarCycleBanner: {
    backgroundColor: '#FAF5EE',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EADBCE',
    paddingVertical: 6,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  solarCycleText: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11.5,
    color: '#6B5238',
  },
  solarBold: {
    fontFamily: Fonts.jakartaBold,
    color: '#2B0E14',
  },
  scrollArea: {
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 14,
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: '#2B0E14',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#DFB059',
    padding: 14,
    marginBottom: 14,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(223, 176, 89, 0.3)',
    paddingBottom: 8,
  },
  liveTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  liveTagText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9.5,
    color: '#DFB059',
    letterSpacing: 0.8,
  },
  countdownBadge: {
    backgroundColor: 'rgba(223, 176, 89, 0.15)',
    borderWidth: 0.5,
    borderColor: '#DFB059',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  countdownText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    color: '#F5DE9C',
  },
  heroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  heroSlotName: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 22,
    color: '#FFFDF9',
  },
  heroQualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 10,
  },
  heroQualityHigh: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#DFB059',
  },
  heroQualityAusp: {
    backgroundColor: '#E9F5EE',
  },
  heroQualityNeut: {
    backgroundColor: '#FEF3C7',
  },
  heroQualityInausp: {
    backgroundColor: '#FEF2F2',
  },
  heroQualityText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10.5,
  },
  heroTimeWindow: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 12.5,
    color: '#DFB059',
    marginTop: 3,
  },
  heroGuidanceText: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11.5,
    color: '#F0E6D8',
    marginTop: 4,
    lineHeight: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FAF5EE',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EADBCE',
    padding: 3,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  tabButtonActive: {
    backgroundColor: '#2B0E14',
  },
  tabButtonText: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 11,
    color: '#6B5238',
  },
  tabButtonTextActive: {
    fontFamily: Fonts.jakartaBold,
    color: '#DFB059',
  },
  summaryMetricsRow: {
    backgroundColor: '#FAF5EE',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryMetricsText: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 11,
    color: '#4A3B32',
  },
  slotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EADBCE',
    marginBottom: 8,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  slotCardLive: {
    borderColor: '#DFB059',
    borderWidth: 1.5,
    backgroundColor: '#FFFDF5',
  },
  slotAccentBar: {
    width: 4,
  },
  slotContent: {
    flex: 1,
    padding: 10,
  },
  slotTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  slotNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  slotName: {
    fontFamily: Fonts.cormorantBold,
    fontSize: 16,
    color: '#2B0E14',
  },
  liveTagBadge: {
    backgroundColor: '#2B0E14',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 0.5,
    borderColor: '#DFB059',
  },
  liveTagBadgeText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 9,
    color: '#DFB059',
    letterSpacing: 0.5,
  },
  qualityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  qualityBadgeHigh: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#DFB059',
  },
  qualityBadgeAusp: {
    backgroundColor: '#E9F5EE',
    borderWidth: 0.5,
    borderColor: '#A7F3D0',
  },
  qualityBadgeNeut: {
    backgroundColor: '#FEF3C7',
    borderWidth: 0.5,
    borderColor: '#FDE68A',
  },
  qualityBadgeInausp: {
    backgroundColor: '#FEF2F2',
    borderWidth: 0.5,
    borderColor: '#FECACA',
  },
  qualityTextHigh: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    color: '#065F46',
  },
  qualityTextAusp: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    color: '#166534',
  },
  qualityTextNeut: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    color: '#92400E',
  },
  qualityTextInausp: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 10,
    color: '#991B1B',
  },
  slotTimeText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 12,
    color: '#7D6A68',
    marginBottom: 4,
  },
  slotGuidanceText: {
    fontFamily: Fonts.jakartaRegular,
    fontSize: 11,
    color: '#5A4A42',
    lineHeight: 15,
  },
  ephemerisFootnote: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FAF5EE',
    borderRadius: 8,
    alignItems: 'center',
  },
  ephemerisFootnoteText: {
    fontFamily: Fonts.jakartaMedium,
    fontSize: 10,
    color: '#7D6A68',
    textAlign: 'center',
  },
});
