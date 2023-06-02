'use client';
import Button from '@/components/molecules/Button';
import FullscreenContainer from '@/components/molecules/FullscreenContainer';
import Header from '@/components/molecules/Header';
import ImageInput from '@/components/molecules/ImageInput';
import TextareaInput from '@/components/molecules/TextareaInput';
import VideoInput from '@/components/molecules/VideoInput';
import { useContext, useState } from 'react';
import PollInput from './PollInput';
import axios from 'axios';
import CustomInput from '@/components/molecules/CustomInput';
import { UserContext } from '@/contexts/userContext';
import FullScreenOverlay from '@/components/molecules/FullScreenOverlay';

type Props = {};

export default function page({}: Props) {
  const [activeTab, setActiveTab] = useState(1);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [tagged, setTagged] = useState([]);
  const [uploadingPost, setUploadingPost] = useState(false);

  const userState: any = useContext(UserContext);

  async function uploadPost() {
    setUploadingPost(true);
    const data = {
      announcement: description,
      tagged: tagged,
    };
    axios
      .post(`/api/user/announcement`, data, {
        headers: {
          'content-type': 'application/json',
          'auth-token': JSON.stringify(localStorage.getItem('authtoken')),
        },
      })
      .then(async () => {
        clearData();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const clearData = () => {
    setDescription('');
    setImage(null);
    setVideo(null);
  };

  return (
    <FullscreenContainer className='select-none  border-x-[1px] border-vapormintBlack-200/60 relative flex flex-col items-start max-w-lg pt-14 mx-auto overflow-hidden bg-vapormintBlack-300'>
      <Header text='Back' />
      <div className='flex items-center justify-between w-full border-b-[1px] border-b-vapormintBlack-200'>
        <div
          onClick={() => setActiveTab(1)}
          className={`flex flex-col items-center gap-1 px-2 w-1/2 justify-center py-4 text-base font-bold ${
            activeTab === 1
              ? 'text-vapormintMint-300'
              : 'text-vapormintWhite-200'
          }`}
        >
          Post
        </div>
        <div
          onClick={() => setActiveTab(2)}
          className={`flex flex-col items-center gap-1 px-2 w-1/2 justify-center py-4 text-base font-bold ${
            activeTab === 2
              ? 'text-vapormintMint-300'
              : 'text-vapormintWhite-200'
          }`}
        >
          Poll
        </div>
      </div>{' '}
      <div
        style={{ height: `1px` }}
        className={`  w-1/2 from-vapormintBlack-300 via-vapormintMint-300 to-vapormintBlack-300  bg-gradient-to-r transition-all ease-in-out  ${
          activeTab === 1 ? 'translate-x-0' : 'translate-x-full'
        }`}
      />
      {activeTab === 1 && (
        <div className='flex flex-col flex-grow w-full gap-2 p-4 overflow-y-auto scrollbar-none'>
          <CustomInput
            placeholder={'Whats on your mind!'}
            className={`w-full h-20 text-base border-b rounded-none text-vapormintWhite-100 bg-vapormintBlack-300 hover:resize-y scrollbar scrollbar-thumb-gray-900 scrollbar-track-black focus:outline-none `}
            value={description}
            setValue={setDescription}
            mentions={tagged}
            setMentions={setTagged}
          />
          {!video && (
            <ImageInput
              compression={1}
              setImage={setImage}
              label='Attach image'
              aspect={1}
            />
          )}
          {!image && (
            <VideoInput
              label={'Attach Video'}
              selectedVideo={video}
              setSelectedVideo={setVideo}
            />
          )}
        </div>
      )}
      {activeTab === 2 && (
        <div className='flex-grow w-full overflow-y-auto scrollbar-none'>
          <PollInput
            options={options}
            question={question}
            setOptions={setOptions}
            setQuestion={setQuestion}
          />
        </div>
      )}
      <Button
        handleClick={() => description && uploadPost()}
        kind='mint'
        size='small'
        type='solid'
      >
        {activeTab === 1 ? 'Flick Post' : 'Take Poll'}
      </Button>
      {uploadingPost && (
        <FullScreenOverlay
          animation='bottom'
          onClose={() => {
            setUploadingPost(false);
          }}
        >
          <div className='flex flex-col w-full h-full bg-vapormintBlack-300'>
            <div className='flex flex-col items-center justify-center flex-grow text-2xl font-bold text-vapormintWhite-100'>
              Uploading Post
            </div>
          </div>
        </FullScreenOverlay>
      )}
    </FullscreenContainer>
  );
}
