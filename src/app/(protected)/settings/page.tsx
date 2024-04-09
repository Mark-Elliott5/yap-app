import { auth } from '@/auth';
import SignOutButton from '@/components/auth/SignOutButton';

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
