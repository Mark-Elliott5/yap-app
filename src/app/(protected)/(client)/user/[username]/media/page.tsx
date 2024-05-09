import Link from 'next/link';

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

  const child = (async () => {
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
          {`*crickets* There's nothing here.`}
        </p>
      );
    }

    return yaps.map((yap) => (
      <YapPost key={yap.id} currentUsername={currentUsername} {...yap} />
    ));
  })();

  return (
    <>
      <div className='flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
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
      {child}
    </>
  );
}

export default UserProfileMediaPage;
