"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUpcoming5DatesForTithi = findUpcoming5DatesForTithi;
var panchangEngine_1 = require("./panchangEngine");
var cities_1 = require("../data/cities");
var DAY_NAMES = ['Sunday (रविवार)', 'Monday (सोमवार)', 'Tuesday (मंगलवार)', 'Wednesday (बुधवार)', 'Thursday (गुरुवार)', 'Friday (शुक्रवार)', 'Saturday (शनिवार)'];
var MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/**
 * Normalizes Tithi search queries e.g. "Purnima / Poonam" -> "Purnima", "Ekadashi" -> "Ekadashi"
 */
function normalizeTithiKey(rawName) {
    var clean = rawName.toUpperCase();
    if (clean.includes('PURNIMA') || clean.includes('POONAM'))
        return 'PURNIMA';
    if (clean.includes('AMAVASYA'))
        return 'AMAVASYA';
    if (clean.includes('EKADASHI'))
        return 'EKADASHI';
    if (clean.includes('PRADOSH') || clean.includes('TRAYODASHI'))
        return 'TRAYODASHI';
    if (clean.includes('CHATURTHI'))
        return 'CHATURTHI';
    if (clean.includes('ASHTAMI'))
        return 'ASHTAMI';
    if (clean.includes('NAVAMI'))
        return 'NAVAMI';
    if (clean.includes('PRATIPADA'))
        return 'PRATIPADA';
    if (clean.includes('DWITIYA'))
        return 'DWITIYA';
    if (clean.includes('TRITIYA'))
        return 'TRITIYA';
    if (clean.includes('PANCHAMI'))
        return 'PANCHAMI';
    if (clean.includes('SHASTHI'))
        return 'SHASTHI';
    if (clean.includes('SAPTAMI'))
        return 'SAPTAMI';
    if (clean.includes('DASHAMI'))
        return 'DASHAMI';
    if (clean.includes('DWADASHI'))
        return 'DWADASHI';
    if (clean.includes('CHATURDASHI'))
        return 'CHATURDASHI';
    return clean;
}
/**
 * Scans forward from startDate to find the NEXT 5 UPCOMING calendar dates for a given Tithi.
 */
function findUpcoming5DatesForTithi(tithiSearchName, startDate) {
    if (startDate === void 0) { startDate = new Date(); }
    var results = [];
    var key = normalizeTithiKey(tithiSearchName);
    // Scan up to 180 days into the future
    var maxDaysToScan = 180;
    var cursor = new Date(startDate.getTime());
    var lastFoundDateIso = '';
    for (var i = 0; i < maxDaysToScan && results.length < 5; i++) {
        var y = cursor.getFullYear();
        var m = cursor.getMonth();
        var d = cursor.getDate();
        var mStr = m + 1 < 10 ? "0".concat(m + 1) : "".concat(m + 1);
        var dStr = d < 10 ? "0".concat(d) : "".concat(d);
        var dateIso = "".concat(y, "-").concat(mStr, "-").concat(dStr);
        var panchang = (0, panchangEngine_1.calculatePanchang)(cursor, cities_1.DEFAULT_CITIES[0]);
        var tNameUpper = (panchang.tithi.name || '').toUpperCase();
        var pakshaUpper = (panchang.tithi.paksha || '').toUpperCase();
        var matches = false;
        if (key === 'PURNIMA') {
            matches = tNameUpper.includes('PURNIMA') || tNameUpper.includes('POONAM') || (pakshaUpper === 'SHUKLA' && panchang.tithi.number === 15);
        }
        else if (key === 'AMAVASYA') {
            matches = tNameUpper.includes('AMAVASYA') || (pakshaUpper === 'KRISHNA' && panchang.tithi.number === 15);
        }
        else if (key === 'EKADASHI') {
            matches = tNameUpper.includes('EKADASHI') || panchang.tithi.number === 11;
        }
        else if (key === 'TRAYODASHI') {
            matches = tNameUpper.includes('TRAYODASHI') || panchang.tithi.number === 13;
        }
        else if (key === 'CHATURTHI') {
            matches = tNameUpper.includes('CHATURTHI') || panchang.tithi.number === 4;
        }
        else if (key === 'ASHTAMI') {
            matches = tNameUpper.includes('ASHTAMI') || panchang.tithi.number === 8;
        }
        else if (key === 'NAVAMI') {
            matches = tNameUpper.includes('NAVAMI') || panchang.tithi.number === 9;
        }
        else {
            matches = tNameUpper.includes(key);
        }
        if (matches && dateIso !== lastFoundDateIso) {
            lastFoundDateIso = dateIso;
            var dayOfWeekIdx = cursor.getDay();
            var dateDisplay = "".concat(d, " ").concat(MONTH_SHORT[m], " ").concat(y);
            var dayOfWeekName = DAY_NAMES[dayOfWeekIdx];
            var tithiFullText = "".concat(panchang.tithi.paksha, " ").concat(panchang.tithi.name);
            results.push({
                dateIso: dateIso,
                dateDisplay: dateDisplay,
                dayOfWeekName: dayOfWeekName,
                tithiFullText: tithiFullText
            });
        }
        // Move to next day
        cursor.setDate(cursor.getDate() + 1);
    }
    return results;
}
