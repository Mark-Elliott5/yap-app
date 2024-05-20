import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

import OlderPostsLink from '@/src/components/yap/OlderPostsLink';
import PostsFallback from '@/src/components/yap/PostsFallback';
import SomethingWentWrong from '@/src/components/yap/SomethingWentWrong';
import TheresNothingHere from '@/src/components/yap/TheresNothingHere';
import YapPost from '@/src/components/yap/YapPost';
import { getFollowingYaps } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

export const metadata: Metadata = {
  title: `Following Feed | yap`,
  description: 'Following Feed Page | yap',
};

async function Following({
  searchParams,
}: {
  searchParams: {
    date: string | undefined;
    id: string | undefined;
  };
}) {
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) return null;

  const { date, id } = searchParams;
  const { yaps, error, noFollowing } = await getFollowingYaps(
    currentUsername,
    date,
    id
  );

  const followingPosts = (() => {
    if (error) {
      return <SomethingWentWrong />;
    }

    if (noFollowing) {
      return (
        <div
          className={`flex w-full flex-col gap-2 rounded-lg border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-5 py-4 text-center text-sm italic shadow-xl sm:text-base dark:border-zinc-800 dark:bg-zinc-900`}
        >
          <p className='text-center text-zinc-600'>*dust settles*</p>
          <p className='text-center text-zinc-950 dark:text-zinc-50'>
            {`It appears you aren't following anyone.`}
          </p>
          <p className='text-center text-zinc-950 dark:text-zinc-50'>
            Go follow some yappers then come back here!
          </p>
        </div>
      );
    }

    if (!yaps || !yaps.length) {
      return <TheresNothingHere />;
    }

    return (
      <>
        {yaps.map((post) => (
          <YapPost key={post.id} currentUsername={currentUsername} {...post} />
        ))}
        <OlderPostsLink
          length={yaps.length}
          date={yaps[yaps.length - 1].date}
          id={yaps[yaps.length - 1].id}
        />
      </>
    );
  })();

  return (
    <>
      <div className='my-4 flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <Link
          href='/home'
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Latest
        </Link>
        <Link
          href='/following'
          className='rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'
        >
          Following
        </Link>
      </div>
      <div className='flex min-h-dvh flex-col gap-4'>
        <Suspense
          fallback={Array.from({ length: 8 }).map((_, i) => (
            <PostsFallback key={i} />
          ))}
        >
          {followingPosts}
        </Suspense>
      </div>
    </>
  );
}

export default Following;
