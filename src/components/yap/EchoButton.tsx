'use client';
import { useState } from 'react';
import { HiSignal } from 'react-icons/hi2';

function EchoButton({
  className,
  echoed,
}: {
  className?: string;
  echoed: boolean;
}) {
  const [on, setOn] = useState(echoed);

  // implement server action here later

  return (
    <button className={className} onClick={() => setOn((prev) => !prev)}>
      <HiSignal
        className={`hover:text-yap-green-500 ${on ? 'text-yap-green-500' : 'text-zinc-600'}`}
      />
    </button>
  );
}

export default EchoButton;
