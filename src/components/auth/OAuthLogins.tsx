'use client';
import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';

// import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/src/components/ui/button';
import { DEFAULT_LOGIN_REDIRECT } from '@/src/routes';

function OAuthLogins() {
  const handleSignIn = (provider: 'github') => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <>
      {/* <Button size='lg' className='w-full' variant='outline' onClick={() => {}}>
        <FcGoogle size={'1.5em'} className='' />
      </Button> */}
      <Button
        size='lg'
        className='w-full'
        variant='outline'
        onClick={() => {
          handleSignIn('github');
        }}
      >
        <FaGithub size={'1.5em'} className='' />
      </Button>
    </>
  );
}

export default OAuthLogins;
