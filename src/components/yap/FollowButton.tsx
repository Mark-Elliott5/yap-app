'use client';
import { useState } from 'react';

import { followUser } from '@/src/lib/database/actions';

function FollowButton({
  isFollowing,
  userToFollow,
  className,
}: {
  isFollowing: boolean;
  userToFollow: string;
  className?: string;
}) {
  const [following, setFollowing] = useState(isFollowing);

  const handleChange = async (data: FormData) => {
    setFollowing((prev) => !prev);
    const { error } = await followUser(data);
    if (error) setFollowing(following);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleChange(new FormData(e.currentTarget));
      }}
      id='form'
      className={className}
    >
      <input hidden value={userToFollow} readOnly name='username' />
      <button
        className={`transition-all hover:scale-[1.05] active:scale-[0.95] ${following ? 'bg-yap-blue-500 dark:bg-yap-blue-700' : 'bg-yap-blue-400 dark:bg-yap-blue-600'} flex items-center gap-1 rounded-sm px-2 py-1 text-white`}
      >
        {following ? 'Following' : 'Follow'}
      </button>
    </form>
  );
}

export default FollowButton;
