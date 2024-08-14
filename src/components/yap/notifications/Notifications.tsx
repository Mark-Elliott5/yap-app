'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TbBell, TbBellFilled } from 'react-icons/tb';

const Notifications = ({ initialState }: { initialState: Date | null }) => {
  const path = usePathname();
  const [newNotifs, setNewNotifs] = useState<boolean>(
    !!initialState && path !== '/notifications'
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      // return if there are unchecked notifications to stop pointless fetches
      if (newNotifs) return;
      const response = await fetch('/api/notifications', { cache: 'no-store' });
      if (!response.ok) return;
      const bool = await response.json();
      setNewNotifs(bool);
    }, 3000);

    return () => clearInterval(interval);
  }, [newNotifs]);

  return (
    <Link
      className='flex items-center gap-2 px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 hover:drop-shadow-lg dark:text-zinc-100'
      href='/notifications'
      prefetch={false}
      onClick={() => setNewNotifs(false)}
    >
      {newNotifs ? (
        <TbBellFilled className={'animate-wiggle-more animate-infinite'} />
      ) : (
        <TbBell />
      )}
      <span className='hidden md:inline-block'>Notifications</span>
    </Link>
  );
};

export default Notifications;
