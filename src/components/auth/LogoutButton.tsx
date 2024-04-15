import { signOut } from '@/src/app/api/auth/[...nextauth]/auth';

function LogoutButton({ className }: { className?: string }) {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
      className={className}
    >
      <button type='submit' className='w-full p-2'>
        Log out
      </button>
    </form>
  );
}

export default LogoutButton;
