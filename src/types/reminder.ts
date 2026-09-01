import { ChoghadiyaType } from './panchang';

export type ReminderCategory =
  | 'WEEKLY_DAY'       // Every Saturday / Thursday
  | 'TITHI_FESTIVAL'   // Every Tithi (Poonam, Ekadashi, Chaturthi, etc) or Calendar Festival
  | 'LAL_KITAB_REMEDY' // Continuous Lal Kitab remedy counter (43 days or custom N-days)
  | 'DAILY_CHANT'      // Daily Morning / Evening Mantra Chant
  | 'DATE_SPECIFIC';   // Specific festival/date reminder e.g. Raksha Bandhan

export interface LalKitabRemedyData {
  targetDays: number;     // e.g. 43 days or custom N-days
  completedDays: number;  // e.g. 14 days
  startDateIso: string;   // YYYY-MM-DD
  lastCompletedDateIso?: string;
  isCompleted: boolean;
}

export interface RecurrenceRule {
  weeklyDayIndex?: number; // 0 = Sun, 6 = Sat
  maxOccurrences?: number;  // e.g. 5 Thursdays
  completedOccurrences?: number;
  
  // Tithi & Festival Sub-Type fields
  subType?: 'TITHI' | 'FESTIVAL';
  tithiName?: string;       // e.g. 'Purnima / Poonam', 'Ekadashi', 'Chaturthi'
  tithiIndex?: number;      // 1..15
  festivalId?: string;      // ID from festival repository
  festivalName?: string;    // Festival title
  festivalDharma?: string;  // HINDU, JAIN, SIKH, BUDDHIST, CHRISTIAN, PARSI, WORLD
}

export interface ReminderItem {
  id: string;
  title: string;
  category: ReminderCategory;
  dateIso?: string;       // For date-specific reminders
  timeStr: string;        // HH:MM (24h or formatted e.g. 08:30 AM)
  timeSlots?: string[];   // Multiple daily chant slots e.g. ["06:00 AM", "07:00 PM"]
  enabled: boolean;
  notes?: string;
  createdAtIso: string;
  recurrence?: RecurrenceRule;
  lalKitabData?: LalKitabRemedyData;
  muhuratSafetyRating?: 'AUSPICIOUS' | 'NEUTRAL' | 'INAUSPICIOUS';
  muhuratAdvice?: string;
}

export interface MuhuratSafetyAnalysis {
  timeStr: string;
  safetyRating: 'AUSPICIOUS' | 'NEUTRAL' | 'INAUSPICIOUS';
  title: string;
  advice: string;
  rahuKalamConflict: boolean;
  yamagandaConflict: boolean;
  gulikaConflict: boolean;
  activeChoghadiyaName: string;
  activeChoghadiyaHindi: string;
  isChoghadiyaAuspicious: boolean;
  isAbhijitMuhurat: boolean;
  rahuKalamRange: string;
}
