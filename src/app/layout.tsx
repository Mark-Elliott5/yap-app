import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import { cn } from '@/src/lib/utils';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `yap | Yap to your heart's content`,
  description: 'yap Social Media App',
  icons: 'icon.svg',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className='min-h-dvh bg-gradient-to-b from-white from-20% to-zinc-50 bg-fixed dark:from-zinc-900 dark:from-0% dark:to-zinc-950'
      suppressHydrationWarning
    >
      <head />
      <body
        className={cn(
          'min-h-dvh bg-gradient-to-b from-white from-20% to-zinc-50 bg-fixed dark:from-zinc-900 dark:from-0% dark:to-zinc-950',
          inter.className
        )}
      >
        <ThemeProvider defaultTheme='dark'>{children}</ThemeProvider>
      </body>
    </html>
  );
}
