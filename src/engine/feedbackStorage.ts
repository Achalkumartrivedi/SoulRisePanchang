import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FeedbackItem {
  id: string;
  category: 'BUG_REPORT' | 'FEATURE_REQUEST' | 'PANCHANG_QUERY' | 'GENERAL';
  subject: string;
  message: string;
  attachmentName?: string;
  attachmentSizeMb?: number;
  submittedAtIso: string;
}

const FEEDBACK_STORAGE_KEY = '@soulrise_feedback_history_v1';
const FEEDBACK_LAST_SUBMITTED_KEY = '@soulrise_feedback_last_submitted_v1';
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000; // 72 hours in ms

export interface CooldownStatus {
  isLocked: boolean;
  remainingHours: number;
  remainingDays: number;
  unlockDateIso: string | null;
}

export async function getFeedbackCooldownStatus(): Promise<CooldownStatus> {
  try {
    const lastIso = await AsyncStorage.getItem(FEEDBACK_LAST_SUBMITTED_KEY);
    if (!lastIso) {
      return { isLocked: false, remainingHours: 0, remainingDays: 0, unlockDateIso: null };
    }

    const lastTime = new Date(lastIso).getTime();
    const nowTime = Date.now();
    const elapsedMs = nowTime - lastTime;

    if (elapsedMs < THREE_DAYS_MS) {
      const remainingMs = THREE_DAYS_MS - elapsedMs;
      const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
      const remainingDays = Math.ceil(remainingHours / 24);
      const unlockDate = new Date(lastTime + THREE_DAYS_MS);

      return {
        isLocked: true,
        remainingHours,
        remainingDays,
        unlockDateIso: unlockDate.toISOString()
      };
    }

    return { isLocked: false, remainingHours: 0, remainingDays: 0, unlockDateIso: null };
  } catch (e) {
    console.log('Error checking feedback cooldown status:', e);
    return { isLocked: false, remainingHours: 0, remainingDays: 0, unlockDateIso: null };
  }
}

export async function saveFeedbackItem(item: FeedbackItem): Promise<void> {
  try {
    const json = await AsyncStorage.getItem(FEEDBACK_STORAGE_KEY);
    const list: FeedbackItem[] = json ? JSON.parse(json) : [];
    list.unshift(item);

    await AsyncStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(list));
    await AsyncStorage.setItem(FEEDBACK_LAST_SUBMITTED_KEY, item.submittedAtIso);
  } catch (e) {
    console.log('Error saving feedback item:', e);
  }
}

export async function getFeedbackHistory(): Promise<FeedbackItem[]> {
  try {
    const json = await AsyncStorage.getItem(FEEDBACK_STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.log('Error fetching feedback history:', e);
    return [];
  }
}
