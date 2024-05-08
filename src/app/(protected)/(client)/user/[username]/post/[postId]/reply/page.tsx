import ReplyPostForm from '@/src/components/yap/ReplyPostForm';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function ReplyPage({
  params,
}: {
  params: { username: string; postId: string };
}) {
  const currentUsername = await getCurrentUsername();
  return (
    <div className='mx-6 rounded-lg border-t-1 border-zinc-100 bg-white p-10 shadow-xl dark:border-zinc-800 dark:bg-zinc-900'>
      <header className='mb-6 text-2xl font-medium text-zinc-950 dark:text-zinc-100'>
        ╰ Replying to {params.username}...{' '}
      </header>
      <ReplyPostForm currentUser={currentUsername} id={params.postId} />
    </div>
  );
}

export default ReplyPage;
