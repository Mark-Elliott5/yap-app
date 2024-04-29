import { FaRegCalendarAlt } from 'react-icons/fa';

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
import { Separator } from '@/src/components/ui/separator';

export function UserHovercard({
  children,
  username,
  image,
  displayName,
  joinDate,
  self,
}: {
  children: React.ReactNode;
  username: string;
  image: string | null;
  displayName: string | null;
  joinDate: Date;
  self?: boolean;
}) {
  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className='w-80 sm:w-96'>
        <a href={`/${username}`}>
          <div
            className={
              self
                ? 'flex flex-col gap-2'
                : 'flex flex-col items-center justify-center gap-2'
            }
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
            <span
              className='text-sm text-black sm:text-base dark:text-white'
              title={username}
            >
              @{username}
            </span>
            {displayName && (
              <span
                className='text-sm font-light text-zinc-500 sm:text-base dark:text-zinc-400'
                title={displayName}
              >
                {displayName}
              </span>
            )}
            <div className='flex items-center gap-2'>
              <FaRegCalendarAlt className='h-4 w-4 opacity-70' />{' '}
              <span className='text-muted-foreground text-xs'>
                Joined {new Date(joinDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </a>
        {self && <Separator orientation='vertical' />}
      </HoverCardContent>
    </HoverCard>
  );
}

export default UserHovercard;
