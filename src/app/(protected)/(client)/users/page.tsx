import UserTab from '@/src/components/yap/UserTab';
import { getUsers } from '@/src/lib/database/fetch';

async function Users() {
  const { users, error } = await getUsers();

  if (error) {
    return (
      <p className='text-zinc-950 dark:text-zinc-100'>
        Something went wrong! Please reload the page.
      </p>
    );
  }

  if (!users || !users.length) {
    return (
      <p className='text-zinc-950 dark:text-zinc-100'>
        Something went wrong! Please reload the page.
      </p>
    );
  }

  return (
    <>
      <div className='my-4 flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <header className='rounded-md border-t-1 border-zinc-100 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'>
          Users
        </header>
      </div>
      <div className='flex flex-col gap-4'>
        {users.map((user) => (
          <UserTab key={user.username} {...user} />
        ))}
      </div>
    </>
  );
}

export default Users;
