# Production container build for EduSphere Smart Campus OS
FROM node:22-slim AS build

WORKDIR /app

# Install build dependencies for native compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Runner Stage (Debian glibc for rock-solid SQLite stability)
FROM node:22-slim AS runner

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/uploads ./uploads

EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

CMD ["node", "server/index.js"]
