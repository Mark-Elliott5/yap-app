import { Archivo_Black } from 'next/font/google';
import {
  TbHome,
  TbNews,
  TbNotification,
  TbSpeakerphone,
  TbUserSquare,
} from 'react-icons/tb';

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
// import CreatePostButton from '@/src/components/yap/CreatePostButton';

async function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=''>
      <div className='sticky top-0 backdrop-blur-sm'>
        <nav className='flex items-center justify-between px-4 py-2'>
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
      </div>
      <div className='grid h-full grid-cols-597'>
        <div
          id='left'
          className='sticky top-14 col-span-1 col-start-1 flex h-min flex-col items-center justify-center gap-16 py-16 font-medium'
        >
          <Link
            className='flex items-center gap-2 px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 hover:drop-shadow-lg dark:text-zinc-100'
            href='/home'
          >
            <TbHome />
            Home
          </Link>
          <Link
            className='flex items-center gap-2 px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 hover:drop-shadow-lg dark:text-zinc-100'
            href='/notifications'
          >
            <TbNotification />
            Notifications
          </Link>
          <Link
            className='flex items-center gap-2 px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 hover:drop-shadow-lg dark:text-zinc-100'
            href='/news'
          >
            <TbNews />
            News
          </Link>
          <Link
            className='flex items-center gap-2 px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 hover:drop-shadow-lg dark:text-zinc-100'
            href='/profile'
          >
            <TbUserSquare />
            Profile
          </Link>
          <Link
            href='/post'
            className='flex items-center gap-2 px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 hover:drop-shadow-lg dark:text-zinc-100'
          >
            <TbSpeakerphone />
            Post
          </Link>
          {/* <CreatePostButton /> */}
        </div>
        <div className='z-10 col-span-1 col-start-2 flex min-h-dvh flex-col gap-4 pb-4'>
          {children}
        </div>
        <div id='right' className='col-span-1 col-start-3'></div>
      </div>
    </div>
  );
}

export default ClientLayout;
