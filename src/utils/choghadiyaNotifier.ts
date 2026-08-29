import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CityLocation, ChoghadiyaItem } from '../types/panchang';
import { calculatePanchang } from '../engine/panchangEngine';
import { DEFAULT_CITIES } from '../data/cities';

export const CHOGHADIYA_NOTIF_KEY = 'SOULRISE_CHOGHADIYA_NOTIF';
const NOTIFICATION_ID = 'SOULRISE_LIVE_CHOGHADIYA';

// 13-Language Dictionary for Choghadiya Status Bar Notifications
const CHOGHADIYA_LANG_MAP: Record<string, {
  auspicious: string;
  inauspicious: string;
  statusLabel: string;
  nextLabel: string;
  names: Record<string, string>;
}> = {
  hinglish: {
    auspicious: 'Shubh',
    inauspicious: 'Ashubh',
    statusLabel: 'Status',
    nextLabel: 'Next',
    names: {
      Amrit: 'Amrit', Shubh: 'Shubh', Labh: 'Labh', Char: 'Char', Rog: 'Rog', Kaal: 'Kaal', Udveg: 'Udveg'
    }
  },
  hi: {
    auspicious: 'शुभ समय',
    inauspicious: 'अशुभ समय',
    statusLabel: 'स्थिति',
    nextLabel: 'आगे',
    names: {
      Amrit: 'अमृत', Shubh: 'शुभ', Labh: 'लाभ', Char: 'चर', Rog: 'रोग', Kaal: 'काल', Udveg: 'उद्वेग'
    }
  },
  gu: {
    auspicious: 'શુભ સમય',
    inauspicious: 'અશુભ સમય',
    statusLabel: 'સ્થિતિ',
    nextLabel: 'આગામી',
    names: {
      Amrit: 'અમૃત', Shubh: 'શુભ', Labh: 'લાભ', Char: 'ચલ', Rog: 'રોગ', Kaal: 'કાળ', Udveg: 'ઉદ્વેગ'
    }
  },
  en: {
    auspicious: 'Auspicious',
    inauspicious: 'Inauspicious',
    statusLabel: 'Status',
    nextLabel: 'Next',
    names: {
      Amrit: 'Amrit (Nectar)', Shubh: 'Shubh (Good)', Labh: 'Labh (Gain)', Char: 'Char (Neutral)', Rog: 'Rog (Inauspicious)', Kaal: 'Kaal (Inauspicious)', Udveg: 'Udveg (Inauspicious)'
    }
  },
  ta: {
    auspicious: 'சுப நேரம்',
    inauspicious: 'அசுப நேரம்',
    statusLabel: 'நிலை',
    nextLabel: 'அடுத்து',
    names: {
      Amrit: 'அமிர்தம்', Shubh: 'சுபம்', Labh: 'லாபம்', Char: 'சரம்', Rog: 'ரோகம்', Kaal: 'காலம்', Udveg: 'உத்வேகம்'
    }
  },
  te: {
    auspicious: 'శుభ సమయం',
    inauspicious: 'అశుభ సమయం',
    statusLabel: 'స్థితి',
    nextLabel: 'తరువాత',
    names: {
      Amrit: 'అమృతం', Shubh: 'శుభం', Labh: 'లాభం', Char: 'చరం', Rog: 'రోగం', Kaal: 'కాలం', Udveg: 'ఉద్వేగం'
    }
  },
  bn: {
    auspicious: 'শুভ সময়',
    inauspicious: 'অশুভ সময়',
    statusLabel: 'অবস্থান',
    nextLabel: 'পরবর্তী',
    names: {
      Amrit: 'অমরুত', Shubh: 'শুভ', Labh: 'লাভ', Char: 'চর', Rog: 'রোগ', Kaal: 'কাল', Udveg: 'উদ্বেগ'
    }
  },
  mr: {
    auspicious: 'शुभ काळ',
    inauspicious: 'अशुभ काळ',
    statusLabel: 'स्थिती',
    nextLabel: 'पुढील',
    names: {
      Amrit: 'अमृत', Shubh: 'शुभ', Labh: 'लाभ', Char: 'चर', Rog: 'रोग', Kaal: 'काळ', Udveg: 'उद्वेग'
    }
  },
  ru: {
    auspicious: 'Благоприятно',
    inauspicious: 'Неблагоприятно',
    statusLabel: 'Статус',
    nextLabel: 'Далее',
    names: {
      Amrit: 'Амрита', Shubh: 'Шубха', Labh: 'Лабха', Char: 'Чара', Rog: 'Рога', Kaal: 'Кала', Udveg: 'Удвега'
    }
  },
  fr: {
    auspicious: 'Favorable',
    inauspicious: 'Défavorable',
    statusLabel: 'Statut',
    nextLabel: 'Suivant',
    names: {
      Amrit: 'Amrit', Shubh: 'Shubh', Labh: 'Labh', Char: 'Char', Rog: 'Rog', Kaal: 'Kaal', Udveg: 'Udveg'
    }
  },
  es: {
    auspicious: 'Auspicioso',
    inauspicious: 'Inauspicioso',
    statusLabel: 'Estado',
    nextLabel: 'Siguiente',
    names: {
      Amrit: 'Amrit', Shubh: 'Shubh', Labh: 'Labh', Char: 'Char', Rog: 'Rog', Kaal: 'Kaal', Udveg: 'Udveg'
    }
  },
  he: {
    auspicious: 'מבורך',
    inauspicious: 'לא מומלץ',
    statusLabel: 'סטטוס',
    nextLabel: 'הבא',
    names: {
      Amrit: 'אמריט', Shubh: 'שובה', Labh: 'לאבה', Char: 'צ\'אר', Rog: 'רוג', Kaal: 'קאל', Udveg: 'אודווג'
    }
  },
  id: {
    auspicious: 'Waktu Baik',
    inauspicious: 'Waktu Buruk',
    statusLabel: 'Status',
    nextLabel: 'Selanjutnya',
    names: {
      Amrit: 'Amrit', Shubh: 'Shubh', Labh: 'Labh', Char: 'Char', Rog: 'Rog', Kaal: 'Kaal', Udveg: 'Udveg'
    }
  },
  th: {
    auspicious: 'ช่วงเวลามงคล',
    inauspicious: 'ช่วงเวลาอัปมงคล',
    statusLabel: 'สถานะ',
    nextLabel: 'ถัดไป',
    names: {
      Amrit: 'อมฤต', Shubh: 'ศุภ', Labh: 'ลาภ', Char: 'จร', Rog: 'โรค', Kaal: 'กาล', Udveg: 'อุทเวก'
    }
  }
};

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

    // Read user's active language preference
    const activeLang = (await AsyncStorage.getItem('APP_LANGUAGE')) || 'hinglish';
    const langData = CHOGHADIYA_LANG_MAP[activeLang] || CHOGHADIYA_LANG_MAP.hinglish;

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

    // ROUND Sleek Circle Status Icons (🟢 for Auspicious, 🔴 for Inauspicious)
    const curStatusIcon = current.isAuspicious ? '🟢' : '🔴';
    const curStatusText = current.isAuspicious ? langData.auspicious : langData.inauspicious;
    const curName = langData.names[current.name] || current.name;

    const title = `${curStatusIcon} ${curName}: ${current.startTime} - ${current.endTime}`;

    const n1Icon = next1.isAuspicious ? '🟢' : '🔴';
    const n2Icon = next2.isAuspicious ? '🟢' : '🔴';
    const n3Icon = next3.isAuspicious ? '🟢' : '🔴';

    const n1Name = langData.names[next1.name] || next1.name;
    const n2Name = langData.names[next2.name] || next2.name;
    const n3Name = langData.names[next3.name] || next3.name;

    const body = `${langData.statusLabel}: ${curStatusText} | ${langData.nextLabel}: ${n1Icon}${n1Name} (${next1.startTime}), ${n2Icon}${n2Name} (${next2.startTime}), ${n3Icon}${n3Name} (${next3.startTime})`;

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
      trigger: null,
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
  const [hStr, mStr] = (parts[0] || '00:00').split(':');
  let h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;

  if (parts.length > 1) {
    const ampm = parts[1].toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
  }
  return h * 60 + m;
}
