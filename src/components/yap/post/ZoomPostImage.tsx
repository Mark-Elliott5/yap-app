'use client';

import { TbArrowsDiagonalMinimize2 } from 'react-icons/tb';
import Zoom from 'react-medium-image-zoom';

function ZoomPostImage({ image }: { image: string }) {
  return (
    <Zoom IconUnzoom={TbArrowsDiagonalMinimize2} zoomMargin={20}>
      <img
        src={image}
        alt='post image'
        className='max-h-[500px] w-full rounded-md object-cover'
      />
    </Zoom>
  );
}

export default ZoomPostImage;
