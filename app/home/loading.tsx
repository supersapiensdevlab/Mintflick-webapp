import FullscreenContainer from '@/components/molecules/FullscreenContainer';
import React from 'react';

type Props = {};

export default function loading({}: Props) {
  return (
    <FullscreenContainer className='relative border-x-[1px] border-vapormintBlack-200/60 flex flex-col items-start max-w-lg mx-auto overflow-hidden bg-vapormintBlack-300'>
      <div className='flex flex-col items-center justify-center flex-grow text-2xl font-bold text-vapormintWhite-100'>
        Loading
      </div>
    </FullscreenContainer>
  );
}
