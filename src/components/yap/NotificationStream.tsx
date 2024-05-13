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
    const source = new EventSource('http://localhost:3000/api/notifications', {
      withCredentials: true,
    });
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

const NotificationIcon = ({ initialState }: { initialState: boolean }) => {
  const [state, setState] = useState<boolean>(initialState);

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
      onClick={() => setState((prev) => !prev)}
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

const Notifications = ({ initialState }: { initialState: boolean }) => {
  return (
    <EventSourceProvider>
      <NotificationIcon initialState={initialState} />
    </EventSourceProvider>
  );
};

export default Notifications;
