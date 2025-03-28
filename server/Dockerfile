FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy Go module files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the Go application
RUN CGO_ENABLED=0 GOOS=linux go build -o app ./cmd/hypergo

# Use a minimal alpine image for the final container
FROM alpine:latest

WORKDIR /app

# Install necessary tools for healthcheck
RUN apk add --no-cache wget ca-certificates

# Copy the binary from the builder stage
COPY --from=builder /app/app .

# Copy the shortcuts.json file (for potential migration)
COPY shortcuts.json .

# Copy the environment file if exists
COPY .env* ./

# Copy the public directory for static files
COPY --from=builder /app/public ./public

# Create a directory for logs
RUN mkdir -p logs

EXPOSE 8079

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8079/api/health || exit 1

# Run the application
CMD ["./app"]