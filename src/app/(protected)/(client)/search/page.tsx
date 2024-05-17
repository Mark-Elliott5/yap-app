import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Search 🔎 | yap`,
  description: 'Search Page | yap',
};

function StartSearch() {
  return (
    <>
      <div className='my-4 flex min-h-dvh gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <div>
          <header className='cursor-default rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'>
            {`Search`}
          </header>
        </div>
      </div>
    </>
  );
}

export default StartSearch;
