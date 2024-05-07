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
          {userResponse.error}
        </p>
      );
    }
    if (!userResponse.user || !userResponse) {
      return (
        // <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
        //   Something went wrong! Try again.
        // </p>
        <></>
      );
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
          No media yet!
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
            echoUsername={yap.username}
            currentUsername={currentUsername}
            echoId={yap.id}
            {...yap.yap}
          />
        );
      }
      // don't know I have to put non null assertion operator
      return (
        <YapPost key={yap.id} currentUsername={currentUsername} {...yap} />
      );
    });
  })();

  return (
    <>
      <div className='flex bg-zinc-200 text-xl text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100'>
        <Link
          href={``}
          className='rounded-tr-md bg-white px-4 py-2 dark:bg-zinc-900'
        >
          Yaps & Echoes
        </Link>
        <Link
          href={`${params.username}/yaps`}
          className='px-4 py-2 hover:opacity-70'
        >
          Yaps
        </Link>
        <Link
          href={`${params.username}/media`}
          className='px-4 py-2 hover:opacity-70'
        >
          Media
        </Link>
      </div>
      {child}
    </>
  );
}

export default UserProfileYapsAndEchoesPage;
