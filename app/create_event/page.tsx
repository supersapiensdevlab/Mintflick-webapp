'use client';
import FullscreenContainer from '@/components/molecules/FullscreenContainer';
import Header from '@/components/molecules/Header';
import Image from 'next/image';
import React, { useContext, useState } from 'react';
import { UserContext } from '@/contexts/userContext';
import TextInput from '@/components/molecules/TextInput';
import TextareaInput from '@/components/molecules/TextareaInput';
import Button from '@/components/molecules/Button';
import Switch from '@/components/molecules/Switch';
import Radio from '@/components/molecules/Radio';
import SelectInput from '@/components/molecules/SelectInput';
import AutoComplete from '@/components/molecules/AutoComplete';
import ImageInput from '@/components/molecules/ImageInput';
import Avatar from '@/components/molecules/Avatar';
import Tick from '@/components/molecules/Tick';
import social from '@/public/social.webp';
import LoadingSpinner from '@/components/molecules/LoadingSpinner';
import FullScreenOverlay from '@/components/molecules/FullScreenOverlay';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';

const timezones = [
  {
    id: 0,
    name: 'Baker Island, Howland Island',
  },
  {
    id: 1,
    name: 'Samoa, Midway Atoll',
  },
  {
    id: 2,
    name: 'Hawaii, Aleutian Islands',
  },
  {
    id: 3,
    name: 'Alaska',
  },
  {
    id: 4,
    name: 'Pacific Time (US and Canada)',
  },
  {
    id: 5,
    name: 'Mountain Time (US and Canada)',
  },
  {
    id: 6,
    name: 'Central Time (US and Canada), Mexico City',
  },
  {
    id: 7,
    name: 'Eastern Time (US and Canada), Bogota, Lima',
  },
  {
    id: 8,
    name: 'Atlantic Time (Canada), Caracas, La Paz',
  },
  {
    id: 9,
    name: 'Newfoundland',
  },
  {
    id: 10,
    name: 'Brasilia, Buenos Aires, Greenland',
  },
  {
    id: 11,
    name: 'Mid-Atlantic',
  },
  {
    id: 12,
    name: 'Azores, Cape Verde Islands',
  },
  {
    id: 13,
    name: 'Western Europe Time, London, Lisbon, Casablanca',
  },
  {
    id: 14,
    name: 'Central European Time, Brussels, Copenhagen, Madrid',
  },
  {
    id: 15,
    name: 'Eastern European Time, Athens, Istanbul, Jerusalem',
  },
  {
    id: 16,
    name: 'Moscow, Baghdad, Nairobi',
  },
  {
    id: 17,
    name: 'Tehran',
  },
  {
    id: 18,
    name: 'Abu Dhabi, Muscat, Baku, Tbilisi',
  },
  {
    id: 19,
    name: 'Kabul',
  },
  {
    id: 20,
    name: 'Islamabad, Karachi, Yekaterinburg',
  },
  {
    id: 21,
    name: 'New Delhi, Mumbai, Kolkata',
  },
  {
    id: 22,
    name: 'Kathmandu',
  },
  {
    id: 0,
    name: 'Almaty, Dhaka, Novosibirsk',
  },
  {
    id: 23,
    name: 'Yangon',
  },
  {
    id: 24,
    name: 'Bangkok, Hanoi, Jakarta',
  },
  {
    id: 25,
    name: 'Beijing, Perth, Singapore, Taipei',
  },
  {
    id: 26,
    name: 'Eucla',
  },
  {
    id: 27,
    name: 'Tokyo, Seoul, Yakutsk',
  },
  {
    id: 28,
    name: 'Adelaide, Darwin',
  },
  {
    id: 29,
    name: 'Eastern Australia, Guam, Vladivostok',
  },
  {
    id: 30,
    name: 'Lord Howe Island',
  },
  {
    id: 31,
    name: 'Magadan, Solomon Islands, Vanuatu',
  },
  {
    id: 32,
    name: 'Norfolk Island',
  },
  {
    id: 33,
    name: 'Auckland, Fiji, Kamchatka',
  },
  {
    id: 34,
    name: 'Chatham Islands',
  },
  {
    id: 35,
    name: 'Samoa, Tonga',
  },
  {
    id: 36,
    name: 'Kiritimati',
  },
];

