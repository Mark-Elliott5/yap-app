import { auth } from '@/src/app/api/auth/[...nextauth]/auth';
import LogoutButton from '@/src/components/auth/LogoutButton';

async function Settings() {
  const session = await auth();

  return (
    <div className='text-white'>
      {JSON.stringify(session)}
      <LogoutButton />
    </div>
  );
}

export default Settings;
