"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDharmaCalendarDayData = getDharmaCalendarDayData;
var festivalRepository_1 = require("./festivalRepository");
var jainCalendarEngine_1 = require("./jainCalendarEngine");
var panchangEngine_1 = require("./panchangEngine");
var vedicTerms_1 = require("../i18n/vedicTerms");
/**
 * Calculates authentic calendar details for any date and selected calendar tradition.
 */
function getDharmaCalendarDayData(date, calendarSystem, language) {
    var _a;
    if (language === void 0) { language = 'hi'; }
    var dateIso = "".concat(date.getFullYear(), "-").concat(String(date.getMonth() + 1).padStart(2, '0'), "-").concat(String(date.getDate()).padStart(2, '0'));
    var gDay = date.getDate();
    var gMonth = date.getMonth(); // 0-indexed
    var gYear = date.getFullYear();
    // Find festival matches in repository
    var exactFestivalMatch = festivalRepository_1.FESTIVALS.find(function (f) { return f.dateIso === dateIso; });
    switch (calendarSystem) {
        // ----------------------------------------------------
        // 1. SIKH NANAKSHAHI CALENDAR (S. Samvat 558)
        // ----------------------------------------------------
        case 'SIKH': {
            var nanakshahiYear = gYear - 1468; // e.g. 2026 CE = S. Samvat 558
            var sikhMonths = [
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
            var currentSikhMonth = 'Chet';
            if (gMonth === 2 && gDay >= 14)
                currentSikhMonth = 'Chet (चेत)';
            else if (gMonth === 3 && gDay >= 14)
                currentSikhMonth = 'Vaisakh (वैसाख)';
            else if (gMonth === 4 && gDay >= 15)
                currentSikhMonth = 'Jeth (जेठ)';
            else if (gMonth === 5 && gDay >= 15)
                currentSikhMonth = 'Harh (हाड़)';
            else if (gMonth === 6 && gDay >= 16)
                currentSikhMonth = 'Sawan (सावन)';
            else if (gMonth === 7 && gDay >= 16)
                currentSikhMonth = 'Bhadon (भादों)';
            else if (gMonth === 8 && gDay >= 15)
                currentSikhMonth = 'Assu (अस्सू)';
            else if (gMonth === 9 && gDay >= 15)
                currentSikhMonth = 'Katak (कतक)';
            else if (gMonth === 10 && gDay >= 14)
                currentSikhMonth = 'Maghar (मघर)';
            else if (gMonth === 11 && gDay >= 14)
                currentSikhMonth = 'Poh (पोह)';
            else if (gMonth === 0 && gDay >= 14)
                currentSikhMonth = 'Magh (माघ)';
            else if (gMonth === 1 && gDay >= 13)
                currentSikhMonth = 'Phagun (फागुन)';
            var sikhFest = festivalRepository_1.FESTIVALS.find(function (f) { return f.dateIso === dateIso && f.category === 'SIKH_FESTIVAL'; });
            return {
                calendarSystem: 'SIKH',
                eraTitle: "\u262C Nanakshahi Sikh Samvat ".concat(nanakshahiYear),
                monthName: currentSikhMonth,
                dayLabel: "Nanakshahi Date (".concat(currentSikhMonth, ")"),
                badgeText: sikhFest ? "\u262C ".concat(sikhFest.name.split(' ')[0]) : undefined,
                badgeType: sikhFest ? 'FESTIVAL' : undefined,
                festivalMatch: sikhFest || null,
                significance: sikhFest ? sikhFest.description : 'Solar Nanakshahi Sikh Calendar Day honoring Guru Nanak Dev Ji & Khalsa Panth heritage.',
                additionalDetails: [
                    { label: 'Calendar System', value: 'Nanakshahi Solar Sikh Calendar' },
                    { label: 'Era Year', value: "Sikh Samvat ".concat(nanakshahiYear) },
                    { label: 'Sikh Month', value: currentSikhMonth },
                    { label: 'Spiritual Center', value: 'Sri Harmandir Sahib (Golden Temple), Amritsar' }
                ]
            };
        }
        // ----------------------------------------------------
        // 2. BUDDHIST LUNAR CALENDAR (BE 2569)
        // ----------------------------------------------------
        case 'BUDDHIST': {
            var buddhaEraYear = gYear + 543; // e.g. 2026 CE = BE 2569
            var buddhistMonths = [
                'Duruthu (January)', 'Navam (February)', 'Medin (March)', 'Bak (April)',
                'Vesakha (May - Buddha Purnima)', 'Poson (June)', 'Asalha (July - Dhamma Day)',
                'Nikini (August)', 'Binara (September)', 'Vap (October)', 'Il (November)', 'Unduvap (December)'
            ];
            var bMonth = buddhistMonths[gMonth];
            var tithiIdx = (0, panchangEngine_1.calculateTithiForDate)(date);
            var isFullMoon = tithiIdx === 14;
            var isNewMoon = tithiIdx === 29;
            var buddhistFest = festivalRepository_1.FESTIVALS.find(function (f) { return f.dateIso === dateIso && f.category === 'BUDDHIST_FESTIVAL'; });
            var badgeText = undefined;
            if (buddhistFest)
                badgeText = "\u2638\uFE0F ".concat(buddhistFest.name.split(' ')[0]);
            else if (isFullMoon)
                badgeText = "\uD83C\uDF15 Poya / Uposatha";
            return {
                calendarSystem: 'BUDDHIST',
                eraTitle: "\u2638\uFE0F Buddha Era (BE) ".concat(buddhaEraYear),
                monthName: bMonth,
                dayLabel: isFullMoon ? '🌕 Full Moon Poya Day' : "Day of ".concat(bMonth.split(' ')[0]),
                badgeText: badgeText,
                badgeType: (buddhistFest || isFullMoon) ? 'POYA' : undefined,
                festivalMatch: buddhistFest || null,
                significance: buddhistFest ? buddhistFest.description : (isFullMoon ? 'Sacred Full Moon Uposatha day for meditation, Dhamma listening, and Eight Precepts.' : 'Buddhist Lunar Calendar day contemplating Noble Eightfold Path.'),
                additionalDetails: [
                    { label: 'Calendar Era', value: "Buddha Era ".concat(buddhaEraYear, " BE") },
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
            var season = 'Ordinary Time';
            if ((gMonth === 11 && gDay >= 29) || (gMonth === 11 && gDay <= 24))
                season = '✝️ Advent Season (Preparation for Nativity)';
            else if ((gMonth === 11 && gDay >= 25) || (gMonth === 0 && gDay <= 6))
                season = '✝️ Christmastide (Christmas Season)';
            else if (gMonth === 1 && gDay >= 18)
                season = '✝️ Lent Season (40-Day Fast & Penance)';
            else if (gMonth === 3 && gDay <= 5)
                season = '✝️ Holy Week & Easter Triduum';
            else if (gMonth === 3 || (gMonth === 4 && gDay <= 24))
                season = '✝️ Eastertide (Easter Season)';
            var christianFest = festivalRepository_1.FESTIVALS.find(function (f) { return f.dateIso === dateIso && f.category === 'CHRISTIAN_FESTIVAL'; });
            return {
                calendarSystem: 'CHRISTIAN',
                eraTitle: "\u271D\uFE0F Liturgical Year ".concat(gYear),
                monthName: "".concat(date.toLocaleString('default', { month: 'long' }), " ").concat(gYear),
                dayLabel: season,
                badgeText: christianFest ? "\u271D\uFE0F ".concat(christianFest.name.split(' ')[0]) : undefined,
                badgeType: christianFest ? 'FESTIVAL' : 'SEASON',
                festivalMatch: christianFest || null,
                significance: christianFest ? christianFest.description : "Christian Liturgical Season of ".concat(season, "."),
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
            var yzYear = gYear - 630; // e.g. 2026 CE = Yazdegerdi 1396
            var parsiMonths = [
                'Farvardin', 'Ardibhesht', 'Khordad', 'Tir', 'Amardad', 'Shehrevar',
                'Meher', 'Avan', 'Adar', 'Dae', 'Bahman', 'Aspandarmad'
            ];
            var pMonth = parsiMonths[gMonth % 12];
            var parsiFest = festivalRepository_1.FESTIVALS.find(function (f) { return f.dateIso === dateIso && f.category === 'PARSI_FESTIVAL'; });
            return {
                calendarSystem: 'PARSI',
                eraTitle: "\uD83D\uDD25 Yazdegerdi Samvat ".concat(yzYear, " (YZ ").concat(yzYear, ")"),
                monthName: "Month of ".concat(pMonth),
                dayLabel: "Day of ".concat(pMonth),
                badgeText: parsiFest ? "\uD83D\uDD25 ".concat(parsiFest.name.split(' ')[0]) : undefined,
                badgeType: parsiFest ? 'FESTIVAL' : undefined,
                festivalMatch: parsiFest || null,
                significance: parsiFest ? parsiFest.description : 'Zoroastrian Parsi Shahenshahi Calendar day honoring Asha, Good Thoughts, Good Words & Good Deeds.',
                additionalDetails: [
                    { label: 'Parsi Era', value: "Yazdegerdi ".concat(yzYear, " (YZ ").concat(yzYear, ")") },
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
            var dayOfYear = Math.floor((date.getTime() - new Date(gYear, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
            var worldFest = festivalRepository_1.FESTIVALS.find(function (f) { return f.dateIso === dateIso && f.category === 'WORLD_FESTIVAL'; });
            return {
                calendarSystem: 'GLOBAL',
                eraTitle: "\uD83C\uDF0D Gregorian Solar AD ".concat(gYear),
                monthName: "".concat(date.toLocaleString('default', { month: 'long' }), " ").concat(gYear),
                dayLabel: "Day ".concat(dayOfYear, " of 365"),
                badgeText: worldFest ? "\uD83C\uDF10 ".concat(worldFest.name.split(' ')[0]) : undefined,
                badgeType: worldFest ? 'FESTIVAL' : undefined,
                festivalMatch: worldFest || null,
                significance: worldFest ? worldFest.description : 'Standard International Solar Calendar day.',
                additionalDetails: [
                    { label: 'Calendar Standard', value: 'Gregorian Solar Calendar' },
                    { label: 'Solar Year Day', value: "Day ".concat(dayOfYear, " of 365") },
                    { label: 'Full Date', value: date.toDateString() },
                    { label: 'Global Observances', value: worldFest ? worldFest.name : 'Standard Business & Civil Day' }
                ]
            };
        }
        // ----------------------------------------------------
        // 6. JAIN VIRA NIRVANA SAMVAT (VNS 2552)
        // ----------------------------------------------------
        case 'JAIN': {
            var tithiIdx = (0, panchangEngine_1.calculateTithiForDate)(date);
            var jData = (0, jainCalendarEngine_1.getJainDayData)(date, tithiIdx);
            var jainFest = festivalRepository_1.FESTIVALS.find(function (f) { return f.dateIso === dateIso && f.category === 'JAIN_FESTIVAL'; });
            var badgeText = undefined;
            if (jainFest)
                badgeText = "\uD83E\uDE94 ".concat(jainFest.name.split(' ')[1] || 'Parva');
            else if (jData.isParvaTithi)
                badgeText = "\uD83E\uDE94 ".concat(((_a = jData.parvaType) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || 'Parva');
            return {
                calendarSystem: 'JAIN',
                eraTitle: "\uD83E\uDE94 Vira Nirvana Samvat ".concat(jData.viraSamvatYear),
                monthName: jData.jainMonthName,
                dayLabel: jData.jainTithiName,
                badgeText: badgeText,
                badgeType: (jainFest || jData.isParvaTithi) ? 'PARVA' : undefined,
                festivalMatch: jainFest || null,
                significance: jainFest ? jainFest.description : (jData.isParvaTithi ? "".concat(jData.jainTithiName, " is a sacred Jain Parva Tithi for Fasting (Upvas), Pachkhan & Dev Vandan.") : 'Jain Vira Nirvana Samvat day observing Ahimsa and self-purification.'),
                additionalDetails: [
                    { label: 'Jain Era', value: "Vira Nirvana Samvat ".concat(jData.viraSamvatYear) },
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
            var tithiIdx = (0, panchangEngine_1.calculateTithiForDate)(date);
            var tithiName = (0, vedicTerms_1.getLocalizedTithi)((tithiIdx % 15) + 1, language).name;
            var hinduMonthName = (0, panchangEngine_1.getHinduMonthName)(date);
            var pakshaFull = (0, vedicTerms_1.getLocalizedPakshaName)(tithiIdx <= 14 ? 'SHUKLA' : 'KRISHNA', language);
            var hinduFest = festivalRepository_1.FESTIVALS.find(function (f) { return f.dateIso === dateIso && f.category !== 'JAIN_FESTIVAL' && f.category !== 'WORLD_FESTIVAL'; });
            var badgeText = undefined;
            if (tithiIdx === 14)
                badgeText = language === 'gu' ? '🌕 પૂનમ (Purnima)' : (language === 'hi' ? '🌕 पूर्णिमा' : '🌕 Purnima');
            else if (tithiIdx === 29)
                badgeText = language === 'gu' ? '🌑 અમાસ (Amavasya)' : (language === 'hi' ? '🌑 अमावस्या' : '🌑 Amavasya');
            else if (tithiIdx === 10 || tithiIdx === 25)
                badgeText = language === 'gu' ? '🌿 અગિયારસ (Ekadashi)' : (language === 'hi' ? '🌿 एकादशी' : '🌿 Ekadashi');
            else if (hinduFest)
                badgeText = (0, festivalRepository_1.getLocalizedFestivalTitle)(hinduFest, language);
            var eraTitle = language === 'gu'
                ? '🕉️ હિન્દુ તિથિ અને પંચાંગ વિગત'
                : (language === 'hi' ? '🕉️ हिंदू तिथि एवं पंचांग विवरण' : '🕉️ Hindu Date & Panchang Details');
            return {
                calendarSystem: 'HINDU',
                eraTitle: eraTitle,
                monthName: "".concat(hinduMonthName, " (").concat(pakshaFull, ")"),
                dayLabel: "".concat(pakshaFull, " ").concat(tithiName),
                badgeText: badgeText,
                badgeType: hinduFest ? 'FESTIVAL' : (tithiIdx === 14 || tithiIdx === 29 || tithiIdx === 10 || tithiIdx === 25 ? 'RITUAL' : undefined),
                festivalMatch: hinduFest || null,
                significance: hinduFest ? hinduFest.description : "Vedic Hindu Panchang day in ".concat(hinduMonthName, " month (").concat(pakshaFull, " ").concat(tithiName, ")."),
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
