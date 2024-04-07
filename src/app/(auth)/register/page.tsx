import CardWrapper from '@/components/auth/AuthCardWrapper';
import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: `Register | Yap`,
  description: 'Yap Social Media App',
};

function LoginPage() {
  return (
    <CardWrapper
      cardDescription={'Register'}
      backButtonLabel={'Already have an account?'}
      backButtonHref={'/login'}
      showOAuth={false}
    >
      <RegisterForm />
    </CardWrapper>
  );
}

export default LoginPage;
