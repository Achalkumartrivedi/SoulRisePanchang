import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReminderItem } from '../types/reminder';

const REMINDERS_KEY = '@soulrise_user_reminders_v1';

// Initial default seed reminders if user opens for first time
const SEED_REMINDERS: ReminderItem[] = [
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
      startDateIso: `${new Date().getFullYear()}-08-20`,
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

export async function getStoredReminders(): Promise<ReminderItem[]> {
  try {
    const raw = await AsyncStorage.getItem(REMINDERS_KEY);
    if (!raw) {
      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(SEED_REMINDERS));
      return SEED_REMINDERS;
    }
    const list: ReminderItem[] = JSON.parse(raw);
    // Migration: Map legacy TITHI_PHASE category to TITHI_FESTIVAL
    const migrated = list.map(item => {
      if ((item as any).category === 'TITHI_PHASE') {
        return {
          ...item,
          category: 'TITHI_FESTIVAL' as const,
          recurrence: {
            ...item.recurrence,
            subType: 'TITHI' as const,
            tithiName: (item.recurrence as any)?.tithiType || 'Poonam / Purnima'
          }
        };
      }
      return item;
    });
    return migrated;
  } catch (e) {
    console.error('Error reading reminders from storage:', e);
    return SEED_REMINDERS;
  }
}

export async function saveReminder(item: ReminderItem): Promise<ReminderItem[]> {
  try {
    const current = await getStoredReminders();
    const existingIdx = current.findIndex(r => r.id === item.id);
    let updated: ReminderItem[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = item;
    } else {
      updated = [item, ...current];
    }
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving reminder:', e);
    return [];
  }
}

export async function toggleReminderState(id: string): Promise<ReminderItem[]> {
  try {
    const current = await getStoredReminders();
    const updated = current.map(r => {
      if (r.id === id) return { ...r, enabled: !r.enabled };
      return r;
    });
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error toggling reminder state:', e);
    return [];
  }
}

export async function deleteReminder(id: string): Promise<ReminderItem[]> {
  try {
    const current = await getStoredReminders();
    const updated = current.filter(r => r.id !== id);
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error deleting reminder:', e);
    return [];
  }
}

export async function markLalKitabDayDone(id: string): Promise<ReminderItem[]> {
  try {
    const current = await getStoredReminders();
    const todayIso = new Date().toISOString().split('T')[0];

    const updated = current.map(r => {
      if (r.id === id && r.lalKitabData) {
        if (r.lalKitabData.lastCompletedDateIso === todayIso) {
          return r; // Already marked today
        }
        const nextDone = Math.min(r.lalKitabData.targetDays, r.lalKitabData.completedDays + 1);
        return {
          ...r,
          lalKitabData: {
            ...r.lalKitabData,
            completedDays: nextDone,
            lastCompletedDateIso: todayIso,
            isCompleted: nextDone >= r.lalKitabData.targetDays
          }
        };
      }
      return r;
    });

    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error marking Lal Kitab remedy done:', e);
    return [];
  }
}
