import type { AuthUser, CookieConsentLevel } from './types';

const SESSION_KEY = 'pictoral_auth_session';
const CONSENT_KEY = 'pictoral_cookie_consent';

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getSession(): AuthUser | null {
  return safeParse<AuthUser>(localStorage.getItem(SESSION_KEY));
}

export function setSession(user: AuthUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  document.cookie = `pictoral_session=1; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  document.cookie = 'pictoral_session=; path=/; max-age=0; SameSite=Lax';
}

export function getCookieConsent(): CookieConsentLevel {
  const v = localStorage.getItem(CONSENT_KEY);
  if (v === 'accepted' || v === 'essential' || v === 'declined') return v;
  return null;
}

export function setCookieConsent(level: Exclude<CookieConsentLevel, null>): void {
  localStorage.setItem(CONSENT_KEY, level);
}
