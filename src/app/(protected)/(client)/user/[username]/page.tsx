import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

import EchoYapPost from '@/src/components/yap/post/EchoYapPost';
import OlderPostsLink from '@/src/components/yap/post/OlderPostsLink';
import PostsFallback from '@/src/components/yap/post/PostsFallback';
import YapPost from '@/src/components/yap/post/YapPost';
import SomethingWentWrong from '@/src/components/yap/SomethingWentWrong';
import TheresNothingHere from '@/src/components/yap/TheresNothingHere';
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
  searchParams,
}: {
  params: { username: string };
  searchParams: {
    date?: string;
    id?: string;
  };
}) {
  // get currently logged in user to check if this user has liked/echoed/replied
  // YapPost via its child Like/Echo/Reply button components
  const { date, id } = searchParams;
  const currentData = getCurrentUsername();
  const yapData = getUserProfileYapsAndEchoes(params.username, date, id);

  const [currentUsername, { posts, error }] = await Promise.all([
    currentData,
    yapData,
  ]);

  if (!currentUsername) return null;

  const yapsAndEchoes = (() => {
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
      <div className='flex gap-2 overflow-x-scroll px-[9px] py-[6px] text-sm text-zinc-950 sm:gap-4 sm:px-[unset] sm:py-[unset] sm:text-base md:overflow-x-visible md:text-lg lg:text-xl dark:text-zinc-100'>
        <Link
          href={``}
          className='rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'
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
        key={params.username + 'yapsandechoes' + date + id}
        fallback={Array.from({ length: 8 }).map((_, i) => (
          <PostsFallback key={i} />
        ))}
      >
        {yapsAndEchoes}
      </Suspense>
    </>
  );
}

export default UserProfileYapsAndEchoesPage;
