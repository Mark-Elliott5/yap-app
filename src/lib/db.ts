import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const db = globalThis.prisma || new PrismaClient({ adapter });

console.log('URL:', connectionString);

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;

export default db;
