# Multi-stage Dockerfile for PumpItBetter SSR Marketing Site + SPA App
# Deploys both marketing website and fitness app on single Fly.io instance

FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
# Skip postinstall script in Docker builds  
RUN npm ci --ignore-scripts

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
# Skip postinstall script in Docker builds
RUN npm ci --omit=dev --ignore-scripts

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app

# Ensure scripts are executable
RUN chmod +x scripts/*.sh

# Build both SSR marketing site and SPA fitness app
# Use React Router CLI for proper SSR and SPA builds
RUN /bin/sh scripts/setup-ssr-routes.sh && npx react-router build && /bin/sh scripts/cleanup-ssr-routes.sh
RUN /bin/sh scripts/setup-spa-routes.sh && npx react-router build && /bin/sh scripts/cleanup-spa-routes.sh

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 reactrouter

# Copy built applications and scripts
COPY --from=build-env --chown=reactrouter:nodejs /app/build/ssr ./ssr
COPY --from=build-env --chown=reactrouter:nodejs /app/build/spa ./spa
COPY --from=build-env --chown=reactrouter:nodejs /app/public ./public
COPY --from=build-env --chown=reactrouter:nodejs /app/server.js ./server.js
COPY --from=production-dependencies-env --chown=reactrouter:nodejs /app/node_modules ./node_modules
COPY --from=build-env /app/package.json ./package.json

USER reactrouter

EXPOSE 8080
ENV PORT=8080
ENV HOST=0.0.0.0

# Start the combined server that serves both SSR and SPA
CMD ["node", "server.js"]