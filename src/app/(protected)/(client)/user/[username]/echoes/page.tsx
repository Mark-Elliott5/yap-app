import Link from 'next/link';

import EchoYapPost from '@/src/components/yap/EchoYapPost';
import { getUserProfileEchoes } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function UserProfileEchoesPage({
  params,
}: {
  params: { username: string };
}) {
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) return null;

  const child = (async () => {
    const { echoes, error } = await getUserProfileEchoes(params.username);
    if (error) {
      return (
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          {error}
        </p>
      );
    }

    if (!echoes || !echoes.length) {
      return (
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          No likes yet!
        </p>
      );
    }

    return echoes.map((echo) => (
      <EchoYapPost key={echo.id} currentUsername={currentUsername} {...echo} />
    ));
  })();

  return (
    <>
      <div className='flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <Link
          href={`.`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Latest
        </Link>
        <Link
          href={`./yaps`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Yaps
        </Link>
        <Link
          href={``}
          className='rounded-md border-t-1 border-zinc-100 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'
        >
          Echoes
        </Link>
        <Link
          href={`./media`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Media
        </Link>
        <Link
          href={`./likes`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Likes
        </Link>
      </div>
      {child}
    </>
  );
}

export default UserProfileEchoesPage;
