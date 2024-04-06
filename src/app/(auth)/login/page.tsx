import CardWrapper from '@/components/CardWrapper';
import LoginForm from '@/components/LoginForm';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: `Login | Yap`,
  description: 'Yap Social Media App',
};

function LoginPage() {
  return (
    <CardWrapper
      cardDescription={'Login'}
      backButtonLabel={'Need to register? Click here.'}
      backButtonHref={'/register'}
      showOAuth={true}
    >
      <LoginForm />
    </CardWrapper>
  );
}

export default LoginPage;
