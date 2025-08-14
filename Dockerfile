FROM oven/bun:1 AS base
WORKDIR /app

ENV NODE_ENV production
ENV DATABASE_URL=file:/database/db.sqlite

COPY prisma ./

COPY package.json bun.lock ./

RUN yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm install

COPY . .

RUN yarn global add bun && SKIP_ENV_VALIDATION=1 bun run build

EXPOSE 3000

CMD bun prisma db push && bun run start