function Preview({ image, src, userName, eventName, description }: any) {
  return (
    <div className='w-full px-4 space-y-2 select-none '>
      <span className='w-full text-2xl font-bold text-vapormintWhite-100'>
        Preview
      </span>
      <div className='flex items-end w-full gap-2'>
        <Image
          className={`w-full    h-full object-cover rounded-lg border-[0.5px] border-vapormintBlack-200`}
          src={image}
          alt='loginImage'
          width={100}
          height={100}
        />
        {/* <div className='flex flex-col items-center justify-end gap-3 w-fit'>
          <div className='flex flex-col items-center gap-[2px]'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='w-6 h-6 text-vapormintBlack-100'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z'
              />
            </svg>

            <span className='text-xs font-semibold text-vapormintWhite-300'>
              999K
            </span>
          </div>

          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-6 h-6 text-vapormintBlack-100'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z'
            />
          </svg>

          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-6 h-6 text-vapormintBlack-100'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z'
            />
          </svg>
        </div> */}
      </div>
      <div className='flex items-center gap-1'>
        <Avatar kind='luxury' size='md' src={src} />
        <div className='flex flex-col gap-[1px]'>
          <div className='flex items-center gap-1'>
            <span className='text-sm font-semibold cursor-pointer text-vapormintWhite-100'>
              {userName}
            </span>
            <Tick />
          </div>
          <span className='text-sm font-semibold text-vapormintLuxury-300'>
            Live Now
          </span>
        </div>
      </div>
      <div className='flex flex-col flex-grow gap-1'>
        <div className='flex items-center gap-1'>
          <div className='  py-1 px-2 text-xs font-semibold rounded-full border-[1px] border-vapormintBlack-200 text-vapormintSuccess-500  '>
            free
          </div>
          <div className='py-1 px-2 text-xs font-semibold rounded-full border-[1px] border-vapormintBlack-200 text-vapormintWhite-100'>
            Online
          </div>
          <div className='py-1 px-2 text-xs font-semibold rounded-full border-[1px] border-vapormintBlack-200 text-vapormintWhite-100'>
            Meetup
          </div>
        </div>
        <span className='text-lg font-bold text-vapormintWhite-200'>
          {eventName}
        </span>
        <p className='text-base font-medium text-vapormintBlack-100'>
          {description}
        </p>
      </div>
    </div>
  );
}

type Props = {};

