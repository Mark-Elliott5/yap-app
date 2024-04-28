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
      <body className={cn('h-dvh bg-zinc-900', inter.className)}>
        {children}
      </body>
    </html>
  );
}
