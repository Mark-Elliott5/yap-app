import { FaEllipsis } from 'react-icons/fa6';

import DropDownLogout from '@/src/components/auth/DropDownLogout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';

function SettingsDropDown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <FaEllipsis size='1.5rem' className='text-black dark:text-white' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <a href='/settings'>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </a>
        <DropdownMenuItem>
          <button
            className='w-full text-left'
            // onClick={() => {
            //   const body = document.getElementsByTagName('body')[0];
            //   if (body.classList.contains('dark')) {
            //     localStorage.theme = 'light';
            //     body.classList.add('light');
            //     body.classList.remove('dark');
            //     return;
            //   }
            //   localStorage.theme = 'dark';
            //   body.classList.add('dark');
            //   body.classList.remove('light');
            // }}
          >
            Theme
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='w-full'>
          <DropDownLogout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SettingsDropDown;
