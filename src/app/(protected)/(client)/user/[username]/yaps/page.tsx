import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

import PostsFallback from '@/src/components/yap/PostsFallback';
import YapPost from '@/src/components/yap/YapPost';
import { getUserProfileYaps } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  return {
    title: `@${params.username}'s Yaps | yap`,
    description: `@${params.username}'s Yaps | yap`,
  };
}

async function UserProfileYapsPage({
  params,
}: {
  params: { username: string };
}) {
  const currentData = getCurrentUsername();
  const yapData = getUserProfileYaps(params.username);

  const [currentUsername, { yaps, error }] = await Promise.all([
    currentData,
    yapData,
  ]);

  if (!currentUsername) return null;

  const posts = (async () => {
    if (error) {
      return (
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          {error}
        </p>
      );
    }

    if (!yaps || !yaps.length) {
      return (
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          No yaps yet.
        </p>
      );
    }

    return yaps.map((yap) => (
      <YapPost key={yap.id} currentUsername={currentUsername} {...yap} />
    ));
  })();

  return (
    <>
      <div className='flex gap-2 overflow-x-scroll px-[9px] py-[6px] text-sm text-zinc-950 sm:gap-4 sm:px-[unset] sm:py-[unset] sm:text-base md:overflow-x-visible md:text-lg lg:text-xl dark:text-zinc-100'>
        <Link
          href={`.`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Latest
        </Link>
        <Link
          href={``}
          className='rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'
        >
          Yaps
        </Link>
        <Link
          href={`./echoes`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Echoes
        </Link>
        <Link
          href={`./media`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Media
        </Link>
        <Link
          href={`./likes`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Likes
        </Link>
      </div>
      <Suspense
        fallback={Array.from({ length: 8 }).map((_, i) => (
          <PostsFallback key={i} />
        ))}
      >
        {posts}
      </Suspense>
    </>
  );
}

export default UserProfileYapsPage;
