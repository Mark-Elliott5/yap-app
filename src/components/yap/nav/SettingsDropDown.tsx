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
import ThemeChanger from '@/src/components/yap/nav/ThemeChanger';

function SettingsDropDown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <TbDots size='1.5rem' className='text-zinc-950 dark:text-zinc-100' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href='/settings' className='w-full px-2 py-1.5'>
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ThemeChanger />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <DropDownLogout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SettingsDropDown;
