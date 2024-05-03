import { Archivo_Black } from 'next/font/google';

import SettingsDropDown from '@/src/components/SettingsDropDown';
import { cn } from '@/src/lib/utils';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
});

import { Suspense } from 'react';
import Link from 'next/link';

import NavBarUserInfo from '@/src/components/NavBarUserInfo';
import { Separator } from '@/src/components/ui/separator';
import { Skeleton } from '@/src/components/ui/skeleton';
import CreatePostButton from '@/src/components/yap/CreatePostButton';

async function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='h-full'>
      <nav className='sticky flex items-center justify-between px-4 py-2'>
        <Link
          href='/home'
          className={cn('text-3xl text-yap-red-500', archivoBlack.className)}
        >
          yap
        </Link>
        <div className='flex items-center gap-3'>
          <Suspense
            fallback={
              <>
                <Skeleton className='h-4 w-[80px]' />
                <Skeleton className='h-4 w-[90px]' />
                <Skeleton className='h-10 w-10 rounded-full' />
              </>
            }
          >
            <NavBarUserInfo />
          </Suspense>
          <SettingsDropDown />
        </div>
      </nav>
      <Separator className='bg-gradient-to-r from-yap-red-500 to-rose-700' />
      <div className='grid h-full grid-cols-597'>
        <div
          id='left'
          className='col-span-1 col-start-1 flex flex-col items-center justify-center gap-16 py-16'
        >
          <Link
            className='px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 dark:text-zinc-100'
            href='/home'
          >
            Latest
          </Link>
          <Link
            className='px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 dark:text-zinc-100'
            href='/notifications'
          >
            Notifications
          </Link>
          <Link
            className='px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 dark:text-zinc-100'
            href='/favorites'
          >
            Favorites
          </Link>
          <Link
            className='px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 dark:text-zinc-100'
            href='/profile'
          >
            Profile
          </Link>
          <CreatePostButton />
        </div>
        <div
          id='middle latest-yaps profiles specific-yaps etc'
          className='col-span-1 col-start-2 border-1 border-zinc-700 bg-zinc-950'
        >
          {children}
        </div>
        <div id='right' className='col-span-1 col-start-3'></div>
      </div>
    </div>
  );
}

export default ClientLayout;
