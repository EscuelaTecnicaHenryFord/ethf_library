FROM oven/bun:1 AS base
WORKDIR /app

ENV NODE_ENV production
ENV DATABASE_URL=file:/database/db.sqlite

COPY prisma ./

COPY package.json bun.lock ./

RUN bun install

COPY . .

RUN bun run build

EXPOSE 3000

CMD bun prisma db push && bun run start
