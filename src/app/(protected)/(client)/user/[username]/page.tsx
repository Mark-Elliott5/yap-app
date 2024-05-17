import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

import EchoYapPost from '@/src/components/yap/EchoYapPost';
import PostsFallback from '@/src/components/yap/PostsFallback';
import YapPost from '@/src/components/yap/YapPost';
import { getUserProfileYapsAndEchoes } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  return {
    title: `@${params.username}'s Profile | yap`,
    description: `@${params.username}'s Profile | yap`,
  };
}

async function UserProfileYapsAndEchoesPage({
  params,
}: {
  params: { username: string };
}) {
  // get currently logged in user to check if this user has liked/echoed/replied
  // YapPost via its child Like/Echo/Reply button components
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) return null;

  const posts = (async () => {
    const { yapsAndEchoes, error } = await getUserProfileYapsAndEchoes(
      params.username
    );

    if (error) {
      return (
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          Something went wrong!. Try again.
        </p>
      );
    }

    if (!yapsAndEchoes) return null;

    const { yaps, echoes } = yapsAndEchoes;

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
      <div className='flex gap-2 overflow-x-scroll px-[9px] py-[6px] text-sm text-zinc-950 sm:gap-4 sm:px-[unset] sm:py-[unset] sm:text-base md:overflow-x-visible md:text-lg lg:text-xl dark:text-zinc-100'>
        <Link
          href={``}
          className='rounded-md border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'
        >
          Latest
        </Link>
        <Link
          href={`${params.username}/yaps`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Yaps
        </Link>
        <Link
          href={`${params.username}/echoes`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Echoes
        </Link>
        <Link
          href={`${params.username}/media`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Media
        </Link>
        <Link
          href={`${params.username}/likes`}
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

export default UserProfileYapsAndEchoesPage;
