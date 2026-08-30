export interface JainDayData {
  viraSamvatYear: number;
  jainMonthName: string;
  jainTithiName: string;
  isParvaTithi: boolean;
  parvaType?: string;
  jainFestivalName?: string;
  pachkhanInfo?: string;
}

const JAIN_MONTHS = [
  'Posh / Maha', 'Maha / Phagan', 'Phagan / Chaitra', 'Chaitra / Vaishakh',
  'Vaishakh / Jeth', 'Jeth / Ashadh', 'Ashadh / Shravan', 'Shravan / Bhadarvo',
  'Bhadarvo / Aaso', 'Aaso / Kartak', 'Kartak / Maagshar', 'Maagshar / Posh'
];

/**
 * Calculates Jain Vira Nirvana Samvat details for any given Gregorian Date
 */
export function getJainDayData(date: Date, tithiIndex: number): JainDayData {
  const gYear = date.getFullYear();
  // Vira Nirvana Samvat Year = Western Year + 527 (e.g. 2026 CE = Vira Nirvana Samvat 2552)
  const viraSamvatYear = gYear + 527;

  const monthIdx = date.getMonth();
  const jainMonthName = JAIN_MONTHS[monthIdx % 12];

  // Normalized Tithi (0-14 = Sud/Shukla, 15-29 = Vad/Krishna)
  const tithiNum = (tithiIndex % 15) + 1;
  const isSud = tithiIndex < 15;
  const pakshaName = isSud ? 'Sud (Waxing)' : 'Vad (Waning)';

  const tithiNames = [
    'Ekam (1)', 'Beej (2)', 'Trij (3)', 'Chouth (4)', 'Pancham (5)',
    'Chhath (6)', 'Satam (7)', 'Aatham (8)', 'Nom (9)', 'Dasham (10)',
    'Agiyaras (11)', 'Baras (12)', 'Teras (13)', 'Chaudas (14)', isSud ? 'Poonam (15)' : 'Aamavasya (30)'
  ];

  const jainTithiName = `${pakshaName} ${tithiNames[tithiNum - 1]}`;

  // Sacred Jain Parva Tithis & Fasting Indicators
  let isParvaTithi = false;
  let parvaType = undefined;
  let pachkhanInfo = undefined;

  if (tithiNum === 8) {
    isParvaTithi = true;
    parvaType = '🪔 Aastham (Ashtami) Parva Tithi';
    pachkhanInfo = 'Sacred Jain Fasting Day (Avoid Green Vegetables & Observe Chauvihar)';
  } else if (tithiNum === 14) {
    isParvaTithi = true;
    parvaType = '🪔 Chaudas (Chaturdashi) Parva Tithi';
    pachkhanInfo = 'Sacred Jain Fasting Day (Upvas / Chauvihar & Spiritual Penance)';
  } else if (tithiNum === 5) {
    isParvaTithi = true;
    parvaType = '📖 Pancham (Jnana/Labh Panchami)';
    pachkhanInfo = 'Holy Day of Sacred Jain Knowledge & Scriptures';
  } else if (tithiNum === 15) {
    isParvaTithi = true;
    parvaType = '🌕 Poonam (Kartiki/Chaitri Purnima)';
    pachkhanInfo = 'Grand Holy Pilgrimage Day (Shatrunjaya Yatra & Parva)';
  }

  // Major Jain Sacred Festivals
  let jainFestivalName = undefined;
  const day = date.getDate();
  const month = date.getMonth();

  if (month === 3 && day >= 10 && day <= 20 && tithiNum === 13 && isSud) {
    jainFestivalName = '🌸 Lord Mahavir Jayanti Kalyanak';
  } else if (month === 7 || month === 8) {
    if (jainMonthName.includes('Bhadarvo') && tithiNum === 5 && isSud) {
      jainFestivalName = '🪔 Paryushan Parva - Samvatsari (Michhami Dukkadam)';
    } else if (jainMonthName.includes('Bhadarvo') && isSud && tithiNum >= 1 && tithiNum <= 8) {
      jainFestivalName = '🪔 Sacred Paryushan Mahaparva';
    }
  } else if (month === 10 && day >= 20 || month === 11 && day <= 5) {
    if (jainMonthName.includes('Kartak') && tithiNum === 1 && isSud) {
      jainFestivalName = '🪔 Vira Nirvana Samvat New Year (Gautam Swami Kevaljnana)';
    }
  } else if (month === 3 && day === 20 || month === 4 && day === 15) {
    if (tithiNum === 3 && isSud) {
      jainFestivalName = '🌾 Sacred Akshaya Tritiya (Rishabhdev Bhagwan Parna)';
    }
  }

  return {
    viraSamvatYear,
    jainMonthName,
    jainTithiName,
    isParvaTithi,
    parvaType,
    jainFestivalName,
    pachkhanInfo
  };
}
