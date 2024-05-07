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
import { echoYap } from '@/src/lib/database/actions';
import { Yap } from '@prisma/client';

interface EchoButtonProps {
  id: Yap['id'];
  echoed: boolean;
  echoes: number;
}

function EchoButton({ id, echoed, echoes }: EchoButtonProps) {
  const [on, setOn] = useState(echoed);
  const [spin, setSpin] = useState(false);

  const handleChange = async (data: FormData) => {
    setOn((prev) => !prev);
    await echoYap(data);
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
            <button
              className={`transition-all hover:scale-[1.1] hover:text-yap-peri-500 hover:drop-shadow-echo active:scale-[0.85] ${on ? 'text-yap-peri-500 drop-shadow-echo' : 'text-zinc-600'} flex items-center gap-1`}
              onMouseOver={() => setSpin(true)}
              onMouseLeave={() => setSpin(false)}
            >
              <HiSignal size='1.25rem' className={spin ? 'animate-spin' : ''} />
              <span className='font-light text-inherit'>
                {abbreviateNum(
                  echoes + (!echoed && on ? 1 : echoed && !on ? -1 : 0)
                )}
              </span>
            </button>
          </form>
        </TooltipTrigger>
        <TooltipContent>
          <p className='bg-zinc-100 dark:bg-zinc-950'>Echo</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default EchoButton;
