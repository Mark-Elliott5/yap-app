// 'use client';

// import { useCallback, useState } from 'react';
// import { InView, useInView } from 'react-intersection-observer';

// // import EchoYapPost from '@/src/components/yap/EchoYapPost';
// // import YapPost from '@/src/components/yap/YapPost';
// // import { LatestPosts } from '@/src/lib/database/fetch';

// async function fetchPosts(url: string) {
//   const response = await fetch(url);

//   if (!response.ok) {
//     throw new Error(`Error: ${response.statusText}`);
//   }

//   const data:
//     | {
//         posts: LatestPosts;
//         error?: undefined;
//       }
//     | {
//         error: string;
//         posts?: undefined;
//       } = await response.json();
//   return data;
// }

// function LatestScroll({
//   currentUsername,
//   date,
//   id,
// }: {
//   currentUsername: string;
//   date: Date;
//   id: string;
// }) {
//   // const { ref, inView, entry } = useInView({
//   //   /* Optional options */
//   //   threshold: 0,
//   // });
//   const [oldPosts, setOldPosts] = useState<LatestPosts>([]);
//   const [nextPageUrl, setNextPageUrl] = useState<string | null>(
//     `http://localhost:3000/api/latest?date=${date}&id=${id}`
//   );
//   const [fetching, setFetching] = useState(false);

//   const fetchItems = useCallback(async () => {
//     if (fetching) {
//       return;
//     }

//     setFetching(true);

//     try {
//       if (!nextPageUrl) return;
//       const { posts, error } = await fetchPosts(nextPageUrl);
//       if (error || !posts || !posts.length) {
//         setNextPageUrl(null);
//         return;
//       }

//       setOldPosts([...oldPosts, ...posts]);

//       setNextPageUrl(
//         `http://localhost:3000/api/latest?date=${posts[posts.length - 1].date}&id=${posts[posts.length - 1].id}`
//       );
//     } finally {
//       setFetching(false);
//     }
//   }, [oldPosts, fetching, nextPageUrl]);

//   return (
//     <>
//       {oldPosts.map((post) => {
//         if (post.type === 'Echo') {
//           return (
//             <EchoYapPost
//               key={post.id}
//               currentUsername={currentUsername}
//               {...post}
//             />
//           );
//         }

//         return (
//           <YapPost key={post.id} currentUsername={currentUsername} {...post} />
//         );
//       })}
//       {/* <InView onChange={fetchItems}>
//         <p ref={ref}>Loading...</p>
//       </InView> */}
//     </>
//   );
// }

// export default LatestScroll;
