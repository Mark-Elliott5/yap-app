import { auth } from '@/src/app/api/auth/[...nextauth]/auth';
import SettingsClient from '@/src/components/settings/SettingsClient';

async function Settings() {
  const session = await auth();
  // Will not evaluate to undefined, because they will be redirected if true.
  const { username, displayName, image } = session!.user as {
    username: string;
    displayName: string | null;
    image: string | null;
  };
  const user = {
    username,
    displayName,
    image,
  };

  return <SettingsClient {...user} />;
}

export default Settings;
