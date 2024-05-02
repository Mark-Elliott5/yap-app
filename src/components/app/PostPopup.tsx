import { Dispatch, SetStateAction } from 'react';
import { IoIosClose } from 'react-icons/io';

import CreatePostForm from '@/src/components/app/CreatePostForm';
import ReplyPostForm from '@/src/components/app/ReplyPostForm';
import { Button } from '@/src/components/ui/button';
import { Yap } from '@prisma/client';

function PostPopup({
  setPostVisible,
  id,
}: {
  setPostVisible: Dispatch<SetStateAction<boolean>>;
  id?: Yap['id'] | undefined;
}) {
  return (
    <div
      className='fixed left-0 top-0 flex h-dvh w-dvw items-center justify-center bg-zinc-950/50'
      onClick={() => setPostVisible(false)}
    >
      <div className='rounded-lg bg-gradient-to-br from-yap-red-500 to-rose-700 p-[1px]'>
        <div
          className='flex w-[400px] flex-col gap-2 rounded-lg bg-zinc-100 px-8 py-6 shadow-md dark:bg-zinc-900'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex justify-between'>
            <header className='text-3xl font-medium text-zinc-950 dark:text-zinc-100'>
              {id ? 'Reply to a yap!' : 'Yap something!'}
            </header>
            <Button
              variant='ghost'
              className='p-1'
              onClick={() => setPostVisible(false)}
            >
              <IoIosClose
                size='2rem'
                className='text-zinc-950 dark:text-zinc-100'
              />
            </Button>
          </div>
          {id ? <ReplyPostForm id={id} /> : <CreatePostForm />}
        </div>
      </div>
    </div>
  );
}

export default PostPopup;
