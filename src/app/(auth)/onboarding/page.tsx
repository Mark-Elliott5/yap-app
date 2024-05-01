import { Metadata } from 'next/types';

import AuthCardWrapper from '@/src/components/auth/AuthCardWrapper';
import LogoutButton from '@/src/components/auth/LogoutButton';
import OnboardingForm from '@/src/components/auth/OnboardingForm';

export const metadata: Metadata = {
  title: `Username | yap`,
  description: 'yap Social Media App',
};

function OnboardingPage() {
  return (
    <AuthCardWrapper cardDescription={'Username'} showOAuth={false}>
      <OnboardingForm />
      <LogoutButton className='mt-6 w-full rounded-md bg-yap-red-500 text-sm text-zinc-100' />
    </AuthCardWrapper>
  );
}

export default OnboardingPage;
