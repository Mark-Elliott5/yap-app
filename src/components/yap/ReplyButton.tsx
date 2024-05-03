'use client';
import { useState } from 'react';
import { HiReply } from 'react-icons/hi';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';
import PostPopup from '@/src/components/yap/PostPopup';
import { Yap } from '@prisma/client';

function ReplyButton({ id }: { id: Yap['id'] }) {
  const [postVisible, setPostVisible] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className='w-unset p-0 text-left text-2xl text-zinc-950 dark:text-zinc-100'
              onClick={() => setPostVisible((prev) => !prev)}
            >
              <HiReply
                className={`hover:text-yap-blue-500 ${postVisible ? 'text-yap-blue-500' : 'text-zinc-600'}`}
              />
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
