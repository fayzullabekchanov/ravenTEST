import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isLocale, localeCookieName } from '@/lib/i18n';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale');
  const redirectTo = url.searchParams.get('redirect') || '/';
  const safeRedirect = redirectTo.startsWith('/') ? redirectTo : '/';

  if (isLocale(locale)) {
    const store = await cookies();
    store.set(localeCookieName, locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
  }

  return NextResponse.redirect(new URL(safeRedirect, request.url));
}
