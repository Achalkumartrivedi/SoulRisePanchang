import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CityLocation, ChoghadiyaItem } from '../types/panchang';
import { calculatePanchang } from '../engine/panchangEngine';
import { DEFAULT_CITIES } from '../data/cities';

export const CHOGHADIYA_NOTIF_KEY = 'SOULRISE_CHOGHADIYA_NOTIF';
const NOTIFICATION_ID = 'SOULRISE_LIVE_CHOGHADIYA';

// Configure default notification handler behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('choghadiya-channel', {
      name: 'Live Choghadiya Status',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FFD700',
      sound: undefined,
      showBadge: false,
    });
  }
}

export async function updateLiveChoghadiyaNotification(city?: CityLocation) {
  try {
    const isEnabled = await AsyncStorage.getItem(CHOGHADIYA_NOTIF_KEY);
    if (isEnabled !== 'true') {
      await cancelChoghadiyaNotification();
      return;
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const req = await Notifications.requestPermissionsAsync();
      if (req.status !== 'granted') return;
    }

    await setupNotificationChannel();

    const activeCity = city || DEFAULT_CITIES[0];
    const now = new Date();
    const panchang = calculatePanchang(now, activeCity);

    const allChoghadiya: ChoghadiyaItem[] = [
      ...panchang.dayChoghadiya,
      ...panchang.nightChoghadiya
    ];

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let currentIndex = 0;
    for (let i = 0; i < allChoghadiya.length; i++) {
      const item = allChoghadiya[i];
      const startMin = parseTimeToMin(item.startTime);
      const endMin = parseTimeToMin(item.endTime);

      if (startMin <= endMin) {
        if (currentMinutes >= startMin && currentMinutes < endMin) {
          currentIndex = i;
          break;
        }
      } else {
        // Spans across midnight
        if (currentMinutes >= startMin || currentMinutes < endMin) {
          currentIndex = i;
          break;
        }
      }
    }

    const current = allChoghadiya[currentIndex] || allChoghadiya[0];
    const next1 = allChoghadiya[(currentIndex + 1) % allChoghadiya.length];
    const next2 = allChoghadiya[(currentIndex + 2) % allChoghadiya.length];
    const next3 = allChoghadiya[(currentIndex + 3) % allChoghadiya.length];

    const curStatusIcon = current.isAuspicious ? '🟩' : '🟥';
    const curStatusText = current.isAuspicious ? 'Auspicious' : 'Inauspicious';
    const title = `${curStatusIcon} ${current.name} (${current.hindiName}): ${current.startTime} - ${current.endTime}`;

    const n1Icon = next1.isAuspicious ? '🟩' : '🟥';
    const n2Icon = next2.isAuspicious ? '🟩' : '🟥';
    const n3Icon = next3.isAuspicious ? '🟩' : '🟥';

    const body = `Status: ${curStatusText} | Next: ${n1Icon}${next1.name} (${next1.startTime}), ${n2Icon}${next2.name} (${next2.startTime}), ${n3Icon}${next3.name} (${next3.startTime})`;

    // Dismiss existing and schedule persistent notification
    await Notifications.dismissNotificationAsync(NOTIFICATION_ID).catch(() => {});

    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_ID,
      content: {
        title,
        body,
        data: { screen: 'TODAY', subtab: 'choghadiya' },
        sound: undefined,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        sticky: true,
        autoDismiss: false,
      },
      trigger: null, // Display immediately
    });
  } catch (e) {
    console.log('Error updating live Choghadiya notification:', e);
  }
}

export async function cancelChoghadiyaNotification() {
  try {
    await Notifications.dismissNotificationAsync(NOTIFICATION_ID).catch(() => {});
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_ID).catch(() => {});
  } catch (e) {
    console.log('Error canceling notification:', e);
  }
}

function parseTimeToMin(timeStr: string): number {
  const parts = timeStr.split(' ');
  const [hStr, mStr] = parts[0].split(':');
  let h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;

  if (parts.length > 1) {
    const ampm = parts[1].toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
  }
  return h * 60 + m;
}
