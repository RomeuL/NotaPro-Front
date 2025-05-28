# Estágio de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Criar uma configuração TypeScript correta para Next.js
RUN printf "/** @type {import('next').NextConfig} */\nconst nextConfig = {};\nexport default nextConfig;" > next.config.ts

# Corrigir problemas de tipo em tempo de compilação
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max_old_space_size=4096"

RUN npx next build --no-lint

# Estágio de produção
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3056

# Copiar arquivos necessários
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expor a porta personalizada
EXPOSE 3056

# Iniciar a aplicação
CMD ["npm", "start"]