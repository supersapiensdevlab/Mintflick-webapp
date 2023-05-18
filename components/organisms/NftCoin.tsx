import React from 'react';
import nftCoin from '@/public/nftCoin.png';
import Image from 'next/image';

type Props = {};

export default function NftCoin({}: Props) {
  return (
    <div className='  p-[2px]'>
      <Image
        className={`w-6 h-6 object-cover  `}
        src={nftCoin}
        alt='nftCoin'
        width={100}
        height={100}
      />
    </div>
  );
}
