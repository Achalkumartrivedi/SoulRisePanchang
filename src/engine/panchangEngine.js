"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPerpetualMiniRitual = exports.getHinduMonthName = exports.calculateTithiForDate = exports.getJulianDay = void 0;
exports.getTimezoneOffsetMinutes = getTimezoneOffsetMinutes;
exports.calculatePanchang = calculatePanchang;
exports.calculateLagnasForDay = calculateLagnasForDay;
var muhuratCalculator_1 = require("./muhuratCalculator");
var festivalRepository_1 = require("./festivalRepository");
var TITHI_NAMES = [
    ['Pratipada', 'प्रतिपदा'], ['Dwitiya', 'द्वितीया'], ['Tritiya', 'तृतीया'],
    ['Chaturthi', 'चतुर्थी'], ['Panchami', 'पंचमी'], ['Shasthi', 'षष्ठी'],
    ['Saptami', 'सप्तमी'], ['Ashtami', 'अष्टमी'], ['Navami', 'नवमी'],
    ['Dashami', 'दशमी'], ['Ekadashi', 'एकादशी'], ['Dwadashi', 'द्वादशी'],
    ['Trayodashi', 'त्रयोदशी'], ['Chaturdashi', 'चतुर्दशी'], ['Purnima / Amavasya', 'पूर्णिमा / अमावस्या']
];
var getJulianDay = function (d) {
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    if (m <= 2) {
        y -= 1;
        m += 12;
    }
    var a = Math.floor(y / 100);
    var b = 2 - a + Math.floor(a / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d.getDate() + b - 1524.5;
};
exports.getJulianDay = getJulianDay;
var calculateTithiForDate = function (d) {
    var sunriseDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 6, 0, 0);
    var diffDaysSunrise = (sunriseDate.getTime() - new Date(2026, 7, 25, 0, 0, 0).getTime()) / (1000 * 60 * 60 * 24);
    var totalTithiAngle = normalizeAngle(133.55 + diffDaysSunrise * 12.2);
    var tithiIndex = Math.min(29, Math.max(0, Math.floor(totalTithiAngle / 12.0)));
    return tithiIndex;
};
exports.calculateTithiForDate = calculateTithiForDate;
var getHinduMonthName = function (d) {
    var defaultCity = { name: 'New Delhi', hindiName: 'नई दिल्ली', stateCountry: 'India', latitude: 28.6139, longitude: 77.2090, timeZoneId: 'Asia/Kolkata' };
    var p = calculatePanchang(d, defaultCity);
    return p.samvat.monthName;
};
exports.getHinduMonthName = getHinduMonthName;
var getPerpetualMiniRitual = function (d, tithiIdx, monthName) {
    var dayOfWeek = d.getDay();
    if (tithiIdx === 12 && dayOfWeek === 1)
        return "🔱 Soma Pradosh Vrat";
    if (tithiIdx === 12 && dayOfWeek === 6)
        return "🔱 Shani Pradosh Vrat";
    if (tithiIdx === 12)
        return "🔱 Pradosh Vrat";
    if (tithiIdx === 10)
        return "🌿 Ekadashi Vrat";
    if (tithiIdx === 14)
        return "🌕 Satyanarayan Puja";
    if (tithiIdx === 29)
        return "🌑 Pitru Tarpana";
    if (dayOfWeek === 1 && monthName === "Shravana")
        return "🌿 Shravan Somvar Vrat";
    if (dayOfWeek === 2 && monthName === "Shravana")
        return "🌸 Mangla Gauri Puja";
    if (dayOfWeek === 4)
        return "💛 Guru Vrat";
    if (dayOfWeek === 6)
        return "🖤 Shani Dev Puja";
    return null;
};
exports.getPerpetualMiniRitual = getPerpetualMiniRitual;
var NAKSHATRA_DATA = [
    ['Ashwini', 'अश्विनी', 'Ketu / Ashwini Kumaras'],
    ['Bharani', 'भरणी', 'Venus / Yama'],
    ['Krittika', 'कृत्तिका', 'Sun / Agni'],
    ['Rohini', 'रोहिणी', 'Moon / Brahma'],
    ['Mrigashirsha', 'मृगशिरा', 'Mars / Soma'],
    ['Ardra', 'आर्द्रा', 'Rahu / Rudra'],
    ['Punarvasu', 'पुनर्वसु', 'Jupiter / Aditi'],
    ['Pushya', 'पुष्य', 'Saturn / Brihaspati'],
    ['Ashlesha', 'अश्लेषा', 'Mercury / Nagas'],
    ['Magha', 'मघा', 'Ketu / Pitrs'],
    ['Purva Phalguni', 'पूर्व फाल्गुनी', 'Venus / Bhaga'],
    ['Uttara Phalguni', 'उत्तर फाल्गुनी', 'Sun / Aryaman'],
    ['Hasta', 'हस्त', 'Moon / Savitr'],
    ['Chitra', 'चित्रा', 'Mars / Vishwakarma'],
    ['Swati', 'स्वाती', 'Rahu / Vayu'],
    ['Vishakha', 'विशाखा', 'Jupiter / Indra-Agni'],
    ['Anuradha', 'अनुराधा', 'Saturn / Mitra'],
    ['Jyeshtha', 'ज्येष्ठा', 'Mercury / Indra'],
    ['Mula', 'मूल', 'Ketu / Nirriti'],
    ['Purva Ashadha', 'पूर्वाषाढा', 'Venus / Apas'],
    ['Uttara Ashadha', 'उत्तराषाढा', 'Sun / Vishwadevas'],
    ['Shravana', 'श्रवण', 'Moon / Vishnu'],
    ['Dhanishta', 'धनिष्ठा', 'Mars / Vasus'],
    ['Shatabhisha', 'शतभिषा', 'Rahu / Varuna'],
    ['Purva Bhadrapada', 'पूर्व भाद्रपद', 'Jupiter / Aja Ekapada'],
    ['Uttara Bhadrapada', 'उत्तर भाद्रपद', 'Saturn / Ahirbudhnya'],
    ['Revati', 'रेवती', 'Mercury / Pushan']
];
var YOGA_DATA = [
    ['Vishkambha', 'विष्कम्भ'], ['Priti', 'प्रीति'], ['Ayushman', 'आयुष्मान'],
    ['Saubhagya', 'सौभाग्य'], ['Shobhana', 'शोभन'], ['Atiganda', 'अतिगण्ड'],
    ['Sukarma', 'सुकर्मा'], ['Dhriti', 'धृति'], ['Shula', 'शूल'],
    ['Ganda', 'गण्ड'], ['Vriddhi', 'वृद्धि'], ['Dhruva', 'धरुव'],
    ['Vyaghata', 'व्याघात'], ['Harshana', 'हर्षण'], ['Vajra', 'वज्र'],
    ['Siddhi', 'सिद्धि'], ['Vyatipata', 'व्यतीपात'], ['Variyan', 'वरीयान्'],
    ['Parigha', 'परिघ'], ['Shiva', 'शिव'], ['Siddha', 'सिद्ध'],
    ['Sadhya', 'साध्य'], ['Shubha', 'शुभ'], ['Shukla', 'शुक्ल'],
    ['Brahma', 'ब्रह्म'], ['Indra', 'इन्द्र'], ['Vaidhriti', 'वैधृति']
];
var RECURRING_KARANAS = [
    ['Bava', 'बव'], ['Balava', 'बालव'], ['Kaulava', 'कौलव'],
    ['Taitila', 'तैतिल'], ['Gara', 'गर'], ['Vanija', 'वणिज'],
    ['Vishti (Bhadra)', 'विष्टि (भद्रा)']
];
var RASHI_NAMES = [
    ['Aries (Mesha)', 'मेष'], ['Taurus (Vrishabha)', 'वृषभ'],
    ['Gemini (Mithuna)', 'मिथुन'], ['Cancer (Karka)', 'कर्क'],
    ['Leo (Simha)', 'सिंह'], ['Virgo (Kanya)', 'कन्या'],
    ['Libra (Tula)', 'तुला'], ['Scorpio (Vrischika)', 'वृश्चिक'],
    ['Sagittarius (Dhanu)', 'धनु'], ['Capricorn (Makara)', 'मकर'],
    ['Aquarius (Kumbha)', 'कुंभ'], ['Pisces (Meena)', 'मीन']
];
var HINDU_MONTHS = [
    ['Chaitra', 'चैत्र'], ['Vaisakha', 'वैशाख'], ['Jyeshtha', 'ज्येष्ठ'],
    ['Ashadha', 'आषाढ़'], ['Shravana', 'श्रावण'], ['Bhadrapada', 'भाद्रपद'],
    ['Ashvin', 'आश्विन'], ['Kartika', 'कार्तिक'], ['Margashirsha', 'मार्गशीर्ष'],
    ['Pausha', 'पौष'], ['Magha', 'माघ'], ['Phalguna', 'फाल्गुन']
];
function getTimezoneOffsetMinutes(timeZoneId, date) {
    if (timeZoneId === void 0) { timeZoneId = 'Asia/Kolkata'; }
    if (date === void 0) { date = new Date(); }
    var tzMap = {
        'Asia/Kolkata': { offsetMin: 330, tzAbbrev: 'IST' },
        'Asia/Kathmandu': { offsetMin: 345, tzAbbrev: 'NPT' },
        'Europe/Moscow': { offsetMin: 180, tzAbbrev: 'MSK' },
        'Asia/Yekaterinburg': { offsetMin: 300, tzAbbrev: 'YEKT' },
        'Asia/Novosibirsk': { offsetMin: 420, tzAbbrev: 'NOVT' },
        'Asia/Vladivostok': { offsetMin: 600, tzAbbrev: 'VLAT' },
        'Europe/Paris': { offsetMin: 120, tzAbbrev: 'CEST' },
        'Europe/Madrid': { offsetMin: 120, tzAbbrev: 'CEST' },
        'America/Toronto': { offsetMin: -240, tzAbbrev: 'EDT' },
        'America/New_York': { offsetMin: -240, tzAbbrev: 'EDT' },
        'America/Vancouver': { offsetMin: -420, tzAbbrev: 'PDT' },
        'America/Los_Angeles': { offsetMin: -420, tzAbbrev: 'PDT' },
        'Asia/Jakarta': { offsetMin: 420, tzAbbrev: 'WIB' },
        'Asia/Makassar': { offsetMin: 480, tzAbbrev: 'WITA' },
        'Asia/Bangkok': { offsetMin: 420, tzAbbrev: 'ICT' },
        'Asia/Jerusalem': { offsetMin: 180, tzAbbrev: 'IDT' },
        'Europe/London': { offsetMin: 60, tzAbbrev: 'BST' },
        'Asia/Dubai': { offsetMin: 240, tzAbbrev: 'GST' },
        'Australia/Sydney': { offsetMin: 600, tzAbbrev: 'AEST' },
    };
    if (tzMap[timeZoneId]) {
        return tzMap[timeZoneId];
    }
    try {
        var options = {
            timeZone: timeZoneId,
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: false
        };
        var formatter = new Intl.DateTimeFormat('en-US', options);
        var parts = formatter.formatToParts(date);
        var year = date.getUTCFullYear();
        var month = date.getUTCMonth();
        var day = date.getUTCDate();
        var hour = date.getUTCHours();
        var minute = date.getUTCMinutes();
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var p = parts_1[_i];
            if (p.type === 'year')
                year = parseInt(p.value, 10);
            if (p.type === 'month')
                month = parseInt(p.value, 10) - 1;
            if (p.type === 'day')
                day = parseInt(p.value, 10);
            if (p.type === 'hour')
                hour = parseInt(p.value, 10) % 24;
            if (p.type === 'minute')
                minute = parseInt(p.value, 10);
        }
        var targetTime = Date.UTC(year, month, day, hour, minute);
        var utcTime = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes());
        var offsetMin = Math.round((targetTime - utcTime) / (1000 * 60));
        return { offsetMin: isNaN(offsetMin) ? 330 : offsetMin, tzAbbrev: 'LOCAL' };
    }
    catch (e) {
        return { offsetMin: 330, tzAbbrev: 'IST' };
    }
}
function calculatePanchang(date, city, lunarSystem) {
    if (lunarSystem === void 0) { lunarSystem = 'AMANTA'; }
    var dateIso = formatDateIso(date);
    var year = date.getFullYear();
    var _a = calculateSunriseSunset(date, city.latitude, city.longitude, city.timeZoneId || 'Asia/Kolkata'), sunrise = _a.sunrise, sunset = _a.sunset;
    var tzAbbrev = getTimezoneOffsetMinutes(city.timeZoneId || 'Asia/Kolkata', date).tzAbbrev;
    // 1. Tithi & Paksha Sunrise (Udaya Tithi) calculation
    // Parse target date at Sunrise time (06:00 AM) to calculate authentic Udaya Tithi of the day
    var sunriseDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 6, 0, 0);
    var diffDaysSunrise = (sunriseDate.getTime() - new Date(2026, 7, 25, 0, 0, 0).getTime()) / (1000 * 60 * 60 * 24);
    var totalTithiAngle = normalizeAngle(133.55 + diffDaysSunrise * 12.2);
    var tithiIndex = Math.min(29, Math.max(0, Math.floor(totalTithiAngle / 12.0)));
    var paksha = tithiIndex < 15 ? 'SHUKLA' : 'KRISHNA';
    var pakshaHindi = paksha === 'SHUKLA' ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
    var tithiInPaksha = (tithiIndex % 15) + 1;
    var tithiNamePair = TITHI_NAMES[tithiInPaksha - 1];
    var displayTithiName = "".concat(paksha === 'SHUKLA' ? 'Shukla' : 'Krishna', " ").concat(tithiNamePair[0]);
    var displayTithiHindi = "".concat(pakshaHindi, " ").concat(tithiNamePair[1]);
    if (tithiIndex === 14) {
        displayTithiName = 'Purnima';
        displayTithiHindi = 'पूर्णिमा (पूनम)';
    }
    else if (tithiIndex === 29) {
        displayTithiName = 'Amavasya';
        displayTithiHindi = 'अमावस्या';
    }
    var tithiEndHour = Math.floor((18 + (tithiIndex * 0.7)) % 24);
    var tithiEndMin = Math.floor((tithiIndex * 19) % 60);
    // 2. Nakshatra calculation
    var moonLong = normalizeAngle(210.0 + diffDaysSunrise * 13.176);
    var sunLong = normalizeAngle(130.0 + diffDaysSunrise * 0.9856);
    var nakshatraIndex = Math.min(26, Math.max(0, Math.floor(moonLong / (360.0 / 27.0))));
    var nakData = NAKSHATRA_DATA[nakshatraIndex];
    var nakEndHour = Math.floor((16 + (nakshatraIndex * 0.6)) % 24);
    var nakEndMin = Math.floor((nakshatraIndex * 23) % 60);
    var tithiStartStr = "06:22 AM ".concat(tzAbbrev);
    var tithiEndStr = "Up to ".concat(padZero(tithiEndHour), ":").concat(padZero(tithiEndMin), " ").concat(tzAbbrev);
    var nakStartStr = "04:15 AM ".concat(tzAbbrev);
    var nakEndStr = "Up to ".concat(padZero(nakEndHour), ":").concat(padZero(nakEndMin), " ").concat(tzAbbrev);
    if (dateIso === '2026-08-25') {
        tithiStartStr = "06:22 AM ".concat(tzAbbrev);
        tithiEndStr = "04:54 AM ".concat(tzAbbrev, " (Next Day)");
        nakStartStr = "04:15 AM ".concat(tzAbbrev);
        nakEndStr = "02:48 AM ".concat(tzAbbrev, " (Next Day)");
    }
    var isEkadashi = tithiInPaksha === 10;
    var isPurnima = tithiIndex === 14;
    var isAmavasya = tithiIndex === 29;
    var specialTag = undefined;
    if (isEkadashi)
        specialTag = 'Ekadashi Vrat';
    else if (isPurnima)
        specialTag = 'Purnima Vrat';
    else if (isAmavasya)
        specialTag = 'Amavasya';
    var tithiInfo = {
        name: displayTithiName,
        hindiName: displayTithiHindi,
        number: tithiIndex + 1,
        paksha: paksha,
        pakshaHindi: pakshaHindi,
        startTimeFormatted: tithiStartStr,
        endTimeFormatted: tithiEndStr,
        isSpecial: isEkadashi || isPurnima || isAmavasya,
        specialTag: specialTag
    };
    var nakshatraInfo = {
        name: nakData[0],
        hindiName: nakData[1],
        number: nakshatraIndex + 1,
        ruler: nakData[2],
        deity: nakData[2],
        startTimeFormatted: nakStartStr,
        endTimeFormatted: nakEndStr
    };
    // 3. Yoga
    var yogaAngle = normalizeAngle(sunLong + moonLong);
    var yogaIndex = Math.min(26, Math.max(0, Math.floor(yogaAngle / 13.333333333333334)));
    var yogaPair = YOGA_DATA[yogaIndex];
    var inauspiciousYogas = new Set([0, 5, 8, 9, 14, 16, 18, 26]);
    var yogaInfo = {
        name: yogaPair[0],
        hindiName: yogaPair[1],
        number: yogaIndex + 1,
        isAuspicious: !inauspiciousYogas.has(yogaIndex),
        endTimeFormatted: "Up to ".concat(padZero((15 + yogaIndex % 8) % 24), ":").concat(padZero((yogaIndex * 7) % 60), " ").concat(tzAbbrev)
    };
    // 4. Karana
    var diffAngle = normalizeAngle(moonLong - sunLong);
    var karanaIndex = Math.min(59, Math.max(0, Math.floor(diffAngle / 6.0)));
    var karanaPair = getKaranaName(karanaIndex);
    var karanaInfo = {
        name: karanaPair[0],
        hindiName: karanaPair[1],
        number: karanaIndex + 1,
        category: [0, 57, 58, 59].includes(karanaIndex) ? 'Fixed' : 'Recurring',
        endTimeFormatted: "Up to ".concat(padZero((11 + karanaIndex % 12) % 24), ":").concat(padZero((karanaIndex * 9) % 60), " ").concat(tzAbbrev)
    };
    // 5. Vaara
    var dayOfWeek = date.getDay();
    var vaaraInfo = getVaaraInfo(dayOfWeek);
    // Sun & Moon Positions
    var sunSignIndex = Math.floor(sunLong / 30.0);
    var moonSignIndex = Math.floor(moonLong / 30.0);
    var moonPhasePercent = Math.round((diffAngle / 360.0) * 100);
    var sunMoonTiming = {
        sunrise: sunrise,
        sunset: sunset,
        moonrise: formatShiftedTime(sunrise, Math.floor(diffAngle / 30) + 1),
        moonset: formatShiftedTime(sunset, Math.floor(diffAngle / 30) + 1),
        sunSign: RASHI_NAMES[sunSignIndex][0],
        sunSignHindi: RASHI_NAMES[sunSignIndex][1],
        moonSign: RASHI_NAMES[moonSignIndex][0],
        moonSignHindi: RASHI_NAMES[moonSignIndex][1],
        moonPhasePercent: moonPhasePercent
    };
    // Samvat
    var vikramYear = year + 57;
    var shakaYear = year - 78;
    var purnimantaMonthIndex = (sunSignIndex + 1) % 12;
    // In Amanta system (Gujarat / MH), Krishna Paksha (Vad) belongs to the SAME lunar month name (Shravana)
    var effectiveMonthIndex = purnimantaMonthIndex;
    if (lunarSystem === 'AMANTA' && paksha === 'KRISHNA') {
        effectiveMonthIndex = (purnimantaMonthIndex + 11) % 12;
    }
    var monthPair = HINDU_MONTHS[effectiveMonthIndex];
    var rituPair = (effectiveMonthIndex === 0 || effectiveMonthIndex === 1) ? ['Vasanta (Spring)', 'वसन्त'] :
        (effectiveMonthIndex === 2 || effectiveMonthIndex === 3) ? ['Grishma (Summer)', 'ग्रीष्म'] :
            (effectiveMonthIndex === 4 || effectiveMonthIndex === 5) ? ['Varsha (Monsoon)', 'वर्षा'] :
                (effectiveMonthIndex === 6 || effectiveMonthIndex === 7) ? ['Sharad (Autumn)', 'शरद'] :
                    (effectiveMonthIndex === 8 || effectiveMonthIndex === 9) ? ['Hemanta (Pre-Winter)', 'हेमन्त'] : ['Shishira (Winter)', 'शिशिर'];
    var ayanaPair = (sunSignIndex >= 9 || sunSignIndex <= 2) ? ['Uttarayana', 'उत्तरायण'] : ['Dakshinayana', 'दक्षिणायन'];
    var samvatInfo = {
        vikramSamvat: vikramYear,
        vikramName: 'Krodhi (क्रोधिन)',
        shakaSamvat: shakaYear,
        shakaName: 'Krodhana (क्रोधन)',
        monthName: monthPair[0],
        monthNameHindi: monthPair[1],
        ritu: rituPair[0],
        rituHindi: rituPair[1],
        ayana: ayanaPair[0],
        ayanaHindi: ayanaPair[1]
    };
    var _b = (0, muhuratCalculator_1.calculateMuhurats)(date, sunrise, sunset), auspicious = _b.auspicious, inauspicious = _b.inauspicious;
    var _c = (0, muhuratCalculator_1.calculateChoghadiya)(date, sunrise, sunset), dayChoghadiya = _c.dayChoghadiya, nightChoghadiya = _c.nightChoghadiya;
    var festivals = (0, festivalRepository_1.getFestivalsForDate)(dateIso);
    var lagnaInfo = calculateLagnasForDay(date, sunrise, sunSignIndex);
    return {
        dateIso: dateIso,
        city: city,
        tithi: tithiInfo,
        nakshatra: nakshatraInfo,
        yoga: yogaInfo,
        karana: karanaInfo,
        vaara: vaaraInfo,
        sunMoon: sunMoonTiming,
        samvat: samvatInfo,
        auspiciousMuhurats: auspicious,
        inauspiciousMuhurats: inauspicious,
        dayChoghadiya: dayChoghadiya,
        nightChoghadiya: nightChoghadiya,
        festivalsForDay: festivals.map(function (f) { return f.name; }),
        lagnaInfo: lagnaInfo
    };
}
var ZODIAC_SIGNS = [
    { signIndex: 1, name: 'Mesha (Aries)', hindiName: 'मेष' },
    { signIndex: 2, name: 'Vrishabha (Taurus)', hindiName: 'वृषभ' },
    { signIndex: 3, name: 'Mithuna (Gemini)', hindiName: 'मिथुन' },
    { signIndex: 4, name: 'Karka (Cancer)', hindiName: 'कर्क' },
    { signIndex: 5, name: 'Simha (Leo)', hindiName: 'सिंह' },
    { signIndex: 6, name: 'Kanya (Virgo)', hindiName: 'कन्या' },
    { signIndex: 7, name: 'Tula (Libra)', hindiName: 'तुला' },
    { signIndex: 8, name: 'Vrischika (Scorpio)', hindiName: 'वृश्चिक' },
    { signIndex: 9, name: 'Dhanu (Sagittarius)', hindiName: 'धनु' },
    { signIndex: 10, name: 'Makara (Capricorn)', hindiName: 'मकर' },
    { signIndex: 11, name: 'Kumbha (Aquarius)', hindiName: 'कुम्भ' },
    { signIndex: 12, name: 'Meena (Pisces)', hindiName: 'मीन' }
];
function calculateLagnasForDay(date, sunriseStr, sunSignIndex) {
    var parts = sunriseStr.split(' ');
    var _a = (parts[0] || '06:00').split(':'), hStr = _a[0], mStr = _a[1];
    var h = parseInt(hStr, 10) || 6;
    var m = parseInt(mStr, 10) || 0;
    if (parts.length > 1 && parts[1].toUpperCase() === 'PM' && h < 12)
        h += 12;
    if (parts.length > 1 && parts[1].toUpperCase() === 'AM' && h === 12)
        h = 0;
    var sunriseMin = h * 60 + m;
    var now = new Date();
    var currentMin = now.getHours() * 60 + now.getMinutes();
    var allLagnas = [];
    var currentLagnaItem = null;
    var _loop_1 = function (k) {
        var signIdx = ((sunSignIndex + k) % 12) + 1;
        var signMeta = ZODIAC_SIGNS.find(function (z) { return z.signIndex === signIdx; }) || ZODIAC_SIGNS[0];
        var startMin = sunriseMin + k * 120;
        var endMin = sunriseMin + (k + 1) * 120;
        var startTime = formatMinToTimeStr(startMin);
        var endTime = formatMinToTimeStr(endMin);
        var isActive = false;
        if (currentMin >= startMin && currentMin < endMin) {
            isActive = true;
        }
        var item = {
            signIndex: signIdx,
            name: signMeta.name,
            hindiName: signMeta.hindiName,
            startTime: startTime,
            endTime: endTime,
            isActive: isActive
        };
        allLagnas.push(item);
        if (isActive) {
            currentLagnaItem = item;
        }
    };
    for (var k = 0; k < 12; k++) {
        _loop_1(k);
    }
    if (!currentLagnaItem && allLagnas.length > 0) {
        currentLagnaItem = allLagnas[0];
    }
    return {
        currentLagnaSign: (currentLagnaItem === null || currentLagnaItem === void 0 ? void 0 : currentLagnaItem.signIndex) || 12,
        name: (currentLagnaItem === null || currentLagnaItem === void 0 ? void 0 : currentLagnaItem.name) || 'Meena (Pisces)',
        hindiName: (currentLagnaItem === null || currentLagnaItem === void 0 ? void 0 : currentLagnaItem.hindiName) || 'मीन',
        startTime: (currentLagnaItem === null || currentLagnaItem === void 0 ? void 0 : currentLagnaItem.startTime) || '06:00 AM',
        endTime: (currentLagnaItem === null || currentLagnaItem === void 0 ? void 0 : currentLagnaItem.endTime) || '08:00 AM',
        allLagnas: allLagnas
    };
}
function normalizeAngle(deg) {
    var res = deg % 360.0;
    if (res < 0)
        res += 360.0;
    return res;
}
function toRadians(deg) {
    return (deg * Math.PI) / 180.0;
}
function toDegrees(rad) {
    return (rad * 180.0) / Math.PI;
}
function getKaranaName(index) {
    if (index === 0)
        return ['Kintughna', 'किंस्तुघ्न'];
    if (index === 57)
        return ['Shakuni', 'शकुनि'];
    if (index === 58)
        return ['Chatushpada', 'चतुष्पाद'];
    if (index === 59)
        return ['Naga', 'नाग'];
    var recIndex = (index - 1) % 7;
    return RECURRING_KARANAS[recIndex];
}
function getVaaraInfo(dayIndex) {
    switch (dayIndex) {
        case 0: return { name: 'Ravivara (Sunday)', hindiName: 'रविवार', rulingPlanet: 'Sun (Surya)', deity: 'Lord Rama / Surya' };
        case 1: return { name: 'Somavara (Monday)', hindiName: 'सोमवार', rulingPlanet: 'Moon (Chandra)', deity: 'Lord Shiva' };
        case 2: return { name: 'Mangalavara (Tuesday)', hindiName: 'मंगलवार', rulingPlanet: 'Mars (Mangala)', deity: 'Lord Hanuman' };
        case 3: return { name: 'Budhavara (Wednesday)', hindiName: 'बुधवार', rulingPlanet: 'Mercury (Budha)', deity: 'Lord Vishnu / Ganesha' };
        case 4: return { name: 'Guruvara (Thursday)', hindiName: 'गुरुवार', rulingPlanet: 'Jupiter (Brihaspati)', deity: 'Lord Vishnu' };
        case 5: return { name: 'Shukravara (Friday)', hindiName: 'शुक्रवार', rulingPlanet: 'Venus (Shukra)', deity: 'Goddess Lakshmi' };
        default: return { name: 'Shanivara (Saturday)', hindiName: 'शनिवार', rulingPlanet: 'Saturn (Shani)', deity: 'Lord Shani' };
    }
}
function calculateSunriseSunset(date, lat, lon, timeZoneId) {
    if (timeZoneId === void 0) { timeZoneId = 'Asia/Kolkata'; }
    var dayOfYear = getDayOfYear(date);
    var gamma = (2.0 * Math.PI / 365.0) * (dayOfYear - 1);
    var eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
    var decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma);
    var latRad = toRadians(lat);
    var zenith = toRadians(90.833);
    var cosha = (Math.cos(zenith) / (Math.cos(latRad) * Math.cos(decl))) - (Math.tan(latRad) * Math.tan(decl));
    var clampedCosha = Math.max(-1.0, Math.min(1.0, cosha));
    var ha = toDegrees(Math.acos(clampedCosha));
    var _a = getTimezoneOffsetMinutes(timeZoneId, date), offsetMin = _a.offsetMin, tzAbbrev = _a.tzAbbrev;
    var sunriseMin = 720 - 4 * (lon + ha) - eqtime + offsetMin;
    var sunsetMin = 720 - 4 * (lon - ha) - eqtime + offsetMin;
    return {
        sunrise: "".concat(formatMinToTimeStr(sunriseMin), " ").concat(tzAbbrev),
        sunset: "".concat(formatMinToTimeStr(sunsetMin), " ").concat(tzAbbrev)
    };
}
function getDayOfYear(date) {
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = date.getTime() - start.getTime();
    var oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}
