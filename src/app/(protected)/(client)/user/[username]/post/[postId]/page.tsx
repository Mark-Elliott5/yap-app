import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  return {
    title: `@${params.username}'s Post | yap`,
    description: `@${params.username}'s Post | yap`,
  };
}

function YapPostPage() {
  return null;
}

export default YapPostPage;
