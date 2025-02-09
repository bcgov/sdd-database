# Stage 1: Build
FROM node:23.7.0 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy the rest of your code, including src/app/ for Next.js
COPY . .

# Generate the Prisma Client
RUN npx prisma generate

# Build the Next.js app (generates .next folder)
RUN npm run build

# Stage 2: Production
FROM node:23.7.0

WORKDIR /app

COPY package*.json ./

RUN npm install --production

# Copy Prisma Client from builder
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma

COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/next.config.ts /app/next.config.ts

EXPOSE 3000

CMD ["npm", "start"]
