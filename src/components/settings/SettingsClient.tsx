'use client';
import { useState } from 'react';
import { Archivo_Black } from 'next/font/google';
import { useMediaQuery } from 'react-responsive';

import LogoutButton from '@/src/components/auth/LogoutButton';
import ChangeAvatarForm from '@/src/components/settings/ChangeAvatarForm';
import ChangeDisplayNameForm from '@/src/components/settings/ChangeDisplayNameForm';
import ChangeEmailForm from '@/src/components/settings/ChangeEmailForm';
import ChangePasswordForm from '@/src/components/settings/ChangePasswordForm';
import DeleteAccountForm from '@/src/components/settings/DeleteAccountForm';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Separator } from '@/src/components/ui/separator';
import { cn } from '@/src/lib/utils';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
});

type PageValues = 'displayName' | 'email' | 'password' | 'avatar' | 'delete';

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
  const [page, setPage] = useState<PageValues>('displayName');

  const smallScreen = useMediaQuery({
    query: '(min-width: 640px)',
  });

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

  return smallScreen ? (
    <div className='h-full bg-white dark:bg-zinc-900'>
      <nav className='sticky flex items-center justify-between px-4 py-2'>
        <a
          href='/'
          className={cn('text-3xl text-yap-red-500', archivoBlack.className)}
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
          <span className='text-md font-medium text-black dark:text-white'>
            {username}
          </span>
          {updatedUser.displayName ? (
            <span className='text-md font-medium italic text-black dark:text-white'>
              {updatedUser.displayName}
            </span>
          ) : displayName ? (
            <span className='text-md font-light italic text-black dark:text-white'>
              {displayName}
            </span>
          ) : null}
        </div>
      </nav>
      <Separator className='bg-gradient-to-r from-yap-red-500 to-orange-500' />
      <div className='flex flex-col gap-6 p-10 sm:flex-row'>
        <div className='flex flex-col justify-between sm:gap-2 sm:px-6 md:gap-3 md:px-8 lg:gap-4 lg:px-10'>
          <button
            className='text-md font-medium text-black dark:text-white'
            onClick={() => setPage('displayName')}
          >
            Display Name
          </button>
          <button
            className='text-md font-medium text-black dark:text-white'
            onClick={() => setPage('email')}
          >
            Email
          </button>
          <button
            className='text-md font-medium text-black dark:text-white'
            onClick={() => setPage('password')}
          >
            Password
          </button>
          <button
            className='text-md font-medium text-black dark:text-white'
            onClick={() => setPage('avatar')}
          >
            Avatar
          </button>
          <button
            className='text-md font-medium text-yap-red-500'
            onClick={() => setPage('delete')}
          >
            Delete Account
          </button>
          <LogoutButton className='text-md rounded-md border-1 border-gray-300 bg-white font-medium text-black ' />
        </div>
        {/* <Separator orientation='vertical' className='bg-gray-300' /> */}
        <main className='w-3/4'>{currentPage}</main>
      </div>
    </div>
  ) : (
    <div className='h-full bg-white dark:bg-zinc-950'>
      <nav className='sticky flex items-center justify-between px-4 py-2'>
        <a
          href='/'
          className={cn('text-3xl text-yap-red-500', archivoBlack.className)}
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
          <span className='text-md font-medium text-black dark:text-white'>
            {username}
          </span>
          {updatedUser.displayName ? (
            <span className='text-md font-medium italic text-black dark:text-white'>
              {updatedUser.displayName}
            </span>
          ) : displayName ? (
            <span className='text-md font-light italic text-black dark:text-white'>
              {displayName}
            </span>
          ) : null}
        </div>
      </nav>
      <Separator className='bg-gradient-to-r from-yap-red-500 to-orange-500' />
      <div className='flex flex-col gap-6 p-10 sm:flex-row'>
        <Select onValueChange={(value: PageValues) => setPage(value)}>
          <SelectTrigger className='w-[180px] text-black dark:text-white'>
            <SelectValue placeholder='Modify...' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='displayName'>Display Name</SelectItem>
              <SelectItem value='email'>Email</SelectItem>
              <SelectItem value='password'>Password</SelectItem>
              <SelectItem value='avatar'>Avatar</SelectItem>
              <SelectItem
                value='delete'
                className='text-yap-red-500 focus:text-yap-red-500 dark:focus:text-yap-red-500'
              >
                Delete Account
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* <Separator orientation='vertical' className='bg-gray-300' /> */}
        <main className='w-3/4'>{currentPage}</main>
      </div>
    </div>
  );
  //     {/* <div className='text-white'>{JSON.stringify(session)}</div> */}
  // // <LogoutButton className='text-white' />
  // {/* <UploadButton endpoint='avatarUploader' /> */}
}

export default SettingsClient;
