import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { getDictionary, localeIntl } from '@/lib/i18n';
import { getLocale } from '@/lib/i18n-server';

type StoredAnswer = { questionId: number; selectedIndex: number };
const SERIES_LABELS = ['A', 'B', 'C', 'D', 'E'] as const;
const QUESTIONS_PER_SERIES = 12;

function getPercentageLevel(percent: number): 1 | 2 | 3 | 4 | 5 {
  if (percent >= 95) return 1;
  if (percent >= 75) return 2;
  if (percent >= 25) return 3;
  if (percent >= 5) return 4;
  return 5;
}

export default async function Result({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireUser();
  const { id } = await params;
  const result = await prisma.result.findUnique({ where: { id }, include: { user: true } });
  if (!result || (result.userId !== session.userId && session.role !== 'ADMIN')) notFound();
  const locale = await getLocale();
  const t = getDictionary(locale);
  const percent = Math.round((result.score / result.total) * 100);
  const level = getPercentageLevel(percent);
  const levelText = t.resultDetail[`level${level}` as 'level1' | 'level2' | 'level3' | 'level4' | 'level5'];

  const questions = await prisma.question.findMany({
    select: { id: true, position: true, correctIndex: true },
    orderBy: { position: 'asc' },
  });
  const questionById = new Map(questions.map((q) => [q.id, q]));

  const seriesStats = SERIES_LABELS.map((label) => ({ label, correct: 0, total: 0 }));
  for (const raw of result.answers as StoredAnswer[]) {
    const q = questionById.get(raw.questionId);
    if (!q) continue;
    const seriesIndex = Math.floor((q.position - 1) / QUESTIONS_PER_SERIES);
    const stat = seriesStats[seriesIndex];
    if (!stat) continue;
    stat.total += 1;
    if (raw.selectedIndex === q.correctIndex) stat.correct += 1;
  }
  const hasSeriesData = seriesStats.some((s) => s.total > 0);

  return (
    <main className="shell">
      <section className="card hero">
        <p className="muted">{t.resultDetail.subtitle}</p>
        <div className="score">{result.score}<small>/{result.total}</small></div>
        <h1>{percent}%</h1>
        <p className="muted"><b>{t.resultDetail.levelLabel}:</b> {levelText}</p>
        <p className="muted">{t.resultDetail.completedOn(result.createdAt.toLocaleString(localeIntl[locale]))}</p>
        <Link className="button" href="/test">{t.resultDetail.retake}</Link>
      </section>

      {hasSeriesData ? (
        <section className="card">
          <h2>{t.resultDetail.seriesTitle}</h2>
          <table className="table">
            <thead>
              <tr>
                <th>{t.resultDetail.seriesCol}</th>
                <th>{t.resultDetail.totalCol}</th>
                <th>{t.resultDetail.correctCol}</th>
              </tr>
            </thead>
            <tbody>
              {seriesStats.map((s) => (
                <tr key={s.label}>
                  <td><b>{s.label}</b></td>
                  <td>{s.total}</td>
                  <td>{s.correct}</td>
                </tr>
              ))}
              <tr>
                <td><b>{t.resultDetail.totalRow}</b></td>
                <td><b>{seriesStats.reduce((sum, s) => sum + s.total, 0)}</b></td>
                <td><b>{seriesStats.reduce((sum, s) => sum + s.correct, 0)}</b></td>
              </tr>
            </tbody>
          </table>
        </section>
      ) : null}
    </main>
  );
}
