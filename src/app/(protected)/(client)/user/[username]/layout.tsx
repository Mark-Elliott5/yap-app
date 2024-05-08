import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { getUserProfile } from '@/src/lib/database/fetch';

async function Profile({
  params,
  children,
}: Readonly<{
  params: { username: string };
  children: React.ReactNode;
}>) {
  const { user } = await getUserProfile(params.username);
  if (user) {
    return (
      <div className='flex min-h-full flex-col gap-4'>
        <div className='flex gap-6 rounded-lg bg-zinc-100 p-10  dark:bg-zinc-950'>
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
          <div>
            {user.displayName && (
              <p className='text-4xl text-zinc-950 dark:text-zinc-100'>
                {user.displayName}
              </p>
            )}
            <p
              className={
                !user.displayName
                  ? 'text-4xl text-zinc-950 dark:text-zinc-100'
                  : 'text-xl text-zinc-400'
              }
            >
              @{user.username}
            </p>
            <p className='text-zinc-500'>
              Joined {user.joinDate.toLocaleDateString()}
            </p>
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
