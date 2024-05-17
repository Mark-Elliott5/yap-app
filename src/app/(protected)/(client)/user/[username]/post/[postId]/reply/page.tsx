import { Metadata } from 'next';

import ReplyPostForm from '@/src/components/yap/ReplyPostForm';
import { getCurrentUsername } from '@/src/lib/database/getUser';

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  return {
    title: `Reply to @${params.username} | yap`,
    description: `Reply to @${params.username} | yap`,
  };
}

async function ReplyPage({
  params,
}: {
  params: { username: string; postId: string };
}) {
  const currentUsername = await getCurrentUsername();

  return (
    <div className='rounded-lg border-x-[0.5px] border-t-1 border-zinc-200 bg-white p-10 shadow-xl dark:border-zinc-800 dark:bg-zinc-900'>
      <header className='mb-6 text-2xl font-medium text-zinc-950 dark:text-zinc-100'>
        ╰ Replying to {params.username}...{' '}
      </header>
      <ReplyPostForm currentUser={currentUsername} id={params.postId} />
    </div>
  );
}

export default ReplyPage;
