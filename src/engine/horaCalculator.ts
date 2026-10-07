/**
 * Classical Vedic Hora Calculator
 * Computes the 24 diurnal and nocturnal Horas for any given civil date,
 * based on exact local Sunrise and Sunset times.
 *
 * Rules according to Surya Siddhanta & Brihat Parashara Hora Shastra:
 * 1. A day consists of 24 Horas: 12 Day Horas (Sunrise to Sunset) and 12 Night Horas (Sunset to next Sunrise).
 * 2. The ruler of the 1st Hora at Sunrise is the Lord of the Day (Vaar Lord).
 * 3. The subsequent Horas follow the geocentric Chaldean descending speed cycle:
 *    Sun ➔ Venus ➔ Mercury ➔ Moon ➔ Saturn ➔ Jupiter ➔ Mars ➔ (cycles back to Sun).
 */

export interface HoraSlot {
  index: number;            // 1 to 24
  period: 'DAY' | 'NIGHT';  // DAY (1-12) or NIGHT (13-24)
  slotNumber: number;       // 1 to 12 within the period
  planet: string;           // Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars
  planetIcon: string;
  startTime: string;        // e.g. "06:30 AM"
  endTime: string;          // e.g. "07:29 AM"
  startMinutes: number;     // minutes from midnight
  endMinutes: number;
  quality: 'HIGHLY_AUSPICIOUS' | 'AUSPICIOUS' | 'NEUTRAL' | 'CHALLENGING';
  qualityLabel: string;
  color: string;
  guidance: string;
  isCurrent: boolean;
}

export interface DayHorasResult {
  dayHoras: HoraSlot[];
  nightHoras: HoraSlot[];
  allHoras: HoraSlot[];
  currentHora: HoraSlot | null;
}

// Classical Chaldean descending orbital speed sequence
const HORA_PLANET_CYCLE = ['Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter', 'Mars'];

// Weekday lords (0 = Sunday to 6 = Saturday)
const WEEKDAY_LORDS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

const PLANET_METADATA: Record<string, {
  icon: string;
  quality: 'HIGHLY_AUSPICIOUS' | 'AUSPICIOUS' | 'NEUTRAL' | 'CHALLENGING';
  qualityLabel: string;
  color: string;
  guidance: string;
}> = {
  Sun: {
    icon: '☀️',
    quality: 'AUSPICIOUS',
    qualityLabel: 'Auspicious',
    color: '#D97706',
    guidance: 'Ruled by Surya • Favorable for administrative deeds, leadership, political meetings, seeking promotions, and spiritual fire ceremonies.',
  },
  Venus: {
    icon: '♀',
    quality: 'HIGHLY_AUSPICIOUS',
    qualityLabel: 'Highly Auspicious ⭐',
    color: '#10B981',
    guidance: 'Ruled by Shukra • Supreme for acquiring luxury items, clothing, jewellery, vehicles, romance, weddings, music, and decorative arts.',
  },
  Mercury: {
    icon: '☿',
    quality: 'AUSPICIOUS',
    qualityLabel: 'Auspicious',
    color: '#059669',
    guidance: 'Ruled by Budha • Excellent for commerce, bookkeeping, signing legal accords, education, publishing, software development, and discussions.',
  },
  Moon: {
    icon: '🌙',
    quality: 'NEUTRAL',
    qualityLabel: 'Moderate & Gentle',
    color: '#3B82F6',
    guidance: 'Ruled by Chandra • Suitable for maternal tasks, domestic harmony, travel, agriculture, silver transactions, and social gatherings.',
  },
  Saturn: {
    icon: '♄',
    quality: 'CHALLENGING',
    qualityLabel: 'Caution / Avoid',
    color: '#DC2626',
    guidance: 'Ruled by Shani • Governed by delays and heavy exertion. Good for laying foundations, factory work, and mining. Avoid voyages or agreements.',
  },
  Jupiter: {
    icon: '♃',
    quality: 'HIGHLY_AUSPICIOUS',
    qualityLabel: 'Highly Auspicious ⭐',
    color: '#D97706',
    guidance: 'Ruled by Brihaspati • Blessed divine grace. Best for financial wealth, investments, Vedic pujas, visiting teachers/temples, and new ventures.',
  },
  Mars: {
    icon: '♂',
    quality: 'CHALLENGING',
    qualityLabel: 'Aggressive / Caution',
    color: '#E11D48',
    guidance: 'Ruled by Mangal • Energetic and combative. Favorable for athletics, surgical matters, land acquisition, and defense. Avoid peace negotiations.',
  },
};

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 360; // 06:00 AM default
  const clean = timeStr.replace(/\s*IST/i, '').trim();
  const parts = clean.split(' ');
  const [hStr, mStr] = (parts[0] || '06:00').split(':');
  let h = parseInt(hStr, 10) || 6;
  const m = parseInt(mStr, 10) || 0;
  const ampm = (parts[1] || 'AM').toUpperCase();
  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

