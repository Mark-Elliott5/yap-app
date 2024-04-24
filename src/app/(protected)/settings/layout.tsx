import { Archivo_Black } from 'next/font/google';

import { auth } from '@/src/app/api/auth/[...nextauth]/auth';
import { cn } from '@/src/lib/utils';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
});

async function SettingsNavBar({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  console.log('SETTINGS SESSION AUTH() CALL');
  const session = await auth();

  return (
    <>
      <nav className='sticky flex items-center justify-between border-b-1 px-4 py-2'>
        <a
          href='/'
          className={cn('text-2xl text-yap-red-500', archivoBlack.className)}
        >
          yap
        </a>
        <div className='flex items-center gap-2 text-white'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className='w-6 rounded-sm'
            alt={`${session?.user.displayName}'s avatar`}
            src={session?.user.image ?? '/defaultavatar.svg'}
          />
          <span>{session?.user.username}</span>
        </div>
      </nav>
      {children}
    </>
  );
}

export default SettingsNavBar;
