import { Metadata } from 'next';

import CreatePostForm from '@/src/components/yap/form/CreatePostForm';
import { getCurrentUsername } from '@/src/lib/database/getUser';

export const metadata: Metadata = {
  title: `Post | yap`,
  description: 'Post Page | yap',
};

async function PostPage() {
  const currentUsername = await getCurrentUsername();

  return (
    <>
      <div className='my-4 flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <header className='rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'>
          Post
        </header>
      </div>
      <div className='rounded-lg border-x-[0.5px] border-t-1 border-zinc-200 bg-white p-10 shadow-xl dark:border-zinc-800 dark:bg-zinc-900'>
        <CreatePostForm currentUser={currentUsername} />
      </div>
    </>
  );
}

export default PostPage;
