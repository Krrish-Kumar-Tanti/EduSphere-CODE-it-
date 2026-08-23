# Production container build for EduSphere Smart Campus OS
FROM node:22-bookworm-slim

WORKDIR /app

# Install build tools for better-sqlite3 native compilation
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

CMD ["node", "server/index.js"]
