import { Archivo_Black } from 'next/font/google';
import {
  TbHome,
  // TbNews,
  TbSearch,
  TbSpeakerphone,
  TbUsers,
  TbUserSquare,
} from 'react-icons/tb';

import SettingsDropDown from '@/src/components/yap/nav/SettingsDropDown';
import { cn } from '@/src/lib/utils';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
});

import { Suspense } from 'react';
import Link from 'next/link';

import { Separator } from '@/src/components/ui/separator';
import { Skeleton } from '@/src/components/ui/skeleton';
import NavBarUserInfo from '@/src/components/yap/nav/NavBarUserInfo';
import Notifications from '@/src/components/yap/notifications/Notifications';

async function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className='sticky top-0 z-10 backdrop-blur-[8px] md:z-[9]'>
        <nav className='flex items-center justify-between px-4 py-2'>
          <Link
            prefetch={false}
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
        <Separator className='bg-gradient-to-r from-yap-red-500 to-rose-700 drop-shadow-heart' />
      </div>
      <div className='flex h-full flex-col-reverse p-0 md:grid md:grid-cols-593 md:gap-[unset] md:p-2 md:[flex-direction:unset] lg:grid-cols-595'>
        <div
          id='left'
          className='sticky bottom-0 z-10 col-span-1 col-start-1 flex justify-center md:top-0 md:z-[unset]'
        >
          <div className='sticky bottom-0 flex h-min min-w-full justify-evenly gap-2 border-t-1 border-zinc-300 bg-zinc-100 px-4 py-3 font-medium text-zinc-950 shadow-xl md:top-32 md:min-w-[unset] md:flex-col md:justify-center md:gap-8 md:rounded-lg md:border-x-[0.5px] md:bg-white md:px-5 md:py-5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100'>
            <Link
              prefetch={false}
              className='flex items-center gap-2 px-2 py-1 text-2xl hover:opacity-70 hover:drop-shadow-lg'
              href='/home'
            >
              <TbHome />
              <span className='hidden md:inline-block'>Home</span>
            </Link>
            <Notifications />
            {/* <Link
            className='flex items-center gap-2 px-2 py-1 text-2xl hover:opacity-70 hover:drop-shadow-lg'
            href='/news'
          >
            <TbNews />
            <span className='hidden md:inline-block'>News</span>
          </Link> */}
            <Link
              prefetch={false}
              href='/users'
              className='flex items-center gap-2 px-2 py-1 text-2xl hover:opacity-70 hover:drop-shadow-lg'
            >
              <TbUsers />
              <span className='hidden md:inline-block'>Users</span>
            </Link>
            <Link
              prefetch={false}
              className='flex items-center gap-2 px-2 py-1 text-2xl hover:opacity-70 hover:drop-shadow-lg'
              href={'/user/myself'}
            >
              <TbUserSquare />
              <span className='hidden md:inline-block'>Profile</span>
            </Link>
            <Link
              prefetch={false}
              href='/search'
              className='flex items-center gap-2 px-2 py-1 text-2xl hover:opacity-70 hover:drop-shadow-lg'
            >
              <TbSearch />
              <span className='hidden md:inline-block'>Search</span>
            </Link>
            <Link
              prefetch={false}
              href='/post'
              className='flex items-center gap-2 rounded-md bg-gradient-to-r from-yap-red-500 from-20% to-rose-500 px-4 py-2 text-2xl text-zinc-100 transition-all hover:scale-[1.05] hover:drop-shadow-heart active:scale-[0.95] dark:to-rose-700'
            >
              <TbSpeakerphone />
              <span className='hidden md:inline-block'>Yap</span>
            </Link>
          </div>
        </div>
        <div className='min-h-dvh flex-grow p-4 md:z-10 md:col-span-1 md:col-start-2 md:pb-4'>
          {children}
        </div>
      </div>
    </>
  );
}

export const dynamic = 'force-dynamic';

export default ClientLayout;
