// import { PrismaClient, Role } from '@prisma/client';
// import bcrypt from 'bcryptjs';
// import fs from 'node:fs';
// import path from 'node:path';
//
// const prisma = new PrismaClient();
// const file = path.join(process.cwd(), 'prisma/raven-source.html');
// const src = fs.readFileSync(file, 'utf8');
// const asset = (s: string) => s.match(/\/([^/\"\\]+\.jpg)/)?.[1] ?? '';
// const blocks = src.split(/<div id="dq_\d+" class="otp-item-view-question">/).slice(1);
// const questions = blocks.map((block, index) => {
//   const images = [...block.matchAll(/<img[^>]+src="([^\"]+\.jpg)"/g)].map((m) => asset(m[1]));
//   const answerSection = block.match(/<div id="d-q-ans-container"[\s\S]*?<div class="clearfix"><\/div>/)?.[0] || '';
//   const options = [...answerSection.matchAll(/<img[^>]+src="([^\"]+\.jpg)"/g)].map((m) => asset(m[1]));
//   const marked = [...answerSection.matchAll(/otp-item-ans-correct[\s\S]{0,400}?<img[^>]+src="([^\"]+\.jpg)"/g)].map((m) => asset(m[1]))[0];
//   const right = block.match(/<div class="rightanswers">[\s\S]*?<img[^>]+src="([^\"]+\.jpg)"/)?.[1];
//   const correct = marked || (right ? asset(right) : '');
//   if (!images[0] || ![6, 8].includes(options.length) || !correct || options.indexOf(correct) < 0) throw new Error(`Question ${index + 1} could not be parsed`);
//   return { position: index + 1, image: images[0], options, correctIndex: options.indexOf(correct) };
// });
//
// async function main() {
//   for (const q of questions) await prisma.question.upsert({ where: { position: q.position }, update: q, create: q });
//   const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
//   if (!process.env.ADMIN_PASSWORD) {
//     console.warn('OGOHLANTIRISH: ADMIN_PASSWORD berilmadi, ma\'lum standart parol ishlatilmoqda. .env faylida ADMIN_PASSWORD ni albatta o\'rnating!');
//   }
//   const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'ChangeThisSecurePassword123!', 12);
//   await prisma.user.upsert({ where: { email }, update: { role: Role.ADMIN }, create: { name: 'Administrator', email, passwordHash, role: Role.ADMIN } });
//   console.log(`${questions.length} ta Raven savoli va admin tayyor.`);
// }
// main().finally(() => prisma.$disconnect());




import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// HTML faylsiz ishlaydigan soxta (mock) test savollari massivi
const dummyQuestions = [
  { position: 1, image: "question1.jpg", options: ["opt1.jpg", "opt2.jpg", "opt3.jpg", "opt4.jpg", "opt5.jpg", "opt6.jpg"], correctIndex: 0 },
  { position: 2, image: "question2.jpg", options: ["opt1.jpg", "opt2.jpg", "opt3.jpg", "opt4.jpg", "opt5.jpg", "opt6.jpg"], correctIndex: 1 },
  { position: 3, image: "question3.jpg", options: ["opt1.jpg", "opt2.jpg", "opt3.jpg", "opt4.jpg", "opt5.jpg", "opt6.jpg"], correctIndex: 2 }
];

async function main() {
  // Savollarni bazaga yuklash
  for (const q of dummyQuestions) {
    await prisma.question.upsert({
      where: { position: q.position },
      update: q,
      create: q
    });
  }

  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  if (!process.env.ADMIN_PASSWORD) {
    console.warn('OGOHLANTIRISH: ADMIN_PASSWORD berilmadi, ma\'lum standart parol ishlatilmoqda. .env faylida ADMIN_PASSWORD ni albatta o\'rnating!');
  }
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'ChangeThisSecurePassword123!', 12);

  // Admin foydalanuvchini yaratish
  await prisma.user.upsert({
    where: { email },
    update: { role: Role.ADMIN },
    create: { name: 'Administrator', email, passwordHash, role: Role.ADMIN }
  });

  console.log(`${dummyQuestions.length} ta vaqtinchalik Raven savoli va admin muvaffaqiyatli tayyorlandi.`);
}

main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });

