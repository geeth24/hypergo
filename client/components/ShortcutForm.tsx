'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  shortcode: z.string().min(1, {
    message: "Shortcode must be at least 1 character.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL.",
  }),
})

export default function ShortcutForm() {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shortcode: "",
      url: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('https://go.geethg.com/api/shortcuts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      if (response.ok) {
        toast({
          title: "Shortcut created",
          description: "Your new shortcut has been created successfully.",
        })
        form.reset()
      } else {
        toast({
          title: "Error",
          description: "Failed to create shortcut. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="shortcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shortcode</FormLabel>
              <FormControl>
                <Input placeholder="my-shortcode" {...field} />
              </FormControl>
              <FormDescription>
                This is the short code that will be used in the URL.
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
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormDescription>
                This is the full URL that the shortcode will redirect to.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Shortcut</Button>
      </form>
    </Form>
  )
}

