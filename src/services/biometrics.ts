import { Platform } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

let rnBiometrics: ReactNativeBiometrics | null = null;

function getBiometricsInstance() {
  if (Platform.OS === 'web') return null;
  if (rnBiometrics) return rnBiometrics;

  try {
    rnBiometrics = new ReactNativeBiometrics();
    return rnBiometrics;
  } catch {
    return null;
  }
}

export async function canUseBiometrics(): Promise<boolean> {
  const biometrics = getBiometricsInstance();
  if (!biometrics) return false;

  try {
    const { available } = await biometrics.isSensorAvailable();
    return available;
  } catch {
    return false;
  }
}

export async function requestBiometricAuth(promptMessage: string): Promise<boolean> {
  const biometrics = getBiometricsInstance();
  if (!biometrics) return false;

  try {
    const { success } = await biometrics.simplePrompt({ promptMessage });
    return success;
  } catch {
    return false;
  }
}
