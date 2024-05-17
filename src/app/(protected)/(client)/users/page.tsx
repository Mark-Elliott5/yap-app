import { Suspense } from 'react';
import { Metadata } from 'next';

import UsersFallback from '@/src/components/yap/UsersFallback';
import UserTab from '@/src/components/yap/UserTab';
import { getUsers } from '@/src/lib/database/fetch';

export const metadata: Metadata = {
  title: `Users | yap`,
  description: 'Users Page | yap',
};

async function Users() {
  const { users, error } = await getUsers();

  const posts = (() => {
    if (error || !users || !users.length) {
      return (
        <p className='text-zinc-950 dark:text-zinc-100'>
          Something went wrong! Please reload the page.
        </p>
      );
    }

    return users.map((user) => <UserTab key={user.username} {...user} />);
  })();

  return (
    <>
      <div className='my-4 flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <header className='cursor-default rounded-md border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'>
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
