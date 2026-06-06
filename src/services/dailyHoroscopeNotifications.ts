import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getPrevisaoDoDia, type SignoNome } from '../../constants/OraculoData';
import i18n from '../i18n/config';

const DAILY_HOROSCOPE_KEY = '@persephone/daily_horoscope_notification';
const DAILY_HOROSCOPE_HOUR = 9;
const DAILY_HOROSCOPE_MINUTE = 0;
const ANDROID_CHANNEL_ID = 'daily-horoscope';

type StoredNotificationSchedule = {
  identifier: string;
  userId: string;
  signo: SignoNome;
  hour: number;
  minute: number;
};

// FIX: adicionados shouldShowBanner e shouldShowList exigidos pela versão atual do expo-notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function buildDailyTitle() {
  return i18n.t('notifications.dailyHoroscopeTitle');
}

function buildDailyBody(signo: SignoNome) {
  return getPrevisaoDoDia(signo);
}

async function requestLocalNotificationPermission() {
  // .granted é a propriedade correta conforme o código-fonte do expo-notifications
  const current = await Notifications.getPermissionsAsync();
  if ((current as any).granted === true) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return (requested as any).granted === true;
}

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: i18n.t('notifications.channelName'),
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

async function getStoredSchedule() {
  const raw = await AsyncStorage.getItem(DAILY_HOROSCOPE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredNotificationSchedule;
  } catch {
    await AsyncStorage.removeItem(DAILY_HOROSCOPE_KEY);
    return null;
  }
}

async function isScheduledIdentifierActive(identifier: string) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.some((item) => item.identifier === identifier);
}

export async function clearDailyHoroscopeNotification() {
  if (Platform.OS === 'web') return;
  const stored = await getStoredSchedule();
  if (stored?.identifier) {
    await Notifications.cancelScheduledNotificationAsync(stored.identifier);
  }
  await AsyncStorage.removeItem(DAILY_HOROSCOPE_KEY);
}

export async function ensureDailyHoroscopeNotification(user: { id: string; signo: SignoNome }) {
  if (Platform.OS === 'web') return false;

  const granted = await requestLocalNotificationPermission();
  if (!granted) return false;

  await ensureAndroidChannel();

  const stored = await getStoredSchedule();
  const keepCurrentSchedule =
    stored &&
    stored.userId === user.id &&
    stored.signo === user.signo &&
    stored.hour === DAILY_HOROSCOPE_HOUR &&
    stored.minute === DAILY_HOROSCOPE_MINUTE &&
    (await isScheduledIdentifierActive(stored.identifier));

  if (keepCurrentSchedule) return true;

  if (stored?.identifier) {
    await Notifications.cancelScheduledNotificationAsync(stored.identifier);
  }

  // FIX: trigger agora usa type: 'calendar' conforme API atual do expo-notifications
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: buildDailyTitle(),
      body: buildDailyBody(user.signo),
      sound: false,
      data: {
        type: 'daily_horoscope',
        userId: user.id,
        signo: user.signo,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: DAILY_HOROSCOPE_HOUR,
      minute: DAILY_HOROSCOPE_MINUTE,
      repeats: true,
      ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : {}),
    },
  });

  const payload: StoredNotificationSchedule = {
    identifier,
    userId: user.id,
    signo: user.signo,
    hour: DAILY_HOROSCOPE_HOUR,
    minute: DAILY_HOROSCOPE_MINUTE,
  };

  await AsyncStorage.setItem(DAILY_HOROSCOPE_KEY, JSON.stringify(payload));
  return true;
}