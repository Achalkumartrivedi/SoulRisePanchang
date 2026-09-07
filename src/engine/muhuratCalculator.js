"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateMuhurats = calculateMuhurats;
exports.calculateChoghadiya = calculateChoghadiya;
var RAHU_PARTS = [8, 2, 7, 5, 6, 4, 3]; // Sun (0) to Sat (6)
var YAMA_PARTS = [5, 4, 3, 2, 1, 7, 6];
var GULIKA_PARTS = [7, 6, 5, 4, 3, 2, 1];
var CHOGHADIYA_TYPES = {
    AMRIT: { name: 'Amrit', hindiName: 'अमृत', isAuspicious: true },
    SHUBH: { name: 'Shubh', hindiName: 'शुभ', isAuspicious: true },
    LABH: { name: 'Labh', hindiName: 'लाभ', isAuspicious: true },
    CHAR: { name: 'Char', hindiName: 'चल', isAuspicious: true },
    ROG: { name: 'Rog', hindiName: 'रोग', isAuspicious: false },
    KAAL: { name: 'Kaal', hindiName: 'काल', isAuspicious: false },
    UDVEG: { name: 'Udveg', hindiName: 'उद्वेग', isAuspicious: false }
};
var DAY_CHOGHADIYA_SEQ = [
    ['UDVEG', 'AMRIT', 'ROG', 'LABH', 'SHUBH', 'CHAR', 'ROG', 'KAAL'], // Sun
    ['AMRIT', 'KAAL', 'SHUBH', 'ROG', 'UDVEG', 'CHAR', 'LABH', 'AMRIT'], // Mon
    ['ROG', 'UDVEG', 'CHAR', 'LABH', 'AMRIT', 'KAAL', 'SHUBH', 'ROG'], // Tue
    ['LABH', 'AMRIT', 'KAAL', 'SHUBH', 'ROG', 'UDVEG', 'CHAR', 'LABH'], // Wed
    ['SHUBH', 'ROG', 'UDVEG', 'CHAR', 'LABH', 'AMRIT', 'KAAL', 'SHUBH'], // Thu
    ['CHAR', 'LABH', 'AMRIT', 'KAAL', 'SHUBH', 'ROG', 'UDVEG', 'CHAR'], // Fri
    ['KAAL', 'SHUBH', 'ROG', 'UDVEG', 'CHAR', 'LABH', 'AMRIT', 'KAAL'] // Sat
];
function calculateMuhurats(date, sunriseStr, sunsetStr) {
    var dayIndex = date.getDay(); // 0 = Sun
    var _a = parseTimeString(sunriseStr), sHour = _a[0], sMin = _a[1];
    var _b = parseTimeString(sunsetStr), eHour = _b[0], eMin = _b[1];
    var sunriseMin = sHour * 60 + sMin;
    var sunsetMin = eHour * 60 + eMin;
    var dayDurationMin = Math.max(1, sunsetMin - sunriseMin);
    var partMin = dayDurationMin / 8.0;
    // Abhijit Muhurat (middle of day)
    var midDayMin = sunriseMin + (dayDurationMin / 2);
    var abhijitStart = formatMinToTime(midDayMin - 24);
    var abhijitEnd = formatMinToTime(midDayMin + 24);
    var brahmaStart = formatMinToTime(sunriseMin - 96);
    var brahmaEnd = formatMinToTime(sunriseMin - 48);
    var vijayStart = formatMinToTime(midDayMin + 70);
    var vijayEnd = formatMinToTime(midDayMin + 118);
    // Inauspicious
    var rahuPart = RAHU_PARTS[dayIndex];
    var rahuStart = formatMinToTime(sunriseMin + (rahuPart - 1) * partMin);
    var rahuEnd = formatMinToTime(sunriseMin + rahuPart * partMin);
    var yamaPart = YAMA_PARTS[dayIndex];
    var yamaStart = formatMinToTime(sunriseMin + (yamaPart - 1) * partMin);
    var yamaEnd = formatMinToTime(sunriseMin + yamaPart * partMin);
    var gulikaPart = GULIKA_PARTS[dayIndex];
    var gulikaStart = formatMinToTime(sunriseMin + (gulikaPart - 1) * partMin);
    var gulikaEnd = formatMinToTime(sunriseMin + gulikaPart * partMin);
    return {
        auspicious: [
            {
                name: 'Abhijit Muhurat',
                hindiName: 'अभिजित मुहूर्त',
                startTime: abhijitStart,
                endTime: abhijitEnd,
                isAuspicious: true,
                description: 'Most sacred and powerful auspicious window for all major endeavors and ceremonies.'
            },
            {
                name: 'Brahma Muhurat',
                hindiName: 'ब्रह्म मुहूर्त',
                startTime: brahmaStart,
                endTime: brahmaEnd,
                isAuspicious: true,
                description: 'Ideal time for meditation, prayer, spiritual study, and yoga.'
            },
            {
                name: 'Vijaya Muhurat',
                hindiName: 'विजय मुहूर्त',
                startTime: vijayStart,
                endTime: vijayEnd,
                isAuspicious: true,
                description: 'Highly auspicious for beginning new projects, business deals, and journeys.'
            }
        ],
        inauspicious: [
            {
                name: 'Rahu Kalam',
                hindiName: 'राहु काल',
                startTime: rahuStart,
                endTime: rahuEnd,
                isAuspicious: false,
                description: 'Inauspicious time associated with Rahu. Avoid launching new projects or travels.'
            },
            {
                name: 'Yamaganda Kalam',
                hindiName: 'यमगण्ड काल',
                startTime: yamaStart,
                endTime: yamaEnd,
                isAuspicious: false,
                description: 'Inauspicious window ruled by Yama. Avoid important transactions.'
            },
            {
                name: 'Gulika Kalam',
                hindiName: 'गुलिक काल',
                startTime: gulikaStart,
                endTime: gulikaEnd,
                isAuspicious: false,
                description: 'Inauspicious window ruled by Gulika (son of Shani). Avoid beginning vital works.'
            }
        ]
    };
}
function calculateChoghadiya(date, sunriseStr, sunsetStr) {
    var dayIndex = date.getDay();
    var _a = parseTimeString(sunriseStr), sHour = _a[0], sMin = _a[1];
    var _b = parseTimeString(sunsetStr), eHour = _b[0], eMin = _b[1];
    var sunriseMin = sHour * 60 + sMin;
    var sunsetMin = eHour * 60 + eMin;
    var dayDurationMin = Math.max(1, sunsetMin - sunriseMin);
    var dayPartMin = dayDurationMin / 8.0;
    var nightDurationMin = 1440 - dayDurationMin;
    var nightPartMin = nightDurationMin / 8.0;
    var typesDay = DAY_CHOGHADIYA_SEQ[dayIndex];
    var dayChoghadiya = typesDay.map(function (type, i) {
        var meta = CHOGHADIYA_TYPES[type];
        return {
            type: type,
            name: meta.name,
            hindiName: meta.hindiName,
            isAuspicious: meta.isAuspicious,
            startTime: formatMinToTime(sunriseMin + i * dayPartMin),
            endTime: formatMinToTime(sunriseMin + (i + 1) * dayPartMin),
            isDayTime: true
        };
    });
    var typesNight = DAY_CHOGHADIYA_SEQ[(dayIndex + 1) % 7];
    var nightChoghadiya = typesNight.map(function (type, i) {
        var meta = CHOGHADIYA_TYPES[type];
        return {
            type: type,
            name: meta.name,
            hindiName: meta.hindiName,
            isAuspicious: meta.isAuspicious,
            startTime: formatMinToTime(sunsetMin + i * nightPartMin),
            endTime: formatMinToTime(sunsetMin + (i + 1) * nightPartMin),
            isDayTime: false
        };
    });
    return { dayChoghadiya: dayChoghadiya, nightChoghadiya: nightChoghadiya };
}
function parseTimeString(timeStr) {
    // Expected format "hh:mm AM/PM" or "HH:mm"
    var parts = timeStr.split(' ');
    var _a = parts[0].split(':'), hStr = _a[0], mStr = _a[1];
    var h = parseInt(hStr, 10) || 6;
    var m = parseInt(mStr, 10) || 0;
    if (parts.length > 1) {
        var ampm = parts[1].toUpperCase();
        if (ampm === 'PM' && h < 12)
            h += 12;
        if (ampm === 'AM' && h === 12)
            h = 0;
    }
    return [h, m];
}
function formatMinToTime(minutes) {
    var normalized = Math.round(minutes) % 1440;
    if (normalized < 0)
        normalized += 1440;
    var h24 = Math.floor(normalized / 60);
    var m = normalized % 60;
    var h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    var ampm = h24 >= 12 ? 'PM' : 'AM';
    var mFormatted = m < 10 ? "0".concat(m) : "".concat(m);
    var hFormatted = h12 < 10 ? "0".concat(h12) : "".concat(h12);
    return "".concat(hFormatted, ":").concat(mFormatted, " ").concat(ampm);
}
