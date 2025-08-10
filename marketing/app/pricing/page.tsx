import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">Open-source and free to self‑host.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Self‑host</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>Free and open‑source. MIT licensed.</p>
            <Button asChild>
              <Link href={process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/geeth24/hypergo'}>Get the code</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


