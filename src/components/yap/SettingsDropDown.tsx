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
import ThemeChanger from '@/src/components/yap/ThemeChanger';

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
          <ThemeChanger />
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
