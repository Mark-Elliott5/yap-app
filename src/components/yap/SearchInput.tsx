'use client';

import { useRouter } from 'next/navigation';

import { Input } from '@/src/components/ui/input';

function SearchInput({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <Input
      onKeyDown={(e) => {
        console.log(e.currentTarget.value);
        e.key === 'Enter' &&
          router.push(`/search/${encodeURIComponent(e.currentTarget.value)}`);
      }}
      maxLength={50}
      className={className}
    />
  );
}

export default SearchInput;
