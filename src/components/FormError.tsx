import { FaExclamationTriangle } from 'react-icons/fa';

function FormError({ message }: { message: string }) {
  return (
    message && (
      <div className='border-1 flex items-center gap-x-2 rounded-md border-yap-red-500 bg-yap-red-50 p-2 text-sm text-yap-red-500'>
        <FaExclamationTriangle size='1.15em' />
        <span>{message}</span>
      </div>
    )
  );
}

export default FormError;
