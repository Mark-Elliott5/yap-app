import { getUserByUsername } from '@/src/lib/database/getUser';

async function Profile({
  params,
  children,
}: Readonly<{
  params: { username: string };
  children: React.ReactNode;
}>) {
  const profile = await getUserByUsername(params.username);
  return (
    <div>
      <p>{params.username}</p>
      <div>{children}</div>
    </div>
  );
}

export default Profile;
