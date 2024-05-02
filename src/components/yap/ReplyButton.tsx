'use client';
import { useState } from 'react';
import { FaReply } from 'react-icons/fa';

import PostPopup from '@/src/components/yap/PostPopup';
import { Yap } from '@prisma/client';

function ReplyButton({ id }: { id: Yap['id'] }) {
  const [postVisible, setPostVisible] = useState(false);

  return (
    <>
      <button
        className='w-unset p-0 text-left text-2xl text-zinc-950 dark:text-zinc-100'
        onClick={() => setPostVisible((prev) => !prev)}
      >
        <FaReply className='text-yap-blue-500' />
      </button>
      {postVisible && <PostPopup setPostVisible={setPostVisible} id={id} />}
    </>
  );
}

export default ReplyButton;
