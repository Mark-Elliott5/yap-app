'use client';
import { useState } from 'react';
import { HiSignal } from 'react-icons/hi2';

import { Button } from '@/src/components/ui/button';

function EchoButton({
  className,
  liked,
}: {
  className?: string;
  liked: boolean;
}) {
  const [on, setOn] = useState(liked);

  // implement server action here later

  return (
    <Button className={className} onClick={() => setOn((prev) => !prev)}>
      <HiSignal className={on ? 'text-yap-green-500' : 'text-zinc-600'} />
    </Button>
  );
}

export default EchoButton;
