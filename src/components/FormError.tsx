import { BsExclamationTriangle } from 'react-icons/bs';

function FormError({ message }: { message: string }) {
  return (
    message && (
      <div className='flex items-center gap-x-2 rounded-md border-1 border-yap-red-500 bg-yap-red-50 p-2 text-sm text-yap-red-500'>
        <BsExclamationTriangle size='1.15em' />
        <span>{message}</span>
      </div>
    )
  );
}

export default FormError;
