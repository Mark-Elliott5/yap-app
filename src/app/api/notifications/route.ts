import { NextRequest, NextResponse } from 'next/server';
import { EventNotifier, getSSEWriter } from 'ts-sse';

import { getSession } from '@/src/lib/database/getUser';

// import { rickAstleySchema } from './types';

export const notifierMap = new Map();

export const dynamic = 'force-dynamic';

type SyncEvents = EventNotifier<{
  update: {
    data: 'true' | 'false';
    event: 'update';
  };
  complete: {
    data: string;
    event: 'update';
  };
  close: {
    data: never;
  };
  error: {
    data: never;
  };
}>;

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error('User not logged in. SSE connection aborted.');
  }
  const { username } = session.user;
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();
  const notifier = getSSEWriter(writer, encoder) as SyncEvents;
  notifierMap.set(username, notifier);

  request.signal.onabort = () => {
    writer.close();
    notifierMap.delete(username);
  };

  // notifier.update({
  //   data: session.user._count.notifications >= 1 ? 'true' : 'false',
  //   event: 'update',
  // });
  notifier.update({ data: 'false', event: 'update' });
  setTimeout(() => notifier.update({ data: 'true', event: 'update' }), 3000);

  return new NextResponse(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
