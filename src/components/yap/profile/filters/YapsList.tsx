import { RenderPostsParams } from '@/src/app/(protected)/(client)/user/[username]/[[...filter]]/page';
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
    if (date || id) {
      return (
        <span
          className={`flex w-full flex-col gap-2 rounded-lg border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-5 py-4 text-center text-sm italic shadow-xl sm:text-base dark:border-zinc-800 dark:bg-zinc-900`}
        >
          {`You've reached the end!`}
        </span>
      );
    }
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
