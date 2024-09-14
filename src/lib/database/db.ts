import { neon, Pool } from '@neondatabase/serverless';
import { PrismaNeon, PrismaNeonHTTP } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString, idleTimeoutMillis: 6500 });
const adapter = new PrismaNeon(pool);

const connection = neon(connectionString!);
const adapterEdge = new PrismaNeonHTTP(connection);

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var prismaEdge: PrismaClient | undefined;
}

const db = globalThis.prisma ?? new PrismaClient({ adapter });
const dbEdge =
  globalThis.prismaEdge ?? new PrismaClient({ adapter: adapterEdge });

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
if (process.env.NODE_ENV !== 'production') globalThis.prismaEdge = dbEdge;

export default db;
export { dbEdge };
