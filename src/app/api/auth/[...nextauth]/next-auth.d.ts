import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

import { $Enums } from '@prisma/client';

declare module 'next-auth/jwt' {
  interface JWT extends Record<string, unknown>, DefaultJWT {
    user: {
      role: $Enums.UserRole;
      OAuth: boolean;
      username: string | null;
      displayName: string | null;
      image: string | null;
      imageKey: string | null;
      email: string;
      emailVerified: Date | null;
      name: string | null;
    };
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      role: $Enums.UserRole;
      OAuth: boolean;
      username: string | null;
      displayName: string | null;
      image: string | null;
      imageKey: string | null;
    } & DefaultSession['user'];
  }
}
