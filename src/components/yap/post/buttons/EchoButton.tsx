'use client';
import { useState } from 'react';
import { TbAccessPoint } from 'react-icons/tb';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';
import ClientCompactNum from '@/src/components/yap/post/ClientCompactNum';
import { echoYap } from '@/src/lib/database/actions';

interface EchoButtonProps {
  id: string;
  echoed: boolean;
  echoes: number;
}

function EchoButton({ id, echoed, echoes }: EchoButtonProps) {
  const [on, setOn] = useState(echoed);
  const [spin, setSpin] = useState(false);

  const handleChange = async (data: FormData) => {
    setOn((prev) => !prev);
    const { error } = await echoYap(data);
    if (error) setOn(on);
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
              className={`transition-[transform,filter] hover:scale-[1.2] hover:text-yap-peri-500 hover:drop-shadow-echo active:scale-[0.95]  ${on ? 'text-yap-peri-500 drop-shadow-echo' : 'text-zinc-500 dark:text-zinc-600'} flex items-center gap-1`}
              onMouseOver={() => setSpin(true)}
              onMouseLeave={() => setSpin(false)}
            >
              <TbAccessPoint
                size='1.25rem'
                className={`${spin ? 'animate-spin' : ''}`}
              />
              <span className='font-light text-inherit'>
                <ClientCompactNum
                  num={echoes + (!echoed && on ? 1 : echoed && !on ? -1 : 0)}
                />
              </span>
            </button>
          </form>
        </TooltipTrigger>
        <TooltipContent>
          <p className='bg-white dark:bg-zinc-950'>Echo</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default EchoButton;
