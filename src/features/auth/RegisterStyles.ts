import { StyleSheet } from 'react-native';
import { Colors } from '../../styles/GlobalStyles';

export const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 54,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    paddingHorizontal: 18,
    color: Colors.text,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(228,195,38,0.24)',
  },
  label: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },

  secondaryButton: {
    width: '100%',
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.gold,
    backgroundColor: Colors.purple,
    marginBottom: 0,
  },
  webDateInput: {
    color: Colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    backgroundColor: 'transparent', 
    padding: 0,
    marginBottom: 20,
  },
  value: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});