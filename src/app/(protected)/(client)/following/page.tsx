import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

import EndOfList from '@/src/components/yap/EndOfList';
import ListElement from '@/src/components/yap/ListElement';
import OlderPostsLink from '@/src/components/yap/post/OlderPostsLink';
import PostsFallback from '@/src/components/yap/post/PostsFallback';
import YapPost from '@/src/components/yap/post/YapPost';
import SomethingWentWrong from '@/src/components/yap/SomethingWentWrong';
import TheresNothingHere from '@/src/components/yap/TheresNothingHere';
import { getFollowingYaps } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

export const metadata: Metadata = {
  title: `Following Feed | yap`,
  description: 'Following Feed Page | yap',
};

async function Following({
  searchParams,
}: {
  searchParams: {
    date?: string;
    id?: string;
  };
}) {
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) return null;

  const { date, id } = searchParams;
  const { yaps, error, noFollowing } = await getFollowingYaps(
    currentUsername,
    date,
    id
  );

  const followingPosts = (() => {
    if (error) {
      return <SomethingWentWrong />;
    }

    if (noFollowing) {
      return (
        <ListElement className='text-center italic'>
          <p className='text-center text-zinc-600'>*dust settles*</p>
          <p className='text-center text-zinc-950 dark:text-zinc-50'>
            {`It appears you aren't following anyone.`}
          </p>
          <p className='text-center text-zinc-950 dark:text-zinc-50'>
            Go follow some yappers then come back here!
          </p>
        </ListElement>
      );
    }

    if (!yaps || !yaps.length) {
      if (date || id) {
        return <EndOfList />;
      }
      return <TheresNothingHere />;
    }

    return (
      <>
        {yaps.map((post) => (
          <YapPost key={post.id} currentUsername={currentUsername} {...post} />
        ))}

        <OlderPostsLink
          length={yaps.length}
          date={yaps[yaps.length - 1].date}
          id={yaps[yaps.length - 1].id}
          typeText='Yaps'
        />
      </>
    );
  })();

  return (
    <>
      <div className='my-4 flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <Link
          href='/home'
          className='rounded-md px-4 py-2 backdrop-blur-sm transition-transform hover:scale-[1.2]'
        >
          Latest
        </Link>
        <Link
          href='/following'
          className='rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-transform hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'
        >
          Following
        </Link>
      </div>
      <div className='flex min-h-dvh flex-col gap-4'>
        <Suspense
          key={'following' + date + id}
          fallback={Array.from({ length: 8 }).map((_, i) => (
            <PostsFallback key={i} />
          ))}
        >
          {followingPosts}
        </Suspense>
      </div>
    </>
  );
}

export default Following;
