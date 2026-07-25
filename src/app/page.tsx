import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { getDictionary } from '@/lib/i18n';
import { getLocale } from '@/lib/i18n-server';

export default async function Home() {
  const user = await getSession();
  const locale = await getLocale();
  const t = getDictionary(locale);
  return (
    <main className="shell">
      <section className="hero">
        <p className="muted">{t.home.tag}</p>
        <h1>{t.home.title}</h1>
        <p className="muted" style={{ textAlign: "justify" }}>{t.home.subtitle}</p>
        <Link className="button" href={user ? '/test' : '/register'}>{user ? t.home.startTest : t.home.startRegister}</Link>
      </section>
    </main>
  );
}
