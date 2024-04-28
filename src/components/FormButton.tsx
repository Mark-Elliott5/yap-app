'use client';

// import { useFormStatus } from 'react-dom';

import { Button } from '@/src/components/ui/button';

function FormButton({
  children,
  variant,
  disabled,
}: {
  children: React.ReactNode;
  variant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | null
    | undefined;
  disabled: boolean;
}) {
  // the below is not disabling on submit
  // const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      variant={variant}
      className='w-full select-none'
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

export default FormButton;
