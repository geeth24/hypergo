'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ExternalLink, Calendar, MousePointerClick } from 'lucide-react';
import { EditShortcutModal } from '@/components/EditShortcutModal';

interface Shortcut {
  url: string;
  createdAt: string;
  clicks: number;
}

export default function StatsPage() {
  const params = useParams();
  const shortcode = params.shortcode as string;
  const [shortcut, setShortcut] = useState<Shortcut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShortcut = async () => {
      try {
        const encodedShortcode = encodeURIComponent(shortcode);
        const response = await fetch(`https://go.geethg.com/api/shortcuts/${encodedShortcode}`);
        if (!response.ok) {
          throw new Error('Failed to fetch shortcut data');
        }
        const data = await response.json();
        setShortcut(data);
      } catch (err) {
        if (err instanceof Error) {
          setError('Failed to load shortcut data. Please try again later. ' + err.message);
        } else {
          setError('Failed to load shortcut data. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchShortcut();
  }, [shortcode]);

  const updateShortcut = async (newUrl: string) => {
    try {
      const encodedShortcode = encodeURIComponent(shortcode);
      const response = await fetch(`https://go.geethg.com/api/shortcuts/${encodedShortcode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newUrl }),
      });
      if (!response.ok) {
        throw new Error('Failed to update shortcut data');
      }
      const data = await response.json();
      setShortcut(data);
    } catch (err) {
      if (err instanceof Error) {
        setError('Failed to update shortcut data. Please try again later. ' + err.message);
      } else {
        setError('Failed to update shortcut data. Please try again later.');
      }
    }
  };

  if (isLoading) {
    return <StatsPageSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!shortcut) {
    return <ErrorMessage message="No data found for this shortcut." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
        <h1 className="text-3xl font-bold">Stats for {shortcode}</h1>
        <div className="mt-2 flex space-x-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shortcuts
            </Link>
          </Button>
          <EditShortcutModal
            shortcode={shortcode}
            currentUrl={shortcut.url}
            onSave={updateShortcut}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Destination URL"
          value={shortcut.url}
          icon={<ExternalLink className="h-4 w-4" />}
          isLink
        />
        <StatCard
          title="Created On"
          value={new Date(shortcut.createdAt).toLocaleDateString()}
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatCard
          title="Total Clicks"
          value={shortcut.clicks.toString()}
          icon={<MousePointerClick className="h-4 w-4" />}
        />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Shortcut Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Shortcode</dt>
              <dd className="mt-1 text-lg font-semibold">{shortcode}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Full Short URL</dt>
              <dd className="mt-1 text-lg font-semibold">
                <Link
                  href={`https://go.geethg.com/${shortcode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://go.geethg.com/{shortcode}
                </Link>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  isLink = false,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  isLink?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="overflow-hidden text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLink ? (
          <Link
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold text-primary hover:underline"
          >
            {value}
          </Link>
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

function StatsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-48" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <Skeleton className="mb-1 h-4 w-24" />
                <Skeleton className="h-7 w-48" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-red-50">
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-red-600">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
