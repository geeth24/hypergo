import HyperGoLogo from '@/components/HyperGoLogo';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter, JetBrains_Mono, Lora } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="container mx-auto px-4 py-8 font-sans">
            <header className="mb-8 flex items-center space-x-4 text-primary">
              <HyperGoLogo className="h-10 w-10" />
              <h1 className="text-4xl font-bold">HyperGo</h1>
            </header>
            <main>{children}</main>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
