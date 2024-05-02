'use client';
import { useState } from 'react';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';

import { Button } from '@/src/components/ui/button';

function LikeButton({
  className,
  liked,
}: {
  className?: string;
  liked: boolean;
}) {
  const [on, setOn] = useState(liked);

  // implement server action here later

  return (
    <Button
      variant='ghost'
      className={className}
      onClick={() => setOn((prev) => !prev)}
    >
      {on ? (
        <IoMdHeart className='text-yap-red-500' />
      ) : (
        <IoMdHeartEmpty className='text-zinc-600' />
      )}
    </Button>
  );
}

export default LikeButton;
