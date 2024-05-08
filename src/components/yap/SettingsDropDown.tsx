import Link from 'next/link';
import { TbDots } from 'react-icons/tb';

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
        <TbDots size='1.5rem' className='text-zinc-950 dark:text-zinc-100' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href='/settings'>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </Link>
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