export default function page({}: Props) {
  const userState = useContext(UserContext);
  const router = useRouter();
  const [step, setStep] = useState(1);
  //step 1 inputs
  const form1 = useForm({
    initialValues: {
      eventName: '',
      type: '',
      category: '',
      isFreeEvent: false,
      ticketPrice: '',
      totalTickets: '',
    },
    validate: {
      eventName: (value) =>
        value.length === 0 ? 'Please enter event name' : null,
      type: (value) => (value.length < 2 ? 'Last name is too short' : null),
      category: (value) =>
        value.length === 0 ? 'Please select category' : null,
      ticketPrice: (value) =>
        value.length === 0 ? 'Please select category' : null,
      totalTickets: (value) =>
        value.length === 0 ? 'Please select category' : null,
    },
  });
  const [eventName, setEventName] = useState('');
  const [type, setType] = useState('Online');
  const [category, setCategory] = useState('');
  const [isFreeEvent, setisFreeEvent] = useState(false);
  const [ticketPrice, setticketPrice] = useState('');
  const [totalTickets, settotalTickets] = useState('');

  //validation for step 1
  // const validateStep1 = () => {
  //   eventName === '';
  // };

  //step 2 inputs
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timezone, setTimezone] = useState('');
  const [ticketImage, setTicketImage] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  //step 3 inputs
  const [eventLink, seteventLink] = useState('');
  const [location, setlocation] = useState('');
  const [socialLinks, setsocialLinks] = useState<any>({});

  const [success, setSuccess] = useState(false);

  return (
    <FullscreenContainer className='select-none border-x-[1px] border-vapormintBlack-200/60 relative flex flex-col items-start max-w-lg pt-[58px] mx-auto overflow-hidden bg-vapormintBlack-300'>
      <Header title='New Event' />
      <div className='w-full h-full overflow-y-scroll scrollbar-none'>
        <div className='w-full p-4 text-lg font-bold bg-vapormintSuccess-500 text-vapormintWhite-100'>
          Step {step} of 5
        </div>
        {step !== 1 && (
          <div
            onClick={() => setStep((prev) => prev - 1)}
            className='flex items-center gap-2 px-3 py-4 text-base font-semibold cursor-pointer'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='w-6 h-6 text-vapormintWhite-100'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 19.5L8.25 12l7.5-7.5'
              />
            </svg>
            Previous Step
          </div>
        )}
        {step === 1 && (
          <div className='flex flex-col w-full gap-3 p-4'>
            <TextInput
              title={'Event Name'}
              placeholder={'Type here'}
              onChange={(e) => {
                setEventName(e.target.value);
              }}
              value={form1.values.eventName}
              count={32}
              error={form1.errors.eventName}
            />
            <Radio
              flex='row'
              options={[
                { color: 'success', option: 'Online' },
                { color: 'success', option: 'Inperson' },
              ]}
              onChange={setType}
              value={type}
            />
            <SelectInput
              title={'Category'}
              options={['Party', 'Meetup']}
              setValue={setCategory}
              value={category}
              placeholder={'Select Category of event'}
            />

            <div
              onClick={() => setisFreeEvent((prev) => !prev)}
              className='flex items-center gap-2 text-lg font-bold text-vapormintSuccess-500'
            >
              <Switch kind='success' on={isFreeEvent} onChange={() => {}} />{' '}
              Free Event
            </div>
            {!isFreeEvent && (
              <TextInput
                type='number'
                title={'Ticket price'}
                placeholder={'Type here'}
                onChange={(e) => {
                  setticketPrice(e.target.value);
                }}
                value={ticketPrice}
              />
            )}
            <TextInput
              type='number'
              title={'Ticket Count'}
              placeholder={'Type here'}
              onChange={(e) => {
                settotalTickets(e.target.value);
              }}
              value={totalTickets}
            />

            <Button
              handleClick={() => {
                setStep(2);
                form1.validate();
              }}
              kind='white'
              size='base'
              type='solid'
            >
              Next
            </Button>
          </div>
        )}
        {step === 2 && (
          <div className='flex flex-col w-full gap-3 p-4'>
            <TextareaInput
              type='number'
              title={'Description'}
              placeholder={'Description of event'}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              value={description}
            />
            <TextInput
              title={'Event start time'}
              type={'datetime-local'}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
              value={startDate}
            />{' '}
            <TextInput
              title={'Event end time'}
              type={'datetime-local'}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
              value={endDate}
            />
            <AutoComplete
              title={'Timezone'}
              placeholder='Select timezone'
              dark={true}
              setValue={setTimezone}
              showIcon={false}
              items={timezones}
            />
            <ImageInput
              compression={1}
              setImage={setTicketImage}
              label='Select ticket image'
              aspect={16 / 9}
            />
            <ImageInput
              compression={1}
              setImage={setThumbnail}
              label='Select thumbnail for event'
              aspect={16 / 9}
            />
            <Button
              handleClick={() => {
                setStep(3);
              }}
              kind='white'
              size='base'
              type='solid'
            >
              Next
            </Button>
          </div>
        )}
        {step === 3 && (
          <div className='flex flex-col w-full gap-3 p-4'>
            {type === 'Online' ? (
              <TextInput
                title={'Event Link'}
                placeholder={'Google meet,Zoom,Discord etc.'}
                onChange={(e) => {
                  seteventLink(e.target.value);
                }}
                value={eventLink}
              />
            ) : (
              <TextareaInput
                title={'Google maps link'}
                placeholder={
                  'Enter your events location link (Google map link)'
                }
                onChange={(e) => {
                  setlocation(e.target.value);
                }}
                value={location}
              />
            )}
            <div className='w-full mt-2 form-control'>
              <label className='mb-2 text-xs font-semibold tracking-widest uppercase text-vapormintWhite-100'>
                Social links{' '}
                <span className='text-xs font-semibold tracking-widest uppercase text-vapormintBlack-200'>
                  optional
                </span>
              </label>
              <div className='flex items-center gap-2 py-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='    text-[#00acee]'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                  <path d='M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z'></path>
                </svg>

                <input
                  type='text'
                  className='flex-grow text-base font-medium tracking-wider h-fit focus:outline-none bg-vapormintBlack-300'
                  placeholder={'Twitter'}
                  onChange={(e) => {
                    socialLinks.twitter = e.target.value;
                  }}
                  // value={socialLinks.twitter}
                />
              </div>
              <div className='flex items-center gap-2 py-2'>
                {/* <BrandInstagram
                  size={16}
                  className='translate-x-2 text-[#bc2a8d]'
                /> */}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='  text-[#bc2a8d]'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                  <path d='M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z'></path>
                  <path d='M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0'></path>
                  <path d='M16.5 7.5l0 .01'></path>
                </svg>
                <input
                  type='text'
                  className='flex-grow text-base font-medium tracking-wider h-fit focus:outline-none bg-vapormintBlack-300'
                  placeholder={'Instagram'}
                  onChange={(e) => {
                    socialLinks.instagram = e.target.value;
                  }}
                  // value={socialLinks.instagram}
                />
              </div>
              <div className='flex items-center gap-2 py-2'>
                {/* <BrandLinkedin
                  size={16}
                  className='translate-x-2 text-[#0A66C2]'
                /> */}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-[#0A66C2]'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                  <path d='M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z'></path>
                  <path d='M8 11l0 5'></path>
                  <path d='M8 8l0 .01'></path>
                  <path d='M12 16l0 -5'></path>
                  <path d='M16 16v-3a2 2 0 0 0 -4 0'></path>
                </svg>
                <input
                  type='text'
                  className='flex-grow text-base font-medium tracking-wider h-fit focus:outline-none bg-vapormintBlack-300'
                  placeholder={'LinkedIn'}
                  onChange={(e) => {
                    socialLinks.linkedin = e.target.value;
                  }}
                  // value={socialLinks.instagram}
                />
              </div>
              <div className='flex items-center gap-2 py-2'>
                {/* <ExternalLink size={16} className='translate-x-2 text-brand2' /> */}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-vapormintWhite-200'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
                  <path d='M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0'></path>
                  <path d='M3.6 9h16.8'></path>
                  <path d='M3.6 15h16.8'></path>
                  <path d='M11.5 3a17 17 0 0 0 0 18'></path>
                  <path d='M12.5 3a17 17 0 0 1 0 18'></path>
                </svg>
                <input
                  type='text'
                  className='flex-grow text-base font-medium tracking-wider h-fit focus:outline-none bg-vapormintBlack-300'
                  placeholder={'Website link'}
                  onChange={(e) => {
                    socialLinks.website = e.target.value;
                    console.log(socialLinks);
                  }}
                  // value={socialLinks.instagram}
                />
              </div>
            </div>
            <Button
              handleClick={() => {
                setStep(4);
              }}
              kind='white'
              size='base'
              type='solid'
            >
              Next
            </Button>
          </div>
        )}
        {step === 4 && (
          <div className='flex flex-col w-full gap-3 p-4 '>
            <Preview
              image={thumbnail && URL.createObjectURL(thumbnail)}
              src={userState.userData.profile_image}
              userName={userState.userData.username}
              eventName={eventName}
              description={description}
            />
            <Button
              handleClick={() => {
                setStep(5);
                setSuccess(true);
              }}
              kind='success'
              size='base'
              type='solid'
            >
              Publish Event
            </Button>
          </div>
        )}
        {step === 5 && (
          <div className='flex flex-col items-start justify-center w-full gap-3 p-4 '>
            <div className='flex items-center gap-2 p-2'>
              <LoadingSpinner />
              <span className='text-lg font-bold text-vapormintWhite-100'>
                Uploading files to web 3
              </span>
            </div>
            <span className='w-[2px] h-4 ml-5 bg-vapormintWhite-300 rounded-full' />
            <div className='flex items-center gap-2 p-2'>
              <LoadingSpinner />
              <span className='text-lg font-bold text-vapormintWhite-100'>
                Creating Event
              </span>
            </div>{' '}
            <span className='w-[2px] h-4 ml-5 bg-vapormintWhite-300 rounded-full' />
            <div className='flex items-center gap-2 p-2'>
              <LoadingSpinner />
              <span className='text-lg font-bold text-vapormintWhite-100'>
                Signing Transaction
              </span>
            </div>{' '}
            <span className='w-[2px] h-4 ml-5 bg-vapormintWhite-300 rounded-full' />
            <div className='flex items-center gap-2 p-2'>
              <LoadingSpinner />
              <span className='text-lg font-bold text-vapormintWhite-100'>
                Creating Ticket Counter{' '}
              </span>
            </div>{' '}
            <span className='w-[2px] h-4 ml-5 bg-vapormintWhite-300 rounded-full' />
            <div className='flex items-center gap-2 p-2'>
              <LoadingSpinner />
              <span className='text-lg font-bold text-vapormintWhite-100'>
                Signing transaction{' '}
              </span>
            </div>{' '}
          </div>
        )}
        {success && (
          <FullScreenOverlay
            animation='bottom'
            onClose={() => {
              setSuccess((prev) => !prev);
            }}
          >
            <div className='flex flex-col items-center justify-center flex-grow text-2xl font-bold text-vapormintWhite-100'>
              Event Created Succesfully!
            </div>
            <Button
              handleClick={() => {
                router.push('/events');
              }}
              kind='success'
              size='base'
              type='solid'
            >
              Done
            </Button>{' '}
          </FullScreenOverlay>
        )}
      </div>
    </FullscreenContainer>
  );
}
