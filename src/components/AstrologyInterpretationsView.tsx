import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { KundaliResult } from '../engine/kundaliEngine';
import { evaluateVedicRules, EvaluatedVedicReport } from '../engine/vedicAstrologyRules';
import { evaluateLalKitabRules, EvaluatedLalKitabReport } from '../engine/lalKitabAstrologyRules';
import { evaluateNakshatraTattva } from '../engine/nakshatraTattvaEngine';
import { evaluateBirthDashaEnvironment } from '../engine/birthDashaEnvironmentEngine';
import { evaluateNakshatraPadaSynergy } from '../engine/nakshatraPadaSynergyEngine';

interface AstrologyInterpretationsViewProps {
  kundali: KundaliResult;
}

export const AstrologyInterpretationsView: React.FC<AstrologyInterpretationsViewProps> = ({ kundali }) => {
  const { language } = useLanguage();
  const [mainSystemTab, setMainSystemTab] = useState<'VEDIC' | 'LAL_KITAB'>('VEDIC');
  const [vedicSubTab, setVedicSubTab] = useState<'DASHA_ENV' | 'TATTVA' | 'HEALTH' | 'CAREER' | 'RELATIONSHIPS' | 'PLANET' | 'HOUSE'>('DASHA_ENV');
  const [selectedPlanetKey, setSelectedPlanetKey] = useState<string>('Surya (Sun)');
  const [selectedHouseNum, setSelectedHouseNum] = useState<number>(1);

  const vedicReport: EvaluatedVedicReport = evaluateVedicRules(kundali);
  const lalKitabReport: EvaluatedLalKitabReport = evaluateLalKitabRules(kundali);
  const tattvaAnalysis = evaluateNakshatraTattva(kundali.particulars.bornNakshatra);
  const dashaEnvPrediction = evaluateBirthDashaEnvironment(kundali.particulars.bornNakshatra);
  const nakshatraSynergy = evaluateNakshatraPadaSynergy(
    kundali.particulars.bornNakshatra,
    kundali.particulars.bornPada,
    kundali.lagnaRashi
  );

  const getText = (textMap?: Record<string, any>, fallback: string = ''): string => {
    if (!textMap) return fallback;
    if (textMap[language]) return textMap[language];
    if (language === 'hinglish') return textMap['hi'] || textMap['en'] || fallback;
    if (language === 'mr') return textMap['hi'] || textMap['en'] || fallback;
    return textMap['en'] || textMap['hi'] || fallback;
  };

  return (
    <View style={styles.container}>
      {/* Main Astrology System Switcher (Vedic vs Lal Kitab) */}
      <View style={styles.systemSwitcherBar}>
        <TouchableOpacity
          style={[styles.systemBtn, mainSystemTab === 'VEDIC' && styles.systemBtnActive]}
          onPress={() => setMainSystemTab('VEDIC')}
          activeOpacity={0.8}
        >
          <Text style={[styles.systemBtnText, mainSystemTab === 'VEDIC' && styles.systemBtnTextActive]}>
            🕉️ Vedic / BPHS Analysis
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.systemBtn, mainSystemTab === 'LAL_KITAB' && styles.systemBtnActive]}
          onPress={() => setMainSystemTab('LAL_KITAB')}
          activeOpacity={0.8}
        >
          <Text style={[styles.systemBtnText, mainSystemTab === 'LAL_KITAB' && styles.systemBtnTextActive]}>
            📕 Lal Kitab Analysis
          </Text>
        </TouchableOpacity>
      </View>

      {/* SYSTEM 1: VEDIC / BPHS SYSTEM */}
      {mainSystemTab === 'VEDIC' && (
        <View>
          {/* Sub-Category Navigation Bar */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subTabNavScroll}>
            <TouchableOpacity
              style={[styles.subTabBtn, vedicSubTab === 'DASHA_ENV' && styles.subTabBtnActive]}
              onPress={() => setVedicSubTab('DASHA_ENV')}
            >
              <Text style={[styles.subTabText, vedicSubTab === 'DASHA_ENV' && styles.subTabTextActive]}>🏠 1st Dasha Environment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subTabBtn, vedicSubTab === 'TATTVA' && styles.subTabBtnActive]}
              onPress={() => setVedicSubTab('TATTVA')}
            >
              <Text style={[styles.subTabText, vedicSubTab === 'TATTVA' && styles.subTabTextActive]}>🌊 Nakshatra Tattva (5 Elements)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subTabBtn, vedicSubTab === 'HEALTH' && styles.subTabBtnActive]}
              onPress={() => setVedicSubTab('HEALTH')}
            >
              <Text style={[styles.subTabText, vedicSubTab === 'HEALTH' && styles.subTabTextActive]}>🏥 Health</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subTabBtn, vedicSubTab === 'CAREER' && styles.subTabBtnActive]}
              onPress={() => setVedicSubTab('CAREER')}
            >
              <Text style={[styles.subTabText, vedicSubTab === 'CAREER' && styles.subTabTextActive]}>💼 Career & Wealth</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subTabBtn, vedicSubTab === 'RELATIONSHIPS' && styles.subTabBtnActive]}
              onPress={() => setVedicSubTab('RELATIONSHIPS')}
            >
              <Text style={[styles.subTabText, vedicSubTab === 'RELATIONSHIPS' && styles.subTabTextActive]}>❤️ Relationships</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subTabBtn, vedicSubTab === 'PLANET' && styles.subTabBtnActive]}
              onPress={() => setVedicSubTab('PLANET')}
            >
              <Text style={[styles.subTabText, vedicSubTab === 'PLANET' && styles.subTabTextActive]}>🪐 Planet-Wise</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.subTabBtn, vedicSubTab === 'HOUSE' && styles.subTabBtnActive]}
              onPress={() => setVedicSubTab('HOUSE')}
            >
              <Text style={[styles.subTabText, vedicSubTab === 'HOUSE' && styles.subTabTextActive]}>🏠 House-Wise</Text>
            </TouchableOpacity>
          </ScrollView>



          {/* Sub-Tab Content: 1ST DASHA HOUSEHOLD ENVIRONMENT PREDICTOR */}
          {vedicSubTab === 'DASHA_ENV' && (
            <View style={styles.reportCard}>
              <View style={styles.cardHeaderBox}>
                <Text style={styles.cardHeaderTitle}>{getText(dashaEnvPrediction.householdTitle)}</Text>
                <Text style={styles.cardHeaderSub}>
                  Birth Nakshatra: {kundali.particulars.bornNakshatra} • 1st Dasha Lord: {dashaEnvPrediction.dashaLord}
                </Text>
                <Text style={[styles.cardHeaderSub, { fontSize: 12, opacity: 0.9, marginTop: 2 }]}>
                  ✨ Nakshatra Portals: {dashaEnvPrediction.nakshatraPortals}
                </Text>
              </View>

              {/* Theoretical Baseline */}
              {dashaEnvPrediction.theoreticalBaseline && (
                <View style={[styles.ruleItemCard, { backgroundColor: '#FAF5EE', borderColor: '#E0D0B8', borderWidth: 1 }]}>
                  <Text style={[styles.ruleTitleText, { color: Colors.maroon }]}>📜 Theoretical & Karmic Baseline</Text>
                  <Text style={styles.ruleDescText}>{getText(dashaEnvPrediction.theoreticalBaseline)}</Text>
                </View>
              )}

              {/* Socio-Familial Ecology */}
              <View style={styles.ruleItemCard}>
                <Text style={styles.ruleTitleText}>🏡 Socio-Familial Ecology & Domestic Environment</Text>
                <Text style={styles.ruleDescText}>{getText(dashaEnvPrediction.familyEnvironment)}</Text>
              </View>

              {/* Parental Vocations */}
              <View style={styles.ruleItemCard}>
                <Text style={styles.ruleTitleText}>🏛️ Broad Parental & Familial Vocational Spheres</Text>
                <Text style={styles.ruleDescText}>{getText(dashaEnvPrediction.fatherAndUnclesCareer)}</Text>
              </View>

              {/* Childhood Atmosphere */}
              <View style={styles.ruleItemCard}>
                <Text style={styles.ruleTitleText}>✨ Psycho-Emotional Climate & Home Atmosphere</Text>
                <Text style={styles.ruleDescText}>{getText(dashaEnvPrediction.childhoodAtmosphere)}</Text>
                <Text style={[styles.ruleDescText, { marginTop: 6, fontWeight: '600', color: '#1B5E20' }]}>
                  💡 Lifelong Blessing: {getText(dashaEnvPrediction.behavioralBlessings)}
                </Text>
              </View>

              {/* Vulnerabilities & Afflictions */}
              {dashaEnvPrediction.vulnerabilities && (
                <View style={[styles.ruleItemCard, { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2', borderWidth: 1 }]}>
                  <Text style={[styles.ruleTitleText, { color: '#B71C1C' }]}>⚠️ Potential Vulnerabilities & Severe Afflictions</Text>
                  <Text style={[styles.ruleDescText, { color: '#4E342E' }]}>{getText(dashaEnvPrediction.vulnerabilities)}</Text>
                </View>
              )}
            </View>
          )}

          {/* Sub-Tab Content: NAKSHATRA TATTVA (5 ELEMENTS & 3-TIER PADA SYNERGY SYSTEM) */}
          {vedicSubTab === 'TATTVA' && (
            <View style={styles.reportCard}>
              <View style={styles.cardHeaderBox}>
                <Text style={styles.cardHeaderTitle}>🌊 Janma Nakshatra Tattva & Pancha Mahabhuta</Text>
                <Text style={styles.cardHeaderSub}>Nakshatra: {tattvaAnalysis.detail.nakshatraName} • Element: {tattvaAnalysis.detail.elementSymbol}</Text>
              </View>

              {/* 3-Tier Micro Dissection Card */}
              <View style={[styles.ruleItemCard, { backgroundColor: '#F3E5F5', borderColor: '#CE93D8', borderWidth: 1 }]}>
                <Text style={[styles.ruleTitleText, { color: '#4A148C' }]}>{getText(nakshatraSynergy.synergyTitle)}</Text>
                <Text style={styles.ruleDescText}>• {getText(nakshatraSynergy.layer1Physical)}</Text>
                <Text style={[styles.ruleDescText, { marginTop: 4 }]}>• {getText(nakshatraSynergy.layer2Mental)}</Text>
                <Text style={[styles.ruleDescText, { marginTop: 4 }]}>• {getText(nakshatraSynergy.layer3Destiny)}</Text>

                <View style={{ marginTop: 8, padding: 8, backgroundColor: '#FFFFFF', borderRadius: 6 }}>
                  <Text style={{ fontWeight: '700', color: '#4A148C' }}>👑 {getText(nakshatraSynergy.trineSynergySummary)}</Text>
                  <Text style={{ marginTop: 4, fontSize: 13, color: '#333333' }}>💼 <Text style={{ fontWeight: '600' }}>Executive Context:</Text> {getText(nakshatraSynergy.careerContext)}</Text>
                  <Text style={{ marginTop: 4, fontSize: 13, color: '#333333' }}>🧠 <Text style={{ fontWeight: '600' }}>Mindset Context:</Text> {getText(nakshatraSynergy.mindsetContext)}</Text>
                  <Text style={{ marginTop: 4, fontSize: 13, color: '#333333' }}>🛡️ <Text style={{ fontWeight: '600' }}>Divine Protection:</Text> {getText(nakshatraSynergy.lifeProtectionContext)}</Text>
                </View>
              </View>

              <View style={styles.ruleItemCard}>
                <Text style={styles.ruleTitleText}> Elemental Classification</Text>
                <Text style={styles.ruleDescText}>{getText(tattvaAnalysis.detail.description)}</Text>
              </View>

              <View style={styles.ruleItemCard}>
                <Text style={styles.ruleTitleText}>📜 Classical Matrix Relationships</Text>
                <Text style={styles.ruleDescText}>• Friendly Elements (Mitra): {tattvaAnalysis.detail.friendlyElements.join(', ')}</Text>
                <Text style={styles.ruleDescText}>• Neutral Elements (Sama): {tattvaAnalysis.detail.neutralElements.join(', ')}</Text>
                <Text style={styles.ruleDescText}>• Inimical Elements (Shatru): {tattvaAnalysis.detail.inimicalElements.length > 0 ? tattvaAnalysis.detail.inimicalElements.join(', ') : 'None (Akasha Ether Void)'}</Text>
                <Text style={[styles.ruleDescText, { marginTop: 6 }]}>💡 Dynamic Interaction: {getText(tattvaAnalysis.detail.dynamicInteraction)}</Text>
              </View>
            </View>
          )}

          {/* Sub-Tab Content 2: HEALTH & WELLBEING */}
          {vedicSubTab === 'HEALTH' && (
            <View style={styles.reportCard}>
              <View style={styles.cardHeaderBox}>
                <Text style={styles.cardHeaderTitle}>🏥 Health, Vitality & Disease Resistance</Text>
              </View>

              {vedicReport.health.length > 0 ? (
                vedicReport.health.map(rule => (
                  <View key={rule.id} style={styles.ruleItemCard}>
                    <Text style={styles.ruleTitleText}>{getText(rule.title)}</Text>
                    <Text style={styles.ruleDescText}>{getText(rule.description)}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Health details computed from 1st, 6th and 8th House placements.</Text>
              )}
            </View>
          )}

          {/* Sub-Tab Content 3: CAREER & WEALTH */}
          {vedicSubTab === 'CAREER' && (
            <View style={styles.reportCard}>
              <View style={styles.cardHeaderBox}>
                <Text style={styles.cardHeaderTitle}>💼 Career, Profession & Wealth (Dhana Yoga)</Text>
              </View>

              {vedicReport.career.length > 0 ? (
                vedicReport.career.map(rule => (
                  <View key={rule.id} style={styles.ruleItemCard}>
                    <Text style={styles.ruleTitleText}>{getText(rule.title)}</Text>
                    <Text style={styles.ruleDescText}>{getText(rule.description)}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Career & Dhana Yoga calculations active for 2nd, 10th & 11th Houses.</Text>
              )}
            </View>
          )}

          {/* Sub-Tab Content 4: RELATIONSHIPS & FAMILY */}
          {vedicSubTab === 'RELATIONSHIPS' && (
            <View style={styles.reportCard}>
              <View style={styles.cardHeaderBox}>
                <Text style={styles.cardHeaderTitle}>❤️ Marriage, Partnerships & Family</Text>
              </View>

              {vedicReport.relationships.length > 0 ? (
                vedicReport.relationships.map(rule => (
                  <View key={rule.id} style={styles.ruleItemCard}>
                    <Text style={styles.ruleTitleText}>{getText(rule.title)}</Text>
                    <Text style={styles.ruleDescText}>{getText(rule.description)}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Relationship indicators evaluated from 7th House & Venus.</Text>
              )}
            </View>
          )}

          {/* Sub-Tab Content 5: PLANET-WISE ANALYSIS */}
          {vedicSubTab === 'PLANET' && (
            <View style={styles.reportCard}>
              <Text style={styles.cardHeaderTitle}>🪐 Navagraha Planet-Wise Detailed Analysis</Text>

              {/* Planet Selector Pills */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
                {kundali.planets.map(p => (
                  <TouchableOpacity
                    key={p.name}
                    style={[styles.planetPill, selectedPlanetKey === p.name && styles.planetPillActive]}
                    onPress={() => setSelectedPlanetKey(p.name)}
                  >
                    <Text style={[styles.planetPillText, selectedPlanetKey === p.name && styles.planetPillTextActive]}>
                      {p.symbol} {p.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Selected Planet Details */}
              {(() => {
                const targetPlanet = kundali.planets.find(p => p.name === selectedPlanetKey);
                if (!targetPlanet) return null;
                const rulesForPlanet = vedicReport.planetRulesMap[targetPlanet.name] || [];

                return (
                  <View style={styles.planetDetailCardBox}>
                    <View style={styles.planetDetailHeader}>
                      <Text style={styles.planetDetailTitle}>{targetPlanet.symbol} {targetPlanet.name}</Text>
                      <Text style={styles.planetDetailBadge}>{targetPlanet.rashiName} • House {targetPlanet.house}</Text>
                    </View>

                    <Text style={styles.planetDetailSub}>
                      Nakshatra: {targetPlanet.nakshatraName} (Pada {targetPlanet.pada}) • Degree: {targetPlanet.degreeStr} {targetPlanet.isRetrograde ? '(Retrograde)' : ''}
                    </Text>

                    {rulesForPlanet.map(rule => (
                      <View key={rule.id} style={styles.ruleItemCard}>
                        <Text style={styles.ruleTitleText}>{getText(rule.title)}</Text>
                        <Text style={styles.ruleDescText}>{getText(rule.description)}</Text>

                        {/* Past-Life Karma */}
                        {rule.pastLifeKarma && (
                          <View style={styles.karmaBox}>
                            <Text style={styles.karmaBoxTitle}>📜 Past-Life Karma / Habit:</Text>
                            <Text style={styles.karmaBoxText}>{getText(rule.pastLifeKarma)}</Text>
                          </View>
                        )}

                        {/* Life Challenges & Themes */}
                        {rule.lifeChallenges && (
                          <View style={styles.challengeBox}>
                            <Text style={styles.challengeBoxTitle}>⚡ Life Challenges & Themes:</Text>
                            <Text style={styles.challengeBoxText}>{getText(rule.lifeChallenges)}</Text>
                          </View>
                        )}

                        {/* Physical Remedy & Behavioral Alignment */}
                        {rule.physicalRemedy && (
                          <View style={styles.remedyBox}>
                            <Text style={styles.remedyBoxTitle}>🧘 Physical Remedy & Behavioral Alignment:</Text>
                            <Text style={styles.remedyItemText}>{getText(rule.physicalRemedy)}</Text>
                          </View>
                        )}
                      </View>
                    ))}

                    {rulesForPlanet.length === 0 && (
                      <Text style={styles.emptyText}>
                        {targetPlanet.name} in House {targetPlanet.house} ({targetPlanet.rashiName}). This planet shapes your {targetPlanet.house}th house significations.
                      </Text>
                    )}
                  </View>
                );
              })()}
            </View>
          )}

          {/* Sub-Tab Content 6: HOUSE-WISE ANALYSIS */}
          {vedicSubTab === 'HOUSE' && (
            <View style={styles.reportCard}>
              <Text style={styles.cardHeaderTitle}>🏠 12 Houses (Bhavas) Detailed Placement</Text>

              {/* House Numbers Grid 1-12 */}
              <View style={styles.houseNumGrid}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(hNum => (
                  <TouchableOpacity
                    key={hNum}
                    style={[styles.houseGridBtn, selectedHouseNum === hNum && styles.houseGridBtnActive]}
                    onPress={() => setSelectedHouseNum(hNum)}
                  >
                    <Text style={[styles.houseGridText, selectedHouseNum === hNum && styles.houseGridTextActive]}>
                      H{hNum}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Selected House Details */}
              {(() => {
                const targetHouse = kundali.houseDetails.find(h => h.houseNumber === selectedHouseNum);
                if (!targetHouse) return null;

                return (
                  <View style={styles.planetDetailCardBox}>
                    <Text style={styles.planetDetailTitle}>House {targetHouse.houseNumber}: {targetHouse.rashiName}</Text>
                    <Text style={styles.planetDetailSub}>Rashi Lord: {targetHouse.rashiLord}</Text>
                    <Text style={styles.planetDetailSub}>Occupying Planets: {targetHouse.planets.length > 0 ? targetHouse.planets.join(', ') : 'None'}</Text>
                    <Text style={[styles.planetDetailSub, { marginTop: 4, fontStyle: 'italic' }]}>💡 Significations: {targetHouse.significations}</Text>
                  </View>
                );
              })()}
            </View>
          )}
        </View>
      )}

      {/* SYSTEM 2: LAL KITAB SYSTEM */}
      {mainSystemTab === 'LAL_KITAB' && (
        <View style={styles.reportCard}>
          <View style={styles.cardHeaderBox}>
            <Text style={styles.cardHeaderTitle}>📕 Lal Kitab Rules & Remedial Astrological System</Text>
            <Text style={styles.cardHeaderSub}>Unique Aspect Laws (Drishti) & Pukka Ghar Remedies</Text>
          </View>

          {/* Lal Kitab Applied Rules */}
          {lalKitabReport.appliedRules.map(rule => (
            <View key={rule.id} style={styles.lalKitabRuleCard}>
              <Text style={styles.ruleTitleText}>{getText(rule.title)}</Text>
              <Text style={styles.ruleDescText}>{getText(rule.description)}</Text>

              {/* Maternal / Family Impact Highlight */}
              {rule.maternalImpact && (
                <View style={styles.maternalAlertCard}>
                  <Text style={styles.maternalAlertText}>{getText(rule.maternalImpact)}</Text>
                </View>
              )}

              {/* Lal Kitab Totke & Upay Remedies */}
              {rule.remedies && (
                <View style={styles.remedyBox}>
                  <Text style={styles.remedyBoxTitle}>🌸 Lal Kitab Remedies (लाल किताब उपाय):</Text>
                  {(rule.remedies[language] || rule.remedies['en'] || rule.remedies['hi'] || []).map((rem, idx) => (
                    <Text key={idx} style={styles.remedyItemText}>• {rem}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}

          {/* Lal Kitab Aspects Section */}
          <View style={[styles.planetDetailCardBox, { marginTop: 14 }]}>
            <Text style={styles.cardHeaderTitle}>👁️ Lal Kitab House Drishti Laws (दृष्टि नियम)</Text>
            {lalKitabReport.aspects.map((asp, idx) => (
              <View key={idx} style={styles.aspectRow}>
                <Text style={styles.aspectHeader}>House {asp.fromHouse} ➔ House {asp.toHouse} ({asp.percentage}% Aspect)</Text>
                <Text style={styles.aspectDesc}>{getText(asp.description)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  systemSwitcherBar: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 14,
    padding: 4,
    marginBottom: 12,
  },
  systemBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  systemBtnActive: {
    backgroundColor: Colors.maroon,
  },
  systemBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  systemBtnTextActive: {
    color: '#FFD700',
  },
  subTabNavScroll: {
    marginBottom: 12,
  },
  subTabBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  subTabBtnActive: {
    backgroundColor: '#4A0E17',
    borderColor: '#FFD700',
  },
  subTabText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  subTabTextActive: {
    color: '#FFD700',
  },
  reportCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeaderBox: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 8,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  cardHeaderSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  ruleItemCard: {
    backgroundColor: '#FAF5EE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0E0D0',
  },
  ruleTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.maroon,
    marginBottom: 4,
  },
  ruleDescText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  emptyText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
    paddingVertical: 10,
  },
  planetPill: {
    backgroundColor: '#FAF5EE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 6,
  },
  planetPillActive: {
    backgroundColor: Colors.maroon,
    borderColor: '#FFD700',
  },
  planetPillText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  planetPillTextActive: {
    color: '#FFD700',
  },
  planetDetailCardBox: {
    backgroundColor: '#FAF5EE',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E0D0',
    marginTop: 6,
  },
  planetDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  planetDetailTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  planetDetailBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  planetDetailSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  houseNumGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 10,
  },
  houseGridBtn: {
    width: '14%',
    backgroundColor: '#FAF5EE',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  houseGridBtnActive: {
    backgroundColor: Colors.maroon,
    borderColor: '#FFD700',
  },
  houseGridText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  houseGridTextActive: {
    color: '#FFD700',
  },
  lalKitabRuleCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#FFE082',
  },
  maternalAlertCard: {
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    marginTop: 8,
  },
  maternalAlertText: {
    fontSize: 11,
    color: '#C62828',
    fontWeight: '600',
  },
  karmaBox: {
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    marginTop: 8,
  },
  karmaBoxTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4,
  },
  karmaBoxText: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  challengeBox: {
    backgroundColor: '#F3E5F5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E1BEE7',
    marginTop: 8,
  },
  challengeBoxTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6A1B9A',
    marginBottom: 4,
  },
  challengeBoxText: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  remedyBox: {
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginTop: 8,
  },
  remedyBoxTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  remedyItemText: {
    fontSize: 11,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  aspectRow: {
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  aspectHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.maroon,
  },
  aspectDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
