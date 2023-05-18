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

type Props = {};

export default function page({}: Props) {
  const userState = useContext(UserContext);
  const [step, setStep] = useState(1);
  //step 1 inputs
  const [eventName, setEventName] = useState('');
  const [type, settype] = useState('Online');
  const [Category, setCategory] = useState('');
  const [isFreeEvent, setisFreeEvent] = useState(false);

  //step 2 inputs
  const [description, setDescription] = useState('');
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timezone, setTimezone] = useState('');

  const [ticketPrice, setticketPrice] = useState('');
  const [totalTickets, settotalTickets] = useState('');

  return (
    <FullscreenContainer className='select-none border-x-[1px] border-vapormintBlack-200/60 relative flex flex-col items-start max-w-lg pt-[58px] mx-auto overflow-hidden bg-vapormintBlack-300'>
      <Header title='New Event' />
      <div className='w-full h-full overflow-y-scroll snap-y scrollbar-none'>
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
              value={eventName}
              count={32}
            />
            <Radio
              flex='row'
              options={[
                { color: 'success', option: 'Online' },
                { color: 'success', option: 'Inperson' },
              ]}
              onChange={settype}
              value={type}
            />
            <SelectInput
              title={'Category'}
              options={['Party', 'Meetup']}
              setValue={setCategory}
              value={Category}
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

            <Button
              handleClick={() => {
                setStep(2);
              }}
              kind='white'
              size='base'
              type='solid'
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </FullscreenContainer>
  );
}
