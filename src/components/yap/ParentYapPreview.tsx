import Link from 'next/link';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import AutoMention from '@/src/components/yap/AutoMention';
import EchoButton from '@/src/components/yap/EchoButton';
import LikeButton from '@/src/components/yap/LikeButton';
import ReplyButton from '@/src/components/yap/ReplyButton';
import UserHovercard from '@/src/components/yap/UserHovercard';
import { getEchoed, getLiked } from '@/src/lib/database/fetch';
import { User, Yap } from '@prisma/client';

interface ParentYapPreviewProps
  extends Pick<Yap, 'text' | 'image' | 'date' | 'id' | 'isReply'> {
  author: Pick<User, 'displayName' | 'username' | 'image' | 'joinDate'>;
  _count: {
    likes: number;
    echoes: number;
    replies: number;
  };
  currentUsername: string;
}

/* in practice, author.username will never actually be null, because users 
  will be redirected to an onboarding page if it is, and will not be able to 
  use server actions either (can't post, etc.) */

async function ParentYapPreview({
  author,
  text,
  image,
  date,
  _count,
  id,
  currentUsername,
}: ParentYapPreviewProps) {
  const liked = await getLiked(id, currentUsername);
  const echoed = await getEchoed(id, currentUsername);
  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border-1 border-zinc-100 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900`}
    >
      <div className='flex items-center gap-2'>
        <UserHovercard
          username={author.username!}
          joinDate={author.joinDate}
          displayName={author.displayName}
          image={author.image}
        >
          <div className='top-0 flex items-center gap-2'>
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
          {date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}
        </Link>
      </div>
      <div className='flex flex-col gap-2 py-2'>
        {text && (
          <p className='text-zinc-950 dark:text-zinc-100'>
            <AutoMention text={text} />
          </p>
        )}

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
        <LikeButton id={id} liked={liked} likes={_count.likes} />
        <EchoButton id={id} echoed={echoed} echoes={_count.echoes} />
        <ReplyButton id={id} user={author.username} replies={_count.replies} />
      </div>
    </div>
  );
}

export default ParentYapPreview;