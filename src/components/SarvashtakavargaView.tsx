import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { KundaliResult } from '../engine/kundaliEngine';
import {
  calculateSarvashtakavarga,
  SarvashtakavargaResult,
  SAVTradition,
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

  const [selectedTradition, setSelectedTradition] = useState<SAVTradition>('BPHS');
  const [isGuideExpanded, setIsGuideExpanded] = useState(false);
  const [selectedHouseFilter, setSelectedHouseFilter] = useState<'ALL' | 'PROSPEROUS' | 'EFFORT'>('ALL');

  const savResult: SarvashtakavargaResult = calculateSarvashtakavarga(kundali, selectedTradition);
  const {
    houses,
    executiveSummary,
    purusharthaTrikonas,
    directionalRelocation,
    sadeSatiAnalysis,
    lifeVerticals,
    quantumJumps,
    eighthFromStability,
    threePartsOfLife,
    materialSpiritualNature,
    misfortuneYears
  } = savResult;

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

        {/* 🎛️ Responsive Classical Tradition Toggle: BPHS (Popular Default) vs Brihat Jataka */}
        <View style={styles.traditionToggleWrapper}>
          <Text style={styles.traditionToggleHeader}>
            {isHi ? 'शास्त्रीय गणना पद्धति (Classical Tradition):' : isGu ? 'શાસ્ત્રીય ગણતરી પદ્ધતિ:' : 'Calculation Tradition:'}
          </Text>
          <View style={styles.traditionButtonsRow}>
            <TouchableOpacity
              style={[
                styles.traditionBtn,
                selectedTradition === 'BPHS' && styles.traditionBtnActive
              ]}
              onPress={() => setSelectedTradition('BPHS')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.traditionBtnText,
                  selectedTradition === 'BPHS' && styles.traditionBtnTextActive
                ]}
              >
                🏛️ BPHS (Parashara)
              </Text>
              {selectedTradition === 'BPHS' && (
                <View style={styles.traditionActiveDot} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.traditionBtn,
                selectedTradition === 'BRIHAT_JATAKA' && styles.traditionBtnActive
              ]}
              onPress={() => setSelectedTradition('BRIHAT_JATAKA')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.traditionBtnText,
                  selectedTradition === 'BRIHAT_JATAKA' && styles.traditionBtnTextActive
                ]}
              >
                📜 Brihat Jataka
              </Text>
              {selectedTradition === 'BRIHAT_JATAKA' && (
                <View style={styles.traditionActiveDot} />
              )}
            </TouchableOpacity>
          </View>

          {/* Dynamic tradition badge & explanation */}
          <View style={styles.traditionExplanationBox}>
            <Text style={styles.traditionExplanationText}>
              {selectedTradition === 'BPHS'
                ? (isHi
                    ? '✨ महर्षि पराशर सिद्धांत (BPHS): शुक्र को मंगल से चतुर्थ भाव में बिंदु (कर्क H10 = 24 अंक, सिंह H11 = 26 अंक)'
                    : isGu
                    ? '✨ મહર્ષિ પરાશર સિદ્ધાંત (BPHS): શુક્રને મંગળથી ૪થા ભાવમાં બિંદુ (કર્ક H10 = 24, સિંહ H11 = 26)'
                    : '✨ Sage Parashara BPHS Standard • Venus gets bindu in 4th from Mars (Cancer H10 = 24 pts, Leo H11 = 26 pts)')
                : (isHi
                    ? '✨ आचार्य वराहमिहिर सिद्धांत (Brihat Jataka): शुक्र को मंगल से पंचम भाव में बिंदु (कर्क H10 = 23 अंक, सिंह H11 = 27 अंक)'
                    : isGu
                    ? '✨ આચાર્ય વરાહમિહિર સિદ્ધાંત (Brihat Jataka): શુક્રને મંગળથી ૫મા ભાવમાં બિંદુ (કર્ક H10 = 23, સિંહ H11 = 27)'
                    : '✨ Acharya Varahamihira Classical Variant • Venus gets bindu in 5th from Mars (Cancer H10 = 23 pts, Leo H11 = 27 pts)')}
            </Text>
          </View>
        </View>

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

      {/* 6. Four Spatial Directions & Locational Selection (Disha Points) */}
      <View style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.cardSectionEmoji}>🧭</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardSectionTitle}>
              {isHi
                ? 'चतुर्दिक दिशा बिंदु एवं स्थान चयन (Astro-Cartography)'
                : isGu
                ? 'દિશા બિંદુ અને સ્થાન પસંદગી (Astro-Cartography)'
                : 'Spatial Directions & Locational Selection (Disha Points)'}
            </Text>
            <Text style={styles.cardSectionSub}>
              {isHi
                ? '12 भावों का 4 मुख्य दिशाओं में विभाजन (कुल 337 बिंदु शास्त्रीय गणित)'
                : isGu
                ? '12 ભાવોનું 4 મુખ્ય દિશાઓમાં વિભાજન (કુલ 337 બિંદુ)'
                : 'Mapping 12 Houses to Cardinal Directions (337 Classical Invariant Points)'}
            </Text>
          </View>
        </View>

        {/* 🌟 User's Requested Fruitful Direction Callout Box */}
        <View style={styles.fruitfulDirectionBanner}>
          <View style={styles.fruitfulBadgeRow}>
            <Text style={styles.fruitfulCrownEmoji}>👑</Text>
            <Text style={styles.fruitfulBadgeText}>
              {isHi ? 'सर्वाधिक फलदायी दिशा' : isGu ? 'સૌથી વધુ ફળદાયી દિશા' : 'Most Auspicious Orientation'}
            </Text>
          </View>
          <Text style={styles.fruitfulSentenceText}>
            {isGu
              ? directionalRelocation.citySectorRecommendationGu
              : isHi
              ? directionalRelocation.citySectorRecommendationHi
              : directionalRelocation.citySectorRecommendationEn}
          </Text>
        </View>

        {/* 4 Cardinal Directions Grid */}
        <View style={styles.directionGrid}>
          {/* East */}
          <View style={[
            styles.directionItemBox,
            directionalRelocation.bestDirection === 'EAST' && styles.directionItemBoxBest,
            directionalRelocation.vulnerableDirection === 'EAST' && styles.directionItemBoxVuln
          ]}>
            <View style={styles.directionItemHeader}>
              <Text style={styles.directionName}>
                {isHi ? 'पूर्व (East)' : isGu ? 'પૂર્વ (East)' : 'East (Purva)'}
              </Text>
              {directionalRelocation.bestDirection === 'EAST' && (
                <View style={styles.bestPill}><Text style={styles.bestPillText}>⭐ Best</Text></View>
              )}
            </View>
            <Text style={styles.directionFormula}>{isHi ? 'भाव 1, 5, 9 (धर्म • अग्नि)' : 'Houses 1, 5, 9 (Dharma)'}</Text>
            <Text style={styles.directionPtsText}>{directionalRelocation.eastPoints} <Text style={styles.ptsUnit}>pts</Text></Text>
          </View>

          {/* South */}
          <View style={[
            styles.directionItemBox,
            directionalRelocation.bestDirection === 'SOUTH' && styles.directionItemBoxBest,
            directionalRelocation.vulnerableDirection === 'SOUTH' && styles.directionItemBoxVuln
          ]}>
            <View style={styles.directionItemHeader}>
              <Text style={styles.directionName}>
                {isHi ? 'दक्षिण (South)' : isGu ? 'દક્ષિણ (South)' : 'South (Dakshin)'}
              </Text>
              {directionalRelocation.bestDirection === 'SOUTH' && (
                <View style={styles.bestPill}><Text style={styles.bestPillText}>⭐ Best</Text></View>
              )}
            </View>
            <Text style={styles.directionFormula}>{isHi ? 'भाव 2, 6, 10 (अर्थ • पृथ्वी)' : 'Houses 2, 6, 10 (Artha)'}</Text>
            <Text style={styles.directionPtsText}>{directionalRelocation.southPoints} <Text style={styles.ptsUnit}>pts</Text></Text>
          </View>

          {/* West */}
          <View style={[
            styles.directionItemBox,
            directionalRelocation.bestDirection === 'WEST' && styles.directionItemBoxBest,
            directionalRelocation.vulnerableDirection === 'WEST' && styles.directionItemBoxVuln
          ]}>
            <View style={styles.directionItemHeader}>
              <Text style={styles.directionName}>
                {isHi ? 'पश्चिम (West)' : isGu ? 'પશ્ચિમ (West)' : 'West (Paschim)'}
              </Text>
              {directionalRelocation.bestDirection === 'WEST' && (
                <View style={styles.bestPill}><Text style={styles.bestPillText}>⭐ Best</Text></View>
              )}
            </View>
            <Text style={styles.directionFormula}>{isHi ? 'भाव 3, 7, 11 (काम • वायु)' : 'Houses 3, 7, 11 (Kama)'}</Text>
            <Text style={styles.directionPtsText}>{directionalRelocation.westPoints} <Text style={styles.ptsUnit}>pts</Text></Text>
          </View>

          {/* North */}
          <View style={[
            styles.directionItemBox,
            directionalRelocation.bestDirection === 'NORTH' && styles.directionItemBoxBest,
            directionalRelocation.vulnerableDirection === 'NORTH' && styles.directionItemBoxVuln
          ]}>
            <View style={styles.directionItemHeader}>
              <Text style={styles.directionName}>
                {isHi ? 'उत्तर (North)' : isGu ? 'ઉત્તર (North)' : 'North (Uttara)'}
              </Text>
              {directionalRelocation.bestDirection === 'NORTH' && (
                <View style={styles.bestPill}><Text style={styles.bestPillText}>⭐ Best</Text></View>
              )}
            </View>
            <Text style={styles.directionFormula}>{isHi ? 'भाव 4, 8, 12 (मोक्ष • जल)' : 'Houses 4, 8, 12 (Moksha)'}</Text>
            <Text style={styles.directionPtsText}>{directionalRelocation.northPoints} <Text style={styles.ptsUnit}>pts</Text></Text>
          </View>
        </View>

        {/* Vastu & Spatial Orientation Box */}
        <View style={styles.vastuBox}>
          <Text style={styles.vastuHeading}>{isHi ? '🏡 वास्तु एवं कार्यस्थल संरेखण (Vastu & Workspace):' : '🏡 Vastu & Workspace Orientation:'}</Text>
          <Text style={styles.vastuText}>
            {isGu
              ? directionalRelocation.vastuRecommendationGu
              : isHi
              ? directionalRelocation.vastuRecommendationHi
              : directionalRelocation.vastuRecommendationEn}
          </Text>
        </View>
      </View>

      {/* 7. Four Purushartha Trikonas (84-point baseline) */}
      <View style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.cardSectionEmoji}>🏹</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardSectionTitle}>
              {isHi
                ? 'चार पुरुषार्थ त्रिकोण (84-अंक शास्त्रीय मानक)'
                : isGu
                ? 'ચાર પુરુષાર્થ ત્રિકોણ (84-અંક માનક)'
                : 'The 4 Purushartha Trikonas (84-pt Benchmark)'}
            </Text>
            <Text style={styles.cardSectionSub}>
              {isHi
                ? 'प्रत्येक त्रिकोण का औसत मानक 84 बिंदु (28 × 3 भाव) है। 84+ अंक जीवन की प्रमुख ऊर्जा को दर्शाते हैं:'
                : 'Standard baseline is 84 points per trine (28 × 3). Scores >84 define your primary life pursuit:'}
            </Text>
          </View>
        </View>

        <View style={styles.trikonaList}>
          {purusharthaTrikonas.map(trine => {
            const isAbove = trine.points >= 84;
            return (
              <View key={trine.id} style={styles.trikonaCard}>
                <View style={styles.trikonaHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.trikonaName}>
                      {isHi ? trine.nameHi : isGu ? trine.nameGu : trine.nameEn}
                    </Text>
                    <Text style={styles.trikonaMeta}>
                      {isHi
                        ? `भाव: ${trine.houses.join(', ')} • ${trine.elementHi} • दिशा: ${trine.directionHi}`
                        : `Houses: ${trine.houses.join(', ')} • ${trine.elementEn} • Dir: ${trine.directionEn}`}
                    </Text>
                  </View>
                  <View style={[styles.trikonaBadge, { backgroundColor: isAbove ? '#E8F5E9' : '#FFF3E0', borderColor: isAbove ? '#81C784' : '#FFB74D' }]}>
                    <Text style={[styles.trikonaPtsNum, { color: isAbove ? '#2E7D32' : '#E65100' }]}>{trine.points}</Text>
                    <Text style={[styles.trikonaPtsLabel, { color: isAbove ? '#1B5E20' : '#BF360C' }]}>{trine.percentage}%</Text>
                  </View>
                </View>
                <Text style={styles.trikonaDesc}>
                  {isHi ? trine.descriptionHi : isGu ? trine.descriptionGu : trine.descriptionEn}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 8. Sade Sati Structural Stress-Test Dashboard */}
      <View style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.cardSectionEmoji}>🪐</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardSectionTitle}>
              {isHi
                ? 'साढ़ेसाती संरचनात्मक सहनशीलता डैशबोर्ड'
                : isGu
                ? 'સાડાસાતી સહનશીલતા ડેશબોર્ડ'
                : 'Sade Sati Structural Stress-Test Dashboard'}
            </Text>
            <Text style={styles.cardSectionSub}>
              {isHi
                ? `जन्म चंद्र: ${sadeSatiAnalysis.moonRashiNameHi} (भाव ${sadeSatiAnalysis.moonHouse}) • 3 भावों का कुल योग: ${sadeSatiAnalysis.total3SignPoints} अंक (मानक: 84)`
                : `Natal Moon: ${sadeSatiAnalysis.moonRashiNameEn} (H${sadeSatiAnalysis.moonHouse}) • 3-Sign Sum: ${sadeSatiAnalysis.total3SignPoints} pts (Benchmark: 84)`}
            </Text>
          </View>
        </View>

        {/* Classification Banner */}
        <View style={[
          styles.sadeSatiBanner,
          sadeSatiAnalysis.classification === 'CONSTRUCTIVE_ELEVATION' && { backgroundColor: '#E8F5E9', borderColor: '#81C784' },
          sadeSatiAnalysis.classification === 'MODERATE_PROGRESS' && { backgroundColor: '#FFF8E1', borderColor: '#FFE082' },
          sadeSatiAnalysis.classification === 'HIGH_FRICTION_RESTRUCTURING' && { backgroundColor: '#FFEBEE', borderColor: '#EF9A9A' }
        ]}>
          <Text style={[
            styles.sadeSatiBannerTitle,
            sadeSatiAnalysis.classification === 'CONSTRUCTIVE_ELEVATION' && { color: '#1B5E20' },
            sadeSatiAnalysis.classification === 'MODERATE_PROGRESS' && { color: '#F57F17' },
            sadeSatiAnalysis.classification === 'HIGH_FRICTION_RESTRUCTURING' && { color: '#C62828' }
          ]}>
            {isHi ? sadeSatiAnalysis.titleHi : isGu ? sadeSatiAnalysis.titleGu : sadeSatiAnalysis.titleEn}
          </Text>
          <Text style={styles.sadeSatiBannerDesc}>
            {isHi ? sadeSatiAnalysis.descriptionHi : isGu ? sadeSatiAnalysis.descriptionGu : sadeSatiAnalysis.descriptionEn}
          </Text>
        </View>

        {/* 3 Dhaiya Phases */}
        <View style={styles.dhaiyaList}>
          {sadeSatiAnalysis.phases.map(phase => (
            <View key={phase.phaseNumber} style={styles.dhaiyaCard}>
              <View style={styles.dhaiyaHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.dhaiyaTitle}>
                    {isHi ? phase.titleHi : isGu ? phase.titleGu : phase.titleEn}
                  </Text>
                  <Text style={styles.dhaiyaSub}>
                    {isHi
                      ? `राशि: ${phase.rashiNameHi} • जन्म लग्न से भाव: ${phase.houseNumber}`
                      : `Sign: ${phase.rashiNameEn} • House: ${phase.houseNumber}`}
                  </Text>
                </View>
                <View style={styles.dhaiyaPillRow}>
                  <View style={styles.dhaiyaSavPill}>
                    <Text style={styles.dhaiyaSavPillNum}>{phase.savPoints}</Text>
                    <Text style={styles.dhaiyaSavPillLabel}>SAV</Text>
                  </View>
                  <View style={styles.dhaiyaBavPill}>
                    <Text style={styles.dhaiyaBavPillNum}>{phase.saturnBavPoints}</Text>
                    <Text style={styles.dhaiyaBavPillLabel}>Shani BAV</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 9. Key Life Verticals Matrix */}
      <View style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.cardSectionEmoji}>💼</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardSectionTitle}>
              {isHi
                ? 'मुख्य जीवन क्षेत्र एवं शास्त्रीय योग'
                : isGu
                ? 'મુખ્ય જીવન ક્ષેત્રો અને શાસ્ત્રીય યોગ'
                : 'Key Life Verticals & Classical Yogas'}
            </Text>
            <Text style={styles.cardSectionSub}>
              {isHi
                ? 'आजीविका, धन संचय, वैवाहिक संतुलन और गृह शांति का गणितीय विश्लेषण'
                : 'Analytical ratios governing career, wealth lock, marriage agency, and domestic peace'}
            </Text>
          </View>
        </View>

        {/* Vertical 1: Job vs Business */}
        <View style={styles.verticalBox}>
          <View style={styles.verticalHeaderRow}>
            <Text style={styles.verticalIcon}>👔</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.verticalTitle}>
                {isHi ? lifeVerticals.jobVsBusiness.titleHi : isGu ? lifeVerticals.jobVsBusiness.titleGu : lifeVerticals.jobVsBusiness.titleEn}
              </Text>
              <Text style={styles.verticalCompareSub}>
                {isHi
                  ? `6ठा भाव (सेवा): ${lifeVerticals.jobVsBusiness.h6Points} pts vs 10वां भाव (व्यवसाय/कर्म): ${lifeVerticals.jobVsBusiness.h10Points} pts`
                  : `6th House (Service): ${lifeVerticals.jobVsBusiness.h6Points} pts vs 10th House (Career): ${lifeVerticals.jobVsBusiness.h10Points} pts`}
              </Text>
            </View>
          </View>
          <Text style={styles.verticalDesc}>
            {isHi ? lifeVerticals.jobVsBusiness.descriptionHi : isGu ? lifeVerticals.jobVsBusiness.descriptionGu : lifeVerticals.jobVsBusiness.descriptionEn}
          </Text>
        </View>

        {/* Vertical 2: Self-Effort vs Luck */}
        <View style={[styles.verticalBox, { marginTop: 10 }]}>
          <View style={styles.verticalHeaderRow}>
            <Text style={styles.verticalIcon}>⚡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.verticalTitle}>
                {isHi ? lifeVerticals.executionVsLuck.titleHi : isGu ? lifeVerticals.executionVsLuck.titleGu : lifeVerticals.executionVsLuck.titleEn}
              </Text>
              <Text style={styles.verticalCompareSub}>
                {isHi
                  ? `10वां भाव (कर्म/पुरुषार्थ): ${lifeVerticals.executionVsLuck.h10Points} pts vs 9वां भाव (भाग्य): ${lifeVerticals.executionVsLuck.h9Points} pts`
                  : `10th House (Effort): ${lifeVerticals.executionVsLuck.h10Points} pts vs 9th House (Luck): ${lifeVerticals.executionVsLuck.h9Points} pts`}
              </Text>
            </View>
          </View>
          <Text style={styles.verticalDesc}>
            {isHi ? lifeVerticals.executionVsLuck.descriptionHi : isGu ? lifeVerticals.executionVsLuck.descriptionGu : lifeVerticals.executionVsLuck.descriptionEn}
          </Text>
        </View>

        {/* Vertical 3: Lifelong Wealth Lock */}
        <View style={[styles.verticalBox, { marginTop: 10, backgroundColor: lifeVerticals.wealthLock.isLocked ? '#E8F5E9' : '#FFFDE7', borderColor: lifeVerticals.wealthLock.isLocked ? '#81C784' : '#FFF59D' }]}>
          <View style={styles.verticalHeaderRow}>
            <Text style={styles.verticalIcon}>💰</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.verticalTitle, { color: lifeVerticals.wealthLock.isLocked ? '#1B5E20' : '#F57F17' }]}>
                {isHi ? lifeVerticals.wealthLock.titleHi : isGu ? lifeVerticals.wealthLock.titleGu : lifeVerticals.wealthLock.titleEn}
              </Text>
              <Text style={styles.verticalCompareSub}>
                {isHi
                  ? `2रा भाव (संचय): ${lifeVerticals.wealthLock.h2Points} pts • 11वां भाव (लाभ): ${lifeVerticals.wealthLock.h11Points} pts (मानक: ≥31)`
                  : `2nd House (Dhana): ${lifeVerticals.wealthLock.h2Points} pts • 11th House (Gains): ${lifeVerticals.wealthLock.h11Points} pts (Threshold: ≥31)`}
              </Text>
            </View>
          </View>
          <Text style={[styles.verticalDesc, { color: '#37474F' }]}>
            {isHi ? lifeVerticals.wealthLock.descriptionHi : isGu ? lifeVerticals.wealthLock.descriptionGu : lifeVerticals.wealthLock.descriptionEn}
          </Text>
        </View>

        {/* Vertical 4: Marriage Agency & Equilibrium */}
        <View style={[styles.verticalBox, { marginTop: 10 }]}>
          <View style={styles.verticalHeaderRow}>
            <Text style={styles.verticalIcon}>💍</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.verticalTitle}>
                {isHi ? lifeVerticals.marriageAgency.titleHi : isGu ? lifeVerticals.marriageAgency.titleGu : lifeVerticals.marriageAgency.titleEn}
              </Text>
              <Text style={styles.verticalCompareSub}>
                {isHi
                  ? `1ला भाव (स्वयं): ${lifeVerticals.marriageAgency.h1Points} pts vs 7वां भाव (जीवनसाथी): ${lifeVerticals.marriageAgency.h7Points} pts`
                  : `1st House (Self): ${lifeVerticals.marriageAgency.h1Points} pts vs 7th House (Partner): ${lifeVerticals.marriageAgency.h7Points} pts`}
              </Text>
            </View>
          </View>
          <Text style={styles.verticalDesc}>
            {isHi ? lifeVerticals.marriageAgency.descriptionHi : isGu ? lifeVerticals.marriageAgency.descriptionGu : lifeVerticals.marriageAgency.descriptionEn}
          </Text>
        </View>

        {/* Vertical 5: Domestic Peace & Triple Crown Yoga */}
        <View style={[styles.verticalBox, { marginTop: 10 }]}>
          <View style={styles.verticalHeaderRow}>
            <Text style={styles.verticalIcon}>🏛️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.verticalTitle}>
                {isHi ? lifeVerticals.domesticAndYogas.titleHi : isGu ? lifeVerticals.domesticAndYogas.titleGu : lifeVerticals.domesticAndYogas.titleEn}
              </Text>
              <Text style={styles.verticalCompareSub}>
                {isHi
                  ? `4था भाव: ${lifeVerticals.domesticAndYogas.h4Points} pts • 5वां भाव: ${lifeVerticals.domesticAndYogas.h5Points} pts • 6ठा भाव: ${lifeVerticals.domesticAndYogas.h6Points} pts`
                  : `4th House: ${lifeVerticals.domesticAndYogas.h4Points} pts • 5th House: ${lifeVerticals.domesticAndYogas.h5Points} pts • 6th House: ${lifeVerticals.domesticAndYogas.h6Points} pts`}
              </Text>
            </View>
          </View>
          <Text style={styles.verticalDesc}>
            {isHi ? lifeVerticals.domesticAndYogas.descriptionHi : isGu ? lifeVerticals.domesticAndYogas.descriptionGu : lifeVerticals.domesticAndYogas.descriptionEn}
          </Text>
        </View>
      </View>

      {/* 10. Quantum Jump Alerts (Adjacent House Transitions) */}
      <View style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.cardSectionEmoji}>🚀</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardSectionTitle}>
              {isHi
                ? 'गोचर गतिशीलता: क्वांटम जंप अलर्ट (Rocket & Cliff)'
                : isGu
                ? 'ગોચર ક્વોન્ટમ જંપ એલર્ટ'
                : 'Transit Dynamics: Quantum Jump Alerts'}
            </Text>
            <Text style={styles.cardSectionSub}>
              {isHi
                ? 'समीपवर्ती भावों में 10+ बिंदुओं का तीव्र अंतर गोचर ग्रहों के प्रभाव में अचानक बदलाव लाता है:'
                : 'Adjacent houses with point differentials |Δ| ≥ 10 trigger abrupt momentum shifts during transits:'}
            </Text>
          </View>
        </View>

        {quantumJumps.length > 0 ? (
          quantumJumps.map((qj, idx) => (
            <View
              key={idx}
              style={[
                styles.quantumBox,
                qj.type === 'ROCKET' ? { backgroundColor: '#E8F5E9', borderColor: '#81C784' } : { backgroundColor: '#FFEBEE', borderColor: '#EF9A9A' },
                idx > 0 && { marginTop: 8 }
              ]}
            >
              <View style={styles.quantumHeaderRow}>
                <Text style={styles.quantumIcon}>{qj.type === 'ROCKET' ? '🚀' : '⚠️'}</Text>
                <Text style={[styles.quantumTitle, { color: qj.type === 'ROCKET' ? '#1B5E20' : '#B71C1C' }]}>
                  {isHi ? qj.titleHi : isGu ? qj.titleGu : qj.titleEn}
                </Text>
              </View>
              <Text style={styles.quantumDesc}>
                {isHi ? qj.descriptionHi : isGu ? qj.descriptionGu : qj.descriptionEn}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.noQuantumBox}>
            <Text style={styles.noQuantumEmoji}>🌱</Text>
            <Text style={styles.noQuantumText}>
              {isHi
                ? 'सभी समीपवर्ती भावों में बिंदु परिवर्तन सामान्य (3-8 बिंदु) है। गोचर ग्रह किसी तीव्र झटके के बिना संतुलित रूप से फल प्रदान करेंगे।'
                : 'Smooth linear transitions across all adjacent houses (|Δ| < 10 pts). Planetary transits proceed with steady momentum without abrupt shocks.'}
            </Text>
          </View>
        )}
      </View>

      {/* 11. 8th-From Structural Stability Audit (Bhavat Bhavam) */}
      <View style={styles.card}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.cardSectionEmoji}>🛡️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardSectionTitle}>
              {isHi
                ? 'भावत भावम: 8वां भाव सुरक्षा विश्लेषण (8th-From Audit)'
                : isGu
                ? 'ભાવત ભાવમ: 8મો ભાવ સુરક્ષા વિશ્લેષણ'
                : '8th-From Structural Stability Audit (Bhavat Bhavam)'}
            </Text>
            <Text style={styles.cardSectionSub}>
              {isHi
                ? 'किसी भी भाव की स्थिरता उसके 8वें व्युत्पन्न भाव पर निर्भर करती है (मूल भाव > 8वां भाव = सुरक्षित):'
                : 'A domain endures when its points exceed the house situated 8th from it:'}
            </Text>
          </View>
        </View>

        <View style={styles.eighthFromList}>
          {eighthFromStability.map(item => {
            const isShielded = item.status === 'STABLE_SHIELDED';
            const isVuln = item.status === 'CRITICAL_VULNERABILITY';
            return (
              <View
                key={item.referenceHouse}
                style={[
                  styles.eighthFromCard,
                  isShielded && { borderColor: '#81C784', borderLeftColor: '#2E7D32', borderLeftWidth: 4 },
                  isVuln && { borderColor: '#EF9A9A', borderLeftColor: '#C62828', borderLeftWidth: 4 }
                ]}
              >
                <View style={styles.eighthFromHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eighthFromTitle}>
                      {isHi ? item.referenceNameHi : item.referenceNameEn}
                    </Text>
                    <Text style={styles.eighthFromVulnSub}>
                      {isHi
                        ? `व्युत्पन्न 8वां: ${item.vulnerabilityNameHi}`
                        : `Derived 8th: ${item.vulnerabilityNameEn}`}
                    </Text>
                  </View>
                  <View style={[
                    styles.stabilityBadge,
                    isShielded && { backgroundColor: '#E8F5E9' },
                    isVuln && { backgroundColor: '#FFEBEE' }
                  ]}>
                    <Text style={[
                      styles.stabilityBadgeText,
                      isShielded && { color: '#1B5E20' },
                      isVuln && { color: '#B71C1C' }
                    ]}>
                      {isShielded ? (isHi ? '🛡️ सुरक्षित' : '🛡️ Shielded') : isVuln ? (isHi ? '⚠️ सतर्कता' : '⚠️ Vulnerable') : (isHi ? '⚖️ संतुलित' : '⚖️ Neutral')}
                    </Text>
                    <Text style={styles.stabilityDeltaText}>
                      Δ {item.deltaStability > 0 ? `+${item.deltaStability}` : item.deltaStability} pts
                    </Text>
                  </View>
                </View>

                <Text style={styles.destabFactorText}>
                  <Text style={{ fontWeight: '700' }}>{isHi ? 'संभावित जोखिम: ' : 'Destabilizing Risk: '}</Text>
                  {isHi ? item.destabilizingFactorHi : item.destabilizingFactorEn}
                </Text>
                <Text style={styles.recommendationText}>
                  <Text style={{ fontWeight: '700' }}>{isHi ? 'सलाह: ' : 'Guidance: '}</Text>
                  {isHi ? item.recommendationHi : item.recommendationEn}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 7. 🌅 Judging Three Parts of Life (अवस्था विश्लेषण) */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>
          {isHi ? '🌅 जीवन के तीन काल (Three Parts of Life - Avastha Analysis)' : '🌅 Judging Three Parts of Life'}
        </Text>
        <Text style={styles.cardSectionSub}>
          {isHi
            ? 'राशि एवं भाव त्रिखंड द्वारा जीवन के बाल्यावस्था, मध्यम काल और अंतिम काल की सुगमता व समृद्धि का शास्त्रीय आकलन:'
            : 'Evaluation of Early, Middle, and Later life phases through classical Zodiacal and Bhava triads:'}
        </Text>

        {/* 🌟 Golden Phase Callout Banner */}
        <View style={styles.goldenPhaseBanner}>
          <Text style={styles.goldenPhaseEmoji}>🌟</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.goldenPhaseTitle}>
              {isHi
                ? threePartsOfLife.synthesizedVerdict.goldenPhaseHi
                : isGu
                ? threePartsOfLife.synthesizedVerdict.goldenPhaseGu
                : threePartsOfLife.synthesizedVerdict.goldenPhaseEn}
            </Text>
            <Text style={styles.goldenPhaseCounsel}>
              {isHi
                ? threePartsOfLife.synthesizedVerdict.counselHi
                : isGu
                ? threePartsOfLife.synthesizedVerdict.counselGu
                : threePartsOfLife.synthesizedVerdict.counselEn}
            </Text>
          </View>
        </View>

        {/* Method 1: Rashi Khandas */}
        <View style={styles.methodCard}>
          <Text style={styles.methodTitle}>
            {isHi ? threePartsOfLife.method1RashiKhandas.titleHi : isGu ? threePartsOfLife.method1RashiKhandas.titleGu : threePartsOfLife.method1RashiKhandas.titleEn}
          </Text>
          <Text style={styles.methodSub}>
            {isHi ? threePartsOfLife.method1RashiKhandas.descriptionHi : isGu ? threePartsOfLife.method1RashiKhandas.descriptionGu : threePartsOfLife.method1RashiKhandas.descriptionEn}
          </Text>

          <View style={styles.partsList}>
            {threePartsOfLife.method1RashiKhandas.parts.map(part => {
              const isPeak = part.isPeak;
              const isLeast = part.isLeast;
              return (
                <View
                  key={part.partNumber}
                  style={[
                    styles.partCard,
                    isPeak && { borderColor: '#81C784', backgroundColor: '#F1F8E9' },
                    isLeast && { borderColor: '#FFCCBC', backgroundColor: '#FBE9E7' }
                  ]}
                >
                  <View style={styles.partTopRow}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.partTitle}>
                          {isHi ? part.titleHi : isGu ? part.titleGu : part.titleEn}
                        </Text>
                        {isPeak && (
                          <View style={[styles.partBadge, { backgroundColor: '#2E7D32' }]}>
                            <Text style={styles.partBadgeText}>{isHi ? '👑 चरमोत्कर्ष' : '👑 Peak'}</Text>
                          </View>
                        )}
                        {isLeast && (
                          <View style={[styles.partBadge, { backgroundColor: '#D84315' }]}>
                            <Text style={styles.partBadgeText}>{isHi ? '⚠️ धैर्य काल' : '⚠️ Patience'}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.partSpanSub}>
                        {isHi ? part.spanHi : isGu ? part.spanGu : part.spanEn}
                      </Text>
                    </View>

                    <View style={styles.partPointsCol}>
                      <Text style={[styles.partPointsVal, isPeak && { color: '#2E7D32' }, isLeast && { color: '#D84315' }]}>
                        {part.points} pts
                      </Text>
                      <Text style={styles.partBenchmarkText}>
                        {part.percentage}% (मानक ११२)
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.partProgressBarBg}>
                    <View
                      style={[
                        styles.partProgressBarFill,
                        {
                          width: `${Math.min(100, (part.points / 130) * 100)}%`,
                          backgroundColor: isPeak ? '#2E7D32' : isLeast ? '#D84315' : '#E65100'
                        }
                      ]}
                    />
                  </View>

                  <Text style={styles.partDesc}>
                    {isHi ? part.descriptionHi : isGu ? part.descriptionGu : part.descriptionEn}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Method 2: Bhava Khandas */}
        <View style={[styles.methodCard, { marginTop: 12 }]}>
          <Text style={styles.methodTitle}>
            {isHi ? threePartsOfLife.method2BhavaKhandas.titleHi : isGu ? threePartsOfLife.method2BhavaKhandas.titleGu : threePartsOfLife.method2BhavaKhandas.titleEn}
          </Text>
          <Text style={styles.methodSub}>
            {isHi ? threePartsOfLife.method2BhavaKhandas.descriptionHi : isGu ? threePartsOfLife.method2BhavaKhandas.descriptionGu : threePartsOfLife.method2BhavaKhandas.descriptionEn}
          </Text>

          <View style={styles.partsList}>
            {threePartsOfLife.method2BhavaKhandas.parts.map(part => {
              const isPeak = part.isPeak;
              const isLeast = part.isLeast;
              return (
                <View
                  key={part.partNumber}
                  style={[
                    styles.partCard,
                    isPeak && { borderColor: '#81C784', backgroundColor: '#F1F8E9' },
                    isLeast && { borderColor: '#FFCCBC', backgroundColor: '#FBE9E7' }
                  ]}
                >
                  <View style={styles.partTopRow}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.partTitle}>
                          {isHi ? part.titleHi : isGu ? part.titleGu : part.titleEn}
                        </Text>
                        {isPeak && (
                          <View style={[styles.partBadge, { backgroundColor: '#2E7D32' }]}>
                            <Text style={styles.partBadgeText}>{isHi ? '👑 चरमोत्कर्ष' : '👑 Peak'}</Text>
                          </View>
                        )}
                        {isLeast && (
                          <View style={[styles.partBadge, { backgroundColor: '#D84315' }]}>
                            <Text style={styles.partBadgeText}>{isHi ? '⚠️ धैर्य काल' : '⚠️ Patience'}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.partSpanSub}>
                        {isHi ? part.spanHi : isGu ? part.spanGu : part.spanEn}
                      </Text>
                    </View>

                    <View style={styles.partPointsCol}>
                      <Text style={[styles.partPointsVal, isPeak && { color: '#2E7D32' }, isLeast && { color: '#D84315' }]}>
                        {part.points} pts
                      </Text>
                      <Text style={styles.partBenchmarkText}>
                        {part.percentage}% (मानक ११२)
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.partProgressBarBg}>
                    <View
                      style={[
                        styles.partProgressBarFill,
                        {
                          width: `${Math.min(100, (part.points / 130) * 100)}%`,
                          backgroundColor: isPeak ? '#2E7D32' : isLeast ? '#D84315' : '#E65100'
                        }
                      ]}
                    />
                  </View>

                  <Text style={styles.partDesc}>
                    {isHi ? part.descriptionHi : isGu ? part.descriptionGu : part.descriptionEn}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* 8. ⚖️ Materialistic vs Spiritualistic Nature (अंतर्भाग बनाम बहिर्भाग) */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>
          {isHi ? '⚖️ अंतर्भाग बनाम बहिर्भाग (Material vs Spiritual Nature)' : '⚖️ Material vs Spiritual Orientation'}
        </Text>
        <Text style={styles.cardSectionSub}>
          {isHi
            ? 'आत्मिक शांति व धर्म (अंतर्भाग) बनाम भौतिक महत्वाकांक्षा व सांसारिक प्रतिष्ठा (बहिर्भाग) का सूक्ष्म विभाजन:'
            : 'Evaluating inner contemplative dharma (Antarbhaga) against outward worldly enterprise (Bahirbhaga):'}
        </Text>

        {/* Nature Verdict Box */}
        <View
          style={[
            styles.natureVerdictBox,
            materialSpiritualNature.verdict === 'SPIRITUAL_DOMINANT' && { backgroundColor: '#E8F5E9', borderColor: '#81C784' },
            materialSpiritualNature.verdict === 'MATERIAL_DOMINANT' && { backgroundColor: '#FFF8E1', borderColor: '#FFD54F' },
            materialSpiritualNature.verdict === 'BALANCED_HARMONY' && { backgroundColor: '#F3E5F5', borderColor: '#CE93D8' }
          ]}
        >
          <Text style={styles.natureVerdictTitle}>
            {isHi ? materialSpiritualNature.titleHi : isGu ? materialSpiritualNature.titleGu : materialSpiritualNature.titleEn}
          </Text>
          <Text style={styles.natureVerdictSub}>
            {isHi ? materialSpiritualNature.subtitleHi : isGu ? materialSpiritualNature.subtitleGu : materialSpiritualNature.subtitleEn}
          </Text>
          <Text style={styles.natureVerdictDesc}>
            {isHi ? materialSpiritualNature.descriptionHi : isGu ? materialSpiritualNature.descriptionGu : materialSpiritualNature.descriptionEn}
          </Text>
        </View>

        {/* Split Visual Progress Bar */}
        <View style={styles.natureProgressContainer}>
          <View style={styles.natureSplitProgressBg}>
            <View
              style={[
                styles.natureSplitProgressLeft,
                { width: `${materialSpiritualNature.antarbhagaPercentage}%` }
              ]}
            />
            <View
              style={[
                styles.natureSplitProgressRight,
                { width: `${materialSpiritualNature.bahirbhagaPercentage}%` }
              ]}
            />
          </View>
          <View style={styles.natureSplitLabelsRow}>
            <Text style={[styles.natureSplitLabel, { color: '#1B5E20' }]}>
              🕉️ {isHi ? 'अंतर्भाग' : 'Antarbhaga'}: {materialSpiritualNature.antarbhagaPoints} pts ({materialSpiritualNature.antarbhagaPercentage}%)
            </Text>
            <Text style={[styles.natureSplitLabel, { color: '#B78103' }]}>
              💼 {isHi ? 'बहिर्भाग' : 'Bahirbhaga'}: {materialSpiritualNature.bahirbhagaPoints} pts ({materialSpiritualNature.bahirbhagaPercentage}%)
            </Text>
          </View>
        </View>

        {/* Dual Cards */}
        <View style={styles.dualNatureRow}>
          {/* Antarbhaga Card */}
          <View style={[styles.natureCard, { borderColor: '#81C784', backgroundColor: '#F9FBE7' }]}>
            <View style={styles.natureCardHeader}>
              <Text style={styles.natureCardEmoji}>🕉️</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.natureCardTitle, { color: '#2E7D32' }]}>
                  {isHi ? 'अंतर्भाग (Antarbhaga)' : 'Antarbhaga (Inner)'}
                </Text>
                <Text style={styles.natureCardPts}>
                  {materialSpiritualNature.antarbhagaPoints} Bindus • {materialSpiritualNature.antarbhagaPercentage}%
                </Text>
              </View>
            </View>
            <Text style={styles.natureCardHouses}>
              <Text style={{ fontWeight: '700' }}>{isHi ? 'सम्मिलित भाव: ' : 'Houses: '}</Text>
              Kona (5, 9) + Kendra (1, 4, 7, 10)
            </Text>
            <Text style={styles.natureCardSig}>
              {isHi
                ? materialSpiritualNature.antarbhagaSignificationsHi
                : isGu
                ? materialSpiritualNature.antarbhagaSignificationsGu
                : materialSpiritualNature.antarbhagaSignificationsEn}
            </Text>
          </View>

          {/* Bahirbhaga Card */}
          <View style={[styles.natureCard, { borderColor: '#FFD54F', backgroundColor: '#FFFDE7' }]}>
            <View style={styles.natureCardHeader}>
              <Text style={styles.natureCardEmoji}>💼</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.natureCardTitle, { color: '#E65100' }]}>
                  {isHi ? 'बहिर्भाग (Bahirbhaga)' : 'Bahirbhaga (Outer)'}
                </Text>
                <Text style={styles.natureCardPts}>
                  {materialSpiritualNature.bahirbhagaPoints} Bindus • {materialSpiritualNature.bahirbhagaPercentage}%
                </Text>
              </View>
            </View>
            <Text style={styles.natureCardHouses}>
              <Text style={{ fontWeight: '700' }}>{isHi ? 'सम्मिलित भाव: ' : 'Houses: '}</Text>
              Houses 2, 3, 6, 8, 11, 12
            </Text>
            <Text style={styles.natureCardSig}>
              {isHi
                ? materialSpiritualNature.bahirbhagaSignificationsHi
                : isGu
                ? materialSpiritualNature.bahirbhagaSignificationsGu
                : materialSpiritualNature.bahirbhagaSignificationsEn}
            </Text>
          </View>
        </View>
      </View>

      {/* 9. ⚠️ Judging Years of Misfortune & Vulnerability Windows */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>
          {isHi ? '⚠️ संकट एवं रोग संवेदनशीलता वर्ष (Misfortune Windows - 7/27 Rule)' : '⚠️ Misfortune & Health Windows (7/27 Rule)'}
        </Text>
        <Text style={styles.cardSectionSub}>
          {isHi
            ? 'अष्टकवर्ग के शास्त्रीय सूत्रों (७/२७ नियम एवं पापी ग्रह स्थित भाव बिंदु) द्वारा रोग, शल्य क्रिया व कर्म परीक्षा के संभावित आयु वर्ष:'
            : 'Classical Ashtakavarga algorithms (7/27 quotient & malefic house occupancy) indicating periods for health discipline & surgery alerts:'}
        </Text>

        {/* 9.1 Classical 7/27 Quotients */}
        <Text style={styles.subSectionTitle}>
          {isHi ? '१. शास्त्रीय आयु लब्धि सूत्र (Quotient Ages: Sum × 7 ÷ 27)' : '1. Classical Quotient Formulas (Sum × 7 ÷ 27)'}
        </Text>

        <View style={styles.quotientList}>
          {misfortuneYears.quotientCalculations.map(item => {
            const isSurgery = item.afflictionType === 'SURGERY_TRAUMA' || item.afflictionType === 'VITALITY_CRISIS';
            return (
              <View
                key={item.id}
                style={[
                  styles.quotientCard,
                  isSurgery && { borderLeftColor: '#D84315', borderLeftWidth: 4 }
                ]}
              >
                <View style={styles.quotientHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.quotientTitle}>
                      {isHi ? item.titleHi : isGu ? item.titleGu : item.titleEn}
                    </Text>
                    <Text style={styles.quotientEntitiesSub}>
                      {item.fromEntity} ➔ {item.toEntity} (Houses: {item.housesIncluded.join(', ')})
                    </Text>
                  </View>

                  <View style={styles.quotientAgeBadge}>
                    <Text style={styles.quotientAgeText}>
                      {item.quotientAge} {isHi ? 'वर्ष' : 'Yrs'}
                    </Text>
                    <Text style={styles.quotientAgeSub}>
                      ({item.exactAgeStr})
                    </Text>
                  </View>
                </View>

                <View style={styles.quotientFormulaBox}>
                  <Text style={styles.quotientFormulaText}>
                    📐 {item.formulaStr}
                  </Text>
                </View>

                <Text style={styles.quotientSignification}>
                  {isHi ? item.significationHi : isGu ? item.significationGu : item.significationEn}
                </Text>
              </View>
            );
          })}
        </View>

        {/* 9.2 Malefic House Occupancy Bindu Ages */}
        <Text style={[styles.subSectionTitle, { marginTop: 14 }]}>
          {isHi ? '२. पापी ग्रह स्थित भाव बिंदु आयु (Malefic House Bindu Ages)' : '2. Malefic House Bindu Ages'}
        </Text>
        <Text style={styles.subSectionExplanation}>
          {isHi
            ? 'राहु, मंगल व शनि जिस भाव में स्थित हैं, उस भाव के कुल बिंदु आयु के उस वर्ष में विशेष प्रभाव दर्शाते हैं:'
            : 'The total bindus in the houses occupied by Rahu, Mars, and Saturn indicate critical years for specific tests:'}
        </Text>

        <View style={styles.maleficList}>
          {misfortuneYears.maleficHouseAges.map(item => (
            <View key={item.planetEn} style={styles.maleficCard}>
              <View style={styles.maleficHeaderRow}>
                <View style={styles.maleficPlanetCol}>
                  <Text style={styles.maleficSymbol}>{item.symbol}</Text>
                  <View>
                    <Text style={styles.maleficPlanetTitle}>
                      {isHi ? item.planetHi : isGu ? item.planetGu : item.planetEn}
                    </Text>
                    <Text style={styles.maleficHouseSub}>
                      {isHi ? `भाव ${item.houseNumber} (${item.rashiNameHi})` : `House ${item.houseNumber} (${item.rashiNameEn.split(' ')[0]})`}
                    </Text>
                  </View>
                </View>

                <View style={styles.maleficAgeBadge}>
                  <Text style={styles.maleficAgeText}>
                    {item.age} {isHi ? 'वर्ष की आयु' : isGu ? 'વર્ષની વય' : 'Years Age'}
                  </Text>
                  <Text style={styles.maleficPointsSub}>
                    ({item.savPoints} Bindus)
                  </Text>
                </View>
              </View>

              <Text style={styles.maleficThreatType}>
                ⚡ <Text style={{ fontWeight: '700' }}>{isHi ? 'संभावित प्रभाव: ' : 'Sensitivity: '}</Text>
                {isHi ? item.threatTypeHi : isGu ? item.threatTypeGu : item.threatTypeEn}
              </Text>
              <Text style={styles.maleficWarningText}>
                {isHi ? item.warningHi : isGu ? item.warningGu : item.warningEn}
              </Text>
            </View>
          ))}
        </View>

        {/* 9.3 Remedial Measures */}
        <View style={styles.remedyBox}>
          <View style={styles.remedyHeaderRow}>
            <Text style={styles.remedyEmoji}>🛡️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.remedyTitle}>
                {isHi ? 'शास्त्रीय सुरक्षा एवं निवारक उपाय (Classical Remedies)' : 'Classical Protective Remedies'}
              </Text>
              <Text style={styles.remedySub}>
                {isHi ? 'संवेदनशील आयु वर्षों में अनिष्ट शांति एवं स्वास्थ्य रक्षण हेतु:' : 'Proactive lifestyle & spiritual protections during sensitive windows:'}
              </Text>
            </View>
          </View>

          <View style={styles.remedyList}>
            {(isHi ? misfortuneYears.remedialTipsHi : isGu ? misfortuneYears.remedialTipsGu : misfortuneYears.remedialTipsEn).map((tip, idx) => (
              <View key={idx} style={styles.remedyItemRow}>
                <Text style={styles.remedyBullet}>•</Text>
                <Text style={styles.remedyItemText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
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
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cardSectionEmoji: {
    fontSize: 22,
  },
  fruitfulDirectionBanner: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFD54F',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  fruitfulBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  fruitfulCrownEmoji: {
    fontSize: 18,
  },
  fruitfulBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E65100',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fruitfulSentenceText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#3E2723',
    fontWeight: '600',
  },
  directionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  directionItemBox: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
  },
  directionItemBoxBest: {
    backgroundColor: '#E8F5E9',
    borderColor: '#81C784',
    borderWidth: 1.5,
  },
  directionItemBoxVuln: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFB74D',
  },
  directionItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  directionName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212121',
  },
  bestPill: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  bestPillText: {
    fontSize: 9.5,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  directionFormula: {
    fontSize: 10.5,
    color: '#757575',
    marginBottom: 4,
  },
  directionPtsText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A237E',
  },
  ptsUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: '#616161',
  },
  vastuBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  vastuHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#424242',
    marginBottom: 2,
  },
  vastuText: {
    fontSize: 11.5,
    lineHeight: 16,
    color: '#616161',
  },
  trikonaList: {
    gap: 8,
  },
  trikonaCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  trikonaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  trikonaName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212121',
  },
  trikonaMeta: {
    fontSize: 11,
    color: '#757575',
    marginTop: 1,
  },
  trikonaBadge: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  trikonaPtsNum: {
    fontSize: 14,
    fontWeight: '800',
  },
  trikonaPtsLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  trikonaDesc: {
    fontSize: 11.5,
    color: '#424242',
    lineHeight: 16,
  },
  sadeSatiBanner: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  sadeSatiBannerTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: 4,
  },
  sadeSatiBannerDesc: {
    fontSize: 11.5,
    lineHeight: 16.5,
    color: '#37474F',
  },
  dhaiyaList: {
    gap: 8,
  },
  dhaiyaCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  dhaiyaHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dhaiyaTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#212121',
  },
  dhaiyaSub: {
    fontSize: 11,
    color: '#757575',
    marginTop: 1,
  },
  dhaiyaPillRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dhaiyaSavPill: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: 'center',
  },
  dhaiyaSavPillNum: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1565C0',
  },
  dhaiyaSavPillLabel: {
    fontSize: 9,
    color: '#1565C0',
    fontWeight: '600',
  },
  dhaiyaBavPill: {
    backgroundColor: '#EDE7F6',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: 'center',
  },
  dhaiyaBavPillNum: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4A148C',
  },
  dhaiyaBavPillLabel: {
    fontSize: 9,
    color: '#4A148C',
    fontWeight: '600',
  },
  verticalBox: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  verticalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  verticalIcon: {
    fontSize: 18,
  },
  verticalTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212121',
  },
  verticalCompareSub: {
    fontSize: 11,
    color: '#757575',
  },
  verticalDesc: {
    fontSize: 11.5,
    lineHeight: 16.5,
    color: '#424242',
    marginTop: 2,
  },
  quantumBox: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
  },
  quantumHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  quantumIcon: {
    fontSize: 15,
  },
  quantumTitle: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  quantumDesc: {
    fontSize: 11.5,
    lineHeight: 16,
    color: '#37474F',
  },
  noQuantumBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F1F8E9',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#C5E1A5',
  },
  noQuantumEmoji: {
    fontSize: 20,
  },
  noQuantumText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16.5,
    color: '#33691E',
  },
  eighthFromList: {
    gap: 8,
  },
  eighthFromCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  eighthFromHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  eighthFromTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#212121',
  },
  eighthFromVulnSub: {
    fontSize: 11,
    color: '#757575',
    marginTop: 1,
  },
  stabilityBadge: {
    alignItems: 'flex-end',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stabilityBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  stabilityDeltaText: {
    fontSize: 10,
    color: '#616161',
    fontWeight: '600',
  },
  destabFactorText: {
    fontSize: 11.5,
    lineHeight: 16,
    color: '#C62828',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 11.5,
    lineHeight: 16,
    color: '#2E7D32',
  },

  // Tradition Toggle Styles
  traditionToggleWrapper: {
    backgroundColor: '#FFF9E6',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  traditionToggleHeader: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#5D4037',
    marginBottom: 8,
  },
  traditionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  traditionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D7CCC8',
  },
  traditionBtnActive: {
    backgroundColor: '#3E1019',
    borderColor: '#FFD700',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  traditionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5D4037',
  },
  traditionBtnTextActive: {
    color: '#FFD700',
  },
  traditionActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    marginLeft: 6,
  },
  traditionExplanationBox: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#FFE082',
  },
  traditionExplanationText: {
    fontSize: 11,
    color: '#6D4C41',
    lineHeight: 15,
  },

  // 7. Three Parts of Life Styles
  goldenPhaseBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#FFC107',
    marginBottom: 12,
    gap: 10,
  },
  goldenPhaseEmoji: {
    fontSize: 22,
  },
  goldenPhaseTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B78103',
    lineHeight: 18,
  },
  goldenPhaseCounsel: {
    fontSize: 11.5,
    color: '#5D4037',
    lineHeight: 16.5,
    marginTop: 4,
  },
  methodCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#212121',
  },
  methodSub: {
    fontSize: 11,
    color: '#616161',
    marginTop: 2,
    marginBottom: 10,
    lineHeight: 15,
  },
  partsList: {
    gap: 8,
  },
  partCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  partTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  partTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#212121',
  },
  partBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  partBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '700',
  },
  partSpanSub: {
    fontSize: 10.5,
    color: '#757575',
    marginTop: 2,
  },
  partPointsCol: {
    alignItems: 'flex-end',
  },
  partPointsVal: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#212121',
  },
  partBenchmarkText: {
    fontSize: 10,
    color: '#757575',
  },
  partProgressBarBg: {
    height: 5,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    marginVertical: 6,
    overflow: 'hidden',
  },
  partProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  partDesc: {
    fontSize: 11,
    color: '#424242',
    lineHeight: 15.5,
  },

  // 8. Material vs Spiritual Nature Styles
  natureVerdictBox: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  natureVerdictTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#212121',
  },
  natureVerdictSub: {
    fontSize: 11.5,
    color: '#555555',
    marginTop: 3,
    lineHeight: 16,
    fontWeight: '600',
  },
  natureVerdictDesc: {
    fontSize: 11.5,
    color: '#333333',
    lineHeight: 16.5,
    marginTop: 6,
  },
  natureProgressContainer: {
    marginBottom: 12,
  },
  natureSplitProgressBg: {
    height: 10,
    flexDirection: 'row',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  natureSplitProgressLeft: {
    height: '100%',
    backgroundColor: '#2E7D32',
  },
  natureSplitProgressRight: {
    height: '100%',
    backgroundColor: '#E65100',
  },
  natureSplitLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  natureSplitLabel: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  dualNatureRow: {
    gap: 8,
  },
  natureCard: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
  },
  natureCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  natureCardEmoji: {
    fontSize: 18,
  },
  natureCardTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  natureCardPts: {
    fontSize: 11,
    fontWeight: '700',
    color: '#424242',
  },
  natureCardHouses: {
    fontSize: 11,
    color: '#616161',
    marginBottom: 4,
  },
  natureCardSig: {
    fontSize: 11,
    color: '#424242',
    lineHeight: 15.5,
  },

  // 9. Misfortune Years Styles
  subSectionTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#212121',
    marginBottom: 3,
  },
  subSectionExplanation: {
    fontSize: 11,
    color: '#616161',
    lineHeight: 15,
    marginBottom: 8,
  },
  quotientList: {
    gap: 8,
    marginTop: 4,
  },
  quotientCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quotientHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  quotientTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#212121',
  },
  quotientEntitiesSub: {
    fontSize: 10.5,
    color: '#757575',
    marginTop: 1,
  },
  quotientAgeBadge: {
    backgroundColor: '#3E1019',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: 'center',
  },
  quotientAgeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '800',
  },
  quotientAgeSub: {
    color: '#FFFFFF',
    fontSize: 9.5,
    opacity: 0.85,
  },
  quotientFormulaBox: {
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginVertical: 5,
  },
  quotientFormulaText: {
    fontSize: 10,
    color: '#424242',
    fontWeight: '600',
  },
  quotientSignification: {
    fontSize: 11,
    color: '#424242',
    lineHeight: 15.5,
  },
  maleficList: {
    gap: 8,
    marginTop: 4,
  },
  maleficCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  maleficHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  maleficPlanetCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  maleficSymbol: {
    fontSize: 18,
  },
  maleficPlanetTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#212121',
  },
  maleficHouseSub: {
    fontSize: 10.5,
    color: '#757575',
  },
  maleficAgeBadge: {
    alignItems: 'flex-end',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EF9A9A',
  },
  maleficAgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B71C1C',
  },
  maleficPointsSub: {
    fontSize: 9.5,
    color: '#757575',
  },
  maleficThreatType: {
    fontSize: 11,
    color: '#C62828',
    marginBottom: 3,
  },
  maleficWarningText: {
    fontSize: 11,
    color: '#424242',
    lineHeight: 15.5,
  },
  remedyBox: {
    marginTop: 14,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#81C784',
  },
  remedyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  remedyEmoji: {
    fontSize: 20,
  },
  remedyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1B5E20',
  },
  remedySub: {
    fontSize: 11,
    color: '#2E7D32',
  },
  remedyList: {
    gap: 6,
  },
  remedyItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  remedyBullet: {
    fontSize: 14,
    color: '#1B5E20',
    lineHeight: 16,
  },
  remedyItemText: {
    flex: 1,
    fontSize: 11,
    color: '#1B5E20',
    lineHeight: 16,
  },
});

