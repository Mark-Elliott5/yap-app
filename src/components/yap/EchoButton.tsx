'use client';
import { useState } from 'react';
import { HiSignal } from 'react-icons/hi2';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';

function EchoButton({
  className,
  echoed,
}: {
  className?: string;
  echoed: boolean;
}) {
  const [on, setOn] = useState(echoed);

  // implement server action here later

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className={className} onClick={() => setOn((prev) => !prev)}>
            <HiSignal
              className={`hover:text-yap-green-500 ${on ? 'text-yap-green-500' : 'text-zinc-600'}`}
            />
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
