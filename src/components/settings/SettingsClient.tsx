'use client';
import { useState } from 'react';
import { Archivo_Black } from 'next/font/google';

// import { useMediaQuery } from 'react-responsive';
import LogoutButton from '@/src/components/auth/LogoutButton';
import ChangeAvatarForm from '@/src/components/settings/ChangeAvatarForm';
import ChangeBioForm from '@/src/components/settings/ChangeBioForm';
import ChangeDisplayNameForm from '@/src/components/settings/ChangeDisplayNameForm';
import ChangeEmailForm from '@/src/components/settings/ChangeEmailForm';
import ChangePasswordForm from '@/src/components/settings/ChangePasswordForm';
import DeleteAccountForm from '@/src/components/settings/DeleteAccountForm';
import SettingsDropDown from '@/src/components/SettingsDropDown';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
// import { Label } from '@/src/components/ui/label';
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
import UserHovercard from '@/src/components/UserHovercard';
import { cn } from '@/src/lib/utils';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
});

type PageValues =
  | 'displayName'
  | 'email'
  | 'password'
  | 'avatar'
  | 'delete'
  | 'bio'
  | 'privacy';

function SettingsClient({
  username,
  displayName,
  image,
  OAuth,
  joinDate,
}: {
  username: string;
  displayName: string | null;
  image: string | null;
  OAuth: boolean;
  joinDate: Date;
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
      case 'bio':
        return <ChangeBioForm />;
      case 'privacy':
        return <></>;
    }
  })();

  return (
    <div className='h-full'>
      <nav className='sticky flex items-center justify-between px-4 py-2'>
        <a
          href='/home'
          className={cn('text-3xl text-yap-red-500', archivoBlack.className)}
        >
          yap
        </a>
        <div className='flex gap-3'>
          <UserHovercard
            username={username}
            joinDate={joinDate}
            displayName={updatedUser.displayName ?? displayName}
            image={updatedUser.image ?? image}
            // self={true}
          >
            <div className='flex items-center gap-3 text-zinc-100'>
              <div className='flex flex-col sm:flex-row sm:gap-2'>
                <span
                  className='max-w-36 truncate text-sm text-zinc-950 sm:max-w-44 sm:text-base dark:text-zinc-100'
                  title={username}
                >
                  @{username}
                </span>
                {(updatedUser?.displayName ?? displayName) && (
                  <span
                    className='max-w-36 truncate text-sm font-light text-zinc-500 sm:max-w-44 sm:text-base dark:text-zinc-400'
                    title={updatedUser?.displayName ?? displayName!}
                  >
                    {updatedUser?.displayName ?? displayName}
                  </span>
                )}
              </div>
              <Avatar>
                <AvatarImage
                  src={updatedUser.image ?? image ?? ''}
                  height={'1.5rem'}
                />
                <AvatarFallback>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={`${updatedUser.displayName ?? displayName ?? username}'s avatar`}
                    src={'/defaultavatar.svg'}
                  />
                </AvatarFallback>
              </Avatar>
            </div>
          </UserHovercard>
          <SettingsDropDown />
        </div>
      </nav>
      <Separator className='bg-gradient-to-r from-yap-red-500 to-rose-700' />
      <div className='m-auto flex w-full max-w-[600px] flex-col gap-6 p-10 sm:w-5/6 md:w-2/3 lg:w-1/2'>
        <header className='text-3xl font-medium text-zinc-950 dark:text-zinc-100'>
          Settings
        </header>
        <div className=''>
          <Select onValueChange={(value: PageValues) => setPage(value)}>
            <SelectTrigger className='w-full text-zinc-950 sm:w-[220px] dark:text-zinc-100'>
              {/* <Sel>Settings</SelectLabel> */}
              <SelectValue placeholder='Modify...' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className='text-left font-bold'>
                  Profile
                </SelectLabel>
                <SelectItem value='displayName'>Display Name</SelectItem>
                <SelectItem value='avatar'>Avatar</SelectItem>
                <SelectItem value='bio'>Bio</SelectItem>
                <SelectItem value='email'>Email</SelectItem>
                <SelectItem value='password'>Password</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel className='text-left font-bold'>
                  Account
                </SelectLabel>
                <SelectItem value='privacy'>Privacy</SelectItem>
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
        <main className=''>{currentPage}</main>
      </div>
      <LogoutButton
        className='fixed bottom-8 right-8 max-w-44 rounded-md border-1 border-gray-300 bg-black px-2 font-medium text-zinc-100 dark:bg-zinc-100 dark:text-zinc-950'
        // username={username}
      />
    </div>
  );
  //     {/* <div className='text-zinc-100'>{JSON.stringify(session)}</div> */}
  // // <LogoutButton className='text-zinc-100' />
  // {/* <UploadButton endpoint='avatarUploader' /> */}
}

export default SettingsClient;
