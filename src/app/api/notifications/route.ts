import { NextResponse } from 'next/server';

import { getSession } from '@/src/lib/database/getUser';

// export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session || !session.user) {
    throw new Error('User not logged in. SSE connection aborted.');
  }
  return new NextResponse(JSON.stringify(!!session.user.newNotifications), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
