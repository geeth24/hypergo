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

# Copy the binary from the builder stage
COPY --from=builder /app/app .

# Copy the shortcuts.json file
COPY shortcuts.json .

# Create a directory for public files
RUN mkdir -p public

# Create a directory for logs
RUN mkdir -p logs

EXPOSE 8079

# Run the application
CMD ["./app"]