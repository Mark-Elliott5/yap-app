import Link from 'next/link';

import EchoYapPost from '@/src/components/yap/EchoYapPost';
import YapPost from '@/src/components/yap/YapPost';
import { getLatestYaps } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function Home() {
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) return null;

  const { yaps, error, echoes } = await getLatestYaps();

  const child = (() => {
    if (!echoes || !yaps || (!echoes.length && !yaps.length)) {
      return (
        <>
          <p className='text-center text-zinc-600'>*dust settles*</p>
          <p className='text-center text-zinc-950 dark:text-zinc-50'>
            Sure is quiet in here...
          </p>
        </>
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

  if (yaps) {
    return (
      <>
        <div className='mt-4 flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
          <Link
            href='/home'
            className='rounded-md border-t-1 border-zinc-100 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'
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
        {child}
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

  return (
    <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
      {`*crickets* There's nothing here.`}
    </p>
  );
}

export default Home;
