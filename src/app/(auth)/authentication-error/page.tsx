import { Metadata } from 'next/types';
import { TbAlertTriangle } from 'react-icons/tb';

import AuthCardWrapper from '@/src/components/auth/AuthCardWrapper';

export const metadata: Metadata = {
  title: `Error 💔 | yap`,
  description: 'yap Social Media App',
};

function AuthErrorPage() {
  return (
    <AuthCardWrapper
      cardDescription={'Authentication Error'}
      backButtonLabel={'Try again'}
      backButtonHref={'/login'}
      showOAuth={false}
    >
      <div className='flex flex-col items-center gap-y-2 text-balance rounded-md border-1 border-yap-red-500 bg-yap-red-50 p-2 text-center text-yap-red-500'>
        <TbAlertTriangle size='2em' />
        <p>Whoops! There was an error during authentication.</p>
      </div>
    </AuthCardWrapper>
  );
}

export default AuthErrorPage;
