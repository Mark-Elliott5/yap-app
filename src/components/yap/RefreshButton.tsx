'use client';

import { useRouter } from 'next/navigation';

function RefreshButton() {
  const router = useRouter();
  return <button onClick={() => router.refresh()}>Refresh</button>;
}

export default RefreshButton;
