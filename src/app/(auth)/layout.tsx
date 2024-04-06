function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex h-dvh items-center justify-center'>{children}</div>
  );
}

export default AuthLayout;
