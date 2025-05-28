# Используем node для сборки и запуска
FROM node:20 AS build

WORKDIR /app

# Копируем package.json и package-lock.json для фронта и бэка
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Устанавливаем зависимости фронта и бэка
RUN cd frontend && npm ci
RUN cd backend && npm ci

# Копируем исходники
COPY frontend ./frontend
COPY backend ./backend

# Собираем фронт и копируем билд в backend/public
RUN cd frontend && npm run build && rm -rf ../backend/public && cp -r build ../backend/public

# Собираем backend (tsc)
RUN cd backend && npm run build

# Production image
FROM node:20-slim
WORKDIR /app

# Копируем собранный backend и public
COPY --from=build /app/backend/dist ./dist
COPY --from=build /app/backend/public ./public
COPY --from=build /app/backend/package*.json ./

RUN npm ci --omit=dev

ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/app.js"] 