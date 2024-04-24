import { Skeleton } from '@/src/components/ui/skeleton';

function Loading() {
  return (
    <div className='sticky flex items-center justify-between border-b-1 px-4 py-2'>
      <Skeleton className='h-[10px] w-[60px] rounded-full' />
      <div className='flex items-center gap-2 text-white'>
        <Skeleton className='h-6 w-6 rounded-sm' />
        <Skeleton className='h-4 w-[200px]' />
      </div>
    </div>
  );
}

export default Loading;
