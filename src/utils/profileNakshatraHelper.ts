import { calculateBirthKundali } from '../engine/kundaliEngine';
import { ALL_27_NAKSHATRAS } from '../engine/navtaraEngine';
import { convert27to28NakshatraIndex, ALL_28_NAKSHATRAS } from '../engine/kotaChakraEngine';
import { SavedKundaliProfile } from './profileStorage';

export interface ProfileNakshatraResult {
  nakName: string;
  nak27Index: number;
  nak28Index: number;
  moonSignLord: string;
}

const RASHI_LORDS_SHORT = [
  'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
  'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];

/**
 * Calculates the Janma Nakshatra (both 27 and 28 index systems) for a given saved profile.
 */
export function getProfileNakshatraDetails(profile: SavedKundaliProfile): ProfileNakshatraResult {
  try {
    const day = parseInt(profile.dobDay, 10) || 1;
    const month = (parseInt(profile.dobMonth, 10) || 1) - 1;
    const year = parseInt(profile.dobYear, 10) || 1990;
    const dob = new Date(year, month, day);
    const tobH = parseInt(profile.tobHour, 10) || 12;
    const tobM = parseInt(profile.tobMinute, 10) || 0;

    const kundali = calculateBirthKundali(
      profile.name,
      dob,
      tobH,
      tobM,
      profile.cityName || 'Surat',
      profile.lat || 21.1702,
      profile.lng || 72.8311
    );

    const bornNakName = kundali.particulars?.bornNakshatra || 'Ashwini';
    const matched = ALL_27_NAKSHATRAS.find(n =>
      bornNakName.toLowerCase().includes(n.eng.toLowerCase()) ||
      n.eng.toLowerCase().includes(bornNakName.toLowerCase())
    );

    const nak27Index = matched ? matched.index : 1;
    const nak28Index = convert27to28NakshatraIndex(nak27Index);

    const moonPlanet = kundali.planets ? kundali.planets[1] : null;
    const moonRashiIdx = moonPlanet ? moonPlanet.rashiIndex : 0;
    const moonSignLord = RASHI_LORDS_SHORT[moonRashiIdx] || 'Mars';

    return {
      nakName: bornNakName,
      nak27Index,
      nak28Index,
      moonSignLord
    };
  } catch (e) {
    return { nakName: 'Ashwini', nak27Index: 1, nak28Index: 1, moonSignLord: 'Mars' };
  }
}

/**
 * Extracts actual natal planets (with sign, degree, nakshatra & pada) from a saved Kundali profile.
 */
export function getProfileBirthPlanets(profile: SavedKundaliProfile): import('../engine/kotaChakraEngine').PlanetPositionInfo[] {
  try {
    const day = parseInt(profile.dobDay, 10) || 1;
    const month = (parseInt(profile.dobMonth, 10) || 1) - 1;
    const year = parseInt(profile.dobYear, 10) || 1990;
    const dob = new Date(year, month, day);
    const tobH = parseInt(profile.tobHour, 10) || 12;
    const tobM = parseInt(profile.tobMinute, 10) || 0;

    const kundali = calculateBirthKundali(
      profile.name,
      dob,
      tobH,
      tobM,
      profile.cityName || 'Surat',
      profile.lat || 21.1702,
      profile.lng || 72.8311
    );

    const planetShortCodeMap: Record<string, { code: string; isBenefic: boolean; key: string }> = {
      'Surya (Sun)': { code: 'Su', isBenefic: false, key: 'Sun' },
      'Chandra (Moon)': { code: 'Mo', isBenefic: true, key: 'Moon' },
      'Mangala (Mars)': { code: 'Ma', isBenefic: false, key: 'Mars' },
      'Budha (Mercury)': { code: 'Me', isBenefic: true, key: 'Mercury' },
      'Brihaspati (Jupiter)': { code: 'Ju', isBenefic: true, key: 'Jupiter' },
      'Shukra (Venus)': { code: 'Ve', isBenefic: true, key: 'Venus' },
      'Shani (Saturn)': { code: 'Sa', isBenefic: false, key: 'Saturn' },
      'Rahu': { code: 'Ra', isBenefic: false, key: 'Rahu' },
      'Ketu': { code: 'Ke', isBenefic: false, key: 'Ketu' }
    };

    const birthPlanets: import('../engine/kotaChakraEngine').PlanetPositionInfo[] = [];

    // 1. Ascendant (Lagna)
    if (kundali.lagnaRashi) {
      const ascNakName = (kundali.thaiSuryayatra?.naksatraName || 'Swati').toLowerCase().trim();
      const matched27 = ALL_27_NAKSHATRAS.find(n => n.eng.toLowerCase().trim() === ascNakName) ||
                        ALL_27_NAKSHATRAS.find(n => ascNakName.includes(n.eng.toLowerCase()) || n.eng.toLowerCase().includes(ascNakName));
      const nak27Idx = matched27 ? matched27.index : 15;
      const nak28Idx = convert27to28NakshatraIndex(nak27Idx);

      birthPlanets.push({
        planetKey: 'Ascendant',
        nameEng: 'Ascendant',
        nameHin: 'लग्न',
        nameGuj: 'લગ્ન',
        symbol: 'Asc',
        shortCode: 'Asc',
        signEng: kundali.lagnaRashi.split(' ')[0],
        degreeStr: kundali.lagnaDegree || "14° 22'",
        nakshatra28Index: nak28Idx,
        nakshatraName: ALL_28_NAKSHATRAS[nak28Idx - 1].nameEng,
        pada: 1,
        nakLord: ALL_28_NAKSHATRAS[nak28Idx - 1].lord,
        isBenefic: true
      });
    }

    // 2. 9 Planets from Kundli
    if (kundali.planets && Array.isArray(kundali.planets)) {
      kundali.planets.forEach(p => {
        const mapping = planetShortCodeMap[p.name] || { code: p.name.substring(0, 2), isBenefic: true, key: p.name };
        const cleanNakName = (p.nakshatraName || '').toLowerCase().trim();
        const matched27 = ALL_27_NAKSHATRAS.find(n => n.eng.toLowerCase().trim() === cleanNakName) ||
                          ALL_27_NAKSHATRAS.find(n => cleanNakName.includes(n.eng.toLowerCase()) || n.eng.toLowerCase().includes(cleanNakName));
        const nak27Idx = matched27 ? matched27.index : 1;
        const nak28Idx = convert27to28NakshatraIndex(nak27Idx);

        birthPlanets.push({
          planetKey: mapping.key,
          nameEng: p.name.split(' ')[0],
          nameHin: p.hindiName,
          nameGuj: p.hindiName,
          symbol: p.symbol,
          shortCode: mapping.code,
          signEng: p.rashiName.split(' ')[0],
          degreeStr: p.degreeStr,
          nakshatra28Index: nak28Idx,
          nakshatraName: ALL_28_NAKSHATRAS[nak28Idx - 1].nameEng,
          pada: p.pada,
          nakLord: ALL_28_NAKSHATRAS[nak28Idx - 1].lord,
          isBenefic: mapping.isBenefic
        });
      });
    }

    return birthPlanets;
  } catch (e) {
    return [];
  }
}

