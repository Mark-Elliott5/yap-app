'use client';

import Link from 'next/link';
import { Button } from './ui/button';

function CardBackButton({ label, href }: { label: string; href: string }) {
  return (
    <Button variant='link'>
      <Link href={href}>{label}</Link>
    </Button>
  );
}

export default CardBackButton;
