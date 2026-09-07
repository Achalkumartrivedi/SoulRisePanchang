"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoredReminders = getStoredReminders;
exports.saveReminder = saveReminder;
exports.toggleReminderState = toggleReminderState;
exports.deleteReminder = deleteReminder;
exports.markLalKitabDayDone = markLalKitabDayDone;
var async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
var reminderScheduler_1 = require("../utils/reminderScheduler");
var REMINDERS_KEY = '@soulrise_user_reminders_v1';
// Initial default seed reminders if user opens for first time
var SEED_REMINDERS = [
    {
        id: 'seed-1',
        title: 'Saturday Hanuman Fast & Chisa',
        category: 'WEEKLY_DAY',
        timeStr: '08:00 AM',
        enabled: true,
        notes: 'Saturday Shanidev & Hanuman Dev Fast & Oil Arpan',
        createdAtIso: new Date().toISOString(),
        recurrence: { weeklyDayIndex: 6 } // Saturday
    },
    {
        id: 'seed-2',
        title: 'Poonam (Purnima) Vrat & Satyanarayan Puja',
        category: 'TITHI_FESTIVAL',
        timeStr: '06:30 AM',
        enabled: true,
        notes: 'Monthly Full Moon sacred fast & Katha',
        createdAtIso: new Date().toISOString(),
        recurrence: { subType: 'TITHI', tithiName: 'Purnima / Poonam (15th Tithi)' }
    },
    {
        id: 'seed-3',
        title: 'Lal Kitab 43 Days Surya Arghya Remedy',
        category: 'LAL_KITAB_REMEDY',
        timeStr: '06:45 AM',
        enabled: true,
        notes: 'Continuous 43-day copper vessel water offering to Sun God',
        createdAtIso: new Date().toISOString(),
        lalKitabData: {
            targetDays: 43,
            completedDays: 12,
            startDateIso: "".concat(new Date().getFullYear(), "-08-20"),
            isCompleted: false
        }
    },
    {
        id: 'seed-4',
        title: 'Gayatri Mantra & Evening Aarti',
        category: 'DAILY_CHANT',
        timeStr: '06:00 AM',
        timeSlots: ['06:00 AM', '07:00 PM'],
        enabled: true,
        notes: 'Daily 108 Japa of Om Bhur Bhuva Swaha Morning & Evening',
        createdAtIso: new Date().toISOString()
    }
];
function getStoredReminders() {
    return __awaiter(this, void 0, void 0, function () {
        var raw, list, migrated, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, async_storage_1.default.getItem(REMINDERS_KEY)];
                case 1:
                    raw = _a.sent();
                    if (!!raw) return [3 /*break*/, 3];
                    return [4 /*yield*/, async_storage_1.default.setItem(REMINDERS_KEY, JSON.stringify(SEED_REMINDERS))];
                case 2:
                    _a.sent();
                    return [2 /*return*/, SEED_REMINDERS];
                case 3:
                    list = JSON.parse(raw);
                    migrated = list.map(function (item) {
                        var _a;
                        if (item.category === 'TITHI_PHASE') {
                            return __assign(__assign({}, item), { category: 'TITHI_FESTIVAL', recurrence: __assign(__assign({}, item.recurrence), { subType: 'TITHI', tithiName: ((_a = item.recurrence) === null || _a === void 0 ? void 0 : _a.tithiType) || 'Poonam / Purnima' }) });
                        }
                        return item;
                    });
                    return [2 /*return*/, migrated];
                case 4:
                    e_1 = _a.sent();
                    console.error('Error reading reminders from storage:', e_1);
                    return [2 /*return*/, SEED_REMINDERS];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function saveReminder(item) {
    return __awaiter(this, void 0, void 0, function () {
        var current, existingIdx, updated, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getStoredReminders()];
                case 1:
                    current = _a.sent();
                    existingIdx = current.findIndex(function (r) { return r.id === item.id; });
                    updated = void 0;
                    if (existingIdx >= 0) {
                        updated = __spreadArray([], current, true);
                        updated[existingIdx] = item;
                    }
                    else {
                        updated = __spreadArray([item], current, true);
                    }
                    return [4 /*yield*/, async_storage_1.default.setItem(REMINDERS_KEY, JSON.stringify(updated))];
                case 2:
                    _a.sent();
                    // Schedule local OS notification for this saved item
                    return [4 /*yield*/, (0, reminderScheduler_1.scheduleSingleReminderNotification)(item)];
                case 3:
                    // Schedule local OS notification for this saved item
                    _a.sent();
                    return [2 /*return*/, updated];
                case 4:
                    e_2 = _a.sent();
                    console.error('Error saving reminder:', e_2);
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function toggleReminderState(id) {
    return __awaiter(this, void 0, void 0, function () {
        var current, targetItem_1, updated, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, getStoredReminders()];
                case 1:
                    current = _a.sent();
                    updated = current.map(function (r) {
                        if (r.id === id) {
                            targetItem_1 = __assign(__assign({}, r), { enabled: !r.enabled });
                            return targetItem_1;
                        }
                        return r;
                    });
                    return [4 /*yield*/, async_storage_1.default.setItem(REMINDERS_KEY, JSON.stringify(updated))];
                case 2:
                    _a.sent();
                    if (!targetItem_1) return [3 /*break*/, 6];
                    if (!targetItem_1.enabled) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, reminderScheduler_1.scheduleSingleReminderNotification)(targetItem_1)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, (0, reminderScheduler_1.cancelReminderNotifications)(targetItem_1.id)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/, updated];
                case 7:
                    e_3 = _a.sent();
                    console.error('Error toggling reminder state:', e_3);
                    return [2 /*return*/, []];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function deleteReminder(id) {
    return __awaiter(this, void 0, void 0, function () {
        var current, updated, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, getStoredReminders()];
                case 1:
                    current = _a.sent();
                    updated = current.filter(function (r) { return r.id !== id; });
                    return [4 /*yield*/, async_storage_1.default.setItem(REMINDERS_KEY, JSON.stringify(updated))];
                case 2:
                    _a.sent();
                    // Cancel OS notifications for deleted reminder
                    return [4 /*yield*/, (0, reminderScheduler_1.cancelReminderNotifications)(id)];
                case 3:
                    // Cancel OS notifications for deleted reminder
                    _a.sent();
                    return [2 /*return*/, updated];
                case 4:
                    e_4 = _a.sent();
                    console.error('Error deleting reminder:', e_4);
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function markLalKitabDayDone(id) {
    return __awaiter(this, void 0, void 0, function () {
        var current, todayIso_1, updated, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, getStoredReminders()];
                case 1:
                    current = _a.sent();
                    todayIso_1 = new Date().toISOString().split('T')[0];
                    updated = current.map(function (r) {
                        if (r.id === id && r.lalKitabData) {
                            if (r.lalKitabData.lastCompletedDateIso === todayIso_1) {
                                return r; // Already marked today
                            }
                            var nextDone = Math.min(r.lalKitabData.targetDays, r.lalKitabData.completedDays + 1);
                            return __assign(__assign({}, r), { lalKitabData: __assign(__assign({}, r.lalKitabData), { completedDays: nextDone, lastCompletedDateIso: todayIso_1, isCompleted: nextDone >= r.lalKitabData.targetDays }) });
                        }
                        return r;
                    });
                    return [4 /*yield*/, async_storage_1.default.setItem(REMINDERS_KEY, JSON.stringify(updated))];
                case 2:
                    _a.sent();
                    return [2 /*return*/, updated];
                case 3:
                    e_5 = _a.sent();
                    console.error('Error marking Lal Kitab remedy done:', e_5);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
