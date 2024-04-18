import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

import { UserRole } from '@prisma/client';

declare module 'next-auth/jwt' {
  interface JWT extends Record<string, unknown>, DefaultJWT {
    user: {
      role: UserRole;
      OAuth: boolean;
      username: string | null;
      displayName: string | null;
    };
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      role: 'ADMIN' | 'USER';
      OAuth: boolean;
      username: string | null;
      displayName: string | null;
    } & DefaultSession['user'];
  }
}
