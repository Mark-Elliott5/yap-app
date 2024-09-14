import { logout } from '@/src/lib/database/actions';

function DropDownLogout() {
  return (
    <form action={logout} className={'w-full'}>
      <button type='submit' className={'w-full px-2 py-1.5 text-left'}>
        Log out
      </button>
    </form>
  );
}

export default DropDownLogout;
