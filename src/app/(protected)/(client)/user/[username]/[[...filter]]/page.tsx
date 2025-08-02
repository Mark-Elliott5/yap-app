import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import PostsFallback from '@/src/components/yap/post/PostsFallback';
import EchoesList from '@/src/components/yap/profile/filters/EchoesList';
import FollowersList from '@/src/components/yap/profile/filters/FollowersList';
import FollowingList from '@/src/components/yap/profile/filters/FollowingList';
import LatestList from '@/src/components/yap/profile/filters/LatestList';
import LikesList from '@/src/components/yap/profile/filters/LikesList';
import MediaList from '@/src/components/yap/profile/filters/MediaList';
import YapsList from '@/src/components/yap/profile/filters/YapsList';
import { getCurrentUsername } from '@/src/lib/database/getUser';

const validPaths = [
  'yaps',
  'echoes',
  'likes',
  'media',
  'followers',
  'following',
  undefined, // Serving as 'Latest' (Yaps + Echoes) when no trailing path.
] as const;

type ValidPath = (typeof validPaths)[number];
type DefinedPath = Exclude<ValidPath, undefined>;

const definedPaths: readonly DefinedPath[] = validPaths.filter(
  (path): path is DefinedPath => path !== undefined
);

function isValidPath(path: string | undefined): path is ValidPath {
  return (
    path === undefined ||
    (!!path && (validPaths as readonly string[]).includes(path))
  );
}

export interface RenderPostsParams {
  currentUsername: string;
  username: string;
  date?: string;
  id?: string;
}

const defaultLinkClass =
  'px-4 py-2 backdrop-blur-sm rounded-md transition-transform hover:scale-[1.2]';

const selectedLinkClass =
  'rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-transform hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900';

export async function generateMetadata({
  params,
}: {
  params: { username: string; filter?: string[] };
}): Promise<Metadata> {
  const titleStr = params.filter?.[0] || 'Latest';
  return {
    title: `@${params.username}'s ${titleStr} | yap`,
    description: `@${params.username}'s ${titleStr} | yap`,
  };
}

async function filterPage({
  params,
  searchParams,
}: {
  params: { username: string; filter?: string[] };
  searchParams: {
    date?: string;
    id?: string;
  };
}) {
  const activeFilter = params.filter?.[0];

  if (!isValidPath(activeFilter)) notFound();

  const { date, id } = searchParams;
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) return null;

  const classMap = definedPaths.reduce(
    (acc, cur) => {
      acc[cur] = cur === activeFilter ? selectedLinkClass : defaultLinkClass;
      return acc;
    },
    {} as Record<
      DefinedPath,
      typeof selectedLinkClass | typeof defaultLinkClass
    >
  );

  type FilterPathHref = `.${string}/${DefinedPath}` | `./${DefinedPath}`;

  const hrefMap = definedPaths.reduce(
    (acc, cur) => {
      acc[cur] =
        `.${activeFilter === undefined ? '/' + params.username : ''}/${cur}`;
      return acc;
    },
    {} as Record<DefinedPath, FilterPathHref>
  );

  const renderPostsParams: RenderPostsParams = {
    currentUsername,
    username: params.username,
    date,
    id,
  };

  return (
    <>
      <div className='flex gap-2 overflow-x-scroll px-[9px] py-[6px] text-sm text-zinc-950 sm:gap-4 sm:px-[unset] sm:py-[unset] sm:text-base md:overflow-x-visible md:text-lg lg:text-xl dark:text-zinc-100'>
        <Link
          href={`${activeFilter === undefined ? params.username : '.'}`}
          className={
            activeFilter === undefined ? selectedLinkClass : defaultLinkClass
          }
        >
          Latest
        </Link>
        <Link href={hrefMap['yaps']} className={classMap['yaps']}>
          Yaps
        </Link>
        <Link href={hrefMap['echoes']} className={classMap['echoes']}>
          Echoes
        </Link>
        <Link href={hrefMap['media']} className={classMap['media']}>
          Media
        </Link>
        <Link href={hrefMap['likes']} className={classMap['likes']}>
          Likes
        </Link>
        <Link href={hrefMap['following']} className={classMap['following']}>
          Following
        </Link>
        <Link href={hrefMap['followers']} className={classMap['followers']}>
          Followers
        </Link>
      </div>
      <Suspense
        key={params.username + 'posts' + date + id}
        fallback={Array.from({ length: 8 }).map((_, i) => (
          <PostsFallback key={i} />
        ))}
      >
        {(() => {
          switch (activeFilter) {
            case 'yaps':
              return <YapsList {...renderPostsParams} />;

            case 'echoes':
              return <EchoesList {...renderPostsParams} />;

            case 'media':
              return <MediaList {...renderPostsParams} />;

            case 'likes':
              return <LikesList {...renderPostsParams} />;

            case 'following':
              return <FollowingList {...renderPostsParams} />;

            case 'followers':
              return <FollowersList {...renderPostsParams} />;

            case undefined:
              return <LatestList {...renderPostsParams} />;
          }
        })()}
      </Suspense>
    </>
  );
}

export default filterPage;
