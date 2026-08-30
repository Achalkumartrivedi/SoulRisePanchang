import { KundaliResult } from '../engine/kundaliEngine';
import { LanguageCode } from '../types/language';

export interface PersonalShoonyaAnalysis {
  tithiNumber: number;
  dagdhaRashiNames: string[];
  affectedLords: string[];
  planetsInDagdhaSigns: string[];
  isNullified: boolean;
  nullificationReasons: string[];
  statusBannerTitle: string;
  statusBannerBody: string;
  isPurnimaOrAmavasya: boolean;
}

const DAGDHA_RASHI_MAP: Record<number, { rashis: number[]; lords: string[] }> = {
  1: { rashis: [6, 9], lords: ['Venus', 'Saturn'] },      // Libra & Capricorn
  2: { rashis: [8, 11], lords: ['Jupiter'] },              // Sagittarius & Pisces
  3: { rashis: [4, 9], lords: ['Sun', 'Saturn'] },        // Leo & Capricorn
  4: { rashis: [1, 10], lords: ['Venus', 'Saturn'] },     // Taurus & Aquarius
  5: { rashis: [2, 5], lords: ['Mercury'] },              // Gemini & Virgo
  6: { rashis: [0, 4], lords: ['Mars', 'Sun'] },          // Aries & Leo
  7: { rashis: [3, 8], lords: ['Moon', 'Jupiter'] },      // Cancer & Sagittarius
  8: { rashis: [2, 5], lords: ['Mercury'] },              // Gemini & Virgo
  9: { rashis: [3, 4], lords: ['Moon', 'Sun'] },          // Cancer & Leo
  10: { rashis: [4, 7], lords: ['Sun', 'Mars'] },         // Leo & Scorpio
  11: { rashis: [8, 11], lords: ['Jupiter'] },             // Sagittarius & Pisces
  12: { rashis: [6, 9], lords: ['Venus', 'Saturn'] },     // Libra & Capricorn
  13: { rashis: [1, 10], lords: ['Venus', 'Saturn'] },    // Taurus & Aquarius
  14: { rashis: [2, 5, 8, 11], lords: ['Mercury', 'Jupiter'] }, // Gemini, Virgo, Sag, Pisces
  15: { rashis: [], lords: [] },                           // Purnima (None)
  30: { rashis: [], lords: [] }                            // Amavasya (None)
};

const RASHI_NAMES_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export function evaluatePersonalShoonya(
  kundali: KundaliResult,
  tithiNum: number,
  lang: LanguageCode
): PersonalShoonyaAnalysis {
  let key = tithiNum;
  if (key > 15 && key < 30) key = key - 15;
  if (key > 30) key = 30;
  if (key <= 0) key = 1;

  if (key === 15 || key === 30) {
    return {
      tithiNumber: key,
      dagdhaRashiNames: [],
      affectedLords: [],
      planetsInDagdhaSigns: [],
      isNullified: true,
      nullificationReasons: ['No zodiac signs are burnt on Purnima or Amavasya! Full cosmic light is maintained.'],
      statusBannerTitle: '✨ FULL LIGHT TITHI (No Burnt Signs!)',
      statusBannerBody: 'Your birth Tithi carries 100% full cosmic light! No zodiac signs or planets are shadowed in your chart.',
      isPurnimaOrAmavasya: true
    };
  }

  const data = DAGDHA_RASHI_MAP[key] || { rashis: [2, 5], lords: ['Mercury'] };
  const dagdhaRashiNames = data.rashis.map(r => RASHI_NAMES_EN[r]);
  const affectedLords = data.lords;

  // 1. Find which planets sit in the user's Dagdha Rashis
  const planetsInDagdhaSigns: string[] = [];
  kundali.planets.forEach(p => {
    if (data.rashis.includes(p.rashiIndex)) {
      planetsInDagdhaSigns.push(`${p.name} (in ${p.rashiName}, House ${p.house})`);
    }
  });

  // 2. Evaluate Nullification Laws (Dagdha Dosha Bhanga) in the user's specific birth chart
  const nullificationReasons: string[] = [];
  let isNullified = false;

  affectedLords.forEach(lordName => {
    const lordPlanet = kundali.planets.find(p => p.name.toLowerCase() === lordName.toLowerCase());
    if (lordPlanet) {
      // Rule A: Placed in Dusthana house (3rd, 6th, 8th, 12th)
      if ([3, 6, 8, 12].includes(lordPlanet.house)) {
        isNullified = true;
        nullificationReasons.push(
          `Lord ${lordName} is placed in House ${lordPlanet.house} (Dusthana House), which restricts the shadow and neutralizes the Shoonya Dosha!`
        );
      }

      // Rule B: Planet is Retrograde
      if (lordPlanet.isRetrograde) {
        isNullified = true;
        nullificationReasons.push(
          `Lord ${lordName} is Retrograde (वक्री), allowing its cosmic energy to reverse direction and shine straight through the shadow!`
        );
      }

      // Rule C: Conjoined with a malefic (Saturn, Mars, Rahu, Ketu)
      const coPlanets = kundali.planets.filter(
        p => p.house === lordPlanet.house && p.name !== lordPlanet.name
      );
      const maleficCo = coPlanets.find(p => ['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(p.name));
      if (maleficCo) {
        isNullified = true;
        nullificationReasons.push(
          `Lord ${lordName} is conjoined with ${maleficCo.name} in House ${lordPlanet.house}, which neutralizes the Tithi shadow into beneficial energy!`
        );
      }

      // Rule D: Placed in Kendra (1, 4, 7, 10) or Trikona (5, 9) house
      if ([1, 4, 5, 7, 9, 10].includes(lordPlanet.house)) {
        isNullified = true;
        nullificationReasons.push(
          `Lord ${lordName} is positioned in Kendra/Trikona House ${lordPlanet.house}, granting it immense inherent strength to overcome the Tithi shadow!`
        );
      }
    }
  });

  // If no lords meet rules, check if no planets sit in the burnt signs
  if (!isNullified && planetsInDagdhaSigns.length === 0) {
    isNullified = true;
    nullificationReasons.push(
      'No key planets occupy your burnt signs in your birth chart, keeping your core life placements free from shadow!'
    );
  }

  let statusBannerTitle = '';
  let statusBannerBody = '';

  if (isNullified) {
    statusBannerTitle = '🎉 CONGRATULATIONS! Tithi Shoonya is 100% CANCELLED & NULLIFIED!';
    statusBannerBody = `Your birth chart activates the sacred "Dosha Bhanga" rules (${nullificationReasons[0] || 'Chart Exception'}). Your burnt sign energy is transformed into a hidden superpower & financial asset!`;
  } else {
    statusBannerTitle = '⚡ ACTIVE FOCUS ZONE (Hidden Superpower Potential)';
    statusBannerBody = `Your birth Tithi highlights ${dagdhaRashiNames.join(' & ')} as a focus zone. Channeling conscious effort here turns initial delays into your greatest lifelong strength!`;
  }

  return {
    tithiNumber: key,
    dagdhaRashiNames,
    affectedLords,
    planetsInDagdhaSigns,
    isNullified,
    nullificationReasons,
    statusBannerTitle,
    statusBannerBody,
    isPurnimaOrAmavasya: false
  };
}
