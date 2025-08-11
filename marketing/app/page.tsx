import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">

      <Card className="p-10">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <Badge variant="secondary" className="mb-3">Self‑hosted</Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
              Short, memorable go links for your whole network
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl">
              HyperGo lets you create, manage and share shortcuts like go/docs or go/deploy.
              Host it yourself, keep your data.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href={process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/geeth24/hypergo'}>Get the code</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/features">See Features</Link>
              </Button>
            </div>
          </div>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-md border p-3">Create go/meet → https://meet.example.com</div>
              <div className="rounded-md border p-3">Share go/meet with your team</div>
              <div className="rounded-md border p-3">Track clicks in the dashboard</div>
            </CardContent>
          </Card>
        </div>
      </Card>

      <section id="features" className="mt-16 space-y-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Why HyperGo</h2>
          <p className="text-muted-foreground mt-1">Built for teams that value speed and simplicity</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[{
            title: 'Fast & local',
            desc: 'Low-latency redirects on your network',
          },{
            title: 'Own your data',
            desc: 'PostgreSQL with optional Redis cache',
          },{
            title: 'Beautiful UI',
            desc: 'Clean, accessible shadcn components',
          }].map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <CardTitle>{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {f.desc}
              </CardContent>
            </Card>
          ))}
        </div>
        <Separator />
      </section>

      <section className="mt-12" id="pricing">
        <Card>
          <CardHeader>
            <CardTitle>Ready to try HyperGo?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href={process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/geeth24/hypergo'}>Get the code</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/geeth24/hypergo'} target="_blank">Star on GitHub</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
      {/* Global footer is provided by layout */}
    </div>
  );
}
