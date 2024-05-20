import { Suspense } from 'react';
import { Metadata } from 'next';

import OlderPostsLink from '@/src/components/yap/OlderPostsLink';
import SomethingWentWrong from '@/src/components/yap/SomethingWentWrong';
import TheresNothingHere from '@/src/components/yap/TheresNothingHere';
import UsersFallback from '@/src/components/yap/UsersFallback';
import UserTab from '@/src/components/yap/UserTab';
import { getUsers } from '@/src/lib/database/fetch';

export const metadata: Metadata = {
  title: `Users | yap`,
  description: 'Users Page | yap',
};

async function Users({ searchParams }: { searchParams: { id: string } }) {
  const { id } = searchParams;
  const { users, error } = await getUsers(id);

  const posts = (() => {
    if (error) {
      return <SomethingWentWrong />;
    }

    if (!users || !users.length) {
      if (id) {
        return (
          <span
            className={`flex w-full flex-col gap-2 rounded-lg border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-5 py-4 text-center text-sm italic shadow-xl sm:text-base dark:border-zinc-800 dark:bg-zinc-900`}
          >
            {`You've reached the end!`}
          </span>
        );
      }
      return <TheresNothingHere />;
    }

    return (
      <>
        {users.map((user) => (
          <UserTab key={user.username} {...user} />
        ))}

        <OlderPostsLink length={users.length} id={users[users.length - 1].id} />
      </>
    );
  })();

  return (
    <>
      <div className='my-4 flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <header className='cursor-default rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'>
          Users
        </header>
      </div>
      <div className='flex min-h-dvh flex-col gap-4'>
        <Suspense
          fallback={Array.from({ length: 10 }).map((_, i) => (
            <UsersFallback key={i} />
          ))}
        >
          {posts}
        </Suspense>
      </div>
    </>
  );
}

export default Users;
