'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Shortcut {
  url: string
  createdAt: string
  clicks: number
}

export default function ShortcutStats({ params }: { params: { shortcode: string } }) {
  const [shortcut, setShortcut] = useState<Shortcut | null>(null)

  useEffect(() => {
    fetch(`http://localhost:8079/api/shortcuts/${params.shortcode}/stats`)
      .then(response => response.json())
      .then(data => setShortcut(data))
  }, [params.shortcode])

  if (!shortcut) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[250px]" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-[120px]" />
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stats for {params.shortcode}</CardTitle>
        <CardDescription>{shortcut.url}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p><strong>Created At:</strong> {new Date(shortcut.createdAt).toLocaleString()}</p>
        <p><strong>Clicks:</strong> {shortcut.clicks}</p>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

