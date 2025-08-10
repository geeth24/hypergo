import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Lora } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import HyperGoLogo from '@/components/HyperGoLogo';

const inter = Inter({ subsets: ['latin'], weight: ['300','400','500','600','700','800'] });
const lora = Lora({ subsets: ['latin'], weight: ['400','500','600','700'] });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400','500','600','700'] });

export const metadata: Metadata = {
  title: 'HyperGo — Self‑hosted go links',
  description: 'Create, manage, and share short go links on your own network with a beautiful UI.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  openGraph: {
    title: 'HyperGo — Self‑hosted go links',
    description: 'Create, manage, and share short go links on your own network.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL || '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HyperGo — Self‑hosted go links',
    description: 'Create, manage, and share short go links on your own network.',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${lora.className} ${jetBrainsMono.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="container mx-auto px-4 py-8">
            <header className="mb-12 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-primary">
                <HyperGoLogo className="h-7 w-7" />
                <span className="text-2xl font-extrabold tracking-tight">HyperGo</span>
              </Link>
              <nav className="hidden items-center gap-6 text-sm md:flex">
                <Link href="/features" className="hover:underline">Features</Link>
                <Link href="/pricing" className="hover:underline">Pricing</Link>
                <Link href="/faq" className="hover:underline">FAQ</Link>
                <Link href="/docs" className="hover:underline">Docs</Link>
              </nav>
              <div className="flex items-center gap-3">
                <Link
                  href={process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/geeth24/hypergo'}
                  target="_blank"
                  className="text-sm underline"
                >
                  GitHub
                </Link>
                <Button asChild>
                  <Link href={process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/geeth24/hypergo'}>
                    Get the code
                  </Link>
                </Button>
                <ModeToggle />
              </div>
            </header>

            <main>{children}</main>

            <footer className="mt-16 border-t pt-8 text-sm text-muted-foreground">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <p>
                  © {new Date().getFullYear()} HyperGo — app Built by{' '}
                  <Link href="https://geethgunna.com" target="_blank" rel="noopener noreferrer" className="underline">
                    Geeth
                  </Link>
                </p>
                <div className="flex items-center gap-6">
                  <Link href="/features" className="hover:underline">Features</Link>
                  <Link href="/pricing" className="hover:underline">Pricing</Link>
                  <Link href="/docs" className="hover:underline">Docs</Link>
                  <Link
                    href={process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/geeth24/hypergo'}
                    target="_blank"
                    className="hover:underline"
                  >
                    GitHub
                  </Link>
                </div>
              </div>
            </footer>
          </div>
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
