'use server';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { clearSession, createSession, requireUser } from '@/lib/auth';

const emailOf = (form: FormData) => String(form.get('email') || '').trim().toLowerCase();

export async function register(form: FormData) {
  const name = String(form.get('name') || '').trim(); const email = emailOf(form); const password = String(form.get('password') || '');
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) redirect('/register?error=invalidData');
  if (await prisma.user.findUnique({ where: { email } })) redirect('/register?error=emailTaken');
  const user = await prisma.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 12) } });
  await createSession({ userId: user.id, role: user.role, name: user.name }); redirect('/test');
}

export async function login(form: FormData) {
  const email = emailOf(form); const password = String(form.get('password') || ''); const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) redirect('/login?error=invalidCredentials');
  await createSession({ userId: user.id, role: user.role, name: user.name }); redirect(user.role === Role.ADMIN ? '/admin' : '/test');
}

export async function logout() { await clearSession(); redirect('/'); }

export async function submitTest(form: FormData) {
  const session = await requireUser(); const questions = await prisma.question.findMany({ orderBy: { position: 'asc' } });
  if (questions.length !== 60) redirect('/test?error=questionsNotReady');
  const answers = questions.map(q => {
    const value = form.get(`q-${q.id}`);
    const selectedIndex = value === null ? -1 : Number(value);
    return { questionId: q.id, selectedIndex };
  });
  const score = answers.reduce((sum, a, index) => sum + (a.selectedIndex === questions[index].correctIndex ? 1 : 0), 0);
  const result = await prisma.result.create({ data: { userId: session.userId, score, total: questions.length, answers } }); redirect(`/results/${result.id}`);
}
