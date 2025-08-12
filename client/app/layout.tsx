import HyperGoLogo from '@/components/HyperGoLogo';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter, JetBrains_Mono, Lora } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import Link from 'next/link';
import { ModeToggle } from '@/components/ui/mode-toggle';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: 'HyperGo',
  description: 'Self Hosted Local Network go links',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${lora.className} ${jetBrainsMono.className}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="container mx-auto px-4 py-6 font-sans">
            <header className="mb-8 flex items-center justify-between">
              <Link href="/" className="text-primary flex items-center gap-3">
                <HyperGoLogo className="h-9 w-9" />
                <span className="text-2xl font-extrabold tracking-tight">HyperGo</span>
              </Link>
              <div className="flex items-center gap-4">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link href="#create" legacyBehavior passHref>
                        <NavigationMenuLink className="px-3 py-2 text-sm font-medium">
                          Create
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/shortcuts" legacyBehavior passHref>
                        <NavigationMenuLink className="px-3 py-2 text-sm font-medium">
                          Shortcuts
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                <ModeToggle />
              </div>
            </header>
            <main>{children}</main>
            <footer className="text-muted-foreground mt-12 flex items-center justify-between border-t pt-6 text-sm">
              <p>Self‑hosted go links for your network</p>
              <p className="tracking-wide">© {new Date().getFullYear()} HyperGo</p>
            </footer>
            <Toaster richColors closeButton />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
