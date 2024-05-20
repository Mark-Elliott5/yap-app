// import { NextRequest, NextResponse } from 'next/server';

// import { getLatestYapsCursor } from '@/src/lib/database/fetch';
// import { getSession } from '@/src/lib/database/getUser';

// export const dynamic = 'force-dynamic';

// export async function GET(request: NextRequest) {
//   const session = await getSession();
//   if (!session || !session.user) {
//     throw new Error('User not logged in. Fetch aborted.');
//   }

//   const { searchParams } = request.nextUrl;
//   const date = searchParams.get('date');
//   const id = searchParams.get('id');
//   if (!date || !id) {
//     return NextResponse.json({ error: 'Malformed search parameters.' });
//   }

//   const { posts, error } = await getLatestYapsCursor(date, id);

//   if (error) return NextResponse.json({ error });

//   return NextResponse.json({ posts });
// }
