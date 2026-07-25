import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { getDictionary, localeIntl } from '@/lib/i18n';
import { getLocale } from '@/lib/i18n-server';

export default async function Results() {
  const session = await requireUser();
  const results = await prisma.result.findMany({ where: { userId: session.userId }, orderBy: { createdAt: 'desc' } });
  const locale = await getLocale();
  const t = getDictionary(locale);
  return (
    <main className="shell">
      <h1>{t.results.title}</h1>
      <div className="card">
        {results.length ? (
          <table className="table">
            <thead><tr><th>{t.results.date}</th><th>{t.results.correct}</th><th>{t.results.percent}</th><th></th></tr></thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{r.createdAt.toLocaleString(localeIntl[locale])}</td>
                  <td>{r.score} / {r.total}</td>
                  <td>{Math.round((r.score / r.total) * 100)}%</td>
                  <td><Link href={`/results/${r.id}`}>{t.results.view}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>{t.results.empty} <Link href="/test">{t.results.start}</Link></p>
        )}
      </div>
    </main>
  );
}
