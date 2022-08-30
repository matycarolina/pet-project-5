FROM node:alpine

WORKDIR /app
COPY package*.json .
COPY prisma ./prisma/ 
RUN npx prisma generate
RUN npm install --only=prod