import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

import { auth } from '@/src/app/api/auth/[...nextauth]/auth';
import db from '@/src/lib/db';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  avatarUploader: f({ image: { maxFileSize: '4MB' } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const session = await auth();

      // If you throw, the user will not be able to upload
      if (!session || !session.user) throw new UploadThingError('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { id: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.id);

      console.log('file url', file.url);

      try {
        // need to retrieve previous avatar url and delete from uploadthing
        await db.user.update({
          where: {
            id: metadata.id,
          },
          data: {
            image: file.url,
          },
        });
      } catch (err) {
        console.log(err);
      }
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { success: 'Avatar updated!' };
    }),
  // yapImage: f({ image: { maxFileSize: '4MB' } })
  //   // Set permissions and file types for this FileRoute
  //   .middleware(async () => {
  //     // This code runs on your server before upload
  //     const session = await auth();

  //     // If you throw, the user will not be able to upload
  //     if (!session || !session.user) throw new UploadThingError('Unauthorized');

  //     // Whatever is returned here is accessible in onUploadComplete as `metadata`
  //     return { id: session.user.id };
  //   })
  //   .onUploadComplete(async ({ metadata, file }) => {
  //     // This code RUNS ON YOUR SERVER after upload
  //     console.log('Upload complete for userId:', metadata.id);

  //     console.log('file url', file.url);

  //     try {
  //       await db.user.update({
  //         where: {
  //           id: metadata.id,
  //         },
  //         data: {
  //           image: file.url,
  //         },
  //       });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //     // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
  //     return { success: 'Avatar updated!' };
  //   }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
