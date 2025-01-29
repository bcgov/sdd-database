# Stage 1: Build
FROM node:22.13.1 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy the rest of your code, including src/app/ for Next.js
COPY . .

# Build the Next.js app (generates .next folder)
RUN npm run build

# Stage 2: Production
FROM node:22.13.1

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "start"]
