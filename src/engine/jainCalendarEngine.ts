export interface JainDayData {
  viraSamvatYear: number;
  jainMonthName: string;
  jainTithiName: string;
  isParvaTithi: boolean;
  parvaType?: string;
  jainFestivalName?: string;
  pachkhanInfo?: string;
  isInChaturmas: boolean;
  chaturmasStatus: string;
  religiousActivities: string[];
}

const JAIN_MONTHS = [
  'Posh / Maha', 'Maha / Phagan', 'Phagan / Chaitra', 'Chaitra / Vaishakh',
  'Vaishakh / Jeth', 'Jeth / Ashadh', 'Ashadh / Shravan', 'Shravan / Bhadarvo',
  'Bhadarvo / Aaso', 'Aaso / Kartak', 'Kartak / Maagshar', 'Maagshar / Posh'
];

/**
 * Calculates Jain Vira Nirvana Samvat details & religious guidelines for any given Gregorian Date
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

  // Check if date falls in 4-Month Holy Chaturmas Period (July 29 to Nov 24, 2026)
  const month = date.getMonth(); // 0-indexed (6 = July, 10 = Nov)
  const day = date.getDate();

  let isInChaturmas = false;
  let chaturmasStatus = 'Regular Period';

  if ((month === 6 && day >= 29) || (month > 6 && month < 10) || (month === 10 && day <= 24)) {
    isInChaturmas = true;
    chaturmasStatus = '🪔 Holy Chaturmas Period Active (4-Month Mahavrat & Penance)';
  }

  // Sacred Jain Parva Tithis & Fasting Indicators
  let isParvaTithi = false;
  let parvaType = undefined;
  let pachkhanInfo = undefined;

  const religiousActivities: string[] = [
    '🪔 Perform 48-minute Morning Samayik (Equanimity Meditation)',
    '📿 Chanting Navkar Mantra (108 times on Japamala)',
    '🌆 Observe Evening Chauvihar (Strictly no food or water after sunset)'
  ];

  if (tithiNum === 8) {
    isParvaTithi = true;
    parvaType = '🪔 Aastham (Ashtami) Parva Tithi';
    pachkhanInfo = 'Sacred Jain Fasting Day (Avoid Green Vegetables & Observe Chauvihar)';
    religiousActivities.push('🥬 Abhakshya Tyag: Strictly refrain from consuming green & root vegetables (Kanda/Mula)');
    religiousActivities.push('🙏 Perform Evening Pratikraman to clean karmic bondage');
  } else if (tithiNum === 14) {
    isParvaTithi = true;
    parvaType = '🪔 Chaudas (Chaturdashi) Parva Tithi';
    pachkhanInfo = 'Sacred Jain Fasting Day (Upvas / Chauvihar & Spiritual Penance)';
    religiousActivities.push('💧 Observe Upvas (Fasting) or Biyasan (Eating dry food twice a day)');
    religiousActivities.push('🥬 Abhakshya Tyag: Avoid green leafy vegetables and root foods');
    religiousActivities.push('📜 Jinendra Snatra Puja & Scriptural Reading (Swadhyay)');
  } else if (tithiNum === 5) {
    isParvaTithi = true;
    parvaType = '📖 Pancham (Jnana/Labh Panchami)';
    pachkhanInfo = 'Holy Day of Sacred Jain Knowledge & Scriptures';
    religiousActivities.push('📖 Worship Sacred Agamas & Religious Scriptures (Gyan Aradhana)');
  } else if (tithiNum === 15) {
    isParvaTithi = true;
    parvaType = '🌕 Poonam (Kartiki/Chaitri Purnima)';
    pachkhanInfo = 'Grand Holy Pilgrimage Day (Shatrunjaya Yatra & Parva)';
    religiousActivities.push('🏔️ Shatrunjaya Giriraj Yatra Bhaav-Yatra & Jinendra Abhishek');
  }

  // Major Jain Sacred Festivals
  let jainFestivalName = undefined;

  if (month === 3 && day >= 10 && day <= 20 && tithiNum === 13 && isSud) {
    jainFestivalName = '🌸 Lord Mahavir Jayanti Kalyanak';
    religiousActivities.unshift('🌸 Celebrate Bhagwan Mahavir Janma Kalyanak with Ahimsa & Rath Yatra');
  } else if (month === 7 || month === 8) {
    if (jainMonthName.includes('Bhadarvo') && tithiNum === 5 && isSud) {
      jainFestivalName = '🪔 Paryushan Parva - Samvatsari (Michhami Dukkadam)';
      religiousActivities.unshift('🙏 Universal Forgiveness (Michhami Dukkadam): Ask forgiveness from all living beings');
      religiousActivities.push('🧘 Perform Samvatsari Pratikraman and 24-hour Fasting');
    } else if (jainMonthName.includes('Bhadarvo') && isSud && tithiNum >= 1 && tithiNum <= 8) {
      jainFestivalName = '🪔 Sacred Paryushan Mahaparva';
      religiousActivities.unshift('📜 Kalpa Sutra Vachana & Daily Upvas/Tapa');
    }
  } else if (month === 10 && day >= 20 || month === 11 && day <= 5) {
    if (jainMonthName.includes('Kartak') && tithiNum === 1 && isSud) {
      jainFestivalName = '🪔 Vira Nirvana Samvat New Year (Gautam Swami Kevaljnana)';
      religiousActivities.unshift('🪔 Celebrate Gautam Swami Kevaljnana & Recite Gautam Ras');
    }
  } else if (month === 3 && day === 20 || month === 4 && day === 15) {
    if (tithiNum === 3 && isSud) {
      jainFestivalName = '🌾 Sacred Akshaya Tritiya (Rishabhdev Bhagwan Parna)';
      religiousActivities.unshift('🌾 Sugarcane Juice (Ikshu Rasa) Parna offering to Jain Monks');
    }
  }

  return {
    viraSamvatYear,
    jainMonthName,
    jainTithiName,
    isParvaTithi,
    parvaType,
    jainFestivalName,
    pachkhanInfo,
    isInChaturmas,
    chaturmasStatus,
    religiousActivities
  };
}
