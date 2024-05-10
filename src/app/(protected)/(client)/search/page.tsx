function StartSearch() {
  return (
    <>
      <div className='my-4 flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <header className='cursor-default rounded-md border-t-1 border-zinc-100 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'>
          {`Search`}
        </header>
      </div>
      <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
        Search for yaps!
      </p>
    </>
  );
}

export default StartSearch;
