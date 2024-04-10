import { Metadata } from 'next/types';

import AuthCardWrapper from '@/components/auth/AuthCardWrapper';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: `Register | Yap`,
  description: 'Yap Social Media App',
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
