import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { getDictionary, localeIntl } from '@/lib/i18n';
import { getLocale } from '@/lib/i18n-server';

export default async function Admin() {
  await requireAdmin();
  const [results, users, count] = await Promise.all([
    prisma.result.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.user.count(),
    prisma.question.count(),
  ]);
  const locale = await getLocale();
  const t = getDictionary(locale);
  return (
    <main className="shell">
      <h1>{t.admin.title}</h1>
      <p className="muted">{t.admin.stats(users, count)}</p>
      <div className="card">
        <table className="table">
          <thead><tr><th>{t.admin.user}</th><th>{t.admin.email}</th><th>{t.admin.result}</th><th>{t.admin.date}</th></tr></thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td><Link href={`/results/${r.id}`}>{r.user.name}</Link></td>
                <td>{r.user.email}</td>
                <td>{r.score} / {r.total}</td>
                <td>{r.createdAt.toLocaleString(localeIntl[locale])}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!results.length && <p>{t.admin.empty}</p>}
      </div>
    </main>
  );
}
