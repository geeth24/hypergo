'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Shortcut {
  url: string
  createdAt: string
  clicks: number
}

export default function ShortcutList() {
  const [shortcuts, setShortcuts] = useState<Record<string, Shortcut> | null>(null)

  useEffect(() => {
    fetch('https://go.geethg.com/api/shortcuts')
      .then(response => response.json())
      .then(data => setShortcuts(data))
  }, [])

  if (!shortcuts) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[200px]" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-[120px]" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(shortcuts).map(([shortcode, shortcut]) => (
        <Card key={shortcode}>
          <CardHeader>
            <CardTitle>{shortcode}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{shortcut.url}</p>
            <p className="text-sm text-muted-foreground">Clicks: {shortcut.clicks}</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href={`/stats/${shortcode}`}>View Stats</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

