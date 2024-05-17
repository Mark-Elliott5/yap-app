import { Metadata } from 'next/types';

import AuthCardWrapper from '@/src/components/auth/AuthCardWrapper';
import LoginForm from '@/src/components/auth/LoginForm';

export const metadata: Metadata = {
  title: `Login | yap`,
  description: 'Login Page | yap',
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
