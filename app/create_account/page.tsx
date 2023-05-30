'use client';
import Button from '@/components/molecules/Button';
import Divider from '@/components/molecules/Divider';
import FullScreenOverlay from '@/components/molecules/FullScreenOverlay';
import FullscreenContainer from '@/components/molecules/FullscreenContainer';
import TextInput from '@/components/molecules/TextInput';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import livestream from '@/public/livestream.webp';
import tickets from '@/public/tickets.webp';
import social from '@/public/social.webp';
import CopyToClipboard from '@/components/molecules/CopyButton';
import { UserContext } from '@/contexts/userContext';
import { walletProviderContext } from '@/contexts/walletProviderContext';
import { toastContext } from '@/contexts/toastContext';
import axios from 'axios';
import { useForm } from '@mantine/form';
import CheckBox from '@/components/molecules/CheckBox';

const SplashScreenData = [
  {
    image: social,
    heading: 'NFTfied Social Media',
    text: (
      <>
        💸 Marketplaces are place of business & Social Media is a place to
        connect & Interact.
        <br />
        🤑 We infused them together into an unique blend where creators can sell
        their Day-to-Day Posts & make a living out of.
      </>
    ),
  },
  {
    image: livestream,
    heading: 'Livestreaming',
    text: (
      <>
        🎮 Connect with your Audience & Stream live concerts, Gameplays &
        Metaverse Events.
        <br />
        💰 Mint NFTs from Livestreams so you can monetise your Best moments.
      </>
    ),
  },
  {
    image: tickets,
    heading: 'Events',
    text: (
      <>
        🎟️ Booking & Hosting Events has never been this easy. Book Token gated
        tickets for Local Events, Web3 Meetups - NFT Ticket will be added to
        your wallet.
        <br />
        🗓️ Host your Events & invite your audience with an easy to Go
        Experience.
      </>
    ),
  },
];

export default function CreateAccount() {
  const [userInfo, setUserInfo] = useState<any>({});
  const [usernameError, setUsernameError] = useState('');
  const userState = useContext(UserContext);
  const toastState = useContext(toastContext);
  const [walletAddress, setWalletAddress] = useState('');
  const walletProvider = useContext(walletProviderContext);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm({
    initialValues: {
      username: '',
      termsOfService: false,
    },

    validate: {
      username: (value) =>
        /^[a-zA-Z0-9._]+$/.test(value) ? null : 'Invalid username',
      termsOfService: (value) =>
        value ? null : 'Please accept terms and conditions.',
    },
  });

  async function getUserInfo() {
    const userInfo =
      walletProvider.chain === 'evm'
        ? await walletProvider.polygonProvider.getUserInfo()
        : await walletProvider.solanaProvider.getUserInfo();
    setUserInfo(userInfo);
    setWalletAddress(
      walletProvider.chain === 'evm'
        ? walletProvider.polygonProvider.provider.selectedAddress
        : walletProvider.solanaProvider.provider.selectedAddress
    );
  }

  async function checkUserName() {
    form.validate();
    !form.isValid('termsOfService') &&
      toastState.showToast([
        { message: 'Please accept terms and conditions.', kind: 'error' },
      ]);
    form.isValid() &&
      (await axios({
        method: 'post',
        url: `/api/user/check_availability`,
        data: {
          email: userInfo.email,
          username: form.values.username,
        },
      })
        .then((response: any) => {
          console.log(response);

          response.data.data.username === true &&
            setUsernameError('Username not availiable');
          response.data.data.username === false && setShowOnboarding(true);
        })
        .catch(async function (error) {
          console.log(error);
        }));
  }

  useEffect(() => {
    getUserInfo();
    console.log('render');
  }, []);

  return (
    <FullscreenContainer className='flex flex-col items-start justify-between max-w-lg mx-auto overflow-hidden sm:gap-6 sm:justify-start bg-vapormintBlack-300'>
      <div className='flex flex-col w-full gap-6 p-4 h-fit'>
        <div className='flex items-center justify-start gap-4 pt-9'>
          <Image
            className={`h-16 aspect-square rounded-full  object-fill `}
            src={userInfo.profileImage}
            alt='loginImage'
            width={64}
            height={64}
          />
          <div className='flex flex-col gap-2 '>
            <span className='text-xl font-black text-vapormintWhite-100'>
              Welcome to Mintflick {userInfo.name}
            </span>
            <span className='text-base font-semibold text-vapormintBlack-100'>
              {userInfo.email}
            </span>
          </div>
        </div>
        <Divider kind='center' size={1} />
        <div className='flex flex-col gap-3 '>
          <div className='flex items-center justify-between'>
            <span
              onClick={() =>
                toastState.showToast([{ message: 'hello', kind: 'success' }])
              }
              className='text-2xl font-black text-vapormintWhite-100'
            >
              {walletAddress?.slice(0, 8) + '...' + walletAddress?.slice(-6)}
            </span>
            <CopyToClipboard
              className='text-lg font-bold cursor-pointer text-vapormintSuccess-500'
              text={walletAddress}
            ></CopyToClipboard>
          </div>
          <span className='text-base font-medium text-vapormintBlack-100'>
            Some interesting text that could give a user a knowledge about
            crypto wallet.
          </span>
        </div>
        <Divider kind='center' size={1} />
        <TextInput
          onChange={(e) =>
            form.setValues({
              username: e.target.value,
            })
          }
          value={form.values.username}
          error={usernameError || form.errors.username}
          title={'username'}
          placeholder={'Pick a unique username'}
        />
        <CheckBox
          checked={form.values.termsOfService}
          onChange={() =>
            form.setFieldValue('termsOfService', !form.values.termsOfService)
          }
          text={'I accept terms and conditions'}
        />
      </div>
      <Button
        // handleClick={() => setShowOnboarding(true)}
        handleClick={() => checkUserName()}
        kind='success'
        type='outlined'
        size='base'
      >
        Next
      </Button>
      {showOnboarding && (
        <FullScreenOverlay
          animation='bottom'
          onClose={() => {
            setShowOnboarding(false);
            setStep(1);
          }}
        >
          <div className='flex flex-col w-full h-full bg-vapormintBlack-300'>
            {step === 4 ? (
              <div className='flex flex-col items-center justify-center flex-grow text-2xl font-bold text-vapormintWhite-100'>
                creating your account...
              </div>
            ) : (
              <div className='flex flex-col items-center justify-start flex-grow'>
                <div className='relative w-full mx-auto aspect-video '>
                  <Image
                    className={`w-full   h-full object-cover `}
                    src={SplashScreenData[step - 1].image}
                    alt='loginImage'
                    width={100}
                    height={100}
                  />
                  <span className='absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-vapormintBlack-300 '></span>
                </div>
                <div className='flex flex-col gap-4 px-8 py-6'>
                  <span className='text-3xl font-bold text-vapormintWhite-100'>
                    {SplashScreenData[step - 1].heading}
                  </span>
                  <span className='text-lg font-semibold text-vapormintWhite-100'>
                    {SplashScreenData[step - 1].text}
                  </span>
                </div>
              </div>
            )}
            <Button
              handleClick={() => {
                if (step === 4) {
                  setStep(1);
                } else {
                  setStep(step + 1);
                }
              }}
              kind='success'
              type={step === 3 ? 'solid' : 'outlined'}
              size='base'
            >
              {step === 3 ? 'Create account' : 'Next'}
            </Button>
          </div>
        </FullScreenOverlay>
      )}
    </FullscreenContainer>
  );
}
