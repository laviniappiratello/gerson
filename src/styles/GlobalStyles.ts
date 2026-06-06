import { Platform, StyleSheet } from 'react-native';

export const DarkColors = {
  gold: '#e4c326',
  goldSoft: '#b89216',
  purple: '#2b1137',
  plum: '#1d0c2c',
  deepBlue: '#0f0918',
  panel: '#261133',
  panelBorder: 'rgba(228,195,38,0.24)',
  gray: '#c6afdf',
  white: '#f0d671',
  text: '#f5efff',
};

export const LightColors = {
  gold: '#c2185b',
  goldSoft: '#ad1457',
  purple: '#fce4ec',
  plum: '#f8bbd0',
  deepBlue: '#fff0f5',
  panel: '#fce4ec',
  panelBorder: 'rgba(194,24,91,0.24)',
  gray: '#880e4f',
  white: '#c2185b',
  text: '#3d0026',
};

// Compatibilidade com imports antigos (Colors.gold etc)
export const Colors = DarkColors;

export function getColors(isLight: boolean) {
  return isLight ? LightColors : DarkColors;
}

export function makeGlobalStyles(isLight: boolean) {
  const C = getColors(isLight);
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: C.deepBlue,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: C.gold,
      textAlign: 'center',
      marginBottom: 10,
      letterSpacing: 0.8,
    },
    subtitle: {
      color: C.gray,
      textAlign: 'center',
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 22,
    },
    panel: {
      width: '100%',
      borderRadius: 18,
      borderWidth: 1,
      borderColor: C.panelBorder,
      backgroundColor: C.panel,
      padding: 14,
      marginBottom: 14,
    },
    mainButton: {
      backgroundColor: C.purple,
      height: 54,
      borderRadius: 999,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: C.gold,
      ...(Platform.OS === 'web'
        ? { boxShadow: '0px 6px 20px rgba(0,0,0,0.12)' }
        : { shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } }),
      elevation: 4,
    },
    buttonText: {
      color: C.white,
      fontWeight: '700',
      fontSize: 16,
      letterSpacing: 0.9,
    },
  });
}

// Export estático para compatibilidade com telas que ainda não usam o hook
export const globalStyles = makeGlobalStyles(false);