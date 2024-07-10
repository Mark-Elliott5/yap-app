import { Metadata } from 'next';

import SettingsClient from '@/src/components/yap/settings/SettingsClient';
import { getSession } from '@/src/lib/database/getUser';

export const metadata: Metadata = {
  title: `Settings | yap`,
  description: 'Settings Page | yap',
};

export const dynamic = 'force-dynamic';

async function Settings() {
  const session = await getSession();
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
