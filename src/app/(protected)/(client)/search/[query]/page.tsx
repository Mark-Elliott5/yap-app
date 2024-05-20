import { Suspense } from 'react';
import { Metadata } from 'next';

import PostsFallback from '@/src/components/yap/PostsFallback';
import SomethingWentWrong from '@/src/components/yap/SomethingWentWrong';
import TheresNothingHere from '@/src/components/yap/TheresNothingHere';
import YapPost from '@/src/components/yap/YapPost';
import { getSearch } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

export async function generateMetadata({
  params,
}: {
  params: { query: string };
}): Promise<Metadata> {
  return {
    title: `"${decodeURIComponent(params.query)}" 🔎 | yap`,
    description: `Search for ${decodeURIComponent(params.query)} | yap`,
  };
}

async function SearchPage({ params }: { params: { query: string } }) {
  const currentData = getCurrentUsername();
  const yapData = getSearch(decodeURIComponent(params.query));

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
      return <TheresNothingHere />;
    }

    return yaps.map((yap) => (
      <YapPost key={yap.id} currentUsername={currentUsername} {...yap} />
    ));
  })();

  return (
    <>
      <div className='my-4 flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <header className='cursor-default rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'>
          {`Search: "${decodeURIComponent(params.query)}"`}
        </header>
      </div>
      <Suspense
        fallback={Array.from({ length: 8 }).map((_, i) => (
          <PostsFallback key={i} />
        ))}
      >
        <div className='flex min-h-dvh flex-col gap-4'>{body}</div>
      </Suspense>
    </>
  );
}

export default SearchPage;
