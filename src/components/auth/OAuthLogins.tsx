import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';

function OAuthLogins() {
  return (
    <>
      <Button size='lg' className='w-full' variant='outline' onClick={() => {}}>
        <FcGoogle size={'1.5em'} className='' />
      </Button>
      <Button size='lg' className='w-full' variant='outline' onClick={() => {}}>
        <FaApple size={'1.5em'} className='' />
      </Button>
    </>
  );
}

export default OAuthLogins;
