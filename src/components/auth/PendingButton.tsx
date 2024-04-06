'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';

function FormButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' className='w-full' disabled={pending}>
      {label}
    </Button>
  );
}

export default FormButton;
