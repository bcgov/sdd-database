FROM node:22.13.0

WORKDIR /app

COPY package*.json ./

RUN npm install --production

# Copy the rest of your code, including src/app/ for Next.js
COPY . .

# Build the Next.js app (generates .next folder)
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
