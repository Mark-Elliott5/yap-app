import { RenderPostsParams } from '@/src/app/(protected)/(client)/user/[username]/[[...filter]]/page';
import EndOfList from '@/src/components/yap/EndOfList';
import OlderPostsLink from '@/src/components/yap/post/OlderPostsLink';
import YapPost from '@/src/components/yap/post/YapPost';
import TheresNothingHere from '@/src/components/yap/TheresNothingHere';
import { getUserProfileLikes } from '@/src/lib/database/fetch';

async function LikesList({
  currentUsername,
  username,
  date,
  id,
}: RenderPostsParams) {
  const { likes, error } = await getUserProfileLikes(username, date, id);

  if (error) {
    return (
      <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
        {error}
      </p>
    );
  }

  if (!likes || !likes.length) {
    if (date || id) return <EndOfList />;
    return <TheresNothingHere />;
  }

  return (
    <>
      {likes.map((like) => (
        <YapPost
          key={like.id}
          currentUsername={currentUsername}
          {...like.yap}
        />
      ))}

      <OlderPostsLink
        length={likes.length}
        date={likes[likes.length - 1].date}
        id={likes[likes.length - 1].id}
        typeText='Likes'
      />
    </>
  );
}

export default LikesList;
