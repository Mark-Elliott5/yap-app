import Link from 'next/link';

import YapPost from '@/src/components/yap/YapPost';
import { getUserProfile, getUserProfileYaps } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function UserProfileYapsPage({
  params,
}: {
  params: { username: string };
}) {
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
    const { yaps, error } = await getUserProfileYaps(params.username);

    if (error) {
      return (
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          {error}
        </p>
      );
    }

    if (!yaps || !yaps.length) {
      return (
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          No media yet!
        </p>
      );
    }

    return yaps.map((yap) => (
      <YapPost key={yap.id} currentUsername={currentUsername} {...yap} />
    ));
  })();

  return (
    <>
      <div className='flex text-xl text-zinc-950 dark:text-zinc-100'>
        <Link
          href={`.`}
          className='px-4 py-2 transition-all hover:scale-[1.2] hover:opacity-70'
        >
          Yaps & Echoes
        </Link>
        <Link
          href={``}
          className='rounded-md bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:bg-zinc-900'
        >
          Yaps
        </Link>
        <Link
          href={`./media`}
          className='px-4 py-2 transition-all hover:scale-[1.2] hover:opacity-70'
        >
          Media
        </Link>
      </div>
      {child}
    </>
  );
}

export default UserProfileYapsPage;
