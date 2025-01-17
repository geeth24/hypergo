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

# Build the Next.js application
RUN pnpm run build

# Expose the Next.js port
EXPOSE 3000

# Start the production server
CMD ["pnpm", "start"]