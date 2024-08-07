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
import ClientCompactNum from '@/src/components/yap/post/ClientCompactNum';
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
              className={`flex items-center gap-1 text-zinc-500 transition-all hover:scale-[1.2] hover:text-yap-blue-500 hover:drop-shadow-reply active:scale-[0.95] dark:text-zinc-600`}
              // onClick={() => setPostVisible((prev) => !prev)}
              onMouseOver={() => setWobble(true)}
              onMouseLeave={() => setWobble(false)}
            >
              <TbMessage
                size='1.25rem'
                className={`${wobble ? 'animate-wiggle-more animate-infinite' : ''}`}
              />
              <span className='font-light text-inherit'>
                <ClientCompactNum num={replies} />
              </span>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p className='bg-white dark:bg-zinc-950'>Reply</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

export default ReplyButton;
