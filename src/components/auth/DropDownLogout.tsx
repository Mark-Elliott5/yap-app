import { logout } from '@/actions/actions';

function DropDownLogout() {
  return (
    <form action={logout} className={'w-full'}>
      <button type='submit' className={'w-full text-left'}>
        Log out
      </button>
    </form>
  );
}

export default DropDownLogout;
