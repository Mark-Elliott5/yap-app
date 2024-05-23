'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TbLoader2 } from 'react-icons/tb';

import { clearNotifications } from '@/src/lib/database/actions';

function ClearNotificationsButton() {
  const [formVisible, setFormVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = async () => {
    setSubmitting(true);
    const { success } = await clearNotifications();
    if (success) {
      router.refresh();
    }
    setSubmitting(false);
    setFormVisible(false);
  };

  return (
    <div>
      <div
        className={`flex cursor-pointer items-center gap-1 rounded-md border-x-[0.5px] border-t-1 border-zinc-200 bg-white px-4 py-2 text-sm shadow-lg transition-all hover:scale-[1.2] hover:text-red-500 active:scale-[0.95] sm:text-base dark:border-zinc-800 dark:bg-zinc-900`}
        onClick={() => setFormVisible(true)}
      >
        {formVisible ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleChange();
            }}
            className='flex'
          >
            {submitting ? (
              <TbLoader2 size='1.25rem' className='animate-spin' />
            ) : (
              <button className='text-sm text-red-500 sm:text-base'>
                Are you sure?
              </button>
            )}
          </form>
        ) : (
          'Clear'
        )}
      </div>
    </div>
  );
}

export default ClearNotificationsButton;
