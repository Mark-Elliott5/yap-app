import { NextRequest, NextResponse } from 'next/server';
import { EventNotifier, getSSEWriter } from 'ts-sse';

import { notifierUserIdMap } from '@/src/app/api/notifications/notifierMap';
import { getSession } from '@/src/lib/database/getUser';

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
  const { id } = session.user;
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();
  const notifier = getSSEWriter(writer, encoder) as SyncEvents;
  notifierUserIdMap.set(id!, notifier);

  request.signal.onabort = () => {
    writer.close();
    notifierUserIdMap.delete(id!);
  };

  // notifier.update({
  //   data: session.user._count.notifications >= 1 ? 'true' : 'false',
  //   event: 'update',
  // });
  // notifier.update({ data: 'false', event: 'update' });
  // setTimeout(() => notifier.update({ data: 'true', event: 'update' }), 3000);

  return new NextResponse(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
