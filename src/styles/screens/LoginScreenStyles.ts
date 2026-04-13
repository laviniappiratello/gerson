import { StyleSheet } from 'react-native';
import { Colors } from '../GlobalStyles';

export const loginScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.deepBlue },
  screen: { paddingVertical: 40, backgroundColor: Colors.deepBlue },
  authCard: {
    width: '100%',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.24)',
    backgroundColor: 'rgba(41,17,55,0.76)',
    padding: 18,
  },
  titleSpacing: { marginTop: 6 },
  topBadgeText: {
    color: Colors.gold,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    opacity: 0.95,
  },
  input: {
    width: '100%',
    height: 54,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    paddingHorizontal: 18,
    color: '#f5efff',
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.24)',
  },
  loginButton: { marginTop: 10 },
  loadingButton: { opacity: 0.6 },
  btnSecundario: {
    marginTop: 12,
    backgroundColor: 'transparent',
  },
  registerLinkWrap: { marginTop: 14 },
  linkText: { color: Colors.gold, textAlign: 'center' },
});
