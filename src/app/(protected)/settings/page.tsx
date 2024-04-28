import { auth } from '@/src/app/api/auth/[...nextauth]/auth';
import SettingsClient from '@/src/components/settings/SettingsClient';

async function Settings() {
  const session = await auth();
  // Will not evaluate to undefined, because they would have been redirected if so.
  const { username, displayName, image, OAuth } = session!.user as {
    username: string;
    displayName: string | null;
    image: string | null;
    OAuth: boolean;
  };
  const user = {
    username,
    displayName,
    image,
    OAuth,
  };

  return <SettingsClient {...user} />;
}

export default Settings;
