import { Archivo_Black } from 'next/font/google';
import Link from 'next/link';

import { Separator } from '@/src/components/ui/separator';
import { Skeleton } from '@/src/components/ui/skeleton';
import { cn } from '@/src/lib/utils';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
});

function Loading() {
  return (
    <div className='h-dvh'>
      <div className='sticky flex items-center justify-between px-4 py-2'>
        <Link
          prefetch={false}
          href='/'
          className={cn('text-3xl text-yap-red-500', archivoBlack.className)}
        >
          yap
        </Link>
        <div className='flex items-center gap-2 text-zinc-100'>
          <Skeleton className='h-4 w-[100px]' />
          <Skeleton className='h-4 w-[130px]' />
          <Skeleton className='h-10 w-10 rounded-full' />
          <Skeleton className='h-6 w-6' />
        </div>
      </div>
      <Separator className='bg-gradient-to-r from-yap-red-500 to-rose-700' />
      <div className='m-auto flex w-full max-w-[600px] flex-col gap-6 p-10 sm:w-5/6 md:w-2/3 lg:w-1/2'>
        <header className='text-3xl font-medium text-zinc-950 dark:text-zinc-100'>
          Settings
        </header>
        <Skeleton className='h-10 w-full sm:w-[220px]' />

        <div>
          <div className='flex flex-col gap-2 pb-6'>
            <Skeleton className='h-6 w-[82px]' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div>
            <Skeleton className='h-10 w-full' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
