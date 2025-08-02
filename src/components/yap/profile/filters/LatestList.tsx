import { RenderPostsParams } from '@/src/app/(protected)/(client)/user/[username]/[[...filter]]/page';
import EndOfList from '@/src/components/yap/EndOfList';
import EchoYapPost from '@/src/components/yap/post/EchoYapPost';
import OlderPostsLink from '@/src/components/yap/post/OlderPostsLink';
import YapPost from '@/src/components/yap/post/YapPost';
import SomethingWentWrong from '@/src/components/yap/SomethingWentWrong';
import TheresNothingHere from '@/src/components/yap/TheresNothingHere';
import { getUserProfileYapsAndEchoes } from '@/src/lib/database/fetch';

async function LatestList({
  currentUsername,
  username,
  date,
  id,
}: RenderPostsParams) {
  const { posts, error } = await getUserProfileYapsAndEchoes(
    username,
    date,
    id
  );

  if (error) {
    return <SomethingWentWrong />;
  }

  if (!posts || !posts.length) {
    if (date || id) return <EndOfList />;
    return <TheresNothingHere />;
  }

  return (
    <>
      {/* {date && id && <NewerPostsLink date={posts[0].date} id={posts[0].id} />} */}
      {posts.map((post) => {
        if (post.type === 'Echo') {
          return (
            <EchoYapPost
              key={post.id}
              currentUsername={currentUsername}
              {...post}
            />
          );
        }

        return (
          <YapPost key={post.id} currentUsername={currentUsername} {...post} />
        );
      })}

      <OlderPostsLink
        length={posts.length}
        date={posts[posts.length - 1].date}
        id={posts[posts.length - 1].id}
      />
    </>
  );
}

export default LatestList;
