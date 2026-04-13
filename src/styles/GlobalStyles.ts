import { StyleSheet } from 'react-native';

export const Colors = {
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

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.deepBlue,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.gold,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.8,
  },
  subtitle: {
    color: Colors.gray,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 22,
  },
  panel: {
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.panelBorder,
    backgroundColor: Colors.panel,
    padding: 14,
    marginBottom: 14,
  },
  mainButton: {
    backgroundColor: Colors.purple,
    height: 54,
    borderRadius: 999,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gold,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.9,
  },
});