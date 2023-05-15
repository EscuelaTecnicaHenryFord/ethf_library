FROM node:16-alpine3.17
WORKDIR /app

ENV NODE_ENV production
ENV DATABASE_URL=file:/database/db.sqlite

COPY prisma ./

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./


RUN \
 if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
 elif [ -f package-lock.json ]; then npm ci; \
 elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
 else echo "Lockfile not found." && exit 1; \
 fi

COPY . .

RUN yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm run build

EXPOSE 3000

CMD npx prisma db push && npm run start