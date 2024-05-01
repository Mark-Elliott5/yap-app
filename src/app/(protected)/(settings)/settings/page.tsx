import { auth } from '@/src/app/api/auth/[...nextauth]/auth';
import SettingsClient from '@/src/components/settings/SettingsClient';

async function Settings() {
  const session = await auth();
  // Will not evaluate to undefined, because they would have been redirected if so.
  const { username, displayName, image, OAuth, joinDate, email } = session!
    .user as {
    email: string;
    username: string;
    displayName: string | null;
    image: string | null;
    OAuth: boolean;
    joinDate: Date;
  };
  const user = {
    email,
    username,
    displayName,
    image,
    OAuth,
    joinDate,
  };

  return <SettingsClient {...user} />;
}

export default Settings;
