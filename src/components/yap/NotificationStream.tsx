'use client';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import Link from 'next/link';
import { TbBell, TbBellFilled } from 'react-icons/tb';

const EventSourceContext = createContext<null | EventSource>(null);

export const EventSourceProvider = ({ children }: { children: ReactNode }) => {
  const [eventSource, setEventSource] = useState<null | EventSource>(null);

  useEffect(() => {
    const source = new EventSource(
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api/notifications'
        : process.env.NOTIFSTREAM_URL
          ? `${process.env.NOTIFSTREAM_URL}/api/notifications`
          : (() => {
              throw new Error(
                'Your production build is missing a NOTIFSTREAM_URL .env key! Please provide your deployed host URL with no trailing forward slash.'
              );
            })(),
      {
        withCredentials: true,
      }
    );
    setEventSource(source);

    return () => {
      source.close();
    };
  }, []);

  return (
    <EventSourceContext.Provider value={eventSource}>
      {children}
    </EventSourceContext.Provider>
  );
};

const NotificationIcon = ({ initialState }: { initialState: Date | null }) => {
  const [state, setState] = useState<boolean>(!!initialState);

  const eventSource = useContext(EventSourceContext);
  const updateState = useCallback(
    (event: MessageEvent) => {
      if (event.data === undefined) {
        eventSource?.close();
        return;
      }
      setState(event.data === 'true');
    },
    [eventSource]
  );

  useEffect(() => {
    if (eventSource) {
      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
      };
      eventSource.addEventListener('update', updateState);

      return () => {
        eventSource.removeEventListener('update', updateState);
      };
    }
  }, [eventSource, updateState]);

  return (
    <Link
      className='flex items-center gap-2 px-2 py-1 text-2xl text-zinc-950 hover:opacity-70 hover:drop-shadow-lg dark:text-zinc-100'
      href='/notifications'
      prefetch={false}
      onClick={() => setState(false)}
    >
      {state ? (
        <TbBellFilled className={'animate-wiggle-more animate-infinite'} />
      ) : (
        <TbBell />
      )}
      <span className='hidden md:inline-block'>Notifications</span>
    </Link>
  );
};

const Notifications = ({ initialState }: { initialState: Date | null }) => {
  return (
    <EventSourceProvider>
      <NotificationIcon initialState={initialState} />
    </EventSourceProvider>
  );
};

export default Notifications;
