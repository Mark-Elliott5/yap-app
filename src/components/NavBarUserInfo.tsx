import { auth } from '@/src/app/api/auth/[...nextauth]/auth';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import UserHovercard from '@/src/components/UserHovercard';

async function NavBarUserInfo() {
  const session = await auth();
  // Will not evaluate to undefined, because they would have been redirected if so.
  const { username, displayName, image, joinDate } = session!.user as {
    username: string;
    displayName: string | null;
    image: string | null;
    // OAuth: boolean;
    joinDate: Date;
  };

  return (
    <UserHovercard
      username={username}
      joinDate={joinDate}
      displayName={displayName}
      image={image}
      // self={true}
    >
      <div className='flex items-center gap-3 text-zinc-100'>
        <div className='flex flex-col sm:flex-row sm:gap-2'>
          <span
            className='max-w-36 truncate text-sm text-zinc-950 sm:max-w-44 sm:text-base dark:text-zinc-100'
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
  );
}

export default NavBarUserInfo;
