import Image from 'next/image';
import React, { useContext } from 'react';
import social from '@/public/social.webp';
import { walletProviderContext } from '@/contexts/walletProviderContext';

type Props = {};

export default function Settings({}: Props) {
  const walletProvider = useContext(walletProviderContext);

  return (
    <div className='w-full'>
      <div className='flex items-center w-full gap-3 px-4 py-3 cursor-pointer bg-vapormintBlue-300'>
        <Image
          className={`w-16 object-cover aspect-square rounded-full`}
          src={social}
          alt='superfanImage'
          width={100}
          height={100}
        />

        <div className='flex flex-col gap-[2px]'>
          <h2 className='text-xl font-bold text-vapormintWhite-100'>
            Edit Superfan plans
          </h2>{' '}
          <h2 className='text-xs font-semibold text-vapormintWhite-100'>
            Text explaining how a creater get <br />
            benefited by these plans{' '}
          </h2>
        </div>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='w-6 h-6 ml-auto text-vapormintWhite-100'
        >
          <path
            fillRule='evenodd'
            d='M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z'
            clipRule='evenodd'
          />
        </svg>
      </div>
      <span
        onClick={() => {
          localStorage.removeItem('email');
          walletProvider.polygonProvider.logout();
        }}
        className='p-4 text-lg font-bold cursor-pointer text-vapormintError-500'
      >
        Logout
      </span>
    </div>
  );
}
