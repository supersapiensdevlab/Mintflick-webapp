'use client';
import Button from '@/components/molecules/Button';
import Divider from '@/components/molecules/Divider';
import FullscreenContainer from '@/components/molecules/FullscreenContainer';
import Image from 'next/image';
import SolanaTorus from '@toruslabs/solana-embed';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { walletProviderContext } from '@/contexts/walletProviderContext';
import { UserContext } from '@/contexts/userContext';
import FullScreenOverlay from '@/components/molecules/FullScreenOverlay';
import Torus from '@toruslabs/torus-embed';
import Web3 from 'web3';

export default function Home() {
  const router = useRouter();
  const userState = useContext(UserContext);
  const walletProvider = useContext(walletProviderContext);

  const [checkingUser, setCheckingUser] = useState(false);
  async function isUserAvaliable(walletAddress: string) {
    console.log('Checking for User with Wallet:', walletAddress);
    await axios({
      method: 'post',
      url: `/api/user/getuser_by_wallet`,
      data: {
        walletId: walletAddress,
      },
    })
      .then((response: any) => {
        console.log('user data', response);
        userState.updateUserData(response.data.data.user);
        console.log('user data saved in state');
        localStorage.setItem('authtoken', response.data.data.jwtToken);
        console.log('auth token saved in storage');
        localStorage.setItem('walletAddress', walletAddress);
        console.log('wallet address saved in storage');

        response.data.data === 'No user found'
          ? router.push('/create_account')
          : router.push('/home');
      })
      .catch(async function (error) {
        console.log(error);
        error.response.status === 404 && router.push('/create_account');
        // error.response.status === 0 && State.toast(error.message);
      });
  }
  const handleTorusSolanaConnect = async () => {
    setCheckingUser(true);
    const torus = new SolanaTorus();
    await torus.init();
    await torus.login();
    await torus.hideTorusButton();
    walletProvider.setChain('solana');

    walletProvider.setSolanaProvider(torus);
    console.log('torus', torus);
    const address = torus.provider.selectedAddress;
    console.log(address);
    address && isUserAvaliable(address);
  };
  const onClickLogin = async () => {
    const torus = new Torus({
      buttonPosition: 'top-right', // default: 'bottom-left'
    });
    await torus.init({
      enableLogging: false,
      network: {
        host: 'https://rpc.testnet.mantle.xyz/', // mandatory
        networkName: 'Mantle Testnet',
        chainId: 5001,
        blockExplorer: 'https://explorer.testnet.mantle.xyz/',
        ticker: 'BIT',
        tickerName: 'BIT',
      },
    });
    // await torus.hideTorusButton();

    await torus.login();
    torus.hideTorusButton();
    walletProvider.setChain('evm');

    walletProvider.setPolygonProvider(torus);
    console.log(walletProvider);

    const web3 = new Web3(torus.provider);
    const address = (await web3.eth.getAccounts())[0];
    console.log(address);
    address && isUserAvaliable(address);
  };
  return (
    <FullscreenContainer className='flex flex-col items-start justify-start max-w-lg mx-auto overflow-hidden bg-vapormintBlack-300'>
      <div className='relative w-full mx-auto h-1/2 '>
        <Image
          className={`w-full   h-full object-cover `}
          src={
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShw68l9VoHTOZlBUojk_0o2UcfEOvCpcZI04qlKcefqVLGsykcOUqUUVRJnISOKSeCNgU&usqp=CAU'
          }
          alt='loginImage'
          width={100}
          height={100}
        />
        <span className='absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-vapormintBlack-300 '></span>
      </div>
      <div className='flex flex-col justify-start flex-grow w-full my-6'>
        <Divider kind='center' size={2} />
        <div className='flex items-center justify-start w-full gap-2 px-8 py-2'>
          <span className='text-2xl font-black tracking-widest uppercase text text-vapormintWhite-300 '>
            trust
          </span>
          <span className='text-2xl font-black tracking-widest text-transparent uppercase text text-vapormintBlack-200'>
            Community
          </span>
          <span className='text-2xl font-black tracking-widest uppercase text text-vapormintWhite-300 '>
            Support
          </span>{' '}
          <span className='text-2xl font-black tracking-widest text-transparent uppercase text text-vapormintBlack-200'>
            trust
          </span>
        </div>
        <Divider kind='center' size={2} />
        <div className='flex items-center gap-3 px-4 py-2 overflow-hidden'>
          <span className='flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-vapormintBlack-200'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-vapormintSuccess-500'
            >
              <path d='M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z' />
            </svg>
            <span className='text-lg font-bold text-vapormintWhite-100'>
              Livestreaming
            </span>
          </span>
          <span className='flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-vapormintBlack-200'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-vapormintBlue-300'
            >
              <path
                fillRule='evenodd'
                d='M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zm1.5 0v1.5c0 .207.168.375.375.375h1.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-1.5A.375.375 0 003 5.625zm16.125-.375a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h1.5A.375.375 0 0021 7.125v-1.5a.375.375 0 00-.375-.375h-1.5zM21 9.375A.375.375 0 0020.625 9h-1.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h1.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-1.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h1.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-1.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h1.5a.375.375 0 00.375-.375v-1.5zM4.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-1.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h1.5zM3.375 15h1.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-1.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h1.5a.375.375 0 00.375-.375v-1.5A.375.375 0 004.875 9h-1.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375zm4.125 0a.75.75 0 000 1.5h9a.75.75 0 000-1.5h-9z'
                clipRule='evenodd'
              />
            </svg>

            <span className='text-lg font-bold text-vapormintWhite-100'>
              Videos
            </span>
          </span>
          <span className='flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-vapormintBlack-200'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-vapormintWarning-500'
            >
              <path
                fillRule='evenodd'
                d='M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z'
                clipRule='evenodd'
              />
            </svg>

            <span className='text-lg font-bold text-vapormintWhite-100'>
              NFTs
            </span>
          </span>
        </div>
        <div className='flex items-center gap-3 px-4 py-2 overflow-hidden'>
          <span className='flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-vapormintBlack-200'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-vapormintBlue-300'
            >
              <path d='M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z' />
            </svg>

            <span className='text-lg font-bold text-vapormintWhite-100'>
              Polls
            </span>
          </span>
          <span className='flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-vapormintBlack-200'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-vapormintLuxury-300'
            >
              <path
                fillRule='evenodd'
                d='M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z'
                clipRule='evenodd'
              />
              <path d='M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z' />
            </svg>

            <span className='text-lg font-bold text-vapormintWhite-100'>
              Blogs
            </span>
          </span>
          <span className='flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-vapormintBlack-200'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-vapormintSuccess-500'
            >
              <path d='M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z' />
            </svg>

            <span className='text-lg font-bold text-vapormintWhite-100'>
              Events
            </span>
          </span>
          <span className='flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-vapormintBlack-200'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-vapormintWarning-500'
            >
              <path
                fillRule='evenodd'
                d='M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z'
                clipRule='evenodd'
              />
            </svg>

            <span className='text-lg font-bold text-vapormintWhite-100'>
              Superfans
            </span>
          </span>
        </div>
        <div className='flex-grow lg:flex-none lg:h-12'></div>
        <Button
          // handleClick={() => handleTorusSolanaConnect()}
          handleClick={() => onClickLogin()}
          kind='white'
          type='solid'
          size='base'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 186.69 190.5'
          >
            <g transform='translate(1184.583 765.171)'>
              <path
                clipPath='none'
                mask='none'
                d='M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z'
                fill='#4285f4'
              />
              <path
                clipPath='none'
                mask='none'
                d='M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z'
                fill='#34a853'
              />
              <path
                clipPath='none'
                mask='none'
                d='M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z'
                fill='#fbbc05'
              />
              <path
                d='M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z'
                fill='#ea4335'
                clipPath='none'
                mask='none'
              />
            </g>
          </svg>
          Continue With Google
        </Button>
      </div>
      {checkingUser && (
        <FullScreenOverlay animation='bottom' onClose={() => {}}>
          <div className='flex flex-col w-full h-full bg-vapormintBlack-300'>
            <div className='flex flex-col items-center justify-center flex-grow text-2xl font-bold text-vapormintWhite-100'>
              Checking User Information...
            </div>
          </div>
        </FullScreenOverlay>
      )}
    </FullscreenContainer>
  );
}
