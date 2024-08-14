import Link from 'next/link';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import AutoMention from '@/src/components/yap/post/AutoMention';
import ClientLocaleDate from '@/src/components/yap/post/ClientLocaleDate';
import ClientLocaleTime from '@/src/components/yap/post/ClientLocaleTime';
import ZoomPostImage from '@/src/components/yap/post/ZoomPostImage';
import UserHovercard from '@/src/components/yap/UserHovercard';
import { PrismaParentYapPost } from '@/src/lib/database/fetch';

export interface ParentYapPreviewProps
  extends Omit<PrismaParentYapPost, 'date'> {
  date: string | Date;
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
      <div className='flex flex-wrap items-center justify-between gap-y-3'>
        <UserHovercard
          username={author.username!}
          joinDate={author.joinDate}
          displayName={author.displayName}
          image={author.image}
        >
          <div className='top-0 flex flex-wrap items-center gap-2 gap-y-3'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={author.image ?? ''} />
              <AvatarFallback>
                <img
                  alt={`${author.displayName ?? author.username}'s avatar`}
                  src={'/images/defaultavatar.svg'}
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
          prefetch={false}
          href={`/user/${author.username}/post/${id}`}
          className='flex flex-wrap items-center gap-2 gap-y-3 text-xs text-zinc-600/70'
        >
          <ClientLocaleDate date={date} />
          <span className='hidden text-xs sm:inline-block'>
            <ClientLocaleTime date={date} />
          </span>
        </Link>
      </div>
      {text && (
        <p className='text-xs text-zinc-950 sm:text-sm dark:text-zinc-100'>
          <AutoMention text={text} />
        </p>
      )}

      {image && <ZoomPostImage image={image} />}
    </div>
  );
}

export default ParentYapPreview;
