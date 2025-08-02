import { RenderPostsParams } from '@/src/app/(protected)/(client)/user/[username]/[[...filter]]/page';
import EndOfList from '@/src/components/yap/EndOfList';
import ListElement from '@/src/components/yap/ListElement';
import OlderPostsLink from '@/src/components/yap/post/OlderPostsLink';
import SomethingWentWrong from '@/src/components/yap/SomethingWentWrong';
import UserTab from '@/src/components/yap/users/UserTab';
import { getFollowers } from '@/src/lib/database/fetch';

async function FollowersList({ username, id }: RenderPostsParams) {
  const { followers, error } = await getFollowers(username, id);

  if (error) return <SomethingWentWrong />;

  if (!followers || !followers.length) {
    if (id) return <EndOfList />;
    return (
      <ListElement className='text-center italic'>
        @{username} has no followers.
      </ListElement>
    );
  }

  return (
    <>
      {followers.map((user) => (
        <UserTab key={user.username} {...user} />
      ))}

      <OlderPostsLink
        length={followers.length}
        id={followers[followers.length - 1].id}
        typeText='Followers'
      />
    </>
  );
}

export default FollowersList;
