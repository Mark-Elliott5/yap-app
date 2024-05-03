// import LocaleDateString from '@/src/components/LocaleDateString';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import EchoButton from '@/src/components/yap/EchoButton';
import LikeButton from '@/src/components/yap/LikeButton';
import ReplyButton from '@/src/components/yap/ReplyButton';
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
    <div className='flex w-[250px] flex-col'>
      <div className='flex gap-2'>
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
        {author.displayName && <span>{author.displayName}</span>}
        {author.username && <span>{author.username}</span>}
        {/* <LocaleDateString date={date} className='text-zinc-600' /> */}
        <span className='text-zinc-600'>
          {new Date(date).toLocaleDateString()}
        </span>
      </div>
      <div>
        {parentYap && (
          <p>
            in reply to{' '}
            {parentYap.author.displayName ?? `@${parentYap.author.username}`}
          </p>
        )}
        {text && <p>{text}</p>}

        {image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={image} alt='post image' />
        )}
      </div>
      <div className='flex justify-between'>
        <div>
          <LikeButton liked={false} />
          <span>{_count.likes}</span>
        </div>
        <div>
          <EchoButton echoed={false} />
          <span>{_count.echoes}</span>
        </div>
        <ReplyButton id={id} />
      </div>
    </div>
  );
}

export default YapPost;
