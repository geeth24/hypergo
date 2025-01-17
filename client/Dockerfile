# Base image for development
FROM node:18-alpine AS dev

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml to install dependencies
COPY package.json pnpm-lock.yaml ./

COPY .env .env

# Install all dependencies
RUN pnpm install

# Copy all source code
COPY . .

# Expose the Next.js dev server port
EXPOSE 3000

# Start Next.js in development mode with hot reloading
CMD ["pnpm", "run", "dev"]
