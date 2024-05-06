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
import { heartYap } from '@/src/lib/database/actions';
import { Yap } from '@prisma/client';

function LikeButton({
  id,
  liked,
  likes,
}: {
  id: Yap['id'];
  liked: boolean;
  likes: number;
}) {
  const [on, setOn] = useState(liked);

  const handleChange = async (data: FormData) => {
    setOn((prev) => !prev);
    await heartYap(data);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleChange(new FormData(e.currentTarget));
            }}
            id='form'
          >
            <input hidden value={id} readOnly name='id' />
            <input hidden value={on ? 0 : 1} readOnly name='state' />
            <button
              type='submit'
              className={`transition-all ease-linear hover:scale-[1.2] hover:animate-spin hover:text-yap-red-500 hover:drop-shadow-heart active:scale-[0.85] active:animate-none ${on ? 'text-yap-red-500 drop-shadow-heart' : 'text-zinc-600'} flex items-center gap-1`}
            >
              {on ? (
                <TbHeartFilled size='1.25rem' />
              ) : (
                <TbHeart size='1.25rem' />
              )}
              <span className='font-light text-inherit'>
                {abbreviateNum(
                  likes + (!liked && on ? 1 : liked && !on ? -1 : 0)
                )}
              </span>
            </button>
          </form>
        </TooltipTrigger>
        <TooltipContent>
          <p className='bg-zinc-100 dark:bg-zinc-950'>Like</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default LikeButton;
