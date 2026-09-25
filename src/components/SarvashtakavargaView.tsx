import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { KundaliResult } from '../engine/kundaliEngine';
import {
  calculateSarvashtakavarga,
  SarvashtakavargaResult,
  SAV_BANDS
} from '../engine/sarvashtakavargaEngine';
import { SarvashtakavargaNorthChartSVG } from './SarvashtakavargaNorthChartSVG';
import { Colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

interface SarvashtakavargaViewProps {
  kundali: KundaliResult;
}

export const SarvashtakavargaView: React.FC<SarvashtakavargaViewProps> = ({ kundali }) => {
  const { language } = useLanguage();
  const isHi = language === 'hi' || language === 'hinglish';
  const isGu = language === 'gu';

  const [isGuideExpanded, setIsGuideExpanded] = useState(false);
  const [selectedHouseFilter, setSelectedHouseFilter] = useState<'ALL' | 'PROSPEROUS' | 'EFFORT'>('ALL');

  const savResult: SarvashtakavargaResult = calculateSarvashtakavarga(kundali);
  const { houses, executiveSummary } = savResult;

  const filteredHouses = houses.filter(h => {
    if (selectedHouseFilter === 'PROSPEROUS') return h.isProsperous;
    if (selectedHouseFilter === 'EFFORT') return h.isEffortHeavy;
    return true;
  });

  return (
    <View style={styles.container}>
      {/* 1. Header Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.headerRow}>
          <Text style={styles.headerEmoji}>📊</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>
              {isHi ? 'सर्वाष्टकवर्ग विश्लेषण (Sarvashtakavarga)' : 'Sarvashtakavarga Analysis'}
            </Text>
            <Text style={styles.headerSub}>
              {isHi
                ? 'कुल 337 बिंदु (अपरिवर्तनीय शास्त्रीय गणित) • औसत: 28.08 बिंदु/भाव'
                : '337 Classical Invariant Bindus • Mean Average: 28.08 pts/house'}
            </Text>
          </View>
        </View>
      </View>

      {/* 2. Visual North Indian Kundli Chart with Color-Coded House Points */}
      <View style={styles.chartCard}>
        <Text style={styles.cardSectionTitle}>
          {isHi ? '🏛️ लग्न सर्वाष्टकवर्ग चक्र (North Indian Chart)' : '🏛️ Lagna Sarvashtakavarga Chart'}
        </Text>
        <Text style={styles.cardSectionSub}>
          {isHi
            ? 'प्रत्येक भाव में अंकित संख्या सर्वाष्टकवर्ग के शुभ बिंदुओं को दर्शाती है:'
            : 'Numbers inside each house represent the composite Sarvashtakavarga benefic bindus:'}
        </Text>

        <SarvashtakavargaNorthChartSVG houses={houses} isHindi={isHi} />
      </View>

      {/* 3. Executive Summary: Prosperous vs. Hard Labor Areas */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>
          {isHi ? '⚖️ सामर्थ्य एवं पुरुषार्थ क्षेत्र (Prosperous vs Heavy Effort)' : '⚖️ Life Domains: Prosperous vs Heavy Effort'}
        </Text>
        <Text style={styles.cardSectionSub}>
          {isHi
            ? 'आपके जन्म चक्र में किन क्षेत्रों में स्वाभाविक सुगमता है और कहाँ विशेष ध्यान व श्रम आवश्यक है:'
            : 'Areas of fortified grace versus domains requiring conscious discipline and effort:'}
        </Text>

        {/* 🌟 Fortified / Prosperous Houses (≥30 Bindus) */}
        <View style={[styles.summaryBox, { backgroundColor: '#E8F5E9', borderColor: '#81C784' }]}>
          <View style={styles.summaryTitleRow}>
            <Text style={styles.summaryEmoji}>🌟</Text>
            <Text style={[styles.summaryTitle, { color: '#1B5E20' }]}>
              {isHi ? 'श्रेष्ठ एवं प्रबल क्षेत्र (≥30 अंक)' : 'Fortified & Prosperous Areas (≥30 pts)'}
            </Text>
          </View>
          <Text style={[styles.summaryDesc, { color: '#2E7D32' }]}>
            {isHi
              ? 'इन भावों में पूर्व-पुण्य और संरचनात्मक सहयोग अधिक है। यहाँ आपके प्रयासों का शीघ्र व उत्तम फल मिलता है:'
              : 'Robust structural foundation; natural fruition of efforts with strong past-life merit (Purva Punya) backing:'}
          </Text>
          <View style={styles.chipsRow}>
            {executiveSummary.prosperousHouses.length > 0 ? (
              executiveSummary.prosperousHouses.map(hNum => {
                const h = houses[hNum - 1];
                return (
                  <View key={hNum} style={[styles.chipPill, { backgroundColor: '#2E7D32' }]}>
                    <Text style={styles.chipPillText}>
                      H{hNum} {isHi ? h.hindiName.split(' ')[0] : h.sanskritName.split(' ')[0]} ({h.points} pts)
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.noneText}>
                {isHi ? 'कोई भाव ≥30 नहीं है (सभी भाव संतुलित हैं)' : 'No houses ≥30 points (all balanced)'}
              </Text>
            )}
          </View>
        </View>

        {/* ⚡ High Effort / Deficit Houses (<25 Bindus) */}
        <View style={[styles.summaryBox, { backgroundColor: '#FBE9E7', borderColor: '#FFAB91', marginTop: 10 }]}>
          <View style={styles.summaryTitleRow}>
            <Text style={styles.summaryEmoji}>⚡</Text>
            <Text style={[styles.summaryTitle, { color: '#BF360C' }]}>
              {isHi ? 'विशेष श्रम एवं सतर्कता क्षेत्र (<25 अंक)' : 'High Effort & Vigilance Areas (<25 pts)'}
            </Text>
          </View>
          <Text style={[styles.summaryDesc, { color: '#D84315' }]}>
            {isHi
              ? 'यहाँ प्राकृतिक संरचनात्मक कमी (Sub-25 Deficit) है। इन भावों के विषयों में रक्षात्मक नीति और निरंतर धैर्य से काम लें:'
              : 'Structural deficit zone. Requires conscious discipline, defensive positioning, and structured patience:'}
          </Text>
          <View style={styles.chipsRow}>
            {executiveSummary.effortHeavyHouses.length > 0 ? (
              executiveSummary.effortHeavyHouses.map(hNum => {
                const h = houses[hNum - 1];
                return (
                  <View key={hNum} style={[styles.chipPill, { backgroundColor: '#D84315' }]}>
                    <Text style={styles.chipPillText}>
                      H{hNum} {isHi ? h.hindiName.split(' ')[0] : h.sanskritName.split(' ')[0]} ({h.points} pts)
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.noneText}>
                {isHi ? 'शानदार! कोई भी भाव 25 अंक से नीचे नहीं है।' : 'Excellent! No houses below 25 points.'}
              </Text>
            )}
          </View>
        </View>

        {/* 💰 Financial Triad Diagnostics (10th vs 11th vs 12th vs 2nd) */}
        <View style={[styles.summaryBox, { backgroundColor: '#FFF8E1', borderColor: '#FFE082', marginTop: 10 }]}>
          <View style={styles.summaryTitleRow}>
            <Text style={styles.summaryEmoji}>💰</Text>
            <Text style={[styles.summaryTitle, { color: '#F57F17' }]}>
              {isHi ? executiveSummary.financialTriad.titleHi : executiveSummary.financialTriad.titleEn}
            </Text>
          </View>

          {/* Triad Score Comparison Bar */}
          <View style={styles.triadScoreRow}>
            <View style={styles.triadScoreItem}>
              <Text style={styles.triadScoreLabel}>{isHi ? '10वां (कर्म)' : '10th (Karma)'}</Text>
              <Text style={[styles.triadScoreVal, { color: '#E65100' }]}>{executiveSummary.financialTriad.karmaHouse10Points} pts</Text>
            </View>
            <Text style={styles.triadCompareSymbol}>➔</Text>
            <View style={styles.triadScoreItem}>
              <Text style={styles.triadScoreLabel}>{isHi ? '11वां (लाभ)' : '11th (Labha)'}</Text>
              <Text style={[styles.triadScoreVal, { color: '#2E7D32' }]}>{executiveSummary.financialTriad.labhaHouse11Points} pts</Text>
            </View>
            <Text style={styles.triadCompareSymbol}>➔</Text>
            <View style={styles.triadScoreItem}>
              <Text style={styles.triadScoreLabel}>{isHi ? '12वां (व्यय)' : '12th (Vyaya)'}</Text>
              <Text style={[styles.triadScoreVal, { color: '#C62828' }]}>{executiveSummary.financialTriad.vyayaHouse12Points} pts</Text>
            </View>
          </View>

          <Text style={[styles.summaryDesc, { color: '#5D4037', marginTop: 6 }]}>
            {isHi ? executiveSummary.financialTriad.explanationHi : executiveSummary.financialTriad.explanationEn}
          </Text>
        </View>

        {/* 🛡️ Dusthana Triad (6th + 8th + 12th vs 76 points - Teertha Rule) */}
        <View style={[styles.summaryBox, { backgroundColor: '#EDE7F6', borderColor: '#D1C4E9', marginTop: 10 }]}>
          <View style={styles.summaryTitleRow}>
            <Text style={styles.summaryEmoji}>🛡️</Text>
            <Text style={[styles.summaryTitle, { color: '#4A148C' }]}>
              {isHi ? executiveSummary.dusthanaTriad.titleHi : executiveSummary.dusthanaTriad.titleEn}
            </Text>
          </View>

          <View style={styles.triadScoreRow}>
            <View style={styles.triadScoreItem}>
              <Text style={styles.triadScoreLabel}>{isHi ? '6ठा भाव' : '6th House'}</Text>
              <Text style={styles.triadScoreVal}>{executiveSummary.dusthanaTriad.house6Points} pts</Text>
            </View>
            <Text style={styles.triadCompareSymbol}>+</Text>
            <View style={styles.triadScoreItem}>
              <Text style={styles.triadScoreLabel}>{isHi ? '8वां भाव' : '8th House'}</Text>
              <Text style={styles.triadScoreVal}>{executiveSummary.dusthanaTriad.house8Points} pts</Text>
            </View>
            <Text style={styles.triadCompareSymbol}>+</Text>
            <View style={styles.triadScoreItem}>
              <Text style={styles.triadScoreLabel}>{isHi ? '12वां भाव' : '12th House'}</Text>
              <Text style={styles.triadScoreVal}>{executiveSummary.dusthanaTriad.house12Points} pts</Text>
            </View>
            <Text style={styles.triadCompareSymbol}>=</Text>
            <View style={styles.triadScoreItem}>
              <Text style={styles.triadScoreLabel}>{isHi ? 'त्रिक कुल योग' : 'Dusthana Sum'}</Text>
              <Text style={[styles.triadScoreVal, { color: '#4A148C', fontWeight: '800' }]}>
                {executiveSummary.dusthanaTriad.totalSum} pts
              </Text>
            </View>
          </View>

          <Text style={[styles.summaryDesc, { color: '#311B92', marginTop: 6 }]}>
            {isHi ? executiveSummary.dusthanaTriad.explanationHi : executiveSummary.dusthanaTriad.explanationEn}
          </Text>
        </View>
      </View>

      {/* 4. Educational Guide: How to see Sarvashtakavarga? */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.guideHeaderTouchable}
          onPress={() => setIsGuideExpanded(!isGuideExpanded)}
          activeOpacity={0.7}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.guideTitle}>
              {isHi ? '📖 सर्वाष्टकवर्ग क्या है और इसे कैसे देखें?' : '📖 How to Interpret Sarvashtakavarga?'}
            </Text>
            <Text style={styles.guideSub}>
              {isHi
                ? 'महर्षि पराशर के नियम एवं डॉ. बी.वी. रमन का ओवरराइड सिद्धांत'
                : 'Parashari Mathematical Principles & Dr. B.V. Raman Override Rule'}
            </Text>
          </View>
          <Text style={styles.expandChevron}>{isGuideExpanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {isGuideExpanded && (
          <View style={styles.guideContent}>
            {/* Principles */}
            <Text style={styles.guideHeading}>
              {isHi ? '1. सर्वाष्टकवर्ग की शास्त्रीय पृष्ठभूमि (Origins in BPHS):' : '1. Foundations in Brihat Parashara Hora Shastra:'}
            </Text>
            <Text style={styles.guideParagraph}>
              {isHi
                ? 'महर्षि पराशर ने वृहत्पाराशर होराशास्त्र (अध्याय 66-72) में अष्टकवर्ग प्रणाली का प्रतिपादन किया। यह 7 प्रत्यक्ष ग्रहों (सूर्य 48, चंद्र 49, मंगल 39, बुध 54, गुरु 56, शुक्र 52, शनि 39) और लग्न द्वारा प्रदत्त शुभ बिंदुओं का संकलन है। प्रत्येक शुद्ध जन्म कुंडली में सभी 12 भावों का कुल योग हमेशा 337 बिंदु (Universal Invariant) ही रहता है।'
                : 'Sage Parashara revealed the Ashtakavarga system in Brihat Parashara Hora Shastra (Chapters 66-72) to provide an objective, mathematical metric for planetary strength. It composites the benefic bindus contributed by the 7 classical planets and Lagna. Across all 12 signs, every correctly computed chart distributes an invariant total of exactly 337 Bindus.'}
            </Text>

            {/* Mean & Bands */}
            <Text style={styles.guideHeading}>
              {isHi ? '2. 28 बिंदु का औसत और 4 कार्य-श्रेणियां (The 4 Operational Bands):' : '2. 28-Point Mean & The 4 Operational Bands:'}
            </Text>
            <Text style={styles.guideParagraph}>
              {isHi
                ? 'कुल 337 बिंदुओं को 12 भावों में बांटने पर प्रति भाव औसत 28.08 बिंदु आता है:\n• ≥30 बिंदु (श्रेष्ठ): अत्यंत शुभ व मजबूत संरचना। प्रयासों का सहज व प्रचुर फल।\n• 25–29 बिंदु (मध्यम): संतुलित आधार। कर्म के सीधे अनुपात में फल।\n• 20–24 बिंदु (अल्प / कष्ट): संरचनात्मक कमी। अधिक परिश्रम और विलंबित फल।\n• <20 बिंदु (अति-कष्ट): रक्षात्मक नीति आवश्यक।'
                : 'Distributing 337 points across 12 houses yields an arithmetic mean of 28.08 bindus per house:\n• ≥30 Points (Shrestha / Fortified): Robust structural foundation; natural fruition of effort; Purva Punya support.\n• 25–29 Points (Madhyama / Moderate): Balanced baseline; direct linear correlation between effort and output.\n• 20–24 Points (Alpa / Deficient): Karmic friction; high effort yielding delayed returns.\n• <20 Points (Ati-Kashta / Severe): Requires defensive positioning and conscious resilience.'}
            </Text>

            {/* Raman Override */}
            <Text style={styles.guideHeading}>
              {isHi ? '3. डॉ. बी.वी. रमन का अष्टकवर्ग ओवरराइड नियम (Ashtakavarga Override):' : "3. Dr. B.V. Raman's Ashtakavarga Override Principle:"}
            </Text>
            <Text style={styles.guideParagraph}>
              {isHi
                ? 'प्रसिद्ध ज्योतिषाचार्य डॉ. बी.वी. रमन के अनुसार—यदि कोई उच्च का ग्रह ऐसे भाव में बैठा हो जहाँ सर्वाष्टकवर्ग में 25 से कम (जैसे 20 या 22) बिंदु हों, तो वह उस उच्च अधिकारी की तरह हो जाता है जिसके पास पद तो है पर बजट और कर्मचारी नहीं! इसके विपरीत, नीच का ग्रह भी 32+ बिंदु वाले भाव में पर्यावरण के सहयोग से सकारात्मक परिणाम दे देता है।'
                : 'Astrologer Dr. B.V. Raman articulated that conventional dignities (exaltation, own sign, raja yogas) cannot manifest effectively if the underlying house lacks adequate Ashtakavarga density. An exalted planet in a 20-point house operates like an executive with sweeping authority but starved of budget and staff. Conversely, a debilitated planet in a 32+ house absorbs stress and delivers practical utility.'}
            </Text>
          </View>
        )}
      </View>

      {/* 5. House-by-House Diagnostic Cards (Houses 1 to 12) */}
      <View style={styles.housesSectionHeader}>
        <Text style={styles.sectionHeaderTitle}>
          {isHi ? '🏠 द्वादश भाव विस्तृत निदान (12 House-by-House Diagnostics)' : '🏠 12 House-by-House Diagnostic Specifications'}
        </Text>
        <Text style={styles.sectionHeaderSub}>
          {isHi
            ? 'प्रत्येक भाव के लिए आपके प्राप्त बिंदु, शास्त्रीय सीमाएं, प्राथमिक कारकत्व और व्यक्तिगत विश्लेषण:'
            : 'Personalized diagnostics, primary significations (Karakatva), classical minimum thresholds, and action guidance:'}
        </Text>

        {/* Filter Pills */}
        <View style={styles.filterPillsRow}>
          <TouchableOpacity
            style={[styles.filterPill, selectedHouseFilter === 'ALL' && styles.filterPillActive]}
            onPress={() => setSelectedHouseFilter('ALL')}
          >
            <Text style={[styles.filterPillText, selectedHouseFilter === 'ALL' && styles.filterPillTextActive]}>
              {isHi ? `सभी 12 भाव` : `All 12 Houses`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, selectedHouseFilter === 'PROSPEROUS' && styles.filterPillActive]}
            onPress={() => setSelectedHouseFilter('PROSPEROUS')}
          >
            <Text style={[styles.filterPillText, selectedHouseFilter === 'PROSPEROUS' && styles.filterPillTextActive]}>
              {isHi ? `🌟 श्रेष्ठ (≥30)` : `🌟 Fortified (≥30)`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, selectedHouseFilter === 'EFFORT' && styles.filterPillActive]}
            onPress={() => setSelectedHouseFilter('EFFORT')}
          >
            <Text style={[styles.filterPillText, selectedHouseFilter === 'EFFORT' && styles.filterPillTextActive]}>
              {isHi ? `⚡ मेहनत क्षेत्र (<25)` : `⚡ Deficit (<25)`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {filteredHouses.map(h => {
        const band = h.band;
        return (
          <View
            key={h.houseNumber}
            style={[
              styles.houseCard,
              {
                borderColor: band.borderColor,
                borderLeftWidth: 5,
                borderLeftColor: band.color,
                backgroundColor: '#FFFFFF',
              }
            ]}
          >
            {/* House Card Top Row */}
            <View style={styles.houseCardTopRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.houseCardTitle}>
                  {isHi
                    ? `भाव ${h.houseNumber}: ${h.hindiName}`
                    : `House ${h.houseNumber}: ${h.sanskritName}`}
                </Text>
                <Text style={styles.houseRashiSub}>
                  {isHi
                    ? `राशि: ${h.rashiHindi} (Sign ${h.rashiIndex + 1})`
                    : `Zodiac Sign: ${h.rashiName}`}
                </Text>
              </View>

              {/* Points Badge */}
              <View
                style={[
                  styles.housePointsBadge,
                  { backgroundColor: band.color }
                ]}
              >
                <Text style={styles.housePointsBadgeNum}>{h.points}</Text>
                <Text style={styles.housePointsBadgeUnit}>{isHi ? 'अंक' : 'pts'}</Text>
              </View>
            </View>

            {/* Band Status Chip & Thresholds Bar */}
            <View style={styles.thresholdsBar}>
              <View style={[styles.bandStatusChip, { backgroundColor: band.bgColor, borderColor: band.borderColor }]}>
                <View style={[styles.statusDot, { backgroundColor: band.color }]} />
                <Text style={[styles.bandStatusText, { color: band.color }]}>
                  {isHi ? band.labelHi : band.labelEn}
                </Text>
              </View>

              <Text style={styles.thresholdMetaText}>
                {isHi
                  ? `औसत: ${h.thresholds.mean} • उत्तम: ${h.thresholds.optimum} • न्यूनतम: ${h.thresholds.minThreshold}`
                  : `Mean: ${h.thresholds.mean} • Optimum: ${h.thresholds.optimum} • Min: ${h.thresholds.minThreshold}`}
              </Text>
            </View>

            {/* Karakatva (Primary Significations) */}
            <View style={styles.karakatvaBox}>
              <Text style={styles.karakatvaLabel}>
                {isHi ? '📌 प्राथमिक कारकत्व (Significations):' : '📌 Primary Significations (Karakatva):'}
              </Text>
              <Text style={styles.karakatvaText}>
                {isHi ? h.karakatva.hi : h.karakatva.en}
              </Text>
            </View>

            {/* Astrological Diagnostic Box */}
            <View style={[styles.diagnosticBox, { backgroundColor: band.bgColor, borderColor: band.borderColor }]}>
              <Text style={[styles.diagnosticTitle, { color: band.color }]}>
                {isHi ? `🔮 ${h.diagnostic.titleHi}` : `🔮 ${h.diagnostic.titleEn}`}
              </Text>
              <Text style={[styles.diagnosticText, { color: '#37474F' }]}>
                {isHi ? h.diagnostic.textHi : h.diagnostic.textEn}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  headerBanner: {
    backgroundColor: '#3E1019',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerEmoji: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 11,
    color: '#FFE0B2',
    marginTop: 2,
    lineHeight: 15,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.maroon,
    marginBottom: 4,
  },
  cardSectionSub: {
    fontSize: 11.5,
    color: '#616161',
    lineHeight: 16,
    marginBottom: 10,
  },
  summaryBox: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  summaryEmoji: {
    fontSize: 16,
  },
  summaryTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  summaryDesc: {
    fontSize: 11.5,
    lineHeight: 16.5,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chipPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chipPillText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },
  noneText: {
    fontSize: 11,
    color: '#757575',
    fontStyle: 'italic',
  },
  triadScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginVertical: 4,
  },
  triadScoreItem: {
    alignItems: 'center',
  },
  triadScoreLabel: {
    fontSize: 10,
    color: '#616161',
    fontWeight: '600',
  },
  triadScoreVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#212121',
    marginTop: 1,
  },
  triadCompareSymbol: {
    fontSize: 14,
    color: '#9E9E9E',
    fontWeight: '700',
  },
  guideHeaderTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guideTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: Colors.maroon,
  },
  guideSub: {
    fontSize: 11,
    color: '#757575',
    marginTop: 2,
  },
  expandChevron: {
    fontSize: 14,
    color: Colors.maroon,
    fontWeight: '800',
    marginLeft: 8,
  },
  guideContent: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
  },
  guideHeading: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#3E1019',
    marginTop: 8,
    marginBottom: 3,
  },
  guideParagraph: {
    fontSize: 11.5,
    color: '#424242',
    lineHeight: 17,
    marginBottom: 6,
  },
  housesSectionHeader: {
    marginTop: 6,
    marginBottom: 10,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.maroon,
  },
  sectionHeaderSub: {
    fontSize: 11.5,
    color: '#616161',
    marginTop: 2,
    marginBottom: 8,
    lineHeight: 16,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterPillActive: {
    backgroundColor: Colors.maroon,
    borderColor: Colors.maroon,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#616161',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  houseCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  houseCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  houseCardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#212121',
  },
  houseRashiSub: {
    fontSize: 11.5,
    color: '#757575',
    fontWeight: '600',
    marginTop: 1,
  },
  housePointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 2,
  },
  housePointsBadgeNum: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  housePointsBadgeUnit: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  thresholdsBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    gap: 6,
  },
  bandStatusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bandStatusText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  thresholdMetaText: {
    fontSize: 10,
    color: '#757575',
    fontWeight: '600',
  },
  karakatvaBox: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  karakatvaLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#424242',
    marginBottom: 2,
  },
  karakatvaText: {
    fontSize: 11,
    color: '#616161',
    lineHeight: 15,
  },
  diagnosticBox: {
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
  },
  diagnosticTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 3,
  },
  diagnosticText: {
    fontSize: 11.5,
    lineHeight: 16.5,
  },
});
