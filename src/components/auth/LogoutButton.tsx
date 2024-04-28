import { logout } from '@/actions/actions';

function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logout} className={className}>
      <button type='submit' className='h-10 w-full py-2'>
        Log out
      </button>
    </form>
  );
}

export default LogoutButton;
