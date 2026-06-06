import { StyleSheet } from 'react-native';
import { getColors } from '../GlobalStyles';

export function makeTiragemStyles(isLight: boolean) {
  const C = getColors(isLight);
  const blockBg = isLight ? 'rgba(252,228,236,0.9)' : 'rgba(38,17,51,0.82)';
  const itemBg  = isLight ? 'rgba(255,240,245,0.9)' : 'rgba(12,7,20,0.34)';
  const inputBg = isLight ? 'rgba(255,255,255,0.8)' : 'rgba(12,7,20,0.38)';

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: C.deepBlue },
    page: { padding: 18, paddingBottom: 56, backgroundColor: C.deepBlue },
    kicker: { color: C.gold, textAlign: 'center', letterSpacing: 1, fontSize: 11, opacity: 0.9, marginTop: 6 },
    block: { borderWidth: 1, borderColor: C.panelBorder, borderRadius: 18, padding: 14, marginBottom: 14, backgroundColor: blockBg },
    blockTitle: { color: C.gold, fontSize: 18, fontWeight: '700', marginBottom: 8 },
    baseText: { color: C.text, fontSize: 14, lineHeight: 21, marginBottom: 6 },
    input: { borderWidth: 1, borderColor: C.panelBorder, borderRadius: 16, minHeight: 88, padding: 14, color: C.text, marginBottom: 10, textAlignVertical: 'top', backgroundColor: inputBg },
    selectorLabel: { color: C.text, fontSize: 12, fontWeight: '700', letterSpacing: 0.4, marginBottom: 6, marginTop: 4, textTransform: 'uppercase', opacity: 0.8 },
    questionText: { color: isLight ? C.text : '#fff', fontSize: 14, marginBottom: 10 },
    dropdownButton: { borderWidth: 1, borderColor: C.panelBorder, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 10, backgroundColor: inputBg },
    dropdownTitle: { color: C.gold, fontWeight: '700' },
    dropdownList: { marginBottom: 10, backgroundColor: 'transparent' },
    dropdownItem: { borderWidth: 1, borderColor: isLight ? 'rgba(194,24,91,0.14)' : 'rgba(228,195,38,0.14)', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 8, backgroundColor: itemBg },
    dropdownItemHeader: { flexDirection: 'row', alignItems: 'flex-start' },
    dropdownItemMain: { flex: 1, backgroundColor: 'transparent', marginRight: 10 },
    dropdownItemActive: { borderColor: isLight ? 'rgba(194,24,91,0.7)' : 'rgba(228,195,38,0.7)', backgroundColor: isLight ? 'rgba(248,187,208,0.8)' : 'rgba(46,22,61,0.8)' },
    dropdownItemTitle: { color: C.gold, fontWeight: '700', marginBottom: 4 },
    dropdownItemText: { color: C.text, fontSize: 13 },
    favoriteButton: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: isLight ? 'rgba(194,24,91,0.08)' : 'rgba(228,195,38,0.08)', borderWidth: 1, borderColor: isLight ? 'rgba(194,24,91,0.18)' : 'rgba(228,195,38,0.18)' },
    favoriteButtonText: { color: C.gray, fontSize: 18 },
    favoriteButtonTextActive: { color: C.gold },
    favoriteTag: { color: C.gold, fontSize: 11, fontWeight: '700', letterSpacing: 0.6, marginTop: 6, textTransform: 'uppercase' },
    card: { borderWidth: 1, borderColor: isLight ? 'rgba(194,24,91,0.22)' : 'rgba(228,195,38,0.22)', borderRadius: 14, padding: 10, marginBottom: 10, backgroundColor: isLight ? 'rgba(255,240,245,0.8)' : 'rgba(12,7,20,0.42)' },
    noteBlock: { marginTop: 8, paddingTop: 4 },
    noteTitle: { color: C.gold, fontSize: 14, fontWeight: '700', marginBottom: 8 },
    noteInput: { borderWidth: 1, borderColor: C.panelBorder, borderRadius: 16, minHeight: 110, padding: 14, color: C.text, marginBottom: 10, textAlignVertical: 'top', backgroundColor: inputBg },
    cardTitle: { color: C.gold, fontWeight: '700', marginBottom: 6 },
    readingCardImage: { width: '100%', height: 170, marginBottom: 6 },
    favoritesSectionButton: { backgroundColor: isLight ? 'rgba(194,24,91,0.06)' : 'rgba(228,195,38,0.06)', borderColor: isLight ? 'rgba(194,24,91,0.3)' : 'rgba(228,195,38,0.3)' },
    nestedDropdownList: { marginBottom: 8, paddingLeft: 12, backgroundColor: 'transparent' },
    demaisTiragensSectionTitle: { color: C.gold, fontSize: 13, fontWeight: '600', marginTop: 8, marginBottom: 8, paddingHorizontal: 4, opacity: 0.8 },
  });
}

// Compatibilidade com imports antigos
import { Colors } from '../GlobalStyles';
export const tiragemScreenStyles = makeTiragemStyles(false);