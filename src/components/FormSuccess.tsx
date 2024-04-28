import { IoCheckmarkCircleOutline } from 'react-icons/io5';

function FormSuccess({ message }: { message: string }) {
  return (
    message && (
      <div className='flex items-center gap-x-2 rounded-md border-1 border-yap-green-500 bg-yap-green-50 p-2 text-sm text-yap-green-500'>
        <IoCheckmarkCircleOutline size='1.15em' className='flex-shrink-0' />
        <span>{message}</span>
      </div>
    )
  );
}

export default FormSuccess;
