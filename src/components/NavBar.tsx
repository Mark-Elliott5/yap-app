'use client';
import { Archivo_Black } from 'next/font/google';

import SettingsDropDown from '@/src/components/SettingsDropDown';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import UserHovercard from '@/src/components/UserHovercard';
import { cn } from '@/src/lib/utils';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
});

function NavBar({
  username,
  displayName,
  image,
  // OAuth,
  joinDate,
}: {
  username: string;
  displayName: string | null;
  image: string | null;
  // OAuth: boolean;
  joinDate: Date;
}) {
  return (
    <nav className='sticky flex items-center justify-between px-4 py-2'>
      <a
        href='/home'
        className={cn('text-3xl text-yap-red-500', archivoBlack.className)}
      >
        yap
      </a>
      <div className='flex gap-3'>
        <UserHovercard
          username={username}
          joinDate={joinDate}
          displayName={displayName}
          image={image}
          // self={true}
        >
          <div className='flex items-center gap-3 text-white'>
            <div className='flex flex-col sm:flex-row sm:gap-2'>
              <span
                className='max-w-36 truncate text-sm text-black sm:max-w-44 sm:text-base dark:text-white'
                title={username}
              >
                @{username}
              </span>
              {displayName && (
                <span
                  className='max-w-36 truncate text-sm font-light text-zinc-500 sm:max-w-44 sm:text-base dark:text-zinc-400'
                  title={displayName}
                >
                  {displayName}
                </span>
              )}
            </div>
            <Avatar>
              <AvatarImage src={image ?? ''} height={'1.5rem'} />
              <AvatarFallback>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`${displayName ?? username}'s avatar`}
                  src={'/defaultavatar.svg'}
                />
              </AvatarFallback>
            </Avatar>
          </div>
        </UserHovercard>
        <SettingsDropDown />
      </div>
    </nav>
  );
}

export default NavBar;
