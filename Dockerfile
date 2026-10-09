FROM public.ecr.aws/docker/library/node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Fase 1: Dependencias
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Usamos npm install con legacy peer deps para máxima compatibilidad
RUN npm install --legacy-peer-deps

# Generar Prisma Client
RUN npx prisma generate

# Fase 2: Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Asegurar carpeta public
RUN mkdir -p public

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Fallback temporal para la fase de compilación en caso de que Railway no inyecte DATABASE_URL en build
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/luminavite?schema=public"

RUN npm run build

# Fase 3: Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir -p public
COPY --from=builder /app/public ./public

# Artefactos standalone de Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
