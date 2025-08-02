import Link from 'next/link';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import ListElement from '@/src/components/yap/ListElement';
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
import { getEchoed, getLiked, PrismaYapPost } from '@/src/lib/database/fetch';

interface YapProps extends Omit<PrismaYapPost, 'parentYap'> {
  currentUsername: string;
  parentYap: PrismaYapPost['parentYap'] | 'thread' | null;
}

/* in practice, author.username will never actually be null, because users 
  will be redirected to an onboarding page if it is, and will not be able to 
  use server actions either (can't post, etc.) */

async function YapPost({
  author,
  text,
  image,
  date,
  _count,
  parentYap,
  isReply,
  id,
  currentUsername,
}: YapProps) {
  const liked = await getLiked(id, currentUsername);
  const echoed = await getEchoed(id, currentUsername);
  return (
    <ListElement
      className={
        parentYap === 'thread'
          ? '!rounded-none !rounded-b-lg !rounded-tr-lg'
          : ''
      }
    >
      <div
        className={`flex flex-wrap items-center justify-between gap-y-3 ${isReply && 'mb-2'}`}
      >
        <UserHovercard
          username={author.username!}
          joinDate={author.joinDate}
          displayName={author.displayName}
          image={author.image}
        >
          <div className='top-0 flex flex-wrap items-center gap-2 gap-y-3'>
            <Avatar>
              <AvatarImage src={author.image ?? ''} height={'1.5rem'} />
              <AvatarFallback>
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
          className='flex flex-wrap items-center gap-2 gap-y-3 text-xs text-zinc-600/70'
        >
          <ClientLocaleDate date={date} />
          <span className='hidden text-xs sm:inline-block'>
            <ClientLocaleTime date={date} />
          </span>
        </Link>
      </div>
      {parentYap ? (
        parentYap === 'thread' ? null : (
          <>
            <ParentYapPreview
              {...parentYap}
              currentUsername={currentUsername}
            />
            <Link
              href={`/user/${parentYap.author.username}/post/${parentYap.id}`}
              className='text-xs text-zinc-600 sm:text-sm'
            >
              ╰{' '}
              <span className='hover:underline'>
                in reply to @{parentYap.author.username}
              </span>
            </Link>
          </>
        )
      ) : (
        isReply && (
          <span className='text-xs text-zinc-600 sm:text-sm'>
            ╰ in reply to a deleted yap
          </span>
        )
      )}
      <div className='flex flex-col gap-2 py-2'>
        {text && (
          <p className='text-zinc-950 dark:text-zinc-100'>
            <AutoMention text={text} />
          </p>
        )}

        {image && <ZoomPostImage image={image} />}
      </div>
      <div className='flex flex-wrap items-center gap-[16%] gap-y-3'>
        <LikeButton id={id} liked={liked} likes={_count.likes} />
        <EchoButton id={id} echoed={echoed} echoes={_count.echoes} />
        <ReplyButton id={id} user={author.username} replies={_count.replies} />
        {author.username === currentUsername && <DeleteButton id={id} />}
      </div>
    </ListElement>
  );
}

export default YapPost;
