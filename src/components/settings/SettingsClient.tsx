'use client';
import { useState } from 'react';
import { Archivo_Black } from 'next/font/google';

// import { useMediaQuery } from 'react-responsive';
import LogoutButton from '@/src/components/auth/LogoutButton';
import ChangeAvatarForm from '@/src/components/settings/ChangeAvatarForm';
import ChangeDisplayNameForm from '@/src/components/settings/ChangeDisplayNameForm';
import ChangeEmailForm from '@/src/components/settings/ChangeEmailForm';
import ChangePasswordForm from '@/src/components/settings/ChangePasswordForm';
import DeleteAccountForm from '@/src/components/settings/DeleteAccountForm';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { Label } from '@/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
  OAuth,
}: {
  username: string;
  displayName: string | null;
  image: string | null;
  OAuth: boolean;
}) {
  const [updatedUser, setUser] = useState<{
    displayName: string | null;
    image: string | null;
  }>({
    displayName: null,
    image: null,
  });
  const [page, setPage] = useState<PageValues>('displayName');

  const currentPage = (() => {
    switch (page) {
      case 'displayName':
        return <ChangeDisplayNameForm setUser={setUser} />;
      case 'email':
        return <ChangeEmailForm OAuth={OAuth} />;
      case 'password':
        return <ChangePasswordForm OAuth={OAuth} />;
      case 'avatar':
        return <ChangeAvatarForm setUser={setUser} />;
      case 'delete':
        return <DeleteAccountForm />;
    }
  })();

  return (
    <div className='h-full bg-zinc-50 dark:bg-zinc-900'>
      <nav className='sticky flex items-center justify-between px-4 py-2'>
        <a
          href='/'
          className={cn('text-3xl text-yap-red-500', archivoBlack.className)}
        >
          yap
        </a>
        <div className='flex items-center gap-3 text-white'>
          <div className='flex flex-col sm:flex-row sm:gap-2'>
            <span
              className='max-w-36 truncate text-sm text-black dark:text-white sm:max-w-44 sm:text-base'
              title={username}
            >
              @{username}
            </span>
            <span
              className='max-w-36 truncate text-sm font-light text-zinc-500 dark:text-zinc-400 sm:max-w-44 sm:text-base'
              title={updatedUser?.displayName ?? displayName ?? ''}
            >
              {updatedUser?.displayName ?? displayName ?? ''}
            </span>
          </div>
          <Avatar>
            <AvatarImage
              src={updatedUser.image ?? image ?? ''}
              height={'1.5rem'}
            />
            <AvatarFallback>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`${updatedUser.displayName ?? displayName}'s avatar`}
                src={'/defaultavatar.svg'}
              />
            </AvatarFallback>
          </Avatar>
        </div>
      </nav>
      <Separator className='bg-gradient-to-r from-yap-red-500 to-orange-500' />
      <div className='flex flex-col gap-6 p-10 sm:flex-row'>
        <div className='flex flex-col gap-2'>
          <Label className='text-base text-black dark:text-white'>
            Settings
          </Label>
          <Select onValueChange={(value: PageValues) => setPage(value)}>
            <SelectTrigger className='w-full text-black dark:text-white sm:w-[220px]'>
              {/* <Sel>Settings</SelectLabel> */}
              <SelectValue placeholder='Modify...' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Profile</SelectLabel>
                <SelectItem value='displayName'>Display Name</SelectItem>
                <SelectItem value='email'>Email</SelectItem>
                <SelectItem value='password'>Password</SelectItem>
                <SelectItem value='avatar'>Avatar</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Account</SelectLabel>
                <SelectItem
                  value='delete'
                  className='text-yap-red-500 focus:text-yap-red-500 dark:focus:text-yap-red-500'
                >
                  Delete Account
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* <Separator orientation='vertical' className='bg-gray-300' /> */}
        <main className='w-full sm:w-3/4'>{currentPage}</main>
      </div>
      <LogoutButton
        className='fixed bottom-8 right-8 max-w-44 rounded-md border-1 border-gray-300 bg-black px-2 font-medium text-white dark:bg-white dark:text-black'
        // username={username}
      />
    </div>
  );
  //     {/* <div className='text-white'>{JSON.stringify(session)}</div> */}
  // // <LogoutButton className='text-white' />
  // {/* <UploadButton endpoint='avatarUploader' /> */}
}

export default SettingsClient;
