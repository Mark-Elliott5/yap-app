import { TbCalendarMonth } from 'react-icons/tb';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import FollowButton from '@/src/components/yap/FollowButton';
import { getIsFollowing, getUserProfile } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function Profile({
  params,
  children,
}: Readonly<{
  params: { username: string };
  children: React.ReactNode;
}>) {
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) return null;

  const { user } = await getUserProfile(params.username);

  const isFollowing = await getIsFollowing(params.username, currentUsername);

  if (user) {
    return (
      <div className='flex min-h-full flex-col gap-4'>
        <div
          className='flex gap-6 rounded-lg bg-zinc-100 p-10 text-zinc-950 dark:bg-zinc-950
  dark:text-zinc-50'
        >
          <Avatar className='h-[200px] w-[200px] border-[2px] border-zinc-400 dark:border-zinc-800'>
            <AvatarImage src={user.image ?? ''} height={'1.5rem'} />
            <AvatarFallback>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`${user.displayName ?? user.username}'s avatar`}
                src={'/defaultavatar.svg'}
              />
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col gap-2'>
            {user.displayName && <p className='text-4xl'>{user.displayName}</p>}
            <p
              className={
                !user.displayName ? 'text-4xl' : 'text-xl text-zinc-400'
              }
            >
              @{user.username}
            </p>
            <div className='flex items-center gap-1'>
              <TbCalendarMonth className='inline-block h-4 w-4 text-black dark:text-white' />{' '}
              <span className='text-xs'>
                Joined {new Date(user.joinDate).toLocaleDateString()}
              </span>
            </div>
            {params.username !== currentUsername && (
              <FollowButton
                isFollowing={isFollowing}
                userToFollow={params.username}
              />
            )}
          </div>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className='flex min-h-full flex-col gap-4'>
      <div className='flex gap-6 rounded-lg bg-zinc-100 p-10  dark:bg-zinc-950'>
        <Avatar className='h-[200px] w-[200px] border-[2px] border-zinc-400 dark:border-zinc-800'>
          <AvatarImage src={''} height={'1.5rem'} />
          <AvatarFallback>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={`Avatar`} src={'/defaultavatar.svg'} />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className='text-4xl text-zinc-950 dark:text-zinc-100'>
            @{params.username}
          </p>
        </div>
      </div>
      <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
        {`This user does not exist.`}
      </p>
    </div>
  );
}

export default Profile;
