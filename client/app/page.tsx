import ShortcutForm from '@/components/ShortcutForm';
import ShortcutList from '@/components/ShortcutList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="bg-card text-card-foreground rounded-xl border p-8 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              Create lightning‑fast go links on your network
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Short, memorable shortcuts for long URLs. Manage and track them with ease.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">Private</Badge>
              <Badge variant="secondary">Fast</Badge>
              <Badge variant="secondary">Self‑hosted</Badge>
            </div>
          </div>
        </div>
      </section>

      <section id="create" className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create a HyperGO</CardTitle>
          </CardHeader>
          <CardContent>
            <ShortcutForm />
          </CardContent>
        </Card>

        <div id="shortcuts" className="flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-semibold">Recent Shortcuts</h3>
            <p className="text-muted-foreground text-sm">Your latest links at a glance</p>
          </div>
          <Separator />
          <ShortcutList compact limit={6} />
        </div>
      </section>
    </div>
  );
}
