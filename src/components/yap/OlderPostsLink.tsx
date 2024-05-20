import Link from 'next/link';
import { TbRotate2 } from 'react-icons/tb';

function OlderPostsLink({
  length,
  id,
  date,
}: {
  length: number;
  id: string;
  date: string | Date;
}) {
  if (length < 20) {
    return (
      <div>
        <span className='cursor-default rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900'>{`You've reached the end!`}</span>
      </div>
    );
  }
  return (
    <div className=''>
      <Link
        href={`?date=${typeof date === 'string' ? date : date.toISOString()}&id=${id}`}
        className='flex max-w-fit items-center gap-2 rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900'
      >
        Load Older Posts
        <TbRotate2 className='inline-block' size={'1.25rem'} />
      </Link>
    </div>
  );
}

export default OlderPostsLink;
