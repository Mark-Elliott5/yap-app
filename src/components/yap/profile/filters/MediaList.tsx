import { RenderPostsParams } from '@/src/app/(protected)/(client)/user/[username]/[[...filter]]/page';
import EndOfList from '@/src/components/yap/EndOfList';
import OlderPostsLink from '@/src/components/yap/post/OlderPostsLink';
import YapPost from '@/src/components/yap/post/YapPost';
import SomethingWentWrong from '@/src/components/yap/SomethingWentWrong';
import TheresNothingHere from '@/src/components/yap/TheresNothingHere';
import { getUserProfileMedia } from '@/src/lib/database/fetch';

async function MediaList({
  currentUsername,
  username,
  date,
  id,
}: RenderPostsParams) {
  const { yaps, error } = await getUserProfileMedia(username, date, id);

  if (error) {
    return <SomethingWentWrong />;
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
      />
    </>
  );
}

export default MediaList;