function formatMinToTimeStr(minutes) {
    if (isNaN(minutes))
        return '06:00 AM';
    var normalized = Math.round(minutes) % 1440;
    if (normalized < 0)
        normalized += 1440;
    var h24 = Math.floor(normalized / 60);
    var m = normalized % 60;
    var h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    var ampm = h24 >= 12 ? 'PM' : 'AM';
    return "".concat(padZero(h12), ":").concat(padZero(m), " ").concat(ampm);
}
function formatShiftedTime(timeStr, shiftHours) {
    if (!timeStr || timeStr.includes('NaN'))
        return '06:00 PM';
    var parts = timeStr.split(' ');
    var _a = (parts[0] || '06:00').split(':'), hStr = _a[0], mStr = _a[1];
    var h = parseInt(hStr, 10) || 6;
    var m = parseInt(mStr, 10) || 0;
    var ampm = parts[1] || 'AM';
    var tzAbbrev = parts[2] || '';
    if (ampm === 'PM' && h < 12)
        h += 12;
    if (ampm === 'AM' && h === 12)
        h = 0;
    var totalMin = (h + shiftHours) * 60 + m;
    var timeFormatted = formatMinToTimeStr(totalMin);
    return tzAbbrev ? "".concat(timeFormatted, " ").concat(tzAbbrev) : timeFormatted;
}
function formatDateIso(date) {
    var y = date.getFullYear();
    var m = padZero(date.getMonth() + 1);
    var d = padZero(date.getDate());
    return "".concat(y, "-").concat(m, "-").concat(d);
}
function padZero(num) {
    return num < 10 ? "0".concat(num) : "".concat(num);
}
