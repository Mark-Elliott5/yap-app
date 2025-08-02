import { RenderPostsParams } from '@/src/app/(protected)/(client)/user/[username]/[[...filter]]/page';
import EndOfList from '@/src/components/yap/EndOfList';
import ListElement from '@/src/components/yap/ListElement';
import OlderPostsLink from '@/src/components/yap/post/OlderPostsLink';
import SomethingWentWrong from '@/src/components/yap/SomethingWentWrong';
import UserTab from '@/src/components/yap/users/UserTab';
import { getFollowing } from '@/src/lib/database/fetch';

async function FollowingList({ username, id }: RenderPostsParams) {
  const { following, error } = await getFollowing(username, id);

  if (error) {
    return <SomethingWentWrong />;
  }

  if (!following || !following.length) {
    if (id) return <EndOfList />;
    return (
      <ListElement className='text-center italic'>
        @{username} is not following anyone.
      </ListElement>
    );
  }
  return (
    <>
      {following.map((user) => (
        <UserTab key={user.username} {...user} />
      ))}

      <OlderPostsLink
        length={following.length}
        id={following[following.length - 1].id}
        typeText='Followings'
      />
    </>
  );
}

export default FollowingList;
