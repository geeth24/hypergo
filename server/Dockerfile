FROM node:20-alpine

WORKDIR /app

# Install pnpm globally using npm
RUN npm install -g pnpm@latest

# Copy package files
COPY pnpm-lock.yaml package.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm run build

# Remove dev dependencies
RUN pnpm prune --prod

EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]