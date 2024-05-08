import { Archivo_Black } from 'next/font/google';
import Link from 'next/link';

import { Separator } from '@/src/components/ui/separator';
import { cn } from '@/src/lib/utils';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
});

function NotFound() {
  return (
    <div className='flex min-h-dvh items-center justify-center'>
      <div className='flex flex-row items-center gap-6'>
        <Link
          href='/home'
          className={cn('text-8xl text-yap-red-500', archivoBlack.className)}
        >
          yap
        </Link>
        <Separator
          orientation='vertical'
          className='h-[275px] w-[1px] bg-gradient-to-t from-zinc-900 via-zinc-600 to-zinc-900 text-white'
        />
        <div className='flex flex-col justify-center gap-4'>
          <div>
            <header
              className={cn(
                'text-6xl text-yap-red-500',
                archivoBlack.className
              )}
            >
              404
            </header>
            <h2 className='text-zinc-50'>Not Found</h2>
          </div>
          <Link href='/home' className='text-zinc-50 hover:underline'>
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
