function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex h-dvh items-center justify-center bg-gradient-to-b from-zinc-900 from-0% to-zinc-950 bg-fixed'>
      {children}
    </div>
  );
}

export default AuthLayout;
