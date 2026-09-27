import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { PanchangDayData, ChoghadiyaItem } from '../types/panchang';
import { RoyalHeritageTheme, CHOGHADIYA_META } from '../theme/royalHeritage';
import { useLanguage } from '../context/LanguageContext';

interface VedicDimensionsWidgetProps {
  panchang: PanchangDayData;
  onPressChoghadiya?: () => void;
  onPressPlanets?: () => void;
}

export const VedicDimensionsWidget: React.FC<VedicDimensionsWidgetProps> = ({
  panchang,
  onPressChoghadiya,
  onPressPlanets,
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Refresh live timer every 15 seconds for smooth countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const currentMin = currentTime.getHours() * 60 + currentTime.getMinutes();

  // Combine Day & Night Choghadiyas to accurately detect currently running slot
  const allChoghadiya: ChoghadiyaItem[] = [
    ...(panchang.dayChoghadiya || []),
    ...(panchang.nightChoghadiya || []),
  ];

  let activeItem: ChoghadiyaItem | null = null;
  let percentElapsed = 0;
  let remainingMinutes = 0;

  for (const item of allChoghadiya) {
    const startMin = parseTimeToMin(item.startTime);
    const endMin = parseTimeToMin(item.endTime);

    if (startMin <= endMin) {
      if (currentMin >= startMin && currentMin < endMin) {
        activeItem = item;
        const total = endMin - startMin;
        const elapsed = currentMin - startMin;
        percentElapsed = total > 0 ? Math.min(100, Math.max(0, Math.round((elapsed / total) * 100))) : 0;
        remainingMinutes = Math.max(0, endMin - currentMin);
        break;
      }
    } else {
      // Overnight rollover (e.g., 10:45 PM to 12:15 AM)
      if (currentMin >= startMin || currentMin < endMin) {
        activeItem = item;
        const total = (1440 - startMin) + endMin;
        const elapsed = currentMin >= startMin ? (currentMin - startMin) : ((1440 - startMin) + currentMin);
        percentElapsed = total > 0 ? Math.min(100, Math.max(0, Math.round((elapsed / total) * 100))) : 0;
        remainingMinutes = currentMin >= startMin ? ((1440 - currentMin) + endMin) : (endMin - currentMin);
        break;
      }
    }
  }

  // Fallback to first available choghadiya if none matched active slot
  if (!activeItem && allChoghadiya.length > 0) {
    activeItem = allChoghadiya[0];
    percentElapsed = 40;
    remainingMinutes = 45;
  }

  const formatRemainingTime = (mins: number) => {
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h}h ${m}m left`;
    }
    return `${mins}m left`;
  };

  const meta = activeItem ? CHOGHADIYA_META[activeItem.name] : null;
  const qualityDesc = meta
    ? (isHindi ? meta.descHi : meta.descEn)
    : (activeItem?.isAuspicious ? (isHindi ? 'शुभ मुहूर्त' : 'Auspicious') : (isHindi ? 'अशुभ मुहूर्त' : 'Inauspicious'));

  // SVG Radial Gauge Geometry
  const size = 96;
  const strokeWidth = 5.5;
  const center = size / 2;
  const radius = center - strokeWidth - 2; // ~38
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(1, Math.max(0, percentElapsed / 100)));

  // Sun and Moon / Jupiter signs
  const sunSign = panchang.sunMoon.sunSign || 'Kanya';
  const sunSignHindi = panchang.sunMoon.sunSignHindi || 'कन्या';
  const moonSign = panchang.sunMoon.moonSign || 'Meena';
  const moonSignHindi = panchang.sunMoon.moonSignHindi || 'मीन';

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.titleWithIcon}>
          <Text style={styles.sacredYantraIcon}>🌀</Text>
          <Text style={styles.sectionTitle}>
            {isHindi ? 'वैदिक आयाम' : 'Vedic Dimensions'}
          </Text>
        </View>
        <Text style={styles.sectionSub}>
          {isHindi ? 'सटीक समय गणना' : 'Real-Time Precision'}
        </Text>
      </View>

      {/* Dual Real-Time Cards */}
      <View style={styles.cardsRow}>
        {/* Card 1: Live Running Choghadiya */}
        <TouchableOpacity
          style={styles.dimensionCard}
          onPress={onPressChoghadiya}
          activeOpacity={0.82}
        >
          {/* Card Top Label & Live Beacon */}
          <View style={styles.cardTopRow}>
            <Text style={styles.cardCategoryLabel}>
              {isHindi ? 'चौघड़िया' : 'CHOGHADIYA'}
            </Text>
            <View style={styles.liveBeaconWrapper}>
              <View style={styles.livePulseDot} />
            </View>
          </View>

          {/* Circular Countdown Gauge */}
          <View style={styles.gaugeContainer}>
            <Svg width={size} height={size}>
              {/* Background Track */}
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="rgba(255, 215, 0, 0.12)"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Progress Arc */}
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={activeItem?.isAuspicious ? RoyalHeritageTheme.accent.primaryGold : RoyalHeritageTheme.accent.inauspiciousRuby}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                rotation="-90"
                origin={`${center}, ${center}`}
              />
            </Svg>

            {/* Inner Center Text */}
            <View style={styles.gaugeCenterText}>
              <Text style={styles.gaugeName} numberOfLines={1} adjustsFontSizeToFit>
                {isHindi ? (activeItem?.hindiName || activeItem?.name) : activeItem?.name}
              </Text>
              <Text style={styles.gaugeTimeLeft} numberOfLines={1}>
                {formatRemainingTime(remainingMinutes)}
              </Text>
            </View>
          </View>

          {/* Nature Description & Time Range */}
          <View style={styles.choghadiyaFooter}>
            <Text style={styles.natureDescText} numberOfLines={1} adjustsFontSizeToFit>
              {qualityDesc}
            </Text>
            <Text style={styles.timeRangeText} numberOfLines={1}>
              {activeItem ? `${activeItem.startTime} – ${activeItem.endTime}` : '06:00 AM – 07:30 AM'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Card 2: Graha Sthiti (Planetary Alignments) */}
        <TouchableOpacity
          style={styles.dimensionCard}
          onPress={onPressPlanets}
          activeOpacity={0.82}
        >
          {/* Card Top Label & Planet Emblem */}
          <View style={styles.cardTopRow}>
            <Text style={styles.cardCategoryLabel}>
              {isHindi ? 'ग्रह स्थिति' : 'GRAHA STHITI'}
            </Text>
            <Text style={styles.planetEmblem}>☸️</Text>
          </View>

          {/* Key Graha Placements */}
          <View style={styles.grahaList}>
            {/* Surya Placement */}
            <View style={styles.grahaPill}>
              <View style={styles.grahaLeft}>
                <Text style={styles.grahaName}>{isHindi ? 'सूर्य' : 'Surya'}</Text>
                <Text style={styles.grahaSymbol}>☉</Text>
              </View>
              <Text style={styles.rashiText} numberOfLines={1} adjustsFontSizeToFit>
                {isHindi ? sunSignHindi : sunSign}
              </Text>
            </View>

            {/* Chandra / Guru Placement */}
            <View style={styles.grahaPill}>
              <View style={styles.grahaLeft}>
                <Text style={styles.grahaName}>{isHindi ? 'चंद्र' : 'Chandra'}</Text>
                <Text style={styles.grahaSymbol}>☽</Text>
              </View>
              <Text style={styles.rashiText} numberOfLines={1} adjustsFontSizeToFit>
                {isHindi ? moonSignHindi : moonSign}
              </Text>
            </View>
          </View>

          {/* Alignment Footer CTA */}
          <View style={styles.grahaFooterRow}>
            <Text style={styles.allPlanetsText}>
              {isHindi ? '९ ग्रह संरेखण' : '9 Planets Aligned'}
            </Text>
            <Text style={styles.grahaArrow}>➔</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function parseTimeToMin(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(' ');
  const [hStr, mStr] = parts[0].split(':');
  let h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  if (parts[1] === 'PM' && h < 12) h += 12;
  if (parts[1] === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 2,
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sacredYantraIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: RoyalHeritageTheme.typography.title,
    letterSpacing: 0.3,
  },
  sectionSub: {
    fontSize: 11,
    color: RoyalHeritageTheme.accent.secondaryGold,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dimensionCard: {
    flex: 1,
    backgroundColor: RoyalHeritageTheme.surface.card,
    borderRadius: RoyalHeritageTheme.shapes.cardRadius,
    borderWidth: 1,
    borderColor: RoyalHeritageTheme.surface.borderRim,
    padding: 14,
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: RoyalHeritageTheme.surface.shadowGlow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardCategoryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: RoyalHeritageTheme.accent.secondaryGold,
    letterSpacing: 1.2,
  },
  liveBeaconWrapper: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 215, 0, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: RoyalHeritageTheme.accent.primaryGold,
  },
  planetEmblem: {
    fontSize: 12,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    position: 'relative',
  },
  gaugeCenterText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
  },
  gaugeName: {
    fontSize: 14,
    fontWeight: '800',
    color: RoyalHeritageTheme.typography.title,
    textAlign: 'center',
  },
  gaugeTimeLeft: {
    fontSize: 10,
    fontWeight: '600',
    color: RoyalHeritageTheme.accent.secondaryGold,
    marginTop: 2,
    textAlign: 'center',
  },
  choghadiyaFooter: {
    marginTop: 8,
    alignItems: 'center',
  },
  natureDescText: {
    fontSize: 10,
    fontWeight: '600',
    color: RoyalHeritageTheme.typography.body,
    textAlign: 'center',
  },
  timeRangeText: {
    fontSize: 9,
    color: RoyalHeritageTheme.typography.caption,
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
  grahaList: {
    marginVertical: 6,
    gap: 8,
  },
  grahaPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(230, 194, 128, 0.15)',
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grahaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  grahaName: {
    fontSize: 11,
    fontWeight: '700',
    color: RoyalHeritageTheme.typography.title,
  },
  grahaSymbol: {
    fontSize: 11,
    color: RoyalHeritageTheme.accent.secondaryGold,
  },
  rashiText: {
    fontSize: 11,
    color: RoyalHeritageTheme.typography.body,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  grahaFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.1)',
  },
  allPlanetsText: {
    fontSize: 10,
    fontWeight: '700',
    color: RoyalHeritageTheme.typography.title,
    letterSpacing: 0.3,
  },
  grahaArrow: {
    fontSize: 10,
    color: RoyalHeritageTheme.accent.primaryGold,
    fontWeight: 'bold',
  },
});
