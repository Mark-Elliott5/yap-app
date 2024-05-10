'use client';
import { useState } from 'react';
import Link from 'next/link';
import { TbMessage } from 'react-icons/tb';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';
import abbreviateNum from '@/src/lib/abbreviateNum';
import { User, Yap } from '@prisma/client';

function ReplyButton({
  id,
  user,
  replies,
}: {
  id: Yap['id'];
  user: User['username'];
  replies: number;
}) {
  // const [postVisible, setPostVisible] = useState(false);
  const [wobble, setWobble] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/user/${user}/post/${id}/reply`}
              className={`flex items-center gap-1 text-zinc-600 transition-all hover:scale-[1.2] hover:text-yap-blue-500 hover:drop-shadow-reply active:scale-[0.95]`}
              // onClick={() => setPostVisible((prev) => !prev)}
              onMouseOver={() => setWobble(true)}
              onMouseLeave={() => setWobble(false)}
            >
              <TbMessage
                size='1.25rem'
                className={`${wobble ? 'animate-wiggle-more animate-infinite' : ''} h-full w-full`}
              />
              <span className='font-light text-inherit'>
                {abbreviateNum(replies)}
              </span>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p className='bg-white dark:bg-zinc-950'>Reply</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* {postVisible && <PostPopup setPostVisible={setPostVisible} id={id} />} */}
    </>
  );
}

export default ReplyButton;
