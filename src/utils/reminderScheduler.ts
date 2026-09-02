import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ReminderItem } from '../types/reminder';
import { findUpcoming5DatesForTithi } from '../engine/tithiDateFinder';

const REMINDER_CHANNEL_ID = 'soulrise-reminder-channel';

/**
 * Configure Android notification channel for high-priority user reminders
 */
export async function setupReminderNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
      name: 'Sacred Reminders & Vrat Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 500, 250, 500],
      lightColor: '#FFD700',
      sound: 'default',
      showBadge: true,
    });
  }
}

/**
 * Parse time strings like "08:30 AM", "06:45 PM", "18:30", "8:00 AM" into { hour, minute }
 */
export function parseTimeStrToHourMin(timeStr: string): { hour: number; minute: number } {
  if (!timeStr) return { hour: 8, minute: 0 };

  const trimmed = timeStr.trim();
  const parts = trimmed.split(' ');
  const [hStr, mStr] = (parts[0] || '08:00').split(':');

  let hour = parseInt(hStr, 10) || 8;
  const minute = parseInt(mStr, 10) || 0;

  if (parts.length > 1) {
    const ampm = parts[1].toUpperCase();
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
  }

  return { hour, minute };
}

/**
 * Cancel existing scheduled local notifications for a specific reminder ID
 */
export async function cancelReminderNotifications(reminderId: string) {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
      if (notif.identifier.startsWith(`rem_${reminderId}`) || notif.content.data?.reminderId === reminderId) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier).catch(() => {});
      }
    }
  } catch (e) {
    console.error('Error canceling reminder notifications:', e);
  }
}

/**
 * Schedule local OS notifications for a single ReminderItem
 */
export async function scheduleSingleReminderNotification(item: ReminderItem): Promise<boolean> {
  try {
    // 1. Cancel previous notifications for this reminder
    await cancelReminderNotifications(item.id);

    // 2. If disabled, do not schedule new notifications
    if (!item.enabled) {
      return true;
    }

    // 3. Ensure permissions
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const req = await Notifications.requestPermissionsAsync();
      if (req.status !== 'granted') {
        console.warn('Notification permissions not granted by user.');
        return false;
      }
    }

    await setupReminderNotificationChannel();

    const title = `🔔 ${item.title}`;
    const body = `${item.notes || 'Time for your sacred puja, vrat, or remedy.'} (SoulRise Panchang)`;
    const now = new Date();

    const slots = (item.timeSlots && item.timeSlots.length > 0)
      ? item.timeSlots
      : [item.timeStr || '08:00 AM'];

    let scheduledCount = 0;

    // A. DAILY CHANT / LAL KITAB REMEDY -> Daily Recurring Trigger
    if (item.category === 'DAILY_CHANT' || item.category === 'LAL_KITAB_REMEDY') {
      for (let i = 0; i < slots.length; i++) {
        const timeSlot = slots[i];
        const { hour, minute } = parseTimeStrToHourMin(timeSlot);

        await Notifications.scheduleNotificationAsync({
          identifier: `rem_${item.id}_daily_${i}`,
          content: {
            title,
            body,
            data: { reminderId: item.id, category: item.category },
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            channelId: REMINDER_CHANNEL_ID,
            hour,
            minute,
            repeats: true,
          },
        });
        scheduledCount++;
      }
    }

    // B. WEEKLY DAY (e.g. Every Saturday / Thursday)
    else if (item.category === 'WEEKLY_DAY') {
      const dayIdx = item.recurrence?.weeklyDayIndex !== undefined ? item.recurrence.weeklyDayIndex : 6;
      // expo-notifications weekday: 1 = Sunday, 2 = Monday, ..., 7 = Saturday
      const expoWeekday = dayIdx + 1;

      for (let i = 0; i < slots.length; i++) {
        const timeSlot = slots[i];
        const { hour, minute } = parseTimeStrToHourMin(timeSlot);

        await Notifications.scheduleNotificationAsync({
          identifier: `rem_${item.id}_weekly_${i}`,
          content: {
            title,
            body,
            data: { reminderId: item.id, category: item.category },
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            channelId: REMINDER_CHANNEL_ID,
            weekday: expoWeekday,
            hour,
            minute,
            repeats: true,
          },
        });
        scheduledCount++;
      }
    }

    // C. TITHI_FESTIVAL or DATE_SPECIFIC -> Exact Date(s)
    else if (item.category === 'TITHI_FESTIVAL' || item.category === 'DATE_SPECIFIC') {
      const datesToSchedule: string[] = [];

      if (item.recurrence?.subType === 'TITHI' && item.recurrence?.tithiName) {
        // Calculate upcoming dates for the Tithi
        const upcoming = findUpcoming5DatesForTithi(item.recurrence.tithiName, now);
        upcoming.forEach(u => datesToSchedule.push(u.dateIso));
      } else if (item.recurrence?.selectedUpcomingDateIso) {
        datesToSchedule.push(item.recurrence.selectedUpcomingDateIso);
      } else if (item.dateIso) {
        datesToSchedule.push(item.dateIso);
      }

      const { hour, minute } = parseTimeStrToHourMin(item.timeStr);

      for (let i = 0; i < datesToSchedule.length; i++) {
        const dateIso = datesToSchedule[i]; // YYYY-MM-DD
        const [year, month, day] = dateIso.split('-').map(n => parseInt(n, 10));

        const triggerDate = new Date(year, month - 1, day, hour, minute, 0);

        // Only schedule if in future
        if (triggerDate.getTime() > now.getTime()) {
          await Notifications.scheduleNotificationAsync({
            identifier: `rem_${item.id}_date_${i}`,
            content: {
              title,
              body: `📅 ${item.title}\n${item.notes || 'Sacred Vrat & Festival Reminder'}`,
              data: { reminderId: item.id, category: item.category, dateIso },
              sound: true,
              priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: {
              channelId: REMINDER_CHANNEL_ID,
              date: triggerDate,
            },
          });
          scheduledCount++;
        }
      }
    }

    return scheduledCount > 0;
  } catch (e) {
    console.error(`Error scheduling notification for reminder ${item.id}:`, e);
    return false;
  }
}

/**
 * Reschedule all enabled reminders from storage (run on app startup and state changes)
 */
export async function rescheduleAllReminders(remindersList: ReminderItem[]) {
  try {
    await setupReminderNotificationChannel();
    for (const item of remindersList) {
      if (item.enabled) {
        await scheduleSingleReminderNotification(item);
      } else {
        await cancelReminderNotifications(item.id);
      }
    }
  } catch (e) {
    console.error('Error rescheduling all reminders:', e);
  }
}
