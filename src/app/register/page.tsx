import Link from 'next/link';
import { register } from '@/app/actions';
import { getDictionary } from '@/lib/i18n';
import { getLocale } from '@/lib/i18n-server';

export default async function Register({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const errorMessage = error && error in t.errors ? t.errors[error as keyof typeof t.errors] : null;
  return (
    <main className="shell">
      <form action={register} className="card form">
        <h1>{t.register.title}</h1>
        {errorMessage && <p className="alert">{errorMessage}</p>}
        <label className="field">{t.register.fullName}<input name="name" minLength={2} required /></label>
        <label className="field">{t.register.email}<input name="email" type="email" required /></label>
        <label className="field">{t.register.password}<input name="password" type="password" minLength={8} required /><span className="muted">{t.register.minChars}</span></label>
        <button className="button">{t.register.submit}</button>
        <p className="muted">{t.register.haveAccount} <Link href="/login">{t.register.loginLink}</Link></p>
      </form>
    </main>
  );
}
