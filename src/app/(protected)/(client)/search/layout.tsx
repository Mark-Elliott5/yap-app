import SearchInput from '@/src/components/yap/SearchInput';

function Search({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SearchInput className='mt-2' />
      {children}
    </>
  );
}

export default Search;
