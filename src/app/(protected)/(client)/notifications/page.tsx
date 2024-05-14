import { Suspense } from 'react';

import { Separator } from '@/src/components/ui/separator';
import NotificationTab from '@/src/components/yap/NotificationTab';
import PostsFallback from '@/src/components/yap/PostsFallback';
import { getNotifications } from '@/src/lib/database/fetch';
import { getSession } from '@/src/lib/database/getUser';

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
      if (newNotifications && !separatorUsed) {
        separatorUsed = true;
        return (
          <>
            <NotificationTab key={notif.id} {...notif} />
            <Separator className='bg-gradient-to-r from-yap-red-500' />
          </>
        );
      }
      return <NotificationTab key={notif.id} {...notif} />;
    });
  })();

  return (
    <>
      <div className='my-4 flex gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <div className='cursor-default rounded-md border-t-1 border-zinc-100 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'>
          Notifications
        </div>
      </div>
      <Suspense fallback={<PostsFallback />}>
        <div className='flex min-h-dvh flex-col gap-4'>
          {newNotifications && (
            <span className='text-base text-zinc-950 dark:text-zinc-100'>
              New
            </span>
          )}
          {body}
        </div>
      </Suspense>
    </>
  );
}

export default Notifications;
