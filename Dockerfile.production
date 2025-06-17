# Multi-stage build para optimizar tamaño de imagen
FROM node:20-alpine AS builder

# Instalar dependencias del sistema necesarias para compilación
RUN apk add --no-cache python3 make g++ postgresql-client

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Instalar todas las dependencias (incluyendo dev para build)
RUN npm ci --no-audit --frozen-lockfile

# Copiar código fuente
COPY . .

# Compilar aplicación
RUN npm run build

# Verificar que los archivos fueron generados
RUN ls -la dist/ && echo "Build completed successfully"

# Segunda etapa - imagen de producción
FROM node:20-alpine AS production

# Instalar dependencias de runtime
RUN apk add --no-cache \
    curl \
    postgresql-client \
    dumb-init

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copiar package.json para instalar solo dependencias de producción
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production --no-audit --frozen-lockfile && \
    npm cache clean --force

# Copiar archivos compilados desde builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/node_modules/drizzle-kit ./node_modules/drizzle-kit
COPY --from=builder /app/migrations ./migrations

# Cambiar ownership a usuario no-root
RUN chown -R nextjs:nodejs /app
USER nextjs

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0

# Exponer puerto
EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Script de inicio
RUN echo '#!/bin/sh\n\
set -e\n\
echo "🚀 Starting PrinterHub application..."\n\
\n\
# Verificar variables de entorno requeridas\n\
if [ -z "$DATABASE_URL" ]; then\n\
  echo "❌ Error: DATABASE_URL not configured"\n\
  exit 1\n\
fi\n\
\n\
echo "✅ DATABASE_URL configured"\n\
echo "✅ PORT: $PORT"\n\
echo "✅ NODE_ENV: $NODE_ENV"\n\
\n\
# Aplicar migraciones de base de datos\n\
echo "🔄 Applying database migrations..."\n\
npx drizzle-kit push || {\n\
  echo "⚠️ Warning: Migration failed, but continuing..."\n\
}\n\
\n\
# Iniciar servidor\n\
echo "🎯 Starting server on port $PORT..."\n\
exec node dist/index.js' > /app/start.sh && chmod +x /app/start.sh

# Usar dumb-init para manejo correcto de señales
ENTRYPOINT ["dumb-init", "--"]
CMD ["/app/start.sh"]