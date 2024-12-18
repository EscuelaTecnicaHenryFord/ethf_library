FROM node:22-alpine3.19
WORKDIR /app

ENV NODE_ENV production
ENV DATABASE_URL=file:/database/db.sqlite

COPY prisma ./

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./

RUN yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm install

COPY . .

RUN yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm run build

EXPOSE 3000

CMD pnpm prisma db push && npm run start
