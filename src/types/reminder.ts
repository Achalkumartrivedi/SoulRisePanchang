import { ChoghadiyaType } from './panchang';

export type ReminderCategory =
  | 'WEEKLY_DAY'       // Every Saturday / Thursday
  | 'TITHI_PHASE'      // Every Poonam (Purnima) / Amavasya / Ekadashi
  | 'LAL_KITAB_REMEDY' // Continuous 43-day remedy counter
  | 'DAILY_CHANT'      // Daily Morning / Evening Mantra Chant
  | 'DATE_SPECIFIC';   // Specific festival/date reminder e.g. Raksha Bandhan

export interface LalKitabRemedyData {
  targetDays: number;     // e.g. 43 days
  completedDays: number;  // e.g. 14 days
  startDateIso: string;   // YYYY-MM-DD
  lastCompletedDateIso?: string;
  isCompleted: boolean;
}

export interface RecurrenceRule {
  weeklyDayIndex?: number; // 0 = Sun, 6 = Sat
  tithiType?: 'POONAM_PURNIMA' | 'AMAVASYA' | 'EKADASHI' | 'PRADOSH';
  maxOccurrences?: number;  // e.g. 5 Thursdays
  completedOccurrences?: number;
}

export interface ReminderItem {
  id: string;
  title: string;
  category: ReminderCategory;
  dateIso?: string;       // For date-specific reminders
  timeStr: string;        // HH:MM (24h or formatted e.g. 08:30 AM)
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
