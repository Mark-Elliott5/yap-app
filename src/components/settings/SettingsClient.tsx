'use client';
import { useState } from 'react';
import { Archivo_Black } from 'next/font/google';

import ChangeAvatarForm from '@/src/components/settings/ChangeAvatarForm';
import ChangeDisplayNameForm from '@/src/components/settings/ChangeDisplayNameForm';
import ChangeEmailForm from '@/src/components/settings/ChangeEmailForm';
import ChangePasswordForm from '@/src/components/settings/ChangePasswordForm';
import DeleteAccountForm from '@/src/components/settings/DeleteAccountForm';
import { cn } from '@/src/lib/utils';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
});

function SettingsClient({
  username,
  displayName,
  image,
}: {
  username: string;
  displayName: string | null;
  image: string | null;
}) {
  const [updatedUser, setUser] = useState<{
    displayName: string | null;
    image: string | null;
  }>({
    displayName: null,
    image: null,
  });
  const [page, setPage] = useState<
    'displayName' | 'email' | 'password' | 'avatar' | 'delete'
  >('displayName');

  const currentPage = (() => {
    switch (page) {
      case 'displayName':
        return <ChangeDisplayNameForm setUser={setUser} />;
      case 'email':
        return <ChangeEmailForm />;
      case 'password':
        return <ChangePasswordForm />;
      case 'avatar':
        return <ChangeAvatarForm setUser={setUser} />;
      case 'delete':
        return <DeleteAccountForm />;
    }
  })();

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
            alt={`${updatedUser.displayName ?? displayName}'s avatar`}
            src={updatedUser.image ?? image ?? '/defaultavatar.svg'}
          />
          <span>{username}</span>
          {updatedUser.displayName ? (
            <span>{`(${updatedUser.displayName})`}</span>
          ) : displayName ? (
            <span>{`(${displayName})`}</span>
          ) : null}
        </div>
      </nav>
      <div className='flex'>
        <div className='flex flex-col p-10'>
          <button className='text-white' onClick={() => setPage('displayName')}>
            Display Name
          </button>
          <button className='text-white' onClick={() => setPage('email')}>
            Email
          </button>
          <button className='text-white' onClick={() => setPage('password')}>
            Password
          </button>
          <button className='text-white' onClick={() => setPage('avatar')}>
            Avatar
          </button>
          <button className='text-white' onClick={() => setPage('delete')}>
            Delete Account
          </button>
        </div>
        <main className='flex-1'>{currentPage}</main>
      </div>
    </>
    //     {/* <div className='text-white'>{JSON.stringify(session)}</div> */}
    // // <LogoutButton className='text-white' />
    // {/* <UploadButton endpoint='avatarUploader' /> */}
  );
}

export default SettingsClient;
