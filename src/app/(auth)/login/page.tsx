import { Metadata } from 'next/types';

import AuthCardWrapper from '@/components/auth/AuthCardWrapper';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: `Login | Yap`,
  description: 'Yap Social Media App',
};

function LoginPage() {
  return (
    <AuthCardWrapper
      cardDescription={'Login'}
      backButtonLabel={'Need to register? Click here.'}
      backButtonHref={'/register'}
      showOAuth={true}
    >
      <LoginForm />
    </AuthCardWrapper>
  );
}

export default LoginPage;
