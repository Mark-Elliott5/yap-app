'use client';
import { useState } from 'react';
import { TbMessage } from 'react-icons/tb';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';
import PostPopup from '@/src/components/yap/PostPopup';
import abbreviateNum from '@/src/lib/abbreviateNum';
import { Yap } from '@prisma/client';

function ReplyButton({ id, replies }: { id: Yap['id']; replies: number }) {
  const [postVisible, setPostVisible] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`transition-all hover:scale-[1.1] hover:text-yap-blue-500 hover:drop-shadow-reply active:scale-[0.85] ${postVisible ? 'text-yap-blue-500 drop-shadow-reply' : 'text-zinc-600'} flex items-center gap-1`}
              onClick={() => setPostVisible((prev) => !prev)}
            >
              <TbMessage size='1.25rem' />
              <span className='font-light text-inherit'>
                {abbreviateNum(replies)}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className='bg-zinc-100 dark:bg-zinc-950'>Reply</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {postVisible && <PostPopup setPostVisible={setPostVisible} id={id} />}
    </>
  );
}

export default ReplyButton;
