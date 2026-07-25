'use client';
import { useState } from 'react';
import { submitTest } from '@/app/actions';
import type { Dictionary } from '@/lib/i18n';

type Question = { id: number; position: number; image: string; options: string[] };
type TestDict = Dictionary['test'];

export function RavenTestForm({ questions, t }: { questions: Question[]; t: TestDict }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const q = questions[current];

  return (
    <form action={submitTest} className="card">
      {Object.entries(answers).map(([id, answer]) => (
        <input key={id} type="hidden" name={`q-${id}`} value={answer} />
      ))}
      <div className="question-head">
        <div>
          <b>{t.question} {current + 1} / {questions.length}</b>
          <div className="muted">{t.hint}</div>
        </div>
        <b>{t.answered.replace('{n}', String(Object.keys(answers).length))}</b>
      </div>
      <div className="progress"><i style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
      <img className="matrix" src={`/raven/${q.image}`} alt={`${t.question} ${q.position}`} />
      <div className="options">
        {q.options.map((image, index) => (
          <label className={`option ${answers[q.id] === index ? 'selected' : ''}`} key={image}>
            <input className="sr-only" type="radio" checked={answers[q.id] === index} onChange={() => setAnswers({ ...answers, [q.id]: index })} />
            <b>{index + 1}</b>
            <img src={`/raven/${image}`} alt={`${index + 1}`} />
          </label>
        ))}
      </div>
      <div className="pager">
        <button type="button" className="button secondary" disabled={!current} onClick={() => setCurrent(current - 1)}>{t.prev}</button>
        {current < questions.length - 1 ? (
          <button type="button" className="button" onClick={() => setCurrent(current + 1)}>{t.next}</button>
        ) : (
          <button className="button">{t.finish}</button>
        )}
      </div>
    </form>
  );
}
