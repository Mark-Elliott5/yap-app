'use client';
import { useState } from 'react';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className={className} onClick={() => setOn((prev) => !prev)}>
            {on ? (
              <IoMdHeart
                className={`hover:text-yap-red-500 ${on ? 'text-yap-red-500' : 'text-zinc-600'}`}
              />
            ) : (
              <IoMdHeartEmpty
                className={`hover:text-yap-red-500 ${on ? 'text-yap-red-500' : 'text-zinc-600'}`}
              />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className='bg-zinc-100 dark:bg-zinc-950'>Like</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default LikeButton;
