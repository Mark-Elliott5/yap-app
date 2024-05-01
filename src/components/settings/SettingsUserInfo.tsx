// function SettingsUserInfo({
//   updatedUser,
// }: {
//   updatedUser: {
//     displayName: string | null;
//     image: string | null;
//   };
// }) {
//   const session = await auth();
//   // Will not evaluate to undefined, because they would have been redirected if so.
//   const { username, displayName, image, OAuth, joinDate } = session!.user as {
//     username: string;
//     displayName: string | null;
//     image: string | null;
//     OAuth: boolean;
//     joinDate: Date;
//   };

//   return (
//     <UserHovercard
//       username={username}
//       joinDate={joinDate}
//       displayName={updatedUser.displayName ?? displayName}
//       image={updatedUser.image ?? image}
//       // self={true}
//     >
//       <div className='flex items-center gap-3 text-white'>
//         <div className='flex flex-col sm:flex-row sm:gap-2'>
//           <span
//             className='max-w-36 truncate text-sm text-black sm:max-w-44 sm:text-base dark:text-white'
//             title={username}
//           >
//             @{username}
//           </span>
//           {(updatedUser?.displayName ?? displayName) && (
//             <span
//               className='max-w-36 truncate text-sm font-light text-zinc-500 sm:max-w-44 sm:text-base dark:text-zinc-400'
//               title={updatedUser?.displayName ?? displayName!}
//             >
//               {updatedUser?.displayName ?? displayName}
//             </span>
//           )}
//         </div>
//         <Avatar>
//           <AvatarImage
//             src={updatedUser.image ?? image ?? ''}
//             height={'1.5rem'}
//           />
//           <AvatarFallback>
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img
//               alt={`${updatedUser.displayName ?? displayName ?? username}'s avatar`}
//               src={'/defaultavatar.svg'}
//             />
//           </AvatarFallback>
//         </Avatar>
//       </div>
//     </UserHovercard>
//   );
// }