function formatMinutesToTime(mins: number): string {
  let mTotal = Math.round(mins) % 1440;
  if (mTotal < 0) mTotal += 1440;
  let h = Math.floor(mTotal / 60);
  const m = mTotal % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

/**
 * Calculates all 24 Horas for a given day
 */
export function calculateHorasForDay(
  date: Date,
  sunriseStr: string,
  sunsetStr: string,
  isToday: boolean = false
): DayHorasResult {
  const sunriseMin = parseTimeToMinutes(sunriseStr);
  let sunsetMin = parseTimeToMinutes(sunsetStr);
  if (sunsetMin <= sunriseMin) {
    sunsetMin += 720; // fallback if sunset is missing or weird
  }

  const dayDuration = sunsetMin - sunriseMin;
  const dayHoraDuration = dayDuration / 12;

  // Night goes from Sunset to Next Sunrise (approx 1440 + sunriseMin)
  const nightDuration = (1440 + sunriseMin) - sunsetMin;
  const nightHoraDuration = nightDuration / 12;

  // Day lord at Sunrise
  const weekday = date.getDay(); // 0 = Sun
  const dayLord = WEEKDAY_LORDS[weekday];
  let cycleIndex = HORA_PLANET_CYCLE.indexOf(dayLord);
  if (cycleIndex === -1) cycleIndex = 0;

  const now = new Date();
  const currentNowMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : -1;

  const dayHoras: HoraSlot[] = [];
  const nightHoras: HoraSlot[] = [];
  const allHoras: HoraSlot[] = [];

  // 12 Day Horas
  for (let i = 0; i < 12; i++) {
    const planet = HORA_PLANET_CYCLE[cycleIndex];
    const startM = sunriseMin + i * dayHoraDuration;
    const endM = sunriseMin + (i + 1) * dayHoraDuration;

    let isCurrent = false;
    if (isToday && currentNowMinutes >= startM && currentNowMinutes < endM) {
      isCurrent = true;
    }

    const meta = PLANET_METADATA[planet] || PLANET_METADATA.Sun;
    const slot: HoraSlot = {
      index: i + 1,
      period: 'DAY',
      slotNumber: i + 1,
      planet,
      planetIcon: meta.icon,
      startTime: formatMinutesToTime(startM),
      endTime: formatMinutesToTime(endM),
      startMinutes: Math.round(startM),
      endMinutes: Math.round(endM),
      quality: meta.quality,
      qualityLabel: meta.qualityLabel,
      color: meta.color,
      guidance: meta.guidance,
      isCurrent,
    };

    dayHoras.push(slot);
    allHoras.push(slot);
    cycleIndex = (cycleIndex + 1) % HORA_PLANET_CYCLE.length;
  }

  // 12 Night Horas
  for (let j = 0; j < 12; j++) {
    const planet = HORA_PLANET_CYCLE[cycleIndex];
    const startM = (sunsetMin + j * nightHoraDuration) % 1440;
    const endM = (sunsetMin + (j + 1) * nightHoraDuration) % 1440;

    let isCurrent = false;
    if (isToday) {
      const realStart = sunsetMin + j * nightHoraDuration;
      const realEnd = sunsetMin + (j + 1) * nightHoraDuration;
      // Handle crossing midnight
      const cmpMin = currentNowMinutes < sunriseMin ? currentNowMinutes + 1440 : currentNowMinutes;
      if (cmpMin >= realStart && cmpMin < realEnd) {
        isCurrent = true;
      }
    }

    const meta = PLANET_METADATA[planet] || PLANET_METADATA.Sun;
    const slot: HoraSlot = {
      index: 12 + j + 1,
      period: 'NIGHT',
      slotNumber: j + 1,
      planet,
      planetIcon: meta.icon,
      startTime: formatMinutesToTime(startM),
      endTime: formatMinutesToTime(endM),
      startMinutes: Math.round(startM),
      endMinutes: Math.round(endM),
      quality: meta.quality,
      qualityLabel: meta.qualityLabel,
      color: meta.color,
      guidance: meta.guidance,
      isCurrent,
    };

    nightHoras.push(slot);
    allHoras.push(slot);
    cycleIndex = (cycleIndex + 1) % HORA_PLANET_CYCLE.length;
  }

  const currentHora = allHoras.find(h => h.isCurrent) || (isToday ? dayHoras[0] : null);

  return {
    dayHoras,
    nightHoras,
    allHoras,
    currentHora: currentHora || null,
  };
}
