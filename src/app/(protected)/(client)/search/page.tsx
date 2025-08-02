import { Suspense } from 'react';
import { Metadata } from 'next';

import EndOfList from '@/src/components/yap/EndOfList';
import OlderPostsLink from '@/src/components/yap/post/OlderPostsLink';
import PostsFallback from '@/src/components/yap/post/PostsFallback';
import YapPost from '@/src/components/yap/post/YapPost';
import SomethingWentWrong from '@/src/components/yap/SomethingWentWrong';
import TheresNothingHere from '@/src/components/yap/TheresNothingHere';
import { getSearch } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { query?: string };
}): Promise<Metadata> {
  return {
    title: `${searchParams.query ? `"${decodeURIComponent(searchParams.query)}"` : 'Search'} 🔎 | yap`,
    description: `${searchParams.query ? `Search for ${decodeURIComponent(searchParams.query)}` : 'Search'} | yap`,
  };
}

async function SearchPage({
  searchParams,
}: {
  searchParams: { query?: string; date?: string; id?: string };
}) {
  const { query, date, id } = searchParams;
  if (!query) {
    return (
      <>
        <div className='my-4 flex min-h-dvh gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
          <div>
            <header className='cursor-default rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-transform hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'>
              {`Search`}
            </header>
          </div>
        </div>
      </>
    );
  }
  const currentData = getCurrentUsername();
  const yapData = getSearch(decodeURIComponent(query), date, id);

  const [currentUsername, { yaps, error }] = await Promise.all([
    currentData,
    yapData,
  ]);

  if (!currentUsername) return null;

  const body = (() => {
    if (error) {
      return <SomethingWentWrong />;
    }

    if (!yaps || !yaps.length) {
      if (query) return <EndOfList />;
      return <TheresNothingHere />;
    }

    return (
      <>
        {yaps.map((yap) => (
          <YapPost key={yap.id} currentUsername={currentUsername} {...yap} />
        ))}

        <OlderPostsLink
          length={yaps.length}
          date={yaps[yaps.length - 1].date}
          id={yaps[yaps.length - 1].id}
          customParam={`query=${encodeURIComponent(query)}`}
          typeText='Yaps'
        />
      </>
    );
  })();

  return (
    <>
      <div className='my-4 flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <header className='cursor-default rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-transform hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'>
          {`Search: "${decodeURIComponent(query)}"`}
        </header>
      </div>
      <div className='flex min-h-dvh flex-col gap-4'>
        <Suspense
          key={query + date + id}
          fallback={Array.from({ length: 8 }).map((_, i) => (
            <PostsFallback key={i} />
          ))}
        >
          {body}
        </Suspense>
      </div>
    </>
  );
}

export default SearchPage;
