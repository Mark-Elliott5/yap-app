import { Archivo_Black } from 'next/font/google';

import { auth } from '@/src/app/api/auth/[...nextauth]/auth';
import LogoutButton from '@/src/components/auth/LogoutButton';
import { UploadButton } from '@/src/lib/uploadthing';
import { cn } from '@/src/lib/utils';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
});

async function Settings() {
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
          {/* <div className='rounded-full bg-white'> */}
          <img
            className='w-6 rounded-sm'
            alt={`${session?.user.displayName}'s avatar`}
            src={session?.user.image ?? '/defaultavatar.svg'}
          ></img>
          {/* </div> */}
          <span>{session?.user.username}</span>
        </div>
      </nav>
      <div className='text-white'>{JSON.stringify(session)}</div>
      <LogoutButton className='text-white' />
      <UploadButton endpoint='avatarUploader' />
    </>
  );
}

export default Settings;
