'use client';

import Link from 'next/link';

import { Button } from '@/src/components/ui/button';

function CardBackButton({ label, href }: { label: string; href: string }) {
  return (
    <Button className='p-0' variant='link'>
      <Link prefetch={false} className='text-wrap p-2' href={href}>
        {label}
      </Link>
    </Button>
  );
}

export default CardBackButton;
