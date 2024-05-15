'use client';

import { useTheme } from 'next-themes';
import { TbMoon, TbSunHigh } from 'react-icons/tb';

function ThemeChanger() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className='flex items-center gap-1'
      >
        {theme === 'dark' ? <TbSunHigh /> : <TbMoon />} Theme
      </button>
    </div>
  );
}

export default ThemeChanger;
