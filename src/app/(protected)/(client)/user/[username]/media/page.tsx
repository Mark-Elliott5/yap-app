import Link from 'next/link';

import YapPost from '@/src/components/yap/YapPost';
import { getUserProfile, getUserProfileMedia } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function UserProfileMediaPage({
  params,
}: {
  params: { username: string; media: string };
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
    const { yaps, error } = await getUserProfileMedia(params.username);

    if (error) {
      return (
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          Something went wrong! Please try again.
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
      // don't know I have to put non null assertion operator
      <YapPost
        key={yap.id}
        currentUsername={currentUsername}
        author={userResponse.user!}
        {...yap}
      />
    ));
  })();

  return (
    <>
      <div className='flex bg-zinc-200 text-xl text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100'>
        <Link href={`.`} className='px-4 py-2 hover:opacity-70'>
          Yaps & Echoes
        </Link>
        <Link href={`./yaps`} className='px-4 py-2 hover:opacity-70'>
          Yaps
        </Link>
        <Link
          href={``}
          className='rounded-t-md bg-white  px-4 py-2 dark:bg-zinc-900'
        >
          Media
        </Link>
      </div>
      {child}
    </>
  );
}

export default UserProfileMediaPage;
