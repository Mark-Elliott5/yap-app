import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

import EchoYapPost from '@/src/components/yap/post/EchoYapPost';
import OlderPostsLink from '@/src/components/yap/post/OlderPostsLink';
import PostsFallback from '@/src/components/yap/post/PostsFallback';
import YapPost from '@/src/components/yap/post/YapPost';
import SomethingWentWrong from '@/src/components/yap/SomethingWentWrong';
import TheresNothingHere from '@/src/components/yap/TheresNothingHere';
import { getLatestYaps } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

export const metadata: Metadata = {
  title: `Home | yap`,
  description: 'Home Page | yap',
};

async function Home({
  searchParams,
}: {
  searchParams: {
    date?: string;
    id?: string;
  };
}) {
  const { date, id } = searchParams;
  const currentData = getCurrentUsername();
  const postsData = getLatestYaps(date, id);

  const [currentUsername, { posts, error }] = await Promise.all([
    currentData,
    postsData,
  ]);

  if (!currentUsername) return null;

  const latest = (() => {
    if (error) {
      return <SomethingWentWrong />;
    }

    if (!posts || !posts.length) {
      if (date || id) {
        return (
          <span
            className={`flex w-full flex-col gap-2 rounded-lg border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-5 py-4 text-center text-sm italic shadow-xl sm:text-base dark:border-zinc-800 dark:bg-zinc-900`}
          >
            {`You've reached the end!`}
          </span>
        );
      }
      return <TheresNothingHere />;
    }

    return (
      <>
        {/* {date && id && <NewerPostsLink date={posts[0].date} id={posts[0].id} />} */}
        {posts.map((post) => {
          if (post.type === 'Echo') {
            return (
              <EchoYapPost
                key={post.id}
                currentUsername={currentUsername}
                {...post}
              />
            );
          }

          return (
            <YapPost
              key={post.id}
              currentUsername={currentUsername}
              {...post}
            />
          );
        })}

        <OlderPostsLink
          length={posts.length}
          date={posts[posts.length - 1].date}
          id={posts[posts.length - 1].id}
        />
      </>
    );
  })();

  return (
    <>
      <div className='my-4 flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <Link
          prefetch={false}
          href='/home'
          className='rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'
        >
          Latest
        </Link>
        <Link
          prefetch={false}
          href='/following'
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Following
        </Link>
      </div>
      <div className='flex min-h-dvh flex-col gap-4'>
        <Suspense
          key={'home' + date + id}
          fallback={Array.from({ length: 8 }).map((_, i) => (
            <PostsFallback key={i} />
          ))}
        >
          {latest}
        </Suspense>
      </div>
    </>
  );
}

export default Home;
