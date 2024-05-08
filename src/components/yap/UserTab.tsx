import Link from 'next/link';
import { TbCalendarMonth } from 'react-icons/tb';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { User } from '@prisma/client';

/* in practice, username will never actually be null, because users 
  will be redirected to an onboarding page if it is, and will not be able to 
  use server actions either (can't post, etc.) */

function UserTab({
  username,
  displayName,
  image,
  joinDate,
}: Pick<User, 'displayName' | 'username' | 'image' | 'joinDate'>) {
  return (
    <Link
      href={`/user/${username}`}
      className={`flex flex-col gap-2 rounded-lg border-t-1 border-zinc-100 bg-white px-5 py-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900`}
    >
      <div className='top-0 flex items-center justify-between gap-2'>
        <div className='flex items-center gap-4'>
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
          {displayName && (
            <span className='truncate text-zinc-950 dark:text-zinc-100'>
              {displayName}
            </span>
          )}
          {username && (
            <span
              className={
                displayName
                  ? 'truncate text-zinc-600'
                  : 'truncate text-zinc-950 dark:text-zinc-100'
              }
            >
              @{username}
            </span>
          )}
        </div>
        <span className='flex items-center gap-1 text-black dark:text-white'>
          <TbCalendarMonth className='inline-block h-4 w-4' />{' '}
          <span className='text-xs'>
            Joined {new Date(joinDate).toLocaleDateString()}
          </span>
        </span>
      </div>
    </Link>
  );
}

export default UserTab;
