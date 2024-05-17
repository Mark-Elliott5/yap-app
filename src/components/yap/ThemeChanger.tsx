'use client';

import { useTheme } from 'next-themes';
import { TbMoon, TbSunHigh } from 'react-icons/tb';

function ThemeChanger() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='flex w-full items-center gap-1'
    >
      {theme === 'dark' ? <TbSunHigh /> : <TbMoon />} Theme
    </button>
  );
}

export default ThemeChanger;
