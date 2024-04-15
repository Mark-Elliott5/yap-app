import type { OurFileRouter } from '@/src/app/api/uploadthing/core';
import {
  generateUploadButton,
  generateUploadDropzone,
} from '@uploadthing/react';

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// Example of working button below to use later

// import { UploadButton } from '@/src/lib/uploadthing';
// import '@uploadthing/react/styles.css';

// <UploadButton
// endpoint='avatarUploader'
// onClientUploadComplete={(res) => {
//   // Do something with the response
//   console.log('Files: ', res);
//   alert('Upload Completed');
// }}
// onUploadError={(error: Error) => {
//   // Do something with the error.
//   alert(`ERROR! ${error.message}`);
// }}
// />
