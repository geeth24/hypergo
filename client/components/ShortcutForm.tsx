'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Loader2, LinkIcon } from 'lucide-react';

const formSchema = z.object({
  shortcode: z
    .string()
    .min(1, {
      message: 'Shortcode must be at least 1 character.',
    })
    .max(50, {
      message: 'Shortcode must be no more than 50 characters.',
    })
    .regex(/^[a-zA-Z0-9-_]+$/, {
      message: 'Shortcode can only contain letters, numbers, hyphens, and underscores.',
    }),
  url: z.string().url({
    message: 'Please enter a valid URL.',
  }),
});

export default function ShortcutForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdShortcut, setCreatedShortcut] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shortcode: '',
      url: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shortcuts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const data = await response.json();
        setCreatedShortcut(`${process.env.NEXT_PUBLIC_API_URL}/${data.shortcode}`);
        toast({
          title: 'Shortcut created',
          description: 'Your new shortcut has been created successfully.',
        });
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create shortcut. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle>Create New Shortcut</CardTitle>
        <CardDescription>Enter a shortcode and URL to create a new shortcut.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="shortcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shortcode</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="mr-2 text-sm text-muted-foreground">go/</span>
                      <Input placeholder="my-shortcode" {...field} className="flex-1" />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Use letters, numbers, hyphens, and underscores only.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    The full URL that the shortcode will redirect to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Shortcut'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {createdShortcut && (
        <CardFooter>
          <div className="w-full rounded-md bg-muted p-4">
            <p className="mb-2 text-sm font-medium">Your new shortcut:</p>
            <div className="flex items-center justify-between">
              <a
                href={createdShortcut}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {createdShortcut}
              </a>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(createdShortcut);
                  toast({
                    title: 'Copied',
                    description: 'Shortcut URL copied to clipboard',
                  });
                }}
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
