import * as Notifications from 'expo-notifications';
import i18n from '../i18n/config';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function agendarHoroscopo() {
  try {
    // Usamos 'any' aqui para ignorar a chatice do TypeScript 
    // com as versões do expo-notifications
    const settings: any = await Notifications.requestPermissionsAsync();
    
    // Verifica se a permissão foi concedida. 
    // Se a propriedade 'granted' for true, o app tem permissão.
    if (!settings.granted) {
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t('notifications.dailyHoroscopeTitle'),
        body: i18n.t('dashboard.mysticalSummary'),
        data: { route: 'dashboard' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
      } as any,
    });
  } catch (error) {
    console.error("Erro ao agendar notificação:", error);
  }
}