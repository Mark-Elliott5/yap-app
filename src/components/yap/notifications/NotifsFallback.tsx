import { Skeleton } from '@/src/components/ui/skeleton';

function NotifsFallback() {
  return (
    <Skeleton
      className={`rounded-lg border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-5 py-4 shadow-xl transition-transform hover:scale-[1.05] dark:border-zinc-800 dark:bg-zinc-900`}
    >
      <div className='top-0 flex items-center justify-between gap-2'>
        <div className='flex items-center gap-4'>
          <Skeleton className='h-4 w-4 rounded-full' />
          <Skeleton className='h-6 w-6 shrink-0 overflow-hidden rounded-full sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12' />
          <Skeleton className='h-4 w-[80px]' />
          <Skeleton className='h-4 w-[120px]' />
        </div>
        <Skeleton className='h-4 w-[60px]' />
      </div>
    </Skeleton>
  );
}

export default NotifsFallback;
