import { cookies } from 'next/headers';

const COOKIE_NAME = 'rnr_admin';
const COOKIE_VALUE = 'authenticated';

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'rocknretro2026';
}

export function verifyPassword(password: string): boolean {
  return password === getAdminPassword();
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME);
  return token?.value === COOKIE_VALUE;
}

export function getAuthCookieConfig() {
  return {
    name: COOKIE_NAME,
    value: COOKIE_VALUE,
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
    sameSite: 'lax' as const,
  };
}
