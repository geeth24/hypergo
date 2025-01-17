# Base image for development
FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files first to leverage Docker caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN pnpm run build

# Expose the Next.js port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]