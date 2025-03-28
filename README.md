# HyperGo URL Shortener

A simple URL shortener service with PostgreSQL database and Redis caching.

## Features

- Create and manage short URLs
- PostgreSQL database for permanent storage of shortcuts
- Redis caching for high-performance caching
- Dockerized for easy deployment
- Web interface included

## Architecture

- **Server**: Go application serving the API and frontend
- **Database**: PostgreSQL for permanent storage of shortcuts
- **Cache**: Redis for high-performance caching
- **Frontend**: React application for managing shortcuts

## Installation and Setup

### Prerequisites

- Docker and Docker Compose

### Quick Start

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/hypergo.git
   cd hypergo
   ```

2. Start all services with Docker Compose:
   ```
   docker compose up -d
   ```

   This will:
   - Start PostgreSQL database with automatic schema initialization
   - Start Redis cache
   - Build and start the Go server
   - Build and start the frontend
   
3. Access the application at `http://localhost`

To stop services:
```
docker compose down
```

## Data Migration from JSON

If you're upgrading from the JSON-based version, you can migrate your data:

1. Edit `docker-compose.yml` and set `IMPORT_FROM_JSON=true` in the hypergo-server environment
2. Make sure the `shortcuts.json` file is available in the server directory
3. Restart the services with `docker compose up -d`

After importing, you should set `IMPORT_FROM_JSON=false` to prevent reimporting on every restart.

## Development

### Server

To run the server in development mode:

```
cd server
go run ./cmd/hypergo/main.go
```

### Client

To run the client in development mode:

```
cd client
pnpm install
pnpm dev
```

## Environment Variables

### Server

- `PORT`: Port for the server to listen on (default: 8079)
- `DATABASE_URL`: PostgreSQL connection URL (default: postgres://postgres:postgres@localhost:5432/hypergo)
- `REDIS_URL`: Redis connection URL (default: localhost:6379)
- `REDIS_PASSWORD`: Redis password (default: empty)
- `REDIS_DB`: Redis database number (default: 0)
- `IMPORT_FROM_JSON`: Whether to import shortcuts from JSON (default: false)
- `SHORTCUTS_FILE`: Path to JSON file with shortcuts (default: shortcuts.json)

## License

MIT
