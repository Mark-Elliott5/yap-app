'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TbLoader2, TbQuestionMark, TbTrash } from 'react-icons/tb';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';
import { deleteYap } from '@/src/lib/database/actions';
import { Yap } from '@prisma/client';

interface DeleteButtonProps {
  id: Yap['id'];
}

function DeleteButton({ id }: DeleteButtonProps) {
  const [formVisible, setFormVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = async (data: FormData) => {
    setSubmitting(true);
    const { success } = await deleteYap(data);
    if (success) {
      router.refresh();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <button
              className={`flex items-center gap-1 text-zinc-500 transition-all hover:scale-[1.2] hover:text-red-500 hover:drop-shadow-delete active:scale-[0.95] dark:text-zinc-600`}
              onClick={() => setFormVisible(true)}
            >
              {formVisible ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleChange(new FormData(e.currentTarget));
                  }}
                  className='flex'
                >
                  <input hidden value={id} readOnly name='id' />
                  {submitting ? (
                    <TbLoader2 size='1.25rem' className='animate-spin' />
                  ) : (
                    <button className='flex'>
                      <TbTrash size='1.25rem' className='inline-block' />
                      <TbQuestionMark size='1.25rem' className='inline-block' />
                    </button>
                  )}
                </form>
              ) : (
                <TbTrash size='1.25rem' />
              )}
            </button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className='bg-white text-red-500 dark:bg-zinc-950'>
            {formVisible ? 'Are you sure?' : 'Delete'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default DeleteButton;
