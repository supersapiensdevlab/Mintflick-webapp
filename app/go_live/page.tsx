'use client';
import Avatar from '@/components/molecules/Avatar';
import Button from '@/components/molecules/Button';
import CopyToClipboard from '@/components/molecules/CopyButton';
import Divider from '@/components/molecules/Divider';
import FullScreenOverlay from '@/components/molecules/FullScreenOverlay';
import FullscreenContainer from '@/components/molecules/FullscreenContainer';
import Header from '@/components/molecules/Header';
import ImageInput from '@/components/molecules/ImageInput';
import Modal from '@/components/molecules/Modal';
import TextInput from '@/components/molecules/TextInput';
import TextareaInput from '@/components/molecules/TextareaInput';
import { UserContext } from '@/contexts/userContext';
import Image from 'next/image';
import React, { useContext, useState } from 'react';

type Props = {};

export default function page({}: Props) {
  const userState = useContext(UserContext);
  const [uploadBanner, setUploadBanner] = useState(false);
  const [banner, setBanner] = useState(null);
  const [bannerLink, setBannerLink] = useState('');

  const [scheduleStreamOpen, setScheduleStreamOpen] = useState(false);
  const [scheduleStreamDate, setScheduleStreamDate] = useState('');

  const [updatingThumbnail, setUpdatingThumbnail] = useState(false);
  const [updatingThumbnailOpen, setUpdatingThumbnailOpen] = useState(false);

  const [thumbnail, setThumbnail] = useState(null);

  const [updatingDetailsOpen, setUpdatingDetailsOpen] = useState(true);

  return (
    <FullscreenContainer className='select-none  border-x-[1px] border-vapormintBlack-200/60 relative flex flex-col items-start max-w-lg pt-14 mx-auto overflow-hidden bg-vapormintBlack-300'>
      <Header text='Back' />
      <div className='w-full h-full overflow-y-scroll scrollbar-none'>
        <div className='flex flex-col items-start w-full'>
          {userState.userData.cover_image ? (
            <Image
              className={`w-full object-cover aspect-video `}
              src={userState.userData.cover_image}
              alt='coverImage'
              width={100}
              height={100}
            />
          ) : (
            <div
              className={`  bg-vapormintBlack-200 animate-pulse w-full  aspect-video  `}
            />
          )}
          <div
            onClick={() => setUpdatingThumbnailOpen((prev) => !prev)}
            className='flex items-center w-full gap-2 px-4 py-3 cursor-pointer text-vapormintWarning-500'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-4 h-4'
            >
              <path d='M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z' />
            </svg>
            <h1 className='text-base font-semibold '>Update Thumbnail</h1>
          </div>
          {updatingThumbnailOpen && (
            <>
              <div className='w-full gap-2 px-4 pt-2 '>
                <ImageInput
                  compression={1}
                  setImage={setThumbnail}
                  label='Select thumbnail for stream'
                  aspect={16 / 9}
                />
                <Button
                  kind='success'
                  size='small'
                  type='ghost'
                  handleClick={() => {}}
                >
                  Update Thumbnail
                </Button>
              </div>{' '}
              <Divider kind='left-right' size={1} />
            </>
          )}
          {scheduleStreamOpen && (
            <>
              <Divider kind='left-right' size={1} />
              <div className='w-full gap-2 px-4 pt-2 '>
                <TextInput
                  title={'Stream start time'}
                  type={'datetime-local'}
                  onChange={(e) => {
                    setScheduleStreamDate(e.target.value);
                  }}
                  value={scheduleStreamDate}
                />{' '}
                <Button
                  kind='success'
                  size='small'
                  type='ghost'
                  handleClick={() => {}}
                >
                  Schedule Stream
                </Button>
              </div>
            </>
          )}
          <div className='flex items-center gap-1 mx-4'>
            <div
              onClick={() => setScheduleStreamOpen((prev) => !prev)}
              className='flex gap-1 items-center cursor-pointer  py-1 px-2 text-xs font-semibold rounded-full border-[1px] border-vapormintBlack-200 text-vapormintSuccess-500  '
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-4 h-4 '
              >
                <path d='M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z' />
                <path
                  fillRule='evenodd'
                  d='M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z'
                  clipRule='evenodd'
                />
              </svg>
              Schedule upcoming stream
            </div>
            <div className='py-1 px-2 text-xs font-semibold rounded-full border-[1px] border-vapormintBlack-200 text-vapormintWhite-100'>
              Offline
            </div>
          </div>
          <Divider kind='solid' size={1} />
          {uploadBanner && (
            <div
              className='w-full px-4 py-3 space-y-2'
              // onClick={() => setUploadBanner(false)}
            >
              <ImageInput
                label='Select Banner Image'
                setImage={setBanner}
                compression={1}
                aspect={16 / 9}
              ></ImageInput>
              <TextInput
                title={'Link'}
                placeholder={'Redirect link'}
                onChange={(e) => setBannerLink(e.target.value)}
                value={bannerLink}
              />
              <Button
                kind='success'
                size='small'
                type='ghost'
                handleClick={() => {
                  setUploadBanner(false);
                }}
              >
                Upload Banner
              </Button>
            </div>
          )}
          {!uploadBanner && (
            <div
              onClick={() => setUploadBanner(true)}
              className='flex items-center justify-center w-full gap-2 px-4 py-3 cursor-pointer text-vapormintSuccess-500'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-6 h-6'
              >
                <path
                  fillRule='evenodd'
                  d='M12 5.25a.75.75 0 01.75.75v5.25H18a.75.75 0 010 1.5h-5.25V18a.75.75 0 01-1.5 0v-5.25H6a.75.75 0 010-1.5h5.25V6a.75.75 0 01.75-.75z'
                  clipRule='evenodd'
                />
              </svg>

              <h1 className='text-base font-semibold '>Add Banner</h1>
            </div>
          )}
          {/* stream details */}
          {updatingDetailsOpen && (
            <FullScreenOverlay
              title={'Edit Stream Details'}
              animation='bottom'
              onClose={() => {
                setUpdatingDetailsOpen(false);
              }}
            >
              <div className='flex flex-col w-full h-full px-4 bg-vapormintBlack-300'>
                <TextInput
                  title={'title'}
                  placeholder={'Stream title'}
                  onChange={(e) => setBannerLink(e.target.value)}
                  value={bannerLink}
                />{' '}
                <TextareaInput
                  title={'Description'}
                  placeholder={'Stream description'}
                  onChange={(e) => setBannerLink(e.target.value)}
                  value={bannerLink}
                />{' '}
                <Button
                  handleClick={() => {}}
                  kind='success'
                  type={'solid'}
                  size='base'
                >
                  Update
                </Button>
              </div>
            </FullScreenOverlay>
          )}
          <div className='flex items-start w-full gap-2 px-4 py-3'>
            <h1 className='flex-grow text-xl font-bold text-vapormintWhite-100'>
              Livestream title
            </h1>
            <div
              onClick={() => {
                setUpdatingDetailsOpen(true);
              }}
              className='p-1 text-sm font-semibold cursor-pointer text-vapormintError-300'
            >
              Edit
            </div>
          </div>
        </div>
        <Divider kind='solid' size={1} />
        <div className='flex flex-col gap-2 px-4 py-2 text-vapormintWhite-100'>
          <div className='flex items-start justify-between w-full gap-2'>
            <span className='text-base font-semibold '>Description</span>
            <div
              onClick={() => {
                setUpdatingDetailsOpen(true);
              }}
              className='p-1 text-sm font-semibold cursor-pointer text-vapormintError-300'
            >
              Edit
            </div>
          </div>
          <span className='text-base font-light '>
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
            sint. Velit officia consequat duis enim velit mollit. Exercitation
            veniam consequat sunt nostrud amet.{' '}
          </span>
        </div>{' '}
        <Divider kind='solid' size={1} />{' '}
        <div className='flex flex-col gap-2 px-4 py-2 text-vapormintWhite-100'>
          <span className='text-base font-semibold '>Livestream Details</span>
          <div className='flex items-center justify-start w-full gap-2 px-4 '>
            <h1 className='text-base font-medium text-vapormintBlack-200 '>
              Name
            </h1>{' '}
            <h1 className='text-base font-bold text-vapormintWhite-300 '>
              users name
            </h1>
          </div>
          <div className='flex items-center justify-start w-full gap-2 px-4 '>
            <h1 className='text-base font-medium text-vapormintBlack-200 '>
              Username
            </h1>{' '}
            <h1 className='text-base font-bold text-vapormintWhite-300 '>
              username
            </h1>
          </div>
          <div className='flex items-center justify-start w-full gap-2 px-4 '>
            <h1 className='text-base font-medium text-vapormintBlack-200 '>
              RTMP url
            </h1>{' '}
            <h1 className='text-base font-bold text-vapormintWhite-300 '>
              url.com
            </h1>
            <CopyToClipboard
              className='text-sm font-semibold cursor-pointer text-vapormintSuccess-500'
              text={'1234'}
            ></CopyToClipboard>
          </div>
          <div className='flex items-center justify-start w-full gap-2 px-4 '>
            <h1 className='text-base font-medium text-vapormintBlack-200 '>
              Streamer Key
            </h1>{' '}
            <h1 className='text-base font-bold text-vapormintWhite-300 '>
              url.com
            </h1>
            <CopyToClipboard
              className='text-sm font-semibold cursor-pointer text-vapormintSuccess-500'
              text={'1234'}
            ></CopyToClipboard>
          </div>
          <div className='flex items-center justify-start w-full gap-2 px-4 '>
            <h1 className='text-base font-medium text-vapormintBlack-200 '>
              Playback URL
            </h1>{' '}
            <h1 className='text-base font-bold text-vapormintWhite-300 '>
              url.com
            </h1>
            <CopyToClipboard
              className='text-sm font-semibold cursor-pointer text-vapormintSuccess-500'
              text={'1234'}
            ></CopyToClipboard>
          </div>
          <div className='flex items-center justify-start w-full gap-2 px-4 '>
            <h1 className='text-base font-medium text-vapormintBlack-200 '>
              Live URL{' '}
              <span className='text-xs text-vapormintBlack-100'>
                Share this with viwers.
              </span>
            </h1>{' '}
            <h1 className='text-base font-bold text-vapormintWhite-300 '>
              url.com
            </h1>
            <CopyToClipboard
              className='text-sm font-semibold cursor-pointer text-vapormintSuccess-500'
              text={'1234'}
            ></CopyToClipboard>
          </div>
        </div>
      </div>
    </FullscreenContainer>
  );
}
