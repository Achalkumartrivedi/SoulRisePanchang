import type { CalendarSystem } from '../context/CalendarContext';
import { Festival } from '../types/panchang';
import { FESTIVALS, getLocalizedFestivalTitle } from './festivalRepository';
import { getJainDayData, JainDayData } from './jainCalendarEngine';
import { calculateTithiForDate, getHinduMonthName } from './panchangEngine';
import { getLocalizedTithi, getLocalizedPakshaName } from '../i18n/vedicTerms';

export interface DharmaDayData {
  calendarSystem: CalendarSystem;
  eraTitle: string;
  monthName: string;
  dayLabel: string;
  badgeText?: string;
  badgeType?: 'FESTIVAL' | 'POYA' | 'PARVA' | 'HOLIDAY' | 'RITUAL' | 'SEASON';
  festivalMatch?: Festival | null;
  worldFestivalMatch?: { name: string; country: string } | null;
  significance: string;
  additionalDetails: { label: string; value: string }[];
}

/**
 * Calculates authentic calendar details for any date and selected calendar tradition.
 */
export function getDharmaCalendarDayData(
  date: Date,
  calendarSystem: CalendarSystem,
  language: string = 'hi'
): DharmaDayData {
  const dateIso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const gDay = date.getDate();
  const gMonth = date.getMonth(); // 0-indexed
  const gYear = date.getFullYear();

  // Find festival matches in repository
  const exactFestivalMatch = FESTIVALS.find(f => f.dateIso === dateIso);

  switch (calendarSystem) {
    // ----------------------------------------------------
    // 1. SIKH NANAKSHAHI CALENDAR (S. Samvat 558)
    // ----------------------------------------------------
    case 'SIKH': {
      const nanakshahiYear = gYear - 1468; // e.g. 2026 CE = S. Samvat 558
      const sikhMonths = [
        { name: 'Magh (माघ)', start: { m: 0, d: 14 } },
        { name: 'Phagun (फागुन)', start: { m: 1, d: 13 } },
        { name: 'Chet (चेत - Nanakshahi New Year)', start: { m: 2, d: 14 } },
        { name: 'Vaisakh (वैसाख - Khalsa Sajna)', start: { m: 3, d: 14 } },
        { name: 'Jeth (जेठ)', start: { m: 4, d: 15 } },
        { name: 'Harh (हाड़)', start: { m: 5, d: 15 } },
        { name: 'Sawan (सावन)', start: { m: 6, d: 16 } },
        { name: 'Bhadon (भादों)', start: { m: 7, d: 16 } },
        { name: 'Assu (अस्सू)', start: { m: 8, d: 15 } },
        { name: 'Katak (कतक)', start: { m: 9, d: 15 } },
        { name: 'Maghar (मघर)', start: { m: 10, d: 14 } },
        { name: 'Poh (पोह)', start: { m: 11, d: 14 } },
      ];

      let currentSikhMonth = 'Chet';
      if (gMonth === 2 && gDay >= 14) currentSikhMonth = 'Chet (चेत)';
      else if (gMonth === 3 && gDay >= 14) currentSikhMonth = 'Vaisakh (वैसाख)';
      else if (gMonth === 4 && gDay >= 15) currentSikhMonth = 'Jeth (जेठ)';
      else if (gMonth === 5 && gDay >= 15) currentSikhMonth = 'Harh (हाड़)';
      else if (gMonth === 6 && gDay >= 16) currentSikhMonth = 'Sawan (सावन)';
      else if (gMonth === 7 && gDay >= 16) currentSikhMonth = 'Bhadon (भादों)';
      else if (gMonth === 8 && gDay >= 15) currentSikhMonth = 'Assu (अस्सू)';
      else if (gMonth === 9 && gDay >= 15) currentSikhMonth = 'Katak (कतक)';
      else if (gMonth === 10 && gDay >= 14) currentSikhMonth = 'Maghar (मघर)';
      else if (gMonth === 11 && gDay >= 14) currentSikhMonth = 'Poh (पोह)';
      else if (gMonth === 0 && gDay >= 14) currentSikhMonth = 'Magh (माघ)';
      else if (gMonth === 1 && gDay >= 13) currentSikhMonth = 'Phagun (फागुन)';

      const sikhFest = FESTIVALS.find(f => f.dateIso === dateIso && f.category === 'SIKH_FESTIVAL');

      return {
        calendarSystem: 'SIKH',
        eraTitle: `☬ Nanakshahi Sikh Samvat ${nanakshahiYear}`,
        monthName: currentSikhMonth,
        dayLabel: `Nanakshahi Date (${currentSikhMonth})`,
        badgeText: sikhFest ? `☬ ${sikhFest.name.split(' ')[0]}` : undefined,
        badgeType: sikhFest ? 'FESTIVAL' : undefined,
        festivalMatch: sikhFest || null,
        significance: sikhFest ? sikhFest.description : 'Solar Nanakshahi Sikh Calendar Day honoring Guru Nanak Dev Ji & Khalsa Panth heritage.',
        additionalDetails: [
          { label: 'Calendar System', value: 'Nanakshahi Solar Sikh Calendar' },
          { label: 'Era Year', value: `Sikh Samvat ${nanakshahiYear}` },
          { label: 'Sikh Month', value: currentSikhMonth },
          { label: 'Spiritual Center', value: 'Sri Harmandir Sahib (Golden Temple), Amritsar' }
        ]
      };
    }

    // ----------------------------------------------------
    // 2. BUDDHIST LUNAR CALENDAR (BE 2569)
    // ----------------------------------------------------
    case 'BUDDHIST': {
      const buddhaEraYear = gYear + 543; // e.g. 2026 CE = BE 2569
      const buddhistMonths = [
        'Duruthu (January)', 'Navam (February)', 'Medin (March)', 'Bak (April)',
        'Vesakha (May - Buddha Purnima)', 'Poson (June)', 'Asalha (July - Dhamma Day)',
        'Nikini (August)', 'Binara (September)', 'Vap (October)', 'Il (November)', 'Unduvap (December)'
      ];
      const bMonth = buddhistMonths[gMonth];

      const tithiIdx = calculateTithiForDate(date);
      const isFullMoon = tithiIdx === 14;
      const isNewMoon = tithiIdx === 29;

      const buddhistFest = FESTIVALS.find(f => f.dateIso === dateIso && f.category === 'BUDDHIST_FESTIVAL');

      let badgeText = undefined;
      if (buddhistFest) badgeText = `☸️ ${buddhistFest.name.split(' ')[0]}`;
      else if (isFullMoon) badgeText = `🌕 Poya / Uposatha`;

      return {
        calendarSystem: 'BUDDHIST',
        eraTitle: `☸️ Buddha Era (BE) ${buddhaEraYear}`,
        monthName: bMonth,
        dayLabel: isFullMoon ? '🌕 Full Moon Poya Day' : `Day of ${bMonth.split(' ')[0]}`,
        badgeText,
        badgeType: (buddhistFest || isFullMoon) ? 'POYA' : undefined,
        festivalMatch: buddhistFest || null,
        significance: buddhistFest ? buddhistFest.description : (isFullMoon ? 'Sacred Full Moon Uposatha day for meditation, Dhamma listening, and Eight Precepts.' : 'Buddhist Lunar Calendar day contemplating Noble Eightfold Path.'),
        additionalDetails: [
          { label: 'Calendar Era', value: `Buddha Era ${buddhaEraYear} BE` },
          { label: 'Lunar Month', value: bMonth },
          { label: 'Sacred Phase', value: isFullMoon ? 'Full Moon Poya Day' : (isNewMoon ? 'New Moon Day' : 'Lunar Phase') },
          { label: 'Core Philosophy', value: 'Ahimsa, Karuna (Compassion) & Mindfulness' }
        ]
      };
    }

    // ----------------------------------------------------
    // 3. CHRISTIAN LITURGICAL CALENDAR
    // ----------------------------------------------------
    case 'CHRISTIAN': {
      let season = 'Ordinary Time';
      if ((gMonth === 11 && gDay >= 29) || (gMonth === 11 && gDay <= 24)) season = '✝️ Advent Season (Preparation for Nativity)';
      else if ((gMonth === 11 && gDay >= 25) || (gMonth === 0 && gDay <= 6)) season = '✝️ Christmastide (Christmas Season)';
      else if (gMonth === 1 && gDay >= 18) season = '✝️ Lent Season (40-Day Fast & Penance)';
      else if (gMonth === 3 && gDay <= 5) season = '✝️ Holy Week & Easter Triduum';
      else if (gMonth === 3 || (gMonth === 4 && gDay <= 24)) season = '✝️ Eastertide (Easter Season)';

      const christianFest = FESTIVALS.find(f => f.dateIso === dateIso && f.category === 'CHRISTIAN_FESTIVAL');

      return {
        calendarSystem: 'CHRISTIAN',
        eraTitle: `✝️ Liturgical Year ${gYear}`,
        monthName: `${date.toLocaleString('default', { month: 'long' })} ${gYear}`,
        dayLabel: season,
        badgeText: christianFest ? `✝️ ${christianFest.name.split(' ')[0]}` : undefined,
        badgeType: christianFest ? 'FESTIVAL' : 'SEASON',
        festivalMatch: christianFest || null,
        significance: christianFest ? christianFest.description : `Christian Liturgical Season of ${season}.`,
        additionalDetails: [
          { label: 'Calendar System', value: 'Christian Liturgical Calendar' },
          { label: 'Liturgical Season', value: season },
          { label: 'Gregorian Date', value: date.toDateString() },
          { label: 'Spiritual Theme', value: 'Faith, Hope, Peace & Charity' }
        ]
      };
    }

    // ----------------------------------------------------
    // 4. PARSI ZOROASTRIAN CALENDAR (Yazdegerdi 1396)
    // ----------------------------------------------------
    case 'PARSI': {
      const yzYear = gYear - 630; // e.g. 2026 CE = Yazdegerdi 1396
      const parsiMonths = [
        'Farvardin', 'Ardibhesht', 'Khordad', 'Tir', 'Amardad', 'Shehrevar',
        'Meher', 'Avan', 'Adar', 'Dae', 'Bahman', 'Aspandarmad'
      ];
      const pMonth = parsiMonths[gMonth % 12];

      const parsiFest = FESTIVALS.find(f => f.dateIso === dateIso && f.category === 'PARSI_FESTIVAL');

      return {
        calendarSystem: 'PARSI',
        eraTitle: `🔥 Yazdegerdi Samvat ${yzYear} (YZ ${yzYear})`,
        monthName: `Month of ${pMonth}`,
        dayLabel: `Day of ${pMonth}`,
        badgeText: parsiFest ? `🔥 ${parsiFest.name.split(' ')[0]}` : undefined,
        badgeType: parsiFest ? 'FESTIVAL' : undefined,
        festivalMatch: parsiFest || null,
        significance: parsiFest ? parsiFest.description : 'Zoroastrian Parsi Shahenshahi Calendar day honoring Asha, Good Thoughts, Good Words & Good Deeds.',
        additionalDetails: [
          { label: 'Parsi Era', value: `Yazdegerdi ${yzYear} (YZ ${yzYear})` },
          { label: 'Shahenshahi Month', value: pMonth },
          { label: 'Holy Pillar', value: 'Humata, Hukhta, Hvarshta (Good Thoughts, Words, Deeds)' },
          { label: 'Sacred Element', value: 'Atash (Holy Fire Worship at Agiary)' }
        ]
      };
    }

    // ----------------------------------------------------
    // 5. GLOBAL GREGORIAN SOLAR CALENDAR
    // ----------------------------------------------------
    case 'GLOBAL': {
      const dayOfYear = Math.floor((date.getTime() - new Date(gYear, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      const worldFest = FESTIVALS.find(f => f.dateIso === dateIso && f.category === 'WORLD_FESTIVAL');

      return {
        calendarSystem: 'GLOBAL',
        eraTitle: `🌍 Gregorian Solar AD ${gYear}`,
        monthName: `${date.toLocaleString('default', { month: 'long' })} ${gYear}`,
        dayLabel: `Day ${dayOfYear} of 365`,
        badgeText: worldFest ? `🌐 ${worldFest.name.split(' ')[0]}` : undefined,
        badgeType: worldFest ? 'FESTIVAL' : undefined,
        festivalMatch: worldFest || null,
        significance: worldFest ? worldFest.description : 'Standard International Solar Calendar day.',
        additionalDetails: [
          { label: 'Calendar Standard', value: 'Gregorian Solar Calendar' },
          { label: 'Solar Year Day', value: `Day ${dayOfYear} of 365` },
          { label: 'Full Date', value: date.toDateString() },
          { label: 'Global Observances', value: worldFest ? worldFest.name : 'Standard Business & Civil Day' }
        ]
      };
    }

    // ----------------------------------------------------
    // 6. JAIN VIRA NIRVANA SAMVAT (VNS 2552)
    // ----------------------------------------------------
    case 'JAIN': {
      const tithiIdx = calculateTithiForDate(date);
      const jData: JainDayData = getJainDayData(date, tithiIdx);
      const jainFest = FESTIVALS.find(f => f.dateIso === dateIso && f.category === 'JAIN_FESTIVAL');

      let badgeText = undefined;
      if (jainFest) badgeText = `🪔 ${jainFest.name.split(' ')[1] || 'Parva'}`;
      else if (jData.isParvaTithi) badgeText = `🪔 ${jData.parvaType?.split(' ')[1] || 'Parva'}`;

      return {
        calendarSystem: 'JAIN',
        eraTitle: `🪔 Vira Nirvana Samvat ${jData.viraSamvatYear}`,
        monthName: jData.jainMonthName,
        dayLabel: jData.jainTithiName,
        badgeText,
        badgeType: (jainFest || jData.isParvaTithi) ? 'PARVA' : undefined,
        festivalMatch: jainFest || null,
        significance: jainFest ? jainFest.description : (jData.isParvaTithi ? `${jData.jainTithiName} is a sacred Jain Parva Tithi for Fasting (Upvas), Pachkhan & Dev Vandan.` : 'Jain Vira Nirvana Samvat day observing Ahimsa and self-purification.'),
        additionalDetails: [
          { label: 'Jain Era', value: `Vira Nirvana Samvat ${jData.viraSamvatYear}` },
          { label: 'Jain Month', value: jData.jainMonthName },
          { label: 'Jain Tithi', value: jData.jainTithiName },
          { label: 'Chaturmas Status', value: jData.isInChaturmas ? '🪔 Holy Chaturmas Active' : 'Regular Period' },
          { label: 'Fasting Guideline', value: jData.isParvaTithi ? 'Recommended Chauvihar / Upvas (Fasting)' : 'Standard Green Vegetables (Anekantavada)' }
        ]
      };
    }

    // ----------------------------------------------------
    // 7. HINDU VIKRAM SAMVAT (Default)
    // ----------------------------------------------------
    case 'HINDU':
    default: {
      const tithiIdx = calculateTithiForDate(date);
      const tithiName = getLocalizedTithi((tithiIdx % 15) + 1, language as any).name;
      const hinduMonthName = getHinduMonthName(date);
      const pakshaFull = getLocalizedPakshaName(tithiIdx <= 14 ? 'SHUKLA' : 'KRISHNA', language as any);
      const hinduFest = FESTIVALS.find(f => f.dateIso === dateIso && f.category !== 'JAIN_FESTIVAL' && f.category !== 'WORLD_FESTIVAL');

      let badgeText = undefined;
      if (tithiIdx === 14) badgeText = language === 'gu' ? '🌕 પૂનમ (Purnima)' : (language === 'hi' ? '🌕 पूर्णिमा' : '🌕 Purnima');
      else if (tithiIdx === 29) badgeText = language === 'gu' ? '🌑 અમાસ (Amavasya)' : (language === 'hi' ? '🌑 अमावस्या' : '🌑 Amavasya');
      else if (tithiIdx === 10 || tithiIdx === 25) badgeText = language === 'gu' ? '🌿 અગિયારસ (Ekadashi)' : (language === 'hi' ? '🌿 एकादशी' : '🌿 Ekadashi');
      else if (hinduFest) badgeText = getLocalizedFestivalTitle(hinduFest, language);

      const eraTitle = language === 'gu'
        ? '🕉️ હિન્દુ તિથિ અને પંચાંગ વિગત'
        : (language === 'hi' ? '🕉️ हिंदू तिथि एवं पंचांग विवरण' : '🕉️ Hindu Date & Panchang Details');

      return {
        calendarSystem: 'HINDU',
        eraTitle,
        monthName: `${hinduMonthName} (${pakshaFull})`,
        dayLabel: `${pakshaFull} ${tithiName}`,
        badgeText,
        badgeType: hinduFest ? 'FESTIVAL' : (tithiIdx === 14 || tithiIdx === 29 || tithiIdx === 10 || tithiIdx === 25 ? 'RITUAL' : undefined),
        festivalMatch: hinduFest || null,
        significance: hinduFest ? hinduFest.description : `Vedic Hindu Panchang day in ${hinduMonthName} month (${pakshaFull} ${tithiName}).`,
        additionalDetails: [
          { label: 'Vedic Samvat', value: 'Vikram Samvat 2083' },
          { label: 'Hindu Month', value: hinduMonthName },
          { label: 'Paksha', value: pakshaFull },
          { label: 'Tithi', value: tithiName }
        ]
      };
    }
  }
}
