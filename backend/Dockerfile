# ========================================
# Build Stage
# ========================================
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies strictly from package-lock for determinism
COPY package*.json ./
RUN npm ci --only=production

# Copy source code and uploads dir
COPY src ./src
RUN mkdir -p ./src/uploads

# ========================================
# Production Stage
# ========================================
FROM node:18-alpine

WORKDIR /app

# Install PM2 globally to utilize multi-core clustering inside the container
RUN npm install -g pm2

# Create necessary directories and assign ownership to non-root 'node' user
RUN mkdir -p /app/src/uploads /app/logs && chown -R node:node /app

# Switch to least-privileged user for security compliance
USER node

# Copy built assets and dependencies from builder stage
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/src ./src
COPY --chown=node:node package*.json ./
COPY --chown=node:node ecosystem.config.js ./

EXPOSE 3000

# Docker-native healthcheck routing to our custom API health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

# Execute PM2 Runtime which binds to container lifecycle
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
