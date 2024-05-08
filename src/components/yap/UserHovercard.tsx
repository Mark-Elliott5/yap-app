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
  joinDate: Date;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger href={`/user/${username}`}>{children}</HoverCardTrigger>
      <HoverCardContent className='w-80 sm:w-96'>
        <Link
          href={`/user/${username}`}
          className={'flex flex-col items-center justify-center gap-2'}
        >
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
              Joined {new Date(joinDate).toLocaleDateString()}
            </span>
          </div>
        </Link>
      </HoverCardContent>
    </HoverCard>
  );
}

export default UserHovercard;
