import Link from 'next/link';

import YapPost from '@/src/components/yap/YapPost';
import { getLatestYaps } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function Following() {
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) return null;

  const { yaps, error } = await getLatestYaps();
  if (yaps && yaps.length) {
    return (
      <>
        <div className='mt-4 flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
          <Link
            href='/home'
            className='px-4 py-2 transition-all hover:scale-[1.2] hover:opacity-70'
          >
            Latest
          </Link>
          <Link
            href='/following'
            className='rounded-md border-t-1 border-zinc-100 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'
          >
            Following
          </Link>
        </div>
        {yaps.map((yap) => (
          <YapPost key={yap.id} currentUsername={currentUsername} {...yap} />
        ))}
      </>
    );
  }

  if (error) {
    return (
      <span className='text-zinc-950 dark:text-zinc-100'>
        Something went wrong! Please reload the page.
      </span>
    );
  }
}

export default Following;
