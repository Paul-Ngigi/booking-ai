# Use official Node 
FROM node:22-alpine

WORKDIR /app

# Install required dependency for keytar
RUN apk add --no-cache libsecret

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]