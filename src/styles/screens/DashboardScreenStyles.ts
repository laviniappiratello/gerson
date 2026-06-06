import { StyleSheet } from 'react-native';
import { getColors } from '../GlobalStyles';

export function makeDashboardStyles(isLight: boolean) {
  const C = getColors(isLight);
  const blockBg = isLight ? 'rgba(252,228,236,0.9)' : 'rgba(38,17,51,0.82)';

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.deepBlue },
    page: { padding: 18, paddingBottom: 56, backgroundColor: C.deepBlue },
    kicker: { color: C.gold, textAlign: 'center', letterSpacing: 1, fontSize: 11, opacity: 0.9, marginTop: 6 },
    block: { borderWidth: 1, borderColor: C.panelBorder, borderRadius: 18, padding: 14, marginBottom: 14, backgroundColor: blockBg },
    blockTitle: { color: C.gold, fontSize: 18, fontWeight: '700', marginBottom: 8 },
    baseText: { color: C.text, fontSize: 14, lineHeight: 21, marginBottom: 6 },
    tipsHighlight: { marginTop: 10, padding: 12, borderRadius: 14, backgroundColor: isLight ? 'rgba(194,24,91,0.08)' : 'rgba(228,195,38,0.08)', borderWidth: 1, borderColor: C.panelBorder },
    tipsHighlightLabel: { color: C.gold, fontSize: 12, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 },
    tipsHighlightText: { color: C.text, fontSize: 14, lineHeight: 22 },
    row: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent', marginTop: 8 },
    signImage: { width: '40%', height: 90 },
    arcanoImage: { width: '45%', height: 120 },
    previsao: { color: C.text, fontSize: 15, marginTop: 4, lineHeight: 24 },
    previsaoLabel: { color: C.gold, fontSize: 13, fontWeight: '700', marginTop: 10, letterSpacing: 0.6 },
    cardTitle: { color: C.gold, fontSize: 16, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
    readingCardImage: { width: '100%', height: 170, marginBottom: 6 },
    footnote: { color: C.gray, marginTop: 10, textAlign: 'center' },
  });
}

// Compatibilidade estática
import { Colors } from '../GlobalStyles';
export const dashboardScreenStyles = makeDashboardStyles(false);