import { logout } from '@/actions/actions';

function LogoutButton({
  className,
  username,
}: {
  className?: string;
  username?: string;
}) {
  return (
    <form action={logout} className={className}>
      <button type='submit' className='h-10 w-full select-none py-2'>
        Log out
        {username &&
          ` @${
            username.length < 9 ? username : username.substring(0, 9) + '...'
          }`}
      </button>
    </form>
  );
}

export default LogoutButton;
