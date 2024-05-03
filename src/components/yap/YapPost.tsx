// import LocaleDateString from '@/src/components/LocaleDateString';
import Link from 'next/link';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import UserHovercard from '@/src/components/UserHovercard';
import EchoButton from '@/src/components/yap/EchoButton';
import LikeButton from '@/src/components/yap/LikeButton';
import ReplyButton from '@/src/components/yap/ReplyButton';
import abbreviateNum from '@/src/lib/abbreviateNum';
import { User, Yap } from '@prisma/client';

interface YapProps extends Pick<Yap, 'text' | 'image' | 'date' | 'id'> {
  author: Pick<User, 'displayName' | 'username' | 'image' | 'joinDate'>;
  parentYap:
    | ({
        author: Pick<User, 'displayName' | 'username' | 'image' | 'joinDate'>;
      } & Pick<Yap, 'id'>)
    | null;
  _count: {
    likes: number;
    echoes: number;
  };
}

{
  /* in practice, author.username will never actually be null, because users 
  will be redirected to an onboarding page if it is, and will not be able to 
  use server actions either (can't post, etc.) */
}

function YapPost({
  author,
  text,
  image,
  date,
  _count,
  parentYap,
  id,
}: YapProps) {
  return (
    <div className='flex flex-col gap-2 border-b-1 border-zinc-600 px-5 py-4'>
      <div className='flex items-center gap-2'>
        <UserHovercard
          username={author.username!}
          joinDate={author.joinDate}
          displayName={author.displayName}
          image={author.image}
          // self={true}
        >
          <div className='flex items-center gap-2'>
            <Avatar>
              <AvatarImage src={author.image ?? ''} height={'1.5rem'} />
              <AvatarFallback>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`${author.displayName ?? author.username}'s avatar`}
                  src={'/defaultavatar.svg'}
                />
              </AvatarFallback>
            </Avatar>
            {author.displayName && (
              <span className='text-zinc-950 dark:text-zinc-100'>
                {author.displayName}
              </span>
            )}
            {author.username && (
              <span
                className={
                  author.displayName
                    ? 'text-zinc-600'
                    : 'text-zinc-950 dark:text-zinc-100'
                }
              >
                @{author.username}
              </span>
            )}
          </div>
        </UserHovercard>
        <Link href={`/post/${id}`} className='text-xs text-zinc-600'>
          {new Date(date).toLocaleDateString() +
            ' ' +
            new Date(date).toLocaleTimeString()}
        </Link>
      </div>
      {parentYap && (
        <Link href={`/post/${parentYap.id}`} className='text-sm text-zinc-600'>
          in reply to @{parentYap.author.username}
        </Link>
      )}
      <div className='py-2'>
        {text && <p className='text-zinc-950 dark:text-zinc-100'>{text}</p>}

        {image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={image} alt='post image' />
        )}
      </div>
      <div className='flex items-center gap-16'>
        <div className='flex cursor-default items-center gap-1 text-zinc-950 dark:text-zinc-100'>
          <LikeButton liked={false} />
          <span>{abbreviateNum(_count.likes)}</span>
        </div>
        <div className='flex cursor-default items-center gap-1 text-zinc-950 dark:text-zinc-100'>
          <EchoButton echoed={false} />
          <span>{abbreviateNum(_count.echoes)}</span>
        </div>
        <ReplyButton id={id} />
      </div>
    </div>
  );
}

export default YapPost;
