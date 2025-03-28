# HyperGo URL Shortener

A simple URL shortener service with PostgreSQL database and Redis caching.

## Features

- Create and manage short URLs
- PostgreSQL database for data persistence
- Redis caching for improved performance
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
- Make (optional)

### Quick Start

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/hypergo.git
   cd hypergo
   ```

2. Run the setup script:
   ```
   ./server/scripts/setup.sh
   ```
   
   This will:
   - Start PostgreSQL and Redis
   - Initialize the database schema
   - Optionally import shortcuts from JSON (if you choose)
   - Start the server and frontend

3. Access the application at `http://localhost`

### Manual Setup

1. Start the services:
   ```
   docker compose up -d
   ```

2. Run database migrations:
   ```
   docker compose exec db psql -U postgres -d hypergo -f /scripts/migration.sql
   ```

## Data Migration from JSON

If you're upgrading from the JSON-based version, you can migrate your data:

1. Set `IMPORT_FROM_JSON=true` in your environment
2. Make sure the `shortcuts.json` file is accessible to the server
3. Start the server, which will automatically import the shortcuts

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
