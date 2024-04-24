// import { Dispatch, SetStateAction, useEffect } from 'react';
// import { Archivo_Black } from 'next/font/google';

// import { auth } from '@/src/app/api/auth/[...nextauth]/auth';
// import { cn } from '@/src/lib/utils';

// const archivoBlack = Archivo_Black({
//   subsets: ['latin'],
//   weight: '400',
// });

// async function SettingsNavBar({
//   user,
//   setUser,
// }: {
//   user: {
//     username: string;
//     displayName: string;
//     image: string | null;
//   } | null;
//   setUser: Dispatch<
//     SetStateAction<{
//       username: string;
//       displayName: string;
//       image: string | null;
//     } | null>
//   >;
// }) {
//   useEffect(() => {
//     async () => {
//       const session = await auth();
//       if (!session) return;
//       // Properties will not be null, because they will not be able to access
//       // this page if they are. Hence, the type assertion.
//       const { username, displayName, image } = session.user as {
//         username: string;
//         displayName: string;
//         image: string | null;
//       };
//       setUser({ username, displayName, image });
//     };
//   }, []);

//   return (
//     <nav className='sticky flex items-center justify-between border-b-1 px-4 py-2'>
//       <a
//         href='/'
//         className={cn('text-2xl text-yap-red-500', archivoBlack.className)}
//       >
//         yap
//       </a>
//       <div className='flex items-center gap-2 text-white'>
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           className='w-6 rounded-sm'
//           alt={`${user?.displayName}'s avatar`}
//           src={user?.image ?? '/defaultavatar.svg'}
//         />
//         <span>{`${user?.displayName} (${user?.username})`}</span>
//       </div>
//     </nav>
//   );
// }

// export default SettingsNavBar;
