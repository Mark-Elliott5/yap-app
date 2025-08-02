import { RenderPostsParams } from '@/src/app/(protected)/(client)/user/[username]/[[...filter]]/page';
import EndOfList from '@/src/components/yap/EndOfList';
import OlderPostsLink from '@/src/components/yap/post/OlderPostsLink';
import YapPost from '@/src/components/yap/post/YapPost';
import TheresNothingHere from '@/src/components/yap/TheresNothingHere';
import { getUserProfileYaps } from '@/src/lib/database/fetch';

async function YapsList({
  currentUsername,
  username,
  date,
  id,
}: RenderPostsParams) {
  const { yaps, error } = await getUserProfileYaps(username, date, id);

  if (error) {
    return (
      <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
        {error}
      </p>
    );
  }

  if (!yaps || !yaps.length) {
    if (date || id) return <EndOfList />;
    return <TheresNothingHere />;
  }

  return (
    <>
      {yaps.map((yap) => (
        <YapPost key={yap.id} currentUsername={currentUsername} {...yap} />
      ))}

      <OlderPostsLink
        length={yaps.length}
        date={yaps[yaps.length - 1].date}
        id={yaps[yaps.length - 1].id}
        typeText='Yaps'
      />
    </>
  );
}

export default YapsList;
