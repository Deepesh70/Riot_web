# Multi-stage production Dockerfile for Riot ReImagined API Server
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Create non-root system user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 riotuser

# Copy application artifacts
COPY --from=builder --chown=riotuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=riotuser:nodejs /app/Controllers ./Controllers
COPY --from=builder --chown=riotuser:nodejs /app/Middleware ./Middleware
COPY --from=builder --chown=riotuser:nodejs /app/Models ./Models
COPY --from=builder --chown=riotuser:nodejs /app/Routes ./Routes
COPY --from=builder --chown=riotuser:nodejs /app/Utils ./Utils
COPY --from=builder --chown=riotuser:nodejs /app/index.js ./index.js
COPY --from=builder --chown=riotuser:nodejs /app/package.json ./package.json

USER riotuser

EXPOSE 5000

CMD ["node", "index.js"]
