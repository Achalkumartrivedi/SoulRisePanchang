"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupReminderNotificationChannel = setupReminderNotificationChannel;
exports.parseTimeStrToHourMin = parseTimeStrToHourMin;
exports.cancelReminderNotifications = cancelReminderNotifications;
exports.scheduleSingleReminderNotification = scheduleSingleReminderNotification;
exports.rescheduleAllReminders = rescheduleAllReminders;
var Notifications = __importStar(require("expo-notifications"));
var react_native_1 = require("react-native");
var tithiDateFinder_1 = require("../engine/tithiDateFinder");
var REMINDER_CHANNEL_ID = 'soulrise-reminder-channel';
/**
 * Configure Android notification channel for high-priority user reminders
 */
function setupReminderNotificationChannel() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(react_native_1.Platform.OS === 'android')) return [3 /*break*/, 2];
                    return [4 /*yield*/, Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
                            name: 'Sacred Reminders & Vrat Alerts',
                            importance: Notifications.AndroidImportance.HIGH,
                            vibrationPattern: [0, 500, 250, 500],
                            lightColor: '#FFD700',
                            sound: 'default',
                            showBadge: true,
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
/**
 * Parse time strings like "08:30 AM", "06:45 PM", "18:30", "8:00 AM" into { hour, minute }
 */
function parseTimeStrToHourMin(timeStr) {
    if (!timeStr)
        return { hour: 8, minute: 0 };
    var trimmed = timeStr.trim();
    var parts = trimmed.split(' ');
    var _a = (parts[0] || '08:00').split(':'), hStr = _a[0], mStr = _a[1];
    var hour = parseInt(hStr, 10) || 8;
    var minute = parseInt(mStr, 10) || 0;
    if (parts.length > 1) {
        var ampm = parts[1].toUpperCase();
        if (ampm === 'PM' && hour < 12)
            hour += 12;
        if (ampm === 'AM' && hour === 12)
            hour = 0;
    }
    return { hour: hour, minute: minute };
}
/**
 * Cancel existing scheduled local notifications for a specific reminder ID
 */
function cancelReminderNotifications(reminderId) {
    return __awaiter(this, void 0, void 0, function () {
        var scheduled, _i, scheduled_1, notif, e_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, Notifications.getAllScheduledNotificationsAsync()];
                case 1:
                    scheduled = _b.sent();
                    _i = 0, scheduled_1 = scheduled;
                    _b.label = 2;
                case 2:
                    if (!(_i < scheduled_1.length)) return [3 /*break*/, 5];
                    notif = scheduled_1[_i];
                    if (!(notif.identifier.startsWith("rem_".concat(reminderId)) || ((_a = notif.content.data) === null || _a === void 0 ? void 0 : _a.reminderId) === reminderId)) return [3 /*break*/, 4];
                    return [4 /*yield*/, Notifications.cancelScheduledNotificationAsync(notif.identifier).catch(function () { })];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_1 = _b.sent();
                    console.error('Error canceling reminder notifications:', e_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
/**
 * Schedule local OS notifications for a single ReminderItem
 */
function scheduleSingleReminderNotification(item) {
    return __awaiter(this, void 0, void 0, function () {
        var status_1, req, title, body, now, slots, scheduledCount, i, timeSlot, _a, hour, minute, dayIdx, expoWeekday, i, timeSlot, _b, hour, minute, datesToSchedule_1, upcoming, _c, hour, minute, i, dateIso, _d, year, month, day, triggerDate, e_2;
        var _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    _j.trys.push([0, 20, , 21]);
                    // 1. Cancel previous notifications for this reminder
                    return [4 /*yield*/, cancelReminderNotifications(item.id)];
                case 1:
                    // 1. Cancel previous notifications for this reminder
                    _j.sent();
                    // 2. If disabled, do not schedule new notifications
                    if (!item.enabled) {
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, Notifications.getPermissionsAsync()];
                case 2:
                    status_1 = (_j.sent()).status;
                    if (!(status_1 !== 'granted')) return [3 /*break*/, 4];
                    return [4 /*yield*/, Notifications.requestPermissionsAsync()];
                case 3:
                    req = _j.sent();
                    if (req.status !== 'granted') {
                        console.warn('Notification permissions not granted by user.');
                        return [2 /*return*/, false];
                    }
                    _j.label = 4;
                case 4: return [4 /*yield*/, setupReminderNotificationChannel()];
                case 5:
                    _j.sent();
                    title = "\uD83D\uDD14 ".concat(item.title);
                    body = "".concat(item.notes || 'Time for your sacred puja, vrat, or remedy.', " (SoulRise Panchang)");
                    now = new Date();
                    slots = (item.timeSlots && item.timeSlots.length > 0)
                        ? item.timeSlots
                        : [item.timeStr || '08:00 AM'];
                    scheduledCount = 0;
                    if (!(item.category === 'DAILY_CHANT' || item.category === 'LAL_KITAB_REMEDY')) return [3 /*break*/, 10];
                    i = 0;
                    _j.label = 6;
                case 6:
                    if (!(i < slots.length)) return [3 /*break*/, 9];
                    timeSlot = slots[i];
                    _a = parseTimeStrToHourMin(timeSlot), hour = _a.hour, minute = _a.minute;
                    return [4 /*yield*/, Notifications.scheduleNotificationAsync({
                            identifier: "rem_".concat(item.id, "_daily_").concat(i),
                            content: {
                                title: title,
                                body: body,
                                data: { reminderId: item.id, category: item.category },
                                sound: true,
                                priority: Notifications.AndroidNotificationPriority.HIGH,
                            },
                            trigger: {
                                channelId: REMINDER_CHANNEL_ID,
                                hour: hour,
                                minute: minute,
                                repeats: true,
                            },
                        })];
                case 7:
                    _j.sent();
                    scheduledCount++;
                    _j.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 6];
                case 9: return [3 /*break*/, 19];
                case 10:
                    if (!(item.category === 'WEEKLY_DAY')) return [3 /*break*/, 15];
                    dayIdx = ((_e = item.recurrence) === null || _e === void 0 ? void 0 : _e.weeklyDayIndex) !== undefined ? item.recurrence.weeklyDayIndex : 6;
                    expoWeekday = dayIdx + 1;
                    i = 0;
                    _j.label = 11;
                case 11:
                    if (!(i < slots.length)) return [3 /*break*/, 14];
                    timeSlot = slots[i];
                    _b = parseTimeStrToHourMin(timeSlot), hour = _b.hour, minute = _b.minute;
                    return [4 /*yield*/, Notifications.scheduleNotificationAsync({
                            identifier: "rem_".concat(item.id, "_weekly_").concat(i),
                            content: {
                                title: title,
                                body: body,
                                data: { reminderId: item.id, category: item.category },
                                sound: true,
                                priority: Notifications.AndroidNotificationPriority.HIGH,
                            },
                            trigger: {
                                channelId: REMINDER_CHANNEL_ID,
                                weekday: expoWeekday,
                                hour: hour,
                                minute: minute,
                                repeats: true,
                            },
                        })];
                case 12:
                    _j.sent();
                    scheduledCount++;
                    _j.label = 13;
                case 13:
                    i++;
                    return [3 /*break*/, 11];
                case 14: return [3 /*break*/, 19];
                case 15:
                    if (!(item.category === 'TITHI_FESTIVAL' || item.category === 'DATE_SPECIFIC')) return [3 /*break*/, 19];
                    datesToSchedule_1 = [];
                    if (((_f = item.recurrence) === null || _f === void 0 ? void 0 : _f.subType) === 'TITHI' && ((_g = item.recurrence) === null || _g === void 0 ? void 0 : _g.tithiName)) {
                        upcoming = (0, tithiDateFinder_1.findUpcoming5DatesForTithi)(item.recurrence.tithiName, now);
                        upcoming.forEach(function (u) { return datesToSchedule_1.push(u.dateIso); });
                    }
                    else if ((_h = item.recurrence) === null || _h === void 0 ? void 0 : _h.selectedUpcomingDateIso) {
                        datesToSchedule_1.push(item.recurrence.selectedUpcomingDateIso);
                    }
                    else if (item.dateIso) {
                        datesToSchedule_1.push(item.dateIso);
                    }
                    _c = parseTimeStrToHourMin(item.timeStr), hour = _c.hour, minute = _c.minute;
                    i = 0;
                    _j.label = 16;
                case 16:
                    if (!(i < datesToSchedule_1.length)) return [3 /*break*/, 19];
                    dateIso = datesToSchedule_1[i];
                    _d = dateIso.split('-').map(function (n) { return parseInt(n, 10); }), year = _d[0], month = _d[1], day = _d[2];
                    triggerDate = new Date(year, month - 1, day, hour, minute, 0);
                    if (!(triggerDate.getTime() > now.getTime())) return [3 /*break*/, 18];
                    return [4 /*yield*/, Notifications.scheduleNotificationAsync({
                            identifier: "rem_".concat(item.id, "_date_").concat(i),
                            content: {
                                title: title,
                                body: "\uD83D\uDCC5 ".concat(item.title, "\n").concat(item.notes || 'Sacred Vrat & Festival Reminder'),
                                data: { reminderId: item.id, category: item.category, dateIso: dateIso },
                                sound: true,
                                priority: Notifications.AndroidNotificationPriority.HIGH,
                            },
                            trigger: {
                                channelId: REMINDER_CHANNEL_ID,
                                date: triggerDate,
                            },
                        })];
                case 17:
                    _j.sent();
                    scheduledCount++;
                    _j.label = 18;
                case 18:
                    i++;
                    return [3 /*break*/, 16];
                case 19: return [2 /*return*/, scheduledCount > 0];
                case 20:
                    e_2 = _j.sent();
                    console.error("Error scheduling notification for reminder ".concat(item.id, ":"), e_2);
                    return [2 /*return*/, false];
                case 21: return [2 /*return*/];
            }
        });
    });
}
/**
 * Reschedule all enabled reminders from storage (run on app startup and state changes)
 */
function rescheduleAllReminders(remindersList) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, remindersList_1, item, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, setupReminderNotificationChannel()];
                case 1:
                    _a.sent();
                    _i = 0, remindersList_1 = remindersList;
                    _a.label = 2;
                case 2:
                    if (!(_i < remindersList_1.length)) return [3 /*break*/, 7];
                    item = remindersList_1[_i];
                    if (!item.enabled) return [3 /*break*/, 4];
                    return [4 /*yield*/, scheduleSingleReminderNotification(item)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, cancelReminderNotifications(item.id)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [3 /*break*/, 9];
                case 8:
                    e_3 = _a.sent();
                    console.error('Error rescheduling all reminders:', e_3);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
