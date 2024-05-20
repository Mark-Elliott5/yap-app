import Link from 'next/link';
import { TbRotate2 } from 'react-icons/tb';

function OlderPostsLink({
  length,
  id,
  date,
  typeText,
}: {
  length: number;
  id: string | number;
  date?: string | Date;
  typeText?: string;
}) {
  if (length < 20) {
    return (
      <div>
        <span className='flex max-w-fit cursor-default items-center gap-2 rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900'>{`You've reached the end!`}</span>
      </div>
    );
  }
  return (
    <div className=''>
      <Link
        href={`?${id ? `id=${id}&` : ''}${date ? (typeof date === 'string' ? `date=${date}` : `date=${date.toISOString()}`) : ''}`}
        className='flex max-w-fit items-center gap-2 rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900'
      >
        Load Older {typeText ? typeText : 'Posts'}
        <TbRotate2 className='inline-block' size={'1.25rem'} />
      </Link>
    </div>
  );
}

export default OlderPostsLink;
