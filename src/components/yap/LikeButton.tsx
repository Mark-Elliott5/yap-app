'use client';
import { useState } from 'react';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';
import abbreviateNum from '@/src/lib/abbreviateNum';

function LikeButton({ liked, likes }: { liked: boolean; likes: number }) {
  const [on, setOn] = useState(liked);

  // implement server action here later

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`hover:text-yap-red-500 ${on ? 'text-yap-red-500' : 'text-zinc-600'} flex items-center gap-1`}
            onClick={() => setOn((prev) => !prev)}
          >
            {on ? (
              <IoMdHeart size='1.5rem' className='text-inherit' />
            ) : (
              <IoMdHeartEmpty size='1.5rem' className='text-inherit' />
            )}
            <span className='font-light text-inherit'>
              {abbreviateNum(likes)}
            </span>
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
