# HyperGo URL Shortener

A self‑hosted URL shortener with a modern UI, PostgreSQL persistence, and optional Redis caching.

## Highlights

- Create and manage short URLs with go-style shortcuts
- PostgreSQL for durable storage, optional Redis cache
- Redesigned frontend using shadcn/ui components
- Toast notifications via shadcn Sonner
- Docker Compose for easy deployment

## Architecture

- Server: Go API with redirect handler and JSON endpoints
- Database: PostgreSQL (schema auto-initialized)
- Cache: Redis (optional, used when available)
- Frontend: Next.js + shadcn/ui

## Quick Start (Docker)

1) Clone and start:
```
git clone https://github.com/geeth24/hypergo.git
cd hypergo
docker compose up -d
```

2) Access:
- Frontend: `http://localhost:3002`
- API/Redirect server: `http://localhost`

Note: The client uses `NEXT_PUBLIC_API_URL` (set in `docker-compose.yml`) to reach the API. Update it to match your host (e.g., `http://localhost` or your LAN IP).

To stop:
```
docker compose down
```

## Local Development

Server:
```
cd server
go run ./cmd/hypergo/main.go
```

Client:
```
cd client
pnpm install
pnpm dev
```

Ensure the client has `NEXT_PUBLIC_API_URL` pointing at your server (e.g., add to `.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8079
```

## API

- `GET /api/health` – health check
- `GET /api/shortcuts` – list all shortcuts
- `POST /api/shortcuts` – create a shortcut
  - body: `{ "shortcode": string, "url": string }`
- `GET /api/shortcuts/:shortcode` – get details for a shortcut
- `PUT /api/shortcuts/:shortcode` – update destination URL
  - body: `{ "url": string }`
- `POST /api/shortcuts/bulk` – get details for multiple shortcodes
  - body: `{ "shortcodes": string[] }`
- Redirects: `GET /:shortcode` – redirects and increments click count

## UI

- Built with shadcn/ui components (installed via `pnpm dlx shadcn add ...`)
- Notifications use shadcn Sonner; the `Toaster` is mounted in `app/layout.tsx`

## Environment Variables

Server:
- `PORT` (default: `8079`)
- `DATABASE_URL` (default: `postgres://postgres:postgres@localhost:5432/hypergo`)
- `REDIS_URL` (default: `localhost:6379`)
- `REDIS_PASSWORD` (default: empty)
- `REDIS_DB` (default: `0`)

Client:
- `NEXT_PUBLIC_API_URL` – base URL for the API (e.g., `http://localhost:8079` or your server IP)

## Troubleshooting

- 500 on API calls: check server logs and health
  - Health: `curl http://<api-host>/api/health`
  - Logs (Docker): `docker logs -f hypergo-server`

## License

MIT
