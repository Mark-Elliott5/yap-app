import Link from 'next/link';
import {
  TbAccessPoint,
  TbCalendarMonth,
  TbMessage,
  TbUsers,
  TbUsersGroup,
} from 'react-icons/tb';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import ClientCompactNum from '@/src/components/yap/post/ClientCompactNum';
import FollowButton from '@/src/components/yap/profile/buttons/FollowButton';
import { getIsFollowing, getUserProfile } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function Profile({
  params,
  children,
}: Readonly<{
  params: { username: string };
  children: React.ReactNode;
}>) {
  const currentData = getCurrentUsername();
  const userData = getUserProfile(params.username);

  const [currentUsername, { user }] = await Promise.all([
    currentData,
    userData,
  ]);

  if (!currentUsername) return null;

  const isFollowing = await getIsFollowing(params.username, currentUsername);

  if (user) {
    return (
      <div className='flex min-h-dvh flex-col gap-4'>
        <div className='flex flex-col gap-2 rounded-lg border-1 border-zinc-200 bg-gradient-to-br from-white from-20% to-zinc-300 px-6 py-4 text-zinc-950 md:px-8 md:py-6 lg:px-10 lg:py-8 dark:border-zinc-800 dark:from-zinc-900 dark:from-0% dark:to-zinc-950 dark:text-zinc-50'>
          <div className='flex items-center justify-between'>
            <div className='flex flex-col gap-2'>
              {user.displayName && (
                <p className='max-w-[150px] truncate text-xl sm:max-w-[240px] sm:text-2xl md:max-w-[300px] md:text-3xl lg:max-w-[350px]'>
                  {user.displayName}
                </p>
              )}
              <p
                className={
                  !user.displayName
                    ? 'max-w-[150px] truncate text-xl sm:max-w-[240px] sm:text-2xl md:max-w-[300px] md:text-3xl lg:max-w-[350px]'
                    : 'text-lg text-zinc-400 sm:text-xl md:text-2xl'
                }
              >
                @{user.username}
              </p>
              <div className='flex items-center gap-1'>
                <TbCalendarMonth size={'1.25rem'} className='inline-block' />{' '}
                <span className='text-sm'>
                  Joined {new Date(user.joinDate).toLocaleDateString()}
                </span>
              </div>
              <Link
                prefetch={false}
                href={`/user/${user.username}/yaps`}
                className='flex cursor-pointer items-center gap-1 hover:underline'
              >
                <TbMessage size={'1.25rem'} className='inline-block' />{' '}
                <ClientCompactNum num={user._count.yaps} /> Yaps
              </Link>
              <Link
                prefetch={false}
                href={`/user/${user.username}/echoes`}
                className='flex cursor-pointer items-center gap-1 hover:underline'
              >
                <TbAccessPoint size={'1.25rem'} className='inline-block' />{' '}
                <ClientCompactNum num={user._count.echoes} /> Echoes
              </Link>
              <Link
                prefetch={false}
                href={`/user/${user.username}/following`}
                className='flex cursor-pointer items-center gap-1 hover:underline'
              >
                <TbUsers size={'1.25rem'} className='inline-block' />{' '}
                <ClientCompactNum num={user._count.following} /> Following
              </Link>
              <Link
                prefetch={false}
                href={`/user/${user.username}/followers`}
                className='flex cursor-pointer items-center gap-1 hover:underline'
              >
                <TbUsersGroup size={'1.25rem'} className='inline-block' />{' '}
                <ClientCompactNum num={user._count.followers} /> Followers
              </Link>
              {params.username !== currentUsername && (
                <FollowButton
                  isFollowing={isFollowing}
                  userToFollow={params.username}
                />
              )}
            </div>
            <Avatar className='h-[125px] w-[125px] border-[2px] border-zinc-400 sm:h-[150px] sm:w-[150px] md:h-[175px] md:w-[175px] lg:h-[200px] lg:w-[200px] dark:border-zinc-800'>
              <AvatarImage src={user.image ?? ''} height={'1.5rem'} />
              <AvatarFallback>
                <img
                  alt={`${user.displayName ?? user.username}'s avatar`}
                  src={'/images/defaultavatar.svg'}
                />
              </AvatarFallback>
            </Avatar>
          </div>
          {user.bio && (
            <div>
              <p className=' text-zinc-400 dark:text-zinc-600'>About me</p>
              <p className='whitespace-normal'>{user.bio}</p>
            </div>
          )}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className='flex min-h-dvh flex-col gap-4'>
      <div
        className='flex flex-col gap-2 rounded-lg bg-zinc-100 px-6 py-4 text-zinc-950 md:px-8 md:py-6 lg:px-10 lg:py-8
dark:bg-zinc-950 dark:text-zinc-50'
      >
        <div className='flex items-center justify-between'>
          <p className='text-3xl md:text-4xl'>@{params.username}</p>

          <Avatar className='h-[125px] w-[125px] border-[2px] border-zinc-400 sm:h-[150px] sm:w-[150px] md:h-[175px] md:w-[175px] lg:h-[200px] lg:w-[200px] dark:border-zinc-800'>
            <AvatarImage src={''} height={'1.5rem'} />
            <AvatarFallback>
              <img alt={`avatar`} src={'/images/defaultavatar.svg'} />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <span
        className={`flex w-full flex-col gap-2 rounded-lg border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-5 py-4 text-center text-sm italic shadow-xl sm:text-base dark:border-zinc-800 dark:bg-zinc-900`}
      >
        {`This user does not exist.`}
      </span>
    </div>
  );
}

export default Profile;
