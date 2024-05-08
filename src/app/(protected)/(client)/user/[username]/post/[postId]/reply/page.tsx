import ReplyPostForm from '@/src/components/yap/ReplyPostForm';

function ReplyPage({
  params,
}: {
  params: { username: string; postId: string };
}) {
  return (
    <div className='mx-6 rounded-lg bg-white p-10 shadow-xl dark:bg-zinc-900'>
      <header className='mb-6 text-2xl font-medium text-zinc-950 dark:text-zinc-100'>
        ╰ Replying to {params.username}...{' '}
      </header>
      <ReplyPostForm id={params.postId} />
    </div>
  );
}

export default ReplyPage;
