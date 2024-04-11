import { auth } from '@/src/auth';
import SignOutButton from '@/src/components/auth/SignOutButton';

async function Settings() {
  const session = await auth();

  return (
    <div className='text-white'>
      {JSON.stringify(session)}
      <SignOutButton />
    </div>
  );
}

export default Settings;
