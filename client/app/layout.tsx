import HyperGoLogo from '@/components/HyperGoLogo';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Space_Grotesk } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  // Space Grotesk available weights are 300, 400, 500, 600, 700
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'HyperGo',
  description: 'Self Hosted Local Network go links',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceGrotesk.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="container mx-auto px-4 py-8">
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
