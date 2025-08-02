import ListElement from '@/src/components/yap/ListElement';

function EndOfList() {
  return (
    <ListElement className='text-center italic'>{`You've reached the end!`}</ListElement>
  );
}

export default EndOfList;
