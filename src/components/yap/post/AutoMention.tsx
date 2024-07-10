import Link from 'next/link';
import reactStringReplace from 'react-string-replace';

import { getUserByUsername } from '@/src/lib/database/getUser';

function AutoMention({ text }: { text: string }) {
  const links = reactStringReplace(text, /@(\w+)/g, async (match, i) => {
    const matchExists = await getUserByUsername(match);
    return matchExists ? (
      <Link
        key={match + i}
        href={`/user/${match}`}
        className='text-yap-blue-500 hover:text-yap-blue-600'
      >
        @{match}
      </Link>
    ) : (
      <>@{match}</>
    );
  });

  return <>{links.map((link) => link)}</>;
}

export default AutoMention;
