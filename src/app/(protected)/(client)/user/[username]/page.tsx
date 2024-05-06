import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import YapPost from '@/src/components/yap/YapPost';
import { getUserProfile } from '@/src/lib/database/fetch';

async function Profile({
  params,
}: Readonly<{
  params: { username: string };
}>) {
  const { user } = await getUserProfile(params.username);
  console.log(user);
  if (!user) {
    return <span>{`This account doesn't exist`}</span>;
  }

  const yaps = (() => {
    if (user.yaps && user.yaps.length) {
      const author = {
        username: user.username,
        displayName: user.displayName,
        joinDate: user.joinDate,
        image: user.image,
      };
      return user.yaps.map((yap) => (
        <YapPost key={yap.id} author={author} {...yap} />
      ));
    }
  })();

  return (
    <div className='flex flex-col'>
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
        </div>
      </div>
      {yaps}
    </div>
  );
}

export default Profile;
