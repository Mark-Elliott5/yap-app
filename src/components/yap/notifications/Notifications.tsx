'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TbBell, TbBellFilled } from 'react-icons/tb';

const Notifications = () => {
  const path = usePathname();
  const [newNotifs, setNewNotifs] = useState<boolean | undefined>(
    path === '/notifications' ? false : undefined
  );

  const checkForNotifs = useCallback(async () => {
    // return if there are unchecked notifications to stop pointless fetches
    if (newNotifs) return;
    try {
      const response = await fetch('/api/notifications', {
        cache: 'no-store',
      });
      if (!response.ok) return;
      const bool = await response.json();
      setNewNotifs(bool);
    } catch {
      console.warn('Error occured during new notifications fetch');
    }
  }, [newNotifs]);

  useEffect(() => {
    const interval = setInterval(checkForNotifs, 3000);
    return () => clearInterval(interval);
  }, [checkForNotifs]);

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
