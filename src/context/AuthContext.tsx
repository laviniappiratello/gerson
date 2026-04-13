import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
    authenticateUser,
    clearSession,
    getUser,
    hasSeenOnboarding,
    isSessionLoggedIn,
    setOnboardingSeen,
    setSessionLoggedIn,
    type UserProfile,
} from '../services/storage';

type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; user: UserProfile };

type AuthContextValue = {
  state: AuthState;
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<'ok' | 'wrong_credentials'>;
  afterRegister: (profile: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  markOnboardingSeen: () => Promise<void>;
  onboardingSeen: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' });
  const [onboardingSeen, setOnboardingSeenState] = useState(false);

  useEffect(() => {
    void (async () => {
      const [seen, loggedIn] = await Promise.all([hasSeenOnboarding(), isSessionLoggedIn()]);

      setOnboardingSeenState(seen);

      if (!loggedIn) {
        setState({ status: 'unauthenticated' });
        return;
      }

      const user = await getUser();
      if (user) {
        setState({ status: 'authenticated', user });
        return;
      }

      await clearSession();
      setState({ status: 'unauthenticated' });
    })();
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    const profile = await authenticateUser(email, senha);
    if (!profile) return 'wrong_credentials';

    await setSessionLoggedIn(true);
    setState({ status: 'authenticated', user: profile });
    return 'ok';
  }, []);

  const afterRegister = useCallback(async (profile: UserProfile) => {
    await setSessionLoggedIn(true);
    setState({ status: 'authenticated', user: profile });
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setState({ status: 'unauthenticated' });
  }, []);

  const markOnboardingSeen = useCallback(async () => {
    await setOnboardingSeen();
    setOnboardingSeenState(true);
  }, []);

  const user = state.status === 'authenticated' ? state.user : null;
  const isLoading = state.status === 'loading';

  return (
    <AuthContext.Provider
      value={{
        state,
        user,
        isLoading,
        login,
        afterRegister,
        logout,
        markOnboardingSeen,
        onboardingSeen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  }
  return ctx;
}