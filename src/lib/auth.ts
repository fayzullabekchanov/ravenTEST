import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
const authSecret = process.env.AUTH_SECRET;
if (!authSecret && process.env.NODE_ENV === 'production') {
  throw new Error('AUTH_SECRET muhit o‘zgaruvchisi production muhitida majburiy. .env faylida kamida 32 belgili tasodifiy qiymat bering.');
}
const key = new TextEncoder().encode(authSecret || 'development-secret-change-me-32chars');
const cookieName = 'raven_session';
type Session = { userId: string; role: Role; name: string };
export async function createSession(session: Session) {
  const token = await new SignJWT(session).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(key);
  const store = await cookies();
  store.set(cookieName, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 7 });
}
export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, key)).payload as unknown as Session; } catch { return null; }
}
export async function requireUser() { const s = await getSession(); if (!s) redirect('/login'); return s; }
export async function requireAdmin() { const s = await requireUser(); if (s.role !== Role.ADMIN) redirect('/results'); return s; }
export async function clearSession() { (await cookies()).delete(cookieName); }
