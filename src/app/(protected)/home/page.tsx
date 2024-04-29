import { auth } from '@/src/app/api/auth/[...nextauth]/auth';
import HomeApp from '@/src/components/home/HomeApp';

async function Home() {
  const session = await auth();
  // Will not evaluate to undefined, because they would have been redirected if so.
  const { username, displayName, image, joinDate } = session!.user as {
    username: string;
    displayName: string | null;
    image: string | null;
    // OAuth: boolean;
    joinDate: Date;
  };
  const user = {
    username,
    displayName,
    image,
    // OAuth,
    joinDate,
  };

  return <HomeApp {...user} />;
}

export default Home;
