export default function Page({
  params,
}: Readonly<{
  params: { username: string; postId: string };
}>) {
  return (
    <>
      <div>My Post: {params.postId}</div>
      <div>My Username: {params.username}</div>
    </>
  );
}
