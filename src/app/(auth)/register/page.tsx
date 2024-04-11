import { Metadata } from 'next/types';

import AuthCardWrapper from '@/src/components/auth/AuthCardWrapper';
import RegisterForm from '@/src/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: `Register | yap`,
  description: 'yap Social Media App',
};

function RegisterPage() {
  return (
    <AuthCardWrapper
      cardDescription={'Register'}
      backButtonLabel={'Already have an account?'}
      backButtonHref={'/login'}
      showOAuth={true}
    >
      <RegisterForm />
    </AuthCardWrapper>
  );
}

export default RegisterPage;
