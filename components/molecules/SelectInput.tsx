'use client';
import React, { useState } from 'react';

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  title?: String;
  error?: String;
  setValue: Function;
  value: String;
  options: string[];
  placeholder?: String;
  optional?: boolean;
};

function SelectInput(props: Props) {
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div className='relative flex flex-col items-start justify-start w-full gap-1 py-1'>
      {props.title && (
        <span className='text-xs font-semibold tracking-widest uppercase text-vapormintWhite-100'>
          {props.title}{' '}
          {props.optional && (
            <span className='text-xs font-semibold tracking-widest uppercase text-vapormintBlack-200'>
              optional
            </span>
          )}
        </span>
      )}
      <div
        className={`w-full h-12 flex items-center justify-between border-b rounded-none  bg-vapormintBlack-300   ${
          props.error
            ? 'border-vapormintError-500'
            : 'border-vapormintBlack-200 focus:border-vapormintWhite-100'
        }  focus:outline-none `}
        onClick={() => setShowOptions((prev) => !prev)}
      >
        {props.value !== '' && (
          <span className='text-base text-vapormintWhite-100'>
            {props.value}
          </span>
        )}
        {props.value === '' && (
          <span className='text-base text-vapormintWhite-300'>
            {props.placeholder}
          </span>
        )}
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className={`w-6 h-6 text-vapormintWhite-100 ${
            showOptions ? 'rotate-180' : 'rotate-0'
          } transition ease-in-out duration-500`}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M19.5 8.25l-7.5 7.5-7.5-7.5'
          />
        </svg>
      </div>
      <div className='flex items-center justify-between w-full'>
        {props.error && (
          <span className='text-sm tracking-wider text-vapormintError-500 '>
            {props.error}
          </span>
        )}
      </div>
      {showOptions && (
        <div
          className={`absolute bottom-0 left-0 translate-y-full  w-full rounded-md scrollbar-none   shadow-lg bg-slate-100/20 backdrop-blur-md text-brand1 text-base font-medium z-[9999] flex flex-col h-40 overflow-auto`}
        >
          {props.options.map((x, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  props.setValue(x);
                  setShowOptions(false);
                }}
                className='w-full px-4 py-2 cursor-pointer text-brand1 hover:bg-slate-100/20 hover:backdrop-blur-md'
              >
                {x}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SelectInput;
