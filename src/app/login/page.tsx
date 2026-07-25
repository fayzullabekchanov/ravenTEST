import Link from 'next/link';
import { login } from '@/app/actions';
import { getDictionary } from '@/lib/i18n';
import { getLocale } from '@/lib/i18n-server';

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const errorMessage = error && error in t.errors ? t.errors[error as keyof typeof t.errors] : null;
  return (
    <main className="shell">
      <form action={login} className="card form">
        <h1>{t.login.title}</h1>
        {errorMessage && <p className="alert">{errorMessage}</p>}
        <label className="field">{t.login.email}<input name="email" type="email" required /></label>
        <label className="field">{t.login.password}<input name="password" type="password" required /></label>
        <button className="button">{t.login.submit}</button>
        <p className="muted">{t.login.noAccount} <Link href="/register">{t.login.registerLink}</Link></p>
      </form>
    </main>
  );
}
