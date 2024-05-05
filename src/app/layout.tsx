import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { cn } from '@/src/lib/utils';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `yap | Yap to your heart's content`,
  description: 'yap Social Media App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={cn(
          'min-h-dvh bg-gradient-to-b from-white from-20% to-zinc-50 dark:from-zinc-900 dark:from-0% dark:to-zinc-950',
          inter.className
        )}
      >
        {children}
      </body>
    </html>
  );
}
