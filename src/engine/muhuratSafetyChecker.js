"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTimeToMinutes = parseTimeToMinutes;
exports.analyzeMuhuratSafety = analyzeMuhuratSafety;
var cities_1 = require("../data/cities");
var muhuratCalculator_1 = require("./muhuratCalculator");
var panchangEngine_1 = require("./panchangEngine");
/**
 * Parses time string (e.g. "15:30", "03:30 PM", "8:15 AM") into minutes from midnight (0..1439).
 */
function parseTimeToMinutes(timeStr) {
    if (!timeStr)
        return 0;
    var clean = timeStr.trim().toUpperCase();
    var isPM = clean.includes('PM');
    var isAM = clean.includes('AM');
    var numOnly = clean.replace(/(AM|PM)/g, '').trim();
    var parts = numOnly.split(':');
    var h = parseInt(parts[0] || '0', 10);
    var m = parseInt(parts[1] || '0', 10);
    if (isPM && h < 12)
        h += 12;
    if (isAM && h === 12)
        h = 0;
    return (h % 24) * 60 + (m % 60);
}
/**
 * Analyzes a chosen date and time slot against Vedic Rahu Kalam, Yamagandam, Gulika Kalam,
 * Choghadiya, and Abhijit Muhurat.
 */
function analyzeMuhuratSafety(date, timeStr, city) {
    if (city === void 0) { city = cities_1.DEFAULT_CITIES[0]; }
    var panchang = (0, panchangEngine_1.calculatePanchang)(date, city);
    var sunrise = panchang.sunMoon.sunrise || '06:00 AM';
    var sunset = panchang.sunMoon.sunset || '06:30 PM';
    var muhurats = (0, muhuratCalculator_1.calculateMuhurats)(date, sunrise, sunset);
    var choghadiyas = (0, muhuratCalculator_1.calculateChoghadiya)(date, sunrise, sunset);
    var chosenMin = parseTimeToMinutes(timeStr);
    // Check Rahu Kalam overlap
    var rahuItem = muhurats.inauspicious.find(function (m) { return m.name.includes('Rahu'); });
    var rahuStartMin = rahuItem ? parseTimeToMinutes(rahuItem.startTime) : -1;
    var rahuEndMin = rahuItem ? parseTimeToMinutes(rahuItem.endTime) : -1;
    var rahuKalamConflict = chosenMin >= rahuStartMin && chosenMin <= rahuEndMin;
    // Check Yamaganda overlap
    var yamaItem = muhurats.inauspicious.find(function (m) { return m.name.includes('Yama'); });
    var yamaStartMin = yamaItem ? parseTimeToMinutes(yamaItem.startTime) : -1;
    var yamaEndMin = yamaItem ? parseTimeToMinutes(yamaItem.endTime) : -1;
    var yamagandaConflict = chosenMin >= yamaStartMin && chosenMin <= yamaEndMin;
    // Check Gulika overlap
    var gulikaItem = muhurats.inauspicious.find(function (m) { return m.name.includes('Gulika'); });
    var gulikaStartMin = gulikaItem ? parseTimeToMinutes(gulikaItem.startTime) : -1;
    var gulikaEndMin = gulikaItem ? parseTimeToMinutes(gulikaItem.endTime) : -1;
    var gulikaConflict = chosenMin >= gulikaStartMin && chosenMin <= gulikaEndMin;
    // Check Abhijit Muhurat overlap
    var abhijitItem = muhurats.auspicious.find(function (m) { return m.name.includes('Abhijit'); });
    var abhijitStartMin = abhijitItem ? parseTimeToMinutes(abhijitItem.startTime) : -1;
    var abhijitEndMin = abhijitItem ? parseTimeToMinutes(abhijitItem.endTime) : -1;
    var isAbhijitMuhurat = chosenMin >= abhijitStartMin && chosenMin <= abhijitEndMin;
    // Find active Choghadiya at chosen time
    var activeChoghadiyaName = 'General';
    var activeChoghadiyaHindi = 'सामान्य';
    var isChoghadiyaAuspicious = true;
    var dayChog = choghadiyas.dayChoghadiya;
    var activeChogItem = dayChog.find(function (c) {
        var sMin = parseTimeToMinutes(c.startTime);
        var eMin = parseTimeToMinutes(c.endTime);
        return chosenMin >= sMin && chosenMin <= eMin;
    });
    if (activeChogItem) {
        activeChoghadiyaName = activeChogItem.name;
        activeChoghadiyaHindi = activeChogItem.hindiName;
        isChoghadiyaAuspicious = activeChogItem.isAuspicious;
    }
    var rahuRangeStr = rahuItem ? "".concat(rahuItem.startTime, " - ").concat(rahuItem.endTime) : '03:00 PM - 04:30 PM';
    // Determine overall Safety Rating
    var safetyRating = 'NEUTRAL';
    var title = '🟡 Neutral Time Window (सामान्य समय)';
    var advice = "Active Choghadiya: ".concat(activeChoghadiyaName, " (").concat(activeChoghadiyaHindi, "). Suitable for regular tasks.");
    if (rahuKalamConflict) {
        safetyRating = 'INAUSPICIOUS';
        title = '🔴 ⚠️ Rahu Kalam Active (राहु काल अलर्ट)';
        advice = "Rahu Kalam is active (".concat(rahuRangeStr, "). It is strongly recommended to avoid starting new work, travels, or sacred ceremonies during Rahu Kalam.");
    }
    else if (yamagandaConflict || gulikaConflict) {
        safetyRating = 'INAUSPICIOUS';
        title = '🔴 ⚠️ Yamaganda / Gulika Kalam Active';
        advice = "Yamaganda or Gulika Kalam is active at ".concat(timeStr, ". Consider shifting slot for maximum benefit.");
    }
    else if (isAbhijitMuhurat) {
        safetyRating = 'AUSPICIOUS';
        title = '🟢 ✨ Abhijit Muhurat Active (अभिजित मुहूर्त - श्रेष्ठ)';
        advice = "Selected time falls in Abhijit Muhurat (".concat(abhijitItem === null || abhijitItem === void 0 ? void 0 : abhijitItem.startTime, " - ").concat(abhijitItem === null || abhijitItem === void 0 ? void 0 : abhijitItem.endTime, "). Highly auspicious for all remedies, ceremonies & rituals!");
    }
    else if (isChoghadiyaAuspicious) {
        safetyRating = 'AUSPICIOUS';
        title = "\uD83D\uDFE2 \u2728 Auspicious ".concat(activeChoghadiyaName, " Choghadiya (").concat(activeChoghadiyaHindi, ")");
        advice = "".concat(activeChoghadiyaName, " (").concat(activeChoghadiyaHindi, ") Choghadiya is active. Highly favorable time slot for fasts, remedies & ceremonies!");
    }
    return {
        timeStr: timeStr,
        safetyRating: safetyRating,
        title: title,
        advice: advice,
        rahuKalamConflict: rahuKalamConflict,
        yamagandaConflict: yamagandaConflict,
        gulikaConflict: gulikaConflict,
        activeChoghadiyaName: activeChoghadiyaName,
        activeChoghadiyaHindi: activeChoghadiyaHindi,
        isChoghadiyaAuspicious: isChoghadiyaAuspicious,
        isAbhijitMuhurat: isAbhijitMuhurat,
        rahuKalamRange: rahuRangeStr
    };
}
