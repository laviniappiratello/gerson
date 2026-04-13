import { StyleSheet } from 'react-native';
import { Colors } from '../GlobalStyles';

export const registerScreenStyles = StyleSheet.create({
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
  topBadgeText: {
    color: Colors.gold,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    opacity: 0.95,
  },
  titleSpacing: { marginTop: 6 },
  ctaButton: { marginTop: 10 },
  loginLinkWrap: { marginTop: 14 },
  onboardingLinkWrap: { marginTop: 12 },
  loginLinkText: { color: Colors.gold, textAlign: 'center', opacity: 0.9 },
  onboardingLinkText: { color: Colors.gold, textAlign: 'center', opacity: 0.75 },
  label: { alignSelf: 'flex-start' as const, color: '#fff' },
});
