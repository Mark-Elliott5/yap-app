import { Skeleton } from '@/src/components/ui/skeleton';

function PostsFallback() {
  return (
    <div className='flex flex-col gap-4'>
      <Skeleton
        className={`flex w-full flex-col gap-4 rounded-lg border-t-1 border-zinc-100 bg-white p-2 px-5 py-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <Skeleton className='h-4 w-[80px]' />
          </div>
          <Skeleton className='h-4 w-[80px]' />
        </div>
        <Skeleton className='h-4 w-[240px]' />
        <div className='flex items-center gap-16'>
          <Skeleton className='h-6 w-6 rounded-full' />
          <Skeleton className='h-6 w-6 rounded-full' />
          <Skeleton className='h-6 w-6 rounded-full' />
        </div>
      </Skeleton>
      <Skeleton
        className={`flex w-full flex-col gap-4 rounded-lg border-t-1 border-zinc-100 bg-white p-2 px-5 py-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <Skeleton className='h-4 w-[140px]' />
          </div>
          <Skeleton className='h-4 w-[80px]' />
        </div>
        <Skeleton className='h-4 w-[300px]' />
        <Skeleton className='h-4 w-[120px]' />
        <div className='flex items-center gap-16'>
          <Skeleton className='h-6 w-6 rounded-full' />
          <Skeleton className='h-6 w-6 rounded-full' />
          <Skeleton className='h-6 w-6 rounded-full' />
        </div>
      </Skeleton>
      <Skeleton
        className={`flex w-full flex-col gap-4 rounded-lg border-t-1 border-zinc-100 bg-white p-2 px-5 py-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <Skeleton className='h-4 w-[100px]' />
          </div>
          <Skeleton className='h-4 w-[80px]' />
        </div>
        <Skeleton className='h-4 w-[300px]' />
        <Skeleton className='h-4 w-[280px]' />
        <div className='flex items-center gap-16'>
          <Skeleton className='h-6 w-6 rounded-full' />
          <Skeleton className='h-6 w-6 rounded-full' />
          <Skeleton className='h-6 w-6 rounded-full' />
        </div>
      </Skeleton>
      <Skeleton
        className={`flex w-full flex-col gap-4 rounded-lg border-t-1 border-zinc-100 bg-white p-2 px-5 py-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <Skeleton className='h-4 w-[96px]' />
          </div>
          <Skeleton className='h-4 w-[80px]' />
        </div>
        <Skeleton className='h-4 w-[80px]' />
        <div className='flex items-center gap-16'>
          <Skeleton className='h-6 w-6 rounded-full' />
          <Skeleton className='h-6 w-6 rounded-full' />
          <Skeleton className='h-6 w-6 rounded-full' />
        </div>
      </Skeleton>
    </div>
  );
}

export default PostsFallback;
