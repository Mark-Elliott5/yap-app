import { Archivo_Black } from 'next/font/google';

import { Separator } from '@/src/components/ui/separator';
import { Skeleton } from '@/src/components/ui/skeleton';
import { cn } from '@/src/lib/utils';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
});

function Loading() {
  return (
    <div className='h-full bg-zinc-50 dark:bg-zinc-900'>
      <div className='sticky flex items-center justify-between px-4 py-2'>
        <a
          href='/'
          className={cn('text-3xl text-yap-red-500', archivoBlack.className)}
        >
          yap
        </a>
        <div className='flex items-center gap-2 text-white'>
          <Skeleton className='h-4 w-[100px]' />
          <Skeleton className='h-4 w-[130px]' />
          <Skeleton className='h-6 w-6 rounded-full' />
        </div>
      </div>
      <Separator className='bg-gradient-to-r from-yap-red-500 to-orange-500' />
    </div>
  );
}

export default Loading;
