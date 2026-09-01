import { CityLocation, ChoghadiyaItem } from '../types/panchang';
import { DEFAULT_CITIES } from '../data/cities';
import { MuhuratSafetyAnalysis } from '../types/reminder';
import { calculateMuhurats, calculateChoghadiya } from './muhuratCalculator';
import { calculatePanchang } from './panchangEngine';

/**
 * Parses time string (e.g. "15:30", "03:30 PM", "8:15 AM") into minutes from midnight (0..1439).
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');
  const numOnly = clean.replace(/(AM|PM)/g, '').trim();
  const parts = numOnly.split(':');
  let h = parseInt(parts[0] || '0', 10);
  const m = parseInt(parts[1] || '0', 10);

  if (isPM && h < 12) h += 12;
  if (isAM && h === 12) h = 0;

  return (h % 24) * 60 + (m % 60);
}

/**
 * Analyzes a chosen date and time slot against Vedic Rahu Kalam, Yamagandam, Gulika Kalam,
 * Choghadiya, and Abhijit Muhurat.
 */
export function analyzeMuhuratSafety(
  date: Date,
  timeStr: string,
  city: CityLocation = DEFAULT_CITIES[0]
): MuhuratSafetyAnalysis {
  const panchang = calculatePanchang(date, city);
  const sunrise = panchang.sunMoon.sunrise || '06:00 AM';
  const sunset = panchang.sunMoon.sunset || '06:30 PM';

  const muhurats = calculateMuhurats(date, sunrise, sunset);
  const choghadiyas = calculateChoghadiya(date, sunrise, sunset);

  const chosenMin = parseTimeToMinutes(timeStr);

  // Check Rahu Kalam overlap
  const rahuItem = muhurats.inauspicious.find(m => m.name.includes('Rahu'));
  const rahuStartMin = rahuItem ? parseTimeToMinutes(rahuItem.startTime) : -1;
  const rahuEndMin = rahuItem ? parseTimeToMinutes(rahuItem.endTime) : -1;
  const rahuKalamConflict = chosenMin >= rahuStartMin && chosenMin <= rahuEndMin;

  // Check Yamaganda overlap
  const yamaItem = muhurats.inauspicious.find(m => m.name.includes('Yama'));
  const yamaStartMin = yamaItem ? parseTimeToMinutes(yamaItem.startTime) : -1;
  const yamaEndMin = yamaItem ? parseTimeToMinutes(yamaItem.endTime) : -1;
  const yamagandaConflict = chosenMin >= yamaStartMin && chosenMin <= yamaEndMin;

  // Check Gulika overlap
  const gulikaItem = muhurats.inauspicious.find(m => m.name.includes('Gulika'));
  const gulikaStartMin = gulikaItem ? parseTimeToMinutes(gulikaItem.startTime) : -1;
  const gulikaEndMin = gulikaItem ? parseTimeToMinutes(gulikaItem.endTime) : -1;
  const gulikaConflict = chosenMin >= gulikaStartMin && chosenMin <= gulikaEndMin;

  // Check Abhijit Muhurat overlap
  const abhijitItem = muhurats.auspicious.find(m => m.name.includes('Abhijit'));
  const abhijitStartMin = abhijitItem ? parseTimeToMinutes(abhijitItem.startTime) : -1;
  const abhijitEndMin = abhijitItem ? parseTimeToMinutes(abhijitItem.endTime) : -1;
  const isAbhijitMuhurat = chosenMin >= abhijitStartMin && chosenMin <= abhijitEndMin;

  // Find active Choghadiya at chosen time
  let activeChoghadiyaName = 'General';
  let activeChoghadiyaHindi = 'सामान्य';
  let isChoghadiyaAuspicious = true;

  const dayChog = choghadiyas.dayChoghadiya;
  const activeChogItem = dayChog.find((c: ChoghadiyaItem) => {
    const sMin = parseTimeToMinutes(c.startTime);
    const eMin = parseTimeToMinutes(c.endTime);
    return chosenMin >= sMin && chosenMin <= eMin;
  });

  if (activeChogItem) {
    activeChoghadiyaName = activeChogItem.name;
    activeChoghadiyaHindi = activeChogItem.hindiName;
    isChoghadiyaAuspicious = activeChogItem.isAuspicious;
  }

  const rahuRangeStr = rahuItem ? `${rahuItem.startTime} - ${rahuItem.endTime}` : '03:00 PM - 04:30 PM';

  // Determine overall Safety Rating
  let safetyRating: 'AUSPICIOUS' | 'NEUTRAL' | 'INAUSPICIOUS' = 'NEUTRAL';
  let title = '🟡 Neutral Time Window (सामान्य समय)';
  let advice = `Active Choghadiya: ${activeChoghadiyaName} (${activeChoghadiyaHindi}). Suitable for regular tasks.`;

  if (rahuKalamConflict) {
    safetyRating = 'INAUSPICIOUS';
    title = '🔴 ⚠️ Rahu Kalam Active (राहु काल अलर्ट)';
    advice = `Rahu Kalam is active (${rahuRangeStr}). It is strongly recommended to avoid starting new work, travels, or sacred ceremonies during Rahu Kalam.`;
  } else if (yamagandaConflict || gulikaConflict) {
    safetyRating = 'INAUSPICIOUS';
    title = '🔴 ⚠️ Yamaganda / Gulika Kalam Active';
    advice = `Yamaganda or Gulika Kalam is active at ${timeStr}. Consider shifting slot for maximum benefit.`;
  } else if (isAbhijitMuhurat) {
    safetyRating = 'AUSPICIOUS';
    title = '🟢 ✨ Abhijit Muhurat Active (अभिजित मुहूर्त - श्रेष्ठ)';
    advice = `Selected time falls in Abhijit Muhurat (${abhijitItem?.startTime} - ${abhijitItem?.endTime}). Highly auspicious for all remedies, ceremonies & rituals!`;
  } else if (isChoghadiyaAuspicious) {
    safetyRating = 'AUSPICIOUS';
    title = `🟢 ✨ Auspicious ${activeChoghadiyaName} Choghadiya (${activeChoghadiyaHindi})`;
    advice = `${activeChoghadiyaName} (${activeChoghadiyaHindi}) Choghadiya is active. Highly favorable time slot for fasts, remedies & ceremonies!`;
  }

  return {
    timeStr,
    safetyRating,
    title,
    advice,
    rahuKalamConflict,
    yamagandaConflict,
    gulikaConflict,
    activeChoghadiyaName,
    activeChoghadiyaHindi,
    isChoghadiyaAuspicious,
    isAbhijitMuhurat,
    rahuKalamRange: rahuRangeStr
  };
}
