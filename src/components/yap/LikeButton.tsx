'use client';
import { useState } from 'react';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';

function LikeButton({
  className,
  liked,
}: {
  className?: string;
  liked: boolean;
}) {
  const [on, setOn] = useState(liked);

  // implement server action here later

  return (
    <button className={className} onClick={() => setOn((prev) => !prev)}>
      {on ? (
        <IoMdHeart
          className={`hover:text-yap-red-500 ${on ? 'text-yap-red-500' : 'text-zinc-600'}`}
        />
      ) : (
        <IoMdHeartEmpty
          className={`hover:text-yap-red-500 ${on ? 'text-yap-red-500' : 'text-zinc-600'}`}
        />
      )}
    </button>
  );
}

export default LikeButton;
