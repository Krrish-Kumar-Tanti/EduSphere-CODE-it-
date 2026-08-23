# Multi-stage production container build for EduSphere Smart Campus OS
FROM node:20-alpine AS build

WORKDIR /app

# Install build dependencies for better-sqlite3 native compilation
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production Runner Stage
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/uploads ./uploads

EXPOSE 5001

ENV NODE_ENV=production
ENV PORT=5001

CMD ["node", "server/index.js"]
