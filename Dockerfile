# Use official Node image
FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the NestJS app
RUN npm run build

# Expose application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]