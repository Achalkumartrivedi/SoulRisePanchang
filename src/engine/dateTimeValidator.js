"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDateInPast = isDateInPast;
exports.isToday = isToday;
exports.isTimeInPastOnDate = isTimeInPastOnDate;
exports.getNextUpcomingTimeSlot = getNextUpcomingTimeSlot;
var muhuratSafetyChecker_1 = require("./muhuratSafetyChecker");
/**
 * Checks if a target date is in the past (before 00:00:00 of today).
 */
function isDateInPast(targetDate) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var target = new Date(targetDate.getTime());
    target.setHours(0, 0, 0, 0);
    return target.getTime() < today.getTime();
}
/**
 * Checks if a target date is TODAY.
 */
function isToday(targetDate) {
    var today = new Date();
    return (targetDate.getFullYear() === today.getFullYear() &&
        targetDate.getMonth() === today.getMonth() &&
        targetDate.getDate() === today.getDate());
}
/**
 * Checks if a selected time string (e.g. "08:00 AM") on targetDate is in the past.
 */
function isTimeInPastOnDate(targetDate, timeStr) {
    if (isDateInPast(targetDate)) {
        return true;
    }
    if (!isToday(targetDate)) {
        return false; // Future date is not in past
    }
    var now = new Date();
    var currentMinutesFromMidnight = now.getHours() * 60 + now.getMinutes();
    var selectedMinutes = (0, muhuratSafetyChecker_1.parseTimeToMinutes)(timeStr);
    return selectedMinutes < currentMinutesFromMidnight;
}
/**
 * Returns the next upcoming time slot formatted as "HH:MM AM/PM".
 * If targetDate is TODAY, picks the next 30-minute window from current time.
 * If targetDate is in the FUTURE, defaults to "08:00 AM".
 */
function getNextUpcomingTimeSlot(targetDate) {
    if (targetDate === void 0) { targetDate = new Date(); }
    if (!isToday(targetDate)) {
        return '08:00 AM';
    }
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    // Round up to next 15/30 minute boundary
    if (m < 15)
        m = 15;
    else if (m < 30)
        m = 30;
    else if (m < 45)
        m = 45;
    else {
        m = 0;
        h = (h + 1) % 24;
    }
    var period = h >= 12 ? 'PM' : 'AM';
    var displayH = h % 12;
    if (displayH === 0)
        displayH = 12;
    var formattedH = displayH < 10 ? "0".concat(displayH) : "".concat(displayH);
    var formattedM = m < 10 ? "0".concat(m) : "".concat(m);
    return "".concat(formattedH, ":").concat(formattedM, " ").concat(period);
}
