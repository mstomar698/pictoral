export type AuthProvider = 'google' | 'github' | 'guest';

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  provider: AuthProvider;
}

export type CookieConsentLevel = 'accepted' | 'essential' | 'declined' | null;
