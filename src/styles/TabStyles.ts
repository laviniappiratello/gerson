import { getColors } from './GlobalStyles';

export function makeTabStyles(isLight: boolean) {
  const C = getColors(isLight);
  return {
    bar: {
      backgroundColor: isLight ? '#fff0f5' : '#160d23',
      borderTopColor: isLight ? 'rgba(194,24,91,0.2)' : 'rgba(228,195,38,0.15)',
      height: 68,
      paddingBottom: 8,
      paddingTop: 6,
    },
    label: { fontSize: 11, letterSpacing: 0.4 },
    header: { backgroundColor: isLight ? '#fff0f5' : '#160d23' },
    headerTitle: { color: C.gold, fontWeight: '700' as const },
    infoButton: { marginRight: 15 },
  };
}

// Export estático para compatibilidade com imports antigos
export const tabStyles = makeTabStyles(false);