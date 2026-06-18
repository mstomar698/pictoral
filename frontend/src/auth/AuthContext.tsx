import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authConfig } from './config';
import { clearSession, getSession, setSession } from './session';
import type { AuthUser } from './types';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signInGuest: () => void;
  signInGoogle: (profile: { sub: string; name: string; email?: string; picture?: string }) => void;
  signInGitHub: (profile: { id: number; login: string; name?: string | null; avatar_url?: string; email?: string | null }) => void;
  signOut: () => void;
  startGitHubOAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => getSession());

  useEffect(() => {
    if (user) setSession(user);
  }, [user]);

  const signInGuest = useCallback(() => {
    const guest: AuthUser = {
      id: 'guest',
      name: 'Guest',
      provider: 'guest',
    };
    setUser(guest);
    setSession(guest);
  }, []);

  const signInGoogle = useCallback(
    (profile: { sub: string; name: string; email?: string; picture?: string }) => {
      const next: AuthUser = {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        avatarUrl: profile.picture,
        provider: 'google',
      };
      setUser(next);
      setSession(next);
    },
    []
  );

  const signInGitHub = useCallback(
    (profile: {
      id: number;
      login: string;
      name?: string | null;
      avatar_url?: string;
      email?: string | null;
    }) => {
      const next: AuthUser = {
        id: String(profile.id),
        name: profile.name || profile.login,
        email: profile.email || undefined,
        avatarUrl: profile.avatar_url,
        provider: 'github',
      };
      setUser(next);
      setSession(next);
    },
    []
  );

  const signOut = useCallback(() => {
    setUser(null);
    clearSession();
  }, []);

  const startGitHubOAuth = useCallback(() => {
    if (!authConfig.isGitHubEnabled()) return;
    const redirectUri = `${window.location.origin}${URL_PATH || ''}/auth/callback/github`;
    const params = new URLSearchParams({
      client_id: authConfig.githubClientId,
      redirect_uri: redirectUri,
      scope: 'read:user user:email',
    });
    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signInGuest,
      signInGoogle,
      signInGitHub,
      signOut,
      startGitHubOAuth,
    }),
    [user, signInGuest, signInGoogle, signInGitHub, signOut, startGitHubOAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
