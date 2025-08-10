'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { ExternalLink, BarChart2 } from 'lucide-react';

interface Shortcut {
  url: string;
  createdAt: string;
  clicks: number;
}

type ShortcutListProps = {
  compact?: boolean;
  limit?: number;
};

export default function ShortcutList({ compact = false, limit }: ShortcutListProps) {
  const [shortcuts, setShortcuts] = useState<Record<string, Shortcut> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const hasRefreshedAccurate = useRef(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shortcuts`)
      .then((response) => response.json())
      .then((data) => setShortcuts(data));
  }, []);

  useEffect(() => {
    if (!shortcuts || hasRefreshedAccurate.current) return;
    hasRefreshedAccurate.current = true;

    const run = async () => {
      const allShortcodes = Object.keys(shortcuts);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shortcuts/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shortcodes: allShortcodes }),
        });
        if (!res.ok) return;
        const details: Record<string, Shortcut> = await res.json();
        if (Object.keys(details).length === 0) return;
        setShortcuts((prev) => {
          if (!prev) return prev;
          const updated: Record<string, Shortcut> = { ...prev };
          for (const code of Object.keys(details)) {
            updated[code] = { ...prev[code], ...details[code] };
          }
          return updated;
        });
      } catch {
        // ignore bulk failures, list still renders
      }
    };

    run();
  }, [shortcuts]);

  let filteredShortcuts = shortcuts
    ? Object.entries(shortcuts).filter(
        ([shortcode, shortcut]) =>
          shortcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shortcut.url.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  if (typeof limit === 'number' && limit > 0) {
    filteredShortcuts = filteredShortcuts.slice(0, limit);
  }

  return (
    <div className={compact ? '' : 'container mx-auto px-4 py-8'}>
      {!compact && (
        <>
          <h1 className="mb-6 text-3xl font-bold">Your Shortcuts</h1>
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Search shortcuts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </>
      )}
      {!shortcuts ? (
        <div
          className={
            compact ? 'grid gap-4 sm:grid-cols-2' : 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
          }
        >
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-4 w-[100px]" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredShortcuts.length > 0 ? (
        <div
          className={
            compact ? 'grid gap-4 sm:grid-cols-2' : 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
          }
        >
          {filteredShortcuts.map(([shortcode, shortcut]) => (
            <Card
              key={shortcode}
              className={
                compact ? 'overflow-hidden' : 'overflow-hidden transition-shadow hover:shadow-lg'
              }
            >
              <CardHeader className={compact ? 'p-4' : undefined}>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{shortcode}</span>
                  <span className="text-muted-foreground text-sm font-normal">
                    {new Date(shortcut.createdAt).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className={compact ? 'p-4 pt-0' : undefined}>
                <p className="text-muted-foreground mb-2 truncate text-sm">{shortcut.url}</p>
                <p className="text-sm font-medium">Clicks: {shortcut.clicks}</p>
              </CardContent>
              <CardFooter
                className={compact ? 'flex justify-between p-4 pt-0' : 'flex justify-between'}
              >
                <Button variant="outline" size="sm" asChild>
                  <Link href={shortcut.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/stats/${shortcode}`}>
                    <BarChart2 className="mr-2 h-4 w-4" />
                    View Stats
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center">No shortcuts found.</p>
      )}
    </div>
  );
}
