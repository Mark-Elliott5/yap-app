export default function Page({
  params,
}: Readonly<{
  params: { username: string; yapId: string };
}>) {
  return (
    <>
      <div>My Post: {params.yapId}</div>
      <div>My Username: {params.username}</div>
    </>
  );
}
