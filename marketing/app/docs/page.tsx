import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Documentation</h1>
      <p className="text-muted-foreground mt-2">How to set up and run HyperGo locally or with Docker.</p>

      <section className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Start (Docker)</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-inside list-decimal space-y-2 text-sm">
              <li>
                Clone the repo:
                <pre className="mt-2 rounded-md bg-muted p-3"><code>git clone https://github.com/geeth24/hypergo.git
cd hypergo</code></pre>
              </li>
              <li>
                Start services:
                <pre className="mt-2 rounded-md bg-muted p-3"><code>docker compose up -d</code></pre>
              </li>
              <li>
                Access:
                <ul className="ml-5 list-disc">
                  <li>Frontend: <code>http://localhost:3002</code></li>
                  <li>API/Redirect: <code>http://localhost</code></li>
                </ul>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Local Development</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium">Server (Go)</p>
              <pre className="mt-2 rounded-md bg-muted p-3"><code>cd server
go run ./cmd/hypergo/main.go</code></pre>
            </div>
            <div>
              <p className="font-medium">Client (Next.js)</p>
              <pre className="mt-2 rounded-md bg-muted p-3"><code>cd client
pnpm install
pnpm dev</code></pre>
              <p className="mt-2">Set <code>NEXT_PUBLIC_API_URL</code> to your API, e.g. <code>http://localhost:8079</code>.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="font-medium">Server</p>
                <ul className="ml-5 mt-2 list-disc">
                  <li><code>PORT</code> (default: <code>8079</code>)</li>
                  <li><code>DATABASE_URL</code> (default: <code>postgres://postgres:postgres@localhost:5432/hypergo</code>)</li>
                  <li><code>REDIS_URL</code> (default: <code>localhost:6379</code>)</li>
                  <li><code>REDIS_PASSWORD</code> (default: empty)</li>
                  <li><code>REDIS_DB</code> (default: <code>0</code>)</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Client</p>
                <ul className="ml-5 mt-2 list-disc">
                  <li><code>NEXT_PUBLIC_API_URL</code> – API base URL</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Overview</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="ml-5 list-disc">
              <li><code>GET /api/health</code> — Health check</li>
              <li><code>GET /api/shortcuts</code> — List all shortcuts</li>
              <li><code>POST /api/shortcuts</code> — Create a shortcut</li>
              <li><code>GET /api/shortcuts/:shortcode</code> — Shortcut details</li>
              <li><code>PUT /api/shortcuts/:shortcode</code> — Update URL</li>
              <li><code>POST /api/shortcuts/bulk</code> — Details in bulk</li>
              <li><code>GET /:shortcode</code> — Redirects and increments clicks</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deploy</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>Use Docker Compose or your favorite platform. Ensure the client env <code>NEXT_PUBLIC_API_URL</code> points to your API host (e.g., LAN IP).</p>
            <p className="mt-2">Repository: <Link className="underline" href={process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/geeth24/hypergo'} target="_blank">geeth24/hypergo</Link></p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optional: Add go host for easy access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>Map <code>go</code> to your server IP so you can use URLs like <code>http://go/your-shortcode</code>.</p>
            <div>
              <p className="font-medium">macOS/Linux</p>
              <p className="mt-1">From the repo root, run (may prompt for sudo):</p>
              <pre className="mt-2 rounded-md bg-muted p-3"><code>./add-go-host.sh</code></pre>
            </div>
            <div>
              <p className="font-medium">Windows</p>
              <p className="mt-1">Open Command Prompt as Administrator and run:</p>
              <pre className="mt-2 rounded-md bg-muted p-3"><code>add-go-host.bat</code></pre>
            </div>
            <p className="text-muted-foreground">By default these scripts add <code>192.168.1.71 go</code>. Update the IP in the scripts to match your server if different.</p>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-8" />
      <p className="text-sm text-muted-foreground">For more details, see the README in the repository.</p>
    </div>
  );
}


