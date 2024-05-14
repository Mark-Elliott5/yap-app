import Link from 'next/link';
import { TbAccessPoint, TbHeartFilled, TbMessage } from 'react-icons/tb';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { Notification, User } from '@prisma/client';

/* in practice, username will never actually be null, because users 
  will be redirected to an onboarding page if it is, and will not be able to 
  use server actions either (can't post, etc.) */

function NotificationTab({
  author,
  username,
  date,
  type,
  postId,
  authorUsername,
}: Pick<User, 'username'> &
  Pick<Notification, 'type' | 'date' | 'authorUsername' | 'postId'> & {
    author: Pick<User, 'image'>;
  }) {
  return (
    <div
      className={`rounded-lg border-t-1 border-zinc-100 bg-white px-5 py-4 shadow-xl transition-all hover:scale-[1.05] dark:border-zinc-800 dark:bg-zinc-900`}
    >
      <div className='top-0 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {type === 'like' ? (
            <TbHeartFilled className='h-4 w-4 text-yap-red-500 drop-shadow-heart lg:h-5 lg:w-5' />
          ) : type === 'echo' ? (
            <TbAccessPoint className='h-4 w-4 text-yap-peri-500 drop-shadow-echo lg:h-5 lg:w-5' />
          ) : (
            <TbMessage className='h-4 w-4 text-yap-blue-500 drop-shadow-reply lg:h-5 lg:w-5' />
          )}
          <div className='flex items-center gap-1 text-xs text-zinc-950 md:text-sm lg:text-base dark:text-zinc-100'>
            <Link
              href={`/user/${authorUsername}`}
              className='flex items-center gap-2'
            >
              <Avatar className='h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12'>
                <AvatarImage src={author.image ?? ''} />
                <AvatarFallback>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={`${authorUsername}'s avatar`}
                    src={'/defaultavatar.svg'}
                  />
                </AvatarFallback>
              </Avatar>
            </Link>
            <Link
              href={`/user/${username}/post/${postId}`}
              className='hover:underline'
            >
              @{authorUsername}{' '}
              {type === 'like'
                ? 'liked'
                : type === 'echo'
                  ? 'echoed'
                  : 'replied to'}{' '}
              your yap.
            </Link>
          </div>
        </div>
        <span className='text-2xs text-zinc-600 sm:text-xs'>
          {date.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

export default NotificationTab;
