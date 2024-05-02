'use client';

import { useState } from 'react';

import PostPopup from '@/src/components/yap/PostPopup';

function CreatePostButton() {
  const [postVisible, setPostVisible] = useState(false);

  return (
    <>
      <button
        className='w-unset p-0 text-left text-2xl text-zinc-950 dark:text-zinc-100'
        onClick={() => setPostVisible((prev) => !prev)}
      >
        Post
      </button>
      {postVisible && <PostPopup setPostVisible={setPostVisible} />}
    </>
  );
}

export default CreatePostButton;
