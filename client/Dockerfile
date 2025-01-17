# Base image for development
FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files first to leverage Docker caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies with frozen lockfile for production
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Debug: List contents before build
RUN ls -la

# Build the Next.js application with verbose logging
RUN pnpm run build --verbose

# Debug: List contents after build
RUN ls -la
RUN ls -la .next || echo ".next directory not found"

# Expose the Next.js port
EXPOSE 3000

# Start the production server
CMD ["sh", "-c", "ls -la && pnpm run build && pnpm start"]