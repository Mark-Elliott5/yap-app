import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

import SomethingWentWrong from '@/src/components/yap/SomethingWentWrong';
import UsersFallback from '@/src/components/yap/UsersFallback';
import UserTab from '@/src/components/yap/UserTab';
import { getFollowing } from '@/src/lib/database/fetch';

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  return {
    title: `@${params.username}'s Following | yap`,
    description: `@${params.username}'s Following | yap`,
  };
}

async function FollowingPage({
  params,
}: Readonly<{
  params: { username: string };
}>) {
  const { following, error } = await getFollowing(params.username);

  const posts = (() => {
    if (error) {
      return <SomethingWentWrong />;
    }

    if (!following || !following.length) {
      return (
        <span
          className={`flex w-full flex-col gap-2 rounded-lg border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-5 py-4 text-center text-sm italic shadow-xl sm:text-base dark:border-zinc-800 dark:bg-zinc-900`}
        >
          @{params.username} is not following anyone.
        </span>
      );
    }
    return following.map((user) => <UserTab key={user.username} {...user} />);
  })();

  return (
    <>
      <div className='flex gap-2 overflow-x-scroll px-[9px] py-[6px] text-sm text-zinc-950 sm:gap-4 sm:px-[unset] sm:py-[unset] sm:text-base md:overflow-x-visible md:text-lg lg:text-xl dark:text-zinc-100'>
        <Link
          href={`/user/${params.username}/`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Latest
        </Link>
        <Link
          href={`/user/${params.username}/yaps`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Yaps
        </Link>
        <Link
          href={`/user/${params.username}/echoes`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Echoes
        </Link>
        <Link
          href={`/user/${params.username}/media`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Media
        </Link>
        <Link
          href={`/user/${params.username}/likes`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Likes
        </Link>
      </div>
      <div className='my-4 flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <Link
          href={`/user/${params.username}/followers`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Followers
        </Link>
        <Link
          href={`/user/${params.username}/following`}
          className='rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'
        >
          Following
        </Link>
      </div>
      <div className='flex w-full flex-col gap-4'>
        <Suspense
          fallback={Array.from({ length: 10 }).map((_, i) => (
            <UsersFallback key={i} />
          ))}
        >
          {posts}
        </Suspense>
      </div>
    </>
  );
}

export default FollowingPage;
