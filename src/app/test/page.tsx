import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { RavenTestForm } from '@/components/raven-test-form';
import { getDictionary } from '@/lib/i18n';
import { getLocale } from '@/lib/i18n-server';

export default async function TestPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireUser();
  const q = await prisma.question.findMany({ select: { id: true, position: true, image: true, options: true }, orderBy: { position: 'asc' } });
  const { error } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const errorMessage = error && error in t.errors ? t.errors[error as keyof typeof t.errors] : null;
  return (
    <main className="shell">
      <h1>{t.test.title}</h1>
      {errorMessage ? <p className="alert">{errorMessage}</p> : null}
      {q.length === 60 ? (
        <RavenTestForm questions={q} t={t.test} />
      ) : (
        <div className="card">
          <p>{t.test.notReady}</p>
          <p className="muted">{t.test.notReadyHint}</p>
        </div>
      )}
    </main>
  );
}
