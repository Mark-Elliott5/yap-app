import { Suspense } from 'react';
import Link from 'next/link';

import EchoYapPost from '@/src/components/yap/EchoYapPost';
import PostsFallback from '@/src/components/yap/PostsFallback';
import YapPost from '@/src/components/yap/YapPost';
import { getFollowingYaps } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function Following() {
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) return null;

  const { yaps, error, echoes } = await getFollowingYaps(currentUsername);

  const posts = (() => {
    if (error) {
      return (
        <span className='text-zinc-950 dark:text-zinc-100'>
          Something went wrong! Please reload the page.
        </span>
      );
    }

    if (!echoes || !yaps || (!echoes.length && !yaps.length)) {
      return (
        <div className='mt-4 flex flex-col gap-2'>
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

    const posts = (() => {
      const temp = [...yaps, ...echoes];
      temp.sort((a, b) => b.date.getTime() - a.date.getTime());
      return temp;
    })();

    return posts.map((yap) => {
      if ('yap' in yap) {
        return (
          <EchoYapPost
            key={yap.id}
            currentUsername={currentUsername}
            {...yap}
          />
        );
      }

      return (
        <YapPost key={yap.id} currentUsername={currentUsername} {...yap} />
      );
    });
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
          className='rounded-md border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'
        >
          Following
        </Link>
      </div>
      <Suspense
        fallback={Array.from({ length: 8 }).map((_, i) => (
          <PostsFallback key={i} />
        ))}
      >
        <div className='flex min-h-dvh flex-col gap-4'>{posts}</div>
      </Suspense>
    </>
  );
}

export default Following;
