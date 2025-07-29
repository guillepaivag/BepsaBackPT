FROM node:18.12-alpine3.16 AS base
  WORKDIR /app
  ENV HOST 0.0.0.0
  COPY package*.json ./
  RUN npm ci --omit=optional --audit=false --fund=false

FROM base AS builder
  RUN npm install --omit=optional --audit=false --fund=false
  COPY . .
  RUN npm run build

FROM builder AS runner
  COPY --from=builder ./app/dist ./dist
  CMD ["npm", "run", "start:dev"]