import { Suspense } from 'react';
import { Metadata } from 'next';

import { Separator } from '@/src/components/ui/separator';
import NotificationTab from '@/src/components/yap/NotificationTab';
import NotifsFallback from '@/src/components/yap/NotifsFallback';
import { getNotifications } from '@/src/lib/database/fetch';
import { getSession } from '@/src/lib/database/getUser';

export const metadata: Metadata = {
  title: `Notifications | yap`,
  description: 'Notifications Page | yap',
};

async function Notifications() {
  const session = await getSession();
  if (!session || !session.user || !session.user.username) return null;
  const { username, newNotifications } = session.user;

  const { notifications, error } = await getNotifications(username);

  const body = (() => {
    if (error) {
      return (
        <span className='text-zinc-950 dark:text-zinc-100'>
          Something went wrong! Please reload the page.
        </span>
      );
    }

    if (!notifications || !notifications.length) {
      return (
        <p className='my-8 text-center italic text-zinc-950 dark:text-zinc-100'>
          {`There's nothing here... yet.`}
        </p>
      );
    }

    let separatorUsed = false;

    return notifications.map((notif) => {
      if (
        newNotifications &&
        new Date(notif.date).getTime() - new Date(newNotifications).getTime() <=
          0 &&
        !separatorUsed
      ) {
        separatorUsed = true;
        return (
          <>
            <Separator className='bg-gradient-to-r from-transparent via-yap-red-500 to-transparent drop-shadow-heart' />
            <div className='max-w-fit cursor-default rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'>
              Old
            </div>
            <NotificationTab key={notif.id} {...notif} />
          </>
        );
      }
      return <NotificationTab key={notif.id} {...notif} />;
    });
  })();

  return (
    <>
      <div className='my-4 flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <div className='cursor-default rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'>
          Notifications
        </div>
      </div>
      <div className='flex min-h-dvh flex-col gap-4'>
        <Suspense
          fallback={Array.from({ length: 10 }).map((_, i) => (
            <NotifsFallback key={i} />
          ))}
        >
          {body}
        </Suspense>
      </div>
    </>
  );
}

export default Notifications;
