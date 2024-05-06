import YapPost from '@/src/components/yap/YapPost';
import { getLatestYaps } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

async function Home() {
  // get latest yaps, return fragment of yaps
  // return <></>;
  const username = await getCurrentUsername();
  if (!username) return null;

  const { yaps, error } = await getLatestYaps();
  if (yaps && yaps.length) {
    return yaps.map((yap) => (
      <YapPost key={yap.id} username={username} {...yap} />
    ));
  }

  if (error) {
    return (
      <span className='text-zinc-950 dark:text-zinc-100'>
        Something went wrong! Please reload the page.
      </span>
    );
  }
}

export default Home;
