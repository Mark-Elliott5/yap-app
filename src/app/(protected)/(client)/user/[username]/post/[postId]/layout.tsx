import Link from 'next/link';

import { Separator } from '@/src/components/ui/separator';
import YapPost from '@/src/components/yap/YapPost';
import { getYap } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function YapPostLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { username: string; postId: string };
}>) {
  // getCurrentUsername cannot use cache function (see module top level comment)
  // it also doesn't need to be cached because all instances of its calling will
  // be inside a page.tsx file. There will be nothing to dedupe.
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) return null;

  const { yap, error } = await getYap(params.postId);

  if (error) {
    console.log('ERROR', error);
    return (
      <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
        Something went wrong! Please try again.
      </p>
    );
  }

  if (!yap) {
    return (
      <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
        {`*crickets* There's nothing here.`}
      </p>
    );
  }

  return (
    <>
      <div className='flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <Link
          href={`..`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Latest
        </Link>
        <Link
          href={`../yaps`}
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
          href={`../media`}
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
      <YapPost currentUsername={currentUsername} {...yap} />
      {children}
      <div className='flex gap-4' key={yap.id}>
        <Separator
          orientation='vertical'
          className='w-[1px] flex-grow-0 bg-gradient-to-t from-zinc-800 to-zinc-600 text-white'
        />
        <div className='flex w-full flex-col gap-4'>
          {yap.replies.map((yap) => (
            <YapPost
              key={yap.id}
              parentYap={'thread'}
              currentUsername={currentUsername}
              {...yap}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default YapPostLayout;
