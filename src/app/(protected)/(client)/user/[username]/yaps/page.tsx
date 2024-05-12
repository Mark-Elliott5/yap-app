import { Suspense } from 'react';
import Link from 'next/link';

import PostsFallback from '@/src/components/yap/PostsFallback';
import YapPost from '@/src/components/yap/YapPost';
import { getUserProfileYaps } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function UserProfileYapsPage({
  params,
}: {
  params: { username: string };
}) {
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) return null;

  const posts = (async () => {
    const { yaps, error } = await getUserProfileYaps(params.username);

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
          No media yet!
        </p>
      );
    }

    return yaps.map((yap) => (
      <YapPost key={yap.id} currentUsername={currentUsername} {...yap} />
    ));
  })();

  return (
    <>
      <div className='flex gap-2 overflow-x-scroll text-sm text-zinc-950 sm:gap-4 sm:text-base md:overflow-x-visible md:text-lg lg:text-xl dark:text-zinc-100'>
        <Link
          href={`.`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Latest
        </Link>
        <Link
          href={``}
          className='rounded-md border-t-1 border-zinc-100 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'
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
      <Suspense fallback={<PostsFallback />}>{posts}</Suspense>
    </>
  );
}

export default UserProfileYapsPage;
