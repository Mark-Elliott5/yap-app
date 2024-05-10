import SearchInput from '@/src/components/yap/SearchInput';

function Search({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SearchInput />
      {children}
    </>
  );
}

export default Search;
