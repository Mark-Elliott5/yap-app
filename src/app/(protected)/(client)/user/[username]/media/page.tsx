import { Suspense } from 'react';
import Link from 'next/link';

import PostsFallback from '@/src/components/yap/PostsFallback';
import YapPost from '@/src/components/yap/YapPost';
import { getUserProfileMedia } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function UserProfileMediaPage({
  params,
}: {
  params: { username: string; media: string };
}) {
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) return null;

  const posts = (async () => {
    const { yaps, error } = await getUserProfileMedia(params.username);

    if (error) {
      return (
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          Something went wrong! Please try again.
        </p>
      );
    }

    if (!yaps || !yaps.length) {
      return (
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          {`There's nothing here... yet.`}
        </p>
      );
    }

    return yaps.map((yap) => (
      <YapPost key={yap.id} currentUsername={currentUsername} {...yap} />
    ));
  })();

  return (
    <>
      <div className='flex gap-2 overflow-y-hidden overflow-x-scroll text-lg text-zinc-950 sm:gap-4 md:overflow-x-visible lg:text-xl dark:text-zinc-100'>
        <Link
          href={`.`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Latest
        </Link>
        <Link
          href={`./yaps`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
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
          href={``}
          className='rounded-md border-t-1 border-zinc-100 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'
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

export default UserProfileMediaPage;
