import { RenderPostsParams } from '@/src/app/(protected)/(client)/user/[username]/[[...filter]]/page';
import EchoYapPost from '@/src/components/yap/post/EchoYapPost';
import OlderPostsLink from '@/src/components/yap/post/OlderPostsLink';
import TheresNothingHere from '@/src/components/yap/TheresNothingHere';
import { getUserProfileEchoes } from '@/src/lib/database/fetch';

async function EchoesList({
  currentUsername,
  username,
  date,
  id,
}: RenderPostsParams) {
  const { echoes, error } = await getUserProfileEchoes(username, date, id);

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
        typeText='Echoes'
      />
    </>
  );
}

export default EchoesList;
