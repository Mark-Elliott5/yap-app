'use client';
import { useState } from 'react';
import { TbHeart, TbHeartFilled } from 'react-icons/tb';

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
            className={`hover:drop-shadow-heart transition-all hover:scale-[1.1] hover:text-yap-red-500 ${on ? 'drop-shadow-heart text-yap-red-500' : 'text-zinc-600'} flex items-center gap-1`}
            onClick={() => setOn((prev) => !prev)}
          >
            {on ? <TbHeartFilled size='1.25rem' /> : <TbHeart size='1.25rem' />}
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
