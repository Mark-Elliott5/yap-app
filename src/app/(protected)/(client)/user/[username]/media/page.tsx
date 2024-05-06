import YapPost from '@/src/components/yap/YapPost';
import { getUserProfile, getUserProfileMedia } from '@/src/lib/database/fetch';

async function UserProfileMediaPage({
  params,
}: {
  params: { username: string; media: string };
}) {
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
      <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
        Something went wrong! Try again.
      </p>
    );
  }
  const { yaps, error } = await getUserProfileMedia(params.username);

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
    // don't know I have to put non null assertion operator
    <YapPost key={yap.id} author={userResponse.user!} {...yap} />
  ));
}

export default UserProfileMediaPage;
