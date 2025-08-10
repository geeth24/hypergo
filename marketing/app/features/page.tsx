import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FeaturesPage() {
  const features = [
    { title: 'Self‑hosted', desc: 'Run on your own infra, keep full control.' },
    { title: 'Fast redirects', desc: 'Low-latency, local network friendly.' },
    { title: 'PostgreSQL + Redis', desc: 'Durable storage with optional caching.' },
    { title: 'Beautiful UI', desc: 'Clean shadcn components with theme support.' },
  ];
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Features</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">Everything you need to run go links for your team.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <CardTitle>{f.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{f.desc}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


