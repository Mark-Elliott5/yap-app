import { Fragment, Suspense } from 'react';
import { Metadata } from 'next';

import { Separator } from '@/src/components/ui/separator';
import ClearNotificationsButton from '@/src/components/yap/notifications/buttons/ClearNotifications';
import NotificationTab from '@/src/components/yap/notifications/NotificationTab';
import NotifsFallback from '@/src/components/yap/notifications/NotifsFallback';
import OlderPostsLink from '@/src/components/yap/post/OlderPostsLink';
import SomethingWentWrong from '@/src/components/yap/SomethingWentWrong';
import TheresNothingHere from '@/src/components/yap/TheresNothingHere';
import { getNotifications } from '@/src/lib/database/fetch';
import { getSession } from '@/src/lib/database/getUser';

export const metadata: Metadata = {
  title: `Notifications | yap`,
  description: 'Notifications Page | yap',
};

async function Notifications({
  searchParams,
}: {
  searchParams: { date?: string; id?: string };
}) {
  const session = await getSession();
  if (!session || !session.user || !session.user.username) return null;
  const { username, newNotifications } = session.user;

  const { date, id } = searchParams;
  const { notifications, error } = await getNotifications(username, date, id);

  const body = (() => {
    if (error) {
      return <SomethingWentWrong />;
    }

    if (!notifications || !notifications.length) {
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

    let separatorUsed = false;

    return (
      <>
        {notifications.map((notif) => {
          if (
            newNotifications &&
            new Date(notif.date).getTime() -
              new Date(newNotifications).getTime() <=
              0 &&
            !separatorUsed
          ) {
            separatorUsed = true;
            return (
              <Fragment key={'separator'}>
                <Separator className='bg-gradient-to-r from-transparent via-yap-red-500 to-transparent drop-shadow-heart' />
                <div className='max-w-fit cursor-default rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'>
                  Old
                </div>
                <NotificationTab key={notif.id} {...notif} />
              </Fragment>
            );
          }
          return <NotificationTab key={notif.id} {...notif} />;
        })}

        <OlderPostsLink
          length={notifications.length}
          date={notifications[notifications.length - 1].date}
          id={notifications[notifications.length - 1].id}
          typeText='Notifications'
        />
      </>
    );
  })();

  return (
    <>
      <div className='my-4 flex items-center justify-between gap-4 text-xl text-zinc-950 dark:text-zinc-100'>
        <div className='cursor-default rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 shadow-lg transition-all hover:scale-[1.2] dark:border-zinc-800 dark:bg-zinc-900'>
          Notifications
        </div>
        <ClearNotificationsButton />
      </div>
      <div className='flex min-h-dvh flex-col gap-4'>
        <Suspense
          key={'notificiations' + date + id}
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
