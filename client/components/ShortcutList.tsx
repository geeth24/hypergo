'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {  ExternalLink, BarChart2 } from 'lucide-react';

interface Shortcut {
  url: string;
  createdAt: string;
  clicks: number;
}

export default function ShortcutList() {
  const [shortcuts, setShortcuts] = useState<Record<string, Shortcut> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shortcuts`)
      .then((response) => response.json())
      .then((data) => setShortcuts(data));
  }, []);

  const filteredShortcuts = shortcuts
    ? Object.entries(shortcuts).filter(
        ([shortcode, shortcut]) =>
          shortcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shortcut.url.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
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
      {!shortcuts ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredShortcuts.map(([shortcode, shortcut]) => (
            <Card key={shortcode} className="overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{shortcode}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {new Date(shortcut.createdAt).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 truncate text-sm text-muted-foreground">{shortcut.url}</p>
                <p className="text-sm font-medium">Clicks: {shortcut.clicks}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
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
        <p className="text-center text-muted-foreground">No shortcuts found.</p>
      )}
    </div>
  );
}
