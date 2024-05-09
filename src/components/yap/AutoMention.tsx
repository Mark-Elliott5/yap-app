import Link from 'next/link';
import reactStringReplace from 'react-string-replace';

function AutoMention({ text }: { text: string }) {
  const links = reactStringReplace(text, /@(\w+)/g, (match, i) => (
    <Link
      key={match + i}
      href={`/user/${match}`}
      className='text-yap-blue-500 hover:text-yap-blue-600'
    >
      @{match}
    </Link>
  ));

  return <>{links.map((link) => link)}</>;
}

export default AutoMention;
