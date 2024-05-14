import { Skeleton } from '@/src/components/ui/skeleton';

function UsersFallback() {
  return (
    <Skeleton
      className={`rounded-lg border-t-1 border-zinc-100 bg-white px-5 py-4 shadow-xl transition-all hover:scale-[1.05] dark:border-zinc-800 dark:bg-zinc-900`}
    >
      <div className='top-0 flex items-center justify-between gap-2'>
        <div className='flex items-center gap-4'>
          <Skeleton className='h-10 w-10 shrink-0 overflow-hidden rounded-full' />
          <Skeleton className='h-4 w-[80px]' />
        </div>
        <Skeleton className='h-4 w-[50px]' />
      </div>
    </Skeleton>
  );
}

export default UsersFallback;
