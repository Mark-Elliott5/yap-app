import { getLatestYaps } from '@/actions/actions';
import YapPost from '@/src/components/yap/YapPost';

async function Home() {
  // get latest yaps, return fragment of yaps
  // return <></>;
  const { yaps, error } = await getLatestYaps();
  if (yaps && yaps.length) {
    return yaps.map((yap) => <YapPost key={yap.id} {...yap} />);
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
