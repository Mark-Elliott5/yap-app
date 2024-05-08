import Link from 'next/link';

import EchoYapPost from '@/src/components/yap/EchoYapPost';
import YapPost from '@/src/components/yap/YapPost';
import {
  getUserProfile,
  getUserProfileYapsAndEchoes,
} from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function UserProfileYapsAndEchoesPage({
  params,
}: {
  params: { username: string };
}) {
  // get currently logged in user to check if this user has liked/echoed/replied
  // YapPost via its child Like/Echo/Reply button components
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) return null;

  const child = (async () => {
    const userResponse = await getUserProfile(params.username);
    if (userResponse.error) {
      return (
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          Something went wrong! Try again.
        </p>
      );
    }
    if (!userResponse.user || !userResponse) {
      return null;
    }
    const { yapsAndEchoes, error } = await getUserProfileYapsAndEchoes(
      params.username
    );

    if (error) {
      return (
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          {error}
        </p>
      );
    }

    if (!yapsAndEchoes) return null;

    const { yaps, echoes } = yapsAndEchoes;

    if (!echoes || !yaps || (!echoes.length && !yaps.length)) {
      return (
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          {`*crickets* There's nothing here.`}
        </p>
      );
    }

    const posts = (() => {
      const temp = [...yaps, ...echoes];
      temp.sort((a, b) => b.date.getTime() - a.date.getTime());
      return temp;
    })();

    return posts.map((yap) => {
      if ('yap' in yap) {
        return (
          <EchoYapPost
            key={yap.id}
            currentUsername={currentUsername}
            {...yap}
          />
        );
      }

      return (
        <YapPost key={yap.id} currentUsername={currentUsername} {...yap} />
      );
    });
  })();

  return (
    <>
      <div className='flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <Link
          href={``}
          className='rounded-md border-t-1 border-zinc-100 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'
        >
          Yaps & Echoes
        </Link>
        <Link
          href={`${params.username}/yaps`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Yaps
        </Link>
        <Link
          href={`${params.username}/media`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Media
        </Link>
      </div>
      {child}
    </>
  );
}

export default UserProfileYapsAndEchoesPage;
