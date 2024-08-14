import Link from 'next/link';
import { TbCalendarMonth } from 'react-icons/tb';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/src/components/ui/hover-card';
import ClientLocaleDate from '@/src/components/yap/post/ClientLocaleDate';

async function UserHovercard({
  children,
  username,
  image,
  displayName,
  joinDate,
}: {
  children: React.ReactNode;
  username: string;
  image: string | null;
  displayName: string | null;
  joinDate: string | Date;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger href={`/user/${username}`}>{children}</HoverCardTrigger>
      <HoverCardContent className='w-60 sm:w-72'>
        <Link
          prefetch={false}
          href={`/user/${username}`}
          className={'flex items-center justify-start gap-2'}
        >
          <div>
            <Avatar className='h-20 w-20'>
              <AvatarImage src={image ?? ''} />
              <AvatarFallback>
                <img
                  alt={`${displayName ?? username}'s avatar`}
                  src={'/images/defaultavatar.svg'}
                />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className='flex flex-col gap-2'>
            {displayName && (
              <span
                className='text-sm text-zinc-950 sm:text-base dark:text-zinc-100'
                title={displayName}
              >
                {displayName}
              </span>
            )}
            <span
              className={`text-sm font-light ${displayName ? 'text-zinc-600' : 'text-zinc-950 dark:text-zinc-100'} sm:text-base`}
              title={username}
            >
              @{username}
            </span>
            <div className='flex items-center gap-1'>
              <TbCalendarMonth className='inline-block h-4 w-4 text-black dark:text-white' />{' '}
              <span className='text-xs'>
                Joined <ClientLocaleDate date={joinDate} />
              </span>
            </div>
          </div>
        </Link>
      </HoverCardContent>
    </HoverCard>
  );
}

export default UserHovercard;
