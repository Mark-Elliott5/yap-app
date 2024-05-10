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
      <div className='flex max-w-[326px] gap-2 overflow-x-scroll text-lg text-zinc-950 sm:w-[unset] sm:max-w-[unset] sm:gap-4 sm:overflow-x-visible lg:text-xl dark:text-zinc-100'>
        <Link
          href={`/user/${params.username}/`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Latest
        </Link>
        <Link
          href={`/user/${params.username}/yaps`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Yaps
        </Link>
        <Link
          href={`/user/${params.username}/echoes`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Echoes
        </Link>
        <Link
          href={`/user/${params.username}/media`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Media
        </Link>
        <Link
          href={`/user/${params.username}/likes`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Likes
        </Link>
      </div>
      <YapPost currentUsername={currentUsername} {...yap} />
      <div className='flex gap-4'>
        <Separator
          orientation='vertical'
          className='h-[unset] w-[1px] rounded-full bg-gradient-to-t from-zinc-50 to-zinc-400 dark:from-zinc-800 dark:to-zinc-600'
        />
        <div className='flex w-full flex-col gap-4'>
          {children}
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
