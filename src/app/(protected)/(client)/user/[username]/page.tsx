import Link from 'next/link';

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
  const username = await getCurrentUsername();
  if (!username) return null;

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
      const echoes = (() => {
        const arr = [];
        for (let i = 0; i < yapsAndEchoes.echoes.length; i++) {
          arr.push({ ...yapsAndEchoes.echoes[i], isEcho: true });
        }
        return arr;
      })();
      const temp = [...yapsAndEchoes.yaps, ...echoes];
      temp.sort((a, b) => {
        // necessary to make echoes appear after original tweet,
        // incase author is the one echoing
        const time = b.date.getTime() - a.date.getTime();
        return time === 0 ? -1 : time;
      });
      return temp;
    })();

    return yaps.map((yap) => (
      // don't know I have to put non null assertion operator
      <YapPost key={yap.id} username={username} {...yap} />
    ));
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
