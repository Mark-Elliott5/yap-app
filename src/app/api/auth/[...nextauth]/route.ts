export { GET, POST } from '@/src/app/api/auth/[...nextauth]/auth';
// export const runtime = 'edge';

// uncommenting the above works, but throws a:
// "can't resolve 'crypto' in bcryptjs/dist" error
// despite this, passwords are still hashed and compared.
// unsure of the true impact of this, so leaving it commented out for now
