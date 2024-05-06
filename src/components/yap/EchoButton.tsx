'use client';
import { useState } from 'react';
import { HiSignal } from 'react-icons/hi2';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';
import abbreviateNum from '@/src/lib/abbreviateNum';

function EchoButton({
  echoed,
  echoes,
}: {
  className?: string;
  echoed: boolean;
  echoes: number;
}) {
  const [on, setOn] = useState(echoed);

  // implement server action here later

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`hover:drop-shadow-echo transition-all hover:scale-[1.1] hover:text-yap-green-500 ${on ? 'drop-shadow-echo text-yap-green-500' : 'text-zinc-600'} flex items-center gap-1`}
            onClick={() => setOn((prev) => !prev)}
          >
            <HiSignal size='1.25rem' />
            <span className='font-light text-inherit'>
              {abbreviateNum(echoes)}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className='bg-zinc-100 dark:bg-zinc-950'>Echo</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default EchoButton;
