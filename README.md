# Raven Test

Next.js va PostgreSQL asosidagi Raven test ilovasi. Ro‘yxatdan o‘tish, kirish, natijani shaxsiy tarixda saqlash va admin panel mavjud.

## Ishga tushirish

1. PostgreSQL ishlayotgan bo‘lsin. Kerak bo‘lsa `docker compose up -d` buyrug‘i loyiha ichidagi Postgres 16 konteynerini ishga tushiradi.
2. `.env.example` faylidan `.env` yarating va PostgreSQL ulanishini kiriting.
3. `npm install`
4. `npm run db:generate && npm run db:push && npm run db:seed`
5. `npm run dev`

`ADMIN_EMAIL` va `ADMIN_PASSWORD` orqali seed qilingan admin akkaunti yaratiladi. Ishlab chiqarish muhitida `AUTH_SECRET` qiymatini 32 belgidan uzun tasodifiy maxfiy kalitga almashtiring.
