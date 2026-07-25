import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';
import { getLocale } from '@/lib/i18n-server';
import { LanguageSwitcher } from '@/components/language-switcher';

export const metadata: Metadata = {
  title: 'MIA',
  description: "Raven progressiv matritsalari asosidagi mantiqiy fikrlash testi",
};

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const locale = await getLocale();
  const t = getDictionary(locale);
  return (
    <html lang={locale}>
      <body>
        <nav className="nav">
          <Link className="brand" href="/">{t.nav.brand}</Link>
          <div className="navlinks">
            {session ? (
              <>
                <Link href="/test">{t.nav.test}</Link>
                <Link href="/results">{t.nav.results}</Link>
                {session.role === 'ADMIN' && <Link href="/admin">{t.nav.admin}</Link>}
                <form action="/api/auth/logout" method="post"><button className="button secondary">{t.nav.logout}</button></form>
              </>
            ) : (
              <>
                <Link href="/login">{t.nav.login}</Link>
                <Link className="button" href="/register">{t.nav.register}</Link>
              </>
            )}
            <LanguageSwitcher current={locale} />
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
