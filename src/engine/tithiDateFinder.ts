import { calculatePanchang } from './panchangEngine';
import { UpcomingTithiDateInfo } from '../types/reminder';
import { DEFAULT_CITIES } from '../data/cities';

const DAY_NAMES = ['Sunday (रविवार)', 'Monday (सोमवार)', 'Tuesday (मंगलवार)', 'Wednesday (बुधवार)', 'Thursday (गुरुवार)', 'Friday (शुक्रवार)', 'Saturday (शनिवार)'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Normalizes Tithi search queries e.g. "Purnima / Poonam" -> "Purnima", "Ekadashi" -> "Ekadashi"
 */
function normalizeTithiKey(rawName: string): string {
  const clean = rawName.toUpperCase();
  if (clean.includes('PURNIMA') || clean.includes('POONAM')) return 'PURNIMA';
  if (clean.includes('AMAVASYA')) return 'AMAVASYA';
  if (clean.includes('EKADASHI')) return 'EKADASHI';
  if (clean.includes('PRADOSH') || clean.includes('TRAYODASHI')) return 'TRAYODASHI';
  if (clean.includes('CHATURTHI')) return 'CHATURTHI';
  if (clean.includes('ASHTAMI')) return 'ASHTAMI';
  if (clean.includes('NAVAMI')) return 'NAVAMI';
  if (clean.includes('PRATIPADA')) return 'PRATIPADA';
  if (clean.includes('DWITIYA')) return 'DWITIYA';
  if (clean.includes('TRITIYA')) return 'TRITIYA';
  if (clean.includes('PANCHAMI')) return 'PANCHAMI';
  if (clean.includes('SHASTHI')) return 'SHASTHI';
  if (clean.includes('SAPTAMI')) return 'SAPTAMI';
  if (clean.includes('DASHAMI')) return 'DASHAMI';
  if (clean.includes('DWADASHI')) return 'DWADASHI';
  if (clean.includes('CHATURDASHI')) return 'CHATURDASHI';
  return clean;
}

/**
 * Scans forward from startDate to find the NEXT 5 UPCOMING calendar dates for a given Tithi.
 */
export function findUpcoming5DatesForTithi(
  tithiSearchName: string,
  startDate: Date = new Date()
): UpcomingTithiDateInfo[] {
  const results: UpcomingTithiDateInfo[] = [];
  const key = normalizeTithiKey(tithiSearchName);

  // Scan up to 180 days into the future
  const maxDaysToScan = 180;
  const cursor = new Date(startDate.getTime());
  let lastFoundDateIso = '';

  for (let i = 0; i < maxDaysToScan && results.length < 5; i++) {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const d = cursor.getDate();
    const mStr = m + 1 < 10 ? `0${m + 1}` : `${m + 1}`;
    const dStr = d < 10 ? `0${d}` : `${d}`;
    const dateIso = `${y}-${mStr}-${dStr}`;

    const panchang = calculatePanchang(cursor, DEFAULT_CITIES[0]);
    const tNameUpper = (panchang.tithi.name || '').toUpperCase();
    const pakshaUpper = (panchang.tithi.paksha || '').toUpperCase();

    let matches = false;

    if (key === 'PURNIMA') {
      matches = tNameUpper.includes('PURNIMA') || tNameUpper.includes('POONAM') || (pakshaUpper === 'SHUKLA' && panchang.tithi.number === 15);
    } else if (key === 'AMAVASYA') {
      matches = tNameUpper.includes('AMAVASYA') || (pakshaUpper === 'KRISHNA' && panchang.tithi.number === 15);
    } else if (key === 'EKADASHI') {
      matches = tNameUpper.includes('EKADASHI') || panchang.tithi.number === 11;
    } else if (key === 'TRAYODASHI') {
      matches = tNameUpper.includes('TRAYODASHI') || panchang.tithi.number === 13;
    } else if (key === 'CHATURTHI') {
      matches = tNameUpper.includes('CHATURTHI') || panchang.tithi.number === 4;
    } else if (key === 'ASHTAMI') {
      matches = tNameUpper.includes('ASHTAMI') || panchang.tithi.number === 8;
    } else if (key === 'NAVAMI') {
      matches = tNameUpper.includes('NAVAMI') || panchang.tithi.number === 9;
    } else {
      matches = tNameUpper.includes(key);
    }

    if (matches && dateIso !== lastFoundDateIso) {
      lastFoundDateIso = dateIso;
      const dayOfWeekIdx = cursor.getDay();
      const dateDisplay = `${d} ${MONTH_SHORT[m]} ${y}`;
      const dayOfWeekName = DAY_NAMES[dayOfWeekIdx];
      const tithiFullText = `${panchang.tithi.paksha} ${panchang.tithi.name}`;

      results.push({
        dateIso,
        dateDisplay,
        dayOfWeekName,
        tithiFullText
      });
    }

    // Move to next day
    cursor.setDate(cursor.getDate() + 1);
  }

  return results;
}
