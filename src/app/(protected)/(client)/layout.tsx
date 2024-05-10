import { Archivo_Black } from 'next/font/google';
import {
  TbHome,
  TbNews,
  TbNotification,
  TbSpeakerphone,
  TbUsers,
  TbUserSquare,
} from 'react-icons/tb';

import SettingsDropDown from '@/src/components/yap/SettingsDropDown';
import { cn } from '@/src/lib/utils';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
});

import { Suspense } from 'react';
import Link from 'next/link';

import { Separator } from '@/src/components/ui/separator';
import { Skeleton } from '@/src/components/ui/skeleton';
import NavBarUserInfo from '@/src/components/yap/NavBarUserInfo';
import { getSession } from '@/src/lib/database/getUser';

async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) return null;

  const { username } = session.user;
  return (
    <>
      <div className='sticky top-0 backdrop-blur-sm'>
        <nav className='flex items-center justify-between px-4 py-2'>
          <Link
            href='/home'
            className={cn(
              'text-3xl text-yap-red-500 transition-all hover:drop-shadow-heart',
              archivoBlack.className
            )}
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
      <div className='flex h-full gap-2 p-2 md:grid md:grid-cols-597 md:gap-[unset]'>
        <div
          id='left'
          className='sticky left-0 top-0 col-span-1 col-start-1 flex h-min flex-col items-center justify-center gap-16 py-16 font-medium'
        >
          <Link
            className='flex items-center gap-2 px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 hover:drop-shadow-lg dark:text-zinc-100'
            href='/home'
          >
            <TbHome />
            <span className='hidden sm:inline-block'>Home</span>
          </Link>
          <Link
            className='flex items-center gap-2 px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 hover:drop-shadow-lg dark:text-zinc-100'
            href='/notifications'
          >
            <TbNotification />
            <span className='hidden sm:inline-block'>Notifications</span>
          </Link>
          <Link
            className='flex items-center gap-2 px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 hover:drop-shadow-lg dark:text-zinc-100'
            href='/news'
          >
            <TbNews />
            <span className='hidden sm:inline-block'>News</span>
          </Link>
          <Link
            href='/users'
            className='flex items-center gap-2 px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 hover:drop-shadow-lg dark:text-zinc-100'
          >
            <TbUsers />
            <span className='hidden sm:inline-block'>Users</span>
          </Link>
          <Link
            className='flex items-center gap-2 px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 hover:drop-shadow-lg dark:text-zinc-100'
            href={`/user/${username}`}
          >
            <TbUserSquare />
            <span className='hidden sm:inline-block'>Profile</span>
          </Link>
          <Link
            href='/post'
            className='flex items-center gap-2 px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 hover:drop-shadow-lg dark:text-zinc-100'
          >
            <TbSpeakerphone />
            <span className='hidden sm:inline-block'>Post</span>
          </Link>
        </div>
        <div className='z-10 flex-grow pb-4 md:col-span-1 md:col-start-2'>
          {children}
        </div>
        <div
          id='right'
          className='hidden md:col-span-1 md:col-start-3 md:block'
        ></div>
      </div>
    </>
  );
}

export default ClientLayout;
