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
import { User, Yap } from '@prisma/client';

interface YapProps
  extends Pick<Yap, 'text' | 'image' | 'date' | 'id' | 'isReply'> {
  author: Pick<User, 'displayName' | 'username' | 'image' | 'joinDate'>;
  parentYap:
    | ({
        author: Pick<User, 'displayName' | 'username' | 'image' | 'joinDate'>;
      } & Pick<Yap, 'id'>)
    | null;
  _count: {
    likes: number;
    echoes: number;
    replies: number;
  };
}

/* in practice, author.username will never actually be null, because users 
  will be redirected to an onboarding page if it is, and will not be able to 
  use server actions either (can't post, etc.) */

function YapPost({
  author,
  text,
  image,
  date,
  _count,
  parentYap,
  isReply,
  id,
}: YapProps) {
  return (
    <div className='flex flex-col gap-2 border-b-1 border-zinc-400 px-5 py-4 dark:border-zinc-950'>
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
        <Link
          href={`/user/${author.username}/post/${id}`}
          className='text-xs text-zinc-600'
        >
          {new Date(date).toLocaleDateString() +
            ' ' +
            new Date(date).toLocaleTimeString()}
        </Link>
      </div>
      {parentYap && (
        <Link
          href={`/user/${parentYap.author.username}/post/${parentYap.id}`}
          className='text-sm text-zinc-600'
        >
          ╰{' '}
          <span className='hover:underline'>
            in reply to @{parentYap.author.username}
          </span>
        </Link>
      )}
      {isReply && !parentYap && (
        <span className='text-sm text-zinc-600'>
          ╰ in reply to a deleted yap
        </span>
      )}
      <div className='flex flex-col gap-2 py-2'>
        {text && <p className='text-zinc-950 dark:text-zinc-100'>{text}</p>}

        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt='post image'
            className='max-h-[500px] w-full rounded-md object-cover'
          />
        )}
      </div>
      <div className='flex items-center gap-16'>
        <LikeButton liked={false} likes={_count.likes} />
        <EchoButton echoed={false} echoes={_count.echoes} />
        <ReplyButton id={id} replies={_count.replies} />
      </div>
    </div>
  );
}

export default YapPost;
