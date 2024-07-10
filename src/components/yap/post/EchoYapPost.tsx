import Link from 'next/link';
import { TbAccessPoint } from 'react-icons/tb';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import AutoMention from '@/src/components/yap/post/AutoMention';
import DeleteButton from '@/src/components/yap/post/buttons/DeleteButton';
import EchoButton from '@/src/components/yap/post/buttons/EchoButton';
import LikeButton from '@/src/components/yap/post/buttons/LikeButton';
import ReplyButton from '@/src/components/yap/post/buttons/ReplyButton';
import ClientLocaleDate from '@/src/components/yap/post/ClientLocaleDate';
import ClientLocaleTime from '@/src/components/yap/post/ClientLocaleTime';
import ParentYapPreview from '@/src/components/yap/post/ParentYapPreview';
import ZoomPostImage from '@/src/components/yap/post/ZoomPostImage';
import UserHovercard from '@/src/components/yap/UserHovercard';
import { getEchoed, getLiked, PrismaEchoPost } from '@/src/lib/database/fetch';

interface EchoProps extends PrismaEchoPost {
  currentUsername: string;
}
// const a: PrismaEchoPost = {};
/* in practice, author.username will never actually be null, because users 
  will be redirected to an onboarding page if it is, and will not be able to 
  use server actions either (can't post, etc.) */

async function EchoYapPost({
  yap,
  currentUsername,
  date,
  username,
}: EchoProps) {
  const liked = await getLiked(yap.id, currentUsername);
  const echoed = await getEchoed(yap.id, currentUsername);
  return (
    <div
      className={`flex w-full flex-col gap-2 rounded-lg border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-5 py-4 text-sm shadow-xl sm:text-base dark:border-zinc-800  dark:bg-zinc-900`}
    >
      <Link
        href={`/user/${username}/`}
        className='flex flex-wrap items-center justify-between gap-y-3 text-xs text-zinc-600'
      >
        <div>
          <span>╭ </span>
          <span className='text-xs'>@{username} echoed... </span>
        </div>
        <div className='flex items-center gap-2 text-zinc-600/70'>
          <span className='text-xs'>
            <ClientLocaleDate date={date} />
          </span>
          <span className='hidden text-xs sm:inline-block'>
            <ClientLocaleTime date={date} />
          </span>
          <TbAccessPoint
            size='1.25rem'
            className={'text-yap-peri-500 drop-shadow-echo'}
          />
        </div>
      </Link>
      <div className='flex flex-col gap-2 rounded-lg border-1 border-zinc-300 px-5 py-4 dark:border-zinc-800'>
        <div
          className={`flex flex-wrap items-center justify-between gap-y-3 ${yap.isReply && 'mb-2'}`}
        >
          <UserHovercard
            username={yap.author.username!}
            joinDate={yap.author.joinDate}
            displayName={yap.author.displayName}
            image={yap.author.image}
          >
            <div className='flex flex-wrap items-center gap-2 gap-y-3'>
              <Avatar>
                <AvatarImage src={yap.author.image ?? ''} height={'1.5rem'} />
                <AvatarFallback>
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
            className='flex items-center gap-2 text-xs text-zinc-600/70'
          >
            <ClientLocaleDate date={yap.date} />
            <span className='hidden text-xs sm:inline-block'>
              <ClientLocaleTime date={yap.date} />
            </span>
          </Link>
        </div>
        {yap.parentYap && (
          <>
            <ParentYapPreview
              {...yap.parentYap}
              currentUsername={currentUsername}
            />
            <Link
              href={`/user/${yap.parentYap.author.username}/post/${yap.parentYap.id}`}
              className='text-xs text-zinc-600 sm:text-sm'
            >
              ╰{' '}
              <span className='hover:underline'>
                in reply to @{yap.parentYap.author.username}
              </span>
            </Link>
          </>
        )}
        {yap.isReply && !yap.parentYap && (
          <span className='text-xs text-zinc-600 sm:text-sm'>
            ╰ in reply to a deleted yap
          </span>
        )}
        <div className='flex flex-col gap-2 py-2'>
          {yap.text && (
            <p className='text-zinc-950 dark:text-zinc-100'>
              <AutoMention text={yap.text} />
            </p>
          )}

          {yap.image && <ZoomPostImage image={yap.image} />}
        </div>
        <div className='flex flex-wrap items-center gap-[16%] gap-y-3'>
          <LikeButton id={yap.id} liked={liked} likes={yap._count.likes} />
          <EchoButton id={yap.id} echoed={echoed} echoes={yap._count.echoes} />
          <ReplyButton
            id={yap.id}
            user={yap.author.username}
            replies={yap._count.replies}
          />
          {yap.author.username === currentUsername && (
            <DeleteButton id={yap.id} />
          )}
        </div>
      </div>
    </div>
  );
}

export default EchoYapPost;
