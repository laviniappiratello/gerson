import { StyleSheet } from 'react-native';
import { Colors } from '../GlobalStyles';

export const tiragemScreenStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.deepBlue },
  page: {
    padding: 18,
    paddingBottom: 56,
    backgroundColor: Colors.deepBlue,
  },
  kicker: {
    color: Colors.gold,
    textAlign: 'center',
    letterSpacing: 1,
    fontSize: 11,
    opacity: 0.9,
    marginTop: 6,
  },
  block: {
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.24)',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    backgroundColor: 'rgba(38,17,51,0.82)',
  },
  blockTitle: {
    color: Colors.gold,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  baseText: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.2)',
    borderRadius: 16,
    minHeight: 88,
    padding: 14,
    color: Colors.text,
    marginBottom: 10,
    textAlignVertical: 'top',
    backgroundColor: 'rgba(12,7,20,0.38)',
  },
  questionText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.24)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: 'rgba(12,7,20,0.36)',
  },
  dropdownTitle: {
    color: Colors.gold,
    fontWeight: '700',
  },
  dropdownList: {
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  dropdownItem: {
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.14)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
    backgroundColor: 'rgba(12,7,20,0.34)',
  },
  dropdownItemActive: {
    borderColor: 'rgba(228,195,38,0.7)',
    backgroundColor: 'rgba(46,22,61,0.8)',
  },
  dropdownItemTitle: {
    color: Colors.gold,
    fontWeight: '700',
    marginBottom: 4,
  },
  dropdownItemText: {
    color: Colors.text,
    fontSize: 13,
  },
  card: {
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.22)',
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(12,7,20,0.42)',
  },
  cardTitle: {
    color: Colors.gold,
    fontWeight: '700',
    marginBottom: 6,
  },
  readingCardImage: {
    width: '100%',
    height: 170,
    marginBottom: 6,
  },
});
