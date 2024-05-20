import { Metadata } from 'next';
import Link from 'next/link';

import EchoYapPost from '@/src/components/yap/EchoYapPost';
import OlderPostsLink from '@/src/components/yap/OlderPostsLink';
import TheresNothingHere from '@/src/components/yap/TheresNothingHere';
import { getUserProfileEchoes } from '@/src/lib/database/fetch';
import { getCurrentUsername } from '@/src/lib/database/getUser';

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  return {
    title: `@${params.username}'s Echoes | yap`,
    description: `@${params.username}'s Echoes | yap`,
  };
}

async function UserProfileEchoesPage({
  params,
  searchParams,
}: {
  params: { username: string };
  searchParams: {
    date?: string;
    id?: string;
  };
}) {
  const { date, id } = searchParams;
  const currentData = getCurrentUsername();
  const yapData = getUserProfileEchoes(params.username, date, id);

  const [currentUsername, { echoes, error }] = await Promise.all([
    currentData,
    yapData,
  ]);

  if (!currentUsername) return null;

  const posts = (async () => {
    if (error) {
      return (
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          {error}
        </p>
      );
    }

    if (!echoes || !echoes.length) {
      if (date || id) {
        return (
          <span
            className={`flex w-full flex-col gap-2 rounded-lg border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-5 py-4 text-center text-sm italic shadow-xl sm:text-base dark:border-zinc-800 dark:bg-zinc-900`}
          >
            {`You've reached the end!`}
          </span>
        );
      }
      return <TheresNothingHere />;
    }

    return (
      <>
        {echoes.map((echo) => (
          <EchoYapPost
            key={echo.id}
            currentUsername={currentUsername}
            {...echo}
          />
        ))}

        <OlderPostsLink
          length={echoes.length}
          date={echoes[echoes.length - 1].date}
          id={echoes[echoes.length - 1].id}
        />
      </>
    );
  })();

  return (
    <>
      <div className='flex gap-2 overflow-x-scroll px-[9px] py-[6px] text-sm text-zinc-950 sm:gap-4 sm:px-[unset] sm:py-[unset] sm:text-base md:overflow-x-visible md:text-lg lg:text-xl dark:text-zinc-100'>
        <Link
          href={`.`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Latest
        </Link>
        <Link
          href={`./yaps`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Yaps
        </Link>
        <Link
          href={``}
          className='rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'
        >
          Echoes
        </Link>
        <Link
          href={`./media`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Media
        </Link>
        <Link
          href={`./likes`}
          className='px-4 py-2 backdrop-blur-sm transition-all hover:scale-[1.2]'
        >
          Likes
        </Link>
      </div>
      {posts}
    </>
  );
}

export default UserProfileEchoesPage;
