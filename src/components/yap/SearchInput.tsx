'use client';

import { useRouter } from 'next/navigation';

import { Input } from '@/src/components/ui/input';

function SearchInput() {
  const router = useRouter();

  return (
    <Input
      onKeyDown={(e) => {
        console.log(e.currentTarget.value);
        e.key === 'Enter' &&
          router.push(`/search/${encodeURIComponent(e.currentTarget.value)}`);
      }}
      maxLength={50}
    />
  );
}

export default SearchInput;
