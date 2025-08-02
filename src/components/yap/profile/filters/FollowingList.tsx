import { RenderPostsParams } from '@/src/app/(protected)/(client)/user/[username]/[[...filter]]/page';
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
    if (id) {
      return (
        <span
          className={`flex w-full flex-col gap-2 rounded-lg border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-5 py-4 text-center text-sm italic shadow-xl sm:text-base dark:border-zinc-800 dark:bg-zinc-900`}
        >
          {`You've reached the end!`}
        </span>
      );
    }
    return (
      <span
        className={`flex w-full flex-col gap-2 rounded-lg border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-5 py-4 text-center text-sm italic shadow-xl sm:text-base dark:border-zinc-800 dark:bg-zinc-900`}
      >
        @{username} is not following anyone.
      </span>
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
