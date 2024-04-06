import CardWrapper from '@/components/CardWrapper';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: `Register | Yap`,
  description: 'Yap Social Media App',
};

function LoginPage({ children }: { children: React.ReactNode }) {
  return (
    <CardWrapper
      cardDescription={'Register'}
      backButtonLabel={'Login using Yap or other platforms here.'}
      backButtonHref={'/login'}
      showOAuth={false}
    >
      {/* <RegisterForm></RegisterForm> */}
      {children}
    </CardWrapper>
  );
}

export default LoginPage;
