import Link from 'next/link';

import YapPost from '@/src/components/yap/YapPost';
import {
  getUserProfile,
  getUserProfileYapsAndEchoes,
} from '@/src/lib/database/fetch';
import { getCurrentUserId } from '@/src/lib/database/getUser';

async function UserProfileYapsAndEchoesPage({
  params,
}: {
  params: { username: string };
}) {
  const userId = await getCurrentUserId();
  if (!userId) return null;

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

    if (
      !yapsAndEchoes ||
      !yapsAndEchoes.echoes ||
      !yapsAndEchoes.yaps ||
      (!yapsAndEchoes.echoes.length && !yapsAndEchoes.yaps.length)
    ) {
      return (
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          No media yet!
        </p>
      );
    }

    const yaps = (() => {
      const temp = [...yapsAndEchoes.yaps, ...yapsAndEchoes.echoes];
      temp.sort((a, b) => b.date.getTime() - a.date.getTime());
      return temp;
    })();

    return yaps.map((yap) => (
      // don't know I have to put non null assertion operator
      <YapPost
        key={yap.id}
        userId={userId}
        author={userResponse.user!}
        {...yap}
      />
    ));
  })();

  return (
    <>
      <div className='flex bg-zinc-200 text-xl text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100'>
        <Link href={``} className='rounded-tr-md bg-zinc-900 px-4 py-2'>
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
