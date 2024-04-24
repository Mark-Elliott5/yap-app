'use client';
import { useState } from 'react';

import ChangeAvatarForm from '@/src/components/settings/ChangeAvatarForm';
import ChangeDisplayNameForm from '@/src/components/settings/ChangeDisplayNameForm';
import ChangeEmailForm from '@/src/components/settings/ChangeEmailForm';
import ChangePasswordForm from '@/src/components/settings/ChangePasswordForm';
import DeleteAccountForm from '@/src/components/settings/DeleteAccountForm';

function Settings() {
  const [page, setPage] = useState<
    'displayName' | 'email' | 'password' | 'avatar' | 'delete'
  >('displayName');

  const currentPage = (() => {
    switch (page) {
      case 'displayName':
        return <ChangeDisplayNameForm />;
      case 'email':
        return <ChangeEmailForm />;
      case 'password':
        return <ChangePasswordForm />;
      case 'avatar':
        return <ChangeAvatarForm />;
      case 'delete':
        return <DeleteAccountForm />;
    }
  })();

  return (
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
    //     {/* <div className='text-white'>{JSON.stringify(session)}</div> */}
    // // <LogoutButton className='text-white' />
    // {/* <UploadButton endpoint='avatarUploader' /> */}
  );
}

export default Settings;
