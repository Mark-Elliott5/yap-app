import { RenderPostsParams } from '@/src/app/(protected)/(client)/user/[username]/[[...filter]]/page';
import EndOfList from '@/src/components/yap/EndOfList';
import EchoYapPost from '@/src/components/yap/post/EchoYapPost';
import OlderPostsLink from '@/src/components/yap/post/OlderPostsLink';
import SomethingWentWrong from '@/src/components/yap/SomethingWentWrong';
import TheresNothingHere from '@/src/components/yap/TheresNothingHere';
import { getUserProfileEchoes } from '@/src/lib/database/fetch';

async function EchoesList({
  currentUsername,
  username,
  date,
  id,
}: RenderPostsParams) {
  const { echoes, error } = await getUserProfileEchoes(username, date, id);

  if (error) return <SomethingWentWrong />;

  if (!echoes || !echoes.length) {
    if (date || id) return <EndOfList />;
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
