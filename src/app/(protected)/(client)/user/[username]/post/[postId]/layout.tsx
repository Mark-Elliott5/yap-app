import YapPost from '@/src/components/yap/YapPost';
import { getYap } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function YapPostLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { username: string; postId: string };
}>) {
  // getCurrentUsername cannot use cache function (see module top level comment)
  // it also doesn't need to be cached because all instances of its calling will
  // be inside a page.tsx file. There will be nothing to dedupe.
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) return null;

  const { yap, error } = await getYap(params.postId);
  if (error) {
    console.log('ERROR', error);
    return (
      <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
        Something went wrong! Please try again.
      </p>
    );
  }
  if (!yap) {
    return (
      <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
        {`*crickets* There's nothing here.`}
      </p>
    );
  }

  return (
    <>
      <YapPost currentUsername={currentUsername} {...yap} />
      {children}
      <div className='mx-6 flex flex-col gap-4'>
        {yap.replies.map((yap) => (
          <YapPost
            key={yap.id}
            parentYap={'thread'}
            currentUsername={currentUsername}
            {...yap}
          />
        ))}
      </div>
    </>
  );
}

export default YapPostLayout;
