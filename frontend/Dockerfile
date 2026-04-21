# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --silent

COPY public/ ./public/
COPY src/ ./src/
COPY tsconfig.json ./
COPY tailwind.config.js postcss.config.js ./

# Remove test files before build
RUN find src -name "*.test.tsx" -o -name "*.test.ts" | xargs rm -f

RUN npm run build

# Stage 2: Runtime
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
