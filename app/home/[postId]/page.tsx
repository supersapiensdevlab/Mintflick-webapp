import FullscreenContainer from '@/components/molecules/FullscreenContainer';
import Header from '@/components/molecules/Header';
import Post from '@/components/organisms/Post';
import React from 'react';

type Props = {};

export default function page({}: Props) {
  return (
    <FullscreenContainer className='select-none  border-x-[1px] border-vapormintBlack-200/60 relative flex flex-col items-start max-w-lg pt-14 mx-auto overflow-hidden bg-vapormintBlack-300'>
      <Header text='Back' />
      <div className='w-full h-full overflow-y-scroll scrollbar-none'>
        <Post />
      </div>
    </FullscreenContainer>
  );
}
