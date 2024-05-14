import Link from 'next/link';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import AutoMention from '@/src/components/yap/AutoMention';
import UserHovercard from '@/src/components/yap/UserHovercard';
import { User, Yap } from '@prisma/client';

export interface ParentYapPreviewProps
  extends Pick<Yap, 'text' | 'image' | 'date' | 'id' | 'isReply'> {
  author: Pick<User, 'displayName' | 'username' | 'image' | 'joinDate'>;
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
  id,
}: ParentYapPreviewProps) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border-1 border-zinc-300 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900`}
    >
      <div className='flex items-center justify-between'>
        <UserHovercard
          username={author.username!}
          joinDate={author.joinDate}
          displayName={author.displayName}
          image={author.image}
        >
          <div className='top-0 flex items-center gap-2'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={author.image ?? ''} />
              <AvatarFallback>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`${author.displayName ?? author.username}'s avatar`}
                  src={'/defaultavatar.svg'}
                />
              </AvatarFallback>
            </Avatar>
            {author.displayName && (
              <span className='text-xs text-zinc-950 sm:text-sm dark:text-zinc-100'>
                {author.displayName}
              </span>
            )}
            {author.username && (
              <span
                className={
                  author.displayName
                    ? 'text-xs text-zinc-600 sm:text-sm'
                    : 'text-xs text-zinc-950 sm:text-sm dark:text-zinc-100'
                }
              >
                @{author.username}
              </span>
            )}
          </div>
        </UserHovercard>
        <Link
          href={`/user/${author.username}/post/${id}`}
          className='flex items-center gap-2 text-xs text-zinc-600/70'
        >
          {date.toLocaleDateString()}
          <span className='hidden text-xs sm:inline-block'>
            {date.toLocaleTimeString()}
          </span>
        </Link>
      </div>
      <Link
        href={`/user/${author.username}/post/${id}`}
        className='flex flex-col gap-2 py-2'
      >
        {text && (
          <p className='text-xs text-zinc-950 sm:text-sm dark:text-zinc-100'>
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
      </Link>
    </div>
  );
}

export default ParentYapPreview;
