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
import { getEchoed, getLiked } from '@/src/lib/database/fetch';
import { Echo, User, Yap } from '@prisma/client';

interface EchoYapProps extends Pick<Echo, 'date' | 'username'> {
  yap: {
    author: Pick<User, 'displayName' | 'username' | 'image' | 'joinDate'>;
    parentYap:
      | ({
          author: Pick<User, 'username'>;
        } & Pick<Yap, 'id'>)
      | null;
    _count: {
      likes: number;
      echoes: number;
      replies: number;
    };
  } & Pick<Yap, 'text' | 'image' | 'date' | 'id' | 'isReply'>;
  currentUsername: string;
}

/* in practice, author.username will never actually be null, because users 
  will be redirected to an onboarding page if it is, and will not be able to 
  use server actions either (can't post, etc.) */

async function EchoYapPost({
  yap,
  currentUsername,
  date,
  username,
}: EchoYapProps) {
  const liked = await getLiked(yap.id, currentUsername);
  const echoed = await getEchoed(yap.id, currentUsername);
  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border-t-1 border-zinc-100 bg-white px-5 py-4 shadow-xl dark:border-zinc-800  dark:bg-zinc-900`}
    >
      <Link href={`/user/${username}/`} className='text-sm text-zinc-600'>
        ╭{' '}
        <span className='text-xs'>
          @{username} echoed...{' '}
          <span className='text-zinc-600/60'>
            {date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}
          </span>
        </span>
      </Link>
      <div className='flex items-center gap-2'>
        <UserHovercard
          username={yap.author.username!}
          joinDate={yap.author.joinDate}
          displayName={yap.author.displayName}
          image={yap.author.image}
          // self={true}
        >
          <div className='flex items-center gap-2'>
            <Avatar>
              <AvatarImage src={yap.author.image ?? ''} height={'1.5rem'} />
              <AvatarFallback>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={`${yap.author.displayName ?? yap.author.username}'s avatar`}
                  src={'/defaultavatar.svg'}
                />
              </AvatarFallback>
            </Avatar>
            {yap.author.displayName && (
              <span className='text-zinc-950 dark:text-zinc-100'>
                {yap.author.displayName}
              </span>
            )}
            {yap.author.username && (
              <span
                className={
                  yap.author.displayName
                    ? 'text-zinc-600'
                    : 'text-zinc-950 dark:text-zinc-100'
                }
              >
                @{yap.author.username}
              </span>
            )}
          </div>
        </UserHovercard>
        <Link
          href={`/user/${yap.author.username}/post/${yap.id}`}
          className='text-xs text-zinc-600'
        >
          {yap.date.toLocaleDateString() + ' ' + yap.date.toLocaleTimeString()}
        </Link>
      </div>
      {yap.parentYap && (
        <Link
          href={`/user/${yap.parentYap.author.username}/post/${yap.parentYap.id}`}
          className='text-sm text-zinc-600'
        >
          ╰{' '}
          <span className='hover:underline'>
            in reply to @{yap.parentYap.author.username}
          </span>
        </Link>
      )}
      {yap.isReply && !yap.parentYap && (
        <span className='text-sm text-zinc-600'>
          ╰ in reply to a deleted yap
        </span>
      )}
      <div className='flex flex-col gap-2 py-2'>
        {yap.text && (
          <p className='text-zinc-950 dark:text-zinc-100'>{yap.text}</p>
        )}

        {yap.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={yap.image}
            alt='post image'
            className='max-h-[500px] w-full rounded-md object-cover'
          />
        )}
      </div>
      <div className='flex items-center gap-16'>
        <LikeButton id={yap.id} liked={liked} likes={yap._count.likes} />
        <EchoButton id={yap.id} echoed={echoed} echoes={yap._count.echoes} />
        <ReplyButton
          id={yap.id}
          user={yap.author.username}
          replies={yap._count.replies}
        />
      </div>
    </div>
  );
}

export default EchoYapPost;