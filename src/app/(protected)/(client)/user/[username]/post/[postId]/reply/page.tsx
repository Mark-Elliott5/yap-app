import ReplyPostForm from '@/src/components/yap/ReplyPostForm';

function ReplyPage({
  params,
}: {
  params: { username: string; postId: string };
}) {
  return (
    <div className='px-10 pb-10 pt-6'>
      <header className='mb-6 text-2xl font-medium text-zinc-950 dark:text-zinc-100'>
        ╰ Replying to {params.username}...{' '}
      </header>
      <ReplyPostForm id={params.postId} />
    </div>
  );
}

export default ReplyPage;
