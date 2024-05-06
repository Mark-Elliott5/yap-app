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
  if (!user) {
    return <span>{`This account doesn't exist`}</span>;
  }

  return (
    <div className='flex min-h-full flex-col'>
      <div className='flex gap-6 bg-zinc-200 p-10 dark:bg-zinc-950'>
        <Avatar className='h-[200px] w-[200px] border-[6px] border-black'>
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
                : 'text-xl text-zinc-600'
            }
          >
            {user.username}
          </p>
          <p>Joined {new Date(user.joinDate).toLocaleDateString()}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default Profile;
