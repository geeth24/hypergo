'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  useEffect(() => {
    const t = setTimeout(() => {
      window.location.href = '/';
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mx-auto max-w-xl py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground mt-2">You will be redirected to the homepage in 3 seconds.</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Go home now</Link>
        </Button>
      </div>
    </div>
  );
}


