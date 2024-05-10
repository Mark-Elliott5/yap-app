import YapPost from '@/src/components/yap/YapPost';
import { getSearch } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function SearchPage({ params }: { params: { query: string } }) {
  // get currently logged in user to check if this user has liked/echoed/replied
  // YapPost via its child Like/Echo/Reply button components
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) return null;
  const { yaps, error } = await getSearch(params.query);

  if (error) {
    return (
      <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
        Something went wrong!. Try again.
      </p>
    );
  }

  if (!yaps || !yaps.length) {
    return (
      <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
        {`*crickets* Nothing matched your query.`}
      </p>
    );
  }

  return (
    <>
      <div className='my-4 flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <header className='cursor-default rounded-md border-t-1 border-zinc-100 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'>
          {`Search: "${params.query}"`}
        </header>
      </div>
      <div className='flex flex-col gap-4'>
        {yaps.map((yap) => (
          <YapPost key={yap.id} currentUsername={currentUsername} {...yap} />
        ))}
      </div>
    </>
  );
}

export default SearchPage;
