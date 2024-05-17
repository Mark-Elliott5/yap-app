import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

import EchoYapPost from '@/src/components/yap/EchoYapPost';
import PostsFallback from '@/src/components/yap/PostsFallback';
import YapPost from '@/src/components/yap/YapPost';
import { getLatestYaps } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

export const metadata: Metadata = {
  title: `Home | yap`,
  description: 'Home Page | yap',
};

async function Home() {
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) return null;

  const { yaps, error, echoes } = await getLatestYaps();

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
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          {`There's nothing here... yet.`}
        </p>
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
          className='rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'
        >
          Latest
        </Link>
        <Link
          href='/following'
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
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
          {posts}
        </Suspense>
      </div>
    </>
  );
}

export default Home;
