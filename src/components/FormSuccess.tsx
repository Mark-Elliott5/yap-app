import { IoCheckmarkCircle } from 'react-icons/io5';

function FormSuccess({ message }: { message: string }) {
  return (
    message && (
      <div className='flex items-center gap-x-2 rounded-md border-1 border-yap-green-500 bg-yap-green-50 p-2 text-sm text-yap-green-500'>
        <IoCheckmarkCircle size='1.15em' />
        <span>{message}</span>
      </div>
    )
  );
}

export default FormSuccess;
