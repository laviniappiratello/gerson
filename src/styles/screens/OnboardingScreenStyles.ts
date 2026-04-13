import { StyleSheet } from 'react-native';
import { Colors } from '../GlobalStyles';

export const onboardingScreenStyles = StyleSheet.create({
  container: { paddingVertical: 40, backgroundColor: Colors.deepBlue },
  topBadge: { color: Colors.gold, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' },
  title: { marginTop: 10 },
  stepsRow: { flexDirection: 'row', gap: 8, marginBottom: 22 },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  stepDotActive: { backgroundColor: Colors.gold },
  stepDotInactive: { backgroundColor: 'rgba(228,195,38,0.25)' },
  skipWrap: { marginTop: 18 },
  skipText: { color: Colors.gold, opacity: 0.82 },
});
